# API Documentation

## Initial API Endpoint Plan

The Phase 3 test case endpoints are implemented under:

```text
/api
```

API responses should use consistent response structures, validation messages, and error formats.

Future API versions may use a versioned path such as `/api/v1`.

## Auth Endpoints

JWT is planned for a later phase. These endpoints are listed as the intended API shape only.

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Project Endpoints

The following endpoints are implemented in Phase 4.

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

### Create Project

```text
POST /api/projects
```

Request body:

```json
{
  "name": "QA Management System",
  "description": "Internal QA tracking platform.",
  "status": "ACTIVE"
}
```

Validation rules:

- `name` is required.
- `description` is optional.
- `status` is optional and defaults to `ACTIVE` when empty.

### Update Project

```text
PUT /api/projects/{id}
```

Uses the same request body and validation rules as create.

### Project Response

```json
{
  "id": 1,
  "name": "QA Management System",
  "description": "Internal QA tracking platform.",
  "status": "ACTIVE",
  "createdAt": "2026-04-30T23:30:00",
  "updatedAt": "2026-04-30T23:30:00"
}
```

## Module Endpoints

The following endpoints are implemented in Phase 4.

```text
POST   /api/modules
GET    /api/modules
GET    /api/modules/{id}
GET    /api/modules/project/{projectId}
PUT    /api/modules/{id}
DELETE /api/modules/{id}
```

### Create Module

```text
POST /api/modules
```

Request body:

```json
{
  "name": "Authentication",
  "description": "Login, registration, and account access features.",
  "projectId": 1
}
```

Validation rules:

- `name` is required.
- `description` is optional.
- `projectId` is required and must refer to an existing project.

### Update Module

```text
PUT /api/modules/{id}
```

Uses the same request body and validation rules as create.

### Get Modules by Project

```text
GET /api/modules/project/{projectId}
```

Returns all modules that belong to the given project.

### Module Response

```json
{
  "id": 1,
  "name": "Authentication",
  "description": "Login, registration, and account access features.",
  "projectId": 1,
  "projectName": "QA Management System",
  "createdAt": "2026-04-30T23:30:00",
  "updatedAt": "2026-04-30T23:30:00"
}
```

## Test Case Endpoints

The following endpoints are implemented in Phase 3.

```text
POST   /api/test-cases
GET    /api/test-cases
GET    /api/test-cases/{id}
PUT    /api/test-cases/{id}
DELETE /api/test-cases/{id}
```

### Create Test Case

```text
POST /api/test-cases
```

Request body:

```json
{
  "title": "Verify user login with valid credentials",
  "description": "Checks that a registered user can sign in successfully.",
  "preconditions": "User account already exists.",
  "steps": "1. Open login page\n2. Enter valid email and password\n3. Click login",
  "expectedResult": "User is redirected to the dashboard.",
  "priority": "HIGH",
  "moduleId": 1,
  "createdByUserId": 1
}
```

Validation rules:

- `title` is required.
- `steps` is required.
- `expectedResult` is required.
- `priority` is required and must be a valid `TestPriority` enum value.
- `moduleId` is required.
- `createdByUserId` is required.

### Update Test Case

```text
PUT /api/test-cases/{id}
```

Uses the same request body and validation rules as create.

### Test Case Response

```json
{
  "id": 1,
  "title": "Verify user login with valid credentials",
  "description": "Checks that a registered user can sign in successfully.",
  "preconditions": "User account already exists.",
  "steps": "1. Open login page\n2. Enter valid email and password\n3. Click login",
  "expectedResult": "User is redirected to the dashboard.",
  "priority": "HIGH",
  "status": "PENDING",
  "moduleId": 1,
  "moduleName": "Authentication",
  "createdByUserId": 1,
  "createdByUserName": "QA Tester",
  "createdAt": "2026-04-30T22:45:00",
  "updatedAt": "2026-04-30T22:45:00"
}
```

### Error Handling

Validation errors return `400 Bad Request`.

Missing projects, modules, test cases, or users return `404 Not Found`.

Example error response:

```json
{
  "timestamp": "2026-04-30T22:45:00",
  "status": 404,
  "error": "Not Found",
  "message": "Test case not found with id: 99",
  "path": "/api/test-cases/99",
  "validationErrors": null
}
```

## Execution Endpoints

```text
GET   /api/v1/test-plans/{planId}/executions
POST  /api/v1/test-plans/{planId}/executions
GET   /api/v1/executions/{id}
PATCH /api/v1/executions/{id}/result
POST  /api/v1/executions/{id}/defects
```

## Defect Endpoints

```text
GET   /api/v1/defects
GET   /api/v1/defects/{id}
POST  /api/v1/defects
PUT   /api/v1/defects/{id}
PATCH /api/v1/defects/{id}/status
PATCH /api/v1/defects/{id}/assignment
```

## Dashboard Endpoints

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/projects/{projectId}
GET /api/v1/dashboard/test-execution-status
GET /api/v1/dashboard/defect-status
GET /api/v1/dashboard/recent-activity
```

## Future Documentation Format

When controllers are implemented, this document should be expanded with:

- Request examples
- Response examples
- Status codes
- Validation rules
- Error response formats
- Role access details
