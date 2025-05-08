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
      {pagina === "home" && <Comp.Home />}
      {pagina === "obras" && <Comp.Obras />}
    </>
  )
}

const root = document.getElementById('root')
if (root) {
  root.classList.add('grid', 'grid-cols-[minmax(260px,1fr)_7fr]', 'grid-rows-[60px_1fr]', 'h-screen')
  createRoot(root).render(<App />)
}

