import * as bukuRepository from './buku.repository.js';

export const createBuku = async (data) => {
  return bukuRepository.createBuku(data);
};

export const updateBuku = async (id, data) => {
  const existing = await bukuRepository.getBukubyId(id);
  if (!existing) {
    throw new Error('Buku tidak ditemukan');
  }
  return bukuRepository.updateBuku(id, data);
};

export const getBukubyId = async (id) => {
  const buku = await bukuRepository.getBukubyId(id);
  if (!buku) {
    throw new Error('Buku tidak ditemukan');
  }
  return buku;
};

export const getBukuWithPagination = async (page, limit) => {
  const buku = await bukuRepository.getBuku(page, limit);
  const totalData = await bukuRepository.getPages(limit);

  return {
    page,
    limit,
    total_pages: Number(totalData),
    data: buku,
  };
};

export const deleteBuku = async (id) => {
  const existing = await bukuRepository.getBukubyId(id);
  if (!existing) {
    throw new Error('Buku tidak ditemukan');
  }

  await bukuRepository.deleteBuku(id);
  return { message: 'Buku berhasil dihapus' };
};
