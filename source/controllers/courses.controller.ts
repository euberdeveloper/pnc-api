import { Request, Response } from 'express';

import { learnWorldsService } from '@/services';
import { NotFoundError } from '@/errors';

import { BaseController } from './base';

interface CourseIdPathParams {
    id: string;
}

interface CourseCheckEnrollmentPathParams extends CourseIdPathParams {
    studentId: string;
}

export class CoursesController extends BaseController {
    private readonly courseBaseIdPathParamsValidator = {
        id: this.learnWorldsIdValidatorObject
    };
    private readonly courseCheckEnrollmentPathParamsValidator = {
        ...this.courseBaseIdPathParamsValidator,
        studentId: this.learnWorldsIdValidatorObject
    };

    constructor(private readonly learnWorlds = learnWorldsService) {
        super();
    }

    public async getAll(_req: Request, res: Response): Promise<void> {
        const courses = await this.learnWorlds.getCourses();
        res.json(courses);
    }

    public async getById(req: Request, res: Response): Promise<void> {
        const { id } = this.validatePathParams<CourseIdPathParams>(req, this.courseBaseIdPathParamsValidator);

        const course = await this.learnWorlds.getCourse(id);
        if (course === null) {
            throw new NotFoundError(`Course with id ${id} not found`);
        }

        res.json(course);
    }

    public async checkIfStudentIsEnrolled(req: Request, res: Response): Promise<void> {
        const { id, studentId } = this.validatePathParams<CourseCheckEnrollmentPathParams>(
            req,
            this.courseCheckEnrollmentPathParamsValidator
        );

        const hasCourse = await this.learnWorlds.checkIfStudentHasCourse(id, studentId);
        res.json(hasCourse);
    }
}

export const coursesController = new CoursesController();
