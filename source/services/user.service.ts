import { databaseService, authService } from '@/services';
import { User, UserRole } from '@/types';
import CONFIG from '@/config';
import { BaseService } from './base.service';
import { UserNotAuthorizedError } from '@/errors';

interface UserServiceOptions {
    jwtOptions: typeof CONFIG.SECURITY.JWT;
}

export class UserService extends BaseService {
    constructor(
        private readonly options: UserServiceOptions,
        private readonly db = databaseService,
        private readonly auth = authService
    ) {
        super();
    }

    public async getAll(): Promise<User[]> {
        return this.db.userModel.find();
    }

    public async deleteById(authorizingUser: User, id: any): Promise<void> {
        const handledId = this.validateRequiredParam(id);

        if (authorizingUser.role !== UserRole.ADMIN || authorizingUser.id !== handledId) {
            throw new UserNotAuthorizedError('A non-admin user is authorized just to delete himself');
        }

        await this.db.userModel.findByIdAndDelete(handledId);
    }

    public async deleteByUsername(authorizingUser: User, username: any): Promise<void> {
        const handledUsername = this.validateRequiredParam(username);

        if (authorizingUser.role !== UserRole.ADMIN || authorizingUser.username !== handledUsername) {
            throw new UserNotAuthorizedError('A non-admin user is authorized just to delete himself');
        }

        await this.db.userModel.deleteOne({ username: handledUsername });
    }
}

export const userService = new UserService({
    jwtOptions: CONFIG.SECURITY.JWT
});
