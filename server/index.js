import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const CLIENT_DIST = process.env.CLIENT_DIST || path.join(__dirname, '../client/dist');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data/waitlist.json');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();
app.use(express.json({ limit: '10kb' }));

async function readList() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/waitlist', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }
  const list = await readList();
  if (list.some((e) => e.email === email)) {
    return res.json({ message: 'Você já está na lista. Obrigado!' });
  }
  list.push({ email, createdAt: new Date().toISOString() });
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2));
  res.status(201).json({ message: 'Cadastro feito! Avisaremos você em breve.' });
});

app.use(express.static(CLIENT_DIST));
app.get('/{*splat}', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
