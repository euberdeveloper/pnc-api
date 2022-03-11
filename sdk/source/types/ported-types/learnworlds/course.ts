export interface Course {
    id: string;
    title: string;
    description: string | null;
    courseImage: string | null;
    access: string;
    finalPrice: number;
}
