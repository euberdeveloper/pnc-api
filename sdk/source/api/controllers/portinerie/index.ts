import { Portineria } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type PortinerieCreateBody = Omit<Portineria, 'dataCreazione' | 'eliminato'> & { id?: number };
export type PortinerieReplaceBody = Omit<Portineria, 'id' | 'dataCreazione' | 'eliminato'>;

export class PortinerieController extends BaseController {
    public route = '/portinerie';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(options: Record<string, any> = {}): Promise<Portineria[]> {
        const result = await this.axiosInstance.get<Portineria[]>(`${this.route}`, { ...options });
        return result.data;
    }

    public async get(id: number, options: Record<string, any> = {}): Promise<Portineria> {
        const result = await this.axiosInstance.get<Portineria>(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    public async getByName(name: string, options: Record<string, any> = {}): Promise<Portineria> {
        const result = await this.axiosInstance.get<Portineria>(`${this.route}/name/${name}`, { ...options });
        return result.data;
    }

    public async create(body: PortinerieCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post<number>(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: PortinerieReplaceBody, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByName(name: string, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/name/${name}`, { ...options });
    }
}
