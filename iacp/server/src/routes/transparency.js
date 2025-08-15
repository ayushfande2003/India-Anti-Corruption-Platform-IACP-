import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

router.get('/tenders', async (req, res, next) => {
	try {
		const { q, department, min, max } = req.query;
		const where = {
			title: q ? { contains: q, mode: 'insensitive' } : undefined,
			department: department || undefined,
			amount: min || max ? {
				gte: min ? Number(min) : undefined,
				lte: max ? Number(max) : undefined
			} : undefined
		};
		const tenders = await prisma.tender.findMany({ where, orderBy: { createdAt: 'desc' } });
		res.json(tenders);
	} catch (err) { next(err); }
});

router.get('/anomalies', async (req, res, next) => {
	try {
		// naive anomalies: top 10 largest amounts
		const top = await prisma.tender.findMany({ orderBy: { amount: 'desc' }, take: 10 });
		res.json({ suspicious: top });
	} catch (err) { next(err); }
});

export default router;