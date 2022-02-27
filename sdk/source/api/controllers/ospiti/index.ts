import {
    ContoCorrente,
    DipartimentoUnitn,
    DocumentoIdentita,
    Domicilio,
    LuogoDiNascita,
    Ospite,
    Persona,
    Residenza
} from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type OspitiCreateBody = Omit<Persona, 'dataCreazione' | 'eliminato'> &
    Omit<Ospite, 'foto' | 'dataRestituzioneCauzione' | 'possiedeCauzione' | 'dataCreazione' | 'eliminato'> & {
        id?: number;
    } & {
        luogoDiNascita: Omit<LuogoDiNascita, 'id'>;
        residenza: Omit<Residenza, 'id'>;
        domicili?: Omit<Domicilio, 'id' | 'idPersona'>[] | null;
        contoCorrente?: Omit<ContoCorrente, 'id'> | null;
        documentoIdentita?: Omit<DocumentoIdentita, 'id' | 'documento'> | null;
    };
export type OspitiUpdateBody = Partial<Omit<OspitiCreateBody, 'id'>>;

export interface OspitiRestituzioneCauzioneBody {
    dataRestituzione: Date;
}

export type OspitiReturned = Ospite &
    Persona & {
        luogoDiNascita?: LuogoDiNascita;
        residenza?: Residenza;
        domicili?: Domicilio[] | null;
        contoCorrente?: ContoCorrente | null;
        documentoIdentita?: DocumentoIdentita | null;
        dipartimentoUnitn?: DipartimentoUnitn | null;
    };

export interface OspitiIncludeParams {
    persona?:
        | boolean
        | {
              luogoDiNascita?: boolean;
              residenza?: boolean;
              domicili?: boolean;
          };
    contoCorrente?: boolean;
    documentoIdentita?: boolean;
    dipartimentoUnitn?: boolean;
}
export interface OspitiOrderByParams {
    orderBy?: {
        id?: number;
        email?: number;
        persona?: {
            nome?: number;
            cognome?: number;
            dataDiNascita?: number;
        };
    };
}
export interface OspitiSearchParams {
    search?: string;
}
export interface OspitiPageParams {
    page?: number;
    pageSize?: number;
}

export interface OspitiFilterParams {
    dataInizio?: Date;
    dataFine?: Date;
}

export class OspitiController extends BaseController {
    public route = '/ospiti';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    private purgeValue(value: OspitiReturned): OspitiReturned {
        value.dataDiNascita = new Date(value.dataDiNascita);
        value.dataRestituzioneCauzione = value.dataRestituzioneCauzione
            ? new Date(value.dataRestituzioneCauzione)
            : null;
        if (value.documentoIdentita) {
            value.documentoIdentita.dataRilascio = new Date(value.documentoIdentita.dataRilascio);
            value.documentoIdentita.dataScadenza = value.documentoIdentita.dataScadenza
                ? new Date(value.documentoIdentita.dataScadenza)
                : null;
        }
        return value;
    }

    public async getAll(
        params: OspitiIncludeParams &
            OspitiOrderByParams &
            OspitiSearchParams &
            OspitiPageParams &
            OspitiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<OspitiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data.map((o: OspitiReturned) => this.purgeValue(o));
    }

    public async count(
        params: OspitiSearchParams & OspitiFilterParams = {},
        options: Record<string, any> = {}
    ): Promise<number> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/count${queryParams}`, { ...options });
        return result.data;
    }

    public async getEmails(options: Record<string, any> = {}): Promise<string[]> {
        const result = await this.axiosInstance.get(`${this.route}/emails`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: OspitiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<OspitiReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return this.purgeValue(result.data);
    }

    public async create(body: OspitiCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async update(id: number, body: OspitiUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async uploadFoto(id: number, formData: FormData, options: Record<string, any> = {}): Promise<string> {
        const response = await this.axiosInstance.put(`${this.route}/${id}/foto`, formData, { ...options });
        return response.data;
    }

    public async uploadDocumento(id: number, formData: FormData, options: Record<string, any> = {}): Promise<string> {
        const response = await this.axiosInstance.put(`${this.route}/${id}/documento`, formData, { ...options });
        return response.data;
    }

    public async restituisciCauzione(
        id: number,
        body: OspitiRestituzioneCauzioneBody,
        options: Record<string, any> = {}
    ): Promise<void> {
        return this.axiosInstance.put(`${this.route}/${id}/restituzione-cauzione`, body, { ...options });
    }

    public async deleteFoto(id: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/${id}/foto`, { ...options });
    }

    public async deleteDocumento(id: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/${id}/documento`, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }
}
