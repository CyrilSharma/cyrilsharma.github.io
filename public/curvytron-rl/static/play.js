function Ai({end:t,slider:e,time:o,playButton:i,render:r,tickHz:n}){let s=t.firstElementChild,a=[],l=!1,c=!1,p=0,d=0,u=null;function f(m){c=m&&a.length>1,i.textContent=c?"Pause":"Play",d=0,c&&!p&&(p=requestAnimationFrame(g))}function g(m){if(p=0,!!c){if(!d||m-d<1e3/n()){d||=m,p=requestAnimationFrame(g);return}e.value=(Number(e.value)+1)%a.length,r(Number(e.value)),d=m,p=requestAnimationFrame(g)}}function b(m){a=m,l=!0;let w=Math.max(a.length-1,0);e.max=w,requestAnimationFrame(()=>{!l||a!==m||(e.value=w)}),t.classList.remove("hidden"),f(!1),a.length&&r(w)}function y(){l=!1,f(!1),t.classList.add("hidden")}return e.addEventListener("sl-input",()=>r(Number(e.value))),i.addEventListener("click",()=>f(!c)),s.addEventListener("pointerdown",m=>{if(m.target.closest("input, button, sl-range"))return;let w=s.getBoundingClientRect(),_=t.getBoundingClientRect(),x=w.left-_.left,$=w.top-_.top;s.style.left=`${x}px`,s.style.top=`${$}px`,s.style.transform="none",u={x:m.clientX,y:m.clientY,left:x,top:$},s.classList.add("dragging"),s.setPointerCapture(m.pointerId)}),s.addEventListener("pointermove",m=>{u&&(s.style.left=`${u.left+m.clientX-u.x}px`,s.style.top=`${u.top+m.clientY-u.y}px`)}),s.addEventListener("pointerup",()=>{u=null,s.classList.remove("dragging")}),{get active(){return l},hide:y,show:b,step(m){f(!1),e.value=(Number(e.value)+m+a.length)%a.length,r(Number(e.value))},toggle(){f(!c)}}}function Ei({context:t,colors:e,size:o,pixelRatio:i,simulator:r}){let n=[],s=o,a=i;function l(b){return[b.x*s,(1-b.y)*s]}function c(b){let y=Math.max(2,r().radius*s/r().arena_size),m=Math.ceil(y*2),w=document.createElement("canvas");w.width=Math.ceil(m*a),w.height=Math.ceil(m*a);let _=w.getContext("2d");return _.scale(a,a),_.beginPath(),_.arc(m/2,m/2,y,0,2*Math.PI),_.fillStyle=e[b%e.length],_.fill(),{canvas:w,radius:m/2,width:m,clearX:0,clearY:0,clearWidth:m}}function p(b){n=Array.from({length:b},(y,m)=>c(m))}function d(){t.clearRect(0,0,s,s),n.forEach(b=>{b.clearX=0,b.clearY=0,b.clearWidth=b.width})}function u(){n.forEach(b=>t.clearRect(b.clearX,b.clearY,b.clearWidth,b.clearWidth))}function f(b){b.forEach((y,m)=>{let w=n[m],[_,x]=l(y),$=_-w.radius,k=x-w.radius;t.drawImage(w.canvas,$,k,w.width,w.width),w.clearX=Math.floor($)-1,w.clearY=Math.floor(k)-1,w.clearWidth=w.width+2})}function g(b,y){s=b,a=y,p(n.length)}return{clear:u,draw:f,reset:d,resize:g,setPlayers:p}}function Si({context:t,colors:e,size:o,simulator:i}){let r=o;function n(u){return[u.x*r,(1-u.y)*r]}function s(u,f){t.strokeStyle=f,t.fillStyle=f;let g=2*Math.PI/u.distances[0].length;u.points.forEach(([b,y],m)=>{let[w,_]=u.headings[m],x=Math.atan2(_,w),$=b*r/i().arena_size,k=(1-y/i().arena_size)*r;u.distances[m].forEach((R,B)=>{let U=x-Math.PI+(B+.5)*g,L=R*r/i().arena_size;t.globalAlpha=.05+.18*(R/u.max_distance),t.beginPath(),t.moveTo($,k),t.arc($,k,L,-U-g/2,-U+g/2),t.closePath(),t.fill(),t.globalAlpha=.35,t.beginPath(),t.moveTo($,k),t.lineTo($+Math.cos(U)*L,k-Math.sin(U)*L),t.stroke()}),t.globalAlpha=.95,t.beginPath(),t.arc($,k,2,0,2*Math.PI),t.fill()})}function a(u,f,g){let b=u>=0,y=Math.tanh(Math.abs(u)),[m,w]=n(f),_=30+42*y,x=t.createRadialGradient(m,w,0,m,w,_);x.addColorStop(0,g),x.addColorStop(.28,g+"aa"),x.addColorStop(1,g+"00"),t.globalAlpha=b?.18+.72*y:.08+.18*y,t.fillStyle=x,t.beginPath(),t.arc(m,w,_,0,2*Math.PI),t.fill();let $=`V ${b?"+":"\u2212"}${Math.abs(u).toFixed(2)}`;t.globalAlpha=1,t.font="600 13px Lato, Helvetica, sans-serif";let k=t.measureText($).width+12,R=Math.max(4,Math.min(r-k-4,m-k/2)),B=w<38?w+42:w-30;t.fillStyle="rgba(20, 20, 20, .8)",t.beginPath(),t.roundRect(R,B-15,k,20,5),t.fill(),t.fillStyle=b?g:"#aeb6c2",t.fillText($,R+6,B)}function l(u,f,g){if(!u?.target||!f)return;let[b,y]=n(f),m=u.target[0]*r/i().arena_size,w=(1-u.target[1]/i().arena_size)*r;if(t.strokeStyle=g,t.fillStyle=g,t.globalAlpha=.9,t.setLineDash([7,5]),t.beginPath(),t.moveTo(b,y),t.lineTo(m,w),t.stroke(),t.setLineDash([]),t.beginPath(),t.arc(m,w,7,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(m-11,w),t.lineTo(m+11,w),t.moveTo(m,w-11),t.lineTo(m,w+11),t.stroke(),Number.isInteger(u.action)){let _=["R","S","L"];t.font="600 13px Lato, Helvetica, sans-serif",t.fillText(_[u.action],m+12,w-12)}}function c(){t.clearRect(0,0,r,r)}function p(u){c(),u&&(Object.entries(u.overlays||{}).forEach(([f,g])=>{let b=Number(f),y=e[b%e.length];g.lidar&&s(g.lidar,y),Number.isFinite(g.value)&&u.players[b]&&a(g.value,u.players[b],y)}),u.controller&&l(u.controller,u.players[0],e[0]),t.globalAlpha=1)}function d(u){r=u}return{draw:p,reset:c,resize:d}}function Pi({context:t,colors:e,size:o,simulator:i}){t.lineCap="round";let r=[],n=[],s=o;function a(g){return[g.x*s,(1-g.y)*s]}function l(){r.length=0,n.length=0,t.fillStyle="#222222",t.fillRect(0,0,s,s)}function c(g,b,y){if(!(b.alive&&b.trail_active&&g?.alive&&g.trail_active)){n[y]=!1;return}let w=r[y]??=[];(!n[y]||!w.length)&&w.push([g]),w.at(-1).push(b),n[y]=!0}function p(g,b){b.forEach((y,m)=>c(g[m],y,m))}function d(g){t.beginPath(),g.forEach(b=>{t.moveTo(...a(b[0]));for(let y=1;y<b.length;y++)t.lineTo(...a(b[y]))}),t.stroke()}function u(){t.lineWidth=Math.max(2,i().radius*s/i().arena_size*2),r.forEach((g,b)=>{g.length&&(t.strokeStyle=e[b%e.length],d(g),r[b]=[])})}function f(g){s=g,t.lineCap="round"}return{appendFrame:p,draw:u,reset:l,resize:f}}function Ti({input:t,options:e,locked:o,onSelect:i,initialCatalog:r=[],playersUrl:n="/players"}){let s=[],a="",l=-1,c=new Map;function p(y){return c.get(y)}function d(){l=-1,e.replaceChildren(),e.classList.add("hidden"),t.setAttribute("aria-expanded","false")}function u(){if(o()||!s.length){d();return}let y=t.value.trim().toLowerCase(),m=s.filter(w=>`${w.label} ${w.spec}`.toLowerCase().includes(y));e.replaceChildren(...m.map((w,_)=>{let x=document.createElement("button");x.className="player-option",x.type="button",x.dataset.spec=w.spec,x.setAttribute("role","option"),x.setAttribute("aria-selected",_===l?"true":"false"),_===l&&x.classList.add("active");let $=document.createElement("span");$.className="player-option-name",$.textContent=w.label;let k=document.createElement("span");return k.className="player-option-kind",k.textContent=w.kind,x.title=w.label,x.append($,k),x})),e.classList.toggle("hidden",m.length===0),t.setAttribute("aria-expanded",m.length>0?"true":"false")}function f(y){if(!Array.isArray(y))return;let m=y.map(w=>`${w.spec}
${w.label}
${w.kind}`).join(`
`);m!==a&&(s=y,a=m,c=new Map(y.filter(w=>w.kind==="checkpoint").map(w=>[w.spec,w.label])),l=-1,e.classList.contains("hidden")||u())}function g(y){i(y),t.blur()}async function b(){try{let y=await fetch(n,{cache:"no-store"});y.ok&&f(await y.json())}catch{}}return t.addEventListener("sl-focus",u),t.addEventListener("sl-input",()=>{l=-1,u()}),t.addEventListener("keydown",y=>{let m=[...e.querySelectorAll(".player-option")];if(y.key==="ArrowDown"||y.key==="ArrowUp"){if(!m.length)return;l=(l+(y.key==="ArrowDown"?1:m.length-1))%m.length,u(),y.preventDefault()}else y.key==="Enter"&&l>=0&&m[l]?(g(m[l].dataset.spec),y.preventDefault()):y.key==="Escape"&&(d(),t.blur(),y.preventDefault(),y.stopPropagation())}),t.addEventListener("sl-blur",()=>setTimeout(d,120)),e.addEventListener("mousedown",y=>y.preventDefault()),e.addEventListener("click",y=>{let m=y.target.closest(".player-option");m&&g(m.dataset.spec)}),f(r),n&&(b(),setInterval(()=>{o()||b()},3e3)),{hide:d,labelFor:p,setCatalog:f}}function Tn(t,e,o){if(Number.isInteger(e.action))return e.action;if(!t||o<=0)return 1;let r=Math.atan2(Math.sin(e.angle-t.angle),Math.cos(e.angle-t.angle))/o;return Math.abs(r)<1e-4?1:r>0?2:0}function Rn(t,e,o,i){if(!t.alive||o<=0)return{...t};let n=(e===2?1:e===0?-1:0)*i.angular_velocity_per_second,s=i.velocity_per_second/i.arena_size,a=s*o,l=t.angle+n*o,c,p;if(n===0)c=t.x+Math.cos(t.angle)*a,p=t.y+Math.sin(t.angle)*a;else{let f=s/n;c=t.x+f*(Math.sin(l)-Math.sin(t.angle)),p=t.y+f*(Math.cos(t.angle)-Math.cos(l))}let d=i.radius/i.arena_size,u=1-d;return{...t,x:Math.max(d,Math.min(u,c)),y:Math.max(d,Math.min(u,p)),angle:l}}function Ri(t,e,o,i,r,n){if(!t||!i.velocity_per_second||!i.angular_velocity_per_second)return t;let a=Math.max(0,Math.min(100,o))/1e3,l=e?t.tick-e.tick:0;return{...t,players:t.players.map((c,p)=>{let d=e?.players[p],u=n&&p===0?r:Tn(d,c,l);return Rn(c,u,a,i)})}}var We=globalThis,qe=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ao=Symbol(),Li=new WeakMap,ve=class{constructor(e,o,i){if(this._$cssResult$=!0,i!==Ao)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(qe&&e===void 0){let i=o!==void 0&&o.length===1;i&&(e=Li.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Li.set(o,e))}return e}toString(){return this.cssText}},Oi=t=>new ve(typeof t=="string"?t:t+"",void 0,Ao),N=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((i,r,n)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new ve(o,t,Ao)},zi=(t,e)=>{if(qe)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let i=document.createElement("style"),r=We.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,t.appendChild(i)}},Eo=qe?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let i of e.cssRules)o+=i.cssText;return Oi(o)})(t):t;var{is:Ln,defineProperty:On,getOwnPropertyDescriptor:zn,getOwnPropertyNames:Mn,getOwnPropertySymbols:Dn,getPrototypeOf:Nn}=Object,je=globalThis,Mi=je.trustedTypes,In=Mi?Mi.emptyScript:"",Bn=je.reactiveElementPolyfillSupport,ye=(t,e)=>t,$t={toAttribute(t,e){switch(e){case Boolean:t=t?In:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},Ye=(t,e)=>!Ln(t,e),Di={attribute:!0,type:String,converter:$t,reflect:!1,useDefault:!1,hasChanged:Ye};Symbol.metadata??=Symbol("metadata"),je.litPropertyMetadata??=new WeakMap;var ft=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=Di){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,o);r!==void 0&&On(this.prototype,e,r)}}static getPropertyDescriptor(e,o,i){let{get:r,set:n}=zn(this.prototype,e)??{get(){return this[o]},set(s){this[o]=s}};return{get:r,set(s){let a=r?.call(this);n?.call(this,s),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Di}static _$Ei(){if(this.hasOwnProperty(ye("elementProperties")))return;let e=Nn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ye("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ye("properties"))){let o=this.properties,i=[...Mn(o),...Dn(o)];for(let r of i)this.createProperty(r,o[r])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)o.unshift(Eo(r))}else e!==void 0&&o.push(Eo(e));return o}static _$Eu(e,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zi(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,i){this._$AK(e,i)}_$ET(e,o){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:$t).toAttribute(o,i.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,o){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:$t;this._$Em=r;let a=s.fromAttribute(o,n.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,o,i,r=!1,n){if(e!==void 0){let s=this.constructor;if(r===!1&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??Ye)(n,o)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:i,reflect:r,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??o??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(o=void 0),this._$AL.set(e,o)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:s}=n,a=this[r];s!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,n,a)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};ft.elementStyles=[],ft.shadowRootOptions={mode:"open"},ft[ye("elementProperties")]=new Map,ft[ye("finalized")]=new Map,Bn?.({ReactiveElement:ft}),(je.reactiveElementVersions??=[]).push("2.1.2");var Po=globalThis,Ni=t=>t,Xe=Po.trustedTypes,Ii=Xe?Xe.createPolicy("lit-html",{createHTML:t=>t}):void 0,To="$lit$",mt=`lit$${Math.random().toFixed(9).slice(2)}$`,Ro="?"+mt,Vn=`<${Ro}>`,Vt=document,we=()=>Vt.createComment(""),_e=t=>t===null||typeof t!="object"&&typeof t!="function",Lo=Array.isArray,Wi=t=>Lo(t)||typeof t?.[Symbol.iterator]=="function",So=`[ 	
\f\r]`,be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bi=/-->/g,Vi=/>/g,It=RegExp(`>|${So}(?:([^\\s"'>=/]+)(${So}*=${So}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fi=/'/g,Ui=/"/g,qi=/^(?:script|style|textarea|title)$/i,Oo=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),O=Oo(1),_a=Oo(2),xa=Oo(3),q=Symbol.for("lit-noChange"),P=Symbol.for("lit-nothing"),Hi=new WeakMap,Bt=Vt.createTreeWalker(Vt,129);function ji(t,e){if(!Lo(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ii!==void 0?Ii.createHTML(e):e}var Yi=(t,e)=>{let o=t.length-1,i=[],r,n=e===2?"<svg>":e===3?"<math>":"",s=be;for(let a=0;a<o;a++){let l=t[a],c,p,d=-1,u=0;for(;u<l.length&&(s.lastIndex=u,p=s.exec(l),p!==null);)u=s.lastIndex,s===be?p[1]==="!--"?s=Bi:p[1]!==void 0?s=Vi:p[2]!==void 0?(qi.test(p[2])&&(r=RegExp("</"+p[2],"g")),s=It):p[3]!==void 0&&(s=It):s===It?p[0]===">"?(s=r??be,d=-1):p[1]===void 0?d=-2:(d=s.lastIndex-p[2].length,c=p[1],s=p[3]===void 0?It:p[3]==='"'?Ui:Fi):s===Ui||s===Fi?s=It:s===Bi||s===Vi?s=be:(s=It,r=void 0);let f=s===It&&t[a+1].startsWith("/>")?" ":"";n+=s===be?l+Vn:d>=0?(i.push(c),l.slice(0,d)+To+l.slice(d)+mt+f):l+mt+(d===-2?a:f)}return[ji(t,n+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},xe=class t{constructor({strings:e,_$litType$:o},i){let r;this.parts=[];let n=0,s=0,a=e.length-1,l=this.parts,[c,p]=Yi(e,o);if(this.el=t.createElement(c,i),Bt.currentNode=this.el.content,o===2||o===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=Bt.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(To)){let u=p[s++],f=r.getAttribute(d).split(mt),g=/([.?@])?(.*)/.exec(u);l.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?Je:g[1]==="?"?Ge:g[1]==="@"?Ze:Ut}),r.removeAttribute(d)}else d.startsWith(mt)&&(l.push({type:6,index:n}),r.removeAttribute(d));if(qi.test(r.tagName)){let d=r.textContent.split(mt),u=d.length-1;if(u>0){r.textContent=Xe?Xe.emptyScript:"";for(let f=0;f<u;f++)r.append(d[f],we()),Bt.nextNode(),l.push({type:2,index:++n});r.append(d[u],we())}}}else if(r.nodeType===8)if(r.data===Ro)l.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(mt,d+1))!==-1;)l.push({type:7,index:n}),d+=mt.length-1}n++}}static createElement(e,o){let i=Vt.createElement("template");return i.innerHTML=e,i}};function Ft(t,e,o=t,i){if(e===q)return e;let r=i!==void 0?o._$Co?.[i]:o._$Cl,n=_e(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,o,i)),i!==void 0?(o._$Co??=[])[i]=r:o._$Cl=r),r!==void 0&&(e=Ft(t,r._$AS(t,e.values),r,i)),e}var Ke=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:i}=this._$AD,r=(e?.creationScope??Vt).importNode(o,!0);Bt.currentNode=r;let n=Bt.nextNode(),s=0,a=0,l=i[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new Qt(n,n.nextSibling,this,e):l.type===1?c=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(c=new Qe(n,this,e)),this._$AV.push(c),l=i[++a]}s!==l?.index&&(n=Bt.nextNode(),s++)}return Bt.currentNode=Vt,r}p(e){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,o),o+=i.strings.length-2):i._$AI(e[o])),o++}},Qt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,i,r){this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=Ft(this,e,o),_e(e)?e===P||e==null||e===""?(this._$AH!==P&&this._$AR(),this._$AH=P):e!==this._$AH&&e!==q&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Wi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==P&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(Vt.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=xe.createElement(ji(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(o);else{let n=new Ke(r,this),s=n.u(this.options);n.p(o),this.T(s),this._$AH=n}}_$AC(e){let o=Hi.get(e.strings);return o===void 0&&Hi.set(e.strings,o=new xe(e)),o}k(e){Lo(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,r=0;for(let n of e)r===o.length?o.push(i=new t(this.O(we()),this.O(we()),this,this.options)):i=o[r],i._$AI(n),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let i=Ni(e).nextSibling;Ni(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ut=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,i,r,n){this.type=1,this._$AH=P,this._$AN=void 0,this.element=e,this.name=o,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=P}_$AI(e,o=this,i,r){let n=this.strings,s=!1;if(n===void 0)e=Ft(this,e,o,0),s=!_e(e)||e!==this._$AH&&e!==q,s&&(this._$AH=e);else{let a=e,l,c;for(e=n[0],l=0;l<n.length-1;l++)c=Ft(this,a[i+l],o,l),c===q&&(c=this._$AH[l]),s||=!_e(c)||c!==this._$AH[l],c===P?e=P:e!==P&&(e+=(c??"")+n[l+1]),this._$AH[l]=c}s&&!r&&this.j(e)}j(e){e===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Je=class extends Ut{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===P?void 0:e}},Ge=class extends Ut{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==P)}},Ze=class extends Ut{constructor(e,o,i,r,n){super(e,o,i,r,n),this.type=5}_$AI(e,o=this){if((e=Ft(this,e,o,0)??P)===q)return;let i=this._$AH,r=e===P&&i!==P||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==P&&(i===P||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Qe=class{constructor(e,o,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Ft(this,e)}},Xi={M:To,P:mt,A:Ro,C:1,L:Yi,R:Ke,D:Wi,V:Ft,I:Qt,H:Ut,N:Ge,U:Ze,B:Je,F:Qe},Fn=Po.litHtmlPolyfillSupport;Fn?.(xe,Qt),(Po.litHtmlVersions??=[]).push("3.3.3");var Ki=(t,e,o)=>{let i=o?.renderBefore??e,r=i._$litPart$;if(r===void 0){let n=o?.renderBefore??null;i._$litPart$=r=new Qt(e.insertBefore(we(),n),n,void 0,o??{})}return r._$AI(t),r};var zo=globalThis,At=class extends ft{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ki(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};At._$litElement$=!0,At.finalized=!0,zo.litElementHydrateSupport?.({LitElement:At});var Un=zo.litElementPolyfillSupport;Un?.({LitElement:At});(zo.litElementVersions??=[]).push("4.2.2");var Ji=N`
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
`;var Qi=Object.defineProperty,Hn=Object.defineProperties,Wn=Object.getOwnPropertyDescriptor,qn=Object.getOwnPropertyDescriptors,Gi=Object.getOwnPropertySymbols,jn=Object.prototype.hasOwnProperty,Yn=Object.prototype.propertyIsEnumerable,Mo=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),Do=t=>{throw TypeError(t)},Zi=(t,e,o)=>e in t?Qi(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,X=(t,e)=>{for(var o in e||(e={}))jn.call(e,o)&&Zi(t,o,e[o]);if(Gi)for(var o of Gi(e))Yn.call(e,o)&&Zi(t,o,e[o]);return t},Et=(t,e)=>Hn(t,qn(e)),h=(t,e,o,i)=>{for(var r=i>1?void 0:i?Wn(e,o):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(r=(i?s(e,o,r):s(r))||r);return i&&r&&Qi(e,o,r),r},tr=(t,e,o)=>e.has(t)||Do("Cannot "+o),er=(t,e,o)=>(tr(t,e,"read from private field"),o?o.call(t):e.get(t)),or=(t,e,o)=>e.has(t)?Do("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),ir=(t,e,o,i)=>(tr(t,e,"write to private field"),i?i.call(t,o):e.set(t,o),o),Xn=function(t,e){this[0]=t,this[1]=e},rr=t=>{var e=t[Mo("asyncIterator")],o=!1,i,r={};return e==null?(e=t[Mo("iterator")](),i=n=>r[n]=s=>e[n](s)):(e=e.call(t),i=n=>r[n]=s=>{if(o){if(o=!1,n==="throw")throw s;return s}return o=!0,{done:!1,value:new Xn(new Promise(a=>{var l=e[n](s);l instanceof Object||Do("Object expected"),a(l)}),1)}}),r[Mo("iterator")]=()=>r,i("next"),"throw"in e?i("throw"):r.throw=n=>{throw n},"return"in e&&i("return"),r};function*sr(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*rr(sr(t.shadowRoot.activeElement))))}function ar(){return[...sr()].pop()}var nr=new WeakMap;function lr(t){let e=nr.get(t);return e||(e=window.getComputedStyle(t,null),nr.set(t,e)),e}function Kn(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=lr(t);return e.visibility!=="hidden"&&e.display!=="none"}function Jn(t){let e=lr(t),{overflowY:o,overflowX:i}=e;return o==="scroll"||i==="scroll"?!0:o!=="auto"||i!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&i==="auto"}function Gn(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let n=t.getRootNode(),s=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=n.querySelector(`${s}:checked`);return a?a===t:n.querySelector(s)===t}return Kn(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:Jn(t):!1}function cr(t){var e,o;let i=Qn(t),r=(e=i[0])!=null?e:null,n=(o=i[i.length-1])!=null?o:null;return{start:r,end:n}}function Zn(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function Qn(t){let e=new WeakMap,o=[];function i(r){if(r instanceof Element){if(r.hasAttribute("inert")||r.closest("[inert]")||e.has(r))return;e.set(r,!0),!o.includes(r)&&Gn(r)&&o.push(r),r instanceof HTMLSlotElement&&Zn(r,t)&&r.assignedElements({flatten:!0}).forEach(n=>{i(n)}),r.shadowRoot!==null&&r.shadowRoot.mode==="open"&&i(r.shadowRoot)}for(let n of r.children)i(n)}return i(t),o.sort((r,n)=>{let s=Number(r.getAttribute("tabindex"))||0;return(Number(n.getAttribute("tabindex"))||0)-s})}var hr=N`
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
`;var No=new Set,te=new Map,gt,Io="ltr",Bo="en",ur=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(ur){let t=new MutationObserver(dr);Io=document.documentElement.dir||"ltr",Bo=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Ce(...t){t.map(e=>{let o=e.$code.toLowerCase();te.has(o)?te.set(o,Object.assign(Object.assign({},te.get(o)),e)):te.set(o,e),gt||(gt=e)}),dr()}function dr(){ur&&(Io=document.documentElement.dir||"ltr",Bo=document.documentElement.lang||navigator.language),[...No.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var to=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){No.add(this.host)}hostDisconnected(){No.delete(this.host)}dir(){return`${this.host.dir||Io}`.toLowerCase()}lang(){let e=`${this.host.lang||Bo}`.toLowerCase().replace(/_/g,"-");try{return new Intl.Locale(e),e}catch{return gt?gt.$code.toLowerCase():"en"}}getTranslationData(e){var o,i;let r;try{r=new Intl.Locale(e.replace(/_/g,"-"))}catch{return{locale:void 0,language:"",region:"",primary:void 0,secondary:void 0}}let n=r.language.toLowerCase(),s=(i=(o=r.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&i!==void 0?i:"",a=te.get(`${n}-${s}`),l=te.get(n);return{locale:r,language:n,region:s,primary:a,secondary:l}}exists(e,o){var i;let{primary:r,secondary:n}=this.getTranslationData((i=o.lang)!==null&&i!==void 0?i:this.lang());return o=Object.assign({includeFallback:!1},o),!!(r&&r[e]||n&&n[e]||o.includeFallback&&gt&&gt[e])}term(e,...o){let{primary:i,secondary:r}=this.getTranslationData(this.lang()),n;if(i&&i[e])n=i[e];else if(r&&r[e])n=r[e];else if(gt&&gt[e])n=gt[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof n=="function"?n(...o):n}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,o)}};var pr={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Ce(pr);var fr=pr;var St=class extends to{};Ce(fr);var J=N`
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
`;var ts={attribute:!0,type:String,converter:$t,reflect:!1,hasChanged:Ye},es=(t=ts,e,o)=>{let{kind:i,metadata:r}=o,n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),i==="accessor"){let{name:s}=o;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,t,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,t,a),a}}}if(i==="setter"){let{name:s}=o;return function(a){let l=this[s];e.call(this,a),this.requestUpdate(s,l,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function v(t){return(e,o)=>typeof o=="object"?es(t,e,o):((i,r,n)=>{let s=r.hasOwnProperty(n);return r.constructor.createProperty(n,i),s?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,o)}function vt(t){return v({...t,state:!0,attribute:!1})}function mr(t){return(e,o)=>{let i=typeof e=="function"?e:e[o];Object.assign(i,t)}}var Ht=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function j(t,e){return(o,i,r)=>{let n=s=>s.renderRoot?.querySelector(t)??null;if(e){let{get:s,set:a}=typeof i=="object"?o:r??(()=>{let l=Symbol();return{get(){return this[l]},set(c){this[l]=c}}})();return Ht(o,i,{get(){let l=s.call(this);return l===void 0&&(l=n(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return Ht(o,i,{get(){return n(this)}})}}var eo,V=class extends At{constructor(){super(),or(this,eo,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,X({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let i=customElements.get(t);if(!i){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let r=" (unknown version)",n=r;"version"in e&&e.version&&(r=" v"+e.version),"version"in i&&i.version&&(n=" v"+i.version),!(r&&n&&r===n)&&console.warn(`Attempted to register <${t}>${r}, but <${t}>${n} has already been registered.`)}attributeChangedCallback(t,e,o){er(this,eo)||(this.constructor.elementProperties.forEach((i,r)=>{i.reflect&&this[r]!=null&&this.initialReflectedProperties.set(r,this[r])}),ir(this,eo,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};eo=new WeakMap;V.version="2.20.1";V.dependencies={};h([v()],V.prototype,"dir",2);h([v()],V.prototype,"lang",2);var lt=Math.min,et=Math.max,$e=Math.round,Ae=Math.floor,ct=t=>({x:t,y:t}),os={left:"right",right:"left",bottom:"top",top:"bottom"};function Vo(t,e,o){return et(t,lt(e,o))}function Wt(t,e){return typeof t=="function"?t(e):t}function Pt(t){return t.split("-")[0]}function qt(t){return t.split("-")[1]}function Fo(t){return t==="x"?"y":"x"}function io(t){return t==="y"?"height":"width"}function ht(t){let e=t[0];return e==="t"||e==="b"?"y":"x"}function ro(t){return Fo(ht(t))}function yr(t,e,o){o===void 0&&(o=!1);let i=qt(t),r=ro(t),n=io(r),s=r==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(s=ke(s)),[s,ke(s)]}function br(t){let e=ke(t);return[oo(t),e,oo(e)]}function oo(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}var gr=["left","right"],vr=["right","left"],is=["top","bottom"],rs=["bottom","top"];function ns(t,e,o){switch(t){case"top":case"bottom":return o?e?vr:gr:e?gr:vr;case"left":case"right":return e?is:rs;default:return[]}}function wr(t,e,o,i){let r=qt(t),n=ns(Pt(t),o==="start",i);return r&&(n=n.map(s=>s+"-"+r),e&&(n=n.concat(n.map(oo)))),n}function ke(t){let e=Pt(t);return os[e]+t.slice(e.length)}function ss(t){var e,o,i,r;return{top:(e=t.top)!=null?e:0,right:(o=t.right)!=null?o:0,bottom:(i=t.bottom)!=null?i:0,left:(r=t.left)!=null?r:0}}function Uo(t){return typeof t!="number"?ss(t):{top:t,right:t,bottom:t,left:t}}function jt(t){let{x:e,y:o,width:i,height:r}=t;return{width:i,height:r,top:o,left:e,right:e+i,bottom:o+r,x:e,y:o}}function _r(t,e,o){let{reference:i,floating:r}=t,n=ht(e),s=ro(e),a=io(s),l=Pt(e),c=n==="y",p=i.x+i.width/2-r.width/2,d=i.y+i.height/2-r.height/2,u=i[a]/2-r[a]/2,f;switch(l){case"top":f={x:p,y:i.y-r.height};break;case"bottom":f={x:p,y:i.y+i.height};break;case"right":f={x:i.x+i.width,y:d};break;case"left":f={x:i.x-r.width,y:d};break;default:f={x:i.x,y:i.y}}let g=qt(e);return g&&(f[s]+=u*(g==="end"?1:-1)*(o&&c?-1:1)),f}async function xr(t,e){var o;e===void 0&&(e={});let{x:i,y:r,platform:n,rects:s,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:p="viewport",elementContext:d="floating",altBoundary:u=!1,padding:f=0}=Wt(e,t),g=Uo(f),y=a[u?d==="floating"?"reference":"floating":d],m=jt(await n.getClippingRect({element:(o=await(n.isElement==null?void 0:n.isElement(y)))==null||o?y:y.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(a.floating)),boundary:c,rootBoundary:p,strategy:l})),w=d==="floating"?{x:i,y:r,width:s.floating.width,height:s.floating.height}:s.reference,_=await(n.getOffsetParent==null?void 0:n.getOffsetParent(a.floating)),x=await(n.isElement==null?void 0:n.isElement(_))&&await(n.getScale==null?void 0:n.getScale(_))||{x:1,y:1},$=jt(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:_,strategy:l}):w);return{top:(m.top-$.top+g.top)/x.y,bottom:($.bottom-m.bottom+g.bottom)/x.y,left:(m.left-$.left+g.left)/x.x,right:($.right-m.right+g.right)/x.x}}var as=50,Cr=async(t,e,o)=>{let{placement:i="bottom",strategy:r="absolute",middleware:n=[],platform:s}=o,a=s.detectOverflow?s:{...s,detectOverflow:xr},l=await(s.isRTL==null?void 0:s.isRTL(e)),c=await s.getElementRects({reference:t,floating:e,strategy:r}),{x:p,y:d}=_r(c,i,l),u=i,f=0,g={};for(let b=0;b<n.length;b++){let y=n[b];if(!y)continue;let{name:m,fn:w}=y,{x:_,y:x,data:$,reset:k}=await w({x:p,y:d,initialPlacement:i,placement:u,strategy:r,middlewareData:g,rects:c,platform:a,elements:{reference:t,floating:e}});p=_??p,d=x??d,g[m]={...g[m],...$},k&&f<as&&(f++,typeof k=="object"&&(k.placement&&(u=k.placement),k.rects&&(c=k.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:r}):k.rects),{x:p,y:d}=_r(c,u,l)),b=-1)}return{x:p,y:d,placement:u,strategy:r,middlewareData:g}},kr=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:i,placement:r,rects:n,platform:s,elements:a,middlewareData:l}=e,{element:c,padding:p=0}=Wt(t,e)||{};if(c==null)return{};let d=Uo(p),u={x:o,y:i},f=ro(r),g=io(f),b=await s.getDimensions(c),y=f==="y",m=y?"top":"left",w=y?"bottom":"right",_=y?"clientHeight":"clientWidth",x=n.reference[g]+n.reference[f]-u[f]-n.floating[g],$=u[f]-n.reference[f],k=await(s.getOffsetParent==null?void 0:s.getOffsetParent(c)),R=k?k[_]:0;(!R||!await(s.isElement==null?void 0:s.isElement(k)))&&(R=a.floating[_]||n.floating[g]);let B=x/2-$/2,U=R/2-b[g]/2-1,L=lt(d[m],U),me=lt(d[w],U),ge=R-b[g]-me,at=R/2-b[g]/2+B,Q=Vo(L,at,ge),Dt=!l.arrow&&qt(r)!=null&&at!==Q&&n.reference[g]/2-(at<L?L:me)-b[g]/2<0,pt=Dt?at<L?at-L:at-ge:0;return{[f]:u[f]+pt,data:{[f]:Q,centerOffset:at-Q-pt,...Dt&&{alignmentOffset:pt}},reset:Dt}}});var $r=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,i;let{placement:r,middlewareData:n,rects:s,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:p=!0,crossAxis:d=!0,fallbackPlacements:u,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:b=!0,...y}=Wt(t,e);if((o=n.arrow)!=null&&o.alignmentOffset)return{};let m=Pt(r),w=ht(a),_=Pt(a)===a,x=await(l.isRTL==null?void 0:l.isRTL(c.floating)),$=u||(_||!b?[ke(a)]:br(a)),k=g!=="none";!u&&k&&$.push(...wr(a,b,g,x));let R=[a,...$],B=await l.detectOverflow(e,y),U=[],L=((i=n.flip)==null?void 0:i.overflows)||[];if(p&&U.push(B[m]),d){let Q=yr(r,s,x);U.push(B[Q[0]],B[Q[1]])}if(L=[...L,{placement:r,overflows:U}],!U.every(Q=>Q<=0)){var me,ge;let Q=(((me=n.flip)==null?void 0:me.index)||0)+1,Dt=R[Q];if(Dt&&(!(d==="alignment"?w!==ht(Dt):!1)||L.every(tt=>ht(tt.placement)===w?tt.overflows[0]>0:!0)))return{data:{index:Q,overflows:L},reset:{placement:Dt}};let pt=(ge=L.filter(Nt=>Nt.overflows[0]<=0).sort((Nt,tt)=>Nt.overflows[1]-tt.overflows[1])[0])==null?void 0:ge.placement;if(!pt)switch(f){case"bestFit":{var at;let Nt=(at=L.filter(tt=>{if(k){let kt=ht(tt.placement);return kt===w||kt==="y"}return!0}).map(tt=>[tt.placement,tt.overflows.filter(kt=>kt>0).reduce((kt,Pn)=>kt+Pn,0)]).sort((tt,kt)=>tt[1]-kt[1])[0])==null?void 0:at[0];Nt&&(pt=Nt);break}case"initialPlacement":pt=a;break}if(r!==pt)return{reset:{placement:pt}}}return{}}}};var ls=new Set(["left","top"]);async function cs(t,e){let{placement:o,platform:i,elements:r}=t,n=await(i.isRTL==null?void 0:i.isRTL(r.floating)),s=Pt(o),a=qt(o),l=ht(o)==="y",c=ls.has(s)?-1:1,p=n&&l?-1:1,d=Wt(e,t),{mainAxis:u,crossAxis:f,alignmentAxis:g}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof g=="number"&&(f=a==="end"?g*-1:g),l?{x:f*p,y:u*c}:{x:u*c,y:f*p}}var Ar=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,i;let{x:r,y:n,placement:s,middlewareData:a}=e,l=await cs(e,t);return s===((o=a.offset)==null?void 0:o.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:r+l.x,y:n+l.y,data:{...l,placement:s}}}}},Er=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:i,placement:r,platform:n}=e,{mainAxis:s=!0,crossAxis:a=!1,limiter:l={fn:w=>{let{x:_,y:x}=w;return{x:_,y:x}}},...c}=Wt(t,e),p={x:o,y:i},d=await n.detectOverflow(e,c),u=ht(r),f=Fo(u),g=p[f],b=p[u],y=(w,_)=>Vo(_+d[w==="y"?"top":"left"],_,_-d[w==="y"?"bottom":"right"]);s&&(g=y(f,g)),a&&(b=y(u,b));let m=l.fn({...e,[f]:g,[u]:b});return{...m,data:{x:m.x-o,y:m.y-i,enabled:{[f]:s,[u]:a}}}}}};var Sr=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){let{placement:o,rects:i,platform:r,elements:n}=e,{apply:s=()=>{},...a}=Wt(t,e),l=await r.detectOverflow(e,a),c=Pt(o),p=qt(o),d=ht(o)==="y",{width:u,height:f}=i.floating,g,b;c==="top"||c==="bottom"?(g=c,b=p===(await(r.isRTL==null?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(b=c,g=p==="end"?"top":"bottom");let y=f-l.top-l.bottom,m=u-l.left-l.right,w=lt(f-l[g],y),_=lt(u-l[b],m),x=e.middlewareData.shift,$=!x,k=w,R=_;x!=null&&x.enabled.x&&(R=m),x!=null&&x.enabled.y&&(k=y),$&&!p&&(d?R=u-2*et(l.left,l.right):k=f-2*et(l.top,l.bottom)),await s({...e,availableWidth:R,availableHeight:k});let B=await r.getDimensions(n.floating);return u!==B.width||f!==B.height?{reset:{rects:!0}}:{}}}};function no(){return typeof window<"u"}function Xt(t){return Tr(t)?(t.nodeName||"").toLowerCase():"#document"}function H(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function ut(t){var e;return(e=(Tr(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Tr(t){return no()?t instanceof Node||t instanceof H(t).Node:!1}function ot(t){return no()?t instanceof Element||t instanceof H(t).Element:!1}function yt(t){return no()?t instanceof HTMLElement||t instanceof H(t).HTMLElement:!1}function Pr(t){return!no()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof H(t).ShadowRoot}function Ee(t){let{overflow:e,overflowX:o,overflowY:i,display:r}=it(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&r!=="inline"&&r!=="contents"}function Rr(t){return/^(table|td|th)$/.test(Xt(t))}function Se(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}var hs=/transform|translate|scale|rotate|perspective|filter/,us=/paint|layout|strict|content/,Yt=t=>!!t&&t!=="none",Ho;function oe(t){let e=ot(t)?it(t):t;return Yt(e.transform)||Yt(e.translate)||Yt(e.scale)||Yt(e.rotate)||Yt(e.perspective)||!so()&&(Yt(e.backdropFilter)||Yt(e.filter))||hs.test(e.willChange||"")||us.test(e.contain||"")}function Lr(t){let e=Tt(t);for(;yt(e)&&!ie(e);){if(oe(e))return e;if(Se(e))return null;e=Tt(e)}return null}function so(){return Ho==null&&(Ho=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Ho}function ie(t){return/^(html|body|#document)$/.test(Xt(t))}function it(t){return H(t).getComputedStyle(t)}function Pe(t){return ot(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Tt(t){if(Xt(t)==="html")return t;let e=t.assignedSlot||t.parentNode||Pr(t)&&t.host||ut(t);return Pr(e)?e.host:e}function Or(t){let e=Tt(t);return ie(e)?(t.ownerDocument||t).body:yt(e)&&Ee(e)?e:Or(e)}function ee(t,e,o){var i;e===void 0&&(e=[]),o===void 0&&(o=!0);let r=Or(t),n=r===((i=t.ownerDocument)==null?void 0:i.body),s=H(r);if(n){let a=ao(s);return e.concat(s,s.visualViewport||[],Ee(r)?r:[],a&&o?ee(a):[])}else return e.concat(r,ee(r,[],o))}function ao(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Dr(t){let e=it(t),o=parseFloat(e.width)||0,i=parseFloat(e.height)||0,r=yt(t),n=r?t.offsetWidth:o,s=r?t.offsetHeight:i,a=$e(o)!==n||$e(i)!==s;return a&&(o=n,i=s),{width:o,height:i,$:a}}function qo(t){return ot(t)?t:t.contextElement}function re(t){let e=qo(t);if(!yt(e))return ct(1);let o=e.getBoundingClientRect(),{width:i,height:r,$:n}=Dr(e),s=(n?$e(o.width):o.width)/i,a=(n?$e(o.height):o.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!a||!Number.isFinite(a))&&(a=1),{x:s,y:a}}var ds=ct(0);function Nr(t){let e=H(t);return!so()||!e.visualViewport?ds:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function ps(t,e,o){return e===void 0&&(e=!1),!!o&&e&&o===H(t)}function Kt(t,e,o,i){e===void 0&&(e=!1),o===void 0&&(o=!1);let r=t.getBoundingClientRect(),n=qo(t),s=ct(1);e&&(i?ot(i)&&(s=re(i)):s=re(t));let a=ps(n,o,i)?Nr(n):ct(0),l=(r.left+a.x)/s.x,c=(r.top+a.y)/s.y,p=r.width/s.x,d=r.height/s.y;if(n&&i){let u=H(n),f=ot(i)?H(i):i,g=u,b=ao(g);for(;b&&f!==g;){let y=re(b),m=b.getBoundingClientRect(),w=it(b),_=m.left+(b.clientLeft+parseFloat(w.paddingLeft))*y.x,x=m.top+(b.clientTop+parseFloat(w.paddingTop))*y.y;l*=y.x,c*=y.y,p*=y.x,d*=y.y,l+=_,c+=x,g=H(b),b=ao(g)}}return jt({width:p,height:d,x:l,y:c})}function lo(t,e){let o=Pe(t).scrollLeft;return e?e.left+o:Kt(ut(t)).left+o}function Ir(t,e){let o=t.getBoundingClientRect(),i=o.left+e.scrollLeft-lo(t,o),r=o.top+e.scrollTop;return{x:i,y:r}}function fs(t){let{elements:e,rect:o,offsetParent:i,strategy:r}=t,n=r==="fixed",s=ut(i),a=e?Se(e.floating):!1;if(i===s||a&&n)return o;let l={scrollLeft:0,scrollTop:0},c=ct(1),p=ct(0),d=yt(i);if((d||!n)&&((Xt(i)!=="body"||Ee(s))&&(l=Pe(i)),d)){let f=Kt(i);c=re(i),p.x=f.x+i.clientLeft,p.y=f.y+i.clientTop}let u=s&&!d&&!n?Ir(s,l):ct(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+p.x+u.x,y:o.y*c.y-l.scrollTop*c.y+p.y+u.y}}function ms(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function gs(t){let e=Pe(t),o=t.ownerDocument.body,i=et(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=et(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight),n=-e.scrollLeft+lo(t),s=-e.scrollTop;return it(o).direction==="rtl"&&(n+=et(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:n,y:s}}var vs=25;function ys(t,e,o){o===void 0&&(o="viewport");let i=o==="layoutViewport",r=H(t),n=ut(t),s=r.visualViewport,a=n.clientWidth,l=n.clientHeight,c=0,p=0;if(s){let u=!so()||e==="fixed";i?u||(c=-s.offsetLeft,p=-s.offsetTop):(a=s.width,l=s.height,u&&(c=s.offsetLeft,p=s.offsetTop))}if(lo(n)<=0){let u=n.ownerDocument,f=u.body,g=getComputedStyle(f),b=u.compatMode==="CSS1Compat"&&parseFloat(g.marginLeft)+parseFloat(g.marginRight)||0,y=Math.abs(n.clientWidth-f.clientWidth-b),m=getComputedStyle(n).scrollbarGutter==="stable both-edges"?y/2:y;m<=vs&&(a-=m)}return{width:a,height:l,x:c,y:p}}function bs(t,e){let o=Kt(t,!0,e==="fixed"),i=o.top+t.clientTop,r=o.left+t.clientLeft,n=re(t),s=t.clientWidth*n.x,a=t.clientHeight*n.y,l=r*n.x,c=i*n.y;return{width:s,height:a,x:l,y:c}}function zr(t,e,o){let i;if(e==="viewport"||e==="layoutViewport")i=ys(t,o,e);else if(e==="document")i=gs(ut(t));else if(ot(e))i=bs(e,o);else{let r=Nr(t);i={x:e.x-r.x,y:e.y-r.y,width:e.width,height:e.height}}return jt(i)}function ws(t,e){let o=e.get(t);if(o)return o;let i=ee(t,[],!1).filter(a=>ot(a)&&Xt(a)!=="body"),r=null,n=it(t).position==="fixed",s=n?Tt(t):t;for(;ot(s)&&!ie(s);){let a=it(s),l=oe(s),c=r?r.position:n?"fixed":"";!l&&(c==="fixed"||c==="absolute"&&a.position==="static")?i=i.filter(d=>d!==s):r=a,s=Tt(s)}return e.set(t,i),i}function _s(t){let{element:e,boundary:o,rootBoundary:i,strategy:r}=t,s=[...o==="clippingAncestors"?Se(e)?[]:ws(e,this._c):[].concat(o),i],a=zr(e,s[0],r),l=a.top,c=a.right,p=a.bottom,d=a.left;for(let u=1;u<s.length;u++){let f=zr(e,s[u],r);l=et(f.top,l),c=lt(f.right,c),p=lt(f.bottom,p),d=et(f.left,d)}return{width:c-d,height:p-l,x:d,y:l}}function xs(t){let{width:e,height:o}=Dr(t);return{width:e,height:o}}function Cs(t,e,o){let i=yt(e),r=ut(e),n=o==="fixed",s=Kt(t,!0,n,e),a={scrollLeft:0,scrollTop:0},l=ct(0);if((i||!n)&&((Xt(e)!=="body"||Ee(r))&&(a=Pe(e)),i)){let u=Kt(e,!0,n,e);l.x=u.x+e.clientLeft,l.y=u.y+e.clientTop}!i&&r&&(l.x=lo(r));let c=r&&!i&&!n?Ir(r,a):ct(0),p=s.left+a.scrollLeft-l.x-c.x,d=s.top+a.scrollTop-l.y-c.y;return{x:p,y:d,width:s.width,height:s.height}}function Wo(t){return it(t).position==="static"}function Mr(t,e){if(!yt(t)||it(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return ut(t)===o&&(o=o.ownerDocument.body),o}function Br(t,e){let o=H(t);if(Se(t))return o;if(!yt(t)){let r=Tt(t);for(;r&&!ie(r);){if(ot(r)&&!Wo(r))return r;r=Tt(r)}return o}let i=Mr(t,e);for(;i&&Rr(i)&&Wo(i);)i=Mr(i,e);return i&&ie(i)&&Wo(i)&&!oe(i)?o:i||Lr(t)||o}var ks=async function(t){let e=this.getOffsetParent||Br,o=this.getDimensions,i=await o(t.floating);return{reference:Cs(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function $s(t){return it(t).direction==="rtl"}var Te={convertOffsetParentRelativeRectToViewportRelativeRect:fs,getDocumentElement:ut,getClippingRect:_s,getOffsetParent:Br,getElementRects:ks,getClientRects:ms,getDimensions:xs,getScale:re,isElement:ot,isRTL:$s};function Vr(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function As(t,e,o){let i=null,r,n=ut(t);function s(){var p;clearTimeout(r),(p=i)==null||p.disconnect(),i=null}function a(p,d){p===void 0&&(p=!1),d===void 0&&(d=1),s();let u=t.getBoundingClientRect(),{left:f,top:g,width:b,height:y}=u;if(p||e(),!b||!y)return;let m=Ae(g),w=Ae(n.clientWidth-(f+b)),_=Ae(n.clientHeight-(g+y)),x=Ae(f),k={rootMargin:-m+"px "+-w+"px "+-_+"px "+-x+"px",threshold:et(0,lt(1,d))||1},R=!0;function B(U){let L=U[0].intersectionRatio;if(!Vr(u,t.getBoundingClientRect()))return a();if(L!==d){if(!R)return a();L?a(!1,L):r=setTimeout(()=>{a(!1,1e-7)},1e3)}R=!1}try{i=new IntersectionObserver(B,{...k,root:n.ownerDocument})}catch{i=new IntersectionObserver(B,k)}i.observe(t)}let l=H(t),c=()=>a(o);return l.addEventListener("resize",c),a(!0),()=>{l.removeEventListener("resize",c),s()}}function Fr(t,e,o,i){i===void 0&&(i={});let{ancestorScroll:r=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,c=qo(t),p=r||n?[...c?ee(c):[],...e?ee(e):[]]:[];p.forEach(m=>{r&&m.addEventListener("scroll",o),n&&m.addEventListener("resize",o)});let d=c&&a?As(c,o,n):null,u=-1,f=null;s&&(f=new ResizeObserver(m=>{let[w]=m;w&&w.target===c&&f&&e&&(f.unobserve(e),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{var _;(_=f)==null||_.observe(e)})),o()}),c&&!l&&f.observe(c),e&&f.observe(e));let g,b=l?Kt(t):null;l&&y();function y(){let m=Kt(t);b&&!Vr(b,m)&&o(),b=m,g=requestAnimationFrame(y)}return o(),()=>{var m;p.forEach(w=>{r&&w.removeEventListener("scroll",o),n&&w.removeEventListener("resize",o)}),d?.(),(m=f)==null||m.disconnect(),f=null,l&&cancelAnimationFrame(g)}}var Ur=Ar;var Hr=Er,Wr=$r,jo=Sr;var qr=kr;var jr=(t,e,o)=>{let i=new Map,r=o??{},n={...Te,...r.platform,_c:i};return Cr(t,e,{...r,platform:n})};var bt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},co=t=>(...e)=>({_$litDirective$:t,values:e}),ne=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,i){this._$Ct=e,this._$AM=o,this._$Ci=i}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var Y=co(class extends ne{constructor(t){if(super(t),t.type!==bt.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}let o=t.element.classList;for(let i of this.st)i in e||(o.remove(i),this.st.delete(i));for(let i in e){let r=!!e[i];r===this.st.has(i)||this.nt?.has(i)||(r?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return q}});function Yr(t){return Es(t)}function Yo(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Es(t){for(let e=t;e;e=Yo(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Yo(t);e;e=Yo(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||oe(o)||e.tagName==="BODY"))return e}return null}function Ss(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var A=class extends V{constructor(){super(...arguments),this.localize=new St(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),i=0,r=0,n=0,s=0,a=0,l=0,c=0,p=0;o?t.top<e.top?(i=t.left,r=t.bottom,n=t.right,s=t.bottom,a=e.left,l=e.top,c=e.right,p=e.top):(i=e.left,r=e.bottom,n=e.right,s=e.bottom,a=t.left,l=t.top,c=t.right,p=t.top):t.left<e.left?(i=t.right,r=t.top,n=e.left,s=e.top,a=t.right,l=t.bottom,c=e.left,p=e.bottom):(i=e.right,r=e.top,n=t.left,s=t.top,a=e.right,l=e.bottom,c=t.left,p=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${p}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Ss(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Fr(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[Ur({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(jo({apply:({rects:o})=>{let i=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${o.reference.width}px`:"",this.popup.style.height=r?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Wr({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Hr({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(jo({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(qr({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>Te.getOffsetParent(o,Yr):Te.getOffsetParent;jr(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Et(X({},Te),{getOffsetParent:e})}).then(({x:o,y:i,middlewareData:r,placement:n})=>{let s=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${o}px`,top:`${i}px`}),this.arrow){let l=r.arrow.x,c=r.arrow.y,p="",d="",u="",f="";if(this.arrowPlacement==="start"){let g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";p=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=s?g:"",f=s?"":g}else if(this.arrowPlacement==="end"){let g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=s?"":g,f=s?g:"",u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(f=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",p=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(f=typeof l=="number"?`${l}px`:"",p=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:p,right:d,bottom:u,left:f,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return O`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${Y({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${Y({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?O`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};A.styles=[J,hr];h([j(".popup")],A.prototype,"popup",2);h([j(".popup__arrow")],A.prototype,"arrowEl",2);h([v()],A.prototype,"anchor",2);h([v({type:Boolean,reflect:!0})],A.prototype,"active",2);h([v({reflect:!0})],A.prototype,"placement",2);h([v({reflect:!0})],A.prototype,"strategy",2);h([v({type:Number})],A.prototype,"distance",2);h([v({type:Number})],A.prototype,"skidding",2);h([v({type:Boolean})],A.prototype,"arrow",2);h([v({attribute:"arrow-placement"})],A.prototype,"arrowPlacement",2);h([v({attribute:"arrow-padding",type:Number})],A.prototype,"arrowPadding",2);h([v({type:Boolean})],A.prototype,"flip",2);h([v({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],A.prototype,"flipFallbackPlacements",2);h([v({attribute:"flip-fallback-strategy"})],A.prototype,"flipFallbackStrategy",2);h([v({type:Object})],A.prototype,"flipBoundary",2);h([v({attribute:"flip-padding",type:Number})],A.prototype,"flipPadding",2);h([v({type:Boolean})],A.prototype,"shift",2);h([v({type:Object})],A.prototype,"shiftBoundary",2);h([v({attribute:"shift-padding",type:Number})],A.prototype,"shiftPadding",2);h([v({attribute:"auto-size"})],A.prototype,"autoSize",2);h([v()],A.prototype,"sync",2);h([v({type:Object})],A.prototype,"autoSizeBoundary",2);h([v({attribute:"auto-size-padding",type:Number})],A.prototype,"autoSizePadding",2);h([v({attribute:"hover-bridge",type:Boolean})],A.prototype,"hoverBridge",2);var Kr=new Map,Ps=new WeakMap;function Ts(t){return t??{keyframes:[],options:{duration:0}}}function Xr(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Xo(t,e){Kr.set(t,Ts(e))}function Ko(t,e,o){let i=Ps.get(t);if(i?.[e])return Xr(i[e],o.dir);let r=Kr.get(e);return r?Xr(r,o.dir):{keyframes:[],options:{duration:0}}}function Jo(t,e){return new Promise(o=>{function i(r){r.target===t&&(t.removeEventListener(e,i),o())}t.addEventListener(e,i)})}function Go(t,e,o){return new Promise(i=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let r=t.animate(e,Et(X({},o),{duration:Rs()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function Rs(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Zo(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}function F(t,e){let o=X({waitUntilFirstUpdate:!1},e);return(i,r)=>{let{update:n}=i,s=Array.isArray(t)?t:[t];i.update=function(a){s.forEach(l=>{let c=l;if(a.has(c)){let p=a.get(c),d=this[c];p!==d&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[r](p,d)}}),n.call(this,a)}}}var S=t=>t??P;var I=class extends V{constructor(){super(...arguments),this.localize=new St(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(i,r)=>{if(!i)return null;let n=i.closest(r);if(n)return n;let s=i.getRootNode();return s instanceof ShadowRoot?o(s.host,r):null};setTimeout(()=>{var i;let r=((i=this.containingElement)==null?void 0:i.getRootNode())instanceof ShadowRoot?ar():document.activeElement;(!this.containingElement||o(r,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),i=o[0],r=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(i),i.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(r),r.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(i=>cr(i).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,Jo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Jo(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await Zo(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=Ko(this,"dropdown.show",{dir:this.localize.dir()});await Go(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await Zo(this);let{keyframes:t,options:e}=Ko(this,"dropdown.hide",{dir:this.localize.dir()});await Go(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return O`
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
        sync=${S(this.sync?this.sync:void 0)}
        class=${Y({dropdown:!0,"dropdown--open":this.open})}
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
    `}};I.styles=[J,Ji];I.dependencies={"sl-popup":A};h([j(".dropdown")],I.prototype,"popup",2);h([j(".dropdown__trigger")],I.prototype,"trigger",2);h([j(".dropdown__panel")],I.prototype,"panel",2);h([v({type:Boolean,reflect:!0})],I.prototype,"open",2);h([v({reflect:!0})],I.prototype,"placement",2);h([v({type:Boolean,reflect:!0})],I.prototype,"disabled",2);h([v({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],I.prototype,"stayOpenOnSelect",2);h([v({attribute:!1})],I.prototype,"containingElement",2);h([v({type:Number})],I.prototype,"distance",2);h([v({type:Number})],I.prototype,"skidding",2);h([v({type:Boolean})],I.prototype,"hoist",2);h([v({reflect:!0})],I.prototype,"sync",2);h([F("open",{waitUntilFirstUpdate:!0})],I.prototype,"handleOpenChange",1);Xo("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});Xo("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});I.define("sl-dropdown");var Jr=N`
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
`;var se=(t="value")=>(e,o)=>{let i=e.constructor,r=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(n,s,a){var l;let c=i.getPropertyOptions(t),p=typeof c.attribute=="string"?c.attribute:t;if(n===p){let d=c.converter||$t,f=(typeof d=="function"?d:(l=d?.fromAttribute)!=null?l:$t.fromAttribute)(a,c.type);this[t]!==f&&(this[o]=f)}r.call(this,n,s,a)}};var ae=N`
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
`;var Re=new WeakMap,Le=new WeakMap,Oe=new WeakMap,Qo=new WeakSet,ho=new WeakMap,le=class{constructor(t,e){this.handleFormData=o=>{let i=this.options.disabled(this.host),r=this.options.name(this.host),n=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!i&&!s&&typeof r=="string"&&r.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(a=>{o.formData.append(r,a.toString())}):o.formData.append(r,n.toString()))},this.handleFormSubmit=o=>{var i;let r=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((i=Re.get(this.form))==null||i.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!r&&!n(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),ho.set(this.host,[])},this.handleInteraction=o=>{let i=ho.get(this.host);i.includes(o.type)||i.push(o.type),i.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.checkValidity=="function"&&!i.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.reportValidity=="function"&&!i.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=X({form:o=>{let i=o.form;if(i){let n=o.getRootNode().querySelector(`#${i}`);if(n)return n}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var i;return(i=o.disabled)!=null?i:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,i)=>o.value=i,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),ho.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),ho.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,Re.has(this.form)?Re.get(this.form).add(this.host):Re.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),Le.has(this.form)||(Le.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Oe.has(this.form)||(Oe.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=Re.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),Le.has(this.form)&&(this.form.reportValidity=Le.get(this.form),Le.delete(this.form)),Oe.has(this.form)&&(this.form.checkValidity=Oe.get(this.form),Oe.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Qo.add(t):Qo.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(i=>{e.hasAttribute(i)&&o.setAttribute(i,e.getAttribute(i))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!Qo.has(e),i=!!e.required;e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},Gr=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),ph=Object.freeze(Et(X({},Gr),{valid:!1,valueMissing:!0})),fh=Object.freeze(Et(X({},Gr),{valid:!1,customError:!0}));var ce=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let i=o.target;(this.slotNames.includes("[default]")&&!i.name||i.name&&this.slotNames.includes(i.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};var ti="";function Zr(t){ti=t}function Qr(t=""){if(!ti){let e=[...document.getElementsByTagName("script")],o=e.find(i=>i.hasAttribute("data-shoelace"));if(o)Zr(o.getAttribute("data-shoelace"));else{let i=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)),r="";i&&(r=i.getAttribute("src")),Zr(r.split("/").slice(0,-1).join("/"))}}return ti.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Ls={name:"default",resolver:t=>Qr(`assets/icons/${t}.svg`)},tn=Ls;var en={caret:`
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
  `},Os={name:"system",resolver:t=>t in en?`data:image/svg+xml,${encodeURIComponent(en[t])}`:""},on=Os;var zs=[tn,on],ei=[];function rn(t){ei.push(t)}function nn(t){ei=ei.filter(e=>e!==t)}function oi(t){return zs.find(e=>e.name===t)}var sn=N`
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
`;var{I:Ph}=Xi;var an=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var ln=t=>t.strings===void 0;var Ms={},cn=(t,e=Ms)=>t._$AH=e;var ze=Symbol(),uo=Symbol(),ii,ri=new Map,G=class extends V{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let i;if(e?.spriteSheet)return this.svg=O`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(i=await fetch(t,{mode:"cors"}),!i.ok)return i.status===410?ze:uo}catch{return uo}try{let r=document.createElement("div");r.innerHTML=await i.text();let n=r.firstElementChild;if(((o=n?.tagName)==null?void 0:o.toLowerCase())!=="svg")return ze;ii||(ii=new DOMParser);let a=ii.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):ze}catch{return ze}}connectedCallback(){super.connectedCallback(),rn(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),nn(this)}getIconSource(){let t=oi(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),i=o?oi(this.library):void 0;if(!e){this.svg=null;return}let r=ri.get(e);if(r||(r=this.resolveIcon(e,i),ri.set(e,r)),!this.initialRender)return;let n=await r;if(n===uo&&ri.delete(e),e===this.getIconSource().url){if(an(n)){if(this.svg=n,i){await this.updateComplete;let s=this.shadowRoot.querySelector("[part='svg']");typeof i.mutator=="function"&&s&&i.mutator(s)}return}switch(n){case uo:case ze:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=i?.mutator)==null||t.call(i,this.svg),this.emit("sl-load")}}}render(){return this.svg}};G.styles=[J,sn];h([vt()],G.prototype,"svg",2);h([v({reflect:!0})],G.prototype,"name",2);h([v()],G.prototype,"src",2);h([v()],G.prototype,"label",2);h([v({reflect:!0})],G.prototype,"library",2);h([F("label")],G.prototype,"handleLabelChange",1);h([F(["name","src","library"])],G.prototype,"setIcon",1);var Jt=co(class extends ne{constructor(t){if(super(t),t.type!==bt.PROPERTY&&t.type!==bt.ATTRIBUTE&&t.type!==bt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ln(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===q||e===P)return e;let o=t.element,i=t.name;if(t.type===bt.PROPERTY){if(e===o[i])return q}else if(t.type===bt.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(i))return q}else if(t.type===bt.ATTRIBUTE&&o.getAttribute(i)===e+"")return q;return cn(t),e}});var C=class extends V{constructor(){super(...arguments),this.formControlController=new le(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new ce(this,"help-text","label"),this.localize=new St(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,i="preserve"){let r=e??this.input.selectionStart,n=o??this.input.selectionEnd;this.input.setRangeText(t,r,n,i),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e,n=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return O`
      <div
        part="form-control"
        class=${Y({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${Y({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
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
              name=${S(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${S(this.placeholder)}
              minlength=${S(this.minlength)}
              maxlength=${S(this.maxlength)}
              min=${S(this.min)}
              max=${S(this.max)}
              step=${S(this.step)}
              .value=${Jt(this.value)}
              autocapitalize=${S(this.autocapitalize)}
              autocomplete=${S(this.autocomplete)}
              autocorrect=${S(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${S(this.pattern)}
              enterkeyhint=${S(this.enterkeyhint)}
              inputmode=${S(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${n?O`
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
            ${this.passwordToggle&&!this.disabled?O`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?O`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:O`
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
    `}};C.styles=[J,ae,Jr];C.dependencies={"sl-icon":G};h([j(".input__control")],C.prototype,"input",2);h([vt()],C.prototype,"hasFocus",2);h([v()],C.prototype,"title",2);h([v({reflect:!0})],C.prototype,"type",2);h([v()],C.prototype,"name",2);h([v()],C.prototype,"value",2);h([se()],C.prototype,"defaultValue",2);h([v({reflect:!0})],C.prototype,"size",2);h([v({type:Boolean,reflect:!0})],C.prototype,"filled",2);h([v({type:Boolean,reflect:!0})],C.prototype,"pill",2);h([v()],C.prototype,"label",2);h([v({attribute:"help-text"})],C.prototype,"helpText",2);h([v({type:Boolean})],C.prototype,"clearable",2);h([v({type:Boolean,reflect:!0})],C.prototype,"disabled",2);h([v()],C.prototype,"placeholder",2);h([v({type:Boolean,reflect:!0})],C.prototype,"readonly",2);h([v({attribute:"password-toggle",type:Boolean})],C.prototype,"passwordToggle",2);h([v({attribute:"password-visible",type:Boolean})],C.prototype,"passwordVisible",2);h([v({attribute:"no-spin-buttons",type:Boolean})],C.prototype,"noSpinButtons",2);h([v({reflect:!0})],C.prototype,"form",2);h([v({type:Boolean,reflect:!0})],C.prototype,"required",2);h([v()],C.prototype,"pattern",2);h([v({type:Number})],C.prototype,"minlength",2);h([v({type:Number})],C.prototype,"maxlength",2);h([v()],C.prototype,"min",2);h([v()],C.prototype,"max",2);h([v()],C.prototype,"step",2);h([v()],C.prototype,"autocapitalize",2);h([v()],C.prototype,"autocorrect",2);h([v()],C.prototype,"autocomplete",2);h([v({type:Boolean})],C.prototype,"autofocus",2);h([v()],C.prototype,"enterkeyhint",2);h([v({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],C.prototype,"spellcheck",2);h([v()],C.prototype,"inputmode",2);h([F("disabled",{waitUntilFirstUpdate:!0})],C.prototype,"handleDisabledChange",1);h([F("step",{waitUntilFirstUpdate:!0})],C.prototype,"handleStepChange",1);h([F("value",{waitUntilFirstUpdate:!0})],C.prototype,"handleValueChange",1);C.define("sl-input");var hn=N`
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
`;var z=class extends V{constructor(){super(...arguments),this.formControlController=new le(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new ce(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return O`
      <div
        class=${Y({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${Y({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":this.size==="small","checkbox--medium":this.size==="medium","checkbox--large":this.size==="large"})}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${S(this.value)}
            .indeterminate=${Jt(this.indeterminate)}
            .checked=${Jt(this.checked)}
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
            ${this.checked?O`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                `:""}
            ${!this.checked&&this.indeterminate?O`
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
    `}};z.styles=[J,ae,hn];z.dependencies={"sl-icon":G};h([j('input[type="checkbox"]')],z.prototype,"input",2);h([vt()],z.prototype,"hasFocus",2);h([v()],z.prototype,"title",2);h([v()],z.prototype,"name",2);h([v()],z.prototype,"value",2);h([v({reflect:!0})],z.prototype,"size",2);h([v({type:Boolean,reflect:!0})],z.prototype,"disabled",2);h([v({type:Boolean,reflect:!0})],z.prototype,"checked",2);h([v({type:Boolean,reflect:!0})],z.prototype,"indeterminate",2);h([se("checked")],z.prototype,"defaultChecked",2);h([v({reflect:!0})],z.prototype,"form",2);h([v({type:Boolean,reflect:!0})],z.prototype,"required",2);h([v({attribute:"help-text"})],z.prototype,"helpText",2);h([F("disabled",{waitUntilFirstUpdate:!0})],z.prototype,"handleDisabledChange",1);h([F(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],z.prototype,"handleStateChange",1);z.define("sl-checkbox");var un=N`
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
`;var E=class extends V{constructor(){super(...arguments),this.formControlController=new le(this),this.hasSlotController=new ce(this,"help-text","label"),this.localize=new St(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=t=>t.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(t){this.input.style.setProperty("--percent",`${t*100}%`)}syncTooltip(t){if(this.output!==null){let e=this.input.offsetWidth,o=this.output.offsetWidth,i=getComputedStyle(this.input).getPropertyValue("--thumb-size"),r=this.localize.dir()==="rtl",n=e*t;if(r){let s=`${e-n}px + ${t} * ${i}`;this.output.style.translate=`calc((${s} - ${o/2}px - ${i} / 2))`}else{let s=`${n}px - ${t} * ${i}`;this.output.style.translate=`calc(${s} - ${o/2}px + ${i} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){let t=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(t),this.tooltip!=="none"&&this.hasTooltip&&this.updateComplete.then(()=>this.syncTooltip(t))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}focus(t){this.input.focus(t)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e;return O`
      <div
        part="form-control"
        class=${Y({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${Y({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":this.localize.dir()==="rtl","range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
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
              name=${S(this.name)}
              ?disabled=${this.disabled}
              min=${S(this.min)}
              max=${S(this.max)}
              step=${S(this.step)}
              .value=${Jt(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?O`
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
    `}};E.styles=[J,ae,un];h([j(".range__control")],E.prototype,"input",2);h([j(".range__tooltip")],E.prototype,"output",2);h([vt()],E.prototype,"hasFocus",2);h([vt()],E.prototype,"hasTooltip",2);h([v()],E.prototype,"title",2);h([v()],E.prototype,"name",2);h([v({type:Number})],E.prototype,"value",2);h([v()],E.prototype,"label",2);h([v({attribute:"help-text"})],E.prototype,"helpText",2);h([v({type:Boolean,reflect:!0})],E.prototype,"disabled",2);h([v({type:Number})],E.prototype,"min",2);h([v({type:Number})],E.prototype,"max",2);h([v({type:Number})],E.prototype,"step",2);h([v()],E.prototype,"tooltip",2);h([v({attribute:!1})],E.prototype,"tooltipFormatter",2);h([v({reflect:!0})],E.prototype,"form",2);h([se()],E.prototype,"defaultValue",2);h([mr({passive:!0})],E.prototype,"handleThumbDragStart",1);h([F("value",{waitUntilFirstUpdate:!0})],E.prototype,"handleValueChange",1);h([F("disabled",{waitUntilFirstUpdate:!0})],E.prototype,"handleDisabledChange",1);h([F("hasTooltip",{waitUntilFirstUpdate:!0})],E.prototype,"syncRange",1);E.define("sl-range");var _t=["#00aaff","#ff4444","#44dd44","#ffaa00","#cc44ff","#ff44aa"],rt=600,li=1,mo=document.getElementById("bg").getContext("2d",{alpha:!1}),st=document.getElementById("fg").getContext("2d",{alpha:!0}),mi=document.getElementById("overlays").getContext("2d"),gi=document.getElementById("msg"),Rt=document.getElementById("waiting"),Ds=document.getElementById("waiting-players"),Ns=document.getElementById("end"),ni=document.getElementById("end-label"),Is=document.getElementById("end-winner"),Bs=document.getElementById("end-detail"),Vs=document.getElementById("replay-controls"),Fs=document.getElementById("replay-slider"),gn=document.getElementById("replay-time"),Us=document.getElementById("replay-play"),dn=document.getElementById("result-label"),pn=document.getElementById("result-winner"),vi=document.getElementById("player-search-input"),Hs=document.getElementById("player-options"),ci=document.getElementById("player-list"),Ws=document.getElementById("game-infos"),fn=document.getElementById("render"),po=document.getElementById("decision-interval"),si=document.getElementById("victory-score"),mn=document.getElementById("debug-tick"),qs=document.getElementById("inspection-help"),vn=document.querySelector('meta[name="play-server"]').content.trim(),Be=JSON.parse(document.getElementById("play-catalog")?.textContent||"[]"),yn=Be.find(t=>t.kind==="human"),js=Be.find(t=>t.kind!=="human"),T=[yn?.spec,js?.spec].filter(Boolean),Zt=T.map(()=>0),go=10,xo=!1,vo=!1,W=!1,Ot=!1,nt=!1,D=Be.length?!!yn:!0,yo=!0,Lt=null,De=null,bn=null,hi=0,Me=null,ui=null,di=0,yi=0,bo=[],K=[],Z,Ct,zt,Mt,Ve=[],wn=[],Ne={},dt={arena_size:80,radius:.6,tick_hz:60},he=null,de=!1,Co="s",Ys=new Set([" ","arrowleft","arrowright","r"]),fe,bi=new URL(vn||location.origin),_n=new URL("/ws",bi);_n.protocol=bi.protocol==="https:"?"wss:":"ws:";var M,wi=!1,pi=!1,xt=T.length?{human:D,specs:D?T.slice(1):T.slice()}:null,wo=!1,Ie=!1,fi=1;st.imageSmoothingEnabled=!0;function ai(t,e,o,i){let r=Math.ceil(e*o);if(t.canvas.width===r&&t.canvas.height===r){t.setTransform(o,0,0,o,0,0);return}let n;i&&(n=document.createElement("canvas"),n.width=t.canvas.width,n.height=t.canvas.height,n.getContext("2d").drawImage(t.canvas,0,0)),t.canvas.width=r,t.canvas.height=r,n&&t.drawImage(n,0,0,r,r),t.setTransform(o,0,0,o,0,0)}function xn(){let t=Math.max(1,Math.floor(Math.min(window.innerWidth-Ws.clientWidth-8,window.innerHeight-8))),e=window.devicePixelRatio||1;fn.style.width=`${t+8}px`,fn.style.height=`${t+8}px`,!(t===rt&&e===li)&&(rt=t,li=e,ai(mo,t,e,!0),ai(st,t,e,!1),ai(mi,t,e,!1),st.imageSmoothingEnabled=!0,Mt?.resize(t),Ct?.resize(t,e),zt?.resize(t),Lt&&(Ct?.draw(Lt.players),zt?.draw(Lt)))}function Ue(){Mt?Mt.reset():(mo.fillStyle="#222222",mo.fillRect(0,0,rt,rt)),Ct?Ct.reset():st.clearRect(0,0,rt,rt),zt?zt.reset():mi.clearRect(0,0,rt,rt),Lt=null,De=null,bn=null,bo=[],Me=null,ui=null,di=0,yi=0,de=!1,st.canvas.style.cursor=""}function Gt(t=null){mn.textContent=t===null?"":`\xB7 tick ${t}`,mn.classList.toggle("hidden",t===null)}function wt(t){return t==="you"?"You":t.startsWith("ckpt:")?fe.labelFor(t)?fe.labelFor(t):t.slice(5).split(/[\\/]/).pop().replace(/\.safetensors$/,""):t.replaceAll("_"," ")}function _i(){Ve=T.map((t,e)=>{let o=document.createElement("div");o.className=`player${D&&t==="you"?" local":""}`,o.style.setProperty("--player-color",_t[e%_t.length]);let i=document.createElement("span");i.className="line-color-preview";let r=document.createElement("sl-dropdown");r.className="player-settings-dropdown",r.placement="bottom-start",r.hoist=!0,r.stayOpenOnSelect=!0;let n=document.createElement("button");n.className="player-settings",n.type="button",n.textContent="\u2699",n.title=`Options for ${wt(t)}`,n.setAttribute("aria-label",`Options for ${wt(t)}`),n.slot="trigger";let s=document.createElement("span");s.className="player-name",s.textContent=wt(t),s.title=wt(t),s.addEventListener("wheel",c=>{if(s.scrollWidth<=s.clientWidth)return;let p=c.deltaX||c.deltaY,d=s.scrollWidth-s.clientWidth,u=Math.max(0,Math.min(d,s.scrollLeft+p));u!==s.scrollLeft&&(s.scrollLeft=u,c.preventDefault())},{passive:!1});let a=document.createElement("button");a.className=`player-remove${T.length>1?"":" hidden"}`,a.type="button",a.textContent="\xD7",a.title=`Remove ${wt(t)}`,a.setAttribute("aria-label",`Remove ${wt(t)}`),a.addEventListener("click",()=>Qs(e));let l=document.createElement("span");return l.className="player-score",l.textContent=Zt[e]??0,l.setAttribute("aria-label",`${wt(t)} score`),r.append(n,Xs(e)),o.append(i,r,s,a,l),{element:o,score:l,dead:null}}),ci.replaceChildren(...Ve.map(t=>t.element)),Ds.replaceChildren(...T.map((t,e)=>{let o=document.createElement("li");return o.textContent=wt(t),o.style.color=_t[e%_t.length],o})),ci.classList.toggle("locked",W)}function Xs(t){let e=document.createElement("div");e.className="player-settings-menu";let o=wn[t]||{};return[["value","Show value glow"]].forEach(([r,n])=>{let s=document.createElement("sl-checkbox");s.checked=!!Ne[t]?.[r],s.disabled=!o[r],s.textContent=o[r]?n:`${n} unavailable`,s.addEventListener("sl-change",()=>{Ne[t]={...Ne[t],[r]:s.checked},Ks(),zt.draw(Lt)}),e.append(s)}),e}function Ks(){M.readyState===WebSocket.OPEN&&M.send(JSON.stringify({type:"visuals",visuals:Ne}))}function ue(t){vi.disabled=t,ci.classList.toggle("locked",t),t&&fe.hide()}function _o(t,e){W||!t&&!e.length||(D=t,T=D?["you",...e]:[...e],ko(),Ot=!1,he=null,xt={human:D,specs:[...e]},wo=!1,Ie=!1,_i(),Fe(),$n(),Cn())}function ko(){Zt=T.map(()=>0),xo=!1,vo=!1,Ve.forEach((t,e)=>{t.score.textContent=Zt[e]??0})}function Js(t){vo||(vo=!0,!(t<0||t>=Zt.length)&&(Zt[t]+=1,xo=Zt[t]>=go,Ve[t].score.textContent=Zt[t]))}function Cn(){!xt||wo||M?.readyState!==WebSocket.OPEN||(M.send(JSON.stringify({type:"configure",...xt})),wo=!0)}function Gs(t){if(!xt)return!1;let e=xt.human?["you",...xt.specs]:xt.specs;return e.length===t.length&&e.every((o,i)=>o===t[i])}function Zs(t){vi.value="",fe.hide();let e=D?T.slice(1):T.slice();if(t==="you"){D||_o(!0,e);return}_o(D,[...e,t])}function Qs(t){if(W||T.length<=1)return;if(D&&T[t]==="you"){_o(!1,T.slice(1));return}let e=D?T.slice(1):T.slice();e.splice(D?t-1:t,1),_o(D,e)}function xi(t){t.forEach((e,o)=>{let i=Ve[o];if(!i)return;let r=!e.alive;i.dead!==r&&(i.dead=r,i.element.classList.toggle("dead",r))})}function kn(t,e,o,i=null){i==="won"?(t.textContent="WIN",e.textContent=""):i==="lost"?(t.textContent="LOST",e.textContent=""):i==="tied"?(t.textContent="TIE",e.textContent=""):(t.textContent=o<0?"TIE":"WINNER: ",e.textContent=o<0?"":wt(T[o])),e.style.color=o<0?"":_t[o%_t.length]}function ta(t,e){t.textContent="",e.textContent="",e.style.color=""}function Ci(t){let e=document.createElement("kbd");return e.className="game-key",e.textContent=t.toUpperCase(),e}function He(t,e=null){e===null?ta(dn,pn):kn(dn,pn,e),gi.textContent=t,Rt.classList.remove("ready","waking","loading"),Rt.classList.toggle("has-result",e!==null),Rt.classList.remove("hidden")}function ea(t=null){He("",t),gi.append("Press ",Ci(Co)," to start"),Rt.classList.add("ready")}function ki(){He("Waking Shai Hulud \u2014 usually a few seconds"),Rt.classList.add("waking")}function $n(){He("Loading players..."),Rt.classList.add("loading")}function oa(){He(""),gi.append("Press ",Ci(Co)," to wake Shai Hulud"),Rt.classList.add("ready")}function fo(){Rt.classList.add("hidden")}function ia(t,e,o,i=!1){kn(ni,Is,t,o),i&&(ni.textContent=`MATCH ${ni.textContent}`),Bs.replaceChildren(i?`${go} points. Drag the timeline to review, or press `:`${e} ticks. Drag the timeline to review, or press `,Ci(Co),i?" to start a new match.":" to play again."),Vs.classList.toggle("hidden",K.length===0),Z.show(K)}function Fe(){Z.hide()}function An(t){let e=K[t];if(e){Ue();for(let o=1;o<=t;o++){let i=K[o-1],r=K[o];Mt.appendFrame(i.players,r.players)}Mt.draw(),Ct.draw(e.players),zt.draw(e),Lt=e,De=e,xi(e.players),gn.textContent=`${(e.tick/dt.tick_hz).toFixed(1)}s \xB7 tick ${e.tick}`}}Z=Ai({end:Ns,slider:Fs,time:gn,playButton:Us,render:An,tickHz:()=>dt.tick_hz});function ra(t){bn=t,yi=performance.now(),De&&Mt.appendFrame(De.players,t.players),De=t,bo[0]=t,bo.length=1,K.push(t),$o()}function na(t){if(hi=0,!W)return;let e=bo.pop();if(e&&(Mt.draw(),ui=Me,Me=e,di=yi,zt.draw(e),Lt=e,xi(e.players)),!Me)return;let o=Ri(Me,ui,nt?0:t-di,dt,fi,D);Ct.clear(),Ct.draw(o.players),nt||$o()}function $o(){hi||(hi=requestAnimationFrame(na))}function sa(t){wi=!0;let e=JSON.parse(t.data);if(e.type==="config")xt||(T=e.seats,ko(),D=e.human??T.includes("you"),xt={human:D,specs:D?T.slice(1):T.slice()}),Ie=Gs(e.seats),yo=e.rewind??!0,qs.textContent=yo?"Space stops at the next boundary. Then \u2190, \u2191, \u2192, N, and R inspect one tick at a time. C lets you click a controller target.":"Space stops at the next boundary. Then \u2190, \u2191, \u2192, and N inspect one tick at a time. C lets you click a controller target.",e.catalog&&fe.setCatalog(e.catalog),dt={...dt,...e.simulator},po.value=e.decision_interval??16,wn=e.visuals||[],Ne={},Z.hide(),Ct=Ei({context:st,colors:_t,size:rt,pixelRatio:li,simulator:()=>dt}),zt=Si({context:mi,colors:_t,size:rt,simulator:()=>dt}),Mt=Pi({context:mo,colors:_t,size:rt,simulator:()=>dt}),Ct.setPlayers(T.length),Ue(),Gt(),_i(),ue(!1),he=null,Ie?He("Waiting for players..."):($n(),Cn());else if(e.type==="ready"){if(!Ie)return;Ot=!0,ue(!1),Z.active||(Fe(),ea(he)),he=null,pi&&(pi=!1,Sn())}else if(e.type==="frame")ra(e);else if(e.type==="paused")nt=!0,Gt(e.ticks),fo();else if(e.type==="resumed")nt=!1,Gt(),fo(),$o();else if(e.type==="rewound"){W=!0,nt=!0,Ot=!1,ue(!0),fo(),Fe();let o=e.frame;K=K.filter(i=>i.tick<=o.tick),(!K.length||K.at(-1).tick!==o.tick)&&K.push(o),An(K.length-1),Gt(o.tick)}else e.type==="end"&&(W=!1,nt=!1,Gt(),ue(!1),xi(e.players||Lt?.players||[]),he=e.winner,Js(e.winner),ia(e.winner,e.ticks,e.outcome,xo))}function aa(){if(Ot=!1,!wi){ki(),setTimeout($i,1e3);return}W=!1,nt=!1,Gt(),ue(!1),oa()}function $i(){M&&(M.readyState===WebSocket.CONNECTING||M.readyState===WebSocket.OPEN)||(wi=!1,wo=!1,Ie=!1,M=new WebSocket(_n),M.onmessage=sa,M.onclose=aa)}var pe=new Set;function En(){let t=pe.has("ArrowLeft"),e=pe.has("ArrowRight");fi=pe.has("ArrowUp")||t&&e?1:t?2:e?0:1,M.send(JSON.stringify({type:"input",action:fi}))}function Sn(){!Ot||W||(xo&&ko(),W=!0,nt=!1,Gt(),ue(!0),Ot=!1,he=null,vo=!1,K=[],Z.hide(),Ue(),fo(),Fe(),$o(),M.send(JSON.stringify({type:"start"})))}function la(){Ue(),pi=!0,ki(),$i()}st.canvas.addEventListener("click",t=>{if(!de||!nt||!D)return;let e=st.canvas.getBoundingClientRect(),o=(t.clientX-e.left)/e.width*dt.arena_size,i=(1-(t.clientY-e.top)/e.height)*dt.arena_size;de=!1,st.canvas.style.cursor="",M.send(JSON.stringify({type:"controller_target",x:o,y:i})),t.preventDefault()});fe=Ti({input:vi,options:Hs,locked:()=>W,onSelect:Zs,initialCatalog:Be,playersUrl:Be.length?null:new URL("/players",bi)});_i();po.addEventListener("sl-change",()=>{let t=Math.max(1,Math.min(1e4,Number.parseInt(po.value,10)||16));po.value=t,M.send(JSON.stringify({type:"settings",decision_interval:t}))});si.addEventListener("sl-change",()=>{go=Math.max(1,Math.min(100,Number.parseInt(si.value,10)||10)),si.value=go,ko()});function ca(t){return t.composedPath().some(e=>e instanceof Element&&e.matches("input, textarea, [contenteditable], sl-input, sl-range, button, sl-button"))}function ha(t){return Z.active&&t.repeat&&Ys.has(t.key.toLowerCase())}addEventListener("keydown",t=>{if(!ca(t)){if(ha(t)){t.preventDefault();return}if(t.key.toLowerCase()===Co&&!W&&(Fe(),Ot?Sn():la(),t.preventDefault()),t.key===" "){if(de){de=!1,st.canvas.style.cursor="",t.preventDefault();return}Z.active?Z.toggle():W&&M.send(JSON.stringify({type:nt?"continue":"break"})),t.preventDefault();return}if(Z.active&&(t.key==="ArrowLeft"||t.key==="ArrowRight")){Z.step(t.key==="ArrowLeft"?-1:1),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&yo&&Z.active&&!W){W=!0,Ot=!1,M.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}if(W&&nt){if(t.key.toLowerCase()==="c"&&D&&!t.repeat){de=!0,st.canvas.style.cursor="crosshair",t.preventDefault();return}let e={ArrowLeft:2,ArrowUp:1,ArrowRight:0}[t.key];if(e!==void 0){M.send(JSON.stringify({type:"step",action:e})),t.preventDefault();return}if(t.key.toLowerCase()==="n"&&!t.repeat){M.send(JSON.stringify({type:"next"})),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&yo){M.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}}(t.key==="ArrowLeft"||t.key==="ArrowUp"||t.key==="ArrowRight")&&(pe.has(t.key)||(pe.add(t.key),En()),t.preventDefault())}});addEventListener("keyup",t=>{pe.delete(t.key)&&En()});addEventListener("resize",xn);xn();vn&&ki();$i();Ue();
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
