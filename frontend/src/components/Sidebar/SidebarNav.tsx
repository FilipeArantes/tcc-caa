import type { HTMLAttributes, ReactNode } from 'react'

export interface ISidebarNavProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode
}

export function SidebarNav({ children, ...props }: ISidebarNavProps) {
  return (
    <ul {...props} className="m-0 flex list-none flex-col gap-4 p-0">
      {children}
    </ul>
  )
}
