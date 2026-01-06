# Create API Endpoint

**Description**: Template-based REST API endpoint creation for FastAPI with proper validation and error handling

---

## Skill Purpose

Quickly create RESTful API endpoints following consistent patterns with Pydantic validation, JWT verification, and proper responses.

---

## Template Structure

### 1. Define Pydantic Request Model (if needed)

For endpoints that accept request bodies:
```python
from pydantic import BaseModel, Field

class TaskCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    due_date: str | None = None
```

### 2. Define Pydantic Response Model

```python
from pydantic import BaseModel
from datetime import datetime

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str | None
    completed: bool
    due_date: datetime | None
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### 3. Create Async Route Handler in /routes

File location: `backend/app/routes/<resource_name>.py`

### 4. Add JWT Token Verification Dependency

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from models import Task
from dependencies import get_session
from auth import verify_token

router = APIRouter()
```

### 5. Extract user_id from Token

The `verify_token` dependency returns the decoded JWT payload:
```python
current_user: dict = Depends(verify_token)
user_id = current_user["id"]
```

### 6. Validate user_id Matches URL Parameter

```python
if current_user["id"] != user_id:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized: User ID mismatch"
    )
```

### 7. Implement Business Logic with SQLModel Queries

```python
# Example: Create a new task
new_task = Task(
    title=request.title,
    description=request.description,
    due_date=request.due_date,
    user_id=user_id
)
session.add(new_task)
session.commit()
session.refresh(new_task)
```

### 8. Return Proper JSON Response with Status Code

```python
from fastapi import status

return {
    "task": TaskResponse.model_validate(new_task)
}
# Or return the model directly if FastAPI handles serialization
```

### 9. Handle Errors with HTTPException

```python
# Resource not found
task = session.get(Task, task_id)
if not task:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Task not found"
    )

# Validation error
if not request.title.strip():
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Title cannot be empty"
    )

# Database error
try:
    session.add(task)
    session.commit()
except Exception as e:
    session.rollback()
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to create task"
    )
```

---

## Complete Example Pattern

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel, Field
from models import Task
from dependencies import get_session
from auth import verify_token

router = APIRouter()

# Request/Response Models
class TaskCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    due_date: str | None = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str | None
    completed: bool
    due_date: str | None
    user_id: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# GET all tasks for a user
@router.get("/api/{user_id}/tasks", response_model=dict)
async def get_tasks(
    user_id: str,
    current_user: dict = Depends(verify_token),
    session: Session = Depends(get_session)
):
    """Get all tasks for authenticated user"""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: User ID mismatch"
        )

    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

    return {"tasks": tasks, "count": len(tasks)}

# GET single task
@router.get("/api/{user_id}/tasks/{task_id}", response_model=dict)
async def get_task(
    user_id: str,
    task_id: str,
    current_user: dict = Depends(verify_token),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID"""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: User ID mismatch"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Task does not belong to user"
        )

    return {"task": task}

# POST create new task
@router.post("/api/{user_id}/tasks", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_task(
    user_id: str,
    request: TaskCreateRequest,
    current_user: dict = Depends(verify_token),
    session: Session = Depends(get_session)
):
    """Create a new task"""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: User ID mismatch"
        )

    try:
        new_task = Task(
            title=request.title,
            description=request.description,
            due_date=request.due_date,
            user_id=user_id
        )
        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        return {
            "task": new_task,
            "message": "Task created successfully"
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )

# PUT update task
@router.put("/api/{user_id}/tasks/{task_id}", response_model=dict)
async def update_task(
    user_id: str,
    task_id: str,
    request: TaskCreateRequest,
    current_user: dict = Depends(verify_token),
    session: Session = Depends(get_session)
):
    """Update an existing task"""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: User ID mismatch"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Task does not belong to user"
        )

    try:
        task.title = request.title
        task.description = request.description
        task.due_date = request.due_date
        session.commit()
        session.refresh(task)

        return {
            "task": task,
            "message": "Task updated successfully"
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )

# DELETE task
@router.delete("/api/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    task_id: str,
    current_user: dict = Depends(verify_token),
    session: Session = Depends(get_session)
):
    """Delete a task"""
    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: User ID mismatch"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Task does not belong to user"
        )

    try:
        session.delete(task)
        session.commit()
        return None
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )
```

---

## Common HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Resource created (POST) |
| 204 | No content (DELETE) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (wrong user) |
| 404 | Not found |
| 500 | Internal server error |

---

## Registration in Main App

After creating the route file, register the router in `backend/app/main.py`:

```python
from routes.todos import router as todos_router

app.include_router(todos_router, prefix="")
```

---

## Checklist

- [ ] Pydantic models defined (request and/or response)
- [ ] JWT verification applied as dependency
- [ ] User ID validation against URL parameter
- [ ] User isolation enforced in queries
- [ ] Error handling with appropriate HTTPException
- [ ] Proper HTTP status codes returned
- [ ] Response model documented in decorator
- [ ] Transaction rollback on database errors
- [ ] Router registered in main app
- [ ] Test cases written for all endpoints

---

## Usage

**Backend Agent** uses this skill when creating new API endpoints. Apply this template for:

- New resource CRUD operations
- Specialized query endpoints
- Bulk operations
- Relationship endpoints

Always reference the relevant task ID from `tasks.md` when implementing.
