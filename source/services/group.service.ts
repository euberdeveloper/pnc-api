import { databaseService, learnWorldsService } from '@/services';
import { CourseDoesNotExistError, InvalidBodyError, NotFoundError } from '@/errors';
import { Group } from '@/types';

export class GroupService {
    constructor(private readonly db = databaseService, private readonly learnWorlds = learnWorldsService) {}

    private async checkIfCourseExists(courseId: string): Promise<void> {
        // TODO: fix learnworlds deps undefined
        const course = await learnWorldsService.getCourse(courseId);

        if (!course) {
            throw new CourseDoesNotExistError();
        }
    }

    private async checkIfStudentIsValidForCourse(courseId: string, studentId: string): Promise<void> {
        // TODO: fix learnworlds deps undefined
        if (!(await learnWorldsService.checkIfStudentHasCourse(courseId, studentId))) {
            throw new InvalidBodyError('Student does not have this course');
        }
    }

    private async checkIfStudentAlreadyEnrolledInAGroupOfThisCourse(
        courseId: string,
        studentId: string
    ): Promise<void> {
        const alreadyEnrolled = await this.db.groupModel.exists({ courseId, partecipants: studentId }).countDocuments();
        if (alreadyEnrolled) {
            throw new InvalidBodyError('User is already enrolled in a group of this course');
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

    public async update(
        id: string,
        courseId: string,
        body: Omit<Group, 'id' | 'partecipants' | 'creationDate'>
    ): Promise<void> {
        const group = await this.db.groupModel.findOne({ courseId, id });

        if (!group) {
            throw new NotFoundError('Group not found');
        }

        if (group.partecipants.length > body.maxPartecipants) {
            throw new InvalidBodyError('With specified number of partecipants, the group would become full');
        }

        group.name = body.name;
        group.description = body.description;
        group.maxPartecipants = body.maxPartecipants;

        await group.save();
    }

    public async addPartecipant(groupId: string, studentId: string): Promise<void> {
        const group = await this.db.groupModel.findById(groupId);

        if (!group) {
            throw new NotFoundError('Group not found');
        }

        if (group.partecipants.includes(studentId)) {
            throw new InvalidBodyError('User is already a partecipant');
        }

        if (group.partecipants.length >= group.maxPartecipants) {
            throw new InvalidBodyError('Group is full');
        }

        await this.checkIfStudentAlreadyEnrolledInAGroupOfThisCourse(group.courseId, studentId);
        await this.checkIfStudentIsValidForCourse(group.courseId, studentId);

        group.partecipants.push(studentId);
        await group.save();
    }

    public async removePartecipant(groupId: string, userId: string): Promise<void> {
        const group = await this.db.groupModel.findById(groupId);

        if (!group) {
            throw new NotFoundError('Group not found');
        }

        group.partecipants = group.partecipants.filter(partecipant => partecipant !== userId);
        await group.save();
    }

    public async removePartecipantByCourse(courseId: string, userId: string): Promise<void> {
        const groups = await this.db.groupModel.find({ courseId });
        const group = groups.find(group => group.partecipants.includes(userId));

        if (group) {
            group.partecipants = group.partecipants.filter(partecipant => partecipant !== userId);
            await group.save();
        }
    }

    public async deleteById(id: string): Promise<void> {
        await this.db.groupModel.findByIdAndDelete(id);
    }
}

export const groupService = new GroupService();
