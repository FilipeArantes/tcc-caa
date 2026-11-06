import type { HTMLAttributes, ReactNode } from 'react'

const PERGUNTA =
  'flex flex-col items-center gap-5 rounded-3xl border border-borda bg-surface p-6 text-center shadow-sm'

export interface IQuizQuestionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function QuizQuestion({ children, ...props }: IQuizQuestionProps) {
  return (
    <div {...props} className={PERGUNTA}>
      {children}
    </div>
  )
}
