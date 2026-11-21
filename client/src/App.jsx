import { useState } from 'react';
import FitCard from './FitCard.jsx';

const steps = [
  {
    n: '01',
    title: 'Suas medidas',
    text: 'Altura, peso e seis medidas básicas. Leva menos de um minuto e gera um avatar com as proporções do seu corpo.',
  },
  {
    n: '02',
    title: 'A peça',
    text: 'Cada roupa é modelada a partir da ficha técnica da marca: tecido, elasticidade e grade de tamanhos.',
  },
  {
    n: '03',
    title: 'A prova',
    text: 'Você vê onde a peça fica justa, onde sobra e qual tamanho veste melhor. Em 360°, antes de pagar.',
  },
];

const legend = [
  { fit: 'tight', name: 'Justo', text: 'O tecido tensiona. Pode marcar ou limitar movimento.' },
  { fit: 'ideal', name: 'Ideal', text: 'Dentro da folga prevista pela modelagem.' },
  { fit: 'loose', name: 'Folgado', text: 'Sobra tecido além do que o corte pede.' },
];

const forStores = [
  { title: 'Menos trocas por tamanho', text: 'O cliente escolhe o tamanho vendo o caimento, e não adivinhando pela tabela.' },
  { title: 'Integração ao catálogo', text: 'Um script na página de produto. Sem mudar o checkout nem a plataforma.' },
  { title: 'Dados de modelagem', text: 'Saiba quais peças vestem pequeno ou grande e ajuste a grade com base em uso real.' },
];

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
      <label htmlFor="email" className="label">Seu e-mail</label>
      <div className="waitlist-row">
        <input
          id="email"
          type="email"
          required
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Enviando' : 'Entrar na lista'}
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className={`form-msg ${status.type}`} role="status">{status.message}</p>
    </form>
  );
}

export default function App() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#" className="wordmark">Provador<sup>3D</sup></a>
          <nav>
            <a href="#metodo">Método</a>
            <a href="#caimento">Caimento</a>
            <a href="#lojas">Para lojas</a>
            <a href="#lista" className="nav-cta">Lista de espera</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero wrap">
          <div className="hero-meta">
            <span>Beta fechado</span>
            <span>Inscrições abertas</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>
                O caimento certo, <em>antes</em> da compra.
              </h1>
              <p className="lead">
                O Provador monta um avatar com as suas medidas e veste nele a peça que você quer
                comprar. Você vê o caimento real, ponto a ponto, e escolhe o tamanho sem palpite.
              </p>
              <div className="hero-actions">
                <a href="#lista" className="btn">Quero testar <span aria-hidden="true">→</span></a>
                <a href="#metodo" className="link">Como funciona</a>
              </div>
            </div>
            <div className="hero-visual">
              <FitCard />
              <p className="caption">Troque o tamanho para ver o caimento mudar.</p>
            </div>
          </div>
        </section>

        <section className="manifesto">
          <div className="wrap">
            <span className="kicker">Por quê</span>
            <p>
              Comprar roupa pela internet ainda é um palpite. A tabela de medidas não diz como o
              tecido cai no seu ombro, nem onde a cintura aperta. <em>A gente mostra isso antes de
              você pagar.</em>
            </p>
          </div>
        </section>

        <section id="metodo" className="section wrap">
          <div className="section-head">
            <span className="kicker">Método</span>
            <h2>Três passos, como numa prova de alfaiate.</h2>
          </div>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="caimento" className="section wrap fitmap">
          <div className="section-head">
            <span className="kicker">Mapa de caimento</span>
            <h2>Cada região da peça, medida contra o seu corpo.</h2>
          </div>
          <div className="fitmap-grid">
            <p className="fitmap-text">
              Em vez de um único número de tamanho, o Provador compara a peça com o seu corpo em
              ombro, peito, cintura, quadril e comprimento. O resultado é uma leitura simples:
              onde está justo, onde está certo e onde sobra.
            </p>
            <ul className="legend">
              {legend.map((l) => (
                <li key={l.fit}>
                  <span className={`swatch ${l.fit}`} />
                  <div>
                    <h3>{l.name}</h3>
                    <p>{l.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="lojas" className="stores">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Para lojas</span>
              <h2>Um provador dentro da sua página de produto.</h2>
            </div>
            <div className="stores-grid">
              {forStores.map((f, i) => (
                <article key={f.title}>
                  <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="lista" className="section wrap signup">
          <div>
            <span className="kicker">Lista de espera</span>
            <h2>
              Seja dos primeiros a <em>provar</em>.
            </h2>
            <p className="lead">
              Estamos abrindo o beta aos poucos. Deixe seu e-mail e avisamos quando chegar a sua vez.
            </p>
          </div>
          <Waitlist />
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-mark">Provador</div>
          <div className="footer-row">
            <span>© {new Date().getFullYear()} Provador Virtual 3D</span>
            <span>Feito para quem compra roupa online</span>
          </div>
        </div>
      </footer>
    </>
  );
}
