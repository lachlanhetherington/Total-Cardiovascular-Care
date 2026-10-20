(function(){
const B=document.body,ROOT=B.dataset.root||'',PAGE=B.dataset.page,SLUG=B.dataset.slug;
const APPT='https://totalcardiovascularcare.com.au/appointment/';
const IMG=n=>ROOT+'assets/img/'+n+'.webp';
const docUrl=s=>ROOT+'doctors/'+s+'.html';
const locUrl=s=>ROOT+'locations/'+s+'.html';
const SVC=ROOT+'services/coronary-angioplasty.html';
const home=a=>PAGE==='home'?'#'+a:ROOT+'index.html#'+a;
const arrow='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

const CARE=[
 {k:'general',name:'General cardiology',img:'total-cardiovascular-care-49',items:['Cardiology consultation','ECG (electrocardiogram)','Holter monitoring','Blood pressure monitoring','Direct cardioversion'],blurb:'Consultations and everyday diagnostics to assess symptoms, monitor your heart and plan treatment.'},
 {k:'interventional',name:'Interventional cardiology',img:'interventional',items:['Coronary angiogram','Coronary intervention (stents)'],link:{'Coronary intervention (stents)':SVC},blurb:'Catheter-based procedures to image and open narrowed coronary arteries.'},
 {k:'hf',name:'Heart failure',img:'tcc_banner_10',items:['Heart failure consultation','Biventricular defibrillator','Pacemaker insertion','CardioMEMS insertion'],blurb:'Long-term management of heart failure, including device therapy and remote pressure monitoring.'},
 {k:'imaging',name:'Cardiac imaging',img:'cardiac-imaging2-1',items:['Echocardiogram','Stress echocardiogram','Dobutamine stress echocardiogram','CT coronary angiogram','Transoesophageal echocardiogram'],blurb:'Detailed pictures of your heart\'s structure and function to guide diagnosis.'},
 {k:'rhythm',name:'Rhythm management',img:'tcc_banner_9',items:['Implantable loop recorder insertion','Pacemaker and defibrillator insertion and aftercare','EP studies and ablation for SVT','Catheter ablation for AF and VT','AV node ablation','Atrial flutter ablation'],blurb:'Diagnosis and treatment of heart rhythm disorders, from monitoring to ablation.'},
 {k:'structural',name:'Structural heart',img:'tcc_experts',items:['Transcatheter aortic valve implantation (TAVI)','Left atrial appendage closure','Mitral valve intervention','Tricuspid valve intervention'],blurb:'Minimally invasive treatment of heart valve and structural problems.'}
];

const DOCS=window.TCC_DOCS, LOCS=window.TCC_LOCS;

const GLOSS={'MBBS':'Bachelor of Medicine, Bachelor of Surgery','MBChB':'Bachelor of Medicine, Bachelor of Surgery','MD':'Doctor of Medicine','PhD':'Doctor of Philosophy (research doctorate)','MSc':'Master of Science','BSc':'Bachelor of Science','BSci':'Bachelor of Science','BBiomedSci':'Bachelor of Biomedical Science','FRACP':'Fellow of the Royal Australasian College of Physicians','FCSANZ':'Fellow of the Cardiac Society of Australia and New Zealand','MRCP':'Member of the Royal College of Physicians','MRCPCH':'Member of the Royal College of Paediatrics and Child Health','Grad Dip':'Graduate Diploma'};
const HOURS_FRANKSTON=[['Monday','9:00 am – 5:00 pm'],['Tuesday','9:00 am – 5:00 pm'],['Wednesday','9:00 am – 5:00 pm'],['Thursday','9:00 am – 5:00 pm'],['Friday','9:00 am – 5:00 pm'],['Saturday','Closed'],['Sunday','Closed']];

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const maps=l=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Total Cardiovascular Care '+l.a+' '+l.sub);
const $=id=>document.getElementById(id);

function groupsOf(d){const j=d.d.join(' ').toLowerCase(),g=[];
 if(/interventional|structural/.test(j))g.push('interventional');
 if(/imaging|echocardio/.test(j))g.push('imaging');
 if(/heart failure/.test(j))g.push('hf');
 if(/rhythm|electrophysiolog/.test(j))g.push('rhythm');
 if(/paediatric/.test(j))g.push('paeds');
 if(/physician|medicine/.test(j))g.push('physician');
 return g;}
function careFor(d){const j=d.d.join(' ').toLowerCase(),o=[];
 const add=k=>{const c=CARE.find(x=>x.k===k);if(c&&!o.includes(c))o.push(c)};
 if(/general cardiolog/.test(j))add('general');
 if(/interventional/.test(j))add('interventional');
 if(/structural/.test(j))add('structural');
 if(/imaging|echocardio/.test(j))add('imaging');
 if(/heart failure/.test(j))add('hf');
 if(/rhythm|electrophysiolog/.test(j))add('rhythm');
 return o;}

function docCard(d){return `<a class="doc" href="${docUrl(d.s)}" aria-label="${esc(d.n)}, ${esc(d.t)}. View profile">
  <div class="ph"><img src="${IMG(d.img)}" alt="" loading="lazy" width="900" height="900"></div>
  <span class="go" aria-hidden="true">${arrow}</span>
  <div class="meta"><span class="role">${esc(d.t)}</span><h3>${esc(d.n)}</h3><span class="cred">${esc(d.c)}</span></div></a>`;}
const areaCard=c=>`<article class="area-card"><a class="area-img" href="${ROOT+'services/'+({general:'general-cardiology',interventional:'interventional-cardiology',hf:'heart-failure',imaging:'cardiac-imaging',rhythm:'rhythm-management',structural:'structural-heart'})[c.k]+'.html'}" tabindex="-1" aria-hidden="true"><img src="${IMG(c.img)}" alt="" loading="lazy" width="1800" height="1200"></a>
  <div class="area-body"><h3><a class="area-link" href="${ROOT+'services/'+({general:'general-cardiology',interventional:'interventional-cardiology',hf:'heart-failure',imaging:'cardiac-imaging',rhythm:'rhythm-management',structural:'structural-heart'})[c.k]+'.html'}">${c.name}</a></h3><p>${c.blurb}</p><div class="svc-cloud">${c.items.map(it=>c.link&&c.link[it]?`<a href="${c.link[it]}">${it}</a>`:`<span>${it}</span>`).join('')}</div></div></article>`;
const locItem=o=>`<li><a href="${locUrl(o.s)}" data-loc="${o.s}"><strong>${o.n}${o.main?'<span class="main">Main rooms</span>':''}</strong><span>${esc(o.main?o.a:o.v)}</span><span class="pc">${o.pc}<i>&rarr;</i></span></a></li>`;

function netmap(active){
 /* Real coastline (Natural Earth 10m, public domain) pre-projected in src/geo.js; pins use the same projection */
 const M=window.TCC_MAP,C=M.cfg,W=C.W,H=C.H;
 const P=(lon,lat)=>[(lon-C.x0)*C.k*C.s,(C.y0-lat)*C.s];
 const km10=10/111.32*C.s;
 const SIDE={'safety-beach':'l',wonthaggi:'l',inverloch:'b'};
 const pill=(x,y,side,name,pc,on)=>{
  const w=Math.round(name.length*7.9+pc.length*6.6+36),h=26;
  let px=side==='l'?x-16-w:side==='b'?x-w/2:x+16,py=side==='b'?y+10:y-16-h/2;
  return `<g class="pill"><rect x="${px}" y="${py}" width="${w}" height="${h}" rx="13"/>
   <text x="${px+12}" y="${py+17}" class="pn">${name}</text><text x="${px+w-12}" y="${py+17}" text-anchor="end" class="pp">${pc}</text></g>`;};
 const water=(lon,lat,t)=>{const [x,y]=P(lon,lat);return `<text x="${x}" y="${y}" class="wl" text-anchor="middle">${t}</text>`};
 const [cx,cy]=P(144.9631,-37.8136);
 const pins=LOCS.map(l=>{const [x,y]=P(l.lon,l.lat);const on=l.s===active;
  return `<a href="${locUrl(l.s)}" class="pin${on?' on':''}${l.main?' main':''}" data-loc="${l.s}" aria-label="${l.n} clinic${l.main?', main rooms':''}">
   ${l.main?`<circle class="ring" cx="${x}" cy="${y}" r="6"/>`:''}
   <g transform="translate(${x} ${y})"><g class="pin-body"><ellipse class="shadow" cx="0" cy="1" rx="5" ry="2"/><path d="M0 0C-1.6-5.4-9-8.6-9-15.5a9 9 0 1 1 18 0C9-8.6 1.6-5.4 0 0Z"/><circle cx="0" cy="-15.5" r="3.4" class="hole"/></g></g>
   ${pill(x,y,SIDE[l.s]||'r',l.n,l.pc,on)}</a>`;}).join('');
 return `<svg viewBox="0 0 ${W} ${H}" class="map-svg" role="img" aria-label="Map of the seven Total Cardiovascular Care clinics around Port Phillip, Western Port and the Bass Coast">
  <defs><pattern id="mdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".9" class="dot"/></pattern></defs>
  <rect width="${W}" height="${H}" class="water"/>
  <path d="${M.land}" class="land" fill-rule="evenodd"/><path d="${M.land}" fill="url(#mdots)" fill-rule="evenodd"/>
  ${water(144.86,-38.08,'PORT PHILLIP')}${water(145.13,-38.395,'WESTERN PORT')}${water(145.2,-38.69,'BASS STRAIT')}
  <g class="cbd"><rect x="${cx-4}" y="${cy-4}" width="8" height="8" rx="1.5" transform="rotate(45 ${cx} ${cy})"/><text x="${cx+10}" y="${cy+4}">Melbourne CBD</text></g>
  ${pins}
  <g class="mapkey" transform="translate(18 ${H-22})"><path d="M0 0v-6M0 -3H${km10}M${km10} 0v-6"/><text x="${km10+8}" y="0">10 km</text></g>
  <g class="mapkey" transform="translate(${W-26} 30)"><path d="M0 8 0 -8M-4 -3 0 -8 4 -3"/><text x="0" y="22" text-anchor="middle">N</text></g>
 </svg>`;}
function linkMap(root){ /* hovering a list row or a pin highlights both */
 const sel=s=>root.querySelectorAll(`[data-loc="${s}"]`);
 root.addEventListener('mouseover',e=>{const t=e.target.closest('[data-loc]');if(t)sel(t.dataset.loc).forEach(n=>n.classList.add('hl'))});
 root.addEventListener('mouseout',e=>{const t=e.target.closest('[data-loc]');if(t)sel(t.dataset.loc).forEach(n=>n.classList.remove('hl'))});
 root.addEventListener('focusin',e=>{const t=e.target.closest('[data-loc]');if(t)sel(t.dataset.loc).forEach(n=>n.classList.add('hl'))});
 root.addEventListener('focusout',e=>{const t=e.target.closest('[data-loc]');if(t)sel(t.dataset.loc).forEach(n=>n.classList.remove('hl'))});
}

/* ---------- Page URLs + shared bits for menus and index pages ---------- */
const PG={doctors:ROOT+'doctors.html',services:ROOT+'services.html',locations:ROOT+'locations.html',referrers:ROOT+'referrers.html',about:ROOT+'about.html',contact:ROOT+'contact.html'};
const DFILTERS=[['all','All doctors'],['interventional','Interventional & structural'],['imaging','Imaging'],['hf','Heart failure'],['rhythm','Rhythm'],['paeds','Paediatric & fetal'],['physician','Physicians']];
const STAFF=window.TCC_STAFF||[];
const ICON={
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
 mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
 pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H9l-5 4z"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
 pulse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>',
 team:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4.5 4.5 0 0 1 7.5-3.4"/></svg>',
 info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
 cap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>'
};
const AREA_SLUG={general:'general-cardiology',interventional:'interventional-cardiology',hf:'heart-failure',imaging:'cardiac-imaging',rhythm:'rhythm-management',structural:'structural-heart'};
const areaUrl=c=>ROOT+'services/'+AREA_SLUG[c.k]+'.html';
const docsIn=k=>DOCS.filter(d=>k==='all'||groupsOf(d).includes(k));
const avatars=(list,n=5)=>`<span class="avs">${list.slice(0,n).map(d=>`<img src="${IMG(d.img)}" alt="" loading="lazy" width="900" height="1200">`).join('')}${list.length>n?`<i>+${list.length-n}</i>`:''}</span>`;
const tile=(href,ic,t,s,ext,lead)=>`<a class="mm-tile${lead?' mm-tile--lead':''}" href="${href}"${ext?' target="_blank" rel="noopener"':''}><span class="mm-tile-top"><span class="ico-s">${ICON[ic]}</span><svg class="mm-go" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6"/></svg></span><b>${t}</b><small>${s}</small></a>`;
const strip=items=>`<div class="mm-strip">${items.map(([ic,t])=>`<span>${ICON[ic]}${t}</span>`).join('')}</div>`;
const feature=(href,img,eb,t,s)=>`<a class="mega-feature" href="${href}"><img src="${IMG(img)}" alt="" loading="lazy" width="1800" height="1200"><span class="mf-body"><span class="mf-eb">${eb}</span><b>${t}</b><span>${s} &rarr;</span></span></a>`;

/* ---------- Shared: footer care links ---------- */
$('footCare').innerHTML=CARE.map(c=>`<li><a href="${areaUrl(c)}">${c.name}</a></li>`).join('');

/* ---------- Home ---------- */
let showCare=()=>{};
if(PAGE==='home'){
 /* Areas of care: infinite carousel (slides rendered 3x, index kept in middle copy), synced tabs */
 const tabs=$('careTabs'),cView=$('careView'),cTrack=$('careTrack'),N=CARE.length;
 const C_DWELL=6000,cReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let ci=N,cTimer=null,cUserPaused=cReduce,cHold=false,cBusy=false;
 tabs.innerHTML=CARE.map((c,i)=>`<button role="tab" type="button" id="tab-${c.k}" aria-selected="${i===0}" aria-controls="careView" data-i="${i}"><span>${c.name}</span><i aria-hidden="true"></i></button>`).join('');
 tabs.style.setProperty('--dur',C_DWELL+'ms');
 const slide=(c,clone)=>`<article class="care-slide"${clone?' aria-hidden="true" inert':''}>
   <div class="care-img"><img src="${IMG(c.img)}" alt="${clone?'':esc(c.name)+' at Total Cardiovascular Care'}" width="1800" height="1200" loading="lazy"><span class="tag glass">${c.name}</span></div>
   <div class="care-body"><h3>${c.name}</h3><p style="color:var(--muted)">${c.blurb}</p>
   <ul>${c.items.map(it=>c.link&&c.link[it]?`<li><a href="${c.link[it]}">${it}<span>Read guide &rarr;</span></a></li>`:`<li>${it}</li>`).join('')}</ul>
   <div class="actions"><a class="btn" href="${areaUrl(c)}">Explore ${c.name.toLowerCase()}</a><a class="btn btn--ghost" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a></div></div></article>`;
 cTrack.innerHTML=CARE.map(c=>slide(c,1)).join('')+CARE.map(c=>slide(c,0)).join('')+CARE.map(c=>slide(c,1)).join('');
 const cSlides=[...cTrack.children];
 const sizeSlides=()=>{const wr=cView.parentElement,cs=getComputedStyle(wr);cView.style.setProperty('--slideW',(wr.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight))+'px')};
 const cStep=()=>cSlides[1].offsetLeft-cSlides[0].offsetLeft;
 const cFit=()=>{cView.style.height=innerWidth<=900?cSlides[ci].offsetHeight+'px':''};
 const cPlace=anim=>{cTrack.classList.toggle('no-anim',!anim);requestAnimationFrame(cFit);cTrack.style.transform=`translate3d(${-ci*cStep()}px,0,0)`;cSlides.forEach((el,j)=>el.classList.toggle('is-current',j===ci));if(!anim)void cTrack.offsetWidth;};
 const syncTabs=()=>{const k=((ci%N)+N)%N;const bs=tabs.querySelectorAll('button');const ab=bs[k];if(ab&&tabs.scrollWidth>tabs.clientWidth)tabs.scrollTo({left:ab.offsetLeft-(tabs.clientWidth-ab.offsetWidth)/2,behavior:'smooth'});const cc=$('careCount');if(cc)cc.innerHTML=`<b>${String(k+1).padStart(2,'0')}</b> / ${String(N).padStart(2,'0')}`;bs.forEach((b,j)=>{b.setAttribute('aria-selected',j===k);b.classList.remove('run')});void tabs.offsetWidth;if(!cUserPaused&&!cHold)bs[k].classList.add('run');};
 function cGo(target,anim=true){if(cBusy&&anim)return;cBusy=anim;ci=target;cPlace(anim);syncTabs();cSchedule();}
 cTrack.addEventListener('transitionend',e=>{if(e.target!==cTrack)return;cBusy=false;if(ci>=2*N){ci-=N;cPlace(false)}else if(ci<N){ci+=N;cPlace(false)}});
 function cSchedule(){clearTimeout(cTimer);if(!cUserPaused&&!cHold&&!document.hidden)cTimer=setTimeout(()=>cGo(ci+1),C_DWELL);}
 const cSetHold=h=>{cHold=h;syncTabs();cSchedule()};
 function cSetPaused(p){cUserPaused=p;syncTabs();cSchedule();}
 showCare=i=>{const cur=((ci%N)+N)%N;const t=ci+(i-cur);cGo(t,t!==ci);};
 tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(b)showCare(+b.dataset.i)});
 tabs.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;const bs=[...tabs.querySelectorAll('button')];let i=bs.findIndex(b=>b.getAttribute('aria-selected')==='true');i=(i+(e.key==='ArrowRight'?1:-1)+N)%N;showCare(i);bs[i].focus()});
 document.querySelectorAll('[data-care-step]').forEach(b=>b.addEventListener('click',()=>cGo(ci+ +b.dataset.careStep)));
 const careSec=$('care');
 careSec.addEventListener('mouseenter',()=>cSetHold(true));careSec.addEventListener('mouseleave',()=>cSetHold(false));
 cView.addEventListener('focusin',()=>cSetHold(true));cView.addEventListener('focusout',()=>cSetHold(false));
 document.addEventListener('visibilitychange',cSchedule);
 let csx=null,cSwiped=false;
 cView.addEventListener('pointerdown',e=>{csx=e.clientX;cSwiped=false});
 cView.addEventListener('pointerup',e=>{if(csx===null)return;const dx=e.clientX-csx;csx=null;if(Math.abs(dx)>50){cSwiped=true;cGo(ci+(dx<0?1:-1))}});
 cView.addEventListener('click',e=>{if(cSwiped){e.preventDefault();cSwiped=false}},true);
 cView.addEventListener('dragstart',e=>e.preventDefault());
 addEventListener('resize',()=>{sizeSlides();cPlace(false)});
 cTrack.addEventListener('load',()=>cFit(),true);
 sizeSlides();cPlace(false);cSetPaused(cUserPaused);

 const FILTERS=[['all','All doctors'],['interventional','Interventional & structural'],['imaging','Imaging'],['hf','Heart failure'],['rhythm','Rhythm'],['paeds','Paediatric & fetal'],['physician','Physicians']];
 const fBox=$('docFilters'),rail=$('docRail');
 fBox.innerHTML=FILTERS.map(([k,l],i)=>`<button class="chip" type="button" data-f="${k}" aria-pressed="${i===0}">${l}</button>`).join('');
 /* Doctor carousel: infinite loop (list rendered 3x, index kept in the middle copy),
    dwell then glide one card; pauses on hover/focus, pause button, swipe, reduced motion = paused */
 const view=$('docViewport'),ctrlBtns=[...document.querySelectorAll('[data-rail]')];
 const DWELL=3500,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let n=0,idx=0,loop=false,timer=null,userPaused=reduce,hold=false,busy=false;
 const step=()=>{const c=rail.children[0],c2=rail.children[1];return c&&c2?c2.offsetLeft-c.offsetLeft:0};
 const place=(anim)=>{rail.classList.toggle('no-anim',!anim);rail.style.transform=`translate3d(${-idx*step()}px,0,0)`;if(!anim)void rail.offsetWidth;};
 function renderRail(f){
  const list=DOCS.filter(d=>f==='all'||groupsOf(d).includes(f));n=list.length;
  $('docCount').textContent=n+(n===1?' doctor':' doctors');
  rail.innerHTML=list.map(docCard).join('');idx=0;place(false);
  loop=n>1&&rail.scrollWidth>view.clientWidth+8;
  if(loop){
   const real=rail.innerHTML,clone=list.map(docCard).join('').replace(/<a class="doc"/g,'<a class="doc" aria-hidden="true" tabindex="-1"');
   rail.innerHTML=clone+real+clone;idx=n;place(false);
  }
  ctrlBtns.forEach(b=>b.disabled=!loop);
  schedule();
 }
 function go(dir){
  if(!loop||busy)return;busy=true;idx+=dir;place(true);
 }
 rail.addEventListener('transitionend',e=>{
  if(e.target!==rail)return;busy=false;
  if(idx>=2*n){idx-=n;place(false)}else if(idx<n){idx+=n;place(false)}
 });
 function schedule(){clearTimeout(timer);if(loop&&!userPaused&&!hold&&!document.hidden)timer=setTimeout(()=>{go(1);schedule()},DWELL);}
 function setPaused(p){userPaused=p;schedule();}
 ctrlBtns.forEach(b=>b.addEventListener('click',()=>{go(+b.dataset.rail);schedule()}));
 view.addEventListener('mouseenter',()=>{hold=true;schedule()});
 view.addEventListener('mouseleave',()=>{hold=false;schedule()});
 view.addEventListener('focusin',()=>{hold=true;schedule()});
 view.addEventListener('focusout',()=>{hold=false;schedule()});
 document.addEventListener('visibilitychange',schedule);
 let sx=null,swiped=false;
 view.addEventListener('pointerdown',e=>{sx=e.clientX;swiped=false});
 view.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>40){swiped=true;go(dx<0?1:-1);schedule()}});
 view.addEventListener('click',e=>{if(swiped){e.preventDefault();swiped=false}},true);
 view.addEventListener('dragstart',e=>e.preventDefault());
 addEventListener('resize',()=>place(false));
 fBox.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;fBox.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderRail(b.dataset.f)});
 setPaused(userPaused);renderRail('all');

 $('locList').innerHTML=LOCS.map(locItem).join('');
 $('netmapHome').innerHTML=netmap('frankston');linkMap($('locations'));

 const st=$('statement');
 st.innerHTML=st.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');
 const words=[...st.querySelectorAll('.w')];
 const reveal=()=>{const r=st.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*0.85-r.top)/(r.height+vh*0.35)));const n=Math.round(p*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n));};
 addEventListener('scroll',()=>requestAnimationFrame(reveal),{passive:true});reveal();

 /* Hero background slideshow: crossfade every 7s; still for reduced motion, idle in hidden tabs */
 (function(){
  const slides=[...document.querySelectorAll('.hero-bg')];
  if(slides.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const DUR=7000;let cur=0,timer=null;
  const loadAll=()=>slides.forEach(s=>{if(s.dataset.src){s.src=s.dataset.src;s.removeAttribute('data-src')}});
  if(document.readyState==='complete')loadAll();else addEventListener('load',loadAll);
  function next(){
   loadAll();
   slides.forEach(s=>s.classList.remove('is-leaving'));
   slides[cur].classList.replace('is-on','is-leaving');
   cur=(cur+1)%slides.length;
   slides[cur].classList.add('is-on');
  }
  const start=()=>{clearInterval(timer);timer=setInterval(next,DUR)};
  document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(timer):start());
  start();
 })();

 const careHash=()=>{const m=location.hash.match(/^#care-(\d)$/);if(m){showCare(+m[1]);$('care').scrollIntoView();}};
 addEventListener('hashchange',careHash);careHash();
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-care]');if(a&&PAGE==='home'){showCare(+a.dataset.care)}});

/* ---------- Doctor ---------- */
if(PAGE==='doctor'){
 const d=DOCS.find(x=>x.s===SLUG)||DOCS[0];const care=careFor(d);
 const creds=d.c.replace('Grad Dip (Clinical Education)','Grad Dip').split(/\s+/).filter(Boolean);
 const gl=[];creds.forEach(c=>{const k=c.replace(/[()]/g,'');if(GLOSS[k]&&!gl.find(g=>g[0]===k))gl.push([k,GLOSS[k]])});
 const same=DOCS.filter(x=>x.s!==d.s&&groupsOf(x).some(g=>groupsOf(d).includes(g)));
 const peers=[...same,...DOCS.filter(x=>x.s!==d.s&&!same.includes(x))].slice(0,8);
 $('doctorRoot').innerHTML=`
 <div class="band page-hero dr-band">
 <nav class="crumbs" aria-label="Breadcrumb"><a href="${ROOT}index.html">Home</a>/<a href="${ROOT}doctors.html">Doctors</a>/<span aria-current="page">${esc(d.n)}</span></nav>
 <div class="dr-hero">
  <div class="dr-text">
   <span class="eyebrow">${esc(d.t)}</span>
   <h1>${esc(d.n)}</h1>
   <p class="lede bio">${esc(d.b)}</p>
   <ul class="dr-tags">${d.d.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <div class="actions"><a class="btn" href="${APPT}" target="_blank" rel="noopener">Book an appointment ${arrow}</a><a class="btn btn--ghost" href="#d-referral">How to book</a></div>
  </div>
  <div class="dr-visual">
   <svg class="dr-ecg" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 H230 l12 0 l9 -12 l9 12 l10 0 l9 22 l15 -70 l14 64 l9 -16 l12 0 l12 -6 l12 6 H600"/></svg>
   <figure class="dr-portrait"><img src="${IMG(d.img)}" alt="Portrait of ${esc(d.n)}" width="900" height="1200"></figure>
   <div class="dr-float dr-float--book glass"><span class="live"><i aria-hidden="true"></i></span><span><b>Book online</b><small>Reply within 24 hours</small></span></div>
   <div class="dr-float dr-float--count glass"><b>${String(d.d.length).padStart(2,'0')}</b><small>Disciplines</small></div>
  </div>
 </div>
 </div>
 <dl class="dr-facts">
  <div><dt>Specialty</dt><dd>${esc(d.t[0].toUpperCase()+d.t.slice(1))}</dd></div>
  <div><dt>Qualifications</dt><dd class="mono-s">${esc(d.c)}</dd></div>
  <div><dt>Referrals</dt><dd>Via Frankston main rooms</dd></div>
  <div><dt>Appointments</dt><dd><a class="tel" href="tel:0390706116">03 9070 6116</a></dd></div>
 </dl>
 <div class="split"><h2>Profile</h2>
  <div class="profile-grid">
   <div><span class="eyebrow">Disciplines</span><ul class="disc-cards">${d.d.map(x=>`<li><span class="ico-s">${/imaging|echo/i.test(x)?ICON.search:/rhythm|electro/i.test(x)?ICON.pulse:/paediatric|fetal/i.test(x)?ICON.team:ICON.heart}</span><b>${esc(x)}</b></li>`).join('')}</ul></div>
   <div><span class="eyebrow">Qualifications</span><dl class="qual-cards">${gl.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
  </div></div>
 ${care.length?`<div class="split split--full"><div class="doctor-tools"><h2>Areas of care</h2><a href="${ROOT}services.html">All services &rarr;</a></div><div class="area-grid">${care.map(areaCard).join('')}</div></div>`:''}
 <div class="split band" id="d-referral"><h2>Booking an appointment</h2>
  <ol class="steps">
   <li><b>Get a referral</b><p>Ask your GP or specialist for a referral addressed to ${esc(d.n)}.</p></li>
   <li><b>Send your request</b><p>Complete the online request form, or call <a class="tel" href="tel:0390706116">03 9070 6116</a>.</p></li>
   <li><b>We'll be in touch</b><p>Our team will contact you within 24 hours to arrange a time and clinic.</p></li>
  </ol></div>
 ${peers.length?`<div class="band-ink band-ink--inline"><div class="doctor-tools"><h2>Related specialists</h2><a href="${ROOT}doctors.html">All doctors &rarr;</a></div><div class="rail">${peers.map(docCard).join('')}</div></div>`:''}`;
}

/* ---------- Service ---------- */
if(PAGE==='service'){
 $('svcRail').innerHTML=DOCS.filter(d=>/interventional/i.test(d.d.join(' '))&&!/heart failure/i.test(d.d.join(' '))).map(docCard).join('');
 $('svcRelated').innerHTML=CARE.filter(c=>['interventional','structural'].includes(c.k)).map(areaCard).join('');
 const tocLinks=[...document.querySelectorAll('#toc a')];
 const spy=()=>{let on=tocLinks[0];tocLinks.forEach(a=>{const s=$(a.getAttribute('href').slice(1));if(s&&s.getBoundingClientRect().top<160)on=a});tocLinks.forEach(a=>a.classList.toggle('on',a===on));};
 addEventListener('scroll',()=>requestAnimationFrame(spy),{passive:true});spy();
}

/* ---------- Location ---------- */
const ICON_PHONE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
const ICON_MAIL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>';
const ICON_PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const ICON_CLOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
if(PAGE==='location'){
 const l=LOCS.find(x=>x.s===SLUG)||LOCS[0];
 const today=(new Date().getDay()+6)%7;
 const now=new Date(),mins=now.getHours()*60+now.getMinutes();
 const isOpen=l.main&&today<5&&mins>=540&&mins<1020;
 const others=LOCS.filter(x=>x.s!==l.s);
 $('locationRoot').innerHTML=`
 <div class="band page-hero page-hero--lift">
 <nav class="crumbs" aria-label="Breadcrumb"><a href="${ROOT}index.html">Home</a>/<a href="${ROOT}locations.html">Locations</a>/<span aria-current="page">${l.n}</span></nav>
 <div class="lc-hero">
  <div style="display:flex;flex-direction:column;justify-content:center">
   <span class="eyebrow">${l.main?'Main rooms · Cardiology clinic':'Cardiology clinic'}</span>
   <h1>${l.n}</h1>
   <p class="venue">${esc(l.v)}</p>
   <p class="addr">${esc(l.a)}, ${esc(l.sub)}</p>
   <div class="actions"><a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a><a class="btn btn--ghost" href="${maps(l)}" target="_blank" rel="noopener">Get directions ${arrow}</a></div>
  </div>
  <figure class="lc-photo" style="margin:0"><img src="${IMG(l.img)}" alt="Street view of the ${esc(l.n)} clinic at ${esc(l.a)}" width="1200" height="1200">
   ${l.main?`<span class="status glass ${isOpen?'open':''}"><i></i>${isOpen?'Open now · until 5:00 pm':'Closed now · opens 9:00 am weekdays'}</span>`:''}</figure>
 </div>
 </div>
 <div class="lc-panel">
  <div class="lc-contact">
   <div class="lc-row"><span class="ico-s">${ICON_PHONE}</span><div><small>Phone</small><b class="v">03 9070 6116</b><p>${l.main?'Call ahead before visiting. Appointments are required.':'Bookings for this clinic go through our main rooms.'}</p></div><button class="copy-btn" type="button" data-copy="03 9070 6116">Copy</button></div>
   <div class="lc-row"><span class="ico-s">${ICON_MAIL}</span><div><small>Email</small><b class="v">reception@totalcardiovascular&shy;care.com.au</b><p>For general enquiries. Please call for urgent appointments.</p></div><button class="copy-btn" type="button" data-copy="reception@totalcardiovascularcare.com.au">Copy</button></div>
   <div class="lc-row"><span class="ico-s">${ICON_PIN}</span><div><small>Address</small><b>${esc(l.v)}</b><p>${esc(l.a)}, ${esc(l.sub)}</p></div><a class="copy-btn" href="${maps(l)}" target="_blank" rel="noopener">Directions</a></div>
  </div>
  <div class="lc-hours">
   <div class="lc-hours-head"><span class="ico-s">${ICON_CLOCK}</span><b>Opening hours</b>${l.main?`<span class="lc-status ${isOpen?'open':''}"><i></i>${isOpen?'Open now':'Closed now'}</span>`:''}</div>
   ${l.main?`<table class="hours"><tbody>${HOURS_FRANKSTON.map((h,i)=>`<tr class="${h[1]==='Closed'?'closed':''} ${i===today?'today':''}"><td>${h[0]}</td><td>${h[1]}</td></tr>`).join('')}</tbody></table><p class="src">Hours may change on public holidays.</p>`:`<div class="lc-session"><b>Session days vary</b><p>Our specialists consult here on set days. Call <a class="tel" href="tel:0390706116">03 9070 6116</a> to find the next available appointment.</p><a class="btn btn--ghost btn--sm" href="${locUrl('frankston')}">Main rooms hours</a></div>`}
  </div>
 </div>
 <div class="ref-band ref-band--page">
  <figure class="ref-img"><img src="${IMG('tcc_experts')}" alt="Three Total Cardiovascular Care cardiologists" width="1800" height="1200" loading="lazy"></figure>
  <div class="copy"><span class="eyebrow">Referrals</span><h2>${l.main?'Referrals for every clinic':'Referring to '+l.n}</h2>
   <p>${l.main?'The Frankston main rooms coordinate referrals for every Total Cardiovascular Care clinic. We accept referrals from practitioners locally, across Australia and internationally.':'Referrals for '+l.n+' are coordinated by our main rooms in Frankston. Address your referral to the specialist and we will arrange the appointment here.'}</p>
   <div class="actions"><a class="btn btn--ink" href="https://totalcardiovascularcare.com.au/contact/" target="_blank" rel="noopener">Referral form</a>${l.main?'':`<a class="btn btn--ghost" href="${locUrl('frankston')}">Main rooms details</a>`}</div></div>
 </div>
 <div class="split split--full"><div class="doctor-tools"><h2>Our clinic network</h2><a href="${ROOT}locations.html">All locations &rarr;</a></div>
  <div class="locs"><figure class="netmap" style="margin:0">${netmap(l.s)}<figcaption><span>${l.n} highlighted</span><span>Select a pin to view a clinic</span></figcaption></figure>
  <ul class="loc-list">${others.map(locItem).join('')}</ul></div></div>
 <div class="band-ink band-ink--inline"><div class="doctor-tools"><h2>Specialists across our network</h2><a href="${ROOT}doctors.html">All doctors &rarr;</a></div><div class="rail">${DOCS.slice(0,8).map(docCard).join('')}</div></div>`;
 linkMap($('locationRoot'));
}

/* A call-to-action tile that stretches across the empty part of a grid's last row */
function fillRow(grid,tile){
 grid.appendChild(tile);
 const fit=()=>{tile.style.gridColumn='';const cols=getComputedStyle(grid).gridTemplateColumns.split(' ').length;const n=grid.children.length-1;const rem=n%cols;tile.style.gridColumn=cols<2?'':`span ${rem?cols-rem:cols}`;tile.classList.toggle('row-cta--wide',(rem?cols-rem:cols)>1);};
 fit();addEventListener('resize',fit);
}
const ctaTile=(eb,t,p,btns)=>{const el=document.createElement('div');el.className='row-cta';el.innerHTML=`<div class="row-cta-copy"><span class="eyebrow">${eb}</span><h3>${t}</h3><p>${p}</p></div><div class="row-cta-actions">${btns}</div>`;return el;};

/* ---------- Mega menus (desktop) ---------- */
(function(){
 const M={
  doctors:`<div class="mega-main"><div class="mega-head"><b>Our doctors</b><a href="${PG.doctors}">View all ${DOCS.length} doctors &rarr;</a></div>
   <div class="mm-docs">${DOCS.slice(0,12).map(d=>`<a class="mm-doc" href="${docUrl(d.s)}"><img src="${IMG(d.img)}" alt="" loading="lazy" width="900" height="1200"><span><b>${esc(d.n)}</b><small>${esc(d.t)}</small></span></a>`).join('')}</div>
   <div class="mm-chips">${DFILTERS.slice(1).map(([k,l])=>`<a href="${PG.doctors}#f-${k}">${l}</a>`).join('')}</div></div>
   ${feature(PG.doctors,'hero-team','Specialists','Meet the team','Profiles for every doctor')}`,
  services:`<div class="mega-main"><div class="mega-head"><b>Areas of care</b><a href="${PG.services}">All services &rarr;</a></div>
   <div class="mm-areas">${CARE.map(c=>`<a class="mm-area" href="${areaUrl(c)}"><img src="${IMG(c.img)}" alt="" loading="lazy" width="1800" height="1200"><span><b>${c.name}</b><small>${c.items.length} procedures &amp; tests</small></span></a>`).join('')}</div></div>
   ${feature(SVC,'interventional','Patient guide','Coronary angioplasty &amp; stents','Read the guide')}`,
  locations:`<div class="mega-main"><div class="mega-head"><b>Seven clinics</b><a href="${PG.locations}">View map &amp; all clinics &rarr;</a></div>
   <div class="mm-locs">${LOCS.map(l=>`<a class="mm-loc" href="${locUrl(l.s)}"><span class="ico-s">${ICON.pin}</span><span><b>${l.n}${l.main?' <em>Main rooms</em>':''}</b><small>${esc(l.main?l.a:l.v)} · ${l.pc}</small></span></a>`).join('')}</div></div>
   ${feature(locUrl('frankston'),'frankston-location','Main rooms','Frankston','Mon–Fri, 9am–5pm')}`,
  referrers:`<div class="mega-main"><div class="mega-head"><b>For referring doctors</b><a href="${PG.referrers}">Referrer information &rarr;</a></div>
   <div class="mm-tiles">${tile(PG.referrers+'#how','doc','How to refer','Three steps from referral to appointment.',0,1)}${tile('https://totalcardiovascularcare.com.au/contact/','cal','Referral form','Send your referral to our team online.',1)}${tile(PG.referrers+'#finder','search','Find a specialist','Browse our doctors by discipline.')}${tile('tel:0390706116','phone','Call main rooms','03 9070 6116, Monday to Friday.')}</div>
   ${strip([['pin','Main rooms: 11 Hastings Road, Frankston VIC 3199'],['mail','reception@totalcardiovascularcare.com.au']])}</div>
   ${feature(PG.referrers,'tcc_experts','Referrers','Working with referring clinicians','Locally, nationally and internationally')}`,
  about:`<div class="mega-main"><div class="mega-head"><b>About the practice</b><a href="${PG.about}">About us &rarr;</a></div>
   <div class="mm-tiles">${tile(PG.about,'heart','Our practice','Prevention-first, personalised cardiology.',0,1)}${tile(PG.about+'#team','team','Support team','Meet our nurses and administration team.')}${tile(PG.doctors,'cap','Our doctors',DOCS.length+' cardiologists and physicians.')}${tile('https://totalcardiovascularcare.com.au/faqs/','info','FAQs','Answers to common patient questions.',1)}</div>
   ${strip([['team',DOCS.length+' specialists'],['pin','7 clinics, Highett to Inverloch'],['pulse','6 areas of cardiac care']])}</div>
   ${feature(PG.about,'hero-consult','About us','Professional &amp; personal care','Our approach')}`,
  contact:`<div class="mega-main"><div class="mega-head"><b>Get in touch</b><a href="${PG.contact}">Contact page &rarr;</a></div>
   <div class="mm-tiles">${tile(APPT,'cal','Book online','Request a time. We reply within 24 hours.',1,1)}${tile('tel:0390706116','phone','Call us','03 9070 6116 for urgent appointments.')}${tile('mailto:reception@totalcardiovascularcare.com.au','mail','Email','General enquiries to our reception team.')}${tile(PG.contact+'#feedback','chat','Feedback','Tell us how we did, good or bad.')}</div>
   ${strip([['pin','Main rooms: 11 Hastings Road, Frankston'],['cal','Monday to Friday, 9:00 am – 5:00 pm']])}</div>
   ${feature(PG.locations,'tcc_banner_9','Visit us','Seven clinics near you','Find a clinic')}`
 };
 const head=document.querySelector('.site-head');
 document.querySelectorAll('.nav-item').forEach(it=>{
  const k=it.dataset.mega,box=it.querySelector('.mega');if(!box||!M[k])return;
  box.innerHTML=`<div class="wrap mega-in">${M[k]}</div>`;
  const on=()=>head.classList.add('mega-on'),off=()=>{if(!head.querySelector('.nav-item:hover,.nav-item:focus-within'))head.classList.remove('mega-on')};
  it.addEventListener('mouseenter',on);it.addEventListener('mouseleave',()=>setTimeout(off,10));
  it.addEventListener('focusin',on);it.addEventListener('focusout',()=>setTimeout(off,10));
  it.addEventListener('keydown',e=>{if(e.key==='Escape'){document.activeElement.blur();head.classList.remove('mega-on')}});
 });
})();

/* ---------- Doctors index ---------- */
if(PAGE==='doctors'){
 const fBox=$('docFilters'),grid=$('docGrid');
 fBox.innerHTML=DFILTERS.map(([k,l],i)=>`<button class="chip" type="button" data-f="${k}" aria-pressed="${i===0}">${l}</button>`).join('');
 const render=f=>{const list=docsIn(f);grid.innerHTML=list.map(docCard).join('');fillRow(grid,ctaTile('Not sure who to see?','We can match you with the right specialist','Request an appointment and our team will book you with a doctor suited to your referral and symptoms.',`<a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a><a class="btn btn--ghost" href="tel:0390706116">Call 03 9070 6116</a>`));$('docCount').textContent=list.length+(list.length===1?' doctor':' doctors');fBox.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.f===f));};
 fBox.addEventListener('click',e=>{const b=e.target.closest('.chip');if(b){render(b.dataset.f);history.replaceState(null,'',b.dataset.f==='all'?location.pathname:'#f-'+b.dataset.f)}});
 const fromHash=()=>{const m=location.hash.match(/^#f-([a-z]+)$/);render(m&&DFILTERS.some(x=>x[0]===m[1])?m[1]:'all');};
 addEventListener('hashchange',fromHash);fromHash();
}

/* ---------- Services index ---------- */
if(PAGE==='services'){
 $('areaJump').innerHTML=CARE.map(c=>`<a href="#area-${c.k}">${c.name}</a>`).join('');
 const GK={general:null,interventional:'interventional',structural:'interventional',imaging:'imaging',hf:'hf',rhythm:'rhythm'};
 $('svcRows').innerHTML=CARE.map((c,i)=>{const team=c.k==='general'?DOCS.filter(d=>/general cardiolog/i.test(d.d.join(' '))):docsIn(GK[c.k]);
  return `<section class="svc-row${i%2?' svc-row--flip':''}" id="area-${c.k}">
   <figure class="svc-row-img"><img src="${IMG(c.img)}" alt="${esc(c.name)} at Total Cardiovascular Care" loading="lazy" width="1800" height="1200"><span class="tag glass">${c.name}</span></figure>
   <div class="svc-row-body"><span class="eyebrow">${String(i+1).padStart(2,'0')} / 06</span><h2>${c.name}</h2><p class="lede">${c.blurb}</p>
    <ul class="proc-list">${c.items.map(it=>c.link&&c.link[it]?`<li><a href="${c.link[it]}">${it}<span>Patient guide &rarr;</span></a></li>`:`<li>${it}</li>`).join('')}</ul>
    <div class="svc-team">${avatars(team)}<span>${team.length} specialist${team.length===1?'':'s'} in this area</span></div>
    <div class="actions"><a class="btn btn--ink" href="${areaUrl(c)}">Explore ${c.name.toLowerCase()} ${arrow}</a><a class="btn btn--ghost" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a></div></div>
  </section>`;}).join('');
}

/* ---------- Locations index + contact page map ---------- */
if(PAGE==='locations'||PAGE==='contact'){
 $('netmapPage').innerHTML=netmap('frankston');
 $('locListPage').innerHTML=LOCS.map(locItem).join('');
 linkMap(document.querySelector('main'));
}
if(PAGE==='locations'){
 $('locGrid').innerHTML=LOCS.map(l=>`<article class="loc-card" data-loc="${l.s}">
  <a class="loc-card-img" href="${locUrl(l.s)}" tabindex="-1" aria-hidden="true"><img src="${IMG(l.img)}" alt="" loading="lazy" width="1200" height="1200">${l.main?'<span class="tag glass">Main rooms</span>':''}</a>
  <div class="loc-card-body"><span class="eyebrow">${l.pc}</span><h3>${l.n}</h3><p><b>${esc(l.v)}</b><br>${esc(l.a)}, ${esc(l.sub)}</p>
  <div class="loc-card-links"><a href="${locUrl(l.s)}">Clinic details &rarr;</a><a href="${maps(l)}" target="_blank" rel="noopener">Directions</a></div></div></article>`).join('');
 fillRow($('locGrid'),ctaTile('Not sure which clinic?','We will find the closest appointment','All seven clinics are booked through our main rooms in Frankston. Tell us where you live and we will suggest the nearest clinic with availability.',`<a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a><a class="btn btn--ghost" href="tel:0390706116">Call 03 9070 6116</a>`));
}

/* ---------- Referrers ---------- */
if(PAGE==='referrers'){
 $('finderGrid').innerHTML=DFILTERS.slice(1).map(([k,l])=>{const list=docsIn(k);return `<a class="finder-card" href="${PG.doctors}#f-${k}"><span class="eyebrow">${list.length} doctor${list.length===1?'':'s'}</span><b>${l}</b>${avatars(list,4)}<span class="go-s">View &rarr;</span></a>`}).join('');
 $('refRail').innerHTML=DOCS.map(docCard).join('');
}

/* ---------- About ---------- */
if(PAGE==='about'){
 $('staffGrid').innerHTML=STAFF.map(s=>`<article class="staff"><div class="staff-ph"><img src="${IMG(s.img)}" alt="Portrait of ${esc(s.n)}" loading="lazy" width="900" height="1200"></div><span class="eyebrow">${esc(s.r)}</span><h3>${esc(s.n)}</h3><p>${esc(s.b)}</p></article>`).join('');
 $('aboutRail').innerHTML=DOCS.map(docCard).join('');
}

/* ---------- Area of care pages ---------- */
if(PAGE==='area'){
 const c=CARE.find(x=>x.k===SLUG);
 const GKA={general:null,interventional:'interventional',structural:'interventional',imaging:'imaging',hf:'hf',rhythm:'rhythm'};
 const team=c.k==='general'?DOCS.filter(d=>/general cardiolog/i.test(d.d.join(' '))):docsIn(GKA[c.k]);
 $('areaRail').innerHTML=team.map(docCard).join('');
 fillRow($('areaRail'),ctaTile('Not sure who to see?','We will match you with the right specialist',`Request an appointment and our team will book you with a doctor experienced in ${c.name.toLowerCase()}.`,`<a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a><a class="btn btn--ghost" href="${PG.doctors}">All doctors</a>`));
 $('areaCount').textContent=String(team.length).padStart(2,'0');
 $('areaOthers').innerHTML=CARE.filter(x=>x.k!==c.k).map(areaCard).join('');
 fillRow($('areaOthers'),ctaTile('Not sure which service you need?','Start with a consultation','A cardiology consultation is the usual first step. Your specialist will recommend any tests or procedures you need.',`<a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a><a class="btn btn--ghost" href="${PG.services}">All services</a>`));
 /* opening a procedure from the jump links or a #hash */
 const openHash=()=>{const el=location.hash&&document.getElementById(location.hash.slice(1));if(el&&el.tagName==='DETAILS'){el.open=true;el.scrollIntoView({block:'start'})}};
 addEventListener('hashchange',openHash);openHash();
}

/* ---------- Shared behaviour ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;const t=b.dataset.copy,o=b.textContent;
 const sel=()=>{const v=b.parentElement.querySelector('.v');const r=document.createRange();r.selectNodeContents(v);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press Ctrl+C';};
 try{navigator.clipboard.writeText(t).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent=o,1600)},sel)}catch(_){sel()}});
const head=document.querySelector('.site-head'),menuBtn=$('menuBtn');
/* Mobile drawer: accordion sections built from the same data as the mega menus */
const drawer=$('mDrawer');
(function(){
 const chev='<span class="m-toggle" aria-hidden="true"><svg class="m-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 4.5 3 3 3-3"/></svg></span>';
 const go='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
 const row=(href,lead,t,s,ext)=>`<a class="m-item" href="${href}"${ext?' target="_blank" rel="noopener"':''}>${lead}<span><b>${t}</b>${s?`<small>${s}</small>`:''}</span></a>`;
 const ic=k=>`<span class="m-ic">${ICON[k]}</span>`;
 const SECTIONS=[
  ['doctors','Doctors',DOCS.length+' specialists',PG.doctors,'All doctors',
    DOCS.map(d=>row(docUrl(d.s),`<img class="m-av" src="${IMG(d.img)}" alt="" loading="lazy" width="900" height="1200">`,esc(d.n),esc(d.t))).join('')],
  ['services','Services','6 areas of care',PG.services,'All services',
    CARE.map(c=>row(areaUrl(c),`<img class="m-th" src="${IMG(c.img)}" alt="" loading="lazy" width="1800" height="1200">`,c.name,c.items.length+' procedures &amp; tests')).join('')
    +row(SVC,ic('doc'),'Angioplasty patient guide','Coronary angioplasty &amp; stents')],
  ['locations','Locations','7 clinics',PG.locations,'Map &amp; all clinics',
    LOCS.map(l=>row(locUrl(l.s),ic('pin'),l.n+(l.main?' <em>Main rooms</em>':''),esc(l.main?l.a:l.v)+' · '+l.pc)).join('')],
  ['referrers','Referrers','For referring doctors',PG.referrers,'Referrer information',
    row(PG.referrers+'#how',ic('doc'),'How to refer','Three steps from referral to appointment')
    +row('https://totalcardiovascularcare.com.au/contact/',ic('cal'),'Referral form','Send your referral online',1)
    +row(PG.referrers+'#finder',ic('search'),'Find a specialist','Doctors by discipline')
    +row('tel:0390706116',ic('phone'),'Call main rooms','03 9070 6116')],
  ['about','About','Our practice &amp; team',PG.about,'About us',
    row(PG.about,ic('heart'),'Our practice','Prevention-first cardiology')
    +row(PG.about+'#team',ic('team'),'Support team','Nurses and administration')
    +row('https://totalcardiovascularcare.com.au/faqs/',ic('info'),'FAQs','Common questions',1)],
  ['contact','Contact','Book, call or visit',PG.contact,'Contact page',
    row(APPT,ic('cal'),'Book online','Reply within 24 hours',1)
    +row('tel:0390706116',ic('phone'),'Call us','03 9070 6116')
    +row('mailto:reception@totalcardiovascularcare.com.au',ic('mail'),'Email','General enquiries')
    +row(PG.contact+'#feedback',ic('chat'),'Feedback','Tell us how we did')]
 ];
 drawer.innerHTML=`<nav class="m-nav" aria-label="Mobile">${SECTIONS.map(([k,label,hint,href,allLabel,items])=>`
  <div class="m-group${PAGE===k||(k==='doctors'&&PAGE==='doctor')||(k==='locations'&&PAGE==='location')||(k==='services'&&(PAGE==='area'||PAGE==='service'))?' is-current':''}">
   <button class="m-row" type="button" aria-expanded="false" aria-controls="m-sub-${k}"><span><b>${label}</b><small>${hint}</small></span>${chev}</button>
   <div class="m-sub" id="m-sub-${k}"><div class="m-sub-in">
    <a class="m-all" href="${href}">${allLabel} ${go}</a>
    <div class="m-list">${items}</div>
   </div></div>
  </div>`).join('')}
  <div class="m-foot">
   <a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a>
   <a class="btn btn--ghost" href="tel:0390706116">${ICON.phone} Call 03 9070 6116</a>
   <p>${ICON.pin}<span>Main rooms: 11 Hastings Road, Frankston VIC 3199<br>Monday to Friday, 9:00 am – 5:00 pm</span></p>
  </div></nav>`;
 const groups=[...drawer.querySelectorAll('.m-group')];
 groups.forEach(g=>{const b=g.querySelector('.m-row');b.addEventListener('click',()=>{const open=!g.classList.contains('open');groups.forEach(x=>{x.classList.remove('open');x.querySelector('.m-row').setAttribute('aria-expanded','false')});if(open){g.classList.add('open');b.setAttribute('aria-expanded','true');setTimeout(()=>{const r=g.getBoundingClientRect();if(r.top<90)drawer.scrollBy({top:r.top-90,behavior:'smooth'})},320)}})});
})();
const setMenu=o=>{head.classList.toggle('open',o);menuBtn.setAttribute('aria-expanded',o);menuBtn.querySelector('.mb-label').textContent=o?'Close':'Menu';document.documentElement.classList.toggle('menu-lock',o);if(!o)drawer.querySelectorAll('.m-group.open').forEach(g=>{g.classList.remove('open');g.querySelector('.m-row').setAttribute('aria-expanded','false')})};
menuBtn.addEventListener('click',()=>setMenu(!head.classList.contains('open')));
drawer.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&head.classList.contains('open')){setMenu(false);menuBtn.focus()}});
addEventListener('resize',()=>{if(innerWidth>900&&head.classList.contains('open'))setMenu(false)});
const onScroll=()=>head.classList.toggle('scrolled',scrollY>10);
addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
