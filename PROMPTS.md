# PROMPTS

Log of the significant prompts used to build this interface. The backend has its own log in the `secure-file-service` repository (see its `PROMPTS.md`, "Prompt 6"), which also holds the decisions about the API this interface talks to.

## Prompt 1 — The project and the API proxy

~~~~text
I need to build a React Front-End in TypeScript using Vite for the backend service secure-file-service. Let's create a new repository and call it secure-file-ui.
First help me set up the vite config with a proxy so any request to /api is forwarded to localhost. The backend uses HttpOnly cookies for auth.
~~~~

Decisions taken (author's questions, answers and corrections):
- Two repositories (backend and interface), not a monorepo. The interface is named `secure-file-ui`, after the backend `secure-file-service`.
- The browser talks to the dev server only: `/api` is proxied to the backend (`http://localhost:8080`, the port of the compose), so the `HttpOnly` `SameSite=Strict` cookies are same-site and travel with every call, without CORS configuration.
- The proxy exists in the dev server only. A production deployment needs a reverse proxy that serves the build and forwards `/api`; this is documented as an improvement, not built.
