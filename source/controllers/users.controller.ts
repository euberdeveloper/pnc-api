import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { userService } from '@/services';
import { User } from '@/types';

import { BaseController } from './base';

interface UsernamePathParams {
    username: string;
}

export class UsersController extends BaseController {
    private readonly usernamePathParamsValidator = Joi.object({
        username: Joi.string().min(1)
    });

    constructor(private readonly users = userService) {
        super();
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
        const user = await this.users.getById(username);
        res.json(user);
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
