import { useQuery } from '@tanstack/react-query'
import { fetchFiles } from './api'
import { isFinal } from './status'

export const FILES_KEY = ['files'] as const

const POLL_MS = 3000

// The status changes on the server, with no push: the list is polled, and only while at least one file is still
// moving through the scan. When everything is final the polling stops by itself.
export function useFiles() {
  return useQuery({
    queryKey: FILES_KEY,
    queryFn: fetchFiles,
    refetchInterval: (query) => (query.state.data?.some((file) => !isFinal(file.status)) ? POLL_MS : false),
  })
}
