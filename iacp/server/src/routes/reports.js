import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';
import prisma from '../prismaClient.js';
import { authRequired } from './auth.js';
import imghash from 'imghash';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { createUpload } from '../utils/upload.js';

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = createUpload();

async function computePhashIfImage(filePath) {
	try {
		const ext = path.extname(filePath).toLowerCase();
		if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return null;
		// ensure a normalized size for hashing
		const tmp = filePath + '.hash.jpg';
		await sharp(filePath).resize(256, 256, { fit: 'inside' }).toFile(tmp);
		const hash = await imghash.hash(tmp, 16);
		fs.unlink(tmp, () => {});
		return hash;
	} catch (e) {
		return null;
	}
}

async function extractOcrIfImage(filePath) {
	try {
		const ext = path.extname(filePath).toLowerCase();
		if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return null;
		const { data } = await Tesseract.recognize(filePath, 'eng');
		return data.text?.slice(0, 5000) || null;
	} catch (e) {
		return null;
	}
}

router.post(
	'/',
	upload.array('evidence', 5),
	body('category').isString().isLength({ min: 3 }),
	body('description').isString().isLength({ min: 10 }),
	body('dateTime').isISO8601(),
	body('latitude').isFloat({ min: -90, max: 90 }),
	body('longitude').isFloat({ min: -180, max: 180 }),
	body('severity').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

			const anonymous = req.body.anonymous === 'true' || req.body.anonymous === true;
			const userId = anonymous ? null : (req.user?.sub || null);

			const report = await prisma.report.create({
				data: {
					userId,
					category: req.body.category,
					description: req.body.description,
					dateTime: new Date(req.body.dateTime),
					latitude: Number(req.body.latitude),
					longitude: Number(req.body.longitude),
					severity: req.body.severity || 'MEDIUM',
					status: 'PENDING',
					city: req.body.city || null,
					ward: req.body.ward || null,
					office: req.body.office || null
				}
			});

			const files = req.files || [];
			let duplicateOf = null;

			for (const f of files) {
				const filePath = f.path || '';
				const fileUrl = f.location ? f.location : `/uploads/${path.basename(filePath)}`;
				let fileType = 'DOCUMENT';
				if ((f.mimetype || '').startsWith('image/')) fileType = 'IMAGE';
				if ((f.mimetype || '').startsWith('video/')) fileType = 'VIDEO';

				const phash = filePath ? await computePhashIfImage(filePath) : null;
				let ocrText = filePath ? await extractOcrIfImage(filePath) : null;

				// duplicate detection
				if (phash) {
					const existing = await prisma.evidence.findFirst({ where: { phash } });
					if (existing) duplicateOf = existing.reportId;
				}

				await prisma.evidence.create({
					data: { reportId: report.id, fileUrl, fileType, phash, ocrText }
				});
			}

			if (duplicateOf && duplicateOf !== report.id) {
				await prisma.report.update({ where: { id: report.id }, data: { duplicateOfId: duplicateOf } });
			}

			res.json({ id: report.id, status: 'submitted', duplicateOf: duplicateOf || null });
		} catch (err) {
			next(err);
		}
	}
);

router.get('/', async (req, res, next) => {
	try {
		const { city, status } = req.query;
		const reports = await prisma.report.findMany({
			where: {
				city: city || undefined,
				status: (status || 'APPROVED')
			},
			include: { evidence: true }
		});
		res.json(reports);
	} catch (err) {
		next(err);
	}
});

export default router;