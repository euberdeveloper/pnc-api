import logger from 'euberlog';
import { Router } from 'express';

import authRoute from './routes/auth/auth.route';
import usersRoute from './routes/users/users.route';
import versionRouter from './routes/version/version.route';

export default function (): Router {
    const router = Router();

    logger.debug('/auth');
    router.use('/auth', authRoute());

    logger.debug('/users');
    router.use('/users', usersRoute());

    logger.debug('/version');
    router.use('/version', versionRouter());

    return router;
}
