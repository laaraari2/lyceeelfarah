-- ============================================
-- إضافة حسابات الأساتذة
-- ============================================

DO $$
DECLARE
  new_user_id UUID;
BEGIN

  -- 1. الأساتذة: اللغة العربية
  -- Labit
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'labit@elfarah.ma', crypt('labit2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'labit@elfarah.ma', 'teacher', 'الأستاذ(ة) Labit');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['اللغة العربية'], 'أستاذ اللغة العربية');

  -- Jalil
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'jalil@elfarah.ma', crypt('jalil2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'jalil@elfarah.ma', 'teacher', 'الأستاذ(ة) Jalil');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['اللغة العربية'], 'أستاذ اللغة العربية');


  -- 2. الأساتذة: اللغة الفرنسية
  -- Khalid
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'khalid@elfarah.ma', crypt('khalid2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'khalid@elfarah.ma', 'teacher', 'الأستاذ(ة) Khalid');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['اللغة الفرنسية'], 'أستاذ اللغة الفرنسية');

  -- Aassri
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'aassri@elfarah.ma', crypt('aassri2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'aassri@elfarah.ma', 'teacher', 'الأستاذ(ة) Aassri');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['اللغة الفرنسية'], 'أستاذ اللغة الفرنسية');


  -- 3. الأساتذة: اللغة الإنجليزية
  -- Anagri
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'anagri@elfarah.ma', crypt('anagri2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'anagri@elfarah.ma', 'teacher', 'الأستاذ(ة) Anagri');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['اللغة الإنجليزية'], 'أستاذ اللغة الإنجليزية');

  -- Joudar
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'joudar@elfarah.ma', crypt('joudar2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'joudar@elfarah.ma', 'teacher', 'الأستاذ(ة) Joudar');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['اللغة الإنجليزية'], 'أستاذ اللغة الإنجليزية');


  -- 4. الأساتذة: الرياضيات
  -- Edrissi
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'edrissi@elfarah.ma', crypt('edrissi2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'edrissi@elfarah.ma', 'teacher', 'الأستاذ(ة) Edrissi');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['الرياضيات'], 'أستاذ الرياضيات');

  -- Agnaw
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'agnaw@elfarah.ma', crypt('agnaw2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'agnaw@elfarah.ma', 'teacher', 'الأستاذ(ة) Agnaw');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['الرياضيات'], 'أستاذ الرياضيات');


  -- 5. الأساتذة: علوم الحياة والأرض (SVT)
  -- Banani
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'banani@elfarah.ma', crypt('banani2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'banani@elfarah.ma', 'teacher', 'الأستاذ(ة) Banani');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['علوم الحياة والأرض'], 'أستاذ علوم الحياة والأرض');

  -- Assmaa
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'assmaa@elfarah.ma', crypt('assmaa2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'assmaa@elfarah.ma', 'teacher', 'الأستاذ(ة) Assmaa');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['علوم الحياة والأرض'], 'أستاذ علوم الحياة والأرض');


  -- 6. الأساتذة: الفيزياء والكيمياء (PC)
  -- Hajami
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'hajami@elfarah.ma', crypt('hajami2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'hajami@elfarah.ma', 'teacher', 'الأستاذ(ة) Hajami');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['الفيزياء والكيمياء'], 'أستاذ الفيزياء والكيمياء');

  -- Majda
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'majda@elfarah.ma', crypt('majda2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'majda@elfarah.ma', 'teacher', 'الأستاذ(ة) Majda');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['الفيزياء والكيمياء'], 'أستاذ الفيزياء والكيمياء');


  -- 7. الأساتذة: التاريخ والجغرافيا (HG)
  -- Fattallah
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'fattallah@elfarah.ma', crypt('fattallah2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'fattallah@elfarah.ma', 'teacher', 'الأستاذ(ة) Fattallah');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['التاريخ والجغرافيا'], 'أستاذ التاريخ والجغرافيا');


  -- 8. الأساتذة: التربية الإسلامية (EI)
  -- Benaabid
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'benaabid@elfarah.ma', crypt('benaabid2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'benaabid@elfarah.ma', 'teacher', 'الأستاذ(ة) Benaabid');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['التربية الإسلامية'], 'أستاذ التربية الإسلامية');

  -- Farhatti
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'farhatti@elfarah.ma', crypt('farhatti2025', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
  RETURNING id INTO new_user_id;

  INSERT INTO public.users (id, email, role, full_name) VALUES (new_user_id, 'farhatti@elfarah.ma', 'teacher', 'الأستاذ(ة) Farhatti');
  INSERT INTO public.teachers (user_id, subjects, bio) VALUES (new_user_id, ARRAY['التربية الإسلامية'], 'أستاذ التربية الإسلامية');


  RAISE NOTICE 'تم إنشاء جميع حسابات الأساتذة بنجاح!';
END $$;
