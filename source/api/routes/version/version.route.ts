import { versionController } from '@/controllers';
import { Router } from 'express';

export default function (): Router {
    const router = Router();

    router.get('/', versionController.get.bind(versionController));

    return router;
}
