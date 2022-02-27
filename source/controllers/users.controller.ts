import { Request, Response } from 'express';

import { userService } from '@/services';
import { User } from '@/types';

import { BaseController } from './base';

interface UsernamePathParams {
    username: string;
}

export class UsersController extends BaseController {
    private readonly usernamePathParamsValidator = {
        username: this.usernameValidatorObject
    };
    private readonly bodyValidator = {
        username: this.usernameValidatorObject,
        password: this.passwordValidatorObject,
        role: this.roleValidatorObject,
        email: this.emailValidatorObject
    };

    constructor(private readonly users = userService) {
        super();
    }

    public getMe(req: Request, res: Response): void {
        const user = this.requireGenericUser(req);
        res.json(user);
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        const users = await this.users.getAll();
        res.json(users);
    }

    public async get(req: Request, res: Response): Promise<void> {
        const { id } = this.validateIdPathParams(req);
        const user = await this.users.getById(id);
        res.json(user);
    }

    public async getByUsername(req: Request, res: Response): Promise<void> {
        const { username } = this.validatePathParams<UsernamePathParams>(req, this.usernamePathParamsValidator);
        const user = await this.users.getByUsername(username);
        res.json(user);
    }

    public async create(req: Request, res: Response): Promise<void> {
        const body = this.validatePostBody<User>(req, this.bodyValidator);
        const id = await this.users.create(body);
        res.json(id);
    }

    public async deleteByUsername(req: Request, res: Response): Promise<void> {
        const user = this.requireUser(req);
        const { username } = this.validatePathParams<UsernamePathParams>(req, this.usernamePathParamsValidator);
        await this.users.deleteByUsername(user, username);
        res.json();
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const user = this.requireUser(req);
        const { id } = this.validateIdPathParams(req);
        await this.users.deleteById(user, id);
        res.json();
    }
}

export const usersController = new UsersController();
