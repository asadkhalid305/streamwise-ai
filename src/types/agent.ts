export type Intent = "greeting" | "recommendation" | "out_of_scope";

export interface PreferenceQuery {
  typePreference: "movie" | "show" | "any";
  genresInclude: string[];
  timeLimitMinutes: number | null;
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
}

export interface RankedRecommendation {
  name: string;
  type: "movie" | "show";
  durationMinutes?: number;
  episodeDurationMinutes?: number;
  genres: string[];
  year: number;
  ageRating: string;
  rank: number;
  explanation: string;
}

export interface RankerOutput {
  recommendations: RankedRecommendation[];
}
