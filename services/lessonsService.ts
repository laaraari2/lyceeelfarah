import { supabase } from '../lib/supabase';

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    class_level: string;
    subject: string;
    type: 'lesson' | 'exercise';
    file_url?: string;
    file_name?: string;
    teacher_id?: string;
    is_public: boolean; // عام أو خاص
    created_at: string;
    updated_at: string;
}

export interface CreateLessonData {
    title: string;
    description?: string;
    class_level: string;
    subject: string;
    type: 'lesson' | 'exercise';
    file_url?: string;
    file_name?: string;
    teacher_id?: string;
    is_public?: boolean; // عام أو خاص (افتراضي: true)
}

/**
 * جلب جميع الدروس
 */
export const getAllLessons = async () => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching lessons:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب الدروس العامة فقط (للصفحة العامة)
 */
export const getPublicLessons = async () => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching public lessons:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب الدروس حسب المستوى الدراسي
 */
export const getLessonsByClassLevel = async (classLevel: string) => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('class_level', classLevel)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching lessons by class level:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب الدروس حسب الأستاذ
 */
export const getLessonsByTeacher = async (teacherId: string) => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching lessons by teacher:', error);
        return { success: false, error: error.message };
    }
};

/**
 * إنشاء درس جديد
 */
export const createLesson = async (lessonData: CreateLessonData) => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .insert([lessonData])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error creating lesson:', error);
        return { success: false, error: error.message };
    }
};

/**
 * تحديث درس
 */
export const updateLesson = async (id: string, updates: Partial<CreateLessonData>) => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error updating lesson:', error);
        return { success: false, error: error.message };
    }
};

/**
 * حذف درس
 */
export const deleteLesson = async (id: string) => {
    try {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting lesson:', error);
        return { success: false, error: error.message };
    }
};

/**
 * البحث في الدروس
 */
export const searchLessons = async (query: string) => {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error searching lessons:', error);
        return { success: false, error: error.message };
    }
};
