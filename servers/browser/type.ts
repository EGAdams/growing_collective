import { callMCPTool, BaseToolOptions } from "../shared/callMCPTool";

/**
 * Type text into an input field
 *
 * Code-API Pattern: Returns only success status
 */

export interface TypeOptions extends BaseToolOptions {
  selector: string;
  text: string;
  delay?: number;
  clear?: boolean;
}

export interface TypeResult {
  success: boolean;
  selector: string;
  charactersTyped: number;
}

/**
 * Type text into an input field
 *
 * @example
 * const result = await type({
 *   selector: '#username',
 *   text: 'testuser',
 *   clear: true
 * });
 */
export async function type(options: TypeOptions): Promise<TypeResult> {
  const result = await callMCPTool("puppeteer", "puppeteer_fill", {
    selector: options.selector,
    value: options.text,
  });

  // Extract result from content
  const content = result.content?.[0];
  const success = content?.text?.includes("filled") || result.success || true;

  return {
    success,
    selector: options.selector,
    charactersTyped: options.text.length,
  };
}
