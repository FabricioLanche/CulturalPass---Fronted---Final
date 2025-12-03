export interface EventRegistrationTokenResponse{
    id: number;
    token: string;
    userName: string;
    userEmail: string;
    eventId: number;
    eventTitle: string;
    eventDate: string;
    validated: boolean;
    createdAt: string;
    validatedAt?: string;
}