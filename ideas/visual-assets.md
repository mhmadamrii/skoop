# Visual Assets & Decisions — Human Handoff

What you (human) need to do so I (Claude) can build the Skoop UI on-brand. Two
parts: **decisions** only you can make, then **assets** to generate via your
image-gen AI.

Everything below is anchored to `PRODUCT.md` and `DESIGN.md`. North Star: **"The
Warung Lantern."** Saffron-family hue carries non-feed chrome; feed stays nearly
monochrome so video wins. Single geometric sans, flat chrome, OS-driven theme.

---

## Style Anchor — paste at the top of every image-gen prompt

Keep this identical across every asset so the system reads as one app.

> **Style:** warm saffron-family palette (deep saffron-orange ~#E89638),
> warm-charcoal dark surround (never pure black — slight saffron tint),
> cream-lantern light surround (never pure white). Southeast-Asian-evocative
> without being literal. Playful but smart, generous, confident. **Never:**
> enterprise-SaaS chrome, LMS / classroom imagery, brainrot-TikTok cues, cartoon
> mascots, neon, gradient text, drop shadows. Mobile-first, flat, geometric,
> modern.

If you change the saffron hex in Part 1, edit it here too before generating.

---

## Part 1 — Decisions you owe me

### 1.1 Saffron primary (the brand color)

Pick one. I'll write it into `global.css` as a Tailwind theme token.

| Pick                            | Hex (approx) | OKLCH                | Vibe                                       |
| ------------------------------- | ------------ | -------------------- | ------------------------------------------ |
| **Saffron Lantern** _(default)_ | `#E89638`    | `oklch(70% 0.16 65)` | Warm, edible, SEA-native — the warung lamp |
| **Spiced Marigold**             | `#F2A218`    | `oklch(75% 0.17 75)` | Brighter, more golden, daytime-leaning     |
| **Burnt Saffron**               | `#C97532`    | `oklch(62% 0.14 55)` | Deeper, more oxidized, evening-leaning     |

Tip: ask your image-gen AI to render a 3-up swatch comparison on a phone mock to
compare in context.

### 1.2 Charcoal warung (dark surround)

Default: `#14110D` / `oklch(15% 0.005 65)` — slight saffron tint, not gunmetal.
Confirm or replace.

### 1.3 Cream lantern (light surround)

Default: `#FAF6EE` / `oklch(96% 0.008 75)` — warm cream, not paper-white.
Confirm or replace.

### 1.4 Geometric sans family

Pick one. All are Bahasa Indonesia-friendly (full Latin Extended, Vietnamese,
likely Thai — verify diacritics on the family page before committing).

| Family                                 | Free?           | Variable? | Note                                    |
| -------------------------------------- | --------------- | --------- | --------------------------------------- |
| **Geist Sans** (Vercel)                | Yes (OFL)       | Yes       | Default. Modern, neutral, multilingual. |
| **General Sans** (Indian Type Foundry) | Yes (Fontshare) | Yes       | Slightly warmer, humanist edge.         |
| **Satoshi** (Indian Type Foundry)      | Yes (Fontshare) | Yes       | More characterful, geometric.           |
| **Aeonik** (CoType)                    | Paid            | Yes       | Distinctive but per-platform license.   |

### 1.5 Launch categories

Confirm the 6–8 categories that ship at launch. These drive icon choice (Part
2.C) and the category-tab strip.

Suggested slate (Bahasa-first):

1. **Sains** — Science
2. **Sejarah** — History
3. **Bahasa** — Languages
4. **Koding** — Coding
5. **Keuangan** — Finance
6. **Seni** — Art
7. **Kesehatan** — Health & Body
8. **Alam** — Nature & Earth

Edit, reorder, or replace.

### 1.6 Logo / wordmark

- **A. Type-only mark for v0** _(recommended)._ "Skoop" set in your chosen
  geometric sans, Bold weight, slightly tightened, in saffron. I render this in
  code. **No image generation needed.**
- **B. Logomark + wordmark.** A drawn lantern symbol next to the wordmark. Defer
  to v0.5 unless you want it now.

If A: nothing to do here — confirm the choice. If B: tell me, and I'll add a
logomark prompt to Part 2.

### 1.7 App tagline

Used on splash, store listing, onboarding hero.

Suggested: **_"Belajar dalam 90 detik."_** (Learn in 90 seconds.)

Confirm or edit.

### 1.8 App identity in `app.json` (I'll fix once you confirm)

Currently still on Expo template defaults — needs your call:

| Field                                                   | Current                  | Should be                              |
| ------------------------------------------------------- | ------------------------ | -------------------------------------- |
| `expo.name`                                             | `"native"`               | `"Skoop"`                              |
| `expo.slug`                                             | `"native"`               | `"skoop"`                              |
| `expo.scheme`                                           | `"native"`               | `"skoop"`                              |
| `expo.android.adaptiveIcon.backgroundColor`             | `"#E6F4FE"` (React-blue) | charcoal warung or saffron — your call |
| `expo.plugins[expo-splash-screen].backgroundColor`      | `"#ffffff"`              | cream lantern (`#FAF6EE`)              |
| `expo.plugins[expo-splash-screen].dark.backgroundColor` | `"#000000"`              | charcoal warung (`#14110D`)            |

---

## Part 2 — Assets to generate

Priority order: A → B are blocking for a real-feeling MVP. C uses an icon
library, no generation. D–F are nice-to-have for v0.

### 2.A App icon _(highest priority)_

**Where it lives:** Home screen. The single most important brand surface.
**Specs:** 1024×1024 PNG, full bleed (OS rounds corners — no inner padding).
**File targets** (overwrite the Expo placeholders):

- `packages/native/assets/images/icon.png` (iOS, full color)
- `packages/native/assets/images/android-icon-foreground.png` (with safe-zone
  padding — keep the symbol within the inner 66% so OS masking doesn't crop)
- `packages/native/assets/images/android-icon-background.png` (solid color,
  charcoal warung or saffron — must coordinate with foreground)
- `packages/native/assets/images/android-icon-monochrome.png` (white-on-
  transparent silhouette of the symbol, for Android themed icons)
- `packages/native/assets/images/favicon.png` (48×48 PNG, web fallback)

**Prompt (paste with the Style Anchor prefixed):**

> [Style Anchor] App icon for **Skoop**, a short-form educational video app. A
> simple, abstract **warung lantern** symbol — a small pendant lamp with a
> single warm-saffron flame inside a geometric outline — centered on a deep
> warm-charcoal background. Single-line construction, flat, no gradients, no
> shadows, no text. Iconic and confident at 60×60px. **1024×1024 square, full
> bleed.** Inspired by Apple-icon craft. Modern, minimal, SEA-native.

Then ask for variants in the same style:

- _"Same icon, foreground only, transparent background, 1024×1024."_
- _"Same icon, white silhouette only, transparent background, 1024×1024."_
- _"Solid charcoal-warung background swatch, 1024×1024."_ (or saffron — pick)

### 2.B Splash screen icon

**Where it lives:** Native splash before the JS bundle loads. **Spec from
`app.json`:** centered, `imageWidth: 200`, `resizeMode: contain`. So the asset
itself should be a square _icon_, not full-screen art — the backgrounds are
filled by `app.json` colors (set in Part 1.8). **Files:**
`packages/native/assets/images/splash-icon.png` (1024×1024 PNG, transparent
background, symbol centered with ~10% padding).

**Prompt:**

> [Style Anchor] Splash-screen icon for Skoop. The same warung-lantern symbol as
> the app icon (single saffron flame inside a geometric pendant lantern
> outline), but rendered slightly larger and in **saffron stroke on transparent
> background**, so it can sit over either a charcoal-warung dark backdrop or a
> cream-lantern light backdrop. 1024×1024 PNG, ~10% padding, centered. Flat,
> single-line, no shadows.

### 2.C Category icons

**Recommendation: don't image-gen these.** Use **Lucide React Native** or
**Phosphor Icons** (both already work cleanly with Expo). One icon per category,
tinted saffron when active and `bright-smoke` when inactive.

Suggested mapping (Lucide icon names):

| Category  | Lucide                             |
| --------- | ---------------------------------- |
| Sains     | `Atom` or `Microscope`             |
| Sejarah   | `Scroll` or `BookOpen`             |
| Bahasa    | `Languages` or `Globe`             |
| Koding    | `Code2` or `Terminal`              |
| Keuangan  | `CircleDollarSign` or `TrendingUp` |
| Seni      | `Palette`                          |
| Kesehatan | `HeartPulse` or `Activity`         |
| Alam      | `Leaf` or `Mountain`               |

I'll wire these in code. **Nothing for you to do** unless you'd rather have
custom illustrated category icons (then tell me and I'll add prompts here).

### 2.D Onboarding illustrations _(optional for v0)_

Three frames, one per onboarding screen.

**Specs:** 1242×1600 PNG, transparent background, illustration occupies ~80% of
the canvas, designed to sit above body copy.

**Prompts (use one per frame):**

> [Style Anchor] Onboarding illustration #1 for Skoop. **Concept: "swap the
> scroll."** A stylized phone in vertical orientation. Coming out of the screen:
> small floating glyphs of knowledge — a science atom, a Bahasa letter, a coin,
> a paintbrush — drifting upward like sparks from a warung lantern. Single-line
> geometric style, saffron and warm-charcoal, on transparent background. Flat,
> no gradients, no shadows. 1242×1600 PNG.

> [Style Anchor] Onboarding illustration #2 for Skoop. **Concept: "90-second
> takeaway."** A phone in mid-swipe (slight motion lines), with a small saffron
> timer arc indicating ~90s. Around it, three small lesson "bites" — tiny
> rectangles labeled with category symbols — clustered like food portions on a
> warung tray. Geometric, flat, single-line, saffron + warm charcoal on
> transparent background. 1242×1600 PNG.

> [Style Anchor] Onboarding illustration #3 for Skoop. **Concept: "your feed,
> your warung."** A small lantern hanging at center; below it, a stylized stream
> of vertical video cards descending like a feed. The lantern's glow tints the
> nearest cards saffron, the rest fade to warm charcoal. Flat, geometric,
> single-line. 1242×1600 PNG, transparent background.

### 2.E Empty-state illustrations _(optional for v0)_

Two minimum: empty library, no internet. Each ~800×800 PNG, transparent
background.

> [Style Anchor] Empty-state illustration: **"empty library."** A small warung
> lantern, unlit, line-drawing only. A single saffron spark hovering just above
> it, suggesting the first save. Flat, geometric, transparent background,
> 800×800 PNG.

> [Style Anchor] Empty-state illustration: **"no internet."** A warung lantern
> with its cord disconnected, drifting slightly. Single-line, geometric,
> saffron + warm charcoal, transparent 800×800 PNG.

### 2.F Placeholder thumbnails & avatars _(no generation needed)_

For dev-only mocks while real content is absent:

- **Thumbnails:** Unsplash Source URLs (`https://images.unsplash.com/photo-…`)
  or `https://picsum.photos/seed/<id>/720/1280` for predictable seeds.
- **Avatars:** `https://i.pravatar.cc/150?img=N` (N = 1..70). Or DiceBear
  `https://api.dicebear.com/7.x/notionists/svg?seed=<name>`.

I'll wire these into `packages/core/src/mocks.ts`. Nothing for you to do.

---

## Part 3 — What I'll do once you deliver

Order of operations once Part 1 decisions and Part 2.A + 2.B assets land:

1. Write Tailwind v4 theme tokens in `packages/native/global.css` (saffron,
   charcoal warung, cream lantern, dim/bright smoke ramps, plus the
   geometric-sans family loaded via `expo-font`).
2. Update `packages/native/app.json` per Part 1.8 (name, slug, scheme,
   adaptive-icon background, splash backgrounds).
3. Drop your generated icon files into the paths in Part 2.A and 2.B.
4. Replace `index.tsx`'s placeholder `StyleSheet.create` colors with Tailwind
   classes (`bg-charcoal-warung`, `text-cream-lantern`, etc.).
5. Wire Lucide category icons + the launch category list into a real
   bottom-tab + category-strip component.
6. Re-run `/impeccable document` once the above components exist — that pass
   populates `DESIGN.md`'s Components section and writes the live-panel sidecar
   with real button/card/input snippets.

---

## TL;DR — fastest unblock

If you only do three things, do these:

1. **Pick saffron + neutrals + font** (Part 1.1, 1.2, 1.3, 1.4).
2. **Generate the app icon set** (Part 2.A, six file targets).
3. **Generate the splash icon** (Part 2.B, one file).

Everything else can come later — the app will already feel like Skoop.
