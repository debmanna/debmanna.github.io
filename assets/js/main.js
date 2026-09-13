// ============================================
// Cursor line: static tagline under the headline, no
// typing/erasing animation here — that's reserved for the
// headline itself.
// ============================================
(function setCursorLine() {
  const line = "Embedding myself into statistical & dynamical thinking";
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
// Hero headline: cycles through each word — typed, held, then
// cleared — and settles on the last one. Simple, not a flashy
// gimmick. Skipped entirely if the visitor prefers reduced motion —
// the full line is already in the HTML so nothing is lost.
// ============================================
(function typeHeroName() {
  const el = document.getElementById("heroName");
  if (!el) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const fullText = el.textContent;
  const words = fullText.split(" "); // ["Cogitating.", "Optimizing.", "Solving."]
  el.textContent = "";

  const typeDelay = 105;      // ms per character while typing
  const deleteDelay = 95;     // ms per character while clearing
  const pauseAfterWord = 620; // beat after a word is fully typed, before it's cleared
  const pauseBeforeNext = 300; // beat after clearing, before the next word starts

  const cursor = '<span class="cursor-blink" aria-hidden="true">▍</span>';

  function render(current) {
    el.innerHTML = escapeHtml(current) + cursor;
  }

  function typeWord(word, onDone) {
    let i = 0;
    (function step() {
      if (i <= word.length) {
        render(word.slice(0, i));
        i++;
        setTimeout(step, typeDelay);
      } else {
        onDone();
      }
    })();
  }

  function deleteWord(word, onDone) {
    let i = word.length;
    (function step() {
      if (i >= 0) {
        render(word.slice(0, i));
        i--;
        setTimeout(step, deleteDelay);
      } else {
        onDone();
      }
    })();
  }

  function nextWord(wordIndex) {
    const word = words[wordIndex];
    const isLast = wordIndex === words.length - 1;

    typeWord(word, () => {
      if (isLast) return; // stays put — cursor keeps blinking via CSS
      setTimeout(() => {
        deleteWord(word, () => {
          setTimeout(() => nextWord(wordIndex + 1), pauseBeforeNext);
        });
      }, pauseAfterWord);
    });
  }

  setTimeout(() => nextWord(0), 250);
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

    if (typeof window.__revealWritingEntries === "function") {
      window.__revealWritingEntries();
    }
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

// ============================================
// Gentle scroll reveals for the rest of the page — sections and
// list entries fade up a little as they come into view. Purely
// decorative: skipped for reduced-motion, and anything missed
// (no-JS, IO unsupported) is just visible immediately via CSS fallback.
// ============================================
(function initScrollReveals() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  function makeRevealable(el, delayStep) {
    if (!el || el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    if (delayStep) el.style.transitionDelay = delayStep + "ms";
    observer.observe(el);
  }

  document.querySelectorAll(".section-body > p").forEach((p, i) => makeRevealable(p, i * 90));
  document.querySelectorAll("#workList .entry").forEach((el, i) => makeRevealable(el, i * 80));
  document.querySelectorAll("#writingList .entry").forEach((el, i) => makeRevealable(el, i * 80));
  makeRevealable(document.querySelector(".footer-links"));
  makeRevealable(document.querySelector(".footer-note"), 80);

  // re-run for writing entries pulled in later via fetch
  window.__revealWritingEntries = function () {
    document.querySelectorAll("#writingList .entry").forEach((el, i) => makeRevealable(el, i * 80));
  };
})();