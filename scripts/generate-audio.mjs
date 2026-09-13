import { execSync } from 'child_process';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';

// Generate audio files for kid curriculum stories & fruit analogies
const stories = [
  // 10 Lessons
  {
    id: 'l1_sun',
    text: 'Matahari adalah bintang yang paling dekat dengan kita. Dia selalu bangun pagi untuk menyinari bumi, membuat bunga-bunga mekar dan memberi kita kehangatan untuk bermain!'
  },
  {
    id: 'l1_earth',
    text: 'Bumi adalah planet kita tercinta! Warnanya biru karena banyak lautan air yang jernih, dan hijau karena banyak pohon-pohon rindang.'
  },
  {
    id: 'l1_moon',
    text: 'Bulan adalah teman setia Bumi di malam hari. Bulan suka menyapa kita dengan senyuman sabit melengkung yang cantik di langit malam bertabur bintang.'
  },
  {
    id: 'l2_song',
    text: 'Ayo nyanyikan bersama: Merkurius satu, Venus dua, Bumi tiga, Mars empat, Jupiter lima, Saturnus enam, Uranus tujuh, dan Neptunus delapan! Me-Ve-Bu-Ma-Ju-Sa-U-Ne!'
  },
  {
    id: 'l2_giants',
    text: 'Jupiter dan Saturnus adalah dua raksasa yang sangat baik hati. Gravitasi besar mereka sering melindungi Bumi dari lemparan batu antariksa liar lho!'
  },
  {
    id: 'l3_balloon_rocket',
    text: 'Pernahkah kamu meniup balon lalu melepasnya? Balon akan melesat terbang kencang! Nah, mesin roket juga membakar bahan bakar dan menyemburkan gas ke bawah agar roket bisa terbang ke antariksa!'
  },
  {
    id: 'l3_suit',
    text: 'Astronot memakai baju putih bertekanan lengkap dengan helm kaca pelindung. Kaca helmnya dilapisi sedikit emas murni tipis agar mata astronot tidak silau melihat cahaya matahari di angkasa!'
  },
  {
    id: 'l3_zerog',
    text: 'Di dalam pesawat stasiun antariksa, para astronot bisa berputar salto di udara tanpa takut jatuh! Air minum mereka tidak mengalir di gelas, melainkan membentuk bola-bola air yang bisa ditangkap melayang!'
  },
  {
    id: 'l4_scale_quiz',
    text: 'Ayo kita uji ingatan cerdasmu! Siapakah planet yang ukurannya paling raksasa seperti semangka besar?'
  },
  {
    id: 'l4_mars_quiz',
    text: 'Planet apakah yang tanahnya merah berkarat dan sering dikunjungi robot-robot kecil dari Bumi?'
  },

  // 9 Fruit analogies
  {
    id: 'fruit_sun',
    text: 'Halo teman kecil! Matahari adalah bola api raksasa yang sangat ramah. Dia seperti lampu kamar raksasa yang menyinari Bumi agar kita bisa bermain di siang hari!'
  },
  {
    id: 'fruit_mercury',
    text: 'Aku Merkurius! Tubuhku kecil seperti biji kacang hijau. Aku berputar paling dekat dengan Matahari, jadi siang hariku sangat panas seperti wajan penggorengan!'
  },
  {
    id: 'fruit_venus',
    text: 'Halo! Aku Venus, planet yang memakai selimut awan kuning tebal. Selimutku membuat tubuhku sangat panas, lebih panas dari oven pemanggang kue!'
  },
  {
    id: 'fruit_earth',
    text: 'Ini Bumi, rumah kita tercinta! Warnanya biru cantik karena penuh dengan air laut. Kita bisa bernapas, berlari di taman, dan bermain dengan teman-teman di sini!'
  },
  {
    id: 'fruit_mars',
    text: 'Aku Mars si planet merah! Permukaanku berpasir merah ceria. Di sini ada robot lucu beroda enam bernama Curiosity yang sedang berjalan-jalan mencari jejak air!'
  },
  {
    id: 'fruit_jupiter',
    text: 'Aku Jupiter si raja semangka raksasa! Tubuhku sangat besar, bisa memuat seribu Bumi di dalam perutku! Aku punya bintik merah raksasa yang berputar kencang.'
  },
  {
    id: 'fruit_saturn',
    text: 'Lihat cincinku! Aku Saturnus si putri mahkota melon! Cincinku terbuat dari jutaan butir es berkilauan yang menari berputar mengelilingiku.'
  },
  {
    id: 'fruit_uranus',
    text: 'Brrr dinginnya! Aku Uranus si apel hijau beku! Aku berputar miring sambil rebahan seperti bola yang menggelinding di atas es.'
  },
  {
    id: 'fruit_neptune',
    text: 'Wuuusshh! Aku Neptunus si buah blueberry biru! Aku planet terjauh dari Matahari yang selalu ditiup angin badai super kencang dan sangat dingin membeku!'
  }
];

const outDir = path.resolve('public/audio/stories');
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

console.log(`🎙️ Menghasilkan ${stories.length} rekaman audio narasi resmi bahasa Indonesia...`);

for (const s of stories) {
  const aiffPath = `/tmp/${s.id}.aiff`;
  const m4aPath = path.join(outDir, `${s.id}.m4a`);
  try {
    execSync(`say -v 'Damayanti' -o "${aiffPath}" "${s.text.replace(/"/g, '\\"')}"`);
    execSync(`afconvert -f mp4f -d aac "${aiffPath}" "${m4aPath}"`);
    if (existsSync(aiffPath)) unlinkSync(aiffPath);
    console.log(`✅ [Audio OK] ${s.id}.m4a`);
  } catch (err) {
    console.warn(`⚠️ Gagal generate ${s.id}:`, err.message);
  }
}

console.log('🎉 Selesai generate semua audio narasi anak!');
