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
let otherUserId: string;
let token: string;

const clearDatabase = async () => {
    await prisma.habitLog.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.moodLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.timeOfDay.deleteMany();
};

const seedTimeOfDay = async () => {
    await prisma.timeOfDay.createMany({
        data: [
            { label: "Morning" },
            { label: "Afternoon" },
            { label: "Evening" },
        ],
    });

    return prisma.timeOfDay.findMany();
};

describe("GET /api/habit/:userId", () => {
    beforeAll(async () => {
        app = (await import("../app")).app;
    });

    beforeEach(async () => {
        await clearDatabase();

        const [user, otherUser] = await Promise.all([
            prisma.user.create({
                data: {
                    email: "get-habits-test@example.com",
                    name: "Get Habits Test User",
                    password: "hashed-password",
                },
            }),
            prisma.user.create({
                data: {
                    email: "other-get-habits-test@example.com",
                    name: "Other Get Habits Test User",
                    password: "hashed-password",
                },
            }),
        ]);

        userId = user.id;
        otherUserId = otherUser.id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string);
    });

    afterAll(async () => {
        await clearDatabase();
        await prisma.$disconnect();
    });

    it("returns the user's habits ordered by newest first with time of day and logs", async () => {
        const times = await seedTimeOfDay();
        const morning = times.find((time) => time.label === "Morning");
        const evening = times.find((time) => time.label === "Evening");

        const olderHabit = await prisma.habit.create({
            data: {
                name: "Read",
                unitType: "minutes",
                unitValue: 30,
                frequency: "daily",
                userId,
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                timeOfDay: { connect: [{ id: morning!.id }] },
            },
        });

        const newerHabit = await prisma.habit.create({
            data: {
                name: "Exercise",
                unitType: "times",
                unitValue: 3,
                frequency: "weekly",
                userId,
                createdAt: new Date("2026-01-02T00:00:00.000Z"),
                timeOfDay: { connect: [{ id: evening!.id }] },
            },
        });

        await prisma.habit.create({
            data: {
                name: "Other user's habit",
                unitType: "times",
                unitValue: 1,
                frequency: "daily",
                userId: otherUserId,
                createdAt: new Date("2026-01-03T00:00:00.000Z"),
                timeOfDay: { connect: [{ id: morning!.id }] },
            },
        });

        await prisma.habitLog.createMany({
            data: [
                {
                    habitId: olderHabit.id,
                    date: new Date("2026-01-02T00:00:00.000Z"),
                    status: "pending",
                    totalValue: 10,
                    createdAt: new Date("2026-01-02T12:00:00.000Z"),
                },
                {
                    habitId: olderHabit.id,
                    date: new Date("2026-01-01T00:00:00.000Z"),
                    status: "completed",
                    totalValue: 30,
                    createdAt: new Date("2026-01-01T12:00:00.000Z"),
                },
            ],
        });

        const response = await request(app)
            .get(`/api/habit/${userId}`)
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body.map((habit: any) => habit.id)).toEqual([newerHabit.id, olderHabit.id]);
        expect(response.body.map((habit: any) => habit.name)).toEqual(["Exercise", "Read"]);
        expect(response.body[0].timeOfDay.map((time: any) => time.label)).toEqual(["Evening"]);
        expect(response.body[1].timeOfDay.map((time: any) => time.label)).toEqual(["Morning"]);
        expect(response.body[1].logs.map((log: any) => log.status)).toEqual(["completed", "pending"]);
    });

    it("filters habits by time of day when the time query is provided", async () => {
        const times = await seedTimeOfDay();
        const morning = times.find((time) => time.label === "Morning");
        const evening = times.find((time) => time.label === "Evening");

        const morningHabit = await prisma.habit.create({
            data: {
                name: "Journal",
                unitType: "minutes",
                unitValue: 10,
                frequency: "daily",
                userId,
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                timeOfDay: { connect: [{ id: morning!.id }] },
            },
        });

        await prisma.habit.create({
            data: {
                name: "Stretch",
                unitType: "minutes",
                unitValue: 15,
                frequency: "daily",
                userId,
                createdAt: new Date("2026-01-02T00:00:00.000Z"),
                timeOfDay: { connect: [{ id: evening!.id }] },
            },
        });

        const response = await request(app)
            .get(`/api/habit/${userId}`)
            .query({ time: "Morning" })
            .set("Cookie", [`token=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.habits).toHaveLength(1);
        expect(response.body.habits[0]).toMatchObject({
            id: morningHabit.id,
            name: "Journal",
            userId,
        });
        expect(response.body.habits[0].timeOfDay.map((time: any) => time.label)).toEqual(["Morning"]);
    });

    it("returns 401 without a token cookie", async () => {
        const response = await request(app).get(`/api/habit/${userId}`);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});
