// ==================== 全局 Auth 状态管理中心 ====================
// 使用 Supabase 的 onAuthStateChange 保持全局状态同步
// 纯状态层 — 不涉及 UI 渲染，UI 层通过 subscribe() 订阅变化
//
// Supabase 客户端从 src/utils/supabaseClient.js 统一导入

import { supabase as _supabaseRef } from "./src/utils/supabaseClient.js";

/**
 * AuthStore 架构
 *
 *   初始化流程:
 *     1. init(supabaseClient) 被调用
 *     2. 同步注册 onAuthStateChange 监听器（必须在 getSession 之前）
 *     3. 调用 getSession() 恢复已有会话
 *     4. 首次会话确定后 loading → false
 *
 *   状态同步:
 *     - 登录/注册 → Supabase 触发 SIGNED_IN → store 更新 user/profile
 *     - 注销 → Supabase 触发 SIGNED_OUT → store 清空 user/profile
 *     - 令牌刷新 → Supabase 触发 TOKEN_REFRESHED → store 更新 user
 *     - 页面刷新 → getSession() 从 localStorage 恢复会话
 *
 *   订阅机制:
 *     store.subscribe(callback) → 返回 unsubscribe 函数
 *     callback 接收 { user, profile, loading } 快照
 */

// ==================== 内部状态 ====================

let _supabase = null;
let _user = null;
let _profile = null;
let _loading = true; // true = 正在获取初始会话
let _subscription = null; // onAuthStateChange 的订阅句柄
let _listeners = new Set();
let _initPromise = null;

// ==================== 公开 Store 对象 ====================

const store = {
  /** 当前用户是否已登录 */
  get isLoggedIn() {
    return !!_user;
  },

  /** 是否正在加载初始会话 */
  get loading() {
    return _loading;
  },

  /** 当前 Supabase Auth 用户对象 */
  get user() {
    return _user;
  },

  /** 当前用户 profiles 表数据 */
  get profile() {
    return _profile;
  },

  /** Supabase 客户端引用（供其他模块使用） */
  get supabase() {
    return _supabase;
  },

  /**
   * 初始化 AuthStore（从 src/utils/supabaseClient.js 直连导入，无需参数）
   * @returns {Promise<void>} 首次会话检查完成后 resolve
   */
  async init() {
    if (_supabase) {
      console.warn("[authStore] 已初始化，跳过重复调用");
      return _initPromise;
    }

    console.log("[authStore:init] ========== init() 开始执行 ==========");

    _supabase = _supabaseRef;

    // 【超级兜底】无论发生什么，3 秒后强制结束 loading
    // 防止 Supabase 网络波动 / getSession 挂起 → 地图永远无法加载
    // 注意：正常情况 getSession 在 100-500ms 内完成，3s 绰绰有余
    const SAFETY_TIMEOUT_MS = 3000;
    const safetyTimer = setTimeout(() => {
      if (_loading) {
        console.warn(
          "[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",
          _supabase?.auth ? "getSession" : "未初始化"
        );
        console.log("[authStore:init] 安全网触发 _profile=%s", _profile ? JSON.stringify({ username: _profile.username }) : "null");
        _loading = false;
        _notifyListeners();
      }
    }, SAFETY_TIMEOUT_MS);

    // 步骤 1：同步注册 onAuthStateChange（必须在 getSession 之前，
    //         确保不会错过 INITIAL_SESSION 事件）
    const { data } = _supabase.auth.onAuthStateChange(
      _onAuthStateChangeHandler
    );
    _subscription = data?.subscription;

    // 步骤 2：异步获取当前会话
    _initPromise = _supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        clearTimeout(safetyTimer); // 正常完成，取消安全网

        const sessionUser = session?.user ?? null;
        const alreadySet =
          _user && sessionUser && _user.id === sessionUser.id;

        console.log("[authStore:getSession] session=%s alreadySet=%s _user=%s _profile=%s",
          sessionUser?.id?.slice(0, 8) || "null",
          alreadySet,
          _user?.id?.slice(0, 8) || "null",
          _profile ? JSON.stringify({ id: _profile.id?.slice(0, 8), username: _profile.username }) : "null"
        );

        if (!alreadySet) {
          _user = sessionUser;
          if (_user) {
            await _fetchProfile();
          } else {
            _profile = null;
          }
        }

        _loading = false;
        _notifyListeners();
      })
      .catch((err) => {
        clearTimeout(safetyTimer);
        console.error("[authStore] getSession 失败:", err);
        _loading = false;
        _notifyListeners();
      });

    return _initPromise;
  },

  /**
   * 登录
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Supabase auth response data
   */
  async signIn(email, password) {
    if (!_supabase) throw new Error("Supabase 客户端未初始化");
    const { data, error } = await _withTimeout(
      _supabase.auth.signInWithPassword({ email, password }),
      15000,
      "登录请求超时，请检查网络后重试"
    );
    if (error) throw error;
    // onAuthStateChange 会自动更新 _user / _profile / notify
    return data;
  },

  /**
   * 注册（只传 email + password，不打包任何 user_metadata 到 options.data）
   * 昵称等元数据在注册成功后通过 updateProfile() 单独写入 profiles 表
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Supabase auth response data
   */
  async signUp(email, password) {
    if (!_supabase) throw new Error("Supabase 客户端未初始化");
    const { data, error } = await _withTimeout(
      _supabase.auth.signUp({ email, password }),
      15000,
      "注册请求超时，请检查网络后重试"
    );
    if (error) throw error;
    return data;
  },

  /**
   * 注销
   * 调用 Supabase signOut 后，onAuthStateChange 会自动触发 SIGNED_OUT
   * 这里也做本地清理作为防御（防止 onAuthStateChange 未触发的情况）
   */
  async signOut() {
    if (!_supabase) return;
    try {
      await _withTimeout(
        _supabase.auth.signOut(),
        10000,
        "注销请求超时"
      );
    } catch (err) {
      console.error("[authStore] signOut 失败:", err);
    }
    // 防御性清理：即使 onAuthStateChange 未触发，也要清空状态
    _user = null;
    _profile = null;
    _notifyListeners();
  },

  /**
   * 更新个人资料
   * @param {object} updates - { username, bio, avatar_url }
   */
  async updateProfile(updates) {
    if (!_user) throw new Error("未登录");
    const { data, error } = await _supabase
      .from("profiles")
      .update(updates)
      .eq("id", _user.id)
      .select("*")
      .single();

    if (error) throw error;
    _profile = data;
    _notifyListeners();
    return data;
  },

  /**
   * 订阅状态变更
   * @param {(snapshot: {user, profile, loading}) => void} callback
   * @returns {() => void} 取消订阅的函数
   */
  subscribe(callback) {
    _listeners.add(callback);
    // 立即推送当前状态
    try {
      callback(_snapshot());
    } catch (e) {
      console.warn("[authStore] subscribe 初始回调出错:", e);
    }
    return () => {
      _listeners.delete(callback);
    };
  },

  /**
   * 获取头像 URL（优先 profile.avatar_url，兜底 dicebear）
   */
  getAvatarUrl() {
    if (_profile?.avatar_url) return _profile.avatar_url;
    const seed = _user?.id || "default";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  },

  /**
   * 获取显示名称
   */
  getDisplayName() {
    const result = (
      _profile?.username ||
      _user?.user_metadata?.username ||
      _user?.email?.split("@")[0] ||
      "用户"
    );
    console.log("[authStore:getDisplayName] _profile?.username=%s user_metadata?.username=%s email=%s → 最终值=%s",
      _profile?.username || "null",
      _user?.user_metadata?.username || "null",
      _user?.email || "null",
      result
    );
    return result;
  },
};

// ==================== 内部函数 ====================

/**
 * onAuthStateChange 回调
 * 覆盖所有 Supabase 认证事件：
 *   INITIAL_SESSION — SDK 启动时从 localStorage 恢复会话
 *   SIGNED_IN        — 用户登录/注册成功
 *   SIGNED_OUT       — 用户注销
 *   TOKEN_REFRESHED  — 令牌自动刷新
 *   USER_UPDATED     — 用户属性更新
 *   PASSWORD_RECOVERY — 密码恢复
 */
async function _onAuthStateChangeHandler(event, session) {
  console.log("[authStore] 认证事件:", event, session?.user?.email);
  console.log("[authStore:onAuthStateChange] 收到事件 event=%s sessionUser=%s _user=%s _profile=%s _loading=%s",
    event,
    session?.user?.id?.slice(0, 8) || "null",
    _user?.id?.slice(0, 8) || "null",
    _profile ? JSON.stringify({ id: _profile.id?.slice(0, 8), username: _profile.username }) : "null",
    _loading
  );

  try {
    const sessionUser = session?.user ?? null;

    // 用户变了才重新拉 profile（避免 TOKEN_REFRESHED 等不必要的 RPC）
    const userIdChanged =
      (_user && sessionUser && _user.id !== sessionUser.id) ||
      (!_user && sessionUser) ||
      (_user && !sessionUser);

    _user = sessionUser;

    if (_user && userIdChanged) {
      await _fetchProfile();
    } else if (!_user) {
      _profile = null;
    }
    // 用户未变（仅 TOKEN_REFRESHED）→ 保持现有 _profile
  } catch (err) {
    // 防御：即使 _fetchProfile 或其他逻辑抛异常，也不能阻断 loading 状态更新
    console.error("[authStore] onAuthStateChange 处理异常:", err);
    _profile = _user ? _buildFallbackProfile() : null;
  }

  // 首次认证事件后，loading 结束（无论如何都要执行到这里）
  if (_loading) _loading = false;

  _notifyListeners();
}

/** 从 profiles 表拉取用户资料（带超时保护 + 自动创建 + 详细错误区分） */
async function _fetchProfile() {
  if (!_user) return;

  console.log("[authStore:_fetchProfile] ========== 开始执行 user.id=%s ==========", _user.id?.slice(0, 8));

  // ====== 步骤 1：查询 profiles 表 ======
  let data, error;
  try {
    console.log("[authStore:_fetchProfile] 查询前 user.id=%s", _user.id);
    const result = await _withTimeout(
      _supabase
        .from("profiles")
        .select("*")
        .eq("id", _user.id)
        .maybeSingle(),
      8000,
      "profiles 查询超时"
    );
    data = result.data;
    error = result.error;

    console.log("[authStore:_fetchProfile] 查询结束 data=%s error=%s",
      data ? JSON.stringify({ id: data.id?.slice(0, 8), username: data.username, avatar_url: data.avatar_url }) : "null",
      error ? (error.code || error.message) : "null"
    );
  } catch (err) {
    // 网络超时 / 连接中断
    console.log("[authStore:_fetchProfile] 查询异常 err=%s", err.message);
    if (err.message?.includes("超时")) {
      console.warn("[authStore] profiles 查询超时，使用兜底 profile");
    } else {
      console.error("[authStore] profiles 查询网络异常:", err.message);
    }
    _profile = _buildFallbackProfile();
    return;
  }

  if (error) {
    // 区分错误类型
    const code = error?.code;
    const hint = error?.hint || "";
    console.log("[authStore:_fetchProfile] 查询出错 code=%s hint=%s message=%s", code, hint, error.message);
    if (code === "PGRST301" || hint.includes("JWT")) {
      // 401 — JWT 无效/过期（通常已被 onAuthStateChange 修复）
      console.warn("[authStore] profiles 查询 401 (JWT):", error.message);
    } else if (hint.includes("permission") || code === "42501") {
      // 403 — RLS 拒绝（应检查 RLS 策略）
      console.error("[authStore] profiles 查询 403 (RLS):", error.message);
    } else {
      console.warn("[authStore] profiles 查询失败:", error.message, "| code:", code);
    }
    _profile = _buildFallbackProfile();
    return;
  }

  // ====== 步骤 2：data 为空 → 自动创建 profile（使用 upsert 防竞态） ======
  if (!data) {
    console.log("[authStore:_fetchProfile] data 为 null → 自动创建 profile");
    console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");
    const nickname =
      _user.user_metadata?.nickname ||
      _user.user_metadata?.username ||
      _user.email?.split("@")[0] ||
      "";

    try {
      // 使用 upsert 而非 insert — 防止 onAuthStateChange 和 getSession 同时触发造成竞态冲突
      const upsertResult = await _withTimeout(
        _supabase.from("profiles").upsert(
          {
            id: _user.id,
            username: nickname,
            avatar_url: _user.user_metadata?.avatar_url || "",
            bio: "",
          },
          { onConflict: "id", ignoreDuplicates: false }
        ),
        8000,
        "profiles 创建超时"
      );

      if (upsertResult.error) {
        console.warn(
          "[authStore] 自动创建 profile 失败:",
          upsertResult.error.message,
          "| code:",
          upsertResult.error.code
        );
        _profile = _buildFallbackProfile();
        return;
      }

      // ====== 步骤 3：upsert 成功后再次查询 ======
      try {
        const requeryResult = await _withTimeout(
          _supabase
            .from("profiles")
            .select("*")
            .eq("id", _user.id)
            .maybeSingle(),
          5000,
          "profiles 二次查询超时"
        );
        if (requeryResult.error) {
          console.warn("[authStore] 二次查询 profile 出错:", requeryResult.error.message);
        } else if (requeryResult.data) {
          _profile = requeryResult.data;
          console.log("[authStore:_fetchProfile] upsert后二次查询成功 username=%s", _profile?.username);
          console.log("[authStore] profile 自动创建并查询成功");
          return;
        }
      } catch (requeryErr) {
        console.warn("[authStore] 二次查询 profile 异常:", requeryErr.message);
      }
    } catch (upsertErr) {
      console.warn("[authStore] 自动创建 profile 异常:", upsertErr.message);
    }

    // 创建或二次查询失败 → fallback
    _profile = _buildFallbackProfile();
    return;
  }

  // ====== 步骤 4：data 存在 → 正常赋值 ======
  _profile = data;
  console.log("[authStore:_fetchProfile] _profile = data 正常赋值 username=%s avatar_url=%s",
    _profile?.username, _profile?.avatar_url
  );
}

/** 构建兜底 profile（user_metadata 或 email 前缀） */
function _buildFallbackProfile() {
  console.log("[authStore:_buildFallbackProfile] ⚠️ 兜底 profile 被调用！_user.id=%s user_metadata.username=%s email=%s",
    _user?.id?.slice(0, 8),
    _user?.user_metadata?.username || "null",
    _user?.email || "null"
  );
  console.trace("[authStore:_buildFallbackProfile] 调用栈:");
  if (!_user) return null;
  return {
    id: _user.id,
    username:
      _user.user_metadata?.username || _user.email?.split("@")[0] || "",
    avatar_url: _user.user_metadata?.avatar_url || null,
    bio: "",
  };
}

/** 通知所有订阅者 */
function _notifyListeners() {
  const snapshot = _snapshot();
  console.log("[authStore:_notifyListeners] snapshot.profile=%s snapshot.user=%s _loading=%s",
    snapshot.profile ? JSON.stringify({ id: snapshot.profile.id?.slice(0, 8), username: snapshot.profile.username }) : "null",
    snapshot.user?.id?.slice(0, 8) || "null",
    snapshot.loading
  );
  _listeners.forEach((cb) => {
    try {
      cb(snapshot);
    } catch (e) {
      console.warn("[authStore] 订阅回调出错:", e);
    }
  });
}

/** 生成当前状态快照 */
function _snapshot() {
  return {
    user: _user,
    profile: _profile,
    loading: _loading,
  };
}

/**
 * Promise 超时包装器
 */
function _withTimeout(promise, timeoutMs, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

// ==================== 导出 ====================

export default store;
