import type { HTMLAttributes, ReactNode } from 'react'

const RAIZ = 'flex flex-col gap-6'

export interface IQuizRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function QuizRoot({ children, ...props }: IQuizRootProps) {
  return (
    <section {...props} className={RAIZ}>
      {children}
    </section>
  )
}
