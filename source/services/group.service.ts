import { databaseService, learnWorldsService } from '@/services';
import { CourseDoesNotExistError, NotFoundError } from '@/errors';
import { Group } from '@/types';

export class GroupService {
    constructor(private readonly db = databaseService, private readonly learnWorlds = learnWorldsService) {}

    private async checkIfCourseExists(courseId: string): Promise<void> {
        const course = await this.learnWorlds.getCourse(courseId);

        if (!course) {
            throw new CourseDoesNotExistError();
        }
    }

    public async getAll(courseId: string): Promise<Group[]> {
        return this.db.groupModel.find({ courseId });
    }

    public async getById(courseId: string, id: string): Promise<Group> {
        const group = await this.db.groupModel.findOne({ courseId, id });

        if (!group) {
            throw new NotFoundError('Group not found');
        }

        return group;
    }

    public async create(courseId: string, body: Omit<Group, 'id' | 'creationDate'>): Promise<string> {
        await this.checkIfCourseExists(courseId);

        const group = new this.db.groupModel(body);
        await group.save();
        return group.id;
    }

    public async deleteById(id: string): Promise<void> {
        await this.db.groupModel.findByIdAndDelete(id);
    }
}

export const groupService = new GroupService();
