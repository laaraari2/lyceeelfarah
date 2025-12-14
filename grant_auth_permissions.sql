-- ============================================
-- منح صلاحيات الوصول (Fix Auth Permissions)
-- ============================================

-- المشكلة: المستخدمون (anon, authenticated) ليس لديهم إذن "رؤية" قسم auth.
-- الحل: منحهم إذن USAGE.

GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT SELECT ON TABLE auth.users TO postgres, anon, authenticated, service_role;

-- تحديث الـ cache لضمان تطبيق التغييرات فوراً
NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
  RAISE NOTICE '✅ تم منح الصلاحيات بنجاح. يرجى تجربة الدخول الآن.';
END $$;
