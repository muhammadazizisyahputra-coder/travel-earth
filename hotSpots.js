/**
 * hotSpots.js — 热门景区模块（纯 Vanilla JS）
 * ============================================================
 * 功能：
 *   1. 地图顶部切换按钮（🌍全部景区 / 🔥热门景区 / 🏆排行榜）
 *   2. 景区列表面板（桌面左栏 / 移动端底部抽屉）
 *   3. 热门景区排行榜面板
 *   4. 点击列表/排行榜 → 地图飞行 + 打开详情 + Marker 高亮
 *   5. 侧边栏收起/展开切换按钮（毛玻璃 SVG 箭头，absolute 子元素挂在面板右边缘）
 *   6. 面板头部「＋ 避雷」按钮 → 打开发帖弹窗
 *   7. 每个景区条目旁「✨ 点亮」按钮 → user_footprints 开关切换
 *
 * 用法：
 *   import { initHotSpots, isHotFilterActive, showSpotList, refreshRanking,
 *            refreshFootprints, getLitSpotIds } from "./hotSpots.js";
 *   initHotSpots({ onFilterChange, onSpotClick });
 */

import { openCreatePostModal } from "./createPost.js";
import { isLoggedIn, getUser } from "./auth.js";
import { getUserFootprints, addFootprint, removeFootprint } from "./db.js";
import { transitionManager } from "./transition.js";

// ==================== 模块状态 ====================
let _isHotFilterActive = false;
let _onSpotClick = null;
let _rankingPanel = null;
let _rankingVisible = false;
let _spotListPanel = null;
let _spotListVisible = false;
let _spotListToggleBtn = null;   // 切换按钮（面板的 absolute 子元素）
let _isSidebarOpen = false;       // 面板当前是否展开
let _litSpotIds = new Set();      // 当前用户已点亮的 spot_id 集合

export function isHotFilterActive() {
  return _isHotFilterActive;
}

/** 获取已点亮的 spot_id 集合（供 main.js 地图渲染使用） */
export function getLitSpotIds() {
  return _litSpotIds;
}

/** 刷新足迹数据（登录/退出后调用） */
export async function refreshFootprints() {
  const user = getUser();
  if (!user) {
    _litSpotIds.clear();
    return;
  }
  try {
    const footprints = await getUserFootprints(user.id);
    _litSpotIds = new Set(footprints.map((f) => f.spot_id));
  } catch (err) {
    console.error("[hotSpots] 加载足迹失败:", err);
  }
}

// ==================== 景区列表面板 + 切换按钮 ====================

/**
 * 创建景区列表面板 DOM。
 * 切换按钮作为面板的 absolute 子元素，挂在面板右侧边缘外侧。
 * 面板用 left 属性滑入/滑出（而非 translateX），切换按钮自动跟随。
 */
function _createSpotListPanel() {
  const panel = document.createElement("div");
  panel.id = "spot-list-panel";
  panel.className = "spot-list-panel";
  panel.innerHTML = `
    <!-- 切换按钮：absolute 定位在面板右侧外边缘 -->
    <button class="spot-list-toggle" id="spot-list-toggle" aria-label="切换侧边栏" title="展开景区列表">
      <svg class="spot-list-toggle-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3 L11 8 L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="spot-list-header">
      <span class="spot-list-title" id="spot-list-title">📍 景区列表</span>
      <span class="spot-list-count" id="spot-list-count"></span>
      <button class="spot-list-create-post" id="spot-list-create-post" title="分享避雷心得">＋ 避雷</button>
      <button class="spot-list-close">&times;</button>
    </div>
    <div class="spot-list-body" id="spot-list-body">
      <p class="spot-list-loading">加载中...</p>
    </div>
  `;

  // 内部 × 关闭按钮
  panel.querySelector(".spot-list-close").addEventListener("click", _hideSpotList);

  // 「＋ 避雷」按钮 → 打开发帖弹窗
  const createPostBtn = panel.querySelector("#spot-list-create-post");
  if (createPostBtn) {
    createPostBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isLoggedIn()) {
        const authModal = document.getElementById("auth-modal");
        if (authModal) transitionManager.openModal(authModal);
        return;
      }
      openCreatePostModal();
    });
  }

  // 点击面板外部遮罩关闭（移动端底部抽屉场景）
  panel.addEventListener("click", (e) => {
    if (e.target === panel) _hideSpotList();
  });

  return panel;
}

/**
 * 绑定切换按钮点击事件（在面板创建后调用）
 * 切换按钮是面板的子元素，通过 left 属性与面板联动滑入/滑出
 */
function _bindToggleButton() {
  if (!_spotListPanel) return;
  _spotListToggleBtn = _spotListPanel.querySelector("#spot-list-toggle");
  if (!_spotListToggleBtn) return;

  _spotListToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (_isSidebarOpen) {
      _hideSpotList();
    } else {
      _openSpotListFromToggle();
    }
  });
}

function _openSpotListFromToggle() {
  if (!_spotListPanel) return;
  transitionManager.openDrawer(_spotListPanel);
  _spotListVisible = true;
  _isSidebarOpen = true;
  _updateToggleButtonState();
}

function _updateToggleButtonState() {
  if (!_spotListToggleBtn) return;

  const arrow = _spotListToggleBtn.querySelector(".spot-list-toggle-arrow");
  if (_isSidebarOpen) {
    arrow.style.transform = "rotate(180deg)";
    _spotListToggleBtn.title = "收起景区列表";
    _spotListToggleBtn.classList.add("spot-list-toggle--open");
  } else {
    arrow.style.transform = "rotate(0deg)";
    _spotListToggleBtn.title = "展开景区列表";
    _spotListToggleBtn.classList.remove("spot-list-toggle--open");
  }
}

/**
 * 显示景区列表（由 main.js 的 loadSpots 调用）
 * 每个条目右侧带「✨ 点亮」按钮
 */
export function showSpotList(spots, title) {
  if (!_spotListPanel) {
    _spotListPanel = _createSpotListPanel();
    document.body.appendChild(_spotListPanel);
    _bindToggleButton();
  }

  const titleEl = document.getElementById("spot-list-title");
  const countEl = document.getElementById("spot-list-count");
  const bodyEl = document.getElementById("spot-list-body");

  if (titleEl) titleEl.textContent = title || "📍 景区列表";
  if (countEl) countEl.textContent = spots ? `${spots.length} 个` : "";

  if (!spots || spots.length === 0) {
    if (bodyEl) bodyEl.innerHTML = '<p class="spot-list-empty">暂无景区数据</p>';
  } else {
    if (bodyEl) {
      bodyEl.innerHTML = spots
        .map(
          (spot) => {
            const isLit = _litSpotIds.has(spot.id);
            const lightIcon = isLit ? "✨" : "☆";
            const lightClass = isLit ? "spot-list-light-btn--active" : "";
            return `
        <div class="spot-list-item" data-spot-id="${spot.id}"
             data-lng="${spot.longitude}" data-lat="${spot.latitude}"
             data-name="${_escapeAttr(spot.name)}"
             data-desc="${_escapeAttr(spot.description || "")}"
             data-is-hot="${spot.is_hot ? "1" : "0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${_escapeHtml(spot.name)}</span>
            <span class="spot-list-item-city">${_escapeHtml(spot.city || spot.address || "")}</span>
          </div>
          ${spot.is_hot ? '<span class="spot-list-item-badge">🔥 热门</span>' : ""}
          <button class="spot-list-light-btn ${lightClass}"
                  data-spot-id="${spot.id}"
                  data-city-name="${_escapeAttr(spot.city || spot.address || spot.name)}"
                  title="${isLit ? "已点亮" : "点亮足迹"}">
            ${lightIcon}
          </button>
        </div>
      `;
          }
        )
        .join("");

      // ---- 点击条目 → 地图飞行 ----
      bodyEl.querySelectorAll(".spot-list-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          // 如果点的是点亮按钮，不触发跳转
          if (e.target.closest(".spot-list-light-btn")) return;

          const spotId = Number(item.dataset.spotId);
          const lng = parseFloat(item.dataset.lng);
          const lat = parseFloat(item.dataset.lat);
          const name = item.dataset.name;
          const desc = item.dataset.desc;
          const isHot = item.dataset.isHot === "1";

          if (_onSpotClick) {
            _onSpotClick(spotId, lng, lat, name, desc, isHot);
          }
        });
      });

      // ---- 「✨ 点亮」按钮事件 ----
      bodyEl.querySelectorAll(".spot-list-light-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation(); // 阻止冒泡到条目点击

          const user = getUser();
          if (!user) {
            const authModal = document.getElementById("auth-modal");
            if (authModal) transitionManager.openModal(authModal);
            return;
          }

          const spotId = Number(btn.dataset.spotId);
          const cityName = btn.dataset.cityName || "";
          const isLit = _litSpotIds.has(spotId);

          // 乐观更新 UI
          btn.disabled = true;
          try {
            if (isLit) {
              await removeFootprint(user.id, spotId);
              _litSpotIds.delete(spotId);
            } else {
              await addFootprint(user.id, spotId, cityName);
              _litSpotIds.add(spotId);
            }
            // 重新渲染当前列表（刷新按钮状态）
            // 用当前的 spots 数据重新 showSpotList
            const currentSpots = spots; // closure 捕获
            const currentTitle = titleEl ? titleEl.textContent : "📍 景区列表";
            showSpotList(currentSpots, currentTitle);
          } catch (err) {
            console.error("[hotSpots] 足迹操作失败:", err);
            btn.disabled = false;
            // 简单 toast 提示
            _showToast(err.message || "操作失败", "error");
          }
        });
      });
    }
  }

  // 滑出面板 + 更新切换按钮
  transitionManager.openDrawer(_spotListPanel);
  _spotListVisible = true;
  _isSidebarOpen = true;
  _updateToggleButtonState();
}

function _hideSpotList() {
  transitionManager.closeDrawer(_spotListPanel);
  _spotListVisible = false;
  _isSidebarOpen = false;
  _updateToggleButtonState();
}

// ==================== 排行榜面板 ====================

function _createRankingPanel() {
  const panel = document.createElement("div");
  panel.id = "hot-ranking-panel";
  panel.className = "hot-ranking-panel";
  panel.innerHTML = `
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `;

  panel.querySelector(".hot-ranking-close").addEventListener("click", _hideRanking);
  return panel;
}

export async function refreshRanking(getHotSpotRanking) {
  const listEl = document.getElementById("hot-ranking-list");
  if (!listEl) return;

  try {
    const spots = await getHotSpotRanking(10);
    if (!spots || spots.length === 0) {
      listEl.innerHTML = '<p class="hot-ranking-empty">暂无热门景区数据</p>';
      return;
    }

    listEl.innerHTML = spots
      .map(
        (spot, i) => `
      <div class="hot-ranking-item" data-spot-id="${spot.id}"
           data-lng="${spot.longitude}" data-lat="${spot.latitude}"
           data-name="${_escapeAttr(spot.name)}"
           data-desc="${_escapeAttr(spot.description || "")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${i < 3 ? "hot-ranking-index--top" : ""}">${i + 1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${i < 3 ? "⭐ " : ""}${_escapeHtml(spot.name)}</span>
          <span class="hot-ranking-city">${_escapeHtml(spot.city || spot.address || "")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${spot.views || 0}</span>
      </div>
    `
      )
      .join("");

    listEl.querySelectorAll(".hot-ranking-item").forEach((item) => {
      item.addEventListener("click", () => {
        const spotId = Number(item.dataset.spotId);
        const lng = parseFloat(item.dataset.lng);
        const lat = parseFloat(item.dataset.lat);
        const name = item.dataset.name;
        const desc = item.dataset.desc;

        if (_onSpotClick) {
          _onSpotClick(spotId, lng, lat, name, desc, true);
        }
      });
    });
  } catch (err) {
    console.error("[hotSpots] 排行榜加载失败:", err);
    listEl.innerHTML = '<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>';
  }
}

function _showRanking() {
  if (!_rankingPanel) {
    _rankingPanel = _createRankingPanel();
    document.body.appendChild(_rankingPanel);
  }
  transitionManager.openDrawer(_rankingPanel);
  _rankingVisible = true;
}

function _hideRanking() {
  transitionManager.closeDrawer(_rankingPanel);
  _rankingVisible = false;
}

// ==================== 公开 API（供顶部导航栏调用） ====================

export function setHotFilter(active) {
  _isHotFilterActive = active;
}

export function toggleRanking(getHotSpotRanking) {
  if (_rankingVisible) {
    _hideRanking();
  } else {
    _showRanking();
    refreshRanking(getHotSpotRanking).catch((err) =>
      console.error("[hotSpots] 排行榜刷新失败:", err)
    );
  }
}

// ==================== 初始化 ====================

export function initHotSpots(opts = {}) {
  _onSpotClick = opts.onSpotClick || null;

  // 预创建景区列表面板（隐藏），切换按钮作为子元素一起创建
  _spotListPanel = _createSpotListPanel();
  document.body.appendChild(_spotListPanel);
  _bindToggleButton();

  // 预创建排行榜面板（隐藏）
  _rankingPanel = _createRankingPanel();
  document.body.appendChild(_rankingPanel);
}

// ==================== 简易 Toast ====================
let _toastTimer = null;
function _showToast(msg, type = "info") {
  // 移除已有 toast
  const old = document.getElementById("spot-list-toast");
  if (old) old.remove();
  if (_toastTimer) clearTimeout(_toastTimer);

  const colors = { error: "#ef4444", success: "#10b981", info: "#3b82f6" };
  const el = document.createElement("div");
  el.id = "spot-list-toast";
  el.style.cssText =
    `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:11000;` +
    `background:rgba(20,20,30,0.95);backdrop-filter:blur(12px);` +
    `border-left:4px solid ${colors[type] || colors.info};` +
    `color:#e2e8f0;padding:10px 20px;border-radius:8px;font-size:14px;` +
    `box-shadow:0 8px 32px rgba(0,0,0,0.5);pointer-events:auto;` +
    `animation:spot-list-toast-in 0.3s ease;`;
  el.textContent = msg;
  document.body.appendChild(el);

  _toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// 注入 toast 动画
(function () {
  if (document.getElementById("spot-list-toast-style")) return;
  const s = document.createElement("style");
  s.id = "spot-list-toast-style";
  s.textContent =
    "@keyframes spot-list-toast-in{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}";
  document.head.appendChild(s);
})();

// ==================== 工具 ====================
function _escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function _escapeAttr(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
