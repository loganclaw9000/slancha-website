#!/bin/bash
# Commit any changes in the workspace repo and push to origin
cd /home/admin/.openclaw/workspace || exit 1
git add -A
if git diff --cached --quiet; then
  echo "No changes to commit"
  exit 0
fi
TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
git commit -m "Automated commit: $TIMESTAMP"
git push origin main || true
