-- PostgreSQL/Neon schema untuk EndLib
-- Jalankan file ini di Neon SQL Editor. Neon tidak membutuhkan CREATE DATABASE / USE.

DROP TABLE IF EXISTS peminjaman CASCADE;
DROP TABLE IF EXISTS buku CASCADE;
DROP TABLE IF EXISTS kategori_buku CASCADE;
DROP TABLE IF EXISTS detail_mahasiswa CASCADE;
DROP TABLE IF EXISTS mahasiswa CASCADE;

CREATE TABLE mahasiswa (
    id_mahasiswa SERIAL PRIMARY KEY,
    nim VARCHAR(15) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(100) NOT NULL,
    email_kampus VARCHAR(100) NOT NULL UNIQUE,
    status_mahasiswa VARCHAR(20) DEFAULT 'aktif' CHECK (status_mahasiswa IN ('aktif', 'cuti', 'lulus', 'nonaktif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detail_mahasiswa (
    id_detail SERIAL PRIMARY KEY,
    id_mahasiswa INT NOT NULL UNIQUE,
    jenis_kelamin CHAR(1) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    tanggal_lahir DATE NOT NULL,
    no_hp VARCHAR(20),
    alamat TEXT,
    kota_asal VARCHAR(60),
    fakultas VARCHAR(100),
    program_studi VARCHAR(100),
    angkatan INT,
    semester SMALLINT,
    dosen_wali VARCHAR(100),
    FOREIGN KEY (id_mahasiswa) REFERENCES mahasiswa(id_mahasiswa)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE kategori_buku (
    id_kategori SERIAL PRIMARY KEY,
    kode_kategori VARCHAR(10) NOT NULL UNIQUE,
    nama_kategori VARCHAR(80) NOT NULL,
    deskripsi TEXT
);

CREATE TABLE buku (
    id_buku SERIAL PRIMARY KEY,
    id_kategori INT NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    judul_buku VARCHAR(150) NOT NULL,
    penulis VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100),
    tahun_terbit INT,
    lokasi_rak VARCHAR(20),
    jumlah_eksemplar INT DEFAULT 1,
    tersedia INT DEFAULT 1,
    tanggal_masuk DATE,
    FOREIGN KEY (id_kategori) REFERENCES kategori_buku(id_kategori)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE peminjaman (
    id_peminjaman SERIAL PRIMARY KEY,
    kode_peminjaman VARCHAR(20) NOT NULL UNIQUE,
    id_mahasiswa INT NOT NULL,
    id_buku INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    batas_kembali DATE NOT NULL,
    tanggal_kembali DATE NULL,
    status_peminjaman VARCHAR(20) DEFAULT 'dipinjam' CHECK (status_peminjaman IN ('dipinjam', 'dikembalikan', 'terlambat', 'hilang')),
    denda NUMERIC(10,2) DEFAULT 0,
    petugas VARCHAR(100),
    FOREIGN KEY (id_mahasiswa) REFERENCES mahasiswa(id_mahasiswa)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

INSERT INTO mahasiswa
(nim, nama_lengkap, email_kampus, status_mahasiswa)
VALUES
('2310511001', 'Aditya Pratama', 'aditya.pratama@kampus.ac.id', 'aktif'),
('2310511002', 'Nabila Putri Ramadhani', 'nabila.ramadhani@kampus.ac.id', 'aktif'),
('2310511003', 'Rizky Maulana', 'rizky.maulana@kampus.ac.id', 'aktif'),
('2310511004', 'Salsabila Nur Azizah', 'salsabila.azizah@kampus.ac.id', 'aktif'),
('2310511005', 'Fajar Nugroho', 'fajar.nugroho@kampus.ac.id', 'aktif'),
('2310511006', 'Dewi Maharani', 'dewi.maharani@kampus.ac.id', 'aktif'),
('2210511012', 'Bagas Arya Saputra', 'bagas.saputra@kampus.ac.id', 'aktif'),
('2210511015', 'Tiara Anindya', 'tiara.anindya@kampus.ac.id', 'aktif'),
('2210511020', 'Muhammad Ilham Fauzi', 'ilham.fauzi@kampus.ac.id', 'cuti'),
('2110511031', 'Ayu Lestari', 'ayu.lestari@kampus.ac.id', 'aktif'),
('2110511036', 'Rangga Wijaya', 'rangga.wijaya@kampus.ac.id', 'aktif'),
('2110511042', 'Melati Sekar Arum', 'melati.arum@kampus.ac.id', 'aktif'),
('2010511050', 'Dimas Ramadhan', 'dimas.ramadhan@kampus.ac.id', 'lulus'),
('2010511057', 'Citra Amalia', 'citra.amalia@kampus.ac.id', 'lulus'),
('2410511007', 'Kevin Mahendra', 'kevin.mahendra@kampus.ac.id', 'aktif');

INSERT INTO detail_mahasiswa
(id_mahasiswa, jenis_kelamin, tanggal_lahir, no_hp, alamat, kota_asal, fakultas, program_studi, angkatan, semester, dosen_wali)
VALUES
(1, 'L', '2005-02-14', '081234567890', 'Jl. Melati No. 18, Kel. Sukamaju', 'Bandung', 'Fakultas Ilmu Komputer', 'Sistem Informasi', 2023, 6, 'Dr. Rendra Kusuma'),
(2, 'P', '2005-07-21', '082112345678', 'Jl. Kenanga Raya No. 7', 'Bekasi', 'Fakultas Ilmu Komputer', 'Sistem Informasi', 2023, 6, 'Dr. Rendra Kusuma'),
(3, 'L', '2004-11-09', '085712349876', 'Perum Griya Cendana Blok C2', 'Depok', 'Fakultas Ilmu Komputer', 'Informatika', 2023, 6, 'Maya Anggraini, M.Kom'),
(4, 'P', '2005-01-30', '081998765432', 'Jl. Anggrek Timur No. 44', 'Tangerang', 'Fakultas Ekonomi dan Bisnis', 'Manajemen', 2023, 6, 'Dra. Sri Handayani'),
(5, 'L', '2004-05-18', '087812345001', 'Jl. Kaliurang Km. 8', 'Yogyakarta', 'Fakultas Teknik', 'Teknik Industri', 2023, 6, 'Ir. Bimo Santoso'),
(6, 'P', '2005-09-12', '083812349999', 'Jl. Mawar Putih No. 10', 'Semarang', 'Fakultas Ilmu Komputer', 'Informatika', 2023, 6, 'Maya Anggraini, M.Kom'),
(7, 'L', '2003-03-25', '081276543210', 'Jl. Pahlawan No. 29', 'Surabaya', 'Fakultas Teknik', 'Teknik Elektro', 2022, 8, 'Ir. Hendra Prakoso'),
(8, 'P', '2004-08-03', '082298761234', 'Jl. Cemara Asri No. 5', 'Malang', 'Fakultas Ekonomi dan Bisnis', 'Akuntansi', 2022, 8, 'Rina Kartika, M.Ak'),
(9, 'L', '2003-12-17', '085611223344', 'Jl. Brawijaya No. 16', 'Kediri', 'Fakultas Ilmu Komputer', 'Sistem Informasi', 2022, 8, 'Dr. Rendra Kusuma'),
(10, 'P', '2002-10-05', '081377889900', 'Jl. Diponegoro No. 61', 'Solo', 'Fakultas Ilmu Sosial', 'Ilmu Komunikasi', 2021, 10, 'Nina Saraswati, M.I.Kom'),
(11, 'L', '2003-04-11', '082144556677', 'Jl. Sudirman Gang Merpati', 'Jakarta', 'Fakultas Teknik', 'Teknik Sipil', 2021, 10, 'Ir. Satrio Wibowo'),
(12, 'P', '2002-06-27', '081255667788', 'Jl. Cempaka No. 21', 'Purwokerto', 'Fakultas Psikologi', 'Psikologi', 2021, 10, 'Dr. Laila Maharani'),
(13, 'L', '2001-02-19', '085733221100', 'Jl. Veteran No. 8', 'Bogor', 'Fakultas Ilmu Komputer', 'Informatika', 2020, 12, 'Maya Anggraini, M.Kom'),
(14, 'P', '2001-09-29', '081245676543', 'Jl. Imam Bonjol No. 12', 'Medan', 'Fakultas Ekonomi dan Bisnis', 'Manajemen', 2020, 12, 'Dra. Sri Handayani'),
(15, 'L', '2006-01-08', '087700112233', 'Jl. Ahmad Yani No. 70', 'Cirebon', 'Fakultas Ilmu Komputer', 'Sistem Informasi', 2024, 4, 'Dr. Rendra Kusuma');

INSERT INTO kategori_buku
(kode_kategori, nama_kategori, deskripsi)
VALUES
('TI', 'Teknologi Informasi', 'Buku terkait pemrograman, basis data, jaringan, dan sistem informasi.'),
('MJN', 'Manajemen', 'Buku manajemen organisasi, SDM, operasional, dan strategi bisnis.'),
('AKT', 'Akuntansi', 'Buku akuntansi keuangan, audit, perpajakan, dan pelaporan.'),
('KOM', 'Komunikasi', 'Buku komunikasi massa, public speaking, media, dan jurnalistik.'),
('PSI', 'Psikologi', 'Buku psikologi umum, perkembangan, sosial, dan industri.'),
('TEK', 'Teknik', 'Buku bidang teknik sipil, elektro, industri, dan mekanika.'),
('REF', 'Referensi Umum', 'Ensiklopedia, kamus, panduan akademik, dan referensi lintas bidang.'),
('LIT', 'Literatur', 'Novel, esai, sastra Indonesia, dan karya literer.'); 

INSERT INTO buku
(id_kategori, isbn, judul_buku, penulis, penerbit, tahun_terbit, lokasi_rak, jumlah_eksemplar, tersedia, tanggal_masuk)
VALUES
(1, '978-602-5517-21-4', 'Dasar-Dasar Pemrograman Python', 'Arief Santoso', 'Informatika Nusantara', 2022, 'A1-01', 5, 3, '2023-01-12'),
(1, '978-602-8821-43-7', 'Sistem Basis Data Relasional', 'Dian Kartika', 'Pustaka Teknologi', 2021, 'A1-02', 4, 2, '2023-02-03'),
(1, '978-623-7012-88-5', 'Analisis dan Perancangan Sistem Informasi', 'Rudi Hartono', 'Tekno Media', 2020, 'A1-03', 3, 1, '2023-03-16'),
(1, '978-623-8110-14-9', 'Jaringan Komputer Modern', 'M. Yusuf Hakim', 'Cipta Digital Press', 2023, 'A1-04', 4, 4, '2024-01-20'),
(1, '978-602-7945-66-2', 'Keamanan Sistem Informasi', 'Nina Rahmawati', 'Informatika Nusantara', 2022, 'A1-05', 3, 2, '2024-02-11'),
(2, '978-602-9910-72-8', 'Manajemen Strategik untuk Organisasi Modern', 'Hendra Wijaya', 'Mandiri Edukasi', 2021, 'B2-01', 4, 2, '2023-01-18'),
(2, '978-623-6204-34-1', 'Pengantar Manajemen Bisnis', 'Sri Handayani', 'Penerbit Cakrawala', 2019, 'B2-02', 5, 4, '2022-11-02'),
(2, '978-602-4478-09-6', 'Manajemen Sumber Daya Manusia', 'Lukman Prasetyo', 'Mandiri Edukasi', 2020, 'B2-03', 3, 1, '2023-04-07'),
(3, '978-623-5001-17-3', 'Akuntansi Keuangan Menengah', 'Rina Kartika', 'Salemba Akademika', 2022, 'C3-01', 4, 3, '2023-05-10'),
(3, '978-602-3398-91-0', 'Audit Berbasis Risiko', 'Agus Firmansyah', 'Pustaka Ekonomi', 2021, 'C3-02', 2, 1, '2023-05-22'),
(3, '978-623-5442-20-8', 'Perpajakan Indonesia untuk Mahasiswa', 'Mira Yuliani', 'Pustaka Ekonomi', 2023, 'C3-03', 3, 2, '2024-03-05'),
(4, '978-602-6712-19-0', 'Komunikasi Massa di Era Digital', 'Nina Saraswati', 'Media Akademik', 2022, 'D4-01', 4, 4, '2023-06-12'),
(4, '978-623-8702-55-7', 'Public Speaking Profesional', 'Andi Mahendra', 'Media Akademik', 2020, 'D4-02', 3, 2, '2023-06-18'),
(4, '978-602-7155-08-2', 'Dasar-Dasar Jurnalistik Kampus', 'Fitri Wulandari', 'Cakra Pustaka', 2018, 'D4-03', 2, 1, '2022-09-15'),
(5, '978-623-6108-92-4', 'Psikologi Perkembangan Remaja', 'Laila Maharani', 'Humanika Press', 2021, 'E5-01', 4, 2, '2023-07-01'),
(5, '978-602-4331-44-9', 'Psikologi Sosial Terapan', 'Teguh Prabowo', 'Humanika Press', 2020, 'E5-02', 3, 3, '2023-07-04'),
(5, '978-623-7999-31-6', 'Psikologi Industri dan Organisasi', 'Amelia Putri', 'Cendekia Psikologi', 2022, 'E5-03', 3, 2, '2024-04-09'),
(6, '978-602-8080-12-5', 'Mekanika Teknik Dasar', 'Bimo Santoso', 'Teknik Press', 2019, 'F6-01', 3, 2, '2022-10-20'),
(6, '978-623-7330-61-2', 'Pengantar Teknik Elektro', 'Hendra Prakoso', 'Teknik Press', 2021, 'F6-02', 4, 2, '2023-08-11'),
(6, '978-602-9102-47-3', 'Perencanaan Proyek Konstruksi', 'Satrio Wibowo', 'Graha Teknik', 2020, 'F6-03', 2, 1, '2023-08-15'),
(7, '978-602-1200-77-1', 'Kamus Istilah Akademik Indonesia', 'Tim Redaksi Cendekia', 'Cendekia Referensi', 2018, 'R7-01', 6, 5, '2022-08-01'),
(7, '978-623-4411-09-4', 'Panduan Penulisan Karya Ilmiah', 'M. Farhan Hidayat', 'Cendekia Referensi', 2021, 'R7-02', 5, 3, '2023-09-09'),
(8, '978-602-0300-55-8', 'Senja di Kota Lama', 'Ari Wicaksana', 'Lentera Sastra', 2017, 'L8-01', 3, 2, '2022-12-14'),
(8, '978-623-9001-76-0', 'Catatan dari Ruang Baca', 'Ratri Sekar', 'Lentera Sastra', 2020, 'L8-02', 2, 1, '2023-10-03'),
(8, '978-602-7744-18-9', 'Hujan Bulan Oktober', 'Mahesa Wardana', 'Lentera Sastra', 2019, 'L8-03', 3, 3, '2023-10-06');

INSERT INTO peminjaman
(kode_peminjaman, id_mahasiswa, id_buku, tanggal_pinjam, batas_kembali, tanggal_kembali, status_peminjaman, denda, petugas)
VALUES
('PMJ-2026-0001', 1, 1, '2026-01-08', '2026-01-22', '2026-01-20', 'dikembalikan', 0, 'Raka Adinata'),
('PMJ-2026-0002', 2, 2, '2026-01-10', '2026-01-24', '2026-01-27', 'dikembalikan', 6000, 'Raka Adinata'),
('PMJ-2026-0003', 3, 3, '2026-01-12', '2026-01-26', '2026-01-25', 'dikembalikan', 0, 'Mira Safitri'),
('PMJ-2026-0004', 4, 6, '2026-01-15', '2026-01-29', '2026-02-02', 'dikembalikan', 8000, 'Mira Safitri'),
('PMJ-2026-0005', 5, 18, '2026-01-17', '2026-01-31', '2026-01-31', 'dikembalikan', 0, 'Raka Adinata'),
('PMJ-2026-0006', 6, 5, '2026-02-03', '2026-02-17', '2026-02-14', 'dikembalikan', 0, 'Dewangga Putra'),
('PMJ-2026-0007', 7, 19, '2026-02-05', '2026-02-19', '2026-02-22', 'dikembalikan', 6000, 'Dewangga Putra'),
('PMJ-2026-0008', 8, 9, '2026-02-07', '2026-02-21', '2026-02-18', 'dikembalikan', 0, 'Mira Safitri'),
('PMJ-2026-0009', 10, 12, '2026-02-11', '2026-02-25', '2026-02-25', 'dikembalikan', 0, 'Raka Adinata'),
('PMJ-2026-0010', 11, 20, '2026-02-14', '2026-02-28', '2026-03-03', 'dikembalikan', 6000, 'Dewangga Putra'),
('PMJ-2026-0011', 12, 15, '2026-03-01', '2026-03-15', '2026-03-13', 'dikembalikan', 0, 'Mira Safitri'),
('PMJ-2026-0012', 1, 22, '2026-03-04', '2026-03-18', '2026-03-20', 'dikembalikan', 4000, 'Raka Adinata'),
('PMJ-2026-0013', 2, 23, '2026-03-07', '2026-03-21', '2026-03-21', 'dikembalikan', 0, 'Dewangga Putra'),
('PMJ-2026-0014', 3, 7, '2026-03-09', '2026-03-23', '2026-03-24', 'dikembalikan', 2000, 'Mira Safitri'),
('PMJ-2026-0015', 4, 13, '2026-03-12', '2026-03-26', '2026-03-25', 'dikembalikan', 0, 'Raka Adinata'),
('PMJ-2026-0016', 5, 1, '2026-04-01', '2026-04-15', '2026-04-15', 'dikembalikan', 0, 'Dewangga Putra'),
('PMJ-2026-0017', 6, 2, '2026-04-03', '2026-04-17', NULL, 'terlambat', 48000, 'Mira Safitri'),
('PMJ-2026-0018', 7, 8, '2026-04-04', '2026-04-18', NULL, 'terlambat', 46000, 'Raka Adinata'),
('PMJ-2026-0019', 8, 10, '2026-04-06', '2026-04-20', '2026-04-19', 'dikembalikan', 0, 'Dewangga Putra'),
('PMJ-2026-0020', 9, 14, '2026-04-08', '2026-04-22', NULL, 'terlambat', 38000, 'Mira Safitri'),
('PMJ-2026-0021', 10, 16, '2026-04-10', '2026-04-24', '2026-04-23', 'dikembalikan', 0, 'Raka Adinata'),
('PMJ-2026-0022', 11, 21, '2026-04-12', '2026-04-26', NULL, 'terlambat', 30000, 'Dewangga Putra'),
('PMJ-2026-0023', 12, 24, '2026-04-14', '2026-04-28', '2026-04-28', 'dikembalikan', 0, 'Mira Safitri'),
('PMJ-2026-0024', 15, 4, '2026-04-18', '2026-05-02', NULL, 'terlambat', 18000, 'Raka Adinata'),
('PMJ-2026-0025', 1, 5, '2026-05-01', '2026-05-15', NULL, 'dipinjam', 0, 'Dewangga Putra'),
('PMJ-2026-0026', 2, 11, '2026-05-02', '2026-05-16', NULL, 'dipinjam', 0, 'Mira Safitri'),
('PMJ-2026-0027', 3, 17, '2026-05-03', '2026-05-17', NULL, 'dipinjam', 0, 'Raka Adinata'),
('PMJ-2026-0028', 4, 22, '2026-05-04', '2026-05-18', NULL, 'dipinjam', 0, 'Dewangga Putra'),
('PMJ-2026-0029', 6, 25, '2026-05-05', '2026-05-19', NULL, 'dipinjam', 0, 'Mira Safitri'),
('PMJ-2026-0030', 15, 1, '2026-05-06', '2026-05-20', NULL, 'dipinjam', 0, 'Raka Adinata');

CREATE INDEX idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX idx_buku_judul ON buku(judul_buku);
CREATE INDEX idx_peminjaman_tanggal ON peminjaman(tanggal_pinjam);
CREATE INDEX idx_peminjaman_status ON peminjaman(status_peminjaman);
