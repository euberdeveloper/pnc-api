import { Provincia } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type ProvinceCreateBody = Provincia & { sigla?: number };
export type ProvinceReplaceBody = Omit<Provincia, 'sigla'>;
export type ProvinceUpdateBody = Partial<ProvinceReplaceBody>;
export class ProvinceController extends BaseController {
    public route = '/province';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<Provincia[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(sigla: number, options: Record<string, any> = {}): Promise<Provincia> {
        const result = await this.axiosInstance.get(`${this.route}/${sigla}`, { ...options });
        return result.data;
    }

    public async create(body: ProvinceCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(sigla: number, body: ProvinceReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${sigla}`, body, { ...options });
    }

    public async update(sigla: number, body: ProvinceUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${sigla}`, body, { ...options });
    }

    public async delete(sigla: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${sigla}`, { ...options });
    }
}
