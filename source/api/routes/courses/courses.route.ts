import { Router } from 'express';

import { coursesController } from '@/controllers';
import { authenticateJwt } from '@/utils/auth';
import asyncHandler from '@/utils/asyncHandler';
import permission from '@/utils/permission';
import { UserRole } from '@/types';

import groupsRoute from './groups/groups.route';

export default function (): Router {
    const router = Router();
    router.use(authenticateJwt);

    router.get(
        '/',
        permission([UserRole.ADMIN, UserRole.TEACHER]),
        asyncHandler(coursesController.getAll.bind(coursesController))
    );

    router.use('/:courseId/groups', groupsRoute());

    return router;
}
