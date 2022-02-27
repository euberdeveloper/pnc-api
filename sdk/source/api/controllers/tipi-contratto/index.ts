import { TipoContratto, TipoStudente } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type TipiContrattoCreateBody = TipoContratto & { id?: number } & {
    tipoStudente?: Omit<TipoStudente, 'id'> | null;
};
export type TipiContrattoReplaceBody = Omit<TipoContratto, 'id'>;
export interface TipiContrattoIncludeParams {
    tipoStudente?: boolean;
}
export type TipiContrattoReturned = TipoContratto & {
    tipoStudente?: TipoStudente | null;
};

export class TipiContrattoController extends BaseController {
    public route = '/tipi-contratto';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(
        params: TipiContrattoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiContrattoReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: TipiContrattoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiContrattoReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async getBySigla(
        sigla: string,
        params: TipiContrattoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiContrattoReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/sigla/${sigla}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: TipiContrattoCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: TipiContrattoReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteBySigla(sigla: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/sigla/${sigla}`, { ...options });
    }
}
