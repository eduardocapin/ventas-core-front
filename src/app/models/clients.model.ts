export interface IClient {
    id: number;
    internal_id: string;
    customer_ERP_id: String;
    cif: string;
    name: string;
    tax_name: string;
    province: string;
    city: string;
    address: string;
    phone_1: string;
    phone_2: string;
    pc: number;
    email: string;
    deleted: boolean;
    segmentation_1: number;
    segmentation_2: number;
    segmentation_3: number;
    credit: number;
    insert_date: string;
    update_date: string;
    descripcion_s1: string;
    descripcion_s2: string;
    descripcion_s3: string;
    nsegmentacion_1: string;
    nsegmentacion_2: string;
    nsegmentacion_3: string;
    longitude: number;
    latitude: number;
   
}