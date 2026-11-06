import { Sessao } from './components/Sessao'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
  return (
    <Sessao.Provider>
      <AppRoutes />
    </Sessao.Provider>
  )
}
