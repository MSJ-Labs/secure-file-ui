import { DownloadIcon } from '../shared/icons'
import { downloadUrl, type StoredFile } from './api'
import { formatDate, formatSize } from '../shared/format'
import { StatusBadge } from './StatusBadge'
import styles from './FileTable.module.css'

export function FileTable({ files }: { files: StoredFile[] }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Status</th>
            <th>Added</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className={styles.name}>{file.name}</td>
              <td>{formatSize(file.size)}</td>
              <td><StatusBadge status={file.status} /></td>
              <td>{formatDate(file.createdAt)}</td>
              <td>
                {/* Only a scanned file can be downloaded: the API refuses the others anyway. */}
                {file.status === 'CLEAN' && (
                  <a className={styles.action} href={downloadUrl(file.id)}><DownloadIcon /> Download</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
