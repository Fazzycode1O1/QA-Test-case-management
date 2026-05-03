# Development Guide

This guide outlines the code patterns, conventions, and best practices used in the QA Management System.

## Frontend Development

### Component Organization

Each CRUD page follows a consistent pattern:

```jsx
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

export default function ResourcePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Memoize fetch function for stable reference in dependencies
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/endpoint');
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load items.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect runs once on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <section className="page-section">
      {/* Render based on state */}
    </section>
  );
}
```

### Key Patterns

#### 1. Data Fetching with useCallback

Always memoize async data-fetching functions using `useCallback`:

```jsx
const fetchData = useCallback(async () => {
  try {
    const res = await api.get('/endpoint');
    setData(res.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load data.');
  }
}, []);
```

This ensures the function reference is stable across renders, preventing unnecessary re-runs of dependent effects.

#### 2. Effect Dependencies

Keep effect dependencies minimal and explicit:

```jsx
// Run once on mount
useEffect(() => {
  fetchData();
}, [fetchData]);

// Run when filterValue changes
useEffect(() => {
  applyFilter(filterValue);
}, [filterValue, applyFilter]);
```

#### 3. Error Handling

Handle both simple error messages and validation error objects:

```jsx
catch (err) {
  const msg = err.response?.data?.message || 'Request failed.';
  setError(typeof msg === 'object' ? Object.values(msg).join(' · ') : msg);
}
```

#### 4. Form Submission

Validate before submission and send `null` for optional fields:

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  if (!form.requiredField) {
    setFormError('Required field is missing.');
    return;
  }
  try {
    await api.post('/endpoint', {
      ...form,
      optionalField: form.optionalField || null  // Send null, not empty string
    });
    toast.success('Created successfully.');
    closeForm();
    await fetchData();
  } catch (err) {
    setFormError(err.response?.data?.message || 'Save failed.');
  }
}
```

#### 5. Conditional Rendering

Use role-based conditionals to show/hide actions:

```jsx
const { user } = useAuth();
const canEdit = user?.role === 'ADMIN' || user?.role === 'TESTER';

{canEdit && (
  <button onClick={handleCreate}>Create New</button>
)}
```

### CSS & Styling

Reusable style objects:

```jsx
const fieldStyle = {
  border: '1px solid #cbd7d3',
  borderRadius: 6,
  padding: '10px 12px',
  font: 'inherit',
  color: '#1f2933',
  background: '#fff',
  width: '100%',
  boxSizing: 'border-box'
};
```

Always include `boxSizing: 'border-box'` in form inputs for consistent sizing.

## Backend Development

### Controller Structure

Controllers use Spring Security annotations for RBAC:

```java
@RestController
@RequestMapping("/api/resource")
@RequiredArgsConstructor
public class ResourceController {

  private final ResourceService service;

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
  public ResponseEntity<ResourceResponse> create(@Valid @RequestBody CreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
  }

  @GetMapping
  @PreAuthorize("authenticated")
  public ResponseEntity<List<ResourceResponse>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
  public ResponseEntity<ResourceResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateRequest request) {
    return ResponseEntity.ok(service.update(id, request));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'TESTER')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
```

### Service Layer

Services contain business logic and should be transaction-aware:

```java
@Service
@RequiredArgsConstructor
public class ResourceService {

  private final ResourceRepository repo;
  private final OtherRepository otherRepo;

  public ResourceResponse create(CreateRequest request) {
    // Validate related entities exist
    var other = otherRepo.findById(request.getOtherId())
      .orElseThrow(() -> new EntityNotFoundException("Other not found"));

    // Create entity
    var entity = new Resource();
    entity.setName(request.getName());
    entity.setOther(other);

    // Save and return response
    var saved = repo.save(entity);
    return mapToResponse(saved);
  }

  public ResourceResponse update(Long id, UpdateRequest request) {
    var entity = repo.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Resource not found"));
    
    entity.setName(request.getName());
    var updated = repo.save(entity);
    return mapToResponse(updated);
  }

  private ResourceResponse mapToResponse(Resource entity) {
    return new ResourceResponse(
      entity.getId(),
      entity.getName(),
      entity.getCreatedAt(),
      entity.getUpdatedAt()
    );
  }
}
```

### Request DTOs

Use validation annotations for input validation:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRequest {

  @NotBlank(message = "Name is required")
  private String name;

  @NotNull(message = "Project ID is required")
  private Long projectId;

  @Positive(message = "Priority must be positive")
  private Integer priority;
}
```

### Response DTOs

Keep responses flat and include related entity names:

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

  private Long id;
  private String name;
  private Long projectId;
  private String projectName;  // Include parent entity name
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
```

### Error Handling

The `GlobalExceptionHandler` handles common exceptions:

- `EntityNotFoundException` → 404 Not Found
- `BadCredentialsException` → 401 Unauthorized
- `AccessDeniedException` → 403 Forbidden
- `DataIntegrityViolationException` → 400 Bad Request with constraint details
- `MethodArgumentNotValidException` → 400 Bad Request with validation errors

Always provide meaningful error messages in exceptions.

## Git Workflow

### Commit Messages

Use clear, imperative commit messages:

```
Add JWT authentication and RBAC implementation
Fix double API call in TestExecutions component
Update API documentation with role-based access info
```

### Branch Naming

Use descriptive branch names:

```
feature/jwt-auth
bugfix/double-api-call
docs/api-reference
```

## Testing

### Backend Testing

Run tests:

```bash
mvn test
```

Tests follow the Arrange-Act-Assert pattern:

```java
@Test
void testCreate() {
  // Arrange
  var request = new CreateRequest("Test Name", 1L);
  
  // Act
  var result = service.create(request);
  
  // Assert
  assertNotNull(result.getId());
  assertEquals("Test Name", result.getName());
}
```

### Frontend Testing

While not automated in the current build, manual testing should cover:

- **Authentication**: Login, register, token expiry
- **RBAC**: Role-based button visibility, 403 errors
- **CRUD**: Create, read, update, delete for each resource
- **Forms**: Validation, error messages, successful submission
- **Search/Filter**: Results match criteria
- **Pagination**: Navigation between pages, per-page counts
- **Responsive**: Layout on different screen sizes

## Performance Considerations

### Frontend

- Use `useCallback` to memoize functions passed as dependencies
- Avoid inline styles in loops; extract to constants
- Use `localStorage` for session storage, not `sessionStorage` (survives tab close)
- Paginate large tables (default 10 items per page)

### Backend

- Use `FetchType.LAZY` on `@ManyToOne` and `@ManyToMany` relationships
- Index frequently searched columns (email, names)
- Avoid N+1 queries; use joins when loading related entities
- Cache role lookups and frequent queries when possible

## Common Issues & Solutions

### TestExecution Page Empty State

**Problem**: "No executions found" with empty dropdown

**Solution**: Create test cases first, then record executions. The page checks for prerequisite data.

### Form Submission Errors

**Problem**: Generic "Save failed" message

**Solution**: The frontend now displays specific backend error messages. Check the error object for `validationErrors` field.

### 403 Forbidden on Create/Edit

**Problem**: User can't create or edit resources

**Solution**: Check user role. Only ADMIN and TESTER roles can create most resources. DEVELOPER role is read-only.

### CORS Errors

**Problem**: Browser blocks requests with CORS error

**Solution**: Backend only allows `http://localhost:5173`. Ensure frontend is running on correct port.

## Documentation

- Keep README.md updated with quick start steps
- Document API endpoints in `docs/06-api-documentation.md`
- Explain security decisions in `docs/07-security-design.md`
- Update CHANGELOG.md for notable changes
- Add inline comments only for non-obvious WHY (not WHAT)
