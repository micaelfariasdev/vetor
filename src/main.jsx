import { createRoot } from 'react-dom/client';
import './index.css';
import * as Comp from './components';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function App() {
  const [pagina, setPagina] = useState('home');

  return (
    <>
      <BrowserRouter>
        {window.location.pathname !== '/test' && (
          <>
            <Comp.Menu onNavigate={setPagina} />
            <Comp.MenuTop />
          </>
        )}
        {window.location.pathname !== '/test' && (
          <>
            <div className="h-full overflow-y-scroll">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Comp.Man />} />
                <Route path="/obras" element={<Comp.Obras />} />
                <Route path="/servicos" element={<Comp.Servicos />} />
                <Route path="/titulopagar" element={<Comp.Man />} />
                <Route path="/medpagar" element={<Comp.Man />} />
                <Route path="/medreceber" element={<Comp.Man />} />
                <Route path="/funcionarios" element={<Comp.Funcionarios />} />
                <Route path="/ponto" element={<Comp.Ponto />} />
                <Route path="/ponto/:id" element={<Comp.PontoMes />} />
                <Route path="/empresas" element={<Comp.Man />} />
                <Route path="/cronograma" element={<Comp.Cronograma />} />
                <Route path="/desp-mes-mes" element={<Comp.DesMesMes />} />
                <Route
                  path="/desp-mes-mes/:id"
                  element={<Comp.DesMesMesDetail />}
                />
                <Route
                  path="/cronograma/:id"
                  element={<Comp.CronogramaDetail />}
                />
              </Routes>
            </div>
          </>
        )}
        <div className="col-span-2 row-span-2">
          <Routes>
            <Route path="/test" element={<Comp.PontoMesMockup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

const root = document.getElementById('root');
if (root) {
  root.classList.add(
    'grid',
    'grid-cols-[minmax(260px,1fr)_7fr]',
    'grid-rows-[60px_1fr]',
    'h-screen'
  );
  createRoot(root).render(<App />);
}
