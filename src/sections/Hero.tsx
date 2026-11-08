import { useEffect } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ease } from '../utils/easings';
import { BUSINESS, waLink } from '../data';
import { MagneticButton, RevealText } from '../components/fx';
import { Arrow } from '../components/Chrome';

export default function Hero({ ready }: { ready: boolean }) {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.18], [1, 1.15]);
  const yImg = useTransform(scrollYProgress, [0, 0.18], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 0.18], [0, -80]);

  // tilt 3D con el mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 20 });
  const smy = useSpring(my, { stiffness: 80, damping: 20 });
  const rotY = useTransform(smx, [-1, 1], [-12, 12]);
  const rotX = useTransform(smy, [-1, 1], [8, -8]);
  const l1x = useTransform(smx, [-1, 1], [-30, 30]);
  const l1y = useTransform(smy, [-1, 1], [-20, 20]);
  const l2x = useTransform(smx, [-1, 1], [24, -24]);
  const l2y = useTransform(smy, [-1, 1], [18, -18]);

  useEffect(() => {
    const f = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', f);
    return () => window.removeEventListener('mousemove', f);
  }, [mx, my]);

  const show = ready ? 'show' : 'hide';
  const d = (delay: number) => ({
    hide: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { delay, duration: 1, ease: ease('premium') } },
  });

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden>
        <div className="aurora aurora--red" />
        <div className="aurora aurora--blue" />
        <div className="aurora aurora--violet" />
        <div className="hero__grid" />
        <div className="noise" />
      </div>

      <motion.div className="hero__content" style={{ opacity: fade, y: yText }}>
        <motion.div className="hero__badge" variants={d(0.1)} initial="hide" animate={show}>
          <span className="live-dot" /> Servicio 24 horas · San Juan, Puerto Rico
        </motion.div>

        {ready && (
          <RevealText tag="h1" className="hero__title" delay={0.15} accent={[3]} immediate>
            Reparamos lo que mueve tu oficina.
          </RevealText>
        )}
        {!ready && <h1 className="hero__title" style={{ opacity: 0 }}>Reparamos lo que mueve tu oficina.</h1>}

        <motion.p className="hero__sub" variants={d(0.7)} initial="hide" animate={show}>
          Impresoras, copiadoras y computadoras de <strong>todas las marcas</strong>. Diagnóstico experto,
          estimado <strong>gratis</strong> y técnicos listos cuando tu negocio lo necesita.
        </motion.p>

        <motion.div className="hero__ctas" variants={d(0.85)} initial="hide" animate={show}>
          <MagneticButton href={waLink()} target="_blank" className="btn btn--lime btn--lg" cursor="WhatsApp">
            Pide tu estimado gratis <span className="btn__icon"><Arrow /></span>
          </MagneticButton>
          <MagneticButton href={BUSINESS.phoneHref} className="btn btn--glass btn--lg" strength={0.25}>
            Llamar {BUSINESS.phone}
          </MagneticButton>
        </motion.div>

        <motion.ul className="hero__trust" variants={d(1)} initial="hide" animate={show}>
          <li><b>$0</b> Estimado</li>
          <li><b>24/7</b> Servicio</li>
          <li><b>+12</b> Marcas</li>
        </motion.ul>
      </motion.div>

      <motion.div className="hero__visual" style={{ scale, y: yImg }}>
        <motion.div
          className="hero__stage"
          style={{ rotateX: rotX, rotateY: rotY }}
          initial={{ opacity: 0, scale: 0.85, y: 80 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease: ease('premium') }}
        >
          <div className="hero__halo" />
          <div className="hero__ring hero__ring--1" />
          <div className="hero__ring hero__ring--2" />
          <img src="img/printer-mfp.png" alt="Impresora multifuncional reparada por Tecnotronics" className="hero__printer" />
          <div className="hero__floor" />
          <motion.div
            className="hero__paper"
            initial={{ y: -40, opacity: 0 }}
            animate={ready ? { y: [-40, 30, 30], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.2, delay: 2, ease: 'easeInOut' }}
          >
            <i /><i /><i /><b />
          </motion.div>
        </motion.div>

        {/* tarjetas flotantes */}
        <motion.div className="float-card fc--diag glass" style={{ x: l1x, y: l1y }}
          initial={{ opacity: 0, x: -40 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.1, duration: 1, ease: ease('premium') }}>
          <span className="fc__label mono">Diagnóstico</span>
          <span className="fc__value">Fusor · OK</span>
          <span className="fc__bar"><motion.i initial={{ scaleX: 0 }} animate={ready ? { scaleX: 1 } : {}} transition={{ delay: 1.6, duration: 2.2, ease: ease('smooth') }} /></span>
          <span className="fc__foot mono">100% completado ✓</span>
        </motion.div>

        <motion.div className="float-card fc--price" style={{ x: l2x, y: l2y }}
          initial={{ opacity: 0, y: 40 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.3, duration: 1, ease: ease('premium') }}>
          <span className="fc__label mono">Estimado</span>
          <span className="fc__big">$0</span>
          <span className="fc__foot">Gratis y sin compromiso</span>
        </motion.div>

        <motion.div className="float-card fc--live glass" style={{ x: l2x, y: l1y }}
          initial={{ opacity: 0, x: 40 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.5, duration: 1, ease: ease('premium') }}>
          <span className="live-dot" />
          <div>
            <span className="fc__value">Técnico disponible</span>
            <span className="fc__foot mono">Respuesta en minutos</span>
          </div>
        </motion.div>

        <motion.div className="float-card fc--brands glass" style={{ x: l1x, y: l2y }}
          initial={{ opacity: 0, y: 40 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.7, duration: 1, ease: ease('premium') }}>
          <div className="fc__chips">
            {['C', 'HP', 'B', 'E', 'X'].map((c) => <span key={c}>{c}</span>)}
          </div>
          <span className="fc__foot">Todas las marcas</span>
        </motion.div>
      </motion.div>

      <motion.a href="#servicios" className="hero__scroll mono" style={{ opacity: fade }} aria-label="Bajar">
        <span>Scroll</span>
        <i />
      </motion.a>
    </section>
  );
}
