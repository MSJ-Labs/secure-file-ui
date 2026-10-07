import type { SVGProps } from 'react'
import styles from './icons.module.css'

// Simple line icons that take the color of the text around them (currentColor), so they follow the light and dark
// themes. They are decorative: the text next to each one carries the meaning.
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={styles.icon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ShieldIcon = () => (
  <Icon>
    <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
)

export const LoginIcon = () => (
  <Icon>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H4" />
  </Icon>
)

export const LogoutIcon = () => (
  <Icon>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H10" />
  </Icon>
)

export const UserIcon = () => (
  <Icon>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </Icon>
)

export const FilesIcon = () => (
  <Icon>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
    <path d="M14 3v5h5" />
  </Icon>
)

export const DownloadIcon = () => (
  <Icon>
    <path d="M12 4v11" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </Icon>
)

export const UploadIcon = () => (
  <Icon>
    <path d="M12 16V4" />
    <path d="M7 9l5-5 5 5" />
    <path d="M5 20h14" />
  </Icon>
)

export const UserPlusIcon = () => (
  <Icon>
    <circle cx="10" cy="8" r="4" />
    <path d="M3 21c0-4 3-6 7-6" />
    <path d="M19 8v6M16 11h6" />
  </Icon>
)
