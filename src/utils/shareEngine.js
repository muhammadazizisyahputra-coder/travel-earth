// ==================== shareEngine.js — 分享系统唯一数据源 ====================
// 所有分享 URL 必须通过此模块生成，禁止绕过直接使用 window.location
//
// 数据流向:
//   shareUrl.js  →  shareEngine.js  →  shareService.js  →  shareModal.js (UI)
//                  ↘  直接导出给外部调用方
//
// 环境检测:
//   - development  → localhost / 127.0.0.1 / 局域网 IP
//   - production   → VITE_APP_URL (Vercel 线上域名)

import { getShareUrl } from "./shareUrl.js";

// ==================== 环境检测 ====================

const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "[::1]",           // IPv6 loopback
]);

/**
 * 检测当前是否为本地开发环境
 * - import.meta.env.DEV 为 Vite 硬编码，生产构建时直接替换为 false
 * - 同时检测 hostname 防止 edge case（如 DEV 模式但通过代理访问远程地址）
 * - 显式设置了 VITE_APP_URL 则视为生产环境（优先使用环境变量）
 */
function isLocalDev() {
  // 如果显式配置了生产 URL，始终视为生产环境
  if (import.meta.env.VITE_APP_URL) return false;
  if (import.meta.env.DEV) return true;
  const hostname = window.location.hostname;
  if (LOCAL_HOSTNAMES.has(hostname)) return true;
  // 局域网 IP: 10.x / 172.16-31.x / 192.168.x
  if (/^(10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)$/.test(hostname)) {
    return true;
  }
  return false;
}

// ==================== 公开 API ====================

/**
 * 获取分享基础 URL（scheme://host:port，末尾无斜杠）
 * - 本地开发 → window.location.origin
 * - 线上环境 → VITE_APP_URL（从 .env.production 注入）
 *
 * @returns {string} 如 "http://localhost:5173" 或 "https://travel-earth.vercel.app"
 */
export function getBaseUrl() {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}

/**
 * 构建完整分享 URL
 * @param {string} [path]     - 路径，默认当前页面 pathname
 * @param {object} [params]   - 查询参数，自动拼接为 ?k=v&k=v
 * @returns {string} 完整可访问 URL
 *
 * @example
 *   buildShareUrl()                        // → VITE_APP_URL/  或  origin/
 *   buildShareUrl({ path: "/spot", params: { id: "123" } })  // → VITE_APP_URL/spot?id=123
 */
export function buildShareUrl({ path, params } = {}) {
  const base = getBaseUrl();
  const p = path || window.location.pathname;

  let url = base + p;

  if (params && Object.keys(params).length > 0) {
    const qs = Object.entries(params)
      .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(String(v)))
      .join("&");
    url += "?" + qs;
  }

  // 保留当前页面的 hash（如果有且未显式指定）
  if (!params && window.location.hash) {
    url += window.location.hash;
  }

  return url;
}

/**
 * 获取完整的分享数据（url / title / summary / pic）
 * - 所有分享渠道统一调用此函数
 * - url 由 buildShareUrl() 生成，绝不直接使用 window.location.href
 *
 * @param {object} [opts]
 * @param {string} [opts.url]     - 直接指定URL（优先级最高，绕过 buildShareUrl）
 * @param {string} [opts.path]    - 自定义路径
 * @param {object} [opts.params]  - 自定义查询参数
 * @param {string} [opts.title]   - 自定义标题，默认取 document.title
 * @param {string} [opts.summary] - 自定义摘要，默认取 meta description
 * @param {string} [opts.pic]     - 自定义分享图片，默认取页面第一张可见图片
 * @returns {{ url: string, title: string, summary: string, pic: string }}
 */
export function getShareData(opts = {}) {
  const url = opts.url || buildShareUrl({
    path: opts.path,
    params: opts.params,
  });

  const title = opts.title || document.title || "旅行地球";

  const summary = opts.summary || (() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    return metaDesc
      ? metaDesc.getAttribute("content")
      : "旅行地球 — 探索全世界的精彩景点，记录你的旅行足迹";
  })();

  let pic = opts.pic || "";
  if (!pic) {
    const firstImg = document.querySelector('img[src]:not([src=""])');
    if (firstImg) {
      pic = firstImg.src;
      if (pic.startsWith("/")) {
        pic = window.location.origin + pic;
      }
    }
  }

  return { url, title, summary, pic };
}
