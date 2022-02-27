import {
    Ospite,
    Persona,
    LuogoDiNascita,
    Residenza,
    Bolletta,
    Contratto,
    Quietanziante,
    TipoBolletta,
    ContoRicavi,
    TipoContratto,
    TipoOspite,
    ContrattoSuOspite,
    PostoLetto,
    Stanza,
    ContrattoSuOspiteSuPostoLetto,
    Fabbricato
} from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type StatusContabilita = {
    success: number;
    failed: number;
    total: number;
    lastUpdate: Date;
};

export interface ContabilitaQueryParams {
    startDate: Date;
    endDate: Date;
    idTipoOspite?: number;
    idOspite?: number;
    siglaCausale?: string;
}

export interface ContabilitaPageParams {
    page?: number;
    pageSize?: number;
}

type OspiteInfo = Ospite & {
    persona: Persona & {
        luogoDiNascita: LuogoDiNascita | null;
        residenza: Residenza | null;
    };
};

export type ContabilitaBollettaInfo = Bolletta & {
    contratto: Contratto & {
        tipoContratto: TipoContratto;
        tariffa: {
            tipoOspite: TipoOspite;
        };
        contrattiSuOspite: (ContrattoSuOspite & {
            contrattiSuOspiteSuPostoLetto: (ContrattoSuOspiteSuPostoLetto & {
                postoLetto: PostoLetto & {
                    stanza: Stanza & {
                        fabbricato: Fabbricato;
                    };
                };
            })[];
        })[];
    };
    quietanziante: Quietanziante;
    ospite: OspiteInfo | null;
    tipoBolletta: TipoBolletta;
    contoRicaviCanoni: ContoRicavi | null;
    contoRicaviConsumi: ContoRicavi | null;
};

export interface ContabilitaDirsInfo {
    path: string;
    size: string;
}

export class ContabilitaController extends BaseController {
    public route = '/contabilita';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    private purgeValue(value: ContabilitaBollettaInfo): ContabilitaBollettaInfo {
        value.competenzaAl = new Date(value.competenzaAl);
        value.competenzaDal = new Date(value.competenzaDal);
        value.dataScadenza = new Date(value.dataScadenza);
        value.dataInvioEusis = value.dataInvioEusis ? new Date(value.dataInvioEusis) : null;
        value.contratto.dataInizio = new Date(value.contratto.dataInizio);
        value.contratto.dataFine = new Date(value.contratto.dataFine);
        value.contratto.dataChiusuraAnticipata = value.contratto.dataChiusuraAnticipata
            ? new Date(value.contratto.dataChiusuraAnticipata)
            : null;
        return value;
    }

    public async getCronology(options: Record<string, any> = {}): Promise<ContabilitaDirsInfo[]> {
        const result = await this.axiosInstance.get(`${this.route}/cronology`, { ...options });
        return result.data;
    }

    public async getBollette(
        params: ContabilitaQueryParams & ContabilitaPageParams,
        options: Record<string, any> = {}
    ): Promise<ContabilitaBollettaInfo[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/bollette${queryParams}`, { ...options });
        return result.data.map((el: ContabilitaBollettaInfo) => this.purgeValue(el));
    }

    public async countBollette(params: ContabilitaQueryParams, options: Record<string, any> = {}): Promise<number> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/bollette/count${queryParams}`, { ...options });
        return result.data;
    }

    public async getBolletteToExtract(
        params: ContabilitaQueryParams & ContabilitaPageParams,
        options: Record<string, any> = {}
    ): Promise<ContabilitaBollettaInfo[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/bollette/to-extract${queryParams}`, { ...options });
        return result.data.map((el: ContabilitaBollettaInfo) => this.purgeValue(el));
    }

    public async countBolletteToExtract(
        params: ContabilitaQueryParams,
        options: Record<string, any> = {}
    ): Promise<number> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/bollette/to-extract/count${queryParams}`, {
            ...options
        });
        return result.data;
    }

    public async sendBollette(
        params: ContabilitaQueryParams,
        uuid: string | undefined,
        options: Record<string, any> = {}
    ): Promise<number[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.post(`${this.route}/bollette${queryParams}`, null, {
            ...options,
            headers: {
                location: uuid
            }
        });
        return result.data;
    }

    public async sendBolletteByIds(
        body: number[],
        uuid: string | undefined,
        options: Record<string, any> = {}
    ): Promise<number[]> {
        const result = await this.axiosInstance.post(`${this.route}/bollette/by-ids`, body, {
            ...options,
            headers: {
                location: uuid
            }
        });
        return result.data;
    }

    public async stopBollette(uuid: string | undefined, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.post(`${this.route}/bollette/stop`, null, {
            ...options,
            headers: {
                location: uuid
            }
        });
    }

    public async getStatus(uuid: string): Promise<StatusContabilita | null> {
        const result = await this.axiosInstance.get(`${this.route}/bollette/progress/${uuid}`);
        if (result.data) {
            return result.data;
        }
        return null;
    }
}
