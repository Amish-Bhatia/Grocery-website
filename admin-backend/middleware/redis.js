const client = require('redis');
const redisClient = client.createClient({
  url: "https://127.0.0.1:6379",
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
