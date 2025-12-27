import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/recommend/route";
import { NextRequest } from "next/server";

// Mock the Agent System
jest.mock("@/lib/agents-sdk/agents", () => ({
  executeMultiAgentSystem: jest.fn(),
}));

// Mock TMDB Service
jest.mock("@/services/tmdb", () => ({
  searchTMDBCatalog: jest.fn(),
}));

import { executeMultiAgentSystem } from "@/lib/agents-sdk/agents";

// Helper to create NextRequest
function createRequest(body: any): NextRequest {
  return new NextRequest("http://localhost:3000/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-openai-api-key": "test-key", 
    },
    body: JSON.stringify(body),
  });
}

// Helper to create the complex RunResult structure expected by formatResponse
function createMockResult(agentName: string, output: any, input: string = "test input") {
  return {
    state: {
      _currentStep: {
        type: "next_step_final_output",
        output: typeof output === 'string' ? output : JSON.stringify(output),
      },
      _currentAgent: { name: agentName },
      _originalInput: input,
      _lastTurnResponse: {
        usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
        providerData: { model: "gpt-4" },
        responseId: "mock-id",
      },
      _trace: { traceId: "mock-trace" }
    }
  };
}

describe("POST /api/recommend Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return greeting for 'hi'", async () => {
    // Mock Agent Response for Greeting
    (executeMultiAgentSystem as jest.Mock).mockResolvedValue(
      createMockResult("Greeting Agent", "Hello! How can I help you?", "hi")
    );

    const req = createRequest({ message: "hi" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("message");
    expect(json.message).toBe("Hello! How can I help you?");
    // The formatter returns "items" property, not "recommendations" directly in the root (based on RecommendResponse type)
    expect(json.items).toBeUndefined();
  });

  it("should return recommendations for valid query", async () => {
    // Mock Agent Response for Ranker
    const mockRecommendations = {
      recommendations: [
        {
          name: "Test Movie",
          type: "movie",
          durationMinutes: 120,
          genres: ["Action"],
          explanation: "Because you like action.",
          rank: 1,
        },
      ],
    };

    (executeMultiAgentSystem as jest.Mock).mockResolvedValue(
      createMockResult("Ranker Agent", mockRecommendations, "Action movie")
    );

    const req = createRequest({ message: "Action movie" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("items");
    expect(json.items).toHaveLength(1);
    expect(json.items[0].name).toBe("Test Movie");
    expect(json.message).toContain("recommendations for you");
  });

  it("should handle out of scope requests", async () => {
    (executeMultiAgentSystem as jest.Mock).mockResolvedValue(
      createMockResult("Out of Scope Agent", "I can only help with movies.", "Weather?")
    );

    const req = createRequest({ message: "Weather?" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("I can only help with movies.");
  });

  it("should validate empty message", async () => {
    const req = createRequest({ message: "" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Message is required");
  });
  
  it("should require API key if not in env or header", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const req = new NextRequest("http://localhost:3000/api/recommend", {
        method: "POST",
        body: JSON.stringify({ message: "hi" }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toContain("OpenAI API key is required");

      process.env.OPENAI_API_KEY = originalKey;
  });
});