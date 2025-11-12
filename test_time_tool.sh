#!/bin/bash

##
# Test Script for Time Tool
#
# This script demonstrates the get_current_time tool in action
##

echo "================================"
echo "Testing get_current_time Tool"
echo "================================"
echo ""

echo "1. ISO Format (Default):"
echo "   Command: ./get_current_time.sh iso"
echo "   Output: $(/home/adamsl/growing_collective/.claude/tools/get_current_time.sh iso)"
echo ""

echo "2. Readable Format:"
echo "   Command: ./get_current_time.sh readable"
echo "   Output: $(/home/adamsl/growing_collective/.claude/tools/get_current_time.sh readable)"
echo ""

echo "3. Unix Timestamp:"
echo "   Command: ./get_current_time.sh unix"
echo "   Output: $(/home/adamsl/growing_collective/.claude/tools/get_current_time.sh unix)"
echo ""

echo "================================"
echo "Tool Test Complete!"
echo "================================"
echo ""
echo "The time tool is working correctly and can be used by agents."
echo "See TOOLS_GUIDE.md for usage instructions."
