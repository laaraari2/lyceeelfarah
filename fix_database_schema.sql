-- ============================================
-- إصلاح أخطاء قاعدة البيانات (Fix Database Permissions)
-- ============================================

-- 1. منح الصلاحيات اللازمة للوصول إلى schema auth
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT SELECT ON TABLE auth.users TO postgres, anon, authenticated, service_role;

-- 2. تأكد من أن التريجرز (Triggers) لا تسبب مشاكل
-- أحيانا تريجر التحديث يسبب مشاكل إذا لم يكن المستخدم يملك صلاحية
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. إصلاح صلاحيات التسلسل (Sequences) إن وجدت
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 4. إعادة تعيين صلاحيات الجداول العامة
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 5. التأكد من أن RLS لا يمنع القراءة الأساسية (تم تغطيتها في setup_clean.sql ولكن نعيد التأكيد)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users are viewable by everyone'
  ) THEN
    CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE 'تم تحديث الصلاحيات وإصلاح المشاكل المحتملة ✅';
END $$;
