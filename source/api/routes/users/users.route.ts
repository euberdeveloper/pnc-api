import { Router } from 'express';
import { authenticateJwt } from '@/utils/auth';

import { userService } from '@/services';
import permission from '@/utils/permission';
import asyncHandler from '@/utils/asyncHandler';
import { User, UserRole } from '@/types';

export default function (): Router {
    const router = Router();

    router.get(
        '/',
        authenticateJwt,
        permission([UserRole.ADMIN]),
        asyncHandler(async (_req, res) => {
            const utenti = await userService.getAll();
            res.json(utenti);
        })
    );

    // router.get('/me', authenticateJwt, (req, res) => {
    //     const user = req.user;
    //     const parsedUser = utenteService.purgeUtente(user);
    //     res.json(parsedUser);
    // });

    // router.get(
    //     '/:uid',
    //     authenticateJwt,
    //     asyncHandler(async (req, res) => {
    //         const uid = req.params.uid;
    //         const utente = await utenteService.getUtenteByUid(uid);
    //         res.json(utente);
    //     })
    // );

    // router.get(
    //     '/username/:username',
    //     authenticateJwt,
    //     asyncHandler(async (req, res) => {
    //         const username = req.params.username;
    //         const utente = await utenteService.getUtenteByNomeUtente(username);
    //         res.json(utente);
    //     })
    // );

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

    // router.post(
    //     '/password-recovery',
    //     asyncHandler(async (req, res) => {
    //         const body = req.body;
    //         await utenteService.askPasswordRecovery(body);
    //         res.json();
    //     })
    // );

    // router.get(
    //     '/password-recovery/:token',
    //     asyncHandler(async (req, res) => {
    //         const token = req.params.token;
    //         const utente = await utenteService.getRecoveryPasswordUtente(token);
    //         res.json(utente);
    //     })
    // );

    // router.post(
    //     '/password-recovery/:token',
    //     asyncHandler(async (req, res) => {
    //         const token = req.params.token;
    //         const body = req.body;
    //         await utenteService.recoverPassword(token, body);
    //         res.json();
    //     })
    // );

    router.delete(
        '/:id',
        authenticateJwt,
        asyncHandler(async (req, res) => {
            const user = req.user as User;
            const id = req.params.id;
            await userService.deleteById(user, id);
            res.json();
        })
    );

    router.delete(
        '/username/:username',
        authenticateJwt,
        asyncHandler(async (req, res) => {
            const user = req.user as User;
            const username = req.params.username;
            await userService.deleteByUsername(user, username);
            res.json();
        })
    );

    return router;
}
