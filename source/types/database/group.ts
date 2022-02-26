import { Course } from '@/types';

export interface Group {
    id: string;
    name: string;
    description: string;
    maxPartecipants: number;
    courseId: string;
    creationDate: Date;
    course?: Course;
}
