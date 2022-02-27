import { Quietanziante } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type QuietanziantiCreateBody = Quietanziante & { id?: number };
export type QuietanziantiReplaceBody = Omit<Quietanziante, 'id'>;

export class QuietanziantiController extends BaseController {
    public route = '/quietanzianti';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    private purgeValue(value: Quietanziante): Quietanziante {
        value.dataNascita = value.dataNascita ? new Date(value.dataNascita) : null;
        return value;
    }

    public async getAll(options: Record<string, any> = {}): Promise<Quietanziante[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data.map((v: Quietanziante) => this.purgeValue(v));
    }

    public async get(id: number, options: Record<string, any> = {}): Promise<Quietanziante> {
        const result = await this.axiosInstance.get(`${this.route}/${id}`, { ...options });
        return this.purgeValue(result.data);
    }

    public async getByValue(value: string, options: Record<string, any> = {}): Promise<Quietanziante> {
        const result = await this.axiosInstance.get(`${this.route}/value/${value}`, { ...options });
        return this.purgeValue(result.data);
    }

    public async create(body: QuietanziantiCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: QuietanziantiReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByValue(value: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/value/${value}`, { ...options });
    }
}
