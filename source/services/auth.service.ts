import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import logger from 'euberlog';

import { databaseService } from '@/services';
import { InvalidCredentialsError, UserNotAuthenticatedError } from '@/errors';
import { Student, User, UserRole } from '@/types';
import CONFIG from '@/config';
import { learnWorldsService } from './learnworlds.service';

interface AuthServiceOptions {
    jwtOptions: typeof CONFIG.SECURITY.JWT;
    saltRounds: typeof CONFIG.SECURITY.SALT_ROUNDS;
    pncApi: typeof CONFIG.SECURITY.PNC_API;
}

export interface SerializedUser {
    id: string;
    role: UserRole;
}

export interface AuthUserResponse {
    token: string;
    user: Omit<User, 'password'>;
}

export interface AuthStudentResponse {
    token: string;
    user: Student;
}

export class AuthService {
    constructor(
        private readonly options: AuthServiceOptions,
        private readonly db = databaseService,
        private readonly learnWorlds = learnWorldsService
    ) {}

    private async findById(id: string): Promise<User | null> {
        return this.db.userModel.findById(id);
    }
    private async findByUsername(username: string): Promise<User | null> {
        return this.db.userModel.findOne({ username });
    }
    private generateToken(user: User | Student): string {
        const subject = user.id;
        return jwt.sign({ role: user.role }, this.options.jwtOptions.PRIVATE_PASSWORD, {
            algorithm: this.options.jwtOptions.ALGORITHM as jwt.Algorithm,
            expiresIn: this.options.jwtOptions.EXPIRATION,
            issuer: this.options.jwtOptions.ISSUER,
            subject
        });
    }
    public async verifyUsernameAndPassword(username: string, password: string): Promise<User> {
        const user = await this.findByUsername(username);
        if (user === null) {
            logger.warning('Error in verifying username and password: wrong username');
            throw new InvalidCredentialsError('Wrong username or password');
        }
        const rightPassword = await bcrypt.compare(password, user.password);
        if (!rightPassword) {
            logger.warning('Error in verifying username and password: wrong password');
            throw new InvalidCredentialsError('Wrong username or password');
        }
        return user;
    }

    public async verifyUserWithJwt(jwtPayload: any): Promise<User> {
        const id: string | null = jwtPayload?.sub;
        if (id === null) {
            logger.warning('Error in verifying user with jwt: subject is null');
            throw new InvalidCredentialsError('Invalid token: subject is null');
        }
        const user = await this.findById(id);
        if (user === null) {
            logger.warning('Error in verifying user with jwt: user not found', id);
            throw new InvalidCredentialsError('Invalid token: user is not found');
        }
        return user;
    }

    public async verifyUserWithToken(token: string | null, studentId: string): Promise<boolean> {
        if (token !== this.options.pncApi.TOKEN) {
            logger.warning('Error in verifying user with token: invalid access token');
            throw new InvalidCredentialsError('Invalid access token');
        }

        const student = await this.learnWorlds.getStudent(studentId);
        if (!student) {
            logger.warning('Error in verifying user with token: student not found');
            throw new InvalidCredentialsError('Student of learn worlds not found');
        }

        return true;
    }

    public generateAuthUserResponse(user: User): AuthUserResponse {
        const token = this.generateToken(user);

        const response: AuthUserResponse = {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                creationDate: user.creationDate
            }
        };

        return response;
    }

    public generateAuthStudentResponse(user: Student): AuthStudentResponse {
        const token = this.generateToken(user);

        const response: AuthStudentResponse = {
            token,
            user
        };

        return response;
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.options.saltRounds);
    }

    public serializeUser(user: User | Student): SerializedUser {
        return { id: user.id, role: user.role };
    }

    public async deserializeUser(serializedUser: SerializedUser): Promise<User | Student> {
        try {
            const user =
                serializedUser.role === UserRole.STUDENT
                    ? await this.learnWorlds.getStudent(serializedUser.id)
                    : await this.findById(serializedUser.id);
            if (user === null) {
                logger.warning('Error in deserializing user: user not found', user);
                throw new UserNotAuthenticatedError('User subject in jwt not found');
            }
            return user;
        } catch (error) {
            logger.warning('Error in deserializing user', error);
            throw error;
        }
    }
}

export const authService = new AuthService({
    jwtOptions: CONFIG.SECURITY.JWT,
    saltRounds: CONFIG.SECURITY.SALT_ROUNDS,
    pncApi: CONFIG.SECURITY.PNC_API
});
