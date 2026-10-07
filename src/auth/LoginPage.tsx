import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login, register } from './api'
import { ApiError } from '../shared/http'
import ui from '../shared/ui.module.css'
import styles from './LoginPage.module.css'
import { LoginIcon, ShieldIcon, UserPlusIcon } from '../shared/icons'
import { ME_KEY, useMe } from './useMe'

type Mode = 'login' | 'register'

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: user } = useMe()

  const submit = useMutation({
    mutationFn: async () => {
      if (mode === 'register') {
        await register({ username, email, password, firstName, lastName })
      }
      return login(username, password)
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(ME_KEY, profile)
      navigate('/', { replace: true })
    },
  })

  if (user) return <Navigate to="/" replace />

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit.mutate()
  }

  const error = submit.error instanceof ApiError ? submit.error.message : submit.error ? 'Something went wrong.' : null

  return (
    <main className={`${ui.card} ${ui.narrow}`}>
      <h1 className={ui.brand}><ShieldIcon /> Secure files</h1>
      <p className={ui.muted}>Files are scanned for viruses before you can download them.</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        {mode === 'register' && (
          <>
            <label className={styles.field}>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className={styles.field}>
              First name
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label className={styles.field}>
              Last name
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
          </>
        )}
        <label className={styles.field}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : undefined}
            required
          />
        </label>

        {error && <p role="alert" className={ui.error}>{error}</p>}

        <button type="submit" disabled={submit.isPending}>
          {mode === 'login' ? <LoginIcon /> : <UserPlusIcon />}
          {submit.isPending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className={ui.muted}>
        {mode === 'login' ? 'No account yet? ' : 'Already registered? '}
        <button type="button" className={ui.link} onClick={() => { submit.reset(); setMode(mode === 'login' ? 'register' : 'login') }}>
          {mode === 'login' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </main>
  )
}
