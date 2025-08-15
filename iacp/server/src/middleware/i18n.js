export function getLocale(req) {
	const header = req.headers['accept-language'] || 'en';
	if (header.startsWith('hi')) return 'hi';
	if (header.startsWith('mr')) return 'mr';
	return 'en';
}