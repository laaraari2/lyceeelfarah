-- ============================================
-- إضافة سجلات الأساتذة إلى جدول teachers
-- نفذ هذا الملف في Supabase SQL Editor
-- ============================================

-- إضافة جميع الأساتذة الذين لديهم حسابات في users ولكن ليس لديهم سجل في teachers
INSERT INTO public.teachers (user_id, subjects, bio)
SELECT 
  u.id as user_id,
  ARRAY['غير محدد'] as subjects,
  '' as bio
FROM public.users u
WHERE u.role = 'teacher'
AND NOT EXISTS (
  SELECT 1 FROM public.teachers t WHERE t.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- تحقق من الأساتذة المضافين
SELECT 
  t.id as teacher_id,
  u.full_name,
  u.email,
  t.subjects
FROM public.teachers t
JOIN public.users u ON u.id = t.user_id;
