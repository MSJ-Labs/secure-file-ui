import { ApiError, refreshSession } from '../shared/http'

export interface UploadedFile {
  id: string
  name: string
  size: number
  status: string
}

// fetch cannot report the progress of an upload, XMLHttpRequest can. The File is the request body itself: the browser
// streams it from disk and sets Content-Length, which the API needs to know the size up front.
function sendOnce(file: File, onProgress: (percent: number) => void, signal: AbortSignal): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', `/api/v1/files?name=${encodeURIComponent(file.name)}`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as UploadedFile)
        return
      }
      let detail = xhr.statusText
      try {
        detail = JSON.parse(xhr.responseText).detail ?? detail
      } catch {
        // The body is not a problem document: the status text is all there is.
      }
      reject(new ApiError(xhr.status, detail))
    }
    xhr.onerror = () => reject(new ApiError(0, 'The upload could not reach the server.'))
    xhr.onabort = () => reject(new DOMException('Upload cancelled', 'AbortError'))

    signal.addEventListener('abort', () => xhr.abort(), { once: true })
    xhr.send(file)
  })
}

// An expired access token is refreshed once, like for any other call.
export async function uploadFile(
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
): Promise<UploadedFile> {
  try {
    return await sendOnce(file, onProgress, signal)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && (await refreshSession())) {
      return sendOnce(file, onProgress, signal)
    }
    throw error
  }
}
