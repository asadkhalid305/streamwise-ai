import { PreferenceQuery, CatalogItem } from "@/types/agent";
import {
  TMDBDiscoverResponse,
  TMDBGenre,
  TMDBGenreResponse,
  TMDBMovieDetails,
  TMDBMovieResult,
  TMDBTVDetails,
  TMDBTVResult,
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
    const avgRuntime = details.episode_run_time.length > 0
      ? Math.round(details.episode_run_time.reduce((a, b) => a + b, 0) / details.episode_run_time.length)
      : undefined;

    return {
      name: details.name,
      type: "show",
      episodeRuntimeMinutes: avgRuntime,
      genres: details.genres.map((g) => g.name),
      year: new Date(details.first_air_date).getFullYear(),
      seasons: details.number_of_seasons,
      ageRating: certification,
    };
  } catch (error) {
    console.error(`Failed to fetch details for tv ${id}`, error);
    return null;
  }
}

export async function searchTMDBCatalog(query: PreferenceQuery): Promise<CatalogItem[]> {
  const results: CatalogItem[] = [];
  const promises: Promise<void>[] = [];

  // Search Movies
  if (query.typePreference === "movie" || query.typePreference === "any") {
    promises.push((async () => {
      const genreIds = await getGenreIds(query.genresInclude, "movie");
      const params: Record<string, string> = {
        sort_by: "popularity.desc",
        include_adult: "false",
        page: "1",
      };

      if (genreIds) params.with_genres = genreIds;
      if (query.timeLimitMinutes) params["with_runtime.lte"] = query.timeLimitMinutes.toString();

      const response = await fetchFromTMDB<TMDBDiscoverResponse<TMDBMovieResult>>("/discover/movie", params);
      
      // Fetch details for top 5 to avoid rate limits/latency but give rich data
      const topResults = response.results.slice(0, 5);
      const detailPromises = topResults.map(async (item) => {
          const detail = await getMovieDetails(item.id);
          if (detail) results.push(detail);
      });
      await Promise.all(detailPromises);
    })());
  }

  // Search TV Shows
  if (query.typePreference === "show" || query.typePreference === "any") {
    promises.push((async () => {
      const genreIds = await getGenreIds(query.genresInclude, "tv");
      const params: Record<string, string> = {
        sort_by: "popularity.desc",
        include_adult: "false",
        page: "1",
      };

      if (genreIds) params.with_genres = genreIds;
      // TV runtime filtering is complex (with_runtime.lte filters by episode runtime usually)
      if (query.timeLimitMinutes) params["with_runtime.lte"] = query.timeLimitMinutes.toString();

      const response = await fetchFromTMDB<TMDBDiscoverResponse<TMDBTVResult>>("/discover/tv", params);
      
      // Fetch details for top 5
      const topResults = response.results.slice(0, 5);
      const detailPromises = topResults.map(async (item) => {
          const detail = await getTVDetails(item.id);
          if (detail) results.push(detail);
      });
      await Promise.all(detailPromises);
    })());
  }

  await Promise.all(promises);
  return results;
}
