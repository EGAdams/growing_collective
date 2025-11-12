# Tools Guide - How Agents Use Custom Tools

## Overview

This guide explains how the Growing Collective implements custom tools for agents, based on patterns from the `dumbdown_collective` production system.

## How Tools Work in Dumbdown Collective

After analyzing the dumbdown_collective codebase, here's how tools are incorporated:

### 1. **Tool Specification via Frontmatter**

Agents specify which tools they can use via YAML frontmatter in their markdown files:

```yaml
---
name: quality-agent
description: Reviews code quality and runs tests
tools: Read, Bash, Grep, Glob, LS, mcp__task-master__get_task
color: yellow
---
```

### 2. **Types of Tools**

There are two types of tools agents can use:

#### A. Built-in Claude Code Tools
These are standard tools available in Claude Code:
- `Read` - Read files
- `Write` - Write files
- `Edit` - Edit files
- `Bash` - Execute bash commands
- `Grep` - Search file contents
- `Glob` - Find files by pattern
- `LS` - List directory contents
- `TodoWrite` - Manage task lists
- `WebSearch` - Search the web
- `WebFetch` - Fetch web content

#### B. MCP (Model Context Protocol) Tools
Custom tools provided via MCP servers (prefix: `mcp__`):
- `mcp__task-master__get_task` - Get task from TaskMaster
- `mcp__task-master__set_task_status` - Update task status
- `mcp__context7__resolve-library-id` - Resolve library IDs
- `mcp__context7__get-library-docs` - Get library documentation

### 3. **Settings.json Configuration**

The `.claude/settings.json` file can deny specific tools:

```json
{
  "deniedTools": [
    "mcp__task-master__initialize_project"
  ]
}
```

### 4. **Command-Level Tool Restrictions**

Commands can also specify allowed tools in their frontmatter:

```yaml
---
allowed-tools: Task(*), Read(*), Write(*), Bash(*), mcp__task-master__*
description: Fast routing engine
---
```

## Implementing Custom Tools for Growing Collective

Since we're in a simplified learning environment, here are **three approaches** to add custom tools:

### Approach 1: Simple Shell Scripts (Recommended for Learning)

**What we implemented:** A simple bash script that agents can call via the `Bash` tool.

**Location:** `/home/adamsl/growing_collective/.claude/tools/get_current_time.sh`

**How it works:**
1. Create a shell script with your tool logic
2. Make it executable (`chmod +x`)
3. Agents call it using the Bash tool
4. Document its usage in the agent's markdown file

**Example:**

```bash
# In agent markdown:
# Use the time tool
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
```

**Pros:**
- Simple to create and understand
- No dependencies or setup required
- Easy to debug
- Perfect for learning

**Cons:**
- Less sophisticated than MCP
- Manual documentation needed
- No automatic tool discovery

### Approach 2: MCP Server (Production Approach)

**What we created:** A Node.js MCP server template at `.claude/tools/time-server.js`

**How it works:**
1. Create an MCP server using the `@modelcontextprotocol/sdk` package
2. Define tools with schemas and handlers
3. Register the server with Claude Code
4. Agents access tools via `mcp__your-server__tool-name`

**Setup Required:**
```bash
# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Configure server in Claude settings
# Add to MCP servers configuration
```

**Pros:**
- Professional, production-ready
- Automatic tool discovery
- Typed schemas and validation
- Better error handling

**Cons:**
- Requires Node.js setup
- More complex to implement
- Steeper learning curve

### Approach 3: Helper Functions in Agent Prompts

**How it works:**
Simply document common bash command patterns in the agent's instructions.

**Example:**
```markdown
## Getting Current Time

To get the current time, use:
- ISO format: `date -u +"%Y-%m-%dT%H:%M:%SZ"`
- Readable: `date "+%A, %B %d, %Y at %I:%M:%S %p %Z"`
- Unix: `date +%s`
```

**Pros:**
- No additional files needed
- Works immediately
- Simple for basic operations

**Cons:**
- Not reusable across agents
- No abstraction
- Clutters agent instructions

## Our Implementation: get_current_time Tool

We implemented **Approach 1** (shell script) for the Growing Collective.

### Files Created

1. **Tool Script**: `/home/adamsl/growing_collective/.claude/tools/get_current_time.sh`
   - Executable bash script
   - Supports 3 formats: iso, unix, readable
   - Optional timezone parameter

2. **Agent Definition**: `/home/adamsl/growing_collective/.claude/agents/general-purpose-agent.md`
   - Includes tool documentation
   - Specifies available tools in frontmatter
   - Provides usage examples

3. **MCP Template**: `/home/adamsl/growing_collective/.claude/tools/time-server.js`
   - Reference implementation for future MCP tools
   - Shows production-ready approach

### Using the Time Tool

**From an Agent:**

```markdown
---
name: my-agent
tools: Read, Write, Bash
---

When you need the current time, execute:

```bash
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
```
```

**Testing the Tool:**

```bash
# ISO format
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh iso
# Output: 2025-11-09T15:50:03Z

# Readable format
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
# Output: Sunday, November 09, 2025 at 10:50:05 AM EST

# Unix timestamp
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh unix
# Output: 1762703406
```

## Adding More Custom Tools

### Step 1: Create the Tool Script

```bash
# Create a new tool
touch /home/adamsl/growing_collective/.claude/tools/my_tool.sh
chmod +x /home/adamsl/growing_collective/.claude/tools/my_tool.sh
```

### Step 2: Implement Tool Logic

```bash
#!/bin/bash
# Your tool implementation
# Accept arguments, process, return results
```

### Step 3: Document in Agent

Update the agent's markdown to include:
- Tool location
- Usage examples
- Input/output formats
- Error handling

### Step 4: Add to Frontmatter (Optional)

While not required for shell scripts, you can document it:

```yaml
---
name: my-agent
tools: Read, Write, Bash
custom_tools: my_tool.sh, another_tool.sh
---
```

## Key Differences: Growing vs Dumbdown

| Feature | Growing Collective | Dumbdown Collective |
|---------|-------------------|---------------------|
| **Tool Discovery** | Manual documentation | MCP auto-discovery |
| **Tool Type** | Shell scripts | MCP servers |
| **Setup Complexity** | Minimal | Requires MCP SDK |
| **Tool Schemas** | Documented in markdown | Typed JSON schemas |
| **Error Handling** | Basic exit codes | Structured error responses |
| **Use Case** | Learning, simple tools | Production, complex tools |

## Best Practices

### For Learning (Current Approach)

1. **Keep it Simple**: Shell scripts are perfect for learning
2. **Document Well**: Clear usage examples in agent files
3. **Test Thoroughly**: Run tools manually before agent use
4. **Start Small**: One tool at a time
5. **Focus on Concepts**: Understand the pattern before scaling

### For Production (Future Upgrade)

1. **Use MCP**: Implement proper MCP servers
2. **Type Everything**: Use JSON schemas for validation
3. **Handle Errors**: Structured error responses
4. **Version Tools**: Track tool versions and changes
5. **Monitor Usage**: Log tool calls for debugging

## Example: Creating a Weather Tool

Here's how you'd create a simple weather tool:

```bash
#!/bin/bash
# /home/adamsl/growing_collective/.claude/tools/get_weather.sh

CITY="${1:-New York}"

# Simple example using wttr.in
curl -s "wttr.in/${CITY}?format=3"
```

Then document in your agent:

```markdown
### Weather Tool

Get current weather:
```bash
/home/adamsl/growing_collective/.claude/tools/get_weather.sh "New York"
```
```

## Summary

**What We Learned from Dumbdown:**
- Tools are specified in agent frontmatter
- MCP servers provide professional tool integration
- Settings.json can restrict tool access
- Commands can have tool-level permissions

**What We Implemented:**
- Simple shell script approach (perfect for learning)
- get_current_time tool with 3 formats
- general-purpose-agent with tool access
- MCP template for future reference

**Next Steps:**
1. Test the time tool with the general-purpose agent
2. Create more simple shell script tools
3. When ready, upgrade to MCP servers
4. Study dumbdown_collective for advanced patterns

---

**Remember:** Start simple, understand the concepts, then scale to production patterns!
