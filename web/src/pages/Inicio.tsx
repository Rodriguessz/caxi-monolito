import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiPronta, buscarBarraca, type Barraca } from '../api';
import { Notice } from '../components';

type Estado<T> = { carregando: true } | { carregando: false; valor: T };

export function Inicio() {
  const [api, setApi] = useState<Estado<boolean>>({ carregando: true });
  const [barraca, setBarraca] = useState<Estado<Barraca | null>>({ carregando: true });

  useEffect(() => {
    apiPronta().then((valor) => setApi({ carregando: false, valor }));
    buscarBarraca('demo')
      .then((valor) => setBarraca({ carregando: false, valor }))
      .catch(() => setBarraca({ carregando: false, valor: null }));
  }, []);

  const tudoOk = !api.carregando && api.valor && !barraca.carregando && barraca.valor;

  return (
    <>
      <section className="hero">
        <h1>Sua barraca, organizada no celular.</h1>
        <p className="lead">Ambiente de desenvolvimento do Caxi.</p>
      </section>

      <dl className="card" aria-label="Estado do ambiente">
        <div className="status-row">
          <dt>API</dt>
          <dd>{api.carregando ? 'verificando…' : api.valor ? 'no ar' : 'indisponível'}</dd>
        </div>
        <div className="status-row">
          <dt>Barraca de demonstração</dt>
          <dd>{barraca.carregando ? 'carregando…' : (barraca.valor?.nome ?? 'não encontrada')}</dd>
        </div>
      </dl>

      {tudoOk ? <Notice tone="success">Front, API e banco estão conversando.</Notice> : null}
      {!api.carregando && !api.valor ? (
        <Notice tone="error">
          A API não respondeu. Rode <code>docker compose ps</code> e veja se ela está saudável.
        </Notice>
      ) : null}

      <p>
        <Link to="/design-system">Ver os componentes do Design System</Link>
      </p>
    </>
  );
}
