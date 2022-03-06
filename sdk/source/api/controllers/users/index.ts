import { instanceOfUser, Student, SwapDatesWithStrings, User, UserRole } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type UsersCreateBody = {
    username: string;
    password: string;
    role: UserRole;
    email: string;
};

function instanceOfStringDatesUser(user: SwapDatesWithStrings<User | Student>): user is SwapDatesWithStrings<User> {
    return instanceOfUser(user as User | Student);
}

export class UsersController extends BaseController {
    public route = '/users';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    private parseUser(user: SwapDatesWithStrings<User>): User {
        return {
            ...user,
            creationDate: new Date(user.creationDate)
        };
    }
    private parseStudent(student: SwapDatesWithStrings<Student>): Student {
        return student;
    }
    private parseUserOrStudent(
        userOrStudent: SwapDatesWithStrings<User> | SwapDatesWithStrings<Student>
    ): User | Student {
        return instanceOfStringDatesUser(userOrStudent)
            ? this.parseUser(userOrStudent)
            : this.parseStudent(userOrStudent);
    }

    public async getAll(options: Record<string, any> = {}): Promise<User[]> {
        const result = await this.axiosInstance.get<SwapDatesWithStrings<User>[]>(`${this.route}`, { ...options });
        return result.data.map(user => this.parseUser(user));
    }

    public async getMe(options: Record<string, any> = {}): Promise<User | Student> {
        const result = await this.axiosInstance.get<SwapDatesWithStrings<User | Student>>(`${this.route}/me`, {
            ...options
        });
        return this.parseUserOrStudent(result.data);
    }

    public async get(id: string, options: Record<string, any> = {}): Promise<User> {
        const result = await this.axiosInstance.get<SwapDatesWithStrings<User>>(`${this.route}/${id}`, { ...options });
        return this.parseUser(result.data);
    }

    public async getByUsername(username: string, options: Record<string, any> = {}): Promise<User> {
        const result = await this.axiosInstance.get<SwapDatesWithStrings<User>>(`${this.route}/username/${username}`, {
            ...options
        });
        return this.parseUser(result.data);
    }

    public async create(body: UsersCreateBody, options: Record<string, any> = {}): Promise<string> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async delete(uid: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${uid}`, { ...options });
    }

    public async deleteByUsername(username: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/username/${username}`, { ...options });
    }
}
