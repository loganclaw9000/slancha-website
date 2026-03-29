# OpenClaw Observability Dashboard

A comprehensive observability system for monitoring OpenClaw agent performance, tracking metrics, and gaining insights into usage patterns.

**Status: ✅ FULLY FUNCTIONAL**

## Overview

This observability system provides:

- ✅ **Data Collection** - Automated collection from session logs
- ✅ **Data Processing** - Aggregation into time-series data  
- ✅ **Dashboard** - Interactive web dashboard with real visualizations
- ✅ **Custom Metrics** - Peak activity hours, model switching analysis

## Quick Start

### 1. Verify Data Collection

```bash
# Run data collection
bash /home/admin/.openclaw/workspace/observability/scripts/collect-metrics.sh

# Run aggregation
node /home/admin/.openclaw/workspace/observability/scripts/aggregate-metrics.js
```

### 2. Start the Dashboard

```bash
# Start HTTP server on port 8080
cd /home/admin/.openclaw/workspace/observability/dashboard
python3 -m http.server 8080
```

Then open **http://127.0.0.1:8080** in your browser.

The dashboard will:
- Auto-refresh every 5 minutes
- Show real data from aggregated-metrics.json
- Display 5 different visualizations

### 3. Set Up Auto-Cron for OpenClaw

```bash
openclaw cron add '{"name":"observability-collection","schedule":{"kind":"every","everyMs":1800000},"payload":{"kind":"systemEvent","text":"Run observability data collection"}}' "observability-cron"
```

This runs data collection every 30 minutes.

## Current Data Summary

Based on latest collection:

- **Total Sessions Tracked:** 129
- **Success Rate:** 0% (all sessions had errors - network/credit issues)
- **Unique Models Used:** 6
- **Total Errors:** 129

### Error Breakdown:
1. **Network connection errors:** 124 (96%)
2. **Credit balance issues (Claude):** 11 (9%)
3. **Model load failures (GLM):** 6 (5%)
4. **Configuration errors:** 2 (2%)

### Models Monitored:
- Qwen3-Coder-Next (60 sessions)
- Qwen3-Coder-30B (28 sessions)
- Qwen3.5-35B (16 sessions)
- big-tiger-gemma-27b-v3 (18 sessions)
- claude-sonnet-4-6 (11 sessions)
- glm-4.5-air (10 sessions)

## Structure

```
observability/
├── data/
│   ├── aggregated-metrics.json  # Main aggregated data
│   ├── consolidated-metrics.json # All collected metrics
│   └── daily-metrics-*.json     # Daily snapshots
├── scripts/
│   ├── collect-metrics.sh       # Shell data collection
│   └── aggregate-metrics.js     # Node.js aggregation
├── dashboard/
│   └── index.html               # Web dashboard
└── README.md                    # This file
```

## Dashboard Features

### Overview Tab
- Total sessions, success rate, unique models, error count
- Session activity timeline (line chart)
- Model usage distribution (doughnut chart)
- Model success rates (horizontal bar chart)

### Spawn History Tab
- Detailed table of all agent spawns
- Filter by model
- Shows timestamp, model, status, error message
- Limited to 100 rows (scrollable)

### Performance Tab
- Sessions per model (stacked bar chart)
- Error vs success comparison
- Performance summary table with success rates

### Error Patterns Tab
- Error types distribution (doughnut chart)
- Error timeline (line chart)
- Top 10 errors table

### Custom Metrics Tab
- Activity by hour of day (bar chart)
- Model switching summary

## Data Structure

### aggregated-metrics.json
```json
{
  "timestamp": "2026-03-29T07:57:09.664Z",
  "timeSeries": {
    "sessions": [...],  // All session records
    "errors": [...],    // Error patterns with counts
    "models": {...},    // Per-model statistics
    "hourly": {...}     // Hourly activity counts
  },
  "performanceMetrics": {...},
  "customMetrics": {...}
}
```

### Session Record
```json
{
  "timestamp": "2026-03-28T15:28:52.070-07:00",
  "model": "Qwen3-Coder-Next",
  "isError": true,
  "error": "LLM request failed: network connection error."
}
```

## Troubleshooting

### No Data Showing
```bash
# Check if logs exist
ls -la /tmp/openclaw/openclaw-*.log

# Run collection manually
bash /home/admin/.openclaw/workspace/observability/scripts/collect-metrics.sh

# Check output
cat /home/admin/.openclaw/workspace/observability/data/aggregated-metrics.json | head -50
```

### Dashboard Not Loading
1. Verify HTTP server is running: `curl http://127.0.0.1:8080`
2. Check browser console for errors
3. Ensure `data/aggregated-metrics.json` exists (33KB+)

### Cron Not Running
```bash
# List OpenClaw cron jobs
openclaw cron list

# Verify cron job exists
openclaw cron get observability-cron
```

## Maintenance

### Refresh Data
```bash
# Collect new metrics
bash /home/admin/.openclaw/workspace/observability/scripts/collect-metrics.sh

# Aggregate them
node /home/admin/.openclaw/workspace/observability/scripts/aggregate-metrics.js

# Dashboard will auto-refresh every 5 minutes
```

### Cleanup Old Data
```bash
# Remove old timestamped files (keep last 100)
ls -t /home/admin/.openclaw/workspace/observability/data/metrics-*.json | \
    tail -n +101 | xargs -r rm

# Remove old daily files (keep last 30 days)
find /home/admin/.openclaw/workspace/observability/data/ \
    -name "daily-metrics-*.json" -mtime +30 -delete
```

## Export Data

From the dashboard:
- **Export JSON:** Downloads complete aggregated data
- **Export CSV:** Downloads spawn history as CSV

Programmatic export:
```bash
# Download aggregated metrics
curl http://127.0.0.1:8080/data/aggregated-metrics.json > backup.json

# Generate CSV
node -e "const d=require('./data/aggregated-metrics.json');console.log('Timestamp,Model,Status,Error\\n'+d.timeSeries.sessions.map(s=>\`\${s.timestamp},\${s.model},\${s.isError?'Error':'Success'},\${s.error||''}\`).join('\\n'))" > spawns.csv
```

## Security & Privacy

**What's collected:**
- Session timestamps
- Model names
- Error types
- Success/error status

**What's NOT collected:**
- Private message content
- Sensitive credentials  
- Personal identifiable information

All data is stored locally in `/home/admin/.openclaw/workspace/observability/data/`

## Current Limitations

1. **All sessions showing errors** - Current data reflects network/credit issues, not dashboard problems
2. **No success cases** - Dashboard handles this gracefully but charts show 0% success
3. **Token/duration metrics** - Not yet extracted from logs (would require additional parsing)

## Future Enhancements

- [ ] Add token count tracking
- [ ] Add session duration tracking
- [ ] Add skill adoption tracking from clawhub
- [ ] Add learnings timeline
- [ ] Add alerting for error rate spikes
- [ ] Add export to Grafana/Prometheus
- [ ] Add email reports

## Credits

Created as part of the OpenClaw observability initiative to provide visibility into agent behavior and performance patterns.

---

**Last Updated:** 2026-03-29  
**Status:** Production Ready  
**Data Size:** ~50KB aggregated, ~33KB raw
