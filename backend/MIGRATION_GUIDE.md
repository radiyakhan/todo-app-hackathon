# Database Migration Guide

## Adding Priority Field to Tasks

This guide explains how to migrate your existing database to add the `priority` field to the tasks table.

### What Changed

The Task model now includes a `priority` field with the following specifications:
- **Type**: String (VARCHAR(10))
- **Values**: "high", "medium", "low"
- **Default**: "medium"
- **Required**: Yes (NOT NULL)

### Migration Steps

#### Option 1: Automatic Migration (Recommended for New Deployments)

If you're deploying to a fresh database, the schema will be created automatically with the priority field included.

1. Ensure your `.env` file has the correct `DATABASE_URL`
2. Start the application:
   ```bash
   uvicorn src.main:app --reload
   ```

The `init_db()` function will create all tables with the latest schema.

#### Option 2: Manual Migration (For Existing Databases)

If you have an existing database with tasks, run the migration script:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the migration script:
   ```bash
   python -m src.migrations.add_priority_field
   ```

3. Verify the migration:
   ```bash
   # Connect to your database and check the schema
   # The tasks table should now have a 'priority' column
   ```

### What the Migration Does

The migration script performs the following operations:

1. **Checks if column exists**: Prevents duplicate migrations
2. **Adds priority column**: `ALTER TABLE tasks ADD COLUMN priority VARCHAR(10) DEFAULT 'medium' NOT NULL`
3. **Updates existing rows**: Sets all existing tasks to 'medium' priority
4. **Adds constraint**: Ensures only valid values ('high', 'medium', 'low') can be stored

### API Changes

#### Request Schemas

**TaskCreate** (POST /api/{user_id}/tasks):
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high"  // Optional, defaults to "medium"
}
```

**TaskUpdate** (PUT /api/{user_id}/tasks/{id}):
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "low"  // Optional, only updates if provided
}
```

#### Response Schema

**TaskResponse** (All endpoints):
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "priority": "medium",  // Always included in responses
  "created_at": "2026-02-11T10:30:00Z",
  "updated_at": "2026-02-11T10:30:00Z"
}
```

### Rollback (If Needed)

If you need to rollback the migration:

```sql
-- Remove the constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS check_priority_values;

-- Remove the column
ALTER TABLE tasks DROP COLUMN IF EXISTS priority;
```

**Warning**: This will permanently delete all priority data.

### Troubleshooting

#### Migration fails with "column already exists"
- The migration has already been run. No action needed.

#### Migration fails with connection error
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure the database is accessible from your machine

#### Tasks created before migration show null priority
- This shouldn't happen if the migration ran successfully
- The migration sets a default value and updates all existing rows
- If you see null values, re-run the migration script

### Testing the Migration

After running the migration, test the API:

1. **Create a task with priority**:
   ```bash
   curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test task", "priority": "high"}'
   ```

2. **List tasks and verify priority is included**:
   ```bash
   curl -X GET "http://localhost:8000/api/{user_id}/tasks" \
     -H "Authorization: Bearer {token}"
   ```

3. **Update task priority**:
   ```bash
   curl -X PUT "http://localhost:8000/api/{user_id}/tasks/{id}" \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test task", "priority": "low"}'
   ```

### Notes

- The `description` field remains optional and is preserved in the database
- Frontend can choose to hide the description field in the UI while backend continues to support it
- All existing API endpoints now return the priority field in responses
- Priority validation is enforced at both the Pydantic schema level and database constraint level
