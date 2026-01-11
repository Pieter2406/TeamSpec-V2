#!/usr/bin/env bash
# Master validation script for TeamSpec 4.0 spec consistency

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "TeamSpec 4.0 Spec Consistency Validation"
echo "========================================"
echo ""

FAILED=0

run_check() {
  local script=$1
  local name=$2

  echo "--- $name ---"
  if bash "$SCRIPT_DIR/$script"; then
    echo ""
  else
    FAILED=1
    echo ""
  fi
}

run_check "validate-commands.sh" "Command Consistency"
run_check "validate-lint-rules.sh" "Lint Rule Completeness"
run_check "validate-no-adr.sh" "ADR Terminology Removal"
run_check "validate-no-removed-commands.sh" "Removed Commands"
run_check "validate-workflows-no-commands.sh" "Workflows Command-Free"
run_check "validate-templates.sh" "Template Coverage"

echo "========================================"
if [ $FAILED -eq 0 ]; then
  echo "ALL CHECKS PASSED"
  exit 0
else
  echo "SOME CHECKS FAILED - Review above output"
  exit 1
fi
