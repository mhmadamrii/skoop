# Gemini CLI Guidelines - Skoop

## System-Specific Constraints
- I must NEVER modify any files within the `packages/native` directory unless explicitly asked for a UI change that requires it.
- All core business logic, types, and data fetching must reside in `packages/core`.
- Maintain the flat structure in `packages/`.

## Architecture
- Use `pnpm` workspaces for all packages.
- Follow the educational video focus: short-form (< 90s), expert-led, streak-based learning.
