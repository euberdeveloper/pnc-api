import { Comune } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type ComuniCreateBody = Comune & { id?: number };
export type ComuniReplaceBody = Omit<Comune, 'id'>;
export type ComuniUpdateBody = Partial<ComuniReplaceBody>;
export class ComuniController extends BaseController {
    public route = '/comuni';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<Comune[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(id: number, options: Record<string, any> = {}): Promise<Comune> {
        const result = await this.axiosInstance.get(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async getByCodiceIstat(codiceIstat: string, options: Record<string, any> = {}): Promise<Comune> {
        const result = await this.axiosInstance.get(`${this.route}/codice-istat/${codiceIstat}`, { ...options });
        return result.data;
    }

    public async getByCodiceCatastale(codiceCatastale: string, options: Record<string, any> = {}): Promise<Comune> {
        const result = await this.axiosInstance.get(`${this.route}/codice-catastale/${codiceCatastale}`, {
            ...options
        });
        return result.data;
    }

    public async getByDenominazione(denominazione: string, options: Record<string, any> = {}): Promise<Comune> {
        const result = await this.axiosInstance.get(`${this.route}/denominazione/${denominazione}`, { ...options });
        return result.data;
    }

    public async create(body: ComuniCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: ComuniReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: ComuniUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByCodiceIstat(codiceIstat: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/codice-istat/${codiceIstat}`, { ...options });
    }

    public async deleteByCodiceCatastale(codiceCatastale: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/codice-catastale/${codiceCatastale}`, { ...options });
    }

    public async deleteByDenominazione(denominazione: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/denominazione/${denominazione}`, { ...options });
    }
}
