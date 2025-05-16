import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from '@/App.tsx';
import LandingPage from './pages/landing';
import ConsumerPage from './pages/consumer';
import ProfilePage from './pages/profile';
import OrderPage from './pages/order';
import OrderInfoPage from './pages/order-info';
import ProductPage from './pages/product';

// Import the CartProvider
import { CartProvider } from './hooks/CartContext'; // adjust path if needed
import Auth0ProviderWithNavigate from './auth/auth-provider-navigate';
import PrivateRoute from './components/private-route';
import VendorPage from './pages/vendor';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Auth0ProviderWithNavigate>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<PrivateRoute><ConsumerPage /></PrivateRoute>} />
            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/product-create" element={<ProductPage />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
            <Route path="/order-info" element={<PrivateRoute><OrderInfoPage /></PrivateRoute>} />
          </Routes>
        </Auth0ProviderWithNavigate>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);