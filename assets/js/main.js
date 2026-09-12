// ============================================
// Cursor line: static tagline under the headline, no
// typing/erasing animation here — that's reserved for the
// headline itself.
// ============================================
(function setCursorLine() {
  const line = "trying to derive the equilibrium before assuming one exists.";
  const el = document.getElementById("cursorText");
  if (el) el.textContent = line;
})();

// ============================================
// Hero directory: projects() and writing() reveal their
// sub-links on click instead of showing them all the time.
// ============================================
(function heroDirectoryToggles() {
  document.querySelectorAll(".dir-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.getAttribute("aria-controls"));
      if (!target) return;
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      target.hidden = isOpen;
    });
  });
})();

// ============================================
// Hero headline: slow, deliberate typewriter effect.
// Skipped entirely if the visitor prefers reduced motion —
// the full line is already in the HTML so nothing is lost.
// ============================================
(function typeHeroName() {
  const el = document.getElementById("heroName");
  if (!el) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const fullText = el.textContent;
  el.textContent = "";

  const baseDelay = 85;   // ms per character — slow on purpose, not a flashy typewriter
  const pauseAfterPeriod = 480;

  let i = 0;
  function typeNext() {
    if (i <= fullText.length) {
      el.innerHTML = escapeHtml(fullText.slice(0, i)) + '<span class="cursor-blink" aria-hidden="true">▍</span>';
      const justTyped = fullText[i - 1];
      i++;
      setTimeout(typeNext, justTyped === "." ? pauseAfterPeriod : baseDelay);
    } else {
      el.textContent = fullText; // drop the cursor once it's done
    }
  }
  setTimeout(typeNext, 200); // brief beat before it starts
})();

// ============================================
// Writing list: pulls from writing/posts.json so adding a new post
// never requires touching index.html by hand.
// ============================================
(async function loadWritingList() {
  const list = document.getElementById("writingList");
  if (!list) return;

  try {
    const res = await fetch("writing/posts.json", { cache: "no-store" });
    if (!res.ok) return; // keep static fallback already in the HTML
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return;

    list.innerHTML = "";
    posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .forEach((post) => {
        const li = document.createElement("li");
        li.className = "entry entry-writing";
        li.innerHTML = `
          <span class="entry-date">${formatDate(post.date)}</span>
          <a class="entry-title" href="writing/${post.slug}.html">${escapeHtml(post.title)}</a>
        `;
        list.appendChild(li);
      });
  } catch (e) {
    // fetch fails on file:// — static fallback in the HTML covers that case
  }
})();

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toISOString().slice(0, 7).replace("-", ".");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// About timeline: fade + fill markers in as they scroll into view
// ============================================
(function revealTimeline() {
  const items = document.querySelectorAll(".timeline-item");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  items.forEach((item) => observer.observe(item));
})();