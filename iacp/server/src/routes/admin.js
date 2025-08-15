import { Router } from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';

const router = Router();

function adminRequired(req, res, next) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'Missing token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		if (payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
		next();
	} catch {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

router.get('/reports', adminRequired, async (req, res, next) => {
	try {
		const reports = await prisma.report.findMany({ where: { status: 'PENDING' }, include: { evidence: true } });
		res.json(reports);
	} catch (err) {
		next(err);
	}
});

router.post('/reports/:id/approve', adminRequired, async (req, res, next) => {
	try {
		await prisma.report.update({ where: { id: req.params.id }, data: { status: 'APPROVED' } });
		res.json({ ok: true });
	} catch (err) {
		next(err);
	}
});

router.post('/reports/:id/reject', adminRequired, async (req, res, next) => {
	try {
		await prisma.report.update({ where: { id: req.params.id }, data: { status: 'REJECTED' } });
		res.json({ ok: true });
	} catch (err) {
		next(err);
	}
});

router.post('/users/:id/role', adminRequired, async (req, res, next) => {
	try {
		const { role } = req.body;
		await prisma.user.update({ where: { id: req.params.id }, data: { role } });
		res.json({ ok: true });
	} catch (err) {
		next(err);
	}
});

export default router;