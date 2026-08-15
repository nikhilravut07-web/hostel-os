export default async function handler(req, res) {
  try {
    const url = "https://api.imgflip.com/get_memes?type=image";
    const response = await fetch(url, {
      headers: { "User-Agent": "HOSTEL.OS/1.0" }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: `Imgflip returned HTTP ${response.status}`
      });
    }

    const data = await response.json();

    if (!data.success || !data.data || !Array.isArray(data.data.memes)) {
      return res.status(502).json({
        ok: false,
        error: "Imgflip returned an unexpected response"
      });
    }

    const memes = data.data.memes
      .filter(m => m && m.url && /^https?:\/\//i.test(m.url))
      .slice(0, 100)
      .map(m => ({
        id: String(m.id),
        name: m.name || "Untitled meme",
        url: m.url,
        width: m.width || 0,
        height: m.height || 0
      }));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    return res.status(200).json({
      ok: true,
      count: memes.length,
      memes,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Server error"
    });
  }
}
