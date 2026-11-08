import { useEffect, useRef } from 'react';

interface HalftoneProps {
  src: string;
  /** zona donde se dibuja la imagen, en fracciones del canvas */
  fit: { x: number; y: number; w: number; h: number };
  spacing?: number;
  start: boolean;
  /** duración de la "impresión" inicial en ms */
  printMs?: number;
  lens?: number;
  className?: string;
  onPrinted?: () => void;
  /** 0..1 — a medida que crece, los puntos se dispersan (scroll) */
  scatter?: { get: () => number };
}

/**
 * Imagen renderizada como trama de semitonos. Un cabezal de impresión la revela
 * de arriba abajo; cerca del cursor los puntos crecen y se separan en C · M · Y.
 */
export default function Halftone({
  src,
  fit,
  spacing = 8,
  start,
  printMs = 2600,
  lens = 150,
  className = '',
  onPrinted,
  scatter,
}: HalftoneProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const startRef = useRef(start);
  startRef.current = start;
  const doneCb = useRef(onPrinted);
  doneCb.current = onPrinted;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0, dpr = 1;
    let cols = 0, rows = 0;
    let field: Float32Array = new Float32Array(0);
    let edge: Float32Array = new Float32Array(0);
    let img: HTMLImageElement | null = null;
    let raf = 0;
    let t0 = 0;
    let printed = false;
    let visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const sample = () => {
      if (!img || !W) return;
      cols = Math.ceil(W / spacing) + 1;
      rows = Math.ceil(H / spacing) + 1;
      field = new Float32Array(cols * rows);
      // rect de la imagen respetando proporción
      const bw = fit.w * W, bh = fit.h * H;
      const s = Math.min(bw / img.width, bh / img.height);
      const iw = img.width * s, ih = img.height * s;
      const ix = fit.x * W + (bw - iw) / 2;
      const iy = fit.y * H + (bh - ih) / 2;
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.drawImage(img, ix / spacing, iy / spacing, iw / spacing, ih / spacing);
      const d = o.getImageData(0, 0, cols, rows).data;
      const N = cols * rows;
      const A = new Float32Array(N);
      const L = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        A[i] = d[i * 4 + 3] / 255;
        L[i] = ((0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255) * A[i];
      }
      edge = new Float32Array(N);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const a = A[i];
          // más contraste: los grises claros no se funden en un bloque
          const c = Math.min(1, Math.max(0, (L[i] / (a || 1) - 0.3) / 0.65));
          field[i] = a * (0.1 + 0.9 * Math.pow(c, 1.6));
          if (x > 0 && y > 0 && x < cols - 1 && y < rows - 1) {
            const gx = L[i + 1] - L[i - 1] + (A[i + 1] - A[i - 1]) * 0.6;
            const gy = L[i + cols] - L[i - cols] + (A[i + cols] - A[i - cols]) * 0.6;
            edge[i] = Math.min(1, Math.sqrt(gx * gx + gy * gy) * 1.6);
          }
        }
      }
    };

    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      sample();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    const im = new Image();
    im.src = src;
    im.onload = () => {
      img = im;
      sample();
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || !W || !field.length) return;
      if (startRef.current && !t0) t0 = t;
      const p = t0 ? Math.min(1, (t - t0) / printMs) : 0;
      const pe = 1 - Math.pow(1 - p, 3);
      if (p >= 1 && !printed) {
        printed = true;
        doneCb.current?.();
      }
      const headY = pe * (H + 40) - 20;
      const sc = scatter ? scatter.get() : 0;

      // suavizado del cursor
      if (mouse.tx < -999 || mouse.x < -999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      } else {
        mouse.x += (mouse.tx - mouse.x) * 0.18;
        mouse.y += (mouse.ty - mouse.y) * 0.18;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const maxR = spacing * 0.5;
      const L2 = lens * lens;
      const time = t * 0.0016;

      for (let j = 0; j < rows; j++) {
        const cy = j * spacing;
        for (let i = 0; i < cols; i++) {
          const cx = i * spacing + (j % 2 ? spacing / 2 : 0);
          const v = field[j * cols + i];
          const dx = cx - mouse.x, dy = cy - mouse.y;
          const d2 = dx * dx + dy * dy;
          const k = d2 < L2 ? 1 - Math.sqrt(d2) / lens : 0;

          if (v < 0.02 || cy > headY) {
            // trama de fondo
            const br = 0.55 + k * 1.6;
            ctx.fillStyle = k > 0 ? `rgba(18,200,255,${0.12 + k * 0.45})` : 'rgba(150,170,220,0.10)';
            ctx.beginPath();
            ctx.arc(cx, cy, br, 0, 6.283);
            ctx.fill();
            continue;
          }

          const wave = 1 + 0.07 * Math.sin(time + cx * 0.018 + cy * 0.012);
          let r = v * maxR * wave * (1 + k * 0.85) * (1 + sc * 1.4);
          const fresh = headY - cy < 26 && p < 1;
          const ox = sc * (cx - W * 0.6) * 0.35, oy = sc * (cy - H * 0.5) * 0.35;

          if (k > 0.02 || sc > 0.02) {
            const sep = 1.5 + k * 7.5 + sc * 10;
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = 'rgba(18,200,255,0.85)';
            ctx.beginPath(); ctx.arc(cx + ox - sep, cy + oy, r * 0.8, 0, 6.283); ctx.fill();
            ctx.fillStyle = 'rgba(255,61,180,0.8)';
            ctx.beginPath(); ctx.arc(cx + ox + sep, cy + oy, r * 0.8, 0, 6.283); ctx.fill();
            ctx.fillStyle = 'rgba(255,225,77,0.75)';
            ctx.beginPath(); ctx.arc(cx + ox, cy + oy + sep, r * 0.8, 0, 6.283); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
          } else {
            const e = edge[j * cols + i];
            if (e > 0.16) {
              // contornos: tinta cian brillante
              ctx.fillStyle = `rgba(124,240,255,${0.55 + e * 0.45})`;
              r = Math.max(r, maxR * (0.55 + e * 0.45));
            } else {
              ctx.fillStyle = fresh ? '#7cf0ff' : `rgba(226,234,255,${0.35 + v * 0.55})`;
              r *= 0.82;
            }
            if (r < 0.6) r = 0.6;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 6.283);
            ctx.fill();
          }
        }
      }

      // cabezal de impresión
      if (p > 0 && p < 1) {
        const g = ctx.createLinearGradient(0, headY - 60, 0, headY + 4);
        g.addColorStop(0, 'rgba(18,200,255,0)');
        g.addColorStop(1, 'rgba(18,200,255,0.22)');
        ctx.fillStyle = g;
        ctx.fillRect(0, headY - 60, W, 64);
        ctx.fillStyle = 'rgba(216,255,62,0.95)';
        ctx.fillRect(0, headY, W, 1.5);
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, spacing, fit.x, fit.y, fit.w, fit.h, printMs, lens]);

  return <canvas ref={ref} className={`halftone ${className}`} aria-hidden />;
}
