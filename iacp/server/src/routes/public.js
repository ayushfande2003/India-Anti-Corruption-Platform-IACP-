import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

router.get('/aggregate', async (req, res, next) => {
	try {
		const byCity = await prisma.report.groupBy({ by: ['city'], _count: { _all: true } });
		const byCategory = await prisma.report.groupBy({ by: ['category'], _count: { _all: true } });
		res.json({ byCity, byCategory });
	} catch (err) { next(err); }
});

export default router;