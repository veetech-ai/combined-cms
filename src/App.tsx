import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardContent from './components/DashboardContent';
import CustomersView from './components/customers/CustomersView';
import ModulesView from './components/modules/ModulesView';
import PosIntegrationView from './components/pos/PosIntegrationView';
import AnalyticsView from './components/analytics/AnalyticsView';
import StoresView from './components/stores/StoresView';

type View = 'dashboard' | 'customers' | 'modules' | 'pos' | 'analytics' | 'stores';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleNavigation = (view: View) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onNavigate={handleNavigation} currentView={currentView} />
      <div className="ml-64">
        <Header />
        <div className="mt-16">
          {currentView === 'dashboard' && <DashboardContent />}
          {currentView === 'customers' && <CustomersView />}
          {currentView === 'modules' && <ModulesView />}
          {currentView === 'pos' && <PosIntegrationView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'stores' && <StoresView />}
        </div>
      </div>
    </div>
  );
}

export default App;