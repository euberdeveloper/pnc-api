import { databaseService, learnWorldsService } from '@/services';
import { NotFoundError } from '@/errors';
import { StudentPartecipations } from '@/types';

export class StudentPartecipationsService {
    constructor(private readonly db = databaseService, private readonly learnWorlds = learnWorldsService) {}

    private async checkIfGroupExists(courseId: string, groupId: string): Promise<void> {
        const groupExists = await this.db.groupModel.exists({ courseId, id: groupId });

        if (!groupExists) {
            throw new NotFoundError('Group not found');
        }
    }

    public async getAllByGroup(courseId: string, groupId: string): Promise<StudentPartecipations[]> {
        await this.checkIfGroupExists(courseId, groupId);
        return this.db.studentPartecipationsModel.find({ groups: groupId });
    }

    public async getByStudentId(studentId: string): Promise<StudentPartecipations> {
        const studentPartecipations = await this.db.studentPartecipationsModel.findOne({ studentId });

        if (!studentPartecipations) {
            throw new NotFoundError('Student partecipations not found');
        }

        return studentPartecipations;
    }

    public async create(
        courseId: string,
        groupId: string,
        body: Omit<StudentPartecipations, 'id' | 'creationDate'>
    ): Promise<string> {
        await this.checkIfGroupExists(courseId, groupId);

        const studentPartecipations = new this.db.studentPartecipationsModel(body);
        await studentPartecipations.save();
        return studentPartecipations.id;
    }

    public async deleteById(id: string): Promise<void> {
        await this.db.studentPartecipationsModel.findByIdAndDelete(id);
    }
}

export const studentPartecipationsService = new StudentPartecipationsService();
