import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DIAGNOSTIC, Device, waLink } from '../data';
import { Eyebrow, RevealText } from '../components/fx';
import { WhatsIcon } from '../components/Chrome';
import { ease } from '../utils/easings';

const ICONS: Record<Device, JSX.Element> = {
  impresora: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
  ),
  copiadora: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="6" rx="1" /><rect x="3" y="11" width="18" height="10" rx="1" /><path d="M7 15h10M7 18h6" /></svg>
  ),
  computadora: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /></svg>
  ),
};

const LEVELS = ['', 'Sencillo', 'Moderado', 'Importante', 'Requiere técnico'];

export default function Diagnostic() {
  const [device, setDevice] = useState<Device>('impresora');
  const [issue, setIssue] = useState<string | null>(null);
  const data = DIAGNOSTIC[device];
  const current = data.issues.find((i) => i.id === issue);

  const msg = current
    ? `Hola Tecnotronics, mi ${data.label.toLowerCase()} tiene este problema: "${current.label}". ¿Me pueden dar un estimado gratis?`
    : `Hola Tecnotronics, necesito ayuda con mi ${data.label.toLowerCase()}.`;

  return (
    <section className="diag" id="diagnostico">
      <div className="diag__bg" aria-hidden>
        <div className="aurora aurora--blue" />
        <div className="aurora aurora--violet" />
        <div className="diag__scan" />
        <div className="noise" />
      </div>
      <div className="container">
        <div className="diag__head">
          <Eyebrow light>Pre-diagnóstico en línea</Eyebrow>
          <RevealText tag="h2" className="h-display h-display--light" accent={[4, 5]}>
            ¿Qué le pasa a tu equipo?
          </RevealText>
          <p className="lead lead--light">Selecciona tu equipo y el síntoma. Te damos una idea de la causa y nos envías el caso por WhatsApp en un clic.</p>
        </div>

        <div className="diag__panel glass">
          <div className="diag__step">
            <span className="diag__label mono">01 · Equipo</span>
            <div className="diag__devices">
              {(Object.keys(DIAGNOSTIC) as Device[]).map((d) => (
                <button
                  key={d}
                  className={`device ${device === d ? 'device--on' : ''}`}
                  onClick={() => {
                    setDevice(d);
                    setIssue(null);
                  }}
                >
                  {device === d && <motion.span layoutId="devbg" className="device__bg" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />}
                  <span className="device__icon">{ICONS[d]}</span>
                  <span className="device__name">{DIAGNOSTIC[d].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="diag__step">
            <span className="diag__label mono">02 · Síntoma</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={device}
                className="diag__issues"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: ease('smooth') }}
              >
                {data.issues.map((i) => (
                  <button key={i.id} className={`chip ${issue === i.id ? 'chip--on' : ''}`} onClick={() => setIssue(i.id)}>
                    {i.label}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="diag__result">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={device + current.id}
                  className="result"
                  initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: ease('premium') }}
                >
                  <div className="result__top">
                    <span className="diag__label mono">03 · Posible causa</span>
                    <span className="result__level">
                      <span className="meter">
                        {[1, 2, 3, 4].map((n) => (
                          <motion.i key={n} initial={{ scaleY: 0 }} animate={{ scaleY: n <= current.level ? 1 : 0.25 }} transition={{ delay: 0.1 * n, duration: 0.4 }} className={n <= current.level ? `on l${current.level}` : ''} />
                        ))}
                      </span>
                      <span className="mono">{LEVELS[current.level]}</span>
                    </span>
                  </div>
                  <p className="result__cause">{current.cause}</p>
                  <div className="result__actions">
                    <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="btn btn--wa">
                      <WhatsIcon size={20} /> Enviar caso por WhatsApp
                    </a>
                    <span className="result__note">Estimado gratis · Sin compromiso</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="result result--empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="scanner">
                    <span />
                  </div>
                  <p>Selecciona un síntoma para ver el pre-diagnóstico.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
