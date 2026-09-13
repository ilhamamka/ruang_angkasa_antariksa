import { execSync } from 'child_process';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';

// High-Energy, Excited, Cheerful Kid-Friendly Indonesian Stories (Numberblocks/Alphablocks Style)
const stories = [
  {
    id: 'l1_sun',
    text: 'Halo teman-teman! Wah, lihat! Matahari adalah bola bintang raksasa yang sangat hangat dan ramah! Dia bangun pagi untuk menyinari bumi kita agar kita bisa bermain ceria di siang hari! Hangat sekali ya!'
  },
  {
    id: 'l1_earth',
    text: 'Yaaay! Ini dia Bumi, rumah kita tercinta! Lihat, warnanya biru cantik karena penuh lautan air jernih, dan hijau penuh pohon rindang tempat kita bernapas segar!'
  },
  {
    id: 'l1_moon',
    text: 'Waaah, lihat ke atas langit malam! Ada Bulan si sahabat malam yang manis! Kadang dia tersenyum melengkung seperti biskuit sabit yang renyah! Cantik sekali ya!'
  },
  {
    id: 'l2_song',
    text: 'Horeee! Ayo kita bernyanyi bersama kereta delapan planet! Me! Ve! Bu! Ma! Ju! Sa! U! Ne! Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus! Siap meluncur!'
  },
  {
    id: 'l2_giants',
    text: 'Wooooow, besar sekali! Ini dia Kakak Jupiter yang perkasa dan Putri Saturnus yang cantik! Lihat, mahkota cincin es Saturnus berkilauan menari di angkasa!'
  },
  {
    id: 'l3_balloon_rocket',
    text: 'Siap-siap meluncur! Tiga! Dua! Satu! Fwoooosh! Roket menyemburkan api dan gas deras ke bawah, lalu roket melesat terbang tinggi ke atas langit bintang! Kereeen!'
  },
  {
    id: 'l3_suit',
    text: 'Keren banget! Ayo pakai baju astronot ajaib! Helmnya dilapisi emas murni tipis anti silau, dan tas punggungnya membawa udara napas segar! Kadet siap melangkah!'
  },
  {
    id: 'l3_zerog',
    text: 'Yipiii! Di stasiun antariksa kita bisa melayang terbang bebas seperti superhero! Air minum melayang seperti gelembung balon, hap, kita tangkap di udara!'
  },
  {
    id: 'l4_scale_quiz',
    text: 'Tebak buah kosmik! Siapakah planet raksasa yang tubuhnya sebesar semangka paling besar di tata surya kita? Ayo tebak cepat!'
  },
  {
    id: 'l4_mars_quiz',
    text: 'Siapakah planet berpasir merah yang punya robot penjelajah cilik beroda enam sedang mencari jejak air? Ayo temukan si planet merah!'
  },
  // 9 Fruit Analogies
  {
    id: 'fruit_sun',
    text: 'Wah, luar biasa! Matahari ini seperti bola pantai raksasa yang menyala terang benderang di tengah meja piknik semesta!'
  },
  {
    id: 'fruit_mercury',
    text: 'Hai, aku Merkurius si biji kacang hijau mungil! Aku berlari paling kencang mengelilingi matahari, wuuush cepat sekali!'
  },
  {
    id: 'fruit_venus',
    text: 'Halo, aku Venus si anggur kuning! Selimut awanku tebal sekali, membuat tubuhku hangat dan bersinar paling terang di langit sore!'
  },
  {
    id: 'fruit_earth',
    text: 'Ini dia Bumi kita yang manis seperti buah ceri biru! Rumah terindah di seluruh alam semesta tempat kita tertawa bahagia!'
  },
  {
    id: 'fruit_mars',
    text: 'Halo kawan, aku Mars si buah stroberi merah ceria! Pasirku merah eksotis dan aku suka disapa robot-robot kecil dari Bumi!'
  },
  {
    id: 'fruit_jupiter',
    text: 'Hahaha! Akulah Jupiter si raja semangka raksasa terbesar! Seribu bumi bisa masuk ke dalam perut besarku lho!'
  },
  {
    id: 'fruit_saturn',
    text: 'Lihatlah keindahanku! Aku Saturnus si melon bermahkota cincin es berkilau! Menari anggun di langit antariksa!'
  },
  {
    id: 'fruit_uranus',
    text: 'Brrr, sejuk sekali! Aku Uranus si apel hijau es yang suka berputar menggelinding santai di atas es dingin!'
  },
  {
    id: 'fruit_neptune',
    text: 'Wuuush, angin kencang! Aku Neptunus si blueberry biru laut di ujung tata surya! Pelindung terluar keluarga planet kita!'
  }
];

const outDir = path.resolve('public/audio/stories');
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

console.log(`🎙️ Mengunduh ${stories.length} rekaman audio suara excited & ceria anak (Google Natural Indonesian TTS)...`);

function fetchSentence(sentence, targetFile) {
  const clean = sentence.trim();
  if (!clean) return;
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=id&client=tw-ob`;
  execSync(`curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${url}" -o "${targetFile}"`);
}

for (const s of stories) {
  const mp3Path = path.join(outDir, `${s.id}.mp3`);
  const m4aPath = path.join(outDir, `${s.id}.m4a`);

  try {
    // Split into sentences so Google TTS gives optimal enthusiastic cadence
    const parts = s.text.match(/[^.!?]+[.!?]+/g) || [s.text];
    const tmpParts = [];

    parts.forEach((p, idx) => {
      const tmpP = `/tmp/part_${s.id}_${idx}.mp3`;
      fetchSentence(p, tmpP);
      tmpParts.push(tmpP);
    });

    // Concat all parts into one mp3
    execSync(`cat ${tmpParts.join(' ')} > "${mp3Path}"`);
    // Convert to m4a for Apple WebKit optimization
    execSync(`afconvert -f mp4f -d aac "${mp3Path}" "${m4aPath}"`);

    // Clean up temp parts
    tmpParts.forEach(tp => {
      if (existsSync(tp)) unlinkSync(tp);
    });

    console.log(`✅ [Excited Audio OK] ${s.id} (.mp3 & .m4a)`);
  } catch (err) {
    console.warn(`⚠️ Gagal generate ${s.id}:`, err.message);
  }
}

console.log('🎉 Selesai generate semua audio narasi excited anak!');
