# API Documentation

## Initial API Endpoint Plan

The backend will expose REST APIs under a versioned base path such as:

```text
/api/v1
```

API responses should use consistent response structures, validation messages, and error formats.

## Auth Endpoints

JWT is planned for a later phase. These endpoints are listed as the intended API shape only.

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Test Case Endpoints

```text
GET    /api/v1/test-cases
GET    /api/v1/test-cases/{id}
POST   /api/v1/test-cases
PUT    /api/v1/test-cases/{id}
PATCH  /api/v1/test-cases/{id}/status
DELETE /api/v1/test-cases/{id}
GET    /api/v1/test-cases/{id}/versions
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

