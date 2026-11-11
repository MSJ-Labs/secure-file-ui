import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../shared/components/Button'
import { apiErrorMessage, isCancelled } from '../shared/lib/axios'
import { uploadFile } from './uploadFile'
import { FILES_KEY } from './useFiles'

export function UploadForm() {
  const [percent, setPercent] = useState(0)
  const abort = useRef<AbortController | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const upload = useMutation({
    mutationFn: (file: File) => {
      abort.current = new AbortController()
      setPercent(0)
      return uploadFile(file, setPercent, abort.current.signal)
    },
    // The new file is already PENDING on the server: reloading the list shows it and starts the status polling.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FILES_KEY }),
    onSettled: () => {
      if (input.current) input.current.value = ''
    },
  })

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) upload.mutate(file)
  }

  // A cancelled upload is not an error to show: the person asked for it.
  const cancelled = isCancelled(upload.error)
  const finishing = upload.isPending && percent === 100

  return (
    <section className="my-4">
      {/* The native picker cannot be styled: it stays hidden and the button opens it. */}
      <input ref={input} type="file" onChange={onChange} hidden />
      <Button type="button" onClick={() => input.current?.click()} disabled={upload.isPending}>
        <Upload size={18} /> Add file
      </Button>

      {upload.isPending && (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <progress className="min-w-40 flex-1 accent-accent" value={percent} max={100} />
          <span className="text-muted">{finishing ? 'Storing the file…' : `${percent}%`}</span>
          <Button type="button" variant="link" onClick={() => abort.current?.abort()}>Cancel</Button>
        </div>
      )}

      {upload.isError && !cancelled && <p role="alert" className="text-danger">{apiErrorMessage(upload.error, 'The upload failed.')}</p>}
    </section>
  )
}
