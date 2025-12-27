import { searchTMDBCatalog } from "@/services/tmdb";
import { PreferenceQuery } from "@/types/agent";

// Mock global fetch
global.fetch = jest.fn();

describe("TMDB Service", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset(); // Use mockReset to clear history and implementations
    process.env.TMDB_API_KEY = "mock-api-key";

    // Robust Mock Implementation based on URL
    (global.fetch as jest.Mock).mockImplementation(async (url: string) => {
      // Helper to return json
      const ok = (data: any) => Promise.resolve({ ok: true, json: async () => data });
      const notFound = () => Promise.resolve({ ok: false, status: 404 });

      if (url.includes("/genre/movie/list")) {
        return ok({
          genres: [
            { id: 28, name: "Action" },
            { id: 35, name: "Comedy" },
          ]
        });
      }
      
      if (url.includes("/genre/tv/list")) {
        return ok({
          genres: [
            { id: 18, name: "Drama" },
            { id: 10765, name: "Sci-Fi & Fantasy" },
          ]
        });
      }

      if (url.includes("/search/person")) {
        if (url.includes("Tom+Cruise")) {
          return ok({ results: [{ id: 500, name: "Tom Cruise" }] });
        }
        if (url.includes("Nolan")) {
          return ok({ results: [{ id: 525, name: "Christopher Nolan" }] });
        }
        return ok({ results: [] });
      }

      if (url.includes("/discover/movie")) {
        return ok({
          results: [
            { id: 101, title: "Action Movie 1", genre_ids: [28], release_date: "2023-01-01", overview: "Bang", vote_average: 8.5, vote_count: 1000 },
          ],
          total_results: 1,
          page: 1
        });
      }

      if (url.includes("/discover/tv")) {
        return ok({
          results: [
             { id: 201, name: "Drama Show 1", genre_ids: [18], first_air_date: "2023-01-01", overview: "Sad", vote_average: 7.5, vote_count: 500 }
          ],
          total_results: 1,
          page: 1
        });
      }

      // Movie Details
      if (url.includes("/movie/101")) {
        return ok({
          id: 101,
          title: "Action Movie 1",
          runtime: 120,
          genres: [{ name: "Action" }],
          release_date: "2023-01-01",
          vote_average: 8.5,
          vote_count: 1000,
          release_dates: { results: [{ iso_3166_1: "US", release_dates: [{ certification: "PG-13" }] }] },
        });
      }

      // TV Details
      if (url.includes("/tv/201")) {
        return ok({
          id: 201,
          name: "Drama Show 1",
          episode_run_time: [45],
          genres: [{ name: "Drama" }],
          first_air_date: "2023-01-01",
          number_of_seasons: 2,
          vote_average: 7.5,
          vote_count: 500,
          content_ratings: { results: [{ iso_3166_1: "US", rating: "TV-14" }] }
        });
      }

      console.warn("Unhandled Mock URL:", url);
      return notFound();
    });
  });

  it("should fetch genres and search movies correctly", async () => {
    const query: PreferenceQuery = {
      typePreference: "movie",
      genresInclude: ["Action"],
      timeLimitMinutes: 120,
    };

    const results = await searchTMDBCatalog(query);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Action Movie 1");
    expect(results[0].type).toBe("movie");
    expect(results[0].runtimeMinutes).toBe(120);
  });

  it("should filter by person (cast/crew) correctly", async () => {
    const query: PreferenceQuery = {
      typePreference: "movie",
      genresInclude: [],
      timeLimitMinutes: null,
      actors: ["Tom Cruise"],
      directors: ["Christopher Nolan"]
    };

    await searchTMDBCatalog(query);

    const calls = (global.fetch as jest.Mock).mock.calls;
    const discoverCall = calls.find(call => call[0].includes("/discover/movie"));
    
    expect(discoverCall).toBeDefined();
    expect(discoverCall[0]).toContain("with_cast=500");
    expect(discoverCall[0]).toContain("with_crew=525");
  });

  it("should apply year and rating filters correctly", async () => {
    const query: PreferenceQuery = {
      typePreference: "movie",
      genresInclude: [],
      timeLimitMinutes: null,
      year: 2022,
      minRating: 8.0
    };

    await searchTMDBCatalog(query);

    const calls = (global.fetch as jest.Mock).mock.calls;
    const discoverCall = calls.find(call => call[0].includes("/discover/movie"));
    
    expect(discoverCall).toBeDefined();
    expect(discoverCall[0]).toContain("primary_release_year=2022");
    expect(discoverCall[0]).toContain("vote_average.gte=8");
  });

  it("should apply language and sorting correctly", async () => {
    const query: PreferenceQuery = {
      typePreference: "movie",
      genresInclude: [],
      timeLimitMinutes: null,
      language: "fr",
      sortBy: "top_rated"
    };

    await searchTMDBCatalog(query);

    const calls = (global.fetch as jest.Mock).mock.calls;
    const discoverCall = calls.find(call => call[0].includes("/discover/movie"));
    
    expect(discoverCall).toBeDefined();
    expect(discoverCall[0]).toContain("with_original_language=fr");
    expect(discoverCall[0]).toContain("sort_by=vote_average.desc");
  });

  it("should handle 'any' preference by searching both", async () => {
       const query: PreferenceQuery = {
           typePreference: "any",
           genresInclude: ["Action", "Drama"], 
           timeLimitMinutes: null
       };

       const results = await searchTMDBCatalog(query);
       
       expect(results).toHaveLength(2);
       const types = results.map(r => r.type);
       expect(types).toContain("movie");
       expect(types).toContain("show");
  });
});
