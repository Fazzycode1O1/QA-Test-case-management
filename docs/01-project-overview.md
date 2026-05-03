# Test Case & QA Management System

## Vision

The Test Case & QA Management System provides a centralized platform where QA teams can plan, write, organize, execute, and report on testing activities across software projects.

The system reduces manual tracking, improves release confidence, and gives teams a clear view of product quality from test design through defect resolution.

## What Is Built

### Backend

A fully-implemented Spring Boot REST API with:

- JWT authentication (HMAC-SHA256) with role-based access control
- Full CRUD for projects, modules, test cases, test suites, test plans, test executions, and defects
- Test case version history tracking
- In-app notification system
- Dashboard analytics aggregation
- Report generation with CSV export
- Bean Validation on all request payloads
- Global exception handling with structured error responses
- Spring Security CORS configuration for the frontend origin

### Frontend

A React 18 SPA with:

- JWT authentication with auto-logout on token expiry (401 interceptor)
- Role-based UI rendering (ADMIN / TESTER / DEVELOPER)
- Collapsible sidebar navigation with Heroicons
- Toast notifications (react-hot-toast) for all CRUD operations
- Modal forms for create and edit actions — no page reloads
- Confirm dialogs for all delete actions
- Client-side pagination (10 items per page) with smart ellipsis
- Search and filter bars on all list pages
- Dashboard with KPI cards and Recharts charts (bar, line, pie)
- Notification bell with unread badge and mark-as-read / delete
- Reports page with summary stats and CSV export per category

## Core Value Proposition

- Centralize test cases, suites, plans, executions, and defects in one workspace.
- Improve traceability between projects, modules, test cases, test runs, and reported issues.
- Give QA leads and managers real-time visibility into testing progress and quality risks.
- Help testers maintain reusable and versioned test cases.
- Support collaboration between QA, development, and project stakeholders.

## Target Users

### Admin

Admins manage users, roles, projects, system settings, and high-level access control. They are responsible for maintaining the platform structure and ensuring the right people have the right permissions.

### Tester

Testers create and maintain test cases, organize suites, execute test plans, log results, and report defects. They are the primary daily users of the system.

### Developer

Developers review defects, update defect status, collaborate with testers, and use QA feedback to improve product quality.
