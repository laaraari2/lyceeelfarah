-- ============================================
-- إصلاح طوارئ شامل (Emergency Database Fix)
-- ============================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. حذف جميع التريجرز (Triggers) المرتبطة بجدول auth.users
    -- نحن نفعل ذلك لأن أي تريجر قديم قد يسبب فشل عملية تسجيل الدخول
    FOR r IN (SELECT trigger_name FROM information_schema.triggers WHERE event_object_schema = 'auth' AND event_object_table = 'users') LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON auth.users CASCADE';
        RAISE NOTICE 'تم حذف التريجر: %', r.trigger_name;
    END LOOP;

    -- 2. تأكد من حذف الدالة التي تستخدمها التريجرز العادية (إن وجدت)
    DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

    -- 3. إعادة تعيين الصلاحيات بشكل كامل
    GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

    GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

    -- 4. صلاحية قراءة جدول المستخدمين (مهم جداً)
    GRANT SELECT ON TABLE auth.users TO postgres, anon, authenticated, service_role;

    -- 5. تحديث الكاش
    NOTIFY pgrst, 'reload schema';
    
    RAISE NOTICE '✅ تمت عملية الإصلاح الشامل. جميع المعوقات المحتملة تم حذفها.';
END $$;
