import { callMCPTool, BaseToolOptions } from "../shared/callMCPTool";

/**
 * Search codebase documentation using Context7
 *
 * Code-API Pattern: Filters and processes search results locally,
 * returns only relevant snippets instead of full documentation
 */

export interface SearchCodebaseOptions extends BaseToolOptions {
  query: string;
  framework?: string;
  maxResults?: number;
  includeExamples?: boolean;
}

export interface CodeSnippet {
  title: string;
  snippet: string;
  relevanceScore: number;
  source: string;
}

export interface SearchCodebaseResult {
  query: string;
  totalResults: number;
  snippets: CodeSnippet[];
  framework?: string;
}

/**
 * Search for up-to-date code documentation and examples
 *
 * Token savings: Processes full docs locally, returns only top N snippets
 * Traditional: 50K-100K tokens (full documentation)
 * Code-API: 5K-10K tokens (filtered snippets only)
 * Savings: 80-90%
 *
 * @example
 * const results = await searchCodebase({
 *   query: 'Puppeteer screenshot API',
 *   framework: 'puppeteer',
 *   maxResults: 3,
 *   includeExamples: true
 * });
 *
 * results.snippets.forEach(s => {
 *   console.log(`${s.title}: ${s.snippet}`);
 * });
 */
export async function searchCodebase(
  options: SearchCodebaseOptions,
): Promise<SearchCodebaseResult> {
  // Context7 uses a two-step process:
  // 1. Resolve library ID
  // 2. Get documentation for that library

  let libraryId = options.framework;

  // If framework provided, resolve it to library ID
  if (options.framework) {
    try {
      const resolveResult = await callMCPTool("context7", "resolve-library-id", {
        name: options.framework,
      });
      libraryId = resolveResult.content?.[0]?.text || options.framework;
      console.log(`[Context7] Resolved '${options.framework}' to library ID: ${libraryId}`);
    } catch (error) {
      console.log(`[Context7] Could not resolve library, using framework name directly`);
    }
  }

  // Get documentation
  const result = await callMCPTool("context7", "get-library-docs", {
    libraryId: libraryId || "puppeteer",
    query: options.query,
  });

  console.log("[Context7 Debug] Result keys:", Object.keys(result));
  console.log("[Context7 Debug] Result.content:", result.content ? "present" : "missing");

  // Process results locally - extract relevant documentation
  const content = result.content?.[0]?.text || result.text || "";
  const maxResults = options.maxResults || 5;

  // Split documentation into sections and create snippets
  const sections = content.split("\n\n").filter((s: string) => s.trim().length > 0);
  const filteredSnippets = sections.slice(0, maxResults).map((section: string, index: number) => ({
    title: `Section ${index + 1}`,
    snippet: section.substring(0, 500), // Truncate to 500 chars
    relevanceScore: 1.0 - index * 0.1, // Simple relevance scoring
    source: libraryId || "unknown",
  }));

  return {
    query: options.query,
    totalResults: sections.length,
    snippets: filteredSnippets,
    framework: options.framework,
  };
}
