import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Books from './pages/Books.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Borrowers from './pages/Borrowers.jsx';
import Members from './pages/Members.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buku" element={<Books />} />
        <Route path="/buku/:id" element={<BookDetail />} />
        <Route path="/peminjam" element={<Borrowers />} />
        <Route path="/anggota" element={<Members />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
