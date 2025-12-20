import { Agent } from "@openai/agents";
import { OUT_OF_SCOPE_AGENT_INSTRUCTIONS } from "../instructions";

const outOfScopeAgent = Agent.create({
  name: "Out_of_Scope agent",
  instructions: OUT_OF_SCOPE_AGENT_INSTRUCTIONS,
});

export default outOfScopeAgent;
