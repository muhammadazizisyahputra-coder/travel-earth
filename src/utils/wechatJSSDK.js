// ==================== wechatJSSDK.js — 微信 JSSDK 前端模块 ====================
// 职责：
//   1. 动态加载微信 JS-SDK 脚本 (jweixin-1.6.0.js)
//   2. 调用后端 /api/wechat-signature 获取签名
//   3. wx.config 初始化
//   4. 设置分享数据 (好友 / 朋友圈)
//   5. 错误时自动降级
//
// 微信分享机制说明：
//   JSSDK 的 updateAppMessageShareData / updateTimelineShareData 是预设置分享
//   数据，用户点击微信浏览器右上角 "..." 菜单时，微信会读取这些数据来生成分享卡片。
//   自定义按钮无法主动唤起微信原生分享面板。

import { isWeChatBrowser } from "./isWeChatBrowser.js";

// ==================== 内部状态 ====================

let _initialized = false;
let _ready = false;
let _error = null;

// ==================== 脚本加载 ====================

const WX_SDK_URL = "https://res.wx.qq.com/open/js/jweixin-1.6.0.js";

function loadWxScript() {
  return new Promise((resolve, reject) => {
    // 已加载
    if (window.wx) return resolve(window.wx);

    // 避免重复加载
    const existing = document.querySelector(`script[src="${WX_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.wx));
      existing.addEventListener("error", () => reject(new Error("微信 JSSDK 脚本加载失败")));
      return;
    }

    const script = document.createElement("script");
    script.src = WX_SDK_URL;
    script.onload = () => resolve(window.wx);
    script.onerror = () => reject(new Error("微信 JSSDK 脚本加载失败"));
    document.head.appendChild(script);
  });
}

// ==================== 签名获取 ====================

/**
 * 调用后端 /api/wechat-signature 获取 wx.config 所需签名
 * @param {string} url - 当前页面完整 URL
 * @returns {Promise<{appId, timestamp, nonceStr, signature}>}
 */
async function fetchSignature(url) {
  const apiUrl = `/api/wechat-signature?url=${encodeURIComponent(url)}`;
  const res = await fetch(apiUrl);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `签名接口返回 ${res.status}`);
  }

  return res.json();
}

// ==================== wx.config 初始化 ====================

/**
 * 配置微信 JSSDK
 * @param {{appId, timestamp, nonceStr, signature}} sign
 * @returns {Promise<void>}
 */
function wxConfig(sign) {
  return new Promise((resolve, reject) => {
    window.wx.config({
      debug: false,       // 生产环境关闭 debug 模式
      appId: sign.appId,
      timestamp: sign.timestamp,
      nonceStr: sign.nonceStr,
      signature: sign.signature,
      jsApiList: [
        "updateAppMessageShareData",   // 分享给朋友
        "updateTimelineShareData",     // 分享到朋友圈
      ],
    });

    window.wx.ready(() => {
      console.log("[wechatJSSDK] wx.config 成功");
      _ready = true;
      resolve();
    });

    window.wx.error((err) => {
      console.error("[wechatJSSDK] wx.config 失败:", err);
      _error = err;
      reject(new Error(`wx.config 失败: ${JSON.stringify(err)}`));
    });
  });
}

// ==================== 分享数据设置 ====================

/**
 * 设置微信分享卡片数据
 * JSSDK 初始化成功后调用，预设置用户点击 "..." 菜单时的分享内容
 *
 * @param {{title, desc, link, imgUrl}} shareInfo
 */
function setWxShareData(shareInfo) {
  if (!_ready || !window.wx) return;

  const { title, desc, link, imgUrl } = shareInfo;

  // 分享给朋友
  window.wx.updateAppMessageShareData({
    title: title,
    desc: desc,
    link: link,
    imgUrl: imgUrl,
    success: () => console.log("[wechatJSSDK] 好友分享数据已设置"),
  });

  // 分享到朋友圈
  window.wx.updateTimelineShareData({
    title: title,
    link: link,
    imgUrl: imgUrl,
    success: () => console.log("[wechatJSSDK] 朋友圈分享数据已设置"),
  });
}

// ==================== 公开 API ====================

/**
 * 初始化微信 JSSDK 分享
 *
 * 调用时机：页面加载后尽早调用，确保用户打开 "..." 菜单时分享数据已就绪。
 * 非微信环境直接跳过，不报错。
 *
 * @param {object} [shareInfo]
 * @param {string} [shareInfo.title]  - 分享标题
 * @param {string} [shareInfo.desc]   - 分享描述
 * @param {string} [shareInfo.link]   - 分享链接
 * @param {string} [shareInfo.imgUrl] - 分享图片（必须是 HTTPS 绝对路径）
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function initWeChatShare(shareInfo = {}) {
  // 非微信浏览器 → 直接返回
  if (!isWeChatBrowser()) {
    return { ok: false, error: "not_wechat" };
  }

  // 已成功初始化 → 只更新分享数据
  if (_initialized && _ready) {
    setWxShareData(shareInfo);
    return { ok: true };
  }

  // 已初始化但之前失败了 → 返回缓存的错误
  if (_initialized && _error) {
    return { ok: false, error: _error.message || "wx 初始化失败" };
  }

  // 正在初始化 → 标记防重入
  _initialized = true;

  try {
    // 1. 加载 JSSDK 脚本
    await loadWxScript();
    console.log("[wechatJSSDK] JSSDK 脚本加载完成");

    // 2. 获取签名
    const url = window.location.href.split("#")[0]; // 签名 URL 不包含 hash
    const sign = await fetchSignature(url);
    console.log("[wechatJSSDK] 签名获取成功");

    // 3. wx.config
    await wxConfig(sign);

    // 4. 设置分享数据
    setWxShareData(shareInfo);

    return { ok: true };
  } catch (err) {
    _error = err;
    console.error("[wechatJSSDK] 初始化失败:", err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * 判断 JSSDK 是否已就绪
 * @returns {boolean}
 */
export function isWxShareReady() {
  return _ready;
}
