import { AxiosContainer, BaseController } from '@/utils/baseController';
import { OspitiReturned } from '../ospiti';

export interface ApiUnitnOspitiParams {
    nome: string;
    cognome: string;
}

export class ApiUnitnController extends BaseController {
    public route = '/api-unitn';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    private extractDate(value: string | Date | undefined): Date | undefined {
        if (!value) {
            return undefined;
        }

        if (typeof value === 'string') {
            return new Date(value);
        }

        return value;
    }

    private purgeDates(value: Partial<OspitiReturned>): Partial<OspitiReturned> {
        value.dataDiNascita = this.extractDate(value.dataDiNascita);

        if (value.documentoIdentita?.dataRilascio) {
            value.documentoIdentita.dataRilascio = this.extractDate(value.documentoIdentita.dataRilascio) as Date;
        }
        if (value.documentoIdentita?.dataScadenza) {
            value.documentoIdentita.dataScadenza = this.extractDate(value.documentoIdentita.dataScadenza) as Date;
        }

        return value;
    }

    public async getOspiti(
        params: ApiUnitnOspitiParams,
        options: Record<string, any> = {}
    ): Promise<Partial<OspitiReturned>[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/ospiti${queryParams}`, {
            ...options
        });
        return result.data.map((value: Partial<OspitiReturned>) => this.purgeDates(value));
    }
}
