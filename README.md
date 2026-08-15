# HOSTEL.OS V16 — Imgflip Feed + Vercel Proxy

V15 failed because the browser was trying to call Imgflip directly. Some browsers/deployments block that cross-origin request (CORS), so the UI only saw a generic "feed failed".

V16 fixes the architecture:

Browser
  -> /api/memes on the same HOSTEL.OS domain
  -> Vercel serverless function
  -> Imgflip API
  -> JSON back to HOSTEL.OS

The browser no longer calls api.imgflip.com directly.

The official Imgflip `/get_memes` endpoint is free and returns popular user-uploaded meme templates. See https://imgflip.com/api.

Deployment:
1. Replace the entire project with this V16.
2. Deploy the folder containing `index.html`, `script.js`, `style.css`, `api/memes.js`, and `vercel.json`.
3. In Vercel, make sure the project Root Directory is this folder.
4. Open HOSTEL.OS and click MEMES.EXE.

If the API still fails, open:
https://YOUR-DOMAIN.vercel.app/api/memes

You should see JSON beginning with `{"ok":true,...}`.
