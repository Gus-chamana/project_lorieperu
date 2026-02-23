import Navbar from '../components/feature/Navbar';
import Footer from '../components/feature/Footer';
import WhatsAppButton from '../components/feature/WhatsAppButton';
import ScrollToTop from '../components/feature/ScrollToTop';
import HeroSection from '../views/home/components/HeroSection';
import ModelosGallery from '../views/home/components/ModelosGallery';
import ProductosDestacados from '../views/home/components/ProductosDestacados';
import NosotrosPreview from '../views/home/components/NosotrosPreview';
import Testimonios from '../views/home/components/Testimonios';
import ContactoSection from '../views/home/components/ContactoSection';
import FAQSection from '../views/home/components/FAQSection';

export default function HomePage() {
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
