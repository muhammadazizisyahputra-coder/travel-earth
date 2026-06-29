// ==================== 发布避雷帖子模块 ====================
// Vanilla JS 弹窗模块：景点名称 + 避雷感受 + 1-5星评分 + 多图上传
// 入口按钮置于右上角用户按钮旁
//
// 导出: initCreatePost({ onPostCreated })
//   - onPostCreated: 帖子发布成功后的回调 (可选)
//
// 导出: openCreatePostModal() — 供外部模块（如社区广场）打开发帖弹窗
// 导出: setOnPostCreated(cb)  — 动态注册发布成功回调

import { supabase as _supabaseRef } from "./src/utils/supabaseClient.js";
import { transitionManager } from "./transition.js";

// ==================== 内部状态 ====================
let _supabase = null;
let _currentImageUrls = [];   // 当前批次已上传的图片 URL 列表
let _uploadingCount = 0;      // 正在上传中的图片数
let _onPostCreated = null;    // 发布成功回调（可动态替换）

// ==================== 公开 API ====================

/**
 * 初始化「发布避雷」入口
 * @param {{ onPostCreated?: () => void }} opts
 */
export function initCreatePost(opts = {}) {
  _supabase = _supabaseRef;
  const { onPostCreated } = opts;
  _onPostCreated = onPostCreated || null;   // 同步到模块级变量

  // ---- 创建弹窗 DOM（不创建入口按钮，入口按钮已移至景区列表面板） ----
  const modal = _buildModal();
  document.body.appendChild(modal);

  // ---- 弹窗事件绑定 ----
  const overlay = modal.querySelector(".create-post-overlay");
  const closeBtn = modal.querySelector(".create-post-close");
  const cancelBtn = modal.querySelector("#create-post-cancel");
  const submitBtn = modal.querySelector("#create-post-submit");
  const titleInput = modal.querySelector("#create-post-title");
  const contentInput = modal.querySelector("#create-post-content");
  const ratingStars = modal.querySelectorAll(".create-post-star");
  const imageInput = modal.querySelector("#create-post-image-input");
  const addImageBtn = modal.querySelector("#create-post-add-image");
  const imagePreviewArea = modal.querySelector(".create-post-image-previews");
  const statusEl = modal.querySelector("#create-post-status");

  let _rating = 0;

  function closeModal() {
    transitionManager.closeModal(modal);
    // 重置表单
    titleInput.value = "";
    contentInput.value = "";
    _rating = 0;
    _currentImageUrls = [];
    _uploadingCount = 0;
    _renderStars(0);
    _renderImagePreviews();
    statusEl.textContent = "";
    statusEl.style.color = "";
    submitBtn.disabled = false;
    submitBtn.textContent = "⚡ 发布避雷";
  }

  overlay.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // ---- 星级评分 ----
  ratingStars.forEach((star) => {
    star.addEventListener("click", () => {
      _rating = Number(star.dataset.rating);
      _renderStars(_rating);
    });
    star.addEventListener("mouseenter", () => {
      _renderStars(Number(star.dataset.rating));
    });
  });
  modal.querySelector(".create-post-stars").addEventListener("mouseleave", () => {
    _renderStars(_rating);
  });

  // ---- 图片上传 ----
  addImageBtn.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", _handleImageUpload);

  // ---- 提交 ----
  submitBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // 校验
    if (!title) {
      statusEl.textContent = "请输入景点名称";
      statusEl.style.color = "rgba(255, 120, 120, 0.95)";
      return;
    }
    if (title.length > 200) {
      statusEl.textContent = "景点名称不能超过200字";
      statusEl.style.color = "rgba(255, 120, 120, 0.95)";
      return;
    }
    if (!content) {
      statusEl.textContent = "请输入避雷感受";
      statusEl.style.color = "rgba(255, 120, 120, 0.95)";
      return;
    }
    if (_rating < 1) {
      statusEl.textContent = "请点击星星评分（1-5星）";
      statusEl.style.color = "rgba(255, 120, 120, 0.95)";
      return;
    }
    if (_uploadingCount > 0) {
      statusEl.textContent = "图片正在上传中，请稍候...";
      statusEl.style.color = "rgba(255, 180, 80, 0.95)";
      return;
    }

    statusEl.textContent = "正在发布...";
    statusEl.style.color = "rgba(255, 255, 255, 0.7)";
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ 发布中...";

    try {
      // 获取当前用户
      const { data: { user } } = await _supabase.auth.getUser();
      if (!user) {
        statusEl.textContent = "登录状态已失效，请重新登录";
        statusEl.style.color = "rgba(255, 120, 120, 0.95)";
        submitBtn.disabled = false;
        submitBtn.textContent = "⚡ 发布避雷";
        return;
      }

      const { data, error } = await _supabase
        .from("posts")
        .insert({
          user_id: user.id,
          title,
          content,
          image_urls: _currentImageUrls,
          rating: _rating,
        })
        .select()
        .single();

      if (error) throw error;

      // 成功
      closeModal();
      if (typeof _onPostCreated === "function") {
        _onPostCreated(data);
      }
      _showToast("✅ 避雷帖发布成功！", "success", 3000);

    } catch (err) {
      console.error("[createPost] 发布失败:", err);
      const msg = _friendlyError(err, "发布失败，请检查网络或权限后重试");
      statusEl.textContent = msg;
      statusEl.style.color = "rgba(255, 120, 120, 0.95)";
      submitBtn.disabled = false;
      submitBtn.textContent = "⚡ 发布避雷";
    }
  });

  // ---- 键盘 ESC 关闭 ----
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  return { open: () => _openModal() };
}

// ==================== 供外部模块调用的公开入口 ====================

/** 打开发帖弹窗（供社区广场等模块调用） */
export function openCreatePostModal() {
  _openModal();
}

/** 动态注册发布成功回调 */
export function setOnPostCreated(cb) {
  _onPostCreated = typeof cb === "function" ? cb : null;
}

// ==================== 内部函数 ====================

function _openModal() {
  const modal = document.getElementById("create-post-modal");
  transitionManager.openModal(modal);
}

function _buildModal() {
  const modal = document.createElement("div");
  modal.id = "create-post-modal";
  modal.className = "create-post-modal";
  modal.innerHTML = `
    <div class="create-post-overlay"></div>
    <div class="create-post-panel">
      <button class="create-post-close">&times;</button>

      <div class="create-post-header">
        <h2>⚡ 发布避雷</h2>
        <p>分享你的真实旅行经历，帮助其他旅行者避开踩坑</p>
      </div>

      <div class="create-post-form">
        <!-- 景点名称 -->
        <label class="create-post-label">景点名称 <span class="create-post-required">*</span></label>
        <input
          type="text"
          id="create-post-title"
          class="create-post-input"
          placeholder="你去过的景区名称（如：三亚天涯海角）"
          maxlength="200"
          autocomplete="off"
        />

        <!-- 避雷感受 -->
        <label class="create-post-label">避雷感受 <span class="create-post-required">*</span></label>
        <textarea
          id="create-post-content"
          class="create-post-textarea"
          placeholder="说说你遭遇了哪些坑？门票、交通、餐饮、住宿... 越详细越能帮到大家"
          rows="5"
        ></textarea>

        <!-- 星级评分 -->
        <label class="create-post-label">综合评分 <span class="create-post-required">*</span></label>
        <div class="create-post-stars">
          ${[1, 2, 3, 4, 5]
            .map(
              (i) =>
                `<span class="create-post-star" data-rating="${i}">★</span>`
            )
            .join("")}
          <span class="create-post-rating-text" id="create-post-rating-text">点击评分</span>
        </div>

        <!-- 旅行照片 -->
        <label class="create-post-label">旅行照片 <span class="create-post-optional">(选填，最多9张)</span></label>
        <div class="create-post-image-area">
          <div class="create-post-image-previews" id="create-post-image-previews"></div>
          <button type="button" class="create-post-add-image" id="create-post-add-image" title="上传照片">
            <span class="create-post-add-icon">＋</span>
            <span>添加照片</span>
          </button>
        </div>
        <input
          type="file"
          id="create-post-image-input"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style="display:none"
        />

        <!-- 操作按钮 -->
        <div class="create-post-actions">
          <button type="button" class="create-post-btn-cancel" id="create-post-cancel">取消</button>
          <button type="button" class="create-post-btn-submit" id="create-post-submit">⚡ 发布避雷</button>
        </div>

        <!-- 状态提示 -->
        <p class="create-post-status" id="create-post-status"></p>
      </div>
    </div>
  `;

  return modal;
}

/** 渲染星级 */
function _renderStars(rating) {
  const stars = document.querySelectorAll("#create-post-modal .create-post-star");
  const text = document.querySelector("#create-post-modal #create-post-rating-text");
  const labels = ["", "⭐ 非常差", "⭐⭐ 较差", "⭐⭐⭐ 一般", "⭐⭐⭐⭐ 推荐", "⭐⭐⭐⭐⭐ 强烈推荐"];

  stars.forEach((star) => {
    const v = Number(star.dataset.rating);
    star.classList.toggle("active", v <= rating);
  });
  if (text) text.textContent = labels[rating] || "点击评分";
}

/** 处理图片选择 */
async function _handleImageUpload() {
  const input = document.getElementById("create-post-image-input");
  if (!input || !input.files.length) return;

  const files = Array.from(input.files);
  input.value = ""; // 清空以便重复选择同一文件

  // 数量限制：总共最多9张
  if (_currentImageUrls.length + files.length + _uploadingCount > 9) {
    _showToast("最多上传9张照片", "warn", 3000);
    return;
  }

  for (const file of files) {
    // 类型校验
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      _showToast(`${file.name} 格式不支持，请选择 JPG/PNG/WebP`, "warn", 4000);
      continue;
    }
    // 大小限制 10MB
    if (file.size > 10 * 1024 * 1024) {
      _showToast(`${file.name} 超过10MB，请压缩后重试`, "warn", 4000);
      continue;
    }

    _uploadingCount++;
    _renderImagePreviews(); // 显示上传中占位

    try {
      const { data: { user } } = await _supabase.auth.getUser();
      const userId = user?.id || "anonymous";
      const ext = file.name.split(".").pop() || "jpg";
      const storagePath = `posts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await _supabase.storage
        .from("post-images")
        .upload(storagePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = _supabase.storage
        .from("post-images")
        .getPublicUrl(storagePath);

      const publicUrl = publicUrlData?.publicUrl || "";
      if (publicUrl) {
        _currentImageUrls.push(publicUrl);
      }
    } catch (err) {
      console.error("[createPost] 图片上传失败:", err);
      _showToast(`${file.name} 上传失败: ${err.message || "未知错误"}`, "error", 5000);
    } finally {
      _uploadingCount--;
      _renderImagePreviews();
    }
  }
}

/** 渲染图片预览区 */
function _renderImagePreviews() {
  const area = document.getElementById("create-post-image-previews");
  if (!area) return;

  let html = "";

  // 已上传的图片
  _currentImageUrls.forEach((url, idx) => {
    html += `
      <div class="create-post-image-item">
        <img src="${_escapeAttr(url)}" alt="照片${idx + 1}" />
        <button class="create-post-image-remove" data-idx="${idx}" title="移除">×</button>
      </div>
    `;
  });

  // 上传中的占位
  for (let i = 0; i < _uploadingCount; i++) {
    html += `
      <div class="create-post-image-item uploading">
        <div class="create-post-image-spinner"></div>
      </div>
    `;
  }

  area.innerHTML = html;

  // 绑定删除按钮
  area.querySelectorAll(".create-post-image-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      _currentImageUrls.splice(idx, 1);
      _renderImagePreviews();
    });
  });
}

/** 简易 Toast */
let _toastContainer = null;

function _showToast(msg, type = "info", duration = 4000) {
  if (!_toastContainer) {
    _toastContainer = document.createElement("div");
    _toastContainer.style.cssText =
      "position:fixed;top:120px;right:16px;z-index:10000;" +
      "display:flex;flex-direction:column;gap:8px;" +
      "pointer-events:none;max-width:360px;";
    document.body.appendChild(_toastContainer);
  }

  const colorMap = { error: "#ef4444", warn: "#f59e0b", success: "#10b981", info: "#3b82f6" };
  const el = document.createElement("div");
  el.style.cssText =
    `background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);` +
    `border-left:4px solid ${colorMap[type] || colorMap.info};` +
    `color:#e2e8f0;padding:12px 16px;border-radius:8px;font-size:14px;line-height:1.5;` +
    `box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;` +
    `animation:create-post-toast-in 0.3s ease-out;`;
  el.textContent = msg;
  _toastContainer.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(20px)";
    el.style.transition = "opacity 0.3s, transform 0.3s";
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// 注入 Toast 动画
(function () {
  if (document.getElementById("create-post-toast-styles")) return;
  const s = document.createElement("style");
  s.id = "create-post-toast-styles";
  s.textContent =
    "@keyframes create-post-toast-in { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }";
  document.head.appendChild(s);
})();

/** 友好错误翻译 */
function _friendlyError(err, fallback) {
  const code = err?.code;
  const msg = err?.message || "";
  const codeMap = {
    "42501": "权限不足，请检查数据库 RLS 策略",
    "23505": "数据已存在，请勿重复操作",
    "23503": "关联数据不存在",
    "42P01": "数据表不存在，请联系管理员",
    PGRST301: "认证已过期，请重新登录",
  };
  if (code && codeMap[code]) return codeMap[code];
  if (msg.includes("JWT")) return "认证已过期，请重新登录";
  if (msg.includes("network") || msg.includes("fetch")) return "网络连接异常，请检查网络";
  return fallback;
}

/** HTML 属性转义 */
function _escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
