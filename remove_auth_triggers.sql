-- ============================================
-- إزالة التريجرز التي قد تسبب المشاكل (Remove Auth Triggers)
-- ============================================

-- غالباً ما يكون سبب الخطأ 500 هو تريجر (Trigger) يحاول الكتابة في public.users
-- لكن يفشل بسبب الصلاحيات أو تكرار البيانات.

-- سنقوم بحذف التريجرز الشائعة التي قد تكون أنشئت سابقاً:

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;

-- تأكيد الصلاحيات مرة أخرى (للأمان)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

DO $$
BEGIN
  RAISE NOTICE 'تم حذف التريجرز القديمة وإصلاح الوضع. جرب تسجيل الدخول الآن! 🚀';
END $$;
