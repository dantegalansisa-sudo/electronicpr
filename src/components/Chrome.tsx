import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ease } from '../utils/easings';
import { BUSINESS, waLink } from '../data';
import { MagneticButton, Spiral } from './fx';

/* ───────── Preloader ───────── */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const D = 1900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / D);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setOut(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <AnimatePresence onExitComplete={onDone}>
      {!out && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1, ease: ease('cinematic') }}
        >
          <motion.div
            className="preloader__logo"
            initial={{ opacity: 0, scale: 0.6, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: ease('premium') }}
          >
            <Spiral size={84} spin />
          </motion.div>
          <div className="preloader__word">
            {'TECNOTRONICS'.split('').map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: '120%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 + i * 0.045, duration: 0.8, ease: ease('premium') }}
              >
                {c}
              </motion.span>
            ))}
          </div>
          <div className="preloader__bar">
            <span style={{ transform: `scaleX(${n / 100})` }} />
          </div>
          <div className="preloader__count mono">{String(n).padStart(3, '0')}%</div>
          <div className="preloader__tag mono">Office Equipment · San Juan, PR</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────── Barra de progreso ───────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ───────── Navbar ───────── */
const LINKS = [
  ['Servicios', '#servicios'],
  ['Proceso', '#proceso'],
  ['Diagnóstico', '#diagnostico'],
  ['Nosotros', '#nosotros'],
  ['Contacto', '#contacto'],
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: ease('premium') }}
      >
        <a href="#top" className="nav__brand" aria-label="Tecnotronics inicio">
          <span className="brandmark">
            TECNOTR<Spiral size={18} />NICS
          </span>
          <span className="brandmark__sub">Office Equipment</span>
        </a>
        <nav className="nav__links">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="nav__link">
              <span className="nav__clip">
                <span data-text={l}>{l}</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="nav__cta">
          <a href={BUSINESS.phoneHref} className="nav__phone mono">
            <span className="live-dot" /> 24/7 · {BUSINESS.phone}
          </a>
          <MagneticButton href={waLink()} target="_blank" className="btn btn--lime btn--sm">
            Estimado gratis <Arrow />
          </MagneticButton>
          <button className={`burger ${open ? 'burger--open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menú">
            <i />
            <i />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.8, ease: ease('premium') }}
          >
            {LINKS.map(([l, h], i) => (
              <motion.a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: ease('premium') }}
              >
                <span className="mono">0{i + 1}</span>
                {l}
              </motion.a>
            ))}
            <div className="mobile-menu__foot">
              <a href={BUSINESS.phoneHref} className="btn btn--red">Llamar {BUSINESS.phone}</a>
              <a href={waLink()} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 0 1-1.44-5.03c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44M20.1 3.9A11.3 11.3 0 0 0 12.05.6C5.77.6.67 5.7.66 11.97c0 2 .52 3.96 1.52 5.68L.57 23.5l6-1.57a11.34 11.34 0 0 0 5.48 1.4h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.33-8.05" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Escríbenos por WhatsApp"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 3.2, type: 'spring', stiffness: 200, damping: 14 }}
      whileHover={{ scale: 1.08 }}
    >
      <WhatsIcon size={28} />
      <span className="wa-float__tip">¿Tu equipo falló? Escríbenos</span>
    </motion.a>
  );
}
