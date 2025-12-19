# Test Prompts for Multi-Agent Movie Picker

Minimal test cases covering all agents and guardrails without repetition.

---

## Greeting Agent ✅

| Prompt                       | Expected                   |
| ---------------------------- | -------------------------- |
| "hi"                         | Friendly greeting response |
| "how are you?"               | Friendly greeting response |
| "hey, what can you do?"      | Friendly greeting response |
| "hi, I want an action movie" | Route to Parser Agent      |

---

## Parser Agent

### Basic Requests ✅

| Prompt                     | Expected                           |
| -------------------------- | ---------------------------------- |
| "I want a comedy movie"    | Parse: type=movie, genres=[Comedy] |
| "Show me action shows"     | Parse: type=show, genres=[Action]  |
| "Something funny to watch" | Parse: type=any, genres=[Comedy]   |

### With Constraints ✅

| Prompt                                   | Expected                                |
| ---------------------------------------- | --------------------------------------- |
| "I want a movie under 2 hours"           | Parse: type=movie, timeLimitMinutes=120 |
| "TV show with episodes under 30 minutes" | Parse: type=show, timeLimitMinutes=30   |

### AND Logic (Single Call) ✅

| Prompt                          | Expected                                   |
| ------------------------------- | ------------------------------------------ |
| "I want an action comedy movie" | Parse: type=movie, genres=[Action, Comedy] |
| "romantic drama show"           | Parse: type=show, genres=[Romance, Drama]  |

### OR Logic (Multiple Calls) ✅

| Prompt                                      | Expected                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| "action movie OR comedy show"               | Call 1: type=movie, genres=[Action] + Call 2: type=show, genres=[Comedy], merge results |
| "horror films OR sci-fi series"             | Call 1: type=movie, genres=[Horror] + Call 2: type=show, genres=[Sci-Fi], merge results |
| "action movie under 2 hours OR comedy show" | Multiple calls with time constraints, merge results                                     |
| "action OR comedy movies"                   | Single call: type=movie, genres=[Action, Comedy]                                        |

### No Results ❌

| Prompt                                                 | Expected                                              |
| ------------------------------------------------------ | ----------------------------------------------------- |
| "I want a movie under 10 minutes"                      | Return: "No movies or shows matched your preferences" |
| "I want a horror romance comedy sci-fi action western" | Return: "No movies or shows matched your preferences" |

---

## Out of Scope Agent ✅

| Prompt                   | Expected              |
| ------------------------ | --------------------- |
| "What's the weather?"    | Out of scope response |
| "Tell me a joke"         | Out of scope response |
| "How do I cook pasta?"   | Out of scope response |
| "Help with math problem" | Out of scope response |

---

## Input Guardrail

### Safe Content ✅

| Prompt                            | Expected         |
| --------------------------------- | ---------------- |
| "I want an action movie"          | Proceed normally |
| "Show me family-friendly content" | Proceed normally |
| "Find me R-rated thrillers"       | Proceed normally |

### Harmful Content ❌

| Prompt                                          | Expected                            |
| ----------------------------------------------- | ----------------------------------- |
| [Hate speech/slurs]                             | Trigger guardrail, return 400 error |
| "Show me extreme violence for harmful purposes" | Trigger guardrail, return 400 error |
| [Sexually explicit content]                     | Trigger guardrail, return 400 error |

---

## Output Guardrail

### Valid Output ✅

| Scenario                                          | Expected                                                      |
| ------------------------------------------------- | ------------------------------------------------------------- |
| Multiple recommendations with all required fields | Pass (name, type, genres, year, ageRating, rank, explanation) |
| Empty recommendations array                       | Pass: `{"recommendations": []}`                               |
| Text response from greeting/out-of-scope agent    | Pass (non-JSON)                                               |

### Invalid Output ❌

| Scenario                            | Expected                                                    |
| ----------------------------------- | ----------------------------------------------------------- |
| Recommendation missing "name" field | Trigger guardrail, return 500 error                         |
| Recommendation missing "type" field | Trigger guardrail, return 500 error                         |
| More than 10 recommendations        | Trigger guardrail, return 500 error                         |
| Hallucinated titles not in catalog  | Trigger guardrail (ranker should only use provided results) |

---

## Edge Cases

| Prompt                                             | Expected                                                        |
| -------------------------------------------------- | --------------------------------------------------------------- |
| "" (empty input)                                   | Return 400 error                                                |
| "!@#$%^&\*()"                                      | Route to out-of-scope or fail gracefully                        |
| "I want to watch something"                        | Should either ask for clarification or search with type=any     |
| "I want a comdy movie"                             | Agent should understand "comedy" via AI reasoning               |
| Very long request with multiple genres/constraints | Parse correctly without errors                                  |
| "I want a comedy horror movie under 30 minutes"    | Return no results (unlikely to exist) or return closest matches |

---

## Testing Workflow

```bash
npm run dev
```

1. Test greetings first (simple routing)
2. Test basic parser requests (single tool calls)
3. Test AND logic (multiple genres, same type)
4. Test OR logic with different types (multiple tool calls) ← **Main fix validation**
5. Test guardrails (harmful content)
6. Test edge cases

✅ Success: No "Internal server error" for valid inputs, proper routing, OR logic works

---

## Notes

- OR logic across different types now supported via multiple tool calls + merge
- AND logic within same type works via single tool call with multiple genres
- Guardrails validate both input (safety) and output (structure)
- All agents are intelligent and handle natural language variations
