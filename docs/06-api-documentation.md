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

The following endpoints are implemented in Phase 5.

```text
POST   /api/test-executions
GET    /api/test-executions
GET    /api/test-executions/{id}
GET    /api/test-executions/test-case/{testCaseId}
PUT    /api/test-executions/{id}/status
DELETE /api/test-executions/{id}
```

### Create Test Execution

```text
POST /api/test-executions
```

Request body:

```json
{
  "testCaseId": 1,
  "testPlanId": 1,
  "executedByUserId": 2,
  "status": "FAILED",
  "actualResult": "Login returned an invalid credentials message.",
  "notes": "Issue appears only for active user accounts."
}
```

Validation rules:

- `testCaseId` is required and must refer to an existing test case.
- `testPlanId` is optional.
- `executedByUserId` is optional.
- `status` is required and must be one of `PENDING`, `PASSED`, `FAILED`, or `BLOCKED`.
- `actualResult` and `notes` are optional.

### Update Test Execution Status

```text
PUT /api/test-executions/{id}/status
```

Request body:

```json
{
  "status": "PASSED",
  "executedByUserId": 2,
  "actualResult": "Login completed successfully.",
  "notes": "Retested after fix."
}
```

### Test Execution Response

```json
{
  "id": 1,
  "testCaseId": 1,
  "testCaseTitle": "Verify user login with valid credentials",
  "testPlanId": 1,
  "testPlanName": "Sprint 1 Regression",
  "executedByUserId": 2,
  "executedByUserName": "QA Tester",
  "status": "FAILED",
  "actualResult": "Login returned an invalid credentials message.",
  "notes": "Issue appears only for active user accounts.",
  "executedAt": "2026-04-30T23:50:00",
  "defectId": 1,
  "createdAt": "2026-04-30T23:50:00",
  "updatedAt": "2026-04-30T23:50:00"
}
```

## Defect Endpoints

The following endpoints are implemented in Phase 5.

```text
POST   /api/defects
GET    /api/defects
GET    /api/defects/{id}
GET    /api/defects/project/{projectId}
PUT    /api/defects/{id}
PUT    /api/defects/{id}/status
DELETE /api/defects/{id}
```

### Create Defect

```text
POST /api/defects
```

Request body:

```json
{
  "title": "Login fails for active user",
  "description": "Valid user cannot log in with correct credentials.",
  "severity": "HIGH",
  "priority": "HIGH",
  "status": "OPEN",
  "testExecutionId": 1,
  "projectId": 1,
  "reportedByUserId": 2,
  "assignedToUserId": 3
}
```

Validation rules:

- `title` is required.
- `severity` is required and must be one of `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
- `status` is optional on create and defaults to `OPEN`.
- `priority` is optional and defaults to `MEDIUM`.
- `testExecutionId` is optional, but when provided it must refer to a failed test execution.
- `projectId` is required and must refer to an existing project.
- `reportedByUserId` and `assignedToUserId` are optional.

### Update Defect

```text
PUT /api/defects/{id}
```

Uses the same request body as create, but `status` is required for full updates.

### Update Defect Status

```text
PUT /api/defects/{id}/status
```

Request body:

```json
{
  "status": "IN_PROGRESS"
}
```

### Defect Response

```json
{
  "id": 1,
  "title": "Login fails for active user",
  "description": "Valid user cannot log in with correct credentials.",
  "severity": "HIGH",
  "priority": "HIGH",
  "status": "OPEN",
  "testExecutionId": 1,
  "projectId": 1,
  "projectName": "QA Management System",
  "reportedByUserId": 2,
  "reportedByUserName": "QA Tester",
  "assignedToUserId": 3,
  "assignedToUserName": "Developer",
  "createdAt": "2026-04-30T23:50:00",
  "updatedAt": "2026-04-30T23:50:00"
}
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
