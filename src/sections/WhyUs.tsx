import { motion } from 'framer-motion';
import { AnimatedCounter, Eyebrow, ParallaxImage, RevealText, Spiral, gridContainer, gridItem } from '../components/fx';
import { BUSINESS, waLink } from '../data';
import { Arrow } from '../components/Chrome';

export default function WhyUs() {
  return (
    <section className="why">
      <div className="container">
        <div className="why__head">
          <Eyebrow>Por qué Tecnotronics</Eyebrow>
          <RevealText tag="h2" className="h-display" accent={[5, 6]}>
            Un aliado técnico que habla claro y cumple.
          </RevealText>
        </div>

        <motion.div
          className="bento"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div className="bento__card bento--photo" variants={gridItem}>
            <ParallaxImage src="img/repair-laptop.jpg" alt="Técnico reparando una laptop" distance={40} />
            <div className="bento--photo__overlay">
              <span className="chip-white">
                <Spiral size={16} /> Técnicos especializados
              </span>
              <div className="bento--photo__stat">
                <b><AnimatedCounter target={100} suffix="%" /></b>
                <span>Diagnóstico honesto: te explicamos la falla antes de cobrar.</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="bento__card bento--paper" variants={gridItem}>
            <span className="bento__label">Estimado</span>
            <b className="bento__big">
              <AnimatedCounter target={0} prefix="$" />
            </b>
            <p>Evaluamos tu equipo sin costo. Sin letras pequeñas, sin sorpresas en la factura.</p>
            <div className="avatars">
              {['IM', 'CO', 'PC'].map((a, i) => (
                <span key={a} style={{ zIndex: 3 - i }}>{a}</span>
              ))}
              <small>Impresoras · Copiadoras · PCs</small>
            </div>
          </motion.div>

          <motion.div className="bento__card bento--lime" variants={gridItem}>
            <span className="bento__label">Disponibilidad</span>
            <b className="bento__big">
              <AnimatedCounter target={24} />
              <small>/7</small>
            </b>
            <p>Servicio 24 horas. Tu negocio no espera, nosotros tampoco.</p>
          </motion.div>

          <motion.div className="bento__card bento--ink" variants={gridItem}>
            <span className="bento__label">Marcas</span>
            <b className="bento__big">
              +<AnimatedCounter target={12} />
            </b>
            <p>Canon, HP, Brother, Epson, Xerox, Ricoh y más.</p>
          </motion.div>

          <motion.div className="bento__card bento--cobalt" variants={gridItem}>
            <div className="bento--cobalt__top">
              <span className="bento__label">Para empresas</span>
              <span className="pulse-ring" />
            </div>
            <h3>Planes de mantenimiento para oficinas, escuelas y comercios.</h3>
            <a href={waLink('Hola Tecnotronics, quiero información de planes de mantenimiento para mi empresa.')} target="_blank" rel="noopener noreferrer" className="btn btn--white btn--sm">
              Solicitar plan <Arrow />
            </a>
          </motion.div>

          <motion.div className="bento__card bento--cyan" variants={gridItem}>
            <span className="bento__label">Ubicación</span>
            <h3>San Juan, Puerto Rico</h3>
            <p className="mono">{BUSINESS.address}</p>
            <Spiral size={140} spin className="bento--cyan__spiral" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
