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

// ── Send request (Try It) ─────────────────────────────────────────────────────
async function sendRequest(btn, method, path, requiresAuth) {
  const playground = btn.closest(".playground");
  const baseUrlInput = playground.querySelector(".base-url-input");
  const tokenInput = playground.querySelector(".token-input");
  const bodyArea = playground.querySelector(".pg-textarea");
  const responseDiv = playground.querySelector(".pg-response");
  const statusEl = responseDiv.querySelector(".pg-status");
  const timeEl = responseDiv.querySelector(".pg-time");
  const codeEl = responseDiv.querySelector(".code-block");

  const baseUrl = (baseUrlInput?.value || "").trim().replace(/\/$/, "");
  if (!baseUrl) {
    alert("Please enter the Base URL first");
    return;
  }

  const headers = { "Content-Type": "application/json" };
  if (requiresAuth && tokenInput) {
    const token = tokenInput.value.trim();
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
  }

  btn.disabled = true;
  btn.textContent = "Sending…";

  const start = Date.now();
  try {
    const opts = { method, headers };
    if (bodyArea && ["POST", "PUT", "PATCH"].includes(method)) {
      try {
        JSON.parse(bodyArea.value);
        opts.body = bodyArea.value;
      } catch {
        alert("Invalid JSON in body");
        btn.disabled = false;
        btn.textContent = "Send Request ↗";
        return;
      }
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
    statusEl.textContent = "Network Error";
    statusEl.className = "pg-status s5xx";
    timeEl.textContent = "";
    codeEl.textContent = err.message;
    responseDiv.style.display = "block";
  }

  btn.disabled = false;
  btn.textContent = "Send Request ↗";
}

// ── Attach all event listeners after DOM is ready ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Endpoint toggles
  document.querySelectorAll(".endpoint-header").forEach((header) => {
    header.addEventListener("click", () => toggleEndpoint(header));
  });

  // Tabs — each tab carries data-target attribute
  document.querySelectorAll(".tab[data-target]").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab, tab.dataset.target));
  });

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => copyCode(btn));
  });

  // Send buttons — carry data-method, data-path, data-auth attributes
  document.querySelectorAll(".send-btn[data-method]").forEach((btn) => {
    btn.addEventListener("click", () =>
      sendRequest(btn, btn.dataset.method, btn.dataset.path, btn.dataset.auth === "true")
    );
  });

  // Sidebar active state on scroll
  const sections = document.querySelectorAll(".module[id], .auth-card[id], .page-header[id]");
  const sidebarLinks = document.querySelectorAll(".sidebar-item[href]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          sidebarLinks.forEach((l) => {
            l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
});
