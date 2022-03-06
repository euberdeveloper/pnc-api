import { Group } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type GroupsCreateBody = {
    name: string;
    description: string;
    maxPartecipants: number;
};

export type GroupsUpdateBody = {
    name: string;
    description: string;
    maxPartecipants: number;
};

export class GroupsController extends BaseController {
    get route(): string {
        return `${this.baseUrl}/groups`;
    }

    constructor(axiosContainer: AxiosContainer, private readonly baseUrl: string) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<Group[]> {
        const result = await this.axiosInstance.get<Group[]>(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(id: string, options: Record<string, any> = {}): Promise<Group> {
        const result = await this.axiosInstance.get<Group>(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async create(body: GroupsCreateBody, options: Record<string, any> = {}): Promise<string> {
        const result = await this.axiosInstance.post<string>(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async update(id: string, body: GroupsUpdateBody, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async addPartecipant(id: string, studentId: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}/partecipants/${studentId}`, {}, { ...options });
    }

    public async removePartecipant(id: string, studentId: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}/partecipants/${studentId}`, { ...options });
    }

    public async delete(uid: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${uid}`, { ...options });
    }
}
