export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreResponse {
  genres: TMDBGenre[];
}

export interface TMDBMovieResult {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  overview: string;
  // Runtime is NOT in search results, need details
}

export interface TMDBTVResult {
  id: number;
  name: string;
  genre_ids: number[];
  first_air_date: string;
  overview: string;
}

export interface TMDBDiscoverResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  runtime: number;
  genres: TMDBGenre[];
  release_date: string;
  release_dates: {
    results: {
      iso_3166_1: string;
      release_dates: {
        certification: string;
      }[];
    }[];
  };
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  episode_run_time: number[];
  genres: TMDBGenre[];
  first_air_date: string;
  number_of_seasons: number;
  content_ratings: {
    results: {
      iso_3166_1: string;
      rating: string;
    }[];
  };
}
