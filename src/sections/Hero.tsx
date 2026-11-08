import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ease } from '../utils/easings';
import { BUSINESS, Device, waLink } from '../data';
import { Arrow } from '../components/Chrome';

function useIsMobile(bp = 760) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth <= bp);
  useEffect(() => {
    const f = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return m;
}

const EQUIPOS = [
  { id: 'impresora' as Device, label: 'Impresoras', img: 'img/printer-hp.png', note: 'Láser · Inkjet · Multifuncional' },
  { id: 'copiadora' as Device, label: 'Copiadoras', img: 'img/printer-mfp.png', note: 'Alto volumen · Escáner · ADF' },
  { id: 'computadora' as Device, label: 'Computadoras', img: 'img/laptop.png', note: 'Laptops · Desktops · Upgrades' },
];

/** Rota el equipo destacado cada 4.5 s; un clic del usuario detiene la rotación */
function useEquipo(ready: boolean) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!ready || !auto) return;
    const t = setInterval(() => setI((x) => (x + 1) % EQUIPOS.length), 4500);
    return () => clearInterval(t);
  }, [ready, auto]);
  return { i, pick: (n: number) => { setAuto(false); setI(n); } };
}

const goDiagnostico = (d: Device) => {
  window.dispatchEvent(new CustomEvent('tp:device', { detail: d }));
  const el = document.getElementById('diagnostico');
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (el) lenis ? lenis.scrollTo(el, { offset: -20, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
};

function Squiggle() {
  return (
    <svg className="squiggle" viewBox="0 0 120 22" fill="none" aria-hidden>
      <motion.path
        d="M2 15c14-10 22 6 36-2s20-12 32-2 22 8 30-2 10-4 18-2"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 1.3, ease: ease('smooth') }}
      />
    </svg>
  );
}

/* ═════════════ DESKTOP ═════════════ */
function HeroDesktop({ ready }: { ready: boolean }) {
  const { i, pick } = useEquipo(ready);
  const eq = EQUIPOS[i];
  const { scrollYProgress } = useScroll();
  const yImg = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
  const yBlock = useTransform(scrollYProgress, [0, 0.15], [0, 30]);

  const up = (d: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, delay: d, ease: ease('premium') },
  });

  return (
    <section className="hl" id="top">
      <div className="hl__wash" aria-hidden />

      <h1 className="hl__title" aria-label="Reparamos tu oficina con precisión">
        <span className="hl__mask">
          <motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, delay: 0.1, ease: ease('premium') }}>
            REPARAMOS
          </motion.span>
        </span>
        <span className="hl__mask">
          <motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, delay: 0.2, ease: ease('premium') }}>
            TU OFICINA
          </motion.span>
        </span>
        <motion.span
          className="hl__script"
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={ready ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1.4, delay: 0.75, ease: ease('smooth') }}
        >
          con precisión
        </motion.span>
      </h1>

      <div className="hl__grid">
        {/* Columna izquierda */}
        <div className="hl__left">
          <motion.div {...up(0.6)}>
            <span className="hl__label">Todas las marcas</span>
            <div className="hl__avatars">
              <img src="img/repair-hands.jpg" alt="" />
              <img src="img/board.jpg" alt="" />
              <img src="img/repair-laptop.jpg" alt="" />
              <span>+12</span>
            </div>
            <Squiggle />
          </motion.div>
          <motion.p className="hl__desc" {...up(0.75)}>
            Reparación y venta de impresoras, copiadoras y computadoras en San Juan. Diagnóstico honesto y estimado
            gratis antes de tocar una sola pieza.
          </motion.p>
          <motion.div className="hl__ctas" {...up(0.85)}>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn--navy btn--lg">
              Pide tu estimado gratis <Arrow />
            </a>
            <a href={BUSINESS.phoneHref} className="hl__call">o llama al <b>{BUSINESS.phone}</b></a>
          </motion.div>
        </div>

        {/* Bloque central con el equipo */}
        <div className="hl__center">
          <motion.div
            className="hl__block"
            style={{ y: yBlock }}
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.35, ease: ease('premium') }}
          >
            <span className="hl__ring hl__ring--1" />
            <span className="hl__ring hl__ring--2" />
            <AnimatePresence mode="wait">
              <motion.span
                key={eq.note}
                className="hl__note"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {eq.note}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.div className="hl__product" style={{ y: yImg }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={eq.img}
                src={eq.img}
                alt={eq.label}
                initial={{ opacity: 0, y: 60, scale: 0.94 }}
                animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
                exit={{ opacity: 0, y: -30, scale: 0.97 }}
                transition={{ duration: 0.8, delay: ready && i === 0 ? 0.55 : 0, ease: ease('premium') }}
              />
            </AnimatePresence>
          </motion.div>

          <motion.div className="hl__pills" {...up(1)}>
            {EQUIPOS.map((e, n) => (
              <button key={e.id} className={`hl__pill ${n === i ? 'hl__pill--on' : ''}`} onClick={() => pick(n)}>
                {n === i && <motion.span layoutId="hlpill" className="hl__pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                {e.label}
              </button>
            ))}
            <button className="hl__pill hl__pill--ghost" onClick={() => goDiagnostico(eq.id)}>
              Diagnosticar <Arrow />
            </button>
          </motion.div>
        </div>

        {/* Columna derecha */}
        <div className="hl__right">
          <motion.div className="hl__card" {...up(0.7)}>
            <div className="hl__card-img">
              <img src="img/repair-laptop.jpg" alt="Técnico de Tecnotronics trabajando" />
            </div>
            <p>“Te decimos qué tiene tu equipo antes de cobrarte un centavo.”</p>
            <span className="hl__card-sign">Equipo Tecnotronics</span>
          </motion.div>
          <motion.div className="hl__badge" {...up(0.9)}>
            <span className="hl__badge-script">24/7</span>
            <span>Servicio disponible<br />en San Juan, PR</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════ MÓVIL · WEB APP ═════════════ */
const TILES: { d: Device | 'toner'; label: string; sub: string; tone: string; icon: JSX.Element }[] = [
  { d: 'impresora', label: 'Impresora', sub: 'Atascos, manchas', tone: 'sky', icon: <><path d="M6 9V3h12v6" /><rect x="2" y="9" width="20" height="9" rx="2" /><rect x="6" y="14" width="12" height="7" /></> },
  { d: 'copiadora', label: 'Copiadora', sub: 'Escáner, ADF', tone: 'lav', icon: <><rect x="3" y="3" width="18" height="6" rx="1" /><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 15h10M7 18h6" /></> },
  { d: 'computadora', label: 'Computadora', sub: 'Lenta, pantalla', tone: 'lime', icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /></> },
  { d: 'toner', label: 'Tóner y más', sub: 'Suministros', tone: 'white', icon: <><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7V5h10v2M7 12h4" /></> },
];

function HeroMobile({ ready }: { ready: boolean }) {
  const { i, pick } = useEquipo(ready);
  const eq = EQUIPOS[i];
  const up = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay: d, ease: ease('premium') },
  });
  const tap = (d: Device | 'toner') => {
    if (d === 'toner') window.open(waLink('Hola Tecnotronics, necesito tóner / suministros para mi equipo.'), '_blank');
    else goDiagnostico(d);
  };

  return (
    <section className="hml" id="top">
      <motion.div className="hml__status" {...up(0.1)}>
        <span className="live-dot" /> Técnicos disponibles · 24/7
      </motion.div>

      <h1 className="hml__title">
        <span className="hl__mask"><motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1, delay: 0.15, ease: ease('premium') }}>Reparamos</motion.span></span>
        <span className="hl__mask"><motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1, delay: 0.25, ease: ease('premium') }}>tu oficina</motion.span></span>
        <motion.span className="hml__script" initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={ready ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}} transition={{ duration: 1.2, delay: 0.6 }}>
          con precisión
        </motion.span>
      </h1>

      <motion.div className="hml__stage" {...up(0.35)}>
        <div className="hml__block" />
        <AnimatePresence mode="wait">
          <motion.img
            key={eq.img}
            src={eq.img}
            alt={eq.label}
            className="hml__product"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: ease('premium') }}
          />
        </AnimatePresence>
        <div className="hml__seg">
          {EQUIPOS.map((e, n) => (
            <button key={e.id} className={n === i ? 'on' : ''} onClick={() => pick(n)}>
              {n === i && <motion.span layoutId="hmlseg" className="hml__seg-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              {e.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.p className="hml__label" {...up(0.5)}>¿Qué equipo te está fallando?</motion.p>
      <div className="hml__grid">
        {TILES.map((t, n) => (
          <motion.button
            key={t.d}
            className={`mtile mtile--${t.tone}`}
            onClick={() => tap(t.d)}
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 + n * 0.07, ease: ease('premium') }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="mtile__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
            </span>
            <span className="mtile__label">{t.label}</span>
            <span className="mtile__sub">{t.sub}</span>
          </motion.button>
        ))}
      </div>

      <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" className="hml__cta" {...up(0.8)}>
        <span>
          <b>Estimado gratis</b>
          <small>Respuesta por WhatsApp en minutos</small>
        </span>
        <span className="hml__cta-icon"><Arrow /></span>
      </motion.a>
    </section>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  return useIsMobile() ? <HeroMobile ready={ready} /> : <HeroDesktop ready={ready} />;
}
