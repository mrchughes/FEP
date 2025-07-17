/**
 * Middleware for FEP Service
 */

const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        return res.status(401).json({
          error: {
            code: 'auth/invalid-token',
            message: 'Invalid token'
          }
        });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      error: {
        code: 'auth/missing-token',
        message: 'Authentication token is required'
      }
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'auth/unauthorized',
          message: 'User not authenticated'
        }
      });
    }

    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        error: {
          code: 'auth/insufficient-permissions',
          message: 'Insufficient permissions'
        }
      });
    }
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Determine if this is a known error type
  if (err.type && err.code) {
    return res.status(err.status || 500).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  // Default error response
  res.status(500).json({
    error: {
      code: 'server/internal-error',
      message: 'An internal server error occurred'
    }
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, ip } = req;
  
  console.log(`[${timestamp}] ${method} ${url} from ${ip}`);
  
  // Add response logging
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[${timestamp}] Response ${res.statusCode} for ${method} ${url}`);
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = {
  authenticateJWT,
  authorizeRole,
  errorHandler,
  requestLogger
};
