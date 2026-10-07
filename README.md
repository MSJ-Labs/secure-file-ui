# secure-file-ui

Web interface of the [secure-file-service](https://github.com/<account>/secure-file-service) API: sign in, send files, follow
their antivirus scan and download them once they are safe.

React 19, TypeScript, Vite, TanStack Query and React Router.

## What it does

- **Sign in / create an account.** The session lives in HttpOnly cookies set by the API, so the page never sees a token.
  "Who am I" is a query on `/api/v1/users/me`. An expired access token is refreshed once, automatically, and the call is
  retried; when the refresh fails too, the session is over and the user is sent back to the sign-in page.
- **Upload.** The file is the body of a `PUT /api/v1/files?name=…` request, streamed from disk by the browser, with a
  progress bar and a cancel button. The API refuses a body of unknown length (411) or above its limit (413); the message
  is shown as is.
- **List and status.** `/files` lists the user's files with a status badge (waiting for scan, scanning, safe, infected,
  failed). The list is polled every 3 seconds, only while at least one file has not reached a final status.
- **Download.** Offered only for files that are safe (`CLEAN`). The API serves them as attachments and refuses any
  other file.

## Run it

The API has to be running first (see its README: `docker compose up --build`, on `http://localhost:8080`).

```
npm install
npm run dev
```

Then open <http://localhost:5173>. The dev server forwards `/api` to the API (`vite.config.ts`), so the browser only
talks to one origin and the `HttpOnly` `SameSite=Strict` cookies of the API are sent without any CORS setup. To point it
at another API, change the target of that proxy.

Other commands: `npm run build` (type check and production bundle in `dist/`), `npm run lint`.

## Layout

One folder per feature, like the API's bounded contexts:

```
src/
├── App.tsx, main.tsx   routes and providers
├── shared/             the HTTP client (errors as problem details, one refresh at a time), icons, formatting
├── auth/               sign in and sign up, session (`useMe`), route guard
└── files/              API calls, list, status badges, upload form
```

## Choices and limits

- **One upload at a time**, and the maximum size is only known to the API.
- **Polling instead of WebSocket.** The API has no push channel and the scans run in workers that may live on other
  instances. A status changes within seconds, so a 3 s poll that stops by itself is enough. Server-Sent Events would be
  the next step if the number of users made polling costly.
- **The session is refreshed on a 401, not ahead of time.** The page cannot read the expiry of an HttpOnly cookie and
  the API does not return it; refreshing just before it expires would need an `expiresAt` in its answers.
- **CSS Modules, no CSS framework.** `src/index.css` only holds the color tokens (light and dark themes) and the base
  look of plain elements; each component has its own `*.module.css`, scoped to it by Vite (what several features share
  is in `shared/ui.module.css`). Icons are inline SVG, no icon library.
- **No state library.** Server data is handled by TanStack Query, the session is a query, everything else is local to
  its component.
- **The proxy exists in the dev server only.** A production deployment needs a reverse proxy that serves the build and
  forwards `/api` to the API.
