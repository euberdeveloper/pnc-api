import { Student, User } from '@/types';
import { AxiosContainer, BaseController } from '@/utils/baseController';

export type LoginUserResult = {
    token: string;
    user: Omit<User, 'password'>;
};

export type LoginStudentResult = {
    token: string;
    user: Student;
};

export class AuthController extends BaseController {
    public route = '/auth';

    constructor(axiosContainer: AxiosContainer) {
        super(axiosContainer);
    }

    public async loginUser(
        username: string,
        password: string,
        options: Record<string, any> = {}
    ): Promise<LoginUserResult> {
        const result = await this.axiosInstance.post(
            `${this.route}/login/user`,
            { username, password },
            { ...options }
        );
        return result.data;
    }

    public async loginStudent(
        accessToken: string,
        studentId: string,
        options: Record<string, any> = {}
    ): Promise<LoginStudentResult> {
        const result = await this.axiosInstance.post(
            `${this.route}/login/student`,
            { studentId },
            { ...options, headers: { authorization: `Bearer ${accessToken}` } }
        );
        return result.data;
    }
}
