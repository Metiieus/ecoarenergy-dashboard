export const devices = [
  {
    id: 33,
    name: 'Dispositivo 33',
    location: 'Setor A'
  },
  {
    id: 36,
    name: 'Dispositivo 36',
    location: 'Setor B'
  },
  {
    id: 37,
    name: 'Dispositivo 37',
    location: 'Setor C'
  },
  {
    id: 38,
    name: 'Dispositivo 38',
    location: 'Setor D'
  },
  {
    id: 39,
    name: 'Dispositivo 39',
    location: 'Setor E'
  },
  {
    id: 40,
    name: 'Dispositivo 40',
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

export const getDeviceById = (id) => {
  return devices.find(dev => dev.id === id);
};
