// ==================== Supabase 统一客户端（硬编码直连） ====================
// 所有模块统一从此文件导入 supabase 实例
// 不再依赖 import.meta.env 环境变量 — build 时真钥匙直接焊死在 JS 产物中
//
// 密钥来源：Supabase Dashboard → Settings → API
//   Project URL  → https://dxygnktgxycdqxipvjdj.supabase.co
//   Anon Key     → 完整 JWT（下方硬编码）
//
// 如需更换 Supabase 项目或轮换密钥，修改下面两行后重新 npm run build 即可
//
// CDN 加载：index.html 中通过 <script> 标签加载 supabase-js UMD
//          暴露全局 window.supabase（含 createClient 方法）

const supabaseUrl = "https://dxygnktgxycdqxipvjdj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA";

// CDN UMD 模式：supabase 是全局变量，不需要 import
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoConfirmUser: true,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

console.log("[supabaseClient] 硬编码直连模式初始化完成:", supabaseUrl);

export const supabase = _supabase;
