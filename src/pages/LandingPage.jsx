import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import Servicios from "../components/landing/Servicios";
import Metodologia from "../components/landing/Metodologia";
import SobreMi from "../components/landing/SobreMi";
import Resenas from "../components/landing/Resenas";
import Contacto from "../components/landing/Contacto";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div>
      <Nav />
      <main>
        <Hero />
        <Servicios />
        <Metodologia />
        <SobreMi />
        <Resenas />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}