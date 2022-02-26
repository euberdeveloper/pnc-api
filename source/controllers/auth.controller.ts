import { Request, Response } from 'express';

import { authService } from '@/services';

import { BaseController } from './base';

export interface LoginBody {
    username: string;
    password: string;
}

export class AuthController extends BaseController {
    constructor(private readonly auth = authService) {
        super();
    }

    public loginUser(req: Request, res: Response): void {
        const user = this.requireUser(req);
        const response = this.auth.generateAuthUserResponse(user);
        res.json(response);
    }

    public loginStudent(req: Request, res: Response): void {
        const user = this.requireStudent(req);
        const response = this.auth.generateAuthStudentResponse(user);
        res.json(response);
    }
}

export const authController = new AuthController();
