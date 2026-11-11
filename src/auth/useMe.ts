import { useQuery } from '@tanstack/react-query'
import { isUnauthorized } from '../shared/lib/axios'
import { fetchMe, type UserProfile } from './api'

export const ME_KEY = ['me'] as const

// The server is the only source of truth for the session: no token is readable from the page (HttpOnly cookies), so
// "who am I" is a query. A 401 means nobody is signed in, which is an answer and not an error to retry.
export function useMe() {
  return useQuery<UserProfile | null>({
    queryKey: ME_KEY,
    queryFn: async () => {
      try {
        return await fetchMe()
      } catch (error) {
        if (isUnauthorized(error)) return null
        throw error
      }
    },
    retry: false,
    staleTime: Infinity,
  })
}
