import logger from 'euberlog';
import { Router } from 'express';

import versionRouter from './routes/version/version.route';

export default function (): Router {
    const router = Router();

    logger.debug('/version');
    router.use('/version', versionRouter());

    return router;
}
