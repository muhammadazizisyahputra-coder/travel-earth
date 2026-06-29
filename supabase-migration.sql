-- ============================================================================
-- spots 表 longitude / latitude NOT NULL 约束
-- 在 Supabase SQL Editor 中运行此脚本
-- ============================================================================

-- 1. 先检查是否有 NULL 值的记录（防护）
SELECT id, name, longitude, latitude
FROM public.spots
WHERE longitude IS NULL OR latitude IS NULL;

-- 2. 修复已有 NULL 值（如有，可手动删除或补填后再执行第3步）
-- DELETE FROM public.spots WHERE longitude IS NULL OR latitude IS NULL;

-- 3. 添加 NOT NULL 约束
ALTER TABLE public.spots
  ALTER COLUMN longitude SET NOT NULL,
  ALTER COLUMN latitude SET NOT NULL;

-- 4. 验证
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'spots'
  AND column_name IN ('longitude', 'latitude');

DO $$
BEGIN
    RAISE NOTICE '✅ spots 表 longitude / latitude 已设为 NOT NULL';
END $$;
