// ==================== 高德地图地理编码服务 ====================
// 文档: https://lbs.amap.com/api/webservice/guide/api/georegeo

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;

if (!AMAP_KEY) {
  console.warn(
    "[geocodeService] VITE_AMAP_KEY 未配置，请在 .env 文件中设置你的高德地图 API Key"
  );
}

/**
 * 根据地名调用高德 Geocoding API，获取经纬度
 * @param {string} name - 景区/地址名称，如 "杭州西湖"
 * @returns {Promise<{longitude: number, latitude: number, formattedAddress: string}>}
 */
export async function geocodeSpot(name) {
  if (!AMAP_KEY) {
    throw new Error(
      "高德地图 API Key 未配置，请在项目根目录 .env 文件中设置 VITE_AMAP_KEY"
    );
  }

  const url =
    `https://restapi.amap.com/v3/geocode/geo` +
    `?key=${encodeURIComponent(AMAP_KEY)}` +
    `&address=${encodeURIComponent(name)}` +
    `&output=JSON`;

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    console.error("[geocodeService] 网络请求失败:", err);
    throw new Error("网络请求失败，请检查网络连接后重试");
  }

  if (!response.ok) {
    throw new Error(`高德 API 请求失败: HTTP ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("高德 API 返回数据格式异常");
  }

  if (data.status !== "1") {
    throw new Error(
      `高德 API 返回错误: ${data.info || "未知错误"} (status=${data.status})`
    );
  }

  if (!data.geocodes || data.geocodes.length === 0) {
    throw new Error(`未找到 "${name}" 的地理位置，请检查名称是否正确`);
  }

  const geocode = data.geocodes[0];
  const [lngStr, latStr] = geocode.location.split(",");

  const longitude = parseFloat(lngStr);
  const latitude = parseFloat(latStr);

  if (isNaN(longitude) || isNaN(latitude)) {
    throw new Error("高德 API 返回的经纬度格式异常");
  }

  console.log(
    `[geocodeService] "${name}" → 经度: ${longitude}, 纬度: ${latitude}`
  );

  return {
    longitude,
    latitude,
    formattedAddress: geocode.formatted_address || name,
  };
}
