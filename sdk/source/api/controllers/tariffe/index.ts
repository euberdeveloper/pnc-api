import { Tariffa, TipoFabbricato, TipoOspite, TipoStanza, TipoTariffa } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type TariffeCreateBody = Omit<Tariffa, 'dataCreazione' | 'eliminato'> & { id?: number };
export type TariffeReplaceBody = Omit<Tariffa, 'id' | 'dataCreazione' | 'eliminato'>;
export type TariffeUpdateBody = Partial<TariffeReplaceBody>;

export interface TariffeIncludeParams {
    tipoOspite?: boolean;
    utilizzoStanza?: boolean;
    tipoFabbricato?: boolean;
    tipoTariffa?: boolean;
}

export type TariffeReturned = Tariffa & {
    tipoOspite?: TipoOspite;
    utilizzoStanza?: TipoStanza;
    tipoFabbricato?: TipoFabbricato;
    tipoTariffa?: TipoTariffa;
};

export class TariffeController extends BaseController {
    public route = '/tariffe';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(
        params: TariffeIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TariffeReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: TariffeIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TariffeReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: TariffeCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: TariffeReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: TariffeUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }
}
