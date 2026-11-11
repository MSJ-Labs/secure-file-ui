import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link'
}

// Whole class sets per variant, never overlapping utilities: with Tailwind the order of the classes in the string does
// not decide which one wins.
const VARIANTS = {
  primary: 'bg-accent px-3.5 py-2 font-semibold text-black',
  secondary: 'border border-line px-3.5 py-2 font-semibold text-muted hover:text-white',
  link: 'text-accent underline',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm transition-opacity disabled:cursor-default disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    />
  )
}
