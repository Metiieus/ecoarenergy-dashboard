import { useState } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { establishments } from '../data/establishments';
import { devices } from '../data/devices';
import { useAuth } from '../context/AuthContext';

const Header = ({ selectedEstablishment, onEstablishmentChange, selectedDeviceId, onDeviceChange }) => {
  const [isEstablishmentDropdownOpen, setIsEstablishmentDropdownOpen] = useState(false);
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);

  const currentEstablishment = establishments.find(est => est.id === selectedEstablishment) || establishments[0];
  const currentDevice = devices.find(dev => dev.id === selectedDeviceId) || devices[0];

  const handleSelectEstablishment = (establishmentId) => {
    onEstablishmentChange(establishmentId);
    setIsEstablishmentDropdownOpen(false);
  };

  const handleSelectDevice = (deviceId) => {
    onDeviceChange(deviceId);
    setIsDeviceDropdownOpen(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Sistema de Gestão de Energia</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Ecoar</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Establishment Dropdown */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsEstablishmentDropdownOpen(!isEstablishmentDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{currentEstablishment.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Selecione uma unidade para visualizar dados
              </TooltipContent>
            </Tooltip>

            {isEstablishmentDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {establishments.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => handleSelectEstablishment(est.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedEstablishment === est.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{est.name}</p>
                        <p className="text-xs text-gray-500">{est.abbreviation}</p>
                      </div>
                      {selectedEstablishment === est.id && (
                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Device Selector Dropdown */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{currentDevice.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Selecione um dispositivo para visualizar dados
              </TooltipContent>
            </Tooltip>

            {isDeviceDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {devices.map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => handleSelectDevice(dev.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedDeviceId === dev.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dev.name}</p>
                        <p className="text-xs text-gray-500">{dev.location}</p>
                      </div>
                      {selectedDeviceId === dev.id && (
                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Você tem 1 notificação pendente
            </TooltipContent>
          </Tooltip>

          {/* User Profile */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">EA</span>
            </div>
            <button
              onClick={() => { try { const logoutFn = require('../context/AuthContext').useAuth().logout; logoutFn(); } catch(e){ window.location.reload(); } }}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
