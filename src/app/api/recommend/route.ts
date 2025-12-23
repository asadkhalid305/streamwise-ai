import { NextRequest, NextResponse } from "next/server";
import type { RecommendRequest, RecommendResponse } from "@/types/api";
import { executeMultiAgentSystem } from "@/lib/agents-sdk/agents";
import { formatResponse } from "@/utils/responseFormatter";
import {
  InputGuardrailTripwireTriggered,
  OutputGuardrailTripwireTriggered,
} from "@openai/agents";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: RecommendRequest = await request.json();
    const message = body.message.trim();

    // Basic validation
    if (!message || message === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let response: RecommendResponse;

    try {
      // Execute the multi-agent system with the user message
      const result = await executeMultiAgentSystem(message);

      // Format the response
      response = formatResponse(result);
    } catch (error) {
      // Handle input guardrail errors
      if (error instanceof InputGuardrailTripwireTriggered) {
        console.log("Input guardrail triggered:", error.name);
        return NextResponse.json(
          {
            error:
              "Your request could not be processed due to content policy violations.",
            details: error.message,
          },
          { status: 400 }
        );
      }
      // Handle output guardrail errors
      if (error instanceof OutputGuardrailTripwireTriggered) {
        console.log("Output guardrail triggered:", error.name);
        return NextResponse.json(
          {
            error:
              "The response could not be generated due to validation issues.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      console.error("Error executing multi-agent system:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
