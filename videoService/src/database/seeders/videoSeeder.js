const Video = require('../models/videoModel');
const generateFakeVideo = require('../fakers/videoFaker');

const insertFakeVideos = async (cantidad = 500) => {
  try {
    const videos = Array.from({ length: cantidad }, () => generateFakeVideo());
    await Video.insertMany(videos);
    console.log(`${cantidad} videos insertados correctamente.`);
  } catch (error) {
    console.error('Error al insertar videos:', error.message);
    throw error;
  }
};

module.exports = insertFakeVideos;
