import {
    Stanza,
    Manutenzione,
    PostoLetto,
    TipoStanza,
    Fabbricato,
    TipoFabbricato,
    Sesso,
    Contratto,
    ContrattoSuOspite,
    Ospite,
    Persona,
    ContrattoSuOspiteSuPostoLetto
} from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';
import { ManutenzioniController } from './manutenzioni';
import { FabbricatiStanzePostiLettoController } from './posti-letto';

export * from './posti-letto';
export * from './manutenzioni';

export type StanzeCreateBody = Omit<Stanza, 'dataCreazione' | 'eliminato' | 'idFabbricato'> & { id?: number };
export type StanzeReplaceBody = Omit<StanzeCreateBody, 'id'>;
export type StanzeUpdateBody = Partial<StanzeReplaceBody>;

export interface StanzeIncludeParams {
    fabbricato?: {
        tipoFabbricato?: boolean;
    };
    tipoStanza?: boolean;
    postiLetto?: boolean;
    manutenzioni?: boolean;
}

export interface StanzeLibereParams {
    dataInizio: Date;
    dataFine: Date;
    bagno?: boolean;
    handicap?: boolean;
    idTipoStanza?: number;
    sesso?: Sesso;
    doppiaUsoSingola?: boolean;
}

export type StanzeReturned = Stanza & {
    tipoStanza?: TipoStanza;
    postiLetto?: PostoLetto[];
    manutenzioni?: Manutenzione[];
    fabbricato?: Fabbricato & {
        tipoFabbricato?: TipoFabbricato;
    };
};

export type ContrattoSuOspiteWithPostoLetto = ContrattoSuOspite & {
    contratto: Contratto;
    ospite: Ospite & { persona: Persona };
    contrattiSuOspiteSuPostoLetto: (ContrattoSuOspiteSuPostoLetto & {
        postoLetto: PostoLetto;
    })[];
};

export class StanzeController extends BaseController {
    private readonly baseUrl: string;

    private readonly postiLettoCache: Map<number, FabbricatiStanzePostiLettoController> = new Map();
    private readonly manutenzioniCache: Map<number, ManutenzioniController> = new Map();

    get route(): string {
        return `${this.baseUrl}/stanze`;
    }

    constructor(axiosContainer: AxiosContainer, baseUrl: string) {
        super(axiosContainer);
        this.baseUrl = baseUrl;
    }

    public postiLetto(sid: number): FabbricatiStanzePostiLettoController {
        if (!this.postiLettoCache.has(sid)) {
            const postiLettoController = new FabbricatiStanzePostiLettoController(
                this.axiosContainer,
                `${this.route}/${sid}`
            );
            this.postiLettoCache.set(sid, postiLettoController);
        }
        return this.postiLettoCache.get(sid) as FabbricatiStanzePostiLettoController;
    }

    public manutenzioni(sid: number): ManutenzioniController {
        if (!this.manutenzioniCache.has(sid)) {
            const manutenzioniController = new ManutenzioniController(this.axiosContainer, `${this.route}/${sid}`);
            this.manutenzioniCache.set(sid, manutenzioniController);
        }
        return this.manutenzioniCache.get(sid) as ManutenzioniController;
    }

    public async getAll(
        params: StanzeIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<StanzeReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async getLibere(params: StanzeLibereParams, options: Record<string, any> = {}): Promise<StanzeReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/libere${queryParams}`, { ...options });
        return result.data;
    }

    public async getPiani(options: Record<string, any> = {}): Promise<string[]> {
        const result = await this.axiosInstance.get(`${this.route}/piani`, { ...options });
        return result.data;
    }

    public async getByPiano(piano: string, options: Record<string, any> = {}): Promise<Stanza[]> {
        const result = await this.axiosInstance.get(`${this.route}/piani/${piano}`, { ...options });
        return result.data;
    }

    public async getContratti(
        sid: number,
        options: Record<string, any> = {}
    ): Promise<ContrattoSuOspiteWithPostoLetto[]> {
        const result = await this.axiosInstance.get(`${this.route}/${sid}/contratti`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: StanzeIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<StanzeReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }

    public async getByUnitaImmobiliareAndNumero(
        unitaImmobiliare: string,
        numero: string,
        params: StanzeIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<StanzeReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(
            `${this.route}/unita-immobiliare/${unitaImmobiliare}/numero-stanza/${numero}${queryParams}`,
            { ...options }
        );
        return result.data;
    }

    public async create(body: StanzeCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: StanzeReplaceBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async update(id: number, body: StanzeUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async deleteByUnitaImmobiliareAndNumero(
        unitaImmobiliare: string,
        numero: string,
        options: Record<string, any> = {}
    ): Promise<void> {
        return this.axiosInstance.delete(
            `${this.route}/unita-immobiliare/${unitaImmobiliare}/numero-stanza/${numero}`,
            { ...options }
        );
    }
}
