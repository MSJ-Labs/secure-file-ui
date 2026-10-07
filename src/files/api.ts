import { requestJson } from '../shared/http'

export type FileStatus =
  | 'UPLOADING'
  | 'UPLOAD_FAILED'
  | 'PENDING'
  | 'SCANNING'
  | 'CLEAN'
  | 'INFECTED'
  | 'SCAN_FAILED'

export interface StoredFile {
  id: string
  name: string
  size: number
  status: FileStatus
  createdAt: string
}

export const fetchFiles = () => requestJson<StoredFile[]>('/api/v1/files')

// A plain link is enough: the cookies travel with it and the API answers with an attachment, so the browser streams
// the file to disk without the page ever holding it in memory.
export const downloadUrl = (id: string) => `/api/v1/files/${id}/content`
