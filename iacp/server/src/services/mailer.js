import nodemailer from 'nodemailer';

export function createMailer() {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT || 587),
		secure: false,
		auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
	});
	return {
		send: async ({ to, subject, text }) => {
			if (!SMTP_HOST) return;
			await transporter.sendMail({ from: EMAIL_FROM, to, subject, text });
		}
	};
}