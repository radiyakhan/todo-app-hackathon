---
name: backend-skill

description: Generate backend routes, handle HTTP requests and responses, and connect applications to databases efficiently.

---

# Backend Skill – API & Database Handling

## Instructions

1. **Routing**

   - Define RESTful API routes
   - Follow clear URL naming conventions
   - Support CRUD operations (Create, Read, Update, Delete)

2. **Request & Response Handling**

   - Validate incoming request data
   - Handle headers, params, query strings, and body
   - Return structured JSON responses
   - Implement proper HTTP status codes

3. **Database Integration**

   - Connect to relational or NoSQL databases
   - Perform secure database queries
   - Handle connection errors gracefully
   - Use environment variables for credentials

## Best Practices

- Keep routes modular and organized
- Use middleware for validation and authentication
- Prevent SQL injection and security risks
- Handle errors with consistent error responses
- Write clean, readable, and maintainable code

## Example Structure

```js
// routes/user.routes.js
import express from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", createUser);

export default router;
