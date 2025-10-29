import './App.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FinancialDashboard from './components/FinancialDashboard';
import AllDevices from './components/AllDevices';
import DeviceDetailView from './components/DeviceDetailView';
import ControlCenter from './components/ControlCenter';
import ConsumptionTab from './components/ConsumptionTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { ApiDataProvider } from './context/ApiDataContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');
  const [selectedEstablishment, setSelectedEstablishment] = useState(1);
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('device') ? parseInt(params.get('device')) : null;
  });

  // If a device is selected, show the detail view
  if (selectedDeviceId !== null) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeSidebarTab} setActiveTab={setActiveSidebarTab} />
        <div className="flex-1 ml-64">
          <Header
            selectedEstablishment={selectedEstablishment}
            onEstablishmentChange={setSelectedEstablishment}
          />
          <div className="p-8">
            <DeviceDetailView
              deviceId={selectedDeviceId}
              onBack={() => setSelectedDeviceId(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeSidebarTab} setActiveTab={setActiveSidebarTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header
          selectedEstablishment={selectedEstablishment}
          onEstablishmentChange={setSelectedEstablishment}
        />

        {/* Dashboard Content */}
        <div className="p-8">
          {activeSidebarTab === 'dashboard' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              {/* Tabs Navigation */}
              <TabsList className="bg-white border border-gray-200 rounded-lg p-1 w-fit">
                <TabsTrigger value="dashboard" className="px-4 py-2">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="all-devices" className="px-4 py-2">
                  Todos os Dispositivos
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-8">
                {/* Financial Dashboard */}
                <FinancialDashboard selectedEstablishment={selectedEstablishment} />
              </TabsContent>

              {/* All Devices Tab */}
              <TabsContent value="all-devices" className="space-y-8">
                <AllDevices onSelectDevice={setSelectedDeviceId} />
              </TabsContent>
            </Tabs>
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

export default App;
