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
let memeFeedCache={};

const indiaCaptions=[
 "Bhai said 'kal se padhunga' for the 17th time. 💀",
 "POV: you opened the hostel group chat at 2 AM.",
 "Average Indian engineering student survival strategy. 😭",
 "Attendance: 73%. Confidence: 100%.",
 "When the mess says 'special dinner' 💀",
 "Exam tomorrow. Brain today: absolutely not.",
 "Bro has entered Indian college final-boss mode.",
 "Parents: placement? Me: one sec, meme dekh raha hoon."
];

function memeCaption(title,source){
 const t=String(title||"").toLowerCase();
 if(source==="india"){
   if(t.includes("drake")) return "The most Indian college decision ever. 😭";
   if(t.includes("two buttons")) return "Studying vs one more episode. We all know who wins.";
   if(t.includes("distracted")) return "POV: lecture chal raha hai, but the group chat pinged.";
   return indiaCaptions[Math.floor(Math.random()*indiaCaptions.length)];
 }
 if(source==="genz") return "The timeline has officially lost the plot. 💀";
 return "No context. No explanation. Just vibes. 😭";
}

function memeCard(m,source){
 return `<article class="meme-card">
   <div class="meme-image-wrap"><img src="${m.url}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.closest('.meme-card').remove()"></div>
   <div class="meme-card-body">
     <div class="meme-source">IMGFLIP · POPULAR MEME</div>
     <h3>${escapeHtml(m.name)}</h3>
     <p class="meme-caption">${escapeHtml(memeCaption(m.name,source))}</p>
     <a href="https://imgflip.com/memetemplate/${encodeURIComponent(m.id)}" target="_blank" rel="noopener" class="meme-link">OPEN ORIGINAL ↗</a>
   </div>
 </article>`;
}

async function loadMemes(el,source="india"){
 const grid=el.querySelector("#memeGrid");
 const status=el.querySelector("#memeStatus");
 status.textContent="FETCHING FRESH MEMES...";
 grid.innerHTML='<div class="meme-loading">HOSTEL.OS → VERCEL → IMGFLIP<br><span>SCANNING THE MEME INTERNET...</span></div>';

 try{
   const response=await fetch(`/api/memes?t=${Date.now()}`,{
     cache:"no-store",
     headers:{Accept:"application/json"}
   });
   const data=await response.json();

   if(!response.ok || !data.ok) {
     throw new Error(data.error || `API HTTP ${response.status}`);
   }

   let memes=Array.isArray(data.memes)?data.memes:[];
   if(!memes.length) throw new Error("Imgflip returned 0 memes");

   // Keep popular templates that fit the requested vibe near the front.
   const keywords=source==="india"
     ? ["drake","two buttons","distracted","uno","mocking","woman yelling","change my mind","expanding brain","waiting skeleton","trade offer","bike fall"]
     : ["drake","uno","trade offer","mocking","brain","bike fall","monkey"];

   const preferred=memes.filter(m=>keywords.some(k=>m.name.toLowerCase().includes(k)));
   memes=[...preferred,...memes.filter(m=>!preferred.includes(m))];

   memeFeedCache[source]=memes.slice(0,18);
   grid.innerHTML=memeFeedCache[source].map(m=>memeCard(m,source)).join("");
   status.textContent=`LIVE FEED · ${memeFeedCache[source].length} MEMES · IMGFLIP`;
 }catch(error){
   status.textContent="MEME FEED ERROR";
   grid.innerHTML=`<div class="meme-loading">
     <b>THE MEME SERVER FUMBLED 😭</b><br><br>
     <small>${escapeHtml(error.message)}</small><br><br>
     <button class="send" id="retryMemes">↻ TRY AGAIN</button>
   </div>`;
   el.querySelector("#retryMemes")?.addEventListener("click",()=>loadMemes(el,source));
 }
}

function openMemes(){
 const el=makeWin("MEMES.EXE",`
   <div class="meme-head">
     <div><span class="tag">LIVE MEME FEED</span><h2>THE<br><em>CHAOS.</em></h2></div>
     <button class="send" id="refreshMemes">↻ REFRESH</button>
   </div>
   <div class="meme-tabs">
     <button class="meme-tab active" data-source="india">🇮🇳 INDIA VIBE</button>
     <button class="meme-tab" data-source="genz">🧠 GEN Z</button>
     <button class="meme-tab" data-source="global">🌍 GLOBAL</button>
   </div>
   <p id="memeStatus" class="tag">LOADING...</p>
   <div id="memeGrid" class="meme-grid"></div>
   <p class="tag" style="margin-top:15px">Fresh popular templates from Imgflip · served through HOSTEL.OS.</p>
 `);

 el.querySelector("#refreshMemes").onclick=()=>loadMemes(el,el.querySelector(".meme-tab.active").dataset.source);
 el.querySelectorAll(".meme-tab").forEach(tab=>tab.onclick=()=>{
   el.querySelectorAll(".meme-tab").forEach(x=>x.classList.remove("active"));
   tab.classList.add("active");
   loadMemes(el,tab.dataset.source);
 });
 loadMemes(el,"india");
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
