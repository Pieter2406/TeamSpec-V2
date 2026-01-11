#!/usr/bin/env bash
# Ensure removed commands are not referenced (except in Removed Commands sections)

set -e

echo "=== Removed Commands Check ==="

# List of removed commands (from registry.yml)
REMOVED_COMMANDS=(
  "ts:deploy"
  "ts:ba epic"
  "ts:ba feature"
  "ts:sa design"
  "ts:sa adr"
  "ts:qa uat"
  "ts:qa bug"
  "ts:fa slice"
  "ts:sm planning"
  "ts:sm standup"
  "ts:sm retro"
  "ts:sm sync"
  "ts:sm sprint create"
)

ERRORS=0

for cmd in "${REMOVED_COMMANDS[@]}"; do
  echo "Checking for '$cmd'..."

  # Search in spec files (excluding commands.md Removed section and glossary Removed section)
  FOUND=$(grep -rn "$cmd" spec/4.0/*.md README.md 2>/dev/null | \
    grep -v "Removed Commands" | \
    grep -v "Replacement" | \
    grep -v "status: \"REMOVED\"" || true)

  if [ -n "$FOUND" ]; then
    echo "ERROR: Removed command '$cmd' still referenced:"
    echo "$FOUND"
    ERRORS=1
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "OK: No removed commands found in active documentation"
  exit 0
else
  echo ""
  echo "FAILED: Found references to removed commands"
  exit 1
fi
