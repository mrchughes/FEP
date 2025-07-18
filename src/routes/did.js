/**
 * DID Routes for FEP Service
 */

const express = require('express');
const router = express.Router();

// DID challenge route
router.post('/challenge', (req, res) => {
    const challenge = Buffer.from(Math.random().toString()).toString('base64');

    // In a real implementation, this would be stored with a TTL
    // For now, we'll just return it
    res.json({
        challenge,
        expires: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    });
});

// DID verification route
router.post('/verify', (req, res) => {
    const { did, challenge, signature } = req.body;

    if (!did || !challenge || !signature) {
        return res.status(400).json({
            error: {
                code: 'did/missing-parameters',
                message: 'DID, challenge, and signature are required'
            }
        });
    }

    // In a real implementation, this would verify the signature against the challenge
    // For now, we'll just pretend it worked

    res.json({
        verified: true,
        did
    });
});

module.exports = router;
