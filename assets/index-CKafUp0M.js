(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const sn="7dfc44451d8128e329100a0c71fa90b6",rn="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:rn};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(sn)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});const At="https://dxygnktgxycdqxipvjdj.supabase.co",cn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA",ln=window.supabase.createClient(At,cn,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[supabaseClient] 硬编码直连模式初始化完成:",At);const le=ln;let C=null,u=null,E=null,D=!0,Ye=new Set,ze=null;const w={get isLoggedIn(){return!!u},get loading(){return D},get user(){return u},get profile(){return E},get supabase(){return C},async init(){if(C)return console.warn("[authStore] 已初始化，跳过重复调用"),ze;C=le;const t=setTimeout(()=>{D&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",C!=null&&C.auth?"getSession":"未初始化"),D=!1,Z())},3e3),{data:n}=C.auth.onAuthStateChange(dn);return n==null||n.subscription,ze=C.auth.getSession().then(async({data:{session:a}})=>{clearTimeout(t);const o=(a==null?void 0:a.user)??null;u&&o&&u.id===o.id||(u=o,u?await Bt():E=null),D=!1,Z()}).catch(a=>{clearTimeout(t),console.error("[authStore] getSession 失败:",a),D=!1,Z()}),ze},async signIn(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:a}=await te(C.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(a)throw a;return n},async signUp(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:a}=await te(C.auth.signUp({email:e,password:t}),15e3,"注册请求超时，请检查网络后重试");if(a)throw a;return n},async signOut(){if(C){try{await te(C.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}u=null,E=null,Z()}},async updateProfile(e){if(!u)throw new Error("未登录");const{data:t,error:n}=await C.from("profiles").update(e).eq("id",u.id).select("*").single();if(n)throw n;return E=t,Z(),t},subscribe(e){Ye.add(e);try{e(Ht())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{Ye.delete(e)}},getAvatarUrl(){return E!=null&&E.avatar_url?E.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(u==null?void 0:u.id)||"default"}`},getDisplayName(){var e,t;return(E==null?void 0:E.username)||((e=u==null?void 0:u.user_metadata)==null?void 0:e.username)||((t=u==null?void 0:u.email)==null?void 0:t.split("@")[0])||"用户"}};async function dn(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const a=(t==null?void 0:t.user)??null,o=u&&a&&u.id!==a.id||!u&&a||u&&!a;u=a,u&&o?await Bt():u||(E=null)}catch(a){console.error("[authStore] onAuthStateChange 处理异常:",a),E=u?pe():null}D&&(D=!1),Z()}async function Bt(){var n,a,o,s,r;if(!u)return;let e,t;try{const i=await te(C.from("profiles").select("*").eq("id",u.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),E=pe();return}if(t){const i=t==null?void 0:t.code,c=(t==null?void 0:t.hint)||"";i==="PGRST301"||c.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):c.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),E=pe();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((a=u.user_metadata)==null?void 0:a.nickname)||((o=u.user_metadata)==null?void 0:o.username)||((s=u.email)==null?void 0:s.split("@")[0])||"";try{const c=await te(C.from("profiles").upsert({id:u.id,username:i,avatar_url:((r=u.user_metadata)==null?void 0:r.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(c.error){console.warn("[authStore] 自动创建 profile 失败:",c.error.message,"| code:",c.error.code),E=pe();return}try{const d=await te(C.from("profiles").select("*").eq("id",u.id).maybeSingle(),5e3,"profiles 二次查询超时");if(d.error)console.warn("[authStore] 二次查询 profile 出错:",d.error.message);else if(d.data){E=d.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(d){console.warn("[authStore] 二次查询 profile 异常:",d.message)}}catch(c){console.warn("[authStore] 自动创建 profile 异常:",c.message)}E=pe();return}E=e}function pe(){var e,t,n;return u?{id:u.id,username:((e=u.user_metadata)==null?void 0:e.username)||((t=u.email)==null?void 0:t.split("@")[0])||"",avatar_url:((n=u.user_metadata)==null?void 0:n.avatar_url)||null,bio:""}:null}function Z(){const e=Ht();Ye.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function Ht(){return{user:u,profile:E,loading:D}}function te(e,t,n){return Promise.race([e,new Promise((a,o)=>setTimeout(()=>o(new Error(n)),t))])}let h=null;function un(){h=le}async function pn(e,t){const{count:n,error:a}=await h.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(a)throw a;return n>0}async function mn(e,t){try{const{data:n,error:a}=await h.from("likes").insert({user_id:e,spot_id:t});if(a)throw a;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(P(n,"点赞失败，请检查权限或重试"))}}async function fn(e,t){try{const{data:n,error:a}=await h.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(P(n,"取消点赞失败，请检查权限或重试"))}}async function yn(e){const{count:t,error:n}=await h.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function gn(e,t){const{count:n,error:a}=await h.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(a)throw a;return n>0}async function hn(e,t){try{const{data:n,error:a}=await h.from("favorites").insert({user_id:e,spot_id:t});if(a)throw a;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(P(n,"收藏失败，请检查权限或重试"))}}async function vn(e,t){try{const{data:n,error:a}=await h.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(P(n,"取消收藏失败，请检查权限或重试"))}}async function bn(e){const{count:t,error:n}=await h.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function wn(e){const{data:t,error:n}=await h.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function xn(e,t,n){try{const{data:a,error:o}=await h.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(o)throw o;return a}catch(a){throw console.error("[db] addComment 失败:",a),new Error(P(a,"评论发表失败，请检查权限或重试"))}}async function Sn(e,t){try{const{data:n,error:a}=await h.from("comments").delete().eq("id",e).eq("user_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(P(n,"评论删除失败，请检查权限或重试"))}}async function En(e){const{count:t,error:n}=await h.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Cn(e){const{count:t,error:n}=await h.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function _n(e){const{count:t,error:n}=await h.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function Ln(e){const{data:t,error:n}=await h.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((a,o)=>a+(o.views||0),0)}async function kn(e){const{data:t,error:n}=await h.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function qn(e){const{data:t,error:n}=await h.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function $n(){const{data:e,error:t}=await h.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function Tn(e=10){const{data:t,error:n}=await h.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function In(e){const{error:t}=await h.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await h.from("spots").select("views").eq("id",e).maybeSingle(),a=((n==null?void 0:n.views)||0)+1;await h.from("spots").update({views:a}).eq("id",e)}}async function Mn(e){const{data:t,error:n}=await h.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Pn(e,t,n,a){try{const{data:o,error:s}=await h.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:a}).select();if(s)throw s;return o}catch(o){throw console.error("[db] saveSpotImage 失败:",o),new Error(P(o,"图片保存失败，请检查存储权限或重试"))}}async function An(e,t){try{const{data:n,error:a}=await h.from("spot_images").delete().eq("id",e).eq("user_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(P(n,"图片删除失败，请检查权限或重试"))}}async function Bn(e){const{data:t,error:n}=await h.from("user_footprints").select("*").eq("user_id",e);if(n)throw n;return t||[]}async function Hn(e,t,n){try{const{data:a,error:o}=await h.from("user_footprints").insert({user_id:e,spot_id:t,city_name:n}).select().single();if(o)throw o;return a}catch(a){throw console.error("[db] addFootprint 失败:",a),new Error(P(a,"点亮足迹失败，请检查权限或重试"))}}async function Nn(e,t){try{const{data:n,error:a}=await h.from("user_footprints").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] removeFootprint 失败:",n),new Error(P(n,"取消点亮失败，请检查权限或重试"))}}function P(e,t){const n=e==null?void 0:e.code,a=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:a.includes("JWT")?"认证已过期，请重新登录":a.includes("network")||a.includes("fetch")?"网络连接异常，请检查网络":a.includes("timeout")||a.includes("超时")?"请求超时，请检查网络后重试":t}async function Un(){await w.init(),jn(),w.subscribe(e=>{Rt(e)})}function Fn(e){return w.subscribe(({user:t,profile:n})=>{e(t,n)})}function Nt(){return w.user}function F(){return w.isLoggedIn}async function Dn(e,t){return w.signIn(e,t)}async function Rn(e,t){return w.signUp(e,t)}async function Ut(){return w.signOut()}async function On(e){return w.updateProfile(e)}function zn(){Dt()}let Y=null;function Fe(e,t="success",n=3e3){Y||(Y=document.createElement("div"),Y.id="auth-toast-container",Y.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;",document.body.appendChild(Y));const a={success:"rgba(16,185,129,0.92)",error:"rgba(239,68,68,0.92)",info:"rgba(59,130,246,0.92)"},o=document.createElement("div");o.style.cssText=`background:${a[t]||a.info};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;text-align:center;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:auth-toast-in 0.3s ease-out;transition:opacity 0.25s ease,transform 0.25s ease;`,o.textContent=e,Y.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-12px)",setTimeout(()=>o.remove(),250)},n)}(function(){if(document.getElementById("auth-toast-styles"))return;const t=document.createElement("style");t.id="auth-toast-styles",t.textContent="@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}",document.head.appendChild(t)})();function jn(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{w.isLoggedIn?no():to("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{je(),await Ut()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{je(),Ft()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&je()}),Jn(),Xn(),Yn(),Kn(),Rt({user:w.user})}function Jn(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",Ee),e.querySelector(".auth-modal-close").addEventListener("click",Ee),e.querySelector("#auth-switch-register").addEventListener("click",()=>qe("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>qe("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,a=e.querySelector("#auth-login-error"),o=e.querySelector("#auth-login-submit");if(!t||!n){a.textContent="请填写邮箱和密码";return}if(!w.supabase){a.textContent="服务未初始化，请刷新页面";return}a.textContent="",o.disabled=!0,o.textContent="登录中...";try{await Dn(t,n),Ee(),yt()}catch(s){a.textContent=Ge(s.message)}finally{o.disabled=!1,o.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),a=e.querySelector("#auth-register-password").value,o=e.querySelector("#auth-register-error"),s=e.querySelector("#auth-register-submit");if(!t){o.textContent="请输入你的昵称",o.style.color="";return}if(!n){o.textContent="请输入邮箱地址",o.style.color="";return}if(!a){o.textContent="请输入密码",o.style.color="";return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){o.textContent="邮箱格式不正确，请检查后重试",o.style.color="";return}if(a.length<6){o.textContent="密码至少需要6位，请重新设置",o.style.color="";return}if(t.length>50){o.textContent="昵称不能超过50个字符",o.style.color="";return}if(!w.supabase){o.textContent="服务未初始化，请刷新页面",o.style.color="";return}o.textContent="",o.style.color="",s.disabled=!0,s.textContent="注册中...";try{const{user:r,session:i}=await Rn(n,a);if(i){if(t)try{await w.updateProfile({username:t})}catch(m){console.warn("[auth] 注册后更新 profile 昵称失败（非致命）:",m)}o.style.color="rgba(80, 230, 140, 0.95)",o.textContent="🎉 注册成功！已为您自动登录系统。";const c=t||n.split("@")[0]||"用户";Fe(`🎉 注册成功！已为您自动登录系统。
欢迎加入旅行地球，${c}！`,"success",3500);const d=setTimeout(()=>{Ee(),yt(),delete e.dataset._registerTimer},1200);e.dataset._registerTimer=String(d)}else{o.style.color="rgba(100, 200, 255, 0.95)",o.textContent=`📧 注册成功！请查看邮箱中的确认链接完成验证。
（如未收到，请检查垃圾邮件箱）`;const c=setTimeout(()=>{o.style.color="",qe("login"),delete e.dataset._registerTimer},3500);e.dataset._registerTimer=String(c)}}catch(r){console.error("Supabase注册深度报错对象:",r),console.error("  · message:",r==null?void 0:r.message),console.error("  · status:",r==null?void 0:r.status),console.error("  · code:",r==null?void 0:r.code),console.error("  · stack:",r==null?void 0:r.stack);const i=Ge(r.message);o.style.color="",o.textContent=`${i}
[错误码: ${(r==null?void 0:r.status)||"未知"} | ${(r==null?void 0:r.code)||"N/A"}]`}finally{s.disabled=!1,s.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function Xn(){let e=!1,t="";const n=document.createElement("div");n.id="edit-profile-modal",n.className="auth-modal",n.innerHTML=`
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
  `,document.body.appendChild(n),n.querySelector("#edit-avatar-label");const a=n.querySelector("#edit-avatar-img"),o=n.querySelector("#edit-avatar-hover"),s=n.querySelector("#edit-avatar-hover-text"),r=n.querySelector("#edit-avatar-uploading"),i=n.querySelector("#edit-avatar-file"),c=n.querySelector("#edit-avatar-url"),d=n.querySelector("#edit-display-name"),m=n.querySelector("#edit-bio"),p=n.querySelector("#edit-profile-error"),l=n.querySelector("#edit-profile-submit"),f=n.querySelector("#edit-avatar-hint");function v(y){y?(a.src=y,a.style.display="block",s.textContent="更换头像"):(a.src="",a.style.display="none",s.textContent="设置头像"),o.style.display="",r.style.display="none",e=!1}i.addEventListener("change",async()=>{var T;const y=i.files[0];if(!y)return;const A=5*1024*1024;if(y.size>A){p.textContent="图片不能超过 5MB，请重新选择",i.value="";return}p.textContent="",o.style.display="none",r.style.display="flex",e=!0;try{const L=((T=w.user)==null?void 0:T.id)||"anonymous",xe=y.name.split(".").pop()||"jpg",mt=`${L}-${Date.now()}.${xe}`,{error:ft}=await w.supabase.storage.from("avatars").upload(mt,y,{upsert:!0});if(ft)throw ft;const{data:Oe}=w.supabase.storage.from("avatars").getPublicUrl(mt),Se=(Oe==null?void 0:Oe.publicUrl)||"";if(!Se)throw new Error("获取头像 URL 失败");t=Se,c.value=Se,v(Se),f.textContent="头像上传成功 ✓",f.style.color="rgba(80,230,140,0.9)"}catch(L){console.error("[auth] 头像上传失败:",L),p.textContent="头像上传失败："+(L.message||"请检查网络或存储桶权限"),v(t),f.textContent="点击头像更换图片",f.style.color=""}finally{i.value=""}}),n.querySelector(".auth-modal-overlay").addEventListener("click",()=>{n.classList.remove("open")}),n.querySelector(".auth-modal-close").addEventListener("click",()=>{n.classList.remove("open")}),l.addEventListener("click",async()=>{const y=d.value.trim(),A=m.value.trim(),T=c.value.trim();if(!y){p.textContent="显示名称不能为空";return}if(e){p.textContent="头像正在上传中，请稍候...";return}p.textContent="",l.disabled=!0,l.textContent="保存中...";try{const L={username:y,bio:A||"",updated_at:new Date().toISOString()};T&&(L.avatar_url=T),await On(L),n.classList.remove("open"),Fe("✅ 资料保存成功","success",2e3)}catch(L){p.textContent="保存失败："+L.message}finally{l.disabled=!1,l.textContent="保存"}}),n._setAvatarUrl=function(y){t=y||"",c.value=t,v(t),f.textContent="点击头像更换图片",f.style.color=""},n._setDisplayName=function(y){d.value=y||""},n._setBio=function(y){m.value=y||""},n._clearError=function(){p.textContent=""}}function Kn(){const e=document.createElement("div");e.id="change-password-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")});const t=e.querySelector("#change-pw-new"),n=e.querySelector("#change-pw-strength");t.addEventListener("input",()=>{const a=t.value;if(!a){n.style.display="none";return}n.style.display="block";const o=Wn(a);o<2?(n.textContent="🔴 密码强度：弱",n.style.color="rgba(255, 120, 120, 0.9)"):o<4?(n.textContent="🟡 密码强度：中等",n.style.color="rgba(251, 191, 36, 0.9)"):(n.textContent="🟢 密码强度：强",n.style.color="rgba(80, 230, 140, 0.9)")}),e.querySelector("#change-pw-submit").addEventListener("click",async()=>{const a=t.value,o=e.querySelector("#change-pw-confirm").value,s=e.querySelector("#change-pw-error"),r=e.querySelector("#change-pw-submit");if(!a){s.textContent="请输入新密码",s.style.color="";return}if(a.length<6){s.textContent="新密码至少需要6位",s.style.color="";return}if(!o){s.textContent="请再次输入新密码进行确认",s.style.color="";return}if(a!==o){s.textContent="两次输入的密码不一致，请检查后重试",s.style.color="";return}if(!w.supabase){s.textContent="服务未初始化，请刷新页面后重试",s.style.color="";return}s.textContent="",s.style.color="",r.disabled=!0,r.textContent="修改中...";try{const{data:i,error:c}=await w.supabase.auth.updateUser({password:a});if(c)throw c;s.style.color="rgba(80, 230, 140, 0.95)",s.textContent="🔐 密码修改成功！",Fe("🔐 密码修改成功！下次登录请使用新密码。","success",3500),setTimeout(()=>{e.classList.remove("open"),t.value="",e.querySelector("#change-pw-confirm").value="",n.style.display="none",s.textContent="",s.style.color=""},1500)}catch(i){const c=Ge(i.message);s.style.color="",s.textContent=c,console.error("[auth] 修改密码失败:",i.message,"| 原始错误:",i)}finally{r.disabled=!1,r.textContent="确认修改"}}),e.addEventListener("keydown",a=>{if(a.key==="Enter"){const o=e.querySelector("#change-pw-submit");o&&!o.disabled&&o.click()}})}function Vn(){const e=document.getElementById("change-password-modal");if(!e)return;e.querySelector("#change-pw-new").value="",e.querySelector("#change-pw-confirm").value="";const t=e.querySelector("#change-pw-strength");t&&(t.style.display="none");const n=e.querySelector("#change-pw-error");n&&(n.textContent="",n.style.color=""),e.classList.add("open")}function Wn(e){let t=0;return e.length>=6&&t++,e.length>=10&&t++,/[0-9]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[!@#$%^&*(),.?":{}|<>]/.test(e)&&t++,t}function Ft(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=w.profile;e._setAvatarUrl((t==null?void 0:t.avatar_url)||""),e._setDisplayName((t==null?void 0:t.username)||""),e._setBio((t==null?void 0:t.bio)||""),e._clearError(),e.classList.add("open")}function Yn(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),Ft()}),e.querySelector("#pc-btn-change-pw").addEventListener("click",()=>{e.classList.remove("open"),Vn()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await Ut(),Fe("👋 已退出登录","info",2e3)}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function Dt(){var s;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),a=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),a.style.display="none",e.classList.add("open"),w.loading){n&&(n.textContent="正在验证身份令牌...");const r=Date.now(),i=5e3,c=100;try{await new Promise((d,m)=>{const p=setInterval(()=>{w.loading?Date.now()-r>i&&(clearInterval(p),m(new Error("timeout"))):(clearInterval(p),d())},c)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!w.isLoggedIn){n&&(n.textContent="请先登录");return}const o=w.user.id;n&&(n.textContent="📡 数据传送中...");try{const r=await Promise.allSettled([de(Cn(o),8e3,"足迹统计"),de(_n(o),8e3,"点赞统计"),de(Ln(o),8e3,"浏览量统计"),de(kn(o),8e3,"足迹列表"),de(qn(o),8e3,"收藏列表")]),i=(f,v,y)=>{var A;return f.status==="fulfilled"?f.value:(console.warn(`[profile-center] ⚠️ ${y} 加载失败，使用默认值`,((A=f.reason)==null?void 0:A.message)||f.reason),v)},c=i(r[0],0,"足迹统计"),d=i(r[1],0,"点赞统计"),m=i(r[2],0,"浏览量统计"),p=i(r[3],[],"足迹列表"),l=i(r[4],[],"收藏列表");Gn(e,{avatarUrl:w.getAvatarUrl(),displayName:w.getDisplayName(),bio:((s=w.profile)==null?void 0:s.bio)||"",spotCount:c,likeCount:d,views:m,spots:p,favorites:l})}catch(r){console.error("[profile-center] 加载统计失败:",r),Zn(e);return}t.style.display="none",a.style.display="flex"}function Gn(e,t){const{avatarUrl:n,displayName:a,bio:o,spotCount:s,likeCount:r,views:i,spots:c,favorites:d}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=a,e.querySelector("#pc-bio").textContent=o||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=s??0,e.querySelector("#pc-stat-likes").textContent=r??0,e.querySelector("#pc-stat-views").textContent=i??0,Qn(e,c),eo(e,d)}function Zn(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const a=t.querySelector("#pc-retry-btn");a&&a.addEventListener("click",()=>Dt())}function de(e,t,n){return Promise.race([e,new Promise((a,o)=>setTimeout(()=>o(new Error(`${n} 请求超时`)),t))])}function Qn(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(a=>{const o=document.createElement("div");o.className="pc-footprint-item",o.innerHTML=`
      <span class="pc-footprint-name">📍 ${at(a.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,o.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a.id,lng:a.longitude,lat:a.latitude,name:a.name,description:a.description||""}}))}),n.appendChild(o)})}}function eo(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(a=>{const o=a.spots,s=(o==null?void 0:o.id)??a.spot_id;if(!s)return;const r=o!=null&&o.name?`⭐ ${at(o.name)}`:`⭐ 景点 #${s}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${r}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:s,lng:(o==null?void 0:o.longitude)??0,lat:(o==null?void 0:o.latitude)??0,name:(o==null?void 0:o.name)||`景点 #${s}`,description:(o==null?void 0:o.description)||""}}))}),n.appendChild(i)})}}function to(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),qe(e))}function Ee(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function qe(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const a=document.getElementById("auth-login-error"),o=document.getElementById("auth-register-error");a&&(a.textContent=""),o&&(o.textContent="",o.style.color="")}function yt(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),a=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),a&&(a.value="");const o=document.getElementById("auth-login-error"),s=document.getElementById("auth-register-error");o&&(o.textContent=""),s&&(s.textContent="",s.style.color="")}function Rt(e){var a;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const o=w.getDisplayName(),s=((a=o[0])==null?void 0:a.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${s}</span>
        <span class="auth-user-label">${at(o)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function no(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function je(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function Ge(e){if(!e)return"未知错误，请稍后重试";const t=e.toLowerCase();return t.includes("already registered")||t.includes("already exists")||t.includes("already been registered")||t.includes("user already registered")?"该邮箱已被注册，请直接登录或使用其他邮箱":t.includes("password should be at least")||t.includes("密码至少需要")?"密码至少需要6位，请重新设置":t.includes("weak password")||t.includes("password is too weak")?"密码强度不足，请使用至少6位的密码（建议包含字母和数字）":t.includes("invalid email")||t.includes("invalid_email")||t.includes("邮箱格式")?"邮箱格式不正确，请检查后重试":t.includes("email rate limit")||t.includes("too many requests")||t.includes("操作过于频繁")?"操作过于频繁，请等待60秒后再试":t.includes("email not confirmed")?"该邮箱尚未完成验证，请先点击确认邮件中的链接":t.includes("signup disabled")||t.includes("registration disabled")?"注册功能暂未开放，请联系管理员":t.includes("banned")||t.includes("disabled")||t.includes("blocked")?"该账号已被禁用，请联系管理员":t.includes("invalid login credentials")||t.includes("invalid credentials")||t.includes("invalid login")||t.includes("邮箱或密码错误")?"邮箱或密码错误，请检查后重试":t.includes("user not found")?"该邮箱尚未注册，请先创建账号":t.includes("same password")||t.includes("password is the same")?"新密码不能与当前密码相同，请更换一个":t.includes("password too short")||t.includes("password must be")?"新密码长度不足，至少需要6位":t.includes("password too weak")||t.includes("password is not strong")?"新密码强度不足，请使用包含字母和数字的密码":t.includes("new password")&&t.includes("required")?"请输入新密码":t.includes("超时")||t.includes("timeout")?"请求超时，请检查网络连接后重试":t.includes("网络")||t.includes("network")||t.includes("fetch")?"网络连接异常，请检查网络后重试":t.includes("abort")||t.includes("取消")?"请求已取消，请重试":t.includes("internal server error")||t.includes("500")?"服务器繁忙，请稍后再试":t.includes("service unavailable")||t.includes("503")?"服务暂不可用，请稍后再试":t.includes("请填写")||t.includes("请输入")||t.includes("至少需要")?e:(console.warn("[auth] 未匹配到中文翻译的错误消息:",e),`操作失败：${e}`)}function at(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const oo="7dfc44451d8128e329100a0c71fa90b6";async function ao(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(oo)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(d){throw console.error("[geocodeService] 网络请求失败:",d),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let a;try{a=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(a.status!=="1")throw new Error(`高德 API 返回错误: ${a.info||"未知错误"} (status=${a.status})`);if(!a.geocodes||a.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const o=a.geocodes[0],[s,r]=o.location.split(","),i=parseFloat(s),c=parseFloat(r);if(isNaN(i)||isNaN(c))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${c}`),{longitude:i,latitude:c,formattedAddress:o.formatted_address||e}}let ne=null,ie=[],oe=0,$e=null;function so(e={}){ne=le;const{onPostCreated:t}=e;$e=t||null;const n=io();document.body.appendChild(n);const a=n.querySelector(".create-post-overlay"),o=n.querySelector(".create-post-close"),s=n.querySelector("#create-post-cancel"),r=n.querySelector("#create-post-submit"),i=n.querySelector("#create-post-title"),c=n.querySelector("#create-post-content"),d=n.querySelectorAll(".create-post-star"),m=n.querySelector("#create-post-image-input"),p=n.querySelector("#create-post-add-image");n.querySelector(".create-post-image-previews");const l=n.querySelector("#create-post-status");let f=0;function v(){n.classList.remove("open"),i.value="",c.value="",f=0,ie=[],oe=0,Ce(0),Be(),l.textContent="",l.style.color="",r.disabled=!1,r.textContent="⚡ 发布避雷"}return a.addEventListener("click",v),o.addEventListener("click",v),s.addEventListener("click",v),d.forEach(y=>{y.addEventListener("click",()=>{f=Number(y.dataset.rating),Ce(f)}),y.addEventListener("mouseenter",()=>{Ce(Number(y.dataset.rating))})}),n.querySelector(".create-post-stars").addEventListener("mouseleave",()=>{Ce(f)}),p.addEventListener("click",()=>m.click()),m.addEventListener("change",co),r.addEventListener("click",async()=>{const y=i.value.trim(),A=c.value.trim();if(!y){l.textContent="请输入景点名称",l.style.color="rgba(255, 120, 120, 0.95)";return}if(y.length>200){l.textContent="景点名称不能超过200字",l.style.color="rgba(255, 120, 120, 0.95)";return}if(!A){l.textContent="请输入避雷感受",l.style.color="rgba(255, 120, 120, 0.95)";return}if(f<1){l.textContent="请点击星星评分（1-5星）",l.style.color="rgba(255, 120, 120, 0.95)";return}if(oe>0){l.textContent="图片正在上传中，请稍候...",l.style.color="rgba(255, 180, 80, 0.95)";return}l.textContent="正在发布...",l.style.color="rgba(255, 255, 255, 0.7)",r.disabled=!0,r.textContent="⏳ 发布中...";try{const{data:{user:T}}=await ne.auth.getUser();if(!T){l.textContent="登录状态已失效，请重新登录",l.style.color="rgba(255, 120, 120, 0.95)",r.disabled=!1,r.textContent="⚡ 发布避雷";return}const{data:L,error:xe}=await ne.from("posts").insert({user_id:T.id,title:y,content:A,image_urls:ie,rating:f}).select().single();if(xe)throw xe;v(),typeof $e=="function"&&$e(L),me("✅ 避雷帖发布成功！","success",3e3)}catch(T){console.error("[createPost] 发布失败:",T);const L=lo(T,"发布失败，请检查网络或权限后重试");l.textContent=L,l.style.color="rgba(255, 120, 120, 0.95)",r.disabled=!1,r.textContent="⚡ 发布避雷"}}),n.addEventListener("keydown",y=>{y.key==="Escape"&&v()}),{open:()=>zt()}}function Ot(){zt()}function ro(e){$e=typeof e=="function"?e:null}function zt(){const e=document.getElementById("create-post-modal");e&&e.classList.add("open")}function io(){const e=document.createElement("div");return e.id="create-post-modal",e.className="create-post-modal",e.innerHTML=`
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
  `,e}function Ce(e){const t=document.querySelectorAll("#create-post-modal .create-post-star"),n=document.querySelector("#create-post-modal #create-post-rating-text"),a=["","⭐ 非常差","⭐⭐ 较差","⭐⭐⭐ 一般","⭐⭐⭐⭐ 推荐","⭐⭐⭐⭐⭐ 强烈推荐"];t.forEach(o=>{const s=Number(o.dataset.rating);o.classList.toggle("active",s<=e)}),n&&(n.textContent=a[e]||"点击评分")}async function co(){const e=document.getElementById("create-post-image-input");if(!e||!e.files.length)return;const t=Array.from(e.files);if(e.value="",ie.length+t.length+oe>9){me("最多上传9张照片","warn",3e3);return}for(const n of t){if(!["image/jpeg","image/png","image/webp"].includes(n.type)){me(`${n.name} 格式不支持，请选择 JPG/PNG/WebP`,"warn",4e3);continue}if(n.size>10*1024*1024){me(`${n.name} 超过10MB，请压缩后重试`,"warn",4e3);continue}oe++,Be();try{const{data:{user:o}}=await ne.auth.getUser(),s=(o==null?void 0:o.id)||"anonymous",r=n.name.split(".").pop()||"jpg",i=`posts/${s}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${r}`,{error:c}=await ne.storage.from("post-images").upload(i,n,{upsert:!1});if(c)throw c;const{data:d}=ne.storage.from("post-images").getPublicUrl(i),m=(d==null?void 0:d.publicUrl)||"";m&&ie.push(m)}catch(o){console.error("[createPost] 图片上传失败:",o),me(`${n.name} 上传失败: ${o.message||"未知错误"}`,"error",5e3)}finally{oe--,Be()}}}function Be(){const e=document.getElementById("create-post-image-previews");if(!e)return;let t="";ie.forEach((n,a)=>{t+=`
      <div class="create-post-image-item">
        <img src="${uo(n)}" alt="照片${a+1}" />
        <button class="create-post-image-remove" data-idx="${a}" title="移除">×</button>
      </div>
    `});for(let n=0;n<oe;n++)t+=`
      <div class="create-post-image-item uploading">
        <div class="create-post-image-spinner"></div>
      </div>
    `;e.innerHTML=t,e.querySelectorAll(".create-post-image-remove").forEach(n=>{n.addEventListener("click",()=>{const a=Number(n.dataset.idx);ie.splice(a,1),Be()})})}let ue=null;function me(e,t="info",n=4e3){ue||(ue=document.createElement("div"),ue.style.cssText="position:fixed;top:120px;right:16px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:360px;",document.body.appendChild(ue));const a={error:"#ef4444",warn:"#f59e0b",success:"#10b981",info:"#3b82f6"},o=document.createElement("div");o.style.cssText=`background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${a[t]||a.info};color:#e2e8f0;padding:12px 16px;border-radius:8px;font-size:14px;line-height:1.5;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:create-post-toast-in 0.3s ease-out;`,o.textContent=e,ue.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(20px)",o.style.transition="opacity 0.3s, transform 0.3s",setTimeout(()=>o.remove(),300)},n)}(function(){if(document.getElementById("create-post-toast-styles"))return;const e=document.createElement("style");e.id="create-post-toast-styles",e.textContent="@keyframes create-post-toast-in { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }",document.head.appendChild(e)})();function lo(e,t){const n=e==null?void 0:e.code,a=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:a.includes("JWT")?"认证已过期，请重新登录":a.includes("network")||a.includes("fetch")?"网络连接异常，请检查网络":t}function uo(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}let jt=!1,he=null,R=null,st=!1,$=null,B=null,be=!1,J=new Set;function gt(){return jt}function po(){return J}async function mo(){const e=Nt();if(!e){J.clear();return}try{const t=await Bn(e.id);J=new Set(t.map(n=>n.spot_id))}catch(t){console.error("[hotSpots] 加载足迹失败:",t)}}function Jt(){const e=document.createElement("div");e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
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
  `,e.querySelector(".spot-list-close").addEventListener("click",Ze);const t=e.querySelector("#spot-list-create-post");return t&&t.addEventListener("click",n=>{if(n.stopPropagation(),!F()){const a=document.getElementById("auth-modal");a&&a.classList.add("open");return}Ot()}),e.addEventListener("click",n=>{n.target===e&&Ze()}),e}function Xt(){$&&(B=$.querySelector("#spot-list-toggle"),B&&B.addEventListener("click",e=>{e.stopPropagation(),be?Ze():fo()}))}function fo(){$&&($.classList.add("open"),be=!0,rt())}function rt(){if(!B)return;const e=B.querySelector(".spot-list-toggle-arrow");be?(e.style.transform="rotate(180deg)",B.title="收起景区列表",B.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",B.title="展开景区列表",B.classList.remove("spot-list-toggle--open"))}function Kt(e,t){$||($=Jt(),document.body.appendChild($),Xt());const n=document.getElementById("spot-list-title"),a=document.getElementById("spot-list-count"),o=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),a&&(a.textContent=e?`${e.length} 个`:""),!e||e.length===0?o&&(o.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):o&&(o.innerHTML=e.map(s=>{const r=J.has(s.id),i=r?"✨":"☆",c=r?"spot-list-light-btn--active":"";return`
        <div class="spot-list-item" data-spot-id="${s.id}"
             data-lng="${s.longitude}" data-lat="${s.latitude}"
             data-name="${fe(s.name)}"
             data-desc="${fe(s.description||"")}"
             data-is-hot="${s.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${He(s.name)}</span>
            <span class="spot-list-item-city">${He(s.city||s.address||"")}</span>
          </div>
          ${s.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
          <button class="spot-list-light-btn ${c}"
                  data-spot-id="${s.id}"
                  data-city-name="${fe(s.city||s.address||s.name)}"
                  title="${r?"已点亮":"点亮足迹"}">
            ${i}
          </button>
        </div>
      `}).join(""),o.querySelectorAll(".spot-list-item").forEach(s=>{s.addEventListener("click",r=>{if(r.target.closest(".spot-list-light-btn"))return;const i=Number(s.dataset.spotId),c=parseFloat(s.dataset.lng),d=parseFloat(s.dataset.lat),m=s.dataset.name,p=s.dataset.desc,l=s.dataset.isHot==="1";he&&he(i,c,d,m,p,l)})}),o.querySelectorAll(".spot-list-light-btn").forEach(s=>{s.addEventListener("click",async r=>{r.stopPropagation();const i=Nt();if(!i){const p=document.getElementById("auth-modal");p&&p.classList.add("open");return}const c=Number(s.dataset.spotId),d=s.dataset.cityName||"",m=J.has(c);s.disabled=!0;try{m?(await Nn(i.id,c),J.delete(c)):(await Hn(i.id,c,d),J.add(c));const p=e,l=n?n.textContent:"📍 景区列表";Kt(p,l)}catch(p){console.error("[hotSpots] 足迹操作失败:",p),s.disabled=!1,bo(p.message||"操作失败","error")}})})),$.classList.add("open"),be=!0,rt()}function Ze(){$&&$.classList.remove("open"),be=!1,rt()}function Vt(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",Wt),e}async function yo(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((a,o)=>`
      <div class="hot-ranking-item" data-spot-id="${a.id}"
           data-lng="${a.longitude}" data-lat="${a.latitude}"
           data-name="${fe(a.name)}"
           data-desc="${fe(a.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${o<3?"hot-ranking-index--top":""}">${o+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${o<3?"⭐ ":""}${He(a.name)}</span>
          <span class="hot-ranking-city">${He(a.city||a.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${a.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(a=>{a.addEventListener("click",()=>{const o=Number(a.dataset.spotId),s=parseFloat(a.dataset.lng),r=parseFloat(a.dataset.lat),i=a.dataset.name,c=a.dataset.desc;he&&he(o,s,r,i,c,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function go(){R||(R=Vt(),document.body.appendChild(R)),R.classList.add("open"),st=!0}function Wt(){R&&R.classList.remove("open"),st=!1}function ht(e){jt=e}function ho(e){st?Wt():(go(),yo(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function vo(e={}){he=e.onSpotClick||null,$=Jt(),document.body.appendChild($),Xt(),R=Vt(),document.body.appendChild(R)}let Je=null;function bo(e,t="info"){const n=document.getElementById("spot-list-toast");n&&n.remove(),Je&&clearTimeout(Je);const a={error:"#ef4444",success:"#10b981",info:"#3b82f6"},o=document.createElement("div");o.id="spot-list-toast",o.style.cssText=`position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:11000;background:rgba(20,20,30,0.95);backdrop-filter:blur(12px);border-left:4px solid ${a[t]||a.info};color:#e2e8f0;padding:10px 20px;border-radius:8px;font-size:14px;box-shadow:0 8px 32px rgba(0,0,0,0.5);pointer-events:auto;animation:spot-list-toast-in 0.3s ease;`,o.textContent=e,document.body.appendChild(o),Je=setTimeout(()=>{o.style.opacity="0",o.style.transition="opacity 0.3s",setTimeout(()=>o.remove(),300)},3e3)}(function(){if(document.getElementById("spot-list-toast-style"))return;const e=document.createElement("style");e.id="spot-list-toast-style",e.textContent="@keyframes spot-list-toast-in{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}",document.head.appendChild(e)})();function He(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function fe(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Yt=null,Qe=null,vt=null,V=[],_e=null,_=null,N=null;function wo(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function bt(e){const t=N;if(!t)return;const n=e.trim();if(!n||n.length<1){V=[],et();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:a,error:o}=await Yt.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(o){console.error("[searchSpot] 查询失败:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}V=a||[],et()}catch(a){console.error("[searchSpot] 搜索异常:",a),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function et(){const e=N;if(e){if(V.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=V.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${xt(t.name)}"
         data-desc="${xt(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${wt(t.name)}</span>
        <span class="spot-search-item-city">${wt(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>Gt(t))})}}function Gt(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),a=parseFloat(e.dataset.lat),o=e.dataset.name,s=e.dataset.desc,r=e.dataset.isHot==="1";Te(),_&&(_.value="",Ie(!1)),Qe&&Qe(t,n,a,o,s,r)}function Te(){N&&(N.classList.remove("open"),N.innerHTML=""),V=[]}function Ie(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function xo(e={}){Yt=le,Qe=e.onSpotClick||null,_e=wo(),document.body.appendChild(_e),_=document.getElementById("spot-search-input"),N=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");_&&(_.addEventListener("input",()=>{const n=_.value;Ie(n.length>0),clearTimeout(vt),vt=setTimeout(()=>bt(n),300)}),_.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),V.length>0)){const a=N==null?void 0:N.querySelector(".spot-search-item");a&&Gt(a)}n.key==="Escape"&&(Te(),_.value="",Ie(!1))}),_.addEventListener("focus",()=>{V.length>0?et():_.value.trim()&&bt(_.value)})),t&&t.addEventListener("click",()=>{_&&(_.value="",_.focus()),Te(),Ie(!1)}),document.addEventListener("click",n=>{_e&&!_e.contains(n.target)&&Te()})}function wt(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function xt(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Xe=window.innerWidth<768,Me=[],Ne=null,ve=null,O=null,W=!1;const Zt=768,So=1024;function Qt(){const e=window.innerWidth;return e<Zt?"mobile":e<So?"tablet":"desktop"}function Eo(e){if(typeof e=="function")return Me.push(e),()=>{Me=Me.filter(t=>t!==e)}}function en(e){Me.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function Co(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
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
  `,e}function _o(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
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
  `,e}function Lo(){W||(W=!0,O.classList.add("open"),ve.classList.add("active"),document.body.style.overflow="hidden")}function ee(){W&&(W=!1,O.classList.remove("open"),ve.classList.remove("active"),document.body.style.overflow="")}function ko(e){ee(),en(e)}function qo(){if(!ve||!O||!Ne)return;ve.addEventListener("click",()=>{W?ee():Lo()});const e=O.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",ee);const t=O.querySelector(".menu-drawer-close");t&&t.addEventListener("click",ee);const n=Ne.querySelectorAll("[data-action]"),a=O.querySelectorAll("[data-action]");n.forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.action;s&&en(s)})}),a.forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.action;s&&ko(s)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&W&&ee()})}let St=null;function $o(){clearTimeout(St),St=setTimeout(()=>{const e=Xe;Xe=window.innerWidth<Zt,e&&!Xe&&W&&ee(),tn()},150)}function tn(){const e=Qt();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function To(){tn(),Ne=Co(),document.body.insertBefore(Ne,document.body.firstChild),O=_o(),document.body.appendChild(O),ve=document.getElementById("nav-hamburger"),qo(),window.addEventListener("resize",$o),console.log("[responsive] 响应式模块初始化完成，当前设备:",Qt())}let it=null,X=[],H="",Ke=!1,b=null;function Io(){it=le,b=Po(),document.body.appendChild(b),Ao(),ro(async e=>{const t=await No(e.user_id),n={...e,profiles:t};X.unshift(n),Ue();const a=b.querySelector(".community-body");a&&(a.scrollTop=0)}),console.log("[community] 社区模块初始化完成（含搜索）")}function Mo(){b&&(b.classList.add("open"),document.body.style.overflow="hidden",nn())}function Et(){b&&(b.classList.remove("open"),document.body.style.overflow="")}function Po(){const e=document.createElement("div");return e.id="community-page",e.className="community-page",e.innerHTML=`
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

    <!-- 搜索栏 -->
    <div class="community-search-bar">
      <div class="community-search-wrap">
        <span class="community-search-icon">🔍</span>
        <input
          type="text"
          id="community-search-input"
          class="community-search-input"
          placeholder="搜索景点名称或避雷关键词..."
          autocomplete="off"
        />
        <button class="community-search-clear" id="community-search-clear" title="清除搜索" style="display:none">
          ×
        </button>
        <span class="community-search-count" id="community-search-count"></span>
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

      <!-- 搜索无结果（默认隐藏） -->
      <div class="community-empty" id="community-no-results" style="display:none">
        <div class="community-empty-icon">🔎</div>
        <h3>未找到匹配的帖子</h3>
        <p>换个关键词试试，或者发布第一条相关内容</p>
        <button class="community-empty-btn" id="community-noresults-btn">⚡ 立即分享</button>
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
  `,e}function Ao(){if(!b)return;b.querySelector("#community-back-btn").addEventListener("click",Et),b.querySelector("#community-create-btn").addEventListener("click",()=>{Ve()}),b.querySelector("#community-empty-btn").addEventListener("click",()=>{Ve()}),b.querySelector("#community-noresults-btn").addEventListener("click",()=>{Ve()}),b.querySelector("#community-retry-btn").addEventListener("click",()=>{nn()});const e=b.querySelector("#community-search-input"),t=b.querySelector("#community-search-clear");let n=null;e.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(()=>{H=e.value.trim().toLowerCase(),t.style.display=H?"flex":"none",Ue()},250)}),t.addEventListener("click",()=>{e.value="",H="",t.style.display="none",Ue(),e.focus()}),b.addEventListener("keydown",a=>{a.key==="Escape"&&Et()})}function Ve(){if(!F()){Fo();return}Ot()}async function nn(){if(Ke)return;Ke=!0;const e=b.querySelector("#community-loading"),t=b.querySelector("#community-error"),n=b.querySelector("#community-empty"),a=b.querySelector("#community-no-results"),o=b.querySelector("#community-grid");e.style.display="flex",t.style.display="none",n.style.display="none",a&&(a.style.display="none"),o.innerHTML="";const s=b.querySelector("#community-search-input"),r=b.querySelector("#community-search-clear");s&&(s.value=""),r&&(r.style.display="none"),H="";try{const{data:i,error:c}=await it.from("posts").select("*, profiles(username, avatar_url)").order("created_at",{ascending:!1});if(c)throw c;X=i||[],e.style.display="none",X.length===0?n.style.display="flex":Ue()}catch(i){console.error("[community] 加载帖子失败:",i),e.style.display="none",t.style.display="flex",b.querySelector("#community-error-msg").textContent="加载失败："+(i.message||"请检查网络后重试")}finally{Ke=!1}}function Ue(){const e=b.querySelector("#community-grid"),t=b.querySelector("#community-empty"),n=b.querySelector("#community-no-results"),a=b.querySelector("#community-search-count");if(!e)return;t.style.display="none",n&&(n.style.display="none");let o=X;if(H&&(o=X.filter(s=>{const r=(s.title||"").toLowerCase(),i=(s.content||"").toLowerCase();return r.includes(H)||i.includes(H)})),a&&(H&&X.length>0?a.textContent=`${o.length}/${X.length} 条`:a.textContent=""),o.length===0){e.innerHTML="",H?n&&(n.style.display="flex"):t.style.display="flex";return}e.innerHTML=o.map(s=>Bo(s)).join(""),e.querySelectorAll(".community-card-img").forEach(s=>{s.addEventListener("click",r=>{r.stopPropagation(),Ho(s.src)})})}function Bo(e){const t=e.profiles||{},n=We(t.username||"匿名用户"),a=t.avatar_url||"",o=We(e.title||"无标题"),s=We(e.content||""),r=e.rating||0,i=e.image_urls||[],c=Uo(e.created_at),d=a?`<img class="community-card-avatar-img" src="${tt(a)}" alt="${n}" />`:'<div class="community-card-avatar-placeholder">👤</div>',m=Array.from({length:5},(l,f)=>`<span class="community-star ${f<r?"active":""}">★</span>`).join("");let p="";return i.length>0&&(p=`<div class="community-card-images">${i.map((f,v)=>`<div class="community-card-img-wrap">
            <img class="community-card-img" src="${tt(f)}" alt="照片${v+1}" loading="lazy" />
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
          ${m}
        </div>
      </div>

      <!-- 标题 + 内容 -->
      <div class="community-card-body">
        <h3 class="community-card-title">${o}</h3>
        <p class="community-card-content">${s}</p>
      </div>

      <!-- 图片画廊 -->
      ${p}
    </div>
  `}function Ho(e){var a;(a=document.querySelector(".community-lightbox"))==null||a.remove();const t=document.createElement("div");t.className="community-lightbox",t.innerHTML=`
    <div class="community-lightbox-overlay"></div>
    <button class="community-lightbox-close">&times;</button>
    <img class="community-lightbox-img" src="${tt(e)}" alt="原图" />
  `,document.body.appendChild(t);const n=()=>t.remove();t.querySelector(".community-lightbox-overlay").addEventListener("click",n),t.querySelector(".community-lightbox-close").addEventListener("click",n),t.addEventListener("keydown",o=>{o.key==="Escape"&&n()})}async function No(e){try{const{data:t}=await it.from("profiles").select("username, avatar_url").eq("id",e).maybeSingle();return t||{username:"匿名用户",avatar_url:""}}catch{return{username:"匿名用户",avatar_url:""}}}function Uo(e){if(!e)return"";const t=Date.now(),n=new Date(e).getTime(),a=t-n,o=Math.floor(a/1e3);if(o<60)return"刚刚";const s=Math.floor(o/60);if(s<60)return`${s} 分钟前`;const r=Math.floor(s/60);if(r<24)return`${r} 小时前`;const i=Math.floor(r/24);return i<30?`${i} 天前`:`${Math.floor(i/30)} 个月前`}function Fo(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function We(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function tt(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let M=null;const ct=[];let x=null,S=null,ae=!1,se=!1,on=0,G=null;function nt(e,t="info",n=6e3){G||(G=document.createElement("div"),G.id="toast-container",G.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 24px);",document.body.appendChild(G));const a={error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"},o=a[t]||a.info,s=document.createElement("div");if(s.className="toast-notification",s.style.cssText=`position:relative;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${o};color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.5;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:toast-slide-in 0.3s ease-out;transition:opacity 0.3s ease,transform 0.3s ease;`,n>0){const i=document.createElement("button");i.textContent="×",i.style.cssText="position:absolute;top:6px;right:10px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;padding:0;",i.addEventListener("click",()=>Ct(s)),s.appendChild(i)}const r=document.createElement("span");return r.style.cssText="display:block;padding-right:22px;white-space:pre-line;",r.textContent=e,s.appendChild(r),G.appendChild(s),n>0&&setTimeout(()=>Ct(s),n),s}function Ct(e){!e||e.dataset._removing==="1"||(e.dataset._removing="1",e.style.opacity="0",e.style.transform="translateX(20px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}(function(){if(document.getElementById("toast-keyframes"))return;const t=document.createElement("style");t.id="toast-keyframes",t.textContent=`
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,document.head.appendChild(t)})();const ce=le,g=document.createElement("div");g.id="spot-sidebar";g.innerHTML=`
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
`;document.body.appendChild(g);const Do=g.querySelector(".sidebar-overlay"),Ro=g.querySelector(".sidebar-close"),Oo=g.querySelector(".hero-placeholder"),zo=g.querySelector(".hero-name"),jo=g.querySelector(".hero-desc"),_t=g.querySelector(".hero-hot-badge"),Pe=g.querySelector(".sidebar-photos-area"),ot=g.querySelector("#photo-upload-btn"),Q=g.querySelector("#photo-file-input"),I=g.querySelector("#photo-upload-status"),Ae=g.querySelector(".sidebar-comments-area"),Lt=g.querySelector("#comment-login-prompt"),K=g.querySelector("#comment-input"),z=g.querySelector("#comment-submit-btn"),q=g.querySelector("#comment-form-status"),ye=g.querySelector("#btn-like"),kt=g.querySelector("#btn-like-icon"),qt=g.querySelector("#btn-like-text"),Jo=g.querySelector("#btn-like-count"),ge=g.querySelector("#btn-fav"),$t=g.querySelector("#btn-fav-icon"),Tt=g.querySelector("#btn-fav-text"),Xo=g.querySelector("#btn-fav-count"),Ko=g.querySelector("#btn-comment-jump"),Vo=g.querySelector("#btn-comment-count");function lt(){g.classList.remove("open")}Do.addEventListener("click",lt);Ro.addEventListener("click",lt);async function Wo(e,t){lt(),Le();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
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
  `,document.body.appendChild(n);const a=n.querySelector(".spot-pioneer-overlay"),o=n.querySelector(".spot-pioneer-close"),s=n.querySelector("#pioneer-submit"),r=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),c=n.querySelector("#pioneer-desc"),d=n.querySelector(".spot-pioneer-coords");a.addEventListener("click",Le),o.addEventListener("click",Le),d.textContent="📍 正在定位...";try{const m=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,l=await(await fetch(m)).json();if(l.status==="1"&&l.regeocode){const f=l.regeocode.formatted_address||"",v=l.regeocode.addressComponent,y=(v==null?void 0:v.township)||(v==null?void 0:v.district)||(v==null?void 0:v.city)||f||"";i.placeholder=`如：${y||"此处"}`,d.textContent=`📍 ${f||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else d.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{d.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}s.addEventListener("click",async()=>{if(!F()){j();return}const m=i.value.trim(),p=c.value.trim();if(!m){r.textContent="请输入景区名称",r.style.color="rgba(255, 120, 120, 0.95)";return}if(!p){r.textContent="请写下一句话打卡心得",r.style.color="rgba(255, 120, 120, 0.95)";return}r.textContent="正在创建...",r.style.color="rgba(255, 255, 255, 0.7)",s.disabled=!0,s.textContent="⏳ 创建中...";try{const{data:l,error:f}=await ce.from("spots").insert({name:m,longitude:e,latitude:t,description:p,creator_id:S.id}).select();if(f)throw f;const v=l[0];dt(v),Le(),M.setZoomAndCenter(12,[e,t]),await De(v.id,v.name,v.description)}catch(l){console.error("[pioneer] 创建景区失败:",l),r.textContent="创建失败："+(l.message||"请检查网络后重试"),r.style.color="rgba(255, 120, 120, 0.95)",s.disabled=!1,s.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",m=>{m.key==="Enter"&&!s.disabled&&s.click()})}function Le(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function dt(e){const t=e.is_hot===!0,a=po().has(e.id),o=a?"✨ ":"",s=a?"#ff7b25":"#fff",r=a?"0 0 10px rgba(255,123,37,0.7)":"0 1px 2px rgba(0,0,0,0.8)",i=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:${s};font-size:${t?"13":"12"}px;text-shadow:${r};white-space:nowrap">${o}${t?"⭐ ":""}${re(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t,isLit:a}});i.on("click",()=>Go(i)),M.add(i),ct.push(i)}async function ke(){let e=[],t=null;try{if(gt())e=await $n();else{const a=await ce.from("spots").select("*");e=a.data||[],t=a.error}}catch(a){t=a}if(t){console.error("[main] 加载景区数据失败:",t),nt(`加载景区数据失败
地图浏览不受影响`,"error",8e3);return}Yo(),e.forEach(dt);const n=gt()?"🔥 热门景区":"📍 全部景区";Kt(e,n)}function Yo(){M.clearMap(),ct.length=0}function It(e,t,n,a,o,s){var p;if(!M)return;M.setZoomAndCenter(15,[t,n]),De(e,a,o,s);const r=ct.find(l=>{var f;return((f=l.getExtData())==null?void 0:f.id)===e});if(!r)return;const i=(p=r.getExtData())==null?void 0:p.isHot,c=r.getLabel(),d=c?c.getContent():"",m=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${re(a)}</div>`;r.setLabel({content:m,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{r.setLabel({content:d,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function Go(e){on=Date.now();const t=e.getExtData();!t||!t.id||(M.setZoomAndCenter(12,e.getPosition()),await De(t.id,t.name,t.description,t.isHot))}const Mt=new Map;async function De(e,t,n,a){x=Number(e),zo.textContent=t||"",jo.textContent=n||"暂无介绍",Oo.style.display="flex",a?_t.style.display="inline-block":_t.style.display="none";const o=Date.now(),s=Mt.get(x);(!s||o-s>3e4)&&(Mt.set(x,o),In(x).catch(r=>console.warn("[main] 浏览量更新失败:",r))),Pe.innerHTML="",Ae.innerHTML="",q.textContent="",g.classList.add("open"),an(),await Zo(),pt(x),await Re(x)}ye.addEventListener("click",async()=>{if(!S){j();return}if(x){ye.disabled=!0;try{ae?(await fn(S.id,x),ae=!1):(await mn(S.id,x),ae=!0),await we(),ut()}catch(e){console.error("[main] 点赞操作失败:",e)}finally{ye.disabled=!1}}});ge.addEventListener("click",async()=>{if(!S){j();return}if(x){ge.disabled=!0;try{se?(await vn(S.id,x),se=!1):(await hn(S.id,x),se=!0),await we(),ut()}catch(e){console.error("[main] 收藏操作失败:",e)}finally{ge.disabled=!1}}});Ko.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),F()?setTimeout(()=>K.focus(),400):j())});function ut(){ae?(kt.textContent="❤️",qt.textContent="已赞",ye.classList.add("active")):(kt.textContent="🤍",qt.textContent="点赞",ye.classList.remove("active")),se?($t.textContent="⭐",Tt.textContent="已收藏",ge.classList.add("active")):($t.textContent="☆",Tt.textContent="收藏",ge.classList.remove("active"))}async function we(){if(x)try{const[e,t,n]=await Promise.all([yn(x),bn(x),En(x)]);Jo.textContent=e>0?e:"",Xo.textContent=t>0?t:"",Vo.textContent=n>0?n:""}catch(e){console.warn("[main] 刷新计数失败:",e)}}async function Zo(){if(!S||!x)ae=!1,se=!1;else try{const[e,t]=await Promise.all([pn(S.id,x),gn(S.id,x)]);ae=e,se=t}catch(e){console.warn("[main] 刷新互动状态失败:",e)}ut(),await we()}function j(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function Pt(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),a=document.getElementById("add-submit");!e||!t||!n||!a||(F()?(e.style.display="none",t.disabled=!1,n.disabled=!1,a.disabled=!1,a.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,a.disabled=!0,a.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function an(){F()?(Lt.style.display="none",K.disabled=!1,z.disabled=!1,z.textContent="发表评论",K.placeholder="写下你的评论..."):(Lt.style.display="block",K.disabled=!0,z.disabled=!0,z.textContent="请先登录",K.placeholder="请先登录后再发表评论")}async function pt(e){const[t,n]=await Promise.allSettled([ce.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),Mn(e)]),a=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(o=>{o.photo_urls&&Array.isArray(o.photo_urls)&&o.photo_urls.forEach(s=>a.push({url:s,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(o=>a.push({url:o.url,source:"upload",id:o.id,userId:o.user_id})),Pe.innerHTML="",a.length>0){const o=document.createElement("div");o.className="photo-grid",[...new Map(a.map(r=>[r.url,r])).values()].forEach(r=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${re(r.url)}" alt="景区照片" loading="lazy" />`,r.source==="upload"&&S&&r.userId===S.id){const c=document.createElement("button");c.className="photo-delete-btn",c.textContent="×",c.title="删除此照片",c.addEventListener("click",async d=>{if(d.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await An(r.id,S.id),pt(e)}catch(m){console.error("[main] 删除照片失败:",m)}}),i.appendChild(c)}o.appendChild(i)}),Pe.appendChild(o)}else Pe.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}ot.addEventListener("click",()=>{if(!S){j();return}x&&Q.click()});Q.addEventListener("change",async()=>{const e=Q.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){I.textContent="仅支持 JPG / PNG / WEBP 格式",I.style.color="rgba(255, 80, 80, 0.95)",Q.value="";return}if(e.size>5*1024*1024){I.textContent="图片不能超过 5MB",I.style.color="rgba(255, 80, 80, 0.95)",Q.value="";return}I.textContent="正在上传...",I.style.color="rgba(255, 255, 255, 0.7)",ot.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),a=Date.now(),o=`${S.id}/${x}/${a}.${n}`,{error:s}=await ce.storage.from("spot-images").upload(o,e,{upsert:!1});if(s)throw s;const{data:r}=ce.storage.from("spot-images").getPublicUrl(o),i=r.publicUrl;await Pn(x,S.id,o,i),I.textContent="上传成功！",I.style.color="rgba(80, 230, 140, 0.95)",await pt(x),setTimeout(()=>{I.textContent=""},2e3)}catch(n){console.error("[main] 上传照片失败:",n),I.textContent="上传失败："+(n.message||"未知错误"),I.style.color="rgba(255, 80, 80, 0.95)"}finally{ot.disabled=!1,Q.value=""}});async function Re(e){let t;try{t=await wn(e)}catch(o){console.warn("[main] 加载评论失败:",o),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),Ae.innerHTML="",t.length===0){Ae.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const a=document.createElement("div");a.className="comment-list",t.forEach(o=>{const s=Qo(o.created_at),r=o.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.user_id)}`,i=S&&o.user_id===S.id,c=document.createElement("div");c.className="comment-bubble",c.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${re(r)}" alt="" />
        <span class="comment-author-name">${re(o.username)}</span>
        <span class="comment-time">${s}</span>
        ${i?`<button class="comment-delete-btn" data-id="${o.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${re(o.content)}</div>
    `,a.appendChild(c)}),Ae.appendChild(a),a.querySelectorAll(".comment-delete-btn").forEach(o=>{o.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const s=Number(o.dataset.id);o.disabled=!0;try{await Sn(s,S.id),await Re(e),await we()}catch(r){console.error("[main] 删除评论失败:",r),o.disabled=!1}})})}function Qo(e){if(!e)return"";const t=new Date(e),a=new Date-t,o=Math.floor(a/6e4);if(o<1)return"刚刚";if(o<60)return`${o}分钟前`;const s=Math.floor(o/60);if(s<24)return`${s}小时前`;const r=Math.floor(s/24);return r<30?`${r}天前`:t.toLocaleDateString("zh-CN")}function re(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}z.addEventListener("click",async()=>{if(!x){q.textContent="请先点击地球上的景区",q.style.color="rgba(255, 80, 80, 0.95)";return}if(!F()){j();return}const e=K.value.trim();if(!e){q.textContent="请输入评论内容",q.style.color="rgba(255, 80, 80, 0.95)";return}q.textContent="正在发表...",q.style.color="rgba(255, 255, 255, 0.8)",z.disabled=!0;try{await xn(S.id,x,e)}catch(t){console.error("[main] 发表评论失败:",t),q.textContent="发表失败："+t.message,q.style.color="rgba(255, 80, 80, 0.95)",z.disabled=!1;return}q.textContent="发表成功！",q.style.color="rgba(80, 230, 140, 0.95)",K.value="",await Re(x),await we(),z.disabled=!1,setTimeout(()=>{q.textContent=""},2e3)});const U=document.createElement("div");U.id="add-form";U.innerHTML=`
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
`;document.body.appendChild(U);const k=U.querySelector(".add-form-status"),ea=U.querySelector("#add-submit");ea.addEventListener("click",async()=>{if(!F()){j();return}const e=U.querySelector("#field-address").value.trim(),t=U.querySelector("#field-desc").value.trim();if(!e||!t){k.textContent="请完整填写所有字段",k.style.color="rgba(255, 80, 80, 0.95)";return}k.textContent="正在查询地址...",k.style.color="rgba(255, 255, 255, 0.8)";let n,a;try{const i=await ao(e);n=i.longitude,a=i.latitude}catch(i){console.error("[main] 高德地理编码失败:",i),k.textContent="查询失败："+i.message,k.style.color="rgba(255, 80, 80, 0.95)";return}k.textContent="正在保存...",k.style.color="rgba(255, 255, 255, 0.8)";const{data:o,error:s}=await ce.from("spots").insert({name:e,longitude:n,latitude:a,description:t,creator_id:S.id}).select();if(s){console.error("[main] 添加景区失败:",s),k.textContent="添加失败："+s.message,k.style.color="rgba(255, 80, 80, 0.95)";return}k.textContent="添加成功！",k.style.color="rgba(80, 230, 140, 0.95)",U.querySelector("#field-address").value="",U.querySelector("#field-desc").value="";const r=o[0];dt(r),M.setZoomAndCenter(12,[r.longitude,r.latitude]),setTimeout(()=>{k.textContent=""},2e3)});async function ta(){console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e),nt("⚠️ 地图服务加载失败，请刷新页面","error",0);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),M=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),M.on("click",e=>{Date.now()-on<300||Wo(e.lnglat.getLng(),e.lnglat.getLat())}),vo({onSpotClick:It}),xo({onSpotClick:It}),To(),so(),Io(),Eo(e=>{switch(e){case"home":ht(!1),ke();break;case"community":Mo();break;case"hot":ht(!0),ke();break;case"ranking":ho(Tn);break;case"favorites":case"profile":F()?zn():j();break}}),console.log("[调试步骤3/6] 🔐 初始化认证模块...");try{await Un(),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e),nt(`⚠️ 认证服务初始化失败
地图浏览不受影响`,"warn",1e4)}console.log("[调试步骤4/6] 🗄️ 初始化数据库..."),un(),console.log("[调试步骤4/6] ✅ 数据库初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange..."),Fn((e,t)=>{if(S=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}Pt(),mo().then(()=>ke()),x&&g.classList.contains("open")&&(an(),Re(x))}),console.log("[调试步骤5/6] ✅ onAuthChange 就绪"),console.log("[调试步骤6/6] 📍 加载景区数据..."),Pt(),ke(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:a,name:o,description:s}=e.detail;M.setZoomAndCenter(14,[n,a]),De(t,o,s,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}ta();
