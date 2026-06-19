(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const St="7dfc44451d8128e329100a0c71fa90b6",Et="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:Et};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(St)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});let y=null,l=null,h=null,A=!0,xe=new Set,be=null;const f={get isLoggedIn(){return!!l},get loading(){return A},get user(){return l},get profile(){return h},get supabase(){return y},async init(e){if(y)return console.warn("[authStore] 已初始化，跳过重复调用"),be;y=e;const n=setTimeout(()=>{A&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",y!=null&&y.auth?"getSession":"未初始化"),A=!1,z())},3e3),{data:o}=y.auth.onAuthStateChange(xt);return o==null||o.subscription,be=y.auth.getSession().then(async({data:{session:a}})=>{clearTimeout(n);const r=(a==null?void 0:a.user)??null;l&&r&&l.id===r.id||(l=r,l?await nt():h=null),A=!1,z()}).catch(a=>{clearTimeout(n),console.error("[authStore] getSession 失败:",a),A=!1,z()}),be},async signIn(e,t){if(!y)throw new Error("Supabase 客户端未初始化");const{data:n,error:o}=await K(y.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(o)throw o;return n},async signUp(e,t,n){if(!y)throw new Error("Supabase 客户端未初始化");const{data:o,error:a}=await K(y.auth.signUp({email:e,password:t,options:{data:{display_name:n}}}),15e3,"注册请求超时，请检查网络后重试");if(a)throw a;return o},async signOut(){if(y){try{await K(y.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}l=null,h=null,z()}},async updateProfile(e){if(!l)throw new Error("未登录");const{data:t,error:n}=await y.from("profiles").update(e).eq("id",l.id).select().single();if(n)throw n;return h=t,z(),t},subscribe(e){xe.add(e);try{e(ot())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{xe.delete(e)}},getAvatarUrl(){return h!=null&&h.avatar_url?h.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(l==null?void 0:l.id)||"default"}`},getDisplayName(){var e,t;return(h==null?void 0:h.display_name)||((e=l==null?void 0:l.user_metadata)==null?void 0:e.display_name)||((t=l==null?void 0:l.email)==null?void 0:t.split("@")[0])||"用户"}};async function xt(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const o=(t==null?void 0:t.user)??null,a=l&&o&&l.id!==o.id||!l&&o||l&&!o;l=o,l&&a?await nt():l||(h=null)}catch(o){console.error("[authStore] onAuthStateChange 处理异常:",o),h=l?G():null}A&&(A=!1),z()}async function nt(){var n,o,a,r,s;if(!l)return;let e,t;try{const i=await K(y.from("profiles").select("*").eq("id",l.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),h=G();return}if(t){const i=t==null?void 0:t.code,c=(t==null?void 0:t.hint)||"";i==="PGRST301"||c.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):c.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),h=G();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((o=l.user_metadata)==null?void 0:o.nickname)||((a=l.user_metadata)==null?void 0:a.display_name)||((r=l.email)==null?void 0:r.split("@")[0])||"";try{const c=await K(y.from("profiles").upsert({id:l.id,display_name:i,avatar_url:((s=l.user_metadata)==null?void 0:s.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(c.error){console.warn("[authStore] 自动创建 profile 失败:",c.error.message,"| code:",c.error.code),h=G();return}try{const p=await K(y.from("profiles").select("*").eq("id",l.id).maybeSingle(),5e3,"profiles 二次查询超时");if(p.error)console.warn("[authStore] 二次查询 profile 出错:",p.error.message);else if(p.data){h=p.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(p){console.warn("[authStore] 二次查询 profile 异常:",p.message)}}catch(c){console.warn("[authStore] 自动创建 profile 异常:",c.message)}h=G();return}h=e}function G(){var e,t,n,o,a;return l?{id:l.id,username:((e=l.user_metadata)==null?void 0:e.display_name)||((t=l.email)==null?void 0:t.split("@")[0])||"",display_name:((n=l.user_metadata)==null?void 0:n.display_name)||((o=l.email)==null?void 0:o.split("@")[0])||"",avatar_url:((a=l.user_metadata)==null?void 0:a.avatar_url)||null,bio:""}:null}function z(){const e=ot();xe.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function ot(){return{user:l,profile:h,loading:A}}function K(e,t,n){return Promise.race([e,new Promise((o,a)=>setTimeout(()=>a(new Error(n)),t))])}let m=null;function Ct(e){m=e}async function _t(e,t){const{count:n,error:o}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(o)throw o;return n>0}async function Lt(e,t){try{const{data:n,error:o}=await m.from("likes").insert({user_id:e,spot_id:t});if(o)throw o;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(N(n,"点赞失败，请检查权限或重试"))}}async function kt(e,t){try{const{data:n,error:o}=await m.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(N(n,"取消点赞失败，请检查权限或重试"))}}async function qt(e){const{count:t,error:n}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function It(e,t){const{count:n,error:o}=await m.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(o)throw o;return n>0}async function Tt(e,t){try{const{data:n,error:o}=await m.from("favorites").insert({user_id:e,spot_id:t});if(o)throw o;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(N(n,"收藏失败，请检查权限或重试"))}}async function Mt(e,t){try{const{data:n,error:o}=await m.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(N(n,"取消收藏失败，请检查权限或重试"))}}async function $t(e){const{count:t,error:n}=await m.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function At(e){const{data:t,error:n}=await m.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Pt(e,t,n){try{const{data:o,error:a}=await m.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(a)throw a;return o}catch(o){throw console.error("[db] addComment 失败:",o),new Error(N(o,"评论发表失败，请检查权限或重试"))}}async function Ht(e,t){try{const{data:n,error:o}=await m.from("comments").delete().eq("id",e).eq("user_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(N(n,"评论删除失败，请检查权限或重试"))}}async function Bt(e){const{count:t,error:n}=await m.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Nt(e){const{count:t,error:n}=await m.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function Ut(e){const{count:t,error:n}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function Dt(e){const{data:t,error:n}=await m.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((o,a)=>o+(a.views||0),0)}async function Ft(e){const{data:t,error:n}=await m.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Rt(e){const{data:t,error:n}=await m.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Ot(){const{data:e,error:t}=await m.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function zt(e=10){const{data:t,error:n}=await m.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function jt(e){const{error:t}=await m.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await m.from("spots").select("views").eq("id",e).maybeSingle(),o=((n==null?void 0:n.views)||0)+1;await m.from("spots").update({views:o}).eq("id",e)}}async function Jt(e){const{data:t,error:n}=await m.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Kt(e,t,n,o){try{const{data:a,error:r}=await m.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:o}).select();if(r)throw r;return a}catch(a){throw console.error("[db] saveSpotImage 失败:",a),new Error(N(a,"图片保存失败，请检查存储权限或重试"))}}async function Vt(e,t){try{const{data:n,error:o}=await m.from("spot_images").delete().eq("id",e).eq("user_id",t);if(o)throw o;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(N(n,"图片删除失败，请检查权限或重试"))}}function N(e,t){const n=e==null?void 0:e.code,o=(e==null?void 0:e.message)||"",a={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&a[n]?a[n]:o.includes("JWT")?"认证已过期，请重新登录":o.includes("network")||o.includes("fetch")?"网络连接异常，请检查网络":o.includes("timeout")||o.includes("超时")?"请求超时，请检查网络后重试":t}async function Wt(e){await f.init(e),en(),f.subscribe(t=>{it(t)})}function Zt(e){return f.subscribe(({user:t,profile:n})=>{e(t,n)})}function O(){return f.isLoggedIn}async function Yt(e,t){return f.signIn(e,t)}async function Gt(e,t,n){return f.signUp(e,t,n)}async function at(){return f.signOut()}async function Xt(e){return f.updateProfile(e)}function Qt(){st()}function en(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{f.isLoggedIn?dn():ln("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{we(),await at()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{we(),rt()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&we()}),tn(),nn(),on(),it({user:f.user})}function tn(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",ae),e.querySelector(".auth-modal-close").addEventListener("click",ae),e.querySelector("#auth-switch-register").addEventListener("click",()=>ie("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>ie("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,o=e.querySelector("#auth-login-error"),a=e.querySelector("#auth-login-submit");if(!t||!n){o.textContent="请填写邮箱和密码";return}if(!f.supabase){o.textContent="服务未初始化，请刷新页面";return}o.textContent="",a.disabled=!0,a.textContent="登录中...";try{await Yt(t,n),ae(),Ue()}catch(r){o.textContent=De(r.message)}finally{a.disabled=!1,a.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),o=e.querySelector("#auth-register-password").value,a=e.querySelector("#auth-register-error"),r=e.querySelector("#auth-register-submit");if(!t||!n||!o){a.textContent="请填写所有字段";return}if(o.length<6){a.textContent="密码至少需要6位";return}if(!f.supabase){a.textContent="服务未初始化，请刷新页面";return}a.textContent="",r.disabled=!0,r.textContent="注册中...";try{const{session:s}=await Gt(n,o,t);if(s)ae(),Ue();else{a.style.color="rgba(80, 230, 140, 0.95)",a.textContent="注册成功！请查看邮箱确认链接";const i=setTimeout(()=>{a.style.color="",ie("login")},2e3);e.dataset._registerTimer=String(i)}}catch(s){a.textContent=De(s.message)}finally{r.disabled=!1,r.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function nn(){const e=document.createElement("div");e.id="edit-profile-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#edit-profile-submit").addEventListener("click",async()=>{const t=e.querySelector("#edit-display-name").value.trim(),n=e.querySelector("#edit-bio").value.trim(),o=e.querySelector("#edit-avatar-url").value.trim(),a=e.querySelector("#edit-profile-error");if(!t){a.textContent="显示名称不能为空";return}a.textContent="";try{const r={display_name:t,bio:n||"",updated_at:new Date().toISOString()};o&&(r.avatar_url=o),await Xt(r),e.classList.remove("open")}catch(r){a.textContent="保存失败："+r.message}})}function rt(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=f.profile;e.querySelector("#edit-display-name").value=(t==null?void 0:t.display_name)||"",e.querySelector("#edit-bio").value=(t==null?void 0:t.bio)||"",e.querySelector("#edit-avatar-url").value=(t==null?void 0:t.avatar_url)||"",e.querySelector("#edit-profile-error").textContent="",e.classList.add("open")}function on(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),rt()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await at()}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function st(){var r;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),o=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),o.style.display="none",e.classList.add("open"),f.loading){n&&(n.textContent="正在验证身份令牌...");const s=Date.now(),i=5e3,c=100;try{await new Promise((p,v)=>{const S=setInterval(()=>{f.loading?Date.now()-s>i&&(clearInterval(S),v(new Error("timeout"))):(clearInterval(S),p())},c)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!f.isLoggedIn){n&&(n.textContent="请先登录");return}const a=f.user.id;n&&(n.textContent="📡 数据传送中...");try{const s=await Promise.allSettled([Y(Nt(a),8e3,"足迹统计"),Y(Ut(a),8e3,"点赞统计"),Y(Dt(a),8e3,"浏览量统计"),Y(Ft(a),8e3,"足迹列表"),Y(Rt(a),8e3,"收藏列表")]),i=(x,b,ve)=>{var Ne;return x.status==="fulfilled"?x.value:(console.warn(`[profile-center] ⚠️ ${ve} 加载失败，使用默认值`,((Ne=x.reason)==null?void 0:Ne.message)||x.reason),b)},c=i(s[0],0,"足迹统计"),p=i(s[1],0,"点赞统计"),v=i(s[2],0,"浏览量统计"),S=i(s[3],[],"足迹列表"),E=i(s[4],[],"收藏列表");an(e,{avatarUrl:f.getAvatarUrl(),displayName:f.getDisplayName(),bio:((r=f.profile)==null?void 0:r.bio)||"",spotCount:c,likeCount:p,views:v,spots:S,favorites:E})}catch(s){console.error("[profile-center] 加载统计失败:",s),rn(e);return}t.style.display="none",o.style.display="flex"}function an(e,t){const{avatarUrl:n,displayName:o,bio:a,spotCount:r,likeCount:s,views:i,spots:c,favorites:p}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=o,e.querySelector("#pc-bio").textContent=a||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=r??0,e.querySelector("#pc-stat-likes").textContent=s??0,e.querySelector("#pc-stat-views").textContent=i??0,sn(e,c),cn(e,p)}function rn(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const o=t.querySelector("#pc-retry-btn");o&&o.addEventListener("click",()=>st())}function Y(e,t,n){return Promise.race([e,new Promise((o,a)=>setTimeout(()=>a(new Error(`${n} 请求超时`)),t))])}function sn(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(o=>{const a=document.createElement("div");a.className="pc-footprint-item",a.innerHTML=`
      <span class="pc-footprint-name">📍 ${qe(o.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,a.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:o.id,lng:o.longitude,lat:o.latitude,name:o.name,description:o.description||""}}))}),n.appendChild(a)})}}function cn(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(o=>{const a=o.spots,r=(a==null?void 0:a.id)??o.spot_id;if(!r)return;const s=a!=null&&a.name?`⭐ ${qe(a.name)}`:`⭐ 景点 #${r}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${s}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:r,lng:(a==null?void 0:a.longitude)??0,lat:(a==null?void 0:a.latitude)??0,name:(a==null?void 0:a.name)||`景点 #${r}`,description:(a==null?void 0:a.description)||""}}))}),n.appendChild(i)})}}function ln(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),ie(e))}function ae(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function ie(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const o=document.getElementById("auth-login-error"),a=document.getElementById("auth-register-error");o&&(o.textContent=""),a&&(a.textContent="",a.style.color="")}function Ue(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),o=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),o&&(o.value="");const a=document.getElementById("auth-login-error"),r=document.getElementById("auth-register-error");a&&(a.textContent=""),r&&(r.textContent="")}function it(e){var o;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const a=f.getDisplayName(),r=((o=a[0])==null?void 0:o.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${r}</span>
        <span class="auth-user-label">${qe(a)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function dn(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function we(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function De(e){return{"Invalid login credentials":"邮箱或密码错误","Email not confirmed":"邮箱尚未验证，请先点击确认邮件中的链接","User already registered":"该邮箱已被注册","Password should be at least 6 characters":"密码至少需要6位","Email rate limit exceeded":"操作过于频繁，请稍后再试","登录请求超时，请检查网络后重试":"登录超时，请检查网络连接","注册请求超时，请检查网络后重试":"注册超时，请检查网络连接"}[e]||e}function qe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const un="7dfc44451d8128e329100a0c71fa90b6";async function pn(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(un)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(p){throw console.error("[geocodeService] 网络请求失败:",p),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let o;try{o=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(o.status!=="1")throw new Error(`高德 API 返回错误: ${o.info||"未知错误"} (status=${o.status})`);if(!o.geocodes||o.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const a=o.geocodes[0],[r,s]=a.location.split(","),i=parseFloat(r),c=parseFloat(s);if(isNaN(i)||isNaN(c))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${c}`),{longitude:i,latitude:c,formattedAddress:a.formatted_address||e}}let ct=!1,ee=null,P=null,Ie=!1,L=null,I=null,ne=!1;function Fe(){return ct}function lt(){const e=document.createElement("div");return e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
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
  `,e.querySelector(".spot-list-close").addEventListener("click",Ce),e.addEventListener("click",t=>{t.target===e&&Ce()}),e}function dt(){L&&(I=L.querySelector("#spot-list-toggle"),I&&I.addEventListener("click",e=>{e.stopPropagation(),ne?Ce():mn()}))}function mn(){L&&(L.classList.add("open"),ne=!0,Te())}function Te(){if(!I)return;const e=I.querySelector(".spot-list-toggle-arrow");ne?(e.style.transform="rotate(180deg)",I.title="收起景区列表",I.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",I.title="展开景区列表",I.classList.remove("spot-list-toggle--open"))}function fn(e,t){L||(L=lt(),document.body.appendChild(L),dt());const n=document.getElementById("spot-list-title"),o=document.getElementById("spot-list-count"),a=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),o&&(o.textContent=e?`${e.length} 个`:""),!e||e.length===0?a&&(a.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):a&&(a.innerHTML=e.map(r=>`
        <div class="spot-list-item" data-spot-id="${r.id}"
             data-lng="${r.longitude}" data-lat="${r.latitude}"
             data-name="${fe(r.name)}"
             data-desc="${fe(r.description||"")}"
             data-is-hot="${r.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${me(r.name)}</span>
            <span class="spot-list-item-city">${me(r.city||r.address||"")}</span>
          </div>
          ${r.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
        </div>
      `).join(""),a.querySelectorAll(".spot-list-item").forEach(r=>{r.addEventListener("click",()=>{const s=Number(r.dataset.spotId),i=parseFloat(r.dataset.lng),c=parseFloat(r.dataset.lat),p=r.dataset.name,v=r.dataset.desc,S=r.dataset.isHot==="1";ee&&ee(s,i,c,p,v,S)})})),L.classList.add("open"),ne=!0,Te()}function Ce(){L&&L.classList.remove("open"),ne=!1,Te()}function ut(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",pt),e}async function hn(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((o,a)=>`
      <div class="hot-ranking-item" data-spot-id="${o.id}"
           data-lng="${o.longitude}" data-lat="${o.latitude}"
           data-name="${fe(o.name)}"
           data-desc="${fe(o.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${a<3?"hot-ranking-index--top":""}">${a+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${a<3?"⭐ ":""}${me(o.name)}</span>
          <span class="hot-ranking-city">${me(o.city||o.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${o.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(o=>{o.addEventListener("click",()=>{const a=Number(o.dataset.spotId),r=parseFloat(o.dataset.lng),s=parseFloat(o.dataset.lat),i=o.dataset.name,c=o.dataset.desc;ee&&ee(a,r,s,i,c,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function gn(){P||(P=ut(),document.body.appendChild(P)),P.classList.add("open"),Ie=!0}function pt(){P&&P.classList.remove("open"),Ie=!1}function Re(e){ct=e}function yn(e){Ie?pt():(gn(),hn(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function vn(e={}){ee=e.onSpotClick||null,L=lt(),document.body.appendChild(L),dt(),P=ut(),document.body.appendChild(P)}function me(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function fe(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let mt=null,_e=null,Oe=null,F=[],re=null,w=null,T=null;function bn(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function ze(e){const t=T;if(!t)return;const n=e.trim();if(!n||n.length<1){F=[],Le();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:o,error:a}=await mt.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(a){console.error("[searchSpot] 查询失败:",a),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}F=o||[],Le()}catch(o){console.error("[searchSpot] 搜索异常:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function Le(){const e=T;if(e){if(F.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=F.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${Je(t.name)}"
         data-desc="${Je(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${je(t.name)}</span>
        <span class="spot-search-item-city">${je(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>ft(t))})}}function ft(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),o=parseFloat(e.dataset.lat),a=e.dataset.name,r=e.dataset.desc,s=e.dataset.isHot==="1";ce(),w&&(w.value="",le(!1)),_e&&_e(t,n,o,a,r,s)}function ce(){T&&(T.classList.remove("open"),T.innerHTML=""),F=[]}function le(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function wn(e={}){mt=e.supabaseClient||null,_e=e.onSpotClick||null,re=bn(),document.body.appendChild(re),w=document.getElementById("spot-search-input"),T=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");w&&(w.addEventListener("input",()=>{const n=w.value;le(n.length>0),clearTimeout(Oe),Oe=setTimeout(()=>ze(n),300)}),w.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),F.length>0)){const o=T==null?void 0:T.querySelector(".spot-search-item");o&&ft(o)}n.key==="Escape"&&(ce(),w.value="",le(!1))}),w.addEventListener("focus",()=>{F.length>0?Le():w.value.trim()&&ze(w.value)})),t&&t.addEventListener("click",()=>{w&&(w.value="",w.focus()),ce(),le(!1)}),document.addEventListener("click",n=>{re&&!re.contains(n.target)&&ce()})}function je(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function Je(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Se=window.innerWidth<768,de=[],he=null,te=null,H=null,R=!1;const ht=768,Sn=1024;function gt(){const e=window.innerWidth;return e<ht?"mobile":e<Sn?"tablet":"desktop"}function En(e){if(typeof e=="function")return de.push(e),()=>{de=de.filter(t=>t!==e)}}function yt(e){de.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function xn(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
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
  `,e}function Cn(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
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
  `,e}function _n(){R||(R=!0,H.classList.add("open"),te.classList.add("active"),document.body.style.overflow="hidden")}function J(){R&&(R=!1,H.classList.remove("open"),te.classList.remove("active"),document.body.style.overflow="")}function Ln(e){J(),yt(e)}function kn(){if(!te||!H||!he)return;te.addEventListener("click",()=>{R?J():_n()});const e=H.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",J);const t=H.querySelector(".menu-drawer-close");t&&t.addEventListener("click",J);const n=he.querySelectorAll("[data-action]"),o=H.querySelectorAll("[data-action]");n.forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.action;r&&yt(r)})}),o.forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.action;r&&Ln(r)})}),document.addEventListener("keydown",a=>{a.key==="Escape"&&R&&J()})}let Ke=null;function qn(){clearTimeout(Ke),Ke=setTimeout(()=>{const e=Se;Se=window.innerWidth<ht,e&&!Se&&R&&J(),vt()},150)}function vt(){const e=gt();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function In(){vt(),he=xn(),document.body.insertBefore(he,document.body.firstChild),H=Cn(),document.body.appendChild(H),te=document.getElementById("nav-hamburger"),kn(),window.addEventListener("resize",qn),console.log("[responsive] 响应式模块初始化完成，当前设备:",gt())}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let q=null;const Me=[];let u=null,g=null,V=!1,W=!1,bt=0;const $e="https://dxygnktgxycdqxipvjdj.supabase.co",Tn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA";if(typeof supabase>"u")throw console.error("[main] Supabase SDK 未加载，请检查 CDN 连接"),alert("服务初始化失败，请刷新页面或检查网络连接"),new Error("Supabase SDK not loaded");const $=supabase.createClient($e,Tn,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[main] Supabase 客户端初始化完成",$e);(async function(){try{const t=new AbortController,n=setTimeout(()=>t.abort(),5e3),o=await fetch(`${$e}/auth/v1/settings`,{signal:t.signal});clearTimeout(n),o.ok?console.log("[main] Supabase API 可达性验证通过"):console.warn("[main] Supabase API 返回非 200:",o.status)}catch(t){console.error("[main] Supabase API 不可达:",t.message);const n=document.createElement("div");n.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",n.textContent=`⚠️ 服务连接失败，请检查网络或刷新页面

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
`;document.body.appendChild(d);const Mn=d.querySelector(".sidebar-overlay"),$n=d.querySelector(".sidebar-close"),An=d.querySelector(".hero-placeholder"),Pn=d.querySelector(".hero-name"),Hn=d.querySelector(".hero-desc"),Ve=d.querySelector(".hero-hot-badge"),ue=d.querySelector(".sidebar-photos-area"),ke=d.querySelector("#photo-upload-btn"),j=d.querySelector("#photo-file-input"),k=d.querySelector("#photo-upload-status"),pe=d.querySelector(".sidebar-comments-area"),We=d.querySelector("#comment-login-prompt"),D=d.querySelector("#comment-input"),B=d.querySelector("#comment-submit-btn"),_=d.querySelector("#comment-form-status"),X=d.querySelector("#btn-like"),Ze=d.querySelector("#btn-like-icon"),Ye=d.querySelector("#btn-like-text"),Bn=d.querySelector("#btn-like-count"),Q=d.querySelector("#btn-fav"),Ge=d.querySelector("#btn-fav-icon"),Xe=d.querySelector("#btn-fav-text"),Nn=d.querySelector("#btn-fav-count"),Un=d.querySelector("#btn-comment-jump"),Dn=d.querySelector("#btn-comment-count");function Ae(){d.classList.remove("open")}Mn.addEventListener("click",Ae);$n.addEventListener("click",Ae);async function Fn(e,t){Ae(),se();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
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
  `,document.body.appendChild(n);const o=n.querySelector(".spot-pioneer-overlay"),a=n.querySelector(".spot-pioneer-close"),r=n.querySelector("#pioneer-submit"),s=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),c=n.querySelector("#pioneer-desc"),p=n.querySelector(".spot-pioneer-coords");o.addEventListener("click",se),a.addEventListener("click",se),p.textContent="📍 正在定位...";try{const v=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,E=await(await fetch(v)).json();if(E.status==="1"&&E.regeocode){const x=E.regeocode.formatted_address||"",b=E.regeocode.addressComponent,ve=(b==null?void 0:b.township)||(b==null?void 0:b.district)||(b==null?void 0:b.city)||x||"";i.placeholder=`如：${ve||"此处"}`,p.textContent=`📍 ${x||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else p.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{p.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}r.addEventListener("click",async()=>{if(!O()){U();return}const v=i.value.trim(),S=c.value.trim();if(!v){s.textContent="请输入景区名称",s.style.color="rgba(255, 120, 120, 0.95)";return}if(!S){s.textContent="请写下一句话打卡心得",s.style.color="rgba(255, 120, 120, 0.95)";return}s.textContent="正在创建...",s.style.color="rgba(255, 255, 255, 0.7)",r.disabled=!0,r.textContent="⏳ 创建中...";try{const{data:E,error:x}=await $.from("spots").insert({name:v,longitude:e,latitude:t,description:S,creator_id:g.id}).select();if(x)throw x;const b=E[0];Pe(b),se(),q.setZoomAndCenter(12,[e,t]),await ge(b.id,b.name,b.description)}catch(E){console.error("[pioneer] 创建景区失败:",E),s.textContent="创建失败："+(E.message||"请检查网络后重试"),s.style.color="rgba(255, 120, 120, 0.95)",r.disabled=!1,r.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",v=>{v.key==="Enter"&&!r.disabled&&r.click()})}function se(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function Pe(e){const t=e.is_hot===!0,n=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:${t?"13":"12"}px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${t?"⭐ ":""}${Z(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t}});n.on("click",()=>On(n)),q.add(n),Me.push(n)}async function Ee(){let e=[],t=null;try{if(Fe())e=await Ot();else{const o=await $.from("spots").select("*");e=o.data||[],t=o.error}}catch(o){t=o}if(t){console.error("加载景区数据失败:",t),alert("加载景区数据失败，请检查 Supabase 配置");return}Rn(),e.forEach(Pe);const n=Fe()?"🔥 热门景区":"📍 全部景区";fn(e,n)}function Rn(){q.clearMap(),Me.length=0}function Qe(e,t,n,o,a,r){var S;if(!q)return;q.setZoomAndCenter(15,[t,n]),ge(e,o,a,r);const s=Me.find(E=>{var x;return((x=E.getExtData())==null?void 0:x.id)===e});if(!s)return;const i=(S=s.getExtData())==null?void 0:S.isHot,c=s.getLabel(),p=c?c.getContent():"",v=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${Z(o)}</div>`;s.setLabel({content:v,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{s.setLabel({content:p,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function On(e){bt=Date.now();const t=e.getExtData();!t||!t.id||(q.setZoomAndCenter(12,e.getPosition()),await ge(t.id,t.name,t.description,t.isHot))}const et=new Map;async function ge(e,t,n,o){u=Number(e),Pn.textContent=t||"",Hn.textContent=n||"暂无介绍",An.style.display="flex",o?Ve.style.display="inline-block":Ve.style.display="none";const a=Date.now(),r=et.get(u);(!r||a-r>3e4)&&(et.set(u,a),jt(u).catch(s=>console.warn("[main] 浏览量更新失败:",s))),ue.innerHTML="",pe.innerHTML="",_.textContent="",d.classList.add("open"),wt(),await zn(),Be(u),await ye(u)}X.addEventListener("click",async()=>{if(!g){U();return}if(u){X.disabled=!0;try{V?(await kt(g.id,u),V=!1):(await Lt(g.id,u),V=!0),await oe(),He()}catch(e){console.error("点赞操作失败:",e)}finally{X.disabled=!1}}});Q.addEventListener("click",async()=>{if(!g){U();return}if(u){Q.disabled=!0;try{W?(await Mt(g.id,u),W=!1):(await Tt(g.id,u),W=!0),await oe(),He()}catch(e){console.error("收藏操作失败:",e)}finally{Q.disabled=!1}}});Un.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),O()?setTimeout(()=>D.focus(),400):U())});function He(){V?(Ze.textContent="❤️",Ye.textContent="已赞",X.classList.add("active")):(Ze.textContent="🤍",Ye.textContent="点赞",X.classList.remove("active")),W?(Ge.textContent="⭐",Xe.textContent="已收藏",Q.classList.add("active")):(Ge.textContent="☆",Xe.textContent="收藏",Q.classList.remove("active"))}async function oe(){if(u)try{const[e,t,n]=await Promise.all([qt(u),$t(u),Bt(u)]);Bn.textContent=e>0?e:"",Nn.textContent=t>0?t:"",Dn.textContent=n>0?n:""}catch(e){console.warn("刷新计数失败:",e)}}async function zn(){if(!g||!u)V=!1,W=!1;else try{const[e,t]=await Promise.all([_t(g.id,u),It(g.id,u)]);V=e,W=t}catch(e){console.warn("刷新互动状态失败:",e)}He(),await oe()}function U(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function tt(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),o=document.getElementById("add-submit");!e||!t||!n||!o||(O()?(e.style.display="none",t.disabled=!1,n.disabled=!1,o.disabled=!1,o.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,o.disabled=!0,o.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function wt(){O()?(We.style.display="none",D.disabled=!1,B.disabled=!1,B.textContent="发表评论",D.placeholder="写下你的评论..."):(We.style.display="block",D.disabled=!0,B.disabled=!0,B.textContent="请先登录",D.placeholder="请先登录后再发表评论")}async function Be(e){const[t,n]=await Promise.allSettled([$.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),Jt(e)]),o=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(a=>{a.photo_urls&&Array.isArray(a.photo_urls)&&a.photo_urls.forEach(r=>o.push({url:r,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(a=>{o.push({url:a.url,source:"upload",id:a.id,userId:a.user_id})}),ue.innerHTML="",o.length>0){const a=document.createElement("div");a.className="photo-grid",[...new Map(o.map(s=>[s.url,s])).values()].forEach(s=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${Z(s.url)}" alt="景区照片" loading="lazy" />`,s.source==="upload"&&g&&s.userId===g.id){const c=document.createElement("button");c.className="photo-delete-btn",c.textContent="×",c.title="删除此照片",c.addEventListener("click",async p=>{if(p.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await Vt(s.id),Be(e)}catch(v){console.error("删除照片失败:",v)}}),i.appendChild(c)}a.appendChild(i)}),ue.appendChild(a)}else ue.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}ke.addEventListener("click",()=>{if(!g){U();return}u&&j.click()});j.addEventListener("change",async()=>{const e=j.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){k.textContent="仅支持 JPG / PNG / WEBP 格式",k.style.color="rgba(255, 80, 80, 0.95)",j.value="";return}if(e.size>5*1024*1024){k.textContent="图片不能超过 5MB",k.style.color="rgba(255, 80, 80, 0.95)",j.value="";return}k.textContent="正在上传...",k.style.color="rgba(255, 255, 255, 0.7)",ke.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),o=Date.now(),a=`${g.id}/${u}/${o}.${n}`,{error:r}=await $.storage.from("spot-images").upload(a,e,{upsert:!1});if(r)throw r;const{data:s}=$.storage.from("spot-images").getPublicUrl(a),i=s.publicUrl;await Kt(u,g.id,a,i),k.textContent="上传成功！",k.style.color="rgba(80, 230, 140, 0.95)",await Be(u),setTimeout(()=>{k.textContent=""},2e3)}catch(n){console.error("上传照片失败:",n),k.textContent="上传失败："+(n.message||"未知错误"),k.style.color="rgba(255, 80, 80, 0.95)"}finally{ke.disabled=!1,j.value=""}});async function ye(e){let t;try{t=await At(e)}catch(a){console.warn("加载评论失败:",a),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),pe.innerHTML="",t.length===0){pe.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const o=document.createElement("div");o.className="comment-list",t.forEach(a=>{const r=jn(a.created_at),s=a.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.user_id)}`,i=g&&a.user_id===g.id,c=document.createElement("div");c.className="comment-bubble",c.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${Z(s)}" alt="" />
        <span class="comment-author-name">${Z(a.display_name)}</span>
        <span class="comment-time">${r}</span>
        ${i?`<button class="comment-delete-btn" data-id="${a.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${Z(a.content)}</div>
    `,o.appendChild(c)}),pe.appendChild(o),o.querySelectorAll(".comment-delete-btn").forEach(a=>{a.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const r=Number(a.dataset.id);a.disabled=!0;try{await Ht(r),await ye(e),await oe()}catch(s){console.error("删除评论失败:",s),a.disabled=!1}})})}function jn(e){if(!e)return"";const t=new Date(e),o=new Date-t,a=Math.floor(o/6e4);if(a<1)return"刚刚";if(a<60)return`${a}分钟前`;const r=Math.floor(a/60);if(r<24)return`${r}小时前`;const s=Math.floor(r/24);return s<30?`${s}天前`:t.toLocaleDateString("zh-CN")}function Z(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}B.addEventListener("click",async()=>{if(!u){_.textContent="请先点击地球上的景区",_.style.color="rgba(255, 80, 80, 0.95)";return}if(!O()){U();return}const e=D.value.trim();if(!e){_.textContent="请输入评论内容",_.style.color="rgba(255, 80, 80, 0.95)";return}_.textContent="正在发表...",_.style.color="rgba(255, 255, 255, 0.8)",B.disabled=!0;try{await Pt(g.id,u,e)}catch(t){console.error("发表评论失败:",t),_.textContent="发表失败："+t.message,_.style.color="rgba(255, 80, 80, 0.95)",B.disabled=!1;return}_.textContent="发表成功！",_.style.color="rgba(80, 230, 140, 0.95)",D.value="",await ye(u),await oe(),B.disabled=!1,setTimeout(()=>{_.textContent=""},2e3)});const M=document.createElement("div");M.id="add-form";M.innerHTML=`
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
`;document.body.appendChild(M);const C=M.querySelector(".add-form-status"),Jn=M.querySelector("#add-submit");Jn.addEventListener("click",async()=>{if(!O()){U();return}const e=M.querySelector("#field-address").value.trim(),t=M.querySelector("#field-desc").value.trim();if(!e||!t){C.textContent="请完整填写所有字段",C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="正在查询地址...",C.style.color="rgba(255, 255, 255, 0.8)";let n,o;try{const c=await pn(e);n=c.longitude,o=c.latitude}catch(c){console.error("高德地理编码失败:",c),C.textContent="查询失败："+c.message,C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="正在保存...",C.style.color="rgba(255, 255, 255, 0.8)";const a={name:e,longitude:n,latitude:o,description:t,creator_id:g.id},{data:r,error:s}=await $.from("spots").insert(a).select();if(s){console.error("添加景区失败:",s),C.textContent="添加失败："+s.message,C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="添加成功！",C.style.color="rgba(80, 230, 140, 0.95)",M.querySelector("#field-address").value="",M.querySelector("#field-desc").value="";const i=r[0];Pe(i),q.setZoomAndCenter(12,[i.longitude,i.latitude]),setTimeout(()=>{C.textContent=""},2e3)});async function Kn(){console.log("[调试步骤1/6] 🚀 应用启动，等待高德地图 SDK 加载...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e);const t=document.createElement("div");t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",t.textContent="⚠️ 地图服务加载失败，请刷新页面",document.body.appendChild(t);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),q=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),q.on("click",e=>{if(Date.now()-bt<300)return;const[t,n]=[e.lnglat.getLng(),e.lnglat.getLat()];Fn(t,n)}),vn({onSpotClick:Qe}),wn({supabaseClient:$,onSpotClick:Qe}),In(),En(e=>{switch(e){case"home":Re(!1),Ee();break;case"hot":Re(!0),Ee();break;case"ranking":yn(zt);break;case"favorites":case"profile":O()?Qt():U();break}}),console.log("[调试步骤3/6] 🔐 初始化认证模块 (initAuth)...");try{await Wt($),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e);const t=document.createElement("div");t.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;padding:20px 32px;background:rgba(220,50,50,0.92);color:#fff;border-radius:12px;font-size:15px;text-align:center;max-width:400px;line-height:1.6;",t.textContent="⚠️ 认证服务初始化失败，请刷新页面",document.body.appendChild(t);return}console.log("[调试步骤4/6] 🗄️ 初始化数据库模块 (initDB)..."),Ct($),console.log("[调试步骤4/6] ✅ 数据库模块初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange 监听..."),Zt((e,t)=>{if(g=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}tt(),u&&d.classList.contains("open")&&(wt(),ye(u))}),console.log("[调试步骤5/6] ✅ onAuthChange 监听注册完成"),console.log("[调试步骤6/6] 📍 同步初始 UI 状态 + 加载景区数据..."),tt(),Ee(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:o,name:a,description:r}=e.detail;q.setZoomAndCenter(14,[n,o]),ge(t,a,r,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}Kn();
