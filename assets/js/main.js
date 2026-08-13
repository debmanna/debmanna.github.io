// ============================================
// Cursor line: static, no typing/erasing animation.
// Pick whichever line reads best as the one fixed tagline under your name.
// ============================================
const line = "trying to derive the equilibrium before assuming one exists.";

const el = document.getElementById("cursorText");
if (el) {
  el.textContent = line;
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
