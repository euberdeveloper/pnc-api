import { ContoRicavi } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type ContiRicaviCreateBody = ContoRicavi & { id?: number };
export type ContiRicaviReplaceBody = Omit<ContoRicavi, 'id'>;

export class ContiRicaviController extends BaseController {
    public route = '/conti-ricavi';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<ContoRicavi[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(id: number, options: Record<string, any> = {}): Promise<ContoRicavi> {
        const result = await this.axiosInstance.get(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async getByCodice(codice: string, options: Record<string, any> = {}): Promise<ContoRicavi> {
        const result = await this.axiosInstance.get(`${this.route}/codice/${codice}`, { ...options });
        return result.data;
    }

    public async getByConto(conto: string, options: Record<string, any> = {}): Promise<ContoRicavi> {
        const result = await this.axiosInstance.get(`${this.route}/conto/${conto}`, { ...options });
        return result.data;
    }

    public async create(body: ContiRicaviCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: ContiRicaviReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByCodice(codice: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/codice/${codice}`, { ...options });
    }

    public async deleteByConto(conto: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/conto/${conto}`, { ...options });
    }
}
