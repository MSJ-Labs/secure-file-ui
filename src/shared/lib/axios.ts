import axios, { isAxiosError } from 'axios'

export const API_BASE = '/api/v1'

// Where the browser is sent to sign in: the BFF starts the authorization code flow with Keycloak.
const LOGIN_URL = '/oauth2/authorization/keycloak'

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    // Spring Security's SPA mode: the token is in the XSRF-TOKEN cookie, echoed in X-XSRF-TOKEN. These are Axios's
    // defaults, written down to document the contract with the BFF.
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  })

  // No session (never opened, expired, or closed by the back-channel logout): the BFF answers 401 and the sign-in
  // starts. It has to be a full-page navigation, the login is a chain of redirects an XHR cannot follow.
  client.interceptors.response.use(undefined, (error: unknown) => {
    if (isUnauthorized(error)) window.location.assign(LOGIN_URL)
    return Promise.reject(error)
  })

  return client
}

// Same origin (the dev server proxies to the BFF), so the browser sends the session cookie by itself.
// The business API, which the BFF forwards to secure-file-service with the user's token.
export const api = createClient(API_BASE)
// The BFF's own endpoints (`/bff/user`), not forwarded to any service.
export const bff = createClient('/bff')
// Spring Security's endpoints at the root of the BFF (`POST /logout`).
export const root = createClient('')

// The API answers errors as RFC 9457 problem details: its `detail` is the message meant for the person. Without a
// response (network down) or without a `detail`, the caller's own wording is all there is.
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ detail?: string }>(error)) return error.response?.data?.detail ?? fallback
  return fallback
}

export function isUnauthorized(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401
}

// A cancelled request is something the person asked for, not a failure to report.
export const isCancelled = axios.isCancel
