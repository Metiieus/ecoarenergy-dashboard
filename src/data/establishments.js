export const establishments = [
  {
    id: 1,
    name: 'Matriz - São Paulo',
    abbreviation: 'SP'
  },
  {
    id: 2,
    name: 'Filial - Rio de Janeiro',
    abbreviation: 'RJ'
  },
  {
    id: 3,
    name: 'Filial - Belo Horizonte',
    abbreviation: 'BH'
  }
];

export const getEstablishmentById = (id) => {
  return establishments.find(est => est.id === id);
};
