import { supabase } from '../lib/supabase';

export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    full_name: string;
    phone?: string;
}

// Sign up new user
export const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'admin' | 'teacher' | 'student' | 'parent'
) => {
    try {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user returned');

        // 2. Create user profile
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                role,
                full_name: fullName,
            });

        if (profileError) throw profileError;

        return { success: true, user: authData.user };
    } catch (error: any) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
};

// Sign in
export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        return { success: true, user: data.user, profile };
    } catch (error: any) {
        console.error('Signin error:', error);
        return { success: false, error: error.message };
    }
};

// Sign out
export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Signout error:', error);
        return { success: false, error: error.message };
    }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) return null;

        return profile as AuthUser;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const user = await getCurrentUser();
            callback(user);
        } else {
            callback(null);
        }
    });
};
