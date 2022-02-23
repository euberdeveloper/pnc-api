import { Express } from 'express';
import logger from 'euberlog';
import initializeSession from '@/utils/session';

export default function loadSession(app: Express): void {
    logger.debug('Load session');
    app.use(initializeSession());
}
