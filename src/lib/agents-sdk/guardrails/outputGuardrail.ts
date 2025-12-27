import { OutputGuardrail } from "@openai/agents";

/**
 * Simple output guardrail to demonstrate validation of agent output.
 * This performs basic checks without strict schema validation to keep it simple.
 */

export const outputValidationGuardrail: OutputGuardrail = {
  name: "Output Validation Guardrail",
  async execute({ agentOutput }) {
    let tripwireTriggered = false;
    let reason = "Output is valid";

    try {
      // Parse output if it's a string
      let parsed = agentOutput;
      if (typeof agentOutput === "string") {
        try {
          parsed = JSON.parse(agentOutput);
        } catch {
          // If not JSON, it might be a text response (greeting/out of scope)
          // These are valid, so don't trigger guardrail
          return {
            outputInfo: { reason: "Text response (valid)" },
            tripwireTriggered: false,
          };
        }
      }

      // Only validate if it's a recommendations response
      if (parsed && typeof parsed === "object" && "recommendations" in parsed) {
        const recommendations = (parsed as any).recommendations;

        // Check if recommendations is an array
        if (!Array.isArray(recommendations)) {
          tripwireTriggered = true;
          reason = "Recommendations must be an array";
          return { outputInfo: { reason }, tripwireTriggered };
        }

        // Basic validation: check that we have the required fields for frontend
        for (const rec of recommendations) {
          // Check for required fields that the frontend needs
          if (!rec.name) {
            tripwireTriggered = true;
            reason = "Missing 'name' field in recommendation";
            break;
          }

          if (!rec.type) {
            tripwireTriggered = true;
            reason = "Missing 'type' field in recommendation";
            break;
          }
        }

        // Check for reasonable number of recommendations
        if (recommendations.length > 25) {
          tripwireTriggered = true;
          reason = "Too many recommendations (max 25)";
        }
      }
    } catch (error) {
      tripwireTriggered = true;
      reason = `Output validation error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }

    return {
      outputInfo: {
        reason,
      },
      tripwireTriggered,
    };
  },
};
