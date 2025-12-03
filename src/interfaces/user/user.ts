export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    cellphone: string;
}


export interface UserShort {
    firstName: string;
    lastName: string;
    email: string;
}