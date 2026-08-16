// HOSTEL.OS V10 — Spotify Music.EXE
(function(){
"use strict";
const $=id=>document.getElementById(id);
const boot=$("boot"),desktop=$("desktop"),bar=$("bootBar"),bootText=$("bootText");
const steps=["INITIALIZING RESIDENT SYSTEM...","CHECKING MESS STATUS...","LOADING CAMPUS INTERNET...","COUNTING AWAKE RESIDENTS...","SYSTEM READY."];
let progress=0,step=0;
const bt=setInterval(()=>{progress+=5;if(bar)bar.style.width=progress+"%";if(progress%20===0&&bootText)bootText.textContent=steps[Math.min(step++,4)];if(progress>=100){clearInterval(bt);setTimeout(()=>{boot.style.display="none";desktop.classList.remove("hidden")},300)}},50);
function clock(){const d=new Date();$("clock").textContent=d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}).toUpperCase()}clock();setInterval(clock,1000);
let online=127;setInterval(()=>{$("online").textContent=online+(Math.random()>.5?1:-1)},3000);
const logs=["ROOM 302 ORDERED 7 MAGGIS","BLOCK B WIFI HAS ENTERED THE VOID","SOMEONE IS PLAYING GTA V","⚠️ EXAM IN 3 DAYS","MESS CHICKEN RATING: 3.8/5","ROOM 214 STARTED FIFA","WHO LEFT THE LIGHTS ON?"];let li=0;setInterval(()=>{$("log").textContent=logs[li++%logs.length]},3000);

const layer=$("windowLayer");
const tracks=[
 {name:"Sahiba",artist:"Aditya Rikhari",id:"0eLtIxPRNJfsmehITZ1qaJ"},
 {name:"Saiyaara",artist:"Tanishk Bagchi, Faheem Abdullah, Arslan Nizami",id:"1XbFQ7JxVTMcOioBx5HOfF"},
 {name:"Sailor Song",artist:"Gigi Perez",id:"21IYMdzTrzSe191Cy5eMap"},
 {name:"Pal Pal",artist:"Afusic, AliSoomroMusic",id:"4LMlVCXHJtCE9abhmn0mYo"},
 {name:"Finding Her",artist:"Kushagra, Bharath, Saaheal",id:"5ThyDv6aRVU8AH4vXQNldF"}
];
let current=0,musicWin=null;

function spotifySrc(id){
 return "https://open.spotify.com/embed/track/"+id+"?utm_source=generator&theme=0";
}
function musicBody(){
 const t=tracks[current];
 return `<span class="tag">HOSTEL NIGHT PLAYLIST · SPOTIFY</span>
 <div class="music-title-row"><div><h2>THE<br><em>VIBE.</em></h2><p><b>${t.name}</b> · ${t.artist}</p></div></div>
 <div class="spotify-frame"><iframe id="spotifyFrame" src="${spotifySrc(t.id)}" width="100%" height="352" frameborder="0" allowtransparency="true" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>
 <div class="track-list">${tracks.map((x,i)=>`<button class="track-row ${i===current?"active":""}" data-track="${i}"><span>${String(i+1).padStart(2,"0")}</span><b>${x.name}</b><small>${x.artist}</small></button>`).join("")}</div>
 <p class="tag" style="margin-top:14px">Spotify controls playback. — MIN keeps MUSIC.EXE open as a mini-player.</p>`;
}
function openMusic(){
 if(musicWin){musicWin.style.display="block";musicWin.classList.remove("music-mini");return;}
 musicWin=document.createElement("section");musicWin.className="win music-win";
 musicWin.innerHTML=`<div class="winbar"><span>HOSTEL.OS / MUSIC.EXE</span><div style="display:flex;gap:6px"><button class="music-min" id="musicMin">—</button><button class="close" id="musicClose">×</button></div></div><div class="winbody">${musicBody()}</div>`;
 layer.appendChild(musicWin);bindMusic();
}
function bindMusic(){
 musicWin.querySelector("#musicMin").onclick=()=>musicWin.classList.add("music-mini");
 musicWin.querySelector("#musicClose").onclick=()=>{musicWin.remove();musicWin=null};
 musicWin.querySelectorAll("[data-track]").forEach(b=>b.onclick=()=>{
   current=Number(b.dataset.track);
   musicWin.querySelector(".winbody").innerHTML=musicBody();
   bindMusic();
 });
}

function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function getPosts(){try{return JSON.parse(localStorage.getItem("hostelOSConfessions")||"[]")}catch{return[]}}
function savePosts(p){localStorage.setItem("hostelOSConfessions",JSON.stringify(p))}
function listPosts(){const p=getPosts();if(!p.length)return '<div class="empty">NO CONFESSIONS YET.<br>BE THE FIRST TO DROP ONE.</div>';return p.slice().reverse().map((x,i)=>`<div class="conf-item"><small>ANONYMOUS #${String(p.length-i).padStart(4,"0")}</small><p>${esc(x.text)}</p><div class="conf-meta">💬 ${x.reactions||0} reactions · ${esc(x.time)}</div></div>`).join("")}
function makeWin(title,body){const el=document.createElement("section");el.className="win";el.innerHTML=`<div class="winbar"><span>HOSTEL.OS / ${title}</span><button class="close">×</button></div><div class="winbody">${body}</div>`;layer.appendChild(el);el.querySelector(".close").onclick=()=>el.remove();return el}
function openConfess(){
 const el=makeWin("CONFESS.EXE",`<span class="tag">ANONYMOUS CORNER</span><h2>DROP IT.</h2><p>Demo mode: posts stay in this browser.</p><textarea id="confText" maxlength="180" placeholder="I have been pretending to understand recursion..."></textarea><div style="display:flex;justify-content:space-between;align-items:center"><small id="chars">0/180</small><button class="send" id="sendConf">POST ANONYMOUSLY ↗</button></div><p id="confStatus"></p><hr style="border:0;border-top:1px solid #aaa;margin:25px 0"><span class="tag">RECENT LOCAL POSTS</span><div id="confList">${listPosts()}</div>`);
 const input=el.querySelector("#confText");input.oninput=()=>el.querySelector("#chars").textContent=input.value.length+"/180";
 el.querySelector("#sendConf").onclick=()=>{const t=input.value.trim();if(t.length<3){el.querySelector("#confStatus").textContent="Write at least 3 characters 😭";return}const p=getPosts();p.push({text:t,time:new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}),reactions:0});savePosts(p.slice(-30));input.value="";el.querySelector("#chars").textContent="0/180";el.querySelector("#confStatus").textContent="Posted anonymously on this browser. 🫡";el.querySelector("#confList").innerHTML=listPosts()}
}
function escapeHtml(value){
 const div=document.createElement("div");
 div.textContent=String(value ?? "");
 return div.innerHTML;
}

function escapeHtml(v){const d=document.createElement("div");d.textContent=String(v??"");return d.innerHTML}
function trendCard(x,i){
  return `<article class="trend-card">
    <div class="trend-img">${x.image?`<img src="${escapeHtml(x.image)}" loading="lazy" onerror="this.parentElement.innerHTML='<span>🔥</span>'">`:`<span>🔥</span>`}</div>
    <div class="trend-body">
      <div class="meme-source">🔥 ${escapeHtml(x.community)} · ${escapeHtml(x.age)}</div>
      <h3>${escapeHtml(x.title)}</h3>
      <p>${escapeHtml(x.why)}</p>
      <div class="trend-stats">▲ ${Number(x.ups||0).toLocaleString("en-IN")} · 💬 ${Number(x.comments||0).toLocaleString("en-IN")}</div>
      <a class="meme-link" href="${escapeHtml(x.link)}" target="_blank" rel="noopener">OPEN ORIGINAL ↗</a>
    </div>
  </article>`
}
async function fetchTrends(el,term=""){
  const grid=el.querySelector("#trendGrid"),status=el.querySelector("#trendStatus");
  status.textContent="SCANNING INDIAN MEME COMMUNITIES...";
  grid.innerHTML='<div class="meme-loading">🔥 FINDING WHAT INDIA IS ACTUALLY MEMEING<br><span>NOT GENERIC TEMPLATES.</span></div>';
  try{
    const r=await fetch(`/api/trends?t=${Date.now()}`,{cache:"no-store"});
    const d=await r.json();
    if(!r.ok||!d.ok)throw Error(d.error||`HTTP ${r.status}`);
    let a=d.trends||[];
    if(term)a=a.filter(x=>x.title.toLowerCase().includes(term.toLowerCase()));
    if(!a.length)throw Error(term?`No current ${term} posts found.`:"No current meme posts found.");
    grid.innerHTML=a.map(trendCard).join("");
    status.textContent=`LIVE INDIA MEMES · ${a.length} POSTS · REDDIT RSS · UPDATED JUST NOW`;
  }catch(e){
    status.textContent="TREND RADAR ERROR";
    grid.innerHTML=`<div class="meme-loading"><b>MEME RADAR FUMBLED 😭</b><br><br>${escapeHtml(e.message)}<br><br><button class="send" id="retryTrends">↻ TRY AGAIN</button></div>`;
    el.querySelector("#retryTrends")?.addEventListener("click",()=>fetchTrends(el,term));
  }
}
function openMemes(){
  const el=makeWin("MEMES.EXE",`
    <div class="meme-head">
      <div><span class="tag">LIVE INDIAN MEME RADAR</span><h2>WHAT'S<br><em>COOKING.</em></h2></div>
      <button class="send" id="refreshTrends">↻ REFRESH</button>
    </div>
    <div class="meme-tabs">
      <button class="meme-tab active" id="allTrends">🔥 INDIA NOW</button>
      <button class="meme-tab" id="raviOnly">🗿 RAVI KISHAN</button>
    </div>
    <p id="trendStatus" class="tag">LOADING...</p>
    <div id="trendGrid" class="trend-grid"></div>
    <p class="tag" style="margin-top:15px">Ranked from current Indian meme-community posts by freshness + engagement. Open ORIGINAL to view the source post.</p>
  `);
  el.querySelector("#refreshTrends").onclick=()=>fetchTrends(el);
  el.querySelector("#allTrends").onclick=()=>fetchTrends(el);
  el.querySelector("#raviOnly").onclick=()=>fetchTrends(el,"ravi kishan");
  fetchTrends(el);
}

function openApp(type){
 if(type==="music"){openMusic();return}
 if(type==="confess"){openConfess();return}
 if(type==="memes"){openMemes();return}

 let title,body;
 if(type==="mess"){title="MESS.EXE";body='<span class="tag">TODAY’S DAMAGE</span><h2>RATE IT.</h2><div class="poll"><button data-food>🍗 Chicken — ⭐⭐⭐⭐☆</button><button data-food>🥔 Aloo — ⭐⭐☆☆☆</button><button data-food>🍚 Rice — ⭐⭐⭐☆☆</button><button data-food>🥘 Dal — ⭐☆☆☆☆</button></div><p id="foodStatus">Click a dish.</p>'}
 else if(type==="games"){title="GAMES.EXE";body='<span class="tag">AVOID STUDYING</span><h2>SURVIVE.</h2><div class="game"><h3 id="gameScore">0%</h3><div class="meter"><i id="meter"></i></div><button class="action" id="survive">CLICK TO SURVIVE</button></div>'}
 else{title="CAMPUS.EXE";body='<span class="tag">WHAT’S HAPPENING</span><h2>TONIGHT.</h2><p>🎸 <b>BAND NIGHT</b><br>8:00 PM · AUDITORIUM</p><p>🏏 <b>HOSTEL CRICKET</b><br>5:30 PM · GROUND</p><p>🎮 <b>GAMING NIGHT</b><br>10:00 PM · BLOCK B</p>'}
 const el=makeWin(title,body);
 if(type==="mess")el.querySelectorAll("[data-food]").forEach(b=>b.onclick=()=>el.querySelector("#foodStatus").textContent="Vote recorded: "+b.textContent+".");
 if(type==="games"){let score=0;el.querySelector("#survive").onclick=function(){score=Math.min(100,score+10);el.querySelector("#gameScore").textContent=score+"%";el.querySelector("#meter").style.width=score+"%";if(score===100)this.textContent="YOU SURVIVED 💀"}}
}

document.addEventListener("click",e=>{const app=e.target.closest(".app");if(app){e.preventDefault();openApp(app.dataset.window)}});
$("random").onclick=()=>{$("log").textContent=logs[Math.floor(Math.random()*logs.length)]};
})();
