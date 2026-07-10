import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Two DB queries instead of one, on purpose: Prisma can't order an
      // enum by custom priority (Urgent vs Normal) in a single orderBy,
      // and sorting on the client would break the "server must do it" rule.
      // So we fetch each group pre-ordered from the DB, then stitch them.
      const urgent = await prisma.notice.findMany({
        where: { priority: 'Urgent' },
        orderBy: { publishDate: 'desc' },
      });
      const normal = await prisma.notice.findMany({
        where: { priority: 'Normal' },
        orderBy: { publishDate: 'desc' },
      });
      return res.status(200).json([...urgent, ...normal]);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }
  }

  if (req.method === 'POST') {
    const { title, body, category, priority, publishDate, image } = req.body;
    const errors = validateNotice({ title, body, category, priority, publishDate });
    if (errors.length) return res.status(400).json({ errors });

    try {
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });
      return res.status(201).json(notice);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export function validateNotice({ title, body, category, priority, publishDate }) {
  const errors = [];
  if (!title || typeof title !== 'string' || !title.trim()) errors.push('Title is required');
  if (!body || typeof body !== 'string' || !body.trim()) errors.push('Body is required');
  if (!['Exam', 'Event', 'General'].includes(category)) errors.push('Category must be Exam, Event, or General');
  if (!['Normal', 'Urgent'].includes(priority)) errors.push('Priority must be Normal or Urgent');
  if (!publishDate || isNaN(new Date(publishDate).getTime())) errors.push('A valid publish date is required');
  return errors;
}