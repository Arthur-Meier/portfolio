# Arthur Meier — Portfolio

A bilingual personal portfolio for **Arthur Meier · Software Engineer | Full Stack**.

**[View the website](https://arthur-meier.swoonyjay1024.chatgpt.site)** · [Português](https://arthur-meier.swoonyjay1024.chatgpt.site/) · [English](https://arthur-meier.swoonyjay1024.chatgpt.site/en/)

The site brings together professional case studies, personal projects, technical skills, work experience and contact details. Both language versions include complete HTML content before JavaScript runs.

## Features

- Portuguese at `/` and English at `/en/`, with localized metadata and résumé downloads.
- Light, dark and system themes, with a saved preference when browser storage is available.
- Project filters, technical skill panels and an accessible mobile navigation menu.
- Native expandable case studies and project descriptions.
- Responsive CSS, visible keyboard focus and reduced-motion support.
- Local photo and résumé assets; no external font or application dependencies.

## Stack

HTML, CSS and browser JavaScript, generated with Node.js native modules. Tests use `node:test`; structural validation uses Python's standard library.

## Run locally

Validated with Node.js 24 and Python 3.12. No dependency installation is required.

```sh
git clone https://github.com/Arthur-Meier/portfolio.git
cd portfolio
npm run build -- --origin http://localhost:8000
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/` or `http://localhost:8000/en/`. Stop the server with `Ctrl+C`.

`--origin` sets the canonical, social preview and sitemap URLs. Pass the actual production origin when preparing a deployment.

## Validate

```sh
npm test
npm run check
```

Build the site before running `check`. The test suite covers locale consistency, standalone pages, content without JavaScript, localized résumé downloads, HTML escaping and theme preferences when storage is blocked. The Python check validates generated routes, metadata, anchors and local assets.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/content.mjs` | Profile, case studies, projects, experience and translations |
| `src/template.mjs` | Complete semantic HTML for each language |
| `src/styles.css` | Visual identity, themes and responsive layouts |
| `src/state.mjs` | Theme preference and storage helpers |
| `src/interactions.mjs` | Progressive enhancements for navigation and exploration |
| `src/assets/` | Portrait, original résumé PDFs and favicon |
| `scripts/generate.mjs` | Static site generator |
| `scripts/check-site.py` | HTML and asset validation |
| `tests/` | Node.js tests |
| `dist/` | Generated website; excluded from Git |

## Edit content

Update `siteContent.pt` and `siteContent.en` in `src/content.mjs`, keeping matching project IDs, categories, skill IDs and interface keys. Each locale defines its own résumé asset. Rebuild after changing source files.

The generator writes complete files to `dist/`, which can be served by a static host. The site uses root-relative asset paths and expects deployment at the origin root; hosting under a repository subpath requires a base-path adaptation.

Publishing code here does not automatically deploy changes to the live website. Its current hosting is managed through Sites.

## Em português

Este repositório contém o código do meu portfólio profissional, com versões em português e inglês. Para executar, gere o site com `npm run build -- --origin http://localhost:8000` e sirva a pasta `dist/` com o comando Python acima. Os conteúdos ficam em `src/content.mjs`, e os currículos originais estão em `src/assets/`.

## Contact

[LinkedIn](https://www.linkedin.com/in/arthur-meier/) · [GitHub](https://github.com/Arthur-Meier) · [Email](mailto:arthurcmeier@outlook.com)
