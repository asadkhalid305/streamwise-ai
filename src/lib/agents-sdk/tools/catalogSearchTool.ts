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
 * - Time constraints
 * - Year/Era
 * - Rating
 * - People (Cast/Crew)
 * - Language
 * - Sorting
 */
export const catalogSearchTool = tool({
  name: "search_catalog",
  description:
    "Search the movie and TV show catalog based on user preferences. Returns a filtered list of items matching the criteria.",

  // Zod Schema: Define and validate tool parameters
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
    year: z.number().nullable().describe("Exact release year"),
    minYear: z.number().nullable().describe("Minimum release year (start of range)"),
    maxYear: z.number().nullable().describe("Maximum release year (end of range)"),
    minRating: z.number().nullable().describe("Minimum TMDB vote average (0-10)"),
    language: z.string().nullable().describe("ISO-639-1 language code (e.g. 'fr', 'ko', 'en')"),
    actors: z.array(z.string()).nullable().describe("List of actor names to include"),
    directors: z.array(z.string()).nullable().describe("List of director names to include"),
    sortBy: z
      .enum(["popularity", "newest", "top_rated"])
      .nullable()
      .describe("Sort order for results"),
  }),

  // Execute: The actual tool implementation
  execute: async (query) => {
    const results = await searchTMDBCatalog(query);
    console.log(`[Tool:search_catalog] Found ${results.length} items for Ranker`);
    return results;
  },
});
