import type { FormEvent, FormHTMLAttributes, ReactNode } from 'react'
import { useNovoQuizContext } from './useNovoQuizContext'

const FORMULARIO = 'mx-auto flex w-full max-w-4xl flex-col gap-6'

export interface INovoQuizRootProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

export function NovoQuizRoot({ children, ...props }: INovoQuizRootProps) {
  const { actions } = useNovoQuizContext()

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    actions.salvar()
  }

  return (
    <form {...props} noValidate className={FORMULARIO} onSubmit={aoEnviar}>
      {children}
    </form>
  )
}
