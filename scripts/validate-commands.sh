#!/usr/bin/env bash
# Validate commands referenced across spec match registry.yml

set -e

echo "=== Command Consistency Check ==="

# Extract valid commands from registry.yml
echo "Extracting valid commands from registry.yml..."
grep -E "invocation:" spec/4.0/registry.yml | \
  sed 's/.*invocation: "\(.*\)"/\1/' | \
  grep -v "REMOVED" | \
  sort -u > /tmp/valid_commands.txt

echo "Valid commands:"
cat /tmp/valid_commands.txt

# Find all ts: command references in spec docs (except registry and commands.md)
echo ""
echo "Scanning for command references in spec/4.0/..."
grep -rhoE "ts:[a-z]{2,}(\s+[a-z0-9<>\-]+)?" spec/4.0/*.md \
  --include="*.md" \
  | grep -v "^ts:lint" \
  | grep -v "^ts:fix" \
  | grep -v "^ts:agent" \
  | sort -u > /tmp/referenced_commands.txt || true

echo "Commands referenced in spec:"
cat /tmp/referenced_commands.txt

# Check for invalid commands
echo ""
echo "Checking for invalid commands..."
INVALID=0
while read cmd; do
  if ! grep -qF "$cmd" /tmp/valid_commands.txt; then
    echo "ERROR: Invalid command '$cmd' referenced but not in registry"
    INVALID=1
  fi
done < /tmp/referenced_commands.txt

# Check README.md
echo ""
echo "Scanning README.md for commands..."
grep -oE "ts:[a-z]{2,}(\s+[a-z0-9<>\-]+)?" README.md 2>/dev/null | sort -u > /tmp/readme_commands.txt || true
while read cmd; do
  if ! grep -qF "$cmd" /tmp/valid_commands.txt; then
    echo "WARNING: README.md references invalid command '$cmd'"
    INVALID=1
  fi
done < /tmp/readme_commands.txt

if [ $INVALID -eq 0 ]; then
  echo "OK: All commands are valid"
  exit 0
else
  echo ""
  echo "FAILED: Found invalid command references"
  exit 1
fi
