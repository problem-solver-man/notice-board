import { prisma } from '../../../lib/prisma';
import { validateNotice } from './index';

export default async function handler(req, res) {
  const noticeId = parseInt(req.query.id, 10);
  if (isNaN(noticeId)) return res.status(400).json({ error: 'Invalid notice id' });

  if (req.method === 'PUT') {
    const { title, body, category, priority, publishDate, image } = req.body;
    const errors = validateNotice({ title, body, category, priority, publishDate });
    if (errors.length) return res.status(400).json({ errors });

    try {
      const updated = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });
      return res.status(200).json(updated);
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Notice not found' });
      return res.status(500).json({ error: 'Failed to update notice' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(200).json({ message: 'Notice deleted' });
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Notice not found' });
      return res.status(500).json({ error: 'Failed to delete notice' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}