/**
 * Financial Eligibility Passport (FEP) Service for PDS 2.0
 * 
 * Provides eligibility verification and financial passport credentials.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { publishApiSpec } = require('./services/apiRegistryService');

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Load routes
const didRoutes = require('./routes/did');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const eligibilityRoutes = require('./routes/eligibility');
const adminRoutes = require('./routes/admin');

// Register routes
app.use('/did', didRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/eligibility', eligibilityRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'fep-service',
        version: process.env.SERVICE_VERSION || '1.0.0'
    });
});

// Serve DID document
app.get('/.well-known/did.json', (req, res) => {
    // In production, this would be loaded from a secure storage
    res.json({
        "@context": ["https://www.w3.org/ns/did/v1"],
        "id": `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}`,
        "verificationMethod": [{
            "id": `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}#key-1`,
            "type": "Ed25519VerificationKey2020",
            "controller": `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}`,
            "publicKeyJwk": {
                // This would be the actual public key in production
                "kty": "OKP",
                "crv": "Ed25519",
                "x": "example-public-key-data"
            }
        }],
        "authentication": [
            `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}#key-1`
        ],
        "assertionMethod": [
            `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}#key-1`
        ]
    });
});

// Start server
app.listen(port, () => {
    console.log(`FEP Service listening on port ${port}`);

    // Publish API specification to API Registry
    publishApiSpec().catch(err => {
        console.error('Error publishing API specification:', err.message);
    });
});
const didRoutes = require('./routes/did');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const eligibilityRoutes = require('./routes/eligibility');
const adminRoutes = require('./routes/admin');

// Register routes
app.use('/did', didRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/eligibility', eligibilityRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'fep-service',
        version: process.env.SERVICE_VERSION || '1.0.0'
    });
});

// Serve DID document
app.get('/.well-known/did.json', (req, res) => {
    // In production, this would be loaded from a secure storage
    res.json({
        "@context": ["https://www.w3.org/ns/did/v1"],
        "id": `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}`,
        "verificationMethod": [{
            "id": `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}#key-1`,
            "type": "Ed25519VerificationKey2020",
            "controller": `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}`,
            "publicKeyJwk": {
                // This would be the actual public key in production
                "kty": "OKP",
                "crv": "Ed25519",
                "x": "example-public-key-data"
            }
        }],
        "authentication": [
            `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}#key-1`
        ],
        "assertionMethod": [
            `did:web:${process.env.DID_WEB_DOMAIN || req.hostname}#key-1`
        ]
    });
});

// Start server
app.listen(port, () => {
    console.log(`FEP Service listening on port ${port}`);

    // Publish API specification to API Registry
    publishApiSpec().catch(err => {
        console.error('Error publishing API specification:', err.message);
    });
});
