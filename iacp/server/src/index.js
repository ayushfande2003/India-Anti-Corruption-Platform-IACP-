import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const keyPath = process.env.HTTPS_KEY;
const certPath = process.env.HTTPS_CERT;

function startServer() {
	if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
		const options = {
			key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath)
		};
		https.createServer(options, app).listen(port, () => {
			console.log(`IACP server running with HTTPS on port ${port}`);
		});
	} else {
		http.createServer(app).listen(port, () => {
			console.log(`IACP server running on http://localhost:${port}`);
		});
	}
}

startServer();