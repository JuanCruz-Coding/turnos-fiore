import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import Servicios from "../components/landing/Servicios";
import Metodologia from "../components/landing/Metodologia";
import SobreMi from "../components/landing/SobreMi";
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
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}