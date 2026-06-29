// ==================== ShareModal — 分享弹窗模块 ====================
// UI 层：弹窗 DOM + 事件绑定 + 二维码弹出
// 所有分享业务逻辑委托给 shareService.js
//
// 导出:
//   initShareModal(opts)  — 创建弹窗 + 绑定事件
//   openShareModal()      — 打开弹窗
//   closeShareModal()     — 关闭弹窗

import { transitionManager } from "./transition.js";
import {
  copyLink,
  nativeShare,
  shareQQ,
  shareWeibo,
  shareWechat,
  generateQRCanvas,
  downloadQRCode,
} from "./shareService.js";

// ==================== 内部状态 ====================
let _modal = null;
let _qrModal = null;
let _showToastFn = null;

// ==================== 公开 API ====================

export function initShareModal(opts = {}) {
  _showToastFn = opts.showToast || _fallbackToast;
  if (_modal) return;
  _modal = _buildModal();
  document.body.appendChild(_modal);
  _bindEvents();
}

export function openShareModal() {
  if (!_modal) { console.warn("[shareModal] 未初始化"); return; }
  transitionManager.openModal(_modal);
  document.body.style.overflow = "hidden";
}

export function closeShareModal() {
  if (!_modal) return;
  transitionManager.closeModal(_modal);
  document.body.style.overflow = "";
}

// ==================== DOM 构建 ====================

function _buildModal() {
  const modal = document.createElement("div");
  modal.id = "share-modal";
  modal.className = "share-modal auth-modal";
  modal.innerHTML = `
    <div class="share-modal-overlay"></div>
    <div class="share-modal-panel">
      <button class="share-modal-close">&times;</button>
      <div class="share-modal-header">
        <h2>📤 分享</h2>
        <p>将当前页面分享给朋友</p>
      </div>
      <div class="share-modal-actions">
        <button class="share-btn" id="share-btn-wechat" data-action="wechat">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg></span>
          <span class="share-btn-label">微信</span>
        </button>
        <button class="share-btn" id="share-btn-qq" data-action="qq">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 16.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a38.97 38.97 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.098.474 3.122 1.333 4.55.676 1.12 1.311.807 2.074.468C9.26 21.785 10.52 22 12 22s2.74-.215 4.322-.745c.762.339 1.398.652 2.074-.468.859-1.428 1.333-3.452 1.333-4.55 0 0 1.563 2.537 2.103 2.472.252-.03.581-1.39-.438-4.673z"/></svg></span>
          <span class="share-btn-label">QQ</span>
        </button>
        <button class="share-btn" id="share-btn-weibo" data-action="weibo">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.194 14.197c-.104-2.168-1.994-3.846-4.037-3.812-1.416.023-2.368.769-2.727 1.748-.36.98.437 2.027 1.76 2.319 1.324.292 2.633-.162 2.896-1.005.145-.462.038-.694-.316-.694-.354 0-.595.292-.694.698-.13.532-.694.799-1.264.665-.57-.134-.857-.611-.64-1.096.43-.965 1.747-1.435 2.934-1.058 1.188.377 1.897 1.497 1.624 2.504-.273 1.007-1.423 1.682-2.577 1.545-1.153-.137-1.847-.954-1.597-1.879.083-.307.208-.472.375-.495.125-.017.25.032.375.145.125.112.167.262.125.45-.083.378.354.727.854.78.5.052.94-.226.984-.635.044-.41-.314-.727-.86-.69-.547.037-.764.394-.817.622-.092.397.075.77.5 1.002.426.232.996.264 1.542.1.546-.166.95-.528 1.094-1.002.143-.474.1-.99-.115-1.446zM12.706 11.563c-2.568-.695-5.587.474-6.717 2.599-1.13 2.125.03 4.391 2.598 5.086 2.568.695 5.587-.474 6.717-2.599 1.13-2.125-.03-4.391-2.598-5.086zM20.162.326c-1.36-.368-2.893.467-3.432 1.876-.538 1.409.14 2.92 1.5 3.287 1.36.368 2.893-.467 3.432-1.876.538-1.409-.14-2.92-1.5-3.287zM14.588 15.897c-.97 2.466-3.404 3.886-5.44 3.204-2.036-.682-2.932-3.243-1.963-5.708.97-2.465 3.404-3.886 5.44-3.204 2.036.682 2.932 3.243 1.963 5.708z"/></svg></span>
          <span class="share-btn-label">微博</span>
        </button>
        <button class="share-btn" id="share-btn-qrcode" data-action="qrcode">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></span>
          <span class="share-btn-label">二维码</span>
        </button>
        <button class="share-btn" id="share-btn-copy" data-action="copy">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>
          <span class="share-btn-label">复制链接</span>
        </button>
      </div>
      <button class="share-modal-cancel" id="share-modal-cancel">取消</button>
    </div>
  `;
  return modal;
}

// ==================== 事件绑定 ====================

function _bindEvents() {
  if (!_modal) return;
  _modal.querySelector(".share-modal-overlay").addEventListener("click", closeShareModal);
  _modal.querySelector(".share-modal-close").addEventListener("click", closeShareModal);
  _modal.querySelector("#share-modal-cancel").addEventListener("click", closeShareModal);

  // 微信
  _modal.querySelector("#share-btn-wechat").addEventListener("click", async () => {
    const handled = await shareWechat(_showToastFn);
    if (!handled) {
      // 非微信浏览器 → 打开二维码弹窗
      closeShareModal();
      _openQRModal();
    } else {
      closeShareModal();
    }
  });

  // QQ
  _modal.querySelector("#share-btn-qq").addEventListener("click", () => {
    const ok = shareQQ();
    if (!ok) _showToastFn("❌ QQ分享失败，请稍后再试", "error", 4000);
    closeShareModal();
  });

  // 微博
  _modal.querySelector("#share-btn-weibo").addEventListener("click", () => {
    const ok = shareWeibo();
    if (!ok) _showToastFn("❌ 微博分享失败，请稍后再试", "error", 4000);
    closeShareModal();
  });

  // 二维码
  _modal.querySelector("#share-btn-qrcode").addEventListener("click", () => {
    closeShareModal();
    _openQRModal();
  });

  // 复制链接 — 优先浏览器原生分享，降级 clipboard
  _modal.querySelector("#share-btn-copy").addEventListener("click", async () => {
    await nativeShare(_showToastFn);
    closeShareModal();
  });

  // ESC
  _modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeShareModal(); _closeQRModal(); }
  });
}

// ==================== 二维码弹窗 ====================

async function _openQRModal() {

  // 已存在则复用
  if (_qrModal) {
    _qrModal.remove();
    _qrModal = null;
  }

  _qrModal = document.createElement("div");
  _qrModal.id = "qr-modal";
  _qrModal.className = "share-modal auth-modal open";
  _qrModal.innerHTML = `
    <div class="share-modal-overlay"></div>
    <div class="share-modal-panel qr-modal-panel">
      <button class="share-modal-close">&times;</button>
      <div class="share-modal-header">
        <h2>📱 扫码分享</h2>
        <p>请使用微信扫一扫分享</p>
      </div>
      <div class="qr-code-area" id="qr-code-area">
        <div class="qr-loading">生成二维码中...</div>
      </div>
      <div class="qr-tip">扫描二维码即可在微信中打开此页面</div>
      <div class="qr-actions">
        <button class="share-modal-cancel" id="qr-btn-download">📥 下载二维码</button>
        <button class="share-modal-cancel" id="qr-btn-cancel">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(_qrModal);
  document.body.style.overflow = "hidden";

  // 事件
  _qrModal.querySelector(".share-modal-overlay").addEventListener("click", _closeQRModal);
  _qrModal.querySelector(".share-modal-close").addEventListener("click", _closeQRModal);
  _qrModal.querySelector("#qr-btn-cancel").addEventListener("click", _closeQRModal);
  _qrModal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") _closeQRModal();
  });

  // 生成二维码
  try {
    const canvas = await generateQRCanvas(220);
    const area = _qrModal.querySelector("#qr-code-area");
    area.innerHTML = "";
    area.appendChild(canvas);

    // 下载按钮
    _qrModal.querySelector("#qr-btn-download").addEventListener("click", () => {
      downloadQRCode(canvas, "share-qrcode.png");
      _showToastFn("✅ 二维码已下载", "info", 2000);
    });
  } catch (err) {
    console.error("[shareModal] 二维码生成失败:", err);
    _qrModal.querySelector("#qr-code-area").innerHTML =
      '<div class="qr-loading">二维码生成失败，请重试</div>';
  }
}

function _closeQRModal() {
  if (_qrModal) {
    _qrModal.remove();
    _qrModal = null;
    document.body.style.overflow = "";
  }
}

// ==================== 兜底 Toast ====================

function _fallbackToast(msg, type, duration) {
  const el = document.createElement("div");
  el.style.cssText =
    "position:fixed;top:70px;right:12px;z-index:10000;" +
    "background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);" +
    "border-left:4px solid " + (type === "error" ? "#ef4444" : "#3b82f6") + ";" +
    "color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;" +
    "box-shadow:0 8px 32px rgba(0,0,0,0.45);";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 300);
  }, duration);
}
