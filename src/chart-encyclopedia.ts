// Cosmic Encyclopedia & Comparative Planetary Data Matrix
// Comprehensive sortable comparison of planets, physical attributes & rocket specifications

import { CELESTIAL_BODIES } from './planets-data.ts';

export class SpaceEncyclopedia {
  private container: HTMLElement | null = null;

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  private render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="encyclopedia-view">
        <!-- Header Banner -->
        <div class="encyclopedia-header">
          <h2>📚 Bagan & Ensiklopedia Komparasi Tata Surya</h2>
          <p>Bandingkan data fisik antar-planet: ukuran diameter, jarak dari matahari, durasi hari, dan suhu ekstrem.</p>
        </div>

        <!-- Section 1: Planet Comparison Table -->
        <div class="table-card">
          <h3>🪐 Matriks Komparasi 8 Planet Resmi & Matahari</h3>
          <div class="table-responsive">
            <table class="cosmic-table">
              <thead>
                <tr>
                  <th>Objek Langit</th>
                  <th>Kategori</th>
                  <th>Diameter</th>
                  <th>Jarak dr Matahari</th>
                  <th>1 Hari (Rotasi)</th>
                  <th>1 Tahun (Revolusi)</th>
                  <th>Gravitasi</th>
                  <th>Suhu Rata-rata</th>
                  <th>Bulan</th>
                </tr>
              </thead>
              <tbody>
                ${CELESTIAL_BODIES.map(p => `
                  <tr>
                    <td class="cell-name">
                      <span class="cell-color-dot" style="background:${p.primaryColor};"></span>
                      <strong>${p.nameId}</strong>
                    </td>
                    <td><span class="badge-tag">${p.categoryLabelId}</span></td>
                    <td>${p.diameterKm.toLocaleString('id-ID')} km</td>
                    <td>${p.distanceFromSunAu} AU</td>
                    <td>${p.rotationPeriod}</td>
                    <td>${p.orbitalPeriod}</td>
                    <td>${p.gravityRatio}x Bumi</td>
                    <td>${p.avgTempCelsius}°C</td>
                    <td>${p.moonsCount}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Rocket Comparison Matrix -->
        <div class="table-card">
          <h3>🚀 Komparasi Roket Penjelajah Angkasa Dunia</h3>
          <div class="table-responsive">
            <table class="cosmic-table">
              <thead>
                <tr>
                  <th>Nama Roket</th>
                  <th>Tinggi</th>
                  <th>Daya Dorong (Thrust)</th>
                  <th>Kapasitas Muatan (LEO)</th>
                  <th>Status & Misi Utama</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Saturn V (Apollo)</strong></td>
                  <td>110 meter</td>
                  <td>34.500 kN</td>
                  <td>140 Ton</td>
                  <td>Membawa astronot Apollo 11 mendarat di Bulan (1969 - 1973)</td>
                </tr>
                <tr>
                  <td><strong>Space Shuttle (Pesawat Ulang Alik)</strong></td>
                  <td>56 meter</td>
                  <td>30.160 kN</td>
                  <td>27,5 Ton</td>
                  <td>Membangun Stasiun Luar Angkasa ISS & Memperbaiki Hubble</td>
                </tr>
                <tr>
                  <td><strong>Falcon 9 (SpaceX)</strong></td>
                  <td>70 meter</td>
                  <td>7.607 kN</td>
                  <td>22,8 Ton</td>
                  <td>Roket modern yang dapat mendarat kembali dan dipakai berulang kali</td>
                </tr>
                <tr>
                  <td><strong>Space Launch System / SLS (NASA)</strong></td>
                  <td>98 meter</td>
                  <td>39.100 kN</td>
                  <td>95 Ton</td>
                  <td>Misi Artemis kembali ke Bulan dan persiapan menuju Mars</td>
                </tr>
                <tr>
                  <td><strong>Starship & Super Heavy</strong></td>
                  <td>121 meter</td>
                  <td>74.000 kN</td>
                  <td>150 Ton (Reusable)</td>
                  <td>Wahana raksasa masa depan untuk koloni manusia di Bulan & Mars</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
}

export const spaceEncyclopedia = new SpaceEncyclopedia();
