export interface TimeRange {
    from: string;
    to: string;
}

export interface WeekSchedule {
    monday: TimeRange | null;
    tuesday: TimeRange | null;
    wednesday: TimeRange | null;
    thursday: TimeRange | null;
    friday: TimeRange | null;
    saturday: TimeRange | null;
    sunday: TimeRange | null;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    maxPartecipants: number;
    courseId: string;
    partecipants: string[];
    lecturePeriod: { start: Date; end: Date };
    weekSchedule: WeekSchedule;
    creationDate: Date;
}
