// ==================== 启动 Loading 模块 ====================
import { updateLoadingProgress, hideLoadingScreen } from "./loading.js";

// ==================== 页面切换动画 ====================
import { transitionManager } from "./transition.js";

// ==================== 认证模块 ====================
import {
  initAuth,
  getUser,
  getProfile,
  isLoggedIn,
  onAuthChange,
  openProfileCenter,
} from "./auth.js";

// ==================== 数据库服务 ====================
import {
  initDB,
  hasLiked,
  likeSpot,
  unlikeSpot,
  getLikeCount,
  hasFavorited,
  favoriteSpot,
  unfavoriteSpot,
  getFavoriteCount,
  getComments,
  addComment,
  deleteComment,
  getCommentCount,
  getSpotImages,
  saveSpotImage,
  deleteSpotImage,
  getHotSpots,
  getHotSpotRanking,
  incrementViewCount,
} from "./db.js";

// ==================== 高德地图安全密钥（生产环境 MUST） ====================
// 必须在 AMap SDK 加载前声明，否则公网部署会白屏
window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE || "",
};

// ==================== 高德地图地理编码服务 ====================
import { geocodeSpot } from "./geocodeService.js";

// ==================== 热门景区模块 ====================
import { initHotSpots, isHotFilterActive, showSpotList, refreshRanking, setHotFilter, toggleRanking, getLitSpotIds, refreshFootprints } from "./hotSpots.js";

// ==================== 景区搜索模块 ====================
import { initSearch } from "./searchSpot.js";

// ==================== 响应式布局模块 ====================
import { initResponsive, onMenuAction } from "./responsive.js";

// ==================== 发布避雷模块 ====================
import { initCreatePost } from "./createPost.js";

// ==================== 避雷社区模块 ====================
import { initCommunity, openCommunity } from "./community.js";

// ==================== ShareModal — 分享弹窗 ====================
import { initShareModal, openShareModal } from "./shareModal.js";

// ==================== 微信 JSSDK 自动初始化 ====================
import { initWeChatShare } from "./src/utils/wechatJSSDK.js";
import { getShareData } from "./src/utils/shareEngine.js";

// ==================== 初始化高德地图 ====================
let map = null;

// ==================== 全局状态 ====================
const markers = [];
let currentInfoWindow = null;
let clickedSpotId = null;
let currentUser = null;
let currentProfile = null;
let _liked = false;
let _favorited = false;
let _lastMarkerClickTime = 0;

// ==================== 非阻塞 Toast 通知工具 ====================
let _toastContainer = null;

function _showToast(message, type = "info", duration = 6000) {
  if (!_toastContainer) {
    _toastContainer = document.createElement("div");
    _toastContainer.id = "toast-container";
    _toastContainer.style.cssText =
      "position:fixed;top:70px;right:12px;z-index:10000;" +
      "display:flex;flex-direction:column;gap:8px;" +
      "pointer-events:none;" +
      "max-width:calc(100vw - 24px);";
    document.body.appendChild(_toastContainer);
  }

  const colorMap = {
    error: "#ef4444",
    warn:  "#f59e0b",
    info:  "#3b82f6",
  };
  const borderColor = colorMap[type] || colorMap.info;

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.style.cssText =
    "position:relative;" +
    "background:rgba(20,20,30,0.94);" +
    "backdrop-filter:blur(12px);" +
    "-webkit-backdrop-filter:blur(12px);" +
    `border-left:4px solid ${borderColor};` +
    "color:#e2e8f0;" +
    "padding:14px 16px;" +
    "border-radius:8px;" +
    "font-size:14px;" +
    "line-height:1.5;" +
    "max-width:360px;" +
    "box-shadow:0 8px 32px rgba(0,0,0,0.45);" +
    "pointer-events:auto;" +
    "animation:toast-slide-in 0.3s ease-out;" +
    "transition:opacity 0.3s ease,transform 0.3s ease;";

  if (duration > 0) {
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText =
      "position:absolute;top:6px;right:10px;" +
      "background:none;border:none;color:#94a3b8;" +
      "font-size:18px;cursor:pointer;line-height:1;padding:0;";
    closeBtn.addEventListener("click", () => _removeToast(toast));
    toast.appendChild(closeBtn);
  }

  const textEl = document.createElement("span");
  textEl.style.cssText = "display:block;padding-right:22px;white-space:pre-line;";
  textEl.textContent = message;
  toast.appendChild(textEl);

  _toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => _removeToast(toast), duration);
  }

  return toast;
}

function _removeToast(toast) {
  if (!toast || toast.dataset._removing === "1") return;
  toast.dataset._removing = "1";
  toast.style.opacity = "0";
  toast.style.transform = "translateX(20px)";
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 300);
}

(function _injectToastKeyframes() {
  if (document.getElementById("toast-keyframes")) return;
  const style = document.createElement("style");
  style.id = "toast-keyframes";
  style.textContent = `
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
})();

import { supabase as _supabaseClient } from "./src/utils/supabaseClient.js";
const supabaseClient = _supabaseClient;

// ==================== 右侧景区详情侧边栏 ====================
const sidebar = document.createElement("div");
sidebar.id = "spot-sidebar";
sidebar.innerHTML = `
  <div class="sidebar-overlay"></div>
  <div class="sidebar-panel">
    <button class="sidebar-close">&times;</button>
    <div class="sidebar-scroll">
      <div class="sidebar-hero">
        <div class="hero-placeholder">🏔</div>
        <div class="hero-title-overlay">
          <h2 class="hero-name"></h2>
          <span class="hero-hot-badge" style="display:none">⭐ 热门推荐</span>
          <p class="hero-desc"></p>
        </div>
      </div>
      <div class="sidebar-actions">
        <button class="sidebar-action-btn" id="btn-like">
          <span id="btn-like-icon">🤍</span>
          <span id="btn-like-text">点赞</span>
          <span id="btn-like-count"></span>
        </button>
        <button class="sidebar-action-btn" id="btn-fav">
          <span id="btn-fav-icon">☆</span>
          <span id="btn-fav-text">收藏</span>
          <span id="btn-fav-count"></span>
        </button>
        <button class="sidebar-action-btn" id="btn-comment-jump">
          <span>💬</span>
          <span>评论</span>
          <span id="btn-comment-count"></span>
        </button>
        <button class="sidebar-action-btn" id="btn-share" title="分享此景点">
          <span>📤</span>
          <span>分享</span>
        </button>
      </div>
      <div class="sidebar-section-title">精彩照片
        <button class="photo-upload-btn" id="photo-upload-btn" title="上传照片">＋</button>
      </div>
      <input type="file" id="photo-file-input" accept="image/jpeg,image/png,image/webp" style="display:none" />
      <div class="photo-upload-status" id="photo-upload-status"></div>
      <div class="sidebar-photos-area"></div>
      <div class="sidebar-section-title" id="comments-title">评论</div>
      <div class="sidebar-comments-area"></div>
      <div class="sidebar-comment-form" id="comment-form-wrapper">
        <div id="comment-login-prompt" style="display:none">
          <p style="color:rgba(255,255,255,0.5);text-align:center;margin-bottom:12px">
            请先登录后再发表评论
          </p>
        </div>
        <textarea id="comment-input" placeholder="写下你的评论..." rows="2"></textarea>
        <button id="comment-submit-btn">发表评论</button>
        <p id="comment-form-status" style="margin:10px 0 0;font-size:12px;text-align:center;min-height:18px;color:rgba(255,255,255,0.7)"></p>
      </div>
    </div>
  </div>
`;
document.body.appendChild(sidebar);

const sidebarOverlay = sidebar.querySelector(".sidebar-overlay");
const sidebarClose = sidebar.querySelector(".sidebar-close");
const heroPlaceholder = sidebar.querySelector(".hero-placeholder");
const heroName = sidebar.querySelector(".hero-name");
const heroDesc = sidebar.querySelector(".hero-desc");
const heroHotBadge = sidebar.querySelector(".hero-hot-badge");
const photosArea = sidebar.querySelector(".sidebar-photos-area");
const photoUploadBtn = sidebar.querySelector("#photo-upload-btn");
const photoFileInput = sidebar.querySelector("#photo-file-input");
const photoUploadStatus = sidebar.querySelector("#photo-upload-status");
const commentsArea = sidebar.querySelector(".sidebar-comments-area");
const commentLoginPrompt = sidebar.querySelector("#comment-login-prompt");
const commentInput = sidebar.querySelector("#comment-input");
const commentSubmitBtn = sidebar.querySelector("#comment-submit-btn");
const commentStatusEl = sidebar.querySelector("#comment-form-status");

const btnLike = sidebar.querySelector("#btn-like");
const btnLikeIcon = sidebar.querySelector("#btn-like-icon");
const btnLikeText = sidebar.querySelector("#btn-like-text");
const btnLikeCount = sidebar.querySelector("#btn-like-count");
const btnFav = sidebar.querySelector("#btn-fav");
const btnFavIcon = sidebar.querySelector("#btn-fav-icon");
const btnFavText = sidebar.querySelector("#btn-fav-text");
const btnFavCount = sidebar.querySelector("#btn-fav-count");
const btnCommentJump = sidebar.querySelector("#btn-comment-jump");
const btnCommentCount = sidebar.querySelector("#btn-comment-count");
const btnShare = sidebar.querySelector("#btn-share");

function closeSidebar() {
  transitionManager.closeDrawer(sidebar);
}

sidebarOverlay.addEventListener("click", closeSidebar);
sidebarClose.addEventListener("click", closeSidebar);

// ==================== 拓荒者引导 ====================

async function _showPioneerGuide(lng, lat) {
  closeSidebar();
  _closePioneerGuide();

  const pioneer = document.createElement("div");
  pioneer.id = "spot-pioneer-guide";
  pioneer.className = "spot-pioneer-guide";
  pioneer.innerHTML = `
    <div class="spot-pioneer-overlay"></div>
    <div class="spot-pioneer-panel">
      <button class="spot-pioneer-close">&times;</button>
      <div class="spot-pioneer-hero">
        <span class="spot-pioneer-icon">🗺️</span>
        <h2>探索新大陆！</h2>
        <p>该景区目前还没有旅行者留下过足迹<br>你想成为第一个点亮这里的「拓荒者」吗？</p>
        <p class="spot-pioneer-coords">坐标 ${lng.toFixed(4)}, ${lat.toFixed(4)}</p>
      </div>
      <div class="spot-pioneer-form">
        <input type="text" id="pioneer-name" placeholder="景区名称（如：珠穆朗玛峰）" maxlength="200" autocomplete="off" />
        <textarea id="pioneer-desc" placeholder="一句话打卡心得..." rows="2" maxlength="500"></textarea>
        <button id="pioneer-submit" class="spot-pioneer-btn">✨ 立即点亮并分享</button>
        <p id="pioneer-status" class="spot-pioneer-status"></p>
      </div>
    </div>
  `;
  document.body.appendChild(pioneer);

  const overlay = pioneer.querySelector(".spot-pioneer-overlay");
  const closeBtn = pioneer.querySelector(".spot-pioneer-close");
  const submitBtn = pioneer.querySelector("#pioneer-submit");
  const statusEl = pioneer.querySelector("#pioneer-status");
  const nameInput = pioneer.querySelector("#pioneer-name");
  const descInput = pioneer.querySelector("#pioneer-desc");
  const coordsEl = pioneer.querySelector(".spot-pioneer-coords");

  overlay.addEventListener("click", _closePioneerGuide);
  closeBtn.addEventListener("click", _closePioneerGuide);

  coordsEl.textContent = "📍 正在定位...";
  try {
    const amapGeocodeUrl =
      `https://restapi.amap.com/v3/geocode/regeo` +
      `?key=${import.meta.env.VITE_AMAP_KEY || ""}` +
      `&location=${lng},${lat}&extensions=base`;
    const resp = await fetch(amapGeocodeUrl);
    const geoData = await resp.json();
    if (geoData.status === "1" && geoData.regeocode) {
      const addr = geoData.regeocode.formatted_address || "";
      const poi = geoData.regeocode.addressComponent;
      const suggestion = poi?.township || poi?.district || poi?.city || addr || "";
      nameInput.placeholder = `如：${suggestion || "此处"}`;
      coordsEl.textContent = `📍 ${addr || `${lng.toFixed(4)}, ${lat.toFixed(4)}`}`;
    } else {
      coordsEl.textContent = `📍 ${lng.toFixed(4)}, ${lat.toFixed(4)}`;
    }
  } catch {
    coordsEl.textContent = `📍 ${lng.toFixed(4)}, ${lat.toFixed(4)}`;
  }

  submitBtn.addEventListener("click", async () => {
    if (!isLoggedIn()) { _openAuthModalSafely(); return; }
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    if (!name) { statusEl.textContent = "请输入景区名称"; statusEl.style.color = "rgba(255, 120, 120, 0.95)"; return; }
    if (!description) { statusEl.textContent = "请写下一句话打卡心得"; statusEl.style.color = "rgba(255, 120, 120, 0.95)"; return; }

    statusEl.textContent = "正在创建...";
    statusEl.style.color = "rgba(255, 255, 255, 0.7)";
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ 创建中...";

    try {
      const { data, error } = await supabaseClient
        .from("spots")
        .insert({ name, longitude: lng, latitude: lat, description, creator_id: currentUser.id })
        .select();
      if (error) throw error;
      const newSpot = data[0];
      addSpotToMap(newSpot);
      _closePioneerGuide();
      map.setZoomAndCenter(12, [lng, lat]);
      await showSpotDetail(newSpot.id, newSpot.name, newSpot.description);
    } catch (err) {
      console.error("[pioneer] 创建景区失败:", err);
      statusEl.textContent = "创建失败：" + (err.message || "请检查网络后重试");
      statusEl.style.color = "rgba(255, 120, 120, 0.95)";
      submitBtn.disabled = false;
      submitBtn.textContent = "✨ 立即点亮并分享";
    }
  });

  pioneer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !submitBtn.disabled) submitBtn.click();
  });
}

function _closePioneerGuide() {
  const el = document.getElementById("spot-pioneer-guide");
  if (el) el.remove();
}

// ==================== 工具：绘制景区到地图 ====================
function addSpotToMap(spot) {
  const isHot = spot.is_hot === true;
  const litIds = getLitSpotIds();
  const isLit = litIds.has(spot.id);

  // 已点亮足迹 → 橙色发光 marker
  const litPrefix = isLit ? "✨ " : "";
  const litColor = isLit ? "#ff7b25" : "#fff";
  const litGlow = isLit ? "0 0 10px rgba(255,123,37,0.7)" : "0 1px 2px rgba(0,0,0,0.8)";

  const marker = new AMap.Marker({
    position: [spot.longitude, spot.latitude],
    title: spot.name,
    label: {
      content: `<div style="color:${litColor};font-size:${isHot ? "13" : "12"}px;text-shadow:${litGlow};white-space:nowrap">${litPrefix}${isHot ? "⭐ " : ""}${escapeHtml(spot.name)}</div>`,
      direction: "top",
      offset: new AMap.Pixel(0, -5),
    },
    extData: { id: spot.id, name: spot.name, description: spot.description, isHot, isLit },
  });
  marker.on("click", () => onMarkerClick(marker));
  map.add(marker);
  markers.push(marker);
}

// ==================== 从 Supabase 加载景区数据 ====================
async function loadSpots() {
  let data = [];
  let error = null;
  try {
    if (isHotFilterActive()) {
      data = await getHotSpots();
    } else {
      const result = await supabaseClient.from("spots").select("*");
      data = result.data || [];
      error = result.error;
    }
  } catch (err) { error = err; }

  if (error) {
    console.error("[main] 加载景区数据失败:", error);
    _showToast("加载景区数据失败\n地图浏览不受影响", "error", 8000);
    return;
  }

  clearMarkers();
  data.forEach(addSpotToMap);
  const title = isHotFilterActive() ? "🔥 热门景区" : "📍 全部景区";
  showSpotList(data, title);
}

function clearMarkers() {
  map.clearMap();
  markers.length = 0;
}

// ==================== 列表点击联动 ====================
function flyToSpotAndHighlight(spotId, lng, lat, name, description, isHot) {
  if (!map) return;
  map.setZoomAndCenter(15, [lng, lat]);
  showSpotDetail(spotId, name, description, isHot);
  const marker = markers.find((m) => m.getExtData()?.id === spotId);
  if (!marker) return;
  const isMarkerHot = marker.getExtData()?.isHot;
  const origLabel = marker.getLabel();
  const origContent = origLabel ? origLabel.getContent() : "";
  const highlightContent = `<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${isMarkerHot ? "⭐ " : ""}${escapeHtml(name)}</div>`;
  marker.setLabel({ content: highlightContent, direction: "top", offset: new AMap.Pixel(0, -5) });
  setTimeout(() => {
    marker.setLabel({ content: origContent, direction: "top", offset: new AMap.Pixel(0, -5) });
  }, 2000);
}

// ==================== Marker 点击 → 侧边栏 ====================
async function onMarkerClick(marker) {
  _lastMarkerClickTime = Date.now();
  const ext = marker.getExtData();
  if (!ext || !ext.id) return;
  map.setZoomAndCenter(12, marker.getPosition());
  await showSpotDetail(ext.id, ext.name, ext.description, ext.isHot);
}

const _recentViews = new Map();

// ==================== 展示景区详情 ====================
async function showSpotDetail(spotId, name, description, isHot) {
  clickedSpotId = Number(spotId);
  heroName.textContent = name || "";
  heroDesc.textContent = description || "暂无介绍";
  heroPlaceholder.style.display = "flex";
  if (isHot) { heroHotBadge.style.display = "inline-block"; } else { heroHotBadge.style.display = "none"; }

  const now = Date.now();
  const lastView = _recentViews.get(clickedSpotId);
  if (!lastView || now - lastView > 30000) {
    _recentViews.set(clickedSpotId, now);
    incrementViewCount(clickedSpotId).catch((err) => console.warn("[main] 浏览量更新失败:", err));
  }

  photosArea.innerHTML = "";
  commentsArea.innerHTML = "";
  commentStatusEl.textContent = "";
  transitionManager.openDrawer(sidebar);
  _updateCommentFormAuth();
  await _refreshActionState();
  renderPhotos(clickedSpotId);
  await renderComments(clickedSpotId);
}

// ==================== 点赞/收藏按钮 ====================
btnLike.addEventListener("click", async () => {
  if (!currentUser) { _openAuthModalSafely(); return; }
  if (!clickedSpotId) return;
  btnLike.disabled = true;
  try {
    if (_liked) { await unlikeSpot(currentUser.id, clickedSpotId); _liked = false; }
    else { await likeSpot(currentUser.id, clickedSpotId); _liked = true; }
    await _refreshActionCounts();
    _updateActionButtons();
  } catch (err) { console.error("[main] 点赞操作失败:", err); }
  finally { btnLike.disabled = false; }
});

btnFav.addEventListener("click", async () => {
  if (!currentUser) { _openAuthModalSafely(); return; }
  if (!clickedSpotId) return;
  btnFav.disabled = true;
  try {
    if (_favorited) { await unfavoriteSpot(currentUser.id, clickedSpotId); _favorited = false; }
    else { await favoriteSpot(currentUser.id, clickedSpotId); _favorited = true; }
    await _refreshActionCounts();
    _updateActionButtons();
  } catch (err) { console.error("[main] 收藏操作失败:", err); }
  finally { btnFav.disabled = false; }
});

btnCommentJump.addEventListener("click", () => {
  const formEl = document.getElementById("comment-form-wrapper");
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "center" });
    if (!isLoggedIn()) { _openAuthModalSafely(); }
    else { setTimeout(() => commentInput.focus(), 400); }
  }
});

// ==================== 分享按钮 ====================
btnShare.addEventListener("click", () => {
  openShareModal();
});

function _updateActionButtons() {
  if (_liked) { btnLikeIcon.textContent = "❤️"; btnLikeText.textContent = "已赞"; btnLike.classList.add("active"); }
  else { btnLikeIcon.textContent = "🤍"; btnLikeText.textContent = "点赞"; btnLike.classList.remove("active"); }
  if (_favorited) { btnFavIcon.textContent = "⭐"; btnFavText.textContent = "已收藏"; btnFav.classList.add("active"); }
  else { btnFavIcon.textContent = "☆"; btnFavText.textContent = "收藏"; btnFav.classList.remove("active"); }
}

async function _refreshActionCounts() {
  if (!clickedSpotId) return;
  try {
    const [likes, favs, comments] = await Promise.all([
      getLikeCount(clickedSpotId), getFavoriteCount(clickedSpotId), getCommentCount(clickedSpotId),
    ]);
    btnLikeCount.textContent = likes > 0 ? likes : "";
    btnFavCount.textContent = favs > 0 ? favs : "";
    btnCommentCount.textContent = comments > 0 ? comments : "";
  } catch (err) { console.warn("[main] 刷新计数失败:", err); }
}

async function _refreshActionState() {
  if (!currentUser || !clickedSpotId) { _liked = false; _favorited = false; }
  else {
    try {
      const [liked, favorited] = await Promise.all([
        hasLiked(currentUser.id, clickedSpotId), hasFavorited(currentUser.id, clickedSpotId),
      ]);
      _liked = liked; _favorited = favorited;
    } catch (err) { console.warn("[main] 刷新互动状态失败:", err); }
  }
  _updateActionButtons();
  await _refreshActionCounts();
}

function _openAuthModalSafely() {
  const modal = document.getElementById("auth-modal");
  transitionManager.openModal(modal);
}

// ==================== 表单认证状态 ====================
function _updateAddFormAuth() {
  const promptEl = document.getElementById("add-form-login-prompt");
  const addressEl = document.getElementById("field-address");
  const descEl = document.getElementById("field-desc");
  const submitBtn = document.getElementById("add-submit");
  if (!promptEl || !addressEl || !descEl || !submitBtn) return;
  if (isLoggedIn()) {
    promptEl.style.display = "none";
    addressEl.disabled = false; descEl.disabled = false; submitBtn.disabled = false;
    submitBtn.textContent = "分享我的足迹";
    addressEl.placeholder = "景区名称或详细地址（如：杭州西湖）";
    descEl.placeholder = "景区游记或一句话介绍";
  } else {
    promptEl.style.display = "block";
    addressEl.disabled = true; descEl.disabled = true; submitBtn.disabled = true;
    submitBtn.textContent = "请先登录";
    addressEl.placeholder = "请登录后再分享";
    descEl.placeholder = "请登录后再分享";
  }
}

function _updateCommentFormAuth() {
  if (isLoggedIn()) {
    commentLoginPrompt.style.display = "none";
    commentInput.disabled = false; commentSubmitBtn.disabled = false;
    commentSubmitBtn.textContent = "发表评论";
    commentInput.placeholder = "写下你的评论...";
  } else {
    commentLoginPrompt.style.display = "block";
    commentInput.disabled = true; commentSubmitBtn.disabled = true;
    commentSubmitBtn.textContent = "请先登录";
    commentInput.placeholder = "请先登录后再发表评论";
  }
}

// ==================== 渲染照片墙 ====================
async function renderPhotos(spotId) {
  const [storyResult, imagesResult] = await Promise.allSettled([
    supabaseClient.from("user_stories").select("photo_urls").eq("spot_id", spotId).order("created_at", { ascending: false }),
    getSpotImages(spotId),
  ]);
  const allPhotos = [];
  if (storyResult.status === "fulfilled" && storyResult.value.data) {
    storyResult.value.data.forEach((s) => {
      if (s.photo_urls && Array.isArray(s.photo_urls)) s.photo_urls.forEach((url) => allPhotos.push({ url, source: "story" }));
    });
  }
  if (imagesResult.status === "fulfilled" && imagesResult.value) {
    imagesResult.value.forEach((img) => allPhotos.push({ url: img.url, source: "upload", id: img.id, userId: img.user_id }));
  }
  photosArea.innerHTML = "";
  if (allPhotos.length > 0) {
    const grid = document.createElement("div");
    grid.className = "photo-grid";
    const uniqueUrls = [...new Map(allPhotos.map((p) => [p.url, p])).values()];
    uniqueUrls.forEach((photo) => {
      const item = document.createElement("div");
      item.className = "photo-item";
      item.innerHTML = `<img src="${escapeHtml(photo.url)}" alt="景区照片" loading="lazy" />`;
      if (photo.source === "upload" && currentUser && photo.userId === currentUser.id) {
        const delBtn = document.createElement("button");
        delBtn.className = "photo-delete-btn";
        delBtn.textContent = "×";
        delBtn.title = "删除此照片";
        delBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (!confirm("确定要删除这张照片吗？")) return;
          try { await deleteSpotImage(photo.id, currentUser.id); renderPhotos(spotId); }
          catch (err) { console.error("[main] 删除照片失败:", err); }
        });
        item.appendChild(delBtn);
      }
      grid.appendChild(item);
    });
    photosArea.appendChild(grid);
  } else {
    photosArea.innerHTML = `<div class="photo-empty">快来上传第一张照片吧！</div>`;
  }
}

// ==================== 上传照片 ====================
photoUploadBtn.addEventListener("click", () => {
  if (!currentUser) { _openAuthModalSafely(); return; }
  if (!clickedSpotId) return;
  photoFileInput.click();
});

photoFileInput.addEventListener("change", async () => {
  const file = photoFileInput.files[0];
  if (!file) return;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    photoUploadStatus.textContent = "仅支持 JPG / PNG / WEBP 格式";
    photoUploadStatus.style.color = "rgba(255, 80, 80, 0.95)";
    photoFileInput.value = ""; return;
  }
  if (file.size > 5 * 1024 * 1024) {
    photoUploadStatus.textContent = "图片不能超过 5MB";
    photoUploadStatus.style.color = "rgba(255, 80, 80, 0.95)";
    photoFileInput.value = ""; return;
  }
  photoUploadStatus.textContent = "正在上传...";
  photoUploadStatus.style.color = "rgba(255, 255, 255, 0.7)";
  photoUploadBtn.disabled = true;
  try {
    const ext = file.name.split(".").pop().toLowerCase();
    const timestamp = Date.now();
    const storagePath = `${currentUser.id}/${clickedSpotId}/${timestamp}.${ext}`;
    const { error: uploadError } = await supabaseClient.storage.from("spot-images").upload(storagePath, file, { upsert: false });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabaseClient.storage.from("spot-images").getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;
    await saveSpotImage(clickedSpotId, currentUser.id, storagePath, publicUrl);
    photoUploadStatus.textContent = "上传成功！";
    photoUploadStatus.style.color = "rgba(80, 230, 140, 0.95)";
    await renderPhotos(clickedSpotId);
    setTimeout(() => { photoUploadStatus.textContent = ""; }, 2000);
  } catch (err) {
    console.error("[main] 上传照片失败:", err);
    photoUploadStatus.textContent = "上传失败：" + (err.message || "未知错误");
    photoUploadStatus.style.color = "rgba(255, 80, 80, 0.95)";
  } finally {
    photoUploadBtn.disabled = false;
    photoFileInput.value = "";
  }
});

// ==================== 渲染评论列表 ====================
async function renderComments(spotId) {
  let comments;
  try { comments = await getComments(spotId); }
  catch (err) { console.warn("[main] 加载评论失败:", err); comments = []; }
  const titleEl = document.getElementById("comments-title");
  if (titleEl) titleEl.textContent = `评论 (${comments.length})`;
  commentsArea.innerHTML = "";
  if (comments.length === 0) { commentsArea.innerHTML = `<div class="comment-empty">暂无评论，来说两句吧</div>`; return; }
  const list = document.createElement("div");
  list.className = "comment-list";
  comments.forEach((c) => {
    const timeStr = _formatTime(c.created_at);
    const avatarSrc = c.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.user_id)}`;
    const isOwner = currentUser && c.user_id === currentUser.id;
    const bubble = document.createElement("div");
    bubble.className = "comment-bubble";
    bubble.innerHTML = `
      <div class="comment-header">
        <img class="comment-avatar" src="${escapeHtml(avatarSrc)}" alt="" />
        <span class="comment-author-name">${escapeHtml(c.username)}</span>
        <span class="comment-time">${timeStr}</span>
        ${isOwner ? `<button class="comment-delete-btn" data-id="${c.id}">删除</button>` : ""}
      </div>
      <div class="comment-text">${escapeHtml(c.content)}</div>
    `;
    list.appendChild(bubble);
  });
  commentsArea.appendChild(list);
  list.querySelectorAll(".comment-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("确定要删除这条评论吗？")) return;
      const id = Number(btn.dataset.id);
      btn.disabled = true;
      try { await deleteComment(id, currentUser.id); await renderComments(spotId); await _refreshActionCounts(); }
      catch (err) { console.error("[main] 删除评论失败:", err); btn.disabled = false; }
    });
  });
}

function _formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}小时前`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}天前`;
  return d.toLocaleDateString("zh-CN");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ==================== 发表评论 ====================
commentSubmitBtn.addEventListener("click", async () => {
  if (!clickedSpotId) { commentStatusEl.textContent = "请先点击地球上的景区"; commentStatusEl.style.color = "rgba(255, 80, 80, 0.95)"; return; }
  if (!isLoggedIn()) { _openAuthModalSafely(); return; }
  const content = commentInput.value.trim();
  if (!content) { commentStatusEl.textContent = "请输入评论内容"; commentStatusEl.style.color = "rgba(255, 80, 80, 0.95)"; return; }
  commentStatusEl.textContent = "正在发表...";
  commentStatusEl.style.color = "rgba(255, 255, 255, 0.8)";
  commentSubmitBtn.disabled = true;
  try { await addComment(currentUser.id, clickedSpotId, content); }
  catch (err) {
    console.error("[main] 发表评论失败:", err);
    commentStatusEl.textContent = "发表失败：" + err.message;
    commentStatusEl.style.color = "rgba(255, 80, 80, 0.95)";
    commentSubmitBtn.disabled = false; return;
  }
  commentStatusEl.textContent = "发表成功！";
  commentStatusEl.style.color = "rgba(80, 230, 140, 0.95)";
  commentInput.value = "";
  await renderComments(clickedSpotId);
  await _refreshActionCounts();
  commentSubmitBtn.disabled = false;
  setTimeout(() => { commentStatusEl.textContent = ""; }, 2000);
});

// ==================== 悬浮添加表单 ====================
const formContainer = document.createElement("div");
formContainer.id = "add-form";
formContainer.innerHTML = `
  <div class="add-form-body">
    <h3>分享你的足迹</h3>
    <div id="add-form-login-prompt" style="display:none">
      <p style="color:rgba(255,255,255,0.5);text-align:center;margin-bottom:10px;font-size:12px">请先登录后再分享足迹</p>
    </div>
    <input type="text" id="field-address" placeholder="景区名称或详细地址（如：杭州西湖）" />
    <textarea id="field-desc" placeholder="景区游记或一句话介绍" rows="2"></textarea>
    <button id="add-submit">分享我的足迹</button>
    <p class="add-form-status"></p>
  </div>
`;
document.body.appendChild(formContainer);

const addFormStatusEl = formContainer.querySelector(".add-form-status");
const addSubmitBtn = formContainer.querySelector("#add-submit");
addSubmitBtn.addEventListener("click", async () => {
  if (!isLoggedIn()) { _openAuthModalSafely(); return; }
  const query = formContainer.querySelector("#field-address").value.trim();
  const description = formContainer.querySelector("#field-desc").value.trim();
  if (!query || !description) { addFormStatusEl.textContent = "请完整填写所有字段"; addFormStatusEl.style.color = "rgba(255, 80, 80, 0.95)"; return; }
  addFormStatusEl.textContent = "正在查询地址...";
  addFormStatusEl.style.color = "rgba(255, 255, 255, 0.8)";
  let longitude, latitude;
  try { const result = await geocodeSpot(query); longitude = result.longitude; latitude = result.latitude; }
  catch (err) { console.error("[main] 高德地理编码失败:", err); addFormStatusEl.textContent = "查询失败：" + err.message; addFormStatusEl.style.color = "rgba(255, 80, 80, 0.95)"; return; }
  addFormStatusEl.textContent = "正在保存...";
  addFormStatusEl.style.color = "rgba(255, 255, 255, 0.8)";
  const { data, error } = await supabaseClient.from("spots").insert({ name: query, longitude, latitude, description, creator_id: currentUser.id }).select();
  if (error) { console.error("[main] 添加景区失败:", error); addFormStatusEl.textContent = "添加失败：" + error.message; addFormStatusEl.style.color = "rgba(255, 80, 80, 0.95)"; return; }
  addFormStatusEl.textContent = "添加成功！";
  addFormStatusEl.style.color = "rgba(80, 230, 140, 0.95)";
  formContainer.querySelector("#field-address").value = "";
  formContainer.querySelector("#field-desc").value = "";
  const newSpot = data[0];
  addSpotToMap(newSpot);
  map.setZoomAndCenter(12, [newSpot.longitude, newSpot.latitude]);
  setTimeout(() => { addFormStatusEl.textContent = ""; }, 2000);
});

// ==================== 统一启动 ====================
async function startApplication() {
  updateLoadingProgress(10, "初始化应用...");

  console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");
  try { await window.__amapPromise; console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪"); }
  catch (err) { console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:", err); _showToast("⚠️ 地图服务加载失败，请刷新页面", "error", 0); return; }

  updateLoadingProgress(30, "加载地图 SDK...");

  console.log("[调试步骤2/6] 🗺️ 创建地图实例...");
  map = new AMap.Map("mapContainer", {
    zoom: 3, center: [105.0, 35.0], viewMode: "2D",
    resizeEnable: true, dragEnable: true, zoomEnable: true,
    doubleClickZoom: true, keyboardEnable: true, scrollWheel: true,
    mapStyle: "amap://styles/darkblue",
  });
  console.log("[调试步骤2/6] ✅ 地图实例创建完成");

  map.on("click", (e) => {
    if (Date.now() - _lastMarkerClickTime < 300) return;
    _showPioneerGuide(e.lnglat.getLng(), e.lnglat.getLat());
  });

  initHotSpots({ onSpotClick: flyToSpotAndHighlight });
  initSearch({ onSpotClick: flyToSpotAndHighlight });
  initResponsive();
  initCreatePost();
  initCommunity();
  initShareModal({ showToast: _showToast });

  onMenuAction((action) => {
    switch (action) {
      case "home": setHotFilter(false); loadSpots(); break;
      case "community": openCommunity(); break;
      case "hot": setHotFilter(true); loadSpots(); break;
      case "ranking": toggleRanking(getHotSpotRanking); break;
      case "favorites": case "profile":
        if (isLoggedIn()) openProfileCenter(); else _openAuthModalSafely();
        break;
    }
  });

  updateLoadingProgress(55, "初始化数据库...");

  console.log("[调试步骤3/6] 🔐 初始化认证模块...");
  try { await initAuth(); console.log("[调试步骤3/6] ✅ 认证模块初始化完成"); }
  catch (err) {
    console.error("[调试步骤3/6] ❌ 认证初始化失败:", err);
    _showToast("⚠️ 认证服务初始化失败\n地图浏览不受影响", "warn", 10000);
  }

  updateLoadingProgress(65, "恢复登录状态...");

  console.log("[调试步骤4/6] 🗄️ 初始化数据库...");
  initDB();
  console.log("[调试步骤4/6] ✅ 数据库初始化完成");

  updateLoadingProgress(75, "加载景区数据...");

  console.log("[调试步骤5/6] 👤 注册 onAuthChange...");
  onAuthChange((user, profile) => {
    currentUser = user;
    currentProfile = profile;
    if (!user) { const pcModal = document.getElementById("profile-center-modal"); if (pcModal) pcModal.classList.remove("open"); }
    _updateAddFormAuth();
    // 足迹刷新（登录/退出时）
    refreshFootprints().then(() => loadSpots());
    if (clickedSpotId && sidebar.classList.contains("open")) { _updateCommentFormAuth(); renderComments(clickedSpotId); }
  });
  console.log("[调试步骤5/6] ✅ onAuthChange 就绪");

  console.log("[调试步骤6/6] 📍 加载景区数据...");
  _updateAddFormAuth();
  loadSpots();

  updateLoadingProgress(100, "完成");

  // 初始化完成 → 淡出 Loading
  setTimeout(() => hideLoadingScreen(), 200);

  // 微信环境：自动初始化 JSSDK，确保分享卡片数据在用户点击 "..." 前就绪
  const shareData = getShareData();
  initWeChatShare({
    title: shareData.title,
    desc: shareData.summary,
    link: shareData.url,
    imgUrl: shareData.pic,
  }).then((result) => {
    if (result.ok) console.log("[main] 微信 JSSDK 自动初始化成功");
    else console.log("[main] 微信 JSSDK 自动初始化跳过:", result.error);
  });

  window.addEventListener("focus-spot", (e) => {
    const { spotId, lng, lat, name, description } = e.detail;
    map.setZoomAndCenter(14, [lng, lat]);
    showSpotDetail(spotId, name, description, false);
  });

  console.log("[调试步骤6/6] ✅ 应用启动完成！");
}

startApplication();
