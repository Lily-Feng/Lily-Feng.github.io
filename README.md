# Lily Feng's digital garden

A static portfolio, blog, and knowledge graph. Everything is stored in this repository and deployed by GitHub Pages; there is no database or separate CMS.

## Publish a post

Add a Markdown file to `content/posts/` using this format:

```md
---
title: A clear, useful title
date: 2026-08-06
summary: One sentence shown on cards and in search results.
domain: Enterprise AI
topics:
  - Data Platforms
  - Governance
connections:
  - another-note-slug
kind: post
featured: false
---

Write the article here using normal Markdown.
```

Use `content/knowledge/` for evergreen notes and `content/projects/` for project write-ups. `title`, `summary`, and `domain` are required. The filename becomes the URL slug unless a `slug` field is provided. `connections` contains the slugs of related files.

When a commit lands on `master` or `main`, the GitHub Actions workflow builds the site and publishes the `dist/` artifact to GitHub Pages.

## Work locally

```bash
npm install
npm run dev
```

Run `npm run build` before publishing to verify every Markdown file and the production bundle.

## Update the resume

Edit `src/data/resume.ts` to update profile details, experience, education, skills, or map locations. The About page and interactive journey globe both read from this shared data file.
