export const devices = [
  {
    id: 33,
    name: 'Dispositivo 33',
    location: 'Setor A'
  },
  {
    id: 34,
    name: 'Dispositivo 34',
    location: 'Setor B'
  },
  {
    id: 35,
    name: 'Dispositivo 35',
    location: 'Setor C'
  }
];

export const getDeviceById = (id) => {
  return devices.find(dev => dev.id === id);
};
