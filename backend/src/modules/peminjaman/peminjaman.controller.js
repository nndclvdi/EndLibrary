import * as peminjamanRepository from './peminjaman.repository.js';

export const getPeminjaman = async (req, res) => {
  try {
    const data = await peminjamanRepository.getPeminjaman();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.detail || error.sqlMessage || error.message });
  }
};

export const getPeminjamanById = async (req, res) => {
  try {
    const data = await peminjamanRepository.getPeminjamanById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.detail || error.sqlMessage || error.message });
  }
};

export const createPeminjaman = async (req, res) => {
  try {
    const payload = {
      kode_peminjaman: req.body.kode_peminjaman,
      mahasiswa_id: Number(req.body.mahasiswa_id ?? req.body.id_mahasiswa),
      buku_id: Number(req.body.buku_id ?? req.body.id_buku),
      tanggal_pinjam: req.body.tanggal_pinjam,
      tanggal_jatuh_tempo: req.body.tanggal_jatuh_tempo ?? req.body.batas_kembali,
      status: req.body.status || req.body.status_peminjaman || 'dipinjam',
      denda: Number(req.body.denda || 0),
      petugas: req.body.petugas || 'Admin EndLib',
    };

    if (!payload.mahasiswa_id || !payload.buku_id || !payload.tanggal_pinjam || !payload.tanggal_jatuh_tempo) {
      return res.status(400).json({ message: 'mahasiswa_id, buku_id, tanggal_pinjam, dan tanggal_jatuh_tempo wajib diisi' });
    }

    const detail = await peminjamanRepository.createPeminjaman(payload);
    return res.status(201).json(detail);
  } catch (error) {
    return res.status(400).json({ message: error.detail || error.sqlMessage || error.message });
  }
};

export const tandaiKembali = async (req, res) => {
  try {
    const detail = await peminjamanRepository.tandaiKembali(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    return res.json({ message: 'Peminjaman berhasil ditandai kembali', data: detail });
  } catch (error) {
    return res.status(400).json({ message: error.detail || error.sqlMessage || error.message });
  }
};
