import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { STEPS } from '../data';
import { Eyebrow, RevealText } from '../components/fx';
import { ease } from '../utils/easings';

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length * 0.999)));
  });
  const paperH = useTransform(scrollYProgress, [0, 0.95], ['8%', '100%']);
  const lightOp = useTransform(scrollYProgress, (v) => (Math.sin(v * 80) > 0 ? 1 : 0.35));
  const cloudX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const cloudX2 = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  return (
    <section className="process" id="proceso">
      <div className="process__wrap" ref={ref}>
        <div className="process__sticky">
          <div className="sky" aria-hidden>
            <motion.div className="cloud cloud--1" style={{ x: cloudX }} />
            <motion.div className="cloud cloud--2" style={{ x: cloudX2 }} />
            <motion.div className="cloud cloud--3" style={{ x: cloudX }} />
          </div>

          <div className="container process__grid">
            <div className="process__left">
              <Eyebrow light>Cómo trabajamos</Eyebrow>
              <RevealText tag="h2" className="h-display h-display--light" accent={[3]}>
                Cuatro pasos, cero complicaciones.
              </RevealText>
              <div className="process__steps">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.n}
                    className={`pstep ${i === active ? 'pstep--active' : ''} ${i < active ? 'pstep--done' : ''}`}
                    animate={{ opacity: i === active ? 1 : 0.45 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="pstep__n mono">{s.n}</span>
                    <div>
                      <h3>{s.t}</h3>
                      <motion.p
                        initial={false}
                        animate={{ height: i === active ? 'auto' : 0, opacity: i === active ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: ease('premium') }}
                      >
                        {s.d}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="process__right" aria-hidden>
              <div className="printer-ill">
                <div className="printer-ill__top">
                  <span className="printer-ill__screen mono">
                    {['LLAMADA', 'DIAGNÓST.', 'ESTIMADO', 'LISTO ✓'][active]}
                  </span>
                  <motion.span className="printer-ill__led" style={{ opacity: lightOp }} />
                  <span className="printer-ill__brand">
                    TECNOTRONICS
                  </span>
                </div>
                <div className="printer-ill__slot" />
              </div>
              <motion.div className="paper" style={{ height: paperH }}>
                <div className="paper__inner">
                  <div className="paper__head">
                    <span className="mono">ORDEN DE SERVICIO</span>
                    <span className="mono">#TPR-2026</span>
                  </div>
                  {STEPS.map((s, i) => (
                    <div key={s.n} className={`paper__row ${i <= active ? 'paper__row--on' : ''}`}>
                      <span className="paper__check">{i < active || (i === active && i === 3) ? '✓' : i === active ? '•' : ''}</span>
                      <span className="paper__t">{s.t}</span>
                      <span className="paper__dots" />
                      <span className="mono paper__s">{i < active || (i === 3 && active === 3) ? 'Hecho' : i === active ? 'En curso' : '—'}</span>
                    </div>
                  ))}
                  <div className="paper__total">
                    <span>Estimado</span>
                    <b>$0.00</b>
                  </div>
                  <div className="paper__barcode" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
