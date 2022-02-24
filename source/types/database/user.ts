export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher'
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    password: string;
    creationDate: Date;
}
