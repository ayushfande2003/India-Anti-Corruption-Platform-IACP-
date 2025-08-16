import { Router } from 'express';
import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';
import { createMailer } from '../services/mailer.js';

const router = Router();
const mailer = createMailer();

function authRequired(req, res, next) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'Missing token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		next();
	} catch {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

router.get('/', authRequired, async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
		res.json(user.trustedContacts || []);
	} catch (err) { next(err); }
});

router.post('/', authRequired, async (req, res, next) => {
	try {
		const { contacts } = req.body;
		await prisma.user.update({ where: { id: req.user.sub }, data: { trustedContacts: contacts } });
		res.json({ ok: true });
	} catch (err) { next(err); }
});

router.post('/panic-share', authRequired, async (req, res, next) => {
	try {
		const { reportId } = req.body;
		const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
		const report = await prisma.report.findUnique({ where: { id: reportId } });
		const contacts = (user.trustedContacts || []).filter(c => c.email);
		for (const c of contacts) {
			await mailer.send({ to: c.email, subject: 'IACP Whistleblower Panic Share', text: `A report was filed with ID ${report.id} on ${report.dateTime}. Category: ${report.category}.` });
		}
		res.json({ sent: contacts.length });
	} catch (err) { next(err); }
});

export default router;