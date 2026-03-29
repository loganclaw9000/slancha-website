# OpenClaw Observability Dashboard

A comprehensive observability system for monitoring OpenClaw agent performance, tracking metrics, and gaining insights into usage patterns.

## Overview

This observability prototype provides:

- **Phase 1: Data Collection** - Automated collection of metrics from session logs, memory files, and clawhub
- **Phase 2: Data Processing** - Aggregation and analysis of collected metrics
- **Phase 3: Dashboard** - Interactive web dashboard with visualizations
- **Phase 4: Custom Metrics** - Advanced metrics like peak activity hours, model switching, etc.

## Quick Start

### 1. Initial Setup

```bash
# Make scripts executable
chmod +x /home/admin/.openclaw/workspace/observability/scripts/collect-metrics.sh
chmod +x /home/admin/.openclaw/workspace/observability/scripts/aggregate-metrics.js
chmod +x /home/admin/.openclaw/workspace/observability/cron/observability-collector

# Run initial data collection
bash /home/admin/.openclaw/workspace/observability/scripts/collect-metrics.sh
node /home/admin/.openclaw/workspace/observability/scripts/aggregate-metrics.js
```

### 2. Start the Dashboard

The dashboard is a static HTML file. You can view it directly in your browser, or start a simple HTTP server:

```bash
# Using Python 3
cd /home/admin/.openclaw/workspace/observability/dashboard
python3 -m http.server 18789

# Or using Node.js
npx serve /home/admin/.openclaw/workspace/observability/dashboard -l 18789
```

Then open http://127.0.0.1:18789 in your browser.

### 3. Setup Cron Job

Add to your crontab (`crontab -e`):

```bash
# Run observability collection every 30 minutes
*/30 * * * * /home/admin/.openclaw/workspace/observability/cron/observability-collector >> /home/admin/.openclaw/workspace/observability/data/cron.log 2>&1
```

Or use OpenClaw's built-in cron system:

```bash
# Add to OpenClaw cron
openclaw cron add "*/30 * * * * bash /home/admin/.openclaw/workspace/observability/cron/observability-collector" "observability-metrics"
```

## Structure

```
observability/
├── data/                    # Collected data files
│   ├── metrics-*.json      # Timestamped metric files
│   ├── daily-metrics-*.json # Daily aggregated data
│   ├── consolidated-metrics.json # All collected metrics
│   └── aggregated-metrics.json # Processed time-series data
├── scripts/
│   ├── collect-metrics.sh  # Data collection script
│   └── aggregate-metrics.js # Metrics aggregation
├── reports/                 # Generated reports
│   ├── spawn-history.json
│   ├── model-performance.json
│   ├── skill-adoption.json
│   ├── error-patterns.json
│   └── learnings.json
├── dashboard/
│   └── index.html          # Web dashboard
├── cron/
│   └── observability-collector # Cron job entry point
└── README.md               # This file
```

## Metrics Collected

### Session Metrics
- Total sessions, success rate, error count
- Session duration and token usage
- Model usage patterns

### Error Analysis
- Error frequency by type
- Error timeline over time
- Peak error hours

### Model Performance
- Sessions per model
- Success rate by model
- Token consumption

### Skill Adoption
- Skill installation timeline
- Installation counts per skill

### Custom Metrics
- Peak activity hours (24-hour heatmap)
- Model switching frequency
- Learning velocity

## Dashboard Features

### Overview Tab
- Key metrics at a glance
- Session activity timeline
- Model usage distribution

### Spawn History Tab
- Detailed table of all agent spawns
- Filter by date range, agent, model
- Export to JSON/CSV

### Performance Tab
- Session duration trends
- Token usage by model
- Success rate comparison

### Skill Adoption Tab
- Installation timeline
- Skills by count

### Error Patterns Tab
- Error type distribution
- Error timeline
- Peak error hours

### Learnings Tab
- Timeline of extracted learnings
- Learning frequency

### Custom Metrics Tab
- Activity heatmap
- Model switching patterns
- Learning velocity

## Adding New Metrics

### 1. Add Collection Logic

Edit `scripts/collect-metrics.sh`:

```bash
# Example: Add new metric collection
echo "[$(date)] Collecting new metric..."
NEW_METRIC=$(your_command | jq -c '.')
jq --argjson metric "$NEW_METRIC" '.sources.newMetrics = $metric' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp"
mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"
```

### 2. Add Processing Logic

Edit `scripts/aggregate-metrics.js`:

```javascript
// Add to createTimeSeries function
function createNewSeries(metrics) {
    const series = [];
    for (const daily of metrics) {
        if (daily.sources?.newMetrics) {
            series.push(...daily.sources.newMetrics);
        }
    }
    return series;
}

// Add to generateCustomMetrics
function addNewCustomMetrics(timeSeries) {
    return {
        ...customMetrics,
        newMetric: calculateNewMetric(timeSeries)
    };
}
```

### 3. Add Dashboard Visualization

Edit `dashboard/index.html`:

```javascript
// Add chart rendering function
function renderNewMetricChart(data) {
    const ctx = document.getElementById('newMetricChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'New Metric',
                data: data.values,
                borderColor: '#667eea'
            }]
        }
    });
}

// Add tab to interface
<div class="tab" onclick="showTab('new-metrics')">New Metric</div>
<div id="new-metrics" class="tab-content">
    <h2>New Metric Dashboard</h2>
    <div class="chart-container">
        <canvas id="newMetricChart"></canvas>
    </div>
</div>
```

## Troubleshooting

### No Data Showing

1. Check that logs exist:
```bash
ls -la /tmp/openclaw/openclaw-*.log
```

2. Run collection manually:
```bash
bash /home/admin/.openclaw/workspace/observability/scripts/collect-metrics.sh
```

3. Check for errors in the output

### Dashboard Not Loading

1. Ensure you're using a valid HTTP server
2. Check browser console for errors
3. Verify `aggregated-metrics.json` exists in `data/` directory

### Cron Not Running

1. Check crontab:
```bash
crontab -l | grep observability
```

2. Verify script permissions:
```bash
chmod +x /home/admin/.openclaw/workspace/observability/cron/observability-collector
```

3. Check cron log:
```bash
tail -100 /home/admin/.openclaw/workspace/observability/data/cron.log
```

## Data Privacy

This system only collects:
- Session metadata (timestamps, outcomes, model names)
- Error patterns (error types and frequencies)
- Learnings (from memory files)

It does **not** collect:
- Private message content
- Sensitive credentials
- Personal identifiable information

## Maintenance

### Cleanup Old Data

```bash
# Keep only last 30 days of daily metrics
find /home/admin/.openclaw/workspace/observability/data/ \
    -name "daily-metrics-*.json" \
    -mtime +30 -delete

# Keep only last 100 raw metric files
ls -t /home/admin/.openclaw/workspace/observability/data/metrics-*.json | \
    tail -n +101 | xargs -r rm
```

### Update Charts

- Edit `dashboard/index.html`
- Change chart types in the Chart.js configuration
- Add new datasets as needed

## License

Internal use only. Part of OpenClaw workspace.

## Contributing

To add new observability features:

1. Create a feature branch
2. Add collection logic
3. Add processing logic
4. Add dashboard visualization
5. Update this README
6. Test with real data

---

**Created:** 2026-03-29
**Last Updated:** 2026-03-29
