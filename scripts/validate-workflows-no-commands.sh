#!/usr/bin/env bash
# Ensure workflows.md contains no command tokens (handoffs only)

set -e

echo "=== Workflows Command-Free Check ==="

# Search for ts: commands in workflows.md
FOUND=$(grep -oE "ts:[a-z]{2,}" spec/4.0/workflows.md 2>/dev/null || true)

if [ -z "$FOUND" ]; then
  echo "OK: workflows.md is command-free (handoffs only)"
  exit 0
else
  echo "FAILED: workflows.md still contains commands:"
  grep -n "ts:[a-z]" spec/4.0/workflows.md 2>/dev/null || true
  exit 1
fi
