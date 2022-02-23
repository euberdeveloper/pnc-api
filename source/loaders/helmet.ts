import helmet from 'helmet';
import { Express } from 'express';
import logger from 'euberlog';

export default function loadHelmet(app: Express): void {
    logger.debug('Load helmet');
    app.use(helmet());
}
