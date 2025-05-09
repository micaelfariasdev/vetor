import { createRoot } from 'react-dom/client'
import './index.css'
import * as Comp from './components'
import { useState } from 'react'


function App() {
  const [pagina, setPagina] = useState("home")

  return (
    <>
      <Comp.Menu onNavigate={setPagina} />
      <Comp.MenuTop />
      {pagina === "home" && <Comp.Man />}
      {pagina === "obras" && <Comp.Man />}
      {pagina === "titulo-pagar" && <Comp.Man />}
      {pagina === "med-pagar" && <Comp.Man />}
      {pagina === "med-receber" && <Comp.Man />}
      {pagina === "funcionarios" && <Comp.Man />}
      {pagina === "empresas" && <Comp.Man />}
      {pagina === "desp-mes-mes" && <Comp.DesMesMes />}
    </>
  )
}

const root = document.getElementById('root')
if (root) {
  root.classList.add('grid', 'grid-cols-[minmax(260px,1fr)_7fr]', 'grid-rows-[60px_1fr]', 'h-screen')
  createRoot(root).render(<App />)
}

