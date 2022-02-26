/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import logger from 'euberlog';

import { Course, Student, UserRole } from '@/types';
import CONFIG from '@/config';

interface LearnWorldsServiceOptions {
    learnworlds: typeof CONFIG.LEARNWORLDS;
}

interface LearnWorldsApiResponse {
    [key: string]: any;
    errors: any[];
    success: boolean;
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

    private async getHeaders() {
        const token = await this.getToken();
        return {
            'Lw-Client': this.options.learnworlds.CLIENT_ID,
            'Authorization': `Bearer ${token.access_token}`
        };
    }

    private async getToken(): Promise<LearnWorldsToken> {
        const response = await axios.post<LearnWorldsApiResponse>(
            `${this.host}/oauth2/access_token`,
            {
                client_id: this.options.learnworlds.CLIENT_ID,
                client_secret: this.options.learnworlds.CLIENT_SECRET,
                grant_type: this.options.learnworlds.GRANT_TYPE
            },
            { headers: { 'Lw-Client': this.options.learnworlds.CLIENT_ID } }
        );

        if (!response.data.success) {
            logger.warning('Failed to get LearnWorlds token', response.data.errors);
            throw new Error(response.data.errors[0]?.message ?? 'Failed to get LearnWorlds token');
        }

        return response.data.tokenData;
    }

    public async getCourses(): Promise<Course[]> {
        const response = await axios.get(`${this.host}/v2/courses`, { headers: await this.getHeaders() });
        return response.data.data;
    }

    public async getStudent(id: string): Promise<Student | null> {
        const response = await axios.get(`${this.host}/v2/users/${id}`, { headers: await this.getHeaders() });
        return { ...response.data, role: UserRole.STUDENT };
    }
}

export const learnWorldsService = new LearnWorldsService({
    learnworlds: CONFIG.LEARNWORLDS
});
