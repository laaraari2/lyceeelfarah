-- ============================================
-- إعداد قاعدة بيانات Lycée El Farah - نسخة نظيفة
-- ============================================
-- نفّذ هذا الملف مباشرة بعد create_demo_users.sql
-- ============================================

-- ============================================
-- 1. إنشاء الجداول
-- ============================================

-- جدول المستخدمين (يجب أن يكون أولاً)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إضافة المستخدمين التجريبيين إلى public.users
INSERT INTO public.users (id, email, role, full_name, phone)
SELECT 
  id, 
  email,
  CASE 
    WHEN email = 'admin@elfarah.ma' THEN 'admin'
    WHEN email = 'teacher@elfarah.ma' THEN 'teacher'
    WHEN email = 'student@elfarah.ma' THEN 'student'
  END as role,
  CASE 
    WHEN email = 'admin@elfarah.ma' THEN 'المدير العام'
    WHEN email = 'teacher@elfarah.ma' THEN 'أستاذ تجريبي'
    WHEN email = 'student@elfarah.ma' THEN 'تلميذ تجريبي'
  END as full_name,
  NULL as phone
FROM auth.users
WHERE email IN ('admin@elfarah.ma', 'teacher@elfarah.ma', 'student@elfarah.ma')
ON CONFLICT (id) DO NOTHING;


-- جدول الأساتذة
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  subjects TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول التلاميذ
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  student_code TEXT UNIQUE NOT NULL,
  class_level TEXT NOT NULL,
  birth_date DATE,
  parent_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الدروس
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  class_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lesson', 'exercise')),
  file_url TEXT,
  file_name TEXT,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الأخبار
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  video_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true
);

-- جدول محتوى الموقع
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL CHECK (language IN ('ar', 'fr')),
  section TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.users(id),
  UNIQUE(language, section)
);

-- جدول الإعلانات
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_role TEXT CHECK (target_role IN ('all', 'admin', 'teacher', 'student', 'parent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- 2. إنشاء Indexes للأداء
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lessons_class_level ON public.lessons(class_level);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON public.lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON public.lessons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_class_level ON public.students(class_level);
CREATE INDEX IF NOT EXISTS idx_site_content_language ON public.site_content(language);

-- ============================================
-- 3. إنشاء Functions و Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. تفعيل Row Level Security
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. إنشاء Policies
-- ============================================

-- Policies للـ users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users are viewable by everyone'
  ) THEN
    CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Policies للـ teachers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Teachers are viewable by everyone'
  ) THEN
    CREATE POLICY "Teachers are viewable by everyone" ON public.teachers FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Teachers can update own profile'
  ) THEN
    CREATE POLICY "Teachers can update own profile" ON public.teachers FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Policies للـ students
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Students are viewable by everyone'
  ) THEN
    CREATE POLICY "Students are viewable by everyone" ON public.students FOR SELECT USING (true);
  END IF;
END $$;

-- Policies للـ lessons
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Lessons are viewable by everyone'
  ) THEN
    CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Teachers can insert lessons'
  ) THEN
    CREATE POLICY "Teachers can insert lessons" ON public.lessons FOR INSERT TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.teachers
        WHERE teachers.user_id = auth.uid() AND teachers.id = lessons.teacher_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Teachers can update own lessons'
  ) THEN
    CREATE POLICY "Teachers can update own lessons" ON public.lessons FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.teachers
        WHERE teachers.user_id = auth.uid() AND teachers.id = lessons.teacher_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Teachers can delete own lessons'
  ) THEN
    CREATE POLICY "Teachers can delete own lessons" ON public.lessons FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.teachers
        WHERE teachers.user_id = auth.uid() AND teachers.id = lessons.teacher_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lessons' AND policyname = 'Admins can manage all lessons'
  ) THEN
    CREATE POLICY "Admins can manage all lessons" ON public.lessons FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'
      )
    );
  END IF;
END $$;

-- Policies للـ news
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Published news are viewable by everyone'
  ) THEN
    CREATE POLICY "Published news are viewable by everyone" ON public.news FOR SELECT USING (is_published = true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Admins can manage all news'
  ) THEN
    CREATE POLICY "Admins can manage all news" ON public.news FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'
      )
    );
  END IF;
END $$;

-- Policies للـ site_content
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Site content is viewable by everyone'
  ) THEN
    CREATE POLICY "Site content is viewable by everyone" ON public.site_content FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Admins can manage site content'
  ) THEN
    CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'
      )
    );
  END IF;
END $$;

-- Policies للـ announcements
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Active announcements are viewable by everyone'
  ) THEN
    CREATE POLICY "Active announcements are viewable by everyone" ON public.announcements FOR SELECT
    USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Admins can manage announcements'
  ) THEN
    CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'
      )
    );
  END IF;
END $$;

-- ============================================
-- تم! قاعدة البيانات جاهزة
-- ============================================
