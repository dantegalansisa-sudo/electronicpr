import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { CustomCursor } from './components/fx';
import { FloatingWhatsApp, Navbar, Preloader, ScrollProgress } from './components/Chrome';
import Hero from './sections/Hero';
import { BrandMarquee, Manifesto } from './sections/Story';
import Services from './sections/Services';
import Process from './sections/Process';
import WhyUs from './sections/WhyUs';
import Diagnostic from './sections/Diagnostic';
import { Contact, FAQ, Footer, Impact } from './sections/Closing';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // anclas suaves
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!;
      const el = id === '#top' ? document.body : document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
      }
    };
    document.addEventListener('click', onClick);
    if (!ready) lenis.stop();
    else lenis.start();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, [ready]);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero ready={ready} />
        <BrandMarquee />
        <Manifesto />
        <Services />
        <Process />
        <WhyUs />
        <Diagnostic />
        <Impact />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
