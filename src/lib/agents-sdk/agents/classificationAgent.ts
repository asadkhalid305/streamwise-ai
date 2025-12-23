import { Agent } from "@openai/agents";
import { CLASSIFICATION_AGENT_INSTRUCTIONS } from "../instructions";
import { contentSafetyGuardrail } from "../guardrails/inputGuardrail";
import greetingAgent from "./greetingAgent";
import outOfScopeAgent from "./outOfScopeAgent";
import parserAgent from "./parserAgent";

const classificationAgent = Agent.create({
  name: "Classification agent",
  instructions: CLASSIFICATION_AGENT_INSTRUCTIONS,
  inputGuardrails: [contentSafetyGuardrail],
  handoffs: [greetingAgent, parserAgent, outOfScopeAgent],
});

export default classificationAgent;
