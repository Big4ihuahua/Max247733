import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SceneDirector } from "@/components/providers/SceneDirector";
import { RevealManager } from "@/components/providers/RevealManager";
import { SceneLoader } from "@/components/three/SceneLoader";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Chrome, Grain } from "@/components/layout/Chrome";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/ui/Cursor";
import { LiquidFilter } from "@/components/ui/LiquidFilter";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Cases } from "@/components/sections/Cases";
import { Tech } from "@/components/sections/Tech";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <SceneLoader />
      <Grain />
      <Preloader />
      <Chrome />
      <Header />
      <main id="main">
        <Hero />
        <Manifesto />
        <Services />
        <Process />
        <Cases />
        <Tech />
        <Stats />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Cursor />
      <LiquidFilter />
      {/* Must stay after the sections: their pinned ScrollTriggers have to exist before these measure. */}
      <SceneDirector />
      <RevealManager />
    </SmoothScroll>
  );
}
