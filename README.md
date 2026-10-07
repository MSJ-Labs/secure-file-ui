# secure-file-ui

Web interface of the [secure-file-service](https://github.com/<account>/secure-file-service) API: sign in, send files, follow
their antivirus scan and download them once they are safe.

React 19, TypeScript, Vite, TanStack Query and React Router.

## What it does

- **Sign in / create an account.** The session lives in HttpOnly cookies set by the API, so the page never sees a token.
  "Who am I" is a query on `/api/v1/users/me`. An expired access token is refreshed once, automatically, and the call is
  retried; when the refresh fails too, the session is over and the user is sent back to the sign-in page.

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
├── shared/             the HTTP client (errors as problem details, one refresh at a time), icons
└── auth/               sign in and sign up, session (`useMe`), route guard
```

## Choices and limits

- **The session is refreshed on a 401, not ahead of time.** The page cannot read the expiry of an HttpOnly cookie and
  the API does not return it; refreshing just before it expires would need an `expiresAt` in its answers.
- **No state library.** Server data is handled by TanStack Query, the session is a query, everything else is local to
  its component.
- **The proxy exists in the dev server only.** A production deployment needs a reverse proxy that serves the build and
  forwards `/api` to the API.
