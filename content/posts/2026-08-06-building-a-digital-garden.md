---
title: Building a Digital Garden, Not Just a Portfolio
date: 2026-08-06
summary: Why I am turning a traditional portfolio into a connected, searchable notebook that can grow one Markdown file at a time.
domain: Learning in Public
topics:
  - Knowledge Systems
  - Digital Gardens
connections:
  - enterprise-ai-platform
kind: post
featured: true
---

A portfolio is good at answering one question: **what has this person done?** I want this site to answer a more useful question too: **what has this person learned, and how do those ideas connect?**

That distinction changes the shape of the site. Projects still matter, but they sit alongside working notes, frameworks, and essays. A note about retrieval-augmented generation can connect to data governance, evaluation, and product strategy instead of disappearing into a reverse-chronological archive.

## The publishing rule

Every piece of content begins as a Markdown file. A small front matter block describes its domain and topics:

```yaml
---
title: A clear, useful title
date: 2026-08-06
summary: One sentence that helps a reader decide whether to open it.
domain: Enterprise AI
topics:
  - Data Platforms
  - Governance
connections:
  - another-note-slug
kind: post
---
```

The site turns that one file into an article, a search result, and a node in the knowledge graph. There is no separate CMS record to keep synchronized.

## A garden should stay unfinished

Unlike a polished reference library, a digital garden is allowed to show ideas as they develop. I can update a note when my understanding changes, connect it to a new project, or turn it into a longer essay later.

That is the point: this is not a static résumé with a blog attached. It is a map of work in progress.
