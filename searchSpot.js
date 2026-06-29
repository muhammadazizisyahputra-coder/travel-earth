/**
 * searchSpot.js — 景区搜索模块（纯 Vanilla JS）
 * ============================================================
 * 功能：
 *   1. 地图顶部搜索框（🔍 搜索景区...）
 *   2. 300ms 防抖自动查询 spots 表（ilike 模糊匹配）
 *   3. 下拉搜索结果列表（名称 + 城市 + 热门标签）
 *   4. 点击结果 → 地图飞行 + 打开详情 + Marker 高亮
 *   5. 回车键 → 自动定位第一个结果
 *   6. 空结果 / 短输入 / 错误提示
 *
 * Supabase 客户端从 src/utils/supabaseClient.js 统一导入
 *
 * 用法：
 *   import { initSearch } from "./searchSpot.js";
 *   initSearch({ onSpotClick });
 */

import { supabase as _supabaseRef } from "./src/utils/supabaseClient.js";

// ==================== 模块状态 ====================
let _supabase = null;
let _onSpotClick = null; // (spotId, lng, lat, name, desc, isHot) => void
let _debounceTimer = null;
let _searchResults = [];
let _container = null;
let _input = null;
let _dropdown = null;

// ==================== 创建 DOM ====================

function _createSearchContainer() {
  const container = document.createElement("div");
  container.id = "spot-search-container";
  container.className = "spot-search-container";
  container.innerHTML = `
    <div class="spot-search-input-wrap">
      <span class="spot-search-icon">🔍</span>
      <input
        type="text"
        id="spot-search-input"
        class="spot-search-input"
        placeholder="搜索景区..."
        autocomplete="off"
      />
      <button class="spot-search-clear" id="spot-search-clear" style="display:none">&times;</button>
    </div>
    <div class="spot-search-dropdown" id="spot-search-dropdown"></div>
  `;

  return container;
}

// ==================== 搜索逻辑 ====================

async function _doSearch(keyword) {
  const dropdown = _dropdown;
  if (!dropdown) return;

  const kw = keyword.trim();

  // 空输入 / 太短 → 清空
  if (!kw || kw.length < 1) {
    _searchResults = [];
    _renderDropdown();
    return;
  }

  // 显示加载态
  dropdown.innerHTML = '<p class="spot-search-loading">搜索中...</p>';
  dropdown.classList.add("open");

  try {
    const { data, error } = await _supabase
      .from("spots")
      .select("*")
      .ilike("name", `%${kw}%`)
      .limit(20);

    if (error) {
      console.error("[searchSpot] 查询失败:", error);
      dropdown.innerHTML = '<p class="spot-search-empty">搜索失败，请稍后重试</p>';
      return;
    }

    _searchResults = data || [];
    _renderDropdown();
  } catch (err) {
    console.error("[searchSpot] 搜索异常:", err);
    dropdown.innerHTML = '<p class="spot-search-empty">搜索失败，请稍后重试</p>';
  }
}

function _renderDropdown() {
  const dropdown = _dropdown;
  if (!dropdown) return;

  if (_searchResults.length === 0) {
    dropdown.innerHTML = '<p class="spot-search-empty">未找到相关景区</p>';
    dropdown.classList.add("open");
    return;
  }

  dropdown.innerHTML = _searchResults
    .map(
      (spot, i) => `
    <div class="spot-search-item ${i === 0 ? "spot-search-item--first" : ""}"
         data-index="${i}"
         data-spot-id="${spot.id}"
         data-lng="${spot.longitude}"
         data-lat="${spot.latitude}"
         data-name="${_escapeAttr(spot.name)}"
         data-desc="${_escapeAttr(spot.description || "")}"
         data-is-hot="${spot.is_hot ? "1" : "0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${_escapeHtml(spot.name)}</span>
        <span class="spot-search-item-city">${_escapeHtml(spot.city || spot.address || "")}</span>
      </div>
      ${spot.is_hot ? '<span class="spot-search-item-badge">🔥</span>' : ""}
    </div>
  `
    )
    .join("");

  dropdown.classList.add("open");

  // 点击事件委托
  dropdown.querySelectorAll(".spot-search-item").forEach((item) => {
    item.addEventListener("click", () => _selectResult(item));
  });
}

function _selectResult(item) {
  const spotId = Number(item.dataset.spotId);
  const lng = parseFloat(item.dataset.lng);
  const lat = parseFloat(item.dataset.lat);
  const name = item.dataset.name;
  const desc = item.dataset.desc;
  const isHot = item.dataset.isHot === "1";

  // 关闭下拉
  _hideDropdown();

  // 清空输入
  if (_input) {
    _input.value = "";
    _showClear(false);
  }

  // 联动地图
  if (_onSpotClick) {
    _onSpotClick(spotId, lng, lat, name, desc, isHot);
  }
}

function _hideDropdown() {
  if (_dropdown) {
    _dropdown.classList.remove("open");
    _dropdown.innerHTML = "";
  }
  _searchResults = [];
}

function _showClear(visible) {
  const btn = document.getElementById("spot-search-clear");
  if (btn) btn.style.display = visible ? "flex" : "none";
}

// ==================== 初始化 ====================
/**
 * 初始化搜索模块
 * @param {Object} opts
 * @param {function} opts.onSpotClick - (spotId, lng, lat, name, desc, isHot)
 */
export function initSearch(opts = {}) {
  _supabase = _supabaseRef;
  _onSpotClick = opts.onSpotClick || null;

  _container = _createSearchContainer();
  document.body.appendChild(_container);

  _input = document.getElementById("spot-search-input");
  _dropdown = document.getElementById("spot-search-dropdown");
  const clearBtn = document.getElementById("spot-search-clear");

  // 输入事件（300ms 防抖）
  if (_input) {
    _input.addEventListener("input", () => {
      const val = _input.value;
      _showClear(val.length > 0);

      clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(() => _doSearch(val), 300);
    });

    // 回车 → 定位第一个结果
    _input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (_searchResults.length > 0) {
          const firstItem = _dropdown?.querySelector(".spot-search-item");
          if (firstItem) _selectResult(firstItem);
        }
      }
      if (e.key === "Escape") {
        _hideDropdown();
        _input.value = "";
        _showClear(false);
      }
    });

    // 聚焦 → 如果有缓存结果则显示
    _input.addEventListener("focus", () => {
      if (_searchResults.length > 0) {
        _renderDropdown();
      } else if (_input.value.trim()) {
        _doSearch(_input.value);
      }
    });
  }

  // 清除按钮
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (_input) {
        _input.value = "";
        _input.focus();
      }
      _hideDropdown();
      _showClear(false);
    });
  }

  // 点击外部关闭下拉
  document.addEventListener("click", (e) => {
    if (_container && !_container.contains(e.target)) {
      _hideDropdown();
    }
  });
}

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
