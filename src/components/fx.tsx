import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { ease } from '../utils/easings';
import { useParallax } from '../hooks/useParallax';

/* ───────── Cursor magnético ───────── */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 25, stiffness: 250 });
  const sy = useSpring(y, { damping: 25, stiffness: 250 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button, [data-cursor]') as HTMLElement | null;
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? '');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [x, y]);

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className={`cursor-ring ${hover ? 'cursor--hover' : ''} ${label ? 'cursor--label' : ''}`}
        style={{ x: sx, y: sy }}
      >
        {label && <span>{label}</span>}
      </motion.div>
    </>
  );
}

/* ───────── Text reveal por palabra ───────── */
interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** palabras (índices) a destacar en serif itálica */
  accent?: number[];
  immediate?: boolean;
}

const wordVariants = {
  hidden: { y: '110%', rotate: 3 },
  visible: (d: number) => ({ y: 0, rotate: 0, transition: { duration: 0.9, delay: d, ease: ease('premium') } }),
};

export function RevealText({ children, className = '', delay = 0, tag = 'h2', accent = [], immediate }: RevealTextProps) {
  const Tag = motion[tag as 'h2'];
  const words = children.split(' ');
  // El disparador va en el título completo: las palabras están dentro de máscaras
  // recortadas y el IntersectionObserver no las detecta de forma fiable.
  return (
    <Tag
      className={`reveal ${className}`}
      aria-label={children}
      initial="hidden"
      {...(immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, amount: 0.4 } })}
    >
      {words.map((w, i) => (
        <span key={i} className="reveal__mask" aria-hidden>
          <motion.span
            className={`reveal__word ${accent.includes(i) ? 'serif-accent' : ''}`}
            variants={wordVariants}
            custom={delay + i * 0.06}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ───────── Botón magnético ───────── */
interface MagneticProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  target?: string;
  cursor?: string;
}

export function MagneticButton({ children, href, className = '', strength = 0.35, target, cursor }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      className="magnetic"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      <motion.a
        href={href}
        target={target}
        rel={target ? 'noopener noreferrer' : undefined}
        className={className}
        data-cursor={cursor}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <motion.span animate={{ x: pos.x * 0.3, y: pos.y * 0.3 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} className="magnetic__inner">
          {children}
        </motion.span>
      </motion.a>
    </div>
  );
}

/* ───────── Counter animado ───────── */
export function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1800 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 4);
      setN(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString('es-PR')}
      {suffix}
    </span>
  );
}

/* ───────── Imagen con parallax ───────── */
export function ParallaxImage({ src, alt, className = '', distance = 60 }: { src: string; alt: string; className?: string; distance?: number }) {
  const { ref, y } = useParallax(distance);
  return (
    <div ref={ref} className={`parallax-img ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.2 }} loading="lazy" />
    </div>
  );
}

/* ───────── Variants de grid ───────── */
export const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
export const gridItem = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: ease('premium') } },
};

/* ───────── Etiqueta de sección ───────── */
export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <motion.span
      className={`eyebrow ${light ? 'eyebrow--light' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: ease('smooth') }}
    >
      <i />
      {children}
    </motion.span>
  );
}

/* ───────── Espiral de la marca ───────── */
/** brand = rojo del logo (solo en el logotipo); por defecto, tono CMYK del sitio */
export function Spiral({ size = 40, spin = false, className = '', brand = false }: { size?: number; spin?: boolean; className?: string; brand?: boolean }) {
  const id = brand ? 'spg-brand' : 'spg-site';
  return (
    <svg className={`spiral ${spin ? 'spiral--spin' : ''} ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        {brand ? (
          <radialGradient id={id} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ff4a3d" />
            <stop offset="100%" stopColor="#c41810" />
          </radialGradient>
        ) : (
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12c8ff" />
            <stop offset="55%" stopColor="#2b4cff" />
            <stop offset="100%" stopColor="#7b5cff" />
          </linearGradient>
        )}
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id})`} />
      <path
        d="M50 8 A42 42 0 1 1 8 50 A34 34 0 0 1 42 16 A27 27 0 0 1 69 43 A20 20 0 0 1 49 63 A13 13 0 0 1 36 50 A7 7 0 0 1 43 43"
        fill="none"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
