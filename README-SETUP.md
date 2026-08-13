# Setting this up on your GitHub Pages repo

## 1. Where the files go

You already have `debmanna/debmanna.github.io` (I saw it in your sidebar). GitHub Pages serves
a user site straight from the **root** of that repo — no `/docs` folder, no build step needed.

```
debmanna.github.io/
├── index.html
├── assets/
│   ├── css/style.css
│   └── js/main.js
└── writing/
    ├── index.html
    ├── posts.json
    └── on-starting-a-slow-site.html   ← example post, treat as your template
```

Copy the files exactly into that structure, keeping the folder names as-is (the CSS/JS paths
depend on it).

## 2. Push it

```bash
git clone https://github.com/debmanna/debmanna.github.io.git
cd debmanna.github.io
# copy in the files from this delivery, preserving the folder structure above
git add .
git commit -m "rebuild site: terminal philosopher direction"
git push
```

Pages will rebuild automatically (usually under a minute). If it's your first time enabling it:
**Settings → Pages → Source → Deploy from branch → `main` / root.**

## 3. Things to personalize before you publish

Search for these and replace them — I deliberately left them obvious rather than guessing:

| File | What to change |
|---|---|
| `index.html` | `you@example.com`, LinkedIn `href="#"`, resume `href="#"` in the footer |
| `index.html` | The three `#work` entries — two point at your real repos already (`ECO611`, `AE471`); swap the third placeholder for a real project |
| `assets/js/main.js` | The `lines` array — these are the cycling one-liners under your name. Keep 3–5, keep them short, keep them true. This is the one place the site is allowed to have a personality; don't overdo it elsewhere. |
| `writing/posts.json` + `writing/on-starting-a-slow-site.html` | Delete the example post once you've written a real first one, or keep it as-is — it doubles as documentation for the workflow below |

## 4. Adding a new blog post (this is the whole workflow, forever)

1. Duplicate `writing/on-starting-a-slow-site.html`, rename it to `writing/your-slug.html`
2. Edit the `<title>`, `<h1 class="page-title">`, the date, and the body inside `<main class="post-content">`
3. Add one entry to the top of `writing/posts.json`:
   ```json
   {
     "title": "Your Post Title",
     "slug": "your-slug",
     "date": "2026-09-01"
   }
   ```
4. `git add . && git commit -m "post: your title" && git push`

That's it — the homepage and the writing index both pull from `posts.json` automatically, so you
never touch `index.html` again just to add a post.

## 5. A few things worth doing once, not urgent

- **Favicon:** drop a `favicon.ico` or `favicon.svg` in the root and link it in the `<head>` of
  both `index.html` and the writing pages — right now there isn't one, browsers will show a
  generic globe icon.
- **Custom domain (optional):** if you ever want `debashishmanna.com` instead of the `.github.io`
  URL, add a `CNAME` file in the repo root with just the domain in it, and point your DNS at
  GitHub's Pages IPs. Not necessary for placements — the `.github.io` URL is completely normal
  to put on a resume.
- **Resume PDF:** put it at `assets/resume.pdf` and point the footer link at it directly, so
  recruiters get the file with one click instead of a LinkedIn detour.

## 6. Fonts

The site pulls **General Sans** from Fontshare and **JetBrains Mono** from Google Fonts via CDN
links in each page's `<head>` — no local font files to manage. If Fontshare ever goes down or you
want to remove the external dependency, self-hosting both is a ~10 minute job; ask me and I'll
set it up.

## 7. If you want to extend it later

- A `projects/xyz.html` page per project (same pattern as `writing/`) is a natural next step once
  you have 1–2 projects worth a full writeup, not just a card.
- Keep resisting the urge to add a nav item for every new thing — the whole point of this
  direction is that it stays small enough to maintain without thinking about it.
