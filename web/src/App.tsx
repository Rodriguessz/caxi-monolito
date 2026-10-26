import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { DesignSystem } from './pages/DesignSystem';
import { Inicio } from './pages/Inicio';

export function App() {
  return (
    <BrowserRouter>
      <main className="page">
        <header className="topbar">
          <Link to="/" className="brand" aria-label="Caxi, início">
            caxi.
          </Link>
        </header>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
