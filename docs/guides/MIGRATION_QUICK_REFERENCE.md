# Growing → Dumbdown: Quick Reference Guide

## One-Page Pattern Summary

### The 3 Most Important Differences

#### 1. CLAUDE.md: Inline → Imports (95% context reduction!)

```
BEFORE (Growing):
CLAUDE.md [152 lines, all content]

AFTER (Dumbdown):
CLAUDE.md [7 lines, imports only]
@./.claude-collective/DECISION.md
@./.claude-collective/CLAUDE.md
@./.claude-collective/agents.md
```

**Why**: JIT context loading. Load only what you need, when you need it.

---

#### 2. Agent Files: Markdown → YAML Frontmatter + Tools

```yaml
# BEFORE (Growing):
# Coder Agent - Code Writing Specialist
## Your Role
...
# AFTER (Dumbdown):
---
name: coder-agent
description: Writes clean, tested code
tools: Read, Write, Edit, MultiEdit, Glob, Grep, LS, Bash
color: blue
---
I am the coder-agent specialist...
```

**Why**: Explicit tool declaration enables security and discovery.

---

#### 3. Hooks: 2 Simple → 6+ Sophisticated

```
BEFORE:
- SessionStart: load-decision.sh
- SubagentStop: auto-handoff.sh

AFTER:
- SessionStart: load-behavioral-system.sh (3 matchers)
- PreToolUse: directive-enforcer.sh
- PreToolUse: block-destructive-commands.sh
- PostToolUse: test-driven-handoff.sh
- PostToolUse: collective-metrics.sh
- SubagentStop: auto-handoff.sh + mocks + metrics
```

**Why**: Validation, enforcement, and metrics at every touch point.

---

## Migration Phases at a Glance

### Phase 1: Foundation (Week 1-2) - CRITICAL

**Time**: 6-8 hours
**Effort**: Moderate
**Impact**: Enables all other improvements

- Implement @ import pattern in CLAUDE.md
- Add YAML frontmatter to all agents
- Update tool declarations
- Update .claude/settings.json

**Result**: Ready to scale, clean foundation

### Phase 2: Capability (Week 3-4) - IMPORTANT

**Time**: 10-12 hours
**Effort**: Moderate-High
**Impact**: Production-ready routing

- Expand hook system (PreToolUse, PostToolUse)
- Add command frontmatter
- Enhance van.md routing (pattern matching → decision matrix)
- Add /mock and /continue-handoff commands

**Result**: Sophisticated routing, validation, metrics

### Phase 3: Sophistication (Week 5+) - OPTIONAL

**Time**: 12-16 hours
**Effort**: High
**Impact**: Project coordination

- Integrate .taskmaster
- Implement quality gates (quality.md)
- Add research framework (research.md)
- Expand to 10-15 specialized agents

**Result**: Production system with coordination

### Phase 4: Scale (Week 6+) - OPTIONAL

**Time**: Ongoing
**Effort**: Varies
**Impact**: Learning and evolution

- Expand to 30+ agents
- Machine learning for routing
- Research validation
- Continuous optimization

**Result**: Advanced research platform

---

## File Checklist

### Must Create (Phase 1-2)

- [ ] `.claude-collective/CLAUDE.md`
- [ ] `.claude-collective/agents.md`
- [ ] `.claude/commands/mock.md`
- [ ] `.claude/hooks/directive-enforcer.sh`
- [ ] `.claude/hooks/test-driven-handoff.sh`

### Must Modify (Phase 1)

- [ ] `CLAUDE.md` - Use @ imports
- [ ] `.claude/agents/coder-agent.md` - Add frontmatter
- [ ] `.claude/agents/helper-agent.md` - Add frontmatter
- [ ] `.claude/agents/general-purpose-agent.md` - Add frontmatter
- [ ] `.claude/commands/van.md` - Add frontmatter
- [ ] `.claude/settings.json` - Update hooks

### Should Create (Phase 3)

- [ ] `.claude-collective/quality.md`
- [ ] `.claude-collective/hooks.md`
- [ ] `.claude-collective/research.md`
- [ ] `.taskmaster/CLAUDE.md`
- [ ] `.taskmaster/config.json`

---

## Key Concepts Explained Simply

### JIT Context Loading (Import Pattern)

**Problem**: All context loaded always = bloat + slow
**Solution**: Load only what you need, when you need it
**Pattern**: Use @ imports to reference other files
**Result**: 65% context reduction while maintaining capability

### Tool Declaration

**Problem**: Tools are implicit, unclear which agents can use what
**Solution**: Declare tools explicitly in YAML frontmatter
**Pattern**: `tools: Read, Write, Bash, mcp__task-master__get_task`
**Result**: Security, clarity, auditability

### Hook System

**Problem**: Limited validation and no metrics
**Solution**: Hooks at every lifecycle point (Pre, Post, On events)
**Pattern**: SessionStart, PreToolUse, PostToolUse, SubagentStop
**Result**: Comprehensive validation and metrics collection

### Dual Auto-Delegation

**Problem**: Limited handoff detection
**Solution**: Two systems: MY handoffs + AGENT handoffs
**Pattern**: State files (NEXT_ACTION.json) + Hook detection
**Result**: Complete handoff coverage, session resumption

### TDD Contracts

**Problem**: No quality assurance on handoffs
**Solution**: Validate handoff success with test contracts
**Pattern**: Tests before implementation, metrics on completion
**Result**: Quality assurance, reproducible results

---

## Common Questions

### Q: Do I have to do all phases?

**A**: Phase 1 is required. Phase 2 is highly recommended. Phase 3-4 are optional based on your needs.

### Q: How long will this take?

**A**: Phase 1: 6-8 hours. Phase 2: 10-12 hours. Phase 3: 12-16 hours. Total: 30-40 hours if doing all phases.

### Q: Can I do this gradually?

**A**: Yes! Do Phase 1 first (foundation). Test it. Then Phase 2 when ready. Phases 3-4 are additive.

### Q: What breaks if I skip a phase?

**A**: Phase 1 is foundational. Skip it and context will get bloated. Phases 2-3 are additive, can skip without breaking.

### Q: Which is most important?

**A**: Import pattern (Phase 1). That's the foundation that enables everything else.

### Q: Can I run Growing and Dumbdown patterns side-by-side?

**A**: Mostly yes, but recommended to migrate Phase 1 first to have clean foundation.

---

## Comparison at a Glance

| Feature         | Growing      | Dumbdown       | Why It Matters            |
| --------------- | ------------ | -------------- | ------------------------- |
| CLAUDE.md lines | 152 (inline) | 7 (imports)    | Scales context management |
| Agents          | 3            | 30+            | Production capability     |
| Agent structure | Plain MD     | YAML + tools   | Security and discovery    |
| Hook count      | 2            | 6+             | Comprehensive validation  |
| Commands        | 1 (/van)     | 7+             | Advanced capabilities     |
| Hook events     | 2            | 4              | Better coverage           |
| TaskMaster      | None         | Integrated     | Project coordination      |
| Quality gates   | None         | Full TDD       | Quality assurance         |
| Metrics         | None         | Tracking       | Research validation       |
| MCP tools       | None         | Full ecosystem | Modern tooling            |

---

## Success Metrics

### Phase 1 Complete

- CLAUDE.md uses @ imports successfully
- All agents have frontmatter with tools
- Context loading works as expected
- Settings.json validates hooks

### Phase 2 Complete

- PreToolUse and PostToolUse hooks working
- Van.md has decision matrix (30+ rules)
- /mock command testing agents in isolation
- Metrics collecting on tool usage

### Phase 3 Complete

- TaskMaster integration initialized
- Quality gates validating handoffs
- TDD completion reports generating
- Research hypotheses being tracked

### Phase 4 Complete

- 30+ specialized agents deployed
- Routing accuracy >95%
- Context retention >90% across handoffs
- Research framework producing insights

---

## Quick Start Checklist

### Day 1: Set Foundation

- [ ] Read DUMBDOWN_MIGRATION_ANALYSIS.md sections 1-5
- [ ] Understand import pattern
- [ ] Understand agent frontmatter
- [ ] Plan Phase 1 implementation

### Day 2-3: Do Phase 1

- [ ] Create `.claude-collective/DECISION.md`
- [ ] Create `.claude-collective/CLAUDE.md`
- [ ] Create `.claude-collective/agents.md`
- [ ] Update all agent files with frontmatter
- [ ] Restructure CLAUDE.md to use imports
- [ ] Update settings.json with new hooks
- [ ] Test and validate

### Week 2: Plan Phase 2

- [ ] Decide on timing (immediate or later)
- [ ] Review hook system requirements
- [ ] Plan agent expansion strategy

### Week 3+: Execute Phases 2-4

- [ ] Follow phase roadmap
- [ ] Test after each phase
- [ ] Document learnings
- [ ] Iterate improvements

---

## Most Important Files to Review

1. **DUMBDOWN_MIGRATION_ANALYSIS.md** - Complete analysis (this doc's parent)
2. **dumbdown_collective/CLAUDE.md** - Pattern example (minimal imports)
3. **dumbdown_collective/.claude-collective/CLAUDE.md** - Behavioral rules example
4. **dumbdown_collective/.claude/agents/component-implementation-agent.md** - Frontmatter + tools example
5. **dumbdown_collective/.claude/commands/van.md** - Decision matrix example
6. **dumbdown_collective/.claude/settings.json** - Hook configuration example

---

**Remember**: Growing is the foundation. Dumbdown is what it becomes at scale. Adopt patterns incrementally, test after each phase, and focus on understanding the "why" before the "what".

The goal is learning, not just copying. Understand each pattern deeply before moving to the next phase.
