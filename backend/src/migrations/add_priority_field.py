"""
Database migration script to add priority field to tasks table.

This script adds the 'priority' column to the existing tasks table.
Run this script once to migrate existing databases.

Usage:
    python -m src.migrations.add_priority_field
"""

import sys
import logging
from sqlalchemy import text
from sqlmodel import Session

# Add parent directory to path for imports
sys.path.insert(0, ".")

from src.db import engine
from src.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def add_priority_column():
    """
    Add priority column to tasks table with default value 'medium'.

    This migration:
    1. Adds priority column as VARCHAR(10) with default 'medium'
    2. Updates existing rows to have 'medium' priority
    3. Adds a check constraint to ensure valid priority values
    """
    logger.info("Starting migration: add_priority_field")

    with Session(engine) as session:
        try:
            # Check if column already exists
            check_query = text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='tasks' AND column_name='priority'
            """)
            result = session.exec(check_query).first()

            if result:
                logger.info("Priority column already exists. Skipping migration.")
                return

            # Add priority column with default value
            logger.info("Adding priority column to tasks table...")
            alter_query = text("""
                ALTER TABLE tasks
                ADD COLUMN priority VARCHAR(10) DEFAULT 'medium' NOT NULL
            """)
            session.exec(alter_query)

            # Update existing rows to have 'medium' priority (redundant but explicit)
            logger.info("Updating existing rows with default priority...")
            update_query = text("""
                UPDATE tasks
                SET priority = 'medium'
                WHERE priority IS NULL
            """)
            session.exec(update_query)

            # Add check constraint for valid priority values
            logger.info("Adding check constraint for priority values...")
            constraint_query = text("""
                ALTER TABLE tasks
                ADD CONSTRAINT check_priority_values
                CHECK (priority IN ('high', 'medium', 'low'))
            """)
            session.exec(constraint_query)

            session.commit()
            logger.info("Migration completed successfully!")

        except Exception as e:
            session.rollback()
            logger.error(f"Migration failed: {e}")
            raise


if __name__ == "__main__":
    logger.info(f"Connecting to database: {settings.database_url.split('@')[1] if '@' in settings.database_url else 'local'}")
    add_priority_column()
    logger.info("Migration script finished.")
