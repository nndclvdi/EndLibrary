import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col text-espresso">
      <Navbar />
      <main className="flex-1 pb-16 pt-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
