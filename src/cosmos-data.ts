// Curriculum Data: Deep Space, Stellar Lifecycle, Galaxies & Cosmic Mysteries
// Covers astrophysics basics for young space explorers (IPAS & NASA STEM)

export interface StellarStage {
  id: string;
  order: number;
  nameId: string;
  nameEn: string;
  duration: string;
  temperatureKelvin: string;
  descriptionId: string;
  descriptionEn: string;
  keyPhenomenonId: string;
  keyPhenomenonEn: string;
  colorScheme: string;
  svgIcon: string;
}

export interface CosmicEntity {
  id: string;
  category: 'galaxy' | 'phenomenon' | 'black_hole';
  nameId: string;
  nameEn: string;
  distanceFromEarth: string;
  summaryId: string;
  summaryEn: string;
  funFactId: string;
  funFactEn: string;
  svgVisual?: string;
}

export const STELLAR_LIFECYCLE: StellarStage[] = [
  {
    id: 'nebula',
    order: 1,
    nameId: 'Nebula (Kawah Lahir Bintang)',
    nameEn: 'Stellar Nursery / Nebula',
    duration: 'Jutaan Tahun',
    temperatureKelvin: '10 - 100 K (-263°C)',
    descriptionId: 'Awan raksasa yang terdiri dari gas hidrogen dan debu kosmik. Di bawah tarikan gravitasi perlahan, materi saling merapat membentuk gumpalan padat bakal bintang.',
    descriptionEn: 'Vast, glowing clouds of cold hydrogen gas and cosmic dust collapsing under mutual gravity to birth new stars.',
    keyPhenomenonId: 'Kondensasi gravitasi menghasilkan pilar-pilar penciptaan (Pillars of Creation) yang menakjubkan.',
    keyPhenomenonEn: 'Gravitational condensation forms magnificent towers like the Pillars of Creation.',
    colorScheme: 'linear-gradient(135deg, #7b1fa2, #e91e63, #00e5ff)',
    svgIcon: `<svg viewBox="0 0 100 100">
      <defs>
        <radialGradient id="nebGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff4081" opacity="0.9"/>
          <stop offset="50%" stop-color="#7c4dff" opacity="0.6"/>
          <stop offset="100%" stop-color="#00e5ff" opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#nebGrad)"/>
      <circle cx="42" cy="46" r="3" fill="#ffffff"/>
      <circle cx="58" cy="52" r="2.5" fill="#ffffff"/>
      <circle cx="50" cy="38" r="2" fill="#ffff00"/>
    </svg>`
  },
  {
    id: 'protostar',
    order: 2,
    nameId: 'Protobintang (Bayi Bintang)',
    nameEn: 'Protostar (Baby Star)',
    duration: '100.000 - 1 Juta Tahun',
    temperatureKelvin: '2.000 - 3.000 K',
    descriptionId: 'Inti gas yang semakin padat dan memanas. Belum terjadi fusi nuklir penuh, tetapi panas radiasi mulai memancar terang dari cakram akresi yang berputar.',
    descriptionEn: 'A growing dense core gathering matter from its surrounding accretion disc, glowing brighter as internal friction mounts.',
    keyPhenomenonId: 'Semburan jet partikel kosmik di kedua kutub protobintang.',
    keyPhenomenonEn: 'Energetic bipolar relativistic jets shooting from the poles.',
    colorScheme: 'linear-gradient(135deg, #ff5722, #ff9800, #ffeb3b)',
    svgIcon: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="28" fill="#ff6d00" stroke="#ffd600" stroke-width="2"/>
      <ellipse cx="50" cy="50" rx="44" ry="12" fill="none" stroke="#ffab00" stroke-width="2.5" opacity="0.7"/>
      <line x1="50" y1="8" x2="50" y2="92" stroke="#00e5ff" stroke-width="2" stroke-dasharray="3,3"/>
    </svg>`
  },
  {
    id: 'main_sequence',
    order: 3,
    nameId: 'Bintang Deret Utama (Dewasa)',
    nameEn: 'Main Sequence Star (Adult)',
    duration: '10 Miliar Tahun (seperti Matahari)',
    temperatureKelvin: '5.500 - 15.000 K',
    descriptionId: 'Masa kejayaan bintang paling stabil. Inti bintang membakar hidrogen menjadi helium melalui reaksi fusi nuklir. Keseimbangan hidrostatik menahan bintang tetap stabil.',
    descriptionEn: 'The longest, most peaceful phase where nuclear fusion converts hydrogen into helium, balancing gravity perfectly.',
    keyPhenomenonId: 'Keseimbangan sempurna antara tekanan radiasi fusi ke luar dan tarikan gravitasi ke dalam.',
    keyPhenomenonEn: 'Perfect equilibrium between outward thermal pressure and inward gravitational pull.',
    colorScheme: 'linear-gradient(135deg, #ffca28, #ffa000, #f57f17)',
    svgIcon: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="32" fill="#ffd54f" stroke="#ff8f00" stroke-width="3"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#fff9c4" stroke-width="1.5" stroke-dasharray="4,4"/>
    </svg>`
  },
  {
    id: 'red_giant',
    order: 4,
    nameId: 'Raksasa Merah (Masa Tua)',
    nameEn: 'Red Giant (Aging Phase)',
    duration: '100 Juta Tahun',
    temperatureKelvin: '3.000 - 4.000 K (permukaan)',
    descriptionId: 'Saat bahan bakar hidrogen di inti menipis, inti mengerut dan memanas, sedangkan lapisan luar mengembang ratusan kali lipat menjadi bola raksasa berwarna merah membara.',
    descriptionEn: 'As hydrogen fuel depletes, the core contracts while outer atmospheric layers swell dramatically into a gigantic crimson bubble.',
    keyPhenomenonId: 'Ukuran bintang mengembang hingga mampu menelan planet-planet terdekatnya.',
    keyPhenomenonEn: 'The stellar envelope swells sufficiently to engulf inner planets.',
    colorScheme: 'linear-gradient(135deg, #d32f2f, #b71c1c, #ff5252)',
    svgIcon: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#d32f2f" stroke="#ff8a80" stroke-width="2" opacity="0.9"/>
      <circle cx="50" cy="50" r="16" fill="#ffebee" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'supernova',
    order: 5,
    nameId: 'Supernova (Ledakan Akbar)',
    nameEn: 'Supernova (Mega Explosion)',
    duration: 'Beberapa Minggu s/d Bulan',
    temperatureKelvin: '100 Miliar K',
    descriptionId: 'Untuk bintang bermassa raksasa, keruntuhan gravitasi mendadak memicu ledakan kosmik terdahsyat di alam semesta. Cahayanya bisa menerangi seluruh galaksi dan menyebarkan unsur emas, besi, dan kalsium!',
    descriptionEn: 'Cataclysmic core-collapse explosion outshining entire galaxies and dispersing heavy elements like gold, iron, and calcium across the cosmos.',
    keyPhenomenonId: 'Semua unsur di dalam tubuh kita (besi dalam darah, kalsium tulang) dibuat di dalam ledakan bintang purba!',
    keyPhenomenonEn: 'All heavy elements in our bodies (calcium in bones, iron in blood) were forged in ancient supernova explosions!',
    colorScheme: 'linear-gradient(135deg, #ff1744, #ffea00, #00e5ff)',
    svgIcon: `<svg viewBox="0 0 100 100">
      <!-- Exploding star rays -->
      <polygon points="50,4 58,36 94,50 58,64 50,96 42,64 6,50 42,36" fill="#ffea00" stroke="#ff1744" stroke-width="2"/>
      <circle cx="50" cy="50" r="14" fill="#ffffff"/>
    </svg>`
  },
  {
    id: 'black_hole_or_neutron',
    order: 6,
    nameId: 'Lubang Hitam / Bintang Neutron',
    nameEn: 'Black Hole or Neutron Star',
    duration: 'Abadi / Miliaran Tahun',
    temperatureKelvin: 'Mendekati 0 K mutlak (lubang hitam)',
    descriptionId: 'Sisa inti padat pasca-supernova. Jika massanya sangat ekstrem, gravitasi meremukkan materi hingga menjadi Lubang Hitam (Black Hole) di mana gravitasi begitu kuat sehingga cahaya pun tidak bisa lepas!',
    descriptionEn: 'The stellar remnant. Ultra-massive cores collapse infinitely into a Black Hole where escape velocity exceeds light itself!',
    keyPhenomenonId: 'Horison Peristiwa (Event Horizon) adalah batas di mana waktu melambat dan tidak ada materi yang dapat kembali.',
    keyPhenomenonEn: 'The Event Horizon marks the point of no return where light and matter are permanently captured.',
    colorScheme: 'linear-gradient(135deg, #000000, #311b92, #00e5ff)',
    svgIcon: `<svg viewBox="0 0 100 100">
      <!-- Accretion disk glow -->
      <ellipse cx="50" cy="50" rx="44" ry="16" fill="none" stroke="#ffab00" stroke-width="4" opacity="0.8"/>
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.9"/>
      <!-- Pure black event horizon -->
      <circle cx="50" cy="50" r="18" fill="#000000" stroke="#ffffff" stroke-width="1"/>
    </svg>`
  }
];

export const COSMIC_ENTITIES: CosmicEntity[] = [
  {
    id: 'milkyway',
    category: 'galaxy',
    nameId: 'Galaksi Bima Sakti',
    nameEn: 'The Milky Way Galaxy',
    distanceFromEarth: 'Kita berada di dalamnya!',
    summaryId: 'Galaksi spiral raksasa rumah bagi Tata Surya kita. Berdiameter sekitar 100.000 tahun cahaya dan menampung lebih dari 100 hingga 400 miliar bintang!',
    summaryEn: 'The majestic spiral galaxy that is home to our solar system, containing 100 to 400 billion stars and our Sun.',
    funFactId: 'Di pusat Galaksi Bima Sakti bersemayam lubang hitam supermasif raksasa bernama Sagittarius A*!',
    funFactEn: 'At the heart of the Milky Way lurks a supermassive black hole named Sagittarius A*!'
  },
  {
    id: 'andromeda',
    category: 'galaxy',
    nameId: 'Galaksi Andromeda (M31)',
    nameEn: 'Andromeda Galaxy (M31)',
    distanceFromEarth: '2,5 Juta Tahun Cahaya',
    summaryId: 'Galaksi spiral tetangga terdekat kita. Pada malam yang sangat gelap dan cerah tanpa polusi cahaya, Andromeda dapat dilihat dengan mata telanjang sebagai kabut lonjong lembut.',
    summaryEn: 'Our nearest major spiral galactic neighbor, visible to the naked eye under dark pristine night skies.',
    funFactId: 'Dalam waktu sekitar 4,5 miliar tahun ke depan, Galaksi Bima Sakti dan Galaksi Andromeda diprediksi akan bergabung menjadi satu galaksi raksasa baru bernama "Milkomeda"!',
    funFactEn: 'In about 4.5 billion years, the Milky Way and Andromeda will gently collide and merge into a super galaxy called Milkomeda!'
  },
  {
    id: 'aurora',
    category: 'phenomenon',
    nameId: 'Aurora Tirai Cahaya Kutub',
    nameEn: 'Aurora Borealis & Australis',
    distanceFromEarth: '100 - 300 km (Atmosfer Bumi)',
    summaryId: 'Pertunjukan tirai cahaya hijau, ungu, dan merah menari di langit kutub, terjadi ketika angin partikel bermuatan dari Matahari bertabrakan dengan gas di atmosfer Bumi.',
    summaryEn: 'A magical natural light show in polar skies created when high-energy solar wind particles collide with atmospheric gas molecules.',
    funFactId: 'Warna hijau aurora dihasilkan oleh gas oksigen pada ketinggian sekitar 100 km, sedangkan warna merah muda dan ungu dihasilkan oleh molekul nitrogen!',
    funFactEn: 'Oxygen generates shimmering greens at 100km altitude, while nitrogen emits vivid purples and pinks!'
  },
  {
    id: 'meteorshower',
    category: 'phenomenon',
    nameId: 'Hujan Meteor (Bintang Jatuh)',
    nameEn: 'Meteor Shower',
    distanceFromEarth: '80 km di atas permukaan tanah',
    summaryId: 'Bintang jatuh sesungguhnya adalah serpihan debu batu antariksa (meteoroid) yang meluncur masuk atmosfer Bumi dengan kecepatan kilat hingga terbakar menjadi garis cahaya terang.',
    summaryEn: 'Shooting stars are actually tiny cosmic pebbles burning up from friction as they streak through Earth\'s atmosphere at hypersonic speeds.',
    funFactId: 'Hujan meteor Perseid terjadi setiap bulan Agustus ketika Bumi melintasi jalur debu sisa Komet Swift-Tuttle!',
    funFactEn: 'The famous Perseid meteor shower dazzles every August when Earth sweeps through the orbital debris of Comet Swift-Tuttle!'
  }
];
