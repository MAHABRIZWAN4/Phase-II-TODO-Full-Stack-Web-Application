# Data Model: Todo Web Application

**Feature**: Todo Web Application with User Authentication
**Date**: 2026-01-05
**Status**: Design Complete

## Overview

Two-entity relational model with strict user isolation. Users own tasks via foreign key relationship. All task operations enforce user ownership at database level. Better Auth manages user table; tasks table created manually with proper indexes for performance.

## Entities

### User Table (Better Auth Managed)

**Table Name**: `users`
**Management**: Better Auth (created and maintained by authentication library)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID identifier (managed by Better Auth) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address (login identifier) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password (never plaintext) |
| name | VARCHAR(255) | NULLABLE | Display name (optional, shown in UI) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**SQLModel Definition** (reference only - Better Auth manages):

```python
# backend/models.py (User is managed by Better Auth)
# This is for reference only - Better Auth creates this table

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String
from sqlalchemy.sqltypes import TIMESTAMP
from datetime import datetime

# User table managed by Better Auth
# Fields: id (UUID), email (unique), password_hash, name, created_at
```

**Validation Rules**:
- Email: Valid email format, unique constraint enforced
- Password: Minimum 8 characters, hashed with bcrypt before storage
- Name: Optional, max 255 characters

---

### Task Table

**Table Name**: `tasks`
**Management**: Application-managed (custom SQLModel)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY, AUTO INCREMENT | Auto-generated task identifier |
| user_id | VARCHAR(36) | FOREIGN KEY → users.id, NOT NULL, INDEX | Owner identifier (UUID) |
| title | VARCHAR(200) | NOT NULL | Task title (required, max 200 chars) |
| description | TEXT | NULLABLE | Task details (optional, max 1000 chars) |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**SQLModel Definition**:

```python
# backend/models.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship

class Task(SQLModel, table=True):
    """Task entity representing a todo item owned by a user."""

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, sa_column=Column(Text))
    completed: bool = Field(default=False, sa_column=Column(Boolean, default=False))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # SQLAlchemy relationship (optional, for ORM queries)
    user: Optional["User"] = Relationship(back_populates="tasks")

    class Config:
        # Table configuration
        indexes = [
            Index("user_id"),  # Performance: filter by user
            Index("completed"),  # Performance: filter by status
        ]
```

**Validation Rules**:
- user_id: Must exist in users table (foreign key constraint)
- title: Required, max 200 characters, trimmed whitespace
- description: Optional, max 1000 characters, trimmed whitespace
- completed: Boolean, defaults to FALSE on creation
- created_at: Auto-generated timestamp (immutable)
- updated_at: Updated on every write operation

**Indexes**:
```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

---

## Relationships

### User → Tasks (One-to-Many)

```
User (1) ───────< (Many) Tasks
```

**Relationship Rules**:
- Each user can have zero or more tasks
- Each task belongs to exactly one user
- Cascade delete: Tasks deleted when user is deleted (enforced by application logic)

**SQLModel Relationship** (for ORM queries):

```python
# backend/models.py (relationship defined on both sides)

# In User model (Better Auth manages, but can extend)
class User(SQLModel):
    # ... Better Auth fields ...

    tasks: List["Task"] = Relationship(back_populates="user")

# In Task model (already defined above)
class Task(SQLModel):
    user_id: str = Field(foreign_key="users.id")
    user: Optional["User"] = Relationship(back_populates="tasks")
```

**Query Examples**:

```python
# Get all tasks for a user
user_tasks = await session.exec(
    select(Task).where(Task.user_id == current_user_id)
).all()

# Get completed tasks for a user
completed_tasks = await session.exec(
    select(Task).where(
        and_(Task.user_id == current_user_id, Task.completed == True)
    )
).all()

# Get specific task (user ownership verified by application logic)
task = await session.get(Task, task_id)
assert task.user_id == current_user_id  # Security check
```

---

## State Transitions

### Task Completion State

```
                ┌─────────┐
                │ Created │
                │ (completed = FALSE) │
                └────┬────┘
                     │
                     │ toggle completion
                     ▼
                ┌─────────┐
                │ Completed│
                │ (completed = TRUE)  │
                └────┬────┘
                     │
                     │ toggle completion
                     ▼
                ┌─────────┐
                │ Created │
                │ (completed = FALSE) │
                └─────────┘
```

**State Rules**:
- Initial state: Created (completed = FALSE)
- Completion toggles between Created and Completed
- State persists in database (completed boolean field)
- No intermediate states (e.g., "in_progress") in Phase II

**Transitions**:
| From | To | Trigger | Validation |
|------|-----|---------|------------|
| Created | Completed | User clicks toggle | User owns task (user_id check) |
| Completed | Created | User clicks toggle | User owns task (user_id check) |

---

## Validation Constraints

### User Table Constraints

| Field | Constraint | Error Message |
|-------|-------------|---------------|
| email | Valid email format | "Invalid email address" |
| email | Unique (no duplicates) | "Email already registered" |
| email | Not NULL | "Email is required" |
| password | Min 8 characters | "Password must be at least 8 characters" |
| password_hash | Not NULL | "Password is required" |

### Task Table Constraints

| Field | Constraint | Error Message |
|-------|-------------|---------------|
| user_id | Foreign key exists | "Invalid user identifier" |
| title | Not NULL | "Task title is required" |
| title | Max 200 characters | "Title must be less than 200 characters" |
| description | Max 1000 characters | "Description must be less than 1000 characters" |
| completed | Boolean | N/A (internal validation only) |

---

## Security Constraints

### User Isolation

**Database-Level**:
- All task queries MUST include `WHERE user_id = ?` clause
- Foreign key constraint enforces user_id exists in users table
- Application layer enforces ownership before write operations

**Application-Level**:
- JWT token contains user_id claim
- All API endpoints extract user_id from token
- Ownership check: `task.user_id == current_user_id`
- Unauthorized access returns 401 Unauthorized

**Query Examples (with user isolation)**:

```python
# ❌ WRONG - No user filter (security violation)
all_tasks = await session.exec(select(Task)).all()

# ✅ CORRECT - User filter enforced
user_tasks = await session.exec(
    select(Task).where(Task.user_id == current_user_id)
).all()

# ❌ WRONG - Update without ownership check
await session.exec(
    update(Task).where(Task.id == task_id).values(title=new_title)
)

# ✅ CORRECT - Ownership check before update
task = await session.get(Task, task_id)
if task.user_id != current_user_id:
    raise HTTPException(401, "Unauthorized")
await session.exec(
    update(Task).where(Task.id == task_id).values(title=new_title)
)
```

---

## Data Migration Strategy

### Initial Schema Creation

```sql
-- Users table (managed by Better Auth)
-- Better Auth creates this table automatically on first auth operation
-- Schema matches Better Auth's user model

-- Tasks table (manual creation)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

### Migration Files (Alembic)

Migration files tracked in `backend/alembic/versions/`:

```bash
backend/alembic/versions/
├── 001_initial_schema.py  # Creates users and tasks tables
└── 002_add_task_indexes.py  # Adds performance indexes
```

---

## Performance Considerations

### Indexes

- **idx_tasks_user_id**: Accelerates user task queries (most common query pattern)
- **idx_tasks_completed**: Accelerates status filtering (completed vs pending)

### Query Patterns

| Query Type | Frequency | Optimization |
|-------------|------------|--------------|
| Get user's tasks | High | INDEX on user_id |
| Filter by status | Medium | INDEX on completed |
| Get single task | Medium | PRIMARY KEY index |
| Create task | Medium | Auto-increment PK |

### Estimated Performance

- **User task list query**: <10ms with user_id index (1000 tasks)
- **Task by ID**: <5ms with primary key lookup
- **Create task**: <50ms with auto-increment
- **Update task**: <20ms with primary key update

---

## Entity Lifecycle

### User Lifecycle

```
Signup → Email verification skipped (Phase II) → Active user
                                      │
                                      │ Login
                                      ▼
                              Authenticated session
                                      │
                                      │ Token expires (7 days)
                                      ▼
                                  Re-login required
```

**State**: Active user can create, view, edit, delete, toggle tasks

### Task Lifecycle

```
Created → [Optional: Updated/Edit] → [Optional: Toggled Complete] → Deleted
   │                                      │
   │                                      │ (toggle)
   │                                      ▼
   │                                  Completed
   │                                      │
   │                                      │ (toggle)
   │                                      ▼
   │                                  Created
   │
   │ Delete
   ▼
Removed (soft delete or hard delete? → Hard delete in Phase II)
```

**State Transitions**:
- Created: Initial state after task creation
- Updated: Title/description modified (stays in current state)
- Completed: Status toggled to TRUE
- Deleted: Task removed from database (CASCADE DELETE from user)

---

## JSON API Representation

### User Response

```json
{
  "id": "550e8400-e29b-41d4-a716-4466554401234",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-01-05T10:30:00Z"
}
```

**Notes**:
- `password_hash` NEVER returned in API responses
- `id` is UUID string (not integer)
- `created_at` in ISO 8601 UTC format

### Task Response

```json
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-4466554401234",
  "title": "Complete Phase II",
  "description": "Build todo web app with auth",
  "completed": false,
  "created_at": "2026-01-05T10:30:00Z",
  "updated_at": "2026-01-05T10:30:00Z"
}
```

**Notes**:
- `user_id` included for ownership verification (optional, can be omitted)
- `description` can be `null` if not provided
- `completed` is boolean (true/false)
- Timestamps in ISO 8601 UTC format

---

## Database Constraints Summary

| Constraint | Type | Purpose |
|-----------|------|---------|
| PRIMARY KEY (users.id) | Unique | User identifier |
| UNIQUE (users.email) | Data integrity | No duplicate emails |
| FOREIGN KEY (tasks.user_id → users.id) | Referential integrity | Valid user ownership |
| NOT NULL (users.email, users.password_hash) | Data integrity | Required fields |
| NOT NULL (tasks.user_id, tasks.title) | Data integrity | Required fields |
| INDEX (tasks.user_id) | Performance | User task query optimization |
| INDEX (tasks.completed) | Performance | Status filter optimization |
| CASCADE DELETE (user → tasks) | Data cleanup | Remove orphan tasks |

---

## Data Volume Estimations

### User Volume

| Metric | Phase II MVP | Future Scale |
|--------|---------------|--------------|
| Users | 100-1000 | 10k+ |
| Tasks per user | 10-100 (typical), up to 1000 | Up to 10k |

### Storage Estimates

| Entity | Size per Record | 100 Users (100 tasks each) | 1000 Users (1000 tasks each) |
|--------|----------------|-------------------------------------|-------------------------------------------|
| User | ~500 bytes | ~50 KB | ~500 KB |
| Task | ~500 bytes | ~5 MB | ~500 MB |
| Indexes | ~2x data | ~10 MB | ~1 GB |

**Note**: Neon PostgreSQL scales automatically; no storage concerns for Phase II MVP.

---

## Data Access Patterns

### Write Operations

1. **Create User**: Better Auth handles (INSERT into users)
2. **Create Task**: INSERT into tasks with user_id
3. **Update Task**: UPDATE tasks SET ... WHERE id = ? AND user_id = ?
4. **Delete Task**: DELETE FROM tasks WHERE id = ? AND user_id = ?
5. **Toggle Complete**: UPDATE tasks SET completed = NOT completed WHERE id = ? AND user_id = ?

### Read Operations

1. **Get User Tasks**: SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC
2. **Get Task by ID**: SELECT * FROM tasks WHERE id = ? AND user_id = ?
3. **Filter by Status**: SELECT * FROM tasks WHERE user_id = ? AND completed = ? ORDER BY created_at DESC

**Note**: All read operations filter by user_id for user isolation.

---

## Testing Strategy

### Unit Tests (Database Layer)

```python
# backend/tests/test_models.py

def test_create_task(db_session):
    """Test task creation with valid user_id."""
    task = Task(user_id="user-uuid", title="Test task")
    db_session.add(task)
    db_session.commit()
    assert task.id is not None
    assert task.title == "Test task"
    assert task.completed is False

def test_task_user_isolation(db_session):
    """Test user cannot access other user's tasks."""
    user1_id = "user-1"
    user2_id = "user-2"
    task1 = Task(user_id=user1_id, title="User1 task")
    db_session.add(task1)
    db_session.commit()

    user1_tasks = db_session.exec(select(Task).where(Task.user_id == user1_id)).all()
    user2_tasks = db_session.exec(select(Task).where(Task.user_id == user2_id)).all()

    assert len(user1_tasks) == 1
    assert len(user2_tasks) == 0
```

### Integration Tests (SQLModel + SQLAlchemy)

```python
# backend/tests/test_db_integration.py

async def test_task_crud_with_sqlalchemy(async_session):
    """Test full CRUD operations with async SQLAlchemy session."""
    # Create
    task = Task(user_id="test-user", title="Integration test")
    async_session.add(task)
    await async_session.commit()
    await async_session.refresh(task)

    # Read
    fetched = await async_session.get(Task, task.id)
    assert fetched.title == "Integration test"

    # Update
    fetched.title = "Updated title"
    await async_session.commit()
    await async_session.refresh(fetched)
    assert fetched.title == "Updated title"

    # Delete
    await async_session.delete(fetched)
    await async_session.commit()

    deleted = await async_session.get(Task, task.id)
    assert deleted is None
```

---

## Next Steps

1. ✅ **Schema Design**: Complete - Users and Tasks tables defined
2. ✅ **SQLModel Models**: Complete - Type-safe models with relationships
3. ✅ **Indexes**: Complete - Performance indexes on user_id and completed
4. ✅ **Validation Rules**: Complete - Field-level constraints defined
5. ✅ **Security Model**: Complete - User isolation enforced via user_id filtering
6. 🔄 **API Contracts**: Next step - Define OpenAPI spec in contracts/
7. 🔄 **TypeScript Types**: Next step - Generate types.ts from models
8. 🔄 **Quickstart Guide**: Next step - Developer onboarding document
