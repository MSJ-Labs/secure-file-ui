import { Navigate, Outlet } from 'react-router-dom'
import { useMe } from './useMe'

export function RequireAuth() {
  const { data: user, isPending } = useMe()

  if (isPending) return <p className="text-muted">Loading…</p>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
