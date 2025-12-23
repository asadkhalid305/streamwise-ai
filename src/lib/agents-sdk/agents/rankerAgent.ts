import { Agent } from "@openai/agents";
import { RANKER_AGENT_INSTRUCTIONS } from "../instructions";
import { outputValidationGuardrail } from "../guardrails/outputGuardrail";

const rankerAgent = Agent.create({
  name: "Ranker agent",
  instructions: RANKER_AGENT_INSTRUCTIONS,
  outputGuardrails: [outputValidationGuardrail],
});

export default rankerAgent;
