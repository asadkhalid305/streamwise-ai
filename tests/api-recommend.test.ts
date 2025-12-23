/**
 * API Tests for /api/recommend endpoint
 *
 * Tests all 3 intents:
 * 1. Greeting - Should route to greetingAgent
 * 2. Recommendation - Should route to parserAgent -> rankerAgent
 * 3. Out of Scope - Should route to outOfScopeAgent
 *
 * Usage:
 * 1. Start the dev server: npm run dev
 * 2. Run tests: npm test
 */

import request from "supertest";

const API_URL = "http://localhost:3000";
const ENDPOINT = "/api/recommend";

describe("POST /api/recommend", () => {
  describe("Greeting Intent", () => {
    it('should return a greeting message for "hi"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "hi" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toBe("string");
      expect(res.body.message.length).toBeGreaterThan(0);
      expect(res.body).not.toHaveProperty("recommendations");
    });

    it('should return a greeting message for "hello"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "hello" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body).not.toHaveProperty("recommendations");
    });

    it('should return a greeting message for "how are you?"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "how are you?" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body).not.toHaveProperty("recommendations");
    });
  });

  describe("Recommendation Intent", () => {
    it('should return recommendations for "I want a comedy movie"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "I want a comedy movie" })
        .expect(200);

      expect(res.body).toHaveProperty("recommendations");
      expect(Array.isArray(res.body.recommendations)).toBe(true);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      expect(res.body.recommendations.length).toBeLessThanOrEqual(6);

      // Check structure of first recommendation
      const rec = res.body.recommendations[0];
      expect(rec).toHaveProperty("name");
      expect(rec).toHaveProperty("type");
      expect(rec).toHaveProperty("genres");
      expect(rec).toHaveProperty("year");
      expect(rec).toHaveProperty("explanation");
      expect(Array.isArray(rec.genres)).toBe(true);
    });

    it('should return recommendations for "Show me action movies"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "Show me action movies" })
        .expect(200);

      expect(res.body).toHaveProperty("recommendations");
      expect(Array.isArray(res.body.recommendations)).toBe(true);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
    });

    it('should return recommendations for "Recommend something funny"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "Recommend something funny" })
        .expect(200);

      expect(res.body).toHaveProperty("recommendations");
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });

    it('should return recommendations for "I want to watch a scary show"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "I want to watch a scary show" })
        .expect(200);

      expect(res.body).toHaveProperty("recommendations");
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });

    it('should return recommendations for "Action movie under 2 hours"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "Action movie under 2 hours" })
        .expect(200);

      expect(res.body).toHaveProperty("recommendations");
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });
  });

  describe("Out of Scope Intent", () => {
    it('should return a polite decline for "What\'s the weather?"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "What's the weather?" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toBe("string");
      expect(res.body).not.toHaveProperty("recommendations");
    });

    it('should return a polite decline for "Tell me a joke"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "Tell me a joke" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body).not.toHaveProperty("recommendations");
    });

    it('should return a polite decline for "Help me with math homework"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "Help me with math homework" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body).not.toHaveProperty("recommendations");
    });

    it('should return a polite decline for "What\'s 2 + 2?"', async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "What's 2 + 2?" })
        .expect(200);

      expect(res.body).toHaveProperty("message");
      expect(res.body).not.toHaveProperty("recommendations");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing message field", async () => {
      const res = await request(API_URL).post(ENDPOINT).send({}).expect(400);

      expect(res.body).toHaveProperty("error");
    });

    it("should handle empty message", async () => {
      const res = await request(API_URL)
        .post(ENDPOINT)
        .send({ message: "" })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });
});
