import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ease } from '../utils/easings';
import { BUSINESS, Device, waLink } from '../data';
import { MagneticButton } from '../components/fx';
import { Arrow } from '../components/Chrome';
import Halftone from '../components/Halftone';

function useIsMobile(bp = 760) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth <= bp);
  useEffect(() => {
    const f = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return m;
}

/** Desregistro CMYK: las capas C/M/Y del texto empiezan separadas y se alinean */
function useRegistration(ready: boolean, target: React.RefObject<HTMLElement>) {
  const base = useMotionValue(16);
  const mx = useMotionValue(0);
  const vel = useVelocity(mx);
  const v = useSpring(useTransform(vel, (x) => Math.min(10, Math.abs(x) / 260)), { stiffness: 120, damping: 18 });

  useEffect(() => {
    if (ready) animate(base, 0, { duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] });
  }, [ready, base]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => mx.set(e.clientX + e.clientY);
    window.addEventListener('pointermove', onMove, { passive: true });
    let raf = 0;
    const loop = () => {
      target.current?.style.setProperty('--reg', String(base.get() + v.get()));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [base, v, mx, target]);
}

function PrintStatus({ printed, ready }: { printed: boolean; ready: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const c = animate(0, 100, { duration: 2.6, ease: 'easeOut', onUpdate: (x) => setN(Math.round(x)) });
    return () => c.stop();
  }, [ready]);
  return (
    <span className={`pstatus mono ${printed ? 'pstatus--done' : ''}`}>
      <i />
      {printed ? 'Listo para tu oficina' : `Imprimiendo… ${String(n).padStart(3, '0')}%`}
    </span>
  );
}

const SWATCHES = ['#12c8ff', '#ff3db4', '#ffe14d', '#07080c', '#2b4cff', '#7b5cff', '#d8ff3e', '#eef2ff'];

/* ═════════════ DESKTOP ═════════════ */
function HeroDesktop({ ready }: { ready: boolean }) {
  const [printed, setPrinted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useRegistration(ready, titleRef);

  const { scrollYProgress } = useScroll();
  const scatter = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const yTitle = useTransform(scrollYProgress, [0, 0.15], [0, -140]);
  const fade = useTransform(scrollYProgress, [0, 0.11], [1, 0]);

  const line = (d: number) => ({
    initial: { y: '105%' },
    animate: ready ? { y: 0 } : {},
    transition: { duration: 1.1, delay: d, ease: ease('premium') },
  });
  const up = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay: d, ease: ease('premium') },
  });

  return (
    <section className="hx" id="top">
      <div className="hx__canvas">
        <Halftone
          src="img/printer-mfp.png"
          fit={{ x: 0.56, y: 0.14, w: 0.4, h: 0.66 }}
          spacing={7}
          start={ready}
          onPrinted={() => setPrinted(true)}
          scatter={scatter}
        />
      </div>
      <div className="hx__glow" aria-hidden />
      <div className="noise" aria-hidden />

      {/* marcas de imprenta */}
      <span className="crop crop--tl" aria-hidden />
      <span className="crop crop--tr" aria-hidden />
      <span className="crop crop--bl" aria-hidden />
      <span className="crop crop--br" aria-hidden />
      <svg className="regmark regmark--l" viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="11" /><circle cx="20" cy="20" r="5" /><path d="M20 0v40M0 20h40" />
      </svg>
      <svg className="regmark regmark--r" viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="11" /><circle cx="20" cy="20" r="5" /><path d="M20 0v40M0 20h40" />
      </svg>

      <motion.div className="hx__meta mono" {...up(0.2)}>
        <span>Orden Nº TPR-0926</span>
        <span className="hx__meta-mid">Prueba de impresión · CMYK · 300 DPI</span>
        <PrintStatus printed={printed} ready={ready} />
      </motion.div>

      <motion.div className="hx__main" style={{ y: yTitle, opacity: fade }}>
        <motion.p className="hx__kicker mono" {...up(0.35)}>
          <span className="live-dot" /> Reparación y venta de equipos de oficina · San Juan, PR
        </motion.p>
        <h1 className="hx__title" ref={titleRef} aria-label="Reparamos lo que mueve tu oficina.">
          <span className="hx__line"><motion.span {...line(0.2)} data-t="Reparamos">Reparamos</motion.span></span>
          <span className="hx__line">
            <motion.span {...line(0.32)} data-t="lo que">lo que</motion.span>{' '}
            <motion.span {...line(0.38)} className="hx__serif" data-t="mueve">mueve</motion.span>
          </span>
          <span className="hx__line"><motion.span {...line(0.46)} data-t="tu oficina.">tu oficina.</motion.span></span>
        </h1>
      </motion.div>

      <motion.div className="hx__bottom" style={{ opacity: fade }}>
        <motion.p className="hx__sub" {...up(0.8)}>
          Impresoras, copiadoras y computadoras de <strong>todas las marcas</strong>. Diagnóstico experto y
          un estimado <strong>gratis</strong> antes de tocar una sola pieza.
        </motion.p>
        <motion.div className="hx__ctas" {...up(0.9)}>
          <MagneticButton href={waLink()} target="_blank" className="btn btn--lime btn--lg" cursor="WhatsApp">
            Pide tu estimado gratis <span className="btn__icon"><Arrow /></span>
          </MagneticButton>
          <a href={BUSINESS.phoneHref} className="hx__call mono">
            o llama al <b>{BUSINESS.phone}</b>
          </a>
        </motion.div>
        <motion.dl className="hx__spec" {...up(1)}>
          <div><dt className="mono">Estimado</dt><dd>$0</dd></div>
          <div><dt className="mono">Servicio</dt><dd>24/7</dd></div>
          <div><dt className="mono">Marcas</dt><dd>+12</dd></div>
        </motion.dl>
      </motion.div>

      <div className="hx__bar" aria-hidden>
        {SWATCHES.map((c, i) => (
          <motion.i
            key={c}
            style={{ background: c }}
            initial={{ scaleY: 0 }}
            animate={ready ? { scaleY: 1 } : {}}
            transition={{ delay: 1.2 + i * 0.07, duration: 0.6, ease: ease('premium') }}
          />
        ))}
        <span className="mono">C</span><span className="mono">M</span><span className="mono">Y</span><span className="mono">K</span>
      </div>
      <span className="hx__vert mono" aria-hidden>Tecnotronics — Office Equipment — Puerto Rico</span>
      <span className="hx__hint mono" aria-hidden>Mueve el cursor sobre la impresora</span>
    </section>
  );
}

/* ═════════════ MÓVIL · WEB APP ═════════════ */
const TILES: { d: Device | 'toner'; label: string; sub: string; tone: string; icon: JSX.Element }[] = [
  { d: 'impresora', label: 'Impresora', sub: 'Atascos, manchas, errores', tone: 'cyan', icon: <><path d="M6 9V3h12v6" /><rect x="2" y="9" width="20" height="9" rx="2" /><rect x="6" y="14" width="12" height="7" /></> },
  { d: 'copiadora', label: 'Copiadora', sub: 'Copias, escáner, ADF', tone: 'violet', icon: <><rect x="3" y="3" width="18" height="6" rx="1" /><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 15h10M7 18h6" /></> },
  { d: 'computadora', label: 'Computadora', sub: 'Lenta, pantalla, virus', tone: 'lime', icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /></> },
  { d: 'toner', label: 'Tóner y más', sub: 'Suministros y equipos', tone: 'ice', icon: <><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7V5h10v2M7 12h4" /></> },
];

function HeroMobile({ ready }: { ready: boolean }) {
  const [printed, setPrinted] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useRegistration(ready, titleRef);

  const pick = (d: Device | 'toner') => {
    if (d === 'toner') {
      window.open(waLink('Hola Tecnotronics, necesito tóner / suministros para mi equipo.'), '_blank');
      return;
    }
    window.dispatchEvent(new CustomEvent('tp:device', { detail: d }));
    const el = document.getElementById('diagnostico');
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (el) lenis ? lenis.scrollTo(el, { offset: -20, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
  };

  const up = (d: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay: d, ease: ease('premium') },
  });

  return (
    <section className="hm" id="top">
      <div className="hm__bg" aria-hidden>
        <div className="aurora aurora--blue" />
        <div className="aurora aurora--violet" />
      </div>

      <motion.div className="hm__status" {...up(0.1)}>
        <span className="live-dot" /> Técnicos disponibles · 24/7
      </motion.div>

      <h1 className="hm__title" ref={titleRef}>
        {['¿Qué equipo', 'te está', 'fallando?'].map((w, i) => (
          <span key={w} className="hx__line">
            <motion.span
              data-t={w}
              className={i === 2 ? 'hx__serif' : ''}
              initial={{ y: '105%' }}
              animate={ready ? { y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 + i * 0.1, ease: ease('premium') }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.div className="hm__scanner" {...up(0.35)}>
        <Halftone
          src="img/printer-mfp.png"
          fit={{ x: 0.18, y: 0.2, w: 0.64, h: 0.6 }}
          spacing={5}
          lens={90}
          start={ready}
          printMs={2200}
          onPrinted={() => setPrinted(true)}
        />
        <span className="crop crop--tl" /><span className="crop crop--tr" /><span className="crop crop--bl" /><span className="crop crop--br" />
        <div className="hm__scanner-top mono">
          <span>Escáner TPR</span>
          <span className={`hm__pill ${printed ? 'hm__pill--ok' : ''}`}>{printed ? 'Listo ✓' : 'Escaneando…'}</span>
        </div>
        <div className="hm__scanner-foot mono">Toca un equipo para diagnosticarlo ↓</div>
      </motion.div>

      <div className="hm__grid">
        {TILES.map((t, i) => (
          <motion.button
            key={t.d}
            className={`tile tile--${t.tone}`}
            onClick={() => pick(t.d)}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease: ease('premium') }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
            <span className="tile__label">{t.label}</span>
            <span className="tile__sub">{t.sub}</span>
            <span className="tile__go"><Arrow /></span>
          </motion.button>
        ))}
      </div>

      <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" className="hm__cta" {...up(0.85)}>
        <span>
          <b>Estimado gratis</b>
          <small>Respuesta por WhatsApp en minutos</small>
        </span>
        <span className="hm__cta-icon"><Arrow /></span>
      </motion.a>

      <motion.div className="hm__chips" {...up(0.95)}>
        <span><b>$0</b> Estimado</span>
        <span><b>24/7</b> Servicio</span>
        <span><b>+12</b> Marcas</span>
        <span><b>PR</b> San Juan</span>
      </motion.div>
    </section>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const mobile = useIsMobile();
  return mobile ? <HeroMobile ready={ready} /> : <HeroDesktop ready={ready} />;
}
