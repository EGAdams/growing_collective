/**
 * Browser Automation Wrappers (Puppeteer MCP)
 *
 * Code-API Pattern: Orchestrate browser actions via code,
 * return only essential metadata to save tokens
 */

export { navigate, NavigateOptions, NavigateResult } from "./navigate";
export { takeScreenshot, ScreenshotOptions, ScreenshotResult } from "./screenshot";
export { click, ClickOptions, ClickResult } from "./click";
export { type, TypeOptions, TypeResult } from "./type";
