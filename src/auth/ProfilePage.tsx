import { Card } from '../shared/components/Card'
import { formatDate } from '../shared/format'
import { useMe } from './useMe'

export function ProfilePage() {
  const { data: user } = useMe()
  if (!user) return null

  return (
    <Card>
      <h1 className="mb-2 text-xl font-semibold">Profile</h1>
      <dl className="mt-4 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
        <dt className="text-muted">Username</dt>
        <dd className="wrap-anywhere">{user.username}</dd>
        <dt className="text-muted">Name</dt>
        <dd className="wrap-anywhere">{user.fullName || '—'}</dd>
        <dt className="text-muted">Email</dt>
        <dd className="wrap-anywhere">{user.email}</dd>
        <dt className="text-muted">Roles</dt>
        <dd className="wrap-anywhere">{user.roles.join(', ')}</dd>
        <dt className="text-muted">Member since</dt>
        <dd className="wrap-anywhere">{formatDate(user.createdAt)}</dd>
        <dt className="text-muted">Last sign-in</dt>
        <dd className="wrap-anywhere">{user.lastLoginAt ? formatDate(user.lastLoginAt) : '—'}</dd>
      </dl>
    </Card>
  )
}
