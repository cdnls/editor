const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  const { key, value } = req.body || {};

  if (!key || !value) {
    return res.status(400).json({ error: 'Key dan value wajib diisi.' });
  }

  try {
    await redis.set(key, value);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};
