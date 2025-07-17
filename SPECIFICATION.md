# FEP Service Specification

## Overview

The Fuel Economy Payment (FEP) Service is a government program within the PDS 2.0 ecosystem responsible for processing benefit awards for eligible citizens. It issues benefit award verifiable credentials and consumes electric bill credentials from Northern Electric to determine benefit eligibility and amounts.

## Service Responsibilities

1. **User Management**
   - Maintain user accounts for FEP administrators
   - Authenticate users accessing the FEP service
   - Manage user roles and permissions

2. **DID Authentication**
   - Implement did:web document hosting
   - Handle challenge-response verification
   - Authenticate with Solid PDS using DID

3. **Credential Management**
   - Issue benefit award verifiable credentials
   - Verify electric bill credentials from Northern Electric
   - Verify debt relief eligibility credentials from DRO
   - Maintain audit logs of all credential operations

4. **Benefit Processing**
   - Calculate benefit amounts based on eligibility criteria
   - Process benefit applications
   - Track benefit awards and payments
   - Generate reports on benefit distribution

## API Endpoints

### DID Authentication

#### Get DID Document

- **Endpoint:** `GET /.well-known/did.json`
- **Description:** Retrieve the FEP service's DID document
- **Authentication:** None
- **Response:** DID document in JSON format

#### Generate Challenge Response

- **Endpoint:** `POST /auth/response`
- **Description:** Generate a signed response to an authentication challenge
- **Request Body:**
  ```json
  {
    "challenge": "string"
  }
  ```
- **Response:**
  ```json
  {
    "did": "did:web:fep.gov.uk",
    "challenge": "string",
    "signature": "string"
  }
  ```

### Credential Management

#### Issue Benefit Award Credential

- **Endpoint:** `POST /credentials/issue`
- **Description:** Issue a benefit award credential to a user
- **Authentication:** Required (Admin)
- **Request Body:**
  ```json
  {
    "userWebId": "string",
    "benefitData": {
      "fullName": "string",
      "dateOfBirth": "string",
      "nationalInsuranceNumber": "string",
      "benefitType": "string",
      "benefitAmount": "number",
      "awardStartDate": "string",
      "awardEndDate": "string",
      "paymentFrequency": "string"
    }
  }
  ```
- **Response:**
  ```json
  {
    "id": "string",
    "requestId": "string",
    "status": "pending|issued",
    "message": "string"
  }
  ```

#### Check Credential Status

- **Endpoint:** `GET /credentials/:credentialId/status`
- **Description:** Check the status of an issued credential
- **Authentication:** Required
- **Response:**
  ```json
  {
    "id": "string",
    "status": "valid|revoked|expired",
    "issuedAt": "string",
    "expiresAt": "string",
    "revokedAt": "string",
    "reason": "string"
  }
  ```

#### Verify Electric Bill Credential

- **Endpoint:** `POST /credentials/verify/electric-bill`
- **Description:** Verify an electric bill credential from Northern Electric
- **Authentication:** Required (Admin)
- **Request Body:**
  ```json
  {
    "userWebId": "string",
    "credentialId": "string"
  }
  ```
- **Response:**
  ```json
  {
    "verified": "boolean",
    "credential": {
      "id": "string",
      "issuer": "string",
      "issuanceDate": "string",
      "billAmount": "number",
      "billingPeriod": {
        "start": "string",
        "end": "string"
      }
    },
    "errors": ["string"]
  }
  ```

### Benefit Processing

#### Submit Benefit Application

- **Endpoint:** `POST /benefits/apply`
- **Description:** Submit a new benefit application
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "userWebId": "string",
    "applicantData": {
      "fullName": "string",
      "dateOfBirth": "string",
      "nationalInsuranceNumber": "string",
      "contactDetails": {
        "email": "string",
        "phone": "string",
        "address": {
          "line1": "string",
          "line2": "string",
          "city": "string",
          "postcode": "string"
        }
      }
    },
    "supportingDocuments": [
      {
        "type": "string",
        "credentialId": "string"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "applicationId": "string",
    "status": "received",
    "submittedAt": "string",
    "estimatedProcessingTime": "string"
  }
  ```

#### Check Application Status

- **Endpoint:** `GET /benefits/applications/:applicationId`
- **Description:** Check the status of a benefit application
- **Authentication:** Required
- **Response:**
  ```json
  {
    "applicationId": "string",
    "status": "received|processing|approved|rejected",
    "submittedAt": "string",
    "lastUpdated": "string",
    "decision": {
      "status": "string",
      "reason": "string",
      "benefitAmount": "number",
      "credentialId": "string"
    }
  }
  ```

### Administration

#### Get Benefit Statistics

- **Endpoint:** `GET /admin/stats`
- **Description:** Get statistics on benefit awards
- **Authentication:** Required (Admin)
- **Response:**
  ```json
  {
    "totalApplications": "number",
    "approved": "number",
    "rejected": "number",
    "pending": "number",
    "totalAmount": "number",
    "byMonth": [
      {
        "month": "string",
        "applications": "number",
        "approved": "number",
        "amount": "number"
      }
    ]
  }
  ```

## Data Models

### Benefit Award Credential

```json
{
  "id": "string",
  "type": "FuelEconomyPaymentAward",
  "issuer": "did:web:fep.gov.uk",
  "issuanceDate": "string",
  "expirationDate": "string",
  "revocationDate": "string",
  "revocationReason": "string",
  "status": "valid|revoked|expired",
  "subject": {
    "id": "string", // WebID
    "fullName": "string",
    "dateOfBirth": "string",
    "nationalInsuranceNumber": "string"
  },
  "credentialSubject": {
    "benefitType": "string",
    "benefitAmount": "number",
    "awardStartDate": "string",
    "awardEndDate": "string",
    "paymentFrequency": "string",
    "paymentMethod": "string"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "string",
    "verificationMethod": "string",
    "proofPurpose": "assertionMethod",
    "proofValue": "string"
  }
}
```

### Benefit Application

```json
{
  "id": "string",
  "applicant": {
    "webId": "string",
    "fullName": "string",
    "dateOfBirth": "string",
    "nationalInsuranceNumber": "string",
    "contactDetails": {
      "email": "string",
      "phone": "string",
      "address": {
        "line1": "string",
        "line2": "string",
        "city": "string",
        "postcode": "string"
      }
    }
  },
  "supportingDocuments": [
    {
      "type": "DebtReliefEligibility|ElectricBill",
      "credentialId": "string",
      "verified": "boolean",
      "verificationNotes": "string"
    }
  ],
  "status": "received|processing|approved|rejected",
  "decision": {
    "status": "string",
    "reason": "string",
    "benefitAmount": "number",
    "credentialId": "string",
    "decisionDate": "string",
    "decidedBy": "string"
  },
  "submittedAt": "string",
  "lastUpdated": "string"
}
```

## Dependencies

1. **External Services**
   - MongoDB: Data storage
   - Redis: Caching and session management
   - Solid PDS: For credential storage and user authorization
   - API Registry: Service registration

2. **Libraries**
   - pds-common: Shared utilities and DID helpers
   - jsonld-signatures: Verifiable credential signatures
   - did-resolver: DID resolution

## Configuration

The service requires the following environment variables:

```
# Server settings
PORT=3003
NODE_ENV=development

# Database settings
MONGODB_URI=mongodb://mongodb:27017/fep-service
REDIS_URL=redis://redis:6379

# DID settings
DID_WEB_DOMAIN=fep.gov.uk
PRIVATE_KEY_PATH=/app/keys/private.key

# PDS settings
SOLID_PDS_URL=http://solid-pds:3000
OIDC_CLIENT_ID=fep-service
OIDC_CLIENT_SECRET=your-client-secret

# API Registry settings
API_REGISTRY_URL=http://api-registry:3005
API_REGISTRY_KEY=your-api-key
```

## Deployment

The service can be deployed using Docker:

```bash
docker build -t fep-service .
docker run -p 3003:3003 -v /path/to/keys:/app/keys --env-file .env fep-service
```

For local development, the service can be run with:

```bash
npm install
npm run dev
```

## Testing

The service includes unit and integration tests:

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration
```

## Error Handling

All errors follow the standardized error format defined in PDS specifications:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

Common error codes:
- `auth/unauthorized`: Unauthorized access
- `application/invalid`: Invalid application data
- `credential/verification-failed`: Credential verification failed
- `credential/issuance-failed`: Credential issuance failed
- `pds/connection-error`: Error connecting to PDS

## Security Considerations

1. All API endpoints are secured with appropriate authentication
2. Personal data is encrypted at rest and in transit
3. Credential signatures use cryptographically secure algorithms
4. Private keys are stored securely and never exposed
5. All operations are logged for audit purposes
6. Regular security assessments are conducted
