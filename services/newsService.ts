import { supabase } from '../lib/supabase';

export interface NewsItem {
    id: string;
    title: string;
    content: string;
    summary?: string;
    image_url?: string;
    video_url?: string;
    published_at: string;
    author_id?: string;
    is_published: boolean;
}

export interface CreateNewsData {
    title: string;
    content: string;
    summary?: string;
    image_url?: string;
    video_url?: string;
    is_published?: boolean;
}

/**
 * جلب جميع الأخبار المنشورة
 */
export const getPublishedNews = async () => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .order('published_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching published news:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب جميع الأخبار (للمدير)
 */
export const getAllNews = async () => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching all news:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب خبر واحد
 */
export const getNewsById = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching news by id:', error);
        return { success: false, error: error.message };
    }
};

/**
 * إنشاء خبر جديد
 */
export const createNews = async (newsData: CreateNewsData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('news')
            .insert([{
                ...newsData,
                author_id: user?.id,
                is_published: newsData.is_published ?? true
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error creating news:', error);
        return { success: false, error: error.message };
    }
};

/**
 * تحديث خبر
 */
export const updateNews = async (id: string, updates: Partial<CreateNewsData>) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error updating news:', error);
        return { success: false, error: error.message };
    }
};

/**
 * حذف خبر
 */
export const deleteNews = async (id: string) => {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting news:', error);
        return { success: false, error: error.message };
    }
};

/**
 * نشر/إلغاء نشر خبر
 */
export const toggleNewsPublish = async (id: string, isPublished: boolean) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .update({ is_published: isPublished })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error toggling news publish:', error);
        return { success: false, error: error.message };
    }
};
