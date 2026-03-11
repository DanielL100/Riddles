// ============================================================
// STATE
// ============================================================
let wifi=false, encDl=false, decRestored=false, myLifeUnlocked=false;
let decSelFile=null, fpCb=null, fpSelPath=null, fpPath='C:\\';
let expHist=['C:\\'], expHistIdx=0, expPath='C:\\';
let expView='icons', expSort='name', expSortAsc=true;
let brHist=[], brHistIdx=-1;
let visitedLinks=new Set();
let fCtxTarget=null, recycleCtxItem=null;
let calcExpr='', calcRes=false;
let npFile=null, npFontSz=13;
let expSelected=new Set();
let recycleItems=[];
let gameAnimId=null, mlAnimId=null;

// Keyboard language detection (fix #22)
document.addEventListener('keydown', e => {
  if (e.key && e.key.length === 1)
    document.getElementById('langInd').textContent = /[\u05D0-\u05EA]/.test(e.key) ? 'HE' : 'EN';
});

// Clock
function tick() {
  const n = new Date();
  document.getElementById('clk').textContent =
    n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0');
}
setInterval(tick, 1000); tick();

// ============================================================
// FILE SYSTEM
// ============================================================
const fsData = {
  'C:\\':{type:'dir',label:'Local Disk (C:)',children:['C:\\AppData','C:\\Desktop','C:\\Docs','C:\\Downloads','C:\\Images','C:\\Program Files','C:\\ProgramData','C:\\System','C:\\Temp','C:\\Users','C:\\Windows']},
  'C:\\AppData':{type:'dir',label:'AppData',children:[]},
  // Desktop synced with actual desktop icons — populated in initDesktop()
  'C:\\Desktop':{type:'dir',label:'Desktop',children:[
    'C:\\Desktop\\code.txt',
    'C:\\Desktop\\סל מחזור',
    'C:\\Desktop\\סייר הקבצים',
    'C:\\Desktop\\דפדפן',
    'C:\\Desktop\\פנקס רשימות',
    'C:\\Desktop\\אודות',
    'C:\\Desktop\\מחשבון',
  ]},
  'C:\\Desktop\\code.txt':{type:'file',label:'code.txt',ext:'txt',size:'1 KB',created:'03/03/2003',content:'אני חי מיום ליום,\nלאחר שהלכתי לא אשוב עוד,\nיש לי סדר זה די ברור,\nובלעדיי היו מאבדים את התחושת הזמן'},
  'C:\\Desktop\\סל מחזור':{type:'shortcut',label:'סל מחזור',ext:'lnk',size:'1 KB',created:'01/01/2003'},
  'C:\\Desktop\\סייר הקבצים':{type:'shortcut',label:'סייר הקבצים',ext:'lnk',size:'1 KB',created:'01/01/2003'},
  'C:\\Desktop\\דפדפן':{type:'shortcut',label:'דפדפן',ext:'lnk',size:'1 KB',created:'01/01/2003'},
  'C:\\Desktop\\פנקס רשימות':{type:'shortcut',label:'פנקס רשימות',ext:'lnk',size:'1 KB',created:'01/01/2003'},
  'C:\\Desktop\\אודות':{type:'shortcut',label:'אודות',ext:'lnk',size:'1 KB',created:'01/01/2003'},
  'C:\\Desktop\\מחשבון':{type:'shortcut',label:'מחשבון',ext:'lnk',size:'1 KB',created:'01/01/2003'},
  // Docs: sequential dates so sorting by date reveals the password hitman47
  'C:\\Docs':{type:'dir',label:'Docs',children:['C:\\Docs\\h','C:\\Docs\\i','C:\\Docs\\t','C:\\Docs\\m','C:\\Docs\\a','C:\\Docs\\n','C:\\Docs\\4','C:\\Docs\\7']},
  'C:\\Docs\\h':{type:'file',label:'h',ext:'txt',size:'1 KB',created:'01/01/2003',content:'h'},
  'C:\\Docs\\i':{type:'file',label:'i',ext:'txt',size:'1 KB',created:'02/01/2003',content:'i'},
  'C:\\Docs\\t':{type:'file',label:'t',ext:'txt',size:'1 KB',created:'03/01/2003',content:'t'},
  'C:\\Docs\\m':{type:'file',label:'m',ext:'txt',size:'1 KB',created:'04/01/2003',content:'m'},
  'C:\\Docs\\a':{type:'file',label:'a',ext:'txt',size:'1 KB',created:'05/01/2003',content:'a'},
  'C:\\Docs\\n':{type:'file',label:'n',ext:'txt',size:'1 KB',created:'06/01/2003',content:'n'},
  'C:\\Docs\\4':{type:'file',label:'4',ext:'txt',size:'1 KB',created:'07/01/2003',content:'4'},
  'C:\\Docs\\7':{type:'file',label:'7',ext:'txt',size:'1 KB',created:'08/01/2003',content:'7'},
  'C:\\Downloads':{type:'dir',label:'Downloads',children:[]},
  'C:\\Images':{type:'dir',label:'Images',children:['C:\\Images\\rainbow.img','C:\\Images\\sunset.img','C:\\Images\\mountains.img','C:\\Images\\forest.img','C:\\Images\\city_night.img']},
  'C:\\Images\\rainbow.img':{type:'file',label:'rainbow',ext:'img',size:'2.1 MB',created:'15/03/2003',imgKey:'rainbow'},
  'C:\\Images\\sunset.img':{type:'file',label:'sunset',ext:'img',size:'1.8 MB',created:'20/04/2003',imgKey:'sunset'},
  'C:\\Images\\mountains.img':{type:'file',label:'mountains',ext:'img',size:'3.2 MB',created:'10/05/2003',imgKey:'mountains'},
  'C:\\Images\\forest.img':{type:'file',label:'forest',ext:'img',size:'2.7 MB',created:'22/06/2003',imgKey:'forest'},
  'C:\\Images\\city_night.img':{type:'file',label:'city_night',ext:'img',size:'2.4 MB',created:'08/07/2003',imgKey:'city_night'},
  'C:\\Program Files':{type:'dir',label:'Program Files',children:['C:\\Program Files\\Internet Explorer','C:\\Program Files\\Accessories','C:\\Program Files\\My Life']},
  'C:\\Program Files\\Internet Explorer':{type:'dir',label:'Internet Explorer',children:[]},
  'C:\\Program Files\\Accessories':{type:'dir',label:'Accessories',children:[]},
  'C:\\Program Files\\My Life':{type:'dir',label:'My Life',children:[]},
  'C:\\ProgramData':{type:'dir',label:'ProgramData',children:[]},
  'C:\\System':{type:'dir',label:'System',children:[]},
  'C:\\Temp':{type:'dir',label:'Temp',children:[]},
  'C:\\Users':{type:'dir',label:'Users',children:['C:\\Users\\Agent67']},
  'C:\\Users\\Agent67':{type:'dir',label:'Agent67',children:[]},
  'C:\\Windows':{type:'dir',label:'Windows',children:['C:\\Windows\\System32']},
  'C:\\Windows\\System32':{type:'dir',label:'System32',children:[]},
};

function getFName(p){ return p.split('\\').pop(); }
function getParent(p){ const pts=p.split('\\'); pts.pop(); return pts.join('\\')||'C:\\'; }
function getFileIcon(n,p){
  if(!n) return '📄';
  if(n.type==='dir') return '📁';
  if(n.type==='shortcut') return '🔗';
  const e=(n.ext||'').toLowerCase();
  if(e==='txt') return '📄';
  if(e==='exe') return '⚙️';
  if(e==='img') return '🖼️';
  return '📄';
}

// SVG art for images
function getImgSvg(node){
  const k = node && node.imgKey;
  const svgs = {
    rainbow:`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340">
      <defs><linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#cce8ff"/></linearGradient></defs>
      <rect width="480" height="340" fill="url(#rsky)"/>
      <rect x="0" y="240" width="480" height="100" fill="#4CAF50"/>
      <path d="M240,340 Q240,60 520,170" fill="none" stroke="#FF0000" stroke-width="20" opacity=".85"/>
      <path d="M240,340 Q240,80 510,175" fill="none" stroke="#FF7700" stroke-width="17" opacity=".85"/>
      <path d="M240,340 Q240,100 500,180" fill="none" stroke="#FFFF00" stroke-width="14" opacity=".85"/>
      <path d="M240,340 Q240,120 490,185" fill="none" stroke="#00CC00" stroke-width="11" opacity=".85"/>
      <path d="M240,340 Q240,140 480,190" fill="none" stroke="#0000FF" stroke-width="9" opacity=".85"/>
      <path d="M240,340 Q240,160 470,195" fill="none" stroke="#8B00FF" stroke-width="7" opacity=".85"/>
      <circle cx="70" cy="55" r="28" fill="white" opacity=".9"/>
      <circle cx="105" cy="44" r="22" fill="white" opacity=".9"/>
    </svg>`,
    sunset:`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340">
      <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a4e"/><stop offset="60%" stop-color="#ff6600"/><stop offset="100%" stop-color="#ff3300"/></linearGradient></defs>
      <rect width="480" height="340" fill="url(#ssky)"/>
      <circle cx="240" cy="210" r="50" fill="#FFD700" opacity=".95"/>
      <ellipse cx="240" cy="270" rx="220" ry="8" fill="#ff4400" opacity=".35"/>
      <rect x="0" y="260" width="480" height="80" fill="#001a33"/>
    </svg>`,
    mountains:`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340">
      <defs><linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#cce8ff"/></linearGradient></defs>
      <rect width="480" height="340" fill="url(#msky)"/>
      <polygon points="0,340 110,110 230,340" fill="#7a8fa0"/>
      <polygon points="70,340 210,70 360,340" fill="#8fa0b0"/>
      <polygon points="200,340 340,100 480,340" fill="#6a7a8a"/>
      <polygon points="205,70 225,70 215,55" fill="white" opacity=".8"/>
      <rect x="0" y="305" width="480" height="35" fill="#3a7022"/>
    </svg>`,
    forest:`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340">
      <rect width="480" height="340" fill="#c8e6c9"/>
      <rect x="0" y="265" width="480" height="75" fill="#388e3c"/>
      <polygon points="30,265 60,145 90,265" fill="#2e7d32"/>
      <rect x="55" y="258" width="10" height="18" fill="#5d4037"/>
      <polygon points="100,265 135,135 170,265" fill="#2e7d32"/>
      <rect x="130" y="258" width="10" height="18" fill="#5d4037"/>
      <polygon points="175,265 210,130 245,265" fill="#388e3c"/>
      <rect x="205" y="258" width="10" height="18" fill="#5d4037"/>
      <polygon points="250,265 285,140 320,265" fill="#2e7d32"/>
      <rect x="280" y="258" width="10" height="18" fill="#5d4037"/>
      <polygon points="330,265 365,135 400,265" fill="#388e3c"/>
      <rect x="360" y="258" width="10" height="18" fill="#5d4037"/>
      <polygon points="395,265 430,145 465,265" fill="#2e7d32"/>
      <rect x="425" y="258" width="10" height="18" fill="#5d4037"/>
    </svg>`,
    city_night:`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340">
      <rect width="480" height="340" fill="#0a0a2e"/>
      <circle cx="380" cy="45" r="18" fill="#fffde7" opacity=".9"/>
      <rect x="20" y="185" width="42" height="155" fill="#1a237e"/>
      <rect x="80" y="160" width="38" height="180" fill="#1a237e"/>
      <rect x="140" y="148" width="50" height="192" fill="#283593"/>
      <rect x="205" y="172" width="34" height="168" fill="#1a237e"/>
      <rect x="255" y="142" width="55" height="198" fill="#1a237e"/>
      <rect x="325" y="165" width="42" height="175" fill="#283593"/>
      <rect x="385" y="155" width="46" height="185" fill="#1a237e"/>
      <rect x="440" y="178" width="28" height="162" fill="#1a237e"/>
      <rect x="25" y="205" width="6" height="8" fill="#ffe082" opacity=".9"/>
      <rect x="36" y="205" width="6" height="8" fill="#ffe082" opacity=".9"/>
      <rect x="25" y="220" width="6" height="8" fill="#ffe082" opacity=".5"/>
      <rect x="85" y="175" width="6" height="8" fill="#ffe082" opacity=".9"/>
      <rect x="97" y="175" width="6" height="8" fill="#ffe082" opacity=".6"/>
      <rect x="150" y="165" width="6" height="8" fill="#ffe082" opacity=".8"/>
      <rect x="162" y="165" width="6" height="8" fill="#ffe082" opacity=".4"/>
      <rect x="174" y="165" width="6" height="8" fill="#ffe082" opacity=".9"/>
      <rect x="265" y="160" width="6" height="8" fill="#ffe082" opacity=".7"/>
      <rect x="277" y="160" width="6" height="8" fill="#ffe082" opacity=".9"/>
      <rect x="289" y="175" width="6" height="8" fill="#ffe082" opacity=".5"/>
      <rect x="0" y="328" width="480" height="12" fill="#1a237e"/>
    </svg>`
  };
  return k && svgs[k] ? svgs[k] : null;
}

// ============================================================
// LOGIN
// ============================================================
function doLogin(){
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('desktop').style.display = 'block';
  // Pre-populate recycle bin with dec.exe
  recycleItems.push({
    path: 'C:\\Desktop\\dec.exe',
    node: {type:'file',label:'dec.exe',ext:'exe',size:'48 KB',created:'15/12/2002'},
    originalParent: 'C:\\Desktop'
  });
  initDesktop();
}

// ============================================================
// MODAL
// ============================================================
function showModal(title, msg, btns){
  const m=document.getElementById('modal'), o=document.getElementById('modalOv');
  const bList = btns || [{l:'אישור'}];
  const bs = bList.map((b,i) =>
    `<button id="mbtn${i}" style="padding:4px 16px;border:1px solid #999;cursor:pointer;font-size:12px;background:linear-gradient(180deg,${b.primary?'#b0c8ff,#5078e0':'#f0f0f0,#d0d0d0'});border-radius:2px;">${b.l}</button>`
  ).join('');
  m.innerHTML = `<h3>${title}</h3><p>${msg}</p><div style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;">${bs}</div>`;
  m.style.display='block'; o.style.display='block';
  bList.forEach((b,i) => {
    const btn=document.getElementById('mbtn'+i);
    if(btn) btn.onclick = () => { closeModal(); if(b.cb) b.cb(); };
  });
}
function closeModal(){
  document.getElementById('modal').style.display='none';
  document.getElementById('modalOv').style.display='none';
}
function showInput(title, lbl, cb, def){
  const m=document.getElementById('modal'), o=document.getElementById('modalOv');
  m.innerHTML = `<h3>${title}</h3>
    <p style="font-size:12px;margin-bottom:6px;">${lbl}</p>
    <input id="miIn" type="text" value="${(def||'').replace(/"/g,'&quot;')}"
      style="width:100%;border:1px solid #999;padding:4px 6px;font-size:12px;margin-bottom:10px;box-sizing:border-box;"/>
    <div style="display:flex;gap:6px;justify-content:flex-end;">
      <button id="miOk" style="padding:4px 14px;border:1px solid #999;cursor:pointer;font-size:12px;background:linear-gradient(180deg,#f0f0f0,#d0d0d0);">אישור</button>
      <button onclick="closeModal()" style="padding:4px 14px;border:1px solid #999;cursor:pointer;font-size:12px;background:linear-gradient(180deg,#f0f0f0,#d0d0d0);">ביטול</button>
    </div>`;
  m.style.display='block'; o.style.display='block';
  const ok=document.getElementById('miOk'), inp=document.getElementById('miIn');
  ok.onclick = () => { const v=inp.value; closeModal(); cb(v); };
  inp.onkeydown = e => { if(e.key==='Enter') ok.click(); };
  setTimeout(()=>{ if(inp){inp.focus();inp.select();} }, 50);
}

// ============================================================
// WINDOW MANAGEMENT
// ============================================================
function front(id){
  let mx=300;
  document.querySelectorAll('.win').forEach(w => {
    if(w.id!==id){ const z=parseInt(w.style.zIndex)||300; if(z>mx) mx=z; }
  });
  document.getElementById(id).style.zIndex = mx+1;
}
function openWin(id, tbId){
  const w=document.getElementById(id);
  w.style.display='flex'; front(id);
  if(tbId) addTb(id, tbId, w.querySelector('.wLabel').textContent);
  w.addEventListener('mousedown', ()=>front(id), {capture:true});
}
function closeWin(id, tbId){
  document.getElementById(id).style.display='none';
  if(tbId) rmTb(tbId);
}
function minWin(id, tbId){
  document.getElementById(id).style.display='none';
  if(tbId && tbItems[tbId]) tbItems[tbId].classList.remove('active');
}
const _restore={};
function maxWin(id){
  const w=document.getElementById(id);
  if(_restore[id]){
    const d=_restore[id];
    w.style.top=d.t; w.style.left=d.l; w.style.width=d.w; w.style.height=d.h;
    delete _restore[id];
  } else {
    _restore[id]={t:w.style.top,l:w.style.left,w:w.style.width,h:w.style.height};
    w.style.top='0'; w.style.left='0'; w.style.width='100%'; w.style.height='calc(100% - 30px)';
  }
}

// Taskbar
const tbItems={};
function addTb(wId, bId, lbl){
  if(tbItems[bId]) return;
  const c=document.getElementById('tbCenter'), b=document.createElement('div');
  b.className='tbItem active'; b.id=bId; b.textContent=lbl;
  b.onclick = () => {
    const w=document.getElementById(wId);
    if(w.style.display==='none'||w.style.display===''){w.style.display='flex';front(wId);b.classList.add('active');}
    else { w.style.display='none'; b.classList.remove('active'); }
  };
  c.appendChild(b); tbItems[bId]=b;
}
function rmTb(bId){ if(tbItems[bId]){ tbItems[bId].remove(); delete tbItems[bId]; } }

// Drag
function drag(e, id){
  if(e.target.classList.contains('wBtn')) return;
  front(id);
  const w=document.getElementById(id);
  const sx=e.clientX-w.offsetLeft, sy=e.clientY-w.offsetTop;
  const mv=e2=>{ w.style.left=(e2.clientX-sx)+'px'; w.style.top=(e2.clientY-sy)+'px'; };
  const up=()=>{ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); };
  document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up);
}

// Dropdown menus
function closeDrops(){
  document.querySelectorAll('.mDrop.show').forEach(d => {
    d.classList.remove('show');
    if(d.parentElement) d.parentElement.classList.remove('open');
  });
}
function toggleM(id, el){
  const d=document.getElementById(id), was=d.classList.contains('show');
  closeDrops();
  if(!was){ d.classList.add('show'); el.classList.add('open'); }
}
document.addEventListener('click', e => {
  if(!e.target.closest('.mItem') && !e.target.closest('.mBar')) closeDrops();
  if(!e.target.closest('#wifiMenu') && !e.target.closest('#wifiIco')) hideWifi();
  if(!e.target.closest('#brMenu') && !e.target.closest('[onclick*="toggleBrMenu"]')) hideBrMenu();
  if(!e.target.closest('.ctxMenu') && !e.target.closest('#deskCtxMenu') && !e.target.closest('.dicon')) hideAllCtx();
});

// ============================================================
// DESKTOP ICONS
// ============================================================
const iconDefs = [
  {id:'diRecycle', em:'🗑️', lbl:'סל מחזור',      dbl:()=>openRecycle()},
  {id:'diExp',     em:'📁', lbl:'סייר הקבצים',    dbl:()=>openExp('C:\\')},
  {id:'diBr',      em:'🌐', lbl:'דפדפן',           dbl:()=>openBr()},
  {id:'diNp',      em:'📝', lbl:'פנקס רשימות',    dbl:()=>openNp()},
  {id:'diAbout',   em:'ℹ️', lbl:'אודות',           dbl:()=>openAbout()},
  {id:'diCalc',    em:'🔢', lbl:'מחשבון',          dbl:()=>openCalc()},
  {id:'diCode',    em:'📄', lbl:'code.txt',        dbl:()=>openNp(fsData['C:\\Desktop\\code.txt'].content,'code.txt')},
];
function initDesktop(){
  const cont=document.getElementById('desktopIcons'); cont.innerHTML='';
  let x=12, y=12;
  iconDefs.forEach(def => {
    const d=createDicon(def,x,y); cont.appendChild(d);
    y+=90; if(y>window.innerHeight-120){ y=12; x+=82; }
  });
  makeIconsDraggable();
  document.getElementById('desktop').oncontextmenu = e => {
    if(e.target.closest('.dicon')||e.target.closest('.win')) return;
    e.preventDefault();
    const m=document.getElementById('deskCtxMenu');
    m.style.display='block'; m.style.left=e.clientX+'px'; m.style.top=e.clientY+'px';
  };
}
function createDicon(def, x, y){
  const d=document.createElement('div');
  d.className='dicon'; d.id=def.id;
  d.style.left=x+'px'; d.style.top=y+'px';
  d.innerHTML=`<div class="diconImg">${def.em}</div><div class="diconLabel">${def.lbl}</div>`;
  d.addEventListener('dblclick', def.dbl);
  return d;
}
function addDesktopIcon(def){
  if(document.getElementById(def.id)) return;
  const icons=document.querySelectorAll('.dicon');
  let maxY=12, lastX=12;
  icons.forEach(ic => {
    const cy=parseInt(ic.style.top)||12;
    if(cy+90>maxY){ maxY=cy+90; lastX=parseInt(ic.style.left)||12; }
  });
  if(maxY>window.innerHeight-110){ maxY=12; lastX+=82; }
  const d=createDicon(def,lastX,maxY);
  document.getElementById('desktopIcons').appendChild(d);
  makeIconsDraggable();
}
function addDecIcon(){ addDesktopIcon({id:'diDec',em:'🔓',lbl:'dec.exe',dbl:()=>openDecoder()}); }
function addDecTxtIcon(content){
  const ex=document.getElementById('diDecTxt'); if(ex) ex.remove();
  addDesktopIcon({id:'diDecTxt',em:'📄',lbl:'dec.txt',dbl:()=>openNp(content,'dec.txt')});
}
function addMyLifeIcon(){ addDesktopIcon({id:'diMyLife',em:'💫',lbl:'My Life',dbl:()=>openMyLife()}); }

function makeIconsDraggable(){
  document.querySelectorAll('.dicon').forEach(d => {
    d.onmousedown = e => {
      if(e.button!==0) return;
      e.stopPropagation();
      const sx=e.clientX-d.offsetLeft, sy=e.clientY-d.offsetTop;
      const mv=e2=>{
        d.style.left=Math.max(0,e2.clientX-sx)+'px';
        d.style.top=Math.max(0,Math.min(window.innerHeight-110,e2.clientY-sy))+'px';
      };
      const up=()=>{ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); };
      document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up);
    };
  });
}
function arrangeIcons(){ // fix #23
  hideCtx();
  const icons=[...document.querySelectorAll('.dicon')];
  icons.sort((a,b)=>a.querySelector('.diconLabel').textContent.localeCompare(b.querySelector('.diconLabel').textContent,'he'));
  let x=12,y=12;
  icons.forEach(ic=>{ ic.style.left=x+'px'; ic.style.top=y+'px'; y+=90; if(y>window.innerHeight-110){y=12;x+=82;} });
}
function refreshDesk(){ document.querySelectorAll('.dicon').forEach(d=>d.style.background=''); }
function hideCtx(){ document.getElementById('deskCtxMenu').style.display='none'; hideAllCtx(); }
function hideAllCtx(){ document.querySelectorAll('.ctxMenu').forEach(m=>m.style.display='none'); document.getElementById('deskCtxMenu').style.display='none'; }

// ============================================================
// WIFI
// ============================================================
function showWifiMenu(e){
  e.stopPropagation();
  const m=document.getElementById('wifiMenu');
  m.style.display = m.style.display==='block' ? 'none' : 'block';
  document.getElementById('wifiTogItem').textContent = wifi ? 'כבה WiFi' : 'הדלק WiFi';
}
function hideWifi(){ document.getElementById('wifiMenu').style.display='none'; }
function toggleWifi(){
  wifi=!wifi;
  const ic=document.getElementById('wifiIco');
  ic.textContent = wifi ? '📶' : '📵';
  ic.title = wifi ? 'WiFi מחובר' : 'WiFi מנותק';
  hideWifi();
  if(document.getElementById('brWin').style.display==='flex'){
    if(wifi) brShowSearch(); else brShowNoInternet();
  }
}

// ============================================================
// OPEN FUNCTIONS
// ============================================================
function openNp(content,name){
  openWin('npWin','npBtn');
  if(content!==undefined){
    document.getElementById('npArea').value=content;
    document.getElementById('npTitle').textContent='פנקס רשימות - '+(name||'ללא שם');
    npFile=name||null;
  }
}
function openAbout(){ openWin('aboutWin',''); }
function openCalc(){ openWin('calcWin','calcBtn'); buildCalc(); }
function openRecycle(){ openWin('recycleWin','recycleBtn'); renderRecycle(); }
function openExp(path){ openWin('expWin','expBtn'); expHist=[path||'C:\\']; expHistIdx=0; navTo(path||'C:\\'); }
function openBr(){ openWin('brWin','brBtn'); if(!wifi) brShowNoInternet(); else brShowSearch(); }
function openDisplaySettings(){ openWin('dispWin',''); }
function openMyLife(){ openWin('myLifeWin','myLifeBtn'); }
function openDecoder(){
  openWin('decWin','decBtn');
  document.getElementById('decFileLbl').textContent='לא נבחר קובץ';
  document.getElementById('decMsg').style.display='none';
  decSelFile=null;
}
function openImgViewer(path){
  openWin('imgWin','');
  const n=fsData[path];
  document.getElementById('imgTitle').textContent=(n&&n.label)||getFName(path);
  document.getElementById('imgBody').innerHTML=getImgSvg(n)||'<div style="color:#888;font-size:14px;text-align:center;">תמונה לא זמינה</div>';
}
