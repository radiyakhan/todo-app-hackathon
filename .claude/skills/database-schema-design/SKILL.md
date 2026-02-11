---
name: database-schema-design

description: Design relational database schemas, create tables, and manage migrations. Use for backend and full-stack projects.
---

# Database Schema & Migration Skill

## Instructions

1. **Schema Design**
   - Identify entities and relationships
   - Apply normalization (1NF, 2NF, 3NF)
   - Choose appropriate data types
   - Define primary and foreign keys

2. **Table Creation**
   - Write clean, readable CREATE TABLE statements
   - Use constraints (NOT NULL, UNIQUE, CHECK)
   - Add indexes where necessary
   - Follow consistent naming conventions

3. **Migrations**
   - Create versioned migrations
   - Support up and down (rollback) operations
   - Avoid destructive changes without backups
   - Keep migrations small and focused

## Best Practices

- Prefer explicit schema over implicit behavior
- Use snake_case for tables and columns
- Never edit old migrations once applied
- Test migrations in a staging environment
- Document schema changes clearly

## Example Structure

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migration example
-- up
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;

-- down
ALTER TABLE users DROP COLUMN is_active;
