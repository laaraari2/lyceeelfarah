-- ============================================
-- إضافة عمود is_public لجدول lessons
-- ============================================

-- إضافة العمود is_public إذا لم يكن موجوداً
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- التحقق من أن العمود تم إضافته
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'lessons' AND column_name = 'is_public';
