// Curriculum Data: Rocket Engineering, Propulsion Physics & Space Exploration Missions
// Covers Newton's Third Law, Rocket Anatomy, Staging, and Major Space Expeditions

export interface RocketPart {
  id: string;
  category: 'capsule' | 'upper_stage' | 'core_tank' | 'booster';
  nameId: string;
  nameEn: string;
  descriptionId: string;
  descriptionEn: string;
  thrustKn: number;
  weightKg: number;
  efficiencyRating: number; // 1-5
  color: string;
  svgSnippet: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  year: string;
  destinationId: string;
  destinationEn: string;
  agency: string;
  significanceId: string;
  significanceEn: string;
  heroIcon: string;
  funFactId: string;
  funFactEn: string;
}

export const ROCKET_PARTS: RocketPart[] = [
  // 1. Capsules & Payload Fairings
  {
    id: 'capsule_apollo',
    category: 'capsule',
    nameId: 'Kapsul Komando Apollo',
    nameEn: 'Apollo Command Module',
    descriptionId: 'Kapsul bertekanan tempat 3 astronot duduk, dilengkapi tameng panas ablasi untuk menembus atmosfer saat kembali ke Bumi.',
    descriptionEn: 'Pressurized crew capsule carrying astronauts, equipped with an ablative heat shield for atmospheric reentry.',
    thrustKn: 0,
    weightKg: 5800,
    efficiencyRating: 4,
    color: '#e0e0e0',
    svgSnippet: `<path d="M30 48 L42 12 L58 12 L70 48 Z" fill="#cfd8dc" stroke="#455a64" stroke-width="2"/>
      <ellipse cx="50" cy="12" rx="8" ry="3" fill="#90a4ae"/>
      <circle cx="50" cy="30" r="5" fill="#0288d1" stroke="#37474f" stroke-width="1.5"/>`
  },
  {
    id: 'capsule_crew',
    category: 'capsule',
    nameId: 'Kapsul Modern Dragon Cilik',
    nameEn: 'Modern Crew Capsule',
    descriptionId: 'Kapsul berteknologi layar sentuh modern dengan sistem pembatalan darurat (launch abort) otomatis dan parasut laut.',
    descriptionEn: 'High-tech modern crew vessel featuring autonomous touchscreen avionics and advanced abort thrusters.',
    thrustKn: 0,
    weightKg: 4600,
    efficiencyRating: 5,
    color: '#ffffff',
    svgSnippet: `<path d="M28 48 C34 26, 44 10, 50 8 C56 10, 66 26, 72 48 Z" fill="#f5f5f5" stroke="#212121" stroke-width="2"/>
      <rect x="42" y="24" width="16" height="8" rx="2" fill="#212121"/>
      <line x1="42" y1="28" x2="58" y2="28" stroke="#00e5ff" stroke-width="2"/>`
  },
  {
    id: 'capsule_satellite',
    category: 'capsule',
    nameId: 'Kapsul Satelit Riset Kosmik',
    nameEn: 'Science Satellite Fairing',
    descriptionId: 'Selubung pelindung aerodinamis (payload fairing) yang akan membuka di orbit untuk melepaskan satelit pemantau Bumi.',
    descriptionEn: 'Protective aerodynamic clamshell fairing that splits open in orbit to deploy scientific satellites.',
    thrustKn: 0,
    weightKg: 2800,
    efficiencyRating: 5,
    color: '#eceff1',
    svgSnippet: `<path d="M26 48 L40 10 Q50 6 60 10 L74 48 Z" fill="#e0e0e0" stroke="#37474f" stroke-width="2"/>
      <line x1="50" y1="8" x2="50" y2="48" stroke="#78909c" stroke-width="1.5" stroke-dasharray="3,3"/>
      <circle cx="50" cy="32" r="6" fill="#ffd700" stroke="#ff6f00" stroke-width="1.5"/>`
  },

  // 2. Upper Stages
  {
    id: 'upper_service',
    category: 'upper_stage',
    nameId: 'Modul Layanan & Orbit (Tahap 2)',
    nameEn: 'Orbital Service Stage',
    descriptionId: 'Menyediakan tenaga listrik panel surya dan mesin pendorong vakum untuk bermanuver di luar angkasa hampa udara.',
    descriptionEn: 'Provides solar power and vacuum engines for precision maneuvers in the airless void of space.',
    thrustKn: 120,
    weightKg: 4200,
    efficiencyRating: 5,
    color: '#b0bec5',
    svgSnippet: `<rect x="32" y="8" width="36" height="34" rx="2" fill="#b0bec5" stroke="#37474f" stroke-width="2"/>
      <line x1="12" y1="25" x2="32" y2="25" stroke="#1565c0" stroke-width="4"/>
      <line x1="68" y1="25" x2="88" y2="25" stroke="#1565c0" stroke-width="4"/>
      <rect x="8" y="16" width="24" height="18" fill="#1e88e5" stroke="#0d47a1" stroke-width="1"/>
      <rect x="68" y="16" width="24" height="18" fill="#1e88e5" stroke="#0d47a1" stroke-width="1"/>`
  },
  {
    id: 'upper_krio',
    category: 'upper_stage',
    nameId: 'Tahap 2 Pendorong Krio Hidrogen',
    nameEn: 'Cryogenic Upper Stage',
    descriptionId: 'Menggunakan campuran super dingin hidrogen cair & oksigen cair, menghasilkan efisiensi dorongan spesifik tertinggi.',
    descriptionEn: 'Burns ultra-cold liquid hydrogen and liquid oxygen for supreme vacuum propulsion efficiency.',
    thrustKn: 240,
    weightKg: 6500,
    efficiencyRating: 4,
    color: '#cfd8dc',
    svgSnippet: `<rect x="30" y="8" width="40" height="34" rx="2" fill="#cfd8dc" stroke="#263238" stroke-width="2"/>
      <rect x="36" y="14" width="28" height="12" rx="2" fill="#00e5ff" opacity="0.4"/>
      <path d="M42 42 L58 42 L54 50 L46 50 Z" fill="#455a64" stroke="#263238" stroke-width="1.5"/>`
  },

  // 3. Core Tanks
  {
    id: 'core_titanium',
    category: 'core_tank',
    nameId: 'Tangki Utama Titan Falcon',
    nameEn: 'Titanium Core Fuel Tank',
    descriptionId: 'Tangki badan utama roket bertekanan tinggi berisi ratusan ton bahan bakar propelan cair untuk menembus tarikan gravitasi Bumi.',
    descriptionEn: 'High-pressure core fuel body holding hundreds of tons of propellant to break Earth\'s gravity grasp.',
    thrustKn: 850,
    weightKg: 22000,
    efficiencyRating: 5,
    color: '#ffffff',
    svgSnippet: `<rect x="28" y="6" width="44" height="60" rx="3" fill="#ffffff" stroke="#212121" stroke-width="2.5"/>
      <rect x="44" y="14" width="12" height="42" fill="#e0e0e0" opacity="0.6"/>
      <text x="50" y="40" font-size="7" font-weight="900" fill="#d32f2f" text-anchor="middle">INDONESIA</text>`
  },
  {
    id: 'core_saturn',
    nameId: 'Tangki Raksasa Super Heavy',
    nameEn: 'Super Heavy Mega Tank',
    category: 'core_tank',
    descriptionId: 'Badan tangki raksasa dengan lapisan baja tahan karat (stainless steel) yang tahan panas tinggi dan dapat digunakan berulang kali.',
    descriptionEn: 'Giant reusable stainless steel hull engineered to withstand blistering aerodynamic reentry friction.',
    thrustKn: 1250,
    weightKg: 35000,
    efficiencyRating: 4,
    color: '#b0bec5',
    svgSnippet: `<rect x="26" y="6" width="48" height="60" rx="4" fill="#b0bec5" stroke="#37474f" stroke-width="2.5"/>
      <line x1="26" y1="26" x2="74" y2="26" stroke="#546e7a" stroke-width="1.5"/>
      <line x1="26" y1="46" x2="74" y2="46" stroke="#546e7a" stroke-width="1.5"/>
      <polygon points="26,60 18,66 26,66" fill="#455a64" stroke="#263238" stroke-width="1.5"/>
      <polygon points="74,60 82,66 74,66" fill="#455a64" stroke="#263238" stroke-width="1.5"/>`
  },

  // 4. Boosters & Engines
  {
    id: 'booster_twin',
    category: 'booster',
    nameId: 'Pendorong Samping Kembar (Dual Booster)',
    nameEn: 'Dual Side Rocket Boosters',
    descriptionId: 'Dua roket pendorong di samping yang memberikan dorongan dahsyat saat detik-detik awal lepas landas (Liftoff).',
    descriptionEn: 'Twin side rocket boosters delivering immense liftoff thrust during initial ascent through the dense atmosphere.',
    thrustKn: 3200,
    weightKg: 18000,
    efficiencyRating: 5,
    color: '#ff7043',
    svgSnippet: `<path d="M12 25 L22 10 L26 25 L26 68 L12 68 Z" fill="#ff7043" stroke="#d84315" stroke-width="2"/>
      <path d="M88 25 L78 10 L74 25 L74 68 L88 68 Z" fill="#ff7043" stroke="#d84315" stroke-width="2"/>
      <polygon points="12,68 26,68 22,76 16,76" fill="#424242"/>
      <polygon points="74,68 88,68 84,76 78,76" fill="#424242"/>
      <!-- Main center nozzle -->
      <polygon points="40,55 60,55 65,70 35,70" fill="#37474f" stroke="#212121" stroke-width="2"/>`
  },
  {
    id: 'booster_cluster',
    category: 'booster',
    nameId: 'Klaster Mesin Multi-Nozel Raptor',
    nameEn: 'Multi-Nozzle Engine Cluster',
    descriptionId: 'Susunan nozel roket presisi tinggi dengan sistem vektor dorong hidrolik untuk mengendalikan arah terbang roket.',
    descriptionEn: 'Precision rocket engine cluster featuring gimbaled thrust vectoring to steer the spacecraft to orbit.',
    thrustKn: 4100,
    weightKg: 24000,
    efficiencyRating: 5,
    color: '#ff5722',
    svgSnippet: `<rect x="30" y="2" width="40" height="40" fill="#546e7a" stroke="#263238" stroke-width="2"/>
      <!-- Engine nozzles -->
      <polygon points="34,42 46,42 49,66 31,66" fill="#212121" stroke="#ff3d00" stroke-width="1.5"/>
      <polygon points="44,42 56,42 59,66 41,66" fill="#212121" stroke="#ff3d00" stroke-width="1.5"/>
      <polygon points="54,42 66,42 69,66 51,66" fill="#212121" stroke="#ff3d00" stroke-width="1.5"/>
      <!-- Aerodynamic fins -->
      <polygon points="30,30 14,46 30,46" fill="#ff3d00" stroke="#b71c1c" stroke-width="1.5"/>
      <polygon points="70,30 86,46 70,46" fill="#ff3d00" stroke="#b71c1c" stroke-width="1.5"/>`
  }
];

export const SPACE_MISSIONS: SpaceMission[] = [
  {
    id: 'apollo11',
    name: 'Apollo 11 (Pendaratan di Bulan)',
    year: '1969',
    destinationId: 'Bulan (Luna)',
    destinationEn: 'The Moon (Luna)',
    agency: 'NASA',
    significanceId: 'Langkah pertama manusia di permukaan benda langit lain. Neil Armstrong & Buzz Aldrin mendaratkan modul Eagle di Laut Ketenangan (Sea of Tranquility).',
    significanceEn: 'First human landing on another celestial body. Neil Armstrong and Buzz Aldrin stepped onto the Moon.',
    heroIcon: '🌕',
    funFactId: 'Jejak kaki para astronot di Bulan tidak akan terhapus selama jutaan tahun karena di Bulan tidak ada angin maupun hujan!',
    funFactEn: 'Astronaut footprints on the Moon will remain intact for millions of years because there is no wind or water erosion!'
  },
  {
    id: 'iss',
    name: 'Stasiun Luar Angkasa Internasional (ISS)',
    year: '1998 - Sekarang',
    destinationId: 'Orbit Rendah Bumi (400 km)',
    destinationEn: 'Low Earth Orbit (400 km)',
    agency: 'Kolaborasi Global (NASA, ESA, JAXA, CSA)',
    significanceId: 'Laboratorium sains terapung sebesar lapangan sepak bola. Berkeliling mengitari Bumi setiap 90 menit dengan kecepatan 28.000 km/jam!',
    significanceEn: 'A football-field sized floating science laboratory orbiting Earth every 90 minutes at 28,000 km/h!',
    heroIcon: '🛰️',
    funFactId: 'Para astronot di ISS melihat matahari terbit dan matahari terbenam sebanyak 16 kali setiap satu hari Bumi!',
    funFactEn: 'Astronauts aboard the ISS witness 16 sunrises and 16 sunsets every single Earth day!'
  },
  {
    id: 'perseverance',
    name: 'Mars Rover Perseverance & Ingenuity',
    year: '2020 - Sekarang',
    destinationId: 'Kawah Jezero, Mars',
    destinationEn: 'Jezero Crater, Mars',
    agency: 'NASA',
    significanceId: 'Robot laboratorium seukuran mobil mencari fosil mikroskopis purba di dasar danau kuno Mars, membawa helikopter pertama di planet lain.',
    significanceEn: 'Car-sized rover seeking ancient microbial fossils in an ancient lakebed, accompanied by Ingenuity, the first aircraft on another planet.',
    heroIcon: '🚜',
    funFactId: 'Helikopter mini Ingenuity berhasil terbang lebih dari 70 kali di atmosfer Mars yang sangat tipis!',
    funFactEn: 'Mini-helicopter Ingenuity achieved more than 70 autonomous flights in Mars\' ultra-thin atmosphere!'
  },
  {
    id: 'jwst',
    name: 'Teleskop Luar Angkasa James Webb (JWST)',
    year: '2021 - Sekarang',
    destinationId: 'Titik Lagrange L2 (1,5 Juta km)',
    destinationEn: 'Lagrange Point L2 (1.5M km)',
    agency: 'NASA, ESA, CSA',
    significanceId: 'Mata kosmik terbesar umat manusia dengan cermin heksagonal emas 6,5 meter, memotret cahaya galaksi pertama yang lahir setelah Big Bang.',
    significanceEn: 'Humanity\'s premier space observatory with a 6.5-meter gold mirror, capturing baby pictures of the earliest galaxies formed after the Big Bang.',
    heroIcon: '🔭',
    funFactId: 'Cermin James Webb dilapisi emas murni setipis seperseratus helai rambut manusia agar memantulkan sinar inframerah secara sempurna!',
    funFactEn: 'Webb\'s primary mirror is coated with pure gold 100 times thinner than a human hair to reflect faint infrared starlight!'
  },
  {
    id: 'voyager1',
    name: 'Voyager 1 (Penjelajah Antarbintang)',
    year: '1977 - Sekarang',
    destinationId: 'Ruang Antarbintang (Interstellar)',
    destinationEn: 'Interstellar Space',
    agency: 'NASA',
    significanceId: 'Benda buatan manusia terjauh dari Bumi. Telah keluar dari batas heliosfer tata surya membawa piringan emas (Golden Record) berisi salam damai Bumi.',
    significanceEn: 'The farthest human-made object from Earth, cruising interstellar space carrying a Golden Record of Earth greetings and songs.',
    heroIcon: '📡',
    funFactId: 'Sinyal radio dari Voyager 1 membutuhkan waktu lebih dari 22 jam dengan kecepatan cahaya untuk sampai kembali ke Bumi!',
    funFactEn: 'Radio signals from Voyager 1 take over 22 hours at the speed of light to reach Earth antenna stations!'
  }
];
