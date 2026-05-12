import { Link, NavLink } from "react-router-dom";
import endlibLogo from "../assets/endlib logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Buku", path: "/buku" },
  { label: "Peminjam", path: "/peminjam" },
  { label: "Daftar Anggota", path: "/anggota" },
];

export default function Navbar({ onAddBook }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E6D7C4] bg-[#FFF8EC]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-4">
        <Link to="/dashboard" className="group flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-[#2B140F] shadow-xl shadow-[#6F4225]/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg] group-hover:scale-105">
            <img
              src={endlibLogo}
              alt="EndLib Logo"
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            />
          </div>

          <div>
            <h1 className="text-3xl font-black leading-none tracking-tight text-[#2B140F]">
              EndLib
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.45em] text-[#B87950]">
              Library But Make It Cozy
            </p>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full border border-[#E6D7C4] bg-white/70 p-1.5 shadow-sm md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "rounded-full px-7 py-3 text-base font-extrabold transition-all duration-300",
                  isActive
                    ? "bg-[#2B140F] text-white shadow-lg shadow-[#6F4225]/20"
                    : "text-[#4A2A1D] hover:bg-[#F4E7D3]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/buku?mode=tambah"
          className="rounded-full border border-[#E6D7C4] bg-white/80 px-8 py-4 text-base font-extrabold text-[#4A2A1D] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#2B140F] hover:text-white hover:shadow-lg"
        >
          + Tambah Buku
        </Link>
      </div>
    </header>
  );
}