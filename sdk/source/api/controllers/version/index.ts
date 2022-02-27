import { AxiosContainer, BaseController } from '@/utils/baseController';

export class VersionController extends BaseController {
    public route = '/version';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async get(): Promise<string> {
        const result = await this.axiosInstance.get<string>(`${this.route}`);
        return result.data;
    }
}
