import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { authService } from '@/services';

import { BaseController } from './base';

interface LoginBody {
    username: string;
    password: string;
}

export class AuthController extends BaseController {
    private readonly loginValidator = Joi.object<LoginBody>({
        username: Joi.string().min(1),
        password: Joi.string().min(1)
    });

    constructor(private readonly auth = authService) {
        super();
    }

    public login(req: Request, res: Response): void {
        const user = this.requireUser(req);
        const response = this.auth.generateAuthResponse(user);
        res.json(response);
    }
}

export const authController = new AuthController();
