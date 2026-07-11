# AITutor

Grounded, step-by-step AI tutoring for IIT-JEE / NEET aspirants. RAG-grounded
Q&A today; a verified-reasoning engine ("LLM proposes, math disposes") is the
long-term moat — see [`docs/Startup-MOC.md`](docs/Startup-MOC.md).

## Stack (current — MVP scaffold)

- **`frontend/`** — Expo / React Native, web-first PWA (iOS/Android from the
  same codebase later). Four screens: Ask, Thread, History, Account.
- **`backend/`** — FastAPI monolith. RAG (Supabase Postgres + pgvector) →
  DeepSeek (primary) / Gemini (vision + failover), SSE streaming, Stripe
  billing.
- **Supabase** — auth, Postgres + pgvector, file storage. One managed
  service instead of three.

Full architecture and design rationale:
[`docs/Architecture/AITutor-MVP-Architecture.md`](docs/Architecture/AITutor-MVP-Architecture.md).

## Quickstart

```bash
# backend
cd backend
cp .env.example .env        # fill in Supabase + LLM + Stripe keys
python -m venv .venv && .venv\Scripts\activate   # Windows; source .venv/bin/activate on macOS/Linux
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8080

# frontend (separate shell)
cd frontend
cp .env.example .env        # Supabase URL/anon key + API URL
npm install
npm run web                 # http://localhost:8081
```

See [`backend/README.md`](backend/README.md) and
[`frontend/README.md`](frontend/README.md) for full setup, including the
one-time Supabase project + `schema.sql` step and content ingestion.

## Docs

Product/architecture decisions live in [`docs/`](docs/) (an Obsidian-style
vault); code lives here. Start at
[`docs/Startup-MOC.md`](docs/Startup-MOC.md).

## Prior implementation

An earlier Angular + FastAPI/SQLite (Claude + planned SymPy verifier) build
is preserved on the `archive/angular-fastapi-redesign` branch — nothing was
deleted when the stack changed.
