import { useEffect, useMemo, useReducer } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard.jsx';
import BookForm from '../components/BookForm.jsx';
import { createBook, deleteBook, getBooks, updateBook } from '../services/bookApi.js';
import { categoryOptions } from '../data/fallbackBooks.js';

const initialState = {
  books: [],
  status: 'idle',
  saving: false,
  error: '',
  notice: '',
  source: 'api',
  query: '',
  category: 'all',
  sortBy: 'newest',
  formOpen: false,
  formMode: 'create',
  selectedBook: null,
};

function getBookId(book) {
  return book.buku_id || book.id_buku || book.id;
}

function getBookStock(book) {
  return Number(book.stok ?? book.tersedia ?? book.jumlah_eksemplar ?? 0);
}

function booksReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: '', notice: '' };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        status: 'success',
        books: action.payload.data,
        source: action.payload.source,
        notice:
          action.payload.source === 'fallback'
            ? 'Backend belum aktif, jadi EndLib memakai data demo dulu.'
            : '',
        error: action.payload.error || '',
      };

    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.payload };

    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'SET_CATEGORY':
      return { ...state, category: action.payload };

    case 'SET_SORT':
      return { ...state, sortBy: action.payload };

    case 'OPEN_CREATE':
      return {
        ...state,
        formOpen: true,
        formMode: 'create',
        selectedBook: null,
        notice: '',
      };

    case 'OPEN_EDIT':
      return {
        ...state,
        formOpen: true,
        formMode: 'edit',
        selectedBook: action.payload,
        notice: '',
      };

    case 'CLOSE_FORM':
      return {
        ...state,
        formOpen: false,
        selectedBook: null,
        saving: false,
      };

    case 'SAVE_START':
      return { ...state, saving: true, notice: '', error: '' };

    case 'UPSERT_BOOK': {
      const newBookId = getBookId(action.payload);
      const exists = state.books.some((book) => getBookId(book) === newBookId);

      return {
        ...state,
        saving: false,
        formOpen: false,
        selectedBook: null,
        notice: action.notice || 'Data buku berhasil disimpan.',
        books: exists
          ? state.books.map((book) =>
              getBookId(book) === newBookId ? action.payload : book
            )
          : [action.payload, ...state.books],
      };
    }

    case 'REMOVE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => getBookId(book) !== action.payload),
        notice: action.notice || 'Buku berhasil dihapus.',
      };

    case 'SET_NOTICE':
      return { ...state, notice: action.payload };

    case 'SET_ERROR':
      return { ...state, saving: false, error: action.payload };

    default:
      return state;
  }
}

export default function Books() {
  const [state, dispatch] = useReducer(booksReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let ignore = false;

    async function load() {
      dispatch({ type: 'LOAD_START' });

      try {
        const result = await getBooks({ limit: 100 });

        if (!ignore) {
          dispatch({ type: 'LOAD_SUCCESS', payload: result });
        }
      } catch (error) {
        if (!ignore) {
          dispatch({ type: 'LOAD_ERROR', payload: error.message });
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('mode') === 'tambah') {
      dispatch({ type: 'OPEN_CREATE' });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredBooks = useMemo(() => {
    const keyword = state.query.trim().toLowerCase();

    return state.books
      .filter((book) => {
        const matchKeyword = [
          book.judul_buku,
          book.penulis,
          book.penerbit,
          book.isbn,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);

        const matchCategory =
          state.category === 'all' ||
          Number(book.kategori_id || book.id_kategori) === Number(state.category);

        return matchKeyword && matchCategory;
      })
      .sort((a, b) => {
        if (state.sortBy === 'title') {
          return String(a.judul_buku || '').localeCompare(String(b.judul_buku || ''));
        }

        if (state.sortBy === 'stock') {
          return getBookStock(b) - getBookStock(a);
        }

        if (state.sortBy === 'year') {
          return Number(b.tahun_terbit || 0) - Number(a.tahun_terbit || 0);
        }

        return new Date(b.created_at || b.tanggal_masuk || 0) - new Date(a.created_at || a.tanggal_masuk || 0);
      });
  }, [state.books, state.category, state.query, state.sortBy]);

  const totalStock = state.books.reduce((total, book) => total + getBookStock(book), 0);
  const readyBooks = state.books.filter((book) => getBookStock(book) > 0).length;

  const handleSubmit = async (payload) => {
    dispatch({ type: 'SAVE_START' });

    try {
      if (state.formMode === 'edit') {
        const selectedBookId = getBookId(state.selectedBook);
        const updated = await updateBook(selectedBookId, payload);

        dispatch({
          type: 'UPSERT_BOOK',
          payload: updated,
          notice: 'Data buku berhasil di-update dari API.',
        });
      } else {
        const created = await createBook(payload);

        dispatch({
          type: 'UPSERT_BOOK',
          payload: created,
          notice: 'Buku baru berhasil masuk ke EndLib.',
        });
      }
    } catch (error) {
      const selectedBookId = getBookId(state.selectedBook || {});

      if (
        state.source === 'fallback' ||
        String(selectedBookId || '').startsWith('demo-')
      ) {
        const offlineBook = {
          ...payload,
          buku_id:
            state.formMode === 'edit'
              ? selectedBookId
              : `local-${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        dispatch({
          type: 'UPSERT_BOOK',
          payload: offlineBook,
          notice: 'Backend belum tersambung. Perubahan disimpan sementara di state React.',
        });

        return;
      }

      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleDelete = async (book) => {
    const bookId = getBookId(book);
    const confirmed = window.confirm(`Hapus "${book.judul_buku}" dari EndLib?`);

    if (!confirmed) return;

    try {
      if (
        !String(bookId).startsWith('demo-') &&
        !String(bookId).startsWith('local-')
      ) {
        await deleteBook(bookId);
      }

      dispatch({
        type: 'REMOVE_BOOK',
        payload: bookId,
        notice: 'Buku berhasil dihapus dari rak.',
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <section className="container-page space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="glass-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-caramel/30 blur-3xl" />

          <div className="relative">
            <p className="pill mb-5">EndLib · Perpustakaan Gen Z</p>

            <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-espresso sm:text-6xl">
              Your soft era starts with one good book.
            </h1>

            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-cocoa sm:text-lg">
              Kelola koleksi buku, cari judul favorit, update stok, dan buka detail buku.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => dispatch({ type: 'OPEN_CREATE' })}
                className="button-primary"
              >
                + Tambah Buku
              </button>

              <a href="#koleksi" className="button-secondary">
                Lihat Koleksi
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="glass-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-caramel">
              Total Buku
            </p>
            <p className="mt-2 text-4xl font-black">{state.books.length}</p>
          </div>

          <div className="glass-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-caramel">
              Tersedia
            </p>
            <p className="mt-2 text-4xl font-black">{readyBooks}</p>
          </div>

          <div className="glass-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-caramel">
              Total Stok
            </p>
            <p className="mt-2 text-4xl font-black">{totalStock}</p>
          </div>
        </div>
      </div>

      <div id="koleksi" className="glass-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="pill mb-3">State Management Area</p>
            <h2 className="text-3xl font-black">Koleksi EndLib</h2>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'OPEN_CREATE' })}
            className="button-primary"
          >
            Tambah Koleksi
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <input
            value={state.query}
            onChange={(event) =>
              dispatch({ type: 'SET_QUERY', payload: event.target.value })
            }
            className="input-field"
            placeholder="Cari judul, penulis, penerbit, atau ISBN..."
          />

          <select
            value={state.category}
            onChange={(event) =>
              dispatch({ type: 'SET_CATEGORY', payload: event.target.value })
            }
            className="input-field"
          >
            <option value="all">Semua kategori</option>
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={state.sortBy}
            onChange={(event) =>
              dispatch({ type: 'SET_SORT', payload: event.target.value })
            }
            className="input-field"
          >
            <option value="newest">Terbaru</option>
            <option value="title">Judul A-Z</option>
            <option value="stock">Stok terbanyak</option>
            <option value="year">Tahun terbaru</option>
          </select>
        </div>
      </div>

      {state.notice && (
        <div className="rounded-3xl border border-caramel/25 bg-caramel/10 px-5 py-4 text-sm font-bold text-mocha">
          {state.notice}
        </div>
      )}

      {state.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {state.error}
        </div>
      )}

      {state.status === 'loading' ? (
        <div className="glass-card grid min-h-64 place-items-center p-10 text-center">
          <div>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-mocha/15 border-t-mocha" />
            <p className="text-lg font-black">Mengambil data buku...</p>
          </div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard
              key={getBookId(book)}
              book={book}
              onEdit={(selected) =>
                dispatch({ type: 'OPEN_EDIT', payload: selected })
              }
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card grid min-h-64 place-items-center p-10 text-center">
          <div>
            <h3 className="mt-4 text-2xl font-black">Buku tidak ditemukan</h3>
            <p className="mt-2 font-semibold text-cocoa">
              Coba keyword lain atau tambah koleksi baru.
            </p>
          </div>
        </div>
      )}

      <BookForm
        open={state.formOpen}
        mode={state.formMode}
        selectedBook={state.selectedBook}
        onClose={() => dispatch({ type: 'CLOSE_FORM' })}
        onSubmit={handleSubmit}
        loading={state.saving}
      />
    </section>
  );
}