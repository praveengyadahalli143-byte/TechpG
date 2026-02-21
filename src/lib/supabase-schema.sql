-- =====================================================
-- TechpG Project Registration - Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (students registering for projects)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  college_name TEXT NOT NULL,
  course_branch TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1b. Placeholder for Messages (moved below)

-- 2. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_type TEXT CHECK (project_type IN ('mini', 'major')) NOT NULL,
  problem_statement TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')) DEFAULT 'pending',
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2b. Messages table for real-time chat (moved here for project reference)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('user', 'admin')) NOT NULL,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'project_coordinator')) DEFAULT 'project_coordinator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Project updates table
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  update_text TEXT NOT NULL,
  status_changed_to TEXT,
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications table (admin-to-user messages)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('status_update', 'info', 'action_required', 'approval', 'rejection')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  sent_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);

-- 7. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies (Drop existing first to avoid duplication errors)
DROP POLICY IF EXISTS "Allow public insert on users" ON users;
DROP POLICY IF EXISTS "Allow public select on users" ON users;
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on projects" ON projects;
DROP POLICY IF EXISTS "Allow public select on projects" ON projects;
DROP POLICY IF EXISTS "Allow public update on projects" ON projects;
CREATE POLICY "Allow public insert on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public update on projects" ON projects FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public select on admin_users" ON admin_users;
CREATE POLICY "Allow public select on admin_users" ON admin_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on project_updates" ON project_updates;
DROP POLICY IF EXISTS "Allow public insert on project_updates" ON project_updates;
CREATE POLICY "Allow public select on project_updates" ON project_updates FOR SELECT USING (true);
CREATE POLICY "Allow public insert on project_updates" ON project_updates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow public insert on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow public update on notifications" ON notifications;
CREATE POLICY "Allow public select on notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on notifications" ON notifications FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public insert on messages" ON messages;
DROP POLICY IF EXISTS "Allow public select on messages" ON messages;
CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on messages" ON messages FOR SELECT USING (true);

-- 9. Insert admin user
-- Only insert if it doesn't exist
INSERT INTO admin_users (email, password_hash, role) 
SELECT 'admin@techpg.com', 'admin123', 'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@techpg.com');

-- 10. Enable Supabase Realtime
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'projects') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE projects;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
END $$;

-- 11. Update trigger for last_updated
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated ON projects;
CREATE TRIGGER projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

-- 12. Storage Setup for Chat Files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('Sources', 'Sources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'Sources');

DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'Sources');

-- 13. Project Members table (Team collaboration)
CREATE TABLE IF NOT EXISTS project_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, email)
);

-- 14. Visitor tracking
CREATE TABLE IF NOT EXISTS visitor_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visit_date DATE DEFAULT CURRENT_DATE,
  visitor_count INTEGER DEFAULT 1,
  UNIQUE(visit_date)
);

-- Policies for new tables
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on project_members" ON project_members;
DROP POLICY IF EXISTS "Allow public insert on project_members" ON project_members;
CREATE POLICY "Allow public select on project_members" ON project_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert on project_members" ON project_members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on visitor_stats" ON visitor_stats;
DROP POLICY IF EXISTS "Allow public insert on visitor_stats" ON visitor_stats;
DROP POLICY IF EXISTS "Allow public update on visitor_stats" ON visitor_stats;
CREATE POLICY "Allow public select on visitor_stats" ON visitor_stats FOR SELECT USING (true);
CREATE POLICY "Allow public insert on visitor_stats" ON visitor_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on visitor_stats" ON visitor_stats FOR UPDATE USING (true);

-- Function to track visitor
CREATE OR REPLACE FUNCTION track_visitor()
RETURNS void AS $$
BEGIN
  INSERT INTO visitor_stats (visit_date, visitor_count)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (visit_date)
  DO UPDATE SET visitor_count = visitor_stats.visitor_count + 1;
END;
$$ LANGUAGE plpgsql;

