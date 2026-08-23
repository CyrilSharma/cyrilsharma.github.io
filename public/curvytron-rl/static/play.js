function Qo({end:t,slider:e,time:o,playButton:i,render:r,tickHz:n}){let s=t.firstElementChild,a=[],l=!1,u=!1,h=0,c=0,f=null;function d(y){u=y&&a.length>1,i.textContent=u?"Pause":"Play",c=0,u&&!h&&(h=requestAnimationFrame(v))}function v(y){if(h=0,!!u){if(!c||y-c<1e3/n()){c||=y,h=requestAnimationFrame(v);return}e.value=(Number(e.value)+1)%a.length,r(Number(e.value)),c=y,h=requestAnimationFrame(v)}}function g(y){a=y,l=!0,e.max=Math.max(a.length-1,0),e.value=e.max,t.classList.remove("hidden"),d(!1),a.length&&r(Number(e.value))}function b(){l=!1,d(!1),t.classList.add("hidden")}return e.addEventListener("sl-input",()=>r(Number(e.value))),i.addEventListener("click",()=>d(!u)),s.addEventListener("pointerdown",y=>{if(y.target.closest("input, button, sl-range"))return;let _=s.getBoundingClientRect(),w=t.getBoundingClientRect(),x=_.left-w.left,k=_.top-w.top;s.style.left=`${x}px`,s.style.top=`${k}px`,s.style.transform="none",f={x:y.clientX,y:y.clientY,left:x,top:k},s.classList.add("dragging"),s.setPointerCapture(y.pointerId)}),s.addEventListener("pointermove",y=>{f&&(s.style.left=`${f.left+y.clientX-f.x}px`,s.style.top=`${f.top+y.clientY-f.y}px`)}),s.addEventListener("pointerup",()=>{f=null,s.classList.remove("dragging")}),{get active(){return l},hide:b,show:g,step(y){d(!1),e.value=(Number(e.value)+y+a.length)%a.length,r(Number(e.value))},toggle(){d(!u)}}}function ti({context:t,colors:e,size:o,simulator:i}){let r=[];function n(c){return[c.x*o,(1-c.y)*o]}function s(c){let f=Math.max(2,i().radius*o/i().arena_size),d=Math.ceil((f+2)*2),v=document.createElement("canvas");v.width=d,v.height=d;let g=v.getContext("2d");return g.beginPath(),g.arc(d/2,d/2,f,0,2*Math.PI),g.fillStyle="#fff",g.fill(),g.lineWidth=2,g.strokeStyle=e[c%e.length],g.stroke(),{canvas:v,radius:d/2,clearX:0,clearY:0,clearWidth:d}}function a(c){r=Array.from({length:c},(f,d)=>s(d))}function l(){t.clearRect(0,0,o,o),r.forEach(c=>{c.clearX=0,c.clearY=0,c.clearWidth=c.canvas.width})}function u(){r.forEach(c=>t.clearRect(c.clearX,c.clearY,c.clearWidth,c.clearWidth))}function h(c){c.forEach((f,d)=>{let v=r[d],[g,b]=n(f),y=g-v.radius,_=b-v.radius;t.drawImage(v.canvas,y,_),v.clearX=Math.floor(y)-1,v.clearY=Math.floor(_)-1,v.clearWidth=v.canvas.width+2})}return{clear:u,draw:h,reset:l,setPlayers:a}}function ei({context:t,colors:e,size:o,simulator:i}){function r(h){return[h.x*o,(1-h.y)*o]}function n(h,c){t.strokeStyle=c,t.fillStyle=c;let f=2*Math.PI/h.distances[0].length;h.points.forEach(([d,v],g)=>{let[b,y]=h.headings[g],_=Math.atan2(y,b),w=d*o/i().arena_size,x=(1-v/i().arena_size)*o;h.distances[g].forEach((k,A)=>{let R=_-Math.PI+(A+.5)*f,B=k*o/i().arena_size;t.globalAlpha=.05+.18*(k/h.max_distance),t.beginPath(),t.moveTo(w,x),t.arc(w,x,B,-R-f/2,-R+f/2),t.closePath(),t.fill(),t.globalAlpha=.35,t.beginPath(),t.moveTo(w,x),t.lineTo(w+Math.cos(R)*B,x-Math.sin(R)*B),t.stroke()}),t.globalAlpha=.95,t.beginPath(),t.arc(w,x,2,0,2*Math.PI),t.fill()})}function s(h,c,f){let d=h>=0,v=Math.tanh(Math.abs(h)),[g,b]=r(c),y=30+42*v,_=t.createRadialGradient(g,b,0,g,b,y);_.addColorStop(0,f),_.addColorStop(.28,f+"aa"),_.addColorStop(1,f+"00"),t.globalAlpha=d?.18+.72*v:.08+.18*v,t.fillStyle=_,t.beginPath(),t.arc(g,b,y,0,2*Math.PI),t.fill();let w=`V ${d?"+":"\u2212"}${Math.abs(h).toFixed(2)}`;t.globalAlpha=1,t.font="600 13px Lato, Helvetica, sans-serif";let x=t.measureText(w).width+12,k=Math.max(4,Math.min(o-x-4,g-x/2)),A=b<38?b+42:b-30;t.fillStyle="rgba(20, 20, 20, .8)",t.beginPath(),t.roundRect(k,A-15,x,20,5),t.fill(),t.fillStyle=d?f:"#aeb6c2",t.fillText(w,k+6,A)}function a(h,c,f){if(!h?.target||!c)return;let[d,v]=r(c),g=h.target[0]*o/i().arena_size,b=(1-h.target[1]/i().arena_size)*o;if(t.strokeStyle=f,t.fillStyle=f,t.globalAlpha=.9,t.setLineDash([7,5]),t.beginPath(),t.moveTo(d,v),t.lineTo(g,b),t.stroke(),t.setLineDash([]),t.beginPath(),t.arc(g,b,7,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(g-11,b),t.lineTo(g+11,b),t.moveTo(g,b-11),t.lineTo(g,b+11),t.stroke(),Number.isInteger(h.action)){let y=["R","S","L"];t.font="600 13px Lato, Helvetica, sans-serif",t.fillText(y[h.action],g+12,b-12)}}function l(){t.clearRect(0,0,o,o)}function u(h){l(),h&&(Object.entries(h.overlays||{}).forEach(([c,f])=>{let d=Number(c),v=e[d%e.length];f.lidar&&n(f.lidar,v),Number.isFinite(f.value)&&h.players[d]&&s(f.value,h.players[d],v)}),h.controller&&a(h.controller,h.players[0],e[0]),t.globalAlpha=1)}return{draw:u,reset:l}}function oi({context:t,colors:e,size:o,simulator:i}){t.lineCap="round";function r(a){return[a.x*o,(1-a.y)*o]}function n(){t.fillStyle="#222222",t.fillRect(0,0,o,o)}function s(a,l,u){if(!l.alive||!l.trail_active||!a?.alive||!a.trail_active)return;let[h,c]=r(a),[f,d]=r(l);t.strokeStyle=e[u%e.length],t.lineWidth=Math.max(2,i().radius*o/i().arena_size*2),t.beginPath(),t.moveTo(h,c),t.lineTo(f,d),t.stroke()}return{drawSegment:s,reset:n}}function ii({input:t,options:e,locked:o,onSelect:i,initialCatalog:r=[],playersUrl:n="/players"}){let s=[],a="",l=-1,u=new Map;function h(g){return u.get(g)}function c(){l=-1,e.replaceChildren(),e.classList.add("hidden"),t.setAttribute("aria-expanded","false")}function f(){if(o()||!s.length){c();return}let g=t.value.trim().toLowerCase(),b=s.filter(y=>`${y.label} ${y.spec}`.toLowerCase().includes(g));e.replaceChildren(...b.map((y,_)=>{let w=document.createElement("button");w.className="player-option",w.type="button",w.dataset.spec=y.spec,w.setAttribute("role","option"),w.setAttribute("aria-selected",_===l?"true":"false"),_===l&&w.classList.add("active");let x=document.createElement("span");x.className="player-option-name",x.textContent=y.label;let k=document.createElement("span");return k.className="player-option-kind",k.textContent=y.kind,w.title=y.label,w.append(x,k),w})),e.classList.toggle("hidden",b.length===0),t.setAttribute("aria-expanded",b.length>0?"true":"false")}function d(g){if(!Array.isArray(g))return;let b=g.map(y=>`${y.spec}
${y.label}
${y.kind}`).join(`
`);b!==a&&(s=g,a=b,u=new Map(g.filter(y=>y.kind==="checkpoint").map(y=>[y.spec,y.label])),l=-1,e.classList.contains("hidden")||f())}async function v(){try{let g=await fetch(n,{cache:"no-store"});g.ok&&d(await g.json())}catch{}}return t.addEventListener("sl-focus",f),t.addEventListener("sl-input",()=>{l=-1,f()}),t.addEventListener("keydown",g=>{let b=[...e.querySelectorAll(".player-option")];if(g.key==="ArrowDown"||g.key==="ArrowUp"){if(!b.length)return;l=(l+(g.key==="ArrowDown"?1:b.length-1))%b.length,f(),g.preventDefault()}else g.key==="Enter"&&l>=0&&b[l]?(i(b[l].dataset.spec),g.preventDefault()):g.key==="Escape"&&(c(),t.blur(),g.preventDefault(),g.stopPropagation())}),t.addEventListener("sl-blur",()=>setTimeout(c,120)),e.addEventListener("mousedown",g=>g.preventDefault()),e.addEventListener("click",g=>{let b=g.target.closest(".player-option");b&&i(b.dataset.spec)}),d(r),n&&(v(),setInterval(()=>{o()||v()},3e3)),{hide:c,labelFor:h,setCatalog:d}}var De=globalThis,Ne=De.ShadowRoot&&(De.ShadyCSS===void 0||De.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ho=Symbol(),ri=new WeakMap,he=class{constructor(e,o,i){if(this._$cssResult$=!0,i!==ho)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(Ne&&e===void 0){let i=o!==void 0&&o.length===1;i&&(e=ri.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&ri.set(o,e))}return e}toString(){return this.cssText}},ni=t=>new he(typeof t=="string"?t:t+"",void 0,ho),O=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((i,r,n)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new he(o,t,ho)},si=(t,e)=>{if(Ne)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let i=document.createElement("style"),r=De.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,t.appendChild(i)}},po=Ne?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let i of e.cssRules)o+=i.cssText;return ni(o)})(t):t;var{is:tn,defineProperty:en,getOwnPropertyDescriptor:on,getOwnPropertyNames:rn,getOwnPropertySymbols:nn,getPrototypeOf:sn}=Object,Me=globalThis,ai=Me.trustedTypes,an=ai?ai.emptyScript:"",ln=Me.reactiveElementPolyfillSupport,pe=(t,e)=>t,wt={toAttribute(t,e){switch(e){case Boolean:t=t?an:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},Be=(t,e)=>!tn(t,e),li={attribute:!0,type:String,converter:wt,reflect:!1,useDefault:!1,hasChanged:Be};Symbol.metadata??=Symbol("metadata"),Me.litPropertyMetadata??=new WeakMap;var ht=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=li){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,o);r!==void 0&&en(this.prototype,e,r)}}static getPropertyDescriptor(e,o,i){let{get:r,set:n}=on(this.prototype,e)??{get(){return this[o]},set(s){this[o]=s}};return{get:r,set(s){let a=r?.call(this);n?.call(this,s),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??li}static _$Ei(){if(this.hasOwnProperty(pe("elementProperties")))return;let e=sn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(pe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pe("properties"))){let o=this.properties,i=[...rn(o),...nn(o)];for(let r of i)this.createProperty(r,o[r])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)o.unshift(po(r))}else e!==void 0&&o.push(po(e));return o}static _$Eu(e,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return si(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,i){this._$AK(e,i)}_$ET(e,o){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:wt).toAttribute(o,i.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,o){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:wt;this._$Em=r;let a=s.fromAttribute(o,n.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,o,i,r=!1,n){if(e!==void 0){let s=this.constructor;if(r===!1&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??Be)(n,o)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:i,reflect:r,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??o??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(o=void 0),this._$AL.set(e,o)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:s}=n,a=this[r];s!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,n,a)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[pe("elementProperties")]=new Map,ht[pe("finalized")]=new Map,ln?.({ReactiveElement:ht}),(Me.reactiveElementVersions??=[]).push("2.1.2");var fo=globalThis,ci=t=>t,Ie=fo.trustedTypes,hi=Ie?Ie.createPolicy("lit-html",{createHTML:t=>t}):void 0,mo="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,go="?"+pt,cn=`<${go}>`,Lt=document,de=()=>Lt.createComment(""),fe=t=>t===null||typeof t!="object"&&typeof t!="function",vo=Array.isArray,gi=t=>vo(t)||typeof t?.[Symbol.iterator]=="function",uo=`[ 	
\f\r]`,ue=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pi=/-->/g,ui=/>/g,Pt=RegExp(`>|${uo}(?:([^\\s"'>=/]+)(${uo}*=${uo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),di=/'/g,fi=/"/g,vi=/^(?:script|style|textarea|title)$/i,yo=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),P=yo(1),Fs=yo(2),Us=yo(3),H=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),mi=new WeakMap,Rt=Lt.createTreeWalker(Lt,129);function yi(t,e){if(!vo(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return hi!==void 0?hi.createHTML(e):e}var bi=(t,e)=>{let o=t.length-1,i=[],r,n=e===2?"<svg>":e===3?"<math>":"",s=ue;for(let a=0;a<o;a++){let l=t[a],u,h,c=-1,f=0;for(;f<l.length&&(s.lastIndex=f,h=s.exec(l),h!==null);)f=s.lastIndex,s===ue?h[1]==="!--"?s=pi:h[1]!==void 0?s=ui:h[2]!==void 0?(vi.test(h[2])&&(r=RegExp("</"+h[2],"g")),s=Pt):h[3]!==void 0&&(s=Pt):s===Pt?h[0]===">"?(s=r??ue,c=-1):h[1]===void 0?c=-2:(c=s.lastIndex-h[2].length,u=h[1],s=h[3]===void 0?Pt:h[3]==='"'?fi:di):s===fi||s===di?s=Pt:s===pi||s===ui?s=ue:(s=Pt,r=void 0);let d=s===Pt&&t[a+1].startsWith("/>")?" ":"";n+=s===ue?l+cn:c>=0?(i.push(u),l.slice(0,c)+mo+l.slice(c)+pt+d):l+pt+(c===-2?a:d)}return[yi(t,n+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},me=class t{constructor({strings:e,_$litType$:o},i){let r;this.parts=[];let n=0,s=0,a=e.length-1,l=this.parts,[u,h]=bi(e,o);if(this.el=t.createElement(u,i),Rt.currentNode=this.el.content,o===2||o===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=Rt.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(mo)){let f=h[s++],d=r.getAttribute(c).split(pt),v=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:v[2],strings:d,ctor:v[1]==="."?Fe:v[1]==="?"?Ue:v[1]==="@"?He:zt}),r.removeAttribute(c)}else c.startsWith(pt)&&(l.push({type:6,index:n}),r.removeAttribute(c));if(vi.test(r.tagName)){let c=r.textContent.split(pt),f=c.length-1;if(f>0){r.textContent=Ie?Ie.emptyScript:"";for(let d=0;d<f;d++)r.append(c[d],de()),Rt.nextNode(),l.push({type:2,index:++n});r.append(c[f],de())}}}else if(r.nodeType===8)if(r.data===go)l.push({type:2,index:n});else{let c=-1;for(;(c=r.data.indexOf(pt,c+1))!==-1;)l.push({type:7,index:n}),c+=pt.length-1}n++}}static createElement(e,o){let i=Lt.createElement("template");return i.innerHTML=e,i}};function Ot(t,e,o=t,i){if(e===H)return e;let r=i!==void 0?o._$Co?.[i]:o._$Cl,n=fe(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,o,i)),i!==void 0?(o._$Co??=[])[i]=r:o._$Cl=r),r!==void 0&&(e=Ot(t,r._$AS(t,e.values),r,i)),e}var Ve=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:i}=this._$AD,r=(e?.creationScope??Lt).importNode(o,!0);Rt.currentNode=r;let n=Rt.nextNode(),s=0,a=0,l=i[0];for(;l!==void 0;){if(s===l.index){let u;l.type===2?u=new qt(n,n.nextSibling,this,e):l.type===1?u=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(u=new We(n,this,e)),this._$AV.push(u),l=i[++a]}s!==l?.index&&(n=Rt.nextNode(),s++)}return Rt.currentNode=Lt,r}p(e){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,o),o+=i.strings.length-2):i._$AI(e[o])),o++}},qt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,i,r){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=Ot(this,e,o),fe(e)?e===T||e==null||e===""?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==H&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):gi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&fe(this._$AH)?this._$AA.nextSibling.data=e:this.T(Lt.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=me.createElement(yi(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(o);else{let n=new Ve(r,this),s=n.u(this.options);n.p(o),this.T(s),this._$AH=n}}_$AC(e){let o=mi.get(e.strings);return o===void 0&&mi.set(e.strings,o=new me(e)),o}k(e){vo(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,r=0;for(let n of e)r===o.length?o.push(i=new t(this.O(de()),this.O(de()),this,this.options)):i=o[r],i._$AI(n),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let i=ci(e).nextSibling;ci(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},zt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,i,r,n){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=o,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=T}_$AI(e,o=this,i,r){let n=this.strings,s=!1;if(n===void 0)e=Ot(this,e,o,0),s=!fe(e)||e!==this._$AH&&e!==H,s&&(this._$AH=e);else{let a=e,l,u;for(e=n[0],l=0;l<n.length-1;l++)u=Ot(this,a[i+l],o,l),u===H&&(u=this._$AH[l]),s||=!fe(u)||u!==this._$AH[l],u===T?e=T:e!==T&&(e+=(u??"")+n[l+1]),this._$AH[l]=u}s&&!r&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Fe=class extends zt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}},Ue=class extends zt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}},He=class extends zt{constructor(e,o,i,r,n){super(e,o,i,r,n),this.type=5}_$AI(e,o=this){if((e=Ot(this,e,o,0)??T)===H)return;let i=this._$AH,r=e===T&&i!==T||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==T&&(i===T||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},We=class{constructor(e,o,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Ot(this,e)}},wi={M:mo,P:pt,A:go,C:1,L:bi,R:Ve,D:gi,V:Ot,I:qt,H:zt,N:Ue,U:He,B:Fe,F:We},hn=fo.litHtmlPolyfillSupport;hn?.(me,qt),(fo.litHtmlVersions??=[]).push("3.3.3");var _i=(t,e,o)=>{let i=o?.renderBefore??e,r=i._$litPart$;if(r===void 0){let n=o?.renderBefore??null;i._$litPart$=r=new qt(e.insertBefore(de(),n),n,void 0,o??{})}return r._$AI(t),r};var bo=globalThis,_t=class extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=_i(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};_t._$litElement$=!0,_t.finalized=!0,bo.litElementHydrateSupport?.({LitElement:_t});var pn=bo.litElementPolyfillSupport;pn?.({LitElement:_t});(bo.litElementVersions??=[]).push("4.2.2");var xi=O`
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
`;var $i=Object.defineProperty,un=Object.defineProperties,dn=Object.getOwnPropertyDescriptor,fn=Object.getOwnPropertyDescriptors,Ci=Object.getOwnPropertySymbols,mn=Object.prototype.hasOwnProperty,gn=Object.prototype.propertyIsEnumerable,wo=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),_o=t=>{throw TypeError(t)},ki=(t,e,o)=>e in t?$i(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,Y=(t,e)=>{for(var o in e||(e={}))mn.call(e,o)&&ki(t,o,e[o]);if(Ci)for(var o of Ci(e))gn.call(e,o)&&ki(t,o,e[o]);return t},xt=(t,e)=>un(t,fn(e)),p=(t,e,o,i)=>{for(var r=i>1?void 0:i?dn(e,o):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(r=(i?s(e,o,r):s(r))||r);return i&&r&&$i(e,o,r),r},Ai=(t,e,o)=>e.has(t)||_o("Cannot "+o),Ei=(t,e,o)=>(Ai(t,e,"read from private field"),o?o.call(t):e.get(t)),Si=(t,e,o)=>e.has(t)?_o("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),Ti=(t,e,o,i)=>(Ai(t,e,"write to private field"),i?i.call(t,o):e.set(t,o),o),vn=function(t,e){this[0]=t,this[1]=e},Pi=t=>{var e=t[wo("asyncIterator")],o=!1,i,r={};return e==null?(e=t[wo("iterator")](),i=n=>r[n]=s=>e[n](s)):(e=e.call(t),i=n=>r[n]=s=>{if(o){if(o=!1,n==="throw")throw s;return s}return o=!0,{done:!1,value:new vn(new Promise(a=>{var l=e[n](s);l instanceof Object||_o("Object expected"),a(l)}),1)}}),r[wo("iterator")]=()=>r,i("next"),"throw"in e?i("throw"):r.throw=n=>{throw n},"return"in e&&i("return"),r};function*Li(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*Pi(Li(t.shadowRoot.activeElement))))}function Oi(){return[...Li()].pop()}var Ri=new WeakMap;function zi(t){let e=Ri.get(t);return e||(e=window.getComputedStyle(t,null),Ri.set(t,e)),e}function yn(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=zi(t);return e.visibility!=="hidden"&&e.display!=="none"}function bn(t){let e=zi(t),{overflowY:o,overflowX:i}=e;return o==="scroll"||i==="scroll"?!0:o!=="auto"||i!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&i==="auto"}function wn(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let n=t.getRootNode(),s=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=n.querySelector(`${s}:checked`);return a?a===t:n.querySelector(s)===t}return yn(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:bn(t):!1}function Di(t){var e,o;let i=xn(t),r=(e=i[0])!=null?e:null,n=(o=i[i.length-1])!=null?o:null;return{start:r,end:n}}function _n(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function xn(t){let e=new WeakMap,o=[];function i(r){if(r instanceof Element){if(r.hasAttribute("inert")||r.closest("[inert]")||e.has(r))return;e.set(r,!0),!o.includes(r)&&wn(r)&&o.push(r),r instanceof HTMLSlotElement&&_n(r,t)&&r.assignedElements({flatten:!0}).forEach(n=>{i(n)}),r.shadowRoot!==null&&r.shadowRoot.mode==="open"&&i(r.shadowRoot)}for(let n of r.children)i(n)}return i(t),o.sort((r,n)=>{let s=Number(r.getAttribute("tabindex"))||0;return(Number(n.getAttribute("tabindex"))||0)-s})}var Ni=O`
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
`;var xo=new Set,jt=new Map,ut,Co="ltr",ko="en",Mi=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Mi){let t=new MutationObserver(Bi);Co=document.documentElement.dir||"ltr",ko=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function ge(...t){t.map(e=>{let o=e.$code.toLowerCase();jt.has(o)?jt.set(o,Object.assign(Object.assign({},jt.get(o)),e)):jt.set(o,e),ut||(ut=e)}),Bi()}function Bi(){Mi&&(Co=document.documentElement.dir||"ltr",ko=document.documentElement.lang||navigator.language),[...xo.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var qe=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){xo.add(this.host)}hostDisconnected(){xo.delete(this.host)}dir(){return`${this.host.dir||Co}`.toLowerCase()}lang(){let e=`${this.host.lang||ko}`.toLowerCase().replace(/_/g,"-");try{return new Intl.Locale(e),e}catch{return ut?ut.$code.toLowerCase():"en"}}getTranslationData(e){var o,i;let r;try{r=new Intl.Locale(e.replace(/_/g,"-"))}catch{return{locale:void 0,language:"",region:"",primary:void 0,secondary:void 0}}let n=r.language.toLowerCase(),s=(i=(o=r.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&i!==void 0?i:"",a=jt.get(`${n}-${s}`),l=jt.get(n);return{locale:r,language:n,region:s,primary:a,secondary:l}}exists(e,o){var i;let{primary:r,secondary:n}=this.getTranslationData((i=o.lang)!==null&&i!==void 0?i:this.lang());return o=Object.assign({includeFallback:!1},o),!!(r&&r[e]||n&&n[e]||o.includeFallback&&ut&&ut[e])}term(e,...o){let{primary:i,secondary:r}=this.getTranslationData(this.lang()),n;if(i&&i[e])n=i[e];else if(r&&r[e])n=r[e];else if(ut&&ut[e])n=ut[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof n=="function"?n(...o):n}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,o)}};var Ii={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};ge(Ii);var Vi=Ii;var Ct=class extends qe{};ge(Vi);var K=O`
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
`;var Cn={attribute:!0,type:String,converter:wt,reflect:!1,hasChanged:Be},kn=(t=Cn,e,o)=>{let{kind:i,metadata:r}=o,n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),i==="accessor"){let{name:s}=o;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,t,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,t,a),a}}}if(i==="setter"){let{name:s}=o;return function(a){let l=this[s];e.call(this,a),this.requestUpdate(s,l,t,!0,a)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(e,o)=>typeof o=="object"?kn(t,e,o):((i,r,n)=>{let s=r.hasOwnProperty(n);return r.constructor.createProperty(n,i),s?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,o)}function dt(t){return m({...t,state:!0,attribute:!1})}function Fi(t){return(e,o)=>{let i=typeof e=="function"?e:e[o];Object.assign(i,t)}}var Dt=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function W(t,e){return(o,i,r)=>{let n=s=>s.renderRoot?.querySelector(t)??null;if(e){let{get:s,set:a}=typeof i=="object"?o:r??(()=>{let l=Symbol();return{get(){return this[l]},set(u){this[l]=u}}})();return Dt(o,i,{get(){let l=s.call(this);return l===void 0&&(l=n(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return Dt(o,i,{get(){return n(this)}})}}var je,N=class extends _t{constructor(){super(),Si(this,je,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,Y({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let i=customElements.get(t);if(!i){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let r=" (unknown version)",n=r;"version"in e&&e.version&&(r=" v"+e.version),"version"in i&&i.version&&(n=" v"+i.version),!(r&&n&&r===n)&&console.warn(`Attempted to register <${t}>${r}, but <${t}>${n} has already been registered.`)}attributeChangedCallback(t,e,o){Ei(this,je)||(this.constructor.elementProperties.forEach((i,r)=>{i.reflect&&this[r]!=null&&this.initialReflectedProperties.set(r,this[r])}),Ti(this,je,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};je=new WeakMap;N.version="2.20.1";N.dependencies={};p([m()],N.prototype,"dir",2);p([m()],N.prototype,"lang",2);var nt=Math.min,tt=Math.max,ye=Math.round,be=Math.floor,st=t=>({x:t,y:t}),$n={left:"right",right:"left",bottom:"top",top:"bottom"};function $o(t,e,o){return tt(t,nt(e,o))}function Nt(t,e){return typeof t=="function"?t(e):t}function kt(t){return t.split("-")[0]}function Mt(t){return t.split("-")[1]}function Ao(t){return t==="x"?"y":"x"}function Xe(t){return t==="y"?"height":"width"}function at(t){let e=t[0];return e==="t"||e==="b"?"y":"x"}function Ke(t){return Ao(at(t))}function Wi(t,e,o){o===void 0&&(o=!1);let i=Mt(t),r=Ke(t),n=Xe(r),s=r==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(s=ve(s)),[s,ve(s)]}function qi(t){let e=ve(t);return[Ye(t),e,Ye(e)]}function Ye(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}var Ui=["left","right"],Hi=["right","left"],An=["top","bottom"],En=["bottom","top"];function Sn(t,e,o){switch(t){case"top":case"bottom":return o?e?Hi:Ui:e?Ui:Hi;case"left":case"right":return e?An:En;default:return[]}}function ji(t,e,o,i){let r=Mt(t),n=Sn(kt(t),o==="start",i);return r&&(n=n.map(s=>s+"-"+r),e&&(n=n.concat(n.map(Ye)))),n}function ve(t){let e=kt(t);return $n[e]+t.slice(e.length)}function Tn(t){var e,o,i,r;return{top:(e=t.top)!=null?e:0,right:(o=t.right)!=null?o:0,bottom:(i=t.bottom)!=null?i:0,left:(r=t.left)!=null?r:0}}function Eo(t){return typeof t!="number"?Tn(t):{top:t,right:t,bottom:t,left:t}}function Bt(t){let{x:e,y:o,width:i,height:r}=t;return{width:i,height:r,top:o,left:e,right:e+i,bottom:o+r,x:e,y:o}}function Yi(t,e,o){let{reference:i,floating:r}=t,n=at(e),s=Ke(e),a=Xe(s),l=kt(e),u=n==="y",h=i.x+i.width/2-r.width/2,c=i.y+i.height/2-r.height/2,f=i[a]/2-r[a]/2,d;switch(l){case"top":d={x:h,y:i.y-r.height};break;case"bottom":d={x:h,y:i.y+i.height};break;case"right":d={x:i.x+i.width,y:c};break;case"left":d={x:i.x-r.width,y:c};break;default:d={x:i.x,y:i.y}}let v=Mt(e);return v&&(d[s]+=f*(v==="end"?1:-1)*(o&&u?-1:1)),d}async function Xi(t,e){var o;e===void 0&&(e={});let{x:i,y:r,platform:n,rects:s,elements:a,strategy:l}=t,{boundary:u="clippingAncestors",rootBoundary:h="viewport",elementContext:c="floating",altBoundary:f=!1,padding:d=0}=Nt(e,t),v=Eo(d),b=a[f?c==="floating"?"reference":"floating":c],y=Bt(await n.getClippingRect({element:(o=await(n.isElement==null?void 0:n.isElement(b)))==null||o?b:b.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(a.floating)),boundary:u,rootBoundary:h,strategy:l})),_=c==="floating"?{x:i,y:r,width:s.floating.width,height:s.floating.height}:s.reference,w=await(n.getOffsetParent==null?void 0:n.getOffsetParent(a.floating)),x=await(n.isElement==null?void 0:n.isElement(w))&&await(n.getScale==null?void 0:n.getScale(w))||{x:1,y:1},k=Bt(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:_,offsetParent:w,strategy:l}):_);return{top:(y.top-k.top+v.top)/x.y,bottom:(k.bottom-y.bottom+v.bottom)/x.y,left:(y.left-k.left+v.left)/x.x,right:(k.right-y.right+v.right)/x.x}}var Pn=50,Ki=async(t,e,o)=>{let{placement:i="bottom",strategy:r="absolute",middleware:n=[],platform:s}=o,a=s.detectOverflow?s:{...s,detectOverflow:Xi},l=await(s.isRTL==null?void 0:s.isRTL(e)),u=await s.getElementRects({reference:t,floating:e,strategy:r}),{x:h,y:c}=Yi(u,i,l),f=i,d=0,v={};for(let g=0;g<n.length;g++){let b=n[g];if(!b)continue;let{name:y,fn:_}=b,{x:w,y:x,data:k,reset:A}=await _({x:h,y:c,initialPlacement:i,placement:f,strategy:r,middlewareData:v,rects:u,platform:a,elements:{reference:t,floating:e}});h=w??h,c=x??c,v[y]={...v[y],...k},A&&d<Pn&&(d++,typeof A=="object"&&(A.placement&&(f=A.placement),A.rects&&(u=A.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:r}):A.rects),{x:h,y:c}=Yi(u,f,l)),g=-1)}return{x:h,y:c,placement:f,strategy:r,middlewareData:v}},Ji=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:i,placement:r,rects:n,platform:s,elements:a,middlewareData:l}=e,{element:u,padding:h=0}=Nt(t,e)||{};if(u==null)return{};let c=Eo(h),f={x:o,y:i},d=Ke(r),v=Xe(d),g=await s.getDimensions(u),b=d==="y",y=b?"top":"left",_=b?"bottom":"right",w=b?"clientHeight":"clientWidth",x=n.reference[v]+n.reference[d]-f[d]-n.floating[v],k=f[d]-n.reference[d],A=await(s.getOffsetParent==null?void 0:s.getOffsetParent(u)),R=A?A[w]:0;(!R||!await(s.isElement==null?void 0:s.isElement(A)))&&(R=a.floating[w]||n.floating[v]);let B=x/2-k/2,it=R/2-g[v]/2-1,D=nt(c[y],it),le=nt(c[_],it),ce=R-g[v]-le,rt=R/2-g[v]/2+B,Z=$o(D,rt,ce),St=!l.arrow&&Mt(r)!=null&&rt!==Z&&n.reference[v]/2-(rt<D?D:le)-g[v]/2<0,ct=St?rt<D?rt-D:rt-ce:0;return{[d]:f[d]+ct,data:{[d]:Z,centerOffset:rt-Z-ct,...St&&{alignmentOffset:ct}},reset:St}}});var Gi=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,i;let{placement:r,middlewareData:n,rects:s,initialPlacement:a,platform:l,elements:u}=e,{mainAxis:h=!0,crossAxis:c=!0,fallbackPlacements:f,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:g=!0,...b}=Nt(t,e);if((o=n.arrow)!=null&&o.alignmentOffset)return{};let y=kt(r),_=at(a),w=kt(a)===a,x=await(l.isRTL==null?void 0:l.isRTL(u.floating)),k=f||(w||!g?[ve(a)]:qi(a)),A=v!=="none";!f&&A&&k.push(...ji(a,g,v,x));let R=[a,...k],B=await l.detectOverflow(e,b),it=[],D=((i=n.flip)==null?void 0:i.overflows)||[];if(h&&it.push(B[y]),c){let Z=Wi(r,s,x);it.push(B[Z[0]],B[Z[1]])}if(D=[...D,{placement:r,overflows:it}],!it.every(Z=>Z<=0)){var le,ce;let Z=(((le=n.flip)==null?void 0:le.index)||0)+1,St=R[Z];if(St&&(!(c==="alignment"?_!==at(St):!1)||D.every(Q=>at(Q.placement)===_?Q.overflows[0]>0:!0)))return{data:{index:Z,overflows:D},reset:{placement:St}};let ct=(ce=D.filter(Tt=>Tt.overflows[0]<=0).sort((Tt,Q)=>Tt.overflows[1]-Q.overflows[1])[0])==null?void 0:ce.placement;if(!ct)switch(d){case"bestFit":{var rt;let Tt=(rt=D.filter(Q=>{if(A){let bt=at(Q.placement);return bt===_||bt==="y"}return!0}).map(Q=>[Q.placement,Q.overflows.filter(bt=>bt>0).reduce((bt,Qr)=>bt+Qr,0)]).sort((Q,bt)=>Q[1]-bt[1])[0])==null?void 0:rt[0];Tt&&(ct=Tt);break}case"initialPlacement":ct=a;break}if(r!==ct)return{reset:{placement:ct}}}return{}}}};var Rn=new Set(["left","top"]);async function Ln(t,e){let{placement:o,platform:i,elements:r}=t,n=await(i.isRTL==null?void 0:i.isRTL(r.floating)),s=kt(o),a=Mt(o),l=at(o)==="y",u=Rn.has(s)?-1:1,h=n&&l?-1:1,c=Nt(e,t),{mainAxis:f,crossAxis:d,alignmentAxis:v}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return a&&typeof v=="number"&&(d=a==="end"?v*-1:v),l?{x:d*h,y:f*u}:{x:f*u,y:d*h}}var Zi=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,i;let{x:r,y:n,placement:s,middlewareData:a}=e,l=await Ln(e,t);return s===((o=a.offset)==null?void 0:o.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:r+l.x,y:n+l.y,data:{...l,placement:s}}}}},Qi=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:i,placement:r,platform:n}=e,{mainAxis:s=!0,crossAxis:a=!1,limiter:l={fn:_=>{let{x:w,y:x}=_;return{x:w,y:x}}},...u}=Nt(t,e),h={x:o,y:i},c=await n.detectOverflow(e,u),f=at(r),d=Ao(f),v=h[d],g=h[f],b=(_,w)=>$o(w+c[_==="y"?"top":"left"],w,w-c[_==="y"?"bottom":"right"]);s&&(v=b(d,v)),a&&(g=b(f,g));let y=l.fn({...e,[d]:v,[f]:g});return{...y,data:{x:y.x-o,y:y.y-i,enabled:{[d]:s,[f]:a}}}}}};var tr=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){let{placement:o,rects:i,platform:r,elements:n}=e,{apply:s=()=>{},...a}=Nt(t,e),l=await r.detectOverflow(e,a),u=kt(o),h=Mt(o),c=at(o)==="y",{width:f,height:d}=i.floating,v,g;u==="top"||u==="bottom"?(v=u,g=h===(await(r.isRTL==null?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(g=u,v=h==="end"?"top":"bottom");let b=d-l.top-l.bottom,y=f-l.left-l.right,_=nt(d-l[v],b),w=nt(f-l[g],y),x=e.middlewareData.shift,k=!x,A=_,R=w;x!=null&&x.enabled.x&&(R=y),x!=null&&x.enabled.y&&(A=b),k&&!h&&(c?R=f-2*tt(l.left,l.right):A=d-2*tt(l.top,l.bottom)),await s({...e,availableWidth:R,availableHeight:A});let B=await r.getDimensions(n.floating);return f!==B.width||d!==B.height?{reset:{rects:!0}}:{}}}};function Je(){return typeof window<"u"}function Vt(t){return or(t)?(t.nodeName||"").toLowerCase():"#document"}function I(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function lt(t){var e;return(e=(or(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function or(t){return Je()?t instanceof Node||t instanceof I(t).Node:!1}function et(t){return Je()?t instanceof Element||t instanceof I(t).Element:!1}function ft(t){return Je()?t instanceof HTMLElement||t instanceof I(t).HTMLElement:!1}function er(t){return!Je()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof I(t).ShadowRoot}function we(t){let{overflow:e,overflowX:o,overflowY:i,display:r}=ot(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&r!=="inline"&&r!=="contents"}function ir(t){return/^(table|td|th)$/.test(Vt(t))}function _e(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}var On=/transform|translate|scale|rotate|perspective|filter/,zn=/paint|layout|strict|content/,It=t=>!!t&&t!=="none",So;function Xt(t){let e=et(t)?ot(t):t;return It(e.transform)||It(e.translate)||It(e.scale)||It(e.rotate)||It(e.perspective)||!Ge()&&(It(e.backdropFilter)||It(e.filter))||On.test(e.willChange||"")||zn.test(e.contain||"")}function rr(t){let e=$t(t);for(;ft(e)&&!Kt(e);){if(Xt(e))return e;if(_e(e))return null;e=$t(e)}return null}function Ge(){return So==null&&(So=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),So}function Kt(t){return/^(html|body|#document)$/.test(Vt(t))}function ot(t){return I(t).getComputedStyle(t)}function xe(t){return et(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function $t(t){if(Vt(t)==="html")return t;let e=t.assignedSlot||t.parentNode||er(t)&&t.host||lt(t);return er(e)?e.host:e}function nr(t){let e=$t(t);return Kt(e)?(t.ownerDocument||t).body:ft(e)&&we(e)?e:nr(e)}function Yt(t,e,o){var i;e===void 0&&(e=[]),o===void 0&&(o=!0);let r=nr(t),n=r===((i=t.ownerDocument)==null?void 0:i.body),s=I(r);if(n){let a=Ze(s);return e.concat(s,s.visualViewport||[],we(r)?r:[],a&&o?Yt(a):[])}else return e.concat(r,Yt(r,[],o))}function Ze(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function lr(t){let e=ot(t),o=parseFloat(e.width)||0,i=parseFloat(e.height)||0,r=ft(t),n=r?t.offsetWidth:o,s=r?t.offsetHeight:i,a=ye(o)!==n||ye(i)!==s;return a&&(o=n,i=s),{width:o,height:i,$:a}}function Po(t){return et(t)?t:t.contextElement}function Jt(t){let e=Po(t);if(!ft(e))return st(1);let o=e.getBoundingClientRect(),{width:i,height:r,$:n}=lr(e),s=(n?ye(o.width):o.width)/i,a=(n?ye(o.height):o.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!a||!Number.isFinite(a))&&(a=1),{x:s,y:a}}var Dn=st(0);function cr(t){let e=I(t);return!Ge()||!e.visualViewport?Dn:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Nn(t,e,o){return e===void 0&&(e=!1),!!o&&e&&o===I(t)}function Ft(t,e,o,i){e===void 0&&(e=!1),o===void 0&&(o=!1);let r=t.getBoundingClientRect(),n=Po(t),s=st(1);e&&(i?et(i)&&(s=Jt(i)):s=Jt(t));let a=Nn(n,o,i)?cr(n):st(0),l=(r.left+a.x)/s.x,u=(r.top+a.y)/s.y,h=r.width/s.x,c=r.height/s.y;if(n&&i){let f=I(n),d=et(i)?I(i):i,v=f,g=Ze(v);for(;g&&d!==v;){let b=Jt(g),y=g.getBoundingClientRect(),_=ot(g),w=y.left+(g.clientLeft+parseFloat(_.paddingLeft))*b.x,x=y.top+(g.clientTop+parseFloat(_.paddingTop))*b.y;l*=b.x,u*=b.y,h*=b.x,c*=b.y,l+=w,u+=x,v=I(g),g=Ze(v)}}return Bt({width:h,height:c,x:l,y:u})}function Qe(t,e){let o=xe(t).scrollLeft;return e?e.left+o:Ft(lt(t)).left+o}function hr(t,e){let o=t.getBoundingClientRect(),i=o.left+e.scrollLeft-Qe(t,o),r=o.top+e.scrollTop;return{x:i,y:r}}function Mn(t){let{elements:e,rect:o,offsetParent:i,strategy:r}=t,n=r==="fixed",s=lt(i),a=e?_e(e.floating):!1;if(i===s||a&&n)return o;let l={scrollLeft:0,scrollTop:0},u=st(1),h=st(0),c=ft(i);if((c||!n)&&((Vt(i)!=="body"||we(s))&&(l=xe(i)),c)){let d=Ft(i);u=Jt(i),h.x=d.x+i.clientLeft,h.y=d.y+i.clientTop}let f=s&&!c&&!n?hr(s,l):st(0);return{width:o.width*u.x,height:o.height*u.y,x:o.x*u.x-l.scrollLeft*u.x+h.x+f.x,y:o.y*u.y-l.scrollTop*u.y+h.y+f.y}}function Bn(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function In(t){let e=xe(t),o=t.ownerDocument.body,i=tt(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=tt(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight),n=-e.scrollLeft+Qe(t),s=-e.scrollTop;return ot(o).direction==="rtl"&&(n+=tt(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:n,y:s}}var Vn=25;function Fn(t,e,o){o===void 0&&(o="viewport");let i=o==="layoutViewport",r=I(t),n=lt(t),s=r.visualViewport,a=n.clientWidth,l=n.clientHeight,u=0,h=0;if(s){let f=!Ge()||e==="fixed";i?f||(u=-s.offsetLeft,h=-s.offsetTop):(a=s.width,l=s.height,f&&(u=s.offsetLeft,h=s.offsetTop))}if(Qe(n)<=0){let f=n.ownerDocument,d=f.body,v=getComputedStyle(d),g=f.compatMode==="CSS1Compat"&&parseFloat(v.marginLeft)+parseFloat(v.marginRight)||0,b=Math.abs(n.clientWidth-d.clientWidth-g),y=getComputedStyle(n).scrollbarGutter==="stable both-edges"?b/2:b;y<=Vn&&(a-=y)}return{width:a,height:l,x:u,y:h}}function Un(t,e){let o=Ft(t,!0,e==="fixed"),i=o.top+t.clientTop,r=o.left+t.clientLeft,n=Jt(t),s=t.clientWidth*n.x,a=t.clientHeight*n.y,l=r*n.x,u=i*n.y;return{width:s,height:a,x:l,y:u}}function sr(t,e,o){let i;if(e==="viewport"||e==="layoutViewport")i=Fn(t,o,e);else if(e==="document")i=In(lt(t));else if(et(e))i=Un(e,o);else{let r=cr(t);i={x:e.x-r.x,y:e.y-r.y,width:e.width,height:e.height}}return Bt(i)}function Hn(t,e){let o=e.get(t);if(o)return o;let i=Yt(t,[],!1).filter(a=>et(a)&&Vt(a)!=="body"),r=null,n=ot(t).position==="fixed",s=n?$t(t):t;for(;et(s)&&!Kt(s);){let a=ot(s),l=Xt(s),u=r?r.position:n?"fixed":"";!l&&(u==="fixed"||u==="absolute"&&a.position==="static")?i=i.filter(c=>c!==s):r=a,s=$t(s)}return e.set(t,i),i}function Wn(t){let{element:e,boundary:o,rootBoundary:i,strategy:r}=t,s=[...o==="clippingAncestors"?_e(e)?[]:Hn(e,this._c):[].concat(o),i],a=sr(e,s[0],r),l=a.top,u=a.right,h=a.bottom,c=a.left;for(let f=1;f<s.length;f++){let d=sr(e,s[f],r);l=tt(d.top,l),u=nt(d.right,u),h=nt(d.bottom,h),c=tt(d.left,c)}return{width:u-c,height:h-l,x:c,y:l}}function qn(t){let{width:e,height:o}=lr(t);return{width:e,height:o}}function jn(t,e,o){let i=ft(e),r=lt(e),n=o==="fixed",s=Ft(t,!0,n,e),a={scrollLeft:0,scrollTop:0},l=st(0);if((i||!n)&&((Vt(e)!=="body"||we(r))&&(a=xe(e)),i)){let f=Ft(e,!0,n,e);l.x=f.x+e.clientLeft,l.y=f.y+e.clientTop}!i&&r&&(l.x=Qe(r));let u=r&&!i&&!n?hr(r,a):st(0),h=s.left+a.scrollLeft-l.x-u.x,c=s.top+a.scrollTop-l.y-u.y;return{x:h,y:c,width:s.width,height:s.height}}function To(t){return ot(t).position==="static"}function ar(t,e){if(!ft(t)||ot(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return lt(t)===o&&(o=o.ownerDocument.body),o}function pr(t,e){let o=I(t);if(_e(t))return o;if(!ft(t)){let r=$t(t);for(;r&&!Kt(r);){if(et(r)&&!To(r))return r;r=$t(r)}return o}let i=ar(t,e);for(;i&&ir(i)&&To(i);)i=ar(i,e);return i&&Kt(i)&&To(i)&&!Xt(i)?o:i||rr(t)||o}var Yn=async function(t){let e=this.getOffsetParent||pr,o=this.getDimensions,i=await o(t.floating);return{reference:jn(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function Xn(t){return ot(t).direction==="rtl"}var Ce={convertOffsetParentRelativeRectToViewportRelativeRect:Mn,getDocumentElement:lt,getClippingRect:Wn,getOffsetParent:pr,getElementRects:Yn,getClientRects:Bn,getDimensions:qn,getScale:Jt,isElement:et,isRTL:Xn};function ur(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Kn(t,e,o){let i=null,r,n=lt(t);function s(){var h;clearTimeout(r),(h=i)==null||h.disconnect(),i=null}function a(h,c){h===void 0&&(h=!1),c===void 0&&(c=1),s();let f=t.getBoundingClientRect(),{left:d,top:v,width:g,height:b}=f;if(h||e(),!g||!b)return;let y=be(v),_=be(n.clientWidth-(d+g)),w=be(n.clientHeight-(v+b)),x=be(d),A={rootMargin:-y+"px "+-_+"px "+-w+"px "+-x+"px",threshold:tt(0,nt(1,c))||1},R=!0;function B(it){let D=it[0].intersectionRatio;if(!ur(f,t.getBoundingClientRect()))return a();if(D!==c){if(!R)return a();D?a(!1,D):r=setTimeout(()=>{a(!1,1e-7)},1e3)}R=!1}try{i=new IntersectionObserver(B,{...A,root:n.ownerDocument})}catch{i=new IntersectionObserver(B,A)}i.observe(t)}let l=I(t),u=()=>a(o);return l.addEventListener("resize",u),a(!0),()=>{l.removeEventListener("resize",u),s()}}function dr(t,e,o,i){i===void 0&&(i={});let{ancestorScroll:r=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,u=Po(t),h=r||n?[...u?Yt(u):[],...e?Yt(e):[]]:[];h.forEach(y=>{r&&y.addEventListener("scroll",o),n&&y.addEventListener("resize",o)});let c=u&&a?Kn(u,o,n):null,f=-1,d=null;s&&(d=new ResizeObserver(y=>{let[_]=y;_&&_.target===u&&d&&e&&(d.unobserve(e),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var w;(w=d)==null||w.observe(e)})),o()}),u&&!l&&d.observe(u),e&&d.observe(e));let v,g=l?Ft(t):null;l&&b();function b(){let y=Ft(t);g&&!ur(g,y)&&o(),g=y,v=requestAnimationFrame(b)}return o(),()=>{var y;h.forEach(_=>{r&&_.removeEventListener("scroll",o),n&&_.removeEventListener("resize",o)}),c?.(),(y=d)==null||y.disconnect(),d=null,l&&cancelAnimationFrame(v)}}var fr=Zi;var mr=Qi,gr=Gi,Ro=tr;var vr=Ji;var yr=(t,e,o)=>{let i=new Map,r=o??{},n={...Ce,...r.platform,_c:i};return Ki(t,e,{...r,platform:n})};var mt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},to=t=>(...e)=>({_$litDirective$:t,values:e}),Gt=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,i){this._$Ct=e,this._$AM=o,this._$Ci=i}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var q=to(class extends Gt{constructor(t){if(super(t),t.type!==mt.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}let o=t.element.classList;for(let i of this.st)i in e||(o.remove(i),this.st.delete(i));for(let i in e){let r=!!e[i];r===this.st.has(i)||this.nt?.has(i)||(r?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return H}});function br(t){return Jn(t)}function Lo(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Jn(t){for(let e=t;e;e=Lo(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Lo(t);e;e=Lo(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||Xt(o)||e.tagName==="BODY"))return e}return null}function Gn(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var $=class extends N{constructor(){super(...arguments),this.localize=new Ct(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),i=0,r=0,n=0,s=0,a=0,l=0,u=0,h=0;o?t.top<e.top?(i=t.left,r=t.bottom,n=t.right,s=t.bottom,a=e.left,l=e.top,u=e.right,h=e.top):(i=e.left,r=e.bottom,n=e.right,s=e.bottom,a=t.left,l=t.top,u=t.right,h=t.top):t.left<e.left?(i=t.right,r=t.top,n=e.left,s=e.top,a=t.right,l=t.bottom,u=e.left,h=e.bottom):(i=e.right,r=e.top,n=t.left,s=t.top,a=e.right,l=e.bottom,u=t.left,h=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${u}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Gn(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=dr(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[fr({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Ro({apply:({rects:o})=>{let i=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${o.reference.width}px`:"",this.popup.style.height=r?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(gr({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(mr({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Ro({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(vr({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>Ce.getOffsetParent(o,br):Ce.getOffsetParent;yr(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:xt(Y({},Ce),{getOffsetParent:e})}).then(({x:o,y:i,middlewareData:r,placement:n})=>{let s=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${o}px`,top:`${i}px`}),this.arrow){let l=r.arrow.x,u=r.arrow.y,h="",c="",f="",d="";if(this.arrowPlacement==="start"){let v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",c=s?v:"",d=s?"":v}else if(this.arrowPlacement==="end"){let v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";c=s?"":v,d=s?v:"",f=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(d=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof u=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(d=typeof l=="number"?`${l}px`:"",h=typeof u=="number"?`${u}px`:"");Object.assign(this.arrowEl.style,{top:h,right:c,bottom:f,left:d,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return P`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${q({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${q({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?P`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};$.styles=[K,Ni];p([W(".popup")],$.prototype,"popup",2);p([W(".popup__arrow")],$.prototype,"arrowEl",2);p([m()],$.prototype,"anchor",2);p([m({type:Boolean,reflect:!0})],$.prototype,"active",2);p([m({reflect:!0})],$.prototype,"placement",2);p([m({reflect:!0})],$.prototype,"strategy",2);p([m({type:Number})],$.prototype,"distance",2);p([m({type:Number})],$.prototype,"skidding",2);p([m({type:Boolean})],$.prototype,"arrow",2);p([m({attribute:"arrow-placement"})],$.prototype,"arrowPlacement",2);p([m({attribute:"arrow-padding",type:Number})],$.prototype,"arrowPadding",2);p([m({type:Boolean})],$.prototype,"flip",2);p([m({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],$.prototype,"flipFallbackPlacements",2);p([m({attribute:"flip-fallback-strategy"})],$.prototype,"flipFallbackStrategy",2);p([m({type:Object})],$.prototype,"flipBoundary",2);p([m({attribute:"flip-padding",type:Number})],$.prototype,"flipPadding",2);p([m({type:Boolean})],$.prototype,"shift",2);p([m({type:Object})],$.prototype,"shiftBoundary",2);p([m({attribute:"shift-padding",type:Number})],$.prototype,"shiftPadding",2);p([m({attribute:"auto-size"})],$.prototype,"autoSize",2);p([m()],$.prototype,"sync",2);p([m({type:Object})],$.prototype,"autoSizeBoundary",2);p([m({attribute:"auto-size-padding",type:Number})],$.prototype,"autoSizePadding",2);p([m({attribute:"hover-bridge",type:Boolean})],$.prototype,"hoverBridge",2);var _r=new Map,Zn=new WeakMap;function Qn(t){return t??{keyframes:[],options:{duration:0}}}function wr(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Oo(t,e){_r.set(t,Qn(e))}function zo(t,e,o){let i=Zn.get(t);if(i?.[e])return wr(i[e],o.dir);let r=_r.get(e);return r?wr(r,o.dir):{keyframes:[],options:{duration:0}}}function Do(t,e){return new Promise(o=>{function i(r){r.target===t&&(t.removeEventListener(e,i),o())}t.addEventListener(e,i)})}function No(t,e,o){return new Promise(i=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let r=t.animate(e,xt(Y({},o),{duration:ts()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function ts(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Mo(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}function M(t,e){let o=Y({waitUntilFirstUpdate:!1},e);return(i,r)=>{let{update:n}=i,s=Array.isArray(t)?t:[t];i.update=function(a){s.forEach(l=>{let u=l;if(a.has(u)){let h=a.get(u),c=this[u];h!==c&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[r](h,c)}}),n.call(this,a)}}}var S=t=>t??T;var z=class extends N{constructor(){super(...arguments),this.localize=new Ct(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(i,r)=>{if(!i)return null;let n=i.closest(r);if(n)return n;let s=i.getRootNode();return s instanceof ShadowRoot?o(s.host,r):null};setTimeout(()=>{var i;let r=((i=this.containingElement)==null?void 0:i.getRootNode())instanceof ShadowRoot?Oi():document.activeElement;(!this.containingElement||o(r,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),i=o[0],r=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(i),i.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(r),r.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(i=>Di(i).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,Do(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Do(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await Mo(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=zo(this,"dropdown.show",{dir:this.localize.dir()});await No(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await Mo(this);let{keyframes:t,options:e}=zo(this,"dropdown.hide",{dir:this.localize.dir()});await No(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return P`
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
        class=${q({dropdown:!0,"dropdown--open":this.open})}
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
    `}};z.styles=[K,xi];z.dependencies={"sl-popup":$};p([W(".dropdown")],z.prototype,"popup",2);p([W(".dropdown__trigger")],z.prototype,"trigger",2);p([W(".dropdown__panel")],z.prototype,"panel",2);p([m({type:Boolean,reflect:!0})],z.prototype,"open",2);p([m({reflect:!0})],z.prototype,"placement",2);p([m({type:Boolean,reflect:!0})],z.prototype,"disabled",2);p([m({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],z.prototype,"stayOpenOnSelect",2);p([m({attribute:!1})],z.prototype,"containingElement",2);p([m({type:Number})],z.prototype,"distance",2);p([m({type:Number})],z.prototype,"skidding",2);p([m({type:Boolean})],z.prototype,"hoist",2);p([m({reflect:!0})],z.prototype,"sync",2);p([M("open",{waitUntilFirstUpdate:!0})],z.prototype,"handleOpenChange",1);Oo("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});Oo("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});z.define("sl-dropdown");var xr=O`
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
`;var Zt=(t="value")=>(e,o)=>{let i=e.constructor,r=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(n,s,a){var l;let u=i.getPropertyOptions(t),h=typeof u.attribute=="string"?u.attribute:t;if(n===h){let c=u.converter||wt,d=(typeof c=="function"?c:(l=c?.fromAttribute)!=null?l:wt.fromAttribute)(a,u.type);this[t]!==d&&(this[o]=d)}r.call(this,n,s,a)}};var Qt=O`
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
`;var ke=new WeakMap,$e=new WeakMap,Ae=new WeakMap,Bo=new WeakSet,eo=new WeakMap,te=class{constructor(t,e){this.handleFormData=o=>{let i=this.options.disabled(this.host),r=this.options.name(this.host),n=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!i&&!s&&typeof r=="string"&&r.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(a=>{o.formData.append(r,a.toString())}):o.formData.append(r,n.toString()))},this.handleFormSubmit=o=>{var i;let r=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((i=ke.get(this.form))==null||i.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!r&&!n(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),eo.set(this.host,[])},this.handleInteraction=o=>{let i=eo.get(this.host);i.includes(o.type)||i.push(o.type),i.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.checkValidity=="function"&&!i.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.reportValidity=="function"&&!i.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Y({form:o=>{let i=o.form;if(i){let n=o.getRootNode().querySelector(`#${i}`);if(n)return n}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var i;return(i=o.disabled)!=null?i:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,i)=>o.value=i,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),eo.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),eo.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,ke.has(this.form)?ke.get(this.form).add(this.host):ke.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),$e.has(this.form)||($e.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Ae.has(this.form)||(Ae.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=ke.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),$e.has(this.form)&&(this.form.reportValidity=$e.get(this.form),$e.delete(this.form)),Ae.has(this.form)&&(this.form.checkValidity=Ae.get(this.form),Ae.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Bo.add(t):Bo.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(i=>{e.hasAttribute(i)&&o.setAttribute(i,e.getAttribute(i))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!Bo.has(e),i=!!e.required;e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},Cr=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),Oc=Object.freeze(xt(Y({},Cr),{valid:!1,valueMissing:!0})),zc=Object.freeze(xt(Y({},Cr),{valid:!1,customError:!0}));var ee=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let i=o.target;(this.slotNames.includes("[default]")&&!i.name||i.name&&this.slotNames.includes(i.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};var Io="";function kr(t){Io=t}function $r(t=""){if(!Io){let e=[...document.getElementsByTagName("script")],o=e.find(i=>i.hasAttribute("data-shoelace"));if(o)kr(o.getAttribute("data-shoelace"));else{let i=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)),r="";i&&(r=i.getAttribute("src")),kr(r.split("/").slice(0,-1).join("/"))}}return Io.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var es={name:"default",resolver:t=>$r(`assets/icons/${t}.svg`)},Ar=es;var Er={caret:`
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
  `},os={name:"system",resolver:t=>t in Er?`data:image/svg+xml,${encodeURIComponent(Er[t])}`:""},Sr=os;var is=[Ar,Sr],Vo=[];function Tr(t){Vo.push(t)}function Pr(t){Vo=Vo.filter(e=>e!==t)}function Fo(t){return is.find(e=>e.name===t)}var Rr=O`
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
`;var{I:Kc}=wi;var Lr=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var Or=t=>t.strings===void 0;var rs={},zr=(t,e=rs)=>t._$AH=e;var Ee=Symbol(),oo=Symbol(),Uo,Ho=new Map,J=class extends N{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let i;if(e?.spriteSheet)return this.svg=P`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(i=await fetch(t,{mode:"cors"}),!i.ok)return i.status===410?Ee:oo}catch{return oo}try{let r=document.createElement("div");r.innerHTML=await i.text();let n=r.firstElementChild;if(((o=n?.tagName)==null?void 0:o.toLowerCase())!=="svg")return Ee;Uo||(Uo=new DOMParser);let a=Uo.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Ee}catch{return Ee}}connectedCallback(){super.connectedCallback(),Tr(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Pr(this)}getIconSource(){let t=Fo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),i=o?Fo(this.library):void 0;if(!e){this.svg=null;return}let r=Ho.get(e);if(r||(r=this.resolveIcon(e,i),Ho.set(e,r)),!this.initialRender)return;let n=await r;if(n===oo&&Ho.delete(e),e===this.getIconSource().url){if(Lr(n)){if(this.svg=n,i){await this.updateComplete;let s=this.shadowRoot.querySelector("[part='svg']");typeof i.mutator=="function"&&s&&i.mutator(s)}return}switch(n){case oo:case Ee:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=i?.mutator)==null||t.call(i,this.svg),this.emit("sl-load")}}}render(){return this.svg}};J.styles=[K,Rr];p([dt()],J.prototype,"svg",2);p([m({reflect:!0})],J.prototype,"name",2);p([m()],J.prototype,"src",2);p([m()],J.prototype,"label",2);p([m({reflect:!0})],J.prototype,"library",2);p([M("label")],J.prototype,"handleLabelChange",1);p([M(["name","src","library"])],J.prototype,"setIcon",1);var Ut=to(class extends Gt{constructor(t){if(super(t),t.type!==mt.PROPERTY&&t.type!==mt.ATTRIBUTE&&t.type!==mt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Or(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===H||e===T)return e;let o=t.element,i=t.name;if(t.type===mt.PROPERTY){if(e===o[i])return H}else if(t.type===mt.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(i))return H}else if(t.type===mt.ATTRIBUTE&&o.getAttribute(i)===e+"")return H;return zr(t),e}});var C=class extends N{constructor(){super(...arguments),this.formControlController=new te(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new ee(this,"help-text","label"),this.localize=new Ct(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,i="preserve"){let r=e??this.input.selectionStart,n=o??this.input.selectionEnd;this.input.setRangeText(t,r,n,i),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e,n=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return P`
      <div
        part="form-control"
        class=${q({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${q({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
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
              .value=${Ut(this.value)}
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

            ${n?P`
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
            ${this.passwordToggle&&!this.disabled?P`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?P`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:P`
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
    `}};C.styles=[K,Qt,xr];C.dependencies={"sl-icon":J};p([W(".input__control")],C.prototype,"input",2);p([dt()],C.prototype,"hasFocus",2);p([m()],C.prototype,"title",2);p([m({reflect:!0})],C.prototype,"type",2);p([m()],C.prototype,"name",2);p([m()],C.prototype,"value",2);p([Zt()],C.prototype,"defaultValue",2);p([m({reflect:!0})],C.prototype,"size",2);p([m({type:Boolean,reflect:!0})],C.prototype,"filled",2);p([m({type:Boolean,reflect:!0})],C.prototype,"pill",2);p([m()],C.prototype,"label",2);p([m({attribute:"help-text"})],C.prototype,"helpText",2);p([m({type:Boolean})],C.prototype,"clearable",2);p([m({type:Boolean,reflect:!0})],C.prototype,"disabled",2);p([m()],C.prototype,"placeholder",2);p([m({type:Boolean,reflect:!0})],C.prototype,"readonly",2);p([m({attribute:"password-toggle",type:Boolean})],C.prototype,"passwordToggle",2);p([m({attribute:"password-visible",type:Boolean})],C.prototype,"passwordVisible",2);p([m({attribute:"no-spin-buttons",type:Boolean})],C.prototype,"noSpinButtons",2);p([m({reflect:!0})],C.prototype,"form",2);p([m({type:Boolean,reflect:!0})],C.prototype,"required",2);p([m()],C.prototype,"pattern",2);p([m({type:Number})],C.prototype,"minlength",2);p([m({type:Number})],C.prototype,"maxlength",2);p([m()],C.prototype,"min",2);p([m()],C.prototype,"max",2);p([m()],C.prototype,"step",2);p([m()],C.prototype,"autocapitalize",2);p([m()],C.prototype,"autocorrect",2);p([m()],C.prototype,"autocomplete",2);p([m({type:Boolean})],C.prototype,"autofocus",2);p([m()],C.prototype,"enterkeyhint",2);p([m({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],C.prototype,"spellcheck",2);p([m()],C.prototype,"inputmode",2);p([M("disabled",{waitUntilFirstUpdate:!0})],C.prototype,"handleDisabledChange",1);p([M("step",{waitUntilFirstUpdate:!0})],C.prototype,"handleStepChange",1);p([M("value",{waitUntilFirstUpdate:!0})],C.prototype,"handleValueChange",1);C.define("sl-input");var Dr=O`
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
`;var L=class extends N{constructor(){super(...arguments),this.formControlController=new te(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new ee(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return P`
      <div
        class=${q({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${q({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":this.size==="small","checkbox--medium":this.size==="medium","checkbox--large":this.size==="large"})}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${S(this.value)}
            .indeterminate=${Ut(this.indeterminate)}
            .checked=${Ut(this.checked)}
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
            ${this.checked?P`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                `:""}
            ${!this.checked&&this.indeterminate?P`
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
    `}};L.styles=[K,Qt,Dr];L.dependencies={"sl-icon":J};p([W('input[type="checkbox"]')],L.prototype,"input",2);p([dt()],L.prototype,"hasFocus",2);p([m()],L.prototype,"title",2);p([m()],L.prototype,"name",2);p([m()],L.prototype,"value",2);p([m({reflect:!0})],L.prototype,"size",2);p([m({type:Boolean,reflect:!0})],L.prototype,"disabled",2);p([m({type:Boolean,reflect:!0})],L.prototype,"checked",2);p([m({type:Boolean,reflect:!0})],L.prototype,"indeterminate",2);p([Zt("checked")],L.prototype,"defaultChecked",2);p([m({reflect:!0})],L.prototype,"form",2);p([m({type:Boolean,reflect:!0})],L.prototype,"required",2);p([m({attribute:"help-text"})],L.prototype,"helpText",2);p([M("disabled",{waitUntilFirstUpdate:!0})],L.prototype,"handleDisabledChange",1);p([M(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],L.prototype,"handleStateChange",1);L.define("sl-checkbox");var Nr=O`
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
`;var E=class extends N{constructor(){super(...arguments),this.formControlController=new te(this),this.hasSlotController=new ee(this,"help-text","label"),this.localize=new Ct(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=t=>t.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(t){this.input.style.setProperty("--percent",`${t*100}%`)}syncTooltip(t){if(this.output!==null){let e=this.input.offsetWidth,o=this.output.offsetWidth,i=getComputedStyle(this.input).getPropertyValue("--thumb-size"),r=this.localize.dir()==="rtl",n=e*t;if(r){let s=`${e-n}px + ${t} * ${i}`;this.output.style.translate=`calc((${s} - ${o/2}px - ${i} / 2))`}else{let s=`${n}px - ${t} * ${i}`;this.output.style.translate=`calc(${s} - ${o/2}px + ${i} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){let t=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(t),this.tooltip!=="none"&&this.hasTooltip&&this.updateComplete.then(()=>this.syncTooltip(t))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}focus(t){this.input.focus(t)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e;return P`
      <div
        part="form-control"
        class=${q({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${q({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":this.localize.dir()==="rtl","range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
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
              .value=${Ut(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?P`
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
    `}};E.styles=[K,Qt,Nr];p([W(".range__control")],E.prototype,"input",2);p([W(".range__tooltip")],E.prototype,"output",2);p([dt()],E.prototype,"hasFocus",2);p([dt()],E.prototype,"hasTooltip",2);p([m()],E.prototype,"title",2);p([m()],E.prototype,"name",2);p([m({type:Number})],E.prototype,"value",2);p([m()],E.prototype,"label",2);p([m({attribute:"help-text"})],E.prototype,"helpText",2);p([m({type:Boolean,reflect:!0})],E.prototype,"disabled",2);p([m({type:Number})],E.prototype,"min",2);p([m({type:Number})],E.prototype,"max",2);p([m({type:Number})],E.prototype,"step",2);p([m()],E.prototype,"tooltip",2);p([m({attribute:!1})],E.prototype,"tooltipFormatter",2);p([m({reflect:!0})],E.prototype,"form",2);p([Zt()],E.prototype,"defaultValue",2);p([Fi({passive:!0})],E.prototype,"handleThumbDragStart",1);p([M("value",{waitUntilFirstUpdate:!0})],E.prototype,"handleValueChange",1);p([M("disabled",{waitUntilFirstUpdate:!0})],E.prototype,"handleDisabledChange",1);p([M("hasTooltip",{waitUntilFirstUpdate:!0})],E.prototype,"syncRange",1);E.define("sl-range");var vt=["#00aaff","#ff4444","#44dd44","#ffaa00","#cc44ff","#ff44aa"],Wo=600,ns=document.getElementById("bg").getContext("2d",{alpha:!1}),Et=document.getElementById("fg").getContext("2d",{alpha:!0}),ss=document.getElementById("overlays").getContext("2d"),as=document.getElementById("msg"),Se=document.getElementById("waiting"),ls=document.getElementById("waiting-players"),cs=document.getElementById("end"),hs=document.getElementById("end-label"),ps=document.getElementById("end-winner"),us=document.getElementById("end-detail"),ds=document.getElementById("replay-controls"),fs=document.getElementById("replay-slider"),Fr=document.getElementById("replay-time"),ms=document.getElementById("replay-play"),Mr=document.getElementById("result-label"),Br=document.getElementById("result-winner"),Ko=document.getElementById("player-search-input"),gs=document.getElementById("player-options"),qo=document.getElementById("player-list"),io=document.getElementById("decision-interval"),Ir=document.getElementById("debug-tick"),vs=document.getElementById("inspection-help"),V=[],F=!1,Wt=!1,yt=!1,j=!0,no=!0,Oe=null,Te=null,Ur=null,jo=0,Re=[],X=[],G,se,ze,lo,Yo=[],Hr=[],Pe={},gt={arena_size:80,radius:.6,tick_hz:60},oe=null,re=!1,Xo="s",ys=new Set([" ","arrowleft","arrowright","r"]),ae,Wr=document.querySelector('meta[name="play-server"]').content.trim(),Vr=JSON.parse(document.getElementById("play-catalog")?.textContent||"[]"),Jo=new URL(Wr||location.origin),qr=new URL("/ws",Jo);qr.protocol=Jo.protocol==="https:"?"wss:":"ws:";var U,jr=!1;Et.imageSmoothingEnabled=!0;function co(){lo?.reset(),se?.reset(),ze?.reset(),Oe=null,Te=null,Ur=null,Re=[],re=!1,Et.canvas.style.cursor=""}function Ht(t=null){Ir.textContent=t===null?"":`\xB7 tick ${t}`,Ir.classList.toggle("hidden",t===null)}function At(t){return t==="you"?"You":t.startsWith("ckpt:")?ae.labelFor(t)?ae.labelFor(t):t.slice(5).split(/[\\/]/).pop().replace(/\.safetensors$/,""):t.replaceAll("_"," ")}function Yr(){Yo=V.map((t,e)=>{let o=document.createElement("div");o.className=`player${j&&t==="you"?" local":""}`,o.style.setProperty("--player-color",vt[e%vt.length]);let i=document.createElement("span");i.className="line-color-preview";let r=document.createElement("sl-dropdown");r.className="player-settings-dropdown",r.placement="bottom-start",r.hoist=!0,r.stayOpenOnSelect=!0;let n=document.createElement("button");n.className="player-settings",n.type="button",n.textContent="\u2699",n.title=`Options for ${At(t)}`,n.setAttribute("aria-label",`Options for ${At(t)}`),n.slot="trigger";let s=document.createElement("span");s.className="player-name",s.textContent=At(t),s.title=At(t),s.addEventListener("wheel",l=>{if(s.scrollWidth<=s.clientWidth)return;let u=l.deltaX||l.deltaY,h=s.scrollWidth-s.clientWidth,c=Math.max(0,Math.min(h,s.scrollLeft+u));c!==s.scrollLeft&&(s.scrollLeft=c,l.preventDefault())},{passive:!1});let a=document.createElement("button");return a.className=`player-remove${V.length>1?"":" hidden"}`,a.type="button",a.textContent="\xD7",a.title=`Remove ${At(t)}`,a.setAttribute("aria-label",`Remove ${At(t)}`),a.addEventListener("click",()=>xs(e)),r.append(n,bs(e)),o.append(i,r,s,a),{element:o,dead:null}}),qo.replaceChildren(...Yo.map(t=>t.element)),ls.replaceChildren(...V.map((t,e)=>{let o=document.createElement("li");return o.textContent=At(t),o.style.color=vt[e%vt.length],o})),qo.classList.toggle("locked",F)}function bs(t){let e=document.createElement("div");e.className="player-settings-menu";let o=Hr[t]||{};[["lidar","Show lidar"],["value","Show value glow"]].forEach(([n,s])=>{let a=document.createElement("sl-checkbox");a.checked=!!Pe[t]?.[n],a.disabled=!o[n],a.textContent=o[n]?s:`${s} unavailable`,a.addEventListener("sl-change",()=>{Pe[t]={...Pe[t],[n]:a.checked},ws(),ze.draw(Oe)}),e.append(a)});let r=document.createElement("p");return r.className="player-settings-note",r.textContent="Lidar shows measured directional clearance.",e.append(r),e}function ws(){U.readyState===WebSocket.OPEN&&U.send(JSON.stringify({type:"visuals",visuals:Pe}))}function ie(t){Ko.disabled=t,qo.classList.toggle("locked",t),t&&ae.hide()}function so(t,e){F||!t&&!e.length||(j=t,V=j?["you",...e]:[...e],Wt=!1,oe=null,Yr(),ao(),Le("Loading players..."),U.send(JSON.stringify({type:"configure",human:j,specs:e})))}function _s(t){Ko.value="",ae.hide();let e=j?V.slice(1):V.slice();if(t==="you"){j||so(!0,e);return}so(j,[...e,t])}function xs(t){if(F||V.length<=1)return;if(j&&V[t]==="you"){so(!1,V.slice(1));return}let e=j?V.slice(1):V.slice();e.splice(j?t-1:t,1),so(j,e)}function Go(t){t.forEach((e,o)=>{let i=Yo[o];if(!i)return;let r=!e.alive;i.dead!==r&&(i.dead=r,i.element.classList.toggle("dead",r))})}function Xr(t,e,o,i=null){i==="won"?(t.textContent="WIN",e.textContent=""):i==="lost"?(t.textContent="LOST",e.textContent=""):i==="tied"?(t.textContent="TIE",e.textContent=""):(t.textContent=o<0?"TIE":"WINNER: ",e.textContent=o<0?"":At(V[o])),e.style.color=o<0?"":vt[o%vt.length]}function Cs(t,e){t.textContent="",e.textContent="",e.style.color=""}function Le(t,e=null){e===null?Cs(Mr,Br):Xr(Mr,Br,e),as.textContent=t,Se.classList.remove("waking"),Se.classList.toggle("has-result",e!==null),Se.classList.remove("hidden")}function Kr(){Le("Waking Shai Hulud \u2014 usually a few seconds"),Se.classList.add("waking")}function ro(){Se.classList.add("hidden")}function ks(t,e,o){Xr(hs,ps,t,o),us.textContent=e,ds.classList.toggle("hidden",X.length===0),G.show(X)}function ao(){G.hide()}function Jr(t){let e=X[t];if(e){co();for(let o=1;o<=t;o++){let i=X[o-1];X[o].players.forEach((n,s)=>lo.drawSegment(i.players[s],n,s))}se.draw(e.players),ze.draw(e),Oe=e,Te=e,Go(e.players),Fr.textContent=`${(e.tick/gt.tick_hz).toFixed(1)}s \xB7 tick ${e.tick}`}}G=Qo({end:cs,slider:fs,time:Fr,playButton:ms,render:Jr,tickHz:()=>gt.tick_hz});function $s(t){Ur=t,Re[0]=t,Re.length=1,X.push(t),Zo()}function As(){if(jo=0,!F)return;let t=Re.pop();t&&(Te&&t.players.forEach((e,o)=>lo.drawSegment(Te.players[o],e,o)),Te=t,ze.draw(t),se.clear(),se.draw(t.players),Oe=t,Go(t.players),Re.length&&Zo())}function Zo(){jo||(jo=requestAnimationFrame(As))}function Es(t){jr=!0;let e=JSON.parse(t.data);if(e.type==="config")V=e.seats,j=e.human??V.includes("you"),no=e.rewind??!0,vs.textContent=no?"Space stops at the next boundary. Then \u2190, \u2191, \u2192, N, and R inspect one tick at a time. C lets you click a controller target.":"Space stops at the next boundary. Then \u2190, \u2191, \u2192, and N inspect one tick at a time. C lets you click a controller target.",e.catalog&&ae.setCatalog(e.catalog),gt={...gt,...e.simulator},io.value=e.decision_interval??16,Hr=e.visuals||[],Pe={},G.hide(),se=ti({context:Et,colors:vt,size:Wo,simulator:()=>gt}),ze=ei({context:ss,colors:vt,size:Wo,simulator:()=>gt}),lo=oi({context:ns,colors:vt,size:Wo,simulator:()=>gt}),se.setPlayers(V.length),co(),Ht(),Yr(),ie(!1),oe=null,Le("Waiting for players...");else if(e.type==="ready")Wt=!0,ie(!1),G.active||(ao(),Le(`Press ${Xo} to start`,oe)),oe=null;else if(e.type==="frame")$s(e);else if(e.type==="paused")yt=!0,Ht(e.ticks),ro();else if(e.type==="resumed")yt=!1,Ht(),ro();else if(e.type==="rewound"){F=!0,yt=!0,Wt=!1,ie(!0),ro(),ao();let o=e.frame;X=X.filter(i=>i.tick<=o.tick),(!X.length||X.at(-1).tick!==o.tick)&&X.push(o),Jr(X.length-1),Ht(o.tick)}else e.type==="end"&&(F=!1,yt=!1,Ht(),ie(!1),Go(e.players||Oe?.players||[]),oe=e.winner,ks(e.winner,`${e.ticks} ticks. Drag the timeline to review, or press ${Xo} to play again.`,e.outcome))}function Ss(){if(!jr){Kr(),setTimeout(Gr,1e3);return}F=!1,yt=!1,Ht(),ie(!1),Le("Disconnected")}function Gr(){U=new WebSocket(qr),U.onmessage=Es,U.onclose=Ss}var ne=new Set;function Zr(){let t=ne.has("ArrowLeft"),e=ne.has("ArrowRight"),o=ne.has("ArrowUp")||t&&e?1:t?2:e?0:1;U.send(JSON.stringify({type:"input",action:o}))}function Ts(){!Wt||F||(F=!0,yt=!1,Ht(),ie(!0),Wt=!1,oe=null,X=[],G.hide(),co(),ro(),ao(),Zo(),U.send(JSON.stringify({type:"start"})))}Et.canvas.addEventListener("click",t=>{if(!re||!yt||!j)return;let e=Et.canvas.getBoundingClientRect(),o=(t.clientX-e.left)/e.width*gt.arena_size,i=(1-(t.clientY-e.top)/e.height)*gt.arena_size;re=!1,Et.canvas.style.cursor="",U.send(JSON.stringify({type:"controller_target",x:o,y:i})),t.preventDefault()});ae=ii({input:Ko,options:gs,locked:()=>F,onSelect:_s,initialCatalog:Vr,playersUrl:Vr.length?null:new URL("/players",Jo)});io.addEventListener("sl-change",()=>{let t=Math.max(1,Math.min(1e4,Number.parseInt(io.value,10)||16));io.value=t,U.send(JSON.stringify({type:"settings",decision_interval:t}))});function Ps(t){return t.composedPath().some(e=>e instanceof Element&&e.matches("input, textarea, [contenteditable], sl-input, sl-range, button, sl-button"))}function Rs(t){return G.active&&t.repeat&&ys.has(t.key.toLowerCase())}addEventListener("keydown",t=>{if(!Ps(t)){if(Rs(t)){t.preventDefault();return}if(t.key.toLowerCase()===Xo&&Wt&&!F&&(Ts(),t.preventDefault()),t.key===" "){if(re){re=!1,Et.canvas.style.cursor="",t.preventDefault();return}G.active?G.toggle():F&&U.send(JSON.stringify({type:yt?"continue":"break"})),t.preventDefault();return}if(G.active&&(t.key==="ArrowLeft"||t.key==="ArrowRight")){G.step(t.key==="ArrowLeft"?-1:1),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&no&&G.active&&!F){F=!0,Wt=!1,U.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}if(F&&yt){if(t.key.toLowerCase()==="c"&&j&&!t.repeat){re=!0,Et.canvas.style.cursor="crosshair",t.preventDefault();return}let e={ArrowLeft:2,ArrowUp:1,ArrowRight:0}[t.key];if(e!==void 0){U.send(JSON.stringify({type:"step",action:e})),t.preventDefault();return}if(t.key.toLowerCase()==="n"&&!t.repeat){U.send(JSON.stringify({type:"next"})),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&no){U.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}}(t.key==="ArrowLeft"||t.key==="ArrowUp"||t.key==="ArrowRight")&&(ne.has(t.key)||(ne.add(t.key),Zr()),t.preventDefault())}});addEventListener("keyup",t=>{ne.delete(t.key)&&Zr()});Wr&&Kr();Gr();co();
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
