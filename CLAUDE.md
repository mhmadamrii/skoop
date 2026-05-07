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
- Mobile: `Expo` (Router, SDK 51)
- Shared: `TypeScript`

## Design Context

Read these before any UI work. They are the source of truth for product
strategy and visual system; never override them silently.

- `PRODUCT.md` (root): register, users (SEA-first, Indonesia leading), product
  purpose (TikTok mechanics, educational payload), brand personality,
  anti-references, design principles, accessibility floor.
- `DESIGN.md` (root, seed): Creative North Star **"The Warung Lantern"** —
  committed saffron hue on non-feed chrome, feed stays nearly monochrome so
  video wins, single geometric sans, responsive (not choreographed) motion,
  OS-driven theme, flat chrome with scrims only over video. Re-run
  `/impeccable document` once real tokens and components exist.

Anti-references to enforce in every UI change: no enterprise-SaaS chrome, no
LMS course-platform energy, no brainrot TikTok cues. No `#000` / `#fff` —
every neutral is saffron-tinted.
