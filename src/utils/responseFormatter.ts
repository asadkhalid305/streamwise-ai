import { RecommendResponse, RecommendItem } from "@/types/api";

export const formatResponse = (result: any): RecommendResponse => {
  // Extract the relevant data from the RunResult
  const currentStep = result.state._currentStep;
  let output = "No response generated";
  let items: RecommendItem[] = [];

  // Get current agent name to detect different agent types
  const currentAgent = result.state._currentAgent;
  const agentName = currentAgent?.name || "";
  const isTextResponseAgent =
    agentName.includes("Greeting") || agentName.includes("Out of Scope");
  const isRankerAgent = agentName.includes("Ranker");

  if (currentStep && currentStep.type === "next_step_final_output") {
    output = currentStep.output;

    // Try to parse JSON for recommendation responses
    if (!isTextResponseAgent) {
      try {
        let parsed: any = output;

        // If output is a string, check if it looks like JSON before parsing
        if (typeof output === "string") {
          const trimmed = output.trim();
          // Only parse if it starts with { or [ (looks like JSON)
          if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            parsed = JSON.parse(output);
          }
        }

        // Handle Ranker Agent output format: { recommendations: [...] }
        if (
          isRankerAgent &&
          parsed.recommendations &&
          Array.isArray(parsed.recommendations)
        ) {
          items = parsed.recommendations.map((item: any) => ({
            name: item.name,
            type: item.type,
            durationMinutes: item.durationMinutes,
            episodeDurationMinutes: item.episodeDurationMinutes,
            why: item.explanation || "Recommended for you",
            rank: item.rank,
          }));

          // For ranker agent, use a friendly message instead of raw JSON
          output = `Here are my top ${items.length} recommendations for you:`;
        }
        // Handle Parser Agent output format (if it ever returns without handoff): [...]
        else if (Array.isArray(parsed) && parsed.length > 0) {
          items = parsed.map((item: any) => ({
            name: item.name,
            type: item.type,
            durationMinutes: item.runtimeMinutes || item.durationMinutes,
            episodeDurationMinutes:
              item.episodeRuntimeMinutes || item.episodeDurationMinutes,
            why: `Matched your preferences with genres: ${
              item.genres?.join(", ") || "various"
            }`,
          }));

          output = `Found ${items.length} recommendations matching your preferences.`;
        }
      } catch (e) {
        // If parsing fails, keep output as plain text (e.g., error messages)
        console.warn("⚠️ Could not parse agent output as JSON:", e);
        console.warn("⚠️ Output was:", output);
      }
    }
  }

  const originalInput = result.state._originalInput;
  const userQuery =
    typeof originalInput === "string" ? originalInput : "unknown";

  const usage = result.state._lastTurnResponse?.usage;
  const model =
    result.state._lastTurnResponse?.providerData?.model || "unknown";
  const responseId = result.state._lastTurnResponse?.responseId || "";
  const traceId = result.state._trace?.traceId || "";

  return {
    message: output,
    userQuery,
    items: items.length > 0 ? items : undefined,
    metadata: {
      model,
      tokensUsed: {
        prompt: usage?.inputTokens || 0,
        completion: usage?.outputTokens || 0,
        total: usage?.totalTokens || 0,
      },
      responseId,
      traceId,
    },
  };
};
