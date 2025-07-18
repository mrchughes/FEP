/**
 * Admin Routes for FEP Service
 */

const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require('../middleware');

// Mock audit log
const auditLog = [];

// Get system status
router.get('/status', authenticateJWT, authorizeRole(['admin']), (req, res) => {
    // In a real implementation, this would check various system metrics
    const systemStatus = {
        service: 'fep-service',
        version: process.env.SERVICE_VERSION || '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development',
        connections: {
            apiRegistry: true,
            database: true,
            authService: true
        },
        lastDeployment: '2023-06-15T10:30:00Z',
        certificateExpirations: {
            serviceCert: '2024-12-31T23:59:59Z',
            didKey: '2024-12-31T23:59:59Z'
        }
    };

    res.json(systemStatus);
});

// Get audit log
router.get('/audit-log', authenticateJWT, authorizeRole(['admin']), (req, res) => {
    const { limit = 100, offset = 0, action } = req.query;

    let filteredLogs = [...auditLog];

    // Filter by action if provided
    if (action) {
        filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // Paginate results
    const paginatedLogs = filteredLogs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
        total: filteredLogs.length,
        offset: parseInt(offset),
        limit: parseInt(limit),
        logs: paginatedLogs
    });
});

// Add audit log entry
router.post('/audit-log', authenticateJWT, (req, res) => {
    const { action, details } = req.body;

    if (!action) {
        return res.status(400).json({
            error: {
                code: 'admin/missing-parameters',
                message: 'Action is required'
            }
        });
    }

    const logEntry = {
        id: auditLog.length + 1,
        timestamp: new Date().toISOString(),
        userId: req.user.id,
        username: req.user.username,
        action,
        details: details || {},
        ipAddress: req.ip
    };

    auditLog.push(logEntry);

    res.status(201).json(logEntry);
});

// Update system configuration
router.patch('/config', authenticateJWT, authorizeRole(['admin']), (req, res) => {
    const { key, value } = req.body;

    if (!key || value === undefined) {
        return res.status(400).json({
            error: {
                code: 'admin/missing-parameters',
                message: 'Configuration key and value are required'
            }
        });
    }

    // In a real implementation, this would update a configuration store
    // For now, we'll just acknowledge the request

    // Add to audit log
    auditLog.push({
        id: auditLog.length + 1,
        timestamp: new Date().toISOString(),
        userId: req.user.id,
        username: req.user.username,
        action: 'update-config',
        details: { key, value },
        ipAddress: req.ip
    });

    res.json({
        key,
        value,
        updated: true,
        timestamp: new Date().toISOString()
    });
});

// Generate system report
router.get('/reports/:reportType', authenticateJWT, authorizeRole(['admin']), (req, res) => {
    const { reportType } = req.params;
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
        return res.status(400).json({
            error: {
                code: 'admin/missing-parameters',
                message: 'Start date and end date are required'
            }
        });
    }

    // Generate mock report data based on report type
    let reportData;

    switch (reportType) {
        case 'eligibility':
            reportData = {
                title: 'Eligibility Report',
                period: { startDate, endDate },
                summary: {
                    totalChecks: 324,
                    eligibleCount: 189,
                    ineligibleCount: 135,
                    avgEligibilityScore: 67.4
                },
                breakdown: {
                    byDay: [
                        { date: '2023-06-15', checks: 42, eligible: 24, ineligible: 18 },
                        { date: '2023-06-16', checks: 53, eligible: 31, ineligible: 22 },
                        { date: '2023-06-17', checks: 48, eligible: 29, ineligible: 19 }
                    ],
                    byEligibilityLevel: [
                        { level: 'high', count: 87 },
                        { level: 'medium', count: 102 },
                        { level: 'low', count: 135 }
                    ]
                }
            };
            break;

        case 'users':
            reportData = {
                title: 'User Activity Report',
                period: { startDate, endDate },
                summary: {
                    totalUsers: 342,
                    activeUsers: 187,
                    newUsers: 45
                },
                breakdown: {
                    byDay: [
                        { date: '2023-06-15', active: 78, new: 12 },
                        { date: '2023-06-16', active: 92, new: 15 },
                        { date: '2023-06-17', active: 83, new: 18 }
                    ],
                    byRole: [
                        { role: 'citizen', count: 312 },
                        { role: 'adviser', count: 20 },
                        { role: 'admin', count: 10 }
                    ]
                }
            };
            break;

        default:
            return res.status(400).json({
                error: {
                    code: 'admin/invalid-report-type',
                    message: 'Invalid report type'
                }
            });
    }

    res.json({
        reportType,
        generatedAt: new Date().toISOString(),
        data: reportData
    });
});

module.exports = router;
