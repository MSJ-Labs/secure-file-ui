import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { LoginPage } from './auth/LoginPage'
import { ProfilePage } from './auth/ProfilePage'
import { RequireAuth } from './auth/RequireAuth'
import { ME_KEY } from './auth/useMe'
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

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path="/files" element={<FilesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<Navigate to="/files" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
