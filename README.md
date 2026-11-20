# rahu378.github.io

Portfolio for **Rahul Chidipudi**, software engineer in AI and ML (enterprise RAG, AI agents, Azure and AWS).

**Live:** https://rahu378.github.io

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Keynote-style home: a live model of an AI assistant, a scroll-scrubbed decode-throughput figure (28.0 → 48.1 tok/s), a portrait reveal, and the projects moving sideways as you scroll |
| `experience.html` | Each role as a messenger-style chat that replays what shipped; visitors can ask follow-up questions, answered from the résumé |
| `projects.html` | Three working models running in the browser: Hardware-Aware Gateway's decode token split, FinOpsAI's spend forecast and policy endpoint, and The Gallery's race director |
| `skills.html` | Every skill traced to the roles, projects and certifications that use it |
| `about.html` | Education, seven certifications, and how I work |
| `contact.html` | Email, phone, GitHub, and an email starter that opens the visitor's own mail app |

## How it's built

- Plain HTML, CSS and JavaScript. No framework, no build step, no third-party scripts, fonts or trackers.
- Résumé content lives in one place: `assets/js/data.js`. The static HTML mirrors it for visitors without JavaScript.
- Page-to-page transitions use the View Transitions API; motion respects `prefers-reduced-motion`.
- The demos are simulations tuned to the real projects' numbers, and say so on the page.
- `about/`, `contact/`, `projects/`, `skills/` and `work/` redirect old links from the previous version of the site.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which checks that the site is complete and self-contained and publishes it to GitHub Pages.
