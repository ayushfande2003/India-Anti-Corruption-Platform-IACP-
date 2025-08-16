import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import prisma from '../prismaClient.js';

const router = Router();

function signToken(user) {
	const payload = { sub: user.id, role: user.role };
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post(
	'/register',
	body('name').isString().isLength({ min: 2 }),
	body('email').isEmail(),
	body('password').isLength({ min: 6 }),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
			const { name, email, password } = req.body;
			const existing = await prisma.user.findUnique({ where: { email } });
			if (existing) return res.status(409).json({ error: 'Email already registered' });
			const passwordHash = await bcrypt.hash(password, 10);
			const user = await prisma.user.create({ data: { name, email, passwordHash } });
			const token = signToken(user);
			res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
		} catch (err) {
			next(err);
		}
	}
);

router.post(
	'/login',
	body('email').isEmail(),
	body('password').isString(),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
			const { email, password } = req.body;
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) return res.status(401).json({ error: 'Invalid credentials' });
			const ok = await bcrypt.compare(password, user.passwordHash);
			if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
			const token = signToken(user);
			res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
		} catch (err) {
			next(err);
		}
	}
);

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

router.get('/me', authRequired, async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
	} catch (err) {
		next(err);
	}
});

export default router;
export { authRequired };