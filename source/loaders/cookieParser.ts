import * as cookieParser from 'cookie-parser';
import { Express } from 'express';
import logger from 'euberlog';

export default function loadCookieParser(app: Express): void {
    logger.debug('Load cookieParser');
    app.use(cookieParser());
}
