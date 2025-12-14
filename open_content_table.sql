-- ============================================
-- فتح صلاحيات تعديل المحتوى (Open Content Table)
-- ============================================
-- هذا الملف يسمح بتعديل محتوى الموقع بدون الحاجة لتسجيل دخول حقيقي (Supabase User).
-- هذا ضروري لأننا نستخدم "دخول وهمي" (Frontend Mock) في هذه المحاكاة.

-- 1. تعطيل RLS مؤقتاً على جدول المحتوى (أو جعلها مفتوحة للجميع)
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;

-- 2. أو بدلاً من التعطيل، نضيف سياسة تسمح للجميع (أكثر أماناً قليلاً)
-- DROP POLICY IF EXISTS "Allow all access to site_content" ON public.site_content;
-- CREATE POLICY "Allow all access to site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 3. منح جميع الصلاحيات
GRANT ALL ON TABLE public.site_content TO anon, authenticated, service_role, postgres;

DO $$
BEGIN
  RAISE NOTICE '✅ تم فتح صلاحيات تعديل المحتوى بنجاح. يمكن الآن الحفظ من الواجهة.';
END $$;
