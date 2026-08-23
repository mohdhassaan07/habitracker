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

const clearDatabase = async () => {
    await prisma.habitLog.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.moodLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.timeOfDay.deleteMany();
};

describe("DELETE /api/habit/deleteHabit/:id", () => {
    beforeAll(async () => {
        app = (await import("../app")).app;
    });

    beforeEach(async () => {
        await clearDatabase();

        const user = await prisma.user.create({
            data: {
                email: "delete-habit-test@example.com",
                name: "Delete Habit Test User",
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

    it("deletes the habit and its logs", async () => {
        const habit = await prisma.habit.create({
            data: {
                name: "Read",
                unitType: "minutes",
                unitValue: 30,
                frequency: "daily",
                userId,
            },
        });

        const otherHabit = await prisma.habit.create({
            data: {
                name: "Exercise",
                unitType: "times",
                unitValue: 3,
                frequency: "weekly",
                userId,
            },
        });

        await prisma.habitLog.createMany({
            data: [
                {
                    habitId: habit.id,
                    date: new Date("2026-01-01T00:00:00.000Z"),
                    status: "completed",
                    totalValue: 30,
                },
                {
                    habitId: habit.id,
                    date: new Date("2026-01-02T00:00:00.000Z"),
                    status: "pending",
                    totalValue: 10,
                },
                {
                    habitId: otherHabit.id,
                    date: new Date("2026-01-01T00:00:00.000Z"),
                    status: "completed",
                    totalValue: 3,
                },
            ],
        });

        const response = await request(app)
            .delete(`/api/habit/deleteHabit/${habit.id}`)
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            message: "habit deleted successfully",
            habit: {
                id: habit.id,
                name: "Read",
                userId,
            },
        });

        await expect(prisma.habit.findUnique({ where: { id: habit.id } })).resolves.toBeNull();
        await expect(prisma.habitLog.findMany({ where: { habitId: habit.id } })).resolves.toEqual([]);
        await expect(prisma.habit.findUnique({ where: { id: otherHabit.id } })).resolves.not.toBeNull();
        await expect(prisma.habitLog.count({ where: { habitId: otherHabit.id } })).resolves.toBe(1);
    });

    it("returns 401 without a token cookie", async () => {
        const habit = await prisma.habit.create({
            data: {
                name: "Read",
                unitType: "minutes",
                unitValue: 30,
                frequency: "daily",
                userId,
            },
        });

        const response = await request(app).delete(`/api/habit/deleteHabit/${habit.id}`);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
        await expect(prisma.habit.findUnique({ where: { id: habit.id } })).resolves.not.toBeNull();
    });
});
