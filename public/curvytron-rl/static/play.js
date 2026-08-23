function Qo({end:t,slider:e,time:o,playButton:r,render:i,tickHz:n}){let s=t.firstElementChild,a=[],l=!1,u=!1,h=0,c=0,m=null;function f(b){u=b&&a.length>1,r.textContent=u?"Pause":"Play",c=0,u&&!h&&(h=requestAnimationFrame(d))}function d(b){if(h=0,!!u){if(!c||b-c<1e3/n()){c||=b,h=requestAnimationFrame(d);return}e.value=(Number(e.value)+1)%a.length,i(Number(e.value)),c=b,h=requestAnimationFrame(d)}}function v(b){a=b,l=!0,e.max=Math.max(a.length-1,0),e.value=e.max,t.classList.remove("hidden"),f(!1),a.length&&i(Number(e.value))}function y(){l=!1,f(!1),t.classList.add("hidden")}return e.addEventListener("sl-input",()=>i(Number(e.value))),r.addEventListener("click",()=>f(!u)),s.addEventListener("pointerdown",b=>{if(b.target.closest("input, button, sl-range"))return;let w=s.getBoundingClientRect(),_=t.getBoundingClientRect(),x=w.left-_.left,E=w.top-_.top;s.style.left=`${x}px`,s.style.top=`${E}px`,s.style.transform="none",m={x:b.clientX,y:b.clientY,left:x,top:E},s.classList.add("dragging"),s.setPointerCapture(b.pointerId)}),s.addEventListener("pointermove",b=>{m&&(s.style.left=`${m.left+b.clientX-m.x}px`,s.style.top=`${m.top+b.clientY-m.y}px`)}),s.addEventListener("pointerup",()=>{m=null,s.classList.remove("dragging")}),{get active(){return l},hide:y,show:v,step(b){f(!1),e.value=(Number(e.value)+b+a.length)%a.length,i(Number(e.value))},toggle(){f(!u)}}}function tr({context:t,colors:e,size:o,simulator:r}){let i=[];function n(c){return[c.x*o,(1-c.y)*o]}function s(c){let m=Math.max(2,r().radius*o/r().arena_size),f=Math.ceil((m+2)*2),d=document.createElement("canvas");d.width=f,d.height=f;let v=d.getContext("2d");return v.beginPath(),v.arc(f/2,f/2,m,0,2*Math.PI),v.fillStyle="#fff",v.fill(),v.lineWidth=2,v.strokeStyle=e[c%e.length],v.stroke(),{canvas:d,radius:f/2,clearX:0,clearY:0,clearWidth:f}}function a(c){i=Array.from({length:c},(m,f)=>s(f))}function l(){t.clearRect(0,0,o,o),i.forEach(c=>{c.clearX=0,c.clearY=0,c.clearWidth=c.canvas.width})}function u(){i.forEach(c=>t.clearRect(c.clearX,c.clearY,c.clearWidth,c.clearWidth))}function h(c){c.forEach((m,f)=>{let d=i[f],[v,y]=n(m),b=v-d.radius,w=y-d.radius;t.drawImage(d.canvas,b,w),d.clearX=Math.floor(b)-1,d.clearY=Math.floor(w)-1,d.clearWidth=d.canvas.width+2})}return{clear:u,draw:h,reset:l,setPlayers:a}}function er({context:t,colors:e,size:o,simulator:r}){function i(h){return[h.x*o,(1-h.y)*o]}function n(h,c){t.strokeStyle=c,t.fillStyle=c;let m=2*Math.PI/h.distances[0].length;h.points.forEach(([f,d],v)=>{let[y,b]=h.headings[v],w=Math.atan2(b,y),_=f*o/r().arena_size,x=(1-d/r().arena_size)*o;h.distances[v].forEach((E,$)=>{let R=w-Math.PI+($+.5)*m,B=E*o/r().arena_size;t.globalAlpha=.05+.18*(E/h.max_distance),t.beginPath(),t.moveTo(_,x),t.arc(_,x,B,-R-m/2,-R+m/2),t.closePath(),t.fill(),t.globalAlpha=.35,t.beginPath(),t.moveTo(_,x),t.lineTo(_+Math.cos(R)*B,x-Math.sin(R)*B),t.stroke()}),t.globalAlpha=.95,t.beginPath(),t.arc(_,x,2,0,2*Math.PI),t.fill()})}function s(h,c,m){let f=h>=0,d=Math.tanh(Math.abs(h)),[v,y]=i(c),b=30+42*d,w=t.createRadialGradient(v,y,0,v,y,b);w.addColorStop(0,m),w.addColorStop(.28,m+"aa"),w.addColorStop(1,m+"00"),t.globalAlpha=f?.18+.72*d:.08+.18*d,t.fillStyle=w,t.beginPath(),t.arc(v,y,b,0,2*Math.PI),t.fill();let _=`V ${f?"+":"\u2212"}${Math.abs(h).toFixed(2)}`;t.globalAlpha=1,t.font="600 13px Lato, Helvetica, sans-serif";let x=t.measureText(_).width+12,E=Math.max(4,Math.min(o-x-4,v-x/2)),$=y<38?y+42:y-30;t.fillStyle="rgba(20, 20, 20, .8)",t.beginPath(),t.roundRect(E,$-15,x,20,5),t.fill(),t.fillStyle=f?m:"#aeb6c2",t.fillText(_,E+6,$)}function a(h,c,m){if(!h?.target||!c)return;let[f,d]=i(c),v=h.target[0]*o/r().arena_size,y=(1-h.target[1]/r().arena_size)*o;if(t.strokeStyle=m,t.fillStyle=m,t.globalAlpha=.9,t.setLineDash([7,5]),t.beginPath(),t.moveTo(f,d),t.lineTo(v,y),t.stroke(),t.setLineDash([]),t.beginPath(),t.arc(v,y,7,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(v-11,y),t.lineTo(v+11,y),t.moveTo(v,y-11),t.lineTo(v,y+11),t.stroke(),Number.isInteger(h.action)){let b=["R","S","L"];t.font="600 13px Lato, Helvetica, sans-serif",t.fillText(b[h.action],v+12,y-12)}}function l(){t.clearRect(0,0,o,o)}function u(h){l(),h&&(Object.entries(h.overlays||{}).forEach(([c,m])=>{let f=Number(c),d=e[f%e.length];m.lidar&&n(m.lidar,d),Number.isFinite(m.value)&&h.players[f]&&s(m.value,h.players[f],d)}),h.controller&&a(h.controller,h.players[0],e[0]),t.globalAlpha=1)}return{draw:u,reset:l}}function or({context:t,colors:e,size:o,simulator:r}){t.lineCap="round";function i(a){return[a.x*o,(1-a.y)*o]}function n(){t.fillStyle="#222222",t.fillRect(0,0,o,o)}function s(a,l,u){if(!l.alive||!l.trail_active||!a?.alive||!a.trail_active)return;let[h,c]=i(a),[m,f]=i(l);t.strokeStyle=e[u%e.length],t.lineWidth=Math.max(2,r().radius*o/r().arena_size*2),t.beginPath(),t.moveTo(h,c),t.lineTo(m,f),t.stroke()}return{drawSegment:s,reset:n}}function rr({input:t,options:e,locked:o,onSelect:r,playersUrl:i="/players"}){let n=[],s="",a=-1,l=new Map;function u(d){return l.get(d)}function h(){a=-1,e.replaceChildren(),e.classList.add("hidden"),t.setAttribute("aria-expanded","false")}function c(){if(o()||!n.length){h();return}let d=t.value.trim().toLowerCase(),v=n.filter(y=>`${y.label} ${y.spec}`.toLowerCase().includes(d));e.replaceChildren(...v.map((y,b)=>{let w=document.createElement("button");w.className="player-option",w.type="button",w.dataset.spec=y.spec,w.setAttribute("role","option"),w.setAttribute("aria-selected",b===a?"true":"false"),b===a&&w.classList.add("active");let _=document.createElement("span");_.className="player-option-name",_.textContent=y.label;let x=document.createElement("span");return x.className="player-option-kind",x.textContent=y.kind,w.title=y.label,w.append(_,x),w})),e.classList.toggle("hidden",v.length===0),t.setAttribute("aria-expanded",v.length>0?"true":"false")}function m(d){if(!Array.isArray(d))return;let v=d.map(y=>`${y.spec}
${y.label}
${y.kind}`).join(`
`);v!==s&&(n=d,s=v,l=new Map(d.filter(y=>y.kind==="checkpoint").map(y=>[y.spec,y.label])),a=-1,e.classList.contains("hidden")||c())}async function f(){try{let d=await fetch(i,{cache:"no-store"});d.ok&&m(await d.json())}catch{}}return t.addEventListener("sl-focus",c),t.addEventListener("sl-input",()=>{a=-1,c()}),t.addEventListener("keydown",d=>{let v=[...e.querySelectorAll(".player-option")];if(d.key==="ArrowDown"||d.key==="ArrowUp"){if(!v.length)return;a=(a+(d.key==="ArrowDown"?1:v.length-1))%v.length,c(),d.preventDefault()}else d.key==="Enter"&&a>=0&&v[a]?(r(v[a].dataset.spec),d.preventDefault()):d.key==="Escape"&&(h(),t.blur(),d.preventDefault(),d.stopPropagation())}),t.addEventListener("sl-blur",()=>setTimeout(h,120)),e.addEventListener("mousedown",d=>d.preventDefault()),e.addEventListener("click",d=>{let v=d.target.closest(".player-option");v&&r(v.dataset.spec)}),f(),setInterval(()=>{o()||f()},3e3),{hide:h,labelFor:u,setCatalog:m}}var ze=globalThis,De=ze.ShadowRoot&&(ze.ShadyCSS===void 0||ze.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,co=Symbol(),ir=new WeakMap,he=class{constructor(e,o,r){if(this._$cssResult$=!0,r!==co)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(De&&e===void 0){let r=o!==void 0&&o.length===1;r&&(e=ir.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&ir.set(o,e))}return e}toString(){return this.cssText}},nr=t=>new he(typeof t=="string"?t:t+"",void 0,co),O=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((r,i,n)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new he(o,t,co)},sr=(t,e)=>{if(De)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let r=document.createElement("style"),i=ze.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,t.appendChild(r)}},ho=De?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let r of e.cssRules)o+=r.cssText;return nr(o)})(t):t;var{is:Gi,defineProperty:Zi,getOwnPropertyDescriptor:Qi,getOwnPropertyNames:tn,getOwnPropertySymbols:en,getPrototypeOf:on}=Object,Me=globalThis,ar=Me.trustedTypes,rn=ar?ar.emptyScript:"",nn=Me.reactiveElementPolyfillSupport,pe=(t,e)=>t,wt={toAttribute(t,e){switch(e){case Boolean:t=t?rn:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},Ne=(t,e)=>!Gi(t,e),lr={attribute:!0,type:String,converter:wt,reflect:!1,useDefault:!1,hasChanged:Ne};Symbol.metadata??=Symbol("metadata"),Me.litPropertyMetadata??=new WeakMap;var ht=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=lr){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(e,r,o);i!==void 0&&Zi(this.prototype,e,i)}}static getPropertyDescriptor(e,o,r){let{get:i,set:n}=Qi(this.prototype,e)??{get(){return this[o]},set(s){this[o]=s}};return{get:i,set(s){let a=i?.call(this);n?.call(this,s),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??lr}static _$Ei(){if(this.hasOwnProperty(pe("elementProperties")))return;let e=on(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(pe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pe("properties"))){let o=this.properties,r=[...tn(o),...en(o)];for(let i of r)this.createProperty(i,o[i])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[o,r]of this.elementProperties){let i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)o.unshift(ho(i))}else e!==void 0&&o.push(ho(e));return o}static _$Eu(e,o){let r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let r of o.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return sr(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,r){this._$AK(e,r)}_$ET(e,o){let r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:wt).toAttribute(o,r.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,o){let r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=r.getPropertyOptions(i),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:wt;this._$Em=i;let a=s.fromAttribute(o,n.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,o,r,i=!1,n){if(e!==void 0){let s=this.constructor;if(i===!1&&(n=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??Ne)(n,o)||r.useDefault&&r.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:r,reflect:i,wrapped:n},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??o??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(o=void 0),this._$AL.set(e,o)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,n]of r){let{wrapped:s}=n,a=this[i];s!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(o)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[pe("elementProperties")]=new Map,ht[pe("finalized")]=new Map,nn?.({ReactiveElement:ht}),(Me.reactiveElementVersions??=[]).push("2.1.2");var uo=globalThis,cr=t=>t,Be=uo.trustedTypes,hr=Be?Be.createPolicy("lit-html",{createHTML:t=>t}):void 0,fo="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,mo="?"+pt,sn=`<${mo}>`,Lt=document,de=()=>Lt.createComment(""),fe=t=>t===null||typeof t!="object"&&typeof t!="function",go=Array.isArray,gr=t=>go(t)||typeof t?.[Symbol.iterator]=="function",po=`[ 	
\f\r]`,ue=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pr=/-->/g,ur=/>/g,Pt=RegExp(`>|${po}(?:([^\\s"'>=/]+)(${po}*=${po}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dr=/'/g,fr=/"/g,vr=/^(?:script|style|textarea|title)$/i,vo=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),P=vo(1),Is=vo(2),Vs=vo(3),H=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),mr=new WeakMap,Rt=Lt.createTreeWalker(Lt,129);function yr(t,e){if(!go(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return hr!==void 0?hr.createHTML(e):e}var br=(t,e)=>{let o=t.length-1,r=[],i,n=e===2?"<svg>":e===3?"<math>":"",s=ue;for(let a=0;a<o;a++){let l=t[a],u,h,c=-1,m=0;for(;m<l.length&&(s.lastIndex=m,h=s.exec(l),h!==null);)m=s.lastIndex,s===ue?h[1]==="!--"?s=pr:h[1]!==void 0?s=ur:h[2]!==void 0?(vr.test(h[2])&&(i=RegExp("</"+h[2],"g")),s=Pt):h[3]!==void 0&&(s=Pt):s===Pt?h[0]===">"?(s=i??ue,c=-1):h[1]===void 0?c=-2:(c=s.lastIndex-h[2].length,u=h[1],s=h[3]===void 0?Pt:h[3]==='"'?fr:dr):s===fr||s===dr?s=Pt:s===pr||s===ur?s=ue:(s=Pt,i=void 0);let f=s===Pt&&t[a+1].startsWith("/>")?" ":"";n+=s===ue?l+sn:c>=0?(r.push(u),l.slice(0,c)+fo+l.slice(c)+pt+f):l+pt+(c===-2?a:f)}return[yr(t,n+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},me=class t{constructor({strings:e,_$litType$:o},r){let i;this.parts=[];let n=0,s=0,a=e.length-1,l=this.parts,[u,h]=br(e,o);if(this.el=t.createElement(u,r),Rt.currentNode=this.el.content,o===2||o===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=Rt.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(fo)){let m=h[s++],f=i.getAttribute(c).split(pt),d=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:d[2],strings:f,ctor:d[1]==="."?Ve:d[1]==="?"?Fe:d[1]==="@"?Ue:zt}),i.removeAttribute(c)}else c.startsWith(pt)&&(l.push({type:6,index:n}),i.removeAttribute(c));if(vr.test(i.tagName)){let c=i.textContent.split(pt),m=c.length-1;if(m>0){i.textContent=Be?Be.emptyScript:"";for(let f=0;f<m;f++)i.append(c[f],de()),Rt.nextNode(),l.push({type:2,index:++n});i.append(c[m],de())}}}else if(i.nodeType===8)if(i.data===mo)l.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(pt,c+1))!==-1;)l.push({type:7,index:n}),c+=pt.length-1}n++}}static createElement(e,o){let r=Lt.createElement("template");return r.innerHTML=e,r}};function Ot(t,e,o=t,r){if(e===H)return e;let i=r!==void 0?o._$Co?.[r]:o._$Cl,n=fe(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,o,r)),r!==void 0?(o._$Co??=[])[r]=i:o._$Cl=i),i!==void 0&&(e=Ot(t,i._$AS(t,e.values),i,r)),e}var Ie=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:r}=this._$AD,i=(e?.creationScope??Lt).importNode(o,!0);Rt.currentNode=i;let n=Rt.nextNode(),s=0,a=0,l=r[0];for(;l!==void 0;){if(s===l.index){let u;l.type===2?u=new qt(n,n.nextSibling,this,e):l.type===1?u=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(u=new He(n,this,e)),this._$AV.push(u),l=r[++a]}s!==l?.index&&(n=Rt.nextNode(),s++)}return Rt.currentNode=Lt,i}p(e){let o=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,o),o+=r.strings.length-2):r._$AI(e[o])),o++}},qt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,r,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=Ot(this,e,o),fe(e)?e===T||e==null||e===""?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==H&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):gr(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&fe(this._$AH)?this._$AA.nextSibling.data=e:this.T(Lt.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=me.createElement(yr(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(o);else{let n=new Ie(i,this),s=n.u(this.options);n.p(o),this.T(s),this._$AH=n}}_$AC(e){let o=mr.get(e.strings);return o===void 0&&mr.set(e.strings,o=new me(e)),o}k(e){go(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,r,i=0;for(let n of e)i===o.length?o.push(r=new t(this.O(de()),this.O(de()),this,this.options)):r=o[i],r._$AI(n),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let r=cr(e).nextSibling;cr(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},zt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,r,i,n){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=o,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=T}_$AI(e,o=this,r,i){let n=this.strings,s=!1;if(n===void 0)e=Ot(this,e,o,0),s=!fe(e)||e!==this._$AH&&e!==H,s&&(this._$AH=e);else{let a=e,l,u;for(e=n[0],l=0;l<n.length-1;l++)u=Ot(this,a[r+l],o,l),u===H&&(u=this._$AH[l]),s||=!fe(u)||u!==this._$AH[l],u===T?e=T:e!==T&&(e+=(u??"")+n[l+1]),this._$AH[l]=u}s&&!i&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ve=class extends zt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}},Fe=class extends zt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}},Ue=class extends zt{constructor(e,o,r,i,n){super(e,o,r,i,n),this.type=5}_$AI(e,o=this){if((e=Ot(this,e,o,0)??T)===H)return;let r=this._$AH,i=e===T&&r!==T||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==T&&(r===T||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},He=class{constructor(e,o,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Ot(this,e)}},wr={M:fo,P:pt,A:mo,C:1,L:br,R:Ie,D:gr,V:Ot,I:qt,H:zt,N:Fe,U:Ue,B:Ve,F:He},an=uo.litHtmlPolyfillSupport;an?.(me,qt),(uo.litHtmlVersions??=[]).push("3.3.3");var _r=(t,e,o)=>{let r=o?.renderBefore??e,i=r._$litPart$;if(i===void 0){let n=o?.renderBefore??null;r._$litPart$=i=new qt(e.insertBefore(de(),n),n,void 0,o??{})}return i._$AI(t),i};var yo=globalThis,_t=class extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=_r(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};_t._$litElement$=!0,_t.finalized=!0,yo.litElementHydrateSupport?.({LitElement:_t});var ln=yo.litElementPolyfillSupport;ln?.({LitElement:_t});(yo.litElementVersions??=[]).push("4.2.2");var xr=O`
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
`;var $r=Object.defineProperty,cn=Object.defineProperties,hn=Object.getOwnPropertyDescriptor,pn=Object.getOwnPropertyDescriptors,Cr=Object.getOwnPropertySymbols,un=Object.prototype.hasOwnProperty,dn=Object.prototype.propertyIsEnumerable,bo=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),wo=t=>{throw TypeError(t)},kr=(t,e,o)=>e in t?$r(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,Y=(t,e)=>{for(var o in e||(e={}))un.call(e,o)&&kr(t,o,e[o]);if(Cr)for(var o of Cr(e))dn.call(e,o)&&kr(t,o,e[o]);return t},xt=(t,e)=>cn(t,pn(e)),p=(t,e,o,r)=>{for(var i=r>1?void 0:r?hn(e,o):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(r?s(e,o,i):s(i))||i);return r&&i&&$r(e,o,i),i},Ar=(t,e,o)=>e.has(t)||wo("Cannot "+o),Er=(t,e,o)=>(Ar(t,e,"read from private field"),o?o.call(t):e.get(t)),Sr=(t,e,o)=>e.has(t)?wo("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),Tr=(t,e,o,r)=>(Ar(t,e,"write to private field"),r?r.call(t,o):e.set(t,o),o),fn=function(t,e){this[0]=t,this[1]=e},Pr=t=>{var e=t[bo("asyncIterator")],o=!1,r,i={};return e==null?(e=t[bo("iterator")](),r=n=>i[n]=s=>e[n](s)):(e=e.call(t),r=n=>i[n]=s=>{if(o){if(o=!1,n==="throw")throw s;return s}return o=!0,{done:!1,value:new fn(new Promise(a=>{var l=e[n](s);l instanceof Object||wo("Object expected"),a(l)}),1)}}),i[bo("iterator")]=()=>i,r("next"),"throw"in e?r("throw"):i.throw=n=>{throw n},"return"in e&&r("return"),i};function*Lr(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*Pr(Lr(t.shadowRoot.activeElement))))}function Or(){return[...Lr()].pop()}var Rr=new WeakMap;function zr(t){let e=Rr.get(t);return e||(e=window.getComputedStyle(t,null),Rr.set(t,e)),e}function mn(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=zr(t);return e.visibility!=="hidden"&&e.display!=="none"}function gn(t){let e=zr(t),{overflowY:o,overflowX:r}=e;return o==="scroll"||r==="scroll"?!0:o!=="auto"||r!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&r==="auto"}function vn(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let n=t.getRootNode(),s=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=n.querySelector(`${s}:checked`);return a?a===t:n.querySelector(s)===t}return mn(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:gn(t):!1}function Dr(t){var e,o;let r=bn(t),i=(e=r[0])!=null?e:null,n=(o=r[r.length-1])!=null?o:null;return{start:i,end:n}}function yn(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function bn(t){let e=new WeakMap,o=[];function r(i){if(i instanceof Element){if(i.hasAttribute("inert")||i.closest("[inert]")||e.has(i))return;e.set(i,!0),!o.includes(i)&&vn(i)&&o.push(i),i instanceof HTMLSlotElement&&yn(i,t)&&i.assignedElements({flatten:!0}).forEach(n=>{r(n)}),i.shadowRoot!==null&&i.shadowRoot.mode==="open"&&r(i.shadowRoot)}for(let n of i.children)r(n)}return r(t),o.sort((i,n)=>{let s=Number(i.getAttribute("tabindex"))||0;return(Number(n.getAttribute("tabindex"))||0)-s})}var Mr=O`
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
`;var _o=new Set,jt=new Map,ut,xo="ltr",Co="en",Nr=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Nr){let t=new MutationObserver(Br);xo=document.documentElement.dir||"ltr",Co=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function ge(...t){t.map(e=>{let o=e.$code.toLowerCase();jt.has(o)?jt.set(o,Object.assign(Object.assign({},jt.get(o)),e)):jt.set(o,e),ut||(ut=e)}),Br()}function Br(){Nr&&(xo=document.documentElement.dir||"ltr",Co=document.documentElement.lang||navigator.language),[..._o.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var We=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){_o.add(this.host)}hostDisconnected(){_o.delete(this.host)}dir(){return`${this.host.dir||xo}`.toLowerCase()}lang(){let e=`${this.host.lang||Co}`.toLowerCase().replace(/_/g,"-");try{return new Intl.Locale(e),e}catch{return ut?ut.$code.toLowerCase():"en"}}getTranslationData(e){var o,r;let i;try{i=new Intl.Locale(e.replace(/_/g,"-"))}catch{return{locale:void 0,language:"",region:"",primary:void 0,secondary:void 0}}let n=i.language.toLowerCase(),s=(r=(o=i.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",a=jt.get(`${n}-${s}`),l=jt.get(n);return{locale:i,language:n,region:s,primary:a,secondary:l}}exists(e,o){var r;let{primary:i,secondary:n}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[e]||n&&n[e]||o.includeFallback&&ut&&ut[e])}term(e,...o){let{primary:r,secondary:i}=this.getTranslationData(this.lang()),n;if(r&&r[e])n=r[e];else if(i&&i[e])n=i[e];else if(ut&&ut[e])n=ut[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof n=="function"?n(...o):n}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(e,o)}};var Ir={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};ge(Ir);var Vr=Ir;var Ct=class extends We{};ge(Vr);var K=O`
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
`;var wn={attribute:!0,type:String,converter:wt,reflect:!1,hasChanged:Ne},_n=(t=wn,e,o)=>{let{kind:r,metadata:i}=o,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),r==="accessor"){let{name:s}=o;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,t,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,t,a),a}}}if(r==="setter"){let{name:s}=o;return function(a){let l=this[s];e.call(this,a),this.requestUpdate(s,l,t,!0,a)}}throw Error("Unsupported decorator location: "+r)};function g(t){return(e,o)=>typeof o=="object"?_n(t,e,o):((r,i,n)=>{let s=i.hasOwnProperty(n);return i.constructor.createProperty(n,r),s?Object.getOwnPropertyDescriptor(i,n):void 0})(t,e,o)}function dt(t){return g({...t,state:!0,attribute:!1})}function Fr(t){return(e,o)=>{let r=typeof e=="function"?e:e[o];Object.assign(r,t)}}var Dt=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function W(t,e){return(o,r,i)=>{let n=s=>s.renderRoot?.querySelector(t)??null;if(e){let{get:s,set:a}=typeof r=="object"?o:i??(()=>{let l=Symbol();return{get(){return this[l]},set(u){this[l]=u}}})();return Dt(o,r,{get(){let l=s.call(this);return l===void 0&&(l=n(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return Dt(o,r,{get(){return n(this)}})}}var qe,M=class extends _t{constructor(){super(),Sr(this,qe,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,Y({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let r=customElements.get(t);if(!r){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let i=" (unknown version)",n=i;"version"in e&&e.version&&(i=" v"+e.version),"version"in r&&r.version&&(n=" v"+r.version),!(i&&n&&i===n)&&console.warn(`Attempted to register <${t}>${i}, but <${t}>${n} has already been registered.`)}attributeChangedCallback(t,e,o){Er(this,qe)||(this.constructor.elementProperties.forEach((r,i)=>{r.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Tr(this,qe,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};qe=new WeakMap;M.version="2.20.1";M.dependencies={};p([g()],M.prototype,"dir",2);p([g()],M.prototype,"lang",2);var nt=Math.min,tt=Math.max,ye=Math.round,be=Math.floor,st=t=>({x:t,y:t}),xn={left:"right",right:"left",bottom:"top",top:"bottom"};function ko(t,e,o){return tt(t,nt(e,o))}function Mt(t,e){return typeof t=="function"?t(e):t}function kt(t){return t.split("-")[0]}function Nt(t){return t.split("-")[1]}function $o(t){return t==="x"?"y":"x"}function Ye(t){return t==="y"?"height":"width"}function at(t){let e=t[0];return e==="t"||e==="b"?"y":"x"}function Xe(t){return $o(at(t))}function Wr(t,e,o){o===void 0&&(o=!1);let r=Nt(t),i=Xe(t),n=Ye(i),s=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(s=ve(s)),[s,ve(s)]}function qr(t){let e=ve(t);return[je(t),e,je(e)]}function je(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}var Ur=["left","right"],Hr=["right","left"],Cn=["top","bottom"],kn=["bottom","top"];function $n(t,e,o){switch(t){case"top":case"bottom":return o?e?Hr:Ur:e?Ur:Hr;case"left":case"right":return e?Cn:kn;default:return[]}}function jr(t,e,o,r){let i=Nt(t),n=$n(kt(t),o==="start",r);return i&&(n=n.map(s=>s+"-"+i),e&&(n=n.concat(n.map(je)))),n}function ve(t){let e=kt(t);return xn[e]+t.slice(e.length)}function An(t){var e,o,r,i;return{top:(e=t.top)!=null?e:0,right:(o=t.right)!=null?o:0,bottom:(r=t.bottom)!=null?r:0,left:(i=t.left)!=null?i:0}}function Ao(t){return typeof t!="number"?An(t):{top:t,right:t,bottom:t,left:t}}function Bt(t){let{x:e,y:o,width:r,height:i}=t;return{width:r,height:i,top:o,left:e,right:e+r,bottom:o+i,x:e,y:o}}function Yr(t,e,o){let{reference:r,floating:i}=t,n=at(e),s=Xe(e),a=Ye(s),l=kt(e),u=n==="y",h=r.x+r.width/2-i.width/2,c=r.y+r.height/2-i.height/2,m=r[a]/2-i[a]/2,f;switch(l){case"top":f={x:h,y:r.y-i.height};break;case"bottom":f={x:h,y:r.y+r.height};break;case"right":f={x:r.x+r.width,y:c};break;case"left":f={x:r.x-i.width,y:c};break;default:f={x:r.x,y:r.y}}let d=Nt(e);return d&&(f[s]+=m*(d==="end"?1:-1)*(o&&u?-1:1)),f}async function Xr(t,e){var o;e===void 0&&(e={});let{x:r,y:i,platform:n,rects:s,elements:a,strategy:l}=t,{boundary:u="clippingAncestors",rootBoundary:h="viewport",elementContext:c="floating",altBoundary:m=!1,padding:f=0}=Mt(e,t),d=Ao(f),y=a[m?c==="floating"?"reference":"floating":c],b=Bt(await n.getClippingRect({element:(o=await(n.isElement==null?void 0:n.isElement(y)))==null||o?y:y.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(a.floating)),boundary:u,rootBoundary:h,strategy:l})),w=c==="floating"?{x:r,y:i,width:s.floating.width,height:s.floating.height}:s.reference,_=await(n.getOffsetParent==null?void 0:n.getOffsetParent(a.floating)),x=await(n.isElement==null?void 0:n.isElement(_))&&await(n.getScale==null?void 0:n.getScale(_))||{x:1,y:1},E=Bt(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:_,strategy:l}):w);return{top:(b.top-E.top+d.top)/x.y,bottom:(E.bottom-b.bottom+d.bottom)/x.y,left:(b.left-E.left+d.left)/x.x,right:(E.right-b.right+d.right)/x.x}}var En=50,Kr=async(t,e,o)=>{let{placement:r="bottom",strategy:i="absolute",middleware:n=[],platform:s}=o,a=s.detectOverflow?s:{...s,detectOverflow:Xr},l=await(s.isRTL==null?void 0:s.isRTL(e)),u=await s.getElementRects({reference:t,floating:e,strategy:i}),{x:h,y:c}=Yr(u,r,l),m=r,f=0,d={};for(let v=0;v<n.length;v++){let y=n[v];if(!y)continue;let{name:b,fn:w}=y,{x:_,y:x,data:E,reset:$}=await w({x:h,y:c,initialPlacement:r,placement:m,strategy:i,middlewareData:d,rects:u,platform:a,elements:{reference:t,floating:e}});h=_??h,c=x??c,d[b]={...d[b],...E},$&&f<En&&(f++,typeof $=="object"&&($.placement&&(m=$.placement),$.rects&&(u=$.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:i}):$.rects),{x:h,y:c}=Yr(u,m,l)),v=-1)}return{x:h,y:c,placement:m,strategy:i,middlewareData:d}},Jr=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:r,placement:i,rects:n,platform:s,elements:a,middlewareData:l}=e,{element:u,padding:h=0}=Mt(t,e)||{};if(u==null)return{};let c=Ao(h),m={x:o,y:r},f=Xe(i),d=Ye(f),v=await s.getDimensions(u),y=f==="y",b=y?"top":"left",w=y?"bottom":"right",_=y?"clientHeight":"clientWidth",x=n.reference[d]+n.reference[f]-m[f]-n.floating[d],E=m[f]-n.reference[f],$=await(s.getOffsetParent==null?void 0:s.getOffsetParent(u)),R=$?$[_]:0;(!R||!await(s.isElement==null?void 0:s.isElement($)))&&(R=a.floating[_]||n.floating[d]);let B=x/2-E/2,rt=R/2-v[d]/2-1,D=nt(c[b],rt),le=nt(c[w],rt),ce=R-v[d]-le,it=R/2-v[d]/2+B,Z=ko(D,it,ce),St=!l.arrow&&Nt(i)!=null&&it!==Z&&n.reference[d]/2-(it<D?D:le)-v[d]/2<0,ct=St?it<D?it-D:it-ce:0;return{[f]:m[f]+ct,data:{[f]:Z,centerOffset:it-Z-ct,...St&&{alignmentOffset:ct}},reset:St}}});var Gr=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,r;let{placement:i,middlewareData:n,rects:s,initialPlacement:a,platform:l,elements:u}=e,{mainAxis:h=!0,crossAxis:c=!0,fallbackPlacements:m,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:v=!0,...y}=Mt(t,e);if((o=n.arrow)!=null&&o.alignmentOffset)return{};let b=kt(i),w=at(a),_=kt(a)===a,x=await(l.isRTL==null?void 0:l.isRTL(u.floating)),E=m||(_||!v?[ve(a)]:qr(a)),$=d!=="none";!m&&$&&E.push(...jr(a,v,d,x));let R=[a,...E],B=await l.detectOverflow(e,y),rt=[],D=((r=n.flip)==null?void 0:r.overflows)||[];if(h&&rt.push(B[b]),c){let Z=Wr(i,s,x);rt.push(B[Z[0]],B[Z[1]])}if(D=[...D,{placement:i,overflows:rt}],!rt.every(Z=>Z<=0)){var le,ce;let Z=(((le=n.flip)==null?void 0:le.index)||0)+1,St=R[Z];if(St&&(!(c==="alignment"?w!==at(St):!1)||D.every(Q=>at(Q.placement)===w?Q.overflows[0]>0:!0)))return{data:{index:Z,overflows:D},reset:{placement:St}};let ct=(ce=D.filter(Tt=>Tt.overflows[0]<=0).sort((Tt,Q)=>Tt.overflows[1]-Q.overflows[1])[0])==null?void 0:ce.placement;if(!ct)switch(f){case"bestFit":{var it;let Tt=(it=D.filter(Q=>{if($){let bt=at(Q.placement);return bt===w||bt==="y"}return!0}).map(Q=>[Q.placement,Q.overflows.filter(bt=>bt>0).reduce((bt,Ji)=>bt+Ji,0)]).sort((Q,bt)=>Q[1]-bt[1])[0])==null?void 0:it[0];Tt&&(ct=Tt);break}case"initialPlacement":ct=a;break}if(i!==ct)return{reset:{placement:ct}}}return{}}}};var Sn=new Set(["left","top"]);async function Tn(t,e){let{placement:o,platform:r,elements:i}=t,n=await(r.isRTL==null?void 0:r.isRTL(i.floating)),s=kt(o),a=Nt(o),l=at(o)==="y",u=Sn.has(s)?-1:1,h=n&&l?-1:1,c=Mt(e,t),{mainAxis:m,crossAxis:f,alignmentAxis:d}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return a&&typeof d=="number"&&(f=a==="end"?d*-1:d),l?{x:f*h,y:m*u}:{x:m*u,y:f*h}}var Zr=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,r;let{x:i,y:n,placement:s,middlewareData:a}=e,l=await Tn(e,t);return s===((o=a.offset)==null?void 0:o.placement)&&(r=a.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:n+l.y,data:{...l,placement:s}}}}},Qr=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:r,placement:i,platform:n}=e,{mainAxis:s=!0,crossAxis:a=!1,limiter:l={fn:w=>{let{x:_,y:x}=w;return{x:_,y:x}}},...u}=Mt(t,e),h={x:o,y:r},c=await n.detectOverflow(e,u),m=at(i),f=$o(m),d=h[f],v=h[m],y=(w,_)=>ko(_+c[w==="y"?"top":"left"],_,_-c[w==="y"?"bottom":"right"]);s&&(d=y(f,d)),a&&(v=y(m,v));let b=l.fn({...e,[f]:d,[m]:v});return{...b,data:{x:b.x-o,y:b.y-r,enabled:{[f]:s,[m]:a}}}}}};var ti=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){let{placement:o,rects:r,platform:i,elements:n}=e,{apply:s=()=>{},...a}=Mt(t,e),l=await i.detectOverflow(e,a),u=kt(o),h=Nt(o),c=at(o)==="y",{width:m,height:f}=r.floating,d,v;u==="top"||u==="bottom"?(d=u,v=h===(await(i.isRTL==null?void 0:i.isRTL(n.floating))?"start":"end")?"left":"right"):(v=u,d=h==="end"?"top":"bottom");let y=f-l.top-l.bottom,b=m-l.left-l.right,w=nt(f-l[d],y),_=nt(m-l[v],b),x=e.middlewareData.shift,E=!x,$=w,R=_;x!=null&&x.enabled.x&&(R=b),x!=null&&x.enabled.y&&($=y),E&&!h&&(c?R=m-2*tt(l.left,l.right):$=f-2*tt(l.top,l.bottom)),await s({...e,availableWidth:R,availableHeight:$});let B=await i.getDimensions(n.floating);return m!==B.width||f!==B.height?{reset:{rects:!0}}:{}}}};function Ke(){return typeof window<"u"}function Vt(t){return oi(t)?(t.nodeName||"").toLowerCase():"#document"}function I(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function lt(t){var e;return(e=(oi(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function oi(t){return Ke()?t instanceof Node||t instanceof I(t).Node:!1}function et(t){return Ke()?t instanceof Element||t instanceof I(t).Element:!1}function ft(t){return Ke()?t instanceof HTMLElement||t instanceof I(t).HTMLElement:!1}function ei(t){return!Ke()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof I(t).ShadowRoot}function we(t){let{overflow:e,overflowX:o,overflowY:r,display:i}=ot(t);return/auto|scroll|overlay|hidden|clip/.test(e+r+o)&&i!=="inline"&&i!=="contents"}function ri(t){return/^(table|td|th)$/.test(Vt(t))}function _e(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}var Pn=/transform|translate|scale|rotate|perspective|filter/,Rn=/paint|layout|strict|content/,It=t=>!!t&&t!=="none",Eo;function Xt(t){let e=et(t)?ot(t):t;return It(e.transform)||It(e.translate)||It(e.scale)||It(e.rotate)||It(e.perspective)||!Je()&&(It(e.backdropFilter)||It(e.filter))||Pn.test(e.willChange||"")||Rn.test(e.contain||"")}function ii(t){let e=$t(t);for(;ft(e)&&!Kt(e);){if(Xt(e))return e;if(_e(e))return null;e=$t(e)}return null}function Je(){return Eo==null&&(Eo=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Eo}function Kt(t){return/^(html|body|#document)$/.test(Vt(t))}function ot(t){return I(t).getComputedStyle(t)}function xe(t){return et(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function $t(t){if(Vt(t)==="html")return t;let e=t.assignedSlot||t.parentNode||ei(t)&&t.host||lt(t);return ei(e)?e.host:e}function ni(t){let e=$t(t);return Kt(e)?(t.ownerDocument||t).body:ft(e)&&we(e)?e:ni(e)}function Yt(t,e,o){var r;e===void 0&&(e=[]),o===void 0&&(o=!0);let i=ni(t),n=i===((r=t.ownerDocument)==null?void 0:r.body),s=I(i);if(n){let a=Ge(s);return e.concat(s,s.visualViewport||[],we(i)?i:[],a&&o?Yt(a):[])}else return e.concat(i,Yt(i,[],o))}function Ge(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function li(t){let e=ot(t),o=parseFloat(e.width)||0,r=parseFloat(e.height)||0,i=ft(t),n=i?t.offsetWidth:o,s=i?t.offsetHeight:r,a=ye(o)!==n||ye(r)!==s;return a&&(o=n,r=s),{width:o,height:r,$:a}}function To(t){return et(t)?t:t.contextElement}function Jt(t){let e=To(t);if(!ft(e))return st(1);let o=e.getBoundingClientRect(),{width:r,height:i,$:n}=li(e),s=(n?ye(o.width):o.width)/r,a=(n?ye(o.height):o.height)/i;return(!s||!Number.isFinite(s))&&(s=1),(!a||!Number.isFinite(a))&&(a=1),{x:s,y:a}}var Ln=st(0);function ci(t){let e=I(t);return!Je()||!e.visualViewport?Ln:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function On(t,e,o){return e===void 0&&(e=!1),!!o&&e&&o===I(t)}function Ft(t,e,o,r){e===void 0&&(e=!1),o===void 0&&(o=!1);let i=t.getBoundingClientRect(),n=To(t),s=st(1);e&&(r?et(r)&&(s=Jt(r)):s=Jt(t));let a=On(n,o,r)?ci(n):st(0),l=(i.left+a.x)/s.x,u=(i.top+a.y)/s.y,h=i.width/s.x,c=i.height/s.y;if(n&&r){let m=I(n),f=et(r)?I(r):r,d=m,v=Ge(d);for(;v&&f!==d;){let y=Jt(v),b=v.getBoundingClientRect(),w=ot(v),_=b.left+(v.clientLeft+parseFloat(w.paddingLeft))*y.x,x=b.top+(v.clientTop+parseFloat(w.paddingTop))*y.y;l*=y.x,u*=y.y,h*=y.x,c*=y.y,l+=_,u+=x,d=I(v),v=Ge(d)}}return Bt({width:h,height:c,x:l,y:u})}function Ze(t,e){let o=xe(t).scrollLeft;return e?e.left+o:Ft(lt(t)).left+o}function hi(t,e){let o=t.getBoundingClientRect(),r=o.left+e.scrollLeft-Ze(t,o),i=o.top+e.scrollTop;return{x:r,y:i}}function zn(t){let{elements:e,rect:o,offsetParent:r,strategy:i}=t,n=i==="fixed",s=lt(r),a=e?_e(e.floating):!1;if(r===s||a&&n)return o;let l={scrollLeft:0,scrollTop:0},u=st(1),h=st(0),c=ft(r);if((c||!n)&&((Vt(r)!=="body"||we(s))&&(l=xe(r)),c)){let f=Ft(r);u=Jt(r),h.x=f.x+r.clientLeft,h.y=f.y+r.clientTop}let m=s&&!c&&!n?hi(s,l):st(0);return{width:o.width*u.x,height:o.height*u.y,x:o.x*u.x-l.scrollLeft*u.x+h.x+m.x,y:o.y*u.y-l.scrollTop*u.y+h.y+m.y}}function Dn(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function Mn(t){let e=xe(t),o=t.ownerDocument.body,r=tt(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),i=tt(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight),n=-e.scrollLeft+Ze(t),s=-e.scrollTop;return ot(o).direction==="rtl"&&(n+=tt(t.clientWidth,o.clientWidth)-r),{width:r,height:i,x:n,y:s}}var Nn=25;function Bn(t,e,o){o===void 0&&(o="viewport");let r=o==="layoutViewport",i=I(t),n=lt(t),s=i.visualViewport,a=n.clientWidth,l=n.clientHeight,u=0,h=0;if(s){let m=!Je()||e==="fixed";r?m||(u=-s.offsetLeft,h=-s.offsetTop):(a=s.width,l=s.height,m&&(u=s.offsetLeft,h=s.offsetTop))}if(Ze(n)<=0){let m=n.ownerDocument,f=m.body,d=getComputedStyle(f),v=m.compatMode==="CSS1Compat"&&parseFloat(d.marginLeft)+parseFloat(d.marginRight)||0,y=Math.abs(n.clientWidth-f.clientWidth-v),b=getComputedStyle(n).scrollbarGutter==="stable both-edges"?y/2:y;b<=Nn&&(a-=b)}return{width:a,height:l,x:u,y:h}}function In(t,e){let o=Ft(t,!0,e==="fixed"),r=o.top+t.clientTop,i=o.left+t.clientLeft,n=Jt(t),s=t.clientWidth*n.x,a=t.clientHeight*n.y,l=i*n.x,u=r*n.y;return{width:s,height:a,x:l,y:u}}function si(t,e,o){let r;if(e==="viewport"||e==="layoutViewport")r=Bn(t,o,e);else if(e==="document")r=Mn(lt(t));else if(et(e))r=In(e,o);else{let i=ci(t);r={x:e.x-i.x,y:e.y-i.y,width:e.width,height:e.height}}return Bt(r)}function Vn(t,e){let o=e.get(t);if(o)return o;let r=Yt(t,[],!1).filter(a=>et(a)&&Vt(a)!=="body"),i=null,n=ot(t).position==="fixed",s=n?$t(t):t;for(;et(s)&&!Kt(s);){let a=ot(s),l=Xt(s),u=i?i.position:n?"fixed":"";!l&&(u==="fixed"||u==="absolute"&&a.position==="static")?r=r.filter(c=>c!==s):i=a,s=$t(s)}return e.set(t,r),r}function Fn(t){let{element:e,boundary:o,rootBoundary:r,strategy:i}=t,s=[...o==="clippingAncestors"?_e(e)?[]:Vn(e,this._c):[].concat(o),r],a=si(e,s[0],i),l=a.top,u=a.right,h=a.bottom,c=a.left;for(let m=1;m<s.length;m++){let f=si(e,s[m],i);l=tt(f.top,l),u=nt(f.right,u),h=nt(f.bottom,h),c=tt(f.left,c)}return{width:u-c,height:h-l,x:c,y:l}}function Un(t){let{width:e,height:o}=li(t);return{width:e,height:o}}function Hn(t,e,o){let r=ft(e),i=lt(e),n=o==="fixed",s=Ft(t,!0,n,e),a={scrollLeft:0,scrollTop:0},l=st(0);if((r||!n)&&((Vt(e)!=="body"||we(i))&&(a=xe(e)),r)){let m=Ft(e,!0,n,e);l.x=m.x+e.clientLeft,l.y=m.y+e.clientTop}!r&&i&&(l.x=Ze(i));let u=i&&!r&&!n?hi(i,a):st(0),h=s.left+a.scrollLeft-l.x-u.x,c=s.top+a.scrollTop-l.y-u.y;return{x:h,y:c,width:s.width,height:s.height}}function So(t){return ot(t).position==="static"}function ai(t,e){if(!ft(t)||ot(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return lt(t)===o&&(o=o.ownerDocument.body),o}function pi(t,e){let o=I(t);if(_e(t))return o;if(!ft(t)){let i=$t(t);for(;i&&!Kt(i);){if(et(i)&&!So(i))return i;i=$t(i)}return o}let r=ai(t,e);for(;r&&ri(r)&&So(r);)r=ai(r,e);return r&&Kt(r)&&So(r)&&!Xt(r)?o:r||ii(t)||o}var Wn=async function(t){let e=this.getOffsetParent||pi,o=this.getDimensions,r=await o(t.floating);return{reference:Hn(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function qn(t){return ot(t).direction==="rtl"}var Ce={convertOffsetParentRelativeRectToViewportRelativeRect:zn,getDocumentElement:lt,getClippingRect:Fn,getOffsetParent:pi,getElementRects:Wn,getClientRects:Dn,getDimensions:Un,getScale:Jt,isElement:et,isRTL:qn};function ui(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function jn(t,e,o){let r=null,i,n=lt(t);function s(){var h;clearTimeout(i),(h=r)==null||h.disconnect(),r=null}function a(h,c){h===void 0&&(h=!1),c===void 0&&(c=1),s();let m=t.getBoundingClientRect(),{left:f,top:d,width:v,height:y}=m;if(h||e(),!v||!y)return;let b=be(d),w=be(n.clientWidth-(f+v)),_=be(n.clientHeight-(d+y)),x=be(f),$={rootMargin:-b+"px "+-w+"px "+-_+"px "+-x+"px",threshold:tt(0,nt(1,c))||1},R=!0;function B(rt){let D=rt[0].intersectionRatio;if(!ui(m,t.getBoundingClientRect()))return a();if(D!==c){if(!R)return a();D?a(!1,D):i=setTimeout(()=>{a(!1,1e-7)},1e3)}R=!1}try{r=new IntersectionObserver(B,{...$,root:n.ownerDocument})}catch{r=new IntersectionObserver(B,$)}r.observe(t)}let l=I(t),u=()=>a(o);return l.addEventListener("resize",u),a(!0),()=>{l.removeEventListener("resize",u),s()}}function di(t,e,o,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,u=To(t),h=i||n?[...u?Yt(u):[],...e?Yt(e):[]]:[];h.forEach(b=>{i&&b.addEventListener("scroll",o),n&&b.addEventListener("resize",o)});let c=u&&a?jn(u,o,n):null,m=-1,f=null;s&&(f=new ResizeObserver(b=>{let[w]=b;w&&w.target===u&&f&&e&&(f.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var _;(_=f)==null||_.observe(e)})),o()}),u&&!l&&f.observe(u),e&&f.observe(e));let d,v=l?Ft(t):null;l&&y();function y(){let b=Ft(t);v&&!ui(v,b)&&o(),v=b,d=requestAnimationFrame(y)}return o(),()=>{var b;h.forEach(w=>{i&&w.removeEventListener("scroll",o),n&&w.removeEventListener("resize",o)}),c?.(),(b=f)==null||b.disconnect(),f=null,l&&cancelAnimationFrame(d)}}var fi=Zr;var mi=Qr,gi=Gr,Po=ti;var vi=Jr;var yi=(t,e,o)=>{let r=new Map,i=o??{},n={...Ce,...i.platform,_c:r};return Kr(t,e,{...i,platform:n})};var mt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Qe=t=>(...e)=>({_$litDirective$:t,values:e}),Gt=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,r){this._$Ct=e,this._$AM=o,this._$Ci=r}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var q=Qe(class extends Gt{constructor(t){if(super(t),t.type!==mt.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in e)e[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(e)}let o=t.element.classList;for(let r of this.st)r in e||(o.remove(r),this.st.delete(r));for(let r in e){let i=!!e[r];i===this.st.has(r)||this.nt?.has(r)||(i?(o.add(r),this.st.add(r)):(o.remove(r),this.st.delete(r)))}return H}});function bi(t){return Yn(t)}function Ro(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Yn(t){for(let e=t;e;e=Ro(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Ro(t);e;e=Ro(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||Xt(o)||e.tagName==="BODY"))return e}return null}function Xn(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var k=class extends M{constructor(){super(...arguments),this.localize=new Ct(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),r=0,i=0,n=0,s=0,a=0,l=0,u=0,h=0;o?t.top<e.top?(r=t.left,i=t.bottom,n=t.right,s=t.bottom,a=e.left,l=e.top,u=e.right,h=e.top):(r=e.left,i=e.bottom,n=e.right,s=e.bottom,a=t.left,l=t.top,u=t.right,h=t.top):t.left<e.left?(r=t.right,i=t.top,n=e.left,s=e.top,a=t.right,l=t.bottom,u=e.left,h=e.bottom):(r=e.right,i=e.top,n=t.left,s=t.top,a=e.right,l=e.bottom,u=t.left,h=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${u}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Xn(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=di(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[fi({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Po({apply:({rects:o})=>{let r=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=i?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(gi({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(mi({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Po({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(vi({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>Ce.getOffsetParent(o,bi):Ce.getOffsetParent;yi(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:xt(Y({},Ce),{getOffsetParent:e})}).then(({x:o,y:r,middlewareData:i,placement:n})=>{let s=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){let l=i.arrow.x,u=i.arrow.y,h="",c="",m="",f="";if(this.arrowPlacement==="start"){let d=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",c=s?d:"",f=s?"":d}else if(this.arrowPlacement==="end"){let d=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";c=s?"":d,f=s?d:"",m=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(f=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof u=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(f=typeof l=="number"?`${l}px`:"",h=typeof u=="number"?`${u}px`:"");Object.assign(this.arrowEl.style,{top:h,right:c,bottom:m,left:f,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return P`
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
    `}};k.styles=[K,Mr];p([W(".popup")],k.prototype,"popup",2);p([W(".popup__arrow")],k.prototype,"arrowEl",2);p([g()],k.prototype,"anchor",2);p([g({type:Boolean,reflect:!0})],k.prototype,"active",2);p([g({reflect:!0})],k.prototype,"placement",2);p([g({reflect:!0})],k.prototype,"strategy",2);p([g({type:Number})],k.prototype,"distance",2);p([g({type:Number})],k.prototype,"skidding",2);p([g({type:Boolean})],k.prototype,"arrow",2);p([g({attribute:"arrow-placement"})],k.prototype,"arrowPlacement",2);p([g({attribute:"arrow-padding",type:Number})],k.prototype,"arrowPadding",2);p([g({type:Boolean})],k.prototype,"flip",2);p([g({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],k.prototype,"flipFallbackPlacements",2);p([g({attribute:"flip-fallback-strategy"})],k.prototype,"flipFallbackStrategy",2);p([g({type:Object})],k.prototype,"flipBoundary",2);p([g({attribute:"flip-padding",type:Number})],k.prototype,"flipPadding",2);p([g({type:Boolean})],k.prototype,"shift",2);p([g({type:Object})],k.prototype,"shiftBoundary",2);p([g({attribute:"shift-padding",type:Number})],k.prototype,"shiftPadding",2);p([g({attribute:"auto-size"})],k.prototype,"autoSize",2);p([g()],k.prototype,"sync",2);p([g({type:Object})],k.prototype,"autoSizeBoundary",2);p([g({attribute:"auto-size-padding",type:Number})],k.prototype,"autoSizePadding",2);p([g({attribute:"hover-bridge",type:Boolean})],k.prototype,"hoverBridge",2);var _i=new Map,Kn=new WeakMap;function Jn(t){return t??{keyframes:[],options:{duration:0}}}function wi(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Lo(t,e){_i.set(t,Jn(e))}function Oo(t,e,o){let r=Kn.get(t);if(r?.[e])return wi(r[e],o.dir);let i=_i.get(e);return i?wi(i,o.dir):{keyframes:[],options:{duration:0}}}function zo(t,e){return new Promise(o=>{function r(i){i.target===t&&(t.removeEventListener(e,r),o())}t.addEventListener(e,r)})}function Do(t,e,o){return new Promise(r=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let i=t.animate(e,xt(Y({},o),{duration:Gn()?0:o.duration}));i.addEventListener("cancel",r,{once:!0}),i.addEventListener("finish",r,{once:!0})})}function Gn(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Mo(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}function N(t,e){let o=Y({waitUntilFirstUpdate:!1},e);return(r,i)=>{let{update:n}=r,s=Array.isArray(t)?t:[t];r.update=function(a){s.forEach(l=>{let u=l;if(a.has(u)){let h=a.get(u),c=this[u];h!==c&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[i](h,c)}}),n.call(this,a)}}}var S=t=>t??T;var z=class extends M{constructor(){super(...arguments),this.localize=new Ct(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(r,i)=>{if(!r)return null;let n=r.closest(i);if(n)return n;let s=r.getRootNode();return s instanceof ShadowRoot?o(s.host,i):null};setTimeout(()=>{var r;let i=((r=this.containingElement)==null?void 0:r.getRootNode())instanceof ShadowRoot?Or():document.activeElement;(!this.containingElement||o(i,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),r=o[0],i=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(r),r.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(i),i.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(r=>Dr(r).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,zo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,zo(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await Mo(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=Oo(this,"dropdown.show",{dir:this.localize.dir()});await Do(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await Mo(this);let{keyframes:t,options:e}=Oo(this,"dropdown.hide",{dir:this.localize.dir()});await Do(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return P`
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
    `}};z.styles=[K,xr];z.dependencies={"sl-popup":k};p([W(".dropdown")],z.prototype,"popup",2);p([W(".dropdown__trigger")],z.prototype,"trigger",2);p([W(".dropdown__panel")],z.prototype,"panel",2);p([g({type:Boolean,reflect:!0})],z.prototype,"open",2);p([g({reflect:!0})],z.prototype,"placement",2);p([g({type:Boolean,reflect:!0})],z.prototype,"disabled",2);p([g({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],z.prototype,"stayOpenOnSelect",2);p([g({attribute:!1})],z.prototype,"containingElement",2);p([g({type:Number})],z.prototype,"distance",2);p([g({type:Number})],z.prototype,"skidding",2);p([g({type:Boolean})],z.prototype,"hoist",2);p([g({reflect:!0})],z.prototype,"sync",2);p([N("open",{waitUntilFirstUpdate:!0})],z.prototype,"handleOpenChange",1);Lo("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});Lo("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});z.define("sl-dropdown");var xi=O`
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
`;var Zt=(t="value")=>(e,o)=>{let r=e.constructor,i=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(n,s,a){var l;let u=r.getPropertyOptions(t),h=typeof u.attribute=="string"?u.attribute:t;if(n===h){let c=u.converter||wt,f=(typeof c=="function"?c:(l=c?.fromAttribute)!=null?l:wt.fromAttribute)(a,u.type);this[t]!==f&&(this[o]=f)}i.call(this,n,s,a)}};var Qt=O`
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
`;var ke=new WeakMap,$e=new WeakMap,Ae=new WeakMap,No=new WeakSet,to=new WeakMap,te=class{constructor(t,e){this.handleFormData=o=>{let r=this.options.disabled(this.host),i=this.options.name(this.host),n=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!r&&!s&&typeof i=="string"&&i.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(a=>{o.formData.append(i,a.toString())}):o.formData.append(i,n.toString()))},this.handleFormSubmit=o=>{var r;let i=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((r=ke.get(this.form))==null||r.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!i&&!n(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),to.set(this.host,[])},this.handleInteraction=o=>{let r=to.get(this.host);r.includes(o.type)||r.push(o.type),r.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let r of o)if(typeof r.checkValidity=="function"&&!r.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let r of o)if(typeof r.reportValidity=="function"&&!r.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Y({form:o=>{let r=o.form;if(r){let n=o.getRootNode().querySelector(`#${r}`);if(n)return n}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var r;return(r=o.disabled)!=null?r:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,r)=>o.value=r,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),to.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),to.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,ke.has(this.form)?ke.get(this.form).add(this.host):ke.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),$e.has(this.form)||($e.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Ae.has(this.form)||(Ae.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=ke.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),$e.has(this.form)&&(this.form.reportValidity=$e.get(this.form),$e.delete(this.form)),Ae.has(this.form)&&(this.form.checkValidity=Ae.get(this.form),Ae.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?No.add(t):No.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(r=>{e.hasAttribute(r)&&o.setAttribute(r,e.getAttribute(r))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!No.has(e),r=!!e.required;e.toggleAttribute("data-required",r),e.toggleAttribute("data-optional",!r),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},Ci=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),Rc=Object.freeze(xt(Y({},Ci),{valid:!1,valueMissing:!0})),Lc=Object.freeze(xt(Y({},Ci),{valid:!1,customError:!0}));var ee=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let r=o.target;(this.slotNames.includes("[default]")&&!r.name||r.name&&this.slotNames.includes(r.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};var Bo="";function ki(t){Bo=t}function $i(t=""){if(!Bo){let e=[...document.getElementsByTagName("script")],o=e.find(r=>r.hasAttribute("data-shoelace"));if(o)ki(o.getAttribute("data-shoelace"));else{let r=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)),i="";r&&(i=r.getAttribute("src")),ki(i.split("/").slice(0,-1).join("/"))}}return Bo.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Zn={name:"default",resolver:t=>$i(`assets/icons/${t}.svg`)},Ai=Zn;var Ei={caret:`
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
  `},Qn={name:"system",resolver:t=>t in Ei?`data:image/svg+xml,${encodeURIComponent(Ei[t])}`:""},Si=Qn;var ts=[Ai,Si],Io=[];function Ti(t){Io.push(t)}function Pi(t){Io=Io.filter(e=>e!==t)}function Vo(t){return ts.find(e=>e.name===t)}var Ri=O`
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
`;var{I:Yc}=wr;var Li=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var Oi=t=>t.strings===void 0;var es={},zi=(t,e=es)=>t._$AH=e;var Ee=Symbol(),eo=Symbol(),Fo,Uo=new Map,J=class extends M{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let r;if(e?.spriteSheet)return this.svg=P`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(r=await fetch(t,{mode:"cors"}),!r.ok)return r.status===410?Ee:eo}catch{return eo}try{let i=document.createElement("div");i.innerHTML=await r.text();let n=i.firstElementChild;if(((o=n?.tagName)==null?void 0:o.toLowerCase())!=="svg")return Ee;Fo||(Fo=new DOMParser);let a=Fo.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Ee}catch{return Ee}}connectedCallback(){super.connectedCallback(),Ti(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Pi(this)}getIconSource(){let t=Vo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),r=o?Vo(this.library):void 0;if(!e){this.svg=null;return}let i=Uo.get(e);if(i||(i=this.resolveIcon(e,r),Uo.set(e,i)),!this.initialRender)return;let n=await i;if(n===eo&&Uo.delete(e),e===this.getIconSource().url){if(Li(n)){if(this.svg=n,r){await this.updateComplete;let s=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&s&&r.mutator(s)}return}switch(n){case eo:case Ee:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=r?.mutator)==null||t.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};J.styles=[K,Ri];p([dt()],J.prototype,"svg",2);p([g({reflect:!0})],J.prototype,"name",2);p([g()],J.prototype,"src",2);p([g()],J.prototype,"label",2);p([g({reflect:!0})],J.prototype,"library",2);p([N("label")],J.prototype,"handleLabelChange",1);p([N(["name","src","library"])],J.prototype,"setIcon",1);var Ut=Qe(class extends Gt{constructor(t){if(super(t),t.type!==mt.PROPERTY&&t.type!==mt.ATTRIBUTE&&t.type!==mt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Oi(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===H||e===T)return e;let o=t.element,r=t.name;if(t.type===mt.PROPERTY){if(e===o[r])return H}else if(t.type===mt.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(r))return H}else if(t.type===mt.ATTRIBUTE&&o.getAttribute(r)===e+"")return H;return zi(t),e}});var C=class extends M{constructor(){super(...arguments),this.formControlController=new te(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new ee(this,"help-text","label"),this.localize=new Ct(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,r="preserve"){let i=e??this.input.selectionStart,n=o??this.input.selectionEnd;this.input.setRangeText(t,i,n,r),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,r=this.helpText?!0:!!e,n=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return P`
      <div
        part="form-control"
        class=${q({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":r})}
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
          aria-hidden=${r?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};C.styles=[K,Qt,xi];C.dependencies={"sl-icon":J};p([W(".input__control")],C.prototype,"input",2);p([dt()],C.prototype,"hasFocus",2);p([g()],C.prototype,"title",2);p([g({reflect:!0})],C.prototype,"type",2);p([g()],C.prototype,"name",2);p([g()],C.prototype,"value",2);p([Zt()],C.prototype,"defaultValue",2);p([g({reflect:!0})],C.prototype,"size",2);p([g({type:Boolean,reflect:!0})],C.prototype,"filled",2);p([g({type:Boolean,reflect:!0})],C.prototype,"pill",2);p([g()],C.prototype,"label",2);p([g({attribute:"help-text"})],C.prototype,"helpText",2);p([g({type:Boolean})],C.prototype,"clearable",2);p([g({type:Boolean,reflect:!0})],C.prototype,"disabled",2);p([g()],C.prototype,"placeholder",2);p([g({type:Boolean,reflect:!0})],C.prototype,"readonly",2);p([g({attribute:"password-toggle",type:Boolean})],C.prototype,"passwordToggle",2);p([g({attribute:"password-visible",type:Boolean})],C.prototype,"passwordVisible",2);p([g({attribute:"no-spin-buttons",type:Boolean})],C.prototype,"noSpinButtons",2);p([g({reflect:!0})],C.prototype,"form",2);p([g({type:Boolean,reflect:!0})],C.prototype,"required",2);p([g()],C.prototype,"pattern",2);p([g({type:Number})],C.prototype,"minlength",2);p([g({type:Number})],C.prototype,"maxlength",2);p([g()],C.prototype,"min",2);p([g()],C.prototype,"max",2);p([g()],C.prototype,"step",2);p([g()],C.prototype,"autocapitalize",2);p([g()],C.prototype,"autocorrect",2);p([g()],C.prototype,"autocomplete",2);p([g({type:Boolean})],C.prototype,"autofocus",2);p([g()],C.prototype,"enterkeyhint",2);p([g({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],C.prototype,"spellcheck",2);p([g()],C.prototype,"inputmode",2);p([N("disabled",{waitUntilFirstUpdate:!0})],C.prototype,"handleDisabledChange",1);p([N("step",{waitUntilFirstUpdate:!0})],C.prototype,"handleStepChange",1);p([N("value",{waitUntilFirstUpdate:!0})],C.prototype,"handleValueChange",1);C.define("sl-input");var Di=O`
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
`;var L=class extends M{constructor(){super(...arguments),this.formControlController=new te(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new ee(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return P`
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
    `}};L.styles=[K,Qt,Di];L.dependencies={"sl-icon":J};p([W('input[type="checkbox"]')],L.prototype,"input",2);p([dt()],L.prototype,"hasFocus",2);p([g()],L.prototype,"title",2);p([g()],L.prototype,"name",2);p([g()],L.prototype,"value",2);p([g({reflect:!0})],L.prototype,"size",2);p([g({type:Boolean,reflect:!0})],L.prototype,"disabled",2);p([g({type:Boolean,reflect:!0})],L.prototype,"checked",2);p([g({type:Boolean,reflect:!0})],L.prototype,"indeterminate",2);p([Zt("checked")],L.prototype,"defaultChecked",2);p([g({reflect:!0})],L.prototype,"form",2);p([g({type:Boolean,reflect:!0})],L.prototype,"required",2);p([g({attribute:"help-text"})],L.prototype,"helpText",2);p([N("disabled",{waitUntilFirstUpdate:!0})],L.prototype,"handleDisabledChange",1);p([N(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],L.prototype,"handleStateChange",1);L.define("sl-checkbox");var Mi=O`
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
`;var A=class extends M{constructor(){super(...arguments),this.formControlController=new te(this),this.hasSlotController=new ee(this,"help-text","label"),this.localize=new Ct(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=t=>t.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(t){this.input.style.setProperty("--percent",`${t*100}%`)}syncTooltip(t){if(this.output!==null){let e=this.input.offsetWidth,o=this.output.offsetWidth,r=getComputedStyle(this.input).getPropertyValue("--thumb-size"),i=this.localize.dir()==="rtl",n=e*t;if(i){let s=`${e-n}px + ${t} * ${r}`;this.output.style.translate=`calc((${s} - ${o/2}px - ${r} / 2))`}else{let s=`${n}px - ${t} * ${r}`;this.output.style.translate=`calc(${s} - ${o/2}px + ${r} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){let t=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(t),this.tooltip!=="none"&&this.hasTooltip&&this.updateComplete.then(()=>this.syncTooltip(t))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}focus(t){this.input.focus(t)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,r=this.helpText?!0:!!e;return P`
      <div
        part="form-control"
        class=${q({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":r})}
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
          aria-hidden=${r?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};A.styles=[K,Qt,Mi];p([W(".range__control")],A.prototype,"input",2);p([W(".range__tooltip")],A.prototype,"output",2);p([dt()],A.prototype,"hasFocus",2);p([dt()],A.prototype,"hasTooltip",2);p([g()],A.prototype,"title",2);p([g()],A.prototype,"name",2);p([g({type:Number})],A.prototype,"value",2);p([g()],A.prototype,"label",2);p([g({attribute:"help-text"})],A.prototype,"helpText",2);p([g({type:Boolean,reflect:!0})],A.prototype,"disabled",2);p([g({type:Number})],A.prototype,"min",2);p([g({type:Number})],A.prototype,"max",2);p([g({type:Number})],A.prototype,"step",2);p([g()],A.prototype,"tooltip",2);p([g({attribute:!1})],A.prototype,"tooltipFormatter",2);p([g({reflect:!0})],A.prototype,"form",2);p([Zt()],A.prototype,"defaultValue",2);p([Fr({passive:!0})],A.prototype,"handleThumbDragStart",1);p([N("value",{waitUntilFirstUpdate:!0})],A.prototype,"handleValueChange",1);p([N("disabled",{waitUntilFirstUpdate:!0})],A.prototype,"handleDisabledChange",1);p([N("hasTooltip",{waitUntilFirstUpdate:!0})],A.prototype,"syncRange",1);A.define("sl-range");var vt=["#00aaff","#ff4444","#44dd44","#ffaa00","#cc44ff","#ff44aa"],Ho=600,os=document.getElementById("bg").getContext("2d",{alpha:!1}),Et=document.getElementById("fg").getContext("2d",{alpha:!0}),rs=document.getElementById("overlays").getContext("2d"),is=document.getElementById("msg"),Wo=document.getElementById("waiting"),ns=document.getElementById("waiting-players"),ss=document.getElementById("end"),as=document.getElementById("end-label"),ls=document.getElementById("end-winner"),cs=document.getElementById("end-detail"),hs=document.getElementById("replay-controls"),ps=document.getElementById("replay-slider"),Vi=document.getElementById("replay-time"),us=document.getElementById("replay-play"),Ni=document.getElementById("result-label"),Bi=document.getElementById("result-winner"),Ko=document.getElementById("player-search-input"),ds=document.getElementById("player-options"),qo=document.getElementById("player-list"),oo=document.getElementById("decision-interval"),Ii=document.getElementById("debug-tick"),fs=document.getElementById("inspection-help"),V=[],F=!1,Wt=!1,yt=!1,j=!0,io=!0,Le=null,Se=null,Fi=null,jo=0,Pe=[],X=[],G,se,Oe,ao,Yo=[],Ui=[],Te={},gt={arena_size:80,radius:.6,tick_hz:60},oe=null,ie=!1,Xo="s",ms=new Set([" ","arrowleft","arrowright","r"]),ae,gs=document.querySelector('meta[name="play-server"]').content.trim(),Jo=new URL(gs||location.origin),Hi=new URL("/ws",Jo);Hi.protocol=Jo.protocol==="https:"?"wss:":"ws:";var U,Wi=!1;Et.imageSmoothingEnabled=!0;function lo(){ao?.reset(),se?.reset(),Oe?.reset(),Le=null,Se=null,Fi=null,Pe=[],ie=!1,Et.canvas.style.cursor=""}function Ht(t=null){Ii.textContent=t===null?"":`\xB7 tick ${t}`,Ii.classList.toggle("hidden",t===null)}function At(t){return t==="you"?"You":t.startsWith("ckpt:")?ae.labelFor(t)?ae.labelFor(t):t.slice(5).split(/[\\/]/).pop().replace(/\.safetensors$/,""):t.replaceAll("_"," ")}function qi(){Yo=V.map((t,e)=>{let o=document.createElement("div");o.className=`player${j&&t==="you"?" local":""}`,o.style.setProperty("--player-color",vt[e%vt.length]);let r=document.createElement("span");r.className="line-color-preview";let i=document.createElement("sl-dropdown");i.className="player-settings-dropdown",i.placement="bottom-start",i.hoist=!0,i.stayOpenOnSelect=!0;let n=document.createElement("button");n.className="player-settings",n.type="button",n.textContent="\u2699",n.title=`Options for ${At(t)}`,n.setAttribute("aria-label",`Options for ${At(t)}`),n.slot="trigger";let s=document.createElement("span");s.className="player-name",s.textContent=At(t),s.title=At(t),s.addEventListener("wheel",l=>{if(s.scrollWidth<=s.clientWidth)return;let u=l.deltaX||l.deltaY,h=s.scrollWidth-s.clientWidth,c=Math.max(0,Math.min(h,s.scrollLeft+u));c!==s.scrollLeft&&(s.scrollLeft=c,l.preventDefault())},{passive:!1});let a=document.createElement("button");return a.className=`player-remove${V.length>1?"":" hidden"}`,a.type="button",a.textContent="\xD7",a.title=`Remove ${At(t)}`,a.setAttribute("aria-label",`Remove ${At(t)}`),a.addEventListener("click",()=>ws(e)),i.append(n,vs(e)),o.append(r,i,s,a),{element:o,dead:null}}),qo.replaceChildren(...Yo.map(t=>t.element)),ns.replaceChildren(...V.map((t,e)=>{let o=document.createElement("li");return o.textContent=At(t),o.style.color=vt[e%vt.length],o})),qo.classList.toggle("locked",F)}function vs(t){let e=document.createElement("div");e.className="player-settings-menu";let o=Ui[t]||{};[["lidar","Show lidar"],["value","Show value glow"]].forEach(([n,s])=>{let a=document.createElement("sl-checkbox");a.checked=!!Te[t]?.[n],a.disabled=!o[n],a.textContent=o[n]?s:`${s} unavailable`,a.addEventListener("sl-change",()=>{Te[t]={...Te[t],[n]:a.checked},ys(),Oe.draw(Le)}),e.append(a)});let i=document.createElement("p");return i.className="player-settings-note",i.textContent="Lidar shows measured directional clearance.",e.append(i),e}function ys(){U.readyState===WebSocket.OPEN&&U.send(JSON.stringify({type:"visuals",visuals:Te}))}function re(t){Ko.disabled=t,qo.classList.toggle("locked",t),t&&ae.hide()}function no(t,e){F||!t&&!e.length||(j=t,V=j?["you",...e]:[...e],Wt=!1,oe=null,qi(),so(),Re("Loading players..."),U.send(JSON.stringify({type:"configure",human:j,specs:e})))}function bs(t){Ko.value="",ae.hide();let e=j?V.slice(1):V.slice();if(t==="you"){j||no(!0,e);return}no(j,[...e,t])}function ws(t){if(F||V.length<=1)return;if(j&&V[t]==="you"){no(!1,V.slice(1));return}let e=j?V.slice(1):V.slice();e.splice(j?t-1:t,1),no(j,e)}function Go(t){t.forEach((e,o)=>{let r=Yo[o];if(!r)return;let i=!e.alive;r.dead!==i&&(r.dead=i,r.element.classList.toggle("dead",i))})}function ji(t,e,o,r=null){r==="won"?(t.textContent="WIN",e.textContent=""):r==="lost"?(t.textContent="LOST",e.textContent=""):r==="tied"?(t.textContent="TIE",e.textContent=""):(t.textContent=o<0?"TIE":"WINNER: ",e.textContent=o<0?"":At(V[o])),e.style.color=o<0?"":vt[o%vt.length]}function _s(t,e){t.textContent="",e.textContent="",e.style.color=""}function Re(t,e=null){e===null?_s(Ni,Bi):ji(Ni,Bi,e),is.textContent=t,Wo.classList.toggle("has-result",e!==null),Wo.classList.remove("hidden")}function ro(){Wo.classList.add("hidden")}function xs(t,e,o){ji(as,ls,t,o),cs.textContent=e,hs.classList.toggle("hidden",X.length===0),G.show(X)}function so(){G.hide()}function Yi(t){let e=X[t];if(e){lo();for(let o=1;o<=t;o++){let r=X[o-1];X[o].players.forEach((n,s)=>ao.drawSegment(r.players[s],n,s))}se.draw(e.players),Oe.draw(e),Le=e,Se=e,Go(e.players),Vi.textContent=`${(e.tick/gt.tick_hz).toFixed(1)}s \xB7 tick ${e.tick}`}}G=Qo({end:ss,slider:ps,time:Vi,playButton:us,render:Yi,tickHz:()=>gt.tick_hz});function Cs(t){Fi=t,Pe[0]=t,Pe.length=1,X.push(t),Zo()}function ks(){if(jo=0,!F)return;let t=Pe.pop();t&&(Se&&t.players.forEach((e,o)=>ao.drawSegment(Se.players[o],e,o)),Se=t,Oe.draw(t),se.clear(),se.draw(t.players),Le=t,Go(t.players),Pe.length&&Zo())}function Zo(){jo||(jo=requestAnimationFrame(ks))}function $s(t){Wi=!0;let e=JSON.parse(t.data);if(e.type==="config")V=e.seats,j=e.human??V.includes("you"),io=e.rewind??!0,fs.textContent=io?"Space stops at the next boundary. Then \u2190, \u2191, \u2192, N, and R inspect one tick at a time. C lets you click a controller target.":"Space stops at the next boundary. Then \u2190, \u2191, \u2192, and N inspect one tick at a time. C lets you click a controller target.",e.catalog&&ae.setCatalog(e.catalog),gt={...gt,...e.simulator},oo.value=e.decision_interval??16,Ui=e.visuals||[],Te={},G.hide(),se=tr({context:Et,colors:vt,size:Ho,simulator:()=>gt}),Oe=er({context:rs,colors:vt,size:Ho,simulator:()=>gt}),ao=or({context:os,colors:vt,size:Ho,simulator:()=>gt}),se.setPlayers(V.length),lo(),Ht(),qi(),re(!1),oe=null,Re("Waiting for players...");else if(e.type==="ready")Wt=!0,re(!1),G.active||(so(),Re(`Press ${Xo} to start`,oe)),oe=null;else if(e.type==="frame")Cs(e);else if(e.type==="paused")yt=!0,Ht(e.ticks),ro();else if(e.type==="resumed")yt=!1,Ht(),ro();else if(e.type==="rewound"){F=!0,yt=!0,Wt=!1,re(!0),ro(),so();let o=e.frame;X=X.filter(r=>r.tick<=o.tick),(!X.length||X.at(-1).tick!==o.tick)&&X.push(o),Yi(X.length-1),Ht(o.tick)}else e.type==="end"&&(F=!1,yt=!1,Ht(),re(!1),Go(e.players||Le?.players||[]),oe=e.winner,xs(e.winner,`${e.ticks} ticks. Drag the timeline to review, or press ${Xo} to play again.`,e.outcome))}function As(){if(!Wi){Re("Starting server..."),setTimeout(Xi,1e3);return}F=!1,yt=!1,Ht(),re(!1),Re("Disconnected")}function Xi(){U=new WebSocket(Hi),U.onmessage=$s,U.onclose=As}var ne=new Set;function Ki(){let t=ne.has("ArrowLeft"),e=ne.has("ArrowRight"),o=ne.has("ArrowUp")||t&&e?1:t?2:e?0:1;U.send(JSON.stringify({type:"input",action:o}))}function Es(){!Wt||F||(F=!0,yt=!1,Ht(),re(!0),Wt=!1,oe=null,X=[],G.hide(),lo(),ro(),so(),Zo(),U.send(JSON.stringify({type:"start"})))}Et.canvas.addEventListener("click",t=>{if(!ie||!yt||!j)return;let e=Et.canvas.getBoundingClientRect(),o=(t.clientX-e.left)/e.width*gt.arena_size,r=(1-(t.clientY-e.top)/e.height)*gt.arena_size;ie=!1,Et.canvas.style.cursor="",U.send(JSON.stringify({type:"controller_target",x:o,y:r})),t.preventDefault()});ae=rr({input:Ko,options:ds,locked:()=>F,onSelect:bs,playersUrl:new URL("/players",Jo)});oo.addEventListener("sl-change",()=>{let t=Math.max(1,Math.min(1e4,Number.parseInt(oo.value,10)||16));oo.value=t,U.send(JSON.stringify({type:"settings",decision_interval:t}))});function Ss(t){return t.composedPath().some(e=>e instanceof Element&&e.matches("input, textarea, [contenteditable], sl-input, sl-range, button, sl-button"))}function Ts(t){return G.active&&t.repeat&&ms.has(t.key.toLowerCase())}addEventListener("keydown",t=>{if(!Ss(t)){if(Ts(t)){t.preventDefault();return}if(t.key.toLowerCase()===Xo&&Wt&&!F&&(Es(),t.preventDefault()),t.key===" "){if(ie){ie=!1,Et.canvas.style.cursor="",t.preventDefault();return}G.active?G.toggle():F&&U.send(JSON.stringify({type:yt?"continue":"break"})),t.preventDefault();return}if(G.active&&(t.key==="ArrowLeft"||t.key==="ArrowRight")){G.step(t.key==="ArrowLeft"?-1:1),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&io&&G.active&&!F){F=!0,Wt=!1,U.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}if(F&&yt){if(t.key.toLowerCase()==="c"&&j&&!t.repeat){ie=!0,Et.canvas.style.cursor="crosshair",t.preventDefault();return}let e={ArrowLeft:2,ArrowUp:1,ArrowRight:0}[t.key];if(e!==void 0){U.send(JSON.stringify({type:"step",action:e})),t.preventDefault();return}if(t.key.toLowerCase()==="n"&&!t.repeat){U.send(JSON.stringify({type:"next"})),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&io){U.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}}(t.key==="ArrowLeft"||t.key==="ArrowUp"||t.key==="ArrowRight")&&(ne.has(t.key)||(ne.add(t.key),Ki()),t.preventDefault())}});addEventListener("keyup",t=>{ne.delete(t.key)&&Ki()});Xi();lo();
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
