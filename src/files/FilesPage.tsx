import ui from '../shared/ui.module.css'
import { FileTable } from './FileTable'
import { UploadForm } from './UploadForm'
import { useFiles } from './useFiles'

export function FilesPage() {
  const { data: files, isPending, error } = useFiles()

  return (
    <section className={ui.card}>
      <h1>My files</h1>

      <UploadForm />

      {isPending && <p className={ui.muted}>Loading…</p>}
      {error && <p role="alert" className={ui.error}>Could not load your files.</p>}
      {files && files.length === 0 && <p className={ui.muted}>No file yet.</p>}
      {files && files.length > 0 && <FileTable files={files} />}
    </section>
  )
}
