import { Log, Utente } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type LogFilters = {
    uid?: string;
    dateFrom?: Date;
    dateTo?: Date;
    method?: string;
};

export type LogReturned = Log & { utente: Utente };

export class LogController extends BaseController {
    public route = '/log';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(filters: LogFilters = {}): Promise<Log[]> {
        const params = this.parseQueryParams(filters);
        const result = await this.axiosInstance.get(`${this.route}${params}`);
        return result.data;
    }
}
