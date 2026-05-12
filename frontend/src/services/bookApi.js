import axios from 'axios';
import { fallbackBooks } from '../data/fallbackBooks.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function normalizeBook(book) {
  const bookId = book.buku_id ?? book.id_buku ?? book.id;
  const categoryId = Number(book.kategori_id ?? book.id_kategori ?? 1);
  const stock = Number(book.stok ?? book.tersedia ?? 0);

  return {
    buku_id: bookId,
    id_buku: bookId,
    kategori_id: categoryId,
    id_kategori: categoryId,
    nama_kategori: book.nama_kategori ?? null,
    kode_kategori: book.kode_kategori ?? null,
    isbn: book.isbn ?? '-',
    judul_buku: book.judul_buku ?? book.title ?? 'Untitled Book',
    penulis: book.penulis ?? book.author ?? 'Unknown Author',
    penerbit: book.penerbit ?? book.publisher ?? '-',
    tahun_terbit: Number(book.tahun_terbit ?? book.year ?? new Date().getFullYear()),
    stok: stock,
    tersedia: stock,
    jumlah_eksemplar: Number(book.jumlah_eksemplar ?? stock),
    lokasi_rak: book.lokasi_rak ?? '-',
    tanggal_masuk: book.tanggal_masuk ?? null,
    created_at: book.created_at ?? book.tanggal_masuk ?? new Date().toISOString(),
  };
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.massage ||
    error.message ||
    'Request gagal diproses'
  );
}

export async function getBooks({ page = 1, limit = 100 } = {}) {
  try {
    const { data: result } = await api.get('/buku', {
      params: { page, limit },
    });

    return {
      source: 'api',
      page: result.page ?? page,
      limit: result.limit ?? limit,
      total_pages: result.total_pages ?? 1,
      data: Array.isArray(result.data) ? result.data.map(normalizeBook) : [],
    };
  } catch (error) {
    return {
      source: 'fallback',
      page,
      limit,
      total_pages: 1,
      data: fallbackBooks.map(normalizeBook),
      error: getErrorMessage(error),
    };
  }
}

export async function getBookById(id) {
  try {
    const { data: book } = await api.get(`/buku/${id}`);
    return { source: 'api', data: normalizeBook(book) };
  } catch (error) {
    const fallback = fallbackBooks.find((book) => String(book.buku_id) === String(id));
    if (fallback) {
      return { source: 'fallback', data: normalizeBook(fallback), error: getErrorMessage(error) };
    }
    throw new Error(getErrorMessage(error));
  }
}

export async function createBook(payload) {
  const { data: book } = await api.post('/buku', payload);
  return normalizeBook(book);
}

export async function updateBook(id, payload) {
  const { data: result } = await api.put(`/buku/${id}`, payload);
  return normalizeBook(result.data ?? result);
}

export async function deleteBook(id) {
  const { data } = await api.delete(`/buku/${id}`);
  return data;
}
