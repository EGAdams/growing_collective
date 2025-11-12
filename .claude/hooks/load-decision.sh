#!/bin/bash
# Load the DECISION.md file at session start
# This enables auto-delegation capability

DECISION_FILE="$CLAUDE_PROJECT_DIR/.claude-collective/DECISION.md"

if [ -f "$DECISION_FILE" ]; then
    cat <<EOF
{
  "decision": "block",
  "reason": "🚀 Growing Collective Initialized\n\nAI-powered semantic routing system loaded\n\nUse /van followed by ANY request:\n- AI automatically routes to the right specialist\n- No keywords needed - just natural language\n- ~$0.00005 per request (effectively free)\n\nExample: /van what's next? or /van code this up"
}
EOF
else
    echo '{"decision": "allow"}'
fi
