import './App.css';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FinancialDashboard from './components/FinancialDashboard';
import DeviceDetailView from './components/DeviceDetailView';
import ControlCenter from './components/ControlCenter';
import ConsumptionTab from './components/ConsumptionTab';
import { ApiDataProvider, useApiDataContext } from './context/ApiDataContext';

function AppContent() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');
  const [selectedEstablishment, setSelectedEstablishment] = useState(1);
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('device') ? parseInt(params.get('device')) : null;
  });

  const { handleDeviceChange } = useApiDataContext();

  useEffect(() => {
    if (selectedDeviceId !== null) {
      handleDeviceChange(selectedDeviceId);
    } else {
      handleDeviceChange(selectedEstablishment);
    }
  }, [selectedDeviceId, selectedEstablishment, handleDeviceChange]);

  const shouldShowDetailView = selectedDeviceId !== null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeSidebarTab} setActiveTab={setActiveSidebarTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header
          selectedEstablishment={selectedEstablishment}
          onEstablishmentChange={setSelectedEstablishment}
          selectedDeviceId={selectedDeviceId}
          onDeviceChange={setSelectedDeviceId}
        />

        {/* Dashboard Content */}
        <div className="p-8">
          {activeSidebarTab === 'dashboard' && (
            <>
              {shouldShowDetailView ? (
                <DeviceDetailView
                  deviceId={selectedDeviceId}
                  onBack={() => setSelectedDeviceId(null)}
                />
              ) : (
                <FinancialDashboard
                  selectedEstablishment={selectedEstablishment}
                  onSelectDevice={setSelectedDeviceId}
                />
              )}
            </>
          )}

          {activeSidebarTab === 'consumption' && (
            <ConsumptionTab />
          )}

          {activeSidebarTab === 'control' && (
            <ControlCenter />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ApiDataProvider>
      <AppContent />
    </ApiDataProvider>
  );
}

export default App;
