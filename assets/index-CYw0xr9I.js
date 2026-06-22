(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const en="7dfc44451d8128e329100a0c71fa90b6",tn="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:tn};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(en)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});const Tt="https://dxygnktgxycdqxipvjdj.supabase.co",nn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA",on=window.supabase.createClient(Tt,nn,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[supabaseClient] 硬编码直连模式初始化完成:",Tt);const re=on;let C=null,d=null,S=null,U=!0,Je=new Set,De=null;const b={get isLoggedIn(){return!!d},get loading(){return U},get user(){return d},get profile(){return S},get supabase(){return C},async init(){if(C)return console.warn("[authStore] 已初始化，跳过重复调用"),De;C=re;const t=setTimeout(()=>{U&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",C!=null&&C.auth?"getSession":"未初始化"),U=!1,W())},3e3),{data:n}=C.auth.onAuthStateChange(an);return n==null||n.subscription,De=C.auth.getSession().then(async({data:{session:a}})=>{clearTimeout(t);const o=(a==null?void 0:a.user)??null;d&&o&&d.id===o.id||(d=o,d?await Mt():S=null),U=!1,W()}).catch(a=>{clearTimeout(t),console.error("[authStore] getSession 失败:",a),U=!1,W()}),De},async signIn(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:a}=await Y(C.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(a)throw a;return n},async signUp(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:a}=await Y(C.auth.signUp({email:e,password:t}),15e3,"注册请求超时，请检查网络后重试");if(a)throw a;return n},async signOut(){if(C){try{await Y(C.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}d=null,S=null,W()}},async updateProfile(e){if(!d)throw new Error("未登录");const{data:t,error:n}=await C.from("profiles").update(e).eq("id",d.id).select("*").single();if(n)throw n;return S=t,W(),t},subscribe(e){Je.add(e);try{e(It())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{Je.delete(e)}},getAvatarUrl(){return S!=null&&S.avatar_url?S.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(d==null?void 0:d.id)||"default"}`},getDisplayName(){var e,t;return(S==null?void 0:S.username)||((e=d==null?void 0:d.user_metadata)==null?void 0:e.username)||((t=d==null?void 0:d.email)==null?void 0:t.split("@")[0])||"用户"}};async function an(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const a=(t==null?void 0:t.user)??null,o=d&&a&&d.id!==a.id||!d&&a||d&&!a;d=a,d&&o?await Mt():d||(S=null)}catch(a){console.error("[authStore] onAuthStateChange 处理异常:",a),S=d?le():null}U&&(U=!1),W()}async function Mt(){var n,a,o,s,r;if(!d)return;let e,t;try{const i=await Y(C.from("profiles").select("*").eq("id",d.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),S=le();return}if(t){const i=t==null?void 0:t.code,c=(t==null?void 0:t.hint)||"";i==="PGRST301"||c.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):c.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),S=le();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((a=d.user_metadata)==null?void 0:a.nickname)||((o=d.user_metadata)==null?void 0:o.username)||((s=d.email)==null?void 0:s.split("@")[0])||"";try{const c=await Y(C.from("profiles").upsert({id:d.id,username:i,avatar_url:((r=d.user_metadata)==null?void 0:r.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(c.error){console.warn("[authStore] 自动创建 profile 失败:",c.error.message,"| code:",c.error.code),S=le();return}try{const u=await Y(C.from("profiles").select("*").eq("id",d.id).maybeSingle(),5e3,"profiles 二次查询超时");if(u.error)console.warn("[authStore] 二次查询 profile 出错:",u.error.message);else if(u.data){S=u.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(u){console.warn("[authStore] 二次查询 profile 异常:",u.message)}}catch(c){console.warn("[authStore] 自动创建 profile 异常:",c.message)}S=le();return}S=e}function le(){var e,t,n;return d?{id:d.id,username:((e=d.user_metadata)==null?void 0:e.username)||((t=d.email)==null?void 0:t.split("@")[0])||"",avatar_url:((n=d.user_metadata)==null?void 0:n.avatar_url)||null,bio:""}:null}function W(){const e=It();Je.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function It(){return{user:d,profile:S,loading:U}}function Y(e,t,n){return Promise.race([e,new Promise((a,o)=>setTimeout(()=>o(new Error(n)),t))])}let w=null;function sn(){w=re}async function rn(e,t){const{count:n,error:a}=await w.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(a)throw a;return n>0}async function cn(e,t){try{const{data:n,error:a}=await w.from("likes").insert({user_id:e,spot_id:t});if(a)throw a;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(O(n,"点赞失败，请检查权限或重试"))}}async function ln(e,t){try{const{data:n,error:a}=await w.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(O(n,"取消点赞失败，请检查权限或重试"))}}async function dn(e){const{count:t,error:n}=await w.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function un(e,t){const{count:n,error:a}=await w.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(a)throw a;return n>0}async function pn(e,t){try{const{data:n,error:a}=await w.from("favorites").insert({user_id:e,spot_id:t});if(a)throw a;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(O(n,"收藏失败，请检查权限或重试"))}}async function mn(e,t){try{const{data:n,error:a}=await w.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(O(n,"取消收藏失败，请检查权限或重试"))}}async function fn(e){const{count:t,error:n}=await w.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function yn(e){const{data:t,error:n}=await w.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function gn(e,t,n){try{const{data:a,error:o}=await w.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(o)throw o;return a}catch(a){throw console.error("[db] addComment 失败:",a),new Error(O(a,"评论发表失败，请检查权限或重试"))}}async function hn(e,t){try{const{data:n,error:a}=await w.from("comments").delete().eq("id",e).eq("user_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(O(n,"评论删除失败，请检查权限或重试"))}}async function vn(e){const{count:t,error:n}=await w.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function bn(e){const{count:t,error:n}=await w.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function wn(e){const{count:t,error:n}=await w.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function xn(e){const{data:t,error:n}=await w.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((a,o)=>a+(o.views||0),0)}async function Sn(e){const{data:t,error:n}=await w.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function En(e){const{data:t,error:n}=await w.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Cn(){const{data:e,error:t}=await w.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function _n(e=10){const{data:t,error:n}=await w.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function kn(e){const{error:t}=await w.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await w.from("spots").select("views").eq("id",e).maybeSingle(),a=((n==null?void 0:n.views)||0)+1;await w.from("spots").update({views:a}).eq("id",e)}}async function Ln(e){const{data:t,error:n}=await w.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function qn(e,t,n,a){try{const{data:o,error:s}=await w.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:a}).select();if(s)throw s;return o}catch(o){throw console.error("[db] saveSpotImage 失败:",o),new Error(O(o,"图片保存失败，请检查存储权限或重试"))}}async function $n(e,t){try{const{data:n,error:a}=await w.from("spot_images").delete().eq("id",e).eq("user_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(O(n,"图片删除失败，请检查权限或重试"))}}function O(e,t){const n=e==null?void 0:e.code,a=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:a.includes("JWT")?"认证已过期，请重新登录":a.includes("network")||a.includes("fetch")?"网络连接异常，请检查网络":a.includes("timeout")||a.includes("超时")?"请求超时，请检查网络后重试":t}async function Tn(){await b.init(),Hn(),b.subscribe(e=>{Ht(e)})}function Mn(e){return b.subscribe(({user:t,profile:n})=>{e(t,n)})}function N(){return b.isLoggedIn}async function In(e,t){return b.signIn(e,t)}async function Pn(e,t){return b.signUp(e,t)}async function Pt(){return b.signOut()}async function An(e){return b.updateProfile(e)}function Bn(){Bt()}let X=null;function Be(e,t="success",n=3e3){X||(X=document.createElement("div"),X.id="auth-toast-container",X.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;",document.body.appendChild(X));const a={success:"rgba(16,185,129,0.92)",error:"rgba(239,68,68,0.92)",info:"rgba(59,130,246,0.92)"},o=document.createElement("div");o.style.cssText=`background:${a[t]||a.info};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;text-align:center;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:auth-toast-in 0.3s ease-out;transition:opacity 0.25s ease,transform 0.25s ease;`,o.textContent=e,X.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-12px)",setTimeout(()=>o.remove(),250)},n)}(function(){if(document.getElementById("auth-toast-styles"))return;const t=document.createElement("style");t.id="auth-toast-styles",t.textContent="@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}",document.head.appendChild(t)})();function Hn(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{b.isLoggedIn?Vn():Xn("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{Fe(),await Pt()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{Fe(),At()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&Fe()}),Nn(),Un(),On(),Dn(),Ht({user:b.user})}function Nn(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>

      <!-- 登录表单 -->
      <div class="auth-form" id="auth-form-login">
        <h2>欢迎回来</h2>
        <p class="auth-form-sub">登录以管理你的足迹收藏</p>
        <input type="email" id="auth-login-email" placeholder="邮箱地址" autocomplete="email" />
        <input type="password" id="auth-login-password" placeholder="密码" autocomplete="current-password" />
        <button id="auth-login-submit">登录</button>
        <p class="auth-form-switch">
          还没有账号？<span id="auth-switch-register">立即注册</span>
        </p>
        <p class="auth-form-error" id="auth-login-error"></p>
      </div>

      <!-- 注册表单 (默认隐藏) -->
      <div class="auth-form" id="auth-form-register" style="display:none">
        <h2>加入旅行地球</h2>
        <p class="auth-form-sub">分享你的足迹，探索全世界</p>
        <input type="text" id="auth-register-displayname" placeholder="你的昵称" autocomplete="nickname" />
        <input type="email" id="auth-register-email" placeholder="邮箱地址" autocomplete="email" />
        <input type="password" id="auth-register-password" placeholder="密码（至少6位）" autocomplete="new-password" />
        <button id="auth-register-submit">注册</button>
        <p class="auth-form-switch">
          已有账号？<span id="auth-switch-login">去登录</span>
        </p>
        <p class="auth-form-error" id="auth-register-error"></p>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",we),e.querySelector(".auth-modal-close").addEventListener("click",we),e.querySelector("#auth-switch-register").addEventListener("click",()=>Ce("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>Ce("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,a=e.querySelector("#auth-login-error"),o=e.querySelector("#auth-login-submit");if(!t||!n){a.textContent="请填写邮箱和密码";return}if(!b.supabase){a.textContent="服务未初始化，请刷新页面";return}a.textContent="",o.disabled=!0,o.textContent="登录中...";try{await In(t,n),we(),dt()}catch(s){a.textContent=Ke(s.message)}finally{o.disabled=!1,o.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),a=e.querySelector("#auth-register-password").value,o=e.querySelector("#auth-register-error"),s=e.querySelector("#auth-register-submit");if(!t){o.textContent="请输入你的昵称",o.style.color="";return}if(!n){o.textContent="请输入邮箱地址",o.style.color="";return}if(!a){o.textContent="请输入密码",o.style.color="";return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){o.textContent="邮箱格式不正确，请检查后重试",o.style.color="";return}if(a.length<6){o.textContent="密码至少需要6位，请重新设置",o.style.color="";return}if(t.length>50){o.textContent="昵称不能超过50个字符",o.style.color="";return}if(!b.supabase){o.textContent="服务未初始化，请刷新页面",o.style.color="";return}o.textContent="",o.style.color="",s.disabled=!0,s.textContent="注册中...";try{const{user:r,session:i}=await Pn(n,a);if(i){if(t)try{await b.updateProfile({username:t})}catch(y){console.warn("[auth] 注册后更新 profile 昵称失败（非致命）:",y)}o.style.color="rgba(80, 230, 140, 0.95)",o.textContent="🎉 注册成功！已为您自动登录系统。";const c=t||n.split("@")[0]||"用户";Be(`🎉 注册成功！已为您自动登录系统。
欢迎加入旅行地球，${c}！`,"success",3500);const u=setTimeout(()=>{we(),dt(),delete e.dataset._registerTimer},1200);e.dataset._registerTimer=String(u)}else{o.style.color="rgba(100, 200, 255, 0.95)",o.textContent=`📧 注册成功！请查看邮箱中的确认链接完成验证。
（如未收到，请检查垃圾邮件箱）`;const c=setTimeout(()=>{o.style.color="",Ce("login"),delete e.dataset._registerTimer},3500);e.dataset._registerTimer=String(c)}}catch(r){console.error("Supabase注册深度报错对象:",r),console.error("  · message:",r==null?void 0:r.message),console.error("  · status:",r==null?void 0:r.status),console.error("  · code:",r==null?void 0:r.code),console.error("  · stack:",r==null?void 0:r.stack);const i=Ke(r.message);o.style.color="",o.textContent=`${i}
[错误码: ${(r==null?void 0:r.status)||"未知"} | ${(r==null?void 0:r.code)||"N/A"}]`}finally{s.disabled=!1,s.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function Un(){let e=!1,t="";const n=document.createElement("div");n.id="edit-profile-modal",n.className="auth-modal",n.innerHTML=`
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-form">
        <h2>编辑资料</h2>
        <p class="auth-form-sub">修改你的个人资料</p>

        <!-- 头像上传区 -->
        <div class="edit-avatar-section">
          <label class="edit-avatar-label" id="edit-avatar-label">
            <div class="edit-avatar-ring" id="edit-avatar-ring">
              <img id="edit-avatar-img" class="edit-avatar-img" src="" alt="头像" />
              <div class="edit-avatar-hover" id="edit-avatar-hover">
                <span id="edit-avatar-hover-text">更换头像</span>
              </div>
              <!-- 上传中遮罩 -->
              <div class="edit-avatar-uploading" id="edit-avatar-uploading" style="display:none">
                <span class="edit-avatar-spinner"></span>
                <span>上传中...</span>
              </div>
            </div>
            <!-- 文件选择器必须在 label 内部才能被触发 -->
            <input type="file" id="edit-avatar-file" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none" />
          </label>
          <p class="edit-avatar-hint" id="edit-avatar-hint">点击头像更换图片</p>
        </div>

        <!-- 隐藏 input 保存最终 avatar_url -->
        <input type="hidden" id="edit-avatar-url" value="" />

        <input type="text" id="edit-display-name" placeholder="显示名称" />
        <input type="text" id="edit-bio" placeholder="个人简介" />

        <button id="edit-profile-submit">保存</button>
        <p class="auth-form-error" id="edit-profile-error"></p>
      </div>
    </div>
  `,document.body.appendChild(n),n.querySelector("#edit-avatar-label");const a=n.querySelector("#edit-avatar-img"),o=n.querySelector("#edit-avatar-hover"),s=n.querySelector("#edit-avatar-hover-text"),r=n.querySelector("#edit-avatar-uploading"),i=n.querySelector("#edit-avatar-file"),c=n.querySelector("#edit-avatar-url"),u=n.querySelector("#edit-display-name"),y=n.querySelector("#edit-bio"),v=n.querySelector("#edit-profile-error"),l=n.querySelector("#edit-profile-submit"),p=n.querySelector("#edit-avatar-hint");function g(m){m?(a.src=m,a.style.display="block",s.textContent="更换头像"):(a.src="",a.style.display="none",s.textContent="设置头像"),o.style.display="",r.style.display="none",e=!1}i.addEventListener("change",async()=>{var T;const m=i.files[0];if(!m)return;const P=5*1024*1024;if(m.size>P){v.textContent="图片不能超过 5MB，请重新选择",i.value="";return}v.textContent="",o.style.display="none",r.style.display="flex",e=!0;try{const k=((T=b.user)==null?void 0:T.id)||"anonymous",ve=m.name.split(".").pop()||"jpg",ct=`${k}-${Date.now()}.${ve}`,{error:lt}=await b.supabase.storage.from("avatars").upload(ct,m,{upsert:!0});if(lt)throw lt;const{data:Ue}=b.supabase.storage.from("avatars").getPublicUrl(ct),be=(Ue==null?void 0:Ue.publicUrl)||"";if(!be)throw new Error("获取头像 URL 失败");t=be,c.value=be,g(be),p.textContent="头像上传成功 ✓",p.style.color="rgba(80,230,140,0.9)"}catch(k){console.error("[auth] 头像上传失败:",k),v.textContent="头像上传失败："+(k.message||"请检查网络或存储桶权限"),g(t),p.textContent="点击头像更换图片",p.style.color=""}finally{i.value=""}}),n.querySelector(".auth-modal-overlay").addEventListener("click",()=>{n.classList.remove("open")}),n.querySelector(".auth-modal-close").addEventListener("click",()=>{n.classList.remove("open")}),l.addEventListener("click",async()=>{const m=u.value.trim(),P=y.value.trim(),T=c.value.trim();if(!m){v.textContent="显示名称不能为空";return}if(e){v.textContent="头像正在上传中，请稍候...";return}v.textContent="",l.disabled=!0,l.textContent="保存中...";try{const k={username:m,bio:P||"",updated_at:new Date().toISOString()};T&&(k.avatar_url=T),await An(k),n.classList.remove("open"),Be("✅ 资料保存成功","success",2e3)}catch(k){v.textContent="保存失败："+k.message}finally{l.disabled=!1,l.textContent="保存"}}),n._setAvatarUrl=function(m){t=m||"",c.value=t,g(t),p.textContent="点击头像更换图片",p.style.color=""},n._setDisplayName=function(m){u.value=m||""},n._setBio=function(m){y.value=m||""},n._clearError=function(){v.textContent=""}}function Dn(){const e=document.createElement("div");e.id="change-password-modal",e.className="auth-modal",e.innerHTML=`
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-form">
        <h2>🔑 修改密码</h2>
        <p class="auth-form-sub">设置一个新的登录密码</p>

        <!-- 新密码 -->
        <input
          type="password"
          id="change-pw-new"
          placeholder="请输入新密码（至少6位）"
          autocomplete="new-password"
        />

        <!-- 确认新密码 -->
        <input
          type="password"
          id="change-pw-confirm"
          placeholder="请再次确认新密码"
          autocomplete="new-password"
        />

        <!-- 密码强度提示 -->
        <p id="change-pw-strength" style="
          display:none;margin:4px 0 0;font-size:12px;
          text-align:center;min-height:18px;
        "></p>

        <button id="change-pw-submit">确认修改</button>
        <p class="auth-form-error" id="change-pw-error"></p>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")});const t=e.querySelector("#change-pw-new"),n=e.querySelector("#change-pw-strength");t.addEventListener("input",()=>{const a=t.value;if(!a){n.style.display="none";return}n.style.display="block";const o=Rn(a);o<2?(n.textContent="🔴 密码强度：弱",n.style.color="rgba(255, 120, 120, 0.9)"):o<4?(n.textContent="🟡 密码强度：中等",n.style.color="rgba(251, 191, 36, 0.9)"):(n.textContent="🟢 密码强度：强",n.style.color="rgba(80, 230, 140, 0.9)")}),e.querySelector("#change-pw-submit").addEventListener("click",async()=>{const a=t.value,o=e.querySelector("#change-pw-confirm").value,s=e.querySelector("#change-pw-error"),r=e.querySelector("#change-pw-submit");if(!a){s.textContent="请输入新密码",s.style.color="";return}if(a.length<6){s.textContent="新密码至少需要6位",s.style.color="";return}if(!o){s.textContent="请再次输入新密码进行确认",s.style.color="";return}if(a!==o){s.textContent="两次输入的密码不一致，请检查后重试",s.style.color="";return}if(!b.supabase){s.textContent="服务未初始化，请刷新页面后重试",s.style.color="";return}s.textContent="",s.style.color="",r.disabled=!0,r.textContent="修改中...";try{const{data:i,error:c}=await b.supabase.auth.updateUser({password:a});if(c)throw c;s.style.color="rgba(80, 230, 140, 0.95)",s.textContent="🔐 密码修改成功！",Be("🔐 密码修改成功！下次登录请使用新密码。","success",3500),setTimeout(()=>{e.classList.remove("open"),t.value="",e.querySelector("#change-pw-confirm").value="",n.style.display="none",s.textContent="",s.style.color=""},1500)}catch(i){const c=Ke(i.message);s.style.color="",s.textContent=c,console.error("[auth] 修改密码失败:",i.message,"| 原始错误:",i)}finally{r.disabled=!1,r.textContent="确认修改"}}),e.addEventListener("keydown",a=>{if(a.key==="Enter"){const o=e.querySelector("#change-pw-submit");o&&!o.disabled&&o.click()}})}function Fn(){const e=document.getElementById("change-password-modal");if(!e)return;e.querySelector("#change-pw-new").value="",e.querySelector("#change-pw-confirm").value="";const t=e.querySelector("#change-pw-strength");t&&(t.style.display="none");const n=e.querySelector("#change-pw-error");n&&(n.textContent="",n.style.color=""),e.classList.add("open")}function Rn(e){let t=0;return e.length>=6&&t++,e.length>=10&&t++,/[0-9]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[!@#$%^&*(),.?":{}|<>]/.test(e)&&t++,t}function At(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=b.profile;e._setAvatarUrl((t==null?void 0:t.avatar_url)||""),e._setDisplayName((t==null?void 0:t.username)||""),e._setBio((t==null?void 0:t.bio)||""),e._clearError(),e.classList.add("open")}function On(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel profile-center-panel">
      <!-- 关闭按钮 -->
      <button class="auth-modal-close">&times;</button>

      <!-- 加载态 -->
      <div class="profile-center-loading" id="profile-center-loading">
        <div class="pc-spinner"></div>
        <p id="profile-center-loading-text">加载中...</p>
      </div>

      <!-- 主体内容 -->
      <div class="profile-center-body" id="profile-center-body" style="display:none">
        <!-- 头像区：渐变边框环 + 头像 + 昵称 + 简介 -->
        <div class="pc-avatar-section">
          <div class="pc-avatar-ring">
            <img class="pc-avatar-img" id="pc-avatar-img" src="" alt="头像" />
          </div>
          <h2 class="pc-display-name" id="pc-display-name"></h2>
          <p class="pc-bio" id="pc-bio"></p>
        </div>

        <!-- 统计网格：三栏暗黑玻璃卡片 -->
        <div class="profile-stats-grid">
          <div class="profile-stat-card">
            <span class="profile-stat-num" id="pc-stat-spots">0</span>
            <span class="profile-stat-label">旅行足迹</span>
          </div>
          <div class="profile-stat-card">
            <span class="profile-stat-num" id="pc-stat-likes">0</span>
            <span class="profile-stat-label">点赞</span>
          </div>
          <div class="profile-stat-card">
            <span class="profile-stat-num" id="pc-stat-views">0</span>
            <span class="profile-stat-label">浏览量</span>
          </div>
        </div>

        <!-- 我的足迹 -->
        <div class="pc-footprints" id="pc-footprints">
          <div class="pc-footprints-title">📍 我的足迹</div>
          <div class="pc-footprints-list" id="pc-footprints-list"></div>
        </div>

        <!-- 我的收藏 -->
        <div class="pc-footprints" id="pc-favorites">
          <div class="pc-footprints-title">⭐ 我的收藏</div>
          <div class="pc-footprints-list" id="pc-favorites-list"></div>
        </div>

        <!-- 操作按钮 -->
        <div class="pc-actions">
          <button class="pc-action-btn" id="pc-btn-edit">✏️ 编辑资料</button>
          <button class="pc-action-btn" id="pc-btn-change-pw">🔑 修改密码</button>
          <button class="pc-action-btn-logout" id="pc-btn-logout">🚪 退出登录</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),At()}),e.querySelector("#pc-btn-change-pw").addEventListener("click",()=>{e.classList.remove("open"),Fn()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await Pt(),Be("👋 已退出登录","info",2e3)}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function Bt(){var s;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),a=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),a.style.display="none",e.classList.add("open"),b.loading){n&&(n.textContent="正在验证身份令牌...");const r=Date.now(),i=5e3,c=100;try{await new Promise((u,y)=>{const v=setInterval(()=>{b.loading?Date.now()-r>i&&(clearInterval(v),y(new Error("timeout"))):(clearInterval(v),u())},c)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!b.isLoggedIn){n&&(n.textContent="请先登录");return}const o=b.user.id;n&&(n.textContent="📡 数据传送中...");try{const r=await Promise.allSettled([ie(bn(o),8e3,"足迹统计"),ie(wn(o),8e3,"点赞统计"),ie(xn(o),8e3,"浏览量统计"),ie(Sn(o),8e3,"足迹列表"),ie(En(o),8e3,"收藏列表")]),i=(p,g,m)=>{var P;return p.status==="fulfilled"?p.value:(console.warn(`[profile-center] ⚠️ ${m} 加载失败，使用默认值`,((P=p.reason)==null?void 0:P.message)||p.reason),g)},c=i(r[0],0,"足迹统计"),u=i(r[1],0,"点赞统计"),y=i(r[2],0,"浏览量统计"),v=i(r[3],[],"足迹列表"),l=i(r[4],[],"收藏列表");jn(e,{avatarUrl:b.getAvatarUrl(),displayName:b.getDisplayName(),bio:((s=b.profile)==null?void 0:s.bio)||"",spotCount:c,likeCount:u,views:y,spots:v,favorites:l})}catch(r){console.error("[profile-center] 加载统计失败:",r),zn(e);return}t.style.display="none",a.style.display="flex"}function jn(e,t){const{avatarUrl:n,displayName:a,bio:o,spotCount:s,likeCount:r,views:i,spots:c,favorites:u}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=a,e.querySelector("#pc-bio").textContent=o||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=s??0,e.querySelector("#pc-stat-likes").textContent=r??0,e.querySelector("#pc-stat-views").textContent=i??0,Jn(e,c),Kn(e,u)}function zn(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
    <div style="text-align:center;padding:24px 0">
      <p style="color:rgba(255,120,120,0.9);margin-bottom:16px">
        ⚠️ 加载失败，请检查网络后重试
      </p>
      <button id="pc-retry-btn" style="
        padding:8px 32px;border:1px solid rgba(255,255,255,0.2);
        border-radius:8px;background:rgba(255,255,255,0.08);
        color:#fff;cursor:pointer;font-size:14px;font-family:inherit;
      ">🔄 重试</button>
    </div>
  `,n.style.display="none";const a=t.querySelector("#pc-retry-btn");a&&a.addEventListener("click",()=>Bt())}function ie(e,t,n){return Promise.race([e,new Promise((a,o)=>setTimeout(()=>o(new Error(`${n} 请求超时`)),t))])}function Jn(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(a=>{const o=document.createElement("div");o.className="pc-footprint-item",o.innerHTML=`
      <span class="pc-footprint-name">📍 ${Qe(a.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,o.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a.id,lng:a.longitude,lat:a.latitude,name:a.name,description:a.description||""}}))}),n.appendChild(o)})}}function Kn(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(a=>{const o=a.spots,s=(o==null?void 0:o.id)??a.spot_id;if(!s)return;const r=o!=null&&o.name?`⭐ ${Qe(o.name)}`:`⭐ 景点 #${s}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${r}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:s,lng:(o==null?void 0:o.longitude)??0,lat:(o==null?void 0:o.latitude)??0,name:(o==null?void 0:o.name)||`景点 #${s}`,description:(o==null?void 0:o.description)||""}}))}),n.appendChild(i)})}}function Xn(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),Ce(e))}function we(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function Ce(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const a=document.getElementById("auth-login-error"),o=document.getElementById("auth-register-error");a&&(a.textContent=""),o&&(o.textContent="",o.style.color="")}function dt(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),a=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),a&&(a.value="");const o=document.getElementById("auth-login-error"),s=document.getElementById("auth-register-error");o&&(o.textContent=""),s&&(s.textContent="",s.style.color="")}function Ht(e){var a;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const o=b.getDisplayName(),s=((a=o[0])==null?void 0:a.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${s}</span>
        <span class="auth-user-label">${Qe(o)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function Vn(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function Fe(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function Ke(e){if(!e)return"未知错误，请稍后重试";const t=e.toLowerCase();return t.includes("already registered")||t.includes("already exists")||t.includes("already been registered")||t.includes("user already registered")?"该邮箱已被注册，请直接登录或使用其他邮箱":t.includes("password should be at least")||t.includes("密码至少需要")?"密码至少需要6位，请重新设置":t.includes("weak password")||t.includes("password is too weak")?"密码强度不足，请使用至少6位的密码（建议包含字母和数字）":t.includes("invalid email")||t.includes("invalid_email")||t.includes("邮箱格式")?"邮箱格式不正确，请检查后重试":t.includes("email rate limit")||t.includes("too many requests")||t.includes("操作过于频繁")?"操作过于频繁，请等待60秒后再试":t.includes("email not confirmed")?"该邮箱尚未完成验证，请先点击确认邮件中的链接":t.includes("signup disabled")||t.includes("registration disabled")?"注册功能暂未开放，请联系管理员":t.includes("banned")||t.includes("disabled")||t.includes("blocked")?"该账号已被禁用，请联系管理员":t.includes("invalid login credentials")||t.includes("invalid credentials")||t.includes("invalid login")||t.includes("邮箱或密码错误")?"邮箱或密码错误，请检查后重试":t.includes("user not found")?"该邮箱尚未注册，请先创建账号":t.includes("same password")||t.includes("password is the same")?"新密码不能与当前密码相同，请更换一个":t.includes("password too short")||t.includes("password must be")?"新密码长度不足，至少需要6位":t.includes("password too weak")||t.includes("password is not strong")?"新密码强度不足，请使用包含字母和数字的密码":t.includes("new password")&&t.includes("required")?"请输入新密码":t.includes("超时")||t.includes("timeout")?"请求超时，请检查网络连接后重试":t.includes("网络")||t.includes("network")||t.includes("fetch")?"网络连接异常，请检查网络后重试":t.includes("abort")||t.includes("取消")?"请求已取消，请重试":t.includes("internal server error")||t.includes("500")?"服务器繁忙，请稍后再试":t.includes("service unavailable")||t.includes("503")?"服务暂不可用，请稍后再试":t.includes("请填写")||t.includes("请输入")||t.includes("至少需要")?e:(console.warn("[auth] 未匹配到中文翻译的错误消息:",e),`操作失败：${e}`)}function Qe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Wn="7dfc44451d8128e329100a0c71fa90b6";async function Zn(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(Wn)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(u){throw console.error("[geocodeService] 网络请求失败:",u),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let a;try{a=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(a.status!=="1")throw new Error(`高德 API 返回错误: ${a.info||"未知错误"} (status=${a.status})`);if(!a.geocodes||a.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const o=a.geocodes[0],[s,r]=o.location.split(","),i=parseFloat(s),c=parseFloat(r);if(isNaN(i)||isNaN(c))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${c}`),{longitude:i,latitude:c,formattedAddress:o.formatted_address||e}}let Q=null,ae=[],ee=0,_e=null;function Gn(e={}){Q=re;const{onPostCreated:t}=e;_e=t||null;const n=Qn();document.body.appendChild(n);const a=n.querySelector(".create-post-overlay"),o=n.querySelector(".create-post-close"),s=n.querySelector("#create-post-cancel"),r=n.querySelector("#create-post-submit"),i=n.querySelector("#create-post-title"),c=n.querySelector("#create-post-content"),u=n.querySelectorAll(".create-post-star"),y=n.querySelector("#create-post-image-input"),v=n.querySelector("#create-post-add-image");n.querySelector(".create-post-image-previews");const l=n.querySelector("#create-post-status");let p=0;function g(){n.classList.remove("open"),i.value="",c.value="",p=0,ae=[],ee=0,xe(0),Me(),l.textContent="",l.style.color="",r.disabled=!1,r.textContent="⚡ 发布避雷"}return a.addEventListener("click",g),o.addEventListener("click",g),s.addEventListener("click",g),u.forEach(m=>{m.addEventListener("click",()=>{p=Number(m.dataset.rating),xe(p)}),m.addEventListener("mouseenter",()=>{xe(Number(m.dataset.rating))})}),n.querySelector(".create-post-stars").addEventListener("mouseleave",()=>{xe(p)}),v.addEventListener("click",()=>y.click()),y.addEventListener("change",eo),r.addEventListener("click",async()=>{const m=i.value.trim(),P=c.value.trim();if(!m){l.textContent="请输入景点名称",l.style.color="rgba(255, 120, 120, 0.95)";return}if(m.length>200){l.textContent="景点名称不能超过200字",l.style.color="rgba(255, 120, 120, 0.95)";return}if(!P){l.textContent="请输入避雷感受",l.style.color="rgba(255, 120, 120, 0.95)";return}if(p<1){l.textContent="请点击星星评分（1-5星）",l.style.color="rgba(255, 120, 120, 0.95)";return}if(ee>0){l.textContent="图片正在上传中，请稍候...",l.style.color="rgba(255, 180, 80, 0.95)";return}l.textContent="正在发布...",l.style.color="rgba(255, 255, 255, 0.7)",r.disabled=!0,r.textContent="⏳ 发布中...";try{const{data:{user:T}}=await Q.auth.getUser();if(!T){l.textContent="登录状态已失效，请重新登录",l.style.color="rgba(255, 120, 120, 0.95)",r.disabled=!1,r.textContent="⚡ 发布避雷";return}const{data:k,error:ve}=await Q.from("posts").insert({user_id:T.id,title:m,content:P,image_urls:ae,rating:p}).select().single();if(ve)throw ve;g(),typeof _e=="function"&&_e(k),de("✅ 避雷帖发布成功！","success",3e3)}catch(T){console.error("[createPost] 发布失败:",T);const k=to(T,"发布失败，请检查网络或权限后重试");l.textContent=k,l.style.color="rgba(255, 120, 120, 0.95)",r.disabled=!1,r.textContent="⚡ 发布避雷"}}),n.addEventListener("keydown",m=>{m.key==="Escape"&&g()}),{open:()=>Ut()}}function Nt(){Ut()}function Yn(e){_e=typeof e=="function"?e:null}function Ut(){const e=document.getElementById("create-post-modal");e&&e.classList.add("open")}function Qn(){const e=document.createElement("div");return e.id="create-post-modal",e.className="create-post-modal",e.innerHTML=`
    <div class="create-post-overlay"></div>
    <div class="create-post-panel">
      <button class="create-post-close">&times;</button>

      <div class="create-post-header">
        <h2>⚡ 发布避雷</h2>
        <p>分享你的真实旅行经历，帮助其他旅行者避开踩坑</p>
      </div>

      <div class="create-post-form">
        <!-- 景点名称 -->
        <label class="create-post-label">景点名称 <span class="create-post-required">*</span></label>
        <input
          type="text"
          id="create-post-title"
          class="create-post-input"
          placeholder="你去过的景区名称（如：三亚天涯海角）"
          maxlength="200"
          autocomplete="off"
        />

        <!-- 避雷感受 -->
        <label class="create-post-label">避雷感受 <span class="create-post-required">*</span></label>
        <textarea
          id="create-post-content"
          class="create-post-textarea"
          placeholder="说说你遭遇了哪些坑？门票、交通、餐饮、住宿... 越详细越能帮到大家"
          rows="5"
        ></textarea>

        <!-- 星级评分 -->
        <label class="create-post-label">综合评分 <span class="create-post-required">*</span></label>
        <div class="create-post-stars">
          ${[1,2,3,4,5].map(t=>`<span class="create-post-star" data-rating="${t}">★</span>`).join("")}
          <span class="create-post-rating-text" id="create-post-rating-text">点击评分</span>
        </div>

        <!-- 旅行照片 -->
        <label class="create-post-label">旅行照片 <span class="create-post-optional">(选填，最多9张)</span></label>
        <div class="create-post-image-area">
          <div class="create-post-image-previews" id="create-post-image-previews"></div>
          <button type="button" class="create-post-add-image" id="create-post-add-image" title="上传照片">
            <span class="create-post-add-icon">＋</span>
            <span>添加照片</span>
          </button>
        </div>
        <input
          type="file"
          id="create-post-image-input"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style="display:none"
        />

        <!-- 操作按钮 -->
        <div class="create-post-actions">
          <button type="button" class="create-post-btn-cancel" id="create-post-cancel">取消</button>
          <button type="button" class="create-post-btn-submit" id="create-post-submit">⚡ 发布避雷</button>
        </div>

        <!-- 状态提示 -->
        <p class="create-post-status" id="create-post-status"></p>
      </div>
    </div>
  `,e}function xe(e){const t=document.querySelectorAll("#create-post-modal .create-post-star"),n=document.querySelector("#create-post-modal #create-post-rating-text"),a=["","⭐ 非常差","⭐⭐ 较差","⭐⭐⭐ 一般","⭐⭐⭐⭐ 推荐","⭐⭐⭐⭐⭐ 强烈推荐"];t.forEach(o=>{const s=Number(o.dataset.rating);o.classList.toggle("active",s<=e)}),n&&(n.textContent=a[e]||"点击评分")}async function eo(){const e=document.getElementById("create-post-image-input");if(!e||!e.files.length)return;const t=Array.from(e.files);if(e.value="",ae.length+t.length+ee>9){de("最多上传9张照片","warn",3e3);return}for(const n of t){if(!["image/jpeg","image/png","image/webp"].includes(n.type)){de(`${n.name} 格式不支持，请选择 JPG/PNG/WebP`,"warn",4e3);continue}if(n.size>10*1024*1024){de(`${n.name} 超过10MB，请压缩后重试`,"warn",4e3);continue}ee++,Me();try{const{data:{user:o}}=await Q.auth.getUser(),s=(o==null?void 0:o.id)||"anonymous",r=n.name.split(".").pop()||"jpg",i=`posts/${s}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${r}`,{error:c}=await Q.storage.from("post-images").upload(i,n,{upsert:!1});if(c)throw c;const{data:u}=Q.storage.from("post-images").getPublicUrl(i),y=(u==null?void 0:u.publicUrl)||"";y&&ae.push(y)}catch(o){console.error("[createPost] 图片上传失败:",o),de(`${n.name} 上传失败: ${o.message||"未知错误"}`,"error",5e3)}finally{ee--,Me()}}}function Me(){const e=document.getElementById("create-post-image-previews");if(!e)return;let t="";ae.forEach((n,a)=>{t+=`
      <div class="create-post-image-item">
        <img src="${no(n)}" alt="照片${a+1}" />
        <button class="create-post-image-remove" data-idx="${a}" title="移除">×</button>
      </div>
    `});for(let n=0;n<ee;n++)t+=`
      <div class="create-post-image-item uploading">
        <div class="create-post-image-spinner"></div>
      </div>
    `;e.innerHTML=t,e.querySelectorAll(".create-post-image-remove").forEach(n=>{n.addEventListener("click",()=>{const a=Number(n.dataset.idx);ae.splice(a,1),Me()})})}let ce=null;function de(e,t="info",n=4e3){ce||(ce=document.createElement("div"),ce.style.cssText="position:fixed;top:120px;right:16px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:360px;",document.body.appendChild(ce));const a={error:"#ef4444",warn:"#f59e0b",success:"#10b981",info:"#3b82f6"},o=document.createElement("div");o.style.cssText=`background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${a[t]||a.info};color:#e2e8f0;padding:12px 16px;border-radius:8px;font-size:14px;line-height:1.5;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:create-post-toast-in 0.3s ease-out;`,o.textContent=e,ce.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(20px)",o.style.transition="opacity 0.3s, transform 0.3s",setTimeout(()=>o.remove(),300)},n)}(function(){if(document.getElementById("create-post-toast-styles"))return;const e=document.createElement("style");e.id="create-post-toast-styles",e.textContent="@keyframes create-post-toast-in { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }",document.head.appendChild(e)})();function to(e,t){const n=e==null?void 0:e.code,a=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:a.includes("JWT")?"认证已过期，请重新登录":a.includes("network")||a.includes("fetch")?"网络连接异常，请检查网络":t}function no(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}let Dt=!1,me=null,D=null,et=!1,$=null,A=null,ge=!1;function ut(){return Dt}function Ft(){const e=document.createElement("div");e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
    <!-- 切换按钮：absolute 定位在面板右侧外边缘 -->
    <button class="spot-list-toggle" id="spot-list-toggle" aria-label="切换侧边栏" title="展开景区列表">
      <svg class="spot-list-toggle-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3 L11 8 L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="spot-list-header">
      <span class="spot-list-title" id="spot-list-title">📍 景区列表</span>
      <span class="spot-list-count" id="spot-list-count"></span>
      <button class="spot-list-create-post" id="spot-list-create-post" title="分享避雷心得">＋ 避雷</button>
      <button class="spot-list-close">&times;</button>
    </div>
    <div class="spot-list-body" id="spot-list-body">
      <p class="spot-list-loading">加载中...</p>
    </div>
  `,e.querySelector(".spot-list-close").addEventListener("click",Xe);const t=e.querySelector("#spot-list-create-post");return t&&t.addEventListener("click",n=>{if(n.stopPropagation(),!N()){const a=document.getElementById("auth-modal");a&&a.classList.add("open");return}Nt()}),e.addEventListener("click",n=>{n.target===e&&Xe()}),e}function Rt(){$&&(A=$.querySelector("#spot-list-toggle"),A&&A.addEventListener("click",e=>{e.stopPropagation(),ge?Xe():oo()}))}function oo(){$&&($.classList.add("open"),ge=!0,tt())}function tt(){if(!A)return;const e=A.querySelector(".spot-list-toggle-arrow");ge?(e.style.transform="rotate(180deg)",A.title="收起景区列表",A.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",A.title="展开景区列表",A.classList.remove("spot-list-toggle--open"))}function ao(e,t){$||($=Ft(),document.body.appendChild($),Rt());const n=document.getElementById("spot-list-title"),a=document.getElementById("spot-list-count"),o=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),a&&(a.textContent=e?`${e.length} 个`:""),!e||e.length===0?o&&(o.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):o&&(o.innerHTML=e.map(s=>`
        <div class="spot-list-item" data-spot-id="${s.id}"
             data-lng="${s.longitude}" data-lat="${s.latitude}"
             data-name="${Pe(s.name)}"
             data-desc="${Pe(s.description||"")}"
             data-is-hot="${s.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${Ie(s.name)}</span>
            <span class="spot-list-item-city">${Ie(s.city||s.address||"")}</span>
          </div>
          ${s.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
        </div>
      `).join(""),o.querySelectorAll(".spot-list-item").forEach(s=>{s.addEventListener("click",()=>{const r=Number(s.dataset.spotId),i=parseFloat(s.dataset.lng),c=parseFloat(s.dataset.lat),u=s.dataset.name,y=s.dataset.desc,v=s.dataset.isHot==="1";me&&me(r,i,c,u,y,v)})})),$.classList.add("open"),ge=!0,tt()}function Xe(){$&&$.classList.remove("open"),ge=!1,tt()}function Ot(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",jt),e}async function so(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((a,o)=>`
      <div class="hot-ranking-item" data-spot-id="${a.id}"
           data-lng="${a.longitude}" data-lat="${a.latitude}"
           data-name="${Pe(a.name)}"
           data-desc="${Pe(a.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${o<3?"hot-ranking-index--top":""}">${o+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${o<3?"⭐ ":""}${Ie(a.name)}</span>
          <span class="hot-ranking-city">${Ie(a.city||a.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${a.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(a=>{a.addEventListener("click",()=>{const o=Number(a.dataset.spotId),s=parseFloat(a.dataset.lng),r=parseFloat(a.dataset.lat),i=a.dataset.name,c=a.dataset.desc;me&&me(o,s,r,i,c,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function ro(){D||(D=Ot(),document.body.appendChild(D)),D.classList.add("open"),et=!0}function jt(){D&&D.classList.remove("open"),et=!1}function pt(e){Dt=e}function io(e){et?jt():(ro(),so(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function co(e={}){me=e.onSpotClick||null,$=Ft(),document.body.appendChild($),Rt(),D=Ot(),document.body.appendChild(D)}function Ie(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function Pe(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let zt=null,Ve=null,mt=null,J=[],Se=null,_=null,B=null;function lo(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function ft(e){const t=B;if(!t)return;const n=e.trim();if(!n||n.length<1){J=[],We();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:a,error:o}=await zt.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(o){console.error("[searchSpot] 查询失败:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}J=a||[],We()}catch(a){console.error("[searchSpot] 搜索异常:",a),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function We(){const e=B;if(e){if(J.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=J.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${gt(t.name)}"
         data-desc="${gt(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${yt(t.name)}</span>
        <span class="spot-search-item-city">${yt(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>Jt(t))})}}function Jt(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),a=parseFloat(e.dataset.lat),o=e.dataset.name,s=e.dataset.desc,r=e.dataset.isHot==="1";ke(),_&&(_.value="",Le(!1)),Ve&&Ve(t,n,a,o,s,r)}function ke(){B&&(B.classList.remove("open"),B.innerHTML=""),J=[]}function Le(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function uo(e={}){zt=re,Ve=e.onSpotClick||null,Se=lo(),document.body.appendChild(Se),_=document.getElementById("spot-search-input"),B=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");_&&(_.addEventListener("input",()=>{const n=_.value;Le(n.length>0),clearTimeout(mt),mt=setTimeout(()=>ft(n),300)}),_.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),J.length>0)){const a=B==null?void 0:B.querySelector(".spot-search-item");a&&Jt(a)}n.key==="Escape"&&(ke(),_.value="",Le(!1))}),_.addEventListener("focus",()=>{J.length>0?We():_.value.trim()&&ft(_.value)})),t&&t.addEventListener("click",()=>{_&&(_.value="",_.focus()),ke(),Le(!1)}),document.addEventListener("click",n=>{Se&&!Se.contains(n.target)&&ke()})}function yt(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function gt(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Re=window.innerWidth<768,qe=[],Ae=null,fe=null,F=null,K=!1;const Kt=768,po=1024;function Xt(){const e=window.innerWidth;return e<Kt?"mobile":e<po?"tablet":"desktop"}function mo(e){if(typeof e=="function")return qe.push(e),()=>{qe=qe.filter(t=>t!==e)}}function Vt(e){qe.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function fo(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
    <!-- 汉堡菜单按钮（仅手机端显示） -->
    <button class="nav-hamburger" id="nav-hamburger" aria-label="菜单">
      <span class="nav-hamburger-line"></span>
      <span class="nav-hamburger-line"></span>
      <span class="nav-hamburger-line"></span>
    </button>

    <!-- Logo / 品牌名 -->
    <span class="nav-brand">🌍 旅行地球</span>

    <!-- 桌面端横向菜单 -->
    <div class="nav-links" id="nav-links">
      <button class="nav-link" data-action="home">🏠 首页</button>
      <button class="nav-link" data-action="community">⚡ 避雷社区</button>
      <button class="nav-link" data-action="hot">🔥 热门景区</button>
      <button class="nav-link" data-action="ranking">🏆 排行榜</button>
      <button class="nav-link" data-action="favorites">⭐ 收藏</button>
      <button class="nav-link" data-action="profile">👤 个人中心</button>
    </div>
  `,e}function yo(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
    <div class="menu-drawer-overlay"></div>
    <div class="menu-drawer-panel">
      <div class="menu-drawer-header">
        <span class="menu-drawer-title">🌍 旅行地球</span>
        <button class="menu-drawer-close" id="menu-drawer-close">&times;</button>
      </div>
      <div class="menu-drawer-body">
        <button class="menu-drawer-item" data-action="home">
          <span class="menu-item-icon">🏠</span> 首页
        </button>
        <button class="menu-drawer-item" data-action="community">
          <span class="menu-item-icon">⚡</span> 避雷社区
        </button>
        <button class="menu-drawer-item" data-action="hot">
          <span class="menu-item-icon">🔥</span> 热门景区
        </button>
        <button class="menu-drawer-item" data-action="ranking">
          <span class="menu-item-icon">🏆</span> 排行榜
        </button>
        <button class="menu-drawer-item" data-action="favorites">
          <span class="menu-item-icon">⭐</span> 我的收藏
        </button>
        <button class="menu-drawer-item" data-action="profile">
          <span class="menu-item-icon">👤</span> 个人中心
        </button>
      </div>
    </div>
  `,e}function go(){K||(K=!0,F.classList.add("open"),fe.classList.add("active"),document.body.style.overflow="hidden")}function G(){K&&(K=!1,F.classList.remove("open"),fe.classList.remove("active"),document.body.style.overflow="")}function ho(e){G(),Vt(e)}function vo(){if(!fe||!F||!Ae)return;fe.addEventListener("click",()=>{K?G():go()});const e=F.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",G);const t=F.querySelector(".menu-drawer-close");t&&t.addEventListener("click",G);const n=Ae.querySelectorAll("[data-action]"),a=F.querySelectorAll("[data-action]");n.forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.action;s&&Vt(s)})}),a.forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.action;s&&ho(s)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&K&&G()})}let ht=null;function bo(){clearTimeout(ht),ht=setTimeout(()=>{const e=Re;Re=window.innerWidth<Kt,e&&!Re&&K&&G(),Wt()},150)}function Wt(){const e=Xt();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function wo(){Wt(),Ae=fo(),document.body.insertBefore(Ae,document.body.firstChild),F=yo(),document.body.appendChild(F),fe=document.getElementById("nav-hamburger"),vo(),window.addEventListener("resize",bo),console.log("[responsive] 响应式模块初始化完成，当前设备:",Xt())}let nt=null,ye=[],Oe=!1,E=null;function xo(){nt=re,E=Eo(),document.body.appendChild(E),Co(),Yn(async e=>{const t=await Lo(e.user_id),n={...e,profiles:t};ye.unshift(n),Gt();const a=E.querySelector(".community-body");a&&(a.scrollTop=0)}),console.log("[community] 社区模块初始化完成")}function So(){E&&(E.classList.add("open"),document.body.style.overflow="hidden",Zt())}function vt(){E&&(E.classList.remove("open"),document.body.style.overflow="")}function Eo(){const e=document.createElement("div");return e.id="community-page",e.className="community-page",e.innerHTML=`
    <!-- 顶部导航栏 -->
    <div class="community-topbar">
      <div class="community-topbar-left">
        <button class="community-back-btn" id="community-back-btn" title="返回地图">
          <span>←</span>
        </button>
        <div class="community-brand">
          <span class="community-brand-icon">⚡</span>
          <span class="community-brand-text">避雷社区</span>
        </div>
      </div>
      <div class="community-topbar-right">
        <button class="community-create-btn" id="community-create-btn">
          <span>＋</span> 分享避雷心得
        </button>
      </div>
    </div>

    <!-- 帖子卡片区域 -->
    <div class="community-body" id="community-body">
      <!-- 加载中 -->
      <div class="community-loading" id="community-loading">
        <div class="community-spinner"></div>
        <p>正在加载避雷帖子...</p>
      </div>

      <!-- 空状态（默认隐藏） -->
      <div class="community-empty" id="community-empty" style="display:none">
        <div class="community-empty-icon">📭</div>
        <h3>还没有避雷帖子</h3>
        <p>成为第一个分享旅行避雷经验的先锋！</p>
        <button class="community-empty-btn" id="community-empty-btn">⚡ 立即分享</button>
      </div>

      <!-- 错误状态（默认隐藏） -->
      <div class="community-error" id="community-error" style="display:none">
        <div class="community-error-icon">⚠️</div>
        <p id="community-error-msg">加载失败</p>
        <button class="community-retry-btn" id="community-retry-btn">重新加载</button>
      </div>

      <!-- 卡片网格 -->
      <div class="community-grid" id="community-grid"></div>
    </div>
  `,e}function Co(){E&&(E.querySelector("#community-back-btn").addEventListener("click",vt),E.querySelector("#community-create-btn").addEventListener("click",()=>{bt()}),E.querySelector("#community-empty-btn").addEventListener("click",()=>{bt()}),E.querySelector("#community-retry-btn").addEventListener("click",()=>{Zt()}),E.addEventListener("keydown",e=>{e.key==="Escape"&&vt()}))}function bt(){if(!N()){$o();return}Nt()}async function Zt(){if(Oe)return;Oe=!0;const e=E.querySelector("#community-loading"),t=E.querySelector("#community-error"),n=E.querySelector("#community-empty"),a=E.querySelector("#community-grid");e.style.display="flex",t.style.display="none",n.style.display="none",a.innerHTML="";try{const{data:o,error:s}=await nt.from("posts").select("*, profiles(username, avatar_url)").order("created_at",{ascending:!1});if(s)throw s;ye=o||[],e.style.display="none",ye.length===0?n.style.display="flex":Gt()}catch(o){console.error("[community] 加载帖子失败:",o),e.style.display="none",t.style.display="flex",E.querySelector("#community-error-msg").textContent="加载失败："+(o.message||"请检查网络后重试")}finally{Oe=!1}}function Gt(){const e=E.querySelector("#community-grid");if(e){if(ye.length===0){e.innerHTML="";return}e.innerHTML=ye.map(t=>_o(t)).join(""),e.querySelectorAll(".community-card-img").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation(),ko(t.src)})})}}function _o(e){const t=e.profiles||{},n=je(t.username||"匿名用户"),a=t.avatar_url||"",o=je(e.title||"无标题"),s=je(e.content||""),r=e.rating||0,i=e.image_urls||[],c=qo(e.created_at),u=a?`<img class="community-card-avatar-img" src="${Ze(a)}" alt="${n}" />`:'<div class="community-card-avatar-placeholder">👤</div>',y=Array.from({length:5},(l,p)=>`<span class="community-star ${p<r?"active":""}">★</span>`).join("");let v="";return i.length>0&&(v=`<div class="community-card-images">${i.map((p,g)=>`<div class="community-card-img-wrap">
            <img class="community-card-img" src="${Ze(p)}" alt="照片${g+1}" loading="lazy" />
          </div>`).join("")}</div>`),`
    <div class="community-card">
      <!-- 作者信息 -->
      <div class="community-card-header">
        <div class="community-card-avatar">
          ${u}
        </div>
        <div class="community-card-author">
          <span class="community-card-username">${n}</span>
          <span class="community-card-time">${c}</span>
        </div>
        <div class="community-card-rating" title="${r} 星">
          ${y}
        </div>
      </div>

      <!-- 标题 + 内容 -->
      <div class="community-card-body">
        <h3 class="community-card-title">${o}</h3>
        <p class="community-card-content">${s}</p>
      </div>

      <!-- 图片画廊 -->
      ${v}
    </div>
  `}function ko(e){var a;(a=document.querySelector(".community-lightbox"))==null||a.remove();const t=document.createElement("div");t.className="community-lightbox",t.innerHTML=`
    <div class="community-lightbox-overlay"></div>
    <button class="community-lightbox-close">&times;</button>
    <img class="community-lightbox-img" src="${Ze(e)}" alt="原图" />
  `,document.body.appendChild(t);const n=()=>t.remove();t.querySelector(".community-lightbox-overlay").addEventListener("click",n),t.querySelector(".community-lightbox-close").addEventListener("click",n),t.addEventListener("keydown",o=>{o.key==="Escape"&&n()})}async function Lo(e){try{const{data:t}=await nt.from("profiles").select("username, avatar_url").eq("id",e).maybeSingle();return t||{username:"匿名用户",avatar_url:""}}catch{return{username:"匿名用户",avatar_url:""}}}function qo(e){if(!e)return"";const t=Date.now(),n=new Date(e).getTime(),a=t-n,o=Math.floor(a/1e3);if(o<60)return"刚刚";const s=Math.floor(o/60);if(s<60)return`${s} 分钟前`;const r=Math.floor(s/60);if(r<24)return`${r} 小时前`;const i=Math.floor(r/24);return i<30?`${i} 天前`:`${Math.floor(i/30)} 个月前`}function $o(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function je(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ze(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let I=null;const ot=[];let h=null,x=null,te=!1,ne=!1,Yt=0,V=null;function Ge(e,t="info",n=6e3){V||(V=document.createElement("div"),V.id="toast-container",V.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 24px);",document.body.appendChild(V));const a={error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"},o=a[t]||a.info,s=document.createElement("div");if(s.className="toast-notification",s.style.cssText=`position:relative;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${o};color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.5;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:toast-slide-in 0.3s ease-out;transition:opacity 0.3s ease,transform 0.3s ease;`,n>0){const i=document.createElement("button");i.textContent="×",i.style.cssText="position:absolute;top:6px;right:10px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;padding:0;",i.addEventListener("click",()=>wt(s)),s.appendChild(i)}const r=document.createElement("span");return r.style.cssText="display:block;padding-right:22px;white-space:pre-line;",r.textContent=e,s.appendChild(r),V.appendChild(s),n>0&&setTimeout(()=>wt(s),n),s}function wt(e){!e||e.dataset._removing==="1"||(e.dataset._removing="1",e.style.opacity="0",e.style.transform="translateX(20px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}(function(){if(document.getElementById("toast-keyframes"))return;const t=document.createElement("style");t.id="toast-keyframes",t.textContent=`
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,document.head.appendChild(t)})();const se=re,f=document.createElement("div");f.id="spot-sidebar";f.innerHTML=`
  <div class="sidebar-overlay"></div>
  <div class="sidebar-panel">
    <button class="sidebar-close">&times;</button>
    <div class="sidebar-scroll">
      <div class="sidebar-hero">
        <div class="hero-placeholder">🏔</div>
        <div class="hero-title-overlay">
          <h2 class="hero-name"></h2>
          <span class="hero-hot-badge" style="display:none">⭐ 热门推荐</span>
          <p class="hero-desc"></p>
        </div>
      </div>
      <div class="sidebar-actions">
        <button class="sidebar-action-btn" id="btn-like">
          <span id="btn-like-icon">🤍</span>
          <span id="btn-like-text">点赞</span>
          <span id="btn-like-count"></span>
        </button>
        <button class="sidebar-action-btn" id="btn-fav">
          <span id="btn-fav-icon">☆</span>
          <span id="btn-fav-text">收藏</span>
          <span id="btn-fav-count"></span>
        </button>
        <button class="sidebar-action-btn" id="btn-comment-jump">
          <span>💬</span>
          <span>评论</span>
          <span id="btn-comment-count"></span>
        </button>
      </div>
      <div class="sidebar-section-title">精彩照片
        <button class="photo-upload-btn" id="photo-upload-btn" title="上传照片">＋</button>
      </div>
      <input type="file" id="photo-file-input" accept="image/jpeg,image/png,image/webp" style="display:none" />
      <div class="photo-upload-status" id="photo-upload-status"></div>
      <div class="sidebar-photos-area"></div>
      <div class="sidebar-section-title" id="comments-title">评论</div>
      <div class="sidebar-comments-area"></div>
      <div class="sidebar-comment-form" id="comment-form-wrapper">
        <div id="comment-login-prompt" style="display:none">
          <p style="color:rgba(255,255,255,0.5);text-align:center;margin-bottom:12px">
            请先登录后再发表评论
          </p>
        </div>
        <textarea id="comment-input" placeholder="写下你的评论..." rows="2"></textarea>
        <button id="comment-submit-btn">发表评论</button>
        <p id="comment-form-status" style="margin:10px 0 0;font-size:12px;text-align:center;min-height:18px;color:rgba(255,255,255,0.7)"></p>
      </div>
    </div>
  </div>
`;document.body.appendChild(f);const To=f.querySelector(".sidebar-overlay"),Mo=f.querySelector(".sidebar-close"),Io=f.querySelector(".hero-placeholder"),Po=f.querySelector(".hero-name"),Ao=f.querySelector(".hero-desc"),xt=f.querySelector(".hero-hot-badge"),$e=f.querySelector(".sidebar-photos-area"),Ye=f.querySelector("#photo-upload-btn"),Z=f.querySelector("#photo-file-input"),M=f.querySelector("#photo-upload-status"),Te=f.querySelector(".sidebar-comments-area"),St=f.querySelector("#comment-login-prompt"),z=f.querySelector("#comment-input"),R=f.querySelector("#comment-submit-btn"),q=f.querySelector("#comment-form-status"),ue=f.querySelector("#btn-like"),Et=f.querySelector("#btn-like-icon"),Ct=f.querySelector("#btn-like-text"),Bo=f.querySelector("#btn-like-count"),pe=f.querySelector("#btn-fav"),_t=f.querySelector("#btn-fav-icon"),kt=f.querySelector("#btn-fav-text"),Ho=f.querySelector("#btn-fav-count"),No=f.querySelector("#btn-comment-jump"),Uo=f.querySelector("#btn-comment-count");function at(){f.classList.remove("open")}To.addEventListener("click",at);Mo.addEventListener("click",at);async function Do(e,t){at(),Ee();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
    <div class="spot-pioneer-overlay"></div>
    <div class="spot-pioneer-panel">
      <button class="spot-pioneer-close">&times;</button>
      <div class="spot-pioneer-hero">
        <span class="spot-pioneer-icon">🗺️</span>
        <h2>探索新大陆！</h2>
        <p>该景区目前还没有旅行者留下过足迹<br>你想成为第一个点亮这里的「拓荒者」吗？</p>
        <p class="spot-pioneer-coords">坐标 ${e.toFixed(4)}, ${t.toFixed(4)}</p>
      </div>
      <div class="spot-pioneer-form">
        <input type="text" id="pioneer-name" placeholder="景区名称（如：珠穆朗玛峰）" maxlength="200" autocomplete="off" />
        <textarea id="pioneer-desc" placeholder="一句话打卡心得..." rows="2" maxlength="500"></textarea>
        <button id="pioneer-submit" class="spot-pioneer-btn">✨ 立即点亮并分享</button>
        <p id="pioneer-status" class="spot-pioneer-status"></p>
      </div>
    </div>
  `,document.body.appendChild(n);const a=n.querySelector(".spot-pioneer-overlay"),o=n.querySelector(".spot-pioneer-close"),s=n.querySelector("#pioneer-submit"),r=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),c=n.querySelector("#pioneer-desc"),u=n.querySelector(".spot-pioneer-coords");a.addEventListener("click",Ee),o.addEventListener("click",Ee),u.textContent="📍 正在定位...";try{const y=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,l=await(await fetch(y)).json();if(l.status==="1"&&l.regeocode){const p=l.regeocode.formatted_address||"",g=l.regeocode.addressComponent,m=(g==null?void 0:g.township)||(g==null?void 0:g.district)||(g==null?void 0:g.city)||p||"";i.placeholder=`如：${m||"此处"}`,u.textContent=`📍 ${p||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else u.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{u.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}s.addEventListener("click",async()=>{if(!N()){j();return}const y=i.value.trim(),v=c.value.trim();if(!y){r.textContent="请输入景区名称",r.style.color="rgba(255, 120, 120, 0.95)";return}if(!v){r.textContent="请写下一句话打卡心得",r.style.color="rgba(255, 120, 120, 0.95)";return}r.textContent="正在创建...",r.style.color="rgba(255, 255, 255, 0.7)",s.disabled=!0,s.textContent="⏳ 创建中...";try{const{data:l,error:p}=await se.from("spots").insert({name:y,longitude:e,latitude:t,description:v,creator_id:x.id}).select();if(p)throw p;const g=l[0];st(g),Ee(),I.setZoomAndCenter(12,[e,t]),await He(g.id,g.name,g.description)}catch(l){console.error("[pioneer] 创建景区失败:",l),r.textContent="创建失败："+(l.message||"请检查网络后重试"),r.style.color="rgba(255, 120, 120, 0.95)",s.disabled=!1,s.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",y=>{y.key==="Enter"&&!s.disabled&&s.click()})}function Ee(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function st(e){const t=e.is_hot===!0,n=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:${t?"13":"12"}px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${t?"⭐ ":""}${oe(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t}});n.on("click",()=>Ro(n)),I.add(n),ot.push(n)}async function ze(){let e=[],t=null;try{if(ut())e=await Cn();else{const a=await se.from("spots").select("*");e=a.data||[],t=a.error}}catch(a){t=a}if(t){console.error("[main] 加载景区数据失败:",t),Ge(`加载景区数据失败
地图浏览不受影响`,"error",8e3);return}Fo(),e.forEach(st);const n=ut()?"🔥 热门景区":"📍 全部景区";ao(e,n)}function Fo(){I.clearMap(),ot.length=0}function Lt(e,t,n,a,o,s){var v;if(!I)return;I.setZoomAndCenter(15,[t,n]),He(e,a,o,s);const r=ot.find(l=>{var p;return((p=l.getExtData())==null?void 0:p.id)===e});if(!r)return;const i=(v=r.getExtData())==null?void 0:v.isHot,c=r.getLabel(),u=c?c.getContent():"",y=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${oe(a)}</div>`;r.setLabel({content:y,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{r.setLabel({content:u,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function Ro(e){Yt=Date.now();const t=e.getExtData();!t||!t.id||(I.setZoomAndCenter(12,e.getPosition()),await He(t.id,t.name,t.description,t.isHot))}const qt=new Map;async function He(e,t,n,a){h=Number(e),Po.textContent=t||"",Ao.textContent=n||"暂无介绍",Io.style.display="flex",a?xt.style.display="inline-block":xt.style.display="none";const o=Date.now(),s=qt.get(h);(!s||o-s>3e4)&&(qt.set(h,o),kn(h).catch(r=>console.warn("[main] 浏览量更新失败:",r))),$e.innerHTML="",Te.innerHTML="",q.textContent="",f.classList.add("open"),Qt(),await Oo(),it(h),await Ne(h)}ue.addEventListener("click",async()=>{if(!x){j();return}if(h){ue.disabled=!0;try{te?(await ln(x.id,h),te=!1):(await cn(x.id,h),te=!0),await he(),rt()}catch(e){console.error("[main] 点赞操作失败:",e)}finally{ue.disabled=!1}}});pe.addEventListener("click",async()=>{if(!x){j();return}if(h){pe.disabled=!0;try{ne?(await mn(x.id,h),ne=!1):(await pn(x.id,h),ne=!0),await he(),rt()}catch(e){console.error("[main] 收藏操作失败:",e)}finally{pe.disabled=!1}}});No.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),N()?setTimeout(()=>z.focus(),400):j())});function rt(){te?(Et.textContent="❤️",Ct.textContent="已赞",ue.classList.add("active")):(Et.textContent="🤍",Ct.textContent="点赞",ue.classList.remove("active")),ne?(_t.textContent="⭐",kt.textContent="已收藏",pe.classList.add("active")):(_t.textContent="☆",kt.textContent="收藏",pe.classList.remove("active"))}async function he(){if(h)try{const[e,t,n]=await Promise.all([dn(h),fn(h),vn(h)]);Bo.textContent=e>0?e:"",Ho.textContent=t>0?t:"",Uo.textContent=n>0?n:""}catch(e){console.warn("[main] 刷新计数失败:",e)}}async function Oo(){if(!x||!h)te=!1,ne=!1;else try{const[e,t]=await Promise.all([rn(x.id,h),un(x.id,h)]);te=e,ne=t}catch(e){console.warn("[main] 刷新互动状态失败:",e)}rt(),await he()}function j(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function $t(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),a=document.getElementById("add-submit");!e||!t||!n||!a||(N()?(e.style.display="none",t.disabled=!1,n.disabled=!1,a.disabled=!1,a.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,a.disabled=!0,a.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function Qt(){N()?(St.style.display="none",z.disabled=!1,R.disabled=!1,R.textContent="发表评论",z.placeholder="写下你的评论..."):(St.style.display="block",z.disabled=!0,R.disabled=!0,R.textContent="请先登录",z.placeholder="请先登录后再发表评论")}async function it(e){const[t,n]=await Promise.allSettled([se.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),Ln(e)]),a=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(o=>{o.photo_urls&&Array.isArray(o.photo_urls)&&o.photo_urls.forEach(s=>a.push({url:s,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(o=>a.push({url:o.url,source:"upload",id:o.id,userId:o.user_id})),$e.innerHTML="",a.length>0){const o=document.createElement("div");o.className="photo-grid",[...new Map(a.map(r=>[r.url,r])).values()].forEach(r=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${oe(r.url)}" alt="景区照片" loading="lazy" />`,r.source==="upload"&&x&&r.userId===x.id){const c=document.createElement("button");c.className="photo-delete-btn",c.textContent="×",c.title="删除此照片",c.addEventListener("click",async u=>{if(u.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await $n(r.id,x.id),it(e)}catch(y){console.error("[main] 删除照片失败:",y)}}),i.appendChild(c)}o.appendChild(i)}),$e.appendChild(o)}else $e.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}Ye.addEventListener("click",()=>{if(!x){j();return}h&&Z.click()});Z.addEventListener("change",async()=>{const e=Z.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){M.textContent="仅支持 JPG / PNG / WEBP 格式",M.style.color="rgba(255, 80, 80, 0.95)",Z.value="";return}if(e.size>5*1024*1024){M.textContent="图片不能超过 5MB",M.style.color="rgba(255, 80, 80, 0.95)",Z.value="";return}M.textContent="正在上传...",M.style.color="rgba(255, 255, 255, 0.7)",Ye.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),a=Date.now(),o=`${x.id}/${h}/${a}.${n}`,{error:s}=await se.storage.from("spot-images").upload(o,e,{upsert:!1});if(s)throw s;const{data:r}=se.storage.from("spot-images").getPublicUrl(o),i=r.publicUrl;await qn(h,x.id,o,i),M.textContent="上传成功！",M.style.color="rgba(80, 230, 140, 0.95)",await it(h),setTimeout(()=>{M.textContent=""},2e3)}catch(n){console.error("[main] 上传照片失败:",n),M.textContent="上传失败："+(n.message||"未知错误"),M.style.color="rgba(255, 80, 80, 0.95)"}finally{Ye.disabled=!1,Z.value=""}});async function Ne(e){let t;try{t=await yn(e)}catch(o){console.warn("[main] 加载评论失败:",o),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),Te.innerHTML="",t.length===0){Te.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const a=document.createElement("div");a.className="comment-list",t.forEach(o=>{const s=jo(o.created_at),r=o.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.user_id)}`,i=x&&o.user_id===x.id,c=document.createElement("div");c.className="comment-bubble",c.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${oe(r)}" alt="" />
        <span class="comment-author-name">${oe(o.username)}</span>
        <span class="comment-time">${s}</span>
        ${i?`<button class="comment-delete-btn" data-id="${o.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${oe(o.content)}</div>
    `,a.appendChild(c)}),Te.appendChild(a),a.querySelectorAll(".comment-delete-btn").forEach(o=>{o.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const s=Number(o.dataset.id);o.disabled=!0;try{await hn(s,x.id),await Ne(e),await he()}catch(r){console.error("[main] 删除评论失败:",r),o.disabled=!1}})})}function jo(e){if(!e)return"";const t=new Date(e),a=new Date-t,o=Math.floor(a/6e4);if(o<1)return"刚刚";if(o<60)return`${o}分钟前`;const s=Math.floor(o/60);if(s<24)return`${s}小时前`;const r=Math.floor(s/24);return r<30?`${r}天前`:t.toLocaleDateString("zh-CN")}function oe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}R.addEventListener("click",async()=>{if(!h){q.textContent="请先点击地球上的景区",q.style.color="rgba(255, 80, 80, 0.95)";return}if(!N()){j();return}const e=z.value.trim();if(!e){q.textContent="请输入评论内容",q.style.color="rgba(255, 80, 80, 0.95)";return}q.textContent="正在发表...",q.style.color="rgba(255, 255, 255, 0.8)",R.disabled=!0;try{await gn(x.id,h,e)}catch(t){console.error("[main] 发表评论失败:",t),q.textContent="发表失败："+t.message,q.style.color="rgba(255, 80, 80, 0.95)",R.disabled=!1;return}q.textContent="发表成功！",q.style.color="rgba(80, 230, 140, 0.95)",z.value="",await Ne(h),await he(),R.disabled=!1,setTimeout(()=>{q.textContent=""},2e3)});const H=document.createElement("div");H.id="add-form";H.innerHTML=`
  <div class="add-form-body">
    <h3>分享你的足迹</h3>
    <div id="add-form-login-prompt" style="display:none">
      <p style="color:rgba(255,255,255,0.5);text-align:center;margin-bottom:10px;font-size:12px">请先登录后再分享足迹</p>
    </div>
    <input type="text" id="field-address" placeholder="景区名称或详细地址（如：杭州西湖）" />
    <textarea id="field-desc" placeholder="景区游记或一句话介绍" rows="2"></textarea>
    <button id="add-submit">分享我的足迹</button>
    <p class="add-form-status"></p>
  </div>
`;document.body.appendChild(H);const L=H.querySelector(".add-form-status"),zo=H.querySelector("#add-submit");zo.addEventListener("click",async()=>{if(!N()){j();return}const e=H.querySelector("#field-address").value.trim(),t=H.querySelector("#field-desc").value.trim();if(!e||!t){L.textContent="请完整填写所有字段",L.style.color="rgba(255, 80, 80, 0.95)";return}L.textContent="正在查询地址...",L.style.color="rgba(255, 255, 255, 0.8)";let n,a;try{const i=await Zn(e);n=i.longitude,a=i.latitude}catch(i){console.error("[main] 高德地理编码失败:",i),L.textContent="查询失败："+i.message,L.style.color="rgba(255, 80, 80, 0.95)";return}L.textContent="正在保存...",L.style.color="rgba(255, 255, 255, 0.8)";const{data:o,error:s}=await se.from("spots").insert({name:e,longitude:n,latitude:a,description:t,creator_id:x.id}).select();if(s){console.error("[main] 添加景区失败:",s),L.textContent="添加失败："+s.message,L.style.color="rgba(255, 80, 80, 0.95)";return}L.textContent="添加成功！",L.style.color="rgba(80, 230, 140, 0.95)",H.querySelector("#field-address").value="",H.querySelector("#field-desc").value="";const r=o[0];st(r),I.setZoomAndCenter(12,[r.longitude,r.latitude]),setTimeout(()=>{L.textContent=""},2e3)});async function Jo(){console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e),Ge("⚠️ 地图服务加载失败，请刷新页面","error",0);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),I=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),I.on("click",e=>{Date.now()-Yt<300||Do(e.lnglat.getLng(),e.lnglat.getLat())}),co({onSpotClick:Lt}),uo({onSpotClick:Lt}),wo(),Gn(),xo(),mo(e=>{switch(e){case"home":pt(!1),ze();break;case"community":So();break;case"hot":pt(!0),ze();break;case"ranking":io(_n);break;case"favorites":case"profile":N()?Bn():j();break}}),console.log("[调试步骤3/6] 🔐 初始化认证模块...");try{await Tn(),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e),Ge(`⚠️ 认证服务初始化失败
地图浏览不受影响`,"warn",1e4)}console.log("[调试步骤4/6] 🗄️ 初始化数据库..."),sn(),console.log("[调试步骤4/6] ✅ 数据库初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange..."),Mn((e,t)=>{if(x=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}$t(),h&&f.classList.contains("open")&&(Qt(),Ne(h))}),console.log("[调试步骤5/6] ✅ onAuthChange 就绪"),console.log("[调试步骤6/6] 📍 加载景区数据..."),$t(),ze(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:a,name:o,description:s}=e.detail;I.setZoomAndCenter(14,[n,a]),He(t,o,s,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}Jo();
