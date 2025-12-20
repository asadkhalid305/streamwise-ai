import { tool } from "@openai/agents";
import { z } from "zod";
import { searchCatalog } from "../util/helpers";

export const catalogSearchTool = tool({
  name: "search_catalog",
  description:
    "Search the movie and TV show catalog based on user preferences. Returns a filtered list of items matching the criteria.",
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
  execute: async (query) => {
    const results = searchCatalog(query);
    return results;
  },
});
