import { Link } from 'react-router-dom';
import { categoryLabels } from '../data/fallbackBooks.js';
import koleksiLogo from '../assets/Endlib Koleksi.png';

export default function BookCard({ book, onEdit, onDelete }) {
  const stockStatus = book.stok > 0 ? `${book.stok} tersedia` : 'habis';
  const categoryName = book.nama_kategori || categoryLabels[book.kategori_id] || `Kategori ${book.kategori_id}`;

  return (
    <article className="glass-card group flex h-full flex-col overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-espresso to-caramel shadow-lg shadow-mocha/20 transition duration-300 hover:rotate-[-3deg] hover:scale-105">
         <img
          src={koleksiLogo}
          alt="Logo Koleksi EndLib"
          className="h-full w-full object-cover transition duration-300 hover:scale-110"
        />
      </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${book.stok > 0 ? 'bg-caramel/20 text-mocha' : 'bg-red-100 text-red-700'}`}>
          {stockStatus}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <p className="pill mb-3">{categoryName}</p>
        <h3 className="line-clamp-2 text-xl font-black leading-tight text-espresso">{book.judul_buku}</h3>
        <p className="mt-2 text-sm font-bold text-cocoa">by {book.penulis}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-white/60 p-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">Tahun</p>
            <p className="font-black text-espresso">{book.tahun_terbit}</p>
          </div>
          <div className="rounded-2xl bg-white/60 p-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">ISBN</p>
            <p className="truncate font-black text-espresso">{book.isbn}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={`/buku/${book.buku_id}`} className="button-primary flex-1 px-4 py-2.5">
          Detail
        </Link>
        <button type="button" className="button-secondary px-4 py-2.5" onClick={() => onEdit(book)}>
          Edit
        </button>
        <button type="button" className="button-secondary px-4 py-2.5" onClick={() => onDelete(book)}>
          Hapus
        </button>
      </div>
    </article>
  );
}
