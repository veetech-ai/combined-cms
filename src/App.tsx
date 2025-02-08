import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { CustomerProvider } from './contexts/CustomerContext';
import { OrderProvider } from './contexts/OrderContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardContent from './components/DashboardContent';
import CustomersView from './components/customers/CustomersView';
import ModulesView from './components/modules/ModulesView';
import PosIntegrationView from './components/pos/PosIntegrationView';
import MenusPage from './components/menu/MenusPage';
import AnalyticsView from './components/analytics/AnalyticsView';
import StoresView from './components/stores/StoresView';
import { Login } from './components/auth/login';
import { ROUTES } from './constants/route-names';
import { useAuthStore } from './stores/auth-store';
import ClientApp from './components/codeApp/ClientApp';
// import StorePage from './components/stores/StorePage';
import DisplayMenus from './components/Menus/DisplayMenus';
import DisplaysView from './components/displays/DisplaysView';

import KioskApp from './KioskApp/src/main';
import CloverPaymentForm from './components/paymet/CloverPaymentForm';
import { WelcomeScreen } from './KioskApp/src/components/WelcomeScreen';
import { CustomerDetailsModal } from './KioskApp/src/components/CustomerDetailsModal';
import { PaymentModal } from './KioskApp/src/components/PaymentModal';
import { FeedbackModal } from './KioskApp/src/components/FeedbackModal';
import Success from './KioskApp/src/components/Success';
import { Payment } from './KioskApp/src/components/Payment';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { checkAuth, isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated && !localStorage.getItem('access_token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

const App = () => {
  const path = window.location.pathname;

  useEffect(() => {
    const isAuthenticated = useAuthStore.getState().checkAuth();
    if (!isAuthenticated) {
      // Optionally handle redirection logic here
    }
  }, []);

  if (path === '/code') {
    return <ClientApp />;
  }

  return (
    <Router>
      <CustomerProvider>
        <OrderProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

            {/* <Route path="/store/:id" element={<StorePage />} /> */}
            <Route path="/kiosk/:id" element={<WelcomeScreen />} />
            <Route path="/kiosk/:id/*" element={<KioskApp />} />
            <Route path="/kiosk/:id/details" element={<CustomerDetailsModal  />} />
            <Route path="/kiosk/:id/payment" element={<PaymentModal  />} />
            <Route path="/kiosk/:id/feedback" element={<FeedbackModal  />} />
            <Route path="/kiosk/:id/success" element={<Success  />} />
            <Route path="/kiosk/:id/summary" element={<Payment />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </OrderProvider>
      </CustomerProvider>
    </Router>
  );
};

const MainLayout = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div>
      <Sidebar onNavigate={handleNavigation} />
      <div className="ml-64">
        <Header />
        <div className="mt-16">
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<DashboardContent />} />
            <Route path={ROUTES.CUSTOMERS} element={<CustomersView />} />
            <Route path={ROUTES.MODULES} element={<ModulesView />} />
            <Route path={ROUTES.POS} element={<PosIntegrationView />} />
            <Route path={ROUTES.ANALYTICS} element={<AnalyticsView />} />
            <Route path={ROUTES.STORES} element={<StoresView />} />
            <Route path="/clover-pay" element={<CloverPaymentForm />} />
            <Route path="/menus/:storeId" element={<MenusPage />} />
            <Route path="/display-menus" element={<DisplayMenus />} />
            <Route path="/display-views" element={<DisplaysView />} />
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
