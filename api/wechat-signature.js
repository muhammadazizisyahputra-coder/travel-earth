// ==================== api/wechat-signature.js ====================
// Vercel Serverless Function — 微信 JSSDK 签名生成
//
// 前置条件（在 Vercel 项目 Settings → Environment Variables 中设置）：
//   WECHAT_APP_ID      — 微信公众号 AppID
//   WECHAT_APP_SECRET  — 微信公众号 AppSecret
//
// 部署后接口地址：https://你的域名/api/wechat-signature?url=当前页面URL

import crypto from "crypto";

// ==================== 内存缓存 ====================
// access_token 和 jsapi_ticket 有效期均为 7200 秒
// Vercel 冷启动会丢失缓存，对低流量站点影响可接受

let _cache = {
  accessToken: null,
  accessTokenExpires: 0,
  jsapiTicket: null,
  jsapiTicketExpires: 0,
};

// ==================== 微信 API 调用 ====================

async function fetchAccessToken(appId, appSecret) {
  const now = Date.now();
  if (_cache.accessToken && now < _cache.accessTokenExpires) {
    return _cache.accessToken;
  }

  const res = await fetch(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  );
  const data = await res.json();

  if (data.errcode) {
    throw new Error(`获取 access_token 失败: ${data.errmsg} (errcode=${data.errcode})`);
  }

  _cache.accessToken = data.access_token;
  _cache.accessTokenExpires = now + (data.expires_in - 300) * 1000; // 提前 5 分钟过期
  return data.access_token;
}

async function fetchJsapiTicket(accessToken) {
  const now = Date.now();
  if (_cache.jsapiTicket && now < _cache.jsapiTicketExpires) {
    return _cache.jsapiTicket;
  }

  const res = await fetch(
    `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
  );
  const data = await res.json();

  if (data.errcode !== 0) {
    throw new Error(`获取 jsapi_ticket 失败: ${data.errmsg} (errcode=${data.errcode})`);
  }

  _cache.jsapiTicket = data.ticket;
  _cache.jsapiTicketExpires = now + (data.expires_in - 300) * 1000;
  return data.ticket;
}

// ==================== 签名生成 ====================

function generateNonceStr(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateSignature(ticket, nonceStr, timestamp, url) {
  const raw = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  return crypto.createHash("sha1").update(raw, "utf8").digest("hex");
}

// ==================== Vercel Handler ====================

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const { WECHAT_APP_ID, WECHAT_APP_SECRET } = process.env;

    if (!WECHAT_APP_ID || !WECHAT_APP_SECRET) {
      return res.status(500).json({
        error: "server_config_missing",
        message: "请在 Vercel 环境变量中设置 WECHAT_APP_ID 和 WECHAT_APP_SECRET",
      });
    }

    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "missing_url", message: "缺少 url 参数" });
    }

    const accessToken = await fetchAccessToken(WECHAT_APP_ID, WECHAT_APP_SECRET);
    const jsapiTicket = await fetchJsapiTicket(accessToken);

    const timestamp = Math.floor(Date.now() / 1000);
    const nonceStr = generateNonceStr();
    const signature = generateSignature(jsapiTicket, nonceStr, timestamp, url);

    return res.status(200).json({
      appId: WECHAT_APP_ID,
      timestamp,
      nonceStr,
      signature,
    });
  } catch (err) {
    console.error("[wechat-signature]", err.message);
    return res.status(500).json({
      error: "signature_failed",
      message: err.message,
    });
  }
}
