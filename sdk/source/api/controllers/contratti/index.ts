import {
    Bolletta,
    ContoRicavi,
    Contratto,
    ContrattoSuOspite,
    ContrattoSuOspiteSuPostoLetto,
    Fabbricato,
    LuogoDiNascita,
    Ospite,
    Persona,
    PostoLetto,
    Quietanziante,
    Residenza,
    Stanza,
    Tariffa,
    TipoBolletta,
    TipoContratto,
    TipoFabbricato,
    TipoOspite,
    TipoStanza,
    TipoStudente,
    TipoTariffa
} from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';
import { BolletteController } from './bollette';

export * from './bollette';
export type ContrattiCreateBody = Pick<
    Omit<Contratto, 'id'>,
    'dataInizio' | 'dataFine' | 'idQuietanziante' | 'idTariffa' | 'idTipoContratto' | 'tipoRata' | 'note'
> & { id?: number; checkout: boolean; cauzione: boolean } & {
    ospiti: {
        idOspite: number;
        postiLetto: number[];
    }[];
};

export enum ContrattiPDFTypes {
    CONTRATTO,
    CHIUSURA_ANTICIPATA
}

export type ContrattiReplaceBody = Omit<ContrattiCreateBody, 'id'>;

export interface ContrattiDateBody {
    data: Date;
}

export type ContrattiCheckoutBody = ContrattiDateBody & {
    dataConsegnaLasciapassare: Date | null;
    dataConsegnaKit: Date | null;
    note: string | null;
};

export type ContrattiReturned = Contratto & {
    quietanziante?: Quietanziante;
    tariffa?: Tariffa & {
        tipoTariffa?: TipoTariffa;
        utilizzoStanza?: TipoStanza;
        tipoOspite?: TipoOspite & {
            contoRicaviConsumi?: ContoRicavi;
            contoRicaviCanoni?: ContoRicavi;
        };
        tipoFabbricato?: TipoFabbricato;
    };
    tipoContratto?: TipoContratto & {
        tipoStudente?: TipoStudente;
    };
    contrattiSuOspite?: (ContrattoSuOspite & {
        ospite?: Ospite & {
            persona?: Persona & {
                luogoDiNascita?: LuogoDiNascita;
                residenza?: Residenza;
            };
        };
        contrattiSuOspiteSuPostoLetto?: (ContrattoSuOspiteSuPostoLetto & {
            postoLetto?: PostoLetto & {
                stanza?: Stanza & {
                    fabbricato?: Fabbricato;
                };
            };
        })[];
    })[];
    bollette?: (Bolletta & {
        tipoBolletta?: TipoBolletta;
    })[];
};
export interface ContrattiIncludeParams {
    quietanziante?: boolean;
    tariffa?:
        | {
              tipoTariffa?: boolean;
              utilizzoStanza?: boolean;
              tipoOspite?:
                  | {
                        contoRicaviConsumi?: boolean;
                        contoRicaviCanoni?: boolean;
                    }
                  | boolean;
              tipoFabbricato?: boolean;
          }
        | boolean;
    tipoContratto?:
        | {
              tipoStudente?: boolean;
          }
        | boolean;
    contrattiSuOspite?:
        | {
              ospite?:
                  | {
                        persona?:
                            | {
                                  residenza?: boolean;
                                  luogoDiNascita?: boolean;
                              }
                            | boolean;
                    }
                  | boolean;
              contrattiSuOspiteSuPostoLetto?:
                  | {
                        postoLetto?:
                            | {
                                  stanza?:
                                      | {
                                            fabbricato?: boolean;
                                        }
                                      | boolean;
                              }
                            | boolean;
                    }
                  | boolean;
          }
        | boolean;
    bollette?:
        | {
              tipoBolletta?: boolean;
          }
        | boolean;
}
export interface ContrattiFilterParams {
    dataInizio?: Date;
    dataFine?: Date;
    idOspite?: number;
    hasQuietanziante?: boolean;
}

export class ContrattiController extends BaseController {
    public route = '/contratti';

    private readonly bolletteCache: Map<number, BolletteController> = new Map();

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public bollette(cid: number): BolletteController {
        if (!this.bolletteCache.has(cid)) {
            const stanzeController = new BolletteController(this.axiosContainer, `${this.route}/${cid}`);
            this.bolletteCache.set(cid, stanzeController);
        }
        return this.bolletteCache.get(cid) as BolletteController;
    }

    private purgeValue(value: ContrattiReturned): ContrattiReturned {
        value.dataInizio = new Date(value.dataInizio);
        value.dataFine = new Date(value.dataFine);
        value.dataFirmaContratto = value.dataFirmaContratto ? new Date(value.dataFirmaContratto) : null;
        value.dataChiusuraAnticipata = value.dataChiusuraAnticipata ? new Date(value.dataChiusuraAnticipata) : null;
        value.dataFirmaChiusuraAnticipata = value.dataFirmaChiusuraAnticipata
            ? new Date(value.dataFirmaChiusuraAnticipata)
            : null;
        value.dataInvioEmail = value.dataInvioEmail ? new Date(value.dataInvioEmail) : null;
        value.dataRispostaEmail = value.dataRispostaEmail ? new Date(value.dataRispostaEmail) : null;
        value.dataInserimento = new Date(value.dataInserimento);

        if (value.contrattiSuOspite) {
            for (const contrattoSuOspite of value.contrattiSuOspite) {
                contrattoSuOspite.dataCheckin = contrattoSuOspite.dataCheckin
                    ? new Date(contrattoSuOspite.dataCheckin)
                    : null;
                contrattoSuOspite.dataCheckout = contrattoSuOspite.dataCheckout
                    ? new Date(contrattoSuOspite.dataCheckout)
                    : null;
                contrattoSuOspite.dataConsegnaKit = contrattoSuOspite.dataConsegnaKit
                    ? new Date(contrattoSuOspite.dataConsegnaKit)
                    : null;
                contrattoSuOspite.dataConsegnaLasciapassare = contrattoSuOspite.dataConsegnaLasciapassare
                    ? new Date(contrattoSuOspite.dataConsegnaLasciapassare)
                    : null;
            }
        }

        return value;
    }

    public async getAll(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getDaFirmare(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/da-firmare${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getDaFirmareChiusura(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/da-firmare-chiusura${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getDaVisionare(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/da-visionare${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getFirmati(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/firmati${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getFuturi(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/futuri${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getAttivi(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/attivi${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async getTerminati(
        params: ContrattiIncludeParams & ContrattiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/terminati${queryParams}`, { ...options });
        return result.data.map((o: ContrattiReturned) => this.purgeValue(o));
    }

    public async get(
        id: number,
        params: ContrattiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return this.purgeValue(result.data);
    }

    public async getByToken(
        token: string,
        params: ContrattiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<ContrattiReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/token/${token}${queryParams}`, { ...options });
        return this.purgeValue(result.data);
    }

    public async create(body: ContrattiCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async replace(id: number, body: ContrattiReplaceBody, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.put(`${this.route}/${id}`, body, { ...options });
    }

    public async chiudiAnticipatamente(
        id: number,
        body: ContrattiDateBody,
        options: Record<string, any> = {}
    ): Promise<void> {
        await this.axiosInstance.post(`${this.route}/${id}/chiusura-anticipata`, body, { ...options });
    }

    public async uploadFirma(
        id: number,
        formData: FormData,
        type: ContrattiPDFTypes,
        options: Record<string, any> = {}
    ): Promise<void> {
        const path = type === ContrattiPDFTypes.CHIUSURA_ANTICIPATA ? 'firma-chiusura-anticipata' : 'firma';
        await this.axiosInstance.post(`${this.route}/${id}/${path}`, formData, { ...options });
    }

    public async sendEmailFirma(
        id: number,
        type: ContrattiPDFTypes,
        lang?: string,
        options: Record<string, any> = {}
    ): Promise<void> {
        const queryParams = lang ? this.parseQueryParams({ lang }) : '';
        const path = type === ContrattiPDFTypes.CHIUSURA_ANTICIPATA ? 'email-firma-chiusura-anticipata' : 'email-firma';
        await this.axiosInstance.post(`${this.route}/${id}/${path}${queryParams}`, null, { ...options });
    }

    public async uploadFirmaFromEmail(
        token: string,
        formData: FormData,
        type: ContrattiPDFTypes,
        options: Record<string, any> = {}
    ): Promise<void> {
        const path = type === ContrattiPDFTypes.CHIUSURA_ANTICIPATA ? 'email-firma-chiusura-anticipata' : 'email-firma';
        await this.axiosInstance.post(`${this.route}/token/${token}/${path}`, formData, { ...options });
    }

    public async answerFirmaFromEmail(
        id: number,
        body: { accettato: boolean },
        type: ContrattiPDFTypes,
        options: Record<string, any> = {}
    ): Promise<void> {
        const path = type === ContrattiPDFTypes.CHIUSURA_ANTICIPATA ? 'email-firma-chiusura-anticipata' : 'email-firma';
        await this.axiosInstance.post(`${this.route}/${id}/${path}/risposta`, body, { ...options });
    }

    public async addCheckIn(
        id: number,
        oid: number,
        body: ContrattiDateBody,
        options: Record<string, any> = {}
    ): Promise<void> {
        await this.axiosInstance.post(`${this.route}/${id}/ospiti/${oid}/check-in`, body, { ...options });
    }

    public async addCheckOut(
        id: number,
        oid: number,
        body: ContrattiCheckoutBody,
        options: Record<string, any> = {}
    ): Promise<void> {
        await this.axiosInstance.post(`${this.route}/${id}/ospiti/${oid}/check-out`, body, { ...options });
    }

    public async deleteCheckIn(id: number, oid: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/${id}/ospiti/${oid}/check-in`, { ...options });
    }

    public async deleteCheckOut(id: number, oid: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/${id}/ospiti/${oid}/check-out`, { ...options });
    }

    public async postPdfQuestura(id: number, oid: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.post(`${this.route}/${id}/ospiti/${oid}/pdf-questura`, null, {
            ...options
        });
    }

    public async getPdfQuestura(id: number, oid: number, options: Record<string, any> = {}): Promise<string> {
        const response = await this.axiosInstance.get(`${this.route}/${id}/ospiti/${oid}/pdf-questura`, { ...options });
        return response.data;
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }

    public async getPdf(
        id: number,
        type: ContrattiPDFTypes,
        lang?: string,
        options: Record<string, any> = {}
    ): Promise<any> {
        const queryParams = lang ? this.parseQueryParams({ lang }) : '';

        const pdfTypePath =
            type === ContrattiPDFTypes.CHIUSURA_ANTICIPATA ? 'pdf-chiusura-anticipata' : 'pdf-contratto';
        const result = await this.axiosInstance.get(`${this.route}/${id}/${pdfTypePath}${queryParams}`, {
            ...options,
            responseType: 'blob'
        });
        return result.data;
    }
}
