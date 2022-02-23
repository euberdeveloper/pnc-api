import * as cors from 'cors';
import { Express } from 'express';
import logger from 'euberlog';
import CONFIG from '@/config';

export default function loadCors(app: Express): void {
    logger.debug('Load cors');

    const options: cors.CorsOptions = {
        origin: CONFIG.CORS.ORIGIN,
        credentials: CONFIG.CORS.CREDENTIALS
    };

    app.options('*', cors(options) as any);
    app.use(cors(options));
}
