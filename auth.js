// ==================== Supabase Auth 模块 ====================
// UI 层 — 负责创建认证 UI 并绑定 store 状态
// 状态管理全部由 authStore.js 负责

import store from "./authStore.js";
import { transitionManager } from "./transition.js";
import { openShareModal } from "./shareModal.js";
import {
  getUserSpotCount,
  getUserLikeCount,
  getUserSpotViews,
  getUserSpots,
  getUserFavorites,
} from "./db.js";

// ==================== 公开 API（向后兼容） ====================

/**
 * 初始化认证模块
 * 1. 初始化 store（getSession + onAuthStateChange）
 * 2. 等待 store 就绪后创建 UI 并订阅状态
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 */
export async function initAuth() {
  // store 从 src/utils/supabaseClient.js 直连导入 Supabase 客户端，无需参数
  await store.init();

  // 步骤 2：store 就绪后创建 UI
  // （此时 store.user/store.loading 已经确定了当前会话状态）
  _createAuthUI();

  // 步骤 3：订阅 store 状态变更，自动更新 UI
  store.subscribe((snapshot) => {
    _updateUI(snapshot);
  });
}

/** 注册认证状态变更回调（向后兼容） */
export function onAuthChange(callback) {
  return store.subscribe(({ user, profile }) => {
    callback(user, profile);
  });
}

/** 获取当前 Supabase Auth 用户对象 */
export function getUser() {
  return store.user;
}

/** 获取当前用户 profiles 表数据 */
export function getProfile() {
  return store.profile;
}

/** 是否已登录 */
export function isLoggedIn() {
  return store.isLoggedIn;
}

/** 获取头像 URL */
export function getAvatarUrl() {
  return store.getAvatarUrl();
}

/** 获取显示名称 */
export function getDisplayName() {
  return store.getDisplayName();
}

/** 登录 */
export async function signIn(email, password) {
  return store.signIn(email, password);
}

/** 注册 */
export async function signUp(email, password) {
  return store.signUp(email, password);
}

/** 注销 */
export async function signOut() {
  return store.signOut();
}

/** 更新个人资料 */
export async function updateProfile(updates) {
  return store.updateProfile(updates);
}

/**
 * 打开个人中心弹窗（供外部模块调用，如顶部导航栏）
 * 替代已删除的下拉菜单"个人中心"选项
 */
export function openProfileCenter() {
  _openProfileCenter();
}

// ==================== 【新增】模块内 Toast 通知 ====================
// 轻量级非阻塞提示 — 不依赖 main.js 的 _showToast，模块自包含
// 注册成功 / 退出等反馈直接使用此工具，不弹 alert

let _toastContainer = null;

/**
 * 显示一条短暂的成功/错误提示
 * @param {string} msg     - 提示文本
 * @param {'success'|'error'|'info'} [type='success']
 * @param {number} [duration=3000]
 */
function _toast(msg, type = "success", duration = 3000) {
  if (!_toastContainer) {
    _toastContainer = document.createElement("div");
    _toastContainer.id = "auth-toast-container";
    _toastContainer.style.cssText =
      "position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;" +
      "display:flex;flex-direction:column;align-items:center;gap:8px;" +
      "pointer-events:none;";
    document.body.appendChild(_toastContainer);
  }

  const colors = {
    success: "rgba(16,185,129,0.92)",
    error:   "rgba(239,68,68,0.92)",
    info:    "rgba(59,130,246,0.92)",
  };

  const el = document.createElement("div");
  el.style.cssText =
    `background:${colors[type] || colors.info};` +
    "color:#fff;padding:12px 24px;border-radius:10px;" +
    "font-size:15px;text-align:center;max-width:340px;" +
    "box-shadow:0 8px 32px rgba(0,0,0,0.45);" +
    "pointer-events:auto;" +
    "animation:auth-toast-in 0.3s ease-out;" +
    "transition:opacity 0.25s ease,transform 0.25s ease;";
  el.textContent = msg;
  _toastContainer.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-12px)";
    setTimeout(() => el.remove(), 250);
  }, duration);
}

// 注入 Toast 动画（仅一次）
(function _injectAuthToastStyles() {
  if (document.getElementById("auth-toast-styles")) return;
  const s = document.createElement("style");
  s.id = "auth-toast-styles";
  s.textContent =
    "@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}";
  document.head.appendChild(s);
})();

// ==================== UI ====================

function _createAuthUI() {
  // ---- 右上角用户按钮 ----
  const userBtn = document.createElement("div");
  userBtn.id = "auth-user-btn";
  userBtn.innerHTML = `
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `;
  userBtn.addEventListener("click", () => {
    if (store.isLoggedIn) {
      _toggleUserMenu();
    } else {
      _openModal("login");
    }
  });
  document.body.appendChild(userBtn);

  // ---- 用户下拉菜单（精简版：仅编辑资料 + 退出登录） ----
  // 顶部导航栏已有"个人中心"入口，下拉菜单不再重复
  const menu = document.createElement("div");
  menu.id = "auth-user-menu";
  menu.className = "auth-user-menu";
  menu.innerHTML = `
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `;
  menu.querySelector("#auth-menu-logout").addEventListener("click", async () => {
    _closeUserMenu();
    await signOut();
  });
  menu.querySelector("#auth-menu-edit-profile").addEventListener("click", () => {
    _closeUserMenu();
    _openEditProfileModal();
  });
  document.body.appendChild(menu);

  document.addEventListener("click", (e) => {
    if (!userBtn.contains(e.target) && !menu.contains(e.target)) {
      _closeUserMenu();
    }
  });

  // ---- 登录/注册弹窗 ----
  _createAuthModal();

  // ---- 编辑资料弹窗 ----
  _createEditProfileModal();

  // ---- 个人中心弹窗 ----
  _createProfileCenterModal();

  // ---- 修改密码弹窗 ----
  _createChangePasswordModal();

  // 初始 UI 渲染（根据当前 store 状态）
  _updateUI({ user: store.user, profile: store.profile, loading: store.loading });
}

function _createAuthModal() {
  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.className = "auth-modal";
  modal.innerHTML = `
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>

      <!-- 登录表单 -->
      <div class="auth-form" id="auth-form-login">
        <h2>欢迎回来</h2>
        <p class="auth-form-sub">登录以管理你的足迹收藏</p>
        <input type="email" id="auth-login-email" placeholder="邮箱地址" autocomplete="email" />
        <input type="password" id="auth-login-password" placeholder="密码" autocomplete="current-password" />
        <button id="auth-login-submit">登录</button>
        <p class="auth-form-switch">
          还没有账号？<span id="auth-switch-register">立即注册</span>
        </p>
        <p class="auth-form-error" id="auth-login-error"></p>
      </div>

      <!-- 注册表单 (默认隐藏) -->
      <div class="auth-form" id="auth-form-register" style="display:none">
        <h2>加入旅行地球</h2>
        <p class="auth-form-sub">分享你的足迹，探索全世界</p>
        <input type="text" id="auth-register-displayname" placeholder="你的昵称" autocomplete="nickname" />
        <input type="email" id="auth-register-email" placeholder="邮箱地址" autocomplete="email" />
        <input type="password" id="auth-register-password" placeholder="密码（至少6位）" autocomplete="new-password" />
        <button id="auth-register-submit">注册</button>
        <p class="auth-form-switch">
          已有账号？<span id="auth-switch-login">去登录</span>
        </p>
        <p class="auth-form-error" id="auth-register-error"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 弹窗事件
  modal.querySelector(".auth-modal-overlay").addEventListener("click", _closeModal);
  modal.querySelector(".auth-modal-close").addEventListener("click", _closeModal);
  modal.querySelector("#auth-switch-register").addEventListener("click", () => _switchForm("register"));
  modal.querySelector("#auth-switch-login").addEventListener("click", () => _switchForm("login"));

  // ==================== 登录提交 ====================
  modal.querySelector("#auth-login-submit").addEventListener("click", async () => {
    const email = modal.querySelector("#auth-login-email").value.trim();
    const password = modal.querySelector("#auth-login-password").value;
    const errorEl = modal.querySelector("#auth-login-error");
    const btn = modal.querySelector("#auth-login-submit");

    if (!email || !password) {
      errorEl.textContent = "请填写邮箱和密码";
      return;
    }
    if (!store.supabase) {
      errorEl.textContent = "服务未初始化，请刷新页面";
      return;
    }

    errorEl.textContent = "";
    btn.disabled = true;
    btn.textContent = "登录中...";

    try {
      await signIn(email, password);
      _closeModal();
      _clearForms();
    } catch (err) {
      errorEl.textContent = _translateAuthError(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "登录";
    }
  });

  // ==================== 注册提交【核心重构】 ====================
  // 背景：Supabase 后台已关闭 "Confirm email" 邮箱验证功能
  //        → signUp 后会直接返回有效的 session + user 对象
  //        → 无需用户再去邮箱点击确认链接，注册即登录
  //
  // 流程：
  //   ① 表单验证（昵称/邮箱/密码）
  //   ② 调用 store.signUp() → Supabase auth.signUp()
  //   ③ Supabase 返回 { user, session }
  //      - 有 session → 邮箱验证已关闭，直接登录 → 弹出成功 toast + 关闭弹窗
  //      - 无 session → 邮箱验证开启（兜底）→ 提示检查邮箱
  //   ④ onAuthStateChange 自动同步全局 user 状态（authStore.js 负责）
  //   ⑤ 错误捕获 → 中文友好提示
  modal.querySelector("#auth-register-submit").addEventListener("click", async () => {
    const displayName = modal.querySelector("#auth-register-displayname").value.trim();
    const email = modal.querySelector("#auth-register-email").value.trim();
    const password = modal.querySelector("#auth-register-password").value;
    const errorEl = modal.querySelector("#auth-register-error");
    const btn = modal.querySelector("#auth-register-submit");

    // ---- 第 1 层校验：表单完整性 ----
    if (!displayName) {
      errorEl.textContent = "请输入你的昵称";
      errorEl.style.color = "";
      return;
    }
    if (!email) {
      errorEl.textContent = "请输入邮箱地址";
      errorEl.style.color = "";
      return;
    }
    if (!password) {
      errorEl.textContent = "请输入密码";
      errorEl.style.color = "";
      return;
    }
    // 邮箱格式快速校验
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = "邮箱格式不正确，请检查后重试";
      errorEl.style.color = "";
      return;
    }
    // 密码长度校验
    if (password.length < 6) {
      errorEl.textContent = "密码至少需要6位，请重新设置";
      errorEl.style.color = "";
      return;
    }
    // 昵称长度
    if (displayName.length > 50) {
      errorEl.textContent = "昵称不能超过50个字符";
      errorEl.style.color = "";
      return;
    }
    if (!store.supabase) {
      errorEl.textContent = "服务未初始化，请刷新页面";
      errorEl.style.color = "";
      return;
    }

    // ---- 第 2 层：清空旧错误 + 显示加载态 ----
    errorEl.textContent = "";
    errorEl.style.color = "";
    btn.disabled = true;
    btn.textContent = "注册中...";

    try {
      // ---- 第 3 层：调用 Supabase 注册 API ----
      // 只传 email + password，不打包任何 user_metadata
      // 昵称在注册成功后通过 store.updateProfile() 单独写入 profiles 表
      // authStore.signUp() 返回 Supabase 原始 data:
      //   { user: {...}, session: {...} }   ← 邮箱验证关闭时
      //   { user: {...}, session: null }     ← 邮箱验证开启时
      const { user, session } = await signUp(email, password);

      if (session) {
        // ============================================================
        // ✅ 邮箱验证已关闭 → 注册即登录成功，session 和 user 已就绪
        //    onAuthStateChange 已在 authStore 中自动触发
        //    _user / _profile 状态已同步 → 全局 isLoggedIn === true
        // ============================================================

        // ① 单独写入昵称到 profiles 表（signUp 不传 options.data 避免 500）
        if (displayName) {
          try {
            await store.updateProfile({ username: displayName });
          } catch (profileErr) {
            console.warn("[auth] 注册后更新 profile 昵称失败（非致命）:", profileErr);
            // 不阻断注册流程 — onAuthStateChange + _fetchProfile 会自动回退到 email 前缀
          }
        }

        // ② 显示绿色成功提示（表单内，短暂可见）
        errorEl.style.color = "rgba(80, 230, 140, 0.95)";
        errorEl.textContent = "🎉 注册成功！已为您自动登录系统。";

        // ③ 屏幕顶部绿色 Toast（全局可见，大屏手机也能看到）
        const displayLabel = displayName || email.split("@")[0] || "用户";
        _toast(`🎉 注册成功！已为您自动登录系统。\n欢迎加入旅行地球，${displayLabel}！`, "success", 3500);

        // ④ 1.2 秒后关闭弹窗 + 清空表单
        //    延迟是为了让用户看到成功提示，不会一闪而过
        const timerId = setTimeout(() => {
          _closeModal();
          _clearForms();
          delete modal.dataset._registerTimer;
        }, 1200);
        modal.dataset._registerTimer = String(timerId);

      } else {
        // ============================================================
        // ⚠️ 邮箱验证仍然开启（兜底分支）
        //    Supabase 返回 user 但没有 session
        //    用户需要去邮箱点击确认链接后才能登录
        // ============================================================
        errorEl.style.color = "rgba(100, 200, 255, 0.95)";
        errorEl.textContent = "📧 注册成功！请查看邮箱中的确认链接完成验证。\n（如未收到，请检查垃圾邮件箱）";

        // 3 秒后自动切回登录表单
        const timerId = setTimeout(() => {
          errorEl.style.color = "";
          _switchForm("login");
          delete modal.dataset._registerTimer;
        }, 3500);
        modal.dataset._registerTimer = String(timerId);
      }

    } catch (err) {
      // ---- 第 4 层：错误捕获 → 打印真实错误细节 + 中文友好提示 ----
      console.error("Supabase注册深度报错对象:", err);
      console.error("  · message:", err?.message);
      console.error("  · status:", err?.status);
      console.error("  · code:", err?.code);
      console.error("  · stack:", err?.stack);
      // 前端弹窗显示关键诊断信息
      const friendlyMsg = _translateAuthError(err.message);
      errorEl.style.color = "";
      errorEl.textContent = `${friendlyMsg}\n[错误码: ${err?.status || "未知"} | ${err?.code || "N/A"}]`;
    } finally {
      btn.disabled = false;
      btn.textContent = "注册";
    }
  });

  // 键盘回车提交
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const loginVisible = modal.querySelector("#auth-form-login").style.display !== "none";
      if (loginVisible) {
        modal.querySelector("#auth-login-submit").click();
      } else {
        modal.querySelector("#auth-register-submit").click();
      }
    }
  });
}

function _createEditProfileModal() {
  // ---- 内部状态 (closure) ----
  let _uploading = false;   // 上传 Loading 状态
  let _avatarUrl = "";      // 当前已确认的头像 URL (来自数据库或上传成功后的 Supabase Storage URL)

  const modal = document.createElement("div");
  modal.id = "edit-profile-modal";
  modal.className = "auth-modal";
  modal.innerHTML = `
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-form">
        <h2>编辑资料</h2>
        <p class="auth-form-sub">修改你的个人资料</p>

        <!-- 头像上传区 -->
        <div class="edit-avatar-section">
          <label class="edit-avatar-label" id="edit-avatar-label">
            <div class="edit-avatar-ring" id="edit-avatar-ring">
              <img id="edit-avatar-img" class="edit-avatar-img" src="" alt="头像" />
              <div class="edit-avatar-hover" id="edit-avatar-hover">
                <span id="edit-avatar-hover-text">更换头像</span>
              </div>
              <!-- 上传中遮罩 -->
              <div class="edit-avatar-uploading" id="edit-avatar-uploading" style="display:none">
                <span class="edit-avatar-spinner"></span>
                <span>上传中...</span>
              </div>
            </div>
            <!-- 文件选择器必须在 label 内部才能被触发 -->
            <input type="file" id="edit-avatar-file" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none" />
          </label>
          <p class="edit-avatar-hint" id="edit-avatar-hint">点击头像更换图片</p>
        </div>

        <!-- 隐藏 input 保存最终 avatar_url -->
        <input type="hidden" id="edit-avatar-url" value="" />

        <input type="text" id="edit-display-name" placeholder="显示名称" />
        <input type="text" id="edit-bio" placeholder="个人简介" />

        <button id="edit-profile-submit">保存</button>
        <p class="auth-form-error" id="edit-profile-error"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ---- DOM 引用 ----
  const avatarLabel   = modal.querySelector("#edit-avatar-label");
  const avatarImg     = modal.querySelector("#edit-avatar-img");
  const avatarHover   = modal.querySelector("#edit-avatar-hover");
  const hoverText     = modal.querySelector("#edit-avatar-hover-text");
  const uploadingOverlay = modal.querySelector("#edit-avatar-uploading");
  const fileInput     = modal.querySelector("#edit-avatar-file");
  const hiddenUrl     = modal.querySelector("#edit-avatar-url");
  const displayInput  = modal.querySelector("#edit-display-name");
  const bioInput      = modal.querySelector("#edit-bio");
  const errorEl       = modal.querySelector("#edit-profile-error");
  const submitBtn     = modal.querySelector("#edit-profile-submit");
  const hintEl        = modal.querySelector("#edit-avatar-hint");

  // ---- 工具: 设置头像预览 ----
  function _setAvatarPreview(url) {
    if (url) {
      avatarImg.src = url;
      avatarImg.style.display = "block";
      hoverText.textContent = "更换头像";
    } else {
      avatarImg.src = "";
      avatarImg.style.display = "none";
      hoverText.textContent = "设置头像";
    }
    avatarHover.style.display = "";
    uploadingOverlay.style.display = "none";
    _uploading = false;
  }

  // ---- 文件选择 → 上传到 Supabase Storage ----
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // 文件大小限制 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      errorEl.textContent = "图片不能超过 5MB，请重新选择";
      fileInput.value = "";
      return;
    }

    errorEl.textContent = "";

    // 显示上传遮罩
    avatarHover.style.display = "none";
    uploadingOverlay.style.display = "flex";
    _uploading = true;

    try {
      // 生成唯一文件名: <userId>-<timestamp>.<ext>
      const userId = store.user?.id || "anonymous";
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${userId}-${Date.now()}.${ext}`;

      // 上传到 Supabase Storage 'avatars' 桶
      const { error: uploadError } = await store.supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 获取公开 URL
      const { data: publicUrlData } = store.supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl || "";
      if (!publicUrl) throw new Error("获取头像 URL 失败");

      // 更新状态
      _avatarUrl = publicUrl;
      hiddenUrl.value = publicUrl;
      _setAvatarPreview(publicUrl);
      hintEl.textContent = "头像上传成功 ✓";
      hintEl.style.color = "rgba(80,230,140,0.9)";
    } catch (err) {
      console.error("[auth] 头像上传失败:", err);
      errorEl.textContent = "头像上传失败：" + (err.message || "请检查网络或存储桶权限");
      _setAvatarPreview(_avatarUrl); // 回退到旧头像
      hintEl.textContent = "点击头像更换图片";
      hintEl.style.color = "";
    } finally {
      fileInput.value = "";
    }
  });

  // ---- 弹窗关闭 ----
  modal.querySelector(".auth-modal-overlay").addEventListener("click", () => {
    transitionManager.closeModal(modal);
  });
  modal.querySelector(".auth-modal-close").addEventListener("click", () => {
    transitionManager.closeModal(modal);
  });

  // ---- 保存按钮 ----
  submitBtn.addEventListener("click", async () => {
    const displayName = displayInput.value.trim();
    const bio = bioInput.value.trim();
    const finalAvatarUrl = hiddenUrl.value.trim();

    if (!displayName) {
      errorEl.textContent = "显示名称不能为空";
      return;
    }

    if (_uploading) {
      errorEl.textContent = "头像正在上传中，请稍候...";
      return;
    }

    errorEl.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "保存中...";

    try {
      const updates = {
        username: displayName,
        bio: bio || "",
        updated_at: new Date().toISOString(),
      };
      if (finalAvatarUrl) updates.avatar_url = finalAvatarUrl;
      await updateProfile(updates);
      transitionManager.closeModal(modal);
      _toast("✅ 资料保存成功", "success", 2000);
    } catch (err) {
      errorEl.textContent = "保存失败：" + err.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "保存";
    }
  });

  // 暴露方法供 _openEditProfileModal 使用
  modal._setAvatarUrl = function (url) {
    _avatarUrl = url || "";
    hiddenUrl.value = _avatarUrl;
    _setAvatarPreview(_avatarUrl);
    hintEl.textContent = "点击头像更换图片";
    hintEl.style.color = "";
  };
  modal._setDisplayName = function (val) { displayInput.value = val || ""; };
  modal._setBio = function (val) { bioInput.value = val || ""; };
  modal._clearError = function () { errorEl.textContent = ""; };
}

// ==================== 【新增】修改密码弹窗 ====================

/**
 * 创建修改密码弹窗
 * 调用 Supabase auth.updateUser({ password }) API 重置密码
 * 要求用户输入两次新密码并校验一致性
 */
function _createChangePasswordModal() {
  const modal = document.createElement("div");
  modal.id = "change-password-modal";
  modal.className = "auth-modal";
  modal.innerHTML = `
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-form">
        <h2>🔑 修改密码</h2>
        <p class="auth-form-sub">设置一个新的登录密码</p>

        <!-- 新密码 -->
        <input
          type="password"
          id="change-pw-new"
          placeholder="请输入新密码（至少6位）"
          autocomplete="new-password"
        />

        <!-- 确认新密码 -->
        <input
          type="password"
          id="change-pw-confirm"
          placeholder="请再次确认新密码"
          autocomplete="new-password"
        />

        <!-- 密码强度提示 -->
        <p id="change-pw-strength" style="
          display:none;margin:4px 0 0;font-size:12px;
          text-align:center;min-height:18px;
        "></p>

        <button id="change-pw-submit">确认修改</button>
        <p class="auth-form-error" id="change-pw-error"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 关闭事件
  modal.querySelector(".auth-modal-overlay").addEventListener("click", () => {
    transitionManager.closeModal(modal);
  });
  modal.querySelector(".auth-modal-close").addEventListener("click", () => {
    transitionManager.closeModal(modal);
  });

  // ---- 实时密码强度检测 ----
  const newPwInput = modal.querySelector("#change-pw-new");
  const strengthEl = modal.querySelector("#change-pw-strength");

  newPwInput.addEventListener("input", () => {
    const pw = newPwInput.value;
    if (!pw) {
      strengthEl.style.display = "none";
      return;
    }
    strengthEl.style.display = "block";
    const score = _passwordStrength(pw);
    if (score < 2) {
      strengthEl.textContent = "🔴 密码强度：弱";
      strengthEl.style.color = "rgba(255, 120, 120, 0.9)";
    } else if (score < 4) {
      strengthEl.textContent = "🟡 密码强度：中等";
      strengthEl.style.color = "rgba(251, 191, 36, 0.9)";
    } else {
      strengthEl.textContent = "🟢 密码强度：强";
      strengthEl.style.color = "rgba(80, 230, 140, 0.9)";
    }
  });

  // ---- 提交修改密码 ----
  modal.querySelector("#change-pw-submit").addEventListener("click", async () => {
    const newPassword = newPwInput.value;
    const confirmPassword = modal.querySelector("#change-pw-confirm").value;
    const errorEl = modal.querySelector("#change-pw-error");
    const btn = modal.querySelector("#change-pw-submit");

    // ---- 第 1 层：前端表单校验 ----
    if (!newPassword) {
      errorEl.textContent = "请输入新密码";
      errorEl.style.color = "";
      return;
    }
    if (newPassword.length < 6) {
      errorEl.textContent = "新密码至少需要6位";
      errorEl.style.color = "";
      return;
    }
    if (!confirmPassword) {
      errorEl.textContent = "请再次输入新密码进行确认";
      errorEl.style.color = "";
      return;
    }
    if (newPassword !== confirmPassword) {
      errorEl.textContent = "两次输入的密码不一致，请检查后重试";
      errorEl.style.color = "";
      return;
    }
    if (!store.supabase) {
      errorEl.textContent = "服务未初始化，请刷新页面后重试";
      errorEl.style.color = "";
      return;
    }

    // ---- 第 2 层：加载态 ----
    errorEl.textContent = "";
    errorEl.style.color = "";
    btn.disabled = true;
    btn.textContent = "修改中...";

    try {
      // ---- 第 3 层：调用 Supabase 密码重置 API ----
      // auth.updateUser() 仅更新当前已登录用户的属性
      // 成功后会返回更新后的 user 对象
      const { data, error } = await store.supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // ---- 第 4 层：成功反馈 ----
      // ① 表单内绿色提示
      errorEl.style.color = "rgba(80, 230, 140, 0.95)";
      errorEl.textContent = "🔐 密码修改成功！";

      // ② 全局 Toast
      _toast("🔐 密码修改成功！下次登录请使用新密码。", "success", 3500);

      // ③ 1.5 秒后关闭弹窗 + 清空输入框
      setTimeout(() => {
        transitionManager.closeModal(modal);
        newPwInput.value = "";
        modal.querySelector("#change-pw-confirm").value = "";
        strengthEl.style.display = "none";
        errorEl.textContent = "";
        errorEl.style.color = "";
      }, 1500);

    } catch (err) {
      // ---- 第 5 层：错误处理 ----
      const friendlyMsg = _translateAuthError(err.message);
      errorEl.style.color = "";
      errorEl.textContent = friendlyMsg;
      console.error("[auth] 修改密码失败:", err.message, "| 原始错误:", err);
    } finally {
      btn.disabled = false;
      btn.textContent = "确认修改";
    }
  });

  // 键盘回车提交
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const btn = modal.querySelector("#change-pw-submit");
      if (btn && !btn.disabled) btn.click();
    }
  });
}

/**
 * 打开修改密码弹窗
 */
function _openChangePasswordModal() {
  const modal = document.getElementById("change-password-modal");
  if (!modal) return;
  // 清空上次残留
  modal.querySelector("#change-pw-new").value = "";
  modal.querySelector("#change-pw-confirm").value = "";
  const strengthEl = modal.querySelector("#change-pw-strength");
  if (strengthEl) strengthEl.style.display = "none";
  const errorEl = modal.querySelector("#change-pw-error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.color = "";
  }
  transitionManager.openModal(modal);
}

/**
 * 评估密码强度（0-5 分）
 * 规则：
 *   +1 长度 >= 6
 *   +1 长度 >= 10
 *   +1 包含数字
 *   +1 包含大写字母
 *   +1 包含特殊字符 (!@#$%^&*)
 */
function _passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  return score;
}

function _openEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (!modal) return;
  const profile = store.profile;
  modal._setAvatarUrl(profile?.avatar_url || "");
  modal._setDisplayName(profile?.username || "");
  modal._setBio(profile?.bio || "");
  modal._clearError();
  transitionManager.openModal(modal);
}

// ==================== 个人中心 ====================

function _createProfileCenterModal() {
  const modal = document.createElement("div");
  modal.id = "profile-center-modal";
  modal.className = "auth-modal";
  modal.innerHTML = `
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel profile-center-panel">
      <!-- 关闭按钮 -->
      <button class="auth-modal-close">&times;</button>

      <!-- 加载态 -->
      <div class="profile-center-loading" id="profile-center-loading">
        <div class="pc-spinner"></div>
        <p id="profile-center-loading-text">加载中...</p>
      </div>

      <!-- 主体内容 -->
      <div class="profile-center-body" id="profile-center-body" style="display:none">
        <!-- 头像区：渐变边框环 + 头像 + 昵称 + 简介 -->
        <div class="pc-avatar-section">
          <div class="pc-avatar-ring">
            <img class="pc-avatar-img" id="pc-avatar-img" src="" alt="头像" />
          </div>
          <h2 class="pc-display-name" id="pc-display-name"></h2>
          <p class="pc-bio" id="pc-bio"></p>
        </div>

        <!-- 统计网格：三栏暗黑玻璃卡片 -->
        <div class="profile-stats-grid">
          <div class="profile-stat-card">
            <span class="profile-stat-num" id="pc-stat-spots">0</span>
            <span class="profile-stat-label">旅行足迹</span>
          </div>
          <div class="profile-stat-card">
            <span class="profile-stat-num" id="pc-stat-likes">0</span>
            <span class="profile-stat-label">点赞</span>
          </div>
          <div class="profile-stat-card">
            <span class="profile-stat-num" id="pc-stat-views">0</span>
            <span class="profile-stat-label">浏览量</span>
          </div>
        </div>

        <!-- 我的足迹 -->
        <div class="pc-footprints" id="pc-footprints">
          <div class="pc-footprints-title">📍 我的足迹</div>
          <div class="pc-footprints-list" id="pc-footprints-list"></div>
        </div>

        <!-- 我的收藏 -->
        <div class="pc-footprints" id="pc-favorites">
          <div class="pc-footprints-title">⭐ 我的收藏</div>
          <div class="pc-footprints-list" id="pc-favorites-list"></div>
        </div>

        <!-- 操作按钮 -->
        <div class="pc-actions">
          <button class="pc-action-btn" id="pc-btn-edit">✏️ 编辑资料</button>
          <button class="pc-action-btn" id="pc-btn-change-pw">🔑 修改密码</button>
          <button class="pc-action-btn" id="pc-btn-share" title="分享个人主页">
            <span>📤</span> 分享
          </button>
          <button class="pc-action-btn-logout" id="pc-btn-logout">🚪 退出登录</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 关闭事件
  modal.querySelector(".auth-modal-overlay").addEventListener("click", () => {
    transitionManager.closeModal(modal);
  });
  modal.querySelector(".auth-modal-close").addEventListener("click", () => {
    transitionManager.closeModal(modal);
  });

  // 编辑资料按钮
  modal.querySelector("#pc-btn-edit").addEventListener("click", () => {
    transitionManager.closeModal(modal);
    _openEditProfileModal();
  });

  // 修改密码按钮
  modal.querySelector("#pc-btn-change-pw").addEventListener("click", () => {
    transitionManager.closeModal(modal);
    _openChangePasswordModal();
  });

  // 分享按钮
  modal.querySelector("#pc-btn-share").addEventListener("click", () => {
    openShareModal();
  });

  // 退出登录按钮 — 绑定 store.signOut
  modal.querySelector("#pc-btn-logout").addEventListener("click", async () => {
    const btn = modal.querySelector("#pc-btn-logout");
    btn.disabled = true;
    btn.textContent = "退出中...";

    try {
      await signOut();
      _toast("👋 已退出登录", "info", 2000);
    } catch (err) {
      console.error("[auth] 退出登录失败:", err);
    }

    transitionManager.closeModal(modal);
    btn.disabled = false;
    btn.textContent = "🚪 退出登录";
  });
}

// ==================== 个人中心 — 容错重构 ====================

/**
 * 打开个人中心（主入口）
 * 容错设计：
 *   - Promise.allSettled 替代 Promise.all，单表失败不阻塞整体
 *   - likes/favorites 表缺失时统计数据降级为 0，不崩溃
 *   - 登出状态、加载超时等边界情况在入口处兜底
 */
async function _openProfileCenter() {
  const modal = document.getElementById("profile-center-modal");
  if (!modal) return;

  const loadingEl = modal.querySelector("#profile-center-loading");
  const loadingText = modal.querySelector("#profile-center-loading-text");
  const bodyEl = modal.querySelector("#profile-center-body");

  // 显示加载态（spinner + 动态文字，不破坏 DOM）
  loadingEl.style.display = "flex";
  if (loadingText) loadingText.textContent = "正在连接数据舱...";
  bodyEl.style.display = "none";
  transitionManager.openModal(modal);

  // 非阻塞异步安全检查：Promise + setInterval
  if (store.loading) {
    if (loadingText) loadingText.textContent = "正在验证身份令牌...";
    const startTime = Date.now();
    const MAX_WAIT_MS = 5000;
    const POLL_INTERVAL_MS = 100;

    try {
      await new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (!store.loading) {
            clearInterval(timer);
            resolve();
          } else if (Date.now() - startTime > MAX_WAIT_MS) {
            clearInterval(timer);
            reject(new Error("timeout"));
          }
        }, POLL_INTERVAL_MS);
      });
    } catch {
      if (loadingText) loadingText.textContent = "加载超时，请刷新页面后重试";
      return;
    }
  }

  // 检查是否已登录
  if (!store.isLoggedIn) {
    if (loadingText) loadingText.textContent = "请先登录";
    return;
  }

  const userId = store.user.id;
  if (loadingText) loadingText.textContent = "📡 数据传送中...";

  try {
    // ---- 并行拉取所有数据（Promise.allSettled：单表失败不阻塞整体） ----
    const results = await Promise.allSettled([
      _withTimeout(getUserSpotCount(userId), 8000, "足迹统计"),
      _withTimeout(getUserLikeCount(userId), 8000, "点赞统计"),
      _withTimeout(getUserSpotViews(userId), 8000, "浏览量统计"),
      _withTimeout(getUserSpots(userId), 8000, "足迹列表"),
      _withTimeout(getUserFavorites(userId), 8000, "收藏列表"),
    ]);

    // 安全提取结果
    const extract = (result, fallback, label) => {
      if (result.status === "fulfilled") return result.value;
      console.warn(`[profile-center] ⚠️ ${label} 加载失败，使用默认值`, result.reason?.message || result.reason);
      return fallback;
    };

    const spotCount = extract(results[0], 0, "足迹统计");
    const likeCount = extract(results[1], 0, "点赞统计");
    const views     = extract(results[2], 0, "浏览量统计");
    const spots     = extract(results[3], [], "足迹列表");
    const favorites = extract(results[4], [], "收藏列表");

    // 渲染数据到面板
    renderProfileCenter(modal, {
      avatarUrl: store.getAvatarUrl(),
      displayName: store.getDisplayName(),
      bio: store.profile?.bio || "",
      spotCount,
      likeCount,
      views,
      spots,
      favorites,
    });
  } catch (err) {
    console.error("[profile-center] 加载统计失败:", err);
    showErrorState(modal);
    return;
  }

  // 数据就绪：淡出加载态，淡入内容
  loadingEl.style.display = "none";
  bodyEl.style.display = "flex";
}

/**
 * 渲染个人中心 UI（从 _openProfileCenter 提取，数据与渲染分离）
 * @param {HTMLElement} modal
 * @param {{ avatarUrl, displayName, bio, spotCount, likeCount, views, spots, favorites }} data
 */
function renderProfileCenter(modal, data) {
  const {
    avatarUrl,
    displayName,
    bio,
    spotCount,
    likeCount,
    views,
    spots,
    favorites,
  } = data;

  // 基础信息
  modal.querySelector("#pc-avatar-img").src = avatarUrl;
  modal.querySelector("#pc-display-name").textContent = displayName;
  modal.querySelector("#pc-bio").textContent = bio || "还没有个人简介";

  // 统计卡片
  modal.querySelector("#pc-stat-spots").textContent = spotCount ?? 0;
  modal.querySelector("#pc-stat-likes").textContent = likeCount ?? 0;
  modal.querySelector("#pc-stat-views").textContent = views ?? 0;

  // 足迹列表
  _renderFootprints(modal, spots);

  // 收藏列表
  _renderFavorites(modal, favorites);
}

/**
 * 错误兜底：展示友好提示 + 重试按钮
 */
function showErrorState(modal) {
  const loadingEl = modal.querySelector("#profile-center-loading");
  const bodyEl = modal.querySelector("#profile-center-body");
  if (!loadingEl || !bodyEl) return;

  loadingEl.style.display = "block";
  loadingEl.innerHTML = `
    <div style="text-align:center;padding:24px 0">
      <p style="color:rgba(255,120,120,0.9);margin-bottom:16px">
        ⚠️ 加载失败，请检查网络后重试
      </p>
      <button id="pc-retry-btn" style="
        padding:8px 32px;border:1px solid rgba(255,255,255,0.2);
        border-radius:8px;background:rgba(255,255,255,0.08);
        color:#fff;cursor:pointer;font-size:14px;font-family:inherit;
      ">🔄 重试</button>
    </div>
  `;
  bodyEl.style.display = "none";

  // 绑定重试按钮
  const retryBtn = loadingEl.querySelector("#pc-retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => _openProfileCenter());
  }
}

/**
 * Promise 超时包装器（仅用于个人中心内部各子请求）
 */
function _withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} 请求超时`)), timeoutMs)
    ),
  ]);
}

// ---- 渲染辅助函数 ----

function _renderFootprints(modal, spots) {
  const listEl = modal.querySelector("#pc-footprints-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (!spots || spots.length === 0) {
    listEl.innerHTML = `<div class="pc-footprints-empty">还没有分享足迹</div>`;
    return;
  }

  spots.forEach((spot) => {
    const item = document.createElement("div");
    item.className = "pc-footprint-item";
    item.innerHTML = `
      <span class="pc-footprint-name">📍 ${escapeHtml(spot.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `;
    item.addEventListener("click", () => {
      transitionManager.closeModal(modal);
      window.dispatchEvent(
        new CustomEvent("focus-spot", {
          detail: {
            spotId: spot.id,
            lng: spot.longitude,
            lat: spot.latitude,
            name: spot.name,
            description: spot.description || "",
          },
        })
      );
    });
    listEl.appendChild(item);
  });
}

/**
 * 渲染收藏列表（兼容两种数据格式）
 *  - 旧格式：fav.spots 含完整 spot 对象（PostgREST 嵌入式关联）
 *  - 新格式：仅含 spot_id（db.js 返回原始 favorites 行）
 */
function _renderFavorites(modal, favorites) {
  const listEl = modal.querySelector("#pc-favorites-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (!favorites || favorites.length === 0) {
    listEl.innerHTML = `<div class="pc-footprints-empty">还没有收藏景点</div>`;
    return;
  }

  favorites.forEach((fav) => {
    // 兼容新旧两种数据格式
    const spot = fav.spots;       // 旧格式：嵌入式关联
    const spotId = spot?.id ?? fav.spot_id;

    if (!spotId) return;  // 无有效 spot_id，跳过

    const displayName = spot?.name
      ? `⭐ ${escapeHtml(spot.name)}`
      : `⭐ 景点 #${spotId}`;

    const item = document.createElement("div");
    item.className = "pc-footprint-item";
    item.innerHTML = `
      <span class="pc-footprint-name">${displayName}</span>
      <span class="pc-footprint-arrow">→</span>
    `;
    item.addEventListener("click", () => {
      transitionManager.closeModal(modal);
      window.dispatchEvent(
        new CustomEvent("focus-spot", {
          detail: {
            spotId: spotId,
            lng: spot?.longitude ?? 0,
            lat: spot?.latitude ?? 0,
            name: spot?.name || `景点 #${spotId}`,
            description: spot?.description || "",
          },
        })
      );
    });
    listEl.appendChild(item);
  });
}

function _openModal(form) {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  transitionManager.openModal(modal);
  _switchForm(form);
}

function _closeModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  transitionManager.closeModal(modal);
  // 清理注册成功定时器
  if (modal.dataset._registerTimer) {
    clearTimeout(Number(modal.dataset._registerTimer));
    delete modal.dataset._registerTimer;
  }
}

function _switchForm(form) {
  const loginForm = document.getElementById("auth-form-login");
  const registerForm = document.getElementById("auth-form-register");
  if (form === "register") {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  } else {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  }
  // 清除错误信息
  const loginErr = document.getElementById("auth-login-error");
  const registerErr = document.getElementById("auth-register-error");
  if (loginErr) loginErr.textContent = "";
  if (registerErr) {
    registerErr.textContent = "";
    registerErr.style.color = "";
  }
}

function _clearForms() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.querySelector("#auth-login-email").value = "";
  modal.querySelector("#auth-login-password").value = "";
  const dn = modal.querySelector("#auth-register-displayname");
  const em = modal.querySelector("#auth-register-email");
  const pw = modal.querySelector("#auth-register-password");
  if (dn) dn.value = "";
  if (em) em.value = "";
  if (pw) pw.value = "";
  const loginErr = document.getElementById("auth-login-error");
  const registerErr = document.getElementById("auth-register-error");
  if (loginErr) loginErr.textContent = "";
  if (registerErr) {
    registerErr.textContent = "";
    registerErr.style.color = "";
  }
}

/**
 * 【修复】UI 状态同步
 * 从 store snapshot 读取最新状态并更新所有 UI 元素
 * 这是单向数据流：store → UI
 */
function _updateUI(snapshot) {
  const { user, profile } = snapshot;

  console.log("[auth:updateUI] snapshot.profile=%s snapshot.user=%s",
    profile ? JSON.stringify({ id: profile.id?.slice(0, 8), username: profile.username, avatar_url: profile.avatar_url }) : "null",
    user?.id?.slice(0, 8) || "null"
  );

  // 更新右上角用户按钮
  const btn = document.getElementById("auth-user-btn");
  if (btn) {
    if (user) {
      const name = store.getDisplayName();
      const avatarUrl = profile?.avatar_url || "";
      const initial = name[0]?.toUpperCase() || "👤";

      console.log("[auth:updateUI] 已登录 → 渲染用户名=%s 头像=%s", name, avatarUrl ? "🖼️图片" : ("首字符:" + initial));

      // 头像区：优先图片，兜底首字母
      let avatarHTML;
      if (avatarUrl) {
        avatarHTML = `<img src="${escapeHtml(avatarUrl)}" alt="头像" class="auth-user-avatar-img" />`;
      } else {
        avatarHTML = initial;
      }

      btn.innerHTML = `
        <span class="auth-user-avatar">${avatarHTML}</span>
        <span class="auth-user-label">${escapeHtml(name)}</span>
      `;

      // 头像图片加载失败 → 回退为首字母（事件绑定，避免内联 onerror 注入风险）
      const avatarImg = btn.querySelector(".auth-user-avatar-img");
      if (avatarImg) {
        avatarImg.addEventListener("error", function onErr() {
          avatarImg.remove();
          btn.querySelector(".auth-user-avatar").textContent = initial;
        }, { once: true });
      }
    } else {
      btn.innerHTML = `
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `;
    }
  }
}

function _toggleUserMenu() {
  const menu = document.getElementById("auth-user-menu");
  menu?.classList.toggle("open");
}

function _closeUserMenu() {
  document.getElementById("auth-user-menu")?.classList.remove("open");
}

// ==================== 【核心重构】Supabase Auth 错误 → 中文友好翻译 ====================
// 覆盖 signUp / signIn 所有常见错误
// 原则：不直接暴露 Supabase 原始英文 message 给用户
//
// Supabase GoTrue 错误原文参考：
//   https://github.com/supabase/gotrue/blob/master/internal/api/mail.go
//   https://github.com/supabase/gotrue/blob/master/internal/api/signup.go
/**
 * 翻译 Supabase Auth 错误消息为中文
 * @param {string} message - Supabase 原始错误消息
 * @returns {string} 中文友好提示
 */
function _translateAuthError(message) {
  if (!message) return "未知错误，请稍后重试";

  const msg = message.toLowerCase();

  // ---- 注册相关 ----
  if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("already been registered")) {
    return "该邮箱已被注册，请直接登录或使用其他邮箱";
  }
  if (msg.includes("user already registered")) {
    return "该邮箱已被注册，请直接登录或使用其他邮箱";
  }
  if (msg.includes("password should be at least") || msg.includes("密码至少需要")) {
    return "密码至少需要6位，请重新设置";
  }
  if (msg.includes("weak password") || msg.includes("password is too weak")) {
    return "密码强度不足，请使用至少6位的密码（建议包含字母和数字）";
  }
  if (msg.includes("invalid email") || msg.includes("invalid_email") || msg.includes("邮箱格式")) {
    return "邮箱格式不正确，请检查后重试";
  }
  if (msg.includes("email rate limit") || msg.includes("too many requests") || msg.includes("操作过于频繁")) {
    return "操作过于频繁，请等待60秒后再试";
  }
  if (msg.includes("email not confirmed")) {
    return "该邮箱尚未完成验证，请先点击确认邮件中的链接";
  }
  if (msg.includes("signup disabled") || msg.includes("registration disabled")) {
    return "注册功能暂未开放，请联系管理员";
  }
  if (msg.includes("banned") || msg.includes("disabled") || msg.includes("blocked")) {
    return "该账号已被禁用，请联系管理员";
  }

  // ---- 登录相关 ----
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "邮箱或密码错误，请检查后重试";
  }
  if (msg.includes("invalid login") || msg.includes("邮箱或密码错误")) {
    return "邮箱或密码错误，请检查后重试";
  }
  if (msg.includes("user not found")) {
    return "该邮箱尚未注册，请先创建账号";
  }

  // ---- 密码修改相关 ----
  if (msg.includes("same password") || msg.includes("password is the same")) {
    return "新密码不能与当前密码相同，请更换一个";
  }
  if (msg.includes("password too short") || msg.includes("password must be")) {
    return "新密码长度不足，至少需要6位";
  }
  if (msg.includes("password too weak") || msg.includes("password is not strong")) {
    return "新密码强度不足，请使用包含字母和数字的密码";
  }
  if (msg.includes("new password") && msg.includes("required")) {
    return "请输入新密码";
  }

  // ---- 通用网络/超时 ----
  if (msg.includes("超时") || msg.includes("timeout")) {
    return "请求超时，请检查网络连接后重试";
  }
  if (msg.includes("网络") || msg.includes("network") || msg.includes("fetch")) {
    return "网络连接异常，请检查网络后重试";
  }
  if (msg.includes("abort") || msg.includes("取消")) {
    return "请求已取消，请重试";
  }

  // ---- 服务端错误 ----
  if (msg.includes("internal server error") || msg.includes("500")) {
    return "服务器繁忙，请稍后再试";
  }
  if (msg.includes("service unavailable") || msg.includes("503")) {
    return "服务暂不可用，请稍后再试";
  }

  // ---- 表单验证类（前端自己抛的） ----
  if (msg.includes("请填写") || msg.includes("请输入") || msg.includes("至少需要")) {
    return message; // 已是中文，直接返回
  }

  // ---- 兜底：输出原始消息（开发调试用） ----
  // 生产环境用户看到英文也总比看到空白好
  console.warn("[auth] 未匹配到中文翻译的错误消息:", message);
  return `操作失败：${message}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
