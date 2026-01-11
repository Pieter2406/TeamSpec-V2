#!/usr/bin/env bash
# Validate all referenced lint rule IDs exist in lint-rules.md

set -e

echo "=== Lint Rule Completeness Check ==="

# Extract defined lint rules from lint-rules.md
echo "Extracting defined lint rules..."
grep -oE "TS-[A-Z]+-[0-9]{3}" spec/4.0/lint-rules.md | sort -u > /tmp/defined_rules.txt

echo "Defined rules:"
cat /tmp/defined_rules.txt

# Extract referenced lint rules from all spec docs
echo ""
echo "Extracting referenced lint rules..."
grep -rhoE "TS-[A-Z]+-[0-9]{3}" spec/4.0/*.md \
  --include="*.md" \
  | sort -u > /tmp/referenced_rules.txt

echo "Referenced rules:"
cat /tmp/referenced_rules.txt

# Find missing rules
echo ""
echo "Checking for missing rules..."
MISSING=$(comm -23 /tmp/referenced_rules.txt /tmp/defined_rules.txt)

if [ -z "$MISSING" ]; then
  echo "OK: All referenced lint rules are defined"
  exit 0
else
  echo "FAILED: Missing lint rule definitions:"
  echo "$MISSING"
  exit 1
fi
