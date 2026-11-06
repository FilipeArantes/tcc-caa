export const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === 'true'

const ATRASO_SIMULADO = 150

export function responderMock<T>(dados: T): Promise<T> {
  return new Promise((resolver) => {
    setTimeout(() => resolver(dados), ATRASO_SIMULADO)
  })
}
