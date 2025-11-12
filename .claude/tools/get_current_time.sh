#!/bin/bash

##
# Get Current Time Tool
#
# A simple tool that returns the current date and time.
# This demonstrates how to create custom tools for agents.
#
# Usage:
#   ./get_current_time.sh [format] [timezone]
#
# Arguments:
#   format   - Output format: iso, unix, readable (default: iso)
#   timezone - Timezone string like "America/New_York" (optional)
#
# Examples:
#   ./get_current_time.sh iso
#   ./get_current_time.sh readable "America/New_York"
#   ./get_current_time.sh unix
##

FORMAT="${1:-iso}"
TIMEZONE="${2:-}"

case "$FORMAT" in
  iso)
    if [ -n "$TIMEZONE" ]; then
      TZ="$TIMEZONE" date -u +"%Y-%m-%dT%H:%M:%S%z"
    else
      date -u +"%Y-%m-%dT%H:%M:%SZ"
    fi
    ;;

  unix)
    date +%s
    ;;

  readable)
    if [ -n "$TIMEZONE" ]; then
      TZ="$TIMEZONE" date "+%A, %B %d, %Y at %I:%M:%S %p %Z"
    else
      date "+%A, %B %d, %Y at %I:%M:%S %p %Z"
    fi
    ;;

  *)
    echo "Error: Unknown format '$FORMAT'. Use: iso, unix, or readable" >&2
    exit 1
    ;;
esac
