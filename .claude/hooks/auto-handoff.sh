#!/bin/bash
# Auto-handoff detection for agent chaining
# Detects when an agent ends with "Use the X subagent to..." and continues automatically

# Read the subagent output from stdin
input=$(cat)

# Extract the agent output text from the JSON payload
output=$(echo "$input" | jq -r '.output // empty' 2>/dev/null)

if [ -z "$output" ]; then
    # No output to process, allow continuation
    echo '{"decision": "allow"}'
    exit 0
fi

# Normalize Unicode dashes to ASCII hyphens for robust pattern matching
normalized_output=$(echo "$output" | sed 's/[–—‑−]/-/g')

# Detect handoff pattern: "Use the <agent-name> subagent to..."
next_agent=$(echo "$normalized_output" | grep -i -o 'Use the [a-z0-9-]* subagent to' | sed 's/Use the //' | sed 's/ subagent to.*//' | tail -1)

if [ -n "$next_agent" ]; then
    # Handoff detected - extract the task description
    task_description=$(echo "$normalized_output" | grep -i "Use the $next_agent subagent to" | sed "s/.*Use the $next_agent subagent to //" | head -1)

    # Block and inject the handoff continuation message
    cat <<EOF
{
  "decision": "block",
  "reason": "AGENT HANDOFF DETECTED: Agent completed and delegated to $next_agent. Continuing automatically...\n\nUse the $next_agent subagent to $task_description"
}
EOF
else
    # No handoff detected, allow normal continuation
    echo '{"decision": "allow"}'
fi
