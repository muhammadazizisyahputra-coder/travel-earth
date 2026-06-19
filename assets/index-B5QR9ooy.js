(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const kt="7dfc44451d8128e329100a0c71fa90b6",Lt="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:Lt};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(kt)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});let g=null,c=null,y=null,A=!0,qe=new Set,Ce=null;const f={get isLoggedIn(){return!!c},get loading(){return A},get user(){return c},get profile(){return y},get supabase(){return g},async init(e){if(g)return console.warn("[authStore] 已初始化，跳过重复调用"),Ce;g=e;const n=setTimeout(()=>{A&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",g!=null&&g.auth?"getSession":"未初始化"),A=!1,K())},3e3),{data:r}=g.auth.onAuthStateChange(qt);return r==null||r.subscription,Ce=g.auth.getSession().then(async({data:{session:o}})=>{clearTimeout(n);const a=(o==null?void 0:o.user)??null;c&&a&&c.id===a.id||(c=a,c?await it():y=null),A=!1,K()}).catch(o=>{clearTimeout(n),console.error("[authStore] getSession 失败:",o),A=!1,K()}),Ce},async signIn(e,t){if(!g)throw new Error("Supabase 客户端未初始化");const{data:n,error:r}=await Y(g.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(r)throw r;return n},async signUp(e,t,n){if(!g)throw new Error("Supabase 客户端未初始化");const{data:r,error:o}=await Y(g.auth.signUp({email:e,password:t,options:{data:{display_name:n}}}),15e3,"注册请求超时，请检查网络后重试");if(o)throw o;return r},async signOut(){if(g){try{await Y(g.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}c=null,y=null,K()}},async updateProfile(e){if(!c)throw new Error("未登录");const{data:t,error:n}=await g.from("profiles").update(e).eq("id",c.id).select().single();if(n)throw n;return y=t,K(),t},subscribe(e){qe.add(e);try{e(lt())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{qe.delete(e)}},getAvatarUrl(){return y!=null&&y.avatar_url?y.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(c==null?void 0:c.id)||"default"}`},getDisplayName(){var e,t;return(y==null?void 0:y.display_name)||((e=c==null?void 0:c.user_metadata)==null?void 0:e.display_name)||((t=c==null?void 0:c.email)==null?void 0:t.split("@")[0])||"用户"}};async function qt(e,t){var n;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email);try{const r=(t==null?void 0:t.user)??null,o=c&&r&&c.id!==r.id||!c&&r||c&&!r;c=r,c&&o?await it():c||(y=null)}catch(r){console.error("[authStore] onAuthStateChange 处理异常:",r),y=c?Q():null}A&&(A=!1),K()}async function it(){var n,r,o,a,s;if(!c)return;let e,t;try{const i=await Y(g.from("profiles").select("*").eq("id",c.id).maybeSingle(),8e3,"profiles 查询超时");e=i.data,t=i.error}catch(i){(n=i.message)!=null&&n.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",i.message),y=Q();return}if(t){const i=t==null?void 0:t.code,l=(t==null?void 0:t.hint)||"";i==="PGRST301"||l.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):l.includes("permission")||i==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",i),y=Q();return}if(!e){console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const i=((r=c.user_metadata)==null?void 0:r.nickname)||((o=c.user_metadata)==null?void 0:o.display_name)||((a=c.email)==null?void 0:a.split("@")[0])||"";try{const l=await Y(g.from("profiles").upsert({id:c.id,display_name:i,avatar_url:((s=c.user_metadata)==null?void 0:s.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(l.error){console.warn("[authStore] 自动创建 profile 失败:",l.error.message,"| code:",l.error.code),y=Q();return}try{const u=await Y(g.from("profiles").select("*").eq("id",c.id).maybeSingle(),5e3,"profiles 二次查询超时");if(u.error)console.warn("[authStore] 二次查询 profile 出错:",u.error.message);else if(u.data){y=u.data,console.log("[authStore] profile 自动创建并查询成功");return}}catch(u){console.warn("[authStore] 二次查询 profile 异常:",u.message)}}catch(l){console.warn("[authStore] 自动创建 profile 异常:",l.message)}y=Q();return}y=e}function Q(){var e,t,n,r,o;return c?{id:c.id,username:((e=c.user_metadata)==null?void 0:e.display_name)||((t=c.email)==null?void 0:t.split("@")[0])||"",display_name:((n=c.user_metadata)==null?void 0:n.display_name)||((r=c.email)==null?void 0:r.split("@")[0])||"",avatar_url:((o=c.user_metadata)==null?void 0:o.avatar_url)||null,bio:""}:null}function K(){const e=lt();qe.forEach(t=>{try{t(e)}catch(n){console.warn("[authStore] 订阅回调出错:",n)}})}function lt(){return{user:c,profile:y,loading:A}}function Y(e,t,n){return Promise.race([e,new Promise((r,o)=>setTimeout(()=>o(new Error(n)),t))])}let m=null;function Tt(e){m=e}async function It(e,t){const{count:n,error:r}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(r)throw r;return n>0}async function Mt(e,t){try{const{data:n,error:r}=await m.from("likes").insert({user_id:e,spot_id:t});if(r)throw r;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(N(n,"点赞失败，请检查权限或重试"))}}async function $t(e,t){try{const{data:n,error:r}=await m.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(N(n,"取消点赞失败，请检查权限或重试"))}}async function At(e){const{count:t,error:n}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Pt(e,t){const{count:n,error:r}=await m.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(r)throw r;return n>0}async function Bt(e,t){try{const{data:n,error:r}=await m.from("favorites").insert({user_id:e,spot_id:t});if(r)throw r;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(N(n,"收藏失败，请检查权限或重试"))}}async function Ht(e,t){try{const{data:n,error:r}=await m.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(N(n,"取消收藏失败，请检查权限或重试"))}}async function Nt(e){const{count:t,error:n}=await m.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Ut(e){const{data:t,error:n}=await m.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Dt(e,t,n){try{const{data:r,error:o}=await m.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(o)throw o;return r}catch(r){throw console.error("[db] addComment 失败:",r),new Error(N(r,"评论发表失败，请检查权限或重试"))}}async function Ft(e,t){try{const{data:n,error:r}=await m.from("comments").delete().eq("id",e).eq("user_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(N(n,"评论删除失败，请检查权限或重试"))}}async function Rt(e){const{count:t,error:n}=await m.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Ot(e){const{count:t,error:n}=await m.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function zt(e){const{count:t,error:n}=await m.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function jt(e){const{data:t,error:n}=await m.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((r,o)=>r+(o.views||0),0)}async function Kt(e){const{data:t,error:n}=await m.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Jt(e){const{data:t,error:n}=await m.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Vt(){const{data:e,error:t}=await m.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function Yt(e=10){const{data:t,error:n}=await m.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function Wt(e){const{error:t}=await m.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await m.from("spots").select("views").eq("id",e).maybeSingle(),r=((n==null?void 0:n.views)||0)+1;await m.from("spots").update({views:r}).eq("id",e)}}async function Zt(e){const{data:t,error:n}=await m.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Xt(e,t,n,r){try{const{data:o,error:a}=await m.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:r}).select();if(a)throw a;return o}catch(o){throw console.error("[db] saveSpotImage 失败:",o),new Error(N(o,"图片保存失败，请检查存储权限或重试"))}}async function Gt(e,t){try{const{data:n,error:r}=await m.from("spot_images").delete().eq("id",e).eq("user_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(N(n,"图片删除失败，请检查权限或重试"))}}function N(e,t){const n=e==null?void 0:e.code,r=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:r.includes("JWT")?"认证已过期，请重新登录":r.includes("network")||r.includes("fetch")?"网络连接异常，请检查网络":r.includes("timeout")||r.includes("超时")?"请求超时，请检查网络后重试":t}async function Qt(e){await f.init(e),an(),f.subscribe(t=>{pt(t)})}function en(e){return f.subscribe(({user:t,profile:n})=>{e(t,n)})}function O(){return f.isLoggedIn}async function tn(e,t){return f.signIn(e,t)}async function nn(e,t,n){return f.signUp(e,t,n)}async function ct(){return f.signOut()}async function on(e){return f.updateProfile(e)}function rn(){ut()}let z=null;function be(e,t="success",n=3e3){z||(z=document.createElement("div"),z.id="auth-toast-container",z.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;",document.body.appendChild(z));const r={success:"rgba(16,185,129,0.92)",error:"rgba(239,68,68,0.92)",info:"rgba(59,130,246,0.92)"},o=document.createElement("div");o.style.cssText=`background:${r[t]||r.info};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;text-align:center;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:auth-toast-in 0.3s ease-out;transition:opacity 0.25s ease,transform 0.25s ease;`,o.textContent=e,z.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-12px)",setTimeout(()=>o.remove(),250)},n)}(function(){if(document.getElementById("auth-toast-styles"))return;const t=document.createElement("style");t.id="auth-toast-styles",t.textContent="@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}",document.head.appendChild(t)})();function an(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{f.isLoggedIn?vn():gn("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{_e(),await ct()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{_e(),dt()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&_e()}),sn(),ln(),pn(),cn(),pt({user:f.user})}function sn(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",ie),e.querySelector(".auth-modal-close").addEventListener("click",ie),e.querySelector("#auth-switch-register").addEventListener("click",()=>de("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>de("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,r=e.querySelector("#auth-login-error"),o=e.querySelector("#auth-login-submit");if(!t||!n){r.textContent="请填写邮箱和密码";return}if(!f.supabase){r.textContent="服务未初始化，请刷新页面";return}r.textContent="",o.disabled=!0,o.textContent="登录中...";try{await tn(t,n),ie(),ze()}catch(a){r.textContent=Te(a.message)}finally{o.disabled=!1,o.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),r=e.querySelector("#auth-register-password").value,o=e.querySelector("#auth-register-error"),a=e.querySelector("#auth-register-submit");if(!t){o.textContent="请输入你的昵称",o.style.color="";return}if(!n){o.textContent="请输入邮箱地址",o.style.color="";return}if(!r){o.textContent="请输入密码",o.style.color="";return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){o.textContent="邮箱格式不正确，请检查后重试",o.style.color="";return}if(r.length<6){o.textContent="密码至少需要6位，请重新设置",o.style.color="";return}if(t.length>50){o.textContent="昵称不能超过50个字符",o.style.color="";return}if(!f.supabase){o.textContent="服务未初始化，请刷新页面",o.style.color="";return}o.textContent="",o.style.color="",a.disabled=!0,a.textContent="注册中...";try{const{user:s,session:i}=await nn(n,r,t);if(i){o.style.color="rgba(80, 230, 140, 0.95)",o.textContent="🎉 注册成功！已为您自动登录系统。";const l=t||n.split("@")[0]||"用户";be(`🎉 注册成功！已为您自动登录系统。
欢迎加入旅行地球，${l}！`,"success",3500);const u=setTimeout(()=>{ie(),ze(),delete e.dataset._registerTimer},1200);e.dataset._registerTimer=String(u)}else{o.style.color="rgba(100, 200, 255, 0.95)",o.textContent=`📧 注册成功！请查看邮箱中的确认链接完成验证。
（如未收到，请检查垃圾邮件箱）`;const l=setTimeout(()=>{o.style.color="",de("login"),delete e.dataset._registerTimer},3500);e.dataset._registerTimer=String(l)}}catch(s){const i=Te(s.message);o.style.color="",o.textContent=i,console.error("[auth] 注册失败:",s.message,"| 原始错误:",s)}finally{a.disabled=!1,a.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function ln(){const e=document.createElement("div");e.id="edit-profile-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#edit-profile-submit").addEventListener("click",async()=>{const t=e.querySelector("#edit-display-name").value.trim(),n=e.querySelector("#edit-bio").value.trim(),r=e.querySelector("#edit-avatar-url").value.trim(),o=e.querySelector("#edit-profile-error");if(!t){o.textContent="显示名称不能为空";return}o.textContent="";try{const a={display_name:t,bio:n||"",updated_at:new Date().toISOString()};r&&(a.avatar_url=r),await on(a),e.classList.remove("open"),be("✅ 资料保存成功","success",2e3)}catch(a){o.textContent="保存失败："+a.message}})}function cn(){const e=document.createElement("div");e.id="change-password-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")});const t=e.querySelector("#change-pw-new"),n=e.querySelector("#change-pw-strength");t.addEventListener("input",()=>{const r=t.value;if(!r){n.style.display="none";return}n.style.display="block";const o=un(r);o<2?(n.textContent="🔴 密码强度：弱",n.style.color="rgba(255, 120, 120, 0.9)"):o<4?(n.textContent="🟡 密码强度：中等",n.style.color="rgba(251, 191, 36, 0.9)"):(n.textContent="🟢 密码强度：强",n.style.color="rgba(80, 230, 140, 0.9)")}),e.querySelector("#change-pw-submit").addEventListener("click",async()=>{const r=t.value,o=e.querySelector("#change-pw-confirm").value,a=e.querySelector("#change-pw-error"),s=e.querySelector("#change-pw-submit");if(!r){a.textContent="请输入新密码",a.style.color="";return}if(r.length<6){a.textContent="新密码至少需要6位",a.style.color="";return}if(!o){a.textContent="请再次输入新密码进行确认",a.style.color="";return}if(r!==o){a.textContent="两次输入的密码不一致，请检查后重试",a.style.color="";return}if(!f.supabase){a.textContent="服务未初始化，请刷新页面后重试",a.style.color="";return}a.textContent="",a.style.color="",s.disabled=!0,s.textContent="修改中...";try{const{data:i,error:l}=await f.supabase.auth.updateUser({password:r});if(l)throw l;a.style.color="rgba(80, 230, 140, 0.95)",a.textContent="🔐 密码修改成功！",be("🔐 密码修改成功！下次登录请使用新密码。","success",3500),setTimeout(()=>{e.classList.remove("open"),t.value="",e.querySelector("#change-pw-confirm").value="",n.style.display="none",a.textContent="",a.style.color=""},1500)}catch(i){const l=Te(i.message);a.style.color="",a.textContent=l,console.error("[auth] 修改密码失败:",i.message,"| 原始错误:",i)}finally{s.disabled=!1,s.textContent="确认修改"}}),e.addEventListener("keydown",r=>{if(r.key==="Enter"){const o=e.querySelector("#change-pw-submit");o&&!o.disabled&&o.click()}})}function dn(){const e=document.getElementById("change-password-modal");if(!e)return;e.querySelector("#change-pw-new").value="",e.querySelector("#change-pw-confirm").value="";const t=e.querySelector("#change-pw-strength");t&&(t.style.display="none");const n=e.querySelector("#change-pw-error");n&&(n.textContent="",n.style.color=""),e.classList.add("open")}function un(e){let t=0;return e.length>=6&&t++,e.length>=10&&t++,/[0-9]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[!@#$%^&*(),.?":{}|<>]/.test(e)&&t++,t}function dt(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=f.profile;e.querySelector("#edit-display-name").value=(t==null?void 0:t.display_name)||"",e.querySelector("#edit-bio").value=(t==null?void 0:t.bio)||"",e.querySelector("#edit-avatar-url").value=(t==null?void 0:t.avatar_url)||"",e.querySelector("#edit-profile-error").textContent="",e.classList.add("open")}function pn(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{e.classList.remove("open")}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{e.classList.remove("open"),dt()}),e.querySelector("#pc-btn-change-pw").addEventListener("click",()=>{e.classList.remove("open"),dn()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await ct(),be("👋 已退出登录","info",2e3)}catch(n){console.error("[auth] 退出登录失败:",n)}e.classList.remove("open"),t.disabled=!1,t.textContent="🚪 退出登录"})}async function ut(){var a;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),r=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),r.style.display="none",e.classList.add("open"),f.loading){n&&(n.textContent="正在验证身份令牌...");const s=Date.now(),i=5e3,l=100;try{await new Promise((u,v)=>{const S=setInterval(()=>{f.loading?Date.now()-s>i&&(clearInterval(S),v(new Error("timeout"))):(clearInterval(S),u())},l)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!f.isLoggedIn){n&&(n.textContent="请先登录");return}const o=f.user.id;n&&(n.textContent="📡 数据传送中...");try{const s=await Promise.allSettled([G(Ot(o),8e3,"足迹统计"),G(zt(o),8e3,"点赞统计"),G(jt(o),8e3,"浏览量统计"),G(Kt(o),8e3,"足迹列表"),G(Jt(o),8e3,"收藏列表")]),i=(E,b,Ee)=>{var Oe;return E.status==="fulfilled"?E.value:(console.warn(`[profile-center] ⚠️ ${Ee} 加载失败，使用默认值`,((Oe=E.reason)==null?void 0:Oe.message)||E.reason),b)},l=i(s[0],0,"足迹统计"),u=i(s[1],0,"点赞统计"),v=i(s[2],0,"浏览量统计"),S=i(s[3],[],"足迹列表"),x=i(s[4],[],"收藏列表");mn(e,{avatarUrl:f.getAvatarUrl(),displayName:f.getDisplayName(),bio:((a=f.profile)==null?void 0:a.bio)||"",spotCount:l,likeCount:u,views:v,spots:S,favorites:x})}catch(s){console.error("[profile-center] 加载统计失败:",s),fn(e);return}t.style.display="none",r.style.display="flex"}function mn(e,t){const{avatarUrl:n,displayName:r,bio:o,spotCount:a,likeCount:s,views:i,spots:l,favorites:u}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=r,e.querySelector("#pc-bio").textContent=o||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=a??0,e.querySelector("#pc-stat-likes").textContent=s??0,e.querySelector("#pc-stat-views").textContent=i??0,hn(e,l),yn(e,u)}function fn(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const r=t.querySelector("#pc-retry-btn");r&&r.addEventListener("click",()=>ut())}function G(e,t,n){return Promise.race([e,new Promise((r,o)=>setTimeout(()=>o(new Error(`${n} 请求超时`)),t))])}function hn(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(r=>{const o=document.createElement("div");o.className="pc-footprint-item",o.innerHTML=`
      <span class="pc-footprint-name">📍 ${Pe(r.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,o.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:r.id,lng:r.longitude,lat:r.latitude,name:r.name,description:r.description||""}}))}),n.appendChild(o)})}}function yn(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(r=>{const o=r.spots,a=(o==null?void 0:o.id)??r.spot_id;if(!a)return;const s=o!=null&&o.name?`⭐ ${Pe(o.name)}`:`⭐ 景点 #${a}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${s}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{e.classList.remove("open"),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a,lng:(o==null?void 0:o.longitude)??0,lat:(o==null?void 0:o.latitude)??0,name:(o==null?void 0:o.name)||`景点 #${a}`,description:(o==null?void 0:o.description)||""}}))}),n.appendChild(i)})}}function gn(e){const t=document.getElementById("auth-modal");t&&(t.classList.add("open"),de(e))}function ie(){const e=document.getElementById("auth-modal");e&&(e.classList.remove("open"),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function de(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const r=document.getElementById("auth-login-error"),o=document.getElementById("auth-register-error");r&&(r.textContent=""),o&&(o.textContent="",o.style.color="")}function ze(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),r=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),r&&(r.value="");const o=document.getElementById("auth-login-error"),a=document.getElementById("auth-register-error");o&&(o.textContent=""),a&&(a.textContent="",a.style.color="")}function pt(e){var r;const{user:t}=e,n=document.getElementById("auth-user-btn");if(n)if(t){const o=f.getDisplayName(),a=((r=o[0])==null?void 0:r.toUpperCase())||"👤";n.innerHTML=`
        <span class="auth-user-avatar">${a}</span>
        <span class="auth-user-label">${Pe(o)}</span>
      `}else n.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function vn(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function _e(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function Te(e){if(!e)return"未知错误，请稍后重试";const t=e.toLowerCase();return t.includes("already registered")||t.includes("already exists")||t.includes("already been registered")||t.includes("user already registered")?"该邮箱已被注册，请直接登录或使用其他邮箱":t.includes("password should be at least")||t.includes("密码至少需要")?"密码至少需要6位，请重新设置":t.includes("weak password")||t.includes("password is too weak")?"密码强度不足，请使用至少6位的密码（建议包含字母和数字）":t.includes("invalid email")||t.includes("invalid_email")||t.includes("邮箱格式")?"邮箱格式不正确，请检查后重试":t.includes("email rate limit")||t.includes("too many requests")||t.includes("操作过于频繁")?"操作过于频繁，请等待60秒后再试":t.includes("email not confirmed")?"该邮箱尚未完成验证，请先点击确认邮件中的链接":t.includes("signup disabled")||t.includes("registration disabled")?"注册功能暂未开放，请联系管理员":t.includes("banned")||t.includes("disabled")||t.includes("blocked")?"该账号已被禁用，请联系管理员":t.includes("invalid login credentials")||t.includes("invalid credentials")||t.includes("invalid login")||t.includes("邮箱或密码错误")?"邮箱或密码错误，请检查后重试":t.includes("user not found")?"该邮箱尚未注册，请先创建账号":t.includes("same password")||t.includes("password is the same")?"新密码不能与当前密码相同，请更换一个":t.includes("password too short")||t.includes("password must be")?"新密码长度不足，至少需要6位":t.includes("password too weak")||t.includes("password is not strong")?"新密码强度不足，请使用包含字母和数字的密码":t.includes("new password")&&t.includes("required")?"请输入新密码":t.includes("超时")||t.includes("timeout")?"请求超时，请检查网络连接后重试":t.includes("网络")||t.includes("network")||t.includes("fetch")?"网络连接异常，请检查网络后重试":t.includes("abort")||t.includes("取消")?"请求已取消，请重试":t.includes("internal server error")||t.includes("500")?"服务器繁忙，请稍后再试":t.includes("service unavailable")||t.includes("503")?"服务暂不可用，请稍后再试":t.includes("请填写")||t.includes("请输入")||t.includes("至少需要")?e:(console.warn("[auth] 未匹配到中文翻译的错误消息:",e),`操作失败：${e}`)}function Pe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const bn="7dfc44451d8128e329100a0c71fa90b6";async function wn(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(bn)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(u){throw console.error("[geocodeService] 网络请求失败:",u),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let r;try{r=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(r.status!=="1")throw new Error(`高德 API 返回错误: ${r.info||"未知错误"} (status=${r.status})`);if(!r.geocodes||r.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const o=r.geocodes[0],[a,s]=o.location.split(","),i=parseFloat(a),l=parseFloat(s);if(isNaN(i)||isNaN(l))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${l}`),{longitude:i,latitude:l,formattedAddress:o.formatted_address||e}}let mt=!1,ne=null,P=null,Be=!1,k=null,T=null,ae=!1;function je(){return mt}function ft(){const e=document.createElement("div");return e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
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
  `,e.querySelector(".spot-list-close").addEventListener("click",Ie),e.addEventListener("click",t=>{t.target===e&&Ie()}),e}function ht(){k&&(T=k.querySelector("#spot-list-toggle"),T&&T.addEventListener("click",e=>{e.stopPropagation(),ae?Ie():Sn()}))}function Sn(){k&&(k.classList.add("open"),ae=!0,He())}function He(){if(!T)return;const e=T.querySelector(".spot-list-toggle-arrow");ae?(e.style.transform="rotate(180deg)",T.title="收起景区列表",T.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",T.title="展开景区列表",T.classList.remove("spot-list-toggle--open"))}function xn(e,t){k||(k=ft(),document.body.appendChild(k),ht());const n=document.getElementById("spot-list-title"),r=document.getElementById("spot-list-count"),o=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),r&&(r.textContent=e?`${e.length} 个`:""),!e||e.length===0?o&&(o.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):o&&(o.innerHTML=e.map(a=>`
        <div class="spot-list-item" data-spot-id="${a.id}"
             data-lng="${a.longitude}" data-lat="${a.latitude}"
             data-name="${ge(a.name)}"
             data-desc="${ge(a.description||"")}"
             data-is-hot="${a.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${ye(a.name)}</span>
            <span class="spot-list-item-city">${ye(a.city||a.address||"")}</span>
          </div>
          ${a.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
        </div>
      `).join(""),o.querySelectorAll(".spot-list-item").forEach(a=>{a.addEventListener("click",()=>{const s=Number(a.dataset.spotId),i=parseFloat(a.dataset.lng),l=parseFloat(a.dataset.lat),u=a.dataset.name,v=a.dataset.desc,S=a.dataset.isHot==="1";ne&&ne(s,i,l,u,v,S)})})),k.classList.add("open"),ae=!0,He()}function Ie(){k&&k.classList.remove("open"),ae=!1,He()}function yt(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",gt),e}async function En(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((r,o)=>`
      <div class="hot-ranking-item" data-spot-id="${r.id}"
           data-lng="${r.longitude}" data-lat="${r.latitude}"
           data-name="${ge(r.name)}"
           data-desc="${ge(r.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${o<3?"hot-ranking-index--top":""}">${o+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${o<3?"⭐ ":""}${ye(r.name)}</span>
          <span class="hot-ranking-city">${ye(r.city||r.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${r.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.spotId),a=parseFloat(r.dataset.lng),s=parseFloat(r.dataset.lat),i=r.dataset.name,l=r.dataset.desc;ne&&ne(o,a,s,i,l,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function Cn(){P||(P=yt(),document.body.appendChild(P)),P.classList.add("open"),Be=!0}function gt(){P&&P.classList.remove("open"),Be=!1}function Ke(e){mt=e}function _n(e){Be?gt():(Cn(),En(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function kn(e={}){ne=e.onSpotClick||null,k=ft(),document.body.appendChild(k),ht(),P=yt(),document.body.appendChild(P)}function ye(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function ge(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let vt=null,Me=null,Je=null,F=[],le=null,w=null,I=null;function Ln(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function Ve(e){const t=I;if(!t)return;const n=e.trim();if(!n||n.length<1){F=[],$e();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:r,error:o}=await vt.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(o){console.error("[searchSpot] 查询失败:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}F=r||[],$e()}catch(r){console.error("[searchSpot] 搜索异常:",r),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function $e(){const e=I;if(e){if(F.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=F.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${We(t.name)}"
         data-desc="${We(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${Ye(t.name)}</span>
        <span class="spot-search-item-city">${Ye(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>bt(t))})}}function bt(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),r=parseFloat(e.dataset.lat),o=e.dataset.name,a=e.dataset.desc,s=e.dataset.isHot==="1";ue(),w&&(w.value="",pe(!1)),Me&&Me(t,n,r,o,a,s)}function ue(){I&&(I.classList.remove("open"),I.innerHTML=""),F=[]}function pe(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function qn(e={}){vt=e.supabaseClient||null,Me=e.onSpotClick||null,le=Ln(),document.body.appendChild(le),w=document.getElementById("spot-search-input"),I=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");w&&(w.addEventListener("input",()=>{const n=w.value;pe(n.length>0),clearTimeout(Je),Je=setTimeout(()=>Ve(n),300)}),w.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),F.length>0)){const r=I==null?void 0:I.querySelector(".spot-search-item");r&&bt(r)}n.key==="Escape"&&(ue(),w.value="",pe(!1))}),w.addEventListener("focus",()=>{F.length>0?$e():w.value.trim()&&Ve(w.value)})),t&&t.addEventListener("click",()=>{w&&(w.value="",w.focus()),ue(),pe(!1)}),document.addEventListener("click",n=>{le&&!le.contains(n.target)&&ue()})}function Ye(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function We(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let ke=window.innerWidth<768,me=[],ve=null,oe=null,B=null,R=!1;const wt=768,Tn=1024;function St(){const e=window.innerWidth;return e<wt?"mobile":e<Tn?"tablet":"desktop"}function In(e){if(typeof e=="function")return me.push(e),()=>{me=me.filter(t=>t!==e)}}function xt(e){me.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function Mn(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
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
  `,e}function $n(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
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
  `,e}function An(){R||(R=!0,B.classList.add("open"),oe.classList.add("active"),document.body.style.overflow="hidden")}function V(){R&&(R=!1,B.classList.remove("open"),oe.classList.remove("active"),document.body.style.overflow="")}function Pn(e){V(),xt(e)}function Bn(){if(!oe||!B||!ve)return;oe.addEventListener("click",()=>{R?V():An()});const e=B.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",V);const t=B.querySelector(".menu-drawer-close");t&&t.addEventListener("click",V);const n=ve.querySelectorAll("[data-action]"),r=B.querySelectorAll("[data-action]");n.forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.action;a&&xt(a)})}),r.forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.action;a&&Pn(a)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&R&&V()})}let Ze=null;function Hn(){clearTimeout(Ze),Ze=setTimeout(()=>{const e=ke;ke=window.innerWidth<wt,e&&!ke&&R&&V(),Et()},150)}function Et(){const e=St();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function Nn(){Et(),ve=Mn(),document.body.insertBefore(ve,document.body.firstChild),B=$n(),document.body.appendChild(B),oe=document.getElementById("nav-hamburger"),Bn(),window.addEventListener("resize",Hn),console.log("[responsive] 响应式模块初始化完成，当前设备:",St())}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let q=null;const Ne=[];let p=null,h=null,W=!1,Z=!1,Ct=0,j=null;function re(e,t="info",n=6e3){j||(j=document.createElement("div"),j.id="toast-container",j.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 24px);",document.body.appendChild(j));const r={error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"},o=r[t]||r.info,a=document.createElement("div");if(a.className="toast-notification",a.style.cssText=`position:relative;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${o};color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.5;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:toast-slide-in 0.3s ease-out;transition:opacity 0.3s ease,transform 0.3s ease;`,n>0){const i=document.createElement("button");i.textContent="×",i.style.cssText="position:absolute;top:6px;right:10px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;padding:0;",i.addEventListener("click",()=>Xe(a)),a.appendChild(i)}const s=document.createElement("span");return s.style.cssText="display:block;padding-right:22px;white-space:pre-line;",s.textContent=e,a.appendChild(s),j.appendChild(a),n>0&&setTimeout(()=>Xe(a),n),a}function Xe(e){!e||e.dataset._removing==="1"||(e.dataset._removing="1",e.style.opacity="0",e.style.transform="translateX(20px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}(function(){if(document.getElementById("toast-keyframes"))return;const t=document.createElement("style");t.id="toast-keyframes",t.textContent=`
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,document.head.appendChild(t)})();const we="https://dxygnktgxycdqxipvjdj.supabase.co",Un="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA";console.log("[main] Supabase 直连模式: %s",we);if(typeof supabase>"u")throw console.error("%c[main] Supabase SDK 未加载 — CDN 连接失败","color:#ef4444;font-size:15px;font-weight:bold;"),re("服务初始化失败，请刷新页面","error",1e4),new Error("Supabase SDK not loaded");const $=supabase.createClient(we,Un,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[main] Supabase 客户端初始化完成",we);(async function(){try{const t=new AbortController,n=setTimeout(()=>t.abort(),5e3),r=await fetch(`${we}/auth/v1/settings`,{signal:t.signal});clearTimeout(n),r.ok?console.log("[main] Supabase API 可达性验证通过"):console.warn("[main] Supabase API 返回非 200:",r.status)}catch(t){console.error("[main] Supabase API 不可达:",t.message),re(`⚠️ 服务连接失败
地图浏览不受影响`,"error",12e3)}})();const d=document.createElement("div");d.id="spot-sidebar";d.innerHTML=`
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
`;document.body.appendChild(d);const Dn=d.querySelector(".sidebar-overlay"),Fn=d.querySelector(".sidebar-close"),Rn=d.querySelector(".hero-placeholder"),On=d.querySelector(".hero-name"),zn=d.querySelector(".hero-desc"),Ge=d.querySelector(".hero-hot-badge"),fe=d.querySelector(".sidebar-photos-area"),Ae=d.querySelector("#photo-upload-btn"),J=d.querySelector("#photo-file-input"),L=d.querySelector("#photo-upload-status"),he=d.querySelector(".sidebar-comments-area"),Qe=d.querySelector("#comment-login-prompt"),D=d.querySelector("#comment-input"),H=d.querySelector("#comment-submit-btn"),_=d.querySelector("#comment-form-status"),ee=d.querySelector("#btn-like"),et=d.querySelector("#btn-like-icon"),tt=d.querySelector("#btn-like-text"),jn=d.querySelector("#btn-like-count"),te=d.querySelector("#btn-fav"),nt=d.querySelector("#btn-fav-icon"),ot=d.querySelector("#btn-fav-text"),Kn=d.querySelector("#btn-fav-count"),Jn=d.querySelector("#btn-comment-jump"),Vn=d.querySelector("#btn-comment-count");function Ue(){d.classList.remove("open")}Dn.addEventListener("click",Ue);Fn.addEventListener("click",Ue);async function Yn(e,t){Ue(),ce();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
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
  `,document.body.appendChild(n);const r=n.querySelector(".spot-pioneer-overlay"),o=n.querySelector(".spot-pioneer-close"),a=n.querySelector("#pioneer-submit"),s=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),l=n.querySelector("#pioneer-desc"),u=n.querySelector(".spot-pioneer-coords");r.addEventListener("click",ce),o.addEventListener("click",ce),u.textContent="📍 正在定位...";try{const v=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,x=await(await fetch(v)).json();if(x.status==="1"&&x.regeocode){const E=x.regeocode.formatted_address||"",b=x.regeocode.addressComponent,Ee=(b==null?void 0:b.township)||(b==null?void 0:b.district)||(b==null?void 0:b.city)||E||"";i.placeholder=`如：${Ee||"此处"}`,u.textContent=`📍 ${E||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else u.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{u.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}a.addEventListener("click",async()=>{if(!O()){U();return}const v=i.value.trim(),S=l.value.trim();if(!v){s.textContent="请输入景区名称",s.style.color="rgba(255, 120, 120, 0.95)";return}if(!S){s.textContent="请写下一句话打卡心得",s.style.color="rgba(255, 120, 120, 0.95)";return}s.textContent="正在创建...",s.style.color="rgba(255, 255, 255, 0.7)",a.disabled=!0,a.textContent="⏳ 创建中...";try{const{data:x,error:E}=await $.from("spots").insert({name:v,longitude:e,latitude:t,description:S,creator_id:h.id}).select();if(E)throw E;const b=x[0];De(b),ce(),q.setZoomAndCenter(12,[e,t]),await Se(b.id,b.name,b.description)}catch(x){console.error("[pioneer] 创建景区失败:",x),s.textContent="创建失败："+(x.message||"请检查网络后重试"),s.style.color="rgba(255, 120, 120, 0.95)",a.disabled=!1,a.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",v=>{v.key==="Enter"&&!a.disabled&&a.click()})}function ce(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function De(e){const t=e.is_hot===!0,n=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:#fff;font-size:${t?"13":"12"}px;text-shadow:0 1px 2px rgba(0,0,0,0.8);white-space:nowrap">${t?"⭐ ":""}${X(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t}});n.on("click",()=>Zn(n)),q.add(n),Ne.push(n)}async function Le(){let e=[],t=null;try{if(je())e=await Vt();else{const r=await $.from("spots").select("*");e=r.data||[],t=r.error}}catch(r){t=r}if(t){console.error("[main] 加载景区数据失败:",t),re(`加载景区数据失败
地图浏览不受影响`,"error",8e3);return}Wn(),e.forEach(De);const n=je()?"🔥 热门景区":"📍 全部景区";xn(e,n)}function Wn(){q.clearMap(),Ne.length=0}function rt(e,t,n,r,o,a){var S;if(!q)return;q.setZoomAndCenter(15,[t,n]),Se(e,r,o,a);const s=Ne.find(x=>{var E;return((E=x.getExtData())==null?void 0:E.id)===e});if(!s)return;const i=(S=s.getExtData())==null?void 0:S.isHot,l=s.getLabel(),u=l?l.getContent():"",v=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${X(r)}</div>`;s.setLabel({content:v,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{s.setLabel({content:u,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function Zn(e){Ct=Date.now();const t=e.getExtData();!t||!t.id||(q.setZoomAndCenter(12,e.getPosition()),await Se(t.id,t.name,t.description,t.isHot))}const at=new Map;async function Se(e,t,n,r){p=Number(e),On.textContent=t||"",zn.textContent=n||"暂无介绍",Rn.style.display="flex",r?Ge.style.display="inline-block":Ge.style.display="none";const o=Date.now(),a=at.get(p);(!a||o-a>3e4)&&(at.set(p,o),Wt(p).catch(s=>console.warn("[main] 浏览量更新失败:",s))),fe.innerHTML="",he.innerHTML="",_.textContent="",d.classList.add("open"),_t(),await Xn(),Re(p),await xe(p)}ee.addEventListener("click",async()=>{if(!h){U();return}if(p){ee.disabled=!0;try{W?(await $t(h.id,p),W=!1):(await Mt(h.id,p),W=!0),await se(),Fe()}catch(e){console.error("[main] 点赞操作失败:",e)}finally{ee.disabled=!1}}});te.addEventListener("click",async()=>{if(!h){U();return}if(p){te.disabled=!0;try{Z?(await Ht(h.id,p),Z=!1):(await Bt(h.id,p),Z=!0),await se(),Fe()}catch(e){console.error("[main] 收藏操作失败:",e)}finally{te.disabled=!1}}});Jn.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),O()?setTimeout(()=>D.focus(),400):U())});function Fe(){W?(et.textContent="❤️",tt.textContent="已赞",ee.classList.add("active")):(et.textContent="🤍",tt.textContent="点赞",ee.classList.remove("active")),Z?(nt.textContent="⭐",ot.textContent="已收藏",te.classList.add("active")):(nt.textContent="☆",ot.textContent="收藏",te.classList.remove("active"))}async function se(){if(p)try{const[e,t,n]=await Promise.all([At(p),Nt(p),Rt(p)]);jn.textContent=e>0?e:"",Kn.textContent=t>0?t:"",Vn.textContent=n>0?n:""}catch(e){console.warn("[main] 刷新计数失败:",e)}}async function Xn(){if(!h||!p)W=!1,Z=!1;else try{const[e,t]=await Promise.all([It(h.id,p),Pt(h.id,p)]);W=e,Z=t}catch(e){console.warn("[main] 刷新互动状态失败:",e)}Fe(),await se()}function U(){const e=document.getElementById("auth-modal");e&&e.classList.add("open")}function st(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),r=document.getElementById("add-submit");!e||!t||!n||!r||(O()?(e.style.display="none",t.disabled=!1,n.disabled=!1,r.disabled=!1,r.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,r.disabled=!0,r.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function _t(){O()?(Qe.style.display="none",D.disabled=!1,H.disabled=!1,H.textContent="发表评论",D.placeholder="写下你的评论..."):(Qe.style.display="block",D.disabled=!0,H.disabled=!0,H.textContent="请先登录",D.placeholder="请先登录后再发表评论")}async function Re(e){const[t,n]=await Promise.allSettled([$.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),Zt(e)]),r=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(o=>{o.photo_urls&&Array.isArray(o.photo_urls)&&o.photo_urls.forEach(a=>r.push({url:a,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(o=>r.push({url:o.url,source:"upload",id:o.id,userId:o.user_id})),fe.innerHTML="",r.length>0){const o=document.createElement("div");o.className="photo-grid",[...new Map(r.map(s=>[s.url,s])).values()].forEach(s=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${X(s.url)}" alt="景区照片" loading="lazy" />`,s.source==="upload"&&h&&s.userId===h.id){const l=document.createElement("button");l.className="photo-delete-btn",l.textContent="×",l.title="删除此照片",l.addEventListener("click",async u=>{if(u.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await Gt(s.id,h.id),Re(e)}catch(v){console.error("[main] 删除照片失败:",v)}}),i.appendChild(l)}o.appendChild(i)}),fe.appendChild(o)}else fe.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}Ae.addEventListener("click",()=>{if(!h){U();return}p&&J.click()});J.addEventListener("change",async()=>{const e=J.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){L.textContent="仅支持 JPG / PNG / WEBP 格式",L.style.color="rgba(255, 80, 80, 0.95)",J.value="";return}if(e.size>5*1024*1024){L.textContent="图片不能超过 5MB",L.style.color="rgba(255, 80, 80, 0.95)",J.value="";return}L.textContent="正在上传...",L.style.color="rgba(255, 255, 255, 0.7)",Ae.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),r=Date.now(),o=`${h.id}/${p}/${r}.${n}`,{error:a}=await $.storage.from("spot-images").upload(o,e,{upsert:!1});if(a)throw a;const{data:s}=$.storage.from("spot-images").getPublicUrl(o),i=s.publicUrl;await Xt(p,h.id,o,i),L.textContent="上传成功！",L.style.color="rgba(80, 230, 140, 0.95)",await Re(p),setTimeout(()=>{L.textContent=""},2e3)}catch(n){console.error("[main] 上传照片失败:",n),L.textContent="上传失败："+(n.message||"未知错误"),L.style.color="rgba(255, 80, 80, 0.95)"}finally{Ae.disabled=!1,J.value=""}});async function xe(e){let t;try{t=await Ut(e)}catch(o){console.warn("[main] 加载评论失败:",o),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),he.innerHTML="",t.length===0){he.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const r=document.createElement("div");r.className="comment-list",t.forEach(o=>{const a=Gn(o.created_at),s=o.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.user_id)}`,i=h&&o.user_id===h.id,l=document.createElement("div");l.className="comment-bubble",l.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${X(s)}" alt="" />
        <span class="comment-author-name">${X(o.display_name)}</span>
        <span class="comment-time">${a}</span>
        ${i?`<button class="comment-delete-btn" data-id="${o.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${X(o.content)}</div>
    `,r.appendChild(l)}),he.appendChild(r),r.querySelectorAll(".comment-delete-btn").forEach(o=>{o.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const a=Number(o.dataset.id);o.disabled=!0;try{await Ft(a,h.id),await xe(e),await se()}catch(s){console.error("[main] 删除评论失败:",s),o.disabled=!1}})})}function Gn(e){if(!e)return"";const t=new Date(e),r=new Date-t,o=Math.floor(r/6e4);if(o<1)return"刚刚";if(o<60)return`${o}分钟前`;const a=Math.floor(o/60);if(a<24)return`${a}小时前`;const s=Math.floor(a/24);return s<30?`${s}天前`:t.toLocaleDateString("zh-CN")}function X(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}H.addEventListener("click",async()=>{if(!p){_.textContent="请先点击地球上的景区",_.style.color="rgba(255, 80, 80, 0.95)";return}if(!O()){U();return}const e=D.value.trim();if(!e){_.textContent="请输入评论内容",_.style.color="rgba(255, 80, 80, 0.95)";return}_.textContent="正在发表...",_.style.color="rgba(255, 255, 255, 0.8)",H.disabled=!0;try{await Dt(h.id,p,e)}catch(t){console.error("[main] 发表评论失败:",t),_.textContent="发表失败："+t.message,_.style.color="rgba(255, 80, 80, 0.95)",H.disabled=!1;return}_.textContent="发表成功！",_.style.color="rgba(80, 230, 140, 0.95)",D.value="",await xe(p),await se(),H.disabled=!1,setTimeout(()=>{_.textContent=""},2e3)});const M=document.createElement("div");M.id="add-form";M.innerHTML=`
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
`;document.body.appendChild(M);const C=M.querySelector(".add-form-status"),Qn=M.querySelector("#add-submit");Qn.addEventListener("click",async()=>{if(!O()){U();return}const e=M.querySelector("#field-address").value.trim(),t=M.querySelector("#field-desc").value.trim();if(!e||!t){C.textContent="请完整填写所有字段",C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="正在查询地址...",C.style.color="rgba(255, 255, 255, 0.8)";let n,r;try{const i=await wn(e);n=i.longitude,r=i.latitude}catch(i){console.error("[main] 高德地理编码失败:",i),C.textContent="查询失败："+i.message,C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="正在保存...",C.style.color="rgba(255, 255, 255, 0.8)";const{data:o,error:a}=await $.from("spots").insert({name:e,longitude:n,latitude:r,description:t,creator_id:h.id}).select();if(a){console.error("[main] 添加景区失败:",a),C.textContent="添加失败："+a.message,C.style.color="rgba(255, 80, 80, 0.95)";return}C.textContent="添加成功！",C.style.color="rgba(80, 230, 140, 0.95)",M.querySelector("#field-address").value="",M.querySelector("#field-desc").value="";const s=o[0];De(s),q.setZoomAndCenter(12,[s.longitude,s.latitude]),setTimeout(()=>{C.textContent=""},2e3)});async function eo(){console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e),re("⚠️ 地图服务加载失败，请刷新页面","error",0);return}console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),q=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),q.on("click",e=>{Date.now()-Ct<300||Yn(e.lnglat.getLng(),e.lnglat.getLat())}),kn({onSpotClick:rt}),qn({supabaseClient:$,onSpotClick:rt}),Nn(),In(e=>{switch(e){case"home":Ke(!1),Le();break;case"hot":Ke(!0),Le();break;case"ranking":_n(Yt);break;case"favorites":case"profile":O()?rn():U();break}}),console.log("[调试步骤3/6] 🔐 初始化认证模块...");try{await Qt($),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e),re(`⚠️ 认证服务初始化失败
地图浏览不受影响`,"warn",1e4)}console.log("[调试步骤4/6] 🗄️ 初始化数据库..."),Tt($),console.log("[调试步骤4/6] ✅ 数据库初始化完成"),console.log("[调试步骤5/6] 👤 注册 onAuthChange..."),en((e,t)=>{if(h=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}st(),p&&d.classList.contains("open")&&(_t(),xe(p))}),console.log("[调试步骤5/6] ✅ onAuthChange 就绪"),console.log("[调试步骤6/6] 📍 加载景区数据..."),st(),Le(),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:r,name:o,description:a}=e.detail;q.setZoomAndCenter(14,[n,r]),Se(t,o,a,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}eo();
