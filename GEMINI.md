# Gemini Context for StreamWise

This file provides context for AI agents interacting with this codebase.

## Project Overview

**Name:** StreamWise
**Type:** Next.js Application (TypeScript)
**Purpose:** An autonomous multi-agent system that interprets natural language to discover the perfect movies and TV shows using the TMDB API.

### Key Technologies
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **AI Orchestration:** [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/)
- **Data Source:** [TMDB API](https://developer.themoviedb.org/docs) (via `src/services/tmdb.ts`)
- **Styling:** Tailwind CSS
- **Testing:** Jest, Supertest, Node Mocks HTTP

### Architecture

The system uses a directed graph of specialized AI agents:
1.  **Classification Agent:** The entry point. Determines if the user's intent is a greeting, a recommendation request, or out-of-scope.
2.  **Parser Agent:** Extracts structured preferences (genre, runtime, type) from the user's message and calls the `search_catalog` tool.
3.  **Ranker Agent:** Receives raw search results, sorts them by relevance, and generates natural language explanations for the top picks.
4.  **Greeting/Out-of-Scope Agents:** Handle simple conversational cases.

## Building and Running

### Prerequisites
- Node.js 18+
- OpenAI API Key
- TMDB API Key

### Configuration
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=sk-...
TMDB_API_KEY=...
```

### Key Commands
- **Install Dependencies:** `npm install`
- **Run Development Server:** `npm run dev` (Runs on http://localhost:3000)
- **Build for Production:** `npm run build`
- **Run Tests:** `npm test` (Runs Jest suite)
- **Run Tests (Watch Mode):** `npm run test:watch`

## Development Conventions

### Agent Development
- **Location:** `src/lib/agents-sdk/agents/`
- **Pattern:** Agents are defined using `Agent.create({})`. Instructions are imported from `../instructions.ts`.
- **Handoffs:** Agents explicitly declare which other agents they can transfer control to via the `handoffs` array.

### Tools & Services
- **Tools:** Defined in `src/lib/agents-sdk/tools/`. Tools are Zod-schema wrapped functions that agents can invoke.
- **Services:** Core business logic (like API calls) lives in `src/services/`.
    - **Note:** The project recently migrated from a local JSON catalog to the TMDB API. `src/services/tmdb.ts` is the source of truth for data fetching.

### Testing Strategy
- **Framework:** Jest is the test runner.
- **Unit Tests:** Located in `tests/`.
- **Mocking:** Tests for the recommendation API (`tests/api-recommend.test.ts`) and TMDB service (`tests/tmdb-service.test.ts`) rely on mocking external dependencies.
    - **TMDB Service:** Tests mock `fetch` to verify URL construction and response parsing without hitting the real API.
    - **API Route:** Tests use `node-mocks-http` to simulate Next.js request/response objects.

### Project Structure
- `src/app/api/recommend/route.ts`: The main API endpoint handling POST requests from the UI.
- `src/lib/agents-sdk/`: Contains the entire agent logic (agents, tools, guardrails).
- `src/types/`: TypeScript definitions for Agent intents (`agent.ts`) and TMDB API responses (`tmdb.ts`).
