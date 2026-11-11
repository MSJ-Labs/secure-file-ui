import { Download } from 'lucide-react'
import { downloadUrl, type StoredFile } from './api'
import { formatDate, formatSize } from '../shared/format'
import { StatusBadge } from './StatusBadge'

const HEAD = 'border-b border-line px-2.5 py-2 text-left font-medium text-muted'
const CELL = 'border-b border-line px-2.5 py-2'

export function FileTable({ files }: { files: StoredFile[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={HEAD}>Name</th>
            <th className={HEAD}>Size</th>
            <th className={HEAD}>Status</th>
            <th className={HEAD}>Added</th>
            <th className={HEAD} />
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className={`${CELL} max-w-60 truncate`}>{file.name}</td>
              <td className={CELL}>{formatSize(file.size)}</td>
              <td className={CELL}><StatusBadge status={file.status} /></td>
              <td className={CELL}>{formatDate(file.createdAt)}</td>
              <td className={CELL}>
                {/* Only a scanned file can be downloaded: the API refuses the others anyway. */}
                {file.status === 'CLEAN' && (
                  <a className="inline-flex items-center gap-1 text-accent hover:underline" href={downloadUrl(file.id)}>
                    <Download size={18} /> Download
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
