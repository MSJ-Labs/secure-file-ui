import { useQuery } from '@tanstack/react-query'
import { fetchMe } from './api'

export const ME_KEY = ['me'] as const

// The BFF is the only source of truth for the session: the page holds no token, so "who am I" is a query. A 401 is
// handled by the Axios client (it starts the sign-in), hence no retry and no refetch that would loop on it.
export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: fetchMe,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}
