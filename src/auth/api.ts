import { bff, root } from '../shared/lib/axios'

export interface UserProfile {
  sub: string
  username: string
  name: string | null
  givenName: string | null
  familyName: string | null
  email: string | null
  emailVerified: boolean | null
  roles: string[]
}

interface LogoutResponse {
  logoutUrl: string
}

export const fetchMe = () => bff.get<UserProfile>('/user').then((response) => response.data)

// Ends the BFF session and answers with Keycloak's end-session URL.
export const logout = () => root.post<LogoutResponse>('/logout').then((response) => response.data)
