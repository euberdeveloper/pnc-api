import { Course } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';
import { GroupsController } from './groups';

export class CoursesController extends BaseController {
    public route = '/courses';

    private readonly coursesCache: Map<number, GroupsController> = new Map();

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public courses(id: number): GroupsController {
        if (!this.coursesCache.has(id)) {
            const coursesController = new GroupsController(this.axiosContainer, `${this.route}/${id}`);
            this.coursesCache.set(id, coursesController);
        }
        return this.coursesCache.get(id) as GroupsController;
    }

    public async getAll(options: Record<string, any> = {}): Promise<Course[]> {
        const result = await this.axiosInstance.get<Course[]>(`${this.route}`, { ...options });
        return result.data;
    }
}
