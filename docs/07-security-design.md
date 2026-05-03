# Security Design

## JWT Authentication

JWT authentication is implemented using Spring Security and a stateless bearer-token flow.

Authentication flow:

1. User submits email and password to the login endpoint.
2. Backend validates credentials via Spring Security `AuthenticationManager`.
3. Backend returns a JWT access token.
4. Client stores the token in `localStorage` and sends it in the `Authorization` header on every subsequent request.
5. `JwtAuthFilter` validates the token for protected endpoints.
6. User role is extracted from the token and used to enforce authorization rules.

Example header:

```text
Authorization: Bearer <token>
```

The token includes:

- user email as the subject
- user role
- issued-at timestamp
- expiration timestamp

JWT signing uses HMAC SHA-256. The signing secret must be provided through an environment variable:

```text
QAMS_JWT_SECRET
```

Optional expiration override:

```text
QAMS_JWT_EXPIRATION_MS
```

The default token expiration is 24 hours.

## Auth Endpoints

```text
POST /api/auth/register
POST /api/auth/login
```

### Register

Creates a user with one of these roles:

- `ADMIN`
- `TESTER`
- `DEVELOPER`

Passwords are encrypted with BCrypt before storage.

### Login

Authenticates a user with email and password and returns a JWT token.

## Frontend Auth Behavior

### Axios request interceptor

Every outgoing request has the JWT token attached automatically:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qams_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Axios 401 response interceptor

The response interceptor handles two distinct 401 scenarios:

1. **Failed login** — The user submits wrong credentials. No token exists in `localStorage`. The interceptor detects the absence of a token and does not dispatch a logout event, allowing the login form to display its error message normally.

2. **Expired session** — The user is authenticated but the token expires while using the app. A token exists in `localStorage`. The interceptor clears the token and user from `localStorage` and dispatches a DOM event:

```js
window.dispatchEvent(new CustomEvent('auth:logout'));
```

### AuthContext logout listener

`AuthContext` listens for the `auth:logout` event and clears React state:

```js
useEffect(() => {
  function handleForcedLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }
  window.addEventListener('auth:logout', handleForcedLogout);
  return () => window.removeEventListener('auth:logout', handleForcedLogout);
}, []);
```

This unmounts the app shell and React Router redirects to `/login` via the `ProtectedRoute` component.

## Role-Based Access Control (RBAC)

The system implements Spring Security method-level authorization using `@PreAuthorize` annotations on controller methods.

### Spring Security Configuration

- `@EnableMethodSecurity` is enabled in `SecurityConfig` to enforce `@PreAuthorize` checks
- Custom `UserDetailsService` (CustomUserDetailsService) loads user roles with the `ROLE_` prefix required by Spring Security
- Users are granted authorities like `ROLE_ADMIN`, `ROLE_TESTER`, `ROLE_DEVELOPER`
- JWT token includes the user's role, which is extracted and set in the `SecurityContext` by `JwtAuthenticationFilter`

### Authorization Patterns

The backend uses these patterns:

```java
@PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")  // Multiple roles
public ResponseEntity<...> createTestCase(...) { }

@PreAuthorize("hasRole('ADMIN')")  // Admin only
public ResponseEntity<...> deleteProject(...) { }

@PreAuthorize("authenticated")     // Any authenticated user
public ResponseEntity<...> getProjects(...) { }
```

### Endpoint Access Matrix

| Resource | Create | Read | Update | Delete |
|---|---|---|---|---|
| Projects | ADMIN | Any | ADMIN | ADMIN |
| Modules | ADMIN | Any | ADMIN | ADMIN |
| Test Cases | ADMIN, TESTER | Any | ADMIN, TESTER | ADMIN, TESTER |
| Test Suites | ADMIN, TESTER | Any | ADMIN, TESTER | ADMIN, TESTER |
| Test Plans | ADMIN, TESTER | Any | ADMIN, TESTER | ADMIN, TESTER |
| Test Executions | ADMIN, TESTER | Any | ADMIN, TESTER | ADMIN, TESTER |
| Defects | ADMIN, TESTER | Any | ADMIN, TESTER | ADMIN, TESTER |
| Defect Status | ADMIN, TESTER, DEVELOPER | — | ADMIN, TESTER, DEVELOPER | — |
| Notifications | — | Own | — | Own |

### Frontend Role-Based Rendering

The frontend uses role checks to conditionally render UI:

```jsx
const { user } = useAuth();
const canEdit = user?.role === 'ADMIN' || user?.role === 'TESTER';

{canEdit && <button onClick={openCreate}>New Item</button>}
```

Routes are organized by role:
- `/admin/*` — Admin-only pages (Projects, Modules)
- `/tester/*` — Tester pages (Test Cases, Executions, Defects)
- `/developer/*` — Developer pages (Defect Management)
- `/app/dashboard` — Accessible to all authenticated users

## Roles

### ADMIN

- Manage projects and modules
- Manage system-wide test configuration
- Create, update, delete test cases, suites, and plans
- Record and update test executions
- Manage defects and assign work
- View reports and analytics

### TESTER

- Create and maintain test cases, suites, and test plans
- Record test executions (pass/fail/blocked/pending)
- Create and manage defects
- Update test execution status
- View reports and analytics
- Cannot manage projects or modules

### DEVELOPER

- View defects assigned to them
- Update defect status (in progress, resolved, closed)
- Add technical notes to defects
- View test executions that failed
- Cannot create test cases or manage projects

## Password Security

Passwords are hashed using BCrypt before storage. Plain text passwords are never stored or logged.

## CORS Configuration

The backend permits requests only from the frontend origin:

```text
http://localhost:5173
```

All other origins are blocked by Spring Security's CORS configuration.

## Future Security Tasks

- Add refresh tokens.
- Add logout/token revocation endpoint.
- Add user management endpoints for admins.
- Add stricter ownership checks for developer defect visibility.
- Add OAuth2 or SSO if required later.
