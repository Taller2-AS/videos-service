const { faker } = require('@faker-js/faker');

const generateFakeVideo = () => {
  return {
    titulo: faker.lorem.words(3),
    descripcion: faker.lorem.sentence(),
    genero: faker.helpers.arrayElement(['Acción', 'Ficción', 'Drama', 'Aventura', 'Comedia']),
    eliminado: false,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
};

module.exports = generateFakeVideo;
