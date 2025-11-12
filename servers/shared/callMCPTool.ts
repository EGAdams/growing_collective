/**
 * Bridge function to call MCP tools from code execution context
 *
 * This is the core of the code-API pattern. Instead of passing large
 * data through context, we orchestrate MCP tools via code and return
 * only filtered results.
 *
 * Token savings: 98.7% reduction (150K → 2K tokens) by keeping
 * screenshots, docs, and raw data in execution environment.
 */

export interface MCPToolOptions {
  server: string;
  tool: string;
  args: Record<string, any>;
}

export interface MCPToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Calls an MCP tool and returns the result
 *
 * @param server - MCP server name (e.g., 'puppeteer', 'context7')
 * @param tool - Tool name on that server (e.g., 'screenshot', 'navigate')
 * @param args - Tool-specific arguments
 * @returns Promise with tool execution result
 *
 * @example
 * const result = await callMCPTool('puppeteer', 'screenshot', {
 *   fullPage: true,
 *   type: 'png'
 * });
 */
export async function callMCPTool(
  server: string,
  tool: string,
  args: Record<string, any> = {}
): Promise<any> {
  console.log(`[MCP Bridge] Calling ${server}.${tool} with args:`, args);

  try {
    // Import MCP SDK dynamically
    const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
    const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');

    // Read MCP configuration
    const config = await readMCPConfig();
    const serverConfig = config.mcpServers[server];

    if (!serverConfig) {
      throw new Error(`MCP server '${server}' not found in configuration. Available servers: ${Object.keys(config.mcpServers).join(', ')}`);
    }

    // Create transport based on server configuration
    const transport = new StdioClientTransport({
      command: serverConfig.command,
      args: serverConfig.args,
      env: { ...process.env, ...serverConfig.env }
    });

    // Create and connect client
    const client = new Client({
      name: 'growing-collective-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await client.connect(transport);

    try {
      // List available tools to verify connection
      const toolsResponse: any = await client.listTools();

      console.log(`[MCP Bridge] Connected to ${server}, available tools:`, toolsResponse.tools?.map((t: any) => t.name).join(', ') || 'none');

      // Call the specific tool
      const result: any = await client.callTool({
        name: tool,
        arguments: args
      });

      console.log(`[MCP Bridge] Tool ${server}.${tool} executed successfully`);

      // Close the connection
      await client.close();

      return result;
    } catch (error) {
      await client.close();
      throw error;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[MCP Bridge] Error calling ${server}.${tool}:`, errorMessage);
    throw new Error(
      `MCP Bridge connection failed: ${errorMessage}\n` +
      `Server: ${server}, Tool: ${tool}\n` +
      `Check that MCP servers are properly configured in .claude/mcp.json`
    );
  }
}

/**
 * Read MCP configuration from .claude/mcp.json
 */
async function readMCPConfig(): Promise<any> {
  const fs = await import('fs/promises');
  const path = await import('path');

  // Try to find the config file
  const possiblePaths = [
    path.join(process.cwd(), '.claude/mcp.json'),
    path.join(process.cwd(), '../.claude/mcp.json'),
    '/home/adamsl/growing_collective/.claude/mcp.json'
  ];

  for (const configPath of possiblePaths) {
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // Try next path
      continue;
    }
  }

  throw new Error(
    'MCP configuration not found. Please create .claude/mcp.json with server configurations.\n' +
    `Searched paths: ${possiblePaths.join(', ')}`
  );
}

/**
 * Base options for all MCP tool wrappers
 */
export interface BaseToolOptions {
  timeout?: number;
  verbose?: boolean;
}
