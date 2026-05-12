import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../services/bookApi.js';
import { getBorrowings, getMembers } from '../services/libraryApi.js';

import logoBuku from '../assets/Endlib Buku.png';
import logoPeminjam from '../assets/Endlib Peminjam.png';
import logoAnggota from '../assets/Endlib Anggota.png';

const typingTexts = ['Selamat Datang!', 'Selamat Membaca!'];

const menuCards = [
  {
    image: logoBuku,
    title: 'Buku',
    description: 'Kelola koleksi, stok, penulis, penerbit, dan ISBN di EndLib.',
    to: '/buku',
  },
  {
    image: logoPeminjam,
    title: 'Peminjam',
    description: 'Pantau daftar peminjaman aktif, jatuh tempo, dan histori pengembalian.',
    to: '/peminjam',
  },
  {
    image: logoAnggota,
    title: 'Daftar Anggota',
    description: 'Lihat data anggota perpustakaan yang kalcer abis.',
    to: '/anggota',
  },
];

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowings, setBorrowings] = useState([]);

  const [textIndex, setTextIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      const [booksResult, membersResult, borrowingsResult] = await Promise.all([
        getBooks({ limit: 100 }),
        getMembers(),
        getBorrowings(),
      ]);

      if (!ignore) {
        setBooks(booksResult.data);
        setMembers(membersResult.data);
        setBorrowings(borrowingsResult.data);
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const currentText = typingTexts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting && typedText !== currentText) {
          setTypedText(currentText.slice(0, typedText.length + 1));
          return;
        }

        if (!isDeleting && typedText === currentText) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && typedText !== '') {
          setTypedText(currentText.slice(0, typedText.length - 1));
          return;
        }

        if (isDeleting && typedText === '') {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % typingTexts.length);
        }
      },
      !isDeleting && typedText === currentText ? 1300 : isDeleting ? 45 : 95
    );

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, textIndex]);

  const stats = useMemo(() => {
    const totalStock = books.reduce((total, book) => {
      return total + Number(book.stok || book.tersedia || book.jumlah_eksemplar || 0);
    }, 0);

    const readyBooks = books.filter((book) => {
      return Number(book.stok || book.tersedia || book.jumlah_eksemplar || 0) > 0;
    }).length;

    const activeBorrowings = borrowings.filter((item) => {
      return item.status !== 'Dikembalikan' && item.status_peminjaman !== 'dikembalikan';
    }).length;

    return [
      { label: 'Total Judul', value: books.length, note: 'koleksi judul' },
      { label: 'Buku Tersedia', value: readyBooks, note: 'buku tersedia' },
      { label: 'Total Stok', value: totalStock, note: 'di Endlib' },
      { label: 'Anggota Aktif', value: members.length, note: 'anggota endlib cuy' },
      { label: 'Peminjaman', value: activeBorrowings, note: 'belum kembali' },
    ];
  }, [books, borrowings, members]);

  const latestBorrowers = useMemo(() => {
    return [...borrowings]
      .sort((a, b) => {
        const idA = Number(a.id_peminjaman || a.peminjaman_id || a.id || 0);
        const idB = Number(b.id_peminjaman || b.peminjaman_id || b.id || 0);
        return idB - idA;
      })
      .slice(0, 3);
  }, [borrowings]);

  const activeBorrowingCount = borrowings.filter((item) => {
    return item.status !== 'Dikembalikan' && item.status_peminjaman !== 'dikembalikan';
  }).length;

  const lateBorrowingCount = borrowings.filter((item) => {
    return item.status === 'Terlambat' || item.status_peminjaman === 'terlambat';
  }).length;

  return (
    <section className="container-page space-y-8">
      <div className="glass-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-caramel/30 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-mocha/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">          <div>
            <p className="pill mb-5">End Library</p>

            <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight text-espresso sm:text-6xl">
              {typedText}
              <span className="ml-1 inline-block animate-pulse text-caramel">|</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-cocoa sm:text-lg">
              EndLib dibuat untuk membantu admin pengelolaan perpustakaan jadi lebih Gen-Z abissss yuhuuuu.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to="/buku" className="button-primary">
                Kelola Buku
              </Link>

              <Link to="/peminjam" className="button-secondary">
                Lihat Peminjam
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-soft backdrop-blur">
            <div className="rounded-[1.5rem] bg-espresso p-5 text-cream">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-latte/80">
                Peminjam Terbaru
              </p>

              <div className="mt-5 space-y-3">
                {latestBorrowers.length > 0 ? (
                  latestBorrowers.map((item, index) => {
                    const borrowerName =
                      item.nama_mahasiswa ||
                      item.nama_peminjam ||
                      item.nama_lengkap ||
                      'Nama peminjam';

                    const bookTitle =
                      item.judul_buku ||
                      item.buku ||
                      'Judul buku';

                    const status =
                      item.status ||
                      item.status_peminjaman ||
                      'dipinjam';

                    const borrowDate =
                      item.tanggal_pinjam ||
                      '-';

                    return (
                      <div
                        key={item.id_peminjaman || item.peminjaman_id || index}
                        className="rounded-2xl bg-cream/10 p-4 backdrop-blur transition hover:bg-cream/15"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-black text-cream">
                              {borrowerName}
                            </p>

                            <p className="mt-1 text-sm font-semibold leading-6 text-latte/80">
                              {bookTitle}
                            </p>
                          </div>

                          <span className="rounded-full bg-latte/20 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-latte">
                            {status}
                          </span>
                        </div>

                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-latte/60">
                          Pinjam: {borrowDate}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl bg-cream/10 p-4">
                    <p className="font-semibold text-latte/80">
                      Belum ada data peminjaman.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-latte/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">
                  Peminjaman
                </p>

                <p className="mt-2 text-3xl font-black text-espresso">
                  {activeBorrowingCount}
                </p>
              </div>

              <div className="rounded-3xl bg-caramel/20 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">
                  Telat
                </p>

                <p className="mt-2 text-3xl font-black text-espresso">
                  {lateBorrowingCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((item) => (
          <div key={item.label} className="glass-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-caramel">
              {item.label}
            </p>

            <p className="mt-2 text-4xl font-black text-espresso">
              {item.value}
            </p>

            <p className="mt-1 text-sm font-bold text-cocoa">
              {item.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {menuCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="glass-card group p-6 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-espresso to-caramel shadow-lg shadow-mocha/20 transition duration-300 group-hover:rotate-[-3deg] group-hover:scale-105">
              <img
                src={card.image}
                alt={`Logo ${card.title}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />
            </div>

            <h2 className="mt-5 text-2xl font-black text-espresso">
              {card.title}
            </h2>

            <p className="mt-3 font-semibold leading-7 text-cocoa">
              {card.description}
            </p>

            <p className="mt-5 text-sm font-black text-mocha transition group-hover:translate-x-1">
              Buka halaman →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}