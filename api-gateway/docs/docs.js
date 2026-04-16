// ── Toggle endpoint open/close ───────────────────────────────────────────────
function toggleEndpoint(header) {
  const ep = header.closest(".endpoint");
  ep.classList.toggle("open");
}

// ── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(tab, contentId) {
  const body = tab.closest(".endpoint-body");
  body.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  body.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
  tab.classList.add("active");
  const content = document.getElementById(contentId);
  if (content) content.classList.add("active");
}

// ── Copy button ───────────────────────────────────────────────────────────────
function copyCode(btn) {
  const block = btn.closest(".code-block");
  const text = block.innerText.replace("Copy", "").replace("Copied!", "").trim();
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 2000);
  });
}

// ── Send request ─────────────────────────────────────────────────────────────
async function sendRequest(btn) {
  const playground = btn.closest(".playground");
  const method = btn.dataset.method;
  const path = btn.dataset.path;
  const requiresAuth = btn.dataset.auth === "true";

  // Find base URL — check playground first, then page-level input
  const localBase = playground.querySelector(".base-url-input");
  const pageBase = document.querySelector(".base-url-bar input");
  const baseUrl = ((localBase || pageBase)?.value || "").trim().replace(/\/$/, "");
  if (!baseUrl) { alert("Please enter the Gateway Base URL first"); return; }

  const tokenInput = playground.querySelector(".token-input") || document.querySelector(".token-input");
  const bodyArea = playground.querySelector(".pg-textarea");
  const responseDiv = playground.querySelector(".pg-response");
  const statusEl = responseDiv.querySelector(".pg-status");
  const timeEl = responseDiv.querySelector(".pg-time");
  const codeEl = responseDiv.querySelector(".code-block");

  const headers = { "Content-Type": "application/json" };
  if (requiresAuth && tokenInput?.value) {
    const t = tokenInput.value.trim();
    headers["Authorization"] = t.startsWith("Bearer ") ? t : `Bearer ${t}`;
  }

  btn.disabled = true; btn.textContent = "Sending…";
  const start = Date.now();
  try {
    const opts = { method, headers };
    if (bodyArea && ["POST","PUT","PATCH"].includes(method)) {
      try { JSON.parse(bodyArea.value); opts.body = bodyArea.value; }
      catch { alert("Invalid JSON in body"); btn.disabled = false; btn.textContent = "Send Request ↗"; return; }
    }
    const res = await fetch(baseUrl + path, opts);
    const elapsed = Date.now() - start;
    const json = await res.json();
    statusEl.textContent = `${res.status} ${res.statusText}`;
    statusEl.className = `pg-status ${res.ok ? "s2xx" : res.status < 500 ? "s4xx" : "s5xx"}`;
    timeEl.textContent = `${elapsed}ms`;
    codeEl.textContent = JSON.stringify(json, null, 2);
    responseDiv.style.display = "block";
  } catch (err) {
    statusEl.textContent = "Network Error"; statusEl.className = "pg-status s5xx";
    timeEl.textContent = ""; codeEl.textContent = err.message;
    responseDiv.style.display = "block";
  }
  btn.disabled = false; btn.textContent = "Send Request ↗";
}

// ── Service filter ────────────────────────────────────────────────────────────
function filterService(btn, service) {
  document.querySelectorAll(".svc-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".module[data-service]").forEach(m => {
    m.style.display = (service === "all" || m.dataset.service === service) ? "" : "none";
  });
  document.querySelectorAll(".sidebar-section[data-service], .sidebar-item[data-service]").forEach(el => {
    el.style.display = (service === "all" || el.dataset.service === service) ? "" : "none";
  });
  // show/hide zone warning banner
  document.querySelectorAll(".warn-note[data-service]").forEach(el => {
    el.style.display = (service === "all" || el.dataset.service === service) ? "" : "none";
  });
}

// ── Search ────────────────────────────────────────────────────────────────────
function liveSearch(input) {
  const q = input.value.toLowerCase();
  document.querySelectorAll(".endpoint").forEach(ep => {
    const text = (ep.querySelector(".endpoint-path")?.textContent || "").toLowerCase();
    const desc = (ep.querySelector(".endpoint-desc")?.textContent || "").toLowerCase();
    ep.style.display = (!q || text.includes(q) || desc.includes(q)) ? "" : "none";
  });
}

// ── DOM ready ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Endpoint toggle
  document.querySelectorAll(".endpoint-header").forEach(h =>
    h.addEventListener("click", () => toggleEndpoint(h))
  );
  // Tabs
  document.querySelectorAll(".tab[data-target]").forEach(tab =>
    tab.addEventListener("click", () => switchTab(tab, tab.dataset.target))
  );
  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach(btn =>
    btn.addEventListener("click", (e) => { e.stopPropagation(); copyCode(btn); })
  );
  // Send buttons (data-attribute pattern)
  document.querySelectorAll(".send-btn[data-method]").forEach(btn =>
    btn.addEventListener("click", () => sendRequest(btn))
  );
});
