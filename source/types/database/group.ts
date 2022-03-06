export interface Group {
    id: string;
    name: string;
    description: string;
    maxPartecipants: number;
    courseId: string;
    partecipants: string[];
    lecturePeriod: { start: Date; end: Date };
    creationDate: Date;
}
