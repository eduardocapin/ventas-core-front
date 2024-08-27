export interface Contact {
    id: number;
    internal_id: number;
    customer_ERP_Id: string;
    name: string;
    phone_1: string;
    phone_1_has_AIW: boolean;
    phone_2: string;
    phone_2_has_AIW: boolean;
    email: string;
    insert_date: string;
    update_date: string;
    deleted: boolean;
    has_AIW: boolean;
    contact_order_copy: boolean;
    has_unvalued_order: boolean;
}