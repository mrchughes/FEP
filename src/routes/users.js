/**
 * Users Routes for FEP Service
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticateJWT, authorizeRole } = require('../middleware');

// Mock user database
const users = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    did: 'did:web:admin.example.com',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com'
    }
  },
  {
    id: '2',
    username: 'user',
    role: 'user',
    did: 'did:web:user.example.com',
    profile: {
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com'
    }
  }
];

// Get current user profile
router.get('/me', authenticateJWT, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({
      error: {
        code: 'user/not-found',
        message: 'User not found'
      }
    });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    did: user.did,
    profile: user.profile
  });
});

// Update current user profile
router.patch('/me', authenticateJWT, (req, res) => {
  const { profile } = req.body;
  
  if (!profile) {
    return res.status(400).json({
      error: {
        code: 'user/invalid-request',
        message: 'Profile data is required'
      }
    });
  }
  
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        code: 'user/not-found',
        message: 'User not found'
      }
    });
  }
  
  // Update profile
  users[userIndex].profile = {
    ...users[userIndex].profile,
    ...profile
  };
  
  res.json({
    id: users[userIndex].id,
    username: users[userIndex].username,
    role: users[userIndex].role,
    did: users[userIndex].did,
    profile: users[userIndex].profile
  });
});

// Link DID to user
router.post('/link-did', authenticateJWT, (req, res) => {
  const { did, proof } = req.body;
  
  if (!did || !proof) {
    return res.status(400).json({
      error: {
        code: 'user/missing-parameters',
        message: 'DID and proof are required'
      }
    });
  }
  
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        code: 'user/not-found',
        message: 'User not found'
      }
    });
  }
  
  // In a real implementation, this would verify the proof
  // For now, we'll just update the DID
  
  users[userIndex].did = did;
  
  res.json({
    id: users[userIndex].id,
    username: users[userIndex].username,
    did: users[userIndex].did
  });
});

// Get all users (admin only)
router.get('/', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    did: u.did
  })));
});

// Get user by ID (admin only)
router.get('/:userId', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  const { userId } = req.params;
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: {
        code: 'user/not-found',
        message: 'User not found'
      }
    });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    did: user.did,
    profile: user.profile
  });
});

// Create new user (admin only)
router.post('/', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  const { username, password, role, profile } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      error: {
        code: 'user/missing-parameters',
        message: 'Username and password are required'
      }
    });
  }
  
  // Check if username is already taken
  if (users.some(u => u.username === username)) {
    return res.status(400).json({
      error: {
        code: 'user/username-taken',
        message: 'Username is already taken'
      }
    });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    username,
    password,
    role: role || 'user',
    profile: profile || {},
    did: null
  };
  
  users.push(newUser);
  
  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role
  });
});

module.exports = router;
