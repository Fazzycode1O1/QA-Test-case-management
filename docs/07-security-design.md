# Security Design

## JWT Authentication Plan

JWT authentication is planned but not implemented yet.

Future authentication flow:

1. User submits email and password to the login endpoint.
2. Backend validates credentials.
3. Backend returns an access token and optionally a refresh token.
4. Client sends the access token in the `Authorization` header.
5. Backend validates the token for protected endpoints.
6. User role is used to enforce authorization rules.

Example future header:

```text
Authorization: Bearer <token>
```

## Role-Based Access Control

The system will use role-based access control to restrict sensitive actions.

Planned access rules:

- Admin-only access for user management and project configuration.
- Tester access for test case creation, test execution, and defect reporting.
- Developer access for viewing and updating assigned defects.
- Shared read access for project and dashboard information where appropriate.

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

- Add authentication DTOs.
- Add user entity and role enum.
- Add password encoder configuration.
- Add JWT utility service.
- Add authentication filter.
- Add security exception handling.
- Add method-level authorization where needed.

