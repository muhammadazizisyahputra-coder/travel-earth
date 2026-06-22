(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const Qt="7dfc44451d8128e329100a0c71fa90b6",en="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:en};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(Qt)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});const Mt="https://dxygnktgxycdqxipvjdj.supabase.co",tn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA",nn=window.supabase.createClient(Mt,tn,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[supabaseClient] 硬编码直连模式初始化完成:",Mt);const re=nn;let C=null,u=null,S=null,U=!0,Ke=new Set,Fe=null;const h={get isLoggedIn(){return!!u},get loading(){return U},get user(){return u},get profile(){return S},get supabase(){return C},async init(){if(C)return console.warn("[authStore] 已初始化，跳过重复调用"),Fe;C=re;const t=setTimeout(()=>{U&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",C!=null&&C.auth?"getSession":"未初始化"),U=!1,W())},3e3),{data:n}=C.auth.onAuthStateChange(on);return n==null||n.subscription,Fe=C.auth.getSession().then(async({data:{session:o}})=>{clearTimeout(t);const a=(o==null?void 0:o.user)??null;u&&a&&u.id===a.id||(u=a,u?await It():S=null),U=!1,W()}).catch(o=>{clearTimeout(t),console.error("[authStore] getSession 失败:",o),U=!1,W()}),Fe},async signIn(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:o}=await Y(C.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(o)throw o;return n},async signUp(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:o}=await Y(C.auth.signUp({email:e,password:t}),15e3,"注册请求超时，请检查网络后重试");if(o)throw o;return n},async signOut(){if(C){try{await Y(C.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}u=null,S=null,W()}},async updateProfile(e){if(!u)throw new Error("未登录");const{data:t,error:n}=await C.from("profiles").update(e).eq("id",u.id).select("*").single();if(n)throw n;return S=t,W(),t},subscribe(e){Ke.add(e);try{e(At())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{Ke.delete(e)}},getAvatarUrl(){return S!=null&&S.avatar_url?S.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(u==null?void 0:u.id)||"default"}`},getDisplayName(){var e,t;return(S==null?void 0:S.username)||((e=u==null?void 0:u.user_metadata)==null?void 0:e.username)||((t=u==null?void 0:u.email)==null?void 0:t.split("@")[0])||"用户"}};async function on(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const o=(t==null?void 0:t.user)??null,a=u&&o&&u.id!==o.id||!u&&o||u&&!o;u=o,u&&a?await It():u||(S=null)}catch(o){console.error("[authStore] onAuthStateChange 处理异常:",o),S=u?ue():null}U&&(U=!1),W()}async function It(){var n,o,a,s,r;if(!u)return;let e,t;try{const i=await Y(C.from("profiles").select("*").eq("id",u.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),S=ue();return}if(t){const i=t==null?void 0:t.code,c=(t==null?void 0:t.hint)||"";i==="PGRST301"||c.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):c.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),S=ue();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((o=u.user_metadata)==null?void 0:o.nickname)||((a=u.user_metadata)==null?void 0:a.username)||((s=u.email)==null?void 0:s.split("@")[0])||"";try{const c=await Y(C.from("profiles").upsert({id:u.id,username:i,avatar_url:((r=u.user_metadata)==null?void 0:r.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(c.error){console.warn("[authStore] 自动创建 profile 失败:",c.error.message,"| code:",c.error.code),S=ue();return}try{const d=await Y(C.from("profiles").select("*").eq("id",u.id).maybeSingle(),5e3,"profiles 二次查询超时");if(d.error)console.warn("[authStore] 二次查询 profile 出错:",d.error.message);else if(d.data){S=d.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(d){console.warn("[authStore] 二次查询 profile 异常:",d.message)}}catch(c){console.warn("[authStore] 自动创建 profile 异常:",c.message)}S=ue();return}S=e}function ue(){var e,t,n;return u?{id:u.id,username:((e=u.user_metadata)==null?void 0:e.username)||((t=u.email)==null?void 0:t.split("@")[0])||"",avatar_url:((n=u.user_metadata)==null?void 0:n.avatar_url)||null,bio:""}:null}function W(){const e=At();Ke.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function At(){return{user:u,profile:S,loading:U}}function Y(e,t,n){return Promise.race([e,new Promise((o,a)=>setTimeout(()=>a(new Error(n)),t))])}let b=null;function an(){b=re}async function sn(e,t){const{count:n,error:o}=await b.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(o)throw o;return n>0}async function rn(e,t){try{const{data:n,error:o}=await b.from("likes").insert({user_id:e,spot_id:t});if(o)throw o;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(O(n,"点赞失败，请检查权限或重试"))}}async function cn(e,t){try{const{data:n,error:o}=await b.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(O(n,"取消点赞失败，请检查权限或重试"))}}async function ln(e){const{count:t,error:n}=await b.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function dn(e,t){const{count:n,error:o}=await b.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(o)throw o;return n>0}async function un(e,t){try{const{data:n,error:o}=await b.from("favorites").insert({user_id:e,spot_id:t});if(o)throw o;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(O(n,"收藏失败，请检查权限或重试"))}}async function pn(e,t){try{const{data:n,error:o}=await b.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(O(n,"取消收藏失败，请检查权限或重试"))}}async function mn(e){const{count:t,error:n}=await b.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function fn(e){const{data:t,error:n}=await b.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function yn(e,t,n){try{const{data:o,error:a}=await b.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(a)throw a;return o}catch(o){throw console.error("[db] addComment 失败:",o),new Error(O(o,"评论发表失败，请检查权限或重试"))}}async function gn(e,t){try{const{data:n,error:o}=await b.from("comments").delete().eq("id",e).eq("user_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(O(n,"评论删除失败，请检查权限或重试"))}}async function hn(e){const{count:t,error:n}=await b.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function vn(e){const{count:t,error:n}=await b.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function bn(e){const{count:t,error:n}=await b.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function wn(e){const{data:t,error:n}=await b.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((o,a)=>o+(a.views||0),0)}async function xn(e){const{data:t,error:n}=await b.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Sn(e){const{data:t,error:n}=await b.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function En(){const{data:e,error:t}=await b.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function Cn(e=10){const{data:t,error:n}=await b.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function _n(e){const{error:t}=await b.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await b.from("spots").select("views").eq("id",e).maybeSingle(),o=((n==null?void 0:n.views)||0)+1;await b.from("spots").update({views:o}).eq("id",e)}}async function Ln(e){const{data:t,error:n}=await b.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function kn(e,t,n,o){try{const{data:a,error:s}=await b.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:o}).select();if(s)throw s;return a}catch(a){throw console.error("[db] saveSpotImage 失败:",a),new Error(O(a,"图片保存失败，请检查存储权限或重试"))}}async function qn(e,t){try{const{data:n,error:o}=await b.from("spot_images").delete().eq("id",e).eq("user_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(O(n,"图片删除失败，请检查权限或重试"))}}function O(e,t){const n=e==null?void 0:e.code,o=(e==null?void 0:e.message)||"",a={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&a[n]?a[n]:o.includes("JWT")?"认证已过期，请重新登录":o.includes("network")||o.includes("fetch")?"网络连接异常，请检查网络":o.includes("timeout")||o.includes("超时")?"请求超时，请检查网络后重试":t}async function $n(){await h.init(),Bn(),h.subscribe(e=>{Nt(e)})}function Tn(e){return h.subscribe(({user:t,profile:n})=>{e(t,n)})}function H(){return h.isLoggedIn}async function Mn(e,t){return h.signIn(e,t)}async function In(e,t){return h.signUp(e,t)}async function Pt(){return h.signOut()}async function An(e){return h.updateProfile(e)}function Pn(){Ht()}let X=null;function He(e,t="success",n=3e3){X||(X=document.createElement("div"),X.id="auth-toast-container",X.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;",document.body.appendChild(X));const o={success:"rgba(16,185,129,0.92)",error:"rgba(239,68,68,0.92)",info:"rgba(59,130,246,0.92)"},a=document.createElement("div");a.style.cssText=`background:${o[t]||o.info};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;text-align:center;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:auth-toast-in 0.3s ease-out;transition:opacity 0.25s ease,transform 0.25s ease;`,a.textContent=e,X.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateY(-12px)",setTimeout(()=>a.remove(),250)},n)}(function(){if(document.getElementById("auth-toast-styles"))return;const t=document.createElement("style");t.id="auth-toast-styles",t.textContent="@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}",document.head.appendChild(t)})();function Bn(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{h.isLoggedIn?Xn():Kn("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{Re(),await Pt()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{Re(),Bt()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&Re()}),Hn(),Nn(),Rn(),Un(),Nt({user:h.user})}function Hn(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",xe),e.querySelector(".auth-modal-close").addEventListener("click",xe),e.querySelector("#auth-switch-register").addEventListener("click",()=>_e("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>_e("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,o=e.querySelector("#auth-login-error"),a=e.querySelector("#auth-login-submit");if(!t||!n){o.textContent="请填写邮箱和密码";return}if(!h.supabase){o.textContent="服务未初始化，请刷新页面";return}o.textContent="",a.disabled=!0,a.textContent="登录中...";try{await Mn(t,n),xe(),ut()}catch(s){o.textContent=Xe(s.message)}finally{a.disabled=!1,a.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),o=e.querySelector("#auth-register-password").value,a=e.querySelector("#auth-register-error"),s=e.querySelector("#auth-register-submit");if(!t){a.textContent="请输入你的昵称",a.style.color="";return}if(!n){a.textContent="请输入邮箱地址",a.style.color="";return}if(!o){a.textContent="请输入密码",a.style.color="";return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){a.textContent="邮箱格式不正确，请检查后重试",a.style.color="";return}if(o.length<6){a.textContent="密码至少需要6位，请重新设置",a.style.color="";return}if(t.length>50){a.textContent="昵称不能超过50个字符",a.style.color="";return}if(!h.supabase){a.textContent="服务未初始化，请刷新页面",a.style.color="";return}a.textContent="",a.style.color="",s.disabled=!0,s.textContent="注册中...";try{const{user:r,session:i}=await In(n,o);if(i){if(t)try{await h.updateProfile({username:t})}catch(f){console.warn("[auth] 注册后更新 profile 昵称失败（非致命）:",f)}a.style.color="rgba(80, 230, 140, 0.95)",a.textContent="🎉 注册成功！已为您自动登录系统。";const c=t||n.split("@")[0]||"用户";He(`🎉 注册成功！已为您自动登录系统。
欢迎加入旅行地球，${c}！`,"success",3500);const d=setTimeout(()=>{xe(),ut(),delete e.dataset._registerTimer},1200);e.dataset._registerTimer=String(d)}else{a.style.color="rgba(100, 200, 255, 0.95)",a.textContent=`📧 注册成功！请查看邮箱中的确认链接完成验证。
（如未收到，请检查垃圾邮件箱）`;const c=setTimeout(()=>{a.style.color="",_e("login"),delete e.dataset._registerTimer},3500);e.dataset._registerTimer=String(c)}}catch(r){console.error("Supabase注册深度报错对象:",r),console.error("  · message:",r==null?void 0:r.message),console.error("  · status:",r==null?void 0:r.status),console.error("  · code:",r==null?void 0:r.code),console.error("  · stack:",r==null?void 0:r.stack);const i=Xe(r.message);a.style.color="",a.textContent=`${i}
[错误码: ${(r==null?void 0:r.status)||"未知"} | ${(r==null?void 0:r.code)||"N/A"}]`}finally{s.disabled=!1,s.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function Nn(){let e=!1,t="";const n=document.createElement("div");n.id="edit-profile-modal",n.className="auth-modal",n.innerHTML=`
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
  `,document.body.appendChild(n),n.querySelector("#edit-avatar-label");const o=n.querySelector("#edit-avatar-img"),a=n.querySelector("#edit-avatar-hover"),s=n.querySelector("#edit-avatar-hover-text"),r=n.querySelector("#edit-avatar-uploading"),i=n.querySelector("#edit-avatar-file"),c=n.querySelector("#edit-avatar-url"),d=n.querySelector("#edit-display-name"),f=n.querySelector("#edit-bio"),y=n.querySelector("#edit-profile-error"),w=n.querySelector("#edit-profile-submit"),l=n.querySelector("#edit-avatar-hint");function m(v){v?(o.src=v,o.style.display="block",s.textContent="更换头像"):(o.src="",o.style.display="none",s.textContent="设置头像"),a.style.display="",r.style.display="none",e=!1}i.addEventListener("change",async()=>{var N;const v=i.files[0];if(!v)return;const _=5*1024*1024;if(v.size>_){y.textContent="图片不能超过 5MB，请重新选择",i.value="";return}y.textContent="",a.style.display="none",r.style.display="flex",e=!0;try{const L=((N=h.user)==null?void 0:N.id)||"anonymous",ie=v.name.split(".").pop()||"jpg",ce=`${L}-${Date.now()}.${ie}`,{error:dt}=await h.supabase.storage.from("avatars").upload(ce,v,{upsert:!0});if(dt)throw dt;const{data:De}=h.supabase.storage.from("avatars").getPublicUrl(ce),we=(De==null?void 0:De.publicUrl)||"";if(!we)throw new Error("获取头像 URL 失败");t=we,c.value=we,m(we),l.textContent="头像上传成功 ✓",l.style.color="rgba(80,230,140,0.9)"}catch(L){console.error("[auth] 头像上传失败:",L),y.textContent="头像上传失败："+(L.message||"请检查网络或存储桶权限"),m(t),l.textContent="点击头像更换图片",l.style.color=""}finally{i.value=""}}),n.querySelector(".auth-modal-overlay").addEventListener("click",()=>{n.classList.remove("open")}),n.querySelector(".auth-modal-close").addEventListener("click",()=>{n.classList.remove("open")}),w.addEventListener("click",async()=>{const v=d.value.trim(),_=f.value.trim(),N=c.value.trim();if(!v){y.textContent="显示名称不能为空";return}if(e){y.textContent="头像正在上传中，请稍候...";return}y.textContent="",w.disabled=!0,w.textContent="保存中...";try{const L={username:v,bio:_||"",updated_at:new Date().toISOString()};N&&(L.avatar_url=N),await An(L),n.classList.remove("open"),He("✅ 资料保存成功","success",2e3)}catch(L){y.textContent="保存失败："+L.message}finally{w.disabled=!1,w.textContent="保存"}}),n._setAvatarUrl=function(v){t=v||"",c.value=t,m(t),l.textContent="点击头像更换图片",l.style.color=""},n._setDisplayName=function(v){d.value=v||""},n._setBio=function(v){f.value=v||""},n._clearError=function(){y.textContent=""}}function Un(){const e=document.createElement("div");e.id="change-password-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")});const t=e.querySelector("#change-pw-new"),n=e.querySelector("#change-pw-strength");t.addEventListener("input",()=>{const o=t.value;if(!o){n.style.display="none";return}n.style.display="block";const a=Fn(o);a<2?(n.textContent="🔴 密码强度：弱",n.style.color="rgba(255, 120, 120, 0.9)"):a<4?(n.textContent="🟡 密码强度：中等",n.style.color="rgba(251, 191, 36, 0.9)"):(n.textContent="🟢 密码强度：强",n.style.color="rgba(80, 230, 140, 0.9)")}),e.querySelector("#change-pw-submit").addEventListener("click",async()=>{const o=t.value,a=e.querySelector("#change-pw-confirm").value,s=e.querySelector("#change-pw-error"),r=e.querySelector("#change-pw-submit");if(!o){s.textContent="请输入新密码",s.style.color="";return}if(o.length<6){s.textContent="新密码至少需要6位",s.style.color="";return}if(!a){s.textContent="请再次输入新密码进行确认",s.style.color="";return}if(o!==a){s.textContent="两次输入的密码不一致，请检查后重试",s.style.color="";return}if(!h.supabase){s.textContent="服务未初始化，请刷新页面后重试",s.style.color="";return}s.textContent="",s.style.color="",r.disabled=!0,r.textContent="修改中...";try{const{data:i,error:c}=await h.supabase.auth.updateUser({password:o});if(c)throw c;s.style.color="rgba(80, 230, 140, 0.95)",s.textContent="🔐 密码修改成功！",He("🔐 密码修改成功！下次登录请使用新密码。","success",3500),setTimeout(()=>{e.classList.remove("open"),t.value="",e.querySelector("#change-pw-confirm").value="",n.style.display="none",s.textContent="",s.style.color=""},1500)}catch(i){const c=Xe(i.message);s.style.color="",s.textContent=c,console.error("[auth] 修改密码失败:",i.message,"| 原始错误:",i)}finally{r.disabled=!1,r.textContent="确认修改"}}),e.addEventListener("keydown",o=>{if(o.key==="Enter"){const a=e.querySelector("#change-pw-submit");a&&!a.disabled&&a.click()}})}function Dn(){const e=document.getElementById("change-password-modal");if(!e)return;e.querySelector("#change-pw-new").value="",e.querySelector("#change-pw-confirm").value="";const t=e.querySelector("#change-pw-strength");t&&(t.style.display="none");const n=e.querySelector("#change-pw-error");n&&(n.textContent="",n.style.color=""),e.classList.add("open")}function Fn(e){let t=0;return e.length>=6&&t++,e.length>=10&&t++,/[0-9]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[!@#$%^&*(),.?":{}|<>]/.test(e)&&t++,t}function Bt(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=h.profile;e._setAvatarUrl((t==null?void 0:t.avatar_url)||""),e._setDisplayName((t==null?void 0:t.username)||""),e._setBio((t==null?void 0:t.bio)||""),e._clearError(),e.classList.add("open")}function Rn(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),Bt()}),e.querySelector("#pc-btn-change-pw").addEventListener("click",()=>{e.classList.remove("open"),Dn()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await Pt(),He("👋 已退出登录","info",2e3)}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function Ht(){var s;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),o=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),o.style.display="none",e.classList.add("open"),h.loading){n&&(n.textContent="正在验证身份令牌...");const r=Date.now(),i=5e3,c=100;try{await new Promise((d,f)=>{const y=setInterval(()=>{h.loading?Date.now()-r>i&&(clearInterval(y),f(new Error("timeout"))):(clearInterval(y),d())},c)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!h.isLoggedIn){n&&(n.textContent="请先登录");return}const a=h.user.id;n&&(n.textContent="📡 数据传送中...");try{const r=await Promise.allSettled([le(vn(a),8e3,"足迹统计"),le(bn(a),8e3,"点赞统计"),le(wn(a),8e3,"浏览量统计"),le(xn(a),8e3,"足迹列表"),le(Sn(a),8e3,"收藏列表")]),i=(l,m,v)=>{var _;return l.status==="fulfilled"?l.value:(console.warn(`[profile-center] ⚠️ ${v} 加载失败，使用默认值`,((_=l.reason)==null?void 0:_.message)||l.reason),m)},c=i(r[0],0,"足迹统计"),d=i(r[1],0,"点赞统计"),f=i(r[2],0,"浏览量统计"),y=i(r[3],[],"足迹列表"),w=i(r[4],[],"收藏列表");On(e,{avatarUrl:h.getAvatarUrl(),displayName:h.getDisplayName(),bio:((s=h.profile)==null?void 0:s.bio)||"",spotCount:c,likeCount:d,views:f,spots:y,favorites:w})}catch(r){console.error("[profile-center] 加载统计失败:",r),jn(e);return}t.style.display="none",o.style.display="flex"}function On(e,t){const{avatarUrl:n,displayName:o,bio:a,spotCount:s,likeCount:r,views:i,spots:c,favorites:d}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=o,e.querySelector("#pc-bio").textContent=a||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=s??0,e.querySelector("#pc-stat-likes").textContent=r??0,e.querySelector("#pc-stat-views").textContent=i??0,zn(e,c),Jn(e,d)}function jn(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const o=t.querySelector("#pc-retry-btn");o&&o.addEventListener("click",()=>Ht())}function le(e,t,n){return Promise.race([e,new Promise((o,a)=>setTimeout(()=>a(new Error(`${n} 请求超时`)),t))])}function zn(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(o=>{const a=document.createElement("div");a.className="pc-footprint-item",a.innerHTML=`
      <span class="pc-footprint-name">📍 ${tt(o.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,a.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:o.id,lng:o.longitude,lat:o.latitude,name:o.name,description:o.description||""}}))}),n.appendChild(a)})}}function Jn(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(o=>{const a=o.spots,s=(a==null?void 0:a.id)??o.spot_id;if(!s)return;const r=a!=null&&a.name?`⭐ ${tt(a.name)}`:`⭐ 景点 #${s}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${r}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:s,lng:(a==null?void 0:a.longitude)??0,lat:(a==null?void 0:a.latitude)??0,name:(a==null?void 0:a.name)||`景点 #${s}`,description:(a==null?void 0:a.description)||""}}))}),n.appendChild(i)})}}function Kn(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),_e(e))}function xe(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function _e(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const o=document.getElementById("auth-login-error"),a=document.getElementById("auth-register-error");o&&(o.textContent=""),a&&(a.textContent="",a.style.color="")}function ut(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),o=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),o&&(o.value="");const a=document.getElementById("auth-login-error"),s=document.getElementById("auth-register-error");a&&(a.textContent=""),s&&(s.textContent="",s.style.color="")}function Nt(e){var o;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const a=h.getDisplayName(),s=((o=a[0])==null?void 0:o.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${s}</span>
        <span class="auth-user-label">${tt(a)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function Xn(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function Re(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function Xe(e){if(!e)return"未知错误，请稍后重试";const t=e.toLowerCase();return t.includes("already registered")||t.includes("already exists")||t.includes("already been registered")||t.includes("user already registered")?"该邮箱已被注册，请直接登录或使用其他邮箱":t.includes("password should be at least")||t.includes("密码至少需要")?"密码至少需要6位，请重新设置":t.includes("weak password")||t.includes("password is too weak")?"密码强度不足，请使用至少6位的密码（建议包含字母和数字）":t.includes("invalid email")||t.includes("invalid_email")||t.includes("邮箱格式")?"邮箱格式不正确，请检查后重试":t.includes("email rate limit")||t.includes("too many requests")||t.includes("操作过于频繁")?"操作过于频繁，请等待60秒后再试":t.includes("email not confirmed")?"该邮箱尚未完成验证，请先点击确认邮件中的链接":t.includes("signup disabled")||t.includes("registration disabled")?"注册功能暂未开放，请联系管理员":t.includes("banned")||t.includes("disabled")||t.includes("blocked")?"该账号已被禁用，请联系管理员":t.includes("invalid login credentials")||t.includes("invalid credentials")||t.includes("invalid login")||t.includes("邮箱或密码错误")?"邮箱或密码错误，请检查后重试":t.includes("user not found")?"该邮箱尚未注册，请先创建账号":t.includes("same password")||t.includes("password is the same")?"新密码不能与当前密码相同，请更换一个":t.includes("password too short")||t.includes("password must be")?"新密码长度不足，至少需要6位":t.includes("password too weak")||t.includes("password is not strong")?"新密码强度不足，请使用包含字母和数字的密码":t.includes("new password")&&t.includes("required")?"请输入新密码":t.includes("超时")||t.includes("timeout")?"请求超时，请检查网络连接后重试":t.includes("网络")||t.includes("network")||t.includes("fetch")?"网络连接异常，请检查网络后重试":t.includes("abort")||t.includes("取消")?"请求已取消，请重试":t.includes("internal server error")||t.includes("500")?"服务器繁忙，请稍后再试":t.includes("service unavailable")||t.includes("503")?"服务暂不可用，请稍后再试":t.includes("请填写")||t.includes("请输入")||t.includes("至少需要")?e:(console.warn("[auth] 未匹配到中文翻译的错误消息:",e),`操作失败：${e}`)}function tt(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Vn="7dfc44451d8128e329100a0c71fa90b6";async function Wn(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(Vn)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(d){throw console.error("[geocodeService] 网络请求失败:",d),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let o;try{o=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(o.status!=="1")throw new Error(`高德 API 返回错误: ${o.info||"未知错误"} (status=${o.status})`);if(!o.geocodes||o.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const a=o.geocodes[0],[s,r]=a.location.split(","),i=parseFloat(s),c=parseFloat(r);if(isNaN(i)||isNaN(c))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${c}`),{longitude:i,latitude:c,formattedAddress:a.formatted_address||e}}let Ut=!1,ye=null,D=null,nt=!1,T=null,A=null,ve=!1;function pt(){return Ut}function Dt(){const e=document.createElement("div");return e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
    <!-- 切换按钮：absolute 定位在面板右侧外边缘 -->
    <button class="spot-list-toggle" id="spot-list-toggle" aria-label="切换侧边栏" title="展开景区列表">
      <svg class="spot-list-toggle-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3 L11 8 L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="spot-list-header">
      <span class="spot-list-title" id="spot-list-title">📍 景区列表</span>
      <span class="spot-list-count" id="spot-list-count"></span>
      <button class="spot-list-close">&times;</button>
    </div>
    <div class="spot-list-body" id="spot-list-body">
      <p class="spot-list-loading">加载中...</p>
    </div>
  `,e.querySelector(".spot-list-close").addEventListener("click",Ve),e.addEventListener("click",t=>{t.target===e&&Ve()}),e}function Ft(){T&&(A=T.querySelector("#spot-list-toggle"),A&&A.addEventListener("click",e=>{e.stopPropagation(),ve?Ve():Zn()}))}function Zn(){T&&(T.classList.add("open"),ve=!0,ot())}function ot(){if(!A)return;const e=A.querySelector(".spot-list-toggle-arrow");ve?(e.style.transform="rotate(180deg)",A.title="收起景区列表",A.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",A.title="展开景区列表",A.classList.remove("spot-list-toggle--open"))}function Gn(e,t){T||(T=Dt(),document.body.appendChild(T),Ft());const n=document.getElementById("spot-list-title"),o=document.getElementById("spot-list-count"),a=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),o&&(o.textContent=e?`${e.length} 个`:""),!e||e.length===0?a&&(a.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):a&&(a.innerHTML=e.map(s=>`
        <div class="spot-list-item" data-spot-id="${s.id}"
             data-lng="${s.longitude}" data-lat="${s.latitude}"
             data-name="${Ae(s.name)}"
             data-desc="${Ae(s.description||"")}"
             data-is-hot="${s.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${Ie(s.name)}</span>
            <span class="spot-list-item-city">${Ie(s.city||s.address||"")}</span>
          </div>
          ${s.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
        </div>
      `).join(""),a.querySelectorAll(".spot-list-item").forEach(s=>{s.addEventListener("click",()=>{const r=Number(s.dataset.spotId),i=parseFloat(s.dataset.lng),c=parseFloat(s.dataset.lat),d=s.dataset.name,f=s.dataset.desc,y=s.dataset.isHot==="1";ye&&ye(r,i,c,d,f,y)})})),T.classList.add("open"),ve=!0,ot()}function Ve(){T&&T.classList.remove("open"),ve=!1,ot()}function Rt(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",Ot),e}async function Yn(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((o,a)=>`
      <div class="hot-ranking-item" data-spot-id="${o.id}"
           data-lng="${o.longitude}" data-lat="${o.latitude}"
           data-name="${Ae(o.name)}"
           data-desc="${Ae(o.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${a<3?"hot-ranking-index--top":""}">${a+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${a<3?"⭐ ":""}${Ie(o.name)}</span>
          <span class="hot-ranking-city">${Ie(o.city||o.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${o.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(o=>{o.addEventListener("click",()=>{const a=Number(o.dataset.spotId),s=parseFloat(o.dataset.lng),r=parseFloat(o.dataset.lat),i=o.dataset.name,c=o.dataset.desc;ye&&ye(a,s,r,i,c,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function Qn(){D||(D=Rt(),document.body.appendChild(D)),D.classList.add("open"),nt=!0}function Ot(){D&&D.classList.remove("open"),nt=!1}function mt(e){Ut=e}function eo(e){nt?Ot():(Qn(),Yn(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function to(e={}){ye=e.onSpotClick||null,T=Dt(),document.body.appendChild(T),Ft(),D=Rt(),document.body.appendChild(D)}function Ie(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function Ae(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let jt=null,We=null,ft=null,J=[],Se=null,k=null,P=null;function no(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function yt(e){const t=P;if(!t)return;const n=e.trim();if(!n||n.length<1){J=[],Ze();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:o,error:a}=await jt.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(a){console.error("[searchSpot] 查询失败:",a),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}J=o||[],Ze()}catch(o){console.error("[searchSpot] 搜索异常:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function Ze(){const e=P;if(e){if(J.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=J.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${ht(t.name)}"
         data-desc="${ht(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${gt(t.name)}</span>
        <span class="spot-search-item-city">${gt(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>zt(t))})}}function zt(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),o=parseFloat(e.dataset.lat),a=e.dataset.name,s=e.dataset.desc,r=e.dataset.isHot==="1";Le(),k&&(k.value="",ke(!1)),We&&We(t,n,o,a,s,r)}function Le(){P&&(P.classList.remove("open"),P.innerHTML=""),J=[]}function ke(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function oo(e={}){jt=re,We=e.onSpotClick||null,Se=no(),document.body.appendChild(Se),k=document.getElementById("spot-search-input"),P=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");k&&(k.addEventListener("input",()=>{const n=k.value;ke(n.length>0),clearTimeout(ft),ft=setTimeout(()=>yt(n),300)}),k.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),J.length>0)){const o=P==null?void 0:P.querySelector(".spot-search-item");o&&zt(o)}n.key==="Escape"&&(Le(),k.value="",ke(!1))}),k.addEventListener("focus",()=>{J.length>0?Ze():k.value.trim()&&yt(k.value)})),t&&t.addEventListener("click",()=>{k&&(k.value="",k.focus()),Le(),ke(!1)}),document.addEventListener("click",n=>{Se&&!Se.contains(n.target)&&Le()})}function gt(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function ht(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Oe=window.innerWidth<768,qe=[],Pe=null,ge=null,F=null,K=!1;const Jt=768,ao=1024;function Kt(){const e=window.innerWidth;return e<Jt?"mobile":e<ao?"tablet":"desktop"}function so(e){if(typeof e=="function")return qe.push(e),()=>{qe=qe.filter(t=>t!==e)}}function Xt(e){qe.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function ro(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
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
  `,e}function io(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
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
  `,e}function co(){K||(K=!0,F.classList.add("open"),ge.classList.add("active"),document.body.style.overflow="hidden")}function G(){K&&(K=!1,F.classList.remove("open"),ge.classList.remove("active"),document.body.style.overflow="")}function lo(e){G(),Xt(e)}function uo(){if(!ge||!F||!Pe)return;ge.addEventListener("click",()=>{K?G():co()});const e=F.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",G);const t=F.querySelector(".menu-drawer-close");t&&t.addEventListener("click",G);const n=Pe.querySelectorAll("[data-action]"),o=F.querySelectorAll("[data-action]");n.forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.action;s&&Xt(s)})}),o.forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.action;s&&lo(s)})}),document.addEventListener("keydown",a=>{a.key==="Escape"&&K&&G()})}let vt=null;function po(){clearTimeout(vt),vt=setTimeout(()=>{const e=Oe;Oe=window.innerWidth<Jt,e&&!Oe&&K&&G(),Vt()},150)}function Vt(){const e=Kt();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function mo(){Vt(),Pe=ro(),document.body.insertBefore(Pe,document.body.firstChild),F=io(),document.body.appendChild(F),ge=document.getElementById("nav-hamburger"),uo(),window.addEventListener("resize",po),console.log("[responsive] 响应式模块初始化完成，当前设备:",Kt())}let Q=null,ae=[],ee=0,$e=null;function fo(e={}){Q=re;const{onPostCreated:t}=e;$e=t||null;const n=document.createElement("button");n.id="create-post-entry-btn",n.className="create-post-entry-btn",n.innerHTML="<span>⚡</span><span>发布避雷</span>",n.title="分享你的旅行避雷经验",n.addEventListener("click",()=>{if(!H()){ho();return}Ge()}),document.body.appendChild(n);const o=vo();document.body.appendChild(o);const a=o.querySelector(".create-post-overlay"),s=o.querySelector(".create-post-close"),r=o.querySelector("#create-post-cancel"),i=o.querySelector("#create-post-submit"),c=o.querySelector("#create-post-title"),d=o.querySelector("#create-post-content"),f=o.querySelectorAll(".create-post-star"),y=o.querySelector("#create-post-image-input"),w=o.querySelector("#create-post-add-image");o.querySelector(".create-post-image-previews");const l=o.querySelector("#create-post-status");let m=0;function v(){o.classList.remove("open"),c.value="",d.value="",m=0,ae=[],ee=0,Ee(0),Be(),l.textContent="",l.style.color="",i.disabled=!1,i.textContent="⚡ 发布避雷"}return a.addEventListener("click",v),s.addEventListener("click",v),r.addEventListener("click",v),f.forEach(_=>{_.addEventListener("click",()=>{m=Number(_.dataset.rating),Ee(m)}),_.addEventListener("mouseenter",()=>{Ee(Number(_.dataset.rating))})}),o.querySelector(".create-post-stars").addEventListener("mouseleave",()=>{Ee(m)}),w.addEventListener("click",()=>y.click()),y.addEventListener("change",bo),i.addEventListener("click",async()=>{const _=c.value.trim(),N=d.value.trim();if(!_){l.textContent="请输入景点名称",l.style.color="rgba(255, 120, 120, 0.95)";return}if(_.length>200){l.textContent="景点名称不能超过200字",l.style.color="rgba(255, 120, 120, 0.95)";return}if(!N){l.textContent="请输入避雷感受",l.style.color="rgba(255, 120, 120, 0.95)";return}if(m<1){l.textContent="请点击星星评分（1-5星）",l.style.color="rgba(255, 120, 120, 0.95)";return}if(ee>0){l.textContent="图片正在上传中，请稍候...",l.style.color="rgba(255, 180, 80, 0.95)";return}l.textContent="正在发布...",l.style.color="rgba(255, 255, 255, 0.7)",i.disabled=!0,i.textContent="⏳ 发布中...";try{const{data:{user:L}}=await Q.auth.getUser();if(!L){l.textContent="登录状态已失效，请重新登录",l.style.color="rgba(255, 120, 120, 0.95)",i.disabled=!1,i.textContent="⚡ 发布避雷";return}const{data:ie,error:ce}=await Q.from("posts").insert({user_id:L.id,title:_,content:N,image_urls:ae,rating:m}).select().single();if(ce)throw ce;v(),typeof $e=="function"&&$e(ie),pe("✅ 避雷帖发布成功！","success",3e3)}catch(L){console.error("[createPost] 发布失败:",L);const ie=wo(L,"发布失败，请检查网络或权限后重试");l.textContent=ie,l.style.color="rgba(255, 120, 120, 0.95)",i.disabled=!1,i.textContent="⚡ 发布避雷"}}),o.addEventListener("keydown",_=>{_.key==="Escape"&&v()}),{open:()=>Ge()}}function yo(){Ge()}function go(e){$e=typeof e=="function"?e:null}function Ge(){const e=document.getElementById("create-post-modal");e&&e.classList.add("open")}function ho(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function vo(){const e=document.createElement("div");return e.id="create-post-modal",e.className="create-post-modal",e.innerHTML=`
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
  `,e}function Ee(e){const t=document.querySelectorAll("#create-post-modal .create-post-star"),n=document.querySelector("#create-post-modal #create-post-rating-text"),o=["","⭐ 非常差","⭐⭐ 较差","⭐⭐⭐ 一般","⭐⭐⭐⭐ 推荐","⭐⭐⭐⭐⭐ 强烈推荐"];t.forEach(a=>{const s=Number(a.dataset.rating);a.classList.toggle("active",s<=e)}),n&&(n.textContent=o[e]||"点击评分")}async function bo(){const e=document.getElementById("create-post-image-input");if(!e||!e.files.length)return;const t=Array.from(e.files);if(e.value="",ae.length+t.length+ee>9){pe("最多上传9张照片","warn",3e3);return}for(const n of t){if(!["image/jpeg","image/png","image/webp"].includes(n.type)){pe(`${n.name} 格式不支持，请选择 JPG/PNG/WebP`,"warn",4e3);continue}if(n.size>10*1024*1024){pe(`${n.name} 超过10MB，请压缩后重试`,"warn",4e3);continue}ee++,Be();try{const{data:{user:a}}=await Q.auth.getUser(),s=(a==null?void 0:a.id)||"anonymous",r=n.name.split(".").pop()||"jpg",i=`posts/${s}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${r}`,{error:c}=await Q.storage.from("post-images").upload(i,n,{upsert:!1});if(c)throw c;const{data:d}=Q.storage.from("post-images").getPublicUrl(i),f=(d==null?void 0:d.publicUrl)||"";f&&ae.push(f)}catch(a){console.error("[createPost] 图片上传失败:",a),pe(`${n.name} 上传失败: ${a.message||"未知错误"}`,"error",5e3)}finally{ee--,Be()}}}function Be(){const e=document.getElementById("create-post-image-previews");if(!e)return;let t="";ae.forEach((n,o)=>{t+=`
      <div class="create-post-image-item">
        <img src="${xo(n)}" alt="照片${o+1}" />
        <button class="create-post-image-remove" data-idx="${o}" title="移除">×</button>
      </div>
    `});for(let n=0;n<ee;n++)t+=`
      <div class="create-post-image-item uploading">
        <div class="create-post-image-spinner"></div>
      </div>
    `;e.innerHTML=t,e.querySelectorAll(".create-post-image-remove").forEach(n=>{n.addEventListener("click",()=>{const o=Number(n.dataset.idx);ae.splice(o,1),Be()})})}let de=null;function pe(e,t="info",n=4e3){de||(de=document.createElement("div"),de.style.cssText="position:fixed;top:120px;right:16px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:360px;",document.body.appendChild(de));const o={error:"#ef4444",warn:"#f59e0b",success:"#10b981",info:"#3b82f6"},a=document.createElement("div");a.style.cssText=`background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${o[t]||o.info};color:#e2e8f0;padding:12px 16px;border-radius:8px;font-size:14px;line-height:1.5;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:create-post-toast-in 0.3s ease-out;`,a.textContent=e,de.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(20px)",a.style.transition="opacity 0.3s, transform 0.3s",setTimeout(()=>a.remove(),300)},n)}(function(){if(document.getElementById("create-post-toast-styles"))return;const e=document.createElement("style");e.id="create-post-toast-styles",e.textContent="@keyframes create-post-toast-in { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }",document.head.appendChild(e)})();function wo(e,t){const n=e==null?void 0:e.code,o=(e==null?void 0:e.message)||"",a={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&a[n]?a[n]:o.includes("JWT")?"认证已过期，请重新登录":o.includes("network")||o.includes("fetch")?"网络连接异常，请检查网络":t}function xo(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}let at=null,he=[],je=!1,E=null;function So(){at=re,E=Co(),document.body.appendChild(E),_o(),go(async e=>{const t=await qo(e.user_id),n={...e,profiles:t};he.unshift(n),Zt();const o=E.querySelector(".community-body");o&&(o.scrollTop=0)}),console.log("[community] 社区模块初始化完成")}function Eo(){E&&(E.classList.add("open"),document.body.style.overflow="hidden",Wt())}function bt(){E&&(E.classList.remove("open"),document.body.style.overflow="")}function Co(){const e=document.createElement("div");return e.id="community-page",e.className="community-page",e.innerHTML=`
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
  `,e}function _o(){E&&(E.querySelector("#community-back-btn").addEventListener("click",bt),E.querySelector("#community-create-btn").addEventListener("click",()=>{wt()}),E.querySelector("#community-empty-btn").addEventListener("click",()=>{wt()}),E.querySelector("#community-retry-btn").addEventListener("click",()=>{Wt()}),E.addEventListener("keydown",e=>{e.key==="Escape"&&bt()}))}function wt(){if(!H()){To();return}yo()}async function Wt(){if(je)return;je=!0;const e=E.querySelector("#community-loading"),t=E.querySelector("#community-error"),n=E.querySelector("#community-empty"),o=E.querySelector("#community-grid");e.style.display="flex",t.style.display="none",n.style.display="none",o.innerHTML="";try{const{data:a,error:s}=await at.from("posts").select("*, profiles(username, avatar_url)").order("created_at",{ascending:!1});if(s)throw s;he=a||[],e.style.display="none",he.length===0?n.style.display="flex":Zt()}catch(a){console.error("[community] 加载帖子失败:",a),e.style.display="none",t.style.display="flex",E.querySelector("#community-error-msg").textContent="加载失败："+(a.message||"请检查网络后重试")}finally{je=!1}}function Zt(){const e=E.querySelector("#community-grid");if(e){if(he.length===0){e.innerHTML="";return}e.innerHTML=he.map(t=>Lo(t)).join(""),e.querySelectorAll(".community-card-img").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation(),ko(t.src)})})}}function Lo(e){const t=e.profiles||{},n=ze(t.username||"匿名用户"),o=t.avatar_url||"",a=ze(e.title||"无标题"),s=ze(e.content||""),r=e.rating||0,i=e.image_urls||[],c=$o(e.created_at),d=o?`<img class="community-card-avatar-img" src="${Ye(o)}" alt="${n}" />`:'<div class="community-card-avatar-placeholder">👤</div>',f=Array.from({length:5},(w,l)=>`<span class="community-star ${l<r?"active":""}">★</span>`).join("");let y="";return i.length>0&&(y=`<div class="community-card-images">${i.map((l,m)=>`<div class="community-card-img-wrap">
            <img class="community-card-img" src="${Ye(l)}" alt="照片${m+1}" loading="lazy" />
          </div>`).join("")}</div>`),`
    <div class="community-card">
      <!-- 作者信息 -->
      <div class="community-card-header">
        <div class="community-card-avatar">
          ${d}
        </div>
        <div class="community-card-author">
          <span class="community-card-username">${n}</span>
          <span class="community-card-time">${c}</span>
        </div>
        <div class="community-card-rating" title="${r} 星">
          ${f}
        </div>
      </div>

      <!-- 标题 + 内容 -->
      <div class="community-card-body">
        <h3 class="community-card-title">${a}</h3>
        <p class="community-card-content">${s}</p>
      </div>

      <!-- 图片画廊 -->
      ${y}
    </div>
  `}function ko(e){var o;(o=document.querySelector(".community-lightbox"))==null||o.remove();const t=document.createElement("div");t.className="community-lightbox",t.innerHTML=`
    <div class="community-lightbox-overlay"></div>
    <button class="community-lightbox-close">&times;</button>
    <img class="community-lightbox-img" src="${Ye(e)}" alt="原图" />
  `,document.body.appendChild(t);const n=()=>t.remove();t.querySelector(".community-lightbox-overlay").addEventListener("click",n),t.querySelector(".community-lightbox-close").addEventListener("click",n),t.addEventListener("keydown",a=>{a.key==="Escape"&&n()})}async function qo(e){try{const{data:t}=await at.from("profiles").select("username, avatar_url").eq("id",e).maybeSingle();return t||{username:"匿名用户",avatar_url:""}}catch{return{username:"匿名用户",avatar_url:""}}}function $o(e){if(!e)return"";const t=Date.now(),n=new Date(e).getTime(),o=t-n,a=Math.floor(o/1e3);if(a<60)return"刚刚";const s=Math.floor(a/60);if(s<60)return`${s} 分钟前`;const r=Math.floor(s/60);if(r<24)return`${r} 小时前`;const i=Math.floor(r/24);return i<30?`${i} 天前`:`${Math.floor(i/30)} 个月前`}function To(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function ze(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ye(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let I=null;const st=[];let g=null,x=null,te=!1,ne=!1,Gt=0,V=null;function Qe(e,t="info",n=6e3){V||(V=document.createElement("div"),V.id="toast-container",V.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 24px);",document.body.appendChild(V));const o={error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"},a=o[t]||o.info,s=document.createElement("div");if(s.className="toast-notification",s.style.cssText=`position:relative;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${a};color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.5;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:toast-slide-in 0.3s ease-out;transition:opacity 0.3s ease,transform 0.3s ease;`,n>0){const i=document.createElement("button");i.textContent="×",i.style.cssText="position:absolute;top:6px;right:10px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;padding:0;",i.addEventListener("click",()=>xt(s)),s.appendChild(i)}const r=document.createElement("span");return r.style.cssText="display:block;padding-right:22px;white-space:pre-line;",r.textContent=e,s.appendChild(r),V.appendChild(s),n>0&&setTimeout(()=>xt(s),n),s}function xt(e){!e||e.dataset._removing==="1"||(e.dataset._removing="1",e.style.opacity="0",e.style.transform="translateX(20px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}(function(){if(document.getElementById("toast-keyframes"))return;const t=document.createElement("style");t.id="toast-keyframes",t.textContent=`
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,document.head.appendChild(t)})();const se=re,p=document.createElement("div");p.id="spot-sidebar";p.innerHTML=`
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
`;document.body.appendChild(p);const Mo=p.querySelector(".sidebar-overlay"),Io=p.querySelector(".sidebar-close"),Ao=p.querySelector(".hero-placeholder"),Po=p.querySelector(".hero-name"),Bo=p.querySelector(".hero-desc"),St=p.querySelector(".hero-hot-badge"),Te=p.querySelector(".sidebar-photos-area"),et=p.querySelector("#photo-upload-btn"),Z=p.querySelector("#photo-file-input"),M=p.querySelector("#photo-upload-status"),Me=p.querySelector(".sidebar-comments-area"),Et=p.querySelector("#comment-login-prompt"),z=p.querySelector("#comment-input"),R=p.querySelector("#comment-submit-btn"),$=p.querySelector("#comment-form-status"),me=p.querySelector("#btn-like"),Ct=p.querySelector("#btn-like-icon"),_t=p.querySelector("#btn-like-text"),Ho=p.querySelector("#btn-like-count"),fe=p.querySelector("#btn-fav"),Lt=p.querySelector("#btn-fav-icon"),kt=p.querySelector("#btn-fav-text"),No=p.querySelector("#btn-fav-count"),Uo=p.querySelector("#btn-comment-jump"),Do=p.querySelector("#btn-comment-count");function rt(){p.classList.remove("open")}Mo.addEventListener("click",rt);Io.addEventListener("click",rt);async function Fo(e,t){rt(),Ce();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
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
  `,document.body.appendChild(n);const o=n.querySelector(".spot-pioneer-overlay"),a=n.querySelector(".spot-pioneer-close"),s=n.querySelector("#pioneer-submit"),r=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),c=n.querySelector("#pioneer-desc"),d=n.querySelector(".spot-pioneer-coords");o.addEventListener("click",Ce),a.addEventListener("click",Ce),d.textContent="📍 正在定位...";try{const f=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,w=await(await fetch(f)).json();if(w.status==="1"&&w.regeocode){const l=w.regeocode.formatted_address||"",m=w.regeocode.addressComponent,v=(m==null?void 0:m.township)||(m==null?void 0:m.district)||(m==null?void 0:m.city)||l||"";i.placeholder=`如：${v||"此处"}`,d.textContent=`📍 ${l||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else d.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{d.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}s.addEventListener("click",async()=>{if(!H()){j();return}const f=i.value.trim(),y=c.value.trim();if(!f){r.textContent="请输入景区名称",r.style.color="rgba(255, 120, 120, 0.95)";return}if(!y){r.textContent="请写下一句话打卡心得",r.style.color="rgba(255, 120, 120, 0.95)";return}r.textContent="正在创建...",r.style.color="rgba(255, 255, 255, 0.7)",s.disabled=!0,s.textContent="⏳ 创建中...";try{const{data:w,error:l}=await se.from("spots").insert({name:f,longitude:e,latitude:t,description:y,creator_id:x.id}).select();if(l)throw l;const m=w[0];it(m),Ce(),I.setZoomAndCenter(12,[e,t]),await Ne(m.id,m.name,m.description)}catch(w){console.error("[pioneer] 创建景区失败:",w),r.textContent="创建失败："+(w.message||"请检查网络后重试"),r.style.color="rgba(255, 120, 120, 0.95)",s.disabled=!1,s.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",f=>{f.key==="Enter"&&!s.disabled&&s.click()})}function Ce(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function it(e){const t=e.is_hot===!0,n=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:${t?"13":"12"}px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${t?"⭐ ":""}${oe(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t}});n.on("click",()=>Oo(n)),I.add(n),st.push(n)}async function Je(){let e=[],t=null;try{if(pt())e=await En();else{const o=await se.from("spots").select("*");e=o.data||[],t=o.error}}catch(o){t=o}if(t){console.error("[main] 加载景区数据失败:",t),Qe(`加载景区数据失败
地图浏览不受影响`,"error",8e3);return}Ro(),e.forEach(it);const n=pt()?"🔥 热门景区":"📍 全部景区";Gn(e,n)}function Ro(){I.clearMap(),st.length=0}function qt(e,t,n,o,a,s){var y;if(!I)return;I.setZoomAndCenter(15,[t,n]),Ne(e,o,a,s);const r=st.find(w=>{var l;return((l=w.getExtData())==null?void 0:l.id)===e});if(!r)return;const i=(y=r.getExtData())==null?void 0:y.isHot,c=r.getLabel(),d=c?c.getContent():"",f=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${oe(o)}</div>`;r.setLabel({content:f,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{r.setLabel({content:d,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function Oo(e){Gt=Date.now();const t=e.getExtData();!t||!t.id||(I.setZoomAndCenter(12,e.getPosition()),await Ne(t.id,t.name,t.description,t.isHot))}const $t=new Map;async function Ne(e,t,n,o){g=Number(e),Po.textContent=t||"",Bo.textContent=n||"暂无介绍",Ao.style.display="flex",o?St.style.display="inline-block":St.style.display="none";const a=Date.now(),s=$t.get(g);(!s||a-s>3e4)&&($t.set(g,a),_n(g).catch(r=>console.warn("[main] 浏览量更新失败:",r))),Te.innerHTML="",Me.innerHTML="",$.textContent="",p.classList.add("open"),Yt(),await jo(),lt(g),await Ue(g)}me.addEventListener("click",async()=>{if(!x){j();return}if(g){me.disabled=!0;try{te?(await cn(x.id,g),te=!1):(await rn(x.id,g),te=!0),await be(),ct()}catch(e){console.error("[main] 点赞操作失败:",e)}finally{me.disabled=!1}}});fe.addEventListener("click",async()=>{if(!x){j();return}if(g){fe.disabled=!0;try{ne?(await pn(x.id,g),ne=!1):(await un(x.id,g),ne=!0),await be(),ct()}catch(e){console.error("[main] 收藏操作失败:",e)}finally{fe.disabled=!1}}});Uo.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),H()?setTimeout(()=>z.focus(),400):j())});function ct(){te?(Ct.textContent="❤️",_t.textContent="已赞",me.classList.add("active")):(Ct.textContent="🤍",_t.textContent="点赞",me.classList.remove("active")),ne?(Lt.textContent="⭐",kt.textContent="已收藏",fe.classList.add("active")):(Lt.textContent="☆",kt.textContent="收藏",fe.classList.remove("active"))}async function be(){if(g)try{const[e,t,n]=await Promise.all([ln(g),mn(g),hn(g)]);Ho.textContent=e>0?e:"",No.textContent=t>0?t:"",Do.textContent=n>0?n:""}catch(e){console.warn("[main] 刷新计数失败:",e)}}async function jo(){if(!x||!g)te=!1,ne=!1;else try{const[e,t]=await Promise.all([sn(x.id,g),dn(x.id,g)]);te=e,ne=t}catch(e){console.warn("[main] 刷新互动状态失败:",e)}ct(),await be()}function j(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function Tt(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),o=document.getElementById("add-submit");!e||!t||!n||!o||(H()?(e.style.display="none",t.disabled=!1,n.disabled=!1,o.disabled=!1,o.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,o.disabled=!0,o.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function Yt(){H()?(Et.style.display="none",z.disabled=!1,R.disabled=!1,R.textContent="发表评论",z.placeholder="写下你的评论..."):(Et.style.display="block",z.disabled=!0,R.disabled=!0,R.textContent="请先登录",z.placeholder="请先登录后再发表评论")}async function lt(e){const[t,n]=await Promise.allSettled([se.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),Ln(e)]),o=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(a=>{a.photo_urls&&Array.isArray(a.photo_urls)&&a.photo_urls.forEach(s=>o.push({url:s,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(a=>o.push({url:a.url,source:"upload",id:a.id,userId:a.user_id})),Te.innerHTML="",o.length>0){const a=document.createElement("div");a.className="photo-grid",[...new Map(o.map(r=>[r.url,r])).values()].forEach(r=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${oe(r.url)}" alt="景区照片" loading="lazy" />`,r.source==="upload"&&x&&r.userId===x.id){const c=document.createElement("button");c.className="photo-delete-btn",c.textContent="×",c.title="删除此照片",c.addEventListener("click",async d=>{if(d.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await qn(r.id,x.id),lt(e)}catch(f){console.error("[main] 删除照片失败:",f)}}),i.appendChild(c)}a.appendChild(i)}),Te.appendChild(a)}else Te.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}et.addEventListener("click",()=>{if(!x){j();return}g&&Z.click()});Z.addEventListener("change",async()=>{const e=Z.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){M.textContent="仅支持 JPG / PNG / WEBP 格式",M.style.color="rgba(255, 80, 80, 0.95)",Z.value="";return}if(e.size>5*1024*1024){M.textContent="图片不能超过 5MB",M.style.color="rgba(255, 80, 80, 0.95)",Z.value="";return}M.textContent="正在上传...",M.style.color="rgba(255, 255, 255, 0.7)",et.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),o=Date.now(),a=`${x.id}/${g}/${o}.${n}`,{error:s}=await se.storage.from("spot-images").upload(a,e,{upsert:!1});if(s)throw s;const{data:r}=se.storage.from("spot-images").getPublicUrl(a),i=r.publicUrl;await kn(g,x.id,a,i),M.textContent="上传成功！",M.style.color="rgba(80, 230, 140, 0.95)",await lt(g),setTimeout(()=>{M.textContent=""},2e3)}catch(n){console.error("[main] 上传照片失败:",n),M.textContent="上传失败："+(n.message||"未知错误"),M.style.color="rgba(255, 80, 80, 0.95)"}finally{et.disabled=!1,Z.value=""}});async function Ue(e){let t;try{t=await fn(e)}catch(a){console.warn("[main] 加载评论失败:",a),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),Me.innerHTML="",t.length===0){Me.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const o=document.createElement("div");o.className="comment-list",t.forEach(a=>{const s=zo(a.created_at),r=a.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.user_id)}`,i=x&&a.user_id===x.id,c=document.createElement("div");c.className="comment-bubble",c.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${oe(r)}" alt="" />
        <span class="comment-author-name">${oe(a.username)}</span>
        <span class="comment-time">${s}</span>
        ${i?`<button class="comment-delete-btn" data-id="${a.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${oe(a.content)}</div>
    `,o.appendChild(c)}),Me.appendChild(o),o.querySelectorAll(".comment-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const s=Number(a.dataset.id);a.disabled=!0;try{await gn(s,x.id),await Ue(e),await be()}catch(r){console.error("[main] 删除评论失败:",r),a.disabled=!1}})})}function zo(e){if(!e)return"";const t=new Date(e),o=new Date-t,a=Math.floor(o/6e4);if(a<1)return"刚刚";if(a<60)return`${a}分钟前`;const s=Math.floor(a/60);if(s<24)return`${s}小时前`;const r=Math.floor(s/24);return r<30?`${r}天前`:t.toLocaleDateString("zh-CN")}function oe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}R.addEventListener("click",async()=>{if(!g){$.textContent="请先点击地球上的景区",$.style.color="rgba(255, 80, 80, 0.95)";return}if(!H()){j();return}const e=z.value.trim();if(!e){$.textContent="请输入评论内容",$.style.color="rgba(255, 80, 80, 0.95)";return}$.textContent="正在发表...",$.style.color="rgba(255, 255, 255, 0.8)",R.disabled=!0;try{await yn(x.id,g,e)}catch(t){console.error("[main] 发表评论失败:",t),$.textContent="发表失败："+t.message,$.style.color="rgba(255, 80, 80, 0.95)",R.disabled=!1;return}$.textContent="发表成功！",$.style.color="rgba(80, 230, 140, 0.95)",z.value="",await Ue(g),await be(),R.disabled=!1,setTimeout(()=>{$.textContent=""},2e3)});const B=document.createElement("div");B.id="add-form";B.innerHTML=`
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
`;document.body.appendChild(B);const q=B.querySelector(".add-form-status"),Jo=B.querySelector("#add-submit");Jo.addEventListener("click",async()=>{if(!H()){j();return}const e=B.querySelector("#field-address").value.trim(),t=B.querySelector("#field-desc").value.trim();if(!e||!t){q.textContent="请完整填写所有字段",q.style.color="rgba(255, 80, 80, 0.95)";return}q.textContent="正在查询地址...",q.style.color="rgba(255, 255, 255, 0.8)";let n,o;try{const i=await Wn(e);n=i.longitude,o=i.latitude}catch(i){console.error("[main] 高德地理编码失败:",i),q.textContent="查询失败："+i.message,q.style.color="rgba(255, 80, 80, 0.95)";return}q.textContent="正在保存...",q.style.color="rgba(255, 255, 255, 0.8)";const{data:a,error:s}=await se.from("spots").insert({name:e,longitude:n,latitude:o,description:t,creator_id:x.id}).select();if(s){console.error("[main] 添加景区失败:",s),q.textContent="添加失败："+s.message,q.style.color="rgba(255, 80, 80, 0.95)";return}q.textContent="添加成功！",q.style.color="rgba(80, 230, 140, 0.95)",B.querySelector("#field-address").value="",B.querySelector("#field-desc").value="";const r=a[0];it(r),I.setZoomAndCenter(12,[r.longitude,r.latitude]),setTimeout(()=>{q.textContent=""},2e3)});async function Ko(){console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e),Qe("⚠️ 地图服务加载失败，请刷新页面","error",0);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),I=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),I.on("click",e=>{Date.now()-Gt<300||Fo(e.lnglat.getLng(),e.lnglat.getLat())}),to({onSpotClick:qt}),oo({onSpotClick:qt}),mo(),fo(),So(),so(e=>{switch(e){case"home":mt(!1),Je();break;case"community":Eo();break;case"hot":mt(!0),Je();break;case"ranking":eo(Cn);break;case"favorites":case"profile":H()?Pn():j();break}}),console.log("[调试步骤3/6] 🔐 初始化认证模块...");try{await $n(),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e),Qe(`⚠️ 认证服务初始化失败
地图浏览不受影响`,"warn",1e4)}console.log("[调试步骤4/6] 🗄️ 初始化数据库..."),an(),console.log("[调试步骤4/6] ✅ 数据库初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange..."),Tn((e,t)=>{if(x=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}Tt(),g&&p.classList.contains("open")&&(Yt(),Ue(g))}),console.log("[调试步骤5/6] ✅ onAuthChange 就绪"),console.log("[调试步骤6/6] 📍 加载景区数据..."),Tt(),Je(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:o,name:a,description:s}=e.detail;I.setZoomAndCenter(14,[n,o]),Ne(t,a,s,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}Ko();
