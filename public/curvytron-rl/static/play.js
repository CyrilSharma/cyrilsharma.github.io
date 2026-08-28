function zi({end:t,slider:e,time:o,playButton:i,render:r,tickHz:n}){let s=t.firstElementChild,a=[],l=!1,c=!1,u=0,d=0,m=null;function p(g){c=g&&a.length>1,i.textContent=c?"Pause":"Play",d=0,c&&!u&&(u=requestAnimationFrame(v))}function v(g){if(u=0,!!c){if(!d||g-d<1e3/n()){d||=g,u=requestAnimationFrame(v);return}e.value=(Number(e.value)+1)%a.length,r(Number(e.value)),d=g,u=requestAnimationFrame(v)}}function b(g){a=g,l=!0;let w=Math.max(a.length-1,0);e.max=w,requestAnimationFrame(()=>{!l||a!==g||(e.value=w)}),t.classList.remove("hidden"),p(!1),a.length&&r(w)}function y(){l=!1,p(!1),t.classList.add("hidden")}return e.addEventListener("sl-input",()=>r(Number(e.value))),i.addEventListener("click",()=>p(!c)),s.addEventListener("pointerdown",g=>{if(g.target.closest("input, button, sl-range"))return;let w=s.getBoundingClientRect(),k=t.getBoundingClientRect(),$=w.left-k.left,R=w.top-k.top;s.style.left=`${$}px`,s.style.top=`${R}px`,s.style.transform="none",m={x:g.clientX,y:g.clientY,left:$,top:R},s.classList.add("dragging"),s.setPointerCapture(g.pointerId)}),s.addEventListener("pointermove",g=>{m&&(s.style.left=`${m.left+g.clientX-m.x}px`,s.style.top=`${m.top+g.clientY-m.y}px`)}),s.addEventListener("pointerup",()=>{m=null,s.classList.remove("dragging")}),{get active(){return l},hide:y,show:b,step(g){p(!1),e.value=(Number(e.value)+g+a.length)%a.length,r(Number(e.value))},toggle(){p(!c)}}}function Mi({context:t,colors:e,size:o,pixelRatio:i,simulator:r}){let n=[],s=o,a=i;function l(b){return[b.x*s,(1-b.y)*s]}function c(b){let y=Math.max(2,r().radius*s/r().arena_size),g=Math.ceil(y*2),w=document.createElement("canvas");w.width=Math.ceil(g*a),w.height=Math.ceil(g*a);let k=w.getContext("2d");return k.scale(a,a),k.beginPath(),k.arc(g/2,g/2,y,0,2*Math.PI),k.fillStyle=e[b%e.length],k.fill(),{canvas:w,radius:g/2,width:g,clearX:0,clearY:0,clearWidth:g}}function u(b){n=Array.from({length:b},(y,g)=>c(g))}function d(){t.clearRect(0,0,s,s),n.forEach(b=>{b.clearX=0,b.clearY=0,b.clearWidth=b.width})}function m(){n.forEach(b=>t.clearRect(b.clearX,b.clearY,b.clearWidth,b.clearWidth))}function p(b){b.forEach((y,g)=>{let w=n[g],[k,$]=l(y),R=k-w.radius,_=$-w.radius;t.drawImage(w.canvas,R,_,w.width,w.width),w.clearX=Math.floor(R)-1,w.clearY=Math.floor(_)-1,w.clearWidth=w.width+2})}function v(b,y){s=b,a=y,u(n.length)}return{clear:m,draw:p,reset:d,resize:v,setPlayers:u}}function Di({context:t,colors:e,size:o,simulator:i}){let r=o,n=[],s=-1,a=document.createElement("canvas"),l=a.getContext("2d");function c(){a.width=r,a.height=r}c();function u(_){return[_.x*r,(1-_.y)*r]}function d(_,x){t.strokeStyle=x,t.fillStyle=x;let C=2*Math.PI/_.distances[0].length;_.points.forEach(([S,E],T)=>{let[z,H]=_.headings[T],U=Math.atan2(H,z),j=S*r/i().arena_size,B=(1-E/i().arena_size)*r;_.distances[T].forEach((it,Y)=>{let rt=U-Math.PI+(Y+.5)*C,we=it*r/i().arena_size;t.globalAlpha=.05+.18*(it/_.max_distance),t.beginPath(),t.moveTo(j,B),t.arc(j,B,we,-rt-C/2,-rt+C/2),t.closePath(),t.fill(),t.globalAlpha=.35,t.beginPath(),t.moveTo(j,B),t.lineTo(j+Math.cos(rt)*we,B-Math.sin(rt)*we),t.stroke()}),t.globalAlpha=.95,t.beginPath(),t.arc(j,B,2,0,2*Math.PI),t.fill()})}function m(_,x,C){let S=_>=0,E=Math.tanh(Math.abs(_)),[T,z]=u(x),H=30+42*E,U=t.createRadialGradient(T,z,0,T,z,H);U.addColorStop(0,C),U.addColorStop(.28,C+"aa"),U.addColorStop(1,C+"00"),t.globalAlpha=S?.18+.72*E:.08+.18*E,t.fillStyle=U,t.beginPath(),t.arc(T,z,H,0,2*Math.PI),t.fill();let j=`V ${S?"+":"\u2212"}${Math.abs(_).toFixed(2)}`;t.globalAlpha=1,t.font="600 13px Lato, Helvetica, sans-serif";let B=t.measureText(j).width+12,it=Math.max(4,Math.min(r-B-4,T-B/2)),Y=z<38?z+42:z-30;t.fillStyle="rgba(20, 20, 20, .8)",t.beginPath(),t.roundRect(it,Y-15,B,20,5),t.fill(),t.fillStyle=S?C:"#aeb6c2",t.fillText(j,it+6,Y)}function p(_,x,C,S){let E=x.kind==="line"?x.start:[x.center[0]+x.radius*Math.cos(x.start_angle),x.center[1]+x.radius*Math.sin(x.start_angle)];if(S&&_.moveTo(E[0]*C,r-E[1]*C),x.kind==="line"){_.lineTo(x.end[0]*C,r-x.end[1]*C);return}_.arc(x.center[0]*C,r-x.center[1]*C,x.radius*C,-x.start_angle,-(x.start_angle+x.sweep),x.sweep>0)}function v(_,x){let C=new Path2D;return _.forEach(S=>{S.forEach((E,T)=>p(C,E,x,T===0)),C.closePath()}),C}function b(_,x){let C=r/_.arena_size;l.clearRect(0,0,r,r),l.fillStyle=x,l.fill(v(_.cycles,C),"evenodd"),t.globalAlpha=.24,t.drawImage(a,0,0,r,r)}function y(_,x,C){if(!_?.target||!x)return;let[S,E]=u(x),T=_.target[0]*r/i().arena_size,z=(1-_.target[1]/i().arena_size)*r;if(t.strokeStyle=C,t.fillStyle=C,t.globalAlpha=.9,t.setLineDash([7,5]),t.beginPath(),t.moveTo(S,E),t.lineTo(T,z),t.stroke(),t.setLineDash([]),t.beginPath(),t.arc(T,z,7,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(T-11,z),t.lineTo(T+11,z),t.moveTo(T,z-11),t.lineTo(T,z+11),t.stroke(),Number.isInteger(_.action)){let H=["R","S","L"];t.font="600 13px Lato, Helvetica, sans-serif",t.fillText(H[_.action],T+12,z-12)}}function g(){n.forEach(([_,x],C)=>{let S=_*r/i().arena_size,E=(1-x/i().arena_size)*r,T=C===s;t.strokeStyle=e[0],t.fillStyle=e[0],t.globalAlpha=T?1:.42,t.lineWidth=T?3:1.5,t.beginPath(),t.arc(S,E,T?8:4,0,2*Math.PI),T?t.fill():t.stroke()}),t.lineWidth=1}function w(){t.clearRect(0,0,r,r)}function k(_){w(),_&&(Object.entries(_.overlays||{}).forEach(([x,C])=>{let S=Number(x),E=e[S%e.length];C.lidar&&d(C.lidar,E),C.reachable&&b(C.reachable,E),Number.isFinite(C.value)&&_.players[S]&&m(C.value,_.players[S],E)}),_.controller&&y(_.controller,_.players[0],e[0]),g(),t.globalAlpha=1)}function $(_,x){n=_,s=x}function R(_){r=_,c()}return{draw:k,reset:w,resize:R,setTargetChoices:$}}function Ni({context:t,colors:e,size:o,simulator:i}){t.lineCap="round";let r=[],n=[],s=o;function a(v){return[v.x*s,(1-v.y)*s]}function l(){r.length=0,n.length=0,t.fillStyle="#222222",t.fillRect(0,0,s,s)}function c(v,b,y){if(!(b.alive&&b.trail_active&&v?.alive&&v.trail_active)){n[y]=!1;return}let w=r[y]??=[];(!n[y]||!w.length)&&w.push([v]),w.at(-1).push(b),n[y]=!0}function u(v,b){b.forEach((y,g)=>c(v[g],y,g))}function d(v){t.beginPath(),v.forEach(b=>{t.moveTo(...a(b[0]));for(let y=1;y<b.length;y++)t.lineTo(...a(b[y]))}),t.stroke()}function m(){t.lineWidth=Math.max(2,i().radius*s/i().arena_size*2),r.forEach((v,b)=>{v.length&&(t.strokeStyle=e[b%e.length],d(v),r[b]=[])})}function p(v){s=v,t.lineCap="round"}return{appendFrame:u,draw:m,reset:l,resize:p}}function Ii({input:t,options:e,locked:o,onSelect:i,initialCatalog:r=[],playersUrl:n="/players"}){let s=[],a="",l=-1,c=new Map;function u(y){return c.get(y)}function d(){l=-1,e.replaceChildren(),e.classList.add("hidden"),t.setAttribute("aria-expanded","false")}function m(){if(o()||!s.length){d();return}let y=t.value.trim().toLowerCase(),g=s.filter(w=>`${w.label} ${w.spec}`.toLowerCase().includes(y));e.replaceChildren(...g.map((w,k)=>{let $=document.createElement("button");$.className="player-option",$.type="button",$.dataset.spec=w.spec,$.setAttribute("role","option"),$.setAttribute("aria-selected",k===l?"true":"false"),k===l&&$.classList.add("active");let R=document.createElement("span");R.className="player-option-name",R.textContent=w.label;let _=document.createElement("span");return _.className="player-option-kind",_.textContent=w.kind,$.title=w.label,$.append(R,_),$})),e.classList.toggle("hidden",g.length===0),t.setAttribute("aria-expanded",g.length>0?"true":"false")}function p(y){if(!Array.isArray(y))return;let g=y.map(w=>`${w.spec}
${w.label}
${w.kind}`).join(`
`);g!==a&&(s=y,a=g,c=new Map(y.filter(w=>w.kind==="checkpoint").map(w=>[w.spec,w.label])),l=-1,e.classList.contains("hidden")||m())}function v(y){i(y),t.blur()}async function b(){try{let y=await fetch(n,{cache:"no-store"});y.ok&&p(await y.json())}catch{}}return t.addEventListener("sl-focus",m),t.addEventListener("sl-input",()=>{l=-1,m()}),t.addEventListener("keydown",y=>{let g=[...e.querySelectorAll(".player-option")];if(y.key==="ArrowDown"||y.key==="ArrowUp"){if(!g.length)return;l=(l+(y.key==="ArrowDown"?1:g.length-1))%g.length,m(),y.preventDefault()}else y.key==="Enter"&&l>=0&&g[l]?(v(g[l].dataset.spec),y.preventDefault()):y.key==="Escape"&&(d(),t.blur(),y.preventDefault(),y.stopPropagation())}),t.addEventListener("sl-blur",()=>setTimeout(d,120)),e.addEventListener("mousedown",y=>y.preventDefault()),e.addEventListener("click",y=>{let g=y.target.closest(".player-option");g&&v(g.dataset.spec)}),p(r),n&&(b(),setInterval(()=>{o()||b()},3e3)),{hide:d,labelFor:u,setCatalog:p}}function Dn(t,e,o){if(Number.isInteger(e.action))return e.action;if(!t||o<=0)return 1;let r=Math.atan2(Math.sin(e.angle-t.angle),Math.cos(e.angle-t.angle))/o;return Math.abs(r)<1e-4?1:r>0?2:0}function Nn(t,e,o,i){if(!t.alive||o<=0)return{...t};let n=(e===2?1:e===0?-1:0)*i.angular_velocity_per_second,s=i.velocity_per_second/i.arena_size,a=s*o,l=t.angle+n*o,c,u;if(n===0)c=t.x+Math.cos(t.angle)*a,u=t.y+Math.sin(t.angle)*a;else{let p=s/n;c=t.x+p*(Math.sin(l)-Math.sin(t.angle)),u=t.y+p*(Math.cos(t.angle)-Math.cos(l))}let d=i.radius/i.arena_size,m=1-d;return{...t,x:Math.max(d,Math.min(m,c)),y:Math.max(d,Math.min(m,u)),angle:l}}function Bi(t,e,o,i,r,n){if(!t||!i.velocity_per_second||!i.angular_velocity_per_second)return t;let a=Math.max(0,Math.min(100,o))/1e3,l=e?t.tick-e.tick:0;return{...t,players:t.players.map((c,u)=>{let d=e?.players[u],m=n&&u===0?r:Dn(d,c,l);return Nn(c,m,a,i)})}}var Ye=globalThis,Xe=Ye.ShadowRoot&&(Ye.ShadyCSS===void 0||Ye.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Po=Symbol(),Vi=new WeakMap,_e=class{constructor(e,o,i){if(this._$cssResult$=!0,i!==Po)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(Xe&&e===void 0){let i=o!==void 0&&o.length===1;i&&(e=Vi.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Vi.set(o,e))}return e}toString(){return this.cssText}},Fi=t=>new _e(typeof t=="string"?t:t+"",void 0,Po),W=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((i,r,n)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new _e(o,t,Po)},Ui=(t,e)=>{if(Xe)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let i=document.createElement("style"),r=Ye.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,t.appendChild(i)}},Ro=Xe?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let i of e.cssRules)o+=i.cssText;return Fi(o)})(t):t;var{is:In,defineProperty:Bn,getOwnPropertyDescriptor:Vn,getOwnPropertyNames:Fn,getOwnPropertySymbols:Un,getPrototypeOf:Hn}=Object,Ke=globalThis,Hi=Ke.trustedTypes,Wn=Hi?Hi.emptyScript:"",qn=Ke.reactiveElementPolyfillSupport,xe=(t,e)=>t,Lt={toAttribute(t,e){switch(e){case Boolean:t=t?Wn:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},Je=(t,e)=>!In(t,e),Wi={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:Je};Symbol.metadata??=Symbol("metadata"),Ke.litPropertyMetadata??=new WeakMap;var _t=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=Wi){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,o);r!==void 0&&Bn(this.prototype,e,r)}}static getPropertyDescriptor(e,o,i){let{get:r,set:n}=Vn(this.prototype,e)??{get(){return this[o]},set(s){this[o]=s}};return{get:r,set(s){let a=r?.call(this);n?.call(this,s),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Wi}static _$Ei(){if(this.hasOwnProperty(xe("elementProperties")))return;let e=Hn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(xe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(xe("properties"))){let o=this.properties,i=[...Fn(o),...Un(o)];for(let r of i)this.createProperty(r,o[r])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)o.unshift(Ro(r))}else e!==void 0&&o.push(Ro(e));return o}static _$Eu(e,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ui(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,i){this._$AK(e,i)}_$ET(e,o){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:Lt).toAttribute(o,i.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,o){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Lt;this._$Em=r;let a=s.fromAttribute(o,n.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,o,i,r=!1,n){if(e!==void 0){let s=this.constructor;if(r===!1&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??Je)(n,o)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:i,reflect:r,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??o??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(o=void 0),this._$AL.set(e,o)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:s}=n,a=this[r];s!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,n,a)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};_t.elementStyles=[],_t.shadowRootOptions={mode:"open"},_t[xe("elementProperties")]=new Map,_t[xe("finalized")]=new Map,qn?.({ReactiveElement:_t}),(Ke.reactiveElementVersions??=[]).push("2.1.2");var Oo=globalThis,qi=t=>t,Ge=Oo.trustedTypes,ji=Ge?Ge.createPolicy("lit-html",{createHTML:t=>t}):void 0,zo="$lit$",xt=`lit$${Math.random().toFixed(9).slice(2)}$`,Mo="?"+xt,jn=`<${Mo}>`,Wt=document,ke=()=>Wt.createComment(""),$e=t=>t===null||typeof t!="object"&&typeof t!="function",Do=Array.isArray,Zi=t=>Do(t)||typeof t?.[Symbol.iterator]=="function",Lo=`[ 	
\f\r]`,Ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yi=/-->/g,Xi=/>/g,Ut=RegExp(`>|${Lo}(?:([^\\s"'>=/]+)(${Lo}*=${Lo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ki=/'/g,Ji=/"/g,Qi=/^(?:script|style|textarea|title)$/i,No=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),I=No(1),Ta=No(2),Pa=No(3),tt=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),Gi=new WeakMap,Ht=Wt.createTreeWalker(Wt,129);function tr(t,e){if(!Do(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ji!==void 0?ji.createHTML(e):e}var er=(t,e)=>{let o=t.length-1,i=[],r,n=e===2?"<svg>":e===3?"<math>":"",s=Ce;for(let a=0;a<o;a++){let l=t[a],c,u,d=-1,m=0;for(;m<l.length&&(s.lastIndex=m,u=s.exec(l),u!==null);)m=s.lastIndex,s===Ce?u[1]==="!--"?s=Yi:u[1]!==void 0?s=Xi:u[2]!==void 0?(Qi.test(u[2])&&(r=RegExp("</"+u[2],"g")),s=Ut):u[3]!==void 0&&(s=Ut):s===Ut?u[0]===">"?(s=r??Ce,d=-1):u[1]===void 0?d=-2:(d=s.lastIndex-u[2].length,c=u[1],s=u[3]===void 0?Ut:u[3]==='"'?Ji:Ki):s===Ji||s===Ki?s=Ut:s===Yi||s===Xi?s=Ce:(s=Ut,r=void 0);let p=s===Ut&&t[a+1].startsWith("/>")?" ":"";n+=s===Ce?l+jn:d>=0?(i.push(c),l.slice(0,d)+zo+l.slice(d)+xt+p):l+xt+(d===-2?a:p)}return[tr(t,n+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},Ae=class t{constructor({strings:e,_$litType$:o},i){let r;this.parts=[];let n=0,s=0,a=e.length-1,l=this.parts,[c,u]=er(e,o);if(this.el=t.createElement(c,i),Ht.currentNode=this.el.content,o===2||o===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=Ht.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(zo)){let m=u[s++],p=r.getAttribute(d).split(xt),v=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:v[2],strings:p,ctor:v[1]==="."?Qe:v[1]==="?"?to:v[1]==="@"?eo:jt}),r.removeAttribute(d)}else d.startsWith(xt)&&(l.push({type:6,index:n}),r.removeAttribute(d));if(Qi.test(r.tagName)){let d=r.textContent.split(xt),m=d.length-1;if(m>0){r.textContent=Ge?Ge.emptyScript:"";for(let p=0;p<m;p++)r.append(d[p],ke()),Ht.nextNode(),l.push({type:2,index:++n});r.append(d[m],ke())}}}else if(r.nodeType===8)if(r.data===Mo)l.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(xt,d+1))!==-1;)l.push({type:7,index:n}),d+=xt.length-1}n++}}static createElement(e,o){let i=Wt.createElement("template");return i.innerHTML=e,i}};function qt(t,e,o=t,i){if(e===tt)return e;let r=i!==void 0?o._$Co?.[i]:o._$Cl,n=$e(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,o,i)),i!==void 0?(o._$Co??=[])[i]=r:o._$Cl=r),r!==void 0&&(e=qt(t,r._$AS(t,e.values),r,i)),e}var Ze=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:i}=this._$AD,r=(e?.creationScope??Wt).importNode(o,!0);Ht.currentNode=r;let n=Ht.nextNode(),s=0,a=0,l=i[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new ie(n,n.nextSibling,this,e):l.type===1?c=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(c=new oo(n,this,e)),this._$AV.push(c),l=i[++a]}s!==l?.index&&(n=Ht.nextNode(),s++)}return Ht.currentNode=Wt,r}p(e){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,o),o+=i.strings.length-2):i._$AI(e[o])),o++}},ie=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,i,r){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=qt(this,e,o),$e(e)?e===M||e==null||e===""?(this._$AH!==M&&this._$AR(),this._$AH=M):e!==this._$AH&&e!==tt&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Zi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==M&&$e(this._$AH)?this._$AA.nextSibling.data=e:this.T(Wt.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Ae.createElement(tr(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(o);else{let n=new Ze(r,this),s=n.u(this.options);n.p(o),this.T(s),this._$AH=n}}_$AC(e){let o=Gi.get(e.strings);return o===void 0&&Gi.set(e.strings,o=new Ae(e)),o}k(e){Do(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,r=0;for(let n of e)r===o.length?o.push(i=new t(this.O(ke()),this.O(ke()),this,this.options)):i=o[r],i._$AI(n),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let i=qi(e).nextSibling;qi(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},jt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,i,r,n){this.type=1,this._$AH=M,this._$AN=void 0,this.element=e,this.name=o,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=M}_$AI(e,o=this,i,r){let n=this.strings,s=!1;if(n===void 0)e=qt(this,e,o,0),s=!$e(e)||e!==this._$AH&&e!==tt,s&&(this._$AH=e);else{let a=e,l,c;for(e=n[0],l=0;l<n.length-1;l++)c=qt(this,a[i+l],o,l),c===tt&&(c=this._$AH[l]),s||=!$e(c)||c!==this._$AH[l],c===M?e=M:e!==M&&(e+=(c??"")+n[l+1]),this._$AH[l]=c}s&&!r&&this.j(e)}j(e){e===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Qe=class extends jt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===M?void 0:e}},to=class extends jt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==M)}},eo=class extends jt{constructor(e,o,i,r,n){super(e,o,i,r,n),this.type=5}_$AI(e,o=this){if((e=qt(this,e,o,0)??M)===tt)return;let i=this._$AH,r=e===M&&i!==M||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==M&&(i===M||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},oo=class{constructor(e,o,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){qt(this,e)}},or={M:zo,P:xt,A:Mo,C:1,L:er,R:Ze,D:Zi,V:qt,I:ie,H:jt,N:to,U:eo,B:Qe,F:oo},Yn=Oo.litHtmlPolyfillSupport;Yn?.(Ae,ie),(Oo.litHtmlVersions??=[]).push("3.3.3");var ir=(t,e,o)=>{let i=o?.renderBefore??e,r=i._$litPart$;if(r===void 0){let n=o?.renderBefore??null;i._$litPart$=r=new ie(e.insertBefore(ke(),n),n,void 0,o??{})}return r._$AI(t),r};var Io=globalThis,Ot=class extends _t{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ir(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return tt}};Ot._$litElement$=!0,Ot.finalized=!0,Io.litElementHydrateSupport?.({LitElement:Ot});var Xn=Io.litElementPolyfillSupport;Xn?.({LitElement:Ot});(Io.litElementVersions??=[]).push("4.2.2");var rr=W`
  :host {
    display: inline-block;
  }

  .dropdown::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    border-radius: var(--sl-border-radius-medium);
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    display: block;
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;var ar=Object.defineProperty,Kn=Object.defineProperties,Jn=Object.getOwnPropertyDescriptor,Gn=Object.getOwnPropertyDescriptors,nr=Object.getOwnPropertySymbols,Zn=Object.prototype.hasOwnProperty,Qn=Object.prototype.propertyIsEnumerable,Bo=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),Vo=t=>{throw TypeError(t)},sr=(t,e,o)=>e in t?ar(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,nt=(t,e)=>{for(var o in e||(e={}))Zn.call(e,o)&&sr(t,o,e[o]);if(nr)for(var o of nr(e))Qn.call(e,o)&&sr(t,o,e[o]);return t},zt=(t,e)=>Kn(t,Gn(e)),h=(t,e,o,i)=>{for(var r=i>1?void 0:i?Jn(e,o):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(r=(i?s(e,o,r):s(r))||r);return i&&r&&ar(e,o,r),r},lr=(t,e,o)=>e.has(t)||Vo("Cannot "+o),cr=(t,e,o)=>(lr(t,e,"read from private field"),o?o.call(t):e.get(t)),hr=(t,e,o)=>e.has(t)?Vo("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),dr=(t,e,o,i)=>(lr(t,e,"write to private field"),i?i.call(t,o):e.set(t,o),o),ts=function(t,e){this[0]=t,this[1]=e},ur=t=>{var e=t[Bo("asyncIterator")],o=!1,i,r={};return e==null?(e=t[Bo("iterator")](),i=n=>r[n]=s=>e[n](s)):(e=e.call(t),i=n=>r[n]=s=>{if(o){if(o=!1,n==="throw")throw s;return s}return o=!0,{done:!1,value:new ts(new Promise(a=>{var l=e[n](s);l instanceof Object||Vo("Object expected"),a(l)}),1)}}),r[Bo("iterator")]=()=>r,i("next"),"throw"in e?i("throw"):r.throw=n=>{throw n},"return"in e&&i("return"),r};function*fr(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*ur(fr(t.shadowRoot.activeElement))))}function mr(){return[...fr()].pop()}var pr=new WeakMap;function gr(t){let e=pr.get(t);return e||(e=window.getComputedStyle(t,null),pr.set(t,e)),e}function es(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=gr(t);return e.visibility!=="hidden"&&e.display!=="none"}function os(t){let e=gr(t),{overflowY:o,overflowX:i}=e;return o==="scroll"||i==="scroll"?!0:o!=="auto"||i!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&i==="auto"}function is(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let n=t.getRootNode(),s=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=n.querySelector(`${s}:checked`);return a?a===t:n.querySelector(s)===t}return es(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:os(t):!1}function vr(t){var e,o;let i=ns(t),r=(e=i[0])!=null?e:null,n=(o=i[i.length-1])!=null?o:null;return{start:r,end:n}}function rs(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function ns(t){let e=new WeakMap,o=[];function i(r){if(r instanceof Element){if(r.hasAttribute("inert")||r.closest("[inert]")||e.has(r))return;e.set(r,!0),!o.includes(r)&&is(r)&&o.push(r),r instanceof HTMLSlotElement&&rs(r,t)&&r.assignedElements({flatten:!0}).forEach(n=>{i(n)}),r.shadowRoot!==null&&r.shadowRoot.mode==="open"&&i(r.shadowRoot)}for(let n of r.children)i(n)}return i(t),o.sort((r,n)=>{let s=Number(r.getAttribute("tabindex"))||0;return(Number(n.getAttribute("tabindex"))||0)-s})}var yr=W`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;var Fo=new Set,re=new Map,Ct,Uo="ltr",Ho="en",br=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(br){let t=new MutationObserver(wr);Uo=document.documentElement.dir||"ltr",Ho=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Ee(...t){t.map(e=>{let o=e.$code.toLowerCase();re.has(o)?re.set(o,Object.assign(Object.assign({},re.get(o)),e)):re.set(o,e),Ct||(Ct=e)}),wr()}function wr(){br&&(Uo=document.documentElement.dir||"ltr",Ho=document.documentElement.lang||navigator.language),[...Fo.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var io=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Fo.add(this.host)}hostDisconnected(){Fo.delete(this.host)}dir(){return`${this.host.dir||Uo}`.toLowerCase()}lang(){let e=`${this.host.lang||Ho}`.toLowerCase().replace(/_/g,"-");try{return new Intl.Locale(e),e}catch{return Ct?Ct.$code.toLowerCase():"en"}}getTranslationData(e){var o,i;let r;try{r=new Intl.Locale(e.replace(/_/g,"-"))}catch{return{locale:void 0,language:"",region:"",primary:void 0,secondary:void 0}}let n=r.language.toLowerCase(),s=(i=(o=r.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&i!==void 0?i:"",a=re.get(`${n}-${s}`),l=re.get(n);return{locale:r,language:n,region:s,primary:a,secondary:l}}exists(e,o){var i;let{primary:r,secondary:n}=this.getTranslationData((i=o.lang)!==null&&i!==void 0?i:this.lang());return o=Object.assign({includeFallback:!1},o),!!(r&&r[e]||n&&n[e]||o.includeFallback&&Ct&&Ct[e])}term(e,...o){let{primary:i,secondary:r}=this.getTranslationData(this.lang()),n;if(i&&i[e])n=i[e];else if(r&&r[e])n=r[e];else if(Ct&&Ct[e])n=Ct[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof n=="function"?n(...o):n}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,o)}};var _r={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Ee(_r);var xr=_r;var Mt=class extends io{};Ee(xr);var at=W`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;var ss={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Je},as=(t=ss,e,o)=>{let{kind:i,metadata:r}=o,n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),i==="accessor"){let{name:s}=o;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,t,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,t,a),a}}}if(i==="setter"){let{name:s}=o;return function(a){let l=this[s];e.call(this,a),this.requestUpdate(s,l,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function f(t){return(e,o)=>typeof o=="object"?as(t,e,o):((i,r,n)=>{let s=r.hasOwnProperty(n);return r.constructor.createProperty(n,i),s?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,o)}function kt(t){return f({...t,state:!0,attribute:!1})}function Cr(t){return(e,o)=>{let i=typeof e=="function"?e:e[o];Object.assign(i,t)}}var Yt=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function et(t,e){return(o,i,r)=>{let n=s=>s.renderRoot?.querySelector(t)??null;if(e){let{get:s,set:a}=typeof i=="object"?o:r??(()=>{let l=Symbol();return{get(){return this[l]},set(c){this[l]=c}}})();return Yt(o,i,{get(){let l=s.call(this);return l===void 0&&(l=n(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return Yt(o,i,{get(){return n(this)}})}}var ro,X=class extends Ot{constructor(){super(),hr(this,ro,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,nt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let i=customElements.get(t);if(!i){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let r=" (unknown version)",n=r;"version"in e&&e.version&&(r=" v"+e.version),"version"in i&&i.version&&(n=" v"+i.version),!(r&&n&&r===n)&&console.warn(`Attempted to register <${t}>${r}, but <${t}>${n} has already been registered.`)}attributeChangedCallback(t,e,o){cr(this,ro)||(this.constructor.elementProperties.forEach((i,r)=>{i.reflect&&this[r]!=null&&this.initialReflectedProperties.set(r,this[r])}),dr(this,ro,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};ro=new WeakMap;X.version="2.20.1";X.dependencies={};h([f()],X.prototype,"dir",2);h([f()],X.prototype,"lang",2);var gt=Math.min,ht=Math.max,Te=Math.round,Pe=Math.floor,vt=t=>({x:t,y:t}),ls={left:"right",right:"left",bottom:"top",top:"bottom"};function Wo(t,e,o){return ht(t,gt(e,o))}function Xt(t,e){return typeof t=="function"?t(e):t}function Dt(t){return t.split("-")[0]}function Kt(t){return t.split("-")[1]}function qo(t){return t==="x"?"y":"x"}function so(t){return t==="y"?"height":"width"}function yt(t){let e=t[0];return e==="t"||e==="b"?"y":"x"}function ao(t){return qo(yt(t))}function Ar(t,e,o){o===void 0&&(o=!1);let i=Kt(t),r=ao(t),n=so(r),s=r==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(s=Se(s)),[s,Se(s)]}function Er(t){let e=Se(t);return[no(t),e,no(e)]}function no(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}var kr=["left","right"],$r=["right","left"],cs=["top","bottom"],hs=["bottom","top"];function ds(t,e,o){switch(t){case"top":case"bottom":return o?e?$r:kr:e?kr:$r;case"left":case"right":return e?cs:hs;default:return[]}}function Sr(t,e,o,i){let r=Kt(t),n=ds(Dt(t),o==="start",i);return r&&(n=n.map(s=>s+"-"+r),e&&(n=n.concat(n.map(no)))),n}function Se(t){let e=Dt(t);return ls[e]+t.slice(e.length)}function us(t){var e,o,i,r;return{top:(e=t.top)!=null?e:0,right:(o=t.right)!=null?o:0,bottom:(i=t.bottom)!=null?i:0,left:(r=t.left)!=null?r:0}}function jo(t){return typeof t!="number"?us(t):{top:t,right:t,bottom:t,left:t}}function Jt(t){let{x:e,y:o,width:i,height:r}=t;return{width:i,height:r,top:o,left:e,right:e+i,bottom:o+r,x:e,y:o}}function Tr(t,e,o){let{reference:i,floating:r}=t,n=yt(e),s=ao(e),a=so(s),l=Dt(e),c=n==="y",u=i.x+i.width/2-r.width/2,d=i.y+i.height/2-r.height/2,m=i[a]/2-r[a]/2,p;switch(l){case"top":p={x:u,y:i.y-r.height};break;case"bottom":p={x:u,y:i.y+i.height};break;case"right":p={x:i.x+i.width,y:d};break;case"left":p={x:i.x-r.width,y:d};break;default:p={x:i.x,y:i.y}}let v=Kt(e);return v&&(p[s]+=m*(v==="end"?1:-1)*(o&&c?-1:1)),p}async function Pr(t,e){var o;e===void 0&&(e={});let{x:i,y:r,platform:n,rects:s,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:m=!1,padding:p=0}=Xt(e,t),v=jo(p),y=a[m?d==="floating"?"reference":"floating":d],g=Jt(await n.getClippingRect({element:(o=await(n.isElement==null?void 0:n.isElement(y)))==null||o?y:y.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(a.floating)),boundary:c,rootBoundary:u,strategy:l})),w=d==="floating"?{x:i,y:r,width:s.floating.width,height:s.floating.height}:s.reference,k=await(n.getOffsetParent==null?void 0:n.getOffsetParent(a.floating)),$=await(n.isElement==null?void 0:n.isElement(k))&&await(n.getScale==null?void 0:n.getScale(k))||{x:1,y:1},R=Jt(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:k,strategy:l}):w);return{top:(g.top-R.top+v.top)/$.y,bottom:(R.bottom-g.bottom+v.bottom)/$.y,left:(g.left-R.left+v.left)/$.x,right:(R.right-g.right+v.right)/$.x}}var ps=50,Rr=async(t,e,o)=>{let{placement:i="bottom",strategy:r="absolute",middleware:n=[],platform:s}=o,a=s.detectOverflow?s:{...s,detectOverflow:Pr},l=await(s.isRTL==null?void 0:s.isRTL(e)),c=await s.getElementRects({reference:t,floating:e,strategy:r}),{x:u,y:d}=Tr(c,i,l),m=i,p=0,v={};for(let b=0;b<n.length;b++){let y=n[b];if(!y)continue;let{name:g,fn:w}=y,{x:k,y:$,data:R,reset:_}=await w({x:u,y:d,initialPlacement:i,placement:m,strategy:r,middlewareData:v,rects:c,platform:a,elements:{reference:t,floating:e}});u=k??u,d=$??d,v[g]={...v[g],...R},_&&p<ps&&(p++,typeof _=="object"&&(_.placement&&(m=_.placement),_.rects&&(c=_.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:r}):_.rects),{x:u,y:d}=Tr(c,m,l)),b=-1)}return{x:u,y:d,placement:m,strategy:r,middlewareData:v}},Lr=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:i,placement:r,rects:n,platform:s,elements:a,middlewareData:l}=e,{element:c,padding:u=0}=Xt(t,e)||{};if(c==null)return{};let d=jo(u),m={x:o,y:i},p=ao(r),v=so(p),b=await s.getDimensions(c),y=p==="y",g=y?"top":"left",w=y?"bottom":"right",k=y?"clientHeight":"clientWidth",$=n.reference[v]+n.reference[p]-m[p]-n.floating[v],R=m[p]-n.reference[p],_=await(s.getOffsetParent==null?void 0:s.getOffsetParent(c)),x=_?_[k]:0;(!x||!await(s.isElement==null?void 0:s.isElement(_)))&&(x=a.floating[k]||n.floating[v]);let C=$/2-R/2,S=x/2-b[v]/2-1,E=gt(d[g],S),T=gt(d[w],S),z=x-b[v]-T,H=x/2-b[v]/2+C,U=Wo(E,H,z),j=!l.arrow&&Kt(r)!=null&&H!==U&&n.reference[v]/2-(H<E?E:T)-b[v]/2<0,B=j?H<E?H-E:H-z:0;return{[p]:m[p]+B,data:{[p]:U,centerOffset:H-U-B,...j&&{alignmentOffset:B}},reset:j}}});var Or=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,i;let{placement:r,middlewareData:n,rects:s,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:u=!0,crossAxis:d=!0,fallbackPlacements:m,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:b=!0,...y}=Xt(t,e);if((o=n.arrow)!=null&&o.alignmentOffset)return{};let g=Dt(r),w=yt(a),k=Dt(a)===a,$=await(l.isRTL==null?void 0:l.isRTL(c.floating)),R=m||(k||!b?[Se(a)]:Er(a)),_=v!=="none";!m&&_&&R.push(...Sr(a,b,v,$));let x=[a,...R],C=await l.detectOverflow(e,y),S=[],E=((i=n.flip)==null?void 0:i.overflows)||[];if(u&&S.push(C[g]),d){let U=Ar(r,s,$);S.push(C[U[0]],C[U[1]])}if(E=[...E,{placement:r,overflows:S}],!S.every(U=>U<=0)){var T,z;let U=(((T=n.flip)==null?void 0:T.index)||0)+1,j=x[U];if(j&&(!(d==="alignment"?w!==yt(j):!1)||E.every(Y=>yt(Y.placement)===w?Y.overflows[0]>0:!0)))return{data:{index:U,overflows:E},reset:{placement:j}};let B=(z=E.filter(it=>it.overflows[0]<=0).sort((it,Y)=>it.overflows[1]-Y.overflows[1])[0])==null?void 0:z.placement;if(!B)switch(p){case"bestFit":{var H;let it=(H=E.filter(Y=>{if(_){let rt=yt(Y.placement);return rt===w||rt==="y"}return!0}).map(Y=>[Y.placement,Y.overflows.filter(rt=>rt>0).reduce((rt,we)=>rt+we,0)]).sort((Y,rt)=>Y[1]-rt[1])[0])==null?void 0:H[0];it&&(B=it);break}case"initialPlacement":B=a;break}if(r!==B)return{reset:{placement:B}}}return{}}}};var fs=new Set(["left","top"]);async function ms(t,e){let{placement:o,platform:i,elements:r}=t,n=await(i.isRTL==null?void 0:i.isRTL(r.floating)),s=Dt(o),a=Kt(o),l=yt(o)==="y",c=fs.has(s)?-1:1,u=n&&l?-1:1,d=Xt(e,t),{mainAxis:m,crossAxis:p,alignmentAxis:v}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof v=="number"&&(p=a==="end"?v*-1:v),l?{x:p*u,y:m*c}:{x:m*c,y:p*u}}var zr=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,i;let{x:r,y:n,placement:s,middlewareData:a}=e,l=await ms(e,t);return s===((o=a.offset)==null?void 0:o.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:r+l.x,y:n+l.y,data:{...l,placement:s}}}}},Mr=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:i,placement:r,platform:n}=e,{mainAxis:s=!0,crossAxis:a=!1,limiter:l={fn:w=>{let{x:k,y:$}=w;return{x:k,y:$}}},...c}=Xt(t,e),u={x:o,y:i},d=await n.detectOverflow(e,c),m=yt(r),p=qo(m),v=u[p],b=u[m],y=(w,k)=>Wo(k+d[w==="y"?"top":"left"],k,k-d[w==="y"?"bottom":"right"]);s&&(v=y(p,v)),a&&(b=y(m,b));let g=l.fn({...e,[p]:v,[m]:b});return{...g,data:{x:g.x-o,y:g.y-i,enabled:{[p]:s,[m]:a}}}}}};var Dr=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){let{placement:o,rects:i,platform:r,elements:n}=e,{apply:s=()=>{},...a}=Xt(t,e),l=await r.detectOverflow(e,a),c=Dt(o),u=Kt(o),d=yt(o)==="y",{width:m,height:p}=i.floating,v,b;c==="top"||c==="bottom"?(v=c,b=u===(await(r.isRTL==null?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(b=c,v=u==="end"?"top":"bottom");let y=p-l.top-l.bottom,g=m-l.left-l.right,w=gt(p-l[v],y),k=gt(m-l[b],g),$=e.middlewareData.shift,R=!$,_=w,x=k;$!=null&&$.enabled.x&&(x=g),$!=null&&$.enabled.y&&(_=y),R&&!u&&(d?x=m-2*ht(l.left,l.right):_=p-2*ht(l.top,l.bottom)),await s({...e,availableWidth:x,availableHeight:_});let C=await r.getDimensions(n.floating);return m!==C.width||p!==C.height?{reset:{rects:!0}}:{}}}};function lo(){return typeof window<"u"}function Zt(t){return Ir(t)?(t.nodeName||"").toLowerCase():"#document"}function G(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function bt(t){var e;return(e=(Ir(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Ir(t){return lo()?t instanceof Node||t instanceof G(t).Node:!1}function dt(t){return lo()?t instanceof Element||t instanceof G(t).Element:!1}function $t(t){return lo()?t instanceof HTMLElement||t instanceof G(t).HTMLElement:!1}function Nr(t){return!lo()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof G(t).ShadowRoot}function Re(t){let{overflow:e,overflowX:o,overflowY:i,display:r}=ut(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&r!=="inline"&&r!=="contents"}function Br(t){return/^(table|td|th)$/.test(Zt(t))}function Le(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}var gs=/transform|translate|scale|rotate|perspective|filter/,vs=/paint|layout|strict|content/,Gt=t=>!!t&&t!=="none",Yo;function se(t){let e=dt(t)?ut(t):t;return Gt(e.transform)||Gt(e.translate)||Gt(e.scale)||Gt(e.rotate)||Gt(e.perspective)||!co()&&(Gt(e.backdropFilter)||Gt(e.filter))||gs.test(e.willChange||"")||vs.test(e.contain||"")}function Vr(t){let e=Nt(t);for(;$t(e)&&!ae(e);){if(se(e))return e;if(Le(e))return null;e=Nt(e)}return null}function co(){return Yo==null&&(Yo=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Yo}function ae(t){return/^(html|body|#document)$/.test(Zt(t))}function ut(t){return G(t).getComputedStyle(t)}function Oe(t){return dt(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Nt(t){if(Zt(t)==="html")return t;let e=t.assignedSlot||t.parentNode||Nr(t)&&t.host||bt(t);return Nr(e)?e.host:e}function Fr(t){let e=Nt(t);return ae(e)?(t.ownerDocument||t).body:$t(e)&&Re(e)?e:Fr(e)}function ne(t,e,o){var i;e===void 0&&(e=[]),o===void 0&&(o=!0);let r=Fr(t),n=r===((i=t.ownerDocument)==null?void 0:i.body),s=G(r);if(n){let a=ho(s);return e.concat(s,s.visualViewport||[],Re(r)?r:[],a&&o?ne(a):[])}else return e.concat(r,ne(r,[],o))}function ho(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Wr(t){let e=ut(t),o=parseFloat(e.width)||0,i=parseFloat(e.height)||0,r=$t(t),n=r?t.offsetWidth:o,s=r?t.offsetHeight:i,a=Te(o)!==n||Te(i)!==s;return a&&(o=n,i=s),{width:o,height:i,$:a}}function Ko(t){return dt(t)?t:t.contextElement}function le(t){let e=Ko(t);if(!$t(e))return vt(1);let o=e.getBoundingClientRect(),{width:i,height:r,$:n}=Wr(e),s=(n?Te(o.width):o.width)/i,a=(n?Te(o.height):o.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!a||!Number.isFinite(a))&&(a=1),{x:s,y:a}}var ys=vt(0);function qr(t){let e=G(t);return!co()||!e.visualViewport?ys:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function bs(t,e,o){return e===void 0&&(e=!1),!!o&&e&&o===G(t)}function Qt(t,e,o,i){e===void 0&&(e=!1),o===void 0&&(o=!1);let r=t.getBoundingClientRect(),n=Ko(t),s=vt(1);e&&(i?dt(i)&&(s=le(i)):s=le(t));let a=bs(n,o,i)?qr(n):vt(0),l=(r.left+a.x)/s.x,c=(r.top+a.y)/s.y,u=r.width/s.x,d=r.height/s.y;if(n&&i){let m=G(n),p=dt(i)?G(i):i,v=m,b=ho(v);for(;b&&p!==v;){let y=le(b),g=b.getBoundingClientRect(),w=ut(b),k=g.left+(b.clientLeft+parseFloat(w.paddingLeft))*y.x,$=g.top+(b.clientTop+parseFloat(w.paddingTop))*y.y;l*=y.x,c*=y.y,u*=y.x,d*=y.y,l+=k,c+=$,v=G(b),b=ho(v)}}return Jt({width:u,height:d,x:l,y:c})}function uo(t,e){let o=Oe(t).scrollLeft;return e?e.left+o:Qt(bt(t)).left+o}function jr(t,e){let o=t.getBoundingClientRect(),i=o.left+e.scrollLeft-uo(t,o),r=o.top+e.scrollTop;return{x:i,y:r}}function ws(t){let{elements:e,rect:o,offsetParent:i,strategy:r}=t,n=r==="fixed",s=bt(i),a=e?Le(e.floating):!1;if(i===s||a&&n)return o;let l={scrollLeft:0,scrollTop:0},c=vt(1),u=vt(0),d=$t(i);if((d||!n)&&((Zt(i)!=="body"||Re(s))&&(l=Oe(i)),d)){let p=Qt(i);c=le(i),u.x=p.x+i.clientLeft,u.y=p.y+i.clientTop}let m=s&&!d&&!n?jr(s,l):vt(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+u.x+m.x,y:o.y*c.y-l.scrollTop*c.y+u.y+m.y}}function _s(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function xs(t){let e=Oe(t),o=t.ownerDocument.body,i=ht(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=ht(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight),n=-e.scrollLeft+uo(t),s=-e.scrollTop;return ut(o).direction==="rtl"&&(n+=ht(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:n,y:s}}var Cs=25;function ks(t,e,o){o===void 0&&(o="viewport");let i=o==="layoutViewport",r=G(t),n=bt(t),s=r.visualViewport,a=n.clientWidth,l=n.clientHeight,c=0,u=0;if(s){let m=!co()||e==="fixed";i?m||(c=-s.offsetLeft,u=-s.offsetTop):(a=s.width,l=s.height,m&&(c=s.offsetLeft,u=s.offsetTop))}if(uo(n)<=0){let m=n.ownerDocument,p=m.body,v=getComputedStyle(p),b=m.compatMode==="CSS1Compat"&&parseFloat(v.marginLeft)+parseFloat(v.marginRight)||0,y=Math.abs(n.clientWidth-p.clientWidth-b),g=getComputedStyle(n).scrollbarGutter==="stable both-edges"?y/2:y;g<=Cs&&(a-=g)}return{width:a,height:l,x:c,y:u}}function $s(t,e){let o=Qt(t,!0,e==="fixed"),i=o.top+t.clientTop,r=o.left+t.clientLeft,n=le(t),s=t.clientWidth*n.x,a=t.clientHeight*n.y,l=r*n.x,c=i*n.y;return{width:s,height:a,x:l,y:c}}function Ur(t,e,o){let i;if(e==="viewport"||e==="layoutViewport")i=ks(t,o,e);else if(e==="document")i=xs(bt(t));else if(dt(e))i=$s(e,o);else{let r=qr(t);i={x:e.x-r.x,y:e.y-r.y,width:e.width,height:e.height}}return Jt(i)}function As(t,e){let o=e.get(t);if(o)return o;let i=ne(t,[],!1).filter(a=>dt(a)&&Zt(a)!=="body"),r=null,n=ut(t).position==="fixed",s=n?Nt(t):t;for(;dt(s)&&!ae(s);){let a=ut(s),l=se(s),c=r?r.position:n?"fixed":"";!l&&(c==="fixed"||c==="absolute"&&a.position==="static")?i=i.filter(d=>d!==s):r=a,s=Nt(s)}return e.set(t,i),i}function Es(t){let{element:e,boundary:o,rootBoundary:i,strategy:r}=t,s=[...o==="clippingAncestors"?Le(e)?[]:As(e,this._c):[].concat(o),i],a=Ur(e,s[0],r),l=a.top,c=a.right,u=a.bottom,d=a.left;for(let m=1;m<s.length;m++){let p=Ur(e,s[m],r);l=ht(p.top,l),c=gt(p.right,c),u=gt(p.bottom,u),d=ht(p.left,d)}return{width:c-d,height:u-l,x:d,y:l}}function Ss(t){let{width:e,height:o}=Wr(t);return{width:e,height:o}}function Ts(t,e,o){let i=$t(e),r=bt(e),n=o==="fixed",s=Qt(t,!0,n,e),a={scrollLeft:0,scrollTop:0},l=vt(0);if((i||!n)&&((Zt(e)!=="body"||Re(r))&&(a=Oe(e)),i)){let m=Qt(e,!0,n,e);l.x=m.x+e.clientLeft,l.y=m.y+e.clientTop}!i&&r&&(l.x=uo(r));let c=r&&!i&&!n?jr(r,a):vt(0),u=s.left+a.scrollLeft-l.x-c.x,d=s.top+a.scrollTop-l.y-c.y;return{x:u,y:d,width:s.width,height:s.height}}function Xo(t){return ut(t).position==="static"}function Hr(t,e){if(!$t(t)||ut(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return bt(t)===o&&(o=o.ownerDocument.body),o}function Yr(t,e){let o=G(t);if(Le(t))return o;if(!$t(t)){let r=Nt(t);for(;r&&!ae(r);){if(dt(r)&&!Xo(r))return r;r=Nt(r)}return o}let i=Hr(t,e);for(;i&&Br(i)&&Xo(i);)i=Hr(i,e);return i&&ae(i)&&Xo(i)&&!se(i)?o:i||Vr(t)||o}var Ps=async function(t){let e=this.getOffsetParent||Yr,o=this.getDimensions,i=await o(t.floating);return{reference:Ts(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function Rs(t){return ut(t).direction==="rtl"}var ze={convertOffsetParentRelativeRectToViewportRelativeRect:ws,getDocumentElement:bt,getClippingRect:Es,getOffsetParent:Yr,getElementRects:Ps,getClientRects:_s,getDimensions:Ss,getScale:le,isElement:dt,isRTL:Rs};function Xr(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Ls(t,e,o){let i=null,r,n=bt(t);function s(){var u;clearTimeout(r),(u=i)==null||u.disconnect(),i=null}function a(u,d){u===void 0&&(u=!1),d===void 0&&(d=1),s();let m=t.getBoundingClientRect(),{left:p,top:v,width:b,height:y}=m;if(u||e(),!b||!y)return;let g=Pe(v),w=Pe(n.clientWidth-(p+b)),k=Pe(n.clientHeight-(v+y)),$=Pe(p),_={rootMargin:-g+"px "+-w+"px "+-k+"px "+-$+"px",threshold:ht(0,gt(1,d))||1},x=!0;function C(S){let E=S[0].intersectionRatio;if(!Xr(m,t.getBoundingClientRect()))return a();if(E!==d){if(!x)return a();E?a(!1,E):r=setTimeout(()=>{a(!1,1e-7)},1e3)}x=!1}try{i=new IntersectionObserver(C,{..._,root:n.ownerDocument})}catch{i=new IntersectionObserver(C,_)}i.observe(t)}let l=G(t),c=()=>a(o);return l.addEventListener("resize",c),a(!0),()=>{l.removeEventListener("resize",c),s()}}function Kr(t,e,o,i){i===void 0&&(i={});let{ancestorScroll:r=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,c=Ko(t),u=r||n?[...c?ne(c):[],...e?ne(e):[]]:[];u.forEach(g=>{r&&g.addEventListener("scroll",o),n&&g.addEventListener("resize",o)});let d=c&&a?Ls(c,o,n):null,m=-1,p=null;s&&(p=new ResizeObserver(g=>{let[w]=g;w&&w.target===c&&p&&e&&(p.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var k;(k=p)==null||k.observe(e)})),o()}),c&&!l&&p.observe(c),e&&p.observe(e));let v,b=l?Qt(t):null;l&&y();function y(){let g=Qt(t);b&&!Xr(b,g)&&o(),b=g,v=requestAnimationFrame(y)}return o(),()=>{var g;u.forEach(w=>{r&&w.removeEventListener("scroll",o),n&&w.removeEventListener("resize",o)}),d?.(),(g=p)==null||g.disconnect(),p=null,l&&cancelAnimationFrame(v)}}var Jr=zr;var Gr=Mr,Zr=Or,Jo=Dr;var Qr=Lr;var tn=(t,e,o)=>{let i=new Map,r=o??{},n={...ze,...r.platform,_c:i};return Rr(t,e,{...r,platform:n})};var At={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},po=t=>(...e)=>({_$litDirective$:t,values:e}),ce=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,i){this._$Ct=e,this._$AM=o,this._$Ci=i}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var ot=po(class extends ce{constructor(t){if(super(t),t.type!==At.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}let o=t.element.classList;for(let i of this.st)i in e||(o.remove(i),this.st.delete(i));for(let i in e){let r=!!e[i];r===this.st.has(i)||this.nt?.has(i)||(r?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return tt}});function en(t){return Os(t)}function Go(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Os(t){for(let e=t;e;e=Go(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Go(t);e;e=Go(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||se(o)||e.tagName==="BODY"))return e}return null}function zs(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var P=class extends X{constructor(){super(...arguments),this.localize=new Mt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),i=0,r=0,n=0,s=0,a=0,l=0,c=0,u=0;o?t.top<e.top?(i=t.left,r=t.bottom,n=t.right,s=t.bottom,a=e.left,l=e.top,c=e.right,u=e.top):(i=e.left,r=e.bottom,n=e.right,s=e.bottom,a=t.left,l=t.top,c=t.right,u=t.top):t.left<e.left?(i=t.right,r=t.top,n=e.left,s=e.top,a=t.right,l=t.bottom,c=e.left,u=e.bottom):(i=e.right,r=e.top,n=t.left,s=t.top,a=e.right,l=e.bottom,c=t.left,u=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||zs(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Kr(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[Jr({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Jo({apply:({rects:o})=>{let i=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${o.reference.width}px`:"",this.popup.style.height=r?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Zr({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Gr({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Jo({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Qr({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>ze.getOffsetParent(o,en):ze.getOffsetParent;tn(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:zt(nt({},ze),{getOffsetParent:e})}).then(({x:o,y:i,middlewareData:r,placement:n})=>{let s=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${o}px`,top:`${i}px`}),this.arrow){let l=r.arrow.x,c=r.arrow.y,u="",d="",m="",p="";if(this.arrowPlacement==="start"){let v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=s?v:"",p=s?"":v}else if(this.arrowPlacement==="end"){let v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=s?"":v,p=s?v:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(p=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",u=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(p=typeof l=="number"?`${l}px`:"",u=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:u,right:d,bottom:m,left:p,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return I`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${ot({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${ot({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?I`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};P.styles=[at,yr];h([et(".popup")],P.prototype,"popup",2);h([et(".popup__arrow")],P.prototype,"arrowEl",2);h([f()],P.prototype,"anchor",2);h([f({type:Boolean,reflect:!0})],P.prototype,"active",2);h([f({reflect:!0})],P.prototype,"placement",2);h([f({reflect:!0})],P.prototype,"strategy",2);h([f({type:Number})],P.prototype,"distance",2);h([f({type:Number})],P.prototype,"skidding",2);h([f({type:Boolean})],P.prototype,"arrow",2);h([f({attribute:"arrow-placement"})],P.prototype,"arrowPlacement",2);h([f({attribute:"arrow-padding",type:Number})],P.prototype,"arrowPadding",2);h([f({type:Boolean})],P.prototype,"flip",2);h([f({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],P.prototype,"flipFallbackPlacements",2);h([f({attribute:"flip-fallback-strategy"})],P.prototype,"flipFallbackStrategy",2);h([f({type:Object})],P.prototype,"flipBoundary",2);h([f({attribute:"flip-padding",type:Number})],P.prototype,"flipPadding",2);h([f({type:Boolean})],P.prototype,"shift",2);h([f({type:Object})],P.prototype,"shiftBoundary",2);h([f({attribute:"shift-padding",type:Number})],P.prototype,"shiftPadding",2);h([f({attribute:"auto-size"})],P.prototype,"autoSize",2);h([f()],P.prototype,"sync",2);h([f({type:Object})],P.prototype,"autoSizeBoundary",2);h([f({attribute:"auto-size-padding",type:Number})],P.prototype,"autoSizePadding",2);h([f({attribute:"hover-bridge",type:Boolean})],P.prototype,"hoverBridge",2);var rn=new Map,Ms=new WeakMap;function Ds(t){return t??{keyframes:[],options:{duration:0}}}function on(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Zo(t,e){rn.set(t,Ds(e))}function Qo(t,e,o){let i=Ms.get(t);if(i?.[e])return on(i[e],o.dir);let r=rn.get(e);return r?on(r,o.dir):{keyframes:[],options:{duration:0}}}function ti(t,e){return new Promise(o=>{function i(r){r.target===t&&(t.removeEventListener(e,i),o())}t.addEventListener(e,i)})}function ei(t,e,o){return new Promise(i=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let r=t.animate(e,zt(nt({},o),{duration:Ns()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function Ns(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function oi(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}function K(t,e){let o=nt({waitUntilFirstUpdate:!1},e);return(i,r)=>{let{update:n}=i,s=Array.isArray(t)?t:[t];i.update=function(a){s.forEach(l=>{let c=l;if(a.has(c)){let u=a.get(c),d=this[c];u!==d&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[r](u,d)}}),n.call(this,a)}}}var O=t=>t??M;var q=class extends X{constructor(){super(...arguments),this.localize=new Mt(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(i,r)=>{if(!i)return null;let n=i.closest(r);if(n)return n;let s=i.getRootNode();return s instanceof ShadowRoot?o(s.host,r):null};setTimeout(()=>{var i;let r=((i=this.containingElement)==null?void 0:i.getRootNode())instanceof ShadowRoot?mr():document.activeElement;(!this.containingElement||o(r,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),i=o[0],r=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(i),i.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(r),r.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(i=>vr(i).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,ti(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ti(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await oi(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=Qo(this,"dropdown.show",{dir:this.localize.dir()});await ei(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await oi(this);let{keyframes:t,options:e}=Qo(this,"dropdown.hide",{dir:this.localize.dir()});await ei(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return I`
      <sl-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${O(this.sync?this.sync:void 0)}
        class=${ot({dropdown:!0,"dropdown--open":this.open})}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open?"false":"true"} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `}};q.styles=[at,rr];q.dependencies={"sl-popup":P};h([et(".dropdown")],q.prototype,"popup",2);h([et(".dropdown__trigger")],q.prototype,"trigger",2);h([et(".dropdown__panel")],q.prototype,"panel",2);h([f({type:Boolean,reflect:!0})],q.prototype,"open",2);h([f({reflect:!0})],q.prototype,"placement",2);h([f({type:Boolean,reflect:!0})],q.prototype,"disabled",2);h([f({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],q.prototype,"stayOpenOnSelect",2);h([f({attribute:!1})],q.prototype,"containingElement",2);h([f({type:Number})],q.prototype,"distance",2);h([f({type:Number})],q.prototype,"skidding",2);h([f({type:Boolean})],q.prototype,"hoist",2);h([f({reflect:!0})],q.prototype,"sync",2);h([K("open",{waitUntilFirstUpdate:!0})],q.prototype,"handleOpenChange",1);Zo("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});Zo("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});q.define("sl-dropdown");var nn=W`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`;var he=(t="value")=>(e,o)=>{let i=e.constructor,r=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(n,s,a){var l;let c=i.getPropertyOptions(t),u=typeof c.attribute=="string"?c.attribute:t;if(n===u){let d=c.converter||Lt,p=(typeof d=="function"?d:(l=d?.fromAttribute)!=null?l:Lt.fromAttribute)(a,c.type);this[t]!==p&&(this[o]=p)}r.call(this,n,s,a)}};var de=W`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`;var Me=new WeakMap,De=new WeakMap,Ne=new WeakMap,ii=new WeakSet,fo=new WeakMap,ue=class{constructor(t,e){this.handleFormData=o=>{let i=this.options.disabled(this.host),r=this.options.name(this.host),n=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!i&&!s&&typeof r=="string"&&r.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(a=>{o.formData.append(r,a.toString())}):o.formData.append(r,n.toString()))},this.handleFormSubmit=o=>{var i;let r=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((i=Me.get(this.form))==null||i.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!r&&!n(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),fo.set(this.host,[])},this.handleInteraction=o=>{let i=fo.get(this.host);i.includes(o.type)||i.push(o.type),i.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.checkValidity=="function"&&!i.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.reportValidity=="function"&&!i.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=nt({form:o=>{let i=o.form;if(i){let n=o.getRootNode().querySelector(`#${i}`);if(n)return n}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var i;return(i=o.disabled)!=null?i:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,i)=>o.value=i,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),fo.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),fo.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,Me.has(this.form)?Me.get(this.form).add(this.host):Me.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),De.has(this.form)||(De.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Ne.has(this.form)||(Ne.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=Me.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),De.has(this.form)&&(this.form.reportValidity=De.get(this.form),De.delete(this.form)),Ne.has(this.form)&&(this.form.checkValidity=Ne.get(this.form),Ne.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?ii.add(t):ii.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(i=>{e.hasAttribute(i)&&o.setAttribute(i,e.getAttribute(i))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!ii.has(e),i=!!e.required;e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},sn=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),_h=Object.freeze(zt(nt({},sn),{valid:!1,valueMissing:!0})),xh=Object.freeze(zt(nt({},sn),{valid:!1,customError:!0}));var pe=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let i=o.target;(this.slotNames.includes("[default]")&&!i.name||i.name&&this.slotNames.includes(i.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};var ri="";function an(t){ri=t}function ln(t=""){if(!ri){let e=[...document.getElementsByTagName("script")],o=e.find(i=>i.hasAttribute("data-shoelace"));if(o)an(o.getAttribute("data-shoelace"));else{let i=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)),r="";i&&(r=i.getAttribute("src")),an(r.split("/").slice(0,-1).join("/"))}}return ri.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Is={name:"default",resolver:t=>ln(`assets/icons/${t}.svg`)},cn=Is;var hn={caret:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,check:`
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"chevron-left":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,"chevron-right":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,copy:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,"eye-slash":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,eyedropper:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,"grip-vertical":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,indeterminate:`
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"person-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,"play-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,"pause-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,radio:`
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,"star-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,"x-lg":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,"x-circle-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `},Bs={name:"system",resolver:t=>t in hn?`data:image/svg+xml,${encodeURIComponent(hn[t])}`:""},dn=Bs;var Vs=[cn,dn],ni=[];function un(t){ni.push(t)}function pn(t){ni=ni.filter(e=>e!==t)}function si(t){return Vs.find(e=>e.name===t)}var fn=W`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;var{I:Nh}=or;var mn=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var gn=t=>t.strings===void 0;var Fs={},vn=(t,e=Fs)=>t._$AH=e;var Ie=Symbol(),mo=Symbol(),ai,li=new Map,lt=class extends X{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let i;if(e?.spriteSheet)return this.svg=I`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(i=await fetch(t,{mode:"cors"}),!i.ok)return i.status===410?Ie:mo}catch{return mo}try{let r=document.createElement("div");r.innerHTML=await i.text();let n=r.firstElementChild;if(((o=n?.tagName)==null?void 0:o.toLowerCase())!=="svg")return Ie;ai||(ai=new DOMParser);let a=ai.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Ie}catch{return Ie}}connectedCallback(){super.connectedCallback(),un(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),pn(this)}getIconSource(){let t=si(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),i=o?si(this.library):void 0;if(!e){this.svg=null;return}let r=li.get(e);if(r||(r=this.resolveIcon(e,i),li.set(e,r)),!this.initialRender)return;let n=await r;if(n===mo&&li.delete(e),e===this.getIconSource().url){if(mn(n)){if(this.svg=n,i){await this.updateComplete;let s=this.shadowRoot.querySelector("[part='svg']");typeof i.mutator=="function"&&s&&i.mutator(s)}return}switch(n){case mo:case Ie:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=i?.mutator)==null||t.call(i,this.svg),this.emit("sl-load")}}}render(){return this.svg}};lt.styles=[at,fn];h([kt()],lt.prototype,"svg",2);h([f({reflect:!0})],lt.prototype,"name",2);h([f()],lt.prototype,"src",2);h([f()],lt.prototype,"label",2);h([f({reflect:!0})],lt.prototype,"library",2);h([K("label")],lt.prototype,"handleLabelChange",1);h([K(["name","src","library"])],lt.prototype,"setIcon",1);var te=po(class extends ce{constructor(t){if(super(t),t.type!==At.PROPERTY&&t.type!==At.ATTRIBUTE&&t.type!==At.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!gn(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===tt||e===M)return e;let o=t.element,i=t.name;if(t.type===At.PROPERTY){if(e===o[i])return tt}else if(t.type===At.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(i))return tt}else if(t.type===At.ATTRIBUTE&&o.getAttribute(i)===e+"")return tt;return vn(t),e}});var A=class extends X{constructor(){super(...arguments),this.formControlController=new ue(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new pe(this,"help-text","label"),this.localize=new Mt(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,i="preserve"){let r=e??this.input.selectionStart,n=o??this.input.selectionEnd;this.input.setRangeText(t,r,n,i),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e,n=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return I`
      <div
        part="form-control"
        class=${ot({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":i})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${ot({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.passwordVisible?"text":this.type}
              title=${this.title}
              name=${O(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${O(this.placeholder)}
              minlength=${O(this.minlength)}
              maxlength=${O(this.maxlength)}
              min=${O(this.min)}
              max=${O(this.max)}
              step=${O(this.step)}
              .value=${te(this.value)}
              autocapitalize=${O(this.autocapitalize)}
              autocomplete=${O(this.autocomplete)}
              autocorrect=${O(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${O(this.pattern)}
              enterkeyhint=${O(this.enterkeyhint)}
              inputmode=${O(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${n?I`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `:""}
            ${this.passwordToggle&&!this.disabled?I`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?I`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:I`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                `:""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${i?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};A.styles=[at,de,nn];A.dependencies={"sl-icon":lt};h([et(".input__control")],A.prototype,"input",2);h([kt()],A.prototype,"hasFocus",2);h([f()],A.prototype,"title",2);h([f({reflect:!0})],A.prototype,"type",2);h([f()],A.prototype,"name",2);h([f()],A.prototype,"value",2);h([he()],A.prototype,"defaultValue",2);h([f({reflect:!0})],A.prototype,"size",2);h([f({type:Boolean,reflect:!0})],A.prototype,"filled",2);h([f({type:Boolean,reflect:!0})],A.prototype,"pill",2);h([f()],A.prototype,"label",2);h([f({attribute:"help-text"})],A.prototype,"helpText",2);h([f({type:Boolean})],A.prototype,"clearable",2);h([f({type:Boolean,reflect:!0})],A.prototype,"disabled",2);h([f()],A.prototype,"placeholder",2);h([f({type:Boolean,reflect:!0})],A.prototype,"readonly",2);h([f({attribute:"password-toggle",type:Boolean})],A.prototype,"passwordToggle",2);h([f({attribute:"password-visible",type:Boolean})],A.prototype,"passwordVisible",2);h([f({attribute:"no-spin-buttons",type:Boolean})],A.prototype,"noSpinButtons",2);h([f({reflect:!0})],A.prototype,"form",2);h([f({type:Boolean,reflect:!0})],A.prototype,"required",2);h([f()],A.prototype,"pattern",2);h([f({type:Number})],A.prototype,"minlength",2);h([f({type:Number})],A.prototype,"maxlength",2);h([f()],A.prototype,"min",2);h([f()],A.prototype,"max",2);h([f()],A.prototype,"step",2);h([f()],A.prototype,"autocapitalize",2);h([f()],A.prototype,"autocorrect",2);h([f()],A.prototype,"autocomplete",2);h([f({type:Boolean})],A.prototype,"autofocus",2);h([f()],A.prototype,"enterkeyhint",2);h([f({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],A.prototype,"spellcheck",2);h([f()],A.prototype,"inputmode",2);h([K("disabled",{waitUntilFirstUpdate:!0})],A.prototype,"handleDisabledChange",1);h([K("step",{waitUntilFirstUpdate:!0})],A.prototype,"handleStepChange",1);h([K("value",{waitUntilFirstUpdate:!0})],A.prototype,"handleValueChange",1);A.define("sl-input");var yn=W`
  :host {
    display: inline-block;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 2px;
    background-color: var(--sl-input-background-color);
    color: var(--sl-color-neutral-0);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .checkbox__label::after {
    content: var(--sl-input-required-content);
    color: var(--sl-input-required-content-color);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`;var V=class extends X{constructor(){super(...arguments),this.formControlController=new ue(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new pe(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return I`
      <div
        class=${ot({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${ot({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":this.size==="small","checkbox--medium":this.size==="medium","checkbox--large":this.size==="large"})}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${O(this.value)}
            .indeterminate=${te(this.indeterminate)}
            .checked=${te(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            aria-checked=${this.checked?"true":"false"}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
          />

          <span
            part="control${this.checked?" control--checked":""}${this.indeterminate?" control--indeterminate":""}"
            class="checkbox__control"
          >
            ${this.checked?I`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                `:""}
            ${!this.checked&&this.indeterminate?I`
                  <sl-icon
                    part="indeterminate-icon"
                    class="checkbox__indeterminate-icon"
                    library="system"
                    name="indeterminate"
                  ></sl-icon>
                `:""}
          </span>

          <div part="label" class="checkbox__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${e?"false":"true"}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};V.styles=[at,de,yn];V.dependencies={"sl-icon":lt};h([et('input[type="checkbox"]')],V.prototype,"input",2);h([kt()],V.prototype,"hasFocus",2);h([f()],V.prototype,"title",2);h([f()],V.prototype,"name",2);h([f()],V.prototype,"value",2);h([f({reflect:!0})],V.prototype,"size",2);h([f({type:Boolean,reflect:!0})],V.prototype,"disabled",2);h([f({type:Boolean,reflect:!0})],V.prototype,"checked",2);h([f({type:Boolean,reflect:!0})],V.prototype,"indeterminate",2);h([he("checked")],V.prototype,"defaultChecked",2);h([f({reflect:!0})],V.prototype,"form",2);h([f({type:Boolean,reflect:!0})],V.prototype,"required",2);h([f({attribute:"help-text"})],V.prototype,"helpText",2);h([K("disabled",{waitUntilFirstUpdate:!0})],V.prototype,"handleDisabledChange",1);h([K(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],V.prototype,"handleStateChange",1);V.define("sl-checkbox");var bn=W`
  :host {
    --thumb-size: 20px;
    --tooltip-offset: 10px;
    --track-color-active: var(--sl-color-neutral-200);
    --track-color-inactive: var(--sl-color-neutral-200);
    --track-active-offset: 0%;
    --track-height: 6px;

    display: block;
  }

  .range {
    position: relative;
  }

  .range__control {
    --percent: 0%;
    -webkit-appearance: none;
    border-radius: 3px;
    width: 100%;
    height: var(--track-height);
    background: transparent;
    line-height: var(--sl-input-height-medium);
    vertical-align: middle;
    margin: 0;

    background-image: linear-gradient(
      to right,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  .range--rtl .range__control {
    background-image: linear-gradient(
      to left,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  /* Webkit */
  .range__control::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    border-radius: 3px;
    border: none;
  }

  .range__control::-webkit-slider-thumb {
    border: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border: solid var(--sl-input-border-width) var(--sl-color-primary-600);
    -webkit-appearance: none;
    margin-top: calc(var(--thumb-size) / -2 + var(--track-height) / 2);
    cursor: pointer;
  }

  .range__control:enabled::-webkit-slider-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-webkit-slider-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-webkit-slider-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* Firefox */
  .range__control::-moz-focus-outer {
    border: 0;
  }

  .range__control::-moz-range-progress {
    background-color: var(--track-color-active);
    border-radius: 3px;
    height: var(--track-height);
  }

  .range__control::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--track-color-inactive);
    border-radius: 3px;
    border: none;
  }

  .range__control::-moz-range-thumb {
    border: none;
    height: var(--thumb-size);
    width: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
    cursor: pointer;
  }

  .range__control:enabled::-moz-range-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-moz-range-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-moz-range-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* States */
  .range__control:focus-visible {
    outline: none;
  }

  .range__control:disabled {
    opacity: 0.5;
  }

  .range__control:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  .range__control:disabled::-moz-range-thumb {
    cursor: not-allowed;
  }

  /* Tooltip output */
  .range__tooltip {
    position: absolute;
    z-index: var(--sl-z-index-tooltip);
    left: 0;
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    color: var(--sl-tooltip-color);
    opacity: 0;
    padding: var(--sl-tooltip-padding);
    transition: var(--sl-transition-fast) opacity;
    pointer-events: none;
  }

  .range__tooltip:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    translate: calc(-1 * var(--sl-tooltip-arrow-size));
  }

  .range--tooltip-visible .range__tooltip {
    opacity: 1;
  }

  /* Tooltip on top */
  .range--tooltip-top .range__tooltip {
    top: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-top .range__tooltip:after {
    border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    top: 100%;
  }

  /* Tooltip on bottom */
  .range--tooltip-bottom .range__tooltip {
    bottom: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-bottom .range__tooltip:after {
    border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    bottom: 100%;
  }

  @media (forced-colors: active) {
    .range__control,
    .range__tooltip {
      border: solid 1px transparent;
    }

    .range__control::-webkit-slider-thumb {
      border: solid 1px transparent;
    }

    .range__control::-moz-range-thumb {
      border: solid 1px transparent;
    }

    .range__tooltip:after {
      display: none;
    }
  }
`;var L=class extends X{constructor(){super(...arguments),this.formControlController=new ue(this),this.hasSlotController=new pe(this,"help-text","label"),this.localize=new Mt(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=t=>t.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(t){this.input.style.setProperty("--percent",`${t*100}%`)}syncTooltip(t){if(this.output!==null){let e=this.input.offsetWidth,o=this.output.offsetWidth,i=getComputedStyle(this.input).getPropertyValue("--thumb-size"),r=this.localize.dir()==="rtl",n=e*t;if(r){let s=`${e-n}px + ${t} * ${i}`;this.output.style.translate=`calc((${s} - ${o/2}px - ${i} / 2))`}else{let s=`${n}px - ${t} * ${i}`;this.output.style.translate=`calc(${s} - ${o/2}px + ${i} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){let t=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(t),this.tooltip!=="none"&&this.hasTooltip&&this.updateComplete.then(()=>this.syncTooltip(t))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}focus(t){this.input.focus(t)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e;return I`
      <div
        part="form-control"
        class=${ot({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":i})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${ot({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":this.localize.dir()==="rtl","range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              class="range__control"
              title=${this.title}
              type="range"
              name=${O(this.name)}
              ?disabled=${this.disabled}
              min=${O(this.min)}
              max=${O(this.max)}
              step=${O(this.step)}
              .value=${te(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?I`
                  <output part="tooltip" class="range__tooltip">
                    ${typeof this.tooltipFormatter=="function"?this.tooltipFormatter(this.value):this.value}
                  </output>
                `:""}
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${i?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};L.styles=[at,de,bn];h([et(".range__control")],L.prototype,"input",2);h([et(".range__tooltip")],L.prototype,"output",2);h([kt()],L.prototype,"hasFocus",2);h([kt()],L.prototype,"hasTooltip",2);h([f()],L.prototype,"title",2);h([f()],L.prototype,"name",2);h([f({type:Number})],L.prototype,"value",2);h([f()],L.prototype,"label",2);h([f({attribute:"help-text"})],L.prototype,"helpText",2);h([f({type:Boolean,reflect:!0})],L.prototype,"disabled",2);h([f({type:Number})],L.prototype,"min",2);h([f({type:Number})],L.prototype,"max",2);h([f({type:Number})],L.prototype,"step",2);h([f()],L.prototype,"tooltip",2);h([f({attribute:!1})],L.prototype,"tooltipFormatter",2);h([f({reflect:!0})],L.prototype,"form",2);h([he()],L.prototype,"defaultValue",2);h([Cr({passive:!0})],L.prototype,"handleThumbDragStart",1);h([K("value",{waitUntilFirstUpdate:!0})],L.prototype,"handleValueChange",1);h([K("disabled",{waitUntilFirstUpdate:!0})],L.prototype,"handleDisabledChange",1);h([K("hasTooltip",{waitUntilFirstUpdate:!0})],L.prototype,"syncRange",1);L.define("sl-range");var St=["#00aaff","#ff4444","#44dd44","#ffaa00","#cc44ff","#ff44aa"],pt=600,ui=1,vo=document.getElementById("bg").getContext("2d",{alpha:!1}),mt=document.getElementById("fg").getContext("2d",{alpha:!0}),bi=document.getElementById("overlays").getContext("2d"),wi=document.getElementById("msg"),It=document.getElementById("waiting"),Us=document.getElementById("waiting-players"),Hs=document.getElementById("end"),ci=document.getElementById("end-label"),Ws=document.getElementById("end-winner"),qs=document.getElementById("end-detail"),js=document.getElementById("replay-controls"),Ys=document.getElementById("replay-slider"),kn=document.getElementById("replay-time"),Xs=document.getElementById("replay-play"),wn=document.getElementById("result-label"),_n=document.getElementById("result-winner"),_i=document.getElementById("player-search-input"),Ks=document.getElementById("player-options"),pi=document.getElementById("player-list"),Js=document.getElementById("game-infos"),xn=document.getElementById("render"),yo=document.getElementById("decision-interval"),bo=document.getElementById("target-granularity"),hi=document.getElementById("victory-score"),xi=document.getElementById("deterministic"),Cn=document.getElementById("debug-tick"),Gs=document.getElementById("inspection-help"),$n=document.querySelector('meta[name="play-server"]').content.trim(),Ue=JSON.parse(document.getElementById("play-catalog")?.textContent||"[]"),An=Ue.find(t=>t.kind==="human"),Zs=Ue.find(t=>t.kind!=="human"),D=[An?.spec,Zs?.spec].filter(Boolean),oe=D.map(()=>0),wo=10,Ao=!1,_o=!1,Q=!1,Vt=!1,ft=!1,F=Ue.length?!!An:!0,xo=!0,Z=null,Ve=null,Ci=null,fi=0,Be=null,mi=null,gi=0,ki=0,Co=[],st=[],ct,Rt,J,Ft,He=[],En=[],ge={},wt={arena_size:80,radius:.6,tick_hz:60},fe=null,be=!1,Pt=[],Bt=-1,Eo="s",Qs=new Set([" ","arrowleft","arrowright","r"]),ye,$i=new URL($n||location.origin),Sn=new URL("/ws",$i);Sn.protocol=$i.protocol==="https:"?"wss:":"ws:";var N,Ai=!1,vi=!1,Tt=D.length?{human:F,specs:F?D.slice(1):D.slice()}:null,ko=!1,Fe=!1,yi=1;mt.imageSmoothingEnabled=!0;function di(t,e,o,i){let r=Math.ceil(e*o);if(t.canvas.width===r&&t.canvas.height===r){t.setTransform(o,0,0,o,0,0);return}let n;i&&(n=document.createElement("canvas"),n.width=t.canvas.width,n.height=t.canvas.height,n.getContext("2d").drawImage(t.canvas,0,0)),t.canvas.width=r,t.canvas.height=r,n&&t.drawImage(n,0,0,r,r),t.setTransform(o,0,0,o,0,0)}function Tn(){let t=Math.max(1,Math.floor(Math.min(window.innerWidth-Js.clientWidth-8,window.innerHeight-8))),e=window.devicePixelRatio||1;xn.style.width=`${t+8}px`,xn.style.height=`${t+8}px`,!(t===pt&&e===ui)&&(pt=t,ui=e,di(vo,t,e,!0),di(mt,t,e,!1),di(bi,t,e,!1),mt.imageSmoothingEnabled=!0,Ft?.resize(t),Rt?.resize(t,e),J?.resize(t),Z&&(Rt?.draw(Z.players),J?.draw(Z)))}function qe(){Ft?Ft.reset():(vo.fillStyle="#222222",vo.fillRect(0,0,pt,pt)),Rt?Rt.reset():mt.clearRect(0,0,pt,pt),J?J.reset():bi.clearRect(0,0,pt,pt),Z=null,Ve=null,Ci=null,Co=[],Be=null,mi=null,gi=0,ki=0,be=!1,Pt=[],Bt=-1,mt.canvas.style.cursor="",J?.setTargetChoices([],-1)}function Ei(){be=!1,Pt=[],Bt=-1,mt.canvas.style.cursor="",J?.setTargetChoices([],-1),J?.draw(Z)}function ta(t){let e=mt.canvas.getBoundingClientRect(),o=(t.clientX-e.left)/e.width*wt.arena_size,i=(1-(t.clientY-e.top)/e.height)*wt.arena_size,r=-1,n=1/0;return Pt.forEach(([s,a],l)=>{let c=(o-s)**2+(i-a)**2;c<n&&(r=l,n=c)}),r}function ee(t=null){Cn.textContent=t===null?"":`\xB7 tick ${t}`,Cn.classList.toggle("hidden",t===null)}function Et(t){return t==="you"?"You":t.startsWith("ckpt:")?ye.labelFor(t)?ye.labelFor(t):t.slice(5).split(/[\\/]/).pop().replace(/\.safetensors$/,""):t.replaceAll("_"," ")}function Si(){He=D.map((t,e)=>{let o=document.createElement("div");o.className=`player${F&&t==="you"?" local":""}`,o.style.setProperty("--player-color",St[e%St.length]);let i=document.createElement("span");i.className="line-color-preview";let r=document.createElement("sl-dropdown");r.className="player-settings-dropdown",r.placement="bottom-start",r.hoist=!0,r.stayOpenOnSelect=!0;let n=document.createElement("button");n.className="player-settings",n.type="button",n.textContent="\u2699",n.title=`Options for ${Et(t)}`,n.setAttribute("aria-label",`Options for ${Et(t)}`),n.slot="trigger";let s=document.createElement("span");s.className="player-name",s.textContent=Et(t),s.title=Et(t),s.addEventListener("wheel",c=>{if(s.scrollWidth<=s.clientWidth)return;let u=c.deltaX||c.deltaY,d=s.scrollWidth-s.clientWidth,m=Math.max(0,Math.min(d,s.scrollLeft+u));m!==s.scrollLeft&&(s.scrollLeft=m,c.preventDefault())},{passive:!1});let a=document.createElement("button");a.className=`player-remove${D.length>1?"":" hidden"}`,a.type="button",a.textContent="\xD7",a.title=`Remove ${Et(t)}`,a.setAttribute("aria-label",`Remove ${Et(t)}`),a.addEventListener("click",()=>sa(e));let l=document.createElement("span");return l.className="player-score",l.textContent=oe[e]??0,l.setAttribute("aria-label",`${Et(t)} score`),r.append(n,ea(e)),o.append(i,r,s,a,l),{element:o,score:l,dead:null}}),pi.replaceChildren(...He.map(t=>t.element)),Us.replaceChildren(...D.map((t,e)=>{let o=document.createElement("li");return o.textContent=Et(t),o.style.color=St[e%St.length],o})),pi.classList.toggle("locked",Q)}function ea(t){let e=document.createElement("div");e.className="player-settings-menu";let o=En[t]||{};return[["reachable","Show reachable region"],["value","Show value glow"]].forEach(([r,n])=>{let s=document.createElement("sl-checkbox");s.checked=!!ge[t]?.[r],s.disabled=!o[r],s.textContent=o[r]?n:`${n} unavailable`,s.addEventListener("sl-change",()=>{ge[t]={...ge[t],[r]:s.checked},oa(),J.draw(Z)}),e.append(s)}),e}function oa(){N.readyState===WebSocket.OPEN&&N.send(JSON.stringify({type:"visuals",visuals:ge}))}function me(t){_i.disabled=t,pi.classList.toggle("locked",t),t&&ye.hide()}function $o(t,e){Q||!t&&!e.length||(F=t,D=F?["you",...e]:[...e],So(),Vt=!1,fe=null,Tt={human:F,specs:[...e]},ko=!1,Fe=!1,Si(),We(),Ln(),Pn())}function So(){oe=D.map(()=>0),Ao=!1,_o=!1,He.forEach((t,e)=>{t.score.textContent=oe[e]??0})}function ia(t){_o||(_o=!0,!(t<0||t>=oe.length)&&(oe[t]+=1,Ao=oe[t]>=wo,He[t].score.textContent=oe[t]))}function Pn(){!Tt||ko||N?.readyState!==WebSocket.OPEN||(N.send(JSON.stringify({type:"configure",...Tt})),ko=!0)}function ra(t){if(!Tt)return!1;let e=Tt.human?["you",...Tt.specs]:Tt.specs;return e.length===t.length&&e.every((o,i)=>o===t[i])}function na(t){_i.value="",ye.hide();let e=F?D.slice(1):D.slice();if(t==="you"){F||$o(!0,e);return}$o(F,[...e,t])}function sa(t){if(Q||D.length<=1)return;if(F&&D[t]==="you"){$o(!1,D.slice(1));return}let e=F?D.slice(1):D.slice();e.splice(F?t-1:t,1),$o(F,e)}function Ti(t){t.forEach((e,o)=>{let i=He[o];if(!i)return;let r=!e.alive;i.dead!==r&&(i.dead=r,i.element.classList.toggle("dead",r))})}function Rn(t,e,o,i=null){i==="won"?(t.textContent="WIN",e.textContent=""):i==="lost"?(t.textContent="LOST",e.textContent=""):i==="tied"?(t.textContent="TIE",e.textContent=""):(t.textContent=o<0?"TIE":"WINNER: ",e.textContent=o<0?"":Et(D[o])),e.style.color=o<0?"":St[o%St.length]}function aa(t,e){t.textContent="",e.textContent="",e.style.color=""}function Pi(t){let e=document.createElement("kbd");return e.className="game-key",e.textContent=t.toUpperCase(),e}function je(t,e=null){e===null?aa(wn,_n):Rn(wn,_n,e),wi.textContent=t,It.classList.remove("ready","waking","loading"),It.classList.toggle("has-result",e!==null),It.classList.remove("hidden")}function la(t=null){je("",t),wi.append("Press ",Pi(Eo)," to start"),It.classList.add("ready")}function Ri(){je("Waking Shai Hulud \u2014 usually a few seconds"),It.classList.add("waking")}function Ln(){je("Loading players..."),It.classList.add("loading")}function ca(){je(""),wi.append("Press ",Pi(Eo)," to wake Shai Hulud"),It.classList.add("ready")}function go(){It.classList.add("hidden")}function ha(t,e,o,i=!1){Rn(ci,Ws,t,o),i&&(ci.textContent=`MATCH ${ci.textContent}`),qs.replaceChildren(i?`${wo} points. Drag the timeline to review, or press `:`${e} ticks. Drag the timeline to review, or press `,Pi(Eo),i?" to start a new match.":" to play again."),js.classList.toggle("hidden",st.length===0),ct.show(st)}function We(){ct.hide()}function On(t){let e=st[t];if(e){qe();for(let o=1;o<=t;o++){let i=st[o-1],r=st[o];Ft.appendFrame(i.players,r.players)}Ft.draw(),Rt.draw(e.players),J.draw(e),Z=e,Ve=e,Ti(e.players),kn.textContent=`${(e.tick/wt.tick_hz).toFixed(1)}s \xB7 tick ${e.tick}`}}ct=zi({end:Hs,slider:Ys,time:kn,playButton:Xs,render:On,tickHz:()=>wt.tick_hz});function da(t){let e={...t.overlays||{}};return Object.entries(ge).forEach(([o,i])=>{if(!i.reachable||e[o]?.reachable)return;let r=Ci?.overlays?.[o]?.reachable;r&&(e[o]={...e[o]||{},reachable:r})}),{...t,overlays:e}}function ua(t){t=da(t),Ci=t,ki=performance.now(),Ve&&Ft.appendFrame(Ve.players,t.players),Ve=t,Co[0]=t,Co.length=1,st.push(t),To()}function pa(t){if(fi=0,!Q)return;let e=Co.pop();if(e&&(Ft.draw(),mi=Be,Be=e,gi=ki,J.draw(e),Z=e,Ti(e.players)),!Be)return;let o=Bi(Be,mi,ft?0:t-gi,wt,yi,F);Rt.clear(),Rt.draw(o.players),ft||To()}function To(){fi||(fi=requestAnimationFrame(pa))}function fa(t){Ai=!0;let e=JSON.parse(t.data);if(e.type==="config")Tt||(D=e.seats,So(),F=e.human??D.includes("you"),Tt={human:F,specs:F?D.slice(1):D.slice()}),Fe=ra(e.seats),xo=e.rewind??!0,Gs.textContent=xo?"Space stops at the next boundary. Then \u2190, \u2191, \u2192, N, and R inspect one tick at a time. V refreshes reachability; C lets you click a controller target.":"Space stops at the next boundary. Then \u2190, \u2191, \u2192, and N inspect one tick at a time. V refreshes reachability; C lets you click a controller target.",e.catalog&&ye.setCatalog(e.catalog),wt={...wt,...e.simulator},yo.value=e.decision_interval??16,bo.value=e.target_granularity??16,xi.checked=e.deterministic??!0,En=e.visuals||[],ge={},ct.hide(),Rt=Mi({context:mt,colors:St,size:pt,pixelRatio:ui,simulator:()=>wt}),J=Di({context:bi,colors:St,size:pt,simulator:()=>wt}),Ft=Ni({context:vo,colors:St,size:pt,simulator:()=>wt}),Rt.setPlayers(D.length),qe(),ee(),Si(),me(!1),fe=null,Fe?je("Waiting for players..."):(Ln(),Pn());else if(e.type==="ready"){if(!Fe)return;Vt=!0,me(!1),ct.active||(We(),la(fe)),fe=null,vi&&(vi=!1,Mn())}else if(e.type==="frame")ua(e);else if(e.type==="paused")ft=!0,ee(e.ticks),go();else if(e.type==="controller_targets")Pt=e.targets,Bt=Math.floor(Pt.length/2),be=!0,mt.canvas.style.cursor="crosshair",J.setTargetChoices(Pt,Bt),J.draw(Z);else if(e.type==="resumed")Ei(),ft=!1,ee(),go(),To();else if(e.type==="visuals_refreshed"){if(!Z)return;Z={...Z,overlays:e.overlays||{}},J.draw(Z)}else if(e.type==="rewound"){Q=!0,ft=!0,Vt=!1,me(!0),go(),We();let o=e.frame;st=st.filter(i=>i.tick<=o.tick),(!st.length||st.at(-1).tick!==o.tick)&&st.push(o),On(st.length-1),ee(o.tick)}else e.type==="end"&&(Q=!1,ft=!1,ee(),me(!1),Ti(e.players||Z?.players||[]),fe=e.winner,ia(e.winner),ha(e.winner,e.ticks,e.outcome,Ao))}function ma(){if(Vt=!1,!Ai){Ri(),setTimeout(Li,1e3);return}Q=!1,ft=!1,ee(),me(!1),ca()}function Li(){N&&(N.readyState===WebSocket.CONNECTING||N.readyState===WebSocket.OPEN)||(Ai=!1,ko=!1,Fe=!1,N=new WebSocket(Sn),N.onmessage=fa,N.onclose=ma)}var ve=new Set;function zn(){let t=ve.has("ArrowLeft"),e=ve.has("ArrowRight");yi=ve.has("ArrowUp")||t&&e?1:t?2:e?0:1,N.send(JSON.stringify({type:"input",action:yi}))}function Mn(){!Vt||Q||(Ao&&So(),Q=!0,ft=!1,ee(),me(!0),Vt=!1,fe=null,_o=!1,st=[],ct.hide(),qe(),go(),We(),To(),N.send(JSON.stringify({type:"start"})))}function ga(){qe(),vi=!0,Ri(),Li()}mt.canvas.addEventListener("click",t=>{if(!be||!ft||!F)return;let e=Pt[Bt];if(!e)return;let[o,i]=e;Ei(),N.send(JSON.stringify({type:"controller_target",x:o,y:i})),t.preventDefault()});mt.canvas.addEventListener("mousemove",t=>{if(!be||!Pt.length)return;let e=ta(t);e!==Bt&&(Bt=e,J.setTargetChoices(Pt,Bt),J.draw(Z))});ye=Ii({input:_i,options:Ks,locked:()=>Q,onSelect:na,initialCatalog:Ue,playersUrl:Ue.length?null:new URL("/players",$i)});Si();function Oi(){let t=Math.max(1,Math.min(1e4,Number.parseInt(yo.value,10)||16)),e=Math.max(1,Math.min(256,Number.parseInt(bo.value,10)||16));yo.value=t,bo.value=e,N.send(JSON.stringify({type:"settings",decision_interval:t,target_granularity:e,deterministic:xi.checked}))}yo.addEventListener("sl-change",Oi);bo.addEventListener("sl-change",Oi);xi.addEventListener("sl-change",Oi);hi.addEventListener("sl-change",()=>{wo=Math.max(1,Math.min(100,Number.parseInt(hi.value,10)||10)),hi.value=wo,So()});function va(t){return t.composedPath().some(e=>e instanceof Element&&e.matches("input, textarea, [contenteditable], sl-input, sl-range, button, sl-button"))}function ya(t){return ct.active&&t.repeat&&Qs.has(t.key.toLowerCase())}addEventListener("keydown",t=>{if(!va(t)){if(ya(t)){t.preventDefault();return}if(t.key.toLowerCase()===Eo&&!Q&&(We(),Vt?Mn():ga(),t.preventDefault()),t.key===" "){if(be){Ei(),t.preventDefault();return}ct.active?ct.toggle():Q&&N.send(JSON.stringify({type:ft?"continue":"break"})),t.preventDefault();return}if(ct.active&&(t.key==="ArrowLeft"||t.key==="ArrowRight")){ct.step(t.key==="ArrowLeft"?-1:1),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&xo&&ct.active&&!Q){Q=!0,Vt=!1,N.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}if(Q&&ft){if(t.key.toLowerCase()==="v"&&!t.repeat){N.send(JSON.stringify({type:"refresh_visuals"})),t.preventDefault();return}if(t.key.toLowerCase()==="c"&&F&&!t.repeat){N.send(JSON.stringify({type:"controller_targets"})),t.preventDefault();return}let e={ArrowLeft:2,ArrowUp:1,ArrowRight:0}[t.key];if(e!==void 0){N.send(JSON.stringify({type:"step",action:e})),t.preventDefault();return}if(t.key.toLowerCase()==="n"&&!t.repeat){N.send(JSON.stringify({type:"next"})),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&xo){N.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}}(t.key==="ArrowLeft"||t.key==="ArrowUp"||t.key==="ArrowRight")&&(ve.has(t.key)||(ve.add(t.key),zn()),t.preventDefault())}});addEventListener("keyup",t=>{ve.delete(t.key)&&zn()});addEventListener("resize",Tn);Tn();$n&&Ri();Li();qe();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
