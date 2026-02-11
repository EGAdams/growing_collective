# /van - AI-Powered Semantic Router Command

## What This Command Does

Routes your request to the right specialist agent using AI-powered semantic analysis.

## How It Works

When you use `/van [request]`, this command:

1. **Calls the semantic router** via `npm run route "[request]"`
2. **Gets AI routing decision** from Gemini 2.5 Flash-8B
3. **Delegates to the chosen specialist** using the Task tool

## Instructions for Claude

When this command runs with `/van $ARGUMENTS`:

### Step 1: Call Semantic Router

```bash
npm run route "$ARGUMENTS"
```

### Step 2: Parse the Result

The router returns JSON with:

- `agent`: Which specialist to use
- `confidence`: How certain (0.0-1.0)
- `reasoning`: Why this agent was chosen

### Step 3: Delegate IMMEDIATELY (NO TEXT OUTPUT)

**CRITICAL:**

- ❌ DO NOT explain what you're doing
- ❌ DO NOT describe the routing result
- ❌ DO NOT output any text about delegation
- ✅ IMMEDIATELY use Task tool in the SAME message as the routing call

**Task tool parameters:**

```
subagent_type: "general-purpose"
description: "[Task type] task"
prompt: "You are the [agent-name] specialist. Read /home/adamsl/growing_collective/.claude/agents/[agent-name].md and follow its instructions exactly to: $ARGUMENTS"
```

**Agent-specific task descriptions:**

- `coder-agent` → "Code writing task"
- `next_steps_planner` → "Planning task"
- `test-agent` → "Testing task"
- `helper-agent` → "Question answering task"
- `general-purpose-agent` → "General task"

### Step 4: Handle Low Confidence

If confidence < 0.7:

- Ask user to clarify their request
- Provide examples of clear requests

## Example Execution Pattern

```
User: /van modify the pairing display

Step 1: Bash → npm run route "modify the pairing display"
Step 2: Parse → { agent: "coder-agent", confidence: 0.90 }
Step 3: Task → IN THE SAME MESSAGE, no text output between steps

NO EXPLANATORY TEXT BETWEEN STEPS!
```

## Available Agents

- **coder-agent** - Code writing, implementation, building features
- **next_steps_planner** - Plans, roadmaps, implementation strategies
- **test-agent** - Testing, browser automation, validation
- **helper-agent** - Questions, explanations, teaching
- **general-purpose-agent** - Custom tools (time, calculator)

---

**Remember**: Call `npm run route` FIRST, then delegate IMMEDIATELY in the SAME message. No explanatory text.
