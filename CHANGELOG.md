# Changelog

All notable changes to the QA Management System are documented in this file.

## [Unreleased]

### Added
- **Enhanced RBAC Implementation** — Full role-based access control matrix with ADMIN, TESTER, and DEVELOPER roles
- **Improved TestExecution Page** — Fixed double API call issue and enhanced error handling
- **Better UX for Empty States** — Helpful messages when prerequisites (like test cases) don't exist
- **Form Error Handling** — Backend error messages now displayed to users with support for both simple messages and validationErrors object
- **Comprehensive Documentation** — Added 5 new documentation files covering development guide, troubleshooting, and best practices

### Changed
- **Frontend Data Fetching** — Refactored effect dependencies in CRUD pages to use `useCallback` for stable function references
- **API Documentation** — Added role-based access control information to endpoint descriptions
- **Installation Guide** — Enhanced troubleshooting section with RBAC and empty state solutions
- **README** — Reorganized documentation index with Getting Started, Technical, and Project sections

### Fixed
- **Test Execution Recording** — Resolved race condition where multiple API calls were triggered on page load
- **Form Submission** — Forms now properly send `null` instead of empty strings for optional fields
- **Input Styling** — Added `box-sizing: border-box` to form fields for consistent sizing across browsers

### Improved
- **Error Messages** — Users now see specific backend error messages instead of generic fallback text
- **Role Awareness** — Buttons and actions are hidden (not disabled) based on user role
- **Code Organization** — Better separation of concerns with memoized callback functions and proper effect dependencies
- **Developer Experience** — New development guide with code patterns, conventions, and troubleshooting

---

## [1.0.0] - 2026-05-01

### Initial Release
- Full QA Management System implementation with projects, modules, test cases, test suites, test plans, test executions, defects, and notifications
- Spring Boot REST API with JWT authentication and Spring Security
- React 18 SPA with role-based routing and responsive UI
- Dashboard with KPI cards and interactive charts
- CSV export for reports
- Test case version history tracking
- Notification system for test failures and defects
- Comprehensive API documentation and security design

---

## Future Planned Features

- [ ] Refresh tokens for extended sessions
- [ ] Logout/token revocation endpoint
- [ ] User management endpoints for admins
- [ ] OAuth2 or SSO integration
- [ ] Stricter ownership checks for developer defect visibility
- [ ] Real-time collaboration features
- [ ] Advanced filtering and custom reports
- [ ] Integration with CI/CD pipelines
