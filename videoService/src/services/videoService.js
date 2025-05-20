const Video = require('../database/models/videoModel');
const { getChannel, EXCHANGE_NAME } = require('../queue/config/connection');

const createVideo = async (call, callback) => {
  try {
    const { titulo, descripcion, genero } = call.request;

    if (!titulo || !descripcion || !genero) {
      return callback(new Error('Todos los campos son obligatorios'));
    }

    const newVideo = await Video.create({ titulo, descripcion, genero });

    // Publicar evento a RabbitMQ
    const channel = await getChannel();
    channel.publish(
      EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({
        event: 'VIDEO_CREATED',
        videoId: newVideo._id.toString(),
        titulo,
        genero,
        timestamp: new Date().toISOString()
      }))
    );

    callback(null, {
      id: newVideo._id.toString(),
      titulo: newVideo.titulo,
      descripcion: newVideo.descripcion,
      genero: newVideo.genero,
      createdAt: newVideo.createdAt.toISOString()
    });
  } catch (err) {
    callback(err);
  }
};

const getVideoById = async (call, callback) => {
  try {
    const { id } = call.request;
    const video = await Video.findOne({ _id: id, eliminado: false });

    if (!video) {
      return callback(new Error('Video no encontrado'));
    }

    callback(null, {
      id: video._id.toString(),
      titulo: video.titulo,
      descripcion: video.descripcion,
      genero: video.genero,
      createdAt: video.createdAt.toISOString()
    });
  } catch (err) {
    callback(err);
  }
};

const updateVideo = async (call, callback) => {
  try {
    const { id, titulo, descripcion, genero } = call.request;

    const updatedVideo = await Video.findOneAndUpdate(
      { _id: id, eliminado: false },
      { titulo, descripcion, genero },
      { new: true }
    );

    if (!updatedVideo) {
      return callback(new Error('Video no encontrado'));
    }

    // Publicar evento a RabbitMQ
    const channel = await getChannel();
    channel.publish(
      EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({
        event: 'VIDEO_UPDATED',
        videoId: updatedVideo._id.toString(),
        timestamp: new Date().toISOString()
      }))
    );

    callback(null, {
      id: updatedVideo._id.toString(),
      titulo: updatedVideo.titulo,
      descripcion: updatedVideo.descripcion,
      genero: updatedVideo.genero,
      createdAt: updatedVideo.createdAt.toISOString()
    });
  } catch (err) {
    callback(err);
  }
};

const deleteVideo = async (call, callback) => {
  try {
    const { id } = call.request;

    const deletedVideo = await Video.findOneAndUpdate(
      { _id: id },
      { eliminado: true }
    );

    if (!deletedVideo) {
      return callback(new Error('Video no encontrado'));
    }

    // Publicar evento a RabbitMQ
    const channel = await getChannel();
    channel.publish(
      EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({
        event: 'VIDEO_DELETED',
        videoId: id,
        timestamp: new Date().toISOString()
      }))
    );

    callback(null, {});
  } catch (err) {
    callback(err);
  }
};

const listVideos = async (call, callback) => {
  try {
    const { titulo, genero } = call.request;

    const filtro = {
      eliminado: false,
      ...(titulo && { titulo: { $regex: titulo, $options: 'i' } }),
      ...(genero && { genero: { $regex: genero, $options: 'i' } })
    };

    const videos = await Video.find(filtro);

    const response = videos.map(video => ({
      id: video._id.toString(),
      titulo: video.titulo,
      descripcion: video.descripcion,
      genero: video.genero,
      createdAt: video.createdAt.toISOString()
    }));

    callback(null, { videos: response });
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  CreateVideo: createVideo,
  GetVideoById: getVideoById,
  UpdateVideo: updateVideo,
  DeleteVideo: deleteVideo,
  ListVideos: listVideos
};
