# Custom Tools Quick Reference

## Available Tools

### get_current_time

**Location:** `/home/adamsl/growing_collective/.claude/tools/get_current_time.sh`

**Description:** Returns the current date and time in various formats.

**Usage:**
```bash
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh [format] [timezone]
```

**Formats:**
- `iso` - ISO 8601 format (2025-11-09T15:50:03Z)
- `readable` - Human-readable (Sunday, November 09, 2025 at 10:50:05 AM EST)
- `unix` - Unix timestamp (1762703406)

**Examples:**
```bash
# Get current time in ISO format
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh iso

# Get readable time
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable

# Get Unix timestamp
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh unix

# Get time in specific timezone (readable)
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable "America/Los_Angeles"
```

## Using Tools in Agents

### Method 1: Via Agent Markdown (Recommended)

1. Add tool to agent's frontmatter:
```yaml
---
name: my-agent
tools: Read, Write, Bash
---
```

2. Document tool usage in agent's instructions:
```markdown
## Getting Current Time

Execute the time tool:
```bash
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
```
```

3. Agent can now use the tool via Bash commands

### Method 2: Direct Bash Calls

Agents with Bash access can directly execute:
```bash
/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable
```

## Testing Tools

Run the test script:
```bash
./test_time_tool.sh
```

## Creating New Tools

1. **Create script:**
   ```bash
   touch /home/adamsl/growing_collective/.claude/tools/my_tool.sh
   chmod +x /home/adamsl/growing_collective/.claude/tools/my_tool.sh
   ```

2. **Implement logic:**
   ```bash
   #!/bin/bash
   # Your tool code here
   echo "Tool output"
   ```

3. **Document in agent:**
   Add usage instructions to agent markdown

4. **Test:**
   ```bash
   /home/adamsl/growing_collective/.claude/tools/my_tool.sh
   ```

## Agents with Tool Access

- **general-purpose-agent** - Has access to time tool and standard tools
- **coder-agent** - Can use Bash to call tools
- **helper-agent** - Can reference tool documentation

## Learn More

See **TOOLS_GUIDE.md** for:
- How tools work in dumbdown_collective
- MCP server implementation
- Production patterns
- Advanced tool creation
