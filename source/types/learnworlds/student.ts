import { User, UserRole } from '@/types';

export interface Student {
    id: string;
    email: string;
    username: string;
    is_admin: boolean;
    is_instructor: boolean;
    is_affiliate: boolean;
    courseImage: string;
    access: string;
    final_price: number;
    role: UserRole;
}

export function instanceOfStudent(user: User | Student): user is Student {
    return [UserRole.STUDENT].includes(user.role);
}
