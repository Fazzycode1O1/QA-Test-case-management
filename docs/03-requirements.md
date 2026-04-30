# Requirements

## Functional Requirements

- Users can authenticate and access the system based on assigned roles.
- Admins can manage users, roles, projects, and modules.
- Testers can create, update, search, filter, and archive test cases.
- Testers can group test cases into test suites.
- QA leads can create test plans for specific releases, modules, or milestones.
- Users can execute assigned test cases and record pass, fail, blocked, or skipped status.
- Users can create defects from failed test executions.
- Developers can view and update assigned defects.
- The system can track test case version history.
- The system can display dashboard summaries and basic reports.
- Users can receive notifications for important QA events.

## Non-Functional Requirements

- The backend should use Java 17 and Spring Boot.
- The system should expose RESTful APIs.
- Data should be stored in MySQL.
- API requests should be validated before processing.
- Access control should be role-based.
- The codebase should be modular and maintainable.
- The system should support future integration with external tools.
- The application should provide meaningful error responses.
- The backend should be testable with unit and API tests.

## User Roles

- `ADMIN`: Manages users, projects, modules, roles, and system-wide settings.
- `TESTER`: Manages test cases, suites, plans, executions, and defect reporting.
- `DEVELOPER`: Reviews and updates defects assigned to development work.

## Feature List

- User and role management
- Project management
- Module management
- Test case management
- Test suite management
- Test plan management
- Test execution tracking
- Defect tracking
- Test case versioning
- Notifications
- Dashboard summaries
- Reporting exports in a future phase

