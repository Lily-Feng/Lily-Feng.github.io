---
name: add-blog-entry
description: Add a new entry to the blog archive (/blogs) of this site from any source — a Medium article, LinkedIn post, YouTube video, conference talk, a local Markdown/Word/PDF draft, or pasted text — with a cover thumbnail, a local preview for proof-reading, and, once confirmed, a commit and push that publishes it. Use this whenever the user says "add this blog", "add a gallery card", "I published a new post on Medium/LinkedIn/YouTube", "put this on the site", pastes a link or a cover image meant for the blog, or asks why a new post is not showing up. Use it even if they never say "skill" or "front matter".
---

# Add a blog entry

The site's archive is built entirely from `content/posts/*.md`. Every card, the search index, and the home-page "recent from /blogs" terminal are generated from those files, so adding an entry means adding one Markdown file and one image. There is nothing to register anywhere else. Read `AGENTS.md` first if you have not this session; its scope rules still apply (no new nav item, no new content type, no external services at build time).

## 1. Decide what kind of entry this is

The question is where the words live.

| Situation | Entry |
| --- | --- |
| Lives only elsewhere (Medium, LinkedIn, YouTube, talk, someone else's publication) | `kind: link` — a card that opens the original; no page on this site |
| Written locally, to be read on this site | `kind: post` with the full body |
| Written locally **and** also published elsewhere | `kind: post` plus `syndicated:` pointing at the copy. This site is always the original; never reverse that |

If it is unclear which applies (a local draft that is also on Medium), ask. The answer decides whether the full text is hosted here.

## 2. Gather the material

- **URL:** try WebFetch for title, date, and what the piece argues. Medium and LinkedIn often return 403. When that happens, do not guess at the argument: ask the user to paste the text, or write a deliberately plain summary from the title and cover image and tell the user it was inferred. YouTube: use the title and description.
- **Local file or pasted text:** read all of it. For `.docx`/`.pdf`, use the matching skill to extract text. A post body must keep the author's voice; fix only front matter and image paths.
- **Date:** the original publication date if known, otherwise today. The date drives sort order and the home-page "recent" list, so a wrong date puts the card in the wrong place.
- **Cover image:** the user usually pastes or points at one (pasted images land under the session's `images/` directory). If none is given for a YouTube link, download its thumbnail into `public/` — never hotlink, the site must stay self-contained. If there is no image at all, a card with only `color` and `icon` is acceptable; say so.

## 3. Write the entry

File: `content/posts/YYYY-MM-DD-short-slug.md`. The slug becomes the URL and must be unique.

```yaml
---
title: "Exact title of the original"
date: 2026-10-16
summary: One plain sentence for cards and search.
domain: Enterprise AI
topics: [Two, Or Three]
kind: link                # or post
source: Medium            # link only: Medium | LinkedIn | YouTube | Conference
url: https://...          # link only
color: ai                 # data | ai | architecture
icon: ai                  # ai | data | architecture | security
cover: /images/ai/topic-descriptive-name.png
coverAlt: What the image shows, as a sentence.
---

One line pointing to the original (link entries have a stub body).
```

- Reuse existing `domain` and `topics` values (`grep -h '^domain:\|^topics:' content/posts/*.md | sort -u`) so the archive's filters stay tidy.
- Cover goes in a shared topic folder, `public/images/<topic>/`, named `<topic>-<what-it-is>.png` — not a new folder per post. Existing folders: `ai`, `data`, `sql`, `claude`, `databricks`. Create a new one only for a genuinely new theme with several images.
- Run `chmod 644` on the copied image. Pasted images arrive as mode 600 and would be unreadable by the deploy.
- `cover` requires `coverAlt`; the validator enforces it. In a post body, inline images are `![alt](/images/...)`.
- Summary rules: one sentence, say what the piece is about rather than "a post about", and claim nothing the source does not support.
- Private share tokens (Medium `?sk=` friend links) work but are not the public URL. Mention it once and let the user choose.
- Do not touch `src/`, the home-page terminal, or navigation. Do not leave `.bak` copies.

## 4. Validate and preview

1. `npm run check` — must print `content OK`. A failure here is a front-matter problem; fix the file, not the validator.
2. Start the dev server in the background (`npm run dev -- --host 127.0.0.1`) and open `/blogs`. For a `post`, also open `/blogs/<slug>`.
3. Check the thumbnail crop on the card — wide, text-heavy images can crop to unreadable. Check dark mode too.
4. Tell the user the home page `/` needs a hard refresh to show the entry in "recent from /blogs" (the list is built once at page load), and that it shows only the newest three.

Then stop and wait. Do not commit before the user has looked at the preview and said it is fine. Proof-reading edits go straight into the file; no backups.

## 5. Commit and publish (only after explicit confirmation)

Their confirmation covers both commit and push, since pushing is how the public site updates — but say plainly that you are about to push.

1. `git status` and stage only this entry's Markdown file and its image(s). Other uncommitted work is not yours to sweep in.
2. Commit with a message like `Add <title> to blog archive`, ending with the attribution line the session gives you.
3. `git push`. The `deploy.yml` workflow runs on push to `master`: content validation, build, prerender, Pages deploy.
4. Check the run with `gh run list --limit 1` (then `gh run watch` if still going). Report failure with the log; do not retry blindly.
5. Once it is green, confirm the live site: `https://lily-feng.github.io/blogs` for the card, and `/blogs/<slug>` for a post. Allow a minute for Pages to update.
6. Stop the dev server you started.

For a `syndicated` post, remind the user to import it into Medium afterwards ("Import a story") so Medium's canonical tag points back here.
