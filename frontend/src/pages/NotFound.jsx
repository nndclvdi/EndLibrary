import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container-page">
      <div className="glass-card grid min-h-[32rem] place-items-center overflow-hidden p-8 text-center">
        <div className="max-w-2xl">
          <p className="text-8xl">🧸</p>
          <p className="pill mt-4">404 · Tidak Ditemukan</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">Oops, halaman ini nyasar ke rak lama.</h1>
          <p className="mt-5 text-lg font-semibold leading-8 text-cocoa">
            Route yang kamu buka tidak tersedia. Balik ke koleksi EndLib untuk lanjut eksplor buku.
          </p>
          <Link to="/dashboard" className="button-primary mt-8">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
