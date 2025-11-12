# Growing Collective - Learning Edition
Inspired from here:
https://github.com/vanzan01/claude-code-sub-agent-collective

A simplified collective system to understand how agent routing works with Claude Code.

## What Is This?

This is a minimal implementation of an "agent collective" - a system where Claude Code can route different types of requests to specialized agents. Think of it like a receptionist (the router) directing visitors to the right department (the agents).

Instead of Claude trying to do everything at once, the system:
1. Analyzes what you're asking for
2. Picks the right specialized agent
3. Hands off the work to that agent

## How It Works

### The Flow

```
You type a request
    ↓
CLAUDE.md loads automatically (contains routing rules)
    ↓
You use /van command (the router)
    ↓
Router analyzes your request
    ↓
Router picks the right agent
    ↓
Agent executes the task
    ↓
You get specialized help
```

### Example

```
You: /van Write a hello world function in Python
    ↓
Router sees "write" → picks coder-agent
    ↓
Coder agent writes the code
    ↓
You get clean Python code with explanation
```

## File Structure

```
growing_collective/
├── CLAUDE.md                    # AUTO-LOADS when Claude Code starts
│                                # Contains the "brain" - routing rules
│
├── .claude/
│   └── commands/
│       └── van.md              # The /van command - the "receptionist"
│                                # Analyzes requests and picks agents
│
├── agents/
│   ├── coder-agent.md          # Specialist: writes code
│   ├── helper-agent.md         # Specialist: answers questions
│   └── README.md               # Explains how agents work
│
└── README.md                   # This file - the guide
```

### What Each File Does

**CLAUDE.md** - The Brain
- Loads automatically when you start Claude Code in this directory
- Contains the routing logic and rules
- Imports the /van command so it's available
- Think of it as the "operating system" for the collective

**.claude/commands/van.md** - The Router
- A custom slash command you type: `/van your request here`
- Analyzes what you're asking for
- Decides which agent is best suited
- Hands off to that agent using the Task() tool

**agents/coder-agent.md** - The Coding Specialist
- Focused ONLY on writing code
- Gets activated when router detects coding requests
- Writes code, tests it, explains it

**agents/helper-agent.md** - The Q&A Specialist
- Focused ONLY on answering questions
- Gets activated when router detects questions
- Provides clear explanations and guidance

## Try It Out

### Test 1: Ask for Code
```
/van Write a function that adds two numbers in JavaScript
```
Expected: Router picks coder-agent → You get clean JS code

### Test 2: Ask a Question
```
/van What is the difference between let and const?
```
Expected: Router picks helper-agent → You get a clear explanation

### Test 3: Unclear Request
```
/van Do something
```
Expected: Router asks you to clarify what you want

## How to Extend This

### Adding a New Agent

1. **Create the agent file**: `agents/tester-agent.md`
```markdown
# Tester Agent

You are a testing specialist.

When you receive a task:
1. Understand what needs testing
2. Write appropriate tests
3. Explain the test coverage
```

2. **Update the router**: Edit `.claude/commands/van.md`
```javascript
// Add to routing logic:
if (request includes "test" or "testing") {
  use tester-agent
}
```

3. **Test it**:
```
/van Write tests for a login function
```

### Making Agents Smarter

You can enhance agents by:
- Adding more specific instructions
- Including examples of good output
- Adding checklists for the agent to follow
- Specifying tools the agent should use

## Key Concepts to Understand

### 1. Auto-Loading
CLAUDE.md loads automatically. You don't need to tell Claude to read it.

### 2. Custom Commands
Files in `.claude/commands/` become slash commands you can type.

### 3. Agent Delegation
The `Task()` tool hands work to another agent (loads their markdown file).

### 4. Specialization
Each agent focuses on ONE thing and does it well.

### 5. Routing Logic
Simple pattern matching decides which agent to use.

## Differences from Production Systems

This learning edition is simplified:

**What's MISSING:**
- Complex orchestration (multi-step workflows)
- Task tracking systems
- Quality verification gates
- Advanced error handling
- Research integration
- Automatic handoffs

**What's INCLUDED:**
- Core routing concept
- Agent specialization
- Basic delegation
- Clear documentation

## Next Steps

After understanding this system:

1. **Experiment**: Try creating your own agent
2. **Observe**: Use /van and watch how routing works
3. **Modify**: Change routing rules and see what happens
4. **Scale**: Look at [The Original Collective](https://github.com/vanzan01/claude-code-sub-agent-collective) to see advanced patterns

## Common Questions

**Q: Why not just ask Claude directly?**
A: You can! But routing to specialists gives you:
- More focused responses
- Consistent formatting
- Better task organization
- Easier to extend with new capabilities

**Q: When should I use this pattern?**
A: When you have:
- Repeated workflows that need consistency
- Different types of tasks requiring different approaches
- Complex projects that benefit from specialization

**Q: How is this different from just writing prompts?**
A: The collective system:
- Auto-loads context (CLAUDE.md)
- Provides reusable routing (/van command)
- Maintains specialized agents you can improve over time
- Scales better as complexity grows

## Troubleshooting

**Problem**: /van command not found
**Solution**: Make sure you're in the growing_collective directory when you start Claude Code

**Problem**: Agent not loading
**Solution**: Check that the agent filename matches exactly what's in van.md

**Problem**: Router picking wrong agent
**Solution**: Update the routing logic in .claude/commands/van.md to be more specific

## Learn More

- Read each agent file to see how they're structured
- Experiment with the routing logic in van.md
- Try adding your own custom agent
- Check out CLAUDE.md to see the auto-loading in action

---

Remember: This is designed for LEARNING. The goal is to understand the concepts, not to build a production system. Once you grasp these basics, you can explore more advanced collective architectures.
