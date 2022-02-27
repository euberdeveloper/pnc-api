import { Domicilio, LuogoDiNascita, Persona, Presidente, Residenza } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type PresidentiCreateBody = Omit<Persona, 'dataCreazione' | 'eliminato'> &
    Omit<Presidente, 'firma' | 'dataCreazione' | 'eliminato'> & { id?: number } & {
        luogoDiNascita: Omit<LuogoDiNascita, 'id'>;
        residenza: Omit<Residenza, 'id'>;
        domicili?: Omit<Domicilio, 'id' | 'idPersona'>[] | null;
    };

export type PresidentiUpdateBody = Partial<Omit<PresidentiCreateBody, 'id'>>;
export interface PresidentiIncludeParams {
    persona?:
        | boolean
        | {
              luogoDiNascita?: boolean;
              residenza?: boolean;
              domicili?: boolean;
          };
}

export type PresidentiReturned = Presidente &
    Persona & {
        luogoDiNascita?: LuogoDiNascita;
        residenza?: Residenza;
        domicili?: Domicilio[];
    };

export class PresidentiController extends BaseController {
    public route = '/presidenti';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    private purgeDates(value: PresidentiReturned): PresidentiReturned {
        value.dataDiNascita = new Date(value.dataDiNascita);
        value.dataInizioMandato = new Date(value.dataInizioMandato);
        value.dataFineMandato = new Date(value.dataFineMandato);
        value.dataCreazione = new Date(value.dataCreazione);
        value.eliminato = value.eliminato === null ? null : new Date(value.eliminato);
        return value;
    }

    public async getAll(
        params: PresidentiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<PresidentiReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data.map((val: PresidentiReturned) => this.purgeDates(val));
    }

    public async get(
        id: number,
        params: PresidentiIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<PresidentiReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return this.purgeDates(result.data);
    }

    public async create(body: PresidentiCreateBody, options: Record<string, any> = {}): Promise<number> {
        const result = await this.axiosInstance.post(`${this.route}`, body, { ...options });
        return result.data;
    }

    public async update(id: number, body: PresidentiUpdateBody, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.patch(`${this.route}/${id}`, body, { ...options });
    }

    public async uploadFirma(id: number, formData: FormData, options: Record<string, any> = {}): Promise<string> {
        const response = await this.axiosInstance.put(`${this.route}/${id}/firma`, formData, { ...options });
        return response.data;
    }

    public async deleteFirma(id: number, options: Record<string, any> = {}): Promise<void> {
        await this.axiosInstance.delete(`${this.route}/${id}/firma`, { ...options });
    }

    public async delete(id: number, options: Record<string, any> = {}): Promise<void> {
        return this.axiosInstance.delete(`${this.route}/${id}`, { ...options });
    }
}
