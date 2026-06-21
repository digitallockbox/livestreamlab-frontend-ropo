#!/usr/bin/env bash
set -euo pipefail

declare -A MAP=(
  ["trident-frontend"]="livestreamlab-frontend"
  ["trident-backend-shell"]="livestreamlab-backend"
  ["trident-shared"]="livestreamlab-shared"
  ["trident-engines-internal"]="livestreamlab-engines"
  ["trident-core-internal"]="livestreamlab-core"
)

echo "Renaming workspace folders..."
for OLD in "${!MAP[@]}"; do
  NEW="${MAP[$OLD]}"
  if [ -d "$OLD" ] && [ ! -d "$NEW" ]; then
    git mv "$OLD" "$NEW"
    echo "Renamed $OLD -> $NEW"
  else
    echo "Skipped $OLD"
  fi
done

echo "Updating references..."
FILES=$(git ls-files "*.ts" "*.tsx" "*.js" "*.json" "*.md" "*.yml" "*.yaml")
for OLD in "${!MAP[@]}"; do
  NEW="${MAP[$OLD]}"
  sed -i "s|$OLD|$NEW|g" $FILES
  sed -i "s|@trident/|@livestreamlab/|g" $FILES
  sed -i "s|trident-|livestreamlab-|g" $FILES
done

echo "Done."
