# Multi-Agent Movie Picker Workshop Guide

**Welcome!** This guide walks you through building a complete multi-agent system step-by-step. Follow along during the live workshop, or use this as a self-paced guide if you're learning independently.

---

## Pre-Workshop: Setup & Prerequisites

### Git Branching Strategy

This repository uses three branches:

- **`main`** - Basic project setup with a single empty endpoint (minimal starting point)
- **`template`** - Workshop starting branch with project structure and TODOs
- **`solution`** - Complete implementation built on top of `template` with all features working

**Recommended approach for the workshop:**

Create your own branch from `template` to work independently:

```bash
# Create and switch to your own working branch
git checkout template
git checkout -b my-workshop
```

**Why create a new branch from `template`?**

- Keeps the `template` branch clean as a reference
- Allows you to start fresh or try different approaches without affecting the template
- You can always compare your work with the original template
- Enables experimenting with multiple solutions independently

**Alternative:** If you prefer, you can work directly on the `template` branch:

```bash
git checkout template
```

**To view the completed solution:**

```bash
# Switch to solution branch to see the final implementation
git checkout solution
npm run dev
```

### OpenAI API Key Setup

This workshop requires an OpenAI API key to run the agents.

**To get your API key:**

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again)

_(Note: If you're unable to generate an API key, contact me for assistance)_

**To configure your environment:**

1. Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your API key:

   ```bash
   OPENAI_API_KEY="sk-proj-your-actual-api-key-here"
   ```

3. Open `.env.local` and add your preferred model name:

   ```bash
   OPENAI_DEFAULT_MODEL="gpt-4.1-mini"
   ```

4. Save the file. The application will use this key automatically.

**Important:** Never commit `.env.local` to git - it's already in `.gitignore`.

### Postman Collection (Recommended for Development)

A Postman collection is included in the root of the project (`postman-collection.json`) to help you test the API during development without switching to the frontend.

**To use it:**

1. Open Postman (download from [postman.com](https://www.postman.com/downloads/) if needed)
2. Click **File → Import** (or click the Import button)
3. Select `postman-collection.json` from the project root
4. The collection includes ready-to-use requests for:
   - Greeting intent (positive and negative cases)
   - Movie recommendation intent (various scenarios)
   - Out-of-scope intent (positive and negative cases)
5. Make sure your dev server is running (`npm run dev`)
6. Click any request and hit **Send** to test

The collection uses `{{baseUrl}}` variable set to `http://localhost:3000` by default. All request bodies are pre-filled with test messages, so you can focus on development without typing test cases manually.

### Theory & Context

Before we code, we'll cover the theory:

- What are agents?
- What are guardrails?
- What are tools?
- What are handoffs (agent-to-agent communication)?

**Read first**: `docs/PITCH.md` - Understand what we're building and why it matters to users.

---

## Part 1: Understand the Goal

### The Application

Our system understands natural language and recommends movies/shows. Users can express three types of requests:

1. **Greeting** - "Hi", "Hello", "How are you?"
2. **Recommendation** - "I want a comedy movie", "Show me action films under 2 hours"
3. **Out of Scope** - "What's the weather?", "Tell me a joke"

### Expected Behavior

The system should recognize which type of request it is and respond appropriately:

- Greetings → Friendly greeting
- Recommendations → List of 1-6 personalized suggestions with explanations
- Out of Scope → Polite decline message

### View the Solution

You can check the completed implementation on the `solution` branch at any time:

```bash
git checkout solution
npm run dev
```

Interact with the UI and notice:

- How different inputs get routed differently
- How recommendations include explanations
- How the system handles various scenarios

**Return to your work:**

```bash
git checkout live
```

### Code Architecture (High Level)

**Frontend** (don't touch):

- `src/app/` - Next.js page
- `src/components/` - React components
- User interface and styling

**Backend** (what we'll build):

- `src/app/api/recommend/route.ts` - API endpoint that receives messages
- `src/lib/agents-sdk/agents/` - Agent definitions (5 files)
- `src/lib/agents-sdk/tools/` - Tool definitions for searching
- `src/lib/agents-sdk/instructions.ts` - Agent instructions (pre-written)
- `src/lib/agents-sdk/guardrails/` - Safety validators (pre-written)

**Data & Utilities** (pre-written):

- `src/types/` - TypeScript interfaces
- `src/utils/responseFormatter.ts` - Response transformation
- `src/data/catalog.json` - Movie/show database

---

## Part 2: Start with the API Route

**File**: `src/app/api/recommend/route.ts`

### What This File Does

The API endpoint receives POST requests with a message and returns recommendations. Currently it has:

- ✅ Request parsing
- ✅ Message validation
- ❓ TODO: Execute the agent system
- ❓ TODO: Format and return the response

### Your Task

Find the TODO comment and implement:

1. Implement and call `executeMultiAgentSystem(message)` to run the agent workflow
2. Use `formatResponse()` to transform the result into API response format
3. Return the formatted response as JSON

> Note: We'll add guardrail error handling later, after we understand guardrails.

---

## Part 3: Understand the Request Flow

Let's think about what needs to happen:

A user sends: _"I want a comedy movie"_

Our system needs to:

1. **Understand the intent** - "This is a recommendation request, not a greeting or something random"
2. **Route correctly** - Send this to the recommendation system, not the greeting handler
3. **Extract preferences** - "comedy" = Comedy genre, "movie" = film type
4. **Search** - Find matching movies
5. **Rank** - Sort by relevance
6. **Explain** - Tell the user why each recommendation fits

### The Solution: Agent Specialization

We'll use **5 different agents**, each with one job:

1. **Classification Agent** - "What is the user asking for?"
2. **Greeting Agent** - "Respond to greetings"
3. **Out of Scope Agent** - "Politely decline non-movie requests"
4. **Parser Agent** - "Extract preferences and search"
5. **Ranker Agent** - "Sort results and explain them"

The classification agent is the **orchestrator** — it decides which specialist to use.

---

## Part 4: Build the Classification Agent (The Orchestrator)

**File**: `src/lib/agents-sdk/agents/classificationAgent.ts`

### Purpose

Classify user intent into one of three categories:

1. **Greeting** → Route to Greeting Agent
2. **Recommendation** → Route to Parser Agent
3. **Out of Scope** → Route to Out of Scope Agent

### What You'll Build

In `classificationAgent.ts`:

- TODO: Use `Agent.create()` to define a new agent
- TODO: Provide the classification instructions (from `instructions.ts`)
- TODO: Attach the input guardrail (we'll learn about this later)
- TODO: Add handoffs to the three specialized agents

### The Instructions

The `CLASSIFICATION_AGENT_INSTRUCTIONS` (in `instructions.ts`) are pre-written. Review them to understand:

- How to classify an intent
- The three categories
- When to handoff to each agent

### Entry Point

In `src/lib/agents-sdk/agents/index.ts`:

- TODO: Create `executeMultiAgentSystem(message)` function
- TODO: Run the classification agent with the user message
- TODO: Return the result

### Wire to API

In `src/app/api/recommend/route.ts`:

- TODO: Call `executeMultiAgentSystem()` with the user's message
- TODO: Format the response
- TODO: Return it as JSON

**Test checkpoint**: Can you trace from the API route → classification agent → output?

---

## Part 5: Build the Simple Agents (Greeting & Out of Scope)

**Files**:

- `src/lib/agents-sdk/agents/greetingAgent.ts`
- `src/lib/agents-sdk/agents/outOfScopeAgent.ts`

### Greeting Agent

Handles greetings and responds warmly.

- TODO: Create using `Agent.create()`
- TODO: Use `GREETING_AGENT_INSTRUCTIONS`
- Simple agent with no tools or guardrails

### Out of Scope Agent

Handles requests unrelated to movies/shows.

- TODO: Create using `Agent.create()`
- TODO: Use `OUT_OF_SCOPE_AGENT_INSTRUCTIONS`
- Simple agent with no tools or guardrails

### Instructions

Both instructions are pre-written in `instructions.ts`. Review to understand what response each should give.

### Update Classification Agent

Don't forget: Add both agents as handoffs in the classification agent!

```
classificationAgent handoffs: [greetingAgent, outOfScopeAgent, ...]
```

### Test Point 1: Intent Classification ✓

After implementing these agents, run the automated tests:

```bash
npm test -- --testNamePattern="Greeting Intent|Out of Scope Intent"
```

Or manually test with `npm run dev` and try these prompts:

- **"hi"** → Should get a friendly greeting
- **"What's the weather?"** → Should get a polite decline

If these work, you've successfully implemented:

- ✅ Agent creation
- ✅ Agent classification
- ✅ Agent handoffs

Congratulations! The scaffolding is working. 🎉

---

## Part 6: Build the Recommendation System

Now for the complex part. Three components work together:

1. **Parser Agent** - "What does the user want?"
2. **Tool** - "Search for matching movies"
3. **Ranker Agent** - "Sort and explain results"

### Step 6A: Define the Catalog Search Tool

**File**: `src/lib/agents-sdk/tools/catalogSearchTool.ts`

The `searchCatalog()` helper function is pre-written in `src/lib/agents-sdk/util/helpers.ts`. This function contains the actual search logic (filtering by type, genres, and time constraints). Your job is to define the tool that wraps this helper:

- TODO: Define a Zod schema with three parameters:

  - `typePreference`: enum of ["movie", "show", "any"]
  - `genresInclude`: array of strings (genre names)
  - `timeLimitMinutes`: number or null (runtime limit)

- TODO: Create the tool definition:
  - Set a descriptive `name`
  - Set a clear `description` of what it does
  - In the `execute` function, import and call `searchCatalog(query)` from the helpers file
  - Return the results

**Note**: The `searchCatalog()` function is just a helper that can be replaced with any implementation (API calls, database queries, etc.). For this workshop, it's a simple filter function over the local catalog.

### Step 6B: Create the Parser Agent

**File**: `src/lib/agents-sdk/agents/parserAgent.ts`

The parser agent extracts user preferences and uses the search tool.

- TODO: Create using `Agent.create()`
- TODO: Use `PARSER_AGENT_INSTRUCTIONS`
- TODO: Attach the catalog search tool
- TODO: Add handoff to the ranker agent (we'll create it next)

### Parser Instructions Guide

Read `PARSER_AGENT_INSTRUCTIONS` carefully. It explains:

- How to extract: type (movie/show/any), genres, time limit
- When and how to use the catalog search tool
- Advanced: Handling OR logic (e.g., "action movie OR comedy show" = multiple searches)
- When to handoff results to the ranker

This is where complex logic lives.

### Step 6C: Create the Ranker Agent

**File**: `src/lib/agents-sdk/agents/rankerAgent.ts`

The ranker agent receives search results and ranks them.

- TODO: Create using `Agent.create()`
- TODO: Use `RANKER_AGENT_INSTRUCTIONS`
- TODO: Attach the output guardrail (we'll learn about this later)

### Ranker Instructions Guide

Read `RANKER_AGENT_INSTRUCTIONS` carefully. It explains:

- How to rank results (by year, newest first)
- How to generate friendly explanations (1-2 sentences each)
- Output format: Must be JSON with specific structure
- Critical rule: **Never make up movie titles** — only use search results

### Update Classification Agent

Add the parser agent as a handoff:

```
classificationAgent handoffs: [greetingAgent, outOfScopeAgent, parserAgent]
```

### Test Point 2: Recommendation Flow ✓

After building all three recommendation agents, run:

```bash
npm test -- --testNamePattern="Recommendation Intent"
```

Or manually test with `npm run dev` and try these prompts:

- **"I want a comedy movie"** → Should get recommendations
- **"Show me action films"** → Should search by genre
- **"Something under 2 hours"** → Should filter by runtime
- **"Funny and exciting"** → Should handle multiple genres

If these work, you've built the core system! ✅

**What's working:**

- ✅ Intent classification
- ✅ Agent specialization
- ✅ Tool integration
- ✅ Tool results processing

---

## Part 7: Add Guardrails for Safety & Validation

Now we make the system robust. Two types of guardrails:

### Input Guardrail

**File**: `src/lib/agents-sdk/guardrails/inputGuardrail.ts` (pre-written)

**Purpose**: Validate the user's request BEFORE processing

**What it checks**:

- Offensive language
- Message length
- Empty inputs

**When it runs**: FIRST, before the classification agent

**Where to attach**: Classification agent as `inputGuardrails`

**If it fails**: Returns a 400 error (bad request)

### Output Guardrail

**File**: `src/lib/agents-sdk/guardrails/outputGuardrail.ts` (pre-written)

**Purpose**: Validate the final response AFTER all agents run

**What it checks**:

- Response is properly formatted (JSON or text)
- Recommendations have all required fields
- No hallucinated (made-up) titles
- Max 10 recommendations

**When it runs**: LAST, after the ranker agent

**Where to attach**: Ranker agent as `outputGuardrails`

**If it fails**: Returns a 500 error (processing error)

### Review the Implementations

Study both guardrail files to understand:

- What validation rules they implement
- What errors they can trigger
- How error objects work

---

## Part 8: Add Error Handling to API Route

**File**: `src/app/api/recommend/route.ts`

Now that we understand guardrails, add error handling:

- TODO: Import `InputGuardrailTripwireTriggered` and `OutputGuardrailTripwireTriggered`
- TODO: Wrap `executeMultiAgentSystem()` in try-catch
- TODO: Catch input guardrail errors → Return 400 status with error message
- TODO: Catch output guardrail errors → Return 500 status with error message
- TODO: Catch unexpected errors → Return generic 500 error

This completes the end-to-end error handling.

### Test Guardrails (Optional)

Test that error handling works:

- **Offensive input** → Should return 400 error
- **Malformed output** → Should return 500 error
- **Valid request** → Should work normally

---

## Complete System Diagram

Here's how all the pieces connect:

```
┌──────────────────────────────────────────────────────────────┐
│                      USER REQUEST                           │
│           "I want a comedy movie under 2 hours"            │
└──────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  API Route          │
                    │  Parse request      │
                    │  Validate message   │
                    └─────────────────────┘
                              ↓
                   ┌────────────────────────┐
                   │  INPUT GUARDRAIL       │
                   │  Check for safety      │
                   │  If bad → Return 400   │
                   └────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────────────┐
        │    CLASSIFICATION AGENT (Orchestrator)          │
        │    "This is a RECOMMENDATION request"           │
        └─────────────────────────────────────────────────┘
                              ↓
                   ┌────────────────────────┐
                   │  PARSER AGENT          │
                   │  Extract preferences:  │
                   │  - Type: movie         │
                   │  - Genre: Comedy       │
                   │  - Time: 120 minutes   │
                   └────────────────────────┘
                              ↓
                   ┌────────────────────────┐
                   │  CATALOG SEARCH TOOL   │
                   │  Find matching movies  │
                   │  Return results        │
                   └────────────────────────┘
                              ↓
                   ┌────────────────────────┐
                   │  RANKER AGENT          │
                   │  Sort by year          │
                   │  Generate explanations │
                   │  Return JSON           │
                   └────────────────────────┘
                              ↓
                   ┌────────────────────────┐
                   │  OUTPUT GUARDRAIL      │
                   │  Validate format       │
                   │  If bad → Return 500   │
                   └────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  Format Response    │
                    │  (formatResponse)   │
                    └─────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    JSON RESPONSE                             │
│  {                                                           │
│    message: "Here are recommendations...",                 │
│    recommendations: [                                       │
│      { name: "...", genre: "...", explanation: "..." },    │
│      ...                                                     │
│    ],                                                        │
│    metadata: { ... }                                         │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

**Key Points in the Flow:**

- Input guardrail runs FIRST (prevent bad input)
- Classification agent routes to appropriate handler
- Recommendation flow: Parser → Tool → Ranker
- Output guardrail runs LAST (validate output)
- Error handling catches guardrail failures

---

## Testing Checklist

We have automated tests in `tests/api-recommend.test.ts`. Run them with:

```bash
npm test
```

Or watch mode for continuous testing:

```bash
npm run test:watch
```

### ✓ Checkpoint 1: Classification

Run:

```bash
npm test -- --testNamePattern="Greeting Intent"
```

Expected: All tests pass ✓

### ✓ Checkpoint 2: Out of Scope

Run:

```bash
npm test -- --testNamePattern="Out of Scope Intent"
```

Expected: All tests pass ✓

### ✓ Checkpoint 3: Recommendation

Run:

```bash
npm test -- --testNamePattern="Recommendation Intent"
```

Expected: All tests pass ✓

### ✓ Checkpoint 4: Error Handling

Run:

```bash
npm test -- --testNamePattern="Error Handling"
```

Expected: All tests pass ✓

### ✓ Checkpoint 5: Full Test Suite

Run all tests:

```bash
npm test
```

Expected: All tests pass ✓

---

## Key Concepts Reference

| Concept         | What It Does                                      | Example                            |
| --------------- | ------------------------------------------------- | ---------------------------------- |
| **Agent**       | Independent entity with one responsibility        | Classification Agent, Ranker Agent |
| **Instruction** | Guides how an agent behaves                       | "Classify into 3 categories"       |
| **Handoff**     | Routes control from one agent to another          | Classification → Greeting Agent    |
| **Tool**        | Extends agent capability (deterministic function) | catalogSearchTool                  |
| **Guardrail**   | Validates input/output, triggers errors           | InputGuardrail, OutputGuardrail    |
| **Execute**     | Runs the entire multi-agent workflow              | executeMultiAgentSystem(message)   |

---

## Common Issues & Solutions

### "Classification not routing correctly"

- [ ] Verify classification instructions are being used
- [ ] Check that handoffs list all three agents
- [ ] Ensure handoff agents are defined in their files

### "Tool not returning results"

- [ ] Verify Zod schema parameter names match what you're passing
- [ ] Check that searchCatalog() is being imported from `src/lib/agents-sdk/util/helpers.ts`
- [ ] Verify searchCatalog() is being called with the correct parameters
- [ ] Confirm genres/types match the catalog.json data
- [ ] Review tool execute function logic

### "Ranker output is invalid (guardrail error)"

- [ ] Check output is valid JSON
- [ ] Verify all required fields are present
- [ ] Ensure recommendations use only catalog items
- [ ] Review ranker instructions for output format

### "API route not executing agents"

- [ ] Verify executeMultiAgentSystem is imported correctly
- [ ] Check that formatResponse() is called on result
- [ ] Ensure you're returning NextResponse.json()
- [ ] Look for error messages in console

### "Agents defined but not being called"

- [ ] Verify agents are exported from their files
- [ ] Check that index.ts imports all agents
- [ ] Ensure executeMultiAgentSystem runs the classification agent
- [ ] Verify classification agent is called from API route

---

## What You've Built

By completing this workshop, you've implemented:

- ✅ **API Endpoint** - Receives messages and returns responses
- ✅ **5 Specialized Agents** - Each with one clear responsibility
- ✅ **Agent Orchestration** - Classification agent routes to specialists
- ✅ **Tool Integration** - Parser agent uses search tool
- ✅ **Agent Handoffs** - Agents communicate with each other
- ✅ **Input Validation** - Guardrails check user requests
- ✅ **Output Validation** - Guardrails validate recommendations
- ✅ **Error Handling** - API gracefully handles guardrail failures

### What You've Learned

1. **Agent Specialization** - One responsibility per agent
2. **Agent Communication** - Handoffs enable delegation
3. **Tool Integration** - Extending agents with external functions
4. **Guardrails** - Safety and validation
5. **Error Handling** - Graceful degradation
6. **System Design** - How to architect AI systems

### Next Steps

This foundation enables you to build:

- More complex recommendation systems
- Content moderation pipelines
- Multi-step reasoning systems
- Distributed agent networks
- Custom tools and guardrails

**You now understand multi-agent architecture!** 🚀

---

## Additional Resources

- **Instructions**: `src/lib/agents-sdk/instructions.ts` - Study the detailed instructions for each agent
- **Guardrails**: `src/lib/agents-sdk/guardrails/` - Review how validation works
- **Types**: `src/types/agent.ts` and `src/types/api.ts` - Understand data structures
- **Catalog**: `src/data/catalog.json` - See what data is available
- **Tests**: `tests/api-recommend.test.ts` - Automated tests for all 3 intents and error handling
- **Pitch**: `docs/PITCH.md` - Remember why this matters to users

---

**Good luck! You've got this! 💪**
