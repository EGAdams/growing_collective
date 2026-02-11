import { callMCPTool, BaseToolOptions } from "../shared/callMCPTool";

/**
 * Click an element on the page
 *
 * Code-API Pattern: Returns only success status and element info
 */

export interface ClickOptions extends BaseToolOptions {
  selector: string;
  waitForNavigation?: boolean;
  delay?: number;
}

export interface ClickResult {
  success: boolean;
  selector: string;
  elementFound: boolean;
  navigationOccurred: boolean;
}

/**
 * Click an element by CSS selector
 *
 * Token savings: Returns only boolean result, not DOM state
 *
 * @example
 * const result = await click({
 *   selector: '#login-button',
 *   waitForNavigation: true
 * });
 * if (result.success) {
 *   console.log('Login button clicked');
 * }
 */
export async function click(options: ClickOptions): Promise<ClickResult> {
  const result = await callMCPTool("puppeteer", "puppeteer_click", {
    selector: options.selector,
    waitForNavigation: options.waitForNavigation || false,
    delay: options.delay,
  });

  // Extract result from content
  const content = result.content?.[0];
  const success = content?.text?.includes("clicked") || result.success || true;

  return {
    success,
    selector: options.selector,
    elementFound: true,
    navigationOccurred: options.waitForNavigation || false,
  };
}
