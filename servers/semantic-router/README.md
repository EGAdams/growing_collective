# Semantic Router

AI-powered semantic routing using Google Gemini 2.5 Flash-Lite to intelligently route informal and ambiguous user requests to the correct specialist agent.

## Overview

The semantic router solves the problem of informal or ambiguous requests that don't match simple keyword patterns. It uses Google's cheapest AI model (Gemini 2.5 Flash-Lite) to understand natural language intent and route to the appropriate agent.

## Cost

- **Model:** Gemini 2.5 Flash-Lite
- **Input:** $0.10 per 1M tokens
- **Output:** $0.40 per 1M tokens
- **Per Request:** ~$0.00005 (effectively free)
- **Free Tier:** 1,500 requests/day
- **Rate Limit:** 15 requests/minute

## Example Routing

### Successful Tests (100% Confidence)

```bash
# Test 1: Simple informal planning
$ npm run route "what next"
✅ Agent: next_steps_planner (100.0% confidence)
Reasoning: Directly matches the trigger phrase for next_steps_planner

# Test 2: Casual planning request
$ npm run route "hey, go the agenda, man?"
✅ Agent: next_steps_planner (100.0% confidence)
Reasoning: Matches the trigger 'agenda' for next_steps_planner

# Test 3: Informal planning question
$ npm run route "what's the scoop our next adventure?"
✅ Agent: next_steps_planner (100.0% confidence)
Reasoning: Colloquial way of asking about what's happening next
```

## Usage

### Single Request

```bash
npm run route "your informal request here"
```

### Batch Testing (Note: respects rate limits)

```bash
npm run route-batch
```

## How It Works

1. **User makes informal request** (e.g., "what next")
2. **Keyword matching fails** in DECISION.md
3. **semantic-router-agent invoked** as fallback
4. **Gemini analyzes intent** using AI
5. **Returns routing decision** with confidence score
6. **Delegates to appropriate agent**

## Architecture

```
User: "what next"
     ↓
/van (keyword matching fails)
     ↓
semantic-router-agent
     ↓
npm run route "what next"
     ↓
Gemini 2.5 Flash-Lite
     ↓
{ agent: "next_steps_planner", confidence: 1.0 }
     ↓
Task() → next_steps_planner
```

## Files

- **router.ts** - Core SemanticRouter class with Gemini integration
- **cli.ts** - Command-line interface for testing
- **README.md** - This file

## API Key

Required: `GEMINI_API_KEY` in `.env`

Get your API key: https://aistudio.google.com/apikey

## Rate Limits

Free tier limits:

- 15 requests/minute
- 1,500 requests/day

For production use with higher volume, consider:

- Upgrading to paid tier
- Implementing request queuing
- Adding retry logic with exponential backoff

## Integration with Agent System

The semantic router is integrated as a fallback in the routing decision flow:

1. Planning keywords (CHECK FIRST)
2. Testing keywords (CHECK SECOND)
3. Coding keywords (CHECK THIRD)
4. Question keywords (CHECK FOURTH)
5. **Semantic router (FALLBACK for unclear requests)**

See `.claude-collective/DECISION.md` for routing logic.

## Testing Results

**Date:** 2025-11-09
**Tests Run:** 3
**Success Rate:** 100%
**Average Confidence:** 100%

All informal planning requests correctly routed to `next_steps_planner` with maximum confidence.

## Future Improvements

- [ ] Add request caching to reduce API calls
- [ ] Implement retry logic for rate limit errors
- [ ] Add batch processing with rate limit respect
- [ ] Track routing accuracy metrics
- [ ] Add fallback to keyword matching if API fails
- [ ] Implement request queuing for high volume

## Security

- API key stored in `.env` (gitignored)
- Never committed to repository
- Only used for routing analysis
- No user data sent beyond the request text

---

**Status:** ✅ Fully Operational
**Last Updated:** 2025-11-09
