"""
FastAPI application for Backend Task API.

[Task]: T010, T024
[From]: specs/001-backend-task-api/plan.md §Technical Context
[From]: specs/001-backend-task-api/contracts/openapi.yaml
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .config import settings
from .routes import router as task_router
from .routes.auth import router as auth_router
from .middleware import setup_exception_handlers

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="Todo Backend Task API",
    description="RESTful API for secure, user-scoped task management with persistent storage",
    version="1.0.0",
)

# Configure CORS middleware
# [Task]: T013 - Enable credentials for cookie-based authentication
# [From]: specs/002-auth-jwt/plan.md §CORS Configuration
# IMPORTANT: When allow_credentials=True, allow_origins cannot be ["*"]
# Must specify exact origins for cookie-based authentication to work
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development frontend
        "http://127.0.0.1:3000",  # Alternative localhost
        "http://localhost:3001",  # Alternative port if 3000 is in use
        "http://127.0.0.1:3001",  # Alternative localhost on port 3001
        "https://radiya345-todo-app-frontend.vercel.app",  # Production frontend (update with your actual URL)
    ],
    allow_credentials=True,  # Required for httpOnly cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup exception handlers
setup_exception_handlers(app)

# Register routers
# [Task]: T027 - Register auth router
app.include_router(auth_router)
app.include_router(task_router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on application startup."""
    logger.info("Application startup - initializing database")
    init_db()
    logger.info("Application startup complete")


@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Health status and database connection status
    """
    return {
        "status": "healthy",
        "database": "connected",
    }
