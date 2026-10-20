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

function docCard(d){return `<a class="doc" href="${docUrl(d.s)}">
  <div class="ph"><img src="${IMG(d.img)}" alt="Portrait of ${esc(d.n)}" loading="lazy" width="900" height="900"></div>
  <div><h3>${esc(d.n)}</h3><div class="cred">${esc(d.c)}</div></div>
  <p class="disc">${esc(d.d.slice(0,2).join(' · '))}</p>
  <span class="more">View profile ${arrow.replace('<svg','<svg width="14" height="14"')}</span></a>`;}
const locItem=o=>`<li><a href="${locUrl(o.s)}"><strong>${o.n}${o.main?'<span class="main">Main rooms</span>':''}</strong><span>${esc(o.main?o.a:o.v)}</span><span class="pc">${o.pc}<i>&rarr;</i></span></a></li>`;

function netmap(active){
 /* equirectangular projection, longitude scaled by cos(latitude) so distances are true */
 const W=600,H=470,x0=144.93,x1=145.80,y0=-37.90,y1=-38.68,pad=40,k=Math.cos(38.3*Math.PI/180);
 const sx=(W-2*pad)/((x1-x0)*k),sy=(H-2*pad)/(y0-y1),s=Math.min(sx,sy);
 const ox=(W-(x1-x0)*k*s)/2;
 const P=l=>[ox+(l.lon-x0)*k*s,pad+(y0-l.lat)*s];
 const km10=10/111.32*s;
 const SIDE={'safety-beach':'l',wonthaggi:'l'};
 let grid='';for(let gx=pad;gx<=W-pad;gx+=26)for(let gy=pad-10;gy<=H-pad+10;gy+=26)grid+=`<circle cx="${gx}" cy="${gy}" r="1" fill="#DCE5EB"/>`;
 const pts=LOCS.map(P);
 const order=['highett','frankston','mornington','safety-beach','newhaven','wonthaggi','inverloch'].map(s=>pts[LOCS.findIndex(l=>l.s===s)]);
 const route=`<path d="M${order.map(p=>p.join(' ')).join(' L')}" fill="none" stroke="#00A7E9" stroke-width="1.2" stroke-dasharray="3 5" opacity=".7"/>`;
 const marks=LOCS.map((l,i)=>{const [x,y]=pts[i];const on=l.s===active;const right=SIDE[l.s]!=='l';
  return `<a href="${locUrl(l.s)}" aria-label="${l.n} clinic"><g>
   ${on?`<circle cx="${x}" cy="${y}" r="16" fill="#00A7E9" opacity=".16"/>`:''}
   <circle cx="${x}" cy="${y}" r="${on?7:5.5}" fill="${on||l.main?'#000522':'#FFFFFF'}" stroke="#000522" stroke-width="1.5"/>
   <text x="${right?x+14:x-14}" y="${y+4}" text-anchor="${right?'start':'end'}" font-family="Geist, Helvetica, Arial, sans-serif" font-size="${on?15:13.5}" font-weight="${on?500:400}" fill="#000522">${l.n}</text>
   <text x="${right?x+14:x-14}" y="${y+19}" text-anchor="${right?'start':'end'}" font-family="Geist Mono, monospace" font-size="10.5" fill="#5F6873">${l.pc}</text></g></a>`;}).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of the seven Total Cardiovascular Care clinics, from Highett in the north-west to Inverloch in the south-east">${grid}${route}${marks}
  <g font-family="Geist Mono, monospace" font-size="10.5" fill="#5F6873"><path d="M${W-pad-km10} ${H-18}v-6M${W-pad-km10} ${H-21}H${W-pad}M${W-pad} ${H-18}v-6" stroke="#5F6873" fill="none"/><text x="${W-pad-km10-8}" y="${H-17}" text-anchor="end">10 km</text><text x="${pad}" y="${H-17}">North is up</text></g></svg>`;}

/* ---------- Shared: footer care links ---------- */
$('footCare').innerHTML=CARE.map((c,i)=>`<li><a href="${home('care-'+i)}" data-care="${i}">${c.name}</a></li>`).join('');

/* ---------- Home ---------- */
let showCare=()=>{};
if(PAGE==='home'){
 const tabs=$('careTabs'),panel=$('carePanel');
 tabs.innerHTML=CARE.map((c,i)=>`<button role="tab" type="button" id="tab-${c.k}" aria-selected="${i===0}" data-i="${i}">${c.name}</button>`).join('');
 showCare=i=>{const c=CARE[i];
  tabs.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-selected',j===i));
  panel.setAttribute('aria-labelledby','tab-'+c.k);
  panel.innerHTML=`<div class="care-img fade-swap"><img src="${IMG(c.img)}" alt="${esc(c.name)} at Total Cardiovascular Care" width="1800" height="1200"><span class="tag glass">${String(c.items.length).padStart(2,'0')} services</span></div>
   <div class="care-body fade-swap"><h3>${c.name}</h3><p style="color:var(--muted)">${c.blurb}</p>
   <ul>${c.items.map(it=>c.link&&c.link[it]?`<li><a href="${c.link[it]}">${it}<span>Read guide &rarr;</span></a></li>`:`<li>${it}</li>`).join('')}</ul>
   <div class="actions"><a class="btn" href="${APPT}" target="_blank" rel="noopener">Request an appointment</a>${c.link?`<a class="btn btn--ghost" href="${SVC}">About angioplasty &amp; stents</a>`:''}</div></div>`;};
 tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(b)showCare(+b.dataset.i)});
 tabs.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;const bs=[...tabs.querySelectorAll('button')];let i=bs.findIndex(b=>b.getAttribute('aria-selected')==='true');i=(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;showCare(i);bs[i].focus()});
 showCare(0);

 const FILTERS=[['all','All doctors'],['interventional','Interventional & structural'],['imaging','Imaging'],['hf','Heart failure'],['rhythm','Rhythm'],['paeds','Paediatric & fetal'],['physician','Physicians']];
 const fBox=$('docFilters'),rail=$('docRail');
 fBox.innerHTML=FILTERS.map(([k,l],i)=>`<button class="chip" type="button" data-f="${k}" aria-pressed="${i===0}">${l}</button>`).join('');
 const renderRail=f=>{rail.innerHTML=DOCS.filter(d=>f==='all'||groupsOf(d).includes(f)).map(docCard).join('');rail.scrollLeft=0;};
 fBox.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;fBox.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c===b));renderRail(b.dataset.f)});
 document.querySelectorAll('[data-rail]').forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:+b.dataset.rail*(rail.clientWidth*.8),behavior:'smooth'})));
 renderRail('all');

 $('locList').innerHTML=LOCS.map(locItem).join('');
 $('netmapHome').innerHTML=netmap('frankston');

 const st=$('statement');
 st.innerHTML=st.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');
 const words=[...st.querySelectorAll('.w')];
 const reveal=()=>{const r=st.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*0.85-r.top)/(r.height+vh*0.35)));const n=Math.round(p*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n));};
 addEventListener('scroll',()=>requestAnimationFrame(reveal),{passive:true});reveal();

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
   <li><b>Send your request</b><p>Complete the online request form, or call <span class="mono" style="color:var(--ink)">03 9070 6116</span>.</p></li>
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
  <div class="info"><h3>Phone</h3><div class="v mono">03 9070 6116</div><p>${l.main?'Call ahead before visiting. Appointments are required.':'All bookings for this clinic go through our main rooms.'}</p><button class="copy-btn" type="button" data-copy="03 9070 6116">Copy number</button></div>
  <div class="info"><h3>Email</h3><div class="v mono">reception@totalcardiovascular&shy;care.com.au</div><p>For general enquiries. Please call for urgent appointments.</p><button class="copy-btn" type="button" data-copy="reception@totalcardiovascularcare.com.au">Copy email</button></div>
  <div class="info"><h3>Opening hours</h3>${l.main?`<table class="hours"><tbody>${HOURS_FRANKSTON.map((h,i)=>`<tr class="${h[1]==='Closed'?'closed':''} ${i===today?'today':''}"><td>${h[0]}</td><td>${h[1]}</td></tr>`).join('')}</tbody></table><p class="src">Hours may change on public holidays.</p>`:`<div class="v">Session days vary</div><p>Our specialists consult here on set days. Call 03 9070 6116 to find the next available appointment.</p>`}</div>
 </div>
 ${l.main?`<div class="split" style="margin-top:clamp(48px,6vw,80px)"><h2>Referrals</h2><div style="display:grid;gap:16px"><p class="lede">The Frankston main rooms coordinate referrals for every Total Cardiovascular Care clinic. We accept referrals from practitioners locally, across Australia and internationally.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--ink" href="https://totalcardiovascularcare.com.au/contact/" target="_blank" rel="noopener">Referral form</a></div></div></div>`:''}
 <div class="split" style="grid-template-columns:1fr;${l.main?'':'margin-top:clamp(48px,6vw,80px)'}"><h2 style="font-weight:300;font-size:clamp(28px,3vw,40px)">Our clinic network</h2>
  <div class="locs"><figure class="netmap" style="margin:0">${netmap(l.s)}<figcaption><span>${l.n} highlighted</span><span>Tap a clinic to view it</span></figcaption></figure>
  <ul class="loc-list">${others.map(locItem).join('')}</ul></div></div>
 <div class="split" style="grid-template-columns:1fr"><div class="doctor-tools" style="margin:0"><h2 style="font-weight:300;font-size:clamp(28px,3vw,40px)">Specialists across our network</h2><a href="${home('doctors')}">All doctors &rarr;</a></div><div class="rail">${DOCS.slice(0,8).map(docCard).join('')}</div></div>`;
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
