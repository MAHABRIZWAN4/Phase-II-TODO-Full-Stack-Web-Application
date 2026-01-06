# Run Database Migration

**Description**: Execute database schema migrations for SQLModel with Neon PostgreSQL

---

## Skill Purpose

Create and apply database migrations when schema changes, ensuring data integrity and proper table creation.

---

## Migration Workflow

### 1. Review Schema Changes in Models

Check `backend/app/models/` for model changes:
- New tables added
- Columns added/modified/removed
- Relationship changes
- Index additions
- Constraint modifications

### 2. Generate Migration Script

**Option A: SQLModel Simple (no Alembic)**

For development or simple schema changes:
```python
from sqlmodel import SQLModel, create_engine
from models import Task, User

# Create all tables
engine = create_engine(DATABASE_URL)
SQLModel.metadata.create_all(engine)
```

Create a migration script at `backend/app/migrations/migrate_<name>.py`:
```python
import os
from sqlmodel import SQLModel, create_engine
from models import Task, User

def migrate():
    DATABASE_URL = os.getenv("DATABASE_URL")
    engine = create_engine(DATABASE_URL)
    SQLModel.metadata.create_all(engine)
    print("Migration completed successfully!")

if __name__ == "__main__":
    migrate()
```

Run with:
```bash
cd backend
python app/migrations/migrate_<name>.py
```

**Option B: Alembic (Advanced)**

For production with version control:

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Configure alembic.ini to point to your DATABASE_URL
```

Generate migration:
```bash
alembic revision --autogenerate -m "Add tasks table with user relationship"
```

This creates a migration file in `alembic/versions/`:
```python
"""Add tasks table with user relationship

Revision ID: <revision_id>
Revises:
Create Date: <date>
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'tasks',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_tasks_user_id', 'tasks', ['user_id'])

def downgrade():
    op.drop_index('ix_tasks_user_id', table_name='tasks')
    op.drop_table('tasks')
```

Apply migration:
```bash
alembic upgrade head
```

Rollback if needed:
```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>
```

### 3. Test Migration Locally First

Use a development database:
```bash
# Set development DATABASE_URL
export DATABASE_URL="postgresql://user:pass@localhost:5432/dev_db"

# Run migration
alembic upgrade head

# Verify tables
psql $DATABASE_URL -c "\dt"
```

### 4. Apply Migration to Neon Database

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@ep-cool-neon.us-east-2.aws.neon.tech/neondb"

# Apply migration
alembic upgrade head
```

### 5. Verify Tables and Columns Created Correctly

```bash
# List all tables
psql $DATABASE_URL -c "\dt"

# Describe table structure
psql $DATABASE_URL -c "\d tasks"

# Check indexes
psql $DATABASE_URL -c "\di"

# Verify constraints
psql $DATABASE_URL -c "SELECT conname, contype FROM pg_constraint WHERE conrelid = 'tasks'::regclass"
```

### 6. Update Seed Data If Needed

If migration requires data updates:
```python
# Create a seed script
from sqlmodel import Session, select
from models import User, Task

def seed_data():
    engine = create_engine(DATABASE_URL)
    session = Session(engine)

    # Create default users
    user1 = User(
        email="test@example.com",
        password_hash="$2b$12$...",
        name="Test User"
    )
    session.add(user1)
    session.commit()

    print("Seed data created successfully!")

if __name__ == "__main__":
    seed_data()
```

---

## SQLModel Complete Migration Script Template

```python
"""
Migration: <migration-name>
Description: <description>
"""
import os
from sqlmodel import SQLModel, create_engine, Session
from models import *  # Import all models

def run_migration():
    """Create all tables from SQLModel metadata"""
    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable not set")

    print(f"Connecting to database...")
    engine = create_engine(DATABASE_URL, echo=True)

    print("Creating tables...")
    SQLModel.metadata.create_all(engine)

    print("Verifying tables...")
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables created: {tables}")

    print("Migration completed successfully!")

def rollback_migration():
    """Drop all tables (use with caution)"""
    DATABASE_URL = os.getenv("DATABASE_URL")
    engine = create_engine(DATABASE_URL)

    print("WARNING: This will drop all tables!")
    response = input("Are you sure? (yes/no): ")

    if response.lower() == "yes":
        SQLModel.metadata.drop_all(engine)
        print("All tables dropped!")
    else:
        print("Rollback cancelled.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "rollback":
        rollback_migration()
    else:
        run_migration()
```

---

## Common Migration Scenarios

### Adding a New Column

```python
# migration file
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('tasks', sa.Column('due_date', sa.DateTime(), nullable=True))

def downgrade():
    op.drop_column('tasks', 'due_date')
```

### Adding an Index

```python
def upgrade():
    op.create_index('ix_tasks_user_id_completed', 'tasks', ['user_id', 'completed'])

def downgrade():
    op.drop_index('ix_tasks_user_id_completed', table_name='tasks')
```

### Renaming a Column

```python
def upgrade():
    op.alter_column('tasks', 'old_name', new_column_name='new_name')

def downgrade():
    op.alter_column('tasks', 'new_name', new_column_name='old_name')
```

### Changing Column Type

```python
def upgrade():
    op.alter_column('tasks', 'title',
                    existing_type=sa.String(100),
                    type_=sa.String(200))

def downgrade():
    op.alter_column('tasks', 'title',
                    existing_type=sa.String(200),
                    type_=sa.String(100))
```

### Adding Foreign Key

```python
def upgrade():
    op.create_foreign_key(
        'fk_tasks_user_id',
        'tasks', 'users',
        ['user_id'], ['id']
    )

def downgrade():
    op.drop_constraint('fk_tasks_user_id', 'tasks', type_='foreignkey')
```

---

## Safety Checklist

- [ ] **Backup production database** before migration
- [ ] **Test migration on development database first**
- [ ] **Review generated SQL** (if using Alembic) to verify correctness
- [ ] **Check for data loss scenarios** (column drops, type changes)
- [ ] **Have rollback plan ready** (downgrade script documented)
- [ ] **Verify foreign key constraints** are properly set
- [ ] **Test all affected queries** after migration
- [ ] **Update API docs** if schema changes affect API contracts
- [ ] **Notify team** before running production migration

---

## Neon PostgreSQL Specific

### Connection String Format

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

### Connection Pooling

```python
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=3600
)
```

### SSL Configuration

```python
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "require"
    }
)
```

### Monitoring Query Performance

```python
# Add logging to see slow queries
import logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

---

## Best Practices

1. **Version Control**: Keep all migration files in git
2. **Descriptive Messages**: Use clear migration names (e.g., "Add user authentication tables")
3. **Test Data**: Maintain seed data for development/testing
4. **Idempotent**: Make migrations safe to run multiple times
5. **Atomic**: Each migration should succeed or fail completely
6. **Backwards Compatible**: Prefer adding columns before removing old ones
7. **Zero Downtime**: For production, plan migrations to avoid service interruption

---

## Troubleshooting

**Migration fails with "relation already exists":**
```bash
# Drop tables manually (dev only)
psql $DATABASE_URL -c "DROP TABLE IF EXISTS tasks CASCADE;"
```

**Foreign key constraint errors:**
```bash
# Check existing constraints
psql $DATABASE_URL -c "SELECT * FROM pg_constraint WHERE conrelid = 'tasks'::regclass"
```

**Connection timeout:**
```python
# Increase timeout in engine
engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 30})
```

**Slow queries after schema change:**
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 'xxx';

-- Add indexes if needed
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

---

## Usage

**Database Agent** uses this skill when schema changes are needed:

- Creating new tables
- Adding/modifying columns
- Adding relationships
- Performance optimizations (indexes)
- Data migrations

Always reference the relevant task ID from `tasks.md` when implementing.
