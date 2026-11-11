import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Files, LogOut, User } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from './auth/api'
import { ME_KEY, useMe } from './auth/useMe'
import { Brand } from './shared/components/Brand'
import { Button } from './shared/components/Button'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${
    isActive ? 'border-line bg-surface text-accent' : 'border-transparent text-muted hover:text-white'
  }`

// What every signed-in page shares: the brand, the tabs and the way out.
export function AppLayout() {
  const { data: user } = useMe()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const signOut = useMutation({
    mutationFn: logout,
    // Whatever the answer: the cookies may be gone already, and nothing of this session may stay in the cache for the
    // next person who signs in on this browser.
    onSettled: () => {
      queryClient.clear()
      queryClient.setQueryData(ME_KEY, null)
      navigate('/login', { replace: true })
    },
  })

  return (
    <>
      <header className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 sm:mt-6 sm:px-6">
        <Brand />

        <nav className="flex gap-1" aria-label="Main">
          <NavLink to="/files" className={tabClass}>
            <Files size={18} /> Files
          </NavLink>
          <NavLink to="/profile" className={tabClass}>
            <User size={18} /> Profile
          </NavLink>
        </nav>

        <span className="inline-flex items-center gap-3">
          <span className="text-muted">{user?.username}</span>
          <Button type="button" variant="secondary" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
            <LogOut size={18} /> Sign out
          </Button>
        </span>
      </header>

      <Outlet />
    </>
  )
}
