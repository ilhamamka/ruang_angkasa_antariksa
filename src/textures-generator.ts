// Photorealistic Procedural Space Textures Generator
// Generates high-resolution 1024x512 Canvas Textures for all planets & Sun
// 100% Offline, Zero Network Latency, Instant Load, No CORS Issues!

import * as THREE from 'three';

export class PlanetTextureGenerator {
  // Simple deterministic pseudo-noise helper
  private static noise2D(x: number, y: number): number {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  }

  private static smoothNoise(x: number, y: number): number {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    const s = fx * fx * (3 - 2 * fx);
    const t = fy * fy * (3 - 2 * fy);

    const n00 = this.noise2D(i, j);
    const n10 = this.noise2D(i + 1, j);
    const n01 = this.noise2D(i, j + 1);
    const n11 = this.noise2D(i + 1, j + 1);

    const nx0 = n00 * (1 - s) + n10 * s;
    const nx1 = n01 * (1 - s) + n11 * s;

    return nx0 * (1 - t) + nx1 * t;
  }

  private static fbm(x: number, y: number, octaves = 5): number {
    let val = 0;
    let amp = 0.5;
    let freq = 1.0;
    for (let o = 0; o < octaves; o++) {
      val += amp * this.smoothNoise(x * freq, y * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  // --- 1. THE SUN (Fiery Plasma Surface) ---
  public static createSunTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const n = this.fbm(x * 0.02, y * 0.02, 6);
        const turbulence = Math.sin(x * 0.05 + n * 8.0) * 0.5 + 0.5;

        // Plasma fiery palette: white-yellow hot centers, deep orange-red boundaries
        const r = Math.min(255, Math.floor(255 * (0.8 + n * 0.4)));
        const g = Math.min(255, Math.floor(180 * Math.pow(n, 1.4) + turbulence * 40));
        const b = Math.min(255, Math.floor(30 * Math.pow(n, 3)));

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  // --- 2. MERCURY (Cratered Moon-like Rocky Crust) ---
  public static createMercuryTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const base = this.fbm(x * 0.015, y * 0.015, 6);
        const rough = this.fbm(x * 0.06, y * 0.06, 3);
        const shade = Math.floor((base * 0.7 + rough * 0.3) * 160 + 50);

        data[idx] = shade;
        data[idx + 1] = Math.floor(shade * 0.95);
        data[idx + 2] = Math.floor(shade * 0.92);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Stamp distinct impact craters
    for (let c = 0; c < 45; c++) {
      const cx = (Math.sin(c * 93.1) * 0.5 + 0.5) * width;
      const cy = (Math.cos(c * 47.7) * 0.5 + 0.5) * height;
      const radius = 6 + (c % 7) * 5;

      const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      grad.addColorStop(0, 'rgba(40, 38, 36, 0.7)');
      grad.addColorStop(0.7, 'rgba(90, 85, 80, 0.5)');
      grad.addColorStop(0.9, 'rgba(210, 205, 195, 0.6)'); // bright impact rim
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 3. VENUS (Dense Swirling Sulfuric Atmosphere) ---
  public static createVenusTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        // High speed chevron cloud patterns
        const swirl = this.fbm((x + Math.sin(y * 0.05) * 40) * 0.015, y * 0.02, 5);
        const band = Math.sin(y * 0.03 + swirl * 4.0) * 0.5 + 0.5;

        const r = Math.floor(215 + swirl * 35);
        const g = Math.floor(165 + band * 40);
        const b = Math.floor(100 + swirl * 30);

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 4. EARTH (Blue Marble Oceans, Continents & Polar Ice) ---
  public static createEarthTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const latRatio = Math.abs(y - height / 2) / (height / 2); // 0 at equator, 1 at poles
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const landNoise = this.fbm(x * 0.008, y * 0.008, 6);

        if (latRatio > 0.88) {
          // Polar Ice Caps (Arctic & Antarctica)
          data[idx] = 245;
          data[idx + 1] = 250;
          data[idx + 2] = 255;
        } else if (landNoise > 0.52) {
          // Landmass / Continents
          const elevation = (landNoise - 0.52) / 0.48;
          if (elevation > 0.55) {
            // Mountains / highlands (brown & snow tops)
            data[idx] = Math.floor(139 + elevation * 60);
            data[idx + 1] = Math.floor(115 + elevation * 50);
            data[idx + 2] = Math.floor(85 + elevation * 50);
          } else {
            // Forests & plains (lush green & savanna)
            data[idx] = Math.floor(45 + elevation * 50);
            data[idx + 1] = Math.floor(130 - elevation * 20);
            data[idx + 2] = Math.floor(40 + elevation * 20);
          }
        } else {
          // Ocean Water (Deep sapphire to turquoise coastal shelf)
          const depth = landNoise / 0.52;
          data[idx] = Math.floor(10 + depth * 25);
          data[idx + 1] = Math.floor(60 + depth * 65);
          data[idx + 2] = Math.floor(140 + depth * 80);
        }
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 4B. EARTH CLOUDS (Independent Rotating Cloud Layer) ---
  public static createEarthCloudsTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const cloudNoise = this.fbm(x * 0.012 + Math.sin(y * 0.03) * 15, y * 0.012, 5);

        if (cloudNoise > 0.50) {
          const alpha = Math.min(240, Math.floor((cloudNoise - 0.50) * 4.5 * 255));
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = alpha;
        } else {
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 0; // transparent
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 5. THE MOON (Lunar Highlands & Dark Basaltic Maria) ---
  public static createMoonTexture(width = 512, height = 256): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const base = this.fbm(x * 0.015, y * 0.015, 5);
        const maria = this.smoothNoise(x * 0.008, y * 0.008) > 0.58 ? 0.65 : 1.0;
        const v = Math.floor(base * 190 * maria + 35);

        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 6. MARS (Red Rusty Desert, Dark Basalt & Ice Caps) ---
  public static createMarsTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const latRatio = Math.abs(y - height / 2) / (height / 2);
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        if (latRatio > 0.90) {
          // Polar Dry Ice (CO2 + Water ice)
          data[idx] = 250;
          data[idx + 1] = 250;
          data[idx + 2] = 255;
        } else {
          const rust = this.fbm(x * 0.012, y * 0.012, 6);
          const darkSpot = this.smoothNoise(x * 0.006, y * 0.006) > 0.62 ? 0.72 : 1.0;

          data[idx] = Math.floor((190 + rust * 55) * darkSpot);
          data[idx + 1] = Math.floor((80 + rust * 35) * darkSpot);
          data[idx + 2] = Math.floor((40 + rust * 20) * darkSpot);
        }
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 7. JUPITER (Iconic Swirling Belts & The Great Red Spot) ---
  public static createJupiterTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Spot center coords
    const spotX = width * 0.68;
    const spotY = height * 0.65;
    const spotRx = width * 0.08;
    const spotRy = height * 0.05;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Band turbulence waves
        const wave = Math.sin(y * 0.08 + this.fbm(x * 0.02, y * 0.02, 4) * 4.5);
        const normY = (wave + 1) / 2;

        let r = Math.floor(190 + normY * 55);
        let g = Math.floor(130 + normY * 45);
        let b = Math.floor(80 + normY * 35);

        // Check distance to Great Red Spot ellipse
        const dx = (x - spotX) / spotRx;
        const dy = (y - spotY) / spotRy;
        const spotDist = dx * dx + dy * dy;

        if (spotDist < 1.0) {
          const spotWeight = 1.0 - spotDist;
          r = Math.floor(r * (1 - spotWeight) + 210 * spotWeight);
          g = Math.floor(g * (1 - spotWeight) + 65 * spotWeight);
          b = Math.floor(b * (1 - spotWeight) + 40 * spotWeight);
        }

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 8. SATURN (Golden Cream Bands) ---
  public static createSaturnTexture(width = 1024, height = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const band = Math.sin(y * 0.06 + this.fbm(x * 0.015, y * 0.015, 3) * 2.0);
        const norm = (band + 1) / 2;

        data[idx] = Math.floor(215 + norm * 35);
        data[idx + 1] = Math.floor(190 + norm * 30);
        data[idx + 2] = Math.floor(140 + norm * 25);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 8B. SATURN RINGS (Concentric Ice Ringlets & Cassini Division) ---
  public static createSaturnRingsTexture(width = 512, height = 64): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let x = 0; x < width; x++) {
      const ringRatio = x / width; // 0 (inner ring) to 1 (outer ring)
      let alpha = 0.85;

      // Cassini Division gap between 0.65 and 0.72
      if (ringRatio > 0.65 && ringRatio < 0.73) {
        alpha = 0.05; // gap!
      } else if (ringRatio < 0.15 || ringRatio > 0.95) {
        alpha = 0.15; // thin edges
      } else {
        // High density ringlets
        alpha = 0.6 + Math.sin(x * 1.5) * 0.25;
      }

      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        data[idx] = 230;     // ice tint
        data[idx + 1] = 215; // faint golden cream
        data[idx + 2] = 180;
        data[idx + 3] = Math.floor(alpha * 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- 9. URANUS (Cyan Ice Giant) ---
  public static createUranusTexture(width = 512, height = 256): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#cceeff');
    grad.addColorStop(0.3, '#7cd9e8');
    grad.addColorStop(0.7, '#49bed2');
    grad.addColorStop(1, '#a6e8f4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 10. NEPTUNE (Deep Azure Ocean & Hypersonic Storms) ---
  public static createNeptuneTexture(width = 512, height = 256): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const wave = Math.sin(y * 0.05 + this.fbm(x * 0.02, y * 0.02, 3) * 3.0);
        const norm = (wave + 1) / 2;

        data[idx] = Math.floor(35 + norm * 35);
        data[idx + 1] = Math.floor(75 + norm * 55);
        data[idx + 2] = Math.floor(190 + norm * 65);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Methane high altitude white cloud streaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.35);
    ctx.bezierCurveTo(width * 0.4, height * 0.32, width * 0.6, height * 0.38, width * 0.85, height * 0.34);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  // --- 11. PLUTO (Reddish Tints with Bright Heart Glacier) ---
  public static createPlutoTexture(width = 512, height = 256): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const base = this.fbm(x * 0.02, y * 0.02, 4);
        data[idx] = Math.floor(145 + base * 40);
        data[idx + 1] = Math.floor(110 + base * 30);
        data[idx + 2] = Math.floor(95 + base * 25);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Tombaugh Regio Heart Glacier
    ctx.fillStyle = 'rgba(250, 245, 240, 0.85)';
    ctx.beginPath();
    const hx = width * 0.55;
    const hy = height * 0.52;
    ctx.moveTo(hx, hy);
    ctx.bezierCurveTo(hx - 30, hy - 40, hx - 60, hy + 10, hx, hy + 50);
    ctx.bezierCurveTo(hx + 60, hy + 10, hx + 30, hy - 40, hx, hy);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }
}
