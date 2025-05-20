const videosConsumer = require('./consumers/videosConsumer');

const initializeQueueConsumers = async () => {
  await videosConsumer();
};

module.exports = initializeQueueConsumers;
