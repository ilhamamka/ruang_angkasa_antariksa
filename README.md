# 🚀 Kosmos Cilik Indonesia — Petualangan Edukasi Ruang Angkasa, Antariksa & Roket

Media edukasi interaktif anak usia sekolah dasar (SD/SMP) berbasis kurikulum sains antariksa modern (**Kurikulum Merdeka IPAS** & **NASA STEM Kids**). Dirancang dengan standar visual luxury cosmic, procedural Web Audio synthesizer tanpa ketergantungan aset luar, simulasi fisika roket, serta lembar kerja cetak & sertifikat resmi kelulusan astronot.

---

## 🌟 Fitur Utama & Modul Edukasi

### 1. 🪐 Dunia 1: Tata Surya & Planet-Planet (Solar System Orrery)
- **Model Tata Surya Interaktif 2D/3D-Feel**: Mengamati orbit elips Matahari dan 8 planet resmi + sabuk asteroid + Pluto dengan pengatur kecepatan orbit (Jeda, 1x, 2.5x, 6x).
- **Inspeksi Planet Mendalam**: Kartu interaktif diameter, jarak dari matahari dalam AU dan Juta km, durasi rotasi hari vs revolusi tahun, rasio gravitasi terhadap Bumi, suhu ekstrem, jumlah satelit alami, serta misi antariksa penjelajahnya.
- **Narasi Suara Dwibahasa (ID / EN)**: Didukung Web Speech API terintegrasi untuk mendengarkan fakta menarik tiap planet.

### 2. 🛠️ Dunia 2: Laboratorium Roket & Pangkalan Luncur (Rocket Lab & Launchpad)
- **Studio Perakitan Modular**: Rakit sendiri 4 bagian roket:
  - Kapsul awak / muatan sains (Apollo, Dragon, Satelit)
  - Tahap kedua / Modul layanan orbit (Vakum krio, panel surya)
  - Tangki propelan utama (Titan Falcon, Super Heavy)
  - Pendorong booster samping (Twin Boosters, Raptor multi-nozzle cluster)
- **Telemetri Fisika Nyata**: Menghitung massa total (Ton), gaya dorong (kN), dan Rasio Dorong terhadap Berat (*Thrust-to-Weight Ratio / TWR* > 1.2).
- **Simulasi Hitung Mundur & Peluncuran**:
  - Suara hitung mundur telemetri "T-Minus 10, 9, 8... 1, 0 -> LIFTOFF!".
  - Suara gemuruh semburan mesin roket (*procedural noise filter*).
  - Animasi menembus lapisan atmosfer: *Troposfer (0-12 km) $\to$ Stratosfer (12-50 km) $\to$ Mesosfer (50-85 km) $\to$ Eksosfer & Orbit Rendah Bumi (LEO 400 km)*.
  - Pelepasan booster roket (*Stage Separation*) dan perayaan pencapaian orbit bumi!

### 3. ✨ Dunia 3: Kosmos Dalam & Evolusi Bintang (Deep Space Explorer)
- **Siklus Hidup Bintang**: 6 fase evolusi bintang (*Nebula $\to$ Protobintang $\to$ Bintang Dewasa $\to$ Raksasa Merah $\to$ Supernova $\to$ Lubang Hitam / Bintang Neutron*).
- **Simulator Gravitasi Lubang Hitam**: Kanvas interaktif untuk mengamati pelengkungan gravitasi (*gravitational lensing*), cakram akresi berputar, dan partikel cahaya yang tersedot ke Horison Peristiwa (*Event Horizon*).
- **Eksplorasi Galaksi**: Galaksi Bima Sakti (Milky Way), Galaksi Andromeda, Aurora Kutub, dan Hujan Meteor.

### 4. ⚖️ Lab Bebas & Kalkulator Gravitasi Kosmik
- Masukkan berat badan anak di Bumi (misal 30 kg).
- Menghitung secara instan berat badan di Matahari, Merkurius, Venus, Bulan (5 kg!), Mars, Jupiter (70,8 kg!), Saturnus, dan Pluto.
- Tips kehidupan astronot di lingkungan mikrogravitasi (cara tidur di dinding, air melayang, olahraga harian, dan makanan tanpa remah).

### 5. 🧠 Kuis Misi Luar Angkasa
- 16+ soal kuis bertingkat dalam 3 tier (*Kadet Antariksa, Perwira Misi, Komandan Kosmik*).
- Umpan balik langsung dengan penjelasan ilmiah, efek suara, hadiah XP, dan perolehan bintang.

### 6. 📚 Ensiklopedia & Bagan Komparasi
- Tabel perbandingan komparatif 8 planet + Matahari (diameter, jarak AU, rotasi, revolusi, gravitasi, suhu, bulan).
- Spesifikasi roket antariksa legendaris dunia: Saturn V vs Space Shuttle vs Falcon 9 vs SLS vs Starship.

### 7. 🖨️ Lembar Kerja Cetak & Sertifikat Astronot Resmi
- Form input nama anak untuk mencetak **Sertifikat Kelulusan Misi Astronot Cilik Indonesia**.
- Lembar aktivitas tarik garis mencocokkan planet & labirin roket menuju Bulan.
- Dukungan penuh format cetak `@media print` rapi tanpa elemen UI web yang mengganggu.

### 8. 👨‍👩‍👧 Zona Pendamping Orang Tua & Guru
- Rapor capaian belajar anak (bintang, XP, planet yang dijelajahi, roket diluncurkan).
- 3 Eksperimen sains seru di rumah:
  1. Roket Balon Meluncur (Hukum III Newton)
  2. Kawah Meteorit Tepung & Cokelat Bubuk
  3. Fase Bulan Lezat dengan Biskuit Krim Cokelat
- Panduan pertanyaan pemantik diskusi kritis.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3 Vanilla murni (*Modern Cosmic Luxury Design System, Responsive & Mobile-friendly*).
- **Bahasa**: TypeScript (~5.6).
- **Bundler & Dev Server**: Vite (^6.0).
- **Audio Engine**: 100% Procedural Web Audio API Sound Synthesizer (*Zero external audio assets, zero latency, 100% offline*) + Web Speech API (ID & EN).
- **Visuals**: Procedural SVG Vector Art + HTML5 Canvas Starfield & Gravitational Simulation.
- **Version Control & Auto-Push**: Git post-commit hook & Node watcher script (`scripts/auto-push.mjs`).

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Masuk ke direktori
cd /Users/ilhamamka/eksperimen/digi_game/ruang_angkasa_antariksa

# 2. Jalankan server pengembang
npm run dev

# 3. Jalankan pengujian otomatis
npm test

# 4. Bangun versi produksi
npm run build
```

---

## 🔄 Fitur Auto-Push GitHub

Repositori ini telah dilengkapi dengan hook otomatis Git dan skrip pemantau:

```bash
# Push satu kali dengan pesan otomatis:
./scripts/auto-push.sh "feat: update pesan commit"

# Atau jalankan watcher pemantau file di latar belakang:
npm run auto-push
```
Setiap kali Anda melakukan commit lokal, hook `.git/hooks/post-commit` akan secara otomatis mengirimkan perubahan ke repositori GitHub `ilhamamka/ruang_angkasa_antariksa`.
