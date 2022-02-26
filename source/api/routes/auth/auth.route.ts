import { Router } from 'express';

import { authController } from '@/controllers';
import { authenticateLearnWorlds, authenticateLocal } from '@/utils/auth';
import asyncHandler from '@/utils/asyncHandler';

export default function (): Router {
    const router = Router();

    router.post('/login/user', authenticateLocal, asyncHandler(authController.loginUser.bind(authController)));
    router.post(
        '/login/student',
        authenticateLearnWorlds,
        asyncHandler(authController.loginStudent.bind(authController))
    );

    return router;
}
