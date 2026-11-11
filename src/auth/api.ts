import { api } from '../shared/lib/axios'

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
  api.post<UserProfile>('/auth/login', { username, password }).then((response) => response.data)

export const register = (input: RegisterInput) =>
  api.post<UserProfile>('/auth/register', input).then((response) => response.data)

export const logout = () => api.post('/auth/logout')

export const fetchMe = () => api.get<UserProfile>('/users/me').then((response) => response.data)
