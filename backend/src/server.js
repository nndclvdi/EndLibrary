import express from 'express';
import dotenv from 'dotenv';
import bukuRoutes from './modules/buku/buku.routes.js';
import mahasiswaRoutes from './modules/mahasiswa/mahasiswa.routes.js';
import peminjamanRoutes from './modules/peminjaman/peminjaman.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', origin || allowedOrigins[0] || '*');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'EndLib API PostgreSQL/Neon is running',
    routes: {
      buku: '/api/buku',
      mahasiswa: '/api/mahasiswa',
      peminjaman: '/api/peminjaman',
    },
  });
});

app.use('/api/buku', bukuRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/peminjaman', peminjamanRoutes);

app.listen(port, () => {
  console.log(`EndLib API listening on port ${port}`);
});
