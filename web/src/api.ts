// Chamadas à API. O caminho é relativo (/api): quem encaminha para a API
// é o nginx no Docker, o Vite em desenvolvimento e o CloudFront na AWS.

export type Barraca = { nome: string; slug: string };

export async function apiPronta(): Promise<boolean> {
  try {
    const r = await fetch('/api/health/ready');
    return r.ok;
  } catch {
    return false;
  }
}

export async function buscarBarraca(slug: string): Promise<Barraca | null> {
  const r = await fetch(`/api/barracas/${encodeURIComponent(slug)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`API respondeu ${r.status}`);
  return (await r.json()) as Barraca;
}
