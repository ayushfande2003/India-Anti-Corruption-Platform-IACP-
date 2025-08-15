import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

router.post('/rti-generate', (req, res) => {
	const { applicantName, address, infoSought, department, city } = req.body || {};
	const content = `To,\nPublic Information Officer,\n${department}, ${city}.\n\nSubject: Application under RTI Act, 2005\n\nRespected Sir/Madam,\n\nI, ${applicantName}, residing at ${address}, seek the following information under Section 6(1) of the RTI Act, 2005:\n\n${infoSought}\n\nPayment of prescribed application fee enclosed as per rules.\n\nKindly provide the information within 30 days.\n\nSincerely,\n${applicantName}`;
	res.json({ content });
});

router.get('/lawyers', async (req, res, next) => {
	try {
		const { city } = req.query;
		const list = await prisma.legalHelper.findMany({ where: { city: city || undefined } });
		res.json(list);
	} catch (err) { next(err); }
});

router.get('/events', async (req, res, next) => {
	try {
		const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
		res.json(events);
	} catch (err) { next(err); }
});

export default router;