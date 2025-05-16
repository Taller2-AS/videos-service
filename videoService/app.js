const mongoose = require('mongoose');
const dotenv = require('dotenv');
const grpc = require('@grpc/grpc-js');
const loadProto = require('./src/utils/loadProto');
const videoService = require('./src/services/videoService');

dotenv.config({ path: './.env' });

// Conexión a MongoDB
const DB = process.env.MONGODB_URI;

mongoose.connect(DB)
  .then(() => console.log('Conexión a base de datos exitosa'))
  .catch(err => {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  });

// gRPC Server
const server = new grpc.Server();
const VideoProto = loadProto('video');

server.addService(VideoProto.VideoService.service, videoService);

const PORT = process.env.GRPC_PORT || 50051;
const HOST = process.env.SERVER_URL || 'localhost';

server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Fallo al iniciar servidor gRPC:', err.message);
    return;
  }
  console.log(`Servidor gRPC escuchando en ${HOST}:${port}`);
  server.start();
});
