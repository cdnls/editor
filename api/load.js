const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  const key = req.query.key;
  if (!key) return res.status(400).json({ error: 'Key wajib diisi.' });

  try {
    const value = await redis.get(key);
    return res.status(200).json({ value });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};