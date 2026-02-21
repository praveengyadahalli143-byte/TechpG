-- =====================================================
-- TechpG Production Cleanup Script
-- Run this in Supabase SQL Editor to clear all test data
-- =====================================================

-- ⚠️ WARNING: This will PERMANENTLY delete all user and project data.
-- Admin users and visitor stats can be preserved if needed.

BEGIN;

-- Using a do block to handle missing tables gracefully
DO $$ 
BEGIN
    -- Delete child records if tables exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
        DELETE FROM messages;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'project_updates') THEN
        DELETE FROM project_updates;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        DELETE FROM notifications;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'project_members') THEN
        DELETE FROM project_members;
    END IF;

    -- Delete main records
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        DELETE FROM projects;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        DELETE FROM users;
    END IF;
END $$;

COMMIT;

-- =====================================================
-- Verification Queries
-- =====================================================
SELECT 
    (SELECT count(*) FROM users) as user_count,
    (SELECT count(*) FROM projects) as project_count;
