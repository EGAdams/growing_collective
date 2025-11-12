# Auto-Delegation System Guide

## Overview

The Growing Collective uses an **auto-delegation system** that automatically routes tasks to specialized AI agents. This system operates invisibly, making intelligent routing decisions without requiring you to manage which agent handles what.

## System Architecture

```mermaid
flowchart TD
    Start([User Request]) --> CheckHandoff{Check: Previous message<br/>has handoff pattern?}

    CheckHandoff -->|Yes| AutoDelegate[Auto-Delegate to Agent]
    CheckHandoff -->|No| CheckVan{Check: /van<br/>command used?}

    AutoDelegate --> TaskTool[Execute Task Tool]
    TaskTool --> AgentWork[Agent Executes Task]
    AgentWork --> Done([Task Complete])

    CheckVan -->|Yes| LoadRouter[Load Semantic Router]
    CheckVan -->|No| StandardMode[Standard Claude Mode]

    LoadRouter --> SemanticAgent[semantic-router-agent]
    SemanticAgent --> GeminiAPI[Gemini 2.5 Flash-8B<br/>AI Analysis]

    GeminiAPI --> AnalyzeIntent[Understand Intent]
    AnalyzeIntent --> RouteDecision{Routing Decision}

    RouteDecision -->|Planning| NextSteps[next_steps_planner]
    RouteDecision -->|Testing| TestAgent[test-agent]
    RouteDecision -->|Coding| CoderAgent[coder-agent]
    RouteDecision -->|Questions| HelperAgent[helper-agent]
    RouteDecision -->|Other| GeneralAgent[general-purpose-agent]

    NextSteps --> Delegate[Delegate via Task Tool]
    TestAgent --> Delegate
    CoderAgent --> Delegate
    HelperAgent --> Delegate
    GeneralAgent --> Delegate

    Delegate --> AgentWork
    StandardMode --> Done

    style AutoDelegate fill:#ff6b6b
    style LoadRouter fill:#0000ff
    style StandardMode fill:#ffff00
```

## Three Operating Modes

### 1. Auto-Delegation Mode (Highest Priority)

**When it activates**: When an agent hands off work to another agent

**How it works**:
```mermaid
sequenceDiagram
    participant Agent1 as Agent A
    participant System as Auto-Delegation System
    participant Agent2 as Agent B

    Agent1->>System: Message ends with:<br/>"Use the coder-agent subagent to write code"
    Note over System: 1. Detect handoff pattern
    Note over System: 2. Extract agent name: "coder-agent"
    Note over System: 3. No explanations/analysis
    System->>Agent2: Execute Task(coder-agent)
    Agent2->>System: Return result
```

**Key characteristics**:
- Completely automatic
- No user intervention needed
- No explanatory text added
- Immediate execution
- Takes precedence over everything else

**Handoff pattern**:
```
Use the [agent-name] subagent to [task description]
```

**Examples**:
- `Use the coder-agent subagent to write a function`
- `Use the test-agent subagent to validate the UI`
- `Use the next_steps_planner subagent to create implementation plan`

### 2. Explicit Routing Mode (/van command)

**When it activates**: When user types `/van` followed by a request

**How it works**:
```mermaid
flowchart LR
    User["/van write a function"] --> Router[Semantic Router Agent]
    Router --> Gemini[Gemini 2.5 Flash-8B<br/>AI Analysis]

    Gemini --> Intent[Analyze Intent:<br/>Not keywords!]
    Intent --> Decision[Routing Decision:<br/>agent + confidence]

    Decision --> Delegate[Delegate to coder-agent]
    Delegate --> Execute[Execute via Task Tool]

    style Gemini fill:#6c5ce7
    style Intent fill:#6c5ce7
    style Decision fill:#0000ff
```

**AI-Powered Semantic Routing** (NO keyword matching):

**All /van requests** → semantic-router-agent → Gemini AI Analysis → Target agent

- **How it works**: Gemini 2.5 Flash-8B understands natural language intent
- **Cost**: ~$0.00005 per request (effectively free with 1,500 req/day free tier)
- **Accuracy**: >90% routing accuracy with >85% average confidence
- **Flexibility**: Handles informal language, ambiguous requests, and edge cases

**Available Target Agents:**
1. **next_steps_planner** - Plans, roadmaps, implementation strategies
2. **coder-agent** - Code writing, implementation, building features
3. **test-agent** - Testing, browser automation, validation
4. **helper-agent** - Questions, explanations, teaching
5. **general-purpose-agent** - Custom tools (time, calculator)

### 3. Standard Mode (Default)

**When it activates**: Normal conversation without `/van` or handoffs

**How it works**: Regular Claude behavior with auto-delegation capability running in background

## Complete Request Flow

```mermaid
stateDiagram-v2
    [*] --> CheckPreviousMessage

    CheckPreviousMessage --> AutoDelegateMode: Handoff pattern detected
    CheckPreviousMessage --> CheckCommand: No handoff pattern

    CheckCommand --> ExplicitRouting: /van command used
    CheckCommand --> StandardMode: Normal conversation

    AutoDelegateMode --> NormalizePattern: Normalize Unicode dashes
    NormalizePattern --> ExtractAgent: Extract agent name
    ExtractAgent --> ExecuteTask: Task tool immediate execution
    ExecuteTask --> [*]

    ExplicitRouting --> LoadRouter: Load DECISION.md logic
    LoadRouter --> SemanticRouter: ALWAYS route to semantic-router-agent

    SemanticRouter --> GeminiAnalysis: Call Gemini 2.5 Flash-8B
    GeminiAnalysis --> IntentDetection: AI analyzes intent

    IntentDetection --> PlanningAgent: Planning intent detected
    IntentDetection --> TestingAgent: Testing intent detected
    IntentDetection --> CodingAgent: Coding intent detected
    IntentDetection --> QuestionAgent: Question intent detected
    IntentDetection --> GeneralAgent: Other intent detected

    PlanningAgent --> DelegateTask
    TestingAgent --> DelegateTask
    CodingAgent --> DelegateTask
    QuestionAgent --> DelegateTask
    GeneralAgent --> DelegateTask

    DelegateTask --> [*]

    StandardMode --> Response: Standard Claude response
    Response --> [*]
```

## Agent Handoff Chain Example

Here's how agents can chain together through auto-delegation:

```mermaid
sequenceDiagram
    participant User
    participant Router as Router Agent
    participant Planner as next_steps_planner
    participant Coder as coder-agent
    participant Tester as test-agent

    User->>Router: /van plan how to add login feature

    Note over Router: AI analyzes intent → planning
    Router->>Planner: Auto-delegate via semantic router

    Note over Planner: Analyzes requirements<br/>Creates implementation plan
    Planner->>Router: "Use the coder-agent subagent to implement step 1"

    Note over Router: Detects handoff pattern
    Router->>Coder: Auto-delegate (no explanation)

    Note over Coder: Writes code for step 1
    Coder->>Router: "Use the test-agent subagent to validate login"

    Note over Router: Detects handoff pattern
    Router->>Tester: Auto-delegate (no explanation)

    Note over Tester: Tests login functionality
    Tester->>User: Test results
```

## Routing System Details

### Handoff Pattern Recognition

The system looks for this exact pattern for agent-to-agent handoffs:
```regex
Use the ([a-z0-9-]+) subagent to .+
```

**Unicode normalization**: Converts all dash variants to standard `-`:
- `‑` (non-breaking hyphen)
- `–` (en dash)
- `—` (em dash)
- `−` (minus sign)

### AI-Powered Semantic Routing

**NO keyword matching** - All routing uses Gemini AI analysis:

```mermaid
graph TD
    Request[User Request] --> Semantic[semantic-router-agent]

    Semantic --> CLI[npm run route 'request']
    CLI --> Gemini[Gemini 2.5 Flash-8B]

    Gemini --> Analyze[AI analyzes intent,<br/>context, and meaning]
    Analyze --> Decision[Returns:<br/>agent + confidence + reasoning]

    Decision --> High{Confidence<br/>>= 0.7?}

    High -->|Yes| Route[Route to chosen agent]
    High -->|No| Clarify[Ask user to clarify]

    Route --> Execute[Execute via Task tool]

    style Gemini fill:#6c5ce7
    style Analyze fill:#6c5ce7
    style Route fill:#0000ff
    style Clarify fill:#fdcb6e
```

**Why AI routing is superior**:
- **No keyword conflicts**: "plan to write tests" correctly routed based on actual intent
- **Natural language**: Handles "yo, what's next boss?" as naturally as "plan the next steps"
- **Context aware**: Understands nuance, not just word matching
- **Self-improving**: Better with more diverse requests

## Available Agents

```mermaid
mindmap
    root((Growing<br/>Collective))
        next_steps_planner
            Read docs
            Create plans
            Break down tasks
            Map dependencies
        coder-agent
            Write code
            Implement features
            Follow best practices
            Add comments
        test-agent
            Browser automation
            E2E testing
            Screenshots
            UI validation
        helper-agent
            Answer questions
            Explain concepts
            Provide examples
            Teaching
        semantic-router-agent
            AI-powered routing
            Handle ambiguous requests
            Natural language
            Fallback routing
        general-purpose-agent
            Custom tools
            Time queries
            Calculations
```

### Agent Specializations

| Agent | Purpose | Tools | Routing |
|-------|---------|-------|---------|
| **semantic-router-agent** | AI-powered routing - analyzes ALL /van requests | Gemini 2.5 Flash-8B API | Entry point for all /van |
| **next_steps_planner** | Documentation analysis, implementation planning | Read, Write, Edit, Bash, Grep, Glob | Routed by AI |
| **coder-agent** | Code generation, implementation | Read, Write, Edit, Bash, Grep, Glob | Routed by AI |
| **test-agent** | Browser automation, testing | Puppeteer MCP, Context7 MCP | Routed by AI |
| **helper-agent** | Answering questions, explanations | Read, Write, Edit, Bash, Grep, Glob | Routed by AI |
| **general-purpose-agent** | Custom tool demonstrations | get_current_time, calculator | Routed by AI |

## How to Use the System

### As a User

**Option 1: Let auto-delegation work invisibly**
```bash
/van write a login function
# System automatically routes to coder-agent
# coder-agent might hand off to test-agent
# You see seamless results
```

**Option 2: Direct routing with /van**
```bash
/van plan the authentication system
# Routes to next_steps_planner explicitly

/van test the homepage
# Routes to test-agent explicitly

/van explain async/await
# Routes to helper-agent explicitly
```

**Option 3: Normal conversation**
```bash
# Just ask questions naturally
What's the difference between let and const?
# Standard Claude mode, no routing
```

### As a Developer

**Creating agent handoffs in agent markdown files**:

```markdown
## Your Agent Instructions

1. Do task A
2. Do task B
3. If user needs testing, end with:

Use the test-agent subagent to validate the implementation
```

**The pattern must be exact**:
- Start with "Use the "
- Agent name (lowercase, hyphens allowed)
- " subagent to "
- Task description

## System Benefits

### 1. Invisible Orchestration
```mermaid
graph LR
    User[User Request] --> System{System}
    System -.->|Auto-delegates| A1[Agent 1]
    System -.->|Auto-delegates| A2[Agent 2]
    System -.->|Auto-delegates| A3[Agent 3]
    A1 -.-> Result[Seamless Result]
    A2 -.-> Result
    A3 -.-> Result
    Result --> User

    style System fill:#dfe6e9,stroke:#2d3436,stroke-width:3px
    style User fill:#74b9ff
    style Result fill:#0000ff
```

Users don't see the complexity - just results.

### 2. Agent Specialization

Each agent is **expert** at one thing:

```mermaid
graph TD
    Task[Complex Task] --> Break[Break Down]

    Break --> P[Planning Phase]
    Break --> C[Coding Phase]
    Break --> T[Testing Phase]

    P --> PA[next_steps_planner<br/>Expert at planning]
    C --> CA[coder-agent<br/>Expert at coding]
    T --> TA[test-agent<br/>Expert at testing]

    PA --> Quality[High Quality<br/>Specialized Output]
    CA --> Quality
    TA --> Quality

    style PA fill:#ff6b6b
    style CA fill:#0000ff
    style TA fill:#00ff00
    style Quality fill:#ffd32a
```

### 3. Extensibility

Adding new agents is easy:

```mermaid
flowchart LR
    Create[Create Agent File<br/>.claude/agents/new-agent.md] --> Update[Update DECISION.md<br/>Add routing logic]
    Update --> Document[Document in AGENTS.md<br/>Add description]
    Document --> Test[Test with /van]
    Test --> Deploy[New Agent Ready]

    style Deploy fill:#0000ff
```

## Troubleshooting

### Handoff Not Working?

**Check pattern exactly**:
```markdown
✅ Correct:
Use the coder-agent subagent to write the code

❌ Wrong:
- Use coder-agent to write the code (missing "the" and "subagent")
- Use the coder_agent subagent to write (underscore instead of hyphen)
- Use the coder-agent to write (missing "subagent")
```

### Wrong Agent Routed?

**AI routing is context-aware** - no more keyword conflicts:
```bash
# Old system (keyword-based):
/van plan to write code
# Would route to: next_steps_planner (planning keyword priority)

# New system (AI-based):
/van plan to write code
# AI analyzes INTENT and routes correctly based on context
# Might route to: next_steps_planner (if emphasis is on planning)
# Or route to: coder-agent (if emphasis is on implementation)
```

**If routing seems wrong**:
1. Check the confidence score in semantic-router-agent output
2. Rephrase your request to be more explicit
3. Report patterns to improve the Gemini training

### Semantic Router Not Working?

**Check the CLI tool**:
```bash
npm run route "test request"
# Should return: {agent, confidence, reasoning}
```

**If it fails**:
- Ensure Gemini API key is configured
- Check `servers/semantic-router/` setup
- Verify `npm install` ran successfully

### Unicode Issues?

The system automatically normalizes these:
- `Use the coder‑agent` → `Use the coder-agent` ✅
- `Use the coder–agent` → `Use the coder-agent` ✅
- `Use the coder—agent` → `Use the coder-agent` ✅

## Advanced: Semantic Router Agent

The semantic router is now the **PRIMARY routing mechanism** for all /van requests:

```mermaid
sequenceDiagram
    participant User
    participant Router as Router System
    participant Semantic as semantic-router-agent
    participant Gemini as Gemini 2.5 Flash-8B
    participant Target as Target Agent

    User->>Router: /van what's next on the agenda?
    Note over Router: ALL /van requests route here

    Router->>Semantic: Always delegate to semantic router
    Semantic->>Gemini: Analyze intent with AI

    Note over Gemini: Understands natural language<br/>"what's next" = planning request

    Gemini->>Semantic: Confidence: 0.85 → next_steps_planner
    Semantic->>Target: Use the next_steps_planner subagent
    Target->>User: Implementation plan
```

**Cost**: ~$0.00005 per request (effectively free with 1,500 req/day limit)

## File Structure

```
growing_collective/
├── .claude-collective/
│   ├── DECISION.md          # Core routing logic
│   └── AGENTS.md            # Agent catalog
├── .claude/
│   ├── agents/
│   │   ├── next_steps_planner.md
│   │   ├── coder-agent.md
│   │   ├── test-agent.md
│   │   ├── helper-agent.md
│   │   ├── semantic-router-agent.md
│   │   └── general-purpose-agent.md
│   └── hooks/
│       └── load-decision.sh  # Startup hook
└── CLAUDE.md                 # Main config (imports DECISION.md)
```

## Summary

The auto-delegation system provides:

1. **Invisible orchestration** - Agents coordinate without user intervention
2. **Smart routing** - AI-powered semantic analysis routes to the right specialist
3. **Seamless handoffs** - Agents delegate to each other cleanly
4. **Intent understanding** - AI analyzes meaning, not just keywords
5. **Natural language** - Handles formal and informal requests equally
6. **Extensible architecture** - Easy to add new specialists

You can use `/van` for explicit routing or let the system work invisibly through auto-delegation. Either way, specialized agents ensure high-quality, focused results.

---

**Quick Reference**:
- `/van [request]` - AI-powered semantic routing (NO keywords)
- Normal chat - Standard mode
- Handoff pattern: `Use the [agent-name] subagent to [task]`
- Routing: ALL /van → semantic-router-agent → AI analysis → target agent
