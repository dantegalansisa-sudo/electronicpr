import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { SERVICES, waLink } from '../data';
import { Eyebrow, RevealText, gridContainer, gridItem } from '../components/fx';
import { Arrow } from '../components/Chrome';

function useIsDesktop() {
  const [d, setD] = useState(() => typeof window !== 'undefined' && window.innerWidth > 960);
  useLayoutEffect(() => {
    const f = () => setD(window.innerWidth > 960);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return d;
}

function ServiceCard({ s, i }: { s: (typeof SERVICES)[number]; i: number }) {
  return (
    <motion.article
      className={`svc svc--${s.tone}`}
     
      variants={gridItem}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.35 }}
    >
      <div className="svc__glow" />
      <header className="svc__head">
        <span className="svc__num mono">{s.num}</span>
        <span className="svc__kicker mono">{s.kicker}</span>
      </header>
      <div className={`svc__media ${s.cutout ? 'svc__media--cutout' : ''}`}>
        <img src={s.img} alt={s.title} loading="lazy" />
      </div>
      <div className="svc__body">
        <h3>{s.title}</h3>
        <p>{s.desc}</p>
        <ul>
          {s.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <a className="svc__link" href={waLink(`Hola Tecnotronics, me interesa: ${s.title}.`)} target="_blank" rel="noopener noreferrer">
          Cotizar ahora <Arrow />
        </a>
      </div>
      <span className="svc__index" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
    </motion.article>
  );
}

export default function Services() {
  const desktop = useIsDesktop();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDist(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 600);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="services" id="servicios">
      <div
        ref={wrapRef}
        className="services__wrap"
        style={desktop ? { height: `calc(100vh + ${dist}px)` } : undefined}
      >
        <div className="services__sticky">
          <div className="services__bg" aria-hidden>
            <div className="aurora aurora--blue" />
            <div className="noise" />
          </div>
          <motion.div
            ref={trackRef}
            className="services__track"
            style={desktop ? { x } : undefined}
            variants={gridContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="services__intro">
              <Eyebrow light>Servicios</Eyebrow>
              <RevealText tag="h2" className="h-display h-display--light" accent={[4]}>
                Todo lo que tu oficina necesita, en un solo lugar.
              </RevealText>
              <p className="lead lead--light">
                Desde una impresora que se atasca hasta la flota completa de tu empresa. Técnicos especializados,
                piezas de calidad y un estimado gratis antes de empezar.
              </p>
              {desktop && (
                <div className="services__hint mono">
                  <span>Desliza</span>
                  <i />
                </div>
              )}
            </div>
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.id} s={s} i={i} />
            ))}
            <div className="services__end">
              <p className="mono">¿No ves tu equipo?</p>
              <h3>Si conecta, imprime o computa, <span className="serif-accent">lo reparamos.</span></h3>
              <a className="btn btn--lime" href={waLink('Hola Tecnotronics, tengo un equipo que necesita reparación.')} target="_blank" rel="noopener noreferrer">
                Cuéntanos qué tienes <Arrow />
              </a>
            </div>
          </motion.div>
          {desktop && (
            <div className="services__progress">
              <motion.i style={{ scaleX: bar }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
