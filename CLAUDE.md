# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start dev server on localhost:3000
pnpm build     # Production build
pnpm lint      # Run ESLint
```

Use `pnpm` as the package manager (pnpm-workspace.yaml is present).

To add shadcn/ui components: `pnpm dlx shadcn@latest add <component>`

## Environment Variables

`GEMINI_API_KEY` is required for the AI restoration feature. The app checks for it in `app/actions/restore.ts`.

## Architecture

This is a Next.js 16 App Router app called **RevAIve** — an AI-powered photo restoration tool.

**Data flow:**
1. User uploads a photo via `UploadZone` (drag-and-drop or file picker)
2. User selects a restoration preset in `PresetSelector`
3. `PhotoRestorer` (main orchestrator, client component) calls the `restorePhoto` server action
4. The server action sends the image + preset prompt to **Google Gemini 2.5 Flash Image** (`gemini-2.5-flash-image`) via `@google/genai`
5. The returned base64 image is displayed in `CompareView` with a before/after slider

**Key files:**
- `app/components/PhotoRestorer.tsx` — central state machine managing the entire UI flow (`idle → uploading → processing → success/error`)
- `app/actions/restore.ts` — Next.js Server Action that calls Gemini API
- `lib/presets.ts` — defines the 4 restoration modes (`restore-only`, `restore-colorize`, `colorize-only`, `enhance`) with their Gemini prompts
- `lib/types.ts` — shared TypeScript types for the app
- `lib/validation.ts` — file validation (PNG/JPEG/WebP, max 10MB)
- `lib/utils.ts` — shadcn `cn()` utility

**UI patterns:**
- Spinner exit animation: after Gemini responds, the app waits 900ms for the spinner exit animation before transitioning to success/error state (controlled via `spinnerExiting` + `pendingResultRef`)
- Custom CSS classes in `globals.css`: `border-dashed-translation` (animated dashed border for upload zone) and `border-extract` (corner bracket decoration)
- Fonts: Cutive Mono (body/mono) and Arvo (headings) loaded via `next/font/google`
- Theme: warm sepia background (`#f0dba5`) in light mode, dark mode supported via `.dark` class
- shadcn/ui components live in `components/ui/` (currently Button and Dialog); style is "new-york" with neutral base color and CSS variables

**Adding presets:** Add a new key to the `Preset` union in `lib/types.ts` and add the corresponding entry in `lib/presets.ts`.
