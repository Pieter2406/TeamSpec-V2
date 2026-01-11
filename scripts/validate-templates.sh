#!/usr/bin/env bash
# Validate templates exist for all registry artifacts

set -e

echo "=== Template Coverage Check ==="

# Expected templates based on registry artifacts
declare -A EXPECTED_TEMPLATES
EXPECTED_TEMPLATES=(
  ["feature"]="feature-template.md"
  ["story"]="story-template.md"
  ["epic"]="epic-template.md"
  ["feature-increment"]="feature-increment-template.md"
  ["business-analysis"]="business-analysis-template.md"
  ["solution-design"]="sd-template.md"
  ["technical-architecture"]="ta-template.md"
  ["ba-increment"]="bai-template.md"
  ["sd-increment"]="sdi-template.md"
  ["ta-increment"]="tai-template.md"
  ["project-test-case"]="tc-template.md"
  ["regression-impact"]="ri-template.md"
  ["bug-report"]="bug-report-template.md"
  ["sprint"]="sprint-template.md"
)

MISSING=0

for artifact in "${!EXPECTED_TEMPLATES[@]}"; do
  template="${EXPECTED_TEMPLATES[$artifact]}"
  if [ -f "templates/$template" ]; then
    echo "OK: $artifact -> templates/$template"
  else
    echo "MISSING: $artifact -> templates/$template"
    MISSING=1
  fi
done

if [ $MISSING -eq 0 ]; then
  echo ""
  echo "OK: All required templates exist"
  exit 0
else
  echo ""
  echo "FAILED: Some templates are missing"
  exit 1
fi
