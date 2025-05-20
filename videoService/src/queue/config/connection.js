const amqp = require('amqplib');

let channel;

const QUEUE_NAME = 'video-events-queue';
const EXCHANGE_NAME = 'video-events-exchange';

async function connectToRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL); // asegúrate que esté en tu .env
  channel = await connection.createChannel();

  // Declarar exchange tipo fanout
  await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: true });

  // Declarar cola y enlazarla al exchange
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, '');

  console.log('✅ Conectado a RabbitMQ y cola configurada');

  return channel;
}

async function getChannel() {
  if (!channel) {
    channel = await connectToRabbitMQ();
  }
  return channel;
}

module.exports = {
  getChannel,
  EXCHANGE_NAME,
};
