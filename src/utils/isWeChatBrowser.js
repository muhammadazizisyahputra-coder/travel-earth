// ==================== isWeChatBrowser.js — 微信环境判断 ====================
// 通过 User-Agent 检测是否在微信内置浏览器中

/**
 * 检测当前是否在微信浏览器中
 * @returns {boolean}
 */
export function isWeChatBrowser() {
  return /MicroMessenger/i.test(navigator.userAgent);
}
