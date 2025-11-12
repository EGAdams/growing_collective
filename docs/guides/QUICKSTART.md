# Quick Start Guide - Growing Collective

Get up and running with the agent collective in 5 minutes!

## Step 1: Open Claude Code

```bash
cd /home/adamsl/growing_collective
claude
```

When Claude Code starts, `CLAUDE.md` loads automatically. You're ready to go!

## Step 2: Try Your First Command

### Test the Coder Agent

Type this in Claude Code:
```
/van Write a function to add two numbers in JavaScript
```

Watch what happens:
1. Router analyzes your request
2. Sees "write" and "function" (coding keywords)
3. Routes to coder-agent
4. You get clean JavaScript code!

### Test the Helper Agent

Type this:
```
/van What is the difference between let and const in JavaScript?
```

Watch what happens:
1. Router analyzes your request
2. Sees "what" and "difference" (question keywords)
3. Routes to helper-agent
4. You get a clear explanation!

## Step 3: Understand What Just Happened

### Behind the Scenes

```
Your command: /van Write a function...
      ↓
CLAUDE.md (already loaded when you started)
      ↓
van.md (the router) analyzes request
      ↓
Router sees coding keywords
      ↓
Delegates to coder-agent
      ↓
coder-agent.md loads
      ↓
Claude follows coder-agent instructions
      ↓
You get specialized code output
```

### The Magic

- **Auto-loading**: CLAUDE.md loaded automatically
- **Custom command**: /van is available immediately
- **Smart routing**: Pattern matching picked the right agent
- **Specialization**: Agent focused only on coding

## Step 4: More Examples to Try

### Coding Requests
```
/van Create a React button component
/van Build a simple calculator in Python
/van Implement a function to reverse a string
/van Write a for loop that counts to 10
```

All these route to **coder-agent**.

### Question Requests
```
/van How does async/await work?
/van Why should I use TypeScript?
/van Explain what a closure is
/van What are the benefits of functional programming?
```

All these route to **helper-agent**.

### Test Routing
```
/van Help me
```

This is too vague - router will ask you to clarify!

## Step 5: Peek Under the Hood

### View the Router Logic

```bash
# Read the router file
cat .claude/commands/van.md
```

Look for the routing patterns:
- Coding keywords: write, code, function, create...
- Question keywords: what, why, how, explain...

### View the Agents

```bash
# See what coder-agent does
cat agents/coder-agent.md

# See what helper-agent does
cat agents/helper-agent.md
```

Notice how each agent has:
- Clear role definition
- Step-by-step process
- Example outputs
- DO and DON'T lists

## Step 6: Customize (Optional)

### Add Your Own Keywords

Edit `.claude/commands/van.md`:

```markdown
# Add to coding keywords:
- Keywords: `write`, `code`, `function`, `create`, `make`, `develop`

# Add to question keywords:
- Keywords: `what`, `why`, `how`, `explain`, `teach`, `describe`
```

Restart Claude Code to load changes.

### Create a New Agent

Follow the guide in `agents/README.md` to create your own specialist!

## Common Commands Reference

### Using the Router
```bash
/van [your request]          # Route to appropriate agent
```

### Reading Documentation
```bash
cat README.md                # Full system overview
cat CLAUDE.md               # See what auto-loads
cat agents/README.md        # Learn about agents
```

### Viewing Files
```bash
tree -a                     # See directory structure
cat .claude/commands/van.md # See router logic
cat agents/coder-agent.md  # See coder agent
```

## Troubleshooting

### Problem: /van command not found

**Solution**: Make sure you started Claude Code in the `growing_collective` directory:
```bash
cd /home/adamsl/growing_collective
claude
```

### Problem: Agent not doing what I expected

**Solution**: Check your request for trigger words:
- Coding: write, code, create, build, function
- Questions: what, why, how, explain

### Problem: Want to modify routing

**Solution**: Edit `.claude/commands/van.md` and restart Claude Code

## What to Explore Next

1. **Read the Full README**: `cat README.md`
2. **Study Agent Files**: See how they're structured
3. **Create Your Own Agent**: Follow `agents/README.md`
4. **Experiment with Routing**: Modify van.md
5. **Compare to Production**: Look at `dumbdown_collective` for advanced patterns

## Key Concepts Review

### Auto-Loading
Files like `CLAUDE.md` load when Claude Code starts. No manual reading needed.

### Custom Commands
Files in `.claude/commands/` become slash commands (like `/van`).

### Agent Delegation
The router uses `Task()` tool to delegate work to specialized agents.

### Pattern Matching
Simple keyword detection routes requests to the right agent.

## Success Checklist

After this quick start, you should be able to:

- [ ] Use `/van` to route requests
- [ ] Get code from coder-agent
- [ ] Get explanations from helper-agent
- [ ] Understand the file structure
- [ ] Know where routing logic lives
- [ ] See how agents are structured

## Next Steps

1. Try all the example commands above
2. Read `README.md` for deeper understanding
3. Look at agent files to see instruction patterns
4. Create your own agent following `agents/README.md`
5. Experiment with routing modifications

---

You're ready to use the Growing Collective! Start with simple /van commands and explore from there.

Questions? Everything is documented in the README files throughout the project.

Happy routing! 🚀
