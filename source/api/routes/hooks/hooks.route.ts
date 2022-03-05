import { Router } from 'express';

import { hooksController } from '@/controllers';

import asyncHandler from '@/utils/asyncHandler';

export default function (): Router {
    const router = Router();

    router.post(
        '/user-unenrolled-from-product',
        asyncHandler(hooksController.userUnenrolledFromProduct.bind(hooksController))
    );

    return router;
}
