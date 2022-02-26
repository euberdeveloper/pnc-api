import { Student } from '.';

export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student'
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    password: string;
    creationDate: Date;
}

export function instanceOfUser(user: User | Student): user is User {
    return [UserRole.ADMIN, UserRole.TEACHER].includes(user.role);
}
