import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, id, index, token } = req.body;

  // 🔐 Validasi token admin
  if (token !== 'nyala') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (action !== 'delete') {
    return res.status(400).json({ error: 'Invalid action' });
  }

  if (!id || typeof index !== 'number' || isNaN(index)) {
    return res.status(400).json({ error: 'Missing or invalid id/index' });
  }

  const comments = await redis.get(id);
  if (!Array.isArray(comments)) {
    return res.status(404).json({ error: 'Komentar tidak ditemukan' });
  }

  if (index < 0 || index >= comments.length) {
    return res.status(400).json({ error: 'Index komentar tidak valid' });
  }

  comments.splice(index, 1);
  await redis.set(id, comments);

  res.status(200).json({ success: true, remaining: comments.length });
}