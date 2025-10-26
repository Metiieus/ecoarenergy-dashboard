import './App.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EnergyStatistics from './components/EnergyStatistics';
import DeviceList from './components/DeviceList';
import MetricCard from './components/MetricCard';
import ActionBanner from './components/ActionBanner';
import DashboardCharts from './components/DashboardCharts';
import AllDevices from './components/AllDevices';
import DeviceDetailView from './components/DeviceDetailView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Activity, DollarSign, TrendingUp, Star } from 'lucide-react';
import { metrics } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // If a device is selected, show the detail view
  if (selectedDeviceId !== null) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
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
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header />

        {/* Dashboard Content */}
        <div className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard
                icon={DollarSign}
                title="Custo Total"
                value={`R$${metrics.totalCost}k`}
                color="pink"
              />
              <MetricCard
                icon={Activity}
                title="Eficiência"
                value={`${metrics.efficiency}%`}
                color="teal"
              />
              <MetricCard
                icon={TrendingUp}
                title="Orçamento Mensal"
                value={`R$${metrics.monthlyBudget}k`}
                color="yellow"
              />
              <MetricCard
                icon={Star}
                title="Score Médio"
                value={metrics.averageScore}
                color="blue"
              />
            </div>

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
              {/* Charts Section */}
              <DashboardCharts />

              {/* Device List from API - Main Content */}
              <DeviceList onSelectDevice={setSelectedDeviceId} />

              {/* Energy Statistics */}
              <EnergyStatistics />

              {/* Action Banner */}
              <ActionBanner />
            </TabsContent>

            {/* All Devices Tab */}
            <TabsContent value="all-devices" className="space-y-8">
              <AllDevices onSelectDevice={setSelectedDeviceId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
