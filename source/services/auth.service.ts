import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import logger from 'euberlog';

import { databaseService } from '@/services';
import { InvalidCredentialsError, NotFoundError } from '@/errors';
import { User } from '@/types';
import CONFIG from '@/config';

interface AuthServiceOptions {
    jwtOptions: typeof CONFIG.SECURITY.JWT;
    saltRounds: typeof CONFIG.SECURITY.SALT_ROUNDS;
}

export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
}

export class AuthService {
    constructor(private readonly options: AuthServiceOptions, private readonly dbService = databaseService) {}

    private async findById(id: string): Promise<User | null> {
        return this.dbService.userModel.findById(id);
    }
    private async findByUsername(username: string): Promise<User | null> {
        return this.dbService.userModel.findOne({ username });
    }
    public async verifyUsernameAndPassword(username: string, password: string): Promise<User> {
        const user = await this.findByUsername(username);
        if (user === null) {
            throw new InvalidCredentialsError('Wrong username or password');
        }
        const rightPassword = await bcrypt.compare(password, user.password);
        if (!rightPassword) {
            throw new InvalidCredentialsError('Wrong username or password');
        }
        return user;
    }

    public async verifyUserWithJwt(jwtPayload: any): Promise<User> {
        const id: string | null = jwtPayload?.sub;
        if (id === null) {
            throw new InvalidCredentialsError('Invalid token: subject is null');
        }
        const user = await this.findById(id);
        if (user === null) {
            throw new InvalidCredentialsError('Invalid token');
        }
        return user;
    }

    public generateAuthResponse(user: User): AuthResponse {
        const subject = user.id;
        const token = jwt.sign({ role: user.role }, this.options.jwtOptions.PRIVATE_PASSWORD, {
            algorithm: this.options.jwtOptions.ALGORITHM as jwt.Algorithm,
            expiresIn: this.options.jwtOptions.EXPIRATION,
            issuer: this.options.jwtOptions.ISSUER,
            subject
        });

        const response: AuthResponse = {
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

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.options.saltRounds);
    }

    public serializeUser(user: User): string {
        return user.id;
    }

    public async deserializeUser(uid: string): Promise<User> {
        try {
            const utente = await this.findById(uid);
            if (utente === null) {
                throw new NotFoundError('User with uid not found');
            }
            return utente;
        } catch (error) {
            logger.warning('Error in deserializing user', error);
            throw error;
        }
    }
}

export const authService = new AuthService({
    jwtOptions: CONFIG.SECURITY.JWT,
    saltRounds: CONFIG.SECURITY.SALT_ROUNDS
});
