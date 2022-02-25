import { Router } from 'express';

import { authController } from '@/controllers';
import { authenticateLocal } from '@/utils/auth';
import asyncHandler from '@/utils/asyncHandler';

export default function (): Router {
    const router = Router();

    router.post('/login', authenticateLocal, asyncHandler(authController.login.bind(authController)));

    return router;
}
