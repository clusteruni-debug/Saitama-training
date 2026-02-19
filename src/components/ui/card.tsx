import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className={`bg-[var(--color-bg-card)] rounded-2xl p-4 ${
        onClick ? 'cursor-pointer active:scale-[0.98] transition-transform w-full text-left' : ''
      } ${className}`}
    >
      {children}
    </Component>
  )
}
