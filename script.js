/* ============================================================
   script.js
   Renders all page sections from CV_DATA (cv-data.js).
   No frameworks, no build step — open index.html and it runs.
   ============================================================ */

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text) node.textContent = opts.text;
  if (opts.html) node.innerHTML = opts.html;
  if (opts.href) node.href = opts.href;
  if (opts.attrs) {
    Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  }
  return node;
}

function renderSummary() {
  document.getElementById("summaryText").textContent = CV_DATA.summary;
}

function renderWork() {
  const container = document.getElementById("workTimeline");
  CV_DATA.experience.forEach(job => {
    const item = el("div", { class: "timeline-item" });

    const rail = el("div", { class: "timeline-rail" });
    rail.appendChild(el("div", { class: "timeline-dot" }));

    const body = el("div");
    body.appendChild(el("p", { class: "timeline-org", text: job.org }));

    const roleLine = el("h3", { class: "timeline-role" });
    if (job.url) {
      const link = el("a", { href: job.url, text: job.role, attrs: { target: "_blank", rel: "noopener" } });
      roleLine.appendChild(link);
    } else {
      roleLine.textContent = job.role;
    }
    body.appendChild(roleLine);

    const list = el("ul", { class: "timeline-bullets" });
    job.bullets.forEach(b => list.appendChild(el("li", { text: b })));
    body.appendChild(list);

    item.appendChild(rail);
    item.appendChild(body);
    container.appendChild(item);
  });
}

function renderEducation() {
  const container = document.getElementById("educationList");
  CV_DATA.education.forEach(e => {
    const card = el("div", { class: "edu-card" });
    card.appendChild(el("h3", { class: "edu-degree", text: e.degree }));
    card.appendChild(el("p", { class: "edu-school", text: `${e.school} — ${e.location}` }));
    const list = el("ul", { class: "edu-details" });
    e.details.forEach(d => list.appendChild(el("li", { text: d })));
    card.appendChild(list);
    container.appendChild(card);
  });
}

function renderProjects() {
  const container = document.getElementById("projectGrid");
  CV_DATA.projects.forEach(p => {
    const card = el("div", { class: "project-card" });
    card.appendChild(el("h3", { class: "project-name", text: p.name }));
    const list = el("ul", { class: "project-bullets" });
    p.bullets.forEach(b => list.appendChild(el("li", { text: b })));
    card.appendChild(list);
    container.appendChild(card);
  });
}

function renderSkills() {
  const container = document.getElementById("skillsGrid");
  Object.entries(CV_DATA.skills).forEach(([category, items]) => {
    const group = el("div");
    group.appendChild(el("h3", { class: "skill-group-title", text: category }));
    const pills = el("div", { class: "skill-pills" });
    items.forEach(i => pills.appendChild(el("span", { class: "skill-pill", text: i })));
    group.appendChild(pills);
    container.appendChild(group);
  });
}

function renderCertifications() {
  const container = document.getElementById("certList");
  CV_DATA.certifications.forEach(c => {
    const li = el("li");
    li.appendChild(document.createTextNode(c.name));
    li.appendChild(el("span", { class: "cert-issuer", text: `— ${c.issuer}` }));
    container.appendChild(li);
  });
}

function renderContact() {
  const container = document.getElementById("contactLinks");
  container.appendChild(el("a", { href: `mailto:${CV_DATA.email}`, text: CV_DATA.email }));
  container.appendChild(el("a", { href: `tel:${CV_DATA.phone.replace(/\s/g, "")}`, text: CV_DATA.phone }));
  container.appendChild(el("a", { href: CV_DATA.linkedin, text: "LinkedIn", attrs: { target: "_blank", rel: "noopener" } }));
  container.appendChild(el("a", { href: CV_DATA.github, text: "GitHub", attrs: { target: "_blank", rel: "noopener" } }));
}

function renderAll() {
  renderSummary();
  renderWork();
  renderEducation();
  renderProjects();
  renderSkills();
  renderCertifications();
  renderContact();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  // Chat launcher wiring (chat logic lives in chatbot.js)
  const launcher = document.getElementById("chatLauncher");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatCloseBtn");
  const navAskBtn = document.getElementById("navAskBtn");
  const heroAskLink = document.getElementById("heroAskLink");

  function openChat() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.getElementById("chatInput").focus();
  }
  function closeChat() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }
  function toggleChat() {
    panel.classList.contains("open") ? closeChat() : openChat();
  }

  launcher.addEventListener("click", toggleChat);
  launcher.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") toggleChat();
  });
  closeBtn.addEventListener("click", closeChat);
  navAskBtn.addEventListener("click", openChat);
  heroAskLink.addEventListener("click", (e) => {
    e.preventDefault();
    openChat();
  });
});
