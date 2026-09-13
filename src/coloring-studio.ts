// Interactive Digital Coloring & Tracing Studio for Kids
// Supports glow neon brush, flood fill bucket, eraser, templates, and PNG export

import { spaceAudio } from './audio.ts';
import { confetti } from './confetti.ts';

export interface ColoringTemplate {
  id: string;
  title: string;
  icon: string;
  drawOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export class DigitalColoringStudio {
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private currentColor = '#00e5ff';
  private currentTool: 'brush' | 'bucket' | 'eraser' = 'brush';
  private brushSize = 10;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  private undoStack: ImageData[] = [];
  private currentTemplateId = 'earth_moon';

  private templates: ColoringTemplate[] = [
    {
      id: 'earth_moon',
      title: 'Bumi & Bulan Tersenyum',
      icon: '🌍',
      drawOutline: (ctx, w, h) => {
        const cx = w * 0.42;
        const cy = h * 0.52;
        const r = Math.min(w, h) * 0.32;

        // Earth outline
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Continents
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, cy - r * 0.3);
        ctx.bezierCurveTo(cx - r * 0.2, cy - r * 0.8, cx + r * 0.2, cy - r * 0.5, cx + r * 0.6, cy - r * 0.2);
        ctx.bezierCurveTo(cx + r * 0.4, cy + r * 0.4, cx - r * 0.2, cy + r * 0.2, cx - r * 0.6, cy - r * 0.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy + r * 0.4);
        ctx.bezierCurveTo(cx + r * 0.1, cy + r * 0.6, cx + r * 0.5, cy + r * 0.7, cx + r * 0.3, cy + r * 0.9);
        ctx.stroke();

        // Crescent Moon on top right
        const mx = w * 0.82;
        const my = h * 0.28;
        const mr = 40;
        ctx.beginPath();
        ctx.arc(mx, my, mr, -0.6 * Math.PI, 0.6 * Math.PI, false);
        ctx.bezierCurveTo(mx - 10, my + mr * 0.5, mx - 10, my - mr * 0.5, mx + Math.cos(-0.6 * Math.PI) * mr, my + Math.sin(-0.6 * Math.PI) * mr);
        ctx.stroke();

        // Little stars
        DigitalColoringStudio.drawStarOutline(ctx, w * 0.15, h * 0.2, 14);
        DigitalColoringStudio.drawStarOutline(ctx, w * 0.88, h * 0.75, 12);
        DigitalColoringStudio.drawStarOutline(ctx, w * 0.18, h * 0.8, 10);
      }
    },
    {
      id: 'saturn',
      title: 'Planet Saturnus & Cincin Es',
      icon: '🪐',
      drawOutline: (ctx, w, h) => {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const r = Math.min(w, h) * 0.28;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;

        // Front Planet sphere
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Saturn Rings (ellipse tilted)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.35);

        ctx.beginPath();
        ctx.ellipse(0, 0, r * 2.1, r * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.6, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // Little stars
        DigitalColoringStudio.drawStarOutline(ctx, w * 0.18, h * 0.25, 15);
        DigitalColoringStudio.drawStarOutline(ctx, w * 0.82, h * 0.25, 12);
        DigitalColoringStudio.drawStarOutline(ctx, w * 0.78, h * 0.8, 16);
      }
    },
    {
      id: 'rocket',
      title: 'Roket Merah Putih Meluncur',
      icon: '🚀',
      drawOutline: (ctx, w, h) => {
        const cx = w * 0.5;
        const cy = h * 0.45;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;

        // Rocket body
        ctx.beginPath();
        ctx.moveTo(cx, cy - 130);
        ctx.bezierCurveTo(cx + 45, cy - 60, cx + 45, cy + 50, cx + 38, cy + 80);
        ctx.lineTo(cx - 38, cy + 80);
        ctx.bezierCurveTo(cx - 45, cy + 50, cx - 45, cy - 60, cx, cy - 130);
        ctx.stroke();

        // Porthole window
        ctx.beginPath();
        ctx.arc(cx, cy - 20, 22, 0, Math.PI * 2);
        ctx.stroke();

        // Left Fin
        ctx.beginPath();
        ctx.moveTo(cx - 38, cy + 30);
        ctx.lineTo(cx - 75, cy + 90);
        ctx.lineTo(cx - 38, cy + 80);
        ctx.stroke();

        // Right Fin
        ctx.beginPath();
        ctx.moveTo(cx + 38, cy + 30);
        ctx.lineTo(cx + 75, cy + 90);
        ctx.lineTo(cx + 38, cy + 80);
        ctx.stroke();

        // Indonesian Flag Box on body
        ctx.strokeRect(cx - 20, cy + 20, 40, 24);
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy + 32);
        ctx.lineTo(cx + 20, cy + 32);
        ctx.stroke();

        // Engine Fire Jet
        ctx.beginPath();
        ctx.moveTo(cx - 25, cy + 80);
        ctx.lineTo(cx, cy + 140);
        ctx.lineTo(cx + 25, cy + 80);
        ctx.stroke();
      }
    },
    {
      id: 'astronaut',
      title: 'Astronot Cilik Indonesia 🇮🇩',
      icon: '🧑‍🚀',
      drawOutline: (ctx, w, h) => {
        const cx = w * 0.46;
        const cy = h * 0.42;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;

        // Helmet
        ctx.beginPath();
        ctx.arc(cx, cy - 50, 44, 0, Math.PI * 2);
        ctx.stroke();

        // Visor
        ctx.beginPath();
        ctx.ellipse(cx, cy - 50, 32, 22, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.roundRect(cx - 36, cy - 6, 72, 80, 16);
        ctx.stroke();

        // Flag Pole & Indonesian Flag
        const fx = cx + 80;
        ctx.beginPath();
        ctx.moveTo(fx, cy - 70);
        ctx.lineTo(fx, cy + 110);
        ctx.stroke();

        ctx.strokeRect(fx, cy - 70, 55, 36);
        ctx.beginPath();
        ctx.moveTo(fx, cy - 52);
        ctx.lineTo(fx + 55, cy - 52);
        ctx.stroke();

        // Moon ground curve
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 1.5, h * 1.05, Math.PI * 1.25, Math.PI * 1.75);
        ctx.stroke();
      }
    }
  ];

  private static drawStarOutline(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  public mount(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  public render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="coloring-studio-container">
        <!-- Studio Toolbar Top -->
        <div class="coloring-studio-header">
          <div class="studio-title-block">
            <span class="studio-tag">🎨 STUDIO MEWARNAI DIGITAL KOSMIK</span>
            <h3 class="studio-title">Lukis & Warnai Benda Langit Favoritmu</h3>
            <p class="studio-desc">Sentuh dengan jarimu di tablet atau mouse komputer untuk mewarnai dengan kuas neon berkilau atau ember cat ajaib!</p>
          </div>

          <!-- Template Selector Pills -->
          <div class="coloring-templates-pills">
            ${this.templates.map(t => `
              <button 
                class="btn-template-pill ${t.id === this.currentTemplateId ? 'active' : ''}" 
                type="button" 
                data-tid="${t.id}"
              >
                <span>${t.icon}</span> <span>${t.title}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Workbench: Canvas Center + Tool Controls -->
        <div class="coloring-workbench-grid">
          <!-- Canvas Frame -->
          <div class="coloring-canvas-wrapper">
            <canvas id="digital-coloring-canvas" width="600" height="420"></canvas>
          </div>

          <!-- Tool Palette Column -->
          <div class="coloring-tools-panel">
            <!-- Mode Tools -->
            <div class="tool-section">
              <label class="tool-sec-label">Peralatan Melukis:</label>
              <div class="mode-tools-row">
                <button class="btn-color-tool ${this.currentTool === 'brush' ? 'active' : ''}" id="btn-tool-brush" type="button" title="Kuas Neon">
                  <span>🖌️ Kuas Neon</span>
                </button>
                <button class="btn-color-tool ${this.currentTool === 'bucket' ? 'active' : ''}" id="btn-tool-bucket" type="button" title="Ember Cat">
                  <span>🪣 Ember Cat</span>
                </button>
                <button class="btn-color-tool ${this.currentTool === 'eraser' ? 'active' : ''}" id="btn-tool-eraser" type="button" title="Penghapus">
                  <span>🧹 Hapus</span>
                </button>
              </div>
            </div>

            <!-- Brush Size Picker -->
            <div class="tool-section">
              <label class="tool-sec-label">Ukuran Kuas:</label>
              <div class="brush-size-pills">
                <button class="btn-size-pill ${this.brushSize === 5 ? 'active' : ''}" data-size="5" type="button">Halus</button>
                <button class="btn-size-pill ${this.brushSize === 12 ? 'active' : ''}" data-size="12" type="button">Sedang</button>
                <button class="btn-size-pill ${this.brushSize === 24 ? 'active' : ''}" data-size="24" type="button">Tebal</button>
              </div>
            </div>

            <!-- Color Swatches Grid -->
            <div class="tool-section">
              <label class="tool-sec-label">Palet 12 Warna Kosmik:</label>
              <div class="color-swatches-grid">
                ${[
                  '#ef4444', '#f97316', '#ffd700', '#10b981',
                  '#00e5ff', '#3b82f6', '#a855f7', '#ec4899',
                  '#ffffff', '#94a3b8', '#b45309', '#090d1a'
                ].map(c => `
                  <button 
                    class="color-swatch-dot ${c === this.currentColor ? 'active' : ''}" 
                    style="background: ${c};" 
                    data-color="${c}" 
                    type="button"
                    aria-label="Warna ${c}"
                  ></button>
                `).join('')}
              </div>
            </div>

            <!-- Canvas Action Controls -->
            <div class="tool-section canvas-actions-row">
              <button class="btn-canvas-action" id="btn-action-undo" type="button">
                <span>↩️ Undo</span>
              </button>
              <button class="btn-canvas-action" id="btn-action-clear" type="button">
                <span>🔄 Ulangi</span>
              </button>
              <button class="btn-canvas-action btn-save-art" id="btn-action-download" type="button">
                <span>💾 Simpan Gambar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initCanvas();
    this.attachEvents();
  }

  private initCanvas() {
    this.canvas = this.container?.querySelector('#digital-coloring-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!this.ctx) return;

    this.resetWithCurrentTemplate();
  }

  private resetWithCurrentTemplate() {
    if (!this.ctx || !this.canvas) return;

    this.undoStack = [];
    // White background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const tmpl = this.templates.find(t => t.id === this.currentTemplateId) || this.templates[0];
    tmpl.drawOutline(this.ctx, this.canvas.width, this.canvas.height);
    this.saveState();
  }

  private saveState() {
    if (!this.ctx || !this.canvas) return;
    if (this.undoStack.length >= 10) this.undoStack.shift();
    this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
  }

  private undo() {
    if (this.undoStack.length <= 1 || !this.ctx) return;
    this.undoStack.pop(); // discard current
    const prev = this.undoStack[this.undoStack.length - 1];
    if (prev) {
      this.ctx.putImageData(prev, 0, 0);
      spaceAudio.playPop(380);
    }
  }

  private attachEvents() {
    if (!this.canvas || !this.container) return;

    // Template switcher
    this.container.querySelectorAll('[data-tid]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tid = (e.currentTarget as HTMLElement).getAttribute('data-tid');
        if (tid && tid !== this.currentTemplateId) {
          this.currentTemplateId = tid;
          this.container?.querySelectorAll('[data-tid]').forEach(b => b.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          spaceAudio.playSnap();
          this.resetWithCurrentTemplate();
        }
      });
    });

    // Tool switchers
    const btnBrush = this.container.querySelector('#btn-tool-brush');
    const btnBucket = this.container.querySelector('#btn-tool-bucket');
    const btnEraser = this.container.querySelector('#btn-tool-eraser');

    const updateToolBtns = () => {
      btnBrush?.classList.toggle('active', this.currentTool === 'brush');
      btnBucket?.classList.toggle('active', this.currentTool === 'bucket');
      btnEraser?.classList.toggle('active', this.currentTool === 'eraser');
    };

    btnBrush?.addEventListener('click', () => { this.currentTool = 'brush'; updateToolBtns(); spaceAudio.playPop(520); });
    btnBucket?.addEventListener('click', () => { this.currentTool = 'bucket'; updateToolBtns(); spaceAudio.playPop(580); });
    btnEraser?.addEventListener('click', () => { this.currentTool = 'eraser'; updateToolBtns(); spaceAudio.playPop(440); });

    // Size pickers
    this.container.querySelectorAll('[data-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.brushSize = Number((e.currentTarget as HTMLElement).getAttribute('data-size'));
        this.container?.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        spaceAudio.playPop(480);
      });
    });

    // Color swatches
    this.container.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentColor = (e.currentTarget as HTMLElement).getAttribute('data-color') || '#00e5ff';
        this.container?.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        if (this.currentTool === 'eraser') {
          this.currentTool = 'brush';
          updateToolBtns();
        }
        spaceAudio.playPop(660);
      });
    });

    // Actions
    this.container.querySelector('#btn-action-undo')?.addEventListener('click', () => this.undo());
    this.container.querySelector('#btn-action-clear')?.addEventListener('click', () => {
      spaceAudio.playBalloonHiss(0.3);
      this.resetWithCurrentTemplate();
    });

    this.container.querySelector('#btn-action-download')?.addEventListener('click', () => {
      if (!this.canvas) return;
      spaceAudio.playCelestialChime();
      confetti.fire(0.5, 0.4, 40);

      const link = document.createElement('a');
      link.download = `karya-antariksa-${this.currentTemplateId}.png`;
      link.href = this.canvas.toDataURL('image/png');
      link.click();
    });

    // Canvas drawing interactions
    const getPos = (e: MouseEvent | Touch): { x: number; y: number } => {
      const rect = this.canvas!.getBoundingClientRect();
      const scaleX = this.canvas!.width / rect.width;
      const scaleY = this.canvas!.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const startDraw = (x: number, y: number) => {
      if (!this.ctx) return;
      if (this.currentTool === 'bucket') {
        this.floodFill(Math.round(x), Math.round(y), this.currentColor);
        this.saveState();
        return;
      }

      this.isDrawing = true;
      this.lastX = x;
      this.lastY = y;
      this.drawStroke(x, y);
    };

    const moveDraw = (x: number, y: number) => {
      if (!this.isDrawing) return;
      this.drawStroke(x, y);
      this.lastX = x;
      this.lastY = y;
    };

    const stopDraw = () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveState();
      }
    };

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => {
      const p = getPos(e);
      startDraw(p.x, p.y);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const p = getPos(e);
      moveDraw(p.x, p.y);
    });
    window.addEventListener('mouseup', stopDraw);

    // Touch events for mobile/tablet
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        const p = getPos(touch);
        startDraw(p.x, p.y);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        const p = getPos(touch);
        moveDraw(p.x, p.y);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', stopDraw);
  }

  private drawStroke(x: number, y: number) {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.currentTool === 'eraser') {
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = this.brushSize * 1.5;
      this.ctx.shadowBlur = 0;
    } else {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.brushSize;
      this.ctx.shadowColor = this.currentColor;
      this.ctx.shadowBlur = 8;
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0; // reset
  }

  // Fast Flood Fill (Bucket) using BFS queue
  private floodFill(startX: number, startY: number, hexColor: string) {
    if (!this.ctx || !this.canvas) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

    const imgData = this.ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const targetIdx = (startY * w + startX) * 4;
    const tr = data[targetIdx];
    const tg = data[targetIdx + 1];
    const tb = data[targetIdx + 2];

    const parseHex = (hex: string) => {
      const c = parseInt(hex.slice(1), 16);
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    };
    const [nr, ng, nb] = parseHex(hexColor);

    // Don't fill if clicked color is same or clicked outline black/dark border
    if (Math.abs(tr - nr) < 15 && Math.abs(tg - ng) < 15 && Math.abs(tb - nb) < 15) return;
    if (tr < 60 && tg < 60 && tb < 60) return; // outline barrier

    const matchesTarget = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      return Math.abs(r - tr) < 30 && Math.abs(g - tg) < 30 && Math.abs(b - tb) < 30;
    };

    const queue: number[] = [startX, startY];
    const visited = new Uint8Array(w * h);
    visited[startY * w + startX] = 1;

    while (queue.length > 0) {
      const cy = queue.pop()!;
      const cx = queue.pop()!;
      const idx = (cy * w + cx) * 4;

      data[idx] = nr;
      data[idx + 1] = ng;
      data[idx + 2] = nb;
      data[idx + 3] = 255;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (let i = 0; i < 4; i++) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const pos = ny * w + nx;
          if (!visited[pos]) {
            visited[pos] = 1;
            if (matchesTarget(pos * 4)) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
    spaceAudio.playPop(620);
  }
}

export const digitalColoringStudio = new DigitalColoringStudio();
