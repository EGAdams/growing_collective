#!/bin/bash

##
# Simple Calculator Tool
#
# Demonstrates creating a custom tool for agents
#
# Usage:
#   ./calculator.sh <operation> <num1> <num2>
#
# Operations:
#   add, subtract, multiply, divide
#
# Examples:
#   ./calculator.sh add 5 3
#   ./calculator.sh multiply 4 7
##

OPERATION="$1"
NUM1="$2"
NUM2="$3"

# Validate inputs
if [ -z "$OPERATION" ] || [ -z "$NUM1" ] || [ -z "$NUM2" ]; then
    echo "Error: Missing arguments" >&2
    echo "Usage: $0 <operation> <num1> <num2>" >&2
    echo "Operations: add, subtract, multiply, divide" >&2
    exit 1
fi

# Validate numbers
if ! [[ "$NUM1" =~ ^-?[0-9]+\.?[0-9]*$ ]] || ! [[ "$NUM2" =~ ^-?[0-9]+\.?[0-9]*$ ]]; then
    echo "Error: Arguments must be numbers" >&2
    exit 1
fi

# Perform calculation
case "$OPERATION" in
    add)
        result=$(echo "$NUM1 + $NUM2" | bc)
        echo "$NUM1 + $NUM2 = $result"
        ;;
    subtract)
        result=$(echo "$NUM1 - $NUM2" | bc)
        echo "$NUM1 - $NUM2 = $result"
        ;;
    multiply)
        result=$(echo "$NUM1 * $NUM2" | bc)
        echo "$NUM1 × $NUM2 = $result"
        ;;
    divide)
        if [ "$NUM2" == "0" ]; then
            echo "Error: Division by zero" >&2
            exit 1
        fi
        result=$(echo "scale=4; $NUM1 / $NUM2" | bc)
        echo "$NUM1 ÷ $NUM2 = $result"
        ;;
    *)
        echo "Error: Unknown operation '$OPERATION'" >&2
        echo "Valid operations: add, subtract, multiply, divide" >&2
        exit 1
        ;;
esac
