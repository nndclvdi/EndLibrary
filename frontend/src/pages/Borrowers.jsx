import { useEffect, useMemo, useState } from 'react';
import { getBooks } from '../services/bookApi.js';
import { createBorrowing, getBorrowings, getMembers, markBorrowingReturned } from '../services/libraryApi.js';

const statusStyle = {
  Dipinjam: 'bg-caramel/20 text-mocha',
  Terlambat: 'bg-red-100 text-red-700',
  Dikembalikan: 'bg-emerald-100 text-emerald-700',
};

const emptyForm = {
  mahasiswa_id: '',
  buku_id: '',
  tanggal_pinjam: '',
  tanggal_jatuh_tempo: '',
};

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Semua');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');

    const [borrowingsResult, membersResult, booksResult] = await Promise.all([
      getBorrowings(),
      getMembers(),
      getBooks({ limit: 100 }),
    ]);

    setBorrowers(borrowingsResult.data);
    setMembers(membersResult.data);
    setBooks(booksResult.data);

    const errors = [borrowingsResult.error, membersResult.error, booksResult.error].filter(Boolean);
    if (errors.length) {
      setError(errors[0]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredBorrowers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return borrowers.filter((borrower) => {
      const matchKeyword = [
        borrower.nama_mahasiswa,
        borrower.judul_buku,
        borrower.nim,
        borrower.peminjaman_id,
        borrower.jurusan,
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
      const matchStatus = status === 'Semua' || borrower.status === status;
      return matchKeyword && matchStatus;
    });
  }, [borrowers, query, status]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await createBorrowing({
        mahasiswa_id: Number(form.mahasiswa_id),
        buku_id: Number(form.buku_id),
        tanggal_pinjam: form.tanggal_pinjam,
        tanggal_jatuh_tempo: form.tanggal_jatuh_tempo,
        status: 'dipinjam',
        denda: 0,
      });
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan peminjaman');
    } finally {
      setSaving(false);
    }
  };

  const markReturned = async (id) => {
    setError('');
    try {
      await markBorrowingReturned(id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menandai pengembalian');
    }
  };

  return (
    <section className="container-page space-y-8">
      <div className="glass-card p-6 sm:p-8 lg:p-10">
        <p className="pill mb-5">Data Peminjam</p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Pantau peminjaman buku langsung dari database yang tersedia!</h1>
      </div>

      {error && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="glass-card p-6">
          <h2 className="text-3xl font-black text-espresso">Catat Peminjaman</h2>
          <p className="mt-2 font-semibold text-cocoa">Data yang disimpan akan masuk ke dalam database perpustakaan.</p>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-black text-mocha">Anggota / Mahasiswa</span>
              <select name="mahasiswa_id" value={form.mahasiswa_id} onChange={handleChange} required className="input-field">
                <option value="">Pilih anggota</option>
                {members.map((member) => (
                  <option key={member.mahasiswa_id} value={member.mahasiswa_id}>
                    {member.nama_mahasiswa} · {member.nim}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-mocha">Buku</span>
              <select name="buku_id" value={form.buku_id} onChange={handleChange} required className="input-field">
                <option value="">Pilih buku</option>
                {books.map((book) => (
                  <option key={book.buku_id} value={book.buku_id}>
                    {book.judul_buku} · stok {book.stok}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-mocha">Tanggal Pinjam</span>
              <input name="tanggal_pinjam" value={form.tanggal_pinjam} onChange={handleChange} required type="date" className="input-field" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black text-mocha">Jatuh Tempo</span>
              <input name="tanggal_jatuh_tempo" value={form.tanggal_jatuh_tempo} onChange={handleChange} required type="date" className="input-field" />
            </label>
            <button type="submit" disabled={saving || loading} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan Peminjaman'}
            </button>
          </div>
        </form>

        <div className="glass-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-espresso">Daftar Peminjam</h2>
              <p className="mt-2 text-sm font-semibold text-cocoa">Cari berdasarkan nama, NIM, buku, atau ID peminjaman.</p>
            </div>
            <span className="rounded-full bg-caramel/20 px-4 py-2 text-sm font-black text-mocha">{filteredBorrowers.length} data</span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1.3fr_0.7fr]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-field" placeholder="Cari peminjam..." />
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input-field">
              <option>Semua</option>
              <option>Dipinjam</option>
              <option>Terlambat</option>
              <option>Dikembalikan</option>
            </select>
          </div>

          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="rounded-[1.5rem] border border-mocha/10 bg-white/70 p-4 font-bold text-cocoa">Memuat data peminjaman...</div>
            ) : filteredBorrowers.length === 0 ? (
              <div className="rounded-[1.5rem] border border-mocha/10 bg-white/70 p-4 font-bold text-cocoa">Belum ada data yang cocok.</div>
            ) : (
              filteredBorrowers.map((borrower) => (
                <article key={borrower.peminjaman_id} className="rounded-[1.5rem] border border-mocha/10 bg-white/70 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-caramel">{borrower.kode_peminjaman}</p>
                      <h3 className="mt-1 text-xl font-black text-espresso">{borrower.nama_mahasiswa}</h3>
                      <p className="mt-1 font-bold text-cocoa">{borrower.judul_buku}</p>
                      <p className="mt-2 text-sm font-semibold text-mocha/70">
                        {borrower.tanggal_pinjam} sampai {borrower.tanggal_jatuh_tempo}
                      </p>
                      <p className="mt-1 text-xs font-bold text-mocha/60">NIM {borrower.nim} · {borrower.jurusan}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyle[borrower.status]}`}>{borrower.status}</span>
                      {borrower.status !== 'Dikembalikan' && (
                        <button type="button" onClick={() => markReturned(borrower.peminjaman_id)} className="button-secondary px-4 py-2 text-xs">
                          Tandai kembali
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
