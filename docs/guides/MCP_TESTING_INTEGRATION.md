# MCP Testing Integration Plan

## Overview

This guide implements the MCP code execution pattern from Anthropic's engineering blog to add browser testing (Puppeteer) and code intelligence (Context7) to the Growing Collective system.

## Key Concepts from Anthropic MCP Article

**Problem Solved:** Traditional MCP implementations load all tools upfront and pass data through context, consuming 50,000+ tokens unnecessarily.

**Solution:** Present MCP servers as code APIs - agents write code that processes data locally, returning only filtered results (98.7% token reduction).

## Recommended MCP Servers for Testing

### 1. Puppeteer MCP Server

**Purpose:** Browser automation and testing
**Package:** `puppeteer-mcp-server` or `@modelcontextprotocol/server-puppeteer`
**Capabilities:**

- Launch and control Chrome/Chromium
- Navigate pages, click elements, fill forms
- Take screenshots for validation
- Execute JavaScript in browser context
- Wait for elements with timeouts
- Stealth mode to bypass bot detection

**Testing Use Cases:**

- E2E test automation
- Visual regression testing
- Form validation testing
- Screenshot-based documentation
- Web scraping for test data

### 2. Context7 MCP Server

**Purpose:** Up-to-date code documentation and intelligence
**Package:** `@upstash/context7-mcp`
**Capabilities:**

- Pull version-specific documentation
- Provide correct API examples
- Support for 100+ programming languages/frameworks
- Real-time library reference lookup
- Accurate import statements and patterns

**Testing Use Cases:**

- Generate correct test assertions
- Use latest testing framework APIs
- Validate code against current best practices
- Write tests for unfamiliar libraries
- Ensure version-accurate mocking

## Architecture: Code-API Pattern

### Traditional Approach (High Token Cost)

```
Agent → MCP Tool Call → Full Data → Context → Agent → Process → Output
```

Token cost: ~50,000 for large datasets

### Code-API Approach (Low Token Cost)

```
Agent → Write Code → Execute Locally → Filter Data → Small Result → Context
```

Token cost: ~2,000 (98.7% reduction)

## Implementation Plan

### Phase 1: MCP Configuration Setup

**File: `.claude/mcp.json`**

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["puppeteer-mcp-server"],
      "env": {
        "HEADLESS": "true"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"]
    }
  }
}
```

### Phase 2: Server Wrapper Structure

Create code-API wrappers following Anthropic's pattern:

**Directory Structure:**

```
servers/
├── browser/
│   ├── index.ts          # Main exports
│   ├── navigate.ts       # Navigate to URL
│   ├── screenshot.ts     # Capture screenshots
│   ├── click.ts          # Click elements
│   ├── fillForm.ts       # Form interactions
│   └── waitFor.ts        # Wait for elements
├── code-intelligence/
│   ├── index.ts          # Main exports
│   ├── getDocumentation.ts  # Fetch docs
│   ├── getExamples.ts    # Get code examples
│   └── validateAPI.ts    # Check API versions
└── shared/
    └── callMCPTool.ts    # Bridge function
```

**Example: servers/browser/navigate.ts**

```typescript
import { callMCPTool } from "../shared/callMCPTool";

export interface NavigateOptions {
  url: string;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0";
  timeout?: number;
}

export async function navigate(options: NavigateOptions): Promise<void> {
  return await callMCPTool("puppeteer", "navigate", {
    url: options.url,
    waitUntil: options.waitUntil || "load",
    timeout: options.timeout || 30000,
  });
}
```

**Example: servers/browser/screenshot.ts**

```typescript
import { callMCPTool } from "../shared/callMCPTool";

export interface ScreenshotOptions {
  path?: string;
  fullPage?: boolean;
  type?: "png" | "jpeg";
}

export interface ScreenshotResult {
  base64: string;
  width: number;
  height: number;
}

export async function screenshot(options: ScreenshotOptions = {}): Promise<ScreenshotResult> {
  const result = await callMCPTool("puppeteer", "screenshot", {
    fullPage: options.fullPage || false,
    type: options.type || "png",
  });

  // Data stays in execution environment
  // Only metadata goes to context
  return {
    base64: result.data,
    width: result.width,
    height: result.height,
  };
}
```

**Example: servers/code-intelligence/getDocumentation.ts**

```typescript
import { callMCPTool } from "../shared/callMCPTool";

export interface DocRequest {
  library: string;
  version?: string;
  topic?: string;
}

export interface DocResult {
  content: string;
  version: string;
  url: string;
}

export async function getDocumentation(request: DocRequest): Promise<DocResult> {
  const docs = await callMCPTool("context7", "get_docs", {
    library: request.library,
    version: request.version || "latest",
    topic: request.topic,
  });

  // Filter to relevant sections only
  // Avoid dumping entire docs into context
  return {
    content: docs.relevantSection, // Not full docs!
    version: docs.version,
    url: docs.sourceUrl,
  };
}
```

### Phase 3: Testing Agent Creation

**File: `.claude/agents/test-agent.md`**

````markdown
---
name: test-agent
description: Specialized agent for browser and code testing with MCP tools
tools: Read, Write, Edit, Bash, Grep, Glob
color: green
---

# Test Agent

## Your Role

You are a testing specialist with access to browser automation (Puppeteer) and code intelligence (Context7) via code-API patterns.

## Available MCP Servers

### Browser Automation Server

Location: `/home/adamsl/growing_collective/servers/browser/`

Explore the directory to find available functions:

- `navigate.ts` - Navigate to URLs
- `screenshot.ts` - Capture screenshots
- `click.ts` - Click elements
- `fillForm.ts` - Fill form fields
- `waitFor.ts` - Wait for elements

### Code Intelligence Server

Location: `/home/adamsl/growing_collective/servers/code-intelligence/`

Functions available:

- `getDocumentation.ts` - Fetch library docs
- `getExamples.ts` - Get code examples
- `validateAPI.ts` - Check API versions

## How to Use MCP Tools (Code-API Pattern)

**DO NOT** directly call MCP tools through bash or tool invocations.

**DO** write code that uses the wrapper functions:

```typescript
// Example: Browser test workflow
import { navigate, screenshot, click, waitFor } from "../servers/browser";

async function testLoginFlow() {
  // Navigate to page
  await navigate({ url: "http://localhost:3000/login" });

  // Wait for form
  await waitFor({ selector: "#login-form", timeout: 5000 });

  // Take before screenshot
  const before = await screenshot({ fullPage: true });

  // Fill and submit (processed locally)
  await click({ selector: "#username" });
  // ... more interactions

  // Take after screenshot
  const after = await screenshot({ fullPage: true });

  // Return only pass/fail + error details
  // NOT full screenshot data to context
  return {
    success: true,
    beforeSize: before.width + "x" + before.height,
    afterSize: after.width + "x" + after.height,
  };
}
```
````

## Progressive Tool Discovery

Instead of loading all tool documentation upfront:

1. **Explore:** Use Glob to find available server functions
2. **Read:** Read only the specific .ts file you need
3. **Use:** Import and call the function in your code

This reduces context from ~5000 tokens to ~200 tokens.

## Test Workflow Pattern

```typescript
// 1. Use Context7 to get correct API usage
import { getDocumentation } from "../servers/code-intelligence";

const docs = await getDocumentation({
  library: "jest",
  version: "29.0",
  topic: "async testing",
});

// 2. Write test using correct patterns
// 3. Use Puppeteer to execute browser tests
// 4. Filter results before returning to context
// 5. Return only: pass/fail, error messages, key metrics
```

## When You Receive a Task

1. **Determine test type:** Unit, integration, E2E?
2. **Discover tools:** Explore server directories for needed functions
3. **Write test code:** Use code-API pattern, not direct tool calls
4. **Execute locally:** Process data in execution environment
5. **Return filtered results:** Only essential info to context

## Best Practices

- Keep large data (screenshots, docs) in execution environment
- Return only filtered/aggregated results
- Use TypeScript interfaces for type safety
- Chain operations in code rather than sequential tool calls
- Implement error handling and retries in code

````

### Phase 4: Router Integration

**Update: `.claude-collective/DECISION.md`**

Add testing route:
```markdown
**Testing Keywords** → test-agent
- Keywords: `test`, `browser`, `e2e`, `screenshot`, `validate`, `check`
- Action: Use Task tool with test-agent
- Example: "Test the login flow" → test-agent

**For testing requests:**
Use Task tool with:
- subagent_type: "general-purpose"
- description: "Testing task"
- prompt: "You are the test-agent specialist. Read /home/adamsl/growing_collective/.claude/agents/test-agent.md and follow its instructions exactly to: [user's request]"
````

**Update: `.claude-collective/AGENTS.md`**

Add agent entry:

```markdown
### test-agent

- **Trigger words**: test, browser, e2e, screenshot, validate
- **Purpose**: Browser automation and testing with MCP tools
- **Location**: .claude/agents/test-agent.md
- **Specialization**: E2E testing, visual validation, code intelligence
- **MCP Servers**: Puppeteer (browser), Context7 (docs)

When you need testing, this agent will:

- Write browser automation code using Puppeteer API
- Capture screenshots and validate UI
- Use Context7 for correct testing framework usage
- Process test data locally (code-API pattern)
- Return only filtered results to reduce tokens
```

### Phase 5: Installation Guide

**File: `docs/guides/MCP_SETUP.md`**

````markdown
# MCP Testing Tools Setup

## Prerequisites

- Node.js 18+ installed
- npm or npx available
- Chrome/Chromium browser (for Puppeteer)

## Installation

### Option 1: Global Installation

```bash
# Install MCP servers globally
npm install -g puppeteer-mcp-server
npm install -g @upstash/context7-mcp

# Verify installation
npx puppeteer-mcp-server --version
npx @upstash/context7-mcp --version
```
````

### Option 2: npx (No Installation)

MCP servers can run directly via npx - no installation needed.
The `.claude/mcp.json` config uses npx by default.

## Configuration

Create `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["puppeteer-mcp-server"],
      "env": {
        "HEADLESS": "true"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"]
    }
  }
}
```

## Verification

Test that servers are accessible:

```bash
# Test Puppeteer server
npx puppeteer-mcp-server

# Test Context7 server
npx @upstash/context7-mcp
```

## Usage

Use `/van` command to route to test-agent:

```bash
/van Test the login form on localhost:3000
/van Take a screenshot of the dashboard
/van Validate the API usage in my test file
```

## Troubleshooting

**Puppeteer not launching Chrome:**

- Install Chrome: `sudo apt-get install chromium-browser`
- Set path: `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`

**Context7 network errors:**

- Check internet connection
- Verify library name spelling
- Try with version: `{ library: 'react', version: '18.0.0' }`

````

## Example Test Workflows

### Example 1: Login Flow Test
```typescript
// servers/tests/login-test.ts
import { navigate, waitFor, click, screenshot } from '../browser';

export async function testLoginFlow() {
  await navigate({ url: 'http://localhost:3000/login' });
  await waitFor({ selector: '#login-form' });

  // Fill form (details omitted)
  // ...

  await click({ selector: '#submit-btn' });
  await waitFor({ selector: '.dashboard' });

  const proof = await screenshot({ fullPage: false });

  // Return only success/failure - NOT full screenshot
  return {
    success: true,
    screenshotSize: `${proof.width}x${proof.height}`
  };
}
````

### Example 2: Documentation-Driven Test Generation

```typescript
// servers/tests/generate-test.ts
import { getDocumentation, getExamples } from "../code-intelligence";

export async function generateJestTest(componentName: string) {
  // Get latest Jest docs
  const docs = await getDocumentation({
    library: "jest",
    version: "latest",
    topic: "async testing",
  });

  // Get React Testing Library examples
  const examples = await getExamples({
    library: "@testing-library/react",
    query: "async component",
  });

  // Generate test using correct patterns
  // Data processing happens here - not in context
  const testCode = generateTestFromDocs(docs, examples, componentName);

  // Return only the generated code - NOT full docs
  return { code: testCode, docsVersion: docs.version };
}
```

## Benefits Summary

### Token Efficiency

- **Before:** 50,000 tokens (full screenshots + docs in context)
- **After:** 2,000 tokens (filtered results only)
- **Savings:** 98.7% reduction

### Workflow Efficiency

- **Before:** Sequential tool calls through model
- **After:** Local code execution with loops/conditionals
- **Benefit:** Faster, more complex test logic

### Data Privacy

- **Before:** All intermediate data flows through context
- **After:** Sensitive data stays in execution environment
- **Benefit:** Screenshots, user data never hit model context

## Next Steps

1. Install MCP servers (see Installation section)
2. Create `.claude/mcp.json` configuration
3. Try example: `/van Take a screenshot of example.com`
4. Read agent file: `.claude/agents/test-agent.md`
5. Explore server wrappers: `servers/browser/` directory

## Security Notes

From Anthropic's article:

> "Running agent-generated code requires a secure execution environment with appropriate sandboxing, resource limits, and monitoring."

For this learning system:

- WSL2 provides baseline sandboxing
- Puppeteer runs in headless mode by default
- Add timeouts to prevent infinite loops
- Monitor execution logs
- Review generated code before production use

## References

- [Anthropic MCP Code Execution Article](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Puppeteer MCP Documentation](https://github.com/merajmehrabi/puppeteer-mcp-server)
- [Context7 MCP Documentation](https://github.com/upstash/context7)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)

```

```
