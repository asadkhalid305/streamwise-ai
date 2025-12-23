import { Agent } from "@openai/agents";
import { PARSER_AGENT_INSTRUCTIONS } from "../instructions";
import { catalogSearchTool } from "../tools/catalogSearchTool";
import rankerAgent from "./rankerAgent";

const parserAgent = Agent.create({
  name: "Parser agent",
  instructions: PARSER_AGENT_INSTRUCTIONS,
  tools: [catalogSearchTool],
  handoffs: [rankerAgent],
});

export default parserAgent;
