export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    favorite?: boolean;
    category?: string;
    userId?: string;
    linkedDate?: string; // ISO date 'YYYY-MM-DD' to link note to a specific day
}
