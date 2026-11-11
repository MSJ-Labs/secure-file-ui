import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login, register } from './api'
import { Brand } from '../shared/components/Brand'
import { Button } from '../shared/components/Button'
import { Card } from '../shared/components/Card'
import { Input } from '../shared/components/Input'
import { LoginIcon, UserPlusIcon } from '../shared/icons'
import { apiErrorMessage } from '../shared/lib/axios'
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

  const error = submit.error ? apiErrorMessage(submit.error, 'Something went wrong.') : null

  return (
    <main>
      <Card narrow>
        <h1 className="mb-2 text-xl"><Brand /></h1>
        <p className="text-muted">Files are scanned for viruses before you can download them.</p>

        <form className="my-4 flex flex-col gap-3" onSubmit={onSubmit}>
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          {mode === 'register' && (
            <>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </>
          )}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : undefined}
            required
          />

          {error && <p role="alert" className="text-danger">{error}</p>}

          <Button type="submit" disabled={submit.isPending}>
            {mode === 'login' ? <LoginIcon /> : <UserPlusIcon />}
            {submit.isPending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className="text-muted">
          {mode === 'login' ? 'No account yet? ' : 'Already registered? '}
          <Button type="button" variant="link" onClick={() => { submit.reset(); setMode(mode === 'login' ? 'register' : 'login') }}>
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </Button>
        </p>
      </Card>
    </main>
  )
}
