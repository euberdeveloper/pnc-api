import { Manutenzione, PostoLetto, TipoFabbricato, TipoStanza, Fabbricato, Stanza } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type PostiLettoCreateBody = Omit<PostoLetto, 'dataCreazione' | 'eliminato' | 'idStanza'> & { id?: number };
export type PostiLettoReplaceBody = Omit<PostiLettoCreateBody, 'id'>;
export type PostiLettoUpdateBody = Partial<PostiLettoReplaceBody>;

export interface PostiLettoIncludeParams {
    stanza?: {
        tipoStanza?: boolean;
        postiLetto?: boolean;
        manutenzioni?: boolean;
        fabbricato?:
            | {
                  tipoFabbricato?: boolean;
              }
            | boolean;
    };
}

export type PostiLettoReturned = PostoLetto & {
    stanza?: Stanza & {
        tipoStanza?: TipoStanza;
        postiLetto?: PostoLetto[];
        manutenzioni?: Manutenzione[];
        fabbricato?: Fabbricato & {
            tipoFabbricato?: TipoFabbricato;
        };
    };
};

export class FabbricatiStanzePostiLettoController extends BaseController {
    private readonly baseUrl: string;

    get route(): string {
        return `${this.baseUrl}/posti-letto`;
    }

    constructor(axiosContainer: AxiosContainer, baseUrl: string) {
        super(axiosContainer);
        this.baseUrl = baseUrl;
    }

    public async getAll(
        params: PostiLettoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<PostiLettoReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: PostiLettoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<PostiLettoReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: PostiLettoCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: PostiLettoReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: PostiLettoUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }
}
