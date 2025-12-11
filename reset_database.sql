-- ============================================
-- حذف قاعدة البيانات القديمة بالكامل
-- ============================================
-- ⚠️ تحذير: هذا سيحذف جميع البيانات!
-- ============================================

-- 1. حذف جميع الـ Policies أولاً
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Teachers are viewable by everyone" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;
DROP POLICY IF EXISTS "Students are viewable by everyone" ON public.students;
DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can update own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can delete own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
DROP POLICY IF EXISTS "Published news are viewable by everyone" ON public.news;
DROP POLICY IF EXISTS "Admins can manage all news" ON public.news;
DROP POLICY IF EXISTS "Site content is viewable by everyone" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Active announcements are viewable by everyone" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

-- 2. حذف الـ Triggers
DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;

-- 3. حذف الـ Functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. حذف الـ Indexes
DROP INDEX IF EXISTS idx_lessons_class_level;
DROP INDEX IF EXISTS idx_lessons_teacher_id;
DROP INDEX IF EXISTS idx_lessons_created_at;
DROP INDEX IF EXISTS idx_news_published_at;
DROP INDEX IF EXISTS idx_students_class_level;
DROP INDEX IF EXISTS idx_site_content_language;

-- 5. حذف الجداول (بالترتيب العكسي للعلاقات)
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.site_content CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- تم! الآن قاعدة البيانات نظيفة تماماً
-- ============================================
