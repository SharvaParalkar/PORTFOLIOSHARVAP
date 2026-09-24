---
title: Template Editor
---

Use the **Template Editor** for rich, visual project page layouts (hero, image blocks, headings, paragraphs), then save HTML into `projects/`.

## Local (recommended)

1. In a terminal:

```bash
cd TemplateEdit
npm install
npm run editor
```

2. Open [http://localhost:3333/template-editor.html](http://localhost:3333/template-editor.html)

3. Build the page, click **Save to project (server)** — files go to `projects/<slug>.html` and update `projects/projects.json`.

4. Optionally use **Sync to GitHub** from the editor, or commit via this CMS / git.

## From Decap CMS

Edit **Projects → Project list & layouts** and use the **Full page layout** blocks (Image / Heading / Paragraph). Those render on `project.html?slug=…`.

## When to use which

- **Homepage cards + structured page sections** → Decap → Projects
- **Custom HTML from the visual builder** → Template Editor (local)
- **Resume PDF / homepage copy** → Decap → Site pages
