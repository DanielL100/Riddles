// ============================================================
// NOTEPAD
// ============================================================
function npNew(){ closeDrops(); document.getElementById('npArea').value=''; document.getElementById('npTitle').textContent='פנקס רשימות - ללא שם'; npFile=null; }
function npOpen(){
  closeDrops();
  openFP('פתיחת קובץ', p=>{
    const n=fsData[p]; if(!n||n.type==='dir') return;
    document.getElementById('npArea').value=n.content||'';
    document.getElementById('npTitle').textContent='פנקס רשימות - '+(n.label||getFName(p));
    npFile=p;
  });
}
function npSave(){
  closeDrops();
  if(!npFile){ npSaveAs(); return; }
  const n=fsData[npFile]; if(n) n.content=document.getElementById('npArea').value;
  showModal('שמירה','הקובץ נשמר בהצלחה.');
}
function npSaveAs(){
  closeDrops();
  showInput('שמירה בשם','שם הקובץ:', name=>{
    if(!name) return;
    const path='C:\\Desktop\\'+name+(name.includes('.')?'':'.txt');
    fsData[path]={type:'file',label:name,ext:'txt',size:'1 KB',created:new Date().toLocaleDateString('he-IL'),content:document.getElementById('npArea').value};
    if(!fsData['C:\\Desktop'].children.includes(path)) fsData['C:\\Desktop'].children.push(path);
    npFile=path;
    document.getElementById('npTitle').textContent='פנקס רשימות - '+name;
  }, npFile?getFName(npFile):'');
}
function npFind(){
  closeDrops();
  document.getElementById('npFLbl').textContent='חיפוש:';
  document.getElementById('npRIn').style.display='none';
  document.getElementById('npRBtn').style.display='none';
  document.getElementById('npFindBar').style.display='flex';
  document.getElementById('npFIn').focus();
}
function npReplace(){
  closeDrops();
  document.getElementById('npFLbl').textContent='חיפוש:';
  document.getElementById('npRIn').style.display='';
  document.getElementById('npRBtn').style.display='';
  document.getElementById('npFindBar').style.display='flex';
  document.getElementById('npFIn').focus();
}
function closeNpFind(){ document.getElementById('npFindBar').style.display='none'; document.getElementById('npFMsg').textContent=''; }
function doNpFind(){
  const txt=document.getElementById('npArea').value;
  const q=document.getElementById('npFIn').value;
  const msg=document.getElementById('npFMsg');
  if(!q){ msg.textContent='הזן מה לחפש'; return; }
  const idx=txt.indexOf(q);
  if(idx===-1){ msg.textContent='לא נמצא'; return; }
  msg.textContent='';
  document.getElementById('npArea').focus();
  document.getElementById('npArea').setSelectionRange(idx,idx+q.length);
}
function doNpReplace(){
  const area=document.getElementById('npArea');
  const q=document.getElementById('npFIn').value;
  const r=document.getElementById('npRIn').value;
  if(!q) return;
  area.value=area.value.split(q).join(r);
}
function npFontSize(){
  closeDrops();
  showInput('גודל פונט','הזן גודל (8-72):', v=>{
    const n=parseInt(v);
    if(n>=8&&n<=72){ npFontSz=n; document.getElementById('npArea').style.fontSize=n+'px'; }
    else showModal('שגיאה','גודל לא חוקי (8-72)');
  }, String(npFontSz));
}
function npFontFamily(){
  closeDrops();
  const fonts=['Tahoma','Arial','Courier New','Times New Roman','Verdana','Comic Sans MS'];
  const items=fonts.map(f=>
    `<div onclick="document.getElementById('npArea').style.fontFamily='${f}';closeModal()"
      style="padding:5px 10px;cursor:pointer;font-family:${f};border:1px solid #ddd;border-radius:2px;margin-bottom:3px;"
      onmouseover="this.style.background='#e8f0fe'" onmouseout="this.style.background=''">${f}</div>`
  ).join('');
  showModal('בחר גופן','<div>'+items+'</div>',[]);
}

// ============================================================
// DISPLAY SETTINGS
// ============================================================
function changeIconSize(v){
  const sz=parseInt(v);
  document.querySelectorAll('.dicon .diconImg').forEach(el=>{
    el.style.fontSize=sz+'px'; el.style.width=sz+'px'; el.style.height=sz+'px';
  });
}
// changeRes removed (fix #9 - caused layout issues)
function chooseBg(){
  closeWin('dispWin','');
  openFP('בחר תמונת רקע', p=>{
    const n=fsData[p];
    if(!n||(n.ext||'').toLowerCase()!=='img'){
      showModal('שגיאה','יש לבחור קובץ עם סיומת .img בלבד');
      openDisplaySettings(); return;
    }
    applyBg(n.imgKey||n.label);
    openDisplaySettings();
  });
}
function makeRainbowSvg(){
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
  s.setAttribute('viewBox','0 0 1200 800');
  s.style.cssText='width:100%;height:100%;position:absolute;top:0;left:0;';
  s.innerHTML=`<rect width="1200" height="800" fill="#001a33"/>
    <path d="M600,800 Q600,60 1400,350" fill="none" stroke="#FF0000" stroke-width="65" opacity=".75"/>
    <path d="M600,800 Q600,90 1370,360" fill="none" stroke="#FF7700" stroke-width="57" opacity=".75"/>
    <path d="M600,800 Q600,120 1340,370" fill="none" stroke="#FFFF00" stroke-width="49" opacity=".75"/>
    <path d="M600,800 Q600,150 1310,380" fill="none" stroke="#00CC00" stroke-width="41" opacity=".75"/>
    <path d="M600,800 Q600,180 1280,390" fill="none" stroke="#0000FF" stroke-width="33" opacity=".75"/>
    <path d="M600,800 Q600,210 1250,400" fill="none" stroke="#8B00FF" stroke-width="25" opacity=".75"/>`;
  return s;
}
function applyBg(key){
  const bgDiv=document.getElementById('desktopBg');
  // Remove all children
  while(bgDiv.firstChild) bgDiv.removeChild(bgDiv.firstChild);
  if(key==='rainbow'){
    bgDiv.appendChild(makeRainbowSvg());
    if(!myLifeUnlocked){
      myLifeUnlocked=true;
      setTimeout(()=>{ addMyLifeIcon(); openMyLife(); }, 300);
    }
  } else {
    const svgStr=getImgSvg({imgKey:key});
    if(svgStr){
      const wrap=document.createElement('div');
      wrap.style.cssText='width:100%;height:100%;position:absolute;top:0;left:0;';
      wrap.innerHTML=svgStr;
      const svg=wrap.querySelector('svg');
      if(svg){
        svg.style.cssText='width:100%;height:100%;position:absolute;top:0;left:0;';
        svg.setAttribute('preserveAspectRatio','xMidYMid slice');
        bgDiv.appendChild(svg);
      }
    } else {
      bgDiv.appendChild(makeRainbowSvg());
    }
  }
}

// ============================================================
// FILE PICKER
// ============================================================
function openFP(title, cb){
  fpCb=cb; fpSelPath=null; fpPath='C:\\';
  document.getElementById('fpTitle').textContent=title||'בחר קובץ';
  document.getElementById('fpSelName').value='';
  openWin('fpWin','');
  fpNav('C:\\');
}
function closeFP(){ closeWin('fpWin',''); fpCb=null; fpSelPath=null; }
function fpNav(path){
  if(!fsData[path]) return;
  fpPath=path;
  document.getElementById('fpAddr').value=path;
  const cont=document.getElementById('fpFiles'); cont.innerHTML='';
  fpSelPath=null; document.getElementById('fpSelName').value='';
  const node=fsData[path]; if(node.type!=='dir') return;
  (node.children||[]).filter(c=>fsData[c]).forEach(p=>{
    const n=fsData[p];
    // Hide shortcuts from file picker — they're not real files
    if(n.type==='shortcut') return;
    const el=document.createElement('div'); el.className='fIcon';
    el.innerHTML=`<div class="fIco">${getFileIcon(n,p)}</div><div class="fLbl">${n.label||getFName(p)}</div>`;
    el.onclick=()=>{
      cont.querySelectorAll('.fIcon').forEach(x=>x.classList.remove('sel'));
      el.classList.add('sel');
      if(n.type==='file'){ fpSelPath=p; document.getElementById('fpSelName').value=n.label+(n.ext?'.'+n.ext:''); }
    };
    el.ondblclick=()=>{ if(n.type==='dir') fpNav(p); else{ fpSelPath=p; fpConfirm(); } };
    cont.appendChild(el);
  });
}
function fpUp(){ const p=getParent(fpPath); if(p&&p!==fpPath) fpNav(p); }
function fpConfirm(){ 
  if(fpSelPath && fpCb){ 
    const callback = fpCb; // שמירת הפונקציה בצד
    const selection = fpSelPath;
    closeFP();             // זה יאפס את fpCb הגלובלי, אבל יש לנו עותק
    callback(selection);    // הפעלה של העותק
  } else {
    showModal('שגיאה','יש לבחור קובץ תחילה'); 
  }
}

// ============================================================
// DEC.EXE
// ============================================================
function decChoose(){
  openFP('בחר קובץ לפענוח', p=>{
    const n=fsData[p];
    const ext=(n&&n.ext||'').toLowerCase();
    const msg=document.getElementById('decMsg');
    if(ext!=='txt'){
      // Wrong file type — show error immediately, don't set decSelFile
      decSelFile=null;
      document.getElementById('decFileLbl').textContent='לא נבחר קובץ';
      msg.style.display='block'; msg.style.color='#a00';
      msg.textContent='שגיאה: הקובץ "'+((n&&n.label)||getFName(p))+'" אינו קובץ טקסט (.txt)';
      return;
    }
    decSelFile=p;
    document.getElementById('decFileLbl').textContent=(n&&n.label?n.label+'.txt':getFName(p));
    msg.style.display='none'; msg.textContent='';
  });
}
function doDecode(){
  const msg=document.getElementById('decMsg');
  if(!decSelFile){ msg.style.display='block'; msg.style.color='#a00'; msg.textContent='לא נבחר קובץ'; return; }
  const n=fsData[decSelFile];
  if(!n||(n.ext||'').toLowerCase()!=='txt'){ msg.style.display='block'; msg.style.color='#a00'; msg.textContent='שגיאה: יש לבחור קובץ .txt'; return; }
  if(!n.content||!n.content.startsWith('ENCODED:')){ msg.style.display='block'; msg.style.color='#a00'; msg.textContent='שגיאה: הקובץ אינו מקודד'; return; }
  msg.style.display='block'; msg.style.color='#555'; msg.textContent='מפענח...';
  setTimeout(()=>{
    const decoded=`יש אחת שמחכה לי\nהיא תאיר לי את פני\nהיא תצבע לי את הקשת\nותדליק לי את חיי`;
    fsData['C:\\Desktop\\dec.txt']={type:'file',label:'dec.txt',ext:'txt',size:'0.5 KB',created:new Date().toLocaleDateString('he-IL'),content:decoded};
    if(!fsData['C:\\Desktop'].children.includes('C:\\Desktop\\dec.txt'))
      fsData['C:\\Desktop'].children.push('C:\\Desktop\\dec.txt');
    addDecTxtIcon(decoded);
    msg.style.color='#080'; msg.textContent='✓ הפענוח הושלם! dec.txt נוצר על שולחן העבודה';
  }, 800);
}

// ============================================================
// MY LIFE
// ============================================================
function mlPower(){
  if(mlAnimId){ cancelAnimationFrame(mlAnimId); mlAnimId=null; }
  const main=document.getElementById('myLifeMain'); main.innerHTML='';
  const txt=document.createElement('div'); txt.className='vtxt'; txt.textContent='ניצחון!';
  main.appendChild(txt);
  let hue=0;
  function animBg(){ main.style.background=`hsl(${hue},70%,25%)`; hue=(hue+0.3)%360; mlAnimId=requestAnimationFrame(animBg); }
  animBg();
  spawnFwLoop(main);
}
function spawnFwLoop(container){
  function spawn(){
    const win=document.getElementById('myLifeWin');
    if(!win||win.style.display==='none') return;
    const colors=['#ff0','#f0f','#0ff','#f80','#0f8','#f00','#0f0'];
    for(let i=0;i<3;i++){
      const fw=document.createElement('div');
      fw.style.cssText=`position:absolute;left:${10+Math.random()*80}%;top:${5+Math.random()*70}%;width:10px;height:10px;border-radius:50%;background:${colors[Math.floor(Math.random()*colors.length)]};animation:firework .8s ease-out forwards;pointer-events:none;z-index:1;`;
      container.appendChild(fw);
      setTimeout(()=>{ try{ fw.remove(); }catch(e){} }, 900);
    }
    setTimeout(spawn, 600);
  }
  spawn();
}
function mlShowNews(source){
  closeDrops();
  if(mlAnimId){ cancelAnimationFrame(mlAnimId); mlAnimId=null; }
  const articles={
    'Y12':         [{t:'גל חום צפוי לארץ',b:'לפי תחזיות מזג האוויר, גל חום יגיע לישראל בסוף השבוע.'},{t:'בחירות מקומיות',b:'ההצבעה תתקיים ביום שלישי הקרוב.'},{t:'ניצחון בכדורגל',b:'הנבחרת ניצחה 3-1 במשחק האתמול.'}],
    'המדינה':      [{t:'הממשלה דנה בתקציב',b:'ישיבת הממשלה עסקה הלילה בדיון על תקציב 2003.'},{t:'ירידה באבטלה',b:'שיעור האבטלה ירד ב-0.3% בחודש האחרון.'},{t:'פרויקט פיתוח',b:'הוכרז על פרויקט פיתוח תשתיות בדרום הארץ.'}],
    'znet':        [{t:'מיקרוסופט משיקה XP',b:'חברת מיקרוסופט השיקה את Windows XP.'},{t:'אינטרנט מהיר',b:'רשת החדשה מציעה מהירות 1 Mbps.'},{t:'וירוס חדש',b:'מומחי אבטחה מזהירים מפני וירוס חדש במייל.'}],
    'ישראל איום':  [{t:'איום ביטחוני',b:'כוחות הביטחון מוכנים למצב חירום.'},{t:'תרגיל צבאי',b:'תרגיל נרחב בוצע בגבול הצפון.'},{t:'שיתוף פעולה',b:'ישראל ואמריקה חתמו על הסכם שיתוף מודיעין.'}],
    'אידיוט היום': [{t:'האידיוט של השבוע',b:'הפוליטיקאי שטוען שהאינטרנט זה רק אופנה.'},{t:'דעה: למה כולם טועים',b:'עמודת הדעות הלא-נכונה הכי פופולרית.'},{t:'כותרת שאיש לא יאמין',b:'בר בצפון ת"א מוכר בירה ב-5 שקל.'}],
    'מאקות':       [{t:'שפה בלתי מובנת',b:'חוקרים גילו שפה חדשה שאיש לא יכול לקרוא.'},{t:'מאמר ללא נושא',b:'הכתב שלנו כתב מאמר ללא כל קשר לשום דבר.'},{t:'פרסומת מסווה',b:'ידיעה זו ממומנת על ידי חברה שאיננו יכולים לציין.'}]
  };
  const arts=articles[source]||[];
  const main=document.getElementById('myLifeMain');
  main.style.background='#fff';
  main.innerHTML=`<div class="newsPage"><h2>${source}</h2>${arts.map(a=>`<div class="newsItem"><h4>${a.t}</h4><p>${a.b}</p></div>`).join('')}</div>`;
}
function mlGame(type){
  closeDrops();
  // עצירת כל האנימציות הפעילות
  if(mlAnimId){ cancelAnimationFrame(mlAnimId); mlAnimId=null; }
  if(gameAnimId){ 
    cancelAnimationFrame(gameAnimId); 
    clearTimeout(gameAnimId); // לטובת ה-setTimeout של הסנייק
    gameAnimId=null; 
  }
  
  // ניקוי מוחלט של מאזיני מקלדת כדי למנוע כפילויות
  document.onkeydown = null; 

  const main=document.getElementById('myLifeMain');
  main.style.background='#111';

  if(type==='snake'){
    main.innerHTML=`<div style="color:white;font-size:12px;padding:4px;">Snake — חצים לשליטה</div>
      <canvas id="snakeCanvas" width="480" height="330"></canvas>`;
    startSnake();
  } else if(type==='xonix'){
    main.innerHTML=`<div style="color:white;font-size:12px;padding:4px;">Xonix — חצים לשליטה, R לאיפוס</div>
      <canvas id="xonixCanvas" width="480" height="360"></canvas>`;
    startXonix();
  } else if(type==='mines'){
    main.style.background='#222';
    startMines(main);
  }
}
function mlNavaz(){
  closeDrops();
  if(mlAnimId){ cancelAnimationFrame(mlAnimId); mlAnimId=null; }
  const main=document.getElementById('myLifeMain');
  main.style.background='#0a0a1e';
  main.innerHTML=`<div style="color:#aaa;font-size:15px;text-align:center;padding:30px;font-family:Tahoma;">גם פה חסר לך נב"ז? ציפיתי ממך ליותר.</div>`;
}
function mlMeme(){
  closeDrops();
  if(mlAnimId){ cancelAnimationFrame(mlAnimId); mlAnimId=null; }
  const main=document.getElementById('myLifeMain');
  main.style.background='white';
  main.innerHTML=`
    <div style="display:flex;width:100%;height:100%;font-family:Arial;">
      <div style="flex:1;display:flex;flex-direction:column;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;border:2px solid #000;background:#222;">
          <div style="font-size:70px;margin-bottom:8px;">😒</div>
          <div style="background:white;color:black;padding:4px 8px;font-size:13px;font-weight:bold;text-align:center;">לשלוח מכונה וירטואלית כחידה</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;border:2px solid #000;background:#222;">
          <div style="font-size:70px;margin-bottom:8px;">😄</div>
          <div style="background:white;color:black;padding:4px 8px;font-size:13px;font-weight:bold;text-align:center;">לבנות מכונה וירטואלית באינטרנט</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 10px;">
        <div style="font-size:36px;margin-bottom:50px;">🙅</div>
        <div style="font-size:36px;margin-top:50px;">👉</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;">
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px;border:2px solid #000;background:white;">
          <div style="font-size:14px;font-weight:bold;text-align:center;">לשלוח מכונה וירטואלית כחידה</div>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px;border:2px solid #000;background:white;">
          <div style="font-size:14px;font-weight:bold;text-align:center;">לבנות מכונה וירטואלית באינטרנט</div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// SNAKE
// ============================================================
function startSnake(){
  const canvas=document.getElementById('snakeCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const CELL=20, COLS=24, ROWS=16;
  let snake=[{x:12,y:8}], dir={x:1,y:0};
  let food={x:5,y:5}, score=0, alive=true;
  function randFood(){ return {x:Math.floor(Math.random()*COLS), y:Math.floor(Math.random()*ROWS)}; }
  food=randFood();
  function handleKey(e){
    if(e.key==='ArrowLeft'&&dir.x!==1)  dir={x:-1,y:0};
    else if(e.key==='ArrowRight'&&dir.x!==-1) dir={x:1,y:0};
    else if(e.key==='ArrowUp'&&dir.y!==1)    dir={x:0,y:-1};
    else if(e.key==='ArrowDown'&&dir.y!==-1) dir={x:0,y:1};
  }
  document.addEventListener('keydown',handleKey);
  function draw(){
    ctx.fillStyle='#111'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#f00'; ctx.fillRect(food.x*CELL,food.y*CELL,CELL-2,CELL-2);
    snake.forEach((s,i)=>{ ctx.fillStyle=i===0?'#0f0':'#080'; ctx.fillRect(s.x*CELL,s.y*CELL,CELL-2,CELL-2); });
    ctx.fillStyle='white'; ctx.font='13px monospace'; ctx.fillText('ניקוד: '+score,4,ROWS*CELL+16);
    if(!alive){ ctx.fillStyle='red'; ctx.font='bold 26px Arial'; ctx.textAlign='center'; ctx.fillText('GAME OVER',canvas.width/2,canvas.height/2); ctx.textAlign='start'; }
  }
  function step(){
    if(!alive) return;
    const head={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(s=>s.x===head.x&&s.y===head.y)){
      alive=false; document.removeEventListener('keydown',handleKey); draw(); return;
    }
    snake.unshift(head);
    if(head.x===food.x&&head.y===food.y){ score++; food=randFood(); } else snake.pop();
    draw();
    gameAnimId=setTimeout(step,120);
  }
  step();
}

// ============================================================
// XONIX
// ============================================================
function startXonix() {
  // 1. עצירה ואיפוס
  if (gameAnimId) {
    cancelAnimationFrame(gameAnimId);
    gameAnimId = null;
  }

  const canvas = document.getElementById('xonixCanvas');
  if (!canvas) {
    console.error("Canvas xonixCanvas not found!");
    return;
  }
  const ctx = canvas.getContext('2d');

  // 2. אתחול משתנים
  const W = 48, H = 36, CELL = 10;
  // וידוא גודל קנבס מתאים לחישובים
  canvas.width = W * CELL;
  canvas.height = H * CELL + 20; // תוספת לניקוד

  let grid = Array.from({ length: H }, () => Array(W).fill(0));
  let player = { x: 0, y: 0 }, pdx = 0, pdy = 0, trail = [];
  let balls = [{ x: 20, y: 14, dx: 1, dy: 1 }, { x: 30, y: 22, dx: -1, dy: 1 }];
  let score = 0;
  let alive = true;

  // מילוי גבולות
  for (let x = 0; x < W; x++) { grid[0][x] = 1; grid[H - 1][x] = 1; }
  for (let y = 0; y < H; y++) { grid[y][0] = 1; grid[y][W - 1] = 1; }

  // 3. שליטה (מאזין ממוקד לחלון המשחק)
  document.onkeydown = function (e) {
    if (!alive && e.key.toLowerCase() === 'r') { startXonix(); return; }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault(); // מניעת גלילת הדף
      if (e.key === 'ArrowLeft') { pdx = -1; pdy = 0; }
      else if (e.key === 'ArrowRight') { pdx = 1; pdy = 0; }
      else if (e.key === 'ArrowUp') { pdx = 0; pdy = -1; }
      else if (e.key === 'ArrowDown') { pdx = 0; pdy = 1; }
    }
  };

  function floodFill(grd, x, y, vis) {
    const q = [{ x, y }];
    const res = [];
    while (q.length) {
      const c = q.pop();
      if (c.x < 0 || c.x >= W || c.y < 0 || c.y >= H || vis[c.y][c.x] || grd[c.y][c.x] === 1) continue;
      vis[c.y][c.x] = true;
      res.push(c);
      q.push({ x: c.x + 1, y: c.y }, { x: c.x - 1, y: c.y }, { x: c.x, y: c.y + 1 }, { x: c.x, y: c.y - 1 });
    }
    return res;
  }

  function step() {
    if (!alive) return;

    let nx = player.x + pdx, ny = player.y + pdy;
    
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
      if (grid[ny][nx] === 2) { // התנגשות בזנב של עצמך
        alive = false;
      } else if (grid[ny][nx] === 0) { // תנועה בשטח ריק (יצירת זנב)
        grid[player.y][player.x] = 2;
        trail.push({ x: player.x, y: player.y });
        player.x = nx; player.y = ny;
      } else if (grid[ny][nx] === 1) { // הגעה ל"חוף מבטחים"
        if (trail.length > 0) {
          grid[player.y][player.x] = 2;
          trail.push({ x: player.x, y: player.y });
          
          // מילוי שטחים:
          let vis = Array.from({ length: H }, () => Array(W).fill(false));
          // מוצאים איפה הכדורים נמצאים
          balls.forEach(b => {
             floodFill(grid, Math.floor(b.x), Math.floor(b.y), vis);
          });
          
          // כל מה שלא ביקרנו בו (ואינו קיר) - הופך לקיר
          for(let y=0; y<H; y++){
            for(let x=0; x<W; x++){
              if(!vis[y][x] && grid[y][x] !== 1) grid[y][x] = 1;
              if(grid[y][x] === 2) grid[y][x] = 1; // הפיכת הזנב לקיר
            }
          }
          score += trail.length * 10;
          trail = [];
        }
        player.x = nx; player.y = ny;
        pdx = 0; pdy = 0; // עצירה בחוף
      }
    }

    // כדורים
    balls.forEach(b => {
      b.x += b.dx * 0.2; b.y += b.dy * 0.2; // מהירות מתונה יותר
      let bx = Math.floor(b.x), by = Math.floor(b.y);
      if (bx <= 0 || bx >= W - 1) b.dx *= -1;
      if (by <= 0 || by >= H - 1) b.dy *= -1;
      if (grid[by] && grid[by][bx] === 1) { b.dx *= -1; b.dy *= -1; }
      if (grid[by] && grid[by][bx] === 2) alive = false; // כדור פגע בזנב
    });

    // ציור
    ctx.fillStyle = '#001';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (grid[y][x] === 1) {
          ctx.fillStyle = '#446';
          ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        } else if (grid[y][x] === 2) {
          ctx.fillStyle = '#ff0';
          ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    }

    ctx.fillStyle = '#0ff';
    ctx.fillRect(player.x * CELL, player.y * CELL, CELL - 1, CELL - 1);
    
    balls.forEach(b => {
      ctx.fillStyle = '#f50';
      ctx.beginPath();
      ctx.arc(b.x * CELL + 5, b.y * CELL + 5, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, canvas.height - 5);

    if (!alive) {
      ctx.fillStyle = 'rgba(255,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER - Press R', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'left';
      return;
    }

    gameAnimId = requestAnimationFrame(step);
  }

  step();
}

// ============================================================
// MINESWEEPER
// ============================================================
function startMines(container){
  const ROWS=9, COLS=9, MINES=10;
  let board=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  let revealed=Array.from({length:ROWS},()=>Array(COLS).fill(false));
  let flagged=Array.from({length:ROWS},()=>Array(COLS).fill(false));
  let gameOver=false, firstClick=true;
  function placeMines(sr,sc){
    let placed=0;
    while(placed<MINES){ const r=Math.floor(Math.random()*ROWS), c=Math.floor(Math.random()*COLS); if(board[r][c]!=='M'&&(Math.abs(r-sr)>1||Math.abs(c-sc)>1)){board[r][c]='M';placed++;} }
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ if(board[r][c]==='M') continue; let cnt=0; for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&board[nr][nc]==='M')cnt++;} board[r][c]=cnt; }
  }
  function reveal(r,c){ if(r<0||r>=ROWS||c<0||c>=COLS||revealed[r][c]||flagged[r][c]) return; revealed[r][c]=true; if(board[r][c]===0) for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) reveal(r+dr,c+dc); }
  function renderMines(){
    container.innerHTML='';
    const info=document.createElement('div');
    info.style.cssText='color:white;font-size:12px;text-align:center;padding:4px;';
    info.textContent='שולה מוקשים | לחץ ימין לדגל';
    container.appendChild(info);
    const grid=document.createElement('div');
    grid.style.cssText=`display:grid;grid-template-columns:repeat(${COLS},26px);gap:2px;justify-content:center;`;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const cell=document.createElement('div'); cell.className='msCell';
      if(revealed[r][c]){
        cell.classList.add('open');
        const v=board[r][c];
        if(v==='M') cell.textContent='💣';
        else if(v>0){ cell.textContent=v; const colors=['','#0000ff','#008000','#ff0000','#000080','#800000','#008080','#000000','#808080']; cell.style.color=colors[v]||'black'; }
      } else if(flagged[r][c]){ cell.classList.add('flag'); cell.textContent='🚩'; }
      cell.onclick=()=>{
        if(gameOver||revealed[r][c]||flagged[r][c]) return;
        if(firstClick){ placeMines(r,c); firstClick=false; }
        if(board[r][c]==='M'){ revealed[r][c]=true; gameOver=true; renderMines(); return; }
        reveal(r,c); renderMines();
      };
      cell.oncontextmenu=e=>{ e.preventDefault(); if(!revealed[r][c]){ flagged[r][c]=!flagged[r][c]; renderMines(); } };
      grid.appendChild(cell);
    }
    container.appendChild(grid);
    if(gameOver){
      const msg=document.createElement('div');
      msg.style.cssText='color:#f00;font-weight:bold;text-align:center;padding:6px;font-size:13px;';
      msg.textContent='💥 BOOM! לחץ R לאיפוס';
      container.appendChild(msg);
      document.onkeydown=e=>{ if(e.key==='r'||e.key==='R') mlGame('mines'); };
    }
  }
  renderMines();
}
