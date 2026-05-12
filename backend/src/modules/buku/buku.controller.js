import * as bukuservice from './buku.service.js';
import { createBukuSchema, updateBukuSchema, paginationSchema } from './buku.validation.js';

function handleError(res, error, status = 400) {
  const message = error?.detail || error?.sqlMessage || error?.message || 'Terjadi kesalahan pada server';
  return res.status(status).json({ message });
}

export const createBuku = async (req, res) => {
  try {
    const data = createBukuSchema.parse(req.body);
    const buku = await bukuservice.createBuku(data);
    res.status(201).json(buku);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateBuku = async (req, res) => {
  try {
    const id = req.params.id;
    const data = updateBukuSchema.parse(req.body);
    const buku = await bukuservice.updateBuku(id, data);
    res.status(200).json({ message: 'Buku berhasil diupdate', data: buku });
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getBukubyId = async (req, res) => {
  try {
    const id = req.params.id;
    const buku = await bukuservice.getBukubyId(id);
    res.json(buku);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const getBuku = async (req, res) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await bukuservice.getBukuWithPagination(page, limit);
    res.json(result);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteBuku = async (req, res) => {
  try {
    const id = req.params.id;
    await bukuservice.deleteBuku(id);
    res.json({ message: 'Buku berhasil dihapus' });
  } catch (error) {
    if (error?.code === '23503' || error?.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: 'Buku tidak bisa dihapus karena masih memiliki data peminjaman.' });
    }
    handleError(res, error, 404);
  }
};
