#!/usr/bin/env bash
# Ensure ADR terminology has been removed (per your decision)

set -e

echo "=== ADR Terminology Check ==="

# Search for ADR in spec files (case-insensitive)
FOUND=$(grep -riln "\bADR\b" spec/4.0/*.md 2>/dev/null || true)

if [ -z "$FOUND" ]; then
  echo "OK: No ADR terminology found in spec/4.0/"
else
  echo "WARNING: ADR terminology still found in:"
  echo "$FOUND"
  echo ""
  echo "Occurrences:"
  grep -rn "\bADR\b" spec/4.0/*.md 2>/dev/null || true
  exit 1
fi

# Check README
FOUND_README=$(grep -n "\bADR\b" README.md 2>/dev/null || true)
if [ -n "$FOUND_README" ]; then
  echo "WARNING: ADR terminology found in README.md:"
  echo "$FOUND_README"
  exit 1
fi

echo "OK: ADR terminology successfully removed"
