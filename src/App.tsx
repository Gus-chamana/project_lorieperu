import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import ScrollToTop from './components/feature/ScrollToTop';
import WhatsAppButton from './components/feature/WhatsAppButton';
import PromoBanner from './components/feature/PromoBanner';

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <PromoBanner />
      <ScrollToTop />
      <AppRoutes />
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;
