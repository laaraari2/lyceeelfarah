-- ============================================
-- حذف جميع الـ Policies القديمة أولاً
-- ============================================

-- حذف Policies للـ users
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- حذف Policies للـ teachers
DROP POLICY IF EXISTS "Teachers are viewable by everyone" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teachers;

-- حذف Policies للـ students
DROP POLICY IF EXISTS "Students are viewable by everyone" ON public.students;
DROP POLICY IF EXISTS "Students can view own profile" ON public.students;

-- حذف Policies للـ lessons
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can update own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can delete own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;

-- حذف Policies للـ news
DROP POLICY IF EXISTS "Published news are viewable by everyone" ON public.news;
DROP POLICY IF EXISTS "Admins can manage all news" ON public.news;

-- حذف Policies للـ site_content
DROP POLICY IF EXISTS "Site content is viewable by everyone" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;

-- حذف Policies للـ announcements
DROP POLICY IF EXISTS "Active announcements are viewable by everyone" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

-- ============================================
-- الآن نفذ ملف database_setup.sql
-- ============================================
