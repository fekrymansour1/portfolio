/* ============================================================
   main.js
   Navigation, scrollspy, scroll progress, reveal motion,
   skills rail, and on-demand loading of the AI assistant.
   ============================================================ */

const $ = (id) => document.getElementById(id);

/* Navigation */
const nav = $("nav");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const navSections = [...document.querySelectorAll("[data-section]")];
const navToggle = $("navToggle");
const navScrim = $("navScrim");
const scrollProgressBar = $("scrollProgressBar");
let currentSectionId = "";
let scrollRaf = 0;

/* Section offsets are measured once and refreshed only when the layout changes,
   so scrolling never forces a layout read of every section. */
let sectionTops = [];
let maxScroll = 1;
let headerHeight = 0;

function measureLayout() {
  headerHeight = nav ? nav.offsetHeight : 0;
  sectionTops = navSections.map((section) => section.getBoundingClientRect().top + window.scrollY);
  maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function setMobileMenu(open) {
  if (!nav || !navToggle) return;

  nav.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu"
  );
  document.body.classList.toggle("nav-menu-open", open);
  navScrim?.setAttribute("aria-hidden", String(!open));
}

function setActiveSection(id) {
  if (currentSectionId === id) return;
  currentSectionId = id;

  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function onScrollFrame() {
  scrollRaf = 0;
  const y = window.scrollY;

  nav?.classList.toggle("scrolled", y > 20);

  const probeY = y + headerHeight + 35;
  let nextSection = "home";
  for (let i = 0; i < sectionTops.length; i += 1) {
    if (sectionTops[i] <= probeY) nextSection = navSections[i].id;
    else break;
  }
  if (y >= maxScroll - 8 && navSections.length) nextSection = navSections[navSections.length - 1].id;
  setActiveSection(nextSection);

  if (scrollProgressBar) {
    scrollProgressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;
  }
}

function queueScrollFrame() {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(onScrollFrame);
}

navToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  setMobileMenu(!nav.classList.contains("menu-open"));
});
navScrim?.addEventListener("click", () => setMobileMenu(false));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.slice(1);
    if (id) setActiveSection(id);
    setMobileMenu(false);
  });
});

document.addEventListener("click", (event) => {
  if (!nav.classList.contains("menu-open")) return;
  if (!event.target.closest("#nav")) setMobileMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMobileMenu(false);
});

window.addEventListener("scroll", queueScrollFrame, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) setMobileMenu(false);
}, { passive: true });

// Re-measure whenever the page height changes (images loading, resize, chat output growing).
if ("ResizeObserver" in window) {
  new ResizeObserver(() => {
    measureLayout();
    queueScrollFrame();
  }).observe(document.body);
} else {
  window.addEventListener("resize", () => { measureLayout(); queueScrollFrame(); }, { passive: true });
  window.addEventListener("load", () => { measureLayout(); queueScrollFrame(); });
}

/* Reveal */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* Section accent line + pause looping animations while off-screen */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0 });

navSections.forEach((section) => sectionObserver.observe(section));

/* Year */
const year = $("year");
if (year) year.textContent = new Date().getFullYear();

/* Initial state */
measureLayout();
onScrollFrame();

/* Skills marquee: auto-scroll + pointer drag */
const skillsMarquee = $("skillsMarquee");
const skillsTrack = $("skillsMarqueeTrack");

if (skillsMarquee && skillsTrack) {
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  let currentOffset = 0;
  let pointerId = null;
  let trackWidth = 0;

  const getLoopWidth = () => {
    const firstSet = skillsTrack.querySelector(".skill-marquee-set");
    return firstSet ? firstSet.getBoundingClientRect().width : 0;
  };

  const normalizeOffset = (offset) => {
    const loop = trackWidth || getLoopWidth();
    if (!loop) return offset;
    return ((offset % loop) + loop) % loop - loop;
  };

  const applyDragOffset = (offset) => {
    currentOffset = normalizeOffset(offset);
    skillsTrack.style.animation = "none";
    skillsTrack.style.transform = `translate3d(${currentOffset}px,0,0)`;
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    trackWidth = getLoopWidth();
    dragging = true;
    pointerId = event.pointerId;
    startX = event.clientX;
    const transform = getComputedStyle(skillsTrack).transform;
    const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(-?[\d.]+),/);
    currentOffset = match ? Number(match[1]) : currentOffset;
    startOffset = currentOffset;
    skillsMarquee.classList.add("is-dragging");
    skillsTrack.setPointerCapture?.(pointerId);
    event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    applyDragOffset(startOffset + event.clientX - startX);
  };

  const onPointerUp = (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    skillsMarquee.classList.remove("is-dragging");
    skillsTrack.releasePointerCapture?.(pointerId);
    const loop = trackWidth || getLoopWidth();
    if (loop) {
      const normalized = normalizeOffset(currentOffset);
      skillsTrack.style.transform = "";
      skillsTrack.style.animation = "skillsMarquee 30s linear infinite";
      const progress = Math.abs(normalized) / loop;
      skillsTrack.style.animationDelay = `${-Math.min(progress, 1) * 30}s`;
      requestAnimationFrame(() => {
        skillsTrack.style.animationPlayState = "";
        skillsTrack.style.animationDelay = "";
      });
    }
  };

  skillsMarquee.addEventListener("pointerdown", onPointerDown);
  skillsMarquee.addEventListener("pointermove", onPointerMove);
  skillsMarquee.addEventListener("pointerup", onPointerUp);
  skillsMarquee.addEventListener("pointercancel", onPointerUp);
  skillsMarquee.addEventListener("pointerleave", (event) => {
    if (dragging && event.pointerType === "mouse") onPointerUp(event);
  });
}

/* AI assistant: data.js + chatbot.js load after the page is idle, or immediately
   on the first interaction, so they never compete with the first paint. */
// Names here must not clash with the top-level constants declared in chatbot.js.
const chatFormEl = $("assistantForm");
const chatChipsEl = $("assistantPrompts");
let chatLoadPromise = null;
let chatReady = false;
let pendingChatQuery = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function loadChat() {
  chatLoadPromise ||= loadScript("data.js")
    .then(() => loadScript("chatbot.js"))
    .then(() => {
      chatReady = true;
      if (pendingChatQuery !== null && typeof sendChatMessage === "function") {
        const query = pendingChatQuery;
        pendingChatQuery = null;
        sendChatMessage(query);
      }
    });
  return chatLoadPromise;
}

// Until chatbot.js has loaded, hold the visitor's question and send it once ready.
// After that these handlers step aside and chatbot.js's own listeners take over.
function queueChatQuery(query) {
  if (!query.trim()) return;
  pendingChatQuery = query;
  loadChat();
}

chatFormEl?.addEventListener("submit", (event) => {
  if (chatReady) return;
  event.preventDefault();
  queueChatQuery($("assistantInput")?.value || "");
});

chatChipsEl?.addEventListener("click", (event) => {
  if (chatReady) return;
  const chip = event.target.closest("[data-query]");
  if (chip) queueChatQuery(chip.dataset.query || "");
});

$("assistantInput")?.addEventListener("focus", loadChat, { once: true });

const scheduleIdleChatLoad = () => {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  idle(loadChat, { timeout: 4000 });
};
if (document.readyState === "complete") scheduleIdleChatLoad();
else window.addEventListener("load", scheduleIdleChatLoad, { once: true });
