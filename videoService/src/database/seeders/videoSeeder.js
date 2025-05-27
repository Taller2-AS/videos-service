const fs = require('fs');
const path = require('path');
const Video = require('../models/videoModel');

const insertFakeVideos = async () => {
  try {
    const jsonPath = path.join(__dirname, '../../../data/videos.json');
    const videos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    await Video.insertMany(videos);
    console.log(`${videos.length} videos insertados correctamente desde JSON.`);
  } catch (error) {
    console.error('Error al insertar videos desde JSON:', error.message);
    throw error;
  }
};

module.exports = insertFakeVideos;
