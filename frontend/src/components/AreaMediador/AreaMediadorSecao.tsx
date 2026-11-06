import { useId, type HTMLAttributes, type ReactNode } from 'react'

const SECAO = 'flex flex-col gap-3'

const TITULO = 'm-0 text-rotulo font-bold text-discreto'

export interface IAreaMediadorSecaoProps extends HTMLAttributes<HTMLElement> {
  titulo: string
  children: ReactNode
}

export function AreaMediadorSecao({ titulo, children, ...props }: IAreaMediadorSecaoProps) {
  const idTitulo = useId()

  return (
    <section {...props} aria-labelledby={idTitulo} className={SECAO}>
      <h3 id={idTitulo} className={TITULO}>
        {titulo}
      </h3>
      {children}
    </section>
  )
}
