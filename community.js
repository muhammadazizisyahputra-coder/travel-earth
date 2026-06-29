// ==================== 避雷社区 — 卡片广场模块 ====================
// Vanilla JS 全屏页面：顶部搜索框 + 帖子卡片网格 + 发帖入口 + 联合查询 profiles
//
// 导出:
//   initCommunity()     — 创建社区页面 DOM + 绑定事件
//   openCommunity()     — 打开社区页面并加载帖子
//   closeCommunity()    — 关闭社区页面

import { supabase as _supabaseRef } from "./src/utils/supabaseClient.js";
import { isLoggedIn } from "./auth.js";
import { openCreatePostModal, setOnPostCreated } from "./createPost.js";
import { transitionManager } from "./transition.js";
import { openShareModal } from "./shareModal.js";

// ==================== 内部状态 ====================
let _supabase = null;
let _allPosts = [];           // 全部帖子（未过滤）
let _searchQuery = "";        // 搜索关键词
let _loading = false;
let _container = null;

// ==================== 公开 API ====================

export function initCommunity() {
  _supabase = _supabaseRef;

  // 创建页面 DOM（仅一次）
  _container = _buildPage();
  document.body.appendChild(_container);

  // 绑定事件
  _bindEvents();

  // 注册发帖成功回调 → 自动刷新
  setOnPostCreated(async (newPost) => {
    const profile = await _fetchProfileForPost(newPost.user_id);
    const enriched = { ...newPost, profiles: profile };
    _allPosts.unshift(enriched);
    _renderFilteredCards();
    const body = _container.querySelector(".community-body");
    if (body) body.scrollTop = 0;
  });

  console.log("[community] 社区模块初始化完成（含搜索）");
}

export function openCommunity() {
  if (!_container) return;
  transitionManager.openPage(_container);
  _loadPosts();
}

export function closeCommunity() {
  if (!_container) return;
  transitionManager.closePage(_container);
}

// ==================== DOM 构建 ====================

function _buildPage() {
  const page = document.createElement("div");
  page.id = "community-page";
  page.className = "community-page";
  page.innerHTML = `
    <!-- 顶部导航栏 -->
    <div class="community-topbar">
      <div class="community-topbar-left">
        <button class="community-back-btn" id="community-back-btn" title="返回地图">
          <span>←</span>
        </button>
        <div class="community-brand">
          <span class="community-brand-icon">⚡</span>
          <span class="community-brand-text">避雷社区</span>
        </div>
      </div>
      <div class="community-topbar-right">
        <button class="community-create-btn" id="community-create-btn">
          <span>＋</span> 分享避雷心得
        </button>
        <button class="community-share-btn" id="community-share-btn" title="分享此页面">
          📤
        </button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="community-search-bar">
      <div class="community-search-wrap">
        <span class="community-search-icon">🔍</span>
        <input
          type="text"
          id="community-search-input"
          class="community-search-input"
          placeholder="搜索景点名称或避雷关键词..."
          autocomplete="off"
        />
        <button class="community-search-clear" id="community-search-clear" title="清除搜索" style="display:none">
          ×
        </button>
        <span class="community-search-count" id="community-search-count"></span>
      </div>
    </div>

    <!-- 帖子卡片区域 -->
    <div class="community-body" id="community-body">
      <!-- 加载中 -->
      <div class="community-loading" id="community-loading">
        <div class="community-spinner"></div>
        <p>正在加载避雷帖子...</p>
      </div>

      <!-- 空状态（默认隐藏） -->
      <div class="community-empty" id="community-empty" style="display:none">
        <div class="community-empty-icon">📭</div>
        <h3>还没有避雷帖子</h3>
        <p>成为第一个分享旅行避雷经验的先锋！</p>
        <button class="community-empty-btn" id="community-empty-btn">⚡ 立即分享</button>
      </div>

      <!-- 搜索无结果（默认隐藏） -->
      <div class="community-empty" id="community-no-results" style="display:none">
        <div class="community-empty-icon">🔎</div>
        <h3>未找到匹配的帖子</h3>
        <p>换个关键词试试，或者发布第一条相关内容</p>
        <button class="community-empty-btn" id="community-noresults-btn">⚡ 立即分享</button>
      </div>

      <!-- 错误状态（默认隐藏） -->
      <div class="community-error" id="community-error" style="display:none">
        <div class="community-error-icon">⚠️</div>
        <p id="community-error-msg">加载失败</p>
        <button class="community-retry-btn" id="community-retry-btn">重新加载</button>
      </div>

      <!-- 卡片网格 -->
      <div class="community-grid" id="community-grid"></div>
    </div>
  `;

  return page;
}

// ==================== 事件绑定 ====================

function _bindEvents() {
  if (!_container) return;

  // 返回按钮
  _container.querySelector("#community-back-btn").addEventListener("click", closeCommunity);

  // 发帖按钮
  _container.querySelector("#community-create-btn").addEventListener("click", () => {
    _handleCreateClick();
  });

  // 空状态发帖按钮
  _container.querySelector("#community-empty-btn").addEventListener("click", () => {
    _handleCreateClick();
  });
  _container.querySelector("#community-noresults-btn").addEventListener("click", () => {
    _handleCreateClick();
  });

  // 重试按钮
  _container.querySelector("#community-retry-btn").addEventListener("click", () => {
    _loadPosts();
  });

  // ---- 搜索输入 ----
  const searchInput = _container.querySelector("#community-search-input");
  const searchClear = _container.querySelector("#community-search-clear");

  let _searchDebounce = null;
  searchInput.addEventListener("input", () => {
    clearTimeout(_searchDebounce);
    _searchDebounce = setTimeout(() => {
      _searchQuery = searchInput.value.trim().toLowerCase();
      // 切换清除按钮显示
      searchClear.style.display = _searchQuery ? "flex" : "none";
      // 过滤 + 渲染
      _renderFilteredCards();
    }, 250);
  });

  // 清除按钮
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    _searchQuery = "";
    searchClear.style.display = "none";
    _renderFilteredCards();
    searchInput.focus();
  });

  // ESC 关闭
  _container.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCommunity();
  });

  // 分享按钮
  _container.querySelector("#community-share-btn").addEventListener("click", () => {
    openShareModal();
  });
}

function _handleCreateClick() {
  if (!isLoggedIn()) {
    _openAuthModalSafely();
    return;
  }
  openCreatePostModal();
}

// ==================== 数据加载 ====================

async function _loadPosts() {
  if (_loading) return;
  _loading = true;

  const loadingEl = _container.querySelector("#community-loading");
  const errorEl = _container.querySelector("#community-error");
  const emptyEl = _container.querySelector("#community-empty");
  const noResultsEl = _container.querySelector("#community-no-results");
  const gridEl = _container.querySelector("#community-grid");

  // 显示加载态
  loadingEl.style.display = "flex";
  errorEl.style.display = "none";
  emptyEl.style.display = "none";
  if (noResultsEl) noResultsEl.style.display = "none";
  gridEl.innerHTML = "";

  // 重置搜索
  const searchInput = _container.querySelector("#community-search-input");
  const searchClear = _container.querySelector("#community-search-clear");
  if (searchInput) searchInput.value = "";
  if (searchClear) searchClear.style.display = "none";
  _searchQuery = "";

  try {
    // 联合查询：posts + profiles（头像、昵称）
    const { data, error } = await _supabase
      .from("posts")
      .select("*, profiles(username, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    _allPosts = data || [];

    loadingEl.style.display = "none";

    if (_allPosts.length === 0) {
      emptyEl.style.display = "flex";
    } else {
      _renderFilteredCards();
    }
  } catch (err) {
    console.error("[community] 加载帖子失败:", err);
    loadingEl.style.display = "none";
    errorEl.style.display = "flex";
    _container.querySelector("#community-error-msg").textContent =
      "加载失败：" + (err.message || "请检查网络后重试");
  } finally {
    _loading = false;
  }
}

// ==================== 渲染 + 搜索过滤 ====================

/**
 * 基于 _searchQuery 过滤 _allPosts，渲染卡片网格
 * 匹配规则：title 或 content 包含关键词（大小写不敏感）
 */
function _renderFilteredCards() {
  const gridEl = _container.querySelector("#community-grid");
  const emptyEl = _container.querySelector("#community-empty");
  const noResultsEl = _container.querySelector("#community-no-results");
  const searchCount = _container.querySelector("#community-search-count");

  if (!gridEl) return;

  // 隐藏空状态
  emptyEl.style.display = "none";
  if (noResultsEl) noResultsEl.style.display = "none";

  // 过滤
  let filtered = _allPosts;
  if (_searchQuery) {
    filtered = _allPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const content = (post.content || "").toLowerCase();
      return title.includes(_searchQuery) || content.includes(_searchQuery);
    });
  }

  // 更新计数
  if (searchCount) {
    if (_searchQuery && _allPosts.length > 0) {
      searchCount.textContent = `${filtered.length}/${_allPosts.length} 条`;
    } else {
      searchCount.textContent = "";
    }
  }

  // 无结果
  if (filtered.length === 0) {
    gridEl.innerHTML = "";
    if (_searchQuery) {
      if (noResultsEl) noResultsEl.style.display = "flex";
    } else {
      emptyEl.style.display = "flex";
    }
    return;
  }

  // 渲染
  gridEl.innerHTML = filtered.map((post) => _buildCard(post)).join("");

  // 图片点击放大（事件委托）
  gridEl.querySelectorAll(".community-card-img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      _showImageLightbox(img.src);
    });
  });
}

function _buildCard(post) {
  const profile = post.profiles || {};
  const username = _escapeHtml(profile.username || "匿名用户");
  const avatarUrl = profile.avatar_url || "";
  const title = _escapeHtml(post.title || "无标题");
  const content = _escapeHtml(post.content || "");
  const rating = post.rating || 0;
  const imageUrls = post.image_urls || [];
  const timeAgo = _timeAgo(post.created_at);

  // 头像 HTML
  const avatarHtml = avatarUrl
    ? `<img class="community-card-avatar-img" src="${_escapeAttr(avatarUrl)}" alt="${username}" />`
    : `<div class="community-card-avatar-placeholder">👤</div>`;

  // 星级 HTML
  const starsHtml = Array.from({ length: 5 }, (_, i) =>
    `<span class="community-star ${i < rating ? "active" : ""}">★</span>`
  ).join("");

  // 图片画廊 HTML
  let imagesHtml = "";
  if (imageUrls.length > 0) {
    const imgItems = imageUrls
      .map(
        (url, idx) =>
          `<div class="community-card-img-wrap">
            <img class="community-card-img" src="${_escapeAttr(url)}" alt="照片${idx + 1}" loading="lazy" />
          </div>`
      )
      .join("");
    imagesHtml = `<div class="community-card-images">${imgItems}</div>`;
  }

  return `
    <div class="community-card">
      <!-- 作者信息 -->
      <div class="community-card-header">
        <div class="community-card-avatar">
          ${avatarHtml}
        </div>
        <div class="community-card-author">
          <span class="community-card-username">${username}</span>
          <span class="community-card-time">${timeAgo}</span>
        </div>
        <div class="community-card-rating" title="${rating} 星">
          ${starsHtml}
        </div>
      </div>

      <!-- 标题 + 内容 -->
      <div class="community-card-body">
        <h3 class="community-card-title">${title}</h3>
        <p class="community-card-content">${content}</p>
      </div>

      <!-- 图片画廊 -->
      ${imagesHtml}
    </div>
  `;
}

// ==================== 图片灯箱 ====================

function _showImageLightbox(src) {
  document.querySelector(".community-lightbox")?.remove();

  const lightbox = document.createElement("div");
  lightbox.className = "community-lightbox";
  lightbox.innerHTML = `
    <div class="community-lightbox-overlay"></div>
    <button class="community-lightbox-close">&times;</button>
    <img class="community-lightbox-img" src="${_escapeAttr(src)}" alt="原图" />
  `;
  document.body.appendChild(lightbox);

  const close = () => lightbox.remove();
  lightbox.querySelector(".community-lightbox-overlay").addEventListener("click", close);
  lightbox.querySelector(".community-lightbox-close").addEventListener("click", close);
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

// ==================== 辅助函数 ====================

async function _fetchProfileForPost(userId) {
  try {
    const { data } = await _supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    return data || { username: "匿名用户", avatar_url: "" };
  } catch {
    return { username: "匿名用户", avatar_url: "" };
  }
}

function _timeAgo(isoStr) {
  if (!isoStr) return "";
  const now = Date.now();
  const then = new Date(isoStr).getTime();
  const diff = now - then;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "刚刚";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} 分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} 小时前`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day} 天前`;
  const month = Math.floor(day / 30);
  return `${month} 个月前`;
}

function _openAuthModalSafely() {
  const authModal = document.getElementById("auth-modal");
  transitionManager.openModal(authModal);
}

function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function _escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
