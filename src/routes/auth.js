/**
 * Auth Routes for FEP Service
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware');

// Mock user database
const users = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        did: 'did:web:admin.example.com'
    },
    {
        id: '2',
        username: 'user',
        password: 'user123',
        role: 'user',
        did: 'did:web:user.example.com'
    }
];

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: {
                code: 'auth/missing-credentials',
                message: 'Username and password are required'
            }
        });
    }

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({
            error: {
                code: 'auth/invalid-credentials',
                message: 'Invalid username or password'
            }
        });
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// Token refresh
router.post('/refresh', authenticateJWT, (req, res) => {
    // Generate new JWT
    const token = jwt.sign(
        { id: req.user.id, username: req.user.username, role: req.user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        }
    });
});

// Logout (just a placeholder, as JWTs are stateless)
router.post('/logout', authenticateJWT, (req, res) => {
    // In a real implementation with refresh tokens, this would invalidate tokens
    res.json({
        message: 'Successfully logged out'
    });
});

module.exports = router;
