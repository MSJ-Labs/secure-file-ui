import { MutationCache, QueryCache, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { logout } from './auth/api'
import { LoginPage } from './auth/LoginPage'
import { RequireAuth } from './auth/RequireAuth'
import { ME_KEY, useMe } from './auth/useMe'
import { FilesPage } from './files/FilesPage'
import { ApiError } from './shared/http'

// A 401 that survived the automatic refresh means the session is over (refresh token expired or revoked). Forgetting
// the user sends every protected page back to the sign-in page, instead of leaving it with a failed request.
function endSessionOnUnauthorized(error: Error) {
  if (error instanceof ApiError && error.status === 401) queryClient.setQueryData(ME_KEY, null)
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: endSessionOnUnauthorized }),
  mutationCache: new MutationCache({ onError: endSessionOnUnauthorized }),
})

// Placeholder until the shared header: it shows who is signed in and lets one sign out.
function SessionBar() {
  const { data: user } = useMe()
  const client = useQueryClient()
  const signOut = async () => {
    await logout()
    client.setQueryData(ME_KEY, null)
  }

  return (
    <>
      <p>Signed in as {user?.fullName}.</p>
      <button type="button" onClick={signOut}>Sign out</button>
      <Outlet />
    </>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<SessionBar />}>
              <Route path="/files" element={<FilesPage />} />
              <Route path="/" element={<Navigate to="/files" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
