export type Intent = "greeting" | "recommendation" | "out_of_scope";

export interface PreferenceQuery {
  typePreference: "movie" | "show" | "any";
  genresInclude: string[];
  timeLimitMinutes: number | null;
  // New filters - can be null coming from tool
  year?: number | null;
  minYear?: number | null;
  maxYear?: number | null;
  minRating?: number | null;
  language?: string | null; // ISO-639-1 code
  actors?: string[] | null;
  directors?: string[] | null;
  sortBy?: "popularity" | "newest" | "top_rated" | null;
}

export interface CatalogItem {
  name: string;
  type: "movie" | "show";
  runtimeMinutes?: number;
  episodeRuntimeMinutes?: number;
  genres: string[];
  year: number;
  seasons?: number;
  ageRating: string;
  rating?: number;
  voteCount?: number;
}

export interface RankedRecommendation {
  name: string;
  type: "movie" | "show";
  durationMinutes?: number;
  episodeDurationMinutes?: number;
  genres: string[];
  year: number;
  ageRating: string;
  rating?: number;
  voteCount?: number;
  rank: number;
  explanation: string;
}

export interface RankerOutput {
  recommendations: RankedRecommendation[];
}