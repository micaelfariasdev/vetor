import { createRoot } from 'react-dom/client'
import './index.css'
import * as Comp from './components'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [pagina, setPagina] = useState("home")
  const pageComponents = {
    home: <Comp.Man />,
    obras: <Comp.Man />,
    'titulo-pagar': <Comp.Man />,
    'med-pagar': <Comp.Man />,
    'med-receber': <Comp.Man />,
    funcionarios: <Comp.Man />,
    empresas: <Comp.Man />,
    'desp-mes-mes': <Comp.DesMesMes />,
  }

  return (
    <>
      <Comp.Menu onNavigate={setPagina}/>
      <Comp.MenuTop />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={pageComponents[pagina] || <Comp.NotFound />} />
          <Route path="/despesasmes/:id" element={<Comp.DesMesMesDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const root = document.getElementById('root')
if (root) {
  root.classList.add('grid', 'grid-cols-[minmax(260px,1fr)_7fr]', 'grid-rows-[60px_1fr]', 'h-screen')
  createRoot(root).render(<App />)
}

