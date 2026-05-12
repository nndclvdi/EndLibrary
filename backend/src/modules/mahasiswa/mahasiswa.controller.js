import * as mahasiswaRepository from './mahasiswa.repository.js';

export const getMahasiswa = async (req, res) => {
  try {
    const data = await mahasiswaRepository.getMahasiswa();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({
      message: error.detail || error.sqlMessage || error.message,
    });
  }
};

export const getMahasiswaById = async (req, res) => {
  try {
    const data = await mahasiswaRepository.getMahasiswaById(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: 'Mahasiswa tidak ditemukan',
      });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.detail || error.sqlMessage || error.message,
    });
  }
};

export const createMahasiswa = async (req, res) => {
  try {
    const payload = {
      nim: req.body.nim,
      nama_lengkap: req.body.nama_lengkap || req.body.nama_mahasiswa,
      email_kampus: req.body.email_kampus || req.body.email,

      // default biar form frontend tetap simpel
      status_mahasiswa: req.body.status_mahasiswa || 'aktif',
      jenis_kelamin: req.body.jenis_kelamin || 'P',
      tanggal_lahir: req.body.tanggal_lahir || '2005-01-01',
      kota_asal: req.body.kota_asal || '-',
      fakultas: req.body.fakultas || '-',
      semester: req.body.semester ? Number(req.body.semester) : 1,
      dosen_wali: req.body.dosen_wali || '-',

      no_hp: req.body.no_hp || '-',
      alamat: req.body.alamat || '-',
      program_studi: req.body.program_studi || req.body.jurusan || '-',
      angkatan: req.body.angkatan ? Number(req.body.angkatan) : null,
    };

    if (!payload.nim || !payload.nama_lengkap || !payload.email_kampus) {
      return res.status(400).json({
        message: 'NIM, nama lengkap, dan email kampus wajib diisi.',
      });
    }

    const data = await mahasiswaRepository.createMahasiswa(payload);

    return res.status(201).json({
      message: 'Anggota berhasil ditambahkan.',
      data,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'NIM atau email kampus sudah terdaftar.',
      });
    }

    return res.status(500).json({
      message: error.detail || error.sqlMessage || error.message || 'Gagal menambahkan anggota.',
    });
  }
};