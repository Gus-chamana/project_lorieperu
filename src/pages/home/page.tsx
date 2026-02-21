import { useEffect } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import WhatsAppButton from '../../components/feature/WhatsAppButton';
import ScrollToTop from '../../components/feature/ScrollToTop';
import HeroSection from './components/HeroSection';
import ModelosGallery from './components/ModelosGallery';
import ProductosDestacados from './components/ProductosDestacados';
import NosotrosPreview from './components/NosotrosPreview';
import Testimonios from './components/Testimonios';
import ContactoSection from './components/ContactoSection';
import FAQSection from './components/FAQSection';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Lorie Perú - Confeccionamos lo que imaginas | Bolsos y Accesorios Artesanales';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-beige-light to-white">
      <Navbar />
      <HeroSection />
      <ModelosGallery />
      <ProductosDestacados />
      <NosotrosPreview />
      <Testimonios />
      <FAQSection />
      <ContactoSection />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}