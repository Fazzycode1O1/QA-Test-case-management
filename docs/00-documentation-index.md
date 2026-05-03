# Documentation Index

Welcome to the QA Management System documentation. This index helps you find the right guide for your needs.

## I Want To...

### Get Started Quickly
1. Read [`../README.md`](../README.md) for a 5-minute overview
2. Follow [`09-installation-guide.md`](09-installation-guide.md) to set up locally
3. Open [`../CHANGELOG.md`](../CHANGELOG.md) to see what's new

### Set Up My Development Environment
1. Read [`09-installation-guide.md`](09-installation-guide.md) — Step-by-step setup
2. Check [`12-troubleshooting.md`](12-troubleshooting.md) if you hit issues
3. Review [`11-development-guide.md`](11-development-guide.md) for code patterns

### Understand How the System Works
1. Start with [`01-project-overview.md`](01-project-overview.md) for the big picture
2. Read [`04-system-architecture.md`](04-system-architecture.md) for technical architecture
3. Review [`05-database-design.md`](05-database-design.md) to understand the data model
4. Check [`07-security-design.md`](07-security-design.md) for security and RBAC

### Call an API Endpoint
1. Go directly to [`06-api-documentation.md`](06-api-documentation.md)
2. Look up your endpoint and see the request/response format
3. Check the role requirements — you may need higher permissions

### Contribute Code
1. Review [`11-development-guide.md`](11-development-guide.md) for patterns and conventions
2. Check [`04-system-architecture.md`](04-system-architecture.md) for where your change belongs
3. Update tests and documentation for your changes

### Report a Bug or Troubleshoot
1. Search [`12-troubleshooting.md`](12-troubleshooting.md) for your issue
2. If not found, check [`../CHANGELOG.md`](../CHANGELOG.md) for recent fixes
3. Review logs in the backend terminal or browser console

### Plan the Future
1. Read [`02-problem-statement.md`](02-problem-statement.md) for context
2. Check [`03-requirements.md`](03-requirements.md) for what's implemented
3. Review [`10-future-scope.md`](10-future-scope.md) for planned work

---

## Documentation Map

```
qa-management-system/
├── README.md                    ← Start here
├── CHANGELOG.md                 ← Recent changes
└── docs/
    ├── 00-documentation-index.md  ← You are here
    ├── 01-project-overview.md     ← Vision & goals
    ├── 02-problem-statement.md    ← Problems solved
    ├── 03-requirements.md         ← Implemented features
    ├── 04-system-architecture.md  ← Technical design
    ├── 05-database-design.md      ← Data model
    ├── 06-api-documentation.md    ← API reference
    ├── 07-security-design.md      ← Auth & RBAC
    ├── 08-test-plan.md            ← Testing strategy
    ├── 09-installation-guide.md   ← Setup & troubleshooting
    ├── 10-future-scope.md         ← Planned enhancements
    ├── 11-development-guide.md    ← Code patterns
    └── 12-troubleshooting.md      ← Common issues
```

---

## Document Summaries

### README.md
**Purpose**: Quick overview and quick-start guide
**Audience**: Everyone — first document to read
**Time**: 5 minutes

### CHANGELOG.md
**Purpose**: Track changes and improvements over time
**Audience**: Users and developers
**Time**: 5 minutes

### 01-project-overview.md
**Purpose**: Vision, value proposition, and target users
**Audience**: Stakeholders, project managers
**Time**: 10 minutes

### 02-problem-statement.md
**Purpose**: Define the problems this system solves
**Audience**: Stakeholders, requirement analysts
**Time**: 10 minutes

### 03-requirements.md
**Purpose**: Enumerate all implemented requirements
**Audience**: Testers, product managers, developers
**Time**: 15 minutes

### 04-system-architecture.md
**Purpose**: Explain the technical architecture and component responsibilities
**Audience**: Developers, architects
**Time**: 20 minutes

### 05-database-design.md
**Purpose**: Define all entities and their relationships
**Audience**: Developers, DBAs
**Time**: 15 minutes

### 06-api-documentation.md
**Purpose**: Comprehensive API endpoint reference with examples
**Audience**: Frontend developers, integration partners
**Time**: 30 minutes (reference, not sequential read)

### 07-security-design.md
**Purpose**: Explain JWT authentication, RBAC, and security architecture
**Audience**: Developers, security reviewers
**Time**: 20 minutes

### 08-test-plan.md
**Purpose**: Define testing strategy and test coverage
**Audience**: QA engineers, testers
**Time**: 15 minutes

### 09-installation-guide.md
**Purpose**: Step-by-step local setup with troubleshooting
**Audience**: Developers getting started, DevOps
**Time**: 20 minutes (to completion)

### 10-future-scope.md
**Purpose**: Planned enhancements and roadmap
**Audience**: Stakeholders, developers planning future work
**Time**: 10 minutes

### 11-development-guide.md
**Purpose**: Code patterns, conventions, best practices
**Audience**: All developers
**Time**: 30 minutes (reference as needed)

### 12-troubleshooting.md
**Purpose**: Common issues and solutions
**Audience**: Everyone debugging an issue
**Time**: 5-30 minutes (search for your issue)

---

## Quick Reference

### Role-Based Access Control Matrix

See [`07-security-design.md`](07-security-design.md#endpoint-access-matrix) for the full matrix.

| Role | Permissions |
|---|---|
| **ADMIN** | Full access: projects, modules, test cases, suites, plans, executions, defects |
| **TESTER** | Can create/manage test cases, executions, defects; cannot manage projects |
| **DEVELOPER** | Can view defects and update status; read-only for others |

### Key API Endpoints

For the complete list, see [`06-api-documentation.md`](06-api-documentation.md).

| Resource | POST | GET | PUT | DELETE |
|---|---|---|---|---|
| Projects | `/projects` | `/projects`, `/projects/{id}` | `/projects/{id}` | `/projects/{id}` |
| Test Cases | `/test-cases` | `/test-cases`, `/test-cases/search` | `/test-cases/{id}` | `/test-cases/{id}` |
| Test Executions | `/test-executions` | `/test-executions`, `/test-executions/{id}` | `/test-executions/{id}/status` | `/test-executions/{id}` |
| Defects | `/defects` | `/defects`, `/defects/search` | `/defects/{id}` | `/defects/{id}` |

### Important Files

| File | Purpose |
|---|---|
| `backend/qa-management-api/pom.xml` | Maven dependencies and build config |
| `backend/qa-management-api/src/main/resources/application.properties` | Backend configuration |
| `frontend/qa-management-ui/package.json` | NPM dependencies |
| `frontend/qa-management-ui/.env` | Frontend configuration |

---

## Need Help?

1. **First visit?** → Start with [`../README.md`](../README.md)
2. **Getting an error?** → Check [`12-troubleshooting.md`](12-troubleshooting.md)
3. **Need to call an API?** → Go to [`06-api-documentation.md`](06-api-documentation.md)
4. **Want to contribute?** → Read [`11-development-guide.md`](11-development-guide.md)
5. **Something unclear?** → Check the document that matches your topic in the map above
6. **Issue not in docs?** → Check [`../CHANGELOG.md`](../CHANGELOG.md) or browser console for errors
