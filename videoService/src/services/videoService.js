const Video = require('../database/models/videoModel');
const { getChannel, EXCHANGE_NAME } = require('../queue/config/connection');
const publishLog = require('../queue/publisher/logPublisher');

const createVideo = async (call, callback) => {
  try {
    const { titulo, descripcion, genero } = call.request;

    if (!titulo || !descripcion || !genero) {
      return callback(new Error('Todos los campos son obligatorios'));
    }

    const newVideo = await Video.create({ titulo, descripcion, genero });

    const channel = await getChannel();
    channel.publish(
      EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({
        event: 'VIDEO_CREATED',
        id: newVideo._id.toString(),
        name: newVideo.titulo,
        timestamp: new Date().toISOString()
      }))
    );

    await publishLog('action', {
      userId: null,
      email: '',
      method: 'CreateVideo',
      url: '/videos',
      action: 'CREAR VIDEO',
      date: new Date().toISOString()
    });

    callback(null, {
      id: newVideo._id.toString(),
      titulo: newVideo.titulo,
      descripcion: newVideo.descripcion,
      genero: newVideo.genero,
      createdAt: newVideo.createdAt.toISOString()
    });
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
    callback(err);
  }
};

const getVideoById = async (call, callback) => {
  try {
    const { id } = call.request;
    const video = await Video.findOne({ _id: id, eliminado: false });

    if (!video) {
      await publishLog('error', {
        userId: null,
        email: '',
        error: 'Video no encontrado',
        date: new Date().toISOString()
      });
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
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
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
      await publishLog('error', {
        userId: null,
        email: '',
        error: 'Video no encontrado',
        date: new Date().toISOString()
      });
      return callback(new Error('Video no encontrado'));
    }

    const channel = await getChannel();
    channel.publish(
      EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({
        event: 'VIDEO_UPDATED',
        id: updatedVideo._id.toString(),
        name: updatedVideo.titulo,
        timestamp: new Date().toISOString()
      }))
    );

    await publishLog('action', {
      userId: null,
      email: '',
      method: 'UpdateVideo',
      url: `/videos/${id}`,
      action: 'ACTUALIZAR VIDEO',
      date: new Date().toISOString()
    });

    callback(null, {
      id: updatedVideo._id.toString(),
      titulo: updatedVideo.titulo,
      descripcion: updatedVideo.descripcion,
      genero: updatedVideo.genero,
      createdAt: updatedVideo.createdAt.toISOString()
    });
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
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
      await publishLog('error', {
        userId: null,
        email: '',
        error: 'Video no encontrado',
        date: new Date().toISOString()
      });
      return callback(new Error('Video no encontrado'));
    }

    const channel = await getChannel();
    channel.publish(
      EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({
        event: 'VIDEO_DELETED',
        id: id,
        timestamp: new Date().toISOString()
      }))
    );

    await publishLog('action', {
      userId: null,
      email: '',
      method: 'DeleteVideo',
      url: `/videos/${id}`,
      action: 'ELIMINAR VIDEO',
      date: new Date().toISOString()
    });

    callback(null, {});
  } catch (err) {
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
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
    await publishLog('error', {
      userId: null,
      email: '',
      error: err.message,
      date: new Date().toISOString()
    });
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
