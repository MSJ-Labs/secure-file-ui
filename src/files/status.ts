import type { FileStatus } from './api'

export const STATUS_LABELS: Record<FileStatus, string> = {
  UPLOADING: 'Uploading',
  UPLOAD_FAILED: 'Upload failed',
  PENDING: 'Waiting for scan',
  SCANNING: 'Scanning',
  CLEAN: 'Safe',
  INFECTED: 'Infected',
  SCAN_FAILED: 'Scan failed',
}

// These states never change by themselves: once every file is in one, there is nothing left to wait for.
const FINAL_STATUSES: ReadonlySet<FileStatus> = new Set(['UPLOAD_FAILED', 'CLEAN', 'INFECTED', 'SCAN_FAILED'])

export const isFinal = (status: FileStatus) => FINAL_STATUSES.has(status)
