# Agent Catalog

This file describes all available agents in the Growing Collective system.

## Available Agents

### semantic-router-agent (PRIMARY ROUTER)

- **Routing**: ALL /van requests go here first
- **Purpose**: AI-powered semantic routing using Gemini 2.5 Flash-8B
- **Location**: .claude/agents/semantic-router-agent.md
- **Specialization**: Natural language understanding, intent detection, smart routing
- **Cost**: ~$0.00005 per request (effectively free with 1,500 req/day free tier)
- **No keyword matching**: Uses AI to understand intent

This agent is the ENTRY POINT for all /van requests and will:

- Analyze ANY request using AI (no keyword matching)
- Understand intent from natural language ("what next", "yo, code this up")
- Return confidence scores for routing decisions
- Automatically delegate to the appropriate specialist agent
- Handle formal and informal requests equally well

### coder-agent

- **Routed by**: semantic-router-agent (AI analysis)
- **Purpose**: Writes clean, tested code following SOLID principles
- **Location**: .claude/agents/coder-agent.md
- **Specialization**: Code generation, implementation, GoF patterns, TDD

When routed here, this agent will:

- Write clean, readable code
- Follow best practices and SOLID principles
- Add comments where helpful
- Apply Test-Driven Development approach

### helper-agent

- **Routed by**: semantic-router-agent (AI analysis)
- **Purpose**: Answers questions and provides explanations
- **Location**: .claude/agents/helper-agent.md
- **Specialization**: Explanations, teaching, answering questions

When routed here, this agent will:

- Provide clear, concise explanations
- Break down complex concepts
- Use examples to illustrate points
- Answer questions thoroughly

### test-agent

- **Routed by**: semantic-router-agent (AI analysis)
- **Purpose**: Browser automation and testing with MCP tools
- **Location**: .claude/agents/test-agent.md
- **Specialization**: E2E testing, visual validation, code intelligence
- **MCP Servers**: Puppeteer (browser), Context7 (docs)

When routed here, this agent will:

- Write browser automation code using Puppeteer API
- Capture screenshots and validate UI
- Use Context7 for correct testing framework usage
- Process test data locally (code-API pattern for 98.7% token reduction)
- Return only filtered results

### next_steps_planner

- **Routed by**: semantic-router-agent (AI analysis)
- **Purpose**: Read documentation and create detailed implementation plans
- **Location**: .claude/agents/next_steps_planner.md
- **Specialization**: Documentation analysis, task breakdown, dependency mapping

When routed here, this agent will:

- Read all relevant documentation thoroughly
- Extract actionable requirements
- Create phase-based implementation plans
- Provide exact commands and file paths
- Identify risks and blockers
- Define clear next steps

### general-purpose-agent

- **Routed by**: semantic-router-agent (AI analysis)
- **Purpose**: Agent with custom tool access (get_current_time, calculator)
- **Location**: .claude/agents/general-purpose-agent.md
- **Specialization**: Tasks requiring custom tools
- **Available Tools**:
  - get_current_time (ISO, readable, unix formats)
  - calculator (add, subtract, multiply, divide)

When routed here, this agent can:

- Execute time-related queries
- Perform calculations
- Demonstrate tool usage patterns

### memory-agent

- **Routed by**: semantic-router-agent (AI analysis)
- **Purpose**: Bridge to letto memory system for runtime artifact management
- **Location**: .claude/agents/memory-agent.md
- **Specialization**: Semantic search with time-decay ranking, artifact logging
- **Letto Integration**: ChromaDB-backed memory with time-decay scoring
- **Workspace**: /home/adamsl/growing_collective/letto_workspace/

When routed here, this agent will:

- Log runtime artifacts (errors, fixes, decisions, gotchas)
- Search past artifacts using semantic similarity + time-decay
- Track performance issues and deployments
- Manage dependency conflicts and workarounds
- Use time-aware ranking: recent + relevant artifacts surface first

## How Agents Work

### Agent Delegation

The Task() tool transfers work to another agent by loading their markdown file.

### Agent Specialization Benefits

1. **Focus**: Each agent does ONE thing well
2. **Consistency**: Same agent = same quality every time
3. **Extensibility**: Add new agents without changing existing ones
4. **Clarity**: Clear separation of concerns

## Adding Your Own Agent

Want to add a new specialist? Here's how:

1. **Create**: `.claude/agents/your-agent.md` with clear instructions
2. **No router updates needed**: AI automatically learns to route to new agents
3. **Document here**: Add agent description to this file
4. **Test**: `/van [request that should route to your agent]`
5. **Optional**: Add examples to semantic router training if routing is inconsistent

See `.claude/agents/README.md` for detailed agent creation guide.

## Agent Architecture

```
User Request
     ↓
/van Command
     ↓
semantic-router-agent (AI Routing)
     ↓
Gemini 2.5 Flash-8B (Intent Analysis)
     ↓
Task Tool (Delegation)
     ↓
Specialized Agent (Execution)
```

**Key Difference from Old System:**

- **Old**: Keyword matching with priority rules
- **New**: AI-powered intent understanding (no keywords needed)

---

_This file contains agent catalog and specialization information_
