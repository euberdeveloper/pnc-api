import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { InvalidBodyError, InvalidPathParamError, InvalidQueryParamError, UserNotAuthenticatedError } from '@/errors';
import { Student, User, UserRole } from '@/types';

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
    protected learnWorldsIdValidatorObject = Joi.string().min(1).max(1000).required();

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

    private extractQueryParam(req: Request, param: string): string | undefined {
        const queryParam = req.query[param] as undefined | string | string[];

        if (Array.isArray(queryParam)) {
            return queryParam.length ? queryParam[queryParam.length - 1] : undefined;
        } else if (queryParam === undefined) {
            return param in req.query ? '' : undefined;
        }

        return queryParam;
    }

    private getQueryParamsObject<T>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        const params: any = {};

        for (const queryParam in paramsSchema) {
            params[queryParam] = this.extractQueryParam(req, queryParam);
        }

        return params as T;
    }

    private validateBody<T = any>(
        req: Request,
        paramsSchema: Record<string, Joi.Schema<T>>,
        validationOptions: Joi.ValidationOptions
    ): T {
        const { error, value } = Joi.object(paramsSchema).validate(req.body, validationOptions);

        if (error) {
            throw new InvalidBodyError(error.message);
        }

        return value as T;
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

    protected validateQueryParams<T = any>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        const paramsObject = this.getQueryParamsObject<T>(req, paramsSchema);

        const { error, value } = Joi.object(paramsSchema).validate(paramsObject, {
            convert: true
        });

        if (error) {
            throw new InvalidQueryParamError(error.message);
        }

        return value as T;
    }

    protected validateIdPathParams(req: Request): IdPathParams {
        return this.validatePathParams<IdPathParams>(req, this.idPathParamsValidator);
    }

    protected validatePostBody<T = any>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        return this.validateBody(req, paramsSchema, { presence: 'required' });
    }

    protected validatePutBody<T = any>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        return this.validateBody(req, paramsSchema, { presence: 'required' });
    }

    protected validatePatchBody<T = any>(req: Request, paramsSchema: Record<string, Joi.Schema<T>>): T {
        return this.validateBody(req, paramsSchema, { presence: 'optional' });
    }

    protected requireGenericUser(req: Request): User | Student {
        if (!req.user) {
            throw new UserNotAuthenticatedError();
        }

        return req.user as User | Student;
    }

    protected requireUser(req: Request): User {
        return this.requireGenericUser(req) as User;
    }

    protected requireStudent(req: Request): Student {
        return this.requireGenericUser(req) as Student;
    }
}
