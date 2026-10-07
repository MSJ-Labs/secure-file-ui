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

## Prompt 2 — Authentication

~~~~text
Now we implement auth. The backend habndles auth via HttpOnly cookies.
Can you build:
1. a clean Sign In . Sign up page
2. a Http client wrapper that checks session status /users/me via TanStack Query.
3. Automatic 401 handling : if an api call fails with 401,attempt with a single refresh call or make a smart call when the token is about to expire.
~~~~

Decisions taken (author's questions, answers and corrections):
- The cookies are HttpOnly, so the page can neither read a token nor its expiry. "Who am I" is therefore a query (`GET /api/v1/users/me`, key `['me']`): a 401 means nobody is signed in, which is an answer (`null`) and not an error to retry. The server stays the only source of truth for the session.
- One page for sign in and sign up (a switch between the two modes). Registering signs the user in right after.
- The HTTP client wrapper (`shared/http.ts`) turns the RFC 9457 problem of the API into an `ApiError` carrying the status and the `detail`, which the forms display as they are.
- A 401 is answered by one refresh (`POST /api/v1/auth/refresh`) and one retry of the call. Calls that expire together share the same refresh, so the refresh cookie is not rotated several times. The auth routes are excluded: a wrong password is a 401 that a refresh cannot fix.
- Refreshing "when the token is about to expire" was not built: it needs the expiry, which the page cannot read, and the API does not return it. It would need `expiresAt` in the login and refresh answers; kept as an improvement.
- A 401 that survives the refresh ends the session: the query cache of the session is set to `null` and the route guard sends the user back to the sign-in page.

## Prompt 3 — The files list and its polling

~~~~text
Let's work on the main Files view (/files).

Fetch the user's uploaded files using TanStack Query. Each file has a status (UPLOADING, UPLOAD_FAILED, PENDING, SCANNING, CLEAN, INFECTED, SCAN_FAILED).

Because file scanning happens asynchronously in backend workers, we need to poll for updates. Set up a 3-second polling interval, but make it smart: it should automatically stop polling once all files in the list reach a terminal status (UPLOAD_FAILED, CLEAN, INFECTED, or SCAN_FAILED). Show status badges for each state.
~~~~

Decisions taken (author's questions, answers and corrections):
- The list is a query on `GET /api/v1/files` (key `['files']`). Its `refetchInterval` is a function of the data: 3 seconds while at least one file is not final, `false` otherwise, so the polling stops by itself and the page is not busy for nothing. Adding a file later (next step) will restart it by refreshing the query.
- One badge per status, with a label that a user understands ("Waiting for scan", "Safe", "Infected"…), and a color only for the outcomes: green for safe, red for infected and failures.
- The download is a plain link to `GET /api/v1/files/{id}/content`, shown only for `CLEAN` files: the cookies travel with it and the API serves an attachment, so the browser streams it to disk without the page holding the file in memory. The API refuses the other files anyway (409).
- The list is polled, not pushed: no WebSocket, since the API has no push channel and the scans run in workers that may live on other instances.
