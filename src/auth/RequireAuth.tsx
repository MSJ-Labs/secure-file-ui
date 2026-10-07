import { Navigate, Outlet } from 'react-router-dom'
import ui from '../shared/ui.module.css'
import { useMe } from './useMe'

export function RequireAuth() {
  const { data: user, isPending } = useMe()

  if (isPending) return <p className={ui.muted}>Loading…</p>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
