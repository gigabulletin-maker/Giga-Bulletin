
let base=["ওই মুখ—","অল্প রেখার আকাশ, ","⏎","বরফ ","নীরবতা","পাপড়ির ঠোঁট থেকে","ভেঙে পড়ছে।"];
let items=[...base],breaks=[];
let history=[];
let redoStack=[];
const MAX_HISTORY=6;
const WORD_LIMIT=12;
function saveHistory(){
  history.push([...items]);
  if(history.length>MAX_HISTORY)history.shift();
  redoStack=[];
}
const cards=document.getElementById('cards'),live=document.getElementById('live'),nw=document.getElementById('nw');
function update(){
  let poem = "";
  items.forEach((item)=>{
    if(item==="⏎"){
      poem += "\n";
    }else{
      poem += (poem.endsWith("\n") || poem==="") ? item : " " + item;
    }
  });
  if(live.textContent !== poem)live.textContent = poem;
  syncHistoryButtons();
}
let selectedIndex=-1,menuTrigger=null,dragging=false,dragClickTimer=0;
const moonMenu=document.getElementById('moon-menu'),moonShade=document.getElementById('moon-shade');
const joinIcon=(hyphen)=>`<svg viewBox="0 0 36 24" aria-hidden="true"><rect x="${hyphen?1:5}" y="5" width="12" height="14" rx="3"/><rect x="${hyphen?23:19}" y="5" width="12" height="14" rx="3"/>${hyphen?'<path d="M15 12h6"/>':'<path d="M17 9l2 3-2 3"/>'}</svg>`;
const punctuation=[',','.',';','।','—','...','!'];
const moonActions=punctuation.map(value=>({symbol:value,label:value,value}));
const utilityActions=[{symbol:joinIcon(true),label:'পাশের শব্দ হাইফেনে জুড়ুন',join:'-'},{symbol:joinIcon(false),label:'পাশের শব্দ ফাঁক ছাড়া জুড়ুন',join:''},{symbol:'⤶',label:'নতুন পঙ্‌ক্তি',line:true}];
function endingPunctuation(word){
  const ending=word.match(/(?:\.{3}|[,.;।—!])+$/);
  return ending?(ending[0].match(/\.{3}|[,.;।—!]/g)||[]):[];
}
function availableMoonActions(word){
  const ending=endingPunctuation(word);
  const marks=ending.length>=2?[]:moonActions.filter(a=>!ending.includes(a.value));
  return [...marks,...utilityActions];
}
function closeMoon(restore=true){
  const previous=menuTrigger;moonMenu.hidden=true;moonShade.hidden=true;selectedIndex=-1;menuTrigger=null;
  cards.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));
  cards.querySelectorAll('.word[aria-expanded="true"]').forEach(el=>el.setAttribute('aria-expanded','false'));
  if(restore&&previous&&previous.isConnected)previous.focus({preventScroll:true});
}
function positionMoon(){
  if(moonMenu.hidden||!menuTrigger)return;
  const r=menuTrigger.getBoundingClientRect(),v=window.visualViewport;
  const width=v?v.width:innerWidth,height=v?v.height:innerHeight,ox=v?v.offsetLeft:0,oy=v?v.offsetTop:0;
  const size=204,scale=Math.min(1,(width-16)/size,(height-16)/size),actual=size*scale;
  moonMenu.style.zoom=scale;
  moonMenu.style.left=(ox+Math.max(8,Math.min(width-actual-8,r.left+r.width/2-ox-actual/2)))/scale+'px';
  moonMenu.style.top=(oy+Math.max(8,Math.min(height-actual-8,r.top+r.height/2-oy-actual/2)))/scale+'px';
}
function openMoon(i,trigger){
  if(dragging)return;
  if(selectedIndex===i&&!moonMenu.hidden){closeMoon();return}
  closeMoon(false);selectedIndex=i;menuTrigger=trigger;trigger.setAttribute('aria-expanded','true');trigger.closest('.card').classList.add('selected');
  moonMenu.replaceChildren();const center=document.createElement('div');center.className='moon-center';
  const title=document.createElement('strong');title.textContent=items[i];center.append(title);moonMenu.append(center);
  const actions=availableMoonActions(items[i]);
  actions.forEach((action,j)=>{
    const angle=(-90+j*360/actions.length)*Math.PI/180,b=document.createElement('button');b.type='button';b.className='moon-option';b.style.setProperty('--mx',Math.cos(angle)*80+'px');b.style.setProperty('--my',Math.sin(angle)*80+'px');
    b.setAttribute('aria-label',action.value?((endingPunctuation(items[i]).join('')+action.value)+' যোগ করুন'):action.label);b.title=action.value?(endingPunctuation(items[i]).join('')+action.value):action.label;b.innerHTML=action.symbol;
    b.disabled=Object.hasOwn(action,'join')&&(i>=items.length-1||items[i+1]==='⏎');
    b.onclick=()=>applyMoon(action);moonMenu.append(b);
  });
  const close=document.createElement('button');close.type='button';close.className='moon-close';close.textContent='×';close.setAttribute('aria-label','বন্ধ করুন');close.onclick=()=>closeMoon();moonMenu.append(close);
  moonShade.hidden=false;moonMenu.hidden=false;positionMoon();moonMenu.querySelector('button:not(:disabled)').focus({preventScroll:true});
}
function applyMoon(action){
  const i=selectedIndex;if(i<0||items[i]==='⏎')return;
  if(Object.hasOwn(action,'join')&&(i>=items.length-1||items[i+1]==='⏎'))return;
  if(action.value&&!availableMoonActions(items[i]).some(a=>a.value===action.value))return;
  saveHistory();
  if(action.line)items.splice(i+1,0,'⏎');
  else if(Object.hasOwn(action,'join'))items.splice(i,2,items[i]+action.join+items[i+1]);
  else items[i]+=action.value;
  closeMoon(false);render();const target=cards.children[i]?.querySelector('.word');if(target)target.focus({preventScroll:true});
  document.getElementById('status').textContent='';
}
moonShade.onclick=()=>closeMoon();
document.addEventListener('keydown',e=>{
  if(moonMenu.hidden)return;
  if(e.key==='Escape'){e.preventDefault();closeMoon()}
  if(e.key==='Tab'){
    const buttons=[...moonMenu.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(document.activeElement);
    e.preventDefault();buttons[(index+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();
  }
  if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){
    const buttons=[...moonMenu.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(index+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+buttons.length)%buttons.length].focus();
  }
});
addEventListener('resize',positionMoon);addEventListener('scroll',()=>{if(!moonMenu.hidden)closeMoon(false)},{passive:true});
cards.addEventListener('scroll',()=>{if(!moonMenu.hidden)closeMoon(false)},{passive:true});
if(window.visualViewport){visualViewport.addEventListener('resize',positionMoon);visualViewport.addEventListener('scroll',positionMoon)}
function render(){
  closeMoon(false);const frag=document.createDocumentFragment();
  items.forEach((t,i)=>{
    const d=document.createElement('div'),isBreak=t==='⏎';d.className='card'+(isBreak?' break':'');
    const word=document.createElement('button');word.type='button';word.className='word';word.textContent=isBreak?'⤶':t;
    if(!isBreak){word.setAttribute('aria-haspopup','dialog');word.setAttribute('aria-expanded','false');word.onclick=()=>{const current=[...cards.children].indexOf(d);if(current>=0)openMoon(current,word)}}
    else{word.setAttribute('aria-label','নতুন পঙ্‌ক্তি');word.tabIndex=-1}
    const remove=document.createElement('button');remove.type='button';remove.className='icon';remove.textContent='×';remove.setAttribute('aria-label',(isBreak?'নতুন পঙ্‌ক্তি':t)+' মুছুন');
    remove.onclick=e=>{e.stopPropagation();if(dragging)return;const current=[...cards.children].indexOf(d);if(current<0)return;saveHistory();items.splice(current,1);render()};d.append(word,remove);frag.append(d);
  });cards.replaceChildren(frag);update();
}
let puzzleScrollLocked=false;
function preventPuzzleScroll(e){if(puzzleScrollLocked&&e.cancelable)e.preventDefault()}
function lockPuzzleScroll(){
  if(puzzleScrollLocked)return;
  puzzleScrollLocked=true;
  document.addEventListener('touchmove',preventPuzzleScroll,{passive:false,capture:true});
  document.documentElement.classList.add('gpg-drag-active');
}
function unlockPuzzleScroll(){
  if(!puzzleScrollLocked)return;
  puzzleScrollLocked=false;
  document.removeEventListener('touchmove',preventPuzzleScroll,{capture:true});
  document.documentElement.classList.remove('gpg-drag-active');
}
// Capture only a held/dragged puzzle gesture; normal swipes remain native.

document.addEventListener('touchend',unlockPuzzleScroll,{passive:true});
document.addEventListener('touchcancel',unlockPuzzleScroll,{passive:true});
addEventListener('blur',unlockPuzzleScroll);
if(typeof Sortable!=='undefined')new Sortable(cards,{
  animation:220,easing:'cubic-bezier(0.2, 0.7, 0.2, 1)',delay:0,delayOnTouchOnly:false,touchStartThreshold:3,
  forceFallback:true,fallbackTolerance:3,fallbackOnBody:true,swapThreshold:.65,invertSwap:false,scroll:cards,bubbleScroll:false,scrollSensitivity:40,scrollSpeed:5,
  filter:'.icon',preventOnFilter:false,ghostClass:'sortable-ghost',chosenClass:'sortable-chosen',dragClass:'sortable-drag',
  onChoose(e){if(e.originalEvent&&(e.originalEvent.type.startsWith('touch')||e.originalEvent.pointerType==='touch'))lockPuzzleScroll()},
  onUnchoose(){unlockPuzzleScroll()},
  onStart(){clearTimeout(dragClickTimer);dragging=true;lockPuzzleScroll();closeMoon(false)},
  onEnd(e){
    unlockPuzzleScroll();
    if(e.oldIndex!==e.newIndex){saveHistory();const x=items.splice(e.oldIndex,1)[0];items.splice(e.newIndex,0,x)}
    // Keep the landed DOM in place so the settling animation stays smooth.
    update();dragClickTimer=setTimeout(()=>{dragging=false},120);
  }
});
async function copyText(){
  const text=live.textContent,button=document.querySelector('.copy-poem');
  let copied=false;
  try{await navigator.clipboard.writeText(text);copied=true}catch(_){
    const previous=document.activeElement,ta=document.createElement('textarea');ta.value=text;
    ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);ta.select();
    try{copied=document.execCommand('copy')}catch(_){}finally{ta.remove();if(previous)previous.focus({preventScroll:true})}
  }
  const status=document.getElementById('status');
  if(copied){button.classList.add('copied');button.querySelector('span').textContent='কপি হয়েছে';status.textContent='কবিতা কপি হয়েছে';clearTimeout(copyText.timer);copyText.timer=setTimeout(()=>{button.classList.remove('copied');button.querySelector('span').textContent='কপি'},2200)}
  else status.textContent='কপি করা যায়নি। লাইভ কবিতা থেকে লেখা নির্বাচন করে কপি করুন।';
}
function add(){
  const raw=nw.value;
  if(!raw.trim())return;
  saveHistory();
  const lines=raw.split(/\n/);
  const totalWords=raw.trim().split(/\s+/).filter(Boolean).length;
  lines.forEach((line,li)=>{
    const trimmed=line.trim();
    if(trimmed){
      if(totalWords>WORD_LIMIT){
        const words=trimmed.split(/\s+/).filter(Boolean);
        words.forEach(w=>items.push(w));
      }else{
        items.push(trimmed);
      }
    }
    if(li<lines.length-1){
      items.push("⏎");
    }
  });
  nw.value="";
  render();
}
function clearWords(){
  if(!items.length)return;
  saveHistory();
  items=[];
  closeMoon(false);
  render();
}
function resetP(){
  saveHistory();
  items=[...base];
  render();
}
function brk(){
  saveHistory();
  items.push("⏎");
  render();
}
function send() {
  const body = live.textContent;
  const fullBody = "কবি: (আপনার নাম)\n\n" + body;
  const subject = "Giga Poetry Ground";
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  let url;
  if (isMobile) {
    url = "mailto:gigabulletin@gmail.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(fullBody);
  } else {
    url = "https://mail.google.com/mail/?view=cm&fs=1&tf=1" +
      "&to=gigabulletin@gmail.com" +
      "&su=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(fullBody);
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
function syncHistoryButtons(){
  const undoButton=document.getElementById('undo-button'),redoButton=document.getElementById('redo-button');
  if(undoButton)undoButton.disabled=!history.length;
  if(redoButton)redoButton.disabled=!redoStack.length;
}
function undo(){
  if(!history.length)return;
  redoStack.push([...items]);
  items=history.pop();
  render();
}
function redo(){
  if(!redoStack.length)return;
  history.push([...items]);
  items=redoStack.pop();
  render();
}
render();



function setupWordboxResize(box,shell,label){

 const handle=document.createElement('div');
 handle.className='wordbox-resize';handle.tabIndex=0;
 handle.setAttribute('role','separator');handle.setAttribute('aria-orientation','horizontal');
 handle.setAttribute('aria-label',label);
 handle.title='Drag up or down to resize · Arrow keys adjust · Double-click to reset';
 handle.innerHTML='<span class="resize-grip" aria-hidden="true"><svg class="resize-arrow resize-arrow-up" viewBox="0 0 24 24"><path d="M5 14l7-7 7 7M8 19l4-4 4 4"/></svg><span class="resize-roller"></span><svg class="resize-arrow resize-arrow-down" viewBox="0 0 24 24"><path d="M5 10l7 7 7-7M8 5l4 4 4-4"/></svg></span>';
 shell.append(handle);
 const min=180,max=1200;let drag=null,resizeFrame=0,pendingHeight=0;
 const updateAria=()=>{handle.setAttribute('aria-valuemin',min);handle.setAttribute('aria-valuemax',max);handle.setAttribute('aria-valuenow',Math.round(box.getBoundingClientRect().height))};
 function setHeight(height){const value=Math.max(min,Math.min(max,height));box.style.height=value+'px';box.style.minHeight=value+'px';box.style.maxHeight=value+'px';handle.setAttribute('aria-valuenow',Math.round(value))}
 handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();drag={id:e.pointerId,y:e.clientY,height:box.getBoundingClientRect().height};handle.setPointerCapture(e.pointerId);handle.classList.add('is-resizing');document.documentElement.classList.add('wordbox-resizing');handle.focus({preventScroll:true})});
 handle.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;pendingHeight=drag.height+e.clientY-drag.y;if(!resizeFrame)resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;setHeight(pendingHeight)})});
 function end(){if(resizeFrame){cancelAnimationFrame(resizeFrame);resizeFrame=0;setHeight(pendingHeight)}drag=null;handle.classList.remove('is-resizing');document.documentElement.classList.remove('wordbox-resizing')}
 handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
 function reset(){box.style.removeProperty('height');box.style.removeProperty('min-height');box.style.removeProperty('max-height');updateAria()}
 handle.addEventListener('dblclick',reset);
 handle.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();setHeight(box.getBoundingClientRect().height+(e.key==='ArrowUp'?-1:1)*(e.shiftKey?50:10))}else if(e.key==='Home'){e.preventDefault();reset()}});
 updateAria();window.addEventListener('resize',updateAria);
}
setupWordboxResize(document.getElementById('cards'),document.getElementById('cards').parentElement,'শব্দের বাক্সের উচ্চতা পরিবর্তন করুন');
(()=>{const box=document.getElementById('live'),shell=document.createElement('div');shell.className='wordbox-shell live-resize-shell';box.before(shell);shell.append(box);setupWordboxResize(box,shell,'লাইভ কবিতার উচ্চতা পরিবর্তন করুন')})();