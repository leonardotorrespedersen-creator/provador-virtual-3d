import { useState } from 'react';

// Meia silhueta (lado direito, centro em x=150). O lado esquerdo é espelhado.
const BODY_RIGHT = [
  [159, 78], [161, 92], [180, 98], [202, 106], [212, 124], [217, 170], [222, 230],
  [227, 290], [229, 312], [221, 314], [217, 292], [209, 232], [201, 176], [197, 160],
  [193, 190], [187, 214], [194, 246], [200, 272], [196, 330], [188, 400], [182, 470],
  [184, 498], [166, 500], [164, 470], [162, 400], [157, 320], [150, 292],
];

const SHIRT_RIGHT = [
  [150, 106], [160, 90], [182, 98], [203, 107], [214, 128], [220, 170],
  [203, 174], [198, 158], [195, 192], [192, 214], [196, 242], [175, 247],
];

const mirror = ([x, y]) => [300 - x, y];

function closedLoop(right, center) {
  const tail = right.slice(1).reverse().map(mirror);
  return [...right, ...(center ? [center] : []), ...tail];
}

// Curva Catmull-Rom fechada convertida em Bézier cúbica.
function smoothPath(pts) {
  const n = pts.length;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d + 'Z';
}

const BODY_PATH = smoothPath(closedLoop(BODY_RIGHT));
const SHIRT_POINTS = closedLoop(SHIRT_RIGHT, [150, 248]).map((p) => p.join(',')).join(' ');

const SIZES = {
  P: {
    scale: 0.93,
    score: 78,
    verdict: 'Apertado',
    zones: [
      { name: 'Ombro', note: 'justo −1,0', fit: 'tight' },
      { name: 'Peito', note: 'aperta −2,5', fit: 'tight' },
      { name: 'Cintura', note: 'justo −0,5', fit: 'ideal' },
    ],
  },
  M: {
    scale: 1,
    score: 94,
    verdict: 'Recomendado',
    zones: [
      { name: 'Ombro', note: 'ideal', fit: 'ideal' },
      { name: 'Peito', note: 'ideal +1,5', fit: 'ideal' },
      { name: 'Cintura', note: 'folga +3,0', fit: 'loose' },
    ],
  },
  G: {
    scale: 1.08,
    score: 81,
    verdict: 'Largo',
    zones: [
      { name: 'Ombro', note: 'caído +2,5', fit: 'loose' },
      { name: 'Peito', note: 'folga +6,0', fit: 'loose' },
      { name: 'Cintura', note: 'folga +8,0', fit: 'loose' },
    ],
  },
};

const ZONE_ANCHORS = [
  { x: 203, y: 107 },
  { x: 196, y: 150 },
  { x: 192, y: 214 },
];

const GUIDES = [
  { y: 150, label: 'BUSTO 92' },
  { y: 214, label: 'CINTURA 76' },
  { y: 272, label: 'QUADRIL 98' },
];

const OFFSET_X = 20;

export default function FitCard() {
  const [size, setSize] = useState('M');
  const data = SIZES[size];

  return (
    <figure className="fitcard">
      <header className="fitcard-head">
        <span>Ficha de prova</span>
        <span>Nº 0142</span>
      </header>

      <div className="fitcard-body">
        <svg viewBox="0 0 340 520" role="img" aria-label={`Prova da camisa no tamanho ${size}`}>
          <defs>
            <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" className="hatch-line" />
            </pattern>
          </defs>

          {/* Régua de altura */}
          <g className="ruler">
            <line x1="8" y1="20" x2="8" y2="500" />
            {Array.from({ length: 49 }, (_, i) => (
              <line key={i} x1="8" x2={i % 5 === 0 ? 16 : 12} y1={20 + i * 10} y2={20 + i * 10} />
            ))}
            <text x="20" y="24">172</text>
          </g>

          {/* Linhas de medida */}
          {GUIDES.map((g, i) => (
            <g key={g.label} className="guide" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              <line x1="20" x2="250" y1={g.y} y2={g.y} />
              <text x="22" y={g.y - 5}>{g.label}</text>
            </g>
          ))}

          <g transform={`translate(${OFFSET_X},0)`}>
            <path d={BODY_PATH} className="body" />
            <ellipse cx="150" cy="48" rx="21" ry="27" className="body head" />

            <g
              className="shirt"
              style={{ transform: `scaleX(${data.scale})`, transformOrigin: '150px 0' }}
            >
              <polygon points={SHIRT_POINTS} className="shirt-fill" />
              <polygon points={SHIRT_POINTS} className="shirt-line" />
              <line x1="150" y1="106" x2="150" y2="248" className="shirt-seam" />
            </g>
          </g>

          {/* Marcadores de caimento */}
          {data.zones.map((z, i) => {
            const a = ZONE_ANCHORS[i];
            const x = OFFSET_X + 150 + (a.x - 150) * data.scale;
            const labelY = 92 + i * 62;
            return (
              <g key={z.name} className={`marker ${z.fit}`}>
                <polyline points={`${x},${a.y} 262,${labelY + 4} 270,${labelY + 4}`} />
                <circle cx={x} cy={a.y} r="3.2" />
                <text x="272" y={labelY}>{z.name.toUpperCase()}</text>
                <text x="272" y={labelY + 12} className="marker-note">{z.note}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <footer className="fitcard-foot">
        <div className="fitcard-item">
          <span className="label">Peça</span>
          <span>Camisa Oxford, slim</span>
        </div>
        <div className="fitcard-item">
          <span className="label">Tamanho</span>
          <div className="sizes" role="radiogroup" aria-label="Tamanho">
            {Object.keys(SIZES).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={s === size}
                className={s === size ? 'active' : ''}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="fitcard-item score">
          <span className="label">Caimento</span>
          <span>
            <strong>{data.score}%</strong> <em className={size === 'M' ? 'ok' : 'warn'}>{data.verdict}</em>
          </span>
        </div>
      </footer>
    </figure>
  );
}
