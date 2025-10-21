// Mock data for EcoarEnergy Dashboard

export const deviceRankings = [
  {
    id: 1,
    position: 1,
    name: 'Bomba CAG',
    icon: '⚡',
    avgPower: 8000,
    consumption: 60000,
    efficiency: 10,
    savings: 13.5,
    activeTime: 32.5,
    score: 19
  },
  {
    id: 2,
    position: 2,
    name: 'Chiller',
    icon: '❄️',
    avgPower: 8000,
    consumption: 50000,
    efficiency: 10,
    savings: 10.2,
    activeTime: 26.0,
    score: 16
  },
  {
    id: 3,
    position: 3,
    name: 'Fancoil Auditório',
    icon: '🌀',
    avgPower: 8000,
    consumption: 50000,
    efficiency: 0,
    savings: 10.3,
    activeTime: 7.5,
    score: 15
  },
  {
    id: 4,
    position: 4,
    name: 'Aquecimento de Água',
    icon: '🔥',
    avgPower: 8000,
    consumption: 40000,
    efficiency: 10,
    savings: 14.6,
    activeTime: 17.5,
    score: 13
  },
  {
    id: 5,
    position: 5,
    name: 'Bomba de Recalque',
    icon: '💧',
    avgPower: 8000,
    consumption: 40000,
    efficiency: 10,
    savings: 8.4,
    activeTime: 21.0,
    score: 13
  },
  {
    id: 6,
    position: 6,
    name: 'Bomba de Esgoto',
    icon: '🚰',
    avgPower: 8000,
    consumption: 40000,
    efficiency: 0,
    savings: 7.3,
    activeTime: 18.0,
    score: 12
  }
];

export const energyStatistics = {
  savings: 8,
  targets: 6,
  waste: 2,
  losses: 1
};

export const metrics = {
  efficiency: 65,
  totalCost: 690.2,
  monthlyBudget: 240.6,
  averageScore: 7.2
};

export const nextMonitoring = {
  device: 'Bomba CAG',
  date: '21:00, 11 Novembro, 2025',
  location: 'Setor A',
  vs: 'Bomba de Recalque',
  deviceIcon: '⚡',
  vsIcon: '💧'
};

export const chartData = [
  { name: 'Economia', value: 8, color: '#48BB78' },
  { name: 'Metas', value: 6, color: '#4299E1' },
  { name: 'Desperdício', value: 2, color: '#FC8181' },
  { name: 'Perdas', value: 1, color: '#F6E05E' }
];

