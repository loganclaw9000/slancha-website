#!/usr/bin/env node
/**
 * OpenClaw Observability - Data Collection Script
 * Collects metrics from session logs, memory files, and system data
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOG_DIR = '/tmp/openclaw';
const DATA_DIR = path.join(__dirname, '..', 'data');
const TIMESTAMP = new Date().toISOString();

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log('[Collection] Starting metrics collection...');
console.log('[Collection] Timestamp:', TIMESTAMP);

/**
 * Load and parse log files
 */
function loadLogFiles() {
    const logs = [];
    
    try {
        const logFiles = fs.readdirSync(LOG_DIR)
            .filter(f => f.startsWith('openclaw-') && f.endsWith('.log'));
        
        for (const file of logFiles) {
            const filePath = path.join(LOG_DIR, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        logs.push({
                            timestamp: parsed.time || TIMESTAMP,
                            file: file,
                            ...parsed
                        });
                    } catch (e) {
                        // Skip non-JSON lines
                    }
                }
            } catch (e) {
                console.error(`[Collection] Error reading ${file}:`, e.message);
            }
        }
    } catch (e) {
        console.error('[Collection] Error loading logs:', e.message);
    }
    
    return logs;
}

/**
 * Extract session metrics from logs
 */
function extractSessionMetrics(logs) {
    const sessions = [];
    const models = {};
    
    for (const log of logs) {
        // Extract model usage events
        if (log['1']?.event === 'embedded_run_agent_end') {
            const model = log['1']?.model || 'unknown';
            const isError = log['1']?.isError || false;
            
            sessions.push({
                timestamp: log.time || TIMESTAMP,
                model: model,
                isError: isError,
                error: log['1']?.error || null
            });
            
            // Track model usage
            if (!models[model]) {
                models[model] = { total: 0, success: 0, error: 0 };
            }
            models[model].total++;
            if (isError) {
                models[model].error++;
            } else {
                models[model].success++;
            }
        }
    }
    
    return { sessions, models };
}

/**
 * Extract error patterns
 */
function extractErrorPatterns(logs) {
    const errors = {};
    
    for (const log of logs) {
        if (log['1']?.event === 'embedded_run_agent_end' && log['1']?.isError) {
            const error = log['1']?.error || 'Unknown error';
            if (!errors[error]) {
                errors[error] = 0;
            }
            errors[error]++;
        }
    }
    
    return Object.entries(errors)
        .map(([error, count]) => ({ error, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Extract hourly activity
 */
function extractHourlyActivity(logs) {
    const hourly = {};
    
    for (const log of logs) {
        const hour = log.time?.match(/T(\d{2})/);
        if (hour) {
            const hourNum = hour[1];
            if (!hourly[hourNum]) {
                hourly[hourNum] = 0;
            }
            hourly[hourNum]++;
        }
    }
    
    return Object.entries(hourly)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => a.hour - b.hour);
}

/**
 * Extract learnings from memory files
 */
function extractLearnings() {
    const learnings = [];
    const learningsDir = '/home/admin/.openclaw/workspace/skills/self-improving-agent/.learnings';
    
    try {
        if (fs.existsSync(learningsDir)) {
            const learningFiles = fs.readdirSync(learningsDir)
                .filter(f => f.endsWith('.md'));
            
            for (const file of learningFiles) {
                const filePath = path.join(learningsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Extract learning entries
                const entries = content.match(/^- \[.*?\]\((.*?)\)(?:\n(.*?))?$/gm);
                if (entries) {
                    entries.forEach(entry => {
                        const match = entry.match(/^- \[(.*?)\]\((.*?)\)/);
                        if (match) {
                            learnings.push({
                                title: match[1],
                                link: match[2],
                                source: file,
                                timestamp: TIMESTAMP
                            });
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error('[Collection] Error extracting learnings:', e.message);
    }
    
    return learnings;
}

/**
 * Check clawhub skill installations
 */
function checkClawhubInstalls() {
    const installs = [];
    
    try {
        // Search for clawhub commands in logs
        const logFiles = fs.readdirSync(LOG_DIR)
            .filter(f => f.startsWith('openclaw-') && f.endsWith('.log'));
        
        for (const file of logFiles) {
            const filePath = path.join(LOG_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Look for clawhub install patterns
            const matches = content.match(/clawhub\s+(?:install|uninstall|add|remove)\s+([\w-]+)/g);
            if (matches) {
                matches.forEach(match => {
                    const skill = match.match(/([\w-]+)$/);
                    if (skill) {
                        installs.push({
                            command: match,
                            skill: skill[1],
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
        }
    } catch (e) {
        console.error('[Collection] Error checking clawhub:', e.message);
    }
    
    return installs;
}

/**
 * Generate metrics file
 */
function generateMetrics() {
    console.log('[Collection] Loading logs...');
    const logs = loadLogFiles();
    console.log('[Collection] Loaded', logs.length, 'log entries');
    
    console.log('[Collection] Extracting session metrics...');
    const { sessions, models } = extractSessionMetrics(logs);
    console.log('[Collection] Found', sessions.length, 'sessions');
    
    console.log('[Collection] Extracting error patterns...');
    const errors = extractErrorPatterns(logs);
    console.log('[Collection] Found', errors.length, 'error patterns');
    
    console.log('[Collection] Extracting hourly activity...');
    const hourly = extractHourlyActivity(logs);
    
    console.log('[Collection] Extracting learnings...');
    const learnings = extractLearnings();
    console.log('[Collection] Found', learnings.length, 'learnings');
    
    console.log('[Collection] Checking clawhub...');
    const clawhub = checkClawhubInstalls();
    
    // Calculate summary metrics
    const totalSessions = sessions.length;
    const successCount = sessions.filter(s => !s.isError).length;
    const errorCount = sessions.filter(s => s.isError).length;
    const successRate = totalSessions > 0 ? (successCount / totalSessions * 100) : 0;
    
    // Create metrics object
    const metrics = {
        collectionTimestamp: TIMESTAMP,
        sources: {
            sessions,
            errors,
            learnings,
            clawhub: clawhub
        },
        summary: {
            totalSessions,
            successCount,
            errorCount,
            successRate: Math.round(successRate * 100) / 100,
            models,
            hourlyActivity: hourly
        }
    };
    
    // Save timestamped file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const timestampedFile = path.join(DATA_DIR, `metrics-${timestamp}.json`);
    fs.writeFileSync(timestampedFile, JSON.stringify(metrics, null, 2));
    console.log('[Collection] Saved:', timestampedFile);
    
    // Update daily metrics
    const dailyFile = path.join(DATA_DIR, `daily-metrics-${new Date().toISOString().slice(0, 10)}.json`);
    let dailyMetrics = { sources: { sessions: [], errors: [], learnings: [], clawhub: [] } };
    
    if (fs.existsSync(dailyFile)) {
        dailyMetrics = JSON.parse(fs.readFileSync(dailyFile, 'utf8'));
    }
    
    // Merge data
    dailyMetrics.sources.sessions = [...(dailyMetrics.sources.sessions || []), ...sessions];
    dailyMetrics.sources.errors = [...(dailyMetrics.sources.errors || []), ...errors];
    dailyMetrics.sources.learnings = [...(dailyMetrics.sources.learnings || []), ...learnings];
    dailyMetrics.sources.clawhub = [...(dailyMetrics.sources.clawhub || []), ...clawhub];
    
    fs.writeFileSync(dailyFile, JSON.stringify(dailyMetrics, null, 2));
    console.log('[Collection] Updated daily metrics:', dailyFile);
    
    // Update consolidated metrics
    const consolidatedFile = path.join(DATA_DIR, 'consolidated-metrics.json');
    let consolidated = [];
    
    if (fs.existsSync(consolidatedFile)) {
        consolidated = JSON.parse(fs.readFileSync(consolidatedFile, 'utf8'));
    }
    
    consolidated.push(metrics);
    if (consolidated.length > 100) {
        consolidated = consolidated.slice(-100);
    }
    
    fs.writeFileSync(consolidatedFile, JSON.stringify(consolidated, null, 2));
    console.log('[Collection] Updated consolidated metrics:', consolidatedFile);
    
    // Generate human-readable summary
    const summaryFile = path.join(DATA_DIR, `summary-${timestamp}.txt`);
    const summaryText = [
        '=== OpenClaw Observability Summary ===',
        `Generated: ${TIMESTAMP}`,
        '',
        'Session Statistics:',
        `  - Total Sessions: ${totalSessions}`,
        `  - Successful: ${successCount}`,
        `  - Errors: ${errorCount}`,
        `  - Success Rate: ${successRate.toFixed(1)}%`,
        '',
        'Top Models Used:',
        ...Object.entries(models)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10)
            .map(([model, data]) => `  - ${model}: ${data.total} sessions`),
        '',
        'Peak Activity Hours:',
        ...hourly
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(({ hour, count }) => `  - Hour ${hour}: ${count} events`),
        '',
        'Error Patterns:',
        ...errors.slice(0, 10).map(({ error, count }) => `  - ${error}: ${count}`)
    ].join('\n');
    
    fs.writeFileSync(summaryFile, summaryText);
    console.log('[Collection] Generated summary:', summaryFile);
    
    // Print summary to stdout
    console.log('\n=== Collection Complete ===');
    console.log('Total Sessions:', totalSessions);
    console.log('Success Rate:', successRate.toFixed(1) + '%');
    console.log('Error Count:', errorCount);
    console.log('Models Used:', Object.keys(models).length);
    
    return metrics;
}

// Run collection
try {
    const metrics = generateMetrics();
    console.log('\n[Collection] All done!');
} catch (error) {
    console.error('[Collection] Fatal error:', error);
    process.exit(1);
}
