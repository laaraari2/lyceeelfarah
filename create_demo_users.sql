-- ============================================
-- إنشاء مستخدمين تجريبيين للاختبار
-- ============================================

-- 1. مستخدم Admin (مدير)
-- Email: admin@elfarah.ma
-- Password: admin123

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- إنشاء مستخدم في auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@elfarah.ma',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO admin_user_id;

  -- إنشاء profile في public.users
  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (
    admin_user_id,
    'admin@elfarah.ma',
    'admin',
    'المدير التجريبي',
    '0522283699'
  );

  RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
END $$;

-- 2. مستخدم Teacher (أستاذ)
-- Email: teacher@elfarah.ma
-- Password: teacher123

DO $$
DECLARE
  teacher_user_id UUID;
  teacher_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'teacher@elfarah.ma',
    crypt('teacher123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO teacher_user_id;

  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (
    teacher_user_id,
    'teacher@elfarah.ma',
    'teacher',
    'الأستاذ التجريبي',
    '0700784308'
  );

  -- إنشاء teacher profile
  INSERT INTO public.teachers (user_id, subjects, bio)
  VALUES (
    teacher_user_id,
    ARRAY['الرياضيات', 'الفيزياء'],
    'أستاذ تجريبي للاختبار'
  ) RETURNING id INTO teacher_id;

  RAISE NOTICE 'Teacher user created with ID: %', teacher_user_id;
END $$;

-- 3. مستخدم Student (طالب)
-- Email: student@elfarah.ma
-- Password: student123

DO $$
DECLARE
  student_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'student@elfarah.ma',
    crypt('student123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO student_user_id;

  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (
    student_user_id,
    'student@elfarah.ma',
    'student',
    'الطالب التجريبي',
    NULL
  );

  -- إنشاء student profile
  INSERT INTO public.students (user_id, student_code, class_level, birth_date)
  VALUES (
    student_user_id,
    'STD2024001',
    '1ère Bac SVT',
    '2007-01-15'
  );

  RAISE NOTICE 'Student user created with ID: %', student_user_id;
END $$;

-- ============================================
-- تم! الآن يمكنك تسجيل الدخول بأحد الحسابات:
-- ============================================
-- Admin:   admin@elfarah.ma   / admin123
-- Teacher: teacher@elfarah.ma / teacher123
-- Student: student@elfarah.ma / student123
