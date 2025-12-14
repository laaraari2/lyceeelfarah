import { supabase } from '../lib/supabase';

export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    full_name: string;
    phone?: string;
    subjects?: string[];
    student_code?: string;
    class_level?: string;
    birth_date?: string;
}

// Sign In with Supabase Auth
export const signIn = async (email: string, password: string) => {
    try {
        console.log(`🔌 Attempting Supabase login for: ${email}`);

        // 1. تسجيل الدخول عبر Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error('❌ Supabase auth error:', authError.message);
            return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }

        if (!authData.user) {
            return { success: false, error: 'لم يتم العثور على المستخدم' };
        }

        console.log('✅ Supabase auth success for:', authData.user.email);

        // 2. جلب بيانات المستخدم من جدول public.users
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError || !profile) {
            console.error('❌ Profile fetch error:', profileError?.message);
            return { success: false, error: 'فشل جلب بيانات المستخدم' };
        }

        console.log('✅ User profile loaded:', profile.full_name);

        return {
            success: true,
            user: authData.user,
            profile: profile as AuthUser
        };

    } catch (error: any) {
        console.error('Signin error:', error);
        return { success: false, error: error.message };
    }
};

// Sign Out
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
        // 1. جلب المستخدم من Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        // 2. جلب بيانات الملف الشخصي من public.users
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching user profile:', profileError?.message);
            return null;
        }

        return profile as AuthUser;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

// Auth State Change listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);

        if (session?.user) {
            // جلب الملف الشخصي
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                console.log('🔄 Session Restored:', profile.role);
                callback(profile as AuthUser);
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    });

    return {
        data: {
            subscription
        }
    };
};
