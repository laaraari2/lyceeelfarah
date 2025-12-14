-- ============================================
-- دليل إدارة المستخدمين (إضافة / حذف)
-- ============================================

-- ============================================
-- 1. إضافة أستاذ جديد (New Teacher)
-- ============================================
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- أدخل بيانات الأستاذ هنا
  -- Email: teachername@elfarah.ma
  -- Password: teacherpassword
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'teachername@elfarah.ma', crypt('teacherpassword', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  -- الملف الشخصي
  INSERT INTO public.users (id, email, role, full_name) 
  VALUES (new_user_id, 'teachername@elfarah.ma', 'teacher', 'الأستاذ الاسم الكامل');

  -- تفاصيل الأستاذ
  INSERT INTO public.teachers (user_id, subjects, bio) 
  VALUES (new_user_id, ARRAY['المادة 1', 'المادة 2'], 'وصف مختصر للأستاذ');
  
  RAISE NOTICE 'تم إنشاء الأستاذ بنجاح!';
END $$;


-- ============================================
-- 2. إضافة تلميذ جديد (New Student)
-- ============================================
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- أدخل بيانات التلميذ هنا
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'studentname@elfarah.ma', crypt('studentpassword', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  -- الملف الشخصي
  INSERT INTO public.users (id, email, role, full_name) 
  VALUES (new_user_id, 'studentname@elfarah.ma', 'student', 'الطالب الاسم الكامل');

  -- تفاصيل الطالب
  INSERT INTO public.students (user_id, student_code, class_level, birth_date) 
  VALUES (new_user_id, 'CODE12345', 'المستوى الدراسي', '2008-01-01');

  RAISE NOTICE 'تم إنشاء التلميذ بنجاح!';
END $$;


-- ============================================
-- 3. حذف مستخدم (Delete User)
-- ============================================
-- يكفي حذف المستخدم من auth.users وسيتم حذفه تلقائياً من public.users و public.teachers/students
-- ⚠️ تحذير: هذا سيحذف كل ما يتعلق بالمستخدم

DELETE FROM auth.users WHERE email = 'email_to_delete@elfarah.ma';

-- تأكد من استبدال 'email_to_delete@elfarah.ma' بالبريد الإلكتروني المراد حذفه.
