import dynamic from 'next/dynamic';
import Navbar from '../components/feature/Navbar';
import HeroSection from '../views/home/components/HeroSection';
import ModelosGallery from '../views/home/components/ModelosGallery';

const ProductosDestacados = dynamic(() => import('../views/home/components/ProductosDestacados'));
const NosotrosPreview = dynamic(() => import('../views/home/components/NosotrosPreview'));
const Testimonios = dynamic(() => import('../views/home/components/Testimonios'));
const ContactoSection = dynamic(() => import('../views/home/components/ContactoSection'));
const FAQSection = dynamic(() => import('../views/home/components/FAQSection'));
const Footer = dynamic(() => import('../components/feature/Footer'));
const WhatsAppButton = dynamic(() => import('../components/feature/WhatsAppButton'), { ssr: false });
const ScrollToTop = dynamic(() => import('../components/feature/ScrollToTop'), { ssr: false });

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
