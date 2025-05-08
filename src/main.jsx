import { createRoot } from 'react-dom/client'
import './index.css'
import * as Comp from './components'

const root = document.getElementById('root')
if (root) {
  root.classList.add('grid', 'grid-cols-[minmax(260px,1fr)_7fr]', 'grid-rows-[60px_1fr]', 'h-screen')
  createRoot(root).render(
    <>
      <Comp.Menu />
      <Comp.MenuTop />
      <div id="cont" className='bg-red-900'>
      </div>
    </>
  )
  
}

const cont = document.getElementById('cont')
  if (cont){
    createRoot(cont).render(
      <Comp.Home />
    )
  }