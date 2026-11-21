import { useState } from 'react';

const features = [
  {
    icon: '🧍',
    title: 'Avatar com suas medidas',
    text: 'Informe altura, peso e medidas básicas e gere um avatar 3D fiel ao seu corpo.',
  },
  {
    icon: '👕',
    title: 'Caimento realista',
    text: 'Simulação de tecido que mostra onde a peça fica justa, folgada ou no ponto certo.',
  },
  {
    icon: '🔄',
    title: 'Visão 360°',
    text: 'Gire, aproxime e veja a roupa de todos os ângulos antes de decidir.',
  },
  {
    icon: '📏',
    title: 'Tamanho recomendado',
    text: 'Sugestão automática do tamanho ideal para cada marca e modelagem.',
  },
];

const steps = [
  { n: '1', title: 'Crie seu avatar', text: 'Preencha suas medidas em menos de um minuto.' },
  { n: '2', title: 'Escolha a peça', text: 'Navegue pelo catálogo das lojas parceiras.' },
  { n: '3', title: 'Experimente em 3D', text: 'Veja o caimento e compre com confiança.' },
];

function Mannequin() {
  return (
    <div className="stage" aria-hidden="true">
      <div className="ring" />
      <div className="mannequin">
        <div className="head" />
        <div className="torso">
          <div className="shirt" />
        </div>
        <div className="arms" />
        <div className="legs">
          <span />
          <span />
        </div>
      </div>
      <div className="floor" />
    </div>
  );
}

function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: 'loading', message: '' });
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
      setStatus({ type: 'success', message: data.message });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  }

  return (
    <form className="waitlist" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="E-mail"
      />
      <button type="submit" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? 'Enviando...' : 'Quero acesso antecipado'}
      </button>
      {status.message && <p className={`form-msg ${status.type}`}>{status.message}</p>}
    </form>
  );
}

export default function App() {
  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#" className="logo">
            <span className="logo-mark">3D</span> Provador Virtual
          </a>
          <nav>
            <a href="#recursos">Recursos</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#contato" className="btn-small">Entrar na lista</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-text">
              <span className="badge">Em breve</span>
              <h1>
                Experimente roupas em <span className="grad">3D</span> antes de comprar
              </h1>
              <p>
                Um provador virtual que usa um avatar com as suas medidas para mostrar como cada
                peça veste de verdade. Menos trocas, mais acerto.
              </p>
              <div className="hero-cta">
                <a href="#contato" className="btn">Entrar na lista de espera</a>
                <a href="#como-funciona" className="btn ghost">Ver como funciona</a>
              </div>
            </div>
            <Mannequin />
          </div>
        </section>

        <section id="recursos" className="section">
          <div className="container">
            <h2>Recursos</h2>
            <div className="grid">
              {features.map((f) => (
                <article key={f.title} className="card">
                  <div className="card-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="section alt">
          <div className="container">
            <h2>Como funciona</h2>
            <div className="steps">
              {steps.map((s) => (
                <div key={s.n} className="step">
                  <div className="step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="section cta">
          <div className="container narrow">
            <h2>Seja um dos primeiros a usar</h2>
            <p>Cadastre seu e-mail e avisamos quando o provador estiver disponível.</p>
            <Waitlist />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} Provador Virtual 3D</div>
      </footer>
    </>
  );
}
