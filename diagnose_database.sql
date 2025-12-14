-- ============================================
-- تشخيص مشاكل قاعدة البيانات (Database Diagnostics)
-- ============================================

-- 1. عرض جميع التريجرز (Triggers) الموجودة في النظام
SELECT 
    event_object_schema as schema_name,
    event_object_table as table_name,
    trigger_name,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema IN ('public', 'auth')
ORDER BY event_object_schema, event_object_table;

-- 2. عرض جميع سياسات الحماية (RLS Policies)
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public';

-- 3. فحص صلاحيات schema auth
SELECT 
    grantee, privilege_type 
FROM information_schema.role_usage_grants 
WHERE object_schema = 'auth';
