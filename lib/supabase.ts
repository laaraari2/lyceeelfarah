import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be auto-generated later)
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    role: 'admin' | 'teacher' | 'student' | 'parent';
                    full_name: string;
                    phone: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            lessons: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    class_level: string;
                    subject: string;
                    file_url: string;
                    teacher_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['lessons']['Insert']>;
            };
            news: {
                Row: {
                    id: string;
                    title: string;
                    content: string;
                    image_url: string | null;
                    video_url: string | null;
                    published_at: string;
                    author_id: string;
                };
                Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'published_at'>;
                Update: Partial<Database['public']['Tables']['news']['Insert']>;
            };
        };
    };
}
