import { databaseService, authService } from '@/services';
import { User, UserRole } from '@/types';
import CONFIG from '@/config';
import { NotFoundError, UserNotAuthorizedError } from '@/errors';

interface UserServiceOptions {
    jwtOptions: typeof CONFIG.SECURITY.JWT;
}

export class UserService {
    constructor(
        private readonly options: UserServiceOptions,
        private readonly db = databaseService,
        private readonly auth = authService
    ) {}

    public async getAll(): Promise<User[]> {
        return this.db.userModel.find();
    }

    public async getById(id: string): Promise<User> {
        const user = await this.db.userModel.findById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    public async getByUsername(username: string): Promise<User> {
        const user = await this.db.userModel.findOne({ username });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    public async create(body: Omit<User, 'id' | 'creationDate'>): Promise<string> {
        // TODO: fix this.auth is undefined
        body.password = await authService.hashPassword(body.password);
        const user = new this.db.userModel(body);
        await user.save();
        return user.id;
    }

    public async deleteById(authorizingUser: User, id: string): Promise<void> {
        if (authorizingUser.role !== UserRole.ADMIN || authorizingUser.id !== id) {
            throw new UserNotAuthorizedError('A non-admin user is authorized just to delete himself');
        }

        await this.db.userModel.findByIdAndDelete(id);
    }

    public async deleteByUsername(authorizingUser: User, username: string): Promise<void> {
        if (authorizingUser.role !== UserRole.ADMIN || authorizingUser.username !== username) {
            throw new UserNotAuthorizedError('A non-admin user is authorized just to delete himself');
        }

        await this.db.userModel.deleteOne({ username });
    }
}

export const userService = new UserService({
    jwtOptions: CONFIG.SECURITY.JWT
});
