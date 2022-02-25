import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { InvalidPathParamError, UserNotAuthenticatedError } from '@/errors';
import { User } from '@/types';

export interface IdPathParams {
    id: string;
}

export class BaseController {
    protected idPathParamsValidator = Joi.object({
        id: Joi.string().min(1)
    });

    private extractPathParam(req: Request, param: string): string | undefined {
        const pathParam = req.params[param];

        if (Array.isArray(pathParam)) {
            return pathParam[pathParam.length - 1];
        }

        return pathParam;
    }

    private getPathParamsObject<T>(req: Request, paramsSchema: Joi.ObjectSchema<T>): T {
        const params: any = {};

        for (const pathParam in paramsSchema) {
            params[pathParam] = this.extractPathParam(req, pathParam);
        }

        return params as T;
    }

    protected validatePathParams<T = any>(req: Request, paramsSchema: Joi.ObjectSchema<T>): T {
        const paramsObject = this.getPathParamsObject<T>(req, paramsSchema);

        const { error, value } = paramsSchema.validate(paramsObject, { convert: true, presence: 'required' });

        if (error) {
            throw new InvalidPathParamError(error.message);
        }

        return value as T;
    }

    protected validateIdPathParams(req: Request): IdPathParams {
        return this.validatePathParams<IdPathParams>(req, this.idPathParamsValidator);
    }

    protected requireUser(req: Request): User {
        if (!req.user) {
            throw new UserNotAuthenticatedError();
        }

        return req.user as User;
    }
}
