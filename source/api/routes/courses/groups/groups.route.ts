import { Router } from 'express';

import { groupsController } from '@/controllers';
import { authenticateJwt } from '@/utils/auth';
import asyncHandler from '@/utils/asyncHandler';
import permission from '@/utils/permission';
import { UserRole } from '@/types';

export default function (): Router {
    const router = Router({ mergeParams: true });
    router.use(authenticateJwt);

    router.get('/', asyncHandler(groupsController.getAll.bind(groupsController)));

    router.get('/:id', asyncHandler(groupsController.get.bind(groupsController)));

    router.post('/', permission([UserRole.ADMIN]), asyncHandler(groupsController.create.bind(groupsController)));

    router.put('/:id', permission([UserRole.ADMIN]), asyncHandler(groupsController.update.bind(groupsController)));

    router.put(
        '/:id/partecipants/:studentId',
        permission([UserRole.STUDENT, UserRole.ADMIN]),
        asyncHandler(groupsController.addPartecipant.bind(groupsController))
    );

    router.delete(
        '/:id/partecipants/:studentId',
        permission([UserRole.STUDENT, UserRole.ADMIN]),
        asyncHandler(groupsController.removePartecipant.bind(groupsController))
    );

    router.delete('/:id', permission([UserRole.ADMIN]), asyncHandler(groupsController.delete.bind(groupsController)));

    return router;
}
