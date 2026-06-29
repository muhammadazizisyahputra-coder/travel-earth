-- ============================================================================
-- 热门景区功能 — spots 表扩展
-- 在 Supabase SQL Editor 中运行此脚本
-- ============================================================================

-- 1. 添加 is_hot 字段（标记热门景区）
ALTER TABLE public.spots
  ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT FALSE;

-- 2. 确保 views 字段存在（浏览量统计）
-- 注意：如果 spots 表已有 views 字段则跳过
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'spots'
      AND column_name = 'views'
  ) THEN
    ALTER TABLE public.spots ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $$;

-- 3. 验证
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'spots'
  AND column_name IN ('is_hot', 'views');

DO $$
BEGIN
    RAISE NOTICE '✅ spots 表热门景区字段已就绪';
END $$;
