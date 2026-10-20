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

/* ---------- Shared: footer care links ---------- */
$('footCare').innerHTML=CARE.map((c,i)=>`<li><a href="${home('care-'+i)}" data-care="${i}">${c.name}</a></li>`).join('');

/* ---------- Home ---------- */
let showCare=()=>{};
if(PAGE==='home'){
 /* Areas of care: infinite carousel (slides rendered 3x, index kept in middle copy), synced tabs */
 const tabs=$('careTabs'),cView=$('careView'),cTrack=$('careTrack'),cPause=$('carePause'),N=CARE.length;
 const C_DWELL=6000,cReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let ci=N,cTimer=null,cUserPaused=cReduce,cHold=false,cBusy=false;
 tabs.innerHTML=CARE.map((c,i)=>`<button role="tab" type="button" id="tab-${c.k}" aria-selected="${i===0}" aria-controls="careView" data-i="${i}"><span>${c.name}</span><i aria-hidden="true"></i></button>`).join('');
 tabs.style.setProperty('--dur',C_DWELL+'ms');
 const slide=(c,clone)=>`<article class="care-slide"${clone?' aria-hidden="true" inert':''}>
   <div class="care-img"><img src="${IMG(c.img)}" alt="${clone?'':esc(c.name)+' at Total Cardiovascular Care'}" width="1800" height="1200" loading="lazy"><span class="tag glass">${String(c.items.length).padStart(2,'0')} services</span></div>
   <div class="care-body"><h3>${c.name}</h3><p style="color:var(--muted)">${c.blurb}</p>
   <ul>${c.items.map(it=>c.link&&c.link[it]?`<li><a href="${c.link[it]}">${it}<span>Read guide &rarr;</span></a></li>`:`<li>${it}</li>`).join('')}</ul>
   <div class="actions"><a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a>${c.link?`<a class="btn btn--ghost" href="${SVC}">About angioplasty &amp; stents</a>`:''}</div></div></article>`;
 cTrack.innerHTML=CARE.map(c=>slide(c,1)).join('')+CARE.map(c=>slide(c,0)).join('')+CARE.map(c=>slide(c,1)).join('');
 const cSlides=[...cTrack.children];
 const sizeSlides=()=>{const wr=cView.parentElement,cs=getComputedStyle(wr);cView.style.setProperty('--slideW',(wr.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight))+'px')};
 const cStep=()=>cSlides[1].offsetLeft-cSlides[0].offsetLeft;
 const cPlace=anim=>{cTrack.classList.toggle('no-anim',!anim);cTrack.style.transform=`translate3d(${-ci*cStep()}px,0,0)`;cSlides.forEach((el,j)=>el.classList.toggle('is-current',j===ci));if(!anim)void cTrack.offsetWidth;};
 const syncTabs=()=>{const k=((ci%N)+N)%N;const bs=tabs.querySelectorAll('button');bs.forEach((b,j)=>{b.setAttribute('aria-selected',j===k);b.classList.remove('run')});void tabs.offsetWidth;if(!cUserPaused&&!cHold)bs[k].classList.add('run');};
 function cGo(target,anim=true){if(cBusy&&anim)return;cBusy=anim;ci=target;cPlace(anim);syncTabs();cSchedule();}
 cTrack.addEventListener('transitionend',e=>{if(e.target!==cTrack)return;cBusy=false;if(ci>=2*N){ci-=N;cPlace(false)}else if(ci<N){ci+=N;cPlace(false)}});
 function cSchedule(){clearTimeout(cTimer);if(!cUserPaused&&!cHold&&!document.hidden)cTimer=setTimeout(()=>cGo(ci+1),C_DWELL);}
 const cSetHold=h=>{cHold=h;syncTabs();cSchedule()};
 function cSetPaused(p){cUserPaused=p;cPause.setAttribute('aria-pressed',p);cPause.setAttribute('aria-label',p?'Play services carousel':'Pause services carousel');syncTabs();cSchedule();}
 showCare=i=>{const cur=((ci%N)+N)%N;const t=ci+(i-cur);cGo(t,t!==ci);};
 tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(b)showCare(+b.dataset.i)});
 tabs.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;const bs=[...tabs.querySelectorAll('button')];let i=bs.findIndex(b=>b.getAttribute('aria-selected')==='true');i=(i+(e.key==='ArrowRight'?1:-1)+N)%N;showCare(i);bs[i].focus()});
 document.querySelectorAll('[data-care-step]').forEach(b=>b.addEventListener('click',()=>cGo(ci+ +b.dataset.careStep)));
 cPause.addEventListener('click',()=>cSetPaused(!cUserPaused));
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
 sizeSlides();cPlace(false);cSetPaused(cUserPaused);

 const FILTERS=[['all','All doctors'],['interventional','Interventional & structural'],['imaging','Imaging'],['hf','Heart failure'],['rhythm','Rhythm'],['paeds','Paediatric & fetal'],['physician','Physicians']];
 const fBox=$('docFilters'),rail=$('docRail');
 fBox.innerHTML=FILTERS.map(([k,l],i)=>`<button class="chip" type="button" data-f="${k}" aria-pressed="${i===0}">${l}</button>`).join('');
 /* Doctor carousel: infinite loop (list rendered 3x, index kept in the middle copy),
    dwell then glide one card; pauses on hover/focus, pause button, swipe, reduced motion = paused */
 const view=$('docViewport'),pauseBtn=$('docPause'),ctrlBtns=[...document.querySelectorAll('[data-rail]')];
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
  ctrlBtns.forEach(b=>b.disabled=!loop);pauseBtn.disabled=!loop;
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
 function setPaused(p){userPaused=p;pauseBtn.setAttribute('aria-pressed',p);pauseBtn.setAttribute('aria-label',p?'Play doctor carousel':'Pause doctor carousel');schedule();}
 pauseBtn.addEventListener('click',()=>setPaused(!userPaused));
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
 const peers=DOCS.filter(x=>x.s!==d.s&&groupsOf(x).some(g=>groupsOf(d).includes(g))).slice(0,6);
 $('doctorRoot').innerHTML=`
 <nav class="crumbs" aria-label="Breadcrumb"><a href="${ROOT}index.html">Home</a>/<a href="${home('doctors')}">Doctors</a>/<span aria-current="page">${esc(d.n)}</span></nav>
 <div class="dr-hero">
  <div>
   <span class="eyebrow">${esc(d.t)}</span>
   <h1>${esc(d.n)}</h1>
   <div class="cred">${creds.map(c=>{const k=c.replace(/[()]/g,'');return GLOSS[k]?`<abbr title="${esc(GLOSS[k])}">${esc(c)}</abbr>`:`<span style="padding:4px 2px">${esc(c)}</span>`}).join('')}</div>
   <p class="lede bio">${esc(d.b)}</p>
   <div class="actions"><a class="btn" href="${APPT}" target="_blank" rel="noopener">Book an appointment ${arrow}</a><a class="btn btn--ghost" href="#d-referral">Referral details</a></div>
  </div>
  <figure class="dr-portrait" style="margin:0"><img src="${IMG(d.img)}" alt="Portrait of ${esc(d.n)}" width="900" height="900">
   <figcaption class="badge glass"><b style="font-weight:500">${esc(d.n)}</b><span>Total Cardiovascular Care</span></figcaption></figure>
 </div>
 <div class="split"><h2>Disciplines</h2>
  <ul class="disc-list">${d.d.map(x=>`<li><b>${esc(x)}</b></li>`).join('')}</ul></div>
 ${care.length?`<div class="split"><h2>Areas of care</h2>
  <div style="display:grid;gap:26px">${care.map(c=>`<div style="display:grid;gap:12px"><span class="eyebrow">${c.name}</span><div class="svc-cloud">${c.items.map(it=>c.link&&c.link[it]?`<a href="${c.link[it]}">${it}</a>`:`<span>${it}</span>`).join('')}</div></div>`).join('')}</div></div>`:''}
 <div class="split"><h2>Qualifications</h2><dl class="gloss">${gl.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
 <div class="split" id="d-referral"><h2>Booking an appointment</h2>
  <ol class="steps">
   <li><b>Get a referral</b><p>Ask your GP or specialist for a referral addressed to ${esc(d.n)}.</p></li>
   <li><b>Send your request</b><p>Complete the online request form, or call <a class="tel" href="tel:0390706116">03 9070 6116</a>.</p></li>
   <li><b>We'll be in touch</b><p>Our team will contact you within 24 hours to arrange a time and clinic.</p></li>
  </ol></div>
 ${peers.length?`<div class="split" style="grid-template-columns:1fr"><div class="doctor-tools" style="margin:0"><h2 style="font-weight:300;font-size:clamp(28px,3vw,40px)">Related specialists</h2><a href="${home('doctors')}">All doctors &rarr;</a></div><div class="rail">${peers.map(docCard).join('')}</div></div>`:''}`;
}

/* ---------- Service ---------- */
if(PAGE==='service'){
 $('svcRail').innerHTML=DOCS.filter(d=>/interventional/i.test(d.d.join(' '))&&!/heart failure/i.test(d.d.join(' '))).map(docCard).join('');
 const tocLinks=[...document.querySelectorAll('#toc a')];
 const spy=()=>{let on=tocLinks[0];tocLinks.forEach(a=>{const s=$(a.getAttribute('href').slice(1));if(s&&s.getBoundingClientRect().top<160)on=a});tocLinks.forEach(a=>a.classList.toggle('on',a===on));};
 addEventListener('scroll',()=>requestAnimationFrame(spy),{passive:true});spy();
}

/* ---------- Location ---------- */
if(PAGE==='location'){
 const l=LOCS.find(x=>x.s===SLUG)||LOCS[0];
 const today=(new Date().getDay()+6)%7;
 const now=new Date(),mins=now.getHours()*60+now.getMinutes();
 const isOpen=l.main&&today<5&&mins>=540&&mins<1020;
 const others=LOCS.filter(x=>x.s!==l.s);
 $('locationRoot').innerHTML=`
 <nav class="crumbs" aria-label="Breadcrumb"><a href="${ROOT}index.html">Home</a>/<a href="${home('locations')}">Locations</a>/<span aria-current="page">${l.n}</span></nav>
 <div class="lc-hero">
  <div style="display:flex;flex-direction:column;justify-content:flex-end">
   <span class="eyebrow">${l.main?'Main rooms · Cardiology clinic':'Cardiology clinic'}</span>
   <h1>${l.n}</h1>
   <p class="venue">${esc(l.v)}</p>
   <p class="addr">${esc(l.a)}, ${esc(l.sub)}</p>
   <div class="actions"><a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a><a class="btn btn--ghost" href="${maps(l)}" target="_blank" rel="noopener">Get directions ${arrow}</a></div>
  </div>
  <figure class="lc-photo" style="margin:0"><img src="${IMG(l.img)}" alt="Street view of the ${esc(l.n)} clinic at ${esc(l.a)}" width="1200" height="1200">
   ${l.main?`<span class="status glass ${isOpen?'open':''}"><i></i>${isOpen?'Open now · until 5:00 pm':'Closed now · opens 9:00 am weekdays'}</span>`:''}</figure>
 </div>
 <div class="info-grid">
  <div class="info"><h3>Phone</h3><div class="v">03 9070 6116</div><p>${l.main?'Call ahead before visiting. Appointments are required.':'All bookings for this clinic go through our main rooms.'}</p><button class="copy-btn" type="button" data-copy="03 9070 6116">Copy number</button></div>
  <div class="info"><h3>Email</h3><div class="v">reception@totalcardiovascular&shy;care.com.au</div><p>For general enquiries. Please call for urgent appointments.</p><button class="copy-btn" type="button" data-copy="reception@totalcardiovascularcare.com.au">Copy email</button></div>
  <div class="info"><h3>Opening hours</h3>${l.main?`<table class="hours"><tbody>${HOURS_FRANKSTON.map((h,i)=>`<tr class="${h[1]==='Closed'?'closed':''} ${i===today?'today':''}"><td>${h[0]}</td><td>${h[1]}</td></tr>`).join('')}</tbody></table><p class="src">Hours may change on public holidays.</p>`:`<div class="v">Session days vary</div><p>Our specialists consult here on set days. Call 03 9070 6116 to find the next available appointment.</p>`}</div>
 </div>
 ${l.main?`<div class="split" style="margin-top:clamp(48px,6vw,80px)"><h2>Referrals</h2><div style="display:grid;gap:16px"><p class="lede">The Frankston main rooms coordinate referrals for every Total Cardiovascular Care clinic. We accept referrals from practitioners locally, across Australia and internationally.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--ink" href="https://totalcardiovascularcare.com.au/contact/" target="_blank" rel="noopener">Referral form</a></div></div></div>`:''}
 <div class="split" style="grid-template-columns:1fr;${l.main?'':'margin-top:clamp(48px,6vw,80px)'}"><h2 style="font-weight:300;font-size:clamp(28px,3vw,40px)">Our clinic network</h2>
  <div class="locs"><figure class="netmap" style="margin:0">${netmap(l.s)}<figcaption><span>${l.n} highlighted</span><span>Select a pin to view a clinic</span></figcaption></figure>
  <ul class="loc-list">${others.map(locItem).join('')}</ul></div></div>
 <div class="split" style="grid-template-columns:1fr"><div class="doctor-tools" style="margin:0"><h2 style="font-weight:300;font-size:clamp(28px,3vw,40px)">Specialists across our network</h2><a href="${home('doctors')}">All doctors &rarr;</a></div><div class="rail">${DOCS.slice(0,8).map(docCard).join('')}</div></div>`;
 linkMap($('locationRoot'));
}

/* ---------- Shared behaviour ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;const t=b.dataset.copy,o=b.textContent;
 const sel=()=>{const v=b.parentElement.querySelector('.v');const r=document.createRange();r.selectNodeContents(v);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press Ctrl+C';};
 try{navigator.clipboard.writeText(t).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent=o,1600)},sel)}catch(_){sel()}});
const head=document.querySelector('.site-head'),menuBtn=$('menuBtn');
menuBtn.addEventListener('click',()=>{const o=head.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o)});
head.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{head.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));
const onScroll=()=>head.classList.toggle('scrolled',scrollY>10);
addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
