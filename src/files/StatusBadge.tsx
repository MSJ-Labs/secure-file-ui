import type { FileStatus } from './api'
import styles from './StatusBadge.module.css'
import { STATUS_LABELS } from './status'

const VARIANTS: Partial<Record<FileStatus, string>> = {
  CLEAN: styles.safe,
  INFECTED: styles.danger,
  UPLOAD_FAILED: styles.danger,
  SCAN_FAILED: styles.danger,
}

export function StatusBadge({ status }: { status: FileStatus }) {
  return <span className={`${styles.badge} ${VARIANTS[status] ?? ''}`}>{STATUS_LABELS[status]}</span>
}
