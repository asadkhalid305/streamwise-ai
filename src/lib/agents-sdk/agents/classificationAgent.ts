import { Agent } from "@openai/agents";
import { CLASSIFICATION_AGENT_INSTRUCTIONS } from "../instructions";
import greetingAgent from "./greetingAgent";
import outOfScopeAgent from "./outOfScopeAgent";
// import parserAgent from "./parserAgent"; // TODO: Import parserAgent when created

/**
 * Classification Agent - The Orchestrator
 *
 * This agent determines user intent and routes to appropriate specialists:
 * - Greeting → greetingAgent
 * - Recommendation → parserAgent
 * - Out of scope → outOfScopeAgent
 *
 * It also enforces input validation through the content safety guardrail.
 */
const classificationAgent = Agent.create({
  name: "Classification Agent",
  instructions: CLASSIFICATION_AGENT_INSTRUCTIONS,
  // TODO: Attach input guardrail here
  handoffs: [
    greetingAgent,
    outOfScopeAgent,
    // parserAgent, // TODO: Enable handoff to parserAgent
  ],
});

export default classificationAgent;