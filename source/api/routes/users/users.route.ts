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

    router.get('/me', authenticateJwt, (req, res) => {
        const user = req.user;
        res.json(user);
    });

    router.get('/:id', authenticateJwt, asyncHandler(usersController.get.bind(usersController)));

    router.get(
        '/username/:username',
        authenticateJwt,
        asyncHandler(usersController.getByUsername.bind(usersController))
    );

    // router.post(
    //     '/',
    //     authenticateJwt,
    //     permission([UserRole.ROOT, UserRole.ADMIN]),
    //     asyncHandler(async (req, res) => {
    //         const body = req.body;
    //         const uid = await utenteService.postUtente(body);
    //         res.json(uid);
    //     })
    // );

    // router.patch(
    //     '/:uid',
    //     authenticateJwt,
    //     asyncHandler(async (req, res) => {
    //         const utente = req.user as Utente;
    //         const uid = req.params.uid;
    //         const body = req.body;
    //         await utenteService.patchUtenteByUid(utente, uid, body);
    //         res.json();
    //     })
    // );

    // router.patch(
    //     '/username/:username',
    //     authenticateJwt,
    //     asyncHandler(async (req, res) => {
    //         const utente = req.user as Utente;
    //         const username = req.params.username;
    //         const body = req.body;
    //         await utenteService.patchUtenteByNomeUtente(utente, username, body);
    //         res.json();
    //     })
    // );

    // router.patch(
    //     '/:uid/ruolo',
    //     authenticateJwt,
    //     permission([UserRole.ROOT, UserRole.ADMIN]),
    //     asyncHandler(async (req, res) => {
    //         const utente = req.user as Utente;
    //         const uid = req.params.uid;
    //         const body = req.body;
    //         await utenteService.changeUtenteRoleByUid(utente, uid, body);
    //         res.json();
    //     })
    // );

    // router.patch(
    //     '/username/:username/ruolo',
    //     authenticateJwt,
    //     permission([UserRole.ROOT, UserRole.ADMIN]),
    //     asyncHandler(async (req, res) => {
    //         const utente = req.user as Utente;
    //         const username = req.params.username;
    //         const body = req.body;
    //         await utenteService.changeUtenteRoleByNomeUtente(utente, username, body);
    //         res.json();
    //     })
    // );

    // router.patch(
    //     '/:uid/password',
    //     authenticateJwt,
    //     asyncHandler(async (req, res) => {
    //         const utente = req.user as Utente;
    //         const uid = req.params.uid;
    //         const body = req.body;
    //         await utenteService.changeUtentePasswordByUid(utente, uid, body);
    //         res.json();
    //     })
    // );

    // router.patch(
    //     '/username/:username/password',
    //     authenticateJwt,
    //     asyncHandler(async (req, res) => {
    //         const utente = req.user as Utente;
    //         const username = req.params.username;
    //         const body = req.body;
    //         await utenteService.changeUtentePasswordByNomeUtente(utente, username, body);
    //         res.json();
    //     })
    // );

    router.delete('/:id', authenticateJwt, asyncHandler(usersController.delete.bind(usersController)));

    router.delete(
        '/username/:username',
        authenticateJwt,
        asyncHandler(usersController.deleteByUsername.bind(usersController))
    );

    return router;
}
