export const devices = [
  {
    id: 33,
    name: 'Bomba CAG',
    location: 'Dispositivo 33'
  },
  {
    id: 36,
    name: 'Chiller',
    location: 'Dispositivo 36'
  },
  {
    id: 37,
    name: 'Fancoil Auditório',
    location: 'Dispositivo 37'
  },
  {
    id: 38,
    name: 'Aquecimento de Água',
    location: 'Dispositivo 38'
  },
  {
    id: 39,
    name: 'Bomba de Recalque',
    location: 'Dispositivo 39'
  },
  {
    id: 40,
    name: 'Bomba de Esgoto',
    location: 'Dispositivo 40'
  },
  {
    id: 41,
    name: 'Dispositivo 41',
    location: 'Dispositivo 41'
  },
  {
    id: 42,
    name: 'Dispositivo 42',
    location: 'Dispositivo 42'
  }
];

export const DEVICE_ID_ALL = 'all';

export const getDeviceById = (id) => {
  if (id === DEVICE_ID_ALL) {
    return { id: DEVICE_ID_ALL, name: 'Todos os Equipamentos', location: 'Todos' };
  }
  return devices.find(dev => dev.id === id);
};

export const getAllDeviceIds = () => devices.map(dev => dev.id);
