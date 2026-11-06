import { useInfoDispositivo } from '../../hooks/useInfoDispositivo'

const LISTA = 'm-0 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-fundo p-4 sm:gap-x-6'

const ITEM = 'flex flex-col gap-0.5'

const ROTULO = 'text-base text-discreto'

const VALOR = 'm-0 break-words text-rotulo font-bold text-texto'

export function AreaMediadorDispositivo() {
  const info = useInfoDispositivo()

  const itens = [
    { rotulo: 'Versão do sistema', valor: info.versao },
    { rotulo: 'Aparelho', valor: info.aparelho },
    { rotulo: 'Navegador', valor: info.navegador },
    { rotulo: 'Tela', valor: info.tela },
    { rotulo: 'Internet', valor: info.online ? 'Conectado' : 'Sem conexão' },
    { rotulo: 'Leitura em voz alta', valor: info.vozDisponivel ? 'Disponível' : 'Indisponível' },
    { rotulo: 'Instalado como app', valor: info.instalado ? 'Sim' : 'Não, aberto no navegador' },
  ]

  return (
    <dl className={LISTA}>
      {itens.map((item) => (
        <div key={item.rotulo} className={ITEM}>
          <dt className={ROTULO}>{item.rotulo}</dt>
          <dd className={VALOR}>{item.valor}</dd>
        </div>
      ))}
    </dl>
  )
}
