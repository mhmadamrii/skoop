# Skoop

> TikTok mechanics, professor payload — short-form educational video for
> Southeast Asia.

Skoop is a vertical, infinite, personalized feed of sub-90-second educational
videos. The mechanics are TikTok's; the calories are different. Built
mobile-first for Indonesia and SEA, with a global path.

The strategic and visual source of truth lives alongside this README:

- [`PRODUCT.md`](./PRODUCT.md) — register, users, purpose, brand personality,
  anti-references, design principles, accessibility floor.
- [`DESIGN.md`](./DESIGN.md) — Creative North Star **"The Warung Lantern,"**
  the saffron-on-warm-charcoal visual system, named rules. Currently a seed;
  re-run `/impeccable document` once real components exist.
- [`ideas/visual-assets.md`](./ideas/visual-assets.md) — open asset and
  decision items (icon, splash, color/font picks, `app.json` cleanup).

Read those before any UI work. Never override them silently.

## Monorepo layout

| Package | Purpose |
|---|---|
| [`packages/core`](./packages/core) | Domain logic, types (`Lesson`, `Creator`, `UserStats`), and mocks. **Source of truth for the data model.** |
| [`packages/native`](./packages/native) | Expo / React Native mobile app (SDK 54, RN 0.81, React 19, new architecture). |
| [`packages/e2e`](./packages/e2e) | Maestro end-to-end flows. |

## Tech stack

- **Package manager:** `pnpm` 9
- **Orchestration:** Turbo
- **Mobile:** Expo Router, React Native
- **Styling:** Uniwind — Tailwind CSS v4 binding for React Native. Theme
  tokens live in [`packages/native/global.css`](./packages/native/global.css)
  under `@theme`. Style with `className="..."`, not `StyleSheet.create`.
- **Shared:** TypeScript, monorepo via pnpm workspaces.

## Getting started

```bash
pnpm install
pnpm -F @skoop/core build       # core compiles to dist/, consumed by native
pnpm dev:native                  # turbo -F @skoop/native dev → expo start
```

Then press `i` for iOS Simulator, `a` for Android, or scan the QR with Expo
Go. If you'll be editing `packages/core` source, run its watcher in a second
terminal:

```bash
pnpm -F @skoop/core dev          # tsc -w
```

## Common scripts

| Command | What it runs |
|---|---|
| `pnpm dev:native` | Start the Expo dev server for the mobile app. |
| `pnpm build` | Build all packages via Turbo. |
| `pnpm -F @skoop/core build` | Compile the shared core package only. |
| `pnpm lint` | Lint every package. |
| `pnpm format` | Prettier across `**/*.{ts,tsx,md}`. |
| `pnpm test:e2e` | Run Maestro flows in `packages/e2e`. |

## MVP scope

A vertical, infinite, personalized feed; creator uploads with category
tagging; basic library, follows, and streaks. The next strategic bet after
launch is automated content moderation — an *"is this allowed on Skoop"*
filter that keeps the feed educational as creator volume scales.

See `PRODUCT.md` for the full strategic frame.

## Anti-references — enforced in every PR

- **No** enterprise-SaaS chrome (no sidebars, dashboards, hero-metric
  templates, generic-blue-Inter-on-white).
- **No** LMS / course-platform energy (no course-card grids, no
  progress rings on every screen, no certificate badges).
- **No** brainrot TikTok cues (no red-dot notification spam, no fake
  urgency, no hostile autoplay traps).
- **No** `#000` or `#fff`. Every neutral is saffron-tinted.
