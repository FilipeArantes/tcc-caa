import type { HTMLAttributes, ReactNode } from 'react'

const RODAPE = 'mt-auto flex flex-col gap-2 border-t border-borda pt-3'

export interface ISidebarRodapeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function SidebarRodape({ children, ...props }: ISidebarRodapeProps) {
  return (
    <div {...props} className={RODAPE}>
      {children}
    </div>
  )
}
