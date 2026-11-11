import { Outlet } from 'react-router-dom'
import { Button } from '../shared/components/Button'
import { isUnauthorized } from '../shared/lib/axios'
import { useMe } from './useMe'

export function RequireAuth() {
  const { isPending, isError, error, refetch } = useMe()

  if (isPending) return <p className="text-muted">Loading…</p>

  if (isError) {
    // The Axios client is already sending the browser to Keycloak.
    if (isUnauthorized(error)) return <p className="text-muted">Redirecting to sign in…</p>
    // Anything else (BFF down, network): bouncing to the sign-in would not help.
    return (
      <>
        <p className="text-muted">Unable to reach the server.</p>
        <Button type="button" variant="secondary" onClick={() => refetch()}>Retry</Button>
      </>
    )
  }

  return <Outlet />
}
