# CLAUDE.md

Web interface of the `secure-file-service` API (sibling repository): sign in, upload a file, follow its antivirus scan, download it once it is CLEAN. See `README.md` for setup and `PROMPTS.md` for the decisions taken.

## Stack
React, TypeScript, Vite, TanStack Query, React Router, Axios, Tailwind CSS, lucide-react. Exact versions live in `package.json` only.

## Commands
| Purpose | Command |
|---|---|
| Dev server (proxies `/api` to `http://localhost:8080`) | `npm run dev` |
| Type check and production bundle | `npm run build` |
| Lint | `npm run lint` |

The API must be running for the dev server to be useful (`docker compose up --build` in the backend repository).

## Code layout
Feature-first, like the backend contexts: `src/auth`, `src/files`, `src/shared` (Axios client in `lib/axios.ts`, `components/` for the generic Button, Card, Input and Brand, formatting). `App.tsx` holds the providers and the routes, `AppLayout.tsx` the header shared by the signed-in pages.

## Rules
- The browser only talks to the dev server: every call goes to a relative `/api/...` URL, proxied to the backend. Never hard-code the backend origin, never add CORS workarounds. Cookies are HttpOnly and `SameSite=Strict`: the page never reads or stores a token.
- Server data goes through TanStack Query (the session is a query too). No other state library, no WebSocket: the list is polled only while a file is not in a final status.
- All HTTP calls go through the Axios instance of `shared/lib/axios.ts` (`api`, base URL `/api/v1`); problem details are read with `apiErrorMessage`. A 401 ends the session.
- The upload streams the `File` as the raw body through Axios (`onUploadProgress`, `signal`); the API needs `Content-Length`, never read a file in memory in the page.
- Never log file content, names of files in errors sent elsewhere, or anything from the session.
- TypeScript strict, no `any`. Named exports, no default exports. One component per file. Styling is Tailwind classes only: no inline styles, no other CSS file than `index.css`, which only holds the `@theme` tokens (the ones of trading-ui) and the base of the page. Never put two utilities that set the same property in one class string, Tailwind's order decides, not the string's. `shared/components` know nothing of the domain. Icons come from `lucide-react` (imported where used, `size={18}` next to text).
- Comments explain why, not what. Match the style of the surrounding code.

## Working rules
- The author always commits. Never run `git commit` or `git push`.
- Work in reviewed steps, one prompt after the other. Do not invent features or endpoints: they come from the prompts and from the API.
- The API's contract lives in the backend repository (`ARCHITECTURE.md`, `README.md`). When it and this interface disagree, say so before changing either.
- `PROMPTS.md` logs the prompts only when the author asks. `README.md` and this file must always match reality.
- Each commit must build (`npm run build`) and lint (`npm run lint`).
- Tell the author when it is a good moment to commit, push or open a pull request, with the files to include and a compact commit message.
