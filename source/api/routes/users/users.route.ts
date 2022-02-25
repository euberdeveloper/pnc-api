import { Router } from 'express';
import { authenticateJwt } from '@/utils/auth';

import { usersController } from '@/controllers';
import permission from '@/utils/permission';
import asyncHandler from '@/utils/asyncHandler';
import { UserRole } from '@/types';

export default function (): Router {
    const router = Router();

    router.get(
        '/',
        authenticateJwt,
        permission([UserRole.ADMIN]),
        asyncHandler(usersController.getAll.bind(usersController))
    );

    router.get('/me', authenticateJwt, usersController.getMe.bind(usersController));

    router.get(
        '/:id',
        authenticateJwt,
        permission([UserRole.ADMIN]),
        asyncHandler(usersController.get.bind(usersController))
    );

    router.get(
        '/username/:username',
        authenticateJwt,
        permission([UserRole.ADMIN]),
        asyncHandler(usersController.getByUsername.bind(usersController))
    );

    router.post(
        '/',
        authenticateJwt,
        permission([UserRole.ADMIN]),
        asyncHandler(usersController.create.bind(usersController))
    );

    router.delete('/:id', authenticateJwt, asyncHandler(usersController.delete.bind(usersController)));

    router.delete(
        '/username/:username',
        authenticateJwt,
        asyncHandler(usersController.deleteByUsername.bind(usersController))
    );

    return router;
}
