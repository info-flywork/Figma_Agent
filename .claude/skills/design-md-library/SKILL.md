---
name: design-md-library
description: >-
  Library of 84 DESIGN.md design-system analyses of real brands (Airbnb, Apple, Stripe, Spotify, Revolut,
  Linear, Notion, Uber, Wise, Nike…) from VoltAgent/awesome-design-md. Each file holds colour tokens,
  typography scale, radii, spacing, components and do/don't rules in plain Markdown + YAML front matter.
  Use when choosing or defining the visual language of a new app project, when the user says "X gibi
  görünsün" / "make it look like <brand>", or when building the project's own DESIGN.md before the
  component + reference-screen phase.
---

# DESIGN.md library

`designs/<brand>.md` — one file per brand. `INDEX.md` — one line per brand with its summary.
Read `INDEX.md` first; open only the 1–3 files that fit (each is ~15–30 KB — never load them all).

## How we use it in this workspace

1. **Pick a base.** From the app's subject and audience, shortlist 2–3 brands in `INDEX.md`
   (or use the one the user names). Show the user the shortlist with one line each; let them choose.
2. **Write the project's own DESIGN.md** (`projects/<proje>/DESIGN.md`) in the same format:
   take the chosen file's structure and tokens as the starting point, then adapt — rename brand
   colours to the app's, swap proprietary fonts for available ones (Google Fonts / SF Pro),
   convert web sizes to the 430 px mobile scale. Combine with taste-skill's rules where they conflict
   with generic choices. This file — not the brand file — is the single source of truth afterwards.
3. **Do not copy a brand.** These are "inspired" analyses; never reuse logos, brand names or
   trademarked assets in the app's design.
4. **Read once.** After the project DESIGN.md exists, later screens read only it (and the cached
   component map), never this library again.

Source: https://github.com/VoltAgent/awesome-design-md (MIT, see LICENSE).
