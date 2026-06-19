(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();const at="7dfc44451d8128e329100a0c71fa90b6",st="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:st};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(at)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});let y=null,c=null,h=null,$=!0,fe=new Set,me=null;const f={get isLoggedIn(){return!!c},get loading(){return $},get user(){return c},get profile(){return h},get supabase(){return y},async init(e){if(y)return console.warn("[authStore] 已初始化，跳过重复调用"),me;y=e;const n=setTimeout(()=>{$&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",y!=null&&y.auth?"getSession":"未初始化"),$=!1,F())},3e3),{data:o}=y.auth.onAuthStateChange(it);return o==null||o.subscription,me=y.auth.getSession().then(async({data:{session:r}})=>{clearTimeout(n);const a=(r==null?void 0:r.user)??null;c&&a&&c.id===a.id||(c=a,c?await Je():h=null),$=!1,F()}).catch(r=>{clearTimeout(n),console.error("[authStore] getSession 失败:",r),$=!1,F()}),me},async signIn(e,t){if(!y)throw new Error("Supabase 客户端未初始化");const{data:n,error:o}=await R(y.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(o)throw o;return n},async signUp(e,t,n){if(!y)throw new Error("Supabase 客户端未初始化");const{data:o,error:r}=await R(y.auth.signUp({email:e,password:t,options:{data:{display_name:n}}}),15e3,"注册请求超时，请检查网络后重试");if(r)throw r;return o},async signOut(){if(y){try{await R(y.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}c=null,h=null,F()}},async updateProfile(e){if(!c)throw new Error("未登录");const{data:t,error:n}=await y.from("profiles").update(e).eq("id",c.id).select().single();if(n)throw n;return h=t,F(),t},subscribe(e){fe.add(e);try{e(Ke())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{fe.delete(e)}},getAvatarUrl(){return h!=null&&h.avatar_url?h.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(c==null?void 0:c.id)||"default"}`},getDisplayName(){var e,t;return(h==null?void 0:h.display_name)||((e=c==null?void 0:c.user_metadata)==null?void 0:e.display_name)||((t=c==null?void 0:c.email)==null?void 0:t.split("@")[0])||"用户"}};async function it(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const o=(t==null?void 0:t.user)??null,r=c&&o&&c.id!==o.id||!c&&o||c&&!o;c=o,c&&r?await Je():c||(h=null)}catch(o){console.error("[authStore] onAuthStateChange 处理异常:",o),h=c?V():null}$&&($=!1),F()}async function Je(){var n,o,r,a,s;if(!c)return;let e,t;try{const i=await R(y.from("profiles").select("*").eq("id",c.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),h=V();return}if(t){const i=t==null?void 0:t.code,l=(t==null?void 0:t.hint)||"";i==="PGRST301"||l.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):l.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),h=V();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((o=c.user_metadata)==null?void 0:o.nickname)||((r=c.user_metadata)==null?void 0:r.display_name)||((a=c.email)==null?void 0:a.split("@")[0])||"";try{const l=await R(y.from("profiles").upsert({id:c.id,display_name:i,avatar_url:((s=c.user_metadata)==null?void 0:s.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(l.error){console.warn("[authStore] 自动创建 profile 失败:",l.error.message,"| code:",l.error.code),h=V();return}try{const p=await R(y.from("profiles").select("*").eq("id",c.id).maybeSingle(),5e3,"profiles 二次查询超时");if(p.error)console.warn("[authStore] 二次查询 profile 出错:",p.error.message);else if(p.data){h=p.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(p){console.warn("[authStore] 二次查询 profile 异常:",p.message)}}catch(l){console.warn("[authStore] 自动创建 profile 异常:",l.message)}h=V();return}h=e}function V(){var e,t,n,o,r;return c?{id:c.id,username:((e=c.user_metadata)==null?void 0:e.display_name)||((t=c.email)==null?void 0:t.split("@")[0])||"",display_name:((n=c.user_metadata)==null?void 0:n.display_name)||((o=c.email)==null?void 0:o.split("@")[0])||"",avatar_url:((r=c.user_metadata)==null?void 0:r.avatar_url)||null,bio:""}:null}function F(){const e=Ke();fe.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function Ke(){return{user:c,profile:h,loading:$}}function R(e,t,n){return Promise.race([e,new Promise((o,r)=>setTimeout(()=>r(new Error(n)),t))])}let m=null;function lt(e){m=e}async function ct(e,t){const{count:n,error:o}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(o)throw o;return n>0}async function dt(e,t){try{const{data:n,error:o}=await m.from("likes").insert({user_id:e,spot_id:t});if(o)throw o;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(H(n,"点赞失败，请检查权限或重试"))}}async function ut(e,t){try{const{data:n,error:o}=await m.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(H(n,"取消点赞失败，请检查权限或重试"))}}async function pt(e){const{count:t,error:n}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function mt(e,t){const{count:n,error:o}=await m.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(o)throw o;return n>0}async function ft(e,t){try{const{data:n,error:o}=await m.from("favorites").insert({user_id:e,spot_id:t});if(o)throw o;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(H(n,"收藏失败，请检查权限或重试"))}}async function ht(e,t){try{const{data:n,error:o}=await m.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(H(n,"取消收藏失败，请检查权限或重试"))}}async function gt(e){const{count:t,error:n}=await m.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function yt(e){const{data:t,error:n}=await m.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function bt(e,t,n){try{const{data:o,error:r}=await m.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(r)throw r;return o}catch(o){throw console.error("[db] addComment 失败:",o),new Error(H(o,"评论发表失败，请检查权限或重试"))}}async function vt(e,t){try{const{data:n,error:o}=await m.from("comments").delete().eq("id",e).eq("user_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(H(n,"评论删除失败，请检查权限或重试"))}}async function wt(e){const{count:t,error:n}=await m.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function St(e){const{count:t,error:n}=await m.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function xt(e){const{count:t,error:n}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function Et(e){const{data:t,error:n}=await m.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((o,r)=>o+(r.views||0),0)}async function Ct(e){const{data:t,error:n}=await m.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function _t(e){const{data:t,error:n}=await m.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Lt(){const{data:e,error:t}=await m.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function kt(e=10){const{data:t,error:n}=await m.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function qt(e){const{error:t}=await m.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await m.from("spots").select("views").eq("id",e).maybeSingle(),o=((n==null?void 0:n.views)||0)+1;await m.from("spots").update({views:o}).eq("id",e)}}async function It(e){const{data:t,error:n}=await m.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Tt(e,t,n,o){try{const{data:r,error:a}=await m.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:o}).select();if(a)throw a;return r}catch(r){throw console.error("[db] saveSpotImage 失败:",r),new Error(H(r,"图片保存失败，请检查存储权限或重试"))}}async function $t(e,t){try{const{data:n,error:o}=await m.from("spot_images").delete().eq("id",e).eq("user_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(H(n,"图片删除失败，请检查权限或重试"))}}function H(e,t){const n=e==null?void 0:e.code,o=(e==null?void 0:e.message)||"",r={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&r[n]?r[n]:o.includes("JWT")?"认证已过期，请重新登录":o.includes("network")||o.includes("fetch")?"网络连接异常，请检查网络":o.includes("timeout")||o.includes("超时")?"请求超时，请检查网络后重试":t}async function Mt(e){await f.init(e),Nt(),f.subscribe(t=>{Ge(t)})}function At(e){return f.subscribe(({user:t,profile:n})=>{e(t,n)})}function J(){return f.isLoggedIn}async function Pt(e,t){return f.signIn(e,t)}async function Ht(e,t,n){return f.signUp(e,t,n)}async function Ve(){return f.signOut()}async function Bt(e){return f.updateProfile(e)}function Nt(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{f.isLoggedIn?Kt():Jt("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-profile">👤 个人中心</div>
    <div class="auth-menu-item" id="auth-menu-edit-profile">✏️ 编辑资料</div>
    <div class="auth-menu-item" id="auth-menu-logout">🚪 退出登录</div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{ee(),await Ve()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{ee(),Ze()}),t.querySelector("#auth-menu-profile").addEventListener("click",()=>{ee(),Ye()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&ee()}),Ut(),Ft(),Dt(),Ge({user:f.user})}function Ut(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",Q),e.querySelector(".auth-modal-close").addEventListener("click",Q),e.querySelector("#auth-switch-register").addEventListener("click",()=>oe("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>oe("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,o=e.querySelector("#auth-login-error"),r=e.querySelector("#auth-login-submit");if(!t||!n){o.textContent="请填写邮箱和密码";return}if(!f.supabase){o.textContent="服务未初始化，请刷新页面";return}o.textContent="",r.disabled=!0,r.textContent="登录中...";try{await Pt(t,n),Q(),ke()}catch(a){o.textContent=qe(a.message)}finally{r.disabled=!1,r.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),o=e.querySelector("#auth-register-password").value,r=e.querySelector("#auth-register-error"),a=e.querySelector("#auth-register-submit");if(!t||!n||!o){r.textContent="请填写所有字段";return}if(o.length<6){r.textContent="密码至少需要6位";return}if(!f.supabase){r.textContent="服务未初始化，请刷新页面";return}r.textContent="",a.disabled=!0,a.textContent="注册中...";try{const{session:s}=await Ht(n,o,t);if(s)Q(),ke();else{r.style.color="rgba(80, 230, 140, 0.95)",r.textContent="注册成功！请查看邮箱确认链接";const i=setTimeout(()=>{r.style.color="",oe("login")},2e3);e.dataset._registerTimer=String(i)}}catch(s){r.textContent=qe(s.message)}finally{a.disabled=!1,a.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function Ft(){const e=document.createElement("div");e.id="edit-profile-modal",e.className="auth-modal",e.innerHTML=`
    <div class="auth-modal-overlay"></div>
    <div class="auth-modal-panel">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-form">
        <h2>编辑资料</h2>
        <p class="auth-form-sub">修改你的个人资料</p>
        <input type="text" id="edit-display-name" placeholder="显示名称" />
        <input type="text" id="edit-bio" placeholder="个人简介" />
        <input type="text" id="edit-avatar-url" placeholder="头像链接（可选）" />
        <button id="edit-profile-submit">保存</button>
        <p class="auth-form-error" id="edit-profile-error"></p>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#edit-profile-submit").addEventListener("click",async()=>{const t=e.querySelector("#edit-display-name").value.trim(),n=e.querySelector("#edit-bio").value.trim(),o=e.querySelector("#edit-avatar-url").value.trim(),r=e.querySelector("#edit-profile-error");if(!t){r.textContent="显示名称不能为空";return}r.textContent="";try{const a={display_name:t,bio:n||"",updated_at:new Date().toISOString()};o&&(a.avatar_url=o),await Bt(a),e.classList.remove("open")}catch(a){r.textContent="保存失败："+a.message}})}function Ze(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=f.profile;e.querySelector("#edit-display-name").value=(t==null?void 0:t.display_name)||"",e.querySelector("#edit-bio").value=(t==null?void 0:t.bio)||"",e.querySelector("#edit-avatar-url").value=(t==null?void 0:t.avatar_url)||"",e.querySelector("#edit-profile-error").textContent="",e.classList.add("open")}function Dt(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
          <button class="pc-action-btn-logout" id="pc-btn-logout">🚪 退出登录</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),Ze()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await Ve()}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function Ye(){var a;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),o=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),o.style.display="none",e.classList.add("open"),f.loading){n&&(n.textContent="正在验证身份令牌...");const s=Date.now(),i=5e3,l=100;try{await new Promise((p,b)=>{const S=setInterval(()=>{f.loading?Date.now()-s>i&&(clearInterval(S),b(new Error("timeout"))):(clearInterval(S),p())},l)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!f.isLoggedIn){n&&(n.textContent="请先登录");return}const r=f.user.id;n&&(n.textContent="📡 数据传送中...");try{const s=await Promise.allSettled([K(St(r),8e3,"足迹统计"),K(xt(r),8e3,"点赞统计"),K(Et(r),8e3,"浏览量统计"),K(Ct(r),8e3,"足迹列表"),K(_t(r),8e3,"收藏列表")]),i=(E,v,pe)=>{var Le;return E.status==="fulfilled"?E.value:(console.warn(`[profile-center] ⚠️ ${pe} 加载失败，使用默认值`,((Le=E.reason)==null?void 0:Le.message)||E.reason),v)},l=i(s[0],0,"足迹统计"),p=i(s[1],0,"点赞统计"),b=i(s[2],0,"浏览量统计"),S=i(s[3],[],"足迹列表"),x=i(s[4],[],"收藏列表");Rt(e,{avatarUrl:f.getAvatarUrl(),displayName:f.getDisplayName(),bio:((a=f.profile)==null?void 0:a.bio)||"",spotCount:l,likeCount:p,views:b,spots:S,favorites:x})}catch(s){console.error("[profile-center] 加载统计失败:",s),Ot(e);return}t.style.display="none",o.style.display="flex"}function Rt(e,t){const{avatarUrl:n,displayName:o,bio:r,spotCount:a,likeCount:s,views:i,spots:l,favorites:p}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=o,e.querySelector("#pc-bio").textContent=r||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=a??0,e.querySelector("#pc-stat-likes").textContent=s??0,e.querySelector("#pc-stat-views").textContent=i??0,zt(e,l),jt(e,p)}function Ot(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const o=t.querySelector("#pc-retry-btn");o&&o.addEventListener("click",()=>Ye())}function K(e,t,n){return Promise.race([e,new Promise((o,r)=>setTimeout(()=>r(new Error(`${n} 请求超时`)),t))])}function zt(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(o=>{const r=document.createElement("div");r.className="pc-footprint-item",r.innerHTML=`
      <span class="pc-footprint-name">📍 ${be(o.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,r.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:o.id,lng:o.longitude,lat:o.latitude,name:o.name,description:o.description||""}}))}),n.appendChild(r)})}}function jt(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(o=>{const r=o.spots,a=(r==null?void 0:r.id)??o.spot_id;if(!a)return;const s=r!=null&&r.name?`⭐ ${be(r.name)}`:`⭐ 景点 #${a}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${s}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a,lng:(r==null?void 0:r.longitude)??0,lat:(r==null?void 0:r.latitude)??0,name:(r==null?void 0:r.name)||`景点 #${a}`,description:(r==null?void 0:r.description)||""}}))}),n.appendChild(i)})}}function Jt(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),oe(e))}function Q(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function oe(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const o=document.getElementById("auth-login-error"),r=document.getElementById("auth-register-error");o&&(o.textContent=""),r&&(r.textContent="",r.style.color="")}function ke(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),o=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),o&&(o.value="");const r=document.getElementById("auth-login-error"),a=document.getElementById("auth-register-error");r&&(r.textContent=""),a&&(a.textContent="")}function Ge(e){var o;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const r=f.getDisplayName(),a=((o=r[0])==null?void 0:o.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${a}</span>
        <span class="auth-user-label">${be(r)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function Kt(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function ee(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function qe(e){return{"Invalid login credentials":"邮箱或密码错误","Email not confirmed":"邮箱尚未验证，请先点击确认邮件中的链接","User already registered":"该邮箱已被注册","Password should be at least 6 characters":"密码至少需要6位","Email rate limit exceeded":"操作过于频繁，请稍后再试","登录请求超时，请检查网络后重试":"登录超时，请检查网络连接","注册请求超时，请检查网络后重试":"注册超时，请检查网络连接"}[e]||e}function be(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Vt="7dfc44451d8128e329100a0c71fa90b6";async function Zt(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(Vt)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(p){throw console.error("[geocodeService] 网络请求失败:",p),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let o;try{o=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(o.status!=="1")throw new Error(`高德 API 返回错误: ${o.info||"未知错误"} (status=${o.status})`);if(!o.geocodes||o.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const r=o.geocodes[0],[a,s]=r.location.split(","),i=parseFloat(a),l=parseFloat(s);if(isNaN(i)||isNaN(l))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${l}`),{longitude:i,latitude:l,formattedAddress:r.formatted_address||e}}let We=!1,Z=null,W=null,M=null,ve=!1,A=null;function Ie(){return We}function Xe(){const e=document.createElement("div");return e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
    <div class="spot-list-header">
      <span class="spot-list-title" id="spot-list-title">📍 景区列表</span>
      <span class="spot-list-count" id="spot-list-count"></span>
      <button class="spot-list-close">&times;</button>
    </div>
    <div class="spot-list-body" id="spot-list-body">
      <p class="spot-list-loading">加载中...</p>
    </div>
  `,e.querySelector(".spot-list-close").addEventListener("click",Te),e.addEventListener("click",t=>{t.target===e&&Te()}),e}function Yt(e,t){A||(A=Xe(),document.body.appendChild(A));const n=document.getElementById("spot-list-title"),o=document.getElementById("spot-list-count"),r=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),o&&(o.textContent=e?`${e.length} 个`:""),!e||e.length===0?r&&(r.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):r&&(r.innerHTML=e.map(a=>`
        <div class="spot-list-item" data-spot-id="${a.id}"
             data-lng="${a.longitude}" data-lat="${a.latitude}"
             data-name="${ce(a.name)}"
             data-desc="${ce(a.description||"")}"
             data-is-hot="${a.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${le(a.name)}</span>
            <span class="spot-list-item-city">${le(a.city||a.address||"")}</span>
          </div>
          ${a.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
        </div>
      `).join(""),r.querySelectorAll(".spot-list-item").forEach(a=>{a.addEventListener("click",()=>{const s=Number(a.dataset.spotId),i=parseFloat(a.dataset.lng),l=parseFloat(a.dataset.lat),p=a.dataset.name,b=a.dataset.desc,S=a.dataset.isHot==="1";W&&W(s,i,l,p,b,S)})})),A.classList.add("open")}function Te(){A&&A.classList.remove("open")}function Qe(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",et),e}async function Gt(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((o,r)=>`
      <div class="hot-ranking-item" data-spot-id="${o.id}"
           data-lng="${o.longitude}" data-lat="${o.latitude}"
           data-name="${ce(o.name)}"
           data-desc="${ce(o.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${r<3?"hot-ranking-index--top":""}">${r+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${r<3?"⭐ ":""}${le(o.name)}</span>
          <span class="hot-ranking-city">${le(o.city||o.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${o.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(o=>{o.addEventListener("click",()=>{const r=Number(o.dataset.spotId),a=parseFloat(o.dataset.lng),s=parseFloat(o.dataset.lat),i=o.dataset.name,l=o.dataset.desc;W&&W(r,a,s,i,l,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function Wt(){M||(M=Qe(),document.body.appendChild(M)),M.classList.add("open"),ve=!0}function et(){M&&M.classList.remove("open"),ve=!1}function Xt(){const e=document.createElement("div");return e.id="hotspots-toggle-bar",e.className="hotspots-toggle-bar",e.innerHTML=`
    <button class="hotspots-toggle-btn hotspots-toggle-btn--active" data-filter="all">
      🌍 全部景区
    </button>
    <button class="hotspots-toggle-btn" data-filter="hot">
      🔥 热门景区
    </button>
    <button class="hotspots-toggle-btn hotspots-toggle-btn--ranking" data-action="ranking" title="热门排行榜">
      🏆 排行榜
    </button>
  `,e.querySelectorAll(".hotspots-toggle-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.filter;if(t.dataset.action==="ranking"){ve?et():(Wt(),Z&&Z("ranking"));return}e.querySelectorAll(".hotspots-toggle-btn").forEach(a=>a.classList.remove("hotspots-toggle-btn--active")),t.classList.add("hotspots-toggle-btn--active");const r=n==="hot";We=r,Z&&Z(r?"hot":"all")})}),e}function Qt(e={}){Z=e.onFilterChange||null,W=e.onSpotClick||null;const t=Xt();document.body.appendChild(t),A=Xe(),document.body.appendChild(A),M=Qe(),document.body.appendChild(M)}function le(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function ce(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let tt=null,he=null,$e=null,N=[],te=null,w=null,q=null;function en(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function Me(e){const t=q;if(!t)return;const n=e.trim();if(!n||n.length<1){N=[],ge();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:o,error:r}=await tt.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(r){console.error("[searchSpot] 查询失败:",r),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}N=o||[],ge()}catch(o){console.error("[searchSpot] 搜索异常:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function ge(){const e=q;if(e){if(N.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=N.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${Pe(t.name)}"
         data-desc="${Pe(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${Ae(t.name)}</span>
        <span class="spot-search-item-city">${Ae(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>nt(t))})}}function nt(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),o=parseFloat(e.dataset.lat),r=e.dataset.name,a=e.dataset.desc,s=e.dataset.isHot==="1";re(),w&&(w.value="",ae(!1)),he&&he(t,n,o,r,a,s)}function re(){q&&(q.classList.remove("open"),q.innerHTML=""),N=[]}function ae(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function tn(e={}){tt=e.supabaseClient||null,he=e.onSpotClick||null,te=en(),document.body.appendChild(te),w=document.getElementById("spot-search-input"),q=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");w&&(w.addEventListener("input",()=>{const n=w.value;ae(n.length>0),clearTimeout($e),$e=setTimeout(()=>Me(n),300)}),w.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),N.length>0)){const o=q==null?void 0:q.querySelector(".spot-search-item");o&&nt(o)}n.key==="Escape"&&(re(),w.value="",ae(!1))}),w.addEventListener("focus",()=>{N.length>0?ge():w.value.trim()&&Me(w.value)})),t&&t.addEventListener("click",()=>{w&&(w.value="",w.focus()),re(),ae(!1)}),document.addEventListener("click",n=>{te&&!te.contains(n.target)&&re()})}function Ae(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function Pe(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let k=null;const we=[];let u=null,g=null,O=!1,z=!1,ot=0;const Se="https://dxygnktgxycdqxipvjdj.supabase.co",nn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA";if(typeof supabase>"u")throw console.error("[main] Supabase SDK 未加载，请检查 CDN 连接"),alert("服务初始化失败，请刷新页面或检查网络连接"),new Error("Supabase SDK not loaded");const T=supabase.createClient(Se,nn,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[main] Supabase 客户端初始化完成",Se);(async function(){try{const t=new AbortController,n=setTimeout(()=>t.abort(),5e3),o=await fetch(`${Se}/auth/v1/settings`,{signal:t.signal});clearTimeout(n),o.ok?console.log("[main] Supabase API 可达性验证通过"):console.warn("[main] Supabase API 返回非 200:",o.status)}catch(t){console.error("[main] Supabase API 不可达:",t.message);const n=document.createElement("div");n.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",n.textContent=`⚠️ 服务连接失败，请检查网络或刷新页面

如果问题持续，请确认 Supabase 项目处于运行状态`,document.body.appendChild(n)}})();const d=document.createElement("div");d.id="spot-sidebar";d.innerHTML=`
  <div class="sidebar-overlay"></div>
  <div class="sidebar-panel">
    <button class="sidebar-close">&times;</button>
    <div class="sidebar-scroll">
      <!-- Hero 大图区 -->
      <div class="sidebar-hero">
        <div class="hero-placeholder">🏔</div>
        <div class="hero-title-overlay">
          <h2 class="hero-name"></h2>
          <span class="hero-hot-badge" style="display:none">⭐ 热门推荐</span>
          <p class="hero-desc"></p>
        </div>
      </div>

      <!-- 互动按钮：点赞 + 收藏 + 评论 -->
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

      <!-- 精彩照片 -->
      <div class="sidebar-section-title">精彩照片
        <button class="photo-upload-btn" id="photo-upload-btn" title="上传照片">＋</button>
      </div>
      <input type="file" id="photo-file-input" accept="image/jpeg,image/png,image/webp" style="display:none" />
      <div class="photo-upload-status" id="photo-upload-status"></div>
      <div class="sidebar-photos-area"></div>

      <!-- 评论区 -->
      <div class="sidebar-section-title" id="comments-title">评论</div>
      <div class="sidebar-comments-area"></div>

      <!-- 发表评论 -->
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
`;document.body.appendChild(d);const on=d.querySelector(".sidebar-overlay"),rn=d.querySelector(".sidebar-close"),an=d.querySelector(".hero-placeholder"),sn=d.querySelector(".hero-name"),ln=d.querySelector(".hero-desc"),He=d.querySelector(".hero-hot-badge"),se=d.querySelector(".sidebar-photos-area"),ye=d.querySelector("#photo-upload-btn"),D=d.querySelector("#photo-file-input"),L=d.querySelector("#photo-upload-status"),ie=d.querySelector(".sidebar-comments-area"),Be=d.querySelector("#comment-login-prompt"),B=d.querySelector("#comment-input"),P=d.querySelector("#comment-submit-btn"),_=d.querySelector("#comment-form-status"),Y=d.querySelector("#btn-like"),Ne=d.querySelector("#btn-like-icon"),Ue=d.querySelector("#btn-like-text"),cn=d.querySelector("#btn-like-count"),G=d.querySelector("#btn-fav"),Fe=d.querySelector("#btn-fav-icon"),De=d.querySelector("#btn-fav-text"),dn=d.querySelector("#btn-fav-count"),un=d.querySelector("#btn-comment-jump"),pn=d.querySelector("#btn-comment-count");function xe(){d.classList.remove("open")}on.addEventListener("click",xe);rn.addEventListener("click",xe);async function mn(e,t){xe(),ne();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
    <div class="spot-pioneer-overlay"></div>
    <div class="spot-pioneer-panel">
      <button class="spot-pioneer-close">&times;</button>

      <!-- 标题区 -->
      <div class="spot-pioneer-hero">
        <span class="spot-pioneer-icon">🗺️</span>
        <h2>探索新大陆！</h2>
        <p>该景区目前还没有旅行者留下过足迹<br>你想成为第一个点亮这里的「拓荒者」吗？</p>
        <p class="spot-pioneer-coords">
          坐标 ${e.toFixed(4)}, ${t.toFixed(4)}
        </p>
      </div>

      <!-- 快捷创建表单 -->
      <div class="spot-pioneer-form">
        <input
          type="text"
          id="pioneer-name"
          placeholder="景区名称（如：珠穆朗玛峰）"
          maxlength="200"
          autocomplete="off"
        />
        <textarea
          id="pioneer-desc"
          placeholder="一句话打卡心得..."
          rows="2"
          maxlength="500"
        ></textarea>

        <button id="pioneer-submit" class="spot-pioneer-btn">
          ✨ 立即点亮并分享
        </button>
        <p id="pioneer-status" class="spot-pioneer-status"></p>
      </div>
    </div>
  `,document.body.appendChild(n);const o=n.querySelector(".spot-pioneer-overlay"),r=n.querySelector(".spot-pioneer-close"),a=n.querySelector("#pioneer-submit"),s=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),l=n.querySelector("#pioneer-desc"),p=n.querySelector(".spot-pioneer-coords");o.addEventListener("click",ne),r.addEventListener("click",ne),p.textContent="📍 正在定位...";try{const b=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,x=await(await fetch(b)).json();if(x.status==="1"&&x.regeocode){const E=x.regeocode.formatted_address||"",v=x.regeocode.addressComponent,pe=(v==null?void 0:v.township)||(v==null?void 0:v.district)||(v==null?void 0:v.city)||E||"";i.placeholder=`如：${pe||"此处"}`,p.textContent=`📍 ${E||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else p.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{p.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}a.addEventListener("click",async()=>{if(!J()){U();return}const b=i.value.trim(),S=l.value.trim();if(!b){s.textContent="请输入景区名称",s.style.color="rgba(255, 120, 120, 0.95)";return}if(!S){s.textContent="请写下一句话打卡心得",s.style.color="rgba(255, 120, 120, 0.95)";return}s.textContent="正在创建...",s.style.color="rgba(255, 255, 255, 0.7)",a.disabled=!0,a.textContent="⏳ 创建中...";try{const{data:x,error:E}=await T.from("spots").insert({name:b,longitude:e,latitude:t,description:S,creator_id:g.id}).select();if(E)throw E;const v=x[0];Ee(v),ne(),k.setZoomAndCenter(12,[e,t]),await de(v.id,v.name,v.description)}catch(x){console.error("[pioneer] 创建景区失败:",x),s.textContent="创建失败："+(x.message||"请检查网络后重试"),s.style.color="rgba(255, 120, 120, 0.95)",a.disabled=!1,a.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",b=>{b.key==="Enter"&&!a.disabled&&a.click()})}function ne(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function Ee(e){const t=e.is_hot===!0,n=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:${t?"13":"12"}px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${t?"⭐ ":""}${j(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t}});n.on("click",()=>hn(n)),k.add(n),we.push(n)}async function Re(){let e=[],t=null;try{if(Ie())e=await Lt();else{const o=await T.from("spots").select("*");e=o.data||[],t=o.error}}catch(o){t=o}if(t){console.error("加载景区数据失败:",t),alert("加载景区数据失败，请检查 Supabase 配置");return}fn(),e.forEach(Ee);const n=Ie()?"🔥 热门景区":"📍 全部景区";Yt(e,n)}function fn(){k.clearMap(),we.length=0}function Oe(e,t,n,o,r,a){var S;if(!k)return;k.setZoomAndCenter(15,[t,n]),de(e,o,r,a);const s=we.find(x=>{var E;return((E=x.getExtData())==null?void 0:E.id)===e});if(!s)return;const i=(S=s.getExtData())==null?void 0:S.isHot,l=s.getLabel(),p=l?l.getContent():"",b=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${j(o)}</div>`;s.setLabel({content:b,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{s.setLabel({content:p,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function hn(e){ot=Date.now();const t=e.getExtData();!t||!t.id||(k.setZoomAndCenter(12,e.getPosition()),await de(t.id,t.name,t.description,t.isHot))}const ze=new Map;async function de(e,t,n,o){u=Number(e),sn.textContent=t||"",ln.textContent=n||"暂无介绍",an.style.display="flex",o?He.style.display="inline-block":He.style.display="none";const r=Date.now(),a=ze.get(u);(!a||r-a>3e4)&&(ze.set(u,r),qt(u).catch(s=>console.warn("[main] 浏览量更新失败:",s))),se.innerHTML="",ie.innerHTML="",_.textContent="",d.classList.add("open"),rt(),await gn(),_e(u),await ue(u)}Y.addEventListener("click",async()=>{if(!g){U();return}if(u){Y.disabled=!0;try{O?(await ut(g.id,u),O=!1):(await dt(g.id,u),O=!0),await X(),Ce()}catch(e){console.error("点赞操作失败:",e)}finally{Y.disabled=!1}}});G.addEventListener("click",async()=>{if(!g){U();return}if(u){G.disabled=!0;try{z?(await ht(g.id,u),z=!1):(await ft(g.id,u),z=!0),await X(),Ce()}catch(e){console.error("收藏操作失败:",e)}finally{G.disabled=!1}}});un.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),J()?setTimeout(()=>B.focus(),400):U())});function Ce(){O?(Ne.textContent="❤️",Ue.textContent="已赞",Y.classList.add("active")):(Ne.textContent="🤍",Ue.textContent="点赞",Y.classList.remove("active")),z?(Fe.textContent="⭐",De.textContent="已收藏",G.classList.add("active")):(Fe.textContent="☆",De.textContent="收藏",G.classList.remove("active"))}async function X(){if(u)try{const[e,t,n]=await Promise.all([pt(u),gt(u),wt(u)]);cn.textContent=e>0?e:"",dn.textContent=t>0?t:"",pn.textContent=n>0?n:""}catch(e){console.warn("刷新计数失败:",e)}}async function gn(){if(!g||!u)O=!1,z=!1;else try{const[e,t]=await Promise.all([ct(g.id,u),mt(g.id,u)]);O=e,z=t}catch(e){console.warn("刷新互动状态失败:",e)}Ce(),await X()}function U(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function je(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),o=document.getElementById("add-submit");!e||!t||!n||!o||(J()?(e.style.display="none",t.disabled=!1,n.disabled=!1,o.disabled=!1,o.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,o.disabled=!0,o.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function rt(){J()?(Be.style.display="none",B.disabled=!1,P.disabled=!1,P.textContent="发表评论",B.placeholder="写下你的评论..."):(Be.style.display="block",B.disabled=!0,P.disabled=!0,P.textContent="请先登录",B.placeholder="请先登录后再发表评论")}async function _e(e){const[t,n]=await Promise.allSettled([T.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),It(e)]),o=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(r=>{r.photo_urls&&Array.isArray(r.photo_urls)&&r.photo_urls.forEach(a=>o.push({url:a,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(r=>{o.push({url:r.url,source:"upload",id:r.id,userId:r.user_id})}),se.innerHTML="",o.length>0){const r=document.createElement("div");r.className="photo-grid",[...new Map(o.map(s=>[s.url,s])).values()].forEach(s=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${j(s.url)}" alt="景区照片" loading="lazy" />`,s.source==="upload"&&g&&s.userId===g.id){const l=document.createElement("button");l.className="photo-delete-btn",l.textContent="×",l.title="删除此照片",l.addEventListener("click",async p=>{if(p.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await $t(s.id),_e(e)}catch(b){console.error("删除照片失败:",b)}}),i.appendChild(l)}r.appendChild(i)}),se.appendChild(r)}else se.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}ye.addEventListener("click",()=>{if(!g){U();return}u&&D.click()});D.addEventListener("change",async()=>{const e=D.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){L.textContent="仅支持 JPG / PNG / WEBP 格式",L.style.color="rgba(255, 80, 80, 0.95)",D.value="";return}if(e.size>5*1024*1024){L.textContent="图片不能超过 5MB",L.style.color="rgba(255, 80, 80, 0.95)",D.value="";return}L.textContent="正在上传...",L.style.color="rgba(255, 255, 255, 0.7)",ye.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),o=Date.now(),r=`${g.id}/${u}/${o}.${n}`,{error:a}=await T.storage.from("spot-images").upload(r,e,{upsert:!1});if(a)throw a;const{data:s}=T.storage.from("spot-images").getPublicUrl(r),i=s.publicUrl;await Tt(u,g.id,r,i),L.textContent="上传成功！",L.style.color="rgba(80, 230, 140, 0.95)",await _e(u),setTimeout(()=>{L.textContent=""},2e3)}catch(n){console.error("上传照片失败:",n),L.textContent="上传失败："+(n.message||"未知错误"),L.style.color="rgba(255, 80, 80, 0.95)"}finally{ye.disabled=!1,D.value=""}});async function ue(e){let t;try{t=await yt(e)}catch(r){console.warn("加载评论失败:",r),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),ie.innerHTML="",t.length===0){ie.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const o=document.createElement("div");o.className="comment-list",t.forEach(r=>{const a=yn(r.created_at),s=r.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.user_id)}`,i=g&&r.user_id===g.id,l=document.createElement("div");l.className="comment-bubble",l.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${j(s)}" alt="" />
        <span class="comment-author-name">${j(r.display_name)}</span>
        <span class="comment-time">${a}</span>
        ${i?`<button class="comment-delete-btn" data-id="${r.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${j(r.content)}</div>
    `,o.appendChild(l)}),ie.appendChild(o),o.querySelectorAll(".comment-delete-btn").forEach(r=>{r.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const a=Number(r.dataset.id);r.disabled=!0;try{await vt(a),await ue(e),await X()}catch(s){console.error("删除评论失败:",s),r.disabled=!1}})})}function yn(e){if(!e)return"";const t=new Date(e),o=new Date-t,r=Math.floor(o/6e4);if(r<1)return"刚刚";if(r<60)return`${r}分钟前`;const a=Math.floor(r/60);if(a<24)return`${a}小时前`;const s=Math.floor(a/24);return s<30?`${s}天前`:t.toLocaleDateString("zh-CN")}function j(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}P.addEventListener("click",async()=>{if(!u){_.textContent="请先点击地球上的景区",_.style.color="rgba(255, 80, 80, 0.95)";return}if(!J()){U();return}const e=B.value.trim();if(!e){_.textContent="请输入评论内容",_.style.color="rgba(255, 80, 80, 0.95)";return}_.textContent="正在发表...",_.style.color="rgba(255, 255, 255, 0.8)",P.disabled=!0;try{await bt(g.id,u,e)}catch(t){console.error("发表评论失败:",t),_.textContent="发表失败："+t.message,_.style.color="rgba(255, 80, 80, 0.95)",P.disabled=!1;return}_.textContent="发表成功！",_.style.color="rgba(80, 230, 140, 0.95)",B.value="",await ue(u),await X(),P.disabled=!1,setTimeout(()=>{_.textContent=""},2e3)});const I=document.createElement("div");I.id="add-form";I.innerHTML=`
  <div class="add-form-body">
    <h3>分享你的足迹</h3>
    <div id="add-form-login-prompt" style="display:none">
      <p style="color:rgba(255,255,255,0.5);text-align:center;margin-bottom:10px;font-size:12px">
        请先登录后再分享足迹
      </p>
    </div>
    <input type="text" id="field-address" placeholder="景区名称或详细地址（如：杭州西湖）" />
    <textarea id="field-desc" placeholder="景区游记或一句话介绍" rows="2"></textarea>
    <button id="add-submit">分享我的足迹</button>
    <p class="add-form-status"></p>
  </div>
`;document.body.appendChild(I);const C=I.querySelector(".add-form-status"),bn=I.querySelector("#add-submit");bn.addEventListener("click",async()=>{if(!J()){U();return}const e=I.querySelector("#field-address").value.trim(),t=I.querySelector("#field-desc").value.trim();if(!e||!t){C.textContent="请完整填写所有字段",C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="正在查询地址...",C.style.color="rgba(255, 255, 255, 0.8)";let n,o;try{const l=await Zt(e);n=l.longitude,o=l.latitude}catch(l){console.error("高德地理编码失败:",l),C.textContent="查询失败："+l.message,C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="正在保存...",C.style.color="rgba(255, 255, 255, 0.8)";const r={name:e,longitude:n,latitude:o,description:t,creator_id:g.id},{data:a,error:s}=await T.from("spots").insert(r).select();if(s){console.error("添加景区失败:",s),C.textContent="添加失败："+s.message,C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="添加成功！",C.style.color="rgba(80, 230, 140, 0.95)",I.querySelector("#field-address").value="",I.querySelector("#field-desc").value="";const i=a[0];Ee(i),k.setZoomAndCenter(12,[i.longitude,i.latitude]),setTimeout(()=>{C.textContent=""},2e3)});async function vn(){console.log("[调试步骤1/6] 🚀 应用启动，等待高德地图 SDK 加载...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e);const t=document.createElement("div");t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",t.textContent="⚠️ 地图服务加载失败，请刷新页面",document.body.appendChild(t);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),k=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),k.on("click",e=>{if(Date.now()-ot<300)return;const[t,n]=[e.lnglat.getLng(),e.lnglat.getLat()];mn(t,n)}),Qt({onFilterChange:e=>{e==="ranking"?Gt(kt):Re()},onSpotClick:Oe}),tn({supabaseClient:T,onSpotClick:Oe}),console.log("[调试步骤3/6] 🔐 初始化认证模块 (initAuth)...");try{await Mt(T),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e);const t=document.createElement("div");t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",t.textContent="⚠️ 认证服务初始化失败，请刷新页面",document.body.appendChild(t);return}console.log("[调试步骤4/6] 🗄️ 初始化数据库模块 (initDB)..."),lt(T),console.log("[调试步骤4/6] ✅ 数据库模块初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange 监听..."),At((e,t)=>{if(g=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}je(),u&&d.classList.contains("open")&&(rt(),ue(u))}),console.log("[调试步骤5/6] ✅ onAuthChange 监听注册完成"),console.log("[调试步骤6/6] 📍 同步初始 UI 状态 + 加载景区数据..."),je(),Re(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:o,name:r,description:a}=e.detail;k.setZoomAndCenter(14,[n,o]),de(t,r,a,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}vn();
