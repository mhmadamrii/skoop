# Skoop Monorepo

## Build & Test Commands

- `pnpm install`: Install dependencies
- `pnpm build`: Build all packages (using Turbo)
- `pnpm -F @skoop/core build`: Build core logic only
- `pnpm -F @skoop/native start`: Start Expo development server
- `pnpm test:e2e`: Run E2E tests (Maestro)

## Project Structure

- `packages/core`: Domain logic, types, and mocks. **Source of truth.**
- `packages/native`: Expo/React Native mobile application.
- `packages/e2e`: Maestro end-to-end test flows.

## Tech Stack

- Package Manager: `pnpm`
- Orchestration: `Turbo`
- Mobile: `Expo` (Router, SDK 54, new architecture, React 19, RN 0.81)
- Shared: `TypeScript`
- Styling: **Uniwind** — Tailwind CSS v4 binding for React Native. Style with
  `className="..."`, not `StyleSheet.create`.

## Styling (Uniwind + Tailwind v4)

- Wire-up: `packages/native/metro.config.js` calls `withUniwindConfig` reading
  `./global.css`, which is the Tailwind v4 entry
  (`@import 'tailwindcss'; @import 'uniwind';`). Generated types land in
  `uniwind-types.d.ts`.
- Tokens: Tailwind v4 is CSS-first. Define brand tokens (saffron, charcoal
  warung, cream lantern) in `packages/native/global.css` under `@theme`, not in
  a JS config. Add new tokens there.
- Defaults: write `className="..."` first. Drop to `style={...}` only when
  Uniwind can't express something (rare — animated values, platform-only props).
- **Third-party components require `withUniwind()`.** `className` only works
  out of the box on RN core components (`View`, `Text`, `Pressable`,
  `ScrollView`, etc.). For imported components like `SafeAreaView` from
  `react-native-safe-area-context`, `BottomSheet`, `LinearGradient`, etc.,
  passing `className` is silently dropped — no styles apply. Wrap once and
  reuse:

  ```tsx
  import { withUniwind } from 'uniwind';
  import { SafeAreaView } from 'react-native-safe-area-context';

  const StyledSafeAreaView = withUniwind(SafeAreaView);

  // ✅ works
  <StyledSafeAreaView className='flex-1 bg-charcoal-warung' />
  ```

  For a single one-off prop (e.g. `flex: 1`), `style={{ ... }}` on the raw
  component is fine. Never pass `className` to a raw third-party component
  and assume it works.
- Anti-pattern: `StyleSheet.create` blocks in new code. Prefer Tailwind
  utilities; the Warung-Lantern token names should appear by name
  (`bg-charcoal-warung`, `text-saffron-500`), not as raw hex.

## Assets

- **Placeholder image:** when a screen calls for an image (creator avatar,
  lesson thumbnail, hero art) and the real asset isn't ready, use
  `packages/native/assets/images/placeholder.png`. Don't ship raw `<View>` color
  blocks as a stand-in — the placeholder keeps layout/aspect honest. Real
  assets land later; just swap the `source`.
- **Vector icons:** prefer `@expo/vector-icons` (Ionicons for UI, FontAwesome
  for brand glyphs like Apple/Google) over raster icons. They scale, theme,
  and don't need new asset files.

## Design Context

Read these before any UI work. They are the source of truth for product strategy
and visual system; never override them silently.

- `PRODUCT.md` (root): register, users (SEA-first, Indonesia leading), product
  purpose (TikTok mechanics, educational payload), brand personality,
  anti-references, design principles, accessibility floor.
- `DESIGN.md` (root, seed): Creative North Star **"The Warung Lantern"** —
  committed saffron hue on non-feed chrome, feed stays nearly monochrome so
  video wins, single geometric sans, responsive (not choreographed) motion,
  OS-driven theme, flat chrome with scrims only over video. Re-run
  `/impeccable document` once real tokens and components exist.

Anti-references to enforce in every UI change: no enterprise-SaaS chrome, no LMS
course-platform energy, no brainrot TikTok cues. No `#000` / `#fff` — every
neutral is saffron-tinted.
