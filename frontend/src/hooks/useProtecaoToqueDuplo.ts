import { useCallback, useEffect, useMemo, useRef } from 'react'

const INTERVALO_PADRAO_MS = 400

export function useProtecaoToqueDuplo(intervaloMs = INTERVALO_PADRAO_MS) {
  const ultimaMudanca = useRef(Number.NEGATIVE_INFINITY)
  const ultimoToque = useRef<number | null>(null)

  useEffect(() => {
    function registrar() {
      ultimoToque.current = performance.now()
    }

    document.addEventListener('pointerdown', registrar, true)

    return () => document.removeEventListener('pointerdown', registrar, true)
  }, [])

  const marcarMudanca = useCallback(() => {
    ultimaMudanca.current = performance.now()
  }, [])

  const toqueLiberado = useCallback(() => {
    const inicio = ultimoToque.current ?? performance.now()
    const desdeMudanca = inicio - ultimaMudanca.current

    return desdeMudanca < 0 || desdeMudanca >= intervaloMs
  }, [intervaloMs])

  return useMemo(() => ({ marcarMudanca, toqueLiberado }), [marcarMudanca, toqueLiberado])
}
