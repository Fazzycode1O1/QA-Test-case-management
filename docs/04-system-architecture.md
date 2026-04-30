# System Architecture

## Backend Architecture

The backend is planned as a layered Spring Boot REST API.

Initial package responsibilities:

- `controller`: REST endpoints and request handling.
- `dto.request`: Request payload models.
- `dto.response`: API response payload models.
- `service`: Business logic and workflow orchestration.
- `repository`: Spring Data JPA persistence interfaces.
- `entity`: JPA entities mapped to database tables.
- `enums`: Shared enum definitions such as roles and statuses.
- `config`: Application and framework configuration.
- `security`: Authentication and authorization components.
- `exception`: Custom exceptions and global exception handling.
- `util`: Shared utility classes.

## Frontend Architecture

The frontend will be created later under `frontend/qa-management-ui`. The planned frontend is a React-based user interface that consumes backend REST APIs.

Expected frontend areas:

- Authentication screens
- Dashboard
- Project and module management
- Test case management
- Test suite and test plan views
- Test execution workspace
- Defect tracking views
- Reports and analytics pages

## Database Layer

The database layer will use MySQL with Spring Data JPA and Hibernate. Entities will represent the QA domain model, including users, projects, modules, test cases, executions, and defects.

The initial configuration uses `application.properties` for local MySQL connection settings.

## Security Layer

Spring Security is included in the backend skeleton. JWT authentication is planned but not implemented yet.

The security layer will eventually provide:

- Login and token issuance
- Request authentication filters
- Role-based access control
- Password hashing
- Protected route configuration

## Reporting Layer

The reporting layer will aggregate test execution and defect data for dashboards and future export features.

Initial reporting targets:

- Test execution status summary
- Pass/fail/blocked/skipped counts
- Defect status summary
- Project quality overview
- Tester and developer workload indicators

