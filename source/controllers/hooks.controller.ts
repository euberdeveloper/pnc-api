import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { authService, groupService, learnWorldsService } from '@/services';
import { UserUnenrolledWebHook } from '@/types';
import { BadRequestError, InvalidCredentialsError } from '@/errors';

import CONFIG from '@/config';

import { BaseController } from './base';

interface HooksControllerConfig {
    learnworlds: typeof CONFIG.LEARNWORLDS;
}

interface HookTokenQueryParams {
    token: string;
}

export class HooksController extends BaseController {
    private readonly webhookTokenQueryParamsValidator = {
        token: Joi.string().min(1).required()
    };
    private get webhookBaseBodyValidator() {
        return {
            version: Joi.number(),
            type: Joi.string(),
            trigger: Joi.string(),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            school_id: Joi.string()
        };
    }
    private get webhookUserUnenrolledBodyValidator() {
        return {
            ...this.webhookBaseBodyValidator,
            type: Joi.string().valid('userUnenrolledFromProduct')
        };
    }

    constructor(
        private readonly config: HooksControllerConfig,
        private readonly auth = authService,
        private readonly groups = groupService,
        private readonly learnWorlds = learnWorldsService
    ) {
        super();
    }

    public async userUnenrolledFromProduct(req: Request, res: Response): Promise<void> {
        const { token } = this.validateQueryParams<HookTokenQueryParams>(req, this.webhookTokenQueryParamsValidator);
        this.auth.checkWebHooksToken(token);

        const body = this.validateBody<UserUnenrolledWebHook>(req, this.webhookBaseBodyValidator);

        if (body.school_id !== this.config.learnworlds.CLIENT_ID) {
            throw new InvalidCredentialsError('Invalid shool id');
        }

        const studentId = body.data.user.id;
        const courseId = body.data.product.id;
        const studentActuallyStillEnrolled = await this.learnWorlds.checkIfStudentHasCourse(studentId, courseId);

        if (studentActuallyStillEnrolled) {
            throw new BadRequestError('The student is actually still enrolled or the course is not found');
        } else {
            await this.groups.removePartecipantByCourse(courseId, studentId);
        }

        res.json();
    }
}

export const hooksController = new HooksController({
    learnworlds: CONFIG.LEARNWORLDS
});
