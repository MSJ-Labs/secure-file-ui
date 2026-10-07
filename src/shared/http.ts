// The error carries the status and the `detail` of the RFC 9457 problem the API answers with.
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const problem = await response.json()
    return new ApiError(response.status, problem.detail ?? response.statusText)
  } catch {
    return new ApiError(response.status, response.statusText)
  }
}

// One refresh at a time: several calls that expire together must not each rotate the cookie.
let refreshing: Promise<boolean> | null = null

export function refreshSession(): Promise<boolean> {
  refreshing ??= fetch('/api/v1/auth/refresh', { method: 'POST' })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

// The access token lives 15 minutes: on a 401 the call is retried once after a refresh. The auth routes are
// excluded, a wrong password is a 401 that a refresh cannot fix.
export async function request(path: string, init?: RequestInit): Promise<Response> {
  let response = await fetch(path, init)
  if (response.status === 401 && !path.startsWith('/api/v1/auth/') && (await refreshSession())) {
    response = await fetch(path, init)
  }
  if (!response.ok) throw await toApiError(response)
  return response
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await request(path, init)
  return (await response.json()) as T
}

export function jsonBody(method: string, body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}
