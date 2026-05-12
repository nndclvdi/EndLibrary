import db from '../../config/db.config.js';

const peminjamanSelect = `
  SELECT
    p.id_peminjaman AS peminjaman_id,
    p.id_peminjaman,
    p.kode_peminjaman,
    p.id_mahasiswa AS mahasiswa_id,
    p.id_mahasiswa,
    p.id_buku AS buku_id,
    p.id_buku,
    p.tanggal_pinjam,
    p.batas_kembali AS tanggal_jatuh_tempo,
    p.batas_kembali,
    p.tanggal_kembali,
    p.status_peminjaman AS status,
    p.status_peminjaman,
    p.denda,
    p.petugas,
    m.nim,
    m.nama_lengkap AS nama_mahasiswa,
    d.program_studi AS jurusan,
    b.judul_buku,
    b.penulis,
    b.isbn
  FROM peminjaman p
  LEFT JOIN mahasiswa m ON m.id_mahasiswa = p.id_mahasiswa
  LEFT JOIN detail_mahasiswa d ON d.id_mahasiswa = m.id_mahasiswa
  LEFT JOIN buku b ON b.id_buku = p.id_buku
`;

export const getPeminjaman = async () => {
  const result = await db.query(`${peminjamanSelect} ORDER BY p.id_peminjaman DESC`);
  return result.rows;
};

export const getPeminjamanById = async (id) => {
  const result = await db.query(`${peminjamanSelect} WHERE p.id_peminjaman = $1`, [id]);
  return result.rows[0];
};

export const createPeminjaman = async (data) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const kodePeminjaman = data.kode_peminjaman || `PMJ-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;

    const result = await client.query(
      `INSERT INTO peminjaman
        (kode_peminjaman, id_mahasiswa, id_buku, tanggal_pinjam, batas_kembali, tanggal_kembali, status_peminjaman, denda, petugas)
       VALUES ($1, $2, $3, $4, $5, NULL, $6, $7, $8)
       RETURNING id_peminjaman`,
      [
        kodePeminjaman,
        data.mahasiswa_id ?? data.id_mahasiswa,
        data.buku_id ?? data.id_buku,
        data.tanggal_pinjam,
        data.tanggal_jatuh_tempo ?? data.batas_kembali,
        data.status || data.status_peminjaman || 'dipinjam',
        data.denda || 0,
        data.petugas || 'Admin EndLib',
      ]
    );

    await client.query(
      `UPDATE buku
       SET tersedia = GREATEST(tersedia - 1, 0)
       WHERE id_buku = $1`,
      [data.buku_id ?? data.id_buku]
    );

    await client.query('COMMIT');
    return getPeminjamanById(result.rows[0].id_peminjaman);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const tandaiKembali = async (id) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const current = await client.query(
      'SELECT id_buku, status_peminjaman FROM peminjaman WHERE id_peminjaman = $1',
      [id]
    );

    if (!current.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `UPDATE peminjaman
       SET tanggal_kembali = CURRENT_DATE, status_peminjaman = 'dikembalikan'
       WHERE id_peminjaman = $1`,
      [id]
    );

    if (current.rows[0].status_peminjaman !== 'dikembalikan') {
      await client.query(
        `UPDATE buku
         SET tersedia = LEAST(tersedia + 1, jumlah_eksemplar)
         WHERE id_buku = $1`,
        [current.rows[0].id_buku]
      );
    }

    await client.query('COMMIT');
    return getPeminjamanById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
