import { Handler } from 'express';

import { UserNotAuthorizedError } from '@/errors';
import { User, UserRole } from '@/types';

export default function (roles: UserRole | UserRole[]): Handler {
    return (req, _res, next) => {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        const user = req.user as User;

        if (!roles.includes(user.role)) {
            throw new UserNotAuthorizedError();
        }

        next();
    };
}
