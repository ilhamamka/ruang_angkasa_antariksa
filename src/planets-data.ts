// Curriculum Data: Solar System & Planetary Science
// Covers complete elementary & middle school space science curriculum (IPAS Kurikulum Merdeka & International Space Literacy)

export interface CelestialBody {
  id: string;
  nameId: string;
  nameEn: string;
  category: 'star' | 'terrestrial' | 'asteroid' | 'gas_giant' | 'ice_giant' | 'dwarf' | 'comet';
  categoryLabelId: string;
  categoryLabelEn: string;
  diameterKm: number;
  distanceFromSunAu: number;
  distanceFromSunKmMillion: number;
  rotationPeriod: string;
  orbitalPeriod: string;
  gravityRatio: number; // relative to Earth (1.0)
  avgTempCelsius: number | string;
  moonsCount: number;
  primaryColor: string;
  accentColor: string;
  hasRings?: boolean;
  atmosphere: string;
  missions: string[];
  summaryId: string;
  summaryEn: string;
  funFactsId: string[];
  funFactsEn: string[];
  audioSpeechId: string;
  audioSpeechEn: string;
  svgVisual: string;
}

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: 'sun',
    nameId: 'Matahari',
    nameEn: 'The Sun',
    category: 'star',
    categoryLabelId: 'Bintang Induk',
    categoryLabelEn: 'Host Star',
    diameterKm: 1392700,
    distanceFromSunAu: 0,
    distanceFromSunKmMillion: 0,
    rotationPeriod: '27 hari (ekuador)',
    orbitalPeriod: '230 juta tahun (galaksi)',
    gravityRatio: 28.0,
    avgTempCelsius: 5500, // Surface ~5,500°C, core 15,000,000°C
    moonsCount: 0,
    primaryColor: '#ff9800',
    accentColor: '#ffe082',
    atmosphere: 'Hidrogen (73%) & Helium (25%)',
    missions: ['Parker Solar Probe', 'SOHO', 'Solar Orbiter'],
    summaryId: 'Matahari adalah bintang raksasa bercahaya di pusat tata surya kita. Gravitasi raksasanya mengikat semua planet, komet, dan asteroid agar tetap beredar di orbitnya.',
    summaryEn: 'The Sun is the luminous star at the heart of our solar system. Its colossal gravity holds all planets, asteroids, and comets in stable orbit.',
    funFactsId: [
      'Matahari begitu besar sehingga 1,3 juta planet Bumi bisa muat di dalamnya!',
      'Cahaya Matahari membutuhkan waktu sekitar 8 menit 20 detik untuk sampai ke Bumi.',
      'Suhu di inti Matahari mencapai 15 juta derajat Celsius!'
    ],
    funFactsEn: [
      'The Sun is so massive that about 1.3 million Earths could fit inside it!',
      'Sunlight takes approximately 8 minutes and 20 seconds to reach Earth.',
      'The core temperature of the Sun reaches an astonishing 15 million degrees Celsius!'
    ],
    audioSpeechId: 'Matahari adalah bintang induk pusat tata surya. Gravitasinya menjaga semua planet berputar mengelilinginya.',
    audioSpeechEn: 'The Sun is the host star of our solar system. Its gravity keeps all planets orbiting safely around it.',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff7c2" />
          <stop offset="40%" stop-color="#ffb300" />
          <stop offset="85%" stop-color="#ff6f00" />
          <stop offset="100%" stop-color="#e65100" />
        </radialGradient>
        <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="42" fill="#ff9800" opacity="0.3" filter="url(#sunGlow)" />
      <circle cx="50" cy="50" r="36" fill="url(#sunGrad)" />
      <!-- Solar flares -->
      <path d="M50 4 Q54 10 50 14" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M96 50 Q90 54 86 50" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M50 96 Q46 90 50 86" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M4 50 Q10 46 14 50" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </svg>`
  },
  {
    id: 'mercury',
    nameId: 'Merkurius',
    nameEn: 'Mercury',
    category: 'terrestrial',
    categoryLabelId: 'Planet Terestrial',
    categoryLabelEn: 'Terrestrial Planet',
    diameterKm: 4879,
    distanceFromSunAu: 0.39,
    distanceFromSunKmMillion: 57.9,
    rotationPeriod: '59 hari Bumi',
    orbitalPeriod: '88 hari Bumi',
    gravityRatio: 0.38,
    avgTempCelsius: '167°C (-180 s/d 430)',
    moonsCount: 0,
    primaryColor: '#8d8d8d',
    accentColor: '#cfd8dc',
    atmosphere: 'Nyaris hampa (Eksosfer tipis: Oksigen, Natrium, Helium)',
    missions: ['Mariner 10', 'MESSENGER', 'BepiColombo'],
    summaryId: 'Merkurius adalah planet terkecil dan terdekat dengan Matahari. Karena hampir tidak memiliki atmosfer pelindung, suhunya sangat ekstrem: membakar di siang hari dan beku menggigit di malam hari.',
    summaryEn: 'Mercury is the smallest and closest planet to the Sun. With virtually no atmosphere to trap heat, it experiences scorching days and freezing nights.',
    funFactsId: [
      'Satu tahun di Merkurius hanya berlangsung 88 hari, tercepat di seluruh tata surya!',
      'Permukaannya penuh dengan ribuan kawah tumbukan meteorit, mirip permukaan Bulan kita.',
      'Jika beratmu 30 kg di Bumi, di Merkurius beratmu hanya sekitar 11,4 kg!'
    ],
    funFactsEn: [
      'One year on Mercury takes only 88 Earth days, the fastest orbital lap in the solar system!',
      'Its cratered surface looks strikingly similar to our Moon.',
      'If you weigh 30 kg on Earth, you would weigh only 11.4 kg on Mercury!'
    ],
    audioSpeechId: 'Merkurius adalah planet terdekat dari Matahari dan mengelilinginya paling cepat!',
    audioSpeechEn: 'Mercury is the closest planet to the Sun and races around it faster than any other!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="mercuryGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#cfd8dc" />
          <stop offset="60%" stop-color="#78909c" />
          <stop offset="100%" stop-color="#37474f" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#mercuryGrad)" />
      <!-- Craters -->
      <circle cx="42" cy="40" r="6" fill="#455a64" opacity="0.6" />
      <circle cx="62" cy="55" r="8" fill="#455a64" opacity="0.6" />
      <circle cx="36" cy="65" r="4" fill="#37474f" opacity="0.7" />
      <circle cx="55" cy="30" r="3" fill="#37474f" opacity="0.5" />
    </svg>`
  },
  {
    id: 'venus',
    nameId: 'Venus',
    nameEn: 'Venus',
    category: 'terrestrial',
    categoryLabelId: 'Planet Terestrial',
    categoryLabelEn: 'Terrestrial Planet',
    diameterKm: 12104,
    distanceFromSunAu: 0.72,
    distanceFromSunKmMillion: 108.2,
    rotationPeriod: '243 hari Bumi (terbalik)',
    orbitalPeriod: '225 hari Bumi',
    gravityRatio: 0.91,
    avgTempCelsius: 464, // Hotter than Mercury!
    moonsCount: 0,
    primaryColor: '#e0a96d',
    accentColor: '#fff2df',
    atmosphere: 'Karbon Dioksida (96,5%) & Awan Asam Sulfat tebal',
    missions: ['Venera 7 (mendarat)', 'Magellan Radar', 'Akatsuki', 'DAVINCI+'],
    summaryId: 'Venus sering dijuluki "Bintang Kejora" atau kembaran Bumi karena ukurannya mirip. Namun, efek rumah kaca ekstrem membuat Venus menjadi planet paling panas di seluruh Tata Surya!',
    summaryEn: 'Venus is often called the Morning Star or Earth\'s twin due to similar size. However, runaway greenhouse effect makes it the hottest planet in our solar system!',
    funFactsId: [
      'Meskipun Merkurius lebih dekat ke Matahari, Venus lebih panas karena selimut gas rumah kacanya yang luar biasa tebal!',
      'Venus berputar terbalik (retrograde): Matahari terbit dari barat dan terbenam di timur!',
      'Satu hari di Venus (243 hari Bumi) lebih lama daripada satu tahunnya (225 hari Bumi)!'
    ],
    funFactsEn: [
      'Even though Mercury is closer to the Sun, Venus is hotter due to its thick greenhouse atmosphere!',
      'Venus rotates clockwise: the Sun rises in the west and sets in the east!',
      'A single day on Venus lasts longer than its entire year!'
    ],
    audioSpeechId: 'Venus adalah planet terpanas di tata surya dengan selimut awan tebal.',
    audioSpeechEn: 'Venus is the hottest planet in our solar system, shrouded in thick yellow clouds.',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="venusGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff3e0" />
          <stop offset="45%" stop-color="#ffb74d" />
          <stop offset="85%" stop-color="#e65100" />
          <stop offset="100%" stop-color="#bf360c" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="36" fill="url(#venusGrad)" />
      <!-- Atmospheric cloud swirl -->
      <path d="M22 40 Q50 32 78 44" stroke="#ffe0b2" stroke-width="4" fill="none" opacity="0.45" stroke-linecap="round"/>
      <path d="M20 54 Q50 64 80 50" stroke="#ffe0b2" stroke-width="4" fill="none" opacity="0.45" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'earth',
    nameId: 'Bumi & Bulan',
    nameEn: 'Earth & Moon',
    category: 'terrestrial',
    categoryLabelId: 'Planet Kehidupan',
    categoryLabelEn: 'Habitable World',
    diameterKm: 12742,
    distanceFromSunAu: 1.0,
    distanceFromSunKmMillion: 149.6,
    rotationPeriod: '24 jam (1 hari)',
    orbitalPeriod: '365,25 hari (1 tahun)',
    gravityRatio: 1.0,
    avgTempCelsius: 15, // Comfortably habitable
    moonsCount: 1, // Bulan (Luna)
    primaryColor: '#29b6f6',
    accentColor: '#66bb6a',
    atmosphere: 'Nitrogen (78%), Oksigen (21%), Argon & Uap Air',
    missions: ['Semua penerbangan antariksa manusia bermula dari sini!', 'ISS', 'Apollo 11'],
    summaryId: 'Bumi adalah satu-satunya rumah yang kita kenal memiliki air cair di permukaan dan mendukung jutaan spesies kehidupan. Dilengkapi medan magnet pelindung dan atmosfer beroksigen.',
    summaryEn: 'Earth is our home planet and the only known place in the universe harboring life, liquid water oceans, and a breathable oxygen atmosphere.',
    funFactsId: [
      'Sekitar 71% permukaan Bumi tertutup air laut, itulah mengapa Bumi tampak biru dari luar angkasa.',
      'Bumi memiliki satu satelit alami, yaitu Bulan, yang mengatur pasang surut air laut.',
      'Medan magnet Bumi melindungi kita dari radiasi angin matahari berbahaya.'
    ],
    funFactsEn: [
      'Over 71% of Earth\'s surface is covered by water, earning its nickname: The Blue Marble.',
      'Earth has one natural satellite, the Moon, which creates ocean tides.',
      'Earth\'s magnetic shield deflects harmful solar radiation.'
    ],
    audioSpeechId: 'Bumi adalah rumah kita tercinta, kaya akan air dan oksigen untuk kehidupan!',
    audioSpeechEn: 'Earth is our beautiful home world, bursting with life, blue oceans, and fresh air!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="earthOcean" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#4fc3f7" />
          <stop offset="60%" stop-color="#0288d1" />
          <stop offset="100%" stop-color="#01579b" />
        </radialGradient>
      </defs>
      <!-- Earth body -->
      <circle cx="46" cy="50" r="34" fill="url(#earthOcean)" />
      <!-- Continents -->
      <path d="M35 30 Q45 28 42 42 Q30 45 35 30 Z" fill="#66bb6a" opacity="0.9" />
      <path d="M50 40 Q62 38 65 52 Q52 65 48 55 Z" fill="#66bb6a" opacity="0.9" />
      <path d="M30 55 Q40 60 38 72 Q25 65 30 55 Z" fill="#66bb6a" opacity="0.9" />
      <!-- Swirling white clouds -->
      <path d="M22 45 Q40 38 65 44" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.75" stroke-linecap="round"/>
      <path d="M30 65 Q55 60 72 68" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.75" stroke-linecap="round"/>
      <!-- Orbiting Moon -->
      <circle cx="86" cy="30" r="8" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="0.5" />
      <circle cx="84" cy="28" r="1.5" fill="#bdbdbd" />
    </svg>`
  },
  {
    id: 'mars',
    nameId: 'Mars',
    nameEn: 'Mars',
    category: 'terrestrial',
    categoryLabelId: 'Planet Merah',
    categoryLabelEn: 'The Red Planet',
    diameterKm: 6779,
    distanceFromSunAu: 1.52,
    distanceFromSunKmMillion: 227.9,
    rotationPeriod: '24,6 jam (hampir mirip Bumi!)',
    orbitalPeriod: '687 hari Bumi',
    gravityRatio: 0.38,
    avgTempCelsius: -63, // Freezing desert (-140 s/d 20)
    moonsCount: 2, // Phobos & Deimos
    primaryColor: '#e53935',
    accentColor: '#ff8a80',
    atmosphere: 'Karbon Dioksida (95%), tipis bertekanan rendah',
    missions: ['Curiosity Rover', 'Perseverance & Ingenuity Helicopter', 'Viking 1 & 2', 'Hope Probe'],
    summaryId: 'Mars adalah planet berbatu merah karena permukaan tanahnya kaya oksida besi (karat). Memiliki gunung berapi terbesar dan ngarai terpanjang di tata surya.',
    summaryEn: 'Mars is known as the Red Planet due to iron oxide (rust) on its surface. It hosts the tallest volcano and deepest canyon in our planetary system.',
    funFactsId: [
      'Olympus Mons di Mars adalah gunung berapi tertinggi di tata surya, tingginya 3 kali lipat Gunung Everest!',
      'Mars memiliki 2 bulan kecil berbentuk kentang bernama Phobos dan Deimos.',
      'Robot penjelajah Curiosity dan helikopter robotik Ingenuity sedang mencari tanda air dan kehidupan masa lampau di Mars.'
    ],
    funFactsEn: [
      'Olympus Mons on Mars is the largest volcano in the solar system, three times taller than Mount Everest!',
      'Mars has two potato-shaped moons named Phobos and Deimos.',
      'NASA rovers Curiosity and Perseverance, along with Ingenuity helicopter, explore its dusty plains.'
    ],
    audioSpeechId: 'Mars adalah planet merah dengan gunung berapi tertinggi bernama Olympus Mons!',
    audioSpeechEn: 'Mars is the Red Planet, home to Olympus Mons, the tallest volcano in the solar system!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="marsGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ff8a65" />
          <stop offset="50%" stop-color="#d84315" />
          <stop offset="100%" stop-color="#870000" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#marsGrad)" />
      <!-- Polar Ice Cap -->
      <ellipse cx="50" cy="18" rx="12" ry="4" fill="#ffffff" opacity="0.8" />
      <!-- Surface rust markings & Valles Marineris canyon -->
      <path d="M25 50 Q45 55 75 48" stroke="#5d1000" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
      <circle cx="42" cy="38" r="4" fill="#bf360c" opacity="0.7" />
    </svg>`
  },
  {
    id: 'asteroids',
    nameId: 'Sabuk Asteroid & Ceres',
    nameEn: 'Asteroid Belt & Ceres',
    category: 'asteroid',
    categoryLabelId: 'Sabuk Batuan Kosmik',
    categoryLabelEn: 'Cosmic Rock Belt',
    diameterKm: 940, // Ceres diameter
    distanceFromSunAu: 2.77,
    distanceFromSunKmMillion: 414.0,
    rotationPeriod: '9 jam (Ceres)',
    orbitalPeriod: '4,6 tahun Bumi',
    gravityRatio: 0.03,
    avgTempCelsius: -105,
    moonsCount: 0,
    primaryColor: '#a1887f',
    accentColor: '#d7ccc8',
    atmosphere: 'Tidak ada (Hampa)',
    missions: ['Dawn (mengorbit Ceres & Vesta)', 'Lucy', 'Psyche'],
    summaryId: 'Sabuk Asteroid adalah cincin raksasa berisi jutaan bongkahan batu dan logam peninggalan pembentukan tata surya, terletak di antara orbit Mars dan Jupiter. Objek terbesarnya adalah planet katai Ceres.',
    summaryEn: 'The Asteroid Belt is a massive ring containing millions of rocky remnants between Mars and Jupiter. Its largest occupant is dwarf planet Ceres.',
    funFactsId: [
      'Ceres sangat unik karena mengandung mantel es air yang melimpah!',
      'Meskipun ada jutaan asteroid, jarak antar asteroid sangat berjauhan, tidak padat seperti di film fiksi ilmiah!',
      'Semua massa asteroid jika digabung masih lebih kecil daripada massa Bulan kita.'
    ],
    funFactsEn: [
      'Ceres contains a substantial mantle of water ice!',
      'Asteroids are actually millions of kilometers apart from each other!',
      'All asteroid mass combined is smaller than our Moon.'
    ],
    audioSpeechId: 'Sabuk Asteroid membatasi planet batuan dengan planet raksasa gas!',
    audioSpeechEn: 'The Asteroid Belt divides the rocky inner planets from the outer gas giants!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <!-- Ceres in center -->
      <circle cx="50" cy="50" r="22" fill="#8d6e63" stroke="#4e342e" stroke-width="1.5" />
      <circle cx="44" cy="44" r="4" fill="#5d4037" opacity="0.6" />
      <circle cx="58" cy="54" r="3" fill="#5d4037" opacity="0.6" />
      <!-- Scattered surrounding asteroids -->
      <circle cx="18" cy="30" r="5" fill="#a1887f" />
      <circle cx="82" cy="35" r="4" fill="#795548" />
      <circle cx="25" cy="72" r="6" fill="#8d6e63" />
      <circle cx="76" cy="68" r="5" fill="#a1887f" />
      <circle cx="48" cy="16" r="3" fill="#bcaaa4" />
      <circle cx="52" cy="84" r="3.5" fill="#bcaaa4" />
    </svg>`
  },
  {
    id: 'jupiter',
    nameId: 'Jupiter',
    nameEn: 'Jupiter',
    category: 'gas_giant',
    categoryLabelId: 'Raksasa Gas Terbesar',
    categoryLabelEn: 'Largest Gas Giant',
    diameterKm: 139820,
    distanceFromSunAu: 5.20,
    distanceFromSunKmMillion: 778.5,
    rotationPeriod: '9,9 jam (berputar tercepat!)',
    orbitalPeriod: '11,8 tahun Bumi',
    gravityRatio: 2.36,
    avgTempCelsius: -110,
    moonsCount: 95, // Moons including Ganymede, Europa, Io, Callisto
    primaryColor: '#ffb74d',
    accentColor: '#ffcc80',
    atmosphere: 'Hidrogen (90%) & Helium (10%)',
    missions: ['Juno', 'Galileo', 'Voyager 1 & 2', 'JUICE (menuju Europa)'],
    summaryId: 'Jupiter adalah raja para planet di Tata Surya. Besarnya lebih dari gabungan seluruh planet lainnya! Terkenal dengan badai raksasa merah (Great Red Spot) yang berputar selama berabad-abad.',
    summaryEn: 'Jupiter is the undisputed king of planets, bigger than all other planets combined! Famous for its centuries-old mega storm, the Great Red Spot.',
    funFactsId: [
      'Badai Bintik Merah Raksasa di Jupiter sangat luas hingga bisa menelan 1 sampai 2 planet Bumi sekaligus!',
      'Jupiter berputar sangat cepat: satu hari di sana hanya berlangsung kurang dari 10 jam!',
      'Satelit Jupiter bernama Ganymede adalah bulan terbesar di tata surya, bahkan lebih besar dari planet Merkurius!'
    ],
    funFactsEn: [
      'The Great Red Spot is a monstrous storm that could swallow the entire Earth!',
      'Jupiter spins so fast that a day lasts less than 10 Earth hours!',
      'Jupiter\'s moon Ganymede is the largest moon in the solar system, even bigger than Mercury!'
    ],
    audioSpeechId: 'Jupiter adalah planet terbesar di tata surya dengan badai bintik merah raksasa!',
    audioSpeechEn: 'Jupiter is the largest planet in our solar system, famous for its giant red storm!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="jupGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffe0b2" />
          <stop offset="40%" stop-color="#ffb74d" />
          <stop offset="80%" stop-color="#e65100" />
          <stop offset="100%" stop-color="#bf360c" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="url(#jupGrad)" />
      <!-- Atmospheric bands -->
      <path d="M12 38 Q50 44 88 38" stroke="#d84315" stroke-width="4.5" fill="none" opacity="0.6"/>
      <path d="M12 60 Q50 54 88 60" stroke="#8d6e63" stroke-width="4" fill="none" opacity="0.5"/>
      <path d="M14 48 Q50 52 86 48" stroke="#ffe0b2" stroke-width="2.5" fill="none" opacity="0.7"/>
      <!-- Great Red Spot -->
      <ellipse cx="68" cy="58" rx="8" ry="5" fill="#b71c1c" stroke="#ff8a80" stroke-width="1" />
    </svg>`
  },
  {
    id: 'saturn',
    nameId: 'Saturnus',
    nameEn: 'Saturn',
    category: 'gas_giant',
    categoryLabelId: 'Raksasa Cincin Megah',
    categoryLabelEn: 'Ringed Jewel',
    diameterKm: 116460,
    distanceFromSunAu: 9.58,
    distanceFromSunKmMillion: 1434.0,
    rotationPeriod: '10,7 jam',
    orbitalPeriod: '29,4 tahun Bumi',
    gravityRatio: 0.92,
    avgTempCelsius: -140,
    moonsCount: 146, // Most moons in solar system!
    primaryColor: '#fdd835',
    accentColor: '#fff59d',
    hasRings: true,
    atmosphere: 'Hidrogen (96%) & Helium (3%)',
    missions: ['Cassini-Huygens', 'Pioneer 11', 'Voyager 1 & 2'],
    summaryId: 'Saturnus adalah permata tata surya dengan sistem cincin es dan bebatuan paling spektakuler. Meskipun berukuran raksasa, massa jenis Saturnus sangat ringan hingga bisa mengapung di atas bak air raksasa!',
    summaryEn: 'Saturn is the crowned jewel of our solar system with dazzling icy rings. Despite its immense size, it has the lowest density of any planet and could float in water!',
    funFactsId: [
      'Cincin spektakuler Saturnus terbuat dari miliaran pecahan es air murni dan debu antariksa!',
      'Saturnus memiliki 146 bulan terkonfirmasi, menjadikannya planet dengan satelit terbanyak di tata surya!',
      'Satelit terbesarnya, Titan, memiliki danau dan sungai yang terisi cairan metana!'
    ],
    funFactsEn: [
      'Saturn\'s spectacular rings are made of billions of chunks of ice and rock!',
      'Saturn has 146 confirmed moons, the highest count of any planet!',
      'Its moon Titan has liquid methane lakes and a thick orange atmosphere!'
    ],
    audioSpeechId: 'Saturnus memiliki cincin es paling indah dan bulan terbanyak!',
    audioSpeechEn: 'Saturn boasts the most breathtaking icy rings and over one hundred moons!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="satGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fff9c4" />
          <stop offset="60%" stop-color="#fbc02d" />
          <stop offset="100%" stop-color="#f57f17" />
        </radialGradient>
      </defs>
      <!-- Back ring arc -->
      <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#ffe082" stroke-width="4.5" opacity="0.35" transform="rotate(-20 50 50)" />
      <!-- Planet body -->
      <circle cx="50" cy="50" r="28" fill="url(#satGrad)" />
      <!-- Atmospheric lines -->
      <path d="M24 48 Q50 54 76 48" stroke="#f57f17" stroke-width="2" fill="none" opacity="0.5"/>
      <!-- Front ring arc -->
      <path d="M6 50 A46 14 0 0 0 94 50" fill="none" stroke="#fff176" stroke-width="5" transform="rotate(-20 50 50)" opacity="0.9" />
      <path d="M12 50 A40 11 0 0 0 88 50" fill="none" stroke="#ffd54f" stroke-width="3" transform="rotate(-20 50 50)" opacity="0.8" />
    </svg>`
  },
  {
    id: 'uranus',
    nameId: 'Uranus',
    nameEn: 'Uranus',
    category: 'ice_giant',
    categoryLabelId: 'Raksasa Es Miring',
    categoryLabelEn: 'Tilted Ice Giant',
    diameterKm: 50724,
    distanceFromSunAu: 19.22,
    distanceFromSunKmMillion: 2871.0,
    rotationPeriod: '17,2 jam (berputar menggelinding)',
    orbitalPeriod: '84 tahun Bumi',
    gravityRatio: 0.89,
    avgTempCelsius: -195,
    moonsCount: 28,
    primaryColor: '#4dd0e1',
    accentColor: '#e0f7fa',
    hasRings: true,
    atmosphere: 'Hidrogen, Helium, dan Gas Metana (pemberi warna toska)',
    missions: ['Voyager 2 (satu-satunya wahana yang pernah mengunjunginya)'],
    summaryId: 'Uranus adalah raksasa es berwarna biru kehijauan yang unik karena sumbu rotasinya miring hingga 98 derajat, sehingga planet ini tampak berputar seperti bola menggelinding!',
    summaryEn: 'Uranus is an icy blue-green giant tilted by 98 degrees on its side, rolling like a bowling ball along its orbital highway around the Sun.',
    funFactsId: [
      'Karena kemiringan ekstremnya, masing-masing kutub Uranus mengalami siang hari selama 42 tahun dan malam selama 42 tahun!',
      'Warna biru toskanya berasal dari gas metana di atmosfer yang menyerap cahaya merah!',
      'Uranus memiliki 13 cincin tipis vertikal yang redup.'
    ],
    funFactsEn: [
      'Because of its extreme tilt, each pole gets 42 years of continuous sunlight followed by 42 years of darkness!',
      'Methane gas in its atmosphere absorbs red light, giving Uranus its cyan glow!',
      'Uranus has 13 faint vertical rings.'
    ],
    audioSpeechId: 'Uranus adalah raksasa es dingin yang berputar miring seperti bola!',
    audioSpeechEn: 'Uranus is an icy giant that spins on its side like a rolling bowling ball!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="uraGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#e0f7fa" />
          <stop offset="50%" stop-color="#4dd0e1" />
          <stop offset="100%" stop-color="#00838f" />
        </radialGradient>
      </defs>
      <!-- Vertical ring -->
      <ellipse cx="50" cy="50" rx="12" ry="42" fill="none" stroke="#b2ebf2" stroke-width="2" opacity="0.6" transform="rotate(10 50 50)" />
      <!-- Planet body -->
      <circle cx="50" cy="50" r="30" fill="url(#uraGrad)" />
      <path d="M22 50 Q50 48 78 50" stroke="#b2ebf2" stroke-width="1.5" fill="none" opacity="0.4"/>
    </svg>`
  },
  {
    id: 'neptune',
    nameId: 'Neptunus',
    nameEn: 'Neptune',
    category: 'ice_giant',
    categoryLabelId: 'Raksasa Es Badai Terjauh',
    categoryLabelEn: 'Farthest Ice Giant',
    diameterKm: 49244,
    distanceFromSunAu: 30.05,
    distanceFromSunKmMillion: 4495.0,
    rotationPeriod: '16,1 jam',
    orbitalPeriod: '164,8 tahun Bumi',
    gravityRatio: 1.14,
    avgTempCelsius: -201,
    moonsCount: 16,
    primaryColor: '#304ffe',
    accentColor: '#8c9eff',
    hasRings: true,
    atmosphere: 'Hidrogen, Helium, Metana beku, Amonia',
    missions: ['Voyager 2'],
    summaryId: 'Neptunus adalah planet kedelapan dan terjauh dari Matahari. Dikenal dengan warna biru samudra tua yang dalam dan badai angin supersonik paling dahsyat di seluruh tata surya.',
    summaryEn: 'Neptune is the eighth and farthest official planet from the Sun, boasting a deep sapphire color and the most supersonic winds in the entire solar system.',
    funFactsId: [
      'Angin di Neptunus bisa bertiup hingga lebih dari 2.100 km/jam, lebih cepat dari kecepatan suara di Bumi!',
      'Satelit terbesarnya, Triton, memiliki geyser es yang memuntahkan nitrogen beku ke angkasa!',
      'Neptunus butuh hampir 165 tahun Bumi hanya untuk menyelesaikan satu kali orbit mengelilingi Matahari!'
    ],
    funFactsEn: [
      'Winds on Neptune exceed 2,100 km/h, breaking the sound barrier!',
      'Its moon Triton features icy geysers spraying liquid nitrogen into space!',
      'Neptune takes almost 165 Earth years to complete just one single orbit around the Sun!'
    ],
    audioSpeechId: 'Neptunus adalah planet terjauh dengan angin tercepat di tata surya!',
    audioSpeechEn: 'Neptune is the farthest planet, swept by supersonic cosmic storms!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="nepGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#8c9eff" />
          <stop offset="50%" stop-color="#3d5afe" />
          <stop offset="100%" stop-color="#1a237e" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="url(#nepGrad)" />
      <!-- Great Dark Spot & Cloud streaks -->
      <ellipse cx="62" cy="45" rx="6" ry="4" fill="#0d47a1" opacity="0.8" />
      <path d="M24 38 Q50 34 74 40" stroke="#c5cae9" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
      <path d="M28 58 Q50 62 72 56" stroke="#c5cae9" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'pluto',
    nameId: 'Pluto & Sabuk Kuiper',
    nameEn: 'Pluto & Kuiper Belt',
    category: 'dwarf',
    categoryLabelId: 'Planet Kerdil',
    categoryLabelEn: 'Dwarf Planet',
    diameterKm: 2376,
    distanceFromSunAu: 39.48,
    distanceFromSunKmMillion: 5906.0,
    rotationPeriod: '6,4 hari Bumi',
    orbitalPeriod: '248 tahun Bumi',
    gravityRatio: 0.06,
    avgTempCelsius: -230,
    moonsCount: 5, // Charon, Nix, Hydra, Kerberos, Styx
    primaryColor: '#bcaaa4',
    accentColor: '#efebe9',
    atmosphere: 'Nitrogen beku tipis, Metana, Karbon Monoksida',
    missions: ['New Horizons (melintas dekat tahun 2015)'],
    summaryId: 'Pluto adalah planet kerdil terkenal di Sabuk Kuiper. Permukaannya dilapisi es nitrogen dan memiliki dataran es berbentuk hati raksasa bernama Tombaugh Regio.',
    summaryEn: 'Pluto is the beloved dwarf planet in the icy Kuiper Belt. It features glaciers of frozen nitrogen and a giant heart-shaped ice plain named Tombaugh Regio.',
    funFactsId: [
      'Pluto memiliki dataran es putih berbentuk lambang hati yang sangat indah di khatulistiwanya!',
      'Bulan terbesar Pluto bernama Charon berukuran sangat besar sehingga keduanya saling mengorbit seperti planet ganda.',
      'Pada tahun 2006, astronom mengelompokkan Pluto sebagai Planet Kerdil (Dwarf Planet) bersama Ceres dan Eris.'
    ],
    funFactsEn: [
      'Pluto features a bright, heart-shaped glacier named Tombaugh Regio!',
      'Its moon Charon is so large that Pluto and Charon orbit each other like a double planet.',
      'Pluto was reclassified as a Dwarf Planet in 2006 alongside Ceres and Eris.'
    ],
    audioSpeechId: 'Pluto adalah planet kerdil es dengan lembah berbentuk hati!',
    audioSpeechEn: 'Pluto is an icy dwarf world decorated with a famous heart-shaped glacier!',
    svgVisual: `<svg viewBox="0 0 100 100" class="planet-svg-art">
      <defs>
        <radialGradient id="plutoGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#d7ccc8" />
          <stop offset="50%" stop-color="#8d6e63" />
          <stop offset="100%" stop-color="#4e342e" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="26" fill="url(#plutoGrad)" />
      <!-- Tombaugh Regio (Heart shape) -->
      <path d="M44 48 C44 42, 52 42, 54 48 C56 42, 64 42, 64 48 C64 56, 54 62, 54 64 C54 62, 44 56, 44 48 Z" fill="#ffffff" opacity="0.85" />
    </svg>`
  }
];
