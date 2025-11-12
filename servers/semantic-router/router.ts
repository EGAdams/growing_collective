import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Available agents in the system
 */
export type AgentType =
  | 'next_steps_planner'
  | 'coder-agent'
  | 'helper-agent'
  | 'test-agent'
  | 'general-purpose-agent';

/**
 * Routing result with confidence score
 */
export interface RoutingResult {
  agent: AgentType;
  confidence: number;
  reasoning?: string;
}

/**
 * Semantic Router using Gemini 2.5 Flash-Lite
 *
 * Cost: ~$0.00005 per request (effectively free with 1,500 req/day free tier)
 * Model: gemini-2.5-flash-lite (smallest, most cost-effective)
 */
export class SemanticRouter {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;

    if (!key) {
      throw new Error(
        'Gemini API key not found. Please set GEMINI_API_KEY environment variable or pass it to constructor.'
      );
    }

    this.genAI = new GoogleGenerativeAI(key);
    // Use the cheapest model: gemini-2.5-flash-lite
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  /**
   * Route a user request to the appropriate agent
   */
  async route(userRequest: string): Promise<RoutingResult> {
    const prompt = this.buildPrompt(userRequest);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  /**
   * Build the routing prompt for Gemini
   */
  private buildPrompt(userRequest: string): string {
    return `You are a semantic router for a multi-agent system. Your job is to analyze user requests and determine which specialist agent should handle them.

Available agents:

1. **next_steps_planner** - Plans implementation, creates roadmaps, answers "what's next" questions
   - Triggers: plan, roadmap, next steps, what next, agenda, what's the scoop, upcoming work, working on next
   - Examples: "what next", "hey, go the agenda, man?", "what's the scoop our next adventure?"

2. **test-agent** - Browser automation, testing, screenshots, validation
   - Triggers: test, browser, e2e, screenshot, validate, check, selenium, puppeteer
   - Examples: "test the login flow", "take a screenshot", "validate the form"

3. **coder-agent** - Writes code, implements features, creates functions
   - Triggers: write, code, function, create, build, implement, develop, program
   - Examples: "write a function", "create a component", "build a calculator"

4. **helper-agent** - Answers questions, explains concepts, provides help
   - Triggers: what is, why, how does, explain, difference, help me understand
   - Examples: "what is async", "explain closures", "how does map work"

5. **general-purpose-agent** - General tasks, custom tools (time, calculator)
   - Triggers: calculate, what time, current time, math operations
   - Examples: "what time is it", "calculate 5 + 3"

User request: "${userRequest}"

Analyze the user's intent and respond with ONLY a JSON object in this exact format:
{
  "agent": "<agent_name>",
  "confidence": <0.0-1.0>,
  "reasoning": "<brief explanation>"
}

Rules:
- Choose the MOST specific agent that matches the intent
- Confidence should reflect how certain you are (0.0 = unsure, 1.0 = certain)
- If request is about planning/roadmap/agenda/next steps, choose next_steps_planner
- Be flexible with informal language (e.g., "what next" = next_steps_planner)
- Respond with ONLY the JSON object, no other text`;
  }

  /**
   * Parse Gemini's response into a RoutingResult
   */
  private parseResponse(text: string): RoutingResult {
    try {
      // Remove markdown code blocks if present
      const cleaned = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      // Validate the response
      if (!parsed.agent || typeof parsed.confidence !== 'number') {
        throw new Error('Invalid response format from Gemini');
      }

      return {
        agent: parsed.agent as AgentType,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error(`Failed to parse routing response: ${error}`);
    }
  }

  /**
   * Batch route multiple requests (useful for testing)
   */
  async batchRoute(requests: string[]): Promise<RoutingResult[]> {
    const results = await Promise.all(
      requests.map(req => this.route(req))
    );
    return results;
  }
}

/**
 * Convenience function for quick routing
 */
export async function routeRequest(userRequest: string): Promise<RoutingResult> {
  const router = new SemanticRouter();
  return router.route(userRequest);
}
