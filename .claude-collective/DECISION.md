# Global Decision Engine (Always Active)

## AUTO-DELEGATION INFRASTRUCTURE

### AUTO-DELEGATION SYSTEM
**MANDATORY BEHAVIORAL REQUIREMENT**: On every turn, BEFORE ANY OUTPUT:

1. **CHECK MY MESSAGE**: Did my previous message end with handoff pattern: `Use the ([a-z0-9-]+) subagent to .+`
2. **NORMALIZE**: Convert Unicode dashes `‑–—−` to `-` before pattern matching
3. **AUTO-DELEGATE**: If pattern found, use Task tool with extracted agent name and STOP
4. **NO ANALYSIS**: Never add explanations, summaries, or behavioral rule loading when auto-delegating
5. **IMMEDIATE EXECUTION**: This takes precedence over all other behavior

## ROUTING DECISIONS
**For /van commands**: User explicitly requested collective mode - use routing logic
**For normal questions**: Use standard Claude behavior
**For agent handoffs**: Auto-delegate only (handled above)

## CONTEXT LOADING RULES
- **Auto-delegation**: Execute Task() immediately, load nothing else
- **/van command used**: Load routing logic and agent instructions
- **Normal conversation**: Standard Claude behavior + auto-delegation capability

## ROUTING LOGIC

### AI-Powered Semantic Routing

**ALL /van requests now use Gemini-powered semantic routing (no keyword matching)**

When /van command is used, ALWAYS route through semantic-router-agent:

**Why Semantic Routing?**
- **More Accurate**: Understands intent, not just keywords
- **Cost Effective**: ~$0.00005 per request (~effectively free)
- **Less Maintenance**: No keyword priority conflicts
- **Natural Language**: Handles informal requests like "what's next?", "yo, code this up"

### Routing Implementation

**For ALL /van requests:**
```
Use Task tool with:
- subagent_type: "general-purpose"
- description: "Semantic routing task"
- prompt: "You are the semantic-router-agent specialist. Read /home/adamsl/growing_collective/.claude/agents/semantic-router-agent.md and follow its instructions exactly to route this request: [user's request]"
```

**Available Target Agents:**
- **next_steps_planner** - Plans, roadmaps, implementation strategies
- **coder-agent** - Code writing, implementation, building features
- **test-agent** - Testing, browser automation, validation
- **helper-agent** - Questions, explanations, teaching
- **general-purpose-agent** - Custom tools (time, calculator)

**How It Works:**
1. semantic-router-agent receives the request
2. Calls `npm run route "request"` to query Gemini 2.5 Flash-8B
3. Gemini analyzes intent and returns: `{agent, confidence, reasoning}`
4. semantic-router-agent delegates to chosen agent via Task tool
5. Result returned to user seamlessly

---
*This file contains ONLY decision logic and auto-delegation infrastructure*
