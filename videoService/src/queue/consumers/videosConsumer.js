const { getChannel } = require('../config/connection');

const videosConsumer = async () => {
  const channel = await getChannel();

  channel.consume('video-events-queue', async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      console.log('📨 Evento recibido desde video-events-queue:');
      console.log(content);

      // Confirmar que el mensaje fue procesado correctamente
      channel.ack(msg);
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error.message);
      channel.nack(msg, false, true); // reintentar si falla
    }
  });

  console.log('👂 Escuchando mensajes en "video-events-queue"...');
};

module.exports = videosConsumer;
