import { Utente } from '@/db-types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export interface AuthLoginBody {
    username: string;
    password: string;
}
export interface AuthLoginResponse {
    token: string;
    user: Pick<Utente, 'uid' | 'nomeUtente' | 'email' | 'ruolo' | 'dataCreazione'>;
}

export class AuthController extends BaseController {
    public route = '/auth';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async login(body: AuthLoginBody, options: Record<string, any> = {}): Promise<AuthLoginResponse> {
        const result = await this.axiosInstance.post(`${this.route}/login`, body, { ...options });
        return result.data;
    }
}
