# Quick Start: Priority Field

## Summary
The Task model now includes a `priority` field with values: "high", "medium", "low" (default: "medium").

## For Developers

### API Usage

**Create task with priority:**
```bash
curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Important task", "priority": "high"}'
```

**Create task without priority (defaults to "medium"):**
```bash
curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Regular task"}'
```

**Update task priority:**
```bash
curl -X PUT "http://localhost:8000/api/{user_id}/tasks/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task", "priority": "low"}'
```

### Response Format
All task responses now include the priority field:
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "priority": "medium",
  "created_at": "2026-02-11T10:30:00Z",
  "updated_at": "2026-02-11T10:30:00Z"
}
```

## For Database Administrators

### New Deployments
No action needed. The schema includes the priority field automatically.

### Existing Databases
Run the migration:
```bash
cd backend
python -m src.migrations.add_priority_field
```

This adds the priority column, sets all existing tasks to "medium", and adds validation constraints.

## Validation Rules
- **Valid values**: "high", "medium", "low"
- **Default**: "medium"
- **Required**: Yes (NOT NULL in database)
- **Invalid values**: Return 422 Unprocessable Entity

## Files Changed
- `src/models/task.py` - Database model
- `src/schemas/task_schemas.py` - API schemas
- `src/services/task_service.py` - Business logic
- `src/routes/tasks.py` - API endpoints
- `src/migrations/add_priority_field.py` - Migration script (new)

## Documentation
- `MIGRATION_GUIDE.md` - Detailed migration instructions
- `PRIORITY_IMPLEMENTATION.md` - Complete implementation details
- `README_PRIORITY.md` - This quick start guide
