import axios, { isAxiosError } from 'axios'

export const API_BASE = '/api/v1'

// Same origin (the dev server proxies /api), so the browser sends the cookies by itself.
export const api = axios.create({ baseURL: API_BASE })

// The API answers errors as RFC 9457 problem details: its `detail` is the message meant for the person. Without a
// response (network down) or without a `detail`, the caller's own wording is all there is.
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ detail?: string }>(error)) return error.response?.data?.detail ?? fallback
  return fallback
}

export function isUnauthorized(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401
}

// A cancelled request is something the person asked for, not a failure to report.
export const isCancelled = axios.isCancel
