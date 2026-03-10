// ============================================================
// CALCULATOR
// ============================================================
function buildCalc(){
  const g=document.getElementById('calcGrid'); if(g.children.length) return;
  ['MC','MR','MS','M+','←','±','√','%','CE','C','','÷','7','8','9','×','4','5','6','-','1','2','3','+','0','','.','='].forEach(b=>{
    const el=document.createElement('button');
    el.textContent=b;
    el.style.cssText='padding:5px;background:linear-gradient(180deg,#f0f0f0,#c8c8c8);border:1px solid #999;cursor:pointer;font-size:12px;';
    if(b==='=') el.style.background='linear-gradient(180deg,#7090e0,#4060c0)';
    if(!b) el.style.visibility='hidden';
    el.onclick=()=>calcBtn(b);
    g.appendChild(el);
  });
}
function calcBtn(b){
  const d=document.getElementById('calcDisp');
  if(b==='C'||b==='CE'){ calcExpr=''; d.textContent='0'; calcRes=false; return; }
  if(b==='←'){ calcExpr=calcExpr.slice(0,-1); d.textContent=calcExpr||'0'; return; }
  if(b==='='){
    try{ let r=Function('"use strict";return ('+calcExpr.replace(/×/g,'*').replace(/÷/g,'/')+')')(); d.textContent=r; calcExpr=String(r); calcRes=true; }
    catch(e){ d.textContent='שגיאה'; calcExpr=''; }
    return;
  }
  if(b==='√'){ try{ let r=Math.sqrt(parseFloat(calcExpr)||0); d.textContent=r; calcExpr=String(r); }catch(e){} return; }
  if(b==='±'){ calcExpr=calcExpr?String(-parseFloat(calcExpr)):'0'; d.textContent=calcExpr; return; }
  if(b==='%'){ calcExpr=String(parseFloat(calcExpr)/100); d.textContent=calcExpr; return; }
  if(!b) return;
  if(calcRes&&!'+-×÷'.includes(b)){ calcExpr=''; calcRes=false; }
  calcExpr+=b; d.textContent=calcExpr;
}

// ============================================================
// BROWSER
// ============================================================
function brNav(url){
  if(!url||!url.trim()) return;
  url=url.trim();
  if(!wifi){ brShowNoInternet(); return; }
  if(!url.startsWith('http')&&!url.startsWith('browser:')) url='https://'+url;
  if(url.includes('secret.xyz')){ pushBr({t:'secret',url}); brShowSecret(false,true); return; }
  if(url.includes('search.xp/?q=')){
    const q=decodeURIComponent(url.split('?q=')[1]||'');
    pushBr({t:'results',url,q}); brShowResults(q,true); return;
  }
  if(url==='https://search.xp/'||url==='https://search.xp'){ pushBr({t:'home',url}); brShowSearch(null,true); return; }
  pushBr({t:'site',url}); brShowSite(url,true);
}
function pushBr(p){ brHist=brHist.slice(0,brHistIdx+1); brHist.push(p); brHistIdx=brHist.length-1; }
function brBack(){ if(brHistIdx>0){ brHistIdx--; brLoad(brHist[brHistIdx]); } }
function brFwd(){ if(brHistIdx<brHist.length-1){ brHistIdx++; brLoad(brHist[brHistIdx]); } }
function brLoad(p){
  if(!p) return;
  document.getElementById('brAddr').value=p.url||'';
  if(p.t==='noInternet') brShowNoInternet(true);
  else if(p.t==='secret') brShowSecret(false,true);
  else if(p.t==='history') brShowHistory(true);
  else if(p.t==='results') brShowResults(p.q,true);
  else if(p.t==='home') brShowSearch(null,true);
  else if(p.t==='site') brShowSite(p.url,true);
}
function brRefresh(){
  const b=document.getElementById('brRef');
  b.style.animation='spin .5s linear'; setTimeout(()=>b.style.animation='',600);
  if(brHist[brHistIdx]) brLoad(brHist[brHistIdx]);
  else { if(!wifi) brShowNoInternet(); else brShowSearch(); }
}
function toggleBrMenu(){ const m=document.getElementById('brMenu'); m.style.display=m.style.display==='block'?'none':'block'; }
function hideBrMenu(){ document.getElementById('brMenu').style.display='none'; }

function brShowNoInternet(nh){
  document.getElementById('brAddr').value='about:blank';
  document.getElementById('brTitle').textContent='אין חיבור';
  if(!nh) pushBr({t:'noInternet',url:'about:blank'});
  document.getElementById('brBody').innerHTML=`
    <div style="padding:30px 40px;font-family:Arial;display:flex;flex-direction:column;align-items:center;">
      <h2 style="font-size:18px;color:#333;margin-bottom:6px;">לא ניתן להתחבר לאינטרנט</h2>
      <p style="color:#777;font-size:12px;margin-bottom:20px;">בדוק את החיבור לאינטרנט ונסה שוב.</p>
      <canvas id="dinoCanvas" width="600" height="150"
        style="border:2px solid #ccc;background:#fff;cursor:pointer;display:block;"></canvas>
      <p style="color:#aaa;font-size:11px;margin-top:8px;">לחץ רווח להתחיל לשחק</p>
    </div>`;
  initDino();
}

function initDino(){
  const canvas=document.getElementById('dinoCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=600,H=150,GROUND=115;
  let dino={x:60,y:GROUND,w:24,h:28,vy:0,onGround:true};
  let obstacles=[],frame=0,score=0,alive=true,started=false,speed=4;
  let animId=null;

  function drawScene(){
    ctx.clearRect(0,0,W,H);
    // Ground
    ctx.fillStyle='#555'; ctx.fillRect(0,GROUND+dino.h,W,2);
    // Score
    ctx.fillStyle='#555'; ctx.font='12px monospace'; ctx.fillText('ניקוד: '+score,W-90,20);
    // Dino
    ctx.fillStyle='#333';
    ctx.fillRect(dino.x,dino.y,dino.w,dino.h);
    // eye
    ctx.fillStyle='white'; ctx.fillRect(dino.x+16,dino.y+5,6,6);
    ctx.fillStyle='#333'; ctx.fillRect(dino.x+18,dino.y+7,3,3);
    // obstacles
    ctx.fillStyle='#2a7a2a';
    obstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));
    if(!started){
      ctx.fillStyle='#888'; ctx.font='14px Arial'; ctx.textAlign='center';
      ctx.fillText('לחץ רווח להתחיל',W/2,H/2); ctx.textAlign='start';
    }
    if(!alive){
      ctx.fillStyle='#c00'; ctx.font='bold 18px Arial'; ctx.textAlign='center';
      ctx.fillText('GAME OVER — רווח לאיפוס',W/2,H/2); ctx.textAlign='start';
    }
  }

  function jump(){
    if(!alive){ restart(); return; }
    if(!started){ started=true; loop(); return; }
    if(dino.onGround){ dino.vy=-12; dino.onGround=false; }
  }

  function restart(){
    dino={x:60,y:GROUND,w:24,h:28,vy:0,onGround:true};
    obstacles=[]; frame=0; score=0; alive=true; started=true; speed=4;
    if(animId) cancelAnimationFrame(animId);
    loop();
  }

  function loop(){
    // Check canvas still in DOM
    if(!document.getElementById('dinoCanvas')){ cancelAnimationFrame(animId); return; }
    frame++;
    if(frame%60===0){ score++; if(score%5===0) speed=Math.min(speed+0.5,12); }
    // Gravity
    if(!dino.onGround){ dino.vy+=0.7; dino.y+=dino.vy; }
    if(dino.y>=GROUND){ dino.y=GROUND; dino.vy=0; dino.onGround=true; }
    // Spawn obstacle
    const minGap=Math.max(50,120-score*2);
    if(frame%(minGap|0)===0 || obstacles.length===0){
      const h=30+Math.random()*30|0;
      if(!obstacles.length||W-obstacles[obstacles.length-1].x>180)
        obstacles.push({x:W,y:GROUND+dino.h-h,w:20,h});
    }
    // Move obstacles
    obstacles.forEach(o=>o.x-=speed);
    obstacles=obstacles.filter(o=>o.x+o.w>0);
    // Collision
    obstacles.forEach(o=>{
      if(dino.x+dino.w-4>o.x && dino.x+4<o.x+o.w && dino.y+dino.h-4>o.y && dino.y+4<o.y+o.h)
        alive=false;
    });
    drawScene();
    if(alive) animId=requestAnimationFrame(loop);
    else drawScene();
  }

  drawScene();

  // Space / click to jump
  function onKey(e){
    if(e.code==='Space'||e.key===' '){ e.preventDefault(); jump(); }
  }
  function onClick(){ jump(); }
  document.addEventListener('keydown',onKey);
  canvas.addEventListener('click',onClick);
  // Cleanup when canvas removed
  const obs=new MutationObserver(()=>{
    if(!document.getElementById('dinoCanvas')){
      document.removeEventListener('keydown',onKey);
      canvas.removeEventListener('click',onClick);
      if(animId) cancelAnimationFrame(animId);
      obs.disconnect();
    }
  });
  obs.observe(document.body,{childList:true,subtree:true});
}
function brShowSearch(q, nh){
  if(!wifi){ brShowNoInternet(); return; }
  if(q){ brShowResults(q,nh); return; }
  document.getElementById('brAddr').value='https://search.xp/';
  document.getElementById('brTitle').textContent='XP Search';
  if(!nh) pushBr({t:'home',url:'https://search.xp/'});
  document.getElementById('brBody').innerHTML=`
    <div style="padding:50px 20px;font-family:Arial;text-align:center;">
      <div style="font-size:40px;font-weight:bold;margin-bottom:24px;">
        <span style="color:#4285f4">X</span><span style="color:#ea4335">P</span><span style="color:#fbbc05">S</span><span style="color:#34a853">e</span><span style="color:#4285f4">a</span><span style="color:#ea4335">r</span><span style="color:#fbbc05">c</span><span style="color:#34a853">h</span>
      </div>
      <div style="display:flex;gap:8px;max-width:480px;margin:0 auto;">
        <input id="srchM" type="text" placeholder="חפש ברשת..."
          style="flex:1;padding:10px 16px;border:1px solid #ddd;border-radius:24px;font-size:14px;outline:none;"
          onkeydown="if(event.key==='Enter'){const q=this.value.trim();if(q)brNav('https://search.xp/?q='+encodeURIComponent(q))}"/>
        <button onclick="const q=document.getElementById('srchM').value.trim();if(q)brNav('https://search.xp/?q='+encodeURIComponent(q))"
          style="padding:10px 18px;background:#4285f4;color:white;border:none;border-radius:24px;cursor:pointer;font-size:14px;">חפש</button>
      </div>
    </div>`;
}
function brShowResults(query, nh){
  if(!wifi){ brShowNoInternet(); return; }
  const url='https://search.xp/?q='+encodeURIComponent(query);
  document.getElementById('brAddr').value=url;
  document.getElementById('brTitle').textContent=query+' - חיפוש';
  if(!nh) pushBr({t:'results',url,q:query});
  const results=[
    {u:`${query.toLowerCase().replace(/\s+/g,'')}.xp`,         t:`${query} - האתר הרשמי`,   d:`הדף הרשמי של ${query}.`},
    {u:`wiki-xp.xp/wiki/${encodeURIComponent(query)}`,         t:`${query} - ויקי XP`,        d:`מידע אנציקלופדי אודות ${query}.`},
    {u:`news.xp/q/${encodeURIComponent(query)}`,               t:`חדשות על ${query}`,          d:`הכתבות האחרונות בנושא ${query}.`},
    {u:`forum.xp/${encodeURIComponent(query)}`,                t:`פורום XP - ${query}`,        d:`דיונים בנושא ${query}.`},
    {u:`shop.xp/${encodeURIComponent(query)}`,                 t:`קנה ${query}`,               d:`מוצרים הקשורים ל-${query}.`},
  ];
  document.getElementById('brBody').innerHTML=`
    <div style="padding:8px 16px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:8px;background:#f8f8f8;flex-shrink:0;">
      <input id="srchI" value="${query.replace(/"/g,'&quot;')}"
        style="flex:1;max-width:400px;padding:6px 12px;border:1px solid #ddd;border-radius:20px;font-size:13px;"
        onkeydown="if(event.key==='Enter')brNav('https://search.xp/?q='+encodeURIComponent(this.value))"/>
      <button onclick="brNav('https://search.xp/?q='+encodeURIComponent(document.getElementById('srchI').value))"
        style="padding:6px 14px;background:#4285f4;color:white;border:none;border-radius:20px;cursor:pointer;font-size:12px;">חפש</button>
    </div>
    <div style="padding:4px 16px 8px;color:#666;font-size:12px;">כ-${((Math.random()*900000+100000)|0).toLocaleString()} תוצאות</div>
    <div id="srchL" style="padding:0 16px;overflow-y:auto;"></div>`;
  const cont=document.getElementById('srchL');
  results.forEach(r=>{
    const iv=visitedLinks.has(r.u);
    const d=document.createElement('div'); d.style.marginBottom='20px';
    d.innerHTML=`<div style="color:#006621;font-size:12px;">https://${r.u}</div>
      <div style="color:${iv?'#660099':'#1a0dab'};font-size:16px;cursor:pointer;"
        onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'"
        onclick="visitedLinks.add('${r.u}');this.style.color='#660099';brNav('https://${r.u}')">${r.t}</div>
      <div style="color:#545454;font-size:13px;">${r.d}</div>`;
    cont.appendChild(d);
  });
}
function brShowSite(url, nh){
  if(!wifi){ brShowNoInternet(); return; }
  if(url.includes('secret.xyz')){ brShowSecret(false,nh); return; }
  document.getElementById('brAddr').value=url;
  const dom=url.replace(/^https?:\/\//,'').split('/')[0];
  document.getElementById('brTitle').textContent=dom;
  if(!nh) pushBr({t:'site',url});
  visitedLinks.add(dom);
  const T={
    news:   {bg:'#fff',     h:'🗞 XP News',      c:'#c00',    s:'חדשות',       cats:['פוליטיקה','כלכלה','טכנולוגיה','ספורט','תרבות']},
    wiki:   {bg:'#fff',     h:'📖 WikiXP',        c:'#333',    s:'אנציקלופדיה', cats:['מדע','היסטוריה','גאוגרפיה','אנשים','אמנות']},
    shop:   {bg:'#fff8f0',  h:'🛒 XPShop',        c:'#e67700', s:'קניות',       cats:['אלקטרוניקה','ביגוד','ספרים']},
    mail:   {bg:'#f0f4ff',  h:'✉️ XP Mail',       c:'#1a6abf', s:'דואר',        cats:['נכנס','שלוחה','טיוטות']},
    forum:  {bg:'#fffef0',  h:'💬 Forum',          c:'#5a3e00', s:'קהילה',       cats:['טכנולוגיה','בידור','חינוך']},
    weather:{bg:'#e8f4ff',  h:'🌤 מזג אוויר',     c:'#0055bb', s:'תחזית',       cats:["ת\"א","י-ם",'חיפה']},
    maps:   {bg:'#e8ffe8',  h:'🗺 Maps',           c:'#118811', s:'מפות',        cats:['ניווט','מסעדות','שירותים']},
    banking:{bg:'#f0fff0',  h:'🏦 Bank',           c:'#006600', s:'בנקאות',     cats:['יתרה','העברות','הלוואות']},
  };
  const k=Object.keys(T).find(x=>dom.includes(x));
  const t=k?T[k]:{bg:'#fff',h:'🌐 '+dom,c:'#333',s:'ברוכים הבאים',cats:['ראשי','אודות','צור קשר']};
  document.getElementById('brBody').innerHTML=`
    <div style="background:${t.bg};min-height:100%;font-family:Arial;">
      <div style="background:${t.c};color:white;padding:10px 20px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;font-weight:bold;">${t.h}</span>
        <span style="font-size:13px;opacity:.8;">${t.s}</span>
      </div>
      <div style="background:rgba(0,0,0,.15);padding:4px 20px;display:flex;gap:12px;">
        ${t.cats.map(c=>`<span style="color:white;font-size:12px;cursor:pointer;padding:3px 6px;"
          onmouseover="this.style.background='rgba(255,255,255,.2)'" onmouseout="this.style.background=''">${c}</span>`).join('')}
      </div>
      <div style="padding:20px;max-width:680px;">
        <h2 style="color:${t.c};font-size:18px;margin-bottom:10px;">ברוכים הבאים ל-${dom}!</h2>
        <p style="color:#444;font-size:13px;line-height:1.6;margin-bottom:14px;">${t.s} — ${dom} הוא אתר מוביל בתחומו.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;">
          ${t.cats.map(c=>`<div style="background:white;border:1px solid #ddd;border-radius:4px;padding:10px;cursor:pointer;"
            onmouseover="this.style.borderColor='${t.c}'" onmouseout="this.style.borderColor='#ddd'">
            <div style="font-weight:bold;color:${t.c};font-size:12px;margin-bottom:3px;">${c}</div>
            <div style="color:#777;font-size:11px;">לחץ לעוד</div></div>`).join('')}
        </div>
        <div style="margin-top:16px;padding:8px;background:#f8f8f8;border:1px solid #eee;font-size:11px;color:#666;">
          © 2003 ${dom} | צור קשר | פרטיות
        </div>
      </div>
    </div>`;
}
function brShowHistory(nh){
  document.getElementById('brTitle').textContent='היסטוריה';
  document.getElementById('brAddr').value='browser://history';
  if(!nh) pushBr({t:'history',url:'browser://history'});
  const hist=['agents-forum.xp','secure-docs.xp','crypto-news.xp','xpmail.xp','weather.xp','maps.xp','banking.xp','secret.xyz','news.xp','wiki.xp','forum.xp','shop.xp'];
  document.getElementById('brBody').innerHTML=`<div style="padding:16px;font-family:Arial;"><h3 style="margin-bottom:12px;color:#333;">היסטוריית גלישה</h3><div id="histL"></div></div>`;
  const list=document.getElementById('histL');
  hist.forEach(url=>{
    const iv=visitedLinks.has(url);
    const d=document.createElement('div'); d.style.cssText='padding:5px 0;border-bottom:1px solid #eee;display:flex;gap:8px;align-items:center;';
    d.innerHTML=`<span>🌐</span><span style="color:${iv?'#660099':'#1a0dab'};font-size:13px;cursor:pointer;"
      onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'"
      onclick="brNav('https://${url}')">${url}</span>`;
    list.appendChild(d);
  });
}
function brShowSecret(loggedIn, nh){
  document.getElementById('brTitle').textContent='secret.xyz';
  document.getElementById('brAddr').value='https://secret.xyz';
  if(!nh) pushBr({t:'secret',url:'https://secret.xyz'});
  const body=document.getElementById('brBody');
  if(!loggedIn){
    body.innerHTML=`<div style="padding:40px;display:flex;flex-direction:column;align-items:center;background:#111;min-height:100%;box-sizing:border-box;">
      <div style="font-family:monospace;font-size:22px;color:#00ff00;margin-bottom:24px;">◈ SECRET.XYZ ◈</div>
      <div style="margin-bottom:12px;width:280px;">
        <label style="color:#888;font-size:12px;display:block;margin-bottom:4px;font-family:monospace;">שם משתמש</label>
        <input id="sU" type="text" style="width:100%;padding:8px;background:#222;border:1px solid #444;color:#00ff00;font-family:monospace;box-sizing:border-box;"/>
      </div>
      <div style="margin-bottom:16px;width:280px;">
        <label style="color:#888;font-size:12px;display:block;margin-bottom:4px;font-family:monospace;">סיסמה</label>
        <input id="sP" type="password" style="width:100%;padding:8px;background:#222;border:1px solid #444;color:#00ff00;font-family:monospace;box-sizing:border-box;"
          onkeydown="if(event.key==='Enter')doSecretLogin()"/>
      </div>
      <button onclick="doSecretLogin()" style="padding:8px 28px;background:#00aa00;color:black;border:none;cursor:pointer;font-family:monospace;font-weight:bold;">כניסה</button>
      <div id="sErr" style="color:#ff4444;font-size:12px;margin-top:10px;font-family:monospace;display:none;">שם משתמש או סיסמה שגויים</div>
    </div>`;
  } else {
    body.innerHTML=`<div style="padding:40px;display:flex;flex-direction:column;align-items:center;background:#111;min-height:100%;box-sizing:border-box;">
      <div style="font-family:monospace;font-size:22px;color:#00ff00;margin-bottom:16px;">◈ גישה אושרה ◈</div>
      <div style="color:#888;font-family:monospace;font-size:13px;margin-bottom:24px;">ברוך הבא, Agent67</div>
      <div style="background:#1a1a1a;border:1px solid #333;padding:16px;width:280px;">
        <div style="color:#00ff00;font-family:monospace;font-size:12px;margin-bottom:8px;">📁 קבצים זמינים:</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #222;">
          <span style="color:#ccc;font-family:monospace;font-size:11px;">enc.txt</span>
          <span style="color:#555;font-family:monospace;font-size:10px;">2.4 KB</span>
          <button onclick="downloadEnc()" id="dlBtn"
            style="padding:3px 10px;background:#004400;color:#00ff00;border:1px solid #006600;cursor:pointer;font-family:monospace;font-size:11px;">הורד</button>
        </div>
      </div>
    </div>`;
  }
}
function doSecretLogin(){
  const u=document.getElementById('sU'), p=document.getElementById('sP');
  if(!u||!p) return;
  if(u.value.trim()==='Agent67' && p.value.trim()==='hitman47'){
    brShowSecret(true,true);
  } else {
    const e=document.getElementById('sErr');
    if(e){ e.style.display='block'; setTimeout(()=>e.style.display='none',2000); }
  }
}
function downloadEnc(){
  if(encDl){ showModal('הורדה','הקובץ enc.txt כבר הורד.'); return; }
  encDl=true;
  fsData['C:\\Downloads\\enc.txt']={type:'file',label:'enc.txt',ext:'txt',size:'2.4 KB',created:'01/01/2003',content:'ENCODED:3n9x7K2mP8qR5tW1vY4uN6jL0hF'};
  if(!fsData['C:\\Downloads'].children.includes('C:\\Downloads\\enc.txt'))
    fsData['C:\\Downloads'].children.push('C:\\Downloads\\enc.txt');
  const btn=document.getElementById('dlBtn');
  if(btn){ btn.textContent='✓ הורד'; btn.disabled=true; btn.style.background='#002200'; }
  showModal('הורדה הושלמה','enc.txt הורד לתיקיית Downloads');
}

// ============================================================
// FILE EXPLORER
// ============================================================
function navTo(path){
  if(!path) return;
  if(path==='My Computer'){
    expPath='My Computer';
    document.getElementById('expAddr').value='My Computer';
    document.getElementById('expTitle').textContent='המחשב שלי';
    document.getElementById('expStat').textContent='';
    renderMyComputer(); return;
  }
  if(!fsData[path]){ document.getElementById('expStat').textContent='נתיב לא נמצא: '+path; return; }
  if(expPath!==path){
    expHist=expHist.slice(0,expHistIdx+1);
    expHist.push(path); expHistIdx=expHist.length-1;
  }
  expPath=path; expSelected.clear();
  document.getElementById('expAddr').value=path;
  document.getElementById('expTitle').textContent='סייר הקבצים - '+(fsData[path].label||getFName(path));
  renderExpFiles();
}
function renderMyComputer(){
  const cont=document.getElementById('expFiles'); cont.className='icons'; cont.innerHTML='';
  const el=document.createElement('div'); el.className='fIcon';
  el.innerHTML='<div class="fIco">💾</div><div class="fLbl">Local Disk (C:)</div>';
  el.ondblclick=()=>navTo('C:\\'); cont.appendChild(el);
  document.getElementById('expStat').textContent='1 פריט';
}
function renderExpFiles(){
  const node=fsData[expPath]; const cont=document.getElementById('expFiles');
  if(!node||node.type!=='dir'){ cont.innerHTML='<div style="padding:10px;color:#888;">לא ניתן להציג</div>'; return; }
  let children=(node.children||[]).filter(c=>fsData[c]);
  children=children.sort((a,b)=>{
    const na=fsData[a], nb=fsData[b], dir=expSortAsc?1:-1;
    if(expSort==='name') return dir*(na.label||'').localeCompare(nb.label||'','he');
    if(expSort==='size') return dir*(na.size||'').localeCompare(nb.size||'');
    if(expSort==='date') return dir*(na.created||'').localeCompare(nb.created||'');
    if(expSort==='type') return dir*(na.ext||na.type||'').localeCompare(nb.ext||nb.type||'');
    return 0;
  });
  document.getElementById('expStat').textContent=children.length+' פריטים';
  document.getElementById('mViewIcons').textContent=expView==='icons'?'✓ סמלים':'   סמלים';
  document.getElementById('mViewList').textContent=expView==='list'?'✓ רשימה':'   רשימה';

  if(expView==='list'){
    cont.className='list';
    cont.innerHTML=`<div class="listHdr">
      <span style="width:22px;"></span>
      <span class="frN" onclick="sortExp('name')" style="cursor:pointer;">שם ${expSort==='name'?(expSortAsc?'▲':'▼'):''}</span>
      <span class="frD" onclick="sortExp('date')" style="cursor:pointer;">תאריך ${expSort==='date'?(expSortAsc?'▲':'▼'):''}</span>
      <span class="frS" onclick="sortExp('size')" style="cursor:pointer;">גודל ${expSort==='size'?(expSortAsc?'▲':'▼'):''}</span>
      <span class="frT" onclick="sortExp('type')" style="cursor:pointer;">סוג ${expSort==='type'?(expSortAsc?'▲':'▼'):''}</span>
    </div>`;
    children.forEach(p=>{
      const n=fsData[p]; if(!n) return;
      const row=document.createElement('div');
      row.className='fRow'+(expSelected.has(p)?' sel':'');
      row.innerHTML=`<span class="frIco">${getFileIcon(n,p)}</span>
        <span class="frN">${n.label||getFName(p)}</span>
        <span class="frD fRowSub">${n.created||'-'}</span>
        <span class="frS fRowSub">${n.size||'-'}</span>
        <span class="frT fRowSub">${n.ext||n.type||'-'}</span>`;
      row.onclick=e=>{
        if(!e.ctrlKey) expSelected.clear();
        expSelected.add(p);
        cont.querySelectorAll('.fRow').forEach(r=>r.classList.remove('sel'));
        row.classList.add('sel');
      };
      row.ondblclick=()=>openFsItem(p,n);
      row.oncontextmenu=e=>{ e.preventDefault(); fCtxTarget=p; showFCtx(e.clientX,e.clientY); };
      cont.appendChild(row);
    });
  } else {
    cont.className='icons'; cont.innerHTML='';
    children.forEach(p=>{
      const n=fsData[p]; if(!n) return;
      const el=document.createElement('div');
      el.className='fIcon'+(expSelected.has(p)?' sel':'');
      el.innerHTML=`<div class="fIco">${getFileIcon(n,p)}</div><div class="fLbl">${n.label||getFName(p)}</div>`;
      el.onclick=e=>{
        if(!e.ctrlKey) expSelected.clear();
        expSelected.add(p);
        cont.querySelectorAll('.fIcon').forEach(r=>r.classList.remove('sel'));
        el.classList.add('sel');
      };
      el.ondblclick=()=>openFsItem(p,n);
      el.oncontextmenu=e=>{ e.preventDefault(); fCtxTarget=p; showFCtx(e.clientX,e.clientY); };
      cont.appendChild(el);
    });
  }
}
// Map shortcut labels → app launchers
const shortcutMap={
  'סל מחזור':    ()=>openRecycle(),
  'סייר הקבצים': ()=>openExp('C:\\'),
  'דפדפן':       ()=>openBr(),
  'פנקס רשימות': ()=>openNp(),
  'אודות':       ()=>openAbout(),
  'מחשבון':      ()=>openCalc(),
  'My Life':     ()=>openMyLife(),
};
function openFsItem(p,n){
  if(n.type==='dir'){ navTo(p); return; }
  if(n.type==='shortcut'){
    const fn=shortcutMap[n.label];
    if(fn) fn(); else showModal('קיצור דרך','לא ניתן לפתוח: '+n.label);
    return;
  }
  const ext=(n.ext||'').toLowerCase();
  if(ext==='img'){ openImgViewer(p); return; }
  if(ext==='exe'){ if(p.includes('dec.exe')) openDecoder(); else showModal('הרצה','הרצת '+n.label); return; }
  openNp(n.content||'', n.label+(n.ext?'.'+n.ext:''));
}
function expBack(){ if(expHistIdx>0){ expHistIdx--; navTo(expHist[expHistIdx]); } }
function expFwd(){ if(expHistIdx<expHist.length-1){ expHistIdx++; navTo(expHist[expHistIdx]); } }
function expUp(){ if(expPath==='My Computer'||expPath==='C:\\'){ navTo('My Computer'); return; } navTo(getParent(expPath)||'C:\\'); }
function toggleExpView(){ expView=expView==='icons'?'list':'icons'; renderExpFiles(); }
function setExpView(v){ expView=v; renderExpFiles(); }
function sortExp(col){ if(expSort===col) expSortAsc=!expSortAsc; else{ expSort=col; expSortAsc=true; } renderExpFiles(); }
function showFCtx(x,y){ const m=document.getElementById('fCtxMenu'); m.style.display='block'; m.style.left=x+'px'; m.style.top=y+'px'; }
function ctxOpen(){ hideAllCtx(); if(!fCtxTarget) return; openFsItem(fCtxTarget,fsData[fCtxTarget]); }
function ctxDel(){ hideAllCtx(); if(!fCtxTarget) return; moveToRecycle(fCtxTarget); }
function ctxProps(){ hideAllCtx(); if(!fCtxTarget) return; showFileProps(fCtxTarget); }
function expSelectAll(){ const node=fsData[expPath]; if(!node) return; (node.children||[]).forEach(c=>expSelected.add(c)); renderExpFiles(); }
function expDeleteSelected(){
  const sel=[...expSelected]; if(!sel.length){ showModal('מחיקה','לא נבחרו קבצים'); return; }
  showModal('מחיקה','האם למחוק '+sel.length+' פריטים לסל המחזור?',[
    {l:'מחק', cb:()=>{ sel.forEach(p=>moveToRecycle(p)); expSelected.clear(); renderExpFiles(); }},
    {l:'ביטול'}
  ]);
}
function expProperties(){ if(expSelected.size===1) showFileProps([...expSelected][0]); else showModal('מאפיינים','בחר קובץ אחד'); }
function moveToRecycle(p){
  const n=fsData[p]; if(!n) return;
  recycleItems.push({path:p, node:{...n}, originalParent:getParent(p)});
  const parent=fsData[getParent(p)];
  if(parent&&parent.children) parent.children=parent.children.filter(c=>c!==p);
  delete fsData[p];
  const di=document.getElementById('di'+getFName(p).replace(/\./g,''));
  if(di) di.remove();
  renderExpFiles();
}
function showFileProps(p){
  const n=fsData[p]; if(!n) return;
  const name=n.label||getFName(p);
  document.getElementById('propsTitle').textContent='מאפיינים - '+name;
  document.getElementById('propsBody').innerHTML=`
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px;">
      <span style="font-size:32px;">${getFileIcon(n,p)}</span>
      <div><div style="font-weight:bold;">${name}</div><div style="color:#666;font-size:11px;">${n.ext?n.ext.toUpperCase()+' קובץ':'תיקייה'}</div></div>
    </div>
    <div style="border-top:1px solid #ddd;padding-top:10px;">
      <div><b>מיקום:</b> ${getParent(p)}</div>
      <div><b>גודל:</b> ${n.size||'—'}</div>
      <div><b>נוצר:</b> ${n.created||'—'}</div>
      <div><b>סוג:</b> ${n.type==='dir'?'תיקייה':(n.ext||'קובץ')}</div>
    </div>
    <div style="margin-top:14px;">
      <button onclick="closeWin('propsWin','')" style="padding:4px 16px;border:1px solid #999;cursor:pointer;background:#f0f0f0;">סגור</button>
    </div>`;
  openWin('propsWin','');
}

// ============================================================
// RECYCLE BIN
// ============================================================
function renderRecycle(){
  const cont=document.getElementById('recycleFiles'); cont.innerHTML='';
  if(!recycleItems.length){ cont.innerHTML='<div style="padding:20px;color:#888;">סל המחזור ריק</div>'; return; }
  recycleItems.forEach((item,idx)=>{
    const n=item.node;
    const el=document.createElement('div'); el.className='fIcon';
    el.innerHTML=`<div class="fIco">${getFileIcon(n,item.path)}</div><div class="fLbl">${n.label||getFName(item.path)}</div>`;
    el.oncontextmenu=e=>{
      e.preventDefault(); recycleCtxItem=idx;
      const m=document.getElementById('recycleCtx');
      m.style.display='block'; m.style.left=e.clientX+'px'; m.style.top=e.clientY+'px';
    };
    cont.appendChild(el);
  });
}
function recycleRestore(){
  hideAllCtx(); if(recycleCtxItem===null) return;
  const item=recycleItems[recycleCtxItem];
  // Restore to original parent, fallback to Desktop
  let targetParent=item.originalParent;
  if(!fsData[targetParent]) targetParent='C:\\Desktop';
  // Put file in target parent
  const restoredPath=targetParent+'\\'+getFName(item.path);
  fsData[restoredPath]={...item.node};
  const parent=fsData[targetParent];
  if(parent&&parent.children&&!parent.children.includes(restoredPath))
    parent.children.push(restoredPath);
  // If dec.exe, add desktop icon
  if(item.path.includes('dec.exe')){ decRestored=true; addDecIcon(); }
  recycleItems.splice(recycleCtxItem,1); recycleCtxItem=null;
  renderRecycle(); showModal('שחזור','הקובץ שוחזר בהצלחה.');
}
function recyclePermDel(){
  hideAllCtx(); if(recycleCtxItem===null) return;
  const item=recycleItems[recycleCtxItem];
  const name=item.node.label||getFName(item.path);
  const isImportant=['dec.exe','enc.txt','dec.txt'].some(x=>item.path.includes(x));
  const idx=recycleCtxItem;
  if(isImportant){
    showModal('⚠️ מחיקה לצמיתות',`הקובץ "${name}" חשוב למשחק!\nמחיקתו תדרוש התחלה מחדש. בטוח?`,[
      {l:'מחק לצמיתות', cb:()=>{ recycleItems.splice(idx,1); recycleCtxItem=null; renderRecycle(); }},
      {l:'ביטול'}
    ]);
  } else {
    recycleItems.splice(idx,1); recycleCtxItem=null; renderRecycle();
  }
}
