import { Agent } from "@openai/agents";
import { RANKER_AGENT_INSTRUCTIONS } from "../instructions";
// import { outputValidationGuardrail } from "../guardrails/outputGuardrail"; // TODO: Import guardrail

/**
 * Ranker Agent - Sorts results and generates explanations
 *
 * This agent:
 * 1. Receives search results from the parser agent
 * 2. Sorts by relevance (newest first by year)
 * 3. Generates personalized explanations for each recommendation
 * 4. Formats output as JSON
 *
 * Output validation ensures:
 * - Proper JSON structure
 * - All required fields present
 * - No hallucinated (made-up) movie titles
 * - Maximum 10 recommendations
 */
const rankerAgent = Agent.create({
  name: "Ranker agent",
  instructions: RANKER_AGENT_INSTRUCTIONS,
  // Output Guardrails: Validate final output before returning to user
  // Ensures quality, format correctness, and prevents hallucinations
  outputGuardrails: [
    // TODO: Add outputValidationGuardrail here
  ],
});

export default rankerAgent;