#!/usr/bin/env node

import { SemanticRouter, RoutingResult } from './router.js';

/**
 * CLI tool for testing the semantic router
 *
 * Usage:
 *   npm run route "what next"
 *   npm run route "write a function"
 *   npm run route-batch
 */

const TEST_CASES = [
  // Planning requests
  "what next",
  "hey, go the agenda, man?",
  "what's the scoop our next adventure?",
  "what are we working on next?",
  "what's on the roadmap?",

  // Coding requests
  "write a function to calculate fibonacci",
  "create a React component",
  "build me a calculator",

  // Testing requests
  "test the login flow",
  "take a screenshot of the homepage",
  "validate the form submission",

  // Question requests
  "what is async await?",
  "explain closures to me",
  "why use TypeScript?",

  // General purpose
  "what time is it?",
  "calculate 5 + 3",
];

async function routeSingle(request: string) {
  console.log('\n🔍 Semantic Router - Single Request\n');
  console.log(`Request: "${request}"\n`);

  try {
    const router = new SemanticRouter();
    const result = await router.route(request);

    console.log('✅ Routing Result:');
    console.log(`   Agent: ${result.agent}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    if (result.reasoning) {
      console.log(`   Reasoning: ${result.reasoning}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function routeBatch() {
  console.log('\n🔍 Semantic Router - Batch Testing\n');
  console.log(`Testing ${TEST_CASES.length} requests...\n`);

  try {
    const router = new SemanticRouter();
    const results = await router.batchRoute(TEST_CASES);

    // Display results in a table
    console.log('Results:\n');
    console.log('─'.repeat(80));
    console.log(
      'Request'.padEnd(40) +
      'Agent'.padEnd(25) +
      'Confidence'
    );
    console.log('─'.repeat(80));

    results.forEach((result, i) => {
      const request = TEST_CASES[i];
      const truncated = request.length > 37
        ? request.substring(0, 37) + '...'
        : request;

      console.log(
        truncated.padEnd(40) +
        result.agent.padEnd(25) +
        `${(result.confidence * 100).toFixed(1)}%`
      );
    });

    console.log('─'.repeat(80));

    // Calculate accuracy metrics
    const highConfidence = results.filter(r => r.confidence >= 0.9).length;
    const mediumConfidence = results.filter(r => r.confidence >= 0.7 && r.confidence < 0.9).length;
    const lowConfidence = results.filter(r => r.confidence < 0.7).length;

    console.log('\n📊 Confidence Distribution:');
    console.log(`   High (≥90%): ${highConfidence} (${(highConfidence/results.length*100).toFixed(1)}%)`);
    console.log(`   Medium (70-89%): ${mediumConfidence} (${(mediumConfidence/results.length*100).toFixed(1)}%)`);
    console.log(`   Low (<70%): ${lowConfidence} (${(lowConfidence/results.length*100).toFixed(1)}%)`);

    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    console.log(`\n   Average Confidence: ${(avgConfidence * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Main CLI logic
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage:');
  console.log('  npm run route "your request here"    - Route a single request');
  console.log('  npm run route-batch                  - Test all cases');
  process.exit(1);
}

const command = args[0];

if (command === '--batch' || command === '-b') {
  routeBatch();
} else {
  routeSingle(args.join(' '));
}
