import { InputGuardrail } from "@openai/agents";

/**
 * Simple input guardrail to demonstrate validation of user input.
 * This blocks offensive language and extremely long inputs.
 */
export const contentSafetyGuardrail: InputGuardrail = {
  name: "Content Safety Guardrail",
  // Run before the agent to save tokens if input is blocked
  runInParallel: false,
  execute: async ({ input }) => {
    // Convert input to string for checking
    const inputText =
      typeof input === "string"
        ? input.toLowerCase()
        : JSON.stringify(input).toLowerCase();

    // Simple offensive words check (basic example for demonstration)
    const offensiveWords = [
      "fuck",
      "shit",
      "damn",
      "bastard",
      "bitch",
      "ass",
      "crap",
      "piss",
      "dick",
      "cock",
      "pussy",
      "slut",
      "whore",
      "fag",
      "nigger",
      "retard",
      "kill yourself",
      "die",
      "hate",
      "racist",
      "sexist",
    ];
    const hasOffensiveContent = offensiveWords.some((word) =>
      inputText.includes(word)
    );

    // Check for extremely long input (potential abuse)
    const isTooLong = inputText.length > 500;

    // Check for empty input
    const isEmpty = inputText.trim().length === 0;

    const tripwireTriggered = hasOffensiveContent || isTooLong || isEmpty;

    return {
      outputInfo: {
        hasOffensiveContent,
        isTooLong,
        isEmpty,
        reason: hasOffensiveContent
          ? "Offensive content detected"
          : isTooLong
          ? "Input too long (max 500 chars)"
          : isEmpty
          ? "Empty input"
          : "Input is safe",
      },
      tripwireTriggered,
    };
  },
};
