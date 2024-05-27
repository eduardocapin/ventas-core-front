export interface User {
    id?: number;
    Username?: string;
    hashed_pwd? : string;
    email?: string;
    es_admin?:boolean;
}