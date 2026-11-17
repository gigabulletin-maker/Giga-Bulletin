
(function(){
var d=document,has='IntersectionObserver' in window,hero=d.getElementById('hero');
/* progressive image */
var im=d.querySelector('.bg'),x=new Image();x.referrerPolicy='no-referrer';x.onload=function(){im.src=x.src;im.classList.remove('lq')};x.src=im.dataset.full;
/* torch light: follows pointer, wanders on its own when idle */
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,last=-9e9,vis=true;
if(has)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(hero);
function set(a,b){hero.style.setProperty('--mx',a+'%');hero.style.setProperty('--my',b+'%')}
addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom)return;last=performance.now();set((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)},{passive:true});
if(!rm)(function tick(t){if(vis&&t-last>2500)set(50+32*Math.sin(t/2600),38+18*Math.cos(t/3700));requestAnimationFrame(tick)})(0);
/* fade-in cards */
if(has){d.documentElement.classList.add('js');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.04});d.querySelectorAll('.rv').forEach(function(e){io.observe(e)})}
/* smooth load: low-res poster first; PDF loads only after the frame stays in view, one at a time; far-away PDFs are unloaded */
var q=[],busy=false;
function nx(){if(busy||!q.length)return;var f=q.shift(),k=(f._k=(f._k||0)+1);f._l=1;f._d=0;busy=true;var fin=function(){if(f._k!==k||f._d)return;f._d=1;busy=false;f.classList.add('ok');f.parentNode.classList.add('lv');nx()};f.onload=fin;setTimeout(fin,9000);f.src=f.dataset.src}
function ld(f){if(f._l||q.indexOf(f)>-1)return;q.push(f);nx()}
function ul(f){var i=q.indexOf(f);if(i>-1)q.splice(i,1);if(!f._l)return;f._k=(f._k||0)+1;f.onload=null;f.classList.remove('ok');f.parentNode.classList.remove('lv','go');var tt=f.parentNode.querySelector('.tp');if(tt)tt.textContent='খুলতে ট্যাপ করুন';f.src='about:blank';if(!f._d)busy=false;f._l=0;f._d=0;nx()}
var ifs=[].slice.call(d.querySelectorAll('.fr iframe'));
if(has){var fo=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)ul(e.target)})},{rootMargin:'200% 0px'});ifs.forEach(function(f){fo.observe(f);var b=f.parentNode;b.addEventListener('click',function(){if(f._l)return;b.classList.add('go');var t=b.querySelector('.tp');if(t)t.textContent='লোড হচ্ছে…';ld(f)})})}else{ifs.forEach(function(f){ld(f)})}
/* pause offscreen animations */
if(has){var po=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting)})},{rootMargin:'100px 0px'});d.querySelectorAll('.fr,.is .n svg,.hero').forEach(function(e){po.observe(e)})}
/* contribute popup */
var ov=d.getElementById('ov'),t;
function show(){ov.style.display='flex'}
function hide(){ov.style.display='none';clearTimeout(t);t=setTimeout(show,150000)}
t=setTimeout(show,180000);
d.getElementById('x').onclick=hide;
ov.onclick=function(e){if(e.target===ov)hide()};
d.onkeydown=function(e){if(e.key==='Escape'&&ov.style.display==='flex')hide()};
})();