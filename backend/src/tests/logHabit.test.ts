import jwt from "jsonwebtoken";
import request from "supertest";
import type { Express } from "express";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import prisma from "../lib/prisma";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "test-gemini-key";

let app: Express;
let userId: string;
let token: string;

const todayUtc = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

const clearDatabase = async () => {
    await prisma.habitLog.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.moodLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.timeOfDay.deleteMany();
};

const createTestUser = async () => {
    const user = await prisma.user.create({
        data: {
            email: `log-habit-${Date.now()}@example.com`,
            name: "Log Habit Test User",
            password: "hashed-password",
        },
    });

    userId = user.id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string);
};

const createHabit = async (overrides = {}) => {
    return prisma.habit.create({
        data: {
            name: "Read",
            unitType: "times",
            unitValue: 3,
            frequency: "daily",
            userId,
            ...overrides,
        },
    });
};

describe("POST /api/habit/logHabit/:id", () => {
    beforeAll(async () => {
        app = (await import("../app")).app;
    });

    beforeEach(async () => {
        await clearDatabase();
        await createTestUser();
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    it("increments a times habit and creates a pending log", async () => {
        const habit = await createHabit({ unitValue: 3, currentValue: 0, totalValue: 0 });

        const response = await request(app)
            .post(`/api/habit/logHabit/${habit.id}`)
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Habit logged successfully");
        expect(response.body.addValue).toMatchObject({
            id: habit.id,
            currentValue: 1,
            totalValue: 1,
        });
        expect(response.body.loggedhabit).toMatchObject({
            habitId: habit.id,
            status: "pending",
            totalValue: 1,
        });

        const updatedHabit = await prisma.habit.findUnique({ where: { id: habit.id } });
        const log = await prisma.habitLog.findUnique({
            where: { habitId_date: { habitId: habit.id, date: todayUtc() } },
        });

        expect(updatedHabit?.currentValue).toBe(1);
        expect(updatedHabit?.totalValue).toBe(1);
        expect(log?.status).toBe("pending");
        expect(log?.totalValue).toBe(1);
    });

    it("marks a times habit completed when the final count is logged", async () => {
        const habit = await createHabit({ unitValue: 3, currentValue: 2, totalValue: 2 });

        const response = await request(app)
            .post(`/api/habit/logHabit/${habit.id}`)
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Habit logged in successfully");
        expect(response.body.logHabit).toMatchObject({
            habitId: habit.id,
            status: "completed",
            totalValue: 3,
        });

        const updatedHabit = await prisma.habit.findUnique({ where: { id: habit.id } });
        const log = await prisma.habitLog.findUnique({
            where: { habitId_date: { habitId: habit.id, date: todayUtc() } },
        });

        expect(updatedHabit?.currentValue).toBe(3);
        expect(updatedHabit?.totalValue).toBe(3);
        expect(updatedHabit?.streak).toBe(1);
        expect(updatedHabit?.lastLogged?.toISOString()).toBe(todayUtc().toISOString());
        expect(log?.status).toBe("completed");
    });

    it("logs a minutes habit with a session value", async () => {
        const habit = await createHabit({
            name: "Meditate",
            unitType: "minutes",
            unitValue: 30,
            currentValue: 0,
            totalValue: 0,
        });

        const response = await request(app)
            .post(`/api/habit/logHabit/${habit.id}`)
            .set("Cookie", [`token=${token}`])
            .send({ sessionValue: 10 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Habit logged successfully");
        expect(response.body.loggedHabit).toMatchObject({
            id: habit.id,
            currentValue: 10,
            totalValue: 10,
        });
        expect(response.body.log).toMatchObject({
            habitId: habit.id,
            status: "pending",
            totalValue: 10,
        });
    });

    it("returns 400 when a minutes habit is logged without a positive session value", async () => {
        const habit = await createHabit({ unitType: "minutes", unitValue: 30 });

        const response = await request(app)
            .post(`/api/habit/logHabit/${habit.id}`)
            .set("Cookie", [`token=${token}`])
            .send({ sessionValue: 0 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Session value is required and must be greater than 0" });
    });

    it("supports manually completing a habit with the status query param", async () => {
        const habit = await createHabit({ unitValue: 5, currentValue: 2, totalValue: 2 });

        const response = await request(app)
            .post(`/api/habit/logHabit/${habit.id}?status=completed`)
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Habit logged successfully");
        expect(response.body.logHabit).toMatchObject({
            habitId: habit.id,
            status: "completed",
            totalValue: 5,
        });

        const updatedHabit = await prisma.habit.findUnique({ where: { id: habit.id } });

        expect(updatedHabit?.currentValue).toBe(5);
        expect(updatedHabit?.totalValue).toBe(5);
        expect(updatedHabit?.streak).toBe(1);
    });

    it("returns 404 when the habit does not exist", async () => {
        const response = await request(app)
            .post("/api/habit/logHabit/00000000-0000-0000-0000-000000000000")
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Habit not found" });
    });

    it("returns 401 without a token cookie", async () => {
        const habit = await createHabit();

        const response = await request(app).post(`/api/habit/logHabit/${habit.id}`);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});
