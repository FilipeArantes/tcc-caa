import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export interface IGradeRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function GradeRoot({ children, ...props }: IGradeRootProps) {
  return (
    <div {...props} className={RAIZ}>
      {children}
    </div>
  )
}
