#!/bin/bash
cd $(dirname "$0")
git add -A
if ! git diff --cached --quiet; then
  TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
  git commit -m "Automated update: $TIMESTAMP"
  git push origin master --force || true
fi