# secure-file-ui

Web interface of the [secure-file-service](https://github.com/MSJ-Labs/secure-file-service) API: sign in, send files, follow
their antivirus scan and download them once they are safe.

React 19, TypeScript, Vite, TanStack Query, React Router, Axios, Tailwind CSS and lucide-react.

## What it does

- **Sign in through Keycloak.** The page has no sign-in form: the BFF (backend for frontend) runs the OAuth2 login and
  keeps the tokens, the browser only holds a session cookie, so the page never sees a token. "Who am I" is a query on
  `/bff/user`. A 401 means there is no session: the browser is sent to `/oauth2/authorization/keycloak`.
- **Navigation.** Two tabs, Files and Profile, are real routes (`/files`, `/profile`) under a shared header. Profile
  shows the data of the signed-in user. Signing out calls `POST /logout` (with the `X-XSRF-TOKEN` header), clears the
  cache and goes to the Keycloak end-session URL the BFF answers with.
- **Upload.** The file is the body of a `PUT /api/v1/files?name=…` request, streamed from disk by the browser, with a
  progress bar and a cancel button. The API refuses a body of unknown length (411) or above its limit (413); the message
  is shown as is.
- **List and status.** `/files` lists the user's files with a status badge (waiting for scan, scanning, safe, infected,
  failed). The list is polled every 3 seconds, only while at least one file has not reached a final status.
- **Download.** Offered only for files that are safe (`CLEAN`). The API serves them as attachments and refuses any
  other file.

## Run it

The API and its BFF have to be running first: the API (see its README: `docker compose up --build`), Keycloak, and the
BFF on `http://localhost:8083`, with a route `/api/v1/files/**` to the API and a confidential Keycloak client for this
interface.

```
npm install
npm run dev
```

Then open <http://localhost:5173>. The dev server forwards `/api`, `/bff`, `/oauth2` and `/logout` to the BFF (`vite.config.ts`), so the browser only
talks to one origin and the session cookie is sent without any CORS setup. To point it at another BFF, change the
target of that proxy.

Other commands: `npm run build` (type check and production bundle in `dist/`), `npm run lint`.

## Layout

One folder per feature, like the API's bounded contexts:

```
src/
├── App.tsx, main.tsx   routes and providers
├── AppLayout.tsx       header, tabs and sign out shared by the signed-in pages
├── shared/             the Axios client (`lib/axios.ts`, errors as problem details), `components/`, formatting
├── auth/               profile, session (`useMe`), route guard
└── files/              API calls, list, status badges, upload form
```

## Choices and limits

- **One upload at a time**, and the maximum size is only known to the API.
- **Polling instead of WebSocket.** The API has no push channel and the scans run in workers that may live on other
  instances. A status changes within seconds, so a 3 s poll that stops by itself is enough. Server-Sent Events would be
  the next step if the number of users made polling costly.
- **No tokens in the page.** The BFF refreshes them; a 401 means the session is over and starts a new sign-in. The BFF
  is not part of this repository.
- **Tailwind CSS, dark only.** The classes are in the markup; `src/index.css` only holds the design tokens (`@theme`)
  and the base look of the page. What several features share is in `shared/components`
  (`Button`, `Card`, `Input`, `Brand`). Icons come from lucide-react.
- **No state library.** Server data is handled by TanStack Query, the session is a query, everything else is local to
  its component.
- **The proxy exists in the dev server only.** A production deployment needs a reverse proxy that serves the build and
  forwards `/api`, `/bff`, `/oauth2` and `/logout` to the BFF.
- No automated tests on the interface yet.
