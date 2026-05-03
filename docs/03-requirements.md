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
- The system tracks test case version history.
- The system displays dashboard summaries and reports.
- Users receive notifications for important QA events.
- Users can export reports to CSV.

## Non-Functional Requirements

- The backend uses Java 17 and Spring Boot.
- The system exposes RESTful APIs.
- Data is stored in MySQL.
- API requests are validated before processing.
- Access control is role-based.
- The codebase is modular and maintainable.
- The system supports future integration with external tools.
- The application provides meaningful error responses.
- The backend is testable with unit and API tests.

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
- Reporting with CSV export
