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

### **`main` (You are here)**

Minimal project setup with basic Next.js scaffolding and a single static API endpoint. Use this if you want to:

- Build the entire multi-agent system from scratch without any guidance
- Start with a completely clean slate
- Implement your own architecture and design decisions

**What's included:**

- ✅ Next.js 15 project setup
- ✅ Basic UI components and styling
- ✅ Empty API endpoint (`/api/recommend`) with static response
- ✅ Movie/show catalog data (`catalog.json`)
- ✅ Basic TypeScript types
- ❌ No agents, tools, or guardrails
- ❌ No TODOs or instructions
- ❌ No tests

### **`template` (Recommended starting point)**

Workshop-ready branch with complete project structure, TODOs, and step-by-step instructions. Use this if you want to:

- Follow the guided workshop experience
- Learn multi-agent architecture with structured guidance
- Implement features incrementally with clear checkpoints

**What's included:**

- ✅ Everything from `main`
- ✅ Complete folder structure for agents, tools, and guardrails
- ✅ Pre-written instructions for each agent
- ✅ TODO markers throughout the codebase
- ✅ Comprehensive workshop guide (`WORKSHOP.md`)
- ✅ Automated tests for validation
- ✅ Postman collection for API testing

### **`solution` (Reference implementation)**

Fully implemented multi-agent system with all features working. Use this to:

- See the complete working implementation
- Reference code while working on `template`
- Understand how all components integrate
- Test the final user experience

---

## 🚀 Getting Started

### Choose Your Path

#### Path 1: Build from Scratch (Advanced)

Stay on the `main` branch and build everything yourself:

```bash
# You're already here!
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the basic UI.

**Your mission:** Implement a multi-agent system that classifies user intent, searches for movies/shows, and returns personalized recommendations. The API endpoint at `src/app/api/recommend/route.ts` currently returns a static response—replace it with your implementation.

#### Path 2: Guided Workshop (Recommended)

Switch to the `template` branch and follow the structured workshop:

```bash
# Switch to template branch
git checkout template

# Create your own working branch
git checkout -b my-workshop

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key

# Start development
npm run dev
```

Follow the comprehensive guide in `docs/WORKSHOP.md` for step-by-step implementation instructions.

#### Path 3: View the Solution

See the fully working implementation:

```bash
# Switch to solution branch
git checkout solution

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key

# Run the application
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and interact with the complete system.

---

## 📋 What You'll Build

The complete system (available on `solution` branch) includes:

### Key Features

- **Natural Language Understanding** - Describe what you want in plain English
- **Context-Aware** - Understands time constraints, mood preferences, and group dynamics
- **Multi-Agent Architecture** - Specialized agents handle classification, parsing, ranking, and validation
- **Intelligent Ranking** - Results are sorted by relevance with personalized explanations
- **Safety Guardrails** - Input and output validation for content safety

### How It Works

The system uses a **multi-agent architecture** where specialized AI agents collaborate:

1. **Classification Agent** - Determines intent (greeting, recommendation, or out-of-scope)
2. **Parser Agent** - Extracts preferences (genre, type, time limits) and searches the catalog
3. **Ranker Agent** - Sorts results by relevance and generates explanations
4. **Greeting Agent** - Handles conversational greetings
5. **Out-of-Scope Agent** - Politely declines unrelated requests

Each agent has one clear responsibility, uses pre-defined instructions, and can hand off control to other agents. The parser agent uses a **catalog search tool** (a deterministic function) to query the movie/show database. **Input and output guardrails** validate content at system boundaries.

---

## 🏗️ Main Branch Structure

Here's what's currently in this branch:

```
src/
  app/
    page.tsx                    # Main UI (functional)
    layout.tsx                  # App layout
    globals.css                 # Global styles
    api/
      recommend/
        route.ts                # API endpoint (static response only)
  lib/
    data/
      catalog.json              # Movie and show database
    types/
      api.ts                    # Basic API types
docs/
  PITCH.md                      # Project vision and problem statement
  WORKSHOP.md                   # Guide for template branch
package.json                    # Dependencies (no OpenAI SDK yet)
tailwind.config.ts              # Tailwind configuration
tsconfig.json                   # TypeScript configuration
```

---

## 🛠️ Main Branch Quick Start

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
# Edit .env.local and add your OpenAI API key:
# OPENAI_API_KEY="sk-proj-your-actual-api-key-here"

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

**Response (Static):**

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
