/* ============================================================
   visitor-stats.js
   Sends one visit summary to the stats Worker
   when the visitor leaves or switches away from the tab. The
   Worker adds location and stores the visit.

   - Open the site once with ?notrack to stop recording your own
     visits in that browser (?track turns it back on).
   - Open with ?statsdebug to print the summary in the console
     instead of sending it.
   ============================================================ */

(() => {
  const STATS_URL = "https://visit-stats.fekry-n-mansour.workers.dev";

  const store = (area) => ({
    get(key) { try { return window[area].getItem(key); } catch { return null; } },
    set(key, value) { try { window[area].setItem(key, value); } catch { /* storage blocked */ } },
    remove(key) { try { window[area].removeItem(key); } catch { /* storage blocked */ } }
  });
  const local = store("localStorage");
  const session = store("sessionStorage");

  const params = new URLSearchParams(location.search);
  if (params.has("notrack")) local.set("fm_notrack", "1");
  if (params.has("track")) local.remove("fm_notrack");
  const debug = params.has("statsdebug");
  if (!debug && (local.get("fm_notrack") || navigator.webdriver)) return;

  const startedAt = Date.now();
  const ua = navigator.userAgent;

  /* ---------- Device, OS, browser ---------- */

  let hints = {};
  navigator.userAgentData?.getHighEntropyValues?.(["model", "platformVersion"])
    .then((values) => { hints = values || {}; })
    .catch(() => {});

  const isIPadDesktopMode = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

  function deviceType() {
    if (/iPad|Tablet/i.test(ua) || isIPadDesktopMode || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "Tablet";
    if (navigator.userAgentData?.mobile || /Mobi|iPhone|iPod|Android/i.test(ua)) return "Mobile";
    return "Desktop";
  }

  function deviceModel() {
    if (hints.model) return hints.model;
    if (/iPhone/.test(ua)) return "iPhone";
    if (/iPad/.test(ua) || isIPadDesktopMode) return "iPad";
    const android = ua.match(/Android[^;)]*;\s*([^;)]+?)(?:\s+Build\/|\))/);
    if (android && android[1].trim() !== "K") return android[1].trim();
    if (/Macintosh/.test(ua)) return "Mac";
    if (/Windows/.test(ua)) return "Windows PC";
    if (/CrOS/.test(ua)) return "Chromebook";
    return "Unknown";
  }

  function operatingSystem() {
    const major = parseInt(hints.platformVersion, 10);
    if (/Windows NT 10/.test(ua)) {
      if (Number.isFinite(major)) return major >= 13 ? "Windows 11" : "Windows 10";
      return "Windows 10/11";
    }
    if (/Windows/.test(ua)) return "Windows (older)";
    const ios = ua.match(/(?:iPhone|iPad|iPod).*? OS (\d+)_(\d+)/);
    if (ios) return `iOS ${ios[1]}.${ios[2]}`;
    if (isIPadDesktopMode) return "iPadOS";
    if (/Android/.test(ua)) {
      if (hints.platformVersion) return `Android ${hints.platformVersion.split(".")[0]}`;
      const version = ua.match(/Android ([\d.]+)/);
      return version ? `Android ${version[1]}` : "Android";
    }
    if (/CrOS/.test(ua)) return "ChromeOS";
    if (/Mac OS X/.test(ua)) return hints.platformVersion ? `macOS ${hints.platformVersion.split(".")[0]}` : "macOS";
    if (/Linux/.test(ua)) return "Linux";
    return "Unknown";
  }

  function browser() {
    const inApp =
      /LinkedInApp/i.test(ua) ? "LinkedIn app" :
      /FBAN|FBAV/.test(ua) ? "Facebook app" :
      /Instagram/.test(ua) ? "Instagram app" :
      /WhatsApp/i.test(ua) ? "WhatsApp" :
      /Snapchat/i.test(ua) ? "Snapchat" :
      /\bTelegram/i.test(ua) ? "Telegram" : "";

    const engines = [
      ["Edge", /Edg(?:e|A|iOS)?\/(\d+)/],
      ["Opera", /OPR\/(\d+)/],
      ["Samsung Internet", /SamsungBrowser\/(\d+)/],
      ["Chrome", /CriOS\/(\d+)/],
      ["Firefox", /FxiOS\/(\d+)/],
      ["Firefox", /Firefox\/(\d+)/],
      ["Chrome", /Chrome\/(\d+)/],
      ["Safari", /Version\/(\d+).*Safari/]
    ];
    let base = "Unknown";
    for (const [name, pattern] of engines) {
      const match = ua.match(pattern);
      if (match) { base = `${name} ${match[1]}`; break; }
    }
    if (base === "Unknown" && /AppleWebKit/.test(ua) && /Mobile/.test(ua)) base = "Safari WebView";
    return inApp ? `${inApp} in-app browser (${base})` : base;
  }

  /* ---------- Where they came from ---------- */

  function referrer() {
    const utm = params.get("utm_source");
    const suffix = utm ? ` · utm_source=${utm}` : "";
    const raw = document.referrer;

    if (!raw) {
      if (/LinkedInApp/i.test(ua)) return `LinkedIn (app)${suffix}`;
      return `Direct / unknown${suffix}`;
    }

    let host = raw;
    try { host = new URL(raw).hostname.replace(/^www\./, ""); } catch { /* keep raw */ }
    if (host === location.hostname.replace(/^www\./, "")) return `Internal${suffix}`;

    const known = [
      [/linkedin\.com|lnkd\.in|com\.linkedin/i, "LinkedIn"],
      [/google\./i, "Google"],
      [/bing\.com/i, "Bing"],
      [/github\.com/i, "GitHub"],
      [/facebook\.com|fb\.com/i, "Facebook"],
      [/instagram\.com/i, "Instagram"],
      [/t\.co$|twitter\.com|x\.com/i, "X / Twitter"],
      [/whatsapp/i, "WhatsApp"]
    ];
    const label = known.find(([pattern]) => pattern.test(host))?.[1];
    return `${label ? `${label} (${host})` : host}${suffix}`;
  }

  function pageUrl() {
    const url = new URL(location.href);
    ["notrack", "track", "statsdebug"].forEach((key) => url.searchParams.delete(key));
    return url.toString();
  }

  /* ---------- Returning visitor ---------- */

  let visitCount = Number(local.get("fm_visits") || 0);
  if (!session.get("fm_session")) {
    visitCount += 1;
    local.set("fm_visits", String(visitCount));
    session.set("fm_session", "1");
  }
  const visitor = visitCount > 1 ? `Returning (visit #${visitCount})` : "New";

  /* ---------- What they did on the page ---------- */

  const sectionsViewed = [];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id || "home";
      if (!sectionsViewed.includes(id)) sectionsViewed.push(id);
      sectionObserver.unobserve(entry.target);
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  const hero = document.querySelector(".hero");
  if (hero) sectionObserver.observe(hero);
  document.querySelectorAll("[data-section]").forEach((section) => sectionObserver.observe(section));

  let maxScroll = 0;
  let scrollQueued = false;
  function measureScroll() {
    scrollQueued = false;
    const doc = document.documentElement;
    const depth = (window.scrollY + window.innerHeight) / Math.max(1, doc.scrollHeight);
    maxScroll = Math.max(maxScroll, Math.min(1, depth));
  }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(measureScroll); }
  }, { passive: true });
  window.addEventListener("load", measureScroll, { once: true });

  const clicks = new Map();
  function linkLabel(link) {
    const href = link.getAttribute("href") || "";
    const where = link.closest(".hero") ? "hero" : link.closest("#contact") ? "contact" : link.closest(".assistant-output") ? "chatbot" : "";
    const tag = (label) => (where ? `${label} (${where})` : label);

    if (href.startsWith("#")) return null; // in-page navigation is already covered by Sections Viewed
    if (href.startsWith("mailto:")) return tag("Email");
    if (href.startsWith("tel:")) return tag("Phone");
    if (/linkedin\.com/i.test(href)) return tag("LinkedIn");
    if (/github\.com/i.test(href)) return tag("GitHub");

    const cert = link.closest(".cert");
    if (cert) {
      const title = cert.querySelector(".cert-title")?.firstChild?.textContent || "";
      return `Certificate: ${title.split(" — ")[0].trim()}`;
    }

    const text = link.textContent.replace(/[↗\s]+/g, " ").trim();
    return tag(text || href);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const label = linkLabel(link);
    if (label) clicks.set(label, (clicks.get(label) || 0) + 1);
  }, { capture: true, passive: true });

  let chatQuestions = 0;
  document.addEventListener("submit", (event) => {
    if (event.target.id !== "assistantForm") return;
    if (document.getElementById("assistantInput")?.value.trim()) chatQuestions += 1;
  }, true);
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("#assistantPrompts [data-query]")) chatQuestions += 1;
  }, { capture: true, passive: true });

  /* ---------- Formatting ---------- */

  function formatDuration(ms) {
    const total = Math.round(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h) return `${h}h ${m}m ${s}s`;
    if (m) return `${m}m ${s}s`;
    return `${s}s`;
  }

  function visitTime() {
    const date = new Date(startedAt);
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const utc = `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
    return `${date.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })} (${utc})`;
  }

  function connection() {
    const c = navigator.connection;
    if (!c) return "Not shared by this browser";
    const parts = [];
    if (c.type) parts.push(c.type);
    if (c.effectiveType) parts.push(c.effectiveType);
    if (c.downlink) parts.push(`~${c.downlink} Mbps`);
    if (c.saveData) parts.push("data saver on");
    return parts.join(", ") || "Unknown";
  }

  // IP, country, city, and ISP are added by the Worker, not collected here.
  function collect() {
    measureScroll();
    const clicked = [...clicks].map(([label, count]) => (count > 1 ? `${label} ×${count}` : label));

    return {
      visitTime: visitTime(),
      deviceType: deviceType(),
      deviceModel: deviceModel(),
      os: operatingSystem(),
      browser: browser(),
      screen: `${screen.width}x${screen.height} (window ${window.innerWidth}x${window.innerHeight}, ${window.devicePixelRatio || 1}x)`,
      language: (navigator.languages?.length ? navigator.languages : [navigator.language]).join(", "),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
      referrer: referrer(),
      pageUrl: pageUrl(),
      visitor,
      timeSpent: formatDuration(Date.now() - startedAt),
      sections: sectionsViewed.join(", ") || "home",
      scrollDepth: `${Math.round(maxScroll * 100)}%`,
      links: clicked.join(", ") || "None",
      chatbot: chatQuestions ? `Yes (${chatQuestions} question${chatQuestions > 1 ? "s" : ""})` : "No",
      connection: connection(),
      colorScheme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "Dark" : "Light"
    };
  }

  /* ---------- Sending ---------- */

  let sent = false;

  function send() {
    if (sent) return;
    sent = true;

    const visit = collect();
    if (debug) {
      console.table(visit);
      return;
    }

    // text/plain keeps this a "simple" request, so no CORS preflight is needed.
    const body = new Blob([JSON.stringify(visit)], { type: "text/plain" });
    const queued = navigator.sendBeacon?.(STATS_URL, body);
    if (!queued) {
      fetch(STATS_URL, { method: "POST", mode: "no-cors", keepalive: true, body }).catch(() => {});
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") send();
  });
  window.addEventListener("pagehide", send);

  if (debug) {
    window.visitStats = collect;
    console.info("[visitor-stats] debug mode: nothing is sent. Run visitStats() to preview the visit.");
  }
})();
