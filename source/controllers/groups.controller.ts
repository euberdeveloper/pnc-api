import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Joi = require('joi');

import { groupService } from '@/services';
import { DeepPartial, Group } from '@/types';

import { BaseController } from './base';

interface GroupBasePathParams {
    courseId: string;
}
interface GroupIdPathParams extends GroupBasePathParams {
    id: string;
}

interface GroupPartecipantsPathParams extends GroupIdPathParams {
    studentId: string;
}

export class GroupsController extends BaseController {
    private readonly groupBaseIdPathParamsValidator = {
        courseId: this.learnWorldsIdValidatorObject
    };
    private readonly groupIdPathParamsValidator = {
        ...this.groupBaseIdPathParamsValidator,
        id: this.idValidatorObject
    };
    private readonly groupPartecipantsPathParamsValidator = {
        ...this.groupIdPathParamsValidator,
        studentId: this.learnWorldsIdValidatorObject
    };
    private readonly bodyValidator = {
        name: Joi.string().min(1).max(1000),
        description: Joi.string().min(1).max(50_000),
        maxPartecipants: Joi.number().min(1),
        lecturePeriod: Joi.object({
            start: Joi.date().required(),
            end: Joi.date().greater(Joi.ref('start')).required()
        }),
        weekSchedule: Joi.object({
            monday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null),
            tuesday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null),
            wednesday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null),
            thursday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null),
            friday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null),
            saturday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null),
            sunday: Joi.object({
                from: this.timeValidatorObject.required(),
                to: this.timeValidatorObject.required()
            }).allow(null)
        })
    };

    constructor(private readonly groups = groupService) {
        super();
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const { courseId } = this.validatePathParams<GroupBasePathParams>(req, this.groupBaseIdPathParamsValidator);
        const groups = await this.groups.getAll(courseId);
        res.json(groups);
    }

    public async get(req: Request, res: Response): Promise<void> {
        const { id, courseId } = this.validatePathParams<GroupIdPathParams>(req, this.groupIdPathParamsValidator);
        const user = await this.groups.getById(courseId, id);
        res.json(user);
    }

    public async create(req: Request, res: Response): Promise<void> {
        const { courseId } = this.validatePathParams<GroupBasePathParams>(req, this.groupBaseIdPathParamsValidator);
        const requestBody = this.validatePostBody<Group>(req, this.bodyValidator);
        const body = { ...requestBody, courseId };
        const id = await this.groups.create(courseId, body);
        res.json(id);
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id, courseId } = this.validatePathParams<GroupIdPathParams>(req, this.groupIdPathParamsValidator);
        const body = this.validatePatchBody<DeepPartial<Group>>(req, this.bodyValidator);
        await this.groups.update(id, courseId, body);
        res.json();
    }

    public async addPartecipant(req: Request, res: Response): Promise<void> {
        const { id, studentId } = this.validatePathParams<GroupPartecipantsPathParams>(
            req,
            this.groupPartecipantsPathParamsValidator
        );

        await this.groups.addPartecipant(id, studentId);
        res.json();
    }

    public async removePartecipant(req: Request, res: Response): Promise<void> {
        const { id, studentId } = this.validatePathParams<GroupPartecipantsPathParams>(
            req,
            this.groupPartecipantsPathParamsValidator
        );

        await this.groups.removePartecipant(id, studentId);
        res.json();
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = this.validateIdPathParams(req);
        await this.groups.deleteById(id);
        res.json();
    }
}

export const groupsController = new GroupsController();
