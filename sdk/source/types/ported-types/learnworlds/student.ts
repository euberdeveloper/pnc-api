import { User, UserRole } from '@/types';

export interface Student {
    id: string;
    email: string;
    username: string;
    isAdmin: boolean;
    isInstructor: boolean;
    isAffiliate: boolean;
    role: UserRole;
}

export function instanceOfStudent(user: User | Student): user is Student {
    return [UserRole.STUDENT].includes(user.role);
}
