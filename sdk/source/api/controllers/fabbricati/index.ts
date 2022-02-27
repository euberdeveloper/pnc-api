import { Fabbricato, Manutenzione, Portineria, PostoLetto, TipoFabbricato, TipoStanza } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';
import { StanzeController } from './stanze';

export * from './stanze';

export type FabbricatiCreateBody = Omit<Fabbricato, 'dataCreazione' | 'eliminato'> & { id?: number };
export type FabbricatiReplaceBody = Omit<Fabbricato, 'id' | 'dataCreazione' | 'eliminato'>;
export type FabbricatiUpdateBody = Partial<FabbricatiReplaceBody>;

export interface FabbricatiIncludeParams {
    stanze?: {
        tipoStanza?: boolean;
        postiLetto?: boolean;
        manutenzioni?: boolean;
    };
    tipoFabbricato?: boolean;
    portineria?: boolean;
}

export type FabbricatiReturned = Fabbricato & {
    tipoFabbricato?: TipoFabbricato;
    tipoStanza?: TipoStanza & {
        postiLetto?: PostoLetto[];
        manutenzioni?: Manutenzione[];
    };
    portineria?: Portineria;
};

export class FabbricatiController extends BaseController {
    public route = '/fabbricati';

    private readonly stanzeCache: Map<number, StanzeController> = new Map();

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public stanze(fid: number): StanzeController {
        if (!this.stanzeCache.has(fid)) {
            const stanzeController = new StanzeController(this.axiosContainer, `${this.route}/${fid}`);
            this.stanzeCache.set(fid, stanzeController);
        }
        return this.stanzeCache.get(fid) as StanzeController;
    }

    public async getAll(
        params: FabbricatiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<FabbricatiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: FabbricatiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<FabbricatiReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async getByCodice(
        codice: string,
        params: FabbricatiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<FabbricatiReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/codice/${codice}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: FabbricatiCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: FabbricatiReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: FabbricatiUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByCodice(codice: string, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/codice/${codice}`, { ...options });
    }
}
