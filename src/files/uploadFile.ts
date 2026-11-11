import { api } from '../shared/lib/axios'

export interface UploadedFile {
  id: string
  name: string
  size: number
  status: string
}

// The File is the request body itself: the browser streams it from disk and sets Content-Length, which the API needs
// to know the size up front. Axios runs it through XMLHttpRequest, the only way to get the upload progress.
export async function uploadFile(
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
): Promise<UploadedFile> {
  const response = await api.put<UploadedFile>('/files', file, {
    params: { name: file.name },
    signal,
    onUploadProgress: ({ progress }) => {
      if (progress !== undefined) onProgress(Math.round(progress * 100))
    },
  })
  return response.data
}
