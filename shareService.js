// ==================== shareService.js — 分享逻辑服务 ====================
// 纯逻辑层，所有分享 URL 统一由 shareUrl.js / shareEngine 生成。
// UI 层 (shareModal.js) 只负责调用本模块的导出函数。

import QRCode from "qrcode";
import { getShareData } from "./src/utils/shareEngine.js";
import { getShareUrl } from "./src/utils/shareUrl.js";
import { isWeChatBrowser } from "./src/utils/isWeChatBrowser.js";
import { initWeChatShare, isWxShareReady } from "./src/utils/wechatJSSDK.js";

// ==================== 页面信息提取 ====================

/**
 * 获取当前页面的分享信息
 * 所有分享渠道通过此函数获得统一的 { url, title, summary, pic }
 */
export function getPageShareInfo() {
  return getShareData();
}

// ==================== 复制链接 ====================

/**
 * 复制当前页面链接到剪贴板
 * @param {(msg:string, type:string, duration:number)=>void} toast
 */
export async function copyLink(toast) {
  try {
    const { url } = getPageShareInfo();
    await navigator.clipboard.writeText(url);
    toast("✅ 链接已复制", "info", 3000);
    return true;
  } catch (err) {
    console.error("[shareService] 复制失败:", err);
    toast("❌ 复制失败，请手动复制", "error", 5000);
    return false;
  }
}

// ==================== 浏览器原生分享 ====================

/**
 * 浏览器原生分享 (navigator.share)，不支持时降级到 clipboard
 * @param {(msg:string, type:string, duration:number)=>void} toast
 */
export async function nativeShare(toast) {
  if (!navigator.share) {
    return copyLink(toast);
  }
  const { url, title } = getPageShareInfo();
  try {
    await navigator.share({ title, text: title, url });
    return true;
  } catch (err) {
    if (err.name === "AbortError") return false;
    console.warn("[shareService] 浏览器分享失败，降级剪贴板:", err);
    return copyLink(toast);
  }
}

// ==================== QQ 分享 ====================

/**
 * QQ 分享 — 新窗口打开 connect.qq.com
 * @param {object} [info] 可选自定义分享数据，不传则用 getPageShareInfo()
 */
export function shareQQ(info) {
  const { url, title, summary, pic } = info || getPageShareInfo();
  const qqUrl =
    "https://connect.qq.com/widget/shareqq/index.html" +
    "?url=" + encodeURIComponent(url) +
    "&title=" + encodeURIComponent(title) +
    "&summary=" + encodeURIComponent(summary) +
    (pic ? "&pics=" + encodeURIComponent(pic) : "");

  try {
    window.open(qqUrl, "_blank", "width=700,height=520");
    return true;
  } catch (err) {
    console.error("[shareService] QQ分享失败:", err);
    return false;
  }
}

// ==================== 微博分享 ====================

/**
 * 微博分享 — 新窗口打开 service.weibo.com
 * @param {object} [info] 可选自定义分享数据
 */
export function shareWeibo(info) {
  const { url, title, pic } = info || getPageShareInfo();
  const weiboUrl =
    "https://service.weibo.com/share/share.php" +
    "?title=" + encodeURIComponent(title) +
    "&url=" + encodeURIComponent(url) +
    (pic ? "&pic=" + encodeURIComponent(pic) : "");

  try {
    window.open(weiboUrl, "_blank", "width=700,height=520");
    return true;
  } catch (err) {
    console.error("[shareService] 微博分享失败:", err);
    return false;
  }
}

// ==================== 微信分享 ====================

/**
 * 微信分享入口
 * - 微信浏览器内：
 *     1. 自动初始化 JSSDK（wx.config + 设置分享卡片数据）
 *     2. 引导用户点击右上角 "..." 菜单分享
 *     3. JSSDK 失败时降级为复制链接
 * - 其他浏览器：返回 false，由调用方打开二维码弹窗
 *
 * @param {(msg:string, type:string, duration:number)=>void} toast
 * @returns {Promise<boolean>} true=已在微信内处理，false=需降级到二维码
 */
export async function shareWechat(toast) {
  if (!isWeChatBrowser()) {
    return false;
  }

  // 已就绪 → 只需提醒用户
  if (isWxShareReady()) {
    toast("📤 请点击右上角 ⋯ 分享给朋友", "info", 4000);
    return true;
  }

  // 尝试初始化 JSSDK
  const { url, title, summary, pic } = getPageShareInfo();
  const result = await initWeChatShare({
    title,
    desc: summary,
    link: url,
    imgUrl: pic,
  });

  if (result.ok) {
    toast("📤 请点击右上角 ⋯ 分享给朋友", "info", 4000);
    return true;
  }

  // JSSDK 失败 → 降级复制链接
  console.warn("[shareService] JSSDK 失败，降级剪贴板:", result.error);
  try {
    await navigator.clipboard.writeText(url);
    toast("✅ 链接已复制，请在微信中粘贴分享", "info", 3000);
  } catch {
    toast("❌ 复制失败，请手动复制链接", "error", 5000);
  }
  return true;
}

// ==================== 二维码生成 ====================

/**
 * 生成二维码 Canvas
 * URL 由 getShareUrl() 统一生成，确保 dev/prod 环境一致性
 *
 * @param {number} [size=220] 二维码尺寸 (px)
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateQRCanvas(size = 220) {
  const url = getShareUrl();
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, url, {
    width: size,
    margin: 2,
    color: {
      dark: "#e2e8f0",
      light: "#0f172a00",
    },
  });
  return canvas;
}

/**
 * 下载二维码为 PNG
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename="qrcode.png"]
 */
export function downloadQRCode(canvas, filename = "qrcode.png") {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
