# AITutor App

Single-codebase Expo app (web-first PWA; iOS/Android via the same code in
Phase 2). Four screens: Ask, Thread, History, Account — see `../AITutor.md` §4.

## Setup

1. `cp .env.example .env` — Supabase URL + anon key (Settings → API) and the
   API base URL.
2. In Supabase: enable Email auth (and Google OAuth if you want the button),
   and create the public `question-images` storage bucket.
3. Run:

   ```sh
   npm install
   npm run web        # or: npm start (Expo Go for native)
   npm run typecheck
   ```

## Structure

```
app/            expo-router screens: index (Ask), thread/[id], history, account, sign-in
components/     the ~6 owned primitives (no component library, by design)
lib/            theme tokens · supabase auth · API client + SSE · LaTeX rendering
state/          one Zustand store: the live streaming answer
```

Design rules (from the spec): system fonts, one type scale, monochrome + one
indigo accent, and the streaming text is the only animation. Math renders with
KaTeX on web (`lib/math.web.tsx`); native shows LaTeX as styled code until the
Phase-2 WebView-KaTeX bundle lands (`lib/math.tsx`).
