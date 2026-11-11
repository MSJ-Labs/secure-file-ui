import type { FileStatus } from './api'
import { STATUS_LABELS } from './status'

const TONES = {
  neutral: 'border-line text-muted',
  safe: 'border-accent text-accent',
  danger: 'border-danger text-danger',
}

const TONE_OF: Partial<Record<FileStatus, keyof typeof TONES>> = {
  CLEAN: 'safe',
  INFECTED: 'danger',
  UPLOAD_FAILED: 'danger',
  SCAN_FAILED: 'danger',
}

export function StatusBadge({ status }: { status: FileStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${TONES[TONE_OF[status] ?? 'neutral']}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
