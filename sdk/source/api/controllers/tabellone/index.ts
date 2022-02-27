import { Tabellone, FilesInfo } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export interface TabelloneQueryParams {
    startDate: Date;
    endDate: Date;
}

export class TabelloneController extends BaseController {
    public route = '/tabellone';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async get(params: TabelloneQueryParams, options: Record<string, any> = {}): Promise<Tabellone[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async getCronology(options: Record<string, any> = {}): Promise<FilesInfo[]> {
        const result = await this.axiosInstance.get(`${this.route}/cronology`, { ...options });
        return result.data;
    }

    public async getTsv(params: TabelloneQueryParams, options: Record<string, any> = {}): Promise<any> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/tsv${queryParams}`, {
            ...options,
            responseType: 'blob'
        });
        return result.data;
    }

    public async getXlsx(params: TabelloneQueryParams, options: Record<string, any> = {}): Promise<any> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/xlsx${queryParams}`, {
            ...options,
            responseType: 'blob'
        });
        return result.data;
    }
}
