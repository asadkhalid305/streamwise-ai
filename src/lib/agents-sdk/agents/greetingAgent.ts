import { Agent } from "@openai/agents";
import { GREETING_AGENT_INSTRUCTIONS } from "../instructions";

const greetingAgent = Agent.create({
  name: "Greeting agent",
  instructions: GREETING_AGENT_INSTRUCTIONS,
});

export default greetingAgent;
