-- ============================================
-- التحقق من وجود المستخدم Admin في جدول public.users
-- ============================================

-- 1. التحقق من حالة المستخدم الحالية
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  u.id as public_user_id,
  u.email as public_email,
  u.role as user_role,
  u.full_name
FROM auth.users au
LEFT JOIN public.users u ON u.id = au.id
WHERE au.email = 'admin@elfarah.ma';

-- 2. إصلاح: إضافة أو تحديث المستخدم Admin في جدول public.users
INSERT INTO public.users (id, email, role, full_name, phone)
SELECT 
  id,
  email,
  'admin',
  'Administrator',
  NULL
FROM auth.users
WHERE email = 'admin@elfarah.ma'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  email = EXCLUDED.email,
  full_name = COALESCE(public.users.full_name, 'Administrator');

-- 3. التحقق من النتيجة
SELECT 
  id,
  email,
  role,
  full_name,
  created_at
FROM public.users
WHERE email = 'admin@elfarah.ma';

-- 4. اختبار صلاحيات RLS
-- يجب تنفيذ هذا الاستعلام بعد تسجيل الدخول كمدير
-- SET request.jwt.claims = '{"sub": "<user_id>"}';
-- SELECT * FROM site_content LIMIT 1;
