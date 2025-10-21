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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Header />
        
        {/* Dashboard Grid */}
        <div className="p-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Row 1: Next Monitoring & Energy Statistics */}
            <div className="col-span-5">
              <NextMonitoring />
            </div>
            <div className="col-span-7">
              <EnergyStatistics />
            </div>
            
            {/* Row 2: Device Rankings & Metric Cards */}
            <div className="col-span-7 row-span-2">
              <DeviceRankings />
            </div>
            
            {/* Metric Cards Column */}
            <div className="col-span-5 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <MetricCard
                  icon={Activity}
                  title="Eficiência"
                  value={`${metrics.efficiency}%`}
                  color="teal"
                />
              </div>
              <div className="col-span-2">
                <MetricCard
                  icon={DollarSign}
                  title="Custo Total"
                  value={`R$${metrics.totalCost}k`}
                  color="pink"
                />
              </div>
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
            
            {/* Row 3: Action Banner */}
            <div className="col-span-12">
              <ActionBanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

