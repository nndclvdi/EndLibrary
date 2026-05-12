import { z } from 'zod';

const bukuBaseSchema = z.object({
  kategori_id: z.coerce.number().int().min(1, 'Kategori wajib diisi'),
  isbn: z.string().min(3, 'ISBN wajib diisi'),
  judul_buku: z.string().min(2, 'Judul buku wajib diisi'),
  penulis: z.string().min(2, 'Penulis wajib diisi'),
  penerbit: z.string().min(2, 'Penerbit wajib diisi'),
  tahun_terbit: z.coerce.number().int().min(1000, 'Tahun terbit tidak valid'),
  stok: z.coerce.number().int().min(0, 'Stok tidak boleh negatif').default(1),
  lokasi_rak: z.string().optional(),
  jumlah_eksemplar: z.coerce.number().int().min(0).optional(),
  tanggal_masuk: z.string().optional(),
});

export const createBukuSchema = bukuBaseSchema;
export const updateBukuSchema = bukuBaseSchema;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
