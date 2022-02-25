import { Request, Response } from 'express';

import { learnWorldsService } from '@/services';

import { BaseController } from './base';

export class CoursesController extends BaseController {
    constructor(private readonly learnWorlds = learnWorldsService) {
        super();
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        const courses = await this.learnWorlds.getCourses();
        res.json(courses);
    }
}

export const coursesController = new CoursesController();
