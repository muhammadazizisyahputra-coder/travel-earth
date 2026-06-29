// ==================== shareUrl.js — 分享系统 URL 生成器 ====================
// 统一全项目分享 URL 生成逻辑，唯一入口
// 数据流向:
//   shareUrl.js  →  shareEngine.js  →  shareService.js  →  shareModal.js (UI)
//
// 环境切换:
//   - .env.development → VITE_APP_URL=http://localhost:5173 → getShareUrl() = localhost
//   - .env.production  → VITE_APP_URL=https://<vercel-domain> → getShareUrl() = vercel域名
//   - 未设置 VITE_APP_URL 时自动降级为 window.location.origin

/**
 * 获取当前页面的完整分享 URL
 * - 生产环境: 使用 VITE_APP_URL + 当前 pathname + hash
 * - 开发环境: 使用 window.location.origin + 当前 pathname + hash
 * - Vite 构建时 import.meta.env.VITE_APP_URL 被静态替换为目标值
 *
 * @returns {string} 完整可访问 URL
 * @example
 *   开发: http://localhost:5173/
 *   生产: https://travel-earth.vercel.app/
 */
export function getShareUrl() {
  const baseUrl =
    import.meta.env.VITE_APP_URL ||
    window.location.origin;

  return baseUrl + window.location.pathname + window.location.hash;
}

/**
 * 获取分享基础 URL（不含 pathname/hash）
 * - 生产环境: 返回 VITE_APP_URL
 * - 开发环境: 返回 window.location.origin
 *
 * @returns {string} 如 "http://localhost:5173" 或 "https://travel-earth.vercel.app"
 */
export function getBaseUrl() {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}
