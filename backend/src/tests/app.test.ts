import { describe, expect, it } from 'vitest';
import request from "supertest";
import { app } from "../app";

describe("GET /", () => {
    
    it("returns hello world", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.text).toBe("Hello World!");
    })
})