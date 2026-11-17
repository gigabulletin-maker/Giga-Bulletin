
/* Email link: phones/tablets open the default mail app (mailto). Desktops open a Gmail compose tab, so it works even with no mail program installed. */
(function(){
  var a = document.getElementById('mailLink');
  if (!a) return;
  var mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  a.addEventListener('click', function(e){
    if (mobile) return;
    e.preventDefault();
    var w = window.open('https://mail.google.com/mail/?view=cm&fs=1&to=gigabulletin%40gmail.com', '_blank', 'noopener');
    if (!w) window.location.href = 'mailto:gigabulletin@gmail.com';
  });
})();



(function(){
  var wrapper = document.getElementById('tickerWrapper');
  var ticker  = document.getElementById('ticker');
  /* duplicate the buttons so the loop is seamless (both halves identical) */
  Array.prototype.slice.call(ticker.children).forEach(function(n){ ticker.appendChild(n.cloneNode(true)); });

  var autoSpeed = 0.6, pos = 0, dragging = false, startX = 0, startPos = 0, halfWidth = 0, dragMoved = false, running = true;
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
  document.addEventListener('visibilitychange', function(){ running = !document.hidden; });
  function dragStart(x){ dragging = true; dragMoved = false; startX = x; startPos = pos; wrapper.classList.add('dragging'); }
  function dragMove(x){
    if (!dragging) return;
    var dx = x - startX;
    if (Math.abs(dx) > 3) dragMoved = true;
    pos = startPos + dx; wrapPos(); render();
  }
  function dragEnd(){ dragging = false; wrapper.classList.remove('dragging'); }
  wrapper.addEventListener('mousedown', function(e){ dragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', function(e){ if (dragging) dragMove(e.clientX); });
  window.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('click', function(e){ if (dragMoved){ e.preventDefault(); e.stopPropagation(); } }, true);
  wrapper.addEventListener('touchstart', function(e){ dragStart(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchmove', function(e){ dragMove(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchend', dragEnd);
  wrapper.addEventListener('touchcancel', dragEnd);
  wrapper.addEventListener('wheel', function(e){
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){ pos -= e.deltaX; wrapPos(); render(); e.preventDefault(); }
  }, {passive:false});
})();