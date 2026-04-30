# QA Management System

A Test Case & QA Management System for organizing projects, modules, test cases, test suites, test plans, executions, defects, and reporting in one place.

## Project Structure

```text
qa-management-system/
├── backend/
│   └── qa-management-api/
├── frontend/
│   └── qa-management-ui/
├── docs/
├── postman/
└── README.md
```

## Backend

The backend module is a Spring Boot Maven project located at `backend/qa-management-api`.

Technology baseline:

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL Driver
- Validation
- Lombok
- DevTools

Base package:

```text
com.qams
```

Initial backend packages:

- `config`
- `controller`
- `dto.request`
- `dto.response`
- `entity`
- `enums`
- `repository`
- `service`
- `security`
- `exception`
- `util`

## Documentation

Project planning documents are available in `docs`.

- `01-project-overview.md`
- `02-problem-statement.md`
- `03-requirements.md`
- `04-system-architecture.md`
- `05-database-design.md`
- `06-api-documentation.md`
- `07-security-design.md`
- `08-test-plan.md`
- `09-installation-guide.md`
- `10-future-scope.md`

## Current Scope

This repository currently contains the backend skeleton and documentation placeholders with initial planning content. JWT, business entities, API controllers, and the React frontend are intentionally not implemented yet.

