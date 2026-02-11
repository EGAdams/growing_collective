# Agents - The Specialists

This directory contains specialized agents - each one focused on doing ONE thing well.

## What Is an Agent?

An agent is a markdown file with specific instructions for Claude. When the router delegates to an agent, Claude loads that markdown file and follows its instructions.

Think of agents as "job descriptions" - they tell Claude what role to play and how to do it.

## Current Agents

### coder-agent.md

**Purpose**: Writes clean, working code

**Triggers**: write, code, function, create, build, implement

**Example requests**:

- "Write a function to calculate factorial"
- "Create a React component for a button"
- "Build a simple calculator in Python"

**What it delivers**:

- Clean code
- Usage examples
- Brief explanation

### helper-agent.md

**Purpose**: Answers questions and explains concepts

**Triggers**: what, why, how, explain, difference, help

**Example requests**:

- "What is the difference between let and const?"
- "How does async/await work?"
- "Explain closures to me"

**What it delivers**:

- Clear answer
- Detailed explanation
- Examples
- Key takeaways

## Agent Structure

Every agent file follows this pattern:

```markdown
# Agent Name - What It Does

## Your Role

[Clear description of the agent's job]

## When You Receive a Task

[Types of requests this agent handles]

## Your Process

[Step-by-step workflow]

## Example Output Format

[How to structure responses]

## What You Focus On

[DO and DON'T lists]

## Example Interaction

[Sample request and response]
```

## How Agents Get Activated

1. User types: `/van write a function`
2. Router (van.md) analyzes the request
3. Router sees "write" + "function" = coding request
4. Router delegates: "Use the coder-agent subagent to..."
5. Claude loads coder-agent.md
6. Claude follows coder-agent's instructions
7. User gets specialized help

## Creating Your Own Agent

Want to add a new specialist? Follow these steps:

### Step 1: Identify the Need

Ask yourself:

- What type of request comes up repeatedly?
- Is it different enough from existing agents?
- Can it be focused on ONE clear job?

Examples:

- tester-agent: Writes tests for code
- reviewer-agent: Reviews code for issues
- documenter-agent: Writes documentation

### Step 2: Create the Agent File

Create `agents/your-agent.md`:

```markdown
# Your Agent Name - Brief Description

## Your Role

You are a [specific role]. Your job is to [one clear task].

## When You Receive a Task

You'll get requests like:

- [Example 1]
- [Example 2]
- [Example 3]

## Your Process

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Example Output Format

[Show how responses should be structured]

## What You Focus On

### DO:

- [Do this]
- [Do that]

### DON'T:

- [Don't do this]
- [Don't do that]

## Example Interaction

**Request**: [Sample request]

**Your Response**:
[Sample response showing ideal output]

---

**Quick Reference:**

- **Your job**: [One sentence]
- **Your output**: [What you deliver]
- **Your focus**: [Key priority]
```

### Step 3: Update the Router

Edit `.claude/commands/van.md` to add routing logic:

```markdown
**If request contains [your keywords]:**

- Keywords: `keyword1`, `keyword2`, `keyword3`
- Action: Use the `your-agent` subagent
- Example: "keyword1 something" → your-agent
```

### Step 4: Update CLAUDE.md

Add your agent to the "Available Agents" section:

```markdown
### your-agent

- **Trigger words**: keyword1, keyword2, keyword3
- **Purpose**: [What it does]
- **Location**: agents/your-agent.md
```

### Step 5: Test It

```bash
# Start Claude Code in growing_collective
cd growing_collective
claude

# Test your new agent
/van [trigger phrase]
```

## Agent Design Principles

### 1. Single Responsibility

Each agent should do ONE thing well. Don't create agents that do too much.

**Good**: `coder-agent` writes code
**Bad**: `code-and-test-and-document-agent` does three things

### 2. Clear Boundaries

Make sure agents don't overlap in responsibility.

**Good**:

- coder-agent writes code
- helper-agent answers questions

**Bad**:

- coder-agent writes code AND explains it
- helper-agent explains AND writes example code

### 3. Focused Instructions

Keep agent files focused and actionable. No fluff, just clear directions.

**Good**: "Your job is to write clean code"
**Bad**: "You might sometimes perhaps consider writing code when appropriate"

### 4. Consistent Structure

All agents should follow the same file structure for predictability.

### 5. Example-Driven

Show examples of good output. Examples teach better than descriptions.

## Agent Best Practices

### DO:

- Keep agent instructions under 200 lines
- Provide clear examples of input and output
- Define the process step-by-step
- List specific DO and DON'T behaviors
- Include a "Quick Reference" section at the end

### DON'T:

- Make agents too general ("helper agent for everything")
- Overlap responsibilities between agents
- Use vague language in instructions
- Create agents without clear use cases
- Forget to update the router when adding agents

## Testing Your Agent

### Test Checklist

- [ ] Agent file is clear and focused
- [ ] Router can trigger the agent
- [ ] Agent produces expected output format
- [ ] Agent stays within its responsibility
- [ ] Example interactions work as shown

### Test Commands

```bash
# Test coder-agent
/van Write a hello world function

# Test helper-agent
/van What is a closure?

# Test your new agent
/van [your trigger phrase]
```

## Common Agent Patterns

### The Writer Pattern (coder-agent)

- Receives requirements
- Produces artifact (code)
- Explains the artifact
- Provides usage instructions

### The Explainer Pattern (helper-agent)

- Receives question
- Provides direct answer
- Adds detailed explanation
- Gives examples and takeaways

### The Analyzer Pattern

- Receives input to analyze
- Performs analysis
- Reports findings
- Suggests improvements

### The Validator Pattern

- Receives artifact to validate
- Checks against criteria
- Reports issues
- Suggests fixes

## Example: Creating a Tester Agent

Let's walk through creating a new agent:

### 1. Create the File

`agents/tester-agent.md`:

```markdown
# Tester Agent - Test Writing Specialist

## Your Role

You write comprehensive tests for code.

## When You Receive a Task

You'll receive requests like:

- "Write tests for this function"
- "Create test cases for user login"

## Your Process

1. Understand what code needs testing
2. Identify test cases (normal, edge, error cases)
3. Write clean, organized tests
4. Explain test coverage

[Continue with full agent structure...]
```

### 2. Update Router

In `.claude/commands/van.md`:

```markdown
**If request contains testing keywords:**

- Keywords: `test`, `testing`, `test cases`, `write tests`
- Action: Use the `tester-agent` subagent
- Example: "Write tests for..." → tester-agent
```

### 3. Update CLAUDE.md

```markdown
### tester-agent

- **Trigger words**: test, testing, test cases, write tests
- **Purpose**: Writes comprehensive tests for code
- **Location**: agents/tester-agent.md
```

### 4. Test It

```
/van Write tests for a login function
```

## Troubleshooting

**Agent not loading?**

- Check filename matches router exactly
- Verify file is in agents/ directory
- Check router delegation syntax

**Agent doing wrong thing?**

- Review agent instructions for clarity
- Add more specific DO/DON'T rules
- Improve example interactions

**Multiple agents activating?**

- Sharpen routing keywords
- Define clearer boundaries
- Update trigger words to be more specific

## Next Steps

1. Try using the existing agents
2. Identify a new agent you'd like to create
3. Follow the creation steps above
4. Test and refine your agent
5. Share what you learned!

---

Remember: Agents are specialists. Each one should be really good at ONE thing.
The power comes from having multiple focused agents, not one agent that does everything.
