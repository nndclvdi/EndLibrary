import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-mocha/10 bg-espresso text-cream">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-2xl font-black tracking-tight">EndLib</p>

            <p className="mt-3 max-w-md text-sm font-semibold leading-7 text-latte/80">
              Sistem pengelolaan admin perpustakaan untuk mengatur data buku,
              peminjaman, dan anggota dengan tampilan modern yang rapi.
            </p>

            <p className="mt-5 inline-block rounded-full bg-latte/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-latte/80">
              Library But Make It Cozy
            </p>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-caramel">
              Navigasi
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-latte/80">
              <Link to="/dashboard" className="transition hover:text-cream">
                Dashboard
              </Link>

              <Link to="/buku" className="transition hover:text-cream">
                Buku
              </Link>

              <Link to="/peminjam" className="transition hover:text-cream">
                Peminjam
              </Link>

              <Link to="/anggota" className="transition hover:text-cream">
                Daftar Anggota
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-latte/10 pt-6 text-sm font-semibold text-latte/70 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} EndLib. All rights reserved.</p>

          <p>
            by{' '}
            <span className="font-black text-cream">nndclvdi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}