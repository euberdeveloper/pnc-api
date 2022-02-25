import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { InvalidBodyError, InvalidPathParamError, UserNotAuthenticatedError } from '@/errors';
import { User, UserRole } from '@/types';

export interface IdPathParams {
    id: string;
}

export class BaseController {
    protected idValidatorObject = Joi.alternatives(
        Joi.string().regex(/^[\dA-Fa-f]{24}$/, 'Invalid object id'),
        Joi.object().keys({
            id: Joi.any(),
            _bsontype: Joi.allow('ObjectId')
        })
    );
    protected usernameValidatorObject = Joi.string()
        .min(1)
        .regex(/^[\w.]+$/);
    protected passwordValidatorObject = Joi.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@])[\d!$%&*?@A-Za-z]{8,32}$/
    );
    protected emailValidatorObject = Joi.string().email();
    protected roleValidatorObject = Joi.string().valid(...Object.values(UserRole));

    protected idPathParamsValidator = {
        id: this.idValidatorObject
    };

    private extractPathParam(req: Request, param: string): string | undefined {
        const pathParam = req.params[param];

        if (Array.isArray(pathParam)) {
            return pathParam[pathParam.length - 1];
        }

        return pathParam;
    }

    private getPathParamsObject<T>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        const params: any = {};

        for (const pathParam in paramsSchema) {
            params[pathParam] = this.extractPathParam(req, pathParam);
        }

        return params as T;
    }

    protected validatePathParams<T = any>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        const paramsObject = this.getPathParamsObject<T>(req, paramsSchema);

        const { error, value } = Joi.object(paramsSchema).validate(paramsObject, {
            convert: true,
            presence: 'required'
        });

        if (error) {
            throw new InvalidPathParamError(error.message);
        }

        return value as T;
    }

    protected validateIdPathParams(req: Request): IdPathParams {
        return this.validatePathParams<IdPathParams>(req, this.idPathParamsValidator);
    }

    protected validatePostBody<T = any>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        const { error, value } = Joi.object(paramsSchema).validate(req.body, { presence: 'required' });

        if (error) {
            throw new InvalidBodyError(error.message);
        }

        return value as T;
    }

    protected requireUser(req: Request): User {
        if (!req.user) {
            throw new UserNotAuthenticatedError();
        }

        return req.user as User;
    }
}
