#!/bin/bash
# OpenClaw Observability - Data Collection Script
# Collects metrics from session logs, memory files, and clawhub

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$BASE_DIR/data"
LOG_DIR="/tmp/openclaw"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create data directory if it doesn't exist
mkdir -p "$DATA_DIR"

# Output file for this run
OUTPUT_FILE="$DATA_DIR/metrics-$(date +%Y%m%d-%H%M%S).json"

echo "[$(date)] Starting metrics collection..."
echo "[$(date)] Output: $OUTPUT_FILE"

# Initialize JSON output
cat > "$OUTPUT_FILE" << EOF
{
  "collectionTimestamp": "$TIMESTAMP",
  "sources": {
    "sessionLogs": [],
    "memoryFiles": [],
    "clawhub": [],
    "errors": [],
    "learnings": []
  },
  "summary": {}
}
EOF

# Phase 1: Parse session logs
echo "[$(date)] Parsing session logs..."

# Extract model usage events (token counts, duration, models)
if [ -f "$LOG_DIR/openclaw-$(date +%Y-%m-%d).log" ]; then
    MODEL_USAGE=$(grep -o '{"subsystem":"agent/embedded"}[^}]*"event":"embedded_run_agent_end"[^}]*}' "$LOG_DIR/openclaw-$(date +%Y-%m-%d).log" 2>/dev/null | head -50 | jq -s '.' || echo "[]")
    
    # Add to JSON
    jq --argjson usage "$MODEL_USAGE" '.sources.sessionLogs |= . + $usage' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"
fi

# Count sessions by outcome
SUCCESS_COUNT=$(grep -c '"isError":false' "$LOG_DIR/openclaw-*.log" 2>/dev/null || echo "0")
ERROR_COUNT=$(grep -c '"isError":true' "$LOG_DIR/openclaw-*.log" 2>/dev/null || echo "0")

# Extract error patterns
echo "[$(date)] Extracting error patterns..."
ERROR_PATTERNS=$(grep '"isError":true' "$LOG_DIR/openclaw-*.log" 2>/dev/null | \
    grep -o '"error":"[^"]*"' | \
    sed 's/"error":"//g; s/"$//g' | \
    sort | uniq -c | sort -rn | head -20 | \
    jq -R -s 'split("\n") | map(select(length > 0)) | map({count: (input | split(" ")[0] | tonumber), error: .})' || echo "[]")

# Add errors
jq --argjson errors "$ERROR_PATTERNS" '.sources.errors = $errors' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

# Phase 2: Parse memory/learnings files
echo "[$(date)] Parsing memory files..."

if [ -d "/home/admin/.openclaw/workspace/skills/self-improving-agent/.learnings" ]; then
    LEARNINGS_FILE="/home/admin/.openclaw/workspace/skills/self-improving-agent/.learnings/LEARNINGS.md"
    if [ -f "$LEARNINGS_FILE" ]; then
        # Extract learning entries
        LEARNINGS=$(grep -A5 "^- " "$LEARNINGS_FILE" 2>/dev/null | \
            jq -R -s 'split("\n") | map(select(length > 0)) | .[0:10]' || echo "[]")
        
        jq --argjson learnings "$LEARNINGS" '.sources.learnings = $learnings' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"
    fi
fi

# Phase 3: Clawhub skill installations
echo "[$(date)] Checking clawhub data..."

# Look for clawhub installation logs in system logs
CLAWHUB_INSTALLS=$(grep -i "clawhub install\|skill install" "$LOG_DIR/openclaw-*.log" 2>/dev/null | \
    tail -20 | \
    jq -R -s 'split("\n") | map(select(length > 0)) | map({timestamp: (split(" ")[0:4] | join(" ")), command: .})' || echo "[]")

jq --argjson installs "$CLAWHUB_INSTALLS" '.sources.clawhub = $installs' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

# Phase 4: Generate summary metrics
echo "[$(date)] Generating summary metrics..."

# Count unique models used
MODELS_USED=$(grep -o '"model":"[^"]*"' "$LOG_DIR/openclaw-*.log" 2>/dev/null | \
    sed 's/"model":"//g; s/"//g' | \
    sort | uniq -c | sort -rn | head -10 | \
    jq -R -s 'split("\n") | map(select(length > 0)) | map({model: (split(" ")[1:2] | join(" ")), count: (split(" ")[0] | tonumber)})' || echo "[]")

# Calculate activity by hour
HOURLY_ACTIVITY=$(grep -oP '^\{"time":"\d{4}-\d{2}-\d{2}T\d{2}' "$LOG_DIR/openclaw-*.log" 2>/dev/null | \
    cut -c22-23 | \
    sort | uniq -c | sort -k2 | \
    jq -R -s 'split("\n") | map(select(length > 0)) | map({hour: (split(" ")[1] | tonumber), count: (split(" ")[0] | tonumber)})' || echo "[]")

# Update summary
SUMMARY_JSON=$(jq -n \
    --arg timestamp "$TIMESTAMP" \
    --argjson success "$SUCCESS_COUNT" \
    --argjson error "$ERROR_COUNT" \
    --argjson models "$MODELS_USED" \
    --argjson hourly "$HOURLY_ACTIVITY" \
    '{
        timestamp: $timestamp,
        totalSessions: ($success + $error),
        successCount: $success,
        errorCount: $error,
        successRate: (if ($success + $error) > 0 then (($success / ($success + $error)) * 100 | . * 100 | round / 100) else 0 end),
        topModels: $models,
        hourlyActivity: $hourly
    }')

jq --argjson summary "$SUMMARY_JSON" '.summary = $summary' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

# Archive to daily metrics file
DAILY_FILE="$DATA_DIR/daily-metrics-$(date +%Y%m%d).json"
if [ -f "$DAILY_FILE" ]; then
    # Merge with existing daily file
    jq --slurpfile new "$OUTPUT_FILE" '. += $new[0].sources' "$DAILY_FILE" > "${DAILY_FILE}.tmp" && mv "${DAILY_FILE}.tmp" "$DAILY_FILE"
else
    cp "$OUTPUT_FILE" "$DAILY_FILE"
fi

# Also create a consolidated file
CONSOLIDATED_FILE="$DATA_DIR/consolidated-metrics.json"
if [ -f "$CONSOLIDATED_FILE" ]; then
    # Keep last 100 entries
    jq 'if (. | length) > 100 then .[-100:] else . end' "$CONSOLIDATED_FILE" > "${CONSOLIDATED_FILE}.tmp" && mv "${CONSOLIDATED_FILE}.tmp" "$CONSOLIDATED_FILE"
    jq --slurpfile new "$OUTPUT_FILE" '. += $new[0].sources' "$CONSOLIDATED_FILE" > "${CONSOLIDATED_FILE}.tmp" && mv "${CONSOLIDATED_FILE}.tmp" "$CONSOLIDATED_FILE"
else
    cp "$OUTPUT_FILE" "$CONSOLIDATED_FILE"
fi

# Create a human-readable summary report
REPORT_FILE="$DATA_DIR/summary-$(date +%Y%m%d-%H%M%S).txt"
{
    echo "=== OpenClaw Observability Summary ==="
    echo "Generated: $TIMESTAMP"
    echo ""
    echo "Session Statistics:"
    echo "  - Total Sessions: $((SUCCESS_COUNT + ERROR_COUNT))"
    echo "  - Successful: $SUCCESS_COUNT"
    echo "  - Errors: $ERROR_COUNT"
    if [ $((SUCCESS_COUNT + ERROR_COUNT)) -gt 0 ]; then
        SUCCESS_RATE=$(echo "scale=2; ($SUCCESS_COUNT / ($SUCCESS_COUNT + $ERROR_COUNT)) * 100" | bc)
        echo "  - Success Rate: ${SUCCESS_RATE}%"
    fi
    echo ""
    echo "Top Models Used:"
    echo "$MODELS_USED" | jq -r '.[] | "  - \(.model): \(.count) sessions"' 2>/dev/null || echo "  (no data)"
    echo ""
    echo "Peak Activity Hours:"
    echo "$HOURLY_ACTIVITY" | jq -r '. | sort_by(-.count) | .[0:5][] | "  - Hour \(.hour): \(.count) events"' 2>/dev/null || echo "  (no data)"
} > "$REPORT_FILE"

echo "[$(date)] Collection complete!"
echo "[$(date)] Reports generated:"
echo "  - Raw data: $OUTPUT_FILE"
echo "  - Daily metrics: $DAILY_FILE"
echo "  - Consolidated: $CONSOLIDATED_FILE"
echo "  - Summary: $REPORT_FILE"

# Output the summary for the agent to capture
jq '.summary' "$OUTPUT_FILE"
