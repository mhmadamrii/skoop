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
