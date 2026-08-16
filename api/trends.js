const SUBS = ["indiameme","IndianDankMemes","memes"];
const UA = "HOSTEL.OS/2.0 (India trend radar)";

function clean(v=""){
  return String(v).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").trim();
}
function ago(ts){
  const h=Math.max(0,(Date.now()-ts*1000)/3600000);
  if(h<1) return `${Math.max(1,Math.round(h*60))}m ago`;
  if(h<24) return `${Math.round(h)}h ago`;
  return `${Math.round(h/24)}d ago`;
}
function imageOf(p){
  const u=p?.url_overridden_by_dest || p?.url || "";
  if(p?.post_hint==="image" && /^https?:/i.test(u)) return u;
  const src=p?.preview?.images?.[0]?.source?.url;
  if(src) return clean(src);
  return "";
}
function score(p){
  const hours=Math.max(0,(Date.now()-p.created_utc*1000)/3600000);
  const fresh=Math.max(0,30-hours);
  const engagement=Math.min(30,Math.log10(Math.max(1,p.ups))*10);
  const comments=Math.min(15,Math.log10(Math.max(1,p.num_comments))*7);
  return fresh+engagement+comments;
}
function titleOk(t){
  const s=(t||"").toLowerCase();
  return !["megathread","rules","announcement","join our","mod post"].some(x=>s.includes(x));
}
async function reddit(sub){
  const u=`https://www.reddit.com/r/${sub}/hot.json?limit=40`;
  const r=await fetch(u,{headers:{"User-Agent":UA}});
  if(!r.ok) throw new Error(`Reddit r/${sub} HTTP ${r.status}`);
  const j=await r.json();
  return (j?.data?.children||[]).map(x=>x.data).filter(p=>p&&!p.stickied&&titleOk(p.title));
}
function why(p){
  const s=(p.title||"").toLowerCase();
  if(/ravi kishan/.test(s)) return "Ravi Kishan is one of the current Indian meme waves — but only ranked here if the community is actually posting/engaging with it.";
  if(/dhurandar|dhu[r]?andhar/.test(s)) return "A current Indian pop-culture topic showing up in meme-community posts.";
  if(/six seven|6.?7/.test(s)) return "A Gen-Z internet phrase being remixed into Indian meme formats.";
  if(/cricket|football|india|pakistan|ipl/.test(s)) return "Sports + Indian internet reaction = instant meme fuel.";
  return "Picked from current Indian meme-community activity, not from a static template library.";
}

export default async function handler(req,res){
  try{
    const all=[];
    const results=await Promise.allSettled(SUBS.map(reddit));
    results.forEach((r,i)=>{
      if(r.status==="fulfilled"){
        r.value.forEach(p=>all.push({
          id:p.id, title:clean(p.title), link:`https://www.reddit.com${p.permalink}`,
          image:imageOf(p), sub:SUBS[i], created_utc:p.created_utc,
          ups:p.ups||0, comments:p.num_comments||0, score:score(p), why:why(p)
        }));
      }
    });

    const seen=new Set();
    let posts=all.filter(p=>{
      if(seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).sort((a,b)=>b.score-a.score);

    // Prefer image posts, but keep a few text/video trend signals so the feed isn't empty.
    const imagePosts=posts.filter(p=>p.image);
    const otherPosts=posts.filter(p=>!p.image);
    posts=[...imagePosts.slice(0,14),...otherPosts.slice(0,6)].slice(0,18);

    // If Reddit gives no image URL for a post, the card still links to the original post.
    res.setHeader("Cache-Control","s-maxage=180, stale-while-revalidate=600");
    return res.status(200).json({
      ok:true,
      source:"Indian Reddit meme communities",
      updatedAt:new Date().toISOString(),
      trends:posts.map(p=>({
        id:p.id,title:p.title,link:p.link,image:p.image,
        community:`r/${p.sub}`,age:ago(p.created_utc),
        ups:p.ups,comments:p.comments,why:p.why
      }))
    });
  }catch(e){
    return res.status(500).json({ok:false,error:e.message||"Trend radar failed"});
  }
}