(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const Pt="7dfc44451d8128e329100a0c71fa90b6",Bt="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:Bt};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(Pt)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});const mt="https://dxygnktgxycdqxipvjdj.supabase.co",Ht="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA",Nt=window.supabase.createClient(mt,Ht,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[supabaseClient] 硬编码直连模式初始化完成:",mt);const Ce=Nt;let C=null,c=null,x=null,P=!0,$e=new Set,qe=null;const m={get isLoggedIn(){return!!c},get loading(){return P},get user(){return c},get profile(){return x},get supabase(){return C},async init(){if(C)return console.warn("[authStore] 已初始化，跳过重复调用"),qe;C=Ce;const t=setTimeout(()=>{P&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",C!=null&&C.auth?"getSession":"未初始化"),P=!1,V())},3e3),{data:n}=C.auth.onAuthStateChange(Ut);return n==null||n.subscription,qe=C.auth.getSession().then(async({data:{session:a}})=>{clearTimeout(t);const o=(a==null?void 0:a.user)??null;c&&o&&c.id===o.id||(c=o,c?await ft():x=null),P=!1,V()}).catch(a=>{clearTimeout(t),console.error("[authStore] getSession 失败:",a),P=!1,V()}),qe},async signIn(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:a}=await X(C.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(a)throw a;return n},async signUp(e,t){if(!C)throw new Error("Supabase 客户端未初始化");const{data:n,error:a}=await X(C.auth.signUp({email:e,password:t}),15e3,"注册请求超时，请检查网络后重试");if(a)throw a;return n},async signOut(){if(C){try{await X(C.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}c=null,x=null,V()}},async updateProfile(e){if(!c)throw new Error("未登录");const{data:t,error:n}=await C.from("profiles").update(e).eq("id",c.id).select("*").single();if(n)throw n;return x=t,V(),t},subscribe(e){$e.add(e);try{e(ht())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{$e.delete(e)}},getAvatarUrl(){return x!=null&&x.avatar_url?x.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(c==null?void 0:c.id)||"default"}`},getDisplayName(){var e,t;return(x==null?void 0:x.username)||((e=c==null?void 0:c.user_metadata)==null?void 0:e.username)||((t=c==null?void 0:c.email)==null?void 0:t.split("@")[0])||"用户"}};async function Ut(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const a=(t==null?void 0:t.user)??null,o=c&&a&&c.id!==a.id||!c&&a||c&&!a;c=a,c&&o?await ft():c||(x=null)}catch(a){console.error("[authStore] onAuthStateChange 处理异常:",a),x=c?oe():null}P&&(P=!1),V()}async function ft(){var n,a,o,r,s;if(!c)return;let e,t;try{const i=await X(C.from("profiles").select("*").eq("id",c.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),x=oe();return}if(t){const i=t==null?void 0:t.code,l=(t==null?void 0:t.hint)||"";i==="PGRST301"||l.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):l.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),x=oe();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((a=c.user_metadata)==null?void 0:a.nickname)||((o=c.user_metadata)==null?void 0:o.username)||((r=c.email)==null?void 0:r.split("@")[0])||"";try{const l=await X(C.from("profiles").upsert({id:c.id,username:i,avatar_url:((s=c.user_metadata)==null?void 0:s.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(l.error){console.warn("[authStore] 自动创建 profile 失败:",l.error.message,"| code:",l.error.code),x=oe();return}try{const d=await X(C.from("profiles").select("*").eq("id",c.id).maybeSingle(),5e3,"profiles 二次查询超时");if(d.error)console.warn("[authStore] 二次查询 profile 出错:",d.error.message);else if(d.data){x=d.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(d){console.warn("[authStore] 二次查询 profile 异常:",d.message)}}catch(l){console.warn("[authStore] 自动创建 profile 异常:",l.message)}x=oe();return}x=e}function oe(){var e,t,n;return c?{id:c.id,username:((e=c.user_metadata)==null?void 0:e.username)||((t=c.email)==null?void 0:t.split("@")[0])||"",avatar_url:((n=c.user_metadata)==null?void 0:n.avatar_url)||null,bio:""}:null}function V(){const e=ht();$e.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function ht(){return{user:c,profile:x,loading:P}}function X(e,t,n){return Promise.race([e,new Promise((a,o)=>setTimeout(()=>o(new Error(n)),t))])}let f=null;function Ft(){f=Ce}async function Dt(e,t){const{count:n,error:a}=await f.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(a)throw a;return n>0}async function Rt(e,t){try{const{data:n,error:a}=await f.from("likes").insert({user_id:e,spot_id:t});if(a)throw a;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(U(n,"点赞失败，请检查权限或重试"))}}async function Ot(e,t){try{const{data:n,error:a}=await f.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(U(n,"取消点赞失败，请检查权限或重试"))}}async function zt(e){const{count:t,error:n}=await f.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function jt(e,t){const{count:n,error:a}=await f.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(a)throw a;return n>0}async function Jt(e,t){try{const{data:n,error:a}=await f.from("favorites").insert({user_id:e,spot_id:t});if(a)throw a;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(U(n,"收藏失败，请检查权限或重试"))}}async function Kt(e,t){try{const{data:n,error:a}=await f.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(U(n,"取消收藏失败，请检查权限或重试"))}}async function Vt(e){const{count:t,error:n}=await f.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Zt(e){const{data:t,error:n}=await f.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Wt(e,t,n){try{const{data:a,error:o}=await f.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(o)throw o;return a}catch(a){throw console.error("[db] addComment 失败:",a),new Error(U(a,"评论发表失败，请检查权限或重试"))}}async function Xt(e,t){try{const{data:n,error:a}=await f.from("comments").delete().eq("id",e).eq("user_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(U(n,"评论删除失败，请检查权限或重试"))}}async function Yt(e){const{count:t,error:n}=await f.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Gt(e){const{count:t,error:n}=await f.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function Qt(e){const{count:t,error:n}=await f.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function en(e){const{data:t,error:n}=await f.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((a,o)=>a+(o.views||0),0)}async function tn(e){const{data:t,error:n}=await f.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function nn(e){const{data:t,error:n}=await f.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function on(){const{data:e,error:t}=await f.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function an(e=10){const{data:t,error:n}=await f.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function rn(e){const{error:t}=await f.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await f.from("spots").select("views").eq("id",e).maybeSingle(),a=((n==null?void 0:n.views)||0)+1;await f.from("spots").update({views:a}).eq("id",e)}}async function sn(e){const{data:t,error:n}=await f.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function ln(e,t,n,a){try{const{data:o,error:r}=await f.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:a}).select();if(r)throw r;return o}catch(o){throw console.error("[db] saveSpotImage 失败:",o),new Error(U(o,"图片保存失败，请检查存储权限或重试"))}}async function cn(e,t){try{const{data:n,error:a}=await f.from("spot_images").delete().eq("id",e).eq("user_id",t);if(a)throw a;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(U(n,"图片删除失败，请检查权限或重试"))}}function U(e,t){const n=e==null?void 0:e.code,a=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:a.includes("JWT")?"认证已过期，请重新登录":a.includes("network")||a.includes("fetch")?"网络连接异常，请检查网络":a.includes("timeout")||a.includes("超时")?"请求超时，请检查网络后重试":t}async function dn(){await m.init(),yn(),m.subscribe(e=>{bt(e)})}function un(e){return m.subscribe(({user:t,profile:n})=>{e(t,n)})}function z(){return m.isLoggedIn}async function pn(e,t){return m.signIn(e,t)}async function mn(e,t){return m.signUp(e,t)}async function yt(){return m.signOut()}async function fn(e){return m.updateProfile(e)}function hn(){vt()}let J=null;function Ee(e,t="success",n=3e3){J||(J=document.createElement("div"),J.id="auth-toast-container",J.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;",document.body.appendChild(J));const a={success:"rgba(16,185,129,0.92)",error:"rgba(239,68,68,0.92)",info:"rgba(59,130,246,0.92)"},o=document.createElement("div");o.style.cssText=`background:${a[t]||a.info};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;text-align:center;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:auth-toast-in 0.3s ease-out;transition:opacity 0.25s ease,transform 0.25s ease;`,o.textContent=e,J.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-12px)",setTimeout(()=>o.remove(),250)},n)}(function(){if(document.getElementById("auth-toast-styles"))return;const t=document.createElement("style");t.id="auth-toast-styles",t.textContent="@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}",document.head.appendChild(t)})();function yn(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{m.isLoggedIn?qn():Ln("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{Te(),await yt()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{Te(),gt()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&Te()}),gn(),vn(),Sn(),bn(),bt({user:m.user})}function gn(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",ue),e.querySelector(".auth-modal-close").addEventListener("click",ue),e.querySelector("#auth-switch-register").addEventListener("click",()=>fe("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>fe("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,a=e.querySelector("#auth-login-error"),o=e.querySelector("#auth-login-submit");if(!t||!n){a.textContent="请填写邮箱和密码";return}if(!m.supabase){a.textContent="服务未初始化，请刷新页面";return}a.textContent="",o.disabled=!0,o.textContent="登录中...";try{await pn(t,n),ue(),We()}catch(r){a.textContent=Ae(r.message)}finally{o.disabled=!1,o.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),a=e.querySelector("#auth-register-password").value,o=e.querySelector("#auth-register-error"),r=e.querySelector("#auth-register-submit");if(!t){o.textContent="请输入你的昵称",o.style.color="";return}if(!n){o.textContent="请输入邮箱地址",o.style.color="";return}if(!a){o.textContent="请输入密码",o.style.color="";return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){o.textContent="邮箱格式不正确，请检查后重试",o.style.color="";return}if(a.length<6){o.textContent="密码至少需要6位，请重新设置",o.style.color="";return}if(t.length>50){o.textContent="昵称不能超过50个字符",o.style.color="";return}if(!m.supabase){o.textContent="服务未初始化，请刷新页面",o.style.color="";return}o.textContent="",o.style.color="",r.disabled=!0,r.textContent="注册中...";try{const{user:s,session:i}=await mn(n,a);if(i){if(t)try{await m.updateProfile({username:t})}catch(g){console.warn("[auth] 注册后更新 profile 昵称失败（非致命）:",g)}o.style.color="rgba(80, 230, 140, 0.95)",o.textContent="🎉 注册成功！已为您自动登录系统。";const l=t||n.split("@")[0]||"用户";Ee(`🎉 注册成功！已为您自动登录系统。
欢迎加入旅行地球，${l}！`,"success",3500);const d=setTimeout(()=>{ue(),We(),delete e.dataset._registerTimer},1200);e.dataset._registerTimer=String(d)}else{o.style.color="rgba(100, 200, 255, 0.95)",o.textContent=`📧 注册成功！请查看邮箱中的确认链接完成验证。
（如未收到，请检查垃圾邮件箱）`;const l=setTimeout(()=>{o.style.color="",fe("login"),delete e.dataset._registerTimer},3500);e.dataset._registerTimer=String(l)}}catch(s){console.error("Supabase注册深度报错对象:",s),console.error("  · message:",s==null?void 0:s.message),console.error("  · status:",s==null?void 0:s.status),console.error("  · code:",s==null?void 0:s.code),console.error("  · stack:",s==null?void 0:s.stack);const i=Ae(s.message);o.style.color="",o.textContent=`${i}
[错误码: ${(s==null?void 0:s.status)||"未知"} | ${(s==null?void 0:s.code)||"N/A"}]`}finally{r.disabled=!1,r.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function vn(){let e=!1,t="";const n=document.createElement("div");n.id="edit-profile-modal",n.className="auth-modal",n.innerHTML=`
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
  `,document.body.appendChild(n),n.querySelector("#edit-avatar-label");const a=n.querySelector("#edit-avatar-img"),o=n.querySelector("#edit-avatar-hover"),r=n.querySelector("#edit-avatar-hover-text"),s=n.querySelector("#edit-avatar-uploading"),i=n.querySelector("#edit-avatar-file"),l=n.querySelector("#edit-avatar-url"),d=n.querySelector("#edit-display-name"),g=n.querySelector("#edit-bio"),h=n.querySelector("#edit-profile-error"),S=n.querySelector("#edit-profile-submit"),v=n.querySelector("#edit-avatar-hint");function b(w){w?(a.src=w,a.style.display="block",r.textContent="更换头像"):(a.src="",a.style.display="none",r.textContent="设置头像"),o.style.display="",s.style.display="none",e=!1}i.addEventListener("change",async()=>{var te;const w=i.files[0];if(!w)return;const j=5*1024*1024;if(w.size>j){h.textContent="图片不能超过 5MB，请重新选择",i.value="";return}h.textContent="",o.style.display="none",s.style.display="flex",e=!0;try{const I=((te=m.user)==null?void 0:te.id)||"anonymous",At=w.name.split(".").pop()||"jpg",Ve=`${I}-${Date.now()}.${At}`,{error:Ze}=await m.supabase.storage.from("avatars").upload(Ve,w,{upsert:!0});if(Ze)throw Ze;const{data:Le}=m.supabase.storage.from("avatars").getPublicUrl(Ve),de=(Le==null?void 0:Le.publicUrl)||"";if(!de)throw new Error("获取头像 URL 失败");t=de,l.value=de,b(de),v.textContent="头像上传成功 ✓",v.style.color="rgba(80,230,140,0.9)"}catch(I){console.error("[auth] 头像上传失败:",I),h.textContent="头像上传失败："+(I.message||"请检查网络或存储桶权限"),b(t),v.textContent="点击头像更换图片",v.style.color=""}finally{i.value=""}}),n.querySelector(".auth-modal-overlay").addEventListener("click",()=>{n.classList.remove("open")}),n.querySelector(".auth-modal-close").addEventListener("click",()=>{n.classList.remove("open")}),S.addEventListener("click",async()=>{const w=d.value.trim(),j=g.value.trim(),te=l.value.trim();if(!w){h.textContent="显示名称不能为空";return}if(e){h.textContent="头像正在上传中，请稍候...";return}h.textContent="",S.disabled=!0,S.textContent="保存中...";try{const I={username:w,bio:j||"",updated_at:new Date().toISOString()};te&&(I.avatar_url=te),await fn(I),n.classList.remove("open"),Ee("✅ 资料保存成功","success",2e3)}catch(I){h.textContent="保存失败："+I.message}finally{S.disabled=!1,S.textContent="保存"}}),n._setAvatarUrl=function(w){t=w||"",l.value=t,b(t),v.textContent="点击头像更换图片",v.style.color=""},n._setDisplayName=function(w){d.value=w||""},n._setBio=function(w){g.value=w||""},n._clearError=function(){h.textContent=""}}function bn(){const e=document.createElement("div");e.id="change-password-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")});const t=e.querySelector("#change-pw-new"),n=e.querySelector("#change-pw-strength");t.addEventListener("input",()=>{const a=t.value;if(!a){n.style.display="none";return}n.style.display="block";const o=xn(a);o<2?(n.textContent="🔴 密码强度：弱",n.style.color="rgba(255, 120, 120, 0.9)"):o<4?(n.textContent="🟡 密码强度：中等",n.style.color="rgba(251, 191, 36, 0.9)"):(n.textContent="🟢 密码强度：强",n.style.color="rgba(80, 230, 140, 0.9)")}),e.querySelector("#change-pw-submit").addEventListener("click",async()=>{const a=t.value,o=e.querySelector("#change-pw-confirm").value,r=e.querySelector("#change-pw-error"),s=e.querySelector("#change-pw-submit");if(!a){r.textContent="请输入新密码",r.style.color="";return}if(a.length<6){r.textContent="新密码至少需要6位",r.style.color="";return}if(!o){r.textContent="请再次输入新密码进行确认",r.style.color="";return}if(a!==o){r.textContent="两次输入的密码不一致，请检查后重试",r.style.color="";return}if(!m.supabase){r.textContent="服务未初始化，请刷新页面后重试",r.style.color="";return}r.textContent="",r.style.color="",s.disabled=!0,s.textContent="修改中...";try{const{data:i,error:l}=await m.supabase.auth.updateUser({password:a});if(l)throw l;r.style.color="rgba(80, 230, 140, 0.95)",r.textContent="🔐 密码修改成功！",Ee("🔐 密码修改成功！下次登录请使用新密码。","success",3500),setTimeout(()=>{e.classList.remove("open"),t.value="",e.querySelector("#change-pw-confirm").value="",n.style.display="none",r.textContent="",r.style.color=""},1500)}catch(i){const l=Ae(i.message);r.style.color="",r.textContent=l,console.error("[auth] 修改密码失败:",i.message,"| 原始错误:",i)}finally{s.disabled=!1,s.textContent="确认修改"}}),e.addEventListener("keydown",a=>{if(a.key==="Enter"){const o=e.querySelector("#change-pw-submit");o&&!o.disabled&&o.click()}})}function wn(){const e=document.getElementById("change-password-modal");if(!e)return;e.querySelector("#change-pw-new").value="",e.querySelector("#change-pw-confirm").value="";const t=e.querySelector("#change-pw-strength");t&&(t.style.display="none");const n=e.querySelector("#change-pw-error");n&&(n.textContent="",n.style.color=""),e.classList.add("open")}function xn(e){let t=0;return e.length>=6&&t++,e.length>=10&&t++,/[0-9]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[!@#$%^&*(),.?":{}|<>]/.test(e)&&t++,t}function gt(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=m.profile;e._setAvatarUrl((t==null?void 0:t.avatar_url)||""),e._setDisplayName((t==null?void 0:t.username)||""),e._setBio((t==null?void 0:t.bio)||""),e._clearError(),e.classList.add("open")}function Sn(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),gt()}),e.querySelector("#pc-btn-change-pw").addEventListener("click",()=>{e.classList.remove("open"),wn()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await yt(),Ee("👋 已退出登录","info",2e3)}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function vt(){var r;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),a=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),a.style.display="none",e.classList.add("open"),m.loading){n&&(n.textContent="正在验证身份令牌...");const s=Date.now(),i=5e3,l=100;try{await new Promise((d,g)=>{const h=setInterval(()=>{m.loading?Date.now()-s>i&&(clearInterval(h),g(new Error("timeout"))):(clearInterval(h),d())},l)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!m.isLoggedIn){n&&(n.textContent="请先登录");return}const o=m.user.id;n&&(n.textContent="📡 数据传送中...");try{const s=await Promise.allSettled([ne(Gt(o),8e3,"足迹统计"),ne(Qt(o),8e3,"点赞统计"),ne(en(o),8e3,"浏览量统计"),ne(tn(o),8e3,"足迹列表"),ne(nn(o),8e3,"收藏列表")]),i=(v,b,w)=>{var j;return v.status==="fulfilled"?v.value:(console.warn(`[profile-center] ⚠️ ${w} 加载失败，使用默认值`,((j=v.reason)==null?void 0:j.message)||v.reason),b)},l=i(s[0],0,"足迹统计"),d=i(s[1],0,"点赞统计"),g=i(s[2],0,"浏览量统计"),h=i(s[3],[],"足迹列表"),S=i(s[4],[],"收藏列表");Cn(e,{avatarUrl:m.getAvatarUrl(),displayName:m.getDisplayName(),bio:((r=m.profile)==null?void 0:r.bio)||"",spotCount:l,likeCount:d,views:g,spots:h,favorites:S})}catch(s){console.error("[profile-center] 加载统计失败:",s),En(e);return}t.style.display="none",a.style.display="flex"}function Cn(e,t){const{avatarUrl:n,displayName:a,bio:o,spotCount:r,likeCount:s,views:i,spots:l,favorites:d}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=a,e.querySelector("#pc-bio").textContent=o||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=r??0,e.querySelector("#pc-stat-likes").textContent=s??0,e.querySelector("#pc-stat-views").textContent=i??0,_n(e,l),kn(e,d)}function En(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const a=t.querySelector("#pc-retry-btn");a&&a.addEventListener("click",()=>vt())}function ne(e,t,n){return Promise.race([e,new Promise((a,o)=>setTimeout(()=>o(new Error(`${n} 请求超时`)),t))])}function _n(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(a=>{const o=document.createElement("div");o.className="pc-footprint-item",o.innerHTML=`
      <span class="pc-footprint-name">📍 ${Fe(a.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,o.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a.id,lng:a.longitude,lat:a.latitude,name:a.name,description:a.description||""}}))}),n.appendChild(o)})}}function kn(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(a=>{const o=a.spots,r=(o==null?void 0:o.id)??a.spot_id;if(!r)return;const s=o!=null&&o.name?`⭐ ${Fe(o.name)}`:`⭐ 景点 #${r}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${s}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:r,lng:(o==null?void 0:o.longitude)??0,lat:(o==null?void 0:o.latitude)??0,name:(o==null?void 0:o.name)||`景点 #${r}`,description:(o==null?void 0:o.description)||""}}))}),n.appendChild(i)})}}function Ln(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),fe(e))}function ue(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function fe(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const a=document.getElementById("auth-login-error"),o=document.getElementById("auth-register-error");a&&(a.textContent=""),o&&(o.textContent="",o.style.color="")}function We(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),a=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),a&&(a.value="");const o=document.getElementById("auth-login-error"),r=document.getElementById("auth-register-error");o&&(o.textContent=""),r&&(r.textContent="",r.style.color="")}function bt(e){var a;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const o=m.getDisplayName(),r=((a=o[0])==null?void 0:a.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${r}</span>
        <span class="auth-user-label">${Fe(o)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function qn(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function Te(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function Ae(e){if(!e)return"未知错误，请稍后重试";const t=e.toLowerCase();return t.includes("already registered")||t.includes("already exists")||t.includes("already been registered")||t.includes("user already registered")?"该邮箱已被注册，请直接登录或使用其他邮箱":t.includes("password should be at least")||t.includes("密码至少需要")?"密码至少需要6位，请重新设置":t.includes("weak password")||t.includes("password is too weak")?"密码强度不足，请使用至少6位的密码（建议包含字母和数字）":t.includes("invalid email")||t.includes("invalid_email")||t.includes("邮箱格式")?"邮箱格式不正确，请检查后重试":t.includes("email rate limit")||t.includes("too many requests")||t.includes("操作过于频繁")?"操作过于频繁，请等待60秒后再试":t.includes("email not confirmed")?"该邮箱尚未完成验证，请先点击确认邮件中的链接":t.includes("signup disabled")||t.includes("registration disabled")?"注册功能暂未开放，请联系管理员":t.includes("banned")||t.includes("disabled")||t.includes("blocked")?"该账号已被禁用，请联系管理员":t.includes("invalid login credentials")||t.includes("invalid credentials")||t.includes("invalid login")||t.includes("邮箱或密码错误")?"邮箱或密码错误，请检查后重试":t.includes("user not found")?"该邮箱尚未注册，请先创建账号":t.includes("same password")||t.includes("password is the same")?"新密码不能与当前密码相同，请更换一个":t.includes("password too short")||t.includes("password must be")?"新密码长度不足，至少需要6位":t.includes("password too weak")||t.includes("password is not strong")?"新密码强度不足，请使用包含字母和数字的密码":t.includes("new password")&&t.includes("required")?"请输入新密码":t.includes("超时")||t.includes("timeout")?"请求超时，请检查网络连接后重试":t.includes("网络")||t.includes("network")||t.includes("fetch")?"网络连接异常，请检查网络后重试":t.includes("abort")||t.includes("取消")?"请求已取消，请重试":t.includes("internal server error")||t.includes("500")?"服务器繁忙，请稍后再试":t.includes("service unavailable")||t.includes("503")?"服务暂不可用，请稍后再试":t.includes("请填写")||t.includes("请输入")||t.includes("至少需要")?e:(console.warn("[auth] 未匹配到中文翻译的错误消息:",e),`操作失败：${e}`)}function Fe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Tn="7dfc44451d8128e329100a0c71fa90b6";async function In(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(Tn)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(d){throw console.error("[geocodeService] 网络请求失败:",d),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let a;try{a=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(a.status!=="1")throw new Error(`高德 API 返回错误: ${a.info||"未知错误"} (status=${a.status})`);if(!a.geocodes||a.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const o=a.geocodes[0],[r,s]=o.location.split(","),i=parseFloat(r),l=parseFloat(s);if(isNaN(i)||isNaN(l))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${l}`),{longitude:i,latitude:l,formattedAddress:o.formatted_address||e}}let wt=!1,se=null,B=null,De=!1,L=null,M=null,le=!1;function Xe(){return wt}function xt(){const e=document.createElement("div");return e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
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
  `,e.querySelector(".spot-list-close").addEventListener("click",Pe),e.addEventListener("click",t=>{t.target===e&&Pe()}),e}function St(){L&&(M=L.querySelector("#spot-list-toggle"),M&&M.addEventListener("click",e=>{e.stopPropagation(),le?Pe():Mn()}))}function Mn(){L&&(L.classList.add("open"),le=!0,Re())}function Re(){if(!M)return;const e=M.querySelector(".spot-list-toggle-arrow");le?(e.style.transform="rotate(180deg)",M.title="收起景区列表",M.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",M.title="展开景区列表",M.classList.remove("spot-list-toggle--open"))}function $n(e,t){L||(L=xt(),document.body.appendChild(L),St());const n=document.getElementById("spot-list-title"),a=document.getElementById("spot-list-count"),o=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),a&&(a.textContent=e?`${e.length} 个`:""),!e||e.length===0?o&&(o.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):o&&(o.innerHTML=e.map(r=>`
        <div class="spot-list-item" data-spot-id="${r.id}"
             data-lng="${r.longitude}" data-lat="${r.latitude}"
             data-name="${xe(r.name)}"
             data-desc="${xe(r.description||"")}"
             data-is-hot="${r.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${we(r.name)}</span>
            <span class="spot-list-item-city">${we(r.city||r.address||"")}</span>
          </div>
          ${r.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
        </div>
      `).join(""),o.querySelectorAll(".spot-list-item").forEach(r=>{r.addEventListener("click",()=>{const s=Number(r.dataset.spotId),i=parseFloat(r.dataset.lng),l=parseFloat(r.dataset.lat),d=r.dataset.name,g=r.dataset.desc,h=r.dataset.isHot==="1";se&&se(s,i,l,d,g,h)})})),L.classList.add("open"),le=!0,Re()}function Pe(){L&&L.classList.remove("open"),le=!1,Re()}function Ct(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",Et),e}async function An(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((a,o)=>`
      <div class="hot-ranking-item" data-spot-id="${a.id}"
           data-lng="${a.longitude}" data-lat="${a.latitude}"
           data-name="${xe(a.name)}"
           data-desc="${xe(a.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${o<3?"hot-ranking-index--top":""}">${o+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${o<3?"⭐ ":""}${we(a.name)}</span>
          <span class="hot-ranking-city">${we(a.city||a.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${a.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(a=>{a.addEventListener("click",()=>{const o=Number(a.dataset.spotId),r=parseFloat(a.dataset.lng),s=parseFloat(a.dataset.lat),i=a.dataset.name,l=a.dataset.desc;se&&se(o,r,s,i,l,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function Pn(){B||(B=Ct(),document.body.appendChild(B)),B.classList.add("open"),De=!0}function Et(){B&&B.classList.remove("open"),De=!1}function Ye(e){wt=e}function Bn(e){De?Et():(Pn(),An(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function Hn(e={}){se=e.onSpotClick||null,L=xt(),document.body.appendChild(L),St(),B=Ct(),document.body.appendChild(B)}function we(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function xe(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let _t=null,Be=null,Ge=null,R=[],pe=null,E=null,$=null;function Nn(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function Qe(e){const t=$;if(!t)return;const n=e.trim();if(!n||n.length<1){R=[],He();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:a,error:o}=await _t.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(o){console.error("[searchSpot] 查询失败:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}R=a||[],He()}catch(a){console.error("[searchSpot] 搜索异常:",a),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function He(){const e=$;if(e){if(R.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=R.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${tt(t.name)}"
         data-desc="${tt(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${et(t.name)}</span>
        <span class="spot-search-item-city">${et(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>kt(t))})}}function kt(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),a=parseFloat(e.dataset.lat),o=e.dataset.name,r=e.dataset.desc,s=e.dataset.isHot==="1";he(),E&&(E.value="",ye(!1)),Be&&Be(t,n,a,o,r,s)}function he(){$&&($.classList.remove("open"),$.innerHTML=""),R=[]}function ye(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function Un(e={}){_t=Ce,Be=e.onSpotClick||null,pe=Nn(),document.body.appendChild(pe),E=document.getElementById("spot-search-input"),$=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");E&&(E.addEventListener("input",()=>{const n=E.value;ye(n.length>0),clearTimeout(Ge),Ge=setTimeout(()=>Qe(n),300)}),E.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),R.length>0)){const a=$==null?void 0:$.querySelector(".spot-search-item");a&&kt(a)}n.key==="Escape"&&(he(),E.value="",ye(!1))}),E.addEventListener("focus",()=>{R.length>0?He():E.value.trim()&&Qe(E.value)})),t&&t.addEventListener("click",()=>{E&&(E.value="",E.focus()),he(),ye(!1)}),document.addEventListener("click",n=>{pe&&!pe.contains(n.target)&&he()})}function et(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function tt(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Ie=window.innerWidth<768,ge=[],Se=null,ie=null,H=null,O=!1;const Lt=768,Fn=1024;function qt(){const e=window.innerWidth;return e<Lt?"mobile":e<Fn?"tablet":"desktop"}function Dn(e){if(typeof e=="function")return ge.push(e),()=>{ge=ge.filter(t=>t!==e)}}function Tt(e){ge.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function Rn(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
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
      <button class="nav-link" data-action="hot">🔥 热门景区</button>
      <button class="nav-link" data-action="ranking">🏆 排行榜</button>
      <button class="nav-link" data-action="favorites">⭐ 收藏</button>
      <button class="nav-link" data-action="profile">👤 个人中心</button>
    </div>
  `,e}function On(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
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
  `,e}function zn(){O||(O=!0,H.classList.add("open"),ie.classList.add("active"),document.body.style.overflow="hidden")}function W(){O&&(O=!1,H.classList.remove("open"),ie.classList.remove("active"),document.body.style.overflow="")}function jn(e){W(),Tt(e)}function Jn(){if(!ie||!H||!Se)return;ie.addEventListener("click",()=>{O?W():zn()});const e=H.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",W);const t=H.querySelector(".menu-drawer-close");t&&t.addEventListener("click",W);const n=Se.querySelectorAll("[data-action]"),a=H.querySelectorAll("[data-action]");n.forEach(o=>{o.addEventListener("click",()=>{const r=o.dataset.action;r&&Tt(r)})}),a.forEach(o=>{o.addEventListener("click",()=>{const r=o.dataset.action;r&&jn(r)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&O&&W()})}let nt=null;function Kn(){clearTimeout(nt),nt=setTimeout(()=>{const e=Ie;Ie=window.innerWidth<Lt,e&&!Ie&&O&&W(),It()},150)}function It(){const e=qt();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function Vn(){It(),Se=Rn(),document.body.insertBefore(Se,document.body.firstChild),H=On(),document.body.appendChild(H),ie=document.getElementById("nav-hamburger"),Jn(),window.addEventListener("resize",Kn),console.log("[responsive] 响应式模块初始化完成，当前设备:",qt())}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let T=null;const Oe=[];let p=null,y=null,Y=!1,G=!1,Mt=0,K=null;function Ne(e,t="info",n=6e3){K||(K=document.createElement("div"),K.id="toast-container",K.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 24px);",document.body.appendChild(K));const a={error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"},o=a[t]||a.info,r=document.createElement("div");if(r.className="toast-notification",r.style.cssText=`position:relative;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${o};color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.5;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:toast-slide-in 0.3s ease-out;transition:opacity 0.3s ease,transform 0.3s ease;`,n>0){const i=document.createElement("button");i.textContent="×",i.style.cssText="position:absolute;top:6px;right:10px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;padding:0;",i.addEventListener("click",()=>ot(r)),r.appendChild(i)}const s=document.createElement("span");return s.style.cssText="display:block;padding-right:22px;white-space:pre-line;",s.textContent=e,r.appendChild(s),K.appendChild(r),n>0&&setTimeout(()=>ot(r),n),r}function ot(e){!e||e.dataset._removing==="1"||(e.dataset._removing="1",e.style.opacity="0",e.style.transform="translateX(20px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}(function(){if(document.getElementById("toast-keyframes"))return;const t=document.createElement("style");t.id="toast-keyframes",t.textContent=`
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,document.head.appendChild(t)})();const ee=Ce,u=document.createElement("div");u.id="spot-sidebar";u.innerHTML=`
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
`;document.body.appendChild(u);const Zn=u.querySelector(".sidebar-overlay"),Wn=u.querySelector(".sidebar-close"),Xn=u.querySelector(".hero-placeholder"),Yn=u.querySelector(".hero-name"),Gn=u.querySelector(".hero-desc"),at=u.querySelector(".hero-hot-badge"),ve=u.querySelector(".sidebar-photos-area"),Ue=u.querySelector("#photo-upload-btn"),Z=u.querySelector("#photo-file-input"),q=u.querySelector("#photo-upload-status"),be=u.querySelector(".sidebar-comments-area"),rt=u.querySelector("#comment-login-prompt"),D=u.querySelector("#comment-input"),N=u.querySelector("#comment-submit-btn"),k=u.querySelector("#comment-form-status"),ae=u.querySelector("#btn-like"),st=u.querySelector("#btn-like-icon"),it=u.querySelector("#btn-like-text"),Qn=u.querySelector("#btn-like-count"),re=u.querySelector("#btn-fav"),lt=u.querySelector("#btn-fav-icon"),ct=u.querySelector("#btn-fav-text"),eo=u.querySelector("#btn-fav-count"),to=u.querySelector("#btn-comment-jump"),no=u.querySelector("#btn-comment-count");function ze(){u.classList.remove("open")}Zn.addEventListener("click",ze);Wn.addEventListener("click",ze);async function oo(e,t){ze(),me();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
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
  `,document.body.appendChild(n);const a=n.querySelector(".spot-pioneer-overlay"),o=n.querySelector(".spot-pioneer-close"),r=n.querySelector("#pioneer-submit"),s=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),l=n.querySelector("#pioneer-desc"),d=n.querySelector(".spot-pioneer-coords");a.addEventListener("click",me),o.addEventListener("click",me),d.textContent="📍 正在定位...";try{const g=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,S=await(await fetch(g)).json();if(S.status==="1"&&S.regeocode){const v=S.regeocode.formatted_address||"",b=S.regeocode.addressComponent,w=(b==null?void 0:b.township)||(b==null?void 0:b.district)||(b==null?void 0:b.city)||v||"";i.placeholder=`如：${w||"此处"}`,d.textContent=`📍 ${v||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else d.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{d.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}r.addEventListener("click",async()=>{if(!z()){F();return}const g=i.value.trim(),h=l.value.trim();if(!g){s.textContent="请输入景区名称",s.style.color="rgba(255, 120, 120, 0.95)";return}if(!h){s.textContent="请写下一句话打卡心得",s.style.color="rgba(255, 120, 120, 0.95)";return}s.textContent="正在创建...",s.style.color="rgba(255, 255, 255, 0.7)",r.disabled=!0,r.textContent="⏳ 创建中...";try{const{data:S,error:v}=await ee.from("spots").insert({name:g,longitude:e,latitude:t,description:h,creator_id:y.id}).select();if(v)throw v;const b=S[0];je(b),me(),T.setZoomAndCenter(12,[e,t]),await _e(b.id,b.name,b.description)}catch(S){console.error("[pioneer] 创建景区失败:",S),s.textContent="创建失败："+(S.message||"请检查网络后重试"),s.style.color="rgba(255, 120, 120, 0.95)",r.disabled=!1,r.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",g=>{g.key==="Enter"&&!r.disabled&&r.click()})}function me(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function je(e){const t=e.is_hot===!0,n=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:${t?"13":"12"}px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${t?"⭐ ":""}${Q(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t}});n.on("click",()=>ro(n)),T.add(n),Oe.push(n)}async function Me(){let e=[],t=null;try{if(Xe())e=await on();else{const a=await ee.from("spots").select("*");e=a.data||[],t=a.error}}catch(a){t=a}if(t){console.error("[main] 加载景区数据失败:",t),Ne(`加载景区数据失败
地图浏览不受影响`,"error",8e3);return}ao(),e.forEach(je);const n=Xe()?"🔥 热门景区":"📍 全部景区";$n(e,n)}function ao(){T.clearMap(),Oe.length=0}function dt(e,t,n,a,o,r){var h;if(!T)return;T.setZoomAndCenter(15,[t,n]),_e(e,a,o,r);const s=Oe.find(S=>{var v;return((v=S.getExtData())==null?void 0:v.id)===e});if(!s)return;const i=(h=s.getExtData())==null?void 0:h.isHot,l=s.getLabel(),d=l?l.getContent():"",g=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${Q(a)}</div>`;s.setLabel({content:g,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{s.setLabel({content:d,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function ro(e){Mt=Date.now();const t=e.getExtData();!t||!t.id||(T.setZoomAndCenter(12,e.getPosition()),await _e(t.id,t.name,t.description,t.isHot))}const ut=new Map;async function _e(e,t,n,a){p=Number(e),Yn.textContent=t||"",Gn.textContent=n||"暂无介绍",Xn.style.display="flex",a?at.style.display="inline-block":at.style.display="none";const o=Date.now(),r=ut.get(p);(!r||o-r>3e4)&&(ut.set(p,o),rn(p).catch(s=>console.warn("[main] 浏览量更新失败:",s))),ve.innerHTML="",be.innerHTML="",k.textContent="",u.classList.add("open"),$t(),await so(),Ke(p),await ke(p)}ae.addEventListener("click",async()=>{if(!y){F();return}if(p){ae.disabled=!0;try{Y?(await Ot(y.id,p),Y=!1):(await Rt(y.id,p),Y=!0),await ce(),Je()}catch(e){console.error("[main] 点赞操作失败:",e)}finally{ae.disabled=!1}}});re.addEventListener("click",async()=>{if(!y){F();return}if(p){re.disabled=!0;try{G?(await Kt(y.id,p),G=!1):(await Jt(y.id,p),G=!0),await ce(),Je()}catch(e){console.error("[main] 收藏操作失败:",e)}finally{re.disabled=!1}}});to.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),z()?setTimeout(()=>D.focus(),400):F())});function Je(){Y?(st.textContent="❤️",it.textContent="已赞",ae.classList.add("active")):(st.textContent="🤍",it.textContent="点赞",ae.classList.remove("active")),G?(lt.textContent="⭐",ct.textContent="已收藏",re.classList.add("active")):(lt.textContent="☆",ct.textContent="收藏",re.classList.remove("active"))}async function ce(){if(p)try{const[e,t,n]=await Promise.all([zt(p),Vt(p),Yt(p)]);Qn.textContent=e>0?e:"",eo.textContent=t>0?t:"",no.textContent=n>0?n:""}catch(e){console.warn("[main] 刷新计数失败:",e)}}async function so(){if(!y||!p)Y=!1,G=!1;else try{const[e,t]=await Promise.all([Dt(y.id,p),jt(y.id,p)]);Y=e,G=t}catch(e){console.warn("[main] 刷新互动状态失败:",e)}Je(),await ce()}function F(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function pt(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),a=document.getElementById("add-submit");!e||!t||!n||!a||(z()?(e.style.display="none",t.disabled=!1,n.disabled=!1,a.disabled=!1,a.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,a.disabled=!0,a.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function $t(){z()?(rt.style.display="none",D.disabled=!1,N.disabled=!1,N.textContent="发表评论",D.placeholder="写下你的评论..."):(rt.style.display="block",D.disabled=!0,N.disabled=!0,N.textContent="请先登录",D.placeholder="请先登录后再发表评论")}async function Ke(e){const[t,n]=await Promise.allSettled([ee.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),sn(e)]),a=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(o=>{o.photo_urls&&Array.isArray(o.photo_urls)&&o.photo_urls.forEach(r=>a.push({url:r,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(o=>a.push({url:o.url,source:"upload",id:o.id,userId:o.user_id})),ve.innerHTML="",a.length>0){const o=document.createElement("div");o.className="photo-grid",[...new Map(a.map(s=>[s.url,s])).values()].forEach(s=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${Q(s.url)}" alt="景区照片" loading="lazy" />`,s.source==="upload"&&y&&s.userId===y.id){const l=document.createElement("button");l.className="photo-delete-btn",l.textContent="×",l.title="删除此照片",l.addEventListener("click",async d=>{if(d.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await cn(s.id,y.id),Ke(e)}catch(g){console.error("[main] 删除照片失败:",g)}}),i.appendChild(l)}o.appendChild(i)}),ve.appendChild(o)}else ve.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}Ue.addEventListener("click",()=>{if(!y){F();return}p&&Z.click()});Z.addEventListener("change",async()=>{const e=Z.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){q.textContent="仅支持 JPG / PNG / WEBP 格式",q.style.color="rgba(255, 80, 80, 0.95)",Z.value="";return}if(e.size>5*1024*1024){q.textContent="图片不能超过 5MB",q.style.color="rgba(255, 80, 80, 0.95)",Z.value="";return}q.textContent="正在上传...",q.style.color="rgba(255, 255, 255, 0.7)",Ue.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),a=Date.now(),o=`${y.id}/${p}/${a}.${n}`,{error:r}=await ee.storage.from("spot-images").upload(o,e,{upsert:!1});if(r)throw r;const{data:s}=ee.storage.from("spot-images").getPublicUrl(o),i=s.publicUrl;await ln(p,y.id,o,i),q.textContent="上传成功！",q.style.color="rgba(80, 230, 140, 0.95)",await Ke(p),setTimeout(()=>{q.textContent=""},2e3)}catch(n){console.error("[main] 上传照片失败:",n),q.textContent="上传失败："+(n.message||"未知错误"),q.style.color="rgba(255, 80, 80, 0.95)"}finally{Ue.disabled=!1,Z.value=""}});async function ke(e){let t;try{t=await Zt(e)}catch(o){console.warn("[main] 加载评论失败:",o),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),be.innerHTML="",t.length===0){be.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const a=document.createElement("div");a.className="comment-list",t.forEach(o=>{const r=io(o.created_at),s=o.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.user_id)}`,i=y&&o.user_id===y.id,l=document.createElement("div");l.className="comment-bubble",l.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${Q(s)}" alt="" />
        <span class="comment-author-name">${Q(o.username)}</span>
        <span class="comment-time">${r}</span>
        ${i?`<button class="comment-delete-btn" data-id="${o.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${Q(o.content)}</div>
    `,a.appendChild(l)}),be.appendChild(a),a.querySelectorAll(".comment-delete-btn").forEach(o=>{o.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const r=Number(o.dataset.id);o.disabled=!0;try{await Xt(r,y.id),await ke(e),await ce()}catch(s){console.error("[main] 删除评论失败:",s),o.disabled=!1}})})}function io(e){if(!e)return"";const t=new Date(e),a=new Date-t,o=Math.floor(a/6e4);if(o<1)return"刚刚";if(o<60)return`${o}分钟前`;const r=Math.floor(o/60);if(r<24)return`${r}小时前`;const s=Math.floor(r/24);return s<30?`${s}天前`:t.toLocaleDateString("zh-CN")}function Q(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}N.addEventListener("click",async()=>{if(!p){k.textContent="请先点击地球上的景区",k.style.color="rgba(255, 80, 80, 0.95)";return}if(!z()){F();return}const e=D.value.trim();if(!e){k.textContent="请输入评论内容",k.style.color="rgba(255, 80, 80, 0.95)";return}k.textContent="正在发表...",k.style.color="rgba(255, 255, 255, 0.8)",N.disabled=!0;try{await Wt(y.id,p,e)}catch(t){console.error("[main] 发表评论失败:",t),k.textContent="发表失败："+t.message,k.style.color="rgba(255, 80, 80, 0.95)",N.disabled=!1;return}k.textContent="发表成功！",k.style.color="rgba(80, 230, 140, 0.95)",D.value="",await ke(p),await ce(),N.disabled=!1,setTimeout(()=>{k.textContent=""},2e3)});const A=document.createElement("div");A.id="add-form";A.innerHTML=`
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
`;document.body.appendChild(A);const _=A.querySelector(".add-form-status"),lo=A.querySelector("#add-submit");lo.addEventListener("click",async()=>{if(!z()){F();return}const e=A.querySelector("#field-address").value.trim(),t=A.querySelector("#field-desc").value.trim();if(!e||!t){_.textContent="请完整填写所有字段",_.style.color="rgba(255, 80, 80, 0.95)";return}_.textContent="正在查询地址...",_.style.color="rgba(255, 255, 255, 0.8)";let n,a;try{const i=await In(e);n=i.longitude,a=i.latitude}catch(i){console.error("[main] 高德地理编码失败:",i),_.textContent="查询失败："+i.message,_.style.color="rgba(255, 80, 80, 0.95)";return}_.textContent="正在保存...",_.style.color="rgba(255, 255, 255, 0.8)";const{data:o,error:r}=await ee.from("spots").insert({name:e,longitude:n,latitude:a,description:t,creator_id:y.id}).select();if(r){console.error("[main] 添加景区失败:",r),_.textContent="添加失败："+r.message,_.style.color="rgba(255, 80, 80, 0.95)";return}_.textContent="添加成功！",_.style.color="rgba(80, 230, 140, 0.95)",A.querySelector("#field-address").value="",A.querySelector("#field-desc").value="";const s=o[0];je(s),T.setZoomAndCenter(12,[s.longitude,s.latitude]),setTimeout(()=>{_.textContent=""},2e3)});async function co(){console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e),Ne("⚠️ 地图服务加载失败，请刷新页面","error",0);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),T=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),T.on("click",e=>{Date.now()-Mt<300||oo(e.lnglat.getLng(),e.lnglat.getLat())}),Hn({onSpotClick:dt}),Un({onSpotClick:dt}),Vn(),Dn(e=>{switch(e){case"home":Ye(!1),Me();break;case"hot":Ye(!0),Me();break;case"ranking":Bn(an);break;case"favorites":case"profile":z()?hn():F();break}}),console.log("[调试步骤3/6] 🔐 初始化认证模块...");try{await dn(),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e),Ne(`⚠️ 认证服务初始化失败
地图浏览不受影响`,"warn",1e4)}console.log("[调试步骤4/6] 🗄️ 初始化数据库..."),Ft(),console.log("[调试步骤4/6] ✅ 数据库初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange..."),un((e,t)=>{if(y=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}pt(),p&&u.classList.contains("open")&&($t(),ke(p))}),console.log("[调试步骤5/6] ✅ onAuthChange 就绪"),console.log("[调试步骤6/6] 📍 加载景区数据..."),pt(),Me(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:a,name:o,description:r}=e.detail;T.setZoomAndCenter(14,[n,a]),_e(t,o,r,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}co();
