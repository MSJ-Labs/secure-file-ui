import { Card } from '../shared/components/Card'
import { FileTable } from './FileTable'
import { UploadForm } from './UploadForm'
import { useFiles } from './useFiles'

export function FilesPage() {
  const { data: files, isPending, error } = useFiles()

  return (
    <Card>
      <h1 className="mb-2 text-xl font-semibold">My files</h1>

      <UploadForm />

      {isPending && <p className="text-muted">Loading…</p>}
      {error && <p role="alert" className="text-danger">Could not load your files.</p>}
      {files && files.length === 0 && <p className="text-muted">No file yet.</p>}
      {files && files.length > 0 && <FileTable files={files} />}
    </Card>
  )
}
