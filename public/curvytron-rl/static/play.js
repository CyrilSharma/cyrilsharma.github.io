function xi({end:t,slider:e,time:o,playButton:i,render:r,tickHz:n}){let s=t.firstElementChild,l=[],a=!1,u=!1,h=0,c=0,f=null;function d(y){u=y&&l.length>1,i.textContent=u?"Pause":"Play",c=0,u&&!h&&(h=requestAnimationFrame(g))}function g(y){if(h=0,!!u){if(!c||y-c<1e3/n()){c||=y,h=requestAnimationFrame(g);return}e.value=(Number(e.value)+1)%l.length,r(Number(e.value)),c=y,h=requestAnimationFrame(g)}}function v(y){l=y,a=!0;let w=Math.max(l.length-1,0);e.max=w,requestAnimationFrame(()=>{!a||l!==y||(e.value=w)}),t.classList.remove("hidden"),d(!1),l.length&&r(w)}function b(){a=!1,d(!1),t.classList.add("hidden")}return e.addEventListener("sl-input",()=>r(Number(e.value))),i.addEventListener("click",()=>d(!u)),s.addEventListener("pointerdown",y=>{if(y.target.closest("input, button, sl-range"))return;let w=s.getBoundingClientRect(),_=t.getBoundingClientRect(),x=w.left-_.left,k=w.top-_.top;s.style.left=`${x}px`,s.style.top=`${k}px`,s.style.transform="none",f={x:y.clientX,y:y.clientY,left:x,top:k},s.classList.add("dragging"),s.setPointerCapture(y.pointerId)}),s.addEventListener("pointermove",y=>{f&&(s.style.left=`${f.left+y.clientX-f.x}px`,s.style.top=`${f.top+y.clientY-f.y}px`)}),s.addEventListener("pointerup",()=>{f=null,s.classList.remove("dragging")}),{get active(){return a},hide:b,show:v,step(y){d(!1),e.value=(Number(e.value)+y+l.length)%l.length,r(Number(e.value))},toggle(){d(!u)}}}function Ci({context:t,colors:e,size:o,simulator:i}){let r=[];function n(c){return[c.x*o,(1-c.y)*o]}function s(c){let f=Math.max(2,i().radius*o/i().arena_size),d=Math.ceil(f*2),g=document.createElement("canvas");g.width=d,g.height=d;let v=g.getContext("2d");return v.beginPath(),v.arc(d/2,d/2,f,0,2*Math.PI),v.fillStyle=e[c%e.length],v.fill(),{canvas:g,radius:d/2,clearX:0,clearY:0,clearWidth:d}}function l(c){r=Array.from({length:c},(f,d)=>s(d))}function a(){t.clearRect(0,0,o,o),r.forEach(c=>{c.clearX=0,c.clearY=0,c.clearWidth=c.canvas.width})}function u(){r.forEach(c=>t.clearRect(c.clearX,c.clearY,c.clearWidth,c.clearWidth))}function h(c){c.forEach((f,d)=>{let g=r[d],[v,b]=n(f),y=v-g.radius,w=b-g.radius;t.drawImage(g.canvas,y,w),g.clearX=Math.floor(y)-1,g.clearY=Math.floor(w)-1,g.clearWidth=g.canvas.width+2})}return{clear:u,draw:h,reset:a,setPlayers:l}}function ki({context:t,colors:e,size:o,simulator:i}){function r(h){return[h.x*o,(1-h.y)*o]}function n(h,c){t.strokeStyle=c,t.fillStyle=c;let f=2*Math.PI/h.distances[0].length;h.points.forEach(([d,g],v)=>{let[b,y]=h.headings[v],w=Math.atan2(y,b),_=d*o/i().arena_size,x=(1-g/i().arena_size)*o;h.distances[v].forEach((k,A)=>{let L=w-Math.PI+(A+.5)*f,F=k*o/i().arena_size;t.globalAlpha=.05+.18*(k/h.max_distance),t.beginPath(),t.moveTo(_,x),t.arc(_,x,F,-L-f/2,-L+f/2),t.closePath(),t.fill(),t.globalAlpha=.35,t.beginPath(),t.moveTo(_,x),t.lineTo(_+Math.cos(L)*F,x-Math.sin(L)*F),t.stroke()}),t.globalAlpha=.95,t.beginPath(),t.arc(_,x,2,0,2*Math.PI),t.fill()})}function s(h,c,f){let d=h>=0,g=Math.tanh(Math.abs(h)),[v,b]=r(c),y=30+42*g,w=t.createRadialGradient(v,b,0,v,b,y);w.addColorStop(0,f),w.addColorStop(.28,f+"aa"),w.addColorStop(1,f+"00"),t.globalAlpha=d?.18+.72*g:.08+.18*g,t.fillStyle=w,t.beginPath(),t.arc(v,b,y,0,2*Math.PI),t.fill();let _=`V ${d?"+":"\u2212"}${Math.abs(h).toFixed(2)}`;t.globalAlpha=1,t.font="600 13px Lato, Helvetica, sans-serif";let x=t.measureText(_).width+12,k=Math.max(4,Math.min(o-x-4,v-x/2)),A=b<38?b+42:b-30;t.fillStyle="rgba(20, 20, 20, .8)",t.beginPath(),t.roundRect(k,A-15,x,20,5),t.fill(),t.fillStyle=d?f:"#aeb6c2",t.fillText(_,k+6,A)}function l(h,c,f){if(!h?.target||!c)return;let[d,g]=r(c),v=h.target[0]*o/i().arena_size,b=(1-h.target[1]/i().arena_size)*o;if(t.strokeStyle=f,t.fillStyle=f,t.globalAlpha=.9,t.setLineDash([7,5]),t.beginPath(),t.moveTo(d,g),t.lineTo(v,b),t.stroke(),t.setLineDash([]),t.beginPath(),t.arc(v,b,7,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(v-11,b),t.lineTo(v+11,b),t.moveTo(v,b-11),t.lineTo(v,b+11),t.stroke(),Number.isInteger(h.action)){let y=["R","S","L"];t.font="600 13px Lato, Helvetica, sans-serif",t.fillText(y[h.action],v+12,b-12)}}function a(){t.clearRect(0,0,o,o)}function u(h){a(),h&&(Object.entries(h.overlays||{}).forEach(([c,f])=>{let d=Number(c),g=e[d%e.length];f.lidar&&n(f.lidar,g),Number.isFinite(f.value)&&h.players[d]&&s(f.value,h.players[d],g)}),h.controller&&l(h.controller,h.players[0],e[0]),t.globalAlpha=1)}return{draw:u,reset:a}}function $i({context:t,colors:e,size:o,simulator:i}){t.lineCap="round";function r(l){return[l.x*o,(1-l.y)*o]}function n(){t.fillStyle="#222222",t.fillRect(0,0,o,o)}function s(l,a,u){if(!a.alive||!a.trail_active||!l?.alive||!l.trail_active)return;let[h,c]=r(l),[f,d]=r(a);t.strokeStyle=e[u%e.length],t.lineWidth=Math.max(2,i().radius*o/i().arena_size*2),t.beginPath(),t.moveTo(h,c),t.lineTo(f,d),t.stroke()}return{drawSegment:s,reset:n}}function Ai({input:t,options:e,locked:o,onSelect:i,initialCatalog:r=[],playersUrl:n="/players"}){let s=[],l="",a=-1,u=new Map;function h(v){return u.get(v)}function c(){a=-1,e.replaceChildren(),e.classList.add("hidden"),t.setAttribute("aria-expanded","false")}function f(){if(o()||!s.length){c();return}let v=t.value.trim().toLowerCase(),b=s.filter(y=>`${y.label} ${y.spec}`.toLowerCase().includes(v));e.replaceChildren(...b.map((y,w)=>{let _=document.createElement("button");_.className="player-option",_.type="button",_.dataset.spec=y.spec,_.setAttribute("role","option"),_.setAttribute("aria-selected",w===a?"true":"false"),w===a&&_.classList.add("active");let x=document.createElement("span");x.className="player-option-name",x.textContent=y.label;let k=document.createElement("span");return k.className="player-option-kind",k.textContent=y.kind,_.title=y.label,_.append(x,k),_})),e.classList.toggle("hidden",b.length===0),t.setAttribute("aria-expanded",b.length>0?"true":"false")}function d(v){if(!Array.isArray(v))return;let b=v.map(y=>`${y.spec}
${y.label}
${y.kind}`).join(`
`);b!==l&&(s=v,l=b,u=new Map(v.filter(y=>y.kind==="checkpoint").map(y=>[y.spec,y.label])),a=-1,e.classList.contains("hidden")||f())}async function g(){try{let v=await fetch(n,{cache:"no-store"});v.ok&&d(await v.json())}catch{}}return t.addEventListener("sl-focus",f),t.addEventListener("sl-input",()=>{a=-1,f()}),t.addEventListener("keydown",v=>{let b=[...e.querySelectorAll(".player-option")];if(v.key==="ArrowDown"||v.key==="ArrowUp"){if(!b.length)return;a=(a+(v.key==="ArrowDown"?1:b.length-1))%b.length,f(),v.preventDefault()}else v.key==="Enter"&&a>=0&&b[a]?(i(b[a].dataset.spec),v.preventDefault()):v.key==="Escape"&&(c(),t.blur(),v.preventDefault(),v.stopPropagation())}),t.addEventListener("sl-blur",()=>setTimeout(c,120)),e.addEventListener("mousedown",v=>v.preventDefault()),e.addEventListener("click",v=>{let b=v.target.closest(".player-option");b&&i(b.dataset.spec)}),d(r),n&&(g(),setInterval(()=>{o()||g()},3e3)),{hide:c,labelFor:h,setCatalog:d}}function kn(t,e,o){if(Number.isInteger(e.action))return e.action;if(!t||o<=0)return 1;let r=Math.atan2(Math.sin(e.angle-t.angle),Math.cos(e.angle-t.angle))/o;return Math.abs(r)<1e-4?1:r>0?2:0}function $n(t,e,o,i){if(!t.alive||o<=0)return{...t};let n=(e===2?1:e===0?-1:0)*i.angular_velocity_per_second,s=i.velocity_per_second/i.arena_size,l=s*o,a=t.angle+n*o,u,h;if(n===0)u=t.x+Math.cos(t.angle)*l,h=t.y+Math.sin(t.angle)*l;else{let d=s/n;u=t.x+d*(Math.sin(a)-Math.sin(t.angle)),h=t.y+d*(Math.cos(t.angle)-Math.cos(a))}let c=i.radius/i.arena_size,f=1-c;return{...t,x:Math.max(c,Math.min(f,u)),y:Math.max(c,Math.min(f,h)),angle:a}}function Ei(t,e,o,i,r,n){if(!t||!i.velocity_per_second||!i.angular_velocity_per_second)return t;let l=Math.max(0,Math.min(100,o))/1e3,a=e?t.tick-e.tick:0;return{...t,players:t.players.map((u,h)=>{let c=e?.players[h],f=n&&h===0?r:kn(c,u,a);return $n(u,f,l,i)})}}var Fe=globalThis,Ue=Fe.ShadowRoot&&(Fe.ShadyCSS===void 0||Fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ko=Symbol(),Si=new WeakMap,de=class{constructor(e,o,i){if(this._$cssResult$=!0,i!==ko)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(Ue&&e===void 0){let i=o!==void 0&&o.length===1;i&&(e=Si.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Si.set(o,e))}return e}toString(){return this.cssText}},Ti=t=>new de(typeof t=="string"?t:t+"",void 0,ko),D=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((i,r,n)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[n+1],t[0]);return new de(o,t,ko)},Pi=(t,e)=>{if(Ue)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let i=document.createElement("style"),r=Fe.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,t.appendChild(i)}},$o=Ue?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let i of e.cssRules)o+=i.cssText;return Ti(o)})(t):t;var{is:An,defineProperty:En,getOwnPropertyDescriptor:Sn,getOwnPropertyNames:Tn,getOwnPropertySymbols:Pn,getPrototypeOf:Rn}=Object,He=globalThis,Ri=He.trustedTypes,Ln=Ri?Ri.emptyScript:"",On=He.reactiveElementPolyfillSupport,fe=(t,e)=>t,xt={toAttribute(t,e){switch(e){case Boolean:t=t?Ln:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},We=(t,e)=>!An(t,e),Li={attribute:!0,type:String,converter:xt,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),He.litPropertyMetadata??=new WeakMap;var pt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=Li){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,o);r!==void 0&&En(this.prototype,e,r)}}static getPropertyDescriptor(e,o,i){let{get:r,set:n}=Sn(this.prototype,e)??{get(){return this[o]},set(s){this[o]=s}};return{get:r,set(s){let l=r?.call(this);n?.call(this,s),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Li}static _$Ei(){if(this.hasOwnProperty(fe("elementProperties")))return;let e=Rn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(fe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(fe("properties"))){let o=this.properties,i=[...Tn(o),...Pn(o)];for(let r of i)this.createProperty(r,o[r])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)o.unshift($o(r))}else e!==void 0&&o.push($o(e));return o}static _$Eu(e,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pi(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,i){this._$AK(e,i)}_$ET(e,o){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:xt).toAttribute(o,i.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,o){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:xt;this._$Em=r;let l=s.fromAttribute(o,n.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(e,o,i,r=!1,n){if(e!==void 0){let s=this.constructor;if(r===!1&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??We)(n,o)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:i,reflect:r,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??o??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(o=void 0),this._$AL.set(e,o)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:s}=n,l=this[r];s!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,n,l)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(e){}firstUpdated(e){}};pt.elementStyles=[],pt.shadowRootOptions={mode:"open"},pt[fe("elementProperties")]=new Map,pt[fe("finalized")]=new Map,On?.({ReactiveElement:pt}),(He.reactiveElementVersions??=[]).push("2.1.2");var Eo=globalThis,Oi=t=>t,qe=Eo.trustedTypes,zi=qe?qe.createPolicy("lit-html",{createHTML:t=>t}):void 0,So="$lit$",dt=`lit$${Math.random().toFixed(9).slice(2)}$`,To="?"+dt,zn=`<${To}>`,Mt=document,ge=()=>Mt.createComment(""),ve=t=>t===null||typeof t!="object"&&typeof t!="function",Po=Array.isArray,Vi=t=>Po(t)||typeof t?.[Symbol.iterator]=="function",Ao=`[ 	
\f\r]`,me=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Mi=/-->/g,Di=/>/g,Ot=RegExp(`>|${Ao}(?:([^\\s"'>=/]+)(${Ao}*=${Ao}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ni=/'/g,Ii=/"/g,Fi=/^(?:script|style|textarea|title)$/i,Ro=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),R=Ro(1),ga=Ro(2),va=Ro(3),W=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Bi=new WeakMap,zt=Mt.createTreeWalker(Mt,129);function Ui(t,e){if(!Po(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return zi!==void 0?zi.createHTML(e):e}var Hi=(t,e)=>{let o=t.length-1,i=[],r,n=e===2?"<svg>":e===3?"<math>":"",s=me;for(let l=0;l<o;l++){let a=t[l],u,h,c=-1,f=0;for(;f<a.length&&(s.lastIndex=f,h=s.exec(a),h!==null);)f=s.lastIndex,s===me?h[1]==="!--"?s=Mi:h[1]!==void 0?s=Di:h[2]!==void 0?(Fi.test(h[2])&&(r=RegExp("</"+h[2],"g")),s=Ot):h[3]!==void 0&&(s=Ot):s===Ot?h[0]===">"?(s=r??me,c=-1):h[1]===void 0?c=-2:(c=s.lastIndex-h[2].length,u=h[1],s=h[3]===void 0?Ot:h[3]==='"'?Ii:Ni):s===Ii||s===Ni?s=Ot:s===Mi||s===Di?s=me:(s=Ot,r=void 0);let d=s===Ot&&t[l+1].startsWith("/>")?" ":"";n+=s===me?a+zn:c>=0?(i.push(u),a.slice(0,c)+So+a.slice(c)+dt+d):a+dt+(c===-2?l:d)}return[Ui(t,n+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},ye=class t{constructor({strings:e,_$litType$:o},i){let r;this.parts=[];let n=0,s=0,l=e.length-1,a=this.parts,[u,h]=Hi(e,o);if(this.el=t.createElement(u,i),zt.currentNode=this.el.content,o===2||o===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=zt.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(So)){let f=h[s++],d=r.getAttribute(c).split(dt),g=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:g[2],strings:d,ctor:g[1]==="."?Ye:g[1]==="?"?Xe:g[1]==="@"?Ke:Nt}),r.removeAttribute(c)}else c.startsWith(dt)&&(a.push({type:6,index:n}),r.removeAttribute(c));if(Fi.test(r.tagName)){let c=r.textContent.split(dt),f=c.length-1;if(f>0){r.textContent=qe?qe.emptyScript:"";for(let d=0;d<f;d++)r.append(c[d],ge()),zt.nextNode(),a.push({type:2,index:++n});r.append(c[f],ge())}}}else if(r.nodeType===8)if(r.data===To)a.push({type:2,index:n});else{let c=-1;for(;(c=r.data.indexOf(dt,c+1))!==-1;)a.push({type:7,index:n}),c+=dt.length-1}n++}}static createElement(e,o){let i=Mt.createElement("template");return i.innerHTML=e,i}};function Dt(t,e,o=t,i){if(e===W)return e;let r=i!==void 0?o._$Co?.[i]:o._$Cl,n=ve(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(t),r._$AT(t,o,i)),i!==void 0?(o._$Co??=[])[i]=r:o._$Cl=r),r!==void 0&&(e=Dt(t,r._$AS(t,e.values),r,i)),e}var je=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:i}=this._$AD,r=(e?.creationScope??Mt).importNode(o,!0);zt.currentNode=r;let n=zt.nextNode(),s=0,l=0,a=i[0];for(;a!==void 0;){if(s===a.index){let u;a.type===2?u=new Xt(n,n.nextSibling,this,e):a.type===1?u=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(u=new Je(n,this,e)),this._$AV.push(u),a=i[++l]}s!==a?.index&&(n=zt.nextNode(),s++)}return zt.currentNode=Mt,r}p(e){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,o),o+=i.strings.length-2):i._$AI(e[o])),o++}},Xt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,i,r){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=Dt(this,e,o),ve(e)?e===T||e==null||e===""?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==W&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Vi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&ve(this._$AH)?this._$AA.nextSibling.data=e:this.T(Mt.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=ye.createElement(Ui(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(o);else{let n=new je(r,this),s=n.u(this.options);n.p(o),this.T(s),this._$AH=n}}_$AC(e){let o=Bi.get(e.strings);return o===void 0&&Bi.set(e.strings,o=new ye(e)),o}k(e){Po(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,r=0;for(let n of e)r===o.length?o.push(i=new t(this.O(ge()),this.O(ge()),this,this.options)):i=o[r],i._$AI(n),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let i=Oi(e).nextSibling;Oi(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Nt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,i,r,n){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=o,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=T}_$AI(e,o=this,i,r){let n=this.strings,s=!1;if(n===void 0)e=Dt(this,e,o,0),s=!ve(e)||e!==this._$AH&&e!==W,s&&(this._$AH=e);else{let l=e,a,u;for(e=n[0],a=0;a<n.length-1;a++)u=Dt(this,l[i+a],o,a),u===W&&(u=this._$AH[a]),s||=!ve(u)||u!==this._$AH[a],u===T?e=T:e!==T&&(e+=(u??"")+n[a+1]),this._$AH[a]=u}s&&!r&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ye=class extends Nt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}},Xe=class extends Nt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}},Ke=class extends Nt{constructor(e,o,i,r,n){super(e,o,i,r,n),this.type=5}_$AI(e,o=this){if((e=Dt(this,e,o,0)??T)===W)return;let i=this._$AH,r=e===T&&i!==T||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==T&&(i===T||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Je=class{constructor(e,o,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Dt(this,e)}},Wi={M:So,P:dt,A:To,C:1,L:Hi,R:je,D:Vi,V:Dt,I:Xt,H:Nt,N:Xe,U:Ke,B:Ye,F:Je},Mn=Eo.litHtmlPolyfillSupport;Mn?.(ye,Xt),(Eo.litHtmlVersions??=[]).push("3.3.3");var qi=(t,e,o)=>{let i=o?.renderBefore??e,r=i._$litPart$;if(r===void 0){let n=o?.renderBefore??null;i._$litPart$=r=new Xt(e.insertBefore(ge(),n),n,void 0,o??{})}return r._$AI(t),r};var Lo=globalThis,Ct=class extends pt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qi(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};Ct._$litElement$=!0,Ct.finalized=!0,Lo.litElementHydrateSupport?.({LitElement:Ct});var Dn=Lo.litElementPolyfillSupport;Dn?.({LitElement:Ct});(Lo.litElementVersions??=[]).push("4.2.2");var ji=D`
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
`;var Ki=Object.defineProperty,Nn=Object.defineProperties,In=Object.getOwnPropertyDescriptor,Bn=Object.getOwnPropertyDescriptors,Yi=Object.getOwnPropertySymbols,Vn=Object.prototype.hasOwnProperty,Fn=Object.prototype.propertyIsEnumerable,Oo=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),zo=t=>{throw TypeError(t)},Xi=(t,e,o)=>e in t?Ki(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,Y=(t,e)=>{for(var o in e||(e={}))Vn.call(e,o)&&Xi(t,o,e[o]);if(Yi)for(var o of Yi(e))Fn.call(e,o)&&Xi(t,o,e[o]);return t},kt=(t,e)=>Nn(t,Bn(e)),p=(t,e,o,i)=>{for(var r=i>1?void 0:i?In(e,o):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(r=(i?s(e,o,r):s(r))||r);return i&&r&&Ki(e,o,r),r},Ji=(t,e,o)=>e.has(t)||zo("Cannot "+o),Gi=(t,e,o)=>(Ji(t,e,"read from private field"),o?o.call(t):e.get(t)),Zi=(t,e,o)=>e.has(t)?zo("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),Qi=(t,e,o,i)=>(Ji(t,e,"write to private field"),i?i.call(t,o):e.set(t,o),o),Un=function(t,e){this[0]=t,this[1]=e},tr=t=>{var e=t[Oo("asyncIterator")],o=!1,i,r={};return e==null?(e=t[Oo("iterator")](),i=n=>r[n]=s=>e[n](s)):(e=e.call(t),i=n=>r[n]=s=>{if(o){if(o=!1,n==="throw")throw s;return s}return o=!0,{done:!1,value:new Un(new Promise(l=>{var a=e[n](s);a instanceof Object||zo("Object expected"),l(a)}),1)}}),r[Oo("iterator")]=()=>r,i("next"),"throw"in e?i("throw"):r.throw=n=>{throw n},"return"in e&&i("return"),r};function*or(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*tr(or(t.shadowRoot.activeElement))))}function ir(){return[...or()].pop()}var er=new WeakMap;function rr(t){let e=er.get(t);return e||(e=window.getComputedStyle(t,null),er.set(t,e)),e}function Hn(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=rr(t);return e.visibility!=="hidden"&&e.display!=="none"}function Wn(t){let e=rr(t),{overflowY:o,overflowX:i}=e;return o==="scroll"||i==="scroll"?!0:o!=="auto"||i!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&i==="auto"}function qn(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let n=t.getRootNode(),s=`input[type='radio'][name="${t.getAttribute("name")}"]`,l=n.querySelector(`${s}:checked`);return l?l===t:n.querySelector(s)===t}return Hn(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:Wn(t):!1}function nr(t){var e,o;let i=Yn(t),r=(e=i[0])!=null?e:null,n=(o=i[i.length-1])!=null?o:null;return{start:r,end:n}}function jn(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function Yn(t){let e=new WeakMap,o=[];function i(r){if(r instanceof Element){if(r.hasAttribute("inert")||r.closest("[inert]")||e.has(r))return;e.set(r,!0),!o.includes(r)&&qn(r)&&o.push(r),r instanceof HTMLSlotElement&&jn(r,t)&&r.assignedElements({flatten:!0}).forEach(n=>{i(n)}),r.shadowRoot!==null&&r.shadowRoot.mode==="open"&&i(r.shadowRoot)}for(let n of r.children)i(n)}return i(t),o.sort((r,n)=>{let s=Number(r.getAttribute("tabindex"))||0;return(Number(n.getAttribute("tabindex"))||0)-s})}var sr=D`
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
`;var Mo=new Set,Kt=new Map,ft,Do="ltr",No="en",ar=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(ar){let t=new MutationObserver(lr);Do=document.documentElement.dir||"ltr",No=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function be(...t){t.map(e=>{let o=e.$code.toLowerCase();Kt.has(o)?Kt.set(o,Object.assign(Object.assign({},Kt.get(o)),e)):Kt.set(o,e),ft||(ft=e)}),lr()}function lr(){ar&&(Do=document.documentElement.dir||"ltr",No=document.documentElement.lang||navigator.language),[...Mo.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var Ge=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Mo.add(this.host)}hostDisconnected(){Mo.delete(this.host)}dir(){return`${this.host.dir||Do}`.toLowerCase()}lang(){let e=`${this.host.lang||No}`.toLowerCase().replace(/_/g,"-");try{return new Intl.Locale(e),e}catch{return ft?ft.$code.toLowerCase():"en"}}getTranslationData(e){var o,i;let r;try{r=new Intl.Locale(e.replace(/_/g,"-"))}catch{return{locale:void 0,language:"",region:"",primary:void 0,secondary:void 0}}let n=r.language.toLowerCase(),s=(i=(o=r.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&i!==void 0?i:"",l=Kt.get(`${n}-${s}`),a=Kt.get(n);return{locale:r,language:n,region:s,primary:l,secondary:a}}exists(e,o){var i;let{primary:r,secondary:n}=this.getTranslationData((i=o.lang)!==null&&i!==void 0?i:this.lang());return o=Object.assign({includeFallback:!1},o),!!(r&&r[e]||n&&n[e]||o.includeFallback&&ft&&ft[e])}term(e,...o){let{primary:i,secondary:r}=this.getTranslationData(this.lang()),n;if(i&&i[e])n=i[e];else if(r&&r[e])n=r[e];else if(ft&&ft[e])n=ft[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof n=="function"?n(...o):n}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,o)}};var cr={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};be(cr);var hr=cr;var $t=class extends Ge{};be(hr);var K=D`
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
`;var Xn={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:We},Kn=(t=Xn,e,o)=>{let{kind:i,metadata:r}=o,n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),i==="accessor"){let{name:s}=o;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(s,a,t,!0,l)},init(l){return l!==void 0&&this.C(s,void 0,t,l),l}}}if(i==="setter"){let{name:s}=o;return function(l){let a=this[s];e.call(this,l),this.requestUpdate(s,a,t,!0,l)}}throw Error("Unsupported decorator location: "+i)};function m(t){return(e,o)=>typeof o=="object"?Kn(t,e,o):((i,r,n)=>{let s=r.hasOwnProperty(n);return r.constructor.createProperty(n,i),s?Object.getOwnPropertyDescriptor(r,n):void 0})(t,e,o)}function mt(t){return m({...t,state:!0,attribute:!1})}function ur(t){return(e,o)=>{let i=typeof e=="function"?e:e[o];Object.assign(i,t)}}var It=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function q(t,e){return(o,i,r)=>{let n=s=>s.renderRoot?.querySelector(t)??null;if(e){let{get:s,set:l}=typeof i=="object"?o:r??(()=>{let a=Symbol();return{get(){return this[a]},set(u){this[a]=u}}})();return It(o,i,{get(){let a=s.call(this);return a===void 0&&(a=n(this),(a!==null||this.hasUpdated)&&l.call(this,a)),a}})}return It(o,i,{get(){return n(this)}})}}var Ze,B=class extends Ct{constructor(){super(),Zi(this,Ze,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,Y({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let i=customElements.get(t);if(!i){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let r=" (unknown version)",n=r;"version"in e&&e.version&&(r=" v"+e.version),"version"in i&&i.version&&(n=" v"+i.version),!(r&&n&&r===n)&&console.warn(`Attempted to register <${t}>${r}, but <${t}>${n} has already been registered.`)}attributeChangedCallback(t,e,o){Gi(this,Ze)||(this.constructor.elementProperties.forEach((i,r)=>{i.reflect&&this[r]!=null&&this.initialReflectedProperties.set(r,this[r])}),Qi(this,Ze,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};Ze=new WeakMap;B.version="2.20.1";B.dependencies={};p([m()],B.prototype,"dir",2);p([m()],B.prototype,"lang",2);var st=Math.min,tt=Math.max,_e=Math.round,xe=Math.floor,at=t=>({x:t,y:t}),Jn={left:"right",right:"left",bottom:"top",top:"bottom"};function Io(t,e,o){return tt(t,st(e,o))}function Bt(t,e){return typeof t=="function"?t(e):t}function At(t){return t.split("-")[0]}function Vt(t){return t.split("-")[1]}function Bo(t){return t==="x"?"y":"x"}function to(t){return t==="y"?"height":"width"}function lt(t){let e=t[0];return e==="t"||e==="b"?"y":"x"}function eo(t){return Bo(lt(t))}function fr(t,e,o){o===void 0&&(o=!1);let i=Vt(t),r=eo(t),n=to(r),s=r==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(s=we(s)),[s,we(s)]}function mr(t){let e=we(t);return[Qe(t),e,Qe(e)]}function Qe(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}var pr=["left","right"],dr=["right","left"],Gn=["top","bottom"],Zn=["bottom","top"];function Qn(t,e,o){switch(t){case"top":case"bottom":return o?e?dr:pr:e?pr:dr;case"left":case"right":return e?Gn:Zn;default:return[]}}function gr(t,e,o,i){let r=Vt(t),n=Qn(At(t),o==="start",i);return r&&(n=n.map(s=>s+"-"+r),e&&(n=n.concat(n.map(Qe)))),n}function we(t){let e=At(t);return Jn[e]+t.slice(e.length)}function ts(t){var e,o,i,r;return{top:(e=t.top)!=null?e:0,right:(o=t.right)!=null?o:0,bottom:(i=t.bottom)!=null?i:0,left:(r=t.left)!=null?r:0}}function Vo(t){return typeof t!="number"?ts(t):{top:t,right:t,bottom:t,left:t}}function Ft(t){let{x:e,y:o,width:i,height:r}=t;return{width:i,height:r,top:o,left:e,right:e+i,bottom:o+r,x:e,y:o}}function vr(t,e,o){let{reference:i,floating:r}=t,n=lt(e),s=eo(e),l=to(s),a=At(e),u=n==="y",h=i.x+i.width/2-r.width/2,c=i.y+i.height/2-r.height/2,f=i[l]/2-r[l]/2,d;switch(a){case"top":d={x:h,y:i.y-r.height};break;case"bottom":d={x:h,y:i.y+i.height};break;case"right":d={x:i.x+i.width,y:c};break;case"left":d={x:i.x-r.width,y:c};break;default:d={x:i.x,y:i.y}}let g=Vt(e);return g&&(d[s]+=f*(g==="end"?1:-1)*(o&&u?-1:1)),d}async function yr(t,e){var o;e===void 0&&(e={});let{x:i,y:r,platform:n,rects:s,elements:l,strategy:a}=t,{boundary:u="clippingAncestors",rootBoundary:h="viewport",elementContext:c="floating",altBoundary:f=!1,padding:d=0}=Bt(e,t),g=Vo(d),b=l[f?c==="floating"?"reference":"floating":c],y=Ft(await n.getClippingRect({element:(o=await(n.isElement==null?void 0:n.isElement(b)))==null||o?b:b.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(l.floating)),boundary:u,rootBoundary:h,strategy:a})),w=c==="floating"?{x:i,y:r,width:s.floating.width,height:s.floating.height}:s.reference,_=await(n.getOffsetParent==null?void 0:n.getOffsetParent(l.floating)),x=await(n.isElement==null?void 0:n.isElement(_))&&await(n.getScale==null?void 0:n.getScale(_))||{x:1,y:1},k=Ft(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:w,offsetParent:_,strategy:a}):w);return{top:(y.top-k.top+g.top)/x.y,bottom:(k.bottom-y.bottom+g.bottom)/x.y,left:(y.left-k.left+g.left)/x.x,right:(k.right-y.right+g.right)/x.x}}var es=50,br=async(t,e,o)=>{let{placement:i="bottom",strategy:r="absolute",middleware:n=[],platform:s}=o,l=s.detectOverflow?s:{...s,detectOverflow:yr},a=await(s.isRTL==null?void 0:s.isRTL(e)),u=await s.getElementRects({reference:t,floating:e,strategy:r}),{x:h,y:c}=vr(u,i,a),f=i,d=0,g={};for(let v=0;v<n.length;v++){let b=n[v];if(!b)continue;let{name:y,fn:w}=b,{x:_,y:x,data:k,reset:A}=await w({x:h,y:c,initialPlacement:i,placement:f,strategy:r,middlewareData:g,rects:u,platform:l,elements:{reference:t,floating:e}});h=_??h,c=x??c,g[y]={...g[y],...k},A&&d<es&&(d++,typeof A=="object"&&(A.placement&&(f=A.placement),A.rects&&(u=A.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:r}):A.rects),{x:h,y:c}=vr(u,f,a)),v=-1)}return{x:h,y:c,placement:f,strategy:r,middlewareData:g}},wr=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:i,placement:r,rects:n,platform:s,elements:l,middlewareData:a}=e,{element:u,padding:h=0}=Bt(t,e)||{};if(u==null)return{};let c=Vo(h),f={x:o,y:i},d=eo(r),g=to(d),v=await s.getDimensions(u),b=d==="y",y=b?"top":"left",w=b?"bottom":"right",_=b?"clientHeight":"clientWidth",x=n.reference[g]+n.reference[d]-f[d]-n.floating[g],k=f[d]-n.reference[d],A=await(s.getOffsetParent==null?void 0:s.getOffsetParent(u)),L=A?A[_]:0;(!L||!await(s.isElement==null?void 0:s.isElement(A)))&&(L=l.floating[_]||n.floating[g]);let F=x/2-k/2,rt=L/2-v[g]/2-1,I=st(c[y],rt),ue=st(c[w],rt),pe=L-v[g]-ue,nt=L/2-v[g]/2+F,Z=Io(I,nt,pe),Rt=!a.arrow&&Vt(r)!=null&&nt!==Z&&n.reference[g]/2-(nt<I?I:ue)-v[g]/2<0,ut=Rt?nt<I?nt-I:nt-pe:0;return{[d]:f[d]+ut,data:{[d]:Z,centerOffset:nt-Z-ut,...Rt&&{alignmentOffset:ut}},reset:Rt}}});var _r=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,i;let{placement:r,middlewareData:n,rects:s,initialPlacement:l,platform:a,elements:u}=e,{mainAxis:h=!0,crossAxis:c=!0,fallbackPlacements:f,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:v=!0,...b}=Bt(t,e);if((o=n.arrow)!=null&&o.alignmentOffset)return{};let y=At(r),w=lt(l),_=At(l)===l,x=await(a.isRTL==null?void 0:a.isRTL(u.floating)),k=f||(_||!v?[we(l)]:mr(l)),A=g!=="none";!f&&A&&k.push(...gr(l,v,g,x));let L=[l,...k],F=await a.detectOverflow(e,b),rt=[],I=((i=n.flip)==null?void 0:i.overflows)||[];if(h&&rt.push(F[y]),c){let Z=fr(r,s,x);rt.push(F[Z[0]],F[Z[1]])}if(I=[...I,{placement:r,overflows:rt}],!rt.every(Z=>Z<=0)){var ue,pe;let Z=(((ue=n.flip)==null?void 0:ue.index)||0)+1,Rt=L[Z];if(Rt&&(!(c==="alignment"?w!==lt(Rt):!1)||I.every(Q=>lt(Q.placement)===w?Q.overflows[0]>0:!0)))return{data:{index:Z,overflows:I},reset:{placement:Rt}};let ut=(pe=I.filter(Lt=>Lt.overflows[0]<=0).sort((Lt,Q)=>Lt.overflows[1]-Q.overflows[1])[0])==null?void 0:pe.placement;if(!ut)switch(d){case"bestFit":{var nt;let Lt=(nt=I.filter(Q=>{if(A){let _t=lt(Q.placement);return _t===w||_t==="y"}return!0}).map(Q=>[Q.placement,Q.overflows.filter(_t=>_t>0).reduce((_t,Cn)=>_t+Cn,0)]).sort((Q,_t)=>Q[1]-_t[1])[0])==null?void 0:nt[0];Lt&&(ut=Lt);break}case"initialPlacement":ut=l;break}if(r!==ut)return{reset:{placement:ut}}}return{}}}};var os=new Set(["left","top"]);async function is(t,e){let{placement:o,platform:i,elements:r}=t,n=await(i.isRTL==null?void 0:i.isRTL(r.floating)),s=At(o),l=Vt(o),a=lt(o)==="y",u=os.has(s)?-1:1,h=n&&a?-1:1,c=Bt(e,t),{mainAxis:f,crossAxis:d,alignmentAxis:g}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return l&&typeof g=="number"&&(d=l==="end"?g*-1:g),a?{x:d*h,y:f*u}:{x:f*u,y:d*h}}var xr=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,i;let{x:r,y:n,placement:s,middlewareData:l}=e,a=await is(e,t);return s===((o=l.offset)==null?void 0:o.placement)&&(i=l.arrow)!=null&&i.alignmentOffset?{}:{x:r+a.x,y:n+a.y,data:{...a,placement:s}}}}},Cr=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:i,placement:r,platform:n}=e,{mainAxis:s=!0,crossAxis:l=!1,limiter:a={fn:w=>{let{x:_,y:x}=w;return{x:_,y:x}}},...u}=Bt(t,e),h={x:o,y:i},c=await n.detectOverflow(e,u),f=lt(r),d=Bo(f),g=h[d],v=h[f],b=(w,_)=>Io(_+c[w==="y"?"top":"left"],_,_-c[w==="y"?"bottom":"right"]);s&&(g=b(d,g)),l&&(v=b(f,v));let y=a.fn({...e,[d]:g,[f]:v});return{...y,data:{x:y.x-o,y:y.y-i,enabled:{[d]:s,[f]:l}}}}}};var kr=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){let{placement:o,rects:i,platform:r,elements:n}=e,{apply:s=()=>{},...l}=Bt(t,e),a=await r.detectOverflow(e,l),u=At(o),h=Vt(o),c=lt(o)==="y",{width:f,height:d}=i.floating,g,v;u==="top"||u==="bottom"?(g=u,v=h===(await(r.isRTL==null?void 0:r.isRTL(n.floating))?"start":"end")?"left":"right"):(v=u,g=h==="end"?"top":"bottom");let b=d-a.top-a.bottom,y=f-a.left-a.right,w=st(d-a[g],b),_=st(f-a[v],y),x=e.middlewareData.shift,k=!x,A=w,L=_;x!=null&&x.enabled.x&&(L=y),x!=null&&x.enabled.y&&(A=b),k&&!h&&(c?L=f-2*tt(a.left,a.right):A=d-2*tt(a.top,a.bottom)),await s({...e,availableWidth:L,availableHeight:A});let F=await r.getDimensions(n.floating);return f!==F.width||d!==F.height?{reset:{rects:!0}}:{}}}};function oo(){return typeof window<"u"}function Ht(t){return Ar(t)?(t.nodeName||"").toLowerCase():"#document"}function U(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function ct(t){var e;return(e=(Ar(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Ar(t){return oo()?t instanceof Node||t instanceof U(t).Node:!1}function et(t){return oo()?t instanceof Element||t instanceof U(t).Element:!1}function gt(t){return oo()?t instanceof HTMLElement||t instanceof U(t).HTMLElement:!1}function $r(t){return!oo()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof U(t).ShadowRoot}function Ce(t){let{overflow:e,overflowX:o,overflowY:i,display:r}=ot(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&r!=="inline"&&r!=="contents"}function Er(t){return/^(table|td|th)$/.test(Ht(t))}function ke(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}var rs=/transform|translate|scale|rotate|perspective|filter/,ns=/paint|layout|strict|content/,Ut=t=>!!t&&t!=="none",Fo;function Gt(t){let e=et(t)?ot(t):t;return Ut(e.transform)||Ut(e.translate)||Ut(e.scale)||Ut(e.rotate)||Ut(e.perspective)||!io()&&(Ut(e.backdropFilter)||Ut(e.filter))||rs.test(e.willChange||"")||ns.test(e.contain||"")}function Sr(t){let e=Et(t);for(;gt(e)&&!Zt(e);){if(Gt(e))return e;if(ke(e))return null;e=Et(e)}return null}function io(){return Fo==null&&(Fo=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Fo}function Zt(t){return/^(html|body|#document)$/.test(Ht(t))}function ot(t){return U(t).getComputedStyle(t)}function $e(t){return et(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Et(t){if(Ht(t)==="html")return t;let e=t.assignedSlot||t.parentNode||$r(t)&&t.host||ct(t);return $r(e)?e.host:e}function Tr(t){let e=Et(t);return Zt(e)?(t.ownerDocument||t).body:gt(e)&&Ce(e)?e:Tr(e)}function Jt(t,e,o){var i;e===void 0&&(e=[]),o===void 0&&(o=!0);let r=Tr(t),n=r===((i=t.ownerDocument)==null?void 0:i.body),s=U(r);if(n){let l=ro(s);return e.concat(s,s.visualViewport||[],Ce(r)?r:[],l&&o?Jt(l):[])}else return e.concat(r,Jt(r,[],o))}function ro(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Lr(t){let e=ot(t),o=parseFloat(e.width)||0,i=parseFloat(e.height)||0,r=gt(t),n=r?t.offsetWidth:o,s=r?t.offsetHeight:i,l=_e(o)!==n||_e(i)!==s;return l&&(o=n,i=s),{width:o,height:i,$:l}}function Ho(t){return et(t)?t:t.contextElement}function Qt(t){let e=Ho(t);if(!gt(e))return at(1);let o=e.getBoundingClientRect(),{width:i,height:r,$:n}=Lr(e),s=(n?_e(o.width):o.width)/i,l=(n?_e(o.height):o.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}var ss=at(0);function Or(t){let e=U(t);return!io()||!e.visualViewport?ss:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function as(t,e,o){return e===void 0&&(e=!1),!!o&&e&&o===U(t)}function Wt(t,e,o,i){e===void 0&&(e=!1),o===void 0&&(o=!1);let r=t.getBoundingClientRect(),n=Ho(t),s=at(1);e&&(i?et(i)&&(s=Qt(i)):s=Qt(t));let l=as(n,o,i)?Or(n):at(0),a=(r.left+l.x)/s.x,u=(r.top+l.y)/s.y,h=r.width/s.x,c=r.height/s.y;if(n&&i){let f=U(n),d=et(i)?U(i):i,g=f,v=ro(g);for(;v&&d!==g;){let b=Qt(v),y=v.getBoundingClientRect(),w=ot(v),_=y.left+(v.clientLeft+parseFloat(w.paddingLeft))*b.x,x=y.top+(v.clientTop+parseFloat(w.paddingTop))*b.y;a*=b.x,u*=b.y,h*=b.x,c*=b.y,a+=_,u+=x,g=U(v),v=ro(g)}}return Ft({width:h,height:c,x:a,y:u})}function no(t,e){let o=$e(t).scrollLeft;return e?e.left+o:Wt(ct(t)).left+o}function zr(t,e){let o=t.getBoundingClientRect(),i=o.left+e.scrollLeft-no(t,o),r=o.top+e.scrollTop;return{x:i,y:r}}function ls(t){let{elements:e,rect:o,offsetParent:i,strategy:r}=t,n=r==="fixed",s=ct(i),l=e?ke(e.floating):!1;if(i===s||l&&n)return o;let a={scrollLeft:0,scrollTop:0},u=at(1),h=at(0),c=gt(i);if((c||!n)&&((Ht(i)!=="body"||Ce(s))&&(a=$e(i)),c)){let d=Wt(i);u=Qt(i),h.x=d.x+i.clientLeft,h.y=d.y+i.clientTop}let f=s&&!c&&!n?zr(s,a):at(0);return{width:o.width*u.x,height:o.height*u.y,x:o.x*u.x-a.scrollLeft*u.x+h.x+f.x,y:o.y*u.y-a.scrollTop*u.y+h.y+f.y}}function cs(t){return t.getClientRects?Array.from(t.getClientRects()):[]}function hs(t){let e=$e(t),o=t.ownerDocument.body,i=tt(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=tt(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight),n=-e.scrollLeft+no(t),s=-e.scrollTop;return ot(o).direction==="rtl"&&(n+=tt(t.clientWidth,o.clientWidth)-i),{width:i,height:r,x:n,y:s}}var us=25;function ps(t,e,o){o===void 0&&(o="viewport");let i=o==="layoutViewport",r=U(t),n=ct(t),s=r.visualViewport,l=n.clientWidth,a=n.clientHeight,u=0,h=0;if(s){let f=!io()||e==="fixed";i?f||(u=-s.offsetLeft,h=-s.offsetTop):(l=s.width,a=s.height,f&&(u=s.offsetLeft,h=s.offsetTop))}if(no(n)<=0){let f=n.ownerDocument,d=f.body,g=getComputedStyle(d),v=f.compatMode==="CSS1Compat"&&parseFloat(g.marginLeft)+parseFloat(g.marginRight)||0,b=Math.abs(n.clientWidth-d.clientWidth-v),y=getComputedStyle(n).scrollbarGutter==="stable both-edges"?b/2:b;y<=us&&(l-=y)}return{width:l,height:a,x:u,y:h}}function ds(t,e){let o=Wt(t,!0,e==="fixed"),i=o.top+t.clientTop,r=o.left+t.clientLeft,n=Qt(t),s=t.clientWidth*n.x,l=t.clientHeight*n.y,a=r*n.x,u=i*n.y;return{width:s,height:l,x:a,y:u}}function Pr(t,e,o){let i;if(e==="viewport"||e==="layoutViewport")i=ps(t,o,e);else if(e==="document")i=hs(ct(t));else if(et(e))i=ds(e,o);else{let r=Or(t);i={x:e.x-r.x,y:e.y-r.y,width:e.width,height:e.height}}return Ft(i)}function fs(t,e){let o=e.get(t);if(o)return o;let i=Jt(t,[],!1).filter(l=>et(l)&&Ht(l)!=="body"),r=null,n=ot(t).position==="fixed",s=n?Et(t):t;for(;et(s)&&!Zt(s);){let l=ot(s),a=Gt(s),u=r?r.position:n?"fixed":"";!a&&(u==="fixed"||u==="absolute"&&l.position==="static")?i=i.filter(c=>c!==s):r=l,s=Et(s)}return e.set(t,i),i}function ms(t){let{element:e,boundary:o,rootBoundary:i,strategy:r}=t,s=[...o==="clippingAncestors"?ke(e)?[]:fs(e,this._c):[].concat(o),i],l=Pr(e,s[0],r),a=l.top,u=l.right,h=l.bottom,c=l.left;for(let f=1;f<s.length;f++){let d=Pr(e,s[f],r);a=tt(d.top,a),u=st(d.right,u),h=st(d.bottom,h),c=tt(d.left,c)}return{width:u-c,height:h-a,x:c,y:a}}function gs(t){let{width:e,height:o}=Lr(t);return{width:e,height:o}}function vs(t,e,o){let i=gt(e),r=ct(e),n=o==="fixed",s=Wt(t,!0,n,e),l={scrollLeft:0,scrollTop:0},a=at(0);if((i||!n)&&((Ht(e)!=="body"||Ce(r))&&(l=$e(e)),i)){let f=Wt(e,!0,n,e);a.x=f.x+e.clientLeft,a.y=f.y+e.clientTop}!i&&r&&(a.x=no(r));let u=r&&!i&&!n?zr(r,l):at(0),h=s.left+l.scrollLeft-a.x-u.x,c=s.top+l.scrollTop-a.y-u.y;return{x:h,y:c,width:s.width,height:s.height}}function Uo(t){return ot(t).position==="static"}function Rr(t,e){if(!gt(t)||ot(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return ct(t)===o&&(o=o.ownerDocument.body),o}function Mr(t,e){let o=U(t);if(ke(t))return o;if(!gt(t)){let r=Et(t);for(;r&&!Zt(r);){if(et(r)&&!Uo(r))return r;r=Et(r)}return o}let i=Rr(t,e);for(;i&&Er(i)&&Uo(i);)i=Rr(i,e);return i&&Zt(i)&&Uo(i)&&!Gt(i)?o:i||Sr(t)||o}var ys=async function(t){let e=this.getOffsetParent||Mr,o=this.getDimensions,i=await o(t.floating);return{reference:vs(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function bs(t){return ot(t).direction==="rtl"}var Ae={convertOffsetParentRelativeRectToViewportRelativeRect:ls,getDocumentElement:ct,getClippingRect:ms,getOffsetParent:Mr,getElementRects:ys,getClientRects:cs,getDimensions:gs,getScale:Qt,isElement:et,isRTL:bs};function Dr(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function ws(t,e,o){let i=null,r,n=ct(t);function s(){var h;clearTimeout(r),(h=i)==null||h.disconnect(),i=null}function l(h,c){h===void 0&&(h=!1),c===void 0&&(c=1),s();let f=t.getBoundingClientRect(),{left:d,top:g,width:v,height:b}=f;if(h||e(),!v||!b)return;let y=xe(g),w=xe(n.clientWidth-(d+v)),_=xe(n.clientHeight-(g+b)),x=xe(d),A={rootMargin:-y+"px "+-w+"px "+-_+"px "+-x+"px",threshold:tt(0,st(1,c))||1},L=!0;function F(rt){let I=rt[0].intersectionRatio;if(!Dr(f,t.getBoundingClientRect()))return l();if(I!==c){if(!L)return l();I?l(!1,I):r=setTimeout(()=>{l(!1,1e-7)},1e3)}L=!1}try{i=new IntersectionObserver(F,{...A,root:n.ownerDocument})}catch{i=new IntersectionObserver(F,A)}i.observe(t)}let a=U(t),u=()=>l(o);return a.addEventListener("resize",u),l(!0),()=>{a.removeEventListener("resize",u),s()}}function Nr(t,e,o,i){i===void 0&&(i={});let{ancestorScroll:r=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:l=typeof IntersectionObserver=="function",animationFrame:a=!1}=i,u=Ho(t),h=r||n?[...u?Jt(u):[],...e?Jt(e):[]]:[];h.forEach(y=>{r&&y.addEventListener("scroll",o),n&&y.addEventListener("resize",o)});let c=u&&l?ws(u,o,n):null,f=-1,d=null;s&&(d=new ResizeObserver(y=>{let[w]=y;w&&w.target===u&&d&&e&&(d.unobserve(e),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var _;(_=d)==null||_.observe(e)})),o()}),u&&!a&&d.observe(u),e&&d.observe(e));let g,v=a?Wt(t):null;a&&b();function b(){let y=Wt(t);v&&!Dr(v,y)&&o(),v=y,g=requestAnimationFrame(b)}return o(),()=>{var y;h.forEach(w=>{r&&w.removeEventListener("scroll",o),n&&w.removeEventListener("resize",o)}),c?.(),(y=d)==null||y.disconnect(),d=null,a&&cancelAnimationFrame(g)}}var Ir=xr;var Br=Cr,Vr=_r,Wo=kr;var Fr=wr;var Ur=(t,e,o)=>{let i=new Map,r=o??{},n={...Ae,...r.platform,_c:i};return br(t,e,{...r,platform:n})};var vt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},so=t=>(...e)=>({_$litDirective$:t,values:e}),te=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,i){this._$Ct=e,this._$AM=o,this._$Ci=i}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var j=so(class extends te{constructor(t){if(super(t),t.type!==vt.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}let o=t.element.classList;for(let i of this.st)i in e||(o.remove(i),this.st.delete(i));for(let i in e){let r=!!e[i];r===this.st.has(i)||this.nt?.has(i)||(r?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return W}});function Hr(t){return _s(t)}function qo(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function _s(t){for(let e=t;e;e=qo(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=qo(t);e;e=qo(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||Gt(o)||e.tagName==="BODY"))return e}return null}function xs(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var $=class extends B{constructor(){super(...arguments),this.localize=new $t(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),i=0,r=0,n=0,s=0,l=0,a=0,u=0,h=0;o?t.top<e.top?(i=t.left,r=t.bottom,n=t.right,s=t.bottom,l=e.left,a=e.top,u=e.right,h=e.top):(i=e.left,r=e.bottom,n=e.right,s=e.bottom,l=t.left,a=t.top,u=t.right,h=t.top):t.left<e.left?(i=t.right,r=t.top,n=e.left,s=e.top,l=t.right,a=t.bottom,u=e.left,h=e.bottom):(i=e.right,r=e.top,n=t.left,s=t.top,l=e.right,a=e.bottom,u=t.left,h=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${l}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${a}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${u}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||xs(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Nr(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[Ir({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Wo({apply:({rects:o})=>{let i=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${o.reference.width}px`:"",this.popup.style.height=r?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Vr({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Br({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Wo({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Fr({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>Ae.getOffsetParent(o,Hr):Ae.getOffsetParent;Ur(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:kt(Y({},Ae),{getOffsetParent:e})}).then(({x:o,y:i,middlewareData:r,placement:n})=>{let s=this.localize.dir()==="rtl",l={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${o}px`,top:`${i}px`}),this.arrow){let a=r.arrow.x,u=r.arrow.y,h="",c="",f="",d="";if(this.arrowPlacement==="start"){let g=typeof a=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",c=s?g:"",d=s?"":g}else if(this.arrowPlacement==="end"){let g=typeof a=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";c=s?"":g,d=s?g:"",f=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(d=typeof a=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof u=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(d=typeof a=="number"?`${a}px`:"",h=typeof u=="number"?`${u}px`:"");Object.assign(this.arrowEl.style,{top:h,right:c,bottom:f,left:d,[l]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return R`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${j({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${j({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?R`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};$.styles=[K,sr];p([q(".popup")],$.prototype,"popup",2);p([q(".popup__arrow")],$.prototype,"arrowEl",2);p([m()],$.prototype,"anchor",2);p([m({type:Boolean,reflect:!0})],$.prototype,"active",2);p([m({reflect:!0})],$.prototype,"placement",2);p([m({reflect:!0})],$.prototype,"strategy",2);p([m({type:Number})],$.prototype,"distance",2);p([m({type:Number})],$.prototype,"skidding",2);p([m({type:Boolean})],$.prototype,"arrow",2);p([m({attribute:"arrow-placement"})],$.prototype,"arrowPlacement",2);p([m({attribute:"arrow-padding",type:Number})],$.prototype,"arrowPadding",2);p([m({type:Boolean})],$.prototype,"flip",2);p([m({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],$.prototype,"flipFallbackPlacements",2);p([m({attribute:"flip-fallback-strategy"})],$.prototype,"flipFallbackStrategy",2);p([m({type:Object})],$.prototype,"flipBoundary",2);p([m({attribute:"flip-padding",type:Number})],$.prototype,"flipPadding",2);p([m({type:Boolean})],$.prototype,"shift",2);p([m({type:Object})],$.prototype,"shiftBoundary",2);p([m({attribute:"shift-padding",type:Number})],$.prototype,"shiftPadding",2);p([m({attribute:"auto-size"})],$.prototype,"autoSize",2);p([m()],$.prototype,"sync",2);p([m({type:Object})],$.prototype,"autoSizeBoundary",2);p([m({attribute:"auto-size-padding",type:Number})],$.prototype,"autoSizePadding",2);p([m({attribute:"hover-bridge",type:Boolean})],$.prototype,"hoverBridge",2);var qr=new Map,Cs=new WeakMap;function ks(t){return t??{keyframes:[],options:{duration:0}}}function Wr(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function jo(t,e){qr.set(t,ks(e))}function Yo(t,e,o){let i=Cs.get(t);if(i?.[e])return Wr(i[e],o.dir);let r=qr.get(e);return r?Wr(r,o.dir):{keyframes:[],options:{duration:0}}}function Xo(t,e){return new Promise(o=>{function i(r){r.target===t&&(t.removeEventListener(e,i),o())}t.addEventListener(e,i)})}function Ko(t,e,o){return new Promise(i=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let r=t.animate(e,kt(Y({},o),{duration:$s()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function $s(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Jo(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}function V(t,e){let o=Y({waitUntilFirstUpdate:!1},e);return(i,r)=>{let{update:n}=i,s=Array.isArray(t)?t:[t];i.update=function(l){s.forEach(a=>{let u=a;if(l.has(u)){let h=l.get(u),c=this[u];h!==c&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[r](h,c)}}),n.call(this,l)}}}var S=t=>t??T;var N=class extends B{constructor(){super(...arguments),this.localize=new $t(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(i,r)=>{if(!i)return null;let n=i.closest(r);if(n)return n;let s=i.getRootNode();return s instanceof ShadowRoot?o(s.host,r):null};setTimeout(()=>{var i;let r=((i=this.containingElement)==null?void 0:i.getRootNode())instanceof ShadowRoot?ir():document.activeElement;(!this.containingElement||o(r,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),i=o[0],r=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(i),i.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(r),r.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(i=>nr(i).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,Xo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Xo(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await Jo(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=Yo(this,"dropdown.show",{dir:this.localize.dir()});await Ko(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await Jo(this);let{keyframes:t,options:e}=Yo(this,"dropdown.hide",{dir:this.localize.dir()});await Ko(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return R`
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
        class=${j({dropdown:!0,"dropdown--open":this.open})}
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
    `}};N.styles=[K,ji];N.dependencies={"sl-popup":$};p([q(".dropdown")],N.prototype,"popup",2);p([q(".dropdown__trigger")],N.prototype,"trigger",2);p([q(".dropdown__panel")],N.prototype,"panel",2);p([m({type:Boolean,reflect:!0})],N.prototype,"open",2);p([m({reflect:!0})],N.prototype,"placement",2);p([m({type:Boolean,reflect:!0})],N.prototype,"disabled",2);p([m({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],N.prototype,"stayOpenOnSelect",2);p([m({attribute:!1})],N.prototype,"containingElement",2);p([m({type:Number})],N.prototype,"distance",2);p([m({type:Number})],N.prototype,"skidding",2);p([m({type:Boolean})],N.prototype,"hoist",2);p([m({reflect:!0})],N.prototype,"sync",2);p([V("open",{waitUntilFirstUpdate:!0})],N.prototype,"handleOpenChange",1);jo("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});jo("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});N.define("sl-dropdown");var jr=D`
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
`;var ee=(t="value")=>(e,o)=>{let i=e.constructor,r=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(n,s,l){var a;let u=i.getPropertyOptions(t),h=typeof u.attribute=="string"?u.attribute:t;if(n===h){let c=u.converter||xt,d=(typeof c=="function"?c:(a=c?.fromAttribute)!=null?a:xt.fromAttribute)(l,u.type);this[t]!==d&&(this[o]=d)}r.call(this,n,s,l)}};var oe=D`
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
`;var Ee=new WeakMap,Se=new WeakMap,Te=new WeakMap,Go=new WeakSet,ao=new WeakMap,ie=class{constructor(t,e){this.handleFormData=o=>{let i=this.options.disabled(this.host),r=this.options.name(this.host),n=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!i&&!s&&typeof r=="string"&&r.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(l=>{o.formData.append(r,l.toString())}):o.formData.append(r,n.toString()))},this.handleFormSubmit=o=>{var i;let r=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((i=Ee.get(this.form))==null||i.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!r&&!n(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),ao.set(this.host,[])},this.handleInteraction=o=>{let i=ao.get(this.host);i.includes(o.type)||i.push(o.type),i.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.checkValidity=="function"&&!i.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.reportValidity=="function"&&!i.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Y({form:o=>{let i=o.form;if(i){let n=o.getRootNode().querySelector(`#${i}`);if(n)return n}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var i;return(i=o.disabled)!=null?i:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,i)=>o.value=i,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),ao.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),ao.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,Ee.has(this.form)?Ee.get(this.form).add(this.host):Ee.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),Se.has(this.form)||(Se.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Te.has(this.form)||(Te.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=Ee.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),Se.has(this.form)&&(this.form.reportValidity=Se.get(this.form),Se.delete(this.form)),Te.has(this.form)&&(this.form.checkValidity=Te.get(this.form),Te.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Go.add(t):Go.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(i=>{e.hasAttribute(i)&&o.setAttribute(i,e.getAttribute(i))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!Go.has(e),i=!!e.required;e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},Yr=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),lh=Object.freeze(kt(Y({},Yr),{valid:!1,valueMissing:!0})),ch=Object.freeze(kt(Y({},Yr),{valid:!1,customError:!0}));var re=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let i=o.target;(this.slotNames.includes("[default]")&&!i.name||i.name&&this.slotNames.includes(i.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};var Zo="";function Xr(t){Zo=t}function Kr(t=""){if(!Zo){let e=[...document.getElementsByTagName("script")],o=e.find(i=>i.hasAttribute("data-shoelace"));if(o)Xr(o.getAttribute("data-shoelace"));else{let i=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)),r="";i&&(r=i.getAttribute("src")),Xr(r.split("/").slice(0,-1).join("/"))}}return Zo.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var As={name:"default",resolver:t=>Kr(`assets/icons/${t}.svg`)},Jr=As;var Gr={caret:`
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
  `},Es={name:"system",resolver:t=>t in Gr?`data:image/svg+xml,${encodeURIComponent(Gr[t])}`:""},Zr=Es;var Ss=[Jr,Zr],Qo=[];function Qr(t){Qo.push(t)}function tn(t){Qo=Qo.filter(e=>e!==t)}function ti(t){return Ss.find(e=>e.name===t)}var en=D`
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
`;var{I:kh}=Wi;var on=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var rn=t=>t.strings===void 0;var Ts={},nn=(t,e=Ts)=>t._$AH=e;var Pe=Symbol(),lo=Symbol(),ei,oi=new Map,J=class extends B{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let i;if(e?.spriteSheet)return this.svg=R`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(i=await fetch(t,{mode:"cors"}),!i.ok)return i.status===410?Pe:lo}catch{return lo}try{let r=document.createElement("div");r.innerHTML=await i.text();let n=r.firstElementChild;if(((o=n?.tagName)==null?void 0:o.toLowerCase())!=="svg")return Pe;ei||(ei=new DOMParser);let l=ei.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return l?(l.part.add("svg"),document.adoptNode(l)):Pe}catch{return Pe}}connectedCallback(){super.connectedCallback(),Qr(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),tn(this)}getIconSource(){let t=ti(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),i=o?ti(this.library):void 0;if(!e){this.svg=null;return}let r=oi.get(e);if(r||(r=this.resolveIcon(e,i),oi.set(e,r)),!this.initialRender)return;let n=await r;if(n===lo&&oi.delete(e),e===this.getIconSource().url){if(on(n)){if(this.svg=n,i){await this.updateComplete;let s=this.shadowRoot.querySelector("[part='svg']");typeof i.mutator=="function"&&s&&i.mutator(s)}return}switch(n){case lo:case Pe:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=i?.mutator)==null||t.call(i,this.svg),this.emit("sl-load")}}}render(){return this.svg}};J.styles=[K,en];p([mt()],J.prototype,"svg",2);p([m({reflect:!0})],J.prototype,"name",2);p([m()],J.prototype,"src",2);p([m()],J.prototype,"label",2);p([m({reflect:!0})],J.prototype,"library",2);p([V("label")],J.prototype,"handleLabelChange",1);p([V(["name","src","library"])],J.prototype,"setIcon",1);var qt=so(class extends te{constructor(t){if(super(t),t.type!==vt.PROPERTY&&t.type!==vt.ATTRIBUTE&&t.type!==vt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!rn(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===W||e===T)return e;let o=t.element,i=t.name;if(t.type===vt.PROPERTY){if(e===o[i])return W}else if(t.type===vt.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(i))return W}else if(t.type===vt.ATTRIBUTE&&o.getAttribute(i)===e+"")return W;return nn(t),e}});var C=class extends B{constructor(){super(...arguments),this.formControlController=new ie(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new re(this,"help-text","label"),this.localize=new $t(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,i="preserve"){let r=e??this.input.selectionStart,n=o??this.input.selectionEnd;this.input.setRangeText(t,r,n,i),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e,n=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return R`
      <div
        part="form-control"
        class=${j({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${j({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
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
              .value=${qt(this.value)}
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

            ${n?R`
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
            ${this.passwordToggle&&!this.disabled?R`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?R`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:R`
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
    `}};C.styles=[K,oe,jr];C.dependencies={"sl-icon":J};p([q(".input__control")],C.prototype,"input",2);p([mt()],C.prototype,"hasFocus",2);p([m()],C.prototype,"title",2);p([m({reflect:!0})],C.prototype,"type",2);p([m()],C.prototype,"name",2);p([m()],C.prototype,"value",2);p([ee()],C.prototype,"defaultValue",2);p([m({reflect:!0})],C.prototype,"size",2);p([m({type:Boolean,reflect:!0})],C.prototype,"filled",2);p([m({type:Boolean,reflect:!0})],C.prototype,"pill",2);p([m()],C.prototype,"label",2);p([m({attribute:"help-text"})],C.prototype,"helpText",2);p([m({type:Boolean})],C.prototype,"clearable",2);p([m({type:Boolean,reflect:!0})],C.prototype,"disabled",2);p([m()],C.prototype,"placeholder",2);p([m({type:Boolean,reflect:!0})],C.prototype,"readonly",2);p([m({attribute:"password-toggle",type:Boolean})],C.prototype,"passwordToggle",2);p([m({attribute:"password-visible",type:Boolean})],C.prototype,"passwordVisible",2);p([m({attribute:"no-spin-buttons",type:Boolean})],C.prototype,"noSpinButtons",2);p([m({reflect:!0})],C.prototype,"form",2);p([m({type:Boolean,reflect:!0})],C.prototype,"required",2);p([m()],C.prototype,"pattern",2);p([m({type:Number})],C.prototype,"minlength",2);p([m({type:Number})],C.prototype,"maxlength",2);p([m()],C.prototype,"min",2);p([m()],C.prototype,"max",2);p([m()],C.prototype,"step",2);p([m()],C.prototype,"autocapitalize",2);p([m()],C.prototype,"autocorrect",2);p([m()],C.prototype,"autocomplete",2);p([m({type:Boolean})],C.prototype,"autofocus",2);p([m()],C.prototype,"enterkeyhint",2);p([m({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],C.prototype,"spellcheck",2);p([m()],C.prototype,"inputmode",2);p([V("disabled",{waitUntilFirstUpdate:!0})],C.prototype,"handleDisabledChange",1);p([V("step",{waitUntilFirstUpdate:!0})],C.prototype,"handleStepChange",1);p([V("value",{waitUntilFirstUpdate:!0})],C.prototype,"handleValueChange",1);C.define("sl-input");var sn=D`
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
`;var O=class extends B{constructor(){super(...arguments),this.formControlController=new ie(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new re(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return R`
      <div
        class=${j({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${j({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":this.size==="small","checkbox--medium":this.size==="medium","checkbox--large":this.size==="large"})}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${S(this.value)}
            .indeterminate=${qt(this.indeterminate)}
            .checked=${qt(this.checked)}
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
            ${this.checked?R`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                `:""}
            ${!this.checked&&this.indeterminate?R`
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
    `}};O.styles=[K,oe,sn];O.dependencies={"sl-icon":J};p([q('input[type="checkbox"]')],O.prototype,"input",2);p([mt()],O.prototype,"hasFocus",2);p([m()],O.prototype,"title",2);p([m()],O.prototype,"name",2);p([m()],O.prototype,"value",2);p([m({reflect:!0})],O.prototype,"size",2);p([m({type:Boolean,reflect:!0})],O.prototype,"disabled",2);p([m({type:Boolean,reflect:!0})],O.prototype,"checked",2);p([m({type:Boolean,reflect:!0})],O.prototype,"indeterminate",2);p([ee("checked")],O.prototype,"defaultChecked",2);p([m({reflect:!0})],O.prototype,"form",2);p([m({type:Boolean,reflect:!0})],O.prototype,"required",2);p([m({attribute:"help-text"})],O.prototype,"helpText",2);p([V("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1);p([V(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],O.prototype,"handleStateChange",1);O.define("sl-checkbox");var an=D`
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
`;var E=class extends B{constructor(){super(...arguments),this.formControlController=new ie(this),this.hasSlotController=new re(this,"help-text","label"),this.localize=new $t(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=t=>t.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(t){this.input.style.setProperty("--percent",`${t*100}%`)}syncTooltip(t){if(this.output!==null){let e=this.input.offsetWidth,o=this.output.offsetWidth,i=getComputedStyle(this.input).getPropertyValue("--thumb-size"),r=this.localize.dir()==="rtl",n=e*t;if(r){let s=`${e-n}px + ${t} * ${i}`;this.output.style.translate=`calc((${s} - ${o/2}px - ${i} / 2))`}else{let s=`${n}px - ${t} * ${i}`;this.output.style.translate=`calc(${s} - ${o/2}px + ${i} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){let t=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(t),this.tooltip!=="none"&&this.hasTooltip&&this.updateComplete.then(()=>this.syncTooltip(t))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}focus(t){this.input.focus(t)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e;return R`
      <div
        part="form-control"
        class=${j({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${j({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":this.localize.dir()==="rtl","range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
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
              .value=${qt(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?R`
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
    `}};E.styles=[K,oe,an];p([q(".range__control")],E.prototype,"input",2);p([q(".range__tooltip")],E.prototype,"output",2);p([mt()],E.prototype,"hasFocus",2);p([mt()],E.prototype,"hasTooltip",2);p([m()],E.prototype,"title",2);p([m()],E.prototype,"name",2);p([m({type:Number})],E.prototype,"value",2);p([m()],E.prototype,"label",2);p([m({attribute:"help-text"})],E.prototype,"helpText",2);p([m({type:Boolean,reflect:!0})],E.prototype,"disabled",2);p([m({type:Number})],E.prototype,"min",2);p([m({type:Number})],E.prototype,"max",2);p([m({type:Number})],E.prototype,"step",2);p([m()],E.prototype,"tooltip",2);p([m({attribute:!1})],E.prototype,"tooltipFormatter",2);p([m({reflect:!0})],E.prototype,"form",2);p([ee()],E.prototype,"defaultValue",2);p([ur({passive:!0})],E.prototype,"handleThumbDragStart",1);p([V("value",{waitUntilFirstUpdate:!0})],E.prototype,"handleValueChange",1);p([V("disabled",{waitUntilFirstUpdate:!0})],E.prototype,"handleDisabledChange",1);p([V("hasTooltip",{waitUntilFirstUpdate:!0})],E.prototype,"syncRange",1);E.define("sl-range");var bt=["#00aaff","#ff4444","#44dd44","#ffaa00","#cc44ff","#ff44aa"],ii=600,Ps=document.getElementById("bg").getContext("2d",{alpha:!1}),St=document.getElementById("fg").getContext("2d",{alpha:!0}),Rs=document.getElementById("overlays").getContext("2d"),pi=document.getElementById("msg"),Tt=document.getElementById("waiting"),Ls=document.getElementById("waiting-players"),Os=document.getElementById("end"),ri=document.getElementById("end-label"),zs=document.getElementById("end-winner"),Ms=document.getElementById("end-detail"),Ds=document.getElementById("replay-controls"),Ns=document.getElementById("replay-slider"),un=document.getElementById("replay-time"),Is=document.getElementById("replay-play"),ln=document.getElementById("result-label"),cn=document.getElementById("result-winner"),di=document.getElementById("player-search-input"),Bs=document.getElementById("player-options"),si=document.getElementById("player-list"),co=document.getElementById("decision-interval"),ni=document.getElementById("victory-score"),hn=document.getElementById("debug-tick"),Vs=document.getElementById("inspection-help"),pn=document.querySelector('meta[name="play-server"]').content.trim(),Me=JSON.parse(document.getElementById("play-catalog")?.textContent||"[]"),dn=Me.find(t=>t.kind==="human"),Fs=Me.find(t=>t.kind!=="human"),P=[dn?.spec,Fs?.spec].filter(Boolean),Yt=P.map(()=>0),uo=10,yo=!1,po=!1,H=!1,Pt=!1,it=!1,M=Me.length?!!dn:!0,fo=!0,Ie=null,Le=null,fn=null,ai=0,Re=null,li=null,ci=0,fi=0,mo=[],X=[],G,ce,Be,bo,De=[],mn=[],Oe={},ht={arena_size:80,radius:.6,tick_hz:60},ne=null,ae=!1,wo="s",Us=new Set([" ","arrowleft","arrowright","r"]),he,mi=new URL(pn||location.origin),gn=new URL("/ws",mi);gn.protocol=mi.protocol==="https:"?"wss:":"ws:";var z,gi=!1,hi=!1,wt=P.length?{human:M,specs:M?P.slice(1):P.slice()}:null,go=!1,ze=!1,ui=1;St.imageSmoothingEnabled=!0;function _o(){bo?.reset(),ce?.reset(),Be?.reset(),Ie=null,Le=null,fn=null,mo=[],Re=null,li=null,ci=0,fi=0,ae=!1,St.canvas.style.cursor=""}function jt(t=null){hn.textContent=t===null?"":`\xB7 tick ${t}`,hn.classList.toggle("hidden",t===null)}function yt(t){return t==="you"?"You":t.startsWith("ckpt:")?he.labelFor(t)?he.labelFor(t):t.slice(5).split(/[\\/]/).pop().replace(/\.safetensors$/,""):t.replaceAll("_"," ")}function vi(){De=P.map((t,e)=>{let o=document.createElement("div");o.className=`player${M&&t==="you"?" local":""}`,o.style.setProperty("--player-color",bt[e%bt.length]);let i=document.createElement("span");i.className="line-color-preview";let r=document.createElement("sl-dropdown");r.className="player-settings-dropdown",r.placement="bottom-start",r.hoist=!0,r.stayOpenOnSelect=!0;let n=document.createElement("button");n.className="player-settings",n.type="button",n.textContent="\u2699",n.title=`Options for ${yt(t)}`,n.setAttribute("aria-label",`Options for ${yt(t)}`),n.slot="trigger";let s=document.createElement("span");s.className="player-name",s.textContent=yt(t),s.title=yt(t),s.addEventListener("wheel",u=>{if(s.scrollWidth<=s.clientWidth)return;let h=u.deltaX||u.deltaY,c=s.scrollWidth-s.clientWidth,f=Math.max(0,Math.min(c,s.scrollLeft+h));f!==s.scrollLeft&&(s.scrollLeft=f,u.preventDefault())},{passive:!1});let l=document.createElement("button");l.className=`player-remove${P.length>1?"":" hidden"}`,l.type="button",l.textContent="\xD7",l.title=`Remove ${yt(t)}`,l.setAttribute("aria-label",`Remove ${yt(t)}`),l.addEventListener("click",()=>Xs(e));let a=document.createElement("span");return a.className="player-score",a.textContent=Yt[e]??0,a.setAttribute("aria-label",`${yt(t)} score`),r.append(n,Hs(e)),o.append(i,r,s,l,a),{element:o,score:a,dead:null}}),si.replaceChildren(...De.map(t=>t.element)),Ls.replaceChildren(...P.map((t,e)=>{let o=document.createElement("li");return o.textContent=yt(t),o.style.color=bt[e%bt.length],o})),si.classList.toggle("locked",H)}function Hs(t){let e=document.createElement("div");e.className="player-settings-menu";let o=mn[t]||{};return[["value","Show value glow"]].forEach(([r,n])=>{let s=document.createElement("sl-checkbox");s.checked=!!Oe[t]?.[r],s.disabled=!o[r],s.textContent=o[r]?n:`${n} unavailable`,s.addEventListener("sl-change",()=>{Oe[t]={...Oe[t],[r]:s.checked},Ws(),Be.draw(Ie)}),e.append(s)}),e}function Ws(){z.readyState===WebSocket.OPEN&&z.send(JSON.stringify({type:"visuals",visuals:Oe}))}function se(t){di.disabled=t,si.classList.toggle("locked",t),t&&he.hide()}function vo(t,e){H||!t&&!e.length||(M=t,P=M?["you",...e]:[...e],xo(),Pt=!1,ne=null,wt={human:M,specs:[...e]},go=!1,ze=!1,vi(),Ne(),bn(),vn())}function xo(){Yt=P.map(()=>0),yo=!1,po=!1,De.forEach((t,e)=>{t.score.textContent=Yt[e]??0})}function qs(t){po||(po=!0,!(t<0||t>=Yt.length)&&(Yt[t]+=1,yo=Yt[t]>=uo,De[t].score.textContent=Yt[t]))}function vn(){!wt||go||z?.readyState!==WebSocket.OPEN||(z.send(JSON.stringify({type:"configure",...wt})),go=!0)}function js(t){if(!wt)return!1;let e=wt.human?["you",...wt.specs]:wt.specs;return e.length===t.length&&e.every((o,i)=>o===t[i])}function Ys(t){di.value="",he.hide();let e=M?P.slice(1):P.slice();if(t==="you"){M||vo(!0,e);return}vo(M,[...e,t])}function Xs(t){if(H||P.length<=1)return;if(M&&P[t]==="you"){vo(!1,P.slice(1));return}let e=M?P.slice(1):P.slice();e.splice(M?t-1:t,1),vo(M,e)}function yi(t){t.forEach((e,o)=>{let i=De[o];if(!i)return;let r=!e.alive;i.dead!==r&&(i.dead=r,i.element.classList.toggle("dead",r))})}function yn(t,e,o,i=null){i==="won"?(t.textContent="WIN",e.textContent=""):i==="lost"?(t.textContent="LOST",e.textContent=""):i==="tied"?(t.textContent="TIE",e.textContent=""):(t.textContent=o<0?"TIE":"WINNER: ",e.textContent=o<0?"":yt(P[o])),e.style.color=o<0?"":bt[o%bt.length]}function Ks(t,e){t.textContent="",e.textContent="",e.style.color=""}function bi(t){let e=document.createElement("kbd");return e.className="game-key",e.textContent=t.toUpperCase(),e}function Ve(t,e=null){e===null?Ks(ln,cn):yn(ln,cn,e),pi.textContent=t,Tt.classList.remove("ready","waking","loading"),Tt.classList.toggle("has-result",e!==null),Tt.classList.remove("hidden")}function Js(t=null){Ve("",t),pi.append("Press ",bi(wo)," to start"),Tt.classList.add("ready")}function wi(){Ve("Waking Shai Hulud \u2014 usually a few seconds"),Tt.classList.add("waking")}function bn(){Ve("Loading players..."),Tt.classList.add("loading")}function Gs(){Ve(""),pi.append("Press ",bi(wo)," to wake Shai Hulud"),Tt.classList.add("ready")}function ho(){Tt.classList.add("hidden")}function Zs(t,e,o,i=!1){yn(ri,zs,t,o),i&&(ri.textContent=`MATCH ${ri.textContent}`),Ms.replaceChildren(i?`${uo} points. Drag the timeline to review, or press `:`${e} ticks. Drag the timeline to review, or press `,bi(wo),i?" to start a new match.":" to play again."),Ds.classList.toggle("hidden",X.length===0),G.show(X)}function Ne(){G.hide()}function wn(t){let e=X[t];if(e){_o();for(let o=1;o<=t;o++){let i=X[o-1];X[o].players.forEach((n,s)=>bo.drawSegment(i.players[s],n,s))}ce.draw(e.players),Be.draw(e),Ie=e,Le=e,yi(e.players),un.textContent=`${(e.tick/ht.tick_hz).toFixed(1)}s \xB7 tick ${e.tick}`}}G=xi({end:Os,slider:Ns,time:un,playButton:Is,render:wn,tickHz:()=>ht.tick_hz});function Qs(t){fn=t,fi=performance.now(),mo[0]=t,mo.length=1,X.push(t),Co()}function ta(t){if(ai=0,!H)return;let e=mo.pop();if(e&&(Le&&e.players.forEach((i,r)=>bo.drawSegment(Le.players[r],i,r)),Le=e,li=Re,Re=e,ci=fi,Be.draw(e),Ie=e,yi(e.players)),!Re)return;let o=Ei(Re,li,it?0:t-ci,ht,ui,M);ce.clear(),ce.draw(o.players),it||Co()}function Co(){ai||(ai=requestAnimationFrame(ta))}function ea(t){gi=!0;let e=JSON.parse(t.data);if(e.type==="config")wt||(P=e.seats,xo(),M=e.human??P.includes("you"),wt={human:M,specs:M?P.slice(1):P.slice()}),ze=js(e.seats),fo=e.rewind??!0,Vs.textContent=fo?"Space stops at the next boundary. Then \u2190, \u2191, \u2192, N, and R inspect one tick at a time. C lets you click a controller target.":"Space stops at the next boundary. Then \u2190, \u2191, \u2192, and N inspect one tick at a time. C lets you click a controller target.",e.catalog&&he.setCatalog(e.catalog),ht={...ht,...e.simulator},co.value=e.decision_interval??16,mn=e.visuals||[],Oe={},G.hide(),ce=Ci({context:St,colors:bt,size:ii,simulator:()=>ht}),Be=ki({context:Rs,colors:bt,size:ii,simulator:()=>ht}),bo=$i({context:Ps,colors:bt,size:ii,simulator:()=>ht}),ce.setPlayers(P.length),_o(),jt(),vi(),se(!1),ne=null,ze?Ve("Waiting for players..."):(bn(),vn());else if(e.type==="ready"){if(!ze)return;Pt=!0,se(!1),G.active||(Ne(),Js(ne)),ne=null,hi&&(hi=!1,xn())}else if(e.type==="frame")Qs(e);else if(e.type==="paused")it=!0,jt(e.ticks),ho();else if(e.type==="resumed")it=!1,jt(),ho(),Co();else if(e.type==="rewound"){H=!0,it=!0,Pt=!1,se(!0),ho(),Ne();let o=e.frame;X=X.filter(i=>i.tick<=o.tick),(!X.length||X.at(-1).tick!==o.tick)&&X.push(o),wn(X.length-1),jt(o.tick)}else e.type==="end"&&(H=!1,it=!1,jt(),se(!1),yi(e.players||Ie?.players||[]),ne=e.winner,qs(e.winner),Zs(e.winner,e.ticks,e.outcome,yo))}function oa(){if(Pt=!1,!gi){wi(),setTimeout(_i,1e3);return}H=!1,it=!1,jt(),se(!1),Gs()}function _i(){z&&(z.readyState===WebSocket.CONNECTING||z.readyState===WebSocket.OPEN)||(gi=!1,go=!1,ze=!1,z=new WebSocket(gn),z.onmessage=ea,z.onclose=oa)}var le=new Set;function _n(){let t=le.has("ArrowLeft"),e=le.has("ArrowRight");ui=le.has("ArrowUp")||t&&e?1:t?2:e?0:1,z.send(JSON.stringify({type:"input",action:ui}))}function xn(){!Pt||H||(yo&&xo(),H=!0,it=!1,jt(),se(!0),Pt=!1,ne=null,po=!1,X=[],G.hide(),_o(),ho(),Ne(),Co(),z.send(JSON.stringify({type:"start"})))}function ia(){hi=!0,wi(),_i()}St.canvas.addEventListener("click",t=>{if(!ae||!it||!M)return;let e=St.canvas.getBoundingClientRect(),o=(t.clientX-e.left)/e.width*ht.arena_size,i=(1-(t.clientY-e.top)/e.height)*ht.arena_size;ae=!1,St.canvas.style.cursor="",z.send(JSON.stringify({type:"controller_target",x:o,y:i})),t.preventDefault()});he=Ai({input:di,options:Bs,locked:()=>H,onSelect:Ys,initialCatalog:Me,playersUrl:Me.length?null:new URL("/players",mi)});vi();co.addEventListener("sl-change",()=>{let t=Math.max(1,Math.min(1e4,Number.parseInt(co.value,10)||16));co.value=t,z.send(JSON.stringify({type:"settings",decision_interval:t}))});ni.addEventListener("sl-change",()=>{uo=Math.max(1,Math.min(100,Number.parseInt(ni.value,10)||10)),ni.value=uo,xo()});function ra(t){return t.composedPath().some(e=>e instanceof Element&&e.matches("input, textarea, [contenteditable], sl-input, sl-range, button, sl-button"))}function na(t){return G.active&&t.repeat&&Us.has(t.key.toLowerCase())}addEventListener("keydown",t=>{if(!ra(t)){if(na(t)){t.preventDefault();return}if(t.key.toLowerCase()===wo&&!H&&(Ne(),Pt?xn():ia(),t.preventDefault()),t.key===" "){if(ae){ae=!1,St.canvas.style.cursor="",t.preventDefault();return}G.active?G.toggle():H&&z.send(JSON.stringify({type:it?"continue":"break"})),t.preventDefault();return}if(G.active&&(t.key==="ArrowLeft"||t.key==="ArrowRight")){G.step(t.key==="ArrowLeft"?-1:1),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&fo&&G.active&&!H){H=!0,Pt=!1,z.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}if(H&&it){if(t.key.toLowerCase()==="c"&&M&&!t.repeat){ae=!0,St.canvas.style.cursor="crosshair",t.preventDefault();return}let e={ArrowLeft:2,ArrowUp:1,ArrowRight:0}[t.key];if(e!==void 0){z.send(JSON.stringify({type:"step",action:e})),t.preventDefault();return}if(t.key.toLowerCase()==="n"&&!t.repeat){z.send(JSON.stringify({type:"next"})),t.preventDefault();return}if(t.key.toLowerCase()==="r"&&fo){z.send(JSON.stringify({type:"rewind"})),t.preventDefault();return}}(t.key==="ArrowLeft"||t.key==="ArrowUp"||t.key==="ArrowRight")&&(le.has(t.key)||(le.add(t.key),_n()),t.preventDefault())}});addEventListener("keyup",t=>{le.delete(t.key)&&_n()});pn&&wi();_i();_o();
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
