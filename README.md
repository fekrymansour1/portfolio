# Fekry Mansour — Portfolio Site

A static, single-page site built from your CV (`cv-data.js`), styled with an
Apple-inspired look, with an on-page chatbot that answers questions using
only your CV content.

## Files

- `index.html` — page structure
- `styles.css` — all styling
- `cv-data.js` — your CV content as structured data (edit this to update the site)
- `script.js` — renders the page from `cv-data.js`
- `chatbot.js` — chatbot UI + logic; sends requests to a proxy endpoint (no key or provider details ever live here)
- `images/profile.jpg` — your headshot, used in the nav bar and hero section

## How the chatbot works

The browser never talks to an AI API directly. `chatbot.js` posts the
conversation to a small serverless proxy (`CHAT_CONFIG.apiUrl`), which holds
the real API key and provider details as a server-side secret and forwards
the request. This keeps the key, the provider, and the model name out of
the page source, the Network tab, and the git history.

If you ever need to change providers or the proxy URL, that's a one-line
edit in `CHAT_CONFIG.apiUrl` in `chatbot.js` — nothing else in the frontend
needs to know what's behind that URL.

## Updating your photo

Replace `images/profile.jpg` with a new file of the same name (a square
image works best, since it's cropped into a circle), or update the `photo`
path referenced in `index.html` (`.nav-avatar` and `.hero-photo` images).

## 1. Test locally

Browsers block some JavaScript features (like `fetch`) when you open an
HTML file directly with `file://`. Instead, serve the folder locally:

**Option A — Python (if installed):**
1. Open a terminal in this folder.
2. Run: `python -m http.server 8000`
3. Open `http://localhost:8000` in your browser.

**Option B — VS Code:**
1. Install the "Live Server" extension.
2. Right-click `index.html` → "Open with Live Server".

**Option C — Node (if installed):**
1. `npx serve .`
2. Open the URL it prints.

Check that:
- All CV sections render correctly.
- Your photo appears in the nav bar and hero section.
- The chat bubble (bottom-right) opens and responds.
- Asking something outside your CV (e.g. "what's the weather today?") gets
  politely declined rather than answered.
- Open DevTools → Network tab, send a chat message, and confirm the request
  goes only to your proxy URL, with no API key or provider name visible in
  the request or response.

## 2. Publish to GitHub Pages

This site lives in the `portfolio` repo, so it will be served at:
`https://fekrymansour1.github.io/portfolio`

1. Push these files (including the `images/` folder) to the `main` branch
   of the `portfolio` repo.
2. In the repo, go to **Settings → Pages**, set **Source** to `Deploy from
   a branch`, **Branch** to `main` / `/ (root)`, then **Save**.
3. Your site will be live at `https://fekrymansour1.github.io/portfolio`
   within a few minutes.

## Updating your info later

Everything on the page — name, experience, projects, skills, certifications
— comes from `CV_DATA` in `cv-data.js`. Edit that object and reload the
page; you don't need to touch the HTML or CSS.
