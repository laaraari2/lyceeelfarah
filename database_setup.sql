-- ============================================
-- إنشاء قاعدة بيانات Lycée El Farah
-- ============================================

-- ============================================
-- 1. جدول المستخدمين (users)
-- ============================================
-- هذا الجدول موجود بالفعل من create_demo_users.sql
-- لكن دعنا نتأكد من البنية

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. جدول الأساتذة (teachers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  subjects TEXT[] DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. جدول التلاميذ (students)
-- ============================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  student_code TEXT UNIQUE NOT NULL,
  class_level TEXT NOT NULL,
  birth_date DATE,
  parent_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. جدول الدروس (lessons)
-- ============================================
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

-- ============================================
-- 5. جدول الأخبار (news)
-- ============================================
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

-- ============================================
-- 6. جدول محتوى الموقع (site_content)
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL CHECK (language IN ('ar', 'fr')),
  section TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.users(id),
  UNIQUE(language, section)
);

-- ============================================
-- 7. جدول الإعلانات (announcements)
-- ============================================
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
-- 8. إنشاء Indexes للأداء
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lessons_class_level ON public.lessons(class_level);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON public.lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON public.lessons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_class_level ON public.students(class_level);
CREATE INDEX IF NOT EXISTS idx_site_content_language ON public.site_content(language);

-- ============================================
-- 9. إنشاء Functions للتحديث التلقائي
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger لتحديث updated_at تلقائياً
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
-- 10. Row Level Security (RLS) Policies
-- ============================================

-- تفعيل RLS على جميع الجداول
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies للـ users
-- ============================================
-- الجميع يمكنهم قراءة معلومات المستخدمين الأساسية
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- المستخدمون يمكنهم تحديث معلوماتهم الخاصة
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- Policies للـ teachers
-- ============================================
-- الجميع يمكنهم قراءة معلومات الأساتذة
CREATE POLICY "Teachers are viewable by everyone"
  ON public.teachers FOR SELECT
  USING (true);

-- الأساتذة يمكنهم تحديث معلوماتهم
CREATE POLICY "Teachers can update own profile"
  ON public.teachers FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies للـ students
-- ============================================
-- الجميع يمكنهم قراءة معلومات التلاميذ
CREATE POLICY "Students are viewable by everyone"
  ON public.students FOR SELECT
  USING (true);

-- التلاميذ يمكنهم قراءة معلوماتهم
CREATE POLICY "Students can view own profile"
  ON public.students FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- Policies للـ lessons
-- ============================================
-- الجميع يمكنهم قراءة الدروس
CREATE POLICY "Lessons are viewable by everyone"
  ON public.lessons FOR SELECT
  USING (true);

-- الأساتذة يمكنهم إضافة دروس
CREATE POLICY "Teachers can insert lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.user_id = auth.uid()
      AND teachers.id = lessons.teacher_id
    )
  );

-- الأساتذة يمكنهم تحديث دروسهم فقط
CREATE POLICY "Teachers can update own lessons"
  ON public.lessons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.user_id = auth.uid()
      AND teachers.id = lessons.teacher_id
    )
  );

-- الأساتذة يمكنهم حذف دروسهم
CREATE POLICY "Teachers can delete own lessons"
  ON public.lessons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE teachers.user_id = auth.uid()
      AND teachers.id = lessons.teacher_id
    )
  );

-- Admin يمكنه إدارة جميع الدروس
CREATE POLICY "Admins can manage all lessons"
  ON public.lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Policies للـ news
-- ============================================
-- الجميع يمكنهم قراءة الأخبار المنشورة
CREATE POLICY "Published news are viewable by everyone"
  ON public.news FOR SELECT
  USING (is_published = true);

-- Admin يمكنه إدارة جميع الأخبار
CREATE POLICY "Admins can manage all news"
  ON public.news FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Policies للـ site_content
-- ============================================
-- الجميع يمكنهم قراءة محتوى الموقع
CREATE POLICY "Site content is viewable by everyone"
  ON public.site_content FOR SELECT
  USING (true);

-- Admin فقط يمكنه تعديل محتوى الموقع
CREATE POLICY "Admins can manage site content"
  ON public.site_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Policies للـ announcements
-- ============================================
-- الجميع يمكنهم قراءة الإعلانات النشطة
CREATE POLICY "Active announcements are viewable by everyone"
  ON public.announcements FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Admin يمكنه إدارة جميع الإعلانات
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- 11. إنشاء Storage Buckets
-- ============================================
-- يجب تنفيذ هذا من Supabase Dashboard -> Storage

-- Bucket للدروس (PDF files)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('lessons', 'lessons', true);

-- Bucket للصور (news, content)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('images', 'images', true);

-- ============================================
-- 12. Storage Policies
-- ============================================
-- يجب إضافة هذه السياسات من Supabase Dashboard -> Storage -> Policies

-- للـ lessons bucket:
-- - الجميع يمكنهم القراءة
-- - الأساتذة والـ Admin يمكنهم الرفع

-- للـ images bucket:
-- - الجميع يمكنهم القراءة
-- - Admin فقط يمكنه الرفع

-- ============================================
-- تم! الآن قاعدة البيانات جاهزة
-- ============================================

-- للتحقق من الجداول:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public';
