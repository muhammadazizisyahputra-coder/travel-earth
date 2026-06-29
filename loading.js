// ==================== 启动 Loading 模块 ====================
// 管理全屏 Splash Screen：进度条 + 状态文字 + 淡出动画

/**
 * 更新 Loading 进度
 * @param {number} percent - 进度 0~100
 * @param {string} text    - 状态文字（可选）
 */
export function updateLoadingProgress(percent, text) {
  const fill = document.getElementById("splash-progress-fill");
  const status = document.getElementById("splash-status");
  if (fill) {
    fill.style.width = Math.min(100, Math.max(0, percent)) + "%";
  }
  if (status && text != null) {
    status.textContent = text;
  }
}

/**
 * 关闭 Loading 覆盖层
 * 300ms 透明度 + 缩放动画后 remove
 */
export function hideLoadingScreen() {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  splash.style.opacity = "0";
  splash.style.transform = "scale(0.98)";
  splash.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  setTimeout(() => {
    if (splash.parentNode) splash.remove();
  }, 350);
}
