/* ============================================================
   main.js
   Navigation, scrollspy, page motion, hero title, and skills rail.
   ============================================================ */

const $ = (id) => document.getElementById(id);

/* Navigation */
const nav = $("nav");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const navSections = [...document.querySelectorAll("[data-section]")];
const navToggle = $("navToggle");
const navScrim = $("navScrim");
const scrollProgressBar = $("scrollProgressBar");
let currentSectionId = "home";
let navShiftTimer;
let scrollSpyRaf = 0;
let progressRaf = 0;

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

function positionActiveMenuItem() {
  if (window.innerWidth > 700) return;
  const active = navLinks.find((link) => link.classList.contains("active"));
  if (active && nav.classList.contains("menu-open")) {
    active.scrollIntoView({ block: "nearest" });
  }
}

function setActiveSection(id, animate = true) {
  const changed = currentSectionId !== id;
  currentSectionId = id;

  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  if (changed && animate && id !== "home") {
    nav.classList.remove("section-shift");
    void nav.offsetWidth;
    nav.classList.add("section-shift");
    clearTimeout(navShiftTimer);
    navShiftTimer = setTimeout(() => nav.classList.remove("section-shift"), 560);
  }

  positionActiveMenuItem();
}

function updateScrollSpy() {
  scrollSpyRaf = 0;
  const headerHeight = nav ? nav.getBoundingClientRect().height : 0;
  const probeY = window.scrollY + headerHeight + 35;
  let nextSection = "home";

  for (const section of navSections) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (top <= probeY) nextSection = section.id;
    else break;
  }

  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  if (nearBottom && navSections.length) nextSection = navSections[navSections.length - 1].id;

  setActiveSection(nextSection);
}

function queueScrollSpy() {
  if (scrollSpyRaf) return;
  scrollSpyRaf = requestAnimationFrame(updateScrollSpy);
}

function updateScrollProgress() {
  progressRaf = 0;
  if (!scrollProgressBar) return;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  scrollProgressBar.style.transform = `scaleX(${ratio})`;
}

function queueScrollProgress() {
  if (progressRaf) return;
  progressRaf = requestAnimationFrame(updateScrollProgress);
}

navToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  setMobileMenu(!nav.classList.contains("menu-open"));
});
navScrim?.addEventListener("click", () => setMobileMenu(false));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href")?.slice(1);
    if (id) setActiveSection(id, false);
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

window.addEventListener("scroll", () => {
  nav?.classList.toggle("scrolled", window.scrollY > 20);
  queueScrollSpy();
  queueScrollProgress();
}, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) setMobileMenu(false);
  queueScrollSpy();
  queueScrollProgress();
}, { passive: true });

/* Reveal */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* Year */
const year = $("year");
if (year) year.textContent = new Date().getFullYear();

/* Animated hero title */
const heroTitle = $("heroTitle");
if (heroTitle) {
  const heroText = heroTitle.getAttribute("aria-label") || "Fekry Mansour";
  const words = heroText.split(/\s+/);
  let letterIndex = 0;

  words.forEach((word, wordIndex) => {
    const wordWrap = document.createElement("span");
    wordWrap.className = "hero-word";

    [...word].forEach((char) => {
      const span = document.createElement("span");
      span.className = "hero-letter";
      span.style.setProperty("--i", letterIndex++);
      span.textContent = char;
      wordWrap.appendChild(span);
    });

    heroTitle.appendChild(wordWrap);

    if (wordIndex < words.length - 1) {
      heroTitle.appendChild(document.createTextNode(" "));
    }
  });
}

/* Section accent reveal */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll("[data-section]").forEach((section) => sectionObserver.observe(section));

/* Initial state */
setActiveSection("home", false);
queueScrollSpy();
queueScrollProgress();

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
        skillsTrack.style.animationPlayState = "running";
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
