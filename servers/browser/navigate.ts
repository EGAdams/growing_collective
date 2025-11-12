import { callMCPTool, BaseToolOptions } from '../shared/callMCPTool';

/**
 * Navigate browser to a URL
 *
 * Code-API Pattern: Returns only essential metadata, not full page content
 */

export interface NavigateOptions extends BaseToolOptions {
  url: string;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

export interface NavigateResult {
  url: string;
  title: string;
  status: number;
  loadTime: number;
}

/**
 * Navigate to a URL and wait for page load
 *
 * Token savings: Returns only metadata (URL, title, status)
 * instead of full HTML content (typically 50K-150K tokens)
 *
 * @example
 * const result = await navigate({
 *   url: 'https://example.com',
 *   waitUntil: 'networkidle0'
 * });
 * console.log(`Loaded: ${result.title} in ${result.loadTime}ms`);
 */
export async function navigate(
  options: NavigateOptions
): Promise<NavigateResult> {
  const startTime = Date.now();

  const result = await callMCPTool('puppeteer', 'puppeteer_navigate', {
    url: options.url,
    waitUntil: options.waitUntil || 'load'
  });

  // Extract result from content
  const content = result.content?.[0];
  const text = content?.text || '';

  return {
    url: options.url,
    title: text || 'Unknown',
    status: result.status || 200,
    loadTime: Date.now() - startTime
  };
}
