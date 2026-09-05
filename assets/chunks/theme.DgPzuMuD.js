const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/VPLocalSearchBox.EI8tCb9x.js","assets/chunks/framework.BqC7ICod.js"])))=>i.map(i=>d[i]);
import{d as x,c as p,r as k,n as Z,o as f,a as He,t as C,b as A,w,T as pt,e as z,_ as N,u as An,i as Ho,f as No,g as bt,h as T,j as s,k as g,l as We,m as Qn,p as W,q as he,s as Bn,v as ye,x as vt,y as _t,z as Eo,A as $o,F as V,B as Y,C as Je,D as sn,E as P,G as Fa,H as be,I as Ra,J as mn,K as Le,L as cn,M as Do,N as Be,O as Xn,P as on,Q as Va,R as Hn,S as qa,U as Fo,V as Ro,W as Ga,X as Wa,Y as Vo,Z as et,$ as Oa,a0 as nt,a1 as qo,a2 as Go,a3 as F,a4 as ae,a5 as te,a6 as Re,a7 as nn}from"./framework.BqC7ICod.js";const Wo=x({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(n,t)=>(f(),p("span",{class:Z(["VPBadge",e.type])},[k(n.$slots,"default",{},()=>[He(C(e.text),1)])],2))}}),Oo={key:0,class:"VPBackdrop"},Ko=x({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(n,t)=>(f(),A(pt,{name:"fade"},{default:w(()=>[e.show?(f(),p("div",Oo)):z("",!0)]),_:1}))}}),Io=N(Ko,[["__scopeId","data-v-54a304ca"]]),O=An;function Jo(e,n){let t,o=!1;return()=>{t&&clearTimeout(t),o?t=setTimeout(e,n):(e(),(o=!0)&&setTimeout(()=>o=!1,n))}}function tt(e){return e.startsWith("/")?e:`/${e}`}function yt(e){const{pathname:n,search:t,hash:o,protocol:i}=new URL(e,"http://a.com");if(Ho(e)||e.startsWith("#")||!i.startsWith("http")||!No(n))return e;const{site:r}=O(),l=n.endsWith("/")||n.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${n.replace(/(\.md)?$/,r.value.cleanUrls?"":".html")}${t}${o}`);return bt(l)}function un({correspondingLink:e=!1}={}){const{site:n,localeIndex:t,page:o,theme:i,hash:r}=O(),l=T(()=>{var c,h;return{label:(c=n.value.locales[t.value])==null?void 0:c.label,link:((h=n.value.locales[t.value])==null?void 0:h.link)||(t.value==="root"?"/":`/${t.value}/`)}});return{localeLinks:T(()=>Object.entries(n.value.locales).flatMap(([c,h])=>l.value.label===h.label?[]:{text:h.label,link:Uo(h.link||(c==="root"?"/":`/${c}/`),i.value.i18nRouting!==!1&&e,o.value.relativePath.slice(l.value.link.length-1),!n.value.cleanUrls)+r.value})),currentLang:l}}function Uo(e,n,t,o){return n?e.replace(/\/$/,"")+tt(t.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,o?".html":"")):e}const Yo={class:"NotFound"},Zo={class:"code"},Qo={class:"title"},Xo={class:"quote"},ei={class:"action"},ni=["href","aria-label"],ti=x({__name:"NotFound",setup(e){const{theme:n}=O(),{currentLang:t}=un();return(o,i)=>{var r,l,m,c,h;return f(),p("div",Yo,[s("p",Zo,C(((r=g(n).notFound)==null?void 0:r.code)??"404"),1),s("h1",Qo,C(((l=g(n).notFound)==null?void 0:l.title)??"PAGE NOT FOUND"),1),i[0]||(i[0]=s("div",{class:"divider"},null,-1)),s("blockquote",Xo,C(((m=g(n).notFound)==null?void 0:m.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),s("div",ei,[s("a",{class:"link",href:g(bt)(g(t).link),"aria-label":((c=g(n).notFound)==null?void 0:c.linkLabel)??"go to home"},C(((h=g(n).notFound)==null?void 0:h.linkText)??"Take me home"),9,ni)])])}}}),ai=N(ti,[["__scopeId","data-v-6ff51ddd"]]);function Ka(e,n){if(Array.isArray(e))return Mn(e);if(e==null)return[];n=tt(n);const t=Object.keys(e).sort((i,r)=>r.split("/").length-i.split("/").length).find(i=>n.startsWith(tt(i))),o=t?e[t]:[];return Array.isArray(o)?Mn(o):Mn(o.items,o.base)}function oi(e){const n=[];let t=0;for(const o in e){const i=e[o];if(i.items){t=n.push(i);continue}n[t]||n.push({items:[]}),n[t].items.push(i)}return n}function ii(e){const n=[];function t(o){for(const i of o)i.text&&i.link&&n.push({text:i.text,link:i.link,docFooterText:i.docFooterText}),i.items&&t(i.items)}return t(e),n}function at(e,n){return Array.isArray(n)?n.some(t=>at(e,t)):We(e,n.link)?!0:n.items?at(e,n.items):!1}function Mn(e,n){return[...e].map(t=>{const o={...t},i=o.base||n;return i&&o.link&&(o.link=i+o.link),o.items&&(o.items=Mn(o.items,i)),o})}function Pe(){const{frontmatter:e,page:n,theme:t}=O(),o=Qn("(min-width: 960px)"),i=W(!1),r=T(()=>{const _=t.value.sidebar,j=n.value.relativePath;return _?Ka(_,j):[]}),l=W(r.value);he(r,(_,j)=>{JSON.stringify(_)!==JSON.stringify(j)&&(l.value=r.value)});const m=T(()=>e.value.sidebar!==!1&&l.value.length>0&&e.value.layout!=="home"),c=T(()=>h?e.value.aside==null?t.value.aside==="left":e.value.aside==="left":!1),h=T(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:t.value.aside!==!1),d=T(()=>m.value&&o.value),b=T(()=>m.value?oi(l.value):[]);function y(){i.value=!0}function S(){i.value=!1}function M(){i.value?S():y()}return{isOpen:i,sidebar:l,sidebarGroups:b,hasSidebar:m,hasAside:h,leftAside:c,isSidebarEnabled:d,open:y,close:S,toggle:M}}function ri(e,n){let t;Bn(()=>{t=e.value?document.activeElement:void 0}),ye(()=>{window.addEventListener("keyup",o)}),vt(()=>{window.removeEventListener("keyup",o)});function o(i){i.key==="Escape"&&e.value&&(n(),t==null||t.focus())}}function li(e){const{page:n,hash:t}=O(),o=W(!1),i=T(()=>e.value.collapsed!=null),r=T(()=>!!e.value.link),l=W(!1),m=()=>{l.value=We(n.value.relativePath,e.value.link)};he([n,e,t],m),ye(m);const c=T(()=>l.value?!0:e.value.items?at(n.value.relativePath,e.value.items):!1),h=T(()=>!!(e.value.items&&e.value.items.length));Bn(()=>{o.value=!!(i.value&&e.value.collapsed)}),_t(()=>{(l.value||c.value)&&(o.value=!1)});function d(){i.value&&(o.value=!o.value)}return{collapsed:o,collapsible:i,isLink:r,isActiveLink:l,hasActiveLink:c,hasChildren:h,toggle:d}}function si(){const{hasSidebar:e}=Pe(),n=Qn("(min-width: 960px)"),t=Qn("(min-width: 1280px)");return{isAsideEnabled:T(()=>!t.value&&!n.value?!1:e.value?t.value:n.value)}}const mi=/\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/,ot=[];function Ia(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function kt(e){const n=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(t=>t.id&&t.hasChildNodes()).map(t=>{const o=Number(t.tagName[1]);return{element:t,title:ci(t),link:"#"+t.id,level:o}});return ui(n,e)}function ci(e){let n="";for(const t of e.childNodes)if(t.nodeType===1){if(mi.test(t.className))continue;n+=t.textContent}else t.nodeType===3&&(n+=t.textContent);return n.trim()}function ui(e,n){if(n===!1)return[];const t=(typeof n=="object"&&!Array.isArray(n)?n.level:n)||2,[o,i]=typeof t=="number"?[t,t]:t==="deep"?[2,6]:t;return hi(e,o,i)}function di(e,n){const{isAsideEnabled:t}=si(),o=Jo(r,100);let i=null;ye(()=>{requestAnimationFrame(r),window.addEventListener("scroll",o)}),Eo(()=>{l(location.hash)}),vt(()=>{window.removeEventListener("scroll",o)});function r(){if(!t.value)return;const m=window.scrollY,c=window.innerHeight,h=document.body.offsetHeight,d=Math.abs(m+c-h)<1,b=ot.map(({element:S,link:M})=>({link:M,top:fi(S)})).filter(({top:S})=>!Number.isNaN(S)).sort((S,M)=>S.top-M.top);if(!b.length){l(null);return}if(m<1){l(null);return}if(d){l(b[b.length-1].link);return}let y=null;for(const{link:S,top:M}of b){if(M>m+$o()+4)break;y=S}l(y)}function l(m){i&&i.classList.remove("active"),m==null?i=null:i=e.value.querySelector(`a[href="${decodeURIComponent(m)}"]`);const c=i;c?(c.classList.add("active"),n.value.style.top=c.offsetTop+39+"px",n.value.style.opacity="1"):(n.value.style.top="33px",n.value.style.opacity="0")}}function fi(e){let n=0;for(;e!==document.body;){if(e===null)return NaN;n+=e.offsetTop,e=e.offsetParent}return n}function hi(e,n,t){ot.length=0;const o=[],i=[];return e.forEach(r=>{const l={...r,children:[]};let m=i[i.length-1];for(;m&&m.level>=l.level;)i.pop(),m=i[i.length-1];if(l.element.classList.contains("ignore-header")||m&&"shouldIgnore"in m){i.push({level:l.level,shouldIgnore:!0});return}l.level>t||l.level<n||(ot.push({element:l.element,link:l.link}),m?m.children.push(l):o.push(l),i.push(l))}),o}const gi=["href","title"],pi=x({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function n({target:t}){const o=t.href.split("#")[1],i=document.getElementById(decodeURIComponent(o));i==null||i.focus({preventScroll:!0})}return(t,o)=>{const i=Je("VPDocOutlineItem",!0);return f(),p("ul",{class:Z(["VPDocOutlineItem",e.root?"root":"nested"])},[(f(!0),p(V,null,Y(e.headers,({children:r,link:l,title:m})=>(f(),p("li",null,[s("a",{class:"outline-link",href:l,onClick:n,title:m},C(m),9,gi),r!=null&&r.length?(f(),A(i,{key:0,headers:r},null,8,["headers"])):z("",!0)]))),256))],2)}}}),Ja=N(pi,[["__scopeId","data-v-53c99d69"]]),bi={class:"content"},vi={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},_i=x({__name:"VPDocAsideOutline",setup(e){const{frontmatter:n,theme:t}=O(),o=Fa([]);sn(()=>{o.value=kt(n.value.outline??t.value.outline)});const i=W(),r=W();return di(i,r),(l,m)=>(f(),p("nav",{"aria-labelledby":"doc-outline-aria-label",class:Z(["VPDocAsideOutline",{"has-outline":o.value.length>0}]),ref_key:"container",ref:i},[s("div",bi,[s("div",{class:"outline-marker",ref_key:"marker",ref:r},null,512),s("div",vi,C(g(Ia)(g(t))),1),P(Ja,{headers:o.value,root:!0},null,8,["headers"])])],2))}}),yi=N(_i,[["__scopeId","data-v-f610f197"]]),ki={class:"VPDocAsideCarbonAds"},Si=x({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const n=()=>null;return(t,o)=>(f(),p("div",ki,[P(g(n),{"carbon-ads":e.carbonAds},null,8,["carbon-ads"])]))}}),wi={class:"VPDocAside"},Mi=x({__name:"VPDocAside",setup(e){const{theme:n}=O();return(t,o)=>(f(),p("div",wi,[k(t.$slots,"aside-top",{},void 0,!0),k(t.$slots,"aside-outline-before",{},void 0,!0),P(yi),k(t.$slots,"aside-outline-after",{},void 0,!0),o[0]||(o[0]=s("div",{class:"spacer"},null,-1)),k(t.$slots,"aside-ads-before",{},void 0,!0),g(n).carbonAds?(f(),A(Si,{key:0,"carbon-ads":g(n).carbonAds},null,8,["carbon-ads"])):z("",!0),k(t.$slots,"aside-ads-after",{},void 0,!0),k(t.$slots,"aside-bottom",{},void 0,!0)]))}}),ji=N(Mi,[["__scopeId","data-v-cb998dce"]]);function Li(){const{theme:e,page:n}=O();return T(()=>{const{text:t="Edit this page",pattern:o=""}=e.value.editLink||{};let i;return typeof o=="function"?i=o(n.value):i=o.replace(/:path/g,n.value.filePath),{url:i,text:t}})}function Ci(){const{page:e,theme:n,frontmatter:t}=O();return T(()=>{var h,d,b,y,S,M,_,j;const o=Ka(n.value.sidebar,e.value.relativePath),i=ii(o),r=zi(i,B=>B.link.replace(/[?#].*$/,"")),l=r.findIndex(B=>We(e.value.relativePath,B.link)),m=((h=n.value.docFooter)==null?void 0:h.prev)===!1&&!t.value.prev||t.value.prev===!1,c=((d=n.value.docFooter)==null?void 0:d.next)===!1&&!t.value.next||t.value.next===!1;return{prev:m?void 0:{text:(typeof t.value.prev=="string"?t.value.prev:typeof t.value.prev=="object"?t.value.prev.text:void 0)??((b=r[l-1])==null?void 0:b.docFooterText)??((y=r[l-1])==null?void 0:y.text),link:(typeof t.value.prev=="object"?t.value.prev.link:void 0)??((S=r[l-1])==null?void 0:S.link)},next:c?void 0:{text:(typeof t.value.next=="string"?t.value.next:typeof t.value.next=="object"?t.value.next.text:void 0)??((M=r[l+1])==null?void 0:M.docFooterText)??((_=r[l+1])==null?void 0:_.text),link:(typeof t.value.next=="object"?t.value.next.link:void 0)??((j=r[l+1])==null?void 0:j.link)}}})}function zi(e,n){const t=new Set;return e.filter(o=>{const i=n(o);return t.has(i)?!1:t.add(i)})}const ve=x({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const n=e,t=T(()=>n.tag??(n.href?"a":"span")),o=T(()=>n.href&&Ra.test(n.href)||n.target==="_blank");return(i,r)=>(f(),A(be(t.value),{class:Z(["VPLink",{link:e.href,"vp-external-link-icon":o.value,"no-icon":e.noIcon}]),href:e.href?g(yt)(e.href):void 0,target:e.target??(o.value?"_blank":void 0),rel:e.rel??(o.value?"noreferrer":void 0)},{default:w(()=>[k(i.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Ti={class:"VPLastUpdated"},Pi=["datetime"],xi=x({__name:"VPDocFooterLastUpdated",setup(e){const{theme:n,page:t,lang:o}=O(),i=T(()=>new Date(t.value.lastUpdated)),r=T(()=>i.value.toISOString()),l=W("");return ye(()=>{Bn(()=>{var m,c,h;l.value=new Intl.DateTimeFormat((c=(m=n.value.lastUpdated)==null?void 0:m.formatOptions)!=null&&c.forceLocale?o.value:void 0,((h=n.value.lastUpdated)==null?void 0:h.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(i.value)})}),(m,c)=>{var h;return f(),p("p",Ti,[He(C(((h=g(n).lastUpdated)==null?void 0:h.text)||g(n).lastUpdatedText||"Last updated")+": ",1),s("time",{datetime:r.value},C(l.value),9,Pi)])}}}),Ai=N(xi,[["__scopeId","data-v-1bb0c8a8"]]),Bi={key:0,class:"VPDocFooter"},Hi={key:0,class:"edit-info"},Ni={key:0,class:"edit-link"},Ei={key:1,class:"last-updated"},$i={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},Di={class:"pager"},Fi=["innerHTML"],Ri=["innerHTML"],Vi={class:"pager"},qi=["innerHTML"],Gi=["innerHTML"],Wi=x({__name:"VPDocFooter",setup(e){const{theme:n,page:t,frontmatter:o}=O(),i=Li(),r=Ci(),l=T(()=>n.value.editLink&&o.value.editLink!==!1),m=T(()=>t.value.lastUpdated),c=T(()=>l.value||m.value||r.value.prev||r.value.next);return(h,d)=>{var b,y,S,M;return c.value?(f(),p("footer",Bi,[k(h.$slots,"doc-footer-before",{},void 0,!0),l.value||m.value?(f(),p("div",Hi,[l.value?(f(),p("div",Ni,[P(ve,{class:"edit-link-button",href:g(i).url,"no-icon":!0},{default:w(()=>[d[0]||(d[0]=s("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),He(" "+C(g(i).text),1)]),_:1},8,["href"])])):z("",!0),m.value?(f(),p("div",Ei,[P(Ai)])):z("",!0)])):z("",!0),(b=g(r).prev)!=null&&b.link||(y=g(r).next)!=null&&y.link?(f(),p("nav",$i,[d[1]||(d[1]=s("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),s("div",Di,[(S=g(r).prev)!=null&&S.link?(f(),A(ve,{key:0,class:"pager-link prev",href:g(r).prev.link},{default:w(()=>{var _;return[s("span",{class:"desc",innerHTML:((_=g(n).docFooter)==null?void 0:_.prev)||"Previous page"},null,8,Fi),s("span",{class:"title",innerHTML:g(r).prev.text},null,8,Ri)]}),_:1},8,["href"])):z("",!0)]),s("div",Vi,[(M=g(r).next)!=null&&M.link?(f(),A(ve,{key:0,class:"pager-link next",href:g(r).next.link},{default:w(()=>{var _;return[s("span",{class:"desc",innerHTML:((_=g(n).docFooter)==null?void 0:_.next)||"Next page"},null,8,qi),s("span",{class:"title",innerHTML:g(r).next.text},null,8,Gi)]}),_:1},8,["href"])):z("",!0)])])):z("",!0)])):z("",!0)}}}),Oi=N(Wi,[["__scopeId","data-v-1bcd8184"]]),Ki={class:"container"},Ii={class:"aside-container"},Ji={class:"aside-content"},Ui={class:"content"},Yi={class:"content-container"},Zi={class:"main"},Qi=x({__name:"VPDoc",setup(e){const{theme:n}=O(),t=mn(),{hasSidebar:o,hasAside:i,leftAside:r}=Pe(),l=T(()=>t.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(m,c)=>{const h=Je("Content");return f(),p("div",{class:Z(["VPDoc",{"has-sidebar":g(o),"has-aside":g(i)}])},[k(m.$slots,"doc-top",{},void 0,!0),s("div",Ki,[g(i)?(f(),p("div",{key:0,class:Z(["aside",{"left-aside":g(r)}])},[c[0]||(c[0]=s("div",{class:"aside-curtain"},null,-1)),s("div",Ii,[s("div",Ji,[P(ji,null,{"aside-top":w(()=>[k(m.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":w(()=>[k(m.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":w(()=>[k(m.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":w(()=>[k(m.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":w(()=>[k(m.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":w(()=>[k(m.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):z("",!0),s("div",Ui,[s("div",Yi,[k(m.$slots,"doc-before",{},void 0,!0),s("main",Zi,[P(h,{class:Z(["vp-doc",[l.value,g(n).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),P(Oi,null,{"doc-footer-before":w(()=>[k(m.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),k(m.$slots,"doc-after",{},void 0,!0)])])]),k(m.$slots,"doc-bottom",{},void 0,!0)],2)}}}),Xi=N(Qi,[["__scopeId","data-v-e6f2a212"]]),er=x({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const n=e,t=T(()=>n.href&&Ra.test(n.href)),o=T(()=>n.tag||(n.href?"a":"button"));return(i,r)=>(f(),A(be(o.value),{class:Z(["VPButton",[e.size,e.theme]]),href:e.href?g(yt)(e.href):void 0,target:n.target??(t.value?"_blank":void 0),rel:n.rel??(t.value?"noreferrer":void 0)},{default:w(()=>[He(C(e.text),1)]),_:1},8,["class","href","target","rel"]))}}),nr=N(er,[["__scopeId","data-v-93dc4167"]]),tr=["src","alt"],ar=x({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(n,t)=>{const o=Je("VPImage",!0);return e.image?(f(),p(V,{key:0},[typeof e.image=="string"||"src"in e.image?(f(),p("img",Le({key:0,class:"VPImage"},typeof e.image=="string"?n.$attrs:{...e.image,...n.$attrs},{src:g(bt)(typeof e.image=="string"?e.image:e.image.src),alt:e.alt??(typeof e.image=="string"?"":e.image.alt||"")}),null,16,tr)):(f(),p(V,{key:1},[P(o,Le({class:"dark",image:e.image.dark,alt:e.image.alt},n.$attrs),null,16,["image","alt"]),P(o,Le({class:"light",image:e.image.light,alt:e.image.alt},n.$attrs),null,16,["image","alt"])],64))],64)):z("",!0)}}}),Cn=N(ar,[["__scopeId","data-v-ab19afbb"]]),or={class:"container"},ir={class:"main"},rr={class:"heading"},lr=["innerHTML"],sr=["innerHTML"],mr=["innerHTML"],cr={key:0,class:"actions"},ur={key:0,class:"image"},dr={class:"image-container"},fr=x({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const n=cn("hero-image-slot-exists");return(t,o)=>(f(),p("div",{class:Z(["VPHero",{"has-image":e.image||g(n)}])},[s("div",or,[s("div",ir,[k(t.$slots,"home-hero-info-before",{},void 0,!0),k(t.$slots,"home-hero-info",{},()=>[s("h1",rr,[e.name?(f(),p("span",{key:0,innerHTML:e.name,class:"name clip"},null,8,lr)):z("",!0),e.text?(f(),p("span",{key:1,innerHTML:e.text,class:"text"},null,8,sr)):z("",!0)]),e.tagline?(f(),p("p",{key:0,innerHTML:e.tagline,class:"tagline"},null,8,mr)):z("",!0)],!0),k(t.$slots,"home-hero-info-after",{},void 0,!0),e.actions?(f(),p("div",cr,[(f(!0),p(V,null,Y(e.actions,i=>(f(),p("div",{key:i.link,class:"action"},[P(nr,{tag:"a",size:"medium",theme:i.theme,text:i.text,href:i.link,target:i.target,rel:i.rel},null,8,["theme","text","href","target","rel"])]))),128))])):z("",!0),k(t.$slots,"home-hero-actions-after",{},void 0,!0)]),e.image||g(n)?(f(),p("div",ur,[s("div",dr,[o[0]||(o[0]=s("div",{class:"image-bg"},null,-1)),k(t.$slots,"home-hero-image",{},()=>[e.image?(f(),A(Cn,{key:0,class:"image-src",image:e.image},null,8,["image"])):z("",!0)],!0)])])):z("",!0)])],2))}}),hr=N(fr,[["__scopeId","data-v-dd8814ff"]]),gr=x({__name:"VPHomeHero",setup(e){const{frontmatter:n}=O();return(t,o)=>g(n).hero?(f(),A(hr,{key:0,class:"VPHomeHero",name:g(n).hero.name,text:g(n).hero.text,tagline:g(n).hero.tagline,image:g(n).hero.image,actions:g(n).hero.actions},{"home-hero-info-before":w(()=>[k(t.$slots,"home-hero-info-before")]),"home-hero-info":w(()=>[k(t.$slots,"home-hero-info")]),"home-hero-info-after":w(()=>[k(t.$slots,"home-hero-info-after")]),"home-hero-actions-after":w(()=>[k(t.$slots,"home-hero-actions-after")]),"home-hero-image":w(()=>[k(t.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):z("",!0)}}),pr={class:"box"},br={key:0,class:"icon"},vr=["innerHTML"],_r=["innerHTML"],yr=["innerHTML"],kr={key:4,class:"link-text"},Sr={class:"link-text-value"},wr=x({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(n,t)=>(f(),A(ve,{class:"VPFeature",href:e.link,rel:e.rel,target:e.target,"no-icon":!0,tag:e.link?"a":"div"},{default:w(()=>[s("article",pr,[typeof e.icon=="object"&&e.icon.wrap?(f(),p("div",br,[P(Cn,{image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])])):typeof e.icon=="object"?(f(),A(Cn,{key:1,image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])):e.icon?(f(),p("div",{key:2,class:"icon",innerHTML:e.icon},null,8,vr)):z("",!0),s("h2",{class:"title",innerHTML:e.title},null,8,_r),e.details?(f(),p("p",{key:3,class:"details",innerHTML:e.details},null,8,yr)):z("",!0),e.linkText?(f(),p("div",kr,[s("p",Sr,[He(C(e.linkText)+" ",1),t[0]||(t[0]=s("span",{class:"vpi-arrow-right link-text-icon"},null,-1))])])):z("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Mr=N(wr,[["__scopeId","data-v-bd37d1a2"]]),jr={key:0,class:"VPFeatures"},Lr={class:"container"},Cr={class:"items"},zr=x({__name:"VPFeatures",props:{features:{}},setup(e){const n=e,t=T(()=>{const o=n.features.length;if(o){if(o===2)return"grid-2";if(o===3)return"grid-3";if(o%3===0)return"grid-6";if(o>3)return"grid-4"}else return});return(o,i)=>e.features?(f(),p("div",jr,[s("div",Lr,[s("div",Cr,[(f(!0),p(V,null,Y(e.features,r=>(f(),p("div",{key:r.title,class:Z(["item",[t.value]])},[P(Mr,{icon:r.icon,title:r.title,details:r.details,link:r.link,"link-text":r.linkText,rel:r.rel,target:r.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):z("",!0)}}),Tr=N(zr,[["__scopeId","data-v-b1eea84a"]]),Pr=x({__name:"VPHomeFeatures",setup(e){const{frontmatter:n}=O();return(t,o)=>g(n).features?(f(),A(Tr,{key:0,class:"VPHomeFeatures",features:g(n).features},null,8,["features"])):z("",!0)}}),xr=x({__name:"VPHomeContent",setup(e){const{width:n}=Do({initialWidth:0,includeScrollbar:!1});return(t,o)=>(f(),p("div",{class:"vp-doc container",style:Be(g(n)?{"--vp-offset":`calc(50% - ${g(n)/2}px)`}:{})},[k(t.$slots,"default",{},void 0,!0)],4))}}),Ar=N(xr,[["__scopeId","data-v-c141a4bd"]]),Br=x({__name:"VPHome",setup(e){const{frontmatter:n,theme:t}=O();return(o,i)=>{const r=Je("Content");return f(),p("div",{class:Z(["VPHome",{"external-link-icon-enabled":g(t).externalLinkIcon}])},[k(o.$slots,"home-hero-before",{},void 0,!0),P(gr,null,{"home-hero-info-before":w(()=>[k(o.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":w(()=>[k(o.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":w(()=>[k(o.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":w(()=>[k(o.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":w(()=>[k(o.$slots,"home-hero-image",{},void 0,!0)]),_:3}),k(o.$slots,"home-hero-after",{},void 0,!0),k(o.$slots,"home-features-before",{},void 0,!0),P(Pr),k(o.$slots,"home-features-after",{},void 0,!0),g(n).markdownStyles!==!1?(f(),A(Ar,{key:0},{default:w(()=>[P(r)]),_:1})):(f(),A(r,{key:1}))],2)}}}),Hr=N(Br,[["__scopeId","data-v-e07eaea7"]]),Nr={},Er={class:"VPPage"};function $r(e,n){const t=Je("Content");return f(),p("div",Er,[k(e.$slots,"page-top"),P(t),k(e.$slots,"page-bottom")])}const Dr=N(Nr,[["render",$r]]),Fr=x({__name:"VPContent",setup(e){const{page:n,frontmatter:t}=O(),{hasSidebar:o}=Pe();return(i,r)=>(f(),p("div",{class:Z(["VPContent",{"has-sidebar":g(o),"is-home":g(t).layout==="home"}]),id:"VPContent"},[g(n).isNotFound?k(i.$slots,"not-found",{},()=>[P(ai)],!0,0):g(t).layout==="page"?(f(),A(Dr,{key:1},{"page-top":w(()=>[k(i.$slots,"page-top",{},void 0,!0)]),"page-bottom":w(()=>[k(i.$slots,"page-bottom",{},void 0,!0)]),_:3})):g(t).layout==="home"?(f(),A(Hr,{key:2},{"home-hero-before":w(()=>[k(i.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":w(()=>[k(i.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":w(()=>[k(i.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":w(()=>[k(i.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":w(()=>[k(i.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":w(()=>[k(i.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":w(()=>[k(i.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":w(()=>[k(i.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":w(()=>[k(i.$slots,"home-features-after",{},void 0,!0)]),_:3})):g(t).layout&&g(t).layout!=="doc"?(f(),A(be(g(t).layout),{key:3})):(f(),A(Xi,{key:4},{"doc-top":w(()=>[k(i.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":w(()=>[k(i.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":w(()=>[k(i.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":w(()=>[k(i.$slots,"doc-before",{},void 0,!0)]),"doc-after":w(()=>[k(i.$slots,"doc-after",{},void 0,!0)]),"aside-top":w(()=>[k(i.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":w(()=>[k(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":w(()=>[k(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":w(()=>[k(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":w(()=>[k(i.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":w(()=>[k(i.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Rr=N(Fr,[["__scopeId","data-v-9a6c75ad"]]),Vr={class:"container"},qr=["innerHTML"],Gr=["innerHTML"],Wr=x({__name:"VPFooter",setup(e){const{theme:n,frontmatter:t}=O(),{hasSidebar:o}=Pe();return(i,r)=>g(n).footer&&g(t).footer!==!1?(f(),p("footer",{key:0,class:Z(["VPFooter",{"has-sidebar":g(o)}])},[s("div",Vr,[g(n).footer.message?(f(),p("p",{key:0,class:"message",innerHTML:g(n).footer.message},null,8,qr)):z("",!0),g(n).footer.copyright?(f(),p("p",{key:1,class:"copyright",innerHTML:g(n).footer.copyright},null,8,Gr)):z("",!0)])],2)):z("",!0)}}),Or=N(Wr,[["__scopeId","data-v-566314d4"]]);function Kr(){const{theme:e,frontmatter:n}=O(),t=Fa([]),o=T(()=>t.value.length>0);return sn(()=>{t.value=kt(n.value.outline??e.value.outline)}),{headers:t,hasLocalNav:o}}const Ir={class:"menu-text"},Jr={class:"header"},Ur={class:"outline"},Yr=x({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const n=e,{theme:t}=O(),o=W(!1),i=W(0),r=W(),l=W();function m(b){var y;(y=r.value)!=null&&y.contains(b.target)||(o.value=!1)}he(o,b=>{if(b){document.addEventListener("click",m);return}document.removeEventListener("click",m)}),Xn("Escape",()=>{o.value=!1}),sn(()=>{o.value=!1});function c(){o.value=!o.value,i.value=window.innerHeight+Math.min(window.scrollY-n.navHeight,0)}function h(b){b.target.classList.contains("outline-link")&&(l.value&&(l.value.style.transition="none"),on(()=>{o.value=!1}))}function d(){o.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(b,y)=>(f(),p("div",{class:"VPLocalNavOutlineDropdown",style:Be({"--vp-vh":i.value+"px"}),ref_key:"main",ref:r},[e.headers.length>0?(f(),p("button",{key:0,onClick:c,class:Z({open:o.value})},[s("span",Ir,C(g(Ia)(g(t))),1),y[0]||(y[0]=s("span",{class:"vpi-chevron-right icon"},null,-1))],2)):(f(),p("button",{key:1,onClick:d},C(g(t).returnToTopLabel||"Return to top"),1)),P(pt,{name:"flyout"},{default:w(()=>[o.value?(f(),p("div",{key:0,ref_key:"items",ref:l,class:"items",onClick:h},[s("div",Jr,[s("a",{class:"top-link",href:"#",onClick:d},C(g(t).returnToTopLabel||"Return to top"),1)]),s("div",Ur,[P(Ja,{headers:e.headers},null,8,["headers"])])],512)):z("",!0)]),_:1})],4))}}),Zr=N(Yr,[["__scopeId","data-v-6b867909"]]),Qr={class:"container"},Xr=["aria-expanded"],el={class:"menu-text"},nl=x({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:n,frontmatter:t}=O(),{hasSidebar:o}=Pe(),{headers:i}=Kr(),{y:r}=Va(),l=W(0);ye(()=>{l.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),sn(()=>{i.value=kt(t.value.outline??n.value.outline)});const m=T(()=>i.value.length===0),c=T(()=>m.value&&!o.value),h=T(()=>({VPLocalNav:!0,"has-sidebar":o.value,empty:m.value,fixed:c.value}));return(d,b)=>g(t).layout!=="home"&&(!c.value||g(r)>=l.value)?(f(),p("div",{key:0,class:Z(h.value)},[s("div",Qr,[g(o)?(f(),p("button",{key:0,class:"menu","aria-expanded":e.open,"aria-controls":"VPSidebarNav",onClick:b[0]||(b[0]=y=>d.$emit("open-menu"))},[b[1]||(b[1]=s("span",{class:"vpi-align-left menu-icon"},null,-1)),s("span",el,C(g(n).sidebarMenuLabel||"Menu"),1)],8,Xr)):z("",!0),P(Zr,{headers:g(i),navHeight:l.value},null,8,["headers","navHeight"])])],2)):z("",!0)}}),tl=N(nl,[["__scopeId","data-v-2488c25a"]]);function al(){const e=W(!1);function n(){e.value=!0,window.addEventListener("resize",i)}function t(){e.value=!1,window.removeEventListener("resize",i)}function o(){e.value?t():n()}function i(){window.outerWidth>=768&&t()}const r=mn();return he(()=>r.path,t),{isScreenOpen:e,openScreen:n,closeScreen:t,toggleScreen:o}}const ol={},il={class:"VPSwitch",type:"button",role:"switch"},rl={class:"check"},ll={key:0,class:"icon"};function sl(e,n){return f(),p("button",il,[s("span",rl,[e.$slots.default?(f(),p("span",ll,[k(e.$slots,"default",{},void 0,!0)])):z("",!0)])])}const ml=N(ol,[["render",sl],["__scopeId","data-v-b4ccac88"]]),cl=x({__name:"VPSwitchAppearance",setup(e){const{isDark:n,theme:t}=O(),o=cn("toggle-appearance",()=>{n.value=!n.value}),i=W("");return _t(()=>{i.value=n.value?t.value.lightModeSwitchTitle||"Switch to light theme":t.value.darkModeSwitchTitle||"Switch to dark theme"}),(r,l)=>(f(),A(ml,{title:i.value,class:"VPSwitchAppearance","aria-checked":g(n),onClick:g(o)},{default:w(()=>[...l[0]||(l[0]=[s("span",{class:"vpi-sun sun"},null,-1),s("span",{class:"vpi-moon moon"},null,-1)])]),_:1},8,["title","aria-checked","onClick"]))}}),St=N(cl,[["__scopeId","data-v-be9742d9"]]),ul={key:0,class:"VPNavBarAppearance"},dl=x({__name:"VPNavBarAppearance",setup(e){const{site:n}=O();return(t,o)=>g(n).appearance&&g(n).appearance!=="force-dark"&&g(n).appearance!=="force-auto"?(f(),p("div",ul,[P(St)])):z("",!0)}}),fl=N(dl,[["__scopeId","data-v-3f90c1a5"]]),wt=W();let Ua=!1,Un=0;function hl(e){const n=W(!1);if(Hn){!Ua&&gl(),Un++;const t=he(wt,o=>{var i,r,l;o===e.el.value||(i=e.el.value)!=null&&i.contains(o)?(n.value=!0,(r=e.onFocus)==null||r.call(e)):(n.value=!1,(l=e.onBlur)==null||l.call(e))});vt(()=>{t(),Un--,Un||pl()})}return qa(n)}function gl(){document.addEventListener("focusin",Ya),Ua=!0,wt.value=document.activeElement}function pl(){document.removeEventListener("focusin",Ya)}function Ya(){wt.value=document.activeElement}const bl={class:"VPMenuLink"},vl=["innerHTML"],_l=x({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:n}=O();return(t,o)=>(f(),p("div",bl,[P(ve,{class:Z({active:g(We)(g(n).relativePath,e.item.activeMatch||e.item.link,!!e.item.activeMatch)}),href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon},{default:w(()=>[s("span",{innerHTML:e.item.text},null,8,vl)]),_:1},8,["class","href","target","rel","no-icon"])]))}}),Nn=N(_l,[["__scopeId","data-v-7eeeb2dc"]]),yl={class:"VPMenuGroup"},kl={key:0,class:"title"},Sl=x({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(n,t)=>(f(),p("div",yl,[e.text?(f(),p("p",kl,C(e.text),1)):z("",!0),(f(!0),p(V,null,Y(e.items,o=>(f(),p(V,null,["link"in o?(f(),A(Nn,{key:0,item:o},null,8,["item"])):z("",!0)],64))),256))]))}}),wl=N(Sl,[["__scopeId","data-v-a6b0397c"]]),Ml={class:"VPMenu"},jl={key:0,class:"items"},Ll=x({__name:"VPMenu",props:{items:{}},setup(e){return(n,t)=>(f(),p("div",Ml,[e.items?(f(),p("div",jl,[(f(!0),p(V,null,Y(e.items,o=>(f(),p(V,{key:JSON.stringify(o)},["link"in o?(f(),A(Nn,{key:0,item:o},null,8,["item"])):"component"in o?(f(),A(be(o.component),Le({key:1,ref_for:!0},o.props),null,16)):(f(),A(wl,{key:2,text:o.text,items:o.items},null,8,["text","items"]))],64))),128))])):z("",!0),k(n.$slots,"default",{},void 0,!0)]))}}),Cl=N(Ll,[["__scopeId","data-v-20ed86d6"]]),zl=["aria-expanded","aria-label"],Tl={key:0,class:"text"},Pl=["innerHTML"],xl={key:1,class:"vpi-more-horizontal icon"},Al={class:"menu"},Bl=x({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const n=W(!1),t=W();hl({el:t,onBlur:o});function o(){n.value=!1}return(i,r)=>(f(),p("div",{class:"VPFlyout",ref_key:"el",ref:t,onMouseenter:r[1]||(r[1]=l=>n.value=!0),onMouseleave:r[2]||(r[2]=l=>n.value=!1)},[s("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":n.value,"aria-label":e.label,onClick:r[0]||(r[0]=l=>n.value=!n.value)},[e.button||e.icon?(f(),p("span",Tl,[e.icon?(f(),p("span",{key:0,class:Z([e.icon,"option-icon"])},null,2)):z("",!0),e.button?(f(),p("span",{key:1,innerHTML:e.button},null,8,Pl)):z("",!0),r[3]||(r[3]=s("span",{class:"vpi-chevron-down text-icon"},null,-1))])):(f(),p("span",xl))],8,zl),s("div",Al,[P(Cl,{items:e.items},{default:w(()=>[k(i.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),Mt=N(Bl,[["__scopeId","data-v-bfe7971f"]]),Hl=["href","aria-label","innerHTML"],Nl=x({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const n=e,t=W();ye(async()=>{var r;await on();const i=(r=t.value)==null?void 0:r.children[0];i instanceof HTMLElement&&i.className.startsWith("vpi-social-")&&(getComputedStyle(i).maskImage||getComputedStyle(i).webkitMaskImage)==="none"&&i.style.setProperty("--icon",`url('https://api.iconify.design/simple-icons/${n.icon}.svg')`)});const o=T(()=>typeof n.icon=="object"?n.icon.svg:`<span class="vpi-social-${n.icon}"></span>`);return(i,r)=>(f(),p("a",{ref_key:"el",ref:t,class:"VPSocialLink no-icon",href:e.link,"aria-label":e.ariaLabel??(typeof e.icon=="string"?e.icon:""),target:"_blank",rel:"noopener",innerHTML:o.value},null,8,Hl))}}),El=N(Nl,[["__scopeId","data-v-60a9a2d3"]]),$l={class:"VPSocialLinks"},Dl=x({__name:"VPSocialLinks",props:{links:{}},setup(e){return(n,t)=>(f(),p("div",$l,[(f(!0),p(V,null,Y(e.links,({link:o,icon:i,ariaLabel:r})=>(f(),A(El,{key:o,icon:i,link:o,ariaLabel:r},null,8,["icon","link","ariaLabel"]))),128))]))}}),jt=N(Dl,[["__scopeId","data-v-e71e869c"]]),Fl={key:0,class:"group translations"},Rl={class:"trans-title"},Vl={key:1,class:"group"},ql={class:"item appearance"},Gl={class:"label"},Wl={class:"appearance-action"},Ol={key:2,class:"group"},Kl={class:"item social-links"},Il=x({__name:"VPNavBarExtra",setup(e){const{site:n,theme:t}=O(),{localeLinks:o,currentLang:i}=un({correspondingLink:!0}),r=T(()=>o.value.length&&i.value.label||n.value.appearance||t.value.socialLinks);return(l,m)=>r.value?(f(),A(Mt,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:w(()=>[g(o).length&&g(i).label?(f(),p("div",Fl,[s("p",Rl,C(g(i).label),1),(f(!0),p(V,null,Y(g(o),c=>(f(),A(Nn,{key:c.link,item:c},null,8,["item"]))),128))])):z("",!0),g(n).appearance&&g(n).appearance!=="force-dark"&&g(n).appearance!=="force-auto"?(f(),p("div",Vl,[s("div",ql,[s("p",Gl,C(g(t).darkModeSwitchLabel||"Appearance"),1),s("div",Wl,[P(St)])])])):z("",!0),g(t).socialLinks?(f(),p("div",Ol,[s("div",Kl,[P(jt,{class:"social-links-list",links:g(t).socialLinks},null,8,["links"])])])):z("",!0)]),_:1})):z("",!0)}}),Jl=N(Il,[["__scopeId","data-v-f953d92f"]]),Ul=["aria-expanded"],Yl=x({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(n,t)=>(f(),p("button",{type:"button",class:Z(["VPNavBarHamburger",{active:e.active}]),"aria-label":"mobile navigation","aria-expanded":e.active,"aria-controls":"VPNavScreen",onClick:t[0]||(t[0]=o=>n.$emit("click"))},[...t[1]||(t[1]=[s("span",{class:"container"},[s("span",{class:"top"}),s("span",{class:"middle"}),s("span",{class:"bottom"})],-1)])],10,Ul))}}),Zl=N(Yl,[["__scopeId","data-v-6bee1efd"]]),Ql=["innerHTML"],Xl=x({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:n}=O();return(t,o)=>(f(),A(ve,{class:Z({VPNavBarMenuLink:!0,active:g(We)(g(n).relativePath,e.item.activeMatch||e.item.link,!!e.item.activeMatch)}),href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon,tabindex:"0"},{default:w(()=>[s("span",{innerHTML:e.item.text},null,8,Ql)]),_:1},8,["class","href","target","rel","no-icon"]))}}),es=N(Xl,[["__scopeId","data-v-815115f5"]]),ns=x({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const n=e,{page:t}=O(),o=r=>"component"in r?!1:"link"in r?We(t.value.relativePath,r.link,!!n.item.activeMatch):r.items.some(o),i=T(()=>o(n.item));return(r,l)=>(f(),A(Mt,{class:Z({VPNavBarMenuGroup:!0,active:g(We)(g(t).relativePath,e.item.activeMatch,!!e.item.activeMatch)||i.value}),button:e.item.text,items:e.item.items},null,8,["class","button","items"]))}}),ts={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},as=x({__name:"VPNavBarMenu",setup(e){const{theme:n}=O();return(t,o)=>g(n).nav?(f(),p("nav",ts,[o[0]||(o[0]=s("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),(f(!0),p(V,null,Y(g(n).nav,i=>(f(),p(V,{key:JSON.stringify(i)},["link"in i?(f(),A(es,{key:0,item:i},null,8,["item"])):"component"in i?(f(),A(be(i.component),Le({key:1,ref_for:!0},i.props),null,16)):(f(),A(ns,{key:2,item:i},null,8,["item"]))],64))),128))])):z("",!0)}}),os=N(as,[["__scopeId","data-v-afb2845e"]]);function is(e){const{localeIndex:n,theme:t}=O();function o(i){var M,_,j;const r=i.split("."),l=(M=t.value.search)==null?void 0:M.options,m=l&&typeof l=="object",c=m&&((j=(_=l.locales)==null?void 0:_[n.value])==null?void 0:j.translations)||null,h=m&&l.translations||null;let d=c,b=h,y=e;const S=r.pop();for(const B of r){let E=null;const H=y==null?void 0:y[B];H&&(E=y=H);const I=b==null?void 0:b[B];I&&(E=b=I);const ee=d==null?void 0:d[B];ee&&(E=d=ee),H||(y=E),I||(b=E),ee||(d=E)}return(d==null?void 0:d[S])??(b==null?void 0:b[S])??(y==null?void 0:y[S])??""}return o}const rs=["aria-label"],ls={class:"DocSearch-Button-Container"},ss={class:"DocSearch-Button-Placeholder"},ia=x({__name:"VPNavBarSearchButton",setup(e){const t=is({button:{buttonText:"Search",buttonAriaLabel:"Search"}});return(o,i)=>(f(),p("button",{type:"button",class:"DocSearch DocSearch-Button","aria-label":g(t)("button.buttonAriaLabel")},[s("span",ls,[i[0]||(i[0]=s("span",{class:"vp-icon DocSearch-Search-Icon"},null,-1)),s("span",ss,C(g(t)("button.buttonText")),1)]),i[1]||(i[1]=s("span",{class:"DocSearch-Button-Keys"},[s("kbd",{class:"DocSearch-Button-Key"}),s("kbd",{class:"DocSearch-Button-Key"},"K")],-1))],8,rs))}}),ms={class:"VPNavBarSearch"},cs={id:"local-search"},us={key:1,id:"docsearch"},ds=x({__name:"VPNavBarSearch",setup(e){const n=Fo(()=>Ro(()=>import("./VPLocalSearchBox.EI8tCb9x.js"),__vite__mapDeps([0,1]))),t=()=>null,{theme:o}=O(),i=W(!1),r=W(!1);ye(()=>{});function l(){i.value||(i.value=!0,setTimeout(m,16))}function m(){const b=new Event("keydown");b.key="k",b.metaKey=!0,window.dispatchEvent(b),setTimeout(()=>{document.querySelector(".DocSearch-Modal")||m()},16)}function c(b){const y=b.target,S=y.tagName;return y.isContentEditable||S==="INPUT"||S==="SELECT"||S==="TEXTAREA"}const h=W(!1);Xn("k",b=>{(b.ctrlKey||b.metaKey)&&(b.preventDefault(),h.value=!0)}),Xn("/",b=>{c(b)||(b.preventDefault(),h.value=!0)});const d="local";return(b,y)=>{var S;return f(),p("div",ms,[g(d)==="local"?(f(),p(V,{key:0},[h.value?(f(),A(g(n),{key:0,onClose:y[0]||(y[0]=M=>h.value=!1)})):z("",!0),s("div",cs,[P(ia,{onClick:y[1]||(y[1]=M=>h.value=!0)})])],64)):g(d)==="algolia"?(f(),p(V,{key:1},[i.value?(f(),A(g(t),{key:0,algolia:((S=g(o).search)==null?void 0:S.options)??g(o).algolia,onVnodeBeforeMount:y[2]||(y[2]=M=>r.value=!0)},null,8,["algolia"])):z("",!0),r.value?z("",!0):(f(),p("div",us,[P(ia,{onClick:l})]))],64)):z("",!0)])}}}),fs=x({__name:"VPNavBarSocialLinks",setup(e){const{theme:n}=O();return(t,o)=>g(n).socialLinks?(f(),A(jt,{key:0,class:"VPNavBarSocialLinks",links:g(n).socialLinks},null,8,["links"])):z("",!0)}}),hs=N(fs,[["__scopeId","data-v-ef6192dc"]]),gs=["href","rel","target"],ps=["innerHTML"],bs={key:2},vs=x({__name:"VPNavBarTitle",setup(e){const{site:n,theme:t}=O(),{hasSidebar:o}=Pe(),{currentLang:i}=un(),r=T(()=>{var c;return typeof t.value.logoLink=="string"?t.value.logoLink:(c=t.value.logoLink)==null?void 0:c.link}),l=T(()=>{var c;return typeof t.value.logoLink=="string"||(c=t.value.logoLink)==null?void 0:c.rel}),m=T(()=>{var c;return typeof t.value.logoLink=="string"||(c=t.value.logoLink)==null?void 0:c.target});return(c,h)=>(f(),p("div",{class:Z(["VPNavBarTitle",{"has-sidebar":g(o)}])},[s("a",{class:"title",href:r.value??g(yt)(g(i).link),rel:l.value,target:m.value},[k(c.$slots,"nav-bar-title-before",{},void 0,!0),g(t).logo?(f(),A(Cn,{key:0,class:"logo",image:g(t).logo},null,8,["image"])):z("",!0),g(t).siteTitle?(f(),p("span",{key:1,innerHTML:g(t).siteTitle},null,8,ps)):g(t).siteTitle===void 0?(f(),p("span",bs,C(g(n).title),1)):z("",!0),k(c.$slots,"nav-bar-title-after",{},void 0,!0)],8,gs)],2))}}),_s=N(vs,[["__scopeId","data-v-9f43907a"]]),ys={class:"items"},ks={class:"title"},Ss=x({__name:"VPNavBarTranslations",setup(e){const{theme:n}=O(),{localeLinks:t,currentLang:o}=un({correspondingLink:!0});return(i,r)=>g(t).length&&g(o).label?(f(),A(Mt,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:g(n).langMenuLabel||"Change language"},{default:w(()=>[s("div",ys,[s("p",ks,C(g(o).label),1),(f(!0),p(V,null,Y(g(t),l=>(f(),A(Nn,{key:l.link,item:l},null,8,["item"]))),128))])]),_:1},8,["label"])):z("",!0)}}),ws=N(Ss,[["__scopeId","data-v-acee064b"]]),Ms={class:"wrapper"},js={class:"container"},Ls={class:"title"},Cs={class:"content"},zs={class:"content-body"},Ts=x({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const n=e,{y:t}=Va(),{hasSidebar:o}=Pe(),{frontmatter:i}=O(),r=W({});return _t(()=>{r.value={"has-sidebar":o.value,home:i.value.layout==="home",top:t.value===0,"screen-open":n.isScreenOpen}}),(l,m)=>(f(),p("div",{class:Z(["VPNavBar",r.value])},[s("div",Ms,[s("div",js,[s("div",Ls,[P(_s,null,{"nav-bar-title-before":w(()=>[k(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":w(()=>[k(l.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),s("div",Cs,[s("div",zs,[k(l.$slots,"nav-bar-content-before",{},void 0,!0),P(ds,{class:"search"}),P(os,{class:"menu"}),P(ws,{class:"translations"}),P(fl,{class:"appearance"}),P(hs,{class:"social-links"}),P(Jl,{class:"extra"}),k(l.$slots,"nav-bar-content-after",{},void 0,!0),P(Zl,{class:"hamburger",active:e.isScreenOpen,onClick:m[0]||(m[0]=c=>l.$emit("toggle-screen"))},null,8,["active"])])])])]),m[1]||(m[1]=s("div",{class:"divider"},[s("div",{class:"divider-line"})],-1))],2))}}),Ps=N(Ts,[["__scopeId","data-v-9fd4d1dd"]]),xs={key:0,class:"VPNavScreenAppearance"},As={class:"text"},Bs=x({__name:"VPNavScreenAppearance",setup(e){const{site:n,theme:t}=O();return(o,i)=>g(n).appearance&&g(n).appearance!=="force-dark"&&g(n).appearance!=="force-auto"?(f(),p("div",xs,[s("p",As,C(g(t).darkModeSwitchLabel||"Appearance"),1),P(St)])):z("",!0)}}),Hs=N(Bs,[["__scopeId","data-v-a3e2920d"]]),Ns=["innerHTML"],Es=x({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const n=cn("close-screen");return(t,o)=>(f(),A(ve,{class:"VPNavScreenMenuLink",href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon,onClick:g(n)},{default:w(()=>[s("span",{innerHTML:e.item.text},null,8,Ns)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),$s=N(Es,[["__scopeId","data-v-fa963d97"]]),Ds=["innerHTML"],Fs=x({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const n=cn("close-screen");return(t,o)=>(f(),A(ve,{class:"VPNavScreenMenuGroupLink",href:e.item.link,target:e.item.target,rel:e.item.rel,"no-icon":e.item.noIcon,onClick:g(n)},{default:w(()=>[s("span",{innerHTML:e.item.text},null,8,Ds)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),Za=N(Fs,[["__scopeId","data-v-e04f3e85"]]),Rs={class:"VPNavScreenMenuGroupSection"},Vs={key:0,class:"title"},qs=x({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(n,t)=>(f(),p("div",Rs,[e.text?(f(),p("p",Vs,C(e.text),1)):z("",!0),(f(!0),p(V,null,Y(e.items,o=>(f(),A(Za,{key:o.text,item:o},null,8,["item"]))),128))]))}}),Gs=N(qs,[["__scopeId","data-v-f60dbfa7"]]),Ws=["aria-controls","aria-expanded"],Os=["innerHTML"],Ks=["id"],Is={key:0,class:"item"},Js={key:1,class:"item"},Us={key:2,class:"group"},Ys=x({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const n=e,t=W(!1),o=T(()=>`NavScreenGroup-${n.text.replace(" ","-").toLowerCase()}`);function i(){t.value=!t.value}return(r,l)=>(f(),p("div",{class:Z(["VPNavScreenMenuGroup",{open:t.value}])},[s("button",{class:"button","aria-controls":o.value,"aria-expanded":t.value,onClick:i},[s("span",{class:"button-text",innerHTML:e.text},null,8,Os),l[0]||(l[0]=s("span",{class:"vpi-plus button-icon"},null,-1))],8,Ws),s("div",{id:o.value,class:"items"},[(f(!0),p(V,null,Y(e.items,m=>(f(),p(V,{key:JSON.stringify(m)},["link"in m?(f(),p("div",Is,[P(Za,{item:m},null,8,["item"])])):"component"in m?(f(),p("div",Js,[(f(),A(be(m.component),Le({ref_for:!0},m.props,{"screen-menu":""}),null,16))])):(f(),p("div",Us,[P(Gs,{text:m.text,items:m.items},null,8,["text","items"])]))],64))),128))],8,Ks)],2))}}),Zs=N(Ys,[["__scopeId","data-v-d99bfeec"]]),Qs={key:0,class:"VPNavScreenMenu"},Xs=x({__name:"VPNavScreenMenu",setup(e){const{theme:n}=O();return(t,o)=>g(n).nav?(f(),p("nav",Qs,[(f(!0),p(V,null,Y(g(n).nav,i=>(f(),p(V,{key:JSON.stringify(i)},["link"in i?(f(),A($s,{key:0,item:i},null,8,["item"])):"component"in i?(f(),A(be(i.component),Le({key:1,ref_for:!0},i.props,{"screen-menu":""}),null,16)):(f(),A(Zs,{key:2,text:i.text||"",items:i.items},null,8,["text","items"]))],64))),128))])):z("",!0)}}),em=x({__name:"VPNavScreenSocialLinks",setup(e){const{theme:n}=O();return(t,o)=>g(n).socialLinks?(f(),A(jt,{key:0,class:"VPNavScreenSocialLinks",links:g(n).socialLinks},null,8,["links"])):z("",!0)}}),nm={class:"list"},tm=x({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:n,currentLang:t}=un({correspondingLink:!0}),o=W(!1);function i(){o.value=!o.value}return(r,l)=>g(n).length&&g(t).label?(f(),p("div",{key:0,class:Z(["VPNavScreenTranslations",{open:o.value}])},[s("button",{class:"title",onClick:i},[l[0]||(l[0]=s("span",{class:"vpi-languages icon lang"},null,-1)),He(" "+C(g(t).label)+" ",1),l[1]||(l[1]=s("span",{class:"vpi-chevron-down icon chevron"},null,-1))]),s("ul",nm,[(f(!0),p(V,null,Y(g(n),m=>(f(),p("li",{key:m.link,class:"item"},[P(ve,{class:"link",href:m.link},{default:w(()=>[He(C(m.text),1)]),_:2},1032,["href"])]))),128))])],2)):z("",!0)}}),am=N(tm,[["__scopeId","data-v-516e4bc3"]]),om={class:"container"},im=x({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const n=W(null),t=Ga(Hn?document.body:null);return(o,i)=>(f(),A(pt,{name:"fade",onEnter:i[0]||(i[0]=r=>t.value=!0),onAfterLeave:i[1]||(i[1]=r=>t.value=!1)},{default:w(()=>[e.open?(f(),p("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:n,id:"VPNavScreen"},[s("div",om,[k(o.$slots,"nav-screen-content-before",{},void 0,!0),P(Xs,{class:"menu"}),P(am,{class:"translations"}),P(Hs,{class:"appearance"}),P(em,{class:"social-links"}),k(o.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):z("",!0)]),_:3}))}}),rm=N(im,[["__scopeId","data-v-2dd6d0c7"]]),lm={key:0,class:"VPNav"},sm=x({__name:"VPNav",setup(e){const{isScreenOpen:n,closeScreen:t,toggleScreen:o}=al(),{frontmatter:i}=O(),r=T(()=>i.value.navbar!==!1);return Wa("close-screen",t),Bn(()=>{Hn&&document.documentElement.classList.toggle("hide-nav",!r.value)}),(l,m)=>r.value?(f(),p("header",lm,[P(Ps,{"is-screen-open":g(n),onToggleScreen:g(o)},{"nav-bar-title-before":w(()=>[k(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":w(()=>[k(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":w(()=>[k(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":w(()=>[k(l.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),P(rm,{open:g(n)},{"nav-screen-content-before":w(()=>[k(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":w(()=>[k(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):z("",!0)}}),mm=N(sm,[["__scopeId","data-v-7ad780c2"]]),cm=["role","tabindex"],um={key:1,class:"items"},dm=x({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const n=e,{collapsed:t,collapsible:o,isLink:i,isActiveLink:r,hasActiveLink:l,hasChildren:m,toggle:c}=li(T(()=>n.item)),h=T(()=>m.value?"section":"div"),d=T(()=>i.value?"a":"div"),b=T(()=>m.value?n.depth+2===7?"p":`h${n.depth+2}`:"p"),y=T(()=>i.value?void 0:"button"),S=T(()=>[[`level-${n.depth}`],{collapsible:o.value},{collapsed:t.value},{"is-link":i.value},{"is-active":r.value},{"has-active":l.value}]);function M(j){"key"in j&&j.key!=="Enter"||!n.item.link&&c()}function _(){n.item.link&&c()}return(j,B)=>{const E=Je("VPSidebarItem",!0);return f(),A(be(h.value),{class:Z(["VPSidebarItem",S.value])},{default:w(()=>[e.item.text?(f(),p("div",Le({key:0,class:"item",role:y.value},Vo(e.item.items?{click:M,keydown:M}:{},!0),{tabindex:e.item.items&&0}),[B[1]||(B[1]=s("div",{class:"indicator"},null,-1)),e.item.link?(f(),A(ve,{key:0,tag:d.value,class:"link",href:e.item.link,rel:e.item.rel,target:e.item.target},{default:w(()=>[(f(),A(be(b.value),{class:"text",innerHTML:e.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(f(),A(be(b.value),{key:1,class:"text",innerHTML:e.item.text},null,8,["innerHTML"])),e.item.collapsed!=null&&e.item.items&&e.item.items.length?(f(),p("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:_,onKeydown:et(_,["enter"]),tabindex:"0"},[...B[0]||(B[0]=[s("span",{class:"vpi-chevron-right caret-icon"},null,-1)])],32)):z("",!0)],16,cm)):z("",!0),e.item.items&&e.item.items.length?(f(),p("div",um,[e.depth<5?(f(!0),p(V,{key:0},Y(e.item.items,H=>(f(),A(E,{key:H.text,item:H,depth:e.depth+1},null,8,["item","depth"]))),128)):z("",!0)])):z("",!0)]),_:1},8,["class"])}}}),fm=N(dm,[["__scopeId","data-v-0009425e"]]),hm=x({__name:"VPSidebarGroup",props:{items:{}},setup(e){const n=W(!0);let t=null;return ye(()=>{t=setTimeout(()=>{t=null,n.value=!1},300)}),Oa(()=>{t!=null&&(clearTimeout(t),t=null)}),(o,i)=>(f(!0),p(V,null,Y(e.items,r=>(f(),p("div",{key:r.text,class:Z(["group",{"no-transition":n.value}])},[P(fm,{item:r,depth:0},null,8,["item"])],2))),128))}}),gm=N(hm,[["__scopeId","data-v-51288d80"]]),pm={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},bm=x({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:n,hasSidebar:t}=Pe(),o=e,i=W(null),r=Ga(Hn?document.body:null);he([o,i],()=>{var m;o.open?(r.value=!0,(m=i.value)==null||m.focus()):r.value=!1},{immediate:!0,flush:"post"});const l=W(0);return he(n,()=>{l.value+=1},{deep:!0}),(m,c)=>g(t)?(f(),p("aside",{key:0,class:Z(["VPSidebar",{open:e.open}]),ref_key:"navEl",ref:i,onClick:c[0]||(c[0]=nt(()=>{},["stop"]))},[c[2]||(c[2]=s("div",{class:"curtain"},null,-1)),s("nav",pm,[c[1]||(c[1]=s("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),k(m.$slots,"sidebar-nav-before",{},void 0,!0),(f(),A(gm,{items:g(n),key:l.value},null,8,["items"])),k(m.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):z("",!0)}}),vm=N(bm,[["__scopeId","data-v-42c4c606"]]),_m=x({__name:"VPSkipLink",setup(e){const{theme:n}=O(),t=mn(),o=W();he(()=>t.path,()=>o.value.focus());function i({target:r}){const l=document.getElementById(decodeURIComponent(r.hash).slice(1));if(l){const m=()=>{l.removeAttribute("tabindex"),l.removeEventListener("blur",m)};l.setAttribute("tabindex","-1"),l.addEventListener("blur",m),l.focus(),window.scrollTo(0,0)}}return(r,l)=>(f(),p(V,null,[s("span",{ref_key:"backToTop",ref:o,tabindex:"-1"},null,512),s("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:i},C(g(n).skipToContentLabel||"Skip to content"),1)],64))}}),ym=N(_m,[["__scopeId","data-v-fcbfc0e0"]]),km=x({__name:"Layout",setup(e){const{isOpen:n,open:t,close:o}=Pe(),i=mn();he(()=>i.path,o),ri(n,o);const{frontmatter:r}=O(),l=qo(),m=T(()=>!!l["home-hero-image"]);return Wa("hero-image-slot-exists",m),(c,h)=>{const d=Je("Content");return g(r).layout!==!1?(f(),p("div",{key:0,class:Z(["Layout",g(r).pageClass])},[k(c.$slots,"layout-top",{},void 0,!0),P(ym),P(Io,{class:"backdrop",show:g(n),onClick:g(o)},null,8,["show","onClick"]),P(mm,null,{"nav-bar-title-before":w(()=>[k(c.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":w(()=>[k(c.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":w(()=>[k(c.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":w(()=>[k(c.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":w(()=>[k(c.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":w(()=>[k(c.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),P(tl,{open:g(n),onOpenMenu:g(t)},null,8,["open","onOpenMenu"]),P(vm,{open:g(n)},{"sidebar-nav-before":w(()=>[k(c.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":w(()=>[k(c.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),P(Rr,null,{"page-top":w(()=>[k(c.$slots,"page-top",{},void 0,!0)]),"page-bottom":w(()=>[k(c.$slots,"page-bottom",{},void 0,!0)]),"not-found":w(()=>[k(c.$slots,"not-found",{},void 0,!0)]),"home-hero-before":w(()=>[k(c.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":w(()=>[k(c.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":w(()=>[k(c.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":w(()=>[k(c.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":w(()=>[k(c.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":w(()=>[k(c.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":w(()=>[k(c.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":w(()=>[k(c.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":w(()=>[k(c.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":w(()=>[k(c.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":w(()=>[k(c.$slots,"doc-before",{},void 0,!0)]),"doc-after":w(()=>[k(c.$slots,"doc-after",{},void 0,!0)]),"doc-top":w(()=>[k(c.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":w(()=>[k(c.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":w(()=>[k(c.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":w(()=>[k(c.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":w(()=>[k(c.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":w(()=>[k(c.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":w(()=>[k(c.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":w(()=>[k(c.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),P(Or),k(c.$slots,"layout-bottom",{},void 0,!0)],2)):(f(),A(d,{key:1}))}}}),Sm=N(km,[["__scopeId","data-v-d8b57b2d"]]),Qa={Layout:Sm,enhanceApp:({app:e})=>{e.component("Badge",Wo)}},qe=[{id:"js",label:"JavaScript",pkg:"randino",fence:"javascript",tint:"#F7DF1E"},{id:"dart",label:"Dart",pkg:"randino",fence:"dart",tint:"#0175C2"},{id:"py",label:"Python",pkg:"randino",fence:"python",tint:"#3776AB"}],Xa=qe.map(e=>e.id),Lt="js",Ct="randino-lang";`${JSON.stringify(Xa)}${JSON.stringify(Ct)}${JSON.stringify(Lt)}`;const wm=["width","height"],Mm=["width","height"],jm=["width","height"],ra={__name:"LangMark",props:{language:{type:String,required:!0},size:{type:Number,default:14}},setup(e){const n=e,t=T(()=>{var o;return((o=qe.find(i=>i.id===n.language))==null?void 0:o.tint)??"currentColor"});return(o,i)=>e.language==="js"?(f(),p("svg",{key:0,class:"randino-lang-mark",viewBox:"0 0 24 24",width:e.size,height:e.size,style:Be({color:t.value}),"aria-hidden":"true"},[...i[0]||(i[0]=[s("rect",{width:"24",height:"24",rx:"2",fill:"currentColor"},null,-1),s("path",{fill:"#000",d:"M6.5 17.2l1.6-1c.3.6.6 1 1.3 1s1-.3 1-1.2V10h2v6c0 2.1-1.2 3-3 3-1.7 0-2.7-.9-3.2-2zm7 0l1.6-.9c.4.7 1 1.2 2 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-.9-1.5-1.3l-.5-.2c-1.5-.6-2.5-1.4-2.5-3.1 0-1.6 1.2-2.7 3-2.7 1.3 0 2.3.4 3 1.6l-1.6 1c-.4-.6-.8-.9-1.4-.9s-1 .4-1 .9c0 .6.4.8 1.3 1.2l.5.2c1.8.8 2.8 1.5 2.8 3.2 0 1.9-1.5 3-3.5 3-2 0-3.2-.9-3.8-2.1z"},null,-1)])],12,wm)):e.language==="dart"?(f(),p("svg",{key:1,class:"randino-lang-mark",viewBox:"0 0 24 24",width:e.size,height:e.size,style:Be({color:t.value}),"aria-hidden":"true"},[...i[1]||(i[1]=[s("path",{fill:"currentColor",d:"M4.105 4.105S9.158 1.58 11.684.316a3.1 3.1 0 0 1 1.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818.316-1.105zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263zm12.055-.678c-.899-.896-1.809-1.78-2.74-2.643c-.302-.267-.567-.468-1.07-.462c-.37.014-.87.195-.87.195L6.341 4.105z"},null,-1)])],12,Mm)):e.language==="py"?(f(),p("svg",{key:2,class:"randino-lang-mark",viewBox:"0 0 24 24",width:e.size,height:e.size,style:Be({color:t.value}),"aria-hidden":"true"},[...i[2]||(i[2]=[s("path",{fill:"currentColor",d:"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"},null,-1)])],12,jm)):z("",!0)}},zn=W(Lt),Tn=qa(zn);function it(e){return typeof e=="string"&&Xa.includes(e)}function Lm(e){if(!(!it(e)||e===zn.value)){zn.value=e,typeof document<"u"&&(document.documentElement.dataset.lang=e);try{localStorage.setItem(Ct,e)}catch{}}}function Cm(){if(typeof document>"u")return;let e=null;try{e=localStorage.getItem(Ct)}catch{}const n=it(e)?e:it(document.documentElement.dataset.lang)?document.documentElement.dataset.lang:Lt;zn.value=n,document.documentElement.dataset.lang=n}const zm="en";function zt(e){return e!=null&&e.startsWith("ko")?"ko":zm}const Tm={languageLabel:{ko:"언어",en:"Languages"},languageHint:{ko:"이 선택은 사이트 전체의 코드 예제에 적용됩니다.",en:"The choice applies to every code sample on the site."},languageSelect:{ko:"언어 선택",en:"Select a language"},optionName:{ko:"옵션",en:"Option"},optionType:{ko:"타입",en:"Type"},optionDefault:{ko:"기본값",en:"Default"},optionAbout:{ko:"설명",en:"Description"},optionFromPools:{ko:"단어 풀",en:"pools"},optionLanguage:{ko:"생성할 단어의 언어. 생략하면 언어마다 하나씩 골라 모두 섞습니다.",en:"Language of the generated words. Left out, it picks one per word and mixes them all."},optionTheme:{ko:"단어의 주제. 테마마다 같은 함수가 하나씩 따로 있습니다.",en:"What the words are about. Each theme also has a function of its own."},optionCount:{ko:"돌려줄 단어 개수. 0 … 10000으로 제한됩니다.",en:"How many words to return. Clamped to 0 … 10000."},optionRealism:{ko:"real은 풀에서 단어를 뽑고, invented는 그 언어처럼 읽히기만 하는 단어를 만들어냅니다. mixed는 단어마다 정합니다.",en:"real draws from the pools, invented builds words that only read like the language, and mixed decides per word."},optionMinLength:{ko:"최소 글자 수. 생략하면 단어 풀이 담고 있는 범위를 따릅니다.",en:"Minimum length in characters. Left out, it follows what the pools hold."},optionMaxLength:{ko:"최대 글자 수. 풀이 만족시킬 수 없으면 가장 가까운 단어로 답합니다.",en:"Maximum length in characters. A range the pool cannot serve is answered with the closest word."},optionStartsWith:{ko:"이 글자로 시작하는 단어만 남깁니다.",en:"Keep only words whose first character is this one."},optionUnique:{ko:"같은 단어를 두 번 돌려주지 않습니다. 풀이 바닥나면 요청보다 적게 돌아옵니다.",en:"Never return the same word twice. Returns fewer than asked once a pool runs out."},optionOutput:{ko:"문자열, 또는 단어마다 WordDetail 하나.",en:"Strings, or one WordDetail per word."},demoNames:{ko:"사람 이름",en:"Person names"},demoNicknames:{ko:"닉네임",en:"Nicknames"},demoWords:{ko:"단어",en:"Words"},demoSentences:{ko:"문장",en:"Sentences"},demoIncludeHint:{ko:"반드시 넣을 단어 (공백으로 구분)",en:"words to include, separated by spaces"},demoGenerate:{ko:"생성",en:"Generate"},demoCopy:{ko:"복사",en:"Copy"},demoCopied:{ko:"복사됨",en:"Copied"},demoDetails:{ko:"상세 정보 보기",en:"Show details"},demoDecorate:{ko:"장식 함수",en:"Decorator"},demoDecorateNone:{ko:"없음",en:"none"},demoCall:{ko:"이 결과를 만든 호출",en:"The call behind this"},demoEmpty:{ko:"조건에 맞는 결과가 없습니다. 길이 범위나 startsWith를 넓혀 보세요.",en:"Nothing came back. Widen the length range, or the startsWith filter."},demoShort:{ko:"요청한 개수보다 적게 나왔습니다. unique를 켜면 조합이 바닥났을 때 그렇게 됩니다.",en:"Fewer than asked for — that is what `unique` does once the pools run out."},demoLive:{ko:"이 페이지는 npm에 배포된 버전이 아니라 이 저장소의 JavaScript 패키지를 그대로 실행합니다.",en:"This page runs the repository's own JavaScript package, not a published build."}};function ne(e,n){return Tm[n][e]}const Pm={id:"randino-lang-label",class:"randino-lang-title"},xm=["aria-expanded"],Am={id:"randino-lang-current",class:"randino-lang-current"},Bm=["data-lang"],Hm=["aria-label"],Nm=["aria-selected","onClick"],Em={class:"randino-lang-option-label"},$m={class:"randino-lang-hint"},Dm={__name:"LangSelect",setup(e){const{lang:n}=An(),t=mn(),o=T(()=>zt(n.value)),i=W(!1),r=W(null),l=W(null);function m(){return r.value?[...r.value.querySelectorAll('[role="option"]')]:[]}function c(M){const _=m();_.length&&_[(M+_.length)%_.length].focus()}async function h(M){i.value=!0,await on(),c(qe.findIndex(_=>_.id===Tn.value))}function d(M=!1){var _;i.value&&(i.value=!1,M&&((_=l.value)==null||_.focus()))}function b(M){Lm(M),d(!0)}function y(M){const _=m(),j=_.indexOf(document.activeElement);switch(M.key){case"ArrowDown":M.preventDefault(),c(j+1);break;case"ArrowUp":M.preventDefault(),c(j-1);break;case"Home":M.preventDefault(),c(0);break;case"End":M.preventDefault(),c(_.length-1);break;case"Escape":M.preventDefault(),d(!0);break;case"Tab":d();break}}function S(M){r.value&&!r.value.contains(M.target)&&d()}return ye(()=>document.addEventListener("pointerdown",S)),Oa(()=>document.removeEventListener("pointerdown",S)),he(()=>t.path,()=>d()),(M,_)=>(f(),p("div",{ref_key:"root",ref:r,class:"randino-lang-select"},[s("p",Pm,C(g(ne)(o.value,"languageLabel")),1),s("button",{ref_key:"button",ref:l,type:"button",class:"randino-lang-button","aria-haspopup":"listbox","aria-expanded":i.value,"aria-labelledby":"randino-lang-label randino-lang-current",onClick:_[0]||(_[0]=j=>i.value?d():h()),onKeydown:[_[1]||(_[1]=et(nt(j=>h(),["prevent"]),["down"])),_[2]||(_[2]=et(nt(j=>h(),["prevent"]),["up"]))]},[s("span",Am,[(f(!0),p(V,null,Y(g(qe),j=>(f(),p("span",{key:j.id,class:"randino-lang randino-lang-face","data-lang":j.id},[P(ra,{language:j.id,size:15},null,8,["language"]),s("span",null,C(j.label),1)],8,Bm))),128))]),_[3]||(_[3]=s("svg",{class:"randino-lang-chevron",viewBox:"0 0 24 24","aria-hidden":"true"},[s("path",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",d:"m6 9 6 6 6-6"})],-1))],40,xm),i.value?(f(),p("div",{key:0,class:"randino-lang-menu",onKeydown:y},[s("div",{class:"randino-lang-list",role:"listbox","aria-label":g(ne)(o.value,"languageSelect")},[(f(!0),p(V,null,Y(g(qe),j=>(f(),p("button",{key:j.id,type:"button",role:"option",class:"randino-lang-option","aria-selected":j.id===g(Tn),onClick:B=>b(j.id)},[P(ra,{language:j.id,size:15},null,8,["language"]),s("span",Em,C(j.label),1),_[4]||(_[4]=s("svg",{class:"randino-lang-check",viewBox:"0 0 24 24","aria-hidden":"true"},[s("path",{fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","stroke-linejoin":"round",d:"m5 12.5 4.5 4.5L19 7"})],-1))],8,Nm))),128))],8,Hm),s("p",$m,C(g(ne)(o.value,"languageHint")),1)],32)):z("",!0)],512))}},Fm={__name:"Layout",setup(e){const{Layout:n}=Qa;function t(){var i;const o=document.querySelector(".vp-doc");if(o)for(const r of document.querySelectorAll(".outline-link")){const l=decodeURIComponent(((i=r.getAttribute("href"))==null?void 0:i.slice(1))??""),m=l?o.querySelector(`[id="${CSS.escape(l)}"]`):null,c=m==null?void 0:m.closest(".randino-lang"),h=!!c&&!c.dataset.lang.split(" ").includes(Tn.value);(r.closest("li")??r).classList.toggle("randino-lang-hidden",h)}}return sn(()=>on(t)),he(Tn,()=>on(t)),(o,i)=>(f(),A(g(n),null,{"sidebar-nav-before":w(()=>[P(Dm)]),_:1}))}},Rm=["data-lang"],Vm=["data-lang"],eo=Object.assign({inheritAttrs:!1},{__name:"Lang",props:{code:{type:Boolean,default:!1}},setup(e){const n=Go(),t=T(()=>qe.filter(o=>n[o.id]).map(o=>({id:o.id,text:String(n[o.id])})));return(o,i)=>(f(!0),p(V,null,Y(t.value,r=>(f(),p(V,{key:r.id},[e.code?(f(),p("code",{key:0,class:"randino-lang","data-lang":r.id},C(r.text),9,Rm)):(f(),p("span",{key:1,class:"randino-lang","data-lang":r.id},C(r.text),9,Vm))],64))),128))}}),qm=5,Gm=32,Wm="_",Om="abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",Km=1e4,_e=1,Oe=40,rt=200,no=10;function J(e){return e[Math.floor(Math.random()*e.length)]}function Pn(e,n){let t=0;for(const i of e)t+=Math.max(0,n(i));if(t<=0)return J(e);let o=Math.random()*t;for(const i of e)if(o-=Math.max(0,n(i)),o<0)return i;return e[e.length-1]}function Ce(e,n){return e+Math.floor(Math.random()*(n-e+1))}function ze(e){return Math.random()*100<e}function se(e,n,t){return Math.max(n,Math.min(t,e))}function Ke(e){return e&&e.charAt(0).toUpperCase()+e.slice(1)}function Im(e,n){let t="";for(let o=0;o<e;o+=1)t+=n.charAt(Math.floor(Math.random()*n.length));return t}function Jm(e){return se(Math.floor(e??1),0,Km)}function dn(e){return(e??"").trim().slice(0,1)}const la={real:0,mixed:50,invented:100};function fn(e){return la[e]??la.real}function Ne(e){return e===void 0?void 0:Math.floor(e)}function En(e,n,t,o,i=Oe){const r=se(e??t,_e,i),l=se(n??o,_e,i);return[r,Math.max(r,l)]}function hn(e,n){return e==="all"?J(n):e}function $n(e,n,t){const o=Jm(e.count),i=dn(e.startsWith).toLowerCase(),r=e.unique??!1,l=new Set,m=[],c=o*50+500;let h=0;for(;m.length<o&&h<c;){h+=1;const d=n(),b=t(d);if(b&&!(i&&!b.toLowerCase().startsWith(i))){if(r){if(l.has(b))continue;l.add(b)}m.push(d)}}return m}const Um=/[가-힣]/,Ym=/[぀-ヿ]/,Zm=/[一-鿿]/,Qm=/[\u00C0-\u024F\u1EA0-\u1EF9]/;function Xm(e){return Um.test(e)?"ko":Ym.test(e)?"ja":Zm.test(e)?"zh":Qm.test(e)?"vi":"en"}const sa=44032,ec=55203,nc=28,tc=/[aeiouàáâãäåèéêëìíîïòóôõöùúûüыаеёиоуэюяıəăâêôơư]/;function ac(e){const n=e.trim().slice(-1);if(!n)return!1;const t=n.codePointAt(0);return t>=sa&&t<=ec?(t-sa)%nc!==0:new RegExp("\\p{Letter}","u").test(n)&&!tc.test(n.toLowerCase())}function a(e){return e.trim().split(/\s+/).map(n=>n.replace(/_/g," "))}function Dn(e){const n={},t={};for(const o of Object.keys(e))n[o]=a(e[o]).map(i=>{const r=i.lastIndexOf(":"),l=i.slice(0,r);return t[l]=i.slice(r+1),l});return{pools:n,gender:t}}function ie(e){return a(e).map(n=>{const[t,o]=n.split(":");return{n:t,r:o}})}function Tt(e){const n={};for(const{n:t,r:o}of ie(e))n[t]=Number(o);return n}function oc(e){const n={};for(const{n:t,r:o}of ie(e))n[t]=o;return n}const ma=Dn({animal:`
		Katze:f Hund:m Löwe:m Tiger:m Leopard:m Gepard:m Fuchs:m Wolf:m Bär:m Panda:m Otter:m
		Kaninchen:n Eichhörnchen:n Elefant:m Hirsch:m Reh:n Pferd:n Esel:m Kuh:f Stier:m Ziege:f
		Schaf:n Schwein:n Affe:m Gorilla:m Krokodil:n Schlange:f Eidechse:f Schildkröte:f Frosch:m
		Kröte:f Vogel:m Schwalbe:f Spatz:m Rabe:m Falke:m Adler:m Pfau:m Papagei:m Eule:f Taube:f
		Kranich:m Schwan:m Ente:f Gans:f Huhn:n Fisch:m Wal:m Delfin:m Hai:m Krake:m Tintenfisch:m
		Garnele:f Krabbe:f Schnecke:f Biene:f Ameise:f Spinne:f Libelle:f Zikade:f Fliege:f
		Mücke:f Wurm:m Fledermaus:f Igel:m Waschbär:m Dachs:m Luchs:m Bison:m Elch:m Kamel:n
		Koala:m Faultier:n Frettchen:n Maulwurf:m Reiher:m Pelikan:m Walross:n Wiesel:n Gazelle:f
		Zebra:n Büffel:m Robbe:f Pinguin:m Strauß:m
	`,object:`
		Flasche:f Bleistift:m Radierer:m Regenschirm:m Lampe:f Laterne:f Spiegel:m Schlüssel:m
		Schloss:n Tasche:f Knopf:m Nadel:f Faden:m Pinsel:m Farbe:f Papier:n Heft:n Brief:m
		Postkarte:f Briefmarke:f Karte:f Fernrohr:n Mikroskop:n Kamera:f Film:m Radio:n Ballon:m
		Drachen:m Kreisel:m Murmel:f Würfel:m Puzzle:n Segel:n Anker:m Zelt:n Fackel:f
		Streichholz:n Kerze:f Topf:m Kanne:f Tasse:f Löffel:m Teller:m Zahnrad:n Feder:f Magnet:m
		Band:n Umschlag:m Kissen:n Decke:f Korb:m Besen:m Pfeife:f Seil:n Eimer:m Fächer:m
		Schild:m Netz:n Angel:f Krug:m Kamm:m Glöckchen:n Trichter:m Tablett:n Schachtel:f Fass:n
		Dose:f Fläschchen:n
	`,nature:`
		Meer:n Fluss:m See:m Wasserfall:m Tal:n Berg:m Hügel:m Wiese:f Wald:m Höhle:f Wüste:f
		Sand:m Fels:m Kiesel:m Vulkan:m Erdbeben:n Gletscher:m Riff:n Sumpf:m Bach:m Bucht:f
		Düne:f Gipfel:m Heide:f Steppe:f Savanne:f Mündung:f Delta:n Lagune:f Atoll:n Fjord:m
		Landzunge:f Halbinsel:f Landenge:f Inselgruppe:f Eiland:n Hochebene:f Schlucht:f Klippe:f
		Spalte:f Moräne:f Geröll:n Findling:m Sandbank:f Untiefe:f Abgrund:m Geysir:m Doline:f
		Tropfstein:m Grotte:f Sims:n Hang:m Schatten:m Echo:n Glut:f Quelle:f Ufer:n Küste:f
	`,plant:`
		Baum:m Blatt:n Blume:f Wurzel:f Samen:m Frucht:f Moos:n Farn:m Bambus:m Föhre:f
		Ahorn:m Kirschbaum:m Rose:f Lotus:m Chrysantheme:f Orchidee:f Löwenzahn:m Sonnenblume:f
		Seerose:f Gras:n Zweig:m Trieb:m Knospe:f Blütenblatt:n Pollen:m Zapfen:m Eichel:f
		Ginkgo:m Weide:f Birke:f Zeder:f Tanne:f Eiche:f Kastanie:f Walnuss:f Rasen:m Alge:f
		Hecke:f Blumenstrauß:m Kaktus:m Aloe:f Basilikum:n Thymian:m Oregano:m Petersilie:f
		Koriander:m Schnittlauch:m Fenchel:m Dill:m Salbei:m Estragon:m Minze:f Kamille:f
		Lavendel:m Efeu:m Palme:f
	`,gem:`
		Gold:n Silber:n Kupfer:n Eisen:n Stahl:m Bronze:f Messing:n Zinn:n Zink:n Platin:n
		Kristall:m Quarz:m Amethyst:m Achat:m Bernstein:m Perle:f Jade:f Opal:m Obsidian:m
		Marmor:m Granit:m Kalkstein:m Basalt:m Feuerstein:m Meteorit:m Erz:n Edelstein:m Barren:m
		Glimmer:m Flussspat:m Kalzit:m Malachit:m Granat:m Schwefel:m Elfenbein:n Nugget:n
		Graphit:m Quecksilber:n Gips:m Ader:f Olivin:m Turmalin:m Rubin:m Saphir:m Smaragd:m
		Topas:m Zirkon:m Pyrit:m Magnetit:m Hämatit:m Zinnober:m Bleiglanz:m Talk:m Wismut:n
	`,concept:`
		Freiheit:f Frieden:m Wahrheit:f Weisheit:f Erinnerung:f Fantasie:f Erzählung:f Gedicht:n
		Skizze:f Grammatik:f Logik:f Physik:f Chemie:f Biologie:f Philosophie:f Mathematik:f
		Geometrie:f Algebra:f Geschichte:f Mythos:m Legende:f Fabel:f Sprichwort:n Rätsel:n
		Geheimnis:n Versprechen:n Reise:f Abenteuer:n Überfahrt:f Entdeckung:f Versuch:m Frage:f
		Antwort:f Debatte:f Rat:m Fest:n Dimension:f Harmonie:f Ritus:m Brauch:m Kultur:f
		Sprache:f Alphabet:n Chiffre:f Archiv:n Kalender:m Horizont:m Ahnung:f Vernunft:f Urteil:n
		Lehre:f Lehrsatz:m Axiom:n Hypothese:f Paradox:n Dilemma:n Vorbild:n Prämisse:f
		Ableitung:f Analogie:f Metapher:f Sinnbild:n Chronik:f Zeugnis:n Manifest:n Vertrag:m
		Bündnis:n Abstammung:f Erbe:n Zeremonie:f Schwelle:f
	`,myth:`
		Drache:m Phönix:m Einhorn:n Meerjungfrau:f Fee:f Kobold:m Elf:m Zwerg:m Troll:m Oger:m
		Riese:m Chimäre:f Hydra:f Greif:m Zentaur:m Minotaurus:m Sphinx:f Pegasus:m
		Basilisk:m Golem:m Vampir:m Werwolf:m Gespenst:n Geist:m Seele:f Dämon:m Engel:m Göttin:f
		Gott:m Zauber:m Fluch:m Weissagung:f Orakel:n Amulett:n Talisman:m Rune:f Pforte:f
		Heiligtum:n Götze:m Totem:n Nymphe:f Najade:f Dryade:f Walküre:f Muse:f Hexer:m Hexe:f
		Nekromant:m Alchemist:m Weiser:m Vorzeichen:n Omen:n Bestiarium:n
	`,job:`
		Ritter:m Jäger:m Dieb:m Pirat:m Matrose:m Kapitän:m Koch:m Gärtner:m Schmied:m Detektiv:m
		Dichter:m Maler:m Tänzer:m Clown:m Reisender:m Pilger:m Mönch:m Bogenschütze:m Fechter:m
		Krieger:m General:m Soldat:m Wache:f Pförtner:m König:m Königin:f Prinz:m Prinzessin:f
		Kaiser:m Butler:m Magd:f Diener:m Händler:m Bauer:m Fischer:m Hirte:m Holzfäller:m
		Fährmann:m Kutscher:m Pilot:m Ingenieur:m Briefträger:m Bote:m Kehrer:m Polizist:m Arzt:m
		Pfleger:m Apotheker:m Tierarzt:m Lehrer:m Schüler:m Bibliothekar:m Reporter:m Lektor:m
		Übersetzer:m Sänger:m Schauspieler:m Regisseur:m Musiker:m Bergmann:m Tischler:m Töpfer:m
		Schneider:m Wahrsager:m Prophet:m Priester:m Gelehrter:m Doktor:m Erfinder:m Forscher:m
		Sportler:m Akrobat:m Bildhauer:m Uhrmacher:m Bäcker:m Brauer:m Gerber:m Weber:m
	`,music:`
		Klavier:n Gitarre:f Trommel:f Glocke:f Harfe:f Lied:n Tanz:m Rhythmus:m Melodie:f Akkord:m
		Flöte:f Trompete:f Saxofon:n Klarinette:f Oboe:f Cello:n Bratsche:f Geige:f Becken:n
		Tamburin:n Xylofon:n Orgel:f Akkordeon:n Laute:f Mandoline:f Banjo:n Partitur:f Note:f
		Pause:f Tonleiter:f Chor:m Solo:n Konzert:n Bühne:f Sinfonie:f Sonate:f Walzer:m Ballade:f
		Wiegenlied:n Marsch:m Vorspiel:n Klangfarbe:f Takt:m Orchester:n Satz:m Ouvertüre:f Fuge:f
		Etüde:f Nachtstück:n Ständchen:n Rhapsodie:f Hymne:f Requiem:n Kantate:f Arie:f Duett:n
		Trio:n Quartett:n Quintett:n Dirigent:m Oktave:f Halbton:m Notenlinie:f Metronom:n Pedal:n
		Saite:f Mundstück:n
	`,place:`
		Markt:m Platz:m Stadt:f Dorf:n Gasse:f Brücke:f Garten:m Bücherei:f Museum:n Theater:n
		Schule:f Park:m Hafen:m Kai:m Bahnhof:m Flughafen:m Leuchtturm:m Burg:f Mauer:f Palast:m
		Tempel:m Turm:m Speicher:m Keller:m Terrasse:f Hof:m Veranda:f Gewächshaus:n Scheune:f
		Hütte:f Spielplatz:m Turnhalle:f Schwimmbad:n Aquarium:n Galerie:f Zoo:m Badehaus:n
		Rathaus:n Postamt:n Krankenhaus:n Apotheke:f Buchladen:m Bäckerei:f Café:n Gasthaus:n
		Küche:f Schlafzimmer:n Wohnzimmer:n Flur:m Treppe:f Tunnel:m Steg:m Kreuzung:f Allee:f
		Festung:f Bauernhof:m Obstgarten:m Abtei:f Kreuzgang:m Bastion:f Warte:f Graben:m Werft:f
		Lager:n Villa:f Landhaus:n Weiler:m
	`,food:`
		Reis:m Brot:n Nudel:f Suppe:f Eintopf:m Salat:m Salz:n Zucker:m Pfeffer:m Knoblauch:m
		Zwiebel:f Kartoffel:f Karotte:f Gurke:f Kürbis:m Kohl:m Spinat:m Pilz:m Ei:n Käse:m
		Butter:f Joghurt:m Apfel:m Erdbeere:f Traube:f Melone:f Pfirsich:m Orange:f Zitrone:f
		Banane:f Mango:f Kirsche:f Ananas:f Schokolade:f Bonbon:n Keks:m Kuchen:m Pudding:m
		Donut:m Waffel:f Pfannkuchen:m Hamburger:m Pizza:f Nudelgericht:n Curry:n Omelett:n
		Brezel:f Brötchen:n Semmel:f Strudel:m Torte:f Wurst:f Schinken:m Speck:m Salami:f
		Frikadelle:f Schnitzel:n Braten:m Marmelade:f Honig:m Sahne:f Quark:m Sauerkraut:n Knödel:m
	`,sport:`
		Fußball:m Baseball:m Basketball:m Volleyball:m Tischtennis:n Tennis:n Federball:m Golf:n
		Kegeln:n Billard:n Schwimmen:n Marathon:m Turnen:n Karate:n Judo:n Fechten:n Ringen:n
		Boxen:n Schießen:n Reiten:n Rudern:n Surfen:n Skifahren:n Hockey:n Rugby:n Kricket:n
		Radsport:m Klettern:n Schläger:m Tor:n Medaille:f Pokal:m Meister:m Endspiel:n Vorrunde:f
		Training:n Polo:n Eislauf:m Tauchen:n Dart:m Hürde:f Speer:m Diskus:m Staffel:f
		Anzeigetafel:f Helm:m Foul:n Gewichtheben:n Schlitten:m Aufschlag:m Sprung:m Lauf:m Ziel:n
		Podest:n Umkleide:f Tribüne:f Anhänger:m
	`,vehicle:`
		Fahrrad:n Zug:m Boot:n Auto:n Bus:m Taxi:n Lastwagen:m Motorrad:n Roller:m Flugzeug:n
		Hubschrauber:m Raumschiff:n Rakete:f Unterseeboot:n Jacht:f Frachter:m Segler:m Floß:n
		Kriegsschiff:n Panzer:m Kutsche:f Karren:m Schubkarre:f Traktor:m Bagger:m Krankenwagen:m
		Seilbahn:f Straßenbahn:f Lokomotive:f Kanu:n Kajak:n Luftschiff:n Fallschirm:m Sänfte:f
		Dreirad:n Lieferwagen:m Limousine:f Schneepflug:m Katamaran:m Eisbrecher:m Tanker:m
		Lastkahn:m Fischkutter:m Doppeldecker:m Sonde:f Fähre:f Pistenraupe:f Einrad:n Schlepper:m
		Gondel:f Waggon:m
	`,product:`
		Rechner:m Tastatur:f Maus:f Bildschirm:m Drucker:m Lautsprecher:m Kopfhörer:m Mikrofon:n
		Drohne:f Tablet:n Handy:n Ladegerät:n Batterie:f Kühlschrank:m Staubsauger:m Ventilator:m
		Ofen:m Wasserfilter:m Reiskocher:m Mikrowelle:f Backofen:m Mixer:m Rasierer:m Zahnbürste:f
		Zahnpasta:f Seife:f Shampoo:n Parfüm:n Armbanduhr:f Beamer:m Router:m Scanner:m Trockner:m
		Föhn:m Lotion:f Sonnencreme:f Hausschuh:m Sandale:f Matratze:f Vorhang:m Türklingel:f
		Thermometer:n Feuerlöscher:m Glühbirne:f Steckdose:f Steckleiste:f Bettdecke:f Bezug:m
		Handtuch:n Waschbecken:n Waschmittel:n Weichspüler:m Pfanne:f Schneebesen:m Schäler:m
		Korkenzieher:m Thermoskanne:f Fußmatte:f Kleiderbügel:m Schrank:m Regal:n Nachttisch:m
	`,color:`
		Karmesin:n Scharlach:n Zinnoberrot:n Purpur:n Magenta:n Fuchsia:n Rosa:n Lachs:n
		 Ocker:n Siena:n Sepia:n Senfgelb:n Olivgrün:n Limone:f Smaragdgrün:n
		Türkis:n Zyan:n Himmelblau:n Indigo:n Flieder:n Malve:f Veilchen:n Weinrot:n Rost:m
		Terrakotta:n Creme:f Beige:n Khaki:n Anthrazit:n Zinngrau:n Ebenholz:n Rabenschwarz:n
		Azurblau:n Safrangelb:n Aquamarin:n Grünspan:m Perlmutt:n Kupferrot:n Goldgelb:n
		Silbergrau:n Bronzeton:m Aschgrau:n Rauchgrau:n Sandton:m Weizengelb:n Zimtbraun:n
		Muskatbraun:n Paprikarot:n Nachtblau:n Moosgrün:n Tannengrün:n Schneeweiß:n
	`,finance:`
		Rechnung:f Quittung:f Anleihe:f Aktie:f Dividende:f Zins:m Darlehen:n Hypothek:f Einlage:f
		Ersparnis:f Konto:n Saldo:m Haushalt:m Prüfung:f Vermögen:n Schuldposten:m Kapital:n
		Ertrag:m Gewinn:m Spanne:f Überschuss:m Fehlbetrag:m Schuld:f Kredit:m Lastschrift:f
		Scheck:m Münze:f Währung:f Rendite:f Depot:n Zoll:m Erstattung:f Prämie:f Rente:f
		Lohnliste:f Gehalt:n Lohn:m Bonus:m Provision:f Lizenzgebühr:f Franchise:f Fusion:f
		Übernahme:f Rettung:f Sicherheit:f Gutschein:m Tresor:m Staatskasse:f
		Überweisung:f Abrechnung:f Arbitrage:f Kontoauszug:m Sparbuch:n Verwahrung:f Gläubiger:m
		Schuldner:m Verleiher:m Bürge:m Bewertung:f Schätzung:f Inflation:f Rezession:f
		Liquidität:f Konkurs:m Spende:f Zuschuss:m Ausgabe:f Rabatt:m Rate:f
	`,tech:`
		Server:m Puffer:m Bildpunkt:m Codec:m Paket:n Protokoll:n Stapel:m Halde:f Zeiger:m
		Firmware:f Bandbreite:f Latenz:f Gateway:n Brandmauer:f Teilnetz:n Rechnername:m Nutzlast:f
		Prüfsumme:f Schema:n Sicherung:f Verbund:m Splitter:m Abbild:n Behälter:m Sandkasten:m
		Pipeline:f Ablage:f Fehlersucher:m Makro:n Feld:n Matrix:f Ganzzahl:f Syntax:f
		Parser:m Assembler:m Befehl:m Bitrate:f Durchsatz:m Handschlag:m Namensraum:m
		Vermittler:m Endpunkt:m Streuwert:m Darstellung:f Shader:m Textur:f Vieleck:n
		Gitternetz:n Oktett:n Wegewahl:f Vermittlung:f Rundruf:m Datagramm:n Bootloader:m
		Dateisystem:n Partition:f Verzeichnis:n Prüfpunkt:m Rollback:n Migration:f
	`,weather:`
		Wolke:f Wind:m Regen:m Schnee:m Reif:m Nebel:m Tau:m Regenbogen:m Blitz:m Donner:m
		Schauer:m Monsun:m Taifun:m Wirbelwind:m Schneesturm:m Nieselregen:m Hagel:m Graupel:m
		Sturm:m Bö:f Zyklon:m Gewitter:n Unwetter:n Sintflut:f Dunst:m Schwaden:m Feuchte:f
		Vorhersage:f Bewölkung:f Sonnenschein:m Hitzewelle:f Frost:m Tauwetter:n Windstoß:m
		Brise:f Zephir:m Passat:m Fallwind:m Hochdruck:m Tiefdruck:m Klima:n Temperatur:f
		Luftdruck:m Wolkenbruch:m Schwüle:f Raureif:m Morgentau:m Abendrot:n Wetter:n
	`,space:`
		Stern:m Mond:m Sonne:f Galaxie:f Komet:m Meteor:m Polarlicht:n Mondsichel:f Sternenstaub:m
		Milchstraße:f Finsternis:f Weltall:n Planet:m Trabant:m Kleinplanet:m
		Sternhaufen:m Sternbild:n Umlaufbahn:f Schwerkraft:f Drehung:f Umlauf:m Sonnenfleck:m
		Krater:m Lichtjahr:n Gestirn:n Firmament:n Ekliptik:f Meridian:m Stratosphäre:f
		Lufthülle:f Leere:f Vollmond:m Neumond:m Halbmond:m Mondlicht:n Sternenlicht:n
		Polarstern:m Abendstern:m Morgenstern:m Mars:m Venus:f Jupiter:m Saturn:m Merkur:m
		Uranus:m Neptun:m Pluto:m Supernova:f Weltraum:m
	`,time:`
		Morgengrauen:n Morgenröte:f Dämmerung:f Einbruch:m Sonnenwende:f Jahreszeit:f Augenblick:m
		Ewigkeit:f Zukunft:f Nu:n Jahrhundert:n Jahrzehnt:n Morgen:m Mittag:m Nachmittag:m Abend:m
		Nacht:f Mitternacht:f Frühe:f Vorabend:m Gestern:n Heute:n Tageslauf:m Woche:f Monat:m
		Vierteljahr:n Halbjahr:n Jahr:n Jahrtausend:n Epoche:f Ära:f Zeitalter:n Frühling:m
		Sommer:m Herbst:m Winter:m Vorzeit:f Jetzt:n Kindheit:f Jugend:f Reife:f Alter:n Frist:f
		Zeitraum:m Dauer:f Zeitspanne:f Jahrestag:m Gedenktag:m Saison:f Tagesanbruch:m
	`,emotion:`
		Freude:f Trauer:f Zorn:m Furcht:f Überraschung:f Frohsinn:m Jubel:m Glück:n Rausch:m
		Verzückung:f Trost:m Hoffnung:f Verzweiflung:f Kummer:m Schwermut:f Wehmut:f Einsamkeit:f
		Sehnsucht:f Verlangen:n Leidenschaft:f Zuneigung:f Zärtlichkeit:f Wärme:f Güte:f
		Mitgefühl:n Einfühlung:f Mitleid:n Dankbarkeit:f Demut:f Geduld:f Klugheit:f Mäßigung:f
		Redlichkeit:f Staunen:n Ehrfurcht:f Gelassenheit:f Ruhe:f Stille:f Vertrauen:n Zweifel:m
		Verdacht:m Sorge:f Angst:f Schrecken:m Panik:f Wut:f Ärger:m Verdruss:m Langeweile:f
		Begeisterung:f Eifer:m Inbrunst:f Gefühl:n Illusion:f Mut:m Scham:f Stolz:m Neid:m
		Eifersucht:f Gier:f Laune:f
	`,body:`
		Kopf:m Stirn:f Braue:f Wimper:f Lid:n Nase:f Wange:f Kinn:n Kiefer:m Lippe:f Zunge:f
		Zahn:m Zahnfleisch:n Ohr:n Ohrläppchen:n Hals:m Nacken:m Schulter:f Ellbogen:m
		Handgelenk:n Handfläche:f Knöchel:m Finger:m Daumen:m Fingernagel:m Faust:f Brust:f
		Rippe:f Bauch:m Nabel:m Rücken:m Taille:f Hüfte:f Schenkel:m Knie:n Schienbein:n Wade:f
		Fessel:f Ferse:f Zehe:f Knochen:m Schädel:m Muskel:m Sehne:f Gelenk:n Knorpel:m Herz:n
		Lunge:f Leber:f Magen:m Niere:f Milz:f Darm:m Blase:f Gehirn:n Nerv:m Vene:f Arterie:f
		Blut:n Fleisch:n Haut:f Pore:f Haar:n Bart:m Träne:f Schweiß:m Speichel:m Atem:m Puls:m
		Herzschlag:m Kniescheibe:f Jochbein:n Trommelfell:n Augapfel:m Falte:f Grübchen:n Narbe:f
		Bluterguss:m Schwiele:f
	`,clothing:`
		Hut:m Schuh:m Handschuh:m Schal:m Brille:f Mantel:m Jacke:f Hemd:n Bluse:f Kittel:m Hose:f
		Jeans:p Rock:m Kleid:n Weste:f Strickjacke:f Pullover:m Kapuzenpulli:m Socke:f Strumpf:m
		Unterwäsche:f Schlafanzug:m Schürze:f Kopftuch:n Krawatte:f Gürtel:m Schärpe:f Stiefel:m
		Turnschuh:m Pantoffel:m Uniform:f Kostüm:n Robe:f Umhang:m Poncho:m Regenmantel:m Anorak:m
		Parka:m Badeanzug:m Taucheranzug:m Overall:m Ärmel:m Kragen:m Manschette:f Saum:m Futter:n
		Stoff:m Leinen:n Seide:f Baumwolle:f Wolle:f Samt:m Kord:m Flanell:m Leder:n Barett:n
		Mütze:f Kappe:f Turban:m Schleier:m Tuch:n
	`,tool:`
		Axt:f Schaufel:f Säge:f Leiter:f Zange:f Meißel:m Amboss:m Blasebalg:m Ahle:f Klemme:f
		Schraubstock:m Wasserwaage:f Messschieber:m Winkelmesser:m Lineal:n Schere:f Hammer:m
		Holzhammer:m Bohrer:m Schmirgel:m Hobel:m Spitzhacke:f Sichel:f Sense:f Hacke:f Pflug:m
		Rechen:m Lötkolben:m Schleifer:m Maßband:n Zirkel:m Beil:n Brecheisen:n Hebel:m Keil:m
		Flaschenzug:m Kurbel:f Kelle:f Wetzstein:m Feile:f Reibe:f Sieb:n Spaten:m Egge:f
		Dreschflegel:m Spindel:f Spule:f Griff:m Klinge:f Niete:f Stichsäge:f Bandsäge:f
		Drehbank:f Kettensäge:f Handsäge:f Hohleisen:n Reißnadel:f Winkel:m Fase:f Werkbank:f
	`,drink:`
		Kaffee:m Tee:m Saft:m Milch:f Wasser:n Limonade:f Apfelwein:m Kakao:m Punsch:m Aufguss:m
		Kamillentee:m Kräutertee:m Milchkaffee:m Cappuccino:m Espresso:m Bier:n Pils:n
		Weizenbier:n Schwarzbier:n Wein:m Rotwein:m Weißwein:m Roséwein:m Sekt:m Champagner:m
		Sherry:m Portwein:m Wermut:m Likör:m Schnaps:m Obstler:m Rum:m Gin:m Wodka:m Whisky:m
		Weinbrand:m Tequila:m Sake:m Met:m Cocktail:m Nektar:m Sirup:m Sprudel:m Tonic:n Eistee:m
		Molke:f Buttermilch:f Kefir:m Smoothie:m Milchshake:m Zuckerwasser:n Eiswasser:n
		Heißgetränk:n
	`}),ic={joiner:" ",capitalize:!1,adjectives:a(`
		blau grün rot schwarz weiß gelb golden silbern hell glänzend groß klein lang
		kurz breit schmal niedrig schnell langsam stark schwach hart weich warm kalt
		lauwarm trocken feucht sauber neu alt jung schön hässlich süß bitter salzig scharf sauer
		sanft rau leicht schwer rund spitz tief fern nah reich arm selten ruhig laut tapfer weise
		fröhlich traurig frei ewig durchsichtig einsam strahlend wild heiter still uralt modern
		endlos hohl seidig neblig wolkig regnerisch sonnig schneeig windig rostig neugierig
		schelmisch edel bescheiden freundlich flink stachelig ruhelos kräftig verworren
		lebhaft zart grau blass innig eisig glühend düster leuchtend erhaben schlicht zierlich
		drollig schlau kühn faul wach glatt dicht knapp
	`),actions:a(`
		schlafend rennend fliegend schwimmend singend tanzend lachend weinend gehend stehend
		sitzend liegend essend trinkend lesend schreibend malend lernend wartend suchend rufend
		hörend sehend träumend wachend versteckt jagend fangend werfend ziehend schiebend öffnend
		schließend bauend pflanzend erntend kochend backend webend nähend rudernd fahrend
		kletternd rollend treibend fließend brennend schmelzend blühend welkend fallend wandernd
		flüsternd schimmernd blinkend schwebend wiegend kreisend schleichend hüpfend springend
		schnaufend gähnend streckend grübelnd staunend zögernd jubelnd grüßend umarmend
		streichelnd tröstend weckend reisend fliehend landend spähend lauschend zählend messend
		schmiedend schnitzend polierend gießend schneidend hackend faltend wickelnd siegelnd
		klingend summend
	`),nouns:ma.pools,nounGender:ma.gender,genderRules:[["ung","f"],["heit","f"],["keit","f"],["schaft","f"],["chen","n"],["lein","n"],["","m"]],agreement:{m:[["el","ler"],["auer","aurer"],["e","er"],["","er"]],f:[["el","le"],["auer","aure"],["e","e"],["","e"]],n:[["el","les"],["auer","aures"],["e","es"],["","es"]],p:[["el","le"],["auer","aure"],["e","e"],["","e"]]},frames:[{slots:["noun"],weight:12},{slots:["adjective","noun"],weight:50},{slots:["action","noun"],weight:38}],syn:{kind:"syllable",onset:a("b d f g h k l m n p r s t w z bl br dr fl fr gl gr kl kn kr pf schl schm schn schr schw sp st tr"),vowel:a("a e e i i o u au ei ie eu ä ö ü"),coda:["",...a("n m r l s t ch ng nd st rt lt")],minSyllables:2,maxSyllables:2}},rc={joiner:"",capitalize:!0,adjectives:a(`
		Brave Bright Blue Crimson Golden Silver Emerald Scarlet Azure Quiet Loud Swift
		Slow Giant Tiny Clever Gentle Wild Calm Cosmic Lunar Solar Misty
		Cloudy Rainy Sunny Snowy Windy Rusty Shiny Velvet Lonely Curious Dizzy
		Sleepy Ancient Modern Endless Hollow Round Jagged Soft Warm Cool Sweet
		Salty Bitter Spicy Fuzzy Silky Marble Copper Ivory Neon Polar Feral Noble Humble
		Merry Grumpy Mellow Stormy Frosty Dusty Foggy Radiant Bronze Umber Cobalt
		Verdant Fierce Nimble Prickly Restless Sturdy Tangled Vivid Whimsical
		Amber Indigo Jade Onyx Coral Teal Sable Ashen Auburn Maroon Russet
		Saffron Lilac Ocher Slate Charcoal Pearly Witty Bold Timid Cheerful Jolly
		Bashful Placid Serene Eager Earnest Steady Rowdy Sassy Snappy Zesty Breezy
		Dreamy Moody Cranky Perky Quirky Spry Wily Cunning Valiant Regal Lofty Meek
		Stoic Solemn Somber Blithe Genial Ardent Tender
		Glassy Wooden Woolen Rubbery Crispy Chewy Creamy
		Buttery Syrupy Smoky Dewy Sandy Muddy Icy Wispy Downy Plush Satin Linen Massive
		Petite Slender Chunky Stout Lanky Narrow Curved Spiral Zigzag Twisted Pointed
		Blunt Oval Astral Stellar Nebular Orbital Twilight Midnight Autumnal Wintry
		Vernal Timeless Antique
	`),actions:a(`
		Burning Frozen Dancing Running Flying Singing Roaming Whispering Glowing Fading
		Rolling Falling Rising Shimmering Wandering Hidden Sleeping Leaping Drifting
		Prowling Soaring Diving Gliding Humming Laughing Dreaming Blooming Melting
		Twinkling Rustling Crackling Bouncing Spinning Floating Climbing Chasing Lurking
		Roving Strolling Tumbling Studying Working Cooking Baking Painting Drawing
		Writing Reading Counting Building Mending Planting Digging Fishing Waiting
		Guarding Seeking Calling Shouting Muttering Watching Peeking Listening
		Remembering Imagining Wondering Hesitating Deciding Cheering Greeting Hugging
		Soothing Waking Napping Yawning Stretching Traveling Fleeing Landing Circling
		Pacing Crawling Frolicking Teasing Eating Drinking Chewing Roasting Knocking
		Hauling Pushing Pulling Throwing Catching Dropping Hiding Sinking Flowing
		Overflowing Thawing Blazing Smoldering Scattering Pouring Seeping Spreading
		Ripening Growing Wilting Setting Nodding Resting Leaning Hanging Perched Curled
		Sprawled Halted Sighing Grinning Snoozing Skipping Prancing Bounding Darting
		Slinking Hovering Swaying Bobbing Drumming Strumming Whistling Chanting Weaving
		Carving Forging Sailing Rowing Paddling Marching Racing Juggling Vanishing
		Returning
	`),nouns:{animal:a(`
			Lion Tiger Leopard Cheetah Fox Wolf Bear Panda Otter Rabbit Squirrel Cat Puppy Whale
			Dolphin Shark Turtle Seal Penguin Owl Sparrow Magpie Swallow Eagle Falcon Crane Swan Duck
			Goose Woodpecker Parrot Peacock Ostrich Horse Deer Elephant Giraffe Hippo Monkey Gorilla
			Frog Lizard Chameleon Snake Butterfly Moth Bee Dragonfly Ladybug Snail Ant Spider Octopus
			Squid Seahorse Starfish Crab Shrimp Carp Salmon Mackerel Hedgehog Raccoon Badger Lynx
			Bison Moose Camel Koala Sloth Ferret Mole Bat Heron Pelican Walrus Narwhal Weasel Gazelle
			Zebra Buffalo Raven Kestrel Puffin Flamingo Firefly Mantis Jellyfish Chipmunk Jaguar
			Cougar Bobcat Hyena Jackal Coyote Dingo Meerkat Mongoose Marten Wolverine Beaver
			Porcupine Armadillo Anteater Lemur Baboon Macaque Marmoset Tapir Okapi Ibex Chamois
			Antelope Impala Wildebeest Llama Alpaca Donkey Pony Foal Piglet Lamb Kitten Duckling
			Gosling Cygnet Osprey Vulture Condor Stork Ibis Cormorant Albatross Petrel Sandpiper
			Plover Lapwing Starling Finch Warbler Thrush Cuckoo Hoopoe Kingfisher Toucan Macaw
			Cockatoo Canary Nightingale Cicada Beetle Centipede Scorpion Earthworm Tadpole Newt Gecko
			Iguana Cobra Python
		`),object:a(`
			Bottle Pencil Eraser Umbrella Lantern Lamp Clock Mirror Keyring Padlock Satchel Cap Boot
			Goggles Bangle Button Thread Brush Paint Paper Notebook Bookmark Letter Postcard Postage
			Compass Atlas Telescope Microscope Camera Reel Radio Gramophone Balloon Kite Spindle
			Marbles Dice Card Puzzle Blocks Sail Anchor Beacon Tent Backpack Bedroll Torch Matchbox
			Candle Flowerpot Kettle Teacup Spoon Plate Saucepan Hatchet Handsaw Cogwheel Mainspring
			Magnet Ribbon Envelope Cushion Quilt Basket Broom Whistle Knot Bucket Easel Flask Goblet
			Hourglass Inkwell Quiver Sundial Parasol Thimble Bobbin Loom Tongs Mallet Rasp File
			Sharpener Inkpot Quill Nib Blotter Folder Binder Clipboard Notepad Paperclip Pushpin Tack
			Rivet Bolt Screw Bracket Hinge Latch Chain Rope Twine Cord Tassel Buckle Zipper Snap
			Velcro Patch Emblem Badge Pendant Locket Brooch Cufflink Hairpin Barrette Headband
			Wristband Anklet Pouch Tote Duffel Trunk Crate Barrel Canister Jar
		`),nature:a(`
			Sky Wave Tide Ocean River Lake Waterfall Ravine Mountain Hillside Meadow Forest Cavern
			Desert Sandbank Boulder Pebble Volcano Earthquake Ember Cinder Glacier Reef Marshland
			Prairie Canyon Echo Shadow Avalanche Tundra Oasis Lagoon Geyser Plateau Driftwood Steppe
			Savanna Wetland Swampland Bayou Estuary Delta Atoll Fjord Inlet Cove Headland Peninsula
			Isthmus Archipelago Islet Mesa Butte Gorge Crevasse Moraine Scree Talus Bedrock Sandbar
			Shoal Seabed Trench Abyss Fumarole Sinkhole Karst Stalactite Stalagmite Grotto Alcove
			Overhang Crag Spire Pinnacle
		`),plant:a(`
			Treetop Leaf Blossom Petal Rootlet Seedling Berry Moss Fern Bamboo Pinecone Maple
			Dandelion Sunflower Thicket Lotus Orchid Tulip Peony Camellia Magnolia Azalea Hyacinth
			Daffodil Snowdrop Bluebell Foxglove Marigold Lavender Primrose Buttercup Cowslip
			Columbine Larkspur Wisteria Begonia Petunia Zinnia Dahlia Anemone Crocus Freesia Gardenia
			Birch Cedar Pine Oak Elm Beech Alder Poplar Aspen Cypress Sequoia Sycamore Hawthorn Acorn
			Chestnut Walnut Sprout Sapling Stalk Stem Twig Bark Bud Pollen Nectar Frond Cactus
			Toadstool Lichen Seaweed Kelp Bonsai Hedge Shrub Bramble Thistle Bulrush Sedge Vine
			Nettle Redwood Spruce Larch Olive Hickory Linden Mulberry Mangrove Papyrus Duckweed
			Watercress Mistletoe Wormwood Foxtail Cattail Sepal Stamen Pistil Calyx Husk Kernel
			Tendril Rhizome Tuber Sprig Foliage Canopy Undergrowth Arbor Trellis Bough Lilac
			Carnation Gladiolus Hydrangea Oleander Hibiscus Honeysuckle Blackthorn Elderberry Dogwood
			Geranium Delphinium Lupine Aster Ranunculus Gorse Bracken Horsetail Liverwort Algae
			Rattan Palm Yucca Agave Succulent Aloe Basil Thyme Oregano Parsley Cilantro Chives Sorrel
			Fennel Dill Sage Marjoram Tarragon Lemongrass Peppermint Spearmint Chamomile
		`),gem:a(`
			Gold Silver Copper Iron Steel Bronze Brass Tin Zinc Nickel Platinum Titanium Quartz
			Amethyst Crystal Topaz Garnet Sapphire Emerald Jade Onyx Obsidian Marble Granite
			Limestone Sandstone Slate Basalt Flint Amber Coral Ivory Agate Carnelian Peridot Zircon
			Turquoise Malachite Lapis Mica Pyrite Gypsum Chalk Ore Nugget Gemstone Geode Meteorite
			Diamond Prism Alloy Ingot Aquamarine Tourmaline Tanzanite Moonstone Sunstone Bloodstone
			Azurite Chalcedony Citrine Morganite Kunzite Spinel Alexandrite Chrysoprase Rhodonite
			Sodalite Labradorite Amazonite Aventurine Hematite Magnetite Galena Bauxite Cinnabar
			Realgar Orpiment Barite Celestite Apatite Beryl Corundum Olivine Pyroxene Amphibole
			Serpentine Chlorite Kaolin Bentonite Zeolite Cobalt Chromium Manganese Tungsten Antimony
			Bismuth Cadmium Iridium Osmium Palladium Rhodium Ruthenium Tantalum Niobium Vanadium
			Selenium Tellurium Germanium Gallium Indium Thallium Rubidium Caesium Strontium Barium
			Lithium
		`),concept:a(`
			Freedom Peace Justice Truth Wisdom Memory Daydream Story Poem Sketch Grammar Logic
			Physics Chemistry Biology Philosophy Mathematics Geometry Algebra History Myth Legend
			Fable Proverb Riddle Secret Promise Journey Adventure Voyage Discovery Experiment
			Question Answer Debate Council Festival Dimension Balance Harmony Palette Contrast Ritual
			Custom Culture Language Alphabet Cipher Archive Almanac Calendar Paradox Enigma Odyssey
			Symmetry Spectrum Horizon Sanctuary Insight Intuition Reason Judgment Doctrine Theorem
			Axiom Corollary Hypothesis Dilemma Paradigm Framework Premise Inference Deduction
			Induction Analogy Metaphor Allegory Symbol Motif Theme Narrative Chronicle Annal
			Testament Manifesto Consensus Compromise Covenant Treaty Alliance Kinship Epiphany
			Catharsis Renewal Rebirth Legacy Heritage Tradition Ceremony Milestone Threshold
		`),myth:a(`
			Dragon Wyvern Phoenix Griffin Chimera Hydra Golem Orc Goblin Troll Elf Dwarf Fairy Pixie
			Sprite Nymph Siren Mermaid Kraken Basilisk Cockatrice Manticore Minotaur Centaur Satyr
			Cyclops Titan Ogre Imp Demon Angel Seraph Wraith Ghost Phantom Specter Banshee Vampire
			Werewolf Zombie Mummy Gargoyle Unicorn Pegasus Sphinx Djinn Genie Leviathan Behemoth
			Thunderbird Yeti Spell Curse Hex Rune Amulet Talisman Grimoire Potion Oracle Prophecy
			Sorcery Enchantment Revenant Lich Witch Wyrm Dryad Naiad Harpy Gorgon Faun Cerberus
			Valkyrie Norn Fury Muse Augur Warlock Enchanter Conjurer Necromancer Sigil Glyph Omen
			Portent Blessing Homunculus Kobold Gnome Poltergeist Ifrit Shade Wisp Barghest Selkie
			Kelpie Wendigo Chupacabra Roc Simurgh Salamander Undine Sylph Efreet Marid Naga Rakshasa
			Oni Tengu Kitsune Kappa Bunyip Drake Lindworm Amphisbaena Catoblepas Peryton Hippogriff
			Nightmare Familiar Coven Incantation Invocation Summoning Banishment Divination Scrying
			Portal Ley Sanctum Reliquary Effigy Idol Totem Phylactery Charm Warding Runestone
		`),job:a(`
			Wizard Sorcerer Ranger Thief Rogue Pirate Sailor Captain Chef Gardener Blacksmith
			Detective Poet Painter Dancer Jester Clown Wanderer Pilgrim Monk Alchemist Archer
			Swordsman Warrior Soldier Guard Sentinel Warden Guardian Queen Prince Princess Emperor
			Steward Servant Maid Merchant Trader Farmer Angler Shepherd Woodcutter Ferryman Coachman
			Navigator Pilot Engineer Courier Janitor Firefighter Officer Doctor Nurse Pharmacist
			Teacher Student Librarian Reporter Writer Editor Translator Singer Actor Director
			Minstrel Miner Carpenter Potter Tailor Weaver Seer Prophet Priest Shaman Scholar Inventor
			Explorer Traveler Athlete Referee Juggler Acrobat Sculptor Paladin Cavalier Squire
			Crusader Herald Scribe Barkeep Innkeeper Huntsman Stonecutter Archivist Curator
			Conservator Geologist Astronomer Botanist Zoologist Marine Chemist Physicist Actuary
			Economist Sociologist Linguist Philologist Historian Proofreader Typesetter Illustrator
			Animator Playwright Novelist Columnist Broadcaster Announcer Interpreter Diplomat Notary
			Paralegal Prosecutor Magistrate Bailiff Auditor Bookkeeper Appraiser Underwriter Broker
			Realtor Surveyor Draftsman Millwright Machinist Welder Fitter Rigger Glazier Roofer
			Plasterer Bricklayer Stonemason Locksmith Upholsterer Cobbler Milliner Dyer Tanner
			Glassblower Goldsmith Silversmith Watchmaker Luthier Perfumer Vintner Brewer
		`),music:a(`
			Piano Guitar Fiddle Drum Chime Mandolin Melody Rhythm Chord Ballad Waltz Lullaby Flute
			Piccolo Clarinet Oboe Bassoon Trumpet Trombone Tuba Saxophone Harp Cello Viola Violin
			Banjo Ukulele Accordion Harmonica Xylophone Marimba Tambourine Maracas Cymbal Bagpipe
			Organ Kalimba Sitar Lute Lyre Zither Ocarina Bugle Sonata Symphony Concerto Overture
			Prelude Interlude Refrain Chorus Anthem Serenade Nocturne Rhapsody Etude Fugue Octave
			Tempo Cadence Crescendo Staccato Encore Duet Trio Quartet Songbook Hymn Carol Chant
			Requiem Cantata Oratorio Madrigal Quintet Ensemble Orchestra Choir Soloist Conductor
			Verse Coda Diminuendo Legato Vibrato Tremolo Glissando Arpeggio Semitone Scale Mode Key
			Clef Stave Notation Score Sheet Metronome Tuner Pedal Bow String Fretboard Soundhole
			Mouthpiece Valve Snare Bassline Downbeat Upbeat Syncopation Jamming Busking Ovation
			Recital Fanfare Toccata Partita Minuet Polka Tango Mazurka Bolero Chorale Motet Canon
			Ostinato Dissonance Consonance Modulation Cadenza Reprise Medley Riff Groove Backbeat
			Harmonics Timbre Resonance Falsetto Baritone Contralto Descant Obbligato
		`),place:a(`
			Market Plaza Metropolis Village Alleyway Bridge Garden Library Museum Theater Schoolyard
			Parkland Harbor Wharf Pier Station Airport Lighthouse Citadel Palace Temple Shrine Chapel
			Cathedral Monastery Tower Attic Cellar Rooftop Courtyard Balcony Veranda Greenhouse Barn
			Cottage Cabin Lodge Tavern Bakery Diner Kitchen Bedroom Hallway Staircase Corridor Tunnel
			Overpass Byway Boardwalk Promenade Playground Stadium Arena Gymnasium Bathhouse
			Clinic Pharmacy Bookshop Aquarium Gallery Observatory Fortress Boulevard Esplanade Arcade
			Terrace Atrium Foyer Lobby Stairwell Basement Loft Pantry Larder Workshop Studio
			Planetarium Orchard Vineyard Meadowland Pastureland Farmstead Barnyard Silo Windmill
			Watermill Watchtower Belfry Steeple Cloister Abbey Rampart Bastion Turret Drawbridge Moat
			Gatehouse Keep Bazaar Marketplace Emporium Warehouse Depot Terminal Quay Jetty
			Harborside Campsite Manor Hamlet Rotunda Colonnade Portico Pavilion Gazebo Pergola
			Bandstand Coliseum Forum Agora Necropolis Catacomb Crypt Mausoleum Obelisk Cenotaph
			Waypoint Crossroads Roundabout Underpass Viaduct Aqueduct Causeway Embankment Levee Weir
			Quarry Hollow
		`),food:a(`
			Rice Porridge Noodle Dumpling Bread Toast Cheese Yogurt Omelet Pancake Waffle Doughnut
			Cookie Biscuit Cupcake Brownie Pudding Custard Pastry Croissant Bagel Pretzel Sandwich
			Burger Pizza Pasta Spaghetti Lasagna Risotto Curry Stew Chowder Salad Pickle Sausage
			Bacon Steak Meatball Barbecue Taco Burrito Sushi Tempura Kimchi Tofu Potato Carrot
			Cabbage Lettuce Spinach Broccoli Pumpkin Cucumber Garlic Mushroom Apple Strawberry Grape
			Watermelon Peach Lemon Banana Mango Pineapple Blueberry Chocolate Candy Honey Syrup
			Lemonade Popcorn Baguette Brioche Muffin Scone Crumpet Crepe Cornbread Frittata Quiche
			Paella Gnocchi Ravioli Linguine Fettuccine Ramen Udon Soba Pho Congee Bisque Consomme
			Goulash Casserole Meatloaf Pastrami Prosciutto Salami Terrine Cutlet Schnitzel Kebab
			Skewer Roast Brisket Ribeye Sirloin Tenderloin Drumstick Fillet Sashimi Ceviche Tartare
			Coleslaw Hummus Guacamole Salsa Chutney Relish Marmalade Meringue Tiramisu Cheesecake
			Macaron Croquette Falafel Pierogi Tamale Empanada Samosa Springroll Wonton Gyoza Mochi
		`),sport:a(`
			Soccer Football Baseball Basketball Volleyball Handball Tennis Badminton Squash Golf
			Bowling Billiards Swimming Athletics Marathon Sprint Gymnastics Taekwondo Judo Karate
			Kendo Boxing Wrestling Fencing Archery Shooting Equestrian Rowing Canoeing Sailing
			Surfing Skiing Snowboard Hockey Rugby Cricket Cycling Climbing Racket Goalpost Medal
			Trophy Podium Playoff Overtime Champion Polo Curling Skating Diving Triathlon Softball
			Netball Lacrosse Snooker Darts Jogging Hurdle Javelin Discus Relay Scoreboard Dugout
			Paddle Karting Rafting Dribble Penalty Offside Halftime Kickoff Rebound Homerun Slalom
			Freestyle Backstroke Sprinter Bobsleigh Luge Vaulting Dunk Volley Decathlon Biathlon
			Kayaking Bouldering Parkour Skydiving Paragliding Windsurfing Waterpolo Sparring Uppercut
			Knockout Takedown Grapple Somersault Cartwheel Handstand Backflip Warmup Timeout Assist
			Shootout Tiebreak Deuce Birdie Bogey Putter Fairway Racetrack Velodrome Ringside
			Bleachers Grandstand Pommel
		`),vehicle:a(`
			Bicycle Locomotive Boat Automobile Bus Taxi Truck Motorbike Scooter Skateboard Airplane
			Helicopter Jetliner Spaceship Rocket Submarine Steamship Sailboat Raft Kayak Ferry
			Freighter Warship Galleon Chariot Wagon Cart Handcart Tractor Bulldozer Firetruck
			Ambulance Cruiser Cablecar Subway Tramcar Railcar Carriage Sleigh Airship Glider
			Parachute Gondola Minivan Pickup Limousine Convertible Snowplow Monorail Trolley Rickshaw
			Palanquin Dinghy Yacht Catamaran Hovercraft Icebreaker Tanker Barge Trawler Biplane
			Seaplane Zeppelin Blimp Rover Lander Shuttle Snowmobile Unicycle Tricycle Moped Caravan
			Hearse Coupe Sedan Roadster Speedboat Houseboat Tugboat Dredger Forklift Hatchback
			Streetcar Camper Trailer Sidecar Buggy Quadbike Rollerblade Toboggan Litter Palfrey Skiff
			Punt Junk Sampan Coracle Outrigger Schooner Clipper Cutter Corvette Frigate Airliner
			Turboprop Sailplane Autogyro Tiltrotor Stagecoach Halftrack Snowcat Trolleybus Railbus
		`),product:a(`
			Laptop Computer Keyboard Trackpad Monitor Printer Speaker Earbuds Headphone Microphone
			Drone Tablet Smartphone Charger Battery Remote Fridge Washer Vacuum Heater Cooler
			Purifier Toaster Blender Oven Microwave Television Humidifier Razor Toothbrush Shampoo
			Perfume Lipstick Sneakers Wristwatch Console Projector Router Modem Scanner Webcam
			Joystick Gamepad Powerbank Amplifier Turntable Grinder Fryer Steamer Dishwasher Dryer
			Hairdryer Lotion Sunscreen Mattress Curtain Doorbell Thermostat Nightlight Calculator
			Whiteboard Socket Adapter Lightbulb Extension Stapler Organizer Diffuser Sanitizer
			Detergent Conditioner Softener Freshener Percolator Griddle Skillet Colander Whisk Peeler
			Corkscrew Thermos Tumbler Doormat Hanger Wardrobe Bookshelf Nightstand Recliner Beanbag
			Footstool Ottoman Bedframe Duvet Bedsheet Pillowcase Towel Slipmat Showerhead Faucet
			Plunger Squeegee
		`),color:a(`
			Crimson Scarlet Vermilion Carmine Magenta Fuchsia Cerise Blush Apricot Tangerine Ocher
			Umber Sepia Mustard Chartreuse Lime Mint Teal Aqua Cyan Azure Navy Indigo Mauve Plum
			Maroon Burgundy Rust Terracotta Cream Beige Taupe Khaki Charcoal Graphite Pewter
			Alabaster Ebony Jet Cerulean Periwinkle Saffron Blonde Auburn Ginger Ultramarine Viridian
			Bister Fawn Buff Ecru Oatmeal Porcelain Bone Smoke Denim Wine Brick Clay Sand Straw
			Honeydew Seafoam Powder Ice Ash Soot Coal Pitch Puce Russet Sable Gamboge Verdigris
			Celadon Eggshell Cinnamon Nutmeg Paprika Wheat
		`),finance:a(`
			Ledger Invoice Receipt Bond Share Dividend Interest Loan Mortgage Deposit Savings Account
			Budget Audit Asset Liability Equity Capital Revenue Profit Margin Surplus Deficit Debt
			Credit Debit Check Currency Exchange Yield Portfolio Escrow Levy Tariff Rebate Refund
			Premium Annuity Pension Payroll Wage Salary Bonus Commission Royalty Franchise Merger
			Buyout Bailout Collateral Lien Voucher Coupon Bullion Vault Treasury Exchequer Remittance
			Clearing Settlement Arbitrage Futures Warrant Debenture Overdraft Withdrawal Statement
			Passbook Custody Trustee Creditor Debtor Lender Borrower Guarantor Valuation Appraisal
			Inflation Recession Liquidity Solvency Bankruptcy Windfall Endowment Subsidy Stipend
			Allowance Expense Outlay Turnover Markup Discount Installment Arrears
		`),tech:a(`
			Server Cache Buffer Pixel Bitmap Codec Packet Protocol Daemon Queue Stack Heap Pointer
			Compiler Runtime Firmware Registry Bandwidth Latency Gateway Firewall Subnet Hostname
			Payload Checksum Schema Cursor Backup Cluster Shard Replica Snapshot Container Sandbox
			Pipeline Repository Commit Debugger Macro Array Matrix Boolean Integer Syntax Parser
			Lexer Bytecode Assembler Instruction Interrupt Register Bitrate Throughput Handshake
			Namespace Middleware Endpoint Webhook Encryption Decryption Hashing Salting Sharding
			Caching Rendering Rasterizer Shader Texture Polygon Wireframe Viewport Framebuffer
			Bitfield Nibble Octet Uplink Downlink Routing Switching Bridging Tunneling Multicast
			Broadcast Datagram Bootloader Filesystem Partition Directory Symlink Checkpoint Rollback
			Migration
		`),weather:a(`
			Cloud Breeze Rain Snow Frost Icicle Mist Dewdrop Rainbow Sunset Lightning Thunder
			Downpour Monsoon Typhoon Whirlwind Zephyr Squall Drizzle Snowdrift Hoarfrost Sleet
			Cloudburst Gale Gust Cyclone Blizzard Hailstone Sunbeam Mirage Halo Raindrop Shower
			Stormcloud Rainstorm Snowstorm Sandstorm Duststorm Hurricane Tornado Twister Tempest
			Deluge Torrent Flurry Sprinkle Fogbank Smog Haze Humidity Forecast Overcast Sunshine
			Heatwave Coldsnap Chill Thaw Slush Rime Graupel Whiteout Windchill Crosswind Headwind
			Tailwind Updraft Airstream Jetstream Doldrums Sunshower Nimbus Cumulus Cirrus Stratus
			Contrail Downdraft Snowflake Snowmelt Frostbite Blustery Windstorm Icestorm Hailstorm
		`),space:a(`
			Star Moon Galaxy Comet Meteor Starlight Corona Zenith Moonbeam Eclipse Universe Planet
			Satellite Asteroid Nebula Orbit Gravity Sunspot Crater Lightyear Cosmos Starfield
			Stardust Supernova Blackhole Quasar Pulsar Milkyway Crescent Fullmoon Newmoon Halfmoon
			Moonrise Void Ether Firmament Exoplanet Solarflare Perihelion Aphelion Apogee Perigee
			Nadir Azimuth Parallax Redshift Starlore Moonscape Skyline Cosmology Astronomy Telescopy
			Gravitas Lunation Sidereal Ecliptic Equator Meridian Solarsail Starburst
		`),time:a(`
			Sunrise Dawn Dusk Twilight Daybreak Nightfall Solstice Equinox Season Moment Eternity
			Holiday Morning Noon Afternoon Evening Night Midnight Midday Sunup Sundown Yesterday
			Today Tomorrow Weekday Weekend Fortnight Decade Century Millennium Epoch Era Aeon Instant
			Interval Duration Springtime Summertime Winter Midsummer Midwinter Daytime Nighttime
			Lifetime Childhood Youth Adulthood Dotage Heyday Dayspring Nightwatch Eventide Forenoon
			Gloaming Nightlong Sennight Hereafter Nowadays Bygone Yesteryear Prime Vesper
			Springtide Harvesttime Wintertide Autumntide
		`),emotion:a(`
			Courage Curiosity Solitude Nostalgia Longing Yearning Empathy Compassion Gratitude
			Humility Patience Diligence Prudence Temperance Fortitude Integrity Sincerity Wonder Awe
			Serenity Friendship Fellowship Solidarity Rivalry Reverie Joy Sorrow Anger Fear Surprise
			Delight Glee Cheer Bliss Elation Euphoria Rapture Comfort Relief Despair Grief Melancholy
			Gloom Sadness Loneliness Regret Remorse Guilt Shame Pride Vanity Envy Jealousy Greed
			Desire Passion Affection Fondness Tenderness Warmth Kindness Sympathy Pity Trust Doubt
			Suspicion Worry Anxiety Dread Terror Panic Rage Wrath Irritation Annoyance Boredom Apathy
			Zeal Ardor Fervor Excitement Eagerness Resolve Willpower Confidence Modesty Calmness
			Composure Nerves Bravery Timidity Gladness Mirth Levity Sentiment Emotion Mood Temper
			Whim Rancor Malice Spite Contentment Solace Ecstasy Anguish Torment Wistfulness
		`),body:a(`
			Head Forehead Eyebrow Eyelash Eyelid Nose Nostril Cheek Chin Jaw Lip Tongue Tooth Gum Ear
			Earlobe Neck Nape Shoulder Elbow Wrist Knuckle Finger Thumb Fingernail Fist Chest Rib
			Belly Navel Spine Waist Hip Thigh Knee Shin Calf Ankle Heel Toe Toenail Skull Muscle
			Tendon Ligament Joint Cartilage Heart Lung Liver Stomach Kidney Spleen Intestine Bladder
			Brain Nerve Vein Artery Capillary Blood Flesh Skin Pore Hair Beard Tear Sweat Saliva
			Breath Pulse Heartbeat Ribcage Backbone Collarbone Kneecap Cheekbone Jawbone Eardrum
			Eyeball Wrinkle Freckle Dimple Scar Bruise Blister Callus Torso Limb Sinew Marrow
		`),clothing:a(`
			Glove Scarf Espadrille Brogue Bathrobe Coat Overcoat Jacket Blazer Shirt Blouse Tunic
			Trousers Jeans Shorts Skirt Dress Gown Vest Cardigan Sweater Jumper Hoodie Sock Stocking
			Tights Underwear Pajamas Apron Bandana Kerchief Necktie Bowtie Belt Sash Sneaker Loafer
			Sandal Clog Moccasin Slipper Uniform Costume Robe Mantle Poncho Raincoat Anorak Parka
			Windbreaker Swimsuit Wetsuit Overalls Dungarees Sleeve Collar Cuff Hem Lapel Lining
			Fabric Linen Silk Cotton Wool Velvet Corduroy Tweed Flannel Leather Fleece Beret Bonnet
			Helmet Turban Veil Shawl Wrap Muffler Earmuff Waistcoat Petticoat Nightgown Camisole
			Bodice Doublet Kimono Sarong Kaftan Hat Shoe Glasses Boots Cloak Mitten Headscarf Sunhat
			Topcoat Smock
		`),tool:a(`
			Shovel Ladder Wrench Pliers Chisel Anvil Bellows Awl Clamp Vise Level Caliper Protractor
			Ruler Scissors Needle Punch Plumbline Hammer Drill Sandpaper Plane Pickaxe Sickle Scythe
			Hoe Plow Rake Spanner Screwdriver Soldering Tapemeasure Chalkline Adze Crowbar Lever
			Wedge Pulley Crank Sledge Trowel Chuck Whetstone Grater Sieve Spade Harrow Flail Handle
			Blade Toolkit Toolbox Fastener Rivetgun Nailgun Jigsaw Bandsaw Lathe Sander Chainsaw
			Ripsaw Coping Gouge Burin Scriber Divider Setsquare Tsquare Bevel Jointer Miter Vice
			Workbench Clawhammer Ballpeen Axe Saw Hacksaw Yardstick Screwjack Pincer Bradawl Scraper
			Burnisher Drawknife Spokeshave Miterbox Nailset Plumbbob Pipewrench Boltcutter
		`),drink:a(`
			Coffee Cocoa Water Soda Cider Cordial Smoothie Milkshake Latte Espresso Cappuccino
			Americano Mocha Macchiato Ristretto Chai Matcha Oolong Infusion Brew Ale Lager Stout
			Pilsner Beer Sherry Port Vermouth Whiskey Brandy Vodka Rum Tequila Gin Sake Mead Cocktail
			Highball Champagne Liqueur Absinthe Aperitif Digestif Kefir Kombucha Lassi Horchata
			Sherbet Frappe Eggnog Toddy Grog Wassail Nightcap Tonic Seltzer Springwater Icewater
			Hotwater Sweetwater Coldbrew Nitrobrew Coldpress Milk Juice Tea Buttermilk Malt Shandy
			Sangria Bourbon Scotch Rye Amaretto Curacao Ouzo Raki Arrack Verjuice Switchel
			Barleywater Ricewater Sodawater Sparkling
		`)},parts:a(`
		Tail Paw Track Wing Shade Whisker Feather Scale Mane Horn Beak Fin Nest Den Egg
		Shard Flock Hamlet Kingdom Voyage Tale Song Waltz Daydream Starlight Glimmer
		Whisper Breeze Ripple Trail Crown Cloak Charm Spark Bloom Grove Cove Peak Path
		Lantern Claw Fang Snout Plume Antler Burrow Roost Lair Halo Murmur
	`),frames:[{slots:["noun"],weight:10},{slots:["adjective","noun"],weight:34},{slots:["action","noun"],weight:22},{slots:["noun","part"],weight:12},{slots:["adjective","noun","part"],weight:16},{slots:["action","noun","part"],weight:6}],syn:{kind:"syllable",onset:a("b c d f g h j k l m n p r s t v w z br cl dr fl gr sk sl sn st th tr"),vowel:a("a a e e i i o o u u ae ee ou"),coda:["","",...a("n l r s x th ll rk sk")],minSyllables:2,maxSyllables:2}},ca=Dn({animal:`
		gato:m perro:m león:m tigre:m leopardo:m guepardo:m zorro:m lobo:m oso:m panda:m nutria:f
		conejo:m ardilla:f elefante:m ciervo:m caballo:m burro:m vaca:f toro:m cabra:f oveja:f
		cerdo:m mono:m gorila:m cocodrilo:m serpiente:f lagarto:m tortuga:f rana:f sapo:m pájaro:m
		golondrina:f gorrión:m cuervo:m halcón:m águila:f pavo_real:m loro:m búho:m paloma:f
		grulla:f cisne:m pato:m ganso:m gallina:f pez:m ballena:f delfín:m tiburón:m pulpo:m
		calamar:m gamba:f cangrejo:m caracol:m mariposa:f abeja:f hormiga:f araña:f libélula:f
		cigarra:f mosca:f mosquito:m gusano:m murciélago:m erizo:m mapache:m tejón:m lince:m
		bisonte:m alce:m camello:m koala:m perezoso:m hurón:m topo:m garza:f pelícano:m morsa:f
		comadreja:f gacela:f cebra:f búfalo:m foca:f pingüino:m avestruz:m
	`,object:`
		botella:f lápiz:m goma:f paraguas:m lámpara:f farol:m espejo:m llave:f candado:m bolsa:f
		botón:m aguja:f hilo:m pincel:m pintura:f papel:m cuaderno:m carta:f postal:f sello:m
		mapa:m catalejo:m microscopio:m cámara:f película:f radio:f globo:m cometa:f peonza:f
		canica:f dado:m naipe:m rompecabezas:m vela:f ancla:f tienda:f linterna:f cerilla:f
		maceta:f tetera:f taza:f cuchara:f plato:m olla:f engranaje:m resorte:m imán:m cinta:f
		sobre:m almohada:f manta:f cesta:f escoba:f silbato:m cuerda:f cubo:m abanico:m escudo:m
		red:f caña:f jarra:f peine:m campanilla:f embudo:m bandeja:f caja:f barril:m lata:f
		frasco:m
	`,nature:`
		mar:m río:m lago:m cascada:f valle:m montaña:f colina:f pradera:f bosque:m cueva:f
		desierto:m arena:f roca:f guijarro:m volcán:m terremoto:m glaciar:m arrecife:m pantano:m
		arroyo:m bahía:f duna:f cumbre:f páramo:m estepa:f sabana:f humedal:m estuario:m delta:m
		laguna:f atolón:m fiordo:m cala:f cabo:m península:f istmo:m archipiélago:m islote:m
		meseta:f cañón:m acantilado:m grieta:f morrena:f pedregal:m peñasco:m banco:m bajío:m
		escollo:m abismo:m géiser:m fumarola:f sumidero:m estalactita:f estalagmita:f gruta:f
		repisa:f ladera:f sombra:f eco:m brasa:f manantial:m orilla:f litoral:m
	`,plant:`
		árbol:m hoja:f flor:f raíz:f semilla:f fruto:m musgo:m helecho:m bambú:m pino:m arce:m
		cerezo:m rosa:f loto:m crisantemo:m orquídea:f girasol:m nenúfar:m hierba:f rama:f brote:m
		capullo:m pétalo:m polen:m piña:f bellota:f ginkgo:m sauce:m abedul:m cedro:m abeto:m
		roble:m castaño:m nogal:m césped:m alga:f seto:m ramo:m cactus:m áloe:m albahaca:f
		tomillo:m orégano:m perejil:m cilantro:m cebollino:m hinojo:m eneldo:m salvia:f estragón:m
		menta:f manzanilla:f lavanda:f enredadera:f palmera:f
	`,gem:`
		oro:m plata:f cobre:m hierro:m acero:m bronce:m latón:m estaño:m zinc:m platino:m
		cristal:m cuarzo:m amatista:f ágata:f ámbar:m perla:f jade:m ópalo:m obsidiana:f mármol:m
		granito:m caliza:f basalto:m pedernal:m meteorito:m mineral:m gema:f lingote:m mica:f
		fluorita:f calcita:f malaquita:f granate:m azufre:m marfil:m pepita:f grafito:m mercurio:m
		yeso:m veta:f olivino:m turmalina:f rubí:m zafiro:m esmeralda:f topacio:m circón:m
		pirita:f magnetita:f hematita:f cinabrio:m galena:f talco:m bismuto:m
	`,concept:`
		libertad:f paz:f justicia:f verdad:f sabiduría:f memoria:f imaginación:f cuento:m poema:m
		boceto:m gramática:f lógica:f física:f química:f biología:f filosofía:f matemática:f
		geometría:f álgebra:f historia:f mito:m leyenda:f fábula:f refrán:m acertijo:m secreto:m
		promesa:f viaje:m aventura:f travesía:f hallazgo:m experimento:m pregunta:f respuesta:f
		debate:m consejo:m fiesta:f dimensión:f equilibrio:m armonía:f ritual:m costumbre:f
		cultura:f idioma:m alfabeto:m cifra:f archivo:m almanaque:m horizonte:m intuición:f
		razón:f juicio:m doctrina:f teorema:m axioma:m hipótesis:f paradoja:f dilema:m paradigma:m
		premisa:f deducción:f inducción:f analogía:f metáfora:f símbolo:m crónica:f testimonio:m
		manifiesto:m tratado:m alianza:f linaje:m legado:m tradición:f ceremonia:f umbral:m
	`,myth:`
		dragón:m fénix:m unicornio:m sirena:f hada:f duende:m elfo:m enano:m trol:m ogro:m
		gigante:m quimera:f hidra:f grifo:m centauro:m minotauro:m esfinge:f pegaso:m kraken:m
		basilisco:m gólem:m vampiro:m licántropo:m espectro:m fantasma:m alma:f espíritu:m
		demonio:m ángel:m diosa:f dios:m hechizo:m maldición:f profecía:f oráculo:m amuleto:m
		talismán:m runa:f portal:m santuario:m ídolo:m tótem:m ninfa:f náyade:f dríade:f
		valquiria:f musa:f brujo:m bruja:f nigromante:m alquimista:m sabio:m augurio:m presagio:m
		bestiario:m
	`,job:`
		caballero:m cazador:m ladrón:m pirata:m marinero:m capitán:m cocinero:m jardinero:m
		herrero:m detective:m poeta:m pintor:m bailarín:m payaso:m viajero:m peregrino:m monje:m
		arquero:m espadachín:m guerrero:m general:m soldado:m guardia:m portero:m rey:m reina:f
		príncipe:m princesa:f emperador:m mayordomo:m criada:f sirviente:m mercader:m granjero:m
		pescador:m pastor:m leñador:m barquero:m cochero:m piloto:m ingeniero:m cartero:m
		repartidor:m barrendero:m bombero:m policía:m médico:m enfermero:m farmacéutico:m
		veterinario:m maestro:m alumno:m periodista:m escritor:m editor:m traductor:m cantante:m
		actor:m director:m músico:m minero:m carpintero:m alfarero:m sastre:m adivino:m profeta:m
		sacerdote:m erudito:m doctor:m inventor:m explorador:m atleta:m árbitro:m acróbata:m
		escultor:m guía:m relojero:m panadero:m cervecero:m perfumista:m curtidor:m tejedor:m
	`,music:`
		piano:m guitarra:f tambor:m campana:f arpa:f canción:f danza:f ritmo:m melodía:f acorde:m
		flauta:f trompeta:f saxofón:m clarinete:m oboe:m violonchelo:m viola:f violín:m batería:f
		platillo:m pandereta:f xilófono:m órgano:m armónica:f acordeón:m laúd:m mandolina:f
		banjo:m partitura:f nota:f silencio:m escala:f coro:m solo:m concierto:m escenario:m
		sinfonía:f sonata:f vals:m jazz:m balada:f nana:f marcha:f preludio:m interludio:m final:m
		compás:f orquesta:f movimiento:m obertura:f fuga:f estudio:m nocturno:m serenata:f
		rapsodia:f himno:m réquiem:m cantata:f aria:f dúo:m trío:m cuarteto:m quinteto:m octava:f
		semitono:m clave:f pentagrama:m metrónomo:m pedal:m traste:m boquilla:f
	`,place:`
		mercado:m plaza:f ciudad:f aldea:f callejón:m puente:m jardín:m biblioteca:f museo:m
		teatro:m escuela:f parque:m puerto:m muelle:m estación:f aeropuerto:m faro:m castillo:m
		muralla:f palacio:m templo:m torre:f desván:m sótano:m azotea:f patio:m porche:m
		invernadero:m granero:m cabaña:f mirador:m recreo:m gimnasio:m piscina:f acuario:m
		galería:f zoológico:m balneario:m ayuntamiento:m mesón:m hospital:m farmacia:f
		librería:f panadería:f cafetería:f restaurante:m cocina:f dormitorio:m salón:m pasillo:m
		escalera:f túnel:m pasarela:f cruce:m alameda:f fortaleza:f granja:f rancho:m huerto:m
		abadía:f claustro:m bastión:m atalaya:f foso:m astillero:m malecón:m campamento:m villa:f
		mansión:f caserío:m
	`,food:`
		arroz:m pan:m fideo:m sopa:f guiso:m ensalada:f sal:f azúcar:m pimienta:f ajo:m cebolla:f
		patata:f zanahoria:f pepino:m calabaza:f col:f lechuga:f espinaca:f seta:f tofu:m huevo:m
		queso:m mantequilla:f yogur:m manzana:f fresa:f uva:f sandía:f melocotón:m naranja:f
		limón:m plátano:m mango:m cereza:f chocolate:m caramelo:m galleta:f pastel:m
		flan:m rosquilla:f gofre:m tortita:f hamburguesa:f pizza:f pasta:f curry:m tortilla:f
		paella:f empanada:f croqueta:f churro:m turrón:m mazapán:m gazpacho:m tapa:f bocadillo:m
		salchicha:f jamón:m tocino:m chorizo:m morcilla:f albóndiga:f filete:m costilla:f
		mermelada:f miel:f
	`,sport:`
		fútbol:m béisbol:m baloncesto:m voleibol:m tenis:m bádminton:m golf:m boliche:m billar:m
		natación:f atletismo:m maratón:m gimnasia:f karate:m judo:m esgrima:f lucha:f boxeo:m
		tiro:m equitación:f remo:m surf:m esquí:m hockey:m rugby:m críquet:m
		ciclismo:m escalada:f raqueta:f bate:m portería:f medalla:f trofeo:m campeón:m
		eliminatoria:f prórroga:f polo:m patinaje:m buceo:m dardo:m valla:f jabalina:f disco:m
		relevo:m marcador:m casco:m falta:f jonrón:m espalda:f braza:f halterofilia:f trineo:m
		saque:m rebote:m salto:m carrera:f meta:f podio:m vestuario:m grada:f afición:f
	`,vehicle:`
		bicicleta:f tren:m barco:m coche:m autobús:m taxi:m camión:m moto:f patinete:m avión:m
		helicóptero:m nave:f cohete:m submarino:m yate:m carguero:m velero:m balsa:f acorazado:m
		tanque:m carroza:f carreta:f carretilla:f tractor:m excavadora:f ambulancia:f teleférico:m
		metro:m tranvía:m locomotora:f canoa:f kayak:m dirigible:m paracaídas:m palanquín:m
		triciclo:m furgoneta:f limusina:f quitanieves:m monorraíl:m catamarán:m rompehielos:m
		petrolero:m gabarra:f pesquero:m biplano:m hidroavión:m sonda:f motonieve:f monociclo:m
		remolcador:m góndola:f carruaje:m vagón:m
	`,product:`
		ordenador:m teclado:m ratón:m pantalla:f impresora:f altavoz:m auricular:m micrófono:m
		dron:m tableta:f móvil:m cargador:m pila:f mando:m nevera:f lavadora:f aspiradora:f
		ventilador:m estufa:f purificador:m arrocera:f microondas:m horno:m licuadora:f
		maquinilla:f cepillo:m dentífrico:m jabón:m champú:m perfume:m reloj:m proyector:m
		enrutador:m escáner:m secadora:f secador:m loción:f protector:m zapatilla:f sandalia:f
		colchón:m cortina:f timbre:m termómetro:m extintor:m calculadora:f bombilla:f enchufe:m
		regleta:f edredón:m funda:f toalla:f palangana:f detergente:m suavizante:m olla_exprés:f
		sartén:f cafetera:f batidor:m pelador:m sacacorchos:m termo:m felpudo:m percha:f armario:m
		estante:m mesilla:f
	`,color:`
		carmesí:m escarlata:m bermellón:m magenta:m fucsia:m rosado:m
		 ocre:m siena:m sepia:m mostaza:m oliva:m lima:f turquesa:f cian:m
		 añil:m índigo:m lila:m malva:f púrpura:f borgoña:m herrumbre:f terracota:f
		crema:f beige:m caqui:m carbón:m peltre:m ébano:m azabache:m cerúleo:m
		azafrán:m aguamarina:f verdín:m celadón:m nácar:m cobrizo:m bronceado:m
		ceniza:f humo:m trigo:m canela:f nuez_moscada:f pimentón:m
	`,finance:`
		factura:f recibo:m bono:m dividendo:m interés:m préstamo:m hipoteca:f
		depósito:m ahorro:m cuenta:f saldo:m presupuesto:m auditoría:f activo:m pasivo:m capital:m
		ingreso:m ganancia:f margen:m superávit:m déficit:m deuda:f crédito:m débito:m cheque:m
		moneda:f divisa:f rendimiento:m cartera:f arancel:m reembolso:m prima:f pensión:f nómina:f
		salario:m sueldo:m comisión:f regalía:f franquicia:f fusión:f adquisición:f
		rescate:m aval:m vale:m cupón:m caja_fuerte:f tesorería:f remesa:f
		liquidación:f arbitraje:m garantía:f descubierto:m extracto:m libreta:f custodia:f
		acreedor:m deudor:m prestamista:m fiador:m tasación:f inflación:f recesión:f liquidez:f
		solvencia:f quiebra:f donación:f subsidio:m estipendio:m gasto:m descuento:m plazo:m
	`,tech:`
		servidor:m caché:f búfer:m píxel:m códec:m paquete:m protocolo:m
		montículo:m puntero:m compilador:m firmware:m registro:m latencia:f
		cortafuegos:m subred:f anfitrión:m carga_útil:f esquema:m cursor:m
		respaldo:m clúster:m fragmento:m réplica:f instantánea:f contenedor:m tubería:f
		repositorio:m depurador:m macro:f matriz:f entero:m sintaxis:f analizador:m ensamblador:m
		instrucción:f interrupción:f tasa_de_bits:f extremo:m cifrado:m descifrado:m
		sombreador:m textura:f polígono:m malla:f octeto:m enrutamiento:m conmutación:f difusión:f
		datagrama:m partición:f directorio:m reversión:f migración:f
	`,weather:`
		nube:f viento:m lluvia:f nieve:f escarcha:f niebla:f rocío:m arcoíris:m ocaso:m rayo:m
		trueno:m chubasco:m monzón:m tifón:m torbellino:m ventisca:f llovizna:f granizo:m
		aguanieve:f vendaval:m ráfaga:f ciclón:m tormenta:f tempestad:f diluvio:m aguacero:m
		calima:f bruma:f neblina:f pronóstico:m nublado:m solana:f ola_de_calor:f
		helada:f deshielo:m cellisca:f remolino:m brisa:f céfiro:m galerna:f borrasca:f
		anticiclón:m clima:m temperatura:f presión:f nubarrón:m chaparrón:m sereno:m relámpago:m
		centella:f escampada:f
	`,space:`
		estrella:f luna:f sol:m galaxia:f meteoro:m aurora:f menguante:m
		creciente:m eclipse:m cenit:m universo:m planeta:m satélite:m asteroide:m nebulosa:f
		cúmulo:m constelación:f órbita:f gravedad:f rotación:f traslación:f mancha_solar:f
		cráter:m año_luz:m astro:m firmamento:m eclíptica:f meridiano:m estratosfera:f atmósfera:f
		vacío:m ingravidez:f plenilunio:m novilunio:m perigeo:m apogeo:m lucero:m marte:m
		venus:m júpiter:m saturno:m urano:m neptuno:m plutón:m supernova:f cuásar:m púlsar:m
		vía_láctea:f cosmos:m
	`,time:`
		amanecer:m alba:f crepúsculo:m anochecer:m solsticio:m equinoccio:m momento:m
		eternidad:f futuro:m instante:m siglo:m década:f mañana:f mediodía:m tarde:f noche:f
		medianoche:f madrugada:f víspera:f ayer:m hoy:m jornada:f semana:f quincena:f mes:m
		trimestre:m semestre:m año:m lustro:m milenio:m época:f era:f edad:f primavera:f verano:m
		otoño:m invierno:m solano:m trienio:m ahora:m bienio:m infancia:f juventud:f madurez:f
		vejez:f intervalo:m duración:f transcurso:m período:m
		aniversario:m efeméride:f temporada:f alborada:f atardecer:m
	`,emotion:`
		alegría:f tristeza:f ira:f miedo:m sorpresa:f gozo:m júbilo:m dicha:f felicidad:f
		euforia:f éxtasis:m consuelo:m alivio:m esperanza:f desesperanza:f pena:f melancolía:f
		nostalgia:f soledad:f añoranza:f anhelo:m deseo:m pasión:f cariño:m ternura:f calidez:f
		bondad:f compasión:f empatía:f lástima:f gratitud:f humildad:f paciencia:f prudencia:f
		templanza:f integridad:f sinceridad:f asombro:m reverencia:f serenidad:f calma:f sosiego:m
		confianza:f duda:f sospecha:f preocupación:f ansiedad:f pavor:m terror:m pánico:m furia:f
		rabia:f enojo:m fastidio:m aburrimiento:m apatía:f entusiasmo:m fervor:m ardor:m emoción:f
		ilusión:f coraje:m valentía:f timidez:f vergüenza:f culpa:f orgullo:m envidia:f celos:p
		codicia:f ánimo:m humor:m capricho:m
	`,body:`
		cabeza:f frente:f ceja:f pestaña:f párpado:m nariz:f mejilla:f barbilla:f mandíbula:f
		labio:m lengua:f diente:m encía:f oreja:f lóbulo:m cuello:m nuca:f hombro:m codo:m
		muñeca:f palma:f nudillo:m dedo:m pulgar:m uña:f puño:m pecho:m vientre:m ombligo:m
		cintura:f cadera:f muslo:m rodilla:f espinilla:f pantorrilla:f tobillo:m talón:m hueso:m
		cráneo:m músculo:m tendón:m ligamento:m articulación:f cartílago:m corazón:m pulmón:m
		hígado:m estómago:m riñón:m bazo:m intestino:m vejiga:f cerebro:m nervio:m vena:f
		arteria:f capilar:m sangre:f carne:f piel:f poro:m cabello:m barba:f lágrima:f sudor:m
		saliva:f aliento:m pulso:m latido:m clavícula:f rótula:f pómulo:m tímpano:m globo_ocular:m
		arruga:f peca:f hoyuelo:m cicatriz:f moretón:m ampolla:f callo:m
	`,clothing:`
		sombrero:m zapato:m guante:m bufanda:f gafas:fp abrigo:m gabán:m chaqueta:f americana:f
		camisa:f blusa:f túnica:f pantalón:m vaquero:m short:m falda:f vestido:m chaleco:m
		rebeca:f jersey:m sudadera:f calcetín:m media:f pijama:m delantal:m pañuelo:m corbata:f
		pajarita:f cinturón:m faja:f mocasín:m bota:f pantufla:f uniforme:m disfraz:m bata:f
		capa:f poncho:m chubasquero:m anorak:m parka:f bañador:m manga:f
		 dobladillo:m solapa:f forro:m tela:f lino:m seda:f algodón:m lana:f
		terciopelo:m pana:f franela:f cuero:m boina:f gorro:m gorra:f turbante:m
		velo:m chal:m mantón:m
	`,tool:`
		hacha:f pala:f sierra:f alicate:m cincel:m yunque:m fuelle:m lezna:f abrazadera:f nivel:m
		calibre:m regla:f tijera:f martillo:m mazo:m taladro:m lija:f pico:m hoz:f guadaña:f
		azada:f arado:m rastrillo:m soldador:m amoladora:f cortadora:f hachuela:f palanca:f cuña:f
		polea:f manivela:f almádena:f paleta:f rallador:m tamiz:m laya:f mayal:m huso:m
		lanzadera:f carrete:m cuchilla:f remachadora:f clavadora:f caladora:f
		torno:m lijadora:f motosierra:f serrucho:m gubia:f punzón:m escuadra:f bisel:m
	`,drink:`
		café:m té:m zumo:m leche:f agua:f gaseosa:f limonada:f sidra:f horchata:f batido:m
		malteada:f infusión:f poleo:m tila:f mate:m cortado:m capuchino:m expreso:m carajillo:m
		descafeinado:m cerveza:f clara:f vino:m tinto:m
		cava:m champán:m jerez:m oporto:m vermut:m sangría:f licor:m aguardiente:m orujo:m ron:m
		ginebra:f vodka:m whisky:m coñac:m brandy:m tequila:m mezcal:m sake:m hidromiel:f cóctel:m
		ponche:m néctar:m jarabe:m refresco:m soda:f tónica:f granizado:m
	`}),lc={joiner:" ",capitalize:!1,adjectives:a(`
		azul verde rojo negro blanco amarillo dorado plateado oscuro claro brillante grande
		pequeño largo corto ancho estrecho alto bajo rápido lento fuerte débil duro blando
		caliente frío tibio seco húmedo limpio nuevo viejo joven hermoso feo dulce amargo salado
		picante agrio suave áspero ligero pesado redondo agudo profundo lejano cercano rico pobre
		raro tranquilo ruidoso valiente sabio alegre triste libre eterno transparente misterioso
		solitario radiante salvaje sereno silencioso antiguo moderno infinito hueco sedoso brumoso
		nublado lluvioso soleado nevado ventoso oxidado curioso travieso noble humilde gentil
		feroz ágil espinoso inquieto robusto enredado vívido tenue gris pálido intenso cálido
		helado ardiente sombrío luminoso majestuoso sencillo elegante gracioso astuto audaz
		 perezoso alerta afilado romo liso rugoso denso escaso
	`),actions:a(`
		dormido despierto perdido hallado escondido cansado mojado quemado congelado derretido
		roto abierto cerrado atado colgado caído sentado acostado olvidado recordado amado temido
		deseado buscado guardado herido curado salvado perdonado bendecido hechizado encantado
		asustado sorprendido enojado calmado animado agotado soñado peinado bañado vestido marcado
		pintado bordado tejido cosido tallado forjado pulido plantado sembrado cosechado regado
		podado florecido madurado tostado hervido asado frito horneado batido molido cortado
		picado envuelto sellado firmado escrito leído contado narrado cantado bailado tocado
		callado gritado susurrado reído llorado volado nadado saltado trepado rodado arrastrado
		empujado tirado lanzado atrapado soltado alzado bajado girado doblado estirado encogido
		apagado encendido
	`),nouns:ca.pools,nounGender:ca.gender,genderRules:[["ión","f"],["dad","f"],["tad","f"],["umbre","f"],["triz","f"],["a","f"],["","m"]],agreement:{f:[["or","ora"],["ón","ona"],["és","esa"],["ín","ina"],["án","ana"],["o","a"]],p:[["z","ces"],["or","ores"],["ón","ones"],["és","eses"],["ín","ines"],["án","anes"],["o","os"],["a","as"],["e","es"],["","es"]],fp:[["z","ces"],["or","oras"],["ón","onas"],["és","esas"],["ín","inas"],["án","anas"],["o","as"],["a","as"],["e","es"],["","es"]]},frames:[{slots:["noun"],weight:12},{slots:["noun","adjective"],weight:46},{slots:["noun","action"],weight:30},{slots:["noun","adjective","action"],weight:12}],syn:{kind:"syllable",onset:a("b c ch d f g gu h j l ll m n ñ p qu r rr s t v y z br cr dr fr gr pl pr tr"),vowel:a("a a e e i o o u ia ie io ua ue uo ai ei oi au eu"),coda:["","",...a("n l r s z")],minSyllables:2,maxSyllables:3}},ua=Dn({animal:`
		gatto:m cane:m leone:m tigre:f leopardo:m ghepardo:m volpe:f lupo:m orso:m panda:m
		lontra:f coniglio:m scoiattolo:m elefante:m cervo:m cavallo:m asino:m mucca:f toro:m
		capra:f pecora:f maiale:m scimmia:f gorilla:m coccodrillo:m serpente:m lucertola:f
		tartaruga:f rana:f rospo:m uccello:m rondine:f passero:m corvo:m falco:m aquila:f pavone:m
		pappagallo:m gufo:m colomba:f gru:f cigno:m anatra:f oca:f gallina:f pesce:m balena:f
		delfino:m squalo:m polpo:m calamaro:m gambero:m granchio:m lumaca:f farfalla:f ape:f
		formica:f ragno:m libellula:f cicala:f mosca:f zanzara:f verme:m pipistrello:m riccio:m
		procione:m tasso:m lince:f bisonte:m alce:m cammello:m koala:m bradipo:m furetto:m talpa:f
		airone:m pellicano:m tricheco:m donnola:f gazzella:f zebra:f bufalo:m foca:f pinguino:m
		struzzo:m
	`,object:`
		bottiglia:f matita:f gomma:f ombrello:m lampada:f lanterna:f specchio:m chiave:f
		lucchetto:m borsa:f bottone:m ago:m filo:m pennello:m vernice:f carta:f quaderno:m
		lettera:f cartolina:f francobollo:m mappa:f cannocchiale:m microscopio:m macchina:f
		pellicola:f radio:f palloncino:m aquilone:m trottola:f biglia:f dado:m
		puzzle:m vela:f ancora:f tenda:f torcia:f fiammifero:m candela:f vaso:m teiera:f tazza:f
		cucchiaio:m pentola:f ingranaggio:m molla:f magnete:m nastro:m busta:f cuscino:m coperta:f
		cesto:m scopa:f fischietto:m corda:f secchio:m ventaglio:m scudo:m rete:f canna:f brocca:f
		pettine:m campanella:f imbuto:m vassoio:m scatola:f barile:m latta:f fiala:f
	`,nature:`
		mare:m fiume:m lago:m cascata:f valle:f montagna:f collina:f prato:m bosco:m grotta:f
		deserto:m sabbia:f roccia:f ciottolo:m vulcano:m terremoto:m ghiacciaio:m scogliera:f
		palude:f ruscello:m baia:f duna:f vetta:f brughiera:f steppa:f savana:f estuario:m delta:m
		laguna:f atollo:m fiordo:m cala:f capo:m penisola:f istmo:m arcipelago:m isolotto:m
		altopiano:m canyon:m rupe:f crepaccio:m morena:f ghiaione:m masso:m banco:m secca:f
		scoglio:m abisso:m geyser:m fumarola:f dolina:f stalattite:f stalagmite:f caverna:f
		cengia:f pendio:m ombra:f eco:f brace:f sorgente:f riva:f litorale:m
	`,plant:`
		albero:m foglia:f fiore:m radice:f seme:m frutto:m muschio:m felce:f bambù:m pino:m
		acero:m ciliegio:m rosa:f loto:m crisantemo:m orchidea:f tarassaco:m girasole:m ninfea:f
		erba:f ramo:m germoglio:m bocciolo:m petalo:m polline:m pigna:f ghianda:f ginkgo:m
		salice:m betulla:f cedro:m abete:m quercia:f castagno:m noce:m alga:f
		siepe:f mazzo:m cactus:m aloe:f basilico:m timo:m origano:m prezzemolo:m coriandolo:m
		finocchio:m aneto:m salvia:f dragoncello:m menta:f camomilla:f lavanda:f edera:f palma:f
	`,gem:`
		oro:m argento:m rame:m ferro:m acciaio:m bronzo:m ottone:m stagno:m zinco:m platino:m
		cristallo:m quarzo:m ametista:f agata:f ambra:f perla:f giada:f opale:m ossidiana:f
		marmo:m granito:m calcare:m basalto:m selce:f meteorite:m minerale:m gemma:f lingotto:m
		mica:f fluorite:f calcite:f malachite:f granato:m zolfo:m avorio:m pepita:f grafite:f
		mercurio:m gesso:m olivina:f tormalina:f rubino:m zaffiro:m smeraldo:m topazio:m zircone:m
		pirite:f magnetite:f ematite:f cinabro:m galena:f talco:m bismuto:m
	`,concept:`
		libertà:f pace:f giustizia:f verità:f saggezza:f memoria:f fantasia:f racconto:m poesia:f
		schizzo:m grammatica:f logica:f fisica:f chimica:f biologia:f filosofia:f matematica:f
		geometria:f algebra:f storia:f mito:m leggenda:f favola:f proverbio:m indovinello:m
		segreto:m promessa:f viaggio:m avventura:f traversata:f scoperta:f esperimento:m domanda:f
		risposta:f dibattito:m consiglio:m festa:f dimensione:f equilibrio:m armonia:f rito:m
		usanza:f cultura:f lingua:f alfabeto:m cifra:f archivio:m almanacco:m orizzonte:m
		intuizione:f ragione:f giudizio:m dottrina:f teorema:m assioma:m ipotesi:f paradosso:m
		dilemma:m paradigma:m premessa:f deduzione:f induzione:f analogia:f metafora:f simbolo:m
		cronaca:f manifesto:m trattato:m alleanza:f stirpe:f eredità:f tradizione:f cerimonia:f
		soglia:f
	`,myth:`
		drago:m fenice:f unicorno:m sirena:f fata:f folletto:m elfo:m nano:m troll:m orco:m
		gigante:m chimera:f idra:f grifone:m centauro:m minotauro:m sfinge:f pegaso:m kraken:m
		basilisco:m golem:m vampiro:m licantropo:m spettro:m fantasma:m anima:f spirito:m demone:m
		angelo:m dea:f dio:m incantesimo:m maledizione:f profezia:f oracolo:m amuleto:m
		talismano:m runa:f portale:m santuario:m idolo:m totem:m ninfa:f naiade:f driade:f
		valchiria:f musa:f stregone:m strega:f negromante:m alchimista:m saggio:m augurio:m
		presagio:m bestiario:m
	`,job:`
		cavaliere:m cacciatore:m ladro:m pirata:m marinaio:m capitano:m cuoco:m giardiniere:m
		fabbro:m detective:m poeta:m pittore:m ballerino:m pagliaccio:m viaggiatore:m pellegrino:m
		monaco:m arciere:m spadaccino:m guerriero:m generale:m soldato:m guardia:f portiere:m re:m
		regina:f principe:m principessa:f imperatore:m maggiordomo:m serva:f servo:m mercante:m
		contadino:m pescatore:m pastore:m boscaiolo:m barcaiolo:m cocchiere:m pilota:m ingegnere:m
		postino:m fattorino:m spazzino:m pompiere:m poliziotto:m medico:m infermiere:m
		farmacista:m veterinario:m maestro:m allievo:m giornalista:m scrittore:m redattore:m
		traduttore:m cantante:m attore:m regista:m musicista:m minatore:m falegname:m vasaio:m
		sarto:m indovino:m profeta:m sacerdote:m studioso:m dottore:m inventore:m esploratore:m
		atleta:m arbitro:m acrobata:m scultore:m guida:f orologiaio:m panettiere:m birraio:m
		profumiere:m conciatore:m tessitore:m
	`,music:`
		pianoforte:m chitarra:f tamburo:m campana:f arpa:f canzone:f danza:f ritmo:m melodia:f
		accordo:m flauto:m tromba:f sassofono:m clarinetto:m oboe:m violoncello:m viola:f
		violino:m batteria:f piatto:m tamburello:m xilofono:m organo:m armonica:f fisarmonica:f
		liuto:m mandolino:m banjo:m spartito:m nota:f pausa:f scala:f coro:m assolo:m concerto:m
		palco:m sinfonia:f sonata:f valzer:m jazz:m ballata:f ninnananna:f marcia:f preludio:m
		interludio:m finale:m timbro:m orchestra:f movimento:m ouverture:f fuga:f studio:m
		notturno:m serenata:f rapsodia:f inno:m requiem:m cantata:f aria:f duetto:m trio:m
		quartetto:m quintetto:m direttore:m ottava:f semitono:m pentagramma:m metronomo:m pedale:m
		tasto:m bocchino:m
	`,place:`
		mercato:m piazza:f città:f villaggio:m vicolo:m ponte:m giardino:m biblioteca:f museo:m
		teatro:m scuola:f parco:m porto:m molo:m stazione:f aeroporto:m faro:m castello:m mura:f
		palazzo:m tempio:m torre:f soffitta:f cantina:f terrazza:f cortile:m portico:m serra:f
		fienile:m baita:f belvedere:m parco_giochi:m palestra:f piscina:f acquario:m galleria:f zoo:m
		terme:f municipio:m posta:f ospedale:m farmacia:f libreria:f panetteria:f caffetteria:f
		ristorante:m cucina:f camera:f salotto:m corridoio:m tunnel:m passerella:f incrocio:m
		viale:m fortezza:f fattoria:f ranch:m frutteto:m abbazia:f chiostro:m bastione:m
		torretta:f fossato:m cantiere:m accampamento:m villa:f dimora:f borgo:m
	`,food:`
		riso:m pane:m pasta:f zuppa:f stufato:m insalata:f sale:m zucchero:m pepe:m aglio:m
		cipolla:f patata:f carota:f cetriolo:m zucca:f cavolo:m lattuga:f spinacio:m fungo:m
		tofu:m uovo:m formaggio:m burro:m yogurt:m mela:f fragola:f uva:f anguria:f pesca:f
		arancia:f limone:m banana:f mango:m ciliegia:f ananas:m cioccolato:m caramella:f
		biscotto:m torta:f budino:m ciambella:f cialda:f frittella:f hamburger:m pizza:f curry:m
		frittata:f risotto:m lasagna:f gnocco:m raviolo:m tortellino:m polenta:f focaccia:f
		grissino:m panino:m salsiccia:f prosciutto:m pancetta:f salame:m mortadella:f polpetta:f
		bistecca:f costoletta:f marmellata:f miele:m tiramisù:m cannolo:m
	`,sport:`
		calcio:m baseball:m pallavolo:f tennis:m badminton:m golf:m bowling:m biliardo:m nuoto:m
		atletica:f maratona:f ginnastica:f karate:m judo:m scherma:f lotta:f pugilato:m tiro:m
		equitazione:f canottaggio:m surf:m sci:m hockey:m rugby:m cricket:m ciclismo:m
		arrampicata:f racchetta:f porta:f medaglia:f trofeo:m campione:m
		 eliminatoria:f allenamento:m polo:m pattinaggio:m tuffo:m freccetta:f
		ostacolo:m giavellotto:m disco:m staffetta:f tabellone:m casco:m fallo:m dorso:m
		 sollevamento:m slitta:f servizio:m rimbalzo:m salto:m corsa:f traguardo:m
		podio:m spogliatoio:m tribuna:f tifoseria:f
	`,vehicle:`
		bicicletta:f treno:m barca:f automobile:f autobus:m taxi:m camion:m moto:f monopattino:m
		aereo:m elicottero:m astronave:f razzo:m sottomarino:m yacht:m cargo:m veliero:m zattera:f
		corazzata:f carro:m carrozza:f carriola:f trattore:m escavatore:m ambulanza:f funivia:f
		tram:m locomotiva:f canoa:f kayak:m mongolfiera:f dirigibile:m paracadute:m portantina:f
		triciclo:m furgone:m limousine:f spazzaneve:m monorotaia:f catamarano:m petroliera:f
		chiatta:f peschereccio:m biplano:m idrovolante:m sonda:f navetta:f monociclo:m gondola:f
		vagone:m
	`,product:`
		computer:m tastiera:f mouse:m schermo:m stampante:f altoparlante:m auricolare:m
		microfono:m drone:m tablet:m telefono:m caricatore:m pila:f telecomando:m frigorifero:m
		lavatrice:f ventilatore:m stufa:f depuratore:m cuociriso:m microonde:m forno:m
		frullatore:m rasoio:m spazzolino:m dentifricio:m sapone:m shampoo:m profumo:m orologio:m
		proiettore:m router:m scanner:m asciugatrice:f lozione:f crema_solare:f pantofola:f
		sandalo:m materasso:m campanello:m termometro:m estintore:m calcolatrice:f lampadina:f
		presa:f ciabatta:f piumone:m federa:f asciugamano:m catino:m detersivo:m ammorbidente:m
		padella:f caffettiera:f frusta:f pelapatate:m cavatappi:m thermos:m zerbino:m gruccia:f
		armadio:m scaffale:m comodino:m
	`,color:`
		cremisi:m scarlatto:m vermiglio:m magenta:m fucsia:m rosato:m arancione:m ambrato:m ocra:f
		seppia:f senape:f smeraldino:m turchese:m ciano:m celeste:m
		indaco:m lilla:m violetto:m porpora:f bordeaux:m ruggine:f terracotta:f
		crema:f beige:m cachi:m peltro:m ebano:m giaietto:m ceruleo:m zafferano:m acquamarina:f
		verderame:m celadon:m madreperla:f ramato:m argenteo:m bronzeo:m cenere:f fumo:m
		vinaccia:f grano:m cannella:f noce_moscata:f paprika:f
	`,finance:`
		fattura:f ricevuta:f obbligazione:f azione:f dividendo:m interesse:m prestito:m mutuo:m
		deposito:m risparmio:m conto:m saldo:m bilancio:m revisione:f attivo:m passivo:m
		capitale:m ricavo:m guadagno:m margine:m avanzo:m disavanzo:m debito:m credito:m
		addebito:m assegno:m moneta:f valuta:f rendimento:m portafoglio:m dazio:m rimborso:m
		premio:m pensione:f busta_paga:f stipendio:m salario:m bonus:m provvigione:f royalty:f
		franchigia:f fusione:f acquisizione:f salvataggio:m garanzia:f buono:m coupon:m
		 cassaforte:f tesoreria:f rimessa:f liquidazione:f arbitraggio:m scoperto:m
		estratto:m libretto:m custodia:f creditore:m debitore:m prestatore:m garante:m
		valutazione:f perizia:f inflazione:f recessione:f liquidità:f solvibilità:f fallimento:m
		donazione:f sussidio:m spesa:f sconto:m rata:f
	`,tech:`
		server:m cache:f buffer:m pixel:m codec:m pacchetto:m protocollo:m coda:f
		cumulo:m puntatore:m compilatore:m firmware:m registro:m latenza:f gateway:m firewall:m
		sottorete:f host:m carico_utile:m checksum:m schema:m cursore:m backup:m cluster:m
		frammento:m replica:f istantanea:f contenitore:m pipeline:f repository:m debugger:m
		macro:f matrice:f intero:m sintassi:f analizzatore:m assemblatore:m istruzione:f
		interruzione:f bitrate:m throughput:m handshake:m endpoint:m cifratura:f
		decifratura:f hashing:m rendering:m shader:m texture:f poligono:m reticolo:m ottetto:m
		commutazione:f multicast:m broadcast:m datagramma:m bootloader:m partizione:f cartella:f
		collegamento:m ripristino:m migrazione:f
	`,weather:`
		nuvola:f vento:m pioggia:f neve:f brina:f nebbia:f rugiada:f arcobaleno:m tramonto:m
		fulmine:m tuono:m acquazzone:m monsone:m tifone:m turbine:m bufera:f pioggerella:f
		grandine:f nevischio:m burrasca:f raffica:f ciclone:m tempesta:f temporale:m diluvio:m
		foschia:f caligine:f umidità:f previsione:f nuvolone:m sole:m gelata:f disgelo:m
		mulinello:m brezza:f zefiro:m libeccio:m scirocco:m maestrale:m tramontana:f anticiclone:m
		clima:m temperatura:f pressione:f nubifragio:m lampo:m saetta:f sereno:m schiarita:f afa:f
		galaverna:f
	`,space:`
		stella:f luna:f galassia:f cometa:f meteora:f aurora:f falce_lunare:f
		eclissi:f zenit:m universo:m pianeta:m satellite:m asteroide:m nebulosa:f ammasso:m
		orbita:f gravità:f rotazione:f rivoluzione:f cratere:m anno_luce:m astro:m firmamento:m
		eclittica:f meridiano:m stratosfera:f atmosfera:f vuoto:m plenilunio:m novilunio:m
		perigeo:m vespro:m marte:m venere:f giove:m saturno:m urano:m nettuno:m plutone:m
		supernova:f buco_nero:m quasar:m pulsar:f via_lattea:f cosmo:m
	`,time:`
		alba:f crepuscolo:m imbrunire:m solstizio:m equinozio:m
		stagione:f momento:m eternità:f futuro:m istante:m secolo:m decennio:m mattino:m
		mezzogiorno:m pomeriggio:m sera:f notte:f mezzanotte:f vigilia:f ieri:m
		oggi:m giornata:f settimana:f quindicina:f mese:m trimestre:m semestre:m anno:m lustro:m
		millennio:m epoca:f era:f età:f primavera:f estate:f autunno:m inverno:m
		triennio:m biennio:m infanzia:f gioventù:f maturità:f vecchiaia:f scadenza:f intervallo:m
		durata:f periodo:m anniversario:m ricorrenza:f albeggiare:m
	`,emotion:`
		gioia:f tristezza:f rabbia:f paura:f sorpresa:f allegria:f giubilo:m felicità:f euforia:f
		estasi:f conforto:m sollievo:m speranza:f disperazione:f dolore:m malinconia:f nostalgia:f
		solitudine:f struggimento:m desiderio:m passione:f affetto:m tenerezza:f calore:m bontà:f
		compassione:f empatia:f pietà:f gratitudine:f umiltà:f pazienza:f prudenza:f temperanza:f
		fermezza:f integrità:f sincerità:f stupore:m riverenza:f serenità:f calma:f quiete:f
		fiducia:f dubbio:m sospetto:m ansia:f terrore:m panico:m furia:f collera:f fastidio:m
		noia:f apatia:f entusiasmo:m fervore:m ardore:m emozione:f illusione:f coraggio:m
		timidezza:f vergogna:f colpa:f orgoglio:m invidia:f gelosia:f avidità:f umore:m
		capriccio:m
	`,body:`
		testa:f fronte:f sopracciglio:m ciglio:m palpebra:f naso:m guancia:f mento:m mascella:f
		labbro:m dente:m gengiva:f orecchio:m lobo:m collo:m nuca:f spalla:f
		gomito:m polso:m palmo:m nocca:f dito:m pollice:m unghia:f pugno:m petto:m costola:f
		pancia:f ombelico:m schiena:f vita:f anca:f coscia:f ginocchio:m stinco:m polpaccio:m
		caviglia:f tallone:m osso:m cranio:m muscolo:m tendine:m legamento:m cartilagine:f cuore:m
		polmone:m fegato:m stomaco:m rene:m milza:f intestino:m vescica:f cervello:m nervo:m
		vena:f arteria:f capillare:m sangue:m carne:f pelle:f poro:m capello:m barba:f lacrima:f
		sudore:m saliva:f respiro:m clavicola:f rotula:f zigomo:m timpano:m bulbo:m ruga:f
		lentiggine:f fossetta:f cicatrice:f livido:m callo:m
	`,clothing:`
		cappello:m scarpa:f guanto:m sciarpa:f occhiali:p cappotto:m giaccone:m giacca:f camicia:f
		blusa:f tunica:f pantalone:m jeans:p calzoncino:m gonna:f abito:m gilet:m cardigan:m
		maglione:m felpa:f calzino:m calza:f biancheria:f pigiama:m grembiule:m bandana:f
		cravatta:f farfallino:m cintura:f fascia:f scarpetta:f mocassino:m stivale:m divisa:f
		costume:m vestaglia:f mantello:m poncho:m impermeabile:m giubbotto:m parka:m muta:f tuta:f
		manica:f colletto:m polsino:m orlo:m risvolto:m fodera:f tessuto:m lino:m seta:f cotone:m
		lana:f velluto:m fustagno:m flanella:f cuoio:m basco:m cuffia:f berretto:m elmetto:m
		turbante:m velo:m scialle:m
	`,tool:`
		ascia:f pala:f sega:f pinza:f scalpello:m incudine:f mantice:m lesina:f
		morsetto:m morsa:f livella:f calibro:m goniometro:m righello:m forbice:f martello:m
		mazzuolo:m trapano:m pialla:f piccone:m falce:f falcetto:m zappa:f aratro:m rastrello:m
		cacciavite:m saldatore:m troncatrice:f metro:m compasso:m accetta:f leva:f cuneo:m
		carrucola:f manovella:f mazza:f cazzuola:f cote:f lima:f grattugia:f setaccio:m vanga:f
		erpice:m correggiato:m fuso:m spola:f rocchetto:m manico:m lama:f cassetta:f
		rivettatrice:f chiodatrice:f seghetto:m tornio:m levigatrice:f motosega:f sgorbia:f
		punteruolo:m squadra:f smusso:m
	`,drink:`
		caffè:m tè:m succo:m latte:m acqua:f gassosa:f limonata:f sidro:m orzata:f frullato:m
		infuso:m tisana:f mate:m cioccolata:f macchiato:m cappuccino:m espresso:m corretto:m
		decaffeinato:m birra:f bionda:f rossa:f vino:m
		spumante:m prosecco:m champagne:m sherry:m vermut:m sangria:f liquore:m
		grappa:f acquavite:f rum:m gin:m vodka:f whisky:m cognac:m brandy:m tequila:m sake:m
		idromele:m cocktail:m punch:m nettare:m sciroppo:m bibita:f soda:f tonica:f granita:f
	`}),sc={joiner:" ",capitalize:!1,adjectives:a(`
		azzurro verde rosso nero bianco giallo dorato argenteo scuro chiaro brillante grande
		piccolo lungo corto largo stretto alto basso rapido lento forte debole duro morbido caldo
		freddo tiepido secco umido pulito nuovo vecchio giovane bello brutto dolce amaro salato
		piccante aspro soffice ruvido leggero pesante rotondo acuto profondo lontano vicino ricco
		povero raro tranquillo rumoroso coraggioso saggio allegro triste libero eterno trasparente
		misterioso solitario radioso selvaggio sereno silenzioso antico moderno infinito cavo
		setoso nebbioso nuvoloso piovoso soleggiato nevoso ventoso arrugginito curioso birichino
		nobile umile gentile feroce agile spinoso irrequieto robusto vivido tenue grigio pallido
		intenso gelido ardente cupo luminoso maestoso semplice elegante buffo astuto audace pigro
		sveglio affilato liscio denso scarso
	`),actions:a(`
		dormito perduto trovato nascosto stancato bagnato bruciato gelato sciolto rotto aperto
		chiuso legato appeso caduto seduto sdraiato dimenticato ricordato amato temuto desiderato
		cercato custodito ferito guarito salvato perdonato benedetto incantato spaventato sorpreso
		arrabbiato calmato animato sfinito sognato pettinato vestito segnato dipinto ricamato
		tessuto cucito intagliato forgiato lucidato piantato seminato raccolto annaffiato potato
		fiorito maturato tostato bollito arrostito fritto infornato montato macinato tagliato
		tritato avvolto sigillato firmato scritto letto raccontato narrato cantato ballato suonato
		taciuto gridato sussurrato pianto volato nuotato saltato arrampicato rotolato trascinato
		spinto tirato lanciato preso alzato abbassato girato piegato steso spento acceso ronzato
		brillato
	`),nouns:ua.pools,nounGender:ua.gender,genderRules:[["zione","f"],["sione","f"],["tà","f"],["tù","f"],["a","f"],["","m"]],agreement:{f:[["o","a"]],p:[["o","i"],["e","i"]],fp:[["o","e"],["e","i"]]},frames:[{slots:["noun"],weight:12},{slots:["noun","adjective"],weight:46},{slots:["noun","action"],weight:30},{slots:["noun","adjective","action"],weight:12}],syn:{kind:"syllable",onset:a("b c ch d f g gh l m n p qu r s sc t v z br cr dr fr gr pl pr tr"),vowel:a("a a e e i i o o u ia ie io ua ue uo ai ei oi au"),coda:["","",...a("n l r")],minSyllables:2,maxSyllables:3}},mc={joiner:"",capitalize:!1,adjectives:a(`
		青い 赤い 白い 黒い 黄色い 緑の 銀の 金の 星の 月の 夜の 朝の 夢の 虹の 霧の
		雪の 風の 海の 森の 静かな 賑やかな 不思議な 自由な 透明な 永遠の 大きな 小さな
		可愛い 勇敢な 優しい 冷たい 温かい 眠い 寂しい 丸い 鋭い 柔らかい 甘い 苦い 辛い
		涼しい 暖かい 古い 新しい 速い 遅い 明るい 暗い 眩しい 遠い 近い 高い 深い 浅い
		紫の 幻の 炎の 氷の 光の 影の
		潮の 黄昏の 綺麗な 華やかな 穏やかな 儚い 楽しい 嬉しい 悲しい 強い
		弱い 重い 軽い 熱い 賢い 幼い 若い 細い 長い 短い 広い 狭い 硬い 淡い 濃い 荒い
		美しい 珍しい 眠たい 怖い 元気な 陽気な 呑気な 大胆な 素直な 純粋な 孤独な
		上品な 派手な 地味な 完璧な 曖昧な 微かな 密かな 優雅な 空の 雲の 雨の 雷の 花の
		木の 水の 火の 春の 夏の 秋の 冬の 暁の 宵の 陽の 闇の 鋼の 桜の 楓の 雫の 波の
		紅の 藍の 翠の 朱の 空色の 群青の 琥珀の 真珠の 瑠璃の 硝子の
	`),actions:a(`
		踊る 走る 飛ぶ 歌う 光る 眠る 笑う 隠れた 迷う 舞う 輝く 泳ぐ 跳ぶ 駆ける
		微笑む 夢見る 揺れる 凍る 燃える 香る 廻る 沈む 昇る 咲いた 散った 消えた 現れた
		学ぶ 働く 作る 描く 書く 読む 数える 建てる 直す 植える 掘る 釣る 狩る 待つ
		守る 探す 呼ぶ 叫ぶ 囁く 見つめる 覗く 聴く 想う 悩む 決めた 応援する 挨拶する
		抱きしめる 撫でる 慰める 起こす 旅する 彷徨う 逃げる 追う 飛び込む 舞い上がる
		降り立つ 巡る 佇む 這う 転がる 遊ぶ 食べる 飲む 噛む 焼く 叩く 運ぶ 押す 引く
		投げる 掴む 落とす 隠す 浮かぶ 溶ける 流れる 溢れる 凍える 燃え上がる 散らばる
		降り注ぐ 染み込む 広がる 実る 育つ 枯れる 傾く 頷く 休む 寄りかかる ぶら下がる
		横たわる 座る 止まる 走り出す 駆け抜ける 忍び寄る 漂う 揺らめく 奏でる 織る
		彫る 鍛える 漕ぐ 競う 操る 唸る 鳴く 囀る 吠える 群れる 潜る 惑う 綴る 磨く
	`),nouns:{animal:a(`
			ライオン トラ ヒョウ チーター キツネ オオカミ クマ パンダ カワウソ ウサギ リス ネコ イヌ クジラ イルカ サメ カメ アザラシ ペンギン フクロウ スズメ カササギ
			ツバメ ワシ ハヤブサ ツル ハクチョウ カモ キツツキ インコ クジャク ダチョウ ウマ シカ ゾウ キリン カバ サル ゴリラ カエル トカゲ カメレオン ヘビ チョウ ガ
			ハチ トンボ テントウムシ カタツムリ アリ クモ タコ イカ ヒトデ カニ エビ コイ サケ ハリネズミ タヌキ モグラ コウモリ サギ ペリカン イタチ シマウマ ラクダ
			コアラ ナマケモノ ヤギ ヒツジ カラス ウグイス カワセミ ワニ カブトムシ ホタル クラゲ 山猫 豹猫 美洲豹 犬鷲 鬣狗 山犬 郊狼 野犬 狐猿 獴 鼬 白鼬 貂鼠 狼熊
			海狸 山荒 犰狳 蟻食 樹懶 狐猴 狒狒 猕猴 絹猴 獏 麒麟鹿 野牛 水牛 犛牛 山羊鹿 羚羊 瞪羚 黒斑羚 角馬 縞馬 駱馬 羊駝 駱駝 驢馬 小馬 仔馬 子豚 子羊 子牛
			家鴨子 鵞鳥子 蝉 蟋蟀 蟷螂 蜉蝣 黄金虫 鍬形虫 蛍火 蚯蚓 百足 馬陸 蠍 壁蝨 蚤 蠅 蚊 蛾 蚕 蛹 芋虫 御玉杓子 蟇 雨蛙 山椒魚 青大将 蝮 毒蛇 眼鏡蛇 響尾蛇
			錦蛇 鰐 鬣蜥 鮒 鯰 雷魚 桂魚 目高 泥鰌 鰻 穴子 太刀魚 鰆 秋刀魚 片口鰯 石持 介党鱈
		`),object:a(`
			水筒 鉛筆 傘 提灯 時計 鏡 鍵 鞄 指輪 糸 筆 絵具 手帳 栞 手紙 葉書 切手 印章 地図 望遠鏡 顕微鏡 写真機 ラジオ 風船 凧 独楽 ビー玉 サイコロ 積木 帆 錨
			天幕 懐中電灯 マッチ 蝋燭 花瓶 湯呑 匙 皿 鍋 歯車 リボン 封筒 枕 毛布 籠 箒 縄 桶 扇 杖 盾 兜 弓 矢 網 釣竿 壺 櫛 風鈴 折鶴 砂時計 指貫 糸巻 紡錘
			機織 火箸 消具 鉛筆削 墨壺 羽根筆 筆先 吸取紙 書類挟 綴具 画板 紙挟 画鋲 鋲 螺子釘 座金 受金 蝶番 掛金 南京錠 キーホルダー チェーン ロープ
			組紐 飾紐 タッセル 留具 締金 押釦 仮面 布片 紋章 記章 ネックレス 小函 ブローチ カフス 髪留 ヘアバンド リストバンド 足環 ストラップ 巾着 手提 旅行鞄 木箱
			木樽 ブリキ缶 徳利 硝子瓶 弁当箱 手桶 すり鉢 笊 篩 竹籠
		`),nature:a(`
			空 氷 波 潮 海 川 湖 滝 谷 山 丘 草原 森 洞窟 砂漠 砂 岩 小石 火山 地震 残り火 氷河 珊瑚 湿原 木霊 影 泉 沼 渓流 入江 岬 砂丘 峰 凍原 原野 樹海
			大草原 湿地帯 沢地 河口域 三角州 潟湖 環礁 峡湾 河原 磯 半島 地峡 群島 小島 稜線 台地 峡谷 山道 氷原 氷堆石 岩屑 巨岩 岩盤 砂州 浅瀬 暗礁 海底
			海溝 深淵 間欠泉 噴気孔 陥没穴 鍾乳洞 鍾乳石 石筍 洞室 岩窟 岩棚 尖峰 雪原 地平 水平 蒼穹
		`),plant:a(`
			木 葉 花 根 種 実 苔 羊歯 竹 松 紅葉 桜 蒲公英 向日葵 薔薇 百合 蘭 蓮 菊 梅 木蓮 ツツジ 椿 水仙 撫子 朝顔 昼顔 夕顔 菖蒲 芒 葦 蔦 蔓 茎 枝 芽
			双葉 花弁 花粉 年輪 松笠 団栗 銀杏 柳 白樺 杉 檜 樅 楓 樫 栗 胡桃 芝生 藻 海藻 昆布 盆栽 生垣 若葉 落葉 蕾 花束 草 雑草 新芽 チューリップ
			ラベンダー ライラック コスモス スミレ クローバー サボテン 鈴懸 白楊 楠 榛木 榛 七竈 山査子 梨 接骨木 山法師 沈丁花 山茶花 木槿 花菖蒲 紫陽花 藤棚 忍冬
			茉莉花 梔子 夾竹桃 九重葛 芙蓉 金盞花 百日草 衝羽根 秋海棠 天竺葵 桜草 待雪草 釣鐘草 狐手袋 飛燕草 千鳥草 羽団扇 蝦夷菊 菊花 天竺牡丹 唐菖蒲 雪割草 福寿草
			稚児百合 金鳳花 薊 刺草 木苺 石南花 欅 木賊 地衣 真竹 籐蔓 椰子 糸蘭 竜舌蘭 仙人掌 多肉 蘆薈 目箒 立麝香草 迷迭香 花薄荷 和蘭芹 香菜
			浅葱 酸葉 茴香 蒔蘿 セージ 月桂樹 竜蒿 檸檬草 薄荷 緑薄荷 加密列
		`),gem:a(`
			黄金 白銀 青銅 真鍮 鋼 鉄 錫 亜鉛 白金 銅 銀 金 水晶 紫水晶 瑪瑙 琥珀 真珠 翡翠 白玉 玉 黒曜石 大理石 花崗岩 砂岩 石灰岩 玄武岩 火打石 隕石 鉱石 原石
			宝石 金塊 銀塊 雲母 石英 蛍石 方解石 孔雀石 柘榴石 硫黄 象牙 砂金 金箔 銀箔 黒鉛 鋼鉄 水銀 石膏 白亜 宝玉 珠玉 鉱脈 石 橄欖石 電気石 月長石 日長石 血石
			瑠璃石 藍銅鉱 土耳石 紅玉髄 玉髄 黄水晶 尖晶石 金雲母 方鉛鉱 磁鉄鉱 赤鉄鉱 黄鉄鉱 藍晶石 紅柱石 珪線石 輝石 角閃石 蛇紋石 緑泥石 高嶺土 白雲石 燐灰石 重晶石
			天青石 鋼玉 緑柱石 黒水晶 曹達石 明礬石 十字石 灰簾石 黄銅鉱 錫石 珪酸塩 炭酸塩 硫酸塩 燐酸塩 塩化物 菱鉄鉱 輝銅鉱 白鉛鉱 亜鉛鉱 閃亜鉛鉱 輝銀鉱 自然金 蒼鉛
			滑石 縞瑪瑙 結晶体 単結晶 双晶体 母岩 脈石 精鉱 粗鉱 鉱滓 砂鉱 辰砂 輝安鉱 片麻岩 火成岩 堆積層 紅水晶 天河石
		`),concept:a(`
			自由 平和 正義 真理 知恵 記憶 想像 物語 詩 素描 文法 論理 物理 化学 生物 哲学 数学 幾何 代数 歴史 神話 伝説 寓話 諺 謎 秘密 約束 旅 冒険 航海 発見
			実験 質問 答 討論 会議 祭 次元 均衡 調和 色彩 明暗 儀式 習慣 文化 言葉 文字 暗号 記録 暦 沈黙 幻想 俳句 洞察 直観 理性 判断力 教理 定理 公理 系論
			仮説 逆説 板挟 範型 枠組 前提 推論 演繹 帰納 類推 隠喩 象徴 主題句 叙事 年代記 系譜 文書庫 証言 宣言 合意 妥協 誓約 条約 同盟 競争心 血縁 真実 夢想
			悟り 浄化 更新 再生 遺産 伝統 儀礼 式典 里程標 敷居 序幕 結末 反転 余白
		`),myth:a(`
			竜 鳳凰 天狗 鬼 河童 妖精 精霊 魔女 幽霊 亡霊 怨霊 神霊 天使 悪魔 人魚 妖怪 怪獣 魔獣 聖獣 神獣 幻獣 魔王 竜王 女神 魔法 魔力 呪文 呪い 予言 神託
			結界 護符 封印 幻影 使い魔 ドラゴン ユニコーン グリフォン ゴブリン オーク トロール エルフ ドワーフ ゾンビ 吸血鬼 狼男 九尾 不死鳥 黒竜 白竜 青竜
			白虎 朱雀 玄武 八咫烏 霊魂 幽鬼 妖狐 鬼神 竜神 山神 海神 雷神 風神 蛟竜 蛇王 人面獅 合成獣 番犬獣 単眼巨 巨神族 木精 水精 海妖 鳥女 蛇髪女 牛頭人
			半人馬 山羊人 牧神 獅身像 天馬 巨烏賊 海獣王 陸獣王 泣女妖 骸骨 屍鬼 影法師 生霊 騒霊 魔神 炎魔 土偶 傀儡 石像鬼 小悪魔 座敷童子 小妖精 家妖精 地精
			土精 鬼人 巨人族 戦乙女 運命女 復讐女 女神像 詩神 予言者 占者 賢者 黒魔導 魔術士 呪術士 降霊士 錬金士 御守 陰陽師 式神 呪詛 加護 前兆
			予兆 予言書 神話集 伝説集 奇譚集
		`),job:a(`
			騎士 狩人 猟師 盗賊 海賊 船長 船乗り 料理人 庭師 鍛冶屋 探偵 詩人 画家 踊り子 道化師 旅人 巡礼者 僧侶 錬金術師 魔法使い 射手 剣士 武士 侍 将軍 兵士
			見張り 門番 守護者 王 女王 王子 姫 皇帝 執事 女中 商人 農夫 漁師 牧童 樵 船頭 御者 水夫 航海士 操縦士 機関士 郵便屋 配達員 消防士 警官 医者 看護師
			薬剤師 獣医 教師 学生 司書 記者 作家 編集者 翻訳家 通訳 歌手 俳優 監督 楽師 鉱夫 大工 陶工 仕立屋 パン職人 占い師 預言者 神官 巫女 学者 博士 発明家
			探検家 旅行者 選手 審判 曲芸師 彫刻家 案内人 地図製作者 記録管理者 学芸員 保存修復家 考古学者 古生物学者 地質学者 気象学者 天文学者 植物学者 動物学者 昆虫学者
			鳥類学者 海洋学者 化学者 物理学者 統計学者 保険数理士 経済学者 社会学者 人類学者 言語学者 文献学者 歴史学者 校正者 組版工 挿絵画家 動画作家 撮影監督 脚本家
			劇作家 小説家 寄稿家 放送人 案内係 通訳者 外交官 公証人 法務士 検察官 治安判事 執行官 監査役 簿記係 鑑定士 引受人 仲介人 宅建士 測量士 製図工 整備工 機械工
			溶接工 配管工 索具工 硝子工 屋根工 左官工 煉瓦工 石工 錠前師 内装師 製靴工 帽子師 織工 染師 皮鞣師 樽職人 陶芸家 硝子職人 金細工 銀細工 時計師 楽器師 調香師
			醸造家 ソムリエ
		`),music:a(`
			ピアノ ギター 太鼓 鈴 竪琴 笛 歌 踊り 律動 旋律 和音 フルート 横笛 尺八 篠笛 トランペット サックス クラリネット オーボエ ハープ チェロ ビオラ バイオリン
			ドラム シンバル タンバリン 木琴 鉄琴 オルガン ハーモニカ 三味線 琴 琵琶 笙 篳篥 鼓 楽譜 音符 休符 音階 和声 合唱 独唱 合奏 独奏 演奏 舞台 交響曲 協奏曲
			ワルツ ジャズ 民謡 童謡 子守唄 行進曲 前奏 間奏 終曲 音色 拍子 楽団 楽章 奏鳴曲 序曲 前奏曲 遁走曲 練習曲 夜想曲 小夜曲 狂詩曲 譚詩曲 賛歌 聖歌 頌歌
		 鎮魂曲 交声曲 聖譚曲 牧歌曲 詠唱 二重唱 三重唱 四重奏 五重奏 合奏団 管弦楽 合唱団 独奏者 指揮者 終止 反復句 楽節 ブリッジ コーダ 漸強 漸弱 断奏 滑奏
			震音 顫音 グリッサンド 分散和音 八度 半音 旋法 調性 音部記号 五線譜 記譜法 総譜 節拍器 調律器 増幅器 踏板 リード 譜面台 弦 指板 響孔 吹口 ピストン
			マレット 鈸 小鼓 通奏低音 強拍 弱拍 切分音 即興演奏 演奏会 大道芸 再演 喝采 独奏会 発表会
		`),place:a(`
			市場 広場 都市 村 路地 橋 庭 図書館 博物館 劇場 学校 公園 港 埠頭 桟橋 駅 空港 灯台 城 城壁 宮殿 寺 神社 塔 屋根裏 地下室 屋上 中庭 縁側 温室 納屋
			山小屋 展望台 遊び場 運動場 体育館 水族館 美術館 動物園 植物園 遊園地 銭湯 市役所 郵便局 銀行 病院 薬局 書店 パン屋 喫茶店 食堂 台所 寝室 居間 廊下 階段
			地下道 歩道橋 交差点 並木道 砦 農場 牧場 果樹園 大通り 遊歩道 波止場 商店街 路地裏 露台 露壇 吹抜け 玄関 待合室 階段室 最上階 地階 貯蔵室 中二階 食品庫
			納戸 作業場 工房 画廊 資料館 観測所 天文台 記念館 応接室 葡萄畑 草地 牧草地 田畑 前庭 穀倉 風車小屋 水車小屋 時計台 物見櫓 鐘楼 尖塔 回廊 礼拝堂 祠堂 聖所
			修道院 大修道院 城砦 稜堡 望楼 跳ね橋 堀 楼門 天守 屋台街 商館 倉庫 物流倉庫 終着駅 船着場 防波堤 停泊地 港湾 海岸通り 野営地 丸太小屋 別荘 邸宅 荘園 集落
		`),food:a(`
			米 御飯 粥 麺 蕎麦 饂飩 拉麺 餃子 寿司 天麩羅 刺身 丼 弁当 味噌 醤油 塩 砂糖 胡椒 大蒜 玉葱 芋 人参 胡瓜 南瓜 白菜 茸 豆腐 納豆 卵 チーズ バター
			ヨーグルト 林檎 苺 葡萄 西瓜 桃 柿 蜜柑 檸檬 バナナ マンゴー チョコレート 飴 ゼリー クッキー ケーキ プリン ドーナツ ワッフル パンケーキ ハンバーガー ピザ
			パスタ カレー シチュー スープ サラダ 焼肉 唐揚げ 餅 団子 饅頭 羊羹 煎餅 蜂蜜 バゲット クロワッサン 食パン ベーグル プレッツェル 焼菓子 マカロン ビスケット
			薄焼 クレープ 卵焼 オムレツ キッシュ リゾット パエリア 芋団子 ラビオリ ラザニア タリアテレ マカロニ 米麺 重湯 味噌汁 ビスク コンソメ ポトフ 煮物 グラタン
			ミートローフ 腸詰 塩豚 燻肉 生ハム サラミ 練物 フライ カツレツ 肉団子 串焼肉 串物 網焼 蒸焼 胸肉 背肉 腰肉 内腿 骨付 切身 締魚 タルタル コールスロー 枝豆
			ジャム 辛味 漬物 甘辛漬 薬味漬 マーマレード カスタード メレンゲ ティラミス チーズケーキ ブラウニー ビスコッティ コロッケ ファラフェル シュウマイ 肉まん サモサ
			エンパナーダ 春巻 雲呑 ピロシキ 大福
		`),sport:a(`
			サッカー 野球 バスケ バレー 卓球 テニス ゴルフ ボウリング ビリヤード 水泳 陸上 マラソン 短距離 体操 空手 柔道 剣道 相撲 ボクシング レスリング フェンシング
			弓道 射撃 馬術 漕艇 カヌー ヨット サーフィン スキー スノボ ホッケー ラグビー クリケット 登山 縄跳び ラケット バット ゴール メダル 優勝 決勝 予選 応援 逆転
			延長 練習 ポロ カーリング スケート 飛込 ソフトボール ラクロス ダーツ ジョギング ハードル 槍投 円盤投 リレー 得点板 反則 延長戦 本塁打 自由形 背泳 平泳 重量挙
			ボブスレー リュージュ 打点 得点 走塁 送球 補球 跳躍 助走 号砲 表彰台 選手権 開会式 閉会式 十種競技 鉄人 岩登り 水球 組手 フック アッパー 昇段 足払 巴投
			背負投 宙返 逆立 準備 作戦 アシスト 決着 同点 逆風 追風 競馬場 観客席 応援席 審判席 選手団 監督席 控え室 折り返し 決勝点 通過点 記録会 練習場 合宿 特訓
		`),vehicle:a(`
			自転車 汽車 小舟 自動車 バス タクシー トラック 単車 バイク スクーター 飛行機 旅客機 戦闘機 宇宙船 ロケット 潜水艦 客船 貨物船 帆船 筏 屋形船 軍艦 戦車 馬車
			荷車 台車 トラクター 消防車 救急車 パトカー ケーブルカー 地下鉄 電車 列車 機関車 カヤック 気球 飛行船 落下傘 橇 人力車 駕籠 三輪車 ワゴン リムジン 除雪車
			モノレール 双胴船 砕氷船 油槽船 艀 漁船 複葉機 水上機 探査機 着陸船 雪上車 一輪車 原付 牽引車 霊柩車 乳母車 軽自動車 貨物車 清掃車 散水車 給水車 巡視船 曳船
			潜水艇 ボート 荷馬車 寝台車 客車 急行 各停 遊覧船 渡船 山車 軽トラ 大型車 二輪車 四輪車 牛車 丸木舟 ゴンドラ 伝馬船 帆掛船 商船 護衛艦 駆逐艦 巡洋艦 哨戒艇
			旅客船 貨物機 輸送機 練習機 偵察機 無人機 飛行艇 滑空機 回転翼 軌道車 路面電車 トロッコ 鉱車 索道 ロープウェイ 遊覧車 荷台 台船 タグボート 引船
		`),product:a(`
			パソコン キーボード マウス モニター プリンター スピーカー イヤホン ヘッドホン マイク ドローン タブレット 携帯 充電器 電池 リモコン 冷蔵庫 洗濯機 掃除機 扇風機
			冷房 暖房 浄水器 炊飯器 電子レンジ ポット トースター ミキサー 加湿器 製氷機 剃刀 歯磨き 石鹸 洗剤 香水 口紅 腕時計 ルーター モデム スキャナ ゲーム機 充電池
			アンプ 電気釜 蒸し器 食洗機 乾燥機 ドライヤー 乳液 日焼止め 敷布団 カーテン 呼鈴 温度計 消火器 電卓 電球 蛍光灯 延長線 差込口 柔軟剤 芳香剤 除湿機 圧力鍋
			炒鍋 投影機 複合機 手提鞄 目覚時計 電気毛布 空気清浄機 換気扇 湯沸器 食器棚 泡立て器 皮むき器 栓抜き 魔法瓶 衣紋掛 洋服箪笥 本棚 座卓 安楽椅子 足置台
			マットレス 掛布団 敷布 枕覆 シャワー 蛇口 排水口 窓拭き 物干竿 洗濯挟 アイロン台 計量杯 計量匙 麺棒 撹拌機 濾過器 フライパン 保温ジャー
		`),color:a(`
			赤 青 黄 緑 紫 橙 桃色 桜色 茜色 朱色 紅色 藍色 群青 瑠璃色 空色 水色 若草色 萌黄 山吹 黄土色 琥珀色 亜麻色 生成色 象牙色 灰色 鼠色 銀鼠 墨色 漆黒
			純白 乳白 卵色 檸檬色 抹茶色 苔色 常磐色 深緑 若緑 浅葱色 縹色 露草色 紺色 濃紺 菫色 藤色 撫子色 牡丹色 臙脂 茶色 栗色 煉瓦色 錆色 焦茶 小豆色 葡萄色
			山葵色 玉子色 狐色 鴇色 珊瑚色 朱鷺色 若竹色 青磁色 錆浅葱 江戸紫 紅梅色 桜鼠 利休茶 鶯色 苅安 支子色 蒲公英色 銀朱 弁柄色 代赭 鉛丹 白群 甕覗 錆鼠 消炭色
			憲法黒 濡羽色 玉虫色 虹色
		`),finance:a(`
			帳簿 請求書 領収書 債券 株式 配当 利子 融資 抵当 預金 貯蓄 口座 残高 予算 監査 資産 負債 資本 収益 利益 損失 黒字 赤字 借金 信用 小切手 通貨 為替 利回
			証券 基金 信託 関税 税金 還付 保険料 年金 給与 賃金 賞与 手数料 印税 合併 買収 救済 担保 抵当権 商品券 金庫 国庫 送金 決済 清算 裁定 先物 手形 当座
			引出 明細 通帳 保管 受託 債権者 債務者 貸主 借主 保証人 評価額 鑑定額 減価償却 物価 不況 好況 流動性 支払能力 破産 寄付金 補助金 助成金 手当 給料 日当
			経費 支出 収入 在庫 原価 定価 割引 分割払 滞納 返済 満期 利率 元本 出資 融通 相場 元金
		`),tech:a(`
			サーバー キャッシュ バッファ 画素 符号 復号 圧縮 索引 問合せ 予備 リポジトリ クラスタ 複製 写し 配布 移植 書庫 経路 拡張子 ドライバ 待行列 配列 行列 整数 実数
			文字列 構文 解析器 翻訳器 インタプリタ 機械語 命令語 転送率 処理量 終端点 併合 誤り トレーサ 端末機 コンソール 反復文 条件文 関数 変数 定数 対象 階層 継承 再帰 通信網
			無線 有線 基地局 遮断壁 番地 領域名 通信路 帯域 遅延 節点 分岐 併合点 負荷 走査線 標本化 量子化 電文 回線網 交換機 中継器 変換器 記憶域 主記憶 補助記憶
			演算子 論理積 論理和 否定 半導体 集積回路 基板 端子 配線図 制御盤
		`),weather:a(`
			雲 風 雨 雪 霜 霧 露 虹 夕焼け 朝焼け 雷 稲妻 雷鳴 夕立 梅雨 台風 旋風 吹雪 陽炎 木漏れ日 霙 霧雨 豪雨 驟雨 突風 強風 微風 涼風 台風眼 雹粒 日差し
			樹霜 氷柱 蜃気楼 光冠 暈 小雨 大雨 通り雨 時雨 五月雨 春雨 秋雨 氷雨 雨脚 雨粒 雨音 雪解け 粉雪 牡丹雪 細雪 積雪 新雪 残雪 霜柱 初霜 朝露 夜露 朝霧
			夕霧 濃霧 霧氷 靄 霞 雷雨 落雷 稲光 暴風 暴風雨 烈風 疾風 順風 追い風 向かい風 潮風 山風 谷風 熱波 寒波 猛暑 酷暑 厳寒 冷気 暖気 湿気 気圧 天気 天候
			気候 晴天 曇天 雨天 快晴 薄曇り 日和 木枯らし 春一番 秋晴れ
		`),space:a(`
			宇宙 星 月 太陽 銀河 彗星 流星 極光 三日月 星屑 天の川 日食 月食 天頂 星明 惑星 衛星 小惑星 星雲 星団 星座 軌道 重力 自転 公転 黒点 太陽風 噴火口
			月面 光年 天体 恒星 天球 黄道 超新星 流星群 宇宙塵 太陽系 銀河核 成層圏 大気圏 真空 無重力 満月 新月 半月 上弦 下弦 月光 北極星 木星 火星
			金星 土星 水星 天王星 海王星 冥王星 暗黒星雲 星霜 天の原 星影 月影 日輪 月輪
		`),time:a(`
			夜明け 黄昏 薄暮 薄明 日暮れ 夏至 冬至 春分 秋分 季節 瞬間 永遠 祝日 刹那 朝 昼 夕 夜 正午 真夜中 未明 明け方 夕暮れ 宵 深夜 早朝 昨日 今日 明日
			明後日 一昨日 一日 二日 三日 十日 一月 半年 一年 今年 去年 来年 春 夏 秋 冬 初春 晩春 初夏 真夏 晩夏 初秋 晩秋 初冬 真冬 晩冬 節季 立春 立夏 立秋
			立冬 小暑 大暑 小寒 大寒 啓蟄 清明 穀雨 芒種 白露 霜降 時刻 時間 永劫 幼年 青春 老年 晩年 余生 時節 頃 昔 今 一瞬 束の間 暫時 年月 歳月 光陰
		`),emotion:a(`
			勇気 希望 情熱 郷愁 感謝 謙遜 忍耐 勤勉 慎重 節制 誠実 好奇 畏敬 平穏 孤独 恋情 渇望 友情 友愛 連帯 共感 憐憫 浪漫 余韻 名残 予感 静寂 微笑 喜び
			悲しみ 怒り 恐れ 驚き 楽しみ 嬉しさ 寂しさ 懐かしさ 愛しさ 恋しさ 憧れ 期待 不安 心配 憂い 憂鬱 陰鬱 落胆 絶望 失望 後悔 悔い 恥 誇り 慢心 嫉妬 羨望
			欲望 貪欲 愛情 慈しみ 優しさ 温もり 同情 信頼 疑い 疑念 猜疑 恐怖 戦慄 恐慌 激怒 憤り 苛立ち 退屈 倦怠 無関心 熱意 熱狂 興奮 高揚 意欲 決意 覚悟 信念
			確信 自信 謙虚 冷静 沈着 平静 動揺 緊張 安堵 慰め 許し 和解 感動 感激 陶酔 恍惚 歓喜 至福 満足 快感 痛み 苦しみ 哀れみ 情け 気持ち 心持ち 気分 機嫌
			情緒 感傷 哀愁
		`),body:a(`
			頭 額 眉 睫毛 瞼 鼻 鼻筋 口 唇 歯茎 歯 舌 顎 頬 耳 耳朶 首 項 肩 腕 肘 手首 手 掌 指 爪 拳 胸 肋 腹 臍 背 腰 尻 骨盤 脚 腿 膝 脛 脹脛 足
			足首 足指 踵 骨 肋骨 背骨 頭蓋 筋肉 腱 靭帯 関節 軟骨 心臓 肺 肝臓 胃 胆嚢 腎臓 脾臓 腸 大腸 小腸 膀胱 脳 神経 血管 動脈 静脈 毛細管 血 肉 肌 皮膚
			毛穴 毛 髪 髭 涙 汗 唾 息 脈拍 体温 鼓動 眼球 鼓膜 皺 雀斑 笑窪 傷跡 痣 水膨れ 胼胝 鎖骨 膝蓋骨 頬骨 顎骨 骨髄
		`),clothing:a(`
			帽子 靴 手袋 眼鏡 スリッパ サンダル 浴衣 服 外套 上着 上衣 背広 襯衣 洋服 和服 着物 羽織 袴 帯 足袋 草履 下駄 雪駄 甚平 半纏 法被 襦袢 肌着 下着
			寝間着 前掛け 頭巾 襟巻 首巻 領帯 締紐 革帯 腰帯 革靴 運動靴 長靴 室内履 制服 礼服 正装 婦人服 紳士服 外衣 雨具 雨合羽 水着 潜水服 作業着 防寒着 登山着
			体操着 袖 襟 裾 折襟 裏地 生地 織物 麻布 木綿 絹 羊毛 天鵞絨 革 毛皮 帽 鳥打帽 手拭 襟飾 蝶結 前垂 靴下 長靴下 靴紐 上履き 外履き 部屋着 普段着
			晴れ着 マフラー 頸巻 肩掛
		`),tool:a(`
			斧 鋸 梯子 鋏 螺子回 鑿 木槌 鑢 錐 穿孔器 万力 締具 水準器 下振 測径器 分度器 物差 金床 鞴 針 磁石 槌 金槌 玄能 木鎚 電動鑽 錐揉 紙鑢 鉋 鶴嘴
			鎌 大鎌 鍬 犂 熊手 喰切 半田鏝 研磨機 切断機 溶接機 巻尺 墨壺具 円規 手斧 釿 鉄梃 梃子 楔 滑車 歯車具 曲柄 大鎚 鏝 砥石 鋼鑢 卸金 篩具
			鋤 馬鍬 殻竿 紡錘具 杼 糸巻具 管巻 柄 刃 工具 道具 用具 装備 部品 螺子釘具 釘抜 鉄鎚 護謨鎚 三角定規 曲尺 直角定規 水平定規 罫書 分割器
			面取 継手 留接 台鉋
		`),drink:a(`
			珈琲 緑茶 紅茶 牛乳 水 湧水 炭酸水 麦茶 玄米茶 番茶 煎茶 抹茶 玉露 焙茶 昆布茶 甘酒 白湯 豆乳 乳酸菌飲料 飲物 清涼飲料 果汁 林檎汁 葡萄汁 蜜柑汁
			乳飲料 珈琲牛乳 濃縮珈琲 泡立珈琲 氷珈琲 氷茶 冷茶 熱茶 麦酒 生麦酒 黒麦酒 地麦酒 葡萄酒 白葡萄酒 赤葡萄酒 日本酒 清酒 濁酒 焼酎 泡盛 梅酒 果実酒 蒸留酒
			醸造酒 洋酒 混合酒 発泡酒 甘露 蜜水 砂糖水 湯 乳茶 紅茶乳 抹茶乳 果物汁 野菜汁 豆汁
		`)},parts:a(`
		尻尾 足跡 翼 影 瞳 声 息 温もり 香り 模様 鱗 鬣 角 嘴 鰭 巣 穴 卵 種 欠片 群れ
		里 国 王国 旅 物語 歌 踊り 星 光 音 風 波 丘 谷 実 束 羽根 爪 髭 眉 殻 笑み 涙
		陰 紋 破片 夢 記憶 面影
	`),frames:[{slots:["noun"],weight:10},{slots:["adjective","noun"],weight:38},{slots:["action","noun"],weight:26},{slots:["noun","part"],glue:["の"],weight:16},{slots:["adjective","noun","part"],glue:["","の"],weight:10}],syn:{kind:"pool",pool:a(`
			ラ リ ル レ ロ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ
			フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ワ ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ デ ド バ ビ ブ
			ベ ボ パ ピ プ ペ ポ
		`),minSyllables:2,maxSyllables:3}},cc={joiner:"",capitalize:!1,adjectives:a(`
		멋진 아름다운 귀여운 용감한 씩씩한 다정한 상냥한 슬기로운 엉뚱한 새침한 도도한
		우아한 고요한 조용한 시끄러운 빠른 느린 커다란 작은 둥근 뾰족한 부드러운 단단한
		가벼운 무거운 투명한 눈부신 은은한 짙은 옅은 깊은 높은 넓은 아득한 낯선
		오래된 새로운 신비한 수상한 자유로운 영원한 외로운 파란 붉은 노란 하얀 검은 초록
		보랏빛 은빛 금빛 별빛 달빛 햇빛 무지개 새벽 한밤 여름 겨울 봄날 가을 차가운
		따뜻한 시원한 달콤한 매콤한 씁쓸한 향기로운 촉촉한 바삭한 든든한 재빠른 서늘한
		나른한 발랄한 늠름한 당당한 포근한 아늑한 산뜻한 청량한 짜릿한 야무진 어여쁜
		사나운 정겨운 착한 순한 맑은 밝은 어두운 흐린 거친 매끈한 두꺼운 얇은
		기다란 짧은 낮은 얕은 좁은 가까운 진한 흐릿한 또렷한 뜨거운 상큼한 새콤한 고소한
		짭짤한 담백한 쫄깃한 폭신한 말랑한 보송한 뽀얀 유쾌한 명랑한 침착한 진지한
		엄격한 느긋한 게으른 수줍은 천진한 순진한 대담한 무모한 신중한 총명한 영리한
		똑똑한 뻔뻔한 의젓한 다부진 젖은 마른 잿빛 물빛
		하늘빛 자줏빛 연둣빛 새하얀 새까만 샛노란 새빨간 검푸른 아침 저녁 한여름 한겨울
		늦가을 초여름 별밤 안개 서리 이슬 구름 바람 파도 눈꽃 노을 불빛
	`),actions:a(`
		웃는 우는 잠자는 달리는 춤추는 노래하는 헤엄치는 날아가는 숨은 떠도는 빛나는
		반짝이는 걷는 뛰는 뒹구는 웅크린 조는 꿈꾸는 헤매는 떠나는 돌아온 사라진 나타난
		흩어진 피어난 스치는 감춰진 잊힌 물든 공부하는 일하는 요리하는 그리는 노래부르는
		연주하는 읽는 쓰는 세는 만드는 고치는 가꾸는 심는 캐는 낚는 사냥하는
		헤아리는 기다리는 지키는 찾는 부르는 속삭이는 외치는 웅얼거리는 노려보는
		지켜보는 훔쳐보는 엿듣는 기억하는 상상하는 고민하는 망설이는 결심하는 응원하는
		축하하는 인사하는 껴안는 쓰다듬는 달래는 깨우는 재우는 배웅하는 마중하는
		여행하는 방황하는 쫓는 도망치는 뛰어드는 날아오르는 내려앉는 맴도는 서성이는
		기어가는 구르는 뛰노는 장난치는 먹는 마시는 씹는 굽는 두드리는 나르는 미는
		당기는 던지는 잡는 놓친 숨기는 떠오르는 가라앉는 흐르는 넘치는 얼어붙은
		녹아내리는 타오르는 꺼진 피어오르는 흩날리는 쏟아지는 스며드는 번지는 익어가는
		자라나는 시드는 지는 뜨는 감은 뜬 기댄 매달린 누운 앉은 멈춘 쉬는 하품하는
		뒤척이는 서두르는 기웃대는 어슬렁대는 종종대는 갸웃하는
	`),nouns:{animal:a(`
			사자 호랑이 표범 치타 여우 늑대 곰 판다 수달 토끼 다람쥐 고양이 강아지 고래 돌고래 상어 거북 물개 펭귄 부엉이 올빼미 참새 까치 제비 독수리 매 학 백조
			오리 기러기 딱따구리 앵무새 공작 타조 말 사슴 노루 코끼리 기린 하마 원숭이 고릴라 개구리 도마뱀 카멜레온 뱀 나비 벌 잠자리 무당벌레 달팽이 개미 거미 문어
			오징어 해마 불가사리 소라 게 새우 잉어 연어 고등어 고슴도치 너구리 삵 두더지 박쥐 담비 오소리 코뿔소 염소 병아리 갈매기 까마귀 비둘기 꾀꼬리 청설모 코알라
			반딧불이 스라소니 재규어 퓨마 하이에나 자칼 코요테 딩고 미어캣 몽구스 족제비 울버린 비버 호저 개미핥기 나무늘보 마카크 맥 오카피 들소 물소 야크 영양 가젤
			임팔라 얼룩말 라마 알파카 낙타 당나귀 노새 조랑말 망아지 송아지 새끼양 오리새끼 매미 귀뚜라미 사마귀 하루살이 풍뎅이 사슴벌레 지렁이 지네 노래기 전갈
			진드기 벼룩 파리 모기 나방 누에 번데기 애벌레 올챙이 두꺼비 맹꽁이 도롱뇽 구렁이 살모사 독사 코브라 방울뱀 비단뱀 악어 이구아나 붕어 메기 가물치 쏘가리
			송사리 미꾸라지 장어 뱀장어 갈치 삼치 꽁치 멸치 조기 명태 대구 광어 도미 우럭 볼락 방어 참치 가오리 홍어 복어
		`),object:a(`
			물병 연필 지우개 우산 램프 등불 시계 거울 열쇠 자물쇠 가방 반지 목걸이 단추 실 붓 물감 종이 공책 책갈피 편지 엽서 우표 도장 나침반 지도 망원경 현미경
			사진기 필름 라디오 축음기 풍선 연 팽이 구슬 주사위 카드 퍼즐 블록 돛 닻 등대 천막 배낭 침낭 손전등 성냥 촛불 화분 주전자 찻잔 숟가락 접시 냄비 톱니
			태엽 자석 리본 베개 담요 바구니 빗자루 호루라기 밧줄 양동이 부채 지팡이 방패 화살 그물 낚싯대 항아리 다리미 그네 골무 실패 물레 베틀 지우개털 연필깎이
			잉크병 깃펜 펜촉 압지 봉투 서류철 바인더 클립보드 메모지 종이집게 압정 못머리 리벳 볼트 나사 와셔 받침쇠 경첩 걸쇠 자물통 열쇠고리 쇠사슬
			노끈 끈목 술장식 버클 지퍼 똑딱이 찍찍이 헝겊조각 문장 배지 팔찌 장신구 브로치 커프스 머리핀 머리띠 손목띠 발찌 가방끈 주머니 손가방 여행가방 궤짝
			나무통 깡통 도자기 유리병 물통 물동이 함지박 소쿠리 광주리
		`),nature:a(`
			하늘 얼음 파도 물결 바다 강 호수 폭포 계곡 산 언덕 들판 숲 동굴 사막 모래 바위 조약돌 화산 지진 밀물 썰물 그림자 메아리 향기 불꽃 잿불 빙하 산호 갯벌
			초원 여울 개울 물보라 벼랑 툰드라 스텝 사바나 대초원 습지대 늪지 소택지 하구 삼각주 석호 환초 피오르 후미 곶 반도 지협 군도 섬 고원 대지 협곡 골짜기
			절벽 크레바스 빙퇴석 너덜 바윗돌 암반 모래톱 여울목 암초 해저 해구 심연 간헐천 분기공 싱크홀 카르스트 종유석 석순 석굴 암굴 바위산 봉우리 첨봉 해일 지평
			수평 창공
		`),plant:a(`
			나무 잎 꽃 뿌리 씨앗 열매 이끼 고사리 대나무 소나무 단풍 벚꽃 민들레 해바라기 수국 억새 장미 백합 튤립 난초 연꽃 국화 매화 목련 진달래 개나리 철쭉 동백
			수선화 라벤더 라일락 카네이션 코스모스 제비꽃 클로버 토끼풀 잔디 갈대 부들 창포 도라지 담쟁이 덩굴 줄기 가지 새싹 떡잎 꽃잎 꽃가루 나이테 솔방울 도토리
			밤송이 은행잎 잣나무 감나무 밤나무 배나무 뽕나무 참나무 버들 목화 삼나무 전나무 편백 향나무 덤불 봉숭아 나팔꽃 채송화 맨드라미 붓꽃 작약 모란 안개꽃 유채꽃
			메밀꽃 포플러 사시나무 오리나무 개암 마가목 산사나무 자두나무 딱총나무 층층나무 등나무 인동초 재스민 치자 협죽도 무궁화
			금잔화 백일홍 페튜니아 베고니아 제라늄 앵초 설강화 블루벨 델피늄 초롱꽃 루피너스 과꽃 달리아 프리지어 아네모네 미나리 엉겅퀴 쐐기풀 산딸기
			히스 수레국화 속새 우산이끼 지의류 해초 다시마 조류 왕대 야자수 유카 용설란 선인장 다육 알로에 바질 타임 로즈메리 오레가노 파슬리 고수
			부추꽃 회향 딜 세이지 마조람 타라곤 박하 캐모마일
		`),gem:a(`
			금 은 구리 철 강철 청동 황동 주석 아연 백금 니켈 티타늄 수정 석영 자수정 흑수정 형석 방해석 운모 장석 활석 흑연 유황 옥 비취 백옥 청옥 홍옥 마노
			호박석 진주 상아 흑요석 부싯돌 석고 루비 사파이어 에메랄드 오팔 토파즈 가넷 지르콘 대리석 화강암 현무암 사암 석회암 편암 규암 운석 원석 광석 보석 금괴
			은괴 금박 은박 사금 자개 결정 감람석 전기석 월장석 일장석 혈석 청금석 공작석 남동석 터키석 홍옥수 옥수 황수정 첨정석 금운모 방연석 자철석 적철석 황철석
			남정석 홍주석 규선석 휘석 각섬석 사문석 녹니석 고령토 백운석 인회석 중정석 천청석 강옥 녹주석 코발트 크롬 망간 텅스텐 안티몬 비스무트 카드뮴 이리듐 오스뮴
			팔라듐 로듐 루테늄 탄탈럼 니오븀 바나듐 셀레늄 텔루륨 갈륨 인듐 탈륨 루비듐 세슘 스트론튬 바륨 리튬 규석 백운모 녹옥수 섬아연석 아연광 주석광 은광석 금광석
			철광석 황옥 광맥 정동 단결정
		`),concept:a(`
			자유 평화 정의 진리 지혜 기억 추억 상상 이야기 시 그림 문법 논리 철학 물리 화학 생물 수학 기하 대수 역사 신화 전설 우화 속담 수수께끼 비밀 약속 인연
			여행 모험 탐험 발견 실험 관찰 질문 대답 토론 회의 축제 잔치 차원 균형 조화 색채 명암 의식 관습 문화 언어 문자 암호 기록 지도책 달력 흔적 지평선 통찰
			침묵 속삭임 직관 이성 판단 교리 정리 공리 따름정리 가설 역설 딜레마 패러다임 틀거리 전제 추론 연역 귀납 유추 은유 상징 모티프 서사 연대기 문서고
			증언 선언문 합의 타협 언약 조약 동맹 경쟁심 혈연 진실 몽상 깨달음 정화 갱신 재생 유산 전통 의례 이정표 문턱 서막 결말 반전 여백
		`),myth:a(`
			용 이무기 봉황 해태 도깨비 구미호 선녀 요정 정령 마녀 유령 혼령 원령 신령 천사 악마 마룡 비룡 흑룡 백룡 청룡 백호 주작 현무 삼족오 인어 하피 유니콘
			드래곤 와이번 불사조 그리핀 키메라 히드라 골렘 오크 고블린 트롤 엘프 드워프 흡혈귀 좀비 마법 마력 주문 저주 예언 신탁 결계 요괴 괴수 마수 영수 신수 환수
			마왕 용왕 여신 수호신 성배 마검 부적 룬 봉인 환영 마술 도술 술법 마법진 명계 천마 만티코어 키마이라 키클롭스 티탄 님프 드리아드 나이아드 세이렌 고르곤
			반인반수 나찰 사티로스 파우누스 스핑크스 페가수스 크라켄 베헤모스 밴시 망령 사령 구울 그림자령 혼백 물귀신 진니 이프리트 장승 야차 가고일 임프
			삼신 픽시 코볼트 노움 오거 거인족 발키리 노른 복수신 운명신 뮤즈 현자 흑마법사 소서러 주술사 강령술사 호신부 호부 룬문자 인장술 문양술 저주술
			축복술 징조 전조 예언서 신화집 전설집
		`),job:a(`
			기사 마법사 사냥꾼 도둑 해적 선장 요리사 정원사 대장장이 탐정 시인 화가 무용수 광대 나그네 순례자 수도사 연금술사 궁수 검객 무사 장군 병사 파수꾼 문지기
			수호자 왕 여왕 왕자 공주 황제 재상 집사 시녀 상인 장사꾼 농부 어부 목동 나무꾼 사공 마부 선원 항해사 조종사 기관사 우체부 배달부 청소부 경비원 소방관
			경찰관 의사 간호사 약사 수의사 교사 학생 사서 기자 작가 편집자 번역가 통역사 가수 배우 감독 악사 광부 목수 도공 재봉사 제빵사 점술사 예언자 사제 무당
			승려 신관 학자 박사 연구원 발명가 탐험가 여행자 선수 심판 곡예사 조각가 지도학자 서지학자 큐레이터 보존가 고고학자 분류학자 지질학자 기상학자 천문학자
			식물학자 동물학자 곤충학자 조류학자 해양학자 화학자 물리학자 통계학자 계리사 경제학자 사회학자 인류학자 언어학자 문헌학자 역사학자 교정자 조판공 삽화가 촬영감독
			각본가 극작가 소설가 방송인 아나운서 외교관 공증인 법무사 검사 치안판사 집행관 감사관 부기원 감정사 인수인 중개인 회계사 측량사 제도사 정비공 기계공 용접공
			배관공 삭구공 유리공 지붕공 미장공 벽돌공 석공 열쇠공 디자이너 제화공 모자장인 직조공 염색공 무두장이 통메장이 도예가 유리장인 금세공 은세공 시계공 악기장인
			조향사 양조인 맥주장인
		`),music:a(`
			피아노 기타 바이올린 북 종 방울 가야금 노래 춤 리듬 박자 선율 화음 피리 나팔 트럼펫 색소폰 플루트 하프 첼로 비올라 드럼 심벌즈 탬버린 마라카스 실로폰
			오르간 아코디언 하모니카 우쿨렐레 만돌린 밴조 거문고 해금 아쟁 장구 꽹과리 징 소고 단소 대금 태평소 악보 음표 쉼표 음계 화성 합창 독창 합주 독주 연주
			무대 관현악 교향곡 협주곡 소나타 왈츠 재즈 블루스 발라드 자장가 행진곡 후렴 간주 전주 음색 악단 악장 서곡 전주곡 푸가 연습곡 야상곡 세레나데 광시곡 찬가
			성가 캐럴 성창 진혼곡 칸타타 마드리갈 아리아 이중창 삼중창 사중주 오중주 앙상블 합창단 독주자 지휘자 종지 악절 브리지 코다 점점세게 점점여리 스타카토 레가토
			비브라토 트레몰로 글리산도 옥타브 반음 선법 조성 음자리표 오선 기보 총보 메트로놈 조율기 증폭기 페달 리드 보면대 현 지판 울림통 밸브 북채 스네어
			저음부 강박 약박 당김음 즉흥연주 잼세션 버스킹 앙코르 기립박수 독주회 발표회
		`),place:a(`
			시장 광장 도시 마을 골목 다리 정원 도서관 박물관 극장 학교 공원 항구 부두 정류장 역 공항 나루터 성곽 궁궐 사원 탑 옥상 마당 텃밭 온실 창고 오두막
			전망대 놀이터 운동장 체육관 수영장 목욕탕 시청 우체국 은행 병원 약국 서점 빵집 카페 식당 주방 침실 거실 복도 계단 터널 육교 사거리 산책로 동물원 식물원
			수족관 미술관 성당 요새 농장 목장 과수원 마천루 전시장 대로 해안 아케이드 안마당 테라스 발코니 베란다 중정 현관 로비 통로 계단참 누각 지하층 저장고
			다락방 지붕 곳간 골방 작업장 작업실 화랑 기록관 관측소 천문대 전시관 유리온실 포도밭 초지 목초지 농가 앞뜰 풍차 물레방아 봉화대 망루 종탑 첨탑 회랑
			예배당 사당 성소 수도원 대성당 성채 성벽 보루 망대 도개교 해자 문루 아성 장터 상점가 헛간 물류창고 터미널 방죽 선착장 잔교 방파제 정박지 해변
			야영지 산장 별장 저택 장원 촌락
		`),food:a(`
			밥 죽 떡 빵 국수 라면 만두 김밥 김치 된장 고추장 간장 소금 설탕 마늘 양파 감자 고구마 당근 오이 호박 배추 상추 시금치 버섯 두부 계란 치즈 버터 사과
			딸기 포도 수박 참외 복숭아 자두 귤 레몬 바나나 망고 체리 초콜릿 사탕 젤리 쿠키 케이크 푸딩 도넛 와플 햄버거 피자 파스타 샐러드 카레 비빔밥 불고기 냉면
			떡볶이 초밥 꿀 시럽 바게트 크루아상 브리오슈 베이글 프레첼 머핀 스콘 크럼펫 팬케이크 크레페 오믈렛 프리타타 키슈 리소토 파에야 뇨키 라비올리 라자냐 링귀네
			페투치네 교자 라멘 우동 소바 쌀국수 죽밥 미음 차우더 비스크 콩소메 굴라시 스튜 캐서롤 미트로프 소시지 베이컨 하몽 살라미 테린 커틀릿 슈니첼 미트볼 케밥
			꼬치 바비큐 로스트 양지 등심 채끝 안심 닭다리 필레 사시미 세비체 타르타르 코울슬로 후무스 과카몰레 살사 피클 처트니 렐리시 커스터드 머랭 티라미수 브라우니
			마카롱 크로켓 팔라펠 피에로기 타말레 엠파나다 사모사 춘권 완탕 만두피 찹쌀떡
		`),sport:a(`
			축구 야구 농구 배구 탁구 테니스 배드민턴 골프 볼링 당구 수영 육상 마라톤 달리기 체조 태권도 유도 검도 권투 씨름 레슬링 펜싱 양궁 사격 승마 카누 요트
			서핑 스키 하키 럭비 핸드볼 사이클 등산 크리켓 공 라켓 배트 글러브 골대 메달 트로피 우승 결승 역전 응원 폴로 컬링 스케이트 다이빙 소프트볼 라크로스 스누커
			다트 조깅 허들 창던지기 계주 점수판 헬멧 드리블 반칙 예선 연장전 홈런 슬라럼 자유형 배영 평영 접영 역도 스노보드 봅슬레이 루지 골인 패스 스매시 서브 랠리
			우승기 결승선 출발선 십종경기 철인경기 암벽 윈드서핑 수구 스파링 훅 어퍼컷 녹아웃 태클 옆차기 뒤차기 공중제비 물구나무 몸풀기 작전시간 도움 승부차기 듀스
			버디 보기 퍼터 경마장 관중석 응원석 심판석 선수단 감독석 벤치 후보석 반환점
		`),vehicle:a(`
			자전거 기차 배 썰매 자동차 버스 택시 트럭 오토바이 스쿠터 킥보드 비행기 헬기 여객기 우주선 로켓 잠수함 유람선 나룻배 뗏목 돛단배 화물선 여객선 군함 전차
			마차 수레 손수레 지게차 트랙터 굴착기 소방차 구급차 경찰차 케이블카 지하철 전철 열차 기관차 범선 카약 열기구 낙하산 가마 승합차 픽업 리무진 제설차 인력거
			쌍동선 쇄빙선 유조선 바지선 어선 복엽기 수상기 탐사선 착륙선 왕복선 설상차 삼륜차 원동기 캠핑카 견인차 영구차 유모차 소형차 승용차 화물차 청소차 살수차
			순찰차 예인선 잠수정 보트 화물칸 객차 침대차 급행 완행 경차 대형차 이륜차 사륜차 우마차 짐차 달구지 조각배 거룻배 놀잇배 통나무배 쪽배 갤리선 상선 초계함
			구축함 순양함 호위함 화물기 수송기 훈련기 정찰기 무인기 비행정 활공기 회전익 궤도차 노면전차 모노레일 광차 삭도 곤돌라 유람차
		`),product:a(`
			노트북 컴퓨터 키보드 마우스 모니터 프린터 스피커 이어폰 헤드폰 마이크 카메라 드론 태블릿 휴대폰 충전기 배터리 리모컨 냉장고 세탁기 청소기 선풍기 에어컨
			정수기 커피머신 믹서기 토스터 오븐 텔레비전 가습기 면도기 칫솔 치약 비누 샴푸 향수 손목시계 프로젝터 공유기 모뎀 스캐너 웹캠 앰프 튀김기 찜기 건조기
			드라이기 로션 선크림 매트리스 커튼 초인종 온도계 소화기 계산기 스탠드 전구 콘센트 멀티탭 이불 베갯잇 수건 대야 청소포 세제 유연제 방향제 살균기 제습기
			압력솥 프라이팬 냄비뚜껑 채반 거품기 감자칼 보온병 텀블러 발매트 옷걸이 옷장 책장 협탁 안락의자 소파쿠션 발받침 침대틀 침대보 베개커버 샤워기 수도꼭지 전기밥솥
			유리닦이 건조대 다리미판 전기포트 커피잔 접시받침 식칼 뒤집개 거름망 밀대 반죽기 계량컵 계량스푼
		`),color:a(`
			빨강 파랑 노랑 초록 보라 주황 남색 하양 검정 회색 갈색 분홍 자주 청록 연두 하늘색 살구색 크림색 상아색 진홍 진분홍 다홍 주홍 선홍 심홍 자홍 벽돌색
			적갈색 황토색 밤색 고동색 커피색 카키색 올리브색 쪽빛 감청 군청 남보라 청자색 옥색 비취색 풀색 쑥색 연회색 은회색 먹색 흑갈색 자줏빛 우윳빛 재색 팥죽색
			겨자색 호박색 귤색 오렌지 앵두색 자두색 포도색 계란색 소라색 바다색 물색 진회색 연분홍 연보라 연갈색 진갈색 진남색 진초록 청보라 흑청색 백금색 은백색
			금갈색 구릿빛 청동색 상앗빛 진주빛 흙빛 핏빛 잿빛 물빛 노을빛 새벽빛
		`),finance:a(`
			예금 대출 이자 환율 주식 채권 자산 계좌 저축 투자 배당 수익 손실 원금 잔고 장부 영수증 청구서 세금 관세 지폐 동전 화폐 금고 수표 어음 담보 보증 연금
			급여 임금 상여 수수료 인세 합병 인수 파산 흑자 적자 예산 결산 회계 매출 매입 이익 마진 시세 증권 펀드 환전 송금 이체 결제 할부 연체 상환 융자 저당
			보험료 보험금 세율 공제 환급 지출 자본 부도 호황 불황 기부금 보조금 용돈 월급 일당 수당 경비 재고 원가 정가 할인 계약금 잔금 통장 인출 입금 예치 만기
			이윤 채무 채권자 자본금 유동성
		`),tech:a(`
			서버 코드 회로 신호 통신 접속 회선 대역 지연 관문 방화벽 주소 도메인 세션 캐시 버퍼 화소 픽셀 부호 압축 복호 해시 색인 질의 백업 저장소 군집 복제본
			사본 배포 이식 파일 폴더 경로 확장자 구동기 커널 스택 대기열 자료형 배열 행렬 정수 실수 문자열 구문 해석기 번역기 실행기 기계어 명령어 전송률 처리량
			종단점 병합 오류 추적기 단말기 콘솔 명령창 반복문 조건문 함수 변수 상수 객체 클래스 상속 재귀 자료구조 연결망 무선 유선 기지국 라우터 계정 로그
			백엔드 소스 빌드 배치 패치 버그 커밋 분기 병목 부하 대역폭 노드 클럭
		`),weather:a(`
			구름 바람 비 눈 서리 안개 이슬 무지개 노을 번개 천둥 소나기 장마 태풍 회오리 눈보라 이슬비 폭우 여우비 돌풍 강풍 산들바람 미풍 돌개바람 서릿발 우박
			진눈깨비 상고대 고드름 눈더미 햇살 아지랑이 물안개 햇무리 달무리 신기루 땅거미 빗방울 빗줄기 소낙비 가랑비 안개비 봄비 밤비 단비 장맛비 궂은비 첫눈 함박눈
			싸락눈 무서리 된서리 열대야 무더위 한파 폭염 혹한 삭풍 된바람 실바람 열풍 훈풍 광풍 먹구름 비구름 눈구름 저기압 고기압 기압골 전선 일기 날씨 기온 습도
			이슬점 서리꽃 성에 뇌우 뇌성 벼락 물벼락 볕 볕뉘 그늘 응달 양달 황사 스콜 폭풍 폭풍우 비바람 눈바람 칼바람 봄바람 밤바람
		`),space:a(`
			우주 별 달 태양 은하 별자리 유성 오로라 초승달 보름달 별똥별 일식 월식 코로나 극광 별무리 천정 행성 위성 혜성 소행성 성운 성단 은하수 북극성 샛별 금성
			목성 토성 천왕성 해왕성 수성 명왕성 궤도 중력 자전 공전 흑점 태양풍 분화구 월면 광년 천체 성간 항성 성좌 천구 황도 블랙홀 초신성 유성우 우주먼지
			태양계 은하핵 성층권 대기권 진공 무중력 은하단 그믐달 반달 하현달 상현달 만월 신월 월광 성광
		`),time:a(`
			새벽 여명 해질녘 하지 동지 춘분 추분 계절 순간 영원 미래 찰나 세월 휴일 아침 낮 저녁 밤 정오 자정 한낮 한밤 초저녁 어제 오늘 내일 모레 그제 하루 이틀
			사흘 나흘 열흘 보름 한달 반년 한해 올해 작년 내년 봄 여름 가을 겨울 초봄 늦봄 초여름 한여름 늦여름 초가을 늦가을 초겨울 한겨울 늦겨울 환절기 절기 입춘
			입하 입추 입동 소서 대서 소한 대한 경칩 청명 곡우 망종 백로 상강 시각 시간 영겁 유년 청춘 노년 말년 여생 시절 무렵 옛날 지금 나중 저물녘 해뜰녘
			한창 한때 잠깐 잠시 백년 천년
		`),emotion:a(`
			희망 열정 설렘 그리움 갈망 공감 연민 감사 겸손 인내 근면 신중 절제 성실 호기 경외 평온 고독 용기 우정 우애 연대 낭만 여운 기쁨 슬픔 분노 두려움 놀람
			서러움 외로움 쓸쓸함 반가움 고마움 미안함 부끄러움 뿌듯함 후련함 답답함 조바심 초조 불안 걱정 근심 시름 한숨 눈물 웃음 미소 환희 황홀 도취 감동 감격
			아쉬움 미련 후회 자책 원망 증오 질투 시기 욕심 탐욕 오만 자만 겸허 만족 안도 위안 위로 동정 애정 사랑 다정 냉정 무심 담담 태연 침착 흥분 열광 환호
			신명 재미 지루함 권태 나른함 피로 활기 생기 기운 의욕 열의 패기 투지 오기 끈기 결의 각오 다짐 신념 확신 의심 절망 낙담 좌절 체념 용서 화해
		`),body:a(`
			머리 이마 눈썹 속눈썹 눈꺼풀 코 콧등 입 입술 잇몸 혀 턱 볼 뺨 귀 귓바퀴 목 목덜미 어깨 팔 팔꿈치 손목 손 손바닥 손등 손가락 손톱 주먹 가슴 배꼽
			등 허리 엉덩이 골반 허벅지 무릎 정강이 종아리 발 발목 발등 발가락 발톱 뒤꿈치 뼈 갈비뼈 척추 등뼈 두개골 근육 힘줄 인대 관절 연골 심장 허파 폐 간 위
			쓸개 콩팥 지라 창자 대장 소장 방광 뇌 신경 핏줄 동맥 정맥 실핏줄 피 살 살갗 피부 털 머리카락 수염 콧수염 땀 침 숨 맥박 체온 눈알 고막 주름 주근깨
			보조개 흉터 멍 물집 굳은살
		`),clothing:a(`
			모자 신발 장갑 목도리 안경 슬리퍼 샌들 목욕가운 옷 외투 코트 셔츠 블라우스 티셔츠 바지 청바지 반바지 치마 원피스 조끼 재킷 점퍼 스웨터 니트 가디건 후드
			양말 스타킹 속옷 내복 잠옷 앞치마 두건 스카프 넥타이 벨트 허리띠 구두 운동화 부츠 장화 실내화 교복 제복 정장 드레스 한복 저고리 두루마기 도포 갓 버선
			대님 토시 배자 마고자 망토 케이프 판초 우비 우의 비옷 수영복 잠수복 작업복 방한복 등산복 체육복 유니폼 소매 옷깃 옷자락 옷감 비단 무명 삼베 모시 가죽
			털옷 조끼허리 목폴라 반팔 긴팔 민소매
		`),tool:a(`
			도끼 삽 톱 사다리 망치자루 줄톱 송곳 펀치 클램프 바이스 수평기 다림줄 캘리퍼 각도기 자막대 집게 펜치 렌치 끌 모루 풀무 저울 가위 바늘 망치 드릴 사포
			대패 곡괭이 낫 호미 쟁기 갈퀴 니퍼 스패너 드라이버 인두 그라인더 절단기 용접기 줄자 먹줄 컴퍼스 그림쇠 자귀 손도끼 쇠지레 지렛대 쐐기 도르래 톱니바퀴
			크랭크 렌치자루 죔쇠 물미 정 끌망치 다듬돌 숫돌 줄칼 강판 체 삽자루 써레 도리깨 키질 방추 잉아 바디 얼레 자새 활비비 손잡이 톱날
			칼날 날붙이 연장 공구 기구 장비 부품 나사못 못뽑이 쇠망치 나무망치 고무망치 오함마 삼각자 곱자 직각자 수평자 죔틀 물레바퀴 실패바늘
		`),drink:a(`
			커피 녹차 주스 우유 물 생수 탄산수 보리차 옥수수차 유자차 대추차 인삼차 매실차 식혜 수정과 미숫가루 두유 요구르트 라떼 카푸치노 모카 마키아토 콜라 사이다
			스무디 에이드 슬러시 아이스티 맥주 막걸리 소주 청주 약주 와인 위스키 브랜디 보드카 럼 데킬라 사케 고량주 칵테일 하이볼 샴페인 리큐어 사이더 우롱차 재스민차
			국화차 생강차 모과차 칡즙 식초 음료 청량음료 과실주 곡주 증류주 발효주 흑맥주 생맥주 감주 단술 숭늉 차 찻물 냉수 온수 얼음물 설탕물 꿀물
		 밀크티 홍차라떼 홍차 캔커피 병맥주 캔맥주 곡차 보리음료
		`)},parts:a(`
		꼬리 발바닥 발자국 날개 그림자 눈동자 손길 발걸음 목소리 숨결 온기 향기 무늬
		비늘 갈기 뿔 부리 지느러미 둥지 굴 알 씨앗 조각 무리 마을 나라 왕국 여행 이야기
		노래 춤 별 빛 소리 바람 물결 언덕 골짜기 열매 다발 깃털 발톱 수염 눈썹 껍데기
		웃음 울음 그늘 문양 파편
	`),frames:[{slots:["noun"],weight:10},{slots:["adjective","noun"],weight:32},{slots:["action","noun"],weight:20},{slots:["noun","part"],weight:10},{slots:["adjective","noun","part"],weight:15},{slots:["action","noun","part"],weight:5},{slots:["noun","part"],glue:["의"],weight:8}],syn:{kind:"pool",pool:a(`
			가 나 다 라 마 바 사 아 자 차 카 타 파 하 거 너 더 러 머 버 서 어 저 처 커 터 퍼
			허 고 노 도 로 모 보 소 오 조 초 코 토 포 호 구 누 두 루 무 부 수 우 주 추 쿠 투
			푸 후 기 니 디 리 미 비 시 이 지 치 키 티 피 히 개 내 대 래 매 배 새 애 재 채 캐
			태 패 해 겔 델 렐 멜 벨 셀 젤 린 민 신 진 칸 탄 판 한 룬 문 순 운
		`),minSyllables:2,maxSyllables:3}},da=Dn({animal:`
		кот:m собака:f лев:m тигр:m леопард:m гепард:m лиса:f волк:m медведь:m панда:f выдра:f
		кролик:m белка:f слон:m олень:m лошадь:f осёл:m корова:f бык:m коза:f овца:f свинья:f
		обезьяна:f горилла:f крокодил:m змея:f ящерица:f черепаха:f лягушка:f жаба:f птица:f
		ласточка:f воробей:m ворон:m сокол:m орёл:m павлин:m попугай:m сова:f голубь:m журавль:m
		лебедь:m утка:f гусь:m курица:f рыба:f кит:m дельфин:m акула:f осьминог:m кальмар:m
		креветка:f краб:m улитка:f бабочка:f пчела:f муравей:m паук:m стрекоза:f цикада:f муха:f
		комар:m червь:m летучая_мышь:f ёж:m енот:m барсук:m рысь:f бизон:m лось:m верблюд:m
		коала:f ленивец:m хорёк:m крот:m цапля:f пеликан:m морж:m ласка:f газель:f зебра:f
		буйвол:m тюлень:m пингвин:m страус:m
	`,object:`
		бутылка:f карандаш:m ластик:m зонт:m лампа:f фонарь:m зеркало:n ключ:m замок:m сумка:f
		пуговица:f игла:f нитка:f кисть:f краска:f бумага:f тетрадь:f письмо:n открытка:f марка:f
		карта:f микроскоп:m камера:f плёнка:f радио:n шар:m змей:m волчок:m шарик:m кубик:m
		карточка:f мозаика:f парус:m якорь:m палатка:f факел:m спичка:f свеча:f горшок:m чайник:m
		чашка:f ложка:f тарелка:f кастрюля:f шестерня:f пружина:f магнит:m лента:f конверт:m
		подушка:f одеяло:n корзина:f метла:f свисток:m верёвка:f ведро:n веер:m щит:m сеть:f
		удочка:f кувшин:m гребень:m колокольчик:m воронка:f поднос:m коробка:f бочка:f банка:f
	`,nature:`
		море:n река:f озеро:n водопад:m долина:f гора:f холм:m луг:m лес:m пещера:f пустыня:f
		песок:m скала:f галька:f вулкан:m ледник:m риф:m болото:n ручей:m бухта:f дюна:f вершина:f
		пустошь:f степь:f саванна:f устье:n дельта:f лагуна:f атолл:m фьорд:m мыс:m полуостров:m
		перешеек:m архипелаг:m островок:m плато:n каньон:m утёс:m трещина:f морена:f осыпь:f
		валун:m отмель:f мель:f бездна:f гейзер:m сталактит:m сталагмит:m грот:m уступ:m склон:m
		тень:f эхо:n источник:m берег:m побережье:n
	`,plant:`
		дерево:n лист:m цветок:m корень:m семя:n плод:m мох:m папоротник:m бамбук:m сосна:f клён:m
		вишня:f роза:f лотос:m хризантема:f орхидея:f одуванчик:m подсолнух:m кувшинка:f трава:f
		ветка:f росток:m бутон:m лепесток:m пыльца:f шишка:f жёлудь:m гинкго:n ива:f берёза:f
		кедр:m ель:f дуб:m каштан:m орех:m газон:m водоросль:f изгородь:f букет:m кактус:m алоэ:n
		базилик:m тимьян:m орегано:n петрушка:f кинза:f розмарин:m фенхель:m укроп:m шалфей:m
		эстрагон:m мята:f ромашка:f лаванда:f плющ:m пальма:f
	`,gem:`
		золото:n серебро:n медь:f железо:n сталь:f бронза:f латунь:f олово:n цинк:m платина:f
		кристалл:m кварц:m аметист:m агат:m янтарь:m жемчуг:m нефрит:m опал:m обсидиан:m мрамор:m
		гранит:m известняк:m базальт:m кремень:m метеорит:m руда:f самоцвет:m слиток:m слюда:f
		флюорит:m кальцит:m малахит:m гранат:m сера:f самородок:m графит:m ртуть:f гипс:m жила:f
		оливин:m турмалин:m рубин:m сапфир:m изумруд:m топаз:m циркон:m пирит:m магнетит:m
		гематит:m киноварь:f галенит:m тальк:m висмут:m
	`,concept:`
		свобода:f мир:m истина:f мудрость:f память:f воображение:n рассказ:m стих:m набросок:m
		грамматика:f логика:f физика:f химия:f биология:f философия:f математика:f геометрия:f
		алгебра:f история:f миф:m легенда:f басня:f пословица:f загадка:f тайна:f обещание:n
		путешествие:n приключение:n плавание:n открытие:n опыт:m вопрос:m ответ:m спор:m совет:m
		праздник:m измерение:n равновесие:n гармония:f обряд:m обычай:m культура:f язык:m
		алфавит:m шифр:m архив:m календарь:m горизонт:m чутьё:n разум:m суждение:n учение:n
		теорема:f аксиома:f гипотеза:f парадокс:m дилемма:f образец:m посылка:f вывод:m аналогия:f
		метафора:f символ:m летопись:f манифест:m договор:m союз:m родословная:f наследие:n
		традиция:f церемония:f порог:m
	`,myth:`
		дракон:m феникс:m единорог:m русалка:f фея:f гоблин:m эльф:m гном:m тролль:m огр:m
		великан:m химера:f гидра:f грифон:m кентавр:m минотавр:m сфинкс:m пегас:m кракен:m
		василиск:m голем:m вампир:m оборотень:m призрак:m дух:m душа:f демон:m ангел:m богиня:f
		бог:m заклинание:n проклятие:n пророчество:n оракул:m амулет:m талисман:m руна:f портал:m
		святилище:n идол:m тотем:m нимфа:f наяда:f дриада:f валькирия:f муза:f колдун:m ведьма:f
		некромант:m алхимик:m мудрец:m примета:f бестиарий:m
	`,job:`
		рыцарь:m охотник:m вор:m пират:m матрос:m капитан:m повар:m садовник:m кузнец:m сыщик:m
		поэт:m художник:m танцор:m клоун:m странник:m паломник:m монах:m лучник:m фехтовальщик:m
		воин:m генерал:m солдат:m стражник:m привратник:m король:m королева:f принц:m принцесса:f
		император:m дворецкий:m служанка:f слуга:m торговец:m крестьянин:m рыбак:m пастух:m
		дровосек:m лодочник:m кучер:m лётчик:m инженер:m почтальон:m курьер:m дворник:m пожарный:m
		полицейский:m врач:m медсестра:f аптекарь:m ветеринар:m учитель:m ученик:m библиотекарь:m
		репортёр:m писатель:m редактор:m переводчик:m певец:m актёр:m режиссёр:m музыкант:m
		шахтёр:m плотник:m гончар:m портной:m гадалка:f пророк:m жрец:m учёный:m доктор:m
		изобретатель:m спортсмен:m судья:m акробат:m скульптор:m часовщик:m пекарь:m пивовар:m
		кожевник:m ткач:m
	`,music:`
		пианино:n гитара:f барабан:m колокол:m арфа:f песня:f танец:m ритм:m мелодия:f аккорд:m
		флейта:f труба:f саксофон:m кларнет:m гобой:m виолончель:f альт:m скрипка:f тарелки:p
		бубен:m ксилофон:m орган:m гармоника:f аккордеон:m лютня:f мандолина:f банджо:n
		партитура:f нота:f пауза:f гамма:f хор:m соло:n концерт:m сцена:f симфония:f соната:f
		вальс:m баллада:f колыбельная:f марш:m прелюдия:f интермедия:f тембр:m такт:m оркестр:m
		часть:f увертюра:f фуга:f этюд:m ноктюрн:m серенада:f рапсодия:f гимн:m реквием:m
		кантата:f ария:f дуэт:m трио:n квартет:m квинтет:m дирижёр:m октава:f полутон:m
		 нотоносец:m метроном:m педаль:f струна:f мундштук:m
	`,place:`
		рынок:m площадь:f город:m деревня:f переулок:m мост:m сад:m библиотека:f музей:m театр:m
		школа:f парк:m порт:m причал:m вокзал:m аэропорт:m маяк:m стена:f дворец:m храм:m башня:f
		чердак:m подвал:m терраса:f двор:m крыльцо:n теплица:f амбар:m хижина:f обсерватория:f
		площадка:f спортзал:m бассейн:m аквариум:m галерея:f зоопарк:m баня:f ратуша:f почта:f
		больница:f аптека:f книжный:m пекарня:f кофейня:f ресторан:m кухня:f спальня:f гостиная:f
		коридор:m лестница:f туннель:m перекрёсток:m аллея:f ферма:f ранчо:n огород:m
		аббатство:n монастырь:m бастион:m вышка:f ров:m верфь:n лагерь:m усадьба:f особняк:m
		хутор:m
	`,food:`
		рис:m хлеб:m лапша:f суп:m рагу:n салат:m соль:f сахар:m перец:m чеснок:m лук:m
		картофель:m морковь:f огурец:m тыква:f капуста:f шпинат:m гриб:m творог:m яйцо:n сыр:m
		масло:n йогурт:m яблоко:n клубника:f виноград:m арбуз:m персик:m апельсин:m лимон:m
		банан:m манго:n ананас:m шоколад:m конфета:f печенье:n торт:m пудинг:m
		пончик:m вафля:f блин:m бургер:m пицца:f карри:n омлет:m каша:f пирог:m пельмень:m
		вареник:m голубец:m борщ:m щи:p солянка:f окрошка:f сельдь:f колбаса:f ветчина:f бекон:m
		котлета:f шашлык:m варенье:n мёд:m сметана:f
	`,sport:`
		футбол:m бейсбол:m баскетбол:m волейбол:m теннис:m бадминтон:m гольф:m боулинг:m бильярд:m
		заплыв:m атлетика:f марафон:m гимнастика:f карате:n дзюдо:n фехтование:n борьба:f бокс:m
		стрельба:f гребля:f сёрфинг:m лыжи:p хоккей:m регби:n крикет:m велоспорт:m скалолазание:n
		ракетка:f бита:f ворота:p медаль:f кубок:m чемпион:m финал:m отбор:m тренировка:f
		поло:n конькобежец:m дротик:m барьер:m копьё:n диск:m эстафета:f табло:n
		шлем:m фол:m кроль:m брасс:m баттерфляй:m штанга:f сани:p подача:f отскок:m прыжок:m
		забег:m финиш:m пьедестал:m раздевалка:f трибуна:f болельщик:m
	`,vehicle:`
		велосипед:m поезд:m лодка:f автомобиль:m автобус:m такси:n грузовик:m мотоцикл:m самокат:m
		самолёт:m вертолёт:m звездолёт:m ракета:f подлодка:f яхта:f сухогруз:m парусник:m плот:m
		линкор:m танк:m карета:f телега:f тачка:f трактор:m экскаватор:m скорая:f канатка:f
		метро:n трамвай:m паровоз:m каноэ:n байдарка:f дирижабль:m парашют:m паланкин:m трицикл:m
		фургон:m лимузин:m снегоуборщик:m монорельс:m катамаран:m ледокол:m танкер:m баржа:f
		траулер:m биплан:m гидроплан:m зонд:m челнок:m снегоход:m моноцикл:m буксир:m гондола:f
		вагон:m
	`,product:`
		компьютер:m клавиатура:f мышь:f экран:m принтер:m динамик:m наушник:m микрофон:m дрон:m
		планшет:m телефон:m зарядка:f батарейка:f пульт:m холодильник:m стиралка:f пылесос:m
		вентилятор:m обогреватель:m фильтр:m рисоварка:f духовка:f блендер:m увлажнитель:m
		бритва:f щётка:f паста:f мыло:n шампунь:m духи:p часы:p проектор:m роутер:m сканер:m
		сушилка:f фен:m лосьон:m крем:m утюг:m сандалия:f матрас:m штора:f звонок:m градусник:m
		огнетушитель:m калькулятор:m лампочка:f розетка:f удлинитель:m наволочка:f
		полотенце:n таз:m порошок:m кондиционер:m скороварка:f сковорода:f кофеварка:f венчик:m
		овощечистка:f штопор:m термос:m коврик:m вешалка:f шкаф:m полка:f тумбочка:f
	`,color:`
		 пурпур:m маджента:f фуксия:f кармин:m охра:f
		сиена:f сепия:f кобальт:m лайм:m бирюза:f циан:m лазурь:f индиго:n сирень:f мальва:f
		умбра:f бордо:n ржавчина:f терракота:f сурик:m беж:m хаки:n антрацит:m
		багрянец:m чернь:f синь:f ультрамарин:m шафран:m аквамарин:m
		патина:f перламутр:m белизна:f желтизна:f синева:f голубизна:f
		пастель:f сурьма:f смальта:f кумач:m маренго:m бистр:m паприка:f селадон:m
	`,finance:`
		счёт:m квитанция:f облигация:f акция:f дивиденд:m процент:m заём:m ипотека:f вклад:m
		сбережение:n баланс:m бюджет:m аудит:m актив:m пассив:m капитал:m доход:m прибыль:f
		маржа:f излишек:m дефицит:m долг:m кредит:m дебет:m чек:m монета:f валюта:f доходность:f
		портфель:m пошлина:f возврат:m премия:f пенсия:f зарплата:f оклад:m бонус:m комиссия:f
		роялти:n франшиза:f слияние:n поглощение:n спасение:n залог:m ваучер:m купон:m сейф:m
		казна:f перевод:m расчёт:m арбитраж:m выписка:f сберкнижка:f хранение:n кредитор:m
		должник:m заимодавец:m поручитель:m оценка:f экспертиза:f инфляция:f спад:m ликвидность:f
		банкротство:n субсидия:f расход:m скидка:f рассрочка:f
	`,tech:`
		сервер:m кэш:m буфер:m пиксель:m кодек:m пакет:m протокол:m очередь:f стек:m куча:f
		указатель:m компилятор:m прошивка:f реестр:m задержка:f шлюз:m брандмауэр:m подсеть:f
		 нагрузка:f схема:f курсор:m резерв:m кластер:m осколок:m реплика:f снимок:m
		контейнер:m песочница:f конвейер:m хранилище:n отладчик:m макрос:m массив:m матрица:f
		целое:n синтаксис:m разборщик:m ассемблер:m команда:f прерывание:n битрейт:m трафик:m
		рукопожатие:n посредник:m шифрование:n дешифровка:f хеш:m отрисовка:f шейдер:m текстура:f
		сетка:f октет:m коммутация:f рассылка:f дейтаграмма:f загрузчик:m раздел:m каталог:m
		ссылка:f откат:m миграция:f
	`,weather:`
		облако:n ветер:m дождь:m снег:m иней:m туман:m роса:f радуга:f закат:m молния:f гром:m
		ливень:m муссон:m тайфун:m вихрь:m метель:f морось:f град:m мокрый_снег:m шторм:m порыв:m
		циклон:m гроза:f буря:f потоп:m дымка:f мгла:f влажность:f прогноз:m облачность:f солнце:n
		зной:m заморозок:m оттепель:f смерч:m бриз:m зефир:m пассат:m антициклон:m климат:m
		температура:f давление:n сумерки:p зарница:f духота:f изморозь:f сугроб:m наледь:f
		капель:f позёмка:f вьюга:f прояснение:n
	`,space:`
		звезда:f луна:f галактика:f комета:f метеор:m сияние:n млечный_путь:m затмение:n зенит:m
		вселенная:f планета:f спутник:m астероид:m туманность:f скопление:n созвездие:n орбита:f
		тяготение:n вращение:n обращение:n пятно:n кратер:m световой_год:m светило:n небосвод:m
		эклиптика:f меридиан:m стратосфера:f атмосфера:f вакуум:m невесомость:f полнолуние:n
		новолуние:n полумесяц:m лунный_свет:m перигей:m марс:m венера:f юпитер:m сатурн:m
		меркурий:m уран:m нептун:m плутон:m сверхновая:f чёрная_дыра:f квазар:m пульсар:m космос:m
	`,time:`
		рассвет:m заря:f сумрак:m пятилетие:n время_года:n мгновение:n вечность:f
		будущее:n миг:m век:m десятилетие:n утро:n полдень:m день:m вечер:m ночь:f полночь:f
		рань:f канун:m вчера:n сегодня:n сутки:p неделя:f месяц:m квартал:m полугодие:n год:m
		тысячелетие:n эпоха:f эра:f возраст:m весна:f лето:n осень:f зима:f старина:f давность:f
		детство:n юность:f зрелость:f старость:f срок:m промежуток:m период:m годовщина:f сезон:m
		полдник:m ночёвка:f
	`,emotion:`
		радость:f печаль:f гнев:m страх:m удивление:n веселье:n ликование:n счастье:n восторг:m
		экстаз:m утешение:n облегчение:n надежда:f отчаяние:n горе:n тоска:f ностальгия:f
		одиночество:n томление:n желание:n страсть:f нежность:f теплота:f доброта:f сострадание:n
		сочувствие:n жалость:f смирение:n терпение:n умеренность:f стойкость:f честность:f
		искренность:f изумление:n благоговение:n спокойствие:n тишина:f доверие:n сомнение:n
		подозрение:n беспокойство:n тревога:f ужас:m паника:f ярость:f злость:f досада:f скука:f
		равнодушие:n рвение:n пыл:m чувство:n иллюзия:f смелость:f робость:f стыд:m вина:f
		гордость:f зависть:f ревность:f жадность:f настроение:n прихоть:f
	`,body:`
		голова:f лоб:m бровь:f ресница:f веко:n нос:m щека:f подбородок:m челюсть:f губа:f
		 зуб:m десна:f ухо:n мочка:f шея:f затылок:m плечо:n локоть:m запястье:n
		ладонь:f палец:m ноготь:m кулак:m грудь:f ребро:n живот:m пупок:m спина:f
		талия:f бедро:n колено:n голень:f икра:f лодыжка:f пятка:f кость:f череп:m мышца:f
		сухожилие:n связка:f сустав:m хрящ:m сердце:n лёгкое:n печень:f желудок:m почка:f
		селезёнка:f кишка:f пузырь:m мозг:m нерв:m вена:f артерия:f капилляр:m кровь:f плоть:f
		кожа:f пора:f волос:m борода:f слеза:f пот:m слюна:f дыхание:n пульс:m ключица:f
		надколенник:m скула:f зрачок:m морщина:f веснушка:f ямочка:f шрам:m синяк:m мозоль:f
	`,clothing:`
		шляпа:f ботинок:m перчатка:f шарф:m очки:p пальто:n куртка:f рубашка:f блузка:f туника:f
		брюки:p джинсы:p шорты:p юбка:f платье:n жилет:m кардиган:m свитер:m худи:n носок:m
		чулок:m бельё:n пижама:f фартук:m платок:m галстук:m ремень:m кушак:m кроссовок:m
		мокасин:m сапог:m тапочка:f форма:f костюм:m халат:m плащ:m пончо:n дождевик:m анорак:m
		парка:f купальник:m гидрокостюм:m комбинезон:m рукав:m воротник:m манжета:f подол:m
		лацкан:m подкладка:f ткань:f лён:m шёлк:m хлопок:m шерсть:f бархат:m вельвет:m фланель:f
		 берет:m шапка:f кепка:f каска:f тюрбан:m вуаль:f шаль:f
	`,tool:`
		топор:m лопата:f пила:f гаечный_ключ:m плоскогубцы:p долото:n наковальня:f мехи:p шило:n
		зажим:m тиски:p уровень:m транспортир:m линейка:f ножницы:p молоток:m киянка:f дрель:f
		наждак:m рубанок:m кирка:f серп:m коса:f мотыга:f плуг:m грабли:p отвёртка:f паяльник:m
		шлифмашина:f резак:m рулетка:f циркуль:m топорик:m лом:m рычаг:m клин:m блок:m кувалда:f
		мастерок:m точило:n напильник:m тёрка:f сито:n заступ:m борона:f цеп:m веретено:n
		 катушка:f рукоять:f лезвие:n заклёпочник:m лобзик:m рашпиль:m
		бензопила:f ножовка:f стамеска:f чертилка:f угольник:m фаска:f верстак:m
	`,drink:`
		кофе:m чай:m сок:m молоко:n вода:f лимонад:m сидр:m какао:n пунш:m настой:m квас:m морс:m
		компот:m кисель:m сбитень:m кефир:m ряженка:f простокваша:f латте:n эспрессо:n капучино:n
		пиво:n эль:m портер:m вино:n красное:n белое:n розовое:n игристое:n шампанское:n херес:m
		портвейн:m вермут:m ликёр:m наливка:f настойка:f самогон:m ром:m джин:m водка:f виски:n
		коньяк:m бренди:n текила:f саке:n медовуха:f коктейль:m нектар:m сироп:m газировка:f
		тоник:m минералка:f сыворотка:f смузи:n
	`}),uc={joiner:" ",capitalize:!1,adjectives:a(`
		синий красный жёлтый белый чёрный зелёный золотой серебряный тёмный светлый яркий большой
		маленький длинный короткий широкий узкий высокий низкий быстрый медленный сильный слабый
		твёрдый мягкий горячий холодный тёплый сухой влажный чистый новый старый молодой красивый
		сладкий горький солёный острый кислый нежный шершавый лёгкий тяжёлый круглый глубокий
		далёкий близкий богатый бедный редкий тихий шумный храбрый мудрый весёлый грустный
		свободный вечный прозрачный таинственный одинокий сияющий дикий безмятежный безмолвный
		древний современный бесконечный полый шёлковый туманный облачный дождливый солнечный
		снежный ветреный ржавый любопытный шаловливый благородный скромный добрый свирепый ловкий
		колючий беспокойный крепкий спутанный живой блёклый серый бледный жгучий морозный
		пламенный сумрачный лучистый величавый простой изящный забавный хитрый дерзкий ленивый
		бодрый гладкий плотный скудный горний
	`),actions:a(`
		спящий бегущий летящий плывущий поющий танцующий смеющийся плачущий идущий стоящий сидящий
		лежащий едящий пьющий читающий пишущий рисующий учащийся ждущий ищущий зовущий слышащий
		видящий мечтающий бодрствующий прячущийся гонящийся ловящий бросающий тянущий толкающий
		открывающий закрывающий строящий чинящий сажающий собирающий варящий пекущий ткущий шьющий
		гребущий ведущий лезущий катящийся текущий горящий тающий цветущий вянущий падающий
		бродящий шепчущий светящийся мерцающий парящий качающийся кружащийся крадущийся прыгающий
		скачущий дышащий зевающий тянущийся думающий дивящийся медлящий ликующий обнимающий
		гладящий утешающий будящий садящийся глядящий слушающий считающий мерящий кующий режущий
		рубящий сгибающий звенящий жужжащий
	`),nouns:da.pools,nounGender:da.gender,genderRules:[["а","f"],["я","f"],["о","n"],["е","n"],["ё","n"],["","m"]],agreement:{f:[["щийся","щаяся"],["жий","жая"],["ший","шая"],["чий","чая"],["щий","щая"],["гий","гая"],["кий","кая"],["хий","хая"],["ый","ая"],["ой","ая"],["ий","яя"]],n:[["щийся","щееся"],["жий","жее"],["ший","шее"],["чий","чее"],["щий","щее"],["гий","гое"],["кий","кое"],["хий","хое"],["ый","ое"],["ой","ое"],["ий","ее"]],p:[["щийся","щиеся"],["гой","гие"],["кой","кие"],["хой","хие"],["жой","жие"],["шой","шие"],["чой","чие"],["щой","щие"],["ый","ые"],["ой","ые"],["ий","ие"]]},frames:[{slots:["noun"],weight:12},{slots:["adjective","noun"],weight:50},{slots:["action","noun"],weight:38}],syn:{kind:"syllable",onset:a("б в г д ж з к л м н п р с т ф х ц ч ш щ бр вл гр др кр пл пр ст тр"),vowel:a("а е и о у ы я ё ю э"),coda:["","",...a("н м р л с т в к й нь ль ст")],minSyllables:2,maxSyllables:3}},dc={joiner:" ",capitalize:!1,adjectives:a(`
		xanh đỏ vàng trắng đen tím nâu hồng xám lớn nhỏ cao thấp dài ngắn rộng hẹp dày mỏng nặng
		nhẹ nhanh chậm mạnh yếu cứng mềm nóng lạnh ấm mát khô ướt sạch mới cũ trẻ già đẹp hiền dữ
		vui buồn hiếm quý sáng tối ngọt đắng cay mặn chua thơm êm sắc tròn vuông xa gần sâu nông
		giàu nghèo lạ quen tươi im_lặng ồn_ào dịu_dàng can_đảm thông_minh tự_do vĩnh_cửu
		trong_suốt kỳ_lạ huyền_bí cô_đơn rực_rỡ lấp_lánh mờ_ảo dữ_dội nhẹ_nhàng vững_chãi
		tinh_khôi hoang_dã bình_yên lặng_lẽ rộn_ràng nhanh_nhẹn chậm_rãi mạnh_mẽ yếu_ớt xinh_xắn
		duyên_dáng thanh_tao cổ_kính hiện_đại bất_tận rỗng_không gồ_ghề mượt_mà óng_ánh trầm_mặc
		thảnh_thơi tinh_nghịch nghiêm_trang ung_dung hồn_nhiên táo_bạo thận_trọng khôn_ngoan
		lanh_lợi cần_mẫn lười_biếng nhút_nhát vô_tư thẳng_thắn kín_đáo lộng_lẫy giản_dị
	`),actions:a(`
		ngủ chạy bay bơi hát nhảy cười khóc đi đứng ngồi nằm ăn uống đọc viết vẽ học làm nghỉ chờ
		tìm gọi nghe nhìn nhớ quên mơ thức trốn đuổi bắt ném kéo đẩy mở đóng xây sửa trồng hái nấu
		nướng dệt may đan chèo lái leo lăn trôi chảy cháy tan nở tàn rơi đợi dạo lượn săn gieo gặt
		gánh vác đội cõng bồng ôm vuốt xoa gõ đập chặt cắt khâu thêu nhuộm phơi giặt quét lau rửa
		xay giã sàng lọc đo đếm ghi kể ngâm ngân gảy thổi đánh vỗ reo hò thầm_thì lang_thang
		bay_lượn tỏa_sáng nhấp_nháy đung_đưa dập_dờn rung_rinh thấp_thoáng vụt_qua ngẩng_lên
		cúi_xuống quay_lại bước_tới dừng_lại
	`),nouns:{animal:a(`
			mèo chó hổ sư_tử báo cáo sói gấu gấu_trúc rái_cá thỏ sóc voi hươu nai ngựa lừa bò trâu dê
			cừu lợn khỉ vượn cá_sấu rắn thằn_lằn rùa ếch cóc chim én sẻ quạ chim_ưng đại_bàng công
			vẹt cú bồ_câu hạc thiên_nga vịt ngỗng gà cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sò
			ốc bướm ong kiến nhện chuồn_chuồn ve muỗi ruồi giun sâu tằm dơi chồn nhím lạc_đà hà_mã
			tê_giác hươu_cao_cổ chuột sứa hải_cẩu đà_điểu bọ_ngựa cá_chép lươn
		`),object:a(`
			chai bút tẩy ô đèn gương chìa_khóa ổ_khóa túi cúc kim chỉ cọ giấy vở thư tem con_dấu
			bản_đồ ống_nhòm kính_hiển_vi máy_ảnh phim bóng_bay diều con_quay bi xúc_xắc thẻ mảnh_ghép
			buồm neo lều đèn_pin diêm nến chậu ấm chén thìa đĩa nồi bánh_răng dây_cót ruy_băng gối
			chăn giỏ chổi còi dây xô quạt khiên lưới cần_câu lọ lược chuông_gió hạc_giấy đồng_hồ_cát
			ống_khói phễu bình gáo mẹt nia rổ khay hộp thùng vại chum
		`),nature:a(`
			biển sông hồ thác thung_lũng núi đồi đồng_cỏ rừng hang sa_mạc cát đá sỏi núi_lửa động_đất
			sông_băng san_hô đầm_lầy suối vịnh cồn_cát đỉnh_núi hoang_mạc rừng_thưa thảo_nguyên đầm
			cửa_sông châu_thổ phá đảo bán_đảo eo_đất quần_đảo cao_nguyên vách_đá khe_núi bãi_cát
			bãi_đá rạn_san_hô đáy_biển vực_sâu mạch_nước hố_sụt măng_đá nhũ_đá hang_động gờ_đá bóng
			âm_vang hương lửa than_hồng dòng_chảy bờ_biển bãi_bồi
		`),plant:a(`
			cây lá hoa rễ hạt quả rêu dương_xỉ tre thông phong anh_đào hoa_hồng hoa_sen hoa_cúc
			hoa_mai hoa_lan bồ_công_anh hướng_dương hoa_súng cỏ cành mầm chồi nụ cánh_hoa phấn_hoa
			vòng_gỗ quả_thông quả_sồi bạch_quả liễu bạch_dương tùng bách sồi dẻ óc_chó thảm_cỏ
			tảo rong_biển bồn_cây hàng_rào_cây bó_hoa cỏ_dại xương_rồng lô_hội
			húng_quế hương_thảo bạc_hà thì_là mùi_tây nghệ_tây rau_mùi hẹ me sim ổi
		`),gem:a(`
			vàng bạc đồng sắt thép đồng_thau thiếc kẽm bạch_kim thủy_tinh pha_lê thạch_anh mã_não
			hổ_phách ngọc_trai ngọc_bích bạch_ngọc ngọc đá_hoa đá_granit đá_vôi đá_bazan đá_lửa
			thiên_thạch quặng đá_thô đá_quý thỏi_vàng thỏi_bạc vân_mẫu huỳnh_thạch lưu_huỳnh ngà
			sa_khoáng lá_vàng lá_bạc than_chì thủy_ngân thạch_cao đá_phiến mạch_quặng
			hồng_ngọc ngọc_đen lục_bảo đá_mắt_mèo đá_mặt_trăng ngọc_lam kim_cương san_hô_đỏ
		`),concept:a(`
			tự_do hòa_bình công_lý chân_lý trí_tuệ ký_ức tưởng_tượng câu_chuyện thơ phác_họa ngữ_pháp
			lô_gic vật_lý hóa_học sinh_học triết_học toán_học hình_học đại_số lịch_sử thần_thoại
			ngụ_ngôn tục_ngữ câu_đố bí_mật lời_hứa chuyến_đi phiêu_lưu hải_trình khám_phá thí_nghiệm
			câu_hỏi câu_trả_lời tranh_luận hội_nghị lễ_hội chiều_kích cân_bằng hài_hòa nghi_lễ
			phong_tục văn_hóa ngôn_ngữ chữ_cái mật_mã lưu_trữ lịch chân_trời trực_giác lý_trí
			phán_đoán học_thuyết định_lý tiên_đề giả_thuyết nghịch_lý khuôn_mẫu tiền_đề suy_luận
			diễn_dịch quy_nạp loại_suy ẩn_dụ biểu_tượng chủ_đề tự_sự biên_niên chứng_ngôn tuyên_ngôn
			đồng_thuận thỏa_hiệp giao_ước hiệp_ước liên_minh huyết_thống di_sản truyền_thống
			ngưỡng_cửa mở_đầu kết_cục
		`),myth:a(`
			rồng phượng_hoàng kỳ_lân tiên yêu_tinh ma hồn oan_hồn thần thiên_thần ác_quỷ người_cá
			quái_vật ác_thú thánh_thú thần_thú ma_vương long_vương phép_thuật
			ma_lực thần_chú lời_nguyền tiên_tri sấm_truyền kết_giới bùa_hộ_mệnh phong_ấn ảo_giác
		 hắc_long bạch_long thanh_long bạch_hổ chu_tước huyền_vũ cửu_vĩ_hồ
			chim_lửa người_sói ma_cà_rồng xác_sống hình_nhân người_lùn quỷ_lùn tinh_linh thủy_thần
			sơn_thần hải_thần lôi_thần phong_thần mỹ_nhân_ngư nhân_mã nhân_sư thiên_mã
			hải_quái thần_điểu linh_hồn ma_thuật đạo_sĩ pháp_sư thầy_bói nhà_tiên_tri hiền_giả
		`),job:a(`
			hiệp_sĩ thợ_săn kẻ_trộm hải_tặc thủy_thủ đầu_bếp thợ_rèn thám_tử nhà_thơ họa_sĩ vũ_công
			chú_hề lữ_khách tu_sĩ nhà_giả_kim cung_thủ kiếm_sĩ võ_sĩ tướng_quân binh_sĩ lính_gác vua
			nữ_hoàng hoàng_tử công_chúa hoàng_đế quản_gia thị_nữ người_hầu thương_nhân nông_dân
			ngư_dân mục_đồng tiều_phu lái_đò phu_xe hoa_tiêu phi_công kỹ_sư lao_công lính_cứu_hỏa
			cảnh_sát bác_sĩ y_tá dược_sĩ thú_y giáo_viên học_sinh thủ_thư nhà_báo nhà_văn dịch_giả
			ca_sĩ diễn_viên đạo_diễn nhạc_công thợ_mỏ thợ_mộc thợ_gốm thợ_may thầy_tế học_giả tiến_sĩ
			trọng_tài nghệ_sĩ_xiếc
		`),music:a(`
			đàn_piano ghi_ta trống chuông đàn_tranh bài_hát điệu_múa nhịp_điệu giai_điệu hòa_âm sáo
			kèn kèn_trumpet đàn_hạc đàn_cello đàn_viola vĩ_cầm trống_lớn chũm_chọe trống_lắc mộc_cầm
			phong_cầm khẩu_cầm đàn_bầu đàn_nhị đàn_nguyệt sáo_trúc bản_nhạc nốt_nhạc dấu_lặng âm_giai
			hợp_xướng đơn_ca hòa_tấu độc_tấu buổi_diễn sân_khấu giao_hưởng điệu_valse nhạc_jazz
			dân_ca khúc_hát_ru hành_khúc khúc_dạo_đầu khúc_kết âm_sắc nhịp_phách dàn_nhạc
			chương_nhạc khúc_mở_màn dạ_khúc biến_tấu thánh_ca tụng_ca cầu_hồn_khúc song_ca tam_ca
			tứ_tấu ngũ_tấu nhạc_trưởng quãng_tám bán_âm khóa_nhạc khuông_nhạc tổng_phổ máy_nhịp
		`),place:a(`
			chợ quảng_trường thành_phố làng ngõ cầu vườn thư_viện bảo_tàng nhà_hát trường_học
			công_viên cảng bến_tàu nhà_ga sân_bay hải_đăng lâu_đài tường_thành cung_điện chùa đền
			tháp gác_mái tầng_hầm mái_nhà sân_trong hiên nhà_kính kho lều_gỗ đài_quan_sát sân_chơi
			sân_vận_động nhà_thi_đấu bể_bơi thủy_cung vườn_thú nhà_tắm bưu_điện ngân_hàng bệnh_viện
			hiệu_thuốc hiệu_sách tiệm_bánh quán_cà_phê nhà_hàng bếp phòng_ngủ phòng_khách hành_lang
			cầu_thang đường_hầm cầu_vượt ngã_tư đường_dạo pháo_đài nông_trại trang_trại vườn_cây
			nhà_thờ tu_viện thành_lũy hào bến_phà đê bãi_cắm_trại biệt_thự dinh_thự xóm
		`),food:a(`
			cơm mì phở bún bánh_mì bánh_bao bánh_xèo bánh_chưng nem chả giò_lụa muối đường tiêu tỏi
			hành khoai cà_rốt dưa_chuột bí_đỏ cải_thảo rau_xà_lách rau_bina nấm đậu_phụ trứng phô_mai
			bơ sữa_chua táo dâu nho dưa_hấu đào hồng quýt chanh chuối xoài sô_cô_la kẹo thạch
			bánh_quy bánh_ngọt bánh_pudding bánh_rán bánh_kếp bánh_kem mứt tương_ớt nước_mắm mắm_tôm
			dưa_muối kim_chi cháo xôi chè bánh_trôi thịt_nướng gỏi_cuốn bánh_cuốn bánh_đúc bánh_gai
			bánh_tét canh súp lẩu
		`),sport:a(`
			bóng_đá bóng_chày bóng_rổ bóng_chuyền bóng_bàn quần_vợt cầu_lông gôn bowling bi_a bơi_lội
			điền_kinh thể_dục karate judo kiếm_đạo đấu_vật quyền_anh đấu_kiếm bắn_cung bắn_súng
			cưỡi_ngựa chèo_thuyền lướt_sóng trượt_tuyết khúc_côn_cầu bóng_bầu_dục leo_núi nhảy_dây
			vợt khung_thành huy_chương cúp vô_địch chung_kết vòng_loại cổ_vũ lật_ngược hiệp_phụ
			luyện_tập trượt_băng nhảy_cầu phi_tiêu chạy_bộ vượt_rào ném_lao ném_đĩa tiếp_sức
			bảng_điểm mũ_bảo_hiểm phạm_lỗi nhảy_xa nhảy_cao xà_kép lễ_khai_mạc lễ_bế_mạc nhảy_dù
			bóng_nước đấu_tập cú_móc hạ_đo_ván vật_ngã lộn_nhào khởi_động hội_ý
		`),vehicle:a(`
			xe_đạp tàu_hỏa thuyền xe_trượt ô_tô xe_buýt taxi xe_tải xe_máy xe_ga máy_bay trực_thăng
			phi_thuyền tên_lửa tàu_ngầm du_thuyền tàu_hàng tàu_khách thuyền_buồm bè tàu_chiến xe_tăng
			xe_ngựa xe_kéo xe_đẩy xe_nâng máy_kéo máy_xúc xe_cứu_hỏa xe_cảnh_sát cáp_treo tàu_điện
			toa_xe đầu_máy khí_cầu dù kiệu xe_ba_bánh xe_van xe_bán_tải xe_limousine xe_ủi_tuyết
			tàu_một_ray tàu_hai_thân tàu_phá_băng tàu_dầu sà_lan tàu_thăm_dò tàu_đổ_bộ tàu_con_thoi
			xe_địa_hình xe_một_bánh xe_tang xe_nôi xe_con xe_chở_hàng xe_tưới_nước tàu_tuần_tra
			tàu_lặn xuồng toa_giường
		`),product:a(`
			máy_tính bàn_phím màn_hình máy_in loa tai_nghe micrô điện_thoại sạc pin điều_khiển
			tủ_lạnh máy_giặt máy_hút_bụi quạt_máy điều_hòa lò_sưởi máy_lọc_nước nồi_cơm_điện
			lò_vi_sóng lò_nướng máy_xay máy_tạo_ẩm máy_hút_ẩm dao_cạo bàn_chải xà_phòng dầu_gội
			nước_hoa máy_chiếu máy_quét máy_ảnh_web nồi_hấp máy_rửa_bát máy_sấy máy_sấy_tóc kem_dưỡng
			rèm_cửa chuông_cửa nhiệt_kế bình_cứu_hỏa bóng_đèn dây_nối ổ_cắm nước_giặt nước_xả móc_áo
			tủ_áo giá_sách ghế_tựa ghế_đẩu khung_giường chăn_bông ga_giường vỏ_gối khăn_tắm
			áo_tắm_dài vòi_sen vòi_nước cây_lau_nhà cốc_đong thìa_đong cây_cán_bột máy_trộn
		`),color:a(`
			đỏ_son đỏ_thẫm hồng_đào cam_đất vàng_nghệ vàng_chanh xanh_lá xanh_rêu xanh_ngọc xanh_lam
			xanh_biển xanh_da_trời chàm tím_than tím_hoa_cà nâu_đất nâu_cà_phê be xám_tro xám_khói
			trắng_ngà trắng_sữa đen_tuyền bạc_kim ánh_vàng ánh_bạc đỏ_gạch đỏ_ruby hồng_phấn hồng_sen
			cam_cháy vàng_kim vàng_mơ vàng_đồng màu_lục_bảo lục_nhạt lam_sẫm lam_nhạt tím_nhạt
			tím_sẫm nâu_sẫm nâu_nhạt xám_bạc trắng_tinh đen_nhánh đỏ_tươi cam_tươi vàng_tươi
			xanh_tươi màu_ngọc_lam màu_hổ_phách màu_đồng màu_cát màu_tro màu_khói màu_đất màu_trời
			màu_biển màu_mực màu_máu
		`),finance:a(`
			sổ_cái hóa_đơn biên_lai trái_phiếu cổ_phiếu cổ_tức lãi_suất khoản_vay thế_chấp tiền_gửi
			tiết_kiệm tài_khoản số_dư ngân_sách kiểm_toán tài_sản nợ_phải_trả doanh_thu lợi_nhuận
			thặng_dư thâm_hụt khoản_nợ tín_dụng tiền_tệ tỷ_giá lợi_suất thuế_quan hoàn_thuế
			phí_bảo_hiểm lương_hưu bảng_lương tiền_công tiền_lương tiền_thưởng nhượng_quyền sáp_nhập
			thâu_tóm cứu_trợ két_sắt kho_bạc chuyển_tiền quyết_toán thấu_chi sao_kê sổ_tiết_kiệm
			chủ_nợ con_nợ người_đi_vay định_giá thẩm_định lạm_phát suy_thoái thanh_khoản phá_sản
			của_trời_cho trợ_cấp phụ_cấp chi_phí vòng_quay chiết_khấu trả_góp nợ_quá_hạn
		`),tech:a(`
			máy_chủ bộ_nhớ_đệm bộ_đệm điểm_ảnh mã_hóa gói_tin giao_thức hàng_đợi ngăn_xếp con_trỏ
			phần_sụn sổ_đăng_ký băng_thông độ_trễ cổng_kết_nối tường_lửa mạng_con tên_máy tải_trọng
			mã_kiểm_tra lược_đồ bản_sao_lưu cụm_máy phân_mảnh bản_sao ảnh_chụp vùng_chứa hộp_cát
			đường_ống kho_mã trình_gỡ_lỗi lệnh_tắt mảng ma_trận số_nguyên cú_pháp mã_máy lệnh ngắt
			thanh_ghi tốc_độ_bit thông_lượng bắt_tay trung_gian điểm_cuối giải_mã băm kết_xuất
			bộ_tô_bóng kết_cấu đa_giác khung_dây khung_nhìn bộ_đệm_khung tám_bit đường_lên
			đường_xuống định_tuyến chuyển_mạch bắc_cầu gói_dữ_liệu hệ_thống_tệp phân_vùng thư_mục
			liên_kết_mềm khôi_phục di_trú
		`),weather:a(`
			mây gió mưa tuyết sương_giá sương_mù sương cầu_vồng hoàng_hôn sét sấm mưa_rào gió_mùa bão
			lốc_xoáy bão_tuyết mưa_phùn mưa_lớn gió_giật gió_mạnh gió_nhẹ mưa_đá mưa_tuyết tia_nắng
			ảo_ảnh quầng_sáng giọt_mưa hạt_mưa màn_mưa mưa_xuân mưa_thu mưa_đêm tuyết_rơi băng_giá
			sương_muối nắng_nóng đợt_nóng đợt_lạnh gió_bấc gió_nồm gió_lào mây_đen vầng_mây áp_thấp
			áp_cao thời_tiết khí_hậu nhiệt_độ độ_ẩm khí_áp trời_quang trời_râm trời_mưa nắng_gắt
			bóng_râm nắng_chiều gió_biển gió_núi cơn_giông chớp nắng_sớm
		`),space:a(`
			sao mặt_trăng mặt_trời thiên_hà sao_chổi sao_băng cực_quang bụi_sao dải_ngân_hà nhật_thực
			nguyệt_thực thiên_đỉnh vũ_trụ hành_tinh vệ_tinh tinh_vân cụm_sao chòm_sao quỹ_đạo
			trọng_lực tự_quay nhật_hoa vết_đen gió_mặt_trời bề_mặt_trăng năm_ánh_sáng thiên_thể
			liên_sao định_tinh thiên_cầu hoàng_đạo hệ_ngân_hà hố_đen mưa_sao_băng bụi_vũ_trụ
			hệ_mặt_trời chân_không trăng_khuyết trăng_tròn trăng_non ánh_trăng ánh_sao sao_bắc_cực
			sao_hôm sao_mai sao_hỏa sao_kim sao_mộc sao_thổ sao_thủy
		`),time:a(`
			bình_minh chạng_vạng hạ_chí đông_chí xuân_phân thu_phân mùa khoảnh_khắc vĩnh_hằng
			tương_lai sát_na năm_tháng ngày_lễ buổi_sáng buổi_trưa buổi_chiều buổi_tối ban_đêm
			nửa_đêm chính_ngọ rạng_sáng sáng_sớm đêm_khuya hôm_qua hôm_nay ngày_mai ngày_kia hôm_kia
			quá_khứ hiện_tại thế_kỷ thập_kỷ kỷ_nguyên thời_đại tuần_lễ cuối_tuần năm_nay năm_ngoái
			năm_sau mùa_xuân mùa_hè mùa_thu mùa_đông đầu_xuân giây_lát chốc_lát giữa_hè giao_thừa
			rằm cuối_thu sinh_nhật thời_hạn ngày_xưa tiết_khí lập_xuân lập_hạ lập_thu lập_đông
			thời_khắc thời_gian thiên_thu thời_thơ_ấu tuổi_trẻ tuổi_già xế_chiều quãng_đời thuở_xưa
			bây_giờ sau_này
		`),emotion:a(`
			can_đảm tò_mò cô_độc hoài_niệm khát_khao đồng_cảm trắc_ẩn lòng_biết_ơn khiêm_nhường
			kiên_nhẫn chuyên_cần thận_trọng điều_độ kiên_cường chính_trực chân_thành kinh_ngạc
			kính_sợ thanh_thản tình_bạn đoàn_kết ganh_đua niềm_vui nỗi_buồn cơn_giận nỗi_sợ
			ngạc_nhiên hân_hoan hạnh_phúc sung_sướng ngây_ngất an_ủi nhẹ_nhõm hy_vọng tuyệt_vọng
			đau_thương u_sầu ảm_đạm nỗi_cô_đơn hối_tiếc ăn_năn tội_lỗi xấu_hổ tự_hào kiêu_ngạo đố_kỵ
			ghen_tuông tham_lam ham_muốn đam_mê tình_cảm trìu_mến dịu_dàng ấm_áp tử_tế cảm_thông
			thương_hại tin_tưởng nghi_ngờ hoài_nghi lo_lắng bồn_chồn khiếp_sợ hoảng_loạn thịnh_nộ
			phẫn_nộ bực_bội khó_chịu chán_nản thờ_ơ nhiệt_huyết hăng_hái phấn_khích háo_hức quyết_tâm
			ý_chí tự_tin khiêm_tốn điềm_tĩnh bình_tĩnh can_trường rụt_rè hớn_hở tâm_trạng
		`),body:a(`
			đầu trán lông_mày lông_mi mí_mắt mũi lỗ_mũi má cằm hàm môi lưỡi răng lợi tai dái_tai cổ
			gáy vai khuỷu_tay cổ_tay lòng_bàn_tay đốt_ngón ngón_tay ngón_cái móng_tay nắm_tay ngực
			xương_sườn bụng rốn cột_sống eo hông đùi đầu_gối ống_chân bắp_chân mắt_cá gót ngón_chân
			móng_chân xương hộp_sọ cơ_bắp gân dây_chằng khớp sụn tim phổi gan dạ_dày thận lá_lách
			ruột bàng_quang não thần_kinh tĩnh_mạch động_mạch mao_mạch máu thịt da lỗ_chân_lông tóc
			râu nước_mắt mồ_hôi nước_bọt hơi_thở mạch nhịp_tim lồng_ngực xương_sống xương_đòn
			xương_gò_má màng_nhĩ nhãn_cầu nếp_nhăn tàn_nhang sẹo vết_bầm phồng_rộp chai_tay
		`),clothing:a(`
			mũ giày găng khăn_quàng kính_mắt dép_lê dép_xăng_đan quần_áo áo_khoác áo_măng_tô áo_vest
			áo_sơ_mi áo_cánh áo_dài quần quần_bò quần_soóc váy váy_đầm áo_gi_lê áo_len áo_nỉ
			áo_hoodie tất tất_dài đồ_lót đồ_ngủ tạp_dề cà_vạt nơ thắt_lưng dây_lưng giày_da bốt ủng
			đồng_phục lễ_phục com_lê áo_tứ_thân nón_lá áo_bà_ba khăn_rằn áo_tơi áo_mưa đồ_bơi đồ_lặn
			đồ_bảo_hộ áo_ấm áo_leo_núi đồ_thể_thao tay_áo cổ_áo vạt_áo lớp_lót vải vải_lanh lụa bông
			nhung dạ da_thuộc lông_thú mũ_lưỡi_trai mũ_bảo_hộ khăn_voan khăn_choàng bao_tay bịt_tai
		`),tool:a(`
			rìu xẻng cưa thang cờ_lê kìm đục đe ống_bễ dùi kẹp ê_tô thước_thủy thước_cặp thước_đo_góc
			thước_kẻ kéo búa búa_gỗ máy_khoan giấy_nhám bào cuốc liềm hái bừa cào mỏ_lết tua_vít
			mỏ_hàn máy_mài máy_cắt máy_hàn thước_dây dây_mực com_pa rìu_nhỏ xà_beng đòn_bẩy nêm
			ròng_rọc tay_quay búa_tạ bay đá_mài giũa bàn_nạo cái_sàng mai cày cối_xay thoi
			ống_chỉ cán lưỡi_dao bộ_dụng_cụ hộp_đồ_nghề đinh_vít máy_bắn_đinh cưa_lọng cưa_vòng
			máy_tiện máy_chà_nhám cưa_xích cưa_tay mũi_vạch thước_vuông ke_góc bàn_thợ
		`),drink:a(`
			cà_phê trà_xanh trà_đen nước_ép sữa nước nước_suối nước_có_ga trà_lúa_mạch trà_hoa_cúc
			trà_gừng trà_sen trà_atiso sữa_đậu_nành cà_phê_sữa cà_phê_đen bạc_xỉu nước_dừa nước_mía
			nước_chanh sinh_tố sữa_lắc nước_ngọt trà_sữa trà_đá cà_phê_đá bia bia_hơi bia_đen
			rượu_vang rượu_trắng rượu_nếp rượu_cần rượu_gạo rượu_thuốc rượu_mạnh sâm_banh cốc_tai
		 nước_đường nước_sâm nước_rau_má nước_vối
			nước_sấu trà_bí_đao nước_yến nước_khoáng sữa_tươi sữa_đặc
		`)},parts:a(`
		đuôi chân cánh bóng mắt tay tiếng hơi_thở hương vảy bờm sừng mỏ vây tổ hang trứng hạt mảnh
		đàn làng xứ chuyến_đi câu_chuyện bài_hát điệu_múa ánh_sáng tiếng_vọng làn_gió gợn_sóng
		lối_mòn vương_miện áo_choàng bùa tia_lửa nụ_hoa vịnh_nhỏ đỉnh con_đường đèn_lồng móng nanh
		lông_vũ gạc quầng dấu_chân ánh_mắt nụ_cười giọt_nước hơi_ấm
	`),frames:[{slots:["noun"],weight:10},{slots:["noun","adjective"],weight:34},{slots:["noun","action"],weight:22},{slots:["part","noun"],weight:14},{slots:["part","noun","adjective"],weight:14},{slots:["noun","adjective","action"],weight:6}],syn:{kind:"syllable",onset:a("b c ch d đ g gh h k kh l m n ng nh ph qu r s t th tr v x"),vowel:a("a à á ả ã ạ e ê i o ô ơ u ư ai ao au ay êu ia iê oa oi ôi ơi ua uô ưa ươ ui"),coda:["","",...a("n m ng nh t c ch p")],minSyllables:1,maxSyllables:1}},fc={joiner:"",capitalize:!1,adjectives:a(`
		快乐 悲伤 聪明 神秘 温柔 勇敢 安静 热闹 优雅 自由 永恒 透明 甜美 苦涩 清凉 温暖
		寒冷 古老 崭新 明亮 黑暗 遥远 巨大 迷你 圆润 锋利 柔软 坚硬 轻盈 沉稳 闪亮 朦胧
		孤独 好奇 慵懒 淘气 高贵 朴素 疾速 缓慢 深邃 辽阔 蓝色 红色 金色 银色 白色 黑色
		绿色 紫色 星光 月光 晨光 夜色 云端 雨中 雪白 风中 梦中 彩虹 灿烂 璀璨 空灵 逍遥
		飘逸 灵动 俏皮 狂野 静谧 浩瀚 皎洁 绚丽 悠然 暮色 橙色 粉色 灰色 湛蓝 碧绿 绯红
		墨黑 淡紫 朱红 火红 金黄 漆黑 米白 藏青 靛蓝 青碧 开朗 活泼 沉默 冷静 温和 豪迈
		潇洒 洒脱 端庄 顽皮 机灵 敏捷 稳重 谦逊 恬静 从容 淡然 忧郁 欢快 雀跃 呆萌 娇俏
		傲然 超然 疏狂 晨曦 朝露 初雪 微雨 落霞 流云 清风 明月 春日 夏日 秋日 冬日 深夜
		破晓 薄暮 拂晓 子夜 秋霜 春风 无声 无名 酥脆 香甜 清爽 醇厚 绵软 蓬松
		光滑 湿润 冰凉 滚烫
	`),actions:a(`
		飞舞 奔跑 沉睡 微笑 歌唱 漂泊 隐匿 燃烧 冰封 绽放 凋零 摇曳 闪烁 徘徊 追逐 守望
		遗失 流浪 学习 工作 烹饪 绘画 书写 阅读 计数 建造 修补 种植 挖掘 垂钓 狩猎 等待
		守护 寻找 呼唤 呐喊 低语 凝视 窥探 聆听 铭记 想象 沉思 犹豫 决意 欢呼 问候 拥抱
		抚摸 安慰 唤醒 打盹 伸展 旅行 逃离 追赶 跃入 腾空 降落 盘旋 踱步 爬行 翻滚 嬉戏
		玩耍 进食 饮水 咀嚼 烧烤 敲击 搬运 推动 拉扯 投掷 抓取 掉落 藏匿 浮现 融化 流淌
		溢出 冻结 燃起 散落 倾泻 渗入 蔓延 成熟 生长 枯萎 低垂 点头 歇息 倚靠 悬挂 躺卧
		静坐 停驻 叹息 疾行 潜行 悬浮 摇摆 起伏 击鼓 弹奏 吹哨 吟唱 编织 雕刻 锻造 航行
		划桨 行军 竞逐 角力 抛接 消失 归来
	`),nouns:{animal:a(`
			狮子 老虎 豹子 猎豹 狐狸 灰狼 黑熊 熊猫 水獭 兔子 松鼠 猫咪 小狗 鲸鱼 海豚 鲨鱼 乌龟 海豹 企鹅 猫头鹰 麻雀 喜鹊 燕子 老鹰 游隼 仙鹤 天鹅 鸭子 啄木鸟
			鹦鹉 孔雀 鸵鸟 骏马 小鹿 大象 长颈鹿 河马 猴子 大猩猩 青蛙 蜥蜴 变色龙 蟒蛇 蝴蝶 飞蛾 蜜蜂 蜻蜓 瓢虫 蜗牛 蚂蚁 蜘蛛 章鱼 乌贼 海星 螃蟹 龙虾 鲤鱼
			三文鱼 刺猬 浣熊 猞猁 骆驼 树懒 蝙蝠 白鹭 鹈鹕 斑马 羚羊 山羊 小鸡 大雁 乌鸦 云雀 夜莺 翠鸟 火烈鸟 鳄鱼 萤火虫 螳螂 袋鼠 美洲豹 美洲狮 短尾猫 鬣狗 郊狼
			野狗 狐獴 雪貂 狼獾 海狸 豪猪 犰狳 食蚁兽 狐猴 狒狒 猕猴 霍加狓 野牛 水牛 牦牛 北山羊 瞪羚 黑斑羚 角马 羊驼 小马 马驹 仔猪 羔羊 牛犊 雏鸭 雏鹅 蟋蟀
			蜉蝣 金龟子 锹甲 萤火 蚯蚓 蜈蚣 马陆 蝎子 壁虱 跳蚤 苍蝇 蚊子 蚕蛹 毛虫 蝌蚪 蟾蜍 雨蛙 蝾螈 菜花蛇 蝮蛇 毒蛇 眼镜蛇 响尾蛇 鬣蜥 鲫鱼 鲶鱼 黑鱼 鳜鱼
			青鳉 泥鳅 鳗鱼 海鳗 带鱼 鲅鱼 秋刀鱼 凤尾鱼 黄鱼 明太鱼
		`),object:a(`
			水瓶 铅笔 橡皮 雨伞 灯笼 台灯 时钟 镜子 钥匙 铜锁 书包 戒指 纽扣 绣针 丝线 画笔 颜料 纸张 笔记 书签 信件 明信片 邮票 印章 罗盘 地图 望远镜 显微镜 相机
			胶卷 收音机 气球 风筝 陀螺 弹珠 骰子 卡片 拼图 积木 船帆 铁锚 帐篷 背包 火柴 蜡烛 花瓶 茶壶 茶杯 勺子 盘子 铁锅 齿轮 丝带 信封 枕头 毛毯 竹篮 扫帚
			哨子 绳结 木桶 折扇 手杖 盾牌 弓箭 渔网 陶罐 砚台 木梳 风铃 纸鹤 沙漏 算盘 秋千 顶针 线轴 纺锤 织机 火钳 木槌 锉刀 冲头 铅垂线 直尺 卷笔刀 墨水瓶
			羽毛笔 笔尖 吸墨纸 文件夹 活页夹 写字板 便条本 纸夹 图钉 铆钉 螺栓 螺丝 垫圈 支架 合页 门闩 挂锁 钥匙环 铁链 绳索 细绳 流苏 带扣 拉链 按扣 粘扣
			布片 徽章 勋章 项链绳 小盒 胸针 袖扣 发夹 发箍 腕带 脚链 包带 荷包 手提袋 旅行箱 木箱 罐筒 玻璃瓶 水壶箱 盆桶 木钵 筛盘 藤篮
		`),nature:a(`
			天空 朝阳 波浪 潮水 海洋 河流 湖泊 瀑布 峡谷 高山 丘陵 草原 森林 洞穴 沙漠 沙粒 岩石 卵石 火山 地震 余烬 冰川 珊瑚 湿地 回声 影子 山泉 溪流 池塘 海湾
			沙丘 悬崖 山峰 荒野 冻原 疏林 大草原 沼泽 泽地 河口 三角洲 潟湖 环礁 峡湾 港汊 海岬 半岛 地峡 群岛 小岛 高原 台地 断崖 冰裂 冰碛 岩屑 巨岩 岩盘 沙洲
			浅滩 暗礁 海底 海沟 深渊 间歇泉 喷气孔 塌陷坑 喀斯特 钟乳石 石笋 洞室 岩窟 岩棚 尖峰 针峰 雪堆 地平 水平 苍穹
		`),plant:a(`
			树木 叶子 花朵 树根 种子 果实 苔藓 蕨类 竹林 松树 枫叶 樱花 蒲公英 向日葵 落叶 花瓣 松果 芦苇 玫瑰 百合 郁金香 兰花 荷花 莲花 菊花 梅花 木兰 杜鹃 山茶
			水仙 薰衣草 丁香 牡丹 芍药 茉莉 康乃馨 紫罗兰 风信子 铃兰 三叶草 常春藤 藤蔓 荆棘 芦荟 草地 青草 野草 嫩芽 新芽 花蕾 花粉 年轮 橡果 银杏 柳树 白桦 杉树
			柏树 榆树 橡树 栗树 核桃 榕树 竹笋 地衣 海藻 昆布 盆景 树篱 嫩叶 枯叶 花束 树枝 树干 树皮 仙人掌 含羞草 迷迭香 悬铃木 白杨 山杨 桤木 榛树 花楸 山楂树
			李树 接骨木 山茱萸 映山红 绣球花 紫藤 忍冬 栀子 夹竹桃 三角梅 木槿 金盏花 百日菊 矮牵牛 秋海棠 天竺葵 报春花 雪滴花 风铃草 毛地黄
			飞燕草 翠雀 羽扇豆 翠菊 大丽花 唐菖蒲 小苍兰 花毛茛 银莲花 毛茛 荨麻 树莓 石楠 荆豆 木贼 苔类 藻类 毛竹 藤条 椰子 丝兰 龙舌兰 多肉 罗勒 百里香 牛至 欧芹
			香菜 细香葱 酸模 茴香 莳萝 鼠尾草 墨角兰 龙蒿 柠檬草 薄荷 留兰香 洋甘菊
		`),gem:a(`
			黄金 白银 青铜 黄铜 玄铁 精钢 铂金 水晶 紫晶 玛瑙 琥珀 珍珠 翡翠 美玉 白玉 碧玉 墨玉 玉髓 红宝石 蓝宝石 祖母绿 猫眼石 月光石 黑曜石 大理石 花岗岩 石灰岩
			玄武岩 陨石 矿石 原石 宝石 钻石 金块 银锭 云母 石英 萤石 方解石 孔雀石 绿松石 青金石 石榴石 橄榄石 硫磺 白垩 象牙 砂金 金箔 银箔 铁矿 水银 电气石 日光石
			血石 蓝铜矿 红玉髓 黄水晶 尖晶石 金云母 方铅矿 磁铁矿 赤铁矿 黄铁矿 蓝晶石 红柱石 硅线石 辉石 角闪石 蛇纹石 绿泥石 高岭土 白云石 磷灰石 重晶石 天青石 刚玉
			绿柱石 铬矿 锰矿 钨矿 锑矿 铋矿 镉矿 铱矿 锇矿 钯矿 铑矿 钌矿 钽矿 铌矿 钒矿 硒矿 碲矿 镓矿 铟矿 铊矿 铷矿 铯矿 锶矿 钡矿 锂矿 硅石 褐铁矿 黄铜矿
			白铅矿 锌矿 锡矿 银矿 金矿 原矿 矿脉 晶洞 晶体
		`),concept:a(`
			自由 和平 正义 真理 智慧 记忆 想象 故事 诗歌 素描 语法 逻辑 物理 化学 生物 哲学 数学 几何 代数 历史 神话 传说 寓言 谚语 谜语 秘密 承诺 旅程 冒险 航行
			发现 实验 问题 答案 辩论 集会 节日 维度 平衡 和谐 色板 对比 仪式 习俗 文化 语言 字母 密码 档案 图集 历法 静默 沉思 痕迹 幻想 地平线 螺旋 洞察 直觉
			理性 判断力 教义 定理 公理 推论 假设 悖论 困境 范式 框架 前提 推理 演绎 归纳 类比 隐喻 象征 主题句 叙事 编年史 记录物 档案库 证言 宣言书 共识 妥协 誓约
			条约 同盟 竞争心 血缘 真实 梦想 领悟 净化 更新 再生 遗产 传统 礼仪 典礼 里程碑 门槛 序幕 结局 反转 留白
		`),myth:a(`
			神龙 火龙 冰龙 黑龙 白龙 青龙 凤凰 麒麟 貔貅 饕餮 白泽 妖精 精灵 仙女 女巫 幽灵 鬼魂 怨灵 神灵 天使 恶魔 人鱼 妖怪 怪兽 魔兽 圣兽 神兽 幻兽 魔王 龙王
			女神 魔法 魔力 咒语 诅咒 预言 神谕 结界 护符 封印 幻影 独角兽 半人马 美人鱼 狼人 吸血鬼 僵尸 木乃伊 石像鬼 巨魔 兽人 地精 矮人 天马 神鸟 白虎 朱雀
			玄武 三足乌 山神 海神 雷神 风神 龙神 灵魂 魂魄 蛟龙 蛇王 人面狮 合成兽 地狱犬 半神 泰坦 树精 水精 海妖 鸟女 蛇发女 牛头人 山羊人 牧神 狮身像
			巨乌贼 海兽王 陆兽王 报丧女 亡灵 死灵 尸鬼 影法师 幽体 骚灵 魔神 炎魔 陶俑 人造人 小恶魔 山魈 小妖精 家妖精 土精 食人魔 巨人族 战女神 女武神 修罗 女神像
			诗神 贤者 黑法师 魔术士 咒术士 降灵士 炼金士 御守 咒文字 符咒 阵法 巫术 祈福 前兆 预兆 预言书 神话集 传说集 奇谭集
		`),job:a(`
			骑士 法师 猎人 游侠 盗贼 海盗 水手 船长 厨师 面包师 园丁 铁匠 侦探 诗人 画家 舞者 小丑 旅人 朝圣者 僧侣 炼金师 弓手 射手 剑士 武士 将军 士兵 卫兵 守卫
			门卫 国王 女王 王子 公主 皇帝 管家 侍女 仆人 商人 农夫 渔夫 牧童 樵夫 船夫 车夫 领航员 飞行员 工程师 邮差 快递员 清洁工 消防员 警察 医生 护士 药师 兽医
			教师 学生 记者 作家 编辑 译者 歌手 演员 导演 乐师 矿工 木匠 陶匠 裁缝 占卜师 预言者 祭司 学者 博士 发明家 探险家 旅行者 选手 裁判 杂技师 雕塑家 向导
			制图师 档案员 策展人 修复师 考古家 生态家 地质家 气象家 天文家 植物家 动物家 昆虫家 鸟类家 海洋家 化学家 物理家 统计家 精算师 经济家 社会家 人类家 语言家
			文献家 历史家 出版人 校对员 排版工 插画家 动画师 摄影师 编剧家 剧作家 小说家 专栏家 广播员 播音员 口译员 笔译员 外交官 公证员 法务员 检察官 治安官 执行官
			审计员 记账员 鉴定师 承保人 中介人 估价师 测量员 制图工 维修工 机械工 焊工 管道工 索具工 玻璃工 屋顶工 抹灰工 砌砖工 石匠 锁匠 装潢师 制鞋工 制帽师 织工
			染工 制革匠 箍桶匠 陶艺家 玻璃匠 金匠 银匠 钟表匠 制琴师 调香师 酿酒家 啤酒师
		`),music:a(`
			钢琴 吉他 提琴 战鼓 铜铃 琵琶 歌曲 舞蹈 节奏 旋律 和弦 长笛 短笛 小号 圆号 萨克斯 单簧管 竖琴 大提琴 中提琴 小提琴 架子鼓 铃鼓 木琴 手风琴 口琴 曼陀林
			班卓琴 古筝 古琴 二胡 唢呐 编钟 乐谱 音符 音阶 和声 合唱 独唱 合奏 独奏 演奏 舞台 交响曲 协奏曲 奏鸣曲 圆舞曲 爵士 蓝调 摇滚 民谣 摇篮曲 进行曲 副歌
			前奏 间奏 尾声 音色 节拍 韵律 曲调 乐章 乐团 乐队 序曲 前奏曲 赋格曲 练习曲 夜曲 小夜曲 狂想曲 叙事曲 赞歌 圣歌 颂歌 咏唱曲 安魂曲 康塔塔 清唱剧 牧歌曲
			咏叹调 二重唱 三重唱 四重奏 五重奏 合奏团 管弦乐 合唱团 独奏者 指挥者 拍子 终止 段落 过渡句 渐强 渐弱 断奏 连奏 颤音 震音 滑音 琶音 八度 半音 调式 调性
			谱号 五线谱 记谱法 总谱 节拍器 调音器 放大器 踏板 簧片 琴弓 琴弦 指板 音孔 吹嘴 活塞 鼓槌 小鼓 低音部 强拍 弱拍 切分音 即兴曲 音乐会 巡演 返场
			喝彩 独奏会 发表会
		`),place:a(`
			市场 广场 城市 村落 巷子 桥梁 花园 图书馆 博物馆 剧院 学校 公园 港口 码头 车站 机场 灯塔 城堡 城墙 宫殿 寺庙 祠堂 佛塔 阁楼 地窖 屋顶 庭院 阳台 温室
			谷仓 木屋 观景台 游乐园 操场 体育馆 游泳池 水族馆 美术馆 动物园 植物园 澡堂 市政厅 邮局 银行 医院 药店 书店 面包房 咖啡馆 餐厅 厨房 卧室 客厅 走廊 楼梯
			地铁站 天桥 十字路 林荫道 要塞 农场 牧场 果园 酒馆 大道 步行道 渔村 商业街 小巷 内院 露台 门廊 中庭 门厅 大堂 走道 楼梯间 顶层 地下层 储藏室 夹层 杂物间
			作坊 工作室 画廊 档案馆 观测站 天文馆 玻璃房 葡萄园 农庄 晒场 粮仓 风车房 水车房 瞭望塔 钟楼 尖塔 回廊 礼拜堂 圣所 修道院 神学院 棱堡 望楼 吊桥
			护城河 门楼 主塔 集市 夜市 商行 货栈 货仓 终点站 渡口 栈桥 防波堤 停泊地 港湾 海滨路 营地 山屋 别墅 宅邸 庄园
		`),food:a(`
			米饭 面条 拉面 饺子 包子 馒头 汤圆 火锅 烧烤 酱油 胡椒 大蒜 洋葱 土豆 红薯 胡萝卜 黄瓜 南瓜 白菜 生菜 菠菜 蘑菇 豆腐 鸡蛋 奶酪 黄油 酸奶 苹果 草莓
			葡萄 西瓜 桃子 橘子 柠檬 香蕉 芒果 樱桃 菠萝 蓝莓 巧克力 糖果 果冻 饼干 蛋糕 布丁 甜甜圈 汉堡 披萨 意面 沙拉 咖喱 寿司 泡菜 年糕 粽子 月饼 蜂蜜 法棍
			牛角包 黄油包 贝果 椒盐卷 松饼 司康 烤饼 煎饼 可丽饼 煎蛋卷 蛋饼 咸派 烩饭 海鲜饭 团子 意饺 千层面 扁面 宽面 乌冬 荞面 米粉 稀饭 米汤 浓汤 虾汤 清汤
			炖肉 炖菜 焗菜 肉糕 香肠 培根 熏肉 火腿 腊肠 肉冻 肉排 薄肉排 肉丸 烤串 串烧 烤肉 胸肉 里脊 后腰 内腿 鸡腿 鱼片 生鱼片 腌鱼 生拌 凉拌 豆泥 果酱 辣酱
			甜酱 香辣酱 橙酱 蛋奶羹 蛋白霜 慕斯 蛋挞 布朗尼 马卡龙 可乐饼 豆沙 烧麦 玉米糕 馅饼 酥饼 春卷 馄饨 锅贴 糯米糕
		`),sport:a(`
			足球 棒球 篮球 排球 乒乓 网球 羽毛球 高尔夫 保龄球 台球 游泳 田径 马拉松 短跑 体操 跆拳道 柔道 空手道 剑道 拳击 摔跤 击剑 射箭 射击 马术 赛艇 皮划艇
			冲浪 滑雪 滑板 曲棍球 橄榄球 板球 骑行 登山 攀岩 球拍 球棒 球门 奖牌 奖杯 领奖台 观众 冠军 决赛 逆转 马球 冰壶 滑冰 跳水 垒球 飞镖 慢跑 跨栏 标枪 铁饼
			接力 计分牌 头盔 犯规 加时 半决赛 本垒打 自由泳 仰泳 蛙泳 蝶泳 举重 三项赛 雪橇赛 得分 助攻 扣杀 发球 回合 起跑线 终点线 跳远 跳高 撑杆 平衡木 开幕式
			闭幕式 十项赛 铁人赛 跳伞 冲浪板 水球 对练 勾拳 直拳 击倒 抱摔 侧踢 后踢 空翻 倒立 热身 暂停 点球 平分 小鸟球 推杆 球道 赛马场 观众席 助威席 裁判席
			代表队 教练席 替补席 折返点 记录赛 训练场 集训
		`),vehicle:a(`
			单车 火车 小船 汽车 公交 出租车 卡车 摩托车 踏板车 飞机 客机 战机 飞船 火箭 潜艇 游轮 货轮 客轮 帆船 木筏 军舰 战车 马车 板车 手推车 拖拉机 挖掘机
			消防车 救护车 警车 缆车 地铁 电车 列车 机车 独木舟 热气球 飞艇 降落伞 雪橇 人力车 轿子 三轮车 面包车 皮卡 房车 除雪车 单轨 黄包车 游艇 双体船 破冰船 油轮
			驳船 渔船 双翼机 水上机 探测器 登陆器 雪地车 独轮车 拖车 灵车 婴儿车 货车 清扫车 洒水车 巡逻艇 拖船 潜水艇 小艇 卧铺 客车 快车 慢车 货船 游船
			渡船 花车 微型车 大巴 两轮车 四轮车 轿车 独木船 舢板 乌篷船 帆板 商船 护卫舰 驱逐舰 巡洋舰 哨艇 客船 货机 运输机 教练机 侦察机 气垫船 滑翔机 旋翼机 轨道车
			电瓶车 叉车 矿车 索道 吊篮 观光车 平板车 牵引船
		`),product:a(`
			电脑 笔记本 键盘 鼠标 屏幕 显示器 打印机 音箱 耳机 耳塞 话筒 无人机 平板 手机 充电器 电池 遥控器 冰箱 洗衣机 吸尘器 电风扇 空调 暖气 净水器 电饭煲 微波炉
			烤箱 搅拌机 加湿器 除湿器 剃须刀 牙刷 牙膏 香皂 洗发水 手表 投影仪 路由器 扫描仪 摄像头 手柄 充电宝 功放 唱机 电水壶 磨豆机 油炸锅 蒸锅 洗碗机 烘干机
			吹风机 乳液 防晒霜 床垫 窗帘 门铃 温度计 灭火器 手电筒 计算器 灯泡 插座 排插 被子 枕套 毛巾 脸盆 洗衣液 柔顺剂 电熨斗 压力锅 炒锅 豆浆机 咖啡机 打蛋器
			削皮刀 开瓶器 保温壶 水杯 门垫 衣架 衣柜 书架 床头柜 躺椅 沙发垫 脚凳 床架 被套 枕巾 花洒 水龙头 通厕器 刮水器 晾衣杆 衣夹 熨衣板 量杯 量勺 擀面杖 电烤盘
			滤网 隔热垫
		`),color:a(`
			赤色 丹红 桃红 玫红 品红 洋红 朱砂 橘色 杏色 米色 乳白 奶白 雪青 藕荷 松绿 苔绿 草绿 豆绿 竹青 黛色 玄色 缁色 皂色 乌黑 铁灰 银灰 烟灰 鸽灰 藕灰
			驼色 栗色 褐色 赭色 茶色 酱色 姜黄 鹅黄 杏黄 明黄 缃色 缥色 黛紫 绛紫 青莲 藤紫 水绿 湖绿 月白 霜色 雾色 云白 蔚蓝 靛青 普蓝 钴蓝 松花 竹月 黛蓝
			苍青 苍黄 缟色 素色 石榴红 丁香色 翡翠绿 橄榄绿 秋香色 珍珠白 宝石蓝 孔雀绿 象牙白 天青色 海棠红 胭脂红 琥珀黄 珊瑚粉 薄荷绿 柠檬黄 咖啡色 玫瑰金
		`),finance:a(`
			账簿 发票 收据 债券 股票 分红 利息 贷款 抵押 存款 储蓄 账户 余额 预算 审计 资产 负债 资本 收益 利润 亏损 盈余 赤字 欠款 信用 支票 货币 汇率 收益率
			证券 基金 信托 关税 税金 退税 保费 养老金 工资 薪金 奖金 佣金 版税 合并 收购 救助 担保 抵押权 代金券 金库 国库 汇款 结算 清算 套利 期货 汇票 活期 提现
			明细 存折 保管 受托 债权人 债务人 贷方 借方 担保人 估值 鉴定 折旧 物价 萧条 繁荣 流动性 偿付力 破产 捐款 补贴 津贴 薪水 日薪 开支 收入 库存 成本 定价
			折扣 分期 拖欠 还款 到期 利率 本金 出资 行情
		`),tech:a(`
			服务器 缓存 缓冲 像素 编码 加密 解密 压缩 索引 查询 备份 仓库 集群 副本 快照 容器 发布 迁移 归档 路径 后缀 驱动 内核 栈区 队列 数组 矩阵 整数 实数
			字符串 解析器 编译器 运行时 机器码 指令 传输率 吞吐量 终端 错误 调试器 控制台 命令行 循环 条件 函数 变量 常量 对象 类别 继承 递归 网络 无线 有线 基站
			防火墙 地址 域名 通道 带宽 延迟 节点 分支 负载 扫描线 采样 量化 报文 线路 交换机 中继器 存储区 主存 外存 运算符 与门 或门 非门 半导体 集成 电路板 端子
			布线图 控制盘 网关 子网 主机名 会话 令牌 校验和 哈希 分片 密钥
		`),weather:a(`
			白云 微风 细雨 白雪 霜花 冰晶 薄雾 露珠 彩虹 晚霞 闪电 雷鸣 阵雨 季风 台风 旋风 毛毛雨 暴雨 骤雨 阵风 强风 凉风 台风眼 暴风雪 冰雹 树挂 冰柱 蜃景 光冠
			光晕 日光 雨滴 雨点 雨丝 雨幕 春雨 秋雨 夜雨 大雨 小雨 细雪 大雪 小雪 初雪 积雪 残雪 霜降 白霜 浓霜 朝露 夜露 晨雾 浓雾 薄霭 云霞 云层 乌云 阴云 雷雨
			落雷 雷电 暴风 狂风 烈风 疾风 顺风 逆风 海风 山风 谷风 热浪 寒潮 酷暑 严寒 暖流 湿气 气压 天气 气候 晴天 阴天 雨天 晴空 阴霾 雾霾 沙尘 沙暴 龙卷风
			飓风 微雨 甘霖
		`),space:a(`
			宇宙 星辰 月亮 太阳 银河 彗星 流星 极光 新月 星尘 日食 月食 天顶 月明 星明 行星 卫星 小行星 星云 星团 星座 轨道 引力 自转 公转 黑子 太阳风 陨坑 月面
			光年 天体 恒星 天球 黄道 黑洞 超新星 流星雨 宇宙尘 太阳系 银河核 平流层 大气层 真空 失重 满月 朔月 半月 上弦 下弦 月光 星光 北极星 木星 火星 金星
			土星 水星 天王星 海王星 冥王星 星系 星域 日冕 月晕 星轨 银盘
		`),time:a(`
			黎明 黄昏 薄暮 夏至 冬至 春分 秋分 季节 瞬间 永恒 假日 刹那 岁月 早晨 中午 下午 傍晚 夜晚 午夜 正午 凌晨 清晨 深夜 昨天 今天 明天 后天 前天 一天 两天
			三天 十天 一月 半年 一年 今年 去年 明年 春天 夏天 秋天 冬天 初春 暮春 初夏 盛夏 暮夏 初秋 深秋 初冬 隆冬 残冬 节气 立春 立夏 立秋 立冬 小暑 大暑 小寒
			大寒 惊蛰 清明 谷雨 芒种 白露 时刻 时间 永劫 幼年 青春 老年 晚年 余生 时节 时候 从前 现在 以后 一瞬 片刻 须臾 年华 光阴 年代 世纪 千年
		`),emotion:a(`
			勇气 希望 热情 乡愁 感激 谦逊 忍耐 勤勉 慎重 节制 诚实 好奇 敬畏 平静 孤独 恋情 渴望 友谊 友爱 团结 共情 怜悯 浪漫 余韵 灵感 喜悦 悲伤 愤怒 恐惧 惊讶
			快乐 欢喜 欣喜 狂喜 幸福 满足 安慰 宽慰 释然 期待 盼望 忧愁 忧郁 阴郁 沮丧 绝望 失望 后悔 懊悔 羞耻 骄傲 自负 嫉妒 羡慕 欲望 贪婪 爱情 慈爱 温柔 暖意
			同情 信任 怀疑 疑虑 猜忌 惊恐 战栗 恐慌 暴怒 恼怒 烦躁 无聊 倦怠 冷漠 热忱 狂热 兴奋 高涨 意志 决心 觉悟 信念 确信 自信 谦虚 冷静 沉着 镇定 慌乱 紧张
			安心 谅解 和解 感动 感慨 陶醉 恍惚 欢欣 痛苦 苦楚 哀怜 心情 心境 情绪 脾气 兴致 惆怅 眷恋 思念 憧憬
		`),body:a(`
			头部 额头 眉毛 睫毛 眼皮 鼻子 鼻梁 嘴巴 嘴唇 牙龈 牙齿 舌头 下巴 脸颊 耳朵 耳垂 脖子 后颈 肩膀 手臂 手肘 手腕 手掌 手背 手指 指甲 拳头 胸口 肋骨 肚子
			肚脐 后背 腰部 臀部 骨盆 大腿 膝盖 小腿 脚踝 脚背 脚趾 脚跟 骨头 头骨 脊椎 肌肉 肌腱 韧带 关节 软骨 心脏 肺部 肝脏 胃部 胆囊 肾脏 脾脏 肠道 大肠 小肠
			膀胱 大脑 神经 血管 动脉 静脉 血液 肌肤 皮肤 毛孔 头发 胡须 眼泪 汗水 唾液 呼吸 脉搏 体温 心跳 眼球 耳膜 皱纹 雀斑 酒窝 伤疤 淤青 水泡 老茧 锁骨 髌骨
			颧骨 颌骨 骨髓
		`),clothing:a(`
			帽子 鞋子 手套 围巾 眼镜 拖鞋 凉鞋 浴袍 衣服 外套 大衣 夹克 衬衫 上衣 长袍 裤子 牛仔裤 短裤 裙子 连衣裙 背心 开衫 毛衣 卫衣 袜子 长袜 内衣 内裤 睡衣
			围裙 头巾 领带 领结 腰带 皮带 皮鞋 球鞋 靴子 雨靴 室内鞋 校服 制服 正装 礼服 汉服 旗袍 长衫 马褂 布鞋 斗篷 披风 雨衣 泳衣 潜水衣 工作服 防寒服 登山服
			运动服 袖子 衣领 衣摆 衣襟 里衬 布料 麻布 棉布 丝绸 羊毛 天鹅绒 皮革 毛皮 便帽 礼帽 面纱 披肩 围脖 耳罩 马甲 衬裙 睡袍 吊带 紧身衣 短袖 长袖 无袖 高领
			翻领
		`),tool:a(`
			斧头 锯子 梯子 剪刀 钳子 扳手 凿子 铁砧 风箱 锥子 夹钳 台钳 水平仪 卡尺 量角器 磁铁 铁锤 电钻 砂纸 刨子 镐头 镰刀 锄头 耙子 尖嘴钳 螺丝刀 烙铁 磨光机
			切割机 焊机 卷尺 墨斗 圆规 手斧 撬棍 杠杆 楔子 滑轮 曲柄 大锤 抹刀 磨石 擦板 筛子 铁锹 耙犁 连枷 梭子 把手 刀刃 工具 器具 用具 装备 零件 螺钉 拔钉器
			橡皮锤 三角尺 曲尺 直角尺 水平尺 划线器 分规 倒角器 接头 台刨 手锯 钢锯 弓锯 雕刀 刻刀 剪钳 老虎钳 管钳 台虎钳 工作台 锤子 铅垂 尺子 钢针 木锤 齿轮盘
			锉具 纺轮 绕线轴 铁钎 撬杠 錾子
		`),drink:a(`
			咖啡 绿茶 红茶 果汁 牛奶 泉水 汽水 大麦茶 玄米茶 乌龙茶 花茶 茉莉茶 菊花茶 普洱茶 白茶 黄茶 黑茶 抹茶 甜酒 米酒 豆浆 饮料 饮品 清凉饮 苹果汁 葡萄汁 橙汁
			西瓜汁 拿铁 浓缩咖 美式 摩卡 冰咖啡 冰茶 冷茶 热茶 啤酒 生啤 黑啤 精酿 葡萄酒 白酒 红酒 黄酒 清酒 浊酒 烧酒 梅酒 果酒 蒸馏酒 酿造酒 洋酒 鸡尾酒 起泡酒
			香槟 利口酒 苦艾酒 甘露 蜜水 糖水 冰水 温水 冷水 开水 茶水 奶茶 珍珠奶 椰汁 蔗汁 梨汁 豆汁 酸梅汤 凉茶 药茶 姜茶 清水 卡布奇 酸乳 冰奶茶
		`)},parts:a(`
		尾巴 足迹 翅膀 影子 瞳孔 手掌 声音 气息 暖意 香气 花纹 鳞片 鬃毛 犄角 鸟喙 鱼鳍
		巢穴 洞窟 种子 碎片 群落 村落 国度 王国 旅程 故事 歌谣 舞步 星辰 光芒 声响 微风
		波纹 山丘 山谷 果实 花束 羽毛 利爪 胡须 眉毛 外壳 笑容 泪水 阴影 纹章 残片 梦境
		记忆 侧脸
	`),frames:[{slots:["noun"],weight:10},{slots:["adjective","noun"],weight:38},{slots:["action","noun"],glue:["的"],weight:26},{slots:["noun","part"],glue:["的"],weight:16},{slots:["adjective","noun","part"],glue:["","的"],weight:10}],syn:{kind:"pool",pool:a(`
			星 月 云 风 雨 雪 霜 雾 光 影 火 水 山 石 木 花 叶 鸟 兽 龙 虎 狼 鹿 鱼 玉 金 银
			铁 玄 幻 灵 神 圣 暗 明 夜 晨 昏 霞 岚 潮 渊 峰 谷 林 野 沙 川 洲 岛
		`),minSyllables:2,maxSyllables:3}},ce=["en","ko","ja","zh","vi","es","it","de","ru"],le=["animal","object","nature","plant","gem","concept","myth","job","music","place","food","sport","vehicle","product","color","finance","tech","weather","space","time","emotion","body","clothing","tool","drink"],hc=["color","finance","tech"],ge={en:rc,ko:cc,ja:mc,zh:fc,vi:dc,es:lc,it:sc,de:ic,ru:uc},gc=12;function pc(e,n="all"){return n==="adjective"?e.adjectives:n==="action"?e.actions:[...e.adjectives,...e.actions]}function to(e){for(const n of e.frames){const t=n.slots.indexOf("noun"),o=n.slots.indexOf("adjective");if(t>=0&&o>=0)return o>t}return!1}function gn(e,n,t){var i;const o=t&&((i=e.agreement)==null?void 0:i[t]);if(!o)return n;for(const[r,l]of o)if(n.endsWith(r))return n.slice(0,n.length-r.length)+l;return n}function de(e){let n=1/0,t=0;for(const o of e)n=Math.min(n,o.length),t=Math.max(t,o.length);return[n===1/0?1:n,t||1]}function jn(e){let n=1/0,t=0;for(const o of e)n=Math.min(n,o.length),t=Math.max(t,o.length);return[n===1/0?0:n,t]}function lt(e,n){const[t,o]=jn(e.onset),[i,r]=jn(e.vowel),[l,m]=jn(e.coda);return[n*(t+i)+l,n*(o+r)+m]}function bc(e){if(e.kind==="pool")return[Math.max(1,e.minSyllables),Math.max(1,e.maxSyllables)];const[n]=lt(e,e.minSyllables),[,t]=lt(e,e.maxSyllables);return[Math.max(1,n),Math.max(1,t)]}function Pt(e){return e==="all"?le:[e]}function rn(e,n){var i;const t=(i=e.nounGender)==null?void 0:i[n];if(t)return t;if(!e.genderRules)return;const o=n.toLowerCase();for(const[r,l]of e.genderRules)if(o.endsWith(r))return l}function xt(e,n){for(const t of le)if(e.nouns[t].includes(n))return t;return null}function At(e,n,t,o){const i=o?e.filter(c=>c.toLowerCase().startsWith(o.toLowerCase())):e;if(!i.length)return null;const r=i.filter(c=>c.length>=n&&c.length<=t);if(r.length)return J(r);const l=i.filter(c=>c.length<=t);if(l.length)return J(l);const m=i.filter(c=>c.length>=n);return J(m.length?m:i)}function vc(e,n,t,o){if(e.kind==="pool"){const d=Math.max(n,1),b=Math.max(d,t),y=se(Ce(e.minSyllables,e.maxSyllables),d,b);let S=o;for(let M=S.length;M<y;M+=1){let _=J(e.pool);for(let j=0;j<3&&_===S.slice(-1);j+=1)_=J(e.pool);S+=_}return S}const i=[];for(let d=e.minSyllables;d<=e.maxSyllables;d+=1){const[b,y]=lt(e,d);y>=n&&b<=t&&i.push(d)}const r=i.length?J(i):Ce(e.minSyllables,e.maxSyllables),l=[];for(let d=0;d<r;d+=1)l.push(d===0&&o?[o.toLowerCase()]:e.onset),l.push(e.vowel);l.push(e.coda);const m=new Array(l.length+1).fill(0),c=new Array(l.length+1).fill(0);for(let d=l.length-1;d>=0;d-=1){const[b,y]=jn(l[d]);m[d]=b+m[d+1],c[d]=y+c[d+1]}let h="";for(let d=0;d<l.length;d+=1)h+=_c(l[d],n-h.length-c[d+1],t-h.length-m[d+1]);return h}function _c(e,n,t){const o=e.filter(l=>l.length>=n&&l.length<=t);if(o.length)return J(o);let i=[],r=1/0;for(const l of e){const m=l.length<n?n-l.length:l.length>t?l.length-t:0;m<r?(r=m,i=[l]):m===r&&i.push(l)}return i.length?J(i):""}function yc(e){for(const n of e){const t=n.charAt(0);if(t.toLowerCase()!==t.toUpperCase())return t===t.toUpperCase()}return!1}function ln(e,n,t,o,i,r){const l=ze(t),m=l?null:At(n,o,i,r),c=m??vc(e.syn,o,i,r);return{word:e.capitalize||yc(n)?Ke(c):c,missed:!l&&!m}}function kc(e,n){const t=ge[e];let o=1/0,i=0;for(const r of Pt(n)){const[l,m]=de(t.nouns[r]);o=Math.min(o,l),i=Math.max(i,m)}return[o,i]}function Sc(e,n){const t=ge[e],o=Pt(n.theme);let i=null,r=1/0;for(let l=0;l<gc;l+=1){const m=J(o),c=t.nouns[m],[h,d]=de(c),[b,y]=En(n.minLength,n.maxLength,h,d),{word:S,missed:M}=ln(t,c,n.invent,b,y,n.prefix),_={word:S,language:e,theme:c.includes(S)?m:xt(t,S)};if(S.length>=b&&S.length<=y&&!M)return _;const j=(S.length<b?b-S.length:Math.max(0,S.length-y))+(M?1:0);j<r&&(r=j,i=_)}return i}function wc(e={}){const n=e.language??"all",t={theme:e.theme??"all",invent:fn(e.realism),minLength:Ne(e.minLength),maxLength:Ne(e.maxLength),prefix:dn(e.startsWith)};return $n(e,()=>Sc(hn(n,ce),t),o=>o.word)}function ao(e,n,t){const o=typeof e=="string"||Array.isArray(e);return{target:o?e:void 0,settings:(o?n:e)??t}}function oo(e,n,t){const{target:o,settings:i}=ao(e,n,{}),r=se(Math.floor(i.length??qm),1,Gm),l=i.charset||Om,m=i.separator??Wm,c=()=>Im(r,l);if(o===void 0)return c();const h=d=>t(d,c(),m);return Array.isArray(o)?o.map(h):h(o)}function fa(e,n){const t=n.language??(e?Xm(e):"all"),o=hn(t,ce),i=ge[o],r=pc(i,n.kind??"all"),[l,m]=de(r),{word:c}=ln(i,r,fn(n.realism),l,m,""),h=e===void 0?void 0:rn(i,e);return[gn(i,c,h),n.separator??i.joiner,to(i)]}function Mc(e,n){const{target:t,settings:o}=ao(e,n,{});if(t===void 0)return fa(void 0,o)[0];const i=r=>{const[l,m,c]=fa(r,o);return c?r+m+l:l+m+r};return Array.isArray(t)?t.map(i):i(t)}function jc(e,n){return oo(e,n,(t,o,i)=>o+i+t)}function Lc(e,n){return oo(e,n,(t,o,i)=>t+i+o)}const Cc={onset:a("b c d f g h j k l m n p r s t v w br cl dr fr gr st th tr ch"),vowel:a("a e i o u ae ai ea ee ia ie oo ou"),coda:["","",...a("n l r s th ll nn ne ra na la")],minSyllables:2,maxSyllables:3},zc={onset:a("b c d f g l m n p r s t v z br gr tr"),vowel:a("a e i o ia io ie"),coda:["","",...a("no na ni lo ra ri llo nti ano")],minSyllables:2,maxSyllables:3},Tc={onset:a("b c d f g j l m n p r s t v z br gr"),vowel:a("a e i o u ia ie ue"),coda:["","",...a("n s z no na lo ro les ndo")],minSyllables:2,maxSyllables:3},Pc={onset:a("b d f g h k l m n r s t w sch st br kl"),vowel:a("a e i o u ei ie au eu"),coda:["",...a("n r l s ch rt ng mann ner")],minSyllables:2,maxSyllables:3},xc={onset:a("б в г д к л м н п р с т ф х ч ш"),vowel:a("а е и о у я ю"),coda:["","",...a("н в р л с й к")],minSyllables:2,maxSyllables:3},Ac={onset:a("b c d h l m n ng nh ph q t th tr v x"),vowel:a("a e i o u ai ao ie uy oa"),coda:["",...a("n nh ng m c t p")],minSyllables:1,maxSyllables:2},Bc={order:"given-first",joiner:" ",hasMiddle:!0,roman:"fold",lengthSpec:{given:[3,10],last:[4,10],middle:[3,10]},last:a(`
		Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann
		Schäfer Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun
		Krüger Hofmann Hartmann Lange Werner Krause Lehmann Köhler Herrmann Schmitz
		Walter Meier König Mayer Huber Kaiser Fuchs Peters Scholz Möller Jung Hahn Vogel
		Roth Berger Winkler Beck Frank Keller Franke Albrecht Schulze Schmitt Maier
		Schmid Lang Weiß Sommer Haas Schreiber Graf Dietrich Ziegler Kuhn Pohl Engel
		Horn Busch Bergmann Voigt Sauer Arnold Wolff Pfeiffer Kraus Böhm Simon Ernst
		Riedel Hansen Nowak Barth Kern Krieger Fritz Voss Hein Brandt Seidel Stein
		Reuter Hummel Wenzel
	`),male:a(`
		Lukas Leon Finn Paul Jonas Elias Ben Noah Luis Felix Maximilian Julian Moritz
		David Tim Jan Niklas Philipp Sebastian Alexander Michael Thomas Andreas Stefan
		Martin Florian Matthias Daniel Christian Markus Emil Anton Theo Oskar Jakob
		Johannes Friedrich Wilhelm Heinrich Georg Konrad Ludwig Karl Otto Joachim Fabian
		Linus Erik Bernd Christoph Dirk Frank Gerhard Hans Heinz Helmut Holger Jens
		Jürgen Klaus Manfred Marcel Norbert Oliver Ralf Rainer Rolf Rudolf Sven Thorsten
		Ulrich Uwe Volker Wolfgang Detlef Eckhard Gunnar Hartmut Heiko Hubert Ingo
		Reinhard Siegfried Torsten Waldemar Winfried Bastian Clemens Dennis Gregor
		Hendrik Kilian Lennart Marius Roland
	`),female:a(`
		Mia Emma Hannah Emilia Sofia Lena Lea Marie Anna Laura Julia Sarah Lisa
		Katharina Johanna Charlotte Clara Amelie Leonie Frida Greta Ida Melina Nele
		Paula Sophie Antonia Helena Nora Maria Luisa Mathilda Theresa Elisabeth Ingrid
		Ursula Gisela Renate Monika Petra Brigitte Christa Sabine Claudia Stefanie
		Franziska Magdalena Annika Angelika Anja Annette Beate Birgit Christiane
		Cornelia Doris Elke Gabriele Hannelore Heike Helga Jutta Karin Katrin Kerstin
		Manuela Margarete Marion Martina Melanie Nicole Silke Simone Susanne Sylvia
		Tanja Verena Waltraud Bettina Dagmar Edith Gudrun Heidrun Ilse Kathrin Rosemarie
		Sigrid Ulrike Yvonne Astrid Britta Carina Constanze Dorothea Elfriede Wiebke
	`),syn:Pc},Hc={order:"given-first",joiner:" ",hasMiddle:!0,roman:"fold",lengthSpec:{given:[3,10],last:[3,10],middle:[3,10]},last:a(`
		Smith Johnson Williams Brown Jones Miller Davis Wilson Anderson Taylor Thomas
		Moore Jackson Martin Lee Clark Lewis Walker Hall Allen Young King Wright Scott
		Green Baker Adams Nelson Carter Clover Bennett Foster Hughes Cooper Reed Harris
		Thompson White Robinson Turner Phillips Campbell Parker Evans Edwards Collins
		Stewart Morris Rogers Morgan Bell Murphy Bailey Cook Cox Howard Ward Richardson
		Watson Brooks Kelly Sanders Price Gray Hayes Myers Ford Hamilton Graham Sullivan
		Wallace Woods Cole Palmer Robertson Fisher Ellis Harrison Gibson Marshall Wells
		Webb Simpson Stevens Tucker Porter Hunter Hicks Crawford Henry Boyd Mason Dixon
		Fowler Grant Knight Lawson Newman Osborne Pearce Quinn Riley Sharp Todd Vaughn
		Warren Barnes Chapman Dawson Freeman Gardner Holland Ingram Jennings Lambert
		Mills Norton Owens Payne Reeves Shaw Bryant Butler Coleman Doyle Ferguson
		Fleming Gordon Hopkins Manning Mercer Nichols Norris Pearson Reynolds Sherman
		Sutton Thornton Walton Whitaker Abbott Bradley Bishop Donovan Elliott Rhodes
		Sinclair Walsh Yates Keller Tate Ackerman Aldridge Alcott Ashford Atwood
		Bancroft Barlow Barrett Bartlett Beaumont Benson Berkeley Blackwood Blythe
		Bolton Bradshaw Braxton Bridges Brockman Buchanan Cadogan Calloway Carlisle
		Carrington Chadwick Chambers Chandler Chesterton Clayton Cleveland Clifton
		Compton Coventry Cromwell Crowther Cunningham Dalton Danvers Davenport Delaney
		Dempsey Devereux Dorset Driscoll Duncan Eastwood Edgerton Ellsworth Everard
		Fairbanks Fairfax Falconer Fenwick Fitzgerald Fleetwood Foxwell Galloway Garland
		Gatsby Godwin Granger Greenwood Grimshaw Halloway Hampton Harcourt Hargrove
		Harlow Hathaway Haverford Hawthorne Hayward Heathcote Hollis Huntington
		Ingersoll Kingsley Langdon Larkin Lockwood
	`),male:a(`
		James William Oliver Henry Jack Noah Ethan Liam Lucas Benjamin Alexander Daniel
		Matthew Samuel David Michael Joseph Nathan Ryan Andrew Thomas Charles Gabriel
		Julian Adam Nicholas Aaron Christian Owen Dylan Isaac Leo Max George Eric Jacob
		Logan Mason Elijah Caleb Wyatt Grayson Levi Hunter Connor Evan Nolan Cole Miles
		Jasper Theodore Oscar Felix Simon Vincent Patrick Peter Paul Mark Steven Brian
		Kevin Justin Jason Timothy Gregory Edward Arthur Albert Frank Harry Alan Neil
		Craig Dean Glenn Ross Todd Wayne Bruce Roger Keith Curtis Marcus Trevor Shane
		Blake Chase Drew Brett Colin Derek Eliot Finn Grant Hugh Ian Jared Kyle Lance
		Mitchell Nash Perry Quentin Reid Seth Tyler Victor Walter Zachary Preston
		Spencer Tristan Emmett Rowan Silas Declan Everett Beckett Rhys Callum Xavier
		Quinn Anthony Joshua Brandon Emerson Dominic Cameron Austin Jordan Travis
		Douglas Russell Raymond Philip Dennis Jerome Leonard Bernard Eugene Duncan
		Malcolm Alistair Lachlan Rory Ronan Aidan Brendan Kieran Gavin Stuart Jonathan
		Frederick Lawrence Wesley Garrett Ezra Sawyer Landon Easton Gideon Tobias Abel
		Adrian Alfred Angus Barnaby Bennett Bertram Blaine Bradley Brennan Bryson
		Caspian Cedric Clifford Clinton Conrad Corbin Cyrus Dalton Damian Darius Desmond
		Dexter Donald Dorian Edmund Edwin Elias Ellis Emory Ernest Esmond Fabian
		Fletcher Floyd Francis Franklin Gareth Gerald Gilbert Godfrey Gordon Graham
		Harold Harvey Herbert Horace Howard Hugo Humphrey Isaiah Jonah Joel Julius
		Keaton Kenneth Lawson Leland Lionel Lloyd Magnus Marlon Maurice Maxwell Miller
		Milton Morgan Nathaniel Nigel Norman Orson Osborn Percival Phineas Quincy
		Randolph Reginald
	`),female:a(`
		Emma Olivia Ava Sophia Isabella Charlotte Amelia Mia Harper Evelyn Abigail Emily
		Grace Chloe Victoria Lily Hannah Zoe Ella Scarlett Aria Layla Nora Hazel Aurora
		Violet Ruby Alice Claire Stella Ivy Rose Eva Naomi Julia Sarah Madison Avery
		Riley Penelope Lucy Anna Caroline Nova Willow Elena Maya Leah Audrey Savannah
		Bella Skylar Paisley Everly Kennedy Piper Lydia Peyton Sadie Alexa Josephine
		Eliza Vivian Clara Delilah Isla Adeline Cora Iris Jasmine Juliette Faith Hope
		Daisy Poppy Ruth Esther Margaret Catherine Helen Diana Laura Rachel Rebecca
		Megan Nicole Amanda Melissa Jennifer Michelle Kimberly Amy Angela Heather Wendy
		Paula Tessa Bonnie Sylvia Vera Nina Elsie Freya Maisie Rosie Edith Beatrix Gemma
		Imogen Norah Opal Pearl Quinn Sienna Talia Ursula Verity Wren Ximena Yvonne Zara
		Sophie Eleanor Natalie Kayla Brooke Danielle Stephanie Christina Veronica
		Melanie Erica Joanna Beverly Marilyn Doris Gloria Irene Judith Louise Phoebe
		Rosalie Matilda Harriet Florence Genevieve Cecilia Beatrice Miriam Marina
		Sabrina Adelaide Arabella Bridget Cordelia Rosemary Holly Summer Autumn Juniper
		Nadia Abigale Adele Agatha Agnes Alberta Althea Amara Amelie Annabel Antonia
		Arden Ariadne Astrid Aveline Belinda Bernice Bethany Beverley Blythe Bridgette
		Bronwyn Camille Carmen Cassandra Cecily Celeste Celia Charity Clarissa
		Clementine Colette Constance Coraline Cressida Daphne Deirdre Delia Dorothea
		Eartha Edwina Eileen Elaine Eloise Elspeth Emmeline Enid Estelle Etta Evangeline
		Fenella Fiona Flora Frances Georgia Georgina Geraldine Gwendolyn Helena
		Henrietta Hilda Honora Imelda Ingrid Isadora Isolde Jacinta Jemima Jessamine
		Josie Juno Katrina Lorna Mabel Madeline Maren
	`),syn:Cc},Nc={order:"given-first",joiner:" ",hasMiddle:!0,roman:"fold",lengthSpec:{given:[3,10],last:[3,9],middle:[3,10]},last:a(`
		García Rodríguez González Fernández López Martínez Sánchez Pérez Gómez Martín
		Jiménez Ruiz Hernández Díaz Moreno Álvarez Romero Alonso Gutiérrez Navarro
		Torres Domínguez Vázquez Ramos Gil Ramírez Serrano Blanco Molina Castro Ortega
		Rubio Delgado Marín Sanz Núñez Iglesias Medina Garrido Cortés Santos Lozano
		Guerrero Cano Prieto Méndez Calvo Gallego Vidal León Herrera Márquez Peña
		Cabrera Flores Nieto Aguilar Pascual Herrero Montero Lorenzo Hidalgo Giménez
		Ibáñez Ferrer Durán Santana Benítez Vargas Mora Vega Soto Rojas Carrasco Soler
		Parra Esteban Bravo Gallardo Rueda Pardo Franco Espinosa Izquierdo Arias Crespo
		Reyes Campos Rivera Bermúdez Salazar Otero Redondo Sáez Lara Ossorio
	`),male:a(`
		Alejandro Daniel Pablo Hugo Álvaro Adrián David Mario Diego Javier Manuel Sergio
		Carlos Marcos Antonio José Juan Francisco Miguel Ángel Luis Fernando Jorge Raúl
		Rubén Iván Gonzalo Andrés Pedro Rafael Santiago Sebastián Nicolás Mateo Lucas
		Enrique Ricardo Roberto Alberto Eduardo Emilio Ignacio Joaquín Julián Ramón
		Salvador Guillermo César Cristian Ernesto Gustavo Héctor Jesús Julio Lorenzo
		Óscar Tomás Vicente Víctor Agustín Aurelio Benito Cayetano Domingo Esteban
		Felipe Gerardo Gregorio Isidro Jaime Leandro Leopoldo Marcelo Mauricio Norberto
		Octavio Patricio Rodolfo Rogelio Teodoro Ulises Valentín Amadeo Anselmo
		Bartolomé Casimiro Eloy Fabián Fidel Hilario Justino Máximo Nemesio Onésimo
		Prudencio Serafín Timoteo
	`),female:a(`
		Lucía María Paula Daniela Sara Carla Sofía Martina Alba Julia Claudia Elena
		Laura Marta Ana Isabel Carmen Cristina Natalia Andrea Rocío Nerea Irene Alicia
		Beatriz Patricia Raquel Nuria Silvia Eva Valeria Adriana Carolina Verónica
		Mercedes Pilar Teresa Rosario Manuela Josefa Antonia Gabriela Lorena Yolanda
		Esperanza Ainhoa Candela Ángela Blanca Catalina Clara Diana Dolores Elisa Emilia
		Estela Fátima Gloria Inés Juana Leticia Luisa Marina Mónica Olga Sonia Susana
		Amparo Araceli Begoña Consuelo Felisa Genoveva Herminia Jacinta Lourdes Macarena
		Milagros Montserrat Nieves Remedios Soledad Trinidad Aurora Casilda Covadonga
		Delia Elvira Florencia Guadalupe Higinia Leonor Marcela Obdulia Petra Rosalía
		Vicenta
	`),syn:Tc},Ec={order:"given-first",joiner:" ",hasMiddle:!0,roman:"fold",lengthSpec:{given:[3,10],last:[4,10],middle:[3,10]},last:a(`
		Rossi Russo Ferrari Esposito Bianchi Romano Colombo Ricci Marino Greco Bruno
		Gallo Conti De_Luca Costa Giordano Mancini Rizzo Lombardi Moretti Barbieri
		Fontana Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile
		Vitale Lombardo Serra Coppola Marchesi Parisi Villa Conte Farina Testa Grasso
		Palumbo Amato Sartori Battaglia Rizzi Monti Fabbri Grassi Bernardi Silvestri
		Marchetti Pellegrini Palmieri Damico Orlando Piras Carbone Sorrentino Guerra
		Negri Ferretti Basile Riva Donati Mazza Valentini Rossetti Marini Guidi Pagano
		Bellini Ruggiero Sala Benedetti Barone Fiore Caputo Montanari Cattaneo Morelli
		Ferro Gatti Corti Milani Riccardi Poli Neri Vitali Merlo Landi Sanna Martinelli
		Martinez
	`),male:a(`
		Lorenzo Francesco Alessandro Andrea Matteo Leonardo Gabriele Riccardo Tommaso
		Edoardo Federico Davide Giuseppe Antonio Marco Luca Giovanni Stefano Simone
		Paolo Roberto Giorgio Nicola Salvatore Pietro Vincenzo Angelo Emanuele Michele
		Fabio Alessio Daniele Dario Enrico Filippo Gianluca Giacomo Luigi Mattia
		Maurizio Nicolò Pasquale Raffaele Umberto Carlo Claudio Domenico Cesare Ettore
		Fausto Gaetano Ignazio Silvio Corrado Massimo Sergio Valerio Vittorio Marcello
		Renato Aldo Guido Elio Ivano Fulvio Tiziano Ermanno Osvaldo Gennaro Rocco Alfio
		Ciro Nunzio Saverio Cosimo Vito Attilio Amedeo Arturo Bernardo Cristiano Dante
		Egidio Ferdinando Gastone Gioele Leandro Manlio Orlando Pierluigi Quirino
		Adriano Ercole Fiorenzo Lelio Ottavio
	`),female:a(`
		Sofia Giulia Aurora Alice Ginevra Emma Giorgia Greta Martina Chiara Sara
		Beatrice Anna Francesca Elena Valentina Federica Elisa Alessia Ilaria Silvia
		Laura Marta Gaia Noemi Camilla Bianca Roberta Paola Lucia Antonella Arianna
		Carlotta Caterina Eleonora Emanuela Gabriella Giada Giovanna Ludovica Margherita
		Michela Nicoletta Rossella Serena Stefania Vittoria Adriana Agnese Rosanna
		Cinzia Loredana Ornella Fiorella Gemma Iolanda Liliana Marilena Mirella Nadia
		Oriana Rita Sandra Tiziana Wanda Assunta Concetta Domenica Filomena Gilda Ida
		Lidia Luciana Marcella Palmira Renata Rosalia Santina Teodora Velia Zita Alba
		Ambra Azzurra Celeste Diletta Erica Flavia Isotta Lavinia Melania Simona
		Cristina Daniela Barbara Monica Teresa
	`),syn:zc},$c={order:"family-first",joiner:"",hasMiddle:!1,roman:"token",lengthSpec:{given:[2,3],last:[1,3],middle:[0,0]},givenLenWeights:{2:70,3:30},last:ie(`
		佐藤:Sato 鈴木:Suzuki 高橋:Takahashi 田中:Tanaka 渡辺:Watanabe 伊藤:Ito
		山本:Yamamoto 中村:Nakamura 小林:Kobayashi 加藤:Kato 吉田:Yoshida 山田:Yamada
		佐々木:Sasaki 山口:Yamaguchi 松本:Matsumoto 井上:Inoue 木村:Kimura 林:Hayashi
		清水:Shimizu 斎藤:Saito 山崎:Yamazaki 森:Mori 池田:Ikeda 橋本:Hashimoto 阿部:Abe
		石川:Ishikawa 山下:Yamashita 中島:Nakajima 石井:Ishii 小川:Ogawa 前田:Maeda
		岡田:Okada 長谷川:Hasegawa 藤田:Fujita 後藤:Goto 近藤:Kondo 村上:Murakami
		遠藤:Endo 青木:Aoki 坂本:Sakamoto 福田:Fukuda 太田:Ota 西村:Nishimura
		中川:Nakagawa 三浦:Miura 藤井:Fujii 岡本:Okamoto 松田:Matsuda 中野:Nakano
		原田:Harada 小野:Ono 田村:Tamura 竹内:Takeuchi 金子:Kaneko 和田:Wada
		中山:Nakayama 石田:Ishida 上田:Ueda 森田:Morita 原:Hara 柴田:Shibata 酒井:Sakai
		工藤:Kudo 横山:Yokoyama 宮崎:Miyazaki 宮本:Miyamoto 内田:Uchida 高木:Takagi
		谷口:Taniguchi 安藤:Ando 丸山:Maruyama 今井:Imai 高田:Takada 藤本:Fujimoto
		河野:Kono 武田:Takeda 上野:Ueno 杉山:Sugiyama 千葉:Chiba 村田:Murata 増田:Masuda
		小山:Koyama 大塚:Otsuka 平野:Hirano 菅原:Sugawara 久保:Kubo 松井:Matsui
		木下:Kinoshita 野口:Noguchi 松尾:Matsuo 野村:Nomura 菊地:Kikuchi 佐野:Sano
		大西:Onishi 杉本:Sugimoto
	`),givenMale:ie(`
		陽翔:Haruto 悠真:Yuma 大翔:Hiroto 湊斗:Minato 朝陽:Asahi 蒼空:Sora 颯太:Sota
		大和:Yamato 陸斗:Rikuto 大輝:Daiki 拓海:Takumi 翔太:Shota 直樹:Naoki 和也:Kazuya
		隼人:Hayato 健太:Kenta 健太郎:Kentaro 慎太郎:Shintaro 龍太郎:Ryutaro
		悠太郎:Yutaro 龍之介:Ryunosuke 幸之助:Konosuke 健一郎:Kenichiro 宗一郎:Soichiro
		大輔:Daisuke 健一:Kenichi 浩二:Koji 雄大:Yudai 智也:Tomoya 卓也:Takuya
		直人:Naoto 竜也:Tatsuya 光宏:Mitsuhiro 康平:Kohei 翔平:Shohei 大地:Daichi
		悠斗:Yuto 大樹:Daiki 雄太:Yuta 亮太:Ryota 圭介:Keisuke 良太:Ryota 慎二:Shinji
		洋平:Yohei 将太:Shota 孝行:Takayuki 正樹:Masaki 秀明:Hideaki 克彦:Katsuhiko
		信之:Nobuyuki 義明:Yoshiaki 忠雄:Tadao 文雄:Fumio 春樹:Haruki 冬馬:Toma
		秋人:Akito 夏樹:Natsuki 湊:Minato 碧:Ao 律:Ritsu 樹:Itsuki 蓮:Ren 陽向:Hinata
		悠人:Yuto 瑛太:Eita 奏太:Kanata 惺:Sei 岳:Gaku 峻:Shun 遼:Ryo 篤志:Atsushi
		和樹:Kazuki 修平:Shuhei
	`),givenFemale:ie(`
		陽菜:Hina 結愛:Yua 結衣:Yui 咲良:Sakura 莉子:Riko 美咲:Misaki 芽依:Mei
		心春:Koharu 陽葵:Himari 美月:Mizuki 彩花:Ayaka 優花:Yuka 香織:Kaori 直美:Naomi
		麻衣:Mai 詩織:Shiori 由紀子:Yukiko 美智子:Michiko 真理子:Mariko 恵理子:Eriko
		奈々子:Nanako 美奈子:Minako 佐和子:Sawako 加奈子:Kanako 理沙:Risa 愛美:Manami
		彩香:Ayaka 早紀:Saki 千夏:Chinatsu 友美:Tomomi 里奈:Rina 舞子:Maiko 亜矢:Aya
		綾乃:Ayano 静香:Shizuka 千秋:Chiaki 春香:Haruka 夏帆:Kaho 千尋:Chihiro
		七海:Nanami 美穂:Miho 沙織:Saori 智子:Tomoko 洋子:Yoko 京子:Kyoko 和子:Kazuko
		節子:Setsuko 幸子:Sachiko 光子:Mitsuko 敏子:Toshiko 富美:Fumi 初音:Hatsune
		小春:Koharu 花音:Kanon 詩音:Shion 心愛:Kokoa 結菜:Yuina 莉緒:Rio 澪:Mio 葵:Aoi
		凛:Rin 楓:Kaede 桜:Sakura 杏:An 環:Tamaki 咲希:Saki 悠花:Yuka 優奈:Yuna 実桜:Mio
		千代:Chiyo 文香:Fumika 瑞希:Mizuki 雅子:Masako
	`),firstMale:ie(`
		健:ken 翔:sho 悠:yu 直:nao 拓:taku 亮:ryo 隼:haya 大:dai 陽:yo 和:kazu 智:tomo
		貴:taka 晴:haru 湊:mina 碧:ao 律:ritsu 奏:kana 惺:sei 岳:gaku 峻:shun 遼:ryo
		篤:atsu 孝:taka 正:masa 秀:hide 克:katsu 信:nobu 義:yoshi 忠:tada 文:fumi
		春:haru 冬:fuyu
	`),restMale:ie(`
		太:ta 郎:ro 斗:to 介:suke 也:ya 樹:ki 人:to 平:hei 輝:ki 之:yuki 輔:suke 一:ichi
		二:ji 大:dai 宏:hiro 地:chi 行:yuki 明:aki 彦:hiko 雄:o 馬:ma 志:shi 己:mi 生:o
	`),firstFemale:ie(`
		美:mi 結:yu 彩:aya 咲:saki 愛:ai 千:chi 真:ma 莉:ri 陽:hi 花:hana 楓:kae 理:ri
		早:sa 友:tomo 里:sa 舞:mai 亜:a 綾:aya 静:shizu 春:haru 夏:ka 七:nana 沙:sa
		智:tomo 洋:yo 京:kyo 和:kazu 節:setsu
	`),restFemale:ie(`
		子:ko 奈:na 香:ka 音:ne 乃:no 衣:i 愛:a 咲:saki 美:mi 帆:ho 沙:sa 紀:ki 夏:natsu
		矢:ya 秋:aki 尋:hiro 海:mi 穂:ho 織:ori 代:yo 緒:o 花:ka 希:ki
	`)},Dc=oc(`
	김:Kim 이:Lee 박:Park 최:Choi 정:Jung 강:Kang 조:Cho 윤:Yoon 장:Jang 임:Lim
	한:Han 오:Oh 서:Seo 신:Shin 권:Kwon 황:Hwang 안:Ahn 송:Song 류:Ryu 전:Jeon
	홍:Hong 고:Ko 문:Moon 양:Yang 손:Son 배:Bae 백:Baek 허:Heo 유:Yoo 남:Nam 심:Shim
	노:Noh 하:Ha 곽:Kwak 성:Sung 차:Cha 주:Joo 우:Woo 구:Koo 나:Na 민:Min 진:Jin
	지:Ji 엄:Um 채:Chae 원:Won 천:Chun 방:Bang 공:Kong 현:Hyun 함:Ham 변:Byun
	염:Yeom 여:Yeo 추:Chu 도:Do 소:So 석:Seok 선:Sun 마:Ma 표:Pyo 태:Tae 명:Myung
	기:Ki 반:Ban 왕:Wang 금:Geum 옥:Ok 육:Yook 인:In 맹:Maeng 제:Je 모:Mo 탁:Tak
	국:Kook
`),Fc={order:"family-first",joiner:"",hasMiddle:!1,roman:"hangul",lengthSpec:{given:[1,2],last:[1,1],middle:[0,0]},givenLenWeights:{1:4,2:92,3:4},lastWeights:Tt(`
		김:215 이:147 박:84 최:47 정:43 강:24 조:21 윤:21 장:20 임:17 오:14 한:14 신:13
		서:13 권:13 황:13 안:12 송:12 전:11 홍:11 유:10 고:9 문:9 양:8 손:8 배:8 백:7
		허:7 남:5 심:5 노:4 하:4 곽:4 성:4 차:4 주:4 우:4 구:4 진:3 지:3 엄:3 원:2 천:2
		방:2 공:2 현:2 함:2 변:2 채:2 민:2 나:2 류:2
	`),last:a(`
		김 이 박 최 정 강 조 윤 장 임 한 오 서 신 권 황 안 송 류 전 홍 고 문 양 손 배 백
		허 유 남 심 노 하 곽 성 차 주 우 구 나 민 진 지 엄 채 원 천 방 공 현 함 변 염 여
		추 도 소 석 선 마 표 태 명 기 반 왕 금 옥 육 인 맹 제 모 탁 국
	`),givenMale:a(`
		민준 서준 도윤 예준 시우 하준 주원 지호 지후 준우 준서 건우 현우 우진 선우 서진
		연우 유준 정우 승우 승현 시윤 지훈 진우 지환 수현 시현 동현 예성 재윤 은우 유찬
		이준 시온 재원 한결 태윤 승민 준혁 성민 지안 강민 재훈 민성 규민 도현 민재 재민
		성현 우성 태현 지성 준호 현준 형준 성준 정민 상현 진호 성호 종민 태호 재현 상우
		준영 동욱 정훈 영호 창민 대현 기현 승준 민수 영수 상민 경민 동주 승호 원준 호준
		세훈 지완 태민 정현 민혁 준수 상준 세준 이안 시원 재하 성우 동민 우빈 태우 진혁
		준현 성찬 예찬 은찬 도훈 시후 현수 정호 민호 종현 재준 우현 승재 태경 성재 규현
		동혁 상혁 인우 도영 하진 은성 재영 광수 종석 인호 승기 우재 지웅 다온 하람 준 현
		훈 빈 찬 진 결 온 솔 강 산 담 별 건 태준 도준 민우 재우 지운 성훈 시훈 은호 서호
		정후 도경 시환 재환 태영 상훈 병철 영철 성수 종수 재석 병수 동석 영진 상호 진성
		남준 형우 경훈 동훈 민규 승규 명수 광민 대호 기훈 우석 재호 준석 현석 영민 로운
		리안 유건 은결 진영 성용 종원 정욱 동건 근우 두호 호진 경수 상수 민태 태주 태하
		민석 이재 재성 재인 강훈 인규 남규 정남 순재 영우 우영 민건 인권 대겸 수호 준오
		강인 기찬 찬우 철민 철수 철규 광진 성광 가온 겨울 규빈 근호 기범 나윤 남우 노아
		다움 대윤 도하 두현 라온 로건 만호 명진 무진 문수 미르 바울 범수 별하 병호 보성
		봉수 산하 상엽 새벽 서강 석원 선호 성길 세빈 소한 수완 순호 슬찬 승윤 시목 신우
		아진 여울 연호 예강 온유 요한 우담 원석 유하 윤결
	`),givenFemale:a(`
		서연 서윤 지우 하은 하윤 민서 지유 윤서 채원 수아 지아 지안 다은 은서 예은 수빈
		소율 예린 지원 아린 서아 예원 유진 시은 하린 예진 지민 수연 유나 나윤 서영 은지
		지현 채은 서현 유주 지율 소은 나은 하영 다인 시아 연우 지수 가은 소연 세아 은채
		채영 다연 유빈 하늘 예서 소윤 서하 유하 다현 은하 아연 세은 채아 하연 나연 정연
		수현 예나 서인 지혜 아름 슬기 보라 유리 하나 다솜 영희 미영 은영 정희 지영 현정
		은주 미경 수진 혜진 경미 선영 소영 은정 미선 예지 승희 현주 은경 유정 소미 아윤
		서율 도연 세연 지선 은수 채린 다희 시연 예솔 나현 주하 서희 민지 수민 지은 혜원
		다빈 유은 하진 소희 예빈 태연 나래 미주 솔 별 봄 온 결 린 슬 담 진 윤 이서 서은
		지윤 예윤 하율 시율 다율 채윤 아라 시하 은유 서우 라온 아율 지효 세희 유선 소현
		미현 은혜 영숙 미숙 미란 혜경 혜영 혜선 수경 은미 정미 나영 다영 소정 예림 유림
		아영 소혜 가연 도희 서정 유미 진아 선희 경아 은아 지연 소진 예슬 하빈 서빈 채연
		소민 주연 연아 민아 민주 연지 소유 수희 희수 희연 연희 승아 나라 가현 수지 나리
		수미 정아 채민 라희 종서 현아 현서 연주 동은 은숙 명숙 명서 명선 성연 이현 미연
		미희 가람 가온 겨울 나비 나울 노을 다랑 다올 도담 도아 라윤 로하 마루 미르 미소
		바다 바람 별하 보름 봄솔 사랑 새롬 새봄 서담 소담 소라 솔비 송이 수리 슬아 시내
		아리 여울 오름 온새 우람 윤슬 은별 이든 이슬 자람 조은 초록 하람 한별 해솔
	`),firstMale:a(`
		민 서 준 도 예 시 하 지 현 우 건 선 유 정 승 태 재 성 동 진 상 영 수 주 강 규 인
		경 한 세 원 찬 은 광 종 창 기 병 대 호 남 형 근 명 이 철
	`),restMale:a(`
		준 우 훈 호 윤 혁 원 재 민 현 수 진 석 철 규 빈 성 한 찬 열 영 헌 겸 익 록 담 결
		완 경 환 후 식 용 일 태 하
	`),firstFemale:a(`
		서 지 하 민 윤 채 수 예 다 은 소 유 시 아 나 가 정 미 주 세 혜 리 보 승 연 도 한
		라 이 경 선 영 진 현 희 명
	`),restFemale:a(`
		연 윤 우 은 서 유 아 원 율 린 빈 진 하 영 지 희 나 슬 미 경 정 담 별 혜 효 림 라
		현
	`)},Rc={order:"given-first",joiner:" ",hasMiddle:!0,roman:"translit",lengthSpec:{given:[3,11],last:[4,11],middle:[5,14]},last:a(`
		Иванов Смирнов Кузнецов Попов Соколов Лебедев Козлов Новиков Морозов Петров
		Волков Соловьёв Васильев Зайцев Павлов Семёнов Голубев Виноградов Богданов
		Воробьёв Фёдоров Михайлов Беляев Тарасов Белов Комаров Орлов Киселёв Макаров
		Андреев Ковалёв Ильин Гусев Титов Кузьмин Баранов Куликов Алексеев Степанов
		Яковлев Сорокин Романов Захаров Королёв Никитин Пахомов Родионов Савельев
		Селезнёв Сергеев Сидоров Тимофеев Трофимов Фомин Фролов Харитонов Цветков
		Черкасов Чернов Шестаков Широков Щербаков Юдин Ершов Афанасьев Блинов Бобров
		Веселов Владимиров Воронов Герасимов Горбунов Громов Гуляев Данилов Дементьев
		Дорофеев Емельянов Жуков Журавлёв Зимин Зуев Игнатов Исаев Калинин Карпов
		Кириллов Кондратьев Крылов Лазарев Логинов Лукин Медведев Мельников
	`),male:a(`
		Александр Дмитрий Максим Сергей Андрей Алексей Иван Михаил Никита Артём Егор
		Кирилл Роман Владимир Павел Денис Николай Илья Владислав Тимофей Евгений Антон
		Виктор Юрий Олег Григорий Фёдор Константин Пётр Степан Матвей Арсений Даниил
		Глеб Ярослав Захар Богдан Вадим Леонид Борис Анатолий Василий Семён Игорь
		Вячеслав Аркадий Афанасий Валерий Вениамин Виталий Гавриил Геннадий Герман Давид
		Демьян Дорофей Ефим Игнат Иннокентий Кузьма Лев Макар Марк Мирон Мстислав Наум
		Нестор Никанор Оскар Прохор Радислав Ратмир Ростислав Рудольф Савелий Святослав
		Спартак Тарас Тихон Трофим Устин Филипп Харитон Эдуард Эрик Юлиан Яков Аким
		Валентин Гордей Елисей Лаврентий Панкрат Северин Феликс
	`),female:a(`
		Анастасия Мария Дарья Анна Елена Ольга Наталья Екатерина Виктория Полина София
		Юлия Ксения Александра Татьяна Ирина Валерия Вера Надежда Людмила Светлана
		Галина Елизавета Марина Оксана Кристина Алиса Ева Милана Варвара Софья Арина
		Вероника Диана Алина Кира Маргарита Нина Лариса Тамара Евгения Инна Лидия
		Антонина Валентина Агата Аглая Ада Аделина Азалия Албина Алла Амелия Ангелина
		Аполлинария Белла Богдана Василиса Виолетта Владислава Глафира Дана Дина
		Доминика Ефросинья Жанна Земфира Злата Зоя Иванна Изабелла Илона Инга Иоланта
		Капитолина Клавдия Лада Лана Лика Луиза Любовь Малика Марта Матрёна Мелания Мила
		Мирослава Нелли Ника Нонна Олеся Прасковья Раиса Регина
	`),middleMale:a(`
		Александрович Дмитриевич Сергеевич Иванович Петрович Андреевич Михайлович
		Николаевич Владимирович Алексеевич Максимович Романович Викторович Павлович
		Борисович Денисович Тимофеевич Егорович Анатольевич Аркадьевич Артёмович
		Богданович Вадимович Валентинович Васильевич Вячеславович Геннадьевич Георгиевич
		Григорьевич Даниилович Евгеньевич Захарович Игоревич Ильич Кириллович
		Константинович Леонидович Макарович Матвеевич Никитич Олегович Русланович
		Святославович Семёнович Станиславович Степанович Фёдорович Юрьевич
	`),middleFemale:a(`
		Александровна Дмитриевна Сергеевна Ивановна Петровна Андреевна Михайловна
		Николаевна Владимировна Алексеевна Максимовна Романовна Викторовна Павловна
		Борисовна Денисовна Тимофеевна Егоровна Анатольевна Аркадьевна Артёмовна
		Богдановна Вадимовна Валентиновна Васильевна Вячеславовна Геннадьевна Георгиевна
		Григорьевна Данииловна Евгеньевна Захаровна Игоревна Ильинична Кирилловна
		Константиновна Леонидовна Макаровна Матвеевна Никитична Олеговна Руслановна
		Святославовна Семёновна Станиславовна Степановна Фёдоровна Юрьевна
	`),syn:xc},Vc={order:"family-first",joiner:" ",hasMiddle:!0,roman:"fold",lengthSpec:{given:[1,6],last:[2,6],middle:[2,6]},lastWeights:Tt(`
		Nguyễn:380 Trần:110 Lê:95 Phạm:71 Phan:45 Hoàng:34 Vũ:26 Đặng:21 Bùi:20 Huỳnh:17
		Đỗ:14 Hồ:13 Ngô:13 Võ:13 Dương:10 Lý:5 Trương:5 Đinh:4 Trịnh:3 Đoàn:3 Lâm:3
	`),last:a(`
		Nguyễn Trần Lê Phạm Hoàng Huỳnh Phan Vũ Võ Đặng Bùi Đỗ Hồ Ngô Dương Lý Đinh
		Trịnh Đoàn Lâm Trương Tô Cao Chu Tạ Vương Phùng Tống Triệu Lưu Lương Mai Đào Hà
		Quách Thái Bành Đàm Nghiêm Kiều Giang Diệp Lại Uông Chử Sái Khổng Mạc Nhâm Ông
		Quản Sầm Tăng Thân Từ Ứng Viên Xa Yên Bạch Châu Cù Doãn Hứa Khương Lục Ninh Phí
		Quang
	`),male:a(`
		An Bình Cường Dũng Đạt Hải Hùng Khôi Long Minh Nam Phúc Quân Sơn Tuấn Việt Bảo
		Khánh Trung Thắng Duy Kiên Lâm Nghĩa Phong Hiếu Huy Đức Thành Tùng Khang Toàn
		Trí Tú Vinh Nguyên Kiệt Đăng Hưng Thịnh Anh Bách Chiến Chương Đại Danh Dương
		Giang Hà Hiển Hoàng Hưởng Khải Khoa Kỳ Lộc Lợi Luân Lương Mạnh Nghị Ngọc Nhân
		Nhật Phát Quang Quốc Sang Sinh Sỹ Tài Tâm Tân Thái Thiện Thông Thuận Tiến Tín
		Trọng Trường Tuân Tuyên Văn Vĩnh Vượng Xuân Ý Hòa
	`),female:a(`
		Anh Chi Dung Hà Hoa Hương Lan Linh Mai Ngọc Nhung Phương Quỳnh Thảo Trang Uyên
		Vân Yến Hạnh Ngân Diệp Giang Loan My Thu Trâm Nhi Như Vy Tuyết Trinh Hiền Huyền
		Nga Oanh Phượng Thúy Tiên Hằng Châu Ái Bích Cẩm Châm Chinh Dao Diễm Diệu Đào Hạ
		Hân Hoài Hồng Huệ Hường Khanh Khuê Kiều Lam Lệ Liên Liễu Ly Mận Mỹ Nguyệt Nhàn
		Phụng Quyên Quyền Sương Tâm Thắm Thanh Thủy Trà Trúc Tuyền Vi Xuân Yên Ánh Bảo
	`),middleMale:a(`
		Văn Hữu Đức Minh Quang Thành Xuân Bá Công Trọng Quốc Nhật Chí Đình Thế Anh Bảo
		Duy Gia Hoàng Hùng Khắc Khánh Mạnh Ngọc Phú Phước Quý Sỹ Tấn Thái Thiên Trung
		Tuấn Việt
	`),middleFemale:a(`
		Thị Ngọc Thanh Thu Kim Hồng Mỹ Diễm Bích Phương Thùy Cẩm Ánh Nhã Hoài Bảo Chi
		Diệu Đan Giang Hà Hải Hạnh Huyền Khánh Lan Linh Mai Minh Như Quỳnh Thảo Tuyết
		Yến
	`),syn:Ac},qc={order:"family-first",joiner:"",hasMiddle:!1,roman:"token",lengthSpec:{given:[1,2],last:[1,1],middle:[0,0]},givenLenWeights:{1:45,2:55},lastWeights:Tt(`
		王:79 李:79 张:71 刘:54 陈:45 杨:31 黄:22 赵:21 吴:21 周:20 徐:17 孙:15 马:14
		胡:13 朱:13 高:12 林:12 何:12 郭:12 郑:9 罗:9 梁:9 宋:8 谢:8 韩:7 唐:7 冯:6 曹:6
		萧:5 袁:5 邓:5 曾:5 彭:5 苏:5 蒋:5 蔡:5 于:4 董:4 程:4 沈:4 丁:4 魏:4 叶:4 傅:2
		薛:2
	`),last:ie(`
		王:Wang 李:Li 张:Zhang 刘:Liu 陈:Chen 杨:Yang 赵:Zhao 黄:Huang 周:Zhou 吴:Wu
		徐:Xu 孙:Sun 胡:Hu 朱:Zhu 高:Gao 林:Lin 何:He 郭:Guo 马:Ma 罗:Luo 梁:Liang
		宋:Song 郑:Zheng 谢:Xie 韩:Han 唐:Tang 冯:Feng 于:Yu 董:Dong 萧:Xiao 程:Cheng
		曹:Cao 袁:Yuan 邓:Deng 傅:Fu 沈:Shen 曾:Zeng 彭:Peng 苏:Su 蒋:Jiang 蔡:Cai
		丁:Ding 魏:Wei 薛:Xue 叶:Ye 潘:Pan 杜:Du 戴:Dai 夏:Xia 钟:Zhong 汪:Wang 田:Tian
		任:Ren 姜:Jiang 范:Fan 方:Fang 石:Shi 姚:Yao 谭:Tan 廖:Liao 邹:Zou 熊:Xiong
		金:Jin 陆:Lu 郝:Hao 孔:Kong 白:Bai 崔:Cui 康:Kang 毛:Mao 邱:Qiu 秦:Qin 江:Jiang
		史:Shi 顾:Gu 侯:Hou 邵:Shao 孟:Meng 龙:Long 万:Wan 段:Duan 钱:Qian 汤:Tang
		尹:Yin 易:Yi 常:Chang 乔:Qiao 赖:Lai 龚:Gong 文:Wen 武:Wu 贺:He 黎:Li 余:Yu
		卢:Lu
	`),givenMale:ie(`
		奕辰:Yichen 宇轩:Yuxuan 浩宇:Haoyu 子墨:Zimo 宇航:Yuhang 浩然:Haoran 梓豪:Zihao
		子轩:Zixuan 俊杰:Junjie 志强:Zhiqiang 建国:Jianguo 建军:Jianjun 志明:Zhiming
		家豪:Jiahao 泽宇:Zeyu 雨泽:Yuze 思远:Siyuan 文博:Wenbo 国强:Guoqiang
		晓明:Xiaoming 伟:Wei 强:Qiang 磊:Lei 军:Jun 洋:Yang 勇:Yong 杰:Jie 涛:Tao
		明:Ming 超:Chao 刚:Gang 平:Ping 辉:Hui 鹏:Peng 斌:Bin 波:Bo 峰:Feng 健:Jian
		龙:Long 亮:Liang 伟强:Weiqiang 建华:Jianhua 志伟:Zhiwei 海涛:Haitao 立军:Lijun
		春林:Chunlin 国华:Guohua 建平:Jianping 永强:Yongqiang 卫东:Weidong 建斌:Jianbin
		志刚:Zhigang 天佑:Tianyou 皓宇:Haoyu 铭轩:Mingxuan 承轩:Chengxuan 睿轩:Ruixuan
		泽楷:Zekai 嘉豪:Jiahao 俊熙:Junxi 明轩:Mingxuan 子航:Zihang 雨轩:Yuxuan
		佳明:Jiaming 振华:Zhenhua 建强:Jianqiang 学军:Xuejun 兴国:Xingguo 立新:Lixin
		红兵:Hongbing 岩:Yan 帆:Fan 睿:Rui 楷:Kai 骏:Jun 珩:Heng 澈:Che 屹:Yi
	`),givenFemale:ie(`
		一诺:Yinuo 欣怡:Xinyi 梓涵:Zihan 语桐:Yutong 欣妍:Xinyan 可欣:Kexin 梦瑶:Mengyao
		诗涵:Shihan 若曦:Ruoxi 佳怡:Jiayi 梓萱:Zixuan 雅婷:Yating 思琪:Siqi 秀英:Xiuying
		桂英:Guiying 秀兰:Xiulan 淑芬:Shufen 丽娟:Lijuan 春梅:Chunmei 晓燕:Xiaoyan
		芳:Fang 娜:Na 敏:Min 静:Jing 丽:Li 娟:Juan 燕:Yan 霞:Xia 秀:Xiu 英:Ying 玲:Ling
		艳:Yan 梅:Mei 兰:Lan 红:Hong 萍:Ping 慧:Hui 洁:Jie 颖:Ying 婷:Ting 丽华:Lihua
		秀珍:Xiuzhen 桂芳:Guifang 淑珍:Shuzhen 玉兰:Yulan 秀梅:Xiumei 金花:Jinhua
		桂香:Guixiang 秀云:Xiuyun 玉珍:Yuzhen 春花:Chunhua 秀芳:Xiufang 思彤:Sitong
		雨萱:Yuxuan 若涵:Ruohan 依诺:Yinuo 语嫣:Yuyan 沐辰:Muchen 芷若:Zhiruo 雨薇:Yuwei
		心怡:Xinyi 佳琪:Jiaqi 梦洁:Mengjie 婉清:Wanqing 淑华:Shuhua 桂珍:Guizhen
		秀清:Xiuqing 玉华:Yuhua 春兰:Chunlan 素芬:Sufen 薇:Wei 涵:Han 彤:Tong 萱:Xuan
		珊:Shan 蓉:Rong 岚:Lan 淇:Qi 妍:Yan
	`),firstMale:ie(`
		伟:wei 强:qiang 磊:lei 军:jun 洋:yang 勇:yong 杰:jie 涛:tao 明:ming 超:chao
		浩:hao 宇:yu 泽:ze 鑫:xin 鹏:peng 博:bo 文:wen 建:jian 俊:jun 志:zhi 天:tian
		子:zi 海:hai 立:li 春:chun 国:guo 永:yong 卫:wei 振:zhen 学:xue 兴:xing 红:hong
		皓:hao 铭:ming 承:cheng 睿:rui 嘉:jia
	`),restMale:ie(`
		然:ran 轩:xuan 宇:yu 杰:jie 豪:hao 文:wen 华:hua 强:qiang 明:ming 峰:feng 涛:tao
		伟:wei 龙:long 飞:fei 鹏:peng 阳:yang 波:bo 军:jun 林:lin 平:ping 斌:bin 刚:gang
		佑:you 楷:kai 熙:xi 航:hang 新:xin 兵:bing 国:guo
	`),firstFemale:ie(`
		芳:fang 娜:na 敏:min 静:jing 丽:li 娟:juan 燕:yan 婷:ting 雅:ya 欣:xin 怡:yi
		梓:zi 诗:shi 雨:yu 思:si 佳:jia 玲:ling 美:mei 婉:wan 雪:xue 琳:lin 晓:xiao
		秀:xiu 桂:gui 淑:shu 玉:yu 金:jin 春:chun 若:ruo 依:yi 语:yu 沐:mu 芷:zhi 心:xin
		梦:meng 素:su 薇:wei
	`),restFemale:ie(`
		婷:ting 怡:yi 涵:han 欣:xin 颖:ying 玲:ling 丽:li 娜:na 雅:ya 云:yun 洁:jie
		琳:lin 悦:yue 华:hua 芳:fang 敏:min 梦:meng 瑶:yao 珍:zhen 兰:lan 梅:mei 花:hua
		香:xiang 彤:tong 萱:xuan 诺:nuo 嫣:yan 辰:chen 若:ruo 琪:qi 清:qing 芬:fen
	`)},Bt=["en","ko","ja","zh","it","de","ru","es","vi"],Ht={en:Hc,ko:Fc,ja:$c,zh:qc,it:Ec,de:Bc,ru:Rc,es:Nc,vi:Vc};function Nt(e="all",n=!0,t=!1){const o=e==="all"?Bt:[e];let i=1/0,r=0;for(const l of o){const m=Ht[l],{given:c,last:h,middle:d}=m.lengthSpec;let b=c[0],y=c[1];n&&(b+=h[0]+m.joiner.length,y+=h[1]+m.joiner.length),t&&m.hasMiddle&&(b+=d[0]+m.joiner.length,y+=d[1]+m.joiner.length),i=Math.min(i,b),r=Math.max(r,y)}return[se(i,_e,Oe),se(r,_e,Oe)]}function Gc(e="all"){var n;return e==="all"?!0:!!((n=Ht[e])!=null&&n.hasMiddle)}const Wc=new RegExp("\\p{Diacritic}","gu");function Oc(e){return e.normalize("NFD").replace(Wc,"").replace(/đ/g,"d").replace(/Đ/g,"D").replace(/ß/g,"ss")}const Kc={а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"};function Ic(e){let n="";for(const t of e){const o=t.toLowerCase(),i=Kc[o]??t;n+=t===o?i:Ke(i)}return n}const ha=44032,Jc=55203,Uc=["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"],Yc=["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"],Sn=["","k","k","k","n","n","n","t","l","k","m","l","l","l","p","l","m","p","p","t","t","ng","t","t","k","t","p","t"],Zc=[["",""],["","g"],["","kk"],["k","s"],["","n"],["n","j"],["","n"],["","d"],["","r"],["l","g"],["l","m"],["l","b"],["l","s"],["l","t"],["l","p"],["","r"],["","m"],["","b"],["p","s"],["","s"],["","ss"],["ng",""],["","j"],["","ch"],["","k"],["","t"],["","p"],["",""]],ga=2,Qc=5,Xc=6,eu=11,pa=new Set([1,2,3,9,24]),ba=new Set([7,19,20,22,23,25,27]),va=new Set([14,17,18,26]),_a=new Set([8,11,12,13,15]),nu=new Set([10,16,21]),ya={6:"n",15:"l",27:""},ka={0:"k",3:"t",9:"ss",12:"ch"};function tu(e){const n=e.codePointAt(0)??0;if(n<ha||n>Jc)return null;const t=n-ha;return{onset:Math.floor(t/588),nucleus:Math.floor(t%588/28),coda:t%28}}function au(e,n){if(e===0)return["",null];if(!n)return[Sn[e],null];const t=n.onset;if(t===eu){const[o,i]=Zc[e];return[o,i]}if(e in ya&&t in ka)return[ya[e],ka[t]];if(t===ga||t===Xc)return pa.has(e)?["ng",null]:ba.has(e)?["n",null]:va.has(e)?["m",null]:_a.has(e)&&t===ga?["l","l"]:[Sn[e],null];if(t===Qc){if(_a.has(e))return["l","l"];if(e===4)return["l","l"];if(pa.has(e))return["ng","n"];if(ba.has(e))return["n","n"];if(va.has(e))return["m","n"];if(nu.has(e))return[Sn[e],"n"]}return[Sn[e],null]}function st(e){const n=[...e],t=n.map(tu);let o="",i=null;for(let r=0;r<n.length;r+=1){const l=t[r];if(!l){o+=n[r],i=null;continue}const[m,c]=au(l.coda,t[r+1]??null);o+=(i??Uc[l.onset])+Yc[l.nucleus]+m,i=c}return o}function Fn(e,n,t){switch(e){case"fold":return Oc(n);case"translit":return Ic(n);case"hangul":return t==="surname"?Dc[n]??Ke(st(n)):Ke(st(n));case"token":default:return n}}const ou=12,iu=40,ru=1,fe=e=>typeof e=="string"?e:e.n;function Et(e,n){const t=n.toLowerCase();return e.filter(o=>fe(o).toLowerCase().startsWith(t))}function Sa(e){const n=e.map(t=>fe(t).length);return[Math.min(...n),Math.max(...n)]}function mt(e,n,t){return e<n?n-e:e>t?e-t+.5:0}function lu(e,n,t){const o=l=>mt(fe(l).length,n,t),i=e.filter(l=>o(l)===0);if(i.length)return i;const r=Math.min(...e.map(o));return e.filter(l=>o(l)===r)}function Yn(e,n,t,o){return n?lu(e,n[0]-t-o[1],n[1]-t-o[0]):e}function io(e,n,t){const o=t==="surname"?n.lastWeights:void 0;return o?Pn(e,i=>o[fe(i)]??ru):J(e)}function Ge(e,n,t){const o=io(e,n,t);return typeof o!="string"?{n:o.n,r:o.r}:{n:o,r:Fn(n.roman,o,t)}}function su(e,n){const t=Ce(e.minSyllables,e.maxSyllables);let o="";for(let i=0;i<t;i+=1)o+=(i===0&&n?n.toLowerCase():J(e.onset))+J(e.vowel),i===t-1&&(o+=J(e.coda));return Ke(o)}function ct(e,n){const t=su(e.syn,n);return{n:t,r:Fn(e.roman,t,"given")}}function ut(e,n,t,o){const i=Et(n,o);return i.length?Ge(i,e,t):e.syn?ct(e,o):{n:o,r:Fn(e.roman,o,t)}}function mu(e,n,t,o){const i=n?e.firstMale:e.firstFemale,r=n?e.restMale:e.restFemale,l=o?Et(i,o):i,m=[l.length?J(l):o];for(let d=1;d<t;d+=1){let b=J(r);for(let y=0;y<3&&fe(b)===fe(m[m.length-1]);y+=1)b=J(r);m.push(b)}const c=m.map(fe).join("");if(e.roman==="hangul")return{n:c,r:Ke(st(c))};const h=m.map(d=>typeof d=="string"?d:d.r).join("");return{n:c,r:Ke(h)}}function cu(e,n,t,o,i){const r=n?e.givenMale:e.givenFemale;if(!r)return null;let l=r.filter(d=>{const b=fe(d).length;return b>=t&&b<=o});if(i&&(l=Et(l,i)),!l.length)return null;const m=new Set(l.map(d=>fe(d).length)),c=ro(e,t,o,m),h=l.filter(d=>fe(d).length===c);return Ge(h.length?h:l,e,"given")}function ro(e,n,t,o){const i=e.givenLenWeights;if(i){const r=!o&&t>Math.max(...Object.keys(i).map(Number)),l=[];for(let c=n;c<=t;c+=1){if(o&&!o.has(c))continue;const h=i[c]??0,d=r?Math.max(h,iu):h;d>0&&l.push([c,d])}if(!l.length&&o)for(const c of o)l.push([c,1]);const m=l.reduce((c,[,h])=>c+h,0);if(m>0){let c=Math.random()*m;for(const[h,d]of l)if(c-=d,c<=0)return h}}return se(2,n,t)}function Ze(e,n){const o=(e.order==="family-first"?[n.surname,...n.middles,n.given]:[n.given,...n.middles,n.surname]).filter(i=>!!i);return{n:o.map(i=>i.n).join(e.joiner),r:o.map(i=>i.r).join(" ")}}function lo(e,n){return e.order==="family-first"&&n}function uu(e,n,t,o,i){const{prefix:r}=n,l=lo(e,n.includeSurname);let m=null;n.includeSurname&&(m=l?ut(e,e.last,"surname",r):Ge(e.last,e,"surname"));let c=m?m.n.length:0,h=Math.max(1,o-c),d=i-c;d<h&&m&&(m=null,c=0,h=Math.max(1,o),d=Math.max(h,i)),d=Math.max(h,d);const b=l?"":r,y=()=>{if(!ze(n.invent)){const M=cu(e,t,h,d,b);if(M)return M}return mu(e,t,ro(e,h,d),b)};let S=y();for(let M=0;M<4&&m&&S.n.startsWith(m.n);M+=1)S=y();return Ze(e,{given:S,surname:m,middles:[]})}function du(e){return e.endsWith("ский")?`${e.slice(0,-2)}ая`:e.endsWith("ой")?`${e.slice(0,-2)}ая`:/[оеё]в$|ин$|ын$/.test(e)?`${e}а`:e}function wa(e,n,t,o=null){const i=t?e.male:e.female,r=n.includeMiddleName&&e.hasMiddle?t?e.middleMale??i:e.middleFemale??i:null,l=lo(e,n.includeSurname),m=l?"":n.prefix,c=o?0:n.invent,h=o?(n.includeSurname?e.joiner.length:0)+(r?e.joiner.length:0):0,d=o&&n.includeSurname?Sa(e.last):[0,0],b=o&&r?Sa(r):[0,0],y=n.includeSurname&&e.roman==="translit"&&!t?1:0;let S;if(e.syn&&ze(c))S=ct(e,m||void 0);else{const j=Yn(i,o,h+y,[d[0]+b[0],d[1]+b[1]]);S=m?ut(e,j,"given",m):Ge(j,e,"given")}let M=null;if(n.includeSurname){const j=l?n.prefix:"",B=Yn(e.last,o,h+S.n.length+y,b);if(e.syn&&ze(c))M=ct(e,j||void 0);else if(j)M=ut(e,B,"surname",j);else{let E=fe(io(B,e,"surname"));e.roman==="translit"&&!t&&(E=du(E)),M={n:E,r:Fn(e.roman,E,"surname")}}}const _=[];if(r){const j=h+S.n.length+(M?M.n.length:0),B=Yn(r,o,j,[0,0]);let E=Ge(B,e,"given");for(let H=0;H<4&&E.n===S.n;H+=1)E=Ge(B,e,"given");_.push(E)}return{given:S,surname:M,middles:_}}function fu(e,n,t,o,i){let r=null,l=1/0;for(let b=0;b<ou;b+=1){const y=wa(e,n,t),S=Ze(e,y).n.length;if(S>=o&&S<=i)return Ze(e,y);const M=mt(S,o,i);M<l&&(l=M,r=y)}let m=r;const c=wa(e,n,t,[o,i]);mt(Ze(e,c).n.length,o,i)<l&&(m=c);const h=t?e.male:e.female,d=new Set([m.given.n,...m.middles.map(b=>b.n)]);for(let b=0;b<16;b+=1){const y=Ze(e,m).n.length;if(y>=o)break;const S=i-y-e.joiner.length,M=h.filter(B=>fe(B).length<=S);if(!M.length)break;const _=M.filter(B=>!d.has(fe(B))),j=Ge(_.length?_:M,e,"given");d.add(j.n),m.middles.push(j)}return Ze(e,m)}function hu(e,n){const[t,o]=Nt(e,n.includeSurname,n.includeMiddleName);return En(n.minLength,n.maxLength,t,o)}function so(e,n){const t=Ht[e],o=n.gender==="all"?Math.random()<.5?"male":"female":n.gender,i=o==="male",[r,l]=hu(e,n),m=t.joiner===""?uu(t,n,i,r,l):fu(t,n,i,r,l);return{native:m.n,roman:m.r,language:e,gender:o}}function mo(e){return{gender:e.gender??"all",includeSurname:e.includeSurname??!0,includeMiddleName:e.includeMiddleName??!1,minLength:Ne(e.minLength),maxLength:Ne(e.maxLength),invent:fn(e.realism),prefix:dn(e.startsWith)}}function gu(e,n={}){return so(e,mo(n))}function pu(e={}){const n=e.language??"all",t=mo(e);return $n(e,()=>so(hn(n,Bt),t),o=>o.native)}function Ma(e={}){const n=pu(e);if(e.output==="detail")return n;const t=e.script??"native";return n.map(o=>t==="roman"?o.roman:o.native)}const bu=12;function vu(e){return e.theme!=="all"||e.loose?Pt(e.theme):le.filter(n=>!hc.includes(n))}function co(e,n){return n==="none"?e.slots.every(t=>t==="noun"):e.slots.some(t=>n.includes(t))}function _u(e,n){const t=n.slots;if(t==="all")return e.frames;const o=e.frames.filter(i=>co(i,t));return o.length?o:e.frames}function yu(e,n){const t=n.slots;return t==="all"||e.frames.some(o=>co(o,t))}function ku(e){if(e.slots==="all")return ce;const n=ce.filter(t=>yu(ge[t],e));return n.length?n:ce}function Rn(e,n){return n.separator??e.joiner}const ja=new Map;function uo(e,n,t){const o=`${e}:${t}`,i=ja.get(o);if(i)return i;const r={adjective:de(n.adjectives),action:de(n.actions),noun:de(n.nouns[t]),part:de(n.parts??[])};return ja.set(o,r),r}function dt(e,n,t){var o,i;return n===0?0:(((i=(o=e.glue)==null?void 0:o[n-1])==null?void 0:i.length)??0)+t}function $t(e,n,t){let o=0,i=0;for(let r=0;r<e.slots.length;r+=1){const l=dt(e,r,t);o+=l+n[e.slots[r]][0],i+=l+n[e.slots[r]][1]}return[o,i]}function Su(e){const n=e.reduce((o,i)=>o+i.weight,0);let t=Math.random()*n;for(const o of e)if(t-=o.weight,t<=0)return o;return e[e.length-1]}function wu(e,n,t){switch(n){case"adjective":return e.adjectives;case"action":return e.actions;case"part":return e.parts;default:return t}}function Mu(e,n,t){var i;let o="";for(let r=0;r<e.length;r+=1)o+=(r===0?"":(((i=n.glue)==null?void 0:i[r-1])??"")+t)+e[r];return o}function ju(e,n,t,o,i,r,l){const m=Rn(e,i).length,c=[],h=n.slots.indexOf("noun"),d=e.agreement&&h>0?ln(e,o,i.invent,t.noun[0],t.noun[1],""):null,b=_=>d&&_===h?[d.word.length,d.word.length]:t[n.slots[_]];let y=d?rn(e,d.word):void 0,S=!1,M=0;for(let _=0;_<n.slots.length;_+=1){const j=dt(n,_,m);let B=0,E=0;for(let q=_+1;q<n.slots.length;q+=1){const Q=dt(n,q,m);B+=b(q)[0]+Q,E+=b(q)[1]+Q}const H=Math.max(1,r-M-j-E),I=Math.max(H,l-M-j-B),ee=n.slots[_],$=wu(e,ee,o),K=d&&_===h?d:ln(e,$,i.invent,H,I,_===0?i.prefix:""),U=ee==="noun"?K.word:gn(e,K.word,y);ee==="noun"&&!d&&(y=rn(e,K.word)),S=S||K.missed,M+=j+U.length,c.push(U)}return{words:c,missed:S}}function Lu(e,n){var t;for(let o=1;o<e.length;o+=1)if(!((t=n.glue)!=null&&t[o-1])&&e[o-1].slice(-1)===e[o].charAt(0))return!0;return!1}function Cu(e,n,t,o){const i=Rn(e,o).length;let r=1/0,l=0;for(const m of n){const[c,h]=$t(m,t,i);r=Math.min(r,c),l=Math.max(l,h)}return En(o.minLength,o.maxLength,r,l)}function zu(e,n){const t=ge[e],i=Rn(t,{separator:n}).length;let r=1/0,l=0;for(const m of le){const c=uo(e,t,m);for(const h of t.frames){const[d,b]=$t(h,c,i);r=Math.min(r,d),l=Math.max(l,b)}}return[r,l]}function Tu(e,n){const t=ge[e],o=vu(n),i=_u(t,n),r=Rn(t,n);let l=null,m=1/0;for(let c=0;c<bu;c+=1){const h=J(o),d=t.nouns[h],b=uo(e,t,h),[y,S]=Cu(t,i,b,n),M=i.filter(K=>{const[U,q]=$t(K,b,r.length);return q>=y&&U<=S}),_=Su(M.length?M:i),{words:j,missed:B}=ju(t,_,b,d,n,y,S),E=j[_.slots.indexOf("noun")],H=Mu(j,_,r),I={words:j,slots:[..._.slots],nickname:H,theme:d.includes(E)?h:xt(t,E)},ee=B||!r&&!t.capitalize&&Lu(j,_);if(H.length>=y&&H.length<=S&&!ee)return I;const $=(H.length<y?y-H.length:Math.max(0,H.length-S))+(ee?1:0);$<m&&(m=$,l=I)}return l}function Pu(e){if(e===void 0)return"all";if(e==="all"||e==="none")return e;const n=typeof e=="string"?[e]:e;return n.length?n:"none"}function xu(e){return{theme:e.theme??"all",slots:Pu(e.slots),invent:fn(e.realism),loose:(e.realism??"real")!=="real",minLength:Ne(e.minLength),maxLength:Ne(e.maxLength),prefix:dn(e.startsWith),separator:e.wordSeparator}}function Au(e={}){const n=xu(e),t=e.language??"all";return $n(e,()=>{const o=hn(t,ku(n)),{words:i,slots:r,nickname:l,theme:m}=Tu(o,n);return{nickname:l,words:i,slots:r,language:o,theme:m}},o=>o.nickname)}function Bu(e="all",n){const t=e==="all"?ce:[e];let o=1/0,i=0;for(const r of t){const[l,m]=zu(r,n);o=Math.min(o,l),i=Math.max(i,m)}return[se(o,_e,Oe),se(i,_e,Oe)]}function La(e={}){const n=Au(e);return e.output==="detail"?n:n.map(t=>t.nickname)}const Hu={space:" ",capitalize:!0,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["„","“"],single:["‚","‘"]},articles:{m:[["","ein"]],f:[["","eine"]],n:[["","ein"]]},predicateAgrees:!1,verbs:[{subject:["creature","person"],words:a(`
				läuft geht springt schwimmt fliegt kriecht ruht schläft lacht weint singt tanzt
				wartet steht sitzt rollt wandert lauscht zögert eilt
			`)},{subject:["place","event"],words:a("leuchtet fließt dunkelt erhellt vertieft verstummt")},{subject:["thing","vehicle"],words:a("schwankt glänzt fällt rollt neigt altert")},{subject:["vehicle"],words:a("fährt hält rollt wendet gleitet")},{subject:["idea","event"],words:a("wächst verschwindet bleibt schwebt vertieft")},{subject:["plant"],words:a("wächst welkt blüht schwankt sprießt")},{subject:["body"],words:a("zittert bebt erstarrt heilt")},{subject:["edible"],words:a("reift kühlt kocht schmilzt verdirbt")}],states:[{subject:["creature","person"],words:a("groß klein schnell langsam still laut mutig faul müde hungrig sanft klug wild")},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("schön fremd neu häufig selten")},{subject:["place","event"],words:a("weit eng ruhig tief dunkel hell fern steil")},{subject:["thing","vehicle"],words:a("hart leicht schwer alt glatt klar stabil")},{subject:["edible"],words:a("süß salzig scharf sauer heiß kalt herzhaft")},{subject:["idea"],words:a("einfach deutlich vage ewig flüchtig")},{subject:["plant"],words:a("grün üppig duftend welk")},{subject:["body"],words:a("warm kalt wund steif")}],manners:a(`
		leise langsam schnell sanft plötzlich kaum wieder gemeinsam allein noch kurz stetig kühn sorgsam
		eifrig ruhig heftig geduldig leicht fröhlich munter schwerfällig deutlich gelassen emsig zügig
	`),times:a(`
		bei_Tagesanbruch am_Morgen am_Mittag am_Abend in_der_Nacht heute gestern morgen im_Frühling
		im_Sommer im_Herbst im_Winter am_Wochenende gerade_eben manchmal jeden_Tag in_der_Dämmerung
		um_Mitternacht letzte_Woche nächste_Woche heutzutage vor_langer_Zeit an_Feiertagen
		den_ganzen_Tag jede_Nacht
	`),connectives:{additive:a("und oder"),contrastive:a("aber doch"),causal:a("denn")},interjections:a(`
		oh, ach, na, mensch, oje, sieh_an, wahrhaftig, hui, herrje, du_meine_Güte, nanu,
	`),pronouns:{m:a("er"),f:a("sie"),n:a("es")},calendar:{date:"D. MMMM Y",months:a(`
			Januar Februar März April Mai Juni Juli August September Oktober November Dezember
		`),clock:"h:mm Uhr",years:[2020,2030],copula:{subject:["event"],words:a("ist")}},frames:[{parts:[{slot:"date",head:"am"},{slot:"verb"},{slot:"subject",modifiable:!0}],weight:5},{parts:[{slot:"clock",head:"um"},{slot:"verb"},{slot:"subject",modifiable:!0}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"date",head:"am",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"clock",head:"um",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:26},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:22},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"ist"}],weight:20},{parts:[{slot:"time"},{slot:"verb"},{slot:"subject",modifiable:!0}],weight:18},{parts:[{slot:"time"},{slot:"verb"},{slot:"subject",modifiable:!0},{slot:"manner"}],weight:14},{parts:[{slot:"manner"},{slot:"verb"},{slot:"subject",modifiable:!0}],weight:16},{parts:[{slot:"manner"},{slot:"verb"},{slot:"subject",modifiable:!0},{slot:"time"}],weight:10},{parts:[{slot:"verb"},{slot:"subject",modifiable:!0}],weight:26,mood:"question"},{parts:[{slot:"verb"},{slot:"subject",modifiable:!0},{slot:"manner"}],weight:20,mood:"question"},{parts:[{slot:"subject",head:"ist",modifiable:!0},{slot:"state"}],weight:18,mood:"question"}]},Nu={space:" ",capitalize:!0,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["“","”"],single:["‘","’"]},articles:{n:[["","the"]]},verbs:[{subject:["creature","person"],words:a(`
				runs walks leaps swims flies crawls returns leaves stops rests sleeps laughs
				cries sings dances yawns hides waits stands sits tumbles wanders passes
				approaches dozes stretches listens
			`),forms:{question:a(`
					run walk leap swim fly crawl return leave stop rest sleep laugh cry sing dance yawn
					hide wait stand sit tumble wander pass approach doze stretch listen
				`)}},{subject:["creature","person"],object:["edible"],words:a("eats drinks chews swallows tastes bakes warms shares"),forms:{question:a("eat drink chew swallow taste bake warm share")}},{subject:["creature","person"],object:["thing","plant","edible"],words:a("watches finds carries touches guards chooses moves lifts gathers"),forms:{question:a("watch find carry touch guard choose move lift gather")}},{subject:["person"],object:["thing","vehicle"],words:a("makes mends cleans sells buys builds paints"),forms:{question:a("make mend clean sell buy build paint")}},{subject:["person","creature"],object:["idea","event","place"],words:a("remembers forgets imagines counts describes"),forms:{question:a("remember forget imagine count describe")}},{subject:["place","event"],words:a("glows flows darkens brightens deepens quiets fades widens"),forms:{question:a("glow flow darken brighten deepen quiet fade widen")}},{subject:["thing","vehicle"],words:a("sways glitters falls rolls tilts ages creaks"),forms:{question:a("sway glitter fall roll tilt age creak")}},{subject:["vehicle"],words:a("runs stops passes returns departs slides"),forms:{question:a("run stop pass return depart slide")}},{subject:["idea","event"],words:a("spreads vanishes remains lingers returns gathers"),forms:{question:a("spread vanish remain linger return gather")}},{subject:["plant"],words:a("grows wilts blooms sways spreads"),forms:{question:a("grow wilt bloom sway spread")}},{subject:["body"],words:a("trembles moves stiffens aches heals"),forms:{question:a("tremble move stiffen ache heal")}},{subject:["edible"],words:a("ripens cools boils melts spoils remains"),forms:{question:a("ripen cool boil melt spoil remain")}}],states:[{subject:["creature","person"],words:a(`
				big small quick slow quiet loud brave lazy busy hungry sleepy fierce gentle
				clever restless
			`)},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("beautiful strange new common rare")},{subject:["place","event"],words:a("wide narrow calm deep dark bright distant steep")},{subject:["thing","vehicle"],words:a("hard light heavy old smooth clear sturdy hollow")},{subject:["edible"],words:a("sweet salty spicy sour hot cold nutty mild")},{subject:["idea"],words:a("simple obvious vague endless fleeting stubborn")},{subject:["plant"],words:a("green lush fragrant withered")},{subject:["body"],words:a("warm cold sore stiff steady")}],manners:a(`
		quietly slowly quickly gently suddenly softly again together alone briefly steadily boldly
		carefully eagerly warily calmly neatly side_by_side once_more warmly roughly firmly patiently
		lightly sharply wearily cheerfully idly restlessly faintly brightly evenly plainly gladly keenly
	`),times:a(`
		at_dawn in_the_morning at_noon in_the_evening at_night today yesterday tomorrow in_spring
		in_summer in_autumn in_winter on_weekends just_now sometimes every_day at_dusk before_long
		at_midnight at_midday last_week next_week these_days long_ago in_the_small_hours on_holidays
		all_day every_night
	`),connectives:{additive:a("and_then besides"),temporal:a("meanwhile afterwards later soon at_last before_long"),contrastive:a("but still however yet even_so then_again all_the_same even_then"),causal:a("so therefore in_the_end")},interjections:a(`
		oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me, good_grief,
		alas,
	`),pronouns:{m:a("he"),f:a("she"),n:a("it")},pronounless:["person"],numeral:{order:"before",counters:{},count:[2,12],currency:"dollars",amounts:[100,500,1e3,5e3,12e3,25e3,5e4,1e5],group:",",gap:" "},calendar:{date:"MMMM D, Y",months:a(`
			January February March April May June July August September October November December
		`),clock:"h:mm",years:[2020,2030],copula:{subject:["event"],words:a("is")}},frames:[{parts:[{slot:"date",head:"on",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",head:"at",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"date",head:"on",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"clock",head:"at",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:18},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"in",modifiable:!0}],weight:14},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"is"}],weight:12},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:10},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"place",head:"in",modifiable:!0}],weight:7},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"in",modifiable:!0}],weight:6},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"manner"}],weight:5},{parts:[{slot:"subject",head:"does",modifiable:!0},{slot:"verb"}],weight:20,mood:"question"},{parts:[{slot:"subject",head:"does",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:16,mood:"question"},{parts:[{slot:"subject",head:"is",modifiable:!0},{slot:"state"}],weight:14,mood:"question"},{parts:[{slot:"subject",head:"does",modifiable:!0},{slot:"verb"},{slot:"place",head:"in",modifiable:!0}],weight:12,mood:"question"},{parts:[{slot:"subject",head:"does",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:10,mood:"question"},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"money"}],weight:6}]},Eu={space:" ",capitalize:!0,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["«","»"],single:["“","”"]},openers:{question:"¿",exclamation:"¡"},articles:{m:[["","el"]],f:[["aguamarina","la"],["aguanieve","la"],["agua","el"],["alma","el"],["ancla","el"],["hacha","el"],["águila","el"],["","la"]]},predicateAgrees:!0,verbs:[{subject:["creature","person"],words:a(`
				corre camina salta nada vuela repta regresa parte se_detiene descansa duerme ríe
				llora canta baila se_esconde espera se_levanta se_sienta rueda vaga pasa
				se_acerca escucha
			`)},{subject:["creature","person"],object:["edible"],words:a("come bebe mastica prueba hornea calienta")},{subject:["creature","person"],object:["thing","plant","edible"],words:a("mira busca recoge lleva toca guarda elige mueve reúne")},{subject:["person"],object:["thing","vehicle"],words:a("hace repara limpia vende compra construye")},{subject:["person","creature"],object:["idea","event","place"],words:a("recuerda olvida imagina cuenta")},{subject:["place","event"],words:a("brilla fluye oscurece aclara se_ahonda se_calma")},{subject:["thing","vehicle"],words:a("se_mece reluce cae rueda se_inclina envejece")},{subject:["vehicle"],words:a("circula se_detiene pasa regresa parte resbala")},{subject:["idea","event"],words:a("se_extiende desaparece permanece flota se_ahonda")},{subject:["plant"],words:a("crece se_marchita florece se_mece brota")},{subject:["body"],words:a("tiembla se_mueve se_entumece sana")},{subject:["edible"],words:a("madura se_enfría hierve se_derrite se_estropea")}],states:[{subject:["creature","person"],words:a(`
				grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado
				hambriento soñoliento fiero manso listo
			`)},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("hermoso extraño nuevo común raro")},{subject:["place","event"],words:a("ancho estrecho tranquilo profundo oscuro claro lejano empinado")},{subject:["thing","vehicle"],words:a("duro ligero pesado viejo liso transparente robusto")},{subject:["edible"],words:a("dulce salado picante ácido caliente frío sabroso")},{subject:["idea"],words:a("sencillo evidente vago eterno fugaz")},{subject:["plant"],words:a("verde frondoso fragante marchito")},{subject:["body"],words:a("cálido frío dolorido rígido")}],manners:a(`
		en_silencio despacio rápidamente suavemente de_repente apenas otra_vez juntos a_solas todavía
		brevemente firmemente audazmente con_cuidado ansiosamente de_nuevo tranquilamente alegremente
		torpemente fuertemente pacientemente ligeramente tercamente serenamente vivamente débilmente
		claramente
	`),times:a(`
		al_amanecer por_la_mañana al_mediodía por_la_tarde por_la_noche hoy ayer mañana en_primavera
		en_verano en_otoño en_invierno los_fines_de_semana hace_poco a_veces cada_día al_anochecer
		a_medianoche la_semana_pasada la_semana_que_viene estos_días hace_tiempo en_los_días_festivos
		todo_el_día cada_noche
	`),connectives:{additive:a("y_luego además,"),temporal:a("después por_fin mientras_tanto, más_tarde al_final"),contrastive:a("pero sin_embargo, aun_así en_cambio, no_obstante,"),causal:a("entonces por_eso")},interjections:a(`
		ay, oh, vaya, caramba, madre_mía, mira, desde_luego, uy, anda, hombre, cielos, vamos,
	`),numeral:{order:"before",counters:{},count:[2,12],currency:"euros",amounts:[100,500,1e3,5e3,12e3,25e3,5e4,1e5],group:".",gap:" "},pronouns:{n:[""]},calendar:{date:"D de MMMM de Y",months:a(`
			enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre
		`),clock:"h:mm",years:[2020,2030],copula:{subject:["event"],words:a("es")}},frames:[{parts:[{slot:"date",head:"el",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",head:"a las",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"date",head:"el",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"clock",head:"a las",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:18},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"en",modifiable:!0}],weight:14},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"es"}],weight:12},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:10},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"place",head:"en",modifiable:!0}],weight:7},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"en",modifiable:!0}],weight:6},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"manner"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"money"}],weight:6}]},$u={space:" ",capitalize:!0,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["«","»"],single:["“","”"]},articles:{m:[["a","l'"],["e","l'"],["i","l'"],["o","l'"],["u","l'"],["gn","lo"],["pn","lo"],["ps","lo"],["x","lo"],["y","lo"],["z","lo"],["sb","lo"],["sc","lo"],["sd","lo"],["sf","lo"],["sg","lo"],["sl","lo"],["sm","lo"],["sn","lo"],["sp","lo"],["sq","lo"],["sr","lo"],["st","lo"],["sv","lo"],["","il"]],f:[["a","l'"],["e","l'"],["i","l'"],["o","l'"],["u","l'"],["","la"]]},predicateAgrees:!0,verbs:[{subject:["creature","person"],words:a(`
				corre cammina salta nuota vola striscia torna parte si_ferma riposa dorme ride
				piange canta balla si_nasconde aspetta si_alza si_siede rotola vaga passa
				si_avvicina ascolta
			`)},{subject:["creature","person"],object:["edible"],words:a("mangia beve mastica assaggia cuoce scalda")},{subject:["creature","person"],object:["thing","plant","edible"],words:a("guarda cerca raccoglie porta tocca custodisce sceglie sposta raduna")},{subject:["person"],object:["thing","vehicle"],words:a("costruisce ripara pulisce vende compra dipinge")},{subject:["person","creature"],object:["idea","event","place"],words:a("ricorda dimentica immagina conta")},{subject:["place","event"],words:a("brilla scorre si_oscura si_schiarisce si_approfondisce si_calma")},{subject:["thing","vehicle"],words:a("oscilla luccica cade rotola si_inclina invecchia")},{subject:["vehicle"],words:a("viaggia si_ferma passa torna parte scivola")},{subject:["idea","event"],words:a("si_diffonde svanisce rimane fluttua cresce")},{subject:["plant"],words:a("cresce appassisce fiorisce oscilla germoglia")},{subject:["body"],words:a("trema si_muove si_intorpidisce guarisce")},{subject:["edible"],words:a("matura si_raffredda bolle si_scioglie si_guasta")}],states:[{subject:["creature","person"],words:a(`
				grande piccolo veloce lento silenzioso rumoroso coraggioso pigro affamato
				assonnato feroce mite arguto sveglio
			`)},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("bello strano nuovo comune raro")},{subject:["place","event"],words:a("ampio stretto tranquillo profondo scuro chiaro lontano ripido")},{subject:["thing","vehicle"],words:a("duro leggero pesante vecchio liscio trasparente robusto")},{subject:["edible"],words:a("dolce salato piccante aspro caldo freddo saporito")},{subject:["idea"],words:a("semplice evidente vago eterno fugace")},{subject:["plant"],words:a("verde rigoglioso profumato appassito")},{subject:["body"],words:a("caldo freddo dolente rigido")}],manners:a(`
		in_silenzio lentamente rapidamente dolcemente improvvisamente appena di_nuovo insieme da_solo
		ancora brevemente costantemente audacemente con_cura avidamente tranquillamente allegramente
		fortemente pazientemente leggermente serenamente vivacemente debolmente chiaramente goffamente
	`),times:a(`
		all'alba al_mattino a_mezzogiorno di_sera di_notte oggi ieri domani in_primavera in_estate
		in_autunno in_inverno nel_fine_settimana poco_fa a_volte ogni_giorno al_tramonto a_mezzanotte
		la_settimana_scorsa la_settimana_prossima di_questi_tempi tempo_fa nei_giorni_festivi
		tutto_il_giorno ogni_notte
	`),connectives:{additive:a("e_poi inoltre,"),temporal:a("dopo infine intanto, più_tardi alla_fine"),contrastive:a("ma tuttavia, eppure invece,"),causal:a("allora perciò")},interjections:a(`
		oh, ah, ehi, caspita, mamma_mia, guarda, davvero, ohi, accidenti, cavolo, santo_cielo, dai,
	`),pronouns:{n:[""]},numeral:{order:"before",counters:{},count:[2,12],currency:"euro",amounts:[100,500,1e3,5e3,12e3,25e3,5e4,1e5],group:".",gap:" "},calendar:{date:"D MMMM Y",months:a(`
			gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre
			dicembre
		`),clock:"h:mm",years:[2020,2030],copula:{subject:["event"],words:a("è")}},frames:[{parts:[{slot:"date",head:"il",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",head:"alle",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"date",head:"il",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"clock",head:"alle",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:18},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"in",bare:!0,modifiable:!0}],weight:14},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"è"}],weight:12},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:10},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"place",head:"in",bare:!0,modifiable:!0}],weight:7},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"in",bare:!0,modifiable:!0}],weight:6},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"manner"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"money"}],weight:6}]},Du={space:"",capitalize:!1,terminators:{statement:"。",question:"？",exclamation:"！",trailing:"…"},quotes:{double:["「","」"],single:["『","』"]},verbs:[{subject:["creature","person"],words:a(`
				走る 歩く 跳ぶ 泳ぐ 飛ぶ 這う 戻る 去る 止まる 休む 眠る 笑う 泣く 歌う 踊る
				隠れる 待つ 立つ 座る 転がる さまよう 通る 近づく 伸びる 聞く
			`),forms:{polite:a(`
					走ります 歩きます 跳びます 泳ぎます 飛びます 這います 戻ります 去ります 止まります 休みます 眠ります 笑います 泣きます 歌います 踊ります 隠れます
					待ちます 立ちます 座ります 転がります さまよいます 通ります 近づきます 伸びます 聞きます
				`)}},{subject:["creature","person"],object:["edible"],words:a("食べる 飲む 噛む 味わう 焼く 温める"),forms:{polite:a("食べます 飲みます 噛みます 味わいます 焼きます 温めます")}},{subject:["creature","person"],object:["thing","plant","edible"],words:a("見る 探す 拾う 運ぶ 触る 守る 選ぶ 動かす 集める"),forms:{polite:a("見ます 探します 拾います 運びます 触ります 守ります 選びます 動かします 集めます")}},{subject:["person"],object:["thing","vehicle"],words:a("作る 直す 磨く 売る 買う 建てる"),forms:{polite:a("作ります 直します 磨きます 売ります 買います 建てます")}},{subject:["person","creature"],object:["idea","event","place"],words:a("覚える 忘れる 想像する 数える"),forms:{polite:a("覚えます 忘れます 想像します 数えます")}},{subject:["place","event"],words:a("光る 流れる 暮れる 明ける 深まる 静まる 色づく"),forms:{polite:a("光ります 流れます 暮れます 明けます 深まります 静まります 色づきます")}},{subject:["thing","vehicle"],words:a("揺れる 輝く 落ちる 転がる 傾く 古びる"),forms:{polite:a("揺れます 輝きます 落ちます 転がります 傾きます 古びます")}},{subject:["vehicle"],words:a("走る 止まる 通る 戻る 出発する 滑る"),forms:{polite:a("走ります 止まります 通ります 戻ります 出発します 滑ります")}},{subject:["idea","event"],words:a("広がる 消える 残る 漂う 深まる"),forms:{polite:a("広がります 消えます 残ります 漂います 深まります")}},{subject:["plant"],words:a("育つ 枯れる 咲く 揺れる 伸びる"),forms:{polite:a("育ちます 枯れます 咲きます 揺れます 伸びます")}},{subject:["body"],words:a("震える 動く 痺れる 固まる"),forms:{polite:a("震えます 動きます 痺れます 固まります")}},{subject:["edible"],words:a("熟れる 冷める 煮える 溶ける 傷む"),forms:{polite:a("熟れます 冷めます 煮えます 溶けます 傷みます")}}],numeral:{order:"after",counters:{creature:"匹",person:"人",plant:"本",edible:"個",thing:"個",vehicle:"台",place:"箇所",event:"回",idea:"種類",body:"本"},count:[2,12],currency:"円",amounts:[1e3,5e3,1e4,3e4,5e4,1e5,3e5,5e5,1e6],group:",",gap:""},states:[{subject:["creature","person"],words:a("大きい 小さい 速い 遅い 静かだ うるさい 勇敢だ 元気だ 眠い 賢い 優しい 荒々しい"),forms:{polite:a("大きいです 小さいです 速いです 遅いです 静かです うるさいです 勇敢です 元気です 眠いです 賢いです 優しいです 荒々しいです")}},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("美しい 珍しい 新しい 見慣れない"),forms:{polite:a("美しいです 珍しいです 新しいです 見慣れないです")}},{subject:["place","event"],words:a("広い 狭い 静かだ 深い 暗い 明るい 遠い 険しい"),forms:{polite:a("広いです 狭いです 静かです 深いです 暗いです 明るいです 遠いです 険しいです")}},{subject:["thing","vehicle"],words:a("硬い 軽い 重い 古い 滑らかだ 透明だ 丈夫だ"),forms:{polite:a("硬いです 軽いです 重いです 古いです 滑らかです 透明です 丈夫です")}},{subject:["edible"],words:a("甘い しょっぱい 辛い 酸っぱい 熱い 冷たい 香ばしい"),forms:{polite:a("甘いです しょっぱいです 辛いです 酸っぱいです 熱いです 冷たいです 香ばしいです")}},{subject:["idea"],words:a("難しい 易しい 明らかだ 曖昧だ 永遠だ はかない"),forms:{polite:a("難しいです 易しいです 明らかです 曖昧です 永遠です はかないです")}},{subject:["plant"],words:a("青い 香しい 瑞々しい"),forms:{polite:a("青いです 香しいです 瑞々しいです")}},{subject:["body"],words:a("温かい 冷たい 痛い 硬い"),forms:{polite:a("温かいです 冷たいです 痛いです 硬いです")}}],manners:a(`
		静かに ゆっくり 速く じっと そっと ふと 一緒に ひとりで また ずっと しばらく 次第に 急に いつも まだ 慎重に 力強く 並んで 素早く 黙って 軽やかに 丁寧に 懸命に のんびり
		ぼんやり しっかり さらりと ひっそり 悠々と きちんと ゆるやかに 朗らかに
	`),times:a(`
		夜明けに 朝に 昼に 夕方に 夜に 真夜中に 今日 昨日 明日 春に 夏に 秋に 冬に 週末に さっき 時々 毎日 夕暮れに 真昼に 元日に 先週 来週 近頃 昔 休日に 一日中 毎晩
	`),connectives:{additive:a("そして また しかも ところで"),temporal:a("やがて すぐに ついに 一方 その後"),contrastive:a("しかし ところが けれども それでも"),causal:a("だから つまり")},interjections:a(`
		ああ、 おお、 まあ、 なんと、 やれやれ、 おや、 ほら、 へえ、 わあ、 あら、 おっと、 いやはや、
	`),pronouns:{n:["","それ"]},pronounless:["person"],calendar:{date:"Y年M月D日",clock:"h時mm分",years:[2020,2030],copula:{subject:["event"],words:a("だ"),forms:{polite:a("です")}}},frames:[{parts:[{slot:"date",tail:"に"},{slot:"subject",tail:"が",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",tail:"に"},{slot:"subject",tail:"が",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",tail:"は"},{slot:"date",copula:"tail"}],weight:4},{parts:[{slot:"subject",tail:"は"},{slot:"clock",copula:"tail"}],weight:4},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"object",tail:"を",modifiable:!0},{slot:"verb"}],weight:18},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"place",tail:"で",modifiable:!0},{slot:"verb"}],weight:14},{parts:[{slot:"subject",tail:"は",modifiable:!0},{slot:"state"}],weight:12},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"manner"},{slot:"verb"}],weight:10},{parts:[{slot:"time"},{slot:"subject",tail:"が",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"place",tail:"で",modifiable:!0},{slot:"object",tail:"を",modifiable:!0},{slot:"verb"}],weight:7},{parts:[{slot:"time"},{slot:"subject",tail:"が",modifiable:!0},{slot:"place",tail:"で",modifiable:!0},{slot:"verb"}],weight:6},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"manner"},{slot:"object",tail:"を",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"verb"}],weight:20,mood:"question",tag:"か"},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"object",tail:"を",modifiable:!0},{slot:"verb"}],weight:16,mood:"question",tag:"か"},{parts:[{slot:"subject",tail:"は",modifiable:!0},{slot:"state"}],weight:14,mood:"question",tag:"か"},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"place",tail:"で",modifiable:!0},{slot:"verb"}],weight:12,mood:"question",tag:"か"},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"quantity",tail:"を"},{slot:"verb"}],weight:6},{parts:[{slot:"quantity",tail:"が"},{slot:"verb"}],weight:5},{parts:[{slot:"subject",tail:"が",modifiable:!0},{slot:"money",tail:"を"},{slot:"verb"}],weight:5}]},Fu={space:" ",capitalize:!1,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["“","”"],single:["‘","’"]},verbs:[{subject:["creature","person"],words:a(`
				달린다 걷는다 뛴다 헤엄친다 날아오른다 기어간다 돌아온다 떠난다 멈춘다 쉰다 잠잔다 웃는다 운다 노래한다 춤춘다 하품한다 숨는다 기다린다 일어선다 앉는다 눕는다 뒹군다
				서성인다 지나간다 다가온다 뒤척인다 존다 두리번거린다 어슬렁댄다
			`),forms:{question:a(`
					달리니|달리나|달리는가 걷니|걷나|걷는가 뛰니|뛰나|뛰는가 헤엄치니|헤엄치나|헤엄치는가 날아오르니|날아오르나|날아오르는가 기어가니|기어가나|기어가는가
					돌아오니|돌아오나|돌아오는가 떠나니|떠나나|떠나는가 멈추니|멈추나|멈추는가 쉬니|쉬나|쉬는가 잠자니|잠자나|잠자는가 웃니|웃나|웃는가 우니|우나|우는가
					노래하니|노래하나|노래하는가 춤추니|춤추나|춤추는가 하품하니|하품하나|하품하는가 숨니|숨나|숨는가 기다리니|기다리나|기다리는가 일어서니|일어서나|일어서는가 앉니|앉나|앉는가
					눕니|눕나|눕는가 뒹구니|뒹구나|뒹구는가 서성이니|서성이나|서성이는가 지나가니|지나가나|지나가는가 다가오니|다가오나|다가오는가 뒤척이니|뒤척이나|뒤척이는가 조니|조나|조는가
					두리번거리니|두리번거리나|두리번거리는가 어슬렁대니|어슬렁대나|어슬렁대는가
				`),exclamation:a(`
					달리는구나|달리네|달리는군 걷는구나|걷네|걷는군 뛰는구나|뛰네|뛰는군 헤엄치는구나|헤엄치네|헤엄치는군 날아오르는구나|날아오르네|날아오르는군 기어가는구나|기어가네|기어가는군
					돌아오는구나|돌아오네|돌아오는군 떠나는구나|떠나네|떠나는군 멈추는구나|멈추네|멈추는군 쉬는구나|쉬네|쉬는군 잠자는구나|잠자네|잠자는군 웃는구나|웃네|웃는군
					우는구나|우네|우는군 노래하는구나|노래하네|노래하는군 춤추는구나|춤추네|춤추는군 하품하는구나|하품하네|하품하는군 숨는구나|숨네|숨는군 기다리는구나|기다리네|기다리는군
					일어서는구나|일어서네|일어서는군 앉는구나|앉네|앉는군 눕는구나|눕네|눕는군 뒹구는구나|뒹구네|뒹구는군 서성이는구나|서성이네|서성이는군 지나가는구나|지나가네|지나가는군
					다가오는구나|다가오네|다가오는군 뒤척이는구나|뒤척이네|뒤척이는군 조는구나|조네|조는군 두리번거리는구나|두리번거리네|두리번거리는군 어슬렁대는구나|어슬렁대네|어슬렁대는군
				`),casual:a(`
					달려|달리지 걸어|걷지 뛰어|뛰지 헤엄쳐|헤엄치지 날아올라|날아오르지 기어가|기어가지 돌아와|돌아오지 떠나|떠나지 멈춰|멈추지 쉬어|쉬지 잠자|잠자지 웃어|웃지 울어|울지
					노래해|노래하지 춤춰|춤추지 하품해|하품하지 숨어|숨지 기다려|기다리지 일어서|일어서지 앉아|앉지 누워|눕지 뒹굴어|뒹굴지 서성여|서성이지 지나가|지나가지 다가와|다가오지
					뒤척여|뒤척이지 졸아|졸지 두리번거려|두리번거리지 어슬렁대|어슬렁대지
				`),polite:a(`
					달려요|달리죠 걸어요|걷죠 뛰어요|뛰죠 헤엄쳐요|헤엄치죠 날아올라요|날아오르죠 기어가요|기어가죠 돌아와요|돌아오죠 떠나요|떠나죠 멈춰요|멈추죠 쉬어요|쉬죠 잠자요|잠자죠
					웃어요|웃죠 울어요|울죠 노래해요|노래하죠 춤춰요|춤추죠 하품해요|하품하죠 숨어요|숨죠 기다려요|기다리죠 일어서요|일어서죠 앉아요|앉죠 누워요|눕죠 뒹굴어요|뒹굴죠
					서성여요|서성이죠 지나가요|지나가죠 다가와요|다가오죠 뒤척여요|뒤척이죠 졸아요|졸죠 두리번거려요|두리번거리죠 어슬렁대요|어슬렁대죠
				`),formal:a(`
					달립니다 걷습니다 뜁니다 헤엄칩니다 날아오릅니다 기어갑니다 돌아옵니다 떠납니다 멈춥니다 쉽니다 잠잡니다 웃습니다 웁니다 노래합니다 춤춥니다 하품합니다 숨습니다 기다립니다
					일어섭니다 앉습니다 눕습니다 뒹굽니다 서성입니다 지나갑니다 다가옵니다 뒤척입니다 좁니다 두리번거립니다 어슬렁댑니다
				`),formalQuestion:a(`
					달립니까 걷습니까 뜁니까 헤엄칩니까 날아오릅니까 기어갑니까 돌아옵니까 떠납니까 멈춥니까 쉽니까 잠잡니까 웃습니까 웁니까 노래합니까 춤춥니까 하품합니까 숨습니까 기다립니까
					일어섭니까 앉습니까 눕습니까 뒹굽니까 서성입니까 지나갑니까 다가옵니까 뒤척입니까 좁니까 두리번거립니까 어슬렁댑니까
				`)}},{subject:["creature","person"],object:["edible"],words:a("먹는다 마신다 씹는다 삼킨다 맛본다 굽는다 데운다"),forms:{question:a("먹니|먹나|먹는가 마시니|마시나|마시는가 씹니|씹나|씹는가 삼키니|삼키나|삼키는가 맛보니|맛보나|맛보는가 굽니|굽나|굽는가 데우니|데우나|데우는가"),exclamation:a(`
					먹는구나|먹네|먹는군 마시는구나|마시네|마시는군 씹는구나|씹네|씹는군 삼키는구나|삼키네|삼키는군 맛보는구나|맛보네|맛보는군 굽는구나|굽네|굽는군 데우는구나|데우네|데우는군
				`),casual:a("먹어|먹지 마셔|마시지 씹어|씹지 삼켜|삼키지 맛봐|맛보지 구워|굽지 데워|데우지"),polite:a("먹어요|먹죠 마셔요|마시죠 씹어요|씹죠 삼켜요|삼키죠 맛봐요|맛보죠 구워요|굽죠 데워요|데우죠"),formal:a("먹습니다 마십니다 씹습니다 삼킵니다 맛봅니다 굽습니다 데웁니다"),formalQuestion:a("먹습니까 마십니까 씹습니까 삼킵니까 맛봅니까 굽습니까 데웁니까")}},{subject:["creature","person"],object:["thing","plant","edible"],words:a("본다 바라본다 찾는다 줍는다 옮긴다 만진다 감춘다 지킨다 나른다 챙긴다 고른다"),forms:{question:a(`
					보니|보나|보는가 바라보니|바라보나|바라보는가 찾니|찾나|찾는가 줍니|줍나|줍는가 옮기니|옮기나|옮기는가 만지니|만지나|만지는가 감추니|감추나|감추는가
					지키니|지키나|지키는가 나르니|나르나|나르는가 챙기니|챙기나|챙기는가 고르니|고르나|고르는가
				`),exclamation:a(`
					보는구나|보네|보는군 바라보는구나|바라보네|바라보는군 찾는구나|찾네|찾는군 줍는구나|줍네|줍는군 옮기는구나|옮기네|옮기는군 만지는구나|만지네|만지는군
					감추는구나|감추네|감추는군 지키는구나|지키네|지키는군 나르는구나|나르네|나르는군 챙기는구나|챙기네|챙기는군 고르는구나|고르네|고르는군
				`),casual:a("봐|보지 바라봐|바라보지 찾아|찾지 주워|줍지 옮겨|옮기지 만져|만지지 감춰|감추지 지켜|지키지 날라|나르지 챙겨|챙기지 골라|고르지"),polite:a(`
					봐요|보죠 바라봐요|바라보죠 찾아요|찾죠 주워요|줍죠 옮겨요|옮기죠 만져요|만지죠 감춰요|감추죠 지켜요|지키죠 날라요|나르죠 챙겨요|챙기죠 골라요|고르죠
				`),formal:a("봅니다 바라봅니다 찾습니다 줍습니다 옮깁니다 만집니다 감춥니다 지킵니다 나릅니다 챙깁니다 고릅니다"),formalQuestion:a("봅니까 바라봅니까 찾습니까 줍습니까 옮깁니까 만집니까 감춥니까 지킵니까 나릅니까 챙깁니까 고릅니까")}},{subject:["person"],object:["thing","vehicle"],words:a("만든다 고친다 닦는다 판다 산다 손질한다"),forms:{question:a("만드니|만드나|만드는가 고치니|고치나|고치는가 닦니|닦나|닦는가 파니|파나|파는가 사니|사나|사는가 손질하니|손질하나|손질하는가"),exclamation:a("만드는구나|만드네|만드는군 고치는구나|고치네|고치는군 닦는구나|닦네|닦는군 파는구나|파네|파는군 사는구나|사네|사는군 손질하는구나|손질하네|손질하는군"),casual:a("만들어|만들지 고쳐|고치지 닦아|닦지 팔아|팔지 사|사지 손질해|손질하지"),polite:a("만들어요|만들죠 고쳐요|고치죠 닦아요|닦죠 팔아요|팔죠 사요|사죠 손질해요|손질하죠"),formal:a("만듭니다 고칩니다 닦습니다 팝니다 삽니다 손질합니다"),formalQuestion:a("만듭니까 고칩니까 닦습니까 팝니까 삽니까 손질합니까")}},{subject:["person","creature"],object:["idea","event","place"],words:a("꿈꾼다 기억한다 잊는다 상상한다 헤아린다"),forms:{question:a("꿈꾸니|꿈꾸나|꿈꾸는가 기억하니|기억하나|기억하는가 잊니|잊나|잊는가 상상하니|상상하나|상상하는가 헤아리니|헤아리나|헤아리는가"),exclamation:a("꿈꾸는구나|꿈꾸네|꿈꾸는군 기억하는구나|기억하네|기억하는군 잊는구나|잊네|잊는군 상상하는구나|상상하네|상상하는군 헤아리는구나|헤아리네|헤아리는군"),casual:a("꿈꿔|꿈꾸지 기억해|기억하지 잊어|잊지 상상해|상상하지 헤아려|헤아리지"),polite:a("꿈꿔요|꿈꾸죠 기억해요|기억하죠 잊어요|잊죠 상상해요|상상하죠 헤아려요|헤아리죠"),formal:a("꿈꿉니다 기억합니다 잊습니다 상상합니다 헤아립니다"),formalQuestion:a("꿈꿉니까 기억합니까 잊습니까 상상합니까 헤아립니까")}},{subject:["place","event"],words:a("빛난다 흐른다 저문다 밝아온다 깊어진다 조용해진다 물든다"),forms:{question:a(`
					빛나니|빛나나|빛나는가 흐르니|흐르나|흐르는가 저무니|저무나|저무는가 밝아오니|밝아오나|밝아오는가 깊어지니|깊어지나|깊어지는가 조용해지니|조용해지나|조용해지는가
					물드니|물드나|물드는가
				`),exclamation:a(`
					빛나는구나|빛나네|빛나는군 흐르는구나|흐르네|흐르는군 저무는구나|저무네|저무는군 밝아오는구나|밝아오네|밝아오는군 깊어지는구나|깊어지네|깊어지는군
					조용해지는구나|조용해지네|조용해지는군 물드는구나|물드네|물드는군
				`),casual:a("빛나|빛나지 흘러|흐르지 저물어|저물지 밝아와|밝아오지 깊어져|깊어지지 조용해져|조용해지지 물들어|물들지"),polite:a("빛나요|빛나죠 흘러요|흐르죠 저물어요|저물죠 밝아와요|밝아오죠 깊어져요|깊어지죠 조용해져요|조용해지죠 물들어요|물들죠"),formal:a("빛납니다 흐릅니다 저뭅니다 밝아옵니다 깊어집니다 조용해집니다 물듭니다"),formalQuestion:a("빛납니까 흐릅니까 저뭅니까 밝아옵니까 깊어집니까 조용해집니까 물듭니까")}},{subject:["thing","vehicle"],words:a("흔들린다 반짝인다 떨어진다 굴러간다 기울어진다 낡아간다"),forms:{question:a(`
					흔들리니|흔들리나|흔들리는가 반짝이니|반짝이나|반짝이는가 떨어지니|떨어지나|떨어지는가 굴러가니|굴러가나|굴러가는가 기울어지니|기울어지나|기울어지는가
					낡아가니|낡아가나|낡아가는가
				`),exclamation:a(`
					흔들리는구나|흔들리네|흔들리는군 반짝이는구나|반짝이네|반짝이는군 떨어지는구나|떨어지네|떨어지는군 굴러가는구나|굴러가네|굴러가는군 기울어지는구나|기울어지네|기울어지는군
					낡아가는구나|낡아가네|낡아가는군
				`),casual:a("흔들려|흔들리지 반짝여|반짝이지 떨어져|떨어지지 굴러가|굴러가지 기울어져|기울어지지 낡아가|낡아가지"),polite:a("흔들려요|흔들리죠 반짝여요|반짝이죠 떨어져요|떨어지죠 굴러가요|굴러가죠 기울어져요|기울어지죠 낡아가요|낡아가죠"),formal:a("흔들립니다 반짝입니다 떨어집니다 굴러갑니다 기울어집니다 낡아갑니다"),formalQuestion:a("흔들립니까 반짝입니까 떨어집니까 굴러갑니까 기울어집니까 낡아갑니까")}},{subject:["vehicle"],words:a("달린다 멈춘다 지나간다 돌아온다 출발한다 미끄러진다"),forms:{question:a(`
					달리니|달리나|달리는가 멈추니|멈추나|멈추는가 지나가니|지나가나|지나가는가 돌아오니|돌아오나|돌아오는가 출발하니|출발하나|출발하는가 미끄러지니|미끄러지나|미끄러지는가
				`),exclamation:a(`
					달리는구나|달리네|달리는군 멈추는구나|멈추네|멈추는군 지나가는구나|지나가네|지나가는군 돌아오는구나|돌아오네|돌아오는군 출발하는구나|출발하네|출발하는군
					미끄러지는구나|미끄러지네|미끄러지는군
				`),casual:a("달려|달리지 멈춰|멈추지 지나가|지나가지 돌아와|돌아오지 출발해|출발하지 미끄러져|미끄러지지"),polite:a("달려요|달리죠 멈춰요|멈추죠 지나가요|지나가죠 돌아와요|돌아오죠 출발해요|출발하죠 미끄러져요|미끄러지죠"),formal:a("달립니다 멈춥니다 지나갑니다 돌아옵니다 출발합니다 미끄러집니다"),formalQuestion:a("달립니까 멈춥니까 지나갑니까 돌아옵니까 출발합니까 미끄러집니까")}},{subject:["idea","event"],words:a("번진다 사라진다 남는다 스며든다 되풀이된다 짙어진다"),forms:{question:a(`
					번지니|번지나|번지는가 사라지니|사라지나|사라지는가 남니|남나|남는가 스며드니|스며드나|스며드는가 되풀이되니|되풀이되나|되풀이되는가 짙어지니|짙어지나|짙어지는가
				`),exclamation:a(`
					번지는구나|번지네|번지는군 사라지는구나|사라지네|사라지는군 남는구나|남네|남는군 스며드는구나|스며드네|스며드는군 되풀이되는구나|되풀이되네|되풀이되는군
					짙어지는구나|짙어지네|짙어지는군
				`),casual:a("번져|번지지 사라져|사라지지 남아|남지 스며들어|스며들지 되풀이돼|되풀이되지 짙어져|짙어지지"),polite:a("번져요|번지죠 사라져요|사라지죠 남아요|남죠 스며들어요|스며들죠 되풀이돼요|되풀이되죠 짙어져요|짙어지죠"),formal:a("번집니다 사라집니다 남습니다 스며듭니다 되풀이됩니다 짙어집니다"),formalQuestion:a("번집니까 사라집니까 남습니까 스며듭니까 되풀이됩니까 짙어집니까")}},{subject:["plant"],words:a("자란다 시든다 피어난다 흔들린다 뿌리내린다"),forms:{question:a("자라니|자라나|자라는가 시드니|시드나|시드는가 피어나니|피어나나|피어나는가 흔들리니|흔들리나|흔들리는가 뿌리내리니|뿌리내리나|뿌리내리는가"),exclamation:a(`
					자라는구나|자라네|자라는군 시드는구나|시드네|시드는군 피어나는구나|피어나네|피어나는군 흔들리는구나|흔들리네|흔들리는군 뿌리내리는구나|뿌리내리네|뿌리내리는군
				`),casual:a("자라|자라지 시들어|시들지 피어나|피어나지 흔들려|흔들리지 뿌리내려|뿌리내리지"),polite:a("자라요|자라죠 시들어요|시들죠 피어나요|피어나죠 흔들려요|흔들리죠 뿌리내려요|뿌리내리죠"),formal:a("자랍니다 시듭니다 피어납니다 흔들립니다 뿌리내립니다"),formalQuestion:a("자랍니까 시듭니까 피어납니까 흔들립니까 뿌리내립니까")}},{subject:["body"],words:a("떨린다 움직인다 저린다 굳는다"),forms:{question:a("떨리니|떨리나|떨리는가 움직이니|움직이나|움직이는가 저리니|저리나|저리는가 굳니|굳나|굳는가"),exclamation:a("떨리는구나|떨리네|떨리는군 움직이는구나|움직이네|움직이는군 저리는구나|저리네|저리는군 굳는구나|굳네|굳는군"),casual:a("떨려|떨리지 움직여|움직이지 저려|저리지 굳어|굳지"),polite:a("떨려요|떨리죠 움직여요|움직이죠 저려요|저리죠 굳어요|굳죠"),formal:a("떨립니다 움직입니다 저립니다 굳습니다"),formalQuestion:a("떨립니까 움직입니까 저립니까 굳습니까")}},{subject:["edible"],words:a("익는다 식는다 끓는다 녹는다 상한다 남는다"),forms:{question:a("익니|익나|익는가 식니|식나|식는가 끓니|끓나|끓는가 녹니|녹나|녹는가 상하니|상하나|상하는가 남니|남나|남는가"),exclamation:a("익는구나|익네|익는군 식는구나|식네|식는군 끓는구나|끓네|끓는군 녹는구나|녹네|녹는군 상하는구나|상하네|상하는군 남는구나|남네|남는군"),casual:a("익어|익지 식어|식지 끓어|끓지 녹아|녹지 상해|상하지 남아|남지"),polite:a("익어요|익죠 식어요|식죠 끓어요|끓죠 녹아요|녹죠 상해요|상하죠 남아요|남죠"),formal:a("익습니다 식습니다 끓습니다 녹습니다 상합니다 남습니다"),formalQuestion:a("익습니까 식습니까 끓습니까 녹습니까 상합니까 남습니까")}}],states:[{subject:["creature","person"],words:a("크다 작다 빠르다 느리다 조용하다 시끄럽다 용감하다 게으르다 부지런하다 배고프다 졸리다 사납다 순하다 영리하다"),forms:{question:a(`
					크니|큰가 작으니|작은가 빠르니|빠른가 느리니|느린가 조용하니|조용한가 시끄러우니|시끄러운가 용감하니|용감한가 게으르니|게으른가 부지런하니|부지런한가 배고프니|배고픈가
					졸리니|졸린가 사나우니|사나운가 순하니|순한가 영리하니|영리한가
				`),exclamation:a(`
					크구나|크네|크군 작구나|작네|작군 빠르구나|빠르네|빠르군 느리구나|느리네|느리군 조용하구나|조용하네|조용하군 시끄럽구나|시끄럽네|시끄럽군 용감하구나|용감하네|용감하군
					게으르구나|게으르네|게으르군 부지런하구나|부지런하네|부지런하군 배고프구나|배고프네|배고프군 졸리구나|졸리네|졸리군 사납구나|사납네|사납군 순하구나|순하네|순하군
					영리하구나|영리하네|영리하군
				`),casual:a(`
					커|크지 작아|작지 빨라|빠르지 느려|느리지 조용해|조용하지 시끄러워|시끄럽지 용감해|용감하지 게을러|게으르지 부지런해|부지런하지 배고파|배고프지 졸려|졸리지 사나워|사납지
					순해|순하지 영리해|영리하지
				`),polite:a(`
					커요|크죠 작아요|작죠 빨라요|빠르죠 느려요|느리죠 조용해요|조용하죠 시끄러워요|시끄럽죠 용감해요|용감하죠 게을러요|게으르죠 부지런해요|부지런하죠 배고파요|배고프죠
					졸려요|졸리죠 사나워요|사납죠 순해요|순하죠 영리해요|영리하죠
				`),formal:a("큽니다 작습니다 빠릅니다 느립니다 조용합니다 시끄럽습니다 용감합니다 게으릅니다 부지런합니다 배고픕니다 졸립니다 사납습니다 순합니다 영리합니다"),formalQuestion:a("큽니까 작습니까 빠릅니까 느립니까 조용합니까 시끄럽습니까 용감합니까 게으릅니까 부지런합니까 배고픕니까 졸립니까 사납습니까 순합니까 영리합니까")}},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("아름답다 낯설다 새롭다 흔하다 드물다"),forms:{question:a("아름다우니|아름다운가 낯서니|낯선가 새로우니|새로운가 흔하니|흔한가 드무니|드문가"),exclamation:a("아름답구나|아름답네|아름답군 낯설구나|낯서네|낯설군 새롭구나|새롭네|새롭군 흔하구나|흔하네|흔하군 드물구나|드무네|드물군"),casual:a("아름다워|아름답지 낯설어|낯설지 새로워|새롭지 흔해|흔하지 드물어|드물지"),polite:a("아름다워요|아름답죠 낯설어요|낯설죠 새로워요|새롭죠 흔해요|흔하죠 드물어요|드물죠"),formal:a("아름답습니다 낯섭니다 새롭습니다 흔합니다 드뭅니다"),formalQuestion:a("아름답습니까 낯섭니까 새롭습니까 흔합니까 드뭅니까")}},{subject:["place","event"],words:a("넓다 좁다 고요하다 깊다 어둡다 밝다 아득하다 가파르다"),forms:{question:a("넓으니|넓은가 좁으니|좁은가 고요하니|고요한가 깊으니|깊은가 어두우니|어두운가 밝으니|밝은가 아득하니|아득한가 가파르니|가파른가"),exclamation:a(`
					넓구나|넓네|넓군 좁구나|좁네|좁군 고요하구나|고요하네|고요하군 깊구나|깊네|깊군 어둡구나|어둡네|어둡군 밝구나|밝네|밝군 아득하구나|아득하네|아득하군
					가파르구나|가파르네|가파르군
				`),casual:a("넓어|넓지 좁아|좁지 고요해|고요하지 깊어|깊지 어두워|어둡지 밝아|밝지 아득해|아득하지 가팔라|가파르지"),polite:a("넓어요|넓죠 좁아요|좁죠 고요해요|고요하죠 깊어요|깊죠 어두워요|어둡죠 밝아요|밝죠 아득해요|아득하죠 가팔라요|가파르죠"),formal:a("넓습니다 좁습니다 고요합니다 깊습니다 어둡습니다 밝습니다 아득합니다 가파릅니다"),formalQuestion:a("넓습니까 좁습니까 고요합니까 깊습니까 어둡습니까 밝습니까 아득합니까 가파릅니까")}},{subject:["thing","vehicle"],words:a("단단하다 가볍다 무겁다 낡았다 매끈하다 투명하다 튼튼하다"),forms:{question:a("단단하니|단단한가 가벼우니|가벼운가 무거우니|무거운가 낡았니|낡았는가 매끈하니|매끈한가 투명하니|투명한가 튼튼하니|튼튼한가"),exclamation:a(`
					단단하구나|단단하네|단단하군 가볍구나|가볍네|가볍군 무겁구나|무겁네|무겁군 낡았구나|낡았네|낡았군 매끈하구나|매끈하네|매끈하군 투명하구나|투명하네|투명하군
					튼튼하구나|튼튼하네|튼튼하군
				`),casual:a("단단해|단단하지 가벼워|가볍지 무거워|무겁지 낡았어|낡았지 매끈해|매끈하지 투명해|투명하지 튼튼해|튼튼하지"),polite:a("단단해요|단단하죠 가벼워요|가볍죠 무거워요|무겁죠 낡았어요|낡았죠 매끈해요|매끈하죠 투명해요|투명하죠 튼튼해요|튼튼하죠"),formal:a("단단합니다 가볍습니다 무겁습니다 낡았습니다 매끈합니다 투명합니다 튼튼합니다"),formalQuestion:a("단단합니까 가볍습니까 무겁습니까 낡았습니까 매끈합니까 투명합니까 튼튼합니까")}},{subject:["edible"],words:a("달다 짜다 맵다 시다 뜨겁다 차갑다 고소하다 담백하다"),forms:{question:a("다니|단가 짜니|짠가 매우니|매운가 시니|신가 뜨거우니|뜨거운가 차가우니|차가운가 고소하니|고소한가 담백하니|담백한가"),exclamation:a(`
					달구나|다네|달군 짜구나|짜네|짜군 맵구나|맵네|맵군 시구나|시네|시군 뜨겁구나|뜨겁네|뜨겁군 차갑구나|차갑네|차갑군 고소하구나|고소하네|고소하군
					담백하구나|담백하네|담백하군
				`),casual:a("달아|달지 짜|짜지 매워|맵지 셔|시지 뜨거워|뜨겁지 차가워|차갑지 고소해|고소하지 담백해|담백하지"),polite:a("달아요|달죠 짜요|짜죠 매워요|맵죠 셔요|시죠 뜨거워요|뜨겁죠 차가워요|차갑죠 고소해요|고소하죠 담백해요|담백하죠"),formal:a("답니다 짭니다 맵습니다 십니다 뜨겁습니다 차갑습니다 고소합니다 담백합니다"),formalQuestion:a("답니까 짭니까 맵습니까 십니까 뜨겁습니까 차갑습니까 고소합니까 담백합니까")}},{subject:["idea"],words:a("어렵다 쉽다 분명하다 흐릿하다 영원하다 덧없다"),forms:{question:a("어려우니|어려운가 쉬우니|쉬운가 분명하니|분명한가 흐릿하니|흐릿한가 영원하니|영원한가 덧없으니|덧없는가"),exclamation:a("어렵구나|어렵네|어렵군 쉽구나|쉽네|쉽군 분명하구나|분명하네|분명하군 흐릿하구나|흐릿하네|흐릿하군 영원하구나|영원하네|영원하군 덧없구나|덧없네|덧없군"),casual:a("어려워|어렵지 쉬워|쉽지 분명해|분명하지 흐릿해|흐릿하지 영원해|영원하지 덧없어|덧없지"),polite:a("어려워요|어렵죠 쉬워요|쉽죠 분명해요|분명하죠 흐릿해요|흐릿하죠 영원해요|영원하죠 덧없어요|덧없죠"),formal:a("어렵습니다 쉽습니다 분명합니다 흐릿합니다 영원합니다 덧없습니다"),formalQuestion:a("어렵습니까 쉽습니까 분명합니까 흐릿합니까 영원합니까 덧없습니까")}},{subject:["plant"],words:a("푸르다 무성하다 향기롭다 시들하다"),forms:{question:a("푸르니|푸른가 무성하니|무성한가 향기로우니|향기로운가 시들하니|시들한가"),exclamation:a("푸르구나|푸르네|푸르군 무성하구나|무성하네|무성하군 향기롭구나|향기롭네|향기롭군 시들하구나|시들하네|시들하군"),casual:a("푸르러|푸르지 무성해|무성하지 향기로워|향기롭지 시들해|시들하지"),polite:a("푸르러요|푸르죠 무성해요|무성하죠 향기로워요|향기롭죠 시들해요|시들하죠"),formal:a("푸릅니다 무성합니다 향기롭습니다 시들합니다"),formalQuestion:a("푸릅니까 무성합니까 향기롭습니까 시들합니까")}},{subject:["body"],words:a("따뜻하다 차갑다 아프다 뻣뻣하다"),forms:{question:a("따뜻하니|따뜻한가 차가우니|차가운가 아프니|아픈가 뻣뻣하니|뻣뻣한가"),exclamation:a("따뜻하구나|따뜻하네|따뜻하군 차갑구나|차갑네|차갑군 아프구나|아프네|아프군 뻣뻣하구나|뻣뻣하네|뻣뻣하군"),casual:a("따뜻해|따뜻하지 차가워|차갑지 아파|아프지 뻣뻣해|뻣뻣하지"),polite:a("따뜻해요|따뜻하죠 차가워요|차갑죠 아파요|아프죠 뻣뻣해요|뻣뻣하죠"),formal:a("따뜻합니다 차갑습니다 아픕니다 뻣뻣합니다"),formalQuestion:a("따뜻합니까 차갑습니까 아픕니까 뻣뻣합니까")}}],manners:a(`
		조용히 천천히 빠르게 가만히 슬며시 문득 함께 홀로 다시 계속 잠시 서서히 갑자기 언제나 여전히 조심스레 힘차게 나란히 살며시 묵묵히 느긋하게 씩씩하게 훌쩍 곧장 슬쩍
		사뿐히 성큼성큼 부지런히 유유히 냉큼 차분히 은근히 대뜸 나직이 느릿느릿 재빨리 가볍게 얌전히 무심히 덤덤히
	`),times:a(`
		새벽에 아침에 낮에 저녁에 밤에 한밤중에 오늘 어제 내일 봄에 여름에 가을에 겨울에 주말에 방금 가끔 매일 해질녘에 이른봄에 늦가을에 이른아침에 한낮에 정오에 초저녁에
		자정에 새해에 장마철에 명절에 휴일에 지난주에 다음주에 요즘 한때 오래전에
	`),connectives:{additive:a("그리고 게다가"),temporal:a("이윽고 곧 그러자 이내 어느새 마침내 그제야 한편"),contrastive:a("하지만 그런데 그러나 다만 오히려 그래도"),causal:a("그래서 그러므로 결국")},interjections:a(`
		아, 오, 와, 어머, 이런, 저런, 세상에, 아이고, 참, 어이쿠, 아이참, 어라, 우와, 이야,
	`),pronouns:{n:["","그것"]},pronounless:["person"],numeral:{order:"after",counters:{creature:"마리",person:"명",plant:"그루",edible:"개",thing:"개",vehicle:"대",place:"곳",event:"번",idea:"가지",body:"개"},count:[2,12],currency:"원",amounts:[1e3,5e3,1e4,3e4,5e4,1e5,3e5,5e5,1e6],group:",",gap:""},calendar:{date:"Y년 M월 D일",clock:"h시 mm분",years:[2020,2030],copula:{subject:["event"],words:a("이다"),forms:{question:a("이니|인가"),exclamation:a("이구나|이네"),casual:a("이야|이지"),polite:a("이에요|이죠"),formal:a("입니다"),formalQuestion:a("입니까")}}},frames:[{parts:[{slot:"date",tail:"에"},{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",tail:"에"},{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",tail:"는",tailAlt:"은"},{slot:"date",copula:"tail"}],weight:4},{parts:[{slot:"subject",tail:"는",tailAlt:"은"},{slot:"clock",copula:"tail"}],weight:4},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"object",tail:"를",tailAlt:"을",modifiable:!0},{slot:"verb"}],weight:18},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"place",tail:"에서",modifiable:!0},{slot:"verb"}],weight:14},{parts:[{slot:"subject",tail:"는",tailAlt:"은",modifiable:!0},{slot:"state"}],weight:12},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"manner"},{slot:"verb"}],weight:10},{parts:[{slot:"time"},{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"place",tail:"에서",modifiable:!0},{slot:"object",tail:"를",tailAlt:"을",modifiable:!0},{slot:"verb"}],weight:7},{parts:[{slot:"time"},{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"place",tail:"에서",modifiable:!0},{slot:"verb"}],weight:6},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"manner"},{slot:"object",tail:"를",tailAlt:"을",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"verb"}],weight:20,mood:"question"},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"object",tail:"를",tailAlt:"을",modifiable:!0},{slot:"verb"}],weight:16,mood:"question"},{parts:[{slot:"subject",tail:"는",tailAlt:"은",modifiable:!0},{slot:"state"}],weight:14,mood:"question"},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"place",tail:"에서",modifiable:!0},{slot:"verb"}],weight:12,mood:"question"},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"quantity",tail:"를",tailAlt:"을"},{slot:"verb"}],weight:6},{parts:[{slot:"quantity",tail:"가",tailAlt:"이"},{slot:"verb"}],weight:5},{parts:[{slot:"subject",tail:"가",tailAlt:"이",modifiable:!0},{slot:"money",tail:"를",tailAlt:"을"},{slot:"verb"}],weight:5}]},Ru={space:" ",capitalize:!0,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["«","»"],single:["„","“"]},predicateAgrees:!0,verbs:[{subject:["creature","person"],words:a(`
				бежит идёт прыгает плывёт летит ползёт возвращается уходит останавливается
				отдыхает спит смеётся плачет поёт танцует прячется ждёт стоит сидит катится
				бродит проходит приближается слушает
			`)},{subject:["place","event"],words:a("светится течёт темнеет светлеет углубляется затихает")},{subject:["thing","vehicle"],words:a("качается блестит падает катится клонится стареет")},{subject:["vehicle"],words:a("едет останавливается проезжает возвращается отправляется скользит")},{subject:["idea","event"],words:a("расходится исчезает остаётся плывёт нарастает")},{subject:["plant"],words:a("растёт вянет цветёт качается тянется")},{subject:["body"],words:a("дрожит движется немеет твердеет")},{subject:["edible"],words:a("зреет остывает кипит тает портится")}],states:[{subject:["creature","person"],words:a(`
				большой маленький быстрый медленный тихий шумный смелый ленивый голодный
				сонный дикий кроткий умный
			`)},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("красивый странный новый редкий")},{subject:["place","event"],words:a("широкий узкий спокойный глубокий тёмный светлый далёкий крутой")},{subject:["thing","vehicle"],words:a("твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный")},{subject:["edible"],words:a("сладкий солёный острый кислый горячий холодный")},{subject:["idea"],words:a("простой ясный смутный вечный мимолётный")},{subject:["plant"],words:a("зелёный пышный душистый увядший")},{subject:["body"],words:a("тёплый холодный больной жёсткий")}],manners:a(`
		тихо медленно быстро мягко вдруг едва снова вместе одиноко ещё ненадолго ровно смело осторожно
		жадно спокойно весело терпеливо легко чётко бодро лениво упрямо охотно шумно мерно
	`),times:a(`
		на_рассвете утром днём вечером ночью сегодня вчера завтра весной летом осенью зимой в_выходные
		только_что иногда каждый_день в_сумерках в_полночь на_прошлой_неделе на_следующей_неделе нынче
		давно в_праздники весь_день каждую_ночь
	`),connectives:{additive:a("и_потом"),temporal:a("затем наконец потом тем_временем"),contrastive:a("но однако а зато всё_же"),causal:a("поэтому в_итоге значит")},interjections:a(`
		ах, ох, эх, ух, боже, гляди, право, ой, ух_ты, батюшки, надо_же, эй,
	`),pronouns:{m:a("он"),f:a("она"),n:a("оно")},frames:[{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:26},{parts:[{slot:"subject",modifiable:!0},{slot:"manner"},{slot:"verb"}],weight:20},{parts:[{slot:"subject",modifiable:!0},{slot:"state"}],weight:20},{parts:[{slot:"time"},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:18},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:16},{parts:[{slot:"time"},{slot:"subject",modifiable:!0},{slot:"manner"},{slot:"verb"}],weight:12},{parts:[{slot:"manner"},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:14},{parts:[{slot:"time"},{slot:"subject",modifiable:!0},{slot:"state"}],weight:12},{parts:[{slot:"time"},{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:10}]},Vu={space:" ",capitalize:!0,terminators:{statement:".",question:"?",exclamation:"!",trailing:"…"},quotes:{double:["“","”"],single:["‘","’"]},numeral:{order:"before",counters:{creature:"con",person:"người",plant:"cây",edible:"cái",thing:"cái",vehicle:"chiếc",place:"nơi",event:"lần",idea:"điều",body:"cái"},count:[2,12],currency:"đồng",amounts:[1e4,5e4,1e5,2e5,5e5,1e6,5e6],group:".",gap:" "},verbs:[{subject:["creature","person"],words:a(`
				chạy đi_bộ nhảy bơi bay bò trở_về rời_đi dừng_lại nghỉ_ngơi ngủ cười khóc hát
				nhảy_múa trốn chờ đứng ngồi lăn lang_thang đi_qua đến_gần lắng_nghe
			`)},{subject:["creature","person"],object:["edible"],words:a("ăn uống nhai nếm nướng hâm_nóng")},{subject:["creature","person"],object:["thing","plant","edible"],words:a("nhìn tìm nhặt mang chạm giữ chọn di_chuyển thu_thập")},{subject:["person"],object:["thing","vehicle"],words:a("làm sửa lau bán mua xây")},{subject:["person","creature"],object:["idea","event","place"],words:a("nhớ quên tưởng_tượng đếm")},{subject:["place","event"],words:a("tỏa_sáng chảy tối_dần sáng_lên sâu_thêm lặng_đi")},{subject:["thing","vehicle"],words:a("lung_lay lấp_lánh rơi lăn nghiêng cũ_đi")},{subject:["vehicle"],words:a("chạy dừng_lại đi_qua trở_về khởi_hành trượt")},{subject:["idea","event"],words:a("lan_ra biến_mất còn_lại trôi đậm_thêm")},{subject:["plant"],words:a("mọc héo nở đung_đưa vươn_lên")},{subject:["body"],words:a("run động tê cứng_lại")},{subject:["edible"],words:a("chín nguội sôi tan hỏng")}],states:[{subject:["creature","person"],words:a("to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận đói buồn_ngủ dữ hiền thông_minh")},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("đẹp lạ mới phổ_biến hiếm")},{subject:["place","event"],words:a("rộng hẹp yên_tĩnh sâu tối sáng xa dốc")},{subject:["thing","vehicle"],words:a("cứng nhẹ nặng cũ trơn trong_suốt chắc")},{subject:["edible"],words:a("ngọt mặn cay chua nóng lạnh bùi")},{subject:["idea"],words:a("đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua")},{subject:["plant"],words:a("xanh um_tùm thơm héo_úa")},{subject:["body"],words:a("ấm lạnh đau cứng")}],manners:a(`
		lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng đột_nhiên khẽ lại cùng_nhau một_mình một_lát đều_đặn
		mạnh_mẽ cẩn_thận háo_hức từ_từ vội_vã êm_ái chăm_chú thản_nhiên vui_vẻ bình_thản hối_hả
		kiên_nhẫn thong_thả
	`),times:a(`
		lúc_bình_minh vào_buổi_sáng vào_buổi_trưa vào_buổi_chiều vào_ban_đêm hôm_nay hôm_qua ngày_mai
		vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vừa_rồi đôi_khi mỗi_ngày
		lúc_hoàng_hôn lúc_nửa_đêm vào_giữa_trưa tuần_trước tuần_sau dạo_này ngày_xưa vào_ngày_lễ cả_ngày
		mỗi_tối
	`),connectives:{additive:a("ngoài_ra"),temporal:a("rồi và_rồi sau_đó cuối_cùng sau_cùng thế_rồi đồng_thời"),contrastive:a("nhưng tuy_vậy tuy_nhiên dù_vậy"),causal:a("thế_là vì_thế rốt_cuộc")},interjections:a(`
		ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy, ái_chà, ê, ơ_kìa, khiếp, ối,
	`),pronouns:{n:["","nó"]},pronounless:["person"],calendar:{date:"ngày D tháng M năm Y",clock:"h giờ mm",years:[2020,2030],copula:{subject:["event"],words:a("là")}},frames:[{parts:[{slot:"date",head:"vào",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",head:"lúc",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"date",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"clock",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:18},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"trong",modifiable:!0}],weight:14},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"rất"}],weight:12},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"manner"}],weight:10},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"place",head:"trong",modifiable:!0}],weight:7},{parts:[{slot:"time",tail:","},{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"place",head:"trong",modifiable:!0}],weight:6},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0},{slot:"manner"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"verb",head:"có"}],weight:20,mood:"question",tag:"không"},{parts:[{slot:"subject",modifiable:!0},{slot:"verb",head:"có"},{slot:"object",modifiable:!0}],weight:16,mood:"question",tag:"không"},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"có"}],weight:14,mood:"question",tag:"không"},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"quantity"}],weight:6},{parts:[{slot:"quantity"},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"money"}],weight:5}]},qu={space:"",capitalize:!1,terminators:{statement:"。",question:"？",exclamation:"！",trailing:"…"},quotes:{double:["“","”"],single:["‘","’"]},verbs:[{subject:["creature","person"],words:a(`
				奔跑 行走 跳跃 游泳 飞翔 爬行 返回 离开 停下 休息 睡觉 微笑 哭泣 歌唱 跳舞
				躲藏 等待 站立 坐下 打滚 徘徊 经过 靠近 倾听
			`)},{subject:["creature","person"],object:["edible"],words:a("吃 喝 咀嚼 品尝 烘烤 加热")},{subject:["creature","person"],object:["thing","plant","edible"],words:a("观看 寻找 捡起 搬运 触摸 守护 挑选 移动 收集")},{subject:["person"],object:["thing","vehicle"],words:a("制作 修理 擦拭 出售 购买 建造")},{subject:["person","creature"],object:["idea","event","place"],words:a("记得 忘记 想象 数")},{subject:["place","event"],words:a("发光 流淌 变暗 变亮 加深 沉寂 染色")},{subject:["thing","vehicle"],words:a("摇晃 闪耀 掉落 滚动 倾斜 老化")},{subject:["vehicle"],words:a("行驶 停下 经过 返回 出发 滑行")},{subject:["idea","event"],words:a("蔓延 消失 留下 飘荡 加深")},{subject:["plant"],words:a("生长 枯萎 开花 摇曳 舒展")},{subject:["body"],words:a("颤抖 移动 麻木 僵硬")},{subject:["edible"],words:a("成熟 冷却 沸腾 融化 变质")}],states:[{subject:["creature","person"],words:a("大 小 快 慢 安静 吵闹 勇敢 懒 忙 饿 困 凶 温和 聪明")},{subject:["creature","person","plant","edible","thing","vehicle","place","event","idea","body"],words:a("美丽 陌生 新 常见 罕见")},{subject:["place","event"],words:a("宽阔 狭窄 平静 深 暗 亮 遥远 陡峭")},{subject:["thing","vehicle"],words:a("坚硬 轻 重 旧 光滑 透明 结实")},{subject:["edible"],words:a("甜 咸 辣 酸 烫 凉 香")},{subject:["idea"],words:a("简单 明显 模糊 永恒 短暂")},{subject:["plant"],words:a("青翠 茂盛 芬芳 枯黄")},{subject:["body"],words:a("温暖 冰凉 酸痛 僵硬")}],manners:a(`
		安静地 慢慢地 迅速地 静静地 悄悄地 忽然 一起 独自 又 一直 渐渐地 稍稍 总是 仍然 小心地 有力地 并排 轻轻地 用力地 认真地 匆匆地 缓缓地 默默地 从容地 欢快地 稳稳地
		淡淡地 反复 依旧
	`),times:a(`
		黎明时 早晨 中午 傍晚 夜里 深夜 今天 昨天 明天 春天 夏天 秋天 冬天 周末 刚才 有时 每天 黄昏时 正午 午夜 上周 下周 最近 从前 假日 整天 每晚
	`),connectives:{additive:a("而且"),temporal:a("然后 后来 接着 同时 终于 随后"),contrastive:a("但是 不过 可是 然而"),causal:a("所以 于是 因此 结果")},interjections:a(`
		啊， 哎呀， 哇， 唉， 天啊， 瞧， 咦， 呀， 嘿， 哟， 好家伙， 我的天，
	`),pronouns:{n:["","它"]},pronounless:["person"],numeral:{order:"after",counters:{creature:"只",person:"位",plant:"棵",edible:"个",thing:"个",vehicle:"辆",place:"处",event:"次",idea:"种",body:"个"},count:[2,12],currency:"元",amounts:[100,500,1e3,3e3,5e3,1e4,3e4,5e4,1e5],group:",",gap:""},calendar:{date:"Y年M月D日",clock:"h点mm分",years:[2020,2030],copula:{subject:["event"],words:a("是")}},frames:[{parts:[{slot:"date",head:"在"},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"clock",head:"在"},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"date",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"clock",copula:"head"}],weight:4},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:20},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:18},{parts:[{slot:"subject",modifiable:!0},{slot:"place",head:"在",tail:"里",modifiable:!0},{slot:"verb"}],weight:14},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"很"}],weight:12},{parts:[{slot:"subject",modifiable:!0},{slot:"manner"},{slot:"verb"}],weight:10},{parts:[{slot:"time"},{slot:"subject",modifiable:!0},{slot:"verb"}],weight:8},{parts:[{slot:"subject",modifiable:!0},{slot:"place",head:"在",tail:"里",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:7},{parts:[{slot:"time"},{slot:"subject",modifiable:!0},{slot:"place",head:"在",tail:"里",modifiable:!0},{slot:"verb"}],weight:6},{parts:[{slot:"subject",modifiable:!0},{slot:"manner"},{slot:"verb"},{slot:"object",modifiable:!0}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"}],weight:20,mood:"question",tag:"吗"},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"object",modifiable:!0}],weight:16,mood:"question",tag:"吗"},{parts:[{slot:"subject",modifiable:!0},{slot:"state",head:"很"}],weight:14,mood:"question",tag:"吗"},{parts:[{slot:"subject",modifiable:!0},{slot:"place",head:"在",tail:"里",modifiable:!0},{slot:"verb"}],weight:12,mood:"question",tag:"吗"},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"quantity"}],weight:6},{parts:[{slot:"quantity"},{slot:"verb"}],weight:5},{parts:[{slot:"subject",modifiable:!0},{slot:"verb"},{slot:"money"}],weight:5}]},Ie={animal:"creature",myth:"creature",job:"person",plant:"plant",food:"edible",drink:"edible",object:"thing",tool:"thing",clothing:"thing",product:"thing",gem:"thing",music:"thing",vehicle:"vehicle",place:"place",nature:"place",space:"place",weather:"event",sport:"event",time:"event",concept:"idea",emotion:"idea",finance:"idea",tech:"idea",color:"idea",body:"body"},Ee={en:Nu,ko:Fu,ja:Du,zh:qu,vi:Vu,es:Eu,it:$u,de:Hu,ru:Ru},Gu=14,Wu=45,Ou=65,fo=["subject","object","place","quantity"];function tn(e){return fo.includes(e)}const Ku="idea";function Iu(e){return Vn(e)!=="quantity"&&!e.parts.some(n=>n.copula!==void 0)}function Vn(e){return e.parts.some(n=>n.slot==="subject")?"subject":"quantity"}function ho(e){const n=Vn(e);return e.parts.some(t=>t.slot==="object"||t.slot==="money"||t.slot==="quantity"&&n!=="quantity")}function qn(e,n){return String(e).replace(/\B(?=(\d{3})+(?!\d))/g,n)}function Ju(e){const n=e.calendar,[t,o]=n.years,i=Ce(1,12),r=n.date.replace("Y",String(Ce(t,o))).replace("D",String(Ce(1,28)));return n.months?r.replace("MMMM",n.months[i-1]):r.replace("M",String(i))}function Uu(e){return e.calendar.clock.replace("h",String(Ce(0,23))).replace("mm",String(Ce(0,59)).padStart(2,"0"))}function Ca(e,n){const t=e.calendar;if(!t)return[1,1];if(n==="clock"){const l=t.clock.replace("h","").replace("mm","").length;return[l+1+2,l+2+2]}const o=(t.months?t.date.replace("MMMM",""):t.date.replace("M","")).replace("Y","").replace("D","").length,i=t.months?de(t.months):[1,2],r=[String(t.years[0]).length,String(t.years[1]).length];return[o+i[0]+r[0]+1,o+i[1]+r[1]+2]}function Yu(e,n){const t=e.numeral,o=t.counters[Ie[n]]??"",[i,r]=t.count,l=qn(Ce(i,r),t.group);return o?l+t.gap+o:l}function Zu(e){const n=e.numeral;return qn(J(n.amounts),n.group)+n.gap+n.currency}function go(e){const n=e.numeral;if(!n)return[0,0];const t=Object.values(n.counters),o=r=>qn(r,n.group).length,i=t.length?[Math.min(...t.map(r=>r.length))+n.gap.length,Math.max(...t.map(r=>r.length))+n.gap.length]:[0,0];return[e.space.length+o(n.count[0])+i[0],e.space.length+o(n.count[1])+i[1]]}function Qu(e){const n=e.numeral;if(!n)return[1,1];const t=n.amounts.map(o=>qn(o,n.group).length+n.gap.length+n.currency.length);return[Math.min(...t),Math.max(...t)]}const po=["statement","question","exclamation"],ft=["dialogue","thought"],Xu=["statement","trailing"],ed={statement:100,dialogue:34,trailing:16,question:14,thought:12,exclamation:10},nd={statement:100,question:34,exclamation:22,trailing:16},td=6,Dt=.45,bo=["plain","casual","polite","formal"],ad=["casual","polite","formal"],od=["plain","casual"];function id(e,n,t){return n||(e==="dialogue"?J(ad):e==="thought"?J(od):t)}function vo(e,n,t){return n!=="dialogue"&&n!=="thought"?null:e.quotes[t??(n==="dialogue"?"double":"single")]}function Ft(e){return e==="question"?"question":"statement"}function _o(e){return e.parts.length<=2?"simple":e.parts.length===3?"detailed":"complex"}function yo(e,n){return n==="none"?e.parts.every(t=>t.slot==="subject"||t.slot==="verb"||t.slot==="state"):e.parts.some(t=>n.includes(t.slot))}function Rt(e,n,t){const o=e.frames.filter(b=>(b.mood??"statement")===t),i=o.length?o:e.frames.filter(b=>(b.mood??"statement")==="statement"),r=i.length?i:e.frames,l=n.includeName?r.filter(Iu):r,m=l.length?l:r,c=n.slots==="all"?m:m.filter(b=>yo(b,n.slots)),h=c.length?c:m;if(n.shape==="all")return h;const d=h.filter(b=>_o(b)===n.shape);return d.length?d:h}function za(e,n){return n.slots!=="all"&&!e.frames.some(t=>yo(t,n.slots))?!1:n.shape==="all"||e.frames.some(t=>_o(t)===n.shape)}function rd(e){const n=ce.filter(o=>za(Ee[o],e)&&e.include.every(i=>ko(o,i).known));if(n.length)return n;const t=ce.filter(o=>za(Ee[o],e));return t.length?t:ce}const ld={phrase:new Map,modifier:new Map};function Ve(e,n){const t=n.toLowerCase();return e.find(o=>o.toLowerCase()===t)??null}function ko(e,n){const t=ge[e],o=Ee[e],i=[];let r=n,l;for(const d of le){const b=Ve(t.nouns[d],n);if(b){r=an(t,b),l=d,i.push("subject");break}}for(const d of o.verbs){const b=Ve(d.words,n);if(b){r=b,i.push("verb");break}}for(const d of o.states){const b=Ve(d.words,n);if(b){r=b,i.push("state");break}}const m=Ve(o.manners,n);m&&(r=m,i.push("manner"));const c=Ve(o.times,n);c&&(r=c,i.push("time"));const h=Ve(t.adjectives,n)??Ve(t.actions,n);return h&&(r=an(t,h),i.push("modifier")),i.length?{word:r,slots:i,theme:l,known:!0}:{word:n,slots:["subject"],known:!1}}function sd(e,n,t){if(!n.length&&!(t!=null&&t.size))return{plan:ld,complete:!0};const o={phrase:new Map,modifier:new Map};let i=!0;if(t)for(const[r,l]of t){const m=r==="subject"?Vn(e):r,c=e.parts.findIndex(h=>h.slot===m);c>=0&&o.phrase.set(c,l)}for(const r of n){const l=r.slots.some(m=>{if(m==="modifier"){const d=e.parts.findIndex((b,y)=>b.modifiable&&!o.modifier.has(y));return d<0?!1:(o.modifier.set(d,r),!0)}const c=tn(m)?fo:[m],h=e.parts.findIndex((d,b)=>c.includes(d.slot)&&!o.phrase.has(b));return h<0?!1:(o.phrase.set(h,r),!0)});i=i&&l}return{plan:o,complete:i}}function Qe(e,n,t){for(const[o,i]of n.phrase)if(e.parts[o].slot===t)return i}const Ta=new Map,Pa=new Map,xa=new Map,Aa=new Map;function Vt(e,n){const t=`${e}:${n}`,o=Ta.get(t);if(o)return o;const i=ge[e],r=i.nounGender?i.nouns[n].filter(m=>{const c=i.nounGender[m];return c!=="p"&&c!=="fp"}):i.nouns[n],l=r.length?r:i.nouns[n];return Ta.set(t,l),l}function md(e,n,t){const o=`${e}:${n}:${t}`,i=xa.get(o);if(i)return i;const[r,l]=de(Vt(e,n)),[m,c]=bc(ge[e].syn),h=t>=100?[m,c]:t<=0?[r,l]:[Math.min(r,m),Math.max(l,c)];return xa.set(o,h),h}function So(e,n){const t=ge[e];if(!n||!t.agreement)return t.adjectives;const o=`${e}:${n}`,i=Aa.get(o);if(i)return i;const r=t.adjectives.map(l=>gn(t,l,n));return Aa.set(o,r),r}function qt(e){const n=Pa.get(e);if(n)return n;const t=ge[e],o=Ee[e],i=m=>{let c=1/0,h=0;for(const d of m){const[b,y]=de(d);c=Math.min(c,b),h=Math.max(h,y)}return[c===1/0?1:c,h||1]},r=t.agreement?[void 0,...Object.keys(t.agreement)]:[void 0],l={noun:i(le.map(m=>Vt(e,m))),modifier:i(r.map(m=>So(e,m))),verb:i(o.verbs.flatMap(m=>[m.words,...Object.values(m.forms??{}).map(gt)])),state:i(o.states.flatMap(m=>[m.words,...Object.values(m.forms??{}).map(gt)])),manner:i([o.manners]),time:i([o.times]),money:Qu(o),date:Ca(o,"date"),clock:Ca(o,"clock")};return Pa.set(e,l),l}function Gt(e){if(!e.articles)return[0,0];let n=1/0,t=0;for(const o of Object.values(e.articles))for(const[,i]of o??[])n=Math.min(n,i.length),t=Math.max(t,i.length);return[n===1/0?0:n,t]}function wo(e,n){if(!e.copula||!n.calendar)return[0,0];const t=n.calendar.copula,o=[t.words,...Object.values(t.forms??{}).map(gt)];let i=1/0,r=0;for(const m of o){const[c,h]=de(m);i=Math.min(i,c),r=Math.max(r,h)}const l=e.copula==="head"?n.space.length:0;return[i+l,r+l]}function Mo(e,n,t){var B,E,H,I,ee;const o=n.space.length,[i,r]=wo(e,n),l=(e.head?e.head.length+o:0)+i,m=Math.min(((B=e.tail)==null?void 0:B.length)??0,((E=e.tailAlt)==null?void 0:E.length)??((H=e.tail)==null?void 0:H.length)??0),c=Math.max(((I=e.tail)==null?void 0:I.length)??0,((ee=e.tailAlt)==null?void 0:ee.length)??0)+(r-i);if(!tn(e.slot)){const[$,K]=t[e.slot];return[l+$+m,l+K+c]}const[h,d]=t.noun,[b,y]=e.bare?[0,0]:Gt(n),S=$=>$?$+o:0,M=e.modifiable?t.modifier[1]+o:0,[_,j]=e.slot==="quantity"?go(n):[0,0];return[l+S(b)+h+_+m,l+S(y)+M+d+j+c]}function xn(e,n,t){const o=Math.max(...Object.values(n.terminators).map(m=>m.length)),i=e.tag?e.tag.length+n.space.length:0;let r=o+i,l=r;for(let m=0;m<e.parts.length;m+=1){const c=m===0?0:n.space.length,[h,d]=Mo(e.parts[m],n,t);r+=c+h,l+=c+d}return[r,l]}function Gn(e,n,t){let o=1/0,i=0;for(const r of n){const[l,m]=xn(r,e,t);o=Math.min(o,l),i=Math.max(i,m)}return[o,i]}function cd(e){const n=Ee[e];return Gn(n,n.frames,qt(e))}function ud(e){return e==="all"?le:[e]}function Te(e,n){return e.filter(t=>n.includes(Ie[t]))}function dd(e,n){const t=r=>r.weight*(n?n(r):1),o=e.reduce((r,l)=>r+t(l),0);let i=Math.random()*o;for(const r of e)if(i-=t(r),i<=0)return r;return e[e.length-1]}function jo(e,n,t,o){const i=ho(n),r=n.parts.some(d=>d.slot==="money"),l=Qe(n,o,"subject"),m=Qe(n,o,"object"),c=Qe(n,o,"verb");return e.verbs.filter(d=>{var b,y;return!!d.object!==i||r&&!((b=d.object)!=null&&b.includes(Ku))||c&&!d.words.includes(c.word)||l!=null&&l.theme&&!d.subject.includes(Ie[l.theme])||m!=null&&m.theme&&!((y=d.object)!=null&&y.includes(Ie[m.theme]))?!1:Te(t,d.subject).length>0&&(!d.object||Te(le,d.object).length>0)})}function Lo(e,n,t,o){const i=Qe(t,o,"subject"),r=Qe(t,o,"state");return e.states.filter(l=>r&&!l.words.includes(r.word)||i!=null&&i.theme&&!l.subject.includes(Ie[i.theme])?!1:Te(n,l.subject).length>0)}function fd(e,n,t){var r,l;const o=((r=e.articles)==null?void 0:r[n??"n"])??((l=e.articles)==null?void 0:l.n);if(!o)return"";const i=t.toLowerCase();for(const[m,c]of o)if(i.startsWith(m))return c;return""}function an(e,n){return e.capitalize?n.charAt(0).toLowerCase()+n.slice(1):n}function ht(e,n){return e.capitalize?Ln(n):n}function hd(e,n,t,o,i,r,l,m,c,h,d,b,y){var ke;const S=ge[e],M=Vt(e,t),_=n.space.length,[,j]=b,[B,E]=de(S.adjectives),[,H]=r?[0,0]:Gt(n),I=H?H+_:0,ee=i?B+_:0,$=Math.max(1,Math.min(j,d-I-ee)),K=Math.max(1,h-I-(i?E+_:0)),U=o??an(S,ln(S,M,m,Math.min(K,$),$,c).word),q=rn(S,ht(S,U)),Q=[U];if(i){const re=d-I-U.length-_,Se=h-I-U.length-_,we=So(e,q),De=(l?gn(S,l,q):null)??an(S,At(we,Math.max(1,Math.min(Se,re)),Math.max(1,Math.min(E,re)),"")??J(we));to(S)?Q.push(De):Q.unshift(De)}y&&(((ke=n.numeral)==null?void 0:ke.order)==="before"?Q.unshift(y):Q.push(y));const ue=r?"":fd(n,q,Q[0]);return{text:ue.endsWith("'")?ue+Q.join(n.space):[...ue?[ue]:[],...Q].join(n.space),noun:U,theme:M.some(re=>an(S,re)===U)?t:xt(S,ht(S,U))}}function gd(e,n,t){const o=gu(e,{includeSurname:!1,realism:n.realism,startsWith:t});return{text:o.native,gender:pd(o.gender)}}function pd(e){return e==="male"?"m":"f"}function Co(e){return Nt(e,!1)}function bd(e,n){return e.tailAlt&&ac(n)?e.tailAlt:e.tail??""}function vd(e,n){return e===0?Wu:n?0:100}function _d(e,n){const t=ud(e.theme),o=e.includeName?Te(t,["person"]):t,i=o.length?o:t;if(!(n!=null&&n.topic.class))return i;const r=n.topic.theme;if(r&&i.includes(r)&&ze(Ou))return[r];const l=Te(i,[n.topic.class]);return l.length?l:i}function Ba(e,n,t){const o=t.follow,i=t.budget,r=ge[e],l=Ee[e],m=Wt(e,n.includeName),c=Rt(l,n,Ft(t.mark)),h=_d(n,o),d=o?[]:n.include.map($=>ko(e,$)),b=new Map((o==null?void 0:o.scene)??[]);(o==null?void 0:o.reference)==="repeat"&&b.set("subject",{word:o.topic.noun,slots:["subject"],theme:o.topic.theme??void 0,known:o.topic.theme!==null});const[y,S]=i,M=new Map(c.map($=>[$,sd($,d,b)])),_=$=>{const{plan:K,complete:U}=M.get($);return U?$.parts.some(q=>q.slot==="state"||q.slot==="verb")?$.parts.some(q=>q.slot==="state")?Lo(l,h,$,K).length>0:jo(l,$,h,K).length>0:Te(h,l.calendar.copula.subject).length>0:!1},j=c.filter($=>{const[K,U]=xn($,l,m);return U>=y&&K<=S&&_($)}),B=c.filter(_),E=j.length?j:B.length?B:c;let H=null,I=1/0,ee=!1;for(let $=0;$<Gu;$+=1){const K=dd(E,$>0&&I>0?$e=>{const[ke,re]=xn($e,l,m);return(ee?ke<=y:re>=S)?4:1}:void 0),U=vd($===0?0:I,ee),q=Sd(e,r,l,K,M.get(K).plan,h,n,U,m,y,S,t);if(q.sentence.length>=y&&q.sentence.length<=S)return q;const Q=q.sentence.length-S,ue=Q>0?Q:y-q.sentence.length;ue<I&&(I=ue,ee=Q>0,H=q)}return H}function yd(e,n,t,o){const i=o.sentences,r=e.space.length*(i-1),[l,m]=Gn(e,n,t);return En(o.minLength,o.maxLength,l*i+r,m*i+r,rt*i+r)}function Zn(e,[n,t]){return e>t?e-t:Math.max(0,n-e)}function kd(e,n,t,o){if(t===1)return[[e,n]];const i=o*(t-1),r=c=>{const h=Math.max(t,c-i),d=Math.floor(h/t),b=new Array(t).fill(d);return b[t-1]=h-d*(t-1),b},l=r(e),m=r(n);return l.map((c,h)=>[Math.max(1,c),Math.max(c,m[h])])}function Sd(e,n,t,o,i,r,l,m,c,h,d,b){var It,Jt,Ut,Yt;const y=b.follow,S=r.length?r:le,M=o.parts.some(R=>R.slot==="state")?"state":o.parts.some(R=>R.slot==="verb")?"verb":"copula",_=M==="copula"?[t.calendar.copula]:M==="state"?Lo(t,S,o,i):jo(t,o,S,i),j=J(_.length?_:Ld(t,o,M)),B=jd(j,b.mark,b.style),E=Te(S,j.subject),H=Vn(o),I=Qe(o,i,H),ee=(I==null?void 0:I.theme)??J(E.length?E:S),$=(y==null?void 0:y.reference)==="pronoun"?y.pronoun:null,K=[];o.parts.forEach((R,D)=>{if(R.slot!=="subject"||$===null){K.push({part:R,at:D});return}$&&K.push({part:R,at:D})});const U=K.map(({part:R,at:D})=>{var me;return tn(R.slot)?R.slot===H?ee:((me=i.phrase.get(D))==null?void 0:me.theme)??Cd(R.slot,j,S):null}),q=K.map(({part:R,at:D},me)=>{if(R.slot==="subject"&&$)return $;if(R.slot==="subject"&&(y==null?void 0:y.reference)==="repeat"&&y.topic.named)return y.topic.noun;if(i.phrase.has(D)||R.slot==="quantity")return null;const pe=U[me];return l.includeName&&pe&&Ie[pe]==="person"?"":null}),Q=K.map((R,D)=>q[D]===null?R:{...R,part:{...R.part,modifiable:!1,bare:!0}}),ue=Q.map(({part:R,at:D},me)=>{const pe=U[me],je=i.phrase.get(D),Ue=q[me]||(je==null?void 0:je.word),Fe=Ue?[Ue.length,Ue.length]:null;if(pe){const en=i.modifier.get(D),vn=q[me]===""?Co(e):md(e,pe,l.invent);return{...c,noun:Fe??vn,modifier:en?[en.word.length,en.word.length]:c.modifier}}return R.slot==="verb"||R.slot==="state"?{...c,[R.slot]:Fe??de(B)}:Fe?{...c,[R.slot]:Fe}:c}),$e=Q[0].part,ke=!y&&tn($e.slot)&&!$e.head&&!t.articles,re=t.space.length,Se=b.opener,we=t.terminators[b.mark],De=((It=t.openers)==null?void 0:It[b.mark])??"",[L,u]=b.quote??["",""],v=o.tag?t.space+o.tag:"",X=Q.map(({part:R},D)=>{const[me,pe]=Mo(R,t,ue[D]),je=D===0?0:re;return[je+me,je+pe]}),G=[],Me=[],Wn=[],pn=[],Ot=[],Kt=new Map;let xe,Xe=!1,bn=q.some(R=>R)?y==null?void 0:y.topic.gender:void 0,On=we.length+De.length+v.length+L.length+u.length+(Se?Se.length+re:0);Se&&G.push(t.capitalize?Ln(Se):Se);for(let R=0;R<Q.length;R+=1){const{part:D,at:me}=Q[R];let pe=0,je=0;for(let oe=R+1;oe<Q.length;oe+=1)pe+=X[oe][0],je+=X[oe][1];const Ue=R===0?0:re,Fe=(D.head?D.head.length+re:0)+wo(D,t)[0],en=Math.min(((Jt=D.tail)==null?void 0:Jt.length)??0,((Ut=D.tailAlt)==null?void 0:Ut.length)??((Yt=D.tail)==null?void 0:Yt.length)??0),vn=Ue+Fe+en,In=Math.max(1,d-On-vn-pe),Jn=Math.max(1,h-On-vn-je);let Ae;if(D.slot==="money")Ae=Zu(t);else if(q[R]!==null){if(q[R])Ae=q[R];else{const oe=gd(e,l,ke&&R===0?l.prefix:"");Ae=oe.text,pn.push(oe.text),D.slot==="subject"&&(bn=oe.gender)}D.slot==="subject"&&(Xe=!0)}else if(tn(D.slot)){const oe=i.phrase.get(me),yn=i.modifier.get(me),na=U[R],[ta,aa]=ue[R].noun,[,oa]=D.bare?[0,0]:Gt(t),Po=D.slot==="quantity"?go(t)[1]:0,xo=In-ta-Po,Ao=Jn>(oa?oa+re:0)+aa,Bo=D.slot!=="quantity"&&(D.modifiable??!1)&&(!!yn||Ao||xo>=c.modifier[0]+re&&ze(m)),kn=hd(e,t,na,oe==null?void 0:oe.word,Bo,D.slot==="quantity"||(D.bare??!1),yn==null?void 0:yn.word,l.invent,ke&&R===0?l.prefix:"",Jn,In,[ta,aa],D.slot==="quantity"?Yu(t,na):"");Ae=kn.text,D.slot===H&&(xe=kn,bn=rn(n,ht(n,kn.noun))),(D.slot==="place"||D.slot==="object")&&Kt.set(D.slot,kn)}else{const oe=wd(D.slot,n,t,j.words,B,i.phrase.get(me),bn,Jn,In,b.avoid);Ae=oe.text,oe.base&&Ot.push(oe.base)}const Zt=D.copula?zo(J(B)):"",Qt=t.capitalize&&!G.length,_n=[D.copula==="head"?Zt:"",D.head??""].filter(Boolean).join(t.space),Xt=Qt&&_n?Ln(_n):_n,Ye=Qt&&!_n?Ln(Ae):Ae,ea=(D.copula==="tail"?Zt:"")+bd(D,Ye);Xt&&G.push(Xt),G.push(Ye+ea),Me.push(Ye),Wn.push(D.slot),On+=Ue+Fe+Ye.length+ea.length,q[R]===""&&Ye!==Ae&&(pn[pn.length-1]=Ye)}const To=Xe?Me[Wn.indexOf("subject")]:(xe==null?void 0:xe.noun)??($?y.topic.noun:null),Kn=new Map((y==null?void 0:y.scene)??[]);for(const[R,D]of Kt)Kn.has(R)||Kn.set(R,{word:D.noun,slots:[R],theme:D.theme??void 0,known:D.theme!==null});return{sentence:L+De+G.join(t.space)+v+we+u,phrases:Me,slots:Wn,names:pn,used:Ot,type:b.type,scene:Kn,theme:Xe?null:(xe==null?void 0:xe.theme)??null,subject:To??null,gender:xe||Xe?bn:$!==null?y.topic.gender:void 0,named:Xe||$!==null&&((y==null?void 0:y.topic.named)??!1)}}function wd(e,n,t,o,i,r,l,m,c,h){const d=j=>e==="state"&&t.predicateAgrees?gn(n,j,l):j;if(r){const j=o.indexOf(r.word);return{text:d(j>=0?i[j]??r.word:r.word),base:r.word}}if(e==="date")return{text:Ju(t),base:""};if(e==="clock")return{text:Uu(t),base:""};const b=e==="manner"?t.manners:e==="time"?t.times:i,y=j=>b===i?o[j]??b[j]:b[j],S=Math.min(m,c),M=b.filter((j,B)=>!h.has(y(B))&&j.length>=S&&j.length<=c),_=M.length?J(M):At(b,S,c,"")??J(b);return{text:d(_),base:y(b.indexOf(_))}}const Md={plain:{statement:[],trailing:[],question:["question"],exclamation:["exclamation"]},casual:{statement:["casual"],trailing:["casual"],question:["casual","question"],exclamation:["casual","exclamation"]},polite:{statement:["polite"],trailing:["polite"],question:["polite","question"],exclamation:["polite","exclamation"]},formal:{statement:["formal","polite"],trailing:["formal","polite"],question:["formalQuestion","formal","polite","question"],exclamation:["formal","polite","exclamation"]}};function zo(e){return e.includes("|")?J(e.split("|")):e}function gt(e){return e.flatMap(n=>n.includes("|")?n.split("|"):[n])}function jd(e,n,t){const o=e.forms;for(const i of Md[t][n]){const r=o==null?void 0:o[i];if(r)return r.map(zo)}return e.words}function Ln(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ld(e,n,t){return t==="copula"?[e.calendar.copula]:t==="state"?[...e.states]:e.verbs.filter(o=>!!o.object===ho(n))}function Cd(e,n,t){if(e==="object"||e==="quantity"){const i=Te(le,n.object??[]);return J(i.length?i:le)}const o=Te(le,["place"]);return J(o.length?o:t)}const zd=40,Td=65,Pd=.4,Ha=["additive","temporal","contrastive","causal"],Na={repeat:25,pronoun:40,fresh:35},xd=.6;function Ad(e){return e.subject?{noun:e.subject,theme:e.theme,class:e.named?"person":e.theme?Ie[e.theme]:null,gender:e.gender,named:e.named}:null}function Bd(e,n){var i;const t=n.gender?e.pronouns[n.gender]:void 0,o=t??e.pronouns.n??[];return!t&&n.class&&((i=e.pronounless)!=null&&i.includes(n.class))?o.filter(r=>!r):o}function Hd(e,n,t,o){const i=Bd(e,n),r=n.named?["repeat","pronoun"]:["repeat","pronoun","fresh"],l=i.length?r:r.filter(h=>h!=="pronoun"),c=Pn(l,h=>h!=="repeat"?Na[h]:Na[h]*(o?Dt:1)*(n.named?xd:1));return{topic:n,reference:c,pronoun:c==="pronoun"?J(i):"",scene:t}}function Nd(e,n,t,o,i,r){const l=o-e.space.length-i,m=d=>d.filter(b=>b.length<=l&&!r.openers.has(b)),c=r.opened?Pd:1;if(n==="exclamation"){const d=m(e.interjections);if(d.length&&ze(Td*c))return J(d)}if(!t)return"";const h=m(Ed(e,t,n));return h.length&&ze(zd*c)?J(h):""}function Ed(e,n,t){return(n.reference!=="fresh"&&(t==="statement"||t==="trailing")?Ha:Ha.filter(r=>r!=="causal")).flatMap(r=>e.connectives[r]??[])}function $d(e,n,t,o,i){const r=(_,j)=>Rt(e,n,Ft(_)).some(B=>{const[E,H]=xn(B,e,t);return E<=j[1]&&H>=j[0]}),l=_=>_==="dialogue"||_==="thought"?po:[_],m=_=>{const j=vo(e,_,n.quote),B=j?j[0].length+j[1].length:0;return[o[0]-B,o[1]-B]},c=i.lead,h=c?n.types.filter(_=>ft.includes(c)?_===c||Xu.includes(_):!ft.includes(_)):n.types,d=h.length?h:n.types,b=d.filter(_=>l(_).some(j=>r(j,m(_)))),y=b.length?b:d,S=Pn(y,_=>Dd(_,i)),M=l(S).filter(_=>r(_,m(S)));return[S,Pn(M.length?M:l(S),_=>Fd(_,i))]}function Dd(e,n){const t=n.lead!==null&&ft.includes(n.lead),o=ed[e]*(t&&e===n.lead?td:1);return e===n.last&&e!=="statement"?o*Dt**n.run:o}function Fd(e,n){const t=nd[e];return e===n.mark&&e!=="statement"?t*Dt:t}function Wt(e,n){const t=qt(e);return n?{...t,subject:Co(e)}:t}function Rd(e,n,t,o,i){if(o.minLength===void 0)return!0;const r=o.sentences,l=e.space.length*(r-1),[,m]=Gn(e,n,Wt(i,!0));return o.minLength<=m*r+l}function Vd(e,n){const t=Ee[e],o=qt(e),i=n.types.flatMap(E=>(E==="dialogue"||E==="thought"?po:[E]).flatMap(H=>Rt(t,n,Ft(H)))),r=n.includeName??(Rd(t,i,o,n,e)&&ze(50)),l=n.includeName===r?n:{...n,includeName:r},m=Wt(e,r),[c]=Gn(t,i,m),[h,d]=yd(t,i,m,l),b=kd(h,d,n.sentences,t.space.length),y=[];let S=null,M=new Map;const _={lead:null,last:null,run:0,mark:null,opened:!1,openers:new Set,repeated:!0},j=new Set,B=n.style??J(bo);for(let E=0;E<n.sentences;E+=1){const H=b[E],[I,ee]=$d(t,l,m,H,_),$=S?Hd(t,S,M,_.repeated):null,K={budget:H,type:I,mark:ee,quote:vo(t,I,n.quote),opener:Nd(t,ee,$,H[1],c,_),style:id(I,n.style,B),avoid:j,follow:$};let U=Ba(e,l,K),q=K.opener;if(K.opener&&Zn(U.sentence.length,H)>0){const Q=Ba(e,l,{...K,opener:""});Zn(Q.sentence.length,H)<Zn(U.sentence.length,H)&&(U=Q,q="")}y.push(U),M=U.scene;for(const Q of U.used)j.add(Q);_.run=I===_.last?_.run+1:1,_.last=I,_.mark=ee,_.opened=!!q,_.lead??(_.lead=I),_.repeated=$?$.reference==="repeat":!0,q&&_.openers.add(q),S||(S=Ad(U))}return y}function qd(e){if(e===void 0||e==="all"||e==="none")return e??"all";const n=typeof e=="string"?[e]:e;return n.length?n:"none"}function Gd(e){const n=["statement","question","exclamation","trailing","dialogue","thought"];if(e===void 0||e==="all")return n;const o=(typeof e=="string"?[e]:e).filter(i=>n.includes(i));return o.length?o:n}function Wd(e){return e===void 0?[]:(typeof e=="string"?[e]:e).map(t=>t.trim()).filter(Boolean)}function Od(e){return{theme:e.theme??"all",shape:e.shape??"all",slots:qd(e.slots),invent:fn(e.realism),minLength:Ne(e.minLength),maxLength:Ne(e.maxLength),prefix:dn(e.startsWith),include:Wd(e.include),sentences:se(Math.floor(e.sentences??1),1,no),realism:e.realism??"real",includeName:typeof e.includeName=="boolean"?e.includeName:null,types:Gd(e.type),quote:e.quote,style:bo.includes(e.style)?e.style:null}}function Kd(e={}){const n=Od(e),t=e.language??"all";return $n(e,()=>{const o=hn(t,rd(n)),i=Ee[o],r=Vd(o,n);return{sentence:r.map(l=>l.sentence).join(i.space),sentences:r.map(l=>l.sentence),phrases:r.flatMap(l=>l.phrases),slots:r.flatMap(l=>l.slots),names:r.flatMap(l=>l.names),types:r.map(l=>l.type),language:o,theme:r[0].theme}},o=>o.sentence)}function Ea(e={}){const n=Kd(e);return e.output==="detail"?n:n.map(t=>t.sentence)}function Id(e="all"){const n=e==="all"?ce:[e];let t=1/0,o=0;for(const i of n){const[r,l]=cd(i);t=Math.min(t,r),o=Math.max(o,l)}return[se(t,_e,rt),se(o,_e,rt)]}function $a(e={}){const n=wc(e);return e.output==="detail"?n:n.map(t=>t.word)}function Jd(e="all",n="all"){const t=e==="all"?ce:[e];let o=1/0,i=0;for(const r of t){const[l,m]=kc(r,n);o=Math.min(o,l),i=Math.max(i,m)}return[se(o,_e,Oe),se(i,_e,Oe)]}const Ud={class:"randino-demo"},Yd={class:"randino-demo-tabs",role:"tablist"},Zd=["aria-selected"],Qd=["aria-selected"],Xd=["aria-selected"],ef=["aria-selected"],nf={class:"randino-demo-body"},tf={key:0,class:"randino-demo-fields"},af={class:"randino-demo-field"},of=["value"],rf={class:"randino-demo-field"},lf={class:"randino-demo-field"},sf={class:"randino-demo-field"},mf={class:"randino-demo-field"},cf={class:"randino-demo-field"},uf=["placeholder"],df={class:"randino-demo-field"},ff=["placeholder"],hf={class:"randino-demo-field"},gf={class:"randino-demo-check"},pf=["disabled"],bf={class:"randino-demo-check"},vf={key:1,class:"randino-demo-fields"},_f={class:"randino-demo-field"},yf=["value"],kf={class:"randino-demo-field"},Sf=["value"],wf={class:"randino-demo-field"},Mf={class:"randino-demo-field"},jf=["value"],Lf={class:"randino-demo-field randino-demo-wide"},Cf=["placeholder"],zf={class:"randino-demo-field"},Tf=["value"],Pf={class:"randino-demo-field"},xf=["value"],Af={class:"randino-demo-field"},Bf={class:"randino-demo-field"},Hf=["max"],Nf={class:"randino-demo-field"},Ef={class:"randino-demo-field"},$f={class:"randino-demo-field"},Df=["placeholder"],Ff={class:"randino-demo-field"},Rf=["placeholder"],Vf={class:"randino-demo-field"},qf={class:"randino-demo-check"},Gf={key:2,class:"randino-demo-fields"},Wf={class:"randino-demo-field"},Of=["value"],Kf={class:"randino-demo-field"},If=["value"],Jf={class:"randino-demo-field"},Uf={class:"randino-demo-field"},Yf={class:"randino-demo-field"},Zf=["placeholder"],Qf={class:"randino-demo-field"},Xf=["placeholder"],eh={class:"randino-demo-field"},nh={class:"randino-demo-check"},th={key:3,class:"randino-demo-fields"},ah={class:"randino-demo-field"},oh=["value"],ih={class:"randino-demo-field"},rh=["value"],lh={class:"randino-demo-field"},sh={class:"randino-demo-field"},mh={class:"randino-demo-field"},ch=["placeholder"],uh={class:"randino-demo-field"},dh=["placeholder"],fh={class:"randino-demo-field"},hh={class:"randino-demo-field"},gh={class:"randino-demo-check"},ph={class:"randino-demo-fields randino-demo-affix"},bh={key:0,class:"randino-demo-field"},vh={value:"none"},_h=["disabled"],yh=["disabled"],kh={class:"randino-demo-check"},Sh={class:"randino-demo-actions"},wh=["disabled"],Mh={key:4,class:"randino-demo-output"},jh={class:"randino-demo-value"},Lh={key:0,class:"randino-demo-meta"},Ch={key:5,class:"randino-demo-note"},zh={key:6,class:"randino-demo-note"},Th={class:"randino-demo-code"},Ph={class:"randino-demo-note randino-demo-live"},wn=50,xh={__name:"Demo",setup(e){const{lang:n}=An(),t=T(()=>zt(n.value)),o={en:"English",ko:"한국어",ja:"日本語",zh:"中文",it:"Italiano",de:"Deutsch",ru:"Русский",es:"Español",vi:"Tiếng Việt"},i=W("name"),r=W(!1),l=nn({kind:"none",length:5,separator:"_"});he(()=>l.kind,L=>{l.separator=L==="modifier"?"":"_"});const m=nn({language:"en",gender:"all",count:8,realism:"real",script:"native",includeSurname:!0,includeMiddleName:!1,minLength:"",maxLength:"",startsWith:"",unique:!1}),c=nn({language:"en",theme:"all",count:8,realism:"real",minLength:"",maxLength:"",wordSeparator:"",startsWith:"",unique:!1}),h=nn({language:"en",theme:"all",count:8,realism:"real",minLength:"",maxLength:"",startsWith:"",unique:!1}),d=nn({language:"en",theme:"all",shape:"all",slots:"all",sentences:1,type:"",style:"",includeName:"",count:8,realism:"real",minLength:"",maxLength:"",include:"",startsWith:"",unique:!1}),b=["object","place","time","manner","state","quantity","money","date","clock"],y=["statement","question","exclamation","trailing","dialogue","thought"],S=["plain","casual","polite","formal"],M=T(()=>d.include.split(/[\s,]+/).filter(Boolean));function _(L){const u=Number(L);return L===""||Number.isNaN(u)?void 0:u}const j=T(()=>{const L={};return i.value==="name"?(m.language!=="all"&&(L.language=m.language),m.gender!=="all"&&(L.gender=m.gender),m.count!==1&&(L.count=Number(m.count)),m.realism!=="real"&&(L.realism=m.realism),m.script!=="native"&&(L.script=m.script),m.includeSurname||(L.includeSurname=!1),m.includeMiddleName&&(L.includeMiddleName=!0),_(m.minLength)!==void 0&&(L.minLength=_(m.minLength)),_(m.maxLength)!==void 0&&(L.maxLength=_(m.maxLength)),m.startsWith&&(L.startsWith=m.startsWith),m.unique&&(L.unique=!0),L):i.value==="sentence"?(d.language!=="all"&&(L.language=d.language),d.theme!=="all"&&(L.theme=d.theme),d.shape!=="all"&&(L.shape=d.shape),d.slots!=="all"&&(L.slots=d.slots),Number(d.sentences)>1&&(L.sentences=Number(d.sentences)),d.includeName&&(L.includeName=d.includeName==="on"),d.type&&(L.type=d.type),d.style&&(L.style=d.style),M.value.length&&(L.include=M.value),d.count!==1&&(L.count=Number(d.count)),d.realism!=="real"&&(L.realism=d.realism),_(d.minLength)!==void 0&&(L.minLength=_(d.minLength)),_(d.maxLength)!==void 0&&(L.maxLength=_(d.maxLength)),d.startsWith&&(L.startsWith=d.startsWith),d.unique&&(L.unique=!0),L):i.value==="word"?(h.language!=="all"&&(L.language=h.language),h.theme!=="all"&&(L.theme=h.theme),h.count!==1&&(L.count=Number(h.count)),h.realism!=="real"&&(L.realism=h.realism),_(h.minLength)!==void 0&&(L.minLength=_(h.minLength)),_(h.maxLength)!==void 0&&(L.maxLength=_(h.maxLength)),h.startsWith&&(L.startsWith=h.startsWith),h.unique&&(L.unique=!0),L):(c.language!=="all"&&(L.language=c.language),c.theme!=="all"&&(L.theme=c.theme),c.count!==1&&(L.count=Number(c.count)),c.realism!=="real"&&(L.realism=c.realism),_(c.minLength)!==void 0&&(L.minLength=_(c.minLength)),_(c.maxLength)!==void 0&&(L.maxLength=_(c.maxLength)),c.wordSeparator&&(L.wordSeparator=c.wordSeparator),c.startsWith&&(L.startsWith=c.startsWith),c.unique&&(L.unique=!0),L)}),B=T(()=>{const L={...j.value};return r.value&&(i.value==="name"&&delete L.script,L.output="detail"),L}),E=T(()=>{const L={};return l.kind==="modifier"?(l.separator&&(L.separator=l.separator),L):(Number(l.length)!==5&&(L.length=Number(l.length)),l.separator!=="_"&&(L.separator=l.separator),L)}),H=T(()=>{if(i.value==="name")return Nt(m.language,m.includeSurname,m.includeMiddleName);if(i.value==="word")return Jd(h.language,h.theme);if(i.value==="sentence"){const[L,u]=Id(d.language),v=Number(d.sentences)||1;return[L*v,u*v]}return Bu(c.language,c.wordSeparator)}),I=T(()=>Gc(m.language)),ee={suffix:Lc,prefix:jc,modifier:Mc},$=T(()=>i.value!=="sentence"&&l.kind!=="none"),K=W([]),U=W(0);function q(){const L=B.value;let u,v=null;if(i.value==="name")if(r.value){const X=Ma({...L,output:"detail"});u=X.map(G=>m.script==="roman"?G.roman:G.native),v=X.map(G=>[["native",G.native],["roman",G.roman],["language",G.language],["gender",G.gender]])}else u=Ma(L);else if(i.value==="sentence")if(r.value){const X=Ea({...L,output:"detail"});u=X.map(G=>G.sentence),v=X.map(G=>[["phrases",G.phrases.join(" + ")],["slots",G.slots.join(" + ")],["language",G.language],["theme",String(G.theme)]])}else u=Ea(L);else if(i.value==="word")if(r.value){const X=$a({...L,output:"detail"});u=X.map(G=>G.word),v=X.map(G=>[["language",G.language],["theme",String(G.theme)]])}else u=$a(L);else if(r.value){const X=La({...L,output:"detail"});u=X.map(G=>G.nickname),v=X.map(G=>[["words",G.words.join(" + ")],["language",G.language],["theme",String(G.theme)]])}else u=La(L);if($.value){const X=ee[l.kind];u=X(u,E.value)}U.value=L.count??1,K.value=u.map((X,G)=>({text:X,meta:v?v[G]:null}))}ye(q),he([i,r],q);function Q(L){return Array.isArray(L)?`[${L.map(Q).join(", ")}]`:typeof L=="string"?`'${L.replace(/'/g,"\\'")}'`:String(L)}function ue(L){const u=Object.entries(L);if(!u.length)return"";const v=u.map(([G,Me])=>`${G}: ${Q(Me)}`),X=`{ ${v.join(", ")} }`;return X.length<=56?X:`{
	${v.join(`,
	`)}
}`}const $e={name:"randName",nickname:"randNickname",word:"randWord",sentence:"randSentence"},ke={suffix:"randSuffix",prefix:"randPrefix",modifier:"randModifier"},re={name:"native",nickname:"nickname",word:"word",sentence:"sentence"},Se=T(()=>{const L=$e[i.value],u=`${L}(${ue(B.value)})`;if(!$.value)return`import { ${L} } from 'randino';

${u};`;const v=ke[l.kind],X=ue(E.value),G=[L,v].sort().join(", ");if(!r.value)return`import { ${G} } from 'randino';

${v}(${u}${X?`, ${X}`:""});`;const Me=i.value==="name"&&m.script==="roman"?"roman":re[i.value];return[`import { ${G} } from 'randino';`,"",`const details = ${u};`,`${v}(details.map((detail) => detail.${Me})${X?`, ${X}`:""});`].join(`
`)}),we=W(!1);async function De(){try{await navigator.clipboard.writeText(K.value.map(L=>L.text).join(`
`)),we.value=!0,setTimeout(()=>we.value=!1,1200)}catch{}}return(L,u)=>(f(),p("div",Ud,[s("div",Yd,[s("button",{type:"button",role:"tab","aria-selected":i.value==="name",class:"randino-demo-tab",onClick:u[0]||(u[0]=v=>i.value="name")},C(g(ne)(t.value,"demoNames")),9,Zd),s("button",{type:"button",role:"tab","aria-selected":i.value==="nickname",class:"randino-demo-tab",onClick:u[1]||(u[1]=v=>i.value="nickname")},C(g(ne)(t.value,"demoNicknames")),9,Qd),s("button",{type:"button",role:"tab","aria-selected":i.value==="word",class:"randino-demo-tab",onClick:u[2]||(u[2]=v=>i.value="word")},C(g(ne)(t.value,"demoWords")),9,Xd),s("button",{type:"button",role:"tab","aria-selected":i.value==="sentence",class:"randino-demo-tab",onClick:u[3]||(u[3]=v=>i.value="sentence")},C(g(ne)(t.value,"demoSentences")),9,ef)]),s("div",nf,[i.value==="name"?(f(),p("div",tf,[s("label",af,[u[52]||(u[52]=s("span",null,[s("code",null,"language")],-1)),F(s("select",{"onUpdate:modelValue":u[4]||(u[4]=v=>m.language=v)},[u[51]||(u[51]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(Bt),v=>(f(),p("option",{key:v,value:v},C(v)+" — "+C(o[v]),9,of))),128))],512),[[ae,m.language]])]),s("label",rf,[u[54]||(u[54]=s("span",null,[s("code",null,"gender")],-1)),F(s("select",{"onUpdate:modelValue":u[5]||(u[5]=v=>m.gender=v)},[...u[53]||(u[53]=[s("option",{value:"all"},"all",-1),s("option",{value:"male"},"male",-1),s("option",{value:"female"},"female",-1)])],512),[[ae,m.gender]])]),s("label",lf,[u[56]||(u[56]=s("span",null,[s("code",null,"script")],-1)),F(s("select",{"onUpdate:modelValue":u[6]||(u[6]=v=>m.script=v)},[...u[55]||(u[55]=[s("option",{value:"native"},"native",-1),s("option",{value:"roman"},"roman",-1)])],512),[[ae,m.script]])]),s("label",sf,[u[57]||(u[57]=s("span",null,[s("code",null,"count")],-1)),F(s("input",{"onUpdate:modelValue":u[7]||(u[7]=v=>m.count=v),type:"number",min:"1",max:wn},null,512),[[te,m.count,void 0,{number:!0}]])]),s("label",mf,[u[59]||(u[59]=s("span",null,[s("code",null,"realism")],-1)),F(s("select",{"onUpdate:modelValue":u[8]||(u[8]=v=>m.realism=v)},[...u[58]||(u[58]=[s("option",{value:"real"},"real",-1),s("option",{value:"mixed"},"mixed",-1),s("option",{value:"invented"},"invented",-1)])],512),[[ae,m.realism]])]),s("label",cf,[u[60]||(u[60]=s("span",null,[s("code",null,"minLength")],-1)),F(s("input",{"onUpdate:modelValue":u[9]||(u[9]=v=>m.minLength=v),type:"number",min:"1",placeholder:H.value[0]},null,8,uf),[[te,m.minLength]])]),s("label",df,[u[61]||(u[61]=s("span",null,[s("code",null,"maxLength")],-1)),F(s("input",{"onUpdate:modelValue":u[10]||(u[10]=v=>m.maxLength=v),type:"number",min:"1",placeholder:H.value[1]},null,8,ff),[[te,m.maxLength]])]),s("label",hf,[u[62]||(u[62]=s("span",null,[s("code",null,"startsWith")],-1)),F(s("input",{"onUpdate:modelValue":u[11]||(u[11]=v=>m.startsWith=v),type:"text",maxlength:"1",placeholder:"—"},null,512),[[te,m.startsWith]])]),s("label",gf,[F(s("input",{"onUpdate:modelValue":u[12]||(u[12]=v=>m.includeSurname=v),type:"checkbox"},null,512),[[Re,m.includeSurname]]),u[63]||(u[63]=s("code",null,"includeSurname",-1))]),s("label",{class:Z(["randino-demo-check",{"is-off":!I.value}])},[F(s("input",{"onUpdate:modelValue":u[13]||(u[13]=v=>m.includeMiddleName=v),type:"checkbox",disabled:!I.value},null,8,pf),[[Re,m.includeMiddleName]]),u[64]||(u[64]=s("code",null,"includeMiddleName",-1))],2),s("label",bf,[F(s("input",{"onUpdate:modelValue":u[14]||(u[14]=v=>m.unique=v),type:"checkbox"},null,512),[[Re,m.unique]]),u[65]||(u[65]=s("code",null,"unique",-1))])])):i.value==="sentence"?(f(),p("div",vf,[s("label",_f,[u[67]||(u[67]=s("span",null,[s("code",null,"language")],-1)),F(s("select",{"onUpdate:modelValue":u[15]||(u[15]=v=>d.language=v)},[u[66]||(u[66]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(ce),v=>(f(),p("option",{key:v,value:v},C(v)+" — "+C(o[v]),9,yf))),128))],512),[[ae,d.language]])]),s("label",kf,[u[69]||(u[69]=s("span",null,[s("code",null,"theme")],-1)),F(s("select",{"onUpdate:modelValue":u[16]||(u[16]=v=>d.theme=v)},[u[68]||(u[68]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(le),v=>(f(),p("option",{key:v,value:v},C(v),9,Sf))),128))],512),[[ae,d.theme]])]),s("label",wf,[u[71]||(u[71]=s("span",null,[s("code",null,"shape")],-1)),F(s("select",{"onUpdate:modelValue":u[17]||(u[17]=v=>d.shape=v)},[...u[70]||(u[70]=[s("option",{value:"all"},"all",-1),s("option",{value:"simple"},"simple",-1),s("option",{value:"detailed"},"detailed",-1),s("option",{value:"complex"},"complex",-1)])],512),[[ae,d.shape]])]),s("label",Mf,[u[74]||(u[74]=s("span",null,[s("code",null,"slots")],-1)),F(s("select",{"onUpdate:modelValue":u[18]||(u[18]=v=>d.slots=v)},[u[72]||(u[72]=s("option",{value:"all"},"all",-1)),u[73]||(u[73]=s("option",{value:"none"},"none",-1)),(f(),p(V,null,Y(b,v=>s("option",{key:v,value:v},C(v),9,jf)),64))],512),[[ae,d.slots]])]),s("label",Lf,[u[75]||(u[75]=s("span",null,[s("code",null,"include")],-1)),F(s("input",{"onUpdate:modelValue":u[19]||(u[19]=v=>d.include=v),type:"text",placeholder:g(ne)(t.value,"demoIncludeHint")},null,8,Cf),[[te,d.include]])]),s("label",zf,[u[77]||(u[77]=s("span",null,[s("code",null,"type")],-1)),F(s("select",{"onUpdate:modelValue":u[20]||(u[20]=v=>d.type=v)},[u[76]||(u[76]=s("option",{value:""},"random",-1)),(f(),p(V,null,Y(y,v=>s("option",{key:v,value:v},C(v),9,Tf)),64))],512),[[ae,d.type]])]),s("label",Pf,[u[79]||(u[79]=s("span",null,[s("code",null,"style")],-1)),F(s("select",{"onUpdate:modelValue":u[21]||(u[21]=v=>d.style=v)},[u[78]||(u[78]=s("option",{value:""},"random",-1)),(f(),p(V,null,Y(S,v=>s("option",{key:v,value:v},C(v),9,xf)),64))],512),[[ae,d.style]])]),s("label",Af,[u[81]||(u[81]=s("span",null,[s("code",null,"includeName")],-1)),F(s("select",{"onUpdate:modelValue":u[22]||(u[22]=v=>d.includeName=v)},[...u[80]||(u[80]=[s("option",{value:""},"random",-1),s("option",{value:"on"},"on",-1),s("option",{value:"off"},"off",-1)])],512),[[ae,d.includeName]])]),s("label",Bf,[u[82]||(u[82]=s("span",null,[s("code",null,"sentences")],-1)),F(s("input",{"onUpdate:modelValue":u[23]||(u[23]=v=>d.sentences=v),type:"number",min:"1",max:g(no)},null,8,Hf),[[te,d.sentences,void 0,{number:!0}]])]),s("label",Nf,[u[83]||(u[83]=s("span",null,[s("code",null,"count")],-1)),F(s("input",{"onUpdate:modelValue":u[24]||(u[24]=v=>d.count=v),type:"number",min:"1",max:wn},null,512),[[te,d.count,void 0,{number:!0}]])]),s("label",Ef,[u[85]||(u[85]=s("span",null,[s("code",null,"realism")],-1)),F(s("select",{"onUpdate:modelValue":u[25]||(u[25]=v=>d.realism=v)},[...u[84]||(u[84]=[s("option",{value:"real"},"real",-1),s("option",{value:"mixed"},"mixed",-1),s("option",{value:"invented"},"invented",-1)])],512),[[ae,d.realism]])]),s("label",$f,[u[86]||(u[86]=s("span",null,[s("code",null,"minLength")],-1)),F(s("input",{"onUpdate:modelValue":u[26]||(u[26]=v=>d.minLength=v),type:"number",min:"1",placeholder:H.value[0]},null,8,Df),[[te,d.minLength]])]),s("label",Ff,[u[87]||(u[87]=s("span",null,[s("code",null,"maxLength")],-1)),F(s("input",{"onUpdate:modelValue":u[27]||(u[27]=v=>d.maxLength=v),type:"number",min:"1",placeholder:H.value[1]},null,8,Rf),[[te,d.maxLength]])]),s("label",Vf,[u[88]||(u[88]=s("span",null,[s("code",null,"startsWith")],-1)),F(s("input",{"onUpdate:modelValue":u[28]||(u[28]=v=>d.startsWith=v),type:"text",maxlength:"1",placeholder:"—"},null,512),[[te,d.startsWith]])]),s("label",qf,[F(s("input",{"onUpdate:modelValue":u[29]||(u[29]=v=>d.unique=v),type:"checkbox"},null,512),[[Re,d.unique]]),u[89]||(u[89]=s("code",null,"unique",-1))])])):i.value==="word"?(f(),p("div",Gf,[s("label",Wf,[u[91]||(u[91]=s("span",null,[s("code",null,"language")],-1)),F(s("select",{"onUpdate:modelValue":u[30]||(u[30]=v=>h.language=v)},[u[90]||(u[90]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(ce),v=>(f(),p("option",{key:v,value:v},C(v)+" — "+C(o[v]),9,Of))),128))],512),[[ae,h.language]])]),s("label",Kf,[u[93]||(u[93]=s("span",null,[s("code",null,"theme")],-1)),F(s("select",{"onUpdate:modelValue":u[31]||(u[31]=v=>h.theme=v)},[u[92]||(u[92]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(le),v=>(f(),p("option",{key:v,value:v},C(v),9,If))),128))],512),[[ae,h.theme]])]),s("label",Jf,[u[94]||(u[94]=s("span",null,[s("code",null,"count")],-1)),F(s("input",{"onUpdate:modelValue":u[32]||(u[32]=v=>h.count=v),type:"number",min:"1",max:wn},null,512),[[te,h.count,void 0,{number:!0}]])]),s("label",Uf,[u[96]||(u[96]=s("span",null,[s("code",null,"realism")],-1)),F(s("select",{"onUpdate:modelValue":u[33]||(u[33]=v=>h.realism=v)},[...u[95]||(u[95]=[s("option",{value:"real"},"real",-1),s("option",{value:"mixed"},"mixed",-1),s("option",{value:"invented"},"invented",-1)])],512),[[ae,h.realism]])]),s("label",Yf,[u[97]||(u[97]=s("span",null,[s("code",null,"minLength")],-1)),F(s("input",{"onUpdate:modelValue":u[34]||(u[34]=v=>h.minLength=v),type:"number",min:"1",placeholder:H.value[0]},null,8,Zf),[[te,h.minLength]])]),s("label",Qf,[u[98]||(u[98]=s("span",null,[s("code",null,"maxLength")],-1)),F(s("input",{"onUpdate:modelValue":u[35]||(u[35]=v=>h.maxLength=v),type:"number",min:"1",placeholder:H.value[1]},null,8,Xf),[[te,h.maxLength]])]),s("label",eh,[u[99]||(u[99]=s("span",null,[s("code",null,"startsWith")],-1)),F(s("input",{"onUpdate:modelValue":u[36]||(u[36]=v=>h.startsWith=v),type:"text",maxlength:"1",placeholder:"—"},null,512),[[te,h.startsWith]])]),s("label",nh,[F(s("input",{"onUpdate:modelValue":u[37]||(u[37]=v=>h.unique=v),type:"checkbox"},null,512),[[Re,h.unique]]),u[100]||(u[100]=s("code",null,"unique",-1))])])):(f(),p("div",th,[s("label",ah,[u[102]||(u[102]=s("span",null,[s("code",null,"language")],-1)),F(s("select",{"onUpdate:modelValue":u[38]||(u[38]=v=>c.language=v)},[u[101]||(u[101]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(ce),v=>(f(),p("option",{key:v,value:v},C(v)+" — "+C(o[v]),9,oh))),128))],512),[[ae,c.language]])]),s("label",ih,[u[104]||(u[104]=s("span",null,[s("code",null,"theme")],-1)),F(s("select",{"onUpdate:modelValue":u[39]||(u[39]=v=>c.theme=v)},[u[103]||(u[103]=s("option",{value:"all"},"all",-1)),(f(!0),p(V,null,Y(g(le),v=>(f(),p("option",{key:v,value:v},C(v),9,rh))),128))],512),[[ae,c.theme]])]),s("label",lh,[u[105]||(u[105]=s("span",null,[s("code",null,"count")],-1)),F(s("input",{"onUpdate:modelValue":u[40]||(u[40]=v=>c.count=v),type:"number",min:"1",max:wn},null,512),[[te,c.count,void 0,{number:!0}]])]),s("label",sh,[u[107]||(u[107]=s("span",null,[s("code",null,"realism")],-1)),F(s("select",{"onUpdate:modelValue":u[41]||(u[41]=v=>c.realism=v)},[...u[106]||(u[106]=[s("option",{value:"real"},"real",-1),s("option",{value:"mixed"},"mixed",-1),s("option",{value:"invented"},"invented",-1)])],512),[[ae,c.realism]])]),s("label",mh,[u[108]||(u[108]=s("span",null,[s("code",null,"minLength")],-1)),F(s("input",{"onUpdate:modelValue":u[42]||(u[42]=v=>c.minLength=v),type:"number",min:"1",placeholder:H.value[0]},null,8,ch),[[te,c.minLength]])]),s("label",uh,[u[109]||(u[109]=s("span",null,[s("code",null,"maxLength")],-1)),F(s("input",{"onUpdate:modelValue":u[43]||(u[43]=v=>c.maxLength=v),type:"number",min:"1",placeholder:H.value[1]},null,8,dh),[[te,c.maxLength]])]),s("label",fh,[u[110]||(u[110]=s("span",null,[s("code",null,"wordSeparator")],-1)),F(s("input",{"onUpdate:modelValue":u[44]||(u[44]=v=>c.wordSeparator=v),type:"text",maxlength:"4",placeholder:"—"},null,512),[[te,c.wordSeparator]])]),s("label",hh,[u[111]||(u[111]=s("span",null,[s("code",null,"startsWith")],-1)),F(s("input",{"onUpdate:modelValue":u[45]||(u[45]=v=>c.startsWith=v),type:"text",maxlength:"1",placeholder:"—"},null,512),[[te,c.startsWith]])]),s("label",gh,[F(s("input",{"onUpdate:modelValue":u[46]||(u[46]=v=>c.unique=v),type:"checkbox"},null,512),[[Re,c.unique]]),u[112]||(u[112]=s("code",null,"unique",-1))])])),s("div",ph,[i.value!=="sentence"?(f(),p("label",bh,[s("span",null,C(g(ne)(t.value,"demoDecorate")),1),F(s("select",{"onUpdate:modelValue":u[47]||(u[47]=v=>l.kind=v)},[s("option",vh,C(g(ne)(t.value,"demoDecorateNone")),1),u[113]||(u[113]=s("option",{value:"suffix"},"randSuffix",-1)),u[114]||(u[114]=s("option",{value:"prefix"},"randPrefix",-1)),u[115]||(u[115]=s("option",{value:"modifier"},"randModifier",-1))],512),[[ae,l.kind]])])):z("",!0),i.value!=="sentence"?(f(),p("label",{key:1,class:Z(["randino-demo-field",{"is-off":l.kind==="none"||l.kind==="modifier"}])},[u[116]||(u[116]=s("span",null,[s("code",null,"length")],-1)),F(s("input",{"onUpdate:modelValue":u[48]||(u[48]=v=>l.length=v),type:"number",min:"1",max:"32",disabled:l.kind==="none"||l.kind==="modifier"},null,8,_h),[[te,l.length,void 0,{number:!0}]])],2)):z("",!0),i.value!=="sentence"?(f(),p("label",{key:2,class:Z(["randino-demo-field",{"is-off":l.kind==="none"}])},[u[117]||(u[117]=s("span",null,[s("code",null,"separator")],-1)),F(s("input",{"onUpdate:modelValue":u[49]||(u[49]=v=>l.separator=v),type:"text",maxlength:"4",placeholder:"—",disabled:l.kind==="none"},null,8,yh),[[te,l.separator]])],2)):z("",!0),s("label",kh,[F(s("input",{"onUpdate:modelValue":u[50]||(u[50]=v=>r.value=v),type:"checkbox"},null,512),[[Re,r.value]]),s("span",null,C(g(ne)(t.value,"demoDetails")),1)])]),s("div",Sh,[s("button",{type:"button",class:"randino-demo-run",onClick:q},C(g(ne)(t.value,"demoGenerate")),1),s("button",{type:"button",class:"randino-demo-copy",disabled:!K.value.length,onClick:De},C(we.value?g(ne)(t.value,"demoCopied"):g(ne)(t.value,"demoCopy")),9,wh)]),K.value.length?(f(),p("ul",Mh,[(f(!0),p(V,null,Y(K.value,(v,X)=>(f(),p("li",{key:X},[s("span",jh,C(v.text),1),v.meta?(f(),p("span",Lh,[(f(!0),p(V,null,Y(v.meta,([G,Me])=>(f(),p("span",{key:G},[s("code",null,C(G),1),He(" "+C(Me),1)]))),128))])):z("",!0)]))),128))])):(f(),p("p",Ch,C(g(ne)(t.value,"demoEmpty")),1)),K.value.length&&K.value.length<U.value?(f(),p("p",zh,C(g(ne)(t.value,"demoShort")),1)):z("",!0),s("details",Th,[s("summary",null,C(g(ne)(t.value,"demoCall")),1),s("pre",null,[s("code",null,C(Se.value),1)])]),s("p",Ph,C(g(ne)(t.value,"demoLive")),1)])]))}};function Ah(e){return typeof e=="object"&&!("i18n"in e)}function Bh(e){return typeof e=="object"&&"i18n"in e}const Da=[{name:"language",type:{js:"WordLanguageOption",dart:"WordLanguage?",py:"WordLanguageOption"},fallback:{js:"'all'",dart:"null",py:'"all"'},about:"optionLanguage"},{name:"theme",type:{js:"WordThemeOption",dart:"WordTheme?",py:"WordThemeOption"},fallback:{js:"'all'",dart:"null",py:'"all"'},about:"optionTheme",themeOnly:!0},{name:"count",type:{js:"number",dart:"int",py:"int"},fallback:"1",about:"optionCount"},{name:"realism",type:{js:"RandRealism",dart:"RandRealism",py:"RandRealism"},fallback:{js:"'real'",dart:"RandRealism.real",py:'"real"'},about:"optionRealism"},{name:{js:"minLength",dart:"minLength",py:"min_length"},type:{js:"number",dart:"int?",py:"int | None"},fallback:{i18n:"optionFromPools"},about:"optionMinLength"},{name:{js:"maxLength",dart:"maxLength",py:"max_length"},type:{js:"number",dart:"int?",py:"int | None"},fallback:{i18n:"optionFromPools"},about:"optionMaxLength"},{name:{js:"startsWith",dart:"startsWith",py:"starts_with"},type:{js:"string",dart:"String?",py:"str"},fallback:{js:"—",dart:"null",py:'""'},about:"optionStartsWith"},{name:"unique",type:{js:"boolean",dart:"bool",py:"bool"},fallback:{js:"false",dart:"false",py:"False"},about:"optionUnique"},{name:"output",type:{js:"RandOutput",py:"RandOutput"},fallback:{js:"'value'",py:'"value"'},about:"optionOutput",langs:"js py"}];function Hh(e){return e?Da:Da.filter(n=>!n.themeOnly)}const Nh={class:"randino-options"},Eh=["data-lang"],$h={key:0},Dh={key:2},Fh={__name:"WordOptions",props:{theme:{type:Boolean,default:!1}},setup(e){const n=e,{lang:t}=An(),o=T(()=>zt(t.value)),i=T(()=>Hh(n.theme));return(r,l)=>(f(),p("table",Nh,[s("thead",null,[s("tr",null,[s("th",null,C(g(ne)(o.value,"optionName")),1),s("th",null,C(g(ne)(o.value,"optionType")),1),s("th",null,C(g(ne)(o.value,"optionDefault")),1),s("th",null,C(g(ne)(o.value,"optionAbout")),1)])]),s("tbody",null,[(f(!0),p(V,null,Y(i.value,m=>(f(),p("tr",{key:m.about,class:Z(m.langs?"randino-lang":void 0),"data-lang":m.langs},[(f(!0),p(V,null,Y([m.name,m.type,m.fallback],c=>(f(),p("td",{key:String(c)},[g(Bh)(c)?(f(),p("em",$h,C(g(ne)(o.value,c.i18n)),1)):g(Ah)(c)?(f(),A(eo,Le({key:1,ref_for:!0},c,{code:""}),null,16)):(f(),p("code",Dh,C(c),1))]))),128)),s("td",null,C(g(ne)(o.value,m.about)),1)],10,Eh))),128))])]))}},Rh=["width","height"],Vh=["width","height"],qh=["width","height"],Gh={__name:"RegistryMark",props:{registry:{type:String,required:!0},size:{type:Number,default:16}},setup(e){const n={npm:"#CB3837",pubdev:"#0175C2",pypi:"#3775A9"},t=e,o=T(()=>n[t.registry]??"currentColor");return(i,r)=>e.registry==="npm"?(f(),p("svg",{key:0,class:"randino-registry-mark",viewBox:"0 0 24 24",width:e.size,height:e.size,style:Be({color:o.value}),"aria-hidden":"true"},[...r[0]||(r[0]=[s("path",{fill:"currentColor",d:"M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"},null,-1)])],12,Rh)):e.registry==="pubdev"?(f(),p("svg",{key:1,class:"randino-registry-mark",viewBox:"0 0 24 24",width:e.size,height:e.size,style:Be({color:o.value}),"aria-hidden":"true"},[...r[1]||(r[1]=[s("path",{fill:"currentColor",d:"M4.105 4.105S9.158 1.58 11.684.316a3.1 3.1 0 0 1 1.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818.316-1.105zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263zm12.055-.678c-.899-.896-1.809-1.78-2.74-2.643c-.302-.267-.567-.468-1.07-.462c-.37.014-.87.195-.87.195L6.341 4.105z"},null,-1)])],12,Vh)):e.registry==="pypi"?(f(),p("svg",{key:2,class:"randino-registry-mark",viewBox:"0 0 24 24",width:e.size,height:e.size,style:Be({color:o.value}),"aria-hidden":"true"},[...r[2]||(r[2]=[s("path",{fill:"currentColor",d:"M23.922 13.58v3.912L20.55 18.72l-.078.055l.052.037l3.45-1.256l.026-.036v-3.997l-.053-.036l-.025.092zm-.301-7.962l-3.04 1.107v3.912l3.339-1.215V5.509zm.299 7.839V9.544l-3.336 1.215v3.913zm-3.45 1.253V10.8l-3.3 1.2v3.913zm-3.436 5.286v-3.912l-3.313 1.206v3.912zm.136-3.939v3.868l3.314-1.206V14.85zm2.093 1.882c-.367.134-.663-.074-.663-.463s.296-.814.663-.947c.365-.133.662.075.662.464s-.297.814-.662.946m-6.038-8.624l.365-.132l-3.285-1.197l-3.323 1.21l.102.037l3.184 1.16zm7.282 1.349V6.751L17.17 7.965v3.913zm-3.449 1.254V8.005l-3.302 1.202v3.912zm-3.415-2.672l-3.336 1.215v3.913l3.336-1.215zm-6.736 3.919l3.322 1.209v-3.913L6.907 9.252zm3.433-5.292l3.281 1.193V5.198l-3.28-1.193zm10.167-5.158L17.19 3.922v3.913l3.317-1.207zM16.95 3.903L13.724 2.73l-3.269 1.19l3.225 1.174zm-1.585.703l-1.624.592v3.868l3.317-1.207V3.991zm-.391 2.778c-.367.134-.662-.074-.662-.464s.295-.813.662-.946c.366-.133.663.074.663.464s-.297.813-.663.946M10.229 18.41v-3.914l-3.322-1.209V17.2zm3.449-1.228v-3.913l-3.371 1.227v3.913zm.078-.028l3.3-1.2V12.04l-3.3 1.2zm-.078 4.063l-3.371 1.227v-3.912h-.078v3.912l-3.322-1.209v-3.913l-.053-.058l-.025-.06l-3.336-1.21v-3.948l.034.013l3.287 1.196l.015-.078l-3.261-1.187l3.26-1.187v-.109L3.876 9.62l-.307-.112l3.26-1.188v.877l.079-.055V6.769l3.257 1.185l.058-.061L7.084 6.75l-.102-.037l3.24-1.179v-.083L6.854 6.677v.018l-.025.018v1.523L3.44 9.47v.02l-.025.017v4.007l-3.39 1.233v.019L0 14.784v3.995l.025.037l3.4 1.237l.008-.006l.007.01l3.4 1.238l.008-.006l.006.01l3.4 1.237l.014-.009l.012.01l3.45-1.256l.026-.037zM3.493 9.563l3.257 1.185l-3.257 1.187V9.562zM3.4 19.96L.078 18.752v-3.913l2.361.86l.96.349zm.015-3.99l-3.08-1.12l-.182-.066l3.262-1.187zm3.399 5.231l-3.321-1.209V16.08l3.321 1.209zM23.791 5.434l-3.21-1.17v2.338zm-3.404-2.791l-3.24-1.18l-3.27 1.19l3.247 1.182z"},null,-1)])],12,qh)):z("",!0)}},Wh=["href"],Oh={class:"randino-pkg-registry"},Kh={class:"randino-pkg-lang"},Ih={__name:"PackageLinks",props:{links:{type:Array,required:!0},screenMenu:{type:Boolean,default:!1}},setup(e){const n=cn("close-screen",null);function t(o){var i;return((i=qe.find(r=>r.id===o))==null?void 0:i.label)??o}return(o,i)=>(f(),p("div",{class:Z(["randino-pkg",{"randino-pkg-screen":e.screenMenu}])},[(f(!0),p(V,null,Y(e.links,r=>(f(),p("a",{key:r.id,class:"randino-pkg-link",href:r.url,target:"_blank",rel:"noopener",onClick:i[0]||(i[0]=l=>{var m;return(m=g(n))==null?void 0:m()})},[P(Gh,{registry:r.mark,size:16},null,8,["registry"]),s("span",Oh,C(r.registry),1),s("span",Kh,C(t(r.id)),1)],8,Wh))),128))],2))}},Uh={extends:Qa,Layout:Fm,enhanceApp({app:e}){e.component("Lang",eo),e.component("PackageLinks",Ih),e.component("Demo",xh),e.component("WordOptions",Fh),Cm()}};export{Uh as R,is as c,O as u};
