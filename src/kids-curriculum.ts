// Early Childhood Space Science Pedagogical Curriculum & Concrete Analogies Dataset
// Designed for Pre-K, Kindergarten & Early Elementary (Ages 4-9)
// Enactive, Iconic, and Friendly Bruner/Piaget Scaffolding

export interface FruitScaleAnalogy {
  planetId: string;
  planetName: string;
  fruitEmoji: string;
  fruitName: string;
  fruitComparison: string;
  funFactKid: string;
  voiceScript: string;
}

export interface KidLearningStage {
  stageNumber: number;
  titleId: string;
  subtitleId: string;
  icon: string;
  badgeId: string;
  lessons: Array<{
    id: string;
    title: string;
    emoji: string;
    conceptKid: string;
    analogyKid: string;
    voiceStory: string;
    questionKid: string;
    optionsKid: string[];
    correctKidIdx: number;
    praiseKid: string;
  }>;
}

export const KID_FRUIT_ANALOGIES: FruitScaleAnalogy[] = [
  {
    planetId: 'sun',
    planetName: 'Matahari',
    fruitEmoji: '🏖️',
    fruitName: 'Bola Pantai Raksasa',
    fruitComparison: 'Jika seluruh tata surya adalah meja piknik, Matahari sebesar bola pantai raksasa yang sangat terang dan hangat!',
    funFactKid: 'Matahari itu seperti lampu raksasa di langit yang menyinari kita siang hari dan menghangatkan seluruh tanaman!',
    voiceScript: 'Halo teman kecil! Matahari adalah bola api raksasa yang sangat ramah. Dia seperti lampu kamar raksasa yang menyinari Bumi agar kita bisa bermain di siang hari!'
  },
  {
    planetId: 'mercury',
    planetName: 'Merkurius',
    fruitEmoji: '🫘',
    fruitName: 'Biji Kacang Hijau',
    fruitComparison: 'Kecil sekali seperti sebutir biji kacang hijau kecil di samping bola pantai!',
    funFactKid: 'Merkurius berlari mengelilingi matahari paling kencang, seperti pelari cilik tercepat di dunia!',
    voiceScript: 'Aku Merkurius! Tubuhku kecil seperti biji kacang hijau. Aku berputar paling dekat dengan Matahari, jadi siang hariku sangat panas seperti wajan penggorengan!'
  },
  {
    planetId: 'venus',
    planetName: 'Venus',
    fruitEmoji: '🍇',
    fruitName: 'Buah Anggur Kuning',
    fruitComparison: 'Ukurannya sebesar buah anggur manis yang dilapisi selimut awan tebal berwarna kuning.',
    funFactKid: 'Di Venus, udaranya panas sekali seperti di dalam oven kue Bunda yang sedang memanggang pizza!',
    voiceScript: 'Halo! Aku Venus, planet yang memakai selimut awan kuning tebal. Selimutku membuat tubuhku sangat panas, lebih panas dari oven pemanggang kue!'
  },
  {
    planetId: 'earth',
    planetName: 'Bumi & Bulan',
    fruitEmoji: '🍒',
    fruitName: 'Buah Ceri Biru Manis',
    fruitComparison: 'Bumi sebesar buah ceri kecil berwarna biru cantik, ditemani sebutir biji wijen kecil yaitu Bulan!',
    funFactKid: 'Bumi adalah rumah kita! Ada air laut untuk ikan berenang dan pohon hijau untuk kita bernapas segar.',
    voiceScript: 'Ini Bumi, rumah kita tercinta! Warnanya biru cantik karena penuh dengan air laut. Kita bisa bernapas, berlari di taman, dan bermain dengan teman-teman di sini!'
  },
  {
    planetId: 'mars',
    planetName: 'Mars',
    fruitEmoji: '🍓',
    fruitName: 'Buah Stroberi Merah',
    fruitComparison: 'Ukurannya seperti buah stroberi merah yang sedikit lebih kecil dari ceri Bumi.',
    funFactKid: 'Tanah di Mars berwarna merah seperti pasir pantai berwarna karat! Di sana ada robot penjelajah kecil beroda enam yang suka memotret batu.',
    voiceScript: 'Aku Mars si planet merah! Permukaanku berpasir merah ceria. Di sini ada robot lucu beroda enam bernama Curiosity yang sedang berjalan-jalan mencari jejak air!'
  },
  {
    planetId: 'jupiter',
    planetName: 'Jupiter',
    fruitEmoji: '🍉',
    fruitName: 'Buah Semangka Raksasa',
    fruitComparison: 'Raksasa terbesar! Sebesar buah semangka besar yang belang-belang bergaris indah!',
    funFactKid: 'Jupiter adalah kakak terbesar dari semua planet! Ada badai bintik merah besar yang berputar seperti gasing raksasa.',
    voiceScript: 'Waaah! Aku Jupiter, planet paling besar di tata surya! Ukuranku sebesar semangka raksasa. Semua planet lain bisa masuk ke dalam perutku lho!'
  },
  {
    planetId: 'saturn',
    planetName: 'Saturnus',
    fruitEmoji: '🍈',
    fruitName: 'Melon Bermahkota Piring',
    fruitComparison: 'Sebesar buah melon kuning yang memakai mahkota piring cincin es berkilau!',
    funFactKid: 'Cincin cantiknya terbuat dari miliaran serpihan es bening yang berkilauan saat terkena sinar matahari, mirip es serut manis!',
    voiceScript: 'Lihat cincinku yang indah! Aku Saturnus. Cincinku terbuat dari miliaran potongan es batu es serut yang menari mengelilingi tubuhku!'
  },
  {
    planetId: 'uranus',
    planetName: 'Uranus',
    fruitEmoji: '🍏',
    fruitName: 'Apel Hijau Dingin',
    fruitComparison: 'Sebesar buah apel hijau toska yang dingin dan suka berputar menggelinding seperti bola bowling!',
    funFactKid: 'Uranus planet yang sangat pemalas dan lucu: dia tidur miring sambil menggelinding di lintasannya!',
    voiceScript: 'Brrr, dingin sekali! Aku Uranus, raksasa es berwarna biru toska. Aku berputar menggelinding miring seperti bola yang menggelinding di lantai!'
  },
  {
    planetId: 'neptune',
    planetName: 'Neptunus',
    fruitEmoji: '🫐',
    fruitName: 'Buah Bluberi Biru Laut Beku',
    fruitComparison: 'Sebesar buah bluberi biru tua yang sangat dingin karena berada paling jauh dari Matahari.',
    funFactKid: 'Di Neptunus ada angin paling kencang di seluruh dunia, bisa meniup layang-layang melesat lebih cepat dari pesawat jet!',
    voiceScript: 'Aku Neptunus, planet yang paling jauh dari Matahari! Tubuhku biru samudra beku dan angin di sini bertiup sangat kencang seperti hembusan badai salju raksasa!'
  }
];

export const KID_LEARNING_STAGES: KidLearningStage[] = [
  // TAHAP 1
  {
    stageNumber: 1,
    titleId: 'Tahap 1: Teman Langit Kita',
    subtitleId: 'Mengenal Matahari, Rumah Kita Bumi, dan Sahabat Malam Bulan',
    icon: '☀️',
    badgeId: 'Sahabat Langit Cilik',
    lessons: [
      {
        id: 'l1_sun',
        title: 'Matahari Sang Lampu Raksasa',
        emoji: '☀️',
        conceptKid: 'Matahari adalah bintang yang sangat besar dan sangat hangat. Tanpa matahari, bumi kita akan gelap gulita dan dingin membeku.',
        analogyKid: 'Matahari itu seperti lampu tidur raksasa dan selimut hangat untuk seluruh bumi.',
        voiceStory: 'Matahari adalah bintang yang paling dekat dengan kita. Dia selalu bangun pagi untuk menyinari bumi, membuat bunga-bunga mekar dan memberi kita kehangatan untuk bermain!',
        questionKid: 'Kapan Matahari menyinari dan menghangatkan bumi kita?',
        optionsKid: ['A. Di siang hari saat kita bermain ☀️', 'B. Hanya di tengah malam saat kita tidur 🌙'],
        correctKidIdx: 0,
        praiseKid: 'Pintar sekali! Di siang hari Matahari menyinari kita agar terang benderang!'
      },
      {
        id: 'l1_earth',
        title: 'Bumi Tempat Kita Tinggal',
        emoji: '🌍',
        conceptKid: 'Bumi adalah planet satu-satunya yang punya udara segar untuk bernapas dan air bersih untuk minum dan berenang.',
        analogyKid: 'Bumi itu seperti rumah raksasa bertaman bunga dan berkolam renang luas tempat manusia dan hewan hidup bahagia.',
        voiceStory: 'Bumi adalah planet kita tercinta! Warnanya biru karena banyak lautan air yang jernih, dan hijau karena banyak pohon-pohon rindang.',
        questionKid: 'Kenapa planet Bumi terlihat berwarna biru dari luar angkasa?',
        optionsKid: ['A. Karena dilapisi cat biru', 'B. Karena sebagian besar permukaannya adalah air laut jernih 🌊'],
        correctKidIdx: 1,
        praiseKid: 'Hebat! Bumi kita penuh dengan air lautan biru yang indah!'
      },
      {
        id: 'l1_moon',
        title: 'Bulan Si Biskuit Malam',
        emoji: '🌙',
        conceptKid: 'Bulan tidak menghasilkan cahaya sendiri, dia hanya memantulkan cahaya matahari. Bentuknya tampak berganti dari bulan sabit melengkung hingga bulat purnama penuh.',
        analogyKid: 'Bulan itu seperti biskuit manis: kadang utuh bulat penuh, kadang dimakan sedikit jadi bulan separuh, kadang tinggal pinggirannya jadi bulan sabit!',
        voiceStory: 'Bulan adalah teman setia Bumi di malam hari. Bulan suka menyapa kita dengan senyuman sabit melengkung yang cantik di langit malam bertabur bintang.',
        questionKid: 'Bulan yang melengkung runcing seperti pisang atau senyuman disebut bulan apa ya?',
        optionsKid: ['A. Bulan Sabit 🌙', 'B. Bulan Segitiga 📐'],
        correctKidIdx: 0,
        praiseKid: 'Wah luar biasa! Itu adalah Bulan Sabit yang tersenyum di langit malam!'
      }
    ]
  },

  // TAHAP 2
  {
    stageNumber: 2,
    titleId: 'Tahap 2: Kereta 8 Planet Tata Surya',
    subtitleId: 'Hafalkan Urutan Planet dengan Lagu Ceria "Me-Ve-Bu-Ma-Ju-Sa-U-Ne"!',
    icon: '🚂',
    badgeId: 'Masinis Kereta Planet',
    lessons: [
      {
        id: 'l2_song',
        title: 'Jembatan Keledai Ceria 8 Planet',
        emoji: '🎵',
        conceptKid: 'Ada 8 planet yang berbaris rapi mengitari Matahari. Kita bisa menghafalnya dengan mudah lewat singkatan ceria: Me - Ve - Bu - Ma - Ju - Sa - U - Ne!',
        analogyKid: 'Seperti gerbong kereta api mini: gerbong terdepan dekat lokomotif (Matahari), gerbong paling belakang di ujung yang dingin.',
        voiceStory: 'Ayo nyanyikan bersama: Merkurius satu, Venus dua, Bumi tiga, Mars empat, Jupiter lima, Saturnus enam, Uranus tujuh, dan Neptunus delapan! Me-Ve-Bu-Ma-Ju-Sa-U-Ne!',
        questionKid: 'Planet manakah yang berada di urutan nomor SATU paling dekat dengan lokomotif Matahari?',
        optionsKid: ['A. Merkurius yang mungil 🫘', 'B. Jupiter yang raksasa 🍉'],
        correctKidIdx: 0,
        praiseKid: 'Tepat sekali! Merkurius adalah gerbong nomor satu terdekat dari Matahari!'
      },
      {
        id: 'l2_giants',
        title: 'Kakak Raksasa: Jupiter & Saturnus',
        emoji: '🪐',
        conceptKid: 'Planet di luar sabuk asteroid sangat besar dan terbuat dari gas! Jupiter punya badai merah raksasa, dan Saturnus punya mahkota cincin es berkilauan.',
        analogyKid: 'Jupiter itu kakak berbadan gempal, sedangkan Saturnus putri raja yang memakai mahkota perhiasan cincin es serut!',
        voiceStory: 'Jupiter dan Saturnus adalah dua raksasa yang sangat baik hati. Gravitasi besar mereka sering melindungi Bumi dari lemparan batu antariksa liar lho!',
        questionKid: 'Planet manakah yang memakai cincin es melingkar paling cantik di kepalanya?',
        optionsKid: ['A. Saturnus si raja cincin 🪐', 'B. Merkurius yang gundul 🪨'],
        correctKidIdx: 0,
        praiseKid: 'Benar sekali! Saturnus adalah planet dengan cincin es terindah di tata surya!'
      }
    ]
  },

  // TAHAP 3
  {
    stageNumber: 3,
    titleId: 'Tahap 3: Sekolah Astronot & Cara Terbang Roket',
    subtitleId: 'Belajar Rahasia Dorongan Roket Balon & Kehidupan Melayang di Antariksa',
    icon: '🚀',
    badgeId: 'Kadet Astronot Tangguh',
    lessons: [
      {
        id: 'l3_balloon_rocket',
        title: 'Kenapa Roket Bisa Terbang Tinggi?',
        emoji: '🎈',
        conceptKid: 'Roket bekerja persis seperti balon karet yang kita tiup kencang lalu kita lepas tanpa diikat: angin menyembur deras ke bawah, mendorong badan roket melompat tinggi ke langit!',
        analogyKid: 'Aksi semburan angin ke bawah = Reaksi roket melompat ke atas awan!',
        voiceStory: 'Pernahkah kamu meniup balon lalu melepasnya? Balon akan melesat terbang kencang! Nah, mesin roket juga membakar bahan bakar dan menyemburkan gas ke bawah agar roket bisa terbang ke antariksa!',
        questionKid: 'Saat roket menyemburkan api dan gas ke arah BAWAH, badan roket akan terdorong ke arah mana?',
        optionsKid: ['A. Melompat tinggi ke ATAS langit 🚀', 'B. Masuk tenggelam ke dalam tanah ⬇️'],
        correctKidIdx: 0,
        praiseKid: 'Hebat sekali! Gas mendorong ke bawah, roket melesat tinggi ke atas menuju bintang-bintang!'
      },
      {
        id: 'l3_suit',
        title: 'Baju Ajaib Astronot (Spacesuit)',
        emoji: '👨‍🚀',
        conceptKid: 'Di luar angkasa tidak ada udara untuk bernapas dan udaranya sangat dingin membeku atau sangat panas menyengat. Baju astronot membawa tabung udara sendiri dan pengatur suhu tubuh.',
        analogyKid: 'Baju astronot itu seperti rumah berjalan: ada AC pengatur udara dingin/hangat, ada tangki napas, dan helm berkaca emas anti silau!',
        voiceStory: 'Astronot memakai baju putih bertekanan lengkap dengan helm kaca pelindung. Kaca helmnya dilapisi sedikit emas murni tipis agar mata astronot tidak silau melihat cahaya matahari di angkasa!',
        questionKid: 'Apa fungsi tabung tas di punggung astronot?',
        optionsKid: ['A. Menyediakan udara oksigen untuk bernapas 🫁', 'B. Berisi mainan robot 🤖'],
        correctKidIdx: 0,
        praiseKid: 'Pintar! Tabung itu memberi udara segar agar astronot bisa bernapas lega di luar angkasa!'
      },
      {
        id: 'l3_zerog',
        title: 'Asyiknya Hidup Melayang Tanpa Gravitasi!',
        emoji: '🤸‍♂️',
        conceptKid: 'Di stasiun luar angkasa (ISS), tidak ada gravitasi yang menarik ke lantai, jadi astronot melayang-layang seperti burung terbang!',
        analogyKid: 'Tidur melayang di kantung dinding, dan minum air yang mengapung seperti gelembung sabun!',
        voiceStory: 'Di dalam pesawat stasiun antariksa, para astronot bisa berputar salto di udara tanpa takut jatuh! Air minum mereka tidak mengalir di gelas, melainkan membentuk bola-bola air yang bisa ditangkap melayang!',
        questionKid: 'Bagaimana cara astronot tidur di stasiun luar angkasa agar tidak melayang menabrak dinding saat terlelap?',
        optionsKid: ['A. Masuk ke dalam kantung tidur yang diikat ke dinding 🛏️', 'B. Tidur di atas pohon 🌳'],
        correctKidIdx: 0,
        praiseKid: 'Tepat sekali! Kantung tidur diikat ke dinding agar astronot tidur nyenyak tanpa melayang nabrak!'
      }
    ]
  },

  // TAHAP 4
  {
    stageNumber: 4,
    titleId: 'Tahap 4: Tantangan Bintang Juara Cilik',
    subtitleId: 'Uji Pengetahuanmu dan Dapatkan Sertifikat Kelulusan Resmi Astronot Cilik!',
    icon: '🏆',
    badgeId: 'Juara Penjelajah Kosmik Cilik',
    lessons: [
      {
        id: 'l4_scale_quiz',
        title: 'Tebak Ukuran Buah Planet',
        emoji: '🍉',
        conceptKid: 'Mengingat kembali ukuran-ukuran planet yang sudah kita pelajari lewat buah-buahan lezat!',
        analogyKid: 'Memilih buah yang tepat untuk planet yang ditanyakan.',
        voiceStory: 'Ayo kita uji ingatan cerdasmu! Siapakah planet yang ukurannya paling raksasa seperti semangka besar?',
        questionKid: 'Planet manakah yang sebesar semangka raksasa dan paling besar di tata surya kita?',
        optionsKid: ['A. Jupiter 🍉', 'B. Merkurius si biji kacang 🫘'],
        correctKidIdx: 0,
        praiseKid: 'Luar biasa! Jupiter adalah semangka raksasa terbesar di tata surya!'
      },
      {
        id: 'l4_mars_quiz',
        title: 'Planet Berpasir Merah',
        emoji: '🔴',
        conceptKid: 'Mengenali planet Mars tempat robot penjelajah cilik beroda enam sedang berjalan-jalan.',
        analogyKid: 'Planet berwarna stroberi merah!',
        voiceStory: 'Planet apakah yang tanahnya merah berkarat dan sering dikunjungi robot-robot kecil dari Bumi?',
        questionKid: 'Planet apakah yang terkenal dengan julukan si Planet Merah?',
        optionsKid: ['A. Planet Mars 🔴', 'B. Planet Neptunus Biru 🫐'],
        correctKidIdx: 0,
        praiseKid: 'Hebat! Mars adalah planet merah tempat robot cilik menjelajah!'
      }
    ]
  }
];

// Memory sequence order
export const PLANET_TRAIN_ORDER = [
  { id: 'sun', name: 'Matahari (Lokomotif)', emoji: '☀️', color: '#ffd54f' },
  { id: 'mercury', name: '1. Merkurius', emoji: '🫘', color: '#b0bec5' },
  { id: 'venus', name: '2. Venus', emoji: '🍇', color: '#ffb74d' },
  { id: 'earth', name: '3. Bumi', emoji: '🍒', color: '#00e5ff' },
  { id: 'mars', name: '4. Mars', emoji: '🍓', color: '#ff5252' },
  { id: 'jupiter', name: '5. Jupiter', emoji: '🍉', color: '#ff9800' },
  { id: 'saturn', name: '6. Saturnus', emoji: '🍈', color: '#ffd54f' },
  { id: 'uranus', name: '7. Uranus', emoji: '🍏', color: '#4dd0e1' },
  { id: 'neptune', name: '8. Neptunus', emoji: '🫐', color: '#3f51b5' }
];
