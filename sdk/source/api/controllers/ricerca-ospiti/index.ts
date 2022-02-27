import { AxiosContainer, BaseController } from '@/utils/baseController';
import {
    Ospite,
    Persona,
    ContrattoSuOspite,
    Contratto,
    ContrattoSuOspiteSuPostoLetto,
    PostoLetto,
    Stanza,
    Fabbricato
} from '@/db-types';

export type RicercaOspitiResult = {
    id: number;
    nome: string;
    cognome: string;
};

export type ContrattoSuOspiteReturned = ContrattoSuOspite & {
    contratto?: Contratto;
    ospite?: Ospite & { persona?: Persona };
};

export type PersonaReturned = Persona & {
    ospite?: (Ospite & {
        contrattiSuOspite?: (ContrattoSuOspite & {
            contratto?: Contratto;
            contrattiSuOspiteSuPostoLetto?: (ContrattoSuOspiteSuPostoLetto & {
                postoLetto?: PostoLetto & {
                    stanza?: Stanza & {
                        fabbricato?: Fabbricato;
                    };
                };
            })[];
        })[];
    })[];
};

export type CheckOutReturnedObjects = {
    lasciapassare?: boolean;
    kit?: boolean;
};

export class RicercaOspitiController extends BaseController {
    public route = '/ricerca-ospiti';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async search(query: string, options: Record<string, any> = {}): Promise<RicercaOspitiResult[]> {
        const result = await this.axiosInstance.get(`${this.route}/search?query=${query}`, { ...options });
        return result.data;
    }

    public async getId(id: number, options: Record<string, any> = {}): Promise<PersonaReturned> {
        const result = await this.axiosInstance.get(`${this.route}/${id}`, { ...options });
        return result.data;
    }

    private getControlliDateParams(dataInizio: Date, dataFine: Date): string {
        return `dataInizio=${dataInizio.toISOString().split('T')[0]}&dataFine=${dataFine.toISOString().split('T')[0]}`;
    }

    public async controlliCheckIn(dataInizio: Date, dataFine: Date): Promise<ContrattoSuOspiteReturned[]> {
        const result = await this.axiosInstance.get(
            `${this.route}/controlli/checkin?${this.getControlliDateParams(dataInizio, dataFine)}`
        );
        return result.data;
    }

    public async controlliCheckOut(dataInizio: Date, dataFine: Date): Promise<ContrattoSuOspiteReturned[]> {
        const result = await this.axiosInstance.get(
            `${this.route}/controlli/checkout?${this.getControlliDateParams(dataInizio, dataFine)}`
        );
        return result.data;
    }

    public async controlliStarts(dataInizio: Date, dataFine: Date): Promise<ContrattoSuOspiteReturned[]> {
        const result = await this.axiosInstance.get(
            `${this.route}/controlli/starts?${this.getControlliDateParams(dataInizio, dataFine)}`
        );
        return result.data;
    }

    public async controlliEnds(dataInizio: Date, dataFine: Date): Promise<ContrattoSuOspiteReturned[]> {
        const result = await this.axiosInstance.get(
            `${this.route}/controlli/ends?${this.getControlliDateParams(dataInizio, dataFine)}`
        );
        return result.data;
    }

    public async checkIn(
        contractId: number,
        ospiteId: number,
        options: Record<string, any> = {}
    ): Promise<{ date: Date | null }> {
        const result = await this.axiosInstance.post(
            `${this.route}/contratto/${contractId}/ospite/${ospiteId}/checkin`,
            {},
            { ...options }
        );
        return result.data;
    }

    public async checkInRemove(
        contractId: number,
        ospiteId: number,
        options: Record<string, any> = {}
    ): Promise<{ date: Date | null }> {
        const result = await this.axiosInstance.delete(
            `${this.route}/contratto/${contractId}/ospite/${ospiteId}/checkin`,
            {
                ...options
            }
        );
        return result.data;
    }

    public async checkOut(
        contractId: number,
        ospiteId: number,
        returnedObjects: CheckOutReturnedObjects = {},
        options: Record<string, any> = {}
    ): Promise<{ date: Date | null }> {
        const result = await this.axiosInstance.post(
            `${this.route}/contratto/${contractId}/ospite/${ospiteId}/checkout`,
            returnedObjects,
            { ...options }
        );
        return result.data;
    }

    public async checkOutRemove(
        contractId: number,
        ospiteId: number,
        options: Record<string, any> = {}
    ): Promise<{ date: Date | null }> {
        const result = await this.axiosInstance.delete(
            `${this.route}/contratto/${contractId}/ospite/${ospiteId}/checkout`,
            {
                ...options
            }
        );
        return result.data;
    }

    public async getPdfQuestura(contractId: number, ospiteId: number, options: Record<string, any> = {}): Promise<any> {
        const result = await this.axiosInstance.get(`${this.route}/contratto/${contractId}/ospite/${ospiteId}/pdf`, {
            ...options,
            responseType: 'blob'
        });
        return result.data;
    }
}
