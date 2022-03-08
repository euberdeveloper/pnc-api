/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosError } from 'axios';
import logger from 'euberlog';

import { Course, Student, UserRole } from '@/types';
import CONFIG from '@/config';

export interface LearnWorldsToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface LearnWorldsServiceOptions {
    learnworlds: typeof CONFIG.LEARNWORLDS;
}

interface LearnWorldsTokenResponse {
    [key: string]: any;
    errors: any[];
    success: boolean;
}

interface InternalLearnWorldsToken {
    accessToken: string;
    expires: number;
}

interface LearnWorldsCollectionResponse<T> {
    data: T[];
    meta: {
        page: number;
        totalItems: number;
        totalPages: number;
        itemsPerPage: number;
    };
}

interface LearnWorldsStudentResponse {
    id: string;
    email: string;
    username: string;
    subscribed_for_marketing_emails: boolean | null;
    eu_customer: boolean | null;
    is_admin: boolean;
    is_instructor: boolean;
    is_affiliate: boolean;
    referrer_id: string | null;
    created: number;
    last_login: number | null;
    fields: {
        bio: null;
        location: null;
        url: null;
        fb: null;
        twitter: null;
        instagram: null;
        linkedin: null;
        skype: null;
        behance: null;
        dribbble: null;
        github: null;
        phone: null;
        address: null;
        country: null;
        birthday: null;
        company: null;
        company_size: null;
        university: null;
        graduation_year: null;
        cf_skill: string;
        cf_studentlicence: string;
    };
    tags: string[];
    utms: {
        fc_source: string | null;
        fc_medium: string | null;
        fc_campaign: string;
        fc_term: string | null;
        fc_content: string | null;
        fc_landing: string | null;
        fc_referrer: string | null;
        fc_country: string | null;
        lc_source: string | null;
        lc_medium: string | null;
        lc_campaign: string | null;
        lc_term: string | null;
        lc_content: string | null;
        lc_landing: string | null;
        lc_referrer: string | null;
        lc_country: string | null;
    } | null;
}

interface LearnWorldsCourseResponse {
    id: string;
    title: string;
    expires: number | null;
    expiresType: 'days' | 'weeks' | 'months';
    afterPurchase: {
        type: string;
        settings: {
            page: string | null;
            url: string | null;
        };
    };
    categories: string[];
    description: string | null;
    label: string | null;
    author: {
        name: string;
        image: string | null;
    } | null;
    courseImage: string | null;
    original_price: number;
    discount_price: number;
    final_price: number;
    dripFeed: 'date' | 'days' | 'none';
    identifiers: {
        google_store_id: string;
        apple_store_id: string;
    };
    access: 'paid' | 'free' | 'coming_soon' | 'enrollment_closed' | 'private' | 'draft';
    created: number;
    modified: number;
}

interface LearnWorldsUserCourseResponse {
    created: number;
    expires: number | null;
    course: LearnWorldsCourseResponse;
}

export class LearnWorldsService {
    private readonly host: string;
    private token: InternalLearnWorldsToken | null = null;

    constructor(private readonly options: LearnWorldsServiceOptions) {
        this.host = this.options.learnworlds.API_ENDPOINT;
    }

    private async getHeaders() {
        const token = await this.getToken();
        return {
            'Lw-Client': this.options.learnworlds.CLIENT_ID,
            'Authorization': `Bearer ${token.accessToken}`
        };
    }

    private async getRawToken(): Promise<LearnWorldsToken> {
        const response = await axios.post<LearnWorldsTokenResponse>(
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

    private async getToken(): Promise<InternalLearnWorldsToken> {
        const expiringSecurityMargin = 5000;
        if (this.token === null || this.token.expires < Date.now() - expiringSecurityMargin) {
            const rawToken = await this.getRawToken();
            this.token = { accessToken: rawToken.access_token, expires: Date.now() + rawToken.expires_in * 1000 };
        }

        return this.token;
    }

    private async getCollection<T>(route: string): Promise<T[]> {
        const result: T[] = [];

        let pagesCount = Number.POSITIVE_INFINITY;
        for (let page = 0; page < pagesCount; page++) {
            const response = await axios.get<LearnWorldsCollectionResponse<T>>(`${route}?page=${page + 1}`, {
                headers: await this.getHeaders()
            });
            result.push(...response.data.data);
            pagesCount = response.data.meta.totalPages;
        }

        return result;
    }

    private purgeCourse(course: LearnWorldsCourseResponse): Course {
        return {
            id: course.id,
            title: course.title,
            description: course.description,
            courseImage: course.courseImage,
            access: course.access,
            finalPrice: course.final_price
        };
    }

    private purgeStudent(student: LearnWorldsStudentResponse): Student {
        return {
            id: student.id,
            email: student.email,
            username: student.username,
            isAdmin: student.is_admin,
            isAffiliate: student.is_affiliate,
            isInstructor: student.is_instructor,
            role: UserRole.STUDENT
        };
    }

    public async getCourses(): Promise<Course[]> {
        try {
            const courses = await this.getCollection<LearnWorldsCourseResponse>(`${this.host}/v2/courses`);
            return courses.map(course => this.purgeCourse(course));
        } catch (error) {
            const err = error as AxiosError;
            logger.warning('Failed to get LearnWorlds courses', err.response?.data);
            throw error;
        }
    }

    public async getCourse(id: string): Promise<Course | null> {
        try {
            const response = await axios.get<LearnWorldsCourseResponse>(`${this.host}/v2/courses/${id}`, {
                headers: await this.getHeaders()
            });
            return this.purgeCourse(response.data);
        } catch (error) {
            const err = error as AxiosError;

            if (err.response?.status === 404) {
                return null;
            } else {
                throw error;
            }
        }
    }

    public async getCourseStudents(id: string): Promise<Student[] | null> {
        try {
            const students = await this.getCollection<LearnWorldsStudentResponse>(
                `${this.host}/v2/courses/${id}/users`
            );
            return students.map(student => this.purgeStudent(student));
        } catch (error) {
            const err = error as AxiosError;

            if (err.response?.status === 404) {
                return err.response.data?.error === 'Users not found' ? [] : null;
            } else {
                throw error;
            }
        }
    }

    public async getStudent(id: string): Promise<Student | null> {
        try {
            const response = await axios.get(`${this.host}/v2/users/${id}`, { headers: await this.getHeaders() });
            return this.purgeStudent(response.data);
        } catch (error) {
            const err = error as AxiosError;

            if (err.response?.status === 404) {
                return null;
            } else {
                throw error;
            }
        }
    }

    public async getStudentsCourses(id: string): Promise<Course[] | null> {
        try {
            const courses = await this.getCollection<LearnWorldsCourseResponse>(`${this.host}/v2/users/${id}/courses`);
            return courses.map(course => this.purgeCourse(course));
        } catch (error) {
            const err = error as AxiosError;

            if (err.response?.status === 404) {
                return err.response.data?.error === 'Users not found' ? [] : null;
            } else {
                throw error;
            }
        }
    }

    public async checkIfStudentHasCourse(courseId: string, studentId: string): Promise<boolean> {
        try {
            const courses = await this.getCollection<LearnWorldsUserCourseResponse>(
                `${this.host}/v2/users/${studentId}/courses`
            );
            return courses.some(c => c.course.id === courseId);
        } catch (error) {
            const err = error as AxiosError;

            if (err.response?.status === 404) {
                return false;
            } else {
                throw error;
            }
        }
    }
}

export const learnWorldsService = new LearnWorldsService({
    learnworlds: CONFIG.LEARNWORLDS
});
