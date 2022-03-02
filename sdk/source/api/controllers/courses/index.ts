import { Course } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';
import { GroupsController } from './groups';

export * from './groups';

export class CoursesController extends BaseController {
    public route = '/courses';

    private readonly groupsCache: Map<string, GroupsController> = new Map();

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public groups(id: string): GroupsController {
        if (!this.groupsCache.has(id)) {
            const coursesController = new GroupsController(this.axiosContainer, `${this.route}/${id}`);
            this.groupsCache.set(id, coursesController);
        }
        return this.groupsCache.get(id) as GroupsController;
    }

    public async getAll(options: Record<string, any> = {}): Promise<Course[]> {
        const result = await this.axiosInstance.get<Course[]>(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(id: string, options: Record<string, any> = {}): Promise<Course> {
        const result = await this.axiosInstance.get<Course>(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async checkIfStudentEnrolled(
        id: string,
        studentId: string,
        options: Record<string, any> = {}
    ): Promise<boolean> {
        const result = await this.axiosInstance.get<boolean>(`${this.route}/${id}/students/${studentId}/enrollment`, {
            ...options
        });
        return result.data;
    }
}
