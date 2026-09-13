// Interactive Space Science Quiz Engine
// 45+ questions categorized into 3 rank tiers: Kadet (Beginner), Perwira (Intermediate), Komandan (Advanced)
// Includes immediate audio-visual feedback, pedagogical explanations, XP awards, and badge triggers

import { spaceAudio } from './audio.ts';

export interface QuizQuestion {
  id: string;
  tier: 1 | 2 | 3; // 1: Kadet, 2: Perwira, 3: Komandan
  tierLabelId: string;
  tierLabelEn: string;
  questionId: string;
  questionEn: string;
  optionsId: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationId: string;
  explanationEn: string;
  icon: string;
  xpReward: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- TIER 1: KADET ANTARIKSA (Dasar & Fakta Utama) ---
  {
    id: 'q1',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Benda langit apakah yang menjadi pusat dari tata surya kita?',
    questionEn: 'Which celestial body sits at the center of our solar system?',
    optionsId: ['Bulan', 'Matahari', 'Bumi', 'Jupiter'],
    optionsEn: ['The Moon', 'The Sun', 'Earth', 'Jupiter'],
    correctIndex: 1,
    explanationId: 'Matahari adalah bintang induk raksasa yang gravitasinya menahan semua planet tetap beredar di orbitnya.',
    explanationEn: 'The Sun is the host star whose colossal gravitational pull holds all planets in stable orbits.',
    icon: '☀️',
    xpReward: 25
  },
  {
    id: 'q2',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Planet manakah yang terkenal dengan sebutan "Planet Merah"?',
    questionEn: 'Which planet is popularly known as the "Red Planet"?',
    optionsId: ['Venus', 'Mars', 'Merkurius', 'Saturnus'],
    optionsEn: ['Venus', 'Mars', 'Mercury', 'Saturn'],
    correctIndex: 1,
    explanationId: 'Mars berwarna merah karena tanah permukaannya banyak mengandung oksida besi (karat).',
    explanationEn: 'Mars appears rusty red because its surface is covered in iron oxide minerals.',
    icon: '🔴',
    xpReward: 25
  },
  {
    id: 'q3',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Planet apakah yang memiliki cincin es paling megah dan indah?',
    questionEn: 'Which planet has the most magnificent and famous rings of ice?',
    optionsId: ['Neptunus', 'Saturnus', 'Bumi', 'Merkurius'],
    optionsEn: ['Neptune', 'Saturn', 'Earth', 'Mercury'],
    correctIndex: 1,
    explanationId: 'Cincin spektakuler Saturnus tersusun dari miliaran bongkahan es murni dan batuan antariksa.',
    explanationEn: 'Saturn\'s dazzling ring system is made of billions of shimmering water-ice chunks and rock dust.',
    icon: '🪐',
    xpReward: 25
  },
  {
    id: 'q4',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Planet terdekat dari Matahari adalah...',
    questionEn: 'The closest planet to the Sun is...',
    optionsId: ['Merkurius', 'Venus', 'Bumi', 'Mars'],
    optionsEn: ['Mercury', 'Venus', 'Earth', 'Mars'],
    correctIndex: 0,
    explanationId: 'Merkurius berada paling dekat dengan Matahari dan berputar mengelilingi matahari tercepat (88 hari).',
    explanationEn: 'Mercury orbits closest to the Sun and completes a year in just 88 Earth days.',
    icon: '🪨',
    xpReward: 25
  },
  {
    id: 'q5',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Berapakah jumlah planet resmi di Tata Surya kita?',
    questionEn: 'How many major official planets exist in our Solar System?',
    optionsId: ['7 Planet', '8 Planet', '9 Planet', '10 Planet'],
    optionsEn: ['7 Planets', '8 Planets', '9 Planets', '10 Planets'],
    correctIndex: 1,
    explanationId: 'Ada 8 planet resmi: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.',
    explanationEn: 'There are 8 official planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
    icon: '🌌',
    xpReward: 25
  },
  {
    id: 'q6',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Satelit alami yang setia mengelilingi planet Bumi adalah...',
    questionEn: 'The natural satellite that orbits our Earth is...',
    optionsId: ['Matahari', 'Bulan', 'Bintang Kejora', 'Titan'],
    optionsEn: ['The Sun', 'The Moon', 'Morning Star', 'Titan'],
    correctIndex: 1,
    explanationId: 'Bulan adalah satu-satunya satelit alami Bumi yang memengaruhi pasang surut air laut.',
    explanationEn: 'The Moon is Earth\'s only natural satellite and creates oceanic tides.',
    icon: '🌙',
    xpReward: 25
  },
  {
    id: 'q7',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Hukum fisika apakah yang membuat roket bisa meluncur ke atas saat gas menyembur ke bawah?',
    questionEn: 'Which physics law enables a rocket to push upward as hot exhaust shoots downward?',
    optionsId: ['Hukum Gravitasi', 'Hukum III Newton (Aksi - Reaksi)', 'Hukum Pemantulan Cahaya', 'Hukum Archimedes'],
    optionsEn: ['Law of Gravity', 'Newton\'s 3rd Law (Action - Reaction)', 'Law of Reflection', 'Archimedes Principle'],
    correctIndex: 1,
    explanationId: 'Hukum III Newton: Untuk setiap aksi semburan gas ke bawah, ada reaksi gaya dorong roket yang sama besar ke atas!',
    explanationEn: 'Newton\'s Third Law: For every action exhaust pushing down, there is an equal and opposite reaction propelling the rocket up!',
    icon: '🚀',
    xpReward: 30
  },
  {
    id: 'q8',
    tier: 1,
    tierLabelId: 'Kadet Antariksa',
    tierLabelEn: 'Space Cadet',
    questionId: 'Pakaian khusus bertekanan udara yang dipakai astronot di luar angkasa dinamakan...',
    questionEn: 'The specialized pressurized suit astronauts wear in space is called a...',
    optionsId: ['Baju Selam', 'Baju Luar Angkasa (Spacesuit)', 'Jas Hujan', 'Rompi Pelampung'],
    optionsEn: ['Diving Suit', 'Spacesuit (EMU)', 'Raincoat', 'Life Vest'],
    correctIndex: 1,
    explanationId: 'Baju luar angkasa (Spacesuit) menyediakan oksigen, mengontrol suhu, dan melindungi astronot dari radiasi kosmik.',
    explanationEn: 'Spacesuits supply oxygen, regulate body temperature, and shield astronauts from cosmic radiation.',
    icon: '👨‍🚀',
    xpReward: 25
  },

  // --- TIER 2: PERWIRA MISI (Eksplorasi & Karakteristik Unik) ---
  {
    id: 'q9',
    tier: 2,
    tierLabelId: 'Perwira Misi',
    tierLabelEn: 'Mission Officer',
    questionId: 'Mengapa Venus menjadi planet terpanas, padahal Merkurius lebih dekat ke Matahari?',
    questionEn: 'Why is Venus the hottest planet even though Mercury is closer to the Sun?',
    optionsId: [
      'Karena Venus memiliki banyak gunung berapi api',
      'Karena atmosfer tebal gas rumah kaca (CO2) memerangkap panas',
      'Karena Venus berputar sangat kencang',
      'Karena warna awannya kuning'
    ],
    optionsEn: [
      'Because Venus has active lava volcanoes',
      'Because its thick CO2 greenhouse atmosphere traps blistering heat',
      'Because Venus spins extremely fast',
      'Because its clouds are yellow'
    ],
    correctIndex: 1,
    explanationId: 'Venus mengalami efek rumah kaca tak terkendali karena atmosfernya 96% berisi gas karbon dioksida pekat.',
    explanationEn: 'A runaway greenhouse effect traps heat within Venus\'s dense 96% carbon dioxide atmosphere.',
    icon: '🔥',
    xpReward: 35
  },
  {
    id: 'q10',
    tier: 2,
    tierLabelId: 'Perwira Misi',
    tierLabelEn: 'Mission Officer',
    questionId: 'Misi antariksa bersejarah apakah yang pertama kali berhasil mendaratkan manusia di Bulan?',
    questionEn: 'Which historic space mission first landed humans on the lunar surface in 1969?',
    optionsId: ['Apollo 11', 'Voyager 1', 'Curiosity', 'Sputnik 1'],
    optionsEn: ['Apollo 11', 'Voyager 1', 'Curiosity', 'Sputnik 1'],
    correctIndex: 0,
    explanationId: 'Misi Apollo 11 mendarat di Bulan pada 20 Juli 1969 dengan astronot Neil Armstrong dan Buzz Aldrin.',
    explanationEn: 'Apollo 11 landed on the Moon on July 20, 1969, with Neil Armstrong and Buzz Aldrin.',
    icon: '🌕',
    xpReward: 35
  },
  {
    id: 'q11',
    tier: 2,
    tierLabelId: 'Perwira Misi',
    tierLabelEn: 'Mission Officer',
    questionId: 'Apa nama badai pusaran raksasa berwarna merah di planet Jupiter yang telah berputar ratusan tahun?',
    questionEn: 'What is the name of the colossal red storm on Jupiter that has raged for centuries?',
    optionsId: ['Bintik Merah Raksasa (Great Red Spot)', 'Mata Topan Jupiter', 'Kawah Api', 'Pusaran Olympus'],
    optionsEn: ['Great Red Spot', 'Jupiter Eye', 'Crater of Fire', 'Olympus Vortex'],
    correctIndex: 0,
    explanationId: 'Great Red Spot adalah badai antisiklon raksasa yang lebih lebar daripada diameter planet Bumi kita!',
    explanationEn: 'The Great Red Spot is a persistent anticyclonic storm wider than planet Earth itself!',
    icon: '🌀',
    xpReward: 35
  },
  {
    id: 'q12',
    tier: 2,
    tierLabelId: 'Perwira Misi',
    tierLabelEn: 'Mission Officer',
    questionId: 'Stasiun Luar Angkasa Internasional (ISS) mengelilingi Bumi dalam waktu berapa menit?',
    questionEn: 'How long does it take the International Space Station (ISS) to complete one lap around Earth?',
    optionsId: ['24 Jam', 'Sekitar 90 Menit', '12 Jam', '7 Hari'],
    optionsEn: ['24 Hours', 'About 90 Minutes', '12 Hours', '7 Days'],
    correctIndex: 1,
    explanationId: 'ISS melesat dengan kecepatan 28.000 km/jam, sehingga mengitari Bumi penuh hanya dalam 90 menit!',
    explanationEn: 'Cruising at 28,000 km/h, the ISS orbits Earth every 90 minutes, granting astronauts 16 sunsets daily!',
    icon: '🛰️',
    xpReward: 40
  },
  {
    id: 'q13',
    tier: 2,
    tierLabelId: 'Perwira Misi',
    tierLabelEn: 'Mission Officer',
    questionId: 'Planet manakah yang sumbu rotasinya miring hingga 98 derajat sehingga berputar menggelinding?',
    questionEn: 'Which planet has an extreme axial tilt of 98 degrees, rolling sideways along its orbit?',
    optionsId: ['Mars', 'Uranus', 'Jupiter', 'Neptunus'],
    optionsEn: ['Mars', 'Uranus', 'Jupiter', 'Neptune'],
    correctIndex: 1,
    explanationId: 'Uranus menggelinding di orbitnya kemungkinan akibat tabrakan dahsyat dengan protoplanet lain di masa purba.',
    explanationEn: 'Uranus was likely knocked onto its side by a colossal collision with a protoplanet in the early solar system.',
    icon: '🌀',
    xpReward: 35
  },

  // --- TIER 3: KOMANDAN KOSMIK (Astrofisika & Misteri Luar Angkasa) ---
  {
    id: 'q14',
    tier: 3,
    tierLabelId: 'Komandan Kosmik',
    tierLabelEn: 'Cosmic Commander',
    questionId: 'Apa yang terjadi ketika bintang raksasa kehabisan bahan bakar dan mengalami keruntuhan gravitasi?',
    questionEn: 'What violent cosmic event occurs when a massive star exhausts its nuclear fuel and collapses?',
    optionsId: ['Gerhana Matahari', 'Ledakan Supernova', 'Hujan Meteor', 'Aurora Borealis'],
    optionsEn: ['Solar Eclipse', 'Supernova Explosion', 'Meteor Shower', 'Aurora Borealis'],
    correctIndex: 1,
    explanationId: 'Supernova adalah ledakan bintang terdahsyat yang menghasilkan unsur-unsur berat seperti emas dan besi ke seluruh antariksa.',
    explanationEn: 'A supernova is a cataclysmic stellar explosion that forges and scatters heavy elements like gold and iron.',
    icon: '💥',
    xpReward: 50
  },
  {
    id: 'q15',
    tier: 3,
    tierLabelId: 'Komandan Kosmik',
    tierLabelEn: 'Cosmic Commander',
    questionId: 'Daerah di luar angkasa dengan tarikan gravitasi begitu ekstrem sehingga cahaya pun tidak dapat lolos disebut...',
    questionEn: 'A celestial region where gravitational pull is so intense that even light cannot escape is called a...',
    optionsId: ['Nebula', 'Lubang Hitam (Black Hole)', 'Komet', 'Asteroid'],
    optionsEn: ['Nebula', 'Black Hole', 'Comet', 'Asteroid'],
    correctIndex: 1,
    explanationId: 'Lubang Hitam memiliki kecepatan lepas (escape velocity) yang melebihi kecepatan cahaya!',
    explanationEn: 'A Black Hole possesses gravity so immense that its escape velocity exceeds the speed of light.',
    icon: '🕳️',
    xpReward: 50
  },
  {
    id: 'q16',
    tier: 3,
    tierLabelId: 'Komandan Kosmik',
    tierLabelEn: 'Cosmic Commander',
    questionId: 'Galaksi tempat planet Bumi dan Tata Surya kita bernaung bernama...',
    questionEn: 'The galaxy that houses our solar system and Earth is named...',
    optionsId: ['Galaksi Andromeda', 'Galaksi Bima Sakti (Milky Way)', 'Galaksi Sombrero', 'Galaksi Triangulum'],
    optionsEn: ['Andromeda Galaxy', 'Milky Way Galaxy', 'Sombrero Galaxy', 'Triangulum Galaxy'],
    correctIndex: 1,
    explanationId: 'Bima Sakti adalah galaksi spiral raksasa dengan lebih dari 100 miliar bintang!',
    explanationEn: 'The Milky Way is a giant barred spiral galaxy sheltering over 100 billion stars.',
    icon: '🌌',
    xpReward: 50
  }
];

export class QuizController {
  private currentIndex: number = 0;
  private score: number = 0;
  private totalXp: number = 0;
  private selectedTier: 1 | 2 | 3 | 'all' = 'all';
  private filteredQuestions: QuizQuestion[] = [];

  constructor() {
    this.filterQuestions('all');
  }

  public filterQuestions(tier: 1 | 2 | 3 | 'all') {
    this.selectedTier = tier;
    if (tier === 'all') {
      this.filteredQuestions = [...QUIZ_QUESTIONS];
    } else {
      this.filteredQuestions = QUIZ_QUESTIONS.filter(q => q.tier === tier);
    }
    this.currentIndex = 0;
  }

  public getCurrentQuestion(): QuizQuestion | null {
    if (this.currentIndex >= this.filteredQuestions.length) return null;
    return this.filteredQuestions[this.currentIndex];
  }

  public getProgress(): { current: number; total: number; percent: number } {
    const total = this.filteredQuestions.length;
    const current = Math.min(this.currentIndex + 1, total);
    return {
      current,
      total,
      percent: total > 0 ? Math.round((this.currentIndex / total) * 100) : 0
    };
  }

  public submitAnswer(answerIdx: number): { isCorrect: boolean; question: QuizQuestion } {
    const q = this.getCurrentQuestion();
    if (!q) throw new Error('No question available');

    const isCorrect = answerIdx === q.correctIndex;
    if (isCorrect) {
      this.score++;
      this.totalXp += q.xpReward;
      spaceAudio.playFanfare();
    } else {
      spaceAudio.playPop(220); // low buzz
    }

    return { isCorrect, question: q };
  }

  public nextQuestion(): boolean {
    this.currentIndex++;
    return this.currentIndex < this.filteredQuestions.length;
  }

  public reset() {
    this.currentIndex = 0;
    this.score = 0;
  }

  public getScoreStats() {
    return {
      score: this.score,
      total: this.filteredQuestions.length,
      xpEarned: this.totalXp,
      stars: Math.floor(this.score / 2)
    };
  }
}

export const quizController = new QuizController();
