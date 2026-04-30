# Security Design

## JWT Authentication

JWT authentication is implemented in Phase 10 using Spring Security and a stateless bearer-token flow.

Authentication flow:

1. User submits email and password to the login endpoint.
2. Backend validates credentials.
3. Backend returns a JWT access token.
4. Client sends the access token in the `Authorization` header.
5. Backend validates the token for protected endpoints.
6. User role is used to enforce authorization rules.

Example header:

```text
Authorization: Bearer <token>
```

The token includes:

- user email as the subject
- user role
- issued-at timestamp
- expiration timestamp

JWT signing uses HMAC SHA-256. The signing secret must be provided through an environment variable:

```text
QAMS_JWT_SECRET
```

Optional expiration override:

```text
QAMS_JWT_EXPIRATION_MS
```

The default token expiration is 24 hours.

## Auth Endpoints

```text
POST /api/auth/register
POST /api/auth/login
```

### Register

Creates a user with one of these roles:

- `ADMIN`
- `TESTER`
- `DEVELOPER`

Passwords are encrypted with BCrypt before storage.

### Login

Authenticates a user with email and password and returns a JWT token.

## Role-Based Access Control

The system uses role-based access control to restrict sensitive actions.

Implemented access rules:

- `/api/auth/**` is public.
- Swagger/OpenAPI paths are public when present.
- All other endpoints require authentication.
- Admin-only access is applied to project and module management actions.
- Tester access is applied to test case, test execution, defect, test suite, and test plan management actions.
- Developer access is allowed for defect status updates.

## Roles

### ADMIN

Can manage users, projects, modules, roles, system configuration, and all QA records.

### TESTER

Can create and maintain test cases, suites, test plans, executions, and defects.

### DEVELOPER

Can view defects, update defect status, add technical notes, and collaborate with testers.

## Password Security

Passwords should be hashed using a secure password encoder such as BCrypt before storage.

Plain text passwords must never be stored or logged.

## Future Security Tasks

- Add refresh tokens.
- Add logout/token revocation.
- Add user management endpoints for admins.
- Add stricter ownership checks for developer defect visibility.
- Add OAuth2 or SSO if required later.
