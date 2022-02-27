import { TipoStanza } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type TipiStanzaCreateBody = TipoStanza & { id?: number };
export type TipiStanzaReplaceBody = Omit<TipoStanza, 'id'>;

export class TipiStanzaController extends BaseController {
    public route = '/tipi-stanza';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<TipoStanza[]> {
        const result = await this.axiosInstance.get(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(id: number, options: Record<string, any> = {}): Promise<TipoStanza> {
        const result = await this.axiosInstance.get(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async getByValue(value: string, options: Record<string, any> = {}): Promise<TipoStanza> {
        const result = await this.axiosInstance.get(`${this.route}/value/${value}`, { ...options });
        return result.data;
    }

    public async create(body: TipiStanzaCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: TipiStanzaReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByValue(value: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/value/${value}`, { ...options });
    }
}
