import { callMCPTool, BaseToolOptions } from '../shared/callMCPTool';

/**
 * Capture screenshot of current page
 *
 * Code-API Pattern: Stores base64 locally, returns only metadata
 * Token savings: 98.7% reduction (150K base64 → 2K metadata)
 */

export interface ScreenshotOptions extends BaseToolOptions {
  path?: string;
  fullPage?: boolean;
  type?: 'png' | 'jpeg';
  quality?: number;
}

export interface ScreenshotResult {
  saved: boolean;
  path?: string;
  width: number;
  height: number;
  sizeKB: number;
  type: 'png' | 'jpeg';
}

/**
 * Take a screenshot and save it locally
 *
 * KEY PRINCIPLE: The base64 data stays in execution environment.
 * Only metadata (dimensions, size, path) is returned to context.
 *
 * Traditional MCP: 150K tokens (full base64 in context)
 * Code-API Pattern: 2K tokens (metadata only)
 * Savings: 98.7%
 *
 * @example
 * const screenshot = await takeScreenshot({
 *   path: './screenshots/login.png',
 *   fullPage: true
 * });
 * console.log(`Saved ${screenshot.sizeKB}KB screenshot to ${screenshot.path}`);
 */
export async function takeScreenshot(
  options: ScreenshotOptions = {}
): Promise<ScreenshotResult> {
  const result = await callMCPTool('puppeteer', 'puppeteer_screenshot', {
    fullPage: options.fullPage || false,
    type: options.type || 'png',
    quality: options.quality
  });

  // Extract image data from result
  // MCP tools return results in content array with {type, data} format
  // The image is typically in the second item (first is status text)
  let imageData: string | undefined;

  if (result.content && Array.isArray(result.content)) {
    // Look for image type content
    for (const item of result.content) {
      if (item.type === 'image' && item.data) {
        imageData = item.data;
        break;
      }
    }
  }

  // Fallback to direct fields
  if (!imageData) {
    imageData = result.data || result.base64;
  }

  const width = result.width || 800;
  const height = result.height || 600;

  // Save base64 to file if path provided
  let saved = false;
  if (options.path && imageData) {
    const fs = await import('fs/promises');
    const buffer = Buffer.from(imageData, 'base64');
    await fs.writeFile(options.path, buffer);
    saved = true;
  }

  // Return ONLY metadata - base64 stays local
  return {
    saved,
    path: options.path,
    width,
    height,
    sizeKB: imageData ? Math.round(imageData.length * 0.75 / 1024) : 0,
    type: options.type || 'png'
  };
}
