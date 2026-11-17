
(function(){
var d=document,has='IntersectionObserver' in window;
var im=d.querySelector('.bg'),x=new Image();x.referrerPolicy='no-referrer';x.onload=function(){im.src=x.src;im.classList.remove('lq')};x.src=im.dataset.full;
if(has){d.documentElement.classList.add('js');var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.04});d.querySelectorAll('.rv').forEach(function(e){io.observe(e)})}
var ov=d.getElementById('ov'),t;
function show(){ov.style.display='flex'}
function hide(){ov.style.display='none';clearTimeout(t);t=setTimeout(show,150000)}
t=setTimeout(show,180000);
d.getElementById('x').onclick=hide;
ov.onclick=function(e){if(e.target===ov)hide()};
d.onkeydown=function(e){if(e.key==='Escape'&&ov.style.display==='flex')hide()};
})();