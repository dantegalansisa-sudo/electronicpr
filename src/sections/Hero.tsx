import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ease } from '../utils/easings';
import { BUSINESS, Device, waLink } from '../data';
import { Arrow } from '../components/Chrome';
import { Spiral } from '../components/fx';

function useIsMobile(bp = 760) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth <= bp);
  useEffect(() => {
    const f = () => setM(window.innerWidth <= bp);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return m;
}

const goTo = (id: string, device?: Device) => {
  if (device) window.dispatchEvent(new CustomEvent('tp:device', { detail: device }));
  const el = document.getElementById(id);
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (el) lenis ? lenis.scrollTo(el, { offset: -20, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
};

function Stars() {
  return (
    <span className="hx__stars" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.2 5.8 20.9l1.6-7L2 9.2l7.1-.6z" /></svg>
      ))}
    </span>
  );
}

/* ───────── Tarjetas flotantes del arco ───────── */
type CardDef = { key: string; w: number; h: number; render: () => JSX.Element; onClick?: () => void };

const CARDS: CardDef[] = [
  {
    key: 'photo-a', w: 120, h: 200,
    render: () => <img className="hx-c__cover" src="img/repair-hands.jpg" alt="" />,
  },
  {
    key: 'estimado', w: 168, h: 210,
    render: () => (
      <div className="hx-c__pad">
        <span className="hx-c__k">Estimado</span>
        <b className="hx-c__big">$0</b>
        <div className="hx-c__bars" aria-hidden>{[38, 62, 46, 80, 58, 92].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        <span className="hx-c__s">Sin compromiso</span>
      </div>
    ),
  },
  {
    key: 'tech', w: 176, h: 228,
    render: () => (
      <>
        <img className="hx-c__cover" src="img/repair-laptop.jpg" alt="Técnico de Tecnotronics" />
        <div className="hx-c__glass">
          <span>Técnicos</span>
          <b>Especializados</b>
        </div>
      </>
    ),
  },
  {
    key: 'printer', w: 196, h: 236, onClick: () => goTo('diagnostico', 'impresora'),
    render: () => (
      <div className="hx-c__pad hx-c__pad--prod">
        <span className="hx-c__k">Impresoras</span>
        <img className="hx-c__prod" src="img/printer-hp.png" alt="Impresora" />
        <span className="hx-c__s">Láser · Inkjet</span>
      </div>
    ),
  },
  {
    key: 'core', w: 236, h: 256,
    render: () => (
      <div className="hx-c__pad hx-c__pad--core">
        <Spiral size={34} />
        <p>
          Diagnóstico <em>honesto</em> que combina experiencia, piezas originales y servicio{' '}
          <em>24/7</em>.
        </p>
        <span className="hx-c__s">Tecnotronics · San Juan</span>
      </div>
    ),
  },
  {
    key: 'diag', w: 196, h: 236, onClick: () => goTo('diagnostico'),
    render: () => (
      <div className="hx-c__pad hx-c__pad--diag">
        <span className="hx-c__plus" aria-hidden>+</span>
        <b>Pre-diagnóstico</b>
        <span className="hx-c__s">Descubre qué tiene tu equipo en 1 minuto</span>
      </div>
    ),
  },
  {
    key: 'laptop', w: 176, h: 228, onClick: () => goTo('diagnostico', 'computadora'),
    render: () => (
      <div className="hx-c__pad hx-c__pad--prod">
        <span className="hx-c__k">Computadoras</span>
        <img className="hx-c__prod" src="img/laptop.png" alt="Laptop" />
        <span className="hx-c__s">SSD · RAM · Pantallas</span>
      </div>
    ),
  },
  {
    key: 'h24', w: 168, h: 210,
    render: () => (
      <div className="hx-c__pad hx-c__pad--lime">
        <span className="hx-c__k">Disponibles</span>
        <b className="hx-c__big">24/7</b>
        <span className="hx-c__s"><span className="live-dot" /> Respondemos hoy</span>
      </div>
    ),
  },
  {
    key: 'photo-b', w: 120, h: 200,
    render: () => <img className="hx-c__cover" src="img/board.jpg" alt="" />,
  },
];

function Arc({ ready, compact }: { ready: boolean; compact?: boolean }) {
  const mid = (CARDS.length - 1) / 2;
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [5, -5]);

  return (
    <div
      className={`hx__arc ${compact ? 'hx__arc--compact' : ''}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
      }}
      onMouseLeave={() => mx.set(0)}
    >
      <motion.div className="hx__arc-inner" style={{ rotateY: rotY }}>
        {CARDS.map((c, i) => {
          const d = i - mid; // -4 … 4
          const ad = Math.abs(d);
          const rot = -d * 6;
          const z = 0;
          const y = ad * ad * 3;
          const Tag = c.onClick ? motion.button : motion.div;
          return (
            <Tag
              key={c.key}
              className={`hx-c hx-c--${c.key}`}
              style={{ width: c.w, height: c.h }}
              onClick={c.onClick}
              initial={{ opacity: 0, y: 140, rotateY: rot, z, scale: 0.9 }}
              animate={ready ? { opacity: 1, y, rotateY: rot, z, scale: 1 } : {}}
              transition={{ duration: 1.3, delay: 0.55 + ad * 0.09, ease: ease('premium') }}
              whileHover={{ y: y - 12, transition: { duration: 0.4, ease: ease('smooth') } }}
            >
              <span className="hx-c__float" style={{ animationDelay: `${i * -0.7}s` }}>
                {c.render()}
              </span>
            </Tag>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ═════════════ DESKTOP ═════════════ */
function HeroDesktop({ ready }: { ready: boolean }) {
  const { scrollYProgress } = useScroll();
  const yArc = useTransform(scrollYProgress, [0, 0.15], [0, 70]);
  const yHead = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  const up = (d: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, delay: d, ease: ease('premium') },
  });

  return (
    <section className="hx" id="top">
      <div className="hx__frame">
        <div className="hx__sky" aria-hidden>
          <span className="hx__cloud hx__cloud--1" />
          <span className="hx__cloud hx__cloud--2" />
          <span className="hx__cloud hx__cloud--3" />
          <span className="hx__cloud hx__cloud--4" />
        </div>

        <motion.div className="hx__head" style={{ y: yHead }}>
          <motion.span className="hx__eyebrow" {...up(0.1)}>
            <span className="live-dot" /> Servicio técnico 24/7 · San Juan, PR
          </motion.span>

          <h1 className="hx__title" aria-label="Reparamos tu oficina con precisión">
            <span className="hx__mask">
              <motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, delay: 0.15, ease: ease('premium') }}>
                Reparamos
                <span className="hx__inline hx__inline--img" aria-hidden>
                  <img src="img/printer-hp.png" alt="" />
                </span>
                tu oficina
              </motion.span>
            </span>
            <span className="hx__mask">
              <motion.span className="hx__soft" initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, delay: 0.27, ease: ease('premium') }}>
                con
                <span className="hx__inline hx__inline--lime" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                </span>
                precisión
              </motion.span>
            </span>
          </h1>

          <motion.p className="hx__desc" {...up(0.45)}>
            Reparación y venta de impresoras, copiadoras y computadoras de todas las marcas. Diagnóstico honesto y
            estimado gratis antes de tocar una sola pieza.
          </motion.p>

          <motion.div className="hx__ctas" {...up(0.55)}>
            <button className="hx__btn hx__btn--ghost" onClick={() => goTo('diagnostico')}>
              Diagnosticar mi equipo
            </button>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hx__btn hx__btn--solid">
              Estimado gratis
              <span className="hx__btn-icon"><Arrow /></span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="hx__stage" style={{ y: yArc }}>
          <Arc ready={ready} />
        </motion.div>

        <motion.div className="hx__trust" {...up(1.2)}>
          <span>Canon · HP · Brother · Epson · Xerox · Ricoh y más</span>
          <Stars />
        </motion.div>
      </div>
    </section>
  );
}

/* ═════════════ MÓVIL · WEB APP ═════════════ */
const EQUIPOS = [
  { id: 'impresora' as Device, label: 'Impresoras', img: 'img/printer-hp.png' },
  { id: 'copiadora' as Device, label: 'Copiadoras', img: 'img/printer-mfp.png' },
  { id: 'computadora' as Device, label: 'Computadoras', img: 'img/laptop.png' },
];

const TILES: { d: Device | 'toner'; label: string; sub: string; tone: string; icon: JSX.Element }[] = [
  { d: 'impresora', label: 'Impresora', sub: 'Atascos, manchas', tone: 'sky', icon: <><path d="M6 9V3h12v6" /><rect x="2" y="9" width="20" height="9" rx="2" /><rect x="6" y="14" width="12" height="7" /></> },
  { d: 'copiadora', label: 'Copiadora', sub: 'Escáner, ADF', tone: 'lav', icon: <><rect x="3" y="3" width="18" height="6" rx="1" /><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 15h10M7 18h6" /></> },
  { d: 'computadora', label: 'Computadora', sub: 'Lenta, pantalla', tone: 'lime', icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /></> },
  { d: 'toner', label: 'Tóner y más', sub: 'Suministros', tone: 'white', icon: <><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7V5h10v2M7 12h4" /></> },
];

function HeroMobile({ ready }: { ready: boolean }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!ready || !auto) return;
    const t = setInterval(() => setI((x) => (x + 1) % EQUIPOS.length), 4500);
    return () => clearInterval(t);
  }, [ready, auto]);
  const eq = EQUIPOS[i];

  const up = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.8, delay: d, ease: ease('premium') },
  });
  const tap = (d: Device | 'toner') => {
    if (d === 'toner') window.open(waLink('Hola Tecnotronics, necesito tóner / suministros para mi equipo.'), '_blank');
    else goTo('diagnostico', d);
  };

  return (
    <section className="hxm" id="top">
      <div className="hx__sky" aria-hidden>
        <span className="hx__cloud hx__cloud--1" />
        <span className="hx__cloud hx__cloud--2" />
      </div>

      <motion.span className="hx__eyebrow" {...up(0.1)}>
        <span className="live-dot" /> Técnicos disponibles · 24/7
      </motion.span>

      <h1 className="hxm__title">
        <span className="hx__mask"><motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1, delay: 0.15, ease: ease('premium') }}>Reparamos</motion.span></span>
        <span className="hx__mask"><motion.span initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1, delay: 0.22, ease: ease('premium') }}>tu oficina</motion.span></span>
        <span className="hx__mask"><motion.span className="hx__soft" initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1, delay: 0.3, ease: ease('premium') }}>con precisión</motion.span></span>
      </h1>

      <motion.p className="hxm__desc" {...up(0.4)}>
        Impresoras, copiadoras y computadoras. Estimado gratis antes de tocar una sola pieza.
      </motion.p>

      <motion.div className="hxm__stage" {...up(0.45)}>
        <div className="hxm__chip hxm__chip--l"><b>$0</b><span>Estimado</span></div>
        <div className="hxm__chip hxm__chip--r"><span className="live-dot" /> 24/7</div>
        <AnimatePresence mode="wait">
          <motion.img
            key={eq.img}
            src={eq.img}
            alt={eq.label}
            className="hxm__product"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: ease('premium') }}
          />
        </AnimatePresence>
        <div className="hxm__seg">
          {EQUIPOS.map((e, n) => (
            <button key={e.id} className={n === i ? 'on' : ''} onClick={() => { setAuto(false); setI(n); }}>
              {n === i && <motion.span layoutId="hxmseg" className="hxm__seg-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              {e.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.p className="hxm__label" {...up(0.5)}>¿Qué equipo te está fallando?</motion.p>
      <div className="hxm__grid">
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

      <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" className="hxm__cta" {...up(0.8)}>
        <span>
          <b>Estimado gratis</b>
          <small>Respuesta por WhatsApp en minutos</small>
        </span>
        <span className="hxm__cta-icon"><Arrow /></span>
      </motion.a>
      <motion.a href={BUSINESS.phoneHref} className="hxm__call" {...up(0.9)}>
        o llama al <b>{BUSINESS.phone}</b>
      </motion.a>
    </section>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  return useIsMobile() ? <HeroMobile ready={ready} /> : <HeroDesktop ready={ready} />;
}
