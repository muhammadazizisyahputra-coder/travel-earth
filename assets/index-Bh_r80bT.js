(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();const Le="7dfc44451d8128e329100a0c71fa90b6",ke="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:ke};window.__amapPromise=new Promise((e,t)=>{const o=document.createElement("script");o.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(Le)}`,o.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},o.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(o)});let g=null,c=null,y=null,k=!0,te=new Set,ee=null;const m={get isLoggedIn(){return!!c},get loading(){return k},get user(){return c},get profile(){return y},get supabase(){return g},async init(e){if(g)return console.warn("[authStore] 已初始化，跳过重复调用"),ee;g=e;const o=setTimeout(()=>{k&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",g!=null&&g.auth?"getSession":"未初始化"),k=!1,$())},3e3),{data:n}=g.auth.onAuthStateChange(Ie);return n==null||n.subscription,ee=g.auth.getSession().then(async({data:{session:r}})=>{clearTimeout(o);const a=(r==null?void 0:r.user)??null;c&&a&&c.id===a.id||(c=a,c?await ve():y=null),k=!1,$()}).catch(r=>{clearTimeout(o),console.error("[authStore] getSession 失败:",r),k=!1,$()}),ee},async signIn(e,t){if(!g)throw new Error("Supabase 客户端未初始化");const{data:o,error:n}=await B(g.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(n)throw n;return o},async signUp(e,t,o){if(!g)throw new Error("Supabase 客户端未初始化");const{data:n,error:r}=await B(g.auth.signUp({email:e,password:t,options:{data:{display_name:o}}}),15e3,"注册请求超时，请检查网络后重试");if(r)throw r;return n},async signOut(){if(g){try{await B(g.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}c=null,y=null,$()}},async updateProfile(e){if(!c)throw new Error("未登录");const{data:t,error:o}=await g.from("profiles").update(e).eq("id",c.id).select().single();if(o)throw o;return y=t,$(),t},subscribe(e){te.add(e);try{e(we())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{te.delete(e)}},getAvatarUrl(){return y!=null&&y.avatar_url?y.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(c==null?void 0:c.id)||"default"}`},getDisplayName(){var e,t;return(y==null?void 0:y.display_name)||((e=c==null?void 0:c.user_metadata)==null?void 0:e.display_name)||((t=c==null?void 0:c.email)==null?void 0:t.split("@")[0])||"用户"}};async function Ie(e,t){var o;console.log("[authStore] 认证事件:",e,(o=t==null?void 0:t.user)==null?void 0:o.email);try{const n=(t==null?void 0:t.user)??null,r=c&&n&&c.id!==n.id||!c&&n||c&&!n;c=n,c&&r?await ve():c||(y=null)}catch(n){console.error("[authStore] onAuthStateChange 处理异常:",n),y=c?O():null}k&&(k=!1),$()}async function ve(){var o,n,r,a,s;if(!c)return;let e,t;try{const i=await B(g.from("profiles").select("*").eq("id",c.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(o=i.message)!=null&&o.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),y=O();return}if(t){const i=t==null?void 0:t.code,l=(t==null?void 0:t.hint)||"";i==="PGRST301"||l.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):l.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),y=O();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((n=c.user_metadata)==null?void 0:n.nickname)||((r=c.user_metadata)==null?void 0:r.display_name)||((a=c.email)==null?void 0:a.split("@")[0])||"";try{const l=await B(g.from("profiles").upsert({id:c.id,display_name:i,avatar_url:((s=c.user_metadata)==null?void 0:s.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(l.error){console.warn("[authStore] 自动创建 profile 失败:",l.error.message,"| code:",l.error.code),y=O();return}try{const p=await B(g.from("profiles").select("*").eq("id",c.id).maybeSingle(),5e3,"profiles 二次查询超时");if(p.error)console.warn("[authStore] 二次查询 profile 出错:",p.error.message);else if(p.data){y=p.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(p){console.warn("[authStore] 二次查询 profile 异常:",p.message)}}catch(l){console.warn("[authStore] 自动创建 profile 异常:",l.message)}y=O();return}y=e}function O(){var e,t,o,n,r;return c?{id:c.id,username:((e=c.user_metadata)==null?void 0:e.display_name)||((t=c.email)==null?void 0:t.split("@")[0])||"",display_name:((o=c.user_metadata)==null?void 0:o.display_name)||((n=c.email)==null?void 0:n.split("@")[0])||"",avatar_url:((r=c.user_metadata)==null?void 0:r.avatar_url)||null,bio:""}:null}function $(){const e=we();te.forEach(t=>{try{t(e)}catch(o){console.warn("[authStore] 订阅回调出错:",o)}})}function we(){return{user:c,profile:y,loading:k}}function B(e,t,o){return Promise.race([e,new Promise((n,r)=>setTimeout(()=>r(new Error(o)),t))])}let f=null;function Te(e){f=e}async function Me(e,t){const{count:o,error:n}=await f.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(n)throw n;return o>0}async function Ae(e,t){try{const{data:o,error:n}=await f.from("likes").insert({user_id:e,spot_id:t});if(n)throw n;return o}catch(o){throw console.error("[db] likeSpot 失败:",o),new Error(M(o,"点赞失败，请检查权限或重试"))}}async function Pe(e,t){try{const{data:o,error:n}=await f.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(n)throw n;return o}catch(o){throw console.error("[db] unlikeSpot 失败:",o),new Error(M(o,"取消点赞失败，请检查权限或重试"))}}async function $e(e){const{count:t,error:o}=await f.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(o)throw o;return t||0}async function Ue(e,t){const{count:o,error:n}=await f.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(n)throw n;return o>0}async function Be(e,t){try{const{data:o,error:n}=await f.from("favorites").insert({user_id:e,spot_id:t});if(n)throw n;return o}catch(o){throw console.error("[db] favoriteSpot 失败:",o),new Error(M(o,"收藏失败，请检查权限或重试"))}}async function Ne(e,t){try{const{data:o,error:n}=await f.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(n)throw n;return o}catch(o){throw console.error("[db] unfavoriteSpot 失败:",o),new Error(M(o,"取消收藏失败，请检查权限或重试"))}}async function De(e){const{count:t,error:o}=await f.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(o)throw o;return t||0}async function He(e){const{data:t,error:o}=await f.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(o)throw o;return t}async function Fe(e,t,o){try{const{data:n,error:r}=await f.from("comments").insert({user_id:e,spot_id:t,content:o}).select();if(r)throw r;return n}catch(n){throw console.error("[db] addComment 失败:",n),new Error(M(n,"评论发表失败，请检查权限或重试"))}}async function Oe(e,t){try{const{data:o,error:n}=await f.from("comments").delete().eq("id",e).eq("user_id",t);if(n)throw n;return o}catch(o){throw console.error("[db] deleteComment 失败:",o),new Error(M(o,"评论删除失败，请检查权限或重试"))}}async function Re(e){const{count:t,error:o}=await f.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(o)throw o;return t||0}async function ze(e){const{count:t,error:o}=await f.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(o)throw o;return t||0}async function Je(e){const{count:t,error:o}=await f.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(o)throw o;return t||0}async function je(e){const{data:t,error:o}=await f.from("spots").select("views").eq("creator_id",e);if(o)throw o;return(t||[]).reduce((n,r)=>n+(r.views||0),0)}async function Ke(e){const{data:t,error:o}=await f.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(o)throw o;return t}async function Ze(e){const{data:t,error:o}=await f.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(o)throw o;return t}async function Ve(e){const{data:t,error:o}=await f.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(o)throw o;return t}async function Ye(e,t,o,n){try{const{data:r,error:a}=await f.from("spot_images").insert({spot_id:e,user_id:t,storage_path:o,url:n}).select();if(a)throw a;return r}catch(r){throw console.error("[db] saveSpotImage 失败:",r),new Error(M(r,"图片保存失败，请检查存储权限或重试"))}}async function Ge(e,t){try{const{data:o,error:n}=await f.from("spot_images").delete().eq("id",e).eq("user_id",t);if(n)throw n;return o}catch(o){throw console.error("[db] deleteSpotImage 失败:",o),new Error(M(o,"图片删除失败，请检查权限或重试"))}}function M(e,t){const o=e==null?void 0:e.code,n=(e==null?void 0:e.message)||"",r={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return o&&r[o]?r[o]:n.includes("JWT")?"认证已过期，请重新登录":n.includes("network")||n.includes("fetch")?"网络连接异常，请检查网络":n.includes("timeout")||n.includes("超时")?"请求超时，请检查网络后重试":t}async function We(e){await m.init(e),ot(),m.subscribe(t=>{Ee(t)})}function Xe(e){return m.subscribe(({user:t,profile:o})=>{e(t,o)})}function H(){return m.isLoggedIn}async function Qe(e,t){return m.signIn(e,t)}async function et(e,t,o){return m.signUp(e,t,o)}async function Se(){return m.signOut()}async function tt(e){return m.updateProfile(e)}function ot(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{m.isLoggedIn?ut():dt("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-profile">👤 个人中心</div>
    <div class="auth-menu-item" id="auth-menu-edit-profile">✏️ 编辑资料</div>
    <div class="auth-menu-item" id="auth-menu-logout">🚪 退出登录</div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{Z(),await Se()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{Z(),xe()}),t.querySelector("#auth-menu-profile").addEventListener("click",()=>{Z(),Ce()}),document.body.appendChild(t),document.addEventListener("click",o=>{!e.contains(o.target)&&!t.contains(o.target)&&Z()}),rt(),nt(),at(),Ee({user:m.user})}function rt(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",K),e.querySelector(".auth-modal-close").addEventListener("click",K),e.querySelector("#auth-switch-register").addEventListener("click",()=>Y("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>Y("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),o=e.querySelector("#auth-login-password").value,n=e.querySelector("#auth-login-error"),r=e.querySelector("#auth-login-submit");if(!t||!o){n.textContent="请填写邮箱和密码";return}if(!m.supabase){n.textContent="服务未初始化，请刷新页面";return}n.textContent="",r.disabled=!0,r.textContent="登录中...";try{await Qe(t,o),K(),ue()}catch(a){n.textContent=pe(a.message)}finally{r.disabled=!1,r.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),o=e.querySelector("#auth-register-email").value.trim(),n=e.querySelector("#auth-register-password").value,r=e.querySelector("#auth-register-error"),a=e.querySelector("#auth-register-submit");if(!t||!o||!n){r.textContent="请填写所有字段";return}if(n.length<6){r.textContent="密码至少需要6位";return}if(!m.supabase){r.textContent="服务未初始化，请刷新页面";return}r.textContent="",a.disabled=!0,a.textContent="注册中...";try{const{session:s}=await et(o,n,t);if(s)K(),ue();else{r.style.color="rgba(80, 230, 140, 0.95)",r.textContent="注册成功！请查看邮箱确认链接";const i=setTimeout(()=>{r.style.color="",Y("login")},2e3);e.dataset._registerTimer=String(i)}}catch(s){r.textContent=pe(s.message)}finally{a.disabled=!1,a.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function nt(){const e=document.createElement("div");e.id="edit-profile-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#edit-profile-submit").addEventListener("click",async()=>{const t=e.querySelector("#edit-display-name").value.trim(),o=e.querySelector("#edit-bio").value.trim(),n=e.querySelector("#edit-avatar-url").value.trim(),r=e.querySelector("#edit-profile-error");if(!t){r.textContent="显示名称不能为空";return}r.textContent="";try{const a={display_name:t,bio:o||"",updated_at:new Date().toISOString()};n&&(a.avatar_url=n),await tt(a),e.classList.remove("open")}catch(a){r.textContent="保存失败："+a.message}})}function xe(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=m.profile;e.querySelector("#edit-display-name").value=(t==null?void 0:t.display_name)||"",e.querySelector("#edit-bio").value=(t==null?void 0:t.bio)||"",e.querySelector("#edit-avatar-url").value=(t==null?void 0:t.avatar_url)||"",e.querySelector("#edit-profile-error").textContent="",e.classList.add("open")}function at(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),xe()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await Se()}catch(o){console.error("[auth] 退出登录失败:",o)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function Ce(){var a;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),o=e.querySelector("#profile-center-loading-text"),n=e.querySelector("#profile-center-body");if(t.style.display="flex",o&&(o.textContent="正在连接数据舱..."),n.style.display="none",e.classList.add("open"),m.loading){o&&(o.textContent="正在验证身份令牌...");const s=Date.now(),i=5e3,l=100;try{await new Promise((p,w)=>{const L=setInterval(()=>{m.loading?Date.now()-s>i&&(clearInterval(L),w(new Error("timeout"))):(clearInterval(L),p())},l)})}catch{o&&(o.textContent="加载超时，请刷新页面后重试");return}}if(!m.isLoggedIn){o&&(o.textContent="请先登录");return}const r=m.user.id;o&&(o.textContent="📡 数据传送中...");try{const s=await Promise.allSettled([F(ze(r),8e3,"足迹统计"),F(Je(r),8e3,"点赞统计"),F(je(r),8e3,"浏览量统计"),F(Ke(r),8e3,"足迹列表"),F(Ze(r),8e3,"收藏列表")]),i=(E,b,Q)=>{var de;return E.status==="fulfilled"?E.value:(console.warn(`[profile-center] ⚠️ ${Q} 加载失败，使用默认值`,((de=E.reason)==null?void 0:de.message)||E.reason),b)},l=i(s[0],0,"足迹统计"),p=i(s[1],0,"点赞统计"),w=i(s[2],0,"浏览量统计"),L=i(s[3],[],"足迹列表"),x=i(s[4],[],"收藏列表");st(e,{avatarUrl:m.getAvatarUrl(),displayName:m.getDisplayName(),bio:((a=m.profile)==null?void 0:a.bio)||"",spotCount:l,likeCount:p,views:w,spots:L,favorites:x})}catch(s){console.error("[profile-center] 加载统计失败:",s),it(e);return}t.style.display="none",n.style.display="flex"}function st(e,t){const{avatarUrl:o,displayName:n,bio:r,spotCount:a,likeCount:s,views:i,spots:l,favorites:p}=t;e.querySelector("#pc-avatar-img").src=o,e.querySelector("#pc-display-name").textContent=n,e.querySelector("#pc-bio").textContent=r||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=a??0,e.querySelector("#pc-stat-likes").textContent=s??0,e.querySelector("#pc-stat-views").textContent=i??0,ct(e,l),lt(e,p)}function it(e){const t=e.querySelector("#profile-center-loading"),o=e.querySelector("#profile-center-body");if(!t||!o)return;t.style.display="block",t.innerHTML=`
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
  `,o.style.display="none";const n=t.querySelector("#pc-retry-btn");n&&n.addEventListener("click",()=>Ce())}function F(e,t,o){return Promise.race([e,new Promise((n,r)=>setTimeout(()=>r(new Error(`${o} 请求超时`)),t))])}function ct(e,t){const o=e.querySelector("#pc-footprints-list");if(o){if(o.innerHTML="",!t||t.length===0){o.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(n=>{const r=document.createElement("div");r.className="pc-footprint-item",r.innerHTML=`
      <span class="pc-footprint-name">📍 ${re(n.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,r.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:n.id,lng:n.longitude,lat:n.latitude,name:n.name,description:n.description||""}}))}),o.appendChild(r)})}}function lt(e,t){const o=e.querySelector("#pc-favorites-list");if(o){if(o.innerHTML="",!t||t.length===0){o.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(n=>{const r=n.spots,a=(r==null?void 0:r.id)??n.spot_id;if(!a)return;const s=r!=null&&r.name?`⭐ ${re(r.name)}`:`⭐ 景点 #${a}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${s}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a,lng:(r==null?void 0:r.longitude)??0,lat:(r==null?void 0:r.latitude)??0,name:(r==null?void 0:r.name)||`景点 #${a}`,description:(r==null?void 0:r.description)||""}}))}),o.appendChild(i)})}}function dt(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),Y(e))}function K(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function Y(e){const t=document.getElementById("auth-form-login"),o=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",o.style.display="block"):(t.style.display="block",o.style.display="none");const n=document.getElementById("auth-login-error"),r=document.getElementById("auth-register-error");n&&(n.textContent=""),r&&(r.textContent="",r.style.color="")}function ue(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),o=e.querySelector("#auth-register-email"),n=e.querySelector("#auth-register-password");t&&(t.value=""),o&&(o.value=""),n&&(n.value="");const r=document.getElementById("auth-login-error"),a=document.getElementById("auth-register-error");r&&(r.textContent=""),a&&(a.textContent="")}function Ee(e){var n;const{user:t}=e,o=document.getElementById("auth-user-btn");if(o)if(t){const r=m.getDisplayName(),a=((n=r[0])==null?void 0:n.toUpperCase())||"👤";o.innerHTML=`
        <span class="auth-user-avatar">${a}</span>
        <span class="auth-user-label">${re(r)}</span>
      `}else o.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function ut(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function Z(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function pe(e){return{"Invalid login credentials":"邮箱或密码错误","Email not confirmed":"邮箱尚未验证，请先点击确认邮件中的链接","User already registered":"该邮箱已被注册","Password should be at least 6 characters":"密码至少需要6位","Email rate limit exceeded":"操作过于频繁，请稍后再试","登录请求超时，请检查网络后重试":"登录超时，请检查网络连接","注册请求超时，请检查网络后重试":"注册超时，请检查网络连接"}[e]||e}function re(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const pt="7dfc44451d8128e329100a0c71fa90b6";async function mt(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(pt)}&address=${encodeURIComponent(e)}&output=JSON`;let o;try{o=await fetch(t)}catch(p){throw console.error("[geocodeService] 网络请求失败:",p),new Error("网络请求失败，请检查网络连接后重试")}if(!o.ok)throw new Error(`高德 API 请求失败: HTTP ${o.status}`);let n;try{n=await o.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(n.status!=="1")throw new Error(`高德 API 返回错误: ${n.info||"未知错误"} (status=${n.status})`);if(!n.geocodes||n.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const r=n.geocodes[0],[a,s]=r.location.split(","),i=parseFloat(a),l=parseFloat(s);if(isNaN(i)||isNaN(l))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${l}`),{longitude:i,latitude:l,formattedAddress:r.formatted_address||e}}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let q=null,u=null,h=null,N=!1,D=!1,_e=0;const ne="https://dxygnktgxycdqxipvjdj.supabase.co",ft="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA";if(typeof supabase>"u")throw console.error("[main] Supabase SDK 未加载，请检查 CDN 连接"),alert("服务初始化失败，请刷新页面或检查网络连接"),new Error("Supabase SDK not loaded");const T=supabase.createClient(ne,ft,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[main] Supabase 客户端初始化完成",ne);(async function(){try{const t=new AbortController,o=setTimeout(()=>t.abort(),5e3),n=await fetch(`${ne}/auth/v1/settings`,{signal:t.signal});clearTimeout(o),n.ok?console.log("[main] Supabase API 可达性验证通过"):console.warn("[main] Supabase API 返回非 200:",n.status)}catch(t){console.error("[main] Supabase API 不可达:",t.message);const o=document.createElement("div");o.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",o.textContent=`⚠️ 服务连接失败，请检查网络或刷新页面

如果问题持续，请确认 Supabase 项目处于运行状态`,document.body.appendChild(o)}})();const d=document.createElement("div");d.id="spot-sidebar";d.innerHTML=`
  <div class="sidebar-overlay"></div>
  <div class="sidebar-panel">
    <button class="sidebar-close">&times;</button>
    <div class="sidebar-scroll">
      <!-- Hero 大图区 -->
      <div class="sidebar-hero">
        <div class="hero-placeholder">🏔</div>
        <div class="hero-title-overlay">
          <h2 class="hero-name"></h2>
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
`;document.body.appendChild(d);const yt=d.querySelector(".sidebar-overlay"),ht=d.querySelector(".sidebar-close"),gt=d.querySelector(".hero-placeholder"),bt=d.querySelector(".hero-name"),vt=d.querySelector(".hero-desc"),G=d.querySelector(".sidebar-photos-area"),oe=d.querySelector("#photo-upload-btn"),U=d.querySelector("#photo-file-input"),C=d.querySelector("#photo-upload-status"),W=d.querySelector(".sidebar-comments-area"),me=d.querySelector("#comment-login-prompt"),A=d.querySelector("#comment-input"),I=d.querySelector("#comment-submit-btn"),S=d.querySelector("#comment-form-status"),R=d.querySelector("#btn-like"),fe=d.querySelector("#btn-like-icon"),ye=d.querySelector("#btn-like-text"),wt=d.querySelector("#btn-like-count"),z=d.querySelector("#btn-fav"),he=d.querySelector("#btn-fav-icon"),ge=d.querySelector("#btn-fav-text"),St=d.querySelector("#btn-fav-count"),xt=d.querySelector("#btn-comment-jump"),Ct=d.querySelector("#btn-comment-count");function ae(){d.classList.remove("open")}yt.addEventListener("click",ae);ht.addEventListener("click",ae);async function Et(e,t){ae(),V();const o=document.createElement("div");o.id="spot-pioneer-guide",o.className="spot-pioneer-guide",o.innerHTML=`
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
  `,document.body.appendChild(o);const n=o.querySelector(".spot-pioneer-overlay"),r=o.querySelector(".spot-pioneer-close"),a=o.querySelector("#pioneer-submit"),s=o.querySelector("#pioneer-status"),i=o.querySelector("#pioneer-name"),l=o.querySelector("#pioneer-desc"),p=o.querySelector(".spot-pioneer-coords");n.addEventListener("click",V),r.addEventListener("click",V),p.textContent="📍 正在定位...";try{const w=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,x=await(await fetch(w)).json();if(x.status==="1"&&x.regeocode){const E=x.regeocode.formatted_address||"",b=x.regeocode.addressComponent,Q=(b==null?void 0:b.township)||(b==null?void 0:b.district)||(b==null?void 0:b.city)||E||"";i.placeholder=`如：${Q||"此处"}`,p.textContent=`📍 ${E||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else p.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{p.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}a.addEventListener("click",async()=>{if(!H()){P();return}const w=i.value.trim(),L=l.value.trim();if(!w){s.textContent="请输入景区名称",s.style.color="rgba(255, 120, 120, 0.95)";return}if(!L){s.textContent="请写下一句话打卡心得",s.style.color="rgba(255, 120, 120, 0.95)";return}s.textContent="正在创建...",s.style.color="rgba(255, 255, 255, 0.7)",a.disabled=!0,a.textContent="⏳ 创建中...";try{const{data:x,error:E}=await T.from("spots").insert({name:w,longitude:e,latitude:t,description:L,creator_id:h.id}).select();if(E)throw E;const b=x[0];se(b),V(),q.setZoomAndCenter(12,[e,t]),await ie(b.id,b.name,b.description)}catch(x){console.error("[pioneer] 创建景区失败:",x),s.textContent="创建失败："+(x.message||"请检查网络后重试"),s.style.color="rgba(255, 120, 120, 0.95)",a.disabled=!1,a.textContent="✨ 立即点亮并分享"}}),o.addEventListener("keydown",w=>{w.key==="Enter"&&!a.disabled&&a.click()})}function V(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function se(e){const t=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:12px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${J(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description}});t.on("click",()=>Lt(t)),q.add(t)}async function _t(){const{data:e,error:t}=await T.from("spots").select("*");if(t){console.error("加载景区数据失败:",t),alert("加载景区数据失败，请检查 Supabase 配置");return}qt(),e.forEach(se),e.length>0&&q.setZoomAndCenter(10,[e[0].longitude,e[0].latitude])}function qt(){q.clearMap()}async function Lt(e){_e=Date.now();const t=e.getExtData();!t||!t.id||(q.setZoomAndCenter(12,e.getPosition()),await ie(t.id,t.name,t.description))}async function ie(e,t,o){u=Number(e),bt.textContent=t||"",vt.textContent=o||"暂无介绍",gt.style.display="flex",G.innerHTML="",W.innerHTML="",S.textContent="",d.classList.add("open"),qe(),await kt(),le(u),await X(u)}R.addEventListener("click",async()=>{if(!h){P();return}if(u){R.disabled=!0;try{N?(await Pe(h.id,u),N=!1):(await Ae(h.id,u),N=!0),await j(),ce()}catch(e){console.error("点赞操作失败:",e)}finally{R.disabled=!1}}});z.addEventListener("click",async()=>{if(!h){P();return}if(u){z.disabled=!0;try{D?(await Ne(h.id,u),D=!1):(await Be(h.id,u),D=!0),await j(),ce()}catch(e){console.error("收藏操作失败:",e)}finally{z.disabled=!1}}});xt.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),H()?setTimeout(()=>A.focus(),400):P())});function ce(){N?(fe.textContent="❤️",ye.textContent="已赞",R.classList.add("active")):(fe.textContent="🤍",ye.textContent="点赞",R.classList.remove("active")),D?(he.textContent="⭐",ge.textContent="已收藏",z.classList.add("active")):(he.textContent="☆",ge.textContent="收藏",z.classList.remove("active"))}async function j(){if(u)try{const[e,t,o]=await Promise.all([$e(u),De(u),Re(u)]);wt.textContent=e>0?e:"",St.textContent=t>0?t:"",Ct.textContent=o>0?o:""}catch(e){console.warn("刷新计数失败:",e)}}async function kt(){if(!h||!u)N=!1,D=!1;else try{const[e,t]=await Promise.all([Me(h.id,u),Ue(h.id,u)]);N=e,D=t}catch(e){console.warn("刷新互动状态失败:",e)}ce(),await j()}function P(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function be(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),o=document.getElementById("field-desc"),n=document.getElementById("add-submit");!e||!t||!o||!n||(H()?(e.style.display="none",t.disabled=!1,o.disabled=!1,n.disabled=!1,n.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",o.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,o.disabled=!0,n.disabled=!0,n.textContent="请先登录",t.placeholder="请登录后再分享",o.placeholder="请登录后再分享"))}function qe(){H()?(me.style.display="none",A.disabled=!1,I.disabled=!1,I.textContent="发表评论",A.placeholder="写下你的评论..."):(me.style.display="block",A.disabled=!0,I.disabled=!0,I.textContent="请先登录",A.placeholder="请先登录后再发表评论")}async function le(e){const[t,o]=await Promise.allSettled([T.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),Ve(e)]),n=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(r=>{r.photo_urls&&Array.isArray(r.photo_urls)&&r.photo_urls.forEach(a=>n.push({url:a,source:"story"}))}),o.status==="fulfilled"&&o.value&&o.value.forEach(r=>{n.push({url:r.url,source:"upload",id:r.id,userId:r.user_id})}),G.innerHTML="",n.length>0){const r=document.createElement("div");r.className="photo-grid",[...new Map(n.map(s=>[s.url,s])).values()].forEach(s=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${J(s.url)}" alt="景区照片" loading="lazy" />`,s.source==="upload"&&h&&s.userId===h.id){const l=document.createElement("button");l.className="photo-delete-btn",l.textContent="×",l.title="删除此照片",l.addEventListener("click",async p=>{if(p.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await Ge(s.id),le(e)}catch(w){console.error("删除照片失败:",w)}}),i.appendChild(l)}r.appendChild(i)}),G.appendChild(r)}else G.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}oe.addEventListener("click",()=>{if(!h){P();return}u&&U.click()});U.addEventListener("change",async()=>{const e=U.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){C.textContent="仅支持 JPG / PNG / WEBP 格式",C.style.color="rgba(255, 80, 80, 0.95)",U.value="";return}if(e.size>5*1024*1024){C.textContent="图片不能超过 5MB",C.style.color="rgba(255, 80, 80, 0.95)",U.value="";return}C.textContent="正在上传...",C.style.color="rgba(255, 255, 255, 0.7)",oe.disabled=!0;try{const o=e.name.split(".").pop().toLowerCase(),n=Date.now(),r=`${h.id}/${u}/${n}.${o}`,{error:a}=await T.storage.from("spot-images").upload(r,e,{upsert:!1});if(a)throw a;const{data:s}=T.storage.from("spot-images").getPublicUrl(r),i=s.publicUrl;await Ye(u,h.id,r,i),C.textContent="上传成功！",C.style.color="rgba(80, 230, 140, 0.95)",await le(u),setTimeout(()=>{C.textContent=""},2e3)}catch(o){console.error("上传照片失败:",o),C.textContent="上传失败："+(o.message||"未知错误"),C.style.color="rgba(255, 80, 80, 0.95)"}finally{oe.disabled=!1,U.value=""}});async function X(e){let t;try{t=await He(e)}catch(r){console.warn("加载评论失败:",r),t=[]}const o=document.getElementById("comments-title");if(o&&(o.textContent=`评论 (${t.length})`),W.innerHTML="",t.length===0){W.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const n=document.createElement("div");n.className="comment-list",t.forEach(r=>{const a=It(r.created_at),s=r.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.user_id)}`,i=h&&r.user_id===h.id,l=document.createElement("div");l.className="comment-bubble",l.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${J(s)}" alt="" />
        <span class="comment-author-name">${J(r.display_name)}</span>
        <span class="comment-time">${a}</span>
        ${i?`<button class="comment-delete-btn" data-id="${r.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${J(r.content)}</div>
    `,n.appendChild(l)}),W.appendChild(n),n.querySelectorAll(".comment-delete-btn").forEach(r=>{r.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const a=Number(r.dataset.id);r.disabled=!0;try{await Oe(a),await X(e),await j()}catch(s){console.error("删除评论失败:",s),r.disabled=!1}})})}function It(e){if(!e)return"";const t=new Date(e),n=new Date-t,r=Math.floor(n/6e4);if(r<1)return"刚刚";if(r<60)return`${r}分钟前`;const a=Math.floor(r/60);if(a<24)return`${a}小时前`;const s=Math.floor(a/24);return s<30?`${s}天前`:t.toLocaleDateString("zh-CN")}function J(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}I.addEventListener("click",async()=>{if(!u){S.textContent="请先点击地球上的景区",S.style.color="rgba(255, 80, 80, 0.95)";return}if(!H()){P();return}const e=A.value.trim();if(!e){S.textContent="请输入评论内容",S.style.color="rgba(255, 80, 80, 0.95)";return}S.textContent="正在发表...",S.style.color="rgba(255, 255, 255, 0.8)",I.disabled=!0;try{await Fe(h.id,u,e)}catch(t){console.error("发表评论失败:",t),S.textContent="发表失败："+t.message,S.style.color="rgba(255, 80, 80, 0.95)",I.disabled=!1;return}S.textContent="发表成功！",S.style.color="rgba(80, 230, 140, 0.95)",A.value="",await X(u),await j(),I.disabled=!1,setTimeout(()=>{S.textContent=""},2e3)});const _=document.createElement("div");_.id="add-form";_.innerHTML=`
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
`;document.body.appendChild(_);const v=_.querySelector(".add-form-status"),Tt=_.querySelector("#add-submit");Tt.addEventListener("click",async()=>{if(!H()){P();return}const e=_.querySelector("#field-address").value.trim(),t=_.querySelector("#field-desc").value.trim();if(!e||!t){v.textContent="请完整填写所有字段",v.style.color="rgba(255, 80, 80, 0.95)";return}v.textContent="正在查询地址...",v.style.color="rgba(255, 255, 255, 0.8)";let o,n;try{const l=await mt(e);o=l.longitude,n=l.latitude}catch(l){console.error("高德地理编码失败:",l),v.textContent="查询失败："+l.message,v.style.color="rgba(255, 80, 80, 0.95)";return}v.textContent="正在保存...",v.style.color="rgba(255, 255, 255, 0.8)";const r={name:e,longitude:o,latitude:n,description:t,creator_id:h.id},{data:a,error:s}=await T.from("spots").insert(r).select();if(s){console.error("添加景区失败:",s),v.textContent="添加失败："+s.message,v.style.color="rgba(255, 80, 80, 0.95)";return}v.textContent="添加成功！",v.style.color="rgba(80, 230, 140, 0.95)",_.querySelector("#field-address").value="",_.querySelector("#field-desc").value="";const i=a[0];se(i),q.setZoomAndCenter(12,[i.longitude,i.latitude]),setTimeout(()=>{v.textContent=""},2e3)});async function Mt(){console.log("[调试步骤1/6] 🚀 应用启动，等待高德地图 SDK 加载...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e);const t=document.createElement("div");t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",t.textContent="⚠️ 地图服务加载失败，请刷新页面",document.body.appendChild(t);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),q=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),q.on("click",e=>{if(Date.now()-_e<300)return;const[t,o]=[e.lnglat.getLng(),e.lnglat.getLat()];Et(t,o)}),console.log("[调试步骤3/6] 🔐 初始化认证模块 (initAuth)...");try{await We(T),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e);const t=document.createElement("div");t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",t.textContent="⚠️ 认证服务初始化失败，请刷新页面",document.body.appendChild(t);return}console.log("[调试步骤4/6] 🗄️ 初始化数据库模块 (initDB)..."),Te(T),console.log("[调试步骤4/6] ✅ 数据库模块初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange 监听..."),Xe((e,t)=>{if(h=e,!e){const o=document.getElementById("profile-center-modal");o&&o.classList.remove("open")}be(),u&&d.classList.contains("open")&&(qe(),X(u))}),console.log("[调试步骤5/6] ✅ onAuthChange 监听注册完成"),console.log("[调试步骤6/6] 📍 同步初始 UI 状态 + 加载景区数据..."),be(),_t(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:o,lat:n,name:r,description:a}=e.detail;q.setZoomAndCenter(14,[o,n]),ie(t,r,a)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}Mt();
