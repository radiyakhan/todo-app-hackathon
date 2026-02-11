# API Testing Guide

## Test the Backend API

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Create a User (Signup)
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }' \
  -c cookies.txt
```

### 3. Sign In
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

### 4. Get Current User
```bash
curl http://localhost:8000/api/auth/me \
  -b cookies.txt
```

### 5. Create a Task
```bash
# Replace {user_id} with your actual user ID from signup/signin response
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

### 6. List All Tasks
```bash
curl http://localhost:8000/api/{user_id}/tasks \
  -b cookies.txt
```

### 7. Update a Task
```bash
curl -X PUT http://localhost:8000/api/{user_id}/tasks/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Buy groceries (Updated)",
    "description": "Milk, eggs, bread, cheese"
  }'
```

### 8. Toggle Task Completion
```bash
curl -X PATCH http://localhost:8000/api/{user_id}/tasks/1/complete \
  -b cookies.txt
```

### 9. Delete a Task
```bash
curl -X DELETE http://localhost:8000/api/{user_id}/tasks/1 \
  -b cookies.txt
```

### 10. Sign Out
```bash
curl -X POST http://localhost:8000/api/auth/signout \
  -b cookies.txt
```

## Interactive API Documentation

Visit http://localhost:8000/docs for Swagger UI (interactive API testing)

## Frontend Testing

1. Open http://localhost:3000 in your browser
2. Sign up for a new account
3. Sign in with your credentials
4. Create, view, update, and delete tasks
5. Toggle task completion status

## Database Verification

Check your Neon database console to see the created tables and data:
- Tables: `users`, `tasks`
- Data: User accounts and their tasks

## Notes

- JWT tokens are stored in httpOnly cookies for security
- All task operations require authentication
- Users can only access their own tasks (enforced by backend)
- Passwords are hashed with bcrypt before storage
