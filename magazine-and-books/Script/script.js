
/* ==========================================================
   BOOKS DATA
   Add a new {id, title, description} object to add another book.
   cover: "half" (default) = the image is a full wrap-around spread,
          the right half (front cover) is shown in A5 shape.
   cover: "full" = the image is already a single A5 cover.
   ========================================================== */
const books = [
  {
    id: "1na2zR0xZ00goGXEPsdD8vR_DAhLqto8f",
    title: "কবিতার বই: শীতকালীন হার্টবিট ভাড়া দেওয়া হয়",
    description:
`আসল দাম (MRP): Rs. 300/-
UPI ধামাকা ডিসকাউন্ট (20% ছাড়): মাত্র: 240/-. ডাকমাশুল (Shipping): এক্কেবারে ফ্রি! (কোনো ডেলিভারি চার্জ লাগবে না)

কীভাবে অর্ডার করবেন?
আপনার ফোন থেকে 9830629933 নম্বরে Rs. 240/- UPI (GPay/PhonePe/Paytm) করে দিন।
পেমেন্টের স্ক্রিনশট সহ আপনার নাম এবং ঠিকানা পাঠিয়ে দিন একই নম্বরের WhatsApp-এ (9830629933)।
ঐতিহ্যবাহী দোকানে পেতে চাইলে যোগাযোগ করুন: পাতিরাম, অভিযান

হার্টবিটের স্টক সীমিত! শীত আসার আগেই নিজের বুকিং সেরে ফেলুন!`
  },
  {
    id: "1U79TauTALpM802QxtrkGx9pxfqaHRqMV",
    title: "গল্প সংগ্রহ: বিরাট কোহলির পাড়া ও অন্যান্য গল্প",
    description:
`ব্রজ সৌরভ চট্টোপাধ্যায়ের ১৪ টি গল্পের সংগ্রহ

প্রাপ্তিস্থান
কলেজস্ট্রিট: প্রতিক্ষণ, দে বুকস্টোর (দীপু), দে'জ, প্ল্যাটফর্ম, ধ্যানবিন্দু, বৈভাষিক, গল্পগুচ্ছ।
সোদপুর: পাপাঙ্গুল ঘর।
শ্রীরামপুর: Vestpocket
শান্তিনিকেতন: রামকৃষ্ণ বুক স্টোর, সুবর্ণরেখা, বইঘর শান্তিনিকেতন।
বর্ধমান: নবনী বুকস্টল
অনলাইন: <a href="https://amzn.in/d/0baiWksm" target="_blank" style="color:#8a5a00;font-weight:700;">https://amzn.in/d/0baiWksm</a>`
  },
  {
    id: "19PZhOrBEnz309D4q_opoC91l-3KzcIDP",
    title: "উপন্যাস: হেমন্তের কারুবাসনা ও পরাজিতের আখ্যান",
    description:
`এ কোনো উপন্যাস নয়, একরৈখিক টেক্সট বা বয়ান নয়, অথবা কোনো ভাষ্য নয়। এসবই হেমন্তের ভাবনা। আসলে সে ভাবনা লিখে যায় অনুভূতি দিয়ে, কখনো মস্তিষ্ক দিয়ে নিজের মতো করে। ভাবনাগুলো এলোমেলো অনিয়ন্ত্রিত।
হেমন্ত এখন অ্যাসাইলাইমে...

হেমন্তের কারুবাসনা ও পরাজিতের আখ্যান (উপন্যাস) মূল্য: ১৫০ টাকা।
প্রাপ্তিস্থান: ধ্যানবিন্দু
পোস্টাল পরিসেবা: 9836554203 (যোগাযোগ করুন)`
  },
  {
    id: "16GH7Pgn83e9BVbfL9_ar2SbTdg7sDE63",
    cover: "full",
    title: "ম্যাগাজিন: জিন ম্যাগাজিন — প্রথম প্যাঁচ",
    description:
`ফান পোয়েট্রির লালা জিভ, প্রথম প্যাঁচ কবিতা কমিক্স ও ফান শব্দের খুঁতকাতর অবস্থান 
প্রাপ্তিস্থান: ধ্যানবিন্দু (কলেজস্ট্রিট)
অনলাইন অর্ডার করুন: <a href="https://boighar.in/product/gene-magazine-1st-issue-summer/" target="_blank" style="color:#8a5a00;font-weight:700;">https://boighar.in/product/gene-magazine-1st-issue-summer/</a>
পোস্টাল পরিসেবা: 8697046862 (যোগাযোগ করুন)`
  },
  {
    id: "1W4G3n4fEYQdKsCa2XG928KviAGkLXo49",
    cover: "full",
    title: "ম্যাগাজিন: হপ্তাক কাচরা — দ্বিতীয় বুলেটিন ",
    description:
`মূল্য: ২০ টাকা
প্রাপ্তিস্থান: ধ্যানবিন্দু, হপ্তাককাচরা 
যোগাযোগ: 8240219317`
  }
];

/* ---------- PROGRESSIVE IMAGE LOADING: w20 (blur) -> w300 -> w1000 ---------- */
const GURL = (id, w) => 'https://lh3.googleusercontent.com/d/' + id + '=w' + w;
function progressive(el, id){
  const isImg = el.tagName === 'IMG';
  const show = (w, cls) => {
    if (isImg) el.src = GURL(id, w);
    else el.style.backgroundImage = "url('" + GURL(id, w) + "')";
    el.classList.remove('pl-1','pl-2','pl-3');
    el.classList.add(cls);
  };
  el.classList.add('pl');
  show(20, 'pl-1');
  [[300,'pl-2'],[1000,'pl-3']].reduce((prev, step) => prev.then(() => new Promise(res => {
    const im = new Image();
    im.onload = () => { show(step[0], step[1]); res(); };
    im.onerror = () => res();
    im.src = GURL(id, step[0]);
  })), Promise.resolve());
}

/* ---------- PDF CARD (always first below the feature block) ---------- */
const pdfImageIds = [
  "1ltkn634H5YL2Gx7I85pynyYkJaAn785G",
  "1bHuq9p7JKIWMtufGeeSb-lX7B1mbg3ox",
  "13xivdsQwx40_HtljK8N05c-i2PWeDuPn",
  "1mHCrlKMCT0QiEOgJKtlTtU-9OxdCOCQw",
  "1u18tVAZQqQdhbohsU0s5b8_0KtgdJeDA",
];
const pdfCard = document.createElement('a');
pdfCard.className = 'pdf-card';
pdfCard.href = 'https://www.gigabulletin.in/pdf-magazine-and-books';
pdfCard.target = '_blank';
pdfCard.innerHTML = `
  <div class="pdf-fan">
    ${pdfImageIds.map(id => `<div class="pdf-fan-img" data-gid="${id}"></div>`).join('')}
  </div>
  <div class="pdf-caption"><span class="pdf-caption-text">📚 পিডিএফ বই ও ম্যাগাজিন</span></div>
  <div class="pdf-badge"><span class="pdf-badge-text">✦ PDF available ✦</span></div>
`;
document.getElementById('pdfSlot').appendChild(pdfCard);
pdfCard.querySelectorAll('.pdf-fan-img').forEach(el => progressive(el, el.dataset.gid));

/* ---------- BOOKS, ONE BY ONE ---------- */
const list = document.getElementById('booksList');
books.forEach((book, idx) => {
  const isFull = book.cover === 'full';
  const cut = book.title.indexOf(':');
  const cat = cut > -1 ? book.title.slice(0, cut).trim() : '';
  const name = cut > -1 ? book.title.slice(cut + 1).trim() : book.title;
  const card = document.createElement('article');
  card.className = 'book';
  card.innerHTML = `
    <div class="book-main" role="button" tabindex="0" aria-expanded="false">
      <span class="ribbon" aria-hidden="true"></span>
      <div class="shelf-item">
        <div class="cover ${isFull ? 'full' : 'half'}">
          <img alt="${book.title}" decoding="async">
        </div>
      </div>
      <div class="book-info">
        <div class="book-title">${cat ? `<span class="bcat">${cat}</span>` : ''}<span class="bname">${name}</span></div>
        <div class="more">বিস্তারিত <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3C11 2 15 6 12.5 11C11 14 12.5 16 12 20"/><path d="M7 15.5L12 21L17 15.5"/></svg></div>
      </div>
    </div>
    <div class="book-desc-wrap"><div class="book-desc"><div class="book-desc-inner">${book.description}</div></div></div>
  `;
  const head = card.querySelector('.book-main');
  function toggle(){
    const open = card.classList.toggle('open');
    head.setAttribute('aria-expanded', open);
  }
  head.addEventListener('click', toggle);
  head.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
  });
  list.appendChild(card);
  progressive(card.querySelector('.cover img'), book.id);
});

/* ---------- pause the feature animations when off screen ---------- */
(function(){
  const f = document.getElementById('feature');
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(e => f.classList.toggle('off', !e[0].isIntersecting)).observe(f);
})();

/* ---------- keep the ribbon text on ONE line (shrinks only when needed) ---------- */
(function(){
  const sub = document.getElementById('sub');
  function fit(){
    sub.style.fontSize = '';
    for (let n = 0; n < 3; n++){
      const cw = sub.clientWidth, sw = sub.scrollWidth;
      if (sw <= cw + 1) break;
      sub.style.fontSize = (parseFloat(getComputedStyle(sub).fontSize) * cw / sw * .97).toFixed(2) + 'px';
    }
  }
  addEventListener('resize', fit);
  addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();

/* ---------- progressive load: header banner + feature image ---------- */
progressive(document.getElementById('titleBg'), '11oiSAP55lB_35yeI3hTD2JL1q8QiSO4M');
progressive(document.getElementById('featImg'), '1bPSmf0TiYP-1YenNKC3_aZZErfz75K5y');

/* ---------- CONTRIBUTE POPUP ---------- */
const popupOverlay = document.getElementById('popupOverlay');
const popupClose   = document.getElementById('popupClose');
function showPopup(){ popupOverlay.classList.add('show'); }
function hidePopup(){ popupOverlay.classList.remove('show'); }
function closeAndReschedule(){
  hidePopup();
  setTimeout(showPopup, 480000); // next popup 8 min after this close
}
popupClose.addEventListener('click', closeAndReschedule);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closeAndReschedule();
});
setTimeout(showPopup, 360000); // first popup appears 6 min after load

/* ---------- TICKER ---------- */
(function(){
  const B = 'https://www.gigabulletin.in/';
  /* [label, path, opens in new tab] — two sets for a seamless loop */
  const set1 = [
    ['গিগা বুলেটিন','giga-bulletin',1], ['গিগা জার্নাল','giga-journal',1], ['গিগা অনুবাদ','giga-translation',1],
    ['কবিতা গ্রাউন্ড','giga-poetry-ground',1], ['গিগা ক্যানভাস','giga-canvas',1], ['অন্যান্য বই','other-magazines-and-books',1],
    ['মতামত ও অনুদান','contribute-to-giga',0], ['Contact Us','contact-us',1], ['Privacy Policy','privacy-policy',1],
    ['জিজ্ঞাসাবাদ','faq',1], ['গিগা ফ্লো','giga-flow',1]
  ];
  const set2 = [
    ['গিগা বুলেটিন','giga-bulletin',1], ['গিগা জার্নাল','giga-journal',1], ['গিগা অনুবাদ','giga-translation',1],
    ['কবিতা গ্রাউন্ড','giga-poetry-ground',1], ['গিগা ক্যানভাস','giga-canvas',1], ['অন্যান্য','other-magazines-and-books',1],
    ['মতামত','contribute-to-giga',1], ['Contact','contact-us',1], ['Policy','privacy-policy',1],
    ['জিজ্ঞাসাবাদ','faq',1], ['গিগা ফ্লো','giga-flow',1]
  ];
  const wrapper = document.getElementById('tickerWrapper');
  const ticker  = document.getElementById('ticker');
  [set1, set2].forEach(set => set.forEach((it, i) => {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = B + it[1];
    if (it[2]) a.target = '_blank';
    a.textContent = it[0];
    ticker.appendChild(a);
  }));

  let autoSpeed = 0.6, pos = 0, dragging = false, startX = 0, startPos = 0, halfWidth = 0, dragMoved = false, inView = true;
  new IntersectionObserver(e => { inView = e[0].isIntersecting; }).observe(wrapper);

  function measure(){ halfWidth = ticker.scrollWidth / 2; }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  function wrapPos(){
    if (halfWidth <= 0) return;
    if (pos <= -halfWidth) pos += halfWidth;
    if (pos > 0) pos -= halfWidth;
  }
  function render(){ ticker.style.transform = 'translateX(' + pos + 'px)'; }
  function frame(){
    if (!dragging && inView && !document.hidden){ pos -= autoSpeed; wrapPos(); render(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function dragStart(x){ dragging = true; dragMoved = false; startX = x; startPos = pos; wrapper.classList.add('dragging'); }
  function dragMove(x){
    if (!dragging) return;
    const dx = x - startX;
    if (Math.abs(dx) > 3) dragMoved = true;
    pos = startPos + dx; wrapPos(); render();
  }
  function dragEnd(){ dragging = false; wrapper.classList.remove('dragging'); }

  wrapper.addEventListener('mousedown', (e) => { dragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => { if (dragging) dragMove(e.clientX); });
  window.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('click', (e) => {
    if (dragMoved){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  wrapper.addEventListener('touchstart', (e) => { dragStart(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchmove', (e) => { dragMove(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchend', dragEnd);
  wrapper.addEventListener('touchcancel', dragEnd);
  wrapper.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){
      pos -= e.deltaX; wrapPos(); render(); e.preventDefault();
    }
  }, {passive:false});
})();