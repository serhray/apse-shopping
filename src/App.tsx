import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Retail from './pages/Retail';
import Wholesale from './pages/Wholesale';
import RequestQuote from './pages/RequestQuote';
import ServicesPreOwned from './pages/ServicesPreOwned';
import ExportImport from './pages/ExportImport';
import ContactUs from './pages/ContactUs';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public pages with Header + Footer */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/retail" element={<Layout><Retail /></Layout>} />
          <Route path="/wholesale" element={<Layout><Wholesale /></Layout>} />
          <Route path="/request-quote" element={<Layout><RequestQuote /></Layout>} />
          <Route path="/services-preowned" element={<Layout><ServicesPreOwned /></Layout>} />
          <Route path="/export-import" element={<Layout><ExportImport /></Layout>} />
          <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />

          {/* Auth pages (no header/footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/service/:id"
            element={
              <ProtectedRoute>
                <Layout><ServiceDetailPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout><AdminPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
