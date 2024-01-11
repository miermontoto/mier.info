class Snow extends HTMLElement{static random(t,e){return t+Math.floor(Math.random()*(e-t)+1)}static attrs={count:"count",mode:"mode"};generateCss(t,e){let o=[];o.push(`
:host([mode="element"]) {
	display: block;
	position: relative;
	overflow: hidden;
}
:host([mode="page"]) {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
}
:host([mode="page"]),
:host([mode="element"]) > * {
	pointer-events: none;
}
:host([mode="element"]) ::slotted(*) {
	pointer-events: all;
}
* {
	position: absolute;
	width: var(--snow-fall-size, 10px);
	height: var(--snow-fall-size, 10px);
	background: var(--snow-fall-color, rgba(255,255,255,.5));
	border-radius: 50%;
}
`);let n={width:100,height:100},a={x:"vw",y:"vh"};"element"===t&&(n={width:this.firstElementChild.clientWidth,height:this.firstElementChild.clientHeight},a={x:"px",y:"px"});for(let i=1;i<=e;i++){let s=Snow.random(1,100)*n.width/100,l=Snow.random(-10,10)*n.width/100,r=Math.round(Snow.random(30,100)),d=r*n.height/100,h=n.height,$=1e-4*Snow.random(1,1e4),m=Snow.random(10,30),p=-1*Snow.random(0,30);o.push(`
:nth-child(${i}) {
	opacity: ${.001*Snow.random(0,1e3)};
	transform: translate(${s}${a.x}, -10px) scale(${$});
	animation: fall-${i} ${m}s ${p}s linear infinite;
}

@keyframes fall-${i} {
	${r}% {
		transform: translate(${s+l}${a.x}, ${d}${a.y}) scale(${$});
	}

	to {
		transform: translate(${s+l/2}${a.x}, ${h}${a.y}) scale(${$});
	}
}`)}return o.join("\n")}connectedCallback(){if(this.shadowRoot||!("replaceSync"in CSSStyleSheet.prototype))return;let t=parseInt(this.getAttribute(Snow.attrs.count))||100,e;this.hasAttribute(Snow.attrs.mode)?e=this.getAttribute(Snow.attrs.mode):(e=this.firstElementChild?"element":"page",this.setAttribute(Snow.attrs.mode,e));let o=new CSSStyleSheet;o.replaceSync(this.generateCss(e,t));let n=this.attachShadow({mode:"open"});n.adoptedStyleSheets=[o];let a=document.createElement("div");for(let i=0,s=t;i<s;i++)n.appendChild(a.cloneNode());n.appendChild(document.createElement("slot"))}}customElements.define("snow-fall",Snow);
