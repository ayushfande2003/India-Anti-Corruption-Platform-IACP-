import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

router.get('/', async (req, res, next) => {
	try {
		const apiKey = process.env.NEWS_API_KEY;
		let articles = [];
		if (apiKey) {
			const url = `https://newsapi.org/v2/everything?q=corruption%20india&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
			const data = await (await fetch(url)).json();
			articles = (data.articles || []).map(a => ({
				title: a.title,
				description: a.description,
				url: a.url,
				source: a.source?.name || null,
				publishedAt: a.publishedAt
			}));
			// cache
			for (const a of articles) {
				try {
					await prisma.newsCache.create({ data: { ...a, publishedAt: new Date(a.publishedAt) } });
				} catch (_) { /* ignore duplicate */ }
			}
		} else {
			// fallback to local cache if no API key
			const cache = await prisma.newsCache.findMany({ orderBy: { publishedAt: 'desc' }, take: 10 });
			articles = cache.map(c => ({
				title: c.title,
				description: c.description,
				url: c.url,
				source: c.source,
				publishedAt: c.publishedAt
			}));
		}
		res.json(articles);
	} catch (err) {
		next(err);
	}
});

export default router;