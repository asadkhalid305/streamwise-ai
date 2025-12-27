# System Architecture

This document provides a detailed view of how the Multi-Agent Movie Recommendation System is architected, including data flow, agent interactions, and error handling strategies.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Request Flow](#request-flow)
- [Agent Interaction Patterns](#agent-interaction-patterns)
- [Data Flow](#data-flow)
- [Error Handling Strategy](#error-handling-strategy)
- [Component Responsibilities](#component-responsibilities)
- [Technology Stack](#technology-stack)

---

## High-Level Architecture

The system follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  - Next.js App Router (React 19)                           │
│  - User Interface (page.tsx, components/)                  │
│  - Theme Management (ThemeScript.tsx)                      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP (POST /api/recommend)
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  - Request Parsing                                         │
│  - Input Validation                                        │
│  - Response Formatting                                     │
│  - Error Handling                                          │
└─────────────────────────────────────────────────────────────┘
                            ↕ Function Call
┌─────────────────────────────────────────────────────────────┐
│                  Multi-Agent System                         │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Input Guardrails (Safety Validation)            │    │
│  └───────────────────────────────────────────────────┘    │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Classification Agent (Orchestrator)              │    │
│  └───────────────────────────────────────────────────┘    │
│           │              │              │                   │
│    ┌──────┴──────┐  ┌───┴───┐  ┌──────┴────────┐         │
│    │  Greeting   │  │ Parser │  │ Out of Scope  │         │
│    │  Agent      │  │ Agent  │  │ Agent         │         │
│    └─────────────┘  └────────┘  └───────────────┘         │
│                          │                                  │
│                     ┌────┴────┐                            │
│                     │  Tools  │ (Catalog Search)           │
│                     └────┬────┘                            │
│                          │                                  │
│                    ┌─────┴──────┐                          │
│                    │  Ranker    │                          │
│                    │  Agent     │                          │
│                    └────────────┘                          │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────┐    │
│  │  Output Guardrails (Format Validation)           │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ Data Access
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  - TMDB API (External Service)                            │
│  - src/services/tmdb.ts (API Client)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### Complete Request Journey

```
1. USER SENDS REQUEST
   ↓
   POST /api/recommend
   Body: { message: "I want a comedy movie" }

2. API ROUTE HANDLER
   ↓
   - Parse request body
   - Extract message
   - Validate message exists

3. INPUT GUARDRAIL
   ↓
   - Check for offensive content
   - Validate message length
   - Ensure non-empty
   - If fails → Return 400 error

4. CLASSIFICATION AGENT (Orchestrator)
   ↓
   - Analyze user intent
   - Classify as: greeting | recommendation | out_of_scope
   - Decide which agent to handoff to

5A. GREETING PATH             5B. RECOMMENDATION PATH         5C. OUT OF SCOPE PATH
    ↓                             ↓                               ↓
    Greeting Agent                Parser Agent                    Out of Scope Agent
    ↓                             ↓                               ↓
    Generate friendly             - Extract preferences            Generate polite
    response                      - type: movie                    decline message
    ↓                             - genres: [Comedy]               ↓
    Return text                   - timeLimitMinutes: null         Return text
                                  ↓
                                  Use catalogSearchTool
                                  ↓
                                  - Query TMDB API
                                  - Filter by type & genres
                                  - Apply time constraint
                                  ↓
                                  Handoff to Ranker Agent
                                  ↓
                                  - Sort by year (newest first)
                                  - Generate explanations
                                  - Format as JSON
                                  ↓
                                  OUTPUT GUARDRAIL
                                  ↓
                                  - Validate JSON structure
                                  - Check required fields
                                  - Verify no hallucinations
                                  - Ensure ≤ 12 recommendations
                                  - If fails → Return 500 error

6. FORMAT RESPONSE
   ↓
   - Transform agent result
   - Add metadata (timestamp, etc.)
   - Structure JSON response

7. RETURN TO USER
   ↓
   200 OK (success)
   400 Bad Request (input guardrail)
   500 Server Error (output guardrail or system error)
```

---

## Agent Interaction Patterns

### Pattern 1: Orchestrator → Specialist (Classification)

```
┌────────────────────┐
│  Classification    │ ← Receives all user requests
│  Agent             │
└────────────────────┘
         │
         │ Analyzes intent
         │
    ┌────┴────┬────────────┐
    ↓         ↓            ↓
┌─────────┐ ┌─────────┐ ┌─────────┐
│Greeting │ │ Parser  │ │Out of   │ ← Specialists handle specific intents
│Agent    │ │ Agent   │ │Scope    │
└─────────┘ └─────────┘ └─────────┘
```

**Key Points:**

- Classification agent never generates final responses
- Always hands off to a specialist
- Specialists don't hand back to classification

### Pattern 2: Sequential Processing (Parser → Ranker)

```
┌────────────────────┐
│  Parser Agent      │ ← Extracts preferences + searches
└────────────────────┘
         │
         │ Passes search results
         ↓
┌────────────────────┐
│  Ranker Agent      │ ← Sorts + explains
└────────────────────┘
```

**Key Points:**

- Parser doesn't generate final output
- Parser focuses on search, Ranker focuses on presentation
- Clear handoff of structured data (search results)

### Pattern 3: Agent + Tool Integration

```
┌────────────────────┐
│  Parser Agent      │
└────────────────────┘
         │
         │ Needs data
         ↓
┌────────────────────┐
│ catalogSearchTool  │ ← Deterministic function
└────────────────────┘
         │
         │ Returns results
         ↓
┌────────────────────┐
│  Parser Agent      │ ← Continues with results
└────────────────────┘
```

**Key Points:**

- Tools are synchronous/deterministic
- Agent decides when to use tool
- Agent interprets tool results
- Tools don't call other agents

---

## Data Flow

### Input Data Transformation

```
User Message (String)
    ↓
"I want a comedy movie under 2 hours"
    ↓
Parser Agent Extracts
    ↓
{
  typePreference: "movie",
  genresInclude: ["Comedy"],
  timeLimitMinutes: 120
}
    ↓
catalogSearchTool Query
    ↓
Search Results (Array)
    ↓
[
  { name: "Movie A", type: "movie", genres: ["Comedy"], runtimeMinutes: 99, ... },
  { name: "Movie B", type: "movie", genres: ["Comedy"], runtimeMinutes: 110, ... }
]
    ↓
Ranker Agent Processes
    ↓
Sorted + Explained Results
    ↓
{
  recommendations: [
    { rank: 1, name: "Movie A", explanation: "...", ... },
    { rank: 2, name: "Movie B", explanation: "...", ... }
  ]
}
    ↓
Response Formatter
    ↓
{
  message: "Here are some comedy movies under 2 hours:",
  recommendations: [...],
  metadata: { totalResults: 2, timestamp: "..." }
}
```

### State Management

**Important:** This system is **stateless** - each request is independent.

- **No conversation history** - Each request processed in isolation
- **No user profiles** - No personalization based on past requests
- **No session management** - No login or user tracking

**Implications:**

- ✅ Simple and scalable
- ✅ Easy to test and debug
- ✅ No data persistence concerns
- ❌ Cannot reference previous requests
- ❌ Cannot learn user preferences over time

**To add state:** Would need to pass conversation history to agents and implement memory management.

---

## Error Handling Strategy

### Error Types & Handling

```
┌──────────────────────────────────────────────────────────┐
│                    Error Categories                      │
└──────────────────────────────────────────────────────────┘

1. INPUT ERRORS (400 Bad Request)
   ├─ Empty message
   ├─ Message too long
   ├─ Offensive content (input guardrail)
   └─ Invalid JSON in request body

2. PROCESSING ERRORS (500 Server Error)
   ├─ Invalid output format (output guardrail)
   ├─ Hallucinated content (output guardrail)
   ├─ Tool execution failure
   ├─ Agent execution failure
   └─ OpenAI API errors

3. SYSTEM ERRORS (500 Server Error)
   ├─ Unexpected exceptions
   ├─ Missing environment variables
   └─ Internal bugs
```

### Error Flow

```typescript
try {
  // 1. Input Guardrail Check
  const result = await executeMultiAgentSystem(message);
  // 2. Output Guardrail Check (inside agent system)
} catch (error) {
  if (error instanceof InputGuardrailTripwireTriggered) {
    // User's fault - bad input
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof OutputGuardrailTripwireTriggered) {
    // System's fault - bad output
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  // Unknown error
  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}
```

### Guardrail Integration Points

```
Request → [Input Guardrail] → Agent System → [Output Guardrail] → Response
            ↓                                      ↓
         400 Error                             500 Error
```

**Input Guardrail** attached to: Classification Agent (first agent)  
**Output Guardrail** attached to: Ranker Agent (last agent before response)

---

## Component Responsibilities

### Frontend (`src/app/`, `src/components/`)

| Component         | Responsibility                       |
| ----------------- | ------------------------------------ |
| `page.tsx`        | Main UI, user input, display results |
| `MovieCard.tsx`   | Render individual recommendations    |
| `layout.tsx`      | App shell, metadata, global styles   |
| `ThemeScript.tsx` | Dark/light theme management          |
| `globals.css`     | Global styles (Tailwind)             |

### API Layer (`src/app/api/recommend/`)

| Function              | Responsibility                                                |
| --------------------- | ------------------------------------------------------------- |
| `POST /api/recommend` | Parse request, execute agents, handle errors, format response |

### Agent System (`src/lib/agents-sdk/agents/`)

| Agent                    | Responsibility                                         |
| ------------------------ | ------------------------------------------------------ |
| `classificationAgent.ts` | Route to appropriate specialist based on intent        |
| `greetingAgent.ts`       | Respond to greetings warmly                            |
| `outOfScopeAgent.ts`     | Decline non-movie requests politely                    |
| `parserAgent.ts`         | Extract preferences, search catalog, handoff to ranker |
| `rankerAgent.ts`         | Sort results, generate explanations, format JSON       |

### Tools (`src/lib/agents-sdk/tools/`)

| Tool                   | Responsibility                                   |
| ---------------------- | ------------------------------------------------ |
| `catalogSearchTool.ts` | Search catalog by type, genres, time constraints |

### Guardrails (`src/lib/agents-sdk/guardrails/`)

| Guardrail            | Responsibility                                    |
| -------------------- | ------------------------------------------------- |
| `inputGuardrail.ts`  | Validate user input for safety and format         |
| `outputGuardrail.ts` | Validate agent output for correctness and quality |

### Utilities

| File                   | Responsibility                                |
| ---------------------- | --------------------------------------------- |
| `instructions.ts`      | Agent instructions (behavior definitions)     |
| `responseFormatter.ts` | Transform agent output to API response format |

### Data

| File               | Responsibility                  |
| ------------------ | ------------------------------- |
| `src/services/tmdb.ts` | TMDB API client & search logic |

### Types

| File       | Responsibility                      |
| ---------- | ----------------------------------- |
| `agent.ts` | Agent-related TypeScript interfaces |
| `api.ts`   | API request/response types          |
| `tmdb.ts`  | TMDB API response types             |

---

## Technology Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### AI/Agents

- **OpenAI Agents SDK** (`@openai/agents`) - Multi-agent orchestration
- **Zod** - Schema validation for tools

### Styling

- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library

### Testing

- **Jest** - Unit and integration tests
- **Postman Collection** - API testing

### Development

- **ESLint** - Code linting
- **PostCSS** - CSS processing

### Deployment

- **Vercel** (recommended) - Serverless Next.js hosting
- **Node.js 18+** - Runtime environment

---

## Design Principles

### 1. Separation of Concerns

Each agent, tool, and guardrail has ONE clear responsibility.

### 2. Fail Fast

Guardrails catch errors at boundaries (input/output) before they propagate.

### 3. Composability

Agents can be reused and combined in different workflows.

### 4. Testability

Each component can be tested in isolation.

### 5. Clarity

Code structure mirrors conceptual architecture - easy to understand.

### 6. Statelessness

No session management - each request is independent and simple.

### 7. Error Transparency

Different error types return different status codes (400 vs 500).

---

## Scaling Considerations

### Current Limitations

- Single catalog file (220 items) - not scalable to large datasets
- Synchronous processing - can't handle high concurrency
- No caching - repeated queries aren't optimized
- No rate limiting - vulnerable to abuse

### Future Enhancements

- **Database integration** - Replace catalog.json with PostgreSQL/MongoDB
- **Caching layer** - Redis for frequent queries
- **Async processing** - Queue system for high load
- **Rate limiting** - Protect against abuse
- **Conversation memory** - Track user context across requests
- **User profiles** - Personalize based on preferences
- **A/B testing** - Experiment with different agent instructions
- **Monitoring** - Track agent performance and errors

---

## Next Steps

- **Build it:** Follow [WORKSHOP.md](WORKSHOP.md) to implement from scratch
- **Understand it:** Read [CONCEPTS.md](CONCEPTS.md) for detailed explanations
- **Extend it:** Add new agents, tools, or guardrails based on this architecture
