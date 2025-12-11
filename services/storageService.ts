import { supabase } from '../lib/supabase';

/**
 * رفع ملف إلى Storage
 */
export const uploadFile = async (
    bucket: 'lessons' | 'images',
    file: File,
    path?: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
        // إنشاء اسم فريد للملف
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = path ? `${path}/${fileName}` : fileName;

        // رفع الملف
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // الحصول على URL العام
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            success: true,
            data: {
                path: filePath,
                publicUrl,
                fileName: file.name
            }
        };
    } catch (error: any) {
        console.error('Error uploading file:', error);
        return { success: false, error: error.message };
    }
};

/**
 * حذف ملف من Storage
 */
export const deleteFile = async (
    bucket: 'lessons' | 'images',
    filePath: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return { success: false, error: error.message };
    }
};

/**
 * الحصول على URL عام لملف
 */
export const getPublicUrl = (
    bucket: 'lessons' | 'images',
    filePath: string
): string => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
};

/**
 * رفع صورة مع ضغطها (اختياري)
 */
export const uploadImage = async (
    file: File,
    path?: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
            throw new Error('الملف يجب أن يكون صورة');
        }

        // رفع الصورة
        return await uploadFile('images', file, path);
    } catch (error: any) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * رفع ملف PDF (للدروس)
 */
export const uploadPDF = async (
    file: File,
    teacherId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
        // التحقق من نوع الملف
        if (file.type !== 'application/pdf') {
            throw new Error('الملف يجب أن يكون PDF');
        }

        // رفع الملف في مجلد الأستاذ
        return await uploadFile('lessons', file, teacherId);
    } catch (error: any) {
        console.error('Error uploading PDF:', error);
        return { success: false, error: error.message };
    }
};

/**
 * الحصول على قائمة الملفات في مجلد
 */
export const listFiles = async (
    bucket: 'lessons' | 'images',
    path?: string
): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(path, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error listing files:', error);
        return { success: false, error: error.message };
    }
};
