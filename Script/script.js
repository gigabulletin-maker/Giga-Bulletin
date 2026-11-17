
/* mobile scroll-lag fix: flag active scrolling so a few expensive, always-repainting
   animations (see the max-width:768px rules above) can pause for that moment and hand
   the main thread back to the scroll. Purely a performance toggle — no visual change,
   no functionality change. Passive listener, single class swap, cheap on every device. */
(function(){
  let scrollTimer=null;
  window.addEventListener('scroll',function(){
    document.body.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer=setTimeout(function(){document.body.classList.remove('is-scrolling');},150);
  },{passive:true});
})();



/* ====================================================================
   EDIT YOUR CONTENT HERE.
       [ "title", "subtitle", "link", isNew(true/false), rating(1-3) ]
   rating 1 = shows most often, 2 = normal, 3 = least often
   ==================================================================== */
const CONTENT = [
  [
    "রাইনার মারিয়া রিলকের ৭টি চিরন্তন কবিতা",
    "আমার চোখ উপড়ে ফ্যালো—তবু এই ঘন-অন্ধকারেও...",
    "https://www.gigabulletin.in/poetry-of-rainer-maria-rilke",
    false,
    2
  ],

  [
    "সাদাত হাসান মান্টোর অনুবাদ গল্প",
    "সব্যসাচী সেনের অনুবাদে মান্টোর 'খুশিয়া'",
    "https://www.gigabulletin.in/story-of-sadat-hasan-manto",
    true,
    2
  ],

  [
    "ওনো নো কোমাচির অনুবাদ কবিতা",
    "অগ্নিভ ভট্টাচার্য্যর অনুবাদে জাপানের কবি 'ওনো নো কোমাচি'",
    "https://www.gigabulletin.in/poetry-of-ono-no-komachi",
    true,
    1
  ],
  [
    "দেবপ্রসাদ বন্দ্যোপাধ্যাইয়ের কবিতা 'বিপাকে পাঁকের পদ্ম'",
    "'বিপাকে পাঁকের পদ্ম' পুরোটা পথ পদ্ম আর পদ্ম...",
    "https://www.gigabulletin.in/jrm-giga-journal/debaprasad-bandyopadhyay-poetry-jrm",
    false,
    1
  ],


  [
    "আমেরিকান কবি স্টিভেন সেডেনবার্গের কবিতা",
    "যখন সব শহর মরে যায়, হয়ে যায় মলিন...",
    "https://www.gigabulletin.in/poetry-of-steven-seidenberg",
    false,
    1
  ],

  [
    "বিট কবি বব কফম্যানের কবিতা",
    "শুভদীপ সান্যালের অনুবাদে বব কফম্যান",
    "https://www.gigabulletin.in/poetry-of-bob-kaufman",
    true,
    1
  ],

 [
    "ট্যাবুলা রাসা (কমিক্স)",
    "সব্যসাচী রায়ের কমিক্স",
    "https://www.gigabulletin.in/jrm-giga-journal/comics-1-sabyasachi-roy-jrm",
    true,
    1
  ],


  [
    "ভুল মানচিত্র",
    "অগ্নিভ ভট্টাচার্য্যের কবিতা ফিল্ম",
    "https://www.gigabulletin.in/ppn-giga/film5-agnibha-bhatyacharjee-ppn",
    false,
    2
  ],



  [
    "বিনায়ক দত্তের ছবি",
    "বিনায়ক দত্তের ফটোগ্রাফি সিরিজ ❛Anatomy of Love❜",
    "https://www.gigabulletin.in/ppn-giga/binayak-dutta-photography-ppn",
    true,
    1
  ],

  [
    "বুলেটিন প্রথম সংখ্যা",
    "কবিতা, পেইন্টিং ফটোগ্রাফি ডিজিটাল আর্টের বিস্ফোরণ",
    "https://www.gigabulletin.in/giga-bulletin",
    false,
    2
  ],

  [
    "শব্দ নাড়িয়ে নাড়িয়ে কবিতা গ্রাউন্ড",
    "কবিতা গ্রাউন্ডে কবিতা কন্সট্রাক্ট, ডিকন্সট্রাক্ট",
    "https://www.gigabulletin.in/giga-poetry-ground",
    false,
    1
  ],

 
  [
    "ওর্হান ভেলির ৯৫-টি কবিতা",
    "সব্যসাচী রায়ের অনুবাদ ওর্হান ভেলির কাব্য'",
    "https://www.gigabulletin.in/poetry-of-orhan-veli",
    true,
    1
  ],


  [
    "নতুন সংখ্যা 'জড় রঙিন মুক্তি'",
    "গিগা বুলেটিনের ধারাবাহক সংখ্যা",
    "https://www.gigabulletin.in/jrm-giga-journal",
    true,
    1
  ],

  [
    "নাটক: নেক্রপলিস'",
    "অনিরুদ্ধ সাঁপুইয়ের অ্যাবসার্ড নাটক",
    "https://www.gigabulletin.in/jrm-giga-journal/aniruddha-sanpui-drama-jrm",
    true,
    1
  ],



  [
    "হাইপারলিঙ্ক ফটোগ্রাফি সিরিজ",
    "সব্যসাচী রায়ের ফটোগ্রাফি",
    "https://www.gigabulletin.in/jrm-giga-journal/sabyasachi-roy-hyperlink-photography-jrm",
    false,
    3
  ]
];
/* ---------------- LED two-box rotator ---------------- */
(function(){
const LED_COLORS=["#ff3b3b","#39ff88","#3bb4ff","#ffe23b","#ff3bd6"];
const ROTATE_MS=5000, SWIPE_THRESHOLD=55, DRAG_START=8, MAX_HISTORY=20, BOX_COUNT=2;
const RATING_WEIGHTS={1:4,2:2,3:1}, DEFAULT_WEIGHT=2;

const row=document.getElementById("row");
const boxes=Array.from({length:BOX_COUNT},(_,i)=>({
  box:document.getElementById("box"+i),
  title:document.getElementById("title"+i),
  sub:document.getElementById("sub"+i),
  badge:document.getElementById("badge"+i)
}));

let history=[], historyPos=-1, timer=null, queue=[], qIndex=0;

function shuffled(arr){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function buildWeightedPool(){
  const pool=[];
  CONTENT.forEach(entry=>{
    const w=RATING_WEIGHTS[entry[4]]||DEFAULT_WEIGHT;
    for(let i=0;i<w;i++) pool.push(entry);
  });
  return pool;
}
function refillQueue(){queue=shuffled(buildWeightedPool());qIndex=0;}
function nextPair(){
  if(qIndex+BOX_COUNT>queue.length) refillQueue();
  const picked=queue.slice(qIndex,qIndex+BOX_COUNT);
  qIndex+=BOX_COUNT;
  for(let i=0;i<picked.length;i++){
    for(let j=i+1;j<picked.length;j++){
      if(picked[i][0]===picked[j][0]){
        for(let k=qIndex;k<queue.length;k++){
          if(queue[k][0]!==picked[i][0]){const t=picked[j];picked[j]=queue[k];queue[k]=t;break;}
        }
      }
    }
  }
  return picked;
}
function randomColor(){return LED_COLORS[Math.floor(Math.random()*LED_COLORS.length)];}
function buildSet(){
  return nextPair().map(([title,subtitle,link,isNew])=>({title,subtitle,link,isNew:!!isNew,led:randomColor()}));
}
function wordCount(t){return t.trim().split(/\s+/).filter(Boolean).length;}
function applySizeClass(el,count){
  el.classList.remove("wc-5","wc-6","wc-7","wc-8","wc-9","wc-10","wc-11","wc-12");
  if(count>=5&&count<=12) el.classList.add("wc-"+count);
  else if(count>12) el.classList.add("wc-12");
}
function fitOneLine(el,minPx){
  /* Flexible text: keep a readable size and let long text wrap inside the button. */
  el.style.fontSize="";
}
function fitAllCurrent(){boxes.forEach(b=>{fitOneLine(b.title,9);fitOneLine(b.sub,7);});}
function renderSet(set){
  boxes.forEach((b,i)=>{
    b.title.textContent=set[i].title;
    b.sub.textContent=set[i].subtitle;
    applySizeClass(b.title,wordCount(set[i].title));
    applySizeClass(b.sub,wordCount(set[i].subtitle));
    fitOneLine(b.title,9);fitOneLine(b.sub,7);
    b.box.href=set[i].link;
    b.box.target="_blank";
    b.box.style.setProperty("--led",set[i].led);
    b.badge.classList.toggle("show",set[i].isNew);
  });
}
function pushNewSet(){
  history=history.slice(0,historyPos+1);
  history.push(buildSet());
  if(history.length>MAX_HISTORY) history.shift();
  historyPos=history.length-1;
  renderSet(history[historyPos]);
}
function goBack(){
  if(historyPos>0){historyPos--;renderSet(history[historyPos]);return true;}
  const s=buildSet();
  history.unshift(s);
  if(history.length>MAX_HISTORY) history.pop();
  historyPos=0;renderSet(history[historyPos]);
  return true;
}
let rotatorAllowed=true;
function resetTimer(){
  clearInterval(timer);
  if(!rotatorAllowed) return;
  timer=setInterval(pushNewSet,ROTATE_MS);
}
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      rotatorAllowed=e.isIntersecting&&!document.hidden;
      boxes.forEach(b=>b.box.classList.toggle("paused",!rotatorAllowed));
      if(rotatorAllowed) resetTimer(); else clearInterval(timer);
    });
  },{rootMargin:'150px'}).observe(document.getElementById('wrap'));
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) clearInterval(timer);
  });
}
function animateTransition(direction,changed){
  if(!changed){row.style.transition="transform .25s ease";row.style.transform="translateX(0)";return;}
  row.style.transition="transform .22s ease, opacity .22s ease";
  row.style.transform="translateX("+(direction*-70)+"px)";
  row.style.opacity="0.35";
  setTimeout(()=>{
    row.style.transition="none";
    row.style.transform="translateX("+(direction*70)+"px)";
    requestAnimationFrame(()=>{
      row.style.transition="transform .28s ease, opacity .28s ease";
      row.style.transform="translateX(0)";
      row.style.opacity="1";
    });
  },220);
}

pushNewSet();

function snapOpacity(el,v){el.style.transition="none";el.style.opacity=v;}
function flickerText(el){
  snapOpacity(el,.2+Math.random()*.2);
  setTimeout(()=>snapOpacity(el,1),40+Math.random()*70);
}
function startTextFlicker(b){
  (function scheduleNext(){
    const wait=1400+Math.random()*4200;
    setTimeout(()=>{
      if(!rotatorAllowed||document.body.classList.contains('is-scrolling')){scheduleNext();return;}
      const hitTitle=Math.random()<0.7, hitSub=Math.random()<0.5;
      if(hitTitle) flickerText(b.title);
      if(hitSub) flickerText(b.sub);
      if(Math.random()<0.35){
        setTimeout(()=>{
          if(hitTitle) flickerText(b.title);
          if(hitSub) flickerText(b.sub);
        },90+Math.random()*90);
      }
      scheduleNext();
    },wait);
  })();
}
function startColorCycle(b,i){
  function tick(){
    if(!rotatorAllowed){setTimeout(tick,600);return;}
    if(document.body.classList.contains('is-scrolling')){setTimeout(tick,220);return;}
    let next=randomColor();
    while(next===b.box.style.getPropertyValue("--led").trim()) next=randomColor();
    b.box.style.setProperty("--led",next);
    setTimeout(tick,450+Math.random()*650);
  }
  setTimeout(tick,300+i*250);
}
function enhance(){
  boxes.forEach((b,i)=>{
    b.box.classList.add("led","glow-on");
    b.box.style.animationDelay=(i*0.6)+"s";
    startColorCycle(b,i);
    startTextFlicker(b);
  });
}
const fontsReady=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
const minDelay=new Promise(r=>setTimeout(r,400));
Promise.all([fontsReady,minDelay]).then(()=>{fitAllCurrent();enhance();});

let resizeRaf=null;
window.addEventListener("resize",()=>{
  if(resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf=requestAnimationFrame(fitAllCurrent);
});

resetTimer();

let dragging=false,startX=0,dx=0,didDrag=false;
function onDown(clientX){dragging=true;didDrag=false;startX=clientX;dx=0;row.style.transition="none";}
function onMove(clientX){
  if(!dragging) return;
  dx=clientX-startX;
  if(Math.abs(dx)>DRAG_START){
    didDrag=true;
    row.style.transform="translateX("+(dx*0.5)+"px)";
    row.style.opacity=String(1-Math.min(Math.abs(dx)/400,0.4));
    boxes.forEach(b=>b.box.classList.add("dragging"));
  }
}
function onUp(){
  if(!dragging) return;
  dragging=false;
  boxes.forEach(b=>b.box.classList.remove("dragging"));
  if(!didDrag){resetTimer();return;}
  if(dx>SWIPE_THRESHOLD){animateTransition(-1,goBack());}
  else if(dx<-SWIPE_THRESHOLD){pushNewSet();animateTransition(1,true);}
  else{animateTransition(0,false);}
  resetTimer();
}
row.addEventListener("pointerdown",e=>{
  onDown(e.clientX);
  if(e.target.closest("a")) return; // never block a normal link press
});
window.addEventListener("pointermove",e=>onMove(e.clientX));
window.addEventListener("pointerup",onUp);
window.addEventListener("pointercancel",onUp);
row.addEventListener("click",e=>{
  if(didDrag){
    e.preventDefault();
    e.stopPropagation();
    didDrag=false;
  }
},true);
})();

/* ---------------- 3D carousel ---------------- */
(function(){
const carousel=document.getElementById('carousel');
const slides=carousel.querySelectorAll('.slide');
let current=0, autoTimer=null;
let poseWidth=-1,poseCache=null;

function updateCarousel(){
  const vw=window.innerWidth||1200;
  const mobile=vw<=768;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const center=mobile?clamp(140,vw*.44,220):clamp(150,vw*.26,270);
  const near=mobile?clamp(84,vw*.26,140):clamp(96,vw*.17,175);
  const far=mobile?clamp(56,vw*.17,95):clamp(64,vw*.11,115);
  const poses=mobile?{
    center:[center,0,-.04,0,0,1],left1:[near,-.96,.18,-8,16,.75],
    left2:[far,-1.72,-.20,-12,20,.55],right1:[near,.96,.20,7,-16,.75],
    right2:[far,1.72,-.22,11,-20,.55]
  }:{
    center:[center,0,-.04,0,0,1],left1:[near,-.92,.16,-9,24,.85],
    left2:[far,-1.65,-.24,-14,34,.65],right1:[near,.92,.20,8,-24,.85],
    right2:[far,1.65,-.26,13,-34,.65]
  };
  slides.forEach((slide,index)=>{
    const pos=(index-current+slides.length)%slides.length;
    const name=pos===0?'center':pos===1?'right1':pos===2?'right2':pos===slides.length-1?'left1':'left2';
    slide.className='slide '+name;
    const [size,x,y,angle,tilt,scale]=poses[name];
    if(slide.style.width!==center+'px') slide.style.width=center+'px';
    slide.style.transform='translate('+(x*size)+'px,'+(y*size)+'px) rotate('+angle+'deg) rotateY('+tilt+'deg) scale('+(scale*size/center)+')';
  });
}
let carouselResizeFrame=null;
window.addEventListener('resize',()=>{
  if(carouselResizeFrame!==null)return;
  carouselResizeFrame=requestAnimationFrame(()=>{carouselResizeFrame=null;updateCarousel();});
},{passive:true});

updateCarousel();

function tick(){
  current=(current+1)%slides.length;
  updateCarousel();
}
function startAuto(){stopAuto();autoTimer=setInterval(tick,2400);}
function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null;}}

/* Images load from HTML immediately; visibility only controls animation. */
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!document.hidden&&!dragging){startAuto();}
      else stopAuto();
    });
  },{rootMargin:'300px'}).observe(carousel);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) stopAuto();});
}else{
  
  startAuto();
}

let dragging=false,dragMoved=false,startX=0;
const threshold=50;
function dragStart(clientX){dragging=true;dragMoved=false;startX=clientX;stopAuto();carousel.classList.add('dragging');}
function dragEnd(clientX){
  if(!dragging) return;
  dragging=false;
  carousel.classList.remove('dragging');
  const dx=clientX-startX;
  if(Math.abs(dx)>threshold){
    dragMoved=true;
    current=dx<0?(current+1)%slides.length:(current-1+slides.length)%slides.length;
    updateCarousel();
  }
  startAuto();
}
carousel.addEventListener('mousedown',e=>{
  dragStart(e.clientX);
  // Do not prevent the default action here: links must be clickable.
});
window.addEventListener('mouseup',e=>{dragEnd(e.clientX);});
carousel.addEventListener('click',e=>{
  if(dragMoved){
    e.preventDefault();
    e.stopPropagation();
    dragMoved=false;
  }
},true);
carousel.addEventListener('touchstart',e=>dragStart(e.touches[0].clientX),{passive:true});
carousel.addEventListener('touchend',e=>dragEnd(e.changedTouches[0].clientX));
carousel.addEventListener('touchcancel',()=>{dragging=false;carousel.classList.remove('dragging');startAuto();});
let wheelCooldown=false;
carousel.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>10){
    e.preventDefault();
    if(wheelCooldown) return;
    wheelCooldown=true;stopAuto();
    current=e.deltaX>0?(current+1)%slides.length:(current-1+slides.length)%slides.length;
    updateCarousel();
    setTimeout(()=>{wheelCooldown=false;startAuto();},600);
  }
},{passive:false});
})();

/* ---------------- clock-glass dial: 10-at-a-time poet ring, ticks like a clock every 2s ---------------- */
(function(){
const POETS=[
  ["জাঁ আর্তুর র‍্যাঁবো","1fw_xJT307O2N4k1uF8X6RuIqMRf2n5JB","https://www.gigabulletin.in/poetry-of-arthur-rimbaud"],
  ["পল সেলিন","1Un79mMLf3IWSzgtlxk7eKbpmeqFmKakA","https://www.gigabulletin.in/poetry-of-paul-celan"],
  ["রাইনার মারিয়া রিলকে","1TLH3dRGP3vo3jrUy472PDdx1xFhh9W-l","https://www.gigabulletin.in/poetry-of-rainer-maria-rilke"],
  ["হারবার্তো প্যাদিয়া","1SZB4GFdDlhMkCs1mRXK_aVeYp3aAPPAD","https://www.gigabulletin.in/poetry-of-heberto-padilla"],
  ["লিওনার্ড কোহেন","1yYwpTFyenXk--t2MPorC2meh6vluRCE3","https://www.gigabulletin.in/poetry-of-leonard-cohen"],
  ["হানশান","1Mg4lpmlQF9q4whnbhMLA8a1Y_lH7UqUz","https://www.gigabulletin.in/poetry-of-hanshan"],
  ["গগন গিল","1O-wPC9dk4IPTpk1DoBFEBLPm7FlLzCXa","https://www.gigabulletin.in/poetry-of-gagan-gill"],
  ["চার্লস বুকাওস্কি","1DzT5kdubsDAtPbPsa_WcEcDKtD-m0XAT","https://www.gigabulletin.in/poetry-of-charles-bukowski"],
  ["সাদাত হাসান মান্টো","1P2fqBrLCXhebteDC3n9exD_7yWZvND84","https://www.gigabulletin.in/story-of-sadat-hasan-manto"],
  ["ভ্লাদিমির মায়াকোভস্কি","1H29Y21C0WEmkhWpFqO50GoA8CgPlhrt7","https://www.gigabulletin.in/poetry-of-vladimir-mayakovsky"],
  ["স্টিভেন সেডেনবার্গ","1OKPSD868et0y00Ag7LGucrspyJku5i23","https://www.gigabulletin.in/poetry-of-steven-seidenberg"],
  ["চাক পালানিউক","1kgALs7cD6B6fv0Rkz6jxOgq-w_cI-eGt","https://www.gigabulletin.in/story-of-chuck-palahniuk"],
  ["ফ্রেডরিখ নীৎসে","1zIyd7AlVQYWZfSxPAcNpPsS0fX4Lcp9D","https://www.gigabulletin.in/poetry-of-friedrich-nietzsche"],
  ["ওকতায় রিফাত","102Y1e7TMH09eggyMauMkCdHeIYr6zRb3","https://www.gigabulletin.in/poetry-of-oktay-rifat"],
  ["ওর্হান ভেলি","1HuZFrffLEEO6fmhOqkiuc3_30hUPbrzy","https://www.gigabulletin.in/poetry-of-orhan-veli"],
  ["ওনো নো কোমাচি","1OeyVE7NganqvEZCYJ56wsKhdMuznr19D","https://www.gigabulletin.in/poetry-of-ono-no-komachi"],
  ["রবার্ট দেসনস","1uAYp-gFYkkh1-_edm8aS9YDTb5lC7W3z","https://www.gigabulletin.in/poetry-of-robert-desnos"],
  ["মেলিহ জেভদেত আন্দায়","1ApxtNmk1zN2T9euZcHWBktZ1boy_PBmU","https://www.gigabulletin.in/poetry-of-melih-cevdet-anday"],
  ["ওয়েন্দে গেরে","1ge3Fvb-w_cKv7sdWQQiN1S08izPfmhZg","https://www.gigabulletin.in/poetry-of-wendy-guerra"],
  ["বব কফম্যান","1PQgbyMm3U36qgTkr0RJbnFCzLAgwQicf","https://www.gigabulletin.in/poetry-of-bob-kaufman"],
["শিমোন আদাফ","1I0sUI8zkOfBkrOFIxCT72_U6pph-9dXt","https://www.gigabulletin.in/poetry-of-shimon-adaf"],
["লরেন্স ফের্লিনহেটি","11ehfnB5AfnHjjwE8wDMMtKqFdhE-5unM","https://www.gigabulletin.in/poetry-of-lawrence-ferlinghetti"]
];
const SLOTS=10;                 /* only 10 images live in the DOM at once — keeps load light */
const STEP=360/SLOTS;           /* 36deg per clock tick */
const TICK_MS=(window.innerWidth||1200)<=768?2600:2000; /* same clock behavior, lighter on phones */

const dial=document.getElementById('clockDial');
const ring=document.getElementById('dialRing');
const ticksBox=document.getElementById('dialTicks');
const poetText=document.getElementById('dialPoetText');
if(!dial||!ring) return;

/* draw 10 tick marks like a watch face */
const ticksFrag=document.createDocumentFragment();
for(let i=0;i<SLOTS;i++){
  const t=document.createElement('i');
  t.style.transform='rotate('+(i*STEP)+'deg)';
  ticksFrag.appendChild(t);
}
ticksBox.appendChild(ticksFrag);

/* build exactly 10 slot elements once — reused forever, only their img/href/text get swapped */
const items=[];
const ringFrag=document.createDocumentFragment();
for(let i=0;i<SLOTS;i++){
  const a=document.createElement('a');
  a.className='dial-item';
  a.draggable=false;
  a.style.setProperty('--i',i);
  a.target='_blank';
  a.rel='noopener';
  const inner=document.createElement('span');
  inner.className='dial-item-inner';
  const img=document.createElement('img');
  img.loading='eager';
  img.draggable=false;
  img.decoding='async';
  inner.appendChild(img);
  a.appendChild(inner);
  ringFrag.appendChild(a);
  items.push({a,img});
}
ring.appendChild(ringFrag);

function shuffled(arr){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

/* two halves of the full 20-poet list; showing both halves in turn means every poet
   eventually gets its moment as the big focused image in the red circle */
let shuffledFull=shuffled(POETS);
let half=0;
let currentBatch=shuffledFull.slice(0,SLOTS);
let batchLoaded=false;

function loadBatch(batch){
  const vw=window.innerWidth||1200;
  const width=vw<=600?180:(vw<=1000?240:300);
  items.forEach((it,i)=>{
    const p=batch[i];
    it.a.href=p[2];
    it.img.alt=p[0];
    it.img.src='https://lh3.googleusercontent.com/d/'+p[1]+'=w'+width;
  });
}
/* Load the initial portraits at page startup. */
function ensureLoaded(){
  if(batchLoaded) return;
  batchLoaded=true;
  loadBatch(currentBatch);
}

// Request every portrait at page startup, including later batches.
const portraitPreloads=POETS.map(p=>{
  const img=new Image();
  const vw=window.innerWidth||1200;
  img.src='https://lh3.googleusercontent.com/d/'+p[1]+'=w'+(vw<=600?180:(vw<=1000?240:300));
  return img;
});
ensureLoaded();
let rotDeg=0;          /* current live rotation of the ring, in degrees */
let stepCount=0;       /* nearest notch, as an integer — can go + or - while dragging */
let lastRev=0;          /* which "revolution" (batch of 10) we're on, for swap detection */
let dialInView=false,poetSet=false,dragging=false;

function render(){
  ring.style.transform='rotate('+rotDeg+'deg)';
  ring.style.setProperty('--counter-rot',(-rotDeg)+'deg'); /* keeps every image upright, never tilted */
  const focusIndex=(((Math.round(-rotDeg/STEP))%SLOTS)+SLOTS)%SLOTS;
  items.forEach((it,i)=>it.a.classList.toggle('focused',i===focusIndex));
  const name=currentBatch[focusIndex][0];
  if(!poetSet||poetText.textContent!==name){
    poetSet=true;
    poetText.style.opacity='.15';
    poetText.textContent=name;
    requestAnimationFrame(()=>{poetText.style.opacity='1';});
  }
}
function maybeSwapBatch(){
  const rev=Math.floor(stepCount/SLOTS);
  if(rev!==lastRev){
    lastRev=rev;
    half=(half+1)%Math.ceil(POETS.length/SLOTS);
    if(half===0) shuffledFull=shuffled(POETS);
    currentBatch=Array.from({length:SLOTS},(_,i)=>shuffledFull[(half*SLOTS+i)%shuffledFull.length]);
    loadBatch(currentBatch);
  }
}
function snapTo(step){
  stepCount=step;
  rotDeg=-STEP*step;
  maybeSwapBatch();
  render();
}

let autoTimer=null;
function autoTick(){
  if(dragging||!dialInView||document.hidden) return;
  snapTo(stepCount+1);
}
function startAuto(){clearInterval(autoTimer);autoTimer=setInterval(autoTick,TICK_MS);}

if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      dialInView=e.isIntersecting;
      if(dialInView){
        ensureLoaded();
        if(!poetSet) render();
        startAuto();
      }else{
        clearInterval(autoTimer);
      }
    });
  },{rootMargin:'300px'}).observe(dial);
}else{
  dialInView=true;
  ensureLoaded();
  render();
  startAuto();
}

/* Pointer capture keeps dial rotation smooth when the pointer leaves the circle. */
let dragMoved=false,lastAngle=0,velocity=0,totalDrag=0,activePointer=null;
let dialCenter=null,dialDragFrame=null;
function angleFromCenter(x,y){return Math.atan2(y-dialCenter.y,x-dialCenter.x)*180/Math.PI;}
function paintDialDrag(){
  dialDragFrame=null;
  ring.style.transform='rotate('+rotDeg+'deg)';
  ring.style.setProperty('--counter-rot',(-rotDeg)+'deg');
}
dial.addEventListener('dragstart',e=>e.preventDefault());
dial.addEventListener('selectstart',e=>e.preventDefault());
dial.addEventListener('pointerdown',e=>{
  if(!e.isPrimary||e.button!==0) return;
  const r=dial.getBoundingClientRect();
  dialCenter={x:r.left+r.width/2,y:r.top+r.height/2};
  ensureLoaded();dragging=true;dragMoved=false;velocity=0;totalDrag=0;activePointer=e.pointerId;
  lastAngle=angleFromCenter(e.clientX,e.clientY);
  dial.classList.add('dragging');ring.classList.add('dragging');clearInterval(autoTimer);
});
dial.addEventListener('pointermove',e=>{
  if(!dragging||e.pointerId!==activePointer) return;
  const angle=angleFromCenter(e.clientX,e.clientY);
  const delta=((angle-lastAngle+540)%360)-180;
  lastAngle=angle;velocity=delta;totalDrag+=Math.abs(delta);rotDeg+=delta;
  if(totalDrag>2&&!dragMoved){dragMoved=true;dial.setPointerCapture(e.pointerId);}
  if(dialDragFrame===null) dialDragFrame=requestAnimationFrame(paintDialDrag);
});
function finishDialPointer(e){
  if(!dragging||e.pointerId!==activePointer) return;
  if(dialDragFrame!==null){cancelAnimationFrame(dialDragFrame);paintDialDrag();}
  dragging=false;activePointer=null;
  dial.classList.remove('dragging');ring.classList.remove('dragging');
  if(dial.hasPointerCapture(e.pointerId)) dial.releasePointerCapture(e.pointerId);
  if(e.type!=='pointercancel'&&Math.abs(velocity)>6) rotDeg+=(velocity>0?STEP:-STEP);
  snapTo(Math.round(-rotDeg/STEP));
  if(dialInView&&!document.hidden) startAuto();
}
window.addEventListener('pointerup',finishDialPointer);
dial.addEventListener('pointercancel',finishDialPointer);
dial.addEventListener('lostpointercapture',finishDialPointer);
dial.addEventListener('click',e=>{
  if(dragMoved){e.preventDefault();e.stopPropagation();dragMoved=false;}
},true);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden) clearInterval(autoTimer);
  else if(dialInView&&!dragging) startAuto();
});

})();

/* ---------------- button ticker ---------------- */
(function(){
const wrapper=document.getElementById('tickerWrapper');
const ticker=document.getElementById('ticker');
const isSmallScreen=window.matchMedia('(max-width:768px),(pointer:coarse)').matches;
let autoSpeed=isSmallScreen?1.2:0.6,pos=0,dragging=false,startX=0,startPos=0,halfWidth=0,dragMoved=false,frameSkip=0;

let lastMeasureWidth=0;
function measure(){
  const w=window.innerWidth||0;
  if(w===lastMeasureWidth&&halfWidth) return;
  lastMeasureWidth=w;
  halfWidth=ticker.scrollWidth/2;
}
measure();
window.addEventListener('resize',measure,{passive:true});
window.addEventListener('load',measure,{once:true});

function wrapPos(){
  if(halfWidth<=0) return;
  if(pos<=-halfWidth) pos+=halfWidth;
  if(pos>0) pos-=halfWidth;
}
let tickerPaint=null;
function render(){if(tickerPaint!==null)return;tickerPaint=requestAnimationFrame(()=>{tickerPaint=null;ticker.style.transform='translateX('+pos+'px)';});}
let tickerInView=true,rafId=null;
function stopTickerFrame(){if(rafId!==null)cancelAnimationFrame(rafId);rafId=null;lastTickerTime=null;}
let lastTickerTime=null;
function frame(time){
  const elapsed=lastTickerTime===null?0:Math.min(40,time-lastTickerTime);
  lastTickerTime=time;
  const scrolling=document.body.classList.contains('is-scrolling');
  if(!dragging&&tickerInView&&!document.hidden&&!scrolling){
    // Same distance per second, rendered every frame instead of every other frame.
    pos-=autoSpeed*(isSmallScreen?30:60)*(elapsed/1000);
    wrapPos();render();
  }
  if(tickerInView&&!document.hidden)rafId=requestAnimationFrame(frame);
  else{rafId=null;lastTickerTime=null;}
}
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      tickerInView=e.isIntersecting;
      if(!tickerInView){stopTickerFrame();}
      else if(!document.hidden&&rafId===null) rafId=requestAnimationFrame(frame);
    });
  },{rootMargin:'150px'}).observe(wrapper);
}else{
  rafId=requestAnimationFrame(frame);
}

document.addEventListener('visibilitychange',()=>{if(document.hidden){if(rafId!==null)cancelAnimationFrame(rafId);rafId=null;lastTickerTime=null;}else if(tickerInView&&rafId===null)rafId=requestAnimationFrame(frame);});
function dragStart(clientX){dragging=true;dragMoved=false;startX=clientX;startPos=pos;wrapper.classList.add('dragging');}
function dragMove(clientX){
  if(!dragging) return;
  const dx=clientX-startX;
  if(Math.abs(dx)>3) dragMoved=true;
  pos=startPos+dx;wrapPos();render();
}
function dragEnd(){dragging=false;wrapper.classList.remove('dragging');}

wrapper.addEventListener('mousedown',e=>{
  dragStart(e.clientX);
  // Do not prevent default: clicking a ticker link must navigate normally.
});
window.addEventListener('mousemove',e=>{if(dragging) dragMove(e.clientX);});
window.addEventListener('mouseup',dragEnd);
wrapper.addEventListener('click',e=>{
  if(dragMoved){
    e.preventDefault();
    e.stopPropagation();
    dragMoved=false;
  }
},true);
wrapper.addEventListener('touchstart',e=>dragStart(e.touches[0].clientX),{passive:true});
wrapper.addEventListener('touchmove',e=>dragMove(e.touches[0].clientX),{passive:true});
wrapper.addEventListener('touchend',dragEnd);
wrapper.addEventListener('touchcancel',dragEnd);
wrapper.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){pos-=e.deltaX;wrapPos();render();e.preventDefault();}
},{passive:false});
})();

/* ---------------- alternating absurd lines beside the CTA buttons ---------------- */
(function(){
const QUIPS=[
  "গিগা, শব্দ দেখলেই চিৎকার করছে",
  "গিগা-জুল গিগা-হার্জ গিগা-বাইট গিগা-টন গিগা-বিক্ষুব্ধ দাঁত",
  "শিল্প বলে আর কিছু নেই, শুধুই গিগা প্রজন্মের ঢেঁকুড়",
  "রঙ চূর্ণিত আয়নার মুখ— এক একাকী ধ্বস্ত চিন্তক",
  "জন্ম হলো প্রথম অপরাধ, তাই শূন্যতাগুলো দানবীয়"
];
const quipIdx={q1:0,q2:2};
function nextQuipIndex(which){
  const other=which==='q1'?'q2':'q1';
  let n=(quipIdx[which]+1)%QUIPS.length;
  if(n===quipIdx[other]) n=(n+1)%QUIPS.length;
  quipIdx[which]=n;
  return n;
}
function cycle(el,key,intervalMs){
  if(!el) return;
  el.textContent=QUIPS[quipIdx[key]];
  let timer=null,visible=false;
  const step=()=>{
    if(!visible||document.hidden||document.body.classList.contains('is-scrolling')) return;
    el.style.opacity='0';
    el.style.filter='blur(5px)';
    setTimeout(()=>{
      if(!visible||document.hidden){el.style.opacity='1';return;}
      el.textContent=QUIPS[nextQuipIndex(key)];
      el.style.opacity='1';
      el.style.filter='blur(0)';
    },480);
  };
  const start=()=>{
    if(timer||!visible) return;
    timer=setInterval(step,intervalMs);
  };
  const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if(visible&&!document.hidden) start(); else stop();
    },{rootMargin:'120px'}).observe(el);
  }else{visible=true;start();}
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) stop(); else if(visible) start();
  });
}
cycle(document.getElementById('quip1'),'q1',5200);
cycle(document.getElementById('quip2'),'q2',6200);
})();



(function(){
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('perf-offscreen',!e.isIntersecting);},{rootMargin:'80px'});
    document.querySelectorAll('header.hero,section,footer').forEach(el=>io.observe(el));
  }
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('perf-background',document.hidden));
})();



/* Feature strip: progressive image + one-line fit */
(function(){
  const GURL=(id,w)=>'https://lh3.googleusercontent.com/d/'+id+'=w'+w;
  const img=document.getElementById('fbImg');
  const sub=document.getElementById('fbSub');
  const box=document.getElementById('fb');
  if(!img||!sub||!box) return;

  function show(w,cls){
    img.src=GURL('1bPSmf0TiYP-1YenNKC3_aZZErfz75K5y',w);
    img.classList.remove('fb-pl-1','fb-pl-2','fb-pl-3');
    img.classList.add(cls);
  }
  function load(w){
    return new Promise(res=>{
      const im=new Image();
      im.decoding='async';
      im.onload=()=>{(im.decode?im.decode():Promise.resolve()).catch(()=>{}).then(()=>res(true));};
      im.onerror=()=>res(false);
      im.src=GURL('1bPSmf0TiYP-1YenNKC3_aZZErfz75K5y',w);
    });
  }
  function run(){
    [[300,'fb-pl-2'],[1000,'fb-pl-3']].reduce((p,s)=>p.then(()=>load(s[0]).then(ok=>{if(ok)show(s[0],s[1]);})),Promise.resolve());
  }
  img.classList.add('fb-pl');
  show(20,'fb-pl-1');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting){io.unobserve(img);run();}});
    },{rootMargin:'400px 0px'});
    io.observe(img);
    new IntersectionObserver(e=>box.classList.toggle('off',!e[0].isIntersecting)).observe(box);
  }else run();

  const txt=document.getElementById('fbTxt');
  function fit(){
    sub.style.fontSize='18px';
    for(let n=0;n<3;n++){
      const cw=sub.clientWidth,tw=txt.getBoundingClientRect().width;
      if(!cw||!tw) break;
      const cur=parseFloat(getComputedStyle(sub).fontSize);
      const next=Math.max(8,Math.min(cur,cur*cw/tw*.98));
      sub.style.fontSize=next.toFixed(2)+'px';
    }
  }
  addEventListener('resize',fit);
  addEventListener('load',fit);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();
