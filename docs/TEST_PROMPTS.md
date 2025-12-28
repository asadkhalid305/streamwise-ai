# Test Prompts for StreamWise AI

This document contains a list of test prompts designed to verify the robustness of the multi-agent system, specifically targeting edge cases, complex logic, and recent fixes.

## 1. Genre Mapping & TV Show Specifics
*These tests verify that the system correctly maps common terms to TMDB's specific TV genres (e.g., "Thriller" -> "Mystery").*

- **"I want a thriller TV show."**
    - *Expected:* Finds shows tagged with "Mystery" or "Crime" (e.g., *Sherlock*, *Black Mirror*).
- **"Show me some sci-fi series."**
    - *Expected:* Maps "Sci-Fi" to "Sci-Fi & Fantasy" and returns relevant shows.
- **"I need an action show for my flight."**
    - *Expected:* Maps "Action" to "Action & Adventure".
- **"Do you have any war shows?"**
    - *Expected:* Maps "War" to "War & Politics".

## 2. Advanced Filters (New)
*Verify the new semantic search capabilities: Person, Year, Language, etc.*

- **"Action movies with Tom Cruise released after 2010."**
    - *Expected:* Returns movies starring Tom Cruise from 2011 onwards (e.g., *Top Gun: Maverick*).
- **"French comedy movies from the 90s."**
    - *Expected:* Returns French-language comedies released between 1990-1999.
- **"Highest rated sci-fi shows of all time."**
    - *Expected:* Returns top-rated Sci-Fi TV shows (e.g., *Arcane*, *Firefly*).
- **"Movies directed by Christopher Nolan."**
    - *Expected:* Returns films like *Inception*, *Oppenheimer*, etc.

## 3. Runtime & Fallback Logic
*These tests verify the runtime filtering and the fix for "0 minute" episodes.*

- **"Give me a thriller show with episodes under 60 minutes."**
    - *Expected:* Returns shows where `episode_run_time` or `last_episode_to_air.runtime` is < 60.
- **"I have 30 minutes. What can I watch?"**
    - *Expected:* Returns short items (Movies or TV episodes under 30m).

## 4. Complex "OR" Logic
*These tests verify the Parser Agent's ability to split complex requests into multiple tool calls and merge results.*

- **"I want an action movie or a comedy show."**
    - *Expected:*
        - Call 1: Type=Movie, Genre=Action
        - Call 2: Type=Show, Genre=Comedy
        - Result: A mix of both in the final list.
- **"Horror movies or sci-fi series please."**
    - *Expected:* Mix of Horror movies and Sci-Fi & Fantasy shows.

## 5. UI & Volume (Updated)
*Verify the system returns the correct volume of results.*

- **"Recommend me popular action movies."**
    - *Expected:* Should return exactly **12 items** (or multiple of 2) to fill the UI rows perfectly.
- **"List all the comedy shows you can find."**
    - *Expected:* Should fill the list up to the fetch limit (20) without arbitrary capping below 12.

## 6. Agent Handoffs & Safety
*These tests verify the guardrails and agent routing.*

- **"Hi, how are you?"**
    - *Expected:* Handled by `GreetingAgent`. No recommendations, just a chat.
- **"Help me cook pasta."**
    - *Expected:* Handled by `OutOfScopeAgent`. Polite refusal.
- **"I want a movie with [inappropriate term]."**
    - *Expected:* Blocked by `InputGuardrail`. API returns 400.

## 7. Edge Cases
- **"I want a western."** (Ambiguous type)
    - *Expected:* Returns both Western Movies and Western TV shows.
- **"Surprise me."**
    - *Expected:* Should default to "Any" type and likely no specific genre.
