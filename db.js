// ==================== 数据库服务模块 ====================
// 封装 profiles / likes / favorites 的 CRUD 操作
// Supabase 客户端从 src/utils/supabaseClient.js 统一导入

import { supabase as _supabaseRef } from "./src/utils/supabaseClient.js";

let _supabase = null;

/**
 * 初始化数据库模块（无需参数，从 supabaseClient.js 直连导入）
 */
export function initDB() {
  _supabase = _supabaseRef;
}

// ==================== Profiles ====================

/** 获取用户 profile */
export async function getProfileById(userId) {
  const { data, error } = await _supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** 更新用户 profile */
export async function updateProfileById(userId, updates) {
  try {
    const { data, error } = await _supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] updateProfileById 失败:", err);
    throw new Error(_friendlyError(err, "资料更新失败，请检查权限或重试"));
  }
}

// ==================== Likes ====================

/** 检查用户是否已点赞某景点 */
export async function hasLiked(userId, spotId) {
  const { count, error } = await _supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("spot_id", spotId);
  if (error) throw error;
  return count > 0;
}

/** 点赞 */
export async function likeSpot(userId, spotId) {
  try {
    const { data, error } = await _supabase
      .from("likes")
      .insert({ user_id: userId, spot_id: spotId });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] likeSpot 失败:", err);
    throw new Error(_friendlyError(err, "点赞失败，请检查权限或重试"));
  }
}

/** 取消点赞 */
export async function unlikeSpot(userId, spotId) {
  try {
    const { data, error } = await _supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("spot_id", spotId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] unlikeSpot 失败:", err);
    throw new Error(_friendlyError(err, "取消点赞失败，请检查权限或重试"));
  }
}

/** 获取景点的点赞总数 */
export async function getLikeCount(spotId) {
  const { count, error } = await _supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("spot_id", spotId);
  if (error) throw error;
  return count || 0;
}

// ==================== Favorites ====================

/** 检查用户是否已收藏某景点 */
export async function hasFavorited(userId, spotId) {
  const { count, error } = await _supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("spot_id", spotId);
  if (error) throw error;
  return count > 0;
}

/** 收藏 */
export async function favoriteSpot(userId, spotId) {
  try {
    const { data, error } = await _supabase
      .from("favorites")
      .insert({ user_id: userId, spot_id: spotId });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] favoriteSpot 失败:", err);
    throw new Error(_friendlyError(err, "收藏失败，请检查权限或重试"));
  }
}

/** 取消收藏 */
export async function unfavoriteSpot(userId, spotId) {
  try {
    const { data, error } = await _supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("spot_id", spotId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] unfavoriteSpot 失败:", err);
    throw new Error(_friendlyError(err, "取消收藏失败，请检查权限或重试"));
  }
}

/** 获取景点的收藏总数 */
export async function getFavoriteCount(spotId) {
  const { count, error } = await _supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("spot_id", spotId);
  if (error) throw error;
  return count || 0;
}

// ==================== Comments ====================

/** 获取景点的所有评论 */
export async function getComments(spotId) {
  const { data, error } = await _supabase
    .from("comments")
    .select("*")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/** 添加评论 */
export async function addComment(userId, spotId, content) {
  try {
    const { data, error } = await _supabase
      .from("comments")
      .insert({ user_id: userId, spot_id: spotId, content: content })
      .select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] addComment 失败:", err);
    throw new Error(_friendlyError(err, "评论发表失败，请检查权限或重试"));
  }
}

/** 删除评论 */
export async function deleteComment(commentId, userId) {
  try {
    const { data, error } = await _supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] deleteComment 失败:", err);
    throw new Error(_friendlyError(err, "评论删除失败，请检查权限或重试"));
  }
}

/** 获取景点的评论总数 */
export async function getCommentCount(spotId) {
  const { count, error } = await _supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("spot_id", spotId);
  if (error) throw error;
  return count || 0;
}

// ==================== 【核心修复】新增：个人中心专属统计函数 ====================

/** 获取用户创建的景点总数 */
export async function getUserSpotCount(userId) {
  const { count, error } = await _supabase
    .from("spots")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", userId);
  if (error) throw error;
  return count || 0;
}

/** 获取用户获得的点赞总数 */
export async function getUserLikeCount(userId) {
  const { count, error } = await _supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count || 0;
}

/** 用户景点的总浏览量 */
export async function getUserSpotViews(userId) {
  const { data, error } = await _supabase
    .from("spots")
    .select("views")
    .eq("creator_id", userId);
  if (error) throw error;
  return (data || []).reduce((sum, row) => sum + (row.views || 0), 0);
}

/** 用户创建的景点列表 */
export async function getUserSpots(userId) {
  const { data, error } = await _supabase
    .from("spots")
    .select("*")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/** 用户收藏的景点列表 */
export async function getUserFavorites(userId) {
  const { data, error } = await _supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// ==================== Hot Spots（热门景区） ====================

/** 获取所有热门景区（is_hot=true），按浏览量降序 */
export async function getHotSpots() {
  const { data, error } = await _supabase
    .from("spots")
    .select("*")
    .eq("is_hot", true)
    .order("views", { ascending: false });
  if (error) throw error;
  return data || [];
}

/** 获取热门景区排行榜 TOP N */
export async function getHotSpotRanking(limit = 10) {
  const { data, error } = await _supabase
    .from("spots")
    .select("*")
    .order("views", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

/** 浏览量 +1（原子递增） */
export async function incrementViewCount(spotId) {
  const { error } = await _supabase.rpc("increment_spot_views", {
    spot_id: spotId,
  });
  if (error) {
    // RPC 不存在时回退到 update 方式
    console.warn("[db] RPC increment_spot_views 不可用，回退 update:", error.message);
    const { data: current } = await _supabase
      .from("spots")
      .select("views")
      .eq("id", spotId)
      .maybeSingle();
    const newCount = (current?.views || 0) + 1;
    await _supabase
      .from("spots")
      .update({ views: newCount })
      .eq("id", spotId);
  }
}

// ==================== Spot Images ====================

/** 获取景点的所有图片 */
export async function getSpotImages(spotId) {
  const { data, error } = await _supabase
    .from("spot_images")
    .select("*")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/** 保存图片记录到数据库 */
export async function saveSpotImage(spotId, userId, storagePath, url) {
  try {
    const { data, error } = await _supabase
      .from("spot_images")
      .insert({ spot_id: spotId, user_id: userId, storage_path: storagePath, url: url })
      .select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] saveSpotImage 失败:", err);
    throw new Error(_friendlyError(err, "图片保存失败，请检查存储权限或重试"));
  }
}

/** 删除图片记录 */
export async function deleteSpotImage(imageId, userId) {
  try {
    const { data, error } = await _supabase
      .from("spot_images")
      .delete()
      .eq("id", imageId)
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] deleteSpotImage 失败:", err);
    throw new Error(_friendlyError(err, "图片删除失败，请检查权限或重试"));
  }
}

// ==================== Posts（社区帖子） ====================

/** 获取所有帖子（按时间降序） */
export async function getPosts(limit = 50, offset = 0) {
  const { data, error } = await _supabase
    .from("posts")
    .select("*, profiles(username, avatar_url)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data || [];
}

/** 获取用户发布的帖子 */
export async function getUserPosts(userId) {
  const { data, error } = await _supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/** 新增帖子 */
export async function createPost(postData) {
  try {
    const { data, error } = await _supabase
      .from("posts")
      .insert(postData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] createPost 失败:", err);
    throw new Error(_friendlyError(err, "帖子发布失败，请检查权限或重试"));
  }
}

/** 删除帖子（仅本人） */
export async function deletePost(postId, userId) {
  try {
    const { data, error } = await _supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] deletePost 失败:", err);
    throw new Error(_friendlyError(err, "帖子删除失败，请检查权限或重试"));
  }
}

/** 获取帖子总数 */
export async function getPostCount() {
  const { count, error } = await _supabase
    .from("posts")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

// ==================== User Footprints（用户足迹） ====================

/**
 * 获取当前用户的所有足迹
 * @returns {Array<{ id, user_id, spot_id, city_name, created_at }>}
 */
export async function getUserFootprints(userId) {
  const { data, error } = await _supabase
    .from("user_footprints")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
}

/**
 * 添加足迹（点亮城市）
 * @param {string} userId
 * @param {number} spotId
 * @param {string} cityName
 */
export async function addFootprint(userId, spotId, cityName) {
  try {
    const { data, error } = await _supabase
      .from("user_footprints")
      .insert({ user_id: userId, spot_id: spotId, city_name: cityName })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] addFootprint 失败:", err);
    throw new Error(_friendlyError(err, "点亮足迹失败，请检查权限或重试"));
  }
}

/**
 * 移除足迹（取消点亮）
 * @param {string} userId
 * @param {number} spotId
 */
export async function removeFootprint(userId, spotId) {
  try {
    const { data, error } = await _supabase
      .from("user_footprints")
      .delete()
      .eq("user_id", userId)
      .eq("spot_id", spotId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[db] removeFootprint 失败:", err);
    throw new Error(_friendlyError(err, "取消点亮失败，请检查权限或重试"));
  }
}

// ==================== 内部工具 ====================

/**
 * 友好错误翻译：将 Supabase 原始错误转为中文用户提示
 * 保留原始错误 message 供控制台调试，向前端抛出用户可读的兜底文案
 */
function _friendlyError(err, fallback) {
  const code = err?.code;
  const msg = err?.message || "";

  const codeMap = {
    "42501": "权限不足，请检查数据库 RLS 策略",
    "23505": "数据已存在，请勿重复操作",
    "23503": "关联数据不存在，请检查后重试",
    "42P01": "数据表不存在，请联系管理员",
    "PGRST301": "认证已过期，请重新登录",
  };

  if (code && codeMap[code]) return codeMap[code];
  if (msg.includes("JWT")) return "认证已过期，请重新登录";
  if (msg.includes("network") || msg.includes("fetch")) return "网络连接异常，请检查网络";
  if (msg.includes("timeout") || msg.includes("超时")) return "请求超时，请检查网络后重试";

  return fallback;
}
