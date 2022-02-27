import { ContoRicavi, TipoOspite } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type TipiOspiteCreateBody = TipoOspite & { id?: number };
export type TipiOspiteReplaceBody = Omit<TipoOspite, 'id'>;
export type TipiOspiteUpdateBody = Partial<TipiOspiteReplaceBody>;

export type TipiOspiteReturned = TipoOspite & {
    contoRicaviCanoni?: ContoRicavi;
    contoRicaviConsumi?: ContoRicavi;
};

export interface TipiOspiteIncludeParams {
    contoRicaviConsumi?: boolean;
    contoRicaviCanoni?: boolean;
}

export class TipiOspiteController extends BaseController {
    public route = '/tipi-ospite';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(
        params: TipiOspiteIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiOspiteReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: TipiOspiteIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiOspiteReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async getByValue(
        sigla: string,
        params: TipiOspiteIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiOspiteReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/sigla/${sigla}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: TipiOspiteCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: TipiOspiteReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: TipiOspiteUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByValue(sigla: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/sigla/${sigla}`, { ...options });
    }
}
