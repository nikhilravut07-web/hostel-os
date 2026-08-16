V20 — LIVE INDIAN MEME RADAR.

V20 fixes the core mistake in V19: it no longer treats news articles as memes and it does not hard-code Ravi Kishan.

The Vercel /api/trends.js endpoint reads current public posts from Indian meme communities on Reddit:
- r/indiameme
- r/IndianDankMemes
- r/memes

It ranks posts using freshness + upvotes + comments, prefers posts with actual image previews, and links to the original Reddit post. Ravi Kishan is only a filter, not the feed.

This still does not scrape Instagram. Instagram's general Explore feed is not available through a public arbitrary-site API. The source cards are real community posts, not generic Imgflip templates.

Vercel is required because api/trends.js is a serverless function.
