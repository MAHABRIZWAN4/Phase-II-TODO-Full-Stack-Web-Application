# Run Tests

**Description**: Automated testing workflow for frontend components and backend API endpoints

---

## Skill Purpose

Execute comprehensive tests to ensure code quality, catch bugs early, and validate functionality before deployment.

---

## Testing Strategy

### Frontend Tests (Jest + React Testing Library)

1. **Component rendering tests**
2. **User interaction tests**
3. **Form validation tests**
4. **API integration tests (mocked)**

```bash
# Run frontend tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run tests for specific file
npm test -- TodoItem.test.tsx
```

### Backend Tests (Pytest)

1. **API endpoint tests**
2. **Database operation tests**
3. **Authentication/authorization tests**
4. **Input validation tests**

```bash
# Run backend tests
cd backend
pytest

# Run tests with coverage
pytest --cov=.

# Run tests with verbose output
pytest -v

# Run tests for specific file
pytest tests/test_todos.py

# Run tests for specific function
pytest tests/test_todos.py::test_get_all_tasks

# Run only failing tests from last run
pytest --lf
```

---

## Test Checklists

### Frontend Checklist

- [ ] All components render without errors
- [ ] Button clicks trigger correct actions
- [ ] Forms validate input properly
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] API calls are mocked correctly
- [ ] User interactions are testable with userEvent
- [ ] Snapshots are updated when intentional changes are made

### Backend Checklist

- [ ] All endpoints return correct status codes
- [ ] Authentication middleware works
- [ ] User isolation is enforced
- [ ] Database queries return expected data
- [ ] Error handling returns proper messages
- [ ] Input validation rejects invalid data
- [ ] Session/transaction rollback works on errors
- [ ] Edge cases are covered (empty results, invalid IDs, etc.)

---

## Continuous Testing Guidelines

- Run tests after every implementation
- Run full test suite before deployment
- Maintain 80%+ code coverage
- Fix failing tests immediately
- Update tests when requirements change

---

## Test Examples

### Frontend Component Test Example

```tsx
// frontend/components/__tests__/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '../TodoItem'

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    description: 'Test description'
  }

  it('renders todo item correctly', () => {
    render(<TodoItem todo={mockTodo} onToggle={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const mockToggle = jest.fn()
    const user = userEvent.setup()
    render(<TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={() => {}} />)

    await user.click(screen.getByRole('checkbox'))
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('displays completed state when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(<TodoItem todo={completedTodo} onToggle={() => {}} onDelete={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
```

### Backend API Test Example

```python
# backend/tests/test_todos.py
import pytest
from fastapi.testclient import TestClient
from main import app
from sqlmodel import Session, create_engine, SQLModel
from models import Task

client = TestClient(app)

@pytest.fixture
def session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture
def auth_headers():
    # Mock JWT token
    return {"Authorization": "Bearer valid_token"}

def test_get_all_tasks(session, auth_headers):
    response = client.get("/api/user123/tasks", headers=auth_headers)
    assert response.status_code == 200
    assert "tasks" in response.json()
    assert isinstance(response.json()["tasks"], list)

def test_create_task(session, auth_headers):
    task_data = {
        "title": "New Task",
        "description": "Task description"
    }
    response = client.post(
        "/api/user123/tasks",
        json=task_data,
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["task"]["title"] == "New Task"

def test_create_task_validation(session, auth_headers):
    # Missing required field
    response = client.post(
        "/api/user123/tasks",
        json={"description": "Task description"},
        headers=auth_headers
    )
    assert response.status_code == 422

def test_unauthorized_access(session):
    response = client.get("/api/user123/tasks")
    assert response.status_code == 401

def test_user_isolation(session, auth_headers):
    # Create task for user123
    client.post(
        "/api/user123/tasks",
        json={"title": "User123 Task"},
        headers=auth_headers
    )

    # Try to access from user456
    response = client.get("/api/user456/tasks", headers=auth_headers)
    assert response.status_code == 403
```

---

## Configuration Files

### Frontend Jest Configuration

Ensure `frontend/jest.config.js` exists:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Backend Pytest Configuration

Ensure `backend/pytest.ini` exists:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --strict-markers
    --cov=app
    --cov-report=term-missing
    --cov-report=html
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    integration: marks tests as integration tests
```

---

## Usage

Any agent can invoke this skill after implementing features to ensure quality. Typical scenarios:

- After completing a feature implementation
- Before creating a pull request
- After refactoring code
- During debugging sessions
- Before deploying to production

---

## Troubleshooting

### Frontend Tests Fail

**Mock setup issues:**
- Ensure all external dependencies are mocked
- Check `jest.setup.js` for global mocks
- Verify module mapping in `jest.config.js`

**Component not found:**
- Check if `screen.getByRole()` selectors are correct
- Use `screen.debug()` to inspect rendered output
- Verify async data is properly awaited with `waitFor`

### Backend Tests Fail

**Database issues:**
- Ensure test database is created/seeded correctly
- Check if sessions are properly cleaned up between tests
- Verify fixtures are returning expected data

**Authentication issues:**
- Mock JWT tokens correctly in test headers
- Check if `verify_token` dependency is being bypassed for tests
- Ensure test user IDs match expected values

---

## Best Practices

1. **Arrange-Act-Assert (AAA) pattern** in all tests
2. **Descriptive test names** that explain what is being tested
3. **One assertion per test** when possible
4. **Mock external dependencies** (APIs, databases, timers)
5. **Test edge cases** (empty inputs, null values, boundaries)
6. **Keep tests independent** - no test should depend on another
7. **Run tests in isolation** to ensure reliability
8. **Update tests when requirements change**
