import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NextMonitoring from './components/NextMonitoring';
import EnergyStatistics from './components/EnergyStatistics';
import DeviceRankings from './components/DeviceRankings';
import MetricCard from './components/MetricCard';
import ActionBanner from './components/ActionBanner';
import { Activity, DollarSign, TrendingUp, Star } from 'lucide-react';
import { metrics } from './data/mockData';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header />

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-2 gap-6">
            <NextMonitoring />
            <EnergyStatistics />
          </div>

          {/* Device Rankings - Full Width */}
          <DeviceRankings />

          {/* Action Banner */}
          <ActionBanner />
        </div>
      </div>
    </div>
  );
}

export default App;
