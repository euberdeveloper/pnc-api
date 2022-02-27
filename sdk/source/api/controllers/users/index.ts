import { Student, User, UserRole } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type UsersCreateBody = {
    username: string;
    password: string;
    role: UserRole;
    email: string;
};

export class UsersController extends BaseController {
    public route = '/users';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<User[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data;
    }

    public async getMe(options: Record<string, any> = {}): Promise<User | Student> {
        const result = await this.axiosInstance.get(`${this.route}/me`, { ...options });
        return result.data;
    }

    public async get(id: string, options: Record<string, any> = {}): Promise<User> {
        const result = await this.axiosInstance.get(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async getByUsername(username: string, options: Record<string, any> = {}): Promise<User> {
        const result = await this.axiosInstance.get(`${this.route}/username/${username}`, { ...options });
        return result.data;
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
