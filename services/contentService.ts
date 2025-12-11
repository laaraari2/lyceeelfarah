import { supabase } from '../lib/supabase';
import { Language, SiteContent } from '../types';

export interface SiteContentData {
    language: Language;
    section: string;
    content: any; // JSONB - يمكن أن يكون أي بنية
}

/**
 * جلب محتوى قسم معين
 */
export const getSectionContent = async (language: Language, section: string) => {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('language', language)
            .eq('section', section)
            .single();

        if (error) {
            // إذا لم يوجد المحتوى، نرجع null
            if (error.code === 'PGRST116') {
                return { success: true, data: null };
            }
            throw error;
        }

        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching section content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب جميع محتوى لغة معينة
 */
export const getLanguageContent = async (language: Language) => {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('language', language);

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching language content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * حفظ/تحديث محتوى قسم
 */
export const saveSectionContent = async (
    language: Language,
    section: string,
    content: any
) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('site_content')
            .upsert({
                language,
                section,
                content,
                updated_by: user?.id
            }, {
                onConflict: 'language,section'
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error saving section content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * حفظ محتوى كامل للموقع (جميع الأقسام)
 */
export const saveAllContent = async (language: Language, contentData: SiteContent) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('❌ No authenticated user found');
            return { success: false, error: 'User not authenticated' };
        }

        console.log('💾 Saving content as user:', { id: user.id, email: user.email });

        // حفظ كل قسم على حدة
        const sections = [
            { section: 'navItems', content: contentData.navItems },
            { section: 'hero', content: contentData.hero },
            { section: 'stats', content: contentData.stats },
            { section: 'levels', content: contentData.levels },
            { section: 'about', content: contentData.about },
            { section: 'rules', content: contentData.rules },
            { section: 'life', content: contentData.life },
            { section: 'news', content: contentData.news },
            { section: 'lessonsPage', content: contentData.lessonsPage },
            { section: 'footer', content: contentData.footer }
        ];

        const promises = sections.map(({ section, content }) =>
            supabase
                .from('site_content')
                .upsert({
                    language,
                    section,
                    content,
                    updated_by: user?.id
                }, {
                    onConflict: 'language,section'
                })
        );

        const results = await Promise.all(promises);

        // Check if any of the upserts failed
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
            console.error('❌ Errors saving content:', errors);
            errors.forEach((err, index) => {
                console.error(`Error ${index + 1}:`, {
                    message: err.error?.message,
                    details: err.error?.details,
                    hint: err.error?.hint,
                    code: err.error?.code
                });
            });
            return { success: false, error: errors[0].error?.message || 'Failed to save some sections' };
        }

        console.log('✅ Content saved successfully');
        return { success: true };
    } catch (error: any) {
        console.error('❌ Error saving all content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * حذف محتوى قسم
 */
export const deleteSectionContent = async (language: Language, section: string) => {
    try {
        const { error } = await supabase
            .from('site_content')
            .delete()
            .eq('language', language)
            .eq('section', section);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting section content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * جلب جميع المحتوى (للمدير)
 */
export const getAllContent = async () => {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .order('language', { ascending: true })
            .order('section', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching all content:', error);
        return { success: false, error: error.message };
    }
};
