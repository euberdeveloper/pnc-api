import { PostiLettoIncludeParams, PostiLettoReturned } from '@/api';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export class PostiLettoController extends BaseController {
    public route = '/posti-letto';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async getAll(
        params: PostiLettoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<PostiLettoReturned[]> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}${queryParams}`, { ...options });
        return result.data;
    }

    public async get(
        id: number,
        params: PostiLettoIncludeParams = {},
        options: Record<string, any> = {}
    ): Promise<PostiLettoReturned> {
        const queryParams = this.parseQueryParams(params);
        const result = await this.axiosInstance.get(`${this.route}/${id}${queryParams}`, { ...options });
        return result.data;
    }
}
