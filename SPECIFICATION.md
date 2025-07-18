# FEP Service Specification

## Overview

The Funeral Expense Payment (FEP) Service is a government program within the PDS 2.0 ecosystem responsible for processing benefit awards for eligible citizens. It issues benefit award verifiable credentials and consumes electric bill credentials from Northern Electric to determine benefit eligibility and amounts.

## Microservice Architecture Requirements

As part of the PDS 2.0 ecosystem, the FEP service follows these architectural principles:

1. **Loose Coupling**: 
   - Operates as an independent microservice with clear boundaries
   - Communicates with other services only through well-defined APIs
   - Does not share databases or internal data structures with other services
   - Uses the API Registry for service discovery

2. **Complete Implementation**:
   - All endpoints must be fully implemented with no placeholders
   - Error handling must follow the PDS error handling standards
   - All required functionality must be present before deployment

3. **API Publication**:
   - Must publish its OpenAPI specification to the API Registry on startup
   - Must keep its API documentation current and accurate
   - Should version its API appropriately using semantic versioning

4. **GOV.UK Design System Compliance**:
   - All user interfaces must comply with the GOV.UK Design System
   - Must meet WCAG 2.1 AA accessibility standards
   - Must follow GOV.UK content design guidelines
   - Error messages must follow GOV.UK standards

## Service Responsibilities

1. **User Management**
   - Maintain user accounts for FEP administrators
   - Authenticate users accessing the FEP service
   - Manage user roles and permissions

2. **Service Identity**
   - Maintain a DID (did:web) for service identification
   - Provide cryptographic proof of domain ownership
   - Support verification of issued credentials

3. **Credential Management**
   - Issue benefit award verifiable credentials
   - Verify electric bill credentials from Northern Electric
   - Verify birth and marriage certificate credentials from DRO
   - Maintain audit logs of all credential operations

4. **Benefit Processing**
   - Calculate benefit amounts based on eligibility criteria
   - Process benefit applications
   - Track benefit awards and payments
   - Generate reports on benefit distribution

## API Endpoints

### Authentication

#### User Login

- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate a user with the FEP service
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  }
  ```

#### Refresh Token

- **Endpoint:** `POST /auth/refresh`
- **Description:** Get a new access token using a refresh token
- **Request Body:**
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "expiresIn": "number"
  }
  ```

#### User Registration

- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user account with the FEP service
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string"
  }
  ```

#### Password Reset Request

- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Initiate password reset process
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset email sent"
  }
  ```

#### Password Reset Completion

- **Endpoint:** `POST /auth/reset-password`
- **Description:** Complete password reset with token
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

### Service Identity

#### Get DID Document

- **Endpoint:** `GET /.well-known/did.json`
- **Description:** Retrieve the FEP service's DID document for verification
- **Authentication:** None
- **Response:** DID document in JSON format

#### Handle PDS Challenge

- **Endpoint:** `POST /.well-known/did/challenge`
- **Description:** Handle challenge-response verification from PDS for domain ownership
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "challenge": "string",
    "nonce": "string"
  }
  ```
- **Response:**
  ```json
  {
    "signature": "string",
    "timestamp": "string"
  }
  ```

### PDS Integration

#### Register Service with PDS

- **Endpoint:** `POST /pds/register`
- **Description:** Register this FEP service with a PDS as both publisher and consumer
- **Authentication:** Required (Admin JWT)
- **Request Body:**
  ```json
  {
    "pdsUrl": "string",
    "serviceDid": "string",
    "domain": "string",
    "capabilities": ["publish", "consume"]
  }
  ```
- **Response:**
  ```json
  {
    "registrationId": "string",
    "status": "pending",
    "verificationRequired": true
  }
  ```

#### Request PDS Access Token

- **Endpoint:** `POST /pds/token`
- **Description:** Request OAuth access and refresh tokens from PDS using service DID
- **Authentication:** Required (Admin JWT)
- **Request Body:**
  ```json
  {
    "pdsUrl": "string",
    "serviceDid": "string",
    "scopes": ["read", "write"]
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": "number",
    "scope": "string"
  }
  ```

### Credential Management

#### Issue Benefit Award Credential

- **Endpoint:** `POST /credentials/issue`
- **Description:** Issue a benefit award credential to a user
- **Authentication:** Required (Admin JWT)
- **Request Body:**
  ```json
  {
    "userDid": "string",
    "pdsUrl": "string",
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
- **Authentication:** Required (JWT)
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
- **Authentication:** Required (Admin JWT)
- **Request Body:**
  ```json
  {
    "userDid": "string",
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
- **Authentication:** Required (JWT)
- **Request Body:**
  ```json
  {
    "userDid": "string",
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
- **Authentication:** Required (JWT)
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

### User DID Management

#### Verify User DID Ownership

- **Endpoint:** `POST /users/verify-did`
- **Description:** Verify a user's ownership of a DID with their PDS
- **Authentication:** Required (User JWT)
- **Request Body:**
  ```json
  {
    "did": "string",
    "pdsUrl": "string"
  }
  ```
- **Response:**
  ```json
  {
    "requestId": "string",
    "status": "pending",
    "expiresAt": "string"
  }
  ```

#### Check DID Verification Status

- **Endpoint:** `GET /users/verify-did/:requestId`
- **Description:** Check the status of a DID verification request
- **Authentication:** Required (User JWT)
- **Response:**
  ```json
  {
    "requestId": "string",
    "status": "pending|verified|failed",
    "did": "string",
    "verifiedAt": "string"
  }
  ```

#### Bind Verified DID to User Account

- **Endpoint:** `POST /users/bind-did`
- **Description:** Permanently bind a verified DID to the user's account
- **Authentication:** Required (User JWT)
- **Request Body:**
  ```json
  {
    "did": "string",
    "verificationId": "string"
  }
  ```
- **Response:**
  ```json
  {
    "userId": "string",
    "did": "string",
    "boundAt": "string",
    "status": "active"
  }
  ```

### Administration

#### Get Benefit Statistics

- **Endpoint:** `GET /admin/stats`
- **Description:** Get statistics on benefit awards
- **Authentication:** Required (Admin JWT)
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

### User DID Binding

```json
{
  "id": "string",
  "userId": "string",
  "did": "string",
  "pdsUrl": "string",
  "verificationRequestId": "string",
  "verificationStatus": "pending|verified|failed",
  "verifiedAt": "string",
  "boundAt": "string",
  "lastCheckedAt": "string",
  "status": "active|revoked",
  "revokedAt": "string",
  "revokedReason": "string"
}
```

## Development Approach

### API-First Design

- All endpoints must be designed and documented using OpenAPI 3.0 before implementation
- API specifications must be stored in the `/specifications` directory
- Changes to the API must be documented and versioned appropriately
- API design must follow RESTful principles and standard HTTP methods

### Test-Driven Development

- All functionality must have corresponding unit and integration tests
- Test coverage should meet or exceed 80% for all critical paths
- Mock services should be used to test integration points
- End-to-end tests should verify the complete benefit application journey

### Cross-Service Integration

- All interactions with other services must be implemented using the API Registry
- Must integrate with Northern Electric for utility bill verification
- Must integrate with DRO for birth and marriage certificate verification
- Services should gracefully handle unavailability of dependent services
- Retry mechanisms should be implemented for transient failures
- Circuit breakers should be used to prevent cascading failures

## Integration Points

### API Registry Integration

- Service must register with the API Registry on startup
- Must publish OpenAPI specification to the registry
- Must use the API Registry to discover other services
- Should update the registry when service status changes

### Other Service Dependencies

| Service | Dependency Type | Purpose |
|---------|----------------|---------|
| Identity Provider Service | Authentication | User authentication for accessing the service |
| API Registry | Service Discovery | Locating and accessing other services |
| Solid PDS | Data Storage | Storing and retrieving user credentials |
| DRO | Credential Verification | Verifying birth and marriage certificate credentials |
| Northern Electric | Credential Verification | Verifying electric bill credentials |

## Monitoring and Observability

- Must implement health check endpoint (`/health`)
- Must expose metrics endpoint (`/metrics`) for Prometheus
- Must implement structured logging
- Should include trace IDs in logs for distributed tracing
- Should implement performance monitoring for benefit processing
- Should track metrics on benefit application processing times and approval rates

## Deployment and Scalability

- Service must be containerized using Docker
- Must support horizontal scaling
- Must be stateless or manage state externally
- Configuration should be environment-based
- Should support zero-downtime deployments
- Should implement queuing for benefit processing to handle high volumes

## Dependencies

1. **External Services**
   - MongoDB: Data storage
   - Redis: Caching and session management
   - API Registry: Service registration

2. **Libraries**
   - pds-common: Shared utilities and DID helpers
   - jsonld-signatures: Verifiable credential signatures
   - did-resolver: DID resolution
   - jsonwebtoken: JWT authentication

## Configuration

The service requires the following environment variables:

```
# Server settings
PORT=3003
NODE_ENV=development

# Database settings
MONGODB_URI=mongodb://mongodb:27017/fep-service
REDIS_URL=redis://redis:6379

# JWT Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# DID settings (for Verifiable Credentials)
DID_WEB_DOMAIN=fep.gov.uk
PRIVATE_KEY_PATH=/app/keys/private.key

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
- `auth/invalid-token`: Invalid JWT token
- `application/invalid`: Invalid application data
- `credential/verification-failed`: Credential verification failed
- `credential/issuance-failed`: Credential issuance failed

## Security Considerations

1. All API endpoints are secured with appropriate authentication
2. Personal data is encrypted at rest and in transit
3. Credential signatures use cryptographically secure algorithms
4. Private keys are stored securely and never exposed
5. All operations are logged for audit purposes
6. Regular security assessments are conducted
