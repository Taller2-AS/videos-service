const Video = require('../database/models/videoModel');
const verifyToken = require('../utils/verifyToken');

const getUserFromMetadata = async (call) => {
  const metadata = call.metadata.getMap();
  const authHeader = metadata.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No estás autenticado para realizar esta petición');
  }

  const token = authHeader.split(' ')[1];
  return await verifyToken(token);
};

const createVideo = async (call, callback) => {
  try {
    const user = await getUserFromMetadata(call);

    if (user.role !== 'Administrador') {
      return callback(new Error('Solo los administradores pueden subir videos'));
    }

    const { titulo, descripcion, genero } = call.request;

    if (!titulo || !descripcion || !genero) {
      return callback(new Error('Todos los campos son obligatorios'));
    }

    const newVideo = await Video.create({ titulo, descripcion, genero });

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
    const user = await getUserFromMetadata(call);

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
    const user = await getUserFromMetadata(call);

    if (user.role !== 'Administrador') {
      return callback(new Error('Solo los administradores pueden actualizar videos'));
    }

    const { id, titulo, descripcion, genero } = call.request;

    const updatedVideo = await Video.findOneAndUpdate(
      { _id: id, eliminado: false },
      { titulo, descripcion, genero },
      { new: true }
    );

    if (!updatedVideo) {
      return callback(new Error('Video no encontrado'));
    }

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
    const user = await getUserFromMetadata(call);

    if (user.role !== 'Administrador') {
      return callback(new Error('Solo los administradores pueden eliminar videos'));
    }

    const { id } = call.request;

    const deletedVideo = await Video.findOneAndUpdate(
      { _id: id },
      { eliminado: true }
    );

    if (!deletedVideo) {
      return callback(new Error('Video no encontrado'));
    }

    callback(null, {});
  } catch (err) {
    callback(err);
  }
};

const listVideos = async (call, callback) => {
  try {
    await getUserFromMetadata(call);

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
