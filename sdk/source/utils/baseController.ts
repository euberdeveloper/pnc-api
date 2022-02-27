import { AxiosInstance } from 'axios';
import { encode } from 'queryencoder';

export interface AxiosContainer {
    axiosInstance: AxiosInstance;
}
export abstract class BaseController {
    protected abstract route: string;

    constructor(protected axiosContainer: AxiosContainer) {}

    protected get axiosInstance(): AxiosInstance {
        return this.axiosContainer.axiosInstance;
    }

    protected parseQueryParams(params: any): string {
        return encode(params);
    }
}
