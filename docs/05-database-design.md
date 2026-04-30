# Database Design

## Implemented Core Model

Phase 2 implements the first JPA database model for the QA Management System. The model focuses on users, projects, modules, test cases, test suites, test plans, executions, defects, test case history, and notifications.

All entities use:

- `Long id`
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- `jakarta.persistence` annotations
- Lombok getters, setters, no-args constructors, and all-args constructors
- `createdAt` and `updatedAt` fields where they are useful
- `@Enumerated(EnumType.STRING)` for enum fields

## Entities

### User

Table: `users`

Represents an application user.

Key fields:

- `id`
- `name`
- `email`
- `password`
- `role`
- `active`
- `createdAt`
- `updatedAt`

Relationships:

- One `User` can create many `TestCase` records.
- One `User` can execute many `TestExecution` records.
- One `User` can report many `Defect` records.
- One `User` can be assigned many `Defect` records.
- One `User` can receive many `Notification` records.

### Project

Table: `projects`

Represents a software project being tested.

Key fields:

- `id`
- `name`
- `description`
- `status`
- `createdAt`
- `updatedAt`

Relationships:

- One `Project` has many `Module` records.
- One `Project` has many `TestSuite` records.
- One `Project` has many `TestPlan` records.
- One `Project` has many `Defect` records.

### Module

Table: `modules`

Represents a functional area inside a project.

Key fields:

- `id`
- `name`
- `description`
- `createdAt`
- `updatedAt`

Relationships:

- Many `Module` records belong to one `Project`.
- One `Module` has many `TestCase` records.

### TestCase

Table: `test_cases`

Represents a reusable test case.

Key fields:

- `id`
- `title`
- `description`
- `preconditions`
- `steps`
- `expectedResult`
- `priority`
- `status`
- `createdAt`
- `updatedAt`

Relationships:

- Many `TestCase` records belong to one `Module`.
- Many `TestCase` records can be created by one `User`.
- One `TestCase` has many `TestExecution` records.
- One `TestCase` has many `TestCaseVersion` records.
- Many `TestCase` records can belong to many `TestSuite` records.

### TestSuite

Table: `test_suites`

Represents a collection of test cases.

Key fields:

- `id`
- `name`
- `description`
- `createdAt`
- `updatedAt`

Relationships:

- Many `TestSuite` records belong to one `Project`.
- One `TestSuite` can contain many `TestCase` records.
- Many `TestSuite` records can belong to many `TestPlan` records.

Join table:

- `test_suite_test_cases`

### TestPlan

Table: `test_plans`

Represents a testing cycle for a release, sprint, or milestone.

Key fields:

- `id`
- `name`
- `description`
- `startDate`
- `endDate`
- `status`
- `createdAt`
- `updatedAt`

Relationships:

- Many `TestPlan` records belong to one `Project`.
- One `TestPlan` can contain many `TestSuite` records.
- One `TestPlan` has many `TestExecution` records.

Join table:

- `test_plan_test_suites`

### TestExecution

Table: `test_executions`

Represents the result of executing a test case inside a test plan.

Key fields:

- `id`
- `status`
- `actualResult`
- `notes`
- `executedAt`
- `createdAt`
- `updatedAt`

Relationships:

- Many `TestExecution` records belong to one `TestCase`.
- Many `TestExecution` records belong to one `TestPlan`.
- Many `TestExecution` records can be executed by one `User`.
- One `TestExecution` may have one `Defect`.

### Defect

Table: `defects`

Represents a bug or issue found during testing.

Key fields:

- `id`
- `title`
- `description`
- `severity`
- `priority`
- `status`
- `createdAt`
- `updatedAt`

Relationships:

- One `Defect` may belong to one `TestExecution`.
- Many `Defect` records can belong to one `Project`.
- Many `Defect` records can be reported by one `User`.
- Many `Defect` records can be assigned to one `User`.

### TestCaseVersion

Table: `test_case_versions`

Represents a historical snapshot of a test case.

Key fields:

- `id`
- `versionNumber`
- `snapshotData`
- `createdAt`

Relationships:

- Many `TestCaseVersion` records belong to one `TestCase`.
- Many `TestCaseVersion` records can be updated by one `User`.

### Notification

Table: `notifications`

Represents a notification sent to a user.

Key fields:

- `id`
- `title`
- `message`
- `read`
- `createdAt`
- `updatedAt`

Relationships:

- Many `Notification` records belong to one `User`.

## Enums

### UserRole

- `ADMIN`
- `TESTER`
- `DEVELOPER`

### TestPriority

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### TestStatus

- `PENDING`
- `PASSED`
- `FAILED`
- `BLOCKED`

### DefectSeverity

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### DefectStatus

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

## Repository Layer

Each entity has a matching Spring Data JPA repository:

- `UserRepository`
- `ProjectRepository`
- `ModuleRepository`
- `TestCaseRepository`
- `TestSuiteRepository`
- `TestPlanRepository`
- `TestExecutionRepository`
- `DefectRepository`
- `TestCaseVersionRepository`
- `NotificationRepository`

## Future ERD Placeholder

An ERD will be added after the first database migration strategy is selected.

```text
[Future ERD Diagram]
```

