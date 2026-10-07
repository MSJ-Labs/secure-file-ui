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

## Prompt 2 — Styling rules

~~~~text
Before we build any page, let's set the styling rules, without pulling in heavy libraries like Tailwind or styled-components:
1. Use CSS Modules (*.module.css), scoped per component.
2. Keep global CSS variables in src/index.css for the color tokens (support light/dark mode).
3. Use lightweight inline SVGs for the icons, instead of installing an external icon package.
~~~~

Decisions taken (author's questions, answers and corrections):
- CSS Modules: one `*.module.css` next to each component, scoped by Vite, no dependency. What several features share (card, error message, links) is in `shared/ui.module.css`. Tailwind and styled-components were considered and not chosen for a project this small.
- `src/index.css` only holds the color tokens (light theme, dark theme through `prefers-color-scheme`) and the base look of plain elements.
- Icons are drawn as inline SVG components in `shared/icons.tsx`, no icon library.

## Prompt 3 — Authentication

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

## Prompt 4 — The files list and its polling

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

## Prompt 5 — Upload with progress

~~~~text
Let's add file uploads.

The API requires a PUT /api/v1/files?name=... request where the raw file payload is passed in the body. Since fetch doesn't support upload progress callbacks easily, let's use XMLHttpRequest so we can give the user a progress bar and a Cancel button.

Keep it to one upload at a time. If the backend returns a 411 Length Required or 413 Payload Too Large, render the raw backend error message directly on screen. If the access token has expired meanwhile, refresh it once like for the other calls.
~~~~

Decisions taken (author's questions, answers and corrections):
- The `File` itself is the body of the `PUT` request: the browser streams it from disk (the page never reads it in memory) and sets `Content-Length`, which the API needs to know the size up front. The name goes in the query string, URL-encoded.
- `XMLHttpRequest` for the progress bar (`fetch` cannot report an upload). The bar reaches 100% when the browser has sent the bytes, before the API has finished storing the file, so the label then changes to "Storing the file…".
- Cancel aborts the request (an `AbortController`). A cancelled upload is not an error to display. The file the API had already started to receive is left in a failed state on its side and shows in the list.
- One upload at a time: the "Add file" button is disabled while one runs.
- The message of the API (411, 413, ...) is displayed as it is: it is the one that knows the limit, the page does not duplicate it.
- An expired access token is refreshed once (the same shared refresh as the other calls) and the upload is sent again, since the XMLHttpRequest does not go through the HTTP client.
- When the upload succeeds, the list query is invalidated: the new file is already `PENDING` on the server, so it shows up and the status polling starts again.

## Prompt 6 — Layout and navigation

~~~~text
Let's build the overall layout and navigation:

1. Create an AppLayout with a shared header containing two tabs: Files (/files) and Profile (/profile). The Profile tab shows the data of the signed-in user (/users/me).
2. Add a Sign Out button in the header that invalidates/clears the TanStack Query cache and redirects back to the sign-in screen.
~~~~

Decisions taken (author's questions, answers and corrections):
- The two tabs are real routes (`/files`, `/profile`), rendered inside the layout through the router's outlet, so a page can be opened, reloaded or bookmarked directly. `/` goes to `/files`. The active tab is highlighted by the router (`NavLink`).
- The route guard wraps the layout: nothing of it is shown to someone who is not signed in.
- Profile only displays what `/users/me` returns (username, name, email, roles, creation and last sign-in dates), taken from the session query: no extra request.
- Sign out calls the API, then, whatever the answer, clears the whole query cache, sets the session to `null` and goes back to the sign-in page. The cookies may already be gone, and nothing of the session may stay in memory for the next person using the browser.
- The header also shows the username and the brand, and the pages no longer need their own way out.
