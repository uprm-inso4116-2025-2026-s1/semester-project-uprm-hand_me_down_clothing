This repository is a Next.js 15 app (React 19) that uses Supabase for auth and data storage.

Keep instructions short and actionable. Focus on the code structure and patterns used in this project so an AI coding agent can be productive immediately.

Key facts
- Next.js app router under `app/` (server components by default). See `app/layout.tsx` for global layout.
- Supabase is the primary backend: client created in `app/auth/supabaseClient.ts` (reads env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Auth helpers in `app/auth/auth.ts` implement signUp, signIn, signOut, requestPasswordReset, updatePassword and getUser via `supabase.auth`.
- Domain logic for pieces lives in `src/repositories/pieceRepository.ts` and object construction in `src/factories/pieceFactory.ts` (SoldPiece vs DonatedPiece based on `price`).
- Components and UI live under `app/*` and `src/components/*`. Small utility clients exist under `app/utils/supabase/client.ts`.

Architecture and patterns to respect
- Server vs client: prefer server components for data fetching in `app/` pages unless interactive client behavior is required. When using `useState`, `useEffect`, or event handlers, mark components with 'use client'.
- Repositories + Factories: Data flows from Supabase -> repository -> factory -> domain objects. When adding data-layer code, use `PieceRepository` as the pattern (see `getPieces`, `getPieceById`, `filterPieces`).
- DTOs: `PieceFactory.toDTO()` shows the shape expected for DB writes. Keep field names identical to the `pieces` table: id, name, category, color, brand, gender, size, price, condition, reason, images, user_id.
- Error handling: methods generally return empty arrays, null, booleans, or Supabase `error` objects. Preserve these return shapes when adding or refactoring code.

Developer workflows and commands
- Local dev: `npm run dev` (Next dev server, port 3000). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment when running locally.
- Build: `npm run build` uses Turbopack. `npm start` runs the production server.
- Lint: `npm run lint` (ESLint). Follow existing project lint rules; don't reformat unrelated files.

Conventions and examples
- File organization: UI pages under `app/`, domain models under `app/types/`, repositories in `src/repositories/`, factories in `src/factories/`, components in `src/components/`.
- Supabase client usage: prefer `createClient()` from `app/utils/supabase/client.ts` or `supabase` exported from `app/auth/supabaseClient.ts`. Example from `pieceRepository.ts`:

  const { data, error } = await this.supabase.from('pieces').select("*").eq('id', id).single();

- Auth flows: password reset flow uses `supabase.auth.resetPasswordForEmail(email)` in `requestPasswordReset`. After the email link, the UI should call `supabase.auth.updateUser({ password })`.

Testing and quick checks
- There are no automated tests in the repo. When adding code, include small unit tests where feasible (Node/TSJest or use simple runtime checks) and ensure TypeScript compiles (`tsc`) and the Next dev server starts.

What to avoid or watch for
- Don't assume a separate backend—Supabase is both auth and DB. Avoid introducing duplicate auth flows.
- Don't change DB field names or DTO shapes without updating `PieceFactory` and repository methods.
- Next.js app router specifics: pages in `app/` are server-first. Keep interactions explicit with `use client` where needed.

Where to look first for changes
- Add data logic: `src/repositories/pieceRepository.ts` + `src/factories/pieceFactory.ts`.
- Auth/UI change: `app/auth/*` and `app/layout.tsx` for layout-level effects.
- New UI components: `src/components/` and pages under `app/*`.

If unsure, run locally and reproduce the behavior: 1) set env vars, 2) npm run dev, 3) exercise the flow in the browser (signup, login, create piece). Report any mismatch between Supabase table fields and DTOs.

Ask clarifying questions when API details (Supabase table columns, Row types) are not visible in the codebase; prefer reading real DB schema before making breaking changes.

Quick contact pointers
- This project uses standard Next.js + Supabase patterns. If you need naming guidance, follow existing files: `Piece`, `SoldPiece`, `DonatedPiece` in `app/types` and mirror their fields in DTOs.

End of copilot-instructions.md
