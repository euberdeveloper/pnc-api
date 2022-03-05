import logger from 'euberlog';
import { Router } from 'express';

import authRoute from './routes/auth/auth.route';
import coursesRoute from './routes/courses/courses.route';
import usersRoute from './routes/users/users.route';
import hooksRoute from './routes/hooks/hooks.route';
import versionRouter from './routes/version/version.route';

export default function (): Router {
    const router = Router();

    logger.debug('/auth');
    router.use('/auth', authRoute());

    logger.debug('/users');
    router.use('/users', usersRoute());

    logger.debug('/courses');
    router.use('/courses', coursesRoute());

    logger.debug('/hooks');
    router.use('/hooks', hooksRoute());

    logger.debug('/version');
    router.use('/version', versionRouter());

    return router;
}
