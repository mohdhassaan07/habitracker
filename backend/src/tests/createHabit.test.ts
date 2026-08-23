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

export const clearDatabase = async () => {
    await prisma.habitLog.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.moodLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.timeOfDay.deleteMany();
};

describe("POST /api/habit/createHabit", () => {
    beforeAll(async () => {
        app = (await import("../app")).app;
    });

    beforeEach(async () => {
        await clearDatabase();

        await prisma.timeOfDay.createMany({
            data: [
                { label: "Morning" },
                { label: "Afternoon" },
                { label: "Evening" },
            ],
        });

        const user = await prisma.user.create({
            data: {
                email: "habit-test@example.com",
                name: "Habit Test User",
                password: "hashed-password",
            },
        });

        userId = user.id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string);
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    it("creates a habit for the logged-in user", async () => {
        const response = await request(app)
            .post("/api/habit/createHabit")
            .set("Cookie", [`token=${token}`])
            .send({
                name: "Read",
                unitType: "minutes",
                unitValue: 30,
                frequency: "daily",
                timeOfDay: ["Morning", "Evening"],
            });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            name: "Read",
            unitType: "minutes",
            unitValue: 30,
            frequency: "daily",
            userId,
            currentValue: 0,
            totalValue: 0,
        });

        const habit = await prisma.habit.findUnique({
            where: { id: response.body.id },
            include: { timeOfDay: true },
        });

        expect(habit).not.toBeNull();
        expect(habit?.userId).toBe(userId);
        expect(habit?.timeOfDay.map((time) => time.label).sort()).toEqual(["Evening", "Morning"]);
    });

    it("returns 400 when required fields are missing", async () => {
        const response = await request(app)
            .post("/api/habit/createHabit")
            .set("Cookie", [`token=${token}`])
            .send({
                name: "Read",
                unitType: "minutes",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "All fields are required" });
    });

    it("returns 401 without a token cookie", async () => {
        const response = await request(app)
            .post("/api/habit/createHabit")
            .send({
                name: "Read",
                unitType: "minutes",
                unitValue: 30,
                frequency: "daily",
            });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});


