import { useEffect, useMemo, useState } from 'react';
import { categoryOptions } from '../data/fallbackBooks.js';

const emptyForm = {
  kategori_id: 1,
  isbn: '',
  judul_buku: '',
  penulis: '',
  penerbit: '',
  tahun_terbit: new Date().getFullYear(),
  stok: 1,
  lokasi_rak: '',
};

export default function BookForm({ open, mode, selectedBook, onClose, onSubmit, loading }) {
  const initialValue = useMemo(() => selectedBook || emptyForm, [selectedBook]);
  const [form, setForm] = useState(initialValue);

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue, open]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Glow up data buku' : 'Tambah koleksi baru';

  const updateField = (event) => {
    const { name, value } = event.target;
    const numberFields = ['kategori_id', 'tahun_terbit', 'stok'];
    setForm((current) => ({
      ...current,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      kategori_id: Number(form.kategori_id),
      isbn: form.isbn.trim(),
      judul_buku: form.judul_buku.trim(),
      penulis: form.penulis.trim(),
      penerbit: form.penerbit.trim(),
      tahun_terbit: Number(form.tahun_terbit),
      stok: Number(form.stok),
      jumlah_eksemplar: Number(form.stok),
      lokasi_rak: form.lokasi_rak?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-espresso/50 px-4 py-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="glass-card max-h-[92vh] w-full max-w-3xl overflow-y-auto p-6">
        <div className="flex flex-col gap-3 border-b border-mocha/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="pill mb-3">End Library</p>
            <h2 className="text-3xl font-black text-espresso">{title}</h2>
            <p className="mt-2 text-sm font-semibold text-cocoa">Isi data buku dengan sesuai</p>
          </div>
          <button type="button" onClick={onClose} className="button-secondary px-4 py-2">
            Tutup
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-black text-mocha">Judul Buku</span>
            <input name="judul_buku" required value={form.judul_buku} onChange={updateField} className="input-field" placeholder="Contoh: Etika Vibe Coding" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">Penulis</span>
            <input name="penulis" required value={form.penulis} onChange={updateField} className="input-field" placeholder="Nama penulis" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">Penerbit</span>
            <input name="penerbit" required value={form.penerbit} onChange={updateField} className="input-field" placeholder="Nama penerbit" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">ISBN</span>
            <input name="isbn" required value={form.isbn} onChange={updateField} className="input-field" placeholder="978-xxxx" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">Kategori</span>
            <select name="kategori_id" value={form.kategori_id} onChange={updateField} className="input-field">
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">Tahun Terbit</span>
            <input name="tahun_terbit" type="number" min="1000" required value={form.tahun_terbit} onChange={updateField} className="input-field" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">Stok Tersedia</span>
            <input name="stok" type="number" min="0" required value={form.stok} onChange={updateField} className="input-field" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-mocha">Lokasi Rak</span>
            <input name="lokasi_rak" value={form.lokasi_rak || ''} onChange={updateField} className="input-field" placeholder="Contoh: A1-01" />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="button-secondary">
            Batal
          </button>
          <button type="submit" disabled={loading} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Update' : 'Tambah Buku'}
          </button>
        </div>
      </form>
    </div>
  );
}
