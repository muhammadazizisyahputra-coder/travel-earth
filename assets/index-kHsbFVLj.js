(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const Go="7dfc44451d8128e329100a0c71fa90b6",Wo="db200c6e5adf1ae0023dc0d1f8a4e906";window._AMapSecurityConfig={securityJsCode:Wo};window.__amapPromise=new Promise((e,t)=>{const n=document.createElement("script");n.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(Go)}`,n.onload=()=>{console.log("[index] 高德地图 SDK 加载完成"),e()},n.onerror=()=>{console.error("[index] 高德地图 SDK 加载失败"),t(new Error("高德地图 SDK 加载失败"))},document.head.appendChild(n)});function we(e,t){const n=document.getElementById("splash-progress-fill"),r=document.getElementById("splash-status");n&&(n.style.width=Math.min(100,Math.max(0,e))+"%"),r&&t!=null&&(r.textContent=t)}function Xo(){const e=document.getElementById("app-splash");e&&(e.style.opacity="0",e.style.transform="scale(0.98)",e.style.transition="opacity 0.3s ease, transform 0.3s ease",setTimeout(()=>{e.parentNode&&e.remove()},350))}const Zo={fast:150,normal:250,slow:300},I={openDrawer(e){e&&e.classList.add("open")},closeDrawer(e){e&&e.classList.remove("open")},toggleDrawer(e){if(!e)return!1;const t=e.classList.contains("open");return t?e.classList.remove("open"):e.classList.add("open"),!t},openModal(e){e&&e.classList.add("open")},closeModal(e){e&&e.classList.remove("open")},openPage(e){e&&(e.classList.add("open"),document.body.style.overflow="hidden")},closePage(e){e&&(e.classList.remove("open"),document.body.style.overflow="")},get DURATION(){return Zo}},bo="https://dxygnktgxycdqxipvjdj.supabase.co",er="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWdua3RneHljZHF4aXB2amRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTc2ODUsImV4cCI6MjA5NjQ5MzY4NX0.5AiDAVjswj3w8dcUmUw1kb42qaVlKxNBS0k2vBElkUA",tr=window.supabase.createClient(bo,er,{auth:{autoConfirmUser:!0,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}});console.log("[supabaseClient] 硬编码直连模式初始化完成:",bo);const Ne=tr;let H=null,g=null,T=null,te=!0,tn=new Set,_t=null;const N={get isLoggedIn(){return!!g},get loading(){return te},get user(){return g},get profile(){return T},get supabase(){return H},async init(){if(H)return console.warn("[authStore] 已初始化，跳过重复调用"),_t;console.log("[authStore:init] ========== init() 开始执行 =========="),H=Ne;const t=setTimeout(()=>{te&&(console.warn("[authStore] ⚠️ 安全网触发：Supabase %s 超时，强制 _loading = false",H!=null&&H.auth?"getSession":"未初始化"),console.log("[authStore:init] 安全网触发 _profile=%s",T?JSON.stringify({username:T.username}):"null"),te=!1,xe())},3e3),{data:n}=H.auth.onAuthStateChange(nr);return n==null||n.subscription,_t=H.auth.getSession().then(async({data:{session:r}})=>{var s,i,c;clearTimeout(t);const o=(r==null?void 0:r.user)??null,a=g&&o&&g.id===o.id;console.log("[authStore:getSession] session=%s alreadySet=%s _user=%s _profile=%s",((s=o==null?void 0:o.id)==null?void 0:s.slice(0,8))||"null",a,((i=g==null?void 0:g.id)==null?void 0:i.slice(0,8))||"null",T?JSON.stringify({id:(c=T.id)==null?void 0:c.slice(0,8),username:T.username}):"null"),a||(g=o,g?await vo():T=null),te=!1,xe()}).catch(r=>{clearTimeout(t),console.error("[authStore] getSession 失败:",r),te=!1,xe()}),_t},async signIn(e,t){if(!H)throw new Error("Supabase 客户端未初始化");const{data:n,error:r}=await ke(H.auth.signInWithPassword({email:e,password:t}),15e3,"登录请求超时，请检查网络后重试");if(r)throw r;return n},async signUp(e,t){if(!H)throw new Error("Supabase 客户端未初始化");const{data:n,error:r}=await ke(H.auth.signUp({email:e,password:t}),15e3,"注册请求超时，请检查网络后重试");if(r)throw r;return n},async signOut(){if(H){try{await ke(H.auth.signOut(),1e4,"注销请求超时")}catch(e){console.error("[authStore] signOut 失败:",e)}g=null,T=null,xe()}},async updateProfile(e){if(!g)throw new Error("未登录");const{data:t,error:n}=await H.from("profiles").update(e).eq("id",g.id).select("*").single();if(n)throw n;return T=t,xe(),t},subscribe(e){tn.add(e);try{e(wo())}catch(t){console.warn("[authStore] subscribe 初始回调出错:",t)}return()=>{tn.delete(e)}},getAvatarUrl(){return T!=null&&T.avatar_url?T.avatar_url:`https://api.dicebear.com/7.x/avataaars/svg?seed=${(g==null?void 0:g.id)||"default"}`},getDisplayName(){var t,n,r;const e=(T==null?void 0:T.username)||((t=g==null?void 0:g.user_metadata)==null?void 0:t.username)||((n=g==null?void 0:g.email)==null?void 0:n.split("@")[0])||"用户";return console.log("[authStore:getDisplayName] _profile?.username=%s user_metadata?.username=%s email=%s → 最终值=%s",(T==null?void 0:T.username)||"null",((r=g==null?void 0:g.user_metadata)==null?void 0:r.username)||"null",(g==null?void 0:g.email)||"null",e),e}};async function nr(e,t){var n,r,o,a,s;console.log("[authStore] 认证事件:",e,(n=t==null?void 0:t.user)==null?void 0:n.email),console.log("[authStore:onAuthStateChange] 收到事件 event=%s sessionUser=%s _user=%s _profile=%s _loading=%s",e,((o=(r=t==null?void 0:t.user)==null?void 0:r.id)==null?void 0:o.slice(0,8))||"null",((a=g==null?void 0:g.id)==null?void 0:a.slice(0,8))||"null",T?JSON.stringify({id:(s=T.id)==null?void 0:s.slice(0,8),username:T.username}):"null",te);try{const i=(t==null?void 0:t.user)??null,c=g&&i&&g.id!==i.id||!g&&i||g&&!i;g=i,g&&c?await vo():g||(T=null)}catch(i){console.error("[authStore] onAuthStateChange 处理异常:",i),T=g?He():null}te&&(te=!1),xe()}async function vo(){var n,r,o,a,s,i,c;if(!g)return;console.log("[authStore:_fetchProfile] ========== 开始执行 user.id=%s ==========",(n=g.id)==null?void 0:n.slice(0,8));let e,t;try{console.log("[authStore:_fetchProfile] 查询前 user.id=%s",g.id);const l=await ke(H.from("profiles").select("*").eq("id",g.id).maybeSingle(),8e3,"profiles 查询超时");e=l.data,t=l.error,console.log("[authStore:_fetchProfile] 查询结束 data=%s error=%s",e?JSON.stringify({id:(r=e.id)==null?void 0:r.slice(0,8),username:e.username,avatar_url:e.avatar_url}):"null",t?t.code||t.message:"null")}catch(l){console.log("[authStore:_fetchProfile] 查询异常 err=%s",l.message),(o=l.message)!=null&&o.includes("超时")?console.warn("[authStore] profiles 查询超时，使用兜底 profile"):console.error("[authStore] profiles 查询网络异常:",l.message),T=He();return}if(t){const l=t==null?void 0:t.code,d=(t==null?void 0:t.hint)||"";console.log("[authStore:_fetchProfile] 查询出错 code=%s hint=%s message=%s",l,d,t.message),l==="PGRST301"||d.includes("JWT")?console.warn("[authStore] profiles 查询 401 (JWT):",t.message):d.includes("permission")||l==="42501"?console.error("[authStore] profiles 查询 403 (RLS):",t.message):console.warn("[authStore] profiles 查询失败:",t.message,"| code:",l),T=He();return}if(!e){console.log("[authStore:_fetchProfile] data 为 null → 自动创建 profile"),console.log("[authStore] profiles 表无记录，自动创建 (upsert)...");const l=((a=g.user_metadata)==null?void 0:a.nickname)||((s=g.user_metadata)==null?void 0:s.username)||((i=g.email)==null?void 0:i.split("@")[0])||"";try{const d=await ke(H.from("profiles").upsert({id:g.id,username:l,avatar_url:((c=g.user_metadata)==null?void 0:c.avatar_url)||"",bio:""},{onConflict:"id",ignoreDuplicates:!1}),8e3,"profiles 创建超时");if(d.error){console.warn("[authStore] 自动创建 profile 失败:",d.error.message,"| code:",d.error.code),T=He();return}try{const p=await ke(H.from("profiles").select("*").eq("id",g.id).maybeSingle(),5e3,"profiles 二次查询超时");if(p.error)console.warn("[authStore] 二次查询 profile 出错:",p.error.message);else if(p.data){T=p.data,console.log("[authStore:_fetchProfile] upsert后二次查询成功 username=%s",T==null?void 0:T.username),console.log("[authStore] profile 自动创建并查询成功");return}}catch(p){console.warn("[authStore] 二次查询 profile 异常:",p.message)}}catch(d){console.warn("[authStore] 自动创建 profile 异常:",d.message)}T=He();return}T=e,console.log("[authStore:_fetchProfile] _profile = data 正常赋值 username=%s avatar_url=%s",T==null?void 0:T.username,T==null?void 0:T.avatar_url)}function He(){var e,t,n,r,o;return console.log("[authStore:_buildFallbackProfile] ⚠️ 兜底 profile 被调用！_user.id=%s user_metadata.username=%s email=%s",(e=g==null?void 0:g.id)==null?void 0:e.slice(0,8),((t=g==null?void 0:g.user_metadata)==null?void 0:t.username)||"null",(g==null?void 0:g.email)||"null"),console.trace("[authStore:_buildFallbackProfile] 调用栈:"),g?{id:g.id,username:((n=g.user_metadata)==null?void 0:n.username)||((r=g.email)==null?void 0:r.split("@")[0])||"",avatar_url:((o=g.user_metadata)==null?void 0:o.avatar_url)||null,bio:""}:null}function xe(){var t,n,r;const e=wo();console.log("[authStore:_notifyListeners] snapshot.profile=%s snapshot.user=%s _loading=%s",e.profile?JSON.stringify({id:(t=e.profile.id)==null?void 0:t.slice(0,8),username:e.profile.username}):"null",((r=(n=e.user)==null?void 0:n.id)==null?void 0:r.slice(0,8))||"null",e.loading),tn.forEach(o=>{try{o(e)}catch(a){console.warn("[authStore] 订阅回调出错:",a)}})}function wo(){return{user:g,profile:T,loading:te}}function ke(e,t,n){return Promise.race([e,new Promise((r,o)=>setTimeout(()=>o(new Error(n)),t))])}function or(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Ee={},qt,Cn;function rr(){return Cn||(Cn=1,qt=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),qt}var kt={},ie={},Sn;function ye(){if(Sn)return ie;Sn=1;let e;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return ie.getSymbolSize=function(r){if(!r)throw new Error('"version" cannot be null or undefined');if(r<1||r>40)throw new Error('"version" should be in range from 1 to 40');return r*4+17},ie.getSymbolTotalCodewords=function(r){return t[r]},ie.getBCHDigit=function(n){let r=0;for(;n!==0;)r++,n>>>=1;return r},ie.setToSJISFunction=function(r){if(typeof r!="function")throw new Error('"toSJISFunc" is not a valid function.');e=r},ie.isKanjiModeEnabled=function(){return typeof e<"u"},ie.toSJIS=function(r){return e(r)},ie}var Lt={},xn;function ln(){return xn||(xn=1,(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+n)}}e.isValid=function(r){return r&&typeof r.bit<"u"&&r.bit>=0&&r.bit<4},e.from=function(r,o){if(e.isValid(r))return r;try{return t(r)}catch{return o}}})(Lt)),Lt}var Mt,_n;function ar(){if(_n)return Mt;_n=1;function e(){this.buffer=[],this.length=0}return e.prototype={get:function(t){const n=Math.floor(t/8);return(this.buffer[n]>>>7-t%8&1)===1},put:function(t,n){for(let r=0;r<n;r++)this.putBit((t>>>n-r-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const n=Math.floor(this.length/8);this.buffer.length<=n&&this.buffer.push(0),t&&(this.buffer[n]|=128>>>this.length%8),this.length++}},Mt=e,Mt}var Tt,qn;function sr(){if(qn)return Tt;qn=1;function e(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return e.prototype.set=function(t,n,r,o){const a=t*this.size+n;this.data[a]=r,o&&(this.reservedBit[a]=!0)},e.prototype.get=function(t,n){return this.data[t*this.size+n]},e.prototype.xor=function(t,n,r){this.data[t*this.size+n]^=r},e.prototype.isReserved=function(t,n){return this.reservedBit[t*this.size+n]},Tt=e,Tt}var It={},kn;function ir(){return kn||(kn=1,(function(e){const t=ye().getSymbolSize;e.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,a=t(r),s=a===145?26:Math.ceil((a-13)/(2*o-2))*2,i=[a-7];for(let c=1;c<o-1;c++)i[c]=i[c-1]-s;return i.push(6),i.reverse()},e.getPositions=function(r){const o=[],a=e.getRowColCoords(r),s=a.length;for(let i=0;i<s;i++)for(let c=0;c<s;c++)i===0&&c===0||i===0&&c===s-1||i===s-1&&c===0||o.push([a[i],a[c]]);return o}})(It)),It}var Bt={},Ln;function cr(){if(Ln)return Bt;Ln=1;const e=ye().getSymbolSize,t=7;return Bt.getPositions=function(r){const o=e(r);return[[0,0],[o-t,0],[0,o-t]]},Bt}var Pt={},Mn;function lr(){return Mn||(Mn=1,(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},e.from=function(o){return e.isValid(o)?parseInt(o,10):void 0},e.getPenaltyN1=function(o){const a=o.size;let s=0,i=0,c=0,l=null,d=null;for(let p=0;p<a;p++){i=c=0,l=d=null;for(let u=0;u<a;u++){let f=o.get(p,u);f===l?i++:(i>=5&&(s+=t.N1+(i-5)),l=f,i=1),f=o.get(u,p),f===d?c++:(c>=5&&(s+=t.N1+(c-5)),d=f,c=1)}i>=5&&(s+=t.N1+(i-5)),c>=5&&(s+=t.N1+(c-5))}return s},e.getPenaltyN2=function(o){const a=o.size;let s=0;for(let i=0;i<a-1;i++)for(let c=0;c<a-1;c++){const l=o.get(i,c)+o.get(i,c+1)+o.get(i+1,c)+o.get(i+1,c+1);(l===4||l===0)&&s++}return s*t.N2},e.getPenaltyN3=function(o){const a=o.size;let s=0,i=0,c=0;for(let l=0;l<a;l++){i=c=0;for(let d=0;d<a;d++)i=i<<1&2047|o.get(l,d),d>=10&&(i===1488||i===93)&&s++,c=c<<1&2047|o.get(d,l),d>=10&&(c===1488||c===93)&&s++}return s*t.N3},e.getPenaltyN4=function(o){let a=0;const s=o.data.length;for(let c=0;c<s;c++)a+=o.data[c];return Math.abs(Math.ceil(a*100/s/5)-10)*t.N4};function n(r,o,a){switch(r){case e.Patterns.PATTERN000:return(o+a)%2===0;case e.Patterns.PATTERN001:return o%2===0;case e.Patterns.PATTERN010:return a%3===0;case e.Patterns.PATTERN011:return(o+a)%3===0;case e.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(a/3))%2===0;case e.Patterns.PATTERN101:return o*a%2+o*a%3===0;case e.Patterns.PATTERN110:return(o*a%2+o*a%3)%2===0;case e.Patterns.PATTERN111:return(o*a%3+(o+a)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}e.applyMask=function(o,a){const s=a.size;for(let i=0;i<s;i++)for(let c=0;c<s;c++)a.isReserved(c,i)||a.xor(c,i,n(o,c,i))},e.getBestMask=function(o,a){const s=Object.keys(e.Patterns).length;let i=0,c=1/0;for(let l=0;l<s;l++){a(l),e.applyMask(l,o);const d=e.getPenaltyN1(o)+e.getPenaltyN2(o)+e.getPenaltyN3(o)+e.getPenaltyN4(o);e.applyMask(l,o),d<c&&(c=d,i=l)}return i}})(Pt)),Pt}var Ze={},Tn;function Eo(){if(Tn)return Ze;Tn=1;const e=ln(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],n=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return Ze.getBlocksCount=function(o,a){switch(a){case e.L:return t[(o-1)*4+0];case e.M:return t[(o-1)*4+1];case e.Q:return t[(o-1)*4+2];case e.H:return t[(o-1)*4+3];default:return}},Ze.getTotalCodewordsCount=function(o,a){switch(a){case e.L:return n[(o-1)*4+0];case e.M:return n[(o-1)*4+1];case e.Q:return n[(o-1)*4+2];case e.H:return n[(o-1)*4+3];default:return}},Ze}var At={},Re={},In;function dr(){if(In)return Re;In=1;const e=new Uint8Array(512),t=new Uint8Array(256);return(function(){let r=1;for(let o=0;o<255;o++)e[o]=r,t[r]=o,r<<=1,r&256&&(r^=285);for(let o=255;o<512;o++)e[o]=e[o-255]})(),Re.log=function(r){if(r<1)throw new Error("log("+r+")");return t[r]},Re.exp=function(r){return e[r]},Re.mul=function(r,o){return r===0||o===0?0:e[t[r]+t[o]]},Re}var Bn;function ur(){return Bn||(Bn=1,(function(e){const t=dr();e.mul=function(r,o){const a=new Uint8Array(r.length+o.length-1);for(let s=0;s<r.length;s++)for(let i=0;i<o.length;i++)a[s+i]^=t.mul(r[s],o[i]);return a},e.mod=function(r,o){let a=new Uint8Array(r);for(;a.length-o.length>=0;){const s=a[0];for(let c=0;c<o.length;c++)a[c]^=t.mul(o[c],s);let i=0;for(;i<a.length&&a[i]===0;)i++;a=a.slice(i)}return a},e.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let a=0;a<r;a++)o=e.mul(o,new Uint8Array([1,t.exp(a)]));return o}})(At)),At}var Nt,Pn;function pr(){if(Pn)return Nt;Pn=1;const e=ur();function t(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(r){this.degree=r,this.genPoly=e.generateECPolynomial(this.degree)},t.prototype.encode=function(r){if(!this.genPoly)throw new Error("Encoder not initialized");const o=new Uint8Array(r.length+this.degree);o.set(r);const a=e.mod(o,this.genPoly),s=this.degree-a.length;if(s>0){const i=new Uint8Array(this.degree);return i.set(a,s),i}return a},Nt=t,Nt}var $t={},Rt={},Ut={},An;function Co(){return An||(An=1,Ut.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),Ut}var Y={},Nn;function So(){if(Nn)return Y;Nn=1;const e="[0-9]+",t="[A-Z $%*+\\-./:]+";let n="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";n=n.replace(/u/g,"\\u");const r="(?:(?![A-Z0-9 $%*+\\-./:]|"+n+`)(?:.|[\r
]))+`;Y.KANJI=new RegExp(n,"g"),Y.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),Y.BYTE=new RegExp(r,"g"),Y.NUMERIC=new RegExp(e,"g"),Y.ALPHANUMERIC=new RegExp(t,"g");const o=new RegExp("^"+n+"$"),a=new RegExp("^"+e+"$"),s=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return Y.testKanji=function(c){return o.test(c)},Y.testNumeric=function(c){return a.test(c)},Y.testAlphanumeric=function(c){return s.test(c)},Y}var $n;function be(){return $n||($n=1,(function(e){const t=Co(),n=So();e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(a,s){if(!a.ccBits)throw new Error("Invalid mode: "+a);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?a.ccBits[0]:s<27?a.ccBits[1]:a.ccBits[2]},e.getBestModeForData=function(a){return n.testNumeric(a)?e.NUMERIC:n.testAlphanumeric(a)?e.ALPHANUMERIC:n.testKanji(a)?e.KANJI:e.BYTE},e.toString=function(a){if(a&&a.id)return a.id;throw new Error("Invalid mode")},e.isValid=function(a){return a&&a.bit&&a.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+o)}}e.from=function(a,s){if(e.isValid(a))return a;try{return r(a)}catch{return s}}})(Rt)),Rt}var Rn;function fr(){return Rn||(Rn=1,(function(e){const t=ye(),n=Eo(),r=ln(),o=be(),a=Co(),s=7973,i=t.getBCHDigit(s);function c(u,f,h){for(let m=1;m<=40;m++)if(f<=e.getCapacity(m,h,u))return m}function l(u,f){return o.getCharCountIndicator(u,f)+4}function d(u,f){let h=0;return u.forEach(function(m){const P=l(m.mode,f);h+=P+m.getBitsLength()}),h}function p(u,f){for(let h=1;h<=40;h++)if(d(u,h)<=e.getCapacity(h,f,o.MIXED))return h}e.from=function(f,h){return a.isValid(f)?parseInt(f,10):h},e.getCapacity=function(f,h,m){if(!a.isValid(f))throw new Error("Invalid QR Code version");typeof m>"u"&&(m=o.BYTE);const P=t.getSymbolTotalCodewords(f),v=n.getTotalCodewordsCount(f,h),E=(P-v)*8;if(m===o.MIXED)return E;const _=E-l(m,f);switch(m){case o.NUMERIC:return Math.floor(_/10*3);case o.ALPHANUMERIC:return Math.floor(_/11*2);case o.KANJI:return Math.floor(_/13);case o.BYTE:default:return Math.floor(_/8)}},e.getBestVersionForData=function(f,h){let m;const P=r.from(h,r.M);if(Array.isArray(f)){if(f.length>1)return p(f,P);if(f.length===0)return 1;m=f[0]}else m=f;return c(m.mode,m.getLength(),P)},e.getEncodedBits=function(f){if(!a.isValid(f)||f<7)throw new Error("Invalid QR Code version");let h=f<<12;for(;t.getBCHDigit(h)-i>=0;)h^=s<<t.getBCHDigit(h)-i;return f<<12|h}})($t)),$t}var Dt={},Un;function mr(){if(Un)return Dt;Un=1;const e=ye(),t=1335,n=21522,r=e.getBCHDigit(t);return Dt.getEncodedBits=function(a,s){const i=a.bit<<3|s;let c=i<<10;for(;e.getBCHDigit(c)-r>=0;)c^=t<<e.getBCHDigit(c)-r;return(i<<10|c)^n},Dt}var Ht={},Ft,Dn;function hr(){if(Dn)return Ft;Dn=1;const e=be();function t(n){this.mode=e.NUMERIC,this.data=n.toString()}return t.getBitsLength=function(r){return 10*Math.floor(r/3)+(r%3?r%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(r){let o,a,s;for(o=0;o+3<=this.data.length;o+=3)a=this.data.substr(o,3),s=parseInt(a,10),r.put(s,10);const i=this.data.length-o;i>0&&(a=this.data.substr(o),s=parseInt(a,10),r.put(s,i*3+1))},Ft=t,Ft}var zt,Hn;function gr(){if(Hn)return zt;Hn=1;const e=be(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function n(r){this.mode=e.ALPHANUMERIC,this.data=r}return n.getBitsLength=function(o){return 11*Math.floor(o/2)+6*(o%2)},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(o){let a;for(a=0;a+2<=this.data.length;a+=2){let s=t.indexOf(this.data[a])*45;s+=t.indexOf(this.data[a+1]),o.put(s,11)}this.data.length%2&&o.put(t.indexOf(this.data[a]),6)},zt=n,zt}var Ot,Fn;function yr(){if(Fn)return Ot;Fn=1;const e=be();function t(n){this.mode=e.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}return t.getBitsLength=function(r){return r*8},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(n){for(let r=0,o=this.data.length;r<o;r++)n.put(this.data[r],8)},Ot=t,Ot}var jt,zn;function br(){if(zn)return jt;zn=1;const e=be(),t=ye();function n(r){this.mode=e.KANJI,this.data=r}return n.getBitsLength=function(o){return o*13},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(r){let o;for(o=0;o<this.data.length;o++){let a=t.toSJIS(this.data[o]);if(a>=33088&&a<=40956)a-=33088;else if(a>=57408&&a<=60351)a-=49472;else throw new Error("Invalid SJIS character: "+this.data[o]+`
Make sure your charset is UTF-8`);a=(a>>>8&255)*192+(a&255),r.put(a,13)}},jt=n,jt}var Jt={exports:{}},On;function vr(){return On||(On=1,(function(e){var t={single_source_shortest_paths:function(n,r,o){var a={},s={};s[r]=0;var i=t.PriorityQueue.make();i.push(r,0);for(var c,l,d,p,u,f,h,m,P;!i.empty();){c=i.pop(),l=c.value,p=c.cost,u=n[l]||{};for(d in u)u.hasOwnProperty(d)&&(f=u[d],h=p+f,m=s[d],P=typeof s[d]>"u",(P||m>h)&&(s[d]=h,i.push(d,h),a[d]=l))}if(typeof o<"u"&&typeof s[o]>"u"){var v=["Could not find a path from ",r," to ",o,"."].join("");throw new Error(v)}return a},extract_shortest_path_from_predecessor_list:function(n,r){for(var o=[],a=r;a;)o.push(a),n[a],a=n[a];return o.reverse(),o},find_path:function(n,r,o){var a=t.single_source_shortest_paths(n,r,o);return t.extract_shortest_path_from_predecessor_list(a,o)},PriorityQueue:{make:function(n){var r=t.PriorityQueue,o={},a;n=n||{};for(a in r)r.hasOwnProperty(a)&&(o[a]=r[a]);return o.queue=[],o.sorter=n.sorter||r.default_sorter,o},default_sorter:function(n,r){return n.cost-r.cost},push:function(n,r){var o={value:n,cost:r};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(Jt)),Jt.exports}var jn;function wr(){return jn||(jn=1,(function(e){const t=be(),n=hr(),r=gr(),o=yr(),a=br(),s=So(),i=ye(),c=vr();function l(v){return unescape(encodeURIComponent(v)).length}function d(v,E,_){const q=[];let D;for(;(D=v.exec(_))!==null;)q.push({data:D[0],index:D.index,mode:E,length:D[0].length});return q}function p(v){const E=d(s.NUMERIC,t.NUMERIC,v),_=d(s.ALPHANUMERIC,t.ALPHANUMERIC,v);let q,D;return i.isKanjiModeEnabled()?(q=d(s.BYTE,t.BYTE,v),D=d(s.KANJI,t.KANJI,v)):(q=d(s.BYTE_KANJI,t.BYTE,v),D=[]),E.concat(_,q,D).sort(function(w,x){return w.index-x.index}).map(function(w){return{data:w.data,mode:w.mode,length:w.length}})}function u(v,E){switch(E){case t.NUMERIC:return n.getBitsLength(v);case t.ALPHANUMERIC:return r.getBitsLength(v);case t.KANJI:return a.getBitsLength(v);case t.BYTE:return o.getBitsLength(v)}}function f(v){return v.reduce(function(E,_){const q=E.length-1>=0?E[E.length-1]:null;return q&&q.mode===_.mode?(E[E.length-1].data+=_.data,E):(E.push(_),E)},[])}function h(v){const E=[];for(let _=0;_<v.length;_++){const q=v[_];switch(q.mode){case t.NUMERIC:E.push([q,{data:q.data,mode:t.ALPHANUMERIC,length:q.length},{data:q.data,mode:t.BYTE,length:q.length}]);break;case t.ALPHANUMERIC:E.push([q,{data:q.data,mode:t.BYTE,length:q.length}]);break;case t.KANJI:E.push([q,{data:q.data,mode:t.BYTE,length:l(q.data)}]);break;case t.BYTE:E.push([{data:q.data,mode:t.BYTE,length:l(q.data)}])}}return E}function m(v,E){const _={},q={start:{}};let D=["start"];for(let y=0;y<v.length;y++){const w=v[y],x=[];for(let b=0;b<w.length;b++){const L=w[b],C=""+y+b;x.push(C),_[C]={node:L,lastCount:0},q[C]={};for(let k=0;k<D.length;k++){const S=D[k];_[S]&&_[S].node.mode===L.mode?(q[S][C]=u(_[S].lastCount+L.length,L.mode)-u(_[S].lastCount,L.mode),_[S].lastCount+=L.length):(_[S]&&(_[S].lastCount=L.length),q[S][C]=u(L.length,L.mode)+4+t.getCharCountIndicator(L.mode,E))}}D=x}for(let y=0;y<D.length;y++)q[D[y]].end=0;return{map:q,table:_}}function P(v,E){let _;const q=t.getBestModeForData(v);if(_=t.from(E,q),_!==t.BYTE&&_.bit<q.bit)throw new Error('"'+v+'" cannot be encoded with mode '+t.toString(_)+`.
 Suggested mode is: `+t.toString(q));switch(_===t.KANJI&&!i.isKanjiModeEnabled()&&(_=t.BYTE),_){case t.NUMERIC:return new n(v);case t.ALPHANUMERIC:return new r(v);case t.KANJI:return new a(v);case t.BYTE:return new o(v)}}e.fromArray=function(E){return E.reduce(function(_,q){return typeof q=="string"?_.push(P(q,null)):q.data&&_.push(P(q.data,q.mode)),_},[])},e.fromString=function(E,_){const q=p(E,i.isKanjiModeEnabled()),D=h(q),y=m(D,_),w=c.find_path(y.map,"start","end"),x=[];for(let b=1;b<w.length-1;b++)x.push(y.table[w[b]].node);return e.fromArray(f(x))},e.rawSplit=function(E){return e.fromArray(p(E,i.isKanjiModeEnabled()))}})(Ht)),Ht}var Jn;function Er(){if(Jn)return kt;Jn=1;const e=ye(),t=ln(),n=ar(),r=sr(),o=ir(),a=cr(),s=lr(),i=Eo(),c=pr(),l=fr(),d=mr(),p=be(),u=wr();function f(y,w){const x=y.size,b=a.getPositions(w);for(let L=0;L<b.length;L++){const C=b[L][0],k=b[L][1];for(let S=-1;S<=7;S++)if(!(C+S<=-1||x<=C+S))for(let M=-1;M<=7;M++)k+M<=-1||x<=k+M||(S>=0&&S<=6&&(M===0||M===6)||M>=0&&M<=6&&(S===0||S===6)||S>=2&&S<=4&&M>=2&&M<=4?y.set(C+S,k+M,!0,!0):y.set(C+S,k+M,!1,!0))}}function h(y){const w=y.size;for(let x=8;x<w-8;x++){const b=x%2===0;y.set(x,6,b,!0),y.set(6,x,b,!0)}}function m(y,w){const x=o.getPositions(w);for(let b=0;b<x.length;b++){const L=x[b][0],C=x[b][1];for(let k=-2;k<=2;k++)for(let S=-2;S<=2;S++)k===-2||k===2||S===-2||S===2||k===0&&S===0?y.set(L+k,C+S,!0,!0):y.set(L+k,C+S,!1,!0)}}function P(y,w){const x=y.size,b=l.getEncodedBits(w);let L,C,k;for(let S=0;S<18;S++)L=Math.floor(S/3),C=S%3+x-8-3,k=(b>>S&1)===1,y.set(L,C,k,!0),y.set(C,L,k,!0)}function v(y,w,x){const b=y.size,L=d.getEncodedBits(w,x);let C,k;for(C=0;C<15;C++)k=(L>>C&1)===1,C<6?y.set(C,8,k,!0):C<8?y.set(C+1,8,k,!0):y.set(b-15+C,8,k,!0),C<8?y.set(8,b-C-1,k,!0):C<9?y.set(8,15-C-1+1,k,!0):y.set(8,15-C-1,k,!0);y.set(b-8,8,1,!0)}function E(y,w){const x=y.size;let b=-1,L=x-1,C=7,k=0;for(let S=x-1;S>0;S-=2)for(S===6&&S--;;){for(let M=0;M<2;M++)if(!y.isReserved(L,S-M)){let se=!1;k<w.length&&(se=(w[k]>>>C&1)===1),y.set(L,S-M,se),C--,C===-1&&(k++,C=7)}if(L+=b,L<0||x<=L){L-=b,b=-b;break}}}function _(y,w,x){const b=new n;x.forEach(function(M){b.put(M.mode.bit,4),b.put(M.getLength(),p.getCharCountIndicator(M.mode,y)),M.write(b)});const L=e.getSymbolTotalCodewords(y),C=i.getTotalCodewordsCount(y,w),k=(L-C)*8;for(b.getLengthInBits()+4<=k&&b.put(0,4);b.getLengthInBits()%8!==0;)b.putBit(0);const S=(k-b.getLengthInBits())/8;for(let M=0;M<S;M++)b.put(M%2?17:236,8);return q(b,y,w)}function q(y,w,x){const b=e.getSymbolTotalCodewords(w),L=i.getTotalCodewordsCount(w,x),C=b-L,k=i.getBlocksCount(w,x),S=b%k,M=k-S,se=Math.floor(b/k),$e=Math.floor(C/k),Ko=$e+1,vn=se-$e,Yo=new c(vn);let Et=0;const Xe=new Array(k),wn=new Array(k);let Ct=0;const Qo=new Uint8Array(y.buffer);for(let ve=0;ve<k;ve++){const xt=ve<M?$e:Ko;Xe[ve]=Qo.slice(Et,Et+xt),wn[ve]=Yo.encode(Xe[ve]),Et+=xt,Ct=Math.max(Ct,xt)}const St=new Uint8Array(b);let En=0,X,Z;for(X=0;X<Ct;X++)for(Z=0;Z<k;Z++)X<Xe[Z].length&&(St[En++]=Xe[Z][X]);for(X=0;X<vn;X++)for(Z=0;Z<k;Z++)St[En++]=wn[Z][X];return St}function D(y,w,x,b){let L;if(Array.isArray(y))L=u.fromArray(y);else if(typeof y=="string"){let se=w;if(!se){const $e=u.rawSplit(y);se=l.getBestVersionForData($e,x)}L=u.fromString(y,se||40)}else throw new Error("Invalid data");const C=l.getBestVersionForData(L,x);if(!C)throw new Error("The amount of data is too big to be stored in a QR Code");if(!w)w=C;else if(w<C)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+C+`.
`);const k=_(w,x,L),S=e.getSymbolSize(w),M=new r(S);return f(M,w),h(M),m(M,w),v(M,x,0),w>=7&&P(M,w),E(M,k),isNaN(b)&&(b=s.getBestMask(M,v.bind(null,M,x))),s.applyMask(b,M),v(M,x,b),{modules:M,version:w,errorCorrectionLevel:x,maskPattern:b,segments:L}}return kt.create=function(w,x){if(typeof w>"u"||w==="")throw new Error("No input text");let b=t.M,L,C;return typeof x<"u"&&(b=t.from(x.errorCorrectionLevel,t.M),L=l.from(x.version),C=s.from(x.maskPattern),x.toSJISFunc&&e.setToSJISFunction(x.toSJISFunc)),D(w,L,b,C)},kt}var Vt={},Kt={},Vn;function xo(){return Vn||(Vn=1,(function(e){function t(n){if(typeof n=="number"&&(n=n.toString()),typeof n!="string")throw new Error("Color should be defined as hex string");let r=n.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+n);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(a){return[a,a]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}e.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin>"u"||r.margin===null||r.margin<0?4:r.margin,a=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:a,scale:a?4:s,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},e.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},e.getImageWidth=function(r,o){const a=e.getScale(r,o);return Math.floor((r+o.margin*2)*a)},e.qrToImageData=function(r,o,a){const s=o.modules.size,i=o.modules.data,c=e.getScale(s,a),l=Math.floor((s+a.margin*2)*c),d=a.margin*c,p=[a.color.light,a.color.dark];for(let u=0;u<l;u++)for(let f=0;f<l;f++){let h=(u*l+f)*4,m=a.color.light;if(u>=d&&f>=d&&u<l-d&&f<l-d){const P=Math.floor((u-d)/c),v=Math.floor((f-d)/c);m=p[i[P*s+v]?1:0]}r[h++]=m.r,r[h++]=m.g,r[h++]=m.b,r[h]=m.a}}})(Kt)),Kt}var Kn;function Cr(){return Kn||(Kn=1,(function(e){const t=xo();function n(o,a,s){o.clearRect(0,0,a.width,a.height),a.style||(a.style={}),a.height=s,a.width=s,a.style.height=s+"px",a.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(a,s,i){let c=i,l=s;typeof c>"u"&&(!s||!s.getContext)&&(c=s,s=void 0),s||(l=r()),c=t.getOptions(c);const d=t.getImageWidth(a.modules.size,c),p=l.getContext("2d"),u=p.createImageData(d,d);return t.qrToImageData(u.data,a,c),n(p,l,d),p.putImageData(u,0,0),l},e.renderToDataURL=function(a,s,i){let c=i;typeof c>"u"&&(!s||!s.getContext)&&(c=s,s=void 0),c||(c={});const l=e.render(a,s,c),d=c.type||"image/png",p=c.rendererOpts||{};return l.toDataURL(d,p.quality)}})(Vt)),Vt}var Yt={},Yn;function Sr(){if(Yn)return Yt;Yn=1;const e=xo();function t(o,a){const s=o.a/255,i=a+'="'+o.hex+'"';return s<1?i+" "+a+'-opacity="'+s.toFixed(2).slice(1)+'"':i}function n(o,a,s){let i=o+a;return typeof s<"u"&&(i+=" "+s),i}function r(o,a,s){let i="",c=0,l=!1,d=0;for(let p=0;p<o.length;p++){const u=Math.floor(p%a),f=Math.floor(p/a);!u&&!l&&(l=!0),o[p]?(d++,p>0&&u>0&&o[p-1]||(i+=l?n("M",u+s,.5+f+s):n("m",c,0),c=0,l=!1),u+1<a&&o[p+1]||(i+=n("h",d),d=0)):c++}return i}return Yt.render=function(a,s,i){const c=e.getOptions(s),l=a.modules.size,d=a.modules.data,p=l+c.margin*2,u=c.color.light.a?"<path "+t(c.color.light,"fill")+' d="M0 0h'+p+"v"+p+'H0z"/>':"",f="<path "+t(c.color.dark,"stroke")+' d="'+r(d,l,c.margin)+'"/>',h='viewBox="0 0 '+p+" "+p+'"',P='<svg xmlns="http://www.w3.org/2000/svg" '+(c.width?'width="'+c.width+'" height="'+c.width+'" ':"")+h+' shape-rendering="crispEdges">'+u+f+`</svg>
`;return typeof i=="function"&&i(null,P),P},Yt}var Qn;function xr(){if(Qn)return Ee;Qn=1;const e=rr(),t=Er(),n=Cr(),r=Sr();function o(a,s,i,c,l){const d=[].slice.call(arguments,1),p=d.length,u=typeof d[p-1]=="function";if(!u&&!e())throw new Error("Callback required as last argument");if(u){if(p<2)throw new Error("Too few arguments provided");p===2?(l=i,i=s,s=c=void 0):p===3&&(s.getContext&&typeof l>"u"?(l=c,c=void 0):(l=c,c=i,i=s,s=void 0))}else{if(p<1)throw new Error("Too few arguments provided");return p===1?(i=s,s=c=void 0):p===2&&!s.getContext&&(c=i,i=s,s=void 0),new Promise(function(f,h){try{const m=t.create(i,c);f(a(m,s,c))}catch(m){h(m)}})}try{const f=t.create(i,c);l(null,a(f,s,c))}catch(f){l(f)}}return Ee.create=t.create,Ee.toCanvas=o.bind(null,n.render),Ee.toDataURL=o.bind(null,n.renderToDataURL),Ee.toString=o.bind(null,function(a,s,i){return r.render(a,i)}),Ee}var _r=xr();const qr=or(_r),kr="https://travel-earth-git-main-yangcheng054-2555s-projects.vercel.app";function Lr(){return kr}function Qe(){const e=Lr(),t=window.location.pathname+window.location.search+window.location.hash,n=e+t,r=document.title||"旅行地球",o=document.querySelector('meta[name="description"]'),a=o?o.getAttribute("content"):"旅行地球 — 探索全世界的精彩景点，记录你的旅行足迹";let s="";const i=document.querySelector('img[src]:not([src=""])');return i&&(s=i.src,s.startsWith("/")&&(s=window.location.origin+s)),{url:n,title:r,summary:a,pic:s}}async function Gn(e){try{const{url:t}=Qe();return await navigator.clipboard.writeText(t),e("✅ 链接已复制","info",3e3),!0}catch(t){return console.error("[shareService] 复制失败:",t),e("❌ 复制失败，请手动复制","error",5e3),!1}}async function Mr(e){if(!navigator.share)return Gn(e);const{url:t,title:n}=Qe();try{return await navigator.share({title:n,text:n,url:t}),!0}catch(r){return r.name==="AbortError"?!1:(console.warn("[shareService] 浏览器分享失败，降级剪贴板:",r),Gn(e))}}function Tr(e){const{url:t,title:n,summary:r,pic:o}=Qe(),a="https://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(t)+"&title="+encodeURIComponent(n)+"&summary="+encodeURIComponent(r)+(o?"&pics="+encodeURIComponent(o):"");try{return window.open(a,"_blank","width=700,height=520"),!0}catch(s){return console.error("[shareService] QQ分享失败:",s),!1}}function Ir(e){const{url:t,title:n,pic:r}=Qe(),o="https://service.weibo.com/share/share.php?title="+encodeURIComponent(n)+"&url="+encodeURIComponent(t)+(r?"&pic="+encodeURIComponent(r):"");try{return window.open(o,"_blank","width=700,height=520"),!0}catch(a){return console.error("[shareService] 微博分享失败:",a),!1}}function Br(){return/MicroMessenger/i.test(navigator.userAgent)}function Pr(e){return Br()?(console.log("[shareService] 微信环境，shareToWechat 尚未接入 JS-SDK"),!0):!1}async function Ar(e,t=220){const n=document.createElement("canvas");return await qr.toCanvas(n,e,{width:t,margin:2,color:{dark:"#e2e8f0",light:"#0f172a00"}}),n}function Nr(e,t="qrcode.png"){const n=document.createElement("a");n.download=t,n.href=e.toDataURL("image/png"),n.click()}let z=null,F=null,Oe=null;function $r(e={}){Oe=e.showToast||Dr,!z&&(z=Rr(),document.body.appendChild(z),Ur())}function dn(){if(!z){console.warn("[shareModal] 未初始化");return}I.openModal(z),document.body.style.overflow="hidden"}function Q(){z&&(I.closeModal(z),document.body.style.overflow="")}function Rr(){const e=document.createElement("div");return e.id="share-modal",e.className="share-modal auth-modal",e.innerHTML=`
    <div class="share-modal-overlay"></div>
    <div class="share-modal-panel">
      <button class="share-modal-close">&times;</button>
      <div class="share-modal-header">
        <h2>📤 分享</h2>
        <p>将当前页面分享给朋友</p>
      </div>
      <div class="share-modal-actions">
        <button class="share-btn" id="share-btn-wechat" data-action="wechat">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg></span>
          <span class="share-btn-label">微信</span>
        </button>
        <button class="share-btn" id="share-btn-qq" data-action="qq">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 16.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a38.97 38.97 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.098.474 3.122 1.333 4.55.676 1.12 1.311.807 2.074.468C9.26 21.785 10.52 22 12 22s2.74-.215 4.322-.745c.762.339 1.398.652 2.074-.468.859-1.428 1.333-3.452 1.333-4.55 0 0 1.563 2.537 2.103 2.472.252-.03.581-1.39-.438-4.673z"/></svg></span>
          <span class="share-btn-label">QQ</span>
        </button>
        <button class="share-btn" id="share-btn-weibo" data-action="weibo">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.194 14.197c-.104-2.168-1.994-3.846-4.037-3.812-1.416.023-2.368.769-2.727 1.748-.36.98.437 2.027 1.76 2.319 1.324.292 2.633-.162 2.896-1.005.145-.462.038-.694-.316-.694-.354 0-.595.292-.694.698-.13.532-.694.799-1.264.665-.57-.134-.857-.611-.64-1.096.43-.965 1.747-1.435 2.934-1.058 1.188.377 1.897 1.497 1.624 2.504-.273 1.007-1.423 1.682-2.577 1.545-1.153-.137-1.847-.954-1.597-1.879.083-.307.208-.472.375-.495.125-.017.25.032.375.145.125.112.167.262.125.45-.083.378.354.727.854.78.5.052.94-.226.984-.635.044-.41-.314-.727-.86-.69-.547.037-.764.394-.817.622-.092.397.075.77.5 1.002.426.232.996.264 1.542.1.546-.166.95-.528 1.094-1.002.143-.474.1-.99-.115-1.446zM12.706 11.563c-2.568-.695-5.587.474-6.717 2.599-1.13 2.125.03 4.391 2.598 5.086 2.568.695 5.587-.474 6.717-2.599 1.13-2.125-.03-4.391-2.598-5.086zM20.162.326c-1.36-.368-2.893.467-3.432 1.876-.538 1.409.14 2.92 1.5 3.287 1.36.368 2.893-.467 3.432-1.876.538-1.409-.14-2.92-1.5-3.287zM14.588 15.897c-.97 2.466-3.404 3.886-5.44 3.204-2.036-.682-2.932-3.243-1.963-5.708.97-2.465 3.404-3.886 5.44-3.204 2.036.682 2.932 3.243 1.963 5.708z"/></svg></span>
          <span class="share-btn-label">微博</span>
        </button>
        <button class="share-btn" id="share-btn-qrcode" data-action="qrcode">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></span>
          <span class="share-btn-label">二维码</span>
        </button>
        <button class="share-btn" id="share-btn-copy" data-action="copy">
          <span class="share-btn-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>
          <span class="share-btn-label">复制链接</span>
        </button>
      </div>
      <button class="share-modal-cancel" id="share-modal-cancel">取消</button>
    </div>
  `,e}function Ur(){z&&(z.querySelector(".share-modal-overlay").addEventListener("click",Q),z.querySelector(".share-modal-close").addEventListener("click",Q),z.querySelector("#share-modal-cancel").addEventListener("click",Q),z.querySelector("#share-btn-wechat").addEventListener("click",()=>{Pr()?Q():(Q(),Wn())}),z.querySelector("#share-btn-qq").addEventListener("click",()=>{Tr()||Oe("❌ QQ分享失败，请稍后再试","error",4e3),Q()}),z.querySelector("#share-btn-weibo").addEventListener("click",()=>{Ir()||Oe("❌ 微博分享失败，请稍后再试","error",4e3),Q()}),z.querySelector("#share-btn-qrcode").addEventListener("click",()=>{Q(),Wn()}),z.querySelector("#share-btn-copy").addEventListener("click",async()=>{await Mr(Oe),Q()}),z.addEventListener("keydown",e=>{e.key==="Escape"&&(Q(),Fe())}))}async function Wn(){const{url:e}=Qe();F&&(F.remove(),F=null),F=document.createElement("div"),F.id="qr-modal",F.className="share-modal auth-modal open",F.innerHTML=`
    <div class="share-modal-overlay"></div>
    <div class="share-modal-panel qr-modal-panel">
      <button class="share-modal-close">&times;</button>
      <div class="share-modal-header">
        <h2>📱 扫码分享</h2>
        <p>请使用微信扫一扫分享</p>
      </div>
      <div class="qr-code-area" id="qr-code-area">
        <div class="qr-loading">生成二维码中...</div>
      </div>
      <div class="qr-tip">扫描二维码即可在微信中打开此页面</div>
      <div class="qr-actions">
        <button class="share-modal-cancel" id="qr-btn-download">📥 下载二维码</button>
        <button class="share-modal-cancel" id="qr-btn-cancel">关闭</button>
      </div>
    </div>
  `,document.body.appendChild(F),document.body.style.overflow="hidden",F.querySelector(".share-modal-overlay").addEventListener("click",Fe),F.querySelector(".share-modal-close").addEventListener("click",Fe),F.querySelector("#qr-btn-cancel").addEventListener("click",Fe),F.addEventListener("keydown",t=>{t.key==="Escape"&&Fe()});try{const t=await Ar(e,220),n=F.querySelector("#qr-code-area");n.innerHTML="",n.appendChild(t),F.querySelector("#qr-btn-download").addEventListener("click",()=>{Nr(t,"share-qrcode.png"),Oe("✅ 二维码已下载","info",2e3)})}catch(t){console.error("[shareModal] 二维码生成失败:",t),F.querySelector("#qr-code-area").innerHTML='<div class="qr-loading">二维码生成失败，请重试</div>'}}function Fe(){F&&(F.remove(),F=null,document.body.style.overflow="")}function Dr(e,t,n){const r=document.createElement("div");r.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);border-left:4px solid "+(t==="error"?"#ef4444":"#3b82f6")+";color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;box-shadow:0 8px 32px rgba(0,0,0,0.45);",r.textContent=e,document.body.appendChild(r),setTimeout(()=>{r.style.opacity="0",r.style.transition="opacity 0.3s",setTimeout(()=>r.remove(),300)},n)}let $=null;function Hr(){$=Ne}async function Fr(e,t){const{count:n,error:r}=await $.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(r)throw r;return n>0}async function zr(e,t){try{const{data:n,error:r}=await $.from("likes").insert({user_id:e,spot_id:t});if(r)throw r;return n}catch(n){throw console.error("[db] likeSpot 失败:",n),new Error(W(n,"点赞失败，请检查权限或重试"))}}async function Or(e,t){try{const{data:n,error:r}=await $.from("likes").delete().eq("user_id",e).eq("spot_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] unlikeSpot 失败:",n),new Error(W(n,"取消点赞失败，请检查权限或重试"))}}async function jr(e){const{count:t,error:n}=await $.from("likes").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Jr(e,t){const{count:n,error:r}=await $.from("favorites").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("spot_id",t);if(r)throw r;return n>0}async function Vr(e,t){try{const{data:n,error:r}=await $.from("favorites").insert({user_id:e,spot_id:t});if(r)throw r;return n}catch(n){throw console.error("[db] favoriteSpot 失败:",n),new Error(W(n,"收藏失败，请检查权限或重试"))}}async function Kr(e,t){try{const{data:n,error:r}=await $.from("favorites").delete().eq("user_id",e).eq("spot_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] unfavoriteSpot 失败:",n),new Error(W(n,"取消收藏失败，请检查权限或重试"))}}async function Yr(e){const{count:t,error:n}=await $.from("favorites").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Qr(e){const{data:t,error:n}=await $.from("comments").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function Gr(e,t,n){try{const{data:r,error:o}=await $.from("comments").insert({user_id:e,spot_id:t,content:n}).select();if(o)throw o;return r}catch(r){throw console.error("[db] addComment 失败:",r),new Error(W(r,"评论发表失败，请检查权限或重试"))}}async function Wr(e,t){try{const{data:n,error:r}=await $.from("comments").delete().eq("id",e).eq("user_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] deleteComment 失败:",n),new Error(W(n,"评论删除失败，请检查权限或重试"))}}async function Xr(e){const{count:t,error:n}=await $.from("comments").select("*",{count:"exact",head:!0}).eq("spot_id",e);if(n)throw n;return t||0}async function Zr(e){const{count:t,error:n}=await $.from("spots").select("*",{count:"exact",head:!0}).eq("creator_id",e);if(n)throw n;return t||0}async function ea(e){const{count:t,error:n}=await $.from("likes").select("*",{count:"exact",head:!0}).eq("user_id",e);if(n)throw n;return t||0}async function ta(e){const{data:t,error:n}=await $.from("spots").select("views").eq("creator_id",e);if(n)throw n;return(t||[]).reduce((r,o)=>r+(o.views||0),0)}async function na(e){const{data:t,error:n}=await $.from("spots").select("*").eq("creator_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function oa(e){const{data:t,error:n}=await $.from("favorites").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function ra(){const{data:e,error:t}=await $.from("spots").select("*").eq("is_hot",!0).order("views",{ascending:!1});if(t)throw t;return e||[]}async function aa(e=10){const{data:t,error:n}=await $.from("spots").select("*").order("views",{ascending:!1}).limit(e);if(n)throw n;return t||[]}async function sa(e){const{error:t}=await $.rpc("increment_spot_views",{spot_id:e});if(t){console.warn("[db] RPC increment_spot_views 不可用，回退 update:",t.message);const{data:n}=await $.from("spots").select("views").eq("id",e).maybeSingle(),r=((n==null?void 0:n.views)||0)+1;await $.from("spots").update({views:r}).eq("id",e)}}async function ia(e){const{data:t,error:n}=await $.from("spot_images").select("*").eq("spot_id",e).order("created_at",{ascending:!1});if(n)throw n;return t}async function ca(e,t,n,r){try{const{data:o,error:a}=await $.from("spot_images").insert({spot_id:e,user_id:t,storage_path:n,url:r}).select();if(a)throw a;return o}catch(o){throw console.error("[db] saveSpotImage 失败:",o),new Error(W(o,"图片保存失败，请检查存储权限或重试"))}}async function la(e,t){try{const{data:n,error:r}=await $.from("spot_images").delete().eq("id",e).eq("user_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] deleteSpotImage 失败:",n),new Error(W(n,"图片删除失败，请检查权限或重试"))}}async function da(e){const{data:t,error:n}=await $.from("user_footprints").select("*").eq("user_id",e);if(n)throw n;return t||[]}async function ua(e,t,n){try{const{data:r,error:o}=await $.from("user_footprints").insert({user_id:e,spot_id:t,city_name:n}).select().single();if(o)throw o;return r}catch(r){throw console.error("[db] addFootprint 失败:",r),new Error(W(r,"点亮足迹失败，请检查权限或重试"))}}async function pa(e,t){try{const{data:n,error:r}=await $.from("user_footprints").delete().eq("user_id",e).eq("spot_id",t);if(r)throw r;return n}catch(n){throw console.error("[db] removeFootprint 失败:",n),new Error(W(n,"取消点亮失败，请检查权限或重试"))}}function W(e,t){const n=e==null?void 0:e.code,r=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在，请检查后重试","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:r.includes("JWT")?"认证已过期，请重新登录":r.includes("network")||r.includes("fetch")?"网络连接异常，请检查网络":r.includes("timeout")||r.includes("超时")?"请求超时，请检查网络后重试":t}async function fa(){await N.init(),va(),N.subscribe(e=>{Mo(e)})}function ma(e){return N.subscribe(({user:t,profile:n})=>{e(t,n)})}function _o(){return N.user}function ae(){return N.isLoggedIn}async function ha(e,t){return N.signIn(e,t)}async function ga(e,t){return N.signUp(e,t)}async function qo(){return N.signOut()}async function ya(e){return N.updateProfile(e)}function ba(){Lo()}let Ce=null;function bt(e,t="success",n=3e3){Ce||(Ce=document.createElement("div"),Ce.id="auth-toast-container",Ce.style.cssText="position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;",document.body.appendChild(Ce));const r={success:"rgba(16,185,129,0.92)",error:"rgba(239,68,68,0.92)",info:"rgba(59,130,246,0.92)"},o=document.createElement("div");o.style.cssText=`background:${r[t]||r.info};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;text-align:center;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:auth-toast-in 0.3s ease-out;transition:opacity 0.25s ease,transform 0.25s ease;`,o.textContent=e,Ce.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-12px)",setTimeout(()=>o.remove(),250)},n)}(function(){if(document.getElementById("auth-toast-styles"))return;const t=document.createElement("style");t.id="auth-toast-styles",t.textContent="@keyframes auth-toast-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}",document.head.appendChild(t)})();function va(){const e=document.createElement("div");e.id="auth-user-btn",e.innerHTML=`
    <span class="auth-user-avatar">👤</span>
    <span class="auth-user-label">登录</span>
  `,e.addEventListener("click",()=>{N.isLoggedIn?Ia():Ta("login")}),document.body.appendChild(e);const t=document.createElement("div");t.id="auth-user-menu",t.className="auth-user-menu",t.innerHTML=`
    <div class="auth-menu-item" id="auth-menu-edit-profile">
      <span class="auth-menu-item-icon">✏️</span> 编辑资料
    </div>
    <div class="auth-menu-item auth-menu-item--danger" id="auth-menu-logout">
      <span class="auth-menu-item-icon">🚪</span> 退出登录
    </div>
  `,t.querySelector("#auth-menu-logout").addEventListener("click",async()=>{Qt(),await qo()}),t.querySelector("#auth-menu-edit-profile").addEventListener("click",()=>{Qt(),ko()}),document.body.appendChild(t),document.addEventListener("click",n=>{!e.contains(n.target)&&!t.contains(n.target)&&Qt()}),wa(),Ea(),_a(),Ca(),Mo({user:N.user,profile:N.profile})}function wa(){const e=document.createElement("div");e.id="auth-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",et),e.querySelector(".auth-modal-close").addEventListener("click",et),e.querySelector("#auth-switch-register").addEventListener("click",()=>at("register")),e.querySelector("#auth-switch-login").addEventListener("click",()=>at("login")),e.querySelector("#auth-login-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-login-email").value.trim(),n=e.querySelector("#auth-login-password").value,r=e.querySelector("#auth-login-error"),o=e.querySelector("#auth-login-submit");if(!t||!n){r.textContent="请填写邮箱和密码";return}if(!N.supabase){r.textContent="服务未初始化，请刷新页面";return}r.textContent="",o.disabled=!0,o.textContent="登录中...";try{await ha(t,n),et(),Xn()}catch(a){r.textContent=nn(a.message)}finally{o.disabled=!1,o.textContent="登录"}}),e.querySelector("#auth-register-submit").addEventListener("click",async()=>{const t=e.querySelector("#auth-register-displayname").value.trim(),n=e.querySelector("#auth-register-email").value.trim(),r=e.querySelector("#auth-register-password").value,o=e.querySelector("#auth-register-error"),a=e.querySelector("#auth-register-submit");if(!t){o.textContent="请输入你的昵称",o.style.color="";return}if(!n){o.textContent="请输入邮箱地址",o.style.color="";return}if(!r){o.textContent="请输入密码",o.style.color="";return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){o.textContent="邮箱格式不正确，请检查后重试",o.style.color="";return}if(r.length<6){o.textContent="密码至少需要6位，请重新设置",o.style.color="";return}if(t.length>50){o.textContent="昵称不能超过50个字符",o.style.color="";return}if(!N.supabase){o.textContent="服务未初始化，请刷新页面",o.style.color="";return}o.textContent="",o.style.color="",a.disabled=!0,a.textContent="注册中...";try{const{user:s,session:i}=await ga(n,r);if(i){if(t)try{await N.updateProfile({username:t})}catch(d){console.warn("[auth] 注册后更新 profile 昵称失败（非致命）:",d)}o.style.color="rgba(80, 230, 140, 0.95)",o.textContent="🎉 注册成功！已为您自动登录系统。";const c=t||n.split("@")[0]||"用户";bt(`🎉 注册成功！已为您自动登录系统。
欢迎加入旅行地球，${c}！`,"success",3500);const l=setTimeout(()=>{et(),Xn(),delete e.dataset._registerTimer},1200);e.dataset._registerTimer=String(l)}else{o.style.color="rgba(100, 200, 255, 0.95)",o.textContent=`📧 注册成功！请查看邮箱中的确认链接完成验证。
（如未收到，请检查垃圾邮件箱）`;const c=setTimeout(()=>{o.style.color="",at("login"),delete e.dataset._registerTimer},3500);e.dataset._registerTimer=String(c)}}catch(s){console.error("Supabase注册深度报错对象:",s),console.error("  · message:",s==null?void 0:s.message),console.error("  · status:",s==null?void 0:s.status),console.error("  · code:",s==null?void 0:s.code),console.error("  · stack:",s==null?void 0:s.stack);const i=nn(s.message);o.style.color="",o.textContent=`${i}
[错误码: ${(s==null?void 0:s.status)||"未知"} | ${(s==null?void 0:s.code)||"N/A"}]`}finally{a.disabled=!1,a.textContent="注册"}}),e.addEventListener("keydown",t=>{t.key==="Enter"&&(e.querySelector("#auth-form-login").style.display!=="none"?e.querySelector("#auth-login-submit").click():e.querySelector("#auth-register-submit").click())})}function Ea(){let e=!1,t="";const n=document.createElement("div");n.id="edit-profile-modal",n.className="auth-modal",n.innerHTML=`
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
  `,document.body.appendChild(n),n.querySelector("#edit-avatar-label");const r=n.querySelector("#edit-avatar-img"),o=n.querySelector("#edit-avatar-hover"),a=n.querySelector("#edit-avatar-hover-text"),s=n.querySelector("#edit-avatar-uploading"),i=n.querySelector("#edit-avatar-file"),c=n.querySelector("#edit-avatar-url"),l=n.querySelector("#edit-display-name"),d=n.querySelector("#edit-bio"),p=n.querySelector("#edit-profile-error"),u=n.querySelector("#edit-profile-submit"),f=n.querySelector("#edit-avatar-hint");function h(m){m?(r.src=m,r.style.display="block",a.textContent="更换头像"):(r.src="",r.style.display="none",a.textContent="设置头像"),o.style.display="",s.style.display="none",e=!1}i.addEventListener("change",async()=>{var v;const m=i.files[0];if(!m)return;const P=5*1024*1024;if(m.size>P){p.textContent="图片不能超过 5MB，请重新选择",i.value="";return}p.textContent="",o.style.display="none",s.style.display="flex",e=!0;try{const E=((v=N.user)==null?void 0:v.id)||"anonymous",_=m.name.split(".").pop()||"jpg",q=`${E}-${Date.now()}.${_}`,{error:D}=await N.supabase.storage.from("avatars").upload(q,m,{upsert:!0});if(D)throw D;const{data:y}=N.supabase.storage.from("avatars").getPublicUrl(q),w=(y==null?void 0:y.publicUrl)||"";if(!w)throw new Error("获取头像 URL 失败");t=w,c.value=w,h(w),f.textContent="头像上传成功 ✓",f.style.color="rgba(80,230,140,0.9)"}catch(E){console.error("[auth] 头像上传失败:",E),p.textContent="头像上传失败："+(E.message||"请检查网络或存储桶权限"),h(t),f.textContent="点击头像更换图片",f.style.color=""}finally{i.value=""}}),n.querySelector(".auth-modal-overlay").addEventListener("click",()=>{I.closeModal(n)}),n.querySelector(".auth-modal-close").addEventListener("click",()=>{I.closeModal(n)}),u.addEventListener("click",async()=>{const m=l.value.trim(),P=d.value.trim(),v=c.value.trim();if(!m){p.textContent="显示名称不能为空";return}if(e){p.textContent="头像正在上传中，请稍候...";return}p.textContent="",u.disabled=!0,u.textContent="保存中...";try{const E={username:m,bio:P||"",updated_at:new Date().toISOString()};v&&(E.avatar_url=v),await ya(E),I.closeModal(n),bt("✅ 资料保存成功","success",2e3)}catch(E){p.textContent="保存失败："+E.message}finally{u.disabled=!1,u.textContent="保存"}}),n._setAvatarUrl=function(m){t=m||"",c.value=t,h(t),f.textContent="点击头像更换图片",f.style.color=""},n._setDisplayName=function(m){l.value=m||""},n._setBio=function(m){d.value=m||""},n._clearError=function(){p.textContent=""}}function Ca(){const e=document.createElement("div");e.id="change-password-modal",e.className="auth-modal",e.innerHTML=`
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
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{I.closeModal(e)}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{I.closeModal(e)});const t=e.querySelector("#change-pw-new"),n=e.querySelector("#change-pw-strength");t.addEventListener("input",()=>{const r=t.value;if(!r){n.style.display="none";return}n.style.display="block";const o=xa(r);o<2?(n.textContent="🔴 密码强度：弱",n.style.color="rgba(255, 120, 120, 0.9)"):o<4?(n.textContent="🟡 密码强度：中等",n.style.color="rgba(251, 191, 36, 0.9)"):(n.textContent="🟢 密码强度：强",n.style.color="rgba(80, 230, 140, 0.9)")}),e.querySelector("#change-pw-submit").addEventListener("click",async()=>{const r=t.value,o=e.querySelector("#change-pw-confirm").value,a=e.querySelector("#change-pw-error"),s=e.querySelector("#change-pw-submit");if(!r){a.textContent="请输入新密码",a.style.color="";return}if(r.length<6){a.textContent="新密码至少需要6位",a.style.color="";return}if(!o){a.textContent="请再次输入新密码进行确认",a.style.color="";return}if(r!==o){a.textContent="两次输入的密码不一致，请检查后重试",a.style.color="";return}if(!N.supabase){a.textContent="服务未初始化，请刷新页面后重试",a.style.color="";return}a.textContent="",a.style.color="",s.disabled=!0,s.textContent="修改中...";try{const{data:i,error:c}=await N.supabase.auth.updateUser({password:r});if(c)throw c;a.style.color="rgba(80, 230, 140, 0.95)",a.textContent="🔐 密码修改成功！",bt("🔐 密码修改成功！下次登录请使用新密码。","success",3500),setTimeout(()=>{I.closeModal(e),t.value="",e.querySelector("#change-pw-confirm").value="",n.style.display="none",a.textContent="",a.style.color=""},1500)}catch(i){const c=nn(i.message);a.style.color="",a.textContent=c,console.error("[auth] 修改密码失败:",i.message,"| 原始错误:",i)}finally{s.disabled=!1,s.textContent="确认修改"}}),e.addEventListener("keydown",r=>{if(r.key==="Enter"){const o=e.querySelector("#change-pw-submit");o&&!o.disabled&&o.click()}})}function Sa(){const e=document.getElementById("change-password-modal");if(!e)return;e.querySelector("#change-pw-new").value="",e.querySelector("#change-pw-confirm").value="";const t=e.querySelector("#change-pw-strength");t&&(t.style.display="none");const n=e.querySelector("#change-pw-error");n&&(n.textContent="",n.style.color=""),I.openModal(e)}function xa(e){let t=0;return e.length>=6&&t++,e.length>=10&&t++,/[0-9]/.test(e)&&t++,/[A-Z]/.test(e)&&t++,/[!@#$%^&*(),.?":{}|<>]/.test(e)&&t++,t}function ko(){const e=document.getElementById("edit-profile-modal");if(!e)return;const t=N.profile;e._setAvatarUrl((t==null?void 0:t.avatar_url)||""),e._setDisplayName((t==null?void 0:t.username)||""),e._setBio((t==null?void 0:t.bio)||""),e._clearError(),I.openModal(e)}function _a(){const e=document.createElement("div");e.id="profile-center-modal",e.className="auth-modal",e.innerHTML=`
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
          <button class="pc-action-btn" id="pc-btn-share" title="分享个人主页">
            <span>📤</span> 分享
          </button>
          <button class="pc-action-btn-logout" id="pc-btn-logout">🚪 退出登录</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelector(".auth-modal-overlay").addEventListener("click",()=>{I.closeModal(e)}),e.querySelector(".auth-modal-close").addEventListener("click",()=>{I.closeModal(e)}),e.querySelector("#pc-btn-edit").addEventListener("click",()=>{I.closeModal(e),ko()}),e.querySelector("#pc-btn-change-pw").addEventListener("click",()=>{I.closeModal(e),Sa()}),e.querySelector("#pc-btn-share").addEventListener("click",()=>{dn()}),e.querySelector("#pc-btn-logout").addEventListener("click",async()=>{const t=e.querySelector("#pc-btn-logout");t.disabled=!0,t.textContent="退出中...";try{await qo(),bt("👋 已退出登录","info",2e3)}catch(n){console.error("[auth] 退出登录失败:",n)}I.closeModal(e),t.disabled=!1,t.textContent="🚪 退出登录"})}async function Lo(){var a;const e=document.getElementById("profile-center-modal");if(!e)return;const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-loading-text"),r=e.querySelector("#profile-center-body");if(t.style.display="flex",n&&(n.textContent="正在连接数据舱..."),r.style.display="none",I.openModal(e),N.loading){n&&(n.textContent="正在验证身份令牌...");const s=Date.now(),i=5e3,c=100;try{await new Promise((l,d)=>{const p=setInterval(()=>{N.loading?Date.now()-s>i&&(clearInterval(p),d(new Error("timeout"))):(clearInterval(p),l())},c)})}catch{n&&(n.textContent="加载超时，请刷新页面后重试");return}}if(!N.isLoggedIn){n&&(n.textContent="请先登录");return}const o=N.user.id;n&&(n.textContent="📡 数据传送中...");try{const s=await Promise.allSettled([Ue(Zr(o),8e3,"足迹统计"),Ue(ea(o),8e3,"点赞统计"),Ue(ta(o),8e3,"浏览量统计"),Ue(na(o),8e3,"足迹列表"),Ue(oa(o),8e3,"收藏列表")]),i=(f,h,m)=>{var P;return f.status==="fulfilled"?f.value:(console.warn(`[profile-center] ⚠️ ${m} 加载失败，使用默认值`,((P=f.reason)==null?void 0:P.message)||f.reason),h)},c=i(s[0],0,"足迹统计"),l=i(s[1],0,"点赞统计"),d=i(s[2],0,"浏览量统计"),p=i(s[3],[],"足迹列表"),u=i(s[4],[],"收藏列表");qa(e,{avatarUrl:N.getAvatarUrl(),displayName:N.getDisplayName(),bio:((a=N.profile)==null?void 0:a.bio)||"",spotCount:c,likeCount:l,views:d,spots:p,favorites:u})}catch(s){console.error("[profile-center] 加载统计失败:",s),ka(e);return}t.style.display="none",r.style.display="flex"}function qa(e,t){const{avatarUrl:n,displayName:r,bio:o,spotCount:a,likeCount:s,views:i,spots:c,favorites:l}=t;e.querySelector("#pc-avatar-img").src=n,e.querySelector("#pc-display-name").textContent=r,e.querySelector("#pc-bio").textContent=o||"还没有个人简介",e.querySelector("#pc-stat-spots").textContent=a??0,e.querySelector("#pc-stat-likes").textContent=s??0,e.querySelector("#pc-stat-views").textContent=i??0,La(e,c),Ma(e,l)}function ka(e){const t=e.querySelector("#profile-center-loading"),n=e.querySelector("#profile-center-body");if(!t||!n)return;t.style.display="block",t.innerHTML=`
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
  `,n.style.display="none";const r=t.querySelector("#pc-retry-btn");r&&r.addEventListener("click",()=>Lo())}function Ue(e,t,n){return Promise.race([e,new Promise((r,o)=>setTimeout(()=>o(new Error(`${n} 请求超时`)),t))])}function La(e,t){const n=e.querySelector("#pc-footprints-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有分享足迹</div>';return}t.forEach(r=>{const o=document.createElement("div");o.className="pc-footprint-item",o.innerHTML=`
      <span class="pc-footprint-name">📍 ${ft(r.name)}</span>
      <span class="pc-footprint-arrow">→</span>
    `,o.addEventListener("click",()=>{I.closeModal(e),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:r.id,lng:r.longitude,lat:r.latitude,name:r.name,description:r.description||""}}))}),n.appendChild(o)})}}function Ma(e,t){const n=e.querySelector("#pc-favorites-list");if(n){if(n.innerHTML="",!t||t.length===0){n.innerHTML='<div class="pc-footprints-empty">还没有收藏景点</div>';return}t.forEach(r=>{const o=r.spots,a=(o==null?void 0:o.id)??r.spot_id;if(!a)return;const s=o!=null&&o.name?`⭐ ${ft(o.name)}`:`⭐ 景点 #${a}`,i=document.createElement("div");i.className="pc-footprint-item",i.innerHTML=`
      <span class="pc-footprint-name">${s}</span>
      <span class="pc-footprint-arrow">→</span>
    `,i.addEventListener("click",()=>{I.closeModal(e),window.dispatchEvent(new CustomEvent("focus-spot",{detail:{spotId:a,lng:(o==null?void 0:o.longitude)??0,lat:(o==null?void 0:o.latitude)??0,name:(o==null?void 0:o.name)||`景点 #${a}`,description:(o==null?void 0:o.description)||""}}))}),n.appendChild(i)})}}function Ta(e){const t=document.getElementById("auth-modal");t&&(I.openModal(t),at(e))}function et(){const e=document.getElementById("auth-modal");e&&(I.closeModal(e),e.dataset._registerTimer&&(clearTimeout(Number(e.dataset._registerTimer)),delete e.dataset._registerTimer))}function at(e){const t=document.getElementById("auth-form-login"),n=document.getElementById("auth-form-register");e==="register"?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");const r=document.getElementById("auth-login-error"),o=document.getElementById("auth-register-error");r&&(r.textContent=""),o&&(o.textContent="",o.style.color="")}function Xn(){const e=document.getElementById("auth-modal");if(!e)return;e.querySelector("#auth-login-email").value="",e.querySelector("#auth-login-password").value="";const t=e.querySelector("#auth-register-displayname"),n=e.querySelector("#auth-register-email"),r=e.querySelector("#auth-register-password");t&&(t.value=""),n&&(n.value=""),r&&(r.value="");const o=document.getElementById("auth-login-error"),a=document.getElementById("auth-register-error");o&&(o.textContent=""),a&&(a.textContent="",a.style.color="")}function Mo(e){var o,a,s;const{user:t,profile:n}=e;console.log("[auth:updateUI] snapshot.profile=%s snapshot.user=%s",n?JSON.stringify({id:(o=n.id)==null?void 0:o.slice(0,8),username:n.username,avatar_url:n.avatar_url}):"null",((a=t==null?void 0:t.id)==null?void 0:a.slice(0,8))||"null");const r=document.getElementById("auth-user-btn");if(r)if(t){const i=N.getDisplayName(),c=(n==null?void 0:n.avatar_url)||"",l=((s=i[0])==null?void 0:s.toUpperCase())||"👤";console.log("[auth:updateUI] 已登录 → 渲染用户名=%s 头像=%s",i,c?"🖼️图片":"首字符:"+l);let d;c?d=`<img src="${ft(c)}" alt="头像" class="auth-user-avatar-img" />`:d=l,r.innerHTML=`
        <span class="auth-user-avatar">${d}</span>
        <span class="auth-user-label">${ft(i)}</span>
      `;const p=r.querySelector(".auth-user-avatar-img");p&&p.addEventListener("error",function(){p.remove(),r.querySelector(".auth-user-avatar").textContent=l},{once:!0})}else r.innerHTML=`
        <span class="auth-user-avatar">👤</span>
        <span class="auth-user-label">登录</span>
      `}function Ia(){const e=document.getElementById("auth-user-menu");e==null||e.classList.toggle("open")}function Qt(){var e;(e=document.getElementById("auth-user-menu"))==null||e.classList.remove("open")}function nn(e){if(!e)return"未知错误，请稍后重试";const t=e.toLowerCase();return t.includes("already registered")||t.includes("already exists")||t.includes("already been registered")||t.includes("user already registered")?"该邮箱已被注册，请直接登录或使用其他邮箱":t.includes("password should be at least")||t.includes("密码至少需要")?"密码至少需要6位，请重新设置":t.includes("weak password")||t.includes("password is too weak")?"密码强度不足，请使用至少6位的密码（建议包含字母和数字）":t.includes("invalid email")||t.includes("invalid_email")||t.includes("邮箱格式")?"邮箱格式不正确，请检查后重试":t.includes("email rate limit")||t.includes("too many requests")||t.includes("操作过于频繁")?"操作过于频繁，请等待60秒后再试":t.includes("email not confirmed")?"该邮箱尚未完成验证，请先点击确认邮件中的链接":t.includes("signup disabled")||t.includes("registration disabled")?"注册功能暂未开放，请联系管理员":t.includes("banned")||t.includes("disabled")||t.includes("blocked")?"该账号已被禁用，请联系管理员":t.includes("invalid login credentials")||t.includes("invalid credentials")||t.includes("invalid login")||t.includes("邮箱或密码错误")?"邮箱或密码错误，请检查后重试":t.includes("user not found")?"该邮箱尚未注册，请先创建账号":t.includes("same password")||t.includes("password is the same")?"新密码不能与当前密码相同，请更换一个":t.includes("password too short")||t.includes("password must be")?"新密码长度不足，至少需要6位":t.includes("password too weak")||t.includes("password is not strong")?"新密码强度不足，请使用包含字母和数字的密码":t.includes("new password")&&t.includes("required")?"请输入新密码":t.includes("超时")||t.includes("timeout")?"请求超时，请检查网络连接后重试":t.includes("网络")||t.includes("network")||t.includes("fetch")?"网络连接异常，请检查网络后重试":t.includes("abort")||t.includes("取消")?"请求已取消，请重试":t.includes("internal server error")||t.includes("500")?"服务器繁忙，请稍后再试":t.includes("service unavailable")||t.includes("503")?"服务暂不可用，请稍后再试":t.includes("请填写")||t.includes("请输入")||t.includes("至少需要")?e:(console.warn("[auth] 未匹配到中文翻译的错误消息:",e),`操作失败：${e}`)}function ft(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Ba="7dfc44451d8128e329100a0c71fa90b6";async function Pa(e){const t=`https://restapi.amap.com/v3/geocode/geo?key=${encodeURIComponent(Ba)}&address=${encodeURIComponent(e)}&output=JSON`;let n;try{n=await fetch(t)}catch(l){throw console.error("[geocodeService] 网络请求失败:",l),new Error("网络请求失败，请检查网络连接后重试")}if(!n.ok)throw new Error(`高德 API 请求失败: HTTP ${n.status}`);let r;try{r=await n.json()}catch{throw new Error("高德 API 返回数据格式异常")}if(r.status!=="1")throw new Error(`高德 API 返回错误: ${r.info||"未知错误"} (status=${r.status})`);if(!r.geocodes||r.geocodes.length===0)throw new Error(`未找到 "${e}" 的地理位置，请检查名称是否正确`);const o=r.geocodes[0],[a,s]=o.location.split(","),i=parseFloat(a),c=parseFloat(s);if(isNaN(i)||isNaN(c))throw new Error("高德 API 返回的经纬度格式异常");return console.log(`[geocodeService] "${e}" → 经度: ${i}, 纬度: ${c}`),{longitude:i,latitude:c,formattedAddress:o.formatted_address||e}}let Le=null,Pe=[],Me=0,st=null;function Aa(e={}){Le=Ne;const{onPostCreated:t}=e;st=t||null;const n=$a();document.body.appendChild(n);const r=n.querySelector(".create-post-overlay"),o=n.querySelector(".create-post-close"),a=n.querySelector("#create-post-cancel"),s=n.querySelector("#create-post-submit"),i=n.querySelector("#create-post-title"),c=n.querySelector("#create-post-content"),l=n.querySelectorAll(".create-post-star"),d=n.querySelector("#create-post-image-input"),p=n.querySelector("#create-post-add-image");n.querySelector(".create-post-image-previews");const u=n.querySelector("#create-post-status");let f=0;function h(){I.closeModal(n),i.value="",c.value="",f=0,Pe=[],Me=0,tt(0),mt(),u.textContent="",u.style.color="",s.disabled=!1,s.textContent="⚡ 发布避雷"}return r.addEventListener("click",h),o.addEventListener("click",h),a.addEventListener("click",h),l.forEach(m=>{m.addEventListener("click",()=>{f=Number(m.dataset.rating),tt(f)}),m.addEventListener("mouseenter",()=>{tt(Number(m.dataset.rating))})}),n.querySelector(".create-post-stars").addEventListener("mouseleave",()=>{tt(f)}),p.addEventListener("click",()=>d.click()),d.addEventListener("change",Ra),s.addEventListener("click",async()=>{const m=i.value.trim(),P=c.value.trim();if(!m){u.textContent="请输入景点名称",u.style.color="rgba(255, 120, 120, 0.95)";return}if(m.length>200){u.textContent="景点名称不能超过200字",u.style.color="rgba(255, 120, 120, 0.95)";return}if(!P){u.textContent="请输入避雷感受",u.style.color="rgba(255, 120, 120, 0.95)";return}if(f<1){u.textContent="请点击星星评分（1-5星）",u.style.color="rgba(255, 120, 120, 0.95)";return}if(Me>0){u.textContent="图片正在上传中，请稍候...",u.style.color="rgba(255, 180, 80, 0.95)";return}u.textContent="正在发布...",u.style.color="rgba(255, 255, 255, 0.7)",s.disabled=!0,s.textContent="⏳ 发布中...";try{const{data:{user:v}}=await Le.auth.getUser();if(!v){u.textContent="登录状态已失效，请重新登录",u.style.color="rgba(255, 120, 120, 0.95)",s.disabled=!1,s.textContent="⚡ 发布避雷";return}const{data:E,error:_}=await Le.from("posts").insert({user_id:v.id,title:m,content:P,image_urls:Pe,rating:f}).select().single();if(_)throw _;h(),typeof st=="function"&&st(E),ze("✅ 避雷帖发布成功！","success",3e3)}catch(v){console.error("[createPost] 发布失败:",v);const E=Ua(v,"发布失败，请检查网络或权限后重试");u.textContent=E,u.style.color="rgba(255, 120, 120, 0.95)",s.disabled=!1,s.textContent="⚡ 发布避雷"}}),n.addEventListener("keydown",m=>{m.key==="Escape"&&h()}),{open:()=>Io()}}function To(){Io()}function Na(e){st=typeof e=="function"?e:null}function Io(){const e=document.getElementById("create-post-modal");I.openModal(e)}function $a(){const e=document.createElement("div");return e.id="create-post-modal",e.className="create-post-modal",e.innerHTML=`
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
  `,e}function tt(e){const t=document.querySelectorAll("#create-post-modal .create-post-star"),n=document.querySelector("#create-post-modal #create-post-rating-text"),r=["","⭐ 非常差","⭐⭐ 较差","⭐⭐⭐ 一般","⭐⭐⭐⭐ 推荐","⭐⭐⭐⭐⭐ 强烈推荐"];t.forEach(o=>{const a=Number(o.dataset.rating);o.classList.toggle("active",a<=e)}),n&&(n.textContent=r[e]||"点击评分")}async function Ra(){const e=document.getElementById("create-post-image-input");if(!e||!e.files.length)return;const t=Array.from(e.files);if(e.value="",Pe.length+t.length+Me>9){ze("最多上传9张照片","warn",3e3);return}for(const n of t){if(!["image/jpeg","image/png","image/webp"].includes(n.type)){ze(`${n.name} 格式不支持，请选择 JPG/PNG/WebP`,"warn",4e3);continue}if(n.size>10*1024*1024){ze(`${n.name} 超过10MB，请压缩后重试`,"warn",4e3);continue}Me++,mt();try{const{data:{user:o}}=await Le.auth.getUser(),a=(o==null?void 0:o.id)||"anonymous",s=n.name.split(".").pop()||"jpg",i=`posts/${a}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${s}`,{error:c}=await Le.storage.from("post-images").upload(i,n,{upsert:!1});if(c)throw c;const{data:l}=Le.storage.from("post-images").getPublicUrl(i),d=(l==null?void 0:l.publicUrl)||"";d&&Pe.push(d)}catch(o){console.error("[createPost] 图片上传失败:",o),ze(`${n.name} 上传失败: ${o.message||"未知错误"}`,"error",5e3)}finally{Me--,mt()}}}function mt(){const e=document.getElementById("create-post-image-previews");if(!e)return;let t="";Pe.forEach((n,r)=>{t+=`
      <div class="create-post-image-item">
        <img src="${Da(n)}" alt="照片${r+1}" />
        <button class="create-post-image-remove" data-idx="${r}" title="移除">×</button>
      </div>
    `});for(let n=0;n<Me;n++)t+=`
      <div class="create-post-image-item uploading">
        <div class="create-post-image-spinner"></div>
      </div>
    `;e.innerHTML=t,e.querySelectorAll(".create-post-image-remove").forEach(n=>{n.addEventListener("click",()=>{const r=Number(n.dataset.idx);Pe.splice(r,1),mt()})})}let De=null;function ze(e,t="info",n=4e3){De||(De=document.createElement("div"),De.style.cssText="position:fixed;top:120px;right:16px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:360px;",document.body.appendChild(De));const r={error:"#ef4444",warn:"#f59e0b",success:"#10b981",info:"#3b82f6"},o=document.createElement("div");o.style.cssText=`background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${r[t]||r.info};color:#e2e8f0;padding:12px 16px;border-radius:8px;font-size:14px;line-height:1.5;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:create-post-toast-in 0.3s ease-out;`,o.textContent=e,De.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(20px)",o.style.transition="opacity 0.3s, transform 0.3s",setTimeout(()=>o.remove(),300)},n)}(function(){if(document.getElementById("create-post-toast-styles"))return;const e=document.createElement("style");e.id="create-post-toast-styles",e.textContent="@keyframes create-post-toast-in { from { opacity:0; transform:translateX(30px) } to { opacity:1; transform:translateX(0) } }",document.head.appendChild(e)})();function Ua(e,t){const n=e==null?void 0:e.code,r=(e==null?void 0:e.message)||"",o={42501:"权限不足，请检查数据库 RLS 策略",23505:"数据已存在，请勿重复操作",23503:"关联数据不存在","42P01":"数据表不存在，请联系管理员",PGRST301:"认证已过期，请重新登录"};return n&&o[n]?o[n]:r.includes("JWT")?"认证已过期，请重新登录":r.includes("network")||r.includes("fetch")?"网络连接异常，请检查网络":t}function Da(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}let Bo=!1,Ke=null,ue=null,un=!1,K=null,ee=null,Ge=!1,pe=new Set;function Zn(){return Bo}function Ha(){return pe}async function Fa(){const e=_o();if(!e){pe.clear();return}try{const t=await da(e.id);pe=new Set(t.map(n=>n.spot_id))}catch(t){console.error("[hotSpots] 加载足迹失败:",t)}}function Po(){const e=document.createElement("div");e.id="spot-list-panel",e.className="spot-list-panel",e.innerHTML=`
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
  `,e.querySelector(".spot-list-close").addEventListener("click",on);const t=e.querySelector("#spot-list-create-post");return t&&t.addEventListener("click",n=>{if(n.stopPropagation(),!ae()){const r=document.getElementById("auth-modal");r&&I.openModal(r);return}To()}),e.addEventListener("click",n=>{n.target===e&&on()}),e}function Ao(){K&&(ee=K.querySelector("#spot-list-toggle"),ee&&ee.addEventListener("click",e=>{e.stopPropagation(),Ge?on():za()}))}function za(){K&&(I.openDrawer(K),Ge=!0,pn())}function pn(){if(!ee)return;const e=ee.querySelector(".spot-list-toggle-arrow");Ge?(e.style.transform="rotate(180deg)",ee.title="收起景区列表",ee.classList.add("spot-list-toggle--open")):(e.style.transform="rotate(0deg)",ee.title="展开景区列表",ee.classList.remove("spot-list-toggle--open"))}function No(e,t){K||(K=Po(),document.body.appendChild(K),Ao());const n=document.getElementById("spot-list-title"),r=document.getElementById("spot-list-count"),o=document.getElementById("spot-list-body");n&&(n.textContent=t||"📍 景区列表"),r&&(r.textContent=e?`${e.length} 个`:""),!e||e.length===0?o&&(o.innerHTML='<p class="spot-list-empty">暂无景区数据</p>'):o&&(o.innerHTML=e.map(a=>{const s=pe.has(a.id),i=s?"✨":"☆",c=s?"spot-list-light-btn--active":"";return`
        <div class="spot-list-item" data-spot-id="${a.id}"
             data-lng="${a.longitude}" data-lat="${a.latitude}"
             data-name="${je(a.name)}"
             data-desc="${je(a.description||"")}"
             data-is-hot="${a.is_hot?"1":"0"}">
          <div class="spot-list-item-main">
            <span class="spot-list-item-name">${ht(a.name)}</span>
            <span class="spot-list-item-city">${ht(a.city||a.address||"")}</span>
          </div>
          ${a.is_hot?'<span class="spot-list-item-badge">🔥 热门</span>':""}
          <button class="spot-list-light-btn ${c}"
                  data-spot-id="${a.id}"
                  data-city-name="${je(a.city||a.address||a.name)}"
                  title="${s?"已点亮":"点亮足迹"}">
            ${i}
          </button>
        </div>
      `}).join(""),o.querySelectorAll(".spot-list-item").forEach(a=>{a.addEventListener("click",s=>{if(s.target.closest(".spot-list-light-btn"))return;const i=Number(a.dataset.spotId),c=parseFloat(a.dataset.lng),l=parseFloat(a.dataset.lat),d=a.dataset.name,p=a.dataset.desc,u=a.dataset.isHot==="1";Ke&&Ke(i,c,l,d,p,u)})}),o.querySelectorAll(".spot-list-light-btn").forEach(a=>{a.addEventListener("click",async s=>{s.stopPropagation();const i=_o();if(!i){const p=document.getElementById("auth-modal");p&&I.openModal(p);return}const c=Number(a.dataset.spotId),l=a.dataset.cityName||"",d=pe.has(c);a.disabled=!0;try{d?(await pa(i.id,c),pe.delete(c)):(await ua(i.id,c,l),pe.add(c));const p=e,u=n?n.textContent:"📍 景区列表";No(p,u)}catch(p){console.error("[hotSpots] 足迹操作失败:",p),a.disabled=!1,Ka(p.message||"操作失败","error")}})})),I.openDrawer(K),Ge=!0,pn()}function on(){I.closeDrawer(K),Ge=!1,pn()}function $o(){const e=document.createElement("div");return e.id="hot-ranking-panel",e.className="hot-ranking-panel",e.innerHTML=`
    <div class="hot-ranking-header">
      <span class="hot-ranking-title">🏆 热门景区 TOP10</span>
      <button class="hot-ranking-close">&times;</button>
    </div>
    <div class="hot-ranking-list" id="hot-ranking-list">
      <p class="hot-ranking-loading">加载中...</p>
    </div>
  `,e.querySelector(".hot-ranking-close").addEventListener("click",Ro),e}async function Oa(e){const t=document.getElementById("hot-ranking-list");if(t)try{const n=await e(10);if(!n||n.length===0){t.innerHTML='<p class="hot-ranking-empty">暂无热门景区数据</p>';return}t.innerHTML=n.map((r,o)=>`
      <div class="hot-ranking-item" data-spot-id="${r.id}"
           data-lng="${r.longitude}" data-lat="${r.latitude}"
           data-name="${je(r.name)}"
           data-desc="${je(r.description||"")}"
           data-is-hot="1">
        <span class="hot-ranking-index ${o<3?"hot-ranking-index--top":""}">${o+1}</span>
        <div class="hot-ranking-info">
          <span class="hot-ranking-name">${o<3?"⭐ ":""}${ht(r.name)}</span>
          <span class="hot-ranking-city">${ht(r.city||r.address||"")}</span>
        </div>
        <span class="hot-ranking-views">👁 ${r.views||0}</span>
      </div>
    `).join(""),t.querySelectorAll(".hot-ranking-item").forEach(r=>{r.addEventListener("click",()=>{const o=Number(r.dataset.spotId),a=parseFloat(r.dataset.lng),s=parseFloat(r.dataset.lat),i=r.dataset.name,c=r.dataset.desc;Ke&&Ke(o,a,s,i,c,!0)})})}catch(n){console.error("[hotSpots] 排行榜加载失败:",n),t.innerHTML='<p class="hot-ranking-empty">排行榜加载失败，请稍后再试</p>'}}function ja(){ue||(ue=$o(),document.body.appendChild(ue)),I.openDrawer(ue),un=!0}function Ro(){I.closeDrawer(ue),un=!1}function eo(e){Bo=e}function Ja(e){un?Ro():(ja(),Oa(e).catch(t=>console.error("[hotSpots] 排行榜刷新失败:",t)))}function Va(e={}){Ke=e.onSpotClick||null,K=Po(),document.body.appendChild(K),Ao(),ue=$o(),document.body.appendChild(ue)}let Gt=null;function Ka(e,t="info"){const n=document.getElementById("spot-list-toast");n&&n.remove(),Gt&&clearTimeout(Gt);const r={error:"#ef4444",success:"#10b981",info:"#3b82f6"},o=document.createElement("div");o.id="spot-list-toast",o.style.cssText=`position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:11000;background:rgba(20,20,30,0.95);backdrop-filter:blur(12px);border-left:4px solid ${r[t]||r.info};color:#e2e8f0;padding:10px 20px;border-radius:8px;font-size:14px;box-shadow:0 8px 32px rgba(0,0,0,0.5);pointer-events:auto;animation:spot-list-toast-in 0.3s ease;`,o.textContent=e,document.body.appendChild(o),Gt=setTimeout(()=>{o.style.opacity="0",o.style.transition="opacity 0.3s",setTimeout(()=>o.remove(),300)},3e3)}(function(){if(document.getElementById("spot-list-toast-style"))return;const e=document.createElement("style");e.id="spot-list-toast-style",e.textContent="@keyframes spot-list-toast-in{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}",document.head.appendChild(e)})();function ht(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function je(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Uo=null,rn=null,to=null,he=[],nt=null,O=null,oe=null;function Ya(){const e=document.createElement("div");return e.id="spot-search-container",e.className="spot-search-container",e.innerHTML=`
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
  `,e}async function no(e){const t=oe;if(!t)return;const n=e.trim();if(!n||n.length<1){he=[],an();return}t.innerHTML='<p class="spot-search-loading">搜索中...</p>',t.classList.add("open");try{const{data:r,error:o}=await Uo.from("spots").select("*").ilike("name",`%${n}%`).limit(20);if(o){console.error("[searchSpot] 查询失败:",o),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>';return}he=r||[],an()}catch(r){console.error("[searchSpot] 搜索异常:",r),t.innerHTML='<p class="spot-search-empty">搜索失败，请稍后重试</p>'}}function an(){const e=oe;if(e){if(he.length===0){e.innerHTML='<p class="spot-search-empty">未找到相关景区</p>',e.classList.add("open");return}e.innerHTML=he.map((t,n)=>`
    <div class="spot-search-item ${n===0?"spot-search-item--first":""}"
         data-index="${n}"
         data-spot-id="${t.id}"
         data-lng="${t.longitude}"
         data-lat="${t.latitude}"
         data-name="${ro(t.name)}"
         data-desc="${ro(t.description||"")}"
         data-is-hot="${t.is_hot?"1":"0"}">
      <span class="spot-search-item-icon">📍</span>
      <div class="spot-search-item-main">
        <span class="spot-search-item-name">${oo(t.name)}</span>
        <span class="spot-search-item-city">${oo(t.city||t.address||"")}</span>
      </div>
      ${t.is_hot?'<span class="spot-search-item-badge">🔥</span>':""}
    </div>
  `).join(""),e.classList.add("open"),e.querySelectorAll(".spot-search-item").forEach(t=>{t.addEventListener("click",()=>Do(t))})}}function Do(e){const t=Number(e.dataset.spotId),n=parseFloat(e.dataset.lng),r=parseFloat(e.dataset.lat),o=e.dataset.name,a=e.dataset.desc,s=e.dataset.isHot==="1";it(),O&&(O.value="",ct(!1)),rn&&rn(t,n,r,o,a,s)}function it(){oe&&(oe.classList.remove("open"),oe.innerHTML=""),he=[]}function ct(e){const t=document.getElementById("spot-search-clear");t&&(t.style.display=e?"flex":"none")}function Qa(e={}){Uo=Ne,rn=e.onSpotClick||null,nt=Ya(),document.body.appendChild(nt),O=document.getElementById("spot-search-input"),oe=document.getElementById("spot-search-dropdown");const t=document.getElementById("spot-search-clear");O&&(O.addEventListener("input",()=>{const n=O.value;ct(n.length>0),clearTimeout(to),to=setTimeout(()=>no(n),300)}),O.addEventListener("keydown",n=>{if(n.key==="Enter"&&(n.preventDefault(),he.length>0)){const r=oe==null?void 0:oe.querySelector(".spot-search-item");r&&Do(r)}n.key==="Escape"&&(it(),O.value="",ct(!1))}),O.addEventListener("focus",()=>{he.length>0?an():O.value.trim()&&no(O.value)})),t&&t.addEventListener("click",()=>{O&&(O.value="",O.focus()),it(),ct(!1)}),document.addEventListener("click",n=>{nt&&!nt.contains(n.target)&&it()})}function oo(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function ro(e){return e?String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}let Wt=window.innerWidth<768,lt=[],gt=null,Ye=null,ce=null,ge=!1;const Ho=768,Ga=1024;function Fo(){const e=window.innerWidth;return e<Ho?"mobile":e<Ga?"tablet":"desktop"}function Wa(e){if(typeof e=="function")return lt.push(e),()=>{lt=lt.filter(t=>t!==e)}}function zo(e){lt.forEach(t=>{try{t(e)}catch(n){console.error("[responsive] 回调执行失败:",n)}})}function Xa(){const e=document.createElement("nav");return e.id="app-navbar",e.className="app-navbar",e.innerHTML=`
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
  `,e}function Za(){const e=document.createElement("div");return e.id="menu-drawer",e.className="menu-drawer",e.innerHTML=`
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
  `,e}function es(){ge||(ge=!0,I.openDrawer(ce),Ye.classList.add("active"),document.body.style.overflow="hidden")}function qe(){ge&&(ge=!1,I.closeDrawer(ce),Ye.classList.remove("active"),document.body.style.overflow="")}function ts(e){qe(),zo(e)}function ns(){if(!Ye||!ce||!gt)return;Ye.addEventListener("click",()=>{ge?qe():es()});const e=ce.querySelector(".menu-drawer-overlay");e&&e.addEventListener("click",qe);const t=ce.querySelector(".menu-drawer-close");t&&t.addEventListener("click",qe);const n=gt.querySelectorAll("[data-action]"),r=ce.querySelectorAll("[data-action]");n.forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.action;a&&zo(a)})}),r.forEach(o=>{o.addEventListener("click",()=>{const a=o.dataset.action;a&&ts(a)})}),document.addEventListener("keydown",o=>{o.key==="Escape"&&ge&&qe()})}let ao=null;function os(){clearTimeout(ao),ao=setTimeout(()=>{const e=Wt;Wt=window.innerWidth<Ho,e&&!Wt&&ge&&qe(),Oo()},150)}function Oo(){const e=Fo();document.body.classList.remove("device-mobile","device-tablet","device-desktop"),document.body.classList.add(`device-${e}`)}function rs(){Oo(),gt=Xa(),document.body.insertBefore(gt,document.body.firstChild),ce=Za(),document.body.appendChild(ce),Ye=document.getElementById("nav-hamburger"),ns(),window.addEventListener("resize",os),console.log("[responsive] 响应式模块初始化完成，当前设备:",Fo())}let fn=null,fe=[],ne="",Xt=!1,A=null;function as(){fn=Ne,A=is(),document.body.appendChild(A),cs(),Na(async e=>{const t=await us(e.user_id),n={...e,profiles:t};fe.unshift(n),yt();const r=A.querySelector(".community-body");r&&(r.scrollTop=0)}),console.log("[community] 社区模块初始化完成（含搜索）")}function ss(){A&&(I.openPage(A),jo())}function so(){A&&I.closePage(A)}function is(){const e=document.createElement("div");return e.id="community-page",e.className="community-page",e.innerHTML=`
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
        <button class="community-share-btn" id="community-share-btn" title="分享此页面">
          📤
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
  `,e}function cs(){if(!A)return;A.querySelector("#community-back-btn").addEventListener("click",so),A.querySelector("#community-create-btn").addEventListener("click",()=>{Zt()}),A.querySelector("#community-empty-btn").addEventListener("click",()=>{Zt()}),A.querySelector("#community-noresults-btn").addEventListener("click",()=>{Zt()}),A.querySelector("#community-retry-btn").addEventListener("click",()=>{jo()});const e=A.querySelector("#community-search-input"),t=A.querySelector("#community-search-clear");let n=null;e.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(()=>{ne=e.value.trim().toLowerCase(),t.style.display=ne?"flex":"none",yt()},250)}),t.addEventListener("click",()=>{e.value="",ne="",t.style.display="none",yt(),e.focus()}),A.addEventListener("keydown",r=>{r.key==="Escape"&&so()}),A.querySelector("#community-share-btn").addEventListener("click",()=>{dn()})}function Zt(){if(!ae()){fs();return}To()}async function jo(){if(Xt)return;Xt=!0;const e=A.querySelector("#community-loading"),t=A.querySelector("#community-error"),n=A.querySelector("#community-empty"),r=A.querySelector("#community-no-results"),o=A.querySelector("#community-grid");e.style.display="flex",t.style.display="none",n.style.display="none",r&&(r.style.display="none"),o.innerHTML="";const a=A.querySelector("#community-search-input"),s=A.querySelector("#community-search-clear");a&&(a.value=""),s&&(s.style.display="none"),ne="";try{const{data:i,error:c}=await fn.from("posts").select("*, profiles(username, avatar_url)").order("created_at",{ascending:!1});if(c)throw c;fe=i||[],e.style.display="none",fe.length===0?n.style.display="flex":yt()}catch(i){console.error("[community] 加载帖子失败:",i),e.style.display="none",t.style.display="flex",A.querySelector("#community-error-msg").textContent="加载失败："+(i.message||"请检查网络后重试")}finally{Xt=!1}}function yt(){const e=A.querySelector("#community-grid"),t=A.querySelector("#community-empty"),n=A.querySelector("#community-no-results"),r=A.querySelector("#community-search-count");if(!e)return;t.style.display="none",n&&(n.style.display="none");let o=fe;if(ne&&(o=fe.filter(a=>{const s=(a.title||"").toLowerCase(),i=(a.content||"").toLowerCase();return s.includes(ne)||i.includes(ne)})),r&&(ne&&fe.length>0?r.textContent=`${o.length}/${fe.length} 条`:r.textContent=""),o.length===0){e.innerHTML="",ne?n&&(n.style.display="flex"):t.style.display="flex";return}e.innerHTML=o.map(a=>ls(a)).join(""),e.querySelectorAll(".community-card-img").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation(),ds(a.src)})})}function ls(e){const t=e.profiles||{},n=en(t.username||"匿名用户"),r=t.avatar_url||"",o=en(e.title||"无标题"),a=en(e.content||""),s=e.rating||0,i=e.image_urls||[],c=ps(e.created_at),l=r?`<img class="community-card-avatar-img" src="${sn(r)}" alt="${n}" />`:'<div class="community-card-avatar-placeholder">👤</div>',d=Array.from({length:5},(u,f)=>`<span class="community-star ${f<s?"active":""}">★</span>`).join("");let p="";return i.length>0&&(p=`<div class="community-card-images">${i.map((f,h)=>`<div class="community-card-img-wrap">
            <img class="community-card-img" src="${sn(f)}" alt="照片${h+1}" loading="lazy" />
          </div>`).join("")}</div>`),`
    <div class="community-card">
      <!-- 作者信息 -->
      <div class="community-card-header">
        <div class="community-card-avatar">
          ${l}
        </div>
        <div class="community-card-author">
          <span class="community-card-username">${n}</span>
          <span class="community-card-time">${c}</span>
        </div>
        <div class="community-card-rating" title="${s} 星">
          ${d}
        </div>
      </div>

      <!-- 标题 + 内容 -->
      <div class="community-card-body">
        <h3 class="community-card-title">${o}</h3>
        <p class="community-card-content">${a}</p>
      </div>

      <!-- 图片画廊 -->
      ${p}
    </div>
  `}function ds(e){var r;(r=document.querySelector(".community-lightbox"))==null||r.remove();const t=document.createElement("div");t.className="community-lightbox",t.innerHTML=`
    <div class="community-lightbox-overlay"></div>
    <button class="community-lightbox-close">&times;</button>
    <img class="community-lightbox-img" src="${sn(e)}" alt="原图" />
  `,document.body.appendChild(t);const n=()=>t.remove();t.querySelector(".community-lightbox-overlay").addEventListener("click",n),t.querySelector(".community-lightbox-close").addEventListener("click",n),t.addEventListener("keydown",o=>{o.key==="Escape"&&n()})}async function us(e){try{const{data:t}=await fn.from("profiles").select("username, avatar_url").eq("id",e).maybeSingle();return t||{username:"匿名用户",avatar_url:""}}catch{return{username:"匿名用户",avatar_url:""}}}function ps(e){if(!e)return"";const t=Date.now(),n=new Date(e).getTime(),r=t-n,o=Math.floor(r/1e3);if(o<60)return"刚刚";const a=Math.floor(o/60);if(a<60)return`${a} 分钟前`;const s=Math.floor(a/60);if(s<24)return`${s} 小时前`;const i=Math.floor(s/24);return i<30?`${i} 天前`:`${Math.floor(i/30)} 个月前`}function fs(){const e=document.getElementById("auth-modal");I.openModal(e)}function en(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function sn(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}window._AMapSecurityConfig={securityJsCode:"db200c6e5adf1ae0023dc0d1f8a4e906"};let G=null;const mn=[];let R=null,U=null,Te=!1,Ie=!1,Jo=0,Se=null;function dt(e,t="info",n=6e3){Se||(Se=document.createElement("div"),Se.id="toast-container",Se.style.cssText="position:fixed;top:70px;right:12px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:calc(100vw - 24px);",document.body.appendChild(Se));const r={error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"},o=r[t]||r.info,a=document.createElement("div");if(a.className="toast-notification",a.style.cssText=`position:relative;background:rgba(20,20,30,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:4px solid ${o};color:#e2e8f0;padding:14px 16px;border-radius:8px;font-size:14px;line-height:1.5;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.45);pointer-events:auto;animation:toast-slide-in 0.3s ease-out;transition:opacity 0.3s ease,transform 0.3s ease;`,n>0){const i=document.createElement("button");i.textContent="×",i.style.cssText="position:absolute;top:6px;right:10px;background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;line-height:1;padding:0;",i.addEventListener("click",()=>io(a)),a.appendChild(i)}const s=document.createElement("span");return s.style.cssText="display:block;padding-right:22px;white-space:pre-line;",s.textContent=e,a.appendChild(s),Se.appendChild(a),n>0&&setTimeout(()=>io(a),n),a}function io(e){!e||e.dataset._removing==="1"||(e.dataset._removing="1",e.style.opacity="0",e.style.transform="translateX(20px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}(function(){if(document.getElementById("toast-keyframes"))return;const t=document.createElement("style");t.id="toast-keyframes",t.textContent=`
    @keyframes toast-slide-in {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,document.head.appendChild(t)})();const Ae=Ne,B=document.createElement("div");B.id="spot-sidebar";B.innerHTML=`
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
        <button class="sidebar-action-btn" id="btn-share" title="分享此景点">
          <span>📤</span>
          <span>分享</span>
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
`;document.body.appendChild(B);const ms=B.querySelector(".sidebar-overlay"),hs=B.querySelector(".sidebar-close"),gs=B.querySelector(".hero-placeholder"),ys=B.querySelector(".hero-name"),bs=B.querySelector(".hero-desc"),co=B.querySelector(".hero-hot-badge"),ut=B.querySelector(".sidebar-photos-area"),cn=B.querySelector("#photo-upload-btn"),_e=B.querySelector("#photo-file-input"),V=B.querySelector("#photo-upload-status"),pt=B.querySelector(".sidebar-comments-area"),lo=B.querySelector("#comment-login-prompt"),me=B.querySelector("#comment-input"),le=B.querySelector("#comment-submit-btn"),J=B.querySelector("#comment-form-status"),Je=B.querySelector("#btn-like"),uo=B.querySelector("#btn-like-icon"),po=B.querySelector("#btn-like-text"),vs=B.querySelector("#btn-like-count"),Ve=B.querySelector("#btn-fav"),fo=B.querySelector("#btn-fav-icon"),mo=B.querySelector("#btn-fav-text"),ws=B.querySelector("#btn-fav-count"),Es=B.querySelector("#btn-comment-jump"),Cs=B.querySelector("#btn-comment-count"),Ss=B.querySelector("#btn-share");function hn(){I.closeDrawer(B)}ms.addEventListener("click",hn);hs.addEventListener("click",hn);async function xs(e,t){hn(),ot();const n=document.createElement("div");n.id="spot-pioneer-guide",n.className="spot-pioneer-guide",n.innerHTML=`
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
  `,document.body.appendChild(n);const r=n.querySelector(".spot-pioneer-overlay"),o=n.querySelector(".spot-pioneer-close"),a=n.querySelector("#pioneer-submit"),s=n.querySelector("#pioneer-status"),i=n.querySelector("#pioneer-name"),c=n.querySelector("#pioneer-desc"),l=n.querySelector(".spot-pioneer-coords");r.addEventListener("click",ot),o.addEventListener("click",ot),l.textContent="📍 正在定位...";try{const d=`https://restapi.amap.com/v3/geocode/regeo?key=7dfc44451d8128e329100a0c71fa90b6&location=${e},${t}&extensions=base`,u=await(await fetch(d)).json();if(u.status==="1"&&u.regeocode){const f=u.regeocode.formatted_address||"",h=u.regeocode.addressComponent,m=(h==null?void 0:h.township)||(h==null?void 0:h.district)||(h==null?void 0:h.city)||f||"";i.placeholder=`如：${m||"此处"}`,l.textContent=`📍 ${f||`${e.toFixed(4)}, ${t.toFixed(4)}`}`}else l.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}catch{l.textContent=`📍 ${e.toFixed(4)}, ${t.toFixed(4)}`}a.addEventListener("click",async()=>{if(!ae()){de();return}const d=i.value.trim(),p=c.value.trim();if(!d){s.textContent="请输入景区名称",s.style.color="rgba(255, 120, 120, 0.95)";return}if(!p){s.textContent="请写下一句话打卡心得",s.style.color="rgba(255, 120, 120, 0.95)";return}s.textContent="正在创建...",s.style.color="rgba(255, 255, 255, 0.7)",a.disabled=!0,a.textContent="⏳ 创建中...";try{const{data:u,error:f}=await Ae.from("spots").insert({name:d,longitude:e,latitude:t,description:p,creator_id:U.id}).select();if(f)throw f;const h=u[0];gn(h),ot(),G.setZoomAndCenter(12,[e,t]),await vt(h.id,h.name,h.description)}catch(u){console.error("[pioneer] 创建景区失败:",u),s.textContent="创建失败："+(u.message||"请检查网络后重试"),s.style.color="rgba(255, 120, 120, 0.95)",a.disabled=!1,a.textContent="✨ 立即点亮并分享"}}),n.addEventListener("keydown",d=>{d.key==="Enter"&&!a.disabled&&a.click()})}function ot(){const e=document.getElementById("spot-pioneer-guide");e&&e.remove()}function gn(e){const t=e.is_hot===!0,r=Ha().has(e.id),o=r?"✨ ":"",a=r?"#ff7b25":"#fff",s=r?"0 0 10px rgba(255,123,37,0.7)":"0 1px 2px rgba(0,0,0,0.8)",i=new AMap.Marker({position:[e.longitude,e.latitude],title:e.name,label:{content:`<div style="color:${a};font-size:${t?"13":"12"}px;text-shadow:${s};white-space:nowrap">${o}${t?"⭐ ":""}${Be(e.name)}</div>`,direction:"top",offset:new AMap.Pixel(0,-5)},extData:{id:e.id,name:e.name,description:e.description,isHot:t,isLit:r}});i.on("click",()=>qs(i)),G.add(i),mn.push(i)}async function rt(){let e=[],t=null;try{if(Zn())e=await ra();else{const r=await Ae.from("spots").select("*");e=r.data||[],t=r.error}}catch(r){t=r}if(t){console.error("[main] 加载景区数据失败:",t),dt(`加载景区数据失败
地图浏览不受影响`,"error",8e3);return}_s(),e.forEach(gn);const n=Zn()?"🔥 热门景区":"📍 全部景区";No(e,n)}function _s(){G.clearMap(),mn.length=0}function ho(e,t,n,r,o,a){var p;if(!G)return;G.setZoomAndCenter(15,[t,n]),vt(e,r,o,a);const s=mn.find(u=>{var f;return((f=u.getExtData())==null?void 0:f.id)===e});if(!s)return;const i=(p=s.getExtData())==null?void 0:p.isHot,c=s.getLabel(),l=c?c.getContent():"",d=`<div style="color:#fbbf24;font-size:15px;font-weight:700;text-shadow:0 0 12px rgba(251,191,36,0.8),0 1px 4px rgba(0,0,0,0.9);white-space:nowrap">${i?"⭐ ":""}${Be(r)}</div>`;s.setLabel({content:d,direction:"top",offset:new AMap.Pixel(0,-5)}),setTimeout(()=>{s.setLabel({content:l,direction:"top",offset:new AMap.Pixel(0,-5)})},2e3)}async function qs(e){Jo=Date.now();const t=e.getExtData();!t||!t.id||(G.setZoomAndCenter(12,e.getPosition()),await vt(t.id,t.name,t.description,t.isHot))}const go=new Map;async function vt(e,t,n,r){R=Number(e),ys.textContent=t||"",bs.textContent=n||"暂无介绍",gs.style.display="flex",r?co.style.display="inline-block":co.style.display="none";const o=Date.now(),a=go.get(R);(!a||o-a>3e4)&&(go.set(R,o),sa(R).catch(s=>console.warn("[main] 浏览量更新失败:",s))),ut.innerHTML="",pt.innerHTML="",J.textContent="",I.openDrawer(B),Vo(),await ks(),bn(R),await wt(R)}Je.addEventListener("click",async()=>{if(!U){de();return}if(R){Je.disabled=!0;try{Te?(await Or(U.id,R),Te=!1):(await zr(U.id,R),Te=!0),await We(),yn()}catch(e){console.error("[main] 点赞操作失败:",e)}finally{Je.disabled=!1}}});Ve.addEventListener("click",async()=>{if(!U){de();return}if(R){Ve.disabled=!0;try{Ie?(await Kr(U.id,R),Ie=!1):(await Vr(U.id,R),Ie=!0),await We(),yn()}catch(e){console.error("[main] 收藏操作失败:",e)}finally{Ve.disabled=!1}}});Es.addEventListener("click",()=>{const e=document.getElementById("comment-form-wrapper");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),ae()?setTimeout(()=>me.focus(),400):de())});Ss.addEventListener("click",()=>{dn()});function yn(){Te?(uo.textContent="❤️",po.textContent="已赞",Je.classList.add("active")):(uo.textContent="🤍",po.textContent="点赞",Je.classList.remove("active")),Ie?(fo.textContent="⭐",mo.textContent="已收藏",Ve.classList.add("active")):(fo.textContent="☆",mo.textContent="收藏",Ve.classList.remove("active"))}async function We(){if(R)try{const[e,t,n]=await Promise.all([jr(R),Yr(R),Xr(R)]);vs.textContent=e>0?e:"",ws.textContent=t>0?t:"",Cs.textContent=n>0?n:""}catch(e){console.warn("[main] 刷新计数失败:",e)}}async function ks(){if(!U||!R)Te=!1,Ie=!1;else try{const[e,t]=await Promise.all([Fr(U.id,R),Jr(U.id,R)]);Te=e,Ie=t}catch(e){console.warn("[main] 刷新互动状态失败:",e)}yn(),await We()}function de(){const e=document.getElementById("auth-modal");I.openModal(e)}function yo(){const e=document.getElementById("add-form-login-prompt"),t=document.getElementById("field-address"),n=document.getElementById("field-desc"),r=document.getElementById("add-submit");!e||!t||!n||!r||(ae()?(e.style.display="none",t.disabled=!1,n.disabled=!1,r.disabled=!1,r.textContent="分享我的足迹",t.placeholder="景区名称或详细地址（如：杭州西湖）",n.placeholder="景区游记或一句话介绍"):(e.style.display="block",t.disabled=!0,n.disabled=!0,r.disabled=!0,r.textContent="请先登录",t.placeholder="请登录后再分享",n.placeholder="请登录后再分享"))}function Vo(){ae()?(lo.style.display="none",me.disabled=!1,le.disabled=!1,le.textContent="发表评论",me.placeholder="写下你的评论..."):(lo.style.display="block",me.disabled=!0,le.disabled=!0,le.textContent="请先登录",me.placeholder="请先登录后再发表评论")}async function bn(e){const[t,n]=await Promise.allSettled([Ae.from("user_stories").select("photo_urls").eq("spot_id",e).order("created_at",{ascending:!1}),ia(e)]),r=[];if(t.status==="fulfilled"&&t.value.data&&t.value.data.forEach(o=>{o.photo_urls&&Array.isArray(o.photo_urls)&&o.photo_urls.forEach(a=>r.push({url:a,source:"story"}))}),n.status==="fulfilled"&&n.value&&n.value.forEach(o=>r.push({url:o.url,source:"upload",id:o.id,userId:o.user_id})),ut.innerHTML="",r.length>0){const o=document.createElement("div");o.className="photo-grid",[...new Map(r.map(s=>[s.url,s])).values()].forEach(s=>{const i=document.createElement("div");if(i.className="photo-item",i.innerHTML=`<img src="${Be(s.url)}" alt="景区照片" loading="lazy" />`,s.source==="upload"&&U&&s.userId===U.id){const c=document.createElement("button");c.className="photo-delete-btn",c.textContent="×",c.title="删除此照片",c.addEventListener("click",async l=>{if(l.stopPropagation(),!!confirm("确定要删除这张照片吗？"))try{await la(s.id,U.id),bn(e)}catch(d){console.error("[main] 删除照片失败:",d)}}),i.appendChild(c)}o.appendChild(i)}),ut.appendChild(o)}else ut.innerHTML='<div class="photo-empty">快来上传第一张照片吧！</div>'}cn.addEventListener("click",()=>{if(!U){de();return}R&&_e.click()});_e.addEventListener("change",async()=>{const e=_e.files[0];if(!e)return;if(!["image/jpeg","image/png","image/webp"].includes(e.type)){V.textContent="仅支持 JPG / PNG / WEBP 格式",V.style.color="rgba(255, 80, 80, 0.95)",_e.value="";return}if(e.size>5*1024*1024){V.textContent="图片不能超过 5MB",V.style.color="rgba(255, 80, 80, 0.95)",_e.value="";return}V.textContent="正在上传...",V.style.color="rgba(255, 255, 255, 0.7)",cn.disabled=!0;try{const n=e.name.split(".").pop().toLowerCase(),r=Date.now(),o=`${U.id}/${R}/${r}.${n}`,{error:a}=await Ae.storage.from("spot-images").upload(o,e,{upsert:!1});if(a)throw a;const{data:s}=Ae.storage.from("spot-images").getPublicUrl(o),i=s.publicUrl;await ca(R,U.id,o,i),V.textContent="上传成功！",V.style.color="rgba(80, 230, 140, 0.95)",await bn(R),setTimeout(()=>{V.textContent=""},2e3)}catch(n){console.error("[main] 上传照片失败:",n),V.textContent="上传失败："+(n.message||"未知错误"),V.style.color="rgba(255, 80, 80, 0.95)"}finally{cn.disabled=!1,_e.value=""}});async function wt(e){let t;try{t=await Qr(e)}catch(o){console.warn("[main] 加载评论失败:",o),t=[]}const n=document.getElementById("comments-title");if(n&&(n.textContent=`评论 (${t.length})`),pt.innerHTML="",t.length===0){pt.innerHTML='<div class="comment-empty">暂无评论，来说两句吧</div>';return}const r=document.createElement("div");r.className="comment-list",t.forEach(o=>{const a=Ls(o.created_at),s=o.avatar_url||`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.user_id)}`,i=U&&o.user_id===U.id,c=document.createElement("div");c.className="comment-bubble",c.innerHTML=`
      <div class="comment-header">
        <img class="comment-avatar" src="${Be(s)}" alt="" />
        <span class="comment-author-name">${Be(o.username)}</span>
        <span class="comment-time">${a}</span>
        ${i?`<button class="comment-delete-btn" data-id="${o.id}">删除</button>`:""}
      </div>
      <div class="comment-text">${Be(o.content)}</div>
    `,r.appendChild(c)}),pt.appendChild(r),r.querySelectorAll(".comment-delete-btn").forEach(o=>{o.addEventListener("click",async()=>{if(!confirm("确定要删除这条评论吗？"))return;const a=Number(o.dataset.id);o.disabled=!0;try{await Wr(a,U.id),await wt(e),await We()}catch(s){console.error("[main] 删除评论失败:",s),o.disabled=!1}})})}function Ls(e){if(!e)return"";const t=new Date(e),r=new Date-t,o=Math.floor(r/6e4);if(o<1)return"刚刚";if(o<60)return`${o}分钟前`;const a=Math.floor(o/60);if(a<24)return`${a}小时前`;const s=Math.floor(a/24);return s<30?`${s}天前`:t.toLocaleDateString("zh-CN")}function Be(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}le.addEventListener("click",async()=>{if(!R){J.textContent="请先点击地球上的景区",J.style.color="rgba(255, 80, 80, 0.95)";return}if(!ae()){de();return}const e=me.value.trim();if(!e){J.textContent="请输入评论内容",J.style.color="rgba(255, 80, 80, 0.95)";return}J.textContent="正在发表...",J.style.color="rgba(255, 255, 255, 0.8)",le.disabled=!0;try{await Gr(U.id,R,e)}catch(t){console.error("[main] 发表评论失败:",t),J.textContent="发表失败："+t.message,J.style.color="rgba(255, 80, 80, 0.95)",le.disabled=!1;return}J.textContent="发表成功！",J.style.color="rgba(80, 230, 140, 0.95)",me.value="",await wt(R),await We(),le.disabled=!1,setTimeout(()=>{J.textContent=""},2e3)});const re=document.createElement("div");re.id="add-form";re.innerHTML=`
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
`;document.body.appendChild(re);const j=re.querySelector(".add-form-status"),Ms=re.querySelector("#add-submit");Ms.addEventListener("click",async()=>{if(!ae()){de();return}const e=re.querySelector("#field-address").value.trim(),t=re.querySelector("#field-desc").value.trim();if(!e||!t){j.textContent="请完整填写所有字段",j.style.color="rgba(255, 80, 80, 0.95)";return}j.textContent="正在查询地址...",j.style.color="rgba(255, 255, 255, 0.8)";let n,r;try{const i=await Pa(e);n=i.longitude,r=i.latitude}catch(i){console.error("[main] 高德地理编码失败:",i),j.textContent="查询失败："+i.message,j.style.color="rgba(255, 80, 80, 0.95)";return}j.textContent="正在保存...",j.style.color="rgba(255, 255, 255, 0.8)";const{data:o,error:a}=await Ae.from("spots").insert({name:e,longitude:n,latitude:r,description:t,creator_id:U.id}).select();if(a){console.error("[main] 添加景区失败:",a),j.textContent="添加失败："+a.message,j.style.color="rgba(255, 80, 80, 0.95)";return}j.textContent="添加成功！",j.style.color="rgba(80, 230, 140, 0.95)",re.querySelector("#field-address").value="",re.querySelector("#field-desc").value="";const s=o[0];gn(s),G.setZoomAndCenter(12,[s.longitude,s.latitude]),setTimeout(()=>{j.textContent=""},2e3)});async function Ts(){we(10,"初始化应用..."),console.log("[调试步骤1/6] 🚀 等待高德地图 SDK...");try{await window.__amapPromise,console.log("[调试步骤1/6] ✅ 高德地图 SDK 就绪")}catch(e){console.error("[调试步骤1/6] ❌ AMap SDK 加载失败:",e),dt("⚠️ 地图服务加载失败，请刷新页面","error",0);return}we(30,"加载地图 SDK..."),console.log("[调试步骤2/6] 🗺️ 创建地图实例..."),G=new AMap.Map("mapContainer",{zoom:3,center:[105,35],viewMode:"2D",resizeEnable:!0,dragEnable:!0,zoomEnable:!0,doubleClickZoom:!0,keyboardEnable:!0,scrollWheel:!0,mapStyle:"amap://styles/darkblue"}),console.log("[调试步骤2/6] ✅ 地图实例创建完成"),G.on("click",e=>{Date.now()-Jo<300||xs(e.lnglat.getLng(),e.lnglat.getLat())}),Va({onSpotClick:ho}),Qa({onSpotClick:ho}),rs(),Aa(),as(),$r({showToast:dt}),Wa(e=>{switch(e){case"home":eo(!1),rt();break;case"community":ss();break;case"hot":eo(!0),rt();break;case"ranking":Ja(aa);break;case"favorites":case"profile":ae()?ba():de();break}}),we(55,"初始化数据库..."),console.log("[调试步骤3/6] 🔐 初始化认证模块...");try{await fa(),console.log("[调试步骤3/6] ✅ 认证模块初始化完成")}catch(e){console.error("[调试步骤3/6] ❌ 认证初始化失败:",e),dt(`⚠️ 认证服务初始化失败
地图浏览不受影响`,"warn",1e4)}we(65,"恢复登录状态..."),console.log("[调试步骤4/6] 🗄️ 初始化数据库..."),Hr(),console.log("[调试步骤4/6] ✅ 数据库初始化完成"),we(75,"加载景区数据..."),console.log("[调试步骤5/6] 👤 注册 onAuthChange..."),ma((e,t)=>{if(U=e,!e){const n=document.getElementById("profile-center-modal");n&&n.classList.remove("open")}yo(),Fa().then(()=>rt()),R&&B.classList.contains("open")&&(Vo(),wt(R))}),console.log("[调试步骤5/6] ✅ onAuthChange 就绪"),console.log("[调试步骤6/6] 📍 加载景区数据..."),yo(),rt(),we(100,"完成"),setTimeout(()=>Xo(),200),window.addEventListener("focus-spot",e=>{const{spotId:t,lng:n,lat:r,name:o,description:a}=e.detail;G.setZoomAndCenter(14,[n,r]),vt(t,o,a,!1)}),console.log("[调试步骤6/6] ✅ 应用启动完成！")}Ts();
