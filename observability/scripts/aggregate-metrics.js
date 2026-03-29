#!/usr/bin/env node
/**
 * OpenClaw Observability - Metrics Aggregation Script
 * Aggregates collected metrics into time-series data and generates reports
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

console.log('[Aggregator] Starting metrics aggregation...');

/**
 * Load all daily metrics files
 */
function loadDailyMetrics() {
    const files = fs.readdirSync(DATA_DIR)
        .filter(f => f.startsWith('daily-metrics-') && f.endsWith('.json'))
        .sort();
    
    const metrics = [];
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
            metrics.push(JSON.parse(content));
        } catch (e) {
            console.error(`[Aggregator] Error reading ${file}:`, e.message);
        }
    }
    return metrics;
}

/**
 * Merge daily logs into time-series data
 */
function createTimeSeries(metrics) {
    const timeSeries = {
        sessions: [],
        errors: [],
        models: {},
        hourly: {}
    };
    
    for (const daily of metrics) {
        // Handle direct sessions array from collection
        if (daily.sources?.sessions && Array.isArray(daily.sources.sessions)) {
            timeSeries.sessions = [...timeSeries.sessions, ...daily.sources.sessions];
            
            // Aggregate model data
            for (const session of daily.sources.sessions) {
                const model = session.model || 'unknown';
                if (!timeSeries.models[model]) {
                    timeSeries.models[model] = { total: 0, success: 0, error: 0, sessions: [] };
                }
                timeSeries.models[model].total++;
                if (session.isError) {
                    timeSeries.models[model].error++;
                } else {
                    timeSeries.models[model].success++;
                }
                timeSeries.models[model].sessions.push({
                    timestamp: session.timestamp,
                    isError: session.isError
                });
            }
        }
        
        // Hourly activity
        if (daily.summary?.hourlyActivity) {
            for (const hour of daily.summary.hourlyActivity) {
                if (!timeSeries.hourly[hour.hour]) {
                    timeSeries.hourly[hour.hour] = 0;
                }
                timeSeries.hourly[hour.hour] += hour.count;
            }
        }
        
        // Error tracking
        if (daily.sources?.errors) {
            timeSeries.errors = [...timeSeries.errors, ...daily.sources.errors];
        }
    }
    
    return timeSeries;
}

/**
 * Calculate performance metrics
 */
function calculatePerformanceMetrics(timeSeries) {
    const metrics = {
        averageDuration: null,
        averageTokenCount: null,
        successRate: null,
        errorRate: null,
        modelPerformance: {}
    };
    
    // Calculate success rate from session data
    if (timeSeries.sessions.length > 0) {
        const totalSessions = timeSeries.sessions.length;
        const totalSuccess = timeSeries.sessions.filter(s => !s.isError).length;
        metrics.successRate = (totalSuccess / totalSessions * 100);
        metrics.errorRate = 100 - metrics.successRate;
    }
    
    // Model performance
    for (const [modelName, data] of Object.entries(timeSeries.models)) {
        metrics.modelPerformance[modelName] = {
            totalSessions: data.total,
            success: data.success,
            error: data.error,
            successRate: data.total > 0 ? (data.success / data.total * 100) : 0
        };
    }
    
    return metrics;
}

/**
 * Track skill adoption timeline
 */
function trackSkillAdoption(metrics) {
    const adoption = {
        skills: {},
        timeline: []
    };
    
    for (const daily of metrics) {
        if (daily.sources?.clawhub) {
            for (const install of daily.sources.clawhub) {
                const skill = install.skill || install.command?.match(/([\w-]+)$/)?.[0];
                if (skill) {
                    if (!adoption.skills[skill]) {
                        adoption.skills[skill] = 0;
                    }
                    adoption.skills[skill]++;
                    adoption.timeline.push({
                        timestamp: install.timestamp || new Date().toISOString(),
                        skill,
                        type: 'install'
                    });
                }
            }
        }
    }
    
    return adoption;
}

/**
 * Identify error patterns
 */
function identifyErrorPatterns(timeSeries) {
    const patterns = {
        byType: {},
        frequency: [],
        affectedAgents: []
    };
    
    // Group errors by type
    for (const error of timeSeries.errors) {
        const errorType = error.error || 'unknown';
        if (!patterns.byType[errorType]) {
            patterns.byType[errorType] = 0;
        }
        patterns.byType[errorType]++;
    }
    
    // Sort by frequency
    patterns.frequency = Object.entries(patterns.byType)
        .map(([error, count]) => ({ error, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
    
    return patterns;
}

/**
 * Extract lessons learned
 */
function extractLearnings(metrics) {
    const learnings = {
        entries: [],
        byDate: {}
    };
    
    for (const daily of metrics) {
        if (daily.sources?.learnings) {
            learnings.entries = [...learnings.entries, ...daily.sources.learnings];
        }
    }
    
    return learnings;
}

/**
 * Generate custom metrics
 */
function generateCustomMetrics(timeSeries) {
    const custom = {
        peakActivityHours: [],
        modelSwitching: [],
        learningVelocity: []
    };
    
    // Find peak activity hours
    const hours = Object.entries(timeSeries.hourly)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count);
    custom.peakActivityHours = hours.slice(0, 5);
    
    // Model switching frequency
    const models = Object.keys(timeSeries.models);
    custom.modelSwitching = {
        uniqueModels: models.length,
        mostUsed: models.length > 0 ? models[0] : null
    };
    
    return custom;
}

/**
 * Generate reports
 */
function generateReports(timeSeries, performanceMetrics, skillAdoption, errorPatterns, learnings, customMetrics) {
    const reports = {};
    
    // 1. Spawn History Report
    reports.spawnHistory = {
        title: 'Agent Spawn History',
        data: timeSeries.sessions,
        generated: new Date().toISOString()
    };
    
    // 2. Model Performance Comparison
    reports.modelPerformance = {
        title: 'Model Performance Comparison',
        data: performanceMetrics.modelPerformance,
        generated: new Date().toISOString()
    };
    
    // 3. Skill Adoption Timeline
    reports.skillAdoption = {
        title: 'Skill Adoption Timeline',
        skills: skillAdoption.skills,
        timeline: skillAdoption.timeline.slice(-50),
        generated: new Date().toISOString()
    };
    
    // 4. Error Pattern Analysis
    reports.errorPatterns = {
        title: 'Error Pattern Analysis',
        patterns: errorPatterns.frequency,
        byType: errorPatterns.byType,
        generated: new Date().toISOString()
    };
    
    // 5. Top Learnings
    reports.learnings = {
        title: 'Top Learnings',
        entries: learnings.entries.slice(-20),
        generated: new Date().toISOString()
    };
    
    // 6. Custom Metrics
    reports.customMetrics = {
        title: 'Custom Metrics',
        peakActivityHours: customMetrics.peakActivityHours,
        modelSwitching: customMetrics.modelSwitching,
        generated: new Date().toISOString()
    };
    
    // Write reports to files
    for (const [name, report] of Object.entries(reports)) {
        const file = path.join(REPORTS_DIR, `${name}.json`);
        fs.writeFileSync(file, JSON.stringify(report, null, 2));
        console.log(`[Aggregator] Generated report: ${file}`);
    }
    
    // Generate summary report
    const summary = {
        generated: new Date().toISOString(),
        performance: performanceMetrics,
        errorSummary: {
            totalErrors: timeSeries.errors.length,
        },
        customMetrics
    };
    fs.writeFileSync(path.join(REPORTS_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
    
    return reports;
}

/**
 * Main execution
 */
function main() {
    try {
        // Load daily metrics
        const dailyMetrics = loadDailyMetrics();
        console.log(`[Aggregator] Loaded ${dailyMetrics.length} daily metrics files`);
        
        if (dailyMetrics.length === 0) {
            console.log('[Aggregator] No daily metrics found. Skipping aggregation.');
            return;
        }
        
        // Create time-series data
        const timeSeries = createTimeSeries(dailyMetrics);
        console.log('[Aggregator] Created time-series data with', timeSeries.sessions.length, 'sessions');
        console.log('[Aggregator] Models found:', Object.keys(timeSeries.models).length);
        
        // Calculate performance metrics
        const performanceMetrics = calculatePerformanceMetrics(timeSeries);
        console.log('[Aggregator] Calculated performance metrics');
        console.log('[Aggregator] Success rate:', performanceMetrics.successRate?.toFixed(1) + '%');
        
        // Track skill adoption
        const skillAdoption = trackSkillAdoption(dailyMetrics);
        console.log('[Aggregator] Tracked skill adoption for', Object.keys(skillAdoption.skills).length, 'skills');
        
        // Identify error patterns
        const errorPatterns = identifyErrorPatterns(timeSeries);
        console.log('[Aggregator] Identified', errorPatterns.frequency.length, 'error patterns');
        
        // Extract learnings
        const learnings = extractLearnings(dailyMetrics);
        console.log('[Aggregator] Extracted', learnings.entries.length, 'learnings');
        
        // Generate custom metrics
        const customMetrics = generateCustomMetrics(timeSeries);
        console.log('[Aggregator] Generated custom metrics');
        
        // Generate reports
        const reports = generateReports(
            timeSeries,
            performanceMetrics,
            skillAdoption,
            errorPatterns,
            learnings,
            customMetrics
        );
        
        // Save aggregated time-series
        const aggregated = {
            timestamp: new Date().toISOString(),
            timeSeries,
            performanceMetrics,
            skillAdoption,
            errorPatterns,
            learnings,
            customMetrics
        };
        fs.writeFileSync(
            path.join(DATA_DIR, 'aggregated-metrics.json'),
            JSON.stringify(aggregated, null, 2)
        );
        console.log('[Aggregator] Saved aggregated metrics');
        
        console.log('[Aggregator] Aggregation complete!');
        console.log('[Aggregator] Reports saved to:', REPORTS_DIR);
        
    } catch (error) {
        console.error('[Aggregator] Error during aggregation:', error);
        process.exit(1);
    }
}

main();
