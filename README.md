# EndLib — Library But Make It Cozy

EndLib adalah aplikasi perpustakaan kampus dengan frontend Vite + React + Tailwind + Axios dan backend Node.js yang tersambung ke PostgreSQL/Neon.

## Route Frontend

- `/dashboard` — ringkasan data perpustakaan
- `/buku` — data buku + CRUD + state management
- `/buku/:id` — detail buku berdasarkan ID atau dynamic routing
- `/peminjam` — daftar peminjaman dari database
- `/anggota` — daftar anggota/mahasiswa dari database

## Struktur Database

Backend memakai schema PostgreSQL/Neon

- `mahasiswa`
- `detail_mahasiswa`
- `kategori_buku`
- `buku`
- `peminjaman`

## Setup Database Neon

1. Buka Neon dashboard.
2. Buka SQL Editor.
3. Copy seluruh isi `backend/db.sql`.
4. Jalankan SQL tersebut.
5. Ambil connection string Neon untuk `DATABASE_URL`.


## Setup Backend

```bash
cd backend
npm install
```
Jalankan backend:

```bash
npm run dev
```

## Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## Nama : Donanda Maulidyawati Suwondo
## NPM : 23081010036
* Universitas Pembangunan Nasional "Veteran" Jawa Timur
* Web Development & UI/UX Design