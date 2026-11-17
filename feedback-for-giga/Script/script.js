
/* ================= QUESTIONS ================= */
const PLACEHOLDER = 'নিসঙ্কোচে লিখুন আপনার প্রতিক্রিয়া...';
const QUESTIONS = [
  { n:'১', full:'গিগা বুলেটিনের কবিতা, লেখা অথবা পেইন্টিং, ফোটোগ্রাফি, কমিক্স কি আপনাকে নতুনভাবে দেখতে কিংবা ভাবতে বাধ্য করে?',
    mail:'১)',
    opts:['না না, একেবারেই না','খুব একটা না, তবে আছে','কখনও কখনও, মোটামুটি বলা যায়','বেশ ভালোভাবেই, কয়েকটা বাদে বেশ সবকটাই','ভীষণভাবে, প্রতিটি আর্ট, কবিতা ভীষণ সংক্রামক'] },
  { n:'২', full:'গিগা বুলেটিনের ওয়েবসাইটে নিয়মিত ভিজিট করা, লেখা খুঁজে পাওয়া আর পড়ার অভিজ্ঞতা আপনার কি আদৌ ভালো লাগে?',
    mail:'২)',
    opts:['ফালতু, সময়নষ্ট, তামিল সিনেমা দেখা বেটার','খুব একটা না, বোরিং জিনিসপত্র','মোটামুটি, কিছু ভালো, কিছু মনে হয় পানের পিক','বেশ ভালো, তবে বেটার হতে পারে','দারুণ, অসাধারণ, যেন স্বপ্নাবস্থান'] },
  { n:'৩', full:'আপনার কী মনে হয়, বাংলা সাহিত্য ও শিল্পের বিস্তৃতিতে গিগা বুলেটিন একটা ভিন্ন স্পেস তৈরি করতে পেরেছে?',
    mail:'৩)',
    opts:['ধুর, একেবারেই না','এখনও তেমন নয়, তবে আশা রাখা যায়','কিছুটা পেরেছে, তবে কানের চুলগুলো ছাটাই হতে হবে','অনেকটাই, অবশ্যই সম্পাদনা আরও দৃঢ় হতে হবে','অবশ্যই, স্বতন্ত্রভাবে'] },
  { n:'৪', full:'গিগা বুলেটিনের কোন লেখা, কবিতা বা ছবি কিংবা উদ্যোগ আপনার কাছে ভীষণ জরুরি মনে হয়েছে? এবং কেন?',
    mail:'৪)' },
  { n:'৫', full:'গিগা বুলেটিনের মূলত কোন দিকটা আপনার মনে হয় খুব বিরক্তিকর, একেবারেই ভালো লাগে না? ভীষণই বিরক্ত হন, কিংবা মনে হয়—বিষয়টা অন্যরকম হতে পারত?',
    mail:'৫)' },
  { n:'৬', full:'গিগা বুলেটিনের তরফে কোনো আইডিয়া বা আর কী দেখতে বা পড়তে চান, যা এখনও আমাদের সম্ভব হয়ে ওঠেনি?',
    mail:'৬)' },
  { n:'৭', full:'পাঠক অথবা দর্শক হিসেবে গিগা বুলেটিনের কোথায় মূলত খামতিটা চোখে পড়ে? সম্পাদনা, ওয়েবসাইট, ডিজাইন, গোটা কাজের ধরন কিংবা হাবিজাবি ঘিজিমিজিগুলো?',
    mail:'৭)' },
  { n:'৮', full:'গিগা বুলেটিনের কী বদল করলে অথবা কী নতুন করে শুরু করলে আরও ভালো কিছু হয়ে উঠতে পারে?',
    mail:'৮)' },
  { n:'৯', full:'এই সময়ে দুর্দান্ত কাজ করছে এমন আপনার প্রিয় কিছু ম্যাগাজিনের নাম জানতে চাই!',
    mail:'৯)' },
  { n:'১০', full:'গিগা বুলেটিনের সাথে আপনার কতোদিনের পরিচয় এবং কীভাবে?',
    mail:'১০)' },
  { n:'১১', full:'আপনার নাম জানতে পারলে, আমরা কৃতজ্ঞ থাকবো।',
    mail:'নাম:', short:true }
];
const answers = QUESTIONS.map(() => '');
const previews = [];
function setAnswer(i, val, q){
  answers[i] = val;
  q.classList.toggle('done', !!val);
  previews[i].textContent = val ? val.replace(/\s+/g, ' ') : '';
  previews[i].classList.toggle('show', !!val);
}
const toBn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

/* ================= BUILD ================= */
const root = document.getElementById('questions');

function el(tag, cls, html){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ---- notebook text box ---- */
function makeTextBox(i, short, q){
  const note = el('div', 'note' + (short ? ' short' : ''));
  const ta = el('textarea');
  ta.placeholder = short ? 'আপনার নাম লিখুন...' : PLACEHOLDER;
  ta.spellcheck = false;
  ta.setAttribute('spellcheck','false');
  ta.setAttribute('autocorrect','off');
  ta.setAttribute('autocapitalize','off');
  ta.setAttribute('autocomplete','off');
  ta.setAttribute('aria-label', 'উত্তর ' + QUESTIONS[i].n);
  const count = el('div', 'count', '০ অক্ষর');
  ta.addEventListener('input', () => {
    setAnswer(i, ta.value.trim(), q);
    count.textContent = toBn(ta.value.length) + ' অক্ষর';
  });
  note.append(ta, count);
  return note;
}

/* ---- rolling drum: the front card is always the chosen answer ---- */
function fitOneLine(node, avail, min){
  node.style.fontSize = '';
  const base = parseFloat(getComputedStyle(node).fontSize);
  if (node.scrollWidth > avail && avail > 0){
    node.style.fontSize = Math.max(min, base * avail / node.scrollWidth) + 'px';
  }
}

function makeLikert(i, q){
  const opts = QUESTIONS[i].opts;
  const N = opts.length, step = 360 / N;
  let ang = 0, rpx = 300, touched = false, timer = null, drag = null, moved = false, samples = [];

  const wrap = el('div', 'likert');
  const pin = el('div', 'pin');
  const stage = el('div', 'stage');
  stage.tabIndex = 0;
  stage.setAttribute('role', 'listbox');
  stage.setAttribute('aria-label', 'ঘুরিয়ে উত্তর বেছে নিন');
  const drum = el('div', 'drum');
  const items = opts.map((t, k) => {
    const it = el('div', 'opt', '<span class="tx">' + t + '</span><span class="badge">✓ নির্বাচিত</span>');
    it.style.setProperty('--i', k);
    it.setAttribute('role', 'option');
    it.addEventListener('click', () => {
      if (moved) return;
      const f = front();
      if (k === f){ settle(ang); return; }
      let d = ((k - f) % N + N) % N;
      if (d > N / 2) d -= N;
      rotateBy(d);
    });
    drum.appendChild(it);
    return it;
  });
  stage.appendChild(drum);
  const floor = el('div', 'floor');

  const prev = el('button', 'arrow', '‹'); prev.type = 'button'; prev.setAttribute('aria-label', 'আগের উত্তর');
  const next = el('button', 'arrow', '›'); next.type = 'button'; next.setAttribute('aria-label', 'পরের উত্তর');
  const dots = el('div', 'dots');
  const dotEls = opts.map((_, k) => {
    const d = el('button', 'dot'); d.type = 'button';
    d.setAttribute('aria-label', 'উত্তর ' + toBn(k + 1));
    d.addEventListener('click', () => {
      let dd = ((k - front()) % N + N) % N;
      if (dd > N / 2) dd -= N;
      rotateBy(dd);
    });
    dots.appendChild(d);
    return d;
  });
  const nav = el('div', 'nav'); nav.append(prev, dots, next);
  wrap.append(pin, stage, floor, nav);

  let rafP = 0;
  function schedulePaint(){ if (!rafP) rafP = requestAnimationFrame(() => { rafP = 0; paint(); }); }
  function front(){ return ((Math.round(ang / step) % N) + N) % N; }
  function paint(){
    wrap.style.setProperty('--ang', ang + 'deg');
    const f = front();
    items.forEach((it, k) => {
      let rel = (((k * step - ang) % 360) + 360) % 360;
      if (rel > 180) rel -= 360;
      it.style.setProperty('--rel', Math.abs(rel).toFixed(0));
      it.classList.toggle('on', k === f);
      it.classList.toggle('chosen', touched && k === f);
    });
    dotEls.forEach((d, k) => d.classList.toggle('act', k === f));
    if (touched) setAnswer(i, opts[f], q);
  }
  function settle(a){
    clearTimeout(timer);
    drum.classList.remove('drag'); stage.classList.remove('drag');
    ang = Math.round(a / step) * step;
    touched = true;
    paint();
  }
  function rotateBy(k){ settle(Math.round(ang / step) * step + k * step); }

  prev.addEventListener('click', () => rotateBy(-1));
  next.addEventListener('click', () => rotateBy(1));
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'){ rotateBy(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight'){ rotateBy(1); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === ' '){ settle(ang); e.preventDefault(); }
  });

  /* drag right -> the drum turns right; drag left -> turns left */
  stage.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, a: ang, id: e.pointerId };
    moved = false;
    samples = [{ t: performance.now(), a: ang }];
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 5){
      moved = true;
      clearTimeout(timer);
      stage.setPointerCapture(drag.id);
      drum.classList.add('drag'); stage.classList.add('drag');
      touched = true;
    }
    if (moved){
      /* the surface under the finger moves exactly with the finger */
      ang = drag.a - (dx / rpx) * (180 / Math.PI);
      const now = performance.now();
      samples.push({ t: now, a: ang });
      while (samples.length > 2 && now - samples[0].t > 110) samples.shift();
      schedulePaint();
    }
  });
  const end = () => {
    if (!drag) return;
    const was = moved;
    drag = null;
    if (was){
      /* flick: carry the momentum, then snap to the nearest answer */
      const a = samples[0], b = samples[samples.length - 1];
      let v = 0;
      if (b.t - a.t > 8 && performance.now() - b.t < 90) v = (b.a - a.a) / (b.t - a.t);
      let carry = v * 240;
      const lim = step * 1.6;
      carry = Math.max(-lim, Math.min(lim, carry));
      settle(ang + carry);
      setTimeout(() => { moved = false; }, 0);
    }
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  function size(){
    const w = drum.offsetWidth || 300;
    rpx = (w / 2) / Math.tan(Math.PI / N) * 1.18;
    wrap.style.setProperty('--r', rpx + 'px');
    items.forEach(it => fitOneLine(it.querySelector('.tx'), it.clientWidth - 62, 10.5));
  }
  new ResizeObserver(size).observe(drum);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
  size(); paint();
  return wrap;
}

/* ---- assemble each question ---- */
QUESTIONS.forEach((Q, i) => {
  const q = el('section', 'q');
  const head = el('div', 'qhead');
  head.append(el('div', 'num', '<span>' + Q.n + '</span>'), el('div', 'qtext', Q.full));

  const btn = el('button', 'ans-btn', '<span class="lbl">উত্তর</span><span class="tick">✓</span><span class="arr" aria-hidden="true"><i class="dm"></i><svg viewBox="0 0 24 24"><path class="c1" d="M7 7.5l5 5 5-5"/><path class="c2" d="M7 12.5l5 5 5-5"/></svg></span>');
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');

  const panel = el('div', 'panel');
  const inner = el('div', 'inner');
  const pad = el('div', 'pad');
  inner.appendChild(pad); panel.appendChild(inner);

  const preview = el('div', 'preview');
  previews[i] = preview;
  const row = el('div', 'ans-row');
  row.append(btn, preview);
  q.append(head, row, panel);
  root.appendChild(q);

  pad.appendChild(Q.opts ? makeLikert(i, q) : makeTextBox(i, Q.short, q));

  btn.addEventListener('click', () => {
    const open = q.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

/* ================= PAUSE OFF-SCREEN ANIMATIONS ================= */
(function(){
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(en => {
    en.forEach(e => e.target.classList.toggle('off', !e.isIntersecting));
  }, {threshold:0});
  document.querySelectorAll('.hero, .q, .submit-row, #tickerWrapper').forEach(n => io.observe(n));
})();

/* ================= SUBMIT → MAIL ================= */
function buildBody(){
  return QUESTIONS
    .map((Q, i) => answers[i] ? Q.mail + ' ' + answers[i] : '')
    .filter(Boolean)
    .join('\n');
}

function send() {
  const TO = 'gigabulletin@gmail.com';
  const SUBJECT = 'Feedback for GIGA';
  const enc = encodeURIComponent;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const make = b => isMobile
    ? 'mailto:' + TO + '?subject=' + enc(SUBJECT) + '&body=' + enc(b)
    : 'https://mail.google.com/mail/?view=cm&fs=1&to=' + TO + '&su=' + enc(SUBJECT) + '&body=' + enc(b);

  const body = buildBody();
  let url = make(body);

  /* very long answers make a link too long to open reliably:
     copy them instead and let the mail open instantly with a short link */
  if (url.length > 7000){
    try { navigator.clipboard.writeText(body); } catch (e) {}
    url = make('(আপনার উত্তরগুলো কপি করা হয়েছে—এখানে পেস্ট করুন: Ctrl+V)');
  }

  if (isMobile) window.location.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
}
document.getElementById('submitBtn').addEventListener('click', send);

/* ================= TICKER ================= */
(function(){
  const wrapper = document.getElementById('tickerWrapper');
  const ticker  = document.getElementById('ticker');

  let autoSpeed = 0.6, pos = 0, dragging = false, startX = 0, startPos = 0;
  let halfWidth = 0, dragMoved = false, running = true;

  function measure(){ halfWidth = ticker.scrollWidth / 2; }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  function wrapPos(){
    if (halfWidth <= 0) return;
    if (pos <= -halfWidth) pos += halfWidth;
    if (pos > 0) pos -= halfWidth;
  }
  function render(){ ticker.style.transform = 'translate3d(' + pos + 'px,0,0)'; }

  function frame(){
    if (!dragging && running){ pos -= autoSpeed; wrapPos(); render(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  function dragStart(x){ dragging = true; dragMoved = false; startX = x; startPos = pos; wrapper.classList.add('dragging'); }
  function dragMove(x){
    if (!dragging) return;
    const dx = x - startX;
    if (Math.abs(dx) > 3) dragMoved = true;
    pos = startPos + dx; wrapPos(); render();
  }
  function dragEnd(){ dragging = false; wrapper.classList.remove('dragging'); }

  wrapper.addEventListener('mousedown', e => { dragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) dragMove(e.clientX); });
  window.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('click', e => { if (dragMoved){ e.preventDefault(); e.stopPropagation(); } }, true);
  wrapper.addEventListener('touchstart', e => { dragStart(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchmove', e => { dragMove(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchend', dragEnd);
  wrapper.addEventListener('touchcancel', dragEnd);
  wrapper.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){ pos -= e.deltaX; wrapPos(); render(); e.preventDefault(); }
  }, {passive:false});
})();