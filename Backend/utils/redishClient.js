const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:5000",
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect();

module.exports = client;
