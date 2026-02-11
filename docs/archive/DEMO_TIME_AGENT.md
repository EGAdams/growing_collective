# Demo: General Purpose Agent Using Time Tool

## What This Demonstrates

This demo shows how the `general-purpose-agent` can use the custom `get_current_time` tool.

## How to Test

### Option 1: Using the /van Router

If you want to test via the router system:

```
/van What time is it right now?
```

The router should delegate to an appropriate agent that can answer this.

### Option 2: Direct Agent Invocation

You can directly tell Claude to act as the general-purpose-agent:

```
Act as the general-purpose-agent. Read /home/adamsl/growing_collective/.claude/agents/general-purpose-agent.md and use the time tool to tell me what time it is.
```

### Option 3: Manual Tool Call

You can also just execute the tool directly:

```bash
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
```

## Expected Behavior

When an agent uses the time tool, it should:

1. **Recognize the tool** is available (documented in agent markdown)
2. **Execute via Bash** using the full path to the script
3. **Return the result** to the user in a clear format

## Example Session

**User:** "What time is it?"

**Agent (general-purpose-agent):**

```bash
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
```

**Tool Output:**

```
Sunday, November 09, 2025 at 10:51:25 AM EST
```

**Agent Response:**
"The current time is Sunday, November 09, 2025 at 10:51:25 AM EST."

## What Makes This Work

### 1. Tool Implementation

- Shell script at `.claude/tools/get_current_time.sh`
- Executable with proper permissions
- Returns clean, parseable output

### 2. Agent Configuration

- Frontmatter specifies `Bash` tool access
- Instructions document how to use the time tool
- Clear usage examples

### 3. Integration Pattern

- Agent reads its own markdown instructions
- Sees time tool documentation
- Executes tool via Bash
- Returns results

## Comparison to Dumbdown Collective

| Aspect        | Growing (Our Impl)   | Dumbdown (Production) |
| ------------- | -------------------- | --------------------- |
| Tool Type     | Shell script         | MCP server            |
| Access Method | Bash execution       | MCP tool call         |
| Discovery     | Manual documentation | Auto-discovery        |
| Schemas       | In comments          | JSON schema           |
| Complexity    | Simple               | Advanced              |

## Key Learning Points

1. **Tools are just scripts** - In the simple approach, tools are executable files
2. **Agents call via Bash** - The Bash tool is the bridge to custom tools
3. **Documentation matters** - Agents need clear instructions on tool usage
4. **Frontmatter controls access** - The `tools:` field specifies what's available
5. **Production uses MCP** - For real systems, use MCP servers

## Next Steps

1. **Test the tool** - Run the examples above
2. **Create more tools** - Try building a calculator, file analyzer, etc.
3. **Study MCP** - Look at the `time-server.js` template
4. **Read dumbdown** - Explore the production patterns
5. **Scale gradually** - Move from scripts to MCP when ready

## Files to Explore

- **Agent:** `/home/adamsl/growing_collective/.claude/agents/general-purpose-agent.md`
- **Tool:** `/home/adamsl/growing_collective/.claude/tools/get_current_time.sh`
- **Guide:** `/home/adamsl/growing_collective/TOOLS_GUIDE.md`
- **Test:** `/home/adamsl/growing_collective/test_time_tool.sh`

---

**Remember:** This is the learning version. The pattern is:

1. Create tool script
2. Document in agent
3. Agent uses via Bash
4. Scale to MCP later
