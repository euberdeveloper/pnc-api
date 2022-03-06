import { DeepPartial, Group, SwapDatesWithStrings, WeekSchedule } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type GroupsCreateBody = Pick<
    Group,
    'name' | 'description' | 'maxPartecipants' | 'lecturePeriod' | 'weekSchedule'
>;
export type GroupsUpdateBody = DeepPartial<GroupsCreateBody> &
    Pick<Partial<Group>, 'lecturePeriod'> & { weekSchedule?: Partial<WeekSchedule> };

export class GroupsController extends BaseController {
    get route(): string {
        return `${this.baseUrl}/groups`;
    }

    constructor(axiosContainer: AxiosContainer, private readonly baseUrl: string) {
        super(axiosContainer);
    }

    private parseGroup(group: SwapDatesWithStrings<Group>): Group {
        group.creationDate;
        return {
            ...group,
            creationDate: new Date(group.creationDate),
            lecturePeriod: {
                start: new Date(group.lecturePeriod.start),
                end: new Date(group.lecturePeriod.end)
            }
        };
    }

    public async getAll(options: Record<string, any> = {}): Promise<Group[]> {
        const result = await this.axiosInstance.get<SwapDatesWithStrings<Group>[]>(`${this.route}`, { ...options });
        return result.data.map(group => this.parseGroup(group));
    }

    public async get(id: string, options: Record<string, any> = {}): Promise<Group> {
        const result = await this.axiosInstance.get<SwapDatesWithStrings<Group>>(`${this.route}/${id}`, { ...options });
        return this.parseGroup(result.data);
    }

    public async create(body: GroupsCreateBody, options: Record<string, any> = {}): Promise<string> {
        const result = await this.axiosInstance.post<string>(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async update(id: string, body: GroupsUpdateBody, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
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
