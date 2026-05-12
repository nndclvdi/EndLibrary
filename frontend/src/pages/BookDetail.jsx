import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoryLabels } from '../data/fallbackBooks.js';
import { getBookById } from '../services/bookApi.js';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadBook() {
      setStatus('loading');
      try {
        const result = await getBookById(id);
        if (!ignore) {
          setBook(result.data);
          setMessage(result.source === 'fallback' ? 'Data detail ini berasal dari mode demo karena backend belum aktif.' : 'Detail buku berhasil dibaca dari API.');
          setStatus('success');
        }
      } catch (error) {
        if (!ignore) {
          setStatus('error');
          setMessage(error.message);
        }
      }
    }

    loadBook();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <section className="container-page">
        <div className="glass-card grid min-h-[28rem] place-items-center p-8 text-center">
          <div>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-mocha/15 border-t-mocha" />
            <p className="text-xl font-black">Membuka detail buku...</p>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="container-page">
        <div className="glass-card grid min-h-[28rem] place-items-center p-8 text-center">
          <div>
            <p className="text-6xl">📭</p>
            <h1 className="mt-5 text-3xl font-black">Detail buku tidak ditemukan</h1>
            <p className="mt-3 font-semibold text-cocoa">{message}</p>
            <Link to="/buku" className="button-primary mt-6">
              Kembali ke Buku
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page space-y-6">
      <Link to="/buku" className="button-secondary">
        ← Kembali ke Buku
      </Link>

      <div className="glass-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative min-h-80 bg-gradient-to-br from-espresso via-mocha to-caramel p-8 text-cream">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="pill border-white/20 bg-white/15 text-cream">Dynamic Route</p>
                <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{book.judul_buku}</h1>
                <p className="mt-4 text-xl font-bold text-latte">{book.penulis}</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-latte/80">Stok</p>
                  <p className="text-3xl font-black">{book.stok}</p>
                </div>
                <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-latte/80">Tahun</p>
                  <p className="text-3xl font-black">{book.tahun_terbit}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="rounded-3xl border border-caramel/25 bg-caramel/10 px-5 py-4 text-sm font-bold text-mocha">{message}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/70 p-5">
                <dt className="text-xs font-black uppercase tracking-[0.2em] text-caramel">ID Buku</dt>
                <dd className="mt-2 break-all font-black text-espresso">{book.buku_id}</dd>
              </div>
              <div className="rounded-3xl bg-white/70 p-5">
                <dt className="text-xs font-black uppercase tracking-[0.2em] text-caramel">Kategori</dt>
                <dd className="mt-2 font-black text-espresso">{book.nama_kategori || categoryLabels[book.kategori_id] || `Kategori ${book.kategori_id}`}</dd>
              </div>
              <div className="rounded-3xl bg-white/70 p-5">
                <dt className="text-xs font-black uppercase tracking-[0.2em] text-caramel">Penerbit</dt>
                <dd className="mt-2 font-black text-espresso">{book.penerbit}</dd>
              </div>
              <div className="rounded-3xl bg-white/70 p-5">
                <dt className="text-xs font-black uppercase tracking-[0.2em] text-caramel">Lokasi Rak</dt>
                <dd className="mt-2 font-black text-espresso">{book.lokasi_rak}</dd>
              </div>
              <div className="rounded-3xl bg-white/70 p-5">
                <dt className="text-xs font-black uppercase tracking-[0.2em] text-caramel">ISBN</dt>
                <dd className="mt-2 font-black text-espresso">{book.isbn}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-[2rem] bg-latte/70 p-6">
              <h2 className="text-2xl font-black">Catatan rak</h2>
              <p className="mt-3 font-semibold leading-7 text-cocoa">
                Halaman ini memakai parameter URL <span className="rounded-xl bg-white px-2 py-1 font-black text-espresso">/buku/{book.buku_id}</span> untuk mengambil satu data buku berdasarkan ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
