import { Bolletta, ContoRicavi, TipoBolletta, Contratto, Quietanziante, Ospite } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type BollettaReturned = Bolletta & {
    contoRicaviCanoni?: ContoRicavi;
    contoRicaviConsumi?: ContoRicavi;
    bollettaStornata?: Bolletta;
    tipoBolletta?: TipoBolletta;
    contratto?: Contratto;
    quietanziante?: Quietanziante;
    ospite?: Ospite;
};

export interface BollettaIncludeParams {
    contoRicaviCanoni?: boolean;
    contoRicaviConsumi?: boolean;
    bollettaStornata?: boolean;
    tipoBolletta?: boolean;
    contratto?: boolean;
    quietanziante?: boolean;
    ospite?: boolean;
}

// export type BolletteCreateBody = Omit<Bolletta, 'id' | 'importoTotale' | 'siglaCausale' | 'siglaTipoContratto'> & {
export type BollettaCreateBody = {
    id?: number;
    idQuietanziante: number;
    idTipoBolletta: number;
    idContratto: number;
    dataScadenza: Date;
};

export interface BollettaIncassaBody {
    dataIncasso: Date;
}

export class BolletteController extends BaseController {
    private readonly baseUrl: string;

    get route(): string {
        return `${this.baseUrl}/bollette`;
    }

    constructor(axiosContainer: AxiosContainer, baseUrl: string) {
        super(axiosContainer);
        this.baseUrl = baseUrl;
    }

    public async getAll(
        params: BollettaIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<BollettaReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async getById(
        id: number,
        params: BollettaIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<BollettaReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async create(body: BollettaCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async storna(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.post(`${this.route}/${id}/storna`, {}, { ...options });
    }

    public async incassa(id: number, body: BollettaIncassaBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}/data-incasso`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }
}
