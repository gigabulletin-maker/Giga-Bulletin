
const cv=document.getElementById('cv'),x=cv.getContext('2d',{alpha:false}),zoomLabel=document.getElementById('zoomLabel'),workspace=document.getElementById('workspace');
let PAPER_W=2048,PAPER_H=2048;
const paper=document.createElement('canvas');paper.width=PAPER_W;paper.height=PAPER_H;
const p=paper.getContext('2d',{alpha:false});
const mixerCanvas=document.createElement('canvas'),mixerCtx=mixerCanvas.getContext('2d');
p.fillStyle='white';p.fillRect(0,0,PAPER_W,PAPER_H);

let cameraX=0,cameraY=0,zoom=1;
const MIN_ZOOM=.05,MAX_ZOOM=20;
const size=document.getElementById('size'),brush=document.getElementById('brush'),color=document.getElementById('color'),ratio=document.getElementById('ratio');
let w,h,draw=false,lx,ly,lt,undoStack=[],redoStack=[];

/* per-stroke ribbon state */
let inkStarted=false,inkPrevWidth=0,inkPrevLX=0,inkPrevLY=0,inkPrevRX=0,inkPrevRY=0;
let eraserPathStarted=false,solidPathStarted=false,penPathStarted=false,chalkPathStarted=false;
let paletteKnifeStarted=false,pkPrevLX=0,pkPrevLY=0,pkPrevRX=0,pkPrevRY=0;
let dryStarted=false,dryDist=0,dryPrevW=0,dryPLX=0,dryPLY=0,dryPRX=0,dryPRY=0,bamDist=0;
let bristles=null,penW=0,oilMX=0,oilMY=0;
let oilStarted=false,oilRidgeOff=0,oilRidgeTarget=0,oilShineOff=0,oilShineTarget=0,oilPrevLX=0,oilPrevLY=0,oilPrevRX=0,oilPrevRY=0,oilPrevWidth=0;

/* canvas fills the workspace box (works for sidebar and stacked layouts) */
function resize(){
  w=workspace.clientWidth;h=workspace.clientHeight;
  if(cv.width!==w)cv.width=w;if(cv.height!==h)cv.height=h;
}
resize();
cameraX=w/2;cameraY=h/2;
zoom=Math.min(w/PAPER_W,h/PAPER_H)*.8;
let FIT_ZOOM=zoom;
let pw=w,ph=h;
new ResizeObserver(()=>{
  resize();
  cameraX+=(w-pw)/2;cameraY+=(h-ph)/2;
  pw=w;ph=h;
  requestRender();
}).observe(workspace);

function save(){
  // Reuse discarded history buffers while preserving all 15 undo snapshots.
  const snap=undoStack.length>=15?undoStack.shift():(redoStack.pop()||document.createElement('canvas'));
  if(snap.width!==PAPER_W)snap.width=PAPER_W;
  if(snap.height!==PAPER_H)snap.height=PAPER_H;
  snap.getContext('2d',{alpha:false}).drawImage(paper,0,0);
  undoStack.push(snap);redoStack=[];
}
save();

const RATIO_BASE=2048;
function applyRatio(r){
  const [rw,rh]=r.split(':').map(Number);
  let nW,nH;
  if(rw>=rh){nW=RATIO_BASE;nH=Math.round(RATIO_BASE*rh/rw)}else{nH=RATIO_BASE;nW=Math.round(RATIO_BASE*rw/rh)}
  /* contain-fit every snapshot onto the new paper so the drawing (and undo history) survive */
  const fit=img=>{
    const c=document.createElement('canvas');c.width=nW;c.height=nH;
    const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,nW,nH);
    const k=Math.min(nW/img.width,nH/img.height),dw=img.width*k,dh=img.height*k;
    g.drawImage(img,(nW-dw)/2,(nH-dh)/2,dw,dh);return c;
  };
  const cur=fit(paper);
  undoStack=undoStack.map(fit);redoStack=redoStack.map(fit);
  PAPER_W=nW;PAPER_H=nH;paper.width=nW;paper.height=nH;
  p.drawImage(cur,0,0);
  cameraX=w/2;cameraY=h/2;
  zoom=Math.min(w/PAPER_W,h/PAPER_H)*.8;FIT_ZOOM=zoom;
  requestRender();
}
ratio.onchange=()=>applyRatio(ratio.value);

function render(){
  x.fillStyle='#111';x.fillRect(0,0,w,h);
  x.save();x.translate(cameraX,cameraY);x.scale(zoom,zoom);
  x.drawImage(paper,-PAPER_W/2,-PAPER_H/2);
  x.restore();
}
let renderFrame=0;
function requestRender(){
  if(renderFrame)return;
  renderFrame=requestAnimationFrame(()=>{renderFrame=0;render()});
}
requestRender();

/* zoom */
let zoomTimer=null;
function flashZoomLabel(){
  zoomLabel.textContent=Math.round(zoom/FIT_ZOOM*100)+'%';
  zoomLabel.style.opacity=1;
  clearTimeout(zoomTimer);
  zoomTimer=setTimeout(()=>zoomLabel.style.opacity=0,700);
}
function zoomAtPoint(px,py,nz){
  nz=Math.min(Math.max(nz,MIN_ZOOM),MAX_ZOOM);
  const wx=(px-cameraX)/zoom,wy=(py-cameraY)/zoom;
  cameraX=px-wx*nz;cameraY=py-wy*nz;zoom=nz;
}
cv.addEventListener('wheel',e=>{
  if(e.ctrlKey||e.metaKey){
    e.preventDefault();
    const r=cv.getBoundingClientRect();
    zoomAtPoint(e.clientX-r.left,e.clientY-r.top,zoom*Math.exp(-e.deltaY*.01));
    flashZoomLabel();requestRender();
  }
},{passive:false});

/* pointers: draw (1 finger) / pinch-zoom + pan (2 fingers) */
const pointers=new Map();let pinch=null;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});

function beginDrawAt(px,py){
  draw=true;
  lx=(px-cameraX)/zoom+PAPER_W/2;ly=(py-cameraY)/zoom+PAPER_H/2;lt=Date.now();
  inkStarted=eraserPathStarted=solidPathStarted=penPathStarted=chalkPathStarted=paletteKnifeStarted=oilStarted=false;
  pencilStarted=false;pencilTravel=0;
  bristles=null;dryStarted=false;dryDist=0;bamDist=0;
  if(brush.value==='প্যালেট নাইফ')knifeBegin(lx,ly);
  if(brush.value==='ভেজা তুলি')wetBegin();
  chalkTravel=0;
  if(brush.value==='চক'){
    chalkStamp(lx,ly,Math.max(2,parseFloat(size.value)*.62),color.value);
    requestRender();
  }
}
cv.onpointerdown=e=>{
  cv.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
  if(pointers.size===2){
    draw=false;
    const [a,b]=[...pointers.values()];
    pinch={startDist:dist(a,b),startZoom:zoom,startCameraX:cameraX,startCameraY:cameraY,startMid:mid(a,b)};
  }else if(pointers.size===1){pinch=null;beginDrawAt(e.offsetX,e.offsetY)}
};

/* colour helpers */
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const toHex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
function mixWhite(hex,t){const[r,g,b]=rgb(hex);return toHex(r+(255-r)*t,g+(255-g)*t,b+(255-b)*t)}
function mixBlack(hex,t){const[r,g,b]=rgb(hex);return toHex(r*(1-t),g*(1-t),b*(1-t))}
function hexToRgba(hex,a){const[r,g,b]=rgb(hex);return `rgba(${r},${g},${b},${a})`}
function hexToHSL(hex){
  let[r,g,b]=rgb(hex).map(v=>v/255);
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let hh=0,s=0,l=(mx+mn)/2;
  if(mx!==mn){
    const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);
    if(mx===r)hh=(g-b)/d+(g<b?6:0);else if(mx===g)hh=(b-r)/d+2;else hh=(r-g)/d+4;
    hh/=6;
  }
  return[hh*360,s*100,l*100];
}
function oilyShade(hex,sb,ld,a=1){
  const[hh,s,l]=hexToHSL(hex);
  return `hsla(${hh.toFixed(1)},${Math.min(100,Math.max(0,s+sb)).toFixed(1)}%,${Math.min(96,Math.max(4,l+ld)).toFixed(1)}%,${a})`;
}


/* Chalk deposits pigment on paper peaks, leaving the valleys exposed.
   Cached grain masks keep the texture fine even with a large stick. */
let chalkTravel=0,chalkTip=null,chalkKey='',chalkDab=0;
const chalkTooth=document.createElement('canvas');
chalkTooth.width=chalkTooth.height=256;
const chalkToothCtx=chalkTooth.getContext('2d');
const tooth=chalkToothCtx.createImageData(256,256);
let chalkSeed=17431;
function chalkRandom(){chalkSeed=(Math.imul(chalkSeed,1664525)+1013904223)|0;return(chalkSeed>>>0)/4294967296}
for(let i=0;i<tooth.data.length;i+=4){
  const n=chalkRandom();
  tooth.data[i]=tooth.data[i+1]=tooth.data[i+2]=255;
  tooth.data[i+3]=n<.29?0:n<.52?45:110+Math.floor(chalkRandom()*145);
}
chalkToothCtx.putImageData(tooth,0,0);
const chalkScratch=document.createElement('canvas');
const chalkCtx=chalkScratch.getContext('2d');let chalkPattern=null;
function chalkStamp(cx,cy,wd,col,load=1){
  const diameter=Math.max(2,wd),side=Math.ceil(diameter*1.28)+4;
  if(chalkKey!==col+':'+side){
    chalkKey=col+':'+side;chalkTip=document.createElement('canvas');
    chalkTip.width=chalkTip.height=side;
    const g=chalkTip.getContext('2d'),im=g.createImageData(side,side),[r,bg,b]=rgb(col);
    for(let yy=0;yy<side;yy++)for(let xx=0;xx<side;xx++){
      const u=(xx-side/2)/(diameter*.5),v=(yy-side/2)/(diameter*.43);
      const radius=Math.hypot(u,v),n=chalkRandom();
      // Uneven contact and soft chipped edges, without a solid painted base.
      const edge=Math.max(0,Math.min(1,(1.04-radius)/.19));
      const contact=.62+.2*Math.sin(xx*.19+Math.sin(yy*.11)*2)+.18*Math.sin(yy*.27);
      const alpha=n<.22?0:edge*contact*(.22+chalkRandom()*.78);
      const k=(yy*side+xx)*4;
      im.data[k]=r;im.data[k+1]=bg;im.data[k+2]=b;im.data[k+3]=Math.round(255*alpha);
    }
    g.putImageData(im,0,0);
  }
  if(chalkScratch.width!==side||chalkScratch.height!==side){chalkScratch.width=chalkScratch.height=side;}
  else chalkCtx.clearRect(0,0,side,side);
  // Alternate reflection prevents a repeated stamp motif; grain stays paper-sized.
  chalkCtx.save();chalkCtx.translate(side/2,side/2);
  chalkCtx.scale((chalkDab&1)?-1:1,(chalkDab&2)?-1:1);
  chalkCtx.drawImage(chalkTip,-side/2,-side/2);chalkCtx.restore();chalkDab++;
  chalkCtx.globalCompositeOperation='destination-in';
  const left=Math.round(cx-side/2),top=Math.round(cy-side/2);
  chalkCtx.save();chalkCtx.translate(-left,-top);
  chalkCtx.fillStyle=chalkPattern||(chalkPattern=chalkCtx.createPattern(chalkTooth,'repeat'));
  chalkCtx.fillRect(left,top,side,side);chalkCtx.restore();
  chalkCtx.globalCompositeOperation='source-over';
  p.save();p.globalAlpha=.78*load;p.drawImage(chalkScratch,left,top);p.restore();
}
function chalkSegment(ax,ay,bx,by,wd,col){
  const length=Math.hypot(bx-ax,by-ay),spacing=Math.max(.65,wd*.12);
  if(!length)return;
  let distance=spacing-chalkTravel;
  while(distance<=length){
    const f=distance/length;
    chalkStamp(ax+(bx-ax)*f,ay+(by-ay)*f,wd,col);
    distance+=spacing;
  }
  chalkTravel=(chalkTravel+length)%spacing;
}


/* A knife lays down a continuous slab of paint. Its longitudinal ridges
   share the same geometry, so highlights do not restart at pointer events. */
let knifePoints=[],knifeUnder=null,knifeDistance=0,knifeWidth=0;
const knifeLayer=document.createElement('canvas'),knifeLayerCtx=knifeLayer.getContext('2d');
let knifeLastWidth=0;
function knifeComposite(left,top,right,bottom){
  left=Math.max(0,Math.floor(left));top=Math.max(0,Math.floor(top));
  right=Math.min(PAPER_W,Math.ceil(right));bottom=Math.min(PAPER_H,Math.ceil(bottom));
  const w=right-left,h=bottom-top;if(w<=0||h<=0)return;
  p.save();p.globalAlpha=1;p.drawImage(knifeUnder,left,top,w,h,left,top,w,h);
  p.drawImage(knifeLayer,left,top,w,h,left,top,w,h);p.restore();
}
function knifeBegin(px,py){
  knifeLayer.width=PAPER_W;knifeLayer.height=PAPER_H;
  knifeUnder=document.createElement('canvas');knifeUnder.width=PAPER_W;knifeUnder.height=PAPER_H;
  knifeUnder.getContext('2d').drawImage(paper,0,0);
  knifePoints=[{x:px,y:py}];knifeDistance=0;
  knifeWidth=Math.max(3,parseFloat(size.value)*1.05);knifeLastWidth=knifeWidth*.72;
}
function knifePaint(nx,ny,col,pressure=.65){
  const p=knifeLayerCtx;
  const a=knifePoints[0],dx=nx-a.x,dy=ny-a.y,length=Math.hypot(dx,dy);
  if(length<.01)return;
  const c=-dy/length,s=dx/length;
  const target=knifeWidth*(.58+.65*pressure);
  const width=knifeLastWidth+(target-knifeLastWidth)*.38;
  const previous=a.c===undefined?{c,s}:a;
  const lanes=64;
  const noise=n=>{const v=Math.sin(n*127.1+43.7)*43758.5453;return v-Math.floor(v)};
  p.save();p.globalAlpha=1;
  // Constant work per event: no history traversal, full-canvas copy, or delayed tip.
  for(let j=0;j<lanes;j++){
    const u=(j+.5)/lanes-.5,n=noise(j),edge=Math.abs(u)*2;
    const skip=width*(.015+.22*Math.pow(noise(j+81),2));
    if(knifeDistance+length<skip)continue;
    const f=Math.max(0,(skip-knifeDistance)/length);
    const ax=a.x+dx*f,ay=a.y+dy*f;
    const u0=j/lanes-.5,u1=(j+1.03)/lanes-.5;
    // A flat blade footprint; its fine lanes leave a broken, square release.
    p.beginPath();p.moveTo(ax+previous.c*u0*width,ay+previous.s*u0*width);
    p.lineTo(nx+c*u0*width,ny+s*u0*width);
    p.lineTo(nx+c*u1*width,ny+s*u1*width);
    p.lineTo(ax+previous.c*u1*width,ay+previous.s*u1*width);p.closePath();
    const h1=Math.exp(-Math.pow((u+.24)/.14,2)),h2=Math.exp(-Math.pow((u-.24)/.14,2));
    const slope=-(u+.24)/.14*h1-(u-.24)/.14*h2;
    const light=.015+.12*slope+(n-.5)*.045;
    p.fillStyle=light>0?mixWhite(col,Math.min(.34,light)):mixBlack(col,Math.min(.32,-light));
    p.globalAlpha=edge>.94?.65:1;p.fill();
    // Paper valleys show through as the loaded blade first makes contact.
    const opening=Math.max(0,1-knifeDistance/(width*.65));
    if(opening>0){
      p.save();p.clip();p.globalCompositeOperation='destination-out';
      const steps=Math.min(24,Math.max(1,Math.ceil(length/2)));
      for(let k=0;k<steps;k++){
        const r=noise(j*97+k+Math.floor(knifeDistance)*19);
        if(r>opening*.64)continue;
        const t=(k+.5)/steps,xx=ax+(nx-ax)*t+c*u*width,yy=ay+(ny-ay)*t+s*u*width;
        p.globalAlpha=.85;p.fillRect(xx,yy,Math.max(.8,width*.013),Math.max(1,width*.018));
      }p.restore();
    }
    // Subtle narrow drag grooves within the two broad folds.
    if(j%3===0){
      p.globalAlpha=.13;p.strokeStyle=j%2?mixWhite(col,.48):mixBlack(col,.4);
      p.lineWidth=Math.max(.35,width*.002);p.beginPath();
      p.moveTo(ax+previous.c*u*width,ay+previous.s*u*width);
      p.lineTo(nx+c*u*width,ny+s*u*width);p.stroke();
    }
  }
  p.restore();
  const margin=Math.max(width,knifeLastWidth)*.7+4;
  knifeComposite(Math.min(a.x,nx)-margin,Math.min(a.y,ny)-margin,Math.max(a.x,nx)+margin,Math.max(a.y,ny)+margin);
  knifeLastWidth=width;knifeDistance+=length;knifePoints=[{x:nx,y:ny,c,s}];
}
function knifeFinish(col){
  const q=knifePoints[0];if(!q||q.c===undefined)return;
  const g=knifeLayerCtx,width=knifeLastWidth;
  g.save();g.globalCompositeOperation='destination-out';
  // Lift-off exposes irregular channels and pinholes, rather than adding hairs.
  for(let j=0;j<80;j++){
    const raw=Math.sin(j*127.1+18)*43758.5453,n=raw-Math.floor(raw);
    const u=(j+.5)/80-.5,reach=Math.min(knifeDistance*.38,width*(.045+.34*n*n));
    const ex=q.x+q.c*u*width,ey=q.y+q.s*u*width;
    g.globalAlpha=1;g.lineWidth=width/80*1.1;g.lineCap='butt';
    g.beginPath();g.moveTo(ex-q.s*2,ey+q.c*2);g.lineTo(ex+q.s*reach,ey-q.c*reach);g.stroke();
    for(let k=0;k<4;k++){
      const d=reach+width*(k*.034+n*.08);
      if(d>knifeDistance*.5)continue;
      g.globalAlpha=.75;g.fillRect(ex+q.s*d,ey-q.c*d,Math.max(.8,width*.012),Math.max(.8,width*.014));
    }
  }g.restore();
  knifeComposite(q.x-width,q.y-width,q.x+width,q.y+width);requestRender();
}


/* Lit impasto stamp: surface relief controls highlights and pigment shadows. */
let oilTip=null,oilTipColor='',oilTravel=0,oilHeading=null;
function prepareOilTip(col){
  if(oilTip&&oilTipColor===col)return;
  oilTipColor=col;oilTip=document.createElement('canvas');oilTip.width=oilTip.height=256;
  const g=oilTip.getContext('2d'),im=g.createImageData(256,256),[red,green,blue]=rgb(col);
  const relief=(u,v)=>{
    let z=.48*Math.sqrt(Math.max(0,1-u*u-v*v));
    for(let k=0;k<5;k++){
      const center=-.73+k*.35+.06*Math.sin(u*5+k*2)+.035*Math.sin(u*13+k);
      const t=(v-center)/(.036+k*.007);
      z+=.105*Math.exp(-t*t);
    }
    return z+.006*Math.sin(v*145+u*9)+.003*Math.sin(u*91+v*127);
  };
  for(let yy=0;yy<256;yy++)for(let xx=0;xx<256;xx++){
    const u=(xx-127.5)/124,v=(yy-127.5)/124;
    const radius=Math.hypot(u,v),edge=1-radius+.009*Math.sin(Math.atan2(v,u)*29);
    if(edge<=0)continue;
    const dx=(relief(u+.008,v)-relief(u-.008,v))/.016;
    const dy=(relief(u,v+.008)-relief(u,v-.008))/.016;
    const norm=Math.hypot(dx,dy,1),light=Math.max(0,(-dx*.32-dy*.48+.82)/norm);
    const spec=Math.pow(Math.max(0,(-dx*.22-dy*.34+.914)/norm),24)*.62;
    const shade=.62+light*.48,shine=Math.min(.67,spec);
    const n=Math.sin(xx*127.1+yy*311.7)*43758.5453,grain=n-Math.floor(n);
    const pit=grain>.996?.72:1,index=(yy*256+xx)*4;
    [red,green,blue].forEach((c,k)=>{const pigment=c*shade*pit;im.data[index+k]=Math.min(255,pigment+(255-pigment)*shine)});
    im.data[index+3]=Math.round(255*Math.min(1,edge*60));
  }
  g.putImageData(im,0,0);
}
function oilDab(px,py,width,angle){
  p.save();p.translate(px,py);p.rotate(angle);p.globalAlpha=1;
  p.drawImage(oilTip,-width*.36,-width*.5,width*.72,width);p.restore();
}
function oilSegment(ax,ay,bx,by,base,col,pressure){
  prepareOilTip(col);
  const length=Math.hypot(bx-ax,by-ay);if(length<.01)return;
  const angle=Math.atan2(by-ay,bx-ax),target=Math.max(2,base*(.68+.4*pressure));
  if(!oilStarted){oilPrevWidth=target;oilTravel=0;oilHeading=angle;oilStarted=true;oilDab(ax,ay,target,angle)}
  const spacing=Math.max(.75,Math.min(target,oilPrevWidth)*.12);
  let d=spacing-oilTravel;
  const turn=Math.atan2(Math.sin(angle-oilHeading),Math.cos(angle-oilHeading));
  while(d<=length){
    const f=d/length,width=oilPrevWidth+(target-oilPrevWidth)*f;
    oilDab(ax+(bx-ax)*f,ay+(by-ay)*f,width,oilHeading+turn*f);d+=spacing;
  }
  oilTravel=(oilTravel+length)%spacing;oilPrevWidth=target;oilHeading=angle;
}


// Original radial wash, refined with cached soft pigment tips and even spacing.
let wetTips=[],wetTipKey='',wetTravel=0,wetStarted=false,wetDabIndex=0;
function wetBegin(){wetTravel=0;wetStarted=false;wetDabIndex=0}
function wetPrepare(col){
  if(wetTipKey===col)return;wetTipKey=col;wetTips=[];
  for(let k=0;k<3;k++){
    const tip=document.createElement('canvas');tip.width=tip.height=160;
    const g=tip.getContext('2d'),im=g.createImageData(160,160),ch=rgb(col);
    for(let yy=0;yy<160;yy++)for(let xx=0;xx<160;xx++){
      const u=(xx-79.5)/78,v=(yy-79.5)/78,r=Math.hypot(u,v);
      if(r>=1)continue;
      // Original center-to-edge softness, with very subtle suspended pigment.
      const falloff=r<.3?1-r*.85:r<.6?.745-(r-.3)*1.55:.28*Math.pow((1-r)/.4,1.7);
      const cloud=.86+.085*Math.sin(u*7+v*3+k*2)+.055*Math.sin(v*9-u*4+k);
      const pooled=.026*Math.exp(-Math.pow((r-.69)/.12,2));
      const raw=Math.sin(xx*127.1+yy*311.7+k*17)*43758.5453;
      const grain=.94+.06*(raw-Math.floor(raw));
      const i=(yy*160+xx)*4;ch.forEach((c,j)=>im.data[i+j]=c);
      im.data[i+3]=Math.round(255*(.17*falloff*cloud+pooled)*grain);
    }g.putImageData(im,0,0);wetTips.push(tip);
  }
}
function wetSegment(ax,ay,bx,by,base,col){
  wetPrepare(col);
  const radius=Math.max(1,base*1.12),spacing=Math.max(.6,radius*.16),length=Math.hypot(bx-ax,by-ay);
  const dab=(px,py)=>{
    p.drawImage(wetTips[wetDabIndex++%wetTips.length],px-radius,py-radius,radius*2,radius*2);
  };
  p.save();p.globalAlpha=1;
  if(!wetStarted){dab(ax,ay);wetStarted=true}
  if(length){
    let d=spacing-wetTravel;
    while(d<=length){const f=d/length;dab(ax+(bx-ax)*f,ay+(by-ay)*f);d+=spacing}
    wetTravel=(wetTravel+length)%spacing;
  }
  p.restore();
}


// Persistent bristle tracks leave paper gaps rather than a solid paint ribbon.

function dryRandom(n){const v=Math.sin(n*127.1+81.3)*43758.5453;return v-Math.floor(v)}
let dryArcNormal=null;
function dryArc(ax,ay,bx,by,base,col){
  const dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy);if(length<.01)return;
  const c=-dy/length,s=dx/length;
  if(!dryStarted){dryStarted=true;dryDist=0;dryArcNormal={c,s,width:base};}
  const reach=Math.max(60,base*9),t=Math.min(1,dryDist/reach);
  const width=Math.max(.65,base*Math.pow(1-t,1.35));
  const steps=Math.max(1,Math.ceil(length/Math.max(2,base*.07)));
  p.save();p.strokeStyle=col;p.fillStyle=col;p.lineCap='round';
  if(!dryDist){p.beginPath();p.ellipse(ax,ay,base*.36,base*.46,Math.atan2(dy,dx),0,Math.PI*2);p.fill()}
  for(let st=0;st<steps;st++){
    const f0=st/steps,f1=(st+1)/steps,d=dryDist+length*f0,fade=Math.min(1,d/reach);
    const w0=dryArcNormal.width+(width-dryArcNormal.width)*f0,w1=dryArcNormal.width+(width-dryArcNormal.width)*f1;
    const n0c=dryArcNormal.c+(c-dryArcNormal.c)*f0,n0s=dryArcNormal.s+(s-dryArcNormal.s)*f0;
    const n1c=dryArcNormal.c+(c-dryArcNormal.c)*f1,n1s=dryArcNormal.s+(s-dryArcNormal.s)*f1;
    const patch=Math.floor(d/Math.max(2,base*.065));
    for(let j=0;j<64;j++){
      const u=(j+.5)/64-.5,edge=Math.abs(u)*2;
      const strand=dryRandom(j+81);
      const breakup=Math.max(0,(fade-.28)/.72);
      if(dryRandom(j*71+patch*17)<breakup*(.3+edge*.55))continue;
      if(fade>.7&&strand<.24)continue;
      const offset=u+.004*Math.sin(d/Math.max(2,base*.12)+j);
      p.globalAlpha=fade<.4?1:Math.max(.28,1-breakup*.35);
      p.lineWidth=Math.max(.3,w1*(.017+strand*.01)*(1-breakup*.45));
      p.beginPath();p.moveTo(ax+dx*f0+n0c*offset*w0,ay+dy*f0+n0s*offset*w0);
      p.lineTo(ax+dx*f1+n1c*offset*w1,ay+dy*f1+n1s*offset*w1);p.stroke();
    }
  }p.restore();dryDist+=length;dryArcNormal={c,s,width};
}


let pencilTip=null,pencilKey='',pencilTravel=0,pencilStarted=false,pencilWidth=0;
function pencilPrepare(col){
  if(pencilKey===col)return;pencilKey=col;
  pencilTip=document.createElement('canvas');pencilTip.width=96;pencilTip.height=96;
  const g=pencilTip.getContext('2d'),im=g.createImageData(96,96),ch=rgb(col);
  for(let yy=0;yy<96;yy++)for(let xx=0;xx<96;xx++){
    const u=(xx-47.5)/46,v=(yy-47.5)/46,r=Math.hypot(u,v);
    if(r>=1)continue;
    const raw=Math.sin(xx*127.1+yy*311.7)*43758.5453,n=raw-Math.floor(raw);
    const contact=Math.max(0,Math.min(1,(1-r)/.27));
    const alpha=n<.3?0:contact*(.25+.65*n);
    const i=(yy*96+xx)*4;ch.forEach((c,k)=>im.data[i+k]=c);im.data[i+3]=Math.round(alpha*255);
  }g.putImageData(im,0,0);
}
const pencilPaper=document.createElement('canvas');pencilPaper.width=pencilPaper.height=192;
const pencilPaperCtx=pencilPaper.getContext('2d'),pencilGrain=pencilPaperCtx.createImageData(192,192);
for(let i=0;i<192*192;i++){
  const raw=Math.sin(i*127.1+73)*43758.5453,n=raw-Math.floor(raw);
  pencilGrain.data[i*4]=pencilGrain.data[i*4+1]=pencilGrain.data[i*4+2]=255;
  const gx=i%192,gy=Math.floor(i/192);
  const coarseRaw=Math.sin(Math.floor(gx/2)*91.7+Math.floor(gy/2)*173.3)*15731.9;
  const coarse=coarseRaw-Math.floor(coarseRaw);
  pencilGrain.data[i*4+3]=n<.2||coarse<.08?0:Math.round(65+(n-.2)/.8*190);
}pencilPaperCtx.putImageData(pencilGrain,0,0);
const pencilScratch=document.createElement('canvas'),pencilCtx=pencilScratch.getContext('2d');let pencilPattern=null;
function pencilSegment(ax,ay,bx,by,base,col,pressure,velocity){
  const speedFactor=1/(1+Math.min(6,Math.max(0,velocity))*.13);
  const target=Math.max(.55,base*.145*(.38+pressure*.95)*speedFactor);
  if(!pencilStarted){pencilStarted=true;pencilWidth=target;}
  const width=pencilWidth+(target-pencilWidth)*.4,margin=Math.max(width,pencilWidth)*.7+3;
  const left=Math.floor(Math.min(ax,bx)-margin),top=Math.floor(Math.min(ay,by)-margin);
  const w=Math.ceil(Math.max(ax,bx)+margin)-left,h=Math.ceil(Math.max(ay,by)+margin)-top;
  if(pencilScratch.width!==w)pencilScratch.width=w;
  if(pencilScratch.height!==h)pencilScratch.height=h;
  pencilCtx.clearRect(0,0,w,h);
  pencilCtx.save();pencilCtx.translate(-left,-top);
  pencilCtx.lineCap='round';pencilCtx.lineJoin='round';pencilCtx.strokeStyle=mixWhite(col,.045);
  pencilCtx.lineWidth=width;pencilCtx.beginPath();pencilCtx.moveTo(ax,ay);pencilCtx.lineTo(bx,by);pencilCtx.stroke();
  // Paper-fixed pores stay exposed even where successive marks overlap.
  pencilCtx.globalCompositeOperation='destination-in';
  pencilCtx.fillStyle=pencilPattern||(pencilPattern=pencilCtx.createPattern(pencilPaper,'repeat'));pencilCtx.fillRect(left,top,w,h);pencilCtx.restore();
  p.save();p.globalAlpha=Math.min(.94,(.42+pressure*.65)*(.72+.28*speedFactor));p.drawImage(pencilScratch,left,top);p.restore();
  pencilWidth=width;
}

function sprayAt(px,py,n,r,col){
  p.fillStyle=col;
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,dd=r*Math.abs((Math.random()+Math.random()+Math.random())/1.5-1);
    p.globalAlpha=.35+Math.random()*.55;
    p.beginPath();p.arc(px+Math.cos(a)*dd,py+Math.sin(a)*dd,.5+Math.random()*1.1+r*.004,0,Math.PI*2);p.fill();
  }
  p.globalAlpha=1;
}
setInterval(()=>{
  if(draw&&brush.value==='স্প্রে'){
    const b=parseFloat(size.value);sprayAt(lx,ly,Math.max(6,Math.round(b*.3)),b*.6,color.value);requestRender();
  }
},35);

cv.onpointermove=e=>{
  if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.offsetX,y:e.offsetY});
  if(pointers.size===2&&pinch){
    const[a,b]=[...pointers.values()];
    const m=mid(a,b);
    const nz=Math.min(Math.max(pinch.startZoom*(dist(a,b)/pinch.startDist),MIN_ZOOM),MAX_ZOOM);
    const wx=(pinch.startMid.x-pinch.startCameraX)/pinch.startZoom,wy=(pinch.startMid.y-pinch.startCameraY)/pinch.startZoom;
    cameraX=m.x-wx*nz;cameraY=m.y-wy*nz;zoom=nz;
    flashZoomLabel();requestRender();return;
  }
  if(!draw)return;

  const nx=(e.offsetX-cameraX)/zoom+PAPER_W/2,ny=(e.offsetY-cameraY)/zoom+PAPER_H/2,t=Date.now();
  const speed=Math.hypot(nx-lx,ny-ly)/(t-lt+1);
  const base=parseFloat(size.value);
  const sz=Math.max(base*(.7+.3*(1-speed)),base*.15,.5);
  const col=color.value;
  p.lineCap='round';p.lineJoin='round';p.strokeStyle=col;p.fillStyle=col;

  function line(wd,a=1){
    p.globalAlpha=Math.max(0,a);p.lineWidth=Math.max(.1,wd);
    p.beginPath();p.moveTo(lx,ly);p.lineTo(nx,ny);p.stroke();p.globalAlpha=1;
  }
  function softDots(steps,rMin,rVar,a0,a1){
    for(let i=0;i<steps;i++){
      const t2=i/(steps-1),px=lx+(nx-lx)*t2,py=ly+(ny-ly)*t2,r2=sz*(rMin+Math.random()*rVar);
      const g=p.createRadialGradient(px,py,0,px,py,r2);
      g.addColorStop(0,hexToRgba(col,a0[0]));g.addColorStop(a1,hexToRgba(col,a0[1]));g.addColorStop(1,hexToRgba(col,0));
      p.fillStyle=g;p.beginPath();p.arc(px,py,r2,0,Math.PI*2);p.fill();
    }
  }
  function ribbonQuad(pl1,pl2,nl1,nl2){
    p.beginPath();p.moveTo(pl1[0],pl1[1]);p.lineTo(nl1[0],nl1[1]);p.lineTo(nl2[0],nl2[1]);p.lineTo(pl2[0],pl2[1]);p.closePath();p.fill();
  }
  const ang=Math.atan2(ny-ly,nx-lx),perp=ang+Math.PI/2;
  const m=brush.value;

  if(m==='ইঙ্ক পেন'){
    const flow=Math.max(.5,1-Math.min(1,speed*1.3));
    const tw=Math.max(.8,sz*.22*flow+sz*.03);
    if(!inkStarted){
      inkPrevWidth=tw*.12;
      const hx=Math.cos(perp)*inkPrevWidth/2,hy=Math.sin(perp)*inkPrevWidth/2;
      inkPrevLX=lx+hx;inkPrevLY=ly+hy;inkPrevRX=lx-hx;inkPrevRY=ly-hy;inkStarted=true;
    }
    const wd=inkPrevWidth+(tw-inkPrevWidth)*.35;
    const hx=Math.cos(perp)*wd/2,hy=Math.sin(perp)*wd/2;
    p.globalAlpha=1;p.fillStyle=col;
    ribbonQuad([inkPrevLX,inkPrevLY],[inkPrevRX,inkPrevRY],[nx+hx,ny+hy],[nx-hx,ny-hy]);
    inkPrevWidth=wd;inkPrevLX=nx+hx;inkPrevLY=ny+hy;inkPrevRX=nx-hx;inkPrevRY=ny-hy;
  }

  if(m==='সাধারণ পেন'){
    /* fountain pen: round nib, downstrokes swell and upstrokes thin, darker ink pooled at the edges, wet blob where the nib lands */
    const down=Math.sin(ang);
    const tw=Math.max(1.2,sz*.13*(.75+.3*down)*(1-Math.min(.25,speed*.2)));
    if(!penPathStarted){
      penW=tw;penPathStarted=true;
      p.globalAlpha=1;p.fillStyle=mixBlack(col,.3);p.beginPath();p.arc(lx,ly,tw*.75,0,Math.PI*2);p.fill();
    }
    penW+=(tw-penW)*.2;
    p.lineCap='round';
    p.globalAlpha=.97;p.strokeStyle=mixBlack(col,.3);p.lineWidth=penW;
    p.beginPath();p.moveTo(lx,ly);p.lineTo(nx,ny);p.stroke();
    p.globalAlpha=.85;p.strokeStyle=col;p.lineWidth=penW*.58;
    p.beginPath();p.moveTo(lx,ly);p.lineTo(nx,ny);p.stroke();
    p.globalAlpha=1;
  }

  if(m==='পেনসিল'){
    pencilSegment(lx,ly,nx,ny,base,col,e.pointerType==='pen'?Math.max(.05,e.pressure):.65,speed);
  }

  if(m==='শুকনো তুলি'){
    dryArc(lx,ly,nx,ny,base,col);
  }

  if(m==='ভেজা তুলি'){
    wetSegment(lx,ly,nx,ny,base,col);
  }

  if(m==='তেলরঙ'){
    oilSegment(lx,ly,nx,ny,base,col,e.pointerType==='pen'?Math.max(.05,e.pressure):.65);
  }

  if(m==='প্যালেট নাইফ'){
    knifePaint(nx,ny,col,e.pointerType==='pen'?Math.max(.05,e.pressure):.65);
  }

  if(m==='চক'){
    // Constant stick width; deposition is based on distance, not pointer speed.
    chalkSegment(lx,ly,nx,ny,Math.max(2,base*.62),col);
  }

  if(m==='মিক্সার'){
    const r=Math.max(12,sz*.85),d2=r*2;
    mixerCanvas.width=d2;mixerCanvas.height=d2;
    const sx=Math.max(0,Math.min(PAPER_W-d2,lx-r)),sy=Math.max(0,Math.min(PAPER_H-d2,ly-r));
    try{
      mixerCtx.putImageData(p.getImageData(sx,sy,d2,d2),0,0);
      mixerCtx.globalCompositeOperation='destination-in';
      const mk=mixerCtx.createRadialGradient(r,r,0,r,r,r);
      mk.addColorStop(0,'rgba(255,255,255,1)');mk.addColorStop(.55,'rgba(255,255,255,.7)');mk.addColorStop(1,'rgba(255,255,255,0)');
      mixerCtx.fillStyle=mk;mixerCtx.beginPath();mixerCtx.arc(r,r,r,0,Math.PI*2);mixerCtx.fill();
      mixerCtx.globalCompositeOperation='source-over';
      p.save();p.globalAlpha=.5;p.drawImage(mixerCanvas,nx-r,ny-r);
      const g=p.createRadialGradient(nx,ny,0,nx,ny,r*.7);
      g.addColorStop(0,hexToRgba(col,.16));g.addColorStop(1,hexToRgba(col,0));
      p.fillStyle=g;p.beginPath();p.arc(nx,ny,r*.7,0,Math.PI*2);p.fill();p.restore();
      p.globalAlpha=1;p.fillStyle=col;
    }catch(err){}
  }

  if(m==='স্পঞ্জ'){
    /* sponge: soft mottled dabs of varying size with soft light pores — no hard dots */
    const d=Math.hypot(nx-lx,ny-ly),steps=Math.max(1,Math.ceil(d/Math.max(3,sz*.15)));
    const clusters=Math.max(5,Math.min(22,Math.round(sz*.12)));
    for(let st=0;st<steps;st++){
      const t2=(st+1)/steps,cx=lx+(nx-lx)*t2,cy=ly+(ny-ly)*t2;
      for(let k=0;k<clusters;k++){
        const ox=cx+(Math.random()-.5)*sz*.9,oy=cy+(Math.random()-.5)*sz*.9,r=Math.max(.8,sz*(.1+Math.random()*.2));
        const g=p.createRadialGradient(ox,oy,0,ox,oy,r);
        g.addColorStop(0,hexToRgba(col,.17*(.5+Math.random())));g.addColorStop(.6,hexToRgba(col,.07));g.addColorStop(1,hexToRgba(col,0));
        p.fillStyle=g;p.globalAlpha=1;p.beginPath();p.arc(ox,oy,r,0,Math.PI*2);p.fill();
      }
      const wh=mixWhite(col,.88);
      for(let k=0;k<clusters;k++){
        const ox=cx+(Math.random()-.5)*sz*.9,oy=cy+(Math.random()-.5)*sz*.9,r=Math.max(.7,sz*(.02+Math.random()*.05));
        const g=p.createRadialGradient(ox,oy,0,ox,oy,r);
        g.addColorStop(0,hexToRgba(wh,.32));g.addColorStop(1,hexToRgba(wh,0));
        p.fillStyle=g;p.beginPath();p.arc(ox,oy,r,0,Math.PI*2);p.fill();
      }
    }
    p.globalAlpha=1;p.fillStyle=col;
  }

  if(m==='স্প্রে'){
    /* spray: coloured dots, dense at the centre, scattering outward */
    const d=Math.hypot(nx-lx,ny-ly),steps=Math.max(1,Math.ceil(d/Math.max(2,sz*.12)));
    for(let i=0;i<steps;i++){const t2=(i+1)/steps;sprayAt(lx+(nx-lx)*t2,ly+(ny-ly)*t2,Math.max(8,Math.round(sz*.5)),sz*.6,col)}
  }

  if(m==='সলিড রঙ'||m==='ইরেজার'){
    p.save();p.globalAlpha=1;
    p.strokeStyle=m==='ইরেজার'?'#ffffff':col;
    p.lineWidth=Math.max(1,sz);
    const started=m==='ইরেজার'?eraserPathStarted:solidPathStarted;
    if(!started){p.beginPath();p.moveTo(lx,ly);m==='ইরেজার'?eraserPathStarted=true:solidPathStarted=true}
    p.lineTo(nx,ny);p.stroke();p.restore();
  }

  lx=nx;ly=ny;lt=t;requestRender();
};

function endPointer(e){
  const was=draw,m=brush.value,col=color.value;
  function close(a,pl,pr,alpha){
    p.globalAlpha=alpha;p.fillStyle=col;p.beginPath();p.moveTo(pl[0],pl[1]);p.lineTo(lx,ly);p.lineTo(pr[0],pr[1]);p.closePath();p.fill();p.globalAlpha=1;requestRender();
  }

  if(was&&m==='ইঙ্ক পেন'&&inkStarted)close(0,[inkPrevLX,inkPrevLY],[inkPrevRX,inkPrevRY],1);

  if(was&&m==='তেলরঙ'&&oilStarted){oilDab(lx,ly,oilPrevWidth,oilHeading);requestRender()}
  if(was&&m==='প্যালেট নাইফ'){knifeFinish(col);knifePoints=[];knifeUnder=null;}


  pointers.delete(e.pointerId);draw=false;pinch=null;
  if(was)save();
  if(pointers.size===1){const[r]=[...pointers.values()];beginDrawAt(r.x,r.y)}
}
cv.onpointerup=endPointer;
cv.onpointercancel=endPointer;
cv.onpointerleave=e=>{if(e.buttons===0)endPointer(e)};

function restore(img){p.fillStyle='white';p.fillRect(0,0,PAPER_W,PAPER_H);p.drawImage(img,0,0);render()}
document.getElementById('undo').onclick=()=>{
  if(undoStack.length<2)return;
  redoStack.push(undoStack.pop());restore(undoStack.at(-1));
};
document.getElementById('redo').onclick=()=>{
  if(!redoStack.length)return;
  const s=redoStack.pop();undoStack.push(s);restore(s);
};
document.getElementById('clear').onclick=()=>{
  p.fillStyle='white';p.fillRect(0,0,PAPER_W,PAPER_H);render();save();
};

const downloadToast=document.getElementById('downloadToast');let dlTimer=null;
document.getElementById('download').onclick=()=>{
  const a=document.createElement('a');
  a.download='GigaCanvas.png';a.href=paper.toDataURL('image/png');a.click();
  downloadToast.classList.add('show');
  clearTimeout(dlTimer);dlTimer=setTimeout(()=>downloadToast.classList.remove('show'),6000);
};

const reminderToast=document.getElementById('reminderToast');
function showReminder(){reminderToast.classList.add('show');setTimeout(()=>reminderToast.classList.remove('show'),5000)}
setInterval(showReminder,30000);
setTimeout(showReminder,3000);

// Advanced palette keeps the existing color input as the brush color source.
(()=>{
  const $=id=>document.getElementById(id),dialog=$('colorPicker'),sv=$('svPicker'),hue=$('huePicker');
  let H=0,S=0,V=0;
  const read=(key)=>{try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a.filter(v=>/^#[0-9a-f]{6}$/i.test(v)).slice(0,24):[]}catch{return []}};
  let recent=read('gigaRecentColors'),saved=read('gigaSavedColors');
  const persist=(key,a)=>{try{localStorage.setItem(key,JSON.stringify(a))}catch{}};
  const presets=['#000000','#ffffff','#6b7280','#cbd5e1','#7f1d1d','#ef4444','#fb923c','#fbbf24','#fef08a','#365314','#65a30d','#34d399','#134e4a','#14b8a6','#38bdf8','#2563eb','#1e1b4b','#7c3aed','#c084fc','#ec4899','#9d174d','#78350f','#a16207','#d6b28b'];
  function hsvToHex(){
    const c=V*S,z=c*(1-Math.abs((H/60)%2-1)),m=V-c;
    const a=H<60?[c,z,0]:H<120?[z,c,0]:H<180?[0,c,z]:H<240?[0,z,c]:H<300?[z,0,c]:[c,0,z];
    return '#'+a.map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');
  }
  function fromHex(hex){
    const a=rgb(hex).map(v=>v/255),max=Math.max(...a),min=Math.min(...a),d=max-min;
    V=max;S=max?d/max:0;
    if(d){H=max===a[0]?60*((a[1]-a[2])/d%6):max===a[1]?60*((a[2]-a[0])/d+2):60*((a[0]-a[1])/d+4);H=(H+360)%360}
  }
  function renderSwatches(id,values){
    $(id).replaceChildren(...values.map(hex=>{
      const b=document.createElement('button');b.className='swatch';b.style.background=hex;b.title=hex;b.setAttribute('aria-label','Select '+hex);b.setAttribute('aria-pressed',String(hex===color.value));b.onclick=()=>{fromHex(hex);update()};return b;
    }));
  }
  function update(){
    const hex=hsvToHex();color.value=hex;$('colorToggle').style.setProperty('--chosen-color',hex);$('largeColorPreview').style.background=hex;
    $('colorValue').textContent=hex.toUpperCase();$('hexColor').value=hex.toUpperCase();
    const a=rgb(hex);['redColor','greenColor','blueColor'].forEach((id,i)=>$(id).value=a[i]);
    hue.value=H;sv.style.background='linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl('+H+',100%,50%)';
    $('svHandle').style.left=S*100+'%';$('svHandle').style.top=(1-V)*100+'%';
    sv.setAttribute('aria-valuenow',Math.round(S*100));sv.setAttribute('aria-valuetext','Saturation '+Math.round(S*100)+'%, brightness '+Math.round(V*100)+'%');
    $('colorError').textContent='';renderSwatches('presetColors',presets);renderSwatches('recentColors',recent);renderSwatches('savedColors',saved);
  }
  $('colorToggle').onclick=()=>{if(dialog.open){dialog.close();return}fromHex(color.value);update();dialog.show();const r=$('colorToggle').getBoundingClientRect();dialog.style.left=Math.max(12,Math.min(innerWidth-dialog.offsetWidth-12,r.left))+'px';dialog.style.top=Math.max(12,Math.min(innerHeight-dialog.offsetHeight-12,r.bottom+10))+'px'};
  $('closeColors').onclick=()=>dialog.close();
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open)dialog.close()});
  document.addEventListener('pointerdown',e=>{if(dialog.open&&!dialog.contains(e.target)&&!$('colorToggle').contains(e.target))dialog.close()});
  hue.oninput=()=>{H=+hue.value;update()};
  function pick(e){const r=sv.getBoundingClientRect();S=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));V=1-Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));update()}
  let selecting=false;sv.onpointerdown=e=>{selecting=true;sv.setPointerCapture(e.pointerId);pick(e)};sv.onpointermove=e=>{if(selecting)pick(e)};sv.onpointerup=sv.onpointercancel=()=>selecting=false;
  sv.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const d=e.shiftKey?.1:.01;if(e.key==='ArrowLeft')S-=d;if(e.key==='ArrowRight')S+=d;if(e.key==='ArrowUp')V+=d;if(e.key==='ArrowDown')V-=d;S=Math.max(0,Math.min(1,S));V=Math.max(0,Math.min(1,V));update()};
  $('hexColor').onchange=()=>{let hex=$('hexColor').value.trim();if(!hex.startsWith('#'))hex='#'+hex;if(/^#[0-9a-f]{3}$/i.test(hex))hex='#'+hex.slice(1).split('').map(c=>c+c).join('');if(!/^#[0-9a-f]{6}$/i.test(hex)){$('colorError').textContent='Enter a valid HEX color, such as #3B82F6.';return}fromHex(hex);update()};
  ['redColor','greenColor','blueColor'].forEach(id=>$(id).onchange=()=>{const a=['redColor','greenColor','blueColor'].map(id=>Math.max(0,Math.min(255,Math.round(Number($(id).value)||0))));fromHex(toHex(...a));update()});
  $('saveColor').onclick=()=>{saved=[color.value,...saved.filter(v=>v!==color.value)].slice(0,24);persist('gigaSavedColors',saved);update()};
  cv.addEventListener('pointerup',()=>{if(brush.value==='ইরেজার')return;recent=[color.value,...recent.filter(v=>v!==color.value)].slice(0,16);persist('gigaRecentColors',recent);if(dialog.open)renderSwatches('recentColors',recent)});
  color.addEventListener('input',()=>{fromHex(color.value);update()});update();
})();
