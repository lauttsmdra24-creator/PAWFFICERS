(function(){
'use strict';
const $=s=>document.querySelector(s);
const root=document.documentElement;

/* ================= SPRITE ENGINE ================= */
function inPoly(x,y,p){let r=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const xi=p[i][0],yi=p[i][1],xj=p[j][0],yj=p[j][1];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))r=!r;}return r;}
class Spr{
  constructor(w,h){this.w=w;this.h=h;this.b=new Array(w*h).fill(null);}
  get(x,y){x=Math.floor(x);y=Math.floor(y);return(x<0||y<0||x>=this.w||y>=this.h)?null:this.b[y*this.w+x];}
  px(x,y,c,only){x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=this.w||y>=this.h)return this;const cur=this.b[y*this.w+x];
    if(only===true&&cur===null)return this;if(typeof only==='function'&&!only(cur))return this;this.b[y*this.w+x]=c;return this;}
  rect(x,y,w,h,c,only){for(let j=0;j<h;j++)for(let i=0;i<w;i++)this.px(x+i,y+j,c,only);return this;}
  ell(cx,cy,rx,ry,c,only){for(let j=Math.floor(cy-ry);j<=Math.ceil(cy+ry);j++)for(let i=Math.floor(cx-rx);i<=Math.ceil(cx+rx);i++){const dx=(i+.5-cx)/rx,dy=(j+.5-cy)/ry;if(dx*dx+dy*dy<=1)this.px(i,j,c,only);}return this;}
  poly(pts,c,only){const ys=pts.map(p=>p[1]),xs=pts.map(p=>p[0]);
    for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++)for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++)if(inPoly(x+.5,y+.5,pts))this.px(x,y,c,only);return this;}
  line(x0,y0,x1,y1,c,only){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
    const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
    for(;;){this.px(x0,y0,c,only);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}return this;}
  outline(c){const n=this.b.slice();for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){if(this.b[y*this.w+x]!==null)continue;
    if(this.get(x-1,y)||this.get(x+1,y)||this.get(x,y-1)||this.get(x,y+1))n[y*this.w+x]=c;}this.b=n;return this;}
  url(){const c=document.createElement('canvas');c.width=this.w;c.height=this.h;const g=c.getContext('2d');
    for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){const v=this.b[y*this.w+x];if(v){g.fillStyle=v;g.fillRect(x,y,1,1);}}return c.toDataURL();}
}
function rows(rr,pal,ol){const h=rr.length,w=Math.max(...rr.map(r=>r.length));const s=new Spr(w+2,h+2);
  rr.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'&&pal[ch])s.px(x+1,y+1,pal[ch]);}));if(ol)s.outline(ol);return s;}

/* ---------- DOG ---------- */
function dog(mood,full){
  const s=new Spr(46,42);
  const B='#a8694a',SH='#8e5238',DK='#3b2a25',PK='#d98fa0',SN='#5a382c',EY='#16100f';
  // telinga
  s.poly([[8,18],[12,1],[19,14]],B);
  s.poly([[10,16],[12.5,5],[16,14]],PK);
  s.poly([[25,14],[32,1],[36,18]],B);
  s.poly([[28,14],[31.5,5],[34,16]],PK);
  // badan
  s.ell(23,25,14,12,B);
  if(full){s.ell(15,37,3,2,SH);s.ell(31,37,3,2,SH);s.poly([[34,28],[43,37],[40,39],[33,35]],DK);}
  s.ell(32,28,6,10,DK,c=>c===B);
  s.ell(23,34,10,3,SH,c=>c===B);
  s.ell(17,19,5,3,'#bf8260',c=>c===B);
  // topi polisi
  s.ell(22,9,8,4,'#3d3f45');
  s.rect(14,9,16,1,'#c0353f',c=>c==='#3d3f45');
  s.rect(14,10,16,1,'#e9e9ef',c=>c==='#3d3f45');
  s.ell(21,13,11,2,'#2c2d32');
  s.rect(12,12,18,1,'#55585f',c=>c==='#2c2d32');
  // moncong
  s.ell(21,25,4.5,3.2,SN);
  s.rect(19,23,4,2,'#120d0c');s.px(19,23,'#3a3a3a');
  // kalung syal + lencana
  s.rect(12,31,21,2,'#c0353f',true);s.rect(12,33,21,1,'#8f1f2b',true);
  s.rect(26,33,3,3,'#c0353f');
  s.ell(21,35,2,2,'#e4e4ea');s.rect(19,33,5,1,'#222');
  // ekspresi
  if(mood==='sad'){
    s.rect(15,19,3,3,EY);s.rect(25,19,3,3,EY);s.px(16,19,'#fff');s.px(26,19,'#fff');
    s.line(13,18,17,17,DK);s.line(28,17,31,18,DK);
    s.px(15,22,'#7fd0ff');s.px(15,23,'#7fd0ff');
    [[19,29],[20,28],[21,28],[22,28],[23,29]].forEach(p=>s.px(p[0],p[1],DK));
  }else if(mood==='soft'){
    s.rect(15,19,3,3,EY);s.rect(25,19,3,3,EY);s.px(16,19,'#fff');s.px(26,19,'#fff');
    [[19,28],[20,29],[21,29],[22,29],[23,28]].forEach(p=>s.px(p[0],p[1],DK));
    s.ell(12,24,2,1,'#e9957f',c=>c===B);
  }else if(mood==='happy'){
    [[14,21],[15,20],[16,20],[17,21],[24,21],[25,20],[26,20],[27,21]].forEach(p=>s.px(p[0],p[1],EY));
    s.ell(12,24,2,1,'#f58a8a',c=>c===B);s.ell(32,24,2,1,'#f58a8a',c=>c===B||c===DK);
    s.ell(21,29.5,3,2,'#6b1f24');s.px(21,30,'#f28ba0');s.px(22,30,'#f28ba0');
  }else if(mood==='angry'){
    s.ell(23,19,12,6,'#c4553e',c=>c===B);
    s.line(13,16,17,19,'#7a1010');s.line(30,16,26,19,'#7a1010');
    s.rect(15,20,3,2,EY);s.rect(25,20,3,2,EY);
    s.rect(18,28,6,2,'#fff');s.rect(18,30,6,1,DK);s.px(20,28,DK);s.px(22,28,DK);
  }else if(mood==='tired'){
    s.rect(14,20,4,1,EY);s.rect(24,20,4,1,EY);s.px(16,21,EY);s.px(26,21,EY);
    [[20,28],[21,28],[22,28]].forEach(p=>s.px(p[0],p[1],DK));
    s.ell(12,24,2,1,'#e9957f',c=>c===B);
  }else{ // sleep
    [[14,20],[15,21],[16,21],[17,20],[24,20],[25,21],[26,21],[27,20]].forEach(p=>s.px(p[0],p[1],EY));
    [[20,28],[21,29],[22,28]].forEach(p=>s.px(p[0],p[1],DK));
    s.ell(12,24,2,1,'#e9957f',c=>c===B);
  }
  return s.outline('#1f1512');
}

/* ---------- OBJEK ---------- */
function radio(){const s=new Spr(32,22);
  s.line(7,5,23,1,'#3b4a5c');s.line(7,6,23,2,'#3b4a5c');
  s.rect(4,4,24,2,'#44546a');
  s.rect(2,6,28,14,'#6584aa');s.rect(2,6,28,2,'#7f9cc0');s.rect(2,18,28,2,'#4f6b8f');
  [[9,13],[23,13]].forEach(p=>{s.ell(p[0],p[1],5,5,'#2d3a4c');s.ell(p[0],p[1],4,4,'#3b4b61');
    for(let i=-3;i<=3;i+=2)for(let j=-3;j<=3;j+=2)if(i*i+j*j<=12)s.px(p[0]+i,p[1]+j,'#243040');});
  s.rect(13,9,6,8,'#b4c5d8');s.rect(14,10,4,3,'#2d3a4c');s.rect(14,14,4,2,'#8aa0b8');
  s.rect(13,7,6,1,'#dfe8f0');s.px(14,7,'#d03a3a');
  return s.outline('#1d2733');}
function bone(){const s=new Spr(22,12);
  s.rect(5,4,12,4,'#f48fb9');[[4,4],[4,8],[18,4],[18,8]].forEach(p=>s.ell(p[0],p[1],2.5,2.2,'#f48fb9'));
  s.rect(5,4,12,1,'#ffb8d4');s.px(3,3,'#ffb8d4');s.px(18,3,'#ffb8d4');s.px(5,8,'#d96b99');
  return s.outline('#9c3a63');}
function food(){const s=new Spr(24,28);
  s.rect(4,6,16,20,'#f2c23c');s.rect(4,6,2,20,'#f7d567');s.rect(18,6,2,20,'#d9a626');
  s.rect(4,3,16,4,'#8a5a2b');s.rect(5,2,3,2,'#8a5a2b');s.rect(16,2,3,2,'#8a5a2b');
  s.ell(12,11,4,3,'#c27a35');s.px(9,9,'#c27a35');s.px(15,9,'#c27a35');s.px(11,11,'#3a2210');s.px(13,11,'#3a2210');s.px(12,12,'#3a2210');
  const G={D:['##.','#.#','#.#','#.#','##.'],O:['###','#.#','#.#','#.#','###'],G:['.##','#..','#.#','#.#','.##']};
  [['D',6],['O',10],['G',14]].forEach(a=>G[a[0]].forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch==='#')s.px(a[1]+x,16+y,'#6b3f1d');})));
  s.ell(12,23.5,5,1.8,'#fff');s.px(10,23,'#7a4a24');s.px(12,22,'#7a4a24');s.px(14,23,'#7a4a24');
  return s.outline('#5a3a12');}
function bowl(kind){const s=new Spr(30,16);
  s.ell(15,10,13,5,'#2a86d6');s.ell(15,8,13,5,'#47a3ee');s.ell(15,7,10,3.5,'#1d6bb5');
  if(kind==='water'||kind==='waterH'){
    if(kind==='water'){s.ell(15,7,9,3,'#9adbf8');s.px(12,6,'#e6f7ff');s.px(13,6,'#e6f7ff');}
    else{s.ell(15,8,6,1.8,'#9adbf8');s.px(13,7,'#e6f7ff');}
    s.rect(3,10,3,1,'#fff');s.px(2,9,'#fff');s.px(2,11,'#fff');s.rect(24,10,3,1,'#fff');s.px(27,9,'#fff');s.px(27,11,'#fff');}
  else if(kind==='full'){s.ell(15,6,8,3,'#8a5a2b');[[12,5],[16,4],[18,6],[14,7],[20,6]].forEach(p=>s.px(p[0],p[1],'#a8733c'));[[11,6],[15,5],[19,5],[13,4]].forEach(p=>s.px(p[0],p[1],'#6b4220'));}
  else if(kind==='half'){s.ell(15,7.5,5,1.6,'#8a5a2b');[[14,7],[17,7]].forEach(p=>s.px(p[0],p[1],'#a8733c'));s.px(15,8,'#6b4220');}
  else{s.rect(10,6,3,1,'#2a7bc4');s.px(9,7,'#2a7bc4');}
  s.ell(15,12,1.8,1,'#fff');s.px(12,11,'#fff');s.px(18,11,'#fff');s.px(14,10,'#fff');s.px(16,10,'#fff');
  return s.outline('#16406e');}
function arm(){const s=new Spr(10,8);s.ell(5,4,4.5,3,'#a8694a');s.rect(1,6,3,1,'#3b2a25');s.ell(7.5,4.5,2,2,'#3b2a25');return s.outline('#1f1512');}
function ball(){const s=new Spr(18,18);
  s.ell(9,9,6.5,6.5,'#4cb05f');
  s.line(4,6,13,4,'#2f8140',true);s.line(3,9,15,9,'#2f8140',true);s.line(4,12,13,14,'#2f8140',true);s.line(6,3,6,15,'#2f8140',true);s.line(11,3,12,15,'#2f8140',true);
  s.ell(7,6,2,1.5,'#9fe3ab',true);s.line(13,13,16,16,'#4cb05f');
  return s.outline('#1f5a2c');}
function brush(){const s=new Spr(28,16);
  s.rect(13,6,12,4,'#78c9bb');s.ell(25,8,2,2,'#78c9bb');s.rect(13,6,12,1,'#a6e2d6');
  s.ell(8,8,7.5,6.5,'#f1e2c6');s.ell(8,8,6,5,'#f7ecd6');
  s.ell(8,9.5,2.4,1.8,'#a8694a');s.px(5,7,'#a8694a');s.px(7,6,'#a8694a');s.px(9,6,'#a8694a');s.px(11,7,'#a8694a');
  return s.outline('#4a7f76');}
function plush(){const s=new Spr(28,26);
  s.poly([[9,6],[10,1],[13,5]],'#f77fa8');s.poly([[12,5],[14,0],[17,5]],'#f77fa8');s.poly([[16,6],[18,1],[20,7]],'#f77fa8');
  s.poly([[17,19],[25,15],[26,21],[24,23]],'#8e44ad');
  s.ell(13,20,7,3.5,'#9ccc6e');s.ell(13,20,7,1.5,'#b5de88');
  s.ell(14,12,7.5,6.5,'#b9794a');
  s.ell(7,7,2.5,2.5,'#9c6038');s.ell(21,7,2.5,2.5,'#9c6038');
  s.ell(14,14,3.5,2.5,'#e8c9a2');s.rect(13,13,2,1,'#2a1b17');
  s.px(10,11,'#2a1b17');s.px(18,11,'#2a1b17');
  return s.outline('#4a2c19');}
function house(){const s=new Spr(48,42);
  s.rect(8,17,32,23,'#f8f0e3');s.rect(34,17,6,23,'#e9ddc9');
  s.poly([[3,18],[24,4],[45,18]],'#f4b7a0');
  s.poly([[24,4],[45,18],[24,18]],'#ecA791',c=>c!==null);
  s.rect(3,17,43,2,'#e69a83');
  s.rect(17,32,14,8,'#d2cabc');s.ell(24,32,7,8,'#d2cabc');s.ell(24,33,5.5,7,'#b9b2a5');s.rect(18.5,33,11,7,'#b9b2a5');
  s.ell(24,38,6,2,'#f4b9a6');
  s.ell(24,22.5,1.8,1.4,'#b0703f');s.px(21,20,'#b0703f');s.px(23,19,'#b0703f');s.px(25,19,'#b0703f');s.px(27,20,'#b0703f');
  s.ell(34,37,2,2,'#4caf50');s.line(33,36,35,38,'#2f7d3a');
  return s.outline('#6e5a4a');}
function windowSpr(night){const s=new Spr(36,36);
  s.rect(1,1,34,34,'#f3ece0');
  s.rect(4,4,28,28,night?'#1c2a56':'#a9d6f5');
  if(night){s.ell(11,11,3.6,3.6,'#ffe98a');s.ell(12.5,9.5,3,3,'#1c2a56');
    [[22,9],[26,15],[8,22],[22,24],[17,6],[28,26]].forEach(p=>{s.px(p[0],p[1],'#fff');});s.px(22,8,'#cfe');s.px(21,9,'#cfe');s.px(23,9,'#cfe');s.px(22,10,'#cfe');}
  else{s.ell(12,10,5,2.5,'#fff');s.ell(10,11,3,2,'#fff');s.ell(25,22,5,2.2,'#fff');s.ell(27,23,3,2,'#fff');}
  s.rect(17,4,2,28,'#f3ece0');s.rect(4,17,28,2,'#f3ece0');
  s.rect(0,33,36,3,'#d8cdb8');
  return s.outline('#6e5a4a');}
function bed(front){const s=new Spr(62,28);
  const OUT=(i,j)=>{const dx=(i+.5-31)/29,dy=(j+.5-16)/11;return dx*dx+dy*dy<=1;};
  const INN=(i,j)=>{const dx=(i+.5-31)/22,dy=(j+.5-13)/6.5;return dx*dx+dy*dy<=1;};
  s.ell(31,17,29,11,'#e89b2a');s.ell(31,15,29,10.5,'#ffc552');
  for(let j=0;j<28;j++)for(let i=0;i<62;i++){if(s.get(i,j)&&(i%7===0||j%6===0))s.px(i,j,'#fff1c7');}
  s.ell(31,13,22,6.5,'#a8683a');s.ell(31,12.5,19,4.5,'#bd8250');
  [[22,13],[30,15],[38,12],[27,10],[35,15],[44,13]].forEach(p=>s.px(p[0],p[1],'#8a5230'));
  if(front){for(let j=0;j<28;j++)for(let i=0;i<62;i++){const v=s.get(i,j);if(v&&(j<15||INN(i,j)))s.b[j*62+i]=null;}}
  return s.outline('#6a4216');}
function paw(){const s=new Spr(15,14);
  s.ell(7.5,9.5,4,3.5,'#fff');s.ell(2.5,5.5,1.8,2.2,'#fff');s.ell(5.5,2.8,1.8,2.2,'#fff');s.ell(9.5,2.8,1.8,2.2,'#fff');s.ell(12.5,5.5,1.8,2.2,'#fff');
  return s.outline('#a9c4db');}
function bubble(){const s=new Spr(18,18);
  s.ell(8.5,8,7,7,'#fff');s.poly([[10,12],[13,17],[6,14]],'#fff');
  s.px(8,4,'#7a7a88');s.px(8,7,'#7a7a88');s.px(8,10,'#7a7a88');
  return s.outline('#2b2b35');}

const S={};
function reg(k,s){S[k]={url:s.url(),w:s.w,h:s.h};}
['sad','soft','happy','angry','tired','sleep'].forEach(m=>reg('dog_'+m,dog(m,false)));
reg('dtail',(()=>{const t=new Spr(14,15);t.poly([[2,1],[11,10],[8,12],[1,8]],'#3b2a25');return t.outline('#1f1512');})());
reg('dfoot',(()=>{const t=new Spr(8,6);t.ell(4,3,3,2,'#8e5238');t.px(3,2,'#a8694a');return t.outline('#1f1512');})());
reg('radio',radio());reg('bone',bone());reg('food',food());reg('bowl',bowl('empty'));reg('bowlE',bowl('empty'));reg('bowlH',bowl('half'));reg('bowlF',bowl('full'));reg('water',bowl('water'));reg('waterH',bowl('waterH'));reg('arm',arm());
reg('ball',ball());reg('brush',brush());reg('plush',plush());reg('house',house());
reg('winDay',windowSpr(false));reg('winNight',windowSpr(true));
reg('bed',bed(false));reg('bedFront',bed(true));reg('paw',paw());reg('bubble',bubble());
reg('heart',rows(['.rr.rr.','rwrrrrr','rrrrrrr','.rrrrr.','..rrr..','...r...'],{r:'#ff4d6d',w:'#ffc2d1'},'#7a1630'));
reg('note',rows(['..bbb','..b.b','..b..','..b..','.bb..','bbb..','.b...'],{b:'#6a7bff'},'#25307a'));
reg('drop',rows(['..b..','.bbb.','bbwbb','bbbbb','.bbb.'],{b:'#4fb3ff',w:'#d7f0ff'},'#1d5a8f'));
reg('sparkle',rows(['..y..','..y..','yywyy','..y..','..y..'],{y:'#ffd93b',w:'#fff'},'#b0801a'));
reg('star',rows(['...y...','..yyy..','yyyyyyy','.yyyyy.','.yy.yy.'],{y:'#ffd93b'},'#b0801a'));
reg('kibble',rows(['.b.','bbb','.b.'],{b:'#8a5a2b'},'#3a2210'));
reg('anger',rows(['r.r.r','.rrr.','rrrrr','.rrr.','r.r.r'],{r:'#e02b2b'},'#6a0f0f'));

function mkDog(){const b=document.createElement('div');b.className='dogbody';
  const m=im('dog_sad','main');b.append(im('dtail','tail'),m,im('dfoot','foot fl'),im('dfoot','foot fr'));return{b:b,m:m};}
function im(key,cls){const i=new Image();i.src=S[key].url;i.className='px'+(cls?' '+cls:'');i.draggable=false;i.style.setProperty('--w',S[key].w);return i;}

/* ================= AUDIO ================= */
let AC=null;
function audio(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){}}
function tone(f,t,type,v,delay){if(!AC)return;try{const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.value=f;
  const st=AC.currentTime+(delay||0);g.gain.setValueAtTime(v||.04,st);g.gain.exponentialRampToValueAtTime(.0001,st+t);o.connect(g);g.connect(AC.destination);o.start(st);o.stop(st+t+.02);}catch(e){}}
function seq(a,t,type,v){a.forEach((f,i)=>tone(f,t,type,v,i*t*.9));}

/* ================= LAYOUT / SCALE ================= */
function fit(){
  const W=innerWidth,H=innerHeight,land=W>=H;
  let P=land?Math.floor(Math.min(.36*H/42,.30*W/46)):Math.floor(Math.min(.40*W/46,.18*H/42));
  P=Math.max(2,P);
  let P3=Math.min(Math.round(P*1.5),Math.floor(.9*W/62),Math.floor(.6*H/42));P3=Math.max(P,P3);
  root.style.setProperty('--p',P);root.style.setProperty('--p3',P3);
}
fit();addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));

/* ================= COVER ================= */

/* ================= ROOM BUILDER ================= */
const ITEMS=[
  {id:'radio',p:[14,71],l:[8,74],fx:'music'},
  {id:'food', p:[34,71],l:[21,74],fx:'eat'},
  {id:'water',p:[54,71],l:[68,76],fx:'drink'},
  {id:'bone', p:[14,94],l:[12,95],fx:'chew',rot:-25},
  {id:'bowl', p:[36,94],l:[26,95],fx:'eat'},
  {id:'brush',p:[60,94],l:[73,95],fx:'brush',rot:-12},
  {id:'ball', p:[84,90],l:[86,93],fx:'play'},
  {id:'plush',p:[82,72],l:[89,76],fx:'hug',off:-36}
];
const HOUSE={p:[82,72],l:[89,76]};
function place(el,it){el.style.setProperty('--px',it.p[0]);el.style.setProperty('--py',it.p[1]);el.style.setProperty('--lx',it.l[0]);el.style.setProperty('--ly',it.l[1]);
  if(it.off)el.style.setProperty('--off','calc(var(--p)*'+it.off+'px)');}
function buildRoom(page,interactive){
  const room=document.createElement('div');room.className='room';
  room.innerHTML='<div class="wall"></div><div class="base"></div><div class="floor"></div>';
  room.appendChild(im('winDay','win'));room.appendChild(im('winNight','win night'));
  const h=document.createElement('div');h.className='item house static';place(h,HOUSE);h.appendChild(im('house'));room.appendChild(h);
  const els={};
  ITEMS.forEach(it=>{const el=document.createElement('div');el.className='item'+(interactive?'':' static');el.dataset.id=it.id;place(el,it);
    const img=im(it.id);if(it.rot)el.style.setProperty('--rot',it.rot+'deg');el.appendChild(img);room.appendChild(el);els[it.id]=el;});
  page.insertBefore(room,page.firstChild);
  return els;
}

/* ================= GAME ================= */
const p2=$('#p2'),p3=$('#p3'),hud=$('#hud'),barFill=$('#barFill');
hud.insertBefore(im('heart'),hud.firstChild);
const itemEls=buildRoom(p2,true);

const dogEl=document.createElement('div');dogEl.className='dog sad';
const dd=mkDog(),dogImg=dd.m,dogBody=dd.b;dogEl.appendChild(dogBody);
const bub=im('bubble','bubble');dogEl.appendChild(bub);
p2.appendChild(dogEl);

let happiness=0,temp=null,tempT=0,busy=false,angryUntil=0,used=new Set(),clicks=[],dragging=false;

function baseMood(){return happiness<30?'sad':happiness<65?'soft':'happy';}
function showMood(){const m=temp||baseMood();dogImg.src=S['dog_'+m].url;bub.style.display=(m==='sad')?'block':'none';
  dogEl.classList.toggle('angry',m==='angry');dogEl.classList.toggle('wag',m==='happy');dogEl.classList.toggle('sad',m==='sad');}
function setTemp(m,ms){temp=m;clearTimeout(tempT);tempT=setTimeout(()=>{temp=null;showMood();},ms);showMood();}
function anim(el,cls,ms){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms);}
function dogRect(){return dogEl.getBoundingClientRect();}

/* efek  */
const fxl=$('#fx');
function spawn(type,n,el){const r=(el||dogEl).getBoundingClientRect();
  for(let i=0;i<n;i++)setTimeout(()=>{const f=im(type,'fx');f.style.left=(r.left+r.width*(.2+Math.random()*.6))+'px';f.style.top=(r.top+r.height*(.05+Math.random()*.4))+'px';
    f.style.setProperty('--fx',((Math.random()-.5)*r.width*.5)+'px');fxl.appendChild(f);setTimeout(()=>f.remove(),1350);},i*110);}

function gain(n){happiness=Math.max(0,Math.min(100,happiness+n));barFill.style.width=happiness+'%';
  hud.classList.remove('pop');void hud.offsetWidth;if(n>0)hud.classList.add('pop');
  showMood();
  if(happiness>=100&&!busy)win();}

/* ================= PROPS & ACTS ================= */
const propsEl=document.createElement('div');propsEl.id='props';document.body.appendChild(propsEl);
let runTok=0,acting=false,bowlState='empty',petTotal=0,tuneG=null;
const sleep=ms=>new Promise((res,rej)=>{const t=runTok;setTimeout(()=>t===runTok?res():rej('cancel'),ms);});
const P_=()=>parseFloat(getComputedStyle(root).getPropertyValue('--p'))||3;
function dogPt(x,y){const r=dogRect(),u=r.width/46;return{x:r.left+x*u,y:r.top+y*u};}
function ctr(el){const r=el.querySelector('img').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};}
function mkProp(key,x,y,rot){const d=document.createElement('div');d.className='prop';d.appendChild(im(key));
  d.style.left=x+'px';d.style.top=y+'px';if(rot)d.style.rotate=rot+'deg';propsEl.appendChild(d);return d;}
function moveProp(d,pt,ms,rot,sc){d.style.transition='left '+ms+'ms ease-in-out,top '+ms+'ms ease-in-out,rotate '+ms+'ms ease-in-out,scale '+ms+'ms ease-in-out';
  d.style.left=pt.x+'px';d.style.top=pt.y+'px';if(rot!==undefined)d.style.rotate=rot+'deg';if(sc!==undefined)d.style.scale=sc;}
function pose(o){o=o||{};const u=dogRect().width/46;
  dogBody.style.transition='translate .18s ease-out,rotate .18s ease-out';
  dogBody.style.translate=((o.x||0)*u)+'px '+((o.y||0)*u)+'px';
  dogBody.style.rotate=(o.r||0)+'deg';
  dogBody.style.scale=(o.fx?-1:1)+' '+(o.sy||1);}
function unpose(){dogEl.classList.remove('walk','batl','batr');dogBody.style.transition='translate .3s,rotate .3s,scale .3s';dogBody.style.translate='';dogBody.style.rotate='';dogBody.style.scale='';}
function setBowl(k){itemEls.bowl.querySelector('img').src=S[k].url;}
function setWater(k){itemEls.water.querySelector('img').src=S[k].url;}
function dropKib(x,y,toY){const k=mkProp('kibble',x,y);k.style.transition='top .35s ease-in';requestAnimationFrame(()=>{k.style.top=toY+'px';});setTimeout(()=>k.remove(),420);}
async function giveBack(pr,c){moveProp(pr,{x:c.hx,y:c.hy},420,c.rot,1);await sleep(430);pr.remove();}

/* snd */
function noise(dur,f,vol,type,delay){if(!AC)return;try{const n=Math.max(1,AC.sampleRate*dur|0),b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource();s.buffer=b;
  const fl=AC.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.value=f;const g=AC.createGain();g.gain.value=vol;
  s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start(AC.currentTime+(delay||0));}catch(e){}}
function sweep(f0,f1,dur,type,vol,delay){if(!AC)return;try{const o=AC.createOscillator(),g=AC.createGain(),st=AC.currentTime+(delay||0);
  o.type=type||'sine';o.frequency.setValueAtTime(f0,st);o.frequency.exponentialRampToValueAtTime(f1,st+dur);
  g.gain.setValueAtTime(vol||.04,st);g.gain.exponentialRampToValueAtTime(.0001,st+dur+.02);o.connect(g);g.connect(AC.destination);o.start(st);o.stop(st+dur+.04);}catch(e){}}
function squeak(){sweep(760,1900,.07,'square',.03);sweep(1900,1100,.1,'square',.026,.07);sweep(1520,2300,.07,'triangle',.02);}
function crunch(){noise(.07,1800,.09,'bandpass');sweep(180,90,.07,'square',.04);}
function slurp(){sweep(500,900,.09,'sine',.05);sweep(900,520,.1,'sine',.04,.09);noise(.08,3500,.025,'highpass',.04);}
function swish(){noise(.22,4200,.05,'highpass');}
function note(f,t,d,type,v){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(tuneG);o.start(t);o.stop(t+d+.02);}
function tune(){if(!AC)return;try{tuneG=AC.createGain();tuneG.gain.value=1;tuneG.connect(AC.destination);const st=AC.currentTime+.05;
  const mel=[523,659,784,659,523,659,784,1047,880,784,659,784,698,880,1047,880];
  for(let r=0;r<2;r++)mel.forEach((f,i)=>{const t=st+(r*mel.length+i)*.18;note(f,t,.16,'square',.028);if(i%2===0)note(i%4===0?131:196,t,.17,'triangle',.07);});}catch(e){}}

/* ---------- animasyon ---------- */
const ACT={
  async brush(c){
    const pr=mkProp('brush',c.sx,c.sy,c.rot);await sleep(30);
    moveProp(pr,dogPt(34,22),380,-25,1);await sleep(400);
    setTemp('happy',3400);
    for(let i=0;i<8;i++){const a=i%2===0;
      moveProp(pr,dogPt(a?22:35,a?29:23),340,a?-8:-28,1);
      pose({r:a?-2:2,x:a?-.6:.6});swish();spawn('sparkle',1,null);if(i%2)spawn('heart',1,null);
      await sleep(380);}
    pose({});await giveBack(pr,c);return true;
  },
  async ball(c){
    const pr=mkProp('ball',c.sx,c.sy,0);await sleep(30);
    let bx=9;moveProp(pr,dogPt(bx,39),420,-200,1);await sleep(440);
    setTemp('happy',4600);
    const xs=[34,8,36,10,33,22];
    for(let i=0;i<xs.length;i++){const x=xs[i];
      dogEl.classList.add('walk');pose({x:(bx-22)*.7,r:bx>22?5:-5,fx:bx>22});await sleep(360);
      dogEl.classList.remove('walk');
      anim(dogEl,i%2?'batr':'batl',380);sweep(300,520,.08,'square',.04);await sleep(170);
      moveProp(pr,dogPt(x,39),520,(i+1)*340,1);bx=x;sweep(500,820,.1,'square',.03);spawn(i%2?'star':'heart',1,null);
      await sleep(430);}
    dogEl.classList.add('walk');pose({x:0});await sleep(400);dogEl.classList.remove('walk');
    pose({});spawn('heart',3,null);await giveBack(pr,c);return true;
  },
  async plush(c){
    const pr=mkProp('plush',c.sx,c.sy,0);pr.style.scale='1';await sleep(30);
    moveProp(pr,dogPt(22,36),420,0,.78);await sleep(450);
    const aL=mkProp('arm',0,0,35),aR=mkProp('arm',0,0,-35);aR.querySelector('img').style.transform='scaleX(-1)';
    const pl=dogPt(11,34),pr2=dogPt(33,34);aL.style.left=pl.x+'px';aL.style.top=pl.y+'px';aR.style.left=pr2.x+'px';aR.style.top=pr2.y+'px';
    setTemp('happy',3800);
    for(let i=0;i<8;i++){const a=i%2===0;
      pose({r:a?-3:3,y:.4});pr.style.transition='scale .3s,rotate .3s';pr.style.scale=a?.7:.8;pr.style.rotate=(a?4:-4)+'deg';
      if(a)sweep(700,980,.12,'sine',.035);spawn('heart',1,null);await sleep(440);}
    pose({});aL.remove();aR.remove();await giveBack(pr,c);return true;
  },
  async chew(c){
    const pr=mkProp('bone',c.sx,c.sy,c.rot);await sleep(30);
    moveProp(pr,dogPt(21,29),420,-6,1);await sleep(450);
    setTemp('happy',3400);
    for(let i=0;i<6;i++){
      pr.style.transition='scale .1s';pr.style.scale='1.3 .55';pose({y:1.2,r:i%2?3:-3,sy:.95});squeak();
      if(i%2)spawn('sparkle',1,null);await sleep(170);
      pr.style.scale='.92 1.15';pose({y:-.2,r:0});await sleep(260);}
    pr.style.scale='1';pose({});spawn('heart',3,null);await giveBack(pr,c);return true;
  },
  async bowl(c){
    const empty=bowlState==='empty';
    const pr=mkProp(empty?'bowlE':'bowlF',c.sx,c.sy,0);await sleep(30);
    moveProp(pr,dogPt(22,39),420,0,1);await sleep(450);
    if(empty){setTemp('sad',1900);pose({r:8,y:2});await sleep(300);
      for(let i=0;i<3;i++){tone(210-i*25,.12,'triangle',.05);pose({r:i%2?5:9,y:2});await sleep(280);}
      pose({});await sleep(250);await giveBack(pr,c);return false;}
    setTemp('happy',3200);const img=pr.querySelector('img');
    for(let i=0;i<7;i++){pose({r:13,y:2.6,x:-1,sy:.94});crunch();await sleep(190);pose({r:6,y:.5});if(i%2===0)spawn('kibble',1,null);
      if(i===2)img.src=S.bowlH.url;if(i===5)img.src=S.bowlE.url;await sleep(240);}
    bowlState='empty';setBowl('bowlE');pose({});spawn('heart',3,null);await giveBack(pr,c);return true;
  },
  async water(c){
    const pr=mkProp('water',c.sx,c.sy,0);await sleep(30);
    moveProp(pr,dogPt(22,39),420,0,1);await sleep(450);
    setTemp('happy',3200);const img=pr.querySelector('img');
    for(let i=0;i<6;i++){pose({r:13,y:2.6,x:-1,sy:.94});slurp();spawn('drop',1,null);await sleep(220);pose({r:7,y:.8});
      if(i===2)img.src=S.waterH.url;await sleep(240);}
    img.src=S.water.url;pose({});spawn('heart',3,null);await giveBack(pr,c);return true;
  },
  async radio(c){
    const el=c.el;await sleep(450);el.classList.add('pulse');tune();setTemp('happy',5900);
    for(let i=0;i<16;i++){const a=i%2===0;
      pose({x:a?-2.2:2.2,y:i%4<2?-2:0,r:a?-9:9,fx:Math.floor(i/4)%2===1,sy:a?1:.96});
      if(a)anim(dogEl,'hop',360);spawn('note',1,el);if(i%3===0)spawn('heart',1,null);await sleep(360);}
    el.classList.remove('pulse');pose({});return true;
  },
  async sniff(c){
    const pr=mkProp('food',c.sx,c.sy,0);await sleep(30);
    moveProp(pr,dogPt(35,24),380,10,1);await sleep(400);
    setTemp('soft',1900);
    pose({r:-5,y:-1,x:1});tone(520,.08,'square',.04);await sleep(450);
    pose({r:4,y:1});tone(230,.1,'sawtooth',.05);await sleep(400);
    pose({r:-4,y:-1});await sleep(380);pose({});
    if(bowlState==='empty')spawn('sparkle',3,itemEls.bowl);
    await giveBack(pr,c);return 'small';
  },
  async pour(c){
    const P=P_(),B=ctr(itemEls.bowl),hold={x:B.x+13.5*P,y:B.y-17.6*P};
    const pr=mkProp('food',c.sx,c.sy,0);await sleep(30);
    moveProp(pr,hold,430,0,1);await sleep(460);
    moveProp(pr,hold,380,-105,1);await sleep(400);
    const mouth={x:B.x,y:B.y-14*P};
    for(let i=0;i<14;i++){
      dropKib(mouth.x+(Math.random()-.5)*4*P,mouth.y,B.y-4*P);
      if(i===4)setBowl('bowlH');if(i===9)setBowl('bowlF');
      noise(.06,2600,.06);pr.style.transition='rotate .1s';pr.style.rotate=(i%2?-98:-108)+'deg';
      await sleep(110);}
    await sleep(160);bowlState='full';setBowl('bowlF');spawn('sparkle',4,itemEls.bowl);sweep(600,1200,.15,'sine',.04);
    moveProp(pr,hold,350,0,1);await sleep(370);
    await giveBack(pr,c);return 'pour';
  }
};
const ACTNAME={radio:'radio',food:'sniff',bowl:'bowl',water:'water',bone:'chew',brush:'brush',ball:'ball',plush:'plush'};

async function doAct(it,el,sx,sy,hx,hy,name){
  acting=true;const c={el,sx,sy,hx,hy,rot:it.rot||0};
  const keep=name==='radio';
  if(keep){el.classList.add('back');setTimeout(()=>el.classList.remove('back'),420);}else el.classList.add('gone');
  let g=false;
  try{g=await ACT[name](c);}catch(err){if(err==='cancel')return;console.error(err);propsEl.innerHTML='';}
  el.classList.remove('gone');if(!keep)anim(el,'pop',340);
  unpose();acting=false;
  if(g==='small')gain(3);
  else if(g==='pour'){gain(used.has('pour')?0:5);used.add('pour');}
  else if(g){const first=!used.has(it.id);used.add(it.id);gain(first?15:6);}
}

/* drag & drop */
Object.keys(itemEls).forEach(id=>{
  const el=itemEls[id],it=ITEMS.find(x=>x.id===id);let sx=0,sy=0,act=false;
  el.addEventListener('pointerdown',e=>{if(busy||acting)return;audio();act=true;dragging=true;sx=e.clientX;sy=e.clientY;
    el.setPointerCapture(e.pointerId);el.classList.remove('back');el.classList.add('drag');
    el.style.setProperty('--dx','0px');el.style.setProperty('--dy','0px');e.preventDefault();});
  el.addEventListener('pointermove',e=>{if(!act)return;
    el.style.setProperty('--dx',(e.clientX-sx)+'px');el.style.setProperty('--dy',(e.clientY-sy)+'px');
    const tb=id==='food'&&bowlState==='empty'&&overBowl(el);
    itemEls.bowl.style.filter=tb?'brightness(1.3) drop-shadow(0 0 6px #fff)':'';
    dogEl.style.filter=(!tb&&overDog(el))?'brightness(1.12)':'';});
  const end=e=>{if(!act)return;act=false;dragging=false;dogEl.style.filter='';itemEls.bowl.style.filter='';
    const toBowl=id==='food'&&bowlState==='empty'&&overBowl(el);
    const toDog=!toBowl&&overDog(el);
    const a=el.querySelector('img').getBoundingClientRect(),spx=a.left+a.width/2,spy=a.top+a.height/2;
    el.classList.remove('drag');
    el.style.setProperty('--dx','0px');el.style.setProperty('--dy','0px');
    if((toBowl||toDog)&&!busy&&!acting&&performance.now()>=angryUntil){
      const b=el.querySelector('img').getBoundingClientRect();
      doAct(it,el,spx,spy,b.left+b.width/2,b.top+b.height/2,toBowl?'pour':ACTNAME[id]);
    }else{
      el.classList.add('back');setTimeout(()=>el.classList.remove('back'),420);
      if(toDog){tone(140,.2,'sawtooth',.05);anim(dogEl,'poke',250);}
    }};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
});
function overDog(el){const a=el.querySelector('img').getBoundingClientRect(),d=dogRect();
  const cx=a.left+a.width/2,cy=a.top+a.height/2,mx=d.width*.12,my=d.height*.12;
  return cx>d.left-mx&&cx<d.right+mx&&cy>d.top-my&&cy<d.bottom+my;}
function overBowl(el){const a=el.querySelector('img').getBoundingClientRect(),b=itemEls.bowl.querySelector('img').getBoundingClientRect();
  const cx=a.left+a.width/2,cy=a.top+a.height/2,mx=b.width*.55,my=b.height*1.4;
  return cx>b.left-mx&&cx<b.right+mx&&cy>b.top-my&&cy<b.bottom+my;}

/* angwy */
let down=null;
dogEl.addEventListener('pointerdown',e=>{audio();down={x:e.clientX,y:e.clientY,t:performance.now()};});
dogEl.addEventListener('pointerup',e=>{if(!down)return;const dt=performance.now()-down.t,d=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(dt<380&&d<14)poke();});
function poke(){if(busy||acting)return;const now=performance.now();clicks=clicks.filter(t=>now-t<2000);clicks.push(now);
  if(clicks.length>=5){clicks=[];mad();}else{anim(dogEl,'poke',250);tone(320,.06,'square',.04);}}
function mad(){angryUntil=performance.now()+2400;setTemp('angry',2400);spawn('anger',3,null);seq([160,130,160,120],.12,'sawtooth',.05);gain(-10);}

/* (pat pat) */
let pts=[],petCool=0;
function inHead(e){const r=dogRect();return e.clientX>r.left+r.width*.06&&e.clientX<r.right-r.width*.03&&e.clientY>r.top-r.height*.05&&e.clientY<r.top+r.height*.64;}
dogEl.addEventListener('pointermove',e=>{
  if(busy||acting||dragging||performance.now()<angryUntil||!inHead(e)){pts=[];return;}
  const now=performance.now();pts.push({x:e.clientX,y:e.clientY,t:now});
  while(pts.length&&now-pts[0].t>1000)pts.shift();
  let len=0,rx=0,ry=0,lx=0,ly=0;
  for(let i=1;i<pts.length;i++){const dx=pts[i].x-pts[i-1].x,dy=pts[i].y-pts[i-1].y;len+=Math.abs(dx)+Math.abs(dy);
    if(Math.abs(dx)>1.2){const s=Math.sign(dx);if(lx&&s!==lx)rx++;lx=s;}
    if(Math.abs(dy)>1.2){const s=Math.sign(dy);if(ly&&s!==ly)ry++;ly=s;}}
  if(Math.max(rx,ry)>=2&&len>dogRect().width*.4&&now>petCool){pts=[];petCool=now+380;pet();}
});
dogEl.addEventListener('pointerleave',()=>{pts=[];});
function pet(){if(busy||acting||performance.now()<angryUntil)return;spawn('heart',3,null);setTemp('happy',1400);anim(dogEl,'nod',480);
  tone(800+Math.random()*300,.09,'sine',.05);if(petTotal<20){petTotal+=2;gain(2);}}

/* yippie */
function win(){busy=true;setTemp('happy',4000);spawn('heart',6,null);spawn('star',6,null);seq([523,659,784,1047],.13,'square',.05);
  setTimeout(()=>{show(p3);ending();},1500);}

/* ================= ENDING ================= */
const bedwrap=$('#bedwrap');
const bedBack=im('bed','bed'),bedFront=im('bedFront','bed front');
const d3wrap=document.createElement('div');d3wrap.className='dog3';
const dd3=mkDog(),d3=dd3.m;d3wrap.appendChild(dd3.b);
const zzz=document.createElement('div');zzz.className='zzz';zzz.innerHTML='<b>Z</b><b>Z</b><b>Z</b>';d3wrap.appendChild(zzz);
bedwrap.append(bedBack,d3wrap,bedFront);
const e3=buildRoom(p3,false);e3.bowl.querySelector('img').src=S.bowlF.url;
let timers=[],hearts=0;
function later(fn,ms){timers.push(setTimeout(fn,ms));}
function ending(){
  timers.forEach(clearTimeout);timers=[];clearInterval(hearts);
  p3.classList.remove('night','bed','sleeping','showbtn');
  d3.src=S.dog_happy.url;d3wrap.classList.remove('sleeping');d3wrap.classList.add('hoploop');
  hearts=setInterval(()=>{spawn('heart',1,d3);spawn(Math.random()<.5?'star':'sparkle',1,d3);},520);
  later(()=>seq([523,659,784,659,784,1047],.14,'square',.04),500);
  later(()=>{clearInterval(hearts);d3wrap.classList.remove('hoploop');d3.src=S.dog_tired.url;},3300);
  later(()=>{p3.classList.add('night');seq([392,330,262],.3,'sine',.04);},3700);
  later(()=>{p3.classList.add('bed');},4300);
  later(()=>{d3.src=S.dog_sleep.url;d3wrap.classList.add('sleeping');p3.classList.add('sleeping');},6000);
  later(()=>{p3.classList.add('showbtn');},9000);
}

/* ================= NAVIGASI ================= */
function show(page){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));page.classList.add('active');}
function resetGame(){runTok++;acting=false;propsEl.innerHTML='';unpose();bowlState='empty';petTotal=0;pts=[];setBowl('bowlE');setWater('water');try{tuneG&&(tuneG.gain.value=0);}catch(e){}
  Object.values(itemEls).forEach(e=>e.classList.remove('gone','pulse','drag'));
  happiness=0;used=new Set();busy=false;angryUntil=0;clicks=[];temp=null;clearTimeout(tempT);barFill.style.width='0%';showMood();}
$('#playBtn').addEventListener('click',()=>{audio();seq([523,784],.1,'square',.05);resetGame();show(p2);});
$('#replayBtn').addEventListener('click',()=>{audio();timers.forEach(clearTimeout);clearInterval(hearts);resetGame();show(p2);});
showMood();
})();