import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from './auth/api'
import { ME_KEY, useMe } from './auth/useMe'
import ui from './shared/ui.module.css'
import styles from './AppLayout.module.css'
import { FilesIcon, LogoutIcon, ShieldIcon, UserIcon } from './shared/icons'

const tabClass = ({ isActive }: { isActive: boolean }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)

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
      <header className={styles.header}>
        <span className={ui.brand}><ShieldIcon /> Secure files</span>

        <nav className={styles.tabs} aria-label="Main">
          <NavLink to="/files" className={tabClass}>
            <FilesIcon /> Files
          </NavLink>
          <NavLink to="/profile" className={tabClass}>
            <UserIcon /> Profile
          </NavLink>
        </nav>

        <span className={styles.session}>
          <span className={ui.muted}>{user?.username}</span>
          <button type="button" className={ui.secondary} onClick={() => signOut.mutate()} disabled={signOut.isPending}>
            <LogoutIcon /> Sign out
          </button>
        </span>
      </header>

      <Outlet />
    </>
  )
}
