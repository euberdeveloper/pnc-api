import { Express } from 'express';
import logger from 'euberlog';
import initializeSession from '@/utils/session';

export default async function loadSession(app: Express): Promise<void> {
    logger.debug('Load session');
    app.use(await initializeSession());
}
