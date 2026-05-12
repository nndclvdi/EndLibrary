import { useEffect, useMemo, useState } from 'react';
import { createMember, getMembers } from '../services/libraryApi.js';
import idLogo from '../assets/Endlib id.png';

const emptyForm = {
  nim: '',
  nama_lengkap: '',
  email_kampus: '',
  program_studi: '',
  angkatan: '',
  no_hp: '',
  alamat: '',
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState('');
  const [major, setMajor] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadMembers() {
    setLoading(true);
    const result = await getMembers();
    setMembers(result.data);
    setError(result.error || '');
    setLoading(false);
  }

  useEffect(() => {
    let ignore = false;

    async function initMembers() {
      setLoading(true);
      const result = await getMembers();

      if (!ignore) {
        setMembers(result.data);
        setError(result.error || '');
        setLoading(false);
      }
    }

    initMembers();

    return () => {
      ignore = true;
    };
  }, []);

  const majors = useMemo(() => {
    const uniqueMajors = [
      ...new Set(
        members
          .map((member) => member.jurusan || member.program_studi)
          .filter(Boolean)
      ),
    ];

    return ['Semua', ...uniqueMajors];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return members.filter((member) => {
      const memberMajor = member.jurusan || member.program_studi || '';

      const matchKeyword = [
        member.mahasiswa_id,
        member.id_mahasiswa,
        member.nim,
        member.nama_mahasiswa,
        member.nama_lengkap,
        member.jurusan,
        member.program_studi,
        member.angkatan,
        member.email,
        member.email_kampus,
        member.no_hp,
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword);

      const matchMajor = major === 'Semua' || memberMajor === major;

      return matchKeyword && matchMajor;
    });
  }, [major, members, query]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      angkatan: form.angkatan ? Number(form.angkatan) : null,
    };

    const result = await createMember(payload);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    await loadMembers();
  }

  return (
    <section className="container-page space-y-8">
      <div className="glass-card p-6 sm:p-8 lg:p-10">
        <p className="pill mb-5">Daftar Anggota Perpustakaan</p>

        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
          Data anggota EndLib.
        </h1>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="button-primary mt-7"
        >
          {showForm ? 'Tutup Form' : '+ Tambah Anggota'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-espresso">
              Tambah Anggota Baru
            </h2>

            <p className="mt-2 text-sm font-semibold text-cocoa">
              Data akan masuk ke database Endlib, pastikan isi dengan benar!
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="nim"
              value={form.nim}
              onChange={handleChange}
              className="input-field"
              placeholder="NIM"
              required
            />

            <input
              name="nama_lengkap"
              value={form.nama_lengkap}
              onChange={handleChange}
              className="input-field"
              placeholder="Nama lengkap"
              required
            />

            <input
              name="email_kampus"
              type="email"
              value={form.email_kampus}
              onChange={handleChange}
              className="input-field"
              placeholder="Email kampus"
              required
            />

            <input
              name="program_studi"
              value={form.program_studi}
              onChange={handleChange}
              className="input-field"
              placeholder="Program studi"
            />

            <input
              name="angkatan"
              type="number"
              value={form.angkatan}
              onChange={handleChange}
              className="input-field"
              placeholder="Angkatan"
            />

            <input
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              className="input-field"
              placeholder="No HP"
            />

            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="input-field min-h-28 md:col-span-2"
              placeholder="Alamat"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={saving} className="button-primary">
              {saving ? 'Menyimpan...' : 'Simpan Anggota'}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setShowForm(false);
              }}
              className="button-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-espresso">
              Anggota Aktif
            </h2>

            <p className="mt-2 text-sm font-semibold text-cocoa">
              Cari berdasarkan nama, NIM, jurusan, email, atau nomor HP.
            </p>
          </div>

          <span className="rounded-full bg-caramel/20 px-4 py-2 text-sm font-black text-mocha">
            {filteredMembers.length} anggota
          </span>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1.4fr_0.6fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input-field"
            placeholder="Cari anggota perpustakaan..."
          />

          <select
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            className="input-field"
          >
            {majors.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-6 font-bold text-cocoa">
          Memuat data anggota...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="glass-card p-6 font-bold text-cocoa">
          Belum ada anggota yang cocok.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => {
            const id = member.mahasiswa_id || member.id_mahasiswa;
            const name = member.nama_mahasiswa || member.nama_lengkap;
            const email = member.email || member.email_kampus;
            const memberMajor = member.jurusan || member.program_studi;
            const totalBorrowing = member.total_peminjaman || 0;

            return (
              <article
                key={id}
                className="glass-card p-6 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-espresso to-caramel shadow-lg shadow-mocha/20 transition duration-300 hover:rotate-[-3deg] hover:scale-105">
                    <img
                      src={idLogo}
                      alt="Logo ID EndLib"
                      className="h-full w-full object-cover transition duration-300 hover:scale-110"
                    />
                  </div>

                  <span className="rounded-full bg-caramel/20 px-3 py-1 text-xs font-black text-mocha">
                    Angkatan {member.angkatan || '-'}
                  </span>
                </div>

                <p className="pill mt-5">{member.nim}</p>

                <h3 className="mt-3 text-2xl font-black text-espresso">
                  {name}
                </h3>

                <p className="mt-2 font-bold text-cocoa">
                  {memberMajor || '-'}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">
                      Email
                    </p>

                    <p className="mt-1 truncate font-black text-espresso">
                      {email || '-'}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">
                      Pinjam
                    </p>

                    <p className="mt-1 font-black text-espresso">
                      {totalBorrowing} buku
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">
                      No HP
                    </p>

                    <p className="mt-1 truncate font-black text-espresso">
                      {member.no_hp || '-'}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-mocha/60">
                      Alamat
                    </p>

                    <p className="mt-1 truncate font-black text-espresso">
                      {member.alamat || '-'}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}