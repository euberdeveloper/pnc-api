import { ContoRicavi, Quietanziante, TipoBolletta } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type TipiBollettaCreateBody = TipoBolletta & { id?: number } & {
    quietanziante?: Omit<Quietanziante, 'id'> | null;
    contoRicaviConsumi?: Omit<ContoRicavi, 'id'> | null;
    contoRicaviCanoni?: Omit<ContoRicavi, 'id'> | null;
};
export type TipiBollettaReplaceBody = Omit<TipoBolletta, 'id'>;
export type TipiBollettaUpdateBody = Partial<TipiBollettaReplaceBody>;
export interface TipiBollettaIncludeParams {
    quietanziante?: boolean;
}
export type TipiBollettaReturned = TipoBolletta & {
    quietanziante?: Quietanziante | null;
};

export class TipiBollettaController extends BaseController {
    public route = '/tipi-bolletta';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(
        params: TipiBollettaIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiBollettaReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: TipiBollettaIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiBollettaReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async getByValue(
        value: string,
        params: TipiBollettaIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<TipiBollettaReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/value/${value}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: TipiBollettaCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: TipiBollettaReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: TipiBollettaUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByValue(value: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/value/${value}`, { ...options });
    }
}
