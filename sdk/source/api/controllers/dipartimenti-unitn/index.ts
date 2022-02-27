import { DipartimentoUnitn } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type DipartimentiUnitnCreateBody = DipartimentoUnitn & { codice?: string };
export type DipartimentiUnitnReplaceBody = Omit<DipartimentoUnitn, 'codice'>;
export type DipartimentiUnitnUpdateBody = Partial<DipartimentiUnitnCreateBody>;
export class DipartimentiUnitnController extends BaseController {
    public route = '/dipartimenti-unitn';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<DipartimentoUnitn[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(codice: string, options: Record<string, any> = {}): Promise<DipartimentoUnitn> {
        const result = await this.axiosInstance.get(`${this.route}/${codice}`, { ...options });
        return result.data;
    }

    public async getBySigla(sigla: string, options: Record<string, any> = {}): Promise<DipartimentoUnitn> {
        const result = await this.axiosInstance.get(`${this.route}/sigla/${sigla}`, { ...options });
        return result.data;
    }

    public async create(body: DipartimentiUnitnCreateBody, options: Record<string, any> = {}): Promise<string> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(
        codice: string,
        body: DipartimentiUnitnReplaceBody,
        options: Record<string, any>
    ): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${codice}`, body, { ...options });
    }

    public async update(
        codice: string,
        body: DipartimentiUnitnUpdateBody,
        options: Record<string, any>
    ): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${codice}`, body, { ...options });
    }

    public async updateBySigla(
        sigla: string,
        body: DipartimentiUnitnUpdateBody,
        options: Record<string, any>
    ): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/sigla/${sigla}`, body, { ...options });
    }

    public async delete(codice: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${codice}`, { ...options });
    }

    public async deleteBySigla(sigla: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/sigla/${sigla}`, { ...options });
    }
}
