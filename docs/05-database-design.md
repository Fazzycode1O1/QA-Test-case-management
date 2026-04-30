# Database Design

## Initial Entities

The first database model will focus on the core QA management workflow.

### User

Represents a system user such as an admin, tester, or developer.

Planned fields:

- `id`
- `name`
- `email`
- `password`
- `role`
- `status`
- `createdAt`
- `updatedAt`

### Project

Represents a software project being tested.

Planned fields:

- `id`
- `name`
- `description`
- `status`
- `createdAt`
- `updatedAt`

### Module

Represents a functional area inside a project.

Planned fields:

- `id`
- `projectId`
- `name`
- `description`
- `createdAt`
- `updatedAt`

### TestCase

Represents a reusable test case.

Planned fields:

- `id`
- `moduleId`
- `title`
- `description`
- `preconditions`
- `steps`
- `expectedResult`
- `priority`
- `status`
- `createdBy`
- `createdAt`
- `updatedAt`

### TestSuite

Represents a group of test cases.

Planned fields:

- `id`
- `projectId`
- `name`
- `description`
- `createdAt`
- `updatedAt`

### TestPlan

Represents a planned testing cycle for a release, sprint, or milestone.

Planned fields:

- `id`
- `projectId`
- `name`
- `description`
- `startDate`
- `endDate`
- `status`
- `createdAt`
- `updatedAt`

### TestExecution

Represents the execution result of a test case within a test plan.

Planned fields:

- `id`
- `testPlanId`
- `testCaseId`
- `executedBy`
- `status`
- `actualResult`
- `executedAt`
- `notes`

### Defect

Represents a bug or issue found during testing.

Planned fields:

- `id`
- `projectId`
- `testExecutionId`
- `title`
- `description`
- `severity`
- `priority`
- `status`
- `reportedBy`
- `assignedTo`
- `createdAt`
- `updatedAt`

### TestCaseVersion

Represents historical versions of a test case.

Planned fields:

- `id`
- `testCaseId`
- `versionNumber`
- `snapshotData`
- `updatedBy`
- `createdAt`

### Notification

Represents system notifications for users.

Planned fields:

- `id`
- `userId`
- `title`
- `message`
- `read`
- `createdAt`

## Entity Relationships

- One `Project` has many `Module` records.
- One `Module` has many `TestCase` records.
- One `Project` has many `TestSuite` records.
- One `TestSuite` can contain many `TestCase` records.
- One `Project` has many `TestPlan` records.
- One `TestPlan` has many `TestExecution` records.
- One `TestCase` has many `TestExecution` records.
- One failed `TestExecution` can create one or more `Defect` records.
- One `TestCase` has many `TestCaseVersion` records.
- One `User` can create many test cases, execute many tests, report defects, and receive notifications.
- One `User` can be assigned many defects.

## Future ERD Placeholder

An ERD will be added after the first set of JPA entities is finalized.

Placeholder:

```text
[Future ERD Diagram]
```

