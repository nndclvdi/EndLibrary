import db from '../../config/db.config.js';

const mahasiswaSelect = `
  SELECT
    m.id_mahasiswa AS mahasiswa_id,
    m.id_mahasiswa,
    m.nim,
    m.nama_lengkap AS nama_mahasiswa,
    m.nama_lengkap,
    d.program_studi AS jurusan,
    d.angkatan,
    m.email_kampus AS email,
    m.email_kampus,
    m.status_mahasiswa,
    m.created_at,
    d.id_detail,
    d.alamat,
    d.tanggal_lahir,
    d.jenis_kelamin,
    d.no_hp,
    d.kota_asal,
    d.fakultas,
    d.program_studi,
    d.semester,
    d.dosen_wali,
    (
      SELECT COUNT(*)::int
      FROM peminjaman p
      WHERE p.id_mahasiswa = m.id_mahasiswa
    ) AS total_peminjaman
  FROM mahasiswa m
  LEFT JOIN detail_mahasiswa d ON d.id_mahasiswa = m.id_mahasiswa
`;

export const getMahasiswa = async () => {
  const result = await db.query(`${mahasiswaSelect} ORDER BY m.id_mahasiswa ASC`);
  return result.rows;
};

export const getMahasiswaById = async (id) => {
  const result = await db.query(`${mahasiswaSelect} WHERE m.id_mahasiswa = $1`, [id]);
  return result.rows[0];
};

export const createMahasiswa = async (payload) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const mahasiswaResult = await client.query(
      `
      INSERT INTO mahasiswa 
        (nim, nama_lengkap, email_kampus, status_mahasiswa)
      VALUES 
        ($1, $2, $3, $4)
      RETURNING id_mahasiswa
      `,
      [
        payload.nim,
        payload.nama_lengkap,
        payload.email_kampus,
        payload.status_mahasiswa || 'aktif',
      ]
    );

    const idMahasiswa = mahasiswaResult.rows[0].id_mahasiswa;

    await client.query(
      `
      INSERT INTO detail_mahasiswa
        (
          id_mahasiswa,
          jenis_kelamin,
          tanggal_lahir,
          no_hp,
          alamat,
          kota_asal,
          fakultas,
          program_studi,
          angkatan,
          semester,
          dosen_wali
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
      [
        idMahasiswa,
        payload.jenis_kelamin || 'P',
        payload.tanggal_lahir || '2005-01-01',
        payload.no_hp || '-',
        payload.alamat || '-',
        payload.kota_asal || '-',
        payload.fakultas || '-',
        payload.program_studi || '-',
        payload.angkatan || null,
        payload.semester || 1,
        payload.dosen_wali || '-',
      ]
    );

    await client.query('COMMIT');

    return getMahasiswaById(idMahasiswa);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};