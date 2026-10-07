import { formatDate } from '../shared/format'
import ui from '../shared/ui.module.css'
import styles from './ProfilePage.module.css'
import { useMe } from './useMe'

export function ProfilePage() {
  const { data: user } = useMe()
  if (!user) return null

  return (
    <section className={ui.card}>
      <h1>Profile</h1>
      <dl className={styles.details}>
        <dt>Username</dt>
        <dd>{user.username}</dd>
        <dt>Name</dt>
        <dd>{user.fullName || '—'}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Roles</dt>
        <dd>{user.roles.join(', ')}</dd>
        <dt>Member since</dt>
        <dd>{formatDate(user.createdAt)}</dd>
        <dt>Last sign-in</dt>
        <dd>{user.lastLoginAt ? formatDate(user.lastLoginAt) : '—'}</dd>
      </dl>
    </section>
  )
}
