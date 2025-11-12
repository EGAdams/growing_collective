# Growing Collective - Documentation Index

Quick navigation guide to all documentation in this learning system.

## Start Here

### New to Agent Collectives?
1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
2. **[README.md](README.md)** - Complete system overview
3. **[CLAUDE.md](CLAUDE.md)** - See what auto-loads

### Want to Understand How It Works?
1. **[README.md](README.md)** - Core concepts explained
2. **[.claude/commands/van.md](.claude/commands/van.md)** - See the routing logic
3. **[agents/README.md](agents/README.md)** - Learn about agents

### Ready to Build Your Own?
1. **[agents/README.md](agents/README.md)** - Agent creation guide
2. **[agents/coder-agent.md](agents/coder-agent.md)** - Example agent structure
3. **[agents/helper-agent.md](agents/helper-agent.md)** - Another example

### Comparing to Production Systems?
1. **[COMPARISON.md](COMPARISON.md)** - Growing vs Dumbdown Collective

## File Reference

### Core System Files

**[CLAUDE.md](CLAUDE.md)**
- Auto-loads when Claude Code starts
- Contains routing rules and agent registry
- Imports the /van command
- **READ THIS**: To understand what loads automatically

**[.claude/commands/van.md](.claude/commands/van.md)**
- The router - pattern matches requests to agents
- Defines routing keywords and delegation logic
- **READ THIS**: To understand how routing works

### Documentation Files

**[README.md](README.md)** - 📚 Main Guide
- What is an agent collective?
- How the system works (flow diagrams)
- File structure explanation
- Try it out examples
- How to extend the system
- Troubleshooting guide

**[QUICKSTART.md](QUICKSTART.md)** - 🚀 Fast Start
- 5-minute getting started guide
- Step-by-step first commands
- Behind-the-scenes explanation
- Common commands reference
- Quick troubleshooting

**[COMPARISON.md](COMPARISON.md)** - 📊 Learning vs Production
- Side-by-side feature comparison
- What was removed and why
- What was kept and why
- Feature progression path
- When to use each system
- Code comparison examples

**[INDEX.md](INDEX.md)** - 📇 This File
- Navigation guide to all docs
- Reading paths for different goals
- File reference

### Agent Files

**[agents/README.md](agents/README.md)** - 🤖 Agent System Guide
- What is an agent?
- Current agent descriptions
- Agent structure template
- How to create your own agent
- Agent design principles
- Best practices and patterns
- Testing checklist

**[agents/coder-agent.md](agents/coder-agent.md)** - 💻 Code Writing Specialist
- Writes clean, working code
- Triggered by: write, code, function, create, build
- Example: "Write a Python function to calculate factorial"
- **READ THIS**: To see agent instruction structure

**[agents/helper-agent.md](agents/helper-agent.md)** - ❓ Q&A Specialist
- Answers questions and explains concepts
- Triggered by: what, why, how, explain, difference
- Example: "What is the difference between let and const?"
- **READ THIS**: To see another agent pattern

## Reading Paths

### Path 1: Quick User (15 minutes)
```
QUICKSTART.md → Try /van command → Done!
```
**Goal**: Get it working and see it in action

### Path 2: Understanding Learner (45 minutes)
```
README.md → CLAUDE.md → van.md → coder-agent.md → helper-agent.md
```
**Goal**: Understand all core concepts

### Path 3: Agent Builder (1-2 hours)
```
README.md → agents/README.md → Study both agent files → Create your own
```
**Goal**: Build a custom agent

### Path 4: System Designer (2-3 hours)
```
All of Path 2 → COMPARISON.md → Study dumbdown_collective
```
**Goal**: Design production collective systems

### Path 5: Complete Mastery (4-5 hours)
```
Read everything → Build custom agents → Modify routing → Extend system
```
**Goal**: Master the collective pattern

## Quick Lookups

### "How do I...?"

**...get started quickly?**
→ [QUICKSTART.md](QUICKSTART.md)

**...understand the big picture?**
→ [README.md](README.md) - "How It Works" section

**...see what auto-loads?**
→ [CLAUDE.md](CLAUDE.md)

**...understand routing?**
→ [.claude/commands/van.md](.claude/commands/van.md)

**...create a new agent?**
→ [agents/README.md](agents/README.md) - "Creating Your Own Agent" section

**...see agent examples?**
→ [agents/coder-agent.md](agents/coder-agent.md) and [agents/helper-agent.md](agents/helper-agent.md)

**...compare to production?**
→ [COMPARISON.md](COMPARISON.md)

**...troubleshoot issues?**
→ [README.md](README.md) - "Troubleshooting" section
→ [QUICKSTART.md](QUICKSTART.md) - "Troubleshooting" section

### "What is...?"

**...an agent collective?**
→ [README.md](README.md) - "What Is This?" section

**...auto-loading?**
→ [CLAUDE.md](CLAUDE.md) - "What This File Does" section

**...the /van command?**
→ [.claude/commands/van.md](.claude/commands/van.md) - "What This Command Does"

**...an agent?**
→ [agents/README.md](agents/README.md) - "What Is an Agent?" section

**...pattern matching?**
→ [.claude/commands/van.md](.claude/commands/van.md) - "Routing Logic" section

### "Show me...?"

**...how to use the system**
→ [QUICKSTART.md](QUICKSTART.md) - "Step 2: Try Your First Command"

**...example commands**
→ [README.md](README.md) - "Try It Out" section

**...the file structure**
→ [README.md](README.md) - "File Structure" section

**...routing in action**
→ [.claude/commands/van.md](.claude/commands/van.md) - "Example Routing Sessions"

**...how to extend**
→ [README.md](README.md) - "How to Extend This" section

## Learning Progression

### Level 1: User
**Files to read**: QUICKSTART.md, README.md (overview sections)
**Outcome**: Can use /van to route to agents

### Level 2: Understanding
**Files to read**: CLAUDE.md, van.md, both agent files
**Outcome**: Understands how routing and delegation work

### Level 3: Builder
**Files to read**: agents/README.md, study agent examples
**Outcome**: Can create custom agents

### Level 4: Designer
**Files to read**: COMPARISON.md, study dumbdown_collective
**Outcome**: Can design collective architectures

### Level 5: Master
**Files to read**: Everything, plus experimentation
**Outcome**: Can build production collective systems

## Key Concepts by File

**CLAUDE.md** → Auto-loading, agent registry
**van.md** → Pattern matching, routing logic
**coder-agent.md** → Agent structure, specialization
**helper-agent.md** → Alternative agent pattern
**README.md** → System overview, core concepts
**QUICKSTART.md** → Practical usage
**COMPARISON.md** → Learning vs production
**agents/README.md** → Agent creation, best practices

## Troubleshooting by Topic

**Command not found**
→ [QUICKSTART.md](QUICKSTART.md) - "Problem: /van command not found"

**Agent not loading**
→ [README.md](README.md) - "Troubleshooting" section

**Routing not working**
→ [.claude/commands/van.md](.claude/commands/van.md) - "Common Patterns"

**Want to add agent**
→ [agents/README.md](agents/README.md) - "Creating Your Own Agent"

## Advanced Topics

**Task Tracking Integration**
→ [COMPARISON.md](COMPARISON.md) - "Phase 3: Add Task Tracking"

**Research Systems**
→ [COMPARISON.md](COMPARISON.md) - "Phase 4: Add Research"

**Auto-Delegation**
→ [COMPARISON.md](COMPARISON.md) - "Phase 7: Add Auto-Delegation"

**Production Patterns**
→ [COMPARISON.md](COMPARISON.md) - Full comparison

## Contributing Your Own Agents

Created a useful agent? Document it here:

1. Add agent file to `agents/`
2. Update `agents/README.md` with description
3. Update `CLAUDE.md` agent registry
4. Update routing in `van.md`
5. Add examples to `README.md`

## Getting Help

If you're stuck:

1. Check the Troubleshooting sections
2. Re-read the relevant documentation
3. Try the examples in QUICKSTART.md
4. Review the agent structure in agents/README.md
5. Compare with the working examples (coder-agent, helper-agent)

## Related Resources

**Production System**: ../dumbdown_collective/
**Task Tracking**: .taskmaster/ (if integrated)
**Claude Code Docs**: claude.ai/docs

---

## Quick Navigation Menu

📚 **Learn**
- [QUICKSTART.md](QUICKSTART.md) - Fast start
- [README.md](README.md) - Complete guide
- [COMPARISON.md](COMPARISON.md) - Learning vs production

🔧 **Build**
- [agents/README.md](agents/README.md) - Create agents
- [.claude/commands/van.md](.claude/commands/van.md) - Modify routing
- [CLAUDE.md](CLAUDE.md) - Update registry

📖 **Reference**
- [agents/coder-agent.md](agents/coder-agent.md) - Code writer example
- [agents/helper-agent.md](agents/helper-agent.md) - Q&A example
- [INDEX.md](INDEX.md) - This navigation guide

---

Start with QUICKSTART.md if you want to dive in, or README.md if you want to understand first!
