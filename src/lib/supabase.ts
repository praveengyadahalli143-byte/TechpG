import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  college_name: string;
  course_branch: string;
  created_at?: string;
};

export type Project = {
  id?: string;
  user_id: string;
  project_type: 'mini' | 'major';
  problem_statement: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  registration_date?: string;
  last_updated?: string;
};

export type AdminUser = {
  id?: string;
  email: string;
  role: 'super_admin' | 'project_coordinator';
  created_at?: string;
};

export type ProjectUpdate = {
  id?: string;
  project_id: string;
  update_text: string;
  status_changed_to: string;
  updated_by: string;
  created_at?: string;
};

export type Notification = {
  id?: string;
  user_id: string;
  project_id: string;
  title: string;
  message: string;
  type: 'status_update' | 'info' | 'action_required' | 'approval' | 'rejection';
  is_read: boolean;
  sent_by: string;
  created_at?: string;
};
