/**
 * responsive.js — 响应式布局模块（纯 Vanilla JS）
 * ============================================================
 * 功能：
 *   1. isMobile 设备检测（window.innerWidth < 768）
 *   2. resize 监听自动更新
 *   3. 桌面端：横向导航栏（首页|热门景区|排行榜|收藏|个人中心）
 *   4. 手机端：汉堡菜单 ☰ → 抽屉菜单
 *   5. 菜单项点击 → 派发自定义事件供 main.js 监听
 *
 * 用法：
 *   import { initResponsive, isMobile, onMenuAction } from "./responsive.js";
 *   initResponsive();
 *   onMenuAction((action) => { ... });
 */

import { transitionManager } from "./transition.js";

// ==================== 模块状态 ====================
let _isMobile = window.innerWidth < 768;
let _listeners = [];
let _navBar = null;
let _hamburgerBtn = null;
let _menuDrawer = null;
let _menuOpen = false;

/** 导出：当前是否为移动端 */
export { _isMobile as isMobile };

/**
 * 响应式设备检测阈值
 * 手机：< 768px | 平板：768~1024px | 电脑：>= 1024px
 */
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

/** 当前设备类型 */
export function getDeviceType() {
  const w = window.innerWidth;
  if (w < MOBILE_BREAKPOINT) return "mobile";
  if (w < TABLET_BREAKPOINT) return "tablet";
  return "desktop";
}

/** 注册菜单点击回调 */
export function onMenuAction(callback) {
  if (typeof callback === "function") {
    _listeners.push(callback);
    return () => {
      _listeners = _listeners.filter((fn) => fn !== callback);
    };
  }
}

function _notifyListeners(action) {
  _listeners.forEach((fn) => {
    try {
      fn(action);
    } catch (err) {
      console.error("[responsive] 回调执行失败:", err);
    }
  });
}

// ==================== 创建 DOM ====================

function _createNavBar() {
  const bar = document.createElement("nav");
  bar.id = "app-navbar";
  bar.className = "app-navbar";
  bar.innerHTML = `
    <!-- 汉堡菜单按钮（仅手机端显示） -->
    <button class="nav-hamburger" id="nav-hamburger" aria-label="菜单">
      <span class="nav-hamburger-line"></span>
      <span class="nav-hamburger-line"></span>
      <span class="nav-hamburger-line"></span>
    </button>

    <!-- Logo / 品牌名 -->
    <span class="nav-brand">🌍 旅行地球</span>

    <!-- 桌面端横向菜单 -->
    <div class="nav-links" id="nav-links">
      <button class="nav-link" data-action="home">🏠 首页</button>
      <button class="nav-link" data-action="community">⚡ 避雷社区</button>
      <button class="nav-link" data-action="hot">🔥 热门景区</button>
      <button class="nav-link" data-action="ranking">🏆 排行榜</button>
      <button class="nav-link" data-action="favorites">⭐ 收藏</button>
      <button class="nav-link" data-action="profile">👤 个人中心</button>
    </div>
  `;

  return bar;
}

function _createMenuDrawer() {
  const drawer = document.createElement("div");
  drawer.id = "menu-drawer";
  drawer.className = "menu-drawer";
  drawer.innerHTML = `
    <div class="menu-drawer-overlay"></div>
    <div class="menu-drawer-panel">
      <div class="menu-drawer-header">
        <span class="menu-drawer-title">🌍 旅行地球</span>
        <button class="menu-drawer-close" id="menu-drawer-close">&times;</button>
      </div>
      <div class="menu-drawer-body">
        <button class="menu-drawer-item" data-action="home">
          <span class="menu-item-icon">🏠</span> 首页
        </button>
        <button class="menu-drawer-item" data-action="community">
          <span class="menu-item-icon">⚡</span> 避雷社区
        </button>
        <button class="menu-drawer-item" data-action="hot">
          <span class="menu-item-icon">🔥</span> 热门景区
        </button>
        <button class="menu-drawer-item" data-action="ranking">
          <span class="menu-item-icon">🏆</span> 排行榜
        </button>
        <button class="menu-drawer-item" data-action="favorites">
          <span class="menu-item-icon">⭐</span> 我的收藏
        </button>
        <button class="menu-drawer-item" data-action="profile">
          <span class="menu-item-icon">👤</span> 个人中心
        </button>
      </div>
    </div>
  `;

  return drawer;
}

// ==================== 菜单逻辑 ====================

function _openMenu() {
  if (_menuOpen) return;
  _menuOpen = true;
  transitionManager.openDrawer(_menuDrawer);
  _hamburgerBtn.classList.add("active");
  document.body.style.overflow = "hidden";
}

function _closeMenu() {
  if (!_menuOpen) return;
  _menuOpen = false;
  transitionManager.closeDrawer(_menuDrawer);
  _hamburgerBtn.classList.remove("active");
  document.body.style.overflow = "";
}

function _handleMenuClick(action) {
  _closeMenu();
  _notifyListeners(action);
}

// ==================== 绑定事件 ====================

function _bindEvents() {
  if (!_hamburgerBtn || !_menuDrawer || !_navBar) return;

  // 汉堡菜单点击
  _hamburgerBtn.addEventListener("click", () => {
    if (_menuOpen) {
      _closeMenu();
    } else {
      _openMenu();
    }
  });

  // 遮罩层点击关闭
  const overlay = _menuDrawer.querySelector(".menu-drawer-overlay");
  if (overlay) {
    overlay.addEventListener("click", _closeMenu);
  }

  // 关闭按钮
  const closeBtn = _menuDrawer.querySelector(".menu-drawer-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", _closeMenu);
  }

  // 所有菜单项点击（桌面端 + 抽屉菜单）
  const allItems = _navBar.querySelectorAll("[data-action]");
  const drawerItems = _menuDrawer.querySelectorAll("[data-action]");

  allItems.forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.dataset.action;
      if (action) _notifyListeners(action);
    });
  });

  drawerItems.forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.dataset.action;
      if (action) _handleMenuClick(action);
    });
  });

  // ESC 关闭
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && _menuOpen) {
      _closeMenu();
    }
  });
}

// ==================== 窗口调整监听 ====================

let _resizeTimer = null;
function _onResize() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    const wasMobile = _isMobile;
    _isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    // 如果从手机切换到桌面，关闭抽屉菜单
    if (wasMobile && !_isMobile && _menuOpen) {
      _closeMenu();
    }

    // 更新 body class 供 CSS 使用
    _updateBodyClass();
  }, 150);
}

function _updateBodyClass() {
  const cls = getDeviceType();
  document.body.classList.remove("device-mobile", "device-tablet", "device-desktop");
  document.body.classList.add(`device-${cls}`);
}

// ==================== 初始化 ====================

/**
 * 初始化响应式模块
 * 创建导航栏 + 抽屉菜单 + resize 监听
 */
export function initResponsive() {
  // 设置初始 body class
  _updateBodyClass();

  // 创建导航栏
  _navBar = _createNavBar();
  document.body.insertBefore(_navBar, document.body.firstChild);

  // 创建抽屉菜单
  _menuDrawer = _createMenuDrawer();
  document.body.appendChild(_menuDrawer);

  // 获取引用
  _hamburgerBtn = document.getElementById("nav-hamburger");

  // 绑定事件
  _bindEvents();

  // 监听 resize
  window.addEventListener("resize", _onResize);

  console.log("[responsive] 响应式模块初始化完成，当前设备:", getDeviceType());
}
