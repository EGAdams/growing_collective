# MCP Integration Roadmap for Growing Collective

## Document Purpose

This roadmap provides a complete implementation plan for integrating MCP (Model Context Protocol) code execution patterns into the Growing Collective system, based on Anthropic's engineering blog article: "Code Execution with MCP".

**Target Audience:** Developers implementing MCP testing tools and code-API patterns
**Status:** Planning Phase
**Last Updated:** 2025-11-09

---

## Executive Summary

### The Problem

Traditional MCP implementations suffer from:

- **Context inefficiency**: Loading all tool definitions upfront
- **Token waste**: Passing large intermediate results through model context
- **Example**: A single 2-hour meeting transcript consumes 50,000+ tokens

### The Solution

**Code-API Pattern**: Present MCP servers as code APIs rather than direct tool calls

- Agents write code that processes data locally
- Only filtered results return to model context
- **Result**: 98.7% token reduction (150K → 2K tokens in documented cases)

### Implementation Goal

Add browser testing (Puppeteer) and code intelligence (Context7) to Growing Collective using the code-API pattern.

---

## Phase 1: MCP Server Setup

### 1.1 Install MCP Servers

**Puppeteer MCP Server** (Browser Automation)

```bash
# Option A: Global installation
npm install -g puppeteer-mcp-server

# Option B: Use npx (no installation)
npx puppeteer-mcp-server --version
```

**Context7 MCP Server** (Code Intelligence)

```bash
# Option A: Global installation
npm install -g @upstash/context7-mcp

# Option B: Use npx (no installation)
npx @upstash/context7-mcp --version
```

**Verification:**

```bash
# Test both servers are accessible
npx puppeteer-mcp-server
npx @upstash/context7-mcp
```

### 1.2 Create MCP Configuration

**File:** `.claude/mcp.json`

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["puppeteer-mcp-server"],
      "env": {
        "HEADLESS": "true",
        "PUPPETEER_EXECUTABLE_PATH": "/usr/bin/chromium-browser"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"],
      "env": {}
    }
  }
}
```

**Configuration Notes:**

- Uses `npx` to avoid global installation requirements
- Puppeteer runs in headless mode by default
- Chrome/Chromium path may need adjustment per system

### 1.3 System Prerequisites

**Required:**

- Node.js 18+ installed
- npm or npx available
- Chrome/Chromium browser

**Installation (Ubuntu/WSL2):**

```bash
sudo apt-get update
sudo apt-get install chromium-browser nodejs npm
```

**Validation:**

```bash
node --version   # Should be 18+
npm --version
which chromium-browser
```

---

## Phase 2: Code-API Server Wrappers

### 2.1 Directory Structure

Create the following structure:

```
growing_collective/
├── servers/
│   ├── browser/
│   │   ├── index.ts
│   │   ├── navigate.ts
│   │   ├── screenshot.ts
│   │   ├── click.ts
│   │   ├── fillForm.ts
│   │   ├── waitFor.ts
│   │   └── README.md
│   ├── code-intelligence/
│   │   ├── index.ts
│   │   ├── getDocumentation.ts
│   │   ├── getExamples.ts
│   │   ├── validateAPI.ts
│   │   └── README.md
│   └── shared/
│       ├── callMCPTool.ts
│       ├── types.ts
│       └── README.md
```

**Create directories:**

```bash
cd /home/adamsl/growing_collective
mkdir -p servers/browser servers/code-intelligence servers/shared
```

### 2.2 Shared Infrastructure

**File:** `servers/shared/callMCPTool.ts`

```typescript
/**
 * Bridge function to call MCP tools
 * This is the core connection between code-API wrappers and actual MCP servers
 */

export interface MCPToolCall {
  server: string;
  tool: string;
  parameters: Record<string, any>;
}

export interface MCPToolResult {
  success: boolean;
  data: any;
  error?: string;
}

/**
 * Call an MCP tool through the configured server
 *
 * @param server - Server name from mcp.json (e.g., 'puppeteer', 'context7')
 * @param tool - Tool name within the server (e.g., 'navigate', 'screenshot')
 * @param parameters - Tool-specific parameters
 * @returns Promise with tool execution result
 */
export async function callMCPTool(
  server: string,
  tool: string,
  parameters: Record<string, any>,
): Promise<any> {
  // NOTE: This is a placeholder implementation
  // In production, this would use the actual MCP client SDK
  // For now, it demonstrates the interface pattern

  const toolCall: MCPToolCall = {
    server,
    tool,
    parameters,
  };

  // TODO: Replace with actual MCP client call
  // Example: return await mcpClient.callTool(toolCall);

  throw new Error(
    `MCP tool call not yet implemented: ${server}.${tool}\n` +
      `Parameters: ${JSON.stringify(parameters, null, 2)}\n` +
      `This is a placeholder - implement actual MCP client integration.`,
  );
}
```

**File:** `servers/shared/types.ts`

```typescript
/**
 * Shared type definitions for MCP server wrappers
 */

export interface BaseToolOptions {
  timeout?: number;
}

export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export type TimeoutMs = number;
export type Selector = string;
export type URL = string;
```

**File:** `servers/shared/README.md`

```markdown
# Shared MCP Infrastructure

This directory contains shared utilities used by all MCP server wrappers.

## Files

- **callMCPTool.ts** - Bridge function to invoke MCP tools
- **types.ts** - Common type definitions

## Usage

All server wrappers import from here:

\`\`\`typescript
import { callMCPTool } from '../shared/callMCPTool';
import { ToolResult, TimeoutMs } from '../shared/types';
\`\`\`

## Implementation Status

⚠️ **callMCPTool.ts is currently a placeholder**

Actual MCP client integration needs to be implemented based on your MCP setup.
```

### 2.3 Browser Automation Wrappers

**File:** `servers/browser/navigate.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions, URL } from "../shared/types";

export interface NavigateOptions extends BaseToolOptions {
  url: URL;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
}

/**
 * Navigate to a URL in the browser
 *
 * @param options - Navigation configuration
 * @example
 * await navigate({
 *   url: 'http://localhost:3000/login',
 *   waitUntil: 'networkidle0',
 *   timeout: 30000
 * });
 */
export async function navigate(options: NavigateOptions): Promise<void> {
  return await callMCPTool("puppeteer", "navigate", {
    url: options.url,
    waitUntil: options.waitUntil || "load",
    timeout: options.timeout || 30000,
  });
}
```

**File:** `servers/browser/screenshot.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions } from "../shared/types";

export interface ScreenshotOptions extends BaseToolOptions {
  path?: string;
  fullPage?: boolean;
  type?: "png" | "jpeg";
  quality?: number;
}

export interface ScreenshotResult {
  base64: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Capture a screenshot of the current page
 *
 * NOTE: Large screenshot data stays in execution environment.
 * Only metadata (dimensions, size) is returned to reduce context usage.
 *
 * @param options - Screenshot configuration
 * @returns Screenshot metadata (not full image data in context)
 * @example
 * const shot = await screenshot({ fullPage: true, type: 'png' });
 * console.log(`Captured ${shot.width}x${shot.height} screenshot`);
 */
export async function screenshot(options: ScreenshotOptions = {}): Promise<ScreenshotResult> {
  const result = await callMCPTool("puppeteer", "screenshot", {
    fullPage: options.fullPage || false,
    type: options.type || "png",
    quality: options.quality,
  });

  // Data filtering happens here - principle of code-API pattern
  // Full base64 image stays in execution environment
  // Only essential metadata goes to model context
  return {
    base64: result.data, // Available locally but not sent to context
    width: result.width,
    height: result.height,
    sizeBytes: result.data.length,
  };
}
```

**File:** `servers/browser/click.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions, Selector } from "../shared/types";

export interface ClickOptions extends BaseToolOptions {
  selector: Selector;
  waitForNavigation?: boolean;
  delay?: number;
}

/**
 * Click an element on the page
 *
 * @param options - Click configuration with CSS selector
 * @example
 * await click({
 *   selector: '#submit-button',
 *   waitForNavigation: true,
 *   timeout: 5000
 * });
 */
export async function click(options: ClickOptions): Promise<void> {
  return await callMCPTool("puppeteer", "click", {
    selector: options.selector,
    waitForNavigation: options.waitForNavigation || false,
    delay: options.delay || 0,
    timeout: options.timeout || 30000,
  });
}
```

**File:** `servers/browser/fillForm.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions, Selector } from "../shared/types";

export interface FillFormOptions extends BaseToolOptions {
  selector: Selector;
  value: string;
  delay?: number;
}

/**
 * Fill a form field with text
 *
 * @param options - Form filling configuration
 * @example
 * await fillForm({
 *   selector: '#username',
 *   value: 'testuser',
 *   delay: 100
 * });
 */
export async function fillForm(options: FillFormOptions): Promise<void> {
  return await callMCPTool("puppeteer", "type", {
    selector: options.selector,
    text: options.value,
    delay: options.delay || 0,
    timeout: options.timeout || 30000,
  });
}
```

**File:** `servers/browser/waitFor.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions, Selector } from "../shared/types";

export interface WaitForOptions extends BaseToolOptions {
  selector: Selector;
  visible?: boolean;
  hidden?: boolean;
}

/**
 * Wait for an element to appear on the page
 *
 * @param options - Wait configuration
 * @example
 * await waitFor({
 *   selector: '.loading-spinner',
 *   hidden: true,
 *   timeout: 10000
 * });
 */
export async function waitFor(options: WaitForOptions): Promise<void> {
  return await callMCPTool("puppeteer", "waitForSelector", {
    selector: options.selector,
    visible: options.visible,
    hidden: options.hidden,
    timeout: options.timeout || 30000,
  });
}
```

**File:** `servers/browser/index.ts`

```typescript
/**
 * Browser Automation API
 * Exports all browser-related MCP tool wrappers
 */

export { navigate, type NavigateOptions } from "./navigate";
export { screenshot, type ScreenshotOptions, type ScreenshotResult } from "./screenshot";
export { click, type ClickOptions } from "./click";
export { fillForm, type FillFormOptions } from "./fillForm";
export { waitFor, type WaitForOptions } from "./waitFor";
```

**File:** `servers/browser/README.md`

```markdown
# Browser Automation Server

Puppeteer-based browser automation wrappers using code-API pattern.

## Available Functions

| Function       | Purpose            | Example                                           |
| -------------- | ------------------ | ------------------------------------------------- |
| `navigate()`   | Navigate to URL    | `navigate({ url: 'http://example.com' })`         |
| `screenshot()` | Capture screenshot | `screenshot({ fullPage: true })`                  |
| `click()`      | Click element      | `click({ selector: '#button' })`                  |
| `fillForm()`   | Fill form field    | `fillForm({ selector: '#input', value: 'text' })` |
| `waitFor()`    | Wait for element   | `waitFor({ selector: '.loaded' })`                |

## Usage Pattern

\`\`\`typescript
import { navigate, screenshot, click, waitFor } from '../servers/browser';

async function testLoginFlow() {
await navigate({ url: 'http://localhost:3000/login' });
await waitFor({ selector: '#login-form' });
await click({ selector: '#submit' });
const result = await screenshot({ fullPage: true });

// Return only metadata, not full image
return { success: true, screenshotSize: \`\${result.width}x\${result.height}\` };
}
\`\`\`

## Key Principle

**Data stays local** - Large data (screenshots, page content) remains in execution environment. Only filtered results go to model context.
```

### 2.4 Code Intelligence Wrappers

**File:** `servers/code-intelligence/getDocumentation.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions } from "../shared/types";

export interface DocRequest extends BaseToolOptions {
  library: string;
  version?: string;
  topic?: string;
}

export interface DocResult {
  content: string;
  version: string;
  url: string;
  relevantOnly: boolean;
}

/**
 * Get up-to-date documentation for a library
 *
 * Context7 provides version-specific, current documentation.
 * IMPORTANT: Returns only relevant sections, not full docs.
 *
 * @param request - Documentation query
 * @example
 * const docs = await getDocumentation({
 *   library: 'jest',
 *   version: '29.0',
 *   topic: 'async testing'
 * });
 */
export async function getDocumentation(request: DocRequest): Promise<DocResult> {
  const result = await callMCPTool("context7", "get_docs", {
    library: request.library,
    version: request.version || "latest",
    topic: request.topic,
    timeout: request.timeout || 10000,
  });

  // Filter to relevant sections only
  // Avoid dumping entire documentation into context
  const filteredContent = filterRelevantSections(result.fullDocs, request.topic);

  return {
    content: filteredContent, // NOT result.fullDocs!
    version: result.version,
    url: result.sourceUrl,
    relevantOnly: true,
  };
}

/**
 * Filter documentation to only relevant sections
 * This is the token-saving principle in action
 */
function filterRelevantSections(fullDocs: string, topic?: string): string {
  if (!topic) {
    // Return first 500 chars if no specific topic
    return fullDocs.substring(0, 500) + "...";
  }

  // TODO: Implement smart filtering based on topic
  // For now, basic substring search
  const lines = fullDocs.split("\n");
  const relevantLines = lines.filter((line) => line.toLowerCase().includes(topic.toLowerCase()));

  return relevantLines.slice(0, 50).join("\n");
}
```

**File:** `servers/code-intelligence/getExamples.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions } from "../shared/types";

export interface ExampleRequest extends BaseToolOptions {
  library: string;
  query: string;
  limit?: number;
}

export interface ExampleResult {
  examples: string[];
  version: string;
  count: number;
}

/**
 * Get code examples for a library
 *
 * @param request - Example query
 * @example
 * const examples = await getExamples({
 *   library: '@testing-library/react',
 *   query: 'async component test',
 *   limit: 3
 * });
 */
export async function getExamples(request: ExampleRequest): Promise<ExampleResult> {
  const result = await callMCPTool("context7", "get_examples", {
    library: request.library,
    query: request.query,
    limit: request.limit || 5,
    timeout: request.timeout || 10000,
  });

  return {
    examples: result.examples.slice(0, request.limit || 5),
    version: result.version,
    count: result.examples.length,
  };
}
```

**File:** `servers/code-intelligence/validateAPI.ts`

```typescript
import { callMCPTool } from "../shared/callMCPTool";
import { BaseToolOptions } from "../shared/types";

export interface ValidateRequest extends BaseToolOptions {
  library: string;
  apiCall: string;
  version?: string;
}

export interface ValidateResult {
  valid: boolean;
  currentVersion: string;
  recommendation?: string;
  deprecated?: boolean;
}

/**
 * Validate an API call against current library version
 *
 * @param request - API validation request
 * @example
 * const check = await validateAPI({
 *   library: 'react',
 *   apiCall: 'componentWillMount',
 *   version: '18.0'
 * });
 * // Returns: { valid: false, deprecated: true, recommendation: 'Use useEffect instead' }
 */
export async function validateAPI(request: ValidateRequest): Promise<ValidateResult> {
  const result = await callMCPTool("context7", "validate_api", {
    library: request.library,
    api_call: request.apiCall,
    version: request.version || "latest",
    timeout: request.timeout || 10000,
  });

  return {
    valid: result.valid,
    currentVersion: result.version,
    recommendation: result.suggestion,
    deprecated: result.deprecated || false,
  };
}
```

**File:** `servers/code-intelligence/index.ts`

```typescript
/**
 * Code Intelligence API
 * Exports all Context7-based documentation and validation wrappers
 */

export { getDocumentation, type DocRequest, type DocResult } from "./getDocumentation";

export { getExamples, type ExampleRequest, type ExampleResult } from "./getExamples";

export { validateAPI, type ValidateRequest, type ValidateResult } from "./validateAPI";
```

**File:** `servers/code-intelligence/README.md`

```markdown
# Code Intelligence Server

Context7-based documentation and API validation wrappers.

## Available Functions

| Function             | Purpose            | Example                                                  |
| -------------------- | ------------------ | -------------------------------------------------------- |
| `getDocumentation()` | Fetch library docs | `getDocumentation({ library: 'jest', topic: 'async' })`  |
| `getExamples()`      | Get code examples  | `getExamples({ library: 'react', query: 'hooks' })`      |
| `validateAPI()`      | Check API validity | `validateAPI({ library: 'react', apiCall: 'useState' })` |

## Usage Pattern

\`\`\`typescript
import { getDocumentation, getExamples, validateAPI } from '../servers/code-intelligence';

async function generateTest(componentName: string) {
// Get current best practices
const docs = await getDocumentation({
library: 'jest',
version: 'latest',
topic: 'async testing'
});

// Get real examples
const examples = await getExamples({
library: '@testing-library/react',
query: 'async component',
limit: 3
});

// Validate our approach
const valid = await validateAPI({
library: 'jest',
apiCall: 'test.concurrent'
});

// Generate test using correct, current patterns
return generateFromDocs(docs, examples);
}
\`\`\`

## Key Principle

**Filter aggressively** - Full documentation can be 100KB+. Return only relevant sections (1-2KB) to save context tokens.
```

---

## Phase 3: Testing Agent Creation

### 3.1 Create Test Agent File

**File:** `.claude/agents/test-agent.md`

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

**Key Principle:** You write CODE that orchestrates MCP tools, not direct tool calls. Data processing happens locally; only filtered results go to context.

## Available MCP Servers

### Browser Automation Server

**Location:** `/home/adamsl/growing_collective/servers/browser/`

**Available functions:**

- `navigate.ts` - Navigate to URLs
- `screenshot.ts` - Capture screenshots
- `click.ts` - Click elements
- `fillForm.ts` - Fill form fields
- `waitFor.ts` - Wait for elements

**Discovery:** Read individual `.ts` files for detailed interfaces and examples.

### Code Intelligence Server

**Location:** `/home/adamsl/growing_collective/servers/code-intelligence/`

**Available functions:**

- `getDocumentation.ts` - Fetch library docs (filtered)
- `getExamples.ts` - Get code examples
- `validateAPI.ts` - Check API validity

**Discovery:** Read individual `.ts` files for usage patterns.

## How to Use MCP Tools (Code-API Pattern)

### ❌ WRONG: Direct Tool Calls

```bash
# Don't do this - wastes context tokens
npx puppeteer-mcp-server screenshot --full-page
```
````

### ✅ CORRECT: Code-API Pattern

```typescript
// Write code that uses wrapper functions
import { navigate, screenshot, click, waitFor } from "../servers/browser";

async function testLoginFlow() {
  await navigate({ url: "http://localhost:3000/login" });
  await waitFor({ selector: "#login-form", timeout: 5000 });

  // Take screenshot - data stays local
  const before = await screenshot({ fullPage: true });

  // Perform test interactions
  await click({ selector: "#submit-btn" });
  await waitFor({ selector: ".dashboard" });

  const after = await screenshot({ fullPage: true });

  // Return ONLY filtered results - not full screenshots
  return {
    success: true,
    beforeSize: `${before.width}x${before.height}`,
    afterSize: `${after.width}x${after.height}`,
    sizeBytes: before.sizeBytes + after.sizeBytes,
  };
}
```

## Progressive Tool Discovery

**Reduce upfront context load:**

1. **Explore:** Use Glob to find available server functions

   ```bash
   # Find all browser tools
   ls /home/adamsl/growing_collective/servers/browser/*.ts
   ```

2. **Read:** Read only the specific `.ts` file you need

   ```bash
   # Read just the screenshot tool
   cat /home/adamsl/growing_collective/servers/browser/screenshot.ts
   ```

3. **Use:** Import and call the function in your code

**Token savings:** ~5000 tokens (load all) → ~200 tokens (load one)

## Test Workflow Examples

### Example 1: Browser E2E Test

```typescript
import { navigate, waitFor, click, fillForm, screenshot } from "../servers/browser";

async function testUserRegistration() {
  // Navigate to registration page
  await navigate({
    url: "http://localhost:3000/register",
    waitUntil: "networkidle0",
  });

  // Wait for form to load
  await waitFor({ selector: "#registration-form" });

  // Fill form fields
  await fillForm({ selector: "#username", value: "testuser123" });
  await fillForm({ selector: "#email", value: "test@example.com" });
  await fillForm({ selector: "#password", value: "SecurePass123!" });

  // Submit form
  await click({ selector: "#submit-btn", waitForNavigation: true });

  // Verify success
  await waitFor({ selector: ".success-message", timeout: 5000 });

  // Capture proof
  const proof = await screenshot({ fullPage: false });

  // Return filtered result
  return {
    testName: "user-registration",
    status: "passed",
    screenshotCaptured: true,
    screenshotDimensions: `${proof.width}x${proof.height}`,
  };
}
```

### Example 2: Documentation-Driven Test Generation

```typescript
import { getDocumentation, getExamples } from "../servers/code-intelligence";

async function generateJestTest(componentName: string) {
  // Get current Jest best practices
  const jestDocs = await getDocumentation({
    library: "jest",
    version: "latest",
    topic: "async testing",
  });

  // Get React Testing Library examples
  const rtlExamples = await getExamples({
    library: "@testing-library/react",
    query: "async component rendering",
    limit: 3,
  });

  // Process examples locally (not in context)
  const testTemplate = buildTestFromExamples(rtlExamples.examples);

  const testCode = `
import { render, screen, waitFor } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  test('renders async data correctly', async () => {
    render(<${componentName} />);

    // Using pattern from docs version ${jestDocs.version}
    await waitFor(() => {
      expect(screen.getByText(/loaded/i)).toBeInTheDocument();
    });
  });
});
`;

  // Return only generated code - NOT full docs
  return {
    code: testCode,
    jestVersion: jestDocs.version,
    examplesUsed: rtlExamples.count,
  };
}

function buildTestFromExamples(examples: string[]): string {
  // Local processing - doesn't go to context
  // Extract patterns, combine approaches
  return examples.join("\n\n");
}
```

### Example 3: Visual Regression Test

```typescript
import { navigate, screenshot } from "../servers/browser";
import { compareImages } from "../shared/imageCompare";

async function visualRegressionTest(url: string, baselinePath: string) {
  // Navigate to page
  await navigate({ url, waitUntil: "networkidle0" });

  // Capture current state
  const current = await screenshot({ fullPage: true, type: "png" });

  // Compare with baseline (happens locally!)
  const diff = compareImages(current.base64, baselinePath);

  // Return only comparison metrics - NOT full images
  return {
    testType: "visual-regression",
    url,
    pixelDifference: diff.pixelCount,
    percentDifferent: diff.percentage,
    passed: diff.percentage < 0.5,
    currentDimensions: `${current.width}x${current.height}`,
  };
}
```

## When You Receive a Task

Follow this workflow:

1. **Classify test type:**
   - Browser E2E? → Use `servers/browser/`
   - Code generation? → Use `servers/code-intelligence/`
   - Both? → Combine them

2. **Discover needed tools:**
   - List available functions: `ls servers/browser/`
   - Read specific tool file: `cat servers/browser/navigate.ts`
   - Load only what you need (progressive disclosure)

3. **Write test code:**
   - Import functions from server wrappers
   - Implement test logic with loops, conditionals
   - Process data locally in execution environment

4. **Filter results:**
   - Return pass/fail status
   - Include error messages if failures
   - Provide key metrics only
   - **DO NOT** return full screenshots, docs, or large data

5. **Report to user:**
   - Concise summary of test results
   - Reference code location for details

## Best Practices

### Token Efficiency

- ✅ Load only the tools you need
- ✅ Filter large data before returning
- ✅ Return metadata instead of full data
- ❌ Don't load all tool definitions upfront
- ❌ Don't pass screenshots through context

### Code Quality

- Write typed TypeScript when possible
- Use async/await for all MCP operations
- Implement error handling and timeouts
- Add retries for flaky browser operations

### Security

- Validate all user input before use
- Don't execute untrusted code
- Implement appropriate timeouts
- Monitor resource usage

## Your Tone

Be:

- **Efficient**: Minimize token usage with code-API pattern
- **Clear**: Provide understandable test results
- **Thorough**: Test all critical paths
- **Professional**: Maintain high-quality test code

## Success Metrics

Track these for each test execution:

- **Tokens saved**: Compare old vs. new approach
- **Execution time**: Time to first token improvement
- **Test coverage**: Paths validated
- **Error detection**: Issues found

Report improvements to demonstrate code-API pattern benefits.

````

### 3.2 Create Test Agent README

**File:** `.claude/agents/README.md` (update or create)

```markdown
# Growing Collective Agents

## Available Agents

### coder-agent
**Purpose:** Write clean, tested code
**Location:** `.claude/agents/coder-agent.md`
**Trigger:** write, code, function, create, build

### helper-agent
**Purpose:** Answer questions and explain concepts
**Location:** `.claude/agents/helper-agent.md`
**Trigger:** what, why, how, explain, question

### test-agent
**Purpose:** Browser automation and testing with MCP tools
**Location:** `.claude/agents/test-agent.md`
**Trigger:** test, browser, e2e, screenshot, validate
**Special:** Uses code-API pattern for 98.7% token reduction

### general-purpose-agent
**Purpose:** Tasks requiring custom tools (time, calculator)
**Location:** `.claude/agents/general-purpose-agent.md`
**Trigger:** General tasks

### next_steps_planner
**Purpose:** Read documentation and create implementation plans
**Location:** `.claude/agents/next_steps_planner.md`
**Trigger:** plan, next steps, roadmap, implementation

## Agent Architecture

All agents follow the delegation pattern:
````

User → /van → DECISION.md → Task Tool → Specialized Agent

```

## Adding New Agents

1. Create `.claude/agents/your-agent.md`
2. Update `.claude-collective/DECISION.md` with routing
3. Update `.claude-collective/AGENTS.md` with catalog entry
4. Document here
5. Test with `/van trigger your agent`
```

---

## Phase 4: Next Steps Planner Agent

### 4.1 Create Next Steps Planner Agent

**File:** `.claude/agents/next_steps_planner.md`

````markdown
---
name: next_steps_planner
description: Reads documentation and creates detailed implementation plans with concrete next steps
tools: Read, Write, Edit, Bash, Grep, Glob
color: purple
---

# Next Steps Planner Agent

## Your Role

You are a planning specialist who reads documentation, analyzes implementation requirements, and creates actionable step-by-step plans.

**Core Competency:** Transform complex documentation into concrete, executable action plans with clear next steps.

## Your Responsibilities

### 1. Documentation Analysis

- Read all relevant documentation thoroughly
- Identify key concepts, requirements, and dependencies
- Extract actionable items from technical descriptions
- Understand the big picture and details

### 2. Plan Creation

- Break down complex implementations into phases
- Define clear, measurable milestones
- Identify dependencies between tasks
- Estimate effort and prioritize work

### 3. Next Steps Definition

- Create specific, actionable tasks
- Provide exact commands and file paths
- Include validation/testing steps
- Order tasks logically by dependency

### 4. Risk Identification

- Highlight potential blockers
- Note areas needing clarification
- Identify missing information
- Suggest mitigation strategies

## How to Process Documentation

### Step 1: Discovery

```bash
# Find all documentation
find /home/adamsl/growing_collective/docs -name "*.md" -type f

# Or use glob
ls /home/adamsl/growing_collective/docs/**/*.md
```
````

### Step 2: Read Systematically

```bash
# Read implementation docs
cat /home/adamsl/growing_collective/docs/implementation/MCP_INTEGRATION_ROADMAP.md

# Read guides
cat /home/adamsl/growing_collective/docs/guides/MCP_TESTING_INTEGRATION.md

# Read related files
cat /home/adamsl/growing_collective/.claude-collective/DECISION.md
```

### Step 3: Extract Requirements

- What needs to be built?
- What files need to be created?
- What configurations are required?
- What dependencies must be installed?

### Step 4: Create Dependency Graph

- What must be done first?
- What can be done in parallel?
- What depends on external factors?

## Output Format

Structure your plans like this:

```markdown
# Implementation Plan: [Topic]

## Overview

[Brief summary of what will be implemented and why]

## Prerequisites

- [ ] Requirement 1
- [ ] Requirement 2

## Phase 1: [Phase Name]

**Goal:** [What this phase accomplishes]
**Estimated Effort:** [Time estimate]

### Tasks

1. **[Task Name]**
   - Action: [Exact steps to take]
   - Files: [Specific file paths]
   - Commands: [Exact commands to run]
   - Validation: [How to verify success]

2. **[Next Task]**
   - ...

### Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Phase 2: [Phase Name]

...

## Next Steps (Immediate)

1. [First concrete action with exact command]
2. [Second action with file path]
3. [Third action with validation]

## Risks & Blockers

- **Risk 1:** [Description] → [Mitigation]
- **Blocker 1:** [Description] → [Resolution path]

## Questions for Clarification

1. [Question about unclear requirement]
2. [Question about technical decision]
```

## Example: MCP Integration Planning

When asked to plan MCP integration:

### Step 1: Read Documentation

```bash
# Read the roadmap
cat /home/adamsl/growing_collective/docs/implementation/MCP_INTEGRATION_ROADMAP.md

# Read the integration guide
cat /home/adamsl/growing_collective/docs/guides/MCP_TESTING_INTEGRATION.md

# Check current structure
ls -la /home/adamsl/growing_collective/servers 2>/dev/null || echo "servers/ doesn't exist yet"
```

### Step 2: Analyze Requirements

From the docs:

- Need to install Puppeteer and Context7 MCP servers
- Need to create server wrapper directory structure
- Need to create test-agent
- Need to update routing in DECISION.md and AGENTS.md

### Step 3: Build Dependency Graph

```
Install MCP servers (npm)
  ↓
Create .claude/mcp.json configuration
  ↓
Create servers/ directory structure
  ↓
Write server wrapper files
  ↓
Create test-agent.md
  ↓
Update DECISION.md routing
  ↓
Update AGENTS.md catalog
  ↓
Test with /van command
```

### Step 4: Generate Plan

````markdown
# MCP Integration Implementation Plan

## Overview

Integrate Puppeteer (browser automation) and Context7 (code intelligence) MCP servers using code-API pattern for 98.7% token reduction.

## Prerequisites

- [x] Documentation read and analyzed
- [ ] Node.js 18+ installed
- [ ] npm available
- [ ] Chrome/Chromium browser installed

## Phase 1: MCP Server Installation

**Goal:** Install and configure MCP servers
**Estimated Effort:** 15 minutes

### Tasks

1. **Install Puppeteer MCP Server**
   - Action: Install via npm globally
   - Command: `npm install -g puppeteer-mcp-server`
   - Validation: `npx puppeteer-mcp-server --version`

2. **Install Context7 MCP Server**
   - Action: Install via npm globally
   - Command: `npm install -g @upstash/context7-mcp`
   - Validation: `npx @upstash/context7-mcp --version`

3. **Install Chrome/Chromium**
   - Action: Install browser for Puppeteer
   - Command: `sudo apt-get install chromium-browser`
   - Validation: `which chromium-browser`

4. **Create MCP Configuration**
   - Action: Create MCP config file
   - File: `/home/adamsl/growing_collective/.claude/mcp.json`
   - Content: [See roadmap section 1.2]
   - Validation: Check file exists and valid JSON

### Success Criteria

- [ ] Both MCP servers installed
- [ ] Chrome/Chromium available
- [ ] mcp.json created and valid

## Phase 2: Server Wrapper Infrastructure

**Goal:** Create code-API wrapper structure
**Estimated Effort:** 30 minutes

### Tasks

1. **Create Directory Structure**
   - Action: Make server directories
   - Commands:
     ```bash
     cd /home/adamsl/growing_collective
     mkdir -p servers/browser servers/code-intelligence servers/shared
     ```
   - Validation: `ls -la servers/`

2. **Create Shared Infrastructure**
   - Files to create:
     - `servers/shared/callMCPTool.ts`
     - `servers/shared/types.ts`
     - `servers/shared/README.md`
   - Content: [See roadmap section 2.2]
   - Validation: All 3 files exist

3. **Create Browser Wrappers**
   - Files to create:
     - `servers/browser/navigate.ts`
     - `servers/browser/screenshot.ts`
     - `servers/browser/click.ts`
     - `servers/browser/fillForm.ts`
     - `servers/browser/waitFor.ts`
     - `servers/browser/index.ts`
     - `servers/browser/README.md`
   - Content: [See roadmap section 2.3]
   - Validation: All 7 files exist

4. **Create Code Intelligence Wrappers**
   - Files to create:
     - `servers/code-intelligence/getDocumentation.ts`
     - `servers/code-intelligence/getExamples.ts`
     - `servers/code-intelligence/validateAPI.ts`
     - `servers/code-intelligence/index.ts`
     - `servers/code-intelligence/README.md`
   - Content: [See roadmap section 2.4]
   - Validation: All 5 files exist

### Success Criteria

- [ ] Directory structure created
- [ ] All wrapper files created
- [ ] TypeScript interfaces defined
- [ ] README files document usage

## Phase 3: Test Agent Creation

**Goal:** Create specialized testing agent
**Estimated Effort:** 20 minutes

### Tasks

1. **Create Test Agent File**
   - Action: Create agent markdown file
   - File: `/home/adamsl/growing_collective/.claude/agents/test-agent.md`
   - Content: [See roadmap section 3.1]
   - Validation: File exists and follows agent format

2. **Update Agent README**
   - Action: Document test-agent in catalog
   - File: `/home/adamsl/growing_collective/.claude/agents/README.md`
   - Add: test-agent entry
   - Validation: test-agent listed in README

### Success Criteria

- [ ] test-agent.md created
- [ ] Agent follows markdown frontmatter format
- [ ] Documented in agents README

## Phase 4: Routing Integration

**Goal:** Connect test-agent to /van router
**Estimated Effort:** 15 minutes

### Tasks

1. **Update DECISION.md**
   - Action: Add routing logic for testing keywords
   - File: `/home/adamsl/growing_collective/.claude-collective/DECISION.md`
   - Add: Testing keywords route (test, browser, e2e, screenshot, validate)
   - Validation: Pattern matching includes test-agent

2. **Update AGENTS.md**
   - Action: Add test-agent to catalog
   - File: `/home/adamsl/growing_collective/.claude-collective/AGENTS.md`
   - Add: test-agent entry with triggers and specialization
   - Validation: test-agent documented in catalog

### Success Criteria

- [ ] DECISION.md routes testing requests
- [ ] AGENTS.md catalogs test-agent
- [ ] Routing pattern matches test keywords

## Phase 5: Verification

**Goal:** Test end-to-end functionality
**Estimated Effort:** 10 minutes

### Tasks

1. **Test MCP Servers**
   - Action: Verify servers run
   - Commands:
     ```bash
     npx puppeteer-mcp-server &
     npx @upstash/context7-mcp &
     ```
   - Validation: Both start without errors

2. **Test Routing**
   - Action: Try /van with test trigger
   - Command: `/van test the login flow`
   - Expected: Routes to test-agent
   - Validation: Agent loads and responds

3. **Test Tool Discovery**
   - Action: Check progressive disclosure works
   - Commands:
     ```bash
     ls /home/adamsl/growing_collective/servers/browser/*.ts
     cat /home/adamsl/growing_collective/servers/browser/screenshot.ts
     ```
   - Validation: Files readable, interfaces clear

### Success Criteria

- [ ] MCP servers start successfully
- [ ] /van routes to test-agent
- [ ] Agent can discover and read tools
- [ ] Code-API pattern demonstrated

## Next Steps (Immediate)

1. **Install MCP Servers**
   ```bash
   npm install -g puppeteer-mcp-server @upstash/context7-mcp
   ```
````

2. **Verify Installation**

   ```bash
   npx puppeteer-mcp-server --version
   npx @upstash/context7-mcp --version
   ```

3. **Create Base Directory**

   ```bash
   cd /home/adamsl/growing_collective
   mkdir -p servers/{browser,code-intelligence,shared}
   ```

4. **Create First Config File**
   - Create `.claude/mcp.json` with server configuration
   - Use content from roadmap section 1.2

5. **Validate Progress**
   ```bash
   ls -la /home/adamsl/growing_collective/servers
   cat /home/adamsl/growing_collective/.claude/mcp.json
   ```

## Risks & Blockers

### Risks

- **Chrome/Chromium not available:** WSL2 may need X11 for headed mode
  - Mitigation: Use headless mode (configured by default)

- **MCP server compatibility:** Versions may have breaking changes
  - Mitigation: Pin specific versions in mcp.json

- **TypeScript execution:** Wrappers are .ts files, may need compilation
  - Mitigation: Start with .js or add ts-node execution

### Blockers

- **Node.js version < 18:** Upgrade required
  - Resolution: `nvm install 18 && nvm use 18`

- **npm permissions:** Global install may fail
  - Resolution: Use `npx` instead (no install needed)

## Questions for Clarification

1. Should TypeScript wrappers be pre-compiled to JavaScript?
2. Do we want to add automated tests for the server wrappers?
3. Should we create example test files to demonstrate usage?
4. Do we need CI/CD integration for MCP server health checks?

---

## Summary

This plan implements MCP integration in 5 phases:

1. Install MCP servers (15 min)
2. Create server wrappers (30 min)
3. Create test agent (20 min)
4. Update routing (15 min)
5. Verify functionality (10 min)

**Total Estimated Time:** 90 minutes

**Key Benefit:** 98.7% token reduction through code-API pattern

**Next Immediate Action:** Run `npm install -g puppeteer-mcp-server @upstash/context7-mcp`

```

## Your Workflow

For every planning request:

1. **Ask clarifying questions** if the scope is unclear
2. **Read all relevant documentation** systematically
3. **Extract requirements** and dependencies
4. **Create dependency graph** to order tasks
5. **Write detailed plan** with exact steps
6. **Identify risks** and propose mitigations
7. **Define success criteria** for each phase
8. **List immediate next steps** with commands

## Best Practices

### Be Specific
- ❌ "Create configuration file"
- ✅ "Create `/home/adamsl/growing_collective/.claude/mcp.json` with Puppeteer and Context7 server config"

### Provide Commands
- ❌ "Install dependencies"
- ✅ "Run: `npm install -g puppeteer-mcp-server @upstash/context7-mcp`"

### Include Validation
- Every task should have "Validation: [how to verify success]"
- Provide exact commands to check completion

### Order Logically
- Respect dependencies (install before configure)
- Group related tasks into phases
- Parallelize where possible

### Estimate Realistically
- Consider file creation time
- Account for reading/understanding docs
- Add buffer for troubleshooting

## Your Tone

Be:
- **Thorough**: Cover all aspects of implementation
- **Precise**: Use exact paths, commands, file names
- **Practical**: Focus on actionable steps
- **Clear**: Structure plans for easy following
- **Proactive**: Anticipate issues and provide solutions

## Success Metrics

Evaluate your plans on:
- **Completeness**: All requirements covered
- **Actionability**: Steps can be executed immediately
- **Clarity**: Non-experts can follow the plan
- **Correctness**: Commands and paths are accurate
- **Risk Management**: Blockers identified with solutions
```

---

## Phase 5: Router & Catalog Updates

### 5.1 Update DECISION.md

**File:** `.claude-collective/DECISION.md`

Add these routing rules:

```markdown
**Testing Keywords** → test-agent

- Keywords: `test`, `browser`, `e2e`, `screenshot`, `validate`, `check`, `selenium`, `puppeteer`
- Action: Use Task tool with test-agent
- Example: "Test the login flow" → test-agent

**Planning Keywords** → next_steps_planner

- Keywords: `plan`, `roadmap`, `next steps`, `implementation`, `how to implement`, `steps to`
- Action: Use Task tool with next_steps_planner
- Example: "Plan the MCP integration" → next_steps_planner

**For testing requests:**
```

Use Task tool with:

- subagent_type: "general-purpose"
- description: "Testing task"
- prompt: "You are the test-agent specialist. Read /home/adamsl/growing_collective/.claude/agents/test-agent.md and follow its instructions exactly to: [user's request]"

```

**For planning requests:**
```

Use Task tool with:

- subagent_type: "general-purpose"
- description: "Planning task"
- prompt: "You are the next_steps_planner specialist. Read /home/adamsl/growing_collective/.claude/agents/next_steps_planner.md and follow its instructions exactly to: [user's request]"

```

```

### 5.2 Update AGENTS.md

**File:** `.claude-collective/AGENTS.md`

Add these agent entries:

```markdown
### test-agent

- **Trigger words**: test, browser, e2e, screenshot, validate, selenium
- **Purpose**: Browser automation and testing with MCP tools
- **Location**: .claude/agents/test-agent.md
- **Specialization**: E2E testing, visual validation, code intelligence
- **MCP Servers**: Puppeteer (browser), Context7 (docs)

When you need testing, this agent will:

- Write browser automation code using Puppeteer API
- Capture screenshots and validate UI
- Use Context7 for correct testing framework usage
- Process test data locally (code-API pattern for 98.7% token reduction)
- Return only filtered results

### next_steps_planner

- **Trigger words**: plan, roadmap, next steps, implementation, how to
- **Purpose**: Read documentation and create detailed implementation plans
- **Location**: .claude/agents/next_steps_planner.md
- **Specialization**: Documentation analysis, task breakdown, dependency mapping

When you need planning, this agent will:

- Read all relevant documentation thoroughly
- Extract actionable requirements
- Create phase-based implementation plans
- Provide exact commands and file paths
- Identify risks and blockers
- Define clear next steps
```

---

## Phase 6: Documentation Index

### 6.1 Update Main Documentation Index

**File:** `docs/INDEX.md`

Add MCP integration documentation:

```markdown
# Growing Collective Documentation Index

## Implementation Guides

### MCP Integration

- **[MCP Integration Roadmap](./implementation/MCP_INTEGRATION_ROADMAP.md)** - Complete plan for adding Puppeteer and Context7 MCP servers
- **[MCP Testing Integration](./guides/MCP_TESTING_INTEGRATION.md)** - Original integration guide (now superseded by roadmap)

**Key Concepts:**

- Code-API pattern for 98.7% token reduction
- Progressive tool discovery
- Browser automation with Puppeteer
- Code intelligence with Context7

**Related Agents:**

- test-agent - Uses MCP servers for testing
- next_steps_planner - Creates implementation plans from documentation

## Quick Reference

| Task                        | Agent              | Documentation              |
| --------------------------- | ------------------ | -------------------------- |
| Implement MCP integration   | next_steps_planner | MCP_INTEGRATION_ROADMAP.md |
| Write browser tests         | test-agent         | test-agent.md              |
| Understand code-API pattern | next_steps_planner | MCP_INTEGRATION_ROADMAP.md |
```

---

## Implementation Status

**Current Phase:** Documentation Complete

### Completed

- ✅ MCP Integration Roadmap created
- ✅ test-agent specification written
- ✅ next_steps_planner agent created
- ✅ Server wrapper templates defined
- ✅ Configuration examples provided

### Next Steps

1. Run: `npm install -g puppeteer-mcp-server @upstash/context7-mcp`
2. Create: `.claude/mcp.json`
3. Create: `servers/` directory structure
4. Create: All wrapper files
5. Create: `.claude/agents/test-agent.md`
6. Create: `.claude/agents/next_steps_planner.md`
7. Update: `.claude-collective/DECISION.md`
8. Update: `.claude-collective/AGENTS.md`
9. Test: `/van plan the next implementation phase`
10. Test: `/van test example.com screenshot`

---

## References

- [Anthropic MCP Code Execution Article](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Puppeteer MCP Server](https://github.com/merajmehrabi/puppeteer-mcp-server)
- [Context7 MCP Server](https://github.com/upstash/context7)
- [Model Context Protocol](https://modelcontextprotocol.io)
- Growing Collective CLAUDE.md
- Growing Collective DECISION.md
- Growing Collective AGENTS.md
