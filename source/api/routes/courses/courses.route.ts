import { Router } from 'express';
import { authenticateJwt } from '@/utils/auth';

import { coursesController } from '@/controllers';
import asyncHandler from '@/utils/asyncHandler';

export default function (): Router {
    const router = Router();

    router.get('/', authenticateJwt, asyncHandler(coursesController.getAll.bind(coursesController)));

    return router;
}
