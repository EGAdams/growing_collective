/**
 * Simple MCP Bridge Connection Test
 * Tests the basic connectivity to Puppeteer MCP server
 */

import { navigate } from '../servers/browser/navigate';
import { takeScreenshot } from '../servers/browser/screenshot';

async function testMCPBridge() {
  console.log('=== MCP Bridge Connection Test ===\n');

  try {
    // Test 1: Navigate
    console.log('Test 1: Navigate to example.com...');
    await navigate({
      url: 'https://example.com',
      waitUntil: 'networkidle0'
    });
    console.log('✓ Navigation successful!\n');

    // Test 2: Screenshot
    console.log('Test 2: Take screenshot...');
    const screenshot = await takeScreenshot({
      path: './screenshots/test-bridge.png',
      fullPage: true
    });
    console.log('✓ Screenshot successful!');
    console.log(`  Saved: ${screenshot.saved}`);
    console.log(`  Path: ${screenshot.path}`);
    console.log(`  Size: ${screenshot.sizeKB}KB\n`);

    console.log('=== All Tests Passed ===');
    console.log('MCP Bridge is working correctly!');

    return { success: true };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Run the test
testMCPBridge()
  .then(result => {
    console.log('\n=== Final Result ===');
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
