/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';

import CONFIG from '@/config';

interface LearnWorldsServiceOptions {
    learnworlds: typeof CONFIG.LEARNWORLDS;
}

export interface LearnWorldsToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export class LearnWorldsService {
    private readonly host: string;

    constructor(private readonly options: LearnWorldsServiceOptions) {
        this.host = this.options.learnworlds.API_ENDPOINT;
    }

    private async getToken(): Promise<LearnWorldsToken> {
        return axios
            .post(
                `${this.host}/oauth2/access_token`,
                {
                    client_id: this.options.learnworlds.CLIENT_ID,
                    client_secret: this.options.learnworlds.CLIENT_SECRET,
                    grant_type: this.options.learnworlds.GRANT_TYPE
                },
                { headers: { 'Lw-Client': this.options.learnworlds.CLIENT_ID } }
            )
            .then(response => response.data);
    }
}

export const userService = new LearnWorldsService({
    learnworlds: CONFIG.LEARNWORLDS
});
