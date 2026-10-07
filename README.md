# secure-file-ui

Web interface of the [secure-file-service](https://github.com/<account>/secure-file-service) API: sign in, send files, follow
their antivirus scan and download them once they are safe.

React 19, TypeScript and Vite.

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

## Choices and limits

- **The proxy exists in the dev server only.** A production deployment needs a reverse proxy that serves the build and
  forwards `/api` to the API.
