import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

// The label wraps the input: no id to keep in sync, and a click on the text focuses the field.
export function Input({ label, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-muted">
      {label}
      <input
        {...props}
        className="rounded-lg border border-line bg-raised px-3 py-2.5 text-white outline-none transition-colors focus:border-accent"
      />
    </label>
  )
}
