import { Router } from 'express';

import { coursesController } from '@/controllers';
import { authenticateJwt } from '@/utils/auth';
import asyncHandler from '@/utils/asyncHandler';
import permission from '@/utils/permission';
import { UserRole } from '@/types';

export default function (): Router {
    const router = Router();

    router.get(
        '/',
        authenticateJwt,
        permission([UserRole.ADMIN, UserRole.TEACHER]),
        asyncHandler(coursesController.getAll.bind(coursesController))
    );

    return router;
}
