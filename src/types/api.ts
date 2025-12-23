// API Request/Response Types

export interface RecommendRequest {
  message: string;
}

export interface RecommendItem {
  name: string;
  type: "movie" | "show";
  durationMinutes?: number; // for movies (runtimeMinutes)
  episodeDurationMinutes?: number; // for shows
  why: string;
  rank?: number; // Optional: rank from ranker agent
}

export interface ResponseMetadata {
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  responseId: string;
  traceId: string;
}

export interface RecommendResponse {
  message: string; // The actual response message from the agent
  userQuery: string; // The original user input
  metadata: ResponseMetadata; // AI model and usage info
  // Legacy fields for backward compatibility (if needed)
  title?: string;
  echo?: string;
  items?: RecommendItem[];
}
