# Multi-Agent Movie Picker

_End decision fatigue. Get personalized movie and show recommendations in seconds._

A Next.js application powered by a multi-agent AI system that understands natural language and delivers intelligent, context-aware recommendations.

---

## What It Does

**Movie & Show Picker** removes the friction from choosing what to watch. Instead of clicking through endless filters or scrolling for 30 minutes, simply describe what you want:

> "I have a 1-hour flight. Something light and funny."

> "Movie night for 5 people. No horror, not too heavy."

> "I'm in the mood for something critically acclaimed I haven't seen."

The system understands your intent, extracts constraints (time, genre, mood), searches a curated catalog, and returns personalized recommendations with clear explanations of why each one fits your request.

### Key Features

- **Natural Language Understanding** - Describe what you want in plain English
- **Context-Aware** - Understands time constraints, mood preferences, and group dynamics
- **Multi-Agent Architecture** - Specialized agents handle classification, parsing, ranking, and validation
- **Intelligent Ranking** - Results are sorted by relevance with personalized explanations
- **Safety Guardrails** - Input and output validation for content safety

---

## How It Works

The system uses a **multi-agent architecture** where specialized AI agents collaborate:

1. **Classification Agent** - Determines intent (greeting, recommendation, or out-of-scope)
2. **Parser Agent** - Extracts preferences (genre, type, time limits) and searches the catalog
3. **Ranker Agent** - Sorts results by relevance and generates explanations
4. **Greeting Agent** - Handles conversational greetings
5. **Out-of-Scope Agent** - Politely declines unrelated requests

Each agent has one clear responsibility, uses pre-defined instructions, and can hand off control to other agents. The parser agent uses a **catalog search tool** (a deterministic function) to query the movie/show database. **Input and output guardrails** validate content at system boundaries.

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd multi-agent-movie-picker

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key and OpenAI model:
# OPENAI_API_KEY="sk-proj-your-actual-api-key-here"
# OPENAI_DEFAULT_MODEL=gpt-4.1-mini

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

**Automated Tests:**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

**API Testing with Postman:**

Import the included Postman collection (`postman-collection.json`) to test the API directly:

1. Open Postman
2. Click **File → Import**
3. Select `postman-collection.json` from the project root
4. Use pre-configured requests to test different scenarios without the UI

The collection includes test cases for greetings, recommendations (with various constraints), and out-of-scope requests.

---

## Project Structure

```
src/
  app/
    page.tsx                    # Main UI
    api/recommend/route.ts      # API endpoint
  lib/
    agents-sdk/
      agents/                   # 5 specialized agents
      tools/                    # Catalog search tool
      guardrails/               # Input/output validation
      instructions.ts           # Agent instructions
      util/helpers.ts           # Helper functions (search logic)
  components/
    MovieCard.tsx               # UI component for recommendations
  data/
    catalog.json                # Movie and show database
  types/
    agent.ts                    # Agent-related types
    api.ts                      # API types
docs/
  PITCH.md                      # Project vision and problem statement
  WORKSHOP.md                   # Step-by-step implementation guide
  TEST_PROMPTS.md               # Test cases for all scenarios
tests/
  api-recommend.test.ts         # Automated API tests
```

---

## API Reference

### POST /api/recommend

Send a natural language message and receive movie/show recommendations.

**Request:**

```json
{
  "message": "I want a comedy movie under 2 hours"
}
```

**Response:**

```json
{
  "message": "Here are some comedy movies under 2 hours:",
  "recommendations": [
    {
      "name": "The Grand Budapest Hotel",
      "type": "movie",
      "genres": ["Comedy", "Drama"],
      "year": 2014,
      "runtimeMinutes": 99,
      "ageRating": "R",
      "rank": 1,
      "explanation": "A visually stunning and whimsical comedy that fits perfectly within your time constraint."
    }
  ],
  "metadata": {
    "totalResults": 5,
    "timestamp": "2024-01-20T10:30:00Z"
  }
}
```

For greetings or out-of-scope requests, the response contains only a `message` field with a text response.

---

## Learning & Building the System

This project is designed to teach multi-agent system architecture. The repository uses a branching strategy to support learning:

### Branch Strategy

- **`main`** - Basic project setup with a single empty endpoint (starting point)
- **`template`** - Workshop starting point with structure and TODOs for implementation
- **`solution`** - Complete implementation built on top of `template` with all features working

**To build the system yourself:**

1. **Recommended approach:** Create your own branch from `template` to work independently:

   ```bash
   git checkout template
   git checkout -b my-workshop
   ```

   This keeps the `template` branch clean, allowing you to reference it later or start fresh for different implementations.

2. **Alternative:** Work directly on the `template` branch:

   ```bash
   git checkout template
   ```

3. Follow the step-by-step guide in [`docs/WORKSHOP.md`](docs/WORKSHOP.md), which walks you through:

   - Understanding agent architecture
   - Implementing each specialized agent
   - Integrating tools and guardrails
   - Testing and debugging

4. Reference the `solution` branch anytime to see the complete implementation:
   ```bash
   git checkout solution
   npm run dev
   ```

The workshop guide (`WORKSHOP.md`) provides detailed instructions, code snippets, and explanations for building the entire system from scratch. It's designed for both live workshops and self-paced learning.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **AI/Agents:** OpenAI API with multi-agent orchestration
- **Styling:** Tailwind CSS
- **Testing:** Jest

---

## Why This Matters

Movie & Show Picker demonstrates how to build intelligent systems that:

- **Respect user time** - No endless scrolling or filter clicking
- **Understand context** - Not just keywords, but intent and constraints
- **Explain decisions** - Clear reasoning for each recommendation
- **Scale gracefully** - Multi-agent architecture handles complexity through specialization

The same principles apply to any domain requiring intelligent decision-making: customer support, content moderation, data analysis, workflow automation, and more.

---

## Additional Resources

- **[PITCH.md](docs/PITCH.md)** - Project vision, problem statement, and user experience
- **[WORKSHOP.md](docs/WORKSHOP.md)** - Complete implementation guide with step-by-step instructions
- **[TEST_PROMPTS.md](docs/TEST_PROMPTS.md)** - Comprehensive test cases for all scenarios

---

## License

MIT
