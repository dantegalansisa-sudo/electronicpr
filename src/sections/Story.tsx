import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  MotionValue,
} from 'framer-motion';
import { BRANDS } from '../data';
import { Eyebrow, Spiral } from '../components/fx';
import { ease } from '../utils/easings';

/* ───────── Marquee con velocidad de scroll ───────── */
function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

function VelocityRow({ base, children }: { base: number; children: React.ReactNode }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);
  useAnimationFrame((_, delta) => {
    let m = dir.current * base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    m += dir.current * m * f;
    x.set(x.get() + m);
  });
  return (
    <div className="marquee__row">
      <motion.div className="marquee__track" style={{ x: tx }}>
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function BrandMarquee() {
  const items = BRANDS.map((b, i) => (
    <span key={b + i} className="marquee__item">
      {b}
      <Spiral size={34} />
    </span>
  ));
  return (
    <section className="marquee" aria-label="Marcas que reparamos">
      <p className="marquee__label mono">Reparamos todas las marcas</p>
      <VelocityRow base={-2.2}>{items}</VelocityRow>
      <VelocityRow base={2.2}>
        {['Impresoras', 'Copiadoras', 'Computadoras', 'Tóner', 'Mantenimiento', 'Venta'].map((t) => (
          <span key={t} className="marquee__item marquee__item--outline">
            {t}
            <em>✦</em>
          </span>
        ))}
      </VelocityRow>
    </section>
  );
}

/* ───────── Manifiesto con píldoras ───────── */
const MANIFESTO =
  'En Tecnotronics de Puerto Rico reparamos y vendemos los equipos que hacen funcionar tu negocio. Creemos que la tecnología debe trabajar para ti: por eso diagnosticamos con honestidad, cotizamos gratis y te devolvemos tu equipo listo para producir.';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const color = useTransform(progress, range, ['#9aa0ad', '#07080c']);
  return (
    <span className="mword">
      <motion.span style={{ opacity, color }}>{children}</motion.span>{' '}
    </span>
  );
}

export function Manifesto() {
  const pillsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pp } = useScroll({ target: pillsRef, offset: ['start end', 'center center'] });
  const xLeft = useTransform(pp, [0, 1], [-260, 0]);
  const xRight = useTransform(pp, [0, 1], [260, 0]);
  const rot = useTransform(pp, [0, 1], [-160, 0]);

  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress: tp } = useScroll({ target: textRef, offset: ['start 0.85', 'end 0.45'] });
  const words = MANIFESTO.split(' ');

  return (
    <section className="manifesto" id="nosotros">
      <div className="container">
        <Eyebrow>Sobre Tecnotronics</Eyebrow>

        <div className="pills" ref={pillsRef}>
          <div className="pills__row">
            <motion.div className="pill pill--outline" style={{ x: xLeft }}>
              Tecnología
            </motion.div>
            <motion.div className="pill-orb pill-orb--img" style={{ x: xRight }}>
              <img src="img/repair-hands.jpg" alt="Técnico reparando una placa" loading="lazy" />
            </motion.div>
            <motion.div className="pill-chip glass-light" style={{ x: xRight }}>
              <span className="pill-chip__dot" /> <b>Problema</b>
              <small>Resuelto</small>
            </motion.div>
          </div>
          <div className="pills__row pills__row--2">
            <motion.div className="pill-orb pill-orb--spiral" style={{ rotate: rot }}>
              <Spiral size={120} />
            </motion.div>
            <motion.div className="pill pill--blue" style={{ x: xRight }}>
              que funciona,
            </motion.div>
          </div>
          <div className="pills__row pills__row--3">
            <motion.div className="pill-orb pill-orb--img pill-orb--sm" style={{ x: xLeft }}>
              <img src="img/board.jpg" alt="Placa electrónica" loading="lazy" />
            </motion.div>
            <motion.div className="pill pill--white" style={{ x: xLeft }}>
              <span className="serif-accent">siempre.</span>
            </motion.div>
            <motion.div className="pill-orb pill-orb--lime" style={{ x: xRight }}>
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#07080c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            </motion.div>
          </div>
          <svg className="pills__line" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d="M960 40 C 1010 140, 980 250, 720 270 L 420 270"
              fill="none" stroke="#2b4cff" strokeWidth="2" strokeDasharray="6 8"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ duration: 2, ease: ease('smooth') }}
            />
          </svg>
        </div>

        <div className="manifesto__grid">
          <p className="manifesto__text" ref={textRef}>
            {words.map((w, i) => {
              const start = i / words.length;
              return (
                <Word key={i} progress={tp} range={[start, start + 1 / words.length]}>
                  {w}
                </Word>
              );
            })}
          </p>
          <aside className="manifesto__side">
            <div className="side-stat">
              <span className="side-stat__n">Todas</span>
              <span className="side-stat__l">las marcas de impresoras, copiadoras y computadoras</span>
            </div>
            <div className="side-stat">
              <span className="side-stat__n">24h</span>
              <span className="side-stat__l">Servicio disponible cuando tu oficina lo necesita</span>
            </div>
            <div className="side-stat">
              <span className="side-stat__n">PR</span>
              <span className="side-stat__l">Equipo local en San Juan, Puerto Rico</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
