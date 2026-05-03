# API Documentation

## API Overview

All endpoints are implemented under the `/api` root path.

### Authentication

All endpoints except `/api/auth/**` require a JWT bearer token.

```text
Authorization: Bearer <token>
```

Obtain a token by calling `POST /api/auth/login` with valid credentials. See the [Auth Endpoints](#auth-endpoints) section below.

### Role-Based Access Control

The API enforces role-based access control on protected endpoints. Roles are included in the JWT token and validated by Spring Security method-level annotations (`@PreAuthorize`).

| Role | Permissions |
|---|---|
| `ADMIN` | Full access to all endpoints including project and module management |
| `TESTER` | Can create and manage test cases, test suites, test plans, executions, and defects |
| `DEVELOPER` | Can view defects and update defect status; can view and comment on test executions |

Attempting to access an endpoint without the required role returns `403 Forbidden`.

## Auth Endpoints

The following endpoints are implemented in Phase 10.

```text
POST /api/auth/register
POST /api/auth/login
```

### Register

```text
POST /api/auth/register
```

Request body:

```json
{
  "name": "QA Tester",
  "email": "tester@example.com",
  "password": "secret123",
  "role": "TESTER"
}
```

Allowed roles:

- `ADMIN`
- `TESTER`
- `DEVELOPER`

### Login

```text
POST /api/auth/login
```

Request body:

```json
{
  "email": "tester@example.com",
  "password": "secret123"
}
```

### Auth Response

```json
{
  "token": "<jwt-token>",
  "tokenType": "Bearer",
  "userId": 1,
  "name": "QA Tester",
  "email": "tester@example.com",
  "role": "TESTER"
}
```

Use the token in protected API requests:

```text
Authorization: Bearer <jwt-token>
```

## Project Endpoints

The following endpoints are implemented in Phase 4.

```text
POST   /api/projects          [ADMIN only]
GET    /api/projects          [Authenticated]
GET    /api/projects/{id}     [Authenticated]
PUT    /api/projects/{id}     [ADMIN only]
DELETE /api/projects/{id}     [ADMIN only]
```

**Access control:**
- Create, update, and delete: `ADMIN` role required
- Read: Any authenticated role

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
POST   /api/test-cases         [ADMIN, TESTER]
GET    /api/test-cases         [Authenticated]
GET    /api/test-cases/search  [Authenticated]
GET    /api/test-cases/{id}    [Authenticated]
PUT    /api/test-cases/{id}    [ADMIN, TESTER]
DELETE /api/test-cases/{id}    [ADMIN, TESTER]
```

**Access control:**
- Create, update, and delete: `ADMIN` or `TESTER` role required
- Read: Any authenticated role

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

### Search Test Cases

```text
GET /api/test-cases/search
```

Optional query parameters:

- `keyword`: searches title, description, steps, and expected result.
- `priority`: filters by `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
- `status`: filters by `PENDING`, `PASSED`, `FAILED`, or `BLOCKED`.
- `moduleId`: filters by module.

Example:

```text
GET /api/test-cases/search?keyword=login&priority=HIGH&status=PENDING&moduleId=1
```

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

## Test Case Version Endpoints

The following endpoints are implemented in Phase 8.

```text
GET /api/test-case-versions/test-case/{testCaseId}
GET /api/test-case-versions/{id}
```

### Version History Behavior

Whenever a test case is updated through `PUT /api/test-cases/{id}`, the backend automatically creates a `TestCaseVersion` record.

The version snapshot stores useful old and new values, including:

- `title`
- `description`
- `steps`
- `expectedResult`
- `priority`
- `moduleId`
- `createdByUserId`
- updated user details when available

### Test Case Version Response

```json
{
  "id": 1,
  "testCaseId": 1,
  "versionNumber": 1,
  "snapshotData": "{\"oldValues\":{\"title\":\"Old title\"},\"newValues\":{\"title\":\"New title\"}}",
  "updatedByUserId": 2,
  "updatedByUserName": "QA Tester",
  "createdAt": "2026-05-01T01:20:00"
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

## Test Suite Endpoints

The following endpoints are implemented in Phase 7.

```text
POST   /api/test-suites
GET    /api/test-suites
GET    /api/test-suites/{id}
GET    /api/test-suites/project/{projectId}
PUT    /api/test-suites/{id}
DELETE /api/test-suites/{id}
POST   /api/test-suites/{suiteId}/test-cases/{testCaseId}
DELETE /api/test-suites/{suiteId}/test-cases/{testCaseId}
```

### Create Test Suite

```text
POST /api/test-suites
```

Request body:

```json
{
  "name": "Authentication Regression Suite",
  "description": "Reusable regression tests for authentication features.",
  "projectId": 1,
  "testCaseIds": [1, 2, 3]
}
```

Validation rules:

- `name` is required.
- `projectId` is required and must refer to an existing project.
- `testCaseIds` is optional.

### Update Test Suite

```text
PUT /api/test-suites/{id}
```

Uses the same request body and validation rules as create.

### Manage Test Cases in a Suite

```text
POST   /api/test-suites/{suiteId}/test-cases/{testCaseId}
DELETE /api/test-suites/{suiteId}/test-cases/{testCaseId}
```

These endpoints add or remove one test case from a test suite.

### Test Suite Response

```json
{
  "id": 1,
  "name": "Authentication Regression Suite",
  "description": "Reusable regression tests for authentication features.",
  "projectId": 1,
  "projectName": "QA Management System",
  "testCaseIds": [1, 2, 3],
  "totalTestCases": 3,
  "createdAt": "2026-05-01T01:05:00",
  "updatedAt": "2026-05-01T01:05:00"
}
```

## Test Plan Endpoints

The following endpoints are implemented in Phase 7.

```text
POST   /api/test-plans
GET    /api/test-plans
GET    /api/test-plans/{id}
GET    /api/test-plans/project/{projectId}
PUT    /api/test-plans/{id}
DELETE /api/test-plans/{id}
POST   /api/test-plans/{planId}/test-suites/{suiteId}
DELETE /api/test-plans/{planId}/test-suites/{suiteId}
```

### Create Test Plan

```text
POST /api/test-plans
```

Request body:

```json
{
  "name": "Sprint 1 Regression Plan",
  "description": "Regression cycle for sprint 1 release.",
  "startDate": "2026-05-01",
  "endDate": "2026-05-07",
  "status": "PENDING",
  "projectId": 1,
  "testSuiteIds": [1, 2]
}
```

Validation rules:

- `name` is required.
- `projectId` is required and must refer to an existing project.
- `status` is optional and defaults to `PENDING`.
- `testSuiteIds` is optional.
- `startDate` and `endDate` are optional.

### Update Test Plan

```text
PUT /api/test-plans/{id}
```

Uses the same request body and validation rules as create.

### Manage Test Suites in a Plan

```text
POST   /api/test-plans/{planId}/test-suites/{suiteId}
DELETE /api/test-plans/{planId}/test-suites/{suiteId}
```

These endpoints add or remove one test suite from a test plan.

### Test Plan Response

```json
{
  "id": 1,
  "name": "Sprint 1 Regression Plan",
  "description": "Regression cycle for sprint 1 release.",
  "startDate": "2026-05-01",
  "endDate": "2026-05-07",
  "status": "PENDING",
  "projectId": 1,
  "projectName": "QA Management System",
  "testSuiteIds": [1, 2],
  "totalTestSuites": 2,
  "createdAt": "2026-05-01T01:05:00",
  "updatedAt": "2026-05-01T01:05:00"
}
```

## Execution Endpoints

The following endpoints are implemented in Phase 5.

```text
POST   /api/test-executions                    [ADMIN, TESTER]
GET    /api/test-executions                    [Authenticated]
GET    /api/test-executions/{id}               [Authenticated]
GET    /api/test-executions/test-case/{tcId}  [Authenticated]
PUT    /api/test-executions/{id}/status        [ADMIN, TESTER]
DELETE /api/test-executions/{id}               [ADMIN, TESTER]
```

**Access control:**
- Create, update status, and delete: `ADMIN` or `TESTER` role required
- Read: Any authenticated role

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
GET    /api/defects/search
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

### Search Defects

```text
GET /api/defects/search
```

Optional query parameters:

- `keyword`: searches title and description.
- `severity`: filters by `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
- `status`: filters by `OPEN`, `IN_PROGRESS`, `RESOLVED`, or `CLOSED`.
- `projectId`: filters by project.

Example:

```text
GET /api/defects/search?keyword=login&severity=HIGH&status=OPEN&projectId=1
```

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

## Notification Endpoints

The following endpoints are implemented in Phase 8.

```text
GET    /api/notifications/user/{userId}
GET    /api/notifications/user/{userId}/unread
PUT    /api/notifications/{id}/read
DELETE /api/notifications/{id}
```

### Notification Behavior

Notifications are created automatically when:

- A test execution is marked `FAILED`.
- A defect is created.

For failed test executions, the notification is sent to the executing user when available. If no executing user is present, the notification is sent to the test case creator when available.

For created defects, the notification is sent to the assigned user when available. If no assigned user is present, the notification is sent to the reporting user when available.

### Notification Response

```json
{
  "id": 1,
  "userId": 2,
  "userName": "QA Tester",
  "title": "Test execution failed",
  "message": "Test execution #5 for \"Verify login\" was marked FAILED.",
  "read": false,
  "createdAt": "2026-05-01T01:20:00",
  "updatedAt": "2026-05-01T01:20:00"
}
```

## Report Endpoints

The following endpoints are implemented in Phase 9.

```text
GET /api/reports/test-cases
GET /api/reports/test-executions
GET /api/reports/defects
GET /api/reports/test-cases/csv
GET /api/reports/test-executions/csv
GET /api/reports/defects/csv
```

The JSON report endpoints return summary counts plus useful list data. The CSV endpoints return `text/csv` with download headers.

### Test Case Report

```text
GET /api/reports/test-cases
```

Includes:

- total test case counts by priority
- test case title
- priority and status
- module and project
- created by user
- created date

Example response:

```json
{
  "totalTestCases": 10,
  "lowPriorityTestCases": 1,
  "mediumPriorityTestCases": 4,
  "highPriorityTestCases": 3,
  "criticalPriorityTestCases": 2,
  "testCases": [
    {
      "id": 1,
      "title": "Verify login",
      "priority": "HIGH",
      "status": "PENDING",
      "moduleId": 1,
      "moduleName": "Authentication",
      "projectId": 1,
      "projectName": "QA Management System",
      "createdByUserId": 2,
      "createdByUserName": "QA Tester",
      "createdAt": "2026-05-01T01:30:00"
    }
  ]
}
```

CSV endpoint:

```text
GET /api/reports/test-cases/csv
```

### Test Execution Report

```text
GET /api/reports/test-executions
```

Includes:

- execution counts by status
- test case title
- execution status
- executed by user
- actual result
- execution date

CSV endpoint:

```text
GET /api/reports/test-executions/csv
```

### Defect Report

```text
GET /api/reports/defects
```

Includes:

- defect counts by status
- defect title
- severity and status
- project
- linked test execution
- created date

CSV endpoint:

```text
GET /api/reports/defects/csv
```

## Dashboard Endpoints

The following endpoint is implemented in Phase 6.

```text
GET /api/dashboard/summary
```

### Dashboard Summary Response

```json
{
  "totalProjects": 3,
  "totalModules": 8,
  "totalTestCases": 42,
  "totalExecutions": 30,
  "totalPassedExecutions": 20,
  "totalFailedExecutions": 5,
  "totalBlockedExecutions": 2,
  "totalPendingExecutions": 3,
  "totalDefects": 7,
  "openDefects": 3,
  "inProgressDefects": 2,
  "resolvedDefects": 1,
  "closedDefects": 1,
  "passRate": 66.67,
  "failRate": 16.67
}
```

The `passRate` and `failRate` values are percentages based on total test executions.

## Future Documentation Format

When controllers are implemented, this document should be expanded with:

- Request examples
- Response examples
- Status codes
- Validation rules
- Error response formats
- Role access details
