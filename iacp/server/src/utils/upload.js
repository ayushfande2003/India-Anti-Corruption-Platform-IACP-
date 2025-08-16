import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

export function createUpload() {
	const useS3 = (process.env.USE_S3 || 'false').toLowerCase() === 'true';
	if (useS3) {
		const s3 = new AWS.S3({ region: process.env.S3_REGION });
		return multer({
			storage: multerS3({
				s3,
				bucket: process.env.S3_BUCKET,
				acl: 'private',
				contentType: multerS3.AUTO_CONTENT_TYPE,
				key: function (req, file, cb) {
					const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
					cb(null, `evidence/${unique}-${file.originalname.replace(/\s+/g, '_')}`);
				}
			}),
			limits: { fileSize: 25 * 1024 * 1024 },
			fileFilter: (req, file, cb) => {
				const allowed = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'application/pdf'];
				if (!allowed.includes(file.mimetype)) return cb(new Error('Unsupported file type'));
				cb(null, true);
			}
		});
	} else {
		const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
		if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
		const storage = multer.diskStorage({
			destination: (req, file, cb) => cb(null, uploadDir),
			filename: (req, file, cb) => {
				const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
				cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
			}
		});
		return multer({
			storage,
			limits: { fileSize: 25 * 1024 * 1024 },
			fileFilter: (req, file, cb) => {
				const allowed = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'application/pdf'];
				if (!allowed.includes(file.mimetype)) return cb(new Error('Unsupported file type'));
				cb(null, true);
			}
		});
	}
}