const redis = require("redis");
// const client = redis.createClient();

const client = redis.createClient({
  url: "rediss://red-crg2m3ij1k6c739bmru0:lQD8nefY6tsMDiFp7S5HxL1J2daKAW4R@oregon-redis.render.com:6379",
  socket: {
    tls: true, // Enable SSL/TLS
    rejectUnauthorized: false, // Skip certificate verification (optional, but useful for cloud environments)
  },
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis...");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

module.exports = client;
