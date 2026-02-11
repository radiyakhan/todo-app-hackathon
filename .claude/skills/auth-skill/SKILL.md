---
name: auth-skill
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**

   - Accept user credentials (email/username & password)
   - Validate input data
   - Hash passwords before storing
   - Prevent duplicate accounts

2. **User Signin**

   - Verify user credentials
   - Compare hashed passwords
   - Handle invalid login attempts
   - Return authentication response

3. **Password Security**

   - Use strong hashing algorithms (bcrypt / argon2)
   - Apply salting
   - Never store plain-text passwords

4. **JWT Authentication**

   - Generate JWT tokens on successful login
   - Include user ID and roles in payload
   - Set token expiration
   - Verify token on protected routes

5. **Better Auth Integration**

   - Integrate Better Auth provider
   - Support session management
   - Handle refresh tokens
   - Enable role-based access control

## Best Practices

- Always hash and salt passwords
- Use HTTPS for auth routes
- Keep JWT secret keys secure
- Set short token expiry times
- Separate auth logic from business logic
- Follow OWASP authentication guidelines

## Example Structure

```ts
// Signup
POST /auth/signup
{
  "email": "user@example.com",
  "password": "securePassword"
}

// Signin
POST /auth/signin
{
  "email": "user@example.com",
  "password": "securePassword"
}

// Protected Route
GET /profile
Authorization: Bearer <JWT_TOKEN>
