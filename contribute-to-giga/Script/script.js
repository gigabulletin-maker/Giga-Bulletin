
/* ================= QR TAG: timed show/hide + auto download ================= */
(function(){
  var SHOW_MS = 3000;   /* tag visible for 3s */
  var HIDE_MS = 4000;   /* tag gone for 4s, then repeat */
  var FILE_ID = '1iX7Zau1ikZ3nV1NILIjn1iTNR0p719Wj';
  var stack = document.getElementById('qrStack');
  var tag = document.getElementById('dlTag');
  var btn = document.getElementById('dlBtn');
  var img = document.getElementById('qrImg');
  var timer = null, inView = false;

  function cycle(){
    if (!inView) return;
    tag.classList.add('show');
    timer = setTimeout(function(){
      tag.classList.remove('show');
      timer = setTimeout(cycle, HIDE_MS);
    }, SHOW_MS);
  }
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      en.forEach(function(e){
        inView = e.isIntersecting;
        clearTimeout(timer);
        if (inView) cycle(); else tag.classList.remove('show');
      });
    }, {threshold:.35}).observe(stack);
  } else { inView = true; cycle(); }

  /* keep tag visible while it is being hovered/focused */
  btn.addEventListener('mouseenter', function(){ clearTimeout(timer); tag.classList.add('show'); });
  btn.addEventListener('mouseleave', function(){ if(inView){ clearTimeout(timer); timer=setTimeout(function(){ tag.classList.remove('show'); timer=setTimeout(cycle,HIDE_MS); },SHOW_MS); } });

  var FILE_NAME = 'Giga Contribution QR.png';
  var toast = document.createElement('div');
  toast.style.cssText='position:fixed;left:50%;bottom:104px;transform:translateX(-50%);z-index:60;padding:10px 18px;border-radius:12px;background:rgba(38,38,42,.92);color:#fff;font:600 14px "Noto Serif Bengali",serif;opacity:0;pointer-events:none;transition:opacity .3s';
  document.body.appendChild(toast);
  function say(t){ toast.textContent=t; toast.style.opacity=1; clearTimeout(say.t); say.t=setTimeout(function(){ toast.style.opacity=0; },2600); }

  function save(blob){
    var typed = blob.type && blob.type.indexOf('image/')===0 ? blob : new Blob([blob],{type:'image/png'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(typed);
    a.download = FILE_NAME;
    a.style.display='none';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ a.remove(); URL.revokeObjectURL(a.href); }, 5000);
    say('ডাউনলোড শুরু হয়েছে');
  }
  function fetchBlob(url){
    return fetch(url,{mode:'cors',cache:'force-cache'}).then(function(r){ if(!r.ok) throw new Error('bad'); return r.blob(); });
  }
  function viaCanvas(){
    return new Promise(function(res,rej){
      try{
        var c=document.createElement('canvas');
        c.width=img.naturalWidth; c.height=img.naturalHeight;
        c.getContext('2d').drawImage(img,0,0);
        c.toBlob(function(b){ b?res(b):rej(new Error('blob')); },'image/png');
      }catch(err){ rej(err); }
    });
  }
  function viaDrive(){ /* attachment response: downloads without leaving the page */
    var a=document.createElement('a');
    a.href='https://drive.google.com/uc?export=download&id='+FILE_ID;
    a.download=FILE_NAME; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove();
    say('ডাউনলোড শুরু হয়েছে');
  }
  var busy=false;
  btn.addEventListener('click', function(){
    if(busy) return; busy=true; say('ডাউনলোড হচ্ছে…');
    var src = img.currentSrc || img.src;
    fetchBlob(src)
      .catch(function(){ return fetchBlob('https://lh3.googleusercontent.com/d/'+FILE_ID+'=s0'); })
      .catch(viaCanvas)
      .then(save)
      .catch(function(){ try{ viaDrive(); }catch(e){ window.open(src,'_blank'); } })
      .then(function(){ setTimeout(function(){ busy=false; },1500); });
  });
})();

/* ================= PAUSE OFF-SCREEN ANIMATIONS ================= */
(function(){
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){ e.target.classList.toggle('off', !e.isIntersecting); });
  },{threshold:0});
  io.observe(document.getElementById('hero'));
  io.observe(document.getElementById('qrStack'));
})();

/* ================= TICKER ================= */
(function(){
  const wrapper = document.getElementById('tickerWrapper');
  const ticker  = document.getElementById('ticker');
  let autoSpeed = 0.6, pos = 0, dragging = false, startX = 0, startPos = 0, halfWidth = 0, dragMoved = false, running = true;
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
  wrapper.addEventListener('mousedown', (e) => { dragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => { if (dragging) dragMove(e.clientX); });
  window.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('click', (e) => { if (dragMoved){ e.preventDefault(); e.stopPropagation(); } }, true);
  wrapper.addEventListener('touchstart', (e) => { dragStart(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchmove', (e) => { dragMove(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchend', dragEnd);
  wrapper.addEventListener('touchcancel', dragEnd);
  wrapper.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){ pos -= e.deltaX; wrapPos(); render(); e.preventDefault(); }
  }, {passive:false});
})();