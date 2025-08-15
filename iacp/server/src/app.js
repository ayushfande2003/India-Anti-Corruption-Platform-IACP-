import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import csurf from 'csurf';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import newsRoutes from './routes/news.js';
import dashboardRoutes from './routes/dashboards.js';
import adminRoutes from './routes/admin.js';
import legalRoutes from './routes/legal.js';
import transparencyRoutes from './routes/transparency.js';
import publicRoutes from './routes/public.js';
import contactRoutes from './routes/contacts.js';

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(xssClean());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'lax' } });
app.use('/api', csrfProtection, (req, res, next) => {
	// attach token for SPA to read
	res.cookie('XSRF-TOKEN', req.csrfToken(), { sameSite: 'lax' });
	next();
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.get('/api/csrf-token', (req, res) => {
	res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/transparency', transparencyRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/contacts', contactRoutes);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err);
	const status = err.status || 500;
	res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export default app;