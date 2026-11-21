
  // three issue tickets shown in the grey intro, each with its own colour theme
  const ISSUES = [
    {
      kind: "current",
      label: "ধারাবাহিক সংখ্যা—",
      title: [
        { text: "জড় রঙিন মুক্তি", cls: "iw-1" }
      ],
      link: "https://www.gigabulletin.in/jrm-giga-journal"
    },
    {
      kind: "prev",
      label: "পূর্ববর্তী সংখ্যা—",
      title: [
        { text: "পোস্ট পিক্সেল নীরবতা", cls: "iw-2" }
      ],
      link: "https://www.gigabulletin.in/ppn-giga"
    },
    {
      kind: "first",
      label: "প্রথম সংখ্যা—",
      title: [
        { text: "পুনরায় আলোর বৃশ্চিক", cls: "iw-3" }
      ],
      link: "/giga-journal/pab-giga/"
    }
  ];

  // the three posters — same ticker-card template, only the data changes
  const JOURNALS = [
    {
      driveId: "1BANYYXh1iwh7CGYMyvppz46-bXInblu2",
      link: "https://www.gigabulletin.in/jrm-giga-journal",
      words: [
        { text: "জড়",   cls: "w-silver" },
        { text: "রঙিন",  cls: "w-darkblue" },
        { text: "মুক্তি", cls: "w-turquoise-silver" }
      ],
      tickerText: "গিগা বুলেটিনের সাম্প্রতিক ধারাবাহিক, সমস্ত নতুন কিছুর বিস্ফোরণ, আরও আলোড়ন, আরও নিমজ্জন, শব্দ খেয়ে ফ্যালে যেরকম আলোর ভ্রম, সেই তল্লাট উন্মুক্ত, আর্টওয়ার্ক, কবিতা, লেখা, চিহ্নসমূহ এখানেই দৃশ্যের দাঁত ফুটে উঠবে।"
    },
    {
      driveId: "1l4tw4V8UO-kZ1SaBC5A0ZGcdubUBW5am",
      link: "https://www.gigabulletin.in/ppn-giga",
      words: [
        { text: "পোস্ট",   cls: "w-white" },
        { text: "পিক্সেল", cls: "w-yellow" },
        { text: "নীরবতা",  cls: "w-silverred" }
      ],
      tickerText: "গিগা বুলেটিনের দ্বিতীয় প্রকাশিত জার্নাল, দুরন্ত সব ফিল্ম, কবিতা, ফ্ল্যাশ ফিকশন, গল্প, কমিক্স, পেইন্টিং, প্রবন্ধ, চিঠি, ফটোগ্রাফি... ক্লিক করে একে খুঁটে দিন পিক্সেলের নীরবতা, হলুদ আলোর সন্ধ্যা তোমাকে ডুবিয়ে নেবে বিকেলের উরুসজ্জায়"
    },
    {
      driveId: "1we5M1uThIBZpriWc5n3mY6H5YGmFRBB7",
      link: "/giga-journal/pab-giga/",
      words: [
        { text: "পুনরায়",  cls: "w-silverred" },
        { text: "আলোর",    cls: "w-red" },
        { text: "বৃশ্চিক",  cls: "w-white" }
      ],
      tickerText: "গিগা বুলেটিনের প্রথম জার্নাল, নির্দিষ্ট কবিতা, গল্প, কমিক্স, পেইন্টিং, ফটোগ্রাফি, গান... ক্লিক করে একে একে ডোপামিন বিস্ফোরণ ঘটান, বিস্কুট ভেঙে পড়ার আগে ছোঁ-মেরে খেয়ে ফেলুন"
    }
  ];



  // --- plain grey-text issue navigation, only "রঙিন" animates ---
  const issuesEl = document.getElementById('issues');

  ISSUES.forEach(is => {
    const words = is.title
      .map(w => `<span class="w ${w.cls}">${w.text}</span>`)
      .join(' ');

    const a = document.createElement('a');
    a.className = `issue-card issue-${is.kind}`;
    a.href = is.link;
    a.setAttribute(
      'aria-label',
      `${is.label} ${is.title.map(w => w.text).join(' ')}`
    );

    a.innerHTML =
      `<span class="issue-tag">${is.label}</span>` +
      `<p class="issue-title">${words}</p>`;

    issuesEl.appendChild(a);
  });

  // --- poster grid (three ticker-cards) ---
  const grid = document.getElementById('grid');
  JOURNALS.forEach(j => {
    const words = j.words.map(w => `<span class="w ${w.cls}">${w.text}</span>`).join('');
    const seg = `<div class="p-ticker-seg"><span class="p-ticker-text">${j.tickerText}</span><span class="dot">•</span></div>`;
    const f = document.createElement('div');
    f.className = 'poster-frame';
    f.innerHTML =
      `<a class="poster-link" href="${j.link}" target="_blank" rel="noopener noreferrer" aria-label="${j.words.map(w=>w.text).join(' ')}">` +
        `<div class="p-bg" data-id="${j.driveId}"></div>` +
        `<div class="p-scrim"></div>` +
        `<div class="p-content"><div class="p-col">` +
          `<div class="p-text"><p class="p-title">${words}</p></div>` +
          `<div class="p-ticker"><div class="p-ticker-track">${seg}${seg}</div></div>` +
        `</div></div>` +
      `</a>`;
    grid.appendChild(f);
  });

  // embers rising from the hero
  const em = document.getElementById('embers'), r = Math.random;
  for (let i = 0; i < 34; i++) {
    const s = document.createElement('span');
    s.style.cssText = `left:${r()*100}%;--s:${2 + r()*4}px;--x:${(r()-.5)*180}px;animation-duration:${7 + r()*9}s;animation-delay:${-r()*16}s`;
    em.appendChild(s);
  }

  // shared lazy-load: images only fetch near the viewport, background stays
  // black + text-first (lower load, same finished look). One observer handles
  // both the hero background and the three poster backgrounds.
  const seen = new WeakSet();
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const el = e.target;
    if (e.isIntersecting && !seen.has(el)) {
      seen.add(el); io.unobserve(el);
      const w = el.dataset.w || 1200;
      const u = `https://lh3.googleusercontent.com/d/${el.dataset.id}=w${w}`;
      const readyCls = 'is-ready';
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { el.style.backgroundImage = `url("${u}")`; el.classList.add(readyCls); };
      im.src = u;
    }
  }), { rootMargin: '300px' });
  document.querySelectorAll('.bg-pan, .p-bg').forEach(el => io.observe(el));

  requestAnimationFrame(() => document.getAnimations().forEach(a => {
    if (a.animationName === 'cine' || a.animationName === 'bgPan') a.startTime = 0;
  }));