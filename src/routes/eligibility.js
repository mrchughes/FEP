/**
 * Eligibility Routes for FEP Service
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticateJWT, authorizeRole } = require('../middleware');

// Mock database for eligibility records
const eligibilityRecords = [];

// Check eligibility
router.post('/check', authenticateJWT, (req, res) => {
    const {
        did,
        nationalInsuranceNumber,
        income,
        assets,
        dependents,
        benefitsClaimed
    } = req.body;

    if (!did || !nationalInsuranceNumber) {
        return res.status(400).json({
            error: {
                code: 'eligibility/missing-parameters',
                message: 'DID and National Insurance Number are required'
            }
        });
    }

    // Calculate eligibility based on financial information
    // This is a simplified example - real implementation would have more complex logic
    const totalIncome = (income?.annual || 0) + (income?.monthly || 0) * 12;
    const totalAssets = (assets?.savings || 0) + (assets?.investments || 0) + (assets?.property || 0);
    const dependentCount = dependents?.length || 0;

    // Basic eligibility check logic
    const incomeThreshold = 16000 + (dependentCount * 2000);
    const assetThreshold = 6000 + (dependentCount * 1000);

    const isEligible = (totalIncome <= incomeThreshold) &&
        (totalAssets <= assetThreshold) ||
        (benefitsClaimed?.includes('Universal Credit') ||
            benefitsClaimed?.includes('Income Support'));

    // Calculate score (0-100) based on how far below thresholds they are
    let score = 0;
    if (isEligible) {
        const incomeScore = Math.min(100, Math.max(0, 100 - (totalIncome / incomeThreshold * 100)));
        const assetScore = Math.min(100, Math.max(0, 100 - (totalAssets / assetThreshold * 100)));
        score = Math.round((incomeScore + assetScore) / 2);

        // Boost score for benefit claimants
        if (benefitsClaimed?.length > 0) {
            score = Math.min(100, score + 10);
        }
    }

    // Create eligibility record
    const recordId = uuidv4();
    const timestamp = new Date();

    const eligibilityRecord = {
        id: recordId,
        did,
        nationalInsuranceNumber,
        timestamp,
        isEligible,
        score,
        expiresAt: new Date(timestamp.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
        financialSummary: {
            income: totalIncome,
            assets: totalAssets,
            dependents: dependentCount,
            benefitsClaimed: benefitsClaimed || []
        }
    };

    // Store record
    eligibilityRecords.push(eligibilityRecord);

    res.status(201).json({
        id: recordId,
        timestamp,
        isEligible,
        score,
        expiresAt: eligibilityRecord.expiresAt
    });
});

// Get eligibility record
router.get('/:recordId', authenticateJWT, (req, res) => {
    const { recordId } = req.params;

    const record = eligibilityRecords.find(r => r.id === recordId);

    if (!record) {
        return res.status(404).json({
            error: {
                code: 'eligibility/not-found',
                message: 'Eligibility record not found'
            }
        });
    }

    // Check if user is authorized to view this record
    const isOwner = record.did === req.user.did;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            error: {
                code: 'auth/insufficient-permissions',
                message: 'Not authorized to view this record'
            }
        });
    }

    res.json({
        id: record.id,
        timestamp: record.timestamp,
        isEligible: record.isEligible,
        score: record.score,
        expiresAt: record.expiresAt,
        financialSummary: isAdmin ? record.financialSummary : undefined
    });
});

// Issue eligibility credential
router.post('/:recordId/issue-credential', authenticateJWT, (req, res) => {
    const { recordId } = req.params;

    const record = eligibilityRecords.find(r => r.id === recordId);

    if (!record) {
        return res.status(404).json({
            error: {
                code: 'eligibility/not-found',
                message: 'Eligibility record not found'
            }
        });
    }

    // Check if record is eligible
    if (!record.isEligible) {
        return res.status(400).json({
            error: {
                code: 'eligibility/not-eligible',
                message: 'Cannot issue credential for ineligible record'
            }
        });
    }

    // Check if user is authorized
    const isOwner = record.did === req.user.did;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            error: {
                code: 'auth/insufficient-permissions',
                message: 'Not authorized to issue credential for this record'
            }
        });
    }

    // Create credential
    const credentialId = uuidv4();
    const issuedAt = new Date();

    const credential = {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.gov.uk/schemas/fep/v1"
        ],
        "id": `https://fep.gov.uk/credentials/${credentialId}`,
        "type": ["VerifiableCredential", "FinancialEligibilityCredential"],
        "issuer": "did:web:fep.gov.uk",
        "issuanceDate": issuedAt.toISOString(),
        "expirationDate": record.expiresAt.toISOString(),
        "credentialSubject": {
            "id": record.did,
            "eligibilityScore": record.score,
            "eligibilityVerified": true,
            "eligibilityLevel": record.score >= 75 ? "high" : record.score >= 50 ? "medium" : "low",
            "validFrom": issuedAt.toISOString(),
            "validUntil": record.expiresAt.toISOString()
        },
        "proof": {
            "type": "Ed25519Signature2020",
            "created": issuedAt.toISOString(),
            "verificationMethod": "did:web:fep.gov.uk#key-1",
            "proofPurpose": "assertionMethod",
            "proofValue": "mockSignatureValue"
        }
    };

    // Update record with credential info
    record.credential = {
        id: credentialId,
        issuedAt
    };

    res.json({
        id: credentialId,
        issuedAt,
        credential
    });
});

// Get credential status
router.get('/credentials/:credentialId/status', (req, res) => {
    const { credentialId } = req.params;

    // Find record with this credential
    const record = eligibilityRecords.find(r => r.credential && r.credential.id === credentialId);

    if (!record) {
        return res.status(404).json({
            error: {
                code: 'credential/not-found',
                message: 'Credential not found'
            }
        });
    }

    const isValid = new Date() < record.expiresAt;

    res.json({
        id: credentialId,
        status: isValid ? 'valid' : 'expired',
        issuedAt: record.credential.issuedAt,
        expiresAt: record.expiresAt
    });
});

module.exports = router;
