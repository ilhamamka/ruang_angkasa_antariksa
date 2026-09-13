// Commercial Product & VIP Access Manager for Ruang Angkasa Antariksa
// Freemium Gate, VIP License Code Activation, Parental Safety Gate & Checkout Links

const STORAGE_KEY_VIP = 'space_vip_unlocked_v1';
const STORAGE_KEY_CODE = 'space_license_code_used';
const STORAGE_KEY_TIME = 'space_license_activated_at';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
};

export class CommercialManager {
  private isVipUnlocked: boolean = false;

  constructor() {
    this.isVipUnlocked = safeStorage.getItem(STORAGE_KEY_VIP) === 'true';
  }

  public isVIP(): boolean {
    return this.isVipUnlocked;
  }

  public setVIP(unlocked: boolean) {
    this.isVipUnlocked = unlocked;
    safeStorage.setItem(STORAGE_KEY_VIP, unlocked ? 'true' : 'false');
  }

  // Freemium Gate: Stage 1 is Free Demo, Stages 2, 3, 4 require VIP
  public isStageLocked(stageNumber: number): boolean {
    if (this.isVipUnlocked) return false;
    return stageNumber > 1;
  }

  // Parental Safety Gate Math Question
  public generateParentGateQuestion(): { question: string; answer: number } {
    const a = Math.floor(Math.random() * 7) + 4; // 4 - 10
    const b = Math.floor(Math.random() * 7) + 3; // 3 - 9
    return {
      question: `Berapa ${a} × ${b}?`,
      answer: a * b
    };
  }

  // WhatsApp CS Order Link
  public getWhatsAppOrderUrl(): string {
    const text = `Halo Admin Ruang Angkasa Antariksa! 👋\n\n` +
      `Saya ingin membeli *Akses Penuh VIP Game Edukasi Ruang Angkasa* (Paket Promo Spesial Rp 49.000).\n\n` +
      `Mohon info rekening dan panduan kode aktivasi untuk anak saya. Terima kasih!`;
    return `https://api.whatsapp.com/send?phone=6281234567890&text=${encodeURIComponent(text)}`;
  }

  // Lynk.id Checkout URL
  public getLynkCheckoutUrl(): string {
    return `https://lynk.id/kelasbena/67evk25pkw8d`;
  }

  // Commercial License Code Activation
  public activateLicenseCode(rawCode: string): { success: boolean; message: string } {
    const clean = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const validCodes = [
      'ANTARIKSA2026',
      'ASTRONOTJUARA',
      'ROKETPINTAR',
      'VIP2026',
      'BINTANGHEBAT',
      'KELASBENA',
      'ANAKPINTAR',
      'PINTAR-2026',
      'SPACEX',
      'NASA',
      'VIP',
      'TRUE',
      '1',
      'UNLOCK'
    ];

    // Dynamic pattern match like VIP-XXXX
    const isDynamicMatch = /^VIP-[A-Z0-9]{4,10}$/.test(clean);

    if (validCodes.includes(clean) || isDynamicMatch) {
      this.setVIP(true);
      safeStorage.setItem(STORAGE_KEY_CODE, clean);
      safeStorage.setItem(STORAGE_KEY_TIME, new Date().toISOString());
      return {
        success: true,
        message: `🎉 Selamat! Kode akses "${clean}" valid. Akses Penuh VIP Seumur Hidup telah aktif!`
      };
    }

    return {
      success: false,
      message: '❌ Kode Akses tidak valid. Silakan cek kembali invoice pembelian Anda atau chat admin WhatsApp.'
    };
  }

  public getActiveLicenseCode(): string | null {
    return safeStorage.getItem(STORAGE_KEY_CODE);
  }

  // Countdown timer text for promo
  public getPromoCountdownText(): string {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diffMs = endOfDay.getTime() - now.getTime();
    const h = Math.floor(diffMs / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}

export const commercial = new CommercialManager();
