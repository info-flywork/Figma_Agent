---
name: web-interface-guidelines
description: >-
  Vercel's Web Interface Guidelines — MUST/SHOULD/NEVER rules for accessible, fast, well-behaved
  interfaces: hit targets, focus and interactive states, forms and validation, loading/empty/error
  states, content overflow, safe areas, typography details, copywriting. Use when designing components
  and their variants/states, when building or reviewing a screen (Figma or code), and as a checklist in
  the audit step. Also use to review UI code for compliance (`references/review-checklist.md`).
---

# Web Interface Guidelines

- `references/guidelines.md` — the full rule set (Vercel, MIT). Read the sections you need.
- `references/review-checklist.md` — terse checklist for reviewing UI **code**; output `file:line - issue`.

## Applying it to Figma mobile design (this workspace)

The rules are written for web code; for 430 px Figma screens use the ones that are visible in a design:

| Rule | In Figma |
| --- | --- |
| Hit target ≥ 44 px on mobile | Buttons, list rows, icon buttons, tab items: min 44×44 frame (icon can be smaller inside) |
| Input font ≥ 16 px | Text field value/placeholder text style ≥ 16 px |
| Interactive states | Components get variants: default / pressed / focused / disabled (+ loading for buttons, error for fields) |
| Loading buttons keep their label | Loading variant = spinner + same label |
| Errors inline, with the fix | Field error variant: message under the field saying what to do |
| Empty / long content | Design empty states; text layers set to truncate or wrap; test with long names |
| Destructive actions | Confirmation sheet/dialog or undo toast in the flow |
| Safe areas | Status bar + home-indicator zones respected; nothing tappable in them |
| Typography | `…` not `...`, curly quotes, tabular numbers for figures, "Yükleniyor…" style loading text |
| Copy | Active voice, specific button labels ("Kaydet", not "Devam"), numerals for counts. Title Case rule is English-only — for Turkish follow sentence case. |
| Contrast | Text/background meets WCAG AA; interactive states more prominent than rest |

Code-only rules (hydration, `aria-*`, virtualization, preload…) apply only when the design is later
implemented in code.

Source: https://github.com/vercel-labs/web-interface-guidelines (MIT, see LICENSE).
