import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { BUSINESS, FAQS, waLink } from '../data';
import { Eyebrow, MagneticButton, RevealText, Spiral } from '../components/fx';
import { Arrow, WhatsIcon } from '../components/Chrome';
import { ease } from '../utils/easings';

/* ───────── Impacto social ───────── */
export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clip = useTransform(scrollYProgress, [0.05, 0.4], ['inset(18% 22% 18% 22% round 48px)', 'inset(0% 0% 0% 0% round 0px)']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  return (
    <section className="impact" ref={ref}>
      <motion.div className="impact__media" style={{ clipPath: clip }}>
        <motion.img src="img/office.jpg" alt="Oficina moderna" style={{ scale }} loading="lazy" />
        <div className="impact__shade" />
      </motion.div>
      <motion.div className="impact__content container" style={{ y }}>
        <Eyebrow light>Compromiso con Puerto Rico</Eyebrow>
        <RevealText tag="h2" className="h-display h-display--light impact__title" accent={[3, 4]}>
          Tecnología que regresa a la comunidad.
        </RevealText>
        <p className="lead lead--light">
          En Tecnotronics de Puerto Rico también nos dedicamos a <strong>regalar equipos a entidades sin fines de lucro</strong> y
          organizaciones. Porque un equipo reacondicionado puede cambiar el día a día de quienes más ayudan.
        </p>
        <div className="impact__actions">
          <MagneticButton
            href={waLink('Hola Tecnotronics, represento una organización sin fines de lucro y quisiera información sobre la donación de equipos.')}
            target="_blank"
            className="btn btn--white btn--lg"
          >
            Soy una organización <span className="btn__icon btn__icon--dark"><Arrow /></span>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────── FAQ ───────── */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq">
      <div className="container faq__grid">
        <div className="faq__left">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <RevealText tag="h2" className="h-display" accent={[1]}>
            Resolvemos tus dudas.
          </RevealText>
          <p className="lead">¿No encuentras tu respuesta? Escríbenos, te contestamos en minutos.</p>
          <a href={waLink('Hola Tecnotronics, tengo una pregunta.')} target="_blank" rel="noopener noreferrer" className="btn btn--ink">
            Hacer una pregunta <Arrow />
          </a>
        </div>
        <div className="faq__list">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`faq__item ${open === i ? 'faq__item--open' : ''}`}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span className="mono faq__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq__q">{f.q}</span>
                <span className="faq__plus" />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: ease('premium') }}
                    className="faq__a"
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Contacto + Footer ───────── */
export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const big = useTransform(scrollYProgress, [0, 1], ['-14%', '0%']);
  const rot = useTransform(scrollYProgress, [0, 1], [-200, 0]);

  const cards = [
    { k: 'Teléfono', v: BUSINESS.phone, h: BUSINESS.phoneHref, tone: 'cyan' },
    { k: 'WhatsApp', v: 'Escríbenos 24/7', h: waLink(), tone: 'wa', ext: true },
    { k: 'Email', v: BUSINESS.email, h: `mailto:${BUSINESS.email}`, tone: 'blue' },
  ];

  return (
    <section className="contact" id="contacto" ref={ref}>
      <div className="contact__bg" aria-hidden>
        <div className="aurora aurora--cyan" />
        <div className="aurora aurora--blue" />
        <div className="noise" />
      </div>
      <div className="container">
        <div className="contact__head">
          <Eyebrow light>Contacto</Eyebrow>
          <h2 className="contact__title">
            <motion.span style={{ y: big }} className="contact__line">¿Tu equipo</motion.span>
            <span className="contact__line">
              falló?{' '}
              <motion.span style={{ rotate: rot }} className="contact__spiral">
                <Spiral size={110} />
              </motion.span>{' '}
              <span className="serif-accent">Hablemos.</span>
            </span>
          </h2>
        </div>

        <div className="contact__grid">
          <div className="contact__cards">
            {cards.map((c, i) => (
              <motion.a
                key={c.k}
                href={c.h}
                target={c.ext ? '_blank' : undefined}
                rel={c.ext ? 'noopener noreferrer' : undefined}
                className={`ccard ccard--${c.tone}`}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: ease('premium') }}
              >
                <span className="ccard__k mono">{c.k}</span>
                <span className="ccard__v">{c.v}</span>
                <span className="ccard__arrow"><Arrow /></span>
              </motion.a>
            ))}
            <div className="ccard ccard--addr">
              <span className="ccard__k mono">Dirección</span>
              <span className="ccard__v ccard__v--sm">
                {BUSINESS.address}
                <br />
                {BUSINESS.city}
              </span>
            </div>
          </div>
          <motion.div
            className="contact__map"
            initial={{ clipPath: 'inset(0 100% 0 0 round 28px)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0 round 28px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: ease('premium') }}
          >
            <iframe
              title="Ubicación de Tecnotronics en San Juan"
              src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="contact__maplink mono"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps ↗
            </a>
          </motion.div>
        </div>

        <div className="contact__cta">
          <MagneticButton href={waLink()} target="_blank" className="btn btn--wa btn--xl">
            <WhatsIcon size={24} /> Pide tu estimado gratis
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <span className="brandmark brandmark--lg">
            TECNOTR<Spiral size={30} spin brand />NICS
          </span>
          <span className="brandmark__sub">Office Equipment · Puerto Rico</span>
        </div>
        <nav className="footer__nav">
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
          <a href="#diagnostico">Diagnóstico</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="footer__contact mono">
          <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          <span>Servicio 24 horas</span>
        </div>
      </div>
      <div className="footer__giant" aria-hidden>
        TECNOTRONICS
      </div>
      <div className="container footer__bottom mono">
        <span>© {new Date().getFullYear()} Tecnotronics Office Equipment. Todos los derechos reservados.</span>
        <a href="#top">Volver arriba ↑</a>
      </div>
    </footer>
  );
}
