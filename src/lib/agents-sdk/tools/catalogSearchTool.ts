import { tool } from "@openai/agents";
import { z } from "zod";
import { searchTMDBCatalog } from "@/services/tmdb";

/**
 * Catalog Search Tool - Search for movies and shows based on user preferences
 *
 * This tool extends the parser agent's capabilities by providing deterministic
 * search functionality. It filters the catalog based on:
 * - Type preference (movie, show, or any)
 * - Genres (must include at least one)
 * - Time constraints (runtime limit in minutes)
 *
 * The actual search logic is in searchCatalog() helper function, which can
 * be replaced with API calls, database queries, or other implementations.
 *
 * @param typePreference - "movie", "show", or "any"
 * @param genresInclude - Array of genre names (e.g., ["Comedy", "Action"])
 * @param timeLimitMinutes - Maximum runtime in minutes, or null for no limit
 * @returns Array of matching catalog items
 */
export const catalogSearchTool = tool({
  name: "search_catalog",
  description:
    "Search the movie and TV show catalog based on user preferences. Returns a filtered list of items matching the criteria.",

  // Zod Schema: Define and validate tool parameters
  // OpenAI SDK uses this to understand what parameters the tool accepts
  parameters: z.object({
    typePreference: z
      .enum(["movie", "show", "any"])
      .describe("Type of content to search for"),
    genresInclude: z
      .array(z.string())
      .describe("Genres that must be present (at least one)"),
    timeLimitMinutes: z
      .number()
      .nullable()
      .describe(
        "Maximum runtime in minutes for movies or episode runtime for shows"
      ),
  }),

  // Execute: The actual tool implementation
  // This is where you'd call external APIs, databases, etc.
  execute: async (query) => {
    const results = await searchTMDBCatalog(query);
    return results;
  },
});
