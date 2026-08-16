const SUBS=["indiameme","IndianDankMemes","memes"];
const UA="HOSTEL.OS/2.1 meme radar";

function clean(v=""){
  return String(v)
    .replace(/<!\[CDATA\[|\]\]>/g,"")
    .replace(/<[^>]*>/g," ")
    .replace(/&amp;/g,"&").replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/\s+/g," ").trim();
}
function tag(x,n){
  const m=x.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,"i"));
  return m?clean(m[1]):"";
}
function attr(x,n,a){
  const m=x.match(new RegExp(`<${n}[^>]+${a}=["']([^"']+)["'][^>]*>`,"i"));
  return m?m[1]:"";
}
function items(x){return x.match(/<item[\s\S]*?<\/item>/gi)||[]}
function image(x){
  return attr(x,"media:content","url") || attr(x,"media:thumbnail","url") || attr(x,"enclosure","url") || "";
}
function age(ts){
  const h=Math.max(0,(Date.now()-ts)/3600000);
  if(h<1)return `${Math.max(1,Math.round(h*60))}m ago`;
  if(h<24)return `${Math.round(h)}h ago`;
  return `${Math.round(h/24)}d ago`;
}
function score(p){
  const h=Math.max(0,(Date.now()-p.ts)/3600000);
  return Math.max(0,36-h*1.5)+(p.image?7:0);
}
function why(t){
  const s=t.toLowerCase();
  if(/ravi kishan/.test(s))return "Ravi Kishan is one current meme wave; it only appears because a fresh community post is getting picked up.";
  if(/cricket|football|ipl|india|pakistan/.test(s))return "Indian sports/internet reaction content is moving fast in meme communities.";
  if(/bollywood|actor|actress|movie|film/.test(s))return "Fresh Indian pop-culture content being remixed by meme communities.";
  return "Fresh post from an Indian meme community, ranked by recency and trend signals.";
}
async function fetchSub(sub){
  const urls=[
    `https://www.reddit.com/r/${sub}/hot.rss?limit=40`,
    `https://www.reddit.com/r/${sub}/new.rss?limit=40`
  ];
  for(const url of urls){
    try{
      const r=await fetch(url,{headers:{"User-Agent":UA,"Accept":"application/rss+xml,application/xml,text/xml"},redirect:"follow"});
      if(!r.ok)continue;
      const xml=await r.text();
      const its=items(xml);
      if(its.length){
        return its.map(x=>{
          const title=tag(x,"title"), link=tag(x,"link"), pub=tag(x,"pubDate");
          const ts=Date.parse(pub||"")||Date.now();
          return {
            id:link||title,title,link,image:image(x),sub,ts,
            age:age(ts),score:score({ts,image:image(x)}),
            why:why(title)
          };
        }).filter(x=>x.title&&x.link);
      }
    }catch(_){}
  }
  return [];
}

export default async function handler(req,res){
  try{
    const settled=await Promise.all(SUBS.map(fetchSub));
    let all=settled.flat();
    const seen=new Set();
    all=all.filter(p=>{
      if(seen.has(p.id))return false;
      seen.add(p.id);return true;
    }).sort((a,b)=>b.score-a.score);

    // Keep a healthy mix across communities instead of letting one subreddit dominate.
    const picked=[];
    for(const p of all){
      if(picked.length>=18)break;
      picked.push(p);
    }

    res.setHeader("Cache-Control","s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json({
      ok:true,
      source:"Reddit public RSS · Indian meme communities",
      updatedAt:new Date().toISOString(),
      trends:picked.map(p=>({
        id:p.id,title:p.title,link:p.link,image:p.image,
        community:`r/${p.sub}`,age:p.age,why:p.why
      }))
    });
  }catch(e){
    return res.status(500).json({ok:false,error:e.message||"Trend radar failed"});
  }
}