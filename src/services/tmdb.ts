import { PreferenceQuery, CatalogItem } from "@/types/agent";
import {
  TMDBDiscoverResponse,
  TMDBGenre,
  TMDBGenreResponse,
  TMDBMovieDetails,
  TMDBMovieResult,
  TMDBTVDetails,
  TMDBTVResult,
  TMDBPersonSearchResponse,
} from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Simple in-memory cache for genres
let movieGenresCache: TMDBGenre[] | null = null;
let tvGenresCache: TMDBGenre[] | null = null;

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getGenres(type: "movie" | "tv"): Promise<TMDBGenre[]> {
  if (type === "movie" && movieGenresCache) return movieGenresCache;
  if (type === "tv" && tvGenresCache) return tvGenresCache;

  const endpoint = `/genre/${type}/list`;
  const response = await fetchFromTMDB<TMDBGenreResponse>(endpoint);

  if (type === "movie") movieGenresCache = response.genres;
  else tvGenresCache = response.genres;

  return response.genres;
}

async function getGenreIds(genreNames: string[], type: "movie" | "tv"): Promise<string> {
  const allGenres = await getGenres(type);
  const ids = genreNames
    .map((name) => {
      const found = allGenres.find((g) => g.name.toLowerCase() === name.toLowerCase());
      return found ? found.id : null;
    })
    .filter((id) => id !== null);
  
  // Using pipe for OR logic (must include at least one of the specified genres)
  return ids.join("|");
}

async function searchPerson(name: string): Promise<number | null> {
  try {
    const response = await fetchFromTMDB<TMDBPersonSearchResponse>("/search/person", {
      query: name,
      page: "1",
    });
    if (response.results.length > 0) {
      return response.results[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Failed to search person: ${name}`, error);
    return null;
  }
}

async function getPersonIds(names: string[]): Promise<string> {
  const ids = await Promise.all(names.map((name) => searchPerson(name)));
  // using comma for AND logic (must include all listed people)
  return ids.filter((id) => id !== null).join(",");
}

async function getMovieDetails(id: number): Promise<CatalogItem | null> {
  try {
    const details = await fetchFromTMDB<TMDBMovieDetails>(`/movie/${id}`, {
      append_to_response: "release_dates",
    });

    const usRelease = details.release_dates.results.find((r) => r.iso_3166_1 === "US");
    const certification = usRelease?.release_dates.find((d) => d.certification)?.certification || "NR";

    return {
      name: details.title,
      type: "movie",
      runtimeMinutes: details.runtime,
      genres: details.genres.map((g) => g.name),
      year: new Date(details.release_date).getFullYear(),
      ageRating: certification,
      rating: details.vote_average,
      voteCount: details.vote_count,
    };
  } catch (error) {
    console.error(`Failed to fetch details for movie ${id}`, error);
    return null;
  }
}

async function getTVDetails(id: number): Promise<CatalogItem | null> {
  try {
    const details = await fetchFromTMDB<TMDBTVDetails>(`/tv/${id}`, {
      append_to_response: "content_ratings",
    });

    const usRating = details.content_ratings.results.find((r) => r.iso_3166_1 === "US");
    const certification = usRating?.rating || "NR";
    
    // Average episode runtime
    let avgRuntime: number | undefined;
    
    if (details.episode_run_time && details.episode_run_time.length > 0) {
      avgRuntime = Math.round(details.episode_run_time.reduce((a, b) => a + b, 0) / details.episode_run_time.length);
    } else if (details.last_episode_to_air && details.last_episode_to_air.runtime) {
      // Fallback to the runtime of the last aired episode
      avgRuntime = details.last_episode_to_air.runtime;
    }

    return {
      name: details.name,
      type: "show",
      episodeRuntimeMinutes: avgRuntime,
      genres: details.genres.map((g) => g.name),
      year: new Date(details.first_air_date).getFullYear(),
      seasons: details.number_of_seasons,
      ageRating: certification,
      rating: details.vote_average,
      voteCount: details.vote_count,
    };
  } catch (error) {
    console.error(`Failed to fetch details for tv ${id}`, error);
    return null;
  }
}

function getSortBy(sort: PreferenceQuery["sortBy"]): string {
  switch (sort) {
    case "newest":
      return "primary_release_date.desc"; // or first_air_date.desc for TV
    case "top_rated":
      return "vote_average.desc";
    case "popularity":
    default:
      return "popularity.desc";
  }
}

export async function searchTMDBCatalog(query: PreferenceQuery): Promise<CatalogItem[]> {
  const results: CatalogItem[] = [];
  const promises: Promise<void>[] = [];

  // Prepare common parameters
  const commonParams: Record<string, string> = {
    include_adult: "false",
    page: "1",
    // Base vote count filter to avoid bad data with 1 vote
    "vote_count.gte": "50", 
  };

  if (query.timeLimitMinutes) commonParams["with_runtime.lte"] = query.timeLimitMinutes.toString();
  if (query.minRating) commonParams["vote_average.gte"] = query.minRating.toString();
  if (query.language) commonParams.with_original_language = query.language;
  
  // Resolve people
  let castIds = "";
  let crewIds = "";
  
  if (query.actors && query.actors.length > 0) {
    castIds = await getPersonIds(query.actors);
    if (castIds) commonParams.with_cast = castIds;
  }
  
  if (query.directors && query.directors.length > 0) {
    crewIds = await getPersonIds(query.directors);
    if (crewIds) commonParams.with_crew = crewIds;
  }

  // Search Movies
  if (query.typePreference === "movie" || query.typePreference === "any") {
    promises.push((async () => {
      const genreIds = await getGenreIds(query.genresInclude, "movie");
      const params: Record<string, string> = { 
        ...commonParams, 
        sort_by: getSortBy(query.sortBy) 
      };

      if (genreIds) params.with_genres = genreIds;

      // Movie specific date filters
      if (query.year) params.primary_release_year = query.year.toString();
      if (query.minYear) params["primary_release_date.gte"] = `${query.minYear}-01-01`;
      if (query.maxYear) params["primary_release_date.lte"] = `${query.maxYear}-12-31`;

      const response = await fetchFromTMDB<TMDBDiscoverResponse<TMDBMovieResult>>("/discover/movie", params);
      
      console.log(`[TMDB] Discover returned ${response.results.length} movies for query`, JSON.stringify(query));

      const topResults = response.results.slice(0, 20);
      
      // Fetch details sequentially to avoid rate limiting
      for (const item of topResults) {
          try {
            const detail = await getMovieDetails(item.id);
            if (detail) {
              results.push(detail);
            } else {
              console.log(`[TMDB] Failed to get details for movie ${item.id} (returned null)`);
            }
          } catch (e) {
            console.error(`[TMDB] Error fetching details for movie ${item.id}`, e);
          }
      }
      
      console.log(`[TMDB] Final results count: ${results.length}`);
    })());
  }

  // Search TV Shows
  if (query.typePreference === "show" || query.typePreference === "any") {
    promises.push((async () => {
      const genreIds = await getGenreIds(query.genresInclude, "tv");
      // TV sorting needs adjustment for "newest"
      let sortBy = getSortBy(query.sortBy);
      if (sortBy === "primary_release_date.desc") sortBy = "first_air_date.desc";

      const params: Record<string, string> = { 
        ...commonParams, 
        sort_by: sortBy 
      };

      if (genreIds) params.with_genres = genreIds;

      // TV specific date filters
      if (query.year) params.first_air_date_year = query.year.toString();
      if (query.minYear) params["first_air_date.gte"] = `${query.minYear}-01-01`;
      if (query.maxYear) params["first_air_date.lte"] = `${query.maxYear}-12-31`;

      const response = await fetchFromTMDB<TMDBDiscoverResponse<TMDBTVResult>>("/discover/tv", params);
      
      const topResults = response.results.slice(0, 20);
      
      // Fetch details sequentially to avoid rate limiting
      for (const item of topResults) {
          const detail = await getTVDetails(item.id);
          if (detail) results.push(detail);
      }
    })());
  }

  await Promise.all(promises);
  return results;
}