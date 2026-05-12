import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function unwrapData(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Request gagal diproses';
}

export function normalizeMember(member) {
  const memberId = member.mahasiswa_id ?? member.id_mahasiswa;
  return {
    mahasiswa_id: memberId,
    id_mahasiswa: memberId,
    nim: member.nim ?? '-',
    nama_mahasiswa: member.nama_mahasiswa ?? member.nama_lengkap ?? 'Tanpa nama',
    nama_lengkap: member.nama_lengkap ?? member.nama_mahasiswa ?? 'Tanpa nama',
    jurusan: member.jurusan ?? member.program_studi ?? '-',
    program_studi: member.program_studi ?? member.jurusan ?? '-',
    fakultas: member.fakultas ?? '-',
    angkatan: member.angkatan ?? '-',
    semester: member.semester ?? '-',
    email: member.email ?? member.email_kampus ?? '-',
    email_kampus: member.email_kampus ?? member.email ?? '-',
    status_mahasiswa: member.status_mahasiswa ?? 'aktif',
    alamat: member.alamat ?? '-',
    kota_asal: member.kota_asal ?? '-',
    tanggal_lahir: member.tanggal_lahir ?? null,
    jenis_kelamin: member.jenis_kelamin ?? '-',
    no_hp: member.no_hp ?? '-',
    dosen_wali: member.dosen_wali ?? '-',
    total_peminjaman: Number(member.total_peminjaman ?? 0),
    created_at: member.created_at ?? null,
  };
}

export function normalizeBorrowing(item) {
  const today = new Date().toISOString().slice(0, 10);
  const rawDueDate = item.tanggal_jatuh_tempo ?? item.batas_kembali;
  const dueDate = rawDueDate ? String(rawDueDate).slice(0, 10) : null;
  const rawStatus = String(item.status ?? item.status_peminjaman ?? 'dipinjam').toLowerCase();
  const isReturned = rawStatus === 'dikembalikan' || Boolean(item.tanggal_kembali);
  const isLate = rawStatus === 'terlambat' || (!isReturned && dueDate && dueDate < today);
  const borrowingId = item.peminjaman_id ?? item.id_peminjaman;
  const memberId = item.mahasiswa_id ?? item.id_mahasiswa;
  const bookId = item.buku_id ?? item.id_buku;

  return {
    peminjaman_id: borrowingId,
    id_peminjaman: borrowingId,
    kode_peminjaman: item.kode_peminjaman ?? `PMJ-${borrowingId}`,
    mahasiswa_id: memberId,
    id_mahasiswa: memberId,
    buku_id: bookId,
    id_buku: bookId,
    tanggal_pinjam: item.tanggal_pinjam ? String(item.tanggal_pinjam).slice(0, 10) : '-',
    tanggal_jatuh_tempo: dueDate ?? '-',
    batas_kembali: dueDate ?? '-',
    tanggal_kembali: item.tanggal_kembali ? String(item.tanggal_kembali).slice(0, 10) : null,
    status: isReturned ? 'Dikembalikan' : isLate ? 'Terlambat' : 'Dipinjam',
    status_raw: item.status ?? item.status_peminjaman ?? 'dipinjam',
    denda: Number(item.denda ?? 0),
    petugas: item.petugas ?? '-',
    nim: item.nim ?? '-',
    nama_mahasiswa: item.nama_mahasiswa ?? item.nama_lengkap ?? 'Tanpa nama',
    jurusan: item.jurusan ?? item.program_studi ?? '-',
    judul_buku: item.judul_buku ?? 'Buku tidak ditemukan',
    penulis: item.penulis ?? '-',
    isbn: item.isbn ?? '-',
  };
}

export async function getMembers() {
  try {
    const { data } = await api.get('/mahasiswa');
    return { source: 'api', data: unwrapData(data).map(normalizeMember) };
  } catch (error) {
    return { source: 'error', data: [], error: getErrorMessage(error) };
  }
}

export async function getBorrowings() {
  try {
    const { data } = await api.get('/peminjaman');
    return { source: 'api', data: unwrapData(data).map(normalizeBorrowing) };
  } catch (error) {
    return { source: 'error', data: [], error: getErrorMessage(error) };
  }
}

export async function createBorrowing(payload) {
  const { data } = await api.post('/peminjaman', payload);
  return normalizeBorrowing(data);
}

export async function markBorrowingReturned(id) {
  const { data } = await api.put(`/peminjaman/${id}/kembali`);
  return normalizeBorrowing(data.data ?? data);
}

export async function createMember(payload) {
  try {
    const response = await api.post('/mahasiswa', payload);

    return {
      data: response.data?.data || response.data,
      error: '',
      source: 'api',
    };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || 'Gagal menambahkan anggota.',
      source: 'api',
    };
  }
}