import { ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { deviceRankings } from '../data/mockData';

const DeviceRankings = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Ranking de Dispositivos</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              Ranking de dispositivos baseado em pontuação de desempenho (0-20 pontos)
            </TooltipContent>
          </Tooltip>
        </div>
        <button className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 transition-colors">
          Ver todos
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-bold text-gray-700 uppercase pb-4 pr-4 tracking-wider">#</th>
              <th className="text-left text-xs font-bold text-gray-700 uppercase pb-4 pr-4 tracking-wider">DISPOSITIVO</th>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-center text-xs font-bold text-gray-700 uppercase pb-4 px-2 tracking-wider cursor-help">MP</th>
                </TooltipTrigger>
                <TooltipContent>
                  Média de Potência em kW
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-center text-xs font-bold text-gray-700 uppercase pb-4 px-2 tracking-wider cursor-help">W</th>
                </TooltipTrigger>
                <TooltipContent>
                  Consumo Total em dezena de kWh
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-center text-xs font-bold text-gray-700 uppercase pb-4 px-2 tracking-wider cursor-help">D</th>
                </TooltipTrigger>
                <TooltipContent>
                  Eficiência em %
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-center text-xs font-bold text-gray-700 uppercase pb-4 px-2 tracking-wider cursor-help">L</th>
                </TooltipTrigger>
                <TooltipContent>
                  Economia em R$ mil
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-center text-xs font-bold text-gray-700 uppercase pb-4 px-2 tracking-wider cursor-help">G</th>
                </TooltipTrigger>
                <TooltipContent>
                  Tempo Ativo em horas
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-center text-xs font-bold text-gray-700 uppercase pb-4 pl-2 tracking-wider cursor-help">PTS</th>
                </TooltipTrigger>
                <TooltipContent>
                  Pontuação Total (0-20)
                </TooltipContent>
              </Tooltip>
            </tr>
          </thead>
          <tbody>
            {deviceRankings.map((device, index) => (
              <tr
                key={device.id}
                className={`border-b border-gray-100 transition-colors ${
                  index === 0 ? 'bg-teal-50/60' : 'hover:bg-gray-50'
                }`}
              >
                <td className="py-4 pr-4">
                  <span className="text-sm font-bold text-gray-700">{device.position}</span>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-lg flex-shrink-0">
                      {device.icon}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{device.name}</span>
                  </div>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm font-medium text-gray-700">{Math.round(device.avgPower / 1000)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm font-medium text-gray-700">{Math.round(device.consumption / 10000)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm font-medium text-gray-700">{Math.round(device.efficiency / 10)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm font-medium text-gray-700">{Math.round(device.savings)}</span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-sm font-medium text-gray-700">{Math.round(device.activeTime * 0.4)}</span>
                </td>
                <td className="text-center py-4 pl-2">
                  <span className="text-sm font-bold text-teal-700">{device.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceRankings;
