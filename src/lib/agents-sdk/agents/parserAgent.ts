import { Agent } from "@openai/agents";
import { PARSER_AGENT_INSTRUCTIONS } from "../instructions";
// import { catalogSearchTool } from "../tools/catalogSearchTool"; // TODO: Import tool
// import rankerAgent from "./rankerAgent"; // TODO: Import rankerAgent

/**
 * Parser Agent - Extracts preferences and searches the catalog
 *
 * This agent:
 * 1. Parses user requests to extract preferences (type, genres, time constraints)
 * 2. Uses the catalogSearchTool to find matching movies/shows
 * 3. Hands off results to the rankerAgent for sorting and explanation
 *
 * Handles complex queries like OR logic ("action movie OR comedy show")
 */
const parserAgent = Agent.create({
  name: "Parser Agent",
  instructions: PARSER_AGENT_INSTRUCTIONS,
  // Tools: Extend agent capabilities with deterministic functions
  // The catalog search tool filters movies/shows by preferences
  tools: [
    // TODO: Add catalogSearchTool here
  ],
  // Handoffs: Pass search results to ranker for final processing
  handoffs: [
    // TODO: Add rankerAgent here
  ],
});

export default parserAgent;