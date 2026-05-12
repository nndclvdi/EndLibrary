import db from '../../config/db.config.js';

const bukuSelect = `
  SELECT
    b.id_buku AS buku_id,
    b.id_buku,
    b.id_kategori AS kategori_id,
    b.id_kategori,
    b.isbn,
    b.judul_buku,
    b.penulis,
    b.penerbit,
    b.tahun_terbit,
    b.lokasi_rak,
    b.jumlah_eksemplar,
    b.tersedia,
    b.tersedia AS stok,
    b.tanggal_masuk,
    b.tanggal_masuk AS created_at,
    k.kode_kategori,
    k.nama_kategori
  FROM buku b
  LEFT JOIN kategori_buku k ON k.id_kategori = b.id_kategori
`;

const toIntOrDefault = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const createBuku = async (data) => {
  const stok = toIntOrDefault(data.stok ?? data.tersedia, 1);
  const jumlahEksemplar = toIntOrDefault(data.jumlah_eksemplar, Math.max(stok, 1));
  const lokasiRak = data.lokasi_rak || `R${data.kategori_id || data.id_kategori || 1}-NEW`;

  const result = await db.query(
    `INSERT INTO buku
      (id_kategori, isbn, judul_buku, penulis, penerbit, tahun_terbit, lokasi_rak, jumlah_eksemplar, tersedia, tanggal_masuk)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::date, CURRENT_DATE))
     RETURNING id_buku`,
    [
      data.kategori_id ?? data.id_kategori,
      data.isbn,
      data.judul_buku,
      data.penulis,
      data.penerbit,
      data.tahun_terbit,
      lokasiRak,
      jumlahEksemplar,
      stok,
      data.tanggal_masuk || null,
    ]
  );

  return getBukubyId(result.rows[0].id_buku);
};

export const updateBuku = async (id, data) => {
  const existing = await getBukubyId(id);
  if (!existing) return null;

  const stok = toIntOrDefault(data.stok ?? data.tersedia, existing.stok);
  const jumlahEksemplar = toIntOrDefault(data.jumlah_eksemplar, Math.max(stok, existing.jumlah_eksemplar ?? 1));

  await db.query(
    `UPDATE buku
     SET id_kategori = $1,
         isbn = $2,
         judul_buku = $3,
         penulis = $4,
         penerbit = $5,
         tahun_terbit = $6,
         lokasi_rak = $7,
         jumlah_eksemplar = $8,
         tersedia = $9
     WHERE id_buku = $10`,
    [
      data.kategori_id ?? data.id_kategori,
      data.isbn,
      data.judul_buku,
      data.penulis,
      data.penerbit,
      data.tahun_terbit,
      data.lokasi_rak || existing.lokasi_rak || `R${data.kategori_id ?? existing.kategori_id}-NEW`,
      jumlahEksemplar,
      stok,
      id,
    ]
  );

  return getBukubyId(id);
};

export const getBukubyId = async (id) => {
  const result = await db.query(`${bukuSelect} WHERE b.id_buku = $1`, [id]);
  return result.rows[0];
};

export const getPages = async (limit) => {
  const result = await db.query('SELECT GREATEST(CEIL(COUNT(*)::numeric / $1)::int, 1) AS total_pages FROM buku', [limit]);
  return result.rows[0]?.total_pages || 1;
};

export const getBuku = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const result = await db.query(
    `${bukuSelect} ORDER BY b.id_buku DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const deleteBuku = async (id) => {
  const result = await db.query('DELETE FROM buku WHERE id_buku = $1', [id]);
  return result.rowCount > 0;
};
