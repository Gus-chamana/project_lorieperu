import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/home/page'));
const ProductosPage = lazy(() => import('../pages/productos/page'));
const NosotrosPage = lazy(() => import('../pages/nosotros/page'));
const CarritoPage = lazy(() => import('../pages/carrito/page'));
const CheckoutPage = lazy(() => import('../pages/checkout/page'));
const ConfirmacionPage = lazy(() => import('../pages/confirmacion/page'));
const CursoPage = lazy(() => import('../pages/curso/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/productos',
    element: <ProductosPage />,
  },
  {
    path: '/nosotros',
    element: <NosotrosPage />,
  },
  {
    path: '/curso',
    element: <CursoPage />,
  },
  {
    path: '/carrito',
    element: <CarritoPage />,
  },
  {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    path: '/confirmacion',
    element: <ConfirmacionPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
