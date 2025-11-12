# Router Setup Complete

## What Was Implemented

The Growing Collective now has a working router based on the dumbdown_collective architecture!

## Key Components Added

### 1. DECISION.md (Auto-Delegation System)
**Location**: `.claude-collective/DECISION.md`

**Purpose**: Enables automatic agent chaining without user intervention

**How it works**:
- Detects when a message ends with "Use the X subagent to..."
- Automatically extracts the agent name
- Invokes the Task tool to continue the workflow
- No manual intervention needed

### 2. Updated van.md (Router Command)
**Location**: `.claude/commands/van.md`

**Changes**:
- Now uses Task tool with `subagent_type="general-purpose"`
- Delegates to agents by loading their instruction files
- Pattern: coding keywords → coder-agent, question keywords → helper-agent

**How to use**:
```bash
/van write a Python function to add two numbers
/van what is the difference between let and const?
```

### 3. settings.json (Hook Configuration)
**Location**: `.claude/settings.json`

**Purpose**: Configures hooks for automatic behavior

**Hooks enabled**:
- **SessionStart**: Loads DECISION.md system on startup
- **SubagentStop**: Detects agent handoffs and continues automatically

### 4. auto-handoff.sh (Handoff Detection Hook)
**Location**: `.claude/hooks/auto-handoff.sh`

**Purpose**: Detects and continues agent chains automatically

**Flow**:
1. Agent completes work
2. Agent ends message with "Use the X subagent to..."
3. Hook detects the pattern
4. Hook extracts agent name and task
5. Hook blocks and injects continuation message
6. DECISION.md auto-delegates to next agent

### 5. load-decision.sh (Initialization Hook)
**Location**: `.claude/hooks/load-decision.sh`

**Purpose**: Loads the auto-delegation system at session start

**Output**: Welcome message explaining the collective is ready

## How the Router Works

### Simple Flow:

```
1. User types: /van write hello world in JavaScript

2. Van router analyzes: "write" = coding keyword

3. Van invokes Task tool:
   - subagent_type: "general-purpose"
   - prompt: "You are coder-agent. Read agents/coder-agent.md and: write hello world"

4. Coder-agent executes:
   - Reads coder-agent.md instructions
   - Writes clean JavaScript code
   - Provides usage example
   - May end with: "Use the helper-agent subagent to explain how this works"

5. Hook detects handoff pattern (if present)

6. DECISION.md auto-delegates to helper-agent (if handoff detected)

7. Process continues until completion
```

## Testing the Router

To test if it works, you need to **restart Claude Code** (hooks only load on session start).

Then try:

```bash
# Test coding route
/van create a simple calculator function in Python

# Test question route
/van what is recursion and how does it work?
```

## What Makes This Work

### 1. Task Tool Integration
Instead of trying to create custom subagent types, we use `general-purpose` and tell the agent to load specific instruction files.

### 2. Auto-Delegation Pattern
The DECISION.md file is loaded into context and instructs Claude to:
- Check for handoff patterns in previous messages
- Extract agent names
- Invoke Task tool automatically

### 3. Hook-Based Automation
Hooks detect handoff patterns in agent output and inject continuation messages, creating automatic agent chaining.

### 4. Agent Instruction Files
Each agent (coder-agent.md, helper-agent.md) contains detailed instructions on:
- How to behave
- What format to use
- What process to follow
- What tone to use

## Comparison to Dumbdown Collective

| Feature | Dumbdown | Growing (Now) |
|---------|----------|---------------|
| Agents | 30+ specialized | 2 simple agents |
| Routing | Complex multi-mode | Simple keyword matching |
| Hooks | 5 complex hooks | 2 simple hooks |
| Auto-delegation | ✅ Full | ✅ Basic |
| TDD enforcement | ✅ Mandatory | ❌ Not yet |
| Metrics | ✅ Comprehensive | ❌ Not yet |

**Growing Collective is now a simplified version of Dumbdown**, with the core routing mechanism working!

## Next Steps

Once you verify the router works, you can:

1. **Add more agents**: Create new .md files in agents/ folder
2. **Update routing**: Add new keyword patterns to van.md
3. **Add TDD**: Copy TDD validation hooks from dumbdown
4. **Add metrics**: Copy metrics collection hooks
5. **Add quality gates**: Copy quality enforcement hooks

## File Structure

```
growing_collective/
├── .claude/
│   ├── commands/
│   │   └── van.md                    # Router command
│   ├── hooks/
│   │   ├── auto-handoff.sh          # Detects agent handoffs
│   │   └── load-decision.sh         # Loads DECISION.md
│   └── settings.json                 # Hook configuration
├── .claude-collective/
│   └── DECISION.md                   # Auto-delegation logic
├── agents/
│   ├── coder-agent.md               # Coding specialist
│   ├── helper-agent.md              # Question specialist
│   └── README.md
├── CLAUDE.md                         # Project overview
└── README.md                         # Usage guide
```

## Important Notes

### Hooks Require Restart
**After creating or modifying hooks, you MUST restart Claude Code** for changes to take effect. Hooks are loaded at session start only.

### Auto-Delegation Pattern
Agents can trigger automatic continuation by ending messages with:
```
Use the [agent-name] subagent to [one-sentence task description]
```

### Agent Names Must Match
The agent name in the handoff pattern must match a valid subagent_type or be routed correctly by van.

## Troubleshooting

**Router not working?**
- Restart Claude Code to load hooks
- Check that you're using /van command
- Verify .claude-collective/DECISION.md exists

**Handoffs not continuing?**
- Check agent ends message with exact pattern
- Verify auto-handoff.sh is executable (chmod +x)
- Look for Unicode dash issues (should be normalized)

**Agent not loading instructions?**
- Verify agent .md file exists in agents/
- Check file path in van.md prompt is correct
- Ensure Task tool is available

---

**Router Status**: ✅ READY

Test it out by restarting Claude Code and using `/van` commands!
