import { jsonBody, request, requestJson } from '../shared/http'

export interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  roles: string[]
  createdAt: string
  lastLoginAt: string | null
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export const login = (username: string, password: string) =>
  requestJson<UserProfile>('/api/v1/auth/login', jsonBody('POST', { username, password }))

export const register = (input: RegisterInput) =>
  requestJson<UserProfile>('/api/v1/auth/register', jsonBody('POST', input))

export const logout = () => request('/api/v1/auth/logout', { method: 'POST' })

export const fetchMe = () => requestJson<UserProfile>('/api/v1/users/me')
