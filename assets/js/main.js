// ============================================
// Cursor line: types out one short line, holds, erases, moves to the next.
// This is the site's one signature move — keep the list short and honest,
// not a firehose of "clever" one-liners.
// ============================================
const lines = [
  "trying to derive the equilibrium before assuming one exists.",
  "a wing and a portfolio obey the same kind of feedback.",
  "most of this started as a footnote to myself.",
  "currently: more curious about drift than about direction."
];

const el = document.getElementById("cursorText");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (el) {
  if (prefersReducedMotion) {
    el.textContent = lines[0];
  } else {
    runCursor();
  }
}

async function runCursor() {
  const TYPE_MS = 38;
  const ERASE_MS = 22;
  const HOLD_MS = 2200;
  let i = 0;

  while (true) {
    const line = lines[i % lines.length];
    await typeText(line, TYPE_MS);
    await wait(HOLD_MS);
    await eraseText(ERASE_MS);
    await wait(300);
    i++;
  }
}

function typeText(text, speed) {
  return new Promise((resolve) => {
    let j = 0;
    const interval = setInterval(() => {
      el.textContent = text.slice(0, j + 1);
      j++;
      if (j >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function eraseText(speed) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const current = el.textContent;
      el.textContent = current.slice(0, -1);
      if (current.length <= 1) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
