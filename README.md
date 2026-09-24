# Fekry Mansour Portfolio

## Public site files
- `index.html` — page structure and content.
- `styles.css` — responsive styling, navigation, animations, and assistant UI.
- `main.js` — navigation, scrollspy, scroll progress, reveal motion, skills marquee, and on-demand loading of the assistant (`data.js` + `chatbot.js` load after the page is idle or on first use).
- `visitor-stats.js` — sends one row per visit to the "Portfolio Visitor" Google Form.
- `data.js` — public CV data used to ground the assistant.
- `chatbot.js` — browser-side AI client, link handling, local guardrails, and Cloudflare Worker requests.
- `certification-icons/` — certification/provider images.
- `skill-icons/` — skill/logo images.

## Visitor statistics
`visitor-stats.js` sends one visit summary (device, browser, referrer, time spent, sections viewed, scroll depth, links clicked, chatbot use) to the `visit-stats` Cloudflare Worker when the visitor leaves or switches away from the tab. The Worker adds IP, country, city, and ISP from Cloudflare and records the row in the "Portfolio Visitor" Google Form. The form ID and field IDs live only in the Worker, never in this repository.

- Visit the site once with `?notrack` to stop counting your own visits in that browser (`?track` turns it back on).
- Visit with `?statsdebug` to print the summary in the browser console instead of sending it.
- To use a different Worker, update `STATS_URL` at the top of `visitor-stats.js`.

## AI integration
The portfolio does not contain a Fanar API key. The browser sends chat requests to:

`https://chat-proxy.fekry-n-mansour.workers.dev`

The Cloudflare Worker is responsible for holding the provider secret and forwarding the request server-side.

The browser also applies local guardrails for:
- prompt-injection attempts and requests for hidden/system instructions;
- generic coding/programming requests that are unrelated to Fekry's CV;
- clearly unrelated general-purpose topics (for example recipes or other non-CV requests);
- private/confidential data requests such as bank details, home address information, passwords, API keys, and private keys;
- public contact questions that can be answered directly from the CV, including combined phone/email/link requests, which avoids unnecessary model/provider filtering for public contact details.

For real security, the Worker should enforce the same scope and sensitive-data rules server-side. Client-side JavaScript can be inspected by visitors, so the Worker must remain the final enforcement layer.

To use a different worker, update `CHAT_CONFIG.apiUrl` in `chatbot.js`.

## GitHub Pages
Upload the contents of this folder to the repository used for GitHub Pages. Keep the folder structure unchanged so the image paths continue to work.
