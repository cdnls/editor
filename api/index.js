import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing commentbox ID' });

    const comments = await redis.get(id);
    res.status(200).json({ comments: comments || [] });
  }

  else if (method === 'POST') {
    const { id, name, comment } = req.body;
    if (!id || !name || !comment) return res.status(400).json({ error: 'Missing fields' });

    const existing = await redis.get(id) || [];
    const updated = [...existing, { name, comment, time: Date.now() }];

    await redis.set(id, updated);
    res.status(200).json({ success: true });
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}