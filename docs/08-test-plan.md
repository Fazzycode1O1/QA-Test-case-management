# Test Plan

## Backend Testing Plan

The backend should be tested at multiple levels as implementation begins.

Primary testing goals:

- Verify business rules in service classes.
- Verify request validation.
- Verify controller response status codes and payloads.
- Verify repository behavior for important queries.
- Verify security behavior after authentication is implemented.
- Verify common error scenarios through global exception handling.

## Unit Testing With JUnit and Mockito

Unit tests should focus on service-layer behavior and isolated business rules.

Planned unit test areas:

- User service
- Project service
- Module service
- Test case service
- Test suite service
- Test plan service
- Test execution service
- Defect service
- Notification service
- Utility classes

Mockito should be used to mock repositories and external dependencies.

## API Testing With Postman

Postman collections will be stored in the `postman` folder.

Initial Postman coverage should include:

- Authentication endpoints after JWT is implemented
- Test case CRUD
- Test suite CRUD
- Test plan CRUD
- Test execution result updates
- Defect creation and status updates
- Dashboard summary endpoints

## Test Data Strategy

Use predictable test data for projects, modules, users, and test cases. API tests should be organized so they can be executed repeatedly in a local development environment.

## Future Automation

Future CI/CD pipelines should run backend tests automatically before deployment.

