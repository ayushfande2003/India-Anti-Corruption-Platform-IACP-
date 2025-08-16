import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

router.get('/city', async (req, res, next) => {
	try {
		const { city } = req.query;
		if (!city) return res.status(400).json({ error: 'city is required' });

		const reports = await prisma.report.findMany({ where: { city, status: 'APPROVED' } });
		const categoryCounts = reports.reduce((acc, r) => {
			acc[r.category] = (acc[r.category] || 0) + 1;
			return acc;
		}, {});

		const byMonth = {};
		reports.forEach(r => {
			const k = r.createdAt.toISOString().slice(0, 7);
			byMonth[k] = (byMonth[k] || 0) + 1;
		});

		const byWard = {};
		reports.forEach(r => {
			if (r.ward) byWard[r.ward] = (byWard[r.ward] || 0) + 1;
		});
		const topWards = Object.entries(byWard).sort((a,b) => b[1] - a[1]).slice(0,5);

		res.json({ categoryCounts, byMonth, topWards, total: reports.length, points: reports.map(r => ({ lat: r.latitude, lng: r.longitude, severity: r.severity })) });
	} catch (err) {
		next(err);
	}
});

router.get('/sector', async (req, res, next) => {
	try {
		const { sector } = req.query;
		if (!sector) return res.status(400).json({ error: 'sector is required' });
		const reports = await prisma.report.findMany({ where: { category: sector, status: 'APPROVED' } });
		const resolutionRate = 0; // placeholder: requires a resolutions table or status transitions
		const byLocation = {};
		reports.forEach(r => {
			const key = `${r.city || ''} ${r.ward || ''}`.trim();
			byLocation[key] = (byLocation[key] || 0) + 1;
		});
		const topLocations = Object.entries(byLocation).sort((a,b) => b[1] - a[1]).slice(0,5);
		res.json({ total: reports.length, topLocations, resolutionRate });
	} catch (err) {
		next(err);
	}
});

export default router;