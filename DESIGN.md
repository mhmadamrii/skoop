---
name: Skoop
description:
  TikTok mechanics, professor payload — short-form educational video for SEA.
---

<!-- SEED: re-run /impeccable document once there's code to capture the actual
tokens and components. -->

# Design System: Skoop

## 1. Overview

**Creative North Star: "The Warung Lantern"**

A _warung_ is a Southeast Asian street stall: small, warmly lit, run by one
expert who knows their thing, serving small portions you take with you. The
lantern is the warm glow that marks the stall in the night market — the thing
you walk toward. Skoop is the warung; the lesson is the small portion; the brand
color is the lantern. The video is the food. The chrome around it is firelight
that says _"this is the stall worth stopping at."_

Translated to the screen: the feed is nearly monochrome and lets the video be
the only color. Everywhere _outside_ the feed (library, profile, upload,
onboarding, category tabs), one warm saffron-family hue carries 30–60% of the
surface. The chrome asserts identity loudly when the video isn't there to do it.
Type is a single geometric sans, bold and confident, never cute. Motion is
responsive — taps feel back, transitions ease — but nothing choreographs itself.
Theme follows the OS automatically; both light and warm-dark are first-class,
but the dark surround is the canonical scene for vertical video on a phone in
bed at 11pm.

This system explicitly rejects enterprise-SaaS chrome (no sidebars, no
dashboards, no hero-metric templates), LMS course-platform energy (no
course-card grids, no progress rings on every screen, no certificate badges),
and brainrot TikTok cues (no red-dot notification spam, no fake urgency, no
hostile autoplay traps).

**Key Characteristics:**

- Warm SEA-native hue carries non-feed chrome; the feed itself stays dark and
  silent so the video wins.
- One geometric sans across the entire app — no display/body split. Confidence
  via weight contrast and scale, not via face contrast.
- Motion is responsive, never choreographed. Feedback, never performance.
- Theme follows the OS. Both light and dark surfaces designed in tandem; neither
  is a retrofit.
- Flat by default. Depth comes from gradient scrims over video, not from
  elevation shadows on chrome.

## 2. Colors

**The Committed Saffron Rule.** Skoop commits to one warm SEA-native hue —
saffron / spiced-orange family — and lets it carry 30–60% of every non-feed
surface. The feed itself stays nearly monochrome so the video is the only color
in the frame. This is the signature: a warm glow on the warung, a black-velvet
backdrop on the lesson.

### Primary

- **Saffron Lantern** (`[to be resolved during implementation]`): the brand
  color. Carries category tabs, primary buttons, active states, brand surfaces
  (onboarding, upload, profile header). Warm and confident — not neon, not
  corporate-orange.

### Neutral

- **Charcoal Warung** (`[to be resolved during implementation]`): the dark
  surround. Tinted _toward_ saffron (chroma ≈ 0.005–0.01), never `#000`. The
  feed background, the canonical surround for vertical video.
- **Cream Lantern Light** (`[to be resolved during implementation]`): the
  light-theme surround. Tinted toward saffron, never `#fff`.
- **Dim Smoke / Bright Smoke** (`[to be resolved during implementation]`): one
  mid-tone family for inactive chrome, divider lines, secondary text. Saffron-
  tinted in both themes.

### Named Rules

**The No-Pure-Black, No-Pure-White Rule.** Every neutral is tinted toward
saffron (chroma ≈ 0.005–0.01). `#000` and `#fff` are forbidden. The surround
should always feel warm-adjacent to the lantern, never clinical.

**The Feed-Is-Naked Rule.** Inside the vertical feed, the only colors on screen
are the video and a single saffron tap-state. No category chips in brand color,
no engagement counters in brand color, no creator chrome in brand color. Saffron
earns its presence by being scarce inside the feed and abundant outside it.

## 3. Typography

**Display Font:** `[geometric sans, to be chosen at implementation]` (candidate
families: Satoshi, Söhne, Aeonik, General Sans Variable — one face for the
entire app) **Body Font:** same family **Label/Mono Font:** none — labels are
the same face, tracked-out and weighted up

**Character:** one geometric sans does the entire job. Confidence comes from
weight contrast (Bold for titles, Regular for body, Medium for labels) and from
scale, not from mixing faces. The chosen family must support full Latin Extended
(Bahasa Indonesia diacritics) and ideally Vietnamese, Thai, and Tagalog without
visibly different metrics. Variable axes preferred so weight scales smoothly
under iOS Dynamic Type and Android font scale.

### Hierarchy

- **Display** (Bold, ~32–40px, line-height 1.05): lesson titles in the feed
  overlay, hero headers in onboarding.
- **Headline** (Bold, ~24px, line-height 1.15): library section headers,
  category screen titles.
- **Title** (Semibold, ~18px, line-height 1.25): card titles, list-row primary
  text.
- **Body** (Regular, ~16px, line-height 1.45): descriptions, captions, modal
  copy. The phone column enforces line length naturally.
- **Label** (Medium, ~13px, tracked +0.05em): category chips, button labels,
  metadata rows.

### Named Rules

**The One-Voice Rule.** One typeface, no exceptions. Hierarchy comes from weight
and scale, never from a second face. Mixing a serif "for the professor side" and
a sans "for the TikTok side" is forbidden — that's the LMS reflex.

**The Bahasa-First Rule.** Every text style must be tested with real Bahasa
Indonesia content (long compound words, diacritics) before it ships. If a line
breaks cleanly in English but awkwardly in Bahasa, the design is wrong.

## 4. Elevation

Flat by default. Skoop's chrome does not use box-shadows on buttons, cards,
sheets, or surfaces — those read as enterprise-SaaS or as the 2014 "raised card"
reflex. Depth comes from exactly two things: (a) vertical scrim gradients over
the top and bottom of the video so overlay text stays legible, and (b)
state-based tonal shifts (a button surface darkens slightly on press).

### Shadow Vocabulary

- **Video top-scrim**
  (`linear-gradient(to bottom, rgba(charcoal, 0.6), transparent)`, ~96px tall):
  protects creator name, lesson title, and category chip from bright-video
  washout.
- **Video bottom-scrim**
  (`linear-gradient(to top, rgba(charcoal, 0.7), transparent)`, ~140px tall):
  protects description and the like/save/share rail.
- _No `box-shadow` on chrome surfaces._

### Named Rules

**The No-Shadow-On-Chrome Rule.** Cards, buttons, sheets, modals, and tab bars
have zero box-shadow. They sit flat on their surround. Chrome depth is tonal
contrast, never a drop shadow. Shadows exist only as scrims over video.

## 5. Components

_Omitted in this seed pass._ No components exist yet beyond the placeholder
`index.tsx` screen. Re-run `/impeccable document` once buttons, cards, inputs,
the feed cell, the category chip, and the bottom tab bar are real, and this
section will be populated with shape, color assignment, padding, and state
treatments.

## 6. Do's and Don'ts

### Do:

- **Do** commit to one saffron-family hue across all non-feed chrome. Identity
  comes from rarity inside the feed and abundance outside it.
- **Do** tint every neutral toward saffron (chroma ≈ 0.005–0.01). The dark
  surround is warm charcoal, not gunmetal; the light surround is cream lantern,
  not paper white.
- **Do** use one geometric sans for the entire app. Hierarchy via weight and
  scale.
- **Do** test every text style with real Bahasa Indonesia content before
  shipping it.
- **Do** keep chrome flat. Depth on chrome is tonal; depth on video is a scrim
  gradient.
- **Do** build both light and dark themes from day one with token parity. Dark
  is the canonical scene; light is not a retrofit.
- **Do** make tap targets ≥44×44pt, even when the design wants to feel
  "TikTok-tight."

### Don't:

- **Don't** use enterprise-SaaS chrome — no sidebars, no dashboards, no
  hero-metric templates, no settings-heavy first impressions, no
  generic-blue-Inter-on-white surfaces. _(PRODUCT.md anti-reference, verbatim.)_
- **Don't** use LMS course-platform energy — no course-card grids, no
  percentage-complete progress bars on every screen, no "module 3 of 12" chrome,
  no certificate badges, no formal headers. _(PRODUCT.md anti-reference,
  verbatim.)_
- **Don't** copy brainrot TikTok cues — no red-dot notification spam, no fake
  urgency, no hostile autoplay traps that punish leaving, no ragebait surfaced
  in UI, no fake-engagement counters. _(PRODUCT.md anti-reference, verbatim.)_
- **Don't** use `#000` or `#fff` anywhere. Every neutral is saffron-tinted.
- **Don't** use `box-shadow` on chrome surfaces. Flat by default.
- **Don't** use `border-left` greater than 1px as a colored accent stripe.
  Banned by impeccable's shared design laws.
- **Don't** use gradient text (`background-clip: text` over a gradient). Solid
  colors only; emphasis via weight or scale.
- **Don't** introduce a second typeface "for the professor side." That's the LMS
  reflex.
- **Don't** animate CSS layout properties. Use transforms and opacity, eased out
  with exponential curves. No bounce, no elastic.
- **Don't** switch typefaces by locale. One sans must serve Bahasa, English, and
  any other SEA script.
