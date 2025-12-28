# StreamWise AI

_A production-ready Next.js application AND comprehensive learning resource for building multi-agent AI systems._

**End decision fatigue. Get personalized movie and show recommendations in seconds.**

This project demonstrates how to build intelligent, context-aware recommendation systems using the [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/). It serves as both a working application and an educational workshop for learning multi-agent architecture.

---

## Demo

![Watch Demo On Youtube](assets/demo-thumbnail.png)

[▶️ Watch Demo on YouTube](https://youtube.com/shorts/XWmIb7g4oiw?feature=share)

---

## 🎯 Two Ways to Use This Repository

### 1. **Use the Working Application** (main branch)

Clone and run immediately - get a production-ready movie recommendation system powered by multi-agent AI.

**Perfect for:** Developers who want to see multi-agent systems in action, or those looking to build upon a working foundation.

### 2. **Learn Multi-Agent Architecture** (template branch)

Build the entire system yourself, step-by-step, with guided instructions.

**Perfect for:** Engineers learning about AI agent orchestration, handoffs, tools, and guardrails.

---

## What It Does

**StreamWise AI** removes the friction from choosing what to watch. Instead of clicking through endless filters or scrolling for 30 minutes, simply describe what you want:

> "I have a 1-hour flight. Something light and funny."

> "Action movies from the 90s with Tom Cruise."

> "High-rated Korean dramas released this year."

The system understands your intent, extracts constraints (time, genre, era, cast, language), searches the live TMDB database, and returns personalized recommendations with clear explanations of why each one fits your request.

### Key Features

- **Natural Language Understanding** - Describe what you want in plain English
- **Deep Semantic Search** - Filter by Actor, Director, Year, Language, Rating, and more
- **Real-Time Data** - Connects directly to TMDB API for the latest movies and shows
- **Context-Aware** - Understands time constraints, mood preferences, and group dynamics
- **Multi-Agent Architecture** - Specialized agents handle classification, parsing, ranking, and validation
- **Intelligent Ranking** - Results sorted by relevance with personalized explanations
- **Safety Guardrails** - Input and output validation for content safety
- **Built with OpenAI Agents SDK** - Production-ready agent orchestration framework

---

## How It Works - Multi-Agent Architecture

The system uses a **multi-agent architecture** powered by the [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/), where specialized AI agents collaborate:

1. **Classification Agent** - Determines intent (greeting, recommendation, or out-of-scope)
2. **Parser Agent** - Extracts preferences (genre, type, year, cast, etc.) and searches TMDB
3. **Ranker Agent** - Sorts results by relevance and generates personalized explanations
4. **Greeting Agent** - Handles conversational greetings
5. **Out-of-Scope Agent** - Politely declines unrelated requests

Each agent has one clear responsibility, uses pre-defined instructions, and can hand off control to other agents. The parser agent uses a **catalog search tool** (a deterministic function) to query the **The Movie Database (TMDB) API**. **Input and output guardrails** validate content at system boundaries.

**Learn more:** See [CONCEPTS.md](docs/CONCEPTS.md) for detailed explanations and [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design.

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/streamwise-ai.git
cd streamwise-ai

# Install dependencies
npm install

# Option 1: Use environment variable (recommended for local development)
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key and preferred model:
# OPENAI_API_KEY="sk-proj-your-actual-api-key-here"
# OPENAI_DEFAULT_MODEL="gpt-4.1-mini"

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Option 2: Provide API key at runtime**

If you don't set the `OPENAI_API_KEY` environment variable, the application will automatically prompt you for your OpenAI API key when you first launch it. The key is securely stored in your browser's session storage and is only sent to OpenAI's API.

This runtime option is perfect for:

- **Public deployments** - Share the app URL and let users provide their own keys
- **Testing different keys** - Easily switch between API keys without redeploying
- **Security** - Keys are never stored on the server, only in the user's browser session
- **Cost control** - Each user pays for their own API usage

### Deployment to Vercel

This app is designed for seamless deployment on Vercel (or similar platforms that support Next.js).

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/streamwise-ai)

**Manual Deployment:**

1. Push your code to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables (optional):
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `OPENAI_DEFAULT_MODEL` - Model to use (default: gpt-4.1-mini)
4. Deploy!

**Two Deployment Strategies:**

| Strategy       | Setup                                   | Use Case                                   | Cost                               |
| -------------- | --------------------------------------- | ------------------------------------------ | ---------------------------------- |
| **Shared Key** | Set `OPENAI_API_KEY` in Vercel env vars | Demo, internal tool, you control costs     | You pay for all API calls          |
| **User Keys**  | Don't set env var                       | Public app, let users bring their own keys | Each user pays for their own usage |

If you don't set `OPENAI_API_KEY` on Vercel, users will see a modal prompting them to enter their own API key when they first use the app. The key is stored securely in their browser session.

📘 **[View detailed deployment guide →](DEPLOYMENT.md)**

**Why not GitHub Pages?** GitHub Pages only supports static files. Next.js API routes require a Node.js server, which Vercel provides automatically.

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

## Learning Path 🎓

This repository is designed as both a working application and a comprehensive learning resource for building multi-agent systems.

### Prerequisites for Learning

- Basic understanding of TypeScript/React
- Familiarity with REST APIs
- OpenAI API account ([Get API key here](https://platform.openai.com/api-keys))
- Understanding of async/await and promises

### Workshop Structure

The repository uses a **two-branch strategy** for learning:

| Branch         | Purpose                          | Use Case                                             |
| -------------- | -------------------------------- | ---------------------------------------------------- |
| **`main`**     | Complete, working implementation | Reference solution, production use, see it in action |
| **`template`** | Starting point with TODOs        | Build it yourself, step-by-step learning             |

### How to Learn: Build It Yourself

**Step 1:** Check out the template branch

```bash
git checkout template
git checkout -b my-implementation
```

**Step 2:** Follow the step-by-step guide in [docs/WORKSHOP.md](docs/WORKSHOP.md), which walks you through:

- Understanding agent architecture and when to use multi-agent systems
- Implementing each specialized agent
- Integrating tools for external functionality
- Adding guardrails for safety and validation
- Testing and debugging the complete system

**Step 3:** Reference documentation as needed:

- [CONCEPTS.md](docs/CONCEPTS.md) - Core multi-agent concepts explained (agents, handoffs, tools, guardrails)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design deep-dive
- [TEST_PROMPTS.md](docs/TEST_PROMPTS.md) - Comprehensive test scenarios

**Step 4:** Compare with the solution

```bash
git checkout main
npm run dev
```

### Learning Outcomes

After completing the workshop, you will understand:

✅ **Agent Specialization** - When and how to break problems into specialized agents  
✅ **Agent Communication** - How agents hand off control to each other  
✅ **Tool Integration** - Extending agents with deterministic functions  
✅ **Guardrails** - Implementing safety and validation at system boundaries  
✅ **Error Handling** - Managing failures gracefully in multi-agent systems  
✅ **System Design** - Architecting scalable AI applications

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

**Error Responses:**

```json
// 400 Bad Request (Input validation failed)
{
  "error": "Message contains inappropriate content"
}

// 500 Server Error (Output validation failed or system error)
{
  "error": "An error occurred while processing your request"
}
```

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **AI/Agents:** [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/) - Multi-agent orchestration framework
- **Schema Validation:** Zod (for tool parameters)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Testing:** Jest

---

## Project Structure

```
src/
  app/
    page.tsx                    # Main UI with API key modal integration
    layout.tsx                  # Root layout with ApiKeyProvider
    api/recommend/route.ts      # API endpoint (supports env var + custom keys)
  lib/
    agents-sdk/
      agents/                   # 5 specialized agents
        classificationAgent.ts  # Orchestrator - routes to specialists
        greetingAgent.ts        # Handles greetings
        outOfScopeAgent.ts      # Handles non-movie requests
        parserAgent.ts          # Extracts preferences + searches
        rankerAgent.ts          # Sorts + explains results
        index.ts                # Entry point (supports custom API keys)
      tools/                    # External functionality
        catalogSearchTool.ts    # Search catalog by preferences
      guardrails/               # Input/output validation
        inputGuardrail.ts       # Validates user input for safety
        outputGuardrail.ts      # Validates agent output for quality
      instructions.ts           # Agent instructions (behavior definitions)
  components/
    MovieCard.tsx               # UI component for recommendations
    ApiKeyModal.tsx             # Modal for API key input
  contexts/
    ApiKeyContext.tsx           # API key state management
  services/
    tmdb.ts                     # TMDB API integration service
  types/
    agent.ts                    # Agent-related types
    api.ts                      # API types
    tmdb.ts                     # TMDB API response types
docs/
  CONCEPTS.md                   # Multi-agent concepts explained
  ARCHITECTURE.md               # System design deep-dive
  WORKSHOP.md                   # Step-by-step implementation guide
  PITCH.md                      # Project vision and problem statement
  TEST_PROMPTS.md               # Test cases for all scenarios
DEPLOYMENT.md                   # Detailed deployment guide (new)
tests/
  api-recommend.test.ts         # Automated API tests
```

---

## Why This Matters

**StreamWise AI** demonstrates how to build intelligent systems that:

- **Respect user time** - No endless scrolling or filter clicking
- **Understand context** - Not just keywords, but intent and constraints
- **Explain decisions** - Clear reasoning for each recommendation
- **Scale gracefully** - Multi-agent architecture handles complexity through specialization

The same principles apply to any domain requiring intelligent decision-making: customer support, content moderation, data analysis, workflow automation, and more.

---

## Security & API Key Management

This application implements a flexible API key management system that works for both local development and production deployments:

### How It Works

1. **Environment Variable (Server-Side)**: If `OPENAI_API_KEY` is set in `.env.local` or Vercel environment variables, it's used automatically for all users
2. **Runtime Input (Client-Side)**: If no environment variable is found, users are prompted to enter their own API key via a modal dialog
3. **Session Storage**: Client-provided keys are stored in browser session storage (cleared when browser tab closes)
4. **Secure Transmission**: Keys are sent to your Next.js API route, then to OpenAI's API

### Security Best Practices

✅ **Use environment variables for private deployments** - Set on Vercel for internal tools  
✅ **Use runtime input for public apps** - Let users bring their own keys  
✅ **Keys are stored in sessionStorage** - More secure than localStorage, cleared on tab close  
✅ **Never commit `.env.local`** - Already in `.gitignore`, keep it that way  
✅ **HTTPS in production** - Vercel provides this automatically  
✅ **Monitor API usage** - Set spending limits on OpenAI dashboard

### Important Notes

- **GitHub Pages deployments**: Since GitHub Pages is static hosting, the app will always prompt users for API keys
- **Cost management**: When users provide their own keys, they pay for their own API usage
- **Rate limiting**: Individual keys help distribute load and avoid rate limits
- **Never share API keys**: Each user should use their own OpenAI API key

---

## Additional Resources

### Documentation

- **[WORKSHOP.md](docs/WORKSHOP.md)** - Complete step-by-step implementation guide for building the system yourself
- **[CONCEPTS.md](docs/CONCEPTS.md)** - Multi-agent architecture concepts explained (agents, handoffs, tools, guardrails)
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design, data flow, and error handling strategies
- **[PITCH.md](docs/PITCH.md)** - Project vision, problem statement, and user experience philosophy
- **[TEST_PROMPTS.md](docs/TEST_PROMPTS.md)** - Comprehensive test cases covering all scenarios

### External Resources

- **[OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-js/)** - Official SDK docs
- **[OpenAI Platform Documentation](https://platform.openai.com/docs)** - API reference and guides
- **[OpenAI Agents SDK GitHub](https://github.com/openai/openai-agents-js)** - Source code and examples

---

## Contributing

This project was created for educational purposes. If you find issues or have suggestions for improving the learning experience:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## License

MIT
