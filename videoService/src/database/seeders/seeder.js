const mongoose = require('mongoose');
const dotenv = require('dotenv');
const insertFakeVideos = require('./videoSeeder');

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('Error no controlado:', err.message);
  process.exit(1);
});

const MONGO_URI = process.env.MONGODB_URI;

async function mainSeedingFunction() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    if (process.argv.includes('--fresh')) {
      await mongoose.connection.dropDatabase();
      console.log('🧹 Base de datos limpiada');
    }

    await insertFakeVideos(500);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión cerrada con MongoDB');
  }
}

mainSeedingFunction().catch(console.error);
