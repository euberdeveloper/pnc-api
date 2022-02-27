import { Manutenzione, PostoLetto, TipoFabbricato, TipoStanza, Fabbricato, Stanza } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export interface ManutenzioniIncludeParams {
    stanza?: {
        tipoStanza?: boolean;
        postiLetto?: boolean;
        fabbricato?:
            | {
                  tipoFabbricato?: boolean;
              }
            | boolean;
    };
    includeSoftDeleted?: boolean;
}

export type ManutenzioniReturned = Manutenzione & {
    stanza?: Stanza & {
        tipoStanza?: TipoStanza;
        postiLetto?: PostoLetto[];
        fabbricato?: Fabbricato & {
            tipoFabbricato?: TipoFabbricato;
        };
    };
};

export class ManutenzioniController extends BaseController {
    private readonly baseUrl: string;

    get route(): string {
        return `${this.baseUrl}/manutenzioni`;
    }

    constructor(axiosContainer: AxiosContainer, baseUrl: string) {
        super(axiosContainer);
        this.baseUrl = baseUrl;
    }

    public async getAll(
        params: ManutenzioniIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<ManutenzioniReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: ManutenzioniIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<ManutenzioniReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, null, { ...options });
        return result.data;
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }
}
