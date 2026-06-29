// ==================== 统一页面切换动画系统 ====================
//
// 所有动画统一入口。底层仍使用 CSS classList 驱动，但调用方不再直接操作 class。
//
// 用法:
//   import { transitionManager } from "./transition.js";
//
//   transitionManager.openDrawer(el);
//   transitionManager.closeDrawer(el);
//   transitionManager.openModal(el);
//   transitionManager.closeModal(el);
//   transitionManager.openPage(el);
//   transitionManager.closePage(el);

const T = {
  fast:   150,
  normal: 250,
  slow:   300,
};

export const transitionManager = {
  // ==================== Drawer（抽屉：侧边栏、景区列表、排行榜、菜单） ====================

  /**
   * 打开抽屉
   * @param {HTMLElement} el
   */
  openDrawer(el) {
    if (!el) return;
    el.classList.add("open");
  },

  /**
   * 关闭抽屉
   * @param {HTMLElement} el
   */
  closeDrawer(el) {
    if (!el) return;
    el.classList.remove("open");
  },

  /**
   * 切换抽屉
   * @param {HTMLElement} el
   * @returns {boolean} 切换后的状态 (true=打开)
   */
  toggleDrawer(el) {
    if (!el) return false;
    const isOpen = el.classList.contains("open");
    if (isOpen) {
      el.classList.remove("open");
    } else {
      el.classList.add("open");
    }
    return !isOpen;
  },

  // ==================== Modal（弹窗：登录、注册、编辑资料、修改密码、发帖） ====================

  /**
   * 打开弹窗
   * @param {HTMLElement} el
   */
  openModal(el) {
    if (!el) return;
    el.classList.add("open");
  },

  /**
   * 关闭弹窗
   * @param {HTMLElement} el
   */
  closeModal(el) {
    if (!el) return;
    el.classList.remove("open");
  },

  // ==================== Page（全屏页面：避雷社区等） ====================

  /**
   * 打开全屏页面
   * @param {HTMLElement} el
   */
  openPage(el) {
    if (!el) return;
    el.classList.add("open");
    document.body.style.overflow = "hidden";
  },

  /**
   * 关闭全屏页面
   * @param {HTMLElement} el
   */
  closePage(el) {
    if (!el) return;
    el.classList.remove("open");
    document.body.style.overflow = "";
  },

  // ==================== 工具 ====================
  /** 获取动画时长常量 (ms) */
  get DURATION() {
    return T;
  },
};

export default transitionManager;
