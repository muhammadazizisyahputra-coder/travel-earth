-- ================================================
-- 旅行地球 — profiles 表 RLS 策略 + 自动创建触发器
-- 在 Supabase SQL Editor 中一次性执行全部语句
-- ================================================

-- ====== 1. 确保 profiles 表存在（idempotent） ======
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== 2. 开启 RLS ======
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ====== 3. RLS 策略 ======

-- 公开读：任何人都能查看 profile（用于评论区显示头像/昵称）
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

-- 本人写：只有 profile 所有者可以更新自己
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 本人插：只有认证用户可以为自己创建 profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ====== 4. 自动创建 profile 触发器 ======
-- 当新用户注册（auth.users INSERT）时，自动在 profiles 表创建一行

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

-- 触发器（idempotent：先删再建）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ====== 验证 ======
-- 执行后运行以下查询确认：
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- \d public.profiles
