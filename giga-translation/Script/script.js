
const BANNER_ID="11oiSAP55lB_35yeI3hTD2JL1q8QiSO4M";
/* ============================================================
   এখানে নতুন কবি/লেখক যোগ করুন — একদম সহজ পদ্ধতি।
   প্রতিটি লাইনে ৫টি জিনিস, "|" চিহ্ন দিয়ে আলাদা করা থাকবে, এই ক্রমে:

   driveId | link | কবির নাম | অনুবাদকের নাম | ভূমিকা(ঐচ্ছিক)

   # দিয়ে শুরু করা লাইন বা ফাঁকা লাইন বাদ যাবে (নোটের জন্য ব্যবহার করুন)।
   নতুন এন্ট্রি যোগ করতে শুধু নিচে একটা নতুন লাইন বসান, JS নিয়ে ভাবার দরকার নেই।
   ============================================================ */
const POETS_RAW = `
1fw_xJT307O2N4k1uF8X6RuIqMRf2n5JB | https://www.gigabulletin.in/poetry-of-arthur-rimbaud | জাঁ আর্তুর র‍্যাঁবো | অগ্নিভ ভট্টাচার্য্য | কবি
1Un79mMLf3IWSzgtlxk7eKbpmeqFmKakA | https://www.gigabulletin.in/poetry-of-paul-celan | পল সেলিন | আশীষ সাহা | কবি
1TLH3dRGP3vo3jrUy472PDdx1xFhh9W-l | https://www.gigabulletin.in/poetry-of-rainer-maria-rilke | রাইনার মারিয়া রিলকে | শুভদীপ সান্যাল | কবি
1SZB4GFdDlhMkCs1mRXK_aVeYp3aAPPAD | https://www.gigabulletin.in/poetry-of-heberto-padilla | হারবার্তো প্যাদিয়া | সৌমাল্য চট্টোপাধ্যায় | কবি
1yYwpTFyenXk--t2MPorC2meh6vluRCE3 | https://www.gigabulletin.in/poetry-of-leonard-cohen | লিওনার্ড কোহেন | অগ্নিভ ভট্টাচার্য্য | কবি
1Mg4lpmlQF9q4whnbhMLA8a1Y_lH7UqUz | https://www.gigabulletin.in/poetry-of-hanshan | হানশান | শুভদীপ মৈত্র | কবি
1O-wPC9dk4IPTpk1DoBFEBLPm7FlLzCXa | https://www.gigabulletin.in/poetry-of-gagan-gill | গগন গিল | সব্যসাচী রায় | কবি
1DzT5kdubsDAtPbPsa_WcEcDKtD-m0XAT | https://www.gigabulletin.in/poetry-of-charles-bukowski | চার্লস বুকাওস্কি | সব্যসাচী রায় | কবি
1P2fqBrLCXhebteDC3n9exD_7yWZvND84 | https://www.gigabulletin.in/story-of-sadat-hasan-manto | সাদাত হাসান মান্টো | সব্যসাচী সেন | লেখক
1H29Y21C0WEmkhWpFqO50GoA8CgPlhrt7 | https://www.gigabulletin.in/poetry-of-vladimir-mayakovsky | ভ্লাদিমির মায়াকোভস্কি | অগ্নিভ ভট্টাচার্য্য | কবি
1OKPSD868et0y00Ag7LGucrspyJku5i23 | https://www.gigabulletin.in/poetry-of-steven-seidenberg | স্টিভেন সেডেনবার্গ | উজ্জ্বল বন্দ্যোপাধ্যায় | কবি
1kgALs7cD6B6fv0Rkz6jxOgq-w_cI-eGt | https://www.gigabulletin.in/story-of-chuck-palahniuk | চাক পালানিউক | রৌনিক রায় | লেখক
1zIyd7AlVQYWZfSxPAcNpPsS0fX4Lcp9D | https://www.gigabulletin.in/poetry-of-friedrich-nietzsche | ফ্রেডরিখ নীৎসে | শুভদীপ সান্যাল | কবি
102Y1e7TMH09eggyMauMkCdHeIYr6zRb3 | https://www.gigabulletin.in/poetry-of-oktay-rifat | ওকতায় রিফাত | সব্যসাচী রায় | কবি
1HuZFrffLEEO6fmhOqkiuc3_30hUPbrzy | https://www.gigabulletin.in/poetry-of-orhan-veli | ওর্হান ভেলি | সব্যসাচী রায় | কবি
1OeyVE7NganqvEZCYJ56wsKhdMuznr19D | https://www.gigabulletin.in/poetry-of-ono-no-komachi | ওনো নো কোমাচি | অগ্নিভ ভট্টাচার্য্য | কবি
1uAYp-gFYkkh1-_edm8aS9YDTb5lC7W3z | https://www.gigabulletin.in/poetry-of-robert-desnos | রবার্ট দেসনস | আশীষ সাহা | কবি
1ApxtNmk1zN2T9euZcHWBktZ1boy_PBmU | https://www.gigabulletin.in/poetry-of-melih-cevdet-anday | মেলিহ জেভদেত আন্দায় | সব্যসাচী রায় | কবি
1ge3Fvb-w_cKv7sdWQQiN1S08izPfmhZg | https://www.gigabulletin.in/poetry-of-wendy-guerra | ওয়েন্দে গেরে | উজ্জ্বল বন্দ্যোপাধ্যায় | কবি
1PQgbyMm3U36qgTkr0RJbnFCzLAgwQicf | https://www.gigabulletin.in/poetry-of-bob-kaufman | বব কফম্যান | শুভদীপ সান্যাল | কবি
1I0sUI8zkOfBkrOFIxCT72_U6pph-9dXt | https://www.gigabulletin.in/poetry-of-shimon-adaf | শিমোন আদাফ | সব্যসাচী রায় | কবি
11ehfnB5AfnHjjwE8wDMMtKqFdhE-5unM | https://www.gigabulletin.in/poetry-of-lawrence-ferlinghetti | লরেন্স ফের্লিনহেটি | সোমরাজ বন্দ্যোপাধ্যায় | কবি
1zy8CrtKU0UMS-wbQIIbmwWjjTI3n4WdE | https://www.gigabulletin.in/milan-kundera-the-book-of-laughter-and-forgetting-benngali-translation | মিলান কুন্দেরা | সব্যসাচী রায় | লেখক


`;

function parsePoets(raw){
  return raw.split('\n').map(l=>l.trim()).filter(l=>l && !l.startsWith('#')).map(line=>{
    const [driveId,link,poetName,translatorName,role]=line.split('|').map(s=>s.trim());
    return {driveId,link,poetName,translatorName,role:role||'কবি'};
  });
}
const POETS = parsePoets(POETS_RAW);
function imgUrl(id,w){return `https://lh3.googleusercontent.com/d/${id}=w${w}`}

/* One function builds every poet card — the whole page's poet UI runs through this. */
function buildPosterFrame(poet){
  const frame=document.createElement('div');
  frame.className='poster-frame';

  const link=document.createElement('a');
  link.className='poster-link';
  link.href=poet.link;
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.setAttribute('aria-label',`${poet.poetName}${poet.translatorName?', অনুবাদ '+poet.translatorName:''}, সম্পূর্ণ পড়ুন`);

  const bgLayer=document.createElement('div');
  bgLayer.className='bg-layer';
  const bgImg=document.createElement('img');
  bgImg.alt='';
  bgImg.decoding='async';
  bgImg.loading='lazy';
  bgImg.fetchPriority='low';
  // Background slide image: higher resolution since it's stretched to 150% width and drifts across the whole card.
  bgImg.dataset.src=imgUrl(poet.driveId,800);
  bgImg.addEventListener('load',()=>bgImg.classList.add('is-loaded'),{once:true});
  bgLayer.appendChild(bgImg);

  const scrim=document.createElement('div');
  scrim.className='scrim';

  const content=document.createElement('div');
  content.className='content';

  const gemWrap=document.createElement('div');
  gemWrap.className='gem-wrap';
  const gemImg=document.createElement('img');
  gemImg.className='gem-img';
  gemImg.decoding='async';
  gemImg.alt=`${poet.poetName} — কবিতার অলঙ্করণ`;
  // Small foreground gem thumbnail: stays lightweight at 300px, it's never shown large.
  gemImg.dataset.src=imgUrl(poet.driveId,300);
  gemImg.addEventListener('load',()=>gemImg.classList.add('is-loaded'),{once:true});
  gemWrap.appendChild(gemImg);

  const textCard=document.createElement('div');
  textCard.className='text-card';
  const roleLine=document.createElement('p');
  roleLine.className='credit-line';
  roleLine.innerHTML=`<span class="label-tag">${poet.role}:</span><span class="name">${poet.poetName}</span>`;
  textCard.appendChild(roleLine);
  if(poet.translatorName){
    const transLine=document.createElement('p');
    transLine.className='credit-line';
    transLine.innerHTML=`<span class="label-tag">অনুবাদ:</span><span class="name">${poet.translatorName}</span>`;
    textCard.appendChild(transLine);
  }

  content.appendChild(gemWrap);
  content.appendChild(textCard);
  link.appendChild(bgLayer);
  link.appendChild(scrim);
  link.appendChild(content);
  frame.appendChild(link);
  return frame;
}

/* ---------- Hero banner image ---------- */
const bannerImg=document.getElementById('bannerImg');
bannerImg.addEventListener('load',()=>bannerImg.classList.add('is-loaded'),{once:true});
bannerImg.src=imgUrl(BANNER_ID,1200);

/* ================================================================
   POET-NAME SLIDER — text only, no images, so this costs almost
   nothing to load. Each row's content is duplicated once so the
   loop wraps seamlessly; a single requestAnimationFrame loop per
   row auto-scrolls it, and pointer events (covers mouse + touch
   in one code path) let people drag it directly.
   ================================================================ */
function buildNameTrack(trackEl, names, dir){
  trackEl.innerHTML='';
  const list=[...names, ...names]; // duplicated for a seamless loop
  list.forEach(poet=>{
    const a=document.createElement('a');
    a.className='name-btn';
    a.href=poet.link;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.draggable=false; // stop the browser's native "drag a link" gesture from hijacking our pointer drag
    a.textContent=poet.poetName;
    trackEl.appendChild(a);
  });
  trackEl.addEventListener('dragstart',e=>e.preventDefault());

  let pos=0,dragging=false,startX=0,startPos=0,moved=0;
  const speed=dir*0.4; // px per frame, gentle
  const loopWidth=trackEl.scrollWidth/2;

  function tick(){
    if(!dragging) pos-=speed;
    // keep pos inside (-loopWidth, 0] so translation always stays in the duplicated range
    pos=((pos%loopWidth)+loopWidth)%loopWidth-loopWidth;
    trackEl.style.transform=`translate3d(${pos}px,0,0)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  trackEl.addEventListener('pointerdown',e=>{
    dragging=true;moved=0;
    startX=e.clientX;startPos=pos;
    // Listen on window (not via setPointerCapture) so drag tracking works
    // without retargeting the eventual click away from the tapped <a> —
    // pointer capture on trackEl was making every click land on the
    // container instead of the poet's link, silently killing navigation.
    window.addEventListener('pointermove',onMove);
    window.addEventListener('pointerup',onUp);
    window.addEventListener('pointercancel',onUp);
  });
  function onMove(e){
    if(!dragging)return;
    e.preventDefault();
    const dx=e.clientX-startX;
    moved=Math.max(moved,Math.abs(dx));
    pos=startPos+dx;
  }
  function onUp(){
    dragging=false;
    window.removeEventListener('pointermove',onMove);
    window.removeEventListener('pointerup',onUp);
    window.removeEventListener('pointercancel',onUp);
  }
  trackEl.addEventListener('click',e=>{
    if(moved>6)e.preventDefault(); // a real drag shouldn't also open the link
  });
}
buildNameTrack(document.getElementById('nameTrackA'),POETS,1);

/* ---------- Poet grid, lazy-loaded via a single observer ---------- */
const poetGrid=document.getElementById('poetGrid');
const frag=document.createDocumentFragment();
POETS.forEach(p=>frag.appendChild(buildPosterFrame(p)));
poetGrid.appendChild(frag);

const cardObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const frame=entry.target;
    const bgImg=frame.querySelector('.bg-layer img');
    const gemImg=frame.querySelector('.gem-img');
    if(bgImg && bgImg.dataset.src){bgImg.src=bgImg.dataset.src;bgImg.removeAttribute('data-src');}
    if(gemImg && gemImg.dataset.src){gemImg.src=gemImg.dataset.src;gemImg.removeAttribute('data-src');}
    frame.classList.add('is-visible');
    cardObserver.unobserve(frame);
  });
},{rootMargin:'200px 0px'});
document.querySelectorAll('.poet-grid .poster-frame').forEach(f=>cardObserver.observe(f));