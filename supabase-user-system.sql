-- ============================================================
-- 旅行地球 用户系统数据库迁移脚本
-- 依赖: Supabase Auth (auth.users)
-- 兼容: 已有 spots 表 (id,name,longitude,latitude,description,cover_image,creator_id,created_at,likes,views)
-- ============================================================

-- ============================================================
-- 1. profiles 用户资料表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  bio           TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. likes 点赞表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id     BIGINT NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, spot_id)
);

-- ============================================================
-- 3. favorites 收藏表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id     BIGINT NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, spot_id)
);

-- ============================================================
-- 4. comments 评论表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id     BIGINT NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) > 0),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 补充 spots 表评论计数字段 (如果尚未存在)
DO $$ BEGIN
  ALTER TABLE public.spots ADD COLUMN IF NOT EXISTS comment_count BIGINT DEFAULT 0;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================
-- 5. 触发器: 新用户注册时自动创建 profile
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. 触发器: likes 变动时同步 spots.likes 计数器
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_spot_likes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.spots SET likes = likes + 1 WHERE id = NEW.spot_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.spots SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.spot_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_like_insert ON public.likes;
CREATE TRIGGER on_like_insert
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_spot_likes();

DROP TRIGGER IF EXISTS on_like_delete ON public.likes;
CREATE TRIGGER on_like_delete
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.sync_spot_likes();

-- ============================================================
-- 7. 触发器: comments 变动时同步 spots.comment_count 计数器
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_spot_comment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.spots SET comment_count = comment_count + 1 WHERE id = NEW.spot_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.spots SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.spot_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_comment_insert ON public.comments;
CREATE TRIGGER on_comment_insert
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_spot_comment_count();

DROP TRIGGER IF EXISTS on_comment_delete ON public.comments;
CREATE TRIGGER on_comment_delete
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_spot_comment_count();

-- ============================================================
-- 8. RLS 策略
-- ============================================================

-- 8a. profiles: 公开读, 仅本人可写
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_self_insert" ON public.profiles;
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 8b. likes: 公开读, 仅本人可增删
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "likes_public_read" ON public.likes;
CREATE POLICY "likes_public_read" ON public.likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "likes_self_insert" ON public.likes;
CREATE POLICY "likes_self_insert" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "likes_self_delete" ON public.likes;
CREATE POLICY "likes_self_delete" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- 8c. favorites: 公开读, 仅本人可增删
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "favorites_public_read" ON public.favorites;
CREATE POLICY "favorites_public_read" ON public.favorites FOR SELECT USING (true);
DROP POLICY IF EXISTS "favorites_self_insert" ON public.favorites;
CREATE POLICY "favorites_self_insert" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "favorites_self_delete" ON public.favorites;
CREATE POLICY "favorites_self_delete" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 8d. comments: 公开读, 登录可增, 本人可删改
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_public_read" ON public.comments;
CREATE POLICY "comments_public_read" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "comments_auth_insert" ON public.comments;
CREATE POLICY "comments_auth_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "comments_owner_update" ON public.comments;
CREATE POLICY "comments_owner_update" ON public.comments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "comments_owner_delete" ON public.comments;
CREATE POLICY "comments_owner_delete" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- 8e. spots: 公开读, 创建者可更新/删除
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "spots_public_read" ON public.spots;
CREATE POLICY "spots_public_read" ON public.spots FOR SELECT USING (true);
DROP POLICY IF EXISTS "spots_owner_insert" ON public.spots;
CREATE POLICY "spots_owner_insert" ON public.spots FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "spots_owner_update" ON public.spots;
CREATE POLICY "spots_owner_update" ON public.spots FOR UPDATE USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "spots_owner_delete" ON public.spots;
CREATE POLICY "spots_owner_delete" ON public.spots FOR DELETE USING (auth.uid() = creator_id);

-- ============================================================
-- 9. 索引
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_likes_user_id      ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_spot_id      ON public.likes(spot_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user     ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_spot     ON public.favorites(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_spot_id   ON public.comments(spot_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id   ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created   ON public.comments(spot_id, created_at DESC);

-- ============================================================
-- 10. 视图: 景点详情含社交数据 (调用时需已登录)
-- ============================================================
CREATE OR REPLACE VIEW public.spot_details AS
SELECT
  s.*,
  COALESCE((SELECT COUNT(*) FROM public.likes l     WHERE l.spot_id = s.id), 0) AS like_count,
  COALESCE((SELECT COUNT(*) FROM public.favorites f WHERE f.spot_id = s.id), 0) AS fav_count,
  COALESCE((SELECT COUNT(*) FROM public.comments c  WHERE c.spot_id = s.id), 0) AS comment_count_live,
  EXISTS(SELECT 1 FROM public.likes l     WHERE l.spot_id = s.id AND l.user_id = auth.uid()) AS is_liked,
  EXISTS(SELECT 1 FROM public.favorites f WHERE f.spot_id = s.id AND f.user_id = auth.uid()) AS is_favorited
FROM public.spots s;

-- ============================================================
-- 11. spot_images 景点图片表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.spot_images (
  id            BIGSERIAL PRIMARY KEY,
  spot_id       BIGINT NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  url           TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.spot_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "spot_images_public_read" ON public.spot_images;
CREATE POLICY "spot_images_public_read" ON public.spot_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "spot_images_auth_insert" ON public.spot_images;
CREATE POLICY "spot_images_auth_insert" ON public.spot_images FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "spot_images_owner_delete" ON public.spot_images;
CREATE POLICY "spot_images_owner_delete" ON public.spot_images FOR DELETE USING (auth.uid() = user_id);

-- 索引
CREATE INDEX IF NOT EXISTS idx_spot_images_spot ON public.spot_images(spot_id);

-- ============================================================
-- 12. Supabase Storage 策略 (在 SQL Editor 中执行)
-- ============================================================
-- 前提：在 Supabase Dashboard → Storage 中手动创建 bucket，命名为 "spot-images"，勾选 "Public bucket"
-- 然后在 SQL Editor 中执行以下策略：

/*
-- 允许所有人读取
CREATE POLICY "spot_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'spot-images');

-- 允许登录用户上传
CREATE POLICY "spot_images_auth_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'spot-images' AND auth.role() = 'authenticated');

-- 允许上传者删除自己的图片
CREATE POLICY "spot_images_owner_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'spot-images' AND auth.uid()::text = owner_id::text);
*/
