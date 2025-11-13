export const devices = [
  {
    id: 33,
    name: 'Bomba CAG',
    location: 'Setor A'
  },
  {
    id: 36,
    name: 'Chiller',
    location: 'Setor B'
  },
  {
    id: 37,
    name: 'Fancoil Auditório',
    location: 'Setor C'
  },
  {
    id: 38,
    name: 'Aquecimento de Água',
    location: 'Setor D'
  },
  {
    id: 39,
    name: 'Bomba de Recalque',
    location: 'Setor E'
  },
  {
    id: 40,
    name: 'Bomba de Esgoto',
    location: 'Setor F'
  },
  {
    id: 41,
    name: 'Dispositivo 41',
    location: 'Setor G'
  },
  {
    id: 42,
    name: 'Dispositivo 42',
    location: 'Setor H'
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
