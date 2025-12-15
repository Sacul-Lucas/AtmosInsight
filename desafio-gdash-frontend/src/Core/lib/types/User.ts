export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    password?: string;
    createdAt?: string;
    updatedAt?: string;
}